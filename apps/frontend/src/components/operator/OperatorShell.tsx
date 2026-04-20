import { type ReactNode, useEffect, useState } from 'react'
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
  Inbox,
  FileText,
  MessageSquare,
  Users,
  UsersRound,
  Settings,
  MoreHorizontal,
  Globe,
} from 'lucide-react'
import { operatorAgentAtom } from '@/_jotai/operator/operator.atoms'
import {
  activeTeamSlugAtom,
  operatorTeamsAtom,
  operatorTeamsLoadingAtom,
} from '@/_jotai/operator/team-filter.atoms'
import { fetchOperatorAgent, fetchOperatorTeams } from '@/lib/operator'
import { clearSession } from '@/lib/session'
import { Sidebar, SidebarItem } from '@/components/ui/Sidebar'
import { TabBar } from '@/components/ui/TabBar'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { MobileDrawer } from '@/components/ui/MobileDrawer'
import { Badge } from '@/components/ui/Badge'

interface OperatorShellProps {
  children: ReactNode
}

export function OperatorShell({ children }: OperatorShellProps) {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [agent, setAgent] = useAtom(operatorAgentAtom)
  const [loading, setLoading] = useState(!agent)
  const [moreOpen, setMoreOpen] = useState(false)
  const [activeTeamSlug, setActiveTeamSlug] = useAtom(activeTeamSlugAtom)
  const teams = useAtomValue(operatorTeamsAtom)
  const setTeams = useSetAtom(operatorTeamsAtom)
  const setTeamsLoading = useSetAtom(operatorTeamsLoadingAtom)

  useEffect(() => {
    if (agent) return
    fetchOperatorAgent()
      .then(setAgent)
      .catch(() => {
        clearSession()
        navigate({ to: '/operator/auth' })
      })
      .finally(() => setLoading(false))
  }, [agent, setAgent, navigate])

  useEffect(() => {
    if (!agent) return
    setTeamsLoading(true)
    fetchOperatorTeams()
      .then(setTeams)
      .catch(() => {})
      .finally(() => setTeamsLoading(false))
  }, [agent, setTeams, setTeamsLoading])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-foreground/5" />
      </div>
    )
  }

  const agentLabel =
    agent?.alias || (agent?.agent_id ? agent.agent_id.slice(0, 16) + '…' : 'Agent')

  const activeTeam = teams.find((t) => t.slug === activeTeamSlug)
  const isDetailView = /^\/operator\/(assets|threads)\/[^/]+/.test(pathname)

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <Sidebar
        header={
          <Dropdown
            trigger={
              <span className="flex items-center gap-2">
                <Globe size={14} strokeWidth={1.5} className="text-foreground/40" />
                {activeTeam ? activeTeam.name : 'All Activity'}
              </span>
            }
          >
            <DropdownItem
              active={!activeTeamSlug}
              onClick={() => setActiveTeamSlug(null)}
            >
              <Globe size={14} strokeWidth={1.5} className="text-foreground/40" />
              All Activity
            </DropdownItem>
            {teams.length > 0 && (
              <div className="my-1 border-t border-foreground/10" />
            )}
            {teams.map((team) => (
              <DropdownItem
                key={team.slug}
                active={activeTeamSlug === team.slug}
                onClick={() => setActiveTeamSlug(team.slug)}
              >
                <UsersRound size={14} strokeWidth={1.5} className="text-foreground/40" />
                <span className="flex-1">{team.name}</span>
                <Badge size="sm">{team.memberCount}</Badge>
              </DropdownItem>
            ))}
          </Dropdown>
        }
        footer={
          <div className="flex flex-col gap-1">
            <Link
              to="/operator/settings"
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-mono tracking-wide text-foreground/40 transition-colors hover:text-foreground/60"
            >
              <Settings size={14} strokeWidth={1.5} />
              Settings
            </Link>
            <span className="truncate px-2 font-mono text-[11px] text-foreground/30">
              {agentLabel}
            </span>
          </div>
        }
      >
        <div className="flex flex-col gap-1">
          <SidebarItem href="/operator" icon={<Inbox size={18} strokeWidth={1.5} />} label="Inbox" />
          <SidebarItem href="/operator/assets" icon={<FileText size={18} strokeWidth={1.5} />} label="Assets" />
          <SidebarItem href="/operator/threads" icon={<MessageSquare size={18} strokeWidth={1.5} />} label="Threads" />
          <SidebarItem href="/operator/contacts" icon={<Users size={18} strokeWidth={1.5} />} label="Contacts" />
          <SidebarItem href="/operator/teams" icon={<UsersRound size={18} strokeWidth={1.5} />} label="Teams" />
        </div>
      </Sidebar>

      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="mx-auto max-w-3xl">{children}</div>
      </main>

      {!isDetailView && (
        <TabBar
          items={[
            { href: '/operator', icon: <Inbox size={20} strokeWidth={1.5} />, label: 'Inbox' },
            { href: '/operator/assets', icon: <FileText size={20} strokeWidth={1.5} />, label: 'Assets' },
            { href: '/operator/threads', icon: <MessageSquare size={20} strokeWidth={1.5} />, label: 'Threads' },
            { href: '/operator/contacts', icon: <Users size={20} strokeWidth={1.5} />, label: 'Contacts' },
          ]}
          trailing={{ icon: <MoreHorizontal size={20} strokeWidth={1.5} />, label: 'More', onClick: () => setMoreOpen(true) }}
        />
      )}

      <MobileDrawer open={moreOpen} onClose={() => setMoreOpen(false)} title="More">
        <div className="flex flex-col gap-1">
          <p className="px-1 py-2 text-[10px] font-mono font-medium uppercase tracking-widest text-foreground/30">
            Team Filter
          </p>
          <button
            type="button"
            onClick={() => { setActiveTeamSlug(null); setMoreOpen(false) }}
            className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${!activeTeamSlug ? 'bg-signal-accent/[0.06] font-medium text-foreground' : 'text-foreground/60 hover:bg-foreground/5'}`}
          >
            All Activity
          </button>
          {teams.map((team) => (
            <button
              key={team.slug}
              type="button"
              onClick={() => { setActiveTeamSlug(team.slug); setMoreOpen(false) }}
              className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${activeTeamSlug === team.slug ? 'bg-signal-accent/[0.06] font-medium text-foreground' : 'text-foreground/60 hover:bg-foreground/5'}`}
            >
              {team.name}
            </button>
          ))}
          <div className="my-2 border-t border-foreground/10" />
          <Link to="/operator/teams" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/60 hover:bg-foreground/5" onClick={() => setMoreOpen(false)}>
            <UsersRound size={16} strokeWidth={1.5} />
            Teams
          </Link>
          <Link to="/operator/settings" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/60 hover:bg-foreground/5" onClick={() => setMoreOpen(false)}>
            <Settings size={16} strokeWidth={1.5} />
            Settings
          </Link>
        </div>
      </MobileDrawer>
    </div>
  )
}
