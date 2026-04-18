# Dashboard Threads Tab & Metadata Enrichment — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a dedicated Threads tab to the operator dashboard and enrich metadata across inbox, assets, and threads views (participants, last activity, linked assets/threads, descriptions).

**Architecture:** Backend-first — enrich existing API responses with new fields (participants list, ref counts, thread counts, descriptions), then build the new Threads tab and update existing frontend components to display the richer data.

**Tech Stack:** NestJS backend (raw PostgreSQL queries in repositories), TanStack Start frontend (React + Jotai + Tailwind + Lucide icons)

**Design doc:** `docs/design/dashboard-threads-and-metadata.md`

---

## Task 1: Enrich `ThreadListRow` with participants and ref count

Add participant details (agent_id + alias) and ref_count to the `findAllThreadsUnified` and `findAllThreadsForAgent` queries.

**Files:**
- Modify: `apps/backend/src/db/repositories/participant.repository.ts`
- Modify: `apps/backend/src/db/models/index.ts` (export new type)

**Step 1: Update `ThreadListRow` interface**

In `apps/backend/src/db/repositories/participant.repository.ts`, add new fields to the `ThreadListRow` interface:

```typescript
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
  participants: Array<{ agent_id: string; alias: string | null }>;
  ref_count: number;
}
```

**Step 2: Update `findAllThreadsUnified` query**

Replace the existing `findAllThreadsUnified` method. Add two new CTEs — `participant_details` to fetch agent aliases, and `ref_counts` to count thread refs:

