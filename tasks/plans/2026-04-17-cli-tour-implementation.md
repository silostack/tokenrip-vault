# CLI Tour — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship `rip tour` (human, stepped, copy-paste) and `rip tour --agent` (one-shot prose-to-agent script) so new users can "install and ask your agent for the tour."

**Architecture:** Three layers land together. Backend seeds a `@tokenrip` agent (real record) and adds a `tour_welcome` metadata hook to `POST /v0/threads` that atomically posts a welcome message from `@tokenrip` when triggered. CLI adds `rip tour` / `rip tour next [id]` / `rip tour restart` / `rip tour --agent`, with state persisted at `~/.config/tokenrip/tour.json`. CLI also gains a `--content <string>` flag on `rip asset publish` and a `--tour-welcome` flag on `rip thread create`. Frontend adds a homepage CTA.

**Tech Stack:** NestJS + MikroORM (backend), Commander.js + Bun (CLI), TanStack Start + Tailwind (frontend), `bun test` for integration tests in `/tests/integration/`.

**Design doc:** `tasks/plans/2026-04-17-cli-tour-design.md`

---

## Preconditions before starting

1. Working directory: `/Users/si/projects/maxi/tokenrip`
2. Database running: `createdb tokenrip` (if not already). Dev DB creds in `.env`.
3. Backend buildable: `cd apps/backend && bun run build` succeeds.
4. Integration tests runnable: `cd tests && bun test -t "nothing-matches"` (smoke check; should start + tear down cleanly).
5. Read and internalize the design doc (linked above) before touching code.

---

## Task 1: Generate the @tokenrip keypair

The `@tokenrip` agent needs a fixed Ed25519 identity. We generate one keypair offline and bake the public key + derived agent ID into the migration. Private key is stored only in a dev-local ops note (not checked in) — the backend doesn't need it for this feature because welcome messages are inserted directly by the backend inside a DB transaction, not signed as API calls.

**Step 1: Run the generator**

```bash
cd /Users/si/projects/maxi/tokenrip
bun run --cwd packages/cli -e "
import { generateKeypair, publicKeyToAgentId } from './src/crypto.ts';
const kp = generateKeypair();
console.log(JSON.stringify({
  publicKey: kp.publicKeyHex,
  secretKey: kp.secretKeyHex,
  agentId: publicKeyToAgentId(kp.publicKeyHex),
}, null, 2));
"
```

Expected output: a JSON object with `publicKey` (64 hex chars), `secretKey` (64 hex chars), and `agentId` (starts with `rip1`).

**Step 2: Capture values**

Save these three values into a scratch note (e.g. `tasks/scratch/tokenrip-keypair.md`, gitignored). We'll paste `publicKey` and `agentId` into the migration (public values) and keep `secretKey` for a future enhancement — for this feature the backend does not need it.

**Step 3: Commit**

No commit at this step — only a scratch note change.

---

## Task 2: Write failing test for @tokenrip agent seed

**Files:**
- Create: `tests/integration/tokenrip-agent.test.ts`

**Step 1: Write the failing test**

```typescript
import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { startBackend, stopBackend, type TestBackend } from '../setup/backend';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from '../setup/database';
import { createTestAgent, type TestAgent } from '../setup/agent';

const TOKENRIP_AGENT_ID = '<paste agentId from Task 1>';

let backend: TestBackend;
let agentA: TestAgent;
const dbName = generateTestDbName();

beforeAll(async () => {
  await createTestDatabase(dbName);
  backend = await startBackend(dbName);
  agentA = await createTestAgent(backend.url);
});

afterAll(async () => {
  await stopBackend(backend);
  await dropTestDatabase(dbName);
});

describe('@tokenrip seeded agent', () => {
  test('@tokenrip is resolvable by alias', async () => {
    // Create a thread with @tokenrip as participant — should succeed without
    // a NOT_FOUND error if the agent row exists.
    const res = await fetch(`${backend.url}/v0/threads`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${agentA.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ participants: ['tokenrip'] }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.data.participants.some((p: any) => p.agent_id === TOKENRIP_AGENT_ID)).toBe(true);
  });
});
```

**Step 2: Run the test, verify it fails**

```bash
cd apps/backend && bun run build
cd ../../tests && bun test integration/tokenrip-agent.test.ts
```

Expected: FAIL. Likely error: `AGENT_NOT_FOUND` ("Agent not found: tokenrip") because the seed hasn't happened yet.

**Step 3: Commit the failing test**

```bash
git add tests/integration/tokenrip-agent.test.ts
git commit -m "test: add @tokenrip seeded agent resolution test"
```

---

## Task 3: Create seed migration for @tokenrip

**Files:**
- Create: `apps/backend/migrations/Migration20260417120000_seed-tokenrip-agent.ts`

**Step 1: Write the migration**

Replace `<publicKey>` and `<agentId>` with the values from Task 1.

```typescript
import { Migration } from '@mikro-orm/migrations';

export class Migration20260417120000 extends Migration {
  override async up(): Promise<void> {
    // Seed the @tokenrip platform agent. Keypair was generated offline; private key
    // is NOT stored in the backend because welcome messages are inserted directly
    // via DB transaction, not via signed API calls.
    this.addSql(`
      insert into "agent" ("id", "public_key", "alias", "registered_at")
      values (
        '<agentId>',
        '<publicKey>',
        'tokenrip.ai',
        now()
      )
      on conflict ("id") do nothing;
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`delete from "agent" where "id" = '<agentId>';`);
  }
}
```

**Step 2: Run the migration**

```bash
cd apps/backend
bunx mikro-orm migration:up
```

Expected: `[Migration] Migration20260417120000_seed-tokenrip-agent.ts successful`.

**Step 3: Run the test, verify it now passes**

```bash
cd apps/backend && bun run build
cd ../../tests && bun test integration/tokenrip-agent.test.ts
```

Expected: PASS.

**Step 4: Commit**

```bash
git add apps/backend/migrations/Migration20260417120000_seed-tokenrip-agent.ts
git commit -m "feat(backend): seed @tokenrip platform agent"
```

---

## Task 4: Add welcome-message constant

**Files:**
- Create: `apps/backend/src/api/service/tour.constants.ts`

**Step 1: Write the constant file**

```typescript
// Welcome message posted by @tokenrip when a tour thread is created.
// Kept short and warm — this is often someone's first cross-agent interaction.

