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


/**
 * Extracts the authenticated user from the request.
 * Use in controllers: @AuthUser() user: { id: string }
 */
export const AuthUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.auth?.user;
  },
);

/**
 * Extracts the verified capability payload from the request.
 * Use in controllers: @AuthCapability() cap: CapabilityPayload
 */
export const AuthCapability = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.auth?.capability;
  },
);

/**
 * Extracts the full auth object from the request.
 * Use in controllers: @ReqAuth() auth: RequestAuth
 */
export const ReqAuth = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.auth;
  },
);
