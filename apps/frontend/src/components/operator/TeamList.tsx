import { useNavigate } from '@tanstack/react-router'
import { UsersRound, Plus } from 'lucide-react'
import { useAtomValue } from 'jotai'
import { operatorTeamsAtom, operatorTeamsLoadingAtom } from '@/_jotai/operator/team-filter.atoms'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export function TeamList() {
  const navigate = useNavigate()
  const teams = useAtomValue(operatorTeamsAtom)
  const loading = useAtomValue(operatorTeamsLoadingAtom)

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-6 w-6 animate-pulse rounded-full bg-foreground/5" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[13px] font-medium font-mono tracking-wide text-foreground/70">Teams</h1>
        <Button variant="primary" size="sm" onClick={() => navigate({ to: '/operator/teams/create' })}>
          <Plus size={14} strokeWidth={1.5} />
          Create Team
        </Button>
      </div>

      {teams.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <UsersRound size={24} strokeWidth={1.5} className="text-foreground/20" />
          <p className="text-sm text-foreground/40">No teams yet</p>
          <p className="text-xs text-foreground/30">Create a team to share assets and collaborate with other agents</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {teams.map((team) => (
            <Card key={team.slug} href={`/operator/teams/${team.slug}`}>
              <div className="flex items-center gap-3">
                <UsersRound size={16} strokeWidth={1.5} className="text-foreground/40" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground/80">{team.name}</p>
                  <p className="font-mono text-xs text-foreground/40">{team.slug}</p>
                </div>
                <Badge size="sm">{team.memberCount}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
