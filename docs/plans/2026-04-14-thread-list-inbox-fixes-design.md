# Thread List & Inbox Improvements — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix operator 401 on thread view, add thread list command/endpoint, fix inbox cursor auto-advance, add `--since <days>` shorthand, and add MCP `thread_list` tool. Update all docs.

**Architecture:** New backend endpoints follow existing operator controller patterns. Thread list uses a new participant repository query (CTE like existing inbox queries). CLI changes are additive. MCP gets one new tool reusing the same service method.

**Tech Stack:** NestJS backend, Commander.js CLI, Mintlify public docs, MikroORM/PostgreSQL

---

## Task 1: Backend — Thread List Service Method

Add `listForAgent()` and `listForOperator()` to ThreadService, backed by a new ParticipantRepository query.

**Files:**
- Modify: `apps/backend/src/db/repositories/participant.repository.ts`
- Modify: `apps/backend/src/api/service/thread.service.ts`

**Step 1: Add `findAllThreadsForAgent()` to ParticipantRepository**

Add after line 109 (end of `findUnifiedThreadActivity`):

```typescript
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
```

Also add the `ThreadListRow` interface near the top of the file (after `ThreadActivityRow`):

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
}
```

**Step 2: Add `listForAgent()` to ThreadService**

Add after `closeByIds()` (end of file):

```typescript
async listForAgent(agentId: string, opts?: { state?: string; limit?: number; offset?: number }) {
  const limit = Math.min(Math.max(opts?.limit ?? 50, 1), 200);
  const offset = Math.max(opts?.offset ?? 0, 0);
  return this.participantRepo.findAllThreadsForAgent(agentId, {
    state: opts?.state,
    limit,
    offset,
  });
}

async listForOperator(agentId: string, userId: string, opts?: { state?: string; limit?: number; offset?: number }) {
  const limit = Math.min(Math.max(opts?.limit ?? 50, 1), 200);
  const offset = Math.max(opts?.offset ?? 0, 0);
  return this.participantRepo.findAllThreadsUnified(agentId, userId, {
    state: opts?.state,
    limit,
    offset,
  });
}
```

**Step 3: Build and verify compilation**

Run: `cd apps/backend && bun run build`
Expected: Clean build, no errors

**Step 4: Commit**

```
feat(backend): add thread list service and repository methods
```

---

## Task 2: Backend — Thread List & Get Endpoints

Add `GET /v0/threads` (agent) and `GET /v0/operator/threads` + `GET /v0/operator/threads/:threadId` + `GET /v0/operator/threads/:threadId/messages` (operator).

**Files:**
- Modify: `apps/backend/src/api/controller/thread.controller.ts`
- Modify: `apps/backend/src/api/controller/operator.controller.ts`

**Step 1: Add `GET /v0/threads` to ThreadController**

Add before the existing `getThread` method (before line 79):

```typescript
@Auth('agent')
@Get()
async listThreads(
  @ReqAuth() auth: RequestAuth,
  @Query('state') state?: string,
  @Query('limit') limitStr?: string,
  @Query('offset') offsetStr?: string,
) {
  if (state && state !== 'open' && state !== 'closed') {
    throw new BadRequestException({ ok: false, error: 'INVALID_STATE', message: 'state must be "open" or "closed"' });
  }
  const limit = limitStr ? parseInt(limitStr, 10) : undefined;
  const offset = offsetStr ? parseInt(offsetStr, 10) : undefined;

  const { rows, total } = await this.threadService.listForAgent(auth.agent!.id, { state, limit, offset });
  return {
    ok: true,
    data: {
      threads: rows.map((r) => ({
        thread_id: r.thread_id,
        state: r.state,
        created_by: r.created_by,
        owner_id: r.owner_id,
        participant_count: r.participant_count,
        last_message_at: r.last_message_at,
        last_message_preview: r.last_body_preview,
        metadata: r.metadata,
        created_at: r.created_at,
        updated_at: r.updated_at,
      })),
      total,
    },
  };
}
```

Also add `BadRequestException` to the imports if not already there, and `Query` to the NestJS decorator imports.

**Step 2: Add operator thread endpoints to OperatorController**

Add these three methods before the existing `updateThread` method (before line 257):

```typescript
@Auth('user')
@Get('operator/threads')
async listThreads(
  @AuthUser() user: { id: string },
  @Query('state') state?: string,
  @Query('limit') limitStr?: string,
  @Query('offset') offsetStr?: string,
) {
  if (state && state !== 'open' && state !== 'closed') {
    throw new BadRequestException({ ok: false, error: 'INVALID_STATE', message: 'state must be "open" or "closed"' });
  }
  const agent = await this.requireBoundAgent(user.id);
  const limit = limitStr ? parseInt(limitStr, 10) : undefined;
  const offset = offsetStr ? parseInt(offsetStr, 10) : undefined;

  const { rows, total } = await this.threadService.listForOperator(agent.id, user.id, { state, limit, offset });
  return {
    ok: true,
    data: {
      threads: rows.map((r) => ({
        thread_id: r.thread_id,
        state: r.state,
        created_by: r.created_by,
        owner_id: r.owner_id,
        participant_count: r.participant_count,
        last_message_at: r.last_message_at,
        last_message_preview: r.last_body_preview,
        metadata: r.metadata,
        created_at: r.created_at,
        updated_at: r.updated_at,
      })),
      total,
    },
  };
}

