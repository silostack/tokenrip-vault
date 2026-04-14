import { SqlEntityRepository } from '@mikro-orm/postgresql';
import { Contact } from '../models/Contact';

export class ContactRepository extends SqlEntityRepository<Contact> {}
