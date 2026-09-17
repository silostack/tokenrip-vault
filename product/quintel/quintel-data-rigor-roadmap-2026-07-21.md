---
title: "Quintel Data Rigor — Measurement Gaps, Low-Hanging Fruit, and Sequencing"
status: active
owner: Simon
type: data-strategy / build-input
product: Quintel
created: 2026-07-21
audience: Simon (product/data improvement sessions)
source: >
  Opened by the "data guy vs. engineering guy" question (post-Martin Roth call);
  current-state claims verified directly against the quintel codebase 2026-07-21
  (file:line citations throughout). Companion to the signal-portfolio doc.
related:
  - product/quintel/quintel-data-strategy-signal-portfolio-2026-07-13.md
  - product/quintel/quintel-customer-data-first-prd-2026-06-29.md
  - bd/calls/contacts/martin-roth.md
  - active/quintel-fable-dossier-2026-07-16.md
---

# Quintel Data Rigor — Measurement Gaps, Low-Hanging Fruit, and Sequencing

> **Purpose.** The signal-portfolio doc answered *which data and why*. This doc answers the question that separates a data-engineering approach from a product-engineering approach: **is the pipeline a measured statistical system or a trusted one?** Verified answer as of 2026-07-21: Quintel's *operational* health is well instrumented; its *statistical* health — resolution accuracy, coverage, signal lead time, calibration — is unmeasured. This memo maps the gaps, ranks the fixes, and sequences them into a now / next / later roadmap that respects the 90-day sprint's build cap.

---

## 1. Bottom line up front

1. **The differentiator is not at risk; the evidence for it is.** Quintel's edge is the reasoning layer — a thing classic data teams under-build. But every claim that layer makes (right entity, right signal, right timing) is currently unvalidated. The fix is measurement, not re-architecture.
2. **One irreversible loss is happening daily and costs almost nothing to stop: raw source payloads are discarded at ingest.** Every day of operation without a raw landing layer is history that can never be re-extracted when extraction logic improves. This is the single "do it this week" engineering item (§4, F1).
3. **The highest-leverage analysis is the UCC backtest** — using the ~107k-filing CO/CT/FL snapshot as an *outcomes dataset* to test whether leading signals actually precede financing events. It is a bounded analysis (no product build), it validates or falsifies the sourcing-first thesis before more of it is built, and it manufactures the missing sales artifact: a defensible hit-rate number for the "what's your hit rate?" question (asked three times by a real buyer archetype).
4. **Entity resolution — self-identified as "the real product and the real constraint" — has zero ground-truth measurement.** Confidence scores are stored but never validated. A ~200-pair gold set and a precision/recall harness in CI is roughly a day of labeling and closes the gap.
5. **Label capture is 80% built and 0% used.** Saves/dismisses persist; `dismissReason` is deliberately inert; nothing consumes any of it for calibration. The flywheel needs a consumer, not new plumbing.
6. **Sequencing rule for everything here:** during the sprint, only Phase 0 items (analyses + one small write path) are in scope. Phase 1 waits for the ~Aug 25 checkpoint; Phase 2 is post-first-customer. Measurement work is uniquely sprint-compatible because its outputs are *sales artifacts*, not features.

---

## 2. Verified current state (fact base, 2026-07-21)

Checked directly against the repo, not inferred from docs. Status legend: ✅ exists · ⚠️ partial · ❌ absent.

