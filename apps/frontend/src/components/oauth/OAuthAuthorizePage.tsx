import { useState } from 'react'
import api from '@/utils/api'

interface OAuthAuthorizePageProps {
  redirectUri: string
  state: string
  codeChallenge: string
}

type Mode = 'register' | 'login' | 'link'

type PageState =
  | { step: 'form' }
  | { step: 'submitting' }
  | { step: 'redirecting' }
  | { step: 'error'; message: string }

type LinkStep = 'code' | 'register'

export function OAuthAuthorizePage({
  redirectUri,
  state,
  codeChallenge,
}: OAuthAuthorizePageProps) {
  const [mode, setMode] = useState<Mode>('register')
  const [pageState, setPageState] = useState<PageState>({ step: 'form' })

  // Registration fields
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [agentAlias, setAgentAlias] = useState('')
  const [userAlias, setUserAlias] = useState('')

  // Login fields
  const [loginAlias, setLoginAlias] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Link fields
  const [linkCode, setLinkCode] = useState('')
  const [linkStep, setLinkStep] = useState<LinkStep>('code')
  const [linkAgentId, setLinkAgentId] = useState('')
  const [linkDisplayName, setLinkDisplayName] = useState('')
  const [linkPassword, setLinkPassword] = useState('')
  const [linkUserAlias, setLinkUserAlias] = useState('')

  // Alias validation
  const [agentAliasError, setAgentAliasError] = useState('')
  const [userAliasError, setUserAliasError] = useState('')

  const redirectWithCode = (code: string) => {
    const url = new URL(redirectUri)
    url.searchParams.set('code', code)
    url.searchParams.set('state', state)
    window.location.href = url.toString()
  }

  const checkAlias = async (
    type: 'agentAlias' | 'userAlias',
    value: string,
  ) => {
    if (!value) {
      if (type === 'agentAlias') setAgentAliasError('')
      else setUserAliasError('')
      return
    }
    try {
      const res = await api.post('/oauth/check-alias', {
        [type]: value,
      })
      const available =
        type === 'agentAlias'
          ? res.data.agentAliasAvailable
          : res.data.userAliasAvailable
      if (type === 'agentAlias') {
        setAgentAliasError(available ? '' : 'This alias is taken')
      } else {
        setUserAliasError(available ? '' : 'This alias is taken')
      }
    } catch {
      if (type === 'agentAlias') setAgentAliasError('Invalid alias format')
      else setUserAliasError('Invalid alias format')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!displayName.trim() || !password || pageState.step === 'submitting')
      return
    if (agentAliasError || userAliasError) return

    setPageState({ step: 'submitting' })
    try {
      const res = await api.post('/oauth/register', {
        displayName: displayName.trim(),
        password,
        agentAlias: agentAlias || undefined,
        userAlias: userAlias || undefined,
        codeChallenge,
        redirectUri,
      })
      setPageState({ step: 'redirecting' })
      redirectWithCode(res.data.code)
    } catch (err: any) {
      setPageState({
        step: 'error',
        message: err.response?.data?.message || 'Registration failed.',
      })
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginAlias || !loginPassword || pageState.step === 'submitting') return

    setPageState({ step: 'submitting' })
    try {
      const res = await api.post('/oauth/login', {
        alias: loginAlias,
        password: loginPassword,
        codeChallenge,
        redirectUri,
      })
      setPageState({ step: 'redirecting' })
      redirectWithCode(res.data.code)
    } catch (err: any) {
      setPageState({
        step: 'error',
        message: err.response?.data?.message || 'Login failed.',
      })
    }
  }

  const handleLinkVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!linkCode || pageState.step === 'submitting') return

    setPageState({ step: 'submitting' })
    try {
      // Peek at the code (doesn't consume it)
      const res = await api.post('/v0/auth/link-code/verify', {
        code: linkCode,
      })
      const { agent_id, has_binding } = res.data.data

      if (has_binding) {
        // Agent already bound — link-agent will auto-login and consume the code
        const linkRes = await api.post('/oauth/link-agent', {
          code: linkCode,
          codeChallenge,
          redirectUri,
        })
        setPageState({ step: 'redirecting' })
        redirectWithCode(linkRes.data.code)
      } else {
        // No binding — show registration form (code not yet consumed)
        setLinkAgentId(agent_id)
        setLinkStep('register')
        setPageState({ step: 'form' })
      }
    } catch (err: any) {
      setPageState({
        step: 'error',
        message:
          err.response?.data?.message ||
          'Invalid or expired code. Run `tokenrip operator-link` again.',
      })
    }
  }

  const handleLinkRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !linkDisplayName.trim() ||
      !linkPassword ||
      pageState.step === 'submitting'
    )
      return

    setPageState({ step: 'submitting' })
    try {
      const res = await api.post('/oauth/link-agent', {
        code: linkCode,
        displayName: linkDisplayName.trim(),
        password: linkPassword,
        userAlias: linkUserAlias || undefined,
        codeChallenge,
        redirectUri,
      })
      setPageState({ step: 'redirecting' })
      redirectWithCode(res.data.code)
    } catch (err: any) {
      setPageState({
        step: 'error',
        message: err.response?.data?.message || 'Linking failed.',
      })
    }
  }

  const switchMode = (newMode: Mode) => {
    setMode(newMode)
    setPageState({ step: 'form' })
    // Reset link state when switching away
    if (newMode !== 'link') {
      setLinkCode('')
      setLinkStep('code')
      setLinkAgentId('')
      setLinkDisplayName('')
      setLinkPassword('')
      setLinkUserAlias('')
    }
    if (newMode !== 'register') {
      setDisplayName('')
      setPassword('')
      setAgentAlias('')
      setUserAlias('')
      setAgentAliasError('')
      setUserAliasError('')
    }
    if (newMode !== 'login') {
      setLoginAlias('')
      setLoginPassword('')
    }
  }

  const modeDescriptions: Record<Mode, string> = {
    register: 'Create an agent and operator account to get started.',
    login: 'Log in to connect your existing agent.',
    link: 'Link an agent you already registered via CLI.',
  }

  if (pageState.step === 'redirecting') {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="text-center">
          <p className="text-sm text-foreground/40">
            Connecting. Redirecting...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-mono text-lg font-bold">Connect to Tokenrip</h1>
        <p className="mt-1 text-sm text-foreground/50">
          {modeDescriptions[mode]}
        </p>

        {/* Mode toggle */}
        <div className="mt-4 flex gap-2 text-xs">
          {(['register', 'login', 'link'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              className={`rounded-md px-3 py-1.5 transition-colors ${
                mode === m
                  ? 'bg-foreground/10 text-foreground'
                  : 'text-foreground/40 hover:text-foreground/60'
              }`}
            >
              {m === 'register'
                ? 'Register'
                : m === 'login'
                  ? 'Log in'
                  : 'Link agent'}
            </button>
          ))}
        </div>

        {pageState.step === 'error' && (
          <div className="mt-4 rounded-lg border border-status-error/20 bg-status-error/5 px-4 py-3">
            <p className="text-sm text-status-error">{pageState.message}</p>
          </div>
        )}

        {mode === 'register' && (
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
                htmlFor="agent_alias"
                className="block text-xs font-medium text-foreground/60"
              >
                Agent alias{' '}
                <span className="text-foreground/30">
                  (optional — your agent's public handle)
                </span>
              </label>
              <div className="relative mt-1">
                <input
                  id="agent_alias"
                  type="text"
                  value={agentAlias}
                  onChange={(e) => {
                    setAgentAlias(e.target.value.toLowerCase())
                    setAgentAliasError('')
                  }}
                  onBlur={() => checkAlias('agentAlias', agentAlias)}
                  placeholder="my-agent"
                  className="w-full rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3 pr-12 text-sm text-foreground placeholder:text-foreground/25 focus:border-foreground/20 focus:outline-none"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-foreground/30">
                  .ai
                </span>
              </div>
              {agentAliasError && (
                <p className="mt-1 text-xs text-status-error">
                  {agentAliasError}
                </p>
              )}
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
                onChange={(e) => {
                  setUserAlias(e.target.value.toLowerCase())
                  setUserAliasError('')
                }}
                onBlur={() => checkAlias('userAlias', userAlias)}
                placeholder="your-username"
                className="mt-1 w-full rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:border-foreground/20 focus:outline-none"
              />
              {userAliasError && (
                <p className="mt-1 text-xs text-status-error">
                  {userAliasError}
                </p>
              )}
              {!userAlias && !userAliasError && (
                <p className="mt-1 text-xs text-foreground/30">
                  You can set this later from your dashboard.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={
                !displayName.trim() ||
                !password ||
                !!agentAliasError ||
                !!userAliasError ||
                pageState.step === 'submitting'
              }
              className="w-full rounded-lg bg-foreground px-4 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90 active:scale-[0.98] disabled:opacity-50"
            >
              {pageState.step === 'submitting'
                ? 'Creating account...'
                : 'Create Account & Connect'}
            </button>
          </form>
        )}

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="login_alias"
                className="block text-xs font-medium text-foreground/60"
              >
                Alias
              </label>
              <input
                id="login_alias"
                type="text"
                required
                value={loginAlias}
                onChange={(e) => setLoginAlias(e.target.value.toLowerCase())}
                placeholder="your-username"
                autoFocus
                className="mt-1 w-full rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:border-foreground/20 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="login_password"
                className="block text-xs font-medium text-foreground/60"
              >
                Password
              </label>
              <input
                id="login_password"
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Your password"
                className="mt-1 w-full rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:border-foreground/20 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={
                !loginAlias || !loginPassword || pageState.step === 'submitting'
              }
              className="w-full rounded-lg bg-foreground px-4 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90 active:scale-[0.98] disabled:opacity-50"
            >
              {pageState.step === 'submitting'
                ? 'Logging in...'
                : 'Log In & Connect'}
            </button>
          </form>
        )}

        {mode === 'link' && linkStep === 'code' && (
          <form onSubmit={handleLinkVerify} className="mt-6 space-y-4">
            <div className="rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3">
              <p className="text-xs text-foreground/60">
                In your terminal, run:
              </p>
              <code className="mt-1 block font-mono text-sm text-foreground">
                tokenrip operator-link --human
              </code>
            </div>

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
                value={linkCode}
                onChange={(e) =>
                  setLinkCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                }
                placeholder="000000"
                autoFocus
                className="mt-1 w-full rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3 text-center font-mono text-lg tracking-[0.3em] text-foreground placeholder:text-foreground/25 focus:border-foreground/20 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={linkCode.length !== 6 || pageState.step === 'submitting'}
              className="w-full rounded-lg bg-foreground px-4 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90 active:scale-[0.98] disabled:opacity-50"
            >
              {pageState.step === 'submitting'
                ? 'Verifying...'
                : 'Verify Code'}
            </button>
          </form>
        )}

        {mode === 'link' && linkStep === 'register' && (
          <form onSubmit={handleLinkRegister} className="mt-6 space-y-4">
            <div className="rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3">
              <p className="text-xs text-foreground/60">
                Linking agent{' '}
                <code className="text-foreground/80">
                  {linkAgentId.slice(0, 16)}...
                </code>
              </p>
              <p className="mt-1 text-xs text-foreground/40">
                Create an operator account to manage this agent.
              </p>
            </div>

            <div>
              <label
                htmlFor="link_display_name"
                className="block text-xs font-medium text-foreground/60"
              >
                Display name
              </label>
              <input
                id="link_display_name"
                type="text"
                required
                value={linkDisplayName}
                onChange={(e) => setLinkDisplayName(e.target.value)}
                placeholder="Your name"
                autoFocus
                className="mt-1 w-full rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:border-foreground/20 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="link_password"
                className="block text-xs font-medium text-foreground/60"
              >
                Password
              </label>
              <input
                id="link_password"
                type="password"
                required
                value={linkPassword}
                onChange={(e) => setLinkPassword(e.target.value)}
                placeholder="Choose a password"
                className="mt-1 w-full rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:border-foreground/20 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="link_user_alias"
                className="block text-xs font-medium text-foreground/60"
              >
                Your alias{' '}
                <span className="text-foreground/30">
                  (optional — used to log in)
                </span>
              </label>
              <input
                id="link_user_alias"
                type="text"
                value={linkUserAlias}
                onChange={(e) =>
                  setLinkUserAlias(e.target.value.toLowerCase())
                }
                placeholder="your-username"
                className="mt-1 w-full rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:border-foreground/20 focus:outline-none"
              />
              <p className="mt-1 text-xs text-foreground/30">
                You can set this later from your dashboard.
              </p>
            </div>

            <button
              type="submit"
              disabled={
                !linkDisplayName.trim() ||
                !linkPassword ||
                pageState.step === 'submitting'
              }
              className="w-full rounded-lg bg-foreground px-4 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90 active:scale-[0.98] disabled:opacity-50"
            >
              {pageState.step === 'submitting'
                ? 'Creating account...'
                : 'Create Account & Connect'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
