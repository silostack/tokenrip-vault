# Applications on Tokenrip — Exploring the First-Customer Strategy

> Working strategy memo for Simon × Alek discussion. Captures the full thinking from yesterday's angel call, our prior internal alignment, and today's TaxDome opportunity. Proposes a cheap test plan for the week.

**Date:** April 29, 2026
**Status:** Strategy exploration — for Simon × Alek discussion
**Origin:** Angel investor call (4/29) + prior internal discussion (4/28)
**Decision needed:** Whether to commit ~10 hours this week running the cheap tests that would tell us if this strategic shift is real

**Related:**
- [[active/taxdome/taxdome-call-brief-2026-04-27]] — TaxDome strategic landscape
- [[active/taxdome/taxdome-design-partnership-memo-2026-04-29]] — Design partnership framing
- [[active/taxdome/garcia-return-scene]] — Reusable narrative artifact
- [[product/tokenrip/tokenrip-positioning]] — Catalog of positioning angles
- [[product/tokenrip/mounted-agent-model]] — Imprint/memory/harness separation thesis

---

## At a Glance

After an angel call yesterday and our own prior thinking, we are exploring a strategic shift in how we position and sell Tokenrip.

**The shift:** Lead with concrete applications built on top of our infrastructure, rather than selling the infrastructure directly. *Nobody bought SMTP. People bought email.*

**This is not a pivot.** Tokenrip remains the platform. The change is in (1) how we pitch externally — application-led narrative, (2) how we test product-market fit — build a real application with a real customer as design partner, and (3) what drives architecture — real customer requirements replacing "what Simon and Alek need" as the forcing function.

**The first concrete test is today.** TaxDome is a strategic fit because their primary risk (Juno absorbing them via one-way data flow) is *literally* the user pain Tokenrip solves: documents that carry their own context across AI partners. If TaxDome bites, the prize is enormous — ~50K tax firms of distribution, a vertical case study, and a real customer forcing function — for a 12-week build.

**The decision today is not "go all in."** It is whether to spend ~10 hours this week running the cheap tests that would tell us if this is real, with a Friday checkpoint.

---

## The Strategic Shift

### What We Heard from the Angel

Yesterday's angel call surfaced strong feedback on Tokenrip's pitchability:

- The infrastructure framing struggled. The investor had to work to grasp what it does.
- The application framing — agentic document collaboration with a human in the loop — produced immediate excitement. He got it instantly.
- His suggested mechanics: target verticals (he named insurance), build integrations into where business documents already live (Google Docs, Microsoft), get paid pilots, spend 90% of time on outreach.
- He estimated 6-figure pilots are achievable and a 6–8 month window before incumbents close the gap.

### What We Already Believed

We had landed in roughly the same place on Tuesday. The "sell email, not SMTP" framing emerged independently. The application-led pitch matches our positioning doc, which already separates infrastructure from product narrative. The angel's reaction confirmed a thesis we had formed; he did not redirect the company.

This is the *independent convergence with external thinkers* pattern we have seen before — a stronger validation signal than fresh advice.

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

## The Positioning Frame

**Builder narrative:** "We are building Google Docs in AI, not AI in Google Docs."

A clean inversion of the mental model. *AI in Google Docs* = bolt-on copilot inside a human-first product. *Google Docs in AI* = documents are first-class objects in the agent's workflow, with humans in the loop. It tells a listener what category of thing this is.

This frame is for context-setting. It is not the wedge.

---

## The Wedge

**User-facing line:** *Stop re-briefing your agent.* Every Tokenrip document carries its own context — past versions, what changed, what is next — so the next agent (yours, theirs, on any platform) picks up where the last one left off.

### The Pain

Users — operators, knowledge workers, professional services staff — spend enormous energy briefing agents. Every chat turn starts with "here is the situation, here is the file, here is where we left off." The pain is not that agents are bad; it is that humans burn cognitive overhead translating context into prompts.

The angel named this directly: *"if an agent can get a document, automatically pull context and know what needs to be done, that reduces the user's own context load tremendously."*

