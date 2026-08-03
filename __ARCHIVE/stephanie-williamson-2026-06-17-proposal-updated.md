---
contact: Stephanie Williamson
company: AICAP Access
date: 2026-06-17
type: design-partner proposal (updated after discovery)
status: draft — full updated proposal; supersedes the 2026-05-27 final, which is kept as reference
owner: Simon Pettibone
supersedes: bd/calls/proposals/stephanie-williamson-2026-05-27-final.md
---

# Tokenrip × AICAP Access — Phase 1 Application-Completion Platform

**Prepared for:** Stephanie Williamson, AICAP Access
**Prepared by:** Tokenrip
**Phase 1 fee:** $12,000, less the $1,000 discovery already paid, for $11,000 net
**Phase 1 length:** ~7 weeks from kickoff (flexible)
**Refund window:** Full refund in the first 30 days, no questions asked
**Valid through:** 2026-07-15

---

## Summary

Tokenrip would build the application-completion platform AICAP Access has designed and prototyped: the layer that sits between application submission and primary source verification. Phase 1 stands up that platform end-to-end and delivers it as a prototype AICAP can put in front of hospital prospects to prove the time it saves on real applications.

The platform covers the requirements that recur across specialties: application autofill from credentialing documents, context-aware field expansion, automated compliance review, AI gap-fill with operator review, and guided intake for the residual unknowns. It is built once as a reusable core, with each hospital's own requirements configured into it.

Moving a completed application into a hospital's existing credentialing system is handled per hospital, as part of that hospital's pilot deployment. Discovery established why: that connection is controlled by the hospital, runs on the hospital's license, and is configured differently at every one, so it is scoped against a named hospital rather than priced blind up front. Phase 2, the privileging workflow, sits behind Phase 1 and re-ignites when AICAP closes a customer who pulls on it.

A 30-minute scoping call before kickoff confirms direction and locks the start date.

---

## Phase 1 — What Tokenrip Would Build

Phase 1 is the application-completion platform: it takes a physician application from submission to compliance-ready in a single pass. The intake layer covers the requirements that recur across specialties: license verification, work history, board certifications, DEA registration, hospital affiliation, peer references. It is built for the hard cases, not a lighter specialty subset. Deep privileging-specific handling sits in Phase 2.

The provider experience stays as AICAP designed it. The applicant sees only what they need to answer, guided toward a complete, compliance-ready application, never a raw form.

The five product surfaces:

1. **Application autofill from credentialing documents.** The provider uploads the documents their application requires (CV, medical licenses, DEA registration, board certifications, malpractice coverage, and anything else AICAP requires). The system extracts structured fields from all of them and pre-fills the application wherever the source data is unambiguous. The provider sees an application already mostly populated, not a blank form. The exact document list is locked at kickoff.

2. **Context-aware field expansion.** When the CV implies a fact, for example faculty member at UCSD Medical Center, the system populates the adjacent fields (hospital affiliation, malpractice coverage, work-history scaffolding) instead of asking the provider to repeat what is already there.

3. **Automated compliance review.** Every field is checked against AICAP's compliance bar (Joint Commission, CMS, and NCQA-relevant items). The system sorts items into compliance-ready versus needs-follow-up before any human review begins.

4. **AI gap-fill with operator review.** For items that still need resolution, the system proposes the most likely answer with its confidence and source reasoning. The operator approves, overrides, or defers. Nothing auto-submits.

5. **Guided intake for the residual unknowns.** Anything that genuinely could not be auto-resolved surfaces as a short set of targeted questions, not a forty-field form. Where a question can be resourced, for example the office manager's contact for verifying a prior affiliation, the system surfaces that resource so the operator is not waiting two weeks on a reply.

Plus the operator side: red flags surfaced at the top, pending items, the compliance-cleared remainder, a full audit trail, and the provider's attestation captured in the flow.

**Built once, configured per hospital.** The platform is a reusable core. Each hospital's own requirements configure into it: its forms, logo, application and attestation questions, state-specific forms, history windows (e.g. the seven and ten year variations), affiliation and malpractice requirements, and distance rules. Per-hospital work stays a contained, repeatable configuration step rather than a rebuild.

