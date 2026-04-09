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

async function createThread(apiKey: string, opts: Record<string, unknown> = {}) {
  const res = await fetch(`${backend.url}/v0/threads`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(opts),
  });
  return (await res.json()) as { ok: boolean; data: { id: string } };
}

async function postMessage(
  threadId: string,
  apiKey: string,
  body: string,
  opts: Record<string, unknown> = {},
) {
  const res = await fetch(`${backend.url}/v0/threads/${threadId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ body, ...opts }),
  });
  return { status: res.status, json: await res.json() };
}

describe('messages', () => {
  test('post message, sequence starts at 1', async () => {
    const thread = await createThread(agentA.apiKey);
    const { status, json } = await postMessage(thread.data.id, agentA.apiKey, 'Hello world');
    expect(status).toBe(201);
    expect(json.data.sequence).toBe(1);
    expect(json.data.body).toBe('Hello world');
  });

  test('multiple messages have sequential ordering', async () => {
    const thread = await createThread(agentA.apiKey, { participants: [agentB.agentId] });
    const m1 = await postMessage(thread.data.id, agentA.apiKey, 'First');
    const m2 = await postMessage(thread.data.id, agentB.apiKey, 'Second');
    const m3 = await postMessage(thread.data.id, agentA.apiKey, 'Third');
    expect(m1.json.data.sequence).toBe(1);
    expect(m2.json.data.sequence).toBe(2);
    expect(m3.json.data.sequence).toBe(3);
  });

  test('cursor pagination with since_sequence', async () => {
    const thread = await createThread(agentA.apiKey);
    for (let i = 0; i < 5; i++) {
      await postMessage(thread.data.id, agentA.apiKey, `Message ${i + 1}`);
    }

    const res = await fetch(
      `${backend.url}/v0/threads/${thread.data.id}/messages?since_sequence=2&limit=2`,
      { headers: { Authorization: `Bearer ${agentA.apiKey}` } },
    );
    const json = await res.json();
    expect(json.data).toHaveLength(2);
    expect(json.data[0].sequence).toBe(3);
    expect(json.data[1].sequence).toBe(4);
  });

  test('post message with intent and type', async () => {
    const thread = await createThread(agentA.apiKey);
    const { json } = await postMessage(thread.data.id, agentA.apiKey, 'Can we meet?', {
      intent: 'propose',
      type: 'meeting',
    });
    expect(json.data.intent).toBe('propose');
    expect(json.data.type).toBe('meeting');
  });

  test('non-participant cannot post message', async () => {
    const thread = await createThread(agentA.apiKey);
    const { status } = await postMessage(thread.data.id, agentB.apiKey, 'Intruder');
    expect(status).toBe(403);
  });
});

describe('top-level send', () => {
  test('POST /v0/messages creates thread + message', async () => {
    const assetRes = await fetch(`${backend.url}/v0/assets`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${agentA.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'markdown', content: '# Test' }),
    });
    const asset = await assetRes.json();

    const res = await fetch(`${backend.url}/v0/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${agentA.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: [asset.data.id],
        body: 'Check this out',
        intent: 'inform',
      }),
    });
    const json = await res.json();
    expect(res.status).toBe(201);
    expect(json.data.message_id).toBeDefined();
    expect(json.data.thread_id).toBeDefined();
  });
});

describe('asset convenience endpoints', () => {
  test('POST /v0/assets/:publicId/messages creates thread lazily', async () => {
    const assetRes = await fetch(`${backend.url}/v0/assets`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${agentA.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'markdown', content: '# Discuss' }),
    });
    const asset = await assetRes.json();
    const publicId = asset.data.id;

    const res1 = await fetch(`${backend.url}/v0/assets/${publicId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${agentA.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ body: 'First comment' }),
    });
    const json1 = await res1.json();
    expect(res1.status).toBe(201);
    const threadId = json1.data.thread_id;

    const res2 = await fetch(`${backend.url}/v0/assets/${publicId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${agentA.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ body: 'Second comment' }),
    });
    const json2 = await res2.json();
    expect(json2.data.thread_id).toBe(threadId);
  });

  test('GET /v0/assets/:publicId/messages reads comments', async () => {
    const assetRes = await fetch(`${backend.url}/v0/assets`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${agentA.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'markdown', content: '# Read' }),
    });
    const asset = await assetRes.json();
    const publicId = asset.data.id;

    await fetch(`${backend.url}/v0/assets/${publicId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${agentA.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ body: 'A comment' }),
    });

    const res = await fetch(`${backend.url}/v0/assets/${publicId}/messages`, {
      headers: { Authorization: `Bearer ${agentA.apiKey}` },
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.data).toHaveLength(1);
    expect(json.data[0].body).toBe('A comment');
  });
});
