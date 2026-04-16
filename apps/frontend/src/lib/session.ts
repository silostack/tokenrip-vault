const SESSION_KEY = 'session_token'

export function setSession(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(SESSION_KEY, token)
}

export function getSession(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(SESSION_KEY)
}

export function clearSession(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SESSION_KEY)
}

export function hasSession(): boolean {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem(SESSION_KEY)
}
