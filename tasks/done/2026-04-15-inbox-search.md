# Search & Inbox Filtering Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a standalone SearchService with its own API endpoints, then wire inbox filtering through it. Add minimal search UI to the operator dashboard.

**Architecture:** SearchService owns all query logic (text, state, type, intent, ref). Returns unified paginated results. InboxService composes with SearchService for filtering. Two new endpoints: `GET /v0/search` (agent) and `GET /v0/operator/search` (operator). Inbox endpoints gain optional filter params that delegate to SearchService.

**Tech Stack:** NestJS (backend), PostgreSQL raw SQL, React + Jotai + TanStack Router (frontend), Bun test runner.

**Design doc:** `docs/design/inbox-search.md`

---

### Task 1: Create `SearchService` with `parseSince` helper

**Files:**
- Create: `apps/backend/src/api/service/search.service.ts`

**Step 1: Create the service**

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Participant } from '../../db/models/Participant';
import { Asset } from '../../db/models/Asset';
import { ParticipantRepository, AssetRepository } from '../../db/models';

export interface SearchFilters {
  q?: string;
  type?: 'thread' | 'asset';
  since?: Date;
  limit?: number;
  offset?: number;
  state?: 'open' | 'closed';
  intent?: string;
  ref?: string;
  asset_type?: string;
}

export interface SearchResult {
  type: 'thread' | 'asset';
  id: string;
  title: string | null;
  updated_at: Date;
  thread?: {
    state: string;
    last_intent: string | null;
    last_sequence: number | null;
    participant_count: number;
  };
  asset?: {
    asset_type: string;
    version_count: number;
    mime_type: string | null;
  };
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
}

/**
 * Parse `since` value: ISO 8601 string or integer (days back from now).
 */
export function parseSince(raw: string | undefined): Date | undefined {
  if (!raw) return undefined;
  const asInt = parseInt(raw, 10);
  if (!isNaN(asInt) && String(asInt) === raw) {
    return new Date(Date.now() - asInt * 86_400_000);
  }
  const d = new Date(raw);
  if (isNaN(d.getTime())) throw new Error('Invalid since value');
  return d;
}

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Participant) private readonly participantRepo: ParticipantRepository,
    @InjectRepository(Asset) private readonly assetRepo: AssetRepository,
  ) {}

  /**
   * Search for an agent: threads where agent is participant, assets owned by agent.
   */
  async searchForAgent(agentId: string, filters: SearchFilters): Promise<SearchResponse> {
    const limit = Math.min(filters.limit ?? 50, 200);
    const offset = filters.offset ?? 0;

    const includeThreads = filters.type !== 'asset';
    const includeAssets = filters.type !== 'thread';

    const [threads, assets] = await Promise.all([
      includeThreads
        ? this.participantRepo.searchThreadsForAgent(agentId, filters)
        : Promise.resolve({ rows: [], total: 0 }),
      includeAssets
        ? this.assetRepo.searchAssetsForOwner(agentId, filters)
        : Promise.resolve({ rows: [], total: 0 }),
    ]);

    return this.mergeResults(threads, assets, limit, offset);
  }

  /**
   * Search for an operator: threads where agent OR user is participant, assets owned by agent.
   */
  async searchForOperator(
    agentId: string,
    userId: string,
    filters: SearchFilters,
  ): Promise<SearchResponse> {
    const limit = Math.min(filters.limit ?? 50, 200);
    const offset = filters.offset ?? 0;

    const includeThreads = filters.type !== 'asset';
    const includeAssets = filters.type !== 'thread';

    const [threads, assets] = await Promise.all([
      includeThreads
        ? this.participantRepo.searchThreadsUnified(agentId, userId, filters)
        : Promise.resolve({ rows: [], total: 0 }),
      includeAssets
        ? this.assetRepo.searchAssetsForOwner(agentId, filters)
        : Promise.resolve({ rows: [], total: 0 }),
    ]);

    return this.mergeResults(threads, assets, limit, offset);
  }

  private mergeResults(
    threads: { rows: SearchResult[]; total: number },
    assets: { rows: SearchResult[]; total: number },
    limit: number,
    offset: number,
  ): SearchResponse {
    const all = [...threads.rows, ...assets.rows]
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    return {
      results: all.slice(offset, offset + limit),
      total: threads.total + assets.total,
    };
  }
}
```

**Step 2: Commit**

```bash
git add apps/backend/src/api/service/search.service.ts
git commit -m "feat(search): create SearchService with parseSince helper"
```

---

### Task 2: Add search query methods to `ParticipantRepository`

**Files:**
- Modify: `apps/backend/src/db/repositories/participant.repository.ts`

**Step 1: Add `SearchThreadRow` interface and `searchThreadsForAgent` method**

Add after the existing interfaces at the top of the file:

```typescript
export interface SearchThreadRow {
  thread_id: string;
  state: string;
  updated_at: Date;
  last_intent: string | null;
  last_sequence: number | null;
  last_body_preview: string | null;
  participant_count: number;
}
```

Add these two methods to the `ParticipantRepository` class:

```typescript
async searchThreadsForAgent(
  agentId: string,
  filters: { q?: string; since?: Date; state?: string; intent?: string; ref?: string },
): Promise<{ rows: SearchResult[]; total: number }> {
  const conditions = ['p.agent_id = ?'];
  const params: unknown[] = [agentId];

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

  // q and intent filter on the latest message, applied in HAVING/outer WHERE
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

  const results = rows.map((r) => ({
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
  }));

  return { rows: results, total };
}

