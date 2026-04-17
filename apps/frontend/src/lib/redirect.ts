const DEFAULT_POST_LOGIN = '/operator';

export function sanitizeNext(next?: string | null, fallback: string = DEFAULT_POST_LOGIN): string {
  if (!next || !next.startsWith('/')) return fallback;
  if (next.startsWith('//') || next.startsWith('/\\')) return fallback;
  return next;
}
