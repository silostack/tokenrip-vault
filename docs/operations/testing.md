# Testing Infrastructure

## Overview

Tokenrip uses **integration tests** that boot a real NestJS backend against a real PostgreSQL database and exercise the system through HTTP requests and CLI function calls. The test runner is **Bun's built-in test framework** (`bun test`).

```
51 tests across 9 files, ~2 seconds total
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
│   └── api-key.ts            # Create API keys via the auth endpoint
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
    ├── auth.test.ts          # API key lifecycle (create, auth, revoke)
    ├── upload.test.ts        # File uploads, retrieval, URL in response
    ├── publish.test.ts       # Content publishing (markdown, HTML, chart, code, text), URL in response
    ├── artifact-read.test.ts # Artifact metadata, content endpoints, provenance fields
    ├── status.test.ts        # GET /v0/artifacts/status endpoint, CLI status command
    ├── provenance.test.ts    # Provenance/lineage fields (parentArtifactId, creatorContext, inputReferences)
    ├── config.test.ts        # CLI config functions and env var precedence
    └── full-flow.test.ts     # End-to-end: key → upload → publish → revoke
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

Uses the OS username (`process.env.USER`) for PostgreSQL auth, matching macOS local Postgres defaults. Override any of these with environment variables to point at a different database server.

### 3. Database Per Test File (`tests/setup/database.ts`)

Each test file gets its own PostgreSQL database with a random name:

```
tokenrip_test_a3f8c912
tokenrip_test_7b2e4d01
...
```

Databases are created/dropped via `createdb`/`dropdb` CLI commands (spawned with `Bun.spawn`). The `--force` flag on `dropdb` terminates any lingering connections.

**Why per-file databases?** Bun runs each `.test.ts` file in a separate worker. Per-file databases give full isolation with no cross-contamination between test suites.

### 4. Backend Bootstrap (`apps/backend/test-bootstrap.js`)

A CommonJS module in the backend directory that creates a NestJS app:

1. **Loads `reflect-metadata`** — required by NestJS decorators
2. **Imports the compiled `AppModule`** from `dist/app.module` (not the TypeScript source — see [Bun Compatibility](#bun-compatibility-notes))
3. **Creates the NestJS app** with logging disabled
4. **Listens on port 0** — OS assigns a random free port
5. **Creates the database schema** — `orm.getSchemaGenerator().dropSchema()` then `.createSchema()` generates all tables from MikroORM entity metadata

This file lives in `apps/backend/` so that `require('@nestjs/core')` and `require('@mikro-orm/core')` resolve from the backend's dependency tree.

### 5. Backend Lifecycle (`tests/setup/backend.ts`)

`startBackend(dbName)`:
1. Sets `DATABASE_NAME`, `STORAGE_PATH` (temp dir), `PORT=0`, `ENV_FILE=/dev/null`
2. Dynamically imports `test-bootstrap.js`
3. Returns `{ app, url, orm }`

`stopBackend(backend)`:
1. Force-closes all HTTP connections via `server.closeAllConnections()`
2. Closes the HTTP server
3. Closes the MikroORM connection pool

### 6. API Key Provisioning (`tests/setup/api-key.ts`)

Tests that need authenticated CLI access call `createTestApiKey(baseUrl)`:

```typescript
const apiKey = await createTestApiKey(backend.url);
process.env.TOKENRIP_API_KEY = apiKey;
```

This hits `POST /v0/auth/keys` (a public endpoint) to create a real API key, then injects it as an env var so CLI functions pick it up.

### 7. Test File Lifecycle

Most test files follow this pattern:

```typescript
let backend: TestBackend;
let apiKey: string;
const dbName = generateTestDbName();

beforeAll(async () => {
  await createTestDatabase(dbName);          // createdb tokenrip_test_xxxx
  backend = await startBackend(dbName);      // Boot NestJS on random port
  apiKey = await createTestApiKey(backend.url); // Get a tr_... API key
  process.env.TOKENRIP_API_URL = backend.url;
  process.env.TOKENRIP_API_KEY = apiKey;
});