async searchThreadsUnified(
  agentId: string,
  userId: string,
  filters: { q?: string; since?: Date; state?: string; intent?: string; ref?: string },
): Promise<{ rows: SearchResult[]; total: number }> {
  const conditions = ['(p.agent_id = ? OR p.user_id = ?)'];
  const params: unknown[] = [agentId, userId];

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

  const results = rows.map((r) => ({
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
  }));

  return { rows: results, total };
}
```

Import `SearchResult` from the search service at the top of the file:

```typescript
import type { SearchResult } from '../../api/service/search.service';
```

**Step 2: Commit**

```bash
git add apps/backend/src/db/repositories/participant.repository.ts
git commit -m "feat(search): add search query methods to ParticipantRepository"
```

---

### Task 3: Add search query method to `AssetRepository`

**Files:**
- Modify: `apps/backend/src/db/repositories/asset.repository.ts`

**Step 1: Add `searchAssetsForOwner` method**

```typescript
import type { SearchResult } from '../../api/service/search.service';

// Add to the AssetRepository class:

async searchAssetsForOwner(
  ownerId: string,
  filters: { q?: string; since?: Date; asset_type?: string },
): Promise<{ rows: SearchResult[]; total: number }> {
  const conditions = ['a.owner_id = ?', "a.state != 'destroyed'"];
  const params: unknown[] = [ownerId];

  if (filters.since) {
    conditions.push('a.updated_at > ?');
    params.push(filters.since);
  }
  if (filters.q) {
    conditions.push('a.title ILIKE ?');
    params.push(`%${filters.q}%`);
  }
  if (filters.asset_type) {
    conditions.push('a.type = ?');
    params.push(filters.asset_type);
  }

  const whereClause = conditions.join(' AND ');

  const countResult = await this.getEntityManager().getConnection().execute(
    `SELECT COUNT(*)::int AS total FROM asset a WHERE ${whereClause}`,
    params,
  );
  const total = countResult[0]?.total ?? 0;

  const rows = await this.getEntityManager().getConnection().execute(
    `SELECT
      a.public_id AS asset_id,
      a.title,
      a.type AS asset_type,
      a.mime_type,
      a.version_count,
      a.updated_at
    FROM asset a
    WHERE ${whereClause}
    ORDER BY a.updated_at DESC`,
    params,
  );

  const results: SearchResult[] = rows.map((r: any) => ({
    type: 'asset' as const,
    id: r.asset_id,
    title: r.title ?? null,
    updated_at: r.updated_at,
    asset: {
      asset_type: r.asset_type,
      version_count: r.version_count,
      mime_type: r.mime_type ?? null,
    },
  }));

  return { rows: results, total };
}
```

**Step 2: Commit**

```bash
git add apps/backend/src/db/repositories/asset.repository.ts
git commit -m "feat(search): add searchAssetsForOwner to AssetRepository"
```

---

### Task 4: Register `SearchService` in `ApiModule`

**Files:**
- Modify: `apps/backend/src/api/api.module.ts`

**Step 1: Add SearchService to providers**

Import and add `SearchService` to the `providers` array in `ApiModule`:

```typescript
import { SearchService } from './service/search.service';
```

Add `SearchService` to the `providers` array alongside the existing services.

**Step 2: Commit**

```bash
git add apps/backend/src/api/api.module.ts
git commit -m "feat(search): register SearchService in ApiModule"
```

---

### Task 5: Create search controller endpoints

**Files:**
- Create: `apps/backend/src/api/controller/search.controller.ts`

**Step 1: Create the controller**

```typescript
import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { Auth, AuthAgent, AuthUser } from '../auth/auth.decorator';
import { SearchService, parseSince, type SearchFilters } from '../service/search.service';
import { OperatorBindingService } from '../service/operator-binding.service';

