interface ParticipantChipsProps {
  participants: Array<{ agent_id: string; alias: string | null }>
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
        const label = p.alias || p.agent_id.slice(0, 8) + '...'
        const isOwner = ownerId && p.agent_id === ownerId
        return (
          <span
            key={p.agent_id}
            className="inline-flex items-center gap-1 rounded-full bg-foreground/5 px-2 py-0.5 text-[10px] font-medium text-foreground/50"
          >
            {label}
            {isOwner && (
              <span className="rounded bg-foreground/10 px-1 py-px text-[8px] uppercase text-foreground/40">
                owner
              </span>
            )}
          </span>
        )
      })}
      {overflow > 0 && (
        <span className="text-[10px] text-foreground/30">
          +{overflow} more
        </span>
      )}
    </div>
  )
}
