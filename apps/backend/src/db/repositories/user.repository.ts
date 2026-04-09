import { SqlEntityRepository } from '@mikro-orm/postgresql';
import { User } from '../models/User';

export class UserRepository extends SqlEntityRepository<User> {}
