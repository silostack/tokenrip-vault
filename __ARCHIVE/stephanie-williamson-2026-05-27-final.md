---
contact: Stephanie Williamson
company: AICAP Access
date: 2026-05-27
type: design-partner proposal
status: final
owner: Simon Pettibone
pairs_with: ../notes/stephanie-williamson-2026-05-26.md
plan: ~/.claude/plans/ok-read-through-the-refactored-raccoon.md
---

# Tokenrip × AICAP Access — Phase 1 Pre-Intake Intelligence Pilot

**Prepared for:** Stephanie Williamson, AICAP Access
**Prepared by:** Tokenrip
**Phase 1 fee:** $12,000
**Phase 1 length:** ~7 weeks from kickoff (flexible)
**Refund window:** Full refund available during the first 30 days, no questions asked
**Proposal valid through:** 2026-06-10

---

## Summary

Tokenrip would build the pre-intake intelligence layer AICAP Access has architected and prototyped: the layer between application submission and primary source verification that compresses the 4-6 week MSP-coordinator back-and-forth opening every credentialing file. This proposal scopes that build as a multi-phase partnership around AICAP's hospital-enterprise sales cadence.

Phase 1 stands up the application-completion pipeline end-to-end across specialties: application autofill from credentialing documents, context-aware field expansion, automated compliance review, AI gap-fill with operator review, and smart intake for the residual unknowns. The deliverable is a pilot-ready platform AICAP can put in front of hospital prospects. Phase 2 — the privileging workflow — sits behind Phase 1 and re-ignites when AICAP closes a customer who pulls on it.

The product surfaces and architecture below reflect Tokenrip's current read from the discovery conversation. A 30-minute scoping call before kickoff confirms direction and refines anything that needs refining.

---

## Phase 1 — What Tokenrip Would Build

Phase 1 is the **application-completion pipeline**: it takes a physician application from submission to compliance-ready in a single pass. The intake layer covers the standard requirements that recur across specialties: license verification, work history, board certifications, DEA registration, hospital affiliation, peer references. Deep specialty-specific handling lives further down the pipeline and is scoped into Phase 2 (privileging).

The five product surfaces, as currently scoped:

1. **Application autofill from credentialing documents.** The provider uploads the documents required for their application — CV, medical licenses, DEA registration, board certifications, malpractice coverage, and any other supporting materials AICAP requires. The system extracts structured fields from all of them and pre-fills the application wherever the source data is unambiguous. The provider sees their application already mostly populated, not a blank form. The exact document list is locked at kickoff.

2. **Context-aware field expansion.** When the CV implies a fact — *faculty member at UCSD Medical Center* — the system auto-populates the adjacent fields (hospital affiliation, malpractice coverage, work-history scaffolding) instead of asking the provider to repeat what's already there.

3. **Automated compliance review.** Every field is checked against AICAP's compliance bar (Joint Commission, CMS, NCQA-relevant items). The system sorts items into compliance-ready versus needs-follow-up before any human review begins.

4. **AI gap-fill with operator review.** For items that still need resolution, AI proposes the most likely answer with confidence scoring and source reasoning. Operators approve, override, or defer. Nothing auto-submits.

5. **Smart intake.** Anything that genuinely couldn't be auto-resolved surfaces as a short set of targeted questions to the provider — three to five items, not a forty-field form. Where a question can be *resourced* (e.g., the office manager's contact info for verifying a prior affiliation), the system surfaces the resource so the operator isn't waiting two weeks for the provider to reply.

The exact intake-vs-privileging boundary is confirmed at the kickoff scoping call. AICAP's twenty years of MSP-coordinator experience informs where that line falls.

**What "production-ready" means for Phase 1:** deployable to a hospital pilot environment, integration-tested end-to-end, with audit logging and operator dashboard live. Hardening for full hospital production deployment (penetration testing, SOC 2 attestation, hospital IT integration work) is post-Phase 1 scope.

---

## What the Product Looks Like in Use

