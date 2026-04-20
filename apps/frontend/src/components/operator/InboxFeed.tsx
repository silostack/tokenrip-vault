import { useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAtomValue, useSetAtom } from 'jotai'
import { Inbox } from 'lucide-react'
import { toast } from 'react-toastify'
import { inboxItemsAtom, inboxLoadingAtom } from '@/_jotai/operator/operator.atoms'
import { dismissThread, type InboxItem } from '@/lib/operator'
import { InboxCard } from './InboxCard'

export function InboxFeed() {
  const items = useAtomValue(inboxItemsAtom)
  const loading = useAtomValue(inboxLoadingAtom)
  const setItems = useSetAtom(inboxItemsAtom)
  const navigate = useNavigate()

  const handleDismiss = useCallback(
    async (item: InboxItem) => {
      if (item.kind !== 'thread') return
      try {
        await dismissThread(item.data.thread_id)
        setItems((prev) =>
          prev.filter(
            (i) =>
              !(
                i.kind === 'thread' &&
                i.data.thread_id === item.data.thread_id
              ),
          ),
        )
        toast.success('Thread dismissed')
      } catch {
        toast.error('Failed to dismiss thread')
        throw new Error('dismiss failed')
      }
    },
    [setItems],
  )

  const handleNavigate = useCallback(
    (item: InboxItem) => {
      if (item.kind === 'thread') {
        navigate({
          to: '/operator/threads/$threadId',
          params: { threadId: item.data.thread_id },
        })
      } else {
        navigate({
          to: '/operator/assets/$publicId',
          params: { publicId: item.data.asset_id },
        })
      }
    },
    [navigate],
  )

  if (loading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-8 w-8 animate-pulse rounded-full bg-foreground/5" />
        <p className="mt-3 font-mono text-[11px] text-foreground/25">Loading…</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Inbox size={20} strokeWidth={1.5} className="text-foreground/15" />
        <p className="mt-3 text-sm text-foreground/30">
          No new activity
        </p>
        <p className="mt-1 font-mono text-[11px] text-foreground/20">
          New messages and asset updates will appear here
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-foreground/5">
      {items.map((item) => {
        const key =
          item.kind === 'thread'
            ? `t-${item.data.thread_id}`
            : `a-${item.data.asset_id}`
        return (
          <InboxCard
            key={key}
            item={item}
            onDismiss={handleDismiss}
            onNavigate={handleNavigate}
          />
        )
      })}
    </div>
  )
}
