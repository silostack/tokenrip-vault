import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback, useRef } from 'react'
import { Copy, Check } from 'lucide-react'

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://tokenrip.com'

export const Route = createFileRoute('/')({
  head: () => ({
    links: [{ rel: 'canonical', href: `${SITE_URL}/` }],
  }),
  component: Home,
})

function Home() {
  return (
    <div className="flex flex-col items-center gap-24 px-6 py-24">
      <HeroSection />
      <TerminalDemo />
      <AssetMockup />
    </div>
  )
}

function HeroSection() {
  return (
    <section className="flex flex-col items-center gap-6 text-center">
      <h1 className="font-mono text-4xl font-bold tracking-tight">tokenrip</h1>
      <p className="text-xl text-foreground/70">
        Asset coordination for AI agents.
      </p>
      <p className="max-w-md text-foreground/50">
        Create and share PDFs, HTML, charts, and more — via a simple link.
      </p>
      <InstallCommand />
      <a
        href="https://github.com/tokenrip/tokenrip-cli"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-foreground/40 transition-colors hover:text-foreground/60"
      >
        GitHub &rarr;
      </a>
    </section>
  )
}

function InstallCommand() {
  const command = 'npm install -g @tokenrip/cli'
  const [copied, setCopied] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout>>()

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(command)
    setCopied(true)
    clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setCopied(false), 2000)
  }, [])

  return (
    <div className="mt-2 flex items-center gap-2 rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-2.5">
      <code className="font-mono text-sm text-foreground/70">{command}</code>
      <button
        type="button"
        onClick={handleCopy}
        title="Copy install command"
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-foreground/40 transition-colors hover:text-foreground/70"
      >
        {copied ? <Check size={14} className="text-status-success" /> : <Copy size={14} />}
      </button>
    </div>
  )
}

function AssetMockup() {
  return (
    <section className="flex w-full max-w-lg flex-col gap-3">
      <h2 className="text-center text-sm font-medium text-foreground/40">
        What it looks like
      </h2>
      <div className="overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm">
        {/* Mini header */}
        <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-2.5">
          <span className="font-mono text-xs font-bold text-foreground/50">tokenrip</span>
          <span className="h-4 w-4 rounded-full bg-foreground/10" />
        </div>

        {/* Content area — fake markdown render */}
        <div className="space-y-3 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-foreground/80">Q1 Report</span>
            <span className="rounded bg-foreground/10 px-1.5 py-0.5 text-[10px] text-foreground/40">
              html
            </span>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-3/4 rounded bg-foreground/10" />
            <div className="h-2 w-full rounded bg-foreground/8" />
            <div className="h-2 w-5/6 rounded bg-foreground/10" />
            <div className="h-2 w-2/3 rounded bg-foreground/6" />
          </div>
          <div className="space-y-2 pt-1">
            <div className="h-2 w-full rounded bg-foreground/8" />
            <div className="h-2 w-4/5 rounded bg-foreground/10" />
            <div className="h-2 w-3/4 rounded bg-foreground/6" />
          </div>
        </div>

        {/* Mini toolbar hint */}
        <div className="flex justify-center border-t border-foreground/5 py-2.5">
          <div className="flex gap-3">
            <span className="h-3.5 w-3.5 rounded-full bg-foreground/10" />
            <span className="h-3.5 w-3.5 rounded-full bg-foreground/10" />
            <span className="h-3.5 w-3.5 rounded-full bg-foreground/10" />
          </div>
        </div>
      </div>
    </section>
  )
}

function TerminalDemo() {
  return (
    <section className="flex w-full max-w-lg flex-col gap-3">
      <h2 className="text-center text-sm font-medium text-foreground/40">
        How it works
      </h2>
      <div className="overflow-hidden rounded-lg border border-foreground/10 bg-foreground/5">
        <div className="flex items-center gap-1.5 border-b border-foreground/10 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
        </div>
        <pre className="p-4 font-mono text-xs leading-relaxed text-foreground/60">
          <span className="text-foreground/40">$</span> tokenrip auth create-key{'\n'}
          <span className="text-status-success">&#10003;</span> API key saved{'\n'}
          {'\n'}
          <span className="text-foreground/40">$</span> tokenrip asset publish report.html --type html --title &quot;Q1 Report&quot;{'\n'}
          <span className="text-status-success">&#10003;</span> https://tokenrip.com/s/abc-123{'\n'}
          {'\n'}
          <span className="text-foreground/30"># share the link — anyone can view it</span>
        </pre>
      </div>
    </section>
  )
}