| Capability | Status | Evidence |
|---|---|---|
| Operational observability (per-run ledger, per-stage counts, per-connector freshness, provider health, LLM usage) | ✅ Strong | `activity_log` + `pipeline_run` + `source_state` tables; admin surface `observability.controller.ts`; `pipeline_run` explicitly built to distinguish "quiet market" from "broken pipeline" |
| Raw source-payload persistence / re-extraction replay | ❌ | Connector seam discards `RawItem.payload` after `normalize()` (`connector.ts:20-56`); the `signal.raw` jsonb is domain residue, **not** the source record (`signal.entity.ts:8-9`); no landing table exists. Article text for LLM lanes (Exa, RSS, CourtListener) also not stored |
| Re-scoring / re-resolution replay from stored Signals | ⚠️ Possible | Typed columns + `raw` residue suffice to re-run the deterministic ladder; only re-*extraction* is lost |
| Entity resolution mechanism | ✅ Deterministic + fuzzy | Domain-equality → exact-name → token-set/Jaro-Winkler blend with geo/NAICS modifiers, 0.85/0.92 thresholds, ambiguity margin (`de-engine/src/resolve/match.ts:98-151`). Pure, no LLM |
| Resolution accuracy measurement | ❌ | `resolutionConfidence` stored per signal (`resolve-stage.service.ts:84`) but never validated; tests are ~a dozen synthetic unit assertions; **no labeled match set, no precision/recall harness** |
| UCC data | ⚠️ Static, thin | **Three** states — CO 17.9k / CT 11.3k / FL 78.4k rows (~107.5k), one-time boot loader (`ucc-loader.service.ts`). Has filing date, debtor, secured party, lender class, renewal-window fields. **No collateral text, no amounts, no UCC-3/terminations** |
| Qualification calibration | ⚠️ One-off | `planning/signal-qualification/labels*.jsonl` — 30 companies, n=19 graded (11 human + AI silver), self-flagged "not ground truth." A study, not a harness — not re-runnable against the live rubric in CI |
| Label capture from product usage | ⚠️ Plumbing only | `prospect` table stores saved/dismissed + timestamps; `dismissReason` enum exists but deliberately null ("flywheel food," `prospect.entity.ts:40-41`); `feedback` is a per-account suppress overlay, not a label store; **no consumer** turns any of it into calibration data |
| Coverage measurement (share of real EF deals visible) | ❌ | Nothing computes recall against any ground-truth universe |
| Signal lead-time measurement (does "leading" actually lead?) | ❌ | The temporal-axis claim (portfolio doc §3) has never been tested empirically |

**The pattern in one line:** everything an *engineer* needs to know the system is running exists; almost nothing a *data scientist* needs to know the system is *right* exists. That is precisely the difference between Simon's build and what a Filmore-style "data guy" co-founder would have built — and it is closable cheaply, because the hard part (clean architecture, provenance discipline, an observability spine to hang metrics on) is already done.

---

## 3. Why measurement gaps are strategy gaps, not hygiene

Four ways an unmeasured pipeline bites commercially, each mapped to a live vault fact:

