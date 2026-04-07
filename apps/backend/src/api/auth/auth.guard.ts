import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';
import { AUTH_MODES_KEY } from './auth.decorator';
import { AuthService } from './auth.service';

export interface RequestAuth {
  agent?: { id: string };
  user?: { id: string };
  token?: { value: string; scope: 'asset' | 'thread'; entityId: string };
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
      // Phase 2: add 'user' and 'token' modes here
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
    const result = await this.authService.validateKey(rawKey);
    if (!result) return false;

    auth.agent = { id: result.agentId };
    return true;
  }
}
