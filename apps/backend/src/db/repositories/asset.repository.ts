import { SqlEntityRepository } from '@mikro-orm/postgresql';
import { Asset } from '../models/Asset';

export class AssetRepository extends SqlEntityRepository<Asset> {
  persistAsset(asset: Asset): void {
    this.getEntityManager().persist(asset);
  }
}
