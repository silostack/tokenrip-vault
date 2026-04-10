import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';
import { buildServer } from '../../apps/blog-engine/src/server';
import type { FastifyInstance } from 'fastify';

export interface TestBlogEngine {
  server: FastifyInstance;
  url: string;
  tmpDir: string;
}

export async function startBlogEngine(): Promise<TestBlogEngine> {
  const tmpDir = await fs.mkdtemp(
    path.join(os.tmpdir(), 'blog-engine-test-'),
  );
  const storagePath = path.join(tmpDir, 'articles');
  const sqlitePath = path.join(tmpDir, 'blog.sqlite');
  await fs.mkdir(storagePath, { recursive: true });

  process.env.STORAGE_PATH = storagePath;
  process.env.SQLITE_PATH = sqlitePath;

  const server = await buildServer();
  await server.listen({ port: 0 });

  const address = server.addresses()[0];
  const url = `http://localhost:${address.port}`;

  return { server, url, tmpDir };
}

export async function stopBlogEngine(engine: TestBlogEngine) {
  await engine.server.close();
  await fs.rm(engine.tmpDir, { recursive: true, force: true });
}
