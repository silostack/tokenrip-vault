# The Mounted Agent Model: Imprint, Memory, and Harness Separation

> Tokenrip as the persistence and tooling layer for agent intelligence. Imprints live on Tokenrip — mount them anywhere.

**Status**: Concept (emerged from Bean session 2026-04-25; vocabulary locked 2026-04-28; differentiation synthesis 2026-04-30)
**Origin**: Engagement agent architecture revealed a pattern bigger than the system that produced it
**Vocabulary note**: This doc was formerly titled *The Cloud Agent Model*. The architecture is unchanged; the public terminology shifted to *mounted agents* (the category) and *imprint* (the canonical artifact) in the 2026-04-28 naming session — see `agents/bean/sessions/2026-04-28.md` for the rationale.
**Companion doc**: `mounted-agent-synthesis.md` — explores how mounted agents differ from existing agents and what flows from those differences. This document explains the architecture; the synthesis explores the implications and feeds product-page positioning.

---

## The Core Insight

The engagement agent built in the week of 2026-04-21 has a specific architecture: six published Tokenrip assets (instructions), two collections (state), and a 20-line local command file (the bootloader). Two operators — Simon and Alek — run the same agent from different machines, pulling the same assets at runtime. Updates happen by updating the assets. No local file changes needed.

This architecture accidentally separated three layers that every other agent framework fuses together:

| Layer | What It Is | Where It Lives | Lifecycle |
|-------|-----------|----------------|-----------|
| **Imprint** | Instructions, skills, operational logic, quality guidelines | Tokenrip assets (versioned, fetchable) | Evolves through deliberate updates |
| **Memory** | Accumulated context, session history, relationship state, learned preferences | Tokenrip collections + assets | Grows through use |
| **Harness** | Local execution environment — the model, API keys, routing logic | Local machine (Claude Code, Cursor, etc.) | Ephemeral, replaceable |

In every existing agent framework (CrewAI, LangGraph, AutoGen, raw Claude Code), all three layers are fused. The session IS the harness AND the imprint AND the memory. When the session ends, the imprint and memory die with it unless manually saved. The engagement agent's bootloader pattern separated the imprint. The next step — storing memory on Tokenrip — separates all three.

**When all three are separated, the agent becomes location-independent.** It doesn't live on Simon's machine or Alek's machine. It lives on Tokenrip. Any compatible harness can mount it.

---

## The BYO Model Inversion

### Traditional AI Product Economics

```
Company runs inference → Company pays for tokens → Company controls experience
Company scales users → Company scales costs → Unit economics pressure
```

Every AI company struggles with the same problem: inference costs grow linearly with users. Margins compress at scale. The entire AI SaaS industry is built on this cost structure, and it's killing startups.

### The Inverted Model

```
Company provides imprint + memory + tools → User's model runs it → User pays tokens
Company scales users → Company's costs barely move → Margin expansion at scale
```

The company's marginal cost per user is storage and API calls — not inference. Storage scales logarithmically. API calls are cheap. The entire unit economics problem that defines AI businesses disappears.

### The Capability Ceiling Lifts

Hosted agents cap at "what we can afford per query." Aggressive caching, single-shot answers, terse reasoning — these are not stylistic choices, they are economic constraints that propagate into the user experience. Mounted agents have no such cap. A docs agent can run a 50-step reasoning chain because the user pays. So mounted agents are structurally *more capable* than hosted agents at the same price point — for the user, who is paying anyway. Category difference, not degree.

### Deflation-Friendly Economics

Hosted agents face pricing pressure when models get cheaper — users expect lower prices to follow lower costs while existing margin structures and fixed plans constrain pass-through. Mounted agents inherit deflation as free upgrades: same imprint, cheaper smarter inference, no pricing fight. Every model price drop makes mounted agents better; it makes hosted agents' margins worse. Mounted-agent products *get more powerful for free over time* without anyone shipping anything.

### The Incentive Flip

