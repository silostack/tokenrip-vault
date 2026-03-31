import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { startBackend, stopBackend, type TestBackend } from '../setup/backend';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from '../setup/database';
import { createTestApiKey } from '../setup/api-key';
import { v4 } from 'uuid';

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

describe('provenance fields', () => {
  test('publish with provenance fields stores them', async () => {
    const parentId = v4();
    const res = await fetch(`${backend.url}/v0/artifacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'markdown',
        content: '# With provenance',
        title: 'Provenance Test',
        parentArtifactId: parentId,
        creatorContext: 'Claude analysis task',
        inputReferences: ['https://example.com/doc1', 'https://example.com/doc2'],
      }),
    });
    const createJson = (await res.json()) as { ok: boolean; data: { id: string } };
    expect(createJson.ok).toBe(true);

    // Fetch metadata and verify provenance fields
    const metaRes = await fetch(`${backend.url}/v0/artifacts/${createJson.data.id}`);
    const metaJson = (await metaRes.json()) as { ok: boolean; data: Record<string, unknown> };
    expect(metaJson.ok).toBe(true);
    expect(metaJson.data.parentArtifactId).toBe(parentId);
    expect(metaJson.data.creatorContext).toBe('Claude analysis task');
    expect(metaJson.data.inputReferences).toEqual([
      'https://example.com/doc1',
      'https://example.com/doc2',
    ]);
  });

  test('upload with provenance fields stores them', async () => {
    const parentId = v4();
    const form = new FormData();
    const pngBytes = await Bun.file('tests/fixtures/sample.png').arrayBuffer();
    form.append('file', new Blob([pngBytes], { type: 'image/png' }), 'sample.png');
    form.append('type', 'file');
    form.append('title', 'Upload Provenance');
    form.append('parentArtifactId', parentId);
    form.append('creatorContext', 'Agent file generation');
    form.append('inputReferences', JSON.stringify(['ref1', 'ref2']));

    const res = await fetch(`${backend.url}/v0/artifacts`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });
    const createJson = (await res.json()) as { ok: boolean; data: { id: string } };
    expect(createJson.ok).toBe(true);

    const metaRes = await fetch(`${backend.url}/v0/artifacts/${createJson.data.id}`);
    const metaJson = (await metaRes.json()) as { ok: boolean; data: Record<string, unknown> };
    expect(metaJson.data.parentArtifactId).toBe(parentId);
    expect(metaJson.data.creatorContext).toBe('Agent file generation');
  });

  test('provenance fields are optional', async () => {
    const res = await fetch(`${backend.url}/v0/artifacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'markdown',
        content: '# No provenance',
        title: 'No Provenance',
      }),
    });
    const createJson = (await res.json()) as { ok: boolean; data: { id: string } };
    expect(createJson.ok).toBe(true);

    const metaRes = await fetch(`${backend.url}/v0/artifacts/${createJson.data.id}`);
    const metaJson = (await metaRes.json()) as { ok: boolean; data: Record<string, unknown> };
    expect(metaJson.data.parentArtifactId).toBeNull();
    expect(metaJson.data.creatorContext).toBeNull();
    expect(metaJson.data.inputReferences).toBeNull();
  });
});
