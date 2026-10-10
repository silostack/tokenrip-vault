---
title: Tokenrip — Vision, Roadmap, and Gap-Analysis Baseline
status: draft v1
created: 2026-06-09
owner: Simon
purpose: Self-contained baseline of the full Tokenrip vision (why-graph canon) + forward-deployed plan + both vertical builds, written to be compared against the actual code (Tokenrip platform + Terminus) to surface gaps.
canonical_sources: pitch/a16z-fused-2026-06-08/deck.md · pitch/a16z-fused-2026-06-08/spine.md · product/quintel/quintel-engine-build-roadmap-2026-06-09.md
code_repos: ~/projects/maxi/tokenrip · ~/projects/maxi/terminus (+ ~/tokenrip-cli, ~/projects/maxi/tokenrip-mcp)
---

# Tokenrip — Vision, Roadmap, and Gap-Analysis Baseline

> **What this document is.** One self-contained statement of (1) the full Tokenrip vision as now pitched, (2) the forward-deployed strategy and the two vertical builds carrying it (Quintel/equipment finance + AICAP/healthcare credentialing), (3) a capability inventory of everything the vision requires, each with its believed current state and a concrete place in the code to verify it, and (4) the build sequencing. Its job is to be set against the **Tokenrip platform code** (`~/projects/maxi/tokenrip`) and the **EF/shared-engine code** (`~/projects/maxi/terminus`) so the gaps between vision and build become explicit and checkable. A fresh session given only this doc and the two repo paths should be able to run the gap analysis.

> **Canon note.** The June 2026 a16z-fused framing (**git for operational work / the why-graph**) is the canonical vision. The earlier mounted-agent framing (imprint/memory/harness, BYO-model, creator wedge) is *not* discarded — its primitives are the substrate architecture the why-graph lives on — but the creator-audience GTM is dead; **forward-deployed verticals are the GTM**, and the why-graph is the destination.

---

## 1. The Vision

### 1.1 The insight

**Coding agents work because code has a memory. Everything else forgets.**

Code is the only domain where the work itself was recorded for twenty years — every change, every review, every *why*: git, PRs, blame. That record is simultaneously the **substrate** coding agents operate in and the **training corpus** they learned from. (This absorbs the "coding agents work because of training data, not git" objection: the training data *is* the recorded substrate — same fact.)

Every other operational domain — finance, healthcare, ops — wants agents that *do the work*, but the work happens in email and silos and is forgotten as it happens. There is nowhere to version it, no one to review it with, and no record of how it reached the answer.

**Whoever gives operational work a memory owns the position GitHub owns for code.**

### 1.2 The category claim

**Tokenrip is git for operational work**: versioning, review, provenance, permissions, outcome capture — live across REST, CLI, and MCP.

The mapping:

| Code world | Tokenrip world |
|---|---|
| commits | artifact versions |
| branches | forking |
| pull requests | review |
| **blame** | **lineage** (load-bearing — sets up the moat) |

The load-bearing transferable primitive is *not* line-level merge/diff (code-specific). It is **versioning, provenance, multi-party review, structured handoff, and the recorded reasoning.**

### 1.3 The moat: the why-graph

**Every decision we touch leaves a record of *why*. No one else captures it.**

- **The why-graph**: what changed and *why*, per deal, per case — git-blame for operational work. It can't be rebuilt from the outside; it records the roads not taken (counterfactual-rich: which lenders were rejected as bad matches and why, why a verification was deferred).
- **Not an audit log**: existing audit logs are siloed per-system, unstructured, single-party, and don't feed the agent. A unified, structured, **agent-readable** why-graph spanning the whole multi-party lifecycle does not exist anywhere — that's the build.
- **It compounds**: recorded reasoning feeds back into scoring — smarter with use, harder to leave. The *outcome* is the label that turns the why-trail into a supervised signal; the *why* is the dense part.

The moat reframe (vs. earlier positioning): the moat is **not** the outcome graph alone (what closed/declined/funded) — it's the **reasoning-flow**. Git's power was never the final state; it's the causal history.

Concretely, in the two verticals:

- An **EF deal** ricochets between broker, dealer, borrower, lender, and committee. Why each lender was matched or rejected, why terms moved, what funded — today lost across three silos. *The broker never learns what funded.*
- A **credentialing case** mutates between provider, verification services, and committee. The result is recorded; the *reason* ("license lapsed because the physician changed states," "deferred pending board recert") lives in email and coordinator notes. *Today the trail lives in email, not a ledger.*

### 1.4 The network claim (claim discipline)

