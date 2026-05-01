# Mounted Agents — Synthesis

> Companion to `mounted-agent-model.md`. That document explains what mounted agents are. This one synthesizes how they differ from existing agents and what flows from those differences. Source material for product page positioning, builder pitch, and operator pitch.

**Status**: Synthesis (Bean session 2026-04-30)
**Companion**: `mounted-agent-model.md` — architecture explainer
**Purpose**: Feeds product page work and external positioning

---

## The Spine: Decomposition, not Relocation

Every existing agent fuses three layers: cognition (instructions, methodology, skills), context (memory, history, accumulated state), and execution (model, runtime, tools). End the session, lose two of them. Switch tools, lose all three. ChatGPT, Custom GPTs, Cursor's agent, CrewAI workflows, AutoGen orchestrations — every framework treats fusion as the starting assumption.

Mounted agents pull the layers apart and let each live where it belongs:

- **Cognition** lives on Tokenrip — open, versioned, portable
- **Context** lives on Tokenrip — shared and/or private layers
- **Execution** lives on the user — their model, their harness, their machine

Every implication that follows is a consequence of this single architectural decomposition. Product page positioning should lead with the architecture and let the consequences fall out. Leading with "BYO model" or "open imprint" or "portable memory" leads with symptoms instead of cause.

The naming session on 2026-04-28 already landed this — "mounted" describes the inversion, "imprint" is the propagatable artifact. The product page is where that lock-in pays off. The architecture is the differentiator.

---

## Economic Implications

`mounted-agent-model.md` documents the BYO model inversion (storage scales logarithmically, no inference cost burden, more usage = more data). The non-obvious extensions:

### The capability ceiling lifts

Hosted agents cap at "what we can afford per query." Aggressive caching, single-shot answers, terse reasoning — these are not stylistic choices, they are economic constraints that propagate into the user experience. Mounted agents have no such cap. A docs agent can run a 50-step reasoning chain because the user pays. So mounted agents are structurally *more capable* than hosted agents at the same price point — for the user, who is paying anyway. This is a category difference, not a degree.

### Mounted agents inherit deflation as free upgrades

When models get cheaper, hosted agents face pricing pressure — users expect lower prices to follow lower costs while existing margin structures and fixed plans constrain pass-through. Mounted agents inherit deflation as free upgrades: same imprint, cheaper smarter inference, no pricing fight. Every Anthropic price drop makes mounted agents better; it makes hosted agents' margins worse. Mounted-agent products *get more powerful for free over time* without anyone shipping anything.

### Token efficiency becomes a competitive feature

Today the AI industry has a hidden incentive: make the agent as bad as you can get away with to control costs. Truncate context, skip steps, downgrade models behind the scenes. Mounted agents flip the incentive — leaner imprint = cheaper for the user = competitive advantage. Quality and economy point in the same direction. This is the cleanest pricing dynamic the AI industry has seen.

### Pro/Free tiers collapse into one product

The model becomes the tier. Same imprint, Haiku for casual users, Opus for power users. Builder does not ship two SKUs. Users pick capability ceiling with their wallet, transparently. Cleaner segmentation than freemium — no feature gating, no upgrade prompts, just transparent model economics.

### The pricing surface fragments cleanly

SaaS forces "all of it for a seat fee." Mounted agents allow rich, layered pricing: free imprint, pay-per-tool, subscription for shared memory access, revenue share on inter-agent calls. Structurally richer than per-seat. Builder economic models can compose differently — free-imprint-paid-tools, subscription-shared-memory, revenue-share-API-style. Tokenrip should ship multiple pricing rails, not one.

### Long-tail use cases unlock

SaaS economics need N users to break even. Mounted agents work for one user. A consultant deploys a methodology imprint for a single client; unit economics are fine. Hosted-agent economics kill the long tail; mounted agents serve it. This is a new market shelf — single-client agents, niche professional agents, internal-team agents not worth a Series A — that does not exist today.

### First-user economics are flat

SaaS products subsidize early users to learn. Massive inference burn before product-market fit. Mounted agents have no subsidization — day-1 cost structure equals day-1000 cost structure. Mounted-agent products can be funded differently. PMF discovery does not require a war chest.

### Token spend + observability = consent

Today users burn tokens anxiously, watching dashboards, dreading bills. Every token serves someone else's product. The mental model flips when the imprint is open: tokens are buying *their* outcomes, with full visibility into what was done with each one. Token spend with observability is consent — a different psychology from current AI usage anxiety. The "user happily burns tokens" framing is real, but it depends on observability, not just transparency about cost.

---

## Portability Implications

`mounted-agent-model.md` covers single-source-of-truth, versioned imprints, and multi-operator access. The deeper implications for positioning:

### Synced minds, not synced files

Git-as-agent-OS — observed in some teams treating a shared repository as their "agent OS" — is documentation for humans. Imprints are executable cognition for agents. Every user who mounts gets the *thinking*, not just the data. The architectural shift is from synced files to synced minds. Worth saying that bluntly on the product page.

