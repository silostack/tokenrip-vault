# a16z Pitch — Angles and Explorations

**Status**: Working document
**Created**: 2026-05-14
**Purpose**: Comprehensive reasoning behind the a16z deck. Captures the angles considered, the protagonist-swap decision, supporting evidence, competitive context, GTM logic, and open validation threads. Source of truth for deck iteration.

**Companion**: [[a16z-pitch-deck]] (the deck itself, 7 slides), [[yc-tokenrip-pitch-framing-2026-05-02-codex]] (prior YC framing — useful contrast)

---

## Core Thesis (One Paragraph)

The unit of automation in knowledge work is shifting from the chatbot session to the persistent agent. But enterprises are still buying chatbots top-down while their employees are building real automation bottom-up. The two sides cannot meet without a substrate that makes individual automations team-shareable. The wedge is the non-technical employee who is already automating their job with AI. The ladder is Glo (individual, free) → automation owner / AI Agent Manager (team, paid) → Company Tenant (enterprise). The motion is precedented (Slack/Notion/Figma/GitHub bottom-up SaaS) and happening now in the AI agent layer with no incumbent. The deeper architectural bet: as personal agents proliferate across runtimes (Codex, ChatGPT, Cohere, vendor-hosted), they will need a neutral surface to share state with each other — and only a third party can host it.

**One-line positioning**: Tokenrip is the durable home for employee-built AI agents — so individual automations can become team infrastructure.

---

## The Protagonist Swap

The biggest decision behind this deck: who is the protagonist on slide 2?

### Considered: The Mid-Tier Creator (prior framing)

- Source: `bd/audience-led-strategy/audience-led-gameplan.md`, `active/yc-tokenrip-pitch-framing-2026-05-02-codex.md`
- Strengths: every architectural layer is load-bearing; existing motion E execution; aligned with mounted-agent synthesis
- Weaknesses: requires VC to buy two novel beliefs (mounted agents as a category + audience-led as the wedge); puts the deck next to creator-economy plays a16z has cooled on; "deploy your expertise as an imprint" is an abstract pitch

### Chosen: Glo (the non-technical employee)

- Source: Simon's friend testimonial (2026-05-14), Upwork "AI Agent" job scrape (2026-05-14), corroborating "AI Enabler" ICP in `bd/icps.md`
- Strengths: concrete protagonist; precedented motion (bottom-up SaaS); requires only one novel belief; "why now" answers itself
- Weaknesses: AI Agent Manager category is partly a forecast; team-paid buyer is one step removed from the wedge user

### Verdict

The product doesn't change. The architecture doesn't change. The wedge becomes legible because the protagonist is concrete and the motion is precedented. The creator motion relocates to the **supply layer** of the same flywheel — creators publish, Glos consume — which also dissolves the creator-economy framing trap.

---

## The Glo Persona

The single most valuable raw input. Verbatim from Simon's 2026-05-14 conversation with a non-technical knowledge worker:

> "Yeah I'm still a newbie but ChatGPT walks me through it. Mainly trying to find ways to automate repetitive tasks at work. For instance, made simple automation to extract info from spreadsheet and format into a doc...
>
> Because coding is all words so that's where my writing skills come in because it's all language so easier for me to read in spot patterns...
>
> I like working in VS code terminal...
>
> Eventually, I do want to basically automate all of my most repetitive tasks. That way I do have more time to do more strategy things in my job. Also, my boss totally fully supports this, which is great...
>
> I can't use OpenClaw at work nor do I want to because I feel like that shit is gonna give me a virus lol. We don't have anthropic yet enterprise Anthropic I just have personal coworker which I never use but want to...
>
> Also, my new boss is a big proponent of AI and totally supports me automating my job tasks lol"

What this testimonial proves:
- Non-developers are already building real automations with AI walking them through it
- The tool stack is bottom-up (personal subs, VS Code, ChatGPT) not enterprise
- Boss support exists; budget doesn't (yet)
- Security/sovereignty anxiety is real ("virus")
- The work product is *code that automates her job* — but the activity is "describing her work to AI"
- The automations live on her laptop. Nothing graduates to her team.

### Why this is gold for a deck

It's an **unsolicited admission**, not a pitch response. That's the highest-credibility data type a startup can use. Verbatim on slide 2 beats any paraphrase.

### One Glo or three?

Worth pressure-testing before the deck is finalized. Plausible variants:
- Excel-power-user Glo (formulas, macros, but English now)
- Zapier/Airtable Glo (workflow-author background, AI just better tooling)
- ChatGPT-walks-me-through-it Glo (no prior automation background, AI is the only on-ramp)

