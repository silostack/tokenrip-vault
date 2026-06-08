---
title: Terminus — Shared Extraction & Decision Engine (Build Brief)
status: active
type: technical-design / build-brief
created: 2026-05-30
self_contained: true
---

# Terminus — Shared Extraction & Decision Engine

> **Read this first.** This document is self-contained: it carries all the context needed to set up the `terminus` repository and start building, with no other documents required. It is the build brief for a new repo at `/Users/si/projects/maxi/terminus`.
>
> **Reference implementation for conventions:** an existing, working monorepo lives at `/Users/si/projects/maxi/tokenrip`. Mirror its idioms (Bun workspaces, TypeScript config, NestJS backend, TanStack frontend, package build/exports). Inspect it directly — specific files to read are listed under "Conventions to mirror."
>
> **First task for a fresh session:** scaffold the monorepo skeleton, then build the **Python extraction service v1** (the only piece ready to build today). See "Build sequence."

---

## 1. What Terminus is

Terminus is a **reusable engine** plus its first consumer application. The engine takes a stack of messy documents, extracts structured data from them, applies an encoded judgment rubric, and produces an auditable decision with reasons and confidence — with a human in the loop. Stated as a pipeline:

> **documents → structured extraction → rubric/decision → operator review**

This pattern recurs across many document-heavy, judgment-heavy workflows. Terminus exists because **two live deals need exactly this shape**, and one engine can serve both if the seams are drawn correctly. The first consumer is a **healthcare-credentialing** application (the anchor); the second (later) is **equipment-finance underwriting**.

**It is explicitly NOT a "RAG pipeline."** Neither deal needs retrieval over a document corpus. Both encode *policy/judgment* (a compliance checklist; a credit rubric), which fits in model context — not a searchable knowledge base. Retrieval has exactly one future home here (the equipment-finance "deal-graph," §8), and that is a later, single-deal moat layer, not the shared foundation. Do not build vector search / embeddings infrastructure for v1.

---

## 2. The two consumers (why the engine is shaped this way)

### Consumer A — Healthcare credentialing (the anchor; first build)

**Customer:** a credentialing-services company that prepares physician credentialing applications for hospitals. The principal has ~20 years as a medical-staff-services (MSP) coordinator.

**The problem:** when a hospital credentials a physician, a coordinator assembles and verifies an application — license verification, work history, board certifications, DEA registration, hospital affiliation, malpractice coverage, peer references. Today this is a 4–6 week manual back-and-forth. Each day a physician sits un-credentialed (and therefore un-billable) costs the hospital on the order of $22K — so compression has hard dollar value.

**What we build (Phase 1 — the application-completion pipeline):** five product surfaces.
1. **Application autofill from documents.** Provider uploads CV, medical licenses, DEA registration, board certifications, malpractice coverage. The system extracts structured fields and pre-fills the application wherever the source is unambiguous. Provider sees a mostly-populated application, not a blank form.
2. **Context-aware field expansion.** When a document implies a fact (CV: "faculty member at UCSD Medical Center"), auto-populate adjacent fields (hospital affiliation, malpractice scaffolding) instead of re-asking.
3. **Automated compliance review.** Every field is checked against the compliance bar (Joint Commission, CMS, NCQA-relevant items) and sorted into compliance-ready vs. needs-follow-up before any human review.
4. **AI gap-fill with operator review.** For unresolved items, AI proposes the most likely answer with a **confidence score and source reasoning**. Operators approve, override, or defer. **Nothing auto-submits.**
5. **Smart intake.** Genuinely-unresolved items surface as a short set of targeted questions to the provider (3–5 items, not a 40-field form).

**Three user-facing surfaces:**
- **Coordinator dashboard (operator).** Queue of active applications (name, specialty, days-in-queue, flag status, completion %). Case detail view: red flags at top (e.g., DUI, malpractice history, prior disciplinary actions), then items pending from the provider, then compliance-cleared items. Each AI suggestion shows its confidence + source reasoning; operator approves / overrides / routes a follow-up. Every action timestamped to an audit trail.
- **Physician intake flow (provider).** Secure link, upload documents, see a mostly-prefilled application, answer only the short residual question set.
- **Hospital handoff (downstream).** A compliance-ready application with full audit trail, delivered as a PDF or pushed into the hospital's credentialing system (Symplr / VerityStream / MD-Staff).

