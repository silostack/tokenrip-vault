import { useCallback, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { useSetAtom } from 'jotai'
import { messagesAtom } from '@/_jotai/thread/thread.atoms'
import { ThreadView } from './ThreadView'
import {
  fetchAssetMessages,
  fetchMessages as fetchThreadMessages,
  postMessage as postThreadMessage,
  postAssetComment,
  type ThreadMessage,
} from '@/lib/thread'

interface CommentPanelProps {
  publicId: string
  cap: string
  open: boolean
  onClose: () => void
}

export function CommentPanel({ publicId, cap, open, onClose }: CommentPanelProps) {
  const threadIdRef = useRef<string | null>(null)
  const setMessages = useSetAtom(messagesAtom)

  useEffect(() => {
    if (!open) {
      setMessages([])
      threadIdRef.current = null
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  const handleFetchMessages = useCallback(
    async (sinceSequence?: number) => {
      if (threadIdRef.current && sinceSequence != null) {
        return fetchThreadMessages(threadIdRef.current, cap, sinceSequence)
      }
      try {
        const result = await fetchAssetMessages(publicId, cap)
        if (result.thread_id) threadIdRef.current = result.thread_id
        return result.messages
      } catch {
        return []
      }
    },
    [publicId, cap],
  )

  const handleSendMessage = useCallback(
    async (body: string): Promise<ThreadMessage | void> => {
      if (threadIdRef.current) {
        return postThreadMessage(threadIdRef.current, cap, body)
      }
      const result = await postAssetComment(publicId, cap, body)
      threadIdRef.current = result.thread_id
      return result.message
    },
    [publicId, cap],
  )

  if (!open) return null

  return (
    <>
      {/* Mobile overlay backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 md:hidden"
        onClick={onClose}
      />

      {/* Panel — sidebar on desktop, bottom sheet on mobile */}
      <div
        className={`
          fixed z-50 bg-background border-foreground/10 flex flex-col
          md:right-0 md:top-0 md:h-full md:w-[380px] md:border-l
          max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:h-[80vh] max-md:rounded-t-2xl max-md:border-t
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-3">
          <h2 className="text-sm font-medium text-foreground/70">Comments</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-foreground/40 transition-colors hover:bg-foreground/10 hover:text-foreground/70"
          >
            <X size={16} />
          </button>
        </div>

        {/* Thread view */}
        <div className="flex-1 overflow-hidden">
          <ThreadView
            fetchMessages={handleFetchMessages}
            sendMessage={handleSendMessage}
            emptyText="Start a conversation"
          />
        </div>
      </div>
    </>
  )
}
