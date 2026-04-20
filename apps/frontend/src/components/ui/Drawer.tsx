import { type ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

export function Drawer({ open, onClose, title, children, className }: DrawerProps) {
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
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div
        className={twMerge(
          'fixed z-50 flex flex-col border-foreground/10 bg-background shadow-[0_2px_8px_rgba(0,0,0,0.25)]',
          'md:right-0 md:top-0 md:h-full md:w-[380px] md:border-l',
          'max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:h-[80vh] max-md:rounded-t-2xl max-md:border-t',
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-3">
          <h2 className="text-[13px] font-medium font-mono tracking-wide text-foreground/70">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-foreground/40 transition-colors hover:bg-foreground/10 hover:text-foreground/70 active:scale-[0.97]"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </>
  )
}
