# Custom GPT + Product Hunt Launch

**Status**: developing
**Created**: 2026-05-25
**Last touched**: 2026-05-25

## Thesis

Tokenrip's mounted-agent architecture — where agents live on Tokenrip and are accessed through any AI platform — is best demonstrated, not explained. A Product Hunt launch with a hero research agent accessible from ChatGPT (custom GPT), Claude Code (MCP), Codex, and Cowork makes the portability thesis visceral in 60 seconds. The custom GPT is not the product; it is one surface among many. The product is "your AI work, saved and portable."

## Positioning

### Core Claim

**"Your AI work, saved and portable across every platform."**

The universal pain: everyone who uses AI regularly has produced valuable work in a conversation and then lost it, copy-pasted it awkwardly, or couldn't hand it off. Tokenrip fixes this by making AI work durable — artifacts that persist, version, share, and follow you across platforms.

### Positioning Hierarchy

1. **"Your AI work"** — the universal pain. Resonates with anyone who uses ChatGPT, Claude, Copilot. Not insider language. Not "research agent" or "agentic infrastructure." Just: the stuff you make with AI.
2. **"Saved and portable"** — what Tokenrip does about it. Two words, immediately understood.
3. **Research agent** — the hero demo that proves the claim. Not the pitch itself.
4. **Cross-platform** — the "oh, and also" that makes the architecture click. Secondary hook.

### What This Is NOT

- Not "a research tool" — the research agent is the demo vehicle, not the product
- Not "an AI assistant" or "a chatbot" — it's infrastructure for AI work
- Not architecture-first — no mention of "mounted agents" or "imprints" on launch day
- Not competing with ChatGPT wrappers — competing with the *absence* of a system for AI work

### Target Audience

**Power users of AI platforms.** People who use ChatGPT/Claude/Copilot daily, produce real work with it, and have felt the pain of ephemeral sessions. They don't need to be developers, but they're beyond casual use. Product Hunt audience skews heavily toward this profile.

