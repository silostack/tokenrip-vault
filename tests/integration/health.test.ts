import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { startBackend, stopBackend, type TestBackend } from '../setup/backend';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from '../setup/database';

let backend: TestBackend;
const dbName = generateTestDbName();

beforeAll(async () => {
  await createTestDatabase(dbName);
  backend = await startBackend(dbName);
});

afterAll(async () => {
  await stopBackend(backend);
  await dropTestDatabase(dbName);
});

describe('health', () => {
  test('GET /v0/health returns ok', async () => {
    const res = await fetch(`${backend.url}/v0/health`);
    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean };
    expect(json.ok).toBe(true);
  });
});
