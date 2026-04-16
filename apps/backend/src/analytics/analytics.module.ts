import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AnalyticsService } from './analytics.service';
import { AnalyticsInterceptor } from './analytics.interceptor';

@Global()
@Module({
  providers: [
    AnalyticsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AnalyticsInterceptor,
    },
  ],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
