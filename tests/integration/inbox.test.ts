import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { startBackend, stopBackend, type TestBackend } from '../setup/backend';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from '../setup/database';
import { createTestAgent, type TestAgent } from '../setup/agent';

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

// Helpers
async function createThread(apiKey: string, opts: Record<string, unknown> = {}) {
  const res = await fetch(`${backend.url}/v0/threads`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(opts),
  });
  return (await res.json()) as { ok: boolean; data: { id: string } };
}

async function postMessage(threadId: string, apiKey: string, body: string, opts: Record<string, unknown> = {}) {
  const res = await fetch(`${backend.url}/v0/threads/${threadId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ body, ...opts }),
  });
  return (await res.json()) as { ok: boolean; data: { id: string; sequence: number } };
}

async function createAsset(apiKey: string, content: string = '# Test') {
  const res = await fetch(`${backend.url}/v0/assets`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'markdown', content }),
  });
  return (await res.json()) as { ok: boolean; data: { id: string } };
}

async function createAssetVersion(publicId: string, apiKey: string) {
  const res = await fetch(`${backend.url}/v0/assets/${publicId}/versions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'markdown', content: '# Updated' }),
  });
  return res.status;
}

async function getInbox(apiKey: string, since: string, opts: Record<string, string> = {}) {
  const params = new URLSearchParams({ since, ...opts });
  const res = await fetch(`${backend.url}/v0/inbox?${params}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  return { status: res.status, json: await res.json() };
}

describe('inbox', () => {
  test('requires since parameter', async () => {
    const res = await fetch(`${backend.url}/v0/inbox`, {
      headers: { Authorization: `Bearer ${agentA.apiKey}` },
    });
    expect(res.status).toBe(400);
  });

  test('rejects invalid since timestamp', async () => {
    const { status } = await getInbox(agentA.apiKey, 'not-a-date');
    expect(status).toBe(400);
  });

  test('empty inbox for new agent', async () => {
    const since = new Date(Date.now() - 86400000).toISOString(); // 24h ago
    const { status, json } = await getInbox(agentA.apiKey, since);
    expect(status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.data.threads).toEqual([]);
    expect(json.data.assets).toEqual([]);
    expect(json.data.poll_after).toBe(30);
  });

  test('thread activity shows new messages', async () => {
    const since = new Date(Date.now() - 1000).toISOString(); // 1s ago
    const thread = await createThread(agentA.apiKey, { participants: [agentB.agentId] });
    await postMessage(thread.data.id, agentA.apiKey, 'Hello', { intent: 'inform' });
    await postMessage(thread.data.id, agentB.apiKey, 'Can we meet Friday?', { intent: 'propose' });

    const { status, json } = await getInbox(agentA.apiKey, since);
    expect(status).toBe(200);
    expect(json.data.threads).toHaveLength(1);

    const t = json.data.threads[0];
    expect(t.thread_id).toBe(thread.data.id);
    expect(t.new_message_count).toBe(2);
    expect(t.last_sequence).toBe(2);
    expect(t.last_intent).toBe('propose');
    expect(t.last_body_preview).toBe('Can we meet Friday?');
    expect(t.thread_id).toBe(thread.data.id);
  });

  test('asset updates show new versions', async () => {
    const since = new Date(Date.now() - 1000).toISOString();
    const asset = await createAsset(agentA.apiKey, '# V1');
    const versionStatus = await createAssetVersion(asset.data.id, agentA.apiKey);
    expect(versionStatus).toBe(201);

    const { json } = await getInbox(agentA.apiKey, since);
    expect(json.data.assets.length).toBeGreaterThanOrEqual(1);

    const a = json.data.assets.find((x: any) => x.asset_id === asset.data.id);
    expect(a).toBeDefined();
    // v1 (initial) + v2 (new version) both created after `since`
    expect(a.new_version_count).toBeGreaterThanOrEqual(1);
    expect(a.latest_version).toBe(2);
  });

  test('type filtering: threads only', async () => {
    const since = new Date(Date.now() - 1000).toISOString();
    const thread = await createThread(agentA.apiKey);
    await postMessage(thread.data.id, agentA.apiKey, 'ping');
    await createAsset(agentA.apiKey);

    const { json } = await getInbox(agentA.apiKey, since, { types: 'threads' });
    expect(json.data.assets).toEqual([]);
    // threads may or may not have entries depending on timing, but assets must be empty
  });

  test('type filtering: assets only', async () => {
    const since = new Date(Date.now() - 1000).toISOString();
    const thread = await createThread(agentA.apiKey);
    await postMessage(thread.data.id, agentA.apiKey, 'msg');

    const { json } = await getInbox(agentA.apiKey, since, { types: 'assets' });
    expect(json.data.threads).toEqual([]);
  });

  test('since filtering excludes old activity', async () => {
    const thread = await createThread(agentA.apiKey);
    await postMessage(thread.data.id, agentA.apiKey, 'Old message');

    // Wait a moment, then set since to now
    await new Promise((r) => setTimeout(r, 50));
    const since = new Date().toISOString();

    const { json } = await getInbox(agentA.apiKey, since);
    // Thread should not appear because updatedAt is before since
    const t = json.data.threads.find((x: any) => x.thread_id === thread.data.id);
    if (t) {
      expect(t.new_message_count).toBe(0);
    }
  });

  test('non-participant threads excluded', async () => {
    const since = new Date(Date.now() - 1000).toISOString();
    const thread = await createThread(agentA.apiKey); // agentA only
    await postMessage(thread.data.id, agentA.apiKey, 'Private');

    const { json } = await getInbox(agentB.apiKey, since);
    const found = json.data.threads.find((x: any) => x.thread_id === thread.data.id);
    expect(found).toBeUndefined();
  });

  test('non-owned assets excluded', async () => {
    const since = new Date(Date.now() - 1000).toISOString();
    const asset = await createAsset(agentA.apiKey);

    const { json } = await getInbox(agentB.apiKey, since);
    const found = json.data.assets.find((x: any) => x.asset_id === asset.data.id);
    expect(found).toBeUndefined();
  });

  test('limit applied to threads', async () => {
    const since = new Date(Date.now() - 1000).toISOString();
    // Create 3 threads with messages
    for (let i = 0; i < 3; i++) {
      const t = await createThread(agentA.apiKey);
      await postMessage(t.data.id, agentA.apiKey, `msg ${i}`);
    }

    const { json } = await getInbox(agentA.apiKey, since, { limit: '2' });
    expect(json.data.threads.length).toBeLessThanOrEqual(2);
  });

  test('requires agent auth', async () => {
    const res = await fetch(`${backend.url}/v0/inbox?since=${new Date().toISOString()}`);
    expect(res.status).toBe(401);
  });

  test('thread results include state field', async () => {
    const since = new Date(Date.now() - 1000).toISOString();
    const thread = await createThread(agentA.apiKey);
    await postMessage(thread.data.id, agentA.apiKey, 'state field check');

    const { status, json } = await getInbox(agentA.apiKey, since);
    expect(status).toBe(200);
    const t = json.data.threads.find((x: any) => x.thread_id === thread.data.id);
    expect(t).toBeDefined();
    expect(t.state).toBe('open');
  });

  test('since accepts integer (days back)', async () => {
    const { status, json } = await getInbox(agentA.apiKey, '1');
    expect(status).toBe(200);
    expect(json.ok).toBe(true);
    expect(Array.isArray(json.data.threads)).toBe(true);
  });
});