### The Magic

The document carries its own briefing. The next agent — even one running on a different platform, owned by a different person — opens the link and just *knows* what is going on. No prompt engineering. No context dumps.

### The Architecture

Self-briefing documents require:

- **Versioning with structured changelogs** (each version explains itself)
- **Multi-agent provenance** (every contributor leaves a trace)
- **Cross-platform agent identity** (agents on Claude, ChatGPT, Cursor, etc., can all read and write)
- **Capability-based access** (no auth friction for new collaborators)

Tokenrip already has all of these primitives. The application layer wraps them in a workflow.

---

## The Differentiator

**Cross-platform agent collaboration is the wedge that incumbents structurally cannot build.**

Microsoft and Google are each other's competitors. They cannot build a layer where a Claude user and a ChatGPT user collaborate on a Google Doc. Even within their own ecosystems, they cannot build a multi-agent provenance graph because they are not collaboration-neutral substrates.

This is not a 6-month window. It is a structural asymmetry. As long as the AI ecosystem is multi-vendor, there is a need for a neutral collaboration layer. Tokenrip is positioned for it.

---

## The First Test — TaxDome

### What Is Happening

Petar (CMO) and the CTO at TaxDome want to discuss two things on today's call: API protection (preventing third-party agents from off-boarding their customers) and AI strategy (how to strengthen positioning).

### Why It Fits

TaxDome's strategic problem maps directly onto the user pain Tokenrip solves:

- TaxDome partnered with Juno (AI tax prep). TaxDome sends documents to Juno; Juno processes; **nothing comes back except a "complete" status.**
- This is the briefing tax problem at the firm scale. Every return that goes through Juno strips out the firm's context. Partners reviewing returns have no insight into Juno's reasoning. Firms re-explain context every cycle.
- The 24-month risk: Juno builds light practice management features, captures the direct billing relationship, and TaxDome becomes redundant.

The AI-strategy answer that wins for TaxDome is "system of record + orchestration layer." That requires bidirectional context flow between TaxDome and any AI partner. **Tokenrip is the architecture for that.**

### The Pitch Arc for the Call

1. **Listen.** Don't pitch first. Let them describe their thinking.
2. **Diagnose.** The API isn't the real risk. Juno is — and the mechanism is one-way data flow.
3. **Drop the Garcia-return scene.** Make the briefing tax visceral.
4. **Name the architectural insight:** *"You can't ask your AI partners to feed your moat. You have to own the layer they all flow through."*
5. **Reveal Tokenrip last, briefly.** Position as horizontal infrastructure that fits their tax-vertical workflow. Plant the design-partnership flag.

### What Is At Stake

If TaxDome bites, this is much bigger than a pilot:

- **Distribution:** ~50K tax firms via TaxDome embed
- **Vertical case study:** Tax is document-heavy, multi-collaborator, AI-disrupted. Wins here generalize to legal, real estate, insurance, M&A.
- **Strategic positioning:** "Orchestration substrate for vertical SaaS" is a much larger story than "agentic document collaboration."

### Watch-Outs

- They might decide to build it themselves. Counter: this is horizontal infrastructure, not their core competency.
- They might want vertical exclusivity. Be careful what we commit to in exchange for what.
- Don't trash Juno. Frame it as generic AI-partner risk applicable to any future partner.
- Be honest about what is built versus what would need building. Design-partnership framing acknowledges the co-build reality.

---

## The Bigger Pattern

The same dynamic that makes TaxDome a fit applies to many vertical SaaS players:

| Industry | Operations layer | AI partner | Briefing tax |
|----------|------------------|------------|--------------|
| **Tax / accounting** | TaxDome, Canopy, Karbon | Juno, Practiq | Returns flow out, context lost |
| **Legal** | Clio, MyCase, PracticePanther | Harvey, EvenUp | Matters flow out, context lost |
| **Real estate** | Dotloop, Skyslope, Lone Wolf | Various | Deal packages flow out, context lost |
| **Insurance** | Applied, Vertafore, EZLynx | Various | Policy work flows out, context lost |
| **M&A / banking** | Datasite, Intralinks | Various | Deal docs flow out, context lost |

