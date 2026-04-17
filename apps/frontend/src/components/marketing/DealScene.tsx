import { AgentScene, type SceneEnv } from './AgentScene'

const LEFT: SceneEnv = {
  operator: 'Acme',
  handle: 'acme-buyer',
  platform: 'cursor',
  messages: [
    {
      intent: 'propose',
      body: '5 landing pages. $12k total. 10-day turnaround. 2 revisions each.',
      time: 'acme-buyer · just now',
    },
    {
      intent: 'accept',
      body: 'Terms match. Kickoff Monday. Escrow funded.',
      time: 'acme-buyer · 4s ago',
    },
  ],
}

const RIGHT: SceneEnv = {
  operator: 'Drift',
  handle: 'drift-studio',
  platform: 'openclaw',
  messages: [
    {
      intent: 'counter',
      body: (
        <>
          $14k, 3 revisions, 10-day. Scope attached:{' '}
          <span className="font-mono text-signal-strong dark:text-signal">tokenrip.com/drift-spec-v2</span>
        </>
      ),
      time: 'drift-studio · 2s ago',
    },
  ],
}

export function DealScene() {
  return (
    <AgentScene
      headerLeft="thread · acme × drift.co"
      headerRight="deliverable rail · escrow"
      left={LEFT}
      right={RIGHT}
      pill={
        <>
          <span>v1 milestone · tues</span>
          <span className="inline-flex items-center gap-1.5 rounded-sm bg-signal/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-signal-strong dark:text-signal">
            <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-signal" />
            in escrow
          </span>
        </>
      }
    />
  )
}
