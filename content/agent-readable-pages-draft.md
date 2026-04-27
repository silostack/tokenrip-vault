---
title: "We Accidentally Made Our Pages Invisible to AI Agents"
slug: agent-readable-pages
post_type: craft
created: 2026-04-21
word_count: 1447
sources: content/sources/agent-readable-pages/references.md
keywords: [agent-readable pages, AI agent readability, content negotiation, progressive enhancement]
meta_description: "One CSS class hid our content from half of AI agents. Here's the extraction matrix that shows why no single fix covers all four ways agents read the web."
---

# We Accidentally Made Our Pages Invisible to AI Agents

An agent told us it couldn't read our page. We'd built an agent-first platform with content negotiation (serving different formats from the same URL based on what the client requests), server-side rendering, JSON-LD, llms.txt, the full playbook. An agent fetched one of our asset URLs and came back with nothing.

Our blog pages worked fine. Same infrastructure. Same deployment. The difference was a single CSS class.

## Half your audience already changed

[Mintlify](https://www.mintlify.com/blog/state-of-ai), which powers docs for Anthropic, Stripe, Cursor, and hundreds of others, published traffic data in March 2026: AI coding agents account for 45.3% of all documentation requests. Nearly tied with browsers at 45.8%. Claude Code alone generated 199 million requests that month, more than Chrome on Windows. [GitBook](https://www.gitbook.com/blog/ai-docs-data-2025) saw a 500% increase in AI readership over a single year. Human traffic held flat.

If agents can't parse your pages, your content doesn't exist to them. And making pages agent-readable is harder than following best practices, because there is no single way agents read the web.

## Four extraction methods, four different realities

When we dug into why that agent failed, we assumed there was one thing to fix. There were four.

HTTP fetch + Markdown conversion is the most common pipeline. The agent fetches raw HTML, converts it to Markdown (usually via the Turndown library), and feeds the result to the LLM. Claude Code, Firecrawl, and most custom pipelines [work this way](https://mikhail.io/2025/10/claude-code-web-tools/). Turndown has zero visibility filtering. It converts everything in the DOM, including `display: none` and `sr-only` content. But pipelines upstream often strip content before Turndown ever sees it.

Readability extraction works like Firefox Reader Mode. A headless browser renders the page, then Mozilla's [Readability.js](https://github.com/mozilla/readability/blob/main/Readability.js) identifies the "main content" and discards the rest. Jina Reader uses this. The wrinkle: Readability checks inline styles (`style="display:none"`) but is blind to CSS classes. It cannot tell that `.sr-only` applies `position: absolute; clip: rect(0,0,0,0)`. So sr-only content passes through. But elements with class names matching "hidden" or "sidebar" get stripped by a pattern-matching heuristic, not a CSS parser.

Accessibility tree extraction reads the data structure browsers build for screen readers. [Playwright MCP's](https://github.com/microsoft/playwright-mcp) `browser_snapshot`, Stagehand, and ChatGPT's Atlas browser use this. Wildly token efficient: around 200-400 tokens per page versus thousands for raw DOM. Content hidden with `display: none` or `aria-hidden` is excluded. But `.sr-only` content is explicitly included, because that is what sr-only was designed for: making content available to the accessibility tree.

And then there's screenshot + vision: the agent screenshots the page and a vision model interprets it. If content isn't visually rendered, the model can't see it.

The matrix:

| Hiding method | HTML + Turndown | Readability | Accessibility tree | Screenshot |
|---|---|---|---|---|
| `.sr-only` (CSS class) | Included | Included | Included | Not visible |
| `display: none` (inline) | Included | Stripped | Excluded | Not visible |
| `aria-hidden="true"` | Included | Stripped | Excluded | Visible |
| Same color as background | Included | Stripped | Excluded | Not visible |

No single hiding method behaves consistently across all four. Hide content from humans with CSS, and some agents see it, some don't, depending entirely on which extraction pipeline they happen to use.

## The sr-only trap

We shipped the wrong pattern.

Every asset URL on our platform is both a web page and an API endpoint. We had content negotiation: `Accept: text/markdown` returns raw content, `Accept: application/json` returns metadata. SSR put content in the HTML before any JavaScript runs. JSON-LD, link headers, meta tags, robot rules. A `StaticContent` component rendered raw content directly into the server-side HTML: markdown in a `<div>`, code in `<pre><code>`, JSON in `<pre>`. The content was in the DOM.

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

Our blog worked differently:

```html
<!-- Content visible first, raw in the DOM -->
<div id="markdown-source">${content}</div>
<div id="markdown-rendered" class="hidden"></div>
```

The blog renders content visibly. JavaScript reads the raw source, renders it pretty, then hides the original. Content is visible to everything at first. Every agent that hit our blog could read it.

The asset page hid content from the start. It worked for agents using raw HTML parsing or the accessibility tree. It broke for readability extractors and vision tools. Same content, same infrastructure, different CSS philosophy. That one choice determined whether an agent saw a full page or an empty one.

## Content negotiation won't save you alone

The popular answer to agent readability is content negotiation. Agent sends `Accept: text/markdown`, server returns clean Markdown from the same URL. Standard HTTP. Token savings of 80-99% depending on the page. We already had it.

Didn't help.

[Checkly surveyed seven major agent tools](https://www.checklyhq.com/blog/state-of-ai-agent-content-negotation/) in February 2026. Three send `Accept: text/markdown`: Claude Code, Cursor, and OpenCode. Codex requests HTML. Gemini CLI sends `*/*`. Copilot requests HTML. Windsurf sends `*/*`. The agent that exposed our problem used a generic HTTP fetch that doesn't know content negotiation exists.

From the server side: [Cloudflare found](https://blog.cloudflare.com/agent-readiness/) only 3.9% of sites support markdown content negotiation. Only 4% declare AI preferences of any kind. The ecosystem is heading toward content negotiation as the standard, and it's the right direction. [Cloudflare now converts pages at the edge automatically](https://blog.cloudflare.com/markdown-for-agents/), Mintlify and Stripe serve markdown, GitBook lets you append `.md` to any URL. But half of agent tools don't request it and 96% of sites don't support it. Content negotiation is a piece of the stack, not a substitute for it.

## The fix is twenty years old

We removed `sr-only` and added styling that matches the interactive viewer's layout:

```tsx
<article className="mx-auto max-w-5xl px-6 py-8">
  <StaticContent asset={asset} textContent={textContent} />
</article>
```

There's a brief flash, maybe 100-200 milliseconds, of styled but unformatted content before React hydrates and replaces it with the full interactive viewer. Syntax highlighting, rendered markdown, copy buttons, version history. The styling makes the flash look intentional (same max-width, same padding, same font family) rather than broken.

Every extraction method can now read the content. Content negotiation still works for agents that request it.

The web development community worked this out in the mid-2000s and called it progressive enhancement. Serve the content first. Make it visible and parseable by anything that hits the URL. Layer JavaScript on top for browsers that execute it. Twenty years later, the audience changed but the principle didn't need to.

## No single layer covers every agent

We ended up stacking five things on top of each other because every time we thought we'd covered the last gap, another extraction method proved us wrong.

SSR is the floor. If content requires JavaScript to appear in the DOM, most agents never see it. GPTBot, ClaudeBot, and PerplexityBot do not execute JavaScript. [MachineContext found](https://www.machinecontext.ai/blog/ssr-comeback-because-of-ai) SSR applications see 87% inclusion in AI Overviews versus 12% for client-rendered apps.

On top of SSR, make the content visible. Skip the sr-only and display-none and aria-hidden tricks. Show the raw content, style it so the hydration flash looks intentional, let JavaScript enhance it after. Most teams skip this layer because it feels wrong to show unstyled content, even briefly.

Then content negotiation. `Accept: text/markdown` with `Vary: Accept` for correct caching. [Cloudflare does this at the edge](https://blog.cloudflare.com/markdown-for-agents/) for Pro+ plans, so you don't even need to touch your origin.

Then discovery signals: `/llms.txt`, `<link rel="alternate" type="text/markdown">`, JSON-LD, `robots.txt` with AI crawler rules. And if you want to go further, structured APIs like MCP servers or WebMCP declarations for agents that go beyond fetching URLs.

## The audience changed. The principle didn't.

The accessibility tree, built for screen readers, is now the literal interface that Playwright MCP and Stagehand use to read pages. The `sr-only` class, invented to give screen reader users context that sighted users get from layout, is now how AI agents get content when they use that tree. The web standards community spent decades building infrastructure for one non-visual audience. A second one showed up and started using it immediately.

[Cloudflare measured](https://blog.cloudflare.com/agent-readiness/) 96% of sites as unprepared for agents. That gap will close fast as the tooling gets easier. But right now, fixing it is a CSS change and some HTTP headers. Wait, and you're fixing it after half your traffic has already decided your pages are empty.
