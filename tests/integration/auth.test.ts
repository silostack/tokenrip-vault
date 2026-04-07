import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { startBackend, stopBackend, type TestBackend } from '../setup/backend';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from '../setup/database';
import { createTestAgent } from '../setup/agent';

let backend: TestBackend;
const dbName = generateTestDbName();

beforeAll(async () => {
  await createTestDatabase(dbName);
  backend = await startBackend(dbName);
});

afterAll(async () => {
  await stopBackend(backend);
  await dropTestDatabase(dbName);
});

describe('auth', () => {
  test('request without auth header returns 401', async () => {
    const res = await fetch(`${backend.url}/v0/assets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'markdown', content: 'test' }),
    });
    expect(res.status).toBe(401);
  });

  test('request with invalid key returns 401', async () => {
    const res = await fetch(`${backend.url}/v0/assets`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer tr_invalid_key_that_does_not_exist',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'markdown', content: 'test' }),
    });
    expect(res.status).toBe(401);
  });

  test('valid API key authenticates against protected endpoint', async () => {
    const agent = await createTestAgent(backend.url);

    // Use the key to hit a protected endpoint (POST /v0/assets with no body should return 400, not 401)
    const res = await fetch(`${backend.url}/v0/assets`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${agent.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    // 400 means auth passed but request was invalid
    expect(res.status).toBe(400);
  });

  test('revoked key returns 401', async () => {
    const agent = await createTestAgent(backend.url);

    // Revoke the key
    const revokeRes = await fetch(`${backend.url}/v0/agents/revoke-key`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${agent.apiKey}` },
    });
    expect(revokeRes.status).toBe(201);

    // Old key should now fail
    const afterRes = await fetch(`${backend.url}/v0/assets`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${agent.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    expect(afterRes.status).toBe(401);
  });

  test('multiple independent agents work', async () => {
    const agents = [];
    for (let i = 0; i < 3; i++) {
      agents.push(await createTestAgent(backend.url));
    }

    // All keys are unique
    const keys = agents.map((a) => a.apiKey);
    expect(new Set(keys).size).toBe(3);

    // All keys authenticate independently
    for (const agent of agents) {
      const res = await fetch(`${backend.url}/v0/assets`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${agent.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      expect(res.status).toBe(400); // auth passed, bad request
    }
  });
});