**Operating principle:** *AI prepares, people decide.* This is a regulated workflow — human-in-the-loop is mandatory, never optional.

**Data / compliance:** Protected Health Information (PHI). Per-customer data isolation, encrypted at rest and in transit, every read/write logged. HIPAA matters: confirm an Anthropic BAA (Business Associate Agreement) covers Claude usage before any real provider documents are processed; self-hosted parsing keeps documents inside our infrastructure; any third-party document-parsing API would each need its own BAA.

**Delivery shape:** ~7-week Phase-1 build, weekly Friday demos on real (anonymized) applications, a 30-day no-questions-asked refund window. **This tight, externally-visible clock is the core reason the build is standalone and not on an in-house platform with unshipped primitives** (§4, decision 3).

**Documents to handle:** CV, medical licenses, DEA registration, board certifications, malpractice coverage. (Mostly digital PDFs, but licenses/certs are often scanned images of variable quality — the "hard tail.")

### Consumer B — Equipment-finance underwriting (reuses the engine; later)

**Customer:** an equipment-finance lessor (lends against equipment via leases/loans). The operating partner is a senior industry insider. The wedge is **small-ticket origination**: deals roughly **$100K–$2M**, continental US.

**What reuses our engine — the pre-qualification slice:** input = a sourced company + basic financial signals + the financing ask; rubric = the partner's credit judgment (gating criteria, red flags, structure/pricing heuristics); output = **fundable / marginal / pass + an indicative (caveated) rate-term band + the reasons**. A "pre-priced lead," not just a contact.

**Documents:** deal memos and financial statements (balance sheets, personal financial statements) — **table-heavy**. This is squarely the "hard tail" where naive text extraction and vision-only LLM reads struggle, and real table/layout parsing earns its place. ~7 real deal memos exist to prototype extraction against — **real PII; keep them strictly local, never send to any third-party surface.**

**The rubric is the valuable, defensible asset (the encoded judgment).** The partner's written spec containing that rubric lands ~2026-05-31/06-01. The engine's **decision-side** shape (the `Rubric` type, §5) should be reviewed against that real rubric before being committed — do not over-design it ahead of seeing the real second shape (§4, decision 4).

**Out of scope for this engine:** deal *sourcing* (contact/firmographic data harvesting) is a separate concern. And the **deal-graph** — retrieval over *past deal outcomes* to calibrate scoring — is a future, single-deal moat layer (§8), not part of v1.

---

## 3. The shared primitive across the two

| | Consumer A (credentialing) | Consumer B (equipment finance) |
|---|---|---|
| **Documents → fields** | CV, licenses, DEA, certs, malpractice → application fields | deal memos, financial statements → deal/borrower fields |
| **Rubric → decision** | compliance checklist → compliance-ready / needs-follow-up + flags | credit rubric → fundable / marginal / pass + rate-term band |
| **Operator review** | coordinator dashboard, approve/override/defer, audit trail | committee review packet |

Same three-stage shape. The engine implements the stages; each consumer supplies its own schema, rubric, integrations, and UI chrome.

---

## 4. Locked decisions

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | **Anchor to Consumer A (credentialing); build to generalize.** | Closest to a signed contract, concrete spec, its five surfaces *are* this pattern. Consumer B reuses the core (~2 weeks marginal). |
| 2 | **It is an extraction→decision→review engine, not RAG.** | Both "knowledge bases" are encoded rules/judgment, not retrieved documents. No vector DB in v1. |
| 3 | **Standalone build; own the whole stack.** | A regulated pilot under a refund-window clock cannot also absorb debugging an in-house platform's unshipped primitives. Speed + safety. |
| 4 | **Clean module boundaries now; genericize only when Consumer B's real rubric is in hand.** | YAGNI / rule-of-three. Designing the deal-agnostic abstraction before seeing the real second use builds the wrong abstraction. Keep modules cleanly separated and config-driven, but Consumer-A-shaped, until a second real rubric confirms the generalization. |
| 5 | **New repo, monorepo-first, mirror the `tokenrip` idiom; split the engine to its own repo only later.** | Split trigger: an external consumer needs the engine as a versioned dependency, or deploy/team boundaries force it — not before. |
| 6 | **Extraction = Python service; decision + review = TypeScript.** | Evidence (§6): Python is materially ahead for document extraction; decision + review are app-adjacent / UI-bound and belong in TS. |

