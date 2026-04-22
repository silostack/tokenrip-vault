# Tokenrip Competitive Landscape Tracker

Running log of companies building in adjacent or overlapping spaces to Tokenrip's agentic collaboration layer. Focus: agent-native publishing, collaboration, coordination, and content infrastructure.

**Purpose**: Scout mode only — watch for tripwire signals, track positioning convergence, and monitor the "agentic collaboration" category as it forms.

**Note**: For agentic economy (agent payments, identity, yield, verification) competitive intelligence, see [[landscape-tracker]].

---

## The Landscape in One Frame

Tokenrip's core positioning claim: agents need a collaboration layer purpose-built for them — one where agents are first-class citizens, not guests in a human tool.

The competitive landscape is currently split into three camps, none of which directly attack this:

1. **Human collaboration tools with AI added** (Notion, Linear, Google Docs, Asana) — human-first, agent bolt-on via API
2. **Agent orchestration frameworks** (LangGraph, CrewAI, AutoGen) — agent task coordination, not artifact collaboration
3. **Emerging agentic publishing** (publish.new) — agents as buyers, not creators

The "agentic collaboration" label is now being used by at least two companies (Tokenrip, Alike). Watch for more entrants using this vocabulary in 2026.

---

## Companies

### publish.new
**URL**: https://publish.new/
**Built on**: Paragraph.com infrastructure
**Category**: Agent-native content marketplace / zero-friction publishing + monetization
**First tracked**: 2026-04-07

Zero-friction content publishing and marketplace with dual payment rails: humans pay via checkout, AI agents pay via x402. Same URL handles both. Core mechanic: upload file → set USD price → get shareable link. Four asset types: File, API, Link, Repo.

**Key insight — the design premise inversion**: publish.new treats agents as **buyers** of content. Tokenrip treats agents as the primary **creators** of content. Different design premise, different product.

**Threat level by layer**:
- **Layer 1 (Asset Routing)**: Medium — they've executed a simplified version with a monetization twist. Gap to programmatic agent publishing is narrow.
- **Layer 2 (Collaboration)**: None — zero versioning, comments, roles, lifecycle states
- **Layer 3 (Agent Runtime)**: Low — "API endpoint" gating type is a primitive precursor, far from the destination

**Full analysis**: [[product/tokenrip/publish-new-competitive-analysis-2026-04-07]]

---

### Alike
**URL**: https://alike.work/
**Raised**: a16z Speedrun SR006 (up to $1M, ~0% equity undisclosed; one of 70 companies from 19,000+ applicants). No additional disclosed funding.
**Team**: Addi Haran Diman (CEO, Oxford DPhil — Political Science & Social Data Science, Oxford Internet Institute; began at ~18; Oxford SU President 2024-25), Max Van Kleek (CTO, Oxford Associate Professor HCI, MIT PhD CSAIL — decentralized systems, semantic web, Solid project), Danial Hussain (CCO, ex-Sequoia-backed startup GTM).
**Stage**: Pre-launch waitlist. No live product, no pricing, no GitHub. Demo Day April 2026.
**Category**: Background coordination automation / agentic collaboration (waitlist)
**Tagline**: "Work moves faster when coordination runs itself."
**First tracked**: 2026-04-21

Background coordination automation agent for teams. Plugs into existing calendar, email, messaging, and meeting tools — learns workflow patterns — and autonomously handles status updates, thread replies, and check-ins. Core pain point: knowledge workers spending 58% of their workday on coordination overhead ("work about work").

**The deeper thesis** (from Addi's DPhil and Van Kleek's academic work): Coordination fails not because of bad habits but because actors lack *shared representations of state*. Human teams fail for this reason. AI agent teams will fail for the same reason. Alike's product targets the human side first — but the underlying protocol claim extends to agents.

Van Kleek (LinkedIn, reshared): *"Agentic collaboration and coordination, enabling different agents to converge on shared meaning through semantic common ground."*

This is not just a Slack bot thesis. It is a semantic common ground infrastructure claim.

**Core product (as marketed)**:
- Runs coordination workflows in the background — no human intervention required
- Status updates, thread replies, check-ins handled automatically
- Reads and writes to existing tools (calendar, email, messages, notes)
- "No migration, no disruption. Your team keeps working."
- Natural language interface to coordination state

**Target customer**: Mid-to-large knowledge worker teams (est. 20–200 people). Horizontal play — no vertical specificity. Persona: team leads and operators drowning in status threads and check-in meetings.

**AI-bolt-on vs AI-native assessment**:

Simon's initial read is correct at the marketing level. Alike's GTM pitch is progressive adoption ("no migration, no disruption") — the enterprise-safe, low-friction entry. This is the right pitch for existing enterprises with existing workflows.

The underlying academic thesis, however, is more foundational: if actors (human or AI) cannot access shared state, coordination fails. This claim, if they build to it, positions Alike as *infrastructure* rather than a feature layer.

The tension: their go-to-market is bolt-on; their research pedigree is protocol-native. Whether the shipped product is closer to "smarter Slack bot" or "semantic coordination protocol" is the key unknown.

**Unit of coordination distinction**:
- Alike's unit = **tasks, status, threads** (what humans do)
- Tokenrip's unit = **assets, artifacts** (what agents produce)

Even if Alike pivots to agent-to-agent coordination, they would be coordinating *actions* and *task states*, not *artifacts and documents*. These are adjacent layers, not identical.

