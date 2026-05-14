# a16z Pitch — Angles and Explorations

**Status**: Working document
**Created**: 2026-05-14
**Purpose**: Comprehensive reasoning behind the a16z deck. Captures the angles considered, the protagonist-swap decision, supporting evidence, competitive context, GTM logic, and open validation threads. Source of truth for deck iteration.

**Companion**: [[a16z-pitch-deck]] (the deck itself, 7 slides), [[../active/yc-tokenrip-pitch-framing-2026-05-02-codex]] (prior YC framing — useful contrast)

---

## Core Thesis (One Paragraph)

The unit of automation in knowledge work is shifting from the chatbot session to the persistent agent. But enterprises are still buying chatbots top-down while their employees are building real automation bottom-up. The two sides cannot meet without a substrate that makes individual automations team-shareable. Tokenrip is that substrate. The wedge is the non-technical employee who is already automating their job with AI. The ladder is Glo (individual, free) → AI Agent Manager (team, paid) → Company Tenant (enterprise). The motion is precedented (Slack/Notion/Figma/GitHub bottom-up SaaS) and happening now in the AI agent layer with no incumbent.

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
- Distribution: viral through Glo telling coworkers; published creators (the supply layer) as gateway agents

### Step 2 — AI Agent Manager (Team / Paid)

- Emerges when 3+ Glos exist on one team
- Coordinates the team's workflow library, versions, credentials, governance
- Pays for: shared memory across team, observability, tooling tier (search, webhooks, scheduled runs), audit
- ACV: hundreds to low thousands per team per month
- Real role today (Upwork postings, LinkedIn "AI Champion" titles); will be common by 2028

### Step 3 — Company Tenant (Enterprise)

- Tokenrip runs on the company's infrastructure (MCP layer, internal data sources, own models)
- Employees point their personal AI tools (ChatGPT, Claude, Cursor) at the company tenant for company-aware agents
- Multi-tenant isolation, SSO, compliance, audit packages
- ACV: tens to hundreds of thousands per year
- Bottom-up adoption produces buy-intent (consumerization-of-IT pattern)

### Architectural necessity per step

Each step is load-bearing on the mounted-agent architecture:
- **Step 1** requires portability (Glo uses many tools), persistence (memory survives session), BYO model (no budget)
- **Step 2** requires versioning, shared memory partitioning, observability, audit
- **Step 3** requires tenancy, identity, permission boundaries, on-prem MCP

If any of these requirements were optional, a regular SaaS could ship the same product. The architectural-requirement test (from `bd/motions-and-strategy.md`) passes cleanly at all three steps.

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

Anthropic + OpenAI are circling SMB. Microsoft is circling enterprise top-down. None of them solve the "individual automation → team capability" graduation problem because their architectures are session-grade. The window is open for the substrate that makes graduation possible. The window is not infinite — 12-24 months before someone else names this.

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
- **Her manager can version and govern it** (versioning + observability)
- **The company can run it on their infrastructure** (tenancy)
- **Tokenrip's costs don't scale with usage** (BYO model — the slide a16z will care about)

---

## Competitive Matrix (the deck's most fragile slide)

A 2×2 matrix is the cleanest way to show the empty quadrant. Two axes that matter:

- **Single-player vs. Multi-player** — does the product produce team-shareable artifacts?
- **Top-down vs. Bottom-up** — who decides to use it?

```
                 TOP-DOWN                        BOTTOM-UP
              ┌────────────────────────┬────────────────────────┐
              │                        │                        │
SINGLE-       │ Microsoft Copilot      │ ChatGPT                │
PLAYER        │ Salesforce Einstein    │ Claude                 │
              │ Enterprise IT pilots   │ CodeWords.ai           │
              │                        │ Lovable / Bolt / v0    │
              │                        │                        │
              ├────────────────────────┼────────────────────────┤
              │                        │                        │
MULTI-        │ Palantir-style         │ TOKENRIP               │
PLAYER        │ McKinsey deployments   │ (empty quadrant today) │
              │ Slow, expensive        │                        │
              │                        │                        │
              └────────────────────────┴────────────────────────┘
```

Note: agent frameworks (LangGraph, CrewAI, AutoGen) belong off-matrix — they're orchestration tools for developers, not platforms for end users. Worth one line of acknowledgment in speaker notes, not real estate on the slide.

### The hard question this slide invites

"What stops Anthropic / OpenAI from filling the empty quadrant?" — answered in speaker notes: their economics (selling inference) are structurally hostile to BYO model; their products are runtimes, not substrates; portability across competitors' tools is anti-aligned with their business model.

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

---

## Open Strategic Questions

- **Where does Chief of Staff sit?** Probably as the "what a mounted agent looks like" demo — the lighthouse. Concrete proof of the architecture working. Less about creators now, more about "this is what a Glo could build with her boss's help and a creator's template."
- **Does the creator motion need a dedicated slide or fits in GTM?** Lean toward GTM-only. Don't bifurcate the pitch.
- **Should we name the category?** "Agent ops"? "Agent management"? "Bottom-up agent platforms"? The naming question matters less than the matrix slide showing the empty quadrant. Let a16z name it back to us.
- **What's the deck length for accelerator vs. seed/Series A?** This deck targets a16z accelerator (7 slides). The seed/A version would be 12-15 with traction, financials, team depth.

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
- `active/yc-tokenrip-pitch-framing-2026-05-02-codex.md` — prior YC framing (useful contrast)
