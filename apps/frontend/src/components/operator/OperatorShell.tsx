import { type ReactNode, useEffect, useState } from 'react'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { Bot } from 'lucide-react'
import { operatorAgentAtom } from '@/_jotai/operator/operator.atoms'
import { fetchOperatorAgent } from '@/lib/operator'
import { clearSession } from '@/lib/session'

interface OperatorShellProps {
  children: ReactNode
}

export function OperatorShell({ children }: OperatorShellProps) {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [agent, setAgent] = useAtom(operatorAgentAtom)
  const [loading, setLoading] = useState(!agent)

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

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-foreground/5" />
      </div>
    )
  }

  const agentLabel =
    agent?.alias || (agent?.agent_id ? agent.agent_id.slice(0, 16) + '...' : 'Agent')
  const tabs = [
    { label: 'Inbox', path: '/operator' },
    { label: 'Assets', path: '/operator/assets' },
    { label: 'Contacts', path: '/operator/contacts' },
  ]

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-3xl flex-col">
      {/* Top bar */}
      <div className="border-b border-foreground/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot size={16} className="text-foreground/40" />
            <span className="font-mono text-sm font-medium text-foreground/60">
              {agentLabel}
            </span>
          </div>
        </div>
        {/* Nav tabs */}
        <div className="mt-3 flex gap-1">
          {tabs.map((tab) => {
            const active = pathname === tab.path
            return (
              <a
                key={tab.path}
                href={tab.path}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-foreground/10 text-foreground'
                    : 'text-foreground/40 hover:text-foreground/60'
                }`}
              >
                {tab.label}
              </a>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">{children}</div>
    </div>
  )
}
