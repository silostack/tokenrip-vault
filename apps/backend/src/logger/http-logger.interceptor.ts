import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject, HttpException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Observable, tap } from 'rxjs';

@Injectable()
export class HttpLoggerInterceptor implements NestInterceptor {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, ip } = req;
    const start = Date.now();

    this.logger.info(`→ ${method} ${url}`, { ip });

    return next.handle().pipe(
      tap({
        next: () => {
          const res = context.switchToHttp().getResponse();
          this.logger.info(`← ${method} ${url} ${res.statusCode} ${Date.now() - start}ms`);
        },
        error: (err: unknown) => {
          const status = err instanceof HttpException ? err.getStatus() : 500;
          const message = err instanceof Error ? err.message : String(err);
          this.logger.error(`← ${method} ${url} ${status} ${Date.now() - start}ms — ${message}`, {
            stack: err instanceof Error ? err.stack : undefined,
          });
        },
      }),
    );
  }
}
