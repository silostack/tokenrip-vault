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
});
