import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import ormConfig from './db/mikro-orm.config';
import { ApiModule } from './api/api.module';
import { StorageModule } from './storage/storage.module';
import { LoggerModule } from './logger/logger.module';
import { AuthGuard } from './api/auth/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV_FILE || '.env',
    }),
    MikroOrmModule.forRoot(ormConfig),
    LoggerModule,
    StorageModule,
    ApiModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