**What "prototype" means here.** Demonstrable on real example documents and stable enough to put in front of a hospital to prove the value. It is not yet hardened for live production with real provider data. That hardening, the security review and the hospital's data-handling agreements, belongs to the first pilot deployment, where real data first appears.

---

## What the Product Looks Like in Use

Phase 1 ships as a web platform with two primary surfaces, the operator dashboard and the provider intake flow, plus the handoff of a completed application into the hospital's system.

**For the credentialing coordinator (operator).** A browser-based dashboard. The home view is a queue of active applications: physician name, specialty, days in queue, flag status, completion percentage. Opening a case reveals a structured detail view, red flags at the top (DUI, malpractice history, prior disciplinary actions), then items still pending from the provider, then everything compliance-cleared. Each AI-suggested answer surfaces its confidence and source reasoning, and the coordinator approves, overrides, or routes a follow-up. Every action is timestamped to an audit trail.

**For the applying physician (provider).** A secure intake link, sent by the coordinator when a case opens. The physician uploads the required documents and immediately sees a mostly pre-filled application. Only what could not be auto-resolved gets asked, and those questions are short, targeted, and explained in context. No forty-field form, no three rounds of back-and-forth email. The physician completes and attests, and the application drops into the coordinator's queue already compliance-checked.

**Landing in the hospital's system.** The output is a complete, compliance-ready application with a full audit trail. It lands in the hospital's own credentialing system through the integration handled in that hospital's pilot deployment (next section). The downstream compliance officer has no new interface to learn; the application arrives in the workflow they already use.

The principle across all of it: AI prepares, people decide. A regulated credentialing workflow expects that separation.

---

## Getting a Completed Application Into the Hospital's System

A completed application still has to land in the hospital's own credentialing system. Discovery established that this connection is authorized by the hospital, runs on the hospital's license, and varies by hospital, by platform, by license tier, and by software version. Whether a given hospital's platform exposes the interface to receive a completed application can only be confirmed with access to that hospital's instance.

So it is handled as the opening step of a hospital's pilot deployment, not built blind beforehand. Tokenrip does the integration work and owns it, with the hospital's IT validating, the model hospitals already expect from a vendor. Where a hospital's platform does not expose that interface, enabling it (the license or the configuration) is the hospital's to arrange.

This step is scoped and priced when a pilot hospital is named and grants access. It cannot be fixed-priced honestly before then.

---

## Data Handling

