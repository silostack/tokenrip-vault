import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Copy, Check, UserPlus, Link, Trash2, LogOut } from 'lucide-react'
import { toast } from 'react-toastify'
import { useAtomValue } from 'jotai'
import { operatorAgentAtom } from '@/_jotai/operator/operator.atoms'
import {
  fetchTeamDetail,
  addTeamMember,
  removeTeamMember,
  generateTeamInvite,
  deleteTeam,
  leaveTeam,
  type TeamDetail as TeamDetailData,
} from '@/lib/operator'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { OperatorToolbar } from './OperatorToolbar'
import { ConfirmDialog } from './ConfirmDialog'

export function TeamDetail({ slug }: { slug: string }) {
  const navigate = useNavigate()
  const agent = useAtomValue(operatorAgentAtom)
  const [team, setTeam] = useState<TeamDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingMember, setAddingMember] = useState(false)
  const [memberInput, setMemberInput] = useState('')
  const [inviteLink, setInviteLink] = useState<string | null>(null)
  const [inviteCopied, setInviteCopied] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => { if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current) }
  }, [])

  const load = useCallback(async () => {
    try {
      const data = await fetchTeamDetail(slug)
      setTeam(data)
    } catch {
      toast.error('Failed to load team')
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => { load() }, [load])

  const isOwner = team?.owner_id === agent?.agent_id

  const handleAddMember = async () => {
    if (!memberInput.trim()) return
    try {
      await addTeamMember(slug, memberInput.trim())
      setMemberInput('')
      setAddingMember(false)
      toast.success('Member added')
      load()
    } catch {
      toast.error('Failed to add member')
    }
  }

  const handleRemoveMember = async (agentId: string) => {
    try {
      await removeTeamMember(slug, agentId)
      toast.success('Member removed')
      load()
    } catch {
      toast.error('Failed to remove member')
    }
  }

  const handleGenerateInvite = async () => {
    try {
      const data = await generateTeamInvite(slug)
      setInviteLink(data.invite_url || data.token || null)
    } catch {
      toast.error('Failed to generate invite')
    }
  }

  const handleCopyInvite = async () => {
    if (!inviteLink) return
    await navigator.clipboard.writeText(inviteLink)
    setInviteCopied(true)
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
    copyTimeoutRef.current = setTimeout(() => setInviteCopied(false), 3000)
  }

  const handleDelete = async () => {
    try {
      await deleteTeam(slug)
      toast.success('Team deleted')
      navigate({ to: '/operator/teams' })
    } catch {
      toast.error('Failed to delete team')
    }
  }

  const handleLeave = async () => {
    try {
      await leaveTeam(slug)
      toast.success('Left team')
      navigate({ to: '/operator/teams' })
    } catch {
      toast.error('Failed to leave team')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-6 w-6 animate-pulse rounded-full bg-foreground/5" />
      </div>
    )
  }

  if (!team) return null

  const toolbarActions = isOwner
    ? [{ label: 'Delete Team', icon: <Trash2 size={14} strokeWidth={1.5} />, onClick: () => setConfirmDelete(true), destructive: true }]
    : [{ label: 'Leave Team', icon: <LogOut size={14} strokeWidth={1.5} />, onClick: handleLeave }]

  return (
    <>
      <OperatorToolbar backTo="/operator/teams" title={team.name} actions={toolbarActions} />

      <div className="flex flex-col gap-8 px-4 py-6">
        {/* Header */}
        <div>
          <h1 className="text-lg font-medium text-foreground/90">{team.name}</h1>
          <p className="font-mono text-xs text-foreground/40">{team.slug}</p>
          {team.description && (
            <p className="mt-2 text-sm text-foreground/60">{team.description}</p>
          )}
        </div>

        {/* Members */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-mono font-medium uppercase tracking-widest text-foreground/40">Members</h2>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={handleGenerateInvite}>
                <Link size={14} strokeWidth={1.5} />
                Invite Link
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setAddingMember(true)}>
                <UserPlus size={14} strokeWidth={1.5} />
                Add
              </Button>
            </div>
          </div>

          {inviteLink && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-foreground/10 bg-foreground/[0.02] px-3 py-2.5">
              <code className="flex-1 truncate text-xs text-foreground/60">{inviteLink}</code>
              <button type="button" onClick={handleCopyInvite} className="flex h-7 w-7 items-center justify-center rounded-md text-foreground/40 transition-colors hover:bg-foreground/5 hover:text-foreground/70 active:scale-[0.97]">
                {inviteCopied ? <Check size={14} strokeWidth={1.5} /> : <Copy size={14} strokeWidth={1.5} />}
              </button>
            </div>
          )}

          {addingMember && (
            <div className="mt-3 flex gap-2">
              <input
                value={memberInput}
                onChange={(e) => setMemberInput(e.target.value)}
                placeholder="Agent ID or alias"
                className="flex-1 rounded-lg border border-foreground/10 bg-transparent px-3 py-2.5 font-mono text-sm outline-none transition-colors focus:border-signal-accent"
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddMember() }}
                autoFocus
              />
              <Button size="sm" variant="primary" onClick={handleAddMember}>Add</Button>
              <Button size="sm" variant="ghost" onClick={() => setAddingMember(false)}>Cancel</Button>
            </div>
          )}

          <div className="mt-3 flex flex-col">
            {team.members?.map((member) => (
              <div key={member.agent_id} className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-foreground/[0.02]">
                <div className="min-w-0 flex-1">
                  <span className="text-sm text-foreground/70">
                    {member.alias || member.agent_id.slice(0, 16) + '…'}
                  </span>
                  {member.agent_id === team.owner_id && (
                    <Badge size="sm" variant="accent" className="ml-2">owner</Badge>
                  )}
                  {member.agent_id === agent?.agent_id && (
                    <Badge size="sm" className="ml-2">you</Badge>
                  )}
                </div>
                {isOwner && member.agent_id !== agent?.agent_id && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member.agent_id)}
                    className="text-xs font-mono text-foreground/30 transition-colors hover:text-status-error"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Shared assets */}
        {team.recent_assets && team.recent_assets.length > 0 && (
          <div>
            <h2 className="text-[11px] font-mono font-medium uppercase tracking-widest text-foreground/40">Recent Shared Assets</h2>
            <div className="mt-3 flex flex-col">
              {team.recent_assets.map((asset) => (
                <a
                  key={asset.public_id}
                  href={`/operator/assets/${asset.public_id}`}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground/60 transition-colors hover:bg-foreground/[0.02]"
                >
                  <span className="flex-1 truncate">{asset.title || asset.public_id}</span>
                  <Badge size="sm">{asset.type}</Badge>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete team"
        message="This removes all memberships and shared asset records. Assets themselves are not deleted."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  )
}
