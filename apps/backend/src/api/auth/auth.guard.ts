import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';
import { AUTH_MODES_KEY } from './auth.decorator';
import { AuthService } from './auth.service';
import { parseAndVerifyCapabilityToken, type CapabilityPayload } from './crypto';

export interface RequestAuth {
  agent?: { id: string };
  user?: { id: string };
  capability?: CapabilityPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const modes = this.reflector.getAllAndOverride<string[]>(AUTH_MODES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) || ['agent'];

    const request = context.switchToHttp().getRequest();
    const auth: RequestAuth = {};

    for (const mode of modes) {
      if (mode === 'agent' && await this.tryAgentAuth(request, auth)) {
        request.auth = auth;
        return true;
      }
      if (mode === 'user' && await this.tryUserAuth(request, auth)) {
        request.auth = auth;
        return true;
      }
      if (mode === 'token' && await this.tryTokenAuth(request, auth)) {
        request.auth = auth;
        return true;
      }
    }

    throw new UnauthorizedException({
      ok: false,
      error: 'UNAUTHORIZED',
      message: 'Valid authentication required',
    });
  }

  private async tryAgentAuth(request: any, auth: RequestAuth): Promise<boolean> {
    const authHeader: string | undefined = request.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) return false;

    const rawKey = authHeader.slice(7);
    if (rawKey.startsWith('ut_')) return false;

    const result = await this.authService.validateKey(rawKey);
    if (!result) return false;

    auth.agent = { id: result.agentId };
    return true;
  }

  private async tryUserAuth(request: any, auth: RequestAuth): Promise<boolean> {
    const authHeader: string | undefined = request.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ut_')) return false;

    const rawToken = authHeader.slice(7);
    const result = await this.authService.validateSessionToken(rawToken);
    if (!result) return false;

    auth.user = { id: result.userId };
    return true;
  }

  private tryTokenAuth(request: any, auth: RequestAuth): boolean {
    const rawToken = request.query?.cap || request.headers['x-capability'];
    if (!rawToken) return false;

    const payload = parseAndVerifyCapabilityToken(rawToken);
    if (!payload) return false;

    auth.capability = payload;
    return true;
  }
}
