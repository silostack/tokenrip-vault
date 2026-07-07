---
type: project-notes
project: AICAP Validation MVP
owner: Simon Pettibone
status: living
last_updated: 2026-07-02
---

# AICAP — Project Notes

> **What this is:** a living notebook of **findings** and **open items to raise with Stephanie**. Distinct from the [[aicap-project-tracker|tracker]] (execution state — status, blockers, log) and the [[knowledge/README|knowledge base]] (the field/rule extraction). When something is a decision or a task, it lives in the tracker; when it's an observation or a question, it lives here.

---

## Key findings so far

**On the data (from the sample extraction — full detail in [[knowledge/README|knowledge/]]):**

- **Three platforms, two axes.** The three sample applications are genuinely different: **S1** = universal individual privileging (CAQH-style), **S3** = LocumTenens/CVO individual credentialing (explicitly NCQA + Joint Commission), **S2** = *facility/organization + Medicaid enrollment* (42 CFR 455 ownership disclosure) — a different axis entirely. The MVP core is the individual-provider superset (S1 ∪ S3); S2 is captured but flagged as out-of-lane unless Stephanie says otherwise.
- **The forms contradict each other.** Same concept, different rule — the work-gap-explanation threshold is **30 days (S3 body) / 60 days (S3 instructions) / 3 months (S1)**; disclosure sets are 26 (S1) vs 19 (S3). These can't be auto-resolved; they're Stephanie's calls (→ walkthrough).
- **The board-cert "expired" trap is the headline nuance.** All four sample CVs show a *past* board-cert expiration annotated "(MOC/Continuous active)". A naive "expired cert → flag" rule false-positives on **every** physician. Meanwhile the Ortho CV's Maryland license (expired 09/2025, no annotation) is a *real* flag. Getting this right — flag the license, stay silent on four MOC certs — is the demo's credibility test.
- **⚠️ All four sample CVs are essentially "clean."** Three of four have no adverse history; the only nuances are credential-expiry/MOC. **There is no CV with a disclosed malpractice claim or disciplinary action**, so we currently cannot demo the red-flag / disclosure-explanation path end-to-end. We need one (see "raise with Stephanie" below).
- **The repo schema is deliberately thinner than reality.** `applicationFieldSchema {key,label,required,pattern}` + `Rubric/RedFlagRule` can't yet express repeating groups, conditional branches, the populating "rollover," cross-field consistency, format-normalization, or rule provenance. Full gap table at the end of [[knowledge/rules-catalog|rules-catalog.md]] — that's the architecture-session input.

**On the working relationship (from the kickoff, 2026-07-01):**

- **No requirements doc exists** — the compliance checklist + guided-question content live in Stephanie's head and transfer via a **recorded field-by-field walkthrough**, not a file. That call is the critical dependency for everything past Week-1 autofill.
- **Minimalism is a compliance rule, not a preference:** "we don't ask for anything that isn't needed — extra data creates an obligation to verify it." Consequence for design: the *dictionary* is a superset (knowledge), but the *provider surface* should show only what the target form requires.
- Her **Replit prototype** already encodes the flow she wants (resolved/unresolved → intelligence layer → guided questions → name-match → employment rollover → date-normalization → two-checkbox attestation → flags → audit trail). Worth getting the export/screenshots as a build reference.

---

## Items to raise with Stephanie

### 1. The field-by-field walkthrough (the big one)
Full agenda — 22 questions, grouped — lives in **[[knowledge/walkthrough-questions]]**. Bring the whole list to the call. The ones that most shape the build, if time is short:
- **Q1 — which form is the baseline?** (S1 vs S3 — which do your design partners actually use?) Everything downstream keys off this.
- **Q4 — the work-gap threshold** (30 / 60 / 90 days — you arbitrate).
- **Q7 — the MOC "expired-but-active" board-cert guard** (confirm: don't flag; how to record it).
- **Q19 — the minimalism boundary** (which fields you consider "extra / don't ask").

### 2. Product / demo enablers
- **We need a CV with a disclosed adverse event.** All four samples are clean, so the flag/disclosure-explanation path can't be demoed. Ask Stephanie to point to (or help construct) a de-identified CV with a malpractice claim or disciplinary action. *(= walkthrough Q21, but surfaced here because it blocks a whole demo path.)*
- **Replit export / screenshots** of her prototype as a build reference.
- **Government ID preference** — DL vs passport, and any specific DL fields to extract (= walkthrough Q22). *(Simon is sourcing a sample from the web in the meantime.)*

### 3. Relationship / logistics (not field-level)
- **Lock the weekly-demo cadence + name the 30-day refund clock start** — neither was set on the kickoff call. Put it in writing.
- **Confirm the payment arrangement.** She paid **in full** (not a milestone slice as the SOW implied). Fine, but the 30-day full-refund clause is live — make sure the Upwork setup and the refund understanding match. *(Internal-facing; confirm with her only if the Upwork mechanics need it.)*

---

## Open decisions (ours — for the architecture session)

- **Baseline form** (S1 vs S3) — pending Stephanie's input (walkthrough Q1); needed before Week-2 config.
- **Superset-internal / config-surface split** — model the full superset internally, render only the target form's required fields to the provider. (Aligns with her minimalism rule; confirm at walkthrough Q3.)
- **Rule encoding** — how the data model holds repeating groups, conditional branches (gating *and* populating), cross-field consistency, and rule provenance. See the gap table in [[knowledge/rules-catalog|rules-catalog.md]]. This is the substance of the architecture session (tracker item 1b).

---

## Risks / watch

- **Demo credibility rests on precision** — surface Okafor's genuinely-expired Maryland license while staying silent on four MOC-annotated board certs. Cry-wolf kills the demo.
- **Clean-samples gap** — without an adverse-event CV, a core value prop (catching disclosable issues) is undemonstrated. Chase #2 above.
- **Refund clock is live during the build** (~day-30 ≈ 2026-07-31) — the weekly demos fall inside it, so real visible progress each Friday is the safety mechanism.
- **Scope creep to the entity axis** (S2 / Medicaid enrollment) — keep out of the MVP unless Stephanie explicitly pulls it in.

---

## Related

- Execution state / blockers / log → [[aicap-project-tracker]]
- Field + rule extraction → [[knowledge/README|knowledge/]]
- Walkthrough agenda → [[knowledge/walkthrough-questions]]
- Relationship / call history → [[bd/calls/contacts/stephanie-williamson]]
