# ICPs — Who Buys What and Why

**Status**: Active reference (updated 2026-05-08)
**Created**: 2026-05-07
**Companion docs**: [[motions-and-strategy]] (which motions serve which ICPs), [[audience-led-strategy/audience-led-gameplan]] (Motion E execution, maintenance mode), [[bottom-up-distribution-playbook-2026-05-06]] (Motion D experiments, paused)

> **2026-05-08 update**: Motion E on maintenance, Motion D paused. Both founders on vertical discovery sprint (tax, real estate, 2 TBD). The ICP taxonomy below still applies — vertical discovery targets the "Workflow-Heavy Firm" and related segments. The builder-side ICPs are deprioritized until direction clarifies at May 22.

---

## Motion Reference

| Motion                                  | Status               | What it is                                                                                   | Timeline                   |
| --------------------------------------- | -------------------- | -------------------------------------------------------------------------------------------- | -------------------------- |
| **Vertical Discovery Sprint**           | **Active (P0)**      | Sales Navigator outreach to firms in tax, RE, + 2 TBD. Find pain requiring the architecture. | May 8-22                   |
| **E — Audience-Led Creator Deployment** | **Maintenance (P1)** | Experts/creators with audiences deploy personal-brand imprints; 25% Simon                    | Maintenance through May 22 |
| **D — Builder-Direct**                  | **Paused (P2)**      | Independent agent builders use Tokenrip as infrastructure; vitamin-grade interest confirmed  | Paused                     |
| **B — Vendor Substrate**                | **Deferred**         | White-label substrate licensing to vertical SaaS vendors building agent platforms            | 2027                       |
| **C — Inter-Agent Marketplace**         | **Eventual**         | Agents calling other agents through the substrate; agent-to-agent commerce                   | 2027-2028                  |
| **A — Firm-Direct Vertical Pilots**     | **Active**           | Sold workflow automation to end-firms; fails architectural test, poisons B                   | —                          |

Full reasoning: [[motions-and-strategy]]

---

## ICP Taxonomy

Seven distinct buyer populations, each with different pain, different purchase motion, and different relationship to the mounted-agent architecture. Organized by which side of the builder/operator split they sit on.

### Reference Table

Pain scale: **1** = no pain, nice-to-have. **2** = vitamin (responds in weeks). **3** = moderate (explores but not urgently). **4** = painkiller (actively seeking, responds fast). **5** = hair on fire (losing money daily, would pay today).

| # | ICP | Side | Pain | Arch Req | Motion | Status |
|---|-----|------|------|----------|--------|--------|
| 1 | Creator with Audience | Builder | **2** | Full stack | E (maintenance) | Vitamin confirmed — Alek outreach yielded slow/no responses |
| 2 | Published but Blind | Builder | **2** | Persistence, versioning, analytics | D (paused) | Vitamin confirmed — most don't care about visibility |
| 3 | Static Workflow Seller | Builder | **3** | Versioning, memory | D (paused) | Revenue declining (ClawMart dying) but can pivot to other products |
| 4 | Vertical AI Builder | Builder | **4** | Full stack | D (paused) | Burning months on plumbing — strongest pain on builder side |
| 5 | Sophisticated Ecosystem Publisher | Builder | **2** | Agent layer above skill | Partnership (long cycle) | Already solved their own packaging — composability gap is future, not urgent |
| 6 | AI Enabler (Internal) | Builder | **3** | Portability, shared memory | D → B bridge | Platform ceilings frustrate at scale; workarounds exist |
| 7 | New Normal Worker | Operator | **3** | Portability, BYO economics | Demand side of E/D | Real but latent — they don't know a solution should exist |

**Pattern**: Builder-side ICPs cluster at 2-3 (vitamin territory). The exception is Vertical AI Builder (4) — they have real time/money pain. The vertical discovery sprint (May 8-22) tests whether firm-level buyers in specific verticals score 4-5 AND require the architecture.

---

### Builders (Supply Side)

These people create imprints. They are Tokenrip's supply.

#### 1. Creator with Audience (Motion E — Maintenance)

**Who**: Experts, educators, consultants, content creators with 50K-500K engaged followers across YouTube, Twitter/X, Substack, newsletters, podcasts, LinkedIn.

**Pain (2/5 — vitamin)**: Expertise monetization plateaus. Courses are episodic. Consulting doesn't scale. Ad revenue caps. They have audience but no recurring product. Confirmed vitamin: Alek's week 1 outreach yielded slow/no responses. Maha GTM lead is the one exception — watch her response urgency.

