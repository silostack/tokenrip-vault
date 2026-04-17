# Operator Login Entry Point Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a discoverable front door (`/login`) that turns a signed-out browser visit into a logged-in operator dashboard in as few steps as possible.

**Architecture:** New public frontend route `/login` with a short-code-first state machine (paste → auto-verify → branch into passwordless login / register / bind / password). New backend endpoint `POST /v0/auth/link-code/login` issues a session when a short code belongs to an already-bound agent (the "lost password + lost signed link" recovery path). Header "Log in" link and homepage CTA route users to `/login`; the existing `/link` URL becomes a redirect.

**Tech Stack:** NestJS + MikroORM (backend), TanStack Start + React 19 (frontend), Bun test runner (integration tests), Geist font + existing CSS-variable theme tokens.

---

## Design source

See approved design at `/Users/si/.claude/plans/i-want-to-introduce-typed-sunrise.md`. This plan expands that design into executable tasks. Non-goals (per design):
- No agent-less registration on `/login` — first-timers land back on `/` for install options.
- Do not repurpose `/oauth/authorize` (that's MCP/PKCE-specific).
- Do not touch `POST /v0/auth/register` or `/operator/auth?token=…`.

## Reuse map

| What | Where | Signature |
|---|---|---|
| Session issuance | `UserService.createSession(user)` | `Promise<{ user: User; sessionToken: string }>` — mutates `user.sessionTokenHash` |
| Bound-user lookup | `OperatorBindingService.findBoundUser(agentId)` | `Promise<User \| null>` (populated) |
| Code peek (non-consuming) | `LinkCodeService.peek(code)` | `Promise<{ agentId; hasBinding }>` |
| Code consume | `LinkCodeService.consume(code)` | `Promise<{ agentId }>` — flips `used=true` |
| Session helpers | `apps/frontend/src/lib/session.ts` | `hasSession() / setSession(token) / clearSession()` |
| Axios instance | `apps/frontend/src/utils/api.ts` (default export `api`) | `.post(path, body)` returns `{ data }`, Bearer token interceptor |
| Error banner pattern | `LinkPage.tsx:95-99` | `border-status-error/20 bg-status-error/5 text-status-error` |
| Entrance animation | `globals.css:353-356` `@keyframes md-enter` | `opacity 0→1, translateY 6px→0 over 0.4s` |

---

## Task 1: Backend — failing integration test for happy-path login

**Files:**
- Modify: `tests/integration/operator.test.ts` — append new describe block.

**Step 1: Write the failing test**

Append this block at the bottom of the file (before the file-end). If a "link code" describe block already exists, add there instead.

```typescript
describe('POST /v0/auth/link-code/login', () => {
  test('returns session for already-bound agent', async () => {
    const { agentId, secretKeyHex } = await registerAgent();
    const token = createOperatorToken(agentId, secretKeyHex);

    // First: register an operator + binding via signed-token flow (existing).
    const regRes = await fetch(`${backend.url}/v0/auth/operator`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        display_name: 'Login Tester',
        password: 'pw-loginwithcode',
        alias: 'login_tester',
      }),
    });
    expect(regRes.status).toBe(201);
    const { data: registered } = (await regRes.json()) as {
      data: { user_id: string; auth_token: string };
    };

    // Now mint a fresh short code from that agent.
    const agentApiKey = /* retrieve agent api key from registerAgent fixture */;
    const codeRes = await fetch(`${backend.url}/v0/auth/link-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${agentApiKey}`,
      },
    });
    expect(codeRes.status).toBe(201);
    const { data: codeData } = (await codeRes.json()) as { data: { code: string } };

    // Exercise the new endpoint as an anonymous caller.
    const loginRes = await fetch(`${backend.url}/v0/auth/link-code/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: codeData.code }),
    });
    expect(loginRes.status).toBe(200);
    const body = (await loginRes.json()) as {
      ok: boolean;
      data: { user_id: string; auth_token: string; agent_id: string };
    };
    expect(body.ok).toBe(true);
    expect(body.data.user_id).toBe(registered.user_id);
    expect(body.data.agent_id).toBe(agentId);
    expect(body.data.auth_token).toBeTruthy();
    expect(body.data.auth_token).not.toBe(registered.auth_token); // fresh session
  });
});
```

> **Before running:** verify how `registerAgent` exposes the agent's API key — it must be reachable from the test (either returned directly or retrievable via the agent key fixture). If the existing helper doesn't return it, extend `tests/setup/agent.ts` inside this same task to return `{ agentId, secretKeyHex, apiKey }` and update callers.

**Step 2: Run test to verify it fails**

```bash
cd /Users/si/projects/maxi/tokenrip/apps/backend && bun run build
cd /Users/si/projects/maxi/tokenrip && bun test tests/integration/operator.test.ts --test-name-pattern "link-code/login"
```

Expected: FAIL. The `loginRes.status` will be 404 (endpoint doesn't exist yet).

**Step 3: Commit the failing test**

```bash
git add tests/integration/operator.test.ts tests/setup/agent.ts
git commit -m "test(backend): failing test for /v0/auth/link-code/login happy path"
```

---

## Task 2: Backend — implement `LinkCodeService.loginWithCode`

**Files:**
- Modify: `apps/backend/src/api/service/link-code.service.ts`

**Step 1: Check existing imports and `OperatorBindingService` injection**

Open `link-code.service.ts`. Confirm `OperatorBindingService` and `UserService` are injectable; if the module doesn't already import them into `LinkCodeService`, add them to the constructor and to `api.module.ts` providers list if needed.

**Step 2: Add the method**

Immediately after the existing `consume` method, add:

```typescript
  async loginWithCode(code: string): Promise<{ agentId: string; userId: string; sessionToken: string }> {
    const record = await this.em.findOne(LinkCode, {
      code,
      used: false,
      expiresAt: { $gt: new Date() },
    });
    if (!record) {
      throw new UnauthorizedException({
        ok: false,
        error: 'INVALID_CODE',
        message: 'Link code is invalid, expired, or already used',
      });
    }

    const user = await this.operatorBindingService.findBoundUser(record.agentId);
    if (!user) {
      throw new ConflictException({
        ok: false,
        error: 'NO_BINDING',
        message: 'Agent has no operator binding yet. Register instead.',
      });
    }

    record.used = true;
    const { sessionToken } = await this.userService.createSession(user);
    await this.em.flush();

    return { agentId: record.agentId, userId: user.id, sessionToken };
  }
