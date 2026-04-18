# Memory Leak Investigation — Backend (2026-04-18)

## Symptoms

The tokenrip backend process (PID 88789, Bun runtime) is consuming **~7 GB RSS** after ~20 hours of uptime. The process runs the NestJS API server from `apps/backend/dist/main.js`.

```
VmRSS:   7,147,900 kB  (~6.8 GB)
RssAnon: 7,132,352 kB  (almost entirely anonymous/heap memory)
VmData: 79,548,876 kB  (~76 GB virtual — Bun/JSC over-maps)
```

The server started at `2026-04-17T21:35:04Z`. During that window it handled:

| Metric | Count |
|---|---|
| MCP POST requests | 22,166 |
| MCP GET requests (SSE streams) | 3,705 |
| MCP POST → 200 (tool call responses) | 7,392 |
| MCP POST → 202 (notifications) | 11,085 |
| MCP POST → 401 (auth failures) | 4 |
| Collection rows created (one asset) | 20,650 |
| Open file descriptors | 21 |
| Open sockets | 9 |

The 9 open sockets and 21 file descriptors confirm this is **not** a connection/fd leak — connections are being closed properly. The memory is in the JS heap.

---

## Database Context

```
Table            | Rows
-----------------+------
collection_row   | 20,654
asset_version    | 108
asset            | 73
api_key          | 43
message          | 13
thread           | 10
```

One asset (`592beb14-6786-44a0-b94a-3a92a085b417`) accounts for 20,650 of the collection rows. All were created on 2026-04-18 between 03:54 and 16:07 UTC+2. Average row data size is 399 bytes (JSONB), max 734 bytes. Total table size on disk is 12 MB.

The 12 MB on-disk footprint vs 7 GB in-process RSS means the leak is not about the data volume itself — it's about how the server retains objects across requests.

---

## Architecture Overview (for context)

The MCP server is the primary code path involved. It uses the Streamable HTTP transport from `@modelcontextprotocol/sdk@1.29.0`, wrapped in a NestJS controller.

**Request flow:**

```
Client POST /mcp (no session-id)
  → McpController.handlePost()
  → Authenticates via AuthService
  → Creates StreamableHTTPServerTransport
  → Creates McpServer (registers 30+ tool handlers)
  → Connects server to transport
  → Stores session in this.sessions Map
  → transport.handleRequest(req, res, req.body)
    → Creates NEW getRequestListener() per call (hono adapter)
    → Converts Node.js req/res to Web Standard Request/Response
    → WebStandardStreamableHTTPServerTransport.handlePostRequest()
    → Opens SSE ReadableStream for response
    → Fires onmessage → McpServer processes tool call
    → Tool handler calls NestJS service (e.g., CollectionRowService)
    → Service uses MikroORM EntityManager
    → Result sent back via transport.send() → SSE stream closes
```

**Session lifecycle:**

```
Sessions stored in: Map<string, { transport, lastActivity }>
TTL: 7 days (SESSION_TTL_MS = 604,800,000 ms)
Cleanup: hourly sweep (CLEANUP_INTERVAL_MS = 3,600,000 ms)
```

---

## Root Cause Analysis

There are three contributing factors, ordered by likely impact.

### 1. MCP Session Accumulation (PRIMARY — high confidence)

**File:** `apps/backend/src/mcp/mcp.controller.ts` lines 9-10, 20, 66-86

Each MCP connection initializes a new session. Each session creates:

- A `StreamableHTTPServerTransport` instance
  - Contains a `WebStandardStreamableHTTPServerTransport` with internal Maps (`_streamMapping`, `_requestToStreamMapping`, `_requestResponseMap`)
  - Contains a `_requestListener` created via `getRequestListener()` in the constructor (never used — see root cause 2)
- A `McpServer` instance (`createMcpServer()` in `mcp.server.ts`)
  - Registers 30+ tool handlers, each a closure capturing the shared `McpServices` object and the `agentId` string
  - Wraps every tool handler with an analytics tracking closure (lines 85-117 of `mcp.server.ts`)

These are stored in `this.sessions` (a `Map`) with a **7-day sliding-window TTL**. Cleanup runs hourly but since the server has only been up 20 hours, **no sessions have expired**.

**Estimating session count:**