afterAll(async () => {
  await stopBackend(backend);                // Close server + ORM
  await dropTestDatabase(dbName);            // dropdb --force tokenrip_test_xxxx
});
```

The `config.test.ts` file is an exception — it doesn't start a backend since it only tests pure config functions and env var precedence.

## Test Files

### `health.test.ts` (1 test)

Smoke test that the backend booted correctly.

- `GET /v0/health` returns `{ ok: true }` with status 200

### `auth.test.ts` (7 tests)

API key lifecycle via direct `fetch` calls (the CLI doesn't expose auth commands).

- Create key returns `tr_` prefixed key
- Created key authenticates against protected endpoints
- Revoke key, then verify 401 on subsequent requests
- Missing `name` field returns 400
- Missing auth header returns 401
- Invalid key returns 401
- Multiple independent keys work simultaneously

### `upload.test.ts` (7 tests)

File upload via `fetch` with native `FormData`, plus CLI error path tests.

- Upload PNG — success with artifact ID, title defaults to filename, correct MIME type
- Upload PDF with custom title
- Uploaded content is byte-for-byte retrievable via content endpoint
- Response includes `url` field with shareable link
- CLI `upload()` with non-existent file throws `CliError('FILE_NOT_FOUND')`
- CLI `upload()` without API key throws `CliError('NO_API_KEY')`
- Upload with invalid API key returns 401

> **Note:** File uploads use `fetch` with Bun's native `FormData` instead of the CLI's `upload()` function. The `form-data` npm package (used by the CLI) has stream compatibility issues with Bun's runtime. See [Bun Compatibility](#bun-compatibility-notes).

### `publish.test.ts` (11 tests)

Content publishing via CLI's `publish()` function with `console.log` spy to capture output.

- Publish markdown, HTML, chart, code, and text content types
- Custom title is reflected in response
- Published content matches original file when retrieved
- Response includes `url` field with shareable link
- Invalid type throws `CliError('INVALID_TYPE')`
- Non-existent file throws `CliError('FILE_NOT_FOUND')`
- Missing API key throws `CliError('NO_API_KEY')`

### `artifact-read.test.ts` (7 tests)

Artifact retrieval endpoints via `fetch`. Creates artifacts in `beforeAll`, then tests reads.

- Metadata returns correct fields for uploaded files
- Metadata returns correct fields for published content
- Content endpoint streams correct bytes with correct `Content-Type` header
- Content endpoint returns correct text for published markdown
- Non-existent UUID returns 404 on metadata endpoint
- Non-existent UUID returns 404 on content endpoint
- Metadata includes provenance fields (parentArtifactId, creatorContext, inputReferences) when set

### `status.test.ts` (6 tests)

Status endpoint and CLI command via `fetch` and CLI function import.

- Returns empty array when no artifacts exist
- Returns created artifacts with correct fields (id, title, type, mimeType, createdAt, updatedAt)
- Requires authentication (401 without Bearer header)
- `?since=` query param filters by updatedAt
- Only returns artifacts for the calling API key (isolation between keys)
- CLI `status()` outputs JSON array

### `provenance.test.ts` (3 tests)

Provenance/lineage field persistence via `fetch`.

- Publish with provenance fields (parentArtifactId, creatorContext, inputReferences) stores and returns them
- Upload with provenance fields stores and returns them
- Provenance fields are optional — null when not provided

### `config.test.ts` (8 tests)

CLI config utility functions — no backend needed.

- `getApiUrl()` returns env var when set
- `getApiUrl()` returns config value over default
- `getApiUrl()` returns `http://localhost:3000` as fallback default
- `getApiKey()` returns env var when set
- `getApiKey()` returns config value over env var
- `getApiKey()` returns undefined when nothing set
- `saveConfig()` + `loadConfig()` roundtrip preserves all fields
- `loadConfig()` returns defaults shape when config exists

> **Note:** The roundtrip test modifies the real `~/.config/tokenrip/config.json` but restores the original in a `finally` block.

### `full-flow.test.ts` (1 test)

End-to-end integration test covering the complete user journey:

1. Create an API key
2. Upload a file (via `fetch`)
3. Fetch metadata — verify title, type, MIME type
4. Fetch content — verify binary match with original
5. Publish markdown (via CLI `publish()`)
6. Fetch published content — verify text match
7. Revoke the API key
8. Attempt upload with revoked key — verify 401

## Bun Compatibility Notes

### MikroORM Decorators

Bun's transpiler doesn't fully support TypeScript's `emitDecoratorMetadata`, which MikroORM's entity decorators (`@Entity`, `@PrimaryKey`, `@Property`) require. Tests import the **compiled `dist/`** directory (built by SWC via `nest build`) instead of the TypeScript source.

**Consequence:** After changing backend source code, you must rebuild before running tests:

```bash
cd apps/backend && bun run build
```

### `form-data` npm Package

The `form-data` npm package (used by the CLI's `upload()` function) uses Node.js `fs.createReadStream()` which has stream compatibility issues in Bun. File upload tests use Bun's native `FormData` + `Bun.file()` with `fetch` instead.

The CLI's `publish()` function works fine in Bun because it sends JSON via `axios.post()` (no streams involved).

### NestJS Shutdown

`app.close()` in NestJS can hang in Bun's event loop due to differences in how Bun handles the underlying connection pool teardown. `stopBackend()` works around this by directly closing the HTTP server and ORM connection pool rather than relying on NestJS's shutdown sequence.

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
The `DATABASE_USER` env var isn't set correctly. Ensure your local Postgres accepts connections with your OS username (`whoami`), or set `DATABASE_USER` explicitly before running tests.

**`Cannot find module '@nestjs/core'`**
NestJS packages resolve from the backend's dependency tree. Ensure `test-bootstrap.js` lives in `apps/backend/` and imports are resolved from there.

**`relation "api_key" already exists`**
A previous test run left a database behind. Clean up with:
```bash
psql -lqt | grep tokenrip_test | awk '{print $1}' | xargs -I{} dropdb --force {}
```

**Tests fail after changing backend source**
Rebuild the backend: `cd apps/backend && bun run build`

**CLI `upload()` hangs or times out**
Known Bun compatibility issue with the `form-data` npm package. Use `fetch` with native `FormData` for upload tests instead.
