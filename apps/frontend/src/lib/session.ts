const SESSION_KEY = 'session_token'

export function setSession(token: string): void {
  localStorage.setItem(SESSION_KEY, token)
}

export function getSession(): string | null {
  return localStorage.getItem(SESSION_KEY)
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function hasSession(): boolean {
  return !!localStorage.getItem(SESSION_KEY)
}