---

## 5. The engine — three modules and the seam

**The seam is the whole design:** the engine takes `(documents, schema, rubric, case)` as **configuration**; the per-consumer domain layer supplies those four things plus integrations, UI chrome, and intake/handoff. Core = deal-agnostic. Domain = per-deal.

| Module | Interface (conceptual) | Language | Domain layer supplies |
|--------|------------------------|----------|------------------------|
| **extract** | `(documents, schema) → { field: {value, confidence, source} }` + `unresolved[]` | **Python service** | the target field schema; doc-type hints |
| **decision** | `evaluate(fields, rubric) → { verdict, reasons[], flags[], confidence }` | TypeScript | the rubric: gating criteria, red flags, scoring/structure heuristics |
| **review** | `review(case) → operator UI + append-only audit trail` | TypeScript | labels; the downstream handoff |

- `source` (provenance) = which document / page / span a value came from. Required, not optional — it is what makes operator review and audit trustworthy.
- `extract` is **strategy-pluggable** (VLM-direct / parse-then-LLM / hybrid — see §6). Output is tagged with the strategy that produced it; cross-strategy agreement/disagreement is a first-class confidence signal.
- **Consumer A mapping:** schema = credentialing application fields; rubric = compliance checklist (Joint Commission / CMS / NCQA); verdict = compliance-ready vs. needs-follow-up; handoff = PDF or Symplr/VerityStream/MD-Staff push. Two thin A-specific surfaces sit on top of the engine: **gap-fill** (propose a value for low-confidence fields) and **smart intake** (residuals → 3–5 targeted provider questions).
- **Consumer B mapping (later):** schema = deal/borrower fields; rubric = the credit judgment function; verdict = fundable/marginal/pass + indicative rate-term band + reasons; handoff = committee packet.

For v1, build **only `extract`**. `decision` and `review` get **interface stubs / type definitions only** — they need rubrics that do not exist yet (Consumer A's compliance checklist is locked at a kickoff scoping call; Consumer B's credit rubric arrives with the spec). Implementing them now is guessing.

---

## 6. Why Python for extraction (and why v1 compares strategies)

The decision is evidence-based (researched 2026-05), not stylistic. It is **not** 1:1 parity — Python is genuinely ahead for document extraction specifically:
- **Parsing / OCR / layout / table ecosystem is Python-only at the frontier** — Docling (IBM), Marker, Unstructured, MinerU, Google langextract — actively benchmarked into 2026. The TypeScript ecosystem (unpdf, LibPDF, pdf-parse, pdfjs-dist) is text-extraction + PDF-manipulation, not ML document understanding.
- **Structured-output maturity:** Python's `instructor` has built-in retry-on-validation-failure (re-prompt the model with the Pydantic validation error). The TS/Zod path does not — you hand-roll it.
- **Eval / notebook loop:** extraction is iterate-on-a-labeled-set work; Jupyter + pandas + eval libraries materially beat a TS fixture suite for tuning accuracy.

**v1 is a pluggable extraction-*strategy* harness, not a single path.** The explicit job of the prototyping phase is to find the right extraction approach *per document type* — so wire several strategies behind one common `extract` interface (all emitting the same `{field: {value, confidence, source}}`) and benchmark them on the labeled fixture set:
- **VLM-direct** — page image(s) → Claude → validated structured output. Strong on clean, variable-layout, context-heavy docs (e.g. CVs).
- **Parse-then-LLM** — an OCR/layout parser (Docling / Marker / Unstructured, or a cloud OCR) produces structured text + table cells, which are fed to Claude. Strong on table-heavy, fixed-layout, high-volume docs (e.g. financial statements); cheaper at scale; the intermediate text is auditable.
- **Hybrid (fusion)** — run the parser *and* pass the page image to the VLM, give the model both modalities, reconcile. Best accuracy on the hard tail (the documented recommendation for financial statements). Bonus: when two arms agree, that is a high-confidence signal; when they disagree, flag for review.
- *(optional)* **hosted parser** (Reducto / LlamaParse / Azure Document Intelligence) as a comparison baseline — subject to the PHI/BAA constraint for credentialing.