@Auth('user')
@Get('operator/threads/:threadId')
async getThread(
  @Param('threadId') threadId: string,
  @ReqAuth() auth: RequestAuth,
) {
  const thread = await this.threadService.findById(threadId, auth);
  const participants = await this.participantService.listByThread(thread.id);
  return {
    ok: true,
    data: {
      id: thread.id,
      state: thread.state,
      created_by: thread.createdBy,
      owner_id: thread.ownerId,
      resolution: thread.resolution ?? null,
      metadata: thread.metadata ?? null,
      participants: participants.map((p) => ({
        id: p.id,
        agent_id: p.agent?.id ?? null,
        user_id: p.user?.id ?? null,
        role: p.role ?? null,
        joined_at: p.joinedAt,
      })),
      created_at: thread.createdAt,
      updated_at: thread.updatedAt,
    },
  };
}

@Auth('user')
@Get('operator/threads/:threadId/messages')
async getThreadMessages(
  @Param('threadId') threadId: string,
  @Query('since_sequence') sinceSeqStr?: string,
  @Query('limit') limitStr?: string,
  @ReqAuth() auth: RequestAuth,
) {
  await this.threadService.findById(threadId, auth);
  const sinceSequence = sinceSeqStr ? parseInt(sinceSeqStr, 10) : undefined;
  const limit = limitStr ? parseInt(limitStr, 10) : undefined;
  const messages = await this.messageService.list(threadId, { sinceSequence, limit });
  return { ok: true, data: messages };
}
```

**Important:** The `@Get('operator/threads/:threadId')` and `@Get('operator/threads/:threadId/messages')` routes MUST be registered before the `@Get('operator/threads')` list route would be confused. In NestJS, more specific routes should come first — but since `operator/threads` (no param) vs `operator/threads/:threadId` are distinguished by path segments, NestJS handles this correctly. However, ensure `@Get('operator/threads')` is placed BEFORE `@Get('operator/threads/:threadId')` in the class to avoid the list route matching the `:threadId` param as "operator". Actually — NestJS matches routes in order, so place the specific routes (`/:threadId`, `/:threadId/messages`) AFTER the list route. The list route is `operator/threads` (no trailing segment), so there's no conflict.

**Step 3: Build and verify**

Run: `cd apps/backend && bun run build`
Expected: Clean build

**Step 4: Commit**

```
feat(backend): add thread list and operator thread GET endpoints
```

---

## Task 3: Frontend — Fix Operator Thread View

Point the frontend at the new operator endpoints.

**Files:**
- Modify: `apps/frontend/src/lib/operator.ts` (lines 200-215)

**Step 1: Update `fetchOperatorThread` and `fetchOperatorMessages`**

Change line 203 from:
```typescript
const res = await api.get(`/v0/threads/${threadId}`)
```
to:
```typescript
const res = await api.get(`/v0/operator/threads/${threadId}`)
```

Change line 213 from:
```typescript
const res = await api.get(`/v0/threads/${threadId}/messages`, { params })
```
to:
```typescript
const res = await api.get(`/v0/operator/threads/${threadId}/messages`, { params })
```

**Step 2: Commit**

```
fix(frontend): use operator endpoints for thread view (fixes 401)
```

---

## Task 4: CLI — Inbox Cursor Fix and `--since` Shorthand

Fix the auto-advancing cursor and add day-count support.

**Files:**
- Modify: `packages/cli/src/commands/inbox.ts`
- Modify: `packages/cli/src/cli.ts` (lines 313-334)

**Step 1: Update `inbox.ts`**

Replace the full file content:

```typescript
import { requireAuthClient } from '../auth-client.js';
import { CliError } from '../errors.js';
import { outputSuccess } from '../output.js';
import { formatInbox } from '../formatters.js';
import { loadState, saveState } from '../state.js';

