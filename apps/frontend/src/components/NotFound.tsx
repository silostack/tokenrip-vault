import { Compass, FileQuestion } from 'lucide-react'

function Tombstone({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Stone */}
      <path
        d="M13 42V18c0-6.075 4.925-11 11-11s11 4.925 11 11v24"
        fill="currentColor"
        fillOpacity={0.08}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      {/* Ground line */}
      <line x1="8" y1="42" x2="40" y2="42" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
      {/* RIP text */}
      <text
        x="24"
        y="27"
        textAnchor="middle"
        fill="currentColor"
        fontSize="8"
        fontFamily="monospace"
        fontWeight="bold"
        letterSpacing="1"
      >
        RIP
      </text>
      {/* Cross */}
      <line x1="24" y1="31" x2="24" y2="37" stroke="currentColor" strokeWidth={1} strokeLinecap="round" />
      <line x1="21.5" y1="33" x2="26.5" y2="33" stroke="currentColor" strokeWidth={1} strokeLinecap="round" />
      {/* Grass tufts */}
      <path d="M10 42c1-3 2.5-4 3-4s1 1.5 1.5 4" stroke="currentColor" strokeWidth={0.8} strokeLinecap="round" fill="none" />
      <path d="M34 42c.8-2.5 1.8-3.5 2.5-3.5s1.2 2 1.5 3.5" stroke="currentColor" strokeWidth={0.8} strokeLinecap="round" fill="none" />
    </svg>
  )
}

const PAGE_LINES = [
  'Looks like this page took a wrong turn.',
  'Nothing here but good vibes.',
  'This page is off the grid.',
  "You've wandered into the void.",
  'Not all who wander are lost. But this page is.',
]

const DESTROYED_LINES = [
  'This asset has left the building.',
  'Poof. Gone without a trace.',
  'It was here a moment ago. Probably.',
  'Reduced to atoms.',
  'Shuffled off this mortal coil.',
]

const NOT_FOUND_LINES = [
  "This doesn't look like anything to us.",
  'Nothing here. Never was.',
  "We've looked everywhere. Nada.",
  'This UUID leads nowhere.',
]

function pickLine(lines: string[]): string {
  const index = Math.floor(Date.now() / 60_000) % lines.length
  return lines[index]
}

interface NotFoundProps {
  variant?: 'page' | 'asset' | 'destroyed'
  title?: string | null
}

export function NotFound({ variant = 'page', title }: NotFoundProps) {
  const isDestroyed = variant === 'destroyed'
  const isAsset = variant === 'asset'

  let heading: string
  let subtitle: string
  let statusCode: string

  if (isDestroyed) {
    heading = title ? `"${title}" was destroyed` : 'Asset destroyed'
    subtitle = pickLine(DESTROYED_LINES)
    statusCode = '410'
  } else if (isAsset) {
    heading = 'Asset not found'
    subtitle = pickLine(NOT_FOUND_LINES)
    statusCode = '404'
  } else {
    heading = 'Page not found'
    subtitle = pickLine(PAGE_LINES)
    statusCode = '404'
  }

  return (
    <div className="not-found flex flex-col items-center justify-center gap-5 px-6 py-28 text-center">
      {isDestroyed ? (
        <Tombstone size={48} className="text-foreground/25" />
      ) : isAsset ? (
        <FileQuestion size={32} strokeWidth={1.5} className="text-foreground/20" />
      ) : (
        <Compass size={32} strokeWidth={1.5} className="text-foreground/20" />
      )}
      <h1 className="not-found-code font-mono text-6xl font-bold tracking-tighter text-foreground/10">
        {statusCode}
      </h1>
      <div className="flex flex-col gap-1.5">
        <p className="font-mono text-sm font-semibold tracking-wide text-foreground/70">
          {heading}
        </p>
        <p className="text-sm text-foreground/40">
          {subtitle}
        </p>
      </div>
      <a
        href="/"
        className="mt-2 rounded-full border border-foreground/10 px-5 py-2 text-xs text-foreground/50 transition-all hover:border-foreground/20 hover:text-foreground/70"
      >
        Go home
      </a>
    </div>
  )
}
