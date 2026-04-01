import { createFileRoute } from '@tanstack/react-router'
import { SharePageContent } from '@/components/SharePageContent'

export const Route = createFileRoute('/s/$uuid/$versionId')({
  component: ShareVersionPage,
})

function ShareVersionPage() {
  const { uuid, versionId } = Route.useParams()
  return <SharePageContent uuid={uuid} versionId={versionId} />
}
