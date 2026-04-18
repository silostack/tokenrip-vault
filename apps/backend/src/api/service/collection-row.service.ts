import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { validate as uuidValidate } from 'uuid';
import { Asset, AssetType } from '../../db/models/Asset';
import { CollectionRow } from '../../db/models/CollectionRow';
import { AssetRepository } from '../../db/repositories/asset.repository';
import { CollectionRowRepository } from '../../db/repositories/collection-row.repository';

export interface CollectionSchema {
  name: string;
  type: 'text' | 'number' | 'date' | 'url' | 'enum' | 'boolean';
  position: number;
  values?: string[]; // for enum type
}

const COL_NAME_RE = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
const MAX_ROWS_PER_APPEND = 1000;

@Injectable()
export class CollectionRowService {
  private readonly logger = new Logger(CollectionRowService.name);

  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Asset) private readonly assetRepo: AssetRepository,
    @InjectRepository(CollectionRow) private readonly rowRepo: CollectionRowRepository,
  ) {}

  async appendRows(
    asset: Asset,
    rows: Array<{ data: Record<string, unknown> }>,
    createdBy: string,
  ): Promise<CollectionRow[]> {
    if (!rows.length) {
      throw new BadRequestException({ ok: false, error: 'EMPTY_ROWS', message: 'At least one row is required' });
    }
    if (rows.length > MAX_ROWS_PER_APPEND) {
      throw new BadRequestException({ ok: false, error: 'TOO_MANY_ROWS', message: `Max ${MAX_ROWS_PER_APPEND} rows per call. Split into multiple calls.` });
    }

    return this.em.transactional(async () => {
      await this.lockAndRefreshAsset(asset);

      const created: CollectionRow[] = [];
      for (const row of rows) {
        this.expandSchema(asset, row.data);
        const entity = new CollectionRow(asset, row.data, createdBy);
        this.em.persist(entity);
        created.push(entity);
      }

      return created;
    });
  }

  async getRows(
    asset: Asset,
    opts: {
      limit?: number;
      after?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      filters?: Record<string, string>;
    } = {},
  ): Promise<{ rows: CollectionRow[]; nextCursor: string | null }> {
    const limit = Math.min(opts.limit ?? 100, 500);

    if (!opts.sortBy && (!opts.filters || Object.keys(opts.filters).length === 0)) {
      return this.getRowsSimple(asset.id, limit, opts.after);
    }

    return this.getRowsSorted(asset, limit, opts);
  }

  private async getRowsSimple(
    assetId: string,
    limit: number,
    after?: string,
  ): Promise<{ rows: CollectionRow[]; nextCursor: string | null }> {
    const cursorRow = await this.findCursorRow(after);

    if (cursorRow) {
      const rows = await this.rowRepo.find(
        {
          asset: { id: assetId },
          $or: [
            { createdAt: { $gt: cursorRow.createdAt } },
            { createdAt: cursorRow.createdAt, id: { $gt: cursorRow.id } },
          ],
        },
        { orderBy: { createdAt: 'ASC', id: 'ASC' }, limit: limit + 1 },
      );
      return this.paginate(rows, limit);
    }

    const rows = await this.rowRepo.find(
      { asset: { id: assetId } },
      { orderBy: { createdAt: 'ASC', id: 'ASC' }, limit: limit + 1 },
    );
    return this.paginate(rows, limit);
  }

  /** Raw SQL path for JSONB sort/filter — MikroORM can't express ORDER BY data->>'col' with type casting. */
  private async getRowsSorted(
    asset: Asset,
    limit: number,
    opts: {
      after?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      filters?: Record<string, string>;
    },
  ): Promise<{ rows: CollectionRow[]; nextCursor: string | null }> {
    const params: unknown[] = [asset.id];
    const whereClauses: string[] = ['asset_id = ?'];

    if (opts.filters) {
      for (const [col, val] of Object.entries(opts.filters)) {
        if (!COL_NAME_RE.test(col)) continue;
        whereClauses.push(`data->>'${col}' = ?`);
        params.push(val);
      }
    }

    const cursorRow = await this.findCursorRow(opts.after);
    const schema = this.getSchema(asset);
    const sortDir = (opts.sortOrder ?? 'asc').toUpperCase();
    let sortExpr = 'created_at';

    if (opts.sortBy && COL_NAME_RE.test(opts.sortBy)) {
      const colDef = schema.find((c) => c.name === opts.sortBy);
      const colType = colDef?.type;
      const rawExpr = `data->>'${opts.sortBy}'`;

      if (colType === 'number') {
        // {0,1} instead of ? — MikroORM treats ? as a parameter placeholder
        sortExpr = `CASE WHEN ${rawExpr} ~ '^-{0,1}[0-9]+([.][0-9]+){0,1}$' THEN (${rawExpr})::numeric ELSE NULL END`;
      } else if (colType === 'date') {
        sortExpr = `CASE WHEN ${rawExpr} ~ '^[0-9][0-9][0-9][0-9]-' THEN (${rawExpr})::timestamptz ELSE NULL END`;
      } else if (colType === 'boolean') {
        sortExpr = `CASE WHEN LOWER(${rawExpr}) IN ('true','false') THEN (LOWER(${rawExpr}))::boolean ELSE NULL END`;
      } else {
        sortExpr = rawExpr;
      }
    }

    // Cursor keyset condition
    if (cursorRow) {
      if (opts.sortBy && COL_NAME_RE.test(opts.sortBy)) {
        const cursorSortVal = cursorRow.data[opts.sortBy] ?? null;
        const comp = sortDir === 'DESC' ? '<' : '>';

        if (cursorSortVal == null) {
          whereClauses.push(
            `(${sortExpr} IS NULL AND (created_at > ? OR (created_at = ? AND id > ?)))`,
          );
          params.push(cursorRow.createdAt, cursorRow.createdAt, cursorRow.id);
        } else {
          whereClauses.push(
            `(${sortExpr} ${comp} ? OR (${sortExpr} = ? AND (created_at > ? OR (created_at = ? AND id > ?))) OR ${sortExpr} IS NULL)`,
          );
          params.push(cursorSortVal, cursorSortVal, cursorRow.createdAt, cursorRow.createdAt, cursorRow.id);
        }
      } else {
        whereClauses.push('(created_at > ? OR (created_at = ? AND id > ?))');
        params.push(cursorRow.createdAt, cursorRow.createdAt, cursorRow.id);
      }
    }

    params.push(limit + 1);

    const sql = `
      SELECT * FROM collection_row
      WHERE ${whereClauses.join(' AND ')}
      ORDER BY ${sortExpr} ${sortDir} NULLS LAST, created_at ASC, id ASC
      LIMIT ?
    `;

    const rawRows = await this.em.getConnection().execute(sql, params);

    const rows: CollectionRow[] = rawRows.map((r: any) => {
      const row = new CollectionRow(asset, r.data, r.created_by);
      row.id = r.id;
      row.createdAt = new Date(r.created_at);
      row.updatedAt = new Date(r.updated_at);
      return row;
    });

    return this.paginate(rows, limit);
  }

  async updateRow(
    assetId: string,
    rowId: string,
    data: Record<string, unknown>,
  ): Promise<CollectionRow> {
    if (!uuidValidate(rowId)) {
      throw new NotFoundException({ ok: false, error: 'NOT_FOUND', message: 'Row not found' });
    }

    return this.em.transactional(async () => {
      const row = await this.rowRepo.findOne({ id: rowId, asset: { id: assetId } });
      if (!row) {
        throw new NotFoundException({ ok: false, error: 'NOT_FOUND', message: 'Row not found' });
      }

      const asset = await this.assetRepo.findOneOrFail({ id: assetId });
      await this.lockAndRefreshAsset(asset);
      this.expandSchema(asset, data);

      row.data = { ...row.data, ...data };
      return row;
    });
  }

  async deleteRows(assetId: string, ids: string[]): Promise<void> {
    if (!ids.length) return;
    for (const id of ids) {
      if (!uuidValidate(id)) {
        throw new BadRequestException({ ok: false, error: 'INVALID_ID', message: `Invalid row ID: ${id}` });
      }
    }

    const count = await this.rowRepo.nativeDelete({
      id: { $in: ids },
      asset: { id: assetId },
    });

    this.logger.debug(`Deleted ${count} rows from asset ${assetId}`);
  }

  private async findCursorRow(after?: string): Promise<CollectionRow | null> {
    if (!after) return null;
    if (!uuidValidate(after)) {
      throw new BadRequestException({ ok: false, error: 'INVALID_CURSOR', message: 'Invalid cursor' });
    }
    return this.rowRepo.findOne({ id: after });
  }

  private paginate(rows: CollectionRow[], limit: number): { rows: CollectionRow[]; nextCursor: string | null } {
    const hasMore = rows.length > limit;
    if (hasMore) rows.pop();
    return { rows, nextCursor: hasMore ? rows[rows.length - 1].id : null };
  }

  /** Lock the asset row (FOR UPDATE) and refresh to get latest metadata. */
  private async lockAndRefreshAsset(asset: Asset): Promise<void> {
    await this.em.getConnection().execute(
      `SELECT 1 FROM "asset" WHERE "id" = ? FOR UPDATE`,
      [asset.id],
    );
    await this.em.refresh(asset);
  }

  /** Add any unknown keys in `data` to the asset's schema as text columns. Mutates asset.metadata in place. */
  private expandSchema(asset: Asset, data: Record<string, unknown>): void {
    const schema = this.getSchema(asset);
    let changed = false;

    for (const key of Object.keys(data)) {
      if (!schema.find((col) => col.name === key)) {
        schema.push({ name: key, type: 'text', position: schema.length });
        changed = true;
      }
    }

    if (changed) {
      asset.metadata = { ...asset.metadata, schema };
    }
  }

  private getSchema(asset: Asset): CollectionSchema[] {
    const metadata = asset.metadata as Record<string, unknown> | undefined;
    return ((metadata?.schema as CollectionSchema[]) ?? []).map((col) => ({ ...col }));
  }
}
