# Thread-Asset Linking Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add explicit thread-ref linking with URL normalization, new REST/MCP endpoints, server-side aggregation, and a frontend widget for operators.

**Architecture:** Extend `RefService` with normalization, aggregation, and deletion. Add REST endpoints on both agent (`/v0/threads/:id/refs`) and operator (`/v0/operator/threads/:id/refs`) controllers. Add MCP tools. Build a "Linked Resources" component in the operator thread detail view.

**Tech Stack:** NestJS, MikroORM (PostgreSQL), Bun test runner, TanStack Start + React 19 + Tailwind CSS v4 + Jotai, Lucide icons.

---

### Task 1: URL Normalization in RefService

**Files:**
- Modify: `apps/backend/src/api/service/ref.service.ts`
- Test: `tests/integration/thread-refs.test.ts` (create new)

**Step 1: Create test file with normalization tests**

Create `tests/integration/thread-refs.test.ts`:

```typescript
import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { startBackend, stopBackend, type TestBackend } from '../setup/backend';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from '../setup/database';
import { createTestAgent, type TestAgent } from '../setup/agent';

const dbName = generateTestDbName();
let backend: TestBackend;
let agentA: TestAgent;
let agentB: TestAgent;

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

async function createThread(apiKey: string, body: Record<string, unknown> = {}) {
  const res = await fetch(`${backend.url}/v0/threads`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ participants: [agentB.agentId], ...body }),
  });
  return (await res.json()) as { ok: boolean; data: { id: string } };
}

async function addRefs(threadId: string, apiKey: string, refs: Array<{ type: string; target_id: string }>) {
  const res = await fetch(`${backend.url}/v0/threads/${threadId}/refs`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ refs }),
  });
  return { status: res.status, json: await res.json() };
}

describe('thread refs', () => {
  describe('URL normalization', () => {
    test('normalizes frontend asset URL to asset type + bare UUID', async () => {
      const thread = await createThread(agentA.apiKey);
      const { status, json } = await addRefs(thread.data.id, agentA.apiKey, [
        { type: 'url', target_id: 'http://localhost:3333/s/ee5fcf2d-17f9-4a9b-aa57-1b97ae54dd59' },
      ]);
      expect(status).toBe(200);
      expect(json.data.refs[0].type).toBe('asset');
      expect(json.data.refs[0].target_id).toBe('ee5fcf2d-17f9-4a9b-aa57-1b97ae54dd59');
    });

    test('normalizes API asset URL to asset type + bare UUID', async () => {
      const thread = await createThread(agentA.apiKey);
      const { status, json } = await addRefs(thread.data.id, agentA.apiKey, [
        { type: 'url', target_id: 'http://localhost:3434/v0/assets/ee5fcf2d-17f9-4a9b-aa57-1b97ae54dd59/content' },
      ]);
      expect(status).toBe(200);
      expect(json.data.refs[0].type).toBe('asset');
      expect(json.data.refs[0].target_id).toBe('ee5fcf2d-17f9-4a9b-aa57-1b97ae54dd59');
    });

    test('strips query params from tokenrip URLs', async () => {
      const thread = await createThread(agentA.apiKey);
      const { status, json } = await addRefs(thread.data.id, agentA.apiKey, [
        { type: 'asset', target_id: 'http://localhost:3333/s/ee5fcf2d-17f9-4a9b-aa57-1b97ae54dd59?cap=abc123' },
      ]);
      expect(status).toBe(200);
      expect(json.data.refs[0].type).toBe('asset');
      expect(json.data.refs[0].target_id).toBe('ee5fcf2d-17f9-4a9b-aa57-1b97ae54dd59');
    });

    test('leaves bare UUID asset refs unchanged', async () => {
      const thread = await createThread(agentA.apiKey);
      const { status, json } = await addRefs(thread.data.id, agentA.apiKey, [
        { type: 'asset', target_id: 'ee5fcf2d-17f9-4a9b-aa57-1b97ae54dd59' },
      ]);
      expect(status).toBe(200);
      expect(json.data.refs[0].type).toBe('asset');
      expect(json.data.refs[0].target_id).toBe('ee5fcf2d-17f9-4a9b-aa57-1b97ae54dd59');
    });

    test('leaves external URLs as url type', async () => {
      const thread = await createThread(agentA.apiKey);
      const { status, json } = await addRefs(thread.data.id, agentA.apiKey, [
        { type: 'url', target_id: 'https://figma.com/design/abc123' },
      ]);
      expect(status).toBe(200);
      expect(json.data.refs[0].type).toBe('url');
      expect(json.data.refs[0].target_id).toBe('https://figma.com/design/abc123');
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd /Users/si/projects/maxi/tokenrip && bun test tests/integration/thread-refs.test.ts`
Expected: FAIL — `POST /v0/threads/:id/refs` endpoint doesn't exist yet (404).