The deck should pick one and commit. The third variant is the most novel and the most defensible — it's the population that doesn't exist without AI. Recommend leading with that.

---

## The Three-Step Ladder

Not three customer segments. One motion with three pricing moments.

### Step 1 — Glo (Free / Individual)

- Mounts agents in her ChatGPT, Claude, Cursor, VS Code, or whatever she already uses
- Brings her own model (BYO inference)
- Automations persist across sessions (the mounted-agent core)
- Free tier; substrate cost is storage, not inference
- Distribution: the **engineered first share** (see "Engineering the First Share") — handoff-shaped agent outputs (intrinsic) and manager-pull via observability (pulled); published creators as seeded gateway agents

### Step 2 — Automation owner / AI Agent Manager (Team / Paid)

- Emerges when 3+ Glos exist on one team
- Coordinates the team's workflow library, versions, credentials, governance
- Pays for: shared memory across team, observability, tooling tier (search, webhooks, scheduled runs), audit
- ACV: hundreds to low thousands per team per month
- Function emerging now — AI Champions, ops leads, automation owners; the platform will name the formal role (the way Slack named the "Slack admin")

### Step 3 — Company Tenant (Enterprise)

**What triggers the buy**: IT realizes employee agents have created vendor dependency — the company has no control over which models run, which tokens go where, or what client/IP data gets exposed. The buy is to absorb the bottom-up automation without rebuilding it: same imprint, swap the inference layer underneath. Two distinct pain shapes converge on this tier and both are addressable by the same architecture:

- **Token-control / methodology-IP exfiltration** — for firms whose moat *is* the methodology being sent to the model provider (consulting, law, audit, compliance, advisory), deploying Anthropic or OpenAI internally is feeding the company that is openly funding their competitors. Chamath Palihapitiya named this publicly in May 2026 ("letting the fox in the hen house"); Vijay Laknidhi (Liberate, 2026-05-19) independently surfaced the same pain inside insurance, citing Travelers' 12K-seat Anthropic deployment as a vendor-lock-in time bomb the company has no exit from. Tokenrip's Enterprise tier sells sovereignty over the AI stack — tokens, models, audit trail — without forcing IT to rebuild employee automation from scratch when the model layer changes.
- **Data sensitivity / regulatory blockers** — for firms that legally or contractually cannot send client data through public model providers (boutique legal, regional financial advisors, healthcare-adjacent services, defense subcontractors, accounting firms with audit obligations), AI adoption has been blocked by trust requirements no hosted product can meet. Local-model and private-endpoint inference unblocks adoption; the substrate is the only place the agent itself survives the model swap.

Both pain shapes are load-bearing on mounted-agent architecture: the imprint must be portable across model providers, memory must live on the customer's tenancy, observability must be audit-grade. A regular SaaS cannot ship the same product.

**Architectural shape:**

- Tokenrip runs on the company's infrastructure (MCP layer, internal data sources, own models)
- Employees point their personal AI tools (ChatGPT, Claude, Cursor) at the company tenant for company-aware agents
- Multi-tenant isolation, SSO, compliance, audit packages
- ACV: tens to hundreds of thousands per year
- Bottom-up adoption produces buy-intent (consumerization-of-IT pattern); token-control pain produces *top-down* buy-intent in methodology-IP firms even without prior Glo-class adoption

**Why this isn't a protagonist swap**: The Glo wedge (Step 1) doesn't change. What changes is that the Tenant rung — historically the vaguest part of the ladder — now has a sharp, named pain that closes deals. The deck doesn't lead with token control; it leads with Glo. But when partners ask "why does the company ever pay $500K/yr?", the answer is no longer "enterprise plan with SSO" — it's "they realized their entire AI stack depends on a single vendor they don't control, and we're the only architecture that lets them switch without throwing away what employees built."

### Architectural necessity per step

Each step is load-bearing on the mounted-agent architecture:
- **Step 1** requires portability (Glo uses many tools), persistence (memory survives session), BYO model (no budget)
- **Step 2** requires versioning, shared memory partitioning, observability, audit
- **Step 3** requires tenancy, identity, permission boundaries, on-prem MCP

If any of these requirements were optional, a regular SaaS could ship the same product. The architectural-requirement test (from `bd/motions-and-strategy.md`) passes cleanly at all three steps.

---

## Engineering the First Share

The ladder has a hidden dependency: every rung past Step 1 requires that an agent built by one person gets **shared and re-used by a second person**. That single event — an agent crossing from operator 1 to operator 2 — is the real activation metric. Deploy count without it is vanity.