Not targeting: casual users (don't care about portability), enterprise buyers (too niche for launch day), developers specifically (too narrow).

## Product Hunt Launch Structure

### Headline

**Tokenrip — Your AI work, saved and portable across every platform**

### Tagline Options

- "Stop losing what your AI builds for you"
- "Your AI work finally goes somewhere"
- "Save it. Share it. Pick it up from any platform."

### Demo Video (60 seconds, three beats)

1. **Claude Code** — "Research the current state of AI agent infrastructure." Agent produces a research brief. Artifact saved to Tokenrip — visible URL, version 1.
2. **ChatGPT (custom GPT)** — "What have I been researching?" Agent pulls up the same brief. "Update this with the latest from OpenAI dev day." Artifact updated — version 2, changes visible.
3. **Web dashboard** — Both versions visible. Click "share." Shareable link generated. A colleague opens it, hands it to *their* agent on *their* platform to continue.

**Punchline:** "The research lives on Tokenrip. The AI platforms are just windows. Switch models, switch platforms — your work stays yours."

### Landing Page Structure

- **Above the fold:** Headline + demo video + "Get started" CTA
- **Below the fold:** "Works with Claude Code, ChatGPT, Codex, Cowork" (logos). "Build any workflow — research, operations, client management — and your artifacts follow you everywhere."
- **How it works:** Three-panel visual. (1) Do work in any AI platform. (2) Artifacts saved to Tokenrip automatically. (3) Access from anywhere, share with anyone.
- **Use cases:** Research briefs, project operations, client management, content production. Each one sentence.

## Technical Requirements

### What Exists

- Tokenrip API: artifact creation, retrieval, versioning, auth
- CLI + MCP server (Claude Code surface)
- Web dashboard (artifact viewing)

### What Needs Building / Polish

- **Custom GPT**: Wire Actions to Tokenrip API via OpenAPI spec. Configure OAuth flow so users authenticate with their Tokenrip account. System prompt encoding the research agent workflow.
- **OAuth provider**: Tokenrip needs to act as (or integrate with) an OAuth provider for the GPT Actions flow.
- **Web artifact view**: Polish the shareable URL experience — clean rendering, version history visible, share button.
- **Demo video production**: Screen recordings across three surfaces, edited into 60-second narrative.
- **Product Hunt page**: Copy, screenshots, maker comments, first-day engagement plan.

### Custom GPT Capabilities (researched 2026-05-25)

- **Auth**: OAuth supported. GPT redirects user to Tokenrip login, receives access token, passes it on all API calls. Backend identifies user.
- **Memory**: Native GPT memory is lightweight fact-accumulation — irrelevant. All real persistence via Tokenrip API through Actions.
- **Actions**: Call any external REST API via OpenAPI schema. Supports authenticated calls. The GPT becomes a thin conversational UI over Tokenrip's API.
- **Knowledge files**: 20 files max, 512MB each. Useful for embedding SOPs or workflow templates, not critical for MVP.
- **Instructions**: 8,000 character limit in GUI; overflow goes into knowledge files.
- **GPT Store**: Not a distribution channel ($0.03/conversation, no paywall). The GPT is distributed via direct URL, not store discovery.

## Strategic Context

### Why This Matters for Tokenrip

This is not a pivot — it's a demonstration surface for the mounted-agent thesis. The custom GPT proves that agents don't have to live inside one platform. Tokenrip is the substrate; platforms are surfaces. The Product Hunt launch makes this thesis tangible to a broad audience.

### Relationship to Current Priority (Get a Sale)

The Product Hunt launch is a distribution event, not a sales motion. It could produce inbound interest, early adopters, and signal for what resonates. It does not replace the forward-deployed-engineer sales playbook — it complements it by creating public proof of the platform's capability.

### Parked Angles

- **Project operations agent** ("morning briefing" pattern) — strong second showcase after launch. Same architecture, different use case. Validates that the platform is horizontal, not a research tool.
- **Client/deal agent** — BD-focused variant. Remembers every conversation, every commitment. Prep in Claude Code, notes in ChatGPT, summary on dashboard.
- **Vertical-specific GPTs** (COI Review Operator, Vendor Intake Review, etc.) — from the original research. These are forward-deployed-engineer plays, not Product Hunt plays. Build these for specific customers, not for the store.

## Evolution

- **2026-05-25**: Idea emerged from researcher's custom GPT analysis. Initial framing was "build a GPT as a product surface." Reframed through Bean session to: GPT is one surface among many; the Product Hunt launch demonstrates portability, not a GPT product. Research agent selected as hero demo. "Your AI work" chosen as the universal pain hook over "research agent" (insider language) or "portable agents" (architecture language). Fork B (platform launch with research agent as demo) chosen over Fork A (research agent as the product).

## Key Challenges Surfaced

- **"AI work" must land instantly** — if the phrase requires explanation, the launch fails. Current read: it resonates naturally with anyone who uses AI regularly. Monitor for confusion in early feedback.
- **Demo must be smooth** — the 60-second video is the entire pitch. Rough edges in the cross-platform flow kill credibility. Infrastructure exists but needs polish.
- **GPT Store is not distribution** — the custom GPT must be distributed via direct URL, not store discovery. Product Hunt itself is the distribution event.

## Open Questions

- What's the exact OAuth implementation path? (Auth0 / custom / existing Tokenrip auth)
- Timeline — when to target the Product Hunt launch?
- Should the custom GPT be publicly listed in the GPT Store (for discoverability even if marginal) or private (URL-only)?
- What's the "get started" flow for someone who clicks from Product Hunt? Sign up → install CLI → try the research agent? Or sign up → use the custom GPT immediately?
- Pricing: free tier for launch? What's the conversion trigger to paid?

## Non-Obvious Connections

- [[mounted-agent-model]] — the custom GPT is literally a mounted agent: imprint lives on Tokenrip, GPT is one harness among many
- [[custom-interfaces-on-artifacts-thesis]] — the shareable artifact URL is a custom interface on an artifact; the GPT, Claude Code, and web view are three different interfaces on the same artifact
- [[chief-of-staff-agent]] — the project operations agent (parked) is a direct extension of this work
- [[distribution-experiment-framework]] — Product Hunt launch is a distribution experiment; tag it to what it tests (attention + curiosity, not supply or revenue)
