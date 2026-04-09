import { useEffect, useRef, useCallback, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { MessageSquare } from 'lucide-react'
import { toast } from 'react-toastify'
import { messagesAtom, isLoadingMessagesAtom } from '@/_jotai/thread/thread.atoms'
import { MessageBubble } from './MessageBubble'
import { MessageComposer } from './MessageComposer'
import type { ThreadMessage } from '@/lib/thread'

const POLL_INTERVAL = 30_000
const GROUP_GAP_SECONDS = 300

interface ThreadViewProps {
  fetchMessages: (sinceSequence?: number) => Promise<ThreadMessage[]>
  sendMessage: (body: string) => Promise<ThreadMessage | void>
  emptyText?: string
  disabled?: boolean
}

function getSenderId(sender: { agent_id?: string; user_id?: string }): string {
  return sender.agent_id || sender.user_id || 'anon'
}

function computeGroups(messages: ThreadMessage[]) {
  return messages.map((msg, i) => {
    const prev = messages[i - 1]
    const next = messages[i + 1]

    const sameAsPrev = prev && getSenderId(prev.sender) === getSenderId(msg.sender)
    const sameAsNext = next && getSenderId(next.sender) === getSenderId(msg.sender)

    const gapFromPrev = prev
      ? (new Date(msg.created_at).getTime() - new Date(prev.created_at).getTime()) / 1000
      : Infinity
    const gapToNext = next
      ? (new Date(next.created_at).getTime() - new Date(msg.created_at).getTime()) / 1000
      : Infinity

    return {
      message: msg,
      isFirstInGroup: !sameAsPrev || gapFromPrev > GROUP_GAP_SECONDS,
      isLastInGroup: !sameAsNext || gapToNext > GROUP_GAP_SECONDS,
    }
  })
}

export function ThreadView({ fetchMessages, sendMessage, emptyText, disabled }: ThreadViewProps) {
  const messages = useAtomValue(messagesAtom)
  const isLoading = useAtomValue(isLoadingMessagesAtom)
  const setMessages = useSetAtom(messagesAtom)
  const setIsLoading = useSetAtom(isLoadingMessagesAtom)
  const bottomRef = useRef<HTMLDivElement>(null)
  const lastSeqRef = useRef<number | undefined>(undefined)
  const [initialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    lastSeqRef.current = messages.length > 0 ? messages[messages.length - 1].sequence : undefined
  }, [messages])

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: initialLoad ? 'auto' : 'smooth' })
  }, [initialLoad])

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    fetchMessages()
      .then((msgs) => {
        if (cancelled) return
        setMessages(msgs)
        setIsLoading(false)
        setInitialLoad(false)
      })
      .catch(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [fetchMessages])

  useEffect(() => {
    scrollToBottom()
  }, [messages.length, scrollToBottom])

  useEffect(() => {
    const interval = setInterval(async () => {
      if (document.hidden) return
      try {
        const newMsgs = await fetchMessages(lastSeqRef.current)
        if (newMsgs.length > 0) {
          setMessages((prev) => [...prev, ...newMsgs])
        }
      } catch {
        // silent poll failure
      }
    }, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchMessages])

  const handleSend = useCallback(
    async (body: string) => {
      try {
        const sent = await sendMessage(body)
        if (sent) {
          setMessages((prev) => [...prev, sent])
        } else {
          const newMsgs = await fetchMessages(lastSeqRef.current)
          if (newMsgs.length > 0) {
            setMessages((prev) => [...prev, ...newMsgs])
          }
        }
      } catch {
        toast.error('Failed to send message')
      }
    },
    [sendMessage, fetchMessages],
  )

  const grouped = computeGroups(messages)

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        {isLoading && messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="h-8 w-8 animate-pulse rounded-full bg-foreground/5" />
            <p className="mt-3 text-xs text-foreground/25">Loading messages\u2026</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground/5">
              <MessageSquare size={18} className="text-foreground/15" />
            </div>
            <p className="mt-3 text-sm font-medium text-foreground/30">
              {emptyText || 'No messages yet'}
            </p>
            <p className="mt-1 text-[11px] text-foreground/20">Messages will appear here</p>
          </div>
        ) : (
          <div className="flex flex-col py-2">
            {grouped.map((item) => (
              <MessageBubble
                key={item.message.id}
                message={item.message}
                isFirstInGroup={item.isFirstInGroup}
                isLastInGroup={item.isLastInGroup}
              />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
      {!disabled && <MessageComposer onSend={handleSend} />}
    </div>
  )
}
