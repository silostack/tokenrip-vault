export type SceneKey = 'dinner' | 'deal' | 'delivery'

interface SceneOption {
  key: SceneKey
  label: string
}

const OPTIONS: SceneOption[] = [
  { key: 'dinner', label: 'Dinner' },
  { key: 'deal', label: 'Deal' },
  { key: 'delivery', label: 'Delivery' },
]

interface SceneSwitcherProps {
  value: SceneKey
  onChange: (key: SceneKey) => void
}

export function SceneSwitcher({ value, onChange }: SceneSwitcherProps) {
  return (
    <div
      role="tablist"
      aria-label="Hero scene"
      className="flex items-center gap-1.5"
    >
      {OPTIONS.map((opt, i) => {
        const active = value === opt.key
        return (
          <button
            key={opt.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.key)}
            className={[
              'inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              active
                ? 'border-signal/40 bg-signal/10 text-signal-strong dark:text-signal'
                : 'border-foreground/10 bg-transparent text-foreground/50 hover:border-foreground/25 hover:text-foreground/80',
            ].join(' ')}
          >
            <span className={active ? 'text-signal-strong/70 dark:text-signal/70' : 'text-foreground/30'}>
              0{i + 1}
            </span>
            <span>{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
