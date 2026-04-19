import { useState } from 'react'
import { ChevronRight, ExternalLink } from 'lucide-react'
import { CopyCommand } from './CopyCommand'

interface Platform {
  id: string
  label: string
  cmd: string
}

const PLATFORMS: Platform[] = [
  { id: 'claude-code', label: 'Claude Code', cmd: 'npx skills add tokenrip/cli' },
  { id: 'openclaw', label: 'OpenClaw', cmd: 'npx clawhub@latest install tokenrip/cli' },
  { id: 'cursor', label: 'Cursor', cmd: 'npx skills add tokenrip/cli' },
  { id: 'codex', label: 'Codex', cmd: 'npx skills add tokenrip/cli' },
  { id: 'cli', label: 'CLI', cmd: 'npm install -g @tokenrip/cli' },
]

const MCP_GUIDES = [
  { label: 'Add to Claude Cowork', href: 'https://docs.tokenrip.com' },
  { label: 'Add to Claude Desktop', href: 'https://docs.tokenrip.com' },
  { label: 'Add to any MCP client', href: 'https://docs.tokenrip.com' },
]

export function HeroInstall() {
  const [activeId, setActiveId] = useState<string>(PLATFORMS[0].id)
  const [mcpOpen, setMcpOpen] = useState(false)
  const active = PLATFORMS.find((p) => p.id === activeId) ?? PLATFORMS[0]

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-sm border border-foreground/10 bg-surface-1">
        <div
          role="tablist"
          aria-label="Install platform"
          className="flex overflow-x-auto border-b border-foreground/10"
        >
          {PLATFORMS.map((p) => {
            const isActive = p.id === activeId
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveId(p.id)}
                className={[
                  'flex-1 min-w-max whitespace-nowrap border-r border-foreground/10 px-3.5 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors last:border-r-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-inset',
                  isActive
                    ? 'bg-background text-foreground shadow-[inset_0_-2px_0_var(--signal)]'
                    : 'text-foreground/50 hover:bg-background/60 hover:text-foreground/80',
                ].join(' ')}
              >
                {p.label}
              </button>
            )
          })}
        </div>
        <div className="flex flex-col gap-2.5 p-4">
          <CopyCommand code={active.cmd} />
          <div className="flex items-center gap-2 rounded-sm border border-dashed border-foreground/10 bg-background/50 px-3.5 py-2.5 font-mono text-[12.5px] leading-none text-foreground/60">
            <span className="select-none text-signal-strong dark:text-signal">&gt;</span>
            <span>Give me the Tokenrip tour.</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setMcpOpen((v) => !v)}
        aria-expanded={mcpOpen}
        className="group inline-flex items-center justify-between gap-2 rounded-sm border border-foreground/10 bg-transparent px-4 py-2.5 font-mono text-[12px] text-foreground/60 transition-colors hover:border-foreground/25 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span>Not on the command line? Connect via MCP</span>
        <ChevronRight
          size={14}
          strokeWidth={1.75}
          className={[
            'transition-transform',
            mcpOpen
              ? 'rotate-90 text-signal-strong dark:text-signal'
              : 'text-foreground/35 group-hover:text-foreground/60',
          ].join(' ')}
        />
      </button>

      {mcpOpen && (
        <div className="flex flex-col gap-3 rounded-sm border border-foreground/10 bg-surface-1 p-4">
          <CopyCommand asUrl label="MCP endpoint" code="https://api.tokenrip.com/mcp" />
          <div className="flex flex-col gap-1">
            {MCP_GUIDES.map((g) => (
              <a
                key={g.label}
                href={g.href}
                className="group inline-flex items-center justify-between gap-2 rounded-md px-1 py-1 font-mono text-[11px] text-foreground/60 transition-colors hover:text-foreground"
              >
                <span>&rarr; {g.label}</span>
                <ExternalLink
                  size={11}
                  strokeWidth={1.75}
                  className="text-foreground/30 group-hover:text-foreground/60"
                />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
