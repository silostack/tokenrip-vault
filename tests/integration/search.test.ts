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

async function createAsset(apiKey: string, content: string = '# Test', opts?: { title?: string; type?: string }) {
  const res = await fetch(`${backend.url}/v0/assets`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: opts?.type ?? 'markdown', content, title: opts?.title }),
  });
  return (await res.json()) as { ok: boolean; data: { id: string } };
}

async function search(apiKey: string, params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params);
  const res = await fetch(`${backend.url}/v0/search?${qs}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  return { status: res.status, json: (await res.json()) as any };
}

async function closeThread(threadId: string, apiKey: string) {
  const res = await fetch(`${backend.url}/v0/threads/${threadId}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ state: 'closed' }),
  });
  return { status: res.status, json: (await res.json()) as any };
}

describe('search', () => {
  test('returns empty results for new agent', async () => {
    const { status, json } = await search(agentA.apiKey);
    expect(status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.data.results).toEqual([]);
    expect(json.data.total).toBe(0);
  });

  test('finds threads by body text', async () => {
    const thread = await createThread(agentA.apiKey);
    await postMessage(thread.data.id, agentA.apiKey, 'The quantum flux capacitor is ready');

    const { status, json } = await search(agentA.apiKey, { q: 'quantum flux' });
    expect(status).toBe(200);
    expect(json.data.results.length).toBeGreaterThanOrEqual(1);
    const found = json.data.results.find((r: any) => r.id === thread.data.id);
    expect(found).toBeDefined();
    expect(found.type).toBe('thread');
  });

  test('finds assets by title', async () => {
    const asset = await createAsset(agentA.apiKey, '# Report', { title: 'Xenomorph Analysis Report' });
    expect(asset.ok).toBe(true);

    const { status, json } = await search(agentA.apiKey, { q: 'Xenomorph' });
    expect(status).toBe(200);
    expect(json.data.results.length).toBeGreaterThanOrEqual(1);
    const found = json.data.results.find((r: any) => r.id === asset.data.id);
    expect(found).toBeDefined();
    expect(found.type).toBe('asset');
  });

  test('q is case insensitive', async () => {
    const thread = await createThread(agentA.apiKey);
    await postMessage(thread.data.id, agentA.apiKey, 'ZYGOMORPHIC PATTERN DETECTED');

    const { status, json } = await search(agentA.apiKey, { q: 'zygomorphic pattern' });
    expect(status).toBe(200);
    const found = json.data.results.find((r: any) => r.id === thread.data.id);
    expect(found).toBeDefined();
  });

  test('type=thread excludes assets', async () => {
    // Create both a thread and asset
    const thread = await createThread(agentA.apiKey);
    await postMessage(thread.data.id, agentA.apiKey, 'threadonly-marker');
    await createAsset(agentA.apiKey, '# threadonly-marker', { title: 'threadonly-marker' });

    const { status, json } = await search(agentA.apiKey, { type: 'thread', q: 'threadonly-marker' });
    expect(status).toBe(200);
    const assetResults = json.data.results.filter((r: any) => r.type === 'asset');
    expect(assetResults).toEqual([]);
  });

  test('type=asset excludes threads', async () => {
    const thread = await createThread(agentA.apiKey);
    await postMessage(thread.data.id, agentA.apiKey, 'assetonly-marker');
    await createAsset(agentA.apiKey, '# assetonly-marker', { title: 'assetonly-marker' });

    const { status, json } = await search(agentA.apiKey, { type: 'asset', q: 'assetonly-marker' });
    expect(status).toBe(200);
    const threadResults = json.data.results.filter((r: any) => r.type === 'thread');
    expect(threadResults).toEqual([]);
  });

  test('state filter: open only', async () => {
    const thread = await createThread(agentA.apiKey);
    await postMessage(thread.data.id, agentA.apiKey, 'statefilter-open-test');

    // Close the thread
    const closeRes = await closeThread(thread.data.id, agentA.apiKey);
    expect(closeRes.status).toBe(200);

    const { status, json } = await search(agentA.apiKey, { state: 'open', q: 'statefilter-open-test' });
    expect(status).toBe(200);
    const found = json.data.results.find((r: any) => r.id === thread.data.id);
    expect(found).toBeUndefined();
  });

  test('state filter: closed only', async () => {
    const thread = await createThread(agentA.apiKey);
    await postMessage(thread.data.id, agentA.apiKey, 'statefilter-closed-test');

    const closeRes = await closeThread(thread.data.id, agentA.apiKey);
    expect(closeRes.status).toBe(200);

    const { status, json } = await search(agentA.apiKey, { state: 'closed', q: 'statefilter-closed-test' });
    expect(status).toBe(200);
    const found = json.data.results.find((r: any) => r.id === thread.data.id);
    expect(found).toBeDefined();
    expect(found.thread.state).toBe('closed');
  });

  test('intent filter', async () => {
    const thread1 = await createThread(agentA.apiKey);
    await postMessage(thread1.data.id, agentA.apiKey, 'intent-test-propose', { intent: 'propose' });

    const thread2 = await createThread(agentA.apiKey);
    await postMessage(thread2.data.id, agentA.apiKey, 'intent-test-inform', { intent: 'inform' });

    const { status, json } = await search(agentA.apiKey, { intent: 'propose' });
    expect(status).toBe(200);
    const ids = json.data.results.map((r: any) => r.id);
    expect(ids).toContain(thread1.data.id);
    expect(ids).not.toContain(thread2.data.id);
  });

  test('asset_type filter', async () => {
    const htmlAsset = await createAsset(agentA.apiKey, '<h1>Hello</h1>', { title: 'assettype-filter-html', type: 'html' });
    const mdAsset = await createAsset(agentA.apiKey, '# Hello', { title: 'assettype-filter-md', type: 'markdown' });

    const { status, json } = await search(agentA.apiKey, { asset_type: 'html', q: 'assettype-filter' });
    expect(status).toBe(200);
    const ids = json.data.results.map((r: any) => r.id);
    expect(ids).toContain(htmlAsset.data.id);
    expect(ids).not.toContain(mdAsset.data.id);
  });

  test('since accepts integer (days back)', async () => {
    const { status, json } = await search(agentA.apiKey, { since: '1' });
    expect(status).toBe(200);
    expect(json.ok).toBe(true);
    expect(Array.isArray(json.data.results)).toBe(true);
  });

  test('results sorted by updated_at desc', async () => {
    // Create two threads with a small time gap
    const thread1 = await createThread(agentA.apiKey);
    await postMessage(thread1.data.id, agentA.apiKey, 'sort-order-first');

    await new Promise((r) => setTimeout(r, 50));

    const thread2 = await createThread(agentA.apiKey);
    await postMessage(thread2.data.id, agentA.apiKey, 'sort-order-second');

    const { json } = await search(agentA.apiKey, { q: 'sort-order' });
    const results = json.data.results;
    expect(results.length).toBeGreaterThanOrEqual(2);

    // Verify descending order by updated_at
    for (let i = 0; i < results.length - 1; i++) {
      const a = new Date(results[i].updated_at).getTime();
      const b = new Date(results[i + 1].updated_at).getTime();
      expect(a).toBeGreaterThanOrEqual(b);
    }
  });

  test('non-participant threads excluded', async () => {
    const thread = await createThread(agentA.apiKey);
    await postMessage(thread.data.id, agentA.apiKey, 'private-exclusion-test');

    const { json } = await search(agentB.apiKey, { q: 'private-exclusion-test' });
    const found = json.data.results.find((r: any) => r.id === thread.data.id);
    expect(found).toBeUndefined();
  });

  test('requires auth', async () => {
    const res = await fetch(`${backend.url}/v0/search`);
    expect(res.status).toBe(401);
  });

  test('result shape: thread', async () => {
    const thread = await createThread(agentA.apiKey);
    await postMessage(thread.data.id, agentA.apiKey, 'shape-check-thread');

    const { json } = await search(agentA.apiKey, { q: 'shape-check-thread', type: 'thread' });
    expect(json.data.results.length).toBeGreaterThanOrEqual(1);
    const t = json.data.results.find((r: any) => r.id === thread.data.id);
    expect(t).toBeDefined();

    // Verify thread result shape
    expect(t.type).toBe('thread');
    expect(typeof t.id).toBe('string');
    expect('title' in t).toBe(true);
    expect('updated_at' in t).toBe(true);
    expect(t.thread).toBeDefined();
    expect(typeof t.thread.state).toBe('string');
    expect('last_intent' in t.thread).toBe(true);
    expect('participant_count' in t.thread).toBe(true);
  });

  test('result shape: asset', async () => {
    const asset = await createAsset(agentA.apiKey, '# Shape check', { title: 'shape-check-asset' });

    const { json } = await search(agentA.apiKey, { q: 'shape-check-asset', type: 'asset' });
    expect(json.data.results.length).toBeGreaterThanOrEqual(1);
    const a = json.data.results.find((r: any) => r.id === asset.data.id);
    expect(a).toBeDefined();

    // Verify asset result shape
    expect(a.type).toBe('asset');
    expect(typeof a.id).toBe('string');
    expect('title' in a).toBe(true);
    expect('updated_at' in a).toBe(true);
    expect(a.asset).toBeDefined();
    expect(typeof a.asset.asset_type).toBe('string');
    expect(typeof a.asset.version_count).toBe('number');
  });
});
