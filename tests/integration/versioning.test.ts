import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { startBackend, stopBackend, type TestBackend } from '../setup/backend';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from '../setup/database';
import { createTestAgent } from '../setup/agent';

let backend: TestBackend;
let apiKey: string;
let otherApiKey: string;
const dbName = generateTestDbName();

beforeAll(async () => {
  await createTestDatabase(dbName);
  backend = await startBackend(dbName);
  const agent1 = await createTestAgent(backend.url);
  const agent2 = await createTestAgent(backend.url);
  apiKey = agent1.apiKey;
  otherApiKey = agent2.apiKey;
});

afterAll(async () => {
  await stopBackend(backend);
  await dropTestDatabase(dbName);
});

async function createAsset(content: string, title: string, key = apiKey) {
  const res = await fetch(`${backend.url}/v0/assets`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: 'markdown', content, title }),
  });
  const json = (await res.json()) as { ok: boolean; data: { id: string } };
  return json.data;
}

async function createVersion(assetId: string, content: string, opts: { label?: string; creatorContext?: string; key?: string } = {}) {
  const body: Record<string, string> = { type: 'markdown', content };
  if (opts.label) body.label = opts.label;
  if (opts.creatorContext) body.creatorContext = opts.creatorContext;
  return fetch(`${backend.url}/v0/assets/${assetId}/versions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${opts.key || apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

async function createFileVersion(assetId: string, filename: string, content: Buffer, opts: { label?: string; key?: string } = {}) {
  const formData = new FormData();
  formData.append('file', new Blob([content]), filename);
  if (opts.label) formData.append('label', opts.label);
  return fetch(`${backend.url}/v0/assets/${assetId}/versions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${opts.key || apiKey}` },
    body: formData,
  });
}

// ── Core versioning ────────────────────────────────────────────────

describe('asset versioning', () => {
  test('new asset has versionCount=1 and currentVersionId', async () => {
    const asset = await createAsset('# v1', 'versioned-test');
    const res = await fetch(`${backend.url}/v0/assets/${asset.id}`);
    const json = (await res.json()) as { data: { versionCount: number; currentVersionId: string } };
    expect(json.data.versionCount).toBe(1);
    expect(json.data.currentVersionId).toBeDefined();
  });

  test('publishing a new version increments versionCount', async () => {
    const asset = await createAsset('# v1', 'multi-version');
    const vRes = await createVersion(asset.id, '# v2', { label: 'second draft' });
    expect(vRes.status).toBe(201);
    const vJson = (await vRes.json()) as { data: { id: string; version: number; label: string } };
    expect(vJson.data.version).toBe(2);
    expect(vJson.data.label).toBe('second draft');

    const metaRes = await fetch(`${backend.url}/v0/assets/${asset.id}`);
    const meta = (await metaRes.json()) as { data: { versionCount: number; currentVersionId: string } };
    expect(meta.data.versionCount).toBe(2);
    expect(meta.data.currentVersionId).toBe(vJson.data.id);
  });

  test('list versions returns all versions in desc order', async () => {
    const asset = await createAsset('# v1', 'list-versions');
    await createVersion(asset.id, '# v2');
    await createVersion(asset.id, '# v3');

    const res = await fetch(`${backend.url}/v0/assets/${asset.id}/versions`);
    const json = (await res.json()) as { data: Array<{ version: number }> };
    expect(json.data.length).toBe(3);
    expect(json.data[0].version).toBe(3);
    expect(json.data[1].version).toBe(2);
    expect(json.data[2].version).toBe(1);
  });

  test('get specific version content returns correct content', async () => {
    const asset = await createAsset('# version one', 'content-check');
    const v2Res = await createVersion(asset.id, '# version two');
    const v2 = (await v2Res.json()) as { data: { id: string } };

    const contentRes = await fetch(`${backend.url}/v0/assets/${asset.id}/versions/${v2.data.id}/content`);
    const content = await contentRes.text();
    expect(content).toBe('# version two');
  });

  test('latest content matches the most recent version', async () => {
    const asset = await createAsset('# old', 'latest-check');
    await createVersion(asset.id, '# new');

    const contentRes = await fetch(`${backend.url}/v0/assets/${asset.id}/content`);
    const content = await contentRes.text();
    expect(content).toBe('# new');
  });

  test('version metadata endpoint works', async () => {
    const asset = await createAsset('# v1', 'version-meta');
    const v2Res = await createVersion(asset.id, '# v2', { label: 'labeled' });
    const v2 = (await v2Res.json()) as { data: { id: string } };

    const res = await fetch(`${backend.url}/v0/assets/${asset.id}/versions/${v2.data.id}`);
    const json = (await res.json()) as { data: { version: number; label: string; mimeType: string } };
    expect(json.data.version).toBe(2);
    expect(json.data.label).toBe('labeled');
    expect(json.data.mimeType).toBe('text/markdown');
  });

  test('status includes versionCount', async () => {
    const asset = await createAsset('# v1', 'status-version-count');
    await createVersion(asset.id, '# v2');

    const res = await fetch(`${backend.url}/v0/assets/status`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const json = (await res.json()) as { data: Array<{ title: string; versionCount: number }> };
    const found = json.data.find((a) => a.title === 'status-version-count');
    expect(found).toBeDefined();
    expect(found!.versionCount).toBe(2);
  });
});

// ── Version content preservation ───────────────────────────────────

describe('version content preservation', () => {
  test('v1 content remains accessible after adding newer versions', async () => {
    const asset = await createAsset('# original', 'content-preserved');
    const listBefore = await fetch(`${backend.url}/v0/assets/${asset.id}/versions`);
    const v1Id = ((await listBefore.json()) as { data: Array<{ id: string }> }).data[0].id;

    await createVersion(asset.id, '# updated');
    await createVersion(asset.id, '# latest');

    const v1Content = await fetch(`${backend.url}/v0/assets/${asset.id}/versions/${v1Id}/content`);
    expect(await v1Content.text()).toBe('# original');
  });

  test('each version serves correct Content-Type header', async () => {
    const asset = await createAsset('# markdown', 'mime-check');
    const listRes = await fetch(`${backend.url}/v0/assets/${asset.id}/versions`);
    const v1Id = ((await listRes.json()) as { data: Array<{ id: string }> }).data[0].id;

    const contentRes = await fetch(`${backend.url}/v0/assets/${asset.id}/versions/${v1Id}/content`);
    expect(contentRes.headers.get('content-type')).toContain('text/markdown');
  });

  test('version without label has null label', async () => {
    const asset = await createAsset('# v1', 'no-label');
    const v2Res = await createVersion(asset.id, '# v2');
    const v2 = (await v2Res.json()) as { data: { id: string } };

    const res = await fetch(`${backend.url}/v0/assets/${asset.id}/versions/${v2.data.id}`);
    const json = (await res.json()) as { data: { label: string | null } };
    expect(json.data.label).toBeNull();
  });

  test('each version tracks its own creatorContext', async () => {
    const asset = await createAsset('# v1', 'ctx-per-version');
    const v2Res = await createVersion(asset.id, '# v2', { creatorContext: 'agent-alpha' });
    const v2 = (await v2Res.json()) as { data: { id: string } };

    const v2Meta = await fetch(`${backend.url}/v0/assets/${asset.id}/versions/${v2.data.id}`);
    const json = (await v2Meta.json()) as { data: { creatorContext: string } };
    expect(json.data.creatorContext).toBe('agent-alpha');
  });
});

// ── File upload versioning ─────────────────────────────────────────

describe('file upload versioning', () => {
  test('can create a file upload version', async () => {
    // Create a file-based asset first
    const formData = new FormData();
    formData.append('file', new Blob([Buffer.from('PNG v1')]), 'image.png');
    formData.append('title', 'file-versioned');
    const createRes = await fetch(`${backend.url}/v0/assets`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: formData,
    });
    const asset = ((await createRes.json()) as { data: { id: string } }).data;

    // Upload a new version
    const v2Res = await createFileVersion(asset.id, 'image-v2.png', Buffer.from('PNG v2'), { label: 'higher res' });
    expect(v2Res.status).toBe(201);
    const v2 = (await v2Res.json()) as { data: { id: string; version: number; label: string } };
    expect(v2.data.version).toBe(2);
    expect(v2.data.label).toBe('higher res');

    // Latest content should be v2
    const contentRes = await fetch(`${backend.url}/v0/assets/${asset.id}/content`);
    const content = await contentRes.text();
    expect(content).toBe('PNG v2');
  });

  test('file upload version tracks sizeBytes', async () => {
    const formData = new FormData();
    formData.append('file', new Blob([Buffer.from('initial file content')]), 'doc.bin');
    formData.append('title', 'file-size-version');
    const createRes = await fetch(`${backend.url}/v0/assets`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: formData,
    });
    const asset = ((await createRes.json()) as { data: { id: string } }).data;

    const bigContent = Buffer.from('x'.repeat(5000));
    await createFileVersion(asset.id, 'big.bin', bigContent);

    const versions = await fetch(`${backend.url}/v0/assets/${asset.id}/versions`);
    const vList = (await versions.json()) as { data: Array<{ version: number; sizeBytes: number }> };
    const v2 = vList.data.find((v) => v.version === 2);
    expect(v2).toBeDefined();
    expect(v2!.sizeBytes).toBe(5000);
  });
});

// ── Version deletion ───────────────────────────────────────────────

describe('version deletion', () => {
  test('deleting a version updates latest pointer', async () => {
    const asset = await createAsset('# v1 content', 'delete-version');
    const v2Res = await createVersion(asset.id, '# v2 content');
    const v2 = (await v2Res.json()) as { data: { id: string } };

    const delRes = await fetch(`${backend.url}/v0/assets/${asset.id}/versions/${v2.data.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    expect(delRes.status).toBe(204);

    const contentRes = await fetch(`${backend.url}/v0/assets/${asset.id}/content`);
    expect(await contentRes.text()).toBe('# v1 content');

    const metaRes = await fetch(`${backend.url}/v0/assets/${asset.id}`);
    const meta = (await metaRes.json()) as { data: { versionCount: number } };
    expect(meta.data.versionCount).toBe(1);
  });

  test('cannot delete the last version', async () => {
    const asset = await createAsset('# only', 'last-version');
    const listRes = await fetch(`${backend.url}/v0/assets/${asset.id}/versions`);
    const v1Id = ((await listRes.json()) as { data: Array<{ id: string }> }).data[0].id;

    const delRes = await fetch(`${backend.url}/v0/assets/${asset.id}/versions/${v1Id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    expect(delRes.status).toBe(400);
    const body = (await delRes.json()) as { error: string };
    expect(body.error).toBe('LAST_VERSION');
  });

  test('deleting middle version preserves others', async () => {
    const asset = await createAsset('# first', 'delete-middle');
    const v2Res = await createVersion(asset.id, '# second');
    const v2 = (await v2Res.json()) as { data: { id: string } };
    await createVersion(asset.id, '# third');

    // Delete v2
    const delRes = await fetch(`${backend.url}/v0/assets/${asset.id}/versions/${v2.data.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    expect(delRes.status).toBe(204);

    // Should have v1 and v3 remaining
    const listRes = await fetch(`${backend.url}/v0/assets/${asset.id}/versions`);
    const versions = (await listRes.json()) as { data: Array<{ version: number }> };
    expect(versions.data.length).toBe(2);
    expect(versions.data.map((v) => v.version).sort()).toEqual([1, 3]);

    // Latest (v3) content should be unaffected
    const contentRes = await fetch(`${backend.url}/v0/assets/${asset.id}/content`);
    expect(await contentRes.text()).toBe('# third');

    const metaRes = await fetch(`${backend.url}/v0/assets/${asset.id}`);
    const meta = (await metaRes.json()) as { data: { versionCount: number } };
    expect(meta.data.versionCount).toBe(2);
  });

  test('deleting entire asset removes all versions', async () => {
    const asset = await createAsset('# v1', 'delete-all');
    await createVersion(asset.id, '# v2');

    const delRes = await fetch(`${backend.url}/v0/assets/${asset.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    expect(delRes.status).toBe(204);

    const metaRes = await fetch(`${backend.url}/v0/assets/${asset.id}`);
    expect(metaRes.status).toBe(410);

    const versionsAfter = await fetch(`${backend.url}/v0/assets/${asset.id}/versions`);
    expect(versionsAfter.status).toBe(410);
  });
});

// ── Auth & ownership ───────────────────────────────────────────────

describe('version auth and ownership', () => {
  test('cannot create version on another key\'s asset', async () => {
    const asset = await createAsset('# mine', 'auth-create');
    const res = await createVersion(asset.id, '# hijack', { key: otherApiKey });
    expect(res.status).toBe(403);
  });

  test('cannot delete version on another key\'s asset', async () => {
    const asset = await createAsset('# mine', 'auth-delete');
    const v2Res = await createVersion(asset.id, '# v2');
    const v2 = (await v2Res.json()) as { data: { id: string } };

    const delRes = await fetch(`${backend.url}/v0/assets/${asset.id}/versions/${v2.data.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${otherApiKey}` },
    });
    expect(delRes.status).toBe(403);
  });

  test('creating a version requires authentication', async () => {
    const asset = await createAsset('# mine', 'auth-required');
    const res = await fetch(`${backend.url}/v0/assets/${asset.id}/versions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'markdown', content: '# no auth' }),
    });
    expect(res.status).toBe(401);
  });

  test('deleting a version requires authentication', async () => {
    const asset = await createAsset('# mine', 'auth-delete-required');
    const listRes = await fetch(`${backend.url}/v0/assets/${asset.id}/versions`);
    const v1Id = ((await listRes.json()) as { data: Array<{ id: string }> }).data[0].id;

    const res = await fetch(`${backend.url}/v0/assets/${asset.id}/versions/${v1Id}`, {
      method: 'DELETE',
    });
    expect(res.status).toBe(401);
  });

  test('version list and content are publicly accessible', async () => {
    const asset = await createAsset('# public', 'public-versions');
    await createVersion(asset.id, '# v2');

    // No auth header — should work
    const listRes = await fetch(`${backend.url}/v0/assets/${asset.id}/versions`);
    expect(listRes.status).toBe(200);

    const versions = (await listRes.json()) as { data: Array<{ id: string }> };
    const contentRes = await fetch(`${backend.url}/v0/assets/${asset.id}/versions/${versions.data[0].id}/content`);
    expect(contentRes.status).toBe(200);
  });
});

