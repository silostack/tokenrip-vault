import { createFileRoute } from '@tanstack/react-router'
import { OperatorAssetDetail } from '@/components/operator/OperatorAssetDetail'

export const Route = createFileRoute('/operator/assets/$publicId/')({
  component: OperatorAssetDetailPage,
})

function OperatorAssetDetailPage() {
  const { publicId } = Route.useParams()
  return <OperatorAssetDetail publicId={publicId} />
}
