---
title: "We Accidentally Made Our Pages Invisible to AI Agents"
slug: agent-readable-pages
post_type: craft
created: 2026-04-21
word_count: 1551
sources: content/sources/agent-readable-pages/references.md
keywords: [agent-readable pages, AI agent readability, content negotiation, progressive enhancement]
meta_description: "We built an agent-first platform, did everything right, and one CSS class hid our content. Here's the extraction matrix that explains why."
---

# We Accidentally Made Our Pages Invisible to AI Agents

An agent told us it couldn't read our page. We'd built an agent-first platform with content negotiation, server-side rendering, JSON-LD, llms.txt, the full playbook. A Hermes agent fetched one of our asset URLs and came back with nothing.

Our blog pages worked fine. Same infrastructure. Same deployment. The difference was a single CSS class.

## Half your audience already changed

Mintlify, which powers docs for Anthropic, Stripe, Cursor, and hundreds of others, published traffic data in March 2026: AI coding agents account for 45.3% of all documentation requests. Nearly tied with browsers at 45.8%. Claude Code alone generated 199 million requests that month, more than Chrome on Windows. GitBook saw a 500% increase in AI readership over a single year. Human traffic held flat.

If agents can't parse your pages, your content doesn't exist to them. And making pages agent-readable is harder than following best practices, because there is no single way agents read the web.

## Four extraction methods, four different realities

When we dug into why that Hermes agent failed, we assumed there was one thing to fix. There were four.

HTTP fetch + Markdown conversion is the most common pipeline. The agent fetches raw HTML, converts it to Markdown (usually via the Turndown library), and feeds the result to the LLM. Claude Code, Firecrawl, and most custom pipelines work this way. Turndown has zero visibility filtering. It converts everything in the DOM, including `display: none` and `sr-only` content. But pipelines upstream often strip content before Turndown ever sees it.

Readability extraction works like Firefox Reader Mode. A headless browser renders the page, then Mozilla's Readability.js identifies the "main content" and discards the rest. Jina Reader uses this. The wrinkle: Readability checks inline styles (`style="display:none"`) but is blind to CSS classes. It cannot tell that `.sr-only` applies `position: absolute; clip: rect(0,0,0,0)`. So sr-only content passes through. But elements with class names matching "hidden" or "sidebar" get stripped by a regex. A heuristic, not a CSS parser.

Accessibility tree extraction reads the data structure built for screen readers. Playwright MCP's `browser_snapshot`, Stagehand, and ChatGPT's Atlas browser use this. It is wildly token efficient, around 200-400 tokens per page versus thousands for raw DOM. Content hidden with `display: none` or `aria-hidden` is excluded. But `.sr-only` content is explicitly included. That is the entire point of sr-only: it exists for the accessibility tree.

Screenshot + vision is the brute force option. The agent screenshots the page and a vision model interprets it. If content isn't visually rendered, the model can't see it.

The matrix:

| Hiding method | HTML + Turndown | Readability | Accessibility tree | Screenshot |
|---|---|---|---|---|
| `.sr-only` (CSS class) | Included | Included | Included | Not visible |
| `display: none` (inline) | Included | Stripped | Excluded | Not visible |
| `aria-hidden="true"` | Included | Stripped | Excluded | Visible |
| Same color as background | Included | Stripped | Excluded | Not visible |

No single hiding method works across all four. Hide content from humans with CSS, and some agents see it, some don't, depending on their pipeline. The only approach that works for all of them: make the content visible.

## The sr-only trap

We shipped the wrong pattern.

At Tokenrip, every asset URL (`/s/{uuid}`) is both a web page and an API endpoint. We had content negotiation, where `Accept: text/markdown` returns raw content and `Accept: application/json` returns metadata. SSR put content in the HTML before any JavaScript runs. JSON-LD, link headers, meta tags, robot rules. A `StaticContent` component rendered raw content directly into the server-side HTML: markdown in a `<div>`, code in `<pre><code>`, JSON in `<pre>`. The content was in the DOM.

The problem was one class name:

```tsx
// During SSR: content in the DOM but hidden from view
if (!mounted) {
  return (
    <article className="sr-only">
      <StaticContent asset={asset} textContent={textContent} />
    </article>
  )
}
// After React hydrates: replace with interactive viewer
return <AssetViewer asset={asset} />
```

Tailwind's `sr-only` applies `position: absolute; width: 1px; height: 1px; clip: rect(0,0,0,0)`. Visually invisible, but present in the DOM and the accessibility tree. The idea was that agents would parse the HTML and find it. Humans would never see raw content flash before the pretty viewer loaded.

Our blog did the opposite:

