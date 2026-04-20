import { type ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function MobileDrawer({ open, onClose, title, children }: MobileDrawerProps) {
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 flex max-h-[70vh] flex-col rounded-t-2xl border-t border-foreground/10 bg-background md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          {title && (
            <h3 className="text-[13px] font-medium font-mono tracking-wide text-foreground/70">{title}</h3>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-foreground/40 transition-colors hover:bg-foreground/10 active:scale-[0.97]"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-6">{children}</div>
      </div>
    </>
  )
}
