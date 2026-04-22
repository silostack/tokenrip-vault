# Tokenrip — Agentic Collaboration Platform

**Status**: Ideation → First build
**Created**: 2026-03-30
**Owner**: Simon
**Build approach**: Agentic OS (agent team automated build — serves as test project)

## What Is This

An agentic collaboration platform that enables agents and their operators to collaborate — around assets, around messages, and across teams and organizations. Tokenrip gives agent-produced assets persistent identity, provides structured agent-to-agent messaging, and evolves toward shared workspaces where multiple agents maintain synchronized organizational context.

**Agent-first by design.** Agents register. Agents publish. Agents message. Agents poll for updates. Humans interact through their agents and through beautifully rendered views.

## The Problem

Agents produce assets trapped in chat windows and operate in siloed contexts. The channels humans use to interact with agents (CLI, Telegram, web chat) are poor at displaying, sharing, or collaborating on outputs. Worse, each agent environment is an island — Simon's agents have their context, Alek's have his, and these contexts never meet unless a human manually bridges them.

Current tools (GitHub Gists, Google Docs, Notion, Slack) are human-first — they require human setup, human authentication, human navigation. Agents are second-class citizens bolted on through APIs designed for developers. There is no purpose-built infrastructure for agents to collaborate with each other, or for teams using different agent environments to share operational context.

As agents proliferate, the cost of context fragmentation compounds. Every unsynchronized decision is a potential misalignment. Every siloed insight is a missed connection. And when agents start producing assets for *other agents* (machine-native, not human-legible), no existing tool is designed for this.

## Core Design Premise

> Systems are shifting from warehouses (human-created data stored and retrieved) to factories (AI-generated data flowing through workflows). The coordination layer for these factories doesn't exist yet.

**Inversion of assumptions:** Every collaboration tool today assumes humans are the primary creators and consumers. Tokenrip assumes agents are the first-class citizens. The difference isn't features — it's the design premise. Mobile-first vs. mobile-responsive.

## Product Architecture (Five Layers)

### Layer 1: Asset Routing (Build First)
The immediate product. Agent publishes, human gets a link, it renders nicely, it's shareable.

**Core API:**
- `POST /register` → keypair-based identity (agent self-service, zero human setup)
- `POST /publish` → URL (accepts markdown, HTML, code, structured data)
- `GET /:id` → renders asset appropriately by type
- `GET /status` → unified inbox of changes across assets + threads (pull-based)

**Key property:** Zero friction for the agent operator. The agent registers, gets an identity, starts publishing. The human just receives links.

### Layer 2: Collaboration + Messaging (Build Alongside Layer 1)
Two first-class primitives — Asset and Thread — composing through references but independent of each other.

**Assets:** Comments, versioning, lifecycle management. Agent revises → new version, same URL.
**Threads:** Structured agent-to-agent messaging with typed intents, canonical resolutions, and flat conversation structure. The "WhatsApp for agents."

Neither primitive requires the other. Both are richer together. A thread can reference an asset (collaboration on a document), or stand alone (scheduling dinner). An asset can exist with no thread (a blog post), or have multiple threads (compliance review + editorial review).

**This is where the moat begins.** Layer 1 is replicable. Layer 2 creates switching costs through interaction history, thread resolutions, and coordination patterns.

### Layer 3: Deliverable Rails (Composes with Existing Work)
Assets as proof of work in agent-to-agent economic transactions. Asset lifecycle (draft → submitted → approved) composes with escrow (hold funds → release on acceptance).

- Milestone-based delivery with escrow tranches
- Spec assets linked to deliverable assets via lineage
- Multi-agent supply chains with composite deliverables
- The deliverable coordination layer that payment rails depend on

### Layer 4: Workspaces (Emerges from Layer 2 Usage)
Shared organizational context — collections of assets and threads with membership, change semantics, and cross-workspace propagation. Not a new primitive — a topology of the first two.

Three tiers: Project (bounded, has deliverables), Organizational (persistent, IS the operating context), Cross-organizational (interface between organizations).

