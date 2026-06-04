# Tokenrip ChatGPT App — Launch Design

**Date:** 2026-05-26
**Status:** Design draft (pre-engineering)
**Type:** High-level design doc; foundation for engineering implementation plan

---

## Executive Summary

Tokenrip will launch a ChatGPT-native application built on OpenAI's **Apps SDK** (Model Context Protocol), positioned as **the collaboration layer for AI work**. The product enables AI work — research, analysis, documents, decisions — to persist as shared artifacts that can be handed off across people, platforms, and time. A research workflow serves as the hero demo, but the platform is horizontal: the same MCP server simultaneously powers ChatGPT, Claude Desktop, Claude Code, Cursor, and VS Code, with one codebase serving all surfaces.

The onboarding is single-player by design — install, use, produce something useful, no account required. Collaboration emerges naturally at the moment of sharing: an anonymous publish creates a shareable URL; signing in unlocks owned, versioned, cross-platform artifacts. This sequencing reflects the observed market reality that single-player precedes multiplayer in AI products, even when the architecture is fundamentally multi-party.

Distribution follows a two-track strategy: submit to the ChatGPT App Directory for credibility, but treat **direct-install via Developer Mode** as the primary distribution channel. This avoids dependence on curated directory placement, which is empirically winner-take-most.

The launch event is Product Hunt. The demo shows a single artifact being produced in one platform, evolved in another, and shared with a colleague who picks it up in their own AI environment — making collaboration across platforms visceral in 60 seconds.

---

## Strategic Context

### The Pain Being Addressed

AI work today is trapped. Every AI platform user produces meaningful work inside chat sessions — research summaries, analysis, drafts, decisions — and discovers that the work cannot leave the session it was born in. It cannot be handed to a colleague to continue. It cannot be picked up on another platform. It cannot evolve as more context arrives. The current workaround is copy-pasting into Google Docs, which discards the conversational context that produced the work and breaks the link to the AI that created it.

The pain has two faces, both addressed by the same product:

- **Solo pain (single-player):** "I made something good in ChatGPT yesterday. I want to continue it in Claude today. I can't."
- **Team pain (multiplayer):** "I made something good in ChatGPT. I want my colleague to continue it from where I left off, on whichever AI platform they use. I can't."

Both pains are universal across ChatGPT, Claude, Copilot, and Cursor users. Neither requires category education.

### Why Now

Three platform shifts converge in 2026 to make this launch viable:

1. **Apps SDK launched October 2025**, with the App Directory opening for general submissions December 17, 2025. The platform is new and the bar for "wow" is still low.
2. **MCP became the standard** for cross-platform agent tooling. ChatGPT, Claude Desktop, Claude Code, Cursor, VS Code, and Goose all support MCP. One server can serve all surfaces.
3. **Custom GPTs are demonstrably saturated** — 3M created, $0.03/conversation payouts, no meaningful discovery. The Apps SDK is the post-GPT-Store distribution surface.

### Strategic Fit

This launch is downstream of three existing Tokenrip theses:

- **Coordination as the scarce resource in the agent era.** Production is solved (any model can produce output). Discovery and communication protocols are being built. But the actual surface where AI work can be coordinated, handed off, and iterated on across people and platforms does not exist. Tokenrip fills that gap; the launch makes the gap legible.
- **Mounted-agent model** — agents live on Tokenrip; AI platforms are surfaces. The ChatGPT app is one such surface among many.
- **Custom interfaces on artifacts** — any AI can generate UI against the artifact; Tokenrip hosts the artifact at a stable URL. The Apps SDK inline widget is a literal expression of this thesis inside ChatGPT.

The collaboration positioning is not a marketing choice; it is the platform's actual product description. Tokenrip is the coordination layer for AI work. Earlier framings ("save your AI work," "portable agents") describe features, not the product.

The launch does not replace the forward-deployed-engineer sales motion. It complements it by creating public proof of cross-platform capability and producing a distribution surface for inbound interest. "Your AI collaboration layer" is also a materially easier enterprise pitch than "we save your AI work" — collaboration is a recognized category that procurement understands.

---

## Positioning

### Core Claim

> **"The collaboration layer for AI work."**

### Positioning Hierarchy

1. **Collaboration** — the category. Recognized, defensible, infrastructure-shaped. Procurement knows what to do with it; users know what it means.
2. **AI work** — the scope. Everything users produce with AI: research, analysis, drafts, decisions, briefs.
3. **Cross-platform** — the table stakes. Real collaboration requires that work move between people and platforms; this is the architectural answer.
4. **Research workflow** — the hero demo. Concrete, visceral, easy to show. Demonstrates collaboration without requiring multiple users on screen at once (research collaborates across platforms and across time).

### Tagline Candidates

- "Collaborate on AI work across every platform"
- "Where AI work happens together"
- "Your team's shared AI workspace"
- "AI work, finally collaborative"

