import { ExecutionContext } from '@nestjs/common';
import { ThrottlerOptions } from '@nestjs/throttler';

function intFromEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getReq(ctx: ExecutionContext): Record<string, any> {
  return ctx.switchToHttp().getRequest();
}

// All skipIf checks must start with this — @nestjs/throttler v6 ignores the
// top-level skipIf when a per-throttler skipIf is set, so we inline the
// disabled check into each named throttler that has its own skip logic.
function disabled(): boolean {
  return process.env.RATE_LIMIT_DISABLED === 'true';
}

function identityTracker(req: Record<string, any>): string {
  // Prefer AuthGuard-populated identity when available.
  const auth = req.auth;
  if (auth?.agent?.id) return `agent:${auth.agent.id}`;
  if (auth?.user?.id) return `user:${auth.user.id}`;
  if (auth?.capability?.iss) return `cap:${auth.capability.iss}`;

  // Fallback: peek at raw credentials without a DB lookup so this works even
  // if the throttler fires before AuthGuard (e.g. on @Public() routes where
  // the controller does its own auth, like /mcp).
  const header = typeof req.headers?.authorization === 'string'
    ? req.headers.authorization
    : '';
  if (header.startsWith('Bearer ')) {
    // First 16 chars of the token key are enough to distinguish holders
    // without logging the full secret.
    return `bearer:${header.slice(7, 23)}`;
  }
  const cookie = req.cookies?.session;
  if (typeof cookie === 'string' && cookie.startsWith('ut_')) {
    return `session:${cookie.slice(0, 16)}`;
  }

  // No identity at all — let Layer 1 handle pure anonymous traffic.
  return '';
}

export function buildThrottlers(): ThrottlerOptions[] {
  const coarseIpLimit = intFromEnv('RATE_LIMIT_COARSE_IP_PER_MIN', 300);
  const perIdentityLimit = intFromEnv('RATE_LIMIT_PER_IDENTITY_PER_MIN', 600);
  const codeLimit = intFromEnv('RATE_LIMIT_CODE_PER_10MIN', 5);
  const aliasLimit = intFromEnv('RATE_LIMIT_ALIAS_PER_HOUR', 10);
  const clientLimit = intFromEnv('RATE_LIMIT_CLIENT_PER_MIN', 30);

  return [
    // Layer 1 — coarse per-IP ceiling for every request.
    {
      name: 'coarse-ip',
      limit: coarseIpLimit,
      ttl: 60_000,
      skipIf: () => disabled(),
      getTracker: (req) => `ip:${req.ip ?? 'unknown'}`,
    },

    // Layer 2 — per-identity cap on authenticated traffic. Skips when
    // the caller is fully anonymous to avoid double-counting with Layer 1.
    {
      name: 'per-identity',
      limit: perIdentityLimit,
      ttl: 60_000,
      skipIf: (ctx) => disabled() || identityTracker(getReq(ctx)) === '',
      getTracker: (req) => identityTracker(req),
    },

    // Layer 3 — target-keyed brute-force defense. Activated automatically
    // by body shape: any request whose body contains the key of interest
    // is throttled by that target, regardless of source IP. That's what
    // makes this NAT-safe and why a campus full of students behind one
    // IP can all legitimately hit /verify at the same time.
    {
      name: 'target-code',
      limit: codeLimit,
      ttl: 10 * 60_000,
      skipIf: (ctx) => {
        if (disabled()) return true;
        const body = getReq(ctx).body;
        return !body || typeof body.code !== 'string' || body.code.length === 0;
      },
      getTracker: (req) => `code:${req.body?.code}`,
    },
    {
      name: 'target-alias',
      limit: aliasLimit,
      ttl: 60 * 60_000,
      skipIf: (ctx) => {
        if (disabled()) return true;
        const body = getReq(ctx).body;
        if (!body) return true;
        const target = body.alias ?? body.email;
        return typeof target !== 'string' || target.length === 0;
      },
      getTracker: (req) => {
        const target = req.body?.alias ?? req.body?.email;
        return `alias:${String(target).toLowerCase()}`;
      },
    },
    {
      name: 'target-client',
      limit: clientLimit,
      ttl: 60_000,
      skipIf: (ctx) => {
        if (disabled()) return true;
        const body = getReq(ctx).body;
        return !body || typeof body.client_id !== 'string' || body.client_id.length === 0;
      },
      getTracker: (req) => `client:${req.body?.client_id}`,
    },
  ];
}