```

> **NO_BINDING does NOT consume the code.** Move `record.used = true` to after the binding check so a well-intentioned code isn't burned when falling through to `/register`.

Revised ordering:

```typescript
    const user = await this.operatorBindingService.findBoundUser(record.agentId);
    if (!user) {
      throw new ConflictException({ ok: false, error: 'NO_BINDING', message: '…' });
    }
    record.used = true;
    const { sessionToken } = await this.userService.createSession(user);
    await this.em.flush();
```

**Step 3: Ensure imports**

At the top of the file, confirm/add:

```typescript
import { ConflictException, UnauthorizedException } from '@nestjs/common';
```

---

## Task 3: Backend — add controller handler

**Files:**
- Modify: `apps/backend/src/api/controller/operator.controller.ts:~125`

**Step 1: Add handler immediately after `verifyLinkCode` (~line 124)**

```typescript
  @Public()
  @Post('auth/link-code/login')
  @HttpCode(200)
  async loginWithLinkCode(@Body() body: { code?: string }) {
    if (!body?.code) {
      throw new BadRequestException({
        ok: false,
        error: 'MISSING_FIELD',
        message: 'code is required',
      });
    }
    const { agentId, userId, sessionToken } = await this.linkCodeService.loginWithCode(body.code);
    return {
      ok: true,
      data: { user_id: userId, auth_token: sessionToken, agent_id: agentId },
    };
  }
```

**Step 2: Rebuild and re-run the Task 1 test**

```bash
cd /Users/si/projects/maxi/tokenrip/apps/backend && bun run build
cd /Users/si/projects/maxi/tokenrip && bun test tests/integration/operator.test.ts --test-name-pattern "link-code/login"
```

Expected: PASS.

**Step 3: Commit**

```bash
git add apps/backend/src/api/service/link-code.service.ts apps/backend/src/api/controller/operator.controller.ts
git commit -m "feat(backend): passwordless operator login via short code