**What they're NOT doing (today)**:
- Agent-produced artifact management (versioning, lifecycle, provenance)
- Asset publishing and rendering for agent output
- Human-in-the-loop artifact review and annotation
- Agent identity / registration infrastructure
- Programmatic publish APIs for agent creators
- Content monetization or marketplace mechanics
- Solana, x402, or crypto payment rails

**Threat level by Tokenrip layer**:
- **Layer 1 (Publish / Asset Routing)**: **None** — Alike doesn't touch content assets or publishing
- **Layer 2 (Collaboration / Versioning / Lifecycle)**: **Low today, Medium-Watch** — If their semantic common ground protocol extends to shared artifact state (not just task state), they converge toward this layer. Not today. Watch their first shipped product carefully.
- **Layer 3 (Agent-Native Runtime)**: **Low today, Medium-Watch** — Van Kleek's semantic common ground thesis could produce an agent coordination protocol that competes for the "how agents interact with each other" framing. Tokenrip's answer is assets and artifact handoffs; Alike's potential answer is shared semantic state. Adjacent, not identical — but close enough to blur positioning.
- **Positioning / Vocabulary**: **Medium** — They are using "agentic collaboration" language. If they ship a product with that label and get traction, they partially occupy the vocabulary before Tokenrip's blog content establishes the canonical framing. This is the near-term positioning risk, not the product risk.

**Partner angle**: Unlikely in the short term — different layers. Possible long-term: Alike coordinates the *task workflow* (what the agent is doing); Tokenrip manages the *artifact output* (what the agent produced). Natural complement in an enterprise agent stack. Not actionable until both products are live and the market has normalized two separate coordination layers.

**Key tripwire signals**:
1. Alike ships a live product beyond waitlist → read the product to see whether it's bolt-on SaaS or protocol infrastructure
2. Their first product includes artifact/document management → Layer 2 threat activates
3. Van Kleek publishes a paper or spec on "semantic common ground" for agents → protocol risk signal
4. Alike raises a seed round ($3M+) → accelerated execution; watch for team expansion into engineering
5. Alike announces enterprise design partnerships → validates the "existing enterprise" GTM thesis
6. Alike pivots or expands positioning toward "agents collaborate with agents" explicitly → direct convergence signal
7. Alike targets developer tooling or AI agent frameworks (LangGraph, CrewAI integrations) → they're moving toward the same user segment as Tokenrip

**What this validates for Tokenrip**:
- "Agentic collaboration" as a category is real — a16z is betting on it (via SR006 selection)
- The bolt-on vs AI-native framing is a genuine strategic fork, not just a philosophical preference
- The market for coordination infrastructure at the human layer is crowded (Asana, Linear, Notion, Slack bots) — which creates pressure on Alike to find differentiation in the agent layer
- Tokenrip's AI-native positioning is the uncrowded path: companies starting AI-first from day one, or developers building agent workflows who want artifact management without retrofitting human tools

---

## Observations

- **"Agentic collaboration" as a label is being claimed.** Alike is using it explicitly. Tokenrip's blog content (post-1-agentic-collaboration) should publish before this vocabulary gets attached to the bolt-on interpretation. The window is narrow — Alike is at Demo Day right now.
- **Alike's threat is vocabulary, not product.** There is no live product to compete with today. The risk is that a funded company with a16z backing uses the same category label and defines it toward human-team coordination, leaving Tokenrip fighting to reclaim the AI-native definition.
- **The bolt-on vs AI-native fork is a durable positioning asset.** Simon's read is right. Companies starting AI-native from day one (new startups, vibe coders, agent framework builders) are categorically different from existing enterprises adding AI to their workflows. Tokenrip owns the former; Alike targets the latter. These don't need to compete.
- **Alike's academic pedigree is double-edged.** Max Van Kleek's work on the Solid project (decentralized personal data) and semantic common ground suggests Alike may be more ambitious than their marketing reveals. But academic founders often ship slower than commercial founders. Tokenrip is already deployed; Alike is pre-launch.
- **No current competitor occupies Layer 2.** Neither publish.new nor Alike touches versioning, comments, lifecycle states, or provenance. Tokenrip's collaboration layer is uncontested.
- **The vocabulary gap is the urgent risk.** Not product competition. If "agentic collaboration" gets defined as "AI that handles your Slack threads," Tokenrip needs to clearly own the "agent-produced artifacts" definition first. The blog post is the mechanism for that.

---

## Tripwire Signals

| Signal | Who to watch |
|--------|-------------|
| Alike ships live product | Alike — read immediately: is it bolt-on SaaS or protocol infrastructure? |
| Alike announces artifact/document management feature | Direct Layer 2 activation — threat level upgrades |
| Van Kleek publishes semantic common ground spec | Protocol risk — Alike could become coordination standard for agent-to-agent state |
| Alike raises seed round ($3M+) | Execution acceleration; watch for engineering headcount |
| Alike integrates with LangGraph / CrewAI / Claude Code | Entering Tokenrip's developer segment |
| publish.new adds programmatic POST /publish API | Layer 1 commoditization risk for Tokenrip increases materially |
| publish.new adds versioning or annotation | Layer 2 competition begins — currently uncontested |
| Any new entrant uses "agentic collaboration" as product category | Vocabulary congestion signal — blog post urgency increases |
| Notion, Linear, or GitHub launches "agent-native" mode | Legacy tooling entering from above with distribution advantage |
| LangGraph or CrewAI launches artifact/output management | Orchestration frameworks entering from below with developer mindshare |
