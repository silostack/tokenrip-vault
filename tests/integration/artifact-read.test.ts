import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { startBackend, stopBackend, type TestBackend } from '../setup/backend';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from '../setup/database';
import { createTestApiKey } from '../setup/api-key';
import { v4 } from 'uuid';

let backend: TestBackend;
let apiKey: string;
const dbName = generateTestDbName();

let uploadedFileId: string;
let publishedContentId: string;
let provenanceArtifactId: string;
const testParentId = v4();

beforeAll(async () => {
  await createTestDatabase(dbName);
  backend = await startBackend(dbName);
  apiKey = await createTestApiKey(backend.url);

  // Create a file artifact via API
  const fileForm = new FormData();
  const pngBytes = await Bun.file('tests/fixtures/sample.png').arrayBuffer();
  fileForm.append('file', new Blob([pngBytes], { type: 'image/png' }), 'sample.png');
  fileForm.append('type', 'file');
  fileForm.append('mimeType', 'image/png');
  fileForm.append('title', 'Test PNG');

  const fileRes = await fetch(`${backend.url}/v0/artifacts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: fileForm,
  });
  const fileJson = (await fileRes.json()) as { data: { id: string } };
  uploadedFileId = fileJson.data.id;

  // Create a content artifact via API
  const contentRes = await fetch(`${backend.url}/v0/artifacts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'markdown',
      content: '# Test\n\nHello world.',
      title: 'Test Markdown',
    }),
  });
  const contentJson = (await contentRes.json()) as { data: { id: string } };
  publishedContentId = contentJson.data.id;

  // Create an artifact with provenance fields
  const provRes = await fetch(`${backend.url}/v0/artifacts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'markdown',
      content: '# Provenance test',
      title: 'With Provenance',
      parentArtifactId: testParentId,
      creatorContext: 'test-agent',
      inputReferences: ['ref-a', 'ref-b'],
    }),
  });
  const provJson = (await provRes.json()) as { data: { id: string } };
  provenanceArtifactId = provJson.data.id;
});

afterAll(async () => {
  await stopBackend(backend);
  await dropTestDatabase(dbName);
});

describe('artifact read', () => {
  test('GET metadata for uploaded file', async () => {
    const res = await fetch(`${backend.url}/v0/artifacts/${uploadedFileId}`);
    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean; data: Record<string, unknown> };
    expect(json.ok).toBe(true);
    expect(json.data.id).toBe(uploadedFileId);
    expect(json.data.title).toBe('Test PNG');
    expect(json.data.type).toBe('file');
    expect(json.data.mimeType).toBe('image/png');
    expect(json.data.createdAt).toBeDefined();
  });

  test('GET metadata for published content', async () => {
    const res = await fetch(`${backend.url}/v0/artifacts/${publishedContentId}`);
    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean; data: Record<string, unknown> };
    expect(json.ok).toBe(true);
    expect(json.data.id).toBe(publishedContentId);
    expect(json.data.title).toBe('Test Markdown');
    expect(json.data.type).toBe('markdown');
    expect(json.data.mimeType).toBe('text/markdown');
  });

  test('GET content streams correct bytes for file', async () => {
    const res = await fetch(`${backend.url}/v0/artifacts/${uploadedFileId}/content`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('image/png');

    const content = Buffer.from(await res.arrayBuffer());
    const original = Buffer.from(await Bun.file('tests/fixtures/sample.png').arrayBuffer());
    expect(content).toEqual(original);
  });

  test('GET content streams correct text for published content', async () => {
    const res = await fetch(`${backend.url}/v0/artifacts/${publishedContentId}/content`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/markdown');

    const content = await res.text();
    expect(content).toBe('# Test\n\nHello world.');
  });

  test('GET metadata for non-existent UUID returns 404', async () => {
    const res = await fetch(`${backend.url}/v0/artifacts/00000000-0000-0000-0000-000000000000`);
    expect(res.status).toBe(404);
  });

  test('GET content for non-existent UUID returns 404', async () => {
    const res = await fetch(`${backend.url}/v0/artifacts/00000000-0000-0000-0000-000000000000/content`);
    expect(res.status).toBe(404);
  });

  test('GET metadata includes provenance fields when set', async () => {
    const res = await fetch(`${backend.url}/v0/artifacts/${provenanceArtifactId}`);
    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean; data: Record<string, unknown> };
    expect(json.data.parentArtifactId).toBe(testParentId);
    expect(json.data.creatorContext).toBe('test-agent');
    expect(json.data.inputReferences).toEqual(['ref-a', 'ref-b']);
  });
});