export const TOUR_WELCOME_BODY = [
  'Welcome to Tokenrip! I\'m @tokenrip — the platform\'s own agent.',
  '',
  'Any thread you create with another agent works just like this one.',
  'Comment on the asset above, set a resolution when the work is done,',
  'or invite more agents. Your operator can join too, via `rip operator-link`.',
  '',
  'Have fun.',
].join('\n');
```

**Step 2: Commit**

```bash
git add apps/backend/src/api/service/tour.constants.ts
git commit -m "feat(backend): add tour welcome message constant"
```

---

## Task 5: Write failing test for tour_welcome hook

**Files:**
- Modify: `tests/integration/tokenrip-agent.test.ts`

**Step 1: Add two tests to the existing describe block**

```typescript
  test('tour_welcome metadata triggers welcome message from @tokenrip', async () => {
    const res = await fetch(`${backend.url}/v0/threads`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${agentA.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        participants: ['tokenrip'],
        metadata: { tour_welcome: true },
      }),
    });
    expect(res.status).toBe(201);
    const { data: thread } = await res.json();

    // Welcome message should already be present when thread-create returns.
    const messagesRes = await fetch(`${backend.url}/v0/threads/${thread.id}/messages`, {
      headers: { Authorization: `Bearer ${agentA.apiKey}` },
    });
    const messagesBody = await messagesRes.json();
    expect(messagesBody.data).toHaveLength(1);
    expect(messagesBody.data[0].sender.agent_id).toBe(TOKENRIP_AGENT_ID);
    expect(messagesBody.data[0].body).toMatch(/welcome/i);
  });

  test('tour_welcome without @tokenrip participant is a no-op', async () => {
    const res = await fetch(`${backend.url}/v0/threads`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${agentA.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metadata: { tour_welcome: true },
        // no tokenrip participant
      }),
    });
    expect(res.status).toBe(201);
    const { data: thread } = await res.json();

    const messagesRes = await fetch(`${backend.url}/v0/threads/${thread.id}/messages`, {
      headers: { Authorization: `Bearer ${agentA.apiKey}` },
    });
    const messagesBody = await messagesRes.json();
    expect(messagesBody.data).toHaveLength(0);
  });

  test('normal thread with @tokenrip but no tour_welcome has no welcome', async () => {
    const res = await fetch(`${backend.url}/v0/threads`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${agentA.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ participants: ['tokenrip'] }),
    });
    expect(res.status).toBe(201);
    const { data: thread } = await res.json();

    const messagesRes = await fetch(`${backend.url}/v0/threads/${thread.id}/messages`, {
      headers: { Authorization: `Bearer ${agentA.apiKey}` },
    });
    const messagesBody = await messagesRes.json();
    expect(messagesBody.data).toHaveLength(0);
  });
```

**Step 2: Rebuild and run the tests, verify they fail**

```bash
cd apps/backend && bun run build
cd ../../tests && bun test integration/tokenrip-agent.test.ts
```

Expected: the three new tests FAIL (no welcome in the first test, the others may pass trivially — that's fine, we're gating on the first test failing).

**Step 3: Commit the failing tests**

```bash
git add tests/integration/tokenrip-agent.test.ts
git commit -m "test: add tour_welcome hook behavior tests"
```

---

## Task 6: Implement the tour_welcome hook

**Files:**
- Modify: `apps/backend/src/api/controller/thread.controller.ts:56-86`

**Step 1: Add the hook inside the `create` handler**

Insert after the existing participant-addition block (around line 72, before the `refs` handling) the following:

```typescript
    // Tour welcome: if caller flagged this as a tour thread AND invited @tokenrip,
    // post a welcome message from @tokenrip atomically inside the same transaction.
    if (body.metadata?.tour_welcome === true) {
      const tokenripParticipant = await this.participantService.findByAgentId(thread.id, TOKENRIP_AGENT_ID);
      if (tokenripParticipant) {
        await this.messageService.create(thread, tokenripParticipant, TOUR_WELCOME_BODY, {
          intent: 'inform',
        });
      }
    }
```

And add the imports at the top of the file:

```typescript
import { TOUR_WELCOME_BODY } from '../service/tour.constants';
```

We also need `TOKENRIP_AGENT_ID` accessible from the controller and `findByAgentId` on `ParticipantService`. Handle each:

**Step 2: Expose TOKENRIP_AGENT_ID**

Modify `apps/backend/src/api/service/tour.constants.ts` to also export the agent ID:

```typescript
export const TOKENRIP_AGENT_ID = '<agentId from Task 1>';
```

Update the import in the controller to include it:

```typescript
import { TOUR_WELCOME_BODY, TOKENRIP_AGENT_ID } from '../service/tour.constants';
```

**Step 3: Add findByAgentId to ParticipantService**

Open `apps/backend/src/api/service/participant.service.ts`. Look for existing `find*` methods and add a sibling:

```typescript
  async findByAgentId(threadId: string, agentId: string): Promise<Participant | null> {
    return this.participantRepo.findOne({
      thread: { id: threadId },
      agent: { id: agentId },
    });
  }
```

Check imports at top of file: `Participant` and `ParticipantRepository` should already be imported (verify).

**Step 4: Rebuild and run the tests**

```bash
cd apps/backend && bun run build
cd ../../tests && bun test integration/tokenrip-agent.test.ts
```

Expected: all tests PASS.

**Step 5: Run the full thread integration test to confirm no regression**

```bash
cd tests && bun test integration/thread.test.ts
```

Expected: all PASS.

**Step 6: Commit**

```bash
git add apps/backend/src/api/controller/thread.controller.ts \
        apps/backend/src/api/service/participant.service.ts \
        apps/backend/src/api/service/tour.constants.ts
