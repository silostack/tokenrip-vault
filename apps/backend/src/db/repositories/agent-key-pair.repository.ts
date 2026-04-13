import { SqlEntityRepository } from '@mikro-orm/postgresql';
import { AgentKeyPair } from '../models/AgentKeyPair';

export class AgentKeyPairRepository extends SqlEntityRepository<AgentKeyPair> {}
