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

4. **Enterprise "context layer" platforms** (Zaro, Dust, Microsoft IQ, Snowflake Cortex Sense, Atlan) — shared context for internal agents, anti-vendor-lock-in positioning. Three funded entrants in 30 days (Dust $40M, Nessie YC, Zaro $5.1M) validate the category. "Shared context layer" is now a commodity phrase; "mounted agents" remains Tokenrip's alone.

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

### gitlawb
**URL**: https://gitlawb.com/
**Category**: Decentralized git for AI agents / agentic collaboration infrastructure
**First tracked**: 2026-04-22
**Stage**: v0.1.0-alpha, live network (3 nodes), token deployed on Base L2

Decentralized, federated GitHub replacement for AI agents. Built on IPFS, libp2p, DIDs (W3C standard), and UCAN capability tokens. No accounts — identity is an Ed25519 keypair; every API request is cryptographically signed. MCP server with 15 tools targets Claude Code directly (their quickstart Step 3 is `claude_desktop_config.json`). Live network: ~1,923 repos, ~1,547 agents, ~837 pushes across 3 nodes.

**The positioning collision**: gitlawb describes itself as "the collaboration layer for AI agents" — the same vocabulary claim as Tokenrip. The underlying primitive is different (code repositories vs. content assets), but the vocabulary overlap creates positioning risk as the category forms.

**Threat level by Tokenrip layer**:
- **Layer 1 (Asset Publishing)**: Low — gitlawb publishes code; Tokenrip publishes content assets. Different primitive today.
- **Layer 2 (Collaboration / Versioning)**: Low-Medium — git-native versioning for code. If Playground evolves to non-code assets, this converges.
- **Layer 3 (Agent Runtime)**: Medium — both platforms treat agents as first-class citizens with identity, trust scores, and delegation (UCAN). Adjacent primitives.
- **Positioning / Vocabulary**: High — using "collaboration layer for AI agents" in developer circles. Race to define the category.

**Key signals**: Token ($GITLAWB on Base L2) adds developer friction that Tokenrip avoids. First monetized product (Spawn — $9/month crypto trading agent) signals infrastructure monetization is unsolved. Technical journal (6 posts in 6 weeks) runs the same distribution bet as Intelligence Engine.

**Full analysis**: [[intelligence/research/gitlawb-competitive-analysis-2026-04-22]]

---

### Default
**URL**: https://www.default.com/
**Raised**: $10.6M ($6.6M seed from Craft Ventures + $4M from 8VC)
**Revenue**: $9.6M (2024)
**Team**: ~64 people. CEO: Nico Ferreyra.
**Customers**: Hex, OpenPhone, Bland AI, StackBlitz, People Data Labs, Cortex
**Category**: GTM agent infrastructure / adjacent platform
**First tracked**: 2026-05-27

AI infrastructure platform for revenue teams. Started as inbound lead routing (Chili Piper competitor), repositioning as "the next sales and marketing cloud." Four components: unified data layer (identity-resolved across CRMs, forms, enrichment), workflow builder (no-code, conditional logic), AI agent "Dot" (natural language → working systems, human-in-the-loop), governance (review/logging/rollback). 50+ integrations including MCP, webhooks, Zapier.

**Strategic thesis** (CEO Sacra interview): Inbound is the wedge to own "territories, segments, and global user ID." Switzerland positioning — neutral across the stack. Land with sub-30-person companies, expand as they grow. Predicts GTM stack consolidation in 3-4 years. Human-in-the-loop AI philosophy — doesn't believe in fully autonomous SDRs.

**Why this matters for Tokenrip**: Default validates the "infrastructure for AI agents in business operations" market ($9.6M revenue). Their hosted-agent model ("Dot") is precisely the economic model that mounted agents disrupt — Default pays for inference, faces capability ceilings, and inherits pricing pressure from model deflation. Their MCP support creates a technical bridge for mounted agents to interact with their data layer. Their #1 weakness (inbound only, no outbound) is a concrete opportunity for mounted-agent operators.

**Threat level by Tokenrip layer**:
- **Layer 1 (Asset Routing)**: **None** — Default routes leads, not agent-produced assets
- **Layer 2 (Collaboration)**: **Low** — workflow builder enables agent-human coordination, but only within GTM context
- **Layer 3 (Deliverable Rails)**: **None** — no transaction/escrow layer
- **Layer 4 (Workspaces)**: **Medium** — "marketing database" is a lightweight workspace for GTM objects. Expansion beyond GTM would converge.
- **Layer 5 (Agent Runtime)**: **Low** — Dot is a hosted agent with natural-language configuration. No cross-platform portability, no imprint separation.
- **Positioning / Vocabulary**: **Low** — different category label ("AI infrastructure for revenue teams" vs. "agentic collaboration"). No vocabulary collision.

