---
title: "Underwriting Automation Fails — It's a UX Problem"
source: Kin Analytics
url: https://kinanalytics.com/blogs/underwriting-automation-fails-ux-problem
added: 2026-07-01
type: trade-press
---

# Underwriting Automation Fails — It's a UX Problem

## Core argument

Underwriting automation in equipment finance fails not because the models are weak, but because the systems don't let analysts see or trust the reasoning. When a tool's output can't be traced, analysts route around it — building informal "shadow systems" (spreadsheets, side notes) that undermine the consistency the tool was bought to create.

## Key points

- Analysts lose real time to **information fragmentation** — reconstructing a deal picture across disconnected systems. Cited: underwriters spend ~3 hours/day on manual data entry alone.
- **Lack of transparency breeds distrust**, not the other way around: "A system that shows its work gets used. One that does not get worked around."
- Poor information architecture causes **inconsistent decisions** — two analysts can reach different conclusions on identical applications depending on how the system presents the same facts.
- Adoption gap is confidence-driven, not capability-driven: only **45% of EF firms have deployed AI underwriting despite 65% exploring it.**
- The fix isn't a better model — it's restructuring around clarity and traceability: organize information logically, show reasoning, cut administrative friction so analysts can focus on actual risk judgment.

## Quintel tie-in

This is direct outside validation for the PRD's central design bet in [[quintel-customer-data-first-prd-2026-06-29]] §10 — the ranker is explicitly built to be **explainable by design**, not a black box, and every score decomposes into stated reasons. The article's line — "a system that shows its work gets used" — is close to a verbatim restatement of why §4 frames the demo's job as proving *comprehension*, not accuracy: the customer validates the reasoning on sight, rather than being asked to trust an opaque score.

The 45%-deployed-vs-65%-exploring stat is also useful sales ammunition: it's evidence that the market's blocker is trust/UX, not appetite — which is exactly the gap Quintel's reasoning-first Stream is built to close.