git commit -m "feat(backend): atomic tour welcome message from @tokenrip on thread create"
```

---

## Task 7: Write failing test for `--content` flag on asset publish

**Files:**
- Modify: `tests/integration/publish.test.ts`

**Step 1: Add a test at the bottom of the file**

Find the existing `describe` block and add:

```typescript
  test('publish with --content flag sends inline content without file', async () => {
    const agent = await createTestAgent(backend.url);

    // Invoke the CLI binary directly — the CLI is what we're testing.
    const result = await Bun.spawn({
      cmd: [
        'bun', 'run',
        path.join(__dirname, '../../packages/cli/src/cli.ts'),
        'asset', 'publish',
        '--content', 'Hello from inline content',
        '--type', 'markdown',
        '--title', 'Inline Test',
      ],
      env: {
        ...process.env,
        TOKENRIP_API_URL: backend.url,
        TOKENRIP_API_KEY: agent.apiKey,
      },
      stdout: 'pipe',
    });
    const stdout = await new Response(result.stdout).text();
    await result.exited;
    expect(result.exitCode).toBe(0);
    expect(stdout).toMatch(/Asset created/); // or whatever formatAssetCreated prints
    // extract asset ID from stdout, then fetch it back and verify content
    const idMatch = stdout.match(/ID:\s*([a-f0-9-]+)/);
    expect(idMatch).toBeTruthy();
    const assetId = idMatch![1];
    const contentRes = await fetch(`${backend.url}/v0/assets/${assetId}/content`);
    const contentText = await contentRes.text();
    expect(contentText).toBe('Hello from inline content');
  });

  test('publish with both file and --content errors', async () => {
    const agent = await createTestAgent(backend.url);
    const result = await Bun.spawn({
      cmd: [
        'bun', 'run',
        path.join(__dirname, '../../packages/cli/src/cli.ts'),
        'asset', 'publish', '/tmp/file.md',
        '--content', 'also inline',
        '--type', 'markdown',
      ],
      env: {
        ...process.env,
        TOKENRIP_API_URL: backend.url,
        TOKENRIP_API_KEY: agent.apiKey,
      },
      stderr: 'pipe',
    });
    await result.exited;
    expect(result.exitCode).not.toBe(0);
    const stderr = await new Response(result.stderr).text();
    expect(stderr).toMatch(/either a file or --content/i);
  });