- 3,705 GET /mcp requests (SSE stream opens). In the MCP protocol, clients open a GET SSE stream after initializing a session. This suggests up to ~3,700 distinct sessions.
- 1,686 POST responses took >100ms — initialization is the heaviest POST operation (first one logged at 246ms), suggesting ~1,700 initialization events.
- Conservative estimate: **1,500–3,700 live sessions** in the Map right now.

**Per-session memory estimate:**

Each session holds a `McpServer` with 30+ registered tools. Each tool registration includes:
- The Zod schema object for parameters
- The handler closure (captures `services`, `agentId`, helper functions)
- The analytics wrapper closure

Estimated: **100–300 KB per session** depending on how JSC handles closure allocation.

**Total:** 1,500 sessions × 200 KB = **300 MB** at the low end, 3,700 × 300 KB = **1.1 GB** at the high end. This is significant but alone doesn't explain 7 GB. However, it interacts with root cause 2.

**Key code:**

```typescript
// mcp.controller.ts — session creation (lines 66-86)
const transport = new StreamableHTTPServerTransport({
  sessionIdGenerator: () => randomUUID(),
});
const server = createMcpServer(this.mcpServices, agentId);
await server.connect(transport);
// ...
this.sessions.set(transport.sessionId, { transport, lastActivity: Date.now() });

// mcp.controller.ts — cleanup (lines 111-119)
// SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000 = 604,800,000 ms
cleanupIdleSessions() {
  const now = Date.now();
  for (const [sessionId, entry] of this.sessions) {
    if (now - entry.lastActivity > SESSION_TTL_MS) {
      entry.transport.close?.();
      this.sessions.delete(sessionId);
    }
  }
}
```

**Fix:** Reduce `SESSION_TTL_MS` to 30 minutes (1,800,000 ms) and `CLEANUP_INTERVAL_MS` to 5 minutes (300,000 ms). Add a log line in `cleanupIdleSessions()` and session creation that includes the current `this.sessions.size` so we can monitor session count over time.

---

### 2. Per-Request `getRequestListener` Allocation (PRIMARY — high confidence)

**File:** `node_modules/@modelcontextprotocol/sdk/dist/esm/server/streamableHttp.js` lines 128-144

The `StreamableHTTPServerTransport.handleRequest()` method creates a **new `getRequestListener()`** for every single request:

```javascript
// Called 22,166 + 3,705 = 25,871 times during this server lifetime
async handleRequest(req, res, parsedBody) {
    const authInfo = req.auth;
    const handler = getRequestListener(async (webRequest) => {  // <-- NEW per call
        return this._webStandardTransport.handleRequest(webRequest, {
            authInfo,
            parsedBody   // <-- captures full JSON-RPC body
        });
    }, { overrideGlobalObjects: false });
    await handler(req, res);
}
```

`getRequestListener` is from `@hono/node-server@1.19.14`. It's a **factory function** designed to be called once to create a reusable request handler. Instead, it's called for every request. Each call:

1. Creates a new async handler closure
2. The closure captures `parsedBody` (the full JSON-RPC request body — could be kilobytes for tool calls with large `rowsJson`)
3. Inside the handler, it creates a new `Request` object, `AbortController`, `Headers`, and `ReadableStream` for the request body
4. Attaches event listeners to `incoming` (Node.js `IncomingMessage`) and `outgoing` (`ServerResponse`) that are **never explicitly removed**:
   ```javascript
   incoming.on("end", () => { incomingEnded = true; });
   outgoing.on("finish", () => { ... });
   outgoing.on("close", () => { ... });
   ```
5. For SSE responses, `writeFromReadableStreamDefaultReader()` adds its own listeners (these ones ARE properly removed via `.off()` in a `.finally()` block)

**Why this matters under Bun/JSC:**

The constructor also creates a `_requestListener` via `getRequestListener()` that is **never used** — the `handleRequest` method always creates a new one. This is a bug in the MCP SDK (wasted allocation) but not a leak.

The real problem is that with 25,871 calls, each creating closures that capture `parsedBody`, `authInfo`, `incoming`, and `outgoing`, the garbage collector must collect all of these after each request completes. Under Bun's JavaScriptCore:

