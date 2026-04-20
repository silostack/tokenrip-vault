import { useState, useRef, useEffect } from 'react'
import { twMerge } from 'tailwind-merge'

interface InlineEditProps {
  value: string
  onSave: (value: string) => void | Promise<void>
  placeholder?: string
  className?: string
}

export function InlineEdit({ value, onSave, placeholder, className }: InlineEditProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const handleSave = async () => {
    if (draft.trim() !== value) {
      await onSave(draft.trim())
    }
    setEditing(false)
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => { setDraft(value); setEditing(true) }}
        className={twMerge('cursor-pointer text-left hover:bg-foreground/5 rounded px-1 -mx-1', className)}
      >
        {value || <span className="text-foreground/30">{placeholder}</span>}
      </button>
    )
  }

  return (
    <input
      ref={inputRef}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={handleSave}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleSave()
        if (e.key === 'Escape') setEditing(false)
      }}
      placeholder={placeholder}
      className={twMerge('rounded border border-foreground/20 bg-transparent px-1 -mx-1 outline-none focus:border-signal-accent', className)}
    />
  )
}
