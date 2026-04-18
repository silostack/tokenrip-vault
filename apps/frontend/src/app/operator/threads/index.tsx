import { createFileRoute } from '@tanstack/react-router'
import { OperatorThreadList } from '@/components/operator/OperatorThreadList'

export const Route = createFileRoute('/operator/threads/')({
  component: OperatorThreadsPage,
})

function OperatorThreadsPage() {
  return <OperatorThreadList />
}
