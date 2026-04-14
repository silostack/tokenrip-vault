import { createFileRoute } from '@tanstack/react-router'
import { OperatorContactList } from '@/components/operator/OperatorContactList'

export const Route = createFileRoute('/operator/contacts')({
  component: OperatorContactsPage,
})

function OperatorContactsPage() {
  return <OperatorContactList />
}