function parseSearchQuery(query: {
  q?: string;
  type?: string;
  since?: string;
  limit?: string;
  offset?: string;
  state?: string;
  intent?: string;
  ref?: string;
  asset_type?: string;
}): SearchFilters {
  let since: Date | undefined;
  try {
    since = parseSince(query.since);
  } catch {
    throw new BadRequestException({
      ok: false,
      error: 'INVALID_FIELD',
      message: 'since must be a valid ISO 8601 timestamp or integer (days back)',
    });
  }

  const limit = query.limit ? parseInt(query.limit, 10) : undefined;
  if (limit !== undefined && isNaN(limit)) {
    throw new BadRequestException({ ok: false, error: 'INVALID_FIELD', message: 'limit must be a valid integer' });
  }
  const offset = query.offset ? parseInt(query.offset, 10) : undefined;
  if (offset !== undefined && isNaN(offset)) {
    throw new BadRequestException({ ok: false, error: 'INVALID_FIELD', message: 'offset must be a valid integer' });
  }

  return {
    q: query.q || undefined,
    type: query.type === 'thread' || query.type === 'asset' ? query.type : undefined,
    since,
    limit,
    offset,
    state: query.state === 'open' || query.state === 'closed' ? query.state : undefined,
    intent: query.intent || undefined,
    ref: query.ref || undefined,
    asset_type: query.asset_type || undefined,
  };
}

