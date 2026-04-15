import { SqlEntityRepository } from '@mikro-orm/postgresql';
import { CollectionRow } from '../models/CollectionRow';

export class CollectionRowRepository extends SqlEntityRepository<CollectionRow> {}
