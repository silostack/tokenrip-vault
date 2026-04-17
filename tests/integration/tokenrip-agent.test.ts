import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { startBackend, stopBackend, type TestBackend } from '../setup/backend';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from '../setup/database';
import { createTestAgent, type TestAgent } from '../setup/agent';

const TOKENRIP_AGENT_ID = 'rip1kfu23m3vk3umxgu3wdhkltlvvasm2secm8t6jknvtna2fjgm3cwsje9umr';

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
});
