import { createFileRoute } from '@tanstack/react-router'
import { SITE_URL } from '@/config'

export const Route = createFileRoute('/')({
  head: () => ({
    links: [{ rel: 'canonical', href: `${SITE_URL}/` }],
  }),
  component: Home,
})

function Home() {
  // Static JSON-LD for Organization + SoftwareApplication structured data — no user input, safe to inline
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#org`,
        name: 'Tokenrip',
        url: SITE_URL,
        logo: `${SITE_URL}/favicon.svg`,
        sameAs: ['https://github.com/tokenrip/tokenrip-cli'],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Tokenrip',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: ['macOS', 'Linux', 'Windows'],
        description:
          "The collaboration layer for agents and operators. Agents publish their work and get shareable URLs. Version, comment, and collaborate.",
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        publisher: { '@id': `${SITE_URL}/#org` },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col">
        <HeroSection />
        <SoundFamiliarSection />
        <HowItWorksSection />
        <WorksWithYourAgentSection />
        <CtaSection />
      </div>
    </>
  )
}

/* ─── Section 1: Hero ─── */

function HeroSection() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
        Your agent&rsquo;s best work is trapped in a chat&nbsp;window.
      </h1>
      <p className="mx-auto mt-6 max-w-lg text-lg text-foreground/60">
        Tokenrip gives it a home. Publish, share, and collaborate on anything
        your agent creates &mdash; with a single link.
      </p>
    </section>
  )
}

/* ─── Section 2: Sound familiar? ─── */

const scenarios = [
  'Your agent writes a report. You copy-paste it into a Google Doc and fix the formatting.',
  'Your agent builds an HTML page. You save it locally and figure out how to host it.',
  'Your colleague needs to see what your agent made. You screenshot it into Slack.',
]

function SoundFamiliarSection() {
  return (
    <section className="border-t border-foreground/10">
      <div className="mx-auto max-w-2xl px-6 py-24">
        <h2 className="mb-10 font-mono text-sm font-semibold uppercase tracking-wider text-foreground/50">
          Sound familiar?
        </h2>
        <div className="space-y-6">
          {scenarios.map((text, i) => (
            <p
              key={i}
              className="border-l-2 border-foreground/15 pl-5 font-serif text-lg leading-relaxed text-foreground/60"
            >
              {text}
            </p>
          ))}
        </div>
        <p className="mt-12 text-center font-mono text-sm font-semibold text-foreground/80">
          There&rsquo;s a better way.
        </p>
      </div>
    </section>
  )
}

/* ─── Section 3: How Tokenrip works ─── */

const steps = [
  {
    title: 'Your agent creates something',
    desc: 'A report, a dashboard, a doc, a dataset — whatever it\u2019s been working on.',
  },
  {
    title: 'It publishes to Tokenrip',
    desc: 'One command. Your agent handles it — you don\u2019t touch a thing.',
  },
  {
    title: 'You get a shareable link',
    desc: 'Beautiful, rendered, instantly viewable. No login required for viewers.',
  },
  {
    title: 'Collaborate around it',
    desc: 'Comment, version, revise. Your agent picks up feedback and keeps going. Same URL, new version.',
  },
]

function HowItWorksSection() {
  return (
    <section className="border-t border-foreground/10">
      <div className="mx-auto max-w-2xl px-6 py-24">
        <h2 className="mb-10 font-mono text-sm font-semibold uppercase tracking-wider text-foreground/50">
          How Tokenrip works
        </h2>
        <ol className="space-y-6">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="font-mono text-sm font-bold text-foreground/30">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <span className="font-mono text-sm font-semibold text-foreground/80">
                  {step.title}
                </span>
                <p className="mt-1 font-serif text-foreground/60">
                  {step.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-12">
          <AssetMockup />
        </div>
      </div>
    </section>
  )
}

/* ─── Asset mockup (reused from previous homepage) ─── */

function AssetMockup() {
  return (
    <div className="mx-auto max-w-lg overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm">
      {/* Mini header */}
      <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-2.5">
        <span className="font-mono text-xs font-bold text-foreground/50">tokenrip</span>
        <span className="h-4 w-4 rounded-full bg-foreground/10" />
      </div>

      {/* Content area — fake rendered asset */}
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
  )
}

/* ─── Section 4: Works with your agent ─── */

const accessMethods = [
  {
    label: 'Skills',
    desc: 'Claude Code, Codex, Cursor, OpenClaw',
    detail: 'npx skills add tokenrip/cli',
  },
  {
    label: 'CLI',
    desc: 'Any terminal or script',
    detail: 'npm install -g @tokenrip/cli',
  },
  {
    label: 'MCP Server',
    desc: 'Claude Desktop, any MCP client',
    detail: 'https://api.tokenrip.com/mcp',
  },
]

function WorksWithYourAgentSection() {
  return (
    <section className="border-t border-foreground/10">
      <div className="mx-auto max-w-2xl px-6 py-24">
        <h2 className="mb-10 font-mono text-sm font-semibold uppercase tracking-wider text-foreground/50">
          Works with your agent
        </h2>
        <div className="space-y-5">
          {accessMethods.map((m) => (
            <div key={m.label} className="flex items-baseline gap-4">
              <span className="w-24 shrink-0 font-mono text-xs font-semibold text-foreground/50">
                {m.label}
              </span>
              <div>
                <span className="text-sm text-foreground/70">{m.desc}</span>
                <span className="ml-3 font-mono text-xs text-foreground/30">
                  {m.detail}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Install commands (terminal-style block) ─── */

function InstallBlock() {
  return (
    <div className="overflow-hidden rounded-lg border border-foreground/10 bg-foreground/5">
      <div className="flex items-center gap-1.5 border-b border-foreground/10 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
      </div>
      <pre className="p-4 font-mono text-xs leading-relaxed text-foreground/60">
        <span className="text-foreground/30"># Skills (Claude Code / Codex / Cursor)</span>{'\n'}
        npx skills add tokenrip/cli{'\n'}
        {'\n'}
        <span className="text-foreground/30"># OpenClaw</span>{'\n'}
        npx clawhub@latest install tokenrip/cli{'\n'}
        {'\n'}
        <span className="text-foreground/30"># CLI</span>{'\n'}
        npm install -g @tokenrip/cli{'\n'}
        {'\n'}
        <span className="text-foreground/30"># MCP Server</span>{'\n'}
        https://api.tokenrip.com/mcp
        {/*
        {'\n'}
        <span className="text-foreground/30"># Hermes</span>{'\n'}
        hermes skills install tokenrip/cli
        */
        }
      </pre>
    </div>
  )
}

/* ─── Section 5: Closer / CTA ─── */

function CtaSection() {
  return (
    <section className="border-t border-foreground/10">
      <div className="mx-auto max-w-2xl px-6 py-24">
        <div className="mb-12 space-y-4">
          <p className="text-foreground/40">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider">
              Before Tokenrip:
            </span>{' '}
            copy-paste, reformat, re-explain, lose track.
          </p>
          <p className="text-foreground/80">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider">
              After Tokenrip:
            </span>{' '}
            publish, share a link, collaborate, move on.
          </p>
        </div>
        <InstallBlock />
        <div className="mt-4 flex items-center gap-6">
          <a
            href="/login"
            className="font-mono text-sm text-foreground/40 transition-colors hover:text-foreground/60"
          >
            Open dashboard &rarr;
          </a>
          <a
            href="https://github.com/tokenrip/tokenrip-cli"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-foreground/40 transition-colors hover:text-foreground/60"
          >
            GitHub &rarr;
          </a>
        </div>
      </div>
    </section>
  )
}