**Step 3: Add normalization to RefService**

In `apps/backend/src/api/service/ref.service.ts`, add the `normalizeRef` method and update `addRefs`:

```typescript
// Add at the top of the file, after imports:
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:3333').replace(/\/+$/, '');
const API_URL = (process.env.API_URL || 'http://localhost:3434').replace(/\/+$/, '');

const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

// Add as a private method on RefService:
private normalizeRef(ref: RefInput): RefInput {
  const raw = ref.target_id;

  // Try to extract a tokenrip asset UUID from the target_id
  for (const base of [FRONTEND_URL, API_URL]) {
    if (raw.startsWith(base)) {
      const match = raw.match(UUID_RE);
      if (match) {
        return { ...ref, type: 'asset', target_id: match[0] };
      }
    }
  }

  return ref;
}
```

Update `addRefs` to normalize each ref before persisting:

```typescript
@Transactional()
async addRefs(ownerType: string, ownerId: string, refs: RefInput[]): Promise<Ref[]> {
  const entities = refs.map((r) => {
    const normalized = this.normalizeRef(r);
    const ref = new Ref();
    ref.ownerType = ownerType;
    ref.ownerId = ownerId;
    ref.type = normalized.type;
    ref.targetId = normalized.target_id;
    if (normalized.version !== undefined) ref.version = normalized.version;
    return ref;
  });
  entities.forEach((e) => this.em.persist(e));
  return entities;
}
```