Provider data is isolated per customer, encrypted at rest and in transit, with every read and write logged. The Phase 1 prototype runs on example and de-identified data. Live provider data and hospital-specific security requirements (the security review, the hospital's data-handling agreements) are handled in the first pilot deployment, where real data first appears.

---

## Engagement Model for Hospital Sales Cycles

Hospital sales run long and need an engineering partner who stays through the cycle. The engagement has four modes:

**Mode 1 — Phase 1 active build (~7 weeks).** Heavy-build mode. The application-completion platform, delivered as a demonstrable prototype. Weekly demos on real example applications. Refund window open through day 30.

**Mode 2 — Background support through AICAP's sales window.** Through AICAP's hospital conversations, Tokenrip stays active in a low-burn mode: refinements driven by what AICAP hears from hospital prospects, demo prep ahead of pilot calls, and attendance on hospital calls as the technical voice at AICAP's invitation. Duration is set by the deal cycle, not a calendar. Heavy net-new build triggers a Phase 2 conversation.

**Mode 3 — Per-hospital pilot deployment.** When a hospital commits, the integration into that hospital's system plus that hospital's configuration, on its license, scoped at that point.

**Mode 4 — Phase 2 active build (privileging).** When AICAP closes a customer who pulls on privileging, the privileging build kicks off. Scope and pricing settled then.

Sales-window support in Mode 2 is bundled into the engagement at no additional cost.

---

## Commercial Terms

This is design-partner pricing, below market for a build of this scope, in exchange for an early healthcare reference.

| Item | Terms |
|---|---|
| **Phase 1 fee** | **$12,000**, less the **$1,000** discovery already paid, for **$11,000 net**. The application-completion platform, delivered as a demonstrable prototype, ~7 weeks. |
| **Per-hospital pilot deployment** | The integration into a hospital's system, plus that hospital's configuration. Scoped and priced when a pilot hospital is named and grants access. |
| **Phase 2, privileging** | Staged. Scope and price settled when a paying customer pulls on it. No commitment from either side today. |
| **Refund window** | Full, no-questions-asked refund any time in the first 30 days from signed agreement. |
| **Reference rights** | Logo, named-customer use, and one written case study (AICAP approves final copy), signed at kickoff. |
| **Sales-window support** | Tokenrip available through AICAP's hospital conversations in a low-burn mode, including attendance on hospital calls as the technical voice. Bundled, no additional cost. |

---

## Why This Is a Design Partnership

Tokenrip is building toward a first reference customer in healthcare credentialing, and AICAP's results become Tokenrip's calling card. The incentive to see AICAP win is direct. The credentialing IP, the compliance encoding, the workflow design, and the operator experience, is AICAP's.

Three things keep the engagement accountable:

1. **Weekly demos on real examples.** Every week of the active build, AICAP sees what is working and what is not on actual documents, not only at the end.
2. **30-day refund window.** If by day 30 the engagement is not working, AICAP exercises the refund and walks away.
3. **Direct line.** Simon is directly reachable for the duration of Phase 1 and through the sales window that follows.

---

## To Kick Off Phase 1

Phase 1 does not need a pilot to begin. It is the prototype AICAP brings to a hospital, so starting now means walking into those conversations with something to show rather than something to describe.

**Minimum to start:** a 30-minute scoping call to confirm direction, plus three to five de-identified sample applications with full document sets. That is enough to begin week one. The scoping call locks the document types, the intake-versus-privileging boundary for Phase 1, and the baseline configuration to build against.

**Useful over the first two weeks:**

- A broader sample (~10–20 applications) representing the spread AICAP expects to process.
- AICAP's compliance checklist covering Joint Commission, CMS, and any NCQA-relevant items.
- One recorded walkthrough (~1 hour) of a real end-to-end process, de-identified at AICAP's discretion.

The discovery study credits toward this build, and the team that ran it is ready to start now.

---

## Phase 2 — Privileging Workflow

Privileging is the larger compression opportunity. Per AICAP's read, the privileging workflow is more structured than application completion: clinical-name-to-clinical-requirement matching with physician review in the loop. Phase 2 builds it.

Phase 2 scope and pricing are settled when AICAP closes a paying customer that pulls on it. No commitment from either side today. The design-partner relationship carries over, and the first conversation belongs to Tokenrip.

---

## Open Items for the Kickoff Scoping Call

- Whether the five surfaces match AICAP's mental model, and what needs renaming or restructuring.
- The exact intake-versus-privileging scope boundary for Phase 1.
- The document types the intake flow needs to accept and extract from.
- The baseline per-hospital configuration to build against first (forms, attestation questions, history windows, distance rules).
- The compliance-checklist scope, including items currently in tribal-knowledge form that need encoding.

The scoping call is where scope is locked before kickoff.

---

## Timeline

| Week | What happens |
|---|---|
| 0 | Scoping call. Kickoff. |
| 1 | Application autofill live on real sample documents. Context-aware expansion calibrated. |
| 2 | Automated compliance review calibrated against AICAP's checklist. Demo. |
| 3 | AI gap-fill operational. Demo. |
| 4 | Guided intake live. Demo. |
| 5 | Operator dashboard end-to-end. Demo. |
| Day 30 | Refund window closes. |
| 6 | Iteration tail. Domain-feedback loop. Edge cases caught. |
| 7 | Phase 1 prototype delivered. Tokenrip transitions to sales-window support. |

This is the baseline. The weekly demos exist so AICAP can spot any slippage inside the refund window. Move it either direction as needed.

---

## Next Step

A 30-minute scoping call to confirm direction and lock the Phase 1 start date.

---

*Anonymized sample applications are processed in isolated environments. A short reference-rights letter (logo, case study) is shared at kickoff.*