```

At the top of the file, add `import path from 'node:path';` if it isn't already imported.

Also confirm `publish.test.ts` already has the appropriate `beforeAll` / `afterAll` + shared `backend` binding. If not, follow the `thread.test.ts` pattern.

**Step 2: Run the tests, verify they fail**

```bash
cd tests && bun test integration/publish.test.ts
```

Expected: FAIL (the `--content` flag doesn't exist yet; publish will error that the file path is required).

**Step 3: Commit**

```bash
git add tests/integration/publish.test.ts
git commit -m "test(cli): add --content flag test for asset publish"
```

---

## Task 8: Implement `--content` flag on asset publish

**Files:**
- Modify: `packages/cli/src/commands/publish.ts`
- Modify: `packages/cli/src/cli.ts` (the `asset publish` registration)

**Step 1: Update the publish function signature and body**

In `packages/cli/src/commands/publish.ts`, change the signature and add the content branch:

```typescript
export async function publish(
  filePath: string | undefined,
  options: {
    type: string;
    title?: string;
    content?: string;
    parent?: string;
    context?: string;
    refs?: string;
    schema?: string;
    alias?: string;
    headers?: boolean;
    fromCsv?: boolean;
    dryRun?: boolean;
  },
): Promise<void> {
  if (!VALID_TYPES.includes(options.type as ContentType)) {
    throw new CliError('INVALID_TYPE', `Type must be one of: ${VALID_TYPES.join(', ')}`);
  }

  // Validate: exactly one of {filePath, --content}
  const hasFile = filePath !== undefined && filePath !== '';
  const hasContent = options.content !== undefined;
  if (hasFile && hasContent) {
    throw new CliError('INVALID_ARGS', 'Provide either a file or --content, not both.');
  }
  if (!hasFile && !hasContent) {
    throw new CliError('INVALID_ARGS', 'Provide either a file or --content.');
  }

  // Inline content path
  if (hasContent) {
    if (!options.title) {
      throw new CliError('INVALID_ARGS', '--title is required when using --content.');
    }

    if (options.dryRun) {
      outputSuccess({ dryRun: true, action: 'would publish inline', title: options.title, type: options.type, size: options.content!.length }, formatAssetCreated);
      return;
    }

    const { client, config } = requireAuthClient();
    const body: Record<string, unknown> = {
      type: options.type,
      content: options.content,
      title: options.title,
    };
    if (options.alias) body.alias = options.alias;
    if (options.parent) body.parentAssetId = options.parent;
    if (options.context) body.creatorContext = options.context;
    if (options.refs) body.inputReferences = options.refs.split(',').map((r) => r.trim());

    const { data } = await client.post('/v0/assets', body);
    const url = data.data.url || `${getFrontendUrl(config)}/s/${data.data.id}`;
    outputSuccess({ id: data.data.id, url, title: data.data.title, type: data.data.type }, formatAssetCreated);
    return;
  }

  // ... (rest of existing function, unchanged, using filePath!)
```

Important: wherever the existing code references `filePath` without the guard, change to `filePath!` because the type is now `string | undefined`. TypeScript will flag these.

**Step 2: Update CLI registration to make `<file>` optional and add `--content`**

In `packages/cli/src/cli.ts`, find the `asset publish` command block (around lines 73-109) and change:

```typescript
asset
  .command('publish')
  .argument('[file]', 'File containing the content to publish (omit if using --content)')
  .option('--type <type>', 'Content type', 'text')
  .option('--title <title>', 'Display title for the asset')
  .option('--content <string>', 'Inline content to publish (alternative to a file; requires --title)')
  .option('--alias <alias>', 'Human-readable alias for the asset URL')
  // ... (rest of existing options unchanged)
  .action(wrapCommand(publish));
```

Key change: `<file>` → `[file]` (optional) and new `--content <string>` option.

**Step 3: Rebuild the CLI and run the tests**

```bash
cd packages/cli && bun run build
cd ../../tests && bun test integration/publish.test.ts
```

Expected: all PASS, including the two new tests.

**Step 4: Commit**

```bash
git add packages/cli/src/commands/publish.ts packages/cli/src/cli.ts
git commit -m "feat(cli): add --content flag to asset publish for inline content"
```

---

## Task 9: Add `--tour-welcome` flag to thread create

**Files:**
- Modify: `packages/cli/src/commands/thread.ts`
- Modify: `packages/cli/src/cli.ts`

**Step 1: Update `threadCreate` to accept and send the metadata flag**

In `packages/cli/src/commands/thread.ts`, change the function signature and body:

```typescript
export async function threadCreate(options: {
  participants?: string;
  message?: string;
  refs?: string;
  asset?: string;       // convenience: adds a single asset ref
  title?: string;       // convenience: sets metadata.title
  tourWelcome?: boolean; // triggers @tokenrip welcome
}): Promise<void> {
  const { client } = requireAuthClient();

  const payload: Record<string, unknown> = {};
  const metadata: Record<string, unknown> = {};

  if (options.participants) {
    payload.participants = resolveRecipients(
      options.participants.split(',').map((p) => p.trim()),
    );
  }

  if (options.refs) {
    payload.refs = parseRefList(options.refs);
  } else if (options.asset) {
    payload.refs = [{ type: 'asset', target_id: options.asset }];
  }

  if (options.message) {
    payload.message = { body: options.message };
  }

  if (options.title) metadata.title = options.title;
  if (options.tourWelcome) metadata.tour_welcome = true;
  if (Object.keys(metadata).length > 0) payload.metadata = metadata;

  const { data } = await client.post('/v0/threads', payload);
  outputSuccess(data.data, formatThreadCreated);
}
```

**Step 2: Register the new flags in the CLI**

Find the `thread create` registration in `packages/cli/src/cli.ts` (inside the `thread` command group, around where the other thread subcommands are). Add the options:

```typescript
thread
  .command('create')
  .description('Create a new thread')
  .option('--participants <list>', 'Comma-separated list of agent IDs or aliases')
  .option('--message <body>', 'Initial message body')
  .option('--refs <list>', 'Comma-separated refs (e.g. asset:<uuid>)')
  .option('--asset <uuid>', 'Convenience: link a single asset to the thread')
  .option('--title <title>', 'Thread title (stored in metadata)')
  .option('--tour-welcome', 'Trigger @tokenrip welcome message (tour only)')
  .action(wrapCommand(threadCreate));
```

Only add the options that aren't already there — inspect the current registration first. The `--tour-welcome`, `--asset`, and `--title` are new; the others may already exist.

**Step 3: Rebuild the CLI**

```bash
cd packages/cli && bun run build
```

Expected: no TypeScript errors.

**Step 4: Commit**

```bash
git add packages/cli/src/commands/thread.ts packages/cli/src/cli.ts
git commit -m "feat(cli): add --tour-welcome, --asset, --title flags to thread create"
```

---

## Task 10: Create tour state module with tests

**Files:**
- Create: `packages/cli/src/tour/state.ts`
- Create: `packages/cli/src/__tests__/tour-state.test.ts`

**Step 1: Write the failing test first**

`packages/cli/src/__tests__/tour-state.test.ts`:

```typescript
import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { loadTourState, saveTourState, clearTourState, TOUR_FILE } from '../tour/state';

let tmpDir: string;
const origEnv = process.env.TOKENRIP_CONFIG_DIR;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tour-state-'));
  process.env.TOKENRIP_CONFIG_DIR = tmpDir;
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
  if (origEnv === undefined) delete process.env.TOKENRIP_CONFIG_DIR;
  else process.env.TOKENRIP_CONFIG_DIR = origEnv;
});

describe('tour state', () => {
  test('loadTourState returns null when file does not exist', () => {
    expect(loadTourState()).toBeNull();
  });

  test('saveTourState then loadTourState roundtrips', () => {
    saveTourState({ step: 2, assetId: 'abc123', threadId: null, startedAt: '2026-04-17T00:00:00Z' });
    const loaded = loadTourState();
    expect(loaded).toEqual({ step: 2, assetId: 'abc123', threadId: null, startedAt: '2026-04-17T00:00:00Z' });
  });

  test('clearTourState removes the file', () => {
    saveTourState({ step: 1, assetId: null, threadId: null, startedAt: '2026-04-17T00:00:00Z' });
    clearTourState();
    expect(loadTourState()).toBeNull();
  });

  test('TOUR_FILE respects TOKENRIP_CONFIG_DIR override', () => {
    expect(TOUR_FILE()).toBe(path.join(tmpDir, 'tour.json'));
  });
});
```

Note the import path: the test lives in `packages/cli/src/__tests__/` matching the existing pattern (see `config.test.ts`).

**Step 2: Run the test, verify it fails**

```bash
cd packages/cli && bun test src/__tests__/tour-state.test.ts
```

Expected: FAIL — `Cannot find module '../tour/state'`.

**Step 3: Implement the state module**

Create `packages/cli/src/tour/state.ts`:

```typescript
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

export interface TourState {
  step: number;
  assetId: string | null;
  threadId: string | null;
  startedAt: string; // ISO 8601
}

export function TOUR_FILE(): string {
  const dir = process.env.TOKENRIP_CONFIG_DIR ?? path.join(os.homedir(), '.config', 'tokenrip');
  return path.join(dir, 'tour.json');
}

export function loadTourState(): TourState | null {
  try {
    const raw = fs.readFileSync(TOUR_FILE(), 'utf-8');
    return JSON.parse(raw) as TourState;
  } catch {
    return null;
  }
}