Each of these vertical SaaS players faces the same risk: AI partners absorbing the relationship. Each has the same defensive strategy: become the connective tissue. Each can be served by the same Tokenrip substrate, wrapped in a vertical-specific application.

**Close one, and we have a template. The template scales to the rest.**

---

## Open Questions

These are the questions we should think through together.

### Strategic

1. **What does "go all in" mean for us?** If TaxDome bites, do we shift Simon's time to 70% application + 30% platform? 100%? Where does Alek's time go?
2. **Same team, or split?** Do we build the application and the platform with the same engineering muscle, or treat the application as a temporary forcing function and keep platform development separate?
3. **What is the right vertical to target second** if TaxDome doesn't move? The angel suggested insurance; we have a real estate warm intro; legal might be a stronger fit given document-heavy multi-party workflows.
4. **How do we manage the platform-vs-application boundary?** Default rule: anything specific to a customer's vertical lives in the application; anything that is a primitive of agent collaboration goes in the platform. Audit each request against that rule. Customer pressure always wins in the moment if the rule isn't pre-set.

### Tactical

5. **What is the v1 wedge for TaxDome specifically?** The Juno-wrap is the obvious answer. We would want their input on which firm pain is most acute.
6. **What is the right length for vertical exclusivity, if we offer it?** Trade-off: too short and they won't commit; too long and we are locked out of adjacent verticals.
7. **How do we price design-partner work?** Cash, equity, deferred, pure co-development? What is a fair commercial structure for both sides?
8. **What is our walk-away?** If TaxDome wants to build it themselves and license the platform, is that a yes or a no?

### Risks To Manage

9. **The consulting trap.** Every enterprise customer wants custom features. We could end up with a Frankenstein platform. Mitigated by the platform/application boundary rule — but the risk is real.
10. **The infrastructure-builder trap.** Simon's tendency to build systems over doing the work (insights file, recurring pattern). Application work could become cover for more system-building. Mitigated by accountability and explicit time-boxing.
11. **The runway timing mismatch.** Enterprise sales cycles are slow. Even if TaxDome is interested, a signed deal could be 8+ weeks away. Our runway pressure isn't on that timeline. We need cheap signal in the meantime.
12. **Distraction from current distribution motion.** Registries, agent platforms, warm leads — these are still in motion. Application-layer pursuit cannot abandon them.

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

## Proposed Tests This Week

Cheap, time-boxed, conclusive.

| Test | Cost | What It Tells Us | Owner |
|------|------|------------------|-------|
| **TaxDome call** (today) | 1 hr | Whether the application-led pitch lands with a real strategic buyer | Simon |
| **Real estate CTO call** | 1 hr | Pure discovery — what's painful, what would they pay for, where do their docs live | Simon |
| **Outreach A/B** | 4 hrs | Take the next 10 warm-lead messages; rewrite half with application-led framing. Compare reply rates. | Alek |
| **Wedge sentence test** | 1 hr | Say the wedge sentence to 3 different audiences (developer friend, agent operator, non-technical operator). Note who lights up and who blinks. | Both |
| **Vertical landscape sketch** | 3 hrs | Map the table above with real research — which players, which AI partners, which are most at risk | Either |

**Total: ~10 hours of work this week, distributed across both of us.** Outcome: a clear read by Friday on whether to commit deeper time next week.

---

## The Smallest Next Step

Run the TaxDome call. Run the real estate call. A/B the outreach. Reconvene Friday to look at the data.

If the data says go: we draft a serious application-layer push for next week.
If the data says park: we go back to the distribution plan and refine in the background.

**The decision today is not whether to bet the company on this. It is whether to spend ten hours finding out if it's real.**

---

*Revisit Friday with results from this week's tests. Update decision criteria based on what we learn.*