### Why this needs engineering, not hope

Dust's hardest-won GTM lesson (see `active/research-dust-competitive-analysis-2026-05-18.md`) is that lone-individual rollouts fail. But Dust is a destination workspace, and its failure stacked three causes: adoption friction (a new tool to move into), no collaboration partner (single-player Dust is thin), and learning curve with no peer reinforcement.

Tokenrip's architecture dissolves the first two. A mounted agent delivers standalone value to one operator on day one, and it is shared by being mounted into a harness the coworker *already uses* — no workspace to adopt. Tokenrip therefore escapes Dust's top-down precondition: adoption is an outcome of the agent being good, not a gate cleared before any value appears.

But that same architecture removes the **forcing function**. Dust's top-down motion has a trigger — the company decided, budget exists, an exec keynote launches it. Tokenrip's bottom-up motion has none. Standalone value can produce a permanently happy *free solo* user who never shares — and the business compounds only past the share. The first share will not happen by default. It has to be designed.

### Two mechanisms: intrinsic and pulled

- **Intrinsic share** — the agent produces an output a coworker needs, so the share is a natural handoff. "Here is the agent that produced this — run it yourself" is frictionless when the output already crosses desks. Bias the early agent templates toward handoff-shaped work (reports, drafts, formatted deliverables that travel) over private-utility work (Glo's inbox triage) that never leaves her desk.
- **Pulled share** — the manager-observability layer is Tokenrip's closest analogue to Dust's forcing function. A manager who *sees* a high-performing agent propagates it: "everyone on the team should run this." This reframes observability — the deck positions it as "govern," but operationally it is the **distribution mechanism**. The manager is the soft top-down trigger inside the bottom-up motion.

### The learning curve is architecture-independent

The third cause of Dust's individual-rollout failure — learning curve, no peer reinforcement — is behavioral, not architectural, and it bites Tokenrip harder. Dust's customers are large tech companies, and Dust wraps deployments in human change-management (internal hotline, accompaniment, upskilling). Glo has none of that. So the learning curve relocates **into the product**: Moa and the bootloader/onboarding flow are Tokenrip's substitute for Dust's consulting layer. If a non-technical Glo cannot reach a working agent without a human helping her, the motion stalls regardless of architecture.

### The load-bearing assumption

The entire advantage rests on single-operator value being genuinely real. If standalone retention is thin, Tokenrip is closer to Dust's team-precondition than the architecture suggests, and the first share becomes a prerequisite rather than a growth event. Verifying that solo Glos retain and return is a prerequisite, not a footnote — see Validation Threads.

---

## Why the Bottom-Up Frame Is Right Now

### Precedent stack

Every prior bottom-up SaaS wave followed the same shape:
- Dropbox: individual file sync → team folder → enterprise storage
- Slack: individual channel → team workspace → enterprise SSO
- GitHub: individual repo → org → enterprise instance
- Figma: individual file → team workspace → org plan
- Notion: personal pages → team wiki → enterprise plan

Pattern: individual adopts free, team adopts paid, IT licenses enterprise. The role at step 2 (team admin) gets *named* by the platform existing. There is no "Slack admin" before Slack.

Tokenrip follows the same shape with AI agents as the unit.

### Market signal stack

- **Anthropic Claude for Small Business** — Anthropic is moving down-market into Glo's territory. Validates the bottom-up market exists; competitor or partner depending on framing.
- **ChatGPT Enterprise** — OpenAI is monetizing the bottom-up wave at the enterprise tier. Validates the ladder exists; doesn't solve team-shareability.
- **Microsoft Copilot** — Top-down deployment of AI into Office. The opposite of bottom-up; struggles with adoption because individual employees haven't chosen it.
- **CodeWords.ai recent raise** — single-player agent-builder. Counter-data-point: the market is funding the wrong shape. Tokenrip's bet is that multi-player is the next thing as workplace adoption matures.
- **Upwork "AI Agent" job market** — 80+ active postings scraped 2026-05-14 (`active/upwork-ai-agent-jobs.csv`). Includes literal "AI Agent Manager" role (job #7). Demand is real.
- **LinkedIn "AI Champion" / "Head of AI" / "AI Lead"** title proliferation — the role pair (Glo + Manager) is forming. Validation pending hard data scrape.

### The window

Anthropic + OpenAI are circling SMB. Microsoft is circling enterprise top-down. None of them solve the "individual automation → team capability" graduation problem because their architectures are session-grade and their incentives keep users inside their runtime. The window is open now because workplace AI adoption is accelerating, but the portable team layer has not been named yet.

---

## The Multi-Agent Sharpening

Independent validation arrived 2026-05-25 via Dan Shipper on Lenny's Podcast (`active/2026-05-25-the-ai-paradox-more-automation-more-humans-more-work-dan-shipper.md`). Shipper described the future of knowledge work in language that mapped onto Tokenrip's architecture without naming it. The thesis did not change. The pain articulation got sharper — and a dimension that was implicit in the deck became explicit.

### What Shipper surfaced

Four claims that map directly onto the architecture:

1. **Work will happen on a shared surface, not in a chat session.** Humans and agents need to act on the same mutable state in real time, with mutual visibility. ("I need visibility into what the agent is doing. The agent has to have visibility into what I'm doing.")
2. **Two agents are better than one.** Agent-to-agent context transfer is faster than the human-typing equivalent. The bottleneck is the surface the two agents share.
3. **SaaS comes back because users bring their own tokens.** Apps live inside the agent harness; the harness brings inference. Margins expand for SaaS that builds for the human + agent + agent collaboration pattern. This is BYO-inference, validated from outside.
4. **Forward-deployed engineer is the new role, not "AI Agent Manager."** The person who keeps the company's agent working and mediates between agents and humans. Worth re-evaluating the deck's role-naming.

### What changed in the deck

The pain on slide 2 was framed around Glo's *automation being orphaned*. Three losses, each about the script not crossing teams. Correct but architecturally imprecise. The sharpened framing: every loss is about *agents that cannot share state*, not just scripts that cannot move. The deck now reads:

- Loss 1: coworker cannot pick up where she left off → no shared state, no handoff between AI tools (was: "no shared version")
- Loss 2: manager cannot see what her agent has done → every agent runs in an invisible session (was: "automation running invisibly")
- Loss 3: when she leaves, the workflows her agent learned leave with her → institutional memory walks out (was: "institutional knowledge walks out")

Slide 3 follows: step 2 ("Mount") now spells out the runtimes (Claude, ChatGPT, Cursor) to make cross-runtime concrete; step 4 ("Persist") elevates "memory compounds across agents and sessions" from a closing footnote to the load-bearing claim, and pairs explicitly with slide 2 loss 3 ("when Glo leaves, the work doesn't").

Slide 5's moat line is now structural rather than values-based: "Cross-runtime agent collaboration has to be hosted by a third party." Anthropic literally cannot host state that OpenAI's agents are supposed to mutate. The neutrality argument is now a structural one.

### Why this is a sharpening, not a pivot

The protagonist (Glo) stays. The ladder stays. The motion stays. The architecture stays. What changes is the *pain language* on slide 2 and the *moat language* on slide 5 — both moving from "sharing" framing to "shared state across runtimes" framing. The downstream effect: the architecture becomes structurally necessary in a way that is harder to argue with, because no SaaS session can host multi-party mutable state across vendors.

### What this previews for the post-product (Series A) deck

The accelerator deck leads with Glo because she is concrete and the wedge is precedented (bottom-up SaaS). The Series A deck — 12 months from now, after the lighthouse and the first deploys — can lead with the multi-agent shared-state thesis directly. Cross-runtime agent collaboration becomes the spine; Glo becomes the lighthouse example. Do not force that framing into the accelerator deck (too abstract for 7 slides). Do start drafting the Series A deck in parallel so the protagonist evolution is deliberate, not reactive.

### Founders as future-state existence proof

Underused data point: Simon and Alek already work the way Shipper describes — multi-agent, multi-runtime, persistent shared state, on Tokenrip itself. The Glo testimonial is *forecast* evidence (she will need this). The founders' workflow is *existence* evidence (this works today). Open question: does the deck reserve one slot for "here is the future-state, running today, on Tokenrip"? It adds a slide and adds rare lived-experience credibility that pre-traction decks usually cannot show. Decision deferred — try it on a couple of partners before committing.

---

## Cover-Line: Distinguishing from Slack-Resident Agents

The current cover line — "Portable AI agents, shared with your team" — banks all the differentiation on the word **"portable."** A skeptical partner can read it and ask *Shopify's River does this. Ramp's agent does this. Slack-resident super-agents do this — what's different?* The line does not answer.

### Shipper bifurcates the future into two surfaces

The May 2026 podcast actually gives the answer. Shipper splits the future of work into two distinct surfaces:

1. **The Slack-resident super-agent.** One agent per company, lives in Slack, top-down deployed, FDE-built, delegation-pattern. Examples: Shopify's River, Ramp's, Anthropic's internal Claudie. You ask it to do work; it goes off and does it elsewhere.
2. **The work surface.** Codex, Cohere, Claude Code; where work actually happens, with mutable state and multiple parties acting on it concurrently.

Tokenrip is for **surface 2**. The Slack-resident pattern is not a competitor — it is a different layer of the stack. They coexist. (A Slack-resident super-agent might even call into Tokenrip-hosted agents underneath.) The positioning win is that Shipper himself drew the line; we do not have to.

### What structurally distinguishes Tokenrip

Four properties, ordered by how cleanly each differentiates from the Slack-resident pattern:

1. **Multi-runtime** — Tokenrip agents run in every AI tool the team uses (Codex, Claude Code, Cursor, ChatGPT, terminal, browser). Slack-resident agents only run in Slack. *This is the cleanest cover-line differentiator.*
2. **Multi-agent** — Tokenrip is a roster of agents per operator. Slack-resident is one super-agent per company.
3. **Bottom-up** — Glo builds her own and shares it; coworkers choose to mount it. Slack-resident is top-down: FDE builds, company deploys.
4. **Operator-owned** — Each agent belongs to the person who built it. Slack-resident is org-owned.

### Why the current line does not carry it

"Portable" is doing too much work alone. As a property word it is abstract — a partner reads it and thinks *exportable? movable? lives in a file?* — none of which immediately collide with the Slack-resident pattern. "Shared with your team" is worse: Slack-resident agents also share work with the team. It is not differentiating at all.

### Candidates that make the differentiation louder

The fix is to name **where the agents run**, not the abstract property of portability:

| # | Candidate | Why it works | Cost |
|---|---|---|---|
| A | "AI agents that run in every AI tool your team uses." | "Every AI tool" rules out "just Slack" | Drops "portable" as a word |
| B | "Portable AI agents — in every AI tool your team is already using." | Keeps "portable"; "already using" signals bottom-up | Longer; em-dash |
| C | "AI agents that travel between your team's tools." | "Travel between" forecloses Slack-resident in one short clause | Drops "portable" but implies it |
| D | "Your team's AI agents — running across every tool they use." | Most on-thesis (plural agents, plural tools) | Longest; two clauses |

**Recommended: C — "AI agents that travel between your team's tools."**

A reader who knows what River or a Slack-resident super-agent is reads "travel between" and immediately understands: *oh, this is not that thing — this crosses tools.* Slack-resident agents do not travel. If "portable" is too hard-won across Series 3 to drop as a lexical anchor, fall back to B.

### The trap to watch

A version of "in every AI tool your team uses" can read as a *features* claim ("we integrate with X, Y, Z") rather than a *category* claim (structurally neutral substrate by architectural necessity). The way to avoid the trap is to make sure slide 3 immediately upgrades the parsing. "*Runs* in every AI tool" reads structural. "*Integrates with* every AI tool" reads feature-y. Same words; different reader frame; the deck has to land the right one.

### Decision deferred

Do not lock the cover line until the rendered deck is in front of partners. Render C and B as parallel cover slides; if C parses cleanly in 5 seconds, take it; if it feels too informal for the audience, fall back to B. The deck inside has been sharpened (slides 2/3/5 + FAQ); the cover does not have to chase, but it does have to stop tying for the Slack-resident pattern.

---

## Architecture (Pitch Translation)

The architecture stays the same as `product/tokenrip/mounted-agent-model.md`. What changes is how it's pitched.

### One slide, not the whole deck

The mounted-agent architecture (imprint / memory / harness separation) should be **one slide** in the a16z deck, not the central thesis. Lead with the market shift and the protagonist; the architecture is the explanation, not the pitch.

### Pitch translation

| Internal vocabulary | Slide language |
|---|---|
| Mounted agent | A persistent AI agent that lives outside the chat session |
| Imprint | What the agent knows how to do |
| Memory | What it remembers across sessions |
| Harness | The tool the user is already in (ChatGPT, Claude, Cursor, VS Code) |
| BYO model | Users pay for their own AI; we host the rest |
| Substrate | The platform |
| Operator | User |
| Tooling tier | Plan |

### What the architecture enables in pitch terms

- **Glo's automation survives the session** (persistent memory)
- **Her coworker can use it in their own tool** (portability)
- **Her manager can version, govern, and propagate it** (versioning + observability — observability doubles as the team-distribution mechanism; see "Engineering the First Share")
- **The company can run it on their infrastructure** (tenancy)
- **Tokenrip's costs don't scale with usage** (BYO model — the slide a16z will care about)
- **Agents on different runtimes can act on the same state** (cross-runtime shared surface — the multi-agent dimension surfaced by the Shipper podcast; see "The Multi-Agent Sharpening")

### Naming the surface and the mode

Three different things could be named, with different stakes:

- **The surface itself** (what Tokenrip *is*). Don't coin a category noun. Let "Tokenrip" be the proper noun, and let the empty quadrant on slide 5 make the absence visible without language. Industry watchers and partners will give back names; adopt the strongest one that lands.

- **The mode of work it enables** (humans and agents acting concurrently on shared state across runtimes). Worth coining, carefully, in non-deck surfaces. Candidates evaluated:
  - **Co-agentic** — humans and agents acting concurrently as co-authors. Mirrors "co-design"/"co-author"/"co-working," contrasts cleanly with "single-player AI," reads as adjective ("co-agentic surface", "co-agentic mode"). Recommended candidate.
  - **Pair-agentic** — riff on pair programming, accessible but conflates with human-human pair programming. Skip.
  - **Multi-agent collaboration** — vague and already overloaded by orchestration frameworks (LangGraph, CrewAI, AutoGen) describing a different thing (one operator running a swarm). Skip.

- **The category** ("agent ops"? "agent management"? "agent collaboration layer"?). Don't coin yet. Naming the category before industry alignment forms makes Tokenrip a category-of-one; every conversation pays education cost, and the coined term usually loses to whatever partners and reporters give back. Watch what comes back. Adopt or refine.

**The rule**: be a noun-coiner in the angles doc and founder writing — places where a term can land carefully and we can watch whether it gets picked up. Be conservative in the deck — partners do not need a vocabulary lesson. Tokenrip is the proper noun; the empty quadrant is the absence; the mode of work goes unnamed in the deck and named ("co-agentic") only in the angles surface and founder writing.

---

## Competitive Matrix (the deck's most fragile slide)

A 2×2 matrix is the cleanest way to show the empty quadrant. Two axes that matter:

- **Single-player vs. Multi-player** — does the product produce team-shareable artifacts?
- **Top-down vs. Bottom-up** — who decides to use it?

```
                       TOP-DOWN                  BOTTOM-UP

SINGLE-PLAYER          Copilot                   ChatGPT
                       Salesforce Einstein       Claude
                       Enterprise IT pilots      Lovable / Bolt / v0
                                                 CodeWords.ai

MULTI-PLAYER           Palantir / services       TOKENRIP
                       consulting deployments    portable team agents
```

**Caption** (deck-ready): Incumbents validate workplace AI. Tokenrip owns the runtime-neutral collaboration layer.

Note: agent frameworks (LangGraph, CrewAI, AutoGen) belong off-matrix — they're orchestration tools for developers, not platforms for end users. Worth one line of acknowledgment in speaker notes, not real estate on the slide. Cursor is deliberately off-matrix too — it's a coding tool with multi-player via git, which doesn't fit cleanly on the bottom-up single-player end.

### The hard question this slide invites

"What stops Anthropic / OpenAI from filling the empty quadrant?" — answered in speaker notes: their incentives keep users inside their runtime (that's where their inference revenue lives); portability across competitors' tools is anti-aligned with their business model. The neutral substrate has to be a third party.

---

## GTM Plan

### Three motions, one substrate

1. **Upwork-as-discovery** (active) — apply to AI agent gigs. Each gig is paid + market research + product test.
2. **Workplace bottom-up** (T0) — Glo-class outreach via the natural channels (LinkedIn AI Champion communities, indie ops Twitter, the new normal worker discord-and-newsletter ecosystem).
3. **Creator-supplied content** (existing motion E, relocated) — creators publish methodology agents that Glos mount. Creator motion becomes content supply, not the wedge.

### The Upwork Rule (consulting-drift mitigation)

A gig only counts if it produces a reusable mounted agent on Tokenrip. Tripwire at 10 gigs:
- 3-5 reusable patterns → discovery working, build templates
- 10 unique bespoke projects → consulting business, not product. Cut the cord.

Track per gig: which pattern category, which architectural primitives used, whether the artifact lives on Tokenrip.

### Why this GTM is investable

- Revenue from day one (Upwork pays)
- Customer discovery as a byproduct (every gig is a discovery interview)
- Product validation as a byproduct (every gig pressure-tests the substrate)
- Distribution as a byproduct (every gig is a case study, every Upwork buyer is a potential Glo or AI Agent Manager)
- No paid CAC (Upwork is the channel)

This is structurally the Stripe/Patrick-Collison concierge pattern, with an explicit graduation rule.

### First-customer sourcing: warm before cold

Dust's first customers were not a channel — they were the founders' network (Gabriel Hubert was CPO at Alan, now a flagship customer; the rest are Paris-ecosystem scale-ups reachable by warm intro). The scalable channels came *after* product-market fit. Tokenrip's first 10 deploys should be sourced the same way: Simon's documented "Glo" contact is customer zero; Alek's 400+ RebelFi customer-development relationships are a warm list. Cold mid-tier creator and Glo outreach (motion 2 above) is where the motion *scales to*, not where it *starts*.

### Discipline lessons from the Dust teardown

- **Probe and kill.** Dust ran two failed motions (developer framework, XP1 browser extension) before the winner, and never married either. Treat the CLI, Moa, and the Chief of Staff lighthouse the same way — instruments measured by signal, not artifacts to defend.
- **Instrument every deploy as a case study.** Dust converts every customer into a hard-numbers story. Tokenrip has none because it has no customers; build the capture template before the first deploy lands.
- **Kill jargon in the product, not only the deck.** Dust deliberately shipped "instructions," not "system prompt." The pitch-translation table above must also govern the product UI — "mounted agent / imprint / harness / substrate / operator" should not appear in front of a Glo.
- **Founder as credible voice.** Stan Polu (ex-OpenAI) builds in public with real metrics. Simon's twenty-year record and a NASDAQ-acquired company are unused distribution credibility.

---

## Pricing Hypothesis

Three tiers, mapped to the ladder. Numbers are illustrative — refine pre-deck.

| Tier | Buyer | Price | What's included |
|------|-------|-------|-----------------|
| Free | Glo | $0 | Mount agents, persistent memory, BYO model, public agents |
| Team | AI Agent Manager | $20-50/user/mo | Shared memory, versioning, observability, tooling surface (search, webhooks, scheduled), audit |
| Enterprise | IT / CTO | $50K-500K/yr | On-prem MCP, SSO, internal data sources, multi-tenant isolation, compliance |

Plus marketplace take rate on creator-published agents (20%) — relevant when the supply side fires.

---

## What's NOT in This Pitch (Deliberately)

Things that are real but would muddy a 7-slide deck:

- **Mounted agent vocabulary** as the pitch primitive (architecture is slide 4, not the spine)
- **Inter-agent marketplace / agent commerce** (long-term moat, slide-13 territory if needed)
- **Deliverable rails** (great strategic positioning, wrong for this deck)
- **Warehouse → factory framing** (Jensen Huang frame; for thought leadership, not for a16z)
- **Series 3 blog content** (great supporting collateral; not a pitch slide)
- **Coding-agent contrast** (LangGraph/CrewAI etc.) — off-matrix, one line in speaker notes
- **The full five-motion taxonomy** (`bd/motions-and-strategy.md`) — internal navigation, not investor narrative

---

## Validation Threads Before Deck Is Final

1. **LinkedIn title scrape** — 12-month growth in "AI Manager"/"AI Lead"/"AI Champion"/"Head of AI". Should take an afternoon. Strengthens slide 5 and the "why now" answer.
2. **3 more Glos** — verbatim testimonials. Look for variance. Pick the most defensible variant.
3. **1-2 actual AI Agent Managers** — what do they spend time on? Validates the team-paid tier ACV and the role-pair structure.
4. **Anthropic Claude for SMB delta analysis** — exact feature gap. The slide-9 "why doesn't Anthropic do this" answer should be ready.
5. **First 5 Upwork gigs run with the rule in place** — produces real traction evidence for slide 7.
6. **CodeWords.ai teardown** — exactly how single-player vs. multi-player plays in their actual product. Sharpens the counter-data-point.
7. **Solo-operator retention** — do single Glos return on standalone value alone, before any coworker sharing? The architectural advantage over destination-workspace incumbents (Dust et al.) depends on this being true. Test before the deck leans on it.
8. **Tenant-tier pain validation via cold LinkedIn outreach** — methodology-IP firms (mid-tier consulting, boutique law, regional accounting), regulated mid-market (RIAs, specialty insurance, family offices), and healthcare-adjacent services (pharma services, medical billing, CROs). Test whether the token-control / data-sovereignty pain produces faster response than Glo-side outreach. Five qualified intro calls in 30 days = signal that Step 3 has a real buyer today; zero = Step 3 remains a forecast and the deck should not lean on it for partner Q&A.

---

## Risks and Counter-Bets

| Risk | Mitigation |
|------|-----------|
| AI Agent Manager is aspirational, not real | LinkedIn data + 1-2 verified role-holders before pitch |
| Anthropic / OpenAI absorb the bottom-up motion | BYO model + portability anti-aligned with their economics; reframe as complementary |
| Upwork becomes consulting business | Tripwire rule at 10 gigs |
| Bottom-up takes too long to compound | Workplace ladder (free → team → enterprise) has 3 monetization moments, not one |
| The "vibecoder" frame contaminates the pitch | Don't use it. Glo is a workflow author, not a builder. Empty shelf, not Lovable's shelf. |
| Multi-protagonist pitch (Glo + Manager + Creator + IT) becomes incoherent | Ladder discipline: pitch the journey, not the segments |
| Glo stays a happy free solo user; the first share never happens | Engineer the share: handoff-shaped agent outputs (intrinsic) + manager-pull via observability (pulled). See "Engineering the First Share." |
| Enterprise tier remains hand-wavy without a named buyer | Wide-net LinkedIn outreach to methodology-IP and regulated-mid-market ICPs using the Vijay/Chamath frame as the hook; 5 intro calls in 30 days as signal. If zero response, the deck stops claiming the tier and Step 3 becomes a future-state slide. |

---

## Open Strategic Questions

- **Where does Chief of Staff sit?** Probably as the "what a mounted agent looks like" demo — the lighthouse. Concrete proof of the architecture working. Less about creators now, more about "this is what a Glo could build with her boss's help and a creator's template."
- **Does the creator motion need a dedicated slide or fits in GTM?** Lean toward GTM-only. Don't bifurcate the pitch.
- **Should we name the category, the surface, or the mode of work?** Three different things, three different answers — see "Naming the surface and the mode" under Architecture. Short version: don't coin a category or surface noun in the deck (Tokenrip is the proper noun; the empty quadrant on slide 5 is the absence). Do float **"co-agentic"** as a mode-of-work term in the angles doc and founder writing — see whether partners pick it up.
- **Is the cover line still right?** "Portable AI agents, shared with your team" banks the differentiation on "portable" alone, which does not clearly exclude Slack-resident super-agents (Shopify's River, Ramp's, etc.). See "Cover-Line: Distinguishing from Slack-Resident Agents." Recommendation: swap to **"AI agents that travel between your team's tools."** Defer locking until partner-rendered parallel tests.
- **What's the deck length for accelerator vs. seed/Series A?** This deck targets a16z accelerator (7 slides). The seed/A version would be 12-15 with traction, financials, team depth.
- **Does the first-share mechanic belong on a slide?** Slide 4 currently asserts the team adopts without showing *how*. The intrinsic/pulled mechanic lives in speaker notes for now — revisit if partners keep asking "why does the team ever pay?"

---

## Source Anchors

- `agents/bean/sessions/2026-05-14.md` — the session that produced this thesis
- `agents/bean/ideas/workplace-bottom-up-agent-adoption.md` — the standalone idea note
- `product/tokenrip/mounted-agent-model.md` — the architecture (unchanged)
- `product/tokenrip/tokenrip-positioning.md` — the seven positioning angles (broader catalogue)
- `product/tokenrip/external-positioning.md` — firm/builder messaging guide
- `bd/icps.md` — full ICP taxonomy (Glo is the New Normal Worker; Manager is the AI Enabler)
- `bd/motions-and-strategy.md` — five-motion taxonomy and architectural-requirement test
- `active/upwork-ai-agent-jobs.csv` — Upwork "AI Agent" job market scrape (2026-05-14)
- `__ARCHIVE/yc-tokenrip-pitch-framing-2026-05-02-codex.md` — prior YC framing (useful contrast)
- `active/research-dust-competitive-analysis-2026-05-18.md` — Dust competitive analysis + GTM teardown (source of the first-share mechanic and the discipline lessons)
- `bd/calls/transcripts/vijay-laknidhi-2026-05-19.md` — discovery call that surfaced the Travelers/12K-Claude-seat vendor-lock-in framing; primary evidence for the Enterprise-tier trigger (token-control / portability as the close-the-deal pain)
- `active/2026-05-25-the-ai-paradox-more-automation-more-humans-more-work-dan-shipper.md` — Dan Shipper on Lenny's Podcast, May 25 2026; primary-source validation for the multi-agent shared-state framing (humans + agents on shared surfaces, two-agents-better-than-one, SaaS-comes-back-because-BYO-tokens, forward-deployed engineer as new role). Source of "The Multi-Agent Sharpening" section.
