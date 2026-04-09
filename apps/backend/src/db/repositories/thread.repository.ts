import { SqlEntityRepository } from '@mikro-orm/postgresql';
import { Thread } from '../models/Thread';

export class ThreadRepository extends SqlEntityRepository<Thread> {}
