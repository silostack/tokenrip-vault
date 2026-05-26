# Application-Layer Revenue for Tokenrip — Strategy & First Pilots

> Unified strategy memo for Simon × Alek. Captures the full thinking from the angel call, prior internal alignment, Yoda pressure-testing, and the TaxDome opportunity. Proposes a cheap test plan for the week.

**Date:** April 29, 2026 (updated April 30)
**Status:** Strategy exploration → sales motion design
**Origin:** Angel investor call (4/29) + prior Simon × Alek discussion (4/28) + Yoda brainstorm (4/29) + TaxDome call (4/29) + Simon × Alek debrief (4/30)
**Decision needed:** Build the vertical demo (2 days) before starting outreach

**Related:**
- [[active/taxdome/taxdome-call-brief-2026-04-27]] — TaxDome strategic landscape (full research)
- [[active/taxdome/taxdome-design-partnership-memo-2026-04-29]] — Design partnership framing
- [[active/taxdome/garcia-return-scene]] — Reusable narrative artifact
- [[product/tokenrip/tokenrip-positioning]] — Catalog of positioning angles
- [[product/tokenrip/mounted-agent-model]] — Imprint/memory/harness separation thesis

---

## At a Glance

We are exploring a strategic shift in how we position and sell Tokenrip.

**The shift:** Lead with concrete applications built on top of our infrastructure, rather than selling the infrastructure directly. *Nobody bought SMTP. People bought email.*

**This is not a pivot.** Tokenrip remains the platform. The change is in (1) how we pitch externally — application-led narrative, (2) how we test product-market fit — build a real application with a real customer as design partner, and (3) what drives architecture — real customer requirements replacing "what Simon and Alek need" as the forcing function.

**TaxDome call completed (4/29).** The advisory insight landed with the CTO but not the co-founder. The co-founder is fear-driven and defensive-posture — his customers are "mom and pop in Oklahoma" and he wants a full-service, stay-in-TaxDome experience, not an API orchestration play. The opportunity isn't dead, but it's slower than hoped. Petar remains a warm channel.

**The blocker identified (4/30).** Simon and Alek attempted to define the sales motion. Alek asked "what's the product?" six times in different ways without getting a concrete answer. The SMTP/email problem is playing out internally — we can describe the infrastructure but not the application. **Before any outreach, we need a vertical demo that answers "what are we selling?" in 3 minutes.** This is a ~2 day build.

---

## The Thesis: Sell Email, Not SMTP

Tokenrip is infrastructure (the collaboration layer for AI agents). Infrastructure is hard to sell directly — the angel investor struggled to understand it until the conversation shifted to an application: agentic document collaboration. The application layer is where revenue lives. The infrastructure is where durable value lives. Both are needed.

**The strategy:** Sell applications built on Tokenrip infrastructure. Make the infrastructure invisible to the buyer. Each application is a forcing function for fleshing out the underlying architecture — and a path to revenue.

We had landed in roughly this place on Tuesday, independently. The "sell email, not SMTP" framing emerged from our own positioning discussions. The application-led pitch matches our positioning doc, which already separates infrastructure from product narrative. The angel's reaction confirmed a thesis we had formed; he did not redirect the company.

This is the *independent convergence with external thinkers* pattern — a stronger validation signal than fresh advice.

---

## What the Angel Investor Said

Yesterday's angel call surfaced strong feedback on Tokenrip's pitchability:

- The **infrastructure framing struggled.** The investor had to work to grasp what it does.
- The **application framing** — agentic document collaboration with a human in the loop — produced immediate excitement. He got it instantly.
- His words: *"If an agent can get a document, automatically pull context and know what needs to be done, that reduces the user's own context load/overhead tremendously."*
- He thinks **human-in-the-loop augmentation** (not full automation) is the right approach.
- He estimates a **6-8 month window** before incumbents figure this out.
- He recommends **90% of time on outreach**, getting **paid pilots** (estimates 6-figure potential).
- He suggested **vertical targeting** — mentioned insurance specifically.
- He recommended **Google Docs / Microsoft integrations** — source context from where businesses already store information.
- He referenced **Google's FUSE** (filesystem mounting) — parallel to the mounted agent model.

---

## Pressure-Tested Assessment

Not all of the angel's advice is equal. Here's our read:

