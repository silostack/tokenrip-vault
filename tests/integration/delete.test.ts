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

async function createAsset(key: string): Promise<string> {
  const res = await fetch(`${backend.url}/v0/assets`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: 'text', content: 'deletable', title: 'To Delete' }),
  });
  const json = (await res.json()) as { ok: boolean; data: { id: string } };
  return json.data.id;
}

describe('delete endpoint', () => {
  test('deletes an asset and returns 204', async () => {
    const assetId = await createAsset(apiKey);

    const res = await fetch(`${backend.url}/v0/assets/${assetId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    expect(res.status).toBe(204);

    // Asset should no longer be accessible
    const metaRes = await fetch(`${backend.url}/v0/assets/${assetId}`);
    expect(metaRes.status).toBe(404);
  });

  test('returns 404 for non-existent asset', async () => {
    const res = await fetch(`${backend.url}/v0/assets/00000000-0000-0000-0000-000000000000`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    expect(res.status).toBe(404);
  });

  test('returns 403 when deleting another key\'s asset', async () => {
    const assetId = await createAsset(apiKey);
    const otherAgent = await createTestAgent(backend.url);
    const otherKey = otherAgent.apiKey;

    const res = await fetch(`${backend.url}/v0/assets/${assetId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${otherKey}` },
    });
    expect(res.status).toBe(403);

    // Asset should still exist
    const metaRes = await fetch(`${backend.url}/v0/assets/${assetId}`);
    expect(metaRes.status).toBe(200);
  });

  test('asset content is removed from storage after delete', async () => {
    const assetId = await createAsset(apiKey);

    // Verify content exists
    const contentBefore = await fetch(`${backend.url}/v0/assets/${assetId}/content`);
    expect(contentBefore.status).toBe(200);

    // Delete
    await fetch(`${backend.url}/v0/assets/${assetId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    // Content should be gone (asset not found → 404)
    const contentAfter = await fetch(`${backend.url}/v0/assets/${assetId}/content`);
    expect(contentAfter.status).toBe(404);
  });

  test('deleted asset disappears from status', async () => {
    const assetId = await createAsset(apiKey);

    // Verify it appears in status
    let statusRes = await fetch(`${backend.url}/v0/assets/status`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    let statusJson = (await statusRes.json()) as { data: Array<{ id: string }> };
    expect(statusJson.data.some((a) => a.id === assetId)).toBe(true);

    // Delete it
    await fetch(`${backend.url}/v0/assets/${assetId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    // Should no longer appear in status
    statusRes = await fetch(`${backend.url}/v0/assets/status`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    statusJson = (await statusRes.json()) as { data: Array<{ id: string }> };
    expect(statusJson.data.some((a) => a.id === assetId)).toBe(false);
  });

  test('requires authentication', async () => {
    const assetId = await createAsset(apiKey);
    const res = await fetch(`${backend.url}/v0/assets/${assetId}`, {
      method: 'DELETE',
    });
    expect(res.status).toBe(401);
  });

  test('CLI delete command outputs success JSON', async () => {
    const assetId = await createAsset(apiKey);

    process.env.TOKENRIP_API_URL = backend.url;
    process.env.TOKENRIP_API_KEY = apiKey;

    const consoleSpy = spyOn(console, 'log').mockImplementation(() => {});
    const { deleteAsset } = await import('../../packages/cli/src/commands/delete');
    await deleteAsset(assetId);

    const lastCall = consoleSpy.mock.calls[consoleSpy.mock.calls.length - 1];
    const output = JSON.parse(lastCall[0] as string);
    expect(output.ok).toBe(true);
    expect(output.data.id).toBe(assetId);
    consoleSpy.mockRestore();
  });
});