@Controller('v0')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly bindingService: OperatorBindingService,
  ) {}

  @Auth('agent')
  @Get('search')
  async agentSearch(
    @AuthAgent() agent: { id: string },
    @Query('q') q?: string,
    @Query('type') type?: string,
    @Query('since') since?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('state') state?: string,
    @Query('intent') intent?: string,
    @Query('ref') ref?: string,
    @Query('asset_type') asset_type?: string,
  ) {
    const filters = parseSearchQuery({ q, type, since, limit, offset, state, intent, ref, asset_type });
    const result = await this.searchService.searchForAgent(agent.id, filters);
    return { ok: true, data: result };
  }

  @Auth('user')
  @Get('operator/search')
  async operatorSearch(
    @AuthUser() user: { id: string },
    @Query('q') q?: string,
    @Query('type') type?: string,
    @Query('since') since?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('state') state?: string,
    @Query('intent') intent?: string,
    @Query('ref') ref?: string,
    @Query('asset_type') asset_type?: string,
  ) {
    const binding = await this.bindingService.findByUserId(user.id);
    if (!binding) {
      throw new BadRequestException({ ok: false, error: 'NO_BINDING', message: 'No agent bound to this operator' });
    }
    const filters = parseSearchQuery({ q, type, since, limit, offset, state, intent, ref, asset_type });
    const result = await this.searchService.searchForOperator(binding.agentId, user.id, filters);
    return { ok: true, data: result };
  }
}
```

Register `SearchController` in `ApiModule`'s `controllers` array.

**Step 2: Commit**

```bash
git add apps/backend/src/api/controller/search.controller.ts apps/backend/src/api/api.module.ts
git commit -m "feat(search): create search controller with agent and operator endpoints"
```

---

### Task 6: Add `state` to inbox thread response and filter params to inbox endpoints

**Files:**
- Modify: `apps/backend/src/db/repositories/participant.repository.ts` (add `state` to existing inbox queries)
- Modify: `apps/backend/src/api/service/inbox.service.ts` (add `state` to InboxThread, accept filter opts)
- Modify: `apps/backend/src/api/controller/inbox.controller.ts` (accept new params)
- Modify: `apps/backend/src/api/controller/operator.controller.ts` (accept new params)

**Step 1: Add `state` to `ThreadActivityRow` and both existing inbox SQL queries**

In `participant.repository.ts`, add `state: string;` to the `ThreadActivityRow` interface.

In both `findThreadActivityForAgent` and `findUnifiedThreadActivity`:
- Add `t.state` to the CTE SELECT: `SELECT DISTINCT t.id, t.state, t.updated_at`
- Add `at.state` to the outer SELECT

**Step 2: Update `InboxService`**

Add `state: string;` to the `InboxThread` interface. Map it in `assembleResult`:

```typescript
const threads: InboxThread[] = threadRows.map((r) => ({
  thread_id: r.thread_id,
  state: r.state,  // new
  last_sequence: r.last_sequence ?? null,
  // ... rest unchanged
}));
```

Add filter params to both `getInbox` and `getOperatorInbox`. Pass `state` and `type` (for kind filtering) through to the queries. For the inbox, filtering is simpler than search — just add optional WHERE conditions to the existing queries for `state`, and skip thread/asset queries based on `type` filter.

Update method signatures:

```typescript
async getInbox(
  agentId: string,
  since: Date,
  opts?: { types?: string[]; limit?: number; q?: string; state?: string; type?: string },
): Promise<InboxResult>

async getOperatorInbox(
  agentId: string,
  userId: string,
  since: Date,
  opts?: { limit?: number; q?: string; state?: string; type?: string },
): Promise<InboxResult>
```

When `type=thread`, skip the asset query. When `type=asset`, skip the thread query. Pass `state`, `q` through to the thread/asset queries (which need minor updates to accept these as optional conditions — extend the existing `findThreadActivityForAgent`, `findUnifiedThreadActivity`, and `findAssetUpdatesForOwner` signatures and SQL).

**Step 3: Update inbox controllers**

In `inbox.controller.ts`, add `@Query` params for `q`, `state`, `type`, and `kind` (alias for `type`). Update `parseSince` import from `search.service.ts`. Pass through to `InboxService`.

In `operator.controller.ts`, add the same params to `getInbox`. Import `parseSince` from `search.service.ts`.

**Step 4: Commit**

```bash
git add apps/backend/src/db/repositories/participant.repository.ts apps/backend/src/api/service/inbox.service.ts apps/backend/src/api/controller/inbox.controller.ts apps/backend/src/api/controller/operator.controller.ts
git commit -m "feat(inbox): add state to response, add search/filter params to inbox endpoints"
```

---

### Task 7: Write integration tests for search endpoints

**Files:**
- Create: `tests/integration/search.test.ts`

**Step 1: Write tests**

Follow the pattern in `inbox.test.ts`. Set up two agents, create threads and assets, then test:

```typescript
import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { startBackend, stopBackend, type TestBackend } from '../setup/backend';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from '../setup/database';
import { createTestAgent, type TestAgent } from '../setup/agent';

let backend: TestBackend;
let agentA: TestAgent;
let agentB: TestAgent;
const dbName = generateTestDbName();

beforeAll(async () => {
  await createTestDatabase(dbName);
  backend = await startBackend(dbName);
  agentA = await createTestAgent(backend.url);
  agentB = await createTestAgent(backend.url);
});

afterAll(async () => {
  await stopBackend(backend);
  await dropTestDatabase(dbName);
});

// ... helpers for createThread, postMessage, createAsset (same as inbox.test.ts)

