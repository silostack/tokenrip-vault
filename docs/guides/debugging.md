# Debugging Guide

Common problems encountered during development, testing, and operations. Use as a reference when troubleshooting.

---

## Quick Symptom Lookup

| Symptom | Likely Cause | See Section |
|---------|--------------|-------------|
| Tests fail after changing backend source | Backend not rebuilt | [Backend Not Rebuilt](#backend-not-rebuilt) |
| Test suite fails when run together, passes in isolation | Test isolation issues | [Test Isolation Failures](#test-isolation-failures) |
| Database connection errors | ORM/connections not properly closed | [Database Connection Leaks](#database-connection-leaks) |
| `createdb failed: role "postgres" does not exist` | Wrong database user | [Database User Configuration](#database-user-configuration) |
| `relation "agent" already exists` | Leftover test databases | [Leftover Test Databases](#leftover-test-databases) |
| `Cannot find module '@nestjs/core'` | test-bootstrap.js location | [Module Resolution](#module-resolution) |
| CLI `upload()` hangs or times out | Bun `form-data` compat issue | [Bun Compatibility Issues](#bun-compatibility-issues) |
| Tests timeout after running for a while | Database connections exhausted | [Database Connection Leaks](#database-connection-leaks) |
| Stale entity data in tests | EntityManager caching | [Transaction Isolation Issues](#transaction-isolation-issues) |

---

## Testing

### Backend Not Rebuilt

**Problem**: Tests import from the compiled `dist/` directory, not TypeScript source. Changes to backend source aren't reflected until rebuilt.

**Symptoms**:
- Tests pass but don't reflect recent code changes
- Old behavior persists despite source edits
- New endpoints or fields missing

**Resolution**:
```bash
cd apps/backend && bun run build
```

**Why**: Bun's transpiler doesn't fully support TypeScript's `emitDecoratorMetadata`, which MikroORM's entity decorators require. Tests must use compiled output.

**Prevention**: Always rebuild before running tests after backend changes.

---

### Test Isolation Failures

**Problem**: Tests pass individually but fail when run together, or results depend on execution order.

**Symptoms**:
- Full suite fails, individual files pass
- Different results depending on which tests run first
- State appearing that wasn't created in the current test

**Root Cause**:
Tests leave behind state that affects subsequent tests. Each test file gets its own PostgreSQL database (per-file isolation), but within a file, tests share the same database and backend instance.

**Resolution**:
1. Ensure `afterAll` hooks clean up: close backend, drop database
2. Follow the standard lifecycle pattern:

```typescript
let backend: TestBackend;
const dbName = generateTestDbName();

beforeAll(async () => {
  await createTestDatabase(dbName);
  backend = await startBackend(dbName);
});

afterAll(async () => {
  await stopBackend(backend);
  await dropTestDatabase(dbName);
});
```

**Prevention**:
- Follow patterns from existing test files
- Always pair `createTestDatabase` with `dropTestDatabase`
- Always pair `startBackend` with `stopBackend`

**Related**: [Database Connection Leaks](#database-connection-leaks), [Transaction Isolation Issues](#transaction-isolation-issues)

---

### Database Connection Leaks

**Problem**: Database connections aren't properly closed, leading to pool exhaustion or test failures.

**Symptoms**:
- "Too many connections" errors
- Tests timeout after running for a while
- Subsequent test files fail to connect

**Root Cause**:
`stopBackend()` must close both the HTTP server and the MikroORM connection pool. Missing either leaves connections open.

**Resolution**:
Use the provided `stopBackend()` helper which handles:
1. Force-closing all HTTP connections via `server.closeAllConnections()`
2. Closing the HTTP server
3. Closing the MikroORM connection pool

**Prevention**:
- Always use `stopBackend()` in `afterAll`, not manual cleanup
- If writing custom teardown, close both server and ORM

---

### Transaction Isolation Issues

**Problem**: Tests see stale data or data from other tests within the same file.

**Symptoms**:
- Tests see data they didn't create
- Entity state doesn't reflect recent changes
- Assertions fail on values that "should" have been updated

**Root Cause**:
MikroORM's EntityManager caches entities in its identity map. If one test modifies data through the API (which uses its own EM), the test's EM still has the old cached version.

**Resolution**:
Re-fetch entities after operations rather than relying on cached references:

```typescript
// WRONG - stale data
const asset = await fetch(`${url}/v0/assets/${uuid}`).then(r => r.json());
// ... perform update via API ...
// asset still has old data

// CORRECT - re-fetch after operation
await fetch(`${url}/v0/assets/${uuid}`, { method: 'DELETE', ... });
const response = await fetch(`${url}/v0/assets/${uuid}`);
expect(response.status).toBe(404);  // Verify via fresh request
```

**Prevention**:
- Test via HTTP requests (like production), not direct EM access
- Always verify state via fresh API calls after mutations

---

## Environment & Configuration

### Database User Configuration

**Problem**: `createdb` fails because PostgreSQL expects a different user.

**Symptoms**:
- `createdb failed: role "postgres" does not exist`
- `FATAL: role "xyz" does not exist`

**Resolution**:
Ensure your local Postgres accepts connections with your OS username (`whoami`), or set `DATABASE_USER` explicitly:

```bash
export DATABASE_USER=$(whoami)
```

The test setup uses `process.env.USER` (OS username) by default for PostgreSQL auth, matching macOS local Postgres defaults.

---

### Leftover Test Databases

**Problem**: Previous test runs left databases behind, causing schema conflicts.

**Symptoms**:
- `relation "agent" already exists`
- Schema creation errors during test setup

**Resolution**:
```bash
psql -lqt | grep tokenrip_test | awk '{print $1}' | xargs -I{} dropdb --force {}
```

**Prevention**:
- Ensure `afterAll` hooks always run (avoid `process.exit()` in tests)
- The `--force` flag on `dropdb` terminates lingering connections

---

### Module Resolution

**Problem**: NestJS packages can't be found during test bootstrap.

**Symptoms**:
- `Cannot find module '@nestjs/core'`
- Module resolution errors during test startup

**Resolution**:
Ensure `test-bootstrap.js` lives in `apps/backend/` — NestJS packages resolve from the backend's dependency tree.

---

## Bun Compatibility Issues

### `form-data` npm Package

The `form-data` npm package uses Node.js `fs.createReadStream()` which has stream compatibility issues in Bun. File upload tests use Bun's native `FormData` + `Bun.file()` with `fetch` instead.

### NestJS Shutdown

`app.close()` in NestJS can hang in Bun's event loop. `stopBackend()` works around this by directly closing the HTTP server and ORM connection pool rather than relying on NestJS's shutdown sequence.

### Decorator Metadata

Bun's transpiler doesn't fully support `emitDecoratorMetadata`. Tests import compiled `dist/` instead of TypeScript source. Rebuild backend before testing.

---

## Test Cleanup Checklist

When writing or debugging test files, ensure:

1. **afterAll hook includes**:
   - `await stopBackend(backend)` — closes server + ORM
   - `await dropTestDatabase(dbName)` — removes test database

2. **Test assertions use**:
   - Fresh HTTP requests for verification (not cached references)
   - The test agent's API key for authenticated requests

3. **Test data is self-contained**:
   - Each test creates what it needs
   - No dependency on data from other tests

## Environment Setup Checklist

Before running tests, verify:

1. **PostgreSQL running** with peer/trust auth (no password)
2. **Backend built**: `cd apps/backend && bun run build`
3. **Dependencies installed**: `bun install` from monorepo root

---

## Contributing to This Document

When you encounter and resolve a new issue:

1. **Add to Quick Symptom Lookup**: Add the observable symptom and reference
2. **Create detailed entry** with: Problem, Symptoms, Root Cause, Resolution, Prevention
3. **Link related issues**: Cross-reference similar problems
