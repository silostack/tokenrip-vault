import { SqlEntityRepository } from '@mikro-orm/postgresql';
import { TeamMembership } from '../models/TeamMembership';

export class TeamMembershipRepository extends SqlEntityRepository<TeamMembership> {
  async countByTeamIds(teamIds: string[]): Promise<Map<string, number>> {
    if (teamIds.length === 0) return new Map();
    const placeholders = teamIds.map(() => '?').join(',');
    const rows = await this.getEntityManager().getConnection().execute<Array<{ team_id: string; cnt: number }>>(
      `SELECT team_id, COUNT(*)::int AS cnt FROM team_membership WHERE team_id IN (${placeholders}) GROUP BY team_id`,
      teamIds,
    );
    const result = new Map<string, number>();
    for (const row of rows) result.set(row.team_id, row.cnt);
    return result;
  }
}
