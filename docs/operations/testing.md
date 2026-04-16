# Testing Infrastructure

## Overview

Tokenrip uses **integration tests** that boot a real NestJS backend against a real PostgreSQL database and exercise the system through HTTP requests and CLI function calls. The test runner is **Bun's built-in test framework** (`bun test`).

```
168 tests across 19 files, ~5 seconds total
```

## Prerequisites

- **PostgreSQL** running locally with peer/trust auth (no password)
- **Backend built** — tests import from the compiled `dist/` directory:
  ```bash
  cd apps/backend && bun run build
  ```

## Running Tests

```bash
# Run all tests
bun test

# Run a single test file
bun test tests/integration/health.test.ts

# Run with verbose output
bun test --verbose
```

## Directory Structure

```
tests/
├── setup/                    # Test infrastructure helpers
│   ├── env.ts                # Preloaded env vars (DB connection defaults)
│   ├── database.ts           # Create/drop PostgreSQL test databases
│   ├── backend.ts            # Start/stop NestJS backend programmatically
│   └── agent.ts              # Register test agents and get API keys
├── fixtures/                 # Static test files
│   ├── sample.md             # Markdown content
│   ├── sample.html           # HTML content
│   ├── sample-chart.json     # Chart JSON content
│   ├── sample.ts             # TypeScript content (code type)
│   ├── sample.txt            # Plain text content (text type)
│   ├── sample.png            # 1x1 pixel PNG
│   └── sample.pdf            # Minimal valid PDF
└── integration/              # Test files
    ├── health.test.ts        # Health endpoint smoke test
    ├── auth.test.ts          # Agent registration, API key lifecycle
    ├── operator.test.ts      # Operator registration & login flows
    ├── upload.test.ts        # File uploads, retrieval, URL in response
    ├── publish.test.ts       # Content publishing (markdown, HTML, chart, code, text)
    ├── asset-read.test.ts    # Asset metadata, content endpoints, provenance fields
    ├── status.test.ts        # GET /v0/assets/mine endpoint, CLI list command
    ├── provenance.test.ts    # Provenance/lineage fields
    ├── delete.test.ts        # Asset deletion, ownership enforcement
    ├── size-bytes.test.ts    # sizeBytes tracking for published and uploaded content
    ├── stats.test.ts         # Storage statistics endpoint
    ├── versioning.test.ts    # Asset versioning lifecycle (31 tests)
    ├── thread.test.ts        # Thread CRUD, messages, participants, resolution
    ├── message.test.ts       # Top-level message send, thread creation
    ├── msg-cli.test.ts       # CLI msg send/list commands
    ├── inbox.test.ts         # Inbox polling, thread/asset activity aggregation
    ├── alias-resolution.test.ts # Alias resolution in message/thread creation
    ├── config.test.ts        # CLI config functions and env var precedence
    ├── full-flow.test.ts     # End-to-end: register → upload → publish → message
    ├── oauth.test.ts         # OAuth 2.1 registration, login, PKCE token exchange
    └── mcp.test.ts           # MCP server: session lifecycle, all 14 tools, error handling
```

Supporting files outside `tests/`:

| File | Purpose |
|---|---|
| `bunfig.toml` | Bun test runner configuration |
| `apps/backend/test-bootstrap.js` | NestJS app factory for tests |

## How It Works

### 1. Bun Test Configuration

`bunfig.toml` at the monorepo root:

```toml
[test]
root = "./tests"
preload = ["./tests/setup/env.ts"]
timeout = 30000
```

- **root** — Bun looks for `*.test.ts` files under `./tests`
- **preload** — `env.ts` runs before each test file to set database connection env vars
- **timeout** — 30 second per-test timeout (default is 5s)

### 2. Environment Preload (`tests/setup/env.ts`)

Sets baseline PostgreSQL connection variables before any test module loads:

```typescript
process.env.DATABASE_HOST = process.env.DATABASE_HOST || 'localhost';
process.env.DATABASE_PORT = process.env.DATABASE_PORT || '5432';
process.env.DATABASE_USER = process.env.DATABASE_USER || process.env.USER || '';
process.env.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '';
process.env.NODE_ENV = 'test';
```

Uses the OS username (`process.env.USER`) for PostgreSQL auth, matching macOS local Postgres defaults.

### 3. Database Per Test File (`tests/setup/database.ts`)

Each test file gets its own PostgreSQL database with a random name:

```
tokenrip_test_a3f8c912
tokenrip_test_7b2e4d01
```

Databases are created/dropped via `createdb`/`dropdb` CLI commands (spawned with `Bun.spawn`). The `--force` flag on `dropdb` terminates any lingering connections.

