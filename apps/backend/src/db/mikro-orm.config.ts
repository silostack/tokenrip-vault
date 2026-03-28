import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import dotenv from 'dotenv';
import { entities } from './models';

dotenv.config({ path: process.env.ENV_FILE || '.env' });

export default defineConfig({
  extensions: [Migrator],
  dbName: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),

  entities,
  driver: PostgreSqlDriver,
  debug: false,
  highlighter: new SqlHighlighter(),
  migrations: {
    disableForeignKeys: false,
    pathTs: 'migrations',
  },
  pool: {
    min: 2,
    max: 10,
  },
}) as MikroOrmModuleSyncOptions;