async function search(apiKey: string, params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params);
  const res = await fetch(`${backend.url}/v0/search?${qs}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  return { status: res.status, json: await res.json() };
}

describe('search', () => {
  test('returns empty results for new agent', async () => {
    const { status, json } = await search(agentA.apiKey);
    expect(status).toBe(200);
    expect(json.data.results).toEqual([]);
    expect(json.data.total).toBe(0);
  });

  test('finds threads by body text', async () => {
    const thread = await createThread(agentA.apiKey);
    await postMessage(thread.data.id, agentA.apiKey, 'Deploy the widget service');

    const { json } = await search(agentA.apiKey, { q: 'widget' });
    const found = json.data.results.find((r: any) => r.id === thread.data.id);
    expect(found).toBeDefined();
    expect(found.type).toBe('thread');
    expect(found.thread.state).toBe('open');
  });

  test('finds assets by title', async () => {
    const res = await fetch(`${backend.url}/v0/assets`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${agentA.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'markdown', content: '# Report', title: 'Quarterly Report' }),
    });
    const asset = (await res.json()) as { data: { id: string } };

    const { json } = await search(agentA.apiKey, { q: 'quarterly' });
    const found = json.data.results.find((r: any) => r.id === asset.data.id);
    expect(found).toBeDefined();
    expect(found.type).toBe('asset');
    expect(found.asset.asset_type).toBe('markdown');
  });

  test('q is case insensitive', async () => {
    const thread = await createThread(agentA.apiKey);
    await postMessage(thread.data.id, agentA.apiKey, 'URGENT deploy needed');

    const { json } = await search(agentA.apiKey, { q: 'urgent' });
    const found = json.data.results.find((r: any) => r.id === thread.data.id);
    expect(found).toBeDefined();
  });

  test('type=thread excludes assets', async () => {
    const { json } = await search(agentA.apiKey, { type: 'thread' });
    const assetResults = json.data.results.filter((r: any) => r.type === 'asset');
    expect(assetResults).toEqual([]);
  });

  test('type=asset excludes threads', async () => {
    const { json } = await search(agentA.apiKey, { type: 'asset' });
    const threadResults = json.data.results.filter((r: any) => r.type === 'thread');
    expect(threadResults).toEqual([]);
  });

  test('state filter', async () => {
    const thread = await createThread(agentA.apiKey);
    await postMessage(thread.data.id, agentA.apiKey, 'will close');
    await fetch(`${backend.url}/v0/threads/${thread.data.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${agentA.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: 'closed' }),
    });

    const { json: openJson } = await search(agentA.apiKey, { state: 'open' });
    expect(openJson.data.results.find((r: any) => r.id === thread.data.id)).toBeUndefined();

    const { json: closedJson } = await search(agentA.apiKey, { state: 'closed' });
    expect(closedJson.data.results.find((r: any) => r.id === thread.data.id)).toBeDefined();
  });

  test('intent filter', async () => {
    const t1 = await createThread(agentA.apiKey, { participants: [agentB.agentId] });
    await postMessage(t1.data.id, agentA.apiKey, 'Proposal', { intent: 'propose' });
    const t2 = await createThread(agentA.apiKey, { participants: [agentB.agentId] });
    await postMessage(t2.data.id, agentA.apiKey, 'FYI', { intent: 'inform' });

    const { json } = await search(agentA.apiKey, { intent: 'propose' });
    const ids = json.data.results.map((r: any) => r.id);
    expect(ids).toContain(t1.data.id);
    expect(ids).not.toContain(t2.data.id);
  });

  test('asset_type filter', async () => {
    await fetch(`${backend.url}/v0/assets`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${agentA.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'html', content: '<h1>Hi</h1>', title: 'HTML doc' }),
    });

    const { json } = await search(agentA.apiKey, { asset_type: 'html' });
    const assets = json.data.results.filter((r: any) => r.type === 'asset');
    expect(assets.length).toBeGreaterThanOrEqual(1);
    expect(assets.every((a: any) => a.asset.asset_type === 'html')).toBe(true);
  });

  test('since accepts integer (days back)', async () => {
    const { status, json } = await search(agentA.apiKey, { since: '1' });
    expect(status).toBe(200);
    expect(json.ok).toBe(true);
  });

  test('results sorted by updated_at desc', async () => {
    const { json } = await search(agentA.apiKey);
    const dates = json.data.results.map((r: any) => new Date(r.updated_at).getTime());
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i]).toBeLessThanOrEqual(dates[i - 1]);
    }
  });

  test('non-participant threads excluded', async () => {
    const thread = await createThread(agentA.apiKey);
    await postMessage(thread.data.id, agentA.apiKey, 'private stuff');

    const { json } = await search(agentB.apiKey, { q: 'private' });
    expect(json.data.results.find((r: any) => r.id === thread.data.id)).toBeUndefined();
  });

  test('requires auth', async () => {
    const res = await fetch(`${backend.url}/v0/search`);
    expect(res.status).toBe(401);
  });
});
```

**Step 2: Add tests for inbox `state` field and filter params to existing `inbox.test.ts`**

Append to the existing describe block:

```typescript
test('thread results include state field', async () => {
  const since = new Date(Date.now() - 1000).toISOString();
  const thread = await createThread(agentA.apiKey);
  await postMessage(thread.data.id, agentA.apiKey, 'hello');

  const { json } = await getInbox(agentA.apiKey, since);
  const t = json.data.threads.find((x: any) => x.thread_id === thread.data.id);
  expect(t).toBeDefined();
  expect(t.state).toBe('open');
});

