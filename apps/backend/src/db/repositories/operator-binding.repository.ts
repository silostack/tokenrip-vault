import { SqlEntityRepository } from '@mikro-orm/postgresql';
import { OperatorBinding } from '../models/OperatorBinding';

export class OperatorBindingRepository extends SqlEntityRepository<OperatorBinding> {}