**Partnership potential**: **High**. MCP integration exists. Default's inbound-only gap is Tokenrip's opportunity. ICP overlap (Series A-C, ops-heavy, lean teams) creates channel access. Actionable after Tokenrip has a live customer and documented case study. See `active/research-default-com-2026-05-27.md` for the concrete partnership play.

**Key tripwire signals**:
1. Default expands Dot beyond GTM into general-purpose business operations
2. Default announces "agent marketplace" or third-party agent support
3. Default drops hosted-agent model in favor of BYO-model or MCP-first architecture
4. Default raises a large round with "platform" positioning beyond revenue teams
5. Default acquires or partners with an outbound intelligence company

**Full analysis**: [[research-default-com-2026-05-27]]

---

### Zaro
**URL**: https://zaro.ai/
**Raised**: $5.1M pre-seed (Cherry Ventures lead; angels: Thomas Wolf / Hugging Face, Thomas Dohmke / GitHub CEO, Charlie Songhurst, Convergence co-founders Marvin Purtorab & Andy Toulis)
**Team**: 8 people. CEO Michael Bajwa (Convergence hire #1, Head of Product & Growth). CTO Qian Zheng. 5 of 8 from Convergence → Salesforce Agentforce.
**Stage**: Emerged from stealth 2026-06-09. Claims to dogfood internally (HR, finance, facilities).
**Category**: Enterprise AI workspace / shared context layer / anti-vendor-lock-in
**Tagline**: *"Build intelligence for your company. Not your vendor."*
**First tracked**: 2026-06-09

Enterprise AI-native workspace consolidating multiple AI tools. Shared context layer connects company data, decisions, workflows, and operational history. Marketplace of pre-built workflows. Multi-model routing (routine tasks to cheaper models; claims ~10x cost reduction). Application-building tools for custom solutions. Export/portability rights on accumulated context.

**The positioning collision**: Zaro uses "shared context layer" (same phrase as Nessie, Microsoft, Atlan) and an anti-vendor-lock-in thesis that mirrors Tokenrip's published five-layer lock-in analysis almost verbatim. CEO quote: *"Context compounds. Models commoditise."* — this is Tokenrip's thesis stated by someone else with Salesforce-insider credibility.

**Architecture comparison**:
- Zaro = hosted workspace platform. Context lives on Zaro's infrastructure, with export rights. A better vendor — not the absence of one.
- Tokenrip = architectural decomposition (imprint/memory/harness). Intelligence never enters a vendor's infrastructure. Structurally different, not incrementally better.
- Zaro solves layers 1-3 of Tokenrip's five-layer lock-in model (model, orchestration, data). Promises exportability at layer 4 (governance). Does not address layer 5 (behavioral lock-in) — the layer Tokenrip's mounted-agent architecture structurally solves.

**Why the Convergence/Agentforce pedigree matters**: The Convergence co-founders (Purtorab, Toulis) investing in Zaro = Salesforce insiders shorting Salesforce's architecture. Confirms that single-org, vendor-controlled context is structurally limited. But the team's demonstrated expertise is agent *execution* (dynamic UI navigation, adaptive interfaces), not enterprise *context infrastructure* (governance, compliance, behavioral portability).

**Threat level by Tokenrip layer**:
- **Layer 1 (Asset Routing)**: **None** — Zaro routes context to agents, not agent-produced assets to audiences
- **Layer 2 (Collaboration)**: **Low** — workspace collaboration exists but enterprise-internal only; no cross-org, no agent-to-agent artifact sharing
- **Layer 3 (Deliverable Rails)**: **None** — no transaction/escrow/milestone delivery layer
- **Layer 4 (Workspaces)**: **Medium** — shared organizational context is Zaro's core product. Single-org (like Dust). Tokenrip's workspace layer is cross-org by design.
- **Layer 5 (Agent Runtime)**: **Low-Medium** — multi-model routing + context layer creates a runtime. But agents are platform-hosted, not decomposed/portable.
- **Positioning / Vocabulary**: **High** — "shared context layer," "context compounds," "anti-vendor" framing all overlap with Tokenrip's published content. However, "mounted agents" and "synced minds" remain unclaimed.

**Key tripwire signals**:
1. Zaro announces cross-org context sharing → competitive surface widens significantly
2. Zaro targets financial services / equipment finance verticals → Quintel collision
3. Zaro's "app store" includes vertical-specific agent workflows → platform expansion
4. Cherry Ventures funds another "context layer" company → portfolio conflict for Tokenrip fundraise
5. Zaro publishes technical architecture details → reveals whether "context layer" is deep infrastructure or unified data platform with AI features
6. Zaro closes Salesforce-refugee enterprise customers → validates the anti-Agentforce pain signal
7. Zaro hires enterprise sales team → signals GTM acceleration
8. Zaro raises Series A → execution acceleration; watch for headcount and vertical expansion

**What this validates for Tokenrip**:
- "Context compounds, models commoditize" is now a funded thesis from multiple directions — use as category-validation proof
- Anti-vendor-lock-in positioning resonates with investors (Cherry, Wolf, Dohmke all bought it)
- The "mounted agents" vocabulary is the strongest remaining differentiator — "shared context layer" is now generic
- Cross-org capability is Tokenrip's clearest architectural moat — every context-layer competitor (Dust, Zaro, Microsoft, Nessie) is single-org or personal

**Full analysis**: [[research-zaro-competitive-analysis-2026-06-09]]

---

## Observations

- **"Shared context layer" is now a commodity phrase.** Microsoft (Fabric IQ), Snowflake (Cortex Sense), Atlan, Zaro, and Nessie all use it. "Agentic collaboration" is claimed by Alike, gitlawb, and Tokenrip. The only unclaimed vocabulary of strategic value: **"mounted agents," "synced minds," "layer 5 portability."** Blog Series 3 (mounted agents) and Series 4 (lock-in trap) are now category-defining stakes, not just content.
- **Three funded entrants in 30 days validate the category.** Dust ($40M, Sequoia), Nessie (YC F25), Zaro ($5.1M, Cherry/Wolf/Dohmke). All make the "context > models" argument. None occupies Tokenrip's architectural position (decomposed, cross-org, mounted agents). Use all three as category-validation proof — the "name them head-on" strategy scales.
- **Alike's threat is vocabulary, not product.** There is no live product to compete with today. The risk is that a funded company with a16z backing uses the same category label and defines it toward human-team coordination, leaving Tokenrip fighting to reclaim the AI-native definition.
- **The bolt-on vs AI-native fork is a durable positioning asset.** Simon's read is right. Companies starting AI-native from day one (new startups, vibe coders, agent framework builders) are categorically different from existing enterprises adding AI to their workflows. Tokenrip owns the former; Alike targets the latter. These don't need to compete.
- **Every context-layer competitor is single-org or personal.** Dust (enterprise-internal), Zaro (enterprise-internal), Microsoft IQ (enterprise-internal), Nessie (personal/team). None builds cross-organization context sharing. Tokenrip's mounted agents are structurally cross-org. Quintel's deal-graph (shared across broker/lender/vendor) is the proof point. This is the strongest architectural moat in the landscape.
- **No current competitor occupies Layer 2.** Neither publish.new, Alike, Zaro, nor Dust touches agent-to-agent artifact collaboration with versioning, comments, lifecycle states, or provenance. Tokenrip's collaboration layer is uncontested.
- **Zaro's Agentforce pedigree is double-edged.** Credibility from building Salesforce's flagship AI product. But the team's expertise is agent execution (dynamic UI navigation), not enterprise context infrastructure. The gap between "built agents that work" and "built the enterprise context layer that makes agents trustworthy" is the gap Zaro's marketing papers over.
- **The vocabulary window is narrowing.** Not because anyone is claiming "mounted agents," but because the broader "context layer" narrative is hardening into a shape (platform-hosted, exportable context) that may not leave room for architectural nuance. Publishing the mounted-agent thesis while the category is forming is time-sensitive.

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
| Zaro announces cross-org context sharing | Competitive surface widens — architectural moat claim weakens |
| Zaro targets financial services verticals | Quintel collision — monitor immediately |
| Zaro closes Salesforce-refugee enterprise customers | Validates anti-Agentforce pain; watch for case studies |
| Cherry Ventures funds another "context layer" company | Portfolio conflict for Tokenrip fundraise |
| Zaro raises Series A | Execution acceleration — watch for vertical expansion |
| Notion, Linear, or GitHub launches "agent-native" mode | Legacy tooling entering from above with distribution advantage |
| LangGraph or CrewAI launches artifact/output management | Orchestration frameworks entering from below with developer mindshare |
| gitlawb Playground evolves to non-code asset publishing | Layer 1 threat activates — gitlawb enters Tokenrip's space |
| gitlawb network grows past 10 nodes / 10,000 repos | Federation claims become real; developer trust and distribution strengthen |
| gitlawb raises seed or Series A | Execution acceleration; watch for expansion into content/asset layer |
| gitlawb Spawn pivots from trading agent to general agent hosting | Potential Layer 3 competition |
| Default expands Dot beyond GTM into general-purpose business ops | Category convergence risk — threat level upgrades |
| Default announces agent marketplace or third-party agent support | Platform expansion — direct competition with Layer 5 |
| Default drops hosted-agent model for BYO-model or MCP-first | Architectural convergence with mounted agents |
| Default raises large round with "platform" positioning beyond revenue teams | Execution acceleration toward Tokenrip's space |
| Default acquires or partners with outbound intelligence company | Fills their #1 gap without mounted agents — partnership window narrows |
