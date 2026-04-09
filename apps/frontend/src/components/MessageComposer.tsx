import { useState, useCallback, useRef } from 'react'
import { ArrowUp } from 'lucide-react'

interface MessageComposerProps {
  onSend: (body: string) => Promise<void>
  placeholder?: string
  disabled?: boolean
}

export function MessageComposer({ onSend, placeholder, disabled }: MessageComposerProps) {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = useCallback(async () => {
    const trimmed = text.trim()
    if (!trimmed || sending) return
    setSending(true)
    try {
      await onSend(trimmed)
      setText('')
      if (inputRef.current) {
        inputRef.current.style.height = 'auto'
        inputRef.current.focus()
      }
    } finally {
      setSending(false)
    }
  }, [text, sending, onSend])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  const hasText = text.trim().length > 0

  return (
    <div className="border-t border-foreground/10 px-5 py-3">
      <div className="flex items-end gap-2">
        <div className="flex-1 rounded-2xl border border-foreground/10 bg-foreground/5 transition-colors focus-within:border-foreground/20">
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || 'Write a message\u2026'}
            disabled={disabled || sending}
            rows={1}
            className="w-full resize-none bg-transparent px-4 py-2.5 text-[14px] text-foreground placeholder:text-foreground/25 focus:outline-none disabled:opacity-50"
            style={{ maxHeight: '120px', minHeight: '38px' }}
            onInput={(e) => {
              const el = e.currentTarget
              el.style.height = 'auto'
              el.style.height = `${Math.min(el.scrollHeight, 120)}px`
            }}
          />
        </div>
        <button
          type="button"
          onClick={handleSend}
          disabled={!hasText || sending || disabled}
          title="Send (\u2318+Enter)"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all ${
            hasText && !sending && !disabled
              ? 'cursor-pointer bg-foreground text-background active:scale-95'
              : 'bg-foreground/10 text-foreground/25'
          }`}
        >
          <ArrowUp size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}