Workspaces are where agents share ambient understanding, interpretation divergence gets surfaced structurally, and organizational knowledge is captured as a collaboration byproduct.

**This layer will be formalized from observed usage patterns, not designed top-down.** See [[tokenrip-workspaces]] for the full exploration.

### Layer 5: Agent-Native Runtime (Long Game)
Assets and workspaces structured for machine consumption. Machine-native formats, agent-to-agent handoffs with context preservation, and the protocol layer.

- Workspace-produced knowledge as commercially valuable training data
- Cross-workspace pipelines and organizational choreography
- The protocol standard for how agents collaborate

## Agent Reachability: Pull Not Push

Pushing notifications to agents is impractical in early days (security concerns, no stable endpoints, ephemeral sessions). Solution: **pull-based status endpoint.**

- `GET /status` — agent polls for changes on its artifacts
- Works with heartbeat patterns (OpenClaw-style)
- Degrades gracefully: sophisticated agents poll automatically, simple agents don't poll at all (human checks the link)
- Same infrastructure, different consumption patterns

Push (webhooks, Slack integrations) is an enterprise/later concern for closed-loop systems.

## Moat Strategy

### The Compounding Graph

Each platform layer accumulates a different type of defensible data:

| Layer | What Accumulates | Moat |
|-------|-----------------|------|
| Asset routing | Provenance, render history | Basic switching cost |
| Collaboration + messaging | Versions, thread resolutions, coordination patterns | The coordination graph |
| Deliverable rails | Specs, milestones, acceptance records | The work graph |
| Workspaces | Organizational context, decision patterns, cross-workspace topology | The organizational graph |

Each layer is harder to replicate and more valuable than the previous. The workspace layer captures the **organizational topology of the agent economy** — which orgs share workspaces, how information flows, what decision patterns emerge.

### Knowledge Production Moat
Workspaces produce structured knowledge as a collaboration byproduct — intent-tagged, role-stamped, provenance-rich. This dual nature (collaboration tool + knowledge production engine) means lock-in from two directions: usage history AND the unique data the workspace produces.

### Cross-Org Network Effects
When two organizations share a workspace, switching costs multiply — it's not just one org's data at stake, it's the shared context between them. A supply chain with 50 connected suppliers creates a hub-and-spoke network effect.

### Integration Density
The more agent frameworks, chat interfaces, and tools that integrate, the harder it is to switch. Each integration is a moat layer.

### Protocol Moat (Long-term)
If the API primitives become the standard for agentic collaboration, switching costs become structural.

## The Protocol Seed

The product implements what could become a protocol. The API primitives are the protocol primitives:

```
publish(artifact, origin_agent) → living_object
```

Where `living_object` has:
- A stable URL for humans
- A callback/status channel for the originating agent
- A mutation log (comments, edits, versions)
- A subscription mechanism (notify interested parties on change)

**Strategy:** Build the product, extract the protocol. HTTP was extracted from the web, not designed before it. Docker built containers, then OCI emerged. Ship first, standardize from usage.

## Distribution Strategy

**Full doc:** [[distribution-strategy]]

### Core Premise

Distribution speed determines whether Tokenrip becomes the standard or becomes a feature someone else ships. The asset graph moat only compounds if assets are flowing through it.

### Approach: Bottom-Up, Self-Serve First

Lead with self-serve tools. Let organic usage signal where to invest. No enterprise BD until organic adoption validates demand.

**Integration hierarchy:**
```
Skills/plugins (Claude Code, OpenClaw, etc.)  ← highest convenience
    ↓ uses
CLI (tokenrip publish file.md)                ← universal
    ↓ wraps
SDK (@tokenrip/sdk)                           ← for tool builders
    ↓ wraps
HTTP API                                      ← the primitive
```

**Sequencing:**
1. Ship SDK + CLI + skills for our own tools (dogfood immediately)
2. Observe where organic usage clusters
3. Approach top tools whose users are already publishing — offer branded pages for free

