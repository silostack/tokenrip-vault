import { useState } from 'react'
import { ExternalLink, FileText, Link2, Plus, X } from 'lucide-react'
import type { ThreadRef } from '../../lib/operator'

interface LinkedResourcesProps {
  refs: ThreadRef[]
  onAdd: (ref: { type: string; target_id: string }) => Promise<void>
  onRemove: (refId: string) => Promise<void>
  disabled?: boolean
}

function refLabel(ref: ThreadRef): string {
  if (ref.type === 'asset') return ref.target_id.slice(0, 8) + '\u2026'
  try {
    return new URL(ref.target_id).hostname
  } catch {
    return ref.target_id.slice(0, 30)
  }
}

function refHref(ref: ThreadRef): string {
  if (ref.type === 'asset') return `/s/${ref.target_id}`
  return ref.target_id
}

export function LinkedResources({ refs, onAdd, onRemove, disabled }: LinkedResourcesProps) {
  const [adding, setAdding] = useState(false)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleAdd() {
    if (!input.trim()) return
    setBusy(true)
    try {
      await onAdd({ type: 'url', target_id: input.trim() })
      setInput('')
      setAdding(false)
    } finally {
      setBusy(false)
    }
  }

  if (!refs.length && disabled) return null

  return (
    <div className="border-b border-foreground/10 px-4 py-2">
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-foreground/40">
        <Link2 size={12} />
        Linked Resources
        {!disabled && (
          <button
            onClick={() => setAdding(!adding)}
            className="ml-auto rounded p-0.5 hover:bg-foreground/5"
          >
            <Plus size={12} />
          </button>
        )}
      </div>

      {adding && (
        <div className="mt-2 flex gap-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Asset ID or URL..."
            className="flex-1 rounded border border-foreground/10 bg-transparent px-2 py-1 text-xs outline-none focus:border-foreground/30"
            disabled={busy}
          />
          <button
            onClick={handleAdd}
            disabled={busy || !input.trim()}
            className="rounded bg-foreground/10 px-2 py-1 text-xs hover:bg-foreground/20 disabled:opacity-40"
          >
            Add
          </button>
        </div>
      )}

      {refs.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {refs.map((ref) => (
            <a
              key={ref.id}
              href={refHref(ref)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1 rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-foreground/70 hover:bg-foreground/10 hover:text-foreground"
            >
              {ref.type === 'asset' ? <FileText size={10} /> : <ExternalLink size={10} />}
              {refLabel(ref)}
              {!disabled && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onRemove(ref.id)
                  }}
                  className="ml-0.5 hidden rounded-full p-0.5 hover:bg-foreground/20 group-hover:block"
                >
                  <X size={8} />
                </button>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
