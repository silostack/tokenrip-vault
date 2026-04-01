# Storage Tracking & Asset Deletion — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add `sizeBytes` tracking to assets, a `DELETE` endpoint for assets, a `GET /v0/assets/stats` endpoint with aggregate statistics, and update the status endpoint and CLI.

**Architecture:** Add a nullable `size_bytes` column to the `asset` table. Populate it on creation. Expose delete via `DELETE /v0/assets/:uuid` with ownership verification. Expose stats via `GET /v0/assets/stats` using PostgreSQL aggregates. Extend the status response with `sizeBytes`. Add `delete` and `stats` CLI commands.

**Tech Stack:** NestJS, MikroORM, PostgreSQL, Commander.js, Axios, Bun test runner

**Design doc:** `docs/plans/2026-04-01-storage-tracking-and-delete-design.md`

---

### Task 1: Migration — add `size_bytes` column

**Files:**
- Create: `apps/backend/migrations/Migration20260401_add_size_bytes.ts` (exact timestamp will be generated)

**Step 1: Create the migration**

Run from repo root:
```bash
cd apps/backend && bunx mikro-orm migration:create --blank
```

This generates a timestamped migration file in `apps/backend/migrations/`.

**Step 2: Write the migration SQL**

Open the generated file and replace its contents with:

```typescript
import { Migration } from '@mikro-orm/migrations';

export class Migration20260401XXXXXX_add_size_bytes extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "asset" add column if not exists "size_bytes" bigint null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "asset" drop column if exists "size_bytes";`);
  }
}
```

Keep the generated class name and filename — just fill in the `up()` and `down()` methods.

**Step 3: Verify the migration runs**

```bash
cd apps/backend && bunx mikro-orm migration:up
```

Expected: Migration applies without errors.

**Step 4: Commit**

```bash
git add apps/backend/migrations/
git commit -m "migration: add size_bytes column to asset table"
```

---

### Task 2: Entity — add `sizeBytes` property to Asset

**Files:**
- Modify: `apps/backend/src/db/models/Asset.ts` (add property after line 47, before `createdAt`)

**Step 1: Write the failing test**

Create `tests/integration/size-bytes.test.ts`:

```typescript
import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { startBackend, stopBackend, type TestBackend } from '../setup/backend';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from '../setup/database';
import { createTestApiKey } from '../setup/api-key';

let backend: TestBackend;
let apiKey: string;
const dbName = generateTestDbName();

beforeAll(async () => {
  await createTestDatabase(dbName);
  backend = await startBackend(dbName);
  apiKey = await createTestApiKey(backend.url);
});

afterAll(async () => {
  await stopBackend(backend);
  await dropTestDatabase(dbName);
});

describe('sizeBytes tracking', () => {
  test('published content includes sizeBytes in status', async () => {
    const content = '# Hello World';
    await fetch(`${backend.url}/v0/assets`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'markdown', content, title: 'Sized' }),
    });

    const res = await fetch(`${backend.url}/v0/assets/status`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const json = (await res.json()) as { ok: boolean; data: Array<{ title: string; sizeBytes: number | null }> };
    const asset = json.data.find((a) => a.title === 'Sized');
    expect(asset).toBeDefined();
    expect(asset!.sizeBytes).toBe(Buffer.byteLength(content, 'utf-8'));
  });

  test('uploaded file includes sizeBytes in status', async () => {
    const fileContent = Buffer.from('fake PNG content for size test');
    const formData = new FormData();
    formData.append('file', new Blob([fileContent]), 'test.png');
    formData.append('title', 'SizedFile');

    await fetch(`${backend.url}/v0/assets`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: formData,
    });

    const res = await fetch(`${backend.url}/v0/assets/status`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const json = (await res.json()) as { ok: boolean; data: Array<{ title: string; sizeBytes: number | null }> };
    const asset = json.data.find((a) => a.title === 'SizedFile');
    expect(asset).toBeDefined();
    expect(asset!.sizeBytes).toBe(fileContent.byteLength);
  });
});
```

**Step 2: Run the test to verify it fails**

```bash
cd apps/backend && bun run build && cd ../.. && bun test tests/integration/size-bytes.test.ts
```

Expected: FAIL — `sizeBytes` is undefined/missing in the status response.

**Step 3: Add `sizeBytes` to the Asset entity**

In `apps/backend/src/db/models/Asset.ts`, add after the `inputReferences` property (after line 47):

```typescript
  @Property({ type: 'bigint', nullable: true })
  sizeBytes?: number;
