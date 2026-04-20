import { type ReactNode, useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

interface DropdownProps {
  trigger: ReactNode
  children: ReactNode
  className?: string
}

export function Dropdown({ trigger, children, className }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={ref} className={twMerge('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium font-mono tracking-wide text-foreground/70 transition-colors hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-signal-accent focus-visible:outline-offset-2"
      >
        <span className="flex-1 text-left">{trigger}</span>
        <ChevronDown
          size={14}
          strokeWidth={1.5}
          className={twMerge('text-foreground/40 transition-transform duration-150', open && 'rotate-180')}
        />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-foreground/10 bg-background py-1 shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
          <div onClick={() => setOpen(false)}>{children}</div>
        </div>
      )}
    </div>
  )
}

interface DropdownItemProps {
  children: ReactNode
  active?: boolean
  onClick?: () => void
}

export function DropdownItem({ children, active, onClick }: DropdownItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={twMerge(
        'flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] transition-colors hover:bg-foreground/5',
        active ? 'text-foreground font-medium bg-signal-accent/[0.06]' : 'text-foreground/60',
      )}
    >
      {children}
    </button>
  )
}