Phase 1 ships as a web platform with three surfaces: a coordinator dashboard, a physician intake flow, and a handoff layer into existing hospital systems.

**For the credentialing coordinator (operator).** A browser-based dashboard. The home view is a queue of active applications — physician name, specialty, days in queue, flag status, completion percentage. Opening a case reveals a structured detail view: red flags at the top (DUI, malpractice history, prior disciplinary actions), then items still pending from the provider, then everything compliance-cleared at the bottom. Each AI-suggested answer surfaces its confidence score and source reasoning; the coordinator approves, overrides, or routes a follow-up. Every action is timestamped to an audit trail.

**For the applying physician (provider).** A secure intake link, typically sent by the coordinator when a credentialing case opens. The physician clicks through, uploads the required credentialing documents (CV, licenses, certifications, insurance, and whatever else AICAP scopes in at kickoff), and immediately sees a mostly pre-filled application — only what couldn't be auto-resolved gets asked. The remaining questions are short, targeted, and explained in context: no forty-field form, no three rounds of back-and-forth email. The physician submits, and the application drops into the coordinator's queue already compliance-checked.

**For the hospital compliance officer (downstream stakeholder).** No new interface to learn. They receive a compliance-ready application with full audit trail — either as a PDF delivered through AICAP's existing channels, or pushed into the hospital's credentialing system (Symplr / VerityStream / MD-Staff). It drops into the workflow they already use.

The design principle across all three: AI prepares, people decide. Hospital compliance officers and CMIOs expect that separation in a regulated workflow.

---

## Data Handling

Provider data is isolated per customer, encrypted at rest and in transit, and every read and write is logged. Hospital-specific security requirements get worked through during the production hardening pass after Phase 1.

---

## Engagement Model for Hospital Sales Cycles

Hospital enterprise sales run six to twelve months. They require in-person Medical Staff Executive Committee meetings and technical accompaniment from CMIO and informatics teams. AICAP needs an engineering partner who sticks around through the sales cycle.

The partnership unfolds in three modes:

**Mode 1 — Phase 1 active build (~7 weeks).** Heavy-build mode. Production-ready application-completion pipeline by end of Week 7. Weekly Friday demos on real applications through Week 5. Refund window open through Day 30.

**Mode 2 — Background-build through AICAP's sales window.** During AICAP's design-partner and hospital-enterprise sales conversations, Tokenrip remains active in a low-burn mode: iterative refinements driven by what AICAP hears from hospital prospects; product refinements ahead of pilot calls; available to attend hospital Medical Staff Executive Committee meetings as a technical observer at AICAP's invitation; technical conversation support with hospital CMIO and informatics teams. No heavy net-new build. Duration set by AICAP's deal cycle, not Tokenrip's calendar. In practice: ~2–5 hours/week of refinements, demo prep, and call attendance, scoped by what the deal cycle surfaces. Heavy net-new build (more than ~1 week of work) triggers a Phase 2 conversation.

**Mode 3 — Phase 2 active build (re-ignited on close).** When AICAP closes a customer who pulls on privileging, the privileging-workflow build kicks off. Scope and pricing are settled at that point, informed by what Phase 1 has revealed about real volume and architectural needs, and what the sales window has surfaced about hospital-side requirements.

This model is designed for AICAP's actual sales reality. Sales-window support during Mode 2 is bundled into the engagement at no additional cost.

---

## Commercial Terms

This is design-partner pricing — meaningfully below market rate for a build of this scope. The discount is intentional: an early healthcare-vertical reference is genuinely valuable to Tokenrip, and we'd rather price for the partnership than for the work.

| Item                                    | Terms                                                                                                                                              |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Phase 1 fee**                         | **$12,000** for the application-completion pipeline, ~7-week deployment                                                                               |
| **Refund window**                       | Full no-questions-asked refund any time in the first 30 days from signed agreement                                                                 |
| **Reference rights**                    | Logo + named-customer use + 1 written case study (AICAP signs off on final copy before publish), signed at kickoff                                 |
| **Medical Staff Exec Committee access** | Tokenrip available to attend hospital Medical Staff Executive Committee meetings as a technical observer, at AICAP's invitation                    |
| **Sales-window engagement**             | Tokenrip remains active in background-build mode through AICAP's sales window. See Engagement Model section above.                                 |
| **Phase 2 conversation**                | Re-ignites on AICAP's first paying customer pulling on privileging. Scope and pricing settled at that point. No commitment from either side today. |

