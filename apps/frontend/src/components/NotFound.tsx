import { FileQuestion, Compass } from 'lucide-react'

const PAGE_LINES = [
  'Looks like this page took a wrong turn.',
  'Nothing here but good vibes.',
  'This page is off the grid.',
  "You've wandered into the void.",
  'Not all who wander are lost. But this page is.',
]

const ASSET_LINES = [
  'This asset may have been moved or deleted.',
  'This asset has left the building.',
  'Poof. Gone without a trace.',
  'This asset is playing hide and seek.',
  'It was here a moment ago. Probably.',
]

function pickLine(lines: string[]): string {
  // Use a time-based seed so it's stable during SSR/hydration
  // but changes between page loads
  const index = Math.floor(Date.now() / 60_000) % lines.length
  return lines[index]
}

export function NotFound({ variant = 'page' }: { variant?: 'page' | 'asset' }) {
  const isAsset = variant === 'asset'
  const Icon = isAsset ? FileQuestion : Compass
  const heading = isAsset ? 'Asset not found' : 'Page not found'
  const subtitle = pickLine(isAsset ? ASSET_LINES : PAGE_LINES)

  return (
    <div className="not-found flex flex-col items-center justify-center gap-5 px-6 py-28 text-center">
      <Icon
        size={32}
        strokeWidth={1.5}
        className="text-foreground/20"
      />
      <h1 className="not-found-code font-mono text-6xl font-bold tracking-tighter text-foreground/10">
        404
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
