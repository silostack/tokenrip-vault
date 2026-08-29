# Stephanie Williamson Call — 2026-08-13 (firm-direct)

## Follow-Up Actions

### What WE Need to Do

| # | Action | Owner | Due |
|---|---|---|---|
| 1 | Send the written recap, separating the Week-7 Validation MVP closeout from a separately scoped Demo Hardening / Pilot phase. | Simon | 2026-08-13 |
| 2 | Close the Validation MVP against its actual acceptance criteria: review the remaining GitHub fixes; model the audit trail on Stephanie's existing demo; make the generic application output show (1) red flags/pending items, (2) line-by-line captured data, and (3) a printable application-form view. | Simon | 2026-08-20 *(inferred: Week 7)* |
| 3 | After Stephanie's requirements arrive, return a scoped next-phase recommendation covering self-serve access, multi-format intake, interruption recovery, mobile/tablet behavior, QR phone capture, testing, observability, and feedback collection — with must-have vs optional items and a price/timeline. | Simon | 2026-08-20 *(inferred)* |
| 4 | Before any real-data handoff, propose the minimum-data security architecture: verified AI-provider terms/account type, raw-document handling, retention/deletion, consent, access controls, and a de-identified regression-test strategy. | Simon | Before real-data demo access |

### What THEY Need to Do

| # | Action | Who | Due |
|---|---|---|---|
| 1 | Finish and send the hospital / health-system reference-data list. | Stephanie | 2026-08-13 |
| 2 | Review the updated coordinator interface and provider wizard; send concrete feedback and any remaining MVP issues. | Stephanie | 2026-08-17 *(inferred)* |
| 3 | Send a consolidated brief for the self-serve demo: intended testers, must-have experience, devices/document types, testing scenarios, instrumentation, and preferred follow-up method. | Stephanie | 2026-08-17 *(inferred)* |
| 4 | Decide whether the first external demo must use real PII or whether de-identified/synthetic inputs can validate the experience before a paid pilot. | Stephanie | Before next-phase scope is approved |

### What They're Expecting From Us

- A Week-7 MVP closeout with usable application and audit-trail outputs, not an open-ended demo-hardening build.
- A written technical recommendation for the hands-off self-serve demo once Stephanie sends her requirements.
- Clear guidance on what real-data storage would require before contacts upload CVs, IDs, or Social Security numbers.

### Open Questions Before Next Contact

- Is the Validation MVP accepted once the SOW's two PDFs and de-identified sample flow pass, or are any of the newly discussed self-serve capabilities being treated as MVP acceptance items?
- Is Demo Hardening / Pilot a separately paid phase? The signed SOW explicitly excludes production hardening and live provider data; no price or approval was discussed on this call.
- Who are the first testers, how many are there, and what exact event constitutes a successful test or triggers a paid pilot?
- Does the first test truly require raw PII? If yes, what consent, permitted use, retention, deletion, and access rules apply?
- Which demo-hardening capabilities are launch blockers versus backlog: broad document formats, QR phone capture, mobile/tablet optimization, resume-after-interruption, email, SMS, session recording, and survey tooling?
- What is the next commercial step with Matthew/Boston Children's, and who is the economic buyer?

## Call Summary

This status call clarified both the Validation MVP finish line and the shape of a potential next phase. Stephanie confirmed that the product remains provider-first: collect more complete information up front so the medical staff office avoids the long pending-items email; automated coordinator outreach and external verification remain V2/V3. She wants a hands-off self-serve demo for trusted contacts, followed by a paid, configured, non-integrated pilot that measures old-versus-new performance, then a heavier integration phase. The call did not convert that next phase into a scope, price, acceptance gate, or scheduled decision.

## Momentum

**→ Flat commercially; ↑ product clarity** — Phase 1 is nearing handoff and the next-phase thesis is substantially clearer, but the expansion remains unpriced and no mutual commercial next step was set.

## Key Intelligence / What Changed

1. **The demo's north star is provider experience through the medical staff office's eyes.** Stephanie's direct instruction: *"The real value is going to be cutting out that back and forth with the provider."* Coordinator email/call automation and external NPI-type checks are explicitly later; the current product wins by identifying and resolving more information up front.
2. **Her commercialization sequence is now explicit:** limited self-serve demo → paid configured/non-integrated pilot with real-world A/B measurement → integration. The demo is for learning and internal sharing; the paid pilot establishes whether the workflow is actually faster in a hospital's environment.
3. **The requested self-serve demo is outside the signed Validation MVP.** Multi-format intake, mobile/QR capture, crash/session recovery, broad adversarial testing, behavioral instrumentation, real PII, and production-grade security are new Demo Hardening / Pilot requirements. The SOW limits acceptance to de-identified samples and explicitly excludes production hardening and live provider data (`product/aicap/aicap-validation-mvp-sow-2026-06-22.md`).
4. **Output requirements are now concrete.** Coordinator output should expose three layers: red flags/pending items, line-by-line captured application data, and a printable form view. The demo uses a generic application; a paid hospital configuration reproduces that hospital's own form. The audit trail should follow Stephanie's existing prototype.
5. **The data-learning discussion exposed a high-risk conflation.** Observability, retaining raw PII, and maintaining regression fixtures are separate needs. Raw CV/ID/SSN data should not be called or treated as generic "training data" by default; the cheapest safe test is instrumented usage plus deliberately retained, consented, de-identified regression cases.

