---
type: walkthrough-agenda
status: agenda for the recorded field-by-field walkthrough (commitment #28) — reframed to "confirm what we built"
date: 2026-07-09
---

# Field-by-Field Walkthrough — Agenda

> **Posture:** the baseline is already built. This call is not "tell us your rules from scratch" — it's a field-by-field review of the decisions we made from her samples, plus the content only she has. Run it in three passes: **(1) confirm the baseline we set, (2) confirm the flag-logic calls, (3) load the content we can't infer.** The client checklist sent 2026-07-08 already put passes 1 and 2 in front of her, so those should move fast; pass 3 is the bulk of the recording.
>
> For each item below: state what we did, get a confirm/adjust, capture any sub-answer. Sections 1–2 mirror the checklist Parts 2–3; Section 3 is the new depth.

---

## Section 1 — Confirm the baseline we set

Each was our judgment call from the samples; all are hospital-configurable. She confirms or course-corrects.

| #   | What we set                                                                                                                                                                                             | Confirm / adjust                                                                            |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 1   | **Baseline = superset of the two individual-provider forms** (universal privileging + CVO/locum), rendered as one intake with per-hospital config. Facility/Medicaid (S2) set aside as a separate axis. | Is the individual-provider superset the right MVP lane? Anything in S2 she wants pulled in? |
| 2   | **Superset internal / minimal surface** — model the full field superset internally, show the provider only what the target form requires (her "collect only what's needed" rule).                       | Confirm the split.                                                                          |
| 3   | **Work-history gap threshold: 90 days.** (Forms showed 3 months / 30 / 60.)                                                                                                                             | Right baseline? Hospital-configurable — confirm.                                            |
| 4   | **Peer references: 3, current.** (Forms showed covering-colleagues vs 6-within-a-year.)                                                                                                                 | Count, recency, who qualifies?                                                              |
| 5   | **Disclosure questions: the ~23 shared categories**, each hospital's wording mapped on as config. (S1 = 26, S3 = 19.)                                                                                   | Any category neither form covers that she always checks?                                    |
| 6   | **Attestation currency: 120 days.**                                                                                                                                                                     | Confirm as baseline.                                                                        |
| 7   | **Change-notice duty: 10 days.** (S1 = 10, S2 = 15.)                                                                                                                                                    | Confirm.                                                                                    |
| 8   | **Work-history window: 10 years, chronological, gaps flagged.**                                                                                                                                         | Confirm.                                                                                    |
| 9   | **Date normalization:** education/work → MM/YYYY; DOB → MM/DD/YYYY.                                                                                                                                     | Any field a hospital wants formatted differently?                                           |

---

## Section 2 — Confirm the flag-logic calls

Where the product's credibility lives. Each is the reading we made from the four sample CVs.

| # | What we did | Confirm / adjust |
|---|---|---|
| 10 | **MOC guard** — a past board-cert expiration annotated "MOC / continuous certification active" is **not** flagged. (Fires on all four CVs; a naive rule flags every one.) | Confirm. **How should the audit trail record "expired on paper, maintained under continuous certification"?** Any boards where this doesn't apply? |
| 11 | **Expired state license, no annotation → flagged.** (Okafor's Maryland license, exp 09/2025.) | Is an expired license in a state the provider *isn't* practicing in still a hold, or only for the destination state? |
| 12 | **"No expiration" board cert → left alone** (lifetime/grandfathered; the Cardiology IM cert). Don't fabricate an expiry. | Confirm — or ask the provider to verify? |
| 13 | **Name match (application vs medical-license name) → surfaced to the provider to confirm**, not verified (no PSV). | What exactly should the provider see when names differ (maiden vs married)? |
| 14 | **Non-resolving identifier (NPI/DEA/license) → noted, not verified**, surfaced for review. | What goes to the coordinator vs. what's asked of the provider? |

---

## Section 3 — Load the content we can't infer (the bulk of the recording)

This is the real reason to record the call — none of it is derivable from the forms. Go field by field.

15. **Guided-question wording.** For each residual-unknown field, the exact prompt that walks a provider to a compliant answer. We have draft wording; this pass replaces it with hers. *(Go field by field — this is most of the call.)*
16. **Resource pointers.** When a provider can't resolve an item alone (e.g. verifying a prior affiliation), we point them to who can (the prior practice's office manager). Where do those pointers come from — a lookup she maintains, provider-supplied, or inferred? 3–5 concrete examples per field type.
17. **Employment "rollover" (CND-04).** When "employed by hospital = yes," which exact fields pre-populate, and from what source?
18. **"Resolved" vs "needs follow-up"** at submission — her call per field, or a fixed rule?
19. **Minimalism boundary.** Concretely, which fields on these forms does she consider "extra / don't ask" because collecting them creates a verification burden?
20. **Document tracking.** Which accompanying documents (DEA copy, board cert, COI, DL/passport, reference letters, photo, DD-214, green card, CME certs) should the MVP *track the presence of* vs. just note as pending? (MVP inputs are CV + ID — is tracking the rest in scope?)
21. **Attestation wording.** Does the AICAP-captured e-signature need specific legal wording to be accepted downstream, or is downstream acceptance explicitly a pilot question (out of MVP scope)?

---

## Section 4 — Product / demo enablers + housekeeping

22. **Adverse-event CV.** All four samples are clean (only credential-expiry nuance). We built synthetic adverse CVs (malpractice, disciplinary) to demo the flag path — confirm they read as realistic, or point us to a real de-identified adverse case.
23. **Representative forms.** Are the three samples what her first design-partner hospitals actually use, or should we expect a different form as the real baseline?
24. **Government ID.** DL vs passport preference for the baseline; any state-DL fields to extract specifically (address, DL number).