- **Silent resolution errors poison the moat.** A false merge attaches the wrong evidence to a company (a wrong "why" in front of a customer — the PRD's own #1 risk is shallow/wrong annotation); a false split hides the multi-signal convergence the qualifier depends on. Neither throws an error. Without ground truth, degradation is invisible until a demo goes wrong in front of a buyer.
- **The hit-rate question is currently unwinnable by choice, not necessity.** Mike (36th Street) asked three times; the mounted-BDO frame *reframes* the question, but a backtested "X% of last year's CO/CT/FL fundings were visible in our leading signals a median of N weeks early" *answers* it — without needing a single customer. Measurement output = sales collateral.
- **The sourcing-first reframe (2026-07-14) rests on an untested empirical claim.** "Leading signals fire before the deal" is the load-bearing assumption of the entire pivot — *inferred, never confirmed* (CLAUDE.md check #1). The cheapest disconfirming test is imminent and self-serve (check #2): the outcomes data to run it is already sitting in `config/ucc/`.
- **Calibration at n=19 is a vibe wearing a number.** The 0.98 AUC will not survive contact with a fourth state or a new sector mix, and there is no harness to notice when it stops holding.

---

## 4. Phase 0 — low-hanging fruit (sprint-compatible: analyses + one tiny write path)

Ranked. Items F2–F5 are *analysis/labeling jobs*, not product builds — they fit the sprint doctrine because their outputs arm the sales motion. F1 is the one true build item, justified because the cost of delay is irreversible.

**F1. Start persisting raw payloads — this week, ~half a day.**
Add a landing write at the connector seam: raw `RawItem.payload` (and fetched article text for the LLM lanes) into a `signal_raw` table or object storage, keyed to the resulting signal's natural key, before `normalize()` runs. No reads, no product surface, no migration of history — just stop the bleeding. Every improvement to extraction (and the LLM lanes *will* improve) is worthless against the past until this exists. This is the classic bronze-layer move; formalizing bronze/silver/gold can wait (§6), but capture cannot.

**F2. The UCC backtest — the flagship analysis.**
*Design:* treat every UCC-1 in the CO/CT/FL snapshot as a confirmed financing event at `filing_date`. Retrospectively pull leading-signal archives for the same debtors/geography — USASpending awards (fully historical via API, national coverage), state business formations if cheaply obtainable, FMCSA authority grants for trucking-classifiable debtors — resolve them against the debtor names using the *existing* `matchEntity` ladder, and measure: (a) **hit rate** — % of filings preceded by ≥1 leading signal; (b) **lead-time distribution** — median/p25/p75 days from signal to filing, per signal type; (c) **which signals actually lead** (portfolio doc §7's open question, answered with data).
*Known constraints, stated up front:* NYC-permits coverage doesn't overlap the three UCC states, so permits sit out of v1 (or: pull one state's permit archive to include them); resolution itself is unmeasured (F3 below hardens this — run F3's gold-set pass on a sample of backtest matches so the headline number carries a stated match-precision caveat); the snapshot's `ripe_date` framing means it skews toward filings old enough to have renewal windows — check date distribution before claiming recency.
*Triple payoff:* thesis validation/falsification pre-build · the hit-rate sales artifact · empirical re-ranking of which J1 feeds deserve build effort.

**F3. Resolution gold set + precision/recall harness — ~1 day of labeling.**
Sample ~200 (signal, matched-company) pairs across confidence bands and sources — deliberately over-sampling the fuzzy band (0.85–0.92), where the errors live. Hand-label match/no-match (a Stauss co-build session is a free labeling engine for EF-name judgment calls). Compute precision/recall per band and per source; freeze the set as a CI fixture so any change to `match.ts` reports its accuracy delta. This converts the stored-but-meaningless `resolutionConfidence` into a validated instrument — and it's a prerequisite for trusting F2's numbers.

**F4. Coverage baseline — falls out of F2 nearly free.**
Invert the backtest: of recent-period UCC filings in the three states, what % of debtors exist in the world model at all, and what % had *any* signal? This is the recall number that distinguishes "quiet market" from "thin coverage" — the same blind-spot class the 07-11 review fixed operationally, now closed statistically. Also produces the honest denominator for any coverage claim made in sales.

**F5. Label-harvest export — a script, not a feature.**
Export accumulated saves/dismisses (+ Stauss-session verdicts, + Empire's redacted-deal-run outcomes if revivable) into the `labels.jsonl` format and re-run the existing `calibrate.ts` against the *shipped* rubric. Goal: push n=19 toward n=100+ and learn whether v0.3's numbers hold on usage-derived labels. Zero product surface. (Turning on the `dismissReason` UI is Phase 1 — it touches the product and violates the sprint cap.)

**F6. Freshness-SLA table — one page, one hour.**
Per source: required latency for its job (J1 feeds near-real-time; J3 firmographics monthly — portfolio doc §8.11) vs. actual polling cadence and observed `lastRunAt` gaps from `source_state`. Instantly shows which "leading" feeds are being operated into coincident ones. Doc-only; wiring alerts is Phase 1.

---

## 5. Phase 1 — post-checkpoint (~Sept, after ~Aug 25 verdict): make measurement continuous

Phase 0 produces snapshots; Phase 1 makes them standing instruments. Gate: only if the sprint verdict keeps Quintel alive — every item below compounds on Phase 0 rather than replacing it.

1. **Backtest → standing eval harness.** Re-runnable on every rubric/resolution change and on each new state's data; publishes hit-rate + lead-time as versioned metrics. The eval becomes the regression test for the *product thesis*, not just the code.
2. **Close the label flywheel.** Turn on `dismissReason` capture (the friction-ladder's dimension-chip tier); build the consumer that folds saves/dismisses/reasons into periodic rubric recalibration. This is also the honest v1 of "the system learns your book" — measured, not vibed.
3. **Resolution drift monitoring.** Confidence-distribution and method-mix dashboards per source on the existing observability spine; alert on shift. New source onboarding requires a gold-set extension before it ships (the §8.10 governor, operationalized).
4. **UCC upgraded from snapshot to instrument.** Live feed for the covered states; **UCC-3/terminations** (the cleaner re-entry signal — portfolio doc §5b — entirely absent today); **thin** amount/term enrichment only (buy thin, not the dealer-grade collateral feed). Vendor selection is where the Martin thread pays off — his $350k number, vendors, and latency are the open intel asks (`martin-roth.md` Open Threads #2).
5. **Freshness SLAs wired to alerts.** F6's table moves from doc to `source_state`-driven monitoring: a J1 source out of SLA pages; a J3 source doesn't.
6. **Coverage as a per-state gate.** Adopt the Filmore operational lesson (deliberate state-by-state rollout): a state isn't "live" until its coverage number clears a bar. Coverage becomes a launch criterion, not a retrospective.

---

## 6. Phase 2 — post-first-customer: the forward-thinking layer

Architect-now / build-later items. None are v1; all get cheaper if Phase 0/1 decisions anticipate them.

- **Formal bronze/silver/gold separation.** F1's landing table is bronze-by-another-name; once re-extraction is real (LLM lanes re-parsed with better prompts/models), promote it to an explicit raw → normalized → world-model contract with versioned, replayable transforms. The world-model rebuild already inverted toward "the world is the center" — this is the same idea applied to time: *the raw history is the center; every model over it is disposable.* Three re-architectures in six weeks is the argument: the fourth one should be a replay, not a migration.
- **Outcome capture for the Type-2 pool.** The pooled moat (PRD §4A) is only as good as outcome data quality. The CRM pipe should capture *structured* closed-deal metadata (funded date, ticket, term, asset class, win/loss + reason) from customer one — schema now, pool later. Every deal closed before the schema exists is pool data lost, the same irreversibility as F1 one level up.
- **Probabilistic resolution v2 — only when the gold set demands it.** The current ladder is right for today's source count. When sources multiply and F3's harness shows fuzzy-band precision decaying, the successor is blocking + probabilistic matching (Fellegi-Sunter/Splink-style) with an LLM adjudication lane for the ambiguity margin — *scored against the same gold set*, which is why F3 comes first. Do not build this on vibes; build it when a measured number says to.
- **Risk-inversion data path.** External risk evidence (lien-load, judgments, auction disposals) feeding the ranker's boundary profile (portfolio doc §8.1) — the "who NOT to call" product, which the backtest infrastructure (resolved external events joined to outcomes) directly enables.
- **Deterministic-calendar signals.** Section 179 seasonality + regulatory-mandate waves (portfolio doc §8.2–8.3): near-zero data cost, pure modeling, differentiated. Slots in whenever a timing story is needed for sales.
- **Backtest as content.** The hit-rate study, anonymized per state, is programmatic-SEO-grade material ("we analyzed 78,000 Florida UCC filings…") — the filmore.build pattern with actual analysis behind it. A data asset doing marketing labor; costs a write-up, not a build.
- **Measurement as the partnership currency.** If the Filmore shared-base-data conversation ever goes concrete, lead-time and coverage numbers are the negotiation instrument — they price what the shared feed is worth to each side and verify vendor latency claims. The party with measurements sets the terms.

---

## 7. What NOT to do (the data-guy failure mode, named so it stays avoided)

- **No warehouse/lakehouse stack, no dbt/Airflow/Spark migration.** Postgres + the existing run ledger is correct at this scale. The gaps are missing *numbers*, not missing *infrastructure*.
- **No metric dashboards beyond what changes a decision.** Each Phase 0 item exists to answer one named question; a metric nobody acts on is decoration.
- **No pausing the reasoning-layer/product work to "fix data first."** The reasoning layer is the moat and the thing data-first teams under-build (Filmore's architecture terminates in SMS/CRM delivery — no reasoning layer). Measurement runs *beside* product, sized to Phase 0's few days, not instead of it.
- **No fourth re-architecture triggered by this memo.** Every item above bolts onto the current world model. The one structural addition (F1) is a write path.

---

## 8. Open questions

1. **Backtest data acquisition:** cheapest historical source for state business formations in CO/CT/FL — SoS bulk files vs. a reseller? (USASpending and FMCSA archives are straightforwardly pullable.)
2. **UCC snapshot provenance:** what date range do the three CSVs actually span, and is the `ripe_date` selection biased toward older filings? (Determines how current the backtest's headline claim can honestly be.)
3. **Empire's redacted deal file:** if that thread revives at all, the deal file is gold-standard label data — does the "one more ask" get framed around it?
4. **Gold-set labeling with Stauss:** can F3's ~200 pairs be folded into a co-build session (his EF name-recognition is better than ours), given the CoI boundary (public-record matching only — nothing from VFI's book)?
5. **What hit-rate number is *good*?** Before running F2, pre-register the bar: what % visibility / median lead time would make the sourcing thesis "confirmed," and what result would trigger re-weighting toward J2–J4 (timing/qualification/displacement) instead? Deciding after seeing the number is how convergence bias survives measurement.

---

*Companion to the [[quintel-data-strategy-signal-portfolio-2026-07-13|signal portfolio]] (which data, for which job) — this doc covers whether the system over that data can be trusted, and in what order to make it trustworthy. Current-state table (§2) verified against the repo 2026-07-21; re-verify before acting on it after significant pipeline changes.*