| Advice | Assessment |
|---|---|
| Monetize now | **Strong.** Revenue relieves runway pressure and validates product-market fit. Even 5 figures would be transformative. |
| 6-8 month window | **Reframe.** The question is window *for what*. If it's "before Google/Microsoft embed AI into Docs/Office" — shorter and on their turf. If it's "before someone builds the cross-platform agent collaboration layer" — this isn't a time window at all, it's a **structural asymmetry.** Microsoft and Google are each other's competitors. They cannot build a neutral layer where a Claude user and a ChatGPT user collaborate on a Google Doc. As long as the AI ecosystem is multi-vendor, there is a need for a neutral collaboration layer. |
| 90% outreach | **Aggressive.** Can't do 90% outreach without a crisp thing to sell. Need to define the wedge first. |
| 6-figure pilots | **Ambitious but possible.** Depends on vertical, buyer, and value prop. $25-50K is more realistic for a first design-partner engagement. Enterprise sales cycles are 6-12 months — the runway pressure that makes large pilots attractive is incompatible with their timeline. |
| Target verticals | **Sound.** Classic enterprise playbook. Specificity sells. But we choose based on fit with the wedge, conversational momentum, and unfair advantage — not because the angel named a specific industry. |
| Google Docs / Microsoft integrations | **Reference-not-integrate for v0.** Significant engineering investment. Aligns with the mounted agent model (mount context from where it already lives). But we don't build it speculatively — a customer pays for it. |

---

## What We Are Doing / What We Are Not Doing

### What We Are *Not* Doing

To be precise about what we are rejecting from the angel's specific recommendations:

- **Not pivoting to vertical SaaS.** Tokenrip remains a horizontal platform.
- **Not abandoning current distribution motion** (registries, agent platforms, warm leads). Application-layer outreach runs in parallel.
- **Not picking a vertical because the angel said so.** We choose based on fit with the wedge, conversational momentum, and unfair advantage.
- **Not building deep Google Docs / Microsoft integrations speculatively.** Reference-not-integrate is the v0 approach until a customer pays for it.
- **Not chasing 6-figure enterprise pilots when our runway is short.** Enterprise sales cycles are 6–12 months; the runway pressure that makes large pilots attractive is incompatible with their timeline. We will take design-partner relationships at any size that proves the wedge.

### What We *Are* Doing

- **Reframing how we pitch Tokenrip externally** — application-led, not infrastructure-led.
- **Identifying the wedge use case** — what specifically Tokenrip *does* for a user — and pressure-testing it in real conversations.
- **Treating real customer interest as a forcing function** — letting their requirements drive architectural decisions instead of our own usage patterns.
- **Building the first vertical application as a design partnership** if a real opportunity surfaces (TaxDome being the obvious near-term candidate).

---

## The Wedge: Stop Re-Briefing Your Agent

**User-facing line:** *Stop re-briefing your agent.* Every Tokenrip document carries its own context — past versions, what changed, what is next — so the next agent (yours, theirs, on any platform) picks up where the last one left off.

### The Pain

Users — operators, knowledge workers, professional services staff — spend enormous energy briefing agents. Every chat turn starts with "here is the situation, here is the file, here is where we left off." The pain is not that agents are bad; it is that humans burn cognitive overhead translating context into prompts. We call this the **briefing tax.**

The angel named this directly: *"if an agent can get a document, automatically pull context and know what needs to be done, that reduces the user's own context load tremendously."*

### The Magic

The document carries its own briefing. The next agent — even one running on a different platform, owned by a different person — opens the link and just *knows* what is going on. No prompt engineering. No context dumps.

### What This Looks Like in Practice

| Agent Capability | Human Overhead Eliminated |
|---|---|
| Reads shared documents, summarizes what changed | Opening 5 files to "catch up" before a meeting |
| Flags conflicts between versions or contributors | Discovering contradictions after a deliverable ships |
| Drafts responses or next steps based on context | 30 min writing a status email |
| Tracks who owes what and follows up | The "did anyone do this?" Slack message |
| Bridges platforms — syncs state across tools | Manual copy-paste between Google Docs, Claude, ChatGPT |

### The Architecture

Self-briefing documents require:

- **Versioning with structured changelogs** (each version explains itself)
- **Multi-agent provenance** (every contributor leaves a trace)
- **Cross-platform agent identity** (agents on Claude, ChatGPT, Cursor, etc., can all read and write)
- **Capability-based access** (no auth friction for new collaborators)

