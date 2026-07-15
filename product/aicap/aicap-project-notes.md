---
type: project-notes
project: AICAP Validation MVP
owner: Simon Pettibone
status: living
last_updated: 2026-07-09
---

# AICAP — Project Notes

> **What this is:** a living notebook of **findings** and **open items to raise with Stephanie**. Distinct from the [[aicap-project-tracker|tracker]] (execution state — status, blockers, log) and the [[knowledge/README|knowledge base]] (the field/rule extraction). When something is a decision or a task, it lives in the tracker; when it's an observation or a question, it lives here.

---

## Week-1 demo + app handover (2026-07-09)

**The demo landed.** Simon walked Stephanie through the full working end-to-end journey (upload → autofill → compliance review → provider confirm → guided intake → attestation → two PDFs → admin view), framed as a scaffold on placeholder rules. **The app was made publicly available; Stephanie has a login and was shown how to file GitHub issues** — she'll log bugs as she finds them (the co-builder handover, executed). *(Meeting not recorded.)* Next client-facing milestone = **Week-2 compliance calibration**.

### The compliance model (Stephanie's brain-dump — the Week-2 architecture seed)

Compliance handling = **baseline + configuration**, the same pattern as the rest of the build. The mechanism she described:

- **Conditional document requirements.** An answer to a question can trigger a required document or form. That document must then be **checked against compliance requirements** — and those requirements can be **baseline or hospital-specific**.
- **Her example:** a document carrying a **stamp of approval from a compliance body** — some hospitals require the stamp, others don't. So the *requirement* for the stamp is configuration; the *check* that it's present is a compliance rule.
- **Implication:** compliance isn't just "is the field complete." It's **(a)** conditional document requirements triggered by answers, and **(b)** validation of document *properties* (present, correct type/version, required stamp) against baseline/hospital rules.

**Her homework:** produce a handful of concrete compliance examples for Simon to work through and derive the architecture from. **The approach:** stand up baseline compliance handling plus an architecture flexible enough that new rules she surfaces later drop in easily. So the compliance rubric now transfers *iteratively* (model brain-dump → her worked examples → build), not via one recorded walkthrough as originally planned.

### External market validation — Dean'Na / Care to Care interview (via Stephanie)

Stephanie forwarded her notes from a discovery call with **Dean'Na**, a senior credentialing SME at **Care to Care LLC** supporting a large NYC health system (~11 acute-care hospitals + ambulatory + SNF; primary platform **MD-Staff**). Independent validation — not from Stephanie herself.

**Core-premise validation (the headline):** *"It basically is asking the questions ahead of time that we would normally ask after we receive an incomplete application."* Asked whether it would improve workflow: *"Absolutely… it lessens the time we would have to follow up with the provider."*

**Signals that reinforce the current design:**
- **Hard vs soft stops** (raised unprompted): make submission requirements configurable by org — license / ID / required docs = hard stop; docs that legitimately need time = soft. → validates the baseline+config submit-gate; maps directly onto the compliance-document-requirement model above.
- **11 bylaws, 11 requirement sets** → validates per-hospital configurability, hard.
- **Field-level attribution is enough for trust.** Shown the provider/CV/AI/confirmed audit trail, she raised no AI-trust concern. → validates the provenance design for expert users.
- **Controlled retrieval, not open internet** — for institutional contacts, prioritize official sites / trusted directories / curated sources ("the information is not always accurate"). → direct guardrail for the **resource-pointers** open question ([[walkthrough-questions]] §3 #16): curate the source, don't free-search.

**Signals beyond the current MVP (roadmap — flag the scope):**
- **Document intelligence** — providers upload the *wrong* document (license certificate vs current registration; course cert vs state tracking doc). She wants AI to recognize "this is not what we're asking for." Beyond the MVP's CV+ID extraction; a future document-understanding surface. Converges with Stephanie's stamp-check example.
- **Ongoing monitoring** (DEA renewal tracking) — the MVP is intake, not lifecycle monitoring. Roadmap.

**So what:** two independent credentialing experts now describe the same architecture from two sides — documents are first-class, requirements are conditional + per-hospital configurable, and validating document *correctness* (type/version/stamp) is where the next value sits. That is the Week-2 compliance architecture's north star. Treat Care to Care as **validation, not a Simon-owned lead** — it's Stephanie's relationship and world.

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
Full agenda — 22 questions, grouped — lives in **[[walkthrough-questions]]**. Bring the whole list to the call. The ones that most shape the build, if time is short:
- **Q1 — which form is the baseline?** (S1 vs S3 — which do your design partners actually use?) Everything downstream keys off this.
- **Q4 — the work-gap threshold** (30 / 60 / 90 days — you arbitrate).
- **Q7 — the MOC "expired-but-active" board-cert guard** (confirm: don't flag; how to record it).
- **Q19 — the minimalism boundary** (which fields you consider "extra / don't ask").

### 2. Product / demo enablers
- ✅ **Adverse-event CV** — resolved by constructing *synthetic* adverse CVs (malpractice, disciplinary) for the flag path. Still worth asking Stephanie to gut-check they read as realistic, or point to a real de-identified case ([[walkthrough-questions]] §4).
- ✅ **Government ID** — sample sourced from the web; ID extraction demoed. Confirm DL-vs-passport preference + any specific fields ([[walkthrough-questions]] §4).
- **Replit export / screenshots** of her prototype as a build reference (still open).

### 3. Relationship / logistics (not field-level)
- **Lock the weekly-demo cadence + name the 30-day refund clock start** — neither was set on the kickoff call. Put it in writing.
- **Confirm the payment arrangement.** She paid **in full** (not a milestone slice as the SOW implied). Fine, but the 30-day full-refund clause is live — make sure the Upwork setup and the refund understanding match. *(Internal-facing; confirm with her only if the Upwork mechanics need it.)*

---

## Open decisions (ours)

- **Compliance architecture (the live Week-2 decision).** How the data model holds Stephanie's compliance model: **conditional document requirements** (an answer triggers a required document/form), **document-property validation** (present / correct type-version / required stamp), and **hard vs soft stops** — all as baseline defaults with per-hospital config over the top. Seeded by her worked examples (her homework). Build baseline handling now; keep the model extensible so later rules drop in.
- **Baseline form** — *resolved by reframe:* we build one baseline individual-provider superset with per-hospital config; no single form is "picked." Stephanie confirms or course-corrects (client checklist Part 2 / [[walkthrough-questions]] §1).
- **Superset-internal / config-surface split** — model the full superset internally, render only the target form's required fields to the provider (her minimalism rule).
- **Rule encoding** — repeating groups, conditional branches (gating *and* populating), cross-field consistency, rule provenance. Gap table at [[knowledge/rules-catalog|rules-catalog.md]]. (Core rule model already built 2026-07-02; document-requirement layer is the Week-2 extension.)

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
- Walkthrough agenda → [[walkthrough-questions]]
- Relationship / call history → [[bd/calls/contacts/stephanie-williamson]]
