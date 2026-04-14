import { useState } from 'react'
import api from '@/utils/api'
import { hasSession, setSession } from '@/lib/session'

type Step = 'code' | 'register' | 'confirm' | 'done' | 'already-linked'

export function LinkPage() {
  const [step, setStep] = useState<Step>('code')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Code input
  const [code, setCode] = useState('')

  // Agent info from peek
  const [agentId, setAgentId] = useState('')

  // Registration fields
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [userAlias, setUserAlias] = useState('')

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code || submitting) return

    setSubmitting(true)
    setError('')
    try {
      const res = await api.post('/v0/auth/link-code/verify', { code })
      const { agent_id, has_binding } = res.data.data
      setAgentId(agent_id)

      if (has_binding) {
        setStep('already-linked')
      } else if (hasSession()) {
        setStep('confirm')
      } else {
        setStep('register')
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Invalid or expired code. Run `tokenrip operator-link` again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirmBind = async () => {
    if (submitting) return
    setSubmitting(true)
    setError('')
    try {
      await api.post('/v0/auth/link-code/bind', { code })
      setStep('done')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to link agent.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!displayName.trim() || !password || submitting) return

    setSubmitting(true)
    setError('')
    try {
      const res = await api.post('/v0/auth/link-code/register', {
        code,
        displayName: displayName.trim(),
        password,
        alias: userAlias || undefined,
      })
      setSession(res.data.data.auth_token)
      setStep('done')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-mono text-lg font-bold">Link Agent</h1>
        <p className="mt-1 text-sm text-foreground/50">
          Enter the code from <code className="text-foreground/70">tokenrip operator-link</code> to bind your agent to your account.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-status-error/20 bg-status-error/5 px-4 py-3">
            <p className="text-sm text-status-error">{error}</p>
          </div>
        )}

        {step === 'code' && (
          <form onSubmit={handleVerify} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="link_code"
                className="block text-xs font-medium text-foreground/60"
              >
                6-digit link code
              </label>
              <input
                id="link_code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                }
                placeholder="000000"
                autoFocus
                className="mt-1 w-full rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3 text-center font-mono text-lg tracking-[0.3em] text-foreground placeholder:text-foreground/25 focus:border-foreground/20 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={code.length !== 6 || submitting}
              className="w-full rounded-lg bg-foreground px-4 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90 active:scale-[0.98] disabled:opacity-50"
            >
              {submitting ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
        )}

        {step === 'confirm' && (
          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3">
              <p className="text-xs text-foreground/60">
                Link agent{' '}
                <code className="text-foreground/80">
                  {agentId.slice(0, 16)}...
                </code>{' '}
                to your account?
              </p>
            </div>
            <button
              onClick={handleConfirmBind}
              disabled={submitting}
              className="w-full rounded-lg bg-foreground px-4 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90 active:scale-[0.98] disabled:opacity-50"
            >
              {submitting ? 'Linking...' : 'Link Agent'}
            </button>
          </div>
        )}

        {step === 'register' && (
          <form onSubmit={handleRegister} className="mt-6 space-y-4">
            <div className="rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3">
              <p className="text-xs text-foreground/60">
                Linking agent{' '}
                <code className="text-foreground/80">
                  {agentId.slice(0, 16)}...
                </code>
              </p>
              <p className="mt-1 text-xs text-foreground/40">
                Create an account to manage this agent.
              </p>
            </div>

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
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a password"
                className="mt-1 w-full rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:border-foreground/20 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="user_alias"
                className="block text-xs font-medium text-foreground/60"
              >
                Your alias{' '}
                <span className="text-foreground/30">
                  (optional — used to log in)
                </span>
              </label>
              <input
                id="user_alias"
                type="text"
                value={userAlias}
                onChange={(e) => setUserAlias(e.target.value.toLowerCase())}
                placeholder="your-username"
                className="mt-1 w-full rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:border-foreground/20 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={
                !displayName.trim() || !password || submitting
              }
              className="w-full rounded-lg bg-foreground px-4 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90 active:scale-[0.98] disabled:opacity-50"
            >
              {submitting ? 'Creating account...' : 'Create Account & Link'}
            </button>
          </form>
        )}

        {step === 'done' && (
          <div className="mt-6 rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-4 text-center">
            <p className="text-sm font-medium text-foreground">
              Agent linked successfully.
            </p>
            <p className="mt-2 text-xs text-foreground/40">
              You can close this page.
            </p>
          </div>
        )}

        {step === 'already-linked' && (
          <div className="mt-6 rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-4 text-center">
            <p className="text-sm text-foreground/60">
              This agent is already linked to an account.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