| Dimension | Traditional AI Product | Mounted Agent Model |
|-----------|----------------------|-------------------|
| Token usage | Cost center — minimize | Data source — maximize |
| User sessions | Expensive to serve | Free intelligence gathering |
| Power users | Margin destroyers | Biggest data contributors |
| Usage growth | Requires fundraising | Self-funding (users pay their own model) |
| Data collection | Requires surveillance infrastructure | Built-in byproduct of tool calls |

The company is incentivized to make the agent maximally useful — because more usage means more data flowing through their tools, all funded by the user's own token spend. The user is incentivized to use the agent deeply — because it genuinely solves their problem. Incentive alignment without the surveillance model.

### Quality as Natural Regulator

If a company's imprint is artificially bloated — verbose prompts, unnecessary tool calls, circular reasoning — the user's token bill goes up without proportional value. Users switch to a competitor's agent that achieves the same result in fewer tokens. **Token efficiency becomes a competitive differentiator.** The leanest imprint that produces the best results wins. This is a healthy dynamic that didn't exist in the traditional model.

---

## What Opens Up: New Interaction Types

### 1. Agent-Mediated Products (No UI Required)

**Today**: A company builds a web app, designs dashboards, hires frontend engineers, maintains support. Their cost structure includes hosting, compute, design, and ongoing UX iteration.

**Mounted agent model**: A company publishes imprint + memory + tools on Tokenrip. The user's own agent is the interface. The company never builds a frontend. Their entire "application" is published assets and a tooling surface.

**Impact on startup economics:**
- No frontend engineering
- No web app hosting or scaling
- No inference compute costs
- No UI/UX iteration cycles
- Cost structure resembles a storage company, not a software company

**Example**: A market research firm publishes their methodology as imprint assets, their accumulated findings as memory collections, and exposes semantic search over their knowledge base. A customer's agent mounts the imprint, queries the memory through the tooling surface, and produces analysis — all on the customer's token budget. The firm's entire "product" is ~15 Tokenrip assets and a search index.

### 2. Knowledge-as-a-Service via Semantic Search

A domain expert (legal research firm, consulting practice, industry analyst) has deep accumulated knowledge. Today, monetizing this requires building a chatbot, paying for embeddings and inference, managing a RAG pipeline, and hoping the retrieval works.

**Mounted agent model**: Publish the knowledge base on Tokenrip. Expose semantic search as a tool that the user's agent can call. The user's model does the expensive reasoning. The knowledge provider pays only for storage and search indexing — pennies compared to inference.

**What the provider gets for free:**
- Every query pattern reveals what knowledge is valuable
- Query gaps identify what to research next
- Usage patterns are market intelligence
- All funded by the user's token spend

### 3. Progressive Knowledge Products

A consulting firm publishes their methodology as imprint + memory. Every client's agent runs the methodology against their own data. Sessions generate interaction data the firm can analyze (anonymized) to improve the methodology.

The product improves through use. The improvement is funded by client token spend. The firm's only cost is intellectual refinement — reviewing patterns, updating the imprint, enriching the memory. Zero compute costs for serving clients.

### 4. Tool-Augmented Agent Experiences

The user's model does the reasoning, generation, and planning. But it can't DO anything without tools. The company provides the hands:

- Collections the model can read and write (structured data)
- Semantic search it can query (knowledge retrieval)
- Messaging it can send through (coordination)
- Webhooks it can trigger (automation)
- Files it can modify (persistent artifacts)
- Computed transformations it can invoke (data processing)

Each tool is an API call. Cheap for the platform. Enormously valuable for the user's agent. **The more tools available, the more capable every agent on the platform becomes.**

### 5. Inter-Agent Tool Sharing (Future)

Agents expose their own capabilities as callable tools on the platform. OpenClaw's legal analysis agent publishes a "case_similarity_search" tool. A compliance agent running on a different machine, operated by a different person, can call that tool through Tokenrip — on the caller's token budget.

Agents compose through the tooling surface, not through orchestration frameworks. No central coordinator. No shared runtime. Capability discovery through the platform.

---

## The "Build an Agent" Skill

### Concept

A Tokenrip skill that walks any operator through deploying their agent's intelligence to the platform. The skill handles the full lifecycle: packaging, publishing, provisioning, and generating the bootloader.

