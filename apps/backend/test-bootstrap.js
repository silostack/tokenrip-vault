// Bootstrap helper for integration tests
// Uses compiled dist/ to avoid Bun decorator metadata issues with MikroORM
require('reflect-metadata');

// Each test file creates a NestJS app with its own Winston logger. Each logger adds
// listeners to the shared Winston Console transport. Raise the global default to avoid
// MaxListenersExceededWarning across a large integration test suite.
require('events').setMaxListeners(0);
const { NestFactory } = require('@nestjs/core');
const { MikroORM } = require('@mikro-orm/core');
const express = require('express');

async function createTestApp() {
  const { AppModule } = require('./dist/app.module');

  const app = await NestFactory.create(AppModule, { logger: false });
  const trustProxyHops = Number.parseInt(process.env.TRUST_PROXY_HOPS ?? '0', 10);
  app.set('trust proxy', Number.isFinite(trustProxyHops) ? trustProxyHops : 0);
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  await app.listen(0);

  const orm = app.get(MikroORM);
  const generator = orm.getSchemaGenerator();
  await generator.dropSchema();
  await generator.createSchema();

  // Tests use createSchema (not migrations), so seed data from migrations
  // must be applied here explicitly. Keep this in sync with any data-seeding
  // migrations under apps/backend/migrations/.
  await orm.em.getConnection().execute(
    `insert into "agent" ("id", "public_key", "alias", "registered_at")
     values (
       'rip1kfu23m3vk3umxgu3wdhkltlvvasm2secm8t6jknvtna2fjgm3cwsje9umr',
       'b278a8ee2cb479b32391736f6fafec6761b54338d9d7a95a6c5cfaa4c91b8e1d',
       'tokenrip.ai',
       now()
     )
     on conflict ("id") do nothing;`,
  );

  const address = app.getHttpServer().address();
  const port = typeof address === 'object' ? address.port : 0;
  const url = `http://localhost:${port}`;

  return { app, url, orm };
}

module.exports = { createTestApp };