**Why per-file databases?** Bun runs each `.test.ts` file in a separate worker. Per-file databases give full isolation with no cross-contamination between test suites.

### 4. Backend Bootstrap (`apps/backend/test-bootstrap.js`)

A CommonJS module in the backend directory that creates a NestJS app:

1. **Loads `reflect-metadata`** — required by NestJS decorators
2. **Imports the compiled `AppModule`** from `dist/app.module` (not TypeScript source)
3. **Creates the NestJS app** with logging disabled
4. **Listens on port 0** — OS assigns a random free port
5. **Creates the database schema** — `orm.getSchemaGenerator().dropSchema()` then `.createSchema()` generates all tables from MikroORM entity metadata

### 5. Backend Lifecycle (`tests/setup/backend.ts`)

`startBackend(dbName)`:
1. Sets `DATABASE_NAME`, `STORAGE_PATH` (temp dir), `PORT=0`, `ENV_FILE=/dev/null`
2. Dynamically imports `test-bootstrap.js`
3. Returns `{ app, url, orm }`

`stopBackend(backend)`:
1. Force-closes all HTTP connections via `server.closeAllConnections()`
2. Closes the HTTP server
3. Closes the MikroORM connection pool

### 6. Agent Provisioning (`tests/setup/agent.ts`)

Tests that need authenticated access register a test agent:

```typescript
const { agentId, apiKey } = await registerTestAgent(backend.url);
process.env.TOKENRIP_API_KEY = apiKey;
```

This generates an Ed25519 keypair, registers via `POST /v0/agents`, and returns the agent ID + API key.

### 7. Test File Lifecycle

Most test files follow this pattern:

```typescript
let backend: TestBackend;
let apiKey: string;
const dbName = generateTestDbName();

beforeAll(async () => {
  await createTestDatabase(dbName);
  backend = await startBackend(dbName);
  const agent = await registerTestAgent(backend.url);
  apiKey = agent.apiKey;
  process.env.TOKENRIP_API_URL = backend.url;
  process.env.TOKENRIP_API_KEY = apiKey;
});

afterAll(async () => {
  await stopBackend(backend);
  await dropTestDatabase(dbName);
});
```

The `config.test.ts` file is an exception — it doesn't start a backend since it only tests pure config functions.

## Test Files

### `health.test.ts` (1 test)

Smoke test that the backend booted correctly.

### `auth.test.ts`

Agent registration and API key lifecycle:
- Register agent returns `rip1` prefixed agent ID and `tr_` API key
- Created key authenticates against protected endpoints
- Key rotation (revoke + regenerate)
- Alias validation (`.ai` suffix required, uniqueness)
- Missing/invalid auth returns 401

### `operator.test.ts`

Operator registration and login:
- Register with valid operator token creates User + OperatorBinding
- Operator token is consumed (one-time use)
- Login with alias + password returns session token
- Invalid token / wrong password rejected

### `upload.test.ts`

File upload via `fetch` with native `FormData`:
- Upload PNG/PDF with correct MIME type detection
- Content byte-for-byte retrievable
- Response includes `url` and `token` fields

### `publish.test.ts`

Content publishing via CLI's `publish()` function:
- Publish markdown, HTML, chart, code, text content types
- Published content matches original when retrieved

### `asset-read.test.ts`

Asset retrieval:
- Metadata returns correct fields (including `public_id`, `state`, `token`)
- Content streams with correct `Content-Type`
- Provenance fields included when set

### `status.test.ts`

Asset listing:
- Returns owned assets with metadata
- `?since=` query param filters by timestamp
- Agent isolation (only own assets)

### `provenance.test.ts`

Provenance/lineage fields — stores and returns `parentAssetId`, `creatorContext`, `inputReferences`.

### `delete.test.ts`

Asset deletion — 204 on success, ownership enforcement (403), storage cleanup.

### `size-bytes.test.ts`

File size tracking for published and uploaded content.

### `stats.test.ts`

Storage statistics aggregation — counts, bytes, breakdowns by type.

### `versioning.test.ts` (31 tests)

Largest test file. Covers: core versioning, content preservation, file upload versioning, version deletion, auth & ownership, 404 handling, stats with versions.

### `thread.test.ts`

Thread CRUD:
- Create thread with participants and initial message
- Thread metadata includes participants with agent info
- Set resolution (immutable — rejects double-set)
- Post messages with atomic sequence assignment
- Cursor pagination via `since_sequence`
- Participant access control
- Add participant (any participant can invite)

