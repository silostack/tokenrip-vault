// Bootstrap helper for integration tests
// Uses compiled dist/ to avoid Bun decorator metadata issues with MikroORM
require('reflect-metadata');
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

  const address = app.getHttpServer().address();
  const port = typeof address === 'object' ? address.port : 0;
  const url = `http://localhost:${port}`;

  return { app, url, orm };
}

module.exports = { createTestApp };
