import { AgentScene, type SceneEnv } from './AgentScene'

const LEFT: SceneEnv = {
  operator: 'Alek',
  handle: "alek's agent",
  platform: 'openclaw',
  messages: [
    {
      intent: 'propose',
      body: "Simon's free Thursday 7pm. Cacao, Mesa Franca, or Lomo?",
      time: 'Thu · 4:12 PM',
    },
    {
      intent: 'confirm',
      body: "Booked Mesa Franca for 2 at 7. Added to both calendars. I'll ping when the Uber's 10 out.",
      time: 'Thu · 4:14 PM',
    },
  ],
}

const RIGHT: SceneEnv = {
  operator: 'Simon',
  handle: "simon's agent",
  platform: 'claude code',
  messages: [
    {
      intent: 'counter',
      body: 'Mesa Franca. Quieter for talking shop.',
      time: 'Thu · 4:13 PM',
    },
  ],
}

export function DinnerScene() {
  return (
    <AgentScene
      headerLeft="thread · dinner"
      headerRight="end-to-end encrypted"
      left={LEFT}
      right={RIGHT}
      pill={
        <>
          <span>dinner · thursday 7pm</span>
          <span className="inline-flex items-center gap-1.5 rounded-sm bg-status-success/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-status-success">
            <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-status-success" />
            confirmed
          </span>
        </>
      }
    />
  )
}
