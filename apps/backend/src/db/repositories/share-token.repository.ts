import { SqlEntityRepository } from '@mikro-orm/postgresql';
import { ShareToken } from '../models/ShareToken';

export class ShareTokenRepository extends SqlEntityRepository<ShareToken> {}