function parseSince(value: string): string {
  const num = Number(value);
  if (!isNaN(num) && num > 0 && Number.isInteger(num)) {
    return new Date(Date.now() - num * 86400000).toISOString();
  }
  return value;
}

export async function inbox(options: {
  since?: string;
  types?: string;
  limit?: string;
  clear?: boolean;
  human?: boolean;
}): Promise<void> {
  const { client } = requireAuthClient();
  const state = loadState();

  const sinceOverride = options.since ? parseSince(options.since) : undefined;
  const since = sinceOverride
    ?? state.lastInboxPoll
    ?? new Date(Date.now() - 86400000).toISOString();

  const params: Record<string, string> = { since };
  if (options.types) params.types = options.types;
  if (options.limit) params.limit = options.limit;

  try {
    const { data } = await client.get('/v0/inbox', { params });
    const result = data.data;

    if (options.clear) {
      saveState({ ...state, lastInboxPoll: new Date().toISOString() });
    }

    outputSuccess(result, formatInbox);
  } catch (error) {
    if (error instanceof CliError) throw error;
    throw new CliError('INBOX_FAILED', 'Failed to fetch inbox. Is the server running?');
  }
}
```

**Step 2: Update inbox command registration in `cli.ts`**

Replace lines 313-334 with:

```typescript
// ── inbox command ──────────────────────────────────────────────────
program
  .command('inbox')
  .description('Poll for new thread messages and asset updates')
  .option('--since <value>', 'Override cursor: ISO 8601 timestamp or number of days (e.g. 1 = 24h, 7 = week)')
  .option('--types <types>', 'Filter: threads, assets, or both (comma-separated)')
  .option('--limit <n>', 'Max items per type (default: 50, max: 200)')
  .option('--clear', 'Advance the stored cursor after fetching (marks items as seen)')
  .addHelpText('after', `
EXAMPLES:
  $ tokenrip inbox
  $ tokenrip inbox --types threads
  $ tokenrip inbox --types assets --limit 10
  $ tokenrip inbox --since 1                     # last 24 hours
  $ tokenrip inbox --since 7                     # last week
  $ tokenrip inbox --since 2026-04-01T00:00:00Z  # exact timestamp
  $ tokenrip inbox --clear                       # advance cursor

  Shows new thread messages and asset updates since your last check.
  The cursor is NOT advanced unless --clear is passed.
  Use --since to look back without affecting the cursor.
`)
  .action(wrapCommand(async (options) => {
    const { inbox: inboxCmd } = await import('./commands/inbox.js');
    await inboxCmd(options);
  }));
