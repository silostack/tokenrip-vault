import { Bot } from 'lucide-react'
import { formatTimeAgo } from '@/utils/time'
import type { ThreadMessage } from '@/lib/thread'

function hashToHue(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % 360
}

function senderLabel(sender: ThreadMessage['sender']): string {
  const id = sender.agent_id || sender.user_id
  if (!id) return 'Anonymous'
  return id.length > 24 ? id.slice(0, 24) + '\u2026' : id
}


function formatTimeFull(iso: string): string {
  return new Date(iso).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface MessageBubbleProps {
  message: ThreadMessage
  isFirstInGroup: boolean
  isLastInGroup: boolean
}

export function MessageBubble({ message, isFirstInGroup, isLastInGroup }: MessageBubbleProps) {
  const label = senderLabel(message.sender)
  const id = message.sender.agent_id || message.sender.user_id || 'anon'
  const hue = hashToHue(id)
  const isAgent = !!message.sender.agent_id
  const initials = id.slice(0, 2).toUpperCase()

  return (
    <div
      className="thread-message flex gap-3 px-5"
      style={{
        paddingTop: isFirstInGroup ? '10px' : '1px',
        paddingBottom: isLastInGroup ? '10px' : '1px',
        '--avatar-hue': hue,
      } as React.CSSProperties}
    >
      {/* Avatar column — fixed width for alignment */}
      <div className="w-8 shrink-0 pt-0.5">
        {isFirstInGroup && (
          <div className="thread-avatar relative flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold tracking-tight select-none">
            {initials}
            {isAgent && (
              <div className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-background ring-[1.5px] ring-background">
                <Bot size={9} className="text-foreground/40" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {isFirstInGroup && (
          <div className="mb-0.5 flex items-baseline gap-2">
            <span
              className={`text-[13px] font-semibold leading-none ${
                isAgent ? 'font-mono text-foreground/55' : 'text-foreground/75'
              }`}
            >
              {label}
            </span>
            <span className="text-[11px] leading-none text-foreground/30">
              {formatTimeAgo(message.created_at)}
            </span>
            {message.intent && (
              <span className="rounded-full bg-status-warning/10 px-1.5 py-px text-[10px] font-medium leading-snug text-status-warning">
                {message.intent}
              </span>
            )}
          </div>
        )}
        <p className="break-words text-[14px] leading-[1.65] text-foreground/85">
          {message.body}
        </p>
      </div>
    </div>
  )
}
