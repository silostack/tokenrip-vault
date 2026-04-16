import { SqlEntityRepository } from '@mikro-orm/postgresql';
import { Asset, AssetState } from '../models/Asset';
import type { SearchResult } from '../../api/service/search.service';

export interface AssetUpdateRow {
  asset_id: string;
  title: string | null;
  updated_at: Date;
  new_version_count: number;
  latest_version: number;
}

export class AssetRepository extends SqlEntityRepository<Asset> {
  persistAsset(asset: Asset): void {
    this.getEntityManager().persist(asset);
  }

  /**
   * Aggregation query: assets with new versions since a timestamp for a given owner.
   * Raw SQL because MikroORM lacks cross-table aggregation (JOIN + COUNT + GROUP BY).
   */
  async findAssetUpdatesForOwner(
    ownerId: string,
    since: Date,
    limit: number,
    filters?: { q?: string },
  ): Promise<AssetUpdateRow[]> {
    const conditions = ['a.owner_id = ?', `a.state NOT IN ('${AssetState.DESTROYED}', '${AssetState.ARCHIVED}')`];
    const params: unknown[] = [since, ownerId];

    if (filters?.q) {
      conditions.push('a.title ILIKE ?');
      params.push(`%${filters.q}%`);
    }

    const whereClause = conditions.join(' AND ');

    return this.getEntityManager().getConnection().execute<AssetUpdateRow[]>(
      `SELECT
        a.public_id AS asset_id,
        a.title,
        a.updated_at,
        COUNT(av.id)::int AS new_version_count,
        MAX(av.version)::int AS latest_version
      FROM asset a
      JOIN asset_version av ON av.asset_id = a.id AND av.created_at > ?
      WHERE ${whereClause}
      GROUP BY a.id
      ORDER BY a.updated_at DESC
      LIMIT ?`,
      [...params, limit],
    );
  }

  /**
   * Search assets for a given owner with optional text, date, and type filters.
   * Raw SQL for dynamic WHERE construction and count query.
   */
  async searchAssetsForOwner(
    ownerId: string,
    filters: { q?: string; since?: Date; asset_type?: string; archived?: boolean; includeArchived?: boolean },
  ): Promise<{ rows: SearchResult[]; total: number }> {
    const stateCondition = filters.archived
      ? `a.state = '${AssetState.ARCHIVED}'`
      : filters.includeArchived
        ? `a.state != '${AssetState.DESTROYED}'`
        : `a.state NOT IN ('${AssetState.DESTROYED}', '${AssetState.ARCHIVED}')`;
    const conditions = ['a.owner_id = ?', stateCondition];
    const params: unknown[] = [ownerId];

    if (filters.since) {
      conditions.push('a.updated_at > ?');
      params.push(filters.since);
    }
    if (filters.q) {
      conditions.push('a.title ILIKE ?');
      params.push(`%${filters.q}%`);
    }
    if (filters.asset_type) {
      conditions.push('a.type = ?');
      params.push(filters.asset_type);
    }

    const whereClause = conditions.join(' AND ');

    const countResult = await this.getEntityManager().getConnection().execute(
      `SELECT COUNT(*)::int AS total FROM asset a WHERE ${whereClause}`,
      params,
    );
    const total = countResult[0]?.total ?? 0;

    const rows = await this.getEntityManager().getConnection().execute(
      `SELECT
        a.public_id AS asset_id,
        a.title,
        a.type AS asset_type,
        a.mime_type,
        a.version_count,
        a.updated_at
      FROM asset a
      WHERE ${whereClause}
      ORDER BY a.updated_at DESC`,
      params,
    );

    const results: SearchResult[] = rows.map((r: any) => ({
      type: 'asset' as const,
      id: r.asset_id,
      title: r.title ?? null,
      updated_at: r.updated_at,
      asset: {
        asset_type: r.asset_type,
        version_count: r.version_count,
        mime_type: r.mime_type ?? null,
      },
    }));

    return { rows: results, total };
  }
}