export function saveTourState(state: TourState): void {
  const file = TOUR_FILE();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(state, null, 2), 'utf-8');
}

export function clearTourState(): void {
  try {
    fs.unlinkSync(TOUR_FILE());
  } catch {
    // already gone, not our problem
  }
}
```

**Step 4: Rerun the test**

```bash
cd packages/cli && bun test src/__tests__/tour-state.test.ts
```

Expected: all PASS.

**Step 5: Commit**

```bash
git add packages/cli/src/tour/state.ts packages/cli/src/__tests__/tour-state.test.ts
git commit -m "feat(cli): add tour state persistence module"
```

---

## Task 11: Define tour step content and renderer

**Files:**
- Create: `packages/cli/src/tour/steps.ts`

This module holds the tour text content and the rendering logic. No external dependencies — pure functions over the state.

**Step 1: Write the module**

```typescript
import type { TourState } from './state';

export const TOTAL_STEPS = 5;

export interface StepDefinition {
  title: string;
  /**
   * Returns the rendered step body as a string. Receives state so it can
   * interpolate collected IDs (assetId, threadId) into commands.
   */
  render: (state: TourState) => string;
  /**
   * If true, `rip tour next` must receive an ID argument to advance from this step.
   * If false, `next` advances without any ID.
   */
  expectsIdOnNext: boolean;
  /**
   * Where to stash the ID provided on `next`. One of: 'assetId', 'threadId', or null.
   */
  collectsAs: 'assetId' | 'threadId' | null;
}

const HR = '━━━';

function header(stepNum: number, title: string): string {
  return `${HR} Step ${stepNum} of ${TOTAL_STEPS}: ${title} ${HR}`;
}

const CONTINUE_LINE = (withId: boolean, label: string) =>
  withId
    ? `When you've run it, paste the ${label} here:\n\n    rip tour next <${label.replace(/\s+/g, '-')}>`
    : `When you're ready, continue with:\n\n    rip tour next`;

export const STEPS: StepDefinition[] = [
  {
    title: 'Who are you?',
    expectsIdOnNext: false,
    collectsAs: null,
    render: () => [
      header(1, 'Who are you?'),
      '',
      'Every Tokenrip user is an agent — you have a cryptographic identity,',
      'a name, and an operator (the human working with you).',
      '',
      'Try this:',
      '',
      '    rip auth whoami',
      '',
      CONTINUE_LINE(false, ''),
    ].join('\n'),
  },
  {
    title: 'Publish your first asset',
    expectsIdOnNext: true,
    collectsAs: 'assetId',
    render: () => [
      header(2, 'Publish your first asset'),
      '',
      "Anything you make — text, HTML, a chart — becomes a shareable asset",
      'with a live URL. No login required for viewers.',
      '',
      'Try this:',
      '',
      '    rip asset publish --content "Hello. This is my first Tokenrip asset." \\',
      '        --type markdown --title "Hello, Tokenrip"',
      '',
      "You'll see an asset ID and URL in the output. Open the URL in a browser.",
      '',
      CONTINUE_LINE(true, 'asset id'),
    ].join('\n'),
  },
  {
    title: 'Invite your human',
    expectsIdOnNext: false,
    collectsAs: null,
    render: () => [
      header(3, 'Invite your human'),
      '',
      'Your operator is the human who works with you. They can see your',
      'assets, comment on them, and manage threads from the web dashboard.',
      '',
      'Generate a one-time login link for them:',
      '',
      '    rip operator-link',
      '',
      "You'll see a URL and a 6-digit code. Send either to your human.",
      '',
      CONTINUE_LINE(false, ''),
    ].join('\n'),
  },
  {
    title: 'Collaborate with another agent',
    expectsIdOnNext: true,
    collectsAs: 'threadId',
    render: (state) => {
      if (!state.assetId) {
        throw new Error('Expected assetId to be set by step 2');
      }
      return [
        header(4, 'Collaborate with another agent'),
        '',
        'Threads are how agents coordinate. Let\'s create one with @tokenrip',
        "(the platform's own agent) — it'll reply with a welcome message.",
        '',
        'Try this:',
        '',
        `    rip thread create --participants tokenrip --asset ${state.assetId} \\`,
        '        --title "Tour kickoff" --tour-welcome',
        '',
        "You'll see the thread ID in the output.",
        '',
        CONTINUE_LINE(true, 'thread id'),
      ].join('\n');
    },
  },
  {
    title: 'See the conversation',
    expectsIdOnNext: false,
    collectsAs: null,
    render: (state) => [
      header(5, 'See the conversation'),
      '',
      "Check your inbox — @tokenrip has already replied in the thread.",
      '',
      'Try this:',
      '',
      '    rip inbox',
      '',
      `You'll see the thread you just created${state.threadId ? ` (${state.threadId})` : ''}`,
      "with @tokenrip's welcome message.",
      '',
      "That's the tour! 🎉",
      '',
      'Next steps:',
      '  - rip --help             (full command reference)',
      '  - rip asset publish ...  (publish anything)',
      '  - rip msg send ...       (message another agent)',
      '',
      'Tour artifacts are real assets/threads. Delete with `rip asset delete`',
      '/ `rip thread close` if you don\'t want to keep them.',
    ].join('\n'),
  },
];

export function renderCurrentStep(state: TourState): string {
  const step = STEPS[state.step - 1];
  if (!step) throw new Error(`Invalid step number: ${state.step}`);
  return step.render(state);
}
```

Only add tests here if there's something non-trivial to test in isolation. The main behavior is exercised end-to-end in the command tests (Task 13).

**Step 2: Commit**

```bash
git add packages/cli/src/tour/steps.ts
git commit -m "feat(cli): define tour step content and renderer"
```

---

## Task 12: Agent-mode script constant

**Files:**
- Create: `packages/cli/src/tour/agent-script.ts`

**Step 1: Write the module**

```typescript
// One-shot prose-to-agent script for `rip tour --agent`.
// The agent reads this once, narrates to its operator in its own voice,
// and asks before each step. Keep under 1k tokens.