test('since accepts integer (days back)', async () => {
  const thread = await createThread(agentA.apiKey);
  await postMessage(thread.data.id, agentA.apiKey, 'recent');

  const { status, json } = await getInbox(agentA.apiKey, '1');
  expect(status).toBe(200);
  expect(json.ok).toBe(true);
});
```

**Step 3: Build and run**

```bash
cd apps/backend && bun run build
bun test tests/integration/search.test.ts tests/integration/inbox.test.ts --verbose
```

**Step 4: Commit**

```bash
git add tests/integration/search.test.ts tests/integration/inbox.test.ts
git commit -m "test(search): add integration tests for search endpoints and inbox state field"
```

---

### Task 8: Update frontend types and add `fetchInbox` filter support

**Files:**
- Modify: `apps/frontend/src/lib/operator.ts`

**Step 1: Add `state` to `InboxThread`, update `fetchInbox`, add `searchOperator`**

Add `state` to `InboxThread`:

```typescript
export interface InboxThread {
  thread_id: string
  state: 'open' | 'closed'  // new
  updated_at: string
  // ... rest unchanged
}
```

Update `fetchInbox` to accept filter opts:

```typescript
export interface InboxFetchOpts {
  since?: string
  limit?: number
  type?: 'thread' | 'asset'
  q?: string
  state?: 'open' | 'closed'
}

export async function fetchInbox(opts?: InboxFetchOpts): Promise<InboxData> {
  const params: Record<string, string | number> = {}
  if (opts?.since) params.since = opts.since
  if (opts?.limit) params.limit = opts.limit
  if (opts?.type) params.type = opts.type
  if (opts?.q) params.q = opts.q
  if (opts?.state) params.state = opts.state
  const res = await api.get('/v0/operator/inbox', { params })
  return res.data.data
}
```

**Step 2: Commit**

```bash
git add apps/frontend/src/lib/operator.ts
git commit -m "feat(frontend): add state to InboxThread, update fetchInbox with filter opts"
```

---

### Task 9: Add filter atoms and update `useInboxPolling`

**Files:**
- Modify: `apps/frontend/src/_jotai/operator/operator.atoms.ts`
- Modify: `apps/frontend/src/components/operator/useInboxPolling.ts`

**Step 1: Add filter atoms**

```typescript
export const inboxSearchAtom = atom<string>('')
export const inboxStateFilterAtom = atom<'all' | 'open' | 'closed'>('all')
```

**Step 2: Update `useInboxPolling`**

Read filter atoms. When filters change, reset `lastFetchRef` and re-fetch from scratch. When `stateFilter !== 'all'`, pass `state` and `type: 'thread'` (assets don't have state). When `search` is set, pass `q`.

Key changes to `doFetch`:

```typescript
const opts: InboxFetchOpts = { limit: 50 }
if (since) opts.since = since
if (search) opts.q = search
if (stateFilter !== 'all') {
  opts.state = stateFilter
  opts.type = 'thread'
}
const data = await fetchInbox(opts)
```

Add `search` and `stateFilter` to the `doFetch` dependency array. Add a `useEffect` that resets and re-fetches when filters change.

**Step 3: Commit**

```bash
git add apps/frontend/src/_jotai/operator/operator.atoms.ts apps/frontend/src/components/operator/useInboxPolling.ts
git commit -m "feat(frontend): add filter atoms, wire search/state through useInboxPolling"
```

---

### Task 10: Build `InboxFilters` component and wire into inbox page

**Files:**
- Create: `apps/frontend/src/components/operator/InboxFilters.tsx`
- Modify: `apps/frontend/src/app/operator/index.tsx`

**Step 1: Create `InboxFilters`**

Search input with 300ms debounce + three state tabs (All / Open / Closed). Uses `inboxSearchAtom` and `inboxStateFilterAtom`.

```tsx
import { useAtom } from 'jotai'
import { Search } from 'lucide-react'
import { useRef, useCallback } from 'react'
import { inboxSearchAtom, inboxStateFilterAtom } from '@/_jotai/operator/operator.atoms'

