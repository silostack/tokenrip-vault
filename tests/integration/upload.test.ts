import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import path from 'path';
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
  process.env.TOKENRIP_API_URL = backend.url;
  process.env.TOKENRIP_API_KEY = apiKey;
});

afterAll(async () => {
  await stopBackend(backend);
  await dropTestDatabase(dbName);
});

// Helper: upload via fetch (native FormData) since form-data npm package has Bun stream issues
async function uploadFile(
  filePath: string,
  opts: { title?: string; apiKeyOverride?: string } = {},
): Promise<{ status: number; body: any }> {
  const file = Bun.file(filePath);
  const form = new FormData();
  form.append('file', file);
  form.append('type', 'file');
  if (opts.title) form.append('title', opts.title);
  else form.append('title', path.basename(filePath));

  const res = await fetch(`${backend.url}/v0/assets`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${opts.apiKeyOverride ?? apiKey}` },
    body: form,
  });
  return { status: res.status, body: await res.json() };
}

describe('upload', () => {
  test('upload PNG succeeds with asset ID and default title', async () => {
    const { status, body } = await uploadFile('tests/fixtures/sample.png');
    expect(status).toBe(201);
    expect(body.ok).toBe(true);
    expect(body.data.id).toBeDefined();
    expect(body.data.title).toBe('sample.png');
    expect(body.data.type).toBe('file');
    expect(body.data.mimeType).toBe('image/png');
  });

  test('upload PDF with custom title', async () => {
    const { status, body } = await uploadFile('tests/fixtures/sample.pdf', {
      title: 'My PDF Report',
    });
    expect(status).toBe(201);
    expect(body.ok).toBe(true);
    expect(body.data.title).toBe('My PDF Report');
  });

  test('uploaded file content is retrievable', async () => {
    const { body } = await uploadFile('tests/fixtures/sample.png');
    const id = body.data.id;

    const res = await fetch(`${backend.url}/v0/assets/${id}/content`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('image/png');

    const content = Buffer.from(await res.arrayBuffer());
    const original = Buffer.from(await Bun.file('tests/fixtures/sample.png').arrayBuffer());
    expect(content).toEqual(original);
  });

  test('CLI upload with non-existent file throws FILE_NOT_FOUND', async () => {
    const { upload } = await import('../../packages/cli/src/commands/upload');
    const { CliError } = await import('../../packages/cli/src/errors');

    try {
      await upload('/tmp/nonexistent-file-12345.txt', {});
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeInstanceOf(CliError);
      expect((err as InstanceType<typeof CliError>).code).toBe('FILE_NOT_FOUND');
    }
  });

  test('CLI upload without API key throws NO_API_KEY', async () => {
    const savedKey = process.env.TOKENRIP_API_KEY;
    delete process.env.TOKENRIP_API_KEY;

    try {
      const { upload } = await import('../../packages/cli/src/commands/upload');
      const { CliError } = await import('../../packages/cli/src/errors');

      try {
        await upload(path.resolve('tests/fixtures/sample.png'), {});
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeInstanceOf(CliError);
        expect((err as InstanceType<typeof CliError>).code).toBe('NO_API_KEY');
      }
    } finally {
      process.env.TOKENRIP_API_KEY = savedKey;
    }
  });

  test('upload with invalid API key returns 401', async () => {
    const { status, body } = await uploadFile('tests/fixtures/sample.png', {
      apiKeyOverride: 'tr_invalid_key',
    });
    expect(status).toBe(401);
  });

  test('upload returns url in response', async () => {
    const { status, body } = await uploadFile('tests/fixtures/sample.png');
    expect(status).toBe(201);
    expect(body.data.url).toBeDefined();
    expect(typeof body.data.url).toBe('string');
    expect(body.data.url).toContain(`/s/${body.data.id}`);
  });
});