```typescript
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
     participant_details AS (
       SELECT p3.thread_id,
              json_agg(json_build_object(
                'agent_id', COALESCE(p3.agent_id, p3.user_id),
                'alias', a.alias
              )) AS participants
       FROM participant p3
       LEFT JOIN agent a ON a.id = p3.agent_id
       WHERE p3.thread_id IN (SELECT thread_id FROM unified_threads)
       GROUP BY p3.thread_id
     ),
     ref_counts AS (
       SELECT r.owner_id AS thread_id, COUNT(*)::int AS ref_count
       FROM ref r
       WHERE r.owner_type = 'thread'
         AND r.owner_id::uuid IN (SELECT thread_id FROM unified_threads)
       GROUP BY r.owner_id
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
            COALESCE(pd.participants, '[]'::json) AS participants,
            COALESCE(rc.ref_count, 0)::int AS ref_count,
            lm.last_body_preview,
            lm.last_message_at
     FROM unified_threads ut
     LEFT JOIN participant_counts pc ON pc.thread_id = ut.thread_id
     LEFT JOIN participant_details pd ON pd.thread_id = ut.thread_id
     LEFT JOIN ref_counts rc ON rc.thread_id::uuid = ut.thread_id
     LEFT JOIN latest_msgs lm ON lm.thread_id = ut.thread_id
     ORDER BY ut.updated_at DESC
     LIMIT ? OFFSET ?`,
    [...params, opts.limit, opts.offset],
  );

  return { rows, total };
}
```

**Step 3: Apply same changes to `findAllThreadsForAgent`**

Same two new CTEs (`participant_details`, `ref_counts`) added to `findAllThreadsForAgent`. Same pattern — just uses `p.agent_id = ?` instead of the unified condition.

**Step 4: Build the backend and verify no TypeScript errors**

Run: `cd apps/backend && bun run build`
Expected: Clean build, no errors.

**Step 5: Commit**

```
feat(backend): enrich ThreadListRow with participant details and ref count
```

---

## Task 2: Enrich `ThreadActivityRow` with participants, owner_id, and ref count

Add the same enrichment to the inbox thread queries (`findUnifiedThreadActivity`, `findThreadActivityForAgent`).

**Files:**
- Modify: `apps/backend/src/db/repositories/participant.repository.ts`

**Step 1: Update `ThreadActivityRow` interface**

```typescript
export interface ThreadActivityRow {
  thread_id: string;
  state: string;
  updated_at: Date;
  new_message_count: number;
  last_sequence: number | null;
  last_intent: string | null;
  last_body_preview: string | null;
  owner_id: string;
  participants: Array<{ agent_id: string; alias: string | null }>;
  ref_count: number;
}
```

**Step 2: Update `findUnifiedThreadActivity` query**

Add `t.owner_id` to the `active_threads` CTE select list, and add `participant_details` and `ref_counts` CTEs (same as Task 1). Update the final SELECT to include the new fields:

In the `active_threads` CTE, change:
```sql
SELECT DISTINCT t.id, t.state, t.updated_at
```
to:
```sql
SELECT DISTINCT t.id, t.state, t.updated_at, t.owner_id
```

Add after the `latest_msgs` CTE:
```sql
participant_details AS (
  SELECT p3.thread_id,
         json_agg(json_build_object(
           'agent_id', COALESCE(p3.agent_id, p3.user_id),
           'alias', a.alias
         )) AS participants
  FROM participant p3
  LEFT JOIN agent a ON a.id = p3.agent_id
  WHERE p3.thread_id IN (SELECT id FROM active_threads)
  GROUP BY p3.thread_id
),
ref_counts AS (
  SELECT r.owner_id AS thread_id, COUNT(*)::int AS ref_count
  FROM ref r
  WHERE r.owner_type = 'thread'
    AND r.owner_id::uuid IN (SELECT id FROM active_threads)
  GROUP BY r.owner_id
)
```

Update final SELECT to add:
```sql
at.owner_id,
COALESCE(pd.participants, '[]'::json) AS participants,
COALESCE(rc.ref_count, 0)::int AS ref_count
```

And add the JOINs:
```sql
LEFT JOIN participant_details pd ON pd.thread_id = at.id
LEFT JOIN ref_counts rc ON rc.thread_id::uuid = at.id
```

**Step 3: Apply same changes to `findThreadActivityForAgent`**

Same pattern — add `t.owner_id` to `agent_threads` CTE, add `participant_details` and `ref_counts` CTEs, update final SELECT.

**Step 4: Build and verify**

Run: `cd apps/backend && bun run build`
Expected: Clean build.

**Step 5: Commit**

```
feat(backend): enrich ThreadActivityRow with participants, owner_id, ref count
```

---

## Task 3: Enrich inbox and thread list API responses

Update the controller and inbox service to serialize the new fields.

**Files:**
- Modify: `apps/backend/src/api/service/inbox.service.ts`
- Modify: `apps/backend/src/api/controller/operator.controller.ts`

**Step 1: Update `InboxThread` interface in inbox.service.ts**

Add the new fields to the `InboxThread` interface at the top of `inbox.service.ts`:

```typescript
interface InboxThread {
  thread_id: string;
  state: string;
  last_sequence: number | null;
  new_message_count: number;
  last_intent: string | null;
  last_body_preview: string | null;
  refs: Array<{ type: string; target_id: string; version?: number }>;
  updated_at: Date;
  owner_id: string;
  participants: Array<{ agent_id: string; alias: string | null }>;
  ref_count: number;
}
```

**Step 2: Update `assembleResult` to map the new fields**

In the `assembleResult` method's thread mapping, add:

```typescript
owner_id: r.owner_id,
participants: r.participants ?? [],
ref_count: r.ref_count ?? 0,
```

**Step 3: Update operator thread list serialization in controller**

In `operator.controller.ts`, in the `listThreads` method, add to the thread mapping:

```typescript
participants: r.participants ?? [],
ref_count: r.ref_count ?? 0,
```

**Step 4: Build and verify**

Run: `cd apps/backend && bun run build`
Expected: Clean build.

**Step 5: Commit**

```
feat(backend): serialize participant details and ref count in inbox/thread responses
```

---

## Task 4: Add thread_count and description to asset responses

Enrich `findAssetUpdatesForOwner` with thread count and description. Also enrich the `getAssets` operator endpoint.

**Files:**
- Modify: `apps/backend/src/db/repositories/asset.repository.ts`
- Modify: `apps/backend/src/api/controller/operator.controller.ts`
- Modify: `apps/backend/src/api/service/inbox.service.ts`

**Step 1: Update `AssetUpdateRow` interface**

```typescript
export interface AssetUpdateRow {
  asset_id: string;
  title: string | null;
  updated_at: Date;
  new_version_count: number;
  latest_version: number;
  description: string | null;
  thread_count: number;
}
```

**Step 2: Update `findAssetUpdatesForOwner` query**

Add `LEFT(a.description, 80) AS description` to the SELECT, and add a subquery for thread_count. The thread count comes from refs that point to this asset:

```sql
SELECT
  a.public_id AS asset_id,
  a.title,
  a.updated_at,
  COUNT(av.id)::int AS new_version_count,
  MAX(av.version)::int AS latest_version,
  LEFT(a.description, 80) AS description,
  COALESCE(tc.thread_count, 0)::int AS thread_count
