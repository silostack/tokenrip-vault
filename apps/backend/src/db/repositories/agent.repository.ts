import { SqlEntityRepository } from '@mikro-orm/postgresql';
import { Agent } from '../models/Agent';

export class AgentRepository extends SqlEntityRepository<Agent> {}