**Step 4: Skip running tests (endpoint doesn't exist yet — built in Task 3)**

---

### Task 2: RefService — findAllForThread and removeRef

**Files:**
- Modify: `apps/backend/src/api/service/ref.service.ts`
- Read: `apps/backend/src/api/service/message.service.ts` (for message query pattern)

**Step 1: Add findAllForThread method**

This method queries thread-level refs + message-level refs for a thread, dedupes by `type + target_id`, and returns them.

Add to `RefService`:

```typescript
async findAllForThread(threadId: string): Promise<Ref[]> {
  // Thread-level refs
  const threadRefs = await this.refRepo.find({ ownerType: 'thread', ownerId: threadId });

  // Message-level refs: find all message IDs for this thread, then their refs
  const messageIds: Array<{ id: string }> = await this.em.getConnection().execute(
    `SELECT id FROM message WHERE thread_id = ?`,
    [threadId],
  );

  let messageRefs: Ref[] = [];
  if (messageIds.length > 0) {
    messageRefs = await this.refRepo.find({
      ownerType: 'message',
      ownerId: { $in: messageIds.map((m) => m.id) },
    });
  }

  // Dedupe by type + target_id, preferring thread-level refs
  const seen = new Set<string>();
  const result: Ref[] = [];
  for (const ref of [...threadRefs, ...messageRefs]) {
    const key = `${ref.type}:${ref.targetId}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(ref);
    }
  }
  return result;
}
```

**Step 2: Add removeRef method**

```typescript
async removeRef(refId: string): Promise<void> {
  const ref = await this.refRepo.findOne({ id: refId });
  if (ref) {
    await this.em.removeAndFlush(ref);
  }
}
```

**Step 3: Rebuild backend**

Run: `cd /Users/si/projects/maxi/tokenrip/apps/backend && bun run build`
Expected: Build succeeds.

---

### Task 3: POST /v0/threads/:id/refs Endpoint

**Files:**
- Modify: `apps/backend/src/api/controller/thread.controller.ts`
- Test: `tests/integration/thread-refs.test.ts`

**Step 1: Add endpoint to ThreadController**

Add after the `postMessage` endpoint in `thread.controller.ts`:

```typescript
@Auth('agent', 'token')
@Post(':threadId/refs')
async addRefs(
  @Param('threadId') threadId: string,
  @Body() body: { refs?: Array<{ type: string; target_id: string; version?: number }> },
  @ReqAuth() auth: RequestAuth,
) {
  if (!body?.refs?.length) {
    throw new BadRequestException({
      ok: false,
      error: 'MISSING_FIELD',
      message: 'refs array is required',
    });
  }

  await this.threadService.findById(threadId, auth);
  const refs = await this.refService.addRefs('thread', threadId, body.refs);

  return {
    ok: true,
    data: {
      refs: refs.map((r) => ({
        id: r.id,
        type: r.type,
        target_id: r.targetId,
        ...(r.version != null ? { version: r.version } : {}),
      })),
    },
  };
}
```

**Step 2: Rebuild and run normalization tests**

Run: `cd /Users/si/projects/maxi/tokenrip/apps/backend && bun run build && cd ../.. && bun test tests/integration/thread-refs.test.ts`
Expected: All normalization tests from Task 1 PASS.

**Step 3: Commit**

```
feat: add POST /v0/threads/:id/refs with URL normalization
```

---

### Task 4: DELETE /v0/threads/:id/refs/:refId Endpoint

**Files:**
- Modify: `apps/backend/src/api/controller/thread.controller.ts`
- Test: `tests/integration/thread-refs.test.ts`

**Step 1: Add delete tests**

Add to `tests/integration/thread-refs.test.ts`:

```typescript
async function deleteRef(threadId: string, refId: string, apiKey: string) {
  const res = await fetch(`${backend.url}/v0/threads/${threadId}/refs/${refId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  return { status: res.status, json: await res.json() };
}

async function getThread(threadId: string, apiKey: string) {
  const res = await fetch(`${backend.url}/v0/threads/${threadId}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  return { status: res.status, json: await res.json() };
}

describe('delete refs', () => {
  test('removes a ref from a thread', async () => {
    const thread = await createThread(agentA.apiKey);
    const { json: addJson } = await addRefs(thread.data.id, agentA.apiKey, [
      { type: 'url', target_id: 'https://figma.com/design/abc' },
    ]);
    const refId = addJson.data.refs[0].id;

    const { status } = await deleteRef(thread.data.id, refId, agentA.apiKey);
    expect(status).toBe(200);

    const { json: threadJson } = await getThread(thread.data.id, agentA.apiKey);
    expect(threadJson.data.refs).toEqual([]);
  });

  test('any participant can delete a ref', async () => {
    const thread = await createThread(agentA.apiKey);
    const { json: addJson } = await addRefs(thread.data.id, agentA.apiKey, [
      { type: 'url', target_id: 'https://example.com' },
    ]);
    const refId = addJson.data.refs[0].id;

    const { status } = await deleteRef(thread.data.id, refId, agentB.apiKey);
    expect(status).toBe(200);
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `cd /Users/si/projects/maxi/tokenrip && bun test tests/integration/thread-refs.test.ts`
Expected: FAIL — DELETE endpoint doesn't exist, and GET thread doesn't include refs yet.

**Step 3: Add DELETE endpoint to ThreadController**

```typescript
@Auth('agent', 'token')
@Delete(':threadId/refs/:refId')
async removeRef(
  @Param('threadId') threadId: string,
  @Param('refId') refId: string,
  @ReqAuth() auth: RequestAuth,
) {
  await this.threadService.findById(threadId, auth);
  await this.refService.removeRef(refId);
  return { ok: true };
}
```

Add `Delete` to the `@nestjs/common` imports at the top of the file.

**Step 4: Tests still fail because GET thread doesn't include refs — that's Task 5. Rebuild for now.**

Run: `cd /Users/si/projects/maxi/tokenrip/apps/backend && bun run build`

---

### Task 5: Include Refs in Thread GET Responses

**Files:**
- Modify: `apps/backend/src/api/controller/thread.controller.ts`
- Test: `tests/integration/thread-refs.test.ts`

**Step 1: Add refs to serializeThread**

Update the `serializeThread` method in `ThreadController`:

```typescript
private async serializeThread(thread: any) {
  const [participants, refs] = await Promise.all([
    this.participantService.listByThread(thread.id),
    this.refService.findAllForThread(thread.id),
  ]);
  return {
    id: thread.id,
    created_by: thread.createdBy,
    resolution: thread.resolution ?? null,
    metadata: thread.metadata ?? null,
    participants: participants.map((p) => ({
      id: p.id,
      agent_id: p.agent?.id ?? null,
      user_id: p.user?.id ?? null,
      role: p.role ?? null,
      joined_at: p.joinedAt,
    })),
    refs: refs.map((r) => ({
      id: r.id,
      type: r.type,
      target_id: r.targetId,
      ...(r.version != null ? { version: r.version } : {}),
    })),
    created_at: thread.createdAt,
    updated_at: thread.updatedAt,
  };
}
```

**Step 2: Add test for refs in GET response**

Add to `tests/integration/thread-refs.test.ts`:

```typescript
describe('thread GET includes refs', () => {
  test('refs appear in thread detail response', async () => {
    const thread = await createThread(agentA.apiKey);
    await addRefs(thread.data.id, agentA.apiKey, [
      { type: 'asset', target_id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee' },
      { type: 'url', target_id: 'https://figma.com/file/xyz' },
    ]);

    const { json } = await getThread(thread.data.id, agentA.apiKey);
    expect(json.data.refs).toHaveLength(2);
    expect(json.data.refs[0]).toHaveProperty('id');
    expect(json.data.refs[0]).toHaveProperty('type');
    expect(json.data.refs[0]).toHaveProperty('target_id');
  });

  test('aggregates thread-level and message-level refs, deduped', async () => {
    const thread = await createThread(agentA.apiKey);
    // Thread-level ref
    await addRefs(thread.data.id, agentA.apiKey, [
      { type: 'asset', target_id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee' },
    ]);
    // Message-level ref (same asset)
    await fetch(`${backend.url}/v0/threads/${thread.data.id}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${agentA.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        body: 'Check this asset',
        refs: [{ type: 'asset', target_id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee' }],
      }),
    });

    const { json } = await getThread(thread.data.id, agentA.apiKey);
    // Deduped: same asset ref from thread + message = 1 entry
    expect(json.data.refs).toHaveLength(1);
    expect(json.data.refs[0].target_id).toBe('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee');
  });
});
```

**Step 3: Rebuild and run all tests**

Run: `cd /Users/si/projects/maxi/tokenrip/apps/backend && bun run build && cd ../.. && bun test tests/integration/thread-refs.test.ts`
Expected: All tests PASS.

**Step 4: Commit**

```
feat: add DELETE /v0/threads/:id/refs/:refId and refs in thread GET
```

---

### Task 6: Thread Create Accepts Refs

**Files:**
- Modify: `apps/backend/src/api/controller/thread.controller.ts`
- Test: `tests/integration/thread-refs.test.ts`

**Step 1: Add test**

```typescript
describe('create thread with refs', () => {
  test('refs provided at creation appear in thread detail', async () => {
    const res = await fetch(`${backend.url}/v0/threads`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${agentA.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        participants: [agentB.agentId],
        refs: [
          { type: 'asset', target_id: 'aaaaaaaa-1111-2222-3333-444444444444' },
          { type: 'url', target_id: 'https://figma.com/board/xyz' },
        ],
      }),
    });
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.data.refs).toHaveLength(2);
    expect(json.data.refs[0].type).toBe('asset');
    expect(json.data.refs[1].type).toBe('url');
  });
});
```

**Step 2: Run test to verify it fails**

Expected: FAIL — `refs` in create body is ignored, response has no `refs` field from `serializeThread` (it will have the field now from Task 5, but it'll be empty since create doesn't persist refs yet).

**Step 3: Update create endpoint**

In `ThreadController.create()`, add refs handling after participant creation:

```typescript
@Auth('agent')
@Post()
@Transactional()
async create(
  @AuthAgent() agent: { id: string },
  @Body() body: {
    participants?: string[];
    metadata?: Record<string, unknown>;
    message?: { body: string; intent?: string; type?: string };
    refs?: Array<{ type: string; target_id: string; version?: number }>;
  },
) {
  const thread = await this.threadService.create(agent.id, { metadata: body.metadata });

  const creatorParticipant = await this.participantService.addAgent(thread, agent.id);

  if (body.participants) {
    for (const entry of body.participants) {
      const agentId = await this.agentService.resolveByIdOrAlias(entry);
      await this.participantService.addAgent(thread, agentId);
    }
  }

  if (body.refs?.length) {
    await this.refService.addRefs('thread', thread.id, body.refs);
  }

  if (body.message) {
    await this.messageService.create(thread, creatorParticipant, body.message.body, {
      intent: body.message.intent,
      type: body.message.type,
    });
  }

  return { ok: true, data: await this.serializeThread(thread) };
}
```

**Step 4: Rebuild and run tests**

Run: `cd /Users/si/projects/maxi/tokenrip/apps/backend && bun run build && cd ../.. && bun test tests/integration/thread-refs.test.ts`
Expected: PASS.

**Step 5: Commit**

```
feat: thread creation accepts refs array
```

---

### Task 7: Operator Thread Endpoints — GET with Refs, POST Refs, DELETE Ref

**Files:**
- Modify: `apps/backend/src/api/controller/operator.controller.ts`
- Test: `tests/integration/thread-refs.test.ts` (add operator tests)

**Step 1: Add operator test helpers and tests**

This task requires an operator (user) session. Look at existing operator tests for the pattern. Add to `thread-refs.test.ts`:

```typescript
// You'll need to import or set up operator auth. Check tests/setup/ for helpers.
// The pattern is: create an agent, then use the operator auth flow to get a session cookie.
// Look at tests/integration/operator.test.ts for the exact pattern used.
```

Add RefService injection to OperatorController (it's not imported yet — see Task 3's grep result showing no `ref` references in operator controller).

**Step 2: Add refs to operator GET thread response**

In `OperatorController.getThread()` (around line 313), add refs to the response:

```typescript
@Auth('user')
@Get('operator/threads/:threadId')
async getThread(
  @Param('threadId') threadId: string,
  @AuthUser() user: { id: string },
  @ReqAuth() auth: RequestAuth,
) {
  await this.requireBoundAgent(user.id);
  const thread = await this.threadService.findById(threadId, auth);
  const [participants, refs] = await Promise.all([
    this.participantService.listByThread(thread.id),
    this.refService.findAllForThread(thread.id),
  ]);

  return {
    ok: true,
    data: {
      thread_id: thread.id,
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
      refs: refs.map((r) => ({
        id: r.id,
        type: r.type,
        target_id: r.targetId,
        ...(r.version != null ? { version: r.version } : {}),
      })),
      created_at: thread.createdAt,
      updated_at: thread.updatedAt,
    },
  };
}
```

**Step 3: Add POST and DELETE ref endpoints for operator**

Add `RefService` to the OperatorController constructor injection. Then add:

```typescript
@Auth('user')
@Post('operator/threads/:threadId/refs')
async addThreadRefs(
  @Param('threadId') threadId: string,
  @Body() body: { refs?: Array<{ type: string; target_id: string; version?: number }> },
  @AuthUser() user: { id: string },
  @ReqAuth() auth: RequestAuth,
) {
  if (!body?.refs?.length) {
    throw new BadRequestException({
      ok: false,
      error: 'MISSING_FIELD',
      message: 'refs array is required',
    });
  }

  await this.requireBoundAgent(user.id);
  await this.threadService.findById(threadId, auth);
  const refs = await this.refService.addRefs('thread', threadId, body.refs);

  return {
    ok: true,
    data: {
      refs: refs.map((r) => ({
        id: r.id,
        type: r.type,
        target_id: r.targetId,
        ...(r.version != null ? { version: r.version } : {}),
      })),
    },
  };
}

