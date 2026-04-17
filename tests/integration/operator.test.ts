import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { randomUUID } from 'node:crypto';
import { startBackend, stopBackend, type TestBackend } from '../setup/backend';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from '../setup/database';
import { generateKeypair, publicKeyToAgentId, signPayload } from '../../packages/cli/src/crypto';

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

interface AgentRegistration {
  agentId: string;
  apiKey: string;
  secretKeyHex: string;
}

async function registerAgent(alias?: string): Promise<AgentRegistration> {
  const { publicKeyHex, secretKeyHex } = generateKeypair();
  const body: Record<string, string> = { public_key: publicKeyHex };
  if (alias) body.alias = alias;
  const res = await fetch(`${backend.url}/v0/agents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as { ok: boolean; data: { agent_id: string; api_key: string } };
  return { agentId: json.data.agent_id, apiKey: json.data.api_key, secretKeyHex };
}

function createOperatorToken(agentId: string, secretKeyHex: string): string {
  const exp = Math.floor(Date.now() / 1000) + 300; // 5 minutes
  return signPayload(
    { sub: 'operator-auth', iss: agentId, exp, jti: randomUUID() },
    secretKeyHex,
  );
}

describe('operator flow', () => {
  test('register operator via signed token', async () => {
    const { agentId, secretKeyHex } = await registerAgent();
    const token = createOperatorToken(agentId, secretKeyHex);

    const res = await fetch(`${backend.url}/v0/auth/operator`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        display_name: 'Test Operator',
        password: 'secure-password-123',
        alias: 'testop',
      }),
    });
    const json = (await res.json()) as { ok: boolean; data: { user_id: string; auth_token: string; is_new_registration: boolean } };
    expect(res.status).toBe(201);
    expect(json.ok).toBe(true);
    expect(json.data.user_id).toMatch(/^u_/);
    expect(json.data.auth_token).toMatch(/^ut_/);
    expect(json.data.is_new_registration).toBe(true);
  });

  test('auto-login with existing binding', async () => {
    const { agentId, secretKeyHex } = await registerAgent();

    // First call: register
    const token1 = createOperatorToken(agentId, secretKeyHex);
    const res1 = await fetch(`${backend.url}/v0/auth/operator`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token1, display_name: 'Returning Op', password: 'pass' }),
    });
    expect(res1.status).toBe(201);

    // Second call: auto-login (no registration needed)
    const token2 = createOperatorToken(agentId, secretKeyHex);
    const res2 = await fetch(`${backend.url}/v0/auth/operator`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token2 }),
    });
    const json2 = (await res2.json()) as { ok: boolean; data: { is_new_registration: boolean; auth_token: string } };
    expect(res2.status).toBe(201);
    expect(json2.data.is_new_registration).toBe(false);
    expect(json2.data.auth_token).toMatch(/^ut_/);
  });

  test('login with alias and password', async () => {
    const { agentId, secretKeyHex } = await registerAgent();
    const token = createOperatorToken(agentId, secretKeyHex);

    await fetch(`${backend.url}/v0/auth/operator`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        display_name: 'Login Test',
        password: 'my-password',
        alias: 'logintest',
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
    const { agentId, secretKeyHex } = await registerAgent();
    const token = createOperatorToken(agentId, secretKeyHex);

    await fetch(`${backend.url}/v0/auth/operator`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        display_name: 'Wrong Pass',
        password: 'correct-password',
        alias: 'wrongpasstest',
      }),
    });

    const res = await fetch(`${backend.url}/v0/operators/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alias: 'wrongpasstest', password: 'wrong-password' }),
    });
    expect(res.status).toBe(401);
  });

  test('registration requires display_name when no binding exists', async () => {
    const { agentId, secretKeyHex } = await registerAgent();
    const token = createOperatorToken(agentId, secretKeyHex);

    const res = await fetch(`${backend.url}/v0/auth/operator`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }), // no display_name
    });
    expect(res.status).toBe(400);
  });

  test('invalid token is rejected', async () => {
    const res = await fetch(`${backend.url}/v0/auth/operator`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'invalid.token', display_name: 'Test' }),
    });
    expect(res.status).toBe(401);
  });
});