Two networks, kept distinct:

- **Public-commons network** (open source → strangers building on public repos): does **not** transfer to private finance/healthcare. Never claimed.
- **Multi-party-workflow network** (one work item crossing several distinct parties with real system boundaries): real and confirmed in both verticals. Depth accrues per vertical; the network accrues across all of them.

Honest status: today the substrate spans the boundary on one side and hands a package across the other. The cross-party network is **architecture + early evidence, not demonstrated at scale.** Defend as a mechanism.

### 1.5 The end state and business model

**Git is free. The platform on top isn't.** (GitHub sold for $7.5B on top of a free protocol — we're building both.)

- **Now — vertical builds.** Customers pay us to build the agent; each build hardens the substrate.
- **Next — the platform.** Free to publish and collaborate; paid for teams, governance, enterprise.
- **The edge — we don't pay for inference.** Customers bring their own models (BYO); margins expand with scale, and model-price deflation arrives as a free upgrade rather than a margin fight.

Because the *why* is the same primitive everywhere, operational work converges on one substrate — the way every codebase converged on git. Five-to-ten-year shape: the registry and memory layer for the agent economy; agents as persistent economic actors with identity, memory, permissions, reputation, and relationships.

### 1.6 How the mounted-agent vision maps in

The April–May framing remains the **architecture underneath** the why-graph vision:

| Mounted-agent primitive | Status in canon |
|---|---|
| **Imprint / memory / harness separation** — durable cognition + accumulated context live on Tokenrip; any runtime mounts them | Live architecture; this is *how* agents operate on the substrate |
| **Agent identity** (Ed25519, `rip1…` IDs, self-registration) | Live; required for multi-party provenance ("who recorded this why") |
| **Assets/artifacts, collections/tables, threads, inbox, teams, capability-token sharing** | Live substrate primitives the why-graph will be built from |
| **BYO-model economics** | Carried forward intact into the business model (§1.5) |
| **Creator-with-audience wedge, barbell ICP, distribution math** | **Dead** as GTM. Replaced by forward deployment. The primitives it motivated are not dead. |
| **Deliverable rails / escrow (Layer 3), agent-native runtime (Layer 5)** | Deferred; pull-gated (see §5.4) |

---

## 2. The Strategy: Forward-Deployed, One Engine, Two Verticals

### 2.1 The forward-deployed model

We don't sell the substrate cold — we **forge it inside forward-deployed vertical products** (the Palantir Foundry playbook). Customers describe problems, not architectures; we ship the agent; the substrate forms underneath. Domain expertise walks in as **partners, not hires** (a 20-year EF veteran and a credentialing veteran co-build with us).

The anti-consulting answer is **config-not-code**: same primitives across verticals, zero rebuild — extraction, rubric-as-config scoring, operator review, provenance logging. Each new customer is configuration + connectors on a shared spine, so margins climb and verticals are products, not bespoke rebuilds. *This claim is only true to the degree the config layer actually exists in code — see inventory cluster H.*

### 2.2 The shared engine (Terminus)

One reusable engine pattern recurs across both live verticals:

```
documents → structured extraction → rubric/decision → (EF-only: match) → operator review → outcome capture
```

Locked design decisions (from `active/extraction-engine-design-2026-05-30.md`):

1. **Anchor to EF (Consumer B); build to generalize. AICAP is the paid co-consumer.**
2. **It is extraction→decision→review, NOT RAG.** Both verticals encode *policy/judgment* (credit rubric; compliance checklist) that fits in context. Retrieval has one future home — the EF deal-graph — not the shared foundation.
3. **Standalone build; own the whole stack** (a regulated customer can't absorb debugging an unshipped platform's primitives).
4. **Genericize only at two-real-rubrics in hand** (rule of three / YAGNI). `match` is EF-specific — do not abstract it.
5. **Extraction = Python service** (Docling/Marker ecosystem); **decision + review = TypeScript**.
6. **Provenance is mandatory**: every extracted field carries `{value, confidence, source: doc/page/span}`. This is what makes operator review and the audit trail trustworthy — and it is the embryo of the why-graph.
7. **Human-in-the-loop is mandatory, never optional.** Confidence + provenance + approve/override/defer. Nothing auto-submits.

### 2.3 Quintel (equipment finance, broker-first)

**What it is**: deal-intelligence for EF brokers (placement shops, 2–10 people). The value is **pre-qualification + lender-matching**: screen junk, score fund/marginal/pass with an indicative rate-term band and reasons, and rank which of the broker's lenders to send each deal to.

