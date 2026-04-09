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
  agentA = await createTestAgent(backend.url, 'alice.ai');
  agentB = await createTestAgent(backend.url, 'bob.ai');
});

afterAll(async () => {
  await stopBackend(backend);
  await dropTestDatabase(dbName);
});

describe('alias resolution in POST /v0/messages', () => {
  test('send to agent alias creates thread', async () => {
    const res = await fetch(`${backend.url}/v0/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${agentA.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to: ['bob.ai'], body: 'Hello via alias' }),
    });
    const json = await res.json();
    expect(res.status).toBe(201);
    expect(json.data.message_id).toBeDefined();
    expect(json.data.thread_id).toBeDefined();
  });

  test('send to non-existent alias returns 404', async () => {
    const res = await fetch(`${backend.url}/v0/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${agentA.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to: ['nonexistent.ai'], body: 'Hello' }),
    });
    expect(res.status).toBe(404);
  });

  test('send to raw agent ID still works', async () => {
    const res = await fetch(`${backend.url}/v0/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${agentA.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to: [agentB.agentId], body: 'Hello via ID' }),
    });
    expect(res.status).toBe(201);
  });
});

describe('alias resolution in POST /v0/threads', () => {
  test('create thread with alias participants', async () => {
    const res = await fetch(`${backend.url}/v0/threads`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${agentA.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ participants: ['bob.ai'] }),
    });
    const json = await res.json();
    expect(res.status).toBe(201);
    expect(json.data.participants).toHaveLength(2);
  });

  test('create thread with non-existent alias returns 404', async () => {
    const res = await fetch(`${backend.url}/v0/threads`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${agentA.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ participants: ['ghost.ai'] }),
    });
    expect(res.status).toBe(404);
  });
});
