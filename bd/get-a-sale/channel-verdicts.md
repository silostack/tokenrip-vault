# Channel Verdicts

*Living log of channel decisions. Each verdict is data; the thesis (get a sale via forward-deployed-engineer pattern) is unchanged across all of them.*

## Current

| Channel | Status | Set | Owner | Notes |
|---|---|---|---|---|
| **Upwork bidding** | **Primary (P0)** | 2026-05-31 (reversed) | Simon + Alek | Active-demand interception. Sourced Stephanie/AICAP + Alek's booked calls. Funded job posts are painkiller-grade by construction. Re-promoted from maintenance (see Demoted note). |
| **Reddit demand-scout** | Active (P1) | 2026-05-23 | Simon | Discovery + demand-validation. Find stated pain → engage. A few messages in. See [[demand-scout-spec]]. |
| **LinkedIn warm pipeline** | **Underperforming** | 2026-05-31 | Simon | 0 calls booked for Simon. Rebalance toward Upwork or diagnose verticals/bid-copy. Not yet a kill — a flag. |

**Live deals** (full board in [[CLAUDE#Active Opportunities]]): Stephanie/AICAP (🟢 Simon — strongest in log; paid discovery next) · Stauss/VFI (🟡 dating) · Luai (🟡 Alek — stalled).

## Killed

| Channel | Killed | Reason |
|---|---|---|
| **Motion E — audience-led creator recruitment** | 2026-05-18 | 3-4 conversations, all vitamin-grade. A creator pitched paying *her* for a write-up rather than deploying. Architectural test passed but pain test failed. Distinct from "building our own audience" (which is alive as a background compounding layer). Files: `__ARCHIVE/bd-motion-e-audience-led-2026-05-18/`. |
| **LinkedIn cold outreach (insurance)** | 2026-05-18 | Structural — buyers (CIOs, COOs) not active on the platform. Channel never produced a conversation. |
| **Job-req outreach** | 2026-05-23 | All "AI agent" job postings as of May 2026 are AI-coding jobs. No biddable supply for substrate-relevant non-coding work. Periodic monitor only — re-evaluate when supply shifts. Files: `__ARCHIVE/bd-channel-job-req-2026-05-23.md`. |
| **Motion A — firm-direct $25K vertical pilots** | 2026-05-01 | Failed the architectural-requirement test (the pilot scope didn't *require* the substrate). Also structurally hostile to Motion B (vendor substrate) downstream. Files: `__ARCHIVE/bd-motion-a-firm-direct-2026-05-01/`. Vertical-selection / lead-gen / term-sheet still actively used → moved to `bd/reference/`. |

## Demoted

| Channel | Demoted | Reason |
|---|---|---|
| **Upwork bidding** | 2026-05-23 → **REVERSED 2026-05-31** | Demoted on a supply-ceiling read (2-5 biddable/day). **Reversal:** the supply-ceiling read measured *volume* and missed *quality* — funded job posts are painkiller-grade by construction. Upwork went on to source the best deal in the sprint (Stephanie/AICAP) and books calls for Alek. Now **Primary (P0)** — see Current. Archived analysis: `__ARCHIVE/bd-channel-upwork-2026-05-23/`. |

## Read

Three clean kills, one demotion-then-reversal, and the first live deal in five weeks. The discovery sprint is working as designed: it produces verdicts, and verdicts update on new data. The thesis (get a sale) is unchanged; channels are the things being tested. **Lesson from the Upwork reversal:** a verdict set on a *proxy* metric (supply volume) is weaker than one set on *outcome* data (deals produced) — hold proxy-based verdicts loosely and let outcomes overrule them.

## How verdicts get set

A channel earns a kill when:
1. **Structural** — buyers are not on the platform (LinkedIn-insurance); OR
2. **Supply** — there is no biddable supply for the work we do (job-reqs); OR
3. **Pain test failed** — engagements that happen confirm vitamin, not painkiller (Motion E).

A channel earns a demotion when supply exists but is rate-limited below pipeline-motion economics (the 2026-05-23 Upwork call).

A channel earns a **re-promotion** when outcome data overrules an earlier proxy-based verdict — Upwork was demoted on supply *volume* (2-5/day) but produced the best deal in the sprint, so deal *outcomes* overruled the volume read (2026-05-31).