**The engine spine** — six stages, one canonical Deal Object through all:

```
ingest → structure → decide → match → review → capture
```

**The Deal Object** (canonical; `packages/de-schema` in Terminus):

```
DealObject {
  borrower { name, naics, revenue_band, geo }
  asset    { class, specifics, new_used, vintage }
  ask      { amount, purpose, structure_hint }
  source   { per-field: { value, confidence, origin_doc, page, span } }   // provenance
  decision { verdict: fund|marginal|pass, rate_band, term_band,
             reasons[], flags[], confidence }                              // encoded judgment — the recorded why
  match    { candidates: [{lender_id, fit_reason, capacity}], recommended }
  outcome  { stage, lender, priced_rate, approved_rate, funded_amount,
             decline_reason, performance }                                 // the moat field — empty until the loop closes
}
```

**Sell the hands, not the dashboard.** Three consumers of the one Deal Object: the *interface* renders it (read-only dashboard = cheap collateral/funnel); the *hands* act on it (match · route · underwrite-memo · structure-quote · draft-outreach · status-track — the product, the lock-in, the revenue); the *deal-graph* stores it with its outcome (the moat substrate). A read-only dashboard never captures an outcome, so it never builds the deal-graph — the hands are the only layer inside the customer's deal flow.

**Intake design** (the working product's front door): a deal is *born* from a bundle of messy source material (email to `deals@{name}.quintel.ai`, manual upload, later connected inbox) that auto-processes (classify → extract → structure → screen) into a tray (`NEEDS REVIEW / NEEDS INPUT / PROCESSING`); the operator confirms into the live pipeline. The hard problems — bundling/threading, doc classification, missing-docs detection, dedup, non-deal filtering — *are* the product. The same intake pipeline serves the broker surface and a lender desk surface, diverging at exactly two config points (what arrives; what it's screened against).

**GTM**: scripted demo on anonymized deals (hero = Deal Detail: verdict + provenance + match + package) → **live-drop closer** (unseen doc, extracted live — unfakeable, requires real extraction) → paid design-partner pilot (setup fee + monthly + success-fee upside). One commercial prerequisite locked into the first contract: rights to anonymized/aggregated/derived data across customers — cheap now, impossible to retrofit.

**Honest status (deck claim discipline)**: dashboard/collateral layer **deployed**; lenders in active pipeline; the revenue-generating **acting agent is next and unsigned**. No paying EF customer yet. "Deployed" never attaches to the acting agent.

### 2.4 AICAP (healthcare credentialing)

