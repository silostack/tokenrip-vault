# Stephanie Williamson Call — 2026-05-30 (firm-direct, Call 2 / clarification)

## Follow-Up Actions

### What WE Need to Do
| # | Action | Owner | Due |
|---|--------|-------|-----|
| 1 | **Decide whether the integration discovery is a paid, scoped sprint or free pre-sales — before doing the work.** Pre-package it: fixed deliverable (feasibility doc per system + firm MVP quote), a number, credited toward the build. | Simon | 2026-06-02 (before sending the discovery proposal) |
| 2 | Research the three target systems (Symplr, MD-Staff, VerityStream) for integration surface — public vs. account-gated APIs, write-into-instance capability, documentation availability | Simon | 2026-06-03 (after her docs land) |
| 3 | Send Stephanie a **discovery proposal** (scope + deliverable + price for the feasibility study) | Simon | 2026-06-04 (inferred) |
| 4 | Clarify deal structure: does the $12K Phase 1 proposal still stand behind the discovery, or is it superseded? Don't let it evaporate silently. | Simon | 2026-06-04 (fold into discovery proposal) |
| 5 | Archive both prep files (`call-prep-stephanie-williamson-aicap-2026-05-27.md`, `call-prep-stephanie-williamson-clarification-2026-05-30.md`) to `__ARCHIVE/` | Simon | 2026-06-02 |

### What THEY Need to Do
| # | Action | Who | Due |
|---|--------|-----|-----|
| 1 | Send overview document: problem statement + exactly what discovery should uncover | Stephanie | 2026-05-30 ("sometime today") |
| 2 | Send list of target systems (Symplr, MD-Staff, VerityStream) + her per-system question list | Stephanie | 2026-05-30 |
| 3 | Send prior integration/install documentation she has on hand | Stephanie | 2026-05-30 |
| 4 | Brain-dump her Symplr AI-exploration session (transcript + screenshots) and send to Simon | Stephanie | 2026-05-30 |

### What They're Expecting From Us
A **discovery proposal** — Simon explicitly said "I can get back to you with a proposal on that." She expects Simon to research the three systems and come back with a scoped plan for the integration feasibility study. The deliverable she wants out of discovery: a clear answer on which of her three integration options (A: direct API submission into the instance / B: hospital-IT-built bridge / C: overlay) is technically real, so she can pick a game plan and know what to sell. A screen-share walkthrough is offered and deferred to post-discovery.