### What It Does

```
/build-agent

Step 1: Imprint Packaging
  → What does your agent do? (operational description)
  → Identify instruction files, skills, guidelines
  → Package as versioned Tokenrip assets

Step 2: Memory Packaging
  → What does your agent know? (accumulated context)
  → Identify knowledge bases, session histories, learned preferences
  → Package as Tokenrip collections and/or assets

Step 3: Tool Provisioning
  → What does your agent need to reach? (capabilities)
  → Provision required tools (collections, semantic search, webhooks, etc.)
  → Configure access and permissions

Step 4: Bootloader Generation
  → Generate the thin local command file
  → Include machine-specific config placeholders (API keys, local paths)
  → Include routing logic for modes/arguments
  → Include runtime fetch of imprint assets

Step 5: Access Configuration
  → Who can run this agent? (public, team, private)
  → What memory is shared? (full, read-only, partitioned)
  → What's the billing model for provisioned tools?
```

### Why This Matters for Distribution

Every agent that "builds itself" on Tokenrip:
- Adds to the asset graph (more published intelligence)
- Adds to the tooling usage (more API calls, more data)
- Creates a new entry point for other operators to discover and use
- Becomes a case study for the platform

The skill is a deployment mechanism AND a distribution mechanism. Every deployed agent is a product demo.

### Target User for V1

Alek. The skill should be simple enough that a non-technical co-founder can deploy an agent by answering questions. If Alek can use it, anyone can.

---

## Memory Ownership and Access Models

When memory lives on Tokenrip and multiple operators contribute to it, ownership becomes a novel problem with no existing precedent.

### Three Models

**Commons Model**: All memory is shared. Every operator who runs the agent reads from and writes to the same memory pool. The agent gets smarter through collective use. Nobody "owns" the memory — it's a commons. Good for distribution, challenging for monetization.

**Partitioned Model**: Each operator gets their own memory partition. They benefit from the imprint (shared instructions) but accumulate private context. The agent builder can optionally offer a "shared memory" tier where operators opt into the collective pool. Privacy-preserving, but the agent doesn't benefit from network effects.

**Layered Model**: Two memory tiers. A shared "knowledge layer" that accumulates across all operators (anonymized patterns, refined heuristics, improved instructions). And a private "context layer" per operator (their specific data, preferences, relationships). The knowledge layer is the product that improves through use. The context layer is private. This is the most architecturally sound model — it mirrors how human organizations work (shared playbook, private client data).

### Implications by Model

| Model | Distribution | Monetization | Privacy | Agent Improvement |
|-------|-------------|-------------|---------|-------------------|
| Commons | Maximizes | Complex (who owns aggregate?) | Weak | Maximum (all data compounds) |
| Partitioned | Good | Clean (operator owns their data) | Strong | Limited (no cross-pollination) |
| Layered | Good | Natural (shared layer is premium) | Strong | Balanced (patterns compound, data stays private) |

**Recommendation**: The layered model is likely the right default. Builders configure what constitutes "knowledge" (generalizable patterns) vs. "context" (operator-specific data). The "build an agent" skill includes this as a configuration step.

---

## Business Model: Tiered Tooling Surface

### The Pricing Thesis

Don't charge for the imprint (instructions are text — commodity). Don't charge for inference (the user brings their own model). Charge for the **hands** — the tooling surface that makes the imprint useful.

### Tier Structure

| Tier | What's Included                                                                                                          | Target |
|------|--------------------------------------------------------------------------------------------------------------------------|--------|
| **Free** | Collections (read/write), assets (publish/fetch), messaging, basic bootloader support                                    | Individual operators, small agents, distribution layer |
| **Pro** | Semantic search over collections, webhook notifications, automated diffs, scheduled operations, computed columns         | Serious agent builders, knowledge products |
| **Enterprise** | Custom tool provisioning, inter-agent tool exposure, advanced analytics on tool usage, SLA guarantees, dedicated support | Companies deploying agents as products |

### Why This Works

**Natural upgrade trigger**: The operator upgrades when their agent outgrows its hands. Not because of seat limits or storage caps — because the agent needs to search, not just read. Needs to react, not just poll. Needs to compute, not just store.

