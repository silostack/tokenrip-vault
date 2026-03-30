import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { startBackend, stopBackend, type TestBackend } from '../setup/backend';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from '../setup/database';

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
  test('POST /v0/auth/keys creates a key with tr_ prefix', async () => {
    const res = await fetch(`${backend.url}/v0/auth/keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'test-key' }),
    });
    expect(res.status).toBe(201);
    const json = (await res.json()) as { ok: boolean; data: { apiKey: string } };
    expect(json.ok).toBe(true);
    expect(json.data.apiKey).toMatch(/^tr_/);
  });

  test('created key authenticates against protected endpoint', async () => {
    const createRes = await fetch(`${backend.url}/v0/auth/keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'auth-test' }),
    });
    const { data } = (await createRes.json()) as { data: { apiKey: string } };

    // Use the key to hit a protected endpoint (POST /v0/artifacts with no body should return 400, not 401)
    const res = await fetch(`${backend.url}/v0/artifacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${data.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    // 400 means auth passed but request was invalid — that's what we want
    expect(res.status).toBe(400);
  });

  test('POST /v0/auth/revoke revokes a key', async () => {
    const createRes = await fetch(`${backend.url}/v0/auth/keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'revoke-test' }),
    });
    const { data } = (await createRes.json()) as { data: { apiKey: string } };

    // Revoke
    const revokeRes = await fetch(`${backend.url}/v0/auth/revoke`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${data.apiKey}` },
    });
    expect(revokeRes.status).toBe(201);

    // Revoked key should now fail
    const afterRes = await fetch(`${backend.url}/v0/artifacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${data.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    expect(afterRes.status).toBe(401);
  });

  test('POST /v0/auth/keys without name returns 400', async () => {
    const res = await fetch(`${backend.url}/v0/auth/keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });

  test('request without auth header returns 401', async () => {
    const res = await fetch(`${backend.url}/v0/artifacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'markdown', content: 'test' }),
    });
    expect(res.status).toBe(401);
  });

  test('request with invalid key returns 401', async () => {
    const res = await fetch(`${backend.url}/v0/artifacts`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer tr_invalid_key_that_does_not_exist',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'markdown', content: 'test' }),
    });
    expect(res.status).toBe(401);
  });

  test('multiple independent keys work', async () => {
    const keys: string[] = [];
    for (let i = 0; i < 3; i++) {
      const res = await fetch(`${backend.url}/v0/auth/keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `multi-${i}` }),
      });
      const json = (await res.json()) as { data: { apiKey: string } };
      keys.push(json.data.apiKey);
    }

    // All keys are unique
    expect(new Set(keys).size).toBe(3);

    // All keys authenticate independently
    for (const key of keys) {
      const res = await fetch(`${backend.url}/v0/artifacts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      expect(res.status).toBe(400); // auth passed, bad request
    }
  });
});