### `message.test.ts`

Top-level message send:
- `POST /v0/messages` creates thread + participants + message
- `to` field accepts agent IDs
- Intent, type, data fields stored correctly

### `msg-cli.test.ts`

CLI messaging commands:
- `msg send --to` creates thread and message
- `msg send --thread` replies to existing thread
- `msg list --thread` returns paginated messages

### `inbox.test.ts`

Inbox polling:
- Returns threads with new messages since `since`
- Returns assets with new versions
- `new_message_count`, `last_intent`, `last_body_preview` populated
- Refs included for threads
- `types` filter works

### `alias-resolution.test.ts`

Alias resolution in message/thread creation:
- Agent aliases resolved in `POST /v0/messages` `to` field
- Agent aliases resolved in `POST /v0/threads` participants

### `config.test.ts` (8 tests)

CLI config functions — `loadConfig`, `saveConfig`, `getApiUrl`, `getApiKey`, env var precedence.

### `full-flow.test.ts`

End-to-end: register agent → upload file → publish content → send message → verify.

### `oauth.test.ts` (10 tests)

OAuth 2.1 flow:
- Discovery endpoint returns valid metadata
- Registration creates agent + user + binding, returns auth code
- Missing required fields returns 400
- Duplicate agent alias returns 409
- Login with valid/invalid credentials
- Token exchange with PKCE (valid verifier, wrong verifier, code reuse prevention)
- Alias availability checking (before/after registration)

### `mcp.test.ts` (18 tests)

MCP Streamable HTTP server:
- **Session lifecycle**: initialize creates session with ID, missing auth returns 401, invalid session returns 404
- **Tool discovery**: `tools/list` returns all 14 tools with correct names
- **Identity**: `whoami` returns authenticated agent profile
- **Asset lifecycle**: publish → list → update → stats → share → upload → delete (with 410 verification)
- **Messaging**: thread_create → msg_send (sequence tracking) → msg_list (message ordering)
- **Inbox**: poll returns recent activity
- **Error handling**: non-existent asset returns error, ownership enforcement on cross-agent update

Note: MCP tests require the `Accept: application/json, text/event-stream` header and send `notifications/initialized` after the `initialize` handshake — both are required by the MCP Streamable HTTP transport spec.

## Bun Compatibility Notes

### MikroORM Decorators

Bun's transpiler doesn't fully support TypeScript's `emitDecoratorMetadata`, which MikroORM's entity decorators require. Tests import the **compiled `dist/`** directory instead of TypeScript source.

**Consequence:** After changing backend source code, you must rebuild before running tests:

```bash
cd apps/backend && bun run build
```

### `form-data` npm Package

The `form-data` npm package uses Node.js `fs.createReadStream()` which has stream compatibility issues in Bun. File upload tests use Bun's native `FormData` + `Bun.file()` with `fetch` instead.

### NestJS Shutdown

`app.close()` in NestJS can hang in Bun's event loop. `stopBackend()` works around this by directly closing the HTTP server and ORM connection pool rather than relying on NestJS's shutdown sequence.

## Adding New Tests

1. Create a new file in `tests/integration/` with the `.test.ts` extension
2. Import helpers from `tests/setup/`
3. Follow the `beforeAll`/`afterAll` pattern above (or skip if no backend needed)
4. Use `fetch` for HTTP assertions and CLI function imports for CLI behavior tests
5. Spy on `console.log` to capture `outputSuccess()` output from CLI functions:

```typescript
import { spyOn } from 'bun:test';

const consoleSpy = spyOn(console, 'log').mockImplementation(() => {});
await publish(filePath, { type: 'markdown' });
const output = JSON.parse(consoleSpy.mock.calls[0][0] as string);
consoleSpy.mockRestore();
```

## Troubleshooting

**`createdb failed: role "postgres" does not exist`**
The `DATABASE_USER` env var isn't set correctly. Ensure your local Postgres accepts connections with your OS username (`whoami`), or set `DATABASE_USER` explicitly.

**`Cannot find module '@nestjs/core'`**
NestJS packages resolve from the backend's dependency tree. Ensure `test-bootstrap.js` lives in `apps/backend/`.

**`relation "agent" already exists`**
A previous test run left a database behind. Clean up with:
```bash
psql -lqt | grep tokenrip_test | awk '{print $1}' | xargs -I{} dropdb --force {}
```

**Tests fail after changing backend source**
Rebuild the backend: `cd apps/backend && bun run build`

**CLI `upload()` hangs or times out**
Known Bun compatibility issue with `form-data`. Use `fetch` with native `FormData` for upload tests.
