import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { startBackend, stopBackend, type TestBackend } from '../setup/backend';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from '../setup/database';
import { createTestAgent, createCapToken, createThreadCapToken, type TestAgent } from '../setup/agent';

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

async function createAsset(apiKey: string, content = '# Test') {
  const res = await fetch(`${backend.url}/v0/assets`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'markdown', content }),
  });
  return (await res.json()) as { ok: boolean; data: { id: string } };
}

describe('signed capability tokens', () => {
  test('agent B can comment on asset via cap token', async () => {
    const asset = await createAsset(agentA.apiKey);
    const cap = createCapToken(agentA, asset.data.id);

    const res = await fetch(`${backend.url}/v0/assets/${asset.data.id}/messages?cap=${encodeURIComponent(cap)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: 'Great work!' }),
    });
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.data.body).toBe('Great work!');
  });

  test('agent B can create version via cap token with version:create perm', async () => {
    const asset = await createAsset(agentA.apiKey);
    const cap = createCapToken(agentA, asset.data.id, ['comment', 'version:create']);

    const res = await fetch(`${backend.url}/v0/assets/${asset.data.id}/versions?cap=${encodeURIComponent(cap)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'markdown', content: '# Updated by Agent B' }),
    });
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.data.version).toBe(2);
  });

  test('comment-only cap token cannot create version', async () => {
    const asset = await createAsset(agentA.apiKey);
    const cap = createCapToken(agentA, asset.data.id, ['comment']);

    const res = await fetch(`${backend.url}/v0/assets/${asset.data.id}/versions?cap=${encodeURIComponent(cap)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'markdown', content: '# Should fail' }),
    });
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe('INSUFFICIENT_PERMISSION');
  });

  test('expired cap token is rejected', async () => {
    const asset = await createAsset(agentA.apiKey);
    const cap = createCapToken(agentA, asset.data.id, ['comment'], {
      exp: Math.floor(Date.now() / 1000) - 60,
    });

    const res = await fetch(`${backend.url}/v0/assets/${asset.data.id}/messages?cap=${encodeURIComponent(cap)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: 'Should fail' }),
    });
    expect(res.status).toBe(401);
  });

  test('cap token for wrong asset is rejected', async () => {
    const asset1 = await createAsset(agentA.apiKey, '# Asset 1');
    const asset2 = await createAsset(agentA.apiKey, '# Asset 2');
    const cap = createCapToken(agentA, asset1.data.id);

    const res = await fetch(`${backend.url}/v0/assets/${asset2.data.id}/messages?cap=${encodeURIComponent(cap)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: 'Wrong asset' }),
    });
    expect(res.status).toBe(403);
  });

  test('tampered cap token is rejected', async () => {
    const asset = await createAsset(agentA.apiKey);
    const cap = createCapToken(agentA, asset.data.id);

    // Tamper: swap out the payload but keep the signature
    const [, sig] = cap.split('.');
    const fakePayload = Buffer.from(JSON.stringify({
      sub: `asset:${asset.data.id}`,
      iss: agentA.agentId,
      perm: ['comment', 'version:create', 'admin'],
    })).toString('base64url');
    const tampered = `${fakePayload}.${sig}`;

    const res = await fetch(`${backend.url}/v0/assets/${asset.data.id}/messages?cap=${encodeURIComponent(tampered)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: 'Tampered' }),
    });
    expect(res.status).toBe(401);
  });

  test('cap token via x-capability header works', async () => {
    const asset = await createAsset(agentA.apiKey);
    const cap = createCapToken(agentA, asset.data.id);

    const res = await fetch(`${backend.url}/v0/assets/${asset.data.id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-capability': cap },
      body: JSON.stringify({ body: 'Via header' }),
    });
    expect(res.status).toBe(201);
  });

  test('asset creation response no longer includes token field', async () => {
    const asset = await createAsset(agentA.apiKey);
    expect(asset.data).not.toHaveProperty('token');
    expect(asset.data.id).toBeDefined();
  });

  test('non-owner signed token is rejected', async () => {
    const asset = await createAsset(agentA.apiKey);
    const cap = createCapToken(agentB, asset.data.id);

    const res = await fetch(`${backend.url}/v0/assets/${asset.data.id}/messages?cap=${encodeURIComponent(cap)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: 'Fake cap' }),
    });
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe('INVALID_ISSUER');
  });
});

async function createThread(apiKey: string, opts: Record<string, unknown> = {}) {
  const res = await fetch(`${backend.url}/v0/threads`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(opts),
  });
  return (await res.json()) as { ok: boolean; data: { id: string } };
}

describe('thread-scoped capability tokens', () => {
  test('participant can access thread via thread-scoped cap token', async () => {
    const thread = await createThread(agentA.apiKey, { participants: [agentB.agentId] });
    const cap = createThreadCapToken(agentA, thread.data.id);

    const res = await fetch(`${backend.url}/v0/threads/${thread.data.id}?cap=${encodeURIComponent(cap)}`, {
      headers: {},
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.id).toBe(thread.data.id);
  });

  test('can read messages via thread-scoped cap token', async () => {
    const thread = await createThread(agentA.apiKey);
    // Post a message as the agent
    await fetch(`${backend.url}/v0/threads/${thread.data.id}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${agentA.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: 'Hello' }),
    });

    const cap = createThreadCapToken(agentA, thread.data.id);
    const res = await fetch(`${backend.url}/v0/threads/${thread.data.id}/messages?cap=${encodeURIComponent(cap)}`);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data).toHaveLength(1);
    expect(json.data[0].body).toBe('Hello');
  });

  test('non-participant cannot sign valid thread cap token', async () => {
    const thread = await createThread(agentA.apiKey);
    // Agent B is NOT a participant
    const cap = createThreadCapToken(agentB, thread.data.id);

    const res = await fetch(`${backend.url}/v0/threads/${thread.data.id}?cap=${encodeURIComponent(cap)}`);
    expect(res.status).toBe(403);
  });

  test('thread-scoped token for wrong thread is rejected', async () => {
    const thread1 = await createThread(agentA.apiKey);
    const thread2 = await createThread(agentA.apiKey);
    const cap = createThreadCapToken(agentA, thread1.data.id);

    const res = await fetch(`${backend.url}/v0/threads/${thread2.data.id}?cap=${encodeURIComponent(cap)}`);
    expect(res.status).toBe(403);
  });
});
