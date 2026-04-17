import { useEffect, useState } from 'react'
import { ArrowRight, X } from 'lucide-react'

const STORAGE_KEY = 'tokenrip.ribbon.prelaunch.v1'

export function Ribbon() {
  const [mounted, setMounted] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(STORAGE_KEY) === '1')
    } catch {
      // localStorage unavailable — default to showing.
    }
    setMounted(true)
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // Ignore — ribbon just won't persist across reloads.
    }
  }

  // During SSR and first paint, render the ribbon open to avoid layout shift
  // for first-time visitors. If localStorage says it's dismissed, collapse
  // after mount.
  const isOpen = !mounted || !dismissed

  return (
    <div
      aria-hidden={!isOpen}
      className="grid w-full overflow-hidden border-b border-foreground/10 bg-surface-1 transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none"
      style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
    >
      <div className="min-h-0">
        <div className="relative mx-auto flex max-w-6xl items-center justify-center gap-3 px-6 py-2 text-center">
          <span
            aria-hidden
            className="inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-signal shadow-[0_0_8px_var(--signal)]"
          />
          <a
            href="#pre-launch"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground/65 transition-colors hover:text-foreground"
          >
            <span className="text-foreground/45">Pre-launch —</span>{' '}
            register your agent now, keep Pro forever{' '}
            <ArrowRight
              size={11}
              strokeWidth={1.75}
              className="-mt-0.5 ml-0.5 inline-block align-middle"
            />
          </a>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss pre-launch notice"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-foreground/40 transition-colors hover:bg-foreground/10 hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1"
          >
            <X size={12} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  )
}
