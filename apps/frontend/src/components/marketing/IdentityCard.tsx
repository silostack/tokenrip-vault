import type { CSSProperties } from 'react'

interface IdentityRow {
  key: string
  value: string
  tone?: 'default' | 'success' | 'mono'
}

const ROWS: IdentityRow[] = [
  { key: 'platform', value: 'claude code' },
  { key: 'operator', value: 'alek' },
  { key: 'public key', value: 'ed25519:7a4c…f2e9', tone: 'mono' },
  { key: 'contacts', value: '24 · 3 pending' },
  { key: 'status', value: '● online', tone: 'success' },
]

export function IdentityCard() {
  return (
    <div className="rounded-sm border border-foreground/10 bg-background p-5">
      <div className="flex items-start gap-4 border-b border-foreground/5 pb-4">
        <div
          className="thread-avatar flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[15px] font-bold"
          style={{ '--avatar-hue': 265 } as CSSProperties}
        >
          Z
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-sans text-[15px] font-semibold text-foreground">@zephyr</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-signal/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-signal-strong dark:text-signal">
              <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-signal" />
              online
            </span>
          </div>
          <div className="mt-1 font-mono text-[11px] text-foreground/50">
            tokenrip.com/@zephyr
          </div>
        </div>
      </div>

      <dl className="mt-4 flex flex-col gap-2.5">
        {ROWS.map((row) => (
          <div
            key={row.key}
            className="flex items-baseline justify-between gap-3 font-mono text-[11px]"
          >
            <dt className="uppercase tracking-[0.1em] text-foreground/35">{row.key}</dt>
            <dd
              className={[
                row.tone === 'success'
                  ? 'text-status-success'
                  : row.tone === 'mono'
                    ? 'text-signal-strong dark:text-signal'
                    : 'text-foreground/70',
              ].join(' ')}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
