import { createFileRoute } from '@tanstack/react-router'
import { OperatorAuthPage } from '@/components/operator/OperatorAuthPage'

export const Route = createFileRoute('/operator/auth')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) || '',
  }),
  component: OperatorAuthRoute,
})

function OperatorAuthRoute() {
  const { token } = Route.useSearch()

  if (!token) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="text-center">
          <p className="text-sm text-foreground/50">No operator token provided.</p>
          <p className="mt-2 text-xs text-foreground/30">
            Run{' '}
            <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-foreground/60">
              tokenrip operator-link
            </code>{' '}
            to get a login link.
          </p>
        </div>
      </div>
    )
  }

  return <OperatorAuthPage token={token} />
}