This comparison is exactly what the Python ecosystem + notebook loop exist for; locking v1 to a single path would waste the reason Python was chosen. **The discipline:** the strategy arms are off-the-shelf libraries/APIs behind one interface — *not* bespoke parsing infrastructure. Do not fine-tune layout models or build a custom OCR stack until the eval proves a specific need. The production default is chosen **per consumer / per doc-type by evidence from the eval**, and the engine ships with a strategy selector, not a hardcoded path.

**Consequence accepted:** a polyglot monorepo — a second toolchain and deploy target, and a service boundary where there would otherwise be a function call. Contained, because extraction is genuinely service-shaped (heavy, batchable, independently scalable) and is deliberately the only Python piece.

---

## 7. Repository layout

Repo name: **terminus**, at `/Users/si/projects/maxi/terminus`. Bun workspaces (TypeScript) + one Python service alongside.

```
terminus/
├── package.json                  # Bun workspaces: ["packages/*", "apps/*"], "private": true
├── bunfig.toml                   # test config (mirror tokenrip)
├── tsconfig.json                 # base TS config (mirror tokenrip)
├── packages/
│   └── engine/                   # @terminus/engine — ONE TS package, subpath modules
│       ├── src/decision/         #   interface stub now; implement when a real rubric exists
│       ├── src/review/           #   interface stub now; implement when a real rubric exists
│       └── src/extraction-client/#   thin typed HTTP client to the Python extraction service
├── services/
│   └── extraction/               # Python (uv + FastAPI). NOT a Bun workspace member.
│       ├── app/                  #   POST /extract  →  fields + confidence + provenance
│       ├── notebooks/            #   eval / accuracy iteration on labeled fixtures
│       ├── tests/
│       └── pyproject.toml
├── contracts/
│   └── extraction.schema.json    # single source of truth → generates Pydantic + Zod
└── apps/
    ├── aicap-backend/            # TS NestJS — owns credentialing schema + rubric + integrations; calls extraction
    └── aicap-frontend/           # TS TanStack — coordinator dashboard + physician intake flow
        # later: apps/ef-backend, apps/ef-frontend reuse @terminus/engine + the extraction service
```

**Type safety across the language seam:** define the extraction output as one `contracts/extraction.schema.json` and generate **Pydantic** (Python) and **Zod** (TS) from it, so the boundary stays honest without manual drift. Pick a generator during scaffolding (e.g. `datamodel-code-generator` for Pydantic, `json-schema-to-zod` for Zod) and wire it into the build.

---

## 8. Build sequence

1. **Scaffold the monorepo** per §7, mirroring the `tokenrip` conventions (§9).
2. **Now — the Python extraction service, v1: a pluggable extraction-strategy harness. This is the only piece ready to build today; zero-regret because it is useful regardless of which deal closes, and its core job (comparing extraction approaches on real docs) is exactly the exploration both deals need.**
   - Define one `extract` interface and implement **at least two strategy arms** behind it — **VLM-direct** (Claude vision → `instructor`/Pydantic) and **parse-then-LLM** (Docling/Marker or cloud OCR → Claude) — plus **hybrid (fusion)** as a first-class third. All emit the same `{field: {value, confidence, source}}` + `unresolved[]`, tagged with the strategy that produced them. Provenance = document / page / span.
   - Build the **labeled eval set** and run *every* strategy through it: per-field accuracy, confidence calibration, provenance correctness, latency, cost/page, and where each one breaks. **The eval harness plus the comparison results are the real deliverable** — they decide the production default per consumer / per doc-type.
   - Prototype against documents already available: **(a)** a synthetic credentialing fixture set (CVs, licenses, DEA, certs), **(b)** the ~7 real equipment-finance deal memos — *local only, real PII, never sent to any third-party service.* Two document families × multiple strategies is how the right default per doc-type is discovered empirically, not guessed.
   - Write `contracts/extraction.schema.json`; generate the Pydantic models and the Zod client types.
   - **Do not** implement `decision` or `review` — stubs/types only.
3. **When Consumer A signs (the ~7-week build):** drop in the credentialing extraction schema → Week-1 "autofill on real samples" (the riskiest deliverable, de-risked because extraction already exists). Then, following the engagement timeline: compliance review (`decision` + the A rubric) → gap-fill → smart intake → operator dashboard (`review`).
4. **When Consumer B's spec/rubric arrives:** plug the credit rubric into `evaluate`; reuse extraction (on deal documents) and review. **This is the moment to perform the genericize refactor** — lift the Consumer-A-shaped modules to deal-agnostic interfaces, now validated by a real second shape.