Adds POST /v0/auth/link-code/login. When a fresh short code is
presented for an already-bound agent, issue a session for the bound
operator. Enables 'lost password + lost signed link' recovery through
a code generated by the agent."
```

---

## Task 4: Backend — error-case tests

**Files:**
- Modify: `tests/integration/operator.test.ts` — extend the describe block from Task 1.

**Step 1: Add three failing tests**

```typescript
  test('returns 409 NO_BINDING when agent has no operator binding', async () => {
    const { agentId, apiKey } = await registerAgent();
    const codeRes = await fetch(`${backend.url}/v0/auth/link-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    });
    const { data: codeData } = (await codeRes.json()) as { data: { code: string } };

    const loginRes = await fetch(`${backend.url}/v0/auth/link-code/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: codeData.code }),
    });
    expect(loginRes.status).toBe(409);
    const body = (await loginRes.json()) as { error: string };
    expect(body.error).toBe('NO_BINDING');

    // Code should NOT be consumed; a follow-up /register call must still succeed.
    const regRes = await fetch(`${backend.url}/v0/auth/link-code/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: codeData.code, displayName: 'Recovery User', password: 'pw1234567' }),
    });
    expect(regRes.status).toBe(201);
  });

  test('returns 401 INVALID_CODE for an unknown code', async () => {
    const res = await fetch(`${backend.url}/v0/auth/link-code/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: '000000' }),
    });
    expect(res.status).toBe(401);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe('INVALID_CODE');
  });

  test('returns 400 MISSING_FIELD when body omits code', async () => {
    const res = await fetch(`${backend.url}/v0/auth/link-code/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe('MISSING_FIELD');
  });
```

**Step 2: Run**

```bash
cd /Users/si/projects/maxi/tokenrip/apps/backend && bun run build
cd /Users/si/projects/maxi/tokenrip && bun test tests/integration/operator.test.ts --test-name-pattern "link-code/login"
```

Expected: all four tests PASS. If `NO_BINDING` fails the "code not consumed" assertion, fix Task 2's ordering (binding check before `used=true`).

**Step 3: Commit**

```bash
git add tests/integration/operator.test.ts
git commit -m "test(backend): cover NO_BINDING, INVALID_CODE, MISSING_FIELD for link-code/login"
```

---

## Task 5: Frontend — `sanitizeNext` helper

**Files:**
- Create: `apps/frontend/src/lib/redirect.ts`

**Step 1: Create the file**

```typescript
const DEFAULT_POST_LOGIN = '/operator';

export function sanitizeNext(next?: string | null, fallback: string = DEFAULT_POST_LOGIN): string {
  if (!next || !next.startsWith('/')) return fallback;
  if (next.startsWith('//') || next.startsWith('/\\')) return fallback;
  return next;
}
```

**Step 2: Commit**

```bash
git add apps/frontend/src/lib/redirect.ts
git commit -m "feat(frontend): sanitizeNext helper for post-login redirect guard"
```

> **Testing:** no frontend test harness exists. Verification for this helper is via use in Task 7/8 — if a `?next=/foo` lands on `/operator/foo` and `?next=//evil.com` falls back to `/operator`, it's correct.

---

## Task 6: Frontend — `.login-card-enter` animation class

**Files:**
- Modify: `apps/frontend/src/app/globals.css`

**Step 1: Add utility class near the existing `.markdown-body` animation (~line 330)**

```css
.login-card-enter {
  animation: md-enter 0.4s ease-out;
}
```

**Step 2: Commit**

```bash
git add apps/frontend/src/app/globals.css
git commit -m "style(frontend): add .login-card-enter animation utility"
```

---

## Task 7: Frontend — `LoginPage` component scaffold

**Files:**
- Create: `apps/frontend/src/components/LoginPage.tsx`

**Step 1: Create the scaffold (code input + verify flow + all branches)**

```tsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import api from '@/utils/api';
import { hasSession, setSession } from '@/lib/session';
import { sanitizeNext } from '@/lib/redirect';

type Phase =
  | { kind: 'idle' }
  | { kind: 'verifying' }
  | { kind: 'register'; agentId: string }
  | { kind: 'bind-confirm'; agentId: string }
  | { kind: 'password' }
  | { kind: 'done' };

interface LoginPageProps {
  initialCode?: string;
  next?: string;
}

export function LoginPage({ initialCode, next }: LoginPageProps) {
  const navigate = useNavigate();
  const redirectTo = sanitizeNext(next);

  const [code, setCode] = useState(initialCode ?? '');
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const verifyingRef = useRef<string | null>(null);

  // Register-form fields
  const [alias, setAlias] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');

  // Password-tab fields
  const [pwAlias, setPwAlias] = useState('');
  const [pwPassword, setPwPassword] = useState('');

  const isLoggedIn = typeof window !== 'undefined' && hasSession();

  async function verifyAndBranch(rawCode: string) {
    if (rawCode.length !== 6) return;
    if (verifyingRef.current === rawCode) return;
    verifyingRef.current = rawCode;
    setError(null);
    setPhase({ kind: 'verifying' });
    try {
      const peek = await api.post('/v0/auth/link-code/verify', { code: rawCode });
      const { agent_id: agentId, has_binding: hasBinding } = peek.data.data as {
        agent_id: string;
        has_binding: boolean;
      };
      if (hasBinding) {
        if (isLoggedIn) {
          navigate({ to: redirectTo });
          return;
        }
        const login = await api.post('/v0/auth/link-code/login', { code: rawCode });
        setSession(login.data.data.auth_token);
        navigate({ to: redirectTo });
        return;
      }
      if (isLoggedIn) {
        setPhase({ kind: 'bind-confirm', agentId });
      } else {
        setPhase({ kind: 'register', agentId });
      }
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Invalid or expired code.');
      setPhase({ kind: 'idle' });
      verifyingRef.current = null;
    }
  }

  useEffect(() => {
    if (initialCode && initialCode.length === 6) {
      void verifyAndBranch(initialCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onCodeChange(v: string) {
    const clean = v.replace(/\D/g, '').slice(0, 6);
    setCode(clean);
    setError(null);
    if (clean.length === 6) void verifyAndBranch(clean);
  }

  async function onRegister(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await api.post('/v0/auth/link-code/register', {
        code,
        displayName,
        password: password || undefined,
        alias: alias || undefined,
      });
      setSession(res.data.data.auth_token);
      navigate({ to: redirectTo });
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  }

  async function onBind(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post('/v0/auth/link-code/bind', { code });
      navigate({ to: redirectTo });
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Linking failed.');
    } finally {
      setSubmitting(false);
    }
  }

  async function onPasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await api.post('/v0/operators/login', {
        alias: pwAlias,
        password: pwPassword,
      });
      setSession(res.data.data.auth_token);
      navigate({ to: redirectTo });
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Invalid alias or password.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="login-card-enter w-full max-w-sm space-y-6">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-foreground/40">
            tokenrip ▸ login
          </div>
          <h1 className="mt-2 text-2xl tracking-tight">Log in as operator</h1>
          <p className="mt-2 text-sm text-foreground/60">
            Enter the 6-digit code from your agent. Run{' '}
            <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-foreground/70">
              rip operator-link
            </code>{' '}
            to get one.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-status-error/20 bg-status-error/5 px-4 py-3">
            <p className="text-sm text-status-error">{error}</p>
          </div>
        )}

        {(phase.kind === 'idle' || phase.kind === 'verifying') && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void verifyAndBranch(code);
            }}
            className="space-y-4"
          >
            <input
              autoFocus
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              autoComplete="one-time-code"
              placeholder="- - - - - -"
              value={code}
              onChange={(e) => onCodeChange(e.target.value)}
              className="w-full rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-4 text-center font-mono text-2xl tracking-[0.4em] text-foreground placeholder:text-foreground/20 focus:border-foreground/20 focus:outline-none"
            />
            <button
              type="submit"
              disabled={code.length !== 6 || phase.kind === 'verifying'}
              className="w-full rounded-lg bg-foreground px-4 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90 active:scale-[0.98] disabled:opacity-50"
            >
              {phase.kind === 'verifying' ? 'Verifying…' : 'Verify →'}
            </button>
          </form>
        )}

        {phase.kind === 'register' && (
          <form onSubmit={onRegister} className="space-y-3">
            <p className="text-xs text-foreground/60">
              Linking agent{' '}
              <code className="font-mono text-foreground/70">{phase.agentId.slice(0, 16)}…</code>
            </p>
            <input
              required
              placeholder="Display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm text-foreground focus:border-foreground/20 focus:outline-none"
            />
            <input
              placeholder="Alias (optional)"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              className="w-full rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm text-foreground focus:border-foreground/20 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password (optional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm text-foreground focus:border-foreground/20 focus:outline-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-foreground px-4 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90 active:scale-[0.98] disabled:opacity-50"
            >
              {submitting ? 'Creating account…' : 'Create account & link →'}
            </button>
          </form>
        )}

        {phase.kind === 'bind-confirm' && (
          <form onSubmit={onBind} className="space-y-3">
            <p className="text-sm text-foreground/70">
              Link agent{' '}
              <code className="font-mono text-foreground/70">{phase.agentId.slice(0, 16)}…</code>{' '}
              to your account?
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-foreground px-4 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90 active:scale-[0.98] disabled:opacity-50"
            >
              {submitting ? 'Linking…' : 'Link agent →'}
            </button>
          </form>
        )}

        {phase.kind === 'password' && (
          <form onSubmit={onPasswordLogin} className="space-y-3">
            <input
              required
              autoFocus
              placeholder="Alias"
              value={pwAlias}
              onChange={(e) => setPwAlias(e.target.value)}
              className="w-full rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm text-foreground focus:border-foreground/20 focus:outline-none"
            />
            <input
              required
              type="password"
              placeholder="Password"
              value={pwPassword}
              onChange={(e) => setPwPassword(e.target.value)}
              className="w-full rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm text-foreground focus:border-foreground/20 focus:outline-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-foreground px-4 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90 active:scale-[0.98] disabled:opacity-50"
            >
              {submitting ? 'Logging in…' : 'Log in →'}
            </button>
            <p className="text-xs text-foreground/40">
              Forgot password? Run{' '}
              <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-foreground/60">
                rip operator-link
              </code>{' '}
              for a code.
            </p>
            <button
              type="button"
              onClick={() => setPhase({ kind: 'idle' })}
              className="text-xs text-foreground/50 hover:text-foreground/80"
            >
              ← Back to code login
            </button>
          </form>
        )}

        {(phase.kind === 'idle' || phase.kind === 'verifying') && (
          <>
            <div className="flex items-center gap-3 text-xs text-foreground/30">
              <div className="h-px flex-1 bg-foreground/10" />
              or
              <div className="h-px flex-1 bg-foreground/10" />
            </div>
            <button
              type="button"
              onClick={() => {
                setPhase({ kind: 'password' });
                setError(null);
              }}
              className="w-full text-sm text-foreground/60 underline-offset-4 hover:text-foreground/90 hover:underline"
            >
              Log in with password
            </button>
          </>
        )}

        <a
          href="/"
          className="mt-8 block text-center text-xs font-mono text-foreground/40 transition-colors hover:text-foreground/60"
        >
          Don't have an agent yet? Get started →
        </a>
      </div>
    </div>
  );
}
```

**Step 2: Commit (component is not yet wired to a route — safe to commit)**

```bash
git add apps/frontend/src/components/LoginPage.tsx
git commit -m "feat(frontend): LoginPage component — short-code-first operator entry"
```

> **Manual verification deferred** until Task 8 exposes the route.

---

## Task 8: Frontend — `/login` route with validateSearch + beforeLoad

**Files:**
- Create: `apps/frontend/src/app/login.tsx`

**Step 1: Create the route file**

```tsx
import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginPage } from '@/components/LoginPage';
import { hasSession } from '@/lib/session';
import { sanitizeNext } from '@/lib/redirect';

export const Route = createFileRoute('/login')({
  head: () => ({
    meta: [
      { title: 'Log in — Tokenrip' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    code: typeof search.code === 'string' ? search.code : undefined,
    next: typeof search.next === 'string' ? search.next : undefined,
  }),
  beforeLoad: ({ search }) => {
    if (typeof window === 'undefined') return;
    if (hasSession()) {
      throw redirect({ to: sanitizeNext(search.next) });
    }
  },
  component: LoginRoute,
});

function LoginRoute() {
  const { code, next } = Route.useSearch();
  return <LoginPage initialCode={code} next={next} />;
}
```

**Step 2: Dev-run and verify manually**

```bash
cd /Users/si/projects/maxi/tokenrip/apps/frontend && bun run dev
```

Visit `http://localhost:3333/login`. Confirm:
- Form renders with eyebrow, headline, and 6-digit input.
- `- - - - - -` placeholder visible when empty.
- Typing digits advances; non-digits filtered.
- 6th digit triggers auto-verify (check DevTools → Network → `auth/link-code/verify`).
- With an already-bound agent's code: session token ends up in `localStorage['session_token']` and URL becomes `/operator`.
- Visiting `/login` with a session already in localStorage: redirects immediately (no flash).
- Visiting `/login?next=/operator/contacts`: after login lands on `/operator/contacts`.
- Visiting `/login?next=//evil.com`: lands on `/operator` instead.

**Step 3: Commit**

```bash
git add apps/frontend/src/app/login.tsx
git commit -m "feat(frontend): /login route with search params and pre-auth redirect"
```

---

## Task 9: Frontend — convert `/link` to redirect

**Files:**
- Modify: `apps/frontend/src/app/link.tsx`

**Step 1: Replace contents**

```tsx
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/link')({
  validateSearch: (search: Record<string, unknown>) => ({
    code: typeof search.code === 'string' ? search.code : undefined,
  }),
  beforeLoad: ({ search }) => {
    throw redirect({ to: '/login', search: { code: search.code } });
  },
});
```

**Step 2: Verify**

Visit `/link` → redirects to `/login`. Visit `/link?code=123456` → redirects to `/login?code=123456` with auto-verify firing.

**Step 3: Commit**

```bash
git add apps/frontend/src/app/link.tsx
git commit -m "refactor(frontend): /link redirects to /login

Preserves printed CLI output (rip operator-link prints tokenrip.com/link)
while consolidating on /login as the canonical entry."
```

---

## Task 10: Frontend — header "Log in" link

**Files:**
- Modify: `apps/frontend/src/app/__root.tsx`

**Step 1: Add a new `HeaderLoginLink` component near `HeaderCta` (~line 61)**

```tsx
function HeaderLoginLink() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (
    pathname.startsWith('/s/') ||
    pathname.startsWith('/operator') ||
    pathname === '/login'
  ) {
    return null;
  }
  return (
    <a
      href="/login"
      className="text-sm text-foreground/50 transition-colors hover:text-foreground/80"
    >
      Log in
    </a>
  );
}
```

**Step 2: Insert it into the header nav container**

Inside `<div className="flex items-center gap-6">` (~line 138), between `<HeaderNav />` and `<ThemeToggle />`:

```tsx
<HeaderNav />
<HeaderLoginLink />
<HeaderCta />
<ThemeToggle />
```

**Step 3: Verify**

- `/` → "Log in" visible in header.
- `/login` → hidden (avoid a self-link).
- `/operator` → hidden (already logged in).
- `/s/abc` → hidden (share pages stay marketing-clean).

**Step 4: Commit**

```bash
git add apps/frontend/src/app/__root.tsx
git commit -m "feat(frontend): header 'Log in' link to /login"
```

---

## Task 11: Frontend — homepage hero CTA

**Files:**
- Modify: `apps/frontend/src/app/index.tsx`

**Step 1: In `CtaSection`, add an "Open dashboard →" link next to the GitHub link**

Existing structure around line 270-278 has a single `<div className="mt-4">` with the GitHub anchor. Replace with:

```tsx
<div className="mt-4 flex items-center gap-6">
  <a
    href="/login"
    className="font-mono text-sm text-foreground/40 transition-colors hover:text-foreground/60"
  >
    Open dashboard →
  </a>
  <a
    href="https://github.com/tokenrip/tokenrip-cli"
    target="_blank"
    rel="noopener noreferrer"
    className="font-mono text-sm text-foreground/40 transition-colors hover:text-foreground/60"
  >
    GitHub →
  </a>
</div>
```

**Step 2: Verify**

- `/` → both links visible side-by-side, "Open dashboard →" routes to `/login`.

**Step 3: Commit**

```bash
git add apps/frontend/src/app/index.tsx
git commit -m "feat(frontend): homepage CTA to the operator dashboard"
```

---

## Task 12: Cleanup — delete legacy `LinkPage.tsx`

**Files:**
- Delete: `apps/frontend/src/components/LinkPage.tsx`

**Step 1: Confirm no other imports**

```bash
cd /Users/si/projects/maxi/tokenrip && grep -R "LinkPage" apps/frontend/src
```

Expected: only `src/components/LinkPage.tsx` itself (after Task 9 removed the import from `app/link.tsx`).

**Step 2: Delete**

```bash
git rm apps/frontend/src/components/LinkPage.tsx
```

**Step 3: Commit**

```bash
git commit -m "chore(frontend): remove legacy LinkPage; /login supersedes it"
```

---

## Task 13: End-to-end manual verification

**Files:** none (manual).

Run backend and frontend in separate terminals:
```bash
# Terminal 1
cd /Users/si/projects/maxi/tokenrip/apps/backend && bun run start:dev
# Terminal 2
cd /Users/si/projects/maxi/tokenrip/apps/frontend && bun run dev
```

Walk through every branch:

1. **Fresh user, first link.** Register an agent with `rip auth register`. Run `rip operator-link`. Copy the 6-digit code.
2. In an incognito window, visit `/login`. Paste code. Expected: registration form appears. Submit with display name. Expected: redirect to `/operator`.
3. **Returning operator (passwordless via code).** Log out (clear `localStorage['session_token']`). Run `rip operator-link` again. Paste the new code on `/login`. Expected: no form — immediate redirect to `/operator` with a fresh session.
4. **Logged-in + new agent binding.** Stay logged in. `rip auth register` a second agent. `rip operator-link` for that new agent. Paste on `/login`. Expected: bind-confirm view. Confirm → `/operator`.
5. **Logged-in + already-owned agent.** Stay logged in. Run `rip operator-link` for an already-bound agent. Paste on `/login`. Expected: immediate redirect to `/operator` (verify call returns `has_binding=true`, skip login call because session exists).
6. **Password login.** Click "Log in with password". Submit valid alias/password → `/operator`. Submit bad creds → inline error.
7. **Deep-link redirect.** `/login?next=/operator/contacts` → land on `/operator/contacts` after any successful flow. `/login?next=//evil.com` → land on `/operator` (guard tripped).
8. **Pre-authed bounce.** With a valid session in localStorage, visit `/login` → instant redirect, no form flash.
9. **`/link` compatibility.** Visit `/link` → 302 to `/login`. Visit `/link?code=123456` → 302 with code preserved; auto-verify fires.
10. **Header visibility.** "Log in" link visible on `/`; hidden on `/login`, `/operator`, `/s/*`.
11. **Homepage CTA.** "Open dashboard →" present on `/` next to "GitHub →"; clicks through to `/login`.
12. **Full-suite test run.**
    ```bash
    cd /Users/si/projects/maxi/tokenrip/apps/backend && bun run build
    cd /Users/si/projects/maxi/tokenrip && bun test
    ```
    Expected: everything green, no new failures elsewhere.

If anything in steps 1-11 deviates, stop and debug before step 12.

**Commit** nothing (verification-only).

---

## Task 14: Document in the changelog

**Files:**
- Modify: `tasks/changelog.md`

**Step 1: Prepend a new entry at the top**

```markdown
## 2026-04-16 — Operator login entry point

New `/login` route gives signed-out browser visitors a discoverable way into the operator dashboard. Short-code flow is primary (paste → auto-verify → branch into passwordless login, registration, or agent-binding); password fallback behind a toggle. New `POST /v0/auth/link-code/login` endpoint mints a session when a fresh short code comes from an already-bound agent — recovers the "lost password AND lost signed link" case. Existing `/link` URL now redirects to `/login` so printed CLI output keeps working.

**What changed:**
- `POST /v0/auth/link-code/login` (backend) — passwordless login via short code for bound agents
- `/login` frontend route with state machine (idle / verifying / register / bind-confirm / password)
- `/link` → `/login` redirect
- Header "Log in" link and homepage "Open dashboard →" CTA
- Removed legacy `LinkPage` component
```

**Step 2: Commit**

```bash
git add tasks/changelog.md
git commit -m "chore: log operator login entry point in changelog"
```

---

## Risks / follow-ups (not blocking)

- **Rate limiting on link-code endpoints.** Existing `/verify` has no per-IP limiter; the new `/login` inherits that posture. Follow-up: evaluate once there's production traffic.
- **CLI output copy.** `rip operator-link` still prints `tokenrip.com/link`. Redirect keeps it working; a later CLI release can switch to `tokenrip.com/login`.
- **Existing binding collision.** Logged-in user pastes a code whose agent is bound to someone else — current `bind` will surface a server error. Current frontend just displays the server message verbatim; if UX friction appears, upgrade the message.
- **SSR safety.** `beforeLoad` guards `typeof window !== 'undefined'` before reading localStorage. Add telemetry if we ever see SSR redirect loops.
