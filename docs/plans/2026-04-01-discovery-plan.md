# Discovery Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add discovery flow so people who view tokenrip assets can easily find and adopt tokenrip, and improve the homepage to onboard new users.

**Architecture:** Two changes to existing files — (1) a conditional "Get tokenrip" CTA in the root layout header for asset pages, and (2) a redesigned homepage with hero, terminal demo, and CSS asset mockup. No new routes, no new dependencies.

**Tech Stack:** React, TanStack Router v1, Tailwind CSS v4, Lucide icons, Geist fonts

---

### Task 1: Add "Get tokenrip" CTA to header on asset pages

**Files:**
- Modify: `apps/frontend/src/app/__root.tsx`

**Step 1: Add route-aware CTA to the header**

Import `useRouterState` from TanStack Router to detect the current pathname. Add a "Get tokenrip" link that only renders on `/s/*` routes.

In `apps/frontend/src/app/__root.tsx`, update the imports:

```tsx
import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router'
```

Then replace the `<header>` block inside `RootLayout` with:

```tsx
<header className="flex items-center justify-between border-b border-foreground/10 px-6 py-4">
  <a
    href="/"
    className="font-mono text-lg font-bold tracking-tight"
  >
    tokenrip
  </a>
  <div className="flex items-center gap-4">
    <HeaderCta />
    <ThemeToggle />
  </div>
</header>
```

Add a `HeaderCta` component in the same file, above `RootLayout`:

```tsx
function HeaderCta() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  if (!pathname.startsWith('/s/')) return null

  return (
    <a
      href="/"
      className="text-sm text-foreground/50 transition-colors hover:text-foreground/80"
    >
      Get tokenrip &rarr;
    </a>
  )
}
```

**Step 2: Verify the CTA renders correctly**

Run: `cd apps/frontend && bun run build`
Expected: Build succeeds with no errors.

Then manually verify:
- Visit `http://localhost:3333/` — CTA should NOT appear
- Visit `http://localhost:3333/s/any-uuid` — CTA should appear to the left of the theme toggle

**Step 3: Commit**

```bash
git add apps/frontend/src/app/__root.tsx
git commit -m "feat: add 'Get tokenrip' CTA to header on asset pages"
```

---

### Task 2: Redesign homepage hero section

**Files:**
- Modify: `apps/frontend/src/app/index.tsx`

**Step 1: Replace the homepage with the new hero**

Replace the entire `Home` component in `apps/frontend/src/app/index.tsx` with the content below. This step adds the hero section only — the "How it works" and "What it looks like" sections come in Tasks 3 and 4.

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback, useRef } from 'react'
import { Copy, Check } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="flex flex-col items-center gap-24 px-6 py-24">
      <HeroSection />
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
        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
      </button>
    </div>
  )
}
```

**Step 2: Verify the hero renders**

Run: `cd apps/frontend && bun run build`
Expected: Build succeeds with no errors.

**Step 3: Commit**

```bash
git add apps/frontend/src/app/index.tsx
git commit -m "feat: redesign homepage hero with tagline, install command, and GitHub link"
```

---

### Task 3: Add "How it works" terminal section to homepage

**Files:**
- Modify: `apps/frontend/src/app/index.tsx`

**Step 1: Add the TerminalDemo component and render it in Home**

Add this component below `InstallCommand` in the same file:

```tsx
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
          <span className="text-green-400">&#10003;</span> API key saved{'\n'}
          {'\n'}
          <span className="text-foreground/40">$</span> tokenrip asset publish report.html --type html --title &quot;Q1 Report&quot;{'\n'}
          <span className="text-green-400">&#10003;</span> https://tokenrip.com/s/abc-123{'\n'}
          {'\n'}
          <span className="text-foreground/30"># share the link — anyone can view it</span>
        </pre>
      </div>
    </section>
  )
}
```

Update the `Home` component to include it:

```tsx
function Home() {
  return (
    <div className="flex flex-col items-center gap-24 px-6 py-24">
      <HeroSection />
      <TerminalDemo />
    </div>
  )
}
```

**Step 2: Verify the terminal demo renders**

Run: `cd apps/frontend && bun run build`
Expected: Build succeeds with no errors.

**Step 3: Commit**

```bash
git add apps/frontend/src/app/index.tsx
git commit -m "feat: add 'How it works' terminal demo to homepage"
```

---

### Task 4: Add "What it looks like" asset mockup to homepage

**Files:**
- Modify: `apps/frontend/src/app/index.tsx`

**Step 1: Add the AssetMockup component and render it in Home**

Add this component below `TerminalDemo` in the same file. It mimics the asset viewer page — mini header, markdown-style content, and a hint of the toolbar:

```tsx
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
```

Update the `Home` component:

```tsx
function Home() {
  return (
    <div className="flex flex-col items-center gap-24 px-6 py-24">
      <HeroSection />
      <TerminalDemo />
      <AssetMockup />
    </div>
  )
}
```

**Step 2: Verify the mockup renders**

Run: `cd apps/frontend && bun run build`
Expected: Build succeeds with no errors.

**Step 3: Commit**

```bash
git add apps/frontend/src/app/index.tsx
git commit -m "feat: add 'What it looks like' asset mockup to homepage"
```

---

### Task 5: Final build verification

**Step 1: Run a full production build**

Run: `cd apps/frontend && bun run build`
Expected: Build succeeds with zero errors and zero warnings.

**Step 2: Visual verification checklist**

Start the dev server (`bun run dev`) and verify:

1. **Homepage** (`/`):
   - "tokenrip" title, tagline, subtitle render correctly
   - npm install command has a working copy button
   - "GitHub" link opens `https://github.com/tokenrip/tokenrip-cli` in a new tab
   - "How it works" terminal demo shows 3 steps with green checkmarks
   - "What it looks like" mockup resembles the real asset viewer
   - No "Get tokenrip" CTA in the header (it's the homepage)
   - Light and dark themes both look correct

2. **Asset page** (`/s/any-uuid`):
   - "Get tokenrip →" appears in header between logo and theme toggle
   - Clicking it navigates to the homepage
   - Light and dark themes both look correct

**Step 3: Final commit (if any cleanup needed)**

Only if adjustments were needed during visual verification.
