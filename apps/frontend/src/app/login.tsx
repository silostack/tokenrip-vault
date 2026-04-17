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
  validateSearch: (search: Record<string, unknown>) => {
    const rawCode = search.code;
    return {
      code:
        typeof rawCode === 'string'
          ? rawCode
          : typeof rawCode === 'number'
            ? String(rawCode)
            : undefined,
      next: typeof search.next === 'string' ? search.next : undefined,
    };
  },
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