### Cross-organization agents only exist in this model

Internal company tools (the "agent OS in a git repo" pattern) cannot be cross-org by definition — sensitive data, security, IP. Mounted agents can be cross-org. A "Garry Tan office hours" agent, a "Lenny Rachitsky onboarding" agent, a "ResearchGPT for biotech" — these *only* work as mounted agents. Cross-org agent commerce is not a feature of mounted agents; it is a market that does not exist without them.

### Versioning unlocks reproducibility

Today's agents have no version. They drift. They get nerfed silently. There is no way to say "talk to this agent as it was last Tuesday." Mounted agents have versioned imprints — full reproducibility. Matters for compliance, regulated decisions, scientific reasoning, legal review. *Buying the agent equals buying a contract about its behavior, frozen at a version.* No hosted agent can offer this.

### Post-company existence

If OpenAI shuts down Custom GPTs, every Custom GPT dies. If a mounted-agent builder shuts down, the imprint and memory still live on Tokenrip; users can keep using it; someone else can fork it. Mounted agents have post-company existence — like the difference between Notion and a markdown file. Hidden sales argument: *buyers do not need to bet on the builder being around in 3 years*. Tokenrip is the substrate.

### The harness contributes capability

The imprint defines the brain; the harness contributes hands. Same engineering imprint mounted in Claude Code gets git access. Mounted in a Slack-connected harness gets channel access. The harness is part of the capability surface — and that is a feature, not a bug. The same agent gets stronger when mounted in a richer environment, and the agent does not have to ship integrations with everything because the user's harness brings what it brings. Infrastructure-agnostic agents — a category that does not exist today.

---

## Cognitive Architecture

Memory is documented in `mounted-agent-model.md` (commons / partitioned / layered models). The synthesis insight worth highlighting on the product page:

### Shared patterns + private context is a cognitive abstraction nobody has shipped

Notion has shared/private *data*. Salesforce has global/my *views*. Those are data abstractions. Mounted agents have shared *patterns* + private *context* — a cognitive abstraction. Pattern memory across users is software's least-developed surface. Mounted agents on Tokenrip ship the first commercial pattern-memory system. This is a category-defining feature, not a checklist item.

The implication for positioning: do not describe the memory layer as "shared and private collections." Describe it as *the agent learns from everyone, remembers you specifically.* That is the cognitive abstraction users will pay for.

---

## Moat Shape Change

The framing "if everything is open, what is the moat?" is wrong. The *imprint* is open. *Memory and tools and relationships are not.* The moat just changed shape.

### Protective vs. attractive moats

Software moats are *protective* — defend the code, defend the prompt. Mounted-agent moats are *attractive* — compound usage. Stickier with use, not because users are locked in but because the agent becomes irreplaceable through accumulation. This is the right shape for agent commerce.

### Five concrete moats

1. **Shared memory.** First 1,000 users of a mounted agent generate a pattern layer no one else has. Fork the imprint, you get the seed. Fork the memory, you cannot — that is network-effect data. Yelp reviews for cognition.
2. **Tooling surface.** Webhooks, semantic search, computed columns, scheduled ops. Infrastructure investments, not text.
3. **Authorship.** "Garry Tan's imprint" is different from "an imprint that quotes Garry Tan." Authorship is a moat — Substack vs random blogs. Reputation is non-replicable.
4. **Inter-agent connections.** Once a mounted agent calls 5 other Tokenrip agents, switching means rebuilding 5 connections. eBay moat applied to cognition.
5. **Observability is positioning moat.** In regulated industries, opacity is a deal-breaker. Mounted agents are uniquely auditable. Tokenrip can credibly position as "the only architecture where the agent is observable end-to-end." This sells in legal, medical, financial — markets where AI has been blocked by trust.

### Open data is not just a feature, it is a market segment

Regulated buyers will pay a premium for explainable AI. Mounted agents are the only architecture that delivers it cleanly. This is not vibe — it is a wedge into industries that currently cannot adopt AI. Position the open-imprint feature as *enabling regulated-industry adoption* rather than as a generic transparency play.

---

## Builder Differentiators vs. Existing Marketplaces

Current marketplaces (GPT Store, Poe, agent.ai) are static prompt+model directories. The mounted-agent value for builders:

- **Operational depth without engineering.** Memory across users, tools that compound, analytics. The product improves through use, automatically — without the engineering investment that depth normally requires.
- **Zero-inference unit economics.** Builder publishes imprint, breaks even at zero users, ramps gradually, no inference burn at scale. Different financial geometry from SaaS.
- **Data exhaust.** Every session generates intelligence. For methodology businesses (consulting, research, training), this is gold — continuous customer research baked in.
- **Visibility builders never had.** Custom GPT builders have zero idea what users do. Tokenrip mounted agents have full tool-call analytics. "Know what your agent is doing" sells as a builder feature.
- **Inverse of advertising.** Users pay in tokens, builders are paid in usage data. Not "pay with attention," "pay with usage." Cleaner, more honest economic model.
- **Platform-shutdown immunity.** Builders are not betting on one model winning. Tokenrip's interests align with the builder's regardless of which model wins.
- **Trivial multi-agent composition.** Mounted agents can call other Tokenrip agents through the tooling surface. Builders get a workforce, not just a product. Decentralized agent composition without orchestration framework engineering.