---

## 9. Conventions to mirror from `/Users/si/projects/maxi/tokenrip`

The reference repo is a working Bun + TypeScript monorepo. **Inspect these files to copy its idioms exactly:**
- `package.json` — root workspace config (`"workspaces": ["packages/*", "apps/*"]`, `"private": true`, test scripts).
- `bunfig.toml` — Bun test config (`[test]` root, preload).
- `tsconfig.json` — base compiler options.
- `packages/cli/package.json` — the **publishable-package pattern**: scoped name (`@tokenrip/cli` → use `@terminus/engine`), `"type": "module"`, `tsc` build to `dist` (ESM + CJS via a second `tsconfig.cjs.json`), `exports` map, `files` allowlist. Replicate this for `packages/engine`.
- `apps/backend/` — the **NestJS backend pattern**: `nest-cli.json`, `nest build --builder swc`, MikroORM (`@mikro-orm/core`) with a `migrations/` dir, `tsconfig.build.json`. Replicate for `apps/aicap-backend`.
- `apps/frontend/` — the **TanStack Router** frontend pattern. Replicate for `apps/aicap-frontend`.
- `build.sh`, `ecosystem.config.sample.cjs` — build orchestration and PM2 process config; adapt for terminus (including running the Python service as a managed process).

**Stack summary to replicate:** Bun (runtime + package manager + test runner — *not* npm/pnpm), TypeScript throughout the TS side, NestJS for backends, TanStack for frontends, MikroORM where a DB is needed.

**The Python side has no precedent in tokenrip — establish it fresh:** `uv` for environment/dependencies, **FastAPI**, **Pydantic v2**, **`instructor`** (structured output with retry), `pytest`, `ruff`, and Jupyter for the eval notebooks.

---

## 10. Guardrails / risks (do not skip)

- **Genericize trigger = two real rubrics in hand**, not "this feels reusable." Implementing `decision`/`review` before a real rubric exists is the central trap.
- **v1 compares strategies; it does not build bespoke parsing.** Wire off-the-shelf extraction arms (VLM-direct, parse-then-LLM, hybrid, optionally a hosted parser) behind one interface and let the eval pick the production default per consumer / doc-type. Do *not* fine-tune layout models or build a custom OCR stack until the eval proves a specific need.
- **Human-in-the-loop is mandatory.** LLM extraction produces plausible-but-wrong output; the credentialing workflow commits to "AI prepares, people decide." Confidence + provenance + operator approve/override/defer is non-negotiable, and nothing auto-submits.
- **Code-monorepo ≠ data-monorepo.** Each app deploys as its own isolated service with its own encrypted, per-customer data store. **PHI:** self-hosted parsing keeps documents in-infrastructure; Claude-direct needs an Anthropic BAA; any third-party parser needs its own BAA. Settle the BAA before real provider documents are processed.
- **Real PII fixtures stay local.** The equipment-finance deal memos contain real personal financial information — they are for local prototyping only and must never be sent to any third-party service or committed to the repo.
- **Build past extraction is gated on a real customer pull** (a signature / a delivered spec). Extraction is the only safe pre-signature work. Do not let "I built extraction" expand into speculatively building the whole engine.

---

## 11. Verification

- **Extraction:** labeled fixture set; per-field accuracy/precision; confidence calibration; provenance correctness — notebook-driven. The Consumer-A Week-1 acceptance test is literally "autofills a real anonymized application correctly, with confidence and provenance."
- **Decision (once a rubric exists):** golden input→verdict test cases against the encoded rubric.
- **End-to-end (once apps exist):** a sample application flows submission → autofill → compliance flags → operator review → compliance-ready output with full audit trail.

---

## 12. Open items to settle during scaffolding

- Final package scope confirmed as `@terminus/*` (`@terminus/engine`).
- Backend stack: mirror tokenrip's NestJS (default, zero learning curve) vs. a lighter Bun/Hono server for a fresh standalone. Default: mirror.
- Confirm the Anthropic BAA path for PHI before any real provider documents are processed.
- Choose and wire the JSON-Schema → Pydantic and → Zod generators into the build.

---

*Origin: distilled from a 2026-05-30 design session covering two live deals (healthcare credentialing + equipment-finance underwriting). This document is intended to stand alone; it requires no other files to act on.*
