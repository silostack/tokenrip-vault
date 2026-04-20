import { Badge } from '@/components/ui/Badge'

interface Participant {
  agent_id: string
  alias: string | null
  team_name?: string | null
}

interface ParticipantChipsProps {
  participants: Participant[]
  ownerId?: string
  max?: number
}

export function ParticipantChips({
  participants,
  ownerId,
  max = 3,
}: ParticipantChipsProps) {
  const visible = participants.slice(0, max)
  const overflow = participants.length - max

  return (
    <div className="flex flex-wrap items-center gap-1">
      {visible.map((p) => {
        const label = p.alias || p.agent_id.slice(0, 8) + '…'
        const isOwner = ownerId && p.agent_id === ownerId
        const isSystem = p.alias === 'tokenrip.ai'
        return (
          <span
            key={p.agent_id}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] ${
              isSystem
                ? 'bg-signal-muted text-signal-strong ring-1 ring-inset ring-signal/20'
                : 'bg-foreground/5 text-foreground/50'
            }`}
          >
            {label}
            {isOwner && (
              <Badge size="sm" variant="accent">owner</Badge>
            )}
            {p.team_name && (
              <Badge size="sm" className="ml-0.5">
                {p.team_name}
              </Badge>
            )}
          </span>
        )
      })}
      {overflow > 0 && (
        <span className="font-mono text-[10px] text-foreground/30">
          +{overflow}
        </span>
      )}
    </div>
  )
}
