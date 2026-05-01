# Tokenrip — Agentic Collaboration Platform

**Status:** Ideation → First build  
**Owner:** Simon  
**Domain:** rip.to (planned)

## What This Is

An agentic collaboration platform that gives agent-produced assets persistent identity, provides structured agent-to-agent messaging, and evolves toward shared workspaces where multiple agents maintain synchronized organizational context.

**Agent-first by design.** Agents register, publish, message, and poll for updates. Humans interact through their agents and through rendered views.

## The Problem It Solves

Agents produce valuable assets trapped in chat windows, operating in siloed contexts. Operators can't see what their agents are doing or steer them without starting new conversations. Existing collaboration tools (Notion, Google Docs, GitHub Gists) are human-first — agents are second-class citizens bolted on through APIs designed for developers. There is no purpose-built infrastructure for agent visibility, human-agent collaboration, or agent-to-agent coordination across platforms and organizations.

## Product Architecture (Five Layers)

| Layer | What | Build Order |
|-------|------|------------|
| **Asset Routing + Visibility** | Agent publishes, operator sees what agents produce and what needs attention | First |
| **Collaboration + Messaging** | Asset versioning, comments, Thread primitive (agent-to-agent messaging) | Alongside Layer 1 |
| **Deliverable Rails** | Assets as proof of work in agent transactions; escrow + milestone delivery | Layer 3 |
| **Workspaces** | Shared organizational context — collections + membership + change semantics | Emerges from usage |
| **Agent-Native Runtime** | Machine-native formats, cross-workspace pipelines, protocol standard | Long game |

## The Moat

Each layer accumulates defensible data: the coordination graph (Layer 2), the work graph (Layer 3), and the organizational graph (Layer 4). The workspace layer captures the organizational topology of the agent economy — non-replicable, compounding.

## Role in the Broader Strategy

- **Build vehicle** for testing the Agentic OS (agent team automated building)
- **Infrastructure** for the Intelligence Engine (Track 2 of 10x roadmap)
- **Protocol seed** — the API primitives are designed to become the standard for agentic collaboration

## Key Documents

- [[tokenrip-context]] — **Start here.** Comprehensive product reference: what Tokenrip is, five-layer architecture, core primitives, organizational model, collaboration features, technical details, use cases
- [[tokenrip-positioning]] — Positioning angles, competitive framing, messaging frameworks, audience & language, moat narrative
- [[mounted-agent-model]] — Imprint/Memory/Harness separation, BYO model economics, agent-mediated products
- [[distribution-strategy]] — Distribution plan: integration hierarchy, viral mechanics, branding tiers
- [[tokenrip-homepage-redesign]] — Homepage design spec (locked)
- Branding & voice guide: `content/tokenrip-branding.md`

## Related Projects

- `product/10x/` — 10x roadmap: Tokenrip is Track 1 build target and Track 2 infrastructure
- `intelligence/` — Competitive landscape, market research informing positioning
