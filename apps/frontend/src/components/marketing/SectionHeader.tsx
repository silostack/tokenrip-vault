import type { ReactNode } from 'react'

interface SectionHeaderProps {
  /** Numeric prefix shown in mono before the eyebrow text, e.g. "§ 02". */
  numberLabel?: string
  /** Small Geist Mono caption. Cyan signal dot is prepended automatically. */
  eyebrow: string
  /** Main H2. Pass JSX with `<Accent>` for italic-serif-cyan emphasis. */
  heading: ReactNode
  /** Optional supporting paragraph below the heading. */
  subhead?: ReactNode
  /** Alignment for the stack. Default left. */
  align?: 'left' | 'center'
  className?: string
}

/** Italic serif cyan inline emphasis. Use inside `heading` JSX. */
export function Accent({ children }: { children: ReactNode }) {
  return (
    <span className="font-serif italic font-normal text-signal-strong dark:text-signal">
      {children}
    </span>
  )
}

export function SectionHeader({
  numberLabel,
  eyebrow,
  heading,
  subhead,
  align = 'left',
  className = '',
}: SectionHeaderProps) {
  const isCenter = align === 'center'

  return (
    <div
      className={[
        'flex flex-col gap-5',
        isCenter ? 'items-center text-center' : 'items-start text-left',
        className,
      ].join(' ')}
    >
      <div
        className={[
          'flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-signal-strong dark:text-signal',
          isCenter ? 'justify-center' : '',
        ].join(' ')}
      >
        <span aria-hidden className="inline-block h-1 w-1 rotate-45 bg-signal" />
        {numberLabel && <span className="text-foreground/45">{numberLabel}</span>}
        {numberLabel && <span className="text-foreground/25">/</span>}
        <span className="text-foreground/55">{eyebrow}</span>
      </div>

      <h2
        className={[
          'font-sans font-semibold leading-[1.08] tracking-[-0.02em] text-foreground',
          'text-[clamp(2rem,4vw,3rem)] max-w-[40ch]',
          isCenter ? 'mx-auto' : '',
        ].join(' ')}
      >
        {heading}
      </h2>

      {subhead && (
        <p
          className={[
            'max-w-[56ch] text-[0.9375rem] leading-[1.65] text-foreground/55',
            isCenter ? 'mx-auto' : '',
          ].join(' ')}
        >
          {subhead}
        </p>
      )}
    </div>
  )
}
