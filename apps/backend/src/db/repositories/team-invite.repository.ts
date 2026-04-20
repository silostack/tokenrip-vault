import { SqlEntityRepository } from '@mikro-orm/postgresql';
import { TeamInvite } from '../models/TeamInvite';

export class TeamInviteRepository extends SqlEntityRepository<TeamInvite> {}