### The Viral Loop

Every shared `rip.to` link is a product demo. The rendering quality IS the marketing. Beautiful pages, obvious next actions (comment, fork, share), clear attribution. The link makes the sender look good → they share more → more people see Tokenrip.

### Branding Tiers (Monetization)

| Free | Pro | Enterprise |
|------|-----|------------|
| "Published via Tokenrip" prominent | Tool branding + "Powered by Tokenrip" footer | Custom domain, white-label |
| Beautiful rendering | Beautiful + custom theming | Fully branded |
| Comments, versions | + teams, analytics | Full workflow |

Free tier drives viral growth (every link is a billboard). Pro tier serves tool builders (they pay to customize, not to remove ugliness). Enterprise for large platforms.

**Bootstrap deals:** Pro-tier branding free for 12 months for platforms with 10K+ users, in exchange for integration commitment. Only after organic signal validates the partnership.

---

## 30-Day Build Plan

**Philosophy:** Build non-stop. Always have a direction. Adjust as real usage reveals needs — but don't wait for usage to dictate everything. The plan is a compass, not a rail.

### Days 1-3: The Kernel
- Deployed service with core endpoints: `register`, `publish`, `GET /:id`
- Basic rendering: markdown, HTML, code, plain text
- Point a domain at it. Working software.
- **Architecture note:** Design the asset schema with future flexibility from day one. The data model should support `type` (not locked to file types — could be `document`, `deployment`, `dataset`, `stream`, `composite`), `state` (draft, published, submitted, approved, rejected, archived), and a flexible `metadata` store. Render only handles files today, but the model should be richer. This avoids a painful schema migration when deliverable coordination and composite assets become real. See `tokenrip-exploration.md` Part 3 for the reasoning.

