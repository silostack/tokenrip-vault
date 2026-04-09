import { SqlEntityRepository } from '@mikro-orm/postgresql';
import { Ref } from '../models/Ref';

export class RefRepository extends SqlEntityRepository<Ref> {}
