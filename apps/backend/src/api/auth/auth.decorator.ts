import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AUTH_MODES_KEY = 'auth:modes';

/**
 * Declares which auth modes a route accepts.
 * If omitted, defaults to ['agent'] in the guard.
 *
 * Phase 1: only 'agent' is implemented.
 * Phase 2 adds: 'user', 'token'
 */
export const Auth = (...modes: string[]) => SetMetadata(AUTH_MODES_KEY, modes);

/**
 * Extracts the authenticated agent from the request.
 * Use in controllers: @AuthAgent() agent: { id: string }
 */
export const AuthAgent = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.auth?.agent;
  },
);