### What This Is NOT

- Not "a research tool" — research is the demo vehicle, not the product
- Not "an AI assistant" — Tokenrip is infrastructure for AI work, not a model
- Not "save your AI work" — that framing describes a feature; the product is collaboration
- Not architecture-first — no mention of mounted agents, imprints, or MCP on launch day
- Not competing with ChatGPT memory or wrappers — competing with the absence of a coordination layer for AI work

### Category Position

Tokenrip occupies a category that does not yet exist: **AI collaboration**. The adjacent categories users already know:

- **Notion / Confluence** — collaborative knowledge, no AI-native coordination
- **Figma / Canva** — collaborative creation, single-domain (design)
- **Linear / Jira** — collaborative work tracking, no AI artifacts
- **Slack / Teams** — collaborative communication, no persistent artifacts
- **ChatGPT / Claude / Cursor** — AI assistants, no collaboration layer

Tokenrip is the missing piece: collaboration native to AI work, across any AI platform. The absence of any direct competitor is the differentiation.

---

## Architecture Overview

### High-Level Model

```
┌─────────────────────────────────────────────────────────┐
│                    Tokenrip Platform                     │
│  (artifacts, versioning, auth, storage, sharing layer)  │
└─────────────────────────────────────────────────────────┘
                          ▲
                          │
              ┌───────────┴───────────┐
              │  Tokenrip MCP Server  │
              │  (single codebase)    │
              └───────────┬───────────┘
                          │
        ┌─────────┬───────┴───────┬─────────┬──────────┐
        │         │               │         │          │
   ┌────▼───┐ ┌───▼────┐ ┌────────▼───┐ ┌───▼───┐ ┌────▼────┐
   │ChatGPT │ │ Claude │ │Claude Code │ │Cursor │ │ VS Code │
   │Apps SDK│ │Desktop │ │   (CLI)    │ │       │ │ Copilot │
   │widget  │ │connector│ │            │ │       │ │  Chat   │
   └────────┘ └────────┘ └────────────┘ └───────┘ └─────────┘
```

### Key Architectural Decisions

**Apps SDK over Custom GPT.** The custom GPT with Actions path is strictly inferior: text-only responses, OpenAI-locked, no path to other platforms. Apps SDK delivers rich inline widgets in ChatGPT and a single MCP server that serves every other major platform.

**OAuth 2.1 + PKCE with Dynamic Client Registration.** Required by the Apps SDK spec. Tokenrip will act as an OAuth provider (or integrate with Auth0/Logto/Stytch). The flow is auto-handled — users see one consent screen, then the connection persists across conversations, sessions, and devices.

**Tokenrip backend is the source of truth.** All persistence, versioning, sharing, and account state lives in Tokenrip. The MCP server is a thin layer that exposes Tokenrip's existing API as MCP tools. ChatGPT and other platforms are surfaces.

**Graceful degradation across surfaces.** ChatGPT renders rich interactive widgets via the Apps SDK iframe. Other platforms (Claude, Cursor, VS Code) render the same tool responses as text/markdown. Tool response payloads must be designed to be useful in both modes.

### Apps SDK Specifics

- **Widget rendering:** Sandboxed HTML/CSS/JS iframe, rendered **inline in the conversation thread**. Three display modes: inline (default), picture-in-picture, fullscreen. Interactive — users click buttons, fill forms, copy URLs directly inside the widget.
- **Tool invocation:** ChatGPT routes based on (a) `@Tokenrip` prefix in messages, (b) conversational context (auto-surfacing), or (c) explicit selection from the Apps menu.
- **Communication:** Widget ↔ MCP server via `window.openai` bridge over JSON-RPC postMessage.
- **Constraints:** 45-second tool timeout, 100K character request/response limits, HTTPS-only MCP endpoint.

---

## User Experience

### Single-Player to Multiplayer by Design

The product onboards as single-player. Collaboration emerges naturally at the point of sharing — not as an upfront commitment. This sequencing reflects market reality: AI users are in solo mode today, even when the underlying need is collaborative. Asking for team setup, multi-user invites, or workspace creation up front would break adoption.

The transition from solo use to collaboration happens at a single moment: **the publish action**. Before publish, the user is alone with their AI work. After publish, the work has a URL, an audience, and the potential for handoff. The product never asks the user to "set up collaboration" — it just makes the next collaborative step trivial whenever the user is ready.

### Three-Tier Engagement Model

**Tier 1 — Just use it (solo).** No login, no Tokenrip account. The app produces artifacts in the conversation. Value delivered immediately. The user is collaborating with themselves; the platform doesn't make a big deal of it.