### Open Questions Before Next Contact
- **Is the discovery paid?** Simon did not establish this on the call. Undefined discovery becomes free forward work that scopes an MVP she hasn't bought. Decide and frame before doing any of it. (See Yoda insights 2026-05-31, line 165 — this exact risk.)
- Do Symplr / MD-Staff / VerityStream actually expose a public or account-gated API that allows *writing* application data into an instance? (The core technical unknown discovery answers — and it gates MVP scope.)
- Does Stephanie have *legitimate write/API access rights*, or only UI access? She clarified: no Symplr account (Vanderbilt's), "access not an account" to MD-Staff. Discovery may be limited to docs + her screen-shares, not live API testing.
- Has the $12K Phase 1 proposal been superseded by a discovery-first structure, or does it still stand behind it? Deal shape is now ambiguous — pin it down.
- Is the mid-June MVP start still alive now that a discovery phase precedes the build?

## Call Summary
Second call with Stephanie, the clarification call she requested after receiving the $12K Phase 1 proposal. It did **not** go to the prep's plan (close to a mid-June kickoff). Instead it reopened the foundational question — *what is the integration path?* — and inserted a technical-discovery phase ahead of any build. Stephanie had done her own homework: she killed her own "low-risk non-integrated PDF pilot" idea (a coordinator can't enter data on the provider's behalf without unethically logging in as the provider), and AI-explored Symplr's database to confirm it's "modern architecture, lots of modules and API keys." She now wants Simon to run a feasibility study across the three major credentialing systems (Symplr, MD-Staff, VerityStream) to determine which integration mode is real — which in turn determines MVP scope. She'll send an overview doc, the system list, prior integration docs, and an AI brain-dump of her Symplr session today. Simon will research and come back with a discovery proposal. No commitment secured, no kickoff date booked.

## Momentum
**→ Flat (relationship ↑, deal-stage →/↓).** She is *more* engaged — did real discovery, killed her own bad option, offered screen-shares and documentation. But the deal did not advance to a commitment: the $12K proposal is effectively shelved, scope reopened, and a new discovery gate (plus another proposal cycle) now sits ahead of the build. Warm and deepening, but no closer to signed dollars than before the call — and at risk of sliding into unpaid forward work if the discovery isn't priced.

## Key Intelligence / What Changed

1. **The "non-integrated PDF pilot" wedge is dead — integration is mandatory, not optional.** Stephanie discovered her own low-friction path won't work: legacy credentialing software is instance/deployment-based, where each applicant is a "deployment" that must be opened *as the provider* to trigger downstream tasks. A coordinator manually entering data (or AICAP exporting a PDF) doesn't satisfy the instance — it would require unethically logging in as the provider. **This kills one of the two integration modes baked into the $12K proposal ("PDF + audit trail" output) and raises the technical bar: the MVP must write into the legacy system's instance via API.** This likely expands real build scope beyond what the $12K Phase 1 was scoped for. *Verbatim:* "It has to be some sort of way to get the information through ASAP and into the instance, that triggers all the other downstream process tasks. It's not just filling out fields."

2. **Three named target systems + a researchable integration surface.** Symplr, MD-Staff, VerityStream. Stephanie's AI-assisted exploration of Symplr's database found "actually really modern architecture… lots of individual modules, API keys," and she saw a "create an account for API" option on their site. Her access: no Symplr account (it's Vanderbilt's; her company is *separate* from Vanderbilt), "access not an account" to MD-Staff. **This is a concrete, substrate-yielding opportunity — credentialing-system connectors — but also a constraint: discovery may be doc-and-screenshare-bound rather than live-API-testable.**

3. **Integration feasibility is now the gating unknown for MVP scope.** Stephanie's three ranked options: (A) direct API submission into the instance — ideal, lightweight, the easy sell; (B) heavier integration via the hospital's IT team building a bridge — "a heavier lift to sell"; (C) an overlay/screen layer over the existing app — "I don't really think is reliable." Which is feasible determines what V1 even is — and which she can sell into hospitals. She wants the feasibility study before committing to a build.

4. **Vocabulary now aligned: her "instance" = Simon's "case."** A file that opens, collects + verifies, stays open through downstream processing, and closes on approval/rejection into the source of truth. Worth ~4 minutes of the call — useful alignment, but see coaching note (architecture-talk drift).

## Firm-Direct Lens

### Objections / Positioning Reactions Table
| Quote | Type | How Handled | Eff. (1-5) | Better Response |
|---|---|---|---|---|
| *"I'm trying to make the connection between Tokenrip and the service I'm asking for — it seems more complex and bigger than what's on Tokenrip."* | Positioning / credibility (website↔offer gap) | Palantir FDE analogy, then "we'd build you a completely separate system that doesn't really use Tokenrip at all" | 2.5 | The analogy is good; the landing is the problem. "Doesn't use Tokenrip at all" removes the reason to pick Tokenrip over any freelancer. Better: *"Tokenrip is the engine room that lets a small team build your system fast and keep improving it after launch. What you get is a product built for AICAP. Think of us as your embedded engineering team with a head start — not a generic dev shop starting from zero."* Keep the speed-advantage; drop "doesn't apply to you." |
| *"Is that a product or a service?"* | Category confusion | "Kind of both — product-building services space" | 3 | Pick a clean frame and commit: *"You get a product. The relationship is a service — an embedded engineering team that builds it and stays through your sales cycle."* "Both" left her to coin "white glove concierge" herself. |
| *"It almost sounds like white glove, concierge."* | Her reframe (premium) | Accepted it | 4 | Fine — concierge is a premium frame and she's premium-oriented. But it also re-prices the engagement as high-touch services in *her* head; watch that against the $12K anchor. |
| *"Each engagement should have a clear handoff… in case I need a CTO and a full department."* | Delivery-risk / team-size anxiety (recurring — she probed team size twice on Call 1) | "Really good point, protects both of us, manages expectations" | 4 | Validated well. Could tie it to a concrete artifact: *"Every phase ships with the delivered system and documentation at completion — so a handoff is always clean. And the 30-day refund is your floor if I'm not delivering."* Anchor the reassurance to something tangible. |

### Pain Evidence — Still Strong Painkiller
Pain was established Call 1 ($22K/day per applicant). This call was about *how to integrate*, not *whether there's pain* — pain remains painkiller-grade and unchallenged. New wrinkle: the integration reality is harder than the proposal assumed, which *raises* the value of solving it but also the cost.

### Stage Signal — Sideways, not forward
Moved from "proposal sent, awaiting decision" → "scope reopened, technical discovery inserted as a gate before any build, another proposal pending." Not a clean advance. New stage: **pre-build integration feasibility / scoping.** The healthy read (FDE playbook): a paid discovery sprint is the cleanest first-dollar entry — *if Simon prices it.* The unhealthy read: free pre-sales discovery for a 2-person shop that scopes an unbought MVP.

## Simon's Performance

### Coaching Priorities (1–3)

1. **Did not convert to a paid discovery — and didn't pre-scope it.** The call's job (per prep) was to book a kickoff. Instead Simon agreed to do the feasibility research and "get back to you with a proposal on that," with no framing of discovery as a paid, bounded engagement. → **Better language:** *"This is exactly the kind of thing we run as a short paid scoping sprint — say a week, [$X]. I map the integration surface across all three systems and come back with a definitive build plan and a firm MVP quote, and I credit it toward the build. That way you're not paying for an MVP before we know which integration path is real, and I'm not guessing at scope."* → Why it matters: at zero revenue, a paid discovery sprint **is** the sale. Free pre-sales discovery burns the only engineer's week and closes nothing. (This is the exact countermeasure Yoda captured 2026-05-31 — line 165. Note it came *after* this call; the next contact is where it gets executed.)

2. **Positioning wobble: "doesn't really use Tokenrip at all."** Telling a non-technical founder — who's deciding whether to bet her Harvard relationship on a 2-person team — that the product on the website is irrelevant to her undercuts the reason to choose Tokenrip over any contractor, and amplifies the team-size anxiety she's already shown twice. → **Better language:** see objection table row 1 — keep the FDE "we build you custom" story but answer "why you, not a freelancer" with the speed/substrate head-start, never with "our product doesn't apply." → Why it matters: the website↔offer gap is now a *confirmed repeated positioning reaction* from this buyer ("seems bigger than what's on Tokenrip"). It's free positioning data — the homepage isn't communicating the FDE model.

3. **Architecture/vocabulary deep-dive ate the close.** ~4 minutes on the CS definition of "instance" vs. "case." Alignment matters, but the prep explicitly warned: *"every minute on how it works instead of what outcome she gets is a minute selling the wrong thing."* The call had no close move at the end — it drifted into "send me docs, I'll send a proposal." → **Better language:** *"Let's not get hung up on the word — instance or case, I know what you mean: a file that opens, collects everything, and closes on approval. Got it. So here's how we move: I'll scope a one-week feasibility study, send it tomorrow, and we book it this week."* Resolve the vocabulary in one line, then drive to a next commitment. → Why it matters: architecture-talk drift is Simon's named structural trap (CLAUDE.md trap #1; Yoda insights, 8+ instances).

### What Worked (2–3)
1. **Validated the "clear handoff" concern instead of getting defensive.** Turned a delivery-risk objection into a trust-builder ("protects both of us, manages expectations"). Right instinct on a team-size-anxious buyer.
2. **Asked her to articulate her reasoning** ("outline how what we find affects the chain reaction") — good discovery instinct that surfaced the three ranked integration options and the MVP dependency. Extracted the real decision structure rather than assuming it.
3. **Met her where she is — recommended she Claude-brain-dump her Symplr session.** Low-friction, AI-native way to transfer rich technical context he couldn't otherwise get. Smart use of the fact that she's already AI-fluent.
