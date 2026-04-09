const SESSION_COOKIE = 'session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export function setSession(token: string): void {
  document.cookie = `${SESSION_COOKIE}=${token};path=/;max-age=${SESSION_MAX_AGE};SameSite=Lax`
}

export function clearSession(): void {
  document.cookie = `${SESSION_COOKIE}=;path=/;max-age=0`
}

export function hasSession(): boolean {
  return document.cookie.split(';').some((c) => c.trim().startsWith(`${SESSION_COOKIE}=`))
}
