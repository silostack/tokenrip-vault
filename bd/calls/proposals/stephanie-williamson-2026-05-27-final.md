---
contact: Stephanie Williamson
company: AICAP Access
date: 2026-05-27
type: design-partner proposal
status: v3 draft (soft proposal pass)
owner: Simon Pettibone
pairs_with: ../notes/stephanie-williamson-2026-05-26.md
plan: ~/.claude/plans/lazy-prancing-moonbeam.md
---

# Tokenrip × AICAP Access — Phase 1 Pre-Intake Intelligence Pilot

**Prepared for:** Stephanie Williamson, AICAP Access
**Prepared by:** Tokenrip
**Phase 1 fee:** $8,000 USD (Track A; Track B Upwork-hourly alternative below)
**Phase 1 length:** ~6 weeks from kickoff
**Refund window:** Full refund available during the first 30 days, no questions asked
**Proposal valid through:** 2026-06-10

---

## Summary

Tokenrip would build the pre-intake intelligence layer AICAP Access has architected and prototyped: the layer between application submission and primary source verification that compresses the 4-6 week MSP-coordinator back-and-forth opening every credentialing file. This proposal scopes that build as a multi-phase partnership around AICAP's hospital-enterprise sales cadence.

Phase 1 stands up the application-completion spine end-to-end across specialties: application autofill from CV, context-aware field expansion, automated compliance review, AI gap-fill with operator review, and smart intake for the residual unknowns. The deliverable is a production-ready platform AICAP can put in front of Harvard Health, Duke, and MD Anderson. Phase 2 — the privileging workflow — sits behind Phase 1 and re-ignites when AICAP closes a customer who pulls on it.

The product surfaces and architecture below reflect Tokenrip's current read from the discovery conversation. A 30-minute scoping call before kickoff confirms direction and refines anything that needs refining.

Two engagement structures are offered: a bundled design-partner engagement (Track A) and a standard Upwork-hourly arrangement (Track B). Both deliver the same engineering work. The difference is what's bundled around it.

---

## Phase 1 — What Tokenrip Would Build

Phase 1 is the **application-completion spine**: an intake pipeline that takes a physician application from submission to compliance-ready in a single pass. The intake layer covers the standard requirements that recur across specialties: license verification, work history, board certifications, DEA registration, hospital affiliation, peer references. Deep specialty-specific handling lives further down the pipeline and is scoped into Phase 2 (privileging).

The five product surfaces, as currently scoped:

1. **Application autofill from CV.** The provider uploads a CV; the system extracts structured fields and pre-fills the application wherever the source data is unambiguous. The provider sees their application already mostly populated, not a blank form.

2. **Context-aware field expansion.** When the CV implies a fact — *faculty member at UCSD Medical Center* — the system auto-populates the adjacent fields (hospital affiliation, malpractice coverage, work-history scaffolding) instead of asking the provider to repeat what's already there.

3. **Automated compliance review.** Every field is checked against AICAP's compliance bar (Joint Commission, CMS, NCQA-relevant items). The system sorts items into compliance-ready versus needs-follow-up before any human review begins.

4. **AI gap-fill with operator review.** For items that still need resolution, AI proposes the most likely answer with confidence scoring and source reasoning. Operators approve, override, or defer. Nothing auto-submits.

5. **Smart intake.** Anything that genuinely couldn't be auto-resolved surfaces as a short set of targeted questions to the provider — three to five items, not a forty-field form. Where a question can be *resourced* (e.g., the office manager's contact info for verifying a prior affiliation), the system surfaces the resource so the operator isn't waiting two weeks for the provider to reply.

The exact intake-vs-privileging boundary is confirmed at the kickoff scoping call. AICAP's twenty years of MSP-coordinator experience informs where that line falls.

---

## What the Product Looks Like in Use

Phase 1 ships as a working platform. Three stakeholder perspectives:

**For the credentialing coordinator (operator).** A queue of physician applications sorted by urgency. Opening a case, the flags come first: anything needing extra scrutiny (DUI, malpractice history, prior disciplinary action), then what's still pending from the provider, then everything compliance-clear. AI suggests answers for missing items; the coordinator approves, overrides, or sends to the provider. Every action is timestamped to an audit trail that satisfies regulatory review.

**For the applying physician (provider).** The CV does most of the work. After upload, the application is largely filled in. The provider answers a short set of targeted questions about anything the system couldn't resolve. No form. No three rounds of email back-and-forth.

**For the hospital compliance officer (downstream stakeholder).** A compliance-ready application with full audit trail, delivered as a PDF or pushed into the hospital's existing credentialing system (Symplr / VerityStream / MD-Staff). Nothing new to learn on the hospital side. It drops into their current workflow.

