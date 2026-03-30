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
});
