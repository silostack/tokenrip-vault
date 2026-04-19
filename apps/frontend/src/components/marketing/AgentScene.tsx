import type { CSSProperties, ReactNode } from 'react'

function hashToHue(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % 360
}

export type IntentKind = 'propose' | 'accept' | 'counter' | 'confirm' | 'reject' | 'note' | 'revision'

export interface SceneMessage {
  intent: IntentKind
  body: ReactNode
  time: string
}

export interface SceneEnv {
  /** Operator name (drives avatar hue + letter). */
  operator: string
  /** Handle displayed in the column header (e.g. "alek's agent"). */
  handle: string
  /** Platform chip value (e.g. "claude code"). */
  platform: string
  /** Messages rendered top-to-bottom. */
  messages: SceneMessage[]
}

interface AgentSceneProps {
  headerLeft: ReactNode
  headerRight?: ReactNode
  left: SceneEnv
  right: SceneEnv
  pill: ReactNode
}

const INTENT_CLASSES: Record<IntentKind, string> = {
  propose: 'border-signal/30 bg-signal/10 text-signal-strong dark:text-signal',
  accept: 'border-status-success/30 bg-status-success/10 text-status-success',
  counter: 'border-status-warning/30 bg-status-warning/10 text-status-warning',
  confirm: 'border-status-warning/30 bg-status-warning/10 text-status-warning',
  reject: 'border-status-error/30 bg-status-error/10 text-status-error',
  note: 'border-foreground/15 bg-foreground/5 text-foreground/55',
  revision: 'border-status-warning/30 bg-status-warning/10 text-status-warning',
}

function IntentPill({ intent }: { intent: IntentKind }) {
  return (
    <span
      className={[
        'inline-block rounded-sm border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em]',
        INTENT_CLASSES[intent],
      ].join(' ')}
    >
      {intent}
    </span>
  )
}

function EnvHeader({ env, side }: { env: SceneEnv; side: 'left' | 'right' }) {
  const initials = env.operator.slice(0, 1).toUpperCase()
  const hue = hashToHue(env.operator)
  return (
    <div className="flex items-center gap-2 border-b border-foreground/10 pb-2.5">
      <div
        className="thread-avatar flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
        style={{ '--avatar-hue': hue } as CSSProperties}
      >
        {initials}
      </div>
      <span className="flex-1 truncate font-sans text-[12px] font-semibold text-foreground">
        {env.handle}
      </span>
      <span
        className={[
          'inline-flex items-center rounded-sm border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em]',
          side === 'right'
            ? 'border-signal/25 bg-signal/8 text-signal-strong dark:text-signal'
            : 'border-foreground/15 bg-foreground/5 text-foreground/55',
        ].join(' ')}
      >
        {env.platform}
      </span>
    </div>
  )
}

function Bubble({ msg, index, side }: { msg: SceneMessage; index: number; side: 'left' | 'right' }) {
  return (
    <div
      className={[
        'agent-scene-bubble rounded-sm border border-foreground/10 bg-surface-2/60 px-3 py-2.5 text-[13px] leading-[1.5] text-foreground/85',
        side === 'right' ? 'ml-auto' : '',
      ].join(' ')}
      style={{ animationDelay: `${index * 220 + (side === 'right' ? 110 : 0)}ms`, maxWidth: '94%' }}
    >
      <div className="mb-1 flex items-center gap-1.5">
        <IntentPill intent={msg.intent} />
      </div>
      <div>{msg.body}</div>
      <div className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-foreground/35">
        {msg.time}
      </div>
    </div>
  )
}

const SCENE_ANIMATION_CSS = `
  @keyframes agent-scene-fade-in {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .agent-scene-bubble, .agent-scene-pill {
    animation: agent-scene-fade-in 0.45s ease-out both;
  }
  @media (prefers-reduced-motion: reduce) {
    .agent-scene-bubble, .agent-scene-pill { animation: none; }
  }
`

export function AgentScene({ headerLeft, headerRight, left, right, pill }: AgentSceneProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-sm border border-foreground/10 bg-surface-0">
      {/* Scene header — spans both columns */}
      <div className="col-span-1 md:col-span-2 flex items-center justify-between border-b border-foreground/10 bg-surface-1 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground/45">
        <span className="flex items-center gap-2">
          <span aria-hidden className="flex gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-foreground/15" />
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-foreground/15" />
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-foreground/15" />
          </span>
          <span>{headerLeft}</span>
        </span>
        {headerRight && <span>{headerRight}</span>}
      </div>

      {/* Left environment column */}
      <div
        className="relative flex flex-col gap-3 border-b border-dashed border-foreground/10 md:border-b-0 md:border-r bg-gradient-to-b from-[color-mix(in_srgb,#c084fc_6%,transparent)] to-transparent px-4 py-4 min-h-[180px] md:min-h-[380px]"
      >
        <EnvHeader env={left} side="left" />
        {left.messages.map((m, i) => (
          <Bubble key={i} msg={m} index={i * 2} side="left" />
        ))}
      </div>

      {/* Right environment column */}
      <div
        className="relative flex flex-col gap-3 bg-gradient-to-b from-signal/[0.06] to-transparent px-4 py-4 min-h-[180px] md:min-h-[380px]"
      >
        <EnvHeader env={right} side="right" />
        {right.messages.map((m, i) => (
          <Bubble key={i} msg={m} index={i * 2} side="right" />
        ))}
      </div>

      {/* Pill footer — spans both columns */}
      <div className="agent-scene-pill col-span-1 md:col-span-2 flex items-center justify-between border-t border-foreground/10 bg-surface-1 px-4 py-3 font-mono text-[11px] text-foreground/55">
        {pill}
      </div>

      <style>{SCENE_ANIMATION_CSS}</style>
    </div>
  )
}