@Auth('user')
@Delete('operator/threads/:threadId/refs/:refId')
async removeThreadRef(
  @Param('threadId') threadId: string,
  @Param('refId') refId: string,
  @AuthUser() user: { id: string },
  @ReqAuth() auth: RequestAuth,
) {
  await this.requireBoundAgent(user.id);
  await this.threadService.findById(threadId, auth);
  await this.refService.removeRef(refId);
  return { ok: true };
}
```

Make sure `Delete` is imported from `@nestjs/common` and `RefService` is injected in the constructor.

**Step 4: Rebuild and run tests**

Run: `cd /Users/si/projects/maxi/tokenrip/apps/backend && bun run build && cd ../.. && bun test tests/integration/thread-refs.test.ts`
Expected: All existing tests PASS (operator-specific tests may need session setup — verify and adapt).

**Step 5: Commit**

```
feat: operator thread refs — GET includes refs, POST/DELETE endpoints
```

---

### Task 8: MCP Tools — thread_add_refs and thread_remove_ref

**Files:**
- Modify: `apps/backend/src/mcp/tools/thread.tools.ts`
- Test: `tests/integration/mcp.test.ts` (add to existing)

**Step 1: Add thread_add_refs tool**

In `registerThreadTools()` in `thread.tools.ts`, add:

```typescript
server.tool(
  'thread_add_refs',
  'Add reference links (assets or URLs) to a thread.',
  {
    threadId: z.string().describe('Thread UUID'),
    refs: z.string().describe('JSON array of refs: [{"type":"asset","target_id":"uuid"}, {"type":"url","target_id":"https://..."}]'),
  },
  async (args) => {
    try {
      const thread = await services.threadService.findById(args.threadId, { agent: { id: agentId } });
      const refs = JSON.parse(args.refs);
      if (!Array.isArray(refs) || !refs.length) {
        return { content: [{ type: 'text', text: 'Error: refs must be a non-empty JSON array' }], isError: true };
      }
      const created = await services.refService.addRefs('thread', thread.id, refs);
      const data = created.map((r) => ({ id: r.id, type: r.type, target_id: r.targetId }));
      return { content: [{ type: 'text', text: JSON.stringify({ ok: true, refs: data }) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
    }
  },
);
```

**Step 2: Add thread_remove_ref tool**

```typescript
server.tool(
  'thread_remove_ref',
  'Remove a reference link from a thread.',
  {
    threadId: z.string().describe('Thread UUID'),
    refId: z.string().describe('Ref UUID to remove'),
  },
  async (args) => {
    try {
      await services.threadService.findById(args.threadId, { agent: { id: agentId } });
      await services.refService.removeRef(args.refId);
      return { content: [{ type: 'text', text: JSON.stringify({ ok: true }) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
    }
  },
);
```

**Step 3: Update thread_create to accept refs**

In the existing `thread_create` tool, add a `refs` parameter:

```typescript
refs: z.string().optional().describe('JSON array of refs to link: [{"type":"asset","target_id":"uuid"}]'),
```

And after participant creation, before the message:

```typescript
if (args.refs) {
  const refs = JSON.parse(args.refs);
  if (Array.isArray(refs) && refs.length) {
    await services.refService.addRefs('thread', thread.id, refs);
  }
}
```

**Step 4: Rebuild and run MCP tests**

Run: `cd /Users/si/projects/maxi/tokenrip/apps/backend && bun run build && cd ../.. && bun test tests/integration/mcp.test.ts`
Expected: Existing MCP tests still PASS. (New MCP tool tests can be added if time permits.)

**Step 5: Commit**

```
feat: MCP tools thread_add_refs, thread_remove_ref, thread_create refs
```

---

### Task 9: Frontend — Operator API Functions for Refs

**Files:**
- Modify: `apps/frontend/src/lib/operator.ts`

**Step 1: Add TypeScript types and API functions**

Add ref type and update `ThreadMeta` in the operator lib:

```typescript
export interface ThreadRef {
  id: string
  type: string
  target_id: string
  version?: number
}
```

Add API functions:

```typescript
export async function addThreadRefs(
  threadId: string,
  refs: Array<{ type: string; target_id: string }>,
): Promise<ThreadRef[]> {
  const res = await api.post(`/v0/operator/threads/${threadId}/refs`, { refs })
  return res.data.data.refs
}

export async function removeThreadRef(threadId: string, refId: string): Promise<void> {
  await api.delete(`/v0/operator/threads/${threadId}/refs/${refId}`)
}
```

**Step 2: Commit**

```
feat: frontend API functions for thread refs
```

---

### Task 10: Frontend — Linked Resources Component

**Files:**
- Create: `apps/frontend/src/components/operator/LinkedResources.tsx`
- Modify: `apps/frontend/src/app/operator/threads/$threadId.tsx`

**Step 1: Create the LinkedResources component**

Create `apps/frontend/src/components/operator/LinkedResources.tsx`:

```tsx
import { useState } from 'react'
import { ExternalLink, FileText, Link2, Plus, X } from 'lucide-react'
import type { ThreadRef } from '../../lib/operator'

interface LinkedResourcesProps {
  refs: ThreadRef[]
  onAdd: (ref: { type: string; target_id: string }) => Promise<void>
  onRemove: (refId: string) => Promise<void>
  disabled?: boolean
}

function refLabel(ref: ThreadRef): string {
  if (ref.type === 'asset') return ref.target_id.slice(0, 8) + '...'
  try {
    return new URL(ref.target_id).hostname
  } catch {
    return ref.target_id.slice(0, 30)
  }
}

function refHref(ref: ThreadRef): string {
  if (ref.type === 'asset') return `/s/${ref.target_id}`
  return ref.target_id
}

export function LinkedResources({ refs, onAdd, onRemove, disabled }: LinkedResourcesProps) {
  const [adding, setAdding] = useState(false)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleAdd() {
    if (!input.trim()) return
    setBusy(true)
    try {
      // Let the backend normalize — just pass as url type, normalization handles the rest
      await onAdd({ type: 'url', target_id: input.trim() })
      setInput('')
      setAdding(false)
    } finally {
      setBusy(false)
    }
  }

  if (!refs.length && disabled) return null

  return (
    <div className="border-b border-foreground/10 px-4 py-2">
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-foreground/40">
        <Link2 size={12} />
        Linked Resources
        {!disabled && (
          <button
            onClick={() => setAdding(!adding)}
            className="ml-auto rounded p-0.5 hover:bg-foreground/5"
          >
            <Plus size={12} />
          </button>
        )}
      </div>

      {adding && (
        <div className="mt-2 flex gap-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Asset ID or URL..."
            className="flex-1 rounded border border-foreground/10 bg-transparent px-2 py-1 text-xs outline-none focus:border-foreground/30"
            disabled={busy}
          />
          <button
            onClick={handleAdd}
            disabled={busy || !input.trim()}
            className="rounded bg-foreground/10 px-2 py-1 text-xs hover:bg-foreground/20 disabled:opacity-40"
          >
            Add
          </button>
        </div>
      )}

      {refs.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {refs.map((ref) => (
            <a
              key={ref.id}
              href={refHref(ref)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1 rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-foreground/70 hover:bg-foreground/10 hover:text-foreground"
            >
              {ref.type === 'asset' ? <FileText size={10} /> : <ExternalLink size={10} />}
              {refLabel(ref)}
              {!disabled && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onRemove(ref.id)
                  }}
                  className="ml-0.5 hidden rounded-full p-0.5 hover:bg-foreground/20 group-hover:block"
                >
                  <X size={8} />
                </button>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
```

**Step 2: Integrate into thread detail page**

In `apps/frontend/src/app/operator/threads/$threadId.tsx`:

1. Import the component and API functions:
```typescript
import { LinkedResources } from '../../../components/operator/LinkedResources'
import { addThreadRefs, removeThreadRef, type ThreadRef } from '../../../lib/operator'
```

2. Add refs to the `ThreadMeta` interface:
```typescript
interface ThreadMeta {
  id: string
  state: string
  owner_id: string
  created_at: string
  participants: Array<{ id: string; agent_id?: string; user_id?: string }>
  resolution: Record<string, unknown> | null
  refs: ThreadRef[]
}
```

3. Add handler functions:
```typescript
async function handleAddRef(ref: { type: string; target_id: string }) {
  await addThreadRefs(threadId, [ref])
  // Re-fetch thread to update refs
  const updated = await fetchOperatorThread(threadId)
  setThread({ id: updated.thread_id, state: updated.state, owner_id: updated.owner_id, created_at: updated.created_at, participants: updated.participants, resolution: updated.resolution, refs: updated.refs ?? [] })
}

async function handleRemoveRef(refId: string) {
  await removeThreadRef(threadId, refId)
  setThread((prev) => prev ? { ...prev, refs: prev.refs.filter((r) => r.id !== refId) } : prev)
}
```

4. Render `LinkedResources` above the `ThreadView`, after the toolbar/banner area:
```tsx
{thread && (thread.refs?.length > 0 || !isClosed) && (
  <LinkedResources
    refs={thread.refs ?? []}
    onAdd={handleAddRef}
    onRemove={handleRemoveRef}
    disabled={isClosed}
  />
)}
```

**Step 3: Run frontend dev server and verify**

Run: `cd /Users/si/projects/maxi/tokenrip/apps/frontend && bun run dev`
Navigate to an operator thread with linked assets. Verify:
- Refs display as clickable chips
- Asset refs link to `/s/{uuid}` (opens in new tab)
- URL refs link externally
- Add button works (input field appears, submits, ref appears)
- Remove button works (X icon, ref disappears)
- Closed threads hide add/remove controls

**Step 4: Commit**

```
feat: LinkedResources widget in operator thread detail view
```

---

### Task 11: Update CLAUDE.md and API Docs

**Files:**
- Modify: `apps/backend/CLAUDE.md` (add new endpoints to table)
- Modify: `docs/design/thread-asset-linking.md` (mark as Implemented)

**Step 1: Add new endpoints to CLAUDE.md API table**

Add these rows to the endpoint table:

```
| POST | `/v0/threads/:uuid/refs` | API key/cap | Add refs to a thread |
| DELETE | `/v0/threads/:uuid/refs/:refId` | API key/cap | Remove a ref from a thread |
| POST | `/v0/operator/threads/:uuid/refs` | User session | Operator adds refs to a thread |
| DELETE | `/v0/operator/threads/:uuid/refs/:refId` | User session | Operator removes a ref |
```

**Step 2: Mark design doc as Implemented**

Update `docs/design/thread-asset-linking.md` status from "Approved" to "Implemented".

**Step 3: Commit**

```
docs: update API table and design doc for thread-asset linking
```
