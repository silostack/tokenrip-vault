import Fastify from 'fastify';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { getConfig } from './config';
import { LocalStorage } from './storage/local-storage';
import { ArticleIndex } from './db';
import { ArticleService } from './services/article.service';
import { articleRoutes } from './routes/articles';

export async function buildServer() {
  const config = getConfig();
  const fastify = Fastify({ logger: false });

  fs.mkdirSync(config.storagePath, { recursive: true });
  fs.mkdirSync(path.dirname(config.sqlitePath), { recursive: true });

  const storage = new LocalStorage(config.storagePath);
  const index = new ArticleIndex(config.sqlitePath);
  const articleService = new ArticleService(storage, index);

  // Parse text/markdown as raw string
  fastify.addContentTypeParser(
    'text/markdown',
    { parseAs: 'string' },
    (_req, body, done) => {
      done(null, body);
    },
  );

  await fastify.register(articleRoutes, { articleService });

  fastify.addHook('onClose', () => {
    articleService.close();
  });

  return fastify;
}
