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
  type: 'text' | 'number' | 'date' | 'url' | 'enum';
  position: number;
  values?: string[]; // for enum type
}

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
    assetId: string,
    opts: { limit?: number; after?: string } = {},
  ): Promise<{ rows: CollectionRow[]; nextCursor: string | null }> {
    const limit = Math.min(opts.limit ?? 100, 500);

    if (opts.after) {
      if (!uuidValidate(opts.after)) {
        throw new BadRequestException({ ok: false, error: 'INVALID_CURSOR', message: 'Invalid cursor' });
      }
      const cursorRow = await this.rowRepo.findOne({ id: opts.after });
      if (cursorRow) {
        // Composite cursor: rows after this (createdAt, id) pair
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
        const hasMore = rows.length > limit;
        if (hasMore) rows.pop();
        return { rows, nextCursor: hasMore ? rows[rows.length - 1].id : null };
      }
    }

    const rows = await this.rowRepo.find(
      { asset: { id: assetId } },
      { orderBy: { createdAt: 'ASC', id: 'ASC' }, limit: limit + 1 },
    );

    const hasMore = rows.length > limit;
    if (hasMore) rows.pop();

    return {
      rows,
      nextCursor: hasMore ? rows[rows.length - 1].id : null,
    };
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
