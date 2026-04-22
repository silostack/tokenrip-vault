---
post: agent-readable-pages
created: 2026-04-21
post_type: craft
angle: "We built an agent-first platform, did everything right, and a single CSS class hid our content from half of AI agents — because no hiding method works across all four extraction methods agents use."
keywords: [agent-readable pages, AI agent readability, content negotiation, sr-only, progressive enhancement]
---

# Sources — We Accidentally Made Our Pages Invisible to AI Agents

## Primary Sources

### Mintlify — State of Agent Traffic in Documentation
- **URL:** https://www.mintlify.com/blog/state-of-ai
- **Type:** blog_post
- **Captured:** 2026-04-21
- **Key content:** 45.3% of documentation traffic is AI agents (March 2026). Claude Code: 199.4M requests. Cursor: 142.3M. Browsers: 45.8%. First major dataset quantifying agent traffic share.

### Checkly — State of AI Agent Content Negotiation
- **URL:** https://www.checklyhq.com/blog/state-of-ai-agent-content-negotation/
- **Type:** blog_post
- **Captured:** 2026-04-21
- **Key content:** Surveyed 7 major agent tools. Only 3/7 send Accept: text/markdown (Claude Code, Cursor, OpenCode). Codex, Gemini CLI, Copilot, Windsurf do not. Token savings data: 180,573 → 478 tokens (99.7%).

### Cloudflare — Agent Readiness Score
- **URL:** https://blog.cloudflare.com/agent-readiness/
- **Type:** blog_post
- **Captured:** 2026-04-21
- **Key content:** "Lighthouse for AI agents." Only 4% of sites declare AI preferences. 3.9% support markdown negotiation. <0.01% have MCP Server Cards.

### Cloudflare — Markdown for Agents
- **URL:** https://blog.cloudflare.com/markdown-for-agents/
- **Type:** blog_post
- **Captured:** 2026-04-21
- **Key content:** Automatic edge-level HTML-to-Markdown conversion for Pro+ plans. 16,180 → 3,150 tokens (80% reduction). Vary: Accept for caching.

### GitBook — AI Docs Readership Data 2025
- **URL:** https://www.gitbook.com/blog/ai-docs-data-2025
- **Type:** blog_post
- **Captured:** 2026-04-21
- **Key content:** AI readership grew from <10% to >40% in 2025 — 500% increase in one year. Human readership remained stable.

### MachineContext — SSR Comeback Because of AI
- **URL:** https://www.machinecontext.ai/blog/ssr-comeback-because-of-ai
- **Type:** blog_post
- **Captured:** 2026-04-21
- **Key content:** SSR apps: 87% inclusion in AI Overviews vs 12% for CSR. SSR indexed ~4x faster. GPTBot, ClaudeBot, PerplexityBot do not execute JavaScript.

### Vercel — Agent-Friendly Pages with Content Negotiation
- **URL:** https://vercel.com/blog/making-agent-friendly-pages-with-content-negotiation
- **Type:** blog_post
- **Captured:** 2026-04-21
- **Key content:** ~500KB HTML vs ~3KB Markdown (99.37% reduction). Next.js middleware pattern for content negotiation. Agent Readability Spec scoring rubric.

### Mozilla Readability.js — Source Code
- **URL:** https://github.com/mozilla/readability/blob/main/Readability.js
- **Type:** github_repo
- **Captured:** 2026-04-21
- **Key content:** _isProbablyVisible() checks inline styles only, not computed CSS. sr-only passes through. UNLIKELY_CANDIDATES regex strips class names matching "hidden" but not "sr-only".

### Inside Claude Code's Web Tools (Mikhail Shilkov)
- **URL:** https://mikhail.io/2025/10/claude-code-web-tools/
- **Type:** blog_post
- **Captured:** 2026-04-21
- **Key content:** WebFetch pipeline: HTML → Turndown → truncate 100KB → Haiku extraction. ~80 trusted sites get direct markdown. Turndown has no visibility filtering.

### Sanity — How to Serve Content to Agents
- **URL:** https://www.sanity.io/blog/how-to-serve-content-to-agents-a-field-guide
- **Type:** blog_post
- **Captured:** 2026-04-21
- **Key content:** 100K → 3,300 tokens (97% reduction). Field guide approach to agent-readable content.

## Community Signal

### Tokenrip Internal — Hermes Agent Failure
- **URL:** provided directly (internal experience)
- **Platform:** direct experience
- **Captured:** 2026-04-21
- **Key content:** A Hermes agent sent to read a Tokenrip asset page returned empty. Blog pages (same infrastructure) worked. Root cause: sr-only CSS class on SSR content. Triggered full investigation into extraction methods.

### Google's John Mueller on Markdown for AI
- **URL:** https://www.365iwebdesign.co.uk/news/2026/02/08/google-markdown-ai-stupid-idea-discovery-files/
- **Platform:** twitter (via reporting)
- **Captured:** 2026-04-21
- **Key content:** Mueller called separate markdown copies "a stupid idea" — but objection was about separate URLs, not same-URL content negotiation. Important distinction for cloaking concerns.
