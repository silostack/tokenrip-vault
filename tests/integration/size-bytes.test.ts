import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
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

describe('sizeBytes tracking', () => {
  test('published content includes sizeBytes in status', async () => {
    const content = '# Hello World';
    await fetch(`${backend.url}/v0/assets`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'markdown', content, title: 'Sized' }),
    });

    const res = await fetch(`${backend.url}/v0/assets/status`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const json = (await res.json()) as { ok: boolean; data: Array<{ title: string; sizeBytes: number | null }> };
    const asset = json.data.find((a) => a.title === 'Sized');
    expect(asset).toBeDefined();
    expect(asset!.sizeBytes).toBe(Buffer.byteLength(content, 'utf-8'));
  });

  test('uploaded file includes sizeBytes in status', async () => {
    const fileContent = Buffer.from('fake PNG content for size test');
    const formData = new FormData();
    formData.append('file', new Blob([fileContent]), 'test.png');
    formData.append('title', 'SizedFile');

    await fetch(`${backend.url}/v0/assets`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: formData,
    });

    const res = await fetch(`${backend.url}/v0/assets/status`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const json = (await res.json()) as { ok: boolean; data: Array<{ title: string; sizeBytes: number | null }> };
    const asset = json.data.find((a) => a.title === 'SizedFile');
    expect(asset).toBeDefined();
    expect(asset!.sizeBytes).toBe(fileContent.byteLength);
  });
});
