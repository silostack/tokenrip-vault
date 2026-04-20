import { createFileRoute } from '@tanstack/react-router'
import { TeamList } from '@/components/operator/TeamList'

export const Route = createFileRoute('/operator/teams/')({
  component: TeamList,
})
