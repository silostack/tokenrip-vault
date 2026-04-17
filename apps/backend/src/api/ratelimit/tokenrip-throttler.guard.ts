import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ThrottlerGuard, ThrottlerLimitDetail } from '@nestjs/throttler';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class TokenripThrottlerGuard extends ThrottlerGuard {
  @Inject(WINSTON_MODULE_NEST_PROVIDER)
  protected readonly logger!: Logger;

  protected async throwThrottlingException(
    context: ExecutionContext,
    detail: ThrottlerLimitDetail,
  ): Promise<void> {
    const req = context.switchToHttp().getRequest();
    const route = `${req.method} ${req.originalUrl ?? req.url}`;

    this.logger.warn({
      event: 'rate_limit.blocked',
      throttler: detail.tracker,
      key: detail.key,
      limit: detail.limit,
      ttl: detail.ttl,
      route,
      ip: req.ip,
    });

    throw new HttpException(
      {
        ok: false,
        error: 'RATE_LIMITED',
        message: 'Too many requests. Please slow down and retry shortly.',
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
