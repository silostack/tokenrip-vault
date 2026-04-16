import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
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

async function createAsset(key: string, title = 'Test Asset'): Promise<string> {
  const res = await fetch(`${backend.url}/v0/assets`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: 'text', content: 'archivable', title }),
  });
  const json = (await res.json()) as { ok: boolean; data: { id: string } };
  return json.data.id;
}

async function archiveAsset(key: string, assetId: string): Promise<Response> {
  return fetch(`${backend.url}/v0/assets/${assetId}/archive`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}` },
  });
}

async function getStatus(key: string, params = ''): Promise<{ data: Array<{ id: string; state?: string }> }> {
  const res = await fetch(`${backend.url}/v0/assets/status${params ? '?' + params : ''}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  return res.json() as any;
}

describe('archive endpoint', () => {
  test('archives an asset and returns 204', async () => {
    const assetId = await createAsset(apiKey);
    const res = await archiveAsset(apiKey, assetId);
    expect(res.status).toBe(204);
  });

  test('archived asset still accessible by ID', async () => {
    const assetId = await createAsset(apiKey, 'Accessible After Archive');
    await archiveAsset(apiKey, assetId);

    const res = await fetch(`${backend.url}/v0/assets/${assetId}`);
    expect(res.status).toBe(200);
  });

  test('archived asset content still accessible', async () => {
    const assetId = await createAsset(apiKey, 'Content After Archive');
    await archiveAsset(apiKey, assetId);

    const res = await fetch(`${backend.url}/v0/assets/${assetId}/content`);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toBe('archivable');
  });

  test('requires authentication', async () => {
    const assetId = await createAsset(apiKey);
    const res = await fetch(`${backend.url}/v0/assets/${assetId}/archive`, {
      method: 'POST',
    });
    expect(res.status).toBe(401);
  });

  test('returns 403 when archiving another agent\'s asset', async () => {
    const assetId = await createAsset(apiKey);
    const otherAgent = await createTestAgent(backend.url);

    const res = await archiveAsset(otherAgent.apiKey, assetId);
    expect(res.status).toBe(403);
  });
});

describe('unarchive endpoint', () => {
  test('unarchives an archived asset and returns 204', async () => {
    const assetId = await createAsset(apiKey, 'To Unarchive');
    await archiveAsset(apiKey, assetId);

    const res = await fetch(`${backend.url}/v0/assets/${assetId}/unarchive`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    expect(res.status).toBe(204);
  });

  test('returns 400 when unarchiving a non-archived asset', async () => {
    const assetId = await createAsset(apiKey, 'Not Archived');

    const res = await fetch(`${backend.url}/v0/assets/${assetId}/unarchive`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    expect(res.status).toBe(400);
  });

  test('requires authentication', async () => {
    const assetId = await createAsset(apiKey);
    const res = await fetch(`${backend.url}/v0/assets/${assetId}/unarchive`, {
      method: 'POST',
    });
    expect(res.status).toBe(401);
  });
});

describe('archive filtering in asset listing', () => {
  let activeId: string;
  let archivedId: string;

  beforeAll(async () => {
    activeId = await createAsset(apiKey, 'Active Asset');
    archivedId = await createAsset(apiKey, 'Archived Asset');
    await archiveAsset(apiKey, archivedId);
  });

  test('default listing excludes archived assets', async () => {
    const json = await getStatus(apiKey);
    const ids = json.data.map((a) => a.id);
    expect(ids).toContain(activeId);
    expect(ids).not.toContain(archivedId);
  });

  test('?archived=true shows only archived assets', async () => {
    const json = await getStatus(apiKey, 'archived=true');
    const ids = json.data.map((a) => a.id);
    expect(ids).toContain(archivedId);
    expect(ids).not.toContain(activeId);
  });

  test('?include_archived=true shows both active and archived', async () => {
    const json = await getStatus(apiKey, 'include_archived=true');
    const ids = json.data.map((a) => a.id);
    expect(ids).toContain(activeId);
    expect(ids).toContain(archivedId);
  });

  test('unarchived asset reappears in default listing', async () => {
    const tempId = await createAsset(apiKey, 'Temp Archive');
    await archiveAsset(apiKey, tempId);

    // Verify hidden
    let json = await getStatus(apiKey);
    expect(json.data.map((a) => a.id)).not.toContain(tempId);

    // Unarchive
    await fetch(`${backend.url}/v0/assets/${tempId}/unarchive`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    // Verify visible again
    json = await getStatus(apiKey);
    expect(json.data.map((a) => a.id)).toContain(tempId);
  });
});

describe('archive filtering in search', () => {
  let searchActiveId: string;
  let searchArchivedId: string;

  beforeAll(async () => {
    searchActiveId = await createAsset(apiKey, 'Searchable Active');
    searchArchivedId = await createAsset(apiKey, 'Searchable Archived');
    await archiveAsset(apiKey, searchArchivedId);
  });

  test('default search excludes archived assets', async () => {
    const res = await fetch(`${backend.url}/v0/search?q=Searchable&type=asset`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const json = (await res.json()) as { data: { results: Array<{ id: string }> } };
    const ids = json.data.results.map((r) => r.id);
    expect(ids).toContain(searchActiveId);
    expect(ids).not.toContain(searchArchivedId);
  });

  test('search with archived=true shows only archived', async () => {
    const res = await fetch(`${backend.url}/v0/search?q=Searchable&type=asset&archived=true`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const json = (await res.json()) as { data: { results: Array<{ id: string }> } };
    const ids = json.data.results.map((r) => r.id);
    expect(ids).toContain(searchArchivedId);
    expect(ids).not.toContain(searchActiveId);
  });

  test('search with include_archived=true shows both', async () => {
    const res = await fetch(`${backend.url}/v0/search?q=Searchable&type=asset&include_archived=true`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const json = (await res.json()) as { data: { results: Array<{ id: string }> } };
    const ids = json.data.results.map((r) => r.id);
    expect(ids).toContain(searchActiveId);
    expect(ids).toContain(searchArchivedId);
  });
});
