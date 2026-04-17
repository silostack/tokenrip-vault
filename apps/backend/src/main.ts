import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import express from 'express';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

const envFile = process.env.ENV_FILE || '.env';
config({ path: envFile });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // Trust N proxy hops so request.ip reflects the real client, not the LB.
  // Default 0 (no trust) is safe in local dev; set TRUST_PROXY_HOPS=1 behind
  // a single LB/CDN in production. Rate limiting depends on this being right.
  const trustProxyHops = Number.parseInt(process.env.TRUST_PROXY_HOPS ?? '0', 10);
  app.set('trust proxy', Number.isFinite(trustProxyHops) ? trustProxyHops : 0);

  // Enable JSON body parsing with larger limit for content
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(cookieParser());

  const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
    : isDev
      ? true
      : false;

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  app.enableShutdownHooks();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`>>>>> Backend running on port ${port}`);
}

bootstrap();
