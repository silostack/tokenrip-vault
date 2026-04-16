import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AnalyticsService } from './analytics.service';

@Injectable()
export class AnalyticsInterceptor implements NestInterceptor {
  constructor(private readonly analyticsService: AnalyticsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const auth = request.auth;
          if (!auth?.agent && !auth?.user) return;

          const response = context.switchToHttp().getResponse();
          this.analyticsService.track('api_call', {
            distinct_id: auth.agent?.id ?? auth.user?.id,
            endpoint: request.route?.path ?? request.url,
            method: request.method,
            status_code: response.statusCode,
            latency_ms: Date.now() - start,
            auth_type: auth.agent ? 'agent' : 'user',
          });
        },
        error: (err: any) => {
          const auth = request.auth;
          if (!auth?.agent && !auth?.user) return;

          this.analyticsService.track('api_call', {
            distinct_id: auth.agent?.id ?? auth.user?.id,
            endpoint: request.route?.path ?? request.url,
            method: request.method,
            status_code: err.status ?? 500,
            latency_ms: Date.now() - start,
            auth_type: auth.agent ? 'agent' : 'user',
            error: true,
          });
        },
      }),
    );
  }
}