The design principle across all three: AI prepares, people decide. Hospital compliance officers and CMIOs expect that separation in a regulated workflow.

---

## Engagement Model for Hospital Sales Cycles

Hospital enterprise sales run six to twelve months. They require in-person Medical Staff Executive Committee meetings and technical accompaniment from CMIO and informatics teams. AICAP needs an engineering partner who sticks around through the sales cycle.

The partnership unfolds in three modes:

**Mode 1 — Phase 1 active build (~6 weeks).** Heavy-build mode. Production-ready application-completion pipeline by end of Week 6. Weekly Friday demos on real CVs through Week 4. Refund window open through Day 30.

**Mode 2 — Background-build through AICAP's sales window.** During AICAP's design-partner and hospital-enterprise sales conversations, Tokenrip remains active in a low-burn mode: iterative refinements driven by what AICAP hears from Harvard Health, Duke, and MD Anderson; product refinements ahead of pilot calls; available to attend hospital Medical Staff Executive Committee meetings as a technical observer at AICAP's invitation; technical conversation support with hospital CMIO and informatics teams. No heavy net-new build. Duration set by AICAP's deal cycle, not Tokenrip's calendar.

**Mode 3 — Phase 2 active build (re-ignited on close).** When AICAP closes a customer who pulls on privileging, the privileging-workflow build kicks off. Scope and pricing are settled at that point, informed by what Phase 1 has revealed about real volume and architectural needs, and what the sales window has surfaced about hospital-side requirements.

This model is designed for AICAP's actual sales reality. It is also where Track A and Track B differ in structure: under Track B, sales-window support is available but billed hourly as additional scope. Under Track A, it is bundled into the engagement at no additional cost.

---

## Commercial Terms — Two Tracks

### Track A — Design Partner Engagement (Recommended)

| Item                                    | Terms                                                                                                                                              |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Phase 1 fee**                         | **$8,000 USD** for the application-completion spine, ~6-week deployment                                                                            |
| **Refund window**                       | Full no-questions-asked refund any time in the first 30 days from signed agreement                                                                 |
| **Reference rights**                    | Logo + named-customer use + 1 written case study (AICAP signs off on final copy before publish), signed at kickoff                                 |
| **Medical Staff Exec Committee access** | Tokenrip available to attend hospital Medical Staff Executive Committee meetings as a technical observer, at AICAP's invitation                    |
| **Sales-window engagement**             | Tokenrip remains active in background-build mode through AICAP's sales window. See Engagement Model section above.                                 |
| **Phase 2 conversation**                | Re-ignites on AICAP's first paying customer pulling on privileging. Scope and pricing settled at that point. No commitment from either side today. |

### Track B — Upwork Hourly (Off-Ramp)

| Item                                    | Terms                                                         |
| --------------------------------------- | ------------------------------------------------------------- |
| **Rate**                                | $80/hr per Tokenrip's Upwork profile                          |
| **Phase 1 hour estimate**               | ~120–180 hours for comparable Phase 1 scope ($9,600–$14,400)  |
| **Refund / guarantee**                  | None (standard Upwork hourly contract)                        |
| **Reference rights**                    | None                                                          |
| **Medical Staff Exec Committee access** | Out of scope                                                  |
| **Sales-window engagement**             | Available at the hourly rate as additional scope; not bundled |
| **Phase 2 conversation**                | Renegotiated as a new Upwork project                          |

Track B is for buyers who prefer per-hour billing over a bundled relationship. Same engineering work, different structure around it.

### Side-by-Side Comparison

| | **Track A — Design Partner** | **Track B — Upwork Hourly** |
|---|---|---|
| **Price** | $8,000 | $80/hr (~$9,600–$14,400 for comparable scope) |
| **Phase 1 outcome** | Application-completion spine, all five surfaces, production-ready | Whatever fits the hour budget |
| **30-day full refund** | Yes | No |
| **Reference rights** | Logo + case study | None |
| **Sales-cycle engagement** | Background-build through AICAP's deal cycle | Available at hourly rate (not bundled) |
| **Med Staff Exec Committee access** | Yes | Out of scope |
| **Phase 2 path** | Re-ignition on close; first conversation goes to Tokenrip | Renegotiated as new project |

For a relationship shaped like a design-partner build, Track A is simpler. Track B is offered for completeness.

---

## Why This Is a Design Partnership

Tokenrip is looking for a first reference customer in healthcare credentialing. AICAP fits: real pain at a quantifiable scale, hospital relationships at Harvard Health, Duke, and MD Anderson, and a founder who moves fast. Tokenrip's incentive to see AICAP succeed is direct, because AICAP's results become Tokenrip's calling card.

The credentialing IP (compliance encoding, workflow design, operator UX) is AICAP's.

