import { SqlEntityRepository } from '@mikro-orm/postgresql';
import { Message } from '../models/Message';

export class MessageRepository extends SqlEntityRepository<Message> {}
