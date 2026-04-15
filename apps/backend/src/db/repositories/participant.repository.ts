import { SqlEntityRepository } from '@mikro-orm/postgresql';
import { Participant } from '../models/Participant';
import type { SearchResult } from '../../api/service/search.service';

export interface ThreadListRow {
  thread_id: string;
  state: string;
  created_by: string;
  owner_id: string;
  metadata: Record<string, unknown> | null;
  created_at: Date;
  updated_at: Date;
  participant_count: number;
  last_body_preview: string | null;
  last_message_at: Date | null;
}

export interface ThreadActivityRow {
  thread_id: string;
  state: string;
  updated_at: Date;
  new_message_count: number;
  last_sequence: number | null;
  last_intent: string | null;
  last_body_preview: string | null;
}

export interface SearchThreadRow {
  thread_id: string;
  state: string;
  updated_at: Date;
  last_intent: string | null;
  last_sequence: number | null;
  last_body_preview: string | null;
  participant_count: number;
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
    filters?: { state?: string; q?: string },
  ): Promise<ThreadActivityRow[]> {
    const conditions = ['p.agent_id = ?', 't.updated_at > ?'];
    const cteParams: unknown[] = [agentId, since];

    if (filters?.state) {
      conditions.push('t.state = ?');
      cteParams.push(filters.state);
    }

    const qJoin = filters?.q
      ? `LEFT JOIN LATERAL (
          SELECT LEFT(m.body, 100) AS body_preview
          FROM message m WHERE m.thread_id = t.id
          ORDER BY m.sequence DESC LIMIT 1
        ) lm_filter ON true`
      : '';
    if (filters?.q) {
      conditions.push('lm_filter.body_preview ILIKE ?');
      cteParams.push(`%${filters.q}%`);
    }

    const whereClause = conditions.join(' AND ');

    return this.getEntityManager().getConnection().execute<ThreadActivityRow[]>(
      `WITH agent_threads AS (
        SELECT DISTINCT t.id, t.state, t.updated_at
        FROM participant p
        JOIN thread t ON t.id = p.thread_id
        ${qJoin}
        WHERE ${whereClause}
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
        at.state,
        at.updated_at,
        COALESCE(nc.new_message_count, 0)::int AS new_message_count,
        lm.sequence AS last_sequence,
        lm.intent AS last_intent,
        lm.body_preview AS last_body_preview
      FROM agent_threads at
      LEFT JOIN new_counts nc ON nc.thread_id = at.id
      LEFT JOIN latest_msgs lm ON lm.thread_id = at.id
      ORDER BY at.updated_at DESC`,
      [...cteParams, limit, since],
    );
  }

  /**
   * Unified inbox: threads where agent OR user is participant, excluding dismissed.
   */
  async findUnifiedThreadActivity(
    agentId: string,
    userId: string,
    since: Date,
    limit: number,
    filters?: { state?: string; q?: string },
  ): Promise<ThreadActivityRow[]> {
    const conditions = ['(p.agent_id = ? OR p.user_id = ?)', 't.updated_at > ?'];
    const cteParams: unknown[] = [agentId, userId, since];

    // When searching (q is set), skip dismiss filter so dismissed threads are included
    if (!filters?.q) {
      conditions.push('(p.dismissed_at IS NULL OR p.dismissed_at < t.updated_at)');
    }

    if (filters?.state) {
      conditions.push('t.state = ?');
      cteParams.push(filters.state);
    }

    const qJoin = filters?.q
      ? `LEFT JOIN LATERAL (
          SELECT LEFT(m.body, 100) AS body_preview
          FROM message m WHERE m.thread_id = t.id
          ORDER BY m.sequence DESC LIMIT 1
        ) lm_filter ON true`
      : '';
    if (filters?.q) {
      conditions.push('lm_filter.body_preview ILIKE ?');
      cteParams.push(`%${filters.q}%`);
    }

    const whereClause = conditions.join(' AND ');

    return this.getEntityManager().getConnection().execute<ThreadActivityRow[]>(
      `WITH active_threads AS (
        SELECT DISTINCT t.id, t.state, t.updated_at
        FROM participant p
        JOIN thread t ON t.id = p.thread_id
        ${qJoin}
        WHERE ${whereClause}
        ORDER BY t.updated_at DESC
        LIMIT ?
      ),
      new_counts AS (
        SELECT m.thread_id, COUNT(*)::int AS new_message_count
        FROM message m
        JOIN active_threads at ON at.id = m.thread_id
        WHERE m.created_at > ?
        GROUP BY m.thread_id
      ),
      latest_msgs AS (
        SELECT DISTINCT ON (m.thread_id)
          m.thread_id, m.sequence, m.intent, LEFT(m.body, 100) AS body_preview
        FROM message m
        JOIN active_threads at ON at.id = m.thread_id
        ORDER BY m.thread_id, m.sequence DESC
      )
      SELECT
        at.id AS thread_id,
        at.state,
        at.updated_at,
        COALESCE(nc.new_message_count, 0)::int AS new_message_count,
        lm.sequence AS last_sequence,
        lm.intent AS last_intent,
        lm.body_preview AS last_body_preview
      FROM active_threads at
      LEFT JOIN new_counts nc ON nc.thread_id = at.id
      LEFT JOIN latest_msgs lm ON lm.thread_id = at.id
      ORDER BY at.updated_at DESC`,
      [...cteParams, limit, since],
    );
  }

  async findAllThreadsForAgent(
    agentId: string,
    opts: { state?: string; limit: number; offset: number },
  ): Promise<{ rows: ThreadListRow[]; total: number }> {
    const conditions = ['p.agent_id = ?'];
    const params: unknown[] = [agentId];

    if (opts.state) {
      conditions.push('t.state = ?');
      params.push(opts.state);
    }

    const whereClause = conditions.join(' AND ');

    const countResult = await this.em.getConnection().execute(
      `SELECT COUNT(DISTINCT t.id)::int AS total
       FROM participant p
       JOIN thread t ON t.id = p.thread_id
       WHERE ${whereClause}`,
      params,
    );
    const total = countResult[0]?.total ?? 0;

    const rows = await this.em.getConnection().execute(
      `WITH agent_threads AS (
         SELECT DISTINCT t.id AS thread_id,
                t.state,
                t.created_by,
                t.owner_id,
                t.metadata,
                t.created_at,
                t.updated_at
         FROM participant p
         JOIN thread t ON t.id = p.thread_id
         WHERE ${whereClause}
       ),
       participant_counts AS (
         SELECT p2.thread_id, COUNT(*)::int AS participant_count
         FROM participant p2
         WHERE p2.thread_id IN (SELECT thread_id FROM agent_threads)
         GROUP BY p2.thread_id
       ),
       latest_msgs AS (
         SELECT DISTINCT ON (m.thread_id)
                m.thread_id,
                m.body AS last_body_preview,
                m.created_at AS last_message_at
         FROM message m
         WHERE m.thread_id IN (SELECT thread_id FROM agent_threads)
         ORDER BY m.thread_id, m.sequence DESC
       )
       SELECT at.thread_id, at.state, at.created_by, at.owner_id, at.metadata,
              at.created_at, at.updated_at,
              COALESCE(pc.participant_count, 0) AS participant_count,
              lm.last_body_preview,
              lm.last_message_at
       FROM agent_threads at
       LEFT JOIN participant_counts pc ON pc.thread_id = at.thread_id
       LEFT JOIN latest_msgs lm ON lm.thread_id = at.thread_id
       ORDER BY at.updated_at DESC
       LIMIT ? OFFSET ?`,
      [...params, opts.limit, opts.offset],
    );

    return { rows, total };
  }

  async findAllThreadsUnified(
    agentId: string,
    userId: string,
    opts: { state?: string; limit: number; offset: number },
  ): Promise<{ rows: ThreadListRow[]; total: number }> {
    const conditions = ['(p.agent_id = ? OR p.user_id = ?)'];
    const params: unknown[] = [agentId, userId];

    if (opts.state) {
      conditions.push('t.state = ?');
      params.push(opts.state);
    }

    const whereClause = conditions.join(' AND ');

    const countResult = await this.em.getConnection().execute(
      `SELECT COUNT(DISTINCT t.id)::int AS total
       FROM participant p
       JOIN thread t ON t.id = p.thread_id
       WHERE ${whereClause}`,
      params,
    );
    const total = countResult[0]?.total ?? 0;

    const rows = await this.em.getConnection().execute(
      `WITH unified_threads AS (
         SELECT DISTINCT t.id AS thread_id,
                t.state,
                t.created_by,
                t.owner_id,
                t.metadata,
                t.created_at,
                t.updated_at
         FROM participant p
         JOIN thread t ON t.id = p.thread_id
         WHERE ${whereClause}
       ),
       participant_counts AS (
         SELECT p2.thread_id, COUNT(*)::int AS participant_count
         FROM participant p2
         WHERE p2.thread_id IN (SELECT thread_id FROM unified_threads)
         GROUP BY p2.thread_id
       ),
       latest_msgs AS (
         SELECT DISTINCT ON (m.thread_id)
                m.thread_id,
                m.body AS last_body_preview,
                m.created_at AS last_message_at
         FROM message m
         WHERE m.thread_id IN (SELECT thread_id FROM unified_threads)
         ORDER BY m.thread_id, m.sequence DESC
       )
       SELECT ut.thread_id, ut.state, ut.created_by, ut.owner_id, ut.metadata,
              ut.created_at, ut.updated_at,
              COALESCE(pc.participant_count, 0) AS participant_count,
              lm.last_body_preview,
              lm.last_message_at
       FROM unified_threads ut
       LEFT JOIN participant_counts pc ON pc.thread_id = ut.thread_id
       LEFT JOIN latest_msgs lm ON lm.thread_id = ut.thread_id
       ORDER BY ut.updated_at DESC
       LIMIT ? OFFSET ?`,
      [...params, opts.limit, opts.offset],
    );

    return { rows, total };
  }

  async searchThreadsForAgent(
    agentId: string,
    filters: { q?: string; since?: Date; state?: string; intent?: string; ref?: string },
  ): Promise<{ rows: SearchResult[]; total: number }> {
    return this.searchThreadsCore(['p.agent_id = ?'], [agentId], filters);
  }

  async searchThreadsUnified(
    agentId: string,
    userId: string,
    filters: { q?: string; since?: Date; state?: string; intent?: string; ref?: string },
  ): Promise<{ rows: SearchResult[]; total: number }> {
    return this.searchThreadsCore(['(p.agent_id = ? OR p.user_id = ?)'], [agentId, userId], filters);
  }

  private async searchThreadsCore(
    baseConditions: string[],
    baseParams: unknown[],
    filters: { q?: string; since?: Date; state?: string; intent?: string; ref?: string },
  ): Promise<{ rows: SearchResult[]; total: number }> {
    const conditions = [...baseConditions];
    const params = [...baseParams];

    if (filters.since) {
      conditions.push('t.updated_at > ?');
      params.push(filters.since);
    }
    if (filters.state) {
      conditions.push('t.state = ?');
      params.push(filters.state);
    }
    if (filters.ref) {
      conditions.push(`EXISTS (SELECT 1 FROM ref r WHERE r.owner_type = 'thread' AND r.owner_id = t.id AND r.target_id = ?)`);
      params.push(filters.ref);
    }

    const whereClause = conditions.join(' AND ');
    const qCondition = filters.q ? 'AND lm.body_preview ILIKE ?' : '';
    const qParams = filters.q ? [`%${filters.q}%`] : [];
    const intentCondition = filters.intent ? 'AND lm.intent = ?' : '';
    const intentParams = filters.intent ? [filters.intent] : [];

    const countResult = await this.em.getConnection().execute(
      `SELECT COUNT(*)::int AS total FROM (
        SELECT DISTINCT t.id
        FROM participant p
        JOIN thread t ON t.id = p.thread_id
        LEFT JOIN LATERAL (
          SELECT m.intent, LEFT(m.body, 100) AS body_preview
          FROM message m WHERE m.thread_id = t.id
          ORDER BY m.sequence DESC LIMIT 1
        ) lm ON true
        WHERE ${whereClause} ${qCondition} ${intentCondition}
      ) sub`,
      [...params, ...qParams, ...intentParams],
    );
    const total = countResult[0]?.total ?? 0;

    const rows = await this.em.getConnection().execute<SearchThreadRow[]>(
      `WITH matched_threads AS (
        SELECT DISTINCT t.id, t.state, t.updated_at
        FROM participant p
        JOIN thread t ON t.id = p.thread_id
        LEFT JOIN LATERAL (
          SELECT m.intent, LEFT(m.body, 100) AS body_preview
          FROM message m WHERE m.thread_id = t.id
          ORDER BY m.sequence DESC LIMIT 1
        ) lm ON true
        WHERE ${whereClause} ${qCondition} ${intentCondition}
        ORDER BY t.updated_at DESC
      ),
      participant_counts AS (
        SELECT p2.thread_id, COUNT(*)::int AS participant_count
        FROM participant p2
        WHERE p2.thread_id IN (SELECT id FROM matched_threads)
        GROUP BY p2.thread_id
      ),
      latest_msgs AS (
        SELECT DISTINCT ON (m.thread_id)
          m.thread_id, m.sequence AS last_sequence, m.intent AS last_intent,
          LEFT(m.body, 100) AS last_body_preview
        FROM message m
        WHERE m.thread_id IN (SELECT id FROM matched_threads)
        ORDER BY m.thread_id, m.sequence DESC
      )
      SELECT
        mt.id AS thread_id, mt.state, mt.updated_at,
        lm.last_intent, lm.last_sequence, lm.last_body_preview,
        COALESCE(pc.participant_count, 0)::int AS participant_count
      FROM matched_threads mt
      LEFT JOIN latest_msgs lm ON lm.thread_id = mt.id
      LEFT JOIN participant_counts pc ON pc.thread_id = mt.id
      ORDER BY mt.updated_at DESC`,
      [...params, ...qParams, ...intentParams],
    );

    return {
      rows: rows.map((r) => ({
        type: 'thread' as const,
        id: r.thread_id,
        title: r.last_body_preview,
        updated_at: r.updated_at,
        thread: {
          state: r.state,
          last_intent: r.last_intent,
          last_sequence: r.last_sequence,
          participant_count: r.participant_count,
        },
      })),
      total,
    };
  }
}