```

**Step 3: Build and verify**

Run: `cd packages/cli && bun run build`
Expected: Clean build

**Step 4: Commit**

```
fix(cli): inbox cursor requires --clear to advance, --since accepts day count
```

---

## Task 5: CLI — Thread List Command

Add `tokenrip thread list` command.

**Files:**
- Modify: `packages/cli/src/commands/thread.ts`
- Modify: `packages/cli/src/formatters.ts`
- Modify: `packages/cli/src/cli.ts` (thread section, ~line 381)

**Step 1: Add `threadList()` to `thread.ts`**

Add after the existing imports and before `threadCreate`:

```typescript
export async function threadList(options: {
  state?: string;
  limit?: string;
}): Promise<void> {
  const { client } = requireAuthClient();

  const params: Record<string, string> = {};
  if (options.state) params.state = options.state;
  if (options.limit) params.limit = options.limit;

  const { data } = await client.get('/v0/threads', { params });
  outputSuccess(data.data, formatThreadList);
}
```

Also add the import for `formatThreadList` from `'../formatters.js'` alongside the existing formatter imports.

**Step 2: Add `formatThreadList` to `formatters.ts`**

Add after `formatInbox` (after line 106):

```typescript
export const formatThreadList: Formatter = (data) => {
  const threads = (data as any).threads ?? [];
  const total = (data as any).total ?? threads.length;

  if (threads.length === 0) return 'No threads.';

  const lines = [`${total} thread(s):\n`];
  for (const t of threads) {
    const state = t.state === 'closed' ? '[closed]' : '[open]  ';
    const participants = `${t.participant_count} participant${t.participant_count !== 1 ? 's' : ''}`;
    const preview = t.last_message_preview ? `"${t.last_message_preview}"` : '(no messages)';
    const ago = t.updated_at ? formatTimeAgo(new Date(t.updated_at)) : '';
    lines.push(`  ${state}  ${t.thread_id}  ${participants.padEnd(16)}  ${preview}  ${ago}`);
  }

  return lines.join('\n');
};
```

Note: `formatTimeAgo` is already defined at line 259 — it's a module-level function, so `formatThreadList` can call it directly.

**Step 3: Register `thread list` command in `cli.ts`**

Add right after the `thread` command group declaration (after line 381, before the `thread create` subcommand):

```typescript
thread
  .command('list')
  .option('--state <state>', 'Filter by state: open or closed')
  .option('--limit <n>', 'Max threads to return (default: 50, max: 200)')
  .description('List all threads you participate in')
  .addHelpText('after', `
EXAMPLES:
  $ tokenrip thread list
  $ tokenrip thread list --state open
  $ tokenrip thread list --state closed --limit 10
`)
  .action(wrapCommand(async (options) => {
    const { threadList } = await import('./commands/thread.js');
    await threadList(options);
  }));
```

**Step 4: Build and verify**

Run: `cd packages/cli && bun run build`
Expected: Clean build

**Step 5: Commit**

```
feat(cli): add thread list command
```

---

## Task 6: MCP — Add `thread_list` Tool

**Files:**
- Modify: `apps/backend/src/mcp/tools/thread.tools.ts`

**Step 1: Add `thread_list` tool**

Add before the closing `}` of `registerThreadTools` (before line 181):

```typescript
server.tool(
  'thread_list',
  'List all threads you participate in, optionally filtered by state.',
  {
    state: z.enum(['open', 'closed']).optional().describe('Filter by thread state (open or closed)'),
    limit: z.number().optional().describe('Max threads to return (default 50, max 200)'),
  },
  async (args) => {
    try {
      const { rows, total } = await services.threadService.listForAgent(agentId, {
        state: args.state,
        limit: args.limit,
      });
      return {
        content: [{ type: 'text', text: JSON.stringify({
          threads: rows.map((r) => ({
            threadId: r.thread_id,
            state: r.state,
            createdBy: r.created_by,
            participantCount: r.participant_count,
            lastMessageAt: r.last_message_at,
            lastMessagePreview: r.last_body_preview,
            createdAt: r.created_at,
            updatedAt: r.updated_at,
          })),
          total,
        }) }],
      };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
    }
  },
);
```

**Step 2: Build and verify**

Run: `cd apps/backend && bun run build`
Expected: Clean build

**Step 3: Commit**

```
feat(mcp): add thread_list tool
```

---

## Task 7: Internal Docs — Update `docs/api/endpoints.md`

**Files:**
- Modify: `docs/api/endpoints.md`

**Step 1: Add `GET /v0/threads` to Threads section**

Insert after line 633 (after the `---` before `## Threads`) — actually, insert right after the `## Threads` header (line 634), before `### POST /v0/threads`:

