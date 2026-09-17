---
status: living playbook + experiment log
last_revised: 2026-09-17
owner: Simon (runs the prompts in Claude Code inside `active/flpool/`); Alek for hand-pulled states; David labels
serves: turning the signal design in `signals.md` into shipped lists, one experiment at a time, with the record of what shipped and what came back
tier: internal
---

# Signals execution: the playbook and the log

`signals.md` is the design. This is the execution: the prompts that produce each list, the checks before it ships, and the log of every arm and its verdicts. Run the prompts in Claude Code with `active/flpool/` as the working directory; the pipeline, the Postgres `flpool` database, Twilio cache and David's template all live there.

## 0. Standing rules for every list

- In-box lanes only; LIEN present (any EF secured party, non-captive, non-bank); fleet ≥ 2; not filed < 6 months; Sunbiz/SOS active; not previously touched by us (`data/raw/exclusions/prod_touched.csv`, every `out/*PHONE_TEST*` file, David's April list, Alek's campaigns).
- 50 signal rows + 50 box-matched controls (same lanes, state, fleet band). David blind; the internal file carries `arm` and every signal column. The David copy strips them.
- David's 19 template columns first in his order, ours after (line type, phone valid, CNAM, lender, filing date, lien age, fleet, `fit_flag`, `arm` internal only). Time zone as abbreviation. Dedup + name-hygiene pass before ship.
- Three-state booleans. No composite score. Doubt is a column.
- Read ten finished rows in full before shipping. Every list ships with a cover note that names the hypothesis, the rule and the prior (`signals.md` §5).
- Verdicts come back on the Comments cell colouring; score with `scripts/c5j_verdicts.py` (or a copy) and join on `entity_id` / USDOT.

## 1. Phase 1 today: FMCSA loss events on the Florida pool (H1, H2, H5)

Why FL first: it is the only state with the full pool in Postgres (83,987 eligible with USDOT, phone and UCC overlay). TX has no pool yet; OH/WI/CO are 50–100-row hand pulls. The FMCSA loss files are national, so the same join runs on TX the day the TX pool exists.

### Prompt 1.1: acquire the FMCSA crash and inspection files

```
Working directory: active/flpool. Read CLAUDE.md and scripts/normalize.py first.

Task: acquire FMCSA's public crash and inspection data at carrier level so we can join it
to our Florida pool by USDOT number.

1. Find the current public source. Candidates, in order:
   a. FMCSA SMS "input data" monthly downloads (ai.fmcsa.dot.gov/SMS, Tools → Downloads):
      the Crash, Inspection and Violation files for the latest month (each a zip of
      pipe- or comma-delimited text). These are the files behind SMS and carry DOT_NUMBER,
      report/inspection dates, tow-away / injury / fatality flags, and per-unit OOS fields.
   b. data.transportation.gov / FMCSA data dissemination (Socrata) datasets for crashes and
      inspections, if (a) needs a login or is down.
   c. Fallback: per-carrier SAFER/SMS snapshot scrape for the pool's USDOTs only
      (crash counts last 24 months, inspection OOS rates). Use only if (a) and (b) fail.
2. Download the latest month (and the prior 12 months if the archive exposes them) into
   data/raw/fmcsa_sms/<YYYY-MM>/. Record the URL, date, file sizes and any terms in
   data/raw/fmcsa_sms/SOURCE.md.
3. Print the header and the first 5 rows of each file. Do NOT assume the layout; report
   the exact column names for: DOT number, crash/inspection date, tow-away flag, injury
   and fatality counts, vehicle OOS indicator, unit VIN (if present), inspection level.
4. Stop and show me the layouts before loading anything.
```

### Prompt 1.2: load and join to the pool

