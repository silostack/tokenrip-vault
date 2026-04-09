import { SqlEntityRepository } from '@mikro-orm/postgresql';
import { ApiKey } from '../models/ApiKey';

export class ApiKeyRepository extends SqlEntityRepository<ApiKey> {}