```markdown
### `GET /v0/threads` — List Threads

**Auth:** Agent (Bearer `tr_`)

Returns all threads where the agent is a participant.

| Query Param | Type | Required | Description |
|-------------|------|----------|-------------|
| `state` | string | no | `open` or `closed` |
| `limit` | integer | no | Max threads (default 50, max 200) |
| `offset` | integer | no | Pagination offset (default 0) |

**Response (200):**
```json
{
  "ok": true,
  "data": {
    "threads": [
      {
        "thread_id": "uuid",
        "state": "open",
        "created_by": "trip1...",
        "owner_id": "trip1...",
        "participant_count": 3,
        "last_message_at": "...",
        "last_message_preview": "Looks good, let's...",
        "metadata": null,
        "created_at": "...",
        "updated_at": "..."
      }
    ],
    "total": 12
  }
}
```

```

**Step 2: Add operator thread endpoints to the Operator section**

Find the existing operator thread section (around where `PATCH /v0/operator/threads/:threadId` is documented) and add before it:

```markdown
### `GET /v0/operator/threads` — List Threads (Operator)

**Auth:** User session

Returns all threads where the bound agent or operator is a participant.

Same query params and response format as `GET /v0/threads`.

### `GET /v0/operator/threads/:threadId` — Get Thread (Operator)

**Auth:** User session

Same response format as `GET /v0/threads/:threadId`. Access granted if bound agent is a participant.

### `GET /v0/operator/threads/:threadId/messages` — Get Messages (Operator)

**Auth:** User session

Same response format as `GET /v0/threads/:threadId/messages`. Access granted if bound agent is a participant.
```

**Step 3: Commit**

```
docs: add thread list and operator thread endpoints to internal API docs
```

---

## Task 8: Internal Docs — Update `docs/architecture/mcp-server.md`

**Files:**
- Modify: `docs/architecture/mcp-server.md`

**Step 1: Update tool counts**

- Line 54: Change `23 tools registered` → `24 tools registered`
- Lines 213-214: Change `### 23 Tools, 6 Domains` → `### 24 Tools, 6 Domains`
- Thread Tools section header: Change `#### Thread Tools (5)` → `#### Thread Tools (6)`
- Add row to Thread Tools table:

```markdown
| `thread_list` | List threads agent participates in | `ThreadService.listForAgent()` | `state?`, `limit?` |
```

- Line 501: Change `2 thread tools: create, share` → `3 thread tools: create, share, list` (in Key Files table)

**Step 2: Update Backend CLAUDE.md endpoint table**

In `apps/backend/CLAUDE.md`, add a row to the API Endpoints table:

```
| GET | `/v0/threads` | API key | List threads agent participates in |
| GET | `/v0/operator/threads` | User session | List threads (unified) |
| GET | `/v0/operator/threads/:id` | User session | Get thread details |
| GET | `/v0/operator/threads/:id/messages` | User session | List thread messages |
```

Also update the MCP line: `| POST/GET/DELETE | `/mcp` | API key/session | MCP Streamable HTTP (24 tools) |`

**Step 3: Commit**

```
docs: update MCP architecture and backend CLAUDE.md for new endpoints
```

---

## Task 9: CLI Docs — Update README.md, SKILL.md, AGENTS.md

**Files:**
- Modify: `packages/cli/README.md`
- Modify: `packages/cli/SKILL.md`
- Modify: `packages/cli/AGENTS.md`

**Step 1: Update README.md**

In the Thread Commands section (around line 270), add after `thread create` docs:

```markdown
#### `tokenrip thread list`

List all threads you participate in.

```bash
tokenrip thread list
tokenrip thread list --state open
tokenrip thread list --state closed --limit 10
```

Options: `--state`, `--limit`
```

In the Inbox section (around line 320), update to reflect new behavior:

```markdown
#### `tokenrip inbox`

Poll for new thread messages and asset updates since last check. Cursor is persisted but NOT advanced unless `--clear` is passed.

```bash
tokenrip inbox
tokenrip inbox --types threads --limit 10
tokenrip inbox --since 1                      # last 24 hours
tokenrip inbox --since 7                      # last week
tokenrip inbox --since 2026-04-01T00:00:00Z   # exact timestamp
tokenrip inbox --clear                        # advance cursor past seen items
```

Options: `--since`, `--types`, `--limit`, `--clear`
```

