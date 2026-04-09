import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router'
import { OperatorShell } from '@/components/operator/OperatorShell'

export const Route = createFileRoute('/operator')({
  component: OperatorLayout,
})

function OperatorLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  if (pathname === '/operator/auth') {
    return <Outlet />
  }

  return (
    <OperatorShell>
      <Outlet />
    </OperatorShell>
  )
}