- JSC uses a conservative GC scanner that can find "false positives" on the stack, preventing collection
- JSC's GC is less aggressive than V8 for short-lived allocations
- The event listeners on `incoming`/`outgoing` create reference cycles between the Node.js objects and the JS closures

Over 25K requests, even a small percentage of uncollected handlers would accumulate significantly. If 20% survive GC (a plausible rate for JSC false-positive retention), that's ~5,000 handler closures × ~1 MB each (including captured `parsedBody`, intermediate buffers, `Request`/`Response` objects) = **~5 GB**.

**Fix:** This is an upstream MCP SDK bug. Two options:

1. **Patch locally** — Override `handleRequest` on the transport prototype to reuse the constructor's `_requestListener` instead of creating a new one per call. This requires using the `_requestContext` WeakMap that already exists in the constructor for this purpose (it was the original design but is dead code now).
2. **Upgrade SDK** — Check if newer versions of `@modelcontextprotocol/sdk` fix this. The current version is `^1.29.0`.
3. **Workaround** — After each `transport.handleRequest()` call in the controller, set `parsedBody = null` and rely on the controller not holding references. This reduces the retained data per handler but doesn't eliminate the allocation.

---

### 3. MikroORM Identity Map Growth (SECONDARY — medium confidence)

**Files:**
- `apps/backend/src/api/service/collection-row.service.ts` lines 34-56
- `apps/backend/src/api/service/asset.service.ts` lines 209-243
- `node_modules/@mikro-orm/core/utils/TransactionManager.js` lines 153-181, 210-224

**How the identity map works:**

MikroORM maintains an identity map (a cache of loaded entities) per `EntityManager` instance. The `@mikro-orm/nestjs` middleware forks the global EM per HTTP request via `RequestContext.create()`. After the request, the forked EM and its identity map should be garbage collected.

**The problem with MCP requests:**

When `em.transactional()` is called within a `RequestContext`, the `TransactionManager` does the following:

```javascript
// TransactionManager.js — executeTransactionFlow (line 210)
async executeTransactionFlow(fork, cb, propagateToUpperContext, parentEm) {
    if (!propagateToUpperContext) {
        // When called on global EM: just execute, no merge
        const ret = await cb(fork);
        await fork.flush();
        return ret;
    }
    // When called on a request-scoped fork: merge entities back to parent
    this.registerDeletionHandler(fork, parentEm);
    const ret = await cb(fork);
    await fork.flush();
    this.mergeEntitiesToParent(fork, parentEm);  // <-- ALL entities merged back
    return ret;
}
```

`mergeEntitiesToParent()` (line 153) copies **every entity** from the transaction fork's identity map into the parent (request-scoped) EM. For `appendRows` with many rows, this means the request-scoped EM's identity map balloons with all created entities.

**Timing issue:**

The MCP transport fires `onmessage` and returns **before** the tool handler completes. The sequence is:

1. `RequestContext.create(em, next)` wraps the request
2. Controller calls `transport.handleRequest()` which fires `onmessage` (async, fire-and-forget)
3. The POST handler returns an SSE `Response`
4. `getRequestListener` awaits `writeFromReadableStreamDefaultReader()` which blocks until the SSE stream closes
5. Tool handler runs (within the same async context — `AsyncLocalStorage` propagates through Promise chains)
6. Tool handler calls `em.transactional()` → entities are merged into the request-scoped fork's identity map
7. Tool sends response → SSE stream closes → `writeFromReadableStreamDefaultReader` returns
8. `getRequestListener` handler returns → `transport.handleRequest()` returns → controller returns
9. `RequestContext.create()` `next()` returns → async context ends
10. The request-scoped fork (and its identity map) is eligible for GC

So the identity map IS properly scoped per-request. **But** — if root cause 2 prevents the enclosing closures from being collected, the request-scoped EM and all its entities are retained as well.

This is how root causes 2 and 3 interact: the per-request `getRequestListener` closure retains references to the handler chain, which retains the async context, which retains the request-scoped EntityManager fork, which retains all entities loaded/created during that request.

**The `appendRows` hot path:**