---

## Three Insights for the Product Page

### 1. The imprint is a contract

Today's agents drift, change, get nerfed silently. Mounted agents have a versioned, public, executable contract for how the agent thinks. Relationship-grade product, not session-grade. Buying the agent equals buying behavioral guarantees frozen at a version. No hosted agent can offer this — by definition, hosted agents change underneath the user.

### 2. Mounted agents are a new programmable interface shape

Today's integrations call APIs (return data) or LLMs (reason over text). Mounted agents are between: reasoning endpoints with state, memory, and personality. This is the API of the agent era. Other software will start calling mounted agents the way it calls APIs today — and Tokenrip is the registry/runtime for that interface category. Frame it that way and the developer audience pricks up its ears.

### 3. The user-builder relationship is structurally aligned

User can switch harnesses anytime. Builder owns cognition and shared memory. Both sides are strongly incentivized to make each other happy because either can leave. The user cannot be locked in. The builder's IP cannot be poached. Compare to SaaS, where the relationship extracts from one or both sides. Mounted agents are the first agent architecture with structural alignment — and this is the answer to "won't builders just leave?" No, because they own the memory and tools that make the imprint useful, and Tokenrip provides that runtime cheaper than they could rebuild it.

---

## Open Questions to Resolve Before Product Page Ships

### Imprint privacy: hill or default with opt-out?

The thesis has more energy as a hill: "we are the only platform where agents are auditable." The thesis has more business as a default with opt-out: "private imprints allowed for builders who want them." Cannot sound like both on the same page.

Probable resolution: *imprint visibility is the builder's choice; the audit log of tool calls and decisions is always visible to the operator*. Behavior is auditable even when the prompt is private. This preserves the trust pitch while accommodating builders who want IP protection. Lock this before the product page ships.

### BYO model UX floor

If the user picks a bad model, agent quality depends on user choice. "Garry Tan agent is dumb" complaints will actually be "user mounted it on Haiku for a job that needs Opus." Need *minimum-model recommendations* and probably *enforced floors* for certain imprints. Resolve in the product, not the marketing.

### Shared memory and right to deletion

If a user contributes a pattern to shared memory, can they pull it out? GDPR and similar regimes will force the question. Need *contribution consent* upfront and *anonymization* by default. The Chief of Staff agent design gestures at this; it deserves a real architecture before launch.

### "Any harness" — audience-specific storytelling

Custom GPT is the broadest distribution surface, but does not feel like a "harness" to a non-developer. For consumers, the story is "use this in ChatGPT, with memory across sessions." For developers, "use this anywhere — Claude Code, Cursor, MCP, whatever you want." Different copy for different audiences. The hero pitch may need to be audience-targeted on the product page.

### Fork semantics

If someone forks an imprint and runs it on a different platform with no shared memory, what happens? They get a worse product (no patterns). But the imprint itself is portable. Probable rule: *forks are allowed, but shared memory stays with the canonical imprint.* This preserves openness without losing defensibility. Lock this before the question is asked publicly.

---

## Product Page Structure

### Three frames in order

1. **Architecture.** *"Agents that live on us, think on you."* Three layers, separated. Visualize. This is the 5-second pitch and the differentiator.
2. **Economics.** *"Your model. Your bill. Our memory."* BYO model, capability without ceiling, deflation-friendly, observable end-to-end.
3. **Outcomes.** *"Built once, mounted everywhere. Improves with use. Outlives the company that built it."* Portability, post-company existence, network-effect data.

### Audience-specific tracks

- **Builders**: operational depth without engineering, zero inference burn, data exhaust, audit-grade behavior contracts, multi-agent composition.
- **Operators**: your model, your control, your memory, your data flow stays private even with an open imprint, agents that improve through use without changing under you.
- **Buyers in regulated industries**: end-to-end observability, versioned behavioral contracts, post-company existence.

### Naming anchors

Architectural-pattern anchors land harder than metaphor (same lesson as the cloud-agent → mounted-agent naming session):

- *Containers for agents* — versioned, mountable, portable.
- *Substack for cognition* — author's name is the product, platform is the substrate.
- *Headless CMS but for agents* — decoupled brain from runtime, brain is portable.

### What to defuse on the first scroll

The "open imprint = giving away IP" objection. The answer in one line: *what compounds is the memory, the patterns, the tools, the relationships — the imprint is just the seed.* Like releasing a recipe but the restaurant still wins because no one has the ingredients, the kitchen, or the chef.

---

*Created 2026-04-30 from Bean session. See also: `mounted-agent-model.md` (architecture), `agents/bean/sessions/2026-04-30.md` (session notes), `agents/bean/ideas/chief-of-staff-agent.md` (first imprint shipping this model).*