FROM asset a
JOIN asset_version av ON av.asset_id = a.id AND av.created_at > ? AND av.version > 1
LEFT JOIN LATERAL (
  SELECT COUNT(DISTINCT r.owner_id)::int AS thread_count
  FROM ref r
  WHERE r.type = 'asset' AND r.target_id = a.public_id::text AND r.owner_type = 'thread'
) tc ON true
WHERE ${whereClause}
GROUP BY a.id, a.public_id, a.title, a.updated_at, a.description, tc.thread_count
ORDER BY a.updated_at DESC
LIMIT ?
```

**Step 3: Update `InboxAsset` in inbox.service.ts**

```typescript
interface InboxAsset {
  asset_id: string;
  title: string | null;
  new_version_count: number;
  latest_version: number;
  updated_at: Date;
  description: string | null;
  thread_count: number;
}
```

Map the new fields in `assembleResult`:
```typescript
description: r.description ?? null,
thread_count: r.thread_count ?? 0,
```

**Step 4: Enrich `getAssets` operator endpoint**

In `operator.controller.ts`, the `getAssets` method currently uses `assetService.findByOwner()` which returns raw `Asset` entities. We need to add thread_count. Two approaches:

Add a post-query enrichment step. After fetching assets, batch-query ref counts:

```typescript
@Auth('user')
@Get('operator/assets')
async getAssets(
  @AuthUser() user: { id: string },
  @Query('since') since?: string,
  @Query('limit') limit?: string,
  @Query('type') type?: string,
  @Query('archived') archived?: string,
  @Query('include_archived') includeArchived?: string,
) {
  const agent = await this.requireBoundAgent(user.id);
  const assets = await this.assetService.findByOwner(agent.id, {
    since: since ? new Date(since) : undefined,
    limit: limit ? parseInt(limit, 10) : undefined,
    type,
    archived: archived === 'true',
    includeArchived: includeArchived === 'true',
  });

  const publicIds = assets.map((a) => a.publicId);
  const threadCounts = publicIds.length > 0
    ? await this.refService.countThreadsByAssets(publicIds)
    : new Map<string, number>();

  return {
    ok: true,
    data: assets.map((a) => ({
      id: a.publicId,
      title: a.title ?? null,
      description: a.description ? a.description.slice(0, 80) : null,
      type: a.type,
      mimeType: a.mimeType ?? null,
      state: a.state,
      versionCount: a.versionCount,
      threadCount: threadCounts.get(a.publicId) ?? 0,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    })),
  };
}
```

**Step 5: Add `countThreadsByAssets` to RefService**

In `apps/backend/src/api/service/ref.service.ts`, add:

```typescript
async countThreadsByAssets(assetPublicIds: string[]): Promise<Map<string, number>> {
  if (!assetPublicIds.length) return new Map();
  const placeholders = assetPublicIds.map(() => '?').join(', ');
  const rows = await this.em.getConnection().execute<Array<{ target_id: string; thread_count: number }>>(
    `SELECT r.target_id, COUNT(DISTINCT r.owner_id)::int AS thread_count
     FROM ref r
     WHERE r.owner_type = 'thread' AND r.type = 'asset' AND r.target_id IN (${placeholders})
     GROUP BY r.target_id`,
    assetPublicIds,
  );
  return new Map(rows.map((r) => [r.target_id, r.thread_count]));
}
```

**Step 6: Build and verify**

Run: `cd apps/backend && bun run build`
Expected: Clean build.

**Step 7: Commit**

```
feat(backend): add thread count and description to asset responses
```

---

## Task 5: Add integration tests for enriched API responses

**Files:**
- Modify: `tests/integration/inbox.test.ts` (or create a new test file)

**Step 1: Write test for enriched inbox thread response**

Add a test that:
1. Creates two agents, registers them
2. Creates a thread with both as participants
3. Sends a message
4. Adds a ref to the thread
5. Fetches the operator inbox
6. Asserts the thread item has `participants` array with agent aliases, `owner_id`, and `ref_count`

**Step 2: Write test for enriched operator assets response**

Add a test that:
1. Creates an agent, publishes an asset
2. Creates a thread and adds a ref pointing to the asset
3. Fetches `GET /v0/operator/assets`
4. Asserts the asset item has `threadCount` and `description` fields

**Step 3: Write test for enriched thread list response**

Add a test that:
1. Creates a thread with participants
2. Fetches `GET /v0/operator/threads`
3. Asserts the thread row has `participants` array and `ref_count`

**Step 4: Run tests**

Run: `cd apps/backend && bun run build && cd ../.. && bun test`
Expected: All tests pass.

**Step 5: Commit**

```
test: add integration tests for enriched inbox/asset/thread responses
```

---

## Task 6: Update frontend types and API functions

**Files:**
- Modify: `apps/frontend/src/lib/operator.ts`
- Modify: `apps/frontend/src/_jotai/operator/operator.atoms.ts`

**Step 1: Update `InboxThread` type**

```typescript
export interface InboxThread {
  thread_id: string
  state: 'open' | 'closed'
  updated_at: string
  new_message_count: number
  last_sequence: number | null
  last_intent: string | null
  last_body_preview: string | null
  refs: Array<{ type: string; target_id: string; version?: number }>
  owner_id: string
  participants: Array<{ agent_id: string; alias: string | null }>
  ref_count: number
}
```

**Step 2: Update `InboxAsset` type**

```typescript
export interface InboxAsset {
  asset_id: string
  title: string | null
  updated_at: string
  new_version_count: number
  latest_version: number
  description: string | null
  thread_count: number
}
```

**Step 3: Update `OperatorAssetItem` type**

```typescript
export interface OperatorAssetItem {
  id: string
  title: string | null
  description: string | null
  type: string
  mimeType: string | null
  state: string
  versionCount: number
  threadCount: number
  createdAt: string
  updatedAt: string
}
```

**Step 4: Add thread list types and fetch function**

```typescript
export interface ThreadListItem {
  thread_id: string
  state: 'open' | 'closed'
  created_by: string
  owner_id: string
  participant_count: number
  participants: Array<{ agent_id: string; alias: string | null }>
  ref_count: number
  last_message_at: string | null
  last_message_preview: string | null
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface ThreadListData {
  threads: ThreadListItem[]
  total: number
}

export interface ThreadListFetchOpts {
  state?: 'open' | 'closed'
  limit?: number
  offset?: number
}

export async function fetchOperatorThreads(
  opts?: ThreadListFetchOpts,
): Promise<ThreadListData> {
  const params: Record<string, string | number> = {}
  if (opts?.state) params.state = opts.state
  if (opts?.limit) params.limit = opts.limit
  if (opts?.offset != null) params.offset = opts.offset
  const res = await api.get('/v0/operator/threads', { params })
  return res.data.data
}
```

**Step 5: Add thread list atoms**

In `apps/frontend/src/_jotai/operator/operator.atoms.ts`:

```typescript
import type { OperatorAgent, InboxItem, OperatorAssetItem, OperatorContact, ThreadListItem } from '@/lib/operator'

// ... existing atoms ...

export const operatorThreadsAtom = atom<ThreadListItem[]>([])
export const operatorThreadsLoadingAtom = atom<boolean>(false)
export const operatorThreadsTotalAtom = atom<number>(0)
```

**Step 6: Commit**

```
feat(frontend): add enriched types, thread list API function, and atoms
```

---

## Task 7: Create `ParticipantChips` reusable component

**Files:**
- Create: `apps/frontend/src/components/operator/ParticipantChips.tsx`

**Step 1: Create the component**

```typescript
interface ParticipantChipsProps {
  participants: Array<{ agent_id: string; alias: string | null }>
  ownerId?: string
  max?: number
}

export function ParticipantChips({
  participants,
  ownerId,
  max = 3,
}: ParticipantChipsProps) {
  const visible = participants.slice(0, max)
  const overflow = participants.length - max

  return (
    <div className="flex flex-wrap items-center gap-1">
      {visible.map((p) => {
        const label = p.alias || p.agent_id.slice(0, 8) + '...'
        const isOwner = ownerId && p.agent_id === ownerId
        return (
          <span
            key={p.agent_id}
            className="inline-flex items-center gap-1 rounded-full bg-foreground/5 px-2 py-0.5 text-[10px] font-medium text-foreground/50"
          >
            {label}
            {isOwner && (
              <span className="rounded bg-foreground/10 px-1 py-px text-[8px] uppercase text-foreground/40">
                owner
              </span>
            )}
          </span>
        )
      })}
      {overflow > 0 && (
        <span className="text-[10px] text-foreground/30">
          +{overflow} more
        </span>
      )}
    </div>
  )
}
```

**Step 2: Commit**

```
feat(frontend): add ParticipantChips reusable component
```

---

## Task 8: Create `ThreadFilters` component

**Files:**
- Create: `apps/frontend/src/components/operator/ThreadFilters.tsx`

**Step 1: Create the component**

Follow the same pattern as `InboxFilters.tsx` — state tabs, search input, plus an ownership toggle:

```typescript
import { Search } from 'lucide-react'
import { useRef, useCallback } from 'react'

const STATE_TABS = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
] as const

