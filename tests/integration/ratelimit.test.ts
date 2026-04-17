import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { startBackend, stopBackend, type TestBackend } from '../setup/backend';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from '../setup/database';
import { generateKeypair } from '../../packages/cli/src/crypto';

// Tune limits low so we can exercise every layer without firing thousands
// of requests. Must be set BEFORE startBackend() so the module picks them up.
const COARSE_IP_LIMIT = 40;
const PER_IDENTITY_LIMIT = 15;

process.env.RATE_LIMIT_COARSE_IP_PER_MIN = String(COARSE_IP_LIMIT);
process.env.RATE_LIMIT_PER_IDENTITY_PER_MIN = String(PER_IDENTITY_LIMIT);
process.env.RATE_LIMIT_CODE_PER_10MIN = '5';
process.env.RATE_LIMIT_ALIAS_PER_HOUR = '10';
process.env.RATE_LIMIT_CLIENT_PER_MIN = '30';
// Trust one hop so we can fake client IPs with X-Forwarded-For.
process.env.TRUST_PROXY_HOPS = '1';

let backend: TestBackend;
const dbName = generateTestDbName();

beforeAll(async () => {
  await createTestDatabase(dbName);
  backend = await startBackend(dbName, { rateLimiting: true });
});

afterAll(async () => {
  await stopBackend(backend);
  await dropTestDatabase(dbName);
});

async function registerAgent(): Promise<{ agentId: string; apiKey: string }> {
  const { publicKeyHex } = generateKeypair();
  const res = await fetch(`${backend.url}/v0/agents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '10.99.0.1' },
    body: JSON.stringify({ public_key: publicKeyHex }),
  });
  const json = (await res.json()) as { data: { agent_id: string; api_key: string } };
  return { agentId: json.data.agent_id, apiKey: json.data.api_key };
}

describe('rate limiting — Layer 3 (target-keyed, NAT-safe)', () => {
  test('link-code verify: 6th attempt at same code returns 429', async () => {
    const code = '111111';
    const results: number[] = [];
    for (let i = 0; i < 6; i++) {
      const res = await fetch(`${backend.url}/v0/auth/link-code/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // A different IP each attempt — limit is keyed by code, not IP.
          'X-Forwarded-For': `10.${i}.0.1`,
        },
        body: JSON.stringify({ code }),
      });
      results.push(res.status);
    }
    // First 5: 401 (INVALID_CODE — unused). 6th: 429 (throttled by code).
    expect(results.slice(0, 5).every((s) => s === 401)).toBe(true);
    expect(results[5]).toBe(429);
  });

  test('a different code on the same IP is not blocked', async () => {
    const ip = '10.200.0.1';
    // Burn the bucket for code A.
    for (let i = 0; i < 5; i++) {
      await fetch(`${backend.url}/v0/auth/link-code/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': ip },
        body: JSON.stringify({ code: '222222' }),
      });
    }
    const blocked = await fetch(`${backend.url}/v0/auth/link-code/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': ip },
      body: JSON.stringify({ code: '222222' }),
    });
    expect(blocked.status).toBe(429);

    // Same source IP but a different code: passes (not 429).
    const passes = await fetch(`${backend.url}/v0/auth/link-code/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': ip },
      body: JSON.stringify({ code: '333333' }),
    });
    expect(passes.status).toBe(401); // INVALID_CODE, but not throttled
  });

  test('operator login: 11th attempt for same alias returns 429', async () => {
    const alias = 'bruteforcetarget';
    const results: number[] = [];
    for (let i = 0; i < 11; i++) {
      const res = await fetch(`${backend.url}/v0/operators/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-For': `10.50.${i}.1`,
        },
        body: JSON.stringify({ alias, password: 'wrong-password' }),
      });
      results.push(res.status);
    }
    // First 10: 401 (INVALID_CREDENTIALS). 11th: 429.
    expect(results.slice(0, 10).every((s) => s === 401)).toBe(true);
    expect(results[10]).toBe(429);
  });
});

describe('rate limiting — Layer 1 (coarse per-IP)', () => {
  test(`${COARSE_IP_LIMIT + 1}th GET /v0/health from the same IP returns 429`, async () => {
    const ip = '10.123.0.1';
    // Fire exactly COARSE_IP_LIMIT requests in parallel; all should succeed.
    const first = await Promise.all(
      Array.from({ length: COARSE_IP_LIMIT }, () =>
        fetch(`${backend.url}/v0/health`, {
          headers: { 'X-Forwarded-For': ip },
        }).then((r) => r.status),
      ),
    );
    expect(first.every((s) => s === 200)).toBe(true);

    // The next one is over the limit.
    const extra = await fetch(`${backend.url}/v0/health`, {
      headers: { 'X-Forwarded-For': ip },
    });
    expect(extra.status).toBe(429);

    // A fresh IP is unaffected.
    const freshIp = await fetch(`${backend.url}/v0/health`, {
      headers: { 'X-Forwarded-For': '10.124.0.1' },
    });
    expect(freshIp.status).toBe(200);
  });
});

describe('rate limiting — Layer 2 (per-identity)', () => {
  test(`${PER_IDENTITY_LIMIT + 1}th authenticated request from one agent returns 429`, async () => {
    const { apiKey } = await registerAgent();
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'X-Forwarded-For': '10.77.0.1',
    };

    // Spread across different IPs to prove the bucket is identity-keyed,
    // not IP-keyed. All should count toward the same agent bucket.
    const results: number[] = [];
    for (let i = 0; i < PER_IDENTITY_LIMIT; i++) {
      const res = await fetch(`${backend.url}/v0/agents/me`, {
        headers: { ...headers, 'X-Forwarded-For': `10.77.${i}.1` },
      });
      results.push(res.status);
    }
    expect(results.every((s) => s === 200)).toBe(true);

    const extra = await fetch(`${backend.url}/v0/agents/me`, {
      headers: { ...headers, 'X-Forwarded-For': '10.77.99.1' },
    });
    expect(extra.status).toBe(429);

    // A different agent is unaffected (same IP as the throttled agent).
    const { apiKey: otherKey } = await registerAgent();
    const otherRes = await fetch(`${backend.url}/v0/agents/me`, {
      headers: {
        Authorization: `Bearer ${otherKey}`,
        'X-Forwarded-For': '10.77.99.1',
      },
    });
    expect(otherRes.status).toBe(200);
  });
});

describe('rate limiting — 429 response shape', () => {
  test('429 body matches the ok/error/message convention', async () => {
    const code = '444444';
    // Burn the bucket.
    for (let i = 0; i < 5; i++) {
      await fetch(`${backend.url}/v0/auth/link-code/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '10.201.0.1' },
        body: JSON.stringify({ code }),
      });
    }
    const res = await fetch(`${backend.url}/v0/auth/link-code/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '10.201.0.1' },
      body: JSON.stringify({ code }),
    });
    expect(res.status).toBe(429);
    const body = (await res.json()) as { ok: boolean; error: string; message: string };
    expect(body.ok).toBe(false);
    expect(body.error).toBe('RATE_LIMITED');
    expect(body.message).toBeTruthy();
  });
});
