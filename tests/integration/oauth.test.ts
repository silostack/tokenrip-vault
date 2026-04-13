import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { createHash, randomBytes } from 'crypto';
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

function generatePKCE() {
  const codeVerifier = randomBytes(32).toString('base64url');
  const codeChallenge = createHash('sha256').update(codeVerifier).digest('base64url');
  return { codeVerifier, codeChallenge };
}

describe('oauth', () => {
  describe('discovery', () => {
    test('GET /.well-known/oauth-authorization-server returns metadata', async () => {
      const res = await fetch(`${backend.url}/.well-known/oauth-authorization-server`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.token_endpoint).toContain('/oauth/token');
      expect(data.response_types_supported).toContain('code');
      expect(data.code_challenge_methods_supported).toContain('S256');
    });
  });

  describe('registration', () => {
    test('register creates agent + user + binding and returns auth code', async () => {
      const { codeVerifier, codeChallenge } = generatePKCE();

      const res = await fetch(`${backend.url}/oauth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: 'Test Operator',
          password: 'testpass123',
          agentAlias: 'test-oauth-agent',
          userAlias: 'test-oauth-user',
          codeChallenge,
          redirectUri: 'https://example.com/callback',
        }),
      });
      expect(res.status).toBe(201);
      const json = (await res.json()) as any;
      expect(json.ok).toBe(true);
      expect(json.code).toBeTruthy();
    });

    test('register without required fields returns 400', async () => {
      const res = await fetch(`${backend.url}/oauth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: 'Test' }),
      });
      expect(res.status).toBe(400);
    });

    test('duplicate agent alias returns 409', async () => {
      const { codeChallenge } = generatePKCE();

      // First registration
      await fetch(`${backend.url}/oauth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: 'First',
          password: 'pass123',
          agentAlias: 'unique-alias',
          codeChallenge,
          redirectUri: 'https://example.com/callback',
        }),
      });

      // Second with same alias
      const res = await fetch(`${backend.url}/oauth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: 'Second',
          password: 'pass456',
          agentAlias: 'unique-alias',
          codeChallenge,
          redirectUri: 'https://example.com/callback',
        }),
      });
      expect(res.status).toBe(409);
    });
  });

  describe('login', () => {
    test('login with valid credentials returns auth code', async () => {
      const { codeVerifier, codeChallenge } = generatePKCE();

      // Register first
      await fetch(`${backend.url}/oauth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: 'Login Test',
          password: 'loginpass',
          userAlias: 'login-test-user',
          codeChallenge,
          redirectUri: 'https://example.com/callback',
        }),
      });

      // Login
      const { codeChallenge: loginChallenge } = generatePKCE();
      const res = await fetch(`${backend.url}/oauth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alias: 'login-test-user',
          password: 'loginpass',
          codeChallenge: loginChallenge,
          redirectUri: 'https://example.com/callback',
        }),
      });
      expect(res.status).toBe(201);
      const json = (await res.json()) as any;
      expect(json.ok).toBe(true);
      expect(json.code).toBeTruthy();
    });

    test('login with wrong password returns 401', async () => {
      const { codeChallenge } = generatePKCE();

      await fetch(`${backend.url}/oauth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: 'WrongPass Test',
          password: 'correct',
          userAlias: 'wrongpass-test',
          codeChallenge,
          redirectUri: 'https://example.com/callback',
        }),
      });

      const { codeChallenge: loginChallenge } = generatePKCE();
      const res = await fetch(`${backend.url}/oauth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alias: 'wrongpass-test',
          password: 'incorrect',
          codeChallenge: loginChallenge,
          redirectUri: 'https://example.com/callback',
        }),
      });
      expect(res.status).toBe(401);
    });
  });

  describe('token exchange', () => {
    test('exchange auth code for API key with valid PKCE', async () => {
      const { codeVerifier, codeChallenge } = generatePKCE();
      const redirectUri = 'https://example.com/callback';

      // Register to get auth code
      const regRes = await fetch(`${backend.url}/oauth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: 'Token Test',
          password: 'tokenpass',
          codeChallenge,
          redirectUri,
        }),
      });
      const regJson = (await regRes.json()) as any;
      const code = regJson.code;

      // Exchange code for token
      const tokenRes = await fetch(`${backend.url}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code,
          code_verifier: codeVerifier,
          redirect_uri: redirectUri,
        }),
      });
      expect(tokenRes.status).toBe(201);
      const tokenJson = (await tokenRes.json()) as any;
      expect(tokenJson.access_token).toMatch(/^tr_/);
      expect(tokenJson.token_type).toBe('bearer');

      // Verify the token works against protected endpoints
      const whoamiRes = await fetch(`${backend.url}/v0/agents/me`, {
        headers: { Authorization: `Bearer ${tokenJson.access_token}` },
      });
      expect(whoamiRes.status).toBe(200);
    });

    test('exchange with wrong code_verifier returns 401', async () => {
      const { codeChallenge } = generatePKCE();
      const redirectUri = 'https://example.com/callback';

      const regRes = await fetch(`${backend.url}/oauth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: 'Bad PKCE Test',
          password: 'pass',
          codeChallenge,
          redirectUri,
        }),
      });
      const regJson = (await regRes.json()) as any;

      const tokenRes = await fetch(`${backend.url}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code: regJson.code,
          code_verifier: 'wrong_verifier',
          redirect_uri: redirectUri,
        }),
      });
      expect(tokenRes.status).toBe(401);
    });

    test('code cannot be reused', async () => {
      const { codeVerifier, codeChallenge } = generatePKCE();
      const redirectUri = 'https://example.com/callback';

      const regRes = await fetch(`${backend.url}/oauth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: 'Reuse Test',
          password: 'pass',
          codeChallenge,
          redirectUri,
        }),
      });
      const regJson = (await regRes.json()) as any;
      const code = regJson.code;

      // First exchange — should work
      const first = await fetch(`${backend.url}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code,
          code_verifier: codeVerifier,
          redirect_uri: redirectUri,
        }),
      });
      expect(first.status).toBe(201);

      // Second exchange — should fail
      const second = await fetch(`${backend.url}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code,
          code_verifier: codeVerifier,
          redirect_uri: redirectUri,
        }),
      });
      expect(second.status).toBe(401);
    });
  });

  describe('alias validation', () => {
    test('check-alias reports availability', async () => {
      const { codeChallenge } = generatePKCE();

      // Check before registration — should be available
      const beforeRes = await fetch(`${backend.url}/oauth/check-alias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentAlias: 'available-alias' }),
      });
      const beforeJson = (await beforeRes.json()) as any;
      expect(beforeJson.agentAliasAvailable).toBe(true);

      // Register with the alias
      await fetch(`${backend.url}/oauth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: 'Alias Check',
          password: 'pass',
          agentAlias: 'available-alias',
          codeChallenge,
          redirectUri: 'https://example.com/callback',
        }),
      });

      // Check after — should be taken
      const afterRes = await fetch(`${backend.url}/oauth/check-alias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentAlias: 'available-alias' }),
      });
      const afterJson = (await afterRes.json()) as any;
      expect(afterJson.agentAliasAvailable).toBe(false);
    });
  });
});
