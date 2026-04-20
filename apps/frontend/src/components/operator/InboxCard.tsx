import { useState, useCallback } from 'react'
import { MessageSquare, FileText, X, Link2 } from 'lucide-react'
import { formatTimeAgo } from '@/utils/time'
import type { InboxItem } from '@/lib/operator'
import { ParticipantChips } from './ParticipantChips'

interface InboxCardProps {
  item: InboxItem
  onDismiss: (item: InboxItem) => Promise<void>
  onNavigate: (item: InboxItem) => void
}

export function InboxCard({ item, onDismiss, onNavigate }: InboxCardProps) {
  const [dismissing, setDismissing] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const handleDismiss = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation()
      if (dismissing) return
      setDismissing(true)
      try {
        await onDismiss(item)
        setDismissed(true)
      } catch {
        setDismissing(false)
      }
    },
    [item, onDismiss, dismissing],
  )

  if (dismissed) return null

  if (item.kind === 'thread') {
    const t = item.data
    return (
      <button
        type="button"
        onClick={() => onNavigate(item)}
        className="group flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-foreground/[0.03] active:bg-foreground/[0.05]"
      >
        <MessageSquare
          size={16}
          strokeWidth={1.5}
          className="mt-0.5 shrink-0 text-foreground/25"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <p className="truncate text-sm text-foreground/80">
              {t.last_body_preview || `Thread ${t.thread_id.slice(0, 8)}`}
            </p>
            <span className="shrink-0 font-mono text-[11px] text-foreground/30">
              {formatTimeAgo(t.updated_at)}
            </span>
          </div>
          {t.participants?.length > 0 && (
            <div className="mt-1.5">
              <ParticipantChips
                participants={t.participants}
                ownerId={t.owner_id}
              />
            </div>
          )}
          <div className="mt-1 flex items-center gap-2 font-mono text-[11px] text-foreground/30">
            <span>
              {t.new_message_count} new
            </span>
            {t.state === 'closed' && (
              <span className="rounded-full bg-foreground/5 px-1.5 py-px text-foreground/40">
                closed
              </span>
            )}
            {t.ref_count > 0 && (
              <span className="flex items-center gap-1">
                <Link2 size={10} strokeWidth={1.5} />
                {t.ref_count} asset{t.ref_count !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          disabled={dismissing}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-foreground/0 transition-colors group-hover:text-foreground/20 hover:!bg-foreground/10 hover:!text-foreground/50 active:scale-[0.97]"
          title="Dismiss"
        >
          <X size={14} strokeWidth={1.5} />
        </button>
      </button>
    )
  }

  const a = item.data
  return (
    <button
      type="button"
      onClick={() => onNavigate(item)}
      className="group flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-foreground/[0.03] active:bg-foreground/[0.05]"
    >
      <FileText size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-foreground/25" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="truncate text-sm text-foreground/80">
            {a.title || `Asset ${a.asset_id.slice(0, 8)}`}
          </p>
          <span className="shrink-0 font-mono text-[11px] text-foreground/30">
            {formatTimeAgo(a.updated_at)}
          </span>
        </div>
        {a.description && (
          <p className="mt-0.5 truncate text-xs text-foreground/30">
            {a.description}
          </p>
        )}
        <div className="mt-1 flex items-center gap-2 font-mono text-[11px] text-foreground/30">
          <span>
            {a.new_version_count} new version{a.new_version_count !== 1 ? 's' : ''}
          </span>
          <span>v{a.latest_version}</span>
          {a.thread_count > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare size={10} strokeWidth={1.5} />
              {a.thread_count}
            </span>
          )}
        </div>
      </div>
      <div className="w-8 shrink-0" />
    </button>
  )
}