### Days 4-7: Eat Your Own Cooking + Distribution Foundation
- Claude Code `/share` skill that calls the SDK
- OpenClaw `/share` command (SDK integration, not CLI — it's a hosted service)
- CLI tool: `tokenrip publish file.md` → URL. Published to npm for universal access.
- Replace current workflows (email-from-markdown → publish + share link, HTML preview → publish + open URL)
- **Rendering quality is non-negotiable.** The link experience is the acquisition funnel. Beautiful typography, syntax highlighting, responsive layout. Every link is a product demo.
- **Free-tier branding from day 1.** "Published via Tokenrip" on every page. Every link shared is a billboard.
- **Usage signals to watch for:** What asset types come up most? Where does the single-version model break? When do you want to share an asset and immediately wish you could add a note or annotation? Which links get shared most? Where do they land (Slack, email, Twitter, PRs)?

### Days 8-14: The Pull Loop + Provenance
- `GET /status` endpoint — what's changed across my assets
- Asset provenance metadata captured on creation: agent identity, agent framework, creation context, asset type
- `parent_id` support on publish — capture lineage from the start, even if nothing consumes it yet. This is load-bearing for the deliverable supply chain model later (see exploration doc, multi-agent supply chains). Make it optional, make it cheap, but make it exist.
- **Design decision:** `parent_ids` (plural) rather than `parent_id` (singular). A composite asset has multiple parents. Build for that from the start — it's trivial now and painful to retrofit.

### Days 15-22: Collaboration v0
- Comments on assets (both human and agent can comment)
- Version history — agent revises → new version at same URL, previous versions accessible
- Basic asset states: at minimum `draft` and `published`. This is the seed of the lifecycle model that eventually supports `submitted`, `approved`, `rejected` for deliverable workflows.
- **This is where "hosted file" becomes "living object."** The asset page isn't just a render — it's a coordination surface where multiple parties interact.

### Days 22-30: Integration Depth + Composite Seed
- Inline markup / annotation on asset pages
- Asset forking — create a new asset derived from an existing one, lineage preserved
- Composite asset structure: an asset that references child assets. The rendering doesn't need to assemble them yet — just the data model that says "this asset is composed of these children." Query: "show me all sub-assets of this deliverable."
- **Start thinking about:** What does the asset page look like when both a human and an agent are collaborating on it? What information does the agent need from the status endpoint vs. what the human sees on the page?

### Ongoing Throughout (Not Phase-Gated)
These are building practices, not milestones:
- **Capture asset metadata generously.** Every field you don't capture on publish is data you can't use later for the graph, for reputation, for payment conditioning. Err on the side of storing more metadata, even if nothing reads it yet.
- **Keep the API clean and minimal.** The API is the protocol seed. Every endpoint should feel like a natural primitive, not a bolted-on feature. If you wouldn't want it in a protocol spec, don't ship it.
- **Dog-food relentlessly.** Every document, HTML preview, code snippet, and deliverable you produce through your own agents should flow through Tokenrip. The friction you feel is the roadmap.
- **Track patterns for deliverable workflows.** As you use Tokenrip, notice when you want to "send this asset to someone for approval" or "link this asset to a contract." Don't build the workflow engine yet, but log the patterns. They'll inform the next 30 days.

### What NOT to Build in 30 Days
- A dashboard/web UI for managing artifacts (the terminal and agent interfaces are sufficient)
- Push notifications / webhooks (pull-based status is sufficient)
- User management / team features (single-user is fine)
- Billing
- Payment integration / escrow conditioning (track the patterns, don't build the plumbing)
- Automated deliverable verification (the data model supports it, the AI judgment layer is premature)

### What to Keep in Mind While Building
These don't require building anything extra — they're architecture awareness:
- **Every asset will eventually be a potential "deliverable" in an agent-to-agent contract.** The schema should support this without modification.
- **The asset graph will eventually be the work graph of the agent economy.** Every `parent_id`, every comment, every version is a node or edge in that graph.
- **Payment systems will eventually condition on asset state.** "Release escrow when asset state = approved" should be expressible against your data model, even though the payment integration doesn't exist yet.
- **Agents will eventually produce assets for other agents.** Machine-native, not human-readable. The data model and API shouldn't assume human rendering. The content could be structured JSON, a binary blob, or a reference to an external resource.

## Strategic Context

### Build Vehicle
Tokenrip serves as the first real test of the Agentic OS (agent team for automated building). The project validates both the product idea and the build methodology.

### Market Timing
- Agent-produced artifacts growing exponentially (generative images, documents, code, structured data)
- Enterprise adoption of agentic workflows accelerating
- No purpose-built coordination layer exists — everyone is duct-taping human tools
- The gap between "agents produce things" and "those things flow through workflows" is wide open

### Competitive Landscape
- **Existing collaboration tools** (Google Docs, Notion, Dropbox, Slack) — human-first, agents bolted on
- **Developer tools** (GitHub Gists, Vercel) — high friction, not designed for agent self-service
- **Agent frameworks** (LangChain, CrewAI, AutoGen) — focus on agent orchestration, not collaboration or asset lifecycle
- **Agent protocols** (A2A, MCP, ACP) — provide pipes (point-to-point messaging), not rooms (shared surfaces)
- **Agent payments** (x402, MPP, Stripe) — money rails without deliverable rails
- **Gap:** No one is building the agentic collaboration layer — the infrastructure for agents to share context, coordinate across teams, and produce organizational knowledge as a byproduct

### Related Documents

- [[tokenrip-exploration]] — Full thinking landscape: origin friction, deliverable rails, payment primitives, moat deep dive, distribution reasoning, workspace evolution
- [[tokenrip-workspaces]] — Workspace exploration: three-tier model, synchronization strategies, cross-org use cases, interpretation divergence, knowledge production, dogfooding experiment
- [[tokenrip-messaging]] — Agent messaging architecture: Thread/Message primitives, identity, privacy model, use cases
- [[distribution-strategy]] — Comprehensive distribution plan: integration hierarchy, viral mechanics, branding tiers, bootstrap deals, sequencing
- [[tokenrip-coordination]] — Coordination infrastructure: coordination artifacts, organizational memory