```html
<!-- Content visible first, raw in the DOM -->
<div id="markdown-source">${content}</div>
<div id="markdown-rendered" class="hidden"></div>
```

The blog renders content visibly. JavaScript reads the raw source, renders it pretty, then hides the original. Content is visible to everything at first. Every agent that hit our blog could read it.

The asset page hid content from the start. It worked for agents using raw HTML parsing or the accessibility tree. It broke for readability extractors, vision tools, and the Hermes agent that surfaced the problem.

Same content. Same infrastructure. Different CSS philosophy. One was universally readable. One wasn't.

## Content negotiation won't save you alone

The popular answer to agent readability is content negotiation. Agent sends `Accept: text/markdown`, server returns clean Markdown from the same URL. Standard HTTP. Token savings of 80-99% depending on the page. We already had it.

Didn't help.

Checkly surveyed seven major agent tools in February 2026. Three send `Accept: text/markdown`: Claude Code, Cursor, and OpenCode. Codex requests HTML. Gemini CLI sends `*/*`. Copilot requests HTML. Windsurf sends `*/*`. The Hermes agent that exposed our problem used a generic HTTP fetch that doesn't know content negotiation exists.

From the server side: Cloudflare found only 3.9% of sites support markdown content negotiation. Only 4% declare AI preferences of any kind. The ecosystem is heading toward content negotiation as the standard, and it's the right direction. Cloudflare now converts pages at the edge automatically, Mintlify and Stripe serve markdown, GitBook lets you append `.md` to any URL. But half of agent tools don't request it and 96% of sites don't support it. It's a piece of the answer, not the answer.

## The fix is fifteen years old

We removed `sr-only` and added styling that matches the interactive viewer's layout:

```tsx
<article className="mx-auto max-w-5xl px-6 py-8">
  <StaticContent asset={asset} textContent={textContent} />
</article>
```

There's a brief flash, maybe 100-200 milliseconds, of styled but unformatted content before React hydrates and replaces it with the full interactive viewer. Syntax highlighting, rendered markdown, copy buttons, version history. The styling makes the flash look intentional (same max-width, same padding, same font family) rather than broken.

Every extraction method can now read the content. Content negotiation still works the same way. `Accept: text/markdown` returns raw Markdown through a separate handler.

This is progressive enhancement. The same principle the web development community worked out in the mid-2000s, now with a new audience. Serve the content first. Make it visible and parseable by anything that hits the URL. Enhance it with JavaScript for humans who have browsers that execute it.

The raw server-rendered content is what matters. The pretty JavaScript version is the enhancement.

## What the full stack looks like

No single technique covers every agent pipeline, which is how we ended up stacking five things on top of each other.

SSR is the floor. If content requires JavaScript to appear in the DOM, most agents never see it. GPTBot, ClaudeBot, and PerplexityBot do not execute JavaScript. SSR applications see 87% inclusion in AI Overviews versus 12% for client-rendered apps (MachineContext, March 2026).

On top of SSR, make the content visible. Not sr-only, not display-none, not aria-hidden. Show the raw content, style it so the hydration flash looks intentional, let JavaScript enhance it after.

Then content negotiation. `Accept: text/markdown` with `Vary: Accept` for correct caching. Cloudflare does this at the edge for Pro+ plans, so you don't even need to touch your origin.

Then discovery signals: `/llms.txt`, `<link rel="alternate" type="text/markdown">`, JSON-LD, `robots.txt` with AI crawler rules. And if you want to go further, structured APIs like MCP servers or WebMCP declarations for agents that go beyond fetching URLs.

Each layer catches agents the previous one misses.

## The audience changed. The principle didn't.

Making web content agent-readable is the same problem the accessibility community has been working on for decades, and we keep rediscovering it. Screen reader users and AI agents both need semantic HTML, content that parses without a visual renderer, and document structure that doesn't depend on CSS layout.

The accessibility tree, built for screen readers, is now the literal interface that Playwright MCP and Stagehand use to read pages. `sr-only`, invented to give screen reader users context that sighted users get from layout, is now the class AI agents rely on when they use that tree.

Curb cuts were built for wheelchairs. They turned out to help parents with strollers and delivery workers too. Captions were built for deaf users. They turned out to help people in noisy airports and non-native speakers. Agent readability is going to be the same story. Clean HTML, semantic structure, progressive enhancement: you do it for agents and it turns out you also improved SEO, accessibility, performance, and the experience for humans.

Cloudflare measured 96% of sites as unprepared for agents. That number will look different in a year. The question is whether you fix it now, when it's a CSS change and some HTTP headers, or later, when half your traffic has already decided your pages are empty.
