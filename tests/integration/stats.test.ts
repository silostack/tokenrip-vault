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

async function publishContent(key: string, type: string, content: string, title: string): Promise<void> {
  await fetch(`${backend.url}/v0/assets`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type, content, title }),
  });
}

describe('stats endpoint', () => {
  test('returns zeros with no assets', async () => {
    const res = await fetch(`${backend.url}/v0/assets/stats`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean; data: any };
    expect(json.ok).toBe(true);
    expect(json.data.assetCount).toBe(0);
    expect(json.data.totalBytes).toBe(0);
    expect(json.data.countsByType).toEqual({});
    expect(json.data.bytesByType).toEqual({});
  });

  test('returns correct counts and bytes after creating assets', async () => {
    const mdContent = '# Hello';
    const textContent = 'Just some text here';
    await publishContent(apiKey, 'markdown', mdContent, 'Stats MD');
    await publishContent(apiKey, 'text', textContent, 'Stats Text');

    const res = await fetch(`${backend.url}/v0/assets/stats`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const json = (await res.json()) as { ok: boolean; data: any };
    expect(json.data.assetCount).toBe(2);
    expect(json.data.totalBytes).toBe(
      Buffer.byteLength(mdContent, 'utf-8') + Buffer.byteLength(textContent, 'utf-8'),
    );
    expect(json.data.countsByType.markdown).toBe(1);
    expect(json.data.countsByType.text).toBe(1);
    expect(json.data.bytesByType.markdown).toBe(Buffer.byteLength(mdContent, 'utf-8'));
    expect(json.data.bytesByType.text).toBe(Buffer.byteLength(textContent, 'utf-8'));
  });

  test('only counts assets for the calling API key', async () => {
    const otherAgent = await createTestAgent(backend.url);
    const otherKey = otherAgent.apiKey;
    const res = await fetch(`${backend.url}/v0/assets/stats`, {
      headers: { Authorization: `Bearer ${otherKey}` },
    });
    const json = (await res.json()) as { ok: boolean; data: any };
    expect(json.data.assetCount).toBe(0);
    expect(json.data.totalBytes).toBe(0);
  });

  test('requires authentication', async () => {
    const res = await fetch(`${backend.url}/v0/assets/stats`);
    expect(res.status).toBe(401);
  });

  test('CLI stats command outputs JSON', async () => {
    process.env.TOKENRIP_API_URL = backend.url;
    process.env.TOKENRIP_API_KEY = apiKey;

    const consoleSpy = spyOn(console, 'log').mockImplementation(() => {});
    const { stats } = await import('../../packages/cli/src/commands/stats');
    await stats();

    const lastCall = consoleSpy.mock.calls[consoleSpy.mock.calls.length - 1];
    const output = JSON.parse(lastCall[0] as string);
    expect(output.ok).toBe(true);
    expect(typeof output.data.assetCount).toBe('number');
    expect(typeof output.data.totalBytes).toBe('number');
    consoleSpy.mockRestore();
  });
});
