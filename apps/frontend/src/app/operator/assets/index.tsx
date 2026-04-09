import { createFileRoute } from '@tanstack/react-router'
import { OperatorAssetList } from '@/components/operator/OperatorAssetList'

export const Route = createFileRoute('/operator/assets/')({
  component: OperatorAssetsPage,
})

function OperatorAssetsPage() {
  return <OperatorAssetList />
}
