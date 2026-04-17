import { tmpdir } from 'os';
import { join } from 'path';

export interface TestBackend {
  app: any;
  url: string;
  orm: any;
}

export interface StartBackendOptions {
  rateLimiting?: boolean;
}

export async function startBackend(
  dbName: string,
  options: StartBackendOptions = {},
): Promise<TestBackend> {
  // Set env vars BEFORE importing AppModule so mikro-orm.config.ts picks them up
  process.env.DATABASE_NAME = dbName;
  process.env.STORAGE_PATH = join(tmpdir(), `tokenrip-test-${dbName}`);
  process.env.PORT = '0';
  process.env.ENV_FILE = '/dev/null';
  // Rate limiting is off for tests by default so ordinary fixture bursts
  // don't trip buckets. Tests that want rate limiting on pass
  // { rateLimiting: true }.
  process.env.RATE_LIMIT_DISABLED = options.rateLimiting ? 'false' : 'true';

  // Import from the backend directory so NestJS/MikroORM resolve correctly
  // Uses compiled dist/ to avoid Bun decorator metadata issues
  const { createTestApp } = await import('../../apps/backend/test-bootstrap.js');
  return createTestApp();
}

export async function stopBackend(backend: TestBackend): Promise<void> {
  // Force-close the HTTP server and ORM connection pool.
  // NestJS app.close() can hang in Bun, so we close the server directly.
  const server = backend.app.getHttpServer();
  server.closeAllConnections?.();
  await new Promise<void>((resolve) => server.close(() => resolve()));
  await backend.orm.close(true);
}