// ── 404 handling ───────────────────────────────────────────────────

describe('version 404 handling', () => {
  const fakeUuid = '00000000-0000-0000-0000-000000000000';

  test('list versions for non-existent asset returns 404', async () => {
    const res = await fetch(`${backend.url}/v0/assets/${fakeUuid}/versions`);
    expect(res.status).toBe(404);
  });

  test('get version metadata for non-existent version returns 404', async () => {
    const asset = await createAsset('# x', '404-version-meta');
    const res = await fetch(`${backend.url}/v0/assets/${asset.id}/versions/${fakeUuid}`);
    expect(res.status).toBe(404);
  });

  test('get version content for non-existent version returns 404', async () => {
    const asset = await createAsset('# x', '404-version-content');
    const res = await fetch(`${backend.url}/v0/assets/${asset.id}/versions/${fakeUuid}/content`);
    expect(res.status).toBe(404);
  });

  test('create version for non-existent asset returns 404', async () => {
    const res = await createVersion(fakeUuid, '# orphan');
    expect(res.status).toBe(404);
  });

  test('delete version for non-existent version returns 404', async () => {
    const asset = await createAsset('# x', '404-delete-version');
    const res = await fetch(`${backend.url}/v0/assets/${asset.id}/versions/${fakeUuid}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    expect(res.status).toBe(404);
  });
});

// ── Stats with versions ────────────────────────────────────────────

describe('stats with versioning', () => {
  test('stats sums bytes across all versions', async () => {
    // Create a fresh key so stats are isolated
    const freshAgent = await createTestAgent(backend.url);
    const freshKey = freshAgent.apiKey;
    const content1 = 'a'.repeat(100);
    const content2 = 'b'.repeat(200);

    const createRes = await fetch(`${backend.url}/v0/assets`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${freshKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'text', content: content1, title: 'stats-asset' }),
    });
    const asset = ((await createRes.json()) as { data: { id: string } }).data;

    await fetch(`${backend.url}/v0/assets/${asset.id}/versions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${freshKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'text', content: content2 }),
    });

    const statsRes = await fetch(`${backend.url}/v0/assets/stats`, {
      headers: { Authorization: `Bearer ${freshKey}` },
    });
    const stats = (await statsRes.json()) as { data: { totalBytes: number; assetCount: number } };
    expect(stats.data.assetCount).toBe(1);
    // Both versions' bytes should be summed
    expect(stats.data.totalBytes).toBe(
      Buffer.byteLength(content1, 'utf-8') + Buffer.byteLength(content2, 'utf-8'),
    );
  });

  test('sizeBytes on each version is correct', async () => {
    const short = '# short';
    const long = '# ' + 'x'.repeat(1000);
    const asset = await createAsset(short, 'size-per-version');
    await createVersion(asset.id, long);

    const listRes = await fetch(`${backend.url}/v0/assets/${asset.id}/versions`);
    const versions = (await listRes.json()) as { data: Array<{ version: number; sizeBytes: number }> };

    const v1 = versions.data.find((v) => v.version === 1)!;
    const v2 = versions.data.find((v) => v.version === 2)!;
    expect(v1.sizeBytes).toBe(Buffer.byteLength(short, 'utf-8'));
    expect(v2.sizeBytes).toBe(Buffer.byteLength(long, 'utf-8'));
  });
});

// ── Invalid requests ───────────────────────────────────────────────

describe('version invalid requests', () => {
  test('creating version without content or file returns 400', async () => {
    const asset = await createAsset('# x', 'missing-body');
    const res = await fetch(`${backend.url}/v0/assets/${asset.id}/versions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });

  test('creating version with content but no type returns 400', async () => {
    const asset = await createAsset('# x', 'missing-type');
    const res = await fetch(`${backend.url}/v0/assets/${asset.id}/versions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: '# hello' }),
    });
    expect(res.status).toBe(400);
  });
});