describe('POST /v0/auth/link-code/login', () => {
  test('returns session for already-bound agent', async () => {
    const { agentId, apiKey, secretKeyHex } = await registerAgent();
    const token = createOperatorToken(agentId, secretKeyHex);

    // First: register an operator + binding via signed-token flow (existing).
    const regRes = await fetch(`${backend.url}/v0/auth/operator`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        display_name: 'Login Tester',
        password: 'pw-loginwithcode',
        alias: 'login-tester',
      }),
    });
    expect(regRes.status).toBe(201);
    const { data: registered } = (await regRes.json()) as {
      data: { user_id: string; auth_token: string };
    };

    // Now mint a fresh short code from that agent.
    const codeRes = await fetch(`${backend.url}/v0/auth/link-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    });
    expect(codeRes.status).toBe(201);
    const { data: codeData } = (await codeRes.json()) as { data: { code: string } };

    // Exercise the new endpoint as an anonymous caller.
    const loginRes = await fetch(`${backend.url}/v0/auth/link-code/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: codeData.code }),
    });
    expect(loginRes.status).toBe(200);
    const body = (await loginRes.json()) as {
      ok: boolean;
      data: { user_id: string; auth_token: string; agent_id: string };
    };
    expect(body.ok).toBe(true);
    expect(body.data.user_id).toBe(registered.user_id);
    expect(body.data.agent_id).toBe(agentId);
    expect(body.data.auth_token).toBeTruthy();
    expect(body.data.auth_token).not.toBe(registered.auth_token); // fresh session
  });

  test('returns 409 NO_BINDING when agent has no operator binding', async () => {
    const { apiKey } = await registerAgent();
    const codeRes = await fetch(`${backend.url}/v0/auth/link-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    });
    const { data: codeData } = (await codeRes.json()) as { data: { code: string } };

    const loginRes = await fetch(`${backend.url}/v0/auth/link-code/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: codeData.code }),
    });
    expect(loginRes.status).toBe(409);
    const body = (await loginRes.json()) as { error: string };
    expect(body.error).toBe('NO_BINDING');

    // Code should NOT be consumed; a follow-up /register call must still succeed.
    const regRes = await fetch(`${backend.url}/v0/auth/link-code/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: codeData.code,
        displayName: 'Recovery User',
        password: 'pw1234567',
      }),
    });
    expect(regRes.status).toBe(200);
  });

  test('returns 401 INVALID_CODE for an unknown code', async () => {
    const res = await fetch(`${backend.url}/v0/auth/link-code/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: '000000' }),
    });
    expect(res.status).toBe(401);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe('INVALID_CODE');
  });

  test('returns 400 MISSING_FIELD when body omits code', async () => {
    const res = await fetch(`${backend.url}/v0/auth/link-code/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe('MISSING_FIELD');
  });
});

describe('POST /v0/auth/link-code rotation', () => {
  test('creating a new code invalidates the prior code', async () => {
    const { apiKey } = await registerAgent();
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    };

    const firstRes = await fetch(`${backend.url}/v0/auth/link-code`, {
      method: 'POST',
      headers: authHeaders,
    });
    expect(firstRes.status).toBe(201);
    const { data: first } = (await firstRes.json()) as { data: { code: string } };

    const secondRes = await fetch(`${backend.url}/v0/auth/link-code`, {
      method: 'POST',
      headers: authHeaders,
    });
    expect(secondRes.status).toBe(201);
    const { data: second } = (await secondRes.json()) as { data: { code: string } };
    expect(second.code).not.toBe(first.code);

    // Old code no longer verifies.
    const oldVerify = await fetch(`${backend.url}/v0/auth/link-code/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: first.code }),
    });
    expect(oldVerify.status).toBe(401);
    const oldBody = (await oldVerify.json()) as { error: string };
    expect(oldBody.error).toBe('INVALID_CODE');

    // New code still verifies.
    const newVerify = await fetch(`${backend.url}/v0/auth/link-code/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: second.code }),
    });
    expect(newVerify.status).toBe(200);
  });

  test('can create codes repeatedly without hitting a cap', async () => {
    const { apiKey } = await registerAgent();
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    };

    for (let i = 0; i < 5; i++) {
      const res = await fetch(`${backend.url}/v0/auth/link-code`, {
        method: 'POST',
        headers: authHeaders,
      });
      expect(res.status).toBe(201);
    }
  });
});
