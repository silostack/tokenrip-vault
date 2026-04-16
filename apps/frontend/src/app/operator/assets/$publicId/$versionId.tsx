import { createFileRoute } from '@tanstack/react-router'
import { OperatorAssetDetail } from '@/components/operator/OperatorAssetDetail'

export const Route = createFileRoute('/operator/assets/$publicId/$versionId')({
  component: OperatorAssetVersionPage,
})

function OperatorAssetVersionPage() {
  const { publicId, versionId } = Route.useParams()
  return <OperatorAssetDetail publicId={publicId} versionId={versionId} />
}