const OWNERSHIP_TABS = [
  { value: 'all', label: 'All' },
  { value: 'mine', label: 'Mine' },
  { value: 'participating', label: 'Participating' },
] as const

export type ThreadStateFilter = 'all' | 'open' | 'closed'
export type ThreadOwnershipFilter = 'all' | 'mine' | 'participating'

interface ThreadFiltersProps {
  stateFilter: ThreadStateFilter
  ownershipFilter: ThreadOwnershipFilter
  search: string
  onStateChange: (state: ThreadStateFilter) => void
  onOwnershipChange: (ownership: ThreadOwnershipFilter) => void
  onSearchChange: (q: string) => void
}

export function ThreadFilters({
  stateFilter,
  ownershipFilter,
  search,
  onStateChange,
  onOwnershipChange,
  onSearchChange,
}: ThreadFiltersProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => onSearchChange(value), 300)
    },
    [onSearchChange],
  )

  return (
    <div className="space-y-3 px-4 pb-2 pt-3">
      <div className="relative">
        <Search
          size={14}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground/25"
        />
        <input
          type="text"
          placeholder="Search threads..."
          defaultValue={search}
          onChange={handleSearch}
          className="w-full rounded-md border border-foreground/10 bg-foreground/[0.03] py-1.5 pl-8 pr-3 text-sm text-foreground/80 placeholder:text-foreground/25 focus:border-foreground/20 focus:outline-none"
        />
      </div>
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {STATE_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => onStateChange(tab.value)}
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
        <div className="h-4 w-px bg-foreground/10" />
        <div className="flex gap-1">
          {OWNERSHIP_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => onOwnershipChange(tab.value)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                ownershipFilter === tab.value
                  ? 'bg-foreground/10 text-foreground/80'
                  : 'text-foreground/35 hover:text-foreground/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```
feat(frontend): add ThreadFilters component with state/ownership/search
```

---

## Task 9: Create `OperatorThreadList` page component

**Files:**
- Create: `apps/frontend/src/components/operator/OperatorThreadList.tsx`

**Step 1: Create the component**

Follow the `OperatorAssetList.tsx` pattern — fetch on mount, filter locally for ownership, render rows with enriched metadata:

```typescript
import { useEffect, useCallback, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAtomValue, useSetAtom } from 'jotai'
import { MessageSquare, RefreshCw, Link2 } from 'lucide-react'
import { formatTimeAgo } from '@/utils/time'
import { operatorAgentAtom } from '@/_jotai/operator/operator.atoms'
import {
  operatorThreadsAtom,
  operatorThreadsLoadingAtom,
  operatorThreadsTotalAtom,
} from '@/_jotai/operator/operator.atoms'
import { fetchOperatorThreads } from '@/lib/operator'
import { ParticipantChips } from './ParticipantChips'
import {
  ThreadFilters,
  type ThreadStateFilter,
  type ThreadOwnershipFilter,
} from './ThreadFilters'

export function OperatorThreadList() {
  const threads = useAtomValue(operatorThreadsAtom)
  const loading = useAtomValue(operatorThreadsLoadingAtom)
  const agent = useAtomValue(operatorAgentAtom)
  const setThreads = useSetAtom(operatorThreadsAtom)
  const setLoading = useSetAtom(operatorThreadsLoadingAtom)
  const setTotal = useSetAtom(operatorThreadsTotalAtom)
  const navigate = useNavigate()

  const [stateFilter, setStateFilter] = useState<ThreadStateFilter>('all')
  const [ownershipFilter, setOwnershipFilter] =
    useState<ThreadOwnershipFilter>('all')
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setThreads([])
    setLoading(true)
    try {
      const params: Parameters<typeof fetchOperatorThreads>[0] = {
        limit: 100,
      }
      if (stateFilter !== 'all') params.state = stateFilter
      const data = await fetchOperatorThreads(params)
      setThreads(data.threads)
      setTotal(data.total)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [setThreads, setLoading, setTotal, stateFilter])

  useEffect(() => {
    load()
  }, [load])

  const filtered = threads.filter((t) => {
    if (ownershipFilter === 'mine' && t.owner_id !== agent?.agent_id)
      return false
    if (ownershipFilter === 'participating' && t.owner_id === agent?.agent_id)
      return false
    if (search) {
      const q = search.toLowerCase()
      const preview = (t.last_message_preview || '').toLowerCase()
      const id = t.thread_id.toLowerCase()
      if (!preview.includes(q) && !id.includes(q)) return false
    }
    return true
  })

  if (loading && threads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-8 w-8 animate-pulse rounded-full bg-foreground/5" />
        <p className="mt-3 text-xs text-foreground/25">Loading threads...</p>
      </div>
    )
  }

  return (
    <div>
      <ThreadFilters
        stateFilter={stateFilter}
        ownershipFilter={ownershipFilter}
        search={search}
        onStateChange={setStateFilter}
        onOwnershipChange={setOwnershipFilter}
        onSearchChange={setSearch}
      />
      <div className="flex items-center justify-end px-4 py-2">
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-foreground/40 transition-colors hover:bg-foreground/5 hover:text-foreground/60"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground/5">
            <MessageSquare size={18} className="text-foreground/15" />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground/30">
            No threads found
          </p>
          <p className="mt-1 text-[11px] text-foreground/20">
            Threads your agent participates in will appear here
          </p>
        </div>
      ) : (
        <div>
          {filtered.map((thread) => (
            <button
              key={thread.thread_id}
              type="button"
              onClick={() =>
                navigate({
                  to: '/operator/threads/$threadId',
                  params: { threadId: thread.thread_id },
                })
              }
              className="flex w-full items-start gap-3 border-b border-foreground/5 px-4 py-3 text-left transition-colors hover:bg-foreground/[0.03] active:bg-foreground/5"
            >
              <div
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                  thread.state === 'open'
                    ? 'bg-green-500'
                    : 'bg-foreground/20'
                }`}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-foreground/80">
                  {thread.last_message_preview ||
                    `Thread ${thread.thread_id.slice(0, 8)}`}
                </p>
                <div className="mt-1">
                  <ParticipantChips
                    participants={thread.participants}
                    ownerId={thread.owner_id}
                  />
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-xs text-foreground/30">
                  {thread.last_message_at
                    ? formatTimeAgo(thread.last_message_at)
                    : formatTimeAgo(thread.updated_at)}
                </span>
                <div className="flex items-center gap-2">
                  {thread.ref_count > 0 && (
                    <span className="flex items-center gap-1 text-[10px] text-foreground/30">
                      <Link2 size={10} />
                      {thread.ref_count} asset{thread.ref_count !== 1 ? 's' : ''}
                    </span>
                  )}
                  {thread.state === 'closed' && (
                    <span className="rounded-full bg-foreground/10 px-1.5 py-px text-[10px] font-medium text-foreground/40">
                      closed
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

**Step 2: Commit**

```
feat(frontend): add OperatorThreadList page component
```

---

## Task 10: Add Threads route and tab navigation

**Files:**
- Create: `apps/frontend/src/app/operator/threads/index.tsx`
- Modify: `apps/frontend/src/components/operator/OperatorShell.tsx`

**Step 1: Create the route file**

Create `apps/frontend/src/app/operator/threads/index.tsx`:

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { OperatorThreadList } from '@/components/operator/OperatorThreadList'

export const Route = createFileRoute('/operator/threads/')({
  component: OperatorThreadsPage,
})

function OperatorThreadsPage() {
  return <OperatorThreadList />
}
```

**Step 2: Add Threads tab to OperatorShell**

In `apps/frontend/src/components/operator/OperatorShell.tsx`, add the Threads tab:

```typescript
const tabs = [
  { label: 'Inbox', path: '/operator' },
  { label: 'Assets', path: '/operator/assets' },
  { label: 'Threads', path: '/operator/threads' },
  { label: 'Contacts', path: '/operator/contacts' },
]
```

Also update the tab active check to handle sub-routes. The current check is `pathname === tab.path` which won't highlight "Threads" when viewing `/operator/threads/some-id`. Change to:

```typescript
const active = tab.path === '/operator'
  ? pathname === '/operator'
  : pathname.startsWith(tab.path)
```

**Step 3: Verify the route loads**

Run: `cd apps/frontend && bun run dev`
Navigate to `/operator/threads` and verify the page renders.

**Step 4: Commit**

```
feat(frontend): add Threads tab and route to operator dashboard
```

---

## Task 11: Enrich `InboxCard` with participants, owner, ref count, thread count, description

**Files:**
- Modify: `apps/frontend/src/components/operator/InboxCard.tsx`

**Step 1: Update thread card rendering**

Add `ParticipantChips` below the preview text, `ref_count` display, and use `owner_id` for the owner badge. Import the new component:

```typescript
import { MessageSquare, FileText, X, Link2 } from 'lucide-react'
import { ParticipantChips } from './ParticipantChips'
```

In the thread card section, after the preview `<p>` and before the metadata `<div>`, add:

```tsx
{t.participants?.length > 0 && (
  <div className="mt-1">
    <ParticipantChips
      participants={t.participants}
      ownerId={t.owner_id}
    />
  </div>
)}
```

In the metadata row, add ref count:

```tsx
{t.ref_count > 0 && (
  <span className="flex items-center gap-1">
    <Link2 size={10} />
    {t.ref_count} asset{t.ref_count !== 1 ? 's' : ''}
  </span>
)}
```

**Step 2: Update asset card rendering**

Add description snippet and thread count. After the title `<p>`:

```tsx
{a.description && (
  <p className="mt-0.5 truncate text-xs text-foreground/30">
    {a.description}
  </p>
)}
```

In the metadata row, add thread count:

```tsx
{a.thread_count > 0 && (
  <span className="flex items-center gap-1">
    <MessageSquare size={10} />
    {a.thread_count} thread{a.thread_count !== 1 ? 's' : ''}
  </span>
)}
```

**Step 3: Update timestamp labels**

Change `{formatTimeAgo(t.updated_at)}` to show "last activity" context. Replace with:

```tsx
<span>Last activity {formatTimeAgo(t.updated_at)}</span>
```

Same for asset cards.

**Step 4: Commit**

```
feat(frontend): enrich InboxCard with participants, refs, threads, description
```

---

## Task 12: Enrich `OperatorAssetList` with thread count and description

**Files:**
- Modify: `apps/frontend/src/components/operator/OperatorAssetList.tsx`

**Step 1: Add thread count and description to asset rows**

Import icons:

```typescript
import { Package, RefreshCw, MessageSquare } from 'lucide-react'
```

In the asset row, after the title `<p>`, add the description if present:

```tsx
{asset.description && (
  <p className="mt-0.5 truncate text-xs text-foreground/30">
    {asset.description}
  </p>
)}
```

Update the timestamp line to include thread count:

```tsx
<p className="mt-0.5 text-xs text-foreground/35">
  Last activity {formatTimeAgo(asset.updatedAt)}
  {asset.threadCount > 0 && (
    <>
      {' · '}
      <span className="inline-flex items-center gap-0.5">
        <MessageSquare size={10} className="inline" />
        {asset.threadCount} thread{asset.threadCount !== 1 ? 's' : ''}
      </span>
    </>
  )}
</p>
```

**Step 2: Commit**

```
feat(frontend): enrich OperatorAssetList with thread count and description
```

---

## Task 13: Manual verification

**Step 1: Build backend**

Run: `cd apps/backend && bun run build`
Expected: Clean build.

**Step 2: Run tests**

Run: `bun test`
Expected: All tests pass including new ones from Task 5.

**Step 3: Start dev servers and verify UI**

Run backend: `cd apps/backend && bun run start:dev`
Run frontend: `cd apps/frontend && bun run dev`

Verify:
- [ ] Threads tab appears in navigation between Assets and Contacts
- [ ] Threads tab shows all threads with state dots, participant chips, owner badges, ref counts, last activity timestamps
- [ ] State filter (All/Open/Closed) works
- [ ] Ownership filter (All/Mine/Participating) works
- [ ] Search works
- [ ] Clicking a thread navigates to the thread detail page
- [ ] Inbox thread cards show participant chips, owner badge, ref count
- [ ] Inbox asset cards show description (when present) and thread count (when > 0)
- [ ] Assets tab shows description (when present) and thread count (when > 0)
- [ ] Assets without description show no empty space or label
- [ ] Tab highlighting works correctly on all routes including sub-routes

**Step 4: Commit any fixes**

```
fix: address issues found during manual verification
```
