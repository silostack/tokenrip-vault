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
