import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { authenticateOperator } from '@/lib/operator'
import { setSession } from '@/lib/session'

interface OperatorAuthPageProps {
  token: string
}

type AuthState =
  | { step: 'verifying' }
  | { step: 'register' }
  | { step: 'redirecting' }
  | { step: 'error'; message: string }

export function OperatorAuthPage({ token }: OperatorAuthPageProps) {
  const navigate = useNavigate()
  const [state, setState] = useState<AuthState>({ step: 'verifying' })
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    authenticateOperator({ token })
      .then((res) => {
        setSession(res.auth_token)
        setState({ step: 'redirecting' })
        navigate({ to: '/operator' })
      })
      .catch((err) => {
        const error = err.response?.data?.error
        if (error === 'REGISTRATION_REQUIRED') {
          setState({ step: 'register' })
        } else {
          const message =
            error === 'TOKEN_EXPIRED'
              ? 'This link has expired.'
              : error === 'AGENT_NOT_FOUND'
                ? 'Agent not found.'
                : err.response?.data?.message || 'Authentication failed.'
          setState({ step: 'error', message })
        }
      })
  }, [token, navigate])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = displayName.trim()
    if (!trimmed || submitting) return
    setSubmitting(true)
    try {
      const res = await authenticateOperator({
        token,
        display_name: trimmed,
        password: password || undefined,
      })
      setSession(res.auth_token)
      setState({ step: 'redirecting' })
      navigate({ to: '/operator' })
    } catch (err: any) {
      setState({
        step: 'error',
        message: err.response?.data?.message || 'Registration failed.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {state.step === 'verifying' && (
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-pulse rounded-full bg-foreground/10" />
            <p className="mt-4 text-sm text-foreground/40">
              Verifying operator link...
            </p>
          </div>
        )}

        {state.step === 'redirecting' && (
          <div className="text-center">
            <p className="text-sm text-foreground/40">
              Welcome back. Redirecting...
            </p>
          </div>
        )}

        {state.step === 'register' && (
          <div>
            <h1 className="font-mono text-lg font-bold">Set up your account</h1>
            <p className="mt-1 text-sm text-foreground/50">
              Your agent has invited you to be its operator.
            </p>
            <form onSubmit={handleRegister} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="display_name"
                  className="block text-xs font-medium text-foreground/60"
                >
                  Display name
                </label>
                <input
                  id="display_name"
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  autoFocus
                  className="mt-1 w-full rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:border-foreground/20 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-foreground/60"
                >
                  Password{' '}
                  <span className="text-foreground/30">(optional)</span>
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Optional"
                  className="mt-1 w-full rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:border-foreground/20 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={!displayName.trim() || submitting}
                className="w-full rounded-lg bg-foreground px-4 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90 active:scale-[0.98] disabled:opacity-50"
              >
                {submitting ? 'Creating account...' : 'Continue'}
              </button>
            </form>
          </div>
        )}

        {state.step === 'error' && (
          <div className="text-center">
            <p className="text-sm text-status-error">{state.message}</p>
            <p className="mt-3 text-xs text-foreground/40">
              Run{' '}
              <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-foreground/60">
                tokenrip operator-link --human
              </code>{' '}
              to get a new link.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