```

**Step 4: Set `sizeBytes` in `AssetService.createFromContent`**

In `apps/backend/src/api/service/asset.service.ts`, in the `createFromContent` method, add after line 72 (`asset.mimeType = ...`):

```typescript
      asset.sizeBytes = Buffer.byteLength(dto.content, 'utf-8');
```

**Step 5: Set `sizeBytes` in `AssetService.createFromFile`**

In the same file, in `createFromFile`, add after line 54 (`asset.title = ...`):

```typescript
      asset.sizeBytes = dto.file.buffer.byteLength;
```

**Step 6: Add `sizeBytes` to the status response**

In `apps/backend/src/api/controller/asset.controller.ts`, in the `status` method (line 77 map), add `sizeBytes`:

Change the map at lines 77-84 from:
```typescript
      data: assets.map((a) => ({
        id: a.id,
        title: a.title,
        type: a.type,
        mimeType: a.mimeType,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
```
to:
```typescript
      data: assets.map((a) => ({
        id: a.id,
        title: a.title,
        type: a.type,
        mimeType: a.mimeType,
        sizeBytes: a.sizeBytes ?? null,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
```

**Step 7: Rebuild and run the test**

```bash
cd apps/backend && bun run build && cd ../.. && bun test tests/integration/size-bytes.test.ts
```

Expected: PASS

**Step 8: Run all tests to check for regressions**

```bash
cd apps/backend && bun run build && cd ../.. && bun test
```

Expected: All tests pass.

**Step 9: Commit**

```bash
git add apps/backend/src/db/models/Asset.ts apps/backend/src/api/service/asset.service.ts apps/backend/src/api/controller/asset.controller.ts tests/integration/size-bytes.test.ts
git commit -m "feat: track sizeBytes on assets at creation, expose in status"
```

---

### Task 3: Delete endpoint

**Files:**
- Modify: `apps/backend/src/api/service/asset.service.ts` (add `deleteAsset` method)
- Modify: `apps/backend/src/api/controller/asset.controller.ts` (add `DELETE` route)

**Step 1: Write the failing test**

Create `tests/integration/delete.test.ts`:

```typescript
import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { startBackend, stopBackend, type TestBackend } from '../setup/backend';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from '../setup/database';
import { createTestApiKey } from '../setup/api-key';

let backend: TestBackend;
let apiKey: string;
const dbName = generateTestDbName();

beforeAll(async () => {
  await createTestDatabase(dbName);
  backend = await startBackend(dbName);
  apiKey = await createTestApiKey(backend.url);
});

afterAll(async () => {
  await stopBackend(backend);
  await dropTestDatabase(dbName);
});

async function createAsset(key: string): Promise<string> {
  const res = await fetch(`${backend.url}/v0/assets`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: 'text', content: 'deletable', title: 'To Delete' }),
  });
  const json = (await res.json()) as { ok: boolean; data: { id: string } };
  return json.data.id;
}

describe('delete endpoint', () => {
  test('deletes an asset and returns 204', async () => {
    const assetId = await createAsset(apiKey);

    const res = await fetch(`${backend.url}/v0/assets/${assetId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    expect(res.status).toBe(204);

    // Asset should no longer be accessible
    const metaRes = await fetch(`${backend.url}/v0/assets/${assetId}`);
    expect(metaRes.status).toBe(404);
  });

  test('returns 404 for non-existent asset', async () => {
    const res = await fetch(`${backend.url}/v0/assets/00000000-0000-0000-0000-000000000000`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    expect(res.status).toBe(404);
  });

  test('returns 403 when deleting another key\'s asset', async () => {
    const assetId = await createAsset(apiKey);
    const otherKey = await createTestApiKey(backend.url, 'other-key');

    const res = await fetch(`${backend.url}/v0/assets/${assetId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${otherKey}` },
    });
    expect(res.status).toBe(403);

    // Asset should still exist
    const metaRes = await fetch(`${backend.url}/v0/assets/${assetId}`);
    expect(metaRes.status).toBe(200);
  });

  test('asset content is removed from storage after delete', async () => {
    const assetId = await createAsset(apiKey);

    // Verify content exists
    const contentBefore = await fetch(`${backend.url}/v0/assets/${assetId}/content`);
    expect(contentBefore.status).toBe(200);

    // Delete
    await fetch(`${backend.url}/v0/assets/${assetId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    // Content should be gone (asset not found → 404)
    const contentAfter = await fetch(`${backend.url}/v0/assets/${assetId}/content`);
    expect(contentAfter.status).toBe(404);
  });

  test('deleted asset disappears from status', async () => {
    const assetId = await createAsset(apiKey);

    // Verify it appears in status
    let statusRes = await fetch(`${backend.url}/v0/assets/status`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    let statusJson = (await statusRes.json()) as { data: Array<{ id: string }> };
    expect(statusJson.data.some((a) => a.id === assetId)).toBe(true);

    // Delete it
    await fetch(`${backend.url}/v0/assets/${assetId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    // Should no longer appear in status
    statusRes = await fetch(`${backend.url}/v0/assets/status`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    statusJson = (await statusRes.json()) as { data: Array<{ id: string }> };
    expect(statusJson.data.some((a) => a.id === assetId)).toBe(false);
  });

  test('requires authentication', async () => {
    const assetId = await createAsset(apiKey);
    const res = await fetch(`${backend.url}/v0/assets/${assetId}`, {
      method: 'DELETE',
    });
    expect(res.status).toBe(401);
  });
});
```

**Step 2: Run the test to verify it fails**

```bash
cd apps/backend && bun run build && cd ../.. && bun test tests/integration/delete.test.ts
```

Expected: FAIL — DELETE method not handled (likely 404 or 405).

**Step 3: Add `deleteAsset` method to `AssetService`**

In `apps/backend/src/api/service/asset.service.ts`, add these imports at the top (update the existing import from `@nestjs/common`):

```typescript
import { Injectable, Inject, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
```

Add this method at the end of the class, before the closing `}`:

```typescript
  async deleteAsset(id: string, apiKeyId: string): Promise<void> {
    const asset = await this.findById(id);
    if (asset.apiKeyId !== apiKeyId) {
      throw new ForbiddenException({ ok: false, error: 'FORBIDDEN', message: 'You can only delete your own assets' });
    }

    this.logger.debug(`Deleting asset ${id} (key=${asset.storageKey})`);
    await this.storage.delete(asset.storageKey);
    await this.em.removeAndFlush(asset);
  }
```

**Step 4: Add the DELETE route to `AssetController`**

In `apps/backend/src/api/controller/asset.controller.ts`, add `Delete` and `HttpCode` to the NestJS imports:

```typescript
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  Req,
  Res,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
```

Add this method to the controller class. Place it after the `create` method and before the `status` method (after line 68):

```typescript
  @Delete(':uuid')
  @HttpCode(204)
  async delete(@Param('uuid') uuid: string, @Req() req: Request) {
    const apiKeyId = (req as any).apiKeyId;
    await this.assetService.deleteAsset(uuid, apiKeyId);
  }
```

**Important route ordering:** The `@Delete(':uuid')` route must come **after** `@Post()` but **before** `@Get('status')` and `@Get(':uuid')`. NestJS matches routes top-to-bottom, and we need specific string routes (`status`, `stats`) to be matched before the `:uuid` param catch-all. The delete route uses a different HTTP method so it won't conflict, but placing it near the other `:uuid` routes keeps the file organized. Put it right before the `@Get('status')` block.

**Step 5: Rebuild and run the test**

```bash
cd apps/backend && bun run build && cd ../.. && bun test tests/integration/delete.test.ts
```

Expected: PASS

**Step 6: Run all tests**

```bash
cd apps/backend && bun run build && cd ../.. && bun test
```

Expected: All tests pass.

**Step 7: Commit**

```bash
git add apps/backend/src/api/service/asset.service.ts apps/backend/src/api/controller/asset.controller.ts tests/integration/delete.test.ts
git commit -m "feat: add DELETE /v0/assets/:uuid endpoint with ownership check"
```

---

### Task 4: Stats endpoint

**Files:**
- Modify: `apps/backend/src/api/service/asset.service.ts` (add `getStats` method)
- Modify: `apps/backend/src/api/controller/asset.controller.ts` (add `GET stats` route)

**Step 1: Write the failing test**

Create `tests/integration/stats.test.ts`:

```typescript
import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { startBackend, stopBackend, type TestBackend } from '../setup/backend';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from '../setup/database';
import { createTestApiKey } from '../setup/api-key';

let backend: TestBackend;
let apiKey: string;
const dbName = generateTestDbName();

beforeAll(async () => {
  await createTestDatabase(dbName);
  backend = await startBackend(dbName);
  apiKey = await createTestApiKey(backend.url);
});

afterAll(async () => {
  await stopBackend(backend);
  await dropTestDatabase(dbName);
});

async function publishContent(key: string, type: string, content: string, title: string): Promise<void> {
  await fetch(`${backend.url}/v0/assets`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type, content, title }),
  });
}

describe('stats endpoint', () => {
  test('returns zeros with no assets', async () => {
    const res = await fetch(`${backend.url}/v0/assets/stats`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean; data: any };
    expect(json.ok).toBe(true);
    expect(json.data.assetCount).toBe(0);
    expect(json.data.totalBytes).toBe(0);
    expect(json.data.countsByType).toEqual({});
    expect(json.data.bytesByType).toEqual({});
  });

  test('returns correct counts and bytes after creating assets', async () => {
    const mdContent = '# Hello';
    const textContent = 'Just some text here';
    await publishContent(apiKey, 'markdown', mdContent, 'Stats MD');
    await publishContent(apiKey, 'text', textContent, 'Stats Text');

    const res = await fetch(`${backend.url}/v0/assets/stats`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const json = (await res.json()) as { ok: boolean; data: any };
    expect(json.data.assetCount).toBe(2);
    expect(json.data.totalBytes).toBe(
      Buffer.byteLength(mdContent, 'utf-8') + Buffer.byteLength(textContent, 'utf-8'),
    );
    expect(json.data.countsByType.markdown).toBe(1);
    expect(json.data.countsByType.text).toBe(1);
    expect(json.data.bytesByType.markdown).toBe(Buffer.byteLength(mdContent, 'utf-8'));
    expect(json.data.bytesByType.text).toBe(Buffer.byteLength(textContent, 'utf-8'));
  });

  test('only counts assets for the calling API key', async () => {
    const otherKey = await createTestApiKey(backend.url, 'stats-other');
    const res = await fetch(`${backend.url}/v0/assets/stats`, {
      headers: { Authorization: `Bearer ${otherKey}` },
    });
    const json = (await res.json()) as { ok: boolean; data: any };
    expect(json.data.assetCount).toBe(0);
    expect(json.data.totalBytes).toBe(0);
  });

  test('requires authentication', async () => {
    const res = await fetch(`${backend.url}/v0/assets/stats`);
    expect(res.status).toBe(401);
  });
});
```

**Step 2: Run the test to verify it fails**

```bash
cd apps/backend && bun run build && cd ../.. && bun test tests/integration/stats.test.ts
```

Expected: FAIL — route does not exist.

**Step 3: Add `getStats` method to `AssetService`**

In `apps/backend/src/api/service/asset.service.ts`, add this method to the class:

```typescript
  async getStats(apiKeyId: string): Promise<{
    assetCount: number;
    totalBytes: number;
    countsByType: Record<string, number>;
    bytesByType: Record<string, number>;
  }> {
    const knex = this.em.getKnex();
    const rows = await knex('asset')
      .select('type')
      .count('* as count')
      .sum('size_bytes as bytes')
      .where('api_key_id', apiKeyId)
      .groupBy('type');

    let assetCount = 0;
    let totalBytes = 0;
    const countsByType: Record<string, number> = {};
    const bytesByType: Record<string, number> = {};

    for (const row of rows) {
      const count = Number(row.count);
      const bytes = Number(row.bytes) || 0;
      assetCount += count;
      totalBytes += bytes;
      countsByType[row.type] = count;
      if (bytes > 0) bytesByType[row.type] = bytes;
    }

    return { assetCount, totalBytes, countsByType, bytesByType };
  }
```

**Step 4: Add the `GET stats` route to `AssetController`**

In `apps/backend/src/api/controller/asset.controller.ts`, add this method. It must come **before** the `@Get(':uuid')` route so NestJS matches `stats` as a literal before treating it as a UUID param. Place it right after the `status` method:

```typescript
  @Get('stats')
  async stats(@Req() req: Request) {
    const apiKeyId = (req as any).apiKeyId;
    const stats = await this.assetService.getStats(apiKeyId);
    return { ok: true, data: stats };
  }
```

**Route ordering in the controller should be:**
1. `@Post()` — create
2. `@Delete(':uuid')` — delete
3. `@Get('status')` — status (literal)
4. `@Get('stats')` — stats (literal)
5. `@Get(':uuid')` — metadata (param catch-all)
6. `@Get(':uuid/content')` — content

**Step 5: Rebuild and run the test**

```bash
cd apps/backend && bun run build && cd ../.. && bun test tests/integration/stats.test.ts
```

Expected: PASS

**Step 6: Run all tests**

```bash
cd apps/backend && bun run build && cd ../.. && bun test
```

Expected: All tests pass.

**Step 7: Commit**

```bash
git add apps/backend/src/api/service/asset.service.ts apps/backend/src/api/controller/asset.controller.ts tests/integration/stats.test.ts
git commit -m "feat: add GET /v0/assets/stats endpoint with aggregate counts and bytes"
```

---

### Task 5: CLI `delete` command

**Files:**
- Create: `packages/cli/src/commands/delete.ts`
- Modify: `packages/cli/src/cli.ts` (register command)

**Step 1: Write the failing test**

Add to the end of `tests/integration/delete.test.ts` (inside the existing `describe` block):

```typescript
  test('CLI delete command outputs success JSON', async () => {
    const assetId = await createAsset(apiKey);

    process.env.TOKENRIP_API_URL = backend.url;
    process.env.TOKENRIP_API_KEY = apiKey;

    const consoleSpy = spyOn(console, 'log').mockImplementation(() => {});
    const { deleteAsset } = await import('../../packages/cli/src/commands/delete');
    await deleteAsset(assetId);

    const lastCall = consoleSpy.mock.calls[consoleSpy.mock.calls.length - 1];
    const output = JSON.parse(lastCall[0] as string);
    expect(output.ok).toBe(true);
    expect(output.data.id).toBe(assetId);
    consoleSpy.mockRestore();
  });
```

Add `spyOn` to the imports at the top of the file:

```typescript
import { describe, test, expect, beforeAll, afterAll, spyOn } from 'bun:test';
```

**Step 2: Run the test to verify it fails**

```bash
cd packages/cli && bun run build && cd ../.. && bun test tests/integration/delete.test.ts
```

Expected: FAIL — module not found.

**Step 3: Create `packages/cli/src/commands/delete.ts`**

```typescript
import { loadConfig, getApiUrl, getApiKey } from '../config.js';
import { createHttpClient } from '../client.js';
import { CliError } from '../errors.js';
import { outputSuccess } from '../output.js';

export async function deleteAsset(uuid: string): Promise<void> {
  const config = loadConfig();
  const apiKey = getApiKey(config);
  if (!apiKey) {
    throw new CliError('NO_API_KEY', 'No API key configured. Run `tokenrip config set-key <key>`');
  }

  const client = createHttpClient({ baseUrl: getApiUrl(config), apiKey });
  await client.delete(`/v0/assets/${uuid}`);

  outputSuccess({ id: uuid, deleted: true });
}
```

**Step 4: Register the command in `packages/cli/src/cli.ts`**

Add the import at the top with the other command imports:

```typescript
import { deleteAsset } from './commands/delete.js';
```

Add the command registration after the `status` command block (before `program.parse()`):

```typescript
// delete command
program
  .command('delete')
  .argument('<uuid>', 'Asset ID to delete')
  .description('Delete an asset you published')
  .action(wrapCommand(deleteAsset));
```

**Step 5: Rebuild and run the test**

```bash
cd packages/cli && bun run build && cd ../.. && cd apps/backend && bun run build && cd ../.. && bun test tests/integration/delete.test.ts
```

Expected: PASS

**Step 6: Commit**

```bash
git add packages/cli/src/commands/delete.ts packages/cli/src/cli.ts tests/integration/delete.test.ts
git commit -m "feat: add tokenrip delete CLI command"
```

---

### Task 6: CLI `stats` command

**Files:**
- Create: `packages/cli/src/commands/stats.ts`
- Modify: `packages/cli/src/cli.ts` (register command)

**Step 1: Write the failing test**

Add to the end of `tests/integration/stats.test.ts` (inside the existing `describe` block):

```typescript
  test('CLI stats command outputs JSON', async () => {
    process.env.TOKENRIP_API_URL = backend.url;
    process.env.TOKENRIP_API_KEY = apiKey;

    const consoleSpy = spyOn(console, 'log').mockImplementation(() => {});
    const { stats } = await import('../../packages/cli/src/commands/stats');
    await stats();

    const lastCall = consoleSpy.mock.calls[consoleSpy.mock.calls.length - 1];
    const output = JSON.parse(lastCall[0] as string);
    expect(output.ok).toBe(true);
    expect(typeof output.data.assetCount).toBe('number');
    expect(typeof output.data.totalBytes).toBe('number');
    consoleSpy.mockRestore();
  });
```

Add `spyOn` to the imports at the top of the file:

```typescript
import { describe, test, expect, beforeAll, afterAll, spyOn } from 'bun:test';
```

**Step 2: Run the test to verify it fails**

```bash
cd packages/cli && bun run build && cd ../.. && bun test tests/integration/stats.test.ts
```

Expected: FAIL — module not found.

**Step 3: Create `packages/cli/src/commands/stats.ts`**

```typescript
import { loadConfig, getApiUrl, getApiKey } from '../config.js';
import { createHttpClient } from '../client.js';
import { CliError } from '../errors.js';
import { outputSuccess } from '../output.js';

export async function stats(): Promise<void> {
  const config = loadConfig();
  const apiKey = getApiKey(config);
  if (!apiKey) {
    throw new CliError('NO_API_KEY', 'No API key configured. Run `tokenrip config set-key <key>`');
  }

  const client = createHttpClient({ baseUrl: getApiUrl(config), apiKey });
  const { data } = await client.get('/v0/assets/stats');

  outputSuccess(data.data);
}
```

**Step 4: Register the command in `packages/cli/src/cli.ts`**

Add the import at the top with the other command imports:

```typescript
import { stats } from './commands/stats.js';
```

Add the command registration after the `delete` command block:

```typescript
// stats command
program
  .command('stats')
  .description('Show storage usage statistics')
  .action(wrapCommand(stats));
```

**Step 5: Rebuild and run the test**

```bash
cd packages/cli && bun run build && cd ../.. && cd apps/backend && bun run build && cd ../.. && bun test tests/integration/stats.test.ts
```

Expected: PASS

**Step 6: Commit**

```bash
git add packages/cli/src/commands/stats.ts packages/cli/src/cli.ts tests/integration/stats.test.ts
git commit -m "feat: add tokenrip stats CLI command"
```

---

### Task 7: Final — run full test suite

**Step 1: Rebuild everything**

```bash
cd apps/backend && bun run build && cd ../../packages/cli && bun run build && cd ../..
```

**Step 2: Run all tests**

```bash
bun test
```

Expected: All tests pass, including the new `size-bytes.test.ts`, `delete.test.ts`, and `stats.test.ts`.

**Step 3: Verify test count increased**

The test output should show the new test files and their passing tests alongside the existing suite.