**Zero resentment**: Users pay for capabilities they're actively using. Nobody pays for seat #6 when only 3 people log in.

**Margin structure**: Tooling costs are storage + compute on indexed data. Not inference. Margins expand with scale, not compress.

### Who Pays: Builder vs. Operator

Two models for the builder/operator split:

**Builder-pays (recommended for distribution)**: The builder absorbs tooling costs as cost of goods sold. Their incentive is maximum distribution — more operators = more data = better product. Making it free-to-operate maximizes the operator base.

**Operator-pays (platform play)**: The operator pays for enhanced tooling regardless of which agent they run. "Your agent — any agent — gets semantic search on the Pro plan." Horizontal capability upgrade.

**Hybrid**: Builder pays for agent-specific provisioning (their semantic search index, their webhook endpoints). Operator pays for platform-wide capabilities (faster polling, higher rate limits, analytics dashboard). Both contribute to Tokenrip's revenue without friction on either side.

---

## Competitive Positioning

### What Exists Today

| Category | Players | What They Charge For |
|----------|---------|---------------------|
| Model providers | Anthropic, OpenAI, Google | Inference (tokens) |
| AI SaaS | Jasper, Copy.ai, Notion AI | Resold inference + UI |
| Agent platforms | CrewAI, LangGraph, AutoGen | Orchestration runtime |
| Vector databases | Pinecone, Weaviate, Qdrant | Storage + search |
| Prompt management | PromptLayer, Humanloop | Version control for prompts |

### What's Missing

Nobody provides the full stack of **imprint hosting + memory persistence + tooling surface** without charging for inference. Every player is either selling compute (model providers, agent platforms) or a narrow slice of the intelligence layer (vector DBs for search, prompt tools for versioning).

### Tokenrip's Position

```
Model Providers (Anthropic, OpenAI)     = The Inference Engine
Tokenrip                                = The Nervous System (substrate for imprints + memory)
User's local environment                = The Body (harness)
```

Tokenrip doesn't sell compute. It sells the connections between the inference engine and the world — the persistence, the coordination, the tools that let intelligence ACT. Every model provider benefits from Tokenrip existing because it makes their models more useful. This is complementary positioning, not competitive.

### Observability as Positioning Moat

In regulated industries (legal, medical, financial), opacity is a deal-breaker — and the existing AI marketplace has no answer. Mounted agents are uniquely auditable: imprint is inspectable, tool calls are logged, memory is queryable, behavior is reproducible at a version. Tokenrip can credibly position as "the only architecture where the agent is observable end-to-end." This is not just a transparency feature — it is a wedge into industries where AI adoption has been blocked by trust requirements. Open data is not just a feature, it is a market segment.

### Post-Company Existence

If OpenAI shuts down Custom GPTs, every Custom GPT dies. If a mounted-agent builder shuts down, the imprint and memory still live on Tokenrip; users can keep using it; someone else can fork it. Mounted agents have post-company existence — like the difference between Notion and a markdown file. Hidden sales argument to *buyers*: they do not need to bet on the builder being around in 3 years. Tokenrip is the substrate.

### The AWS Analogy

| AWS | Tokenrip |
|-----|----------|
| S3 (storage) | Collections + Assets |
| Lambda (compute) | User's own model (BYO) |
| API Gateway | Tooling surface (semantic search, webhooks, etc.) |
| IAM | Agent identity + capability tokens |
| CloudFormation | "Build an agent" skill (provisioning) |
| ECR (container registry) | Imprint + memory registry |

The difference: AWS hosts static containers that run on AWS compute. Tokenrip hosts living agent intelligence that runs on any compute. The "container" (imprint) evolves through use.

---

## Target Customers and Use Cases

### Tier 1: Agent Builders (Near-Term)

Operators who have built effective agents locally and want to make them accessible to others.

