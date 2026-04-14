import { useState, useCallback } from 'react'
import { UserPlus, Check, X } from 'lucide-react'
import { hasSession } from '@/lib/session'
import { addOperatorContact } from '@/lib/operator'

interface SaveContactButtonProps {
  agentId: string
  alias: string | null
}

type State = 'idle' | 'form' | 'saving' | 'saved' | 'onboarding'

export function SaveContactButton({ agentId, alias }: SaveContactButtonProps) {
  const [state, setState] = useState<State>('idle')
  const [label, setLabel] = useState(alias ?? '')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleClick = useCallback(() => {
    if (typeof window === 'undefined') return
    if (!hasSession()) {
      setState('onboarding')
      return
    }
    setState('form')
  }, [])

  const handleSave = useCallback(async () => {
    setState('saving')
    setError(null)
    try {
      await addOperatorContact({
        agentId,
        label: label || undefined,
        notes: notes || undefined,
      })
      setState('saved')
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save contact'
      setError(msg)
      setState('form')
    }
  }, [agentId, label, notes])

  if (state === 'saved') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-status-success">
        <Check size={12} />
        Saved
      </span>
    )
  }

  if (state === 'onboarding') {
    return (
      <div className="mt-2 rounded-lg border border-foreground/10 bg-foreground/5 p-3 text-xs text-foreground/60">
        <p className="mb-2 font-medium text-foreground/80">Link your agent to save contacts</p>
        <ol className="list-inside list-decimal space-y-1">
          <li>
            <code className="rounded bg-foreground/10 px-1">npm i -g @tokenrip/cli</code>
          </li>
          <li>
            <code className="rounded bg-foreground/10 px-1">tokenrip auth register</code>
          </li>
          <li>
            <code className="rounded bg-foreground/10 px-1">tokenrip operator-link</code>
          </li>
        </ol>
        <button
          onClick={() => setState('idle')}
          className="mt-2 text-foreground/40 hover:text-foreground/60"
        >
          Dismiss
        </button>
      </div>
    )
  }

  if (state === 'form' || state === 'saving') {
    return (
      <div className="mt-2 flex flex-col gap-2 rounded-lg border border-foreground/10 bg-foreground/5 p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground/60">Save contact</span>
          <button onClick={() => setState('idle')} className="text-foreground/30 hover:text-foreground/60">
            <X size={14} />
          </button>
        </div>
        <input
          type="text"
          placeholder="Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="rounded border border-foreground/10 bg-transparent px-2 py-1 text-sm text-foreground/80 placeholder:text-foreground/30 focus:border-foreground/30 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="rounded border border-foreground/10 bg-transparent px-2 py-1 text-sm text-foreground/80 placeholder:text-foreground/30 focus:border-foreground/30 focus:outline-none"
        />
        {error && <p className="text-xs text-status-error">{error}</p>}
        <button
          onClick={handleSave}
          disabled={state === 'saving'}
          className="rounded bg-foreground/10 px-3 py-1 text-xs font-medium text-foreground/80 hover:bg-foreground/20 disabled:opacity-50"
        >
          {state === 'saving' ? 'Saving...' : 'Save'}
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-foreground/40 hover:bg-foreground/10 hover:text-foreground/60"
      title="Save contact"
    >
      <UserPlus size={12} />
    </button>
  )
}