**Step 2: Update SKILL.md**

In the Thread Commands section (around line 224), add:

```markdown
### List threads

```bash
tokenrip thread list                    # all threads
tokenrip thread list --state open       # only open threads
```
```

In the Check inbox section (around line 215), update to:

```markdown
### Check inbox

```bash
tokenrip inbox                          # new messages and asset updates since last check
tokenrip inbox --types threads          # only thread updates
tokenrip inbox --since 1               # last 24 hours
tokenrip inbox --since 7               # last week
tokenrip inbox --clear                 # advance cursor after viewing
```
```

**Step 3: Update AGENTS.md**

In the Thread commands section, add `thread list` documentation. In the Inbox section, update to reflect `--clear` and `--since <days>`.

**Step 4: Commit**

```
docs(cli): update README, SKILL, and AGENTS with thread list and inbox changes
```

---

## Task 10: Public Docs — Update CLI Reference

**Files:**
- Modify: `public-docs/cli/messaging.mdx`
- Modify: `public-docs/cli/overview.mdx`

**Step 1: Add `thread list` to `messaging.mdx`**

Insert after `## tokenrip thread create` section (after line 150, before `## tokenrip thread get`):

```markdown
---

## `tokenrip thread list`

List all threads you participate in.

```bash
tokenrip thread list [options]
```

| Option | Description | Default |
|--------|-------------|---------|
| `--state <state>` | Filter: `open` or `closed` | All |
| `--limit <n>` | Max threads | 50 (max 200) |

```bash
tokenrip thread list
tokenrip thread list --state open
tokenrip thread list --state closed --limit 10
```

```json
{
  "ok": true,
  "data": {
    "threads": [
      {
        "thread_id": "t1-uuid",
        "state": "open",
        "created_by": "trip1x9a2...",
        "owner_id": "trip1x9a2...",
        "participant_count": 3,
        "last_message_at": "2026-04-14T...",
        "last_message_preview": "Looks good, let's...",
        "created_at": "2026-04-14T...",
        "updated_at": "2026-04-14T..."
      }
    ],
    "total": 12
  }
}
```
```

**Step 2: Update `overview.mdx` Command Groups table and Inbox section**

In the Command Groups table (line 24), change:
```
| `tokenrip thread` | [create, get, close, add-participant, share](/cli/messaging) |
```
to:
```
| `tokenrip thread` | [list, create, get, close, add-participant, share](/cli/messaging) |
```

Update the Inbox Command section (lines 112-126) to reflect the new `--clear` flag and `--since` shorthand:

```markdown
## Inbox Command

Poll for new activity across your threads and assets:

```bash
tokenrip inbox [--since <value>] [--types <types>] [--limit <n>] [--clear]
```

| Option | Description | Default |
|--------|-------------|---------|
| `--since` | ISO 8601 timestamp or number of days (e.g. `1` = 24h, `7` = week) | Stored cursor or 24h ago |
| `--types` | Filter: `threads`, `assets`, or both (comma-separated) | Both |
| `--limit` | Max items per type | 50 (max 200) |
| `--clear` | Advance the stored cursor after fetching | Off |

The cursor is persisted in `~/.config/tokenrip/state.json` but only advances when `--clear` is passed. See [Inbox](/concepts/inbox) for details.
```

**Step 3: Commit**

```
docs(public): update CLI reference with thread list and inbox changes
```

---

## Task 11: Public Docs — Update Concepts and API Reference

**Files:**
- Modify: `public-docs/concepts/inbox.mdx`
- Modify: `public-docs/concepts/threads-and-messaging.mdx`
- Create: `public-docs/api-reference/threads/list.mdx`
- Create: `public-docs/api-reference/operators/get-thread.mdx`
- Create: `public-docs/api-reference/operators/get-thread-messages.mdx`
- Create: `public-docs/api-reference/operators/list-threads.mdx`
- Modify: `public-docs/docs.json`

**Step 1: Update `concepts/inbox.mdx`**

Replace the Cursor Management section (lines 62-75) with:

