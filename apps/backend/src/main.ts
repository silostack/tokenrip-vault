import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';

const envFile = process.env.ENV_FILE || '.env';
config({ path: envFile });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

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

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
