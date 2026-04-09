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
  return { status: res.status, body: await res.json() };
}

describe('thread lifecycle', () => {
  test('create thread', async () => {
    const { status, body } = await createThread(agentA.apiKey);
    expect(status).toBe(201);
    expect(body.ok).toBe(true);
    expect(body.data.id).toBeDefined();
    expect(body.data.created_by).toBe(agentA.agentId);
  });

  test('create thread with initial participants', async () => {
    const { status, body } = await createThread(agentA.apiKey, {
      participants: [agentB.agentId],
    });
    expect(status).toBe(201);
    expect(body.data.participants).toHaveLength(2);
  });

  test('get thread metadata', async () => {
    const create = await createThread(agentA.apiKey);
    const threadId = create.body.data.id;

    const res = await fetch(`${backend.url}/v0/threads/${threadId}`, {
      headers: { Authorization: `Bearer ${agentA.apiKey}` },
    });
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.data.id).toBe(threadId);
  });

  test('non-participant cannot access thread', async () => {
    const create = await createThread(agentA.apiKey);
    const threadId = create.body.data.id;

    const res = await fetch(`${backend.url}/v0/threads/${threadId}`, {
      headers: { Authorization: `Bearer ${agentB.apiKey}` },
    });
    expect(res.status).toBe(403);
  });

  test('set resolution', async () => {
    const create = await createThread(agentA.apiKey);
    const threadId = create.body.data.id;

    const res = await fetch(`${backend.url}/v0/threads/${threadId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${agentA.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resolution: { status: 'accepted', note: 'done' } }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.resolution).toEqual({ status: 'accepted', note: 'done' });
  });

  test('reject double resolution', async () => {
    const create = await createThread(agentA.apiKey);
    const threadId = create.body.data.id;

    await fetch(`${backend.url}/v0/threads/${threadId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${agentA.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resolution: { status: 'accepted' } }),
    });

    const res = await fetch(`${backend.url}/v0/threads/${threadId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${agentA.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resolution: { status: 'rejected' } }),
    });
    expect(res.status).toBe(409);
  });

  test('add participant', async () => {
    const create = await createThread(agentA.apiKey);
    const threadId = create.body.data.id;

    const res = await fetch(`${backend.url}/v0/threads/${threadId}/participants`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${agentA.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ agent_id: agentB.agentId }),
    });
    expect(res.status).toBe(201);

    const getRes = await fetch(`${backend.url}/v0/threads/${threadId}`, {
      headers: { Authorization: `Bearer ${agentB.apiKey}` },
    });
    expect(getRes.status).toBe(200);
  });

  test('non-participant cannot add participants', async () => {
    const create = await createThread(agentA.apiKey);
    const threadId = create.body.data.id;

    const res = await fetch(`${backend.url}/v0/threads/${threadId}/participants`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${agentB.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ agent_id: agentB.agentId }),
    });
    expect(res.status).toBe(403);
  });
});
