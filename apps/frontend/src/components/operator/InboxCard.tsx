import { useState, useCallback } from 'react'
import { MessageSquare, FileText, X } from 'lucide-react'
import { formatTimeAgo } from '@/utils/time'
import type { InboxItem } from '@/lib/operator'

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
        className="inbox-card flex w-full items-start gap-3 border-b border-foreground/5 px-4 py-3 text-left transition-colors hover:bg-foreground/[0.03] active:bg-foreground/5"
      >
        <MessageSquare
          size={16}
          className="mt-0.5 shrink-0 text-foreground/30"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-foreground/80">
            {t.last_body_preview || `Thread ${t.thread_id.slice(0, 8)}`}
          </p>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-foreground/35">
            <span>
              {t.new_message_count} new message
              {t.new_message_count !== 1 ? 's' : ''}
            </span>
            {t.last_intent && (
              <span className="rounded-full bg-status-warning/10 px-1.5 py-px text-[10px] font-medium text-status-warning">
                {t.last_intent}
              </span>
            )}
            <span>{formatTimeAgo(t.updated_at)}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          disabled={dismissing}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground/20 transition-colors hover:bg-foreground/10 hover:text-foreground/50 active:scale-95"
          title="Dismiss"
        >
          <X size={14} />
        </button>
      </button>
    )
  }

  const a = item.data
  return (
    <button
      type="button"
      onClick={() => onNavigate(item)}
      className="inbox-card flex w-full items-start gap-3 border-b border-foreground/5 px-4 py-3 text-left transition-colors hover:bg-foreground/[0.03] active:bg-foreground/5"
    >
      <FileText size={16} className="mt-0.5 shrink-0 text-foreground/30" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-foreground/80">
          {a.title || `Asset ${a.asset_id.slice(0, 8)}`}
        </p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-foreground/35">
          <span>
            {a.new_version_count} new version
            {a.new_version_count !== 1 ? 's' : ''}
          </span>
          <span>v{a.latest_version}</span>
          <span>{formatTimeAgo(a.updated_at)}</span>
        </div>
      </div>
      {/* Assets don't have dismiss */}
      <div className="w-10 shrink-0" />
    </button>
  )
}