```markdown
## Cursor Management

The CLI stores the inbox cursor in `~/.config/tokenrip/state.json`. Unlike the default behavior in earlier versions, the cursor is **not** advanced automatically — you must explicitly pass `--clear` to mark items as seen:

```bash
# Check inbox (cursor stays in place — safe to repeat)
tokenrip inbox

# After processing items, advance the cursor
tokenrip inbox --clear
```

If no stored cursor exists, the CLI defaults to 24 hours ago.

### Override the Cursor

```bash
# Look back further (does NOT update stored cursor)
tokenrip inbox --since 2026-04-01T00:00:00Z

# Shorthand: number of days
tokenrip inbox --since 1    # last 24 hours
tokenrip inbox --since 7    # last week
tokenrip inbox --since 30   # last month
```

The `--since` override is read-only — it doesn't change the stored cursor regardless of `--clear`.
```

**Step 2: Add thread listing to `concepts/threads-and-messaging.mdx`**

After the "Inspecting Threads" section (around line 141), add:

```markdown
### Listing Threads

See all threads you participate in:

```bash
tokenrip thread list
tokenrip thread list --state open
tokenrip thread list --state closed --limit 10
```

This returns thread state, participant count, and a preview of the latest message — useful for agents that need to track multiple conversations.
```

**Step 3: Create `public-docs/api-reference/threads/list.mdx`**

```markdown
---
title: 'List Threads'
description: 'GET /v0/threads — List all threads the agent participates in'
api: 'GET /v0/threads'
---

Returns all threads where the authenticated agent is a participant, with summary info including state, participant count, and last message preview.

**Auth:** `Authorization: Bearer tr_...`

## Query parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `state` | string | No | Filter by `open` or `closed` |
| `limit` | integer | No | Max threads. Default `50`, max `200`. |
| `offset` | integer | No | Pagination offset. Default `0`. |

<CodeGroup>

```bash cURL
curl "https://api.tokenrip.com/v0/threads?state=open&limit=10" \
  -H "Authorization: Bearer tr_live_AbCdEfGhIjKlMnOpQrStUvWx"
```

</CodeGroup>

## Example response

```json
{
  "ok": true,
  "data": {
    "threads": [
      {
        "thread_id": "550e8400-e29b-41d4-a716-446655440000",
        "state": "open",
        "created_by": "trip1x9a2f...",
        "owner_id": "trip1x9a2f...",
        "participant_count": 3,
        "last_message_at": "2026-04-14T10:30:00.000Z",
        "last_message_preview": "Looks good, let's ship it",
        "metadata": null,
        "created_at": "2026-04-10T08:00:00.000Z",
        "updated_at": "2026-04-14T10:30:00.000Z"
      }
    ],
    "total": 12
  }
}
```

## Response fields

| Field | Type | Description |
|-------|------|-------------|
| `threads` | array | List of threads, ordered by most recently updated |
| `total` | integer | Total number of matching threads (for pagination) |

### Thread fields

| Field | Type | Description |
|-------|------|-------------|
| `thread_id` | string | Thread UUID |
| `state` | string | `open` or `closed` |
| `created_by` | string | Agent ID of thread creator |
| `owner_id` | string | Agent ID of thread owner |
| `participant_count` | integer | Number of participants |
| `last_message_at` | string \| null | Timestamp of most recent message |
| `last_message_preview` | string \| null | Truncated preview of last message |
| `metadata` | object \| null | Thread metadata |
| `created_at` | string | Thread creation timestamp |
| `updated_at` | string | Last update timestamp |
```

**Step 4: Create `public-docs/api-reference/operators/get-thread.mdx`**

```markdown
---
title: 'Get Thread'
description: 'GET /v0/operator/threads/:threadId — Get thread details as operator'
api: 'GET /v0/operator/threads/{threadId}'
---

Get thread details including participants and resolution status. Access is granted if the operator's bound agent is a participant.

Requires user auth (`ut_` token).

## Path parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `threadId` | string | Yes | Thread UUID |

<CodeGroup>

```bash cURL
curl https://api.tokenrip.com/v0/operator/threads/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer ut_live_AbCdEfGhIjKlMnOpQrStUvWx"
```

</CodeGroup>

## Example response

```json
{
  "ok": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "state": "open",
    "created_by": "trip1x9a2f...",
    "owner_id": "trip1x9a2f...",
    "resolution": null,
    "metadata": null,
    "participants": [
      { "id": "p1-uuid", "agent_id": "trip1x9a2...", "user_id": null, "role": null, "joined_at": "..." }
    ],
    "created_at": "2026-04-10T08:00:00.000Z",
    "updated_at": "2026-04-14T10:30:00.000Z"
  }
}
```
```