## Firm-Direct Analysis

### Pain Evidence

- **Painkiller remains confirmed:** incomplete provider submissions cause a multi-step coordinator loop — identify the gap, email the provider, wait, then contact a third party — that Stephanie estimates can add *"probably two weeks."*
- **Primary value mechanism:** resolve more information during provider intake, not replace every coordinator task.
- **Pilot proof metric:** compare new versus old workflows for provider preference, elapsed time, completeness, coordinator touches, and unresolved-item count. Only elapsed time was named explicitly; the rest require agreement.

### Objections / Risks

| Objection / concern | Type | How Simon handled it | Effectiveness | Better response |
|---|---|---|---:|---|
| Email and phone automation could delay the MVP. | Scope / timing | Accepted it as V2/V3 and refocused on provider intake. | 5/5 | Keep the decision explicit in the recap and do not let notification experiments reopen it. |
| A third-party email tool may expose ID, SSN, or other PII. | Security / trust | Acknowledged the concern and suggested a business AI account plus reduced storage, but improvised vendor/account claims. | 3/5 | "You're right; no third-party notification path touches documents or sensitive fields until we verify its data terms. For the first demo, notifications can carry only a status and an opaque link." |
| If data is deleted, future model changes may break the system without a regression set. | Reliability / data governance | Used a real Anthropic model-drift example, but jumped from regression testing to a case for retaining users' raw PII. | 2/5 | "We need a durable regression set, but that does not mean retaining every raw submission. We'll separate consented raw data, redacted/de-identified fixtures, and aggregate traces, then retain the minimum needed for each." |

### Stakeholders / Authority / Budget / Timeline

- **Authority:** Stephanie remains the buyer and product decision-maker for AICAP; hospital adoption still requires a champion-to-executive handoff.
- **Budget:** No budget or commercial structure was discussed for Demo Hardening / Pilot. Stephanie previously opened a renegotiation; it remains uncaptured.
- **Timeline:** Validation MVP Week 7 is the week of 2026-08-17. Stephanie wants to preserve momentum but did not set a date for external testing.
- **Stage signal:** Existing paid build approaching acceptance; follow-on opportunity in requirements discovery, not yet qualified commercially.
- **Mutual next step:** Partial only — Stephanie sends requirements/reference data; Simon returns technical thinking. Missing: decision date, scoped offer, price, and acceptance meeting.

## Simon's Performance

### Coaching Priorities

- The call blurred the contracted MVP with a materially larger real-data self-serve demo. → **Better language:** "The Week-7 handoff closes the Validation MVP against the de-identified flow and two outputs. What you just described — hands-off external access, failure recovery, broad formats, instrumentation, and real PII — is the next Demo Hardening / Pilot phase. I'll scope and price that separately after your brief." → This protects the finish line and converts expansion into a decision instead of free scope.
- Simon improvised on high-stakes data terms and pricing: *"I think it's the same price, but I could be completely wrong."* → **Better language:** "I don't want to guess on data terms or account requirements. I'll verify the exact provider terms and return with the minimum safe architecture before real data enters the system." → Certainty discipline matters most when PII, IDs, and SSNs are in scope.
- Solutions multiplied before requirements were ranked: every document type, QR handoff, mobile/iPad, email, SMS, session recording, and long-term storage. → **Better language:** "Let's rank these by what can make the first five tests fail. My initial order is save/resume, supported inputs, mobile usability, and observability; notifications and QR capture stay optional until testers prove they matter." → A risk-ranked demo scope preserves speed and creates a priceable unit.

### What Worked

- **Recovered the correct product focus.** Simon tested whether Matthew's coordinator-side pain should shift the roadmap, then accepted Stephanie's clearer provider-first thesis rather than hardening his inference.
- **Elicited a coherent land-and-expand sequence.** The self-serve demo → paid A/B pilot → integration progression is materially more useful than a generic request for "demo polish."
- **Turned vague PDF dissatisfaction into a concrete output model.** The live walkthrough produced a three-layer application output and a direct audit-trail reference.
