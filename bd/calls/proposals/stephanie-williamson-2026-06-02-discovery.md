---
contact: Stephanie Williamson
company: AICAP Access
date: 2026-06-02
type: discovery proposal
status: ready-to-send
owner: Simon Pettibone
pairs_with: ../notes/stephanie-williamson-2026-05-30.md
plan: ~/.claude/plans/quirky-bouncing-puddle.md
---

# AICAP Access — Legacy System Integration Discovery

**Prepared for:** Stephanie Williamson, AICAP Access
**Prepared by:** Simon Pettibone, Tokenrip
**Engagement:** Integration feasibility study (fixed scope)
**Fee:** $1,000 — credited in full toward the build if AICAP proceeds
**Timeline:** Written summary within ~5 business days; work already underway
**Structure:** Billed against our existing Upwork contract

---

## Purpose

Determine whether AICAP's completed application data can flow into the three credentialing platforms hospitals run — Symplr, MD-Staff, and VerityStream CredentialStream — and, where it can, by what method and under what constraints. AICAP comes out with a clear per-system verdict: enough to choose an integration path and know what it can credibly sell into a hospital.

## What the study answers

Following AICAP's discovery questions directly:

1. Can application data collected by AICAP be transferred into each system?
2. What methods are available — API, import, file exchange, or another supported mechanism?
3. Can externally-supplied data run through the platform's normal workflow? That is, does a transfer open and drive the live case and trigger verification, or only create a record someone still has to open? This is the distinction that decides whether an integration is worth building.
4. What authentication, attestation, audit, and governance requirements affect integration?
5. Which of AICAP's three paths is real per system: (A) direct API submission, (B) a hospital-IT bridge, or (C) an overlay over the existing app?

## Deliverable

A written summary covering:

- What appears possible, per system.
- What appears impossible, per system.
- Major risks and constraints, including access, governance, and the record-versus-workflow distinction.
- Available integration options: each of AICAP's three paths assessed per system, with a recommended path.
- Recommended next steps, turned into a concrete build scope and a firm quote for the integration-ready MVP.

## Method, and what it can establish

The study draws on vendor documentation, AICAP's Symplr exploration materials, and live screen-shares of any system AICAP can access.

One honest note on scope: these vendors gate production API access behind a partner or customer agreement. So the study establishes what the documentation and AICAP's access confirm is possible, and pinpoints what would need vendor onboarding to validate live. AICAP gets a definitive per-system verdict and a recommended path, not a promise that a specific write works before we've been granted the access to test it. Where a live test is the right next move, the study scopes it.

## Timeline

Written summary within about 5 business days. Work is already underway against the public vendor documentation; AICAP's materials — the Symplr brain-dump and screenshots, and any prior integration or install docs — fold in to sharpen the findings as they arrive.

## Investment

$1,000 for the study, credited in full toward the build if AICAP proceeds. So if this leads to the build, the study costs nothing net. Billed against our existing Upwork contract.

## After the study

The feasibility answer determines what the MVP actually is. So the recommended-next-steps section turns the findings into a concrete build scope and a firm quote for the integration-ready pipeline. The moment AICAP has its answer, it also has a costed path to building it. No commitment required then; the study stands on its own.

---

*Materials shared for this study are treated as confidential and used only to assess integration feasibility for AICAP.*

---

## Cover message (Upwork)

Hi Stephanie — here's the scope, timeline, and price for the integration discovery.

A feasibility study across Symplr, MD-Staff, and VerityStream: $1,000, written summary within about 5 business days, and I credit the full $1,000 toward the build if you decide to move forward, so if this leads to the build it costs you nothing net. Billed against our existing contract, and I've already started on the public documentation.

Two things will sharpen it whenever you get a chance: the brain-dump and screenshots from your Symplr/AI session, and any prior integration or install docs you have. They let me check what I'm finding in the docs against what you've actually got access to.

One thing I want to be straight about, and it's in the write-up: all three vendors gate live API access behind a partner agreement. So the study tells you definitively what's possible from the documentation and your access, and pinpoints exactly what would need vendor onboarding to test live. Either way, you get a clear per-system verdict and a recommended path.
