import { useCallback, useEffect, useRef } from 'react'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  destructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === dialogRef.current) onCancel()
    },
    [onCancel],
  )

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={onCancel}
      className="m-auto max-w-sm rounded-xl border border-foreground/10 bg-background p-0 text-foreground shadow-lg backdrop:bg-black/50"
    >
      <div className="p-6">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-foreground/60">{message}</p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border border-foreground/10 px-4 py-3 text-sm font-medium transition-colors hover:bg-foreground/5 active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-colors active:scale-[0.98] ${
              destructive
                ? 'bg-status-error text-white hover:bg-status-error/90'
                : 'bg-foreground text-background hover:bg-foreground/90'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  )
}
