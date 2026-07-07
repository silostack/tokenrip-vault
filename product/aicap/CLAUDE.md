# AICAP — Healthcare Credentialing Validation MVP

> **AICAP** (AI Credentialing Augmentation and Privileging) is a stealth-stage healthcare startup building pre-intake intelligence for medical-staff credentialing. Founder **Stephanie Williamson** — CPCS-certified, 20+ years in hospital credentialing — is a buyer-turned-founder building the exact product she'd have bought. Tokenrip is the **forward-deployed engineer** on her build: we sell the solution and build the substrate behind it.

> **This is a live paid engagement, not a speculative vertical.** The signed artifact is the **[[aicap-validation-mvp-sow-2026-06-22|Validation MVP SOW]]** — a ~7-week, $11K-net AI-assisted application-completion workflow for healthcare credentialing. Kickoff is imminent (as of 2026-07-01).

## What AICAP is (the pain)

When a hospital hires a physician, the physician must complete a credentialing application before they can see patients — a regulatory-heavy (Joint Commission / CMS / NCQA), 4–6 week manual back-and-forth where MSPs review apps and email physicians for clarification. Each day a physician sits un-credentialed is un-billable: **~$22K/day** in lost revenue per applicant at Vanderbilt-scale, $8–40K/day for specialists. AICAP compresses the **application-completion half** — the step that doesn't exist as software at most hospitals.

## What we're building (the Validation MVP)

An AI-assisted workflow that takes a provider from the start of an application to a complete, credentialing-ready submission in one guided pass, producing two PDFs (completed application + audit trail). Five provider-facing surfaces: **(1)** autofill from CV + government ID, **(2)** context-aware field expansion, **(3)** automated compliance review against AICAP's checklist, **(4)** provider review/confirm, **(5)** guided intake for residual unknowns. Plus a minimal coordinator admin view. Built on **de-identified data only** (no PHI / no BAA blocker); integration into hospital credentialing software is a **configurable seam only** (out of scope). Full scope: the SOW.

## Current status (2026-07-01)

**Phase 0 (foundation + de-risk): complete.** The self-contained TypeScript stack (`@aicap/core` on Zod + Mastra; NestJS backend; TanStack frontend) is built, and both load-bearing risks — **vision extraction** and **suspend/resume on Postgres** — are retired with live evidence. **Weeks 1–7 (the product flows) remain, hard-gated on AICAP's kickoff inputs** (compliance checklist + baseline config + guided-question content + de-identified samples). Week 1 = autofill live.

## Key docs

| Doc | What |
|---|---|
| **[[aicap-project-tracker]]** | **The live PM hub** — status at a glance, next steps, milestone tracker, the input critical-path, open actions, blockers, decisions log, project log. Start here to see where the project *is*. |
| **[[aicap-project-notes]]** | **Findings + items to raise with Stephanie** — the running notebook (distinct from the tracker's execution state). |
| **[[knowledge/README\|knowledge/]]** | **Credentialing knowledge base** (Week-1 extraction from the sample forms + CVs) — field-dictionary + rules-catalog (`.md`/`.yaml`), source-map & nuance cases, and the field-by-field walkthrough agenda. Feeds the repo architecture session. |
| `data/` | The source samples — `application-samples/` (×3 platforms) + `cv-samples/` (×4 specialties). |
| **[[aicap-validation-mvp-sow-2026-06-22]]** | **The signed SOW** — authoritative scope, five surfaces, deliverables, timeline, cost, ownership, handoff, acceptance criteria. Everything else defers to this. |
| [[aicap-project-reference-sheet]] | The plain-language project overview — the problem, the wedge, the architecture, the players. Start here for context. |
| `deliverables/` | [[aicap-integration-discovery-deliverable-2026-06-06]] — the delivered paid feasibility study (integration into Cactus/MD-Staff/VerityStream: plausible but hospital-gated; value is the route-independent completion engine). |
| `research/` | [[aicap-integration-feasibility-findings-2026-06-02]] (internal working findings) · [[aicap-credentialing-integration-research-2026-06-02]] (source reference; Cactus import spec §2d) · [[aicap-path-d-and-credsimple-analysis-2026-06-02]] (CAQH "Path D" + CredSimple/Andros intel) · [[aicap-competitive-landscape-2026-06-17]] (client-safe: where AI sits in credentialing today) |
| `engineering/` | [[aicap-integration-discovery-roadmap-2026-06-05]] — the map over the research cluster; integration paths, the "completeness-to-spec above the channel layer" positioning frame. |

## Boundary: what lives where

- **Here (`product/aicap/`)** → *what we're building* — the SOW + project reference at top level; research under `research/`; the delivered client feasibility study under `deliverables/`; integration/engineering analysis under `engineering/`.
- **The executable build plan lives in the AICAP repo, not the vault** — `~/projects/maxi/aicap/docs/aicap-mvp-gameplan.md` (authoritative status + week-by-week build plan, Phase 0 → Weeks 1–7) and `aicap-mvp-buildlog.md` (append-only execution record). AICAP graduated to its own repo 2026-06-29.
- **Deal / relationship / call history** → [[bd/calls/contacts/stephanie-williamson]] (contact doc, open commitments, running intelligence) + `bd/calls/transcripts/` + `bd/calls/notes/`.
- **Kickoff meeting prep** → `active/aicap-kickoff-gameplan-2026-07-01.md`.