**Tier 2 — Publish anonymously (collaboration moment).** When the user produces something substantial, the app surfaces an offer: *"This brief is ready. Want me to publish it? You'll get a shareable link — no account needed."* On confirm, the artifact is published to Tokenrip with a UUID URL — publicly accessible (obfuscated, not indexed), no account required, no attribution. **This is the moment solo becomes collaborative.** The user just gained an audience.

**Tier 3 — Own it (full collaboration).** Sign in to Tokenrip. Artifacts now belong to the user — versioned, searchable, accessible from any AI platform via the same MCP backend. Cross-platform handoff activates. Sharing with specific people (not just public URLs) activates. The collaboration thesis is fully unlocked.

Each tier naturally pulls toward the next. Use → make something good → want to share → publish (collaboration begins). Publish a few → want to find them later, update from another platform, or share with specific people → log in (collaboration deepens).

### Key User Journeys

**Journey A — Solo use, first share (the most common path):**
1. User installs Tokenrip in ChatGPT (Developer Mode paste-URL or App Directory).
2. User types: *"Tokenrip, research the current state of AI agent infrastructure."*
3. The app produces a research brief. Inline widget shows the artifact preview.
4. Widget offers: *"Publish this? Get a shareable link, no account needed."*
5. User clicks Publish. Widget updates inline with the public UUID URL and a copy button.
6. User shares the URL — by Slack, email, or DM. **Collaboration begins.**

**Journey B — Cross-platform self-handoff (the launch demo):**
1. In Claude Code: research begins, artifact created on Tokenrip.
2. In ChatGPT (Apps SDK widget): same artifact, fetched and displayed. *"Tokenrip, update my latest brief with what happened at OpenAI dev day."* Artifact updated — version 2.
3. On web dashboard: both versions visible, diff visible, shareable URL.
4. Punchline: AI work that travels with you. The artifact lives on Tokenrip; platforms are surfaces.

**Journey C — Multi-party handoff (the collaboration moment):**
1. Colleague clicks a Tokenrip artifact URL shared by the user.
2. Sees a clean rendered artifact page (not a chat export) — document-like, with version history.
3. Subtle footer: "Published via Tokenrip." Affordance: "Continue this in your own AI."
4. One-click import lets the colleague pick up the work on their own platform — Claude, ChatGPT, Cursor, anywhere.
5. Their changes can flow back if the artifact is owned (Tier 3) or fork into a new version if anonymous (Tier 2).

Journeys A and B are the launch demos. Journey C is the long-tail viral mechanic — every shared URL is a potential install path for the recipient.

### The Published Artifact Page

The first surface a non-Tokenrip user sees. Critical first-impression surface.

Requirements:
- Clean artifact rendering (treat as a document, not a chat export)
- Metadata: created date, version number, last updated
- Subtle "Published via Tokenrip" footer with link — no banner, no CTA
- Optional: "Import this artifact" / "Continue this research" affordance for one-click handoff to the reader's own AI environment

---

## Distribution Strategy

### The Reality of the App Directory

The ChatGPT App Directory is **submission-open, visibility-curated**. Approved-but-invisible is the default state. "Enhanced distribution" (featured placement) is earned through usage metrics — but the chicken-and-egg is real. Featured slots go to apps with existing brand recognition (Spotify, Canva, Figma, Adobe, GitHub).

Tokenrip should not depend on directory featuring for distribution.

### Two-Track Distribution

**Track 1 — App Directory submission (credibility).**
- Submit per OpenAI's process: app info, MCP endpoint, test credentials, privacy policy, screenshots.
- Expect 2-6 week review with possible rejection cycles.
- Goal: "available in ChatGPT App Directory" claim for marketing/credibility.
- Featured placement is upside, not plan.

**Track 2 — Direct-install via Developer Mode (primary channel).**
- Plus/Pro/Business/Enterprise users (~10M+ paid users): Settings → Apps → Advanced → Developer Mode → paste Tokenrip MCP URL.
- No OpenAI review required. No directory approval needed.
- One landing-page section: 30-second install instructions for ChatGPT.
- Same pattern works for Claude Desktop, Cursor, VS Code, Claude Code with platform-specific instructions.

### The Make.com Pattern

The custom-interfaces-on-artifacts thesis applies directly: own the URL, own the artifact, drive users to it. Don't depend on curated surfaces. The landing page becomes the install hub, with one set of instructions per platform.

### Launch Event

**Product Hunt launch** is the demand-generation moment. Drives the initial wave of installs through direct-install instructions. Captures attention from the broader tech audience beyond ChatGPT users.

**App Directory submission** runs in parallel (timing-permitting). The directory listing produces a long tail of organic discovery for months after launch.

---

## Build Scope (High-Level)

### What Exists

- Tokenrip API: artifact creation, retrieval, versioning, sharing
- Web dashboard: artifact viewing
- CLI / MCP server (Claude Code surface) — needs review/extension

### What Must Be Built