| Customer Type | Example | What They Deploy | Value to Them |
|--------------|---------|-----------------|---------------|
| **Solo developers** | A developer with a code review agent tuned over months | Imprint: review heuristics. Memory: pattern library. Tools: basic collections | Distribution — others use their agent, contribute patterns |
| **Small teams** | A 3-person startup with an internal ops agent | Imprint: operational playbooks. Memory: team knowledge. Tools: collections + search | Multi-operator access — anyone on the team mounts the same agent |
| **Consultants** | A consultant with a domain-specific methodology agent | Imprint: methodology. Memory: anonymized case patterns. Tools: search + webhooks | Productized consulting — clients run the methodology on their own |

### Tier 2: Knowledge Companies (Medium-Term)

Organizations whose primary asset is accumulated expertise, not software.

| Customer Type | Example | What They Deploy | Value to Them |
|--------------|---------|-----------------|---------------|
| **Legal research firms** | Firm with 50K case analyses | Imprint: research methodology. Memory: case database. Tools: semantic search | Knowledge-as-a-service without inference costs |
| **Market research firms** | Analyst firm with industry data | Imprint: analysis frameworks. Memory: datasets + findings. Tools: search + computed columns | Every client query generates market intelligence |
| **Training companies** | Corporate training provider | Imprint: curriculum + assessment logic. Memory: best practices library. Tools: collections + webhooks | Scalable delivery without per-learner compute costs |
| **Industry analysts** | Gartner-type research practice | Imprint: evaluation frameworks. Memory: vendor assessments. Tools: search + scheduled updates | Continuously updated analysis funded by reader tokens |

### Tier 3: Agent-Native Products (Long-Term)

Companies that skip the traditional SaaS stack entirely and ship their product as a mounted agent.

| Customer Type | Example | What They Deploy | Value to Them |
|--------------|---------|-----------------|---------------|
| **Agent CRM** | Relationship management for agent operators | Imprint: CRM logic. Memory: contact + interaction history. Tools: full suite | No frontend, no hosting, no inference — just intelligence + tools |
| **Agent project management** | Task coordination across agent teams | Imprint: workflow definitions. Memory: project state. Tools: collections + webhooks + scheduled ops | Project management as a set of primitives, not a dashboard |
| **Agent support desk** | Customer support powered by knowledge + routing | Imprint: response templates + routing logic. Memory: ticket history + resolution patterns. Tools: search + messaging | Support product with zero UI and zero inference costs |
| **Compliance agents** | Regulatory monitoring and reporting | Imprint: regulatory frameworks. Memory: compliance history. Tools: search + webhooks + computed columns | Continuous compliance funded by client tokens |

### Tier 4: Platform Ecosystem (Aspirational)

Third-party tool and capability providers building on the Tokenrip tooling surface.

| Provider Type | What They Offer | Revenue Model |
|--------------|----------------|---------------|
| **Specialized search providers** | Domain-specific embeddings + retrieval | Per-query pricing through Tokenrip |
| **Computation providers** | Statistical analysis, ML inference, data transformation | Per-call pricing through Tokenrip |
| **Connector providers** | Bridges to external systems (email, CRM, databases) | Subscription through Tokenrip marketplace |

---

## Roadmap Implications

### Near-Term (Current Capabilities)

What's possible today with existing Tokenrip primitives:

- Imprint hosting via assets (versioned, fetchable)
- Memory via collections (structured, queryable)
- Basic bootloader pattern (proven with engagement agent)
- Multi-operator access (Simon + Alek mounting the same agent)
- "Build an agent" skill (V1 — human-walked-through deployment)

### Medium-Term (Requires New Tooling)

| Capability | What It Enables | Implementation |
|-----------|----------------|----------------|
| **Semantic search over collections** | Knowledge-as-a-service, intelligent retrieval | Embedding pipeline + vector index per collection |
| **Webhook notifications** | Reactive agents (respond to changes without polling) | Event system on collection/asset mutations |
| **Scheduled operations** | Autonomous agent runs (daily ingest, weekly reports) | Cron-like scheduler tied to agent identity |
| **Computed columns** | Derived data without agent intervention | Server-side computation on collection data |
| **Memory partitioning** | Shared knowledge layer + private context layer | Access control on collection subsets |

### Long-Term (Platform Evolution)