Three safeguards keep it accountable:

1. **Weekly demos on real CVs.** Every Friday in Weeks 1–4, AICAP sees what is working and what is not on actual files. Demos throughout, not only at the end.
2. **30-day refund window.** If by Day 30 the engagement is not working, AICAP exercises the refund and walks away.
3. **Direct Slack line.** Simon is directly reachable for the duration of Phase 1 and through the background-build window that follows.

---

## To Kick Off Phase 1

Here's what Tokenrip is thinking would be useful to have in hand before kickoff. None of this is hard-required; the scoping call is where actual needs get confirmed:

- A handful of anonymized real CV samples (~10–20 if available) representing the spread of physician applications AICAP expects to process
- AICAP's compliance checklist covering Joint Commission, CMS, and any NCQA-relevant items applied to the application-completion stage
- One ~1-hour recorded walkthrough of a real end-to-end credentialing process (anonymized at AICAP's discretion)
- 30-minute scoping call to confirm the proposed product surfaces match AICAP's mental model, lock the intake-vs-privileging boundary, settle integration mode (PDF output vs. API push), and surface any architectural refinements

The scoping call is where everything in this proposal gets refined.

---

## Phase 2 — Privileging Workflow

Privileging is the larger compression opportunity. It is also, per AICAP's read on the discovery call, more deterministic than the application-completion layer — clinical-name-to-clinical-requirement matching with human-in-the-loop physician review. Phase 2 is the engagement that builds it.

Phase 2 scope and pricing are settled when AICAP closes a paying customer that pulls on it. No commitment from either side today. The same design-partner relationship carries over; the first conversation belongs to Tokenrip. Terms are negotiated at that point based on what Phase 1 has revealed about real volume and architectural needs, and on what the sales window has surfaced about hospital-side requirements.

---

## Open Items for the Kickoff Scoping Call

Items the scoping call confirms or refines before Phase 1 kickoff:

- Whether the five product surfaces above match AICAP's mental model, and what needs renaming or restructuring
- Exact intake-vs-privileging scope boundary for Phase 1
- Integration mode for Phase 1 output (PDF + audit trail, API push, or both at operator election)
- Preferred legacy-system handshake (Symplr / VerityStream / MD-Staff / hospital-by-hospital)
- Compliance-checklist scope, including items currently in tribal-knowledge form that need encoding

The scoping call is not a sales call. It's where we lock scope before kickoff.

---

## Timeline

| Week | What happens |
|---|---|
| 0 | Scoping call. Kickoff. |
| 1 | Application autofill live on real samples. Context-aware expansion calibrated. |
| 2 | Automated compliance review calibrated against AICAP's checklist. Friday demo. |
| 3 | AI gap-fill operational. Friday demo. |
| 4 | Smart intake live. Operator dashboard end-to-end. Friday demo. |
| Day 30 | Refund window closes. |
| 5 | Iteration tail. Domain-feedback loop. Edge cases caught. |
| 6 | Phase 1 delivered. Tokenrip transitions to background-build mode for AICAP's sales window. |

Refund window: first 30 days from signed agreement.

---

## Next Step

A 30-minute scoping call to confirm direction and lock the Phase 1 start date. Tokenrip's calendar is open Tuesday and Wednesday of next week. Cover email below.

---

## Cover Email Draft

**Subject:** Proposal: AICAP Phase 1 pilot

Stephanie,

Thank you for the walkthrough yesterday. The five sections in the proposal line up with the five modules you walked through, but I've reframed them from the technical side (CV ingestion, inference, etc.) to the product side (autofill, smart intake, etc.). If those don't match how you think about it, we'll align at the scoping call. At $22K/day per applicant sitting in credentialing, Phase 1 pays for itself on the first physician through.

Proposal attached. Short version: a ~6-week Phase 1 that stands up the application-completion spine end-to-end across specialties, priced at $8,000 with a full no-questions-asked refund in the first 30 days. After Phase 1 delivers, the engagement shifts into a background-build mode through your sales window so the product keeps moving alongside your Harvard / Duke / MD Anderson conversations, with Phase 2 (privileging) re-igniting once a paying customer pulls on it. A standard Upwork hourly option (Track B) is offered for completeness.

A lot of this is starting hypothesis from yesterday's conversation. A short scoping call before kickoff is where it gets refined.

Suggested next step: a 30-minute scoping call to confirm direction and figure out what sample CVs you can share. Tuesday or Wednesday next week works on my end. Name a time and I'll send the invite.

Best,
Simon

---

*All pricing in USD. Anonymized CV samples are processed in isolated environments; no client PII is used to train base models. A short reference-rights letter (logo, case study) pairs with Track A and is shared at kickoff.*