```typescript
// collection-row.service.ts lines 34-56
async appendRows(asset, rows, createdBy): Promise<CollectionRow[]> {
    return this.em.transactional(async () => {
        await this.lockAndRefreshAsset(asset);
        const created: CollectionRow[] = [];
        for (const row of rows) {
            this.expandSchema(asset, row.data);
            const entity = new CollectionRow(asset, row.data, createdBy);
            this.em.persist(entity);
            created.push(entity);
        }
        return created;  // <-- all entities returned, then merged to parent EM
    });
}
```

No batch size limit. No `em.clear()` after the transaction. The `created` array holds all entities until the tool handler stringifies the IDs and the array goes out of scope — but if the enclosing closure is retained (root cause 2), these entities stay alive.

**The CSV import path:**

```typescript
// asset.service.ts lines 209-243
async createCollectionFromCsv(dto): Promise<Asset> {
    const { schema, rows } = parseCsv({ content: dto.content, ... });
    // parseCsv() loads ALL rows into memory at once (csv-parser.ts)

    const asset = await this.em.transactional(async (em) => {
        em.persist(asset);
        for (let i = 0; i < rows.length; i++) {
            const row = new CollectionRow(asset, rows[i], dto.ownerId);
            em.persist(row);  // identity map grows unbounded
        }
        return asset;
    });
}
```

If a CSV with 20,000 rows is uploaded, all 20,000 `CollectionRow` entities live in the transaction fork's identity map simultaneously, then get merged into the parent EM. With MikroORM overhead (original data snapshots for dirty checking, wrapped entity metadata), each entity might take 2-5 KB in the identity map. 20,000 × 5 KB = 100 MB per CSV import.

**Fix:**

1. Add `em.clear()` call after `transport.handleRequest()` returns in the MCP controller — this explicitly releases the request-scoped EM's identity map
2. Add a batch size limit (e.g., 1000 rows) to `appendRows` to prevent massive transactions
3. For `createCollectionFromCsv`, consider chunking into multiple transactions with `em.clear()` between chunks

---

## The Interaction Model

The three root causes compound:

```
Session created (root cause 1)
  → Session stays in Map for 7 days
  → Each request through the session creates a getRequestListener closure (root cause 2)
  → Each closure retains the async context and request-scoped EM (root cause 3)
  → Bun's JSC GC doesn't collect the closures aggressively enough
  → Identity map entities from each request are retained
  → Memory grows with every request, never shrinks
```

This explains why 7 GB accumulates from what is essentially 22K requests with modest data payloads (12 MB total in the database).

---

## Recommended Fixes (Priority Order)

### P0: Reduce MCP Session TTL

**File:** `apps/backend/src/mcp/mcp.controller.ts`

```typescript
// Change from:
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;  // 7 days
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000;       // 1 hour

// To:
const SESSION_TTL_MS = 30 * 60 * 1000;       // 30 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;   // 5 minutes
```

Add session count logging to `cleanupIdleSessions()` and session creation so we can monitor:

```typescript
this.logger.log(`MCP session created: ${sid} (active sessions: ${this.sessions.size})`);
// ...
this.logger.log(`MCP cleanup: removed ${removedCount}, active: ${this.sessions.size}`);
```

Also add `server.close()` before deleting sessions to ensure the `McpServer` releases its internal state:

```typescript
// In cleanupIdleSessions and onModuleDestroy:
await entry.transport.close();  // Already exists, also closes the McpServer
this.sessions.delete(sessionId);
```

### P1: Clear EM After MCP Request Handling

**File:** `apps/backend/src/mcp/mcp.controller.ts`

After `transport.handleRequest()` returns in both `handlePost` and `handleGet`, clear the request-scoped EM to release entity references:

```typescript
// In McpController, inject EntityManager:
constructor(
    private readonly authService: AuthService,
    @Inject(MCP_SERVICES) private readonly mcpServices: McpServices,
    private readonly em: EntityManager,  // <-- add this
) { ... }

// After each handleRequest call:
await existing.transport.handleRequest(req, res, req.body);
this.em.clear();  // release identity map for this request
```

This is a belt-and-suspenders measure. Even if the EM is properly scoped per request, `clear()` ensures the identity map is empty before the request-scoped fork is (hopefully) collected.

### P2: Add Batch Limit for Collection Row Operations

**File:** `apps/backend/src/api/service/collection-row.service.ts`