```
Continue in active/flpool. Use the layouts you reported.

1. Load the crash and inspection files into Postgres flpool as raw.fmcsa_crash and
   raw.fmcsa_inspection (text columns, same pattern as scripts/load_pg.py), indexed on
   dot_number. Keep every row nationally; we will reuse this for Texas.
2. Build work.loss_signals, one row per USDOT, with three-state, dated columns:
   - crash_90d (count), crash_180d, last_crash_date, last_crash_towaway (t/f/null),
     last_crash_injury_or_fatal (t/f/null)
   - oos_180d (count of inspections with a vehicle OOS), last_oos_date,
     oos_repeat_vin (t/f/null: the same VIN OOS twice in 12 months, only if VIN exists)
   - oldest_unit_year (from VINs via a VIN decoder only if VINs exist; else null)
   - signal_asof (the file month)
   "Not in file" must be null, never false.
3. Join to out.fl_pool_v1 on USDOT (the fmcsa join key; see work.fmcsa). Report:
   - how many eligible FL pool rows have any crash in 90d / 180d; any OOS in 180d
   - the same counts restricted to in-box lanes (A_VAC, B specialty, C small), LIEN
     present, fleet ≥ 2, not filed < 6 mo, not previously touched
   - a breakdown by lane
4. Show me the counts before selecting anything. If the in-box crash-90d count is under
   50, tell me and propose widening to 180d or adding OOS to reach 50; do not silently widen.
```

### Prompt 1.3: select the arm and the controls

```
Continue. Build the H1/H2 arm per active/quintel-v2/signals.md §5 and §7.

1. Signal arm (50): in-box, LIEN, fleet ≥ 2, not filed < 6 mo, not touched, with
   crash_90d ≥ 1 (prefer tow-away or injury) or oos_180d ≥ 1 (prefer oos_repeat_vin).
   Rank: tow-away crash > any crash > repeat-VIN OOS > single OOS; then most recent first.
   Tag each row arm='signal' and signal_type in {crash_towaway, crash, oos_repeat, oos}.
2. Control arm (50): same filters, no crash in 365d and no OOS in 365d, matched to the
   signal arm on lane and fleet band (2–3 / 4–7 / 8+) and county tier where possible.
   arm='control'.
3. Apply the FL exclusions from scripts/c1_exclusions.py and suppress everything in
   data/raw/exclusions/prod_touched.csv and every out/*PHONE_TEST*.csv by join_key.
4. Phones: for rows not in the Twilio cache, run line type + CNAM using the pattern in
   scripts/c5g_fl100.py (c3e_lookup, c5d_cnam). Prefer mobile MCS-150 numbers; keep
   office as phone_alt. Three-state phone_valid.
5. Owner name from work.owner (Sunbiz officer) as in c5b_fix.py; no guessed emails.
6. Write:
   - out/FL_LOSS_TEST_100_2026-09-18.csv (internal: all columns incl. arm, signal_type,
     crash/oos columns, lien, fleet, fit_flag)
   - out/FL_LOSS_TEST_100_DAVID_2026-09-18.xlsx in david-data-template.xlsx layout,
     his 19 columns first, our verification columns after, NO arm or signal columns,
     rows shuffled so the arm is not inferable from order.
7. Print ten finished rows in full for me to read, plus: lane counts per arm, line-type
   mix, CNAM match rate, fit_flag counts. Do not ship until I have read the ten.
```

### Prompt 1.4: the cover note

```
Draft the cover note to David for out/FL_LOSS_TEST_100_DAVID_2026-09-18.xlsx in the
style of active/flpool/email_to_david_fl100_2026-09-14.md: short, plain, Simon's voice.
Say: 100 Florida rows, all specialty lanes, all with borrowing history, same template,
please grade on the Comments cell as you did on Wisconsin. Say it tests one new signal
family blind and we will tell him what it was when the verdicts are in. Do not name the
signal. Ask him to note "already replaced it" or "just bought" in Comments when he hears it,
because that phrase is part of what we are measuring.
Then write the internal pre-registration block for active/quintel-v2/signals-execution.md
§4: experiment id E-L1, hypotheses H1/H2/H5, arms, n, the decision rule from signals.md
§5 and the prior.
```

