import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/operator/assets/$publicId')({
  component: OperatorAssetLayout,
})

function OperatorAssetLayout() {
  return <Outlet />
}
