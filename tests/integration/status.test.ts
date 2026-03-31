import { describe, test, expect, beforeAll, afterAll, spyOn } from 'bun:test';
import { startBackend, stopBackend, type TestBackend } from '../setup/backend';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from '../setup/database';
import { createTestApiKey } from '../setup/api-key';

let backend: TestBackend;
let apiKey: string;
const dbName = generateTestDbName();

beforeAll(async () => {
  await createTestDatabase(dbName);
  backend = await startBackend(dbName);
  apiKey = await createTestApiKey(backend.url);
});

afterAll(async () => {
  await stopBackend(backend);
  await dropTestDatabase(dbName);
});

describe('status endpoint', () => {
  test('returns empty array with no artifacts', async () => {
    const res = await fetch(`${backend.url}/v0/artifacts/status`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean; data: unknown[] };
    expect(json.ok).toBe(true);
    expect(json.data).toEqual([]);
  });

  test('returns created artifacts', async () => {
    // Create two artifacts
    await fetch(`${backend.url}/v0/artifacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'markdown', content: '# First', title: 'First' }),
    });
    await fetch(`${backend.url}/v0/artifacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'text', content: 'Second', title: 'Second' }),
    });

    const res = await fetch(`${backend.url}/v0/artifacts/status`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const json = (await res.json()) as { ok: boolean; data: Record<string, unknown>[] };
    expect(json.ok).toBe(true);
    expect(json.data.length).toBeGreaterThanOrEqual(2);

    const first = json.data.find((a) => a.title === 'First');
    expect(first).toBeDefined();
    expect(first!.id).toBeDefined();
    expect(first!.type).toBe('markdown');
    expect(first!.createdAt).toBeDefined();
    expect(first!.updatedAt).toBeDefined();
  });

  test('requires authentication', async () => {
    const res = await fetch(`${backend.url}/v0/artifacts/status`);
    expect(res.status).toBe(401);
  });

  test('?since= filters by updatedAt', async () => {
    // Record timestamp after existing artifacts
    await new Promise((r) => setTimeout(r, 50));
    const since = new Date().toISOString();
    await new Promise((r) => setTimeout(r, 50));

    // Create a new artifact after the timestamp
    await fetch(`${backend.url}/v0/artifacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'markdown', content: '# After', title: 'After Timestamp' }),
    });

    const res = await fetch(`${backend.url}/v0/artifacts/status?since=${since}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const json = (await res.json()) as { ok: boolean; data: Record<string, unknown>[] };
    expect(json.ok).toBe(true);
    // Only the new artifact should be returned
    expect(json.data.length).toBe(1);
    expect(json.data[0].title).toBe('After Timestamp');
  });

  test('only returns artifacts for the calling API key', async () => {
    // Create a second API key
    const keyRes = await fetch(`${backend.url}/v0/auth/keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'other-key' }),
    });
    const keyJson = (await keyRes.json()) as { ok: boolean; data: { apiKey: string } };
    const otherKey = keyJson.data.apiKey;

    // Status with the new key should be empty (no artifacts created with it)
    const res = await fetch(`${backend.url}/v0/artifacts/status`, {
      headers: { Authorization: `Bearer ${otherKey}` },
    });
    const json = (await res.json()) as { ok: boolean; data: unknown[] };
    expect(json.ok).toBe(true);
    expect(json.data).toEqual([]);
  });

  test('CLI status command outputs JSON', async () => {
    process.env.TOKENRIP_API_URL = backend.url;
    process.env.TOKENRIP_API_KEY = apiKey;

    const consoleSpy = spyOn(console, 'log').mockImplementation(() => {});
    const { status } = await import('../../packages/cli/src/commands/status');
    await status({});

    const lastCall = consoleSpy.mock.calls[consoleSpy.mock.calls.length - 1];
    const output = JSON.parse(lastCall[0] as string);
    expect(output.ok).toBe(true);
    expect(Array.isArray(output.data)).toBe(true);
    consoleSpy.mockRestore();
  });
});
