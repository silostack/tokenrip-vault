import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { startBackend, stopBackend, type TestBackend } from '../setup/backend';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from '../setup/database';
import { generateKeypair } from '../../packages/cli/src/crypto';

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

async function registerAgent(alias?: string) {
  const { publicKeyHex } = generateKeypair();
  const body: Record<string, string> = { public_key: publicKeyHex };
  if (alias) body.alias = alias;
  const res = await fetch(`${backend.url}/v0/agents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json() as Promise<{
    ok: boolean;
    data: { agent_id: string; api_key: string; operator_registration_url: string };
  }>;
}

describe('operator flow', () => {
  test('agent registration returns operator_registration_url', async () => {
    const json = await registerAgent();
    expect(json.ok).toBe(true);
    expect(json.data.operator_registration_url).toBeDefined();
    expect(json.data.operator_registration_url).toContain('token=ot_');
  });

  test('register operator via operator token', async () => {
    const agentJson = await registerAgent();
    const url = new URL(agentJson.data.operator_registration_url);
    const operatorToken = url.searchParams.get('token')!;

    const res = await fetch(`${backend.url}/v0/operators/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        display_name: 'Test Operator',
        password: 'secure-password-123',
        alias: 'testop',
        operator_token: operatorToken,
      }),
    });
    const json = (await res.json()) as { ok: boolean; data: { user_id: string; auth_token: string } };
    expect(res.status).toBe(201);
    expect(json.ok).toBe(true);
    expect(json.data.user_id).toMatch(/^u_/);
    expect(json.data.auth_token).toMatch(/^ut_/);
  });

  test('operator token is one-time use', async () => {
    const agentJson = await registerAgent();
    const url = new URL(agentJson.data.operator_registration_url);
    const operatorToken = url.searchParams.get('token')!;

    const res1 = await fetch(`${backend.url}/v0/operators/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        display_name: 'Op1',
        password: 'pass1',
        operator_token: operatorToken,
      }),
    });
    expect(res1.status).toBe(201);

    const res2 = await fetch(`${backend.url}/v0/operators/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        display_name: 'Op2',
        password: 'pass2',
        operator_token: operatorToken,
      }),
    });
    expect(res2.status).toBe(401);
  });

  test('login with alias and password', async () => {
    const agentJson = await registerAgent();
    const url = new URL(agentJson.data.operator_registration_url);
    const operatorToken = url.searchParams.get('token')!;

    await fetch(`${backend.url}/v0/operators/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        display_name: 'Login Test',
        password: 'my-password',
        alias: 'logintest',
        operator_token: operatorToken,
      }),
    });

    const res = await fetch(`${backend.url}/v0/operators/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alias: 'logintest', password: 'my-password' }),
    });
    const json = (await res.json()) as { ok: boolean; data: { user_id: string; auth_token: string } };
    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.data.auth_token).toMatch(/^ut_/);
  });

  test('login with wrong password fails', async () => {
    const agentJson = await registerAgent();
    const url = new URL(agentJson.data.operator_registration_url);
    const operatorToken = url.searchParams.get('token')!;

    await fetch(`${backend.url}/v0/operators/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        display_name: 'Wrong Pass',
        password: 'correct-password',
        alias: 'wrongpass',
        operator_token: operatorToken,
      }),
    });

    const res = await fetch(`${backend.url}/v0/operators/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alias: 'wrongpass', password: 'wrong-password' }),
    });
    expect(res.status).toBe(401);
  });
});
