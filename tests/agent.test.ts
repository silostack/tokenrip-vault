import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { generateKeyPairSync } from 'crypto';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from './setup/database';
import { startBackend, stopBackend, TestBackend } from './setup/backend';
import { createTestAgent } from './setup/agent';

let dbName: string;
let backend: TestBackend;

beforeAll(async () => {
  dbName = generateTestDbName();
  await createTestDatabase(dbName);
  backend = await startBackend(dbName);
});

afterAll(async () => {
  await stopBackend(backend);
  await dropTestDatabase(dbName);
});

describe('agent registration', () => {
  test('registers with valid public key', async () => {
    const agent = await createTestAgent(backend.url);
    expect(agent.agentId).toMatch(/^trip1/);
    expect(agent.apiKey).toMatch(/^tr_/);
  });

  test('registers with alias', async () => {
    const agent = await createTestAgent(backend.url, 'test-agent');
    expect(agent.agentId).toMatch(/^trip1/);

    const res = await fetch(`${backend.url}/v0/agents/me`, {
      headers: { Authorization: `Bearer ${agent.apiKey}` },
    });
    const json = (await res.json()) as any;
    expect(json.data.alias).toBe('test-agent.ai');
  });

  test('rejects duplicate public key', async () => {
    const { publicKey } = generateKeyPairSync('ed25519');
    const hex = (publicKey.export({ type: 'spki', format: 'der' }) as Buffer).subarray(12).toString('hex');

    await fetch(`${backend.url}/v0/agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_key: hex }),
    });

    const res = await fetch(`${backend.url}/v0/agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_key: hex }),
    });
    expect(res.status).toBe(409);
  });

  test('rejects missing public_key', async () => {
    const res = await fetch(`${backend.url}/v0/agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });

  test('rejects invalid public_key format', async () => {
    const res = await fetch(`${backend.url}/v0/agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_key: 'not-hex' }),
    });
    expect(res.status).toBe(400);
  });

  test('api key from registration authenticates', async () => {
    const agent = await createTestAgent(backend.url);
    const res = await fetch(`${backend.url}/v0/agents/me`, {
      headers: { Authorization: `Bearer ${agent.apiKey}` },
    });
    expect(res.status).toBe(200);
    const json = (await res.json()) as any;
    expect(json.data.agent_id).toBe(agent.agentId);
  });
});

describe('agent alias', () => {
  test('auto-appends .ai to alias', async () => {
    const agent = await createTestAgent(backend.url, 'auto-suffix');
    const res = await fetch(`${backend.url}/v0/agents/me`, {
      headers: { Authorization: `Bearer ${agent.apiKey}` },
    });
    const json = (await res.json()) as any;
    expect(json.data.alias).toBe('auto-suffix.ai');
  });

  test('update alias via PATCH', async () => {
    const agent = await createTestAgent(backend.url);

    const res = await fetch(`${backend.url}/v0/agents/me`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${agent.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ alias: 'updated' }),
    });
    expect(res.status).toBe(200);
    const json = (await res.json()) as any;
    expect(json.data.alias).toBe('updated.ai');
  });

  test('rejects duplicate alias', async () => {
    await createTestAgent(backend.url, 'unique-alias');
    const agent2 = await createTestAgent(backend.url);

    const res = await fetch(`${backend.url}/v0/agents/me`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${agent2.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ alias: 'unique-alias' }),
    });
    expect(res.status).toBe(409);
  });
});

describe('key revocation', () => {
  test('revoke-key returns new key and invalidates old', async () => {
    const agent = await createTestAgent(backend.url);
    const oldKey = agent.apiKey;

    const revokeRes = await fetch(`${backend.url}/v0/agents/revoke-key`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${oldKey}` },
    });
    expect(revokeRes.status).toBe(201);
    const revokeJson = (await revokeRes.json()) as any;
    const newKey = revokeJson.data.api_key;
    expect(newKey).toMatch(/^tr_/);
    expect(newKey).not.toBe(oldKey);

    const oldRes = await fetch(`${backend.url}/v0/agents/me`, {
      headers: { Authorization: `Bearer ${oldKey}` },
    });
    expect(oldRes.status).toBe(401);

    const newRes = await fetch(`${backend.url}/v0/agents/me`, {
      headers: { Authorization: `Bearer ${newKey}` },
    });
    expect(newRes.status).toBe(200);
  });
});

describe('agent profile', () => {
  test('GET /agents/me returns agent info', async () => {
    const agent = await createTestAgent(backend.url, 'profile-test');

    const res = await fetch(`${backend.url}/v0/agents/me`, {
      headers: { Authorization: `Bearer ${agent.apiKey}` },
    });
    const json = (await res.json()) as any;
    expect(json.ok).toBe(true);
    expect(json.data.agent_id).toBe(agent.agentId);
    expect(json.data.alias).toBe('profile-test.ai');
    expect(json.data.registered_at).toBeDefined();
  });

  test('PATCH /agents/me updates metadata', async () => {
    const agent = await createTestAgent(backend.url);

    const res = await fetch(`${backend.url}/v0/agents/me`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${agent.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ metadata: { framework: 'langchain', version: '0.1' } }),
    });
    const json = (await res.json()) as any;
    expect(json.data.metadata.framework).toBe('langchain');
  });

  test('requires auth', async () => {
    const res = await fetch(`${backend.url}/v0/agents/me`);
    expect(res.status).toBe(401);
  });
});