### Checks before it ships
- Ten rows read. Any row where the crash or OOS date is older than the window, or the carrier is out of box, comes out.
- No signal column in the David file; row order shuffled.
- Suppression hit count reported and zero rows overlap prior lists.
- Pre-registration block written in §4 before the email goes.

## 2. Phase 1b: Texas (as soon as a TX pool exists)

Two routes; pick by what Saturday tells us about the TX share of the case-study 50.

**Route A (proper): buy TX SOS bulk UCC (~$1.5K), build the TX pool the FL way.** Prompt:

```
Working directory active/flpool. Build a Texas pool on the FL pattern: FMCSA census for
TX via Socrata az4n-8mr2 (scripts/pull_fmcsa_fl.py, parameterised by state), TX SOS
entity file or search for verification, TX bulk UCC once purchased (data/raw/ucc_tx.*),
lanes from c0_lanes.sql, exclusions per c1. Load as raw.*_tx and produce out/TX_POOL_v1.csv
with the same columns as FL_POOL_v1. Then re-run Prompt 1.2 and 1.3 with state=TX.
```

**Route B (fast, this week, Alek): a 100-row TX list by hand,** FMCSA census filtered to specialty lanes, secured-party search on the TX SOS UCC site for borrowing history, then Prompt 1.2's join for crash/OOS on those USDOTs only. Same arm/control split if ≥ 50 have a loss event; otherwise ship it as a plain box list with the loss columns as a rank, and say so in the pre-registration.

## 3. Phase 2 and later (prompts to write when their phase opens)

- **FEMA cohort overlay (H3):** pull OpenFEMA `DisasterDeclarationsSummaries` for FL/TX/OH/WI/CO, last 12 months, by county and incident type; add `fema_declared_90d` to the pool; if a declaration is live in a pool state when the next list ships, build the inside/outside arm on tree, roll-off, vac, hauling lanes.
- **Private-party listings (H4):** one state, Commercial Truck Trader private-seller filter for vac / tow / bucket / crane, match seller name and phone to the pool, 50-row arm.
- **Source discovery (continuous):** run `signals.md` §8 per lane × state; log candidates in §5 below; validate one per week with `runbook_signal_feeds.md`.
- **Partner conversations (H8, H9):** the shop register in §6 below; script in `technicians.md` §6.

## 4. Experiment log

One block per shipped arm. Pre-registration is written before the send; results after the verdict join.

| Exp | Ship date | State | Hypotheses | Arms (n) | Decision rule | Prior | Status | Result |
|---|---|---|---|---|---|---|---|---|
| E-L1 | target 2026-09-18 | FL | H1 crash-90d, H2 OOS-180d, H5 unit age (column) | signal 50 / control 50 | signal open rate ≥ 2× control at n=50 reached → daily trigger; < 1.2× → park | 0.5 / 0.4 / 0.35 | building | |
| E-L2 | after TX pool | TX | H1, H2 replication | 50 / 50 | same | same | waiting on TX | |
| E-C1 | on next live declaration | FL or TX | H3 FEMA | inside 50 / outside 50 | ≥ 2× → standing trigger | 0.5 | waiting | |
| E-T1 | week 3 | FL | H4 listings | 50 / 50 | ≥ 2× and "already bought" < 30% | 0.5 | not started | |

## 5. Source registry (from the discovery prompt)

| Source | Mechanism | State | Names small cos? | Date? | Join key | Access / cost | Validated? | Verdict |
|---|---|---|---|---|---|---|---|---|
| FMCSA SMS crash file | A loss | national | yes | yes | USDOT | open | in progress (E-L1) | |
| FMCSA SMS inspection file | A failure | national | yes | yes | USDOT, VIN | open | in progress (E-L1) | |
| OpenFEMA declarations | B cohort | national | county-level | yes | county | open API | no | |
| Commercial Truck Trader private sellers | C turnover | per state | yes | listing date | seller name, phone | scrape | no | |

## 6. Shop and partner register (H8, H9)

| Date | Metro | Shop | Type | Owner reached? | What happens when a unit isn't worth fixing | Who fronts | Would use a link? | Referred lead? | Notes |
|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | |
