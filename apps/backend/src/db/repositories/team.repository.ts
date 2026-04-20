import { SqlEntityRepository } from '@mikro-orm/postgresql';
import { Team } from '../models/Team';

export class TeamRepository extends SqlEntityRepository<Team> {}
