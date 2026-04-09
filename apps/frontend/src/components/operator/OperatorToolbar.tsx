import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft, MoreVertical } from 'lucide-react'

export interface ToolbarAction {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  destructive?: boolean
  primary?: boolean
}

interface OperatorToolbarProps {
  title?: string
  actions?: ToolbarAction[]
  backTo?: string
}

function ActionButton({ action, onClick }: { action: ToolbarAction; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors active:scale-95 ${
        action.destructive
          ? 'text-status-error hover:bg-status-error/10'
          : 'text-foreground/50 hover:bg-foreground/5 hover:text-foreground/70'
      }`}
    >
      <span className="flex items-center gap-1.5">
        {action.icon}
        {action.label}
      </span>
    </button>
  )
}

export function OperatorToolbar({ title, actions = [], backTo }: OperatorToolbarProps) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleBack = useCallback(() => {
    if (backTo) {
      navigate({ to: backTo })
    } else {
      window.history.back()
    }
  }, [navigate, backTo])

  useEffect(() => {
    if (!menuOpen) return
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [menuOpen])

  const primaryAction = actions.find((a) => a.primary)
  const secondaryActions = actions.filter((a) => !a.primary)

  return (
    <div className="flex items-center gap-2 border-b border-foreground/10 px-4 py-2">
      <button
        type="button"
        onClick={handleBack}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-foreground/40 transition-colors hover:bg-foreground/5 hover:text-foreground/60 active:scale-95"
        title="Back"
      >
        <ArrowLeft size={18} />
      </button>

      <div className="min-w-0 flex-1">
        {title && (
          <span className="truncate text-sm font-medium text-foreground/60">{title}</span>
        )}
      </div>

      {/* Desktop: show all actions */}
      <div className="hidden gap-2 sm:flex">
        {actions.map((action) => (
          <ActionButton key={action.label} action={action} onClick={action.onClick} />
        ))}
      </div>

      {/* Mobile: primary action + overflow menu */}
      <div className="flex gap-2 sm:hidden">
        {primaryAction && (
          <ActionButton action={primaryAction} onClick={primaryAction.onClick} />
        )}
        {secondaryActions.length > 0 && (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground/40 transition-colors hover:bg-foreground/5"
            >
              <MoreVertical size={16} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-lg border border-foreground/10 bg-background py-1 shadow-lg">
                {secondaryActions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      action.onClick()
                    }}
                    className={`flex w-full items-center gap-2 px-4 py-3 text-left text-sm transition-colors hover:bg-foreground/5 ${
                      action.destructive ? 'text-status-error' : 'text-foreground/70'
                    }`}
                  >
                    {action.icon}
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