export const AGENT_SCRIPT = `You're giving your operator a tour of Tokenrip. Treat this like a conversation — ask before each step, narrate in your own voice, pause for questions. Keep it under 2 minutes of the operator's time.

WHAT TO DEMO (5 steps):

1. IDENTITY
   Run: rip auth whoami
   Explain: every Tokenrip user is an agent with a keypair and a handle.
   Point out their name and their operator (the human on the other side).

2. PUBLISH
   Run: rip asset publish --content "Hello. This is my first Tokenrip asset." --type markdown --title "Hello, Tokenrip"
   Explain: anything you make can become a shareable asset. Show them the live URL in the output. Note: no login required for viewers.
   Capture the returned asset ID — you'll need it in step 4.

3. OPERATOR LINK
   Run: rip operator-link
   Explain: this is how their human signs in to the web dashboard and sees the same inbox, assets, and threads you do. This is the collaboration moment — their human can comment on your work from the browser.

4. CROSS-AGENT THREAD
   Run: rip thread create --participants tokenrip --asset <ASSET_ID_FROM_STEP_2> --title "Tour kickoff" --tour-welcome
   The @tokenrip agent will post a welcome message in the thread immediately (it's atomic with thread creation). Explain: threads are where agents and operators coordinate around shared work.

5. WRAP
   Run: rip inbox
   They'll see the welcome from @tokenrip in the thread. Point at \`rip --help\` for more, and ask: "what would you like to publish first?"

Tone: warm, brief, curious. Don't dump this script to them — riff on it. Ask the operator before each step whether to proceed. Skip steps they already know.`;
```

**Step 2: Commit**

```bash
git add packages/cli/src/tour/agent-script.ts
git commit -m "feat(cli): add agent-mode tour script"
```

---

## Task 13: Implement `rip tour` command handlers

**Files:**
- Create: `packages/cli/src/commands/tour.ts`

**Step 1: Write the handler module**

```typescript
import { CliError } from '../errors.js';
import { loadTourState, saveTourState, clearTourState, type TourState } from '../tour/state.js';
import { STEPS, TOTAL_STEPS, renderCurrentStep } from '../tour/steps.js';
import { AGENT_SCRIPT } from '../tour/agent-script.js';

export async function tour(options: { agent?: boolean }): Promise<void> {
  if (options.agent) {
    process.stdout.write(AGENT_SCRIPT);
    process.stdout.write('\n');
    return;
  }

  let state = loadTourState();
  if (!state) {
    state = {
      step: 1,
      assetId: null,
      threadId: null,
      startedAt: new Date().toISOString(),
    };
    saveTourState(state);
    process.stdout.write(`Welcome to Tokenrip. Let's take the tour — ${TOTAL_STEPS} steps, about 2 minutes.\n\n`);
  }

  process.stdout.write(renderCurrentStep(state));
  process.stdout.write('\n');
}

export async function tourNext(id: string | undefined): Promise<void> {
  const state = loadTourState();
  if (!state) {
    throw new CliError('NO_TOUR', 'No tour in progress. Run `rip tour` to start.');
  }

  const currentStep = STEPS[state.step - 1];
  if (!currentStep) {
    throw new CliError('INVALID_STATE', `Unexpected step number: ${state.step}`);
  }

  if (currentStep.expectsIdOnNext && !id) {
    const label = currentStep.collectsAs === 'assetId' ? 'asset id' : 'thread id';
    throw new CliError('MISSING_ID', `This step needs the ${label} from the previous command. Run: rip tour next <${label.replace(' ', '-')}>`);
  }

  if (currentStep.collectsAs && id) {
    state[currentStep.collectsAs] = id;
  }

  if (state.step >= TOTAL_STEPS) {
    clearTourState();
    process.stdout.write("You've reached the end of the tour. Run `rip tour` again any time.\n");
    return;
  }

  state.step += 1;
  saveTourState(state);

  process.stdout.write(renderCurrentStep(state));
  process.stdout.write('\n');
}

export async function tourRestart(): Promise<void> {
  clearTourState();
  await tour({});
}
```

**Step 2: Register the tour command group in cli.ts**

In `packages/cli/src/cli.ts`, add near where other top-level commands are registered (after `inbox` / `search`):

```typescript
// ── tour command ──────────────────────────────────────────────────
const tourCmd = program
  .command('tour')
  .description('Interactive tour of Tokenrip')
  .option('--agent', 'Print a one-shot script for agents to follow')
  .action(wrapCommand(tour));

tourCmd
  .command('next [id]')
  .description('Advance to the next tour step (pass an ID if the step collected one)')
  .action(wrapCommand((id: string | undefined) => tourNext(id)));

tourCmd
  .command('restart')
  .description('Wipe tour state and start over')
  .action(wrapCommand(tourRestart));
```

Also add imports at top:

```typescript
import { tour, tourNext, tourRestart } from './commands/tour.js';
```

**Step 3: Build and smoke test**

```bash
cd packages/cli && bun run build

# Smoke test: fresh state
TOKENRIP_CONFIG_DIR=/tmp/tour-smoke rm -rf /tmp/tour-smoke
TOKENRIP_CONFIG_DIR=/tmp/tour-smoke bun run src/cli.ts tour
# Expect: welcome + Step 1 printed

TOKENRIP_CONFIG_DIR=/tmp/tour-smoke bun run src/cli.ts tour next
# Expect: Step 2 printed

TOKENRIP_CONFIG_DIR=/tmp/tour-smoke bun run src/cli.ts tour next
# Expect: ERROR — "This step needs the asset id from the previous command"

TOKENRIP_CONFIG_DIR=/tmp/tour-smoke bun run src/cli.ts tour next fake-asset-id
# Expect: Step 3 printed (with no ID reference needed)

TOKENRIP_CONFIG_DIR=/tmp/tour-smoke bun run src/cli.ts tour next
# Expect: Step 4 printed, command includes "--asset fake-asset-id"

TOKENRIP_CONFIG_DIR=/tmp/tour-smoke bun run src/cli.ts tour --agent
# Expect: the AGENT_SCRIPT printed

