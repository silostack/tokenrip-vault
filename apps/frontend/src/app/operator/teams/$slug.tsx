import { createFileRoute } from '@tanstack/react-router'
import { TeamDetail } from '@/components/operator/TeamDetail'

export const Route = createFileRoute('/operator/teams/$slug')({
  component: () => {
    const { slug } = Route.useParams()
    return <TeamDetail slug={slug} />
  },
})
