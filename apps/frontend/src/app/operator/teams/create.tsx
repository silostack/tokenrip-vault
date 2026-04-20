import { createFileRoute } from '@tanstack/react-router'
import { TeamCreateForm } from '@/components/operator/TeamCreateForm'

export const Route = createFileRoute('/operator/teams/create')({
  component: TeamCreateForm,
})