Tokenrip already has all of these primitives. The application layer wraps them in a workflow.

---

## The Differentiator: Cross-Platform Agent Collaboration

**Cross-platform agent collaboration is the wedge that incumbents structurally cannot build.**

This isn't "AI in Google Docs." It's **"Google Docs in AI."** The collaboration surface is the product. The document tool is just one input source. The thing being collaborated on shouldn't dictate what's used to do the collaboration.

Microsoft and Google are each other's competitors. They cannot build a layer where a Claude user and a ChatGPT user collaborate on a Google Doc. Even within their own ecosystems, they cannot build a multi-agent provenance graph because they are not collaboration-neutral substrates.

This is not a 6-month window. It is a **structural asymmetry.** As long as the AI ecosystem is multi-vendor, there is a need for a neutral collaboration layer. Tokenrip is positioned for it.

---

## Vertical Analysis

### Criteria for a Good Pilot Vertical

1. **Document-heavy workflows** — lots of artifacts passed between parties
2. **Multi-stakeholder coordination** — multiple parties needing alignment
3. **High cost of coordination failure** — dropped balls are expensive

### Verticals Evaluated

| Vertical | Workflow | Parties | Briefing Tax | Cost of Failure | Warm Lead? |
|---|---|---|---|---|---|
| **Tax / Accounting** | Return prep, review, filing, client communication | Firm, AI prep tools, client, tax software | Returns flow out, context lost | Missed deadlines, compliance risk | **Yes** — Petar at TaxDome |
| **Real Estate** | Closings, inspections, contracts, appraisals | Buyer, seller, agents, title co, lender | Deal packages flow out, context lost | Delayed closings, legal exposure | **Yes** — CTO friend at RE tech co |
| **Insurance** | Claims processing, adjusting, settlement | Claimant, adjuster, contractor, legal | Policy work flows out, context lost | Delayed settlements, regulatory fines | No |
| **Legal (M&A)** | Due diligence, redlining, closing checklists | Buyer's counsel, seller's counsel, principals | Matters flow out, context lost | Blown timelines, malpractice risk | No |
| **Construction** | RFIs, submittals, change orders | GC, subs, architects, owner | Submittals flow out, context lost | Rework, disputes | No |
| **Consulting** | Deliverable drafts, review cycles, approvals | Consulting team, client, SMEs | Deliverables flow out, context lost | Missed deadlines, scope creep | No |

### Recommended First Targets

**1. Tax / Accounting (via TaxDome)** — Strongest lead. We've already done deep research on their competitive dynamics. The "AI-enable" pitch maps directly to their needs. 50,000 firms on the platform. Call happening today.

**2. Real Estate (via CTO friend)** — Warm lead. Well-defined transaction workflows. Multi-party by nature. Measurable outcome (days to close).

---

## The First Test: TaxDome

### What Is Happening