const STATE_TABS = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
] as const

export function InboxFilters() {
  const [search, setSearch] = useAtom(inboxSearchAtom)
  const [stateFilter, setStateFilter] = useAtom(inboxStateFilterAtom)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => setSearch(value), 300)
    },
    [setSearch],
  )

  return (
    <div className="space-y-3 px-4 pb-2 pt-3">
      <div className="relative">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground/25" />
        <input
          type="text"
          placeholder="Search..."
          defaultValue={search}
          onChange={handleSearch}
          className="w-full rounded-md border border-foreground/10 bg-foreground/[0.03] py-1.5 pl-8 pr-3 text-sm text-foreground/80 placeholder:text-foreground/25 focus:border-foreground/20 focus:outline-none"
        />
      </div>
      <div className="flex gap-1">
        {STATE_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setStateFilter(tab.value)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              stateFilter === tab.value
                ? 'bg-foreground/10 text-foreground/80'
                : 'text-foreground/35 hover:text-foreground/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
```

**Step 2: Add to inbox page**

```tsx
import { InboxFilters } from '@/components/operator/InboxFilters'

function OperatorInboxPage() {
  useInboxPolling()
  return (
    <>
      <InboxFilters />
      <InboxFeed />
    </>
  )
}
```

**Step 3: Commit**

```bash
git add apps/frontend/src/components/operator/InboxFilters.tsx apps/frontend/src/app/operator/index.tsx
git commit -m "feat(frontend): add search bar and state filter tabs to operator inbox"
```

---

### Task 11: Add closed badge to `InboxCard`

**Files:**
- Modify: `apps/frontend/src/components/operator/InboxCard.tsx`

**Step 1: Add closed badge**

In the thread card, after the intent badge block, add:

```tsx
{t.state === 'closed' && (
  <span className="rounded-full bg-foreground/10 px-1.5 py-px text-[10px] font-medium text-foreground/40">
    closed
  </span>
)}
```

**Step 2: Commit**

```bash
git add apps/frontend/src/components/operator/InboxCard.tsx
git commit -m "feat(frontend): show closed badge on thread inbox cards"
```

---

### Task 12: End-to-end verification

**Step 1: Build backend and run all tests**

```bash
cd apps/backend && bun run build
bun test --verbose
```

Expected: All existing + new tests pass.

**Step 2: Manual testing**

Start dev servers. Navigate to `http://localhost:3333/operator`. Verify:
- Search bar and state tabs render above the feed
- Typing filters results after debounce
- State tabs filter threads (Open/Closed hides assets, All shows everything)
- Polling continues with filters active

Test API directly:
```bash
curl "http://localhost:3434/v0/search?q=test" -H "Authorization: Bearer $KEY"
curl "http://localhost:3434/v0/search?type=thread&state=open" -H "Authorization: Bearer $KEY"
curl "http://localhost:3434/v0/search?since=7" -H "Authorization: Bearer $KEY"
```

**Step 3: Update design doc if anything changed**

```bash
git add docs/design/inbox-search.md
git commit -m "docs: finalize inbox-search design doc"
```
