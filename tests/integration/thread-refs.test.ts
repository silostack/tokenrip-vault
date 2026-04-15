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

// --- helpers ---

async function createThread(apiKey: string, body: Record<string, unknown> = {}) {
  const res = await fetch(`${backend.url}/v0/threads`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return (await res.json()) as { ok: boolean; data: { id: string } };
}

async function addRefs(threadId: string, apiKey: string, refs: Record<string, unknown>[]) {
  const res = await fetch(`${backend.url}/v0/threads/${threadId}/refs`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refs }),
  });
  return { status: res.status, json: await res.json() };
}

async function getThread(threadId: string, apiKey: string) {
  const res = await fetch(`${backend.url}/v0/threads/${threadId}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  return { status: res.status, json: await res.json() };
}

async function deleteRef(threadId: string, refId: string, apiKey: string) {
  const res = await fetch(`${backend.url}/v0/threads/${threadId}/refs/${refId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  return { status: res.status, json: await res.json() };
}

// --- normalization tests ---

describe('ref normalization', () => {
  const FAKE_UUID = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

  test('tokenrip frontend URL normalizes to asset type + bare UUID', async () => {
    const thread = await createThread(agentA.apiKey);
    const frontendUrl = `${backend.url.replace(/:\d+$/, ':3333')}/a/${FAKE_UUID}`;
    // This will fail until the endpoint exists — expected
    const { status, json } = await addRefs(thread.data.id, agentA.apiKey, [
      { type: 'url', target_id: frontendUrl },
    ]);
    expect(status).toBe(201);
    expect(json.data[0].type).toBe('asset');
    expect(json.data[0].target_id).toBe(FAKE_UUID);
  });

  test('tokenrip API URL normalizes to asset type + bare UUID', async () => {
    const thread = await createThread(agentA.apiKey);
    const apiUrl = `${backend.url.replace(/:\d+$/, ':3434')}/v0/assets/${FAKE_UUID}`;
    const { status, json } = await addRefs(thread.data.id, agentA.apiKey, [
      { type: 'url', target_id: apiUrl },
    ]);
    expect(status).toBe(201);
    expect(json.data[0].type).toBe('asset');
    expect(json.data[0].target_id).toBe(FAKE_UUID);
  });

  test('strips query params from tokenrip URLs during normalization', async () => {
    const thread = await createThread(agentA.apiKey);
    const urlWithParams = `${backend.url.replace(/:\d+$/, ':3333')}/a/${FAKE_UUID}?version=2&foo=bar`;
    const { status, json } = await addRefs(thread.data.id, agentA.apiKey, [
      { type: 'url', target_id: urlWithParams },
    ]);
    expect(status).toBe(201);
    expect(json.data[0].type).toBe('asset');
    expect(json.data[0].target_id).toBe(FAKE_UUID);
  });

  test('bare UUID asset refs pass through unchanged', async () => {
    const thread = await createThread(agentA.apiKey);
    const { status, json } = await addRefs(thread.data.id, agentA.apiKey, [
      { type: 'asset', target_id: FAKE_UUID },
    ]);
    expect(status).toBe(201);
    expect(json.data[0].type).toBe('asset');
    expect(json.data[0].target_id).toBe(FAKE_UUID);
  });

  test('external URLs stay as url type', async () => {
    const thread = await createThread(agentA.apiKey);
    const externalUrl = 'https://example.com/some-page';
    const { status, json } = await addRefs(thread.data.id, agentA.apiKey, [
      { type: 'url', target_id: externalUrl },
    ]);
    expect(status).toBe(201);
    expect(json.data[0].type).toBe('url');
    expect(json.data[0].target_id).toBe(externalUrl);
  });
});

// --- endpoint tests (will fail until endpoints exist) ---

describe('thread refs CRUD', () => {
  test('add refs to a thread', async () => {
    const thread = await createThread(agentA.apiKey);
    const { status, json } = await addRefs(thread.data.id, agentA.apiKey, [
      { type: 'asset', target_id: 'aaaaaaaa-1111-2222-3333-444444444444' },
      { type: 'url', target_id: 'https://example.com/doc' },
    ]);
    expect(status).toBe(201);
    expect(json.data).toHaveLength(2);
  });

  test('refs appear in thread GET response', async () => {
    const thread = await createThread(agentA.apiKey);
    await addRefs(thread.data.id, agentA.apiKey, [
      { type: 'asset', target_id: 'bbbbbbbb-1111-2222-3333-444444444444' },
    ]);
    const { json } = await getThread(thread.data.id, agentA.apiKey);
    expect(json.data.refs).toBeDefined();
    expect(json.data.refs.length).toBeGreaterThanOrEqual(1);
  });

  test('delete a ref from a thread', async () => {
    const thread = await createThread(agentA.apiKey);
    const { json: addJson } = await addRefs(thread.data.id, agentA.apiKey, [
      { type: 'asset', target_id: 'cccccccc-1111-2222-3333-444444444444' },
    ]);
    const refId = addJson.data[0].id;
    const { status } = await deleteRef(thread.data.id, refId, agentA.apiKey);
    expect(status).toBe(200);

    // Verify ref is gone
    const { json: threadJson } = await getThread(thread.data.id, agentA.apiKey);
    const remaining = (threadJson.data.refs || []).filter(
      (r: { target_id: string }) => r.target_id === 'cccccccc-1111-2222-3333-444444444444',
    );
    expect(remaining).toHaveLength(0);
  });

  test('non-participant cannot add refs', async () => {
    const thread = await createThread(agentA.apiKey);
    const { status } = await addRefs(thread.data.id, agentB.apiKey, [
      { type: 'asset', target_id: 'dddddddd-1111-2222-3333-444444444444' },
    ]);
    expect(status).toBe(403);
  });
});

describe('create thread with refs', () => {
  test('refs provided at creation appear in thread detail', async () => {
    const res = await fetch(`${backend.url}/v0/threads`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${agentA.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refs: [
          { type: 'asset', target_id: 'aaaaaaaa-1111-2222-3333-444444444444' },
          { type: 'url', target_id: 'https://figma.com/board/xyz' },
        ],
      }),
    });
    const json = (await res.json()) as any;
    expect(json.ok).toBe(true);
    expect(json.data.refs).toHaveLength(2);
    expect(json.data.refs[0].type).toBe('asset');
    expect(json.data.refs[1].type).toBe('url');
  });
});