TOKENRIP_CONFIG_DIR=/tmp/tour-smoke bun run src/cli.ts tour restart
# Expect: state wiped, Step 1 printed again
```

**Step 4: Commit**

```bash
git add packages/cli/src/commands/tour.ts packages/cli/src/cli.ts
git commit -m "feat(cli): implement rip tour, tour next, tour restart, tour --agent"
```

---

## Task 14: Integration test for the full CLI tour flow

**Files:**
- Create: `tests/integration/tour.test.ts`

**Step 1: Write the end-to-end integration test**

```typescript
import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { startBackend, stopBackend, type TestBackend } from '../setup/backend';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from '../setup/database';
import { createTestAgent, type TestAgent } from '../setup/agent';

const CLI = path.join(__dirname, '../../packages/cli/src/cli.ts');

let backend: TestBackend;
let agent: TestAgent;
const dbName = generateTestDbName();
let tmpCfg: string;

beforeAll(async () => {
  await createTestDatabase(dbName);
  backend = await startBackend(dbName);
  agent = await createTestAgent(backend.url);
  tmpCfg = fs.mkdtempSync(path.join(os.tmpdir(), 'tour-e2e-'));
});

afterAll(async () => {
  await stopBackend(backend);
  await dropTestDatabase(dbName);
  fs.rmSync(tmpCfg, { recursive: true, force: true });
});

async function rip(args: string[]): Promise<{ code: number; stdout: string; stderr: string }> {
  const proc = Bun.spawn({
    cmd: ['bun', 'run', CLI, ...args],
    env: {
      ...process.env,
      TOKENRIP_API_URL: backend.url,
      TOKENRIP_API_KEY: agent.apiKey,
      TOKENRIP_CONFIG_DIR: tmpCfg,
    },
    stdout: 'pipe',
    stderr: 'pipe',
  });
  const stdout = await new Response(proc.stdout).text();
  const stderr = await new Response(proc.stderr).text();
  await proc.exited;
  return { code: proc.exitCode ?? 0, stdout, stderr };
}

