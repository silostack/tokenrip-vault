import { createFileRoute } from '@tanstack/react-router'
import { InboxFeed } from '@/components/operator/InboxFeed'
import { InboxFilters } from '@/components/operator/InboxFilters'
import { useInboxPolling } from '@/components/operator/useInboxPolling'

export const Route = createFileRoute('/operator/')({
  component: OperatorInboxPage,
})

function OperatorInboxPage() {
  useInboxPolling()

  return (
    <>
      <InboxFilters />
      <InboxFeed />
    </>
  )
}
