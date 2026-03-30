// Bootstrap helper for integration tests
// Uses compiled dist/ to avoid Bun decorator metadata issues with MikroORM
require('reflect-metadata');
const { NestFactory } = require('@nestjs/core');
const { MikroORM } = require('@mikro-orm/core');

async function createTestApp() {
  const { AppModule } = require('./dist/app.module');

  const app = await NestFactory.create(AppModule, { logger: false });
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