describe('rip tour end-to-end', () => {
  test('tour --agent prints the agent script', async () => {
    const { code, stdout } = await rip(['tour', '--agent']);
    expect(code).toBe(0);
    expect(stdout).toMatch(/You're giving your operator a tour/);
    expect(stdout).toMatch(/5 steps/);
  });

  test('full interactive flow from step 1 to end', async () => {
    // Wipe any previous state from the --agent test (it doesn't write state, but be safe)
    await rip(['tour', 'restart']);

    // Step 1
    let r = await rip(['tour']);
    expect(r.code).toBe(0);
    expect(r.stdout).toMatch(/Step 1 of 5/);
    expect(r.stdout).toMatch(/rip auth whoami/);

    // Step 2
    r = await rip(['tour', 'next']);
    expect(r.code).toBe(0);
    expect(r.stdout).toMatch(/Step 2 of 5/);

    // Step 3 without an asset id — should error
    r = await rip(['tour', 'next']);
    expect(r.code).not.toBe(0);
    expect(r.stderr).toMatch(/asset id/i);

    // Step 3 with a fake asset id
    r = await rip(['tour', 'next', 'fake-asset-uuid']);
    expect(r.code).toBe(0);
    expect(r.stdout).toMatch(/Step 3 of 5/);

    // Step 4
    r = await rip(['tour', 'next']);
    expect(r.code).toBe(0);
    expect(r.stdout).toMatch(/Step 4 of 5/);
    expect(r.stdout).toMatch(/fake-asset-uuid/); // interpolated into thread create cmd

    // Step 5 with a fake thread id
    r = await rip(['tour', 'next', 'fake-thread-uuid']);
    expect(r.code).toBe(0);
    expect(r.stdout).toMatch(/Step 5 of 5/);
    expect(r.stdout).toMatch(/fake-thread-uuid/);

    // End of tour
    r = await rip(['tour', 'next']);
    expect(r.code).toBe(0);
    expect(r.stdout).toMatch(/end of the tour/i);

    // State should be wiped — rip tour starts fresh
    r = await rip(['tour']);
    expect(r.stdout).toMatch(/Step 1 of 5/);
  });
});
```

**Step 2: Rebuild and run**

```bash
cd apps/backend && bun run build
cd ../../packages/cli && bun run build
cd ../../tests && bun test integration/tour.test.ts
```

Expected: PASS.

**Step 3: Commit**

```bash
git add tests/integration/tour.test.ts
git commit -m "test(cli): end-to-end tour flow integration test"
```

---

## Task 15: Homepage CTA block

**Files:**
- Modify: `apps/frontend/src/app/index.tsx` (in `CtaSection`, around line 282-320)

**Step 1: Add a tour callout**

Add a new `<p>` block or styled card above `<InstallBlock />` inside the `CtaSection`:

```tsx
<div className="mb-12 rounded-lg border border-foreground/10 bg-foreground/5 p-6">
  <p className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground/50">
    Try the tour
  </p>
  <p className="mt-3 font-serif text-foreground/70">
    After installing, ask your agent: <em>"show me around Tokenrip."</em>
    {' '}Or run it yourself:
  </p>
  <pre className="mt-3 font-mono text-xs text-foreground/60">
    rip tour
  </pre>
</div>
```

Placement: inside the `<div className="mx-auto max-w-2xl px-6 py-24">` wrapper in `CtaSection`, just before `<InstallBlock />`.

**Step 2: Smoke-check in the dev server**

```bash
cd apps/frontend && bun run dev
# open http://localhost:3333, scroll to the CTA section, confirm the block renders
```

Ask the user to click around and confirm visually (or use the claude-in-chrome tools if available) — this step is not automated.

**Step 3: Commit**

```bash
git add apps/frontend/src/app/index.tsx
git commit -m "feat(frontend): add tour CTA block to homepage"
```

---

## Task 16: Wire tour help into root CLI help text

**Files:**
- Modify: `packages/cli/src/cli.ts` (the root help / getting-started text)

There's a getting-started block around line 38-45 that enumerates `rip` usage. Add the tour to it.

**Step 1: Update the help text**

Find the block that currently reads something like:

```
  2. Publish an asset:
     $ rip asset publish report.md --type markdown

  3. Upload a file:
     ...
```

Add a new line-item at the end or near the top:

```
  Quick tour:
     $ rip tour
```

Match the surrounding formatting exactly.

**Step 2: Rebuild and check**

```bash
cd packages/cli && bun run build
bun run src/cli.ts --help | head -30
```

Expected: the tour hint appears in help output.

**Step 3: Commit**

```bash
git add packages/cli/src/cli.ts
git commit -m "docs(cli): mention `rip tour` in root help"
```

---

## Task 17: Changelog entry

**Files:**
- Modify: `tasks/changelog.md`

**Step 1: Prepend an entry at the top of the changelog**

```markdown
## 2026-04-17 — CLI tour

New `rip tour` command walks a first-time human through Tokenrip in 5 steps — identity, publish, operator-link, cross-agent thread, inbox — using inline commands they can copy-paste. `rip tour --agent` prints a one-shot prose script an agent can use to walk its operator through the same arc in its own voice. Backed by a new `@tokenrip` platform agent that atomically posts a welcome message when a tour thread is created.

**What changed:**
- Backend: seeded `@tokenrip` agent (alias `tokenrip.ai`); added `tour_welcome` metadata handler on `POST /v0/threads` that inserts a welcome message from `@tokenrip` inside the same transaction.
- CLI: new `rip tour` / `rip tour next [id]` / `rip tour restart` / `rip tour --agent` commands; state persisted at `~/.config/tokenrip/tour.json`.
- CLI: new `--content <string>` flag on `rip asset publish` for inline content; new `--tour-welcome`, `--asset`, `--title` flags on `rip thread create`.
- Frontend: tour CTA block on the homepage.
- Tests: new `tests/integration/tokenrip-agent.test.ts` and `tests/integration/tour.test.ts`; extended `tests/integration/publish.test.ts`.
```

**Step 2: Commit**

```bash
git add tasks/changelog.md
git commit -m "docs: changelog entry for CLI tour"
```

---

## Task 18: Move plan to implemented/

Per `tasks/CLAUDE.md`, after implementation move the design and plan docs out of `plans/`.

**Step 1: Move the files**

```bash
cd /Users/si/projects/maxi/tokenrip
mkdir -p tasks/plans/implemented
git mv tasks/plans/2026-04-17-cli-tour-design.md tasks/plans/implemented/
git mv tasks/plans/2026-04-17-cli-tour-implementation.md tasks/plans/implemented/
```

**Step 2: Commit**

```bash
git commit -m "chore: move cli-tour design + plan to implemented/"
```

---

## Task 19: Final verification

**Step 1: Run the full test suite**

```bash
cd /Users/si/projects/maxi/tokenrip/apps/backend && bun run build
cd /Users/si/projects/maxi/tokenrip/packages/cli && bun run build
cd /Users/si/projects/maxi/tokenrip && bun test
```

Expected: all tests PASS. No regressions.

**Step 2: Manual CLI smoke test against a running backend**

```bash
# terminal A
cd apps/backend && bun run start:dev

# terminal B — point CLI at local backend, use a fresh tour config dir
TOKENRIP_API_URL=http://localhost:3000 \
TOKENRIP_CONFIG_DIR=/tmp/tour-manual \
rm -rf /tmp/tour-manual

# register a test agent (uses the CLI's own register flow or a manual curl)
# then:
TOKENRIP_API_URL=http://localhost:3000 \
TOKENRIP_CONFIG_DIR=/tmp/tour-manual \
bun run packages/cli/src/cli.ts auth register
# Capture the api key, set:
TOKENRIP_API_KEY=<captured> \
TOKENRIP_API_URL=http://localhost:3000 \
TOKENRIP_CONFIG_DIR=/tmp/tour-manual \
bun run packages/cli/src/cli.ts tour
# Work through all 5 steps manually. Confirm @tokenrip's welcome appears in inbox at step 5.
```

**Step 3: Report back**

Summarize what was built, what tests pass, and any caveats. Ask for review before merging.

---

## Verification checklist (must all be true before declaring done)

- [ ] `bun test` passes with zero failures
- [ ] Manual tour walkthrough works end-to-end against a local backend
- [ ] `@tokenrip` appears in a fresh thread's participant list when invited by alias
- [ ] Tour thread shows a welcome message from `@tokenrip` immediately after creation
- [ ] Non-tour threads with `@tokenrip` as participant do NOT get a welcome (regression guard)
- [ ] `rip tour --agent` prints the script without writing state
- [ ] `rip tour restart` does NOT delete created assets/threads
- [ ] Homepage tour CTA renders cleanly at narrow and wide viewports
- [ ] No TypeScript errors in CLI or backend build
- [ ] No regressions in existing integration tests (`thread.test.ts`, `publish.test.ts`, etc.)

---

## Notes for the implementing engineer

- **Don't skip the failing-test step.** It's quick, and it catches the case where a test asserts something that's already true, giving false confidence.
- **Rebuild the backend before each integration test run** — tests import `dist/`, not source.
- **`TOKENRIP_CONFIG_DIR` is your friend.** Use it in every test to avoid polluting the real `~/.config/tokenrip/`.
- **The CLI uses Commander.js.** Option names with dashes (`--tour-welcome`) are camelCased on the `options` object (`options.tourWelcome`).
- **Transactions:** The existing `ThreadController.create` already has `@Transactional()`. Our welcome-message insert piggybacks on it — no new transaction boundary needed. If the welcome fails, the whole thread create rolls back.
- **@ convention for agents:** The CLI sends `"tokenrip"` (not `"@tokenrip"`) in the `participants` list. The backend's `resolveByIdOrAlias` appends `.ai` if missing and looks it up. Don't use the `@` prefix in the CLI payload — use it only in UI/narration.
