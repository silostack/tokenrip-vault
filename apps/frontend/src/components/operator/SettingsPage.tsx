import { useState, useRef, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { Bot, Copy, Check, LogOut, UsersRound } from 'lucide-react'
import { operatorAgentAtom } from '@/_jotai/operator/operator.atoms'
import { operatorTeamsAtom } from '@/_jotai/operator/team-filter.atoms'
import { clearSession } from '@/lib/session'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center justify-between py-3">
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-mono uppercase tracking-widest text-foreground/40">{label}</p>
        <p className="mt-0.5 truncate font-mono text-sm text-foreground/70">{value}</p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="ml-3 flex h-7 w-7 items-center justify-center rounded-md text-foreground/30 transition-colors hover:bg-foreground/5 hover:text-foreground/60 active:scale-[0.97]"
      >
        {copied ? <Check size={14} strokeWidth={1.5} /> : <Copy size={14} strokeWidth={1.5} />}
      </button>
    </div>
  )
}

export function SettingsPage() {
  const agent = useAtomValue(operatorAgentAtom)
  const teams = useAtomValue(operatorTeamsAtom)
  const navigate = useNavigate()

  const handleLogout = () => {
    clearSession()
    navigate({ to: '/' })
  }

  if (!agent) return null

  return (
    <div className="flex flex-col gap-8 px-4 py-6">
      <h1 className="text-[13px] font-medium font-mono tracking-wide text-foreground/70">Settings</h1>

      <section>
        <h2 className="mb-4 flex items-center gap-2 text-[11px] font-mono font-medium uppercase tracking-widest text-foreground/40">
          <Bot size={14} strokeWidth={1.5} />
          Identity
        </h2>
        <div className="flex flex-col divide-y divide-foreground/5">
          {agent.alias && (
            <div className="py-3">
              <p className="text-[11px] font-mono uppercase tracking-widest text-foreground/40">Alias</p>
              <p className="mt-0.5 text-sm font-medium text-foreground/80">{agent.alias}</p>
            </div>
          )}
          <CopyField label="Agent ID" value={agent.agent_id} />
          {agent.public_key && (
            <CopyField label="Public Key" value={agent.public_key} />
          )}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-[11px] font-mono font-medium uppercase tracking-widest text-foreground/40">
            <UsersRound size={14} strokeWidth={1.5} />
            Teams
          </h2>
          <a href="/operator/teams/create" className="text-xs font-mono text-signal-accent hover:underline">
            Create Team
          </a>
        </div>
        {teams.length === 0 ? (
          <p className="text-sm text-foreground/30">No teams</p>
        ) : (
          <div className="flex flex-col gap-2">
            {teams.map((team) => (
              <Card key={team.slug} href={`/operator/teams/${team.slug}`} className="py-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-foreground/70">{team.name}</span>
                  <Badge size="sm">{team.memberCount}</Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="pt-2">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 text-[12px] font-mono text-foreground/30 transition-colors hover:text-status-error"
        >
          <LogOut size={13} strokeWidth={1.5} />
          Log out
        </button>
      </section>
    </div>
  )
}