```typescript
const MAX_ROWS_PER_APPEND = 1000;

async appendRows(asset, rows, createdBy): Promise<CollectionRow[]> {
    if (rows.length > MAX_ROWS_PER_APPEND) {
        throw new BadRequestException({
            ok: false,
            error: 'TOO_MANY_ROWS',
            message: `Maximum ${MAX_ROWS_PER_APPEND} rows per append call`,
        });
    }
    // ... existing logic
}
```

Also update the MCP tool description in `collection.tools.ts` to document the limit.

### P3: Add Memory Monitoring

**File:** `apps/backend/src/mcp/mcp.controller.ts` (or a new interceptor)

Add periodic memory logging so we can track whether the fixes work:

```typescript
// In the cleanup interval callback:
const memUsage = process.memoryUsage();
this.logger.log(
    `Memory: rss=${(memUsage.rss / 1024 / 1024).toFixed(0)}MB ` +
    `heap=${(memUsage.heapUsed / 1024 / 1024).toFixed(0)}MB ` +
    `sessions=${this.sessions.size}`
);
```

### P4: Address MCP SDK Per-Request getRequestListener (longer term)

**File:** Upstream issue or local patch

The `StreamableHTTPServerTransport.handleRequest()` creates a new `getRequestListener` per call. The constructor already creates a `_requestListener` and a `_requestContext` WeakMap for this purpose, but `handleRequest` ignores them.

Options:
1. **File an issue** on the `@modelcontextprotocol/sdk` repo
2. **Patch locally** by monkey-patching `StreamableHTTPServerTransport.prototype.handleRequest` in `mcp.controller.ts` to use `_requestContext` + `_requestListener` instead of creating a new handler each time
3. **Upgrade** if a newer SDK version fixes this

---

## Verification Plan

After applying the fixes:

1. Restart the backend process
2. Monitor RSS every 5 minutes: `cat /proc/$(pgrep -f 'main.js')/status | grep VmRSS`
3. Run the same workload pattern (MCP tool calls with collection row operations)
4. After 1 hour, RSS should stabilize below 500 MB (vs 7 GB before)
5. Check the session count log — should show sessions being cleaned up after 30 minutes
6. After 2+ hours, verify no upward trend in memory

If RSS still grows after the P0–P2 fixes, the remaining leak is in the MCP SDK's per-request allocation (P4), and we'll need to implement the local monkey-patch or upgrade the SDK.

---

## Files Referenced

| File | Relevance |
|---|---|
| `apps/backend/src/mcp/mcp.controller.ts` | Session Map, TTL, cleanup logic |
| `apps/backend/src/mcp/mcp.server.ts` | McpServer creation, tool registration, analytics wrappers |
| `apps/backend/src/mcp/mcp.module.ts` | Service injection into MCP_SERVICES provider |
| `apps/backend/src/mcp/tools/collection.tools.ts` | Collection tool handlers (appendRows, createFromCsv) |
| `apps/backend/src/api/service/collection-row.service.ts` | `appendRows`, `getRows` — identity map hot paths |
| `apps/backend/src/api/service/asset.service.ts` | `createCollectionFromCsv` — bulk row creation |
| `apps/backend/src/api/service/csv-parser.ts` | CSV parsing (loads all rows into memory) |
| `apps/backend/src/db/mikro-orm.config.ts` | MikroORM config (`allowGlobalContext: false`) |
| `apps/backend/src/main.ts` | Express body-parser configured at 50 MB limit |
| `apps/backend/src/app.module.ts` | Module registration, middleware order |
| SDK: `@modelcontextprotocol/sdk` `streamableHttp.js` | Per-request `getRequestListener` bug |
| SDK: `@modelcontextprotocol/sdk` `webStandardStreamableHttp.js` | Internal transport Maps |
| Adapter: `@hono/node-server` `index.js` | `getRequestListener` factory, event listener lifecycle |
| MikroORM: `@mikro-orm/core` `TransactionManager.js` | `mergeEntitiesToParent` after transactions |
| MikroORM: `@mikro-orm/core` `EntityManager.js` | `getContext()`, identity map resolution |
| MikroORM: `@mikro-orm/nestjs` `mikro-orm.middleware.js` | `RequestContext.create()` per-request fork |
