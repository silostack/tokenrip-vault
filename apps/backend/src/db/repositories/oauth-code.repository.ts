import { SqlEntityRepository } from '@mikro-orm/postgresql';
import { OAuthCode } from '../models/OAuthCode';

export class OAuthCodeRepository extends SqlEntityRepository<OAuthCode> {}
