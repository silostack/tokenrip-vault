import { describe, test, expect, beforeAll, afterAll, spyOn } from 'bun:test';
import { startBackend, stopBackend, type TestBackend } from '../setup/backend';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from '../setup/database';
import { createTestAgent } from '../setup/agent';

let backend: TestBackend;
let apiKey: string;
const dbName = generateTestDbName();

beforeAll(async () => {
  await createTestDatabase(dbName);
  backend = await startBackend(dbName);
  const agent = await createTestAgent(backend.url);
  apiKey = agent.apiKey;
});

afterAll(async () => {
  await stopBackend(backend);
  await dropTestDatabase(dbName);
});

describe('status endpoint', () => {
  test('returns empty array with no assets', async () => {
    const res = await fetch(`${backend.url}/v0/assets/status`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean; data: unknown[] };
    expect(json.ok).toBe(true);
    expect(json.data).toEqual([]);
  });

  test('returns created assets', async () => {
    // Create two assets
    await fetch(`${backend.url}/v0/assets`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'markdown', content: '# First', title: 'First' }),
    });
    await fetch(`${backend.url}/v0/assets`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'text', content: 'Second', title: 'Second' }),
    });

    const res = await fetch(`${backend.url}/v0/assets/status`, {
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
    const res = await fetch(`${backend.url}/v0/assets/status`);
    expect(res.status).toBe(401);
  });

  test('?since= filters by updatedAt', async () => {
    // Record timestamp after existing assets
    await new Promise((r) => setTimeout(r, 50));
    const since = new Date().toISOString();
    await new Promise((r) => setTimeout(r, 50));

    // Create a new asset after the timestamp
    await fetch(`${backend.url}/v0/assets`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'markdown', content: '# After', title: 'After Timestamp' }),
    });

    const res = await fetch(`${backend.url}/v0/assets/status?since=${since}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const json = (await res.json()) as { ok: boolean; data: Record<string, unknown>[] };
    expect(json.ok).toBe(true);
    // Only the new asset should be returned
    expect(json.data.length).toBe(1);
    expect(json.data[0].title).toBe('After Timestamp');
  });

  test('only returns assets for the calling API key', async () => {
    // Create a second agent
    const otherAgent = await createTestAgent(backend.url);
    const otherKey = otherAgent.apiKey;

    // Status with the new key should be empty (no assets created with it)
    const res = await fetch(`${backend.url}/v0/assets/status`, {
      headers: { Authorization: `Bearer ${otherKey}` },
    });
    const json = (await res.json()) as { ok: boolean; data: unknown[] };
    expect(json.ok).toBe(true);
    expect(json.data).toEqual([]);
  });

  test('?type= filters by asset type', async () => {
    const res = await fetch(`${backend.url}/v0/assets/status?type=markdown`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const json = (await res.json()) as { ok: boolean; data: Record<string, unknown>[] };
    expect(json.ok).toBe(true);
    // Should only return markdown assets (First + After Timestamp), not the text asset
    expect(json.data.length).toBe(2);
    for (const asset of json.data) {
      expect(asset.type).toBe('markdown');
    }
  });

  test('?type= returns empty for unused type', async () => {
    const res = await fetch(`${backend.url}/v0/assets/status?type=chart`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const json = (await res.json()) as { ok: boolean; data: unknown[] };
    expect(json.ok).toBe(true);
    expect(json.data).toEqual([]);
  });

  test('?limit= restricts number of results', async () => {
    const res = await fetch(`${backend.url}/v0/assets/status?limit=1`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const json = (await res.json()) as { ok: boolean; data: Record<string, unknown>[] };
    expect(json.ok).toBe(true);
    expect(json.data.length).toBe(1);
  });

  test('?limit= and ?type= combine correctly', async () => {
    const res = await fetch(`${backend.url}/v0/assets/status?type=markdown&limit=1`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const json = (await res.json()) as { ok: boolean; data: Record<string, unknown>[] };
    expect(json.ok).toBe(true);
    expect(json.data.length).toBe(1);
    expect(json.data[0].type).toBe('markdown');
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
