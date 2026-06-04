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

Determine whether AICAP's completed application data can flow into the three credentialing platforms hospitals run — Symplr, MD-Staff, and VerityStream CredentialStream — and, where it can, by what method and under what constraints. AICAP comes out with a clear per-system verdict: enough to choose an integration path, know what it can credibly sell into a hospital, and put build budget behind a confirmed direction instead of a guess.

## What the study answers

Following AICAP's discovery questions directly:

1. Can application data collected by AICAP be transferred into each system?
2. What methods are available — API, import, file exchange, or another supported mechanism?
3. Can externally-supplied data run through the platform's normal workflow? Does a transfer open and drive the live instance (the case) and trigger verification, or only create a record someone still has to open?
4. What authentication, attestation, audit, and governance requirements affect integration — including who attests for externally-submitted data?
5. Which of AICAP's three paths is real per system: (A) direct API submission, (B) a hospital-IT bridge, or (C) an overlay over the existing app?

## Deliverable

A written summary covering:

- What appears possible, per system.
- What appears impossible, per system.
- Major risks and constraints, including access, governance, attestation, and the record-versus-instance distinction — whether inbound data drives the instance or only creates a record.
- Available integration options: AICAP's three paths (A, B, C) assessed per system, plus a fourth path early review surfaced that AICAP hasn't yet considered. Each gets a recommended path, with a read on what it means for AICAP's sales motion.
- Recommended next steps, turned into a concrete build scope and a firm quote for the integration-ready MVP.

## Method, and what it can establish

The study draws on vendor documentation, AICAP's Symplr exploration materials, and live screen-shares of any system AICAP can access. For each system it inspects the points where external data would enter: the application template, integration settings, import/export tools, API settings, data-mapping tools, workflow-initiation mechanisms, and external-submission capabilities. The surface AICAP flagged is detectable, and it is what the study maps.

One honest note on scope: these vendors gate production API access behind a partner or customer agreement. So the study establishes what the documentation and AICAP's access confirm is possible, and pinpoints what would need vendor onboarding to validate live. AICAP gets a clear per-system verdict and a recommended path, not a promise that a specific write works before the access exists to test it. Where the public documentation dead-ends at that gate, the study doesn't stop there. It includes targeted questions for each vendor and identifies the fastest way past the gate: an access request routed through a hospital that already runs the system, which opens doors an inquiry from us can't. Where a live test is the right next move, the study scopes it.

## Timeline

Written summary within about 5 business days. Work is already underway against the public vendor documentation; AICAP's materials — the Symplr brain-dump and screenshots, and any prior integration or install docs — fold in to sharpen the findings as they arrive.

## Investment

$1,000 for the study, credited in full toward the build. So if AICAP proceeds, the study costs nothing net.

## After the study

The feasibility answer determines what the MVP is. So the moment AICAP has its answer, it also has a costed path to building it, and no obligation to take it. Each engagement is scoped as a clean, self-contained handoff: the study is a complete answer AICAP owns outright, with nothing locking it into the build or into any one provider. That is deliberate. It is what makes a longer working relationship safe to grow into.

---

*Materials shared for this study are treated as confidential and used only to assess integration feasibility for AICAP.*

---

## Cover message (Upwork)

Hi Stephanie — here's the short version on the integration discovery: a feasibility study across Symplr, MD-Staff, and VerityStream for $1,000, written summary in about 5 business days, and I credit the full $1,000 toward the build if you move forward, so it nets to zero if it leads to the build. Billed against our existing contract, and I've already started. Full scope and method are in the write-up.

Whenever you get a chance, the brain-dump and screenshots from your Symplr/AI session, plus any prior integration docs, would sharpen it. One thing I've flagged in there: all three vendors gate live API access, so the study confirms what's possible from the docs and your access, and lays out the fastest way past that gate.