describe('thread ref aggregation', () => {
  test('aggregates refs from thread and messages', async () => {
    const thread = await createThread(agentA.apiKey);

    // Add thread-level ref
    await addRefs(thread.data.id, agentA.apiKey, [
      { type: 'asset', target_id: 'eeeeeeee-1111-2222-3333-444444444444' },
    ]);

    // Post a message with a ref (message-level ref)
    await fetch(`${backend.url}/v0/threads/${thread.data.id}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${agentA.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        body: 'Check this asset',
        refs: [{ type: 'asset', target_id: 'ffffffff-1111-2222-3333-444444444444' }],
      }),
    });

    const { json } = await getThread(thread.data.id, agentA.apiKey);
    expect(json.data.refs).toBeDefined();
    expect(json.data.refs.length).toBeGreaterThanOrEqual(2);
  });

  test('deduplicates refs across thread and messages', async () => {
    const thread = await createThread(agentA.apiKey);
    const sharedId = '11111111-2222-3333-4444-555555555555';

    // Same asset ref at thread level and in a message
    await addRefs(thread.data.id, agentA.apiKey, [
      { type: 'asset', target_id: sharedId },
    ]);

    await fetch(`${backend.url}/v0/threads/${thread.data.id}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${agentA.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        body: 'Same asset again',
        refs: [{ type: 'asset', target_id: sharedId }],
      }),
    });

    const { json } = await getThread(thread.data.id, agentA.apiKey);
    const matching = (json.data.refs || []).filter(
      (r: { target_id: string }) => r.target_id === sharedId,
    );
    expect(matching).toHaveLength(1);
  });
});
