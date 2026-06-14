---
title: Quintel — Engine Build Roadmap to "Completed Bones"
status: active
owner: Simon
type: roadmap
product: Quintel
created: 2026-06-09
related:
  - product/quintel/quintel-intake-design-2026-06-09.md
  - product/quintel/quintel-build-and-gtm-roadmap-2026-06-08.md
build_doc: "terminus → apps/deal-engine/docs/plans/2026-06-09-ef-build-roadmap.md"
---

# Quintel — Engine Build Roadmap to "Completed Bones"

> **What this is:** the durable roadmap from where the build is **now** to **"completed"** — bones, structure, plumbing, and data model in place such that a new broker's deal *shape* and *lender graph* are **config on top, not code**. Covers **both surfaces** (`broker` + `desk`/lender — two sides of one engine). Build rationale: [[quintel-intake-design-2026-06-09]]; GTM motion: [[quintel-build-and-gtm-roadmap-2026-06-08]]. File-level detail lives in the Terminus build doc (frontmatter).

---

## The two decisions that set the destination

| Decision | Choice |
|---|---|
| **Config scope** at "completed" | **Shared deploy + Account entity** — a real multi-tenant foundation (account-scoped storage + config + auth), *not* one-deployment-per-customer and *not* self-serve SaaS. |
| **Moat depth** at "completed" | **Full feedback loop** — outcomes are not just recorded; they re-weight match ranking and calibrate the rubric. |
| **Sequencing** | **Hybrid** — account-scope *insurance* early (cheap, kills the retrofit); feature work *value-first*; full multi-account *deferred* until a 2nd account pulls. |

**"Completed" = end of Phase 4.** Phase 5 (full multi-account activation) is gated on a second customer — its bones are already in, so it's activation, not a rewrite.

---

## Where the build is now

The intake spine is wired **end-to-end on both surfaces**, and more is already config-driven than expected.

| Spine stage | Status |
|---|---|
| `ingest` (bundle / classify / dedup / missing-docs / nondeal / screen) | **REAL** (config-driven per surface) |
| `extract` | **STUB** — fixture-backed; one clean swap point → the extraction engine over HTTP |
| `structure` | **REAL** (broker + desk structurers) |
| `decide` / `screen` / `underwrite` | **REAL** (computes from data; rubric + per-lender credit profiles are config) |
| `match` | **REAL** (data-driven panel; only the ranking *weights* hardcoded) |
| `review` | **STUB** (throws NotImplemented — no recorded audit trail / state machine) |
| `capture` / deal-graph | **PARTIAL** (Outcome table + some rows exist; no response ingestion, no feedback loop) |

**Already config, not code:** scoring rubric, screening gates, required-docs, house credit rubric, per-lender credit profiles, the lender panel (import API).

**Still code — the named "config-on-top" gaps:**
- **Deal *shape* / field-map** hardcoded in the structurers (the extraction keys + structural defaults).
- **Match ranking weights** hardcoded (the panel itself is data).
- **No per-customer config scoping** — single shared config + single password; no `Account` concept.

**Other plumbing gaps:** broker deals are an in-memory overlay (not persisted); `Submission` is in-memory; package share-link is a placeholder; the AgentMail inbound→tray→response round-trip isn't closed.

---

## The phases

Each is independently shippable and leaves the system working.

**P0 · Account-scoping insurance** — add `account_id` through the storage layer + a `default` account; account-scope every query and config load; map login `label` → account. *Cheap now; brutal to retrofit later. No user-visible change.*

**P1 · Real extraction** — swap the fixture stub → the real extraction engine over HTTP (apply our own rubric to the returned fields); **freeze the extraction field contract** that P2's field-map maps against. *Both surfaces process real docs end-to-end; the live-drop becomes genuinely unfakeable.*

**P2 · Config layer** *(the "completed = config" phase)* — make the broker's deal *shape* a **field-map config**, the lender *graph* an **account-scoped panel + match config**, and give broker deals real account-scoped **persistence**. *After this, onboarding a broker = author config + import a panel, not edit code.*

**P3 · Email loop + persistence** — inbound fully live (→ tray), outbound send/reply (package send, stip request), and **reply-to-a-deal → outcome event**; persist `Submission`; publish packages to a stable shareable URL. *The round-trip closes; the moat's input feed opens.*

**P4 · Capture + the full feedback loop** *(← "completed")* — deal lifecycle state machine (proposed → approved / funded / declined), recorded review + audit trail, response-driven outcome ingestion, and the loop itself: **real outcomes re-weight match ranking + calibrate the rubric** (deterministic, not ML). *The deal-graph compounds.*

**P5 · Full multi-account activation** *(deferred — gated on customer #2)* — per-account auth + config-by-record + provisioning. *Bones already in from P0 → activation, not rewrite.*

---

## Watch-outs

- **Substrate-before-pull.** The multi-tenant bones are real engineering with few paying tenants; the hybrid contains it, but keep P1→P2 anchored to a *real first broker's* shape, not a hypothetical one.
- **Calibration scope.** P4's feedback loop is deterministic (outcome-weighted performance + override-driven weight nudges) — not a modeling project.
- **PII boundary (hard).** Real docs never reach committed fixtures or train a third party; committed fixtures stay synthetic.
- **Two surfaces, one engine.** Every phase keeps `broker` and `desk` diverging *only* at rubric + downstream action — never forking the pipeline.

---

*Durable roadmap companion to the intake design + GTM roadmap. Pick a phase → turn it into a bite-sized implementation plan (file-level steps in the Terminus build doc).*