Petar (CMO, Simon's friend) and the CTO at TaxDome want to discuss API protection (preventing third-party agents from off-boarding customers) and AI strategy (how to strengthen positioning). Full research in [[taxdome-call-brief-2026-04-27]].

### Why It Fits

TaxDome's strategic problem maps directly onto the user pain Tokenrip solves:

- TaxDome partnered with Juno (AI tax prep, $12M seed raised). TaxDome sends documents to Juno; Juno processes; **nothing comes back except a "complete" status.**
- This is the briefing tax at the firm scale. Every return that goes through Juno strips out the firm's context. Partners reviewing returns have no insight into Juno's reasoning. Firms re-explain context every cycle.
- The 24-month risk: Juno builds light practice management features, captures the direct billing relationship, and TaxDome becomes redundant.

### The Core Advisory Insight: AI-Enable, Don't AI-Build

TaxDome doesn't need to spend tokens on its own AI offering. They just need to "AI-enable" what they already have — make their existing platform (documents, workflows, client relationships, billing) legible and interactive for AI agents. The firms' AI tools bring the compute. TaxDome provides the context and coordination surface. TaxDome's cost to serve AI scales with storage and API calls, not token usage.

**What TaxDome needs is structurally identical to what Tokenrip provides:**

| What TaxDome Needs | Tokenrip Primitive |
|---|---|
| AI tools access documents through a controlled layer | Assets (versioned, access-controlled, content-negotiated) |
| Bidirectional data flow — results flow back | Structured messaging with typed intents |
| Multiple AI providers, not just Juno | Cross-platform agent collaboration |
| System of record that all AI tools converge on | Persistent assets with provenance and lineage |
| Visibility into what AI tools are doing | Inbox + activity feed |
| Controlled access per provider | Agent identity + capability tokens |

### The Pitch Arc for the Call

1. **Listen.** Don't pitch first. Let them describe their thinking.
2. **Diagnose.** The API isn't the real risk. Juno is — and the mechanism is one-way data flow.
3. **Drop the Garcia-return scene.** Make the briefing tax visceral.
4. **Name the architectural insight:** *"You can't ask your AI partners to feed your moat. You have to own the layer they all flow through."*
5. **Reveal Tokenrip last, briefly** — only if the conversation goes there naturally. Position as horizontal infrastructure that fits their tax-vertical workflow. Plant the design-partnership flag.

**Approach:** Pure advisory. Deliver strategic value. No pitch. If they're interested, follow up with Petar separately.

### If They Bite — Pilot Structure

- **Phase 1 (2-3 weeks):** Visibility wedge — agent that monitors the TaxDome ↔ Juno workflow, provides bidirectional visibility the firms currently lack
- **Phase 2 (4-6 weeks):** Multi-provider orchestration — route work to multiple AI prep providers through a controlled collaboration layer
- **Phase 3:** AI practice management features built on the collaboration substrate

**Pricing:** $25-50K for Phase 1+2. Value framing: 50,000 firms at ~$50-100/month each = $30-60M ARR. If Juno displaces even 10%, that's $3-6M lost. A $25-50K pilot to protect that base is trivial.

### What's at Stake

If TaxDome bites, this is much bigger than a pilot:

- **Distribution:** ~50K tax firms via TaxDome embed
- **Vertical case study:** Tax is document-heavy, multi-collaborator, AI-disrupted. Wins here generalize to legal, real estate, insurance, M&A.
- **Strategic positioning:** "Orchestration substrate for vertical SaaS" is a much larger story than "agentic document collaboration."

### TaxDome Call Results (April 29)

**What happened:** Simon went in as advisor. Delivered the full strategic brief — API risk analysis, Juno power dynamic, system-of-record thesis. The CTO understood the orchestration play. The co-founder did not engage with it.

**Key learnings:**

- **The co-founder is fear-driven.** Defensive posture — worried about off-boarding, not thinking offensively about AI strategy. The "become the orchestration layer" pitch requires offensive thinking.
- **"Our users don't want to live in Claude."** His mental model is that their customers (small tax firms) are not AI-literate. He wants a full-service, keep-them-in-TaxDome experience, not an API platform play.
- **The CTO got it.** He understood the orchestration argument. But the business decision-maker didn't. Same dynamic as the angel call: technical people see infrastructure, business people need the application.
- **They're thinking about launching an agent builder.** Which contradicts the "our users don't use AI" framing. There's internal misalignment at TaxDome on their AI strategy.
- **The pitch mismatch:** The orchestration layer is the right *strategic* recommendation for TaxDome. But it's not what they're ready to buy today. They need to feel the pain more acutely — or see a concrete demo of what "AI-enabled TaxDome" looks like.

**What this means for us:** TaxDome validated the *pattern* (vertical SaaS threatened by AI-native partner) but not the *product* (we couldn't show them what they'd be buying). The opportunity isn't dead — Petar is a warm channel and the co-founder may come around — but it's not a near-term pilot. The mounted agent demo may re-open the conversation.

### Watch-Outs

- They might decide to build it themselves. Counter: this is horizontal infrastructure, not their core competency.
- They might want vertical exclusivity. Be careful what we commit to in exchange for what.
- Don't trash Juno. Frame it as generic AI-partner risk applicable to any future partner.
- Be honest about what is built versus what would need building. Design-partnership framing acknowledges the co-build reality.

---

## The Product Definition Gap

### What the Simon × Alek Debrief Revealed (April 30)

Simon and Alek attempted to define the sales motion. The conversation exposed a critical gap: **we can describe the infrastructure but not the product.**

Alek asked "what's the product?" in six different ways:
- "What does them using us look like?"
- "But what's the product?"
- "Who's building the product, though?"
- "What are we selling them?"
- "Should we not have a rough idea of what the product looks like?"
- "What does that look like?"

Each time, the answer came back as infrastructure: AWS analogies, "the ability to leverage AI," "it's a syncing problem," "Git for non-engineering work." All true. All too abstract for a sales conversation.

**Alek's sharpest pushback:** *"If someone went to me and said 'I can make you a bunch of money' and I say 'how' and they say 'let me take a look at your finances' — versus someone with a product. It's ambiguous."*

And: *"If we go to someone with this broad term of, like, use agentic workflows... there's probably been a million people that have done that to them."*

**He's right.** If the co-founder can't see the product in a one-hour conversation where he's actively trying to understand, a cold prospect won't see it in 30 minutes.

This is the SMTP/email problem playing out internally. The strategy doc says "sell email, not SMTP" — but the conversation was 100% SMTP.

### The One-Sentence Product

The most concrete description that emerged from the conversation was Simon describing a real estate closing workflow:

> *"The agent goes in and looks at the documents. This needs fixing. This needs fixing. An agent can do pre-processing — is the document filled out correctly? Does it have missing information? If it doesn't pass, you don't even need the human in the loop. Send it back to the buyer. Agent handles that 100%. Then the human reviewer approves, agent moves it to the next step."*

**That's a product.** Not "collaboration infrastructure." It's:

**"Your documents move themselves through your workflow — reviewed, routed, and tracked by an AI agent, with your team approving at each step."**

This is the sentence that needs to be demonstrable before outreach begins.

### The Demo Requirement

**Before any outreach, build a 3-minute vertical demo.** This is the gate. Without it, every outreach conversation will be a version of the Simon × Alek conversation — except the prospect will be less patient.

**Demo spec (real estate closing — 2 days of work):**

1. Buyer submits documents (simulated)
2. AI agent reviews for completeness, flags missing items
3. Agent routes approved docs to the right party (title company, appraiser, etc.)
4. Dashboard shows status of all documents across all parties
5. Human reviewer approves at each gate

Built on Tokenrip primitives. Skinned for the vertical. When Alek can show it and say "this is what we sell" — then start outreach.

### Additional Concerns from Alek (Valid, Must Address)

- **Liability in regulated industries.** "If an agent messes up a document or interprets something wrong." Mitigated by human-in-the-loop at every approval gate. Lead with "your team approves at every step" before prospects have a chance to worry.
- **AI adoption.** "Are real estate agencies even using Claude?" The agent works alongside non-AI-using parties — one party uses AI tools, the other just gets an email. This must be visible in the demo.
- **Multi-party buy-in.** "This requires both people to be using an agent." It doesn't. The platform agent handles routing to parties who interact via their normal tools (email, portal, etc.). Only the brokerage/firm needs to adopt.

---

## The Sales Motion

### The Deployed Engineer Model

Simon named this in the conversation: the **Palantir deployed-engineer model.** Palantir doesn't walk into the Pentagon saying "we have great infrastructure." They walk in with a demo tailored to the customer's domain. A deployed engineer goes to the customer, understands their workflow, and builds a solution using Palantir's infrastructure.

That's the sales motion for Tokenrip's application layer. But Palantir always has a demo first.

### Five Steps

| Step | What Happens | What You Need |
|---|---|---|
| **1. Pick 1-2 verticals** | Research which industries have the strongest fit. Agreed: tax/accounting and real estate as top candidates. Alek is researching additional options. | Selection criteria from Vertical Analysis section |
| **2. Understand the workflow** | For each vertical, map the specific document workflows — who sends what to whom, what gets reviewed, where things get stuck. | 3-5 conversations with industry insiders OR desk research on workflow tools |
| **3. Build a vertical demo** | Not a full product. A 3-minute demo showing documents flowing through a workflow with an AI agent managing review, routing, and tracking. Skinned for the vertical. | ~2 days of work, built on existing Tokenrip primitives |
| **4. Pitch the problem, show the demo** | "You have 10 documents and 6 parties in a closing. Here's how an AI agent manages that flow." Then show it. | Demo + domain knowledge from step 2 |
| **5. Offer a design partnership** | "We'll build this for your specific workflow. 4-6 week pilot. You bring the domain knowledge, we bring the infrastructure." | Pricing (even free-for-case-study works at this stage) |

**Where we are now:** Step 1 (agreed on verticals) is done. Step 2 (workflow understanding) is partial — deep on tax, surface on real estate. **Step 3 (demo) is the blocker.** Steps 4-5 cannot happen without it.

### Reference Case: Lagora

Lagora (legal AI collaboration) provides a reference for what this looks like at scale:

- **One vertical (legal), deeply.** Full integrated stack for law firms.
- **Series D in 18 months.** Went from $1.8B to $5.5B valuation in five months.
- **$500M+ raised.** Built the entire vertically integrated stack — collaboration, domain knowledge, agentic execution, compliance.

**The lesson:** One vertical, deeply, produces massive value. But Lagora had to build the entire stack from scratch. Tokenrip's thesis is that the infrastructure layer is reusable — a vertical player only needs to build the application layer on top.

**The anti-lesson:** Two people don't replicate Lagora's scale. Take the strategic insight (one vertical deeply), not the execution model (raise $500M, hire 500 engineers).

---

## The Bigger Pattern

The same dynamic that makes TaxDome a fit applies to many vertical SaaS players:

| Industry | Operations Layer | AI Partner | Briefing Tax |
|----------|------------------|------------|--------------|
| **Tax / accounting** | TaxDome, Canopy, Karbon | Juno, Practiq | Returns flow out, context lost |
| **Legal** | Clio, MyCase, PracticePanther | Harvey, EvenUp | Matters flow out, context lost |
| **Real estate** | Dotloop, Skyslope, Lone Wolf | Various | Deal packages flow out, context lost |
| **Insurance** | Applied, Vertafore, EZLynx | Various | Policy work flows out, context lost |
| **M&A / banking** | Datasite, Intralinks | Various | Deal docs flow out, context lost |

Each of these vertical SaaS players faces the same risk: AI partners absorbing the relationship. Each has the same defensive strategy: become the connective tissue. Each can be served by the same Tokenrip substrate, wrapped in a vertical-specific application.

> **Incumbent SaaS platform → threatened by AI-native competitor → needs to "AI-enable" without building AI → needs an orchestration/collaboration layer → Tokenrip**

**Close one, and we have a template. The template scales to the rest.** Not one pilot — a repeatable playbook.

---

## Relationship to Current Strategy

This is **not** a pivot. It's a positioning and revenue layer on top of the existing platform play.

```
Tokenrip (infrastructure) ← unchanged, continues to develop
    ↑
Application layer (agentic document collaboration) ← NEW: what we sell
    ↑
Vertical pilots (TaxDome, real estate, etc.) ← NEW: who we sell to
```

The infrastructure serves developer distribution (registries, Claude Code, etc.) AND enterprise applications simultaneously. Enterprise pilots are a forcing function for architecture AND a revenue source. Developer distribution continues in parallel.

---

## Decision Criteria

**What constitutes "this is real, commit deeper":**

- A signed design-partnership agreement (any size, any customer matching this template) within 4 weeks of starting outreach
- OR 3+ qualified vertical-SaaS conversations of similar shape to TaxDome within 2 weeks (signals the pattern is repeatable)
- OR strong reaction (high reply rate, deep engagement) on application-led outreach to existing warm leads — signals positioning shift is broadly resonant

**What constitutes "this is noise, stay platform-focused":**

- TaxDome polite-no within 2 weeks AND no other vertical conversations gaining traction within 4 weeks
- Application-led outreach to warm leads doesn't outperform infrastructure-led outreach
- Real customer requirements consistently pull architecture in incompatible directions

**What constitutes "the positioning shift was right but the customer mix is wrong":**

- Strong general resonance to application framing, but no individual customer commits — suggests we need to build the application standalone (riskier but possible) or pick a different vertical

---

## Open Questions

### Strategic

1. **What does "go all in" mean for us?** If TaxDome bites, do we shift Simon's time to 70% application + 30% platform? 100%? Where does Alek's time go?
2. **Same team, or split?** Do we build the application and the platform with the same engineering muscle, or treat the application as a temporary forcing function and keep platform development separate?
3. **What is the right vertical to target second** if TaxDome doesn't move? The angel suggested insurance; we have a real estate warm intro; legal might be a stronger fit given document-heavy multi-party workflows.
4. **How do we manage the platform-vs-application boundary?** Default rule: anything specific to a customer's vertical lives in the application; anything that is a primitive of agent collaboration goes in the platform. Audit each request against that rule.

### Tactical

5. **What is the v1 wedge for TaxDome specifically?** The Juno-wrap is the obvious answer. We would want their input on which firm pain is most acute.
6. **What is the right length for vertical exclusivity, if we offer it?** Trade-off: too short and they won't commit; too long and we are locked out of adjacent verticals.
7. **How do we price design-partner work?** Cash, equity, deferred, pure co-development? What is a fair commercial structure for both sides?
8. **What is our walk-away?** If TaxDome wants to build it themselves and license the platform, is that a yes or a no?
9. **Should the first pilot be a services engagement (consulting + build) or a product sale?**
10. **At what point does the application layer get its own name / brand separate from "Tokenrip"?**
11. **What is the actual engineering timeline for Google Docs / Microsoft integration?** (Only relevant once a customer pays for it.)

### Risks to Manage

12. **The consulting trap.** Every enterprise customer wants custom features. We could end up with a Frankenstein platform. Mitigated by the platform/application boundary rule — but the risk is real.
13. **The infrastructure-builder trap.** Simon's tendency to build systems over doing the work. Application work could become cover for more system-building. Mitigated by accountability and explicit time-boxing.
14. **The runway timing mismatch.** Enterprise sales cycles are slow. Even if TaxDome is interested, a signed deal could be 8+ weeks away. Our runway pressure isn't on that timeline. We need cheap signal in the meantime.
15. **Distraction from current distribution motion.** Registries, agent platforms, warm leads — these are still in motion. Application-layer pursuit cannot abandon them.
16. **Multiple strategies at partial intensity.** The pilot angle deserves a real test if pursued — not a half-hearted side experiment alongside registry blitz and content amplifier.

---

## Tests Completed

| Test | Result | What We Learned |
|------|--------|-----------------|
| **TaxDome call** | ✅ Done | Pattern validated, product not. CTO got the architecture; co-founder needs to see a concrete application. Fear-driven posture, not ready for offensive AI strategy. |
| **Simon × Alek sales motion design** | ✅ Done | Exposed the product definition gap. Can't do outreach without a demo. Agreed: pick 1-2 verticals, go hard. |

| Test | Status | Notes |
|------|--------|-------|
| **Vertical landscape research** | 🔄 In progress | Alek researching. Found Karbon (practice management). Exploring insurance, consulting, bookkeeping. |
| **Real estate CTO call** | ⬜ Not started | Hold until demo is built — same lesson as TaxDome: can't pitch without showing |
| **Outreach A/B** | ⬜ Not started | Hold until demo exists |

---

## Immediate Next Steps

**The blocker is the demo.** Everything downstream — outreach, conversations, pilots — requires it.

### This Week (Updated)

| Step | What | Owner | Timeline |
|------|------|-------|----------|
| **1. Alek completes vertical research** | Identify 1-2 verticals beyond tax. Evaluate against criteria. Report tonight. | Alek | Today |
| **2. Pick the demo vertical** | Based on Alek's research + existing warm leads. Real estate is current frontrunner (Simon has domain knowledge, CTO friend, universally understood workflow). | Both | Tomorrow |
| **3. Build the vertical demo** | 3-minute demo: document submitted → agent reviews → flags issues → routes to right party → human approves → moves to next step. Built on Tokenrip primitives. | Simon | 2 days |
| **4. Alek tests the demo** | Can Alek show this and say "this is what we sell"? If not, iterate. | Alek | 1 hour |
| **5. Start outreach** | Armed with demo. Lead with the problem, show the demo, offer a design partnership. | Both | After demo passes Alek test |

### Parallel Track

- **Mounted agent demo** → may re-open TaxDome conversation. When ready, shoot Petar an email.
- **Bottom-up distribution** (registries, agent platforms, warm leads) continues alongside application-layer outreach. Different motion, same infrastructure.

### Decision Point: End of Next Week

If the demo is built and 3+ outreach conversations have happened:
- **Go signal:** At least one prospect says "show me more" or "let's talk about a pilot"
- **Park signal:** Consistent confusion or "we're not ready for this"
- **Iterate signal:** Interest in the problem but not the specific demo — adjust the vertical or the framing

---

*Unified strategy memo — April 29-30, 2026. Originated from angel investor call, prior Simon × Alek alignment, Yoda brainstorm, TaxDome call results, and Simon × Alek debrief. Next checkpoint: end of week after demo is built and first outreach conversations happen.*
