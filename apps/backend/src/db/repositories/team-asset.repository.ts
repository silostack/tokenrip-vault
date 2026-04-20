import { SqlEntityRepository } from '@mikro-orm/postgresql';
import { TeamAsset } from '../models/TeamAsset';

export interface TeamAssetPublicIdRow {
  public_id: string;
  slug: string;
  name: string;
}

export class TeamAssetRepository extends SqlEntityRepository<TeamAsset> {
  async findTeamsForAssetPublicIds(publicIds: string[]): Promise<TeamAssetPublicIdRow[]> {
    if (publicIds.length === 0) return [];
    const placeholders = publicIds.map(() => '?').join(',');
    return this.getEntityManager().getConnection().execute<TeamAssetPublicIdRow[]>(
      `SELECT a.public_id, t.slug, t.name
       FROM team_asset ta
       JOIN asset a ON a.id = ta.asset_id
       JOIN team t ON t.id = ta.team_id
       WHERE a.public_id IN (${placeholders})`,
      publicIds,
    );
  }
}