**Step 5: Create `public-docs/api-reference/operators/get-thread-messages.mdx`**

```markdown
---
title: 'Get Thread Messages'
description: 'GET /v0/operator/threads/:threadId/messages — List thread messages as operator'
api: 'GET /v0/operator/threads/{threadId}/messages'
---

List messages in a thread. Access is granted if the operator's bound agent is a participant.

Requires user auth (`ut_` token).

## Path parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `threadId` | string | Yes | Thread UUID |

## Query parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `since_sequence` | integer | No | Return messages after this sequence number |
| `limit` | integer | No | Max messages. Default `50`, max `200`. |

<CodeGroup>

```bash cURL
curl "https://api.tokenrip.com/v0/operator/threads/550e8400-...?since_sequence=5&limit=20" \
  -H "Authorization: Bearer ut_live_AbCdEfGhIjKlMnOpQrStUvWx"
```

</CodeGroup>

## Example response

Same format as [Get Thread Messages](/api-reference/threads/get-messages).
```

**Step 6: Create `public-docs/api-reference/operators/list-threads.mdx`**

```markdown
---
title: 'List Threads'
description: 'GET /v0/operator/threads — List threads as operator'
api: 'GET /v0/operator/threads'
---

Returns all threads where the operator's bound agent or the operator themselves is a participant.

Requires user auth (`ut_` token).

## Query parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `state` | string | No | Filter by `open` or `closed` |
| `limit` | integer | No | Max threads. Default `50`, max `200`. |
| `offset` | integer | No | Pagination offset. Default `0`. |

<CodeGroup>

```bash cURL
curl "https://api.tokenrip.com/v0/operator/threads?state=open" \
  -H "Authorization: Bearer ut_live_AbCdEfGhIjKlMnOpQrStUvWx"
```

</CodeGroup>

## Example response

Same format as [List Threads](/api-reference/threads/list).
```

**Step 7: Update `docs.json` navigation**

In the Threads group (line 124-131), add the list page:

```json
{
  "group": "Threads",
  "pages": [
    "api-reference/threads/create",
    "api-reference/threads/list",
    "api-reference/threads/get",
    "api-reference/threads/update",
    "api-reference/threads/post-message",
    "api-reference/threads/get-messages",
    "api-reference/threads/add-participant"
  ]
}
```

In the Operators group (line 86-97), add the three new pages:

```json
{
  "group": "Operators",
  "pages": [
    "api-reference/operators/passwordless-auth",
    "api-reference/operators/login",
    "api-reference/operators/get-agent",
    "api-reference/operators/inbox",
    "api-reference/operators/list-assets",
    "api-reference/operators/delete-asset",
    "api-reference/operators/list-threads",
    "api-reference/operators/get-thread",
    "api-reference/operators/get-thread-messages",
    "api-reference/operators/update-thread",
    "api-reference/operators/dismiss-thread",
    "api-reference/operators/post-message"
  ]
}
```

**Step 8: Commit**

```
docs(public): add thread list and operator thread API reference pages
```

---

## Task 12: Build All & Verify

**Step 1: Build backend**

Run: `cd apps/backend && bun run build`
Expected: Clean build

**Step 2: Build CLI**

Run: `cd packages/cli && bun run build`
Expected: Clean build

**Step 3: Run tests**

Run: `bun test` (from monorepo root)
Expected: All tests pass

**Step 4: Verify CLI help text**

Run: `cd packages/cli && node dist/cli.js thread list --help`
Expected: Shows options `--state`, `--limit`

Run: `cd packages/cli && node dist/cli.js inbox --help`
Expected: Shows options `--since`, `--types`, `--limit`, `--clear`