**What they buy**: White-glove imprint deployment → revenue share on tooling-tier upgrades from their audience (Framing A) **or** an interactive lead magnet that strengthens their existing book/course/consulting funnel (Framing B). See [[audience-led-gameplan]] §"Pitch Framings: Two Paths to Yes" — choosing the wrong framing on a value-ladder creator blocks the conversation.

**Where to find them**: YouTube AI channels, AI newsletters, Twitter/X AI personalities, vertical-specific experts, LinkedIn thought leaders, AI Substacks, AI podcasters. Full sourcing methodology in [[audience-led-gameplan]] §"Creator Categories."

**Architectural requirement**: Every layer is load-bearing (portability, versioning, shared memory, BYO economics, observability). Passes the "smallest commercial unit" test most cleanly.

**Motion**: E (primary)

---

#### 2. Published but Blind

**Who**: People who already shipped an agent, skill, Custom GPT, or OpenClaw soul into the world — and have no feedback mechanism. They did the work. They have users. They can't see what's happening.

**Pain (2/5 — vitamin)**: Built something, published it, flying blind. No analytics, no usage data, no iteration signal. The GPT Store's analytics are a joke. Claude Code skills have zero telemetry. OpenClaw souls ship into a void. Confirmed vitamin: GitHub skill-creator research (May 6-8) showed most don't care about monetization or visibility — they published and moved on.

**What they buy**: Visibility layer — mount their existing agent on Tokenrip, get usage data, operator counts, query patterns, memory growth. The agent becomes a product they can iterate on instead of a static artifact they shipped and forgot.

**Where to find them**: Claude Code skill authors (search GitHub/npm for published skills), Custom GPT builders who've hit GPT Store analytics wall, OpenClaw soul publishers, anyone who tweeted "launched my AI [thing]" and then went quiet.

**Pitch shape**: "You published this. People are using it. You have no idea who, how often, or what they ask. You're giving away your expertise into a void. Here's what it looks like when you can see."

