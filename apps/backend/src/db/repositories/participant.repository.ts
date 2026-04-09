import { SqlEntityRepository } from '@mikro-orm/postgresql';
import { Participant } from '../models/Participant';

export interface ThreadActivityRow {
  thread_id: string;
  updated_at: Date;
  new_message_count: number;
  last_sequence: number | null;
  last_intent: string | null;
  last_body_preview: string | null;
}

export class ParticipantRepository extends SqlEntityRepository<Participant> {
  /**
   * Aggregation query: threads with activity since a timestamp for a given agent.
   * Raw SQL because MikroORM lacks cross-table aggregation (JOIN + COUNT + DISTINCT ON).
   */
  async findThreadActivityForAgent(
    agentId: string,
    since: Date,
    limit: number,
  ): Promise<ThreadActivityRow[]> {
    return this.getEntityManager().getConnection().execute<ThreadActivityRow[]>(
      `WITH agent_threads AS (
        SELECT DISTINCT t.id, t.updated_at
        FROM participant p
        JOIN thread t ON t.id = p.thread_id
        WHERE p.agent_id = ?
          AND t.updated_at > ?
        ORDER BY t.updated_at DESC
        LIMIT ?
      ),
      new_counts AS (
        SELECT m.thread_id, COUNT(*)::int AS new_message_count
        FROM message m
        JOIN agent_threads at ON at.id = m.thread_id
        WHERE m.created_at > ?
        GROUP BY m.thread_id
      ),
      latest_msgs AS (
        SELECT DISTINCT ON (m.thread_id)
          m.thread_id, m.sequence, m.intent, LEFT(m.body, 100) AS body_preview
        FROM message m
        JOIN agent_threads at ON at.id = m.thread_id
        ORDER BY m.thread_id, m.sequence DESC
      )
      SELECT
        at.id AS thread_id,
        at.updated_at,
        COALESCE(nc.new_message_count, 0)::int AS new_message_count,
        lm.sequence AS last_sequence,
        lm.intent AS last_intent,
        lm.body_preview AS last_body_preview
      FROM agent_threads at
      LEFT JOIN new_counts nc ON nc.thread_id = at.id
      LEFT JOIN latest_msgs lm ON lm.thread_id = at.id
      ORDER BY at.updated_at DESC`,
      [agentId, since, limit, since],
    );
  }
}