**What it is**: AICAP is a credentialing-services company (never "a hospital" — the hospital is the end-customer's world). **Signed, paying customer; product in build.** The agent's job: **chase verifications** across provider, verifiers, and committee — the application-completion wedge between submission and primary-source verification, which exists as software almost nowhere (it's human coordinators and email).

**Pain (end-customer)**: ~$22K/day lost per stuck applicant (orthopods $15–40K/day); 8–12-week cycles; NCQA tightened the primary-source-verification window to 120 days (July 2025).

**Phase 1 pipeline (five modules)**: CV ingestion (OCR + structured extraction) → inference layer (keyword-triggered field autofill) → deterministic gateway (resolved vs. unresolved against the compliance bar: Joint Commission, CMS, NCQA) → contained AI layer (gap-fill with confidence + source reasoning; operator approves/overrides/defers) → guided question-asking (system-intuited prompts replace the dumb fillable form).

**Three surfaces**: coordinator dashboard (queue, red flags first, AI suggestions with confidence + source, audit trail) · physician intake flow (secure link, upload, mostly-prefilled) · hospital handoff (compliance-ready application with audit trail).

**Operating principle**: *AI prepares, people decide.* Regulated; human-in-the-loop mandatory.

**Critical discovery finding (re-baselines scope)**: the PDF-export / no-integration mode is **dead**. Legacy credentialing systems (Symplr/Cactus, MD-Staff, VerityStream) are instance-based — data must be written *into* the system's instance (direct API, hospital-IT bridge, or CAQH routing as primary fallback) to trigger downstream verification tasks. Integration is mandatory and access runs *through* the hospital.

**Status**: paid discovery in progress ($1K feasibility, ~5 business days; credited toward build); original $12K Phase 1 superseded pending integration verdict; MVP build targeted mid-June 2026. Design-partner pipeline: Harvard Health (closest), Duke, MD Anderson.

### 2.5 Why two verticals (and the velocity claim)

Two *maximally different* verticals are the minimum proof the substrate generalizes — one vertical is a point solution. Same primitives, zero rebuild: extraction, rubric-as-config scoring, operator review, provenance logging. Velocity is the team claim: substrate built solo in six weeks; paying customer two months from founding (both verified 2026-06-09).

### 2.6 Honest status, stated once (the deck's claim-discipline block)

- **Substrate**: built and exposed across REST / CLI / MCP. Run on Tokenrip daily (dogfooding exercises every primitive).
- **Quintel**: dashboard deployed; acting agent next + unsigned; no paying EF customer.
- **AICAP**: signed, paying, in build (discovery phase); the why-loop hasn't closed at scale in either vertical.
- Claim **position + insight + velocity — never a finished moat.**
- **Next milestone (the convergence point)**: *ship the acting agent in both verticals, every decision recorded with its why.*

---

## 3. Architecture Map: What Exists Where

This section uses **as-built vocabulary** so the gap analysis can check claims against actual code structures. Surveyed 2026-06-09.

### 3.1 Tokenrip platform — `~/projects/maxi/tokenrip`

Monorepo (Bun, NestJS + Postgres/MikroORM backend, TanStack Start frontend): `apps/backend`, `apps/frontend`, `apps/blog`, `apps/blog-pipeline`, `apps/intel-engine`, `packages/cli`.

**Shipped primitives** (≈35 REST controllers at `apps/backend/src/api/controller/`; ~101 MCP tools at `apps/backend/src/mcp/tools/`; 46 CLI commands at `packages/cli/src/commands/`):

| Primitive | Notes |
|---|---|
| **Artifacts** | Versioned, stable URLs, three-tier visibility, content negotiation |
| **Tables** | Schema-aware living tables (the "collections" of the vision docs) |
| **Threads + Messages** | Append-only, typed intents (propose/accept/reject/counter/inform/request/confirm), explicit resolutions |
| **Inbox** | Pull-based per-viewer activity feed |
| **Contacts / Teams / Folders** | Identity directory, agent grouping, flat organization |
| **Workspaces** | **Shipped** (vault briefings still say "planned") — owned namespaces, native notes, FTS, role-based access, per-mount memory binding with maturity tiers |
| **Surfaces** | **Shipped** — interactive HTML at `/x/:publicId` with SDK bridge (the "custom interfaces on artifacts" thesis, live) |
| **Agents** | Imprints, mounts, sessions — the mounted-agent model in code |
| **Connections** | Authenticated HTTP proxy for external APIs |
| **Search** | Postgres FTS over artifacts + threads, team-scoped |
| **Publisher** | Approval gate for public listing (pending → approved → rejected) |
| **Capability tokens** | Ed25519-signed scoped sharing; no permission matrices |

**Notably absent from the platform** (vision-relevant): per-field/value-level provenance, a why/reason annotation on versions or decisions, outcome ledger, review/approval workflow beyond publisher gating, webhooks/scheduled-ops/semantic-search/computed-columns (the paid tooling tier), escrow/deliverable rails.

Reference docs in-repo: `OVERVIEW.md`, `docs/architecture/`.

### 3.2 Terminus — `~/projects/maxi/terminus`

Sandbox monorepo mirroring Tokenrip idiom; hosts the **deal-engine** (Quintel) and the **extraction engine**, plus AICAP scaffolds:

| Component | Path | State |
|---|---|---|
| Deal Object + signal schemas | `packages/de-schema/src/` (`deal-object.ts`, `signal.ts`, `intake.ts`, `counterparty.ts`, `cascade-template.ts`) | Real; **per-field provenance `source {tier, origin, verified, link, asOf}` is mandatory** |
| Engine core | `packages/de-engine/src/` — `sources/` (EDGAR, USAspending), `scoring/` (config-driven rubric), `structuring/`, `hands/` (match, underwrite, draft), `assemble/`, `enrich/` | Real-ish; ranking weights hardcoded |
| EF backend | `apps/de-backend/src/api/` — deals, signals, sources, lenders, cascades, structure, admin controllers; `ingest/` (upload, parse, extract, map) | Real pipeline; extraction stubbed |
| EF frontend | `apps/de-frontend/src/` — pipeline/deal-detail operator surface | Real UI |
| Extraction service | `services/extraction/app/` — Python FastAPI, Docling, instructor/Pydantic | Built; the swap-in for the fixture stub |
| Contracts | `contracts/extraction.schema.json` → Pydantic + Zod | The frozen extraction field contract |
| AICAP apps | `apps/aicap-backend/`, `apps/aicap-frontend/` | **Hello-world scaffolds only** |
| Engine packages | `packages/engine/` (deprecated stubs), `packages/ext-engine/` (v2) | Transitional |

Canonical in-repo docs: `docs/deal-engine/SPEC.md`, `docs/extraction-engine/build-brief.md`, `planning-docs/quintel-*.md`.

### 3.3 The intended relationship vs. current reality

**Intended**: the deal-graph **is** Tokenrip substrate; Quintel/AICAP artifacts (dashboards, memos, packages, handoffs) live at stable Tokenrip URLs; vertical outcomes accumulate as substrate density; future verticals repeat the parent-infra + named-entity pattern.

**Current reality (surveyed 2026-06-09)**: **Terminus has zero code-level Tokenrip integration.** No imports of `@tokenrip/cli`, no calls to `api.tokenrip.com`, self-hosted review surfaces (not Tokenrip Surfaces), no artifact publishing. The "powered by Tokenrip" relationship is today an architectural intention and a hosting plan, not code. This is a first-order finding for the gap analysis — see cluster K.

---

## 4. Capability Inventory — the Gap-Analysis Checklist

Each row: what the vision requires · believed current state (docs + code survey, 2026-06-09) · where to verify. **Believed state is a hypothesis to confirm, not a conclusion.**

Status vocabulary: ✅ built · 🟡 partial · 🔲 stub/scaffold · ❌ missing · ❓ unverified.

### A. Memory & versioning (the git-equivalent)

| Capability | Required end-state | Believed state | Verify at |
|---|---|---|---|
| Artifact versioning + stable URLs | Every operational artifact versioned; stable URL always resolves; history accessible (commits-equivalent) | ✅ Tokenrip artifacts | `tokenrip/apps/backend/src/api/controller/` artifact controllers |
| Structured living data (tables/collections) | Agent-writable, schema-aware, human-curated | ✅ Tokenrip tables | tables controller + MCP table tools |
| Workspace memory (organizational context) | Shared working state; memory maturity tiers; mount-scoped | ✅ shipped (docs lag) | workspaces controller; `docs/architecture/` |
| Deal/case persistence (vertical) | Account-scoped Deal Object persistence with lifecycle status (`intake → pipeline → …`) | 🟡 persistence exists; lifecycle state machine missing (P4); account scoping missing (P0) | `terminus/packages/de-schema`, de-backend storage layer |

### B. Provenance & lineage (lineage → blame)

| Capability | Required end-state | Believed state | Verify at |
|---|---|---|---|
| Per-field provenance | Every extracted value carries `{confidence, origin_doc, page, span}`; click-through to source span | ✅ schema-mandatory in Terminus; ❓ end-to-end in UI | `de-schema/src/deal-object.ts` (Source required), `tests/de-schema/deal-object.test.ts`, de-frontend deal detail |
| Artifact lineage (derived-from / produced) | Lineage trees across artifacts — the "blame" story | 🟡 Tokenrip has version history + thread/message refs; **no explicit lineage edges** | artifact + thread entities in backend |
| Cross-system provenance | Provenance survives the handoff between parties (broker → lender; AICAP → hospital) | ❌ not built (P3 publishes packages; provenance-across-boundary undefined) | — |

### C. The why-capture (the moat primitive) — **headline gap candidate**

| Capability | Required end-state | Believed state | Verify at |
|---|---|---|---|
| Recorded reasoning per decision | Every decision carries structured, agent-readable *why* (reasons, flags, confidence, roads-not-taken) | 🟡 EF: `decision.reasons[]` + `match.candidates[].fit_reason` in Deal Object — per-deal, in-vertical | `de-schema/src/deal-object.ts` |
| Why on changes/overrides | Operator override/approve records *why it changed* (git-blame for edits) | ❌ review stage is stub; no override-reason capture | de-engine `hands/`, review controllers |
| **Why-graph as a first-class primitive** | Unified, structured, queryable why-graph **spanning parties and verticals**, feeding the agent — "can't be rebuilt from the outside" | ❌ **does not exist as a primitive anywhere.** Closest ancestors: Deal Object `decision` block (Terminus) + thread intents/resolutions (Tokenrip). Neither spans systems nor feeds scoring | — (this row defines the build) |
| Minimal definition (so the gap is checkable) | A why-record = `{decision_ref, actor (agent id), verdict/change, reasons[], alternatives_rejected[], evidence_refs (provenance), outcome_label (late-bound), timestamps}` — queryable across deals/cases, readable by the agent at decision time | ❌ | — |

### D. Review & approval (multiplayer review = the PR-equivalent)

| Capability | Required end-state | Believed state | Verify at |
|---|---|---|---|
| Operator review surface (EF) | Triage, approve/override/route, provenance-linked, production-grade | 🔲 review stage throws NotImplemented per engine roadmap; demo UI real, actions thin | de-backend review path; de-frontend actions |
| Coordinator dashboard (AICAP) | Queue, red-flags-first, confidence + source on every suggestion, approve/override/defer | 🔲 hello-world scaffold | `terminus/apps/aicap-frontend` |
| Audit trail | Append-only log on every read/write; compliance-exportable | ❌ planned (build phase C / P4), no audit table yet | de-backend entities |
| Human-in-the-loop invariant | Nothing auto-submits, ever (both verticals; regulated) | ❓ by design; verify no auto-submit paths exist | ingest → outbound paths in de-backend |
| Substrate-level review | Tokenrip-native review/approval on artifacts (beyond publisher gating) — the generic PR | ❌ only publisher approval exists | publisher controller |

### E. Outcome capture & the feedback loop ("the why-loop hasn't fired")

| Capability | Required end-state | Believed state | Verify at |
|---|---|---|---|
| Outcome recording | `outcome {stage, lender, rates, funded, decline_reason, performance}` recorded per deal; AICAP analog (completed/verified/accepted) | 🟡 outcome table/enum exists; mostly empty; no AICAP analog | `de-schema` OutcomeStage; de-backend |
| Response ingestion | Lender reply-to-deal → outcome event (email round-trip) | ❌ P3, not built | de-backend ingest/email |
| **The loop itself** | Outcomes re-weight match ranking + calibrate rubric (deterministic first, not ML) | ❌ P4, not built — **this is "the why-loop fires"** | de-engine scoring/match |
| Outcome as supervised label | Why-trail + outcome label = training-grade record (the corpus claim, slide 2) | ❌ downstream of C + E | — |

### F. Multi-party handoff (the cross-party network mechanism)

| Capability | Required end-state | Believed state | Verify at |
|---|---|---|---|
| Package publish at stable URL | Lender-tailored package, shareable link, "can't-open-the-file" pain solved | 🟡 package draft screen designed; publishing target should be Tokenrip artifacts — not wired | de-engine `hands/draft`; (intended) Tokenrip artifact API |
| Email loop (in/out) | Inbound `deals@{account}` live → tray; outbound send/reply (package, stips); reply threads back to deal | 🟡 inbound ingest real per roadmap; outbound ❌ (P3) | de-backend ingest + (missing) outbound |
| AICAP hospital handoff | Write *into* the hospital system's instance (Cactus XML/API, MD-Staff REST, CAQH routing fallback) | ❌ feasibility-study stage; integration mandatory finding | `product/aicap/` (vault); build in own repo `~/projects/maxi/aicap/` |
| Cross-party substrate boundary | Both sides of a handoff eventually *on* the substrate (the network claim) | ❌ one-sided today by design; mechanism only | — |

### G. The acting agents (the products being sold)

| Capability | Required end-state | Believed state | Verify at |
|---|---|---|---|
| EF pre-qualification agent | Pre-qualifies deals across 5+ parties / 3 silos: screen → decide → match → package → route, operator-reviewed | 🟡 decide/screen/match compute from data (rubric config-driven); ranking weights hardcoded; review/route/outbound missing | `de-engine/src/scoring`, `hands/` |
| Credentialing verification-chasing agent | Chases verifications across provider/verifiers/committee; five-module pipeline; three surfaces | 🔲 scaffolds only; extraction service shared; MVP gated on discovery verdict | `apps/aicap-*`; `services/extraction` |
| Agent identity on decisions | Acting agents have Tokenrip identity; their decisions/whys attributable | ❌ vertical agents have no Tokenrip identity (no integration) | — |

### H. Vertical config layer (config-not-code — the anti-consulting proof)

| Capability | Required end-state | Believed state | Verify at |
|---|---|---|---|
| Rubric-as-config | Credit rubric / compliance checklist = config, not code | ✅ EF rubric, screening gates, required-docs, per-lender credit profiles config-driven | de-engine scoring config |
| Deal-shape/field-map config | Broker's deal shape = field-map config (onboarding = author config, not edit code) | ❌ hardcoded in structurers (P2) | de-backend structurers |
| Lender panel + match config | Account-scoped panel; ranking weights configurable | 🟡 panel import real; weights hardcoded (P2) | de-engine match; lenders controller |
| Account scoping / multi-tenancy | `account_id` through storage; per-customer config + sandbox; per-account auth | ❌ single shared config + password; no Account concept (P0 — "cheap now, brutal to retrofit") | de-backend storage/config layer |
| Per-customer data isolation | Code-monorepo ≠ data-monorepo; encrypted per-customer stores; no-train; anonymized-derived-data rights in contract | ❓ deployment posture to verify | infra/deploy configs |

### I. Extraction (the unfakeable layer)

| Capability | Required end-state | Believed state | Verify at |
|---|---|---|---|
| Real extraction end-to-end | Fixture stub swapped for Python service over HTTP; field contract frozen; live-drop genuinely unfakeable | 🟡 service built (Docling + instructor); swap-in status ❓ (P1) | `services/extraction/app/`; de-backend ingest extraction call |
| Strategy pluggability + eval | ≥2 arms (VLM-direct / parse-then-LLM / hybrid); labeled eval set; per-consumer/doc-type default chosen on evidence | ❓ partially; eval harness status unknown | extraction service notebooks/tests |
| Hard-tail documents | Scanned licenses/certs (AICAP), messy bank statements (EF) | ❓ | eval fixtures |
| PHI/PII posture | Self-hosted parsing in-infra; BAA where third parties touch PHI; real-PII fixtures local-only, never committed | ❓ verify no PII in repo, no un-BAA'd third-party calls | repo scan + service config |

### J. Substrate platform & monetization (the paid layer — mostly pull-gated)

| Capability | Required end-state | Believed state | Verify at |
|---|---|---|---|
| Tooling tiers (Pro) | Semantic search, webhook-on-mutation, scheduled ops, computed columns, full audit log | ❌ none built (FTS exists; semantic doesn't) | backend modules |
| Enterprise tier | Custom tool provisioning, inter-agent tool exposure, compliance export, SLA | ❌ | — |
| Composed bundles | e.g., email composed with correspondence table + webhook + dashboard (non-bypassable) | ❌ Connections proxy is the seed | connections controller |
| Builder observability | Imprint usage analytics for builders | ❌ | — |
| Tier gating / billing | Gate fires at capability attempt; billing | ❌ | — |
| Deliverable rails (Layer 3) | Draft→submitted→approved lifecycle; escrow tranches keyed to acceptance | ❌ deferred; capability tokens are the nearest primitive | — |

### K. Tokenrip ↔ vertical integration (the substrate-density claim) — **first-order gap**

| Capability | Required end-state | Believed state | Verify at |
|---|---|---|---|
| Vertical artifacts on Tokenrip | Quintel packages/memos/dashboards + AICAP handoffs published as Tokenrip artifacts at stable URLs | ❌ **zero integration in Terminus code** (no `@tokenrip/cli` import, no API calls) | grep Terminus for `tokenrip` |
| Deal-graph on substrate | Outcome + why records land on Tokenrip primitives (tables/artifacts/threads) as durable substrate density | ❌ deal-graph lives in Terminus Postgres only | — |
| Vertical agents as Tokenrip agents | EF/AICAP acting agents registered with Tokenrip identity; their work visible in workspaces/inbox | ❌ | — |
| Defined integration shape | A decision: *which* Tokenrip primitives the deal-graph maps to (deals → tables? memos → artifacts? handoffs → threads? whys → new primitive?) | ❌ undefined — must be designed before it can be built | this doc, §6 question 3 |

---

## 5. Roadmap Sequencing

### 5.1 Quintel engine — P0–P5 (from `quintel-engine-build-roadmap-2026-06-09.md`)

| Phase | What | Why it's ordered here |
|---|---|---|
| **P0 — Account-scoping insurance** | `account_id` through storage + config; login→account mapping | Cheap now, brutal to retrofit; no user-visible change |
| **P1 — Real extraction** | Swap fixture stub → Python service over HTTP; freeze field contract | Live-drop becomes genuinely unfakeable |
| **P2 — Config layer** (= "completed bones") | Deal shape → field-map config; lender graph → account-scoped panel + match config; real persistence | Onboarding = author config + import panel, not edit code |
| **P3 — Email loop + persistence** | Inbound live → tray; outbound send/reply; reply-to-deal → outcome event; packages to stable URL | Round-trip closes; **moat input opens** |
| **P4 — Capture + feedback loop** | Lifecycle state machine; recorded review + audit trail; outcome ingestion; **outcomes re-weight match + calibrate rubric** | **The why-loop fires; deal-graph compounds** |
| **P5 — Multi-account activation** | Per-account auth + config-by-record + provisioning | Deferred; gated on customer #2; P0 made it activation, not rewrite |

Overlaid build/GTM phases: **A** ingest-deep + thin spine (now — demo bones) → **B** real decide+match (gate: design-partner signature) → **C** full review surface (with first customer) → **D** capture + feedback (as volume builds). Discipline: build past `ingest` is gated on real customer pull.

### 5.2 AICAP

Discovery ($1K feasibility, in progress) → re-baselined Phase 1 scope (integration mandatory; supersedes the $12K PDF-export scope) → MVP build from mid-June (application-completion wedge first — standalone value, no hospital partner needed) → pilot hospital on one of the three systems (authorizing access on its license) → per-hospital completion-to-spec deployments. Genericization trigger for the shared engine: AICAP's compliance checklist = the second real rubric.

### 5.3 Terminus shared engine

Now: **extraction v1 only** (zero-regret; serves both verticals; eval-driven strategy choice). `decision`/`match`/`review` stay stubs until real rubrics exist (broker's credit rubric + lender panel; AICAP's compliance checklist). Genericize at two-real-rubrics — not before.

### 5.4 Tokenrip substrate — pull-gated, with named pull points

The substrate roadmap stays **paused pending a live customer pulling on it**. What constitutes pull, concretely:

| Vertical milestone | What it pulls onto Tokenrip |
|---|---|
| Quintel P3 (packages to stable URL) | First real integration: publish packages as Tokenrip artifacts — the natural first wire |
| Quintel P4 (audit trail, recorded review, outcomes) | Decision: deal-graph/why records on Tokenrip primitives vs. Terminus-local — **the why-graph design point** (inventory C + K) |
| AICAP coordinator dashboard | Review/approval patterns that may generalize into substrate-level review (inventory D) |
| Either vertical's compliance/audit export need | Audit-log substrate capability (also the first Enterprise-tier feature) |
| Customer #2 in either vertical | Multi-account activation (P5) + per-customer provisioning patterns |

### 5.5 The convergence milestone

**Ship the acting agent in both verticals, every decision recorded with its why.** That single sentence requires, per the inventory: C (why-capture) + D (review) + E (outcome loop) + G (the agents) wired through K (on the substrate). It is the point where the pitch's moat stops being a future state.

---

## 6. How to Run the Gap Analysis (instructions for the next session)

**Inputs**: this document + `~/projects/maxi/tokenrip` + `~/projects/maxi/terminus`. Canonical in-repo specs: `terminus/docs/deal-engine/SPEC.md`, `terminus/docs/extraction-engine/build-brief.md`. (`clean-tokenrip` mirrors HEAD; `clean-terminus` lags — use the primaries.)

**Method**: for each inventory row in §4, confirm or correct the believed state against code, then classify:

- **missing** — no code exists
- **stub** — typed/scaffolded, throws or returns fixtures
- **partial** — works but missing load-bearing pieces named in the row
- **built-but-diverged** — exists but doesn't match the vision's shape (note the divergence)
- **built-but-undocumented** — code ahead of docs (known examples: workspaces, surfaces, the 101-tool MCP surface)

**Direction matters**: record vision-ahead-of-code (the expected default: why-graph, why-loop, acting agents, monetization) *and* code-ahead-of-vision separately — the second kind is free positioning material.

**Three questions the analysis must answer beyond the checklist**:
1. **The why-graph build**: given the minimal definition in C, what is the smallest primitive that makes "every decision recorded with its why" true in the EF pipeline — and does it belong in `de-schema` (vertical-local first) or Tokenrip (substrate-first)?
2. **The cheapest true integration**: what is the smallest Terminus→Tokenrip wire that makes "powered by Tokenrip" literally true (likely: publish packages as artifacts at P3)?
3. **Claim-discipline audit**: does any code reality contradict the deck's claims (e.g., "live across REST/CLI/MCP," "same primitives, zero rebuild," "by config, not rebuild") — and which inventory rows must close before the *next* deck can upgrade its claims honestly?

---

*Compiled 2026-06-09 from: `pitch/a16z-fused-2026-06-08/` (deck + spine, canon) · `active/tokenrip-context-briefing.md` · `active/tokenrip-shared-context-v2.md` · `product/tokenrip/` (CLAUDE, mounted-agent-model, positioning, business-model, tool-layer, tokenrip-context) · `product/10x-roadmap.md` · `product/quintel/` (CLAUDE, build+GTM roadmap, engine build roadmap, intake design, demo shape, SPEC) · `active/extraction-engine-design-2026-05-30.md` · `product/aicap/` + `bd/calls/contacts/stephanie-williamson.md` · code survey of both repos.*
