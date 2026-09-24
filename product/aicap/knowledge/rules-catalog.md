---
type: knowledge-rules-catalog
status: raw extraction — companion to rules-catalog.yaml
date: 2026-07-02
---

# Credentialing Rules Catalog — reader's guide

> The full typed rule list (with triggers, provenance, and consequences) is **[`rules-catalog.yaml`](rules-catalog.yaml)**. This file explains the rule *types*, the design-relevant patterns, and — most important for the architecture session — **where the current repo schema can't yet hold what the rules require**.

## The seven rule types

| Type | Count | What it governs | Example |
|---|---|---|---|
| **format** | 9 | How values must be shaped/normalized | Month+year required; no blanks → "n/a"; year-only → MM/YYYY |
| **completeness** | 9 | What must be present for the app to be "complete" | 10-yr chronological work history; all disclosure Qs answered; **collect only what's needed** |
| **conditional_branch** | 11 | "If X then require/populate Y" | Not board certified → exam-status; **employed by hospital → pre-populate affiliations** (Stephanie's rollover) |
| **cross_field_consistency** | 6 | Agreement between two+ fields | **Application name == license name**; NPI matches NPPES; continuous timeline |
| **compliance_red_flag** | 21 | Adverse-history & validity flags surfaced to the coordinator | Disclosure categories; expired license; **board-cert MOC false-positive guard** |
| **attestation** | 6 | Genuine consent + signature | Real provider e-signature; current-dated (120-day window) |
| **document_requirement** | 16 | What must accompany a complete app | W-9, DEA copy, board cert, DL/passport, 3 reference letters |

## Four patterns worth designing around

1. **Two directions of "conditional".** Some conditionals *gate* (disclosure "Yes" → explanation required, blocks submission); one *populates* — CND-04, Stephanie's employment "rollover," is an **expansion** rule (Surface 2): an answer *fills* adjacent fields rather than blocking. The engine needs both a gating and a populating mode.

2. **Disclosure questions are the red-flag spine.** S1's 26 and S3's 19 don't line up one-to-one, but they collapse onto ~17 shared **categories** (licensure action, privilege action, exclusion, NPDB, criminal, substance, etc.). Model the *categories*; treat each hospital's exact worded question set as config that maps onto them.

3. **Consequence is a first-class property.** Rules resolve to one of: `blocks_submission` (hard — all-or-nothing), `flag_for_coordinator` (surface it, don't block), `needs_follow_up` (the resolved/unresolved gate — Stephanie's core loop), `delays_verification`, or `informational`. This maps directly onto the repo's `complianceStatus` (`compliance_ready | needs_follow_up`) but is richer than a binary.

4. **The MOC false-positive is the archetypal nuance.** `FLG-BOARD-MOC` vs `FLG-BOARD-REAL`: an *expired board-cert date with a "continuous/MOC active" annotation is fine*; an *expired state license with no such annotation is a real flag*. Every one of the four CVs would trip a naive expiry rule. This is the concrete proof that rules need semantic context, not just a date comparison. (Worked in `source-map-and-nuance-cases.md`.)

## Conflicts the forms can't resolve themselves

The forms disagree; these are **Stephanie's calls**, not the model's (see `walkthrough-questions.md`):

- **Work-gap threshold**: 3 months (S1) vs 30 days (S3 body) vs 60 days (S3 instructions).
- **Disclosure set**: 26 (S1) vs 19 (S3) → use the shared-category union; exact wording is per-hospital config.
- **Change-notice window**: 10 days (S1) vs 15 days (S2).
- **References**: covering-colleagues (S1) vs 6 physician references (S3).

## Repo alignment — the input to the architecture session

The Phase-0 repo (`~/projects/maxi/aicap/packages/core/src`) models this today:

- `applicationFieldSchema` = `{ key, label, required, pattern? }` — a **flat** field with an optional regex.
- `Rubric` = `{ id, fields: ApplicationField[], redFlags?: RedFlagRule[] }`; `RedFlagRule` = `{ fieldKey, category, whenTruthy, message }`.
- `evaluate(result, rubric)` sets each field `compliance_ready | needs_follow_up` and raises field-keyed red flags.

**What the extraction found that this schema cannot yet express** (the design gaps to solve):

| Reality in the forms | Not expressible today because… | 
|---|---|
| **Repeating groups** (licenses, DEA, training, board certs, affiliations, references, liability policies, work-history entries, CME, disclosure questions) | `fields[]` is a flat list; no group/row cardinality |
| **Conditional branches** (CND-01…11) | No "if field A = X then require/show field B" relation |
| **Populating conditionals** (CND-04 rollover) | `RedFlagRule` only *flags*; nothing *fills* |
| **Cross-field consistency** (name==license, continuous timeline) | Rules are keyed to a single `fieldKey` |
| **Format/normalization** (date reshaping FMT-08) | `pattern` validates but doesn't transform |
| **Rule provenance** (which form + which regulatory body) | No provenance attribute on rules |
| **Consequence gradations** beyond ready/needs-follow-up | `complianceStatus` is binary |
| **Document requirements** as first-class objects | Not modeled |

None of this prescribes the design — it's the checklist of what the encoding must be able to *hold*. That's the handoff to the repo session.
