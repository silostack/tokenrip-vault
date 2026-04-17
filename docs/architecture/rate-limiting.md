# Rate Limiting

Three-layer rate limiting sits on every HTTP request to the backend. Limits
compose: a request must pass every layer that applies to it. The design
deliberately makes brute-force defense independent of source IP, so that
NAT-heavy networks (campuses, offices, mobile carriers) aren't punished
for the behavior of one bad actor behind the same egress.

Code lives in `apps/backend/src/api/ratelimit/` (2 files — guard + config).
Registered via `ThrottlerModule.forRootAsync()` and a second `APP_GUARD`
inside `ApiModule` — not a standalone module; it's too small to justify
one. Built on `@nestjs/throttler` with the in-memory store.

## Layers

**Layer 1 — `coarse-ip`.** A per-source-IP cap applied to every request.
Catches pre-auth DoS and unauthenticated scraping. Deliberately generous
so a legitimate shared-egress network never notices.

**Layer 2 — `per-identity`.** Applied when a caller is identifiable. Key
priority: `request.auth.agent.id` → `request.auth.user.id` →
`request.auth.capability.iss` → raw Bearer-token fingerprint (for MCP,
which does its own auth inside the controller) → session-cookie prefix.
Skipped entirely for fully anonymous traffic to avoid double-counting
with Layer 1.

**Layer 3 — targeted keys.** Activated automatically when the request
body carries a field that names the resource under attack:

| Trigger | Bucket | Purpose |
|---|---|---|
| `body.code` | `code:<code>` | Link-code verify/login/register; OAuth auth-code exchange. |
| `body.alias` or `body.email` | `alias:<value>` | Operator password login; any route registering/reading by alias. |
| `body.client_id` | `client:<client_id>` | OAuth token endpoint — defends against per-client abuse. |

Because these are keyed by the target, not the source, a campus full of
students legitimately hitting `/v0/auth/link-code/verify` with *different*
codes all pass; a single attacker guessing *one* code from many IPs still
trips the bucket after 5 tries.

## Limits (defaults)

All values are env-tunable — see the constants in
`apps/backend/src/api/ratelimit/ratelimit.config.ts`.

| Throttler | Default | Env var |
|---|---|---|
| `coarse-ip` | 300 / min | `RATE_LIMIT_COARSE_IP_PER_MIN` |
| `per-identity` | 600 / min | `RATE_LIMIT_PER_IDENTITY_PER_MIN` |
| `target-code` | 5 / 10 min | `RATE_LIMIT_CODE_PER_10MIN` |
| `target-alias` | 10 / hour | `RATE_LIMIT_ALIAS_PER_HOUR` |
| `target-client` | 30 / min | `RATE_LIMIT_CLIENT_PER_MIN` |

Starting values are intentionally loose — we want to see real traffic
before tightening. Monitor the `rate_limit.blocked` log events for the
first week and tune downward.

## 429 response

```json
{ "ok": false, "error": "RATE_LIMITED", "message": "..." }
```

`X-RateLimit-Limit` / `X-RateLimit-Remaining` headers are emitted on
every response. `Retry-After` is set on 429.

## Telemetry

Every 429 emits a structured winston warning via
`apps/backend/src/api/ratelimit/tokenrip-throttler.guard.ts`:

```json
{
  "event": "rate_limit.blocked",
  "throttler": "code:847291",
  "key": "<sha256 of storage key>",
  "limit": 5,
  "ttl": 600000,
  "route": "POST /v0/auth/link-code/verify",
  "ip": "203.0.113.4"
}
```

No successful-request logging — use the existing analytics interceptor
for volume metrics.

## Trust proxy

`request.ip` only reflects the real client when Express is told how many
proxies to trust. Set `TRUST_PROXY_HOPS=N` in the environment where `N` is
the number of LB/CDN hops in front of the backend (usually `1`). Default
is `0`, which is safe for local dev but useless in production: all traffic
appears to come from the load balancer's IP and Layer 1 becomes a single
global counter.

## Operational notes

- **Multi-instance:** the default `@nestjs/throttler` storage is per-process
  in-memory. Scaling horizontally multiplies the effective limit by the
  instance count. When that matters, swap the storage provider for the
  Redis implementation — no route or config changes required.
- **MCP:** `/mcp` is `@Public()` with auth inside the controller. Layer 2
  still buckets by Bearer-token fingerprint, and Layer 1 still applies.
  No separate MCP-tool-level limits yet.
- **Disabling for tests:** integration tests default `RATE_LIMIT_DISABLED=true`
  via `tests/setup/backend.ts`. Only `tests/integration/ratelimit.test.ts`
  opts in by passing `{ rateLimiting: true }` to `startBackend`.

## Adding a new targeted limit

Most endpoints don't need a dedicated bucket — Layer 1 and Layer 2 cover
them. Add a new target throttler only when:

1. The endpoint is a plausible brute-force target, and
2. The target is identifiable by a single body field, and
3. Per-IP keying would be unfair (NAT collisions).

To add one:

1. Append a new throttler to `buildThrottlers()` in
   `apps/backend/src/api/ratelimit/ratelimit.config.ts`. Give it a name,
   limit, ttl, and a `skipIf` that starts with `disabled()` and then
   returns `true` when the body field is missing.
2. Add an integration test to `tests/integration/ratelimit.test.ts`
   that proves the bucket triggers on the expected field and remains
   IP-independent.
