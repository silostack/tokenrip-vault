import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback, useEffect } from 'react'
import { Provider } from 'jotai'
import { useAtomValue } from 'jotai'
import { EyeOff, Lock } from 'lucide-react'
import { toast } from 'react-toastify'
import { ThreadView } from '@/components/ThreadView'
import { OperatorToolbar, type ToolbarAction } from '@/components/operator/OperatorToolbar'
import { ConfirmDialog } from '@/components/operator/ConfirmDialog'
import { LinkedResources } from '@/components/operator/LinkedResources'
import { operatorAgentAtom } from '@/_jotai/operator/operator.atoms'
import {
  fetchOperatorThread,
  fetchOperatorMessages,
  postOperatorMessage,
  updateThread,
  dismissThread,
  addThreadRefs,
  removeThreadRef,
  type ThreadRef,
} from '@/lib/operator'
import type { ThreadMessage } from '@/lib/thread'

export const Route = createFileRoute('/operator/threads/$threadId')({
  component: OperatorThreadDetailPage,
})

interface ThreadMeta {
  id: string
  state: string
  owner_id: string
  created_at: string
  participants: Array<{ id: string; agent_id?: string; user_id?: string }>
  resolution: Record<string, unknown> | null
  refs: ThreadRef[]
}

function OperatorThreadDetailPage() {
  const { threadId } = Route.useParams()
  const operatorAgent = useAtomValue(operatorAgentAtom)
  const [thread, setThread] = useState<ThreadMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchOperatorThread(threadId)
      .then((data: ThreadMeta) => {
        if (cancelled) return
        setThread({ ...data, refs: data.refs ?? [] })
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setError(true)
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [threadId])

  const isClosed = thread?.state === 'closed'
  const isOwner = operatorAgent && thread ? operatorAgent.agent_id === thread.owner_id : false

  const handleDismiss = useCallback(async () => {
    try {
      await dismissThread(threadId)
      toast.success('Thread dismissed from inbox')
    } catch {
      toast.error('Failed to dismiss thread')
    }
  }, [threadId])

  const handleClose = useCallback(async () => {
    if (closing) return
    setClosing(true)
    try {
      await updateThread(threadId, { state: 'closed' })
      setThread((prev) => (prev ? { ...prev, state: 'closed' } : null))
      toast.success('Thread closed')
      setCloseConfirmOpen(false)
    } catch (err: unknown) {
      const errorCode =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : undefined
      if (errorCode === 'NOT_THREAD_OWNER') {
        toast.error('Only the thread owner can close this thread')
      } else {
        toast.error('Failed to close thread')
      }
      setCloseConfirmOpen(false)
    } finally {
      setClosing(false)
    }
  }, [threadId, closing])

  const handleFetchMessages = useCallback(
    async (sinceSequence?: number): Promise<ThreadMessage[]> => {
      return fetchOperatorMessages(threadId, sinceSequence)
    },
    [threadId],
  )

  const handleSendMessage = useCallback(
    async (body: string) => {
      return postOperatorMessage(threadId, body)
    },
    [threadId],
  )

  const handleAddRef = useCallback(
    async (ref: { type: string; target_id: string }) => {
      await addThreadRefs(threadId, [ref])
      const updated = await fetchOperatorThread(threadId)
      setThread((prev) => (prev ? { ...prev, refs: updated.refs ?? [] } : null))
    },
    [threadId],
  )

  const handleRemoveRef = useCallback(
    async (refId: string) => {
      await removeThreadRef(threadId, refId)
      setThread((prev) =>
        prev ? { ...prev, refs: prev.refs.filter((r) => r.id !== refId) } : null,
      )
    },
    [threadId],
  )

  const actions: ToolbarAction[] = [
    {
      label: 'Dismiss',
      icon: <EyeOff size={14} />,
      onClick: handleDismiss,
      primary: true,
    },
  ]

  if (isOwner && !isClosed) {
    actions.push({
      label: 'Close',
      icon: <Lock size={14} />,
      onClick: () => setCloseConfirmOpen(true),
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="h-8 w-8 animate-pulse rounded-full bg-foreground/5" />
        <p className="mt-3 text-xs text-foreground/25">Loading thread...</p>
      </div>
    )
  }

  if (error || !thread) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-foreground/35">Thread not found or access denied.</p>
      </div>
    )
  }

  return (
    <>
      <OperatorToolbar
        backTo="/operator"
        title={`Thread ${threadId.slice(0, 8)}`}
        actions={actions}
      />
      {isClosed && (
        <div className="border-b border-foreground/10 bg-foreground/[0.03] px-4 py-2.5 text-center text-xs text-foreground/40">
          This thread is closed. No new messages can be posted.
        </div>
      )}
      {thread && (thread.refs.length > 0 || !isClosed) && (
        <LinkedResources
          refs={thread.refs}
          onAdd={handleAddRef}
          onRemove={handleRemoveRef}
          disabled={isClosed}
        />
      )}
      <div className="flex h-[calc(100vh-12rem)] flex-col">
        <div className="flex-1 overflow-hidden">
          <Provider>
            <ThreadView
              fetchMessages={handleFetchMessages}
              sendMessage={handleSendMessage}
              disabled={isClosed}
            />
          </Provider>
        </div>
      </div>
      <ConfirmDialog
        open={closeConfirmOpen}
        title="Close thread"
        message="No new messages can be posted after closing. This cannot be undone."
        confirmLabel="Close"
        destructive
        onConfirm={handleClose}
        onCancel={() => {
          if (!closing) setCloseConfirmOpen(false)
        }}
      />
    </>
  )
}
