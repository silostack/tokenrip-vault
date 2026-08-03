---
type: client-facing-doc
audience: Stephanie Williamson (AICAP)
purpose: Reference checklist for the automated compliance review — sent ahead of the Thursday demo
status: draft — for Simon to review before sending
created: 2026-07-08
---

# AICAP — Automated Compliance Review
### Checklist and baseline decisions

**Prepared for:** Stephanie Williamson, AICAP
**Prepared by:** Tokenrip
**Date:** 2026-07-08

---

## The approach

This checklist is what the automated compliance review runs an application against: the step that sorts every field into *ready* or *needs follow-up* before a coordinator sees it. It is the gate for the compliance-review work coming next.

It was drafted from the three source applications and four CVs AICAP provided, so it reflects those forms rather than a generic template. The approach:

- A single baseline intake was built as a superset of the two individual-provider forms, configurable per hospital.
- Where the forms disagreed, a baseline default was set as a sensible starting point (Part 2).
- Where the flag logic turns on nuance, a specific reading was made (Part 3).

Each of those is AICAP's to confirm or course-correct. This document states what was built and every call that went into it.

### The three source forms

| Source form | What it is | Role in the baseline |
|---|---|---|
| Universal privileging application | Individual-provider hospital privileging | Folded into the baseline superset |
| CVO / locum credentialing application | Individual-provider credentialing (NCQA + Joint Commission grounded) | Folded into the baseline superset |
| Facility / Medicaid enrollment form | Organization-level (entity TIN, ownership, service locations) | Set aside as a different axis from individual-provider credentialing |

The baseline does not require choosing one form. It starts from the individual-provider superset and treats each hospital's specifics as configuration.

---

## Part 1 — What the review checks

Seven kinds of check, drawn from the source forms. Red flags surface to the coordinator, never to the provider.

| Check | What it enforces | Example |
|---|---|---|
| **Completeness** | Everything a complete application requires is present, asking only for what is needed. | A continuous 10-year work history; every disclosure question answered. |
| **Format** | Values are shaped and normalized as the form expects. | Dates to MM/YYYY; a year-only CV entry normalized rather than left ambiguous. |
| **Conditional requirements** | "If this, then that" logic. | Not board certified, so capture exam status. Employed by a hospital, so affiliation fields populate rather than being re-asked. |
| **Cross-field consistency** | Fields that must agree, agree. | Application name matches the medical-license name; the work-history timeline has no unexplained breaks. |
| **Adverse-history and validity flags** | Anything a coordinator must see is surfaced. | Every disclosure category; an expired credential; a settled or pending malpractice claim. |
| **Attestation** | The signature is genuine and current. | A real provider e-signature, dated within the currency window. |
| **Supporting documents** | What must accompany a complete application is tracked. | DEA copy, board certificate, certificate of insurance, government ID, reference letters. |

---

## Part 2 — Baseline defaults set where the forms differed

The source forms handle several things differently. A baseline default was set for each, and all are configurable per hospital.

| Item | What the forms showed | Baseline set |
|---|---|---|
| **Work-history gap** | Explanation required after 3 months (universal) / 30 days (CVO body) / 60 days (CVO instructions) | Explanation required for gaps over **90 days** |
| **Peer references** | Covering colleagues (universal) vs 6 physician references within the past year (CVO) | **3** current peer references |
| **Attestation currency** | Signature within 120 days, per NCQA | Signature dated within **120 days** |
| **Change-notice duty** | Report a change within 10 days / 15 days | Report material changes within **10 days** |
| **Work-history window** | 10-year chronological history | **10 years**, gaps flagged |

**Disclosure questions.** The universal privileging application carries 26 (pp.13–15); the CVO/locum application carries 19 (p.9). Rather than fix on either set, the review is built against the ~23 shared categories the two collapse onto: licensure action, privilege action, exclusion, NPDB, criminal history, impairment, malpractice, and the rest. Each hospital's exact question wording maps onto those categories as configuration. Any "Yes" triggers the supplemental explanation.

---

## Part 3 — Flag-logic calls

This is where the review's credibility lives: it has to surface the genuine issues without flagging what is actually fine. The readings below come from the sample CVs.

| Situation | How the review handles it |
|---|---|
| Board certification with a **past expiration date, annotated MOC / continuous certification** | Treated as current; **no flag**. (All four sample CVs contain this, and a naive date rule would flag every one.) |
| State license **expired with no such annotation** | **Flagged** for coordinator follow-up. |
| Application name **differs** from medical-license name (e.g. maiden vs married) | Surfaced to the provider to confirm. Not a verification, since AICAP does no PSV. |
| An NPI / DEA / license number that **doesn't resolve** cleanly | Noted and surfaced for review, not verified. |

A few specifics still need AICAP's call:

- How the audit trail should record "expired on paper, maintained under continuous certification."
- Whether an expired license in a state the provider isn't practicing in is still a hold, or only for the destination state.
- For an identifier that doesn't resolve, what goes to the coordinator versus what is asked of the provider.

---

We'll walk through this together on the call, alongside the working product. Bring anything that looks off.
