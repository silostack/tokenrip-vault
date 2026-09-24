---
title: flpool — open items and David's feedback
updated: 2026-09-19
status: INTERNAL. David's Slack and email wording stays internal.
---

# flpool — open items and David's feedback

## 1. What David said after batch 1 (2026-09-04 email, 2026-09-05 Slack)

**On process**
- Fridays and the holiday weekend are bad for cold calling. Grading will slip to the week of 2026-09-08.
- He will check every row against **the two CRMs Providence uses** before dialing. That is the customer dedupe we asked Alek for (contact doc commitment #8), now happening on his side. Ask him to return the hits so the suppression table grows.
- He will **add firmographics** (employees, revenue) to the sheet himself. Simon told him our providers do not cover companies this small. Note for us: FMCSA `total_drivers` is on every DOT-anchored row in v4 (428 of 428) and is a free employee proxy for carriers. Ship it in batch 2.
- He will **run fleet-size reports on Providence's existing customers** this weekend. That is Layer-3 book data. Ask for the distribution (funded deals by power units), not just the rule.
- He ran the 50 numbers through his own verification system: "mostly true, a few false positives, not unusual for VOIP." Consistent with our `nonFixedVoip` caveat. His `phone_ok` verdict is still the label.

**Two new box rules (his words, paraphrased)**
1. **More than 7 pieces of equipment and the probability of reaching the right ICP drops dramatically.** At that size headcount passes 15, a CFO-type appears, revenue is $15MM+. Our fleet-size signal used a 2–15 band; his band is 2–7.
2. **Prior borrowing from a captive reduces the probability substantially, more so if repeated.** Named: Komatsu Financial, John Deere Construction & Forestry (and related), Caterpillar Financial, Kubota Credit, Toyota Industries Commercial Finance, Volvo Commercial, Daimler. Reason: subsidised or zero rates, maintenance programs, no prepayment penalty, replacement options. Applies mostly to construction, farming, freight/transportation vendors.

**What the two rules do to batch 1** (computed 2026-09-05 on the shipped 50)

| | Rows |
|---|---:|
| Power units > 7 | 18 of 40 with a unit count |
| Lien with one of his seven captives | 23 of 40 with a lien |
| Flagged by either rule | 35 of 50 |
| Flagged by both | 6 |
| Clean on both | 15 |
| Flagged, by arm | intersection 22 of 30 · ucc_only 7 of 10 · anchor_only 6 of 10 |

The intersection arm requires a lien, and the most common lien in the corpus is a captive lien, so his rule hits the arm we expected to win hardest. **Pre-register before verdicts come back:** if he is right, `anchor_only` out-grades `intersection` on reach and in-market, and the "renewal window" signal is weakest exactly where it fires most (captive liens). If he is wrong, the captive rows grade no worse. Either answer is worth more than the 50% headline.

**Copy.** `copy-draft-touch-emails.md` is what he sent: subject options, five opening options, four closings. It is corporate ("$2 billion ... past two decades"), not the folksy under-40-word copy he described as tested on ~10,000 sends. Treat it as a draft of options, not the tested copy. Ask which variant actually ran and what it did.

## 1b. David's v2 call verdicts (received 2026-09-09, called 09-08)
Source: `out/verdicts/david_v2_2026-09-09.csv` (his xlsx scored into our outcome taxonomy). Headline: 46/50 dialable (1 NIS, 3 mailbox not set up/full), 31/50 human on first pass, ~13 owner/family. Dead 19, voicemail/no-decision 16, maybe-later 5, follow-up 4, existing lead 2. Positives 4 LIEN / 5 NOLIEN: **the lien overlay did not move phone outcomes**. What it did: 3 explicit cash buyers, all NOLIEN; 5 of 7 CRM hits and both active leads were LIEN. 8 of 19 dead were hang-ups at "financing"/"Providence" (6 LIEN, 6 mobile). A_VAC best lane, C worst. Office lines → secretaries; mobiles → owners. cnam_match did not predict reach: stop presenting it as quality. One owner-name miss: Affordable Towing (we had Terry Baggett, SOS shows John Mallory manager) — trace the ladder. David already marks "Email" as next action on 5 rows.
- [ ] Trace the Affordable Towing owner ladder
- [ ] C6: Wilson intervals on the verdict file by segment/lane/line_type
- [ ] Midwest list: FMCSA-only (officer, phone, cell, email, fleet, cargo are federal); no UCC (only FL/CO/CT in prod) → no lien/captive/bank screen, no cash-buyer proxy, no timing hook. Needs David's states. Label as no-overlay arm.
- [x] Ohio 50 (Alek, lender-first on OH UCC: LEAF/Western/Blue Bridge/North Mill/Marlin/TimePayment). All LIEN. 15 out-of-box, 7 unclear, 4 filed <6mo, 5 lapsed, 1 headcount → ~22 clean. Shipped with `fit_flag`, nothing cut. `scripts/c5e_ohio.py`.
- [ ] Agenda sent: `AGENDA_DAVID_2026-09-10.md`. Email infra plan: `EMAIL_INFRA_PLAN_2026-09-09.md`.

## 1d. Entity-first signal search — calibration run (2026-09-10)
Report: `out/SIGNAL_SEARCH_REPORT_2026-09-10.md`. Method: `scripts/c6_signal_search.py` (Exa) + `scripts/c6_report.py`. Ran 3 cohorts (FL v2 50, control 50, OH 50) = 450 searches, ~$3-4. Runbook: `runbook_entity_search.md`.
**Decision-relevant finding:** entity search surfaces real intent (procurement, hiring, grant/capex news) for **construction/excavation/manufacturing** rows, ~0 for **FL vac/septic/tow**. 21 real intent hits total, **16 of them OH** (lender-first, varied). Procurement is the only family that fired, and it fires by company type, not by David's verdict. FL positives (all vac/tow/septic) produced zero intent — their web footprint is own-site + directories + the FDEP roster we already hold.
- [ ] Gate procurement as a rank feature to A_DIRT/yellow-iron/manufacturing lanes only (feeds §6.3).
- [ ] Scrape gov listings first (county septage/permit rosters, JobsOhio-style grant/loan reports, defense contract feeds) — dated, machine-readable, name the company. Newspapers stay lookup-only.
- [ ] Tighten name query before any pool-scale run: city-gate all 2-token generic + bare-person names (19% false positives now, all that class).
- [ ] **Do not run the entity search on the full FL vac/septic pool** (yield ~0); use UCC-native signals there.
- [ ] Re-run `c6_signal_search.py` on David's case-study 50 when it lands — the only cohort that can test winners-vs-dead (§10).

## 1e. Signal-feed discovery — E9 first run (2026-09-10)
Report: `out/SIGNAL_FEEDS_REPORT_2026-09-10.md`. Code: `scripts/feeds_join.py` (join+score), `scripts/feeds_calibration.py` (case-study 50, ready). Raw: `data/work/feeds/raw/`. Runbook: `runbook_signal_feeds.md`. Four feeds fully pulled/joined/scored: F1 FL procurement (Orange Co, 116 rows), F2 FL DOT lettings (FDOT, 137), F3 FL septic (DOH OSTDS 67-county Caspio, 65), F6 OH grants (JobsOhio, 32).
**Decision-relevant finding:** feeds join + date near-perfectly but are a **timing overlay on the pool, not a discovery engine** — 74/87, 119/127, 16/16 of resolved already in `FL_POOL_v1`; only 2/18/0 UCC-positive (David's EF-borrowing gate). DOT lettings ~96% large GCs (4 of 127 fleet-verified 2–7). Feed-first does NOT replace pool-first for yellow iron.
- [ ] Build the **FDOT letting scraper** (F2 FL) first — lowest effort, one URL/letting, one system = all FL DOT. As a timing flag on pool rows, not a sourcing arm.
- [ ] Build the **FL DOH OSTDS scraper** (F3 FL) second — one Caspio app = 67 counties, David's best lane, corrects pool `no_sunbiz_match` gaps. Moderate effort (Caspio POST).
- [ ] Wire both as a per-row "bidding/permitting now + date" rank column on the pool (§6.4, no composite).
- [ ] **Park the procurement scraper** (F1) — best discovery (11 new, 17 fleet-in-box) but gated to 2 UCC-positive; revisit after the UCC-coverage test.
- [ ] **Run `feeds_calibration.py` the day the case-study 50 lands** — decides timing-tool vs discovery-tool (does our thin `ucc_fl` corpus, not reality, cause the low UCC-positive?). Same run does the §7 winners-vs-dead check.
- [ ] Next run: pull F5 building/ROW permits (Accela/Tyler — untested platform family, concrete/dirt lane) and a UCC-3 termination feed (fires on the pool, sidesteps the discovery gate). F6 FL (Florida Commerce) to confirm grant feeds = manufacturers, not David's box.
- [ ] OH is UCC-blind at scale (no local registry) — F1/F2/F3 OH viability-noted only; needs Alek's full OH UCC export before OH feeds can be scored like FL.

## 1c. David's replies 2026-09-09 (change the plan)
- The bar: 5 applications + 1 funded per 100 calls. Contact rate is not the metric.
- Borrowing experience is an underwriting requirement → LIEN only for call batches; UCC coverage is a hard dependency per state.
- Single asset 5+ years = not ICP → needs fleet-over-time; flag first, cut later.
- General trucking dead; specialty trade trucks (vac, bucket, crane, pump, roll-off) + yellow iron are the box. FMCSA blind to yellow iron → parse UCC collateral.
- Wanted Central time zone, not Midwest. Ohio (Eastern) still runs as the lender-first test.
- Wants a better tracking format than comments. Propose three dropdowns.
- See `gameplan.md` §4, §6, §7 for the full read and the experiment queue.

## 1d. Follow-ups from the 2026-09-10 call
Ours:
- [ ] Send `EMAIL_TO_DAVID_FOLLOWUP_2026-09-10.md`
- [ ] Central-time list (Alek) — tomorrow 09-11, not today; David told
- [ ] Critical-field list for his sheet (contact / outcome / hang-up / next action); merge with his blank sheet; v0 shared sheet with validation + ingest script
- [ ] Providence domain plan: list of domains by state, DNS needs, sender names, signature → to David before registering
- [ ] Case-study legwork once his 50 arrive; schedule screen-share
- [ ] `lender_role` feature; cluster secured parties in prod; ask David for funder list + broker names
- [ ] Intent: entity-first search (Exa) on case-study 50 + control 50; classify hits by signal family; find recurring source domains (GAMEPLAN §6.3)
- [ ] FL batch 3: LIEN only, specialty + dirt, lien-age strata, single-asset flag, tracking columns, 50–100 rows
- [ ] Business model memo (internal): per-lead vs revenue share vs broker; not to David yet
David:
- [ ] Blank tracking spreadsheet + fields he wants on one screen
- [ ] 50 repeat customers with vendor column
- [ ] Ohio results incl. "direct or broker" answers
- [ ] Funding-source list; broker names that hold paper
- [ ] CRM hits FL v2 + OH

## 1e. From the E9 feeds run (2026-09-10)
- [ ] **FL UCC backfill 2020–2024 + UCC-3 terminations** (Florida Secured Transaction Registry bulk data; price it). Corpus is 74% `young_filings`; ripe-age liens are mostly missing. Blocks E1, biases every LIEN/NOLIEN read, and gates feed discovery.
- [ ] OSTDS (FL DOH Caspio, 67 counties) scraper: verify + timing on A_VAC
- [ ] DemandStar supplier login + plan-holder scraper, after backfill
- [ ] FDOT letting scraper, low priority
- [ ] `scripts/feeds_calibration.py` the day the case-study 50 lands

## 1f. Ohio verdicts (2026-09-10) and Strategy 3
- [ ] **Enforce `fit_flag` as a cut, not a legend**, on every batch (0/27 flagged rows positive in Ohio). Hand-read stays until the equipment/industry classifier matches it.
- [ ] CRM dedupe list from David *before* each batch (8/50 Ohio rows were in PCF's CRM; 2 were DO NOT CALL)
- [ ] Ask David: LP / GM column definitions and what "9 Mo" is (date column; inferred last-touch date)
- [ ] Run E10 per `runbook_county_census.md` (Escambia / Highlands / Suwannee); append result to gameplan §6.3c
- [ ] Reply to David on Ohio: the flagged/clean split, that the dead pile was ours to prevent, Central list due 09-11 from Alek

## 1g. Wisconsin batch + David's 09-11 reply
- [x] WI 50 through Twilio line+CNAM, FMCSA name match, David's template → `out/WI_PHONE_TEST_50_2026-09-11.csv` (`scripts/c5f_wi.py`)
- [x] Send `email_to_david_wi_2026-09-11.md` with the file
- [x] **WI verdicts back 09-14, scored + joined** → `out/verdicts/david_wi_2026-09-14.csv` (`scripts/c5h_wi_verdicts.py`); analysis in gameplan §4.10. 3 green + 2 blue opens, 12 dead, 5 CRM, 0 apps yet (all opens are callbacks)
- [x] ~~Make hard-flag cut a rule~~ **REVERSED by WI**: hard-flag cut did not replicate (2 opens on hard rows incl. best lead; fleet>7 wrong for specialty; bank_lien not predictive). No auto-cut yet — box stays the only pre-ship enforcement. See gameplan §6.4
- [ ] **Move `filed_<6mo` to a renewal-timing hold** (worst negative in WI, 5 dead/15 — "just financed, hostile"); recontact at 24–48 mo, don't dial fresh
- [x] ~~Fix the intent clock with Alek~~ **SUPERSEDED by FL 100 (§4.11):** lien timing doesn't predict on either clock — the 24–48mo warm band did NOT replicate (FL 24–48mo 38% dead ≈ 48+ 40%). New Alek item: **drop lien-timing from ranking; select next batch on business events** (the HOT half of alek_signal was the only predictor). Ask Alek for a majority-HOT next list.
- [ ] Retire the `units>7` ceiling for specialty lanes in the builder; keep fleet as a ranked column
- [ ] Ask David: "Noise Level" meaning; his CRM suppression list (LP/GM confirmed = CRM-presence flags); TX share of case-study 50; preferred next domain names
- [ ] Alek's exports: get owner names on every row (8/50 WI missing, David added them) and a registry date for TIB
- [ ] Texas UCC ($1.5K): decide after case-study TX share is known
- [ ] Downgrade `lender_role` feature to low priority (PCF only known paper-holder)
- New WI headwind logged: **iPhone AI call-screening** blocks cold calls to mobiles; landlines reach 0 humans. Reach is the ceiling (~30% connect on mobile-heavy lists)

## 1h. FL 100 intent batch (2026-09-14)
- [x] FL 100 through Twilio line+CNAM → `out/FL_PHONE_TEST_100_2026-09-14.csv` (`scripts/c5g_fl100.py`); David-facing blind copy `out/FL_PHONE_TEST_100_DAVID_2026-09-14.csv`
- [x] Send `email_to_david_fl100_2026-09-14.md`
- [x] **Verdicts (partial, first 50) joined to `alek_signal` / `fit_flag`** → `out/verdicts/david_fl_partial_2026-09-15.csv` (`scripts/c5j_verdicts.py`); analysis gameplan §4.11. **Finding: HOT event tags separate (0 dead of HOT reached); WARM lien-timing 11/11 dead reached; 24–48mo band did not replicate.** HOT-reached n=2 → confirm at n on rows 51–100.
- [x] **Completed FL 100 back 09-19, scored** → `out/verdicts/david_fl_completed_2026-09-19.csv` (`scripts/c5j_verdicts.py flc`); analysis gameplan §4.12. **HOT 18% dead vs WARM 57% at n=28/67; tree = base rate; 13% wrong-number rows; 4 seller rows (turnover).** 0 apps.
- [ ] **Second-source phone check before the next list** (Places/website number vs record; language flag): 5 NIS on Twilio-valid numbers, 2 wrong company, 2 Spanish mailboxes. David hand-corrected 4 numbers; that is our job.
- [ ] **Lane cap 25% and majority-HOT selection** for the next FL list (§4.12); tell Alek.
- [ ] Pass the 4 seller rows (Roll-Off Services of FL, Jag Property, Fast Towing, and the Temsa mis-pool) to `../quintel-v2/signals-execution.md` E-T1 as first turnover observations.
- [ ] **Data defect on Alek's FL export: 4 duplicate company pairs** (Trash Taxi, Venice Wrecker, Stan's Pro Tows, Tri J.). Add a dedup pass (owner+county) before next list. CO export had a "LYES" name-smudge too.
- [ ] Confirm with Alek the fuller `florida-ucc-full.csv` source and lien-age depth (resolves the young-slice worry for FL only)
- [ ] Decode Alek's flag taxonomy for the record: DELIVERED (deliverable) / CAP_HELD (lien-timing only, no web signal) / WEB_WARM_MIDLIEN (web signal, lien not mature) / NO_SIGNAL (control); modifiers REV_BAND_EDGE, SINGLE_UNIT, E_UNEXAMINED, FILED_LT6MO, PCF_SOURCE_FUNDER
- [ ] 9 PCF_SOURCE_FUNDER rows: get David's direct-vs-broker read per row (§6.6)

## 1i. Colorado batch (2026-09-15) — the Mountain-time list David asked for
- [x] CO 100 (Alek, specialty trucks, MST, CO UCC) through our Twilio line+CNAM (overwrote Alek's non-Twilio line type for cross-batch parity) → internal `out/CO_PHONE_TEST_100_2026-09-15.csv`, David copy `out/CO_PHONE_TEST_100_DAVID_2026-09-15.csv` (`scripts/c5i_co.py`). 63% mobile, all valid, ~$2.16 Twilio.
- [x] Email drafted `email_to_david_co_2026-09-15.md`
- [x] **Suppressed 1 row** (10 Star Tree Care — listed owner deceased, line reaches family; kept internal, neutral reason, no marital-status field). David copy = 99 rows.
- [x] Phone II now carries a clean-sourced owner mobile where distinct from the main line (20 rows); people_search / quickenrich / LinkedIn sources excluded per standing rule.
- [ ] GOLDSTAR Excavation: dual-ownership (also owns Generation Sewer & Water) — flagged to David to verify; watch for it as a dedupe pattern.
- [ ] **No blind copy needed** (fit_flag uniform `DELIVERED`, alek_signal uniform on all 100 — no per-row intent to confound). But lien age is per-row with good spread (fresh<6: 12, 6–24: 31, **24–48: 25**, 48+: 31) → on verdicts, re-test the WI 24–48mo warm-band finding at bigger n. No `renewal_window`/`lapsing_12m` tag here, so the intent-clock bug (§4.10) doesn't apply to CO.
- [x] **Verdicts (partial, first 28) scored** → `out/verdicts/david_co_partial_2026-09-15.csv` (`scripts/c5j_verdicts.py`). **21% CRM-overlap (6/28 David's own/funded customers)** — signal uniform so no intent test, but this makes the **suppression-list ask top priority for the call**. Existing customers cluster in the 24–48mo band (leakage caution — partly why that band looked good in WI). 9 dead / 2 follow-up / 11 voicemail; wireless out-reached landline (4/14 vs 1/10).

## 1j. Texas batch (2026-09-18) — the state David asked for on 09-16
- [x] TX 50 (Alek, WI format, CST) through our Twilio line+CNAM, overwriting Alek's own `line_type` inference for cross-batch parity → internal `out/TX_PHONE_TEST_50_2026-09-18.csv`, David blind copy `out/TX_PHONE_TEST_50_DAVID_2026-09-18.csv` + `.xlsx` (`scripts/c5k_tx.py`). 73 distinct numbers, ~$1.31 Twilio.
- [x] **Blind copy IS needed here** (unlike CO): `fit_flag` has 31 distinct values, `alek_signal` splits 28 FIT_ONLY / 22 FIT_ONLY;MOBILE, `lender_note` populated on all 50 → per-row intent that would confound his verdicts. Dropped from his copy: `phone_valid`, `cnam_match`, `lane`, `equipment_ticket`, `ucc_status`, `usdot`, `fit_flag`, `alek_signal`, `lender_note` (the FL-100 column set).
- [x] Phones: **50/50 valid**, 36 mobile (72%, highest of any batch; CO was 63%), 7 landline, 5 nonFixedVoip, 2 fixedVoip. CNAM returned a name on 40/50. `cnam_match`: company 16, owner 10, surname 7, other 7, none 10. Kept internal only — WI/FL verdicts showed it does not predict reach.
- [x] **Alek's own line-type inference scored against Twilio: 21/22 correct** (MOBILE_VENDOR 10/10, MOBILE_INFERRED 11/12; the miss came back nonFixedVoip). His 28 `main` rows split 15 mobile / 7 landline / 6 VoIP. His vendor-sourced call is reliable; his inferred call is nearly so.
- [x] Email drafted `EMAIL_TO_DAVID_TX_2026-09-18.md` (flags Extreme Pumping: we have owner Mike, CNAM says TROY GIPSON).
- [ ] **No TX UCC in prod** (FL/CO/CT only) → 38 rows have no filing, 12 carry one from other records (6 in the 6–24mo band, 6 at 48+). This is a **no-lien-overlay arm**: it tests the pool on its own, and is the cleanest comparison yet against the WI/CO lien-banded batches. Pre-register that before verdicts come back.
- [ ] **CRM clearance pending on all 50** (Alek's note) — David dedupes. CO ran 21% CRM overlap; if TX repeats that, the suppression-list ask stops being a nice-to-have.
- [ ] 17 rows carry `HELD_BEST` (Alek's second-tier accept). Score verdicts HELD_BEST vs ACCEPTED — Ohio showed 0/27 flagged rows positive, this is the re-test at n=17.
- [ ] `classify()` reads "SVC UNLTD" vs "Services Unlimited" as `other`. Internal column only, low stakes, but add UNLIMITED/UNLTD to the abbreviation handling next time it's touched.

## 2. Batch 2 build changes implied

- [ ] Fleet-size signal band 2–7, and a separate `fleet_over_7` flag (do not silently drop; David's rule is a prior, our verdicts are the test).
- [ ] New per-signal feature `captive_lien`: count of liens with a captive secured party, most recent date, lender name. Negative prior, reported not scored. Maintain a captive list (his seven plus CNH, AGCO, DLL, JCB Finance, PACCAR, Navistar, Bobcat/Doosan, Hitachi) with a `david_named` flag so his seven can be tested separately.
- [ ] Ship `total_drivers` (employee proxy) on DOT-anchored rows.
- [ ] Sunbiz has no headcount; DBPR and FDEP have none. Revenue and employees stay blank unless David's CRM data comes back.
- [ ] A_DIRT from the FMCSA `construct` cargo flag alone over-fires (hardware store, electrician, ironworks in batch 1). Require a second evidence class or a name/licence corroboration. See retro §12.
- [ ] County tier: replace population tiers with funded-deal density once David sends deals by county (commitment #11).
- [ ] Dedupe on owner name + county, not only company.
- [ ] Verdict ingest: the shipped sheet has **no blank verdict columns** (`INCLUDE_VERDICT_COLS = False` in `scripts/c5b_fix.py`); David grades in his own format. Build the column mapping when his sheet returns, then run C6 (Wilson intervals per comparison in retro §9).
- [x] Twilio: paid account created 2026-09-07 (API key auth, `SK…`; account/balance endpoints are blocked by key permissions, Lookup works). Trial rate limit was the cause of the original 429s, not credits. All 552 numbers now resolved: **551 of 552 valid**, so carrier validity barely discriminates.
- [x] CNAM bought and attached (`scripts/c3e_lookup.py cnam` → `data/work/cnam_cache.json`, scored by `scripts/c5d_cnam.py`). 57 of 69 numbers returned a name. On the shipped 50: company 20, owner 11, surname 4, other 6, none 9 — 35 of 50 independently confirmed pre-dial. **Attached after selection, never used to filter**, so it can be tested against David's `right_poc`.
- [ ] Retain a dated FMCSA snapshot monthly starting now (`fmcsa_fleet_delta` needs two).

## 2b. Batch 1 v2 (2026-09-05) — decided, in progress

David had not started dialing, so the 50 is being reissued on his two rules. Script: `scripts/c5c_v2_select.py` → `out/FL_PHONE_TEST_50_v2_2026-09-05.csv` + `out/BENCH_v2_2026-09-05.csv`. Design is in the script docstring and pre-registered here:

- Universe: FMCSA-anchored only (every phone from the MCS-150 filing, so phone provenance is not confounded with anything), 2–7 power units, no captive lien in our corpus, no finance officer, TIB ≥ 2, lanes A_VAC / A_DIRT / B / C, Monroe ≤ 2 per segment, persona exclusions, Twilio-verified only.
- One split, 25/25: **LIEN** (lien in our corpus from a non-captive lender: independent or bank, i.e. a proven Providence-type borrower) vs **NOLIEN** (no lien in our corpus).
- Predictions: reach and right_poc do not differ; in_market is higher in LIEN. If not, the lien overlay is not worth its cost for phone work and the pool is the registries. If so, "proven independent-finance borrower, term maturing" becomes the primary segment.
- Recorded, not balanced: line_type, corroboration, county tier, ripe_basis, tier. Report each with a Wilson interval; n=25 per arm detects only large effects, which is the point.
- The three v1 arms and David's two rules move to email at scale (hundreds per cell), where they can be measured cheaply.
- Status: **SHIPPED 2026-09-07.** `out/FL_PHONE_TEST_50_v2_2026-09-07.csv` (50), `out/BENCH_v2_2026-09-07.csv` (15), `out/README_v2.md`, email `EMAIL_TO_DAVID_2026-09-07.md`.
- Message to David with v2: v1 withdrawn; his two rules would have removed 35 of the 50, so the list was rebuilt on them; two halves, grade both the same; `total_drivers` added as an employee proxy on every row.

## 2c. Email engine — decisions 2026-09-05

Simon: Quintel sends and owns the infrastructure from day one (replies, data, reply handling). Origami is the sequencer; it warms up, can provision domains and mailboxes, sending is free, extras cost. First sends wait for David's verdicts; engines start now.

Start-this-week list:
- [ ] Buy 3 domains (not quintel.ai; lookalikes we are willing to burn), provision 3 mailboxes each in Origami, start warmup. Two to three weeks of lead time is the only reason to move before verdicts.
- [ ] Decide the brand on the email. Sending David's copy ("Providence Capital has provided $2 billion...") from our domains is Providence-brand on Quintel infrastructure and needs Providence's sign-off and a reply-routing agreement. A Quintel or neutral brand tests the lien-maturity opener and keeps replies ours. This is the one open decision that changes the copy, the compliance posture, and what David is told.
- [ ] Email verification step in C3 (MillionVerifier or ZeroBounce, ~$0.005/row). Current check is MX only. Bounce over 3% on a fresh domain ends the domain.
- [ ] One suppression table: prod touches, David's April list, both PCF CRMs (ask David for hits), every Origami campaign (Alek's five, separate lists). No row is ever in two sequences.
- [ ] Reply handling: shared inbox or Origami inbox → classify (positive / question / not now / unsubscribe / bounce) → positive to David within one business day → outcome back. Build the label schema before the first send.
- [ ] Copy: get from David which variant actually ran and its numbers. His file is option lists, not tested copy. Draft the lien-maturity opener as arm B.
- [ ] Pilot design (after verdicts): 200–300 rows from the continuation pool, two copy arms, four touches, pre-registered bounce / reply / positive / meeting by copy arm, email source, segment. Gates: bounce < 3%; scale at ≥ ~1% positive reply; stop under 0.3% across 600 sends per arm.

## 3. Open commitments touching this folder

| Item | Owner | Status |
|---|---|---|
| Grade the 50 | David | week of 09-08 (slipped from 09-05, holiday) |
| CRM dedupe hits back to us | David | ask |
| Funded deals by state and county; fleet-size distribution of funded deals | David | asked for state; add county and fleet size |
| Which email copy actually ran, and results | David | ask |
| Brand on the email (Providence copy on our domains vs Quintel/neutral) | Simon / Alek | open; infra is Quintel-owned (decided 09-05) |
| Email infrastructure: domains, mailboxes, warmup in Origami | Simon | starting week of 09-08; see §2c |
| Batch 1 v2 (50, LIEN/NOLIEN) | Simon | shipped 2026-09-07 with CNAM; see §2b |
| Batch 2 (~200 rows) | Simon | after v2 verdicts; changes above |

## 3b. New findings from the v2 build (2026-09-07)

- **Carrier validity is nearly useless as a filter.** 551 of 552 numbers came back valid. It rules out typos, nothing more. CNAM is the discriminating check.
- **`caller_type` (BUSINESS/CONSUMER) is noise.** 36 of 50 real operators come back CONSUMER; the flag describes the billing account. Ignore it; the name is the signal.
- **CNAM coverage is much better than Twilio's docs imply** (they describe it as a mobile feature). 83% of numbers returned a name, across mobile and VoIP alike.
- **Cargo flags mislabel lanes when a carrier ticks several boxes.** A land-clearing company that also hauls debris got the garbage flag and landed in the roll-off lane. Fix shipped: `fx.lane_of()` in `c5b_fix.py` lets an unambiguous trade word in the company's own name override the cargo-derived lane. This is the mirror of the batch-1 finding, where cargo correctly beat a name regex — the resolution is that cargo beats a *generic* name, and an explicit trade name beats cargo.
- **The supply-house persona keeps recurring** (Gilchrist Building Supply in v1, Builder's Choice Supply in v2). A supply house hauls construction materials, so it declares the same cargo flag as a site-work contractor. Now excluded by rule in `NOT_IN_BOX_NAME`.
- **Owner-name parser bug fixed:** a generational suffix after a comma ("Martin VANDERWERF, Iii") was read as the given name. `rebuild_name` now strips suffixes before deciding name order.

## 4. Housekeeping

- This folder is a fresh git repo with **no commits** (`main` empty). `.env` holds live keys; make sure it is ignored before the first commit. `data/` is ~25 GB (Sunbiz raw + parts) and must never be committed.
- `out/.pre_fix_*.csv` are the pre-row-read outputs; keep until verdicts are in, then delete.
- `EMAIL_TO_DAVID_2026-09-04.md` is the email as sent. It quotes pre-fix counts (email 38, website 28, corroborated 18, continuation 397). The shipped CSV and README carry the post-fix counts (40 / 25 / 14 / 391). Harmless, but if David asks, that is why.