| Capability | What It Enables | Depends On |
|-----------|----------------|-----------|
| **Inter-agent tool exposure** | Agents calling each other's capabilities through Tokenrip | Tool registry, capability discovery, billing |
| **Agent marketplace** | Discovery and access for published mounted agents | Sufficient agent density, reputation system |
| **Usage analytics for builders** | Understanding how their agent is used | Tooling surface logging, anonymized aggregation |
| **Revenue sharing** | Builders earn from operator usage of their agents | Billing infrastructure, usage metering |

---

## Open Questions

### Architecture
- How does memory partitioning work at the collection level? Separate collections per operator, or row-level access control within a shared collection?
- What's the latency budget for tool calls? Semantic search needs to be fast enough to not blow up the user's token window with waiting.
- How do imprint assets handle model-specific instructions? An imprint written for Claude may not work well for GPT. Does the builder publish model-specific variants?

### Business Model
- At what scale does the free tier become unsustainable? What's the actual cost per agent per month for basic tooling?
- Should builders pay upfront for provisioning or usage-based? Upfront is simpler; usage-based aligns incentives.
- How does pricing work for inter-agent tool calls? The calling agent's operator pays? The tool-providing agent's builder pays? Split?

### Ecosystem
- What prevents a builder from hosting their imprint elsewhere and only using Tokenrip for tools? Is that fine (they're still paying for tools) or does it fragment the ecosystem?
- How do you handle agent quality? If a poorly-built imprint provides bad results using Tokenrip's tools, users blame Tokenrip. Does the marketplace need a reputation/rating system?
- What's the intellectual property model? If a builder publishes an imprint and someone forks it, can they? Should assets have license metadata?

### Privacy and Security
- Memory contains potentially sensitive data. What's the encryption model for memory at rest? In transit between harness and Tokenrip?
- If an operator contributes to shared memory, can they withdraw their contributions later? Right to deletion in a shared knowledge layer is non-trivial.
- How does the platform prevent a malicious imprint from exfiltrating private data through tool calls?

### Positioning Decisions (Surfaced in 2026-04-30 Synthesis)
- **Imprint privacy: hill or default with opt-out?** The thesis has more energy as a hill ("we are the only platform where agents are auditable") and more business as a default with opt-out ("private imprints allowed for builders who want them"). Cannot sound like both on the product page. Probable resolution: imprint visibility is the builder's choice, but the audit log of tool calls is always visible to the operator. Behavior is auditable even when the prompt is private. Lock before product page ships.
- **BYO model UX floor.** If the user picks a bad model, agent quality depends on user choice. Need minimum-model recommendations and probably enforced floors for certain imprints. Resolve in the product, not the marketing.
- **Fork semantics.** Forks are allowed (imprint is portable), but shared memory should stay with the canonical imprint. Lock before the question is asked publicly.
- **Audience-specific harness storytelling.** "Use this anywhere" is real for developers, mostly "use this in ChatGPT" for consumers. Hero pitch may need to be audience-targeted on the product page.

---

## Relationship to Existing Strategy

### Extends the Platform Roadmap

The mounted agent model maps cleanly onto the existing five-layer architecture:

| Layer | Current Framing | Mounted Agent Extension |
|-------|----------------|----------------------|
| Asset Routing | Agent publishes content | Imprint hosting (instructions as assets) |
| Collaboration + Messaging | Agent-to-agent coordination | Agent onboarding via messaging, memory sharing |
| Deliverable Rails | Proof of work, escrow | Agent-as-product delivery, usage metering |
| Workspaces | Shared organizational context | Multi-operator agent environments |
| Agent-Native Runtime | Protocol extraction | Mounted agent protocol, inter-agent tool calls |

### Extends the Intelligence Engine Model

The Intelligence Engine is already the first mounted agent — its imprint (blog-post-writing skill, editor guidelines) lives as Tokenrip assets, its output (published posts) lives in Tokenrip collections, and multiple agents (writer, editor) coordinate through the platform. The mounted agent model generalizes what the Intelligence Engine already does into a platform capability anyone can use.

### Extends the Distribution Thesis

Every mounted agent deployed on Tokenrip is:
- A new entry point for operator discovery
- A demonstration of the platform's capabilities
- A source of tooling usage data
- A reason for other agents to integrate with Tokenrip

The "build an agent" skill is both a product feature and a distribution mechanism. The product spreads by being the place where agents live.

### Extends the Moat Thesis

| What Accumulates | Moat Type | Switching Cost |
|-----------------|-----------|---------------|
| Published imprints | Low (instructions are text) | Minimal |
| Accumulated memory | High (non-replicable usage data) | Very high |
| Tooling integrations | Medium (API dependencies) | Moderate |
| Inter-agent connections | Very high (network effects) | Extreme |

The moat is not in hosting instructions. It's in the accumulated memory, the tooling surface that agents depend on, and the inter-agent connections that emerge from co-location on the platform.

---

## Connection to Blog Content Strategy

This concept maps to both existing blog series:

### Series 1 (Multi-Agent Collaboration)
- Post 2 (Skills as Packages) introduced the imprint-hosting pattern
- Post 3 (Self-Updating Skills) demonstrated the bootloader
- Post 4 (Collaboration Layer) described the shared surface

### Series 2 (Agent-Native Operations)
- Post 5 (The SaaS Trap) argues against human-first tools — the mounted agent model is the alternative
- Post 6 (Shared Agents) describes exactly the multi-operator pattern
- Post 7 (Agent CRM) is the proof-of-concept build
- Post 8 (Operations as Primitives) articulates the three-primitives thesis that the mounted agent model extends

### Series 3 (Mounted Agents) — Plan Locked

Six-post category-creation series. Plan: `content/plans/blog-series-3-mounted-agents-plan.md`.

Series 1 separated *instructions*. Series 2 separated *operations*. Series 3 separates *the agent itself* — naming "mounted agents" as the category and anchoring the vocabulary (imprint, harness, BYO model) before any competitor or analyst does.

| Post | Slug | Type | Maps to This Doc |
|------|------|------|-----------------|
| **#9: The Cloud Agent Ceiling** | `cloud-agent-ceiling` | Thesis | §BYO Model Inversion (the problem half — inference ceilings, drift, vendor death) |
| **#10: Mounted Agents** | `mounted-agents` | Thesis | §Core Insight + §The Three Layers (imprint/memory/harness separation) |
| **#11: Your Model, Your Bill** | `byo-model-mounted-agents` | Thesis | §BYO Model Inversion (the economics half — margin flip, deflation, long tail) |
| **#12: How We Built Chief of Staff** | `building-a-mounted-agent` | Craft | §The "Build an Agent" Skill + §Memory Ownership (layered model in practice) |
| **#13: The Imprint Is a Contract** | `imprint-as-contract` | Thesis | §Observability as Positioning Moat (versioned imprint, audit trail, regulated-industry wedge) |
| **#14: The Imprint Isn't the Moat** | `mounted-agent-moats` | Thesis | §Extends the Moat Thesis (memory, tools, authorship, inter-agent connections) |

**Strategic purpose:** Category capture + vocabulary anchoring + regulated-industry wedge + Series 4 tee-up (inter-agent composition, marketplace, build-an-agent skill).

**Tokenrip mention gradient:** Post 9 (none) → Post 10 (once) → Post 11 (none) → Post 12 (natural throughout) → Post 13 (once) → Post 14 (capstone, most prominent).

**Status:** Post 9 shipped. Posts 10–14 in flight. Cadence: two posts week 1, two posts week 2, two posts weeks 3–4.

---

*Document created 2026-04-25. Vocabulary updated 2026-04-28 (cloud agent → mounted agent; brain → imprint). Series 3 blog plan locked 2026-04-30. Based on Bean session exploring the engagement agent's architectural implications. See also: `active/engagement-agent-design.md` (the build that revealed this pattern), `product/platform-roadmap.md` (existing strategic sequencing), `agents/bean/sessions/2026-04-25.md` (session notes), `agents/bean/sessions/2026-04-28.md` (naming session), `content/plans/blog-series-3-mounted-agents-plan.md` (Series 3 plan).*