**Architectural requirement**: Persistence, versioning, and the tooling/analytics surface are load-bearing. BYO economics is load-bearing (they can't afford to host inference for unknown usage). Portability matters because their users are spread across platforms.

**Motion**: D (builder-direct). May feed E if the builder has a meaningful audience.

**Status**: New — identified 2026-05-07. First test case: YC investor with published office hours skill.

---

#### 3. Static Workflow Seller

**Who**: People currently selling prompt packs, AI consulting methodologies, Notion templates, ClawMart agents, AI course materials. They've solved supply and distribution for static artifacts.

**Pain (3/5 — moderate)**: Static workflows can't learn, can't persist context, can't version. Buyers use them once and move on. No recurring revenue. ClawMart is dying. Gumroad AI products are commoditizing. Higher pain than ICPs 1-2 because revenue is actively degrading, not just plateauing — but they can pivot to other product formats.

**What they buy**: Upgrade path — convert their static workflow into a mounted agent with memory, versioning, portability. Free white-glove conversion for the first cohort.

**Where to find them**: ClawMart sellers, Gumroad/Lemon Squeezy AI product pages, AI consultants with methodology packages, prompt-pack sellers on Twitter/X, Notion template creators.

**Architectural requirement**: Versioning and memory are load-bearing (the upgrade from static to living). Portability matters if they distribute across platforms.

**Motion**: D (Experiment 1). Feeds E if they have audiences.

---

#### 4. Vertical AI Builder

**Who**: Independent developers or small teams building vertical AI agents on raw APIs. Fighting with memory, identity, persistence, deployment. Building infrastructure instead of their product.

**Pain (4/5 — painkiller)**: Reinventing every substrate primitive (memory, identity, versioning, deployment) while trying to ship a product. Burning months on plumbing. Strongest pain on the builder side — every week on infra is a week not shipping product. Partial workarounds exist (LangChain, CrewAI) but none solve portability + BYO economics together.

**What they buy**: Infrastructure — Tokenrip as the base layer so they ship product, not plumbing. Tooling-tier pricing.

**Where to find them**: Twitter/X ("building AI agent for [vertical]"), Product Hunt (recently launched vertical AI products), Indie Hackers, Hacker News Show HN posts.

**Architectural requirement**: Full stack is load-bearing. These are the buyers who most explicitly need what hosted platforms can't give them (portability, BYO economics, persistent memory).

**Motion**: D (Experiment 5). Strongest signal for paid tooling tiers.

---

#### 5. Sophisticated Ecosystem Publisher

**Who**: Organizations (accelerators, foundations, ecosystem orgs) that publish skills for their community and have **already built their own packaging infrastructure** — versioning, auto-update, multi-harness, telemetry. They're operationally past the "static GitHub file" stage.

**Pain (2/5 — vitamin)**: Their skill is a destination, not a composable node. Users invoke it and forget. No agent layer above lets the skill compose with other capabilities, persist operator memory across sessions, or distribute beyond their gated community. Low pain because they've already solved their immediate problems — the composability gap is a future constraint, not a current one.

**What they buy**: Not skill packaging — they don't need it. The **mounted-agent layer above** their skill: an agent that uses their skill as one tool among many, persists operator state, distributes their capability through a broader builder ecosystem they don't reach today.

**Pitch shape**: Peer/partnership conversation, not vendor pitch. "You built [skill]. Properly engineered. We're building the agent layer where skills like yours become tools in larger operator workflows. Open to exploring how [skill] fits into a broader [domain] agent?" Don't lead with telemetry/versioning — they have those.

**Where to find them**: Crypto ecosystem orgs (Colosseum, Solana Foundation, ETHGlobal, Polygon Labs, Arbitrum Foundation, OP Labs, NEAR Foundation, Protocol Labs), AI grant programs (Anthropic Builders, AI Grant), select dev community orgs with sophisticated published skills. Curate by hand — ~50-100 orgs globally.

**Architectural requirement**: The mounted-agent layer is load-bearing (skill-as-tool composability, operator memory, cross-runtime portability). Their existing skill becomes a tool in the agent's capability layer, not a competing surface.

**Motion**: Long-cycle peer/partnership conversations. Not active weekly outreach — track separately from individual creator outreach. One yes is high-value (multiplier through their ecosystem distribution) but slow.

**Status**: New — identified 2026-05-08. First example: Colosseum (Solana accelerator with proprietary Copilot skill — version 1.2.1, response-header version checks, multi-harness, telemetry, references folder).

---

#### 6. AI Enabler (Internal Builder)

**Who**: The emerging company role — the person who figures out how to deploy AI across the org. May be a former developer, may not be. More AI-fluent than the average worker. Has familiarity with tools like OpenClaw, Claude Code, or ChatGPT. Builds/deploys agents for coworkers, not for external audiences.

**Pain (3/5 — moderate)**: Building automations and workflows for their company but hitting platform ceilings (no persistence, no cross-tool portability, no way to share a tuned agent across the team). Every workflow dies in the session that created it. Pain scales with usage — a one-off builder doesn't feel it; someone deploying across a 50-person team hits the ceiling hard. Workarounds exist (rebuild, use multiple tools) but degrade with scale.

**What they buy**: Internal deployment infrastructure — build a mounted agent once, coworkers mount it across their preferred tools. The AI Enabler is the internal equivalent of the mid-tier creator: instead of an audience, they have a department.

**Where to find them**: Not directly targetable in 2026. Emerges organically from Experiment 2 (power-user upgrade path) and from companies where the "New Normal Worker" population grows large enough to need coordination. LinkedIn "AI Champion" or "AI Lead" titles are early signals.

**Architectural requirement**: Portability is especially load-bearing (coworkers use different tools). Shared memory matters (team-wide context accumulation). BYO economics matters at company scale.

**Motion**: Bridges D → B. The AI Enabler who deploys on Tokenrip internally is the person who later advocates for vendor substrate licensing. This is a potential path to earlier Motion B activation that doesn't require cold-selling CTOs.

**Status**: New — identified 2026-05-07. Not an active outreach target yet. File and watch for organic signal.

---

### Operators (Demand Side)

These people mount imprints others build. They are Tokenrip's demand.

#### 7. New Normal Worker (Operator)

**Who**: Non-technical workers automating their own jobs with AI assistance. Three months ago they'd never seen code; now they're building spreadsheet automations in VS Code with ChatGPT as their guide. Boss supports it. They're evaluating five AI platforms by name. They are not "power users" — they are early-mainstream, and this will be the norm within 18 months.

**Pain (3/5 — moderate, latent)**: Every workflow they build dies in the session that created it. No persistence, no memory, no way to share what they learned. They reinvent the wheel every Monday. Real pain but latent — they don't know a solution should exist, so they don't seek one. Pain becomes visible only when someone shows them what persistent agents look like.

**What they use**: Mount agents built by creators (ICP 1), AI Enablers (ICP 5), or workflow sellers (ICP 3). They don't build agents — they consume them. Their value to the substrate is operator count, usage data, and tooling-tier conversion.

**Where they are**: Everywhere. ChatGPT, Claude, VS Code, Cursor. They don't self-identify as "AI users" — they're just doing their job with better tools.

**Architectural requirement**: Portability is critical (they use whatever tool their company provides or they personally prefer). BYO economics is the default (they're already paying for their own AI subscriptions).

**Motion**: Demand side of E and D. Not directly targetable — they arrive through the builders who serve them.

**Status**: New — identified 2026-05-07. Glo C. is the archetype. Not an outreach target; an operator archetype to design for.

---

## ICP × Motion Matrix

| ICP | Motion E | Motion D | Motion B | Motion C |
|-----|----------|----------|----------|----------|
| Creator with Audience | **Primary** | — | — | Eventual |
| Published but Blind | Feeds E if they have audience | **Primary** | — | Eventual |
| Static Workflow Seller | Feeds E if they have audience | **Primary** | — | Eventual |
| Vertical AI Builder | — | **Primary** | — | Eventual |
| Sophisticated Ecosystem Publisher | — | Peer/partnership (long cycle) | Bridge to B (high multiplier) | Eventual |
| AI Enabler | — | Entry point | **Bridge to B** | Eventual |
| New Normal Worker | Demand side | Demand side | Demand side | Demand side |

## ICP × Experiment Matrix

| Experiment | Primary ICP | Secondary ICP |
|------------|-------------|---------------|
| 1: Workflow Conversion | Static Workflow Seller | Creator with Audience (if they have one) |
| 2: Power-User Upgrade | New Normal Worker + platform power users | AI Enabler (if they're doing this at work) |
| 3: Build-an-Agent Video | Broad — attracts all builder ICPs | AI Enabler (non-coding use cases resonate) |
| 4: Builder Landing Page | Signal-sorting across builder ICPs | — |
| 5: Vertical Builder Outreach | Vertical AI Builder | — |
| 6: Bounty/Challenge | Vertical AI Builder + technical builders | — |
| 7: Published but Blind | Published but Blind | Creator with Audience (overlap) |

---

## The Sophistication Ladder Validates the Mounted-Agent Positioning

The Sophisticated Ecosystem Publisher ICP surfaces a strategic principle worth holding alongside the architectural-requirement test from `motions-and-strategy`.

When a publisher reaches the operational maturity to build their own packaging infrastructure (versioning, distribution, telemetry, multi-harness), the value automatically moves up the stack to the agent/orchestration layer. Their skill solves the packaging problem — but the skill is still a destination, not a composable node. It can't accumulate operator memory, it can't compose with other capabilities, and it can't distribute beyond the publisher's gated community.

Colosseum is the proof point. Their Copilot skill (v1.2.1, response-header version checks, multi-harness compatibility, telemetry, references folder) has solved everything the original Tokenrip packaging pitch addresses. Tokenrip's value to them is not at the layer they've already built — it's at the layer above (composability, operator memory, cross-runtime distribution).

This generalizes:

- For unsophisticated publishers (most of the GitHub skill creator list), the packaging pitch lands cleanly because they haven't solved versioning/distribution/telemetry yet.
- For sophisticated publishers (the small Sophisticated Ecosystem Publisher segment), the packaging pitch fails because they've already solved it themselves — but the mounted-agent layer above becomes the differentiated offer.

**The implication for the architectural-requirement test**: the architecture isn't just load-bearing for the smallest commercial unit (the original framing). It's also load-bearing as the *ceiling lift* for sophisticated publishers whose existing skills cap out at "destination tool" without an agent layer above. Two distinct shapes of architectural necessity, two distinct pitches, two distinct cycles.

**The implication for product positioning**: as the broader skill ecosystem matures, packaging becomes table stakes. The agent layer becomes the differentiator. Tokenrip's strategic position is to skate to where the puck is going — package today's unsophisticated publishers via the standard pitch, while building the agent layer that becomes the only meaningful differentiator once packaging is solved everywhere.

---

## What This Tells Us About Motion B Timing

The original Motion B activation trigger is: "5+ Motion E lighthouse imprints live + multi-tenant capability shipped + named CTO buy-intent." This assumes B starts with top-down CTO outreach.

The AI Enabler ICP suggests a **bottom-up path to B**: AI Enablers who deploy on Tokenrip internally → their usage produces the proof point → they become the internal advocate for a vendor substrate license. This is the consumerization-of-IT pattern (Slack, Dropbox, GitHub) applied to agent infrastructure.

This doesn't change Motion B's 2027 timeline — the substrate still needs multi-tenant isolation and enterprise features. But it does suggest that Motion D signal (AI Enablers showing up in Experiment 2 or 4) could accelerate B's activation by producing bottom-up buy-intent rather than requiring top-down CTO cold outreach.

**Watch for**: anyone in Experiment 2 or 4 who describes deploying for their team or company, not just themselves.

---

## Cross-References

- [[motions-and-strategy]] — strategic context for all five motions
- [[audience-led-gameplan]] — Motion E execution with creator categories
- [[bottom-up-distribution-playbook-2026-05-06]] — Motion D experiments
- [[../product/tokenrip/mounted-agent-model]] — architecture reference
- [[../agents/bean/sessions/2026-05-07]] — session that produced this taxonomy
