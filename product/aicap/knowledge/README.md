---
type: knowledge-base-index
project: AICAP Validation MVP
status: RAW EXTRACTION — feeds architecture design; NOT the final schema
owner: Simon Pettibone
date: 2026-07-02
derived_from:
  - product/aicap/data/application-samples/Application-Sample-1.pdf
  - product/aicap/data/application-samples/Application-Sample-2.pdf
  - product/aicap/data/application-samples/Application-Sample-3.pdf
  - product/aicap/data/cv-samples/{Ortho,Cardiologist,Emerg-Med,Fam-Med}-cv.pdf
  - bd/calls/contacts/stephanie-williamson.md (Stephanie-stated logic)
  - product/aicap/research + engineering (domain docs)
feeds:
  - "~/projects/maxi/aicap/ architecture-design session (rule encoding + data model)"
  - "Stephanie field-by-field walkthrough call (open-commitment #28)"
---

# AICAP — Credentialing Knowledge Base

> ⚠️ **STATUS: raw extraction, not the final schema.** This captures *what the fields and rules are* across real credentialing forms — their semantics, source, and provenance. It is deliberately **architecture-neutral**: it does **not** decide how rules are encoded or how the data model is shaped. That design happens separately, in the AICAP repo, and this is its input.

## What this is

An analytical extraction of the **superset of credentialing fields** and the **business rules** that govern them, drawn from three real credentialing applications (each from a different platform) and four physician CVs, cross-referenced with AICAP's domain knowledge and Stephanie's stated logic. The goal: walk into the repo architecture session with the domain fully mapped, and hand Stephanie a precise agenda for the field-by-field walkthrough.

## The source corpus

Three applications that deliberately span **three different credentialing contexts** — confirming Stephanie's point that every hospital / payer / CVO uses its own form over a shared regulatory core:

| # | Source | Context | Structure | Role in the extraction |
|---|--------|---------|-----------|------------------------|
| **S1** | "Standardized Provider Credentialing Application" (18 pp) | Individual provider — hospital/health-plan **privileging** (CAQH-style universal) | Line-based form | The widest **individual-provider** field superset |
| **S2** | Coordinated Care (WA Medicaid MCO) packet (15 pp) | **Facility / organization + payer (Medicaid) enrollment** | Instructions + IRS W-9 + 42 CFR 455 ownership disclosure + facility app | The **entity / ownership / enrollment** axis (mostly org-level) |
| **S3** | LocumTenens.com / CVO "Physician Initial Credentialing Application" (17 pp) | Individual physician — **CVO / locum initial credentialing** | Table-structured form | Cleanest individual-provider structure; **explicitly cites NCQA + Joint Commission** and prints the most rules |

Four CVs (Orthopedic, Cardiology, Emergency Medicine, Family Medicine) share one template and are the **primary source documents** the workflow extracts from. They carry realistic nuance (expired-looking board certs under continuous MOC; a genuinely expired state license; multi-state licensure; lifetime vs time-limited certs).

## The files

| File | What |
|------|------|
| **`field-dictionary.md`** / **`.yaml`** | The **superset of fields** across all three forms + the CV-derivable set. YAML = the structured data; MD = the readable guide + cross-form label-variance commentary. |
| **`rules-catalog.md`** / **`.yaml`** | Every **rule** extracted and typed (format · completeness · conditional-branch · cross-field-consistency · compliance/red-flag · attestation · document-requirement), each with semantics, trigger, affected fields, **provenance** (form + regulatory basis), and consequence. |
| **`source-map-and-nuance-cases.md`** | Document → field **source map** (CV vs government-ID vs provider-entered), and **worked nuance/flag cases** drawn from the four CVs. |
| **`walkthrough-questions.md`** | The gaps and conflicts the extraction surfaced — the **agenda for Stephanie's field-by-field walkthrough**. |

## Headline findings (the "so what")

1. **Two credentialing axes, not one.** S1 + S3 are *individual-provider* credentialing (the AICAP core); S2 is *facility/entity + Medicaid enrollment* (42 CFR 455 ownership disclosure). The MVP baseline is the individual-provider superset; the entity axis is captured but flagged as a separate context.
2. **The forms disagree with each other.** Same concept, different rules — e.g. the **work-gap-explanation threshold is 30 days (S3 body), 60 days (S3 instructions), and 3 months (S1)**. A single baseline must *choose*, and that choice is Stephanie's — see `walkthrough-questions.md`.
3. **The disclosure-question sets differ** (S1 = 26, S3 = 19) but map onto a shared set of **red-flag categories** (licensure sanction · privilege action · exclusion/debarment · malpractice · criminal · substance/impairment · NPDB/HIPDB). The union is what the compliance layer must cover.
4. **The board-certification "expired" trap.** All four CVs show a past board-cert expiration annotated "(MOC/Continuous active)". A naive expiry rule false-positives on every physician; the real signal is *state-license/DEA* expiry (see the Ortho MD license, genuinely expired 09/2025). This is the archetypal "trips people up" case.
5. **The current repo schema is intentionally thinner than reality.** `applicationFieldSchema {key,label,required,pattern}` + `Rubric/RedFlagRule` model flat fields + field-keyed red flags. They do **not** yet model: repeating groups (license table, work history, board certs), conditional branching, cross-field consistency, format-normalization, rule provenance, or document requirements. Those gaps are the explicit input to the architecture session — see the "repo alignment" note at the end of `rules-catalog.md`.
