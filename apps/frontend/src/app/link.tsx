import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/link')({
  validateSearch: (search: Record<string, unknown>) => {
    const raw = search.code;
    return {
      code:
        typeof raw === 'string' ? raw : typeof raw === 'number' ? String(raw) : undefined,
    };
  },
  beforeLoad: ({ search }) => {
    throw redirect({ to: '/login', search: { code: search.code } });
  },
});
