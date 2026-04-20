import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'react-toastify'
import { createTeam } from '@/lib/operator'
import { Button } from '@/components/ui/Button'
import { OperatorToolbar } from './OperatorToolbar'

export function TeamCreateForm() {
  const navigate = useNavigate()
  const [slug, setSlug] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [slugError, setSlugError] = useState<string | null>(null)

  const validateSlug = (s: string) => {
    if (s.length < 2) return 'At least 2 characters'
    if (s.length > 50) return 'Max 50 characters'
    if (s.length > 1 && !/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(s)) return 'Lowercase letters, numbers, and hyphens only'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const error = validateSlug(slug)
    if (error) { setSlugError(error); return }

    setSubmitting(true)
    try {
      await createTeam({ slug, name: name || undefined, description: description || undefined })
      toast.success('Team created')
      navigate({ to: '/operator/teams/$slug', params: { slug } })
    } catch (err: unknown) {
      const msg =
        (err as any)?.response?.data?.error?.message || 'Failed to create team'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <OperatorToolbar backTo="/operator/teams" title="Create Team" />
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-4 py-6">
        <div>
          <label className="mb-1.5 block text-[11px] font-mono font-medium uppercase tracking-widest text-foreground/40">Slug (required)</label>
          <input
            value={slug}
            onChange={(e) => { setSlug(e.target.value.toLowerCase()); setSlugError(null) }}
            placeholder="my-team"
            className="w-full rounded-lg border border-foreground/10 bg-transparent px-3 py-2.5 font-mono text-sm outline-none transition-colors focus:border-signal-accent focus-visible:outline-2 focus-visible:outline-signal-accent focus-visible:outline-offset-2"
          />
          {slugError && <p className="mt-1.5 text-xs text-status-error">{slugError}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-mono font-medium uppercase tracking-widest text-foreground/40">Display Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Team"
            className="w-full rounded-lg border border-foreground/10 bg-transparent px-3 py-2.5 text-sm outline-none transition-colors focus:border-signal-accent focus-visible:outline-2 focus-visible:outline-signal-accent focus-visible:outline-offset-2"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-mono font-medium uppercase tracking-widest text-foreground/40">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What this team is about…"
            rows={3}
            className="w-full resize-none rounded-lg border border-foreground/10 bg-transparent px-3 py-2.5 text-sm outline-none transition-colors focus:border-signal-accent focus-visible:outline-2 focus-visible:outline-signal-accent focus-visible:outline-offset-2"
          />
        </div>
        <Button type="submit" variant="primary" disabled={submitting || !slug}>
          {submitting ? 'Creating…' : 'Create Team'}
        </Button>
      </form>
    </>
  )
}