---

## Why This Is a Design Partnership

Tokenrip is looking for a first reference customer in healthcare credentialing. AICAP fits: real pain at a quantifiable scale, hospital relationships at top academic medical centers, and a founder who moves fast. Tokenrip's incentive to see AICAP succeed is direct, because AICAP's results become Tokenrip's calling card.

The credentialing IP (compliance encoding, workflow design, operator UX) is AICAP's.

Three safeguards keep it accountable:

1. **Weekly demos on real applications.** Every Friday in Weeks 1–5, AICAP sees what is working and what is not on actual files. Demos throughout, not only at the end.
2. **30-day refund window.** If by Day 30 the engagement is not working, AICAP exercises the refund and walks away.
3. **Direct Slack line.** Simon is directly reachable for the duration of Phase 1 and through the background-build window that follows.

---

## To Kick Off Phase 1

**Minimum to start:** a 30-minute scoping call plus 3–5 anonymized sample applications (full document sets — CV plus whatever else AICAP normally collects). That's enough to begin Week 1.

**Nice to have over the first two weeks:**

- A broader sample (~10–20 applications total) representing the spread of physician applications AICAP expects to process
- AICAP's compliance checklist covering Joint Commission, CMS, and any NCQA-relevant items applied to the application-completion stage
- One ~1-hour recorded walkthrough of a real end-to-end credentialing process (anonymized at AICAP's discretion)

The scoping call confirms the proposed product surfaces match AICAP's mental model, locks the intake-vs-privileging boundary, settles integration mode (PDF output vs. API push), and surfaces any architectural refinements. It's where everything in this proposal gets refined.

---

## Phase 2 — Privileging Workflow

Privileging is the larger compression opportunity. Per AICAP's read on the discovery call, the privileging workflow is more structured than the application-completion layer — clinical-name-to-clinical-requirement matching with human-in-the-loop physician review. Phase 2 is the engagement that builds it.

Phase 2 scope and pricing are settled when AICAP closes a paying customer that pulls on it. No commitment from either side today. The same design-partner relationship carries over; the first conversation belongs to Tokenrip. Terms are negotiated at that point based on what Phase 1 has revealed about real volume and architectural needs, and on what the sales window has surfaced about hospital-side requirements.

---

## Open Items for the Kickoff Scoping Call

Items the scoping call confirms or refines before Phase 1 kickoff:

- Whether the five product surfaces above match AICAP's mental model, and what needs renaming or restructuring
- Exact intake-vs-privileging scope boundary for Phase 1
- Document type scope — the full list of credentialing documents the intake flow needs to accept and extract from (CV, licenses, DEA, board certifications, malpractice coverage, and anything else AICAP requires today)
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
| 4 | Smart intake live. Friday demo. |
| 5 | Operator dashboard end-to-end. Friday demo. |
| Day 30 | Refund window closes. |
| 6 | Iteration tail. Domain-feedback loop. Edge cases caught. |
| 7 | Phase 1 delivered. Tokenrip transitions to background-build mode for AICAP's sales window. |

This is the baseline. It's a tight schedule for healthcare work — the Friday demos exist so AICAP can spot any slippage inside the refund window. Move it either direction as needed: tighter if a pilot conversation calls for Phase 1 sooner, longer if a specific surface wants more iteration than the schedule gives it.

Refund window: first 30 days from signed agreement.

---

## Next Step

A 30-minute scoping call to confirm direction and lock the Phase 1 start date. Tokenrip's calendar is open Tuesday and Wednesday of next week. Cover email below.

---

*Anonymized sample applications are processed in isolated environments. A short reference-rights letter (logo, case study) is shared at kickoff.*
