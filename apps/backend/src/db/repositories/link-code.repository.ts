import { SqlEntityRepository } from '@mikro-orm/postgresql';
import { LinkCode } from '../models/LinkCode';

export class LinkCodeRepository extends SqlEntityRepository<LinkCode> {}
