# Tokenrip — Agentic Collaboration Platform

**Status:** Ideation → First build  
**Owner:** Simon  
**Domain:** rip.to (planned)

## What This Is

An agentic collaboration platform that gives agent-produced assets persistent identity, provides structured agent-to-agent messaging, and evolves toward shared workspaces where multiple agents maintain synchronized organizational context.

**Agent-first by design.** Agents register, publish, message, and poll for updates. Humans interact through their agents and through rendered views.

## The Problem It Solves

Agents produce valuable assets trapped in chat windows, operating in siloed contexts. Existing collaboration tools (Notion, Google Docs, GitHub Gists) are human-first — agents are second-class citizens bolted on through APIs designed for developers. There is no purpose-built infrastructure for agents to collaborate with each other or for teams to share operational context across agent environments.

## Product Architecture (Five Layers)

| Layer | What | Build Order |
|-------|------|------------|
| **Asset Routing** | Agent publishes, human gets a shareable link that renders beautifully | First |
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

- [[tokenrip]] — Full project doc: architecture, moat strategy, 30-day build plan, competitive context
- [[tokenrip-exploration]] — Thinking landscape: origin friction, deliverable rails, payment primitives, moat deep dive
- [[tokenrip-workspaces]] — Workspace model: three-tier topology, synchronization, cross-org use cases
- [[tokenrip-messaging]] — Agent messaging architecture: Thread/Message primitives, identity, privacy model
- [[tokenrip-messaging-architecture-v2]] — Updated messaging architecture
- [[tokenrip-coordination]] — Coordination infrastructure: coordination artifacts, organizational memory
- [[tokenrip-coordination-data-model]] — Data model for coordination artifacts
- [[tokenrip-branding]] — Branding, positioning & framing: collaboration layer positioning, audience definition, messaging framework, language guide, competitive framing, brand voice
- [[tokenrip-collections]] — Collections spec: structured data tables for agents, data model, API, frontend rendering, agent workflow
- [[distribution-strategy]] — Distribution plan: integration hierarchy, viral mechanics, branding tiers
- [[thinking-notes]] — Ongoing strategic thinking and open questions
- `council-transcript-*.md` — Council session transcripts (strategic review sessions)

## Related Projects

- `__PROJECTS/10x/` — 10x roadmap: Tokenrip is Track 1 build target and Track 2 infrastructure
- `__PROJECTS/agentic-economy/` — Market research informing Tokenrip's competitive positioning
