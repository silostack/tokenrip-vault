import { useEffect, useCallback, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { Users, RefreshCw, Pencil, Trash2, Check, X } from 'lucide-react'
import { formatTimeAgo } from '@/utils/time'
import {
  operatorContactsAtom,
  operatorContactsLoadingAtom,
} from '@/_jotai/operator/operator.atoms'
import {
  fetchOperatorContacts,
  removeOperatorContact,
  updateOperatorContact,
  type OperatorContact,
} from '@/lib/operator'

function ContactRow({ contact, onRemove, onUpdate }: {
  contact: OperatorContact
  onRemove: (id: string) => void
  onUpdate: (id: string, opts: { label?: string; notes?: string }) => void
}) {
  const [editing, setEditing] = useState(false)
  const [label, setLabel] = useState(contact.label ?? '')
  const [notes, setNotes] = useState(contact.notes ?? '')

  const handleSave = () => {
    onUpdate(contact.id, { label: label || undefined, notes: notes || undefined })
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="border-b border-foreground/5 px-4 py-3">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label"
            className="rounded border border-foreground/10 bg-transparent px-2 py-1 text-sm text-foreground/80 placeholder:text-foreground/30 focus:border-foreground/30 focus:outline-none"
          />
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes"
            className="rounded border border-foreground/10 bg-transparent px-2 py-1 text-sm text-foreground/80 placeholder:text-foreground/30 focus:border-foreground/30 focus:outline-none"
          />
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex items-center gap-1 rounded px-2 py-1 text-xs text-foreground/60 hover:bg-foreground/10">
              <Check size={12} /> Save
            </button>
            <button onClick={() => setEditing(false)} className="flex items-center gap-1 rounded px-2 py-1 text-xs text-foreground/40 hover:bg-foreground/10">
              <X size={12} /> Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 border-b border-foreground/5 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground/80">
          {contact.label || contact.alias || contact.agentId.slice(0, 20) + '...'}
        </p>
        <p className="mt-0.5 text-xs text-foreground/35">
          {contact.alias && <span className="mr-2 font-mono">{contact.alias}</span>}
          {contact.notes && <span className="mr-2">{contact.notes}</span>}
          Added {formatTimeAgo(contact.createdAt)}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={() => setEditing(true)}
          className="rounded p-1.5 text-foreground/25 hover:bg-foreground/5 hover:text-foreground/50"
          title="Edit"
        >
          <Pencil size={12} />
        </button>
        <button
          onClick={() => onRemove(contact.id)}
          className="rounded p-1.5 text-foreground/25 hover:bg-status-error/10 hover:text-status-error"
          title="Remove"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  )
}

export function OperatorContactList() {
  const contacts = useAtomValue(operatorContactsAtom)
  const loading = useAtomValue(operatorContactsLoadingAtom)
  const setContacts = useSetAtom(operatorContactsAtom)
  const setLoading = useSetAtom(operatorContactsLoadingAtom)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchOperatorContacts()
      setContacts(data)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [setContacts, setLoading])

  useEffect(() => {
    load()
  }, [load])

  const handleRemove = useCallback(async (id: string) => {
    try {
      await removeOperatorContact(id)
      setContacts((prev) => prev.filter((c) => c.id !== id))
    } catch {
      // silent
    }
  }, [setContacts])

  const handleUpdate = useCallback(async (id: string, opts: { label?: string; notes?: string }) => {
    try {
      const updated = await updateOperatorContact(id, opts)
      setContacts((prev) => prev.map((c) => (c.id === id ? updated : c)))
    } catch {
      // silent
    }
  }, [setContacts])

  if (loading && contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-8 w-8 animate-pulse rounded-full bg-foreground/5" />
        <p className="mt-3 text-xs text-foreground/25">Loading contacts...</p>
      </div>
    )
  }

  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground/5">
          <Users size={18} className="text-foreground/15" />
        </div>
        <p className="mt-3 text-sm font-medium text-foreground/30">
          No contacts saved yet
        </p>
        <p className="mt-1 text-[11px] text-foreground/20">
          Save contacts from shared asset pages or via the CLI
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-end px-4 py-2">
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-foreground/40 transition-colors hover:bg-foreground/5 hover:text-foreground/60"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>
      <div>
        {contacts.map((contact) => (
          <ContactRow
            key={contact.id}
            contact={contact}
            onRemove={handleRemove}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  )
}
