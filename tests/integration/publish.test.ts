import { describe, test, expect, beforeAll, afterAll, beforeEach, spyOn } from 'bun:test';
import path from 'path';
import { startBackend, stopBackend, type TestBackend } from '../setup/backend';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from '../setup/database';
import { createTestApiKey } from '../setup/api-key';

let backend: TestBackend;
let apiKey: string;
const dbName = generateTestDbName();
let consoleSpy: ReturnType<typeof spyOn>;

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

beforeEach(() => {
  consoleSpy = spyOn(console, 'log').mockImplementation(() => {});
});

function getOutput(): { ok: boolean; data: Record<string, unknown> } {
  const lastCall = consoleSpy.mock.calls[consoleSpy.mock.calls.length - 1];
  return JSON.parse(lastCall[0] as string);
}

describe('publish', () => {
  test('publish markdown succeeds', async () => {
    const { publish } = await import('../../packages/cli/src/commands/publish');
    await publish(path.resolve('tests/fixtures/sample.md'), { type: 'markdown' });

    const output = getOutput();
    expect(output.ok).toBe(true);
    expect(output.data.id).toBeDefined();
    expect(output.data.type).toBe('markdown');
  });

  test('publish HTML succeeds', async () => {
    const { publish } = await import('../../packages/cli/src/commands/publish');
    await publish(path.resolve('tests/fixtures/sample.html'), { type: 'html' });

    const output = getOutput();
    expect(output.ok).toBe(true);
    expect(output.data.type).toBe('html');
  });

  test('publish chart succeeds', async () => {
    const { publish } = await import('../../packages/cli/src/commands/publish');
    await publish(path.resolve('tests/fixtures/sample-chart.json'), { type: 'chart' });

    const output = getOutput();
    expect(output.ok).toBe(true);
    expect(output.data.type).toBe('chart');
  });

  test('publish with custom title', async () => {
    const { publish } = await import('../../packages/cli/src/commands/publish');
    await publish(path.resolve('tests/fixtures/sample.md'), {
      type: 'markdown',
      title: 'Custom Title',
    });

    const output = getOutput();
    expect(output.data.title).toBe('Custom Title');
  });

  test('published content matches original file', async () => {
    const { publish } = await import('../../packages/cli/src/commands/publish');
    await publish(path.resolve('tests/fixtures/sample.md'), { type: 'markdown' });

    const output = getOutput();
    const id = output.data.id as string;

    const res = await fetch(`${backend.url}/v0/artifacts/${id}/content`);
    const content = await res.text();
    const original = await Bun.file('tests/fixtures/sample.md').text();
    expect(content).toBe(original);
  });

  test('publish with invalid type throws INVALID_TYPE', async () => {
    const { publish } = await import('../../packages/cli/src/commands/publish');
    const { CliError } = await import('../../packages/cli/src/errors');

    try {
      await publish(path.resolve('tests/fixtures/sample.md'), { type: 'invalid' });
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeInstanceOf(CliError);
      expect((err as InstanceType<typeof CliError>).code).toBe('INVALID_TYPE');
    }
  });

  test('publish non-existent file throws FILE_NOT_FOUND', async () => {
    const { publish } = await import('../../packages/cli/src/commands/publish');
    const { CliError } = await import('../../packages/cli/src/errors');

    try {
      await publish('/tmp/nonexistent-12345.md', { type: 'markdown' });
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeInstanceOf(CliError);
      expect((err as InstanceType<typeof CliError>).code).toBe('FILE_NOT_FOUND');
    }
  });

  test('publish code type succeeds', async () => {
    const { publish } = await import('../../packages/cli/src/commands/publish');
    await publish(path.resolve('tests/fixtures/sample.ts'), { type: 'code' });

    const output = getOutput();
    expect(output.ok).toBe(true);
    expect(output.data.type).toBe('code');
  });

  test('publish text type succeeds', async () => {
    const { publish } = await import('../../packages/cli/src/commands/publish');
    await publish(path.resolve('tests/fixtures/sample.txt'), { type: 'text' });

    const output = getOutput();
    expect(output.ok).toBe(true);
    expect(output.data.type).toBe('text');
  });

  test('publish returns url in response', async () => {
    const { publish } = await import('../../packages/cli/src/commands/publish');
    await publish(path.resolve('tests/fixtures/sample.md'), { type: 'markdown' });

    const output = getOutput();
    expect(output.ok).toBe(true);
    expect(output.data.url).toBeDefined();
    expect(typeof output.data.url).toBe('string');
    expect((output.data.url as string)).toContain(`/s/${output.data.id}`);
  });

  test('publish without API key throws NO_API_KEY', async () => {
    const savedKey = process.env.TOKENRIP_API_KEY;
    delete process.env.TOKENRIP_API_KEY;

    try {
      const { publish } = await import('../../packages/cli/src/commands/publish');
      const { CliError } = await import('../../packages/cli/src/errors');

      try {
        await publish(path.resolve('tests/fixtures/sample.md'), { type: 'markdown' });
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeInstanceOf(CliError);
        expect((err as InstanceType<typeof CliError>).code).toBe('NO_API_KEY');
      }
    } finally {
      process.env.TOKENRIP_API_KEY = savedKey;
    }
  });

  test('publish via direct HTTP request with JSON body succeeds', async () => {
    const res = await fetch(`${backend.url}/v0/artifacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'markdown',
        content: '# Direct JSON Request\n\nThis was published via direct HTTP request.',
        title: 'Direct JSON Test',
      }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.data.id).toBeDefined();
    expect(data.data.type).toBe('markdown');
    expect(data.data.title).toBe('Direct JSON Test');
    expect(data.data.url).toBeDefined();
    expect((data.data.url as string)).toContain(`/s/${data.data.id}`);
  });

  test('publish via direct HTTP request with large content succeeds', async () => {
    const largeContent = '# Large Content\n\n' + 'x'.repeat(1024 * 100); // 100KB of content

    const res = await fetch(`${backend.url}/v0/artifacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'markdown',
        content: largeContent,
        title: 'Large Content Test',
      }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.data.id).toBeDefined();

    // Verify content was stored correctly
    const contentRes = await fetch(`${backend.url}/v0/artifacts/${data.data.id}/content`);
    const storedContent = await contentRes.text();
    expect(storedContent).toBe(largeContent);
  });
});