1. **Tokenrip MCP server** — exposes Tokenrip API as MCP tools. Hosted on Tokenrip infrastructure. HTTPS, OAuth 2.1 + PKCE auth.
2. **Apps SDK widget(s)** — inline interactive UI components for ChatGPT. At minimum: artifact preview/publish card. Stretch: artifact browser, version diff.
3. **OAuth provider integration** — Tokenrip acts as (or integrates with) OAuth 2.1 provider supporting Dynamic Client Registration.
4. **Anonymous publish endpoint** — generates UUID artifact URLs without user authentication.
5. **Public artifact page polish** — clean rendering, metadata, subtle Tokenrip footer, optional "Import this artifact" affordance.
6. **Landing page install hub** — 30-second install instructions per platform (ChatGPT Developer Mode, Claude Desktop Custom Connector, Cursor, VS Code, Claude Code).
7. **Privacy policy URL** — required for App Directory submission and OAuth integration.
8. **Demo video** — 60-second cross-platform narrative.

### What's Deferred

- Apps SDK rich widgets beyond the artifact card (deck previews, charts, browsers) — v2.
- Claude Cowork support (partnership-gated; not a launch priority).
- Per-platform UX polish beyond ChatGPT — graceful text/markdown degradation is sufficient for launch.
- Project operations agent and other "second showcase" demos — parked for post-launch.

---

## Risks and Open Questions

### Risks

- **App Directory invisibility.** Direct-install distribution should be sufficient for launch, but if Plus/Pro install friction is too high, the funnel breaks.
- **Cross-platform UX inconsistency.** ChatGPT users see a beautiful widget; Claude users see text. Some viewers of the demo may dismiss "portability" if they compare experiences naively.
- **Review timeline opacity.** OpenAI's App Directory review can take 2-6 weeks with no expedited path. If launch timing depends on directory approval, the plan slips.
- **Naming non-uniqueness.** GPT/App names cannot be reserved. A competitor could submit "Tokenrip" simultaneously. Mitigations: trademark, publish first, verified domain link.
- **Knowledge file exfiltration** (if used). Not relevant if all persistence flows through MCP tools, which is the planned architecture.
- **Collaboration framing without multiplayer demo.** Positioning as "the collaboration layer" while shipping a single-player onboarding flow risks the criticism that the product "isn't really collaborative." Mitigation: the publish→share→continue flow IS the collaboration demo; ensure Journey C is visible in the marketing narrative and Product Hunt page, even if the hero video stays solo-cross-platform for clarity.
- **Category confusion with established collaboration tools.** "Collaboration" invites comparisons to Notion, Figma, Slack. Mitigation: tagline copy must consistently anchor on "AI work" — the noun matters. "AI collaboration" is a new category; "collaboration" alone is a crowded one.

### Open Questions for Engineering

- Which OAuth provider: build custom, or integrate Auth0/Logto/Stytch?
- MCP server: hosted alongside existing Tokenrip API, or separate deployment?
- Widget framework: vanilla HTML/CSS/JS, or framework (React/Vue) within the iframe constraint?
- Versioning model: how is the existing Tokenrip artifact versioning exposed as MCP tools?
- Telemetry: what's the minimum instrumentation needed to measure launch success?

### Open Questions for Launch Planning

- Target launch date — when is the realistic Product Hunt ship?
- Pricing model — free tier scope, paid tier trigger, conversion mechanic?
- App Directory submission timing — submit before, at, or after Product Hunt launch?
- Demo video production — internal or external?

---

## What's Next

1. **Engineering implementation plan** — detailed technical spec covering MCP server architecture, widget implementation, OAuth integration, and deployment. This document is the foundation for that plan.
2. **Launch timeline** — sequencing of build milestones, App Directory submission, demo video production, Product Hunt launch.
3. **Pricing decision** — separate brainstorm/strategy session.
4. **Naming and trademark check** — confirm "Tokenrip" is defensible as an app name across the surfaces.

---

## References

- [[mounted-agent-model]] — core architectural thesis
- [[custom-interfaces-on-artifacts-thesis]] — directly expressed by the Apps SDK widget pattern
- [[agentic-artifact-coordination]] — the coordination thesis that grounds the collaboration positioning
- [[custom-gpt-product-hunt-launch]] — earlier Bean ideation; this doc supersedes the implementation framing
- Bean insight: *Single-player precedes multiplayer in agent-era products* — the principle that shapes the single-player onboarding for a collaboration product
- Bean insight: *Coordination as the scarce resource in the agent era* — the principle that justifies "collaboration layer" as the actual product description
- OpenAI Apps SDK docs: https://developers.openai.com/apps-sdk
- ChatGPT App Directory submission: https://help.openai.com/en/articles/20001040
- Developer Mode (custom MCP install): https://help.openai.com/en/articles/12584461
- MCP specification: https://modelcontextprotocol.io
