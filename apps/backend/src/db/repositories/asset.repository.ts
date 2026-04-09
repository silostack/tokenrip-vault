import { SqlEntityRepository } from '@mikro-orm/postgresql';
import { Asset } from '../models/Asset';

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
  ): Promise<AssetUpdateRow[]> {
    return this.getEntityManager().getConnection().execute<AssetUpdateRow[]>(
      `SELECT
        a.public_id AS asset_id,
        a.title,
        a.updated_at,
        COUNT(av.id)::int AS new_version_count,
        MAX(av.version)::int AS latest_version
      FROM asset a
      JOIN asset_version av ON av.asset_id = a.id AND av.created_at > ?
      WHERE a.owner_id = ?
      GROUP BY a.id
      ORDER BY a.updated_at DESC
      LIMIT ?`,
      [since, ownerId, limit],
    );
  }
}
