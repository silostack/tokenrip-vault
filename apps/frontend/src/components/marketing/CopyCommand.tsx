import { useState, type ReactNode } from 'react'
import { Check, Copy } from 'lucide-react'

interface CopyCommandProps {
  /** The literal text copied to the clipboard and rendered in the <pre>. */
  code: string
  /** Optional muted label shown above the code (e.g. "Claude Code · Codex · Cursor"). */
  label?: ReactNode
  /** Optional left glyph (typically a small Lucide icon). */
  leftGlyph?: ReactNode
  /** Treat as a single URL rather than a shell command — no leading "$". */
  asUrl?: boolean
}

export function CopyCommand({ code, label, leftGlyph, asUrl = false }: CopyCommandProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      // Clipboard unavailable (old browser, insecure context) — degrade silently.
    }
  }

  return (
    <div className="group relative flex flex-col gap-1.5">
      {label && (
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground/45">
          {label}
        </span>
      )}
      <div className="relative flex items-center gap-2.5 rounded-sm border border-foreground/10 bg-surface-1 px-3.5 py-2.5 transition-colors group-hover:border-foreground/20">
        {leftGlyph && (
          <span aria-hidden className="shrink-0 text-foreground/35">
            {leftGlyph}
          </span>
        )}
        <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-[13px] leading-none text-foreground/85">
          {!asUrl && <span className="select-none text-foreground/30">$ </span>}
          {code}
        </code>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : 'Copy to clipboard'}
          className="relative shrink-0 rounded-md p-1.5 text-foreground/50 transition-colors hover:bg-foreground/10 hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1"
        >
          {copied ? (
            <Check size={14} strokeWidth={2} className="text-status-success" />
          ) : (
            <Copy size={14} strokeWidth={1.75} />
          )}
        </button>
      </div>
    </div>
  )
}
