import { createFileRoute } from '@tanstack/react-router'
import { SharePageContent } from '@/components/SharePageContent'

export const Route = createFileRoute('/s/$uuid/')({
  component: SharePage,
})

function SharePage() {
  const { uuid } = Route.useParams()
  return <SharePageContent uuid={uuid} />
}
