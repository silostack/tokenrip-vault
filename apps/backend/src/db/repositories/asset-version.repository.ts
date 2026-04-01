import { SqlEntityRepository } from '@mikro-orm/postgresql';
import { AssetVersion } from '../models/AssetVersion';

export class AssetVersionRepository extends SqlEntityRepository<AssetVersion> {}
