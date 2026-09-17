# Runbook: signal-feed discovery (Strategy 2)

Self-contained instructions for a new session. Context: `gameplan.md` §6.3b. Strategy 1's results are in `out/SIGNAL_SEARCH_REPORT_2026-09-10.md`; read §0 and §4 of that first, it is why this run exists.

## 1. Why

Strategy 1 searched the web for companies we already hold. It found that construction companies leave a trail and service-truck operators do not, and that it cannot discover anything it was not given. This run goes the other way. A **signal feed** is a public source that continuously emits company names doing work, with a date: a county's bid tabulations, a plan-holder list, a septic permit register, a sheriff's tow rotation, a state grant report. Finding one is a one-time search. Once found, it is a static source we scrape on a schedule, and every name it emits is a candidate with intrinsic timing.

The pipeline this feeds: **feed → name + date → verify (SOS / FMCSA) → UCC join (borrowing experience, lender class) → box filters → batch.** The feed does discovery and timing; everything downstream already exists.

## 2. What we want to learn

For each feed type, answer five questions and write them into the report:

1. **Joinable?** Does it name companies in a form we can match (legal name, ideally with city)? What share of emitted names resolve to a Sunbiz / FMCSA / UCC record?
2. **Dated?** Does every record carry a usable date (bid, award, permit, posting)?
3. **In-box?** Of the resolved names, what share pass our box (2–7 units or equivalent, no captive/bank lien, in-lane)? A feed that emits 95% large GCs is a poor feed even if it joins.
4. **UCC-positive?** What share of resolved names have a non-captive, non-bank EF lien in `data/raw/ucc_fl.csv` (FL) or Alek's OH set? David's rule makes this the gate.
5. **Scrapable?** Is it a listing page or database with stable structure, or one-off PDFs? What platform runs it, and how many other agencies run on that platform?

A feed that scores well on 1–4 and runs on a shared platform is a signal engine. Build its scraper. A feed that fails 1 or 4 is dropped regardless of how interesting it looks.

## 3. Feed catalog to work through

Do these in order. Stop at the first eight that produce a usable pull; the rest are for the next run.

| # | Feed type | Where to start (FL) | Where to start (OH) | Lane |
|---|---|---|---|---|
| F1 | Municipal/county procurement: bid tabulations, plan-holder lists, awards | DemandStar (Florida is its home market: Orange, Hillsborough, Polk, Lee, Marion counties and dozens of cities), BidNet, Bonfire, OpenGov Procurement, PlanetBids | Ohio agencies on BidNet, Bonfire, OpenGov; county engineer sites (Union County's bidders list came from here) | yellow iron, site work, utility |
| F2 | State DOT lettings and prequalified contractors | FDOT: bid letting results and the prequalified contractor list by work class | ODOT: letting results and prequalified list | dirt, paving, utility |
| F3 | Septic (OSTDS) permits | FL DEP OSTDS permit search per county (moved from DOH to DEP in 2021); pick two counties from the v2 batch (LEVY, SUWANNEE or similar rural) | Ohio county health departments; Portage County's septage-hauler roster is the known example | A_VAC installers |
| F4 | Sheriff / police tow rotation lists | county sheriff sites; FHP Wrecker Operator System by troop | county sheriffs; Ohio State Highway Patrol rotation | C, heavy-duty wreckers |
| F5 | Building and ROW permits | county portals on Accela / Tyler EnerGov / CityView; pick one county on each platform | same | dirt, concrete |
| F6 | State grant/loan and EDC announcements | Florida Commerce incentive reports; county EDC press | JobsOhio executed grants/loans report (found by Strategy 1) | all, capex |
| F7 | Job posts | Indeed: "CDL driver", "excavator operator", "heavy equipment operator", "septic" by state, employer field | same | all |
| F8 | Other government rosters | anything Strategy 1 surfaced (`data/work/signals/`): licensed septage haulers, waste haulers, franchise lists | same | by roster |

For each feed, record the URL, the platform vendor if any, and how many agencies the platform hosts in the state (from the vendor's own agency list where it exists).

## 4. Pull

One month per feed per state, or 200 records, whichever is smaller. Save the raw pull untouched under `data/work/feeds/raw/<feed_id>/<state>/` (HTML, PDF, CSV, JSON, whatever it is), with a `pull.json` recording URL, retrieved_at, method, record count. Then extract to one CSV per feed:

`data/work/feeds/<feed_id>_<state>.csv` with columns: `feed_id, state, agency, record_type (bid|planholder|award|permit|rotation|grant|job), company_raw, company_norm, city, county, record_date, job_or_asset_text, amount, source_url, retrieved_at`.

`company_norm` uses `scripts/normalize.py:normalize_name` so it joins to the existing tables. Do not invent a new normaliser.

Manual pulls are fine for this run. The question is whether the feed is worth a scraper, not whether we can scrape it yet. If a site blocks or needs a login, note it and move on.

## 5. Join

For every extracted company:

- **Sunbiz** (FL): `data/work/sunbiz_fl.csv` on `name_norm`; fall back to `data/work/sunbiz_aliases.csv`. Record status and filing date.
- **FMCSA**: `data/raw/fmcsa_fl_api.csv` (FL) on normalised `legal_name`/`dba_name`; for OH, query Socrata `az4n-8mr2` with `$where=phy_state='OH' AND legal_name='...'` (pattern in `scripts/pull_fmcsa_fl.py`). Record `power_units`, `total_drivers`.
- **UCC**: `data/raw/ucc_fl.csv` on debtor name norm; for OH, `data/work/ohio_alek_raw.csv` and Alek's fuller export if he provides it. Record secured party, filing date, and apply `CAPTIVE`, `BANKLIKE`, `EF_HOUSE` from `scripts/c5c_v2_select.py` to class the lender.
- **Pool**: `out/FL_POOL_v1.csv` on name norm. Record whether the company is already in the pool and its `exclusion_reason`.

If the Postgres `flpool` database is available (`FLPOOL_DB_URL` in `.env`), do the joins there; the `raw.*` tables are indexed on `name_norm`. Otherwise pandas is fine at this size.

Three-state rule: a name that did not match is `unmatched`, not `not_in_registry`. Names that fail normalisation (blank, person-only) are `unjoinable` and counted separately.

## 6. Score each feed

| Measure | How |
|---|---|
| records pulled | count |
| joinable names | share with a non-empty `company_norm` of ≥2 tokens |
| resolved | share matching Sunbiz or FMCSA |
| dated | share with a parseable `record_date` |
| in-box | of resolved: passes fleet 2–7 (or, for non-FMCSA, Sunbiz active with TIB ≥2 and no exclusion), no captive/bank lien |
| UCC-positive | of resolved: at least one EF lien, non-captive, non-bank |
| already in pool | of resolved: present in `FL_POOL_v1` |
| new to us | of resolved and in-box: not in the pool at all (this is the discovery number) |
| platform reach | agencies on the same platform in the state |
| effort | manual / simple scrape / needs browser / blocked |

Then read 20 records from each feed by hand and write two lines on what the companies actually are. The numbers say join rate; the read says whether the feed emits the right kind of company.

## 7. Calibration against known outcomes

Two checks, both cheap:

- **FL v2 verdicts**: `out/verdicts/david_v2_2026-09-09.csv`. Do any of the 50 appear in any feed pulled? Which outcome? With one month of data expect near zero; record it anyway.
- **David's case-study 50**: when `data/raw/pcf_case_study_50.csv` exists, search each feed's pulled records and, for the feeds that are databases, search the database directly for each of the 50 names across all dates. A feed in which repeat customers appear before their deal dates is the one that matters. If the file is not there yet, write the query so it can be re-run when it arrives.

## 8. Report

`out/SIGNAL_FEEDS_REPORT_<date>.md`:

1. Feed scorecard: one row per feed with every measure in §6. Sort by `new to us` × `UCC-positive`.
2. For the top three feeds: what the companies are (from the hand read), one example record, the platform and its agency count, and what a scraper would take.
3. Calibration results (§7), including "not yet possible" where that is the answer.
4. Feeds dropped and why (failed join, no dates, wrong companies, blocked).
5. Feed types to add next run that came up during this one.
6. Recommendation in ten lines: which scrapers to build first, and whether feed-first should become the sourcing path for yellow iron.

## 9. Things that will go wrong

- Plan-holder lists mix vendors, suppliers and contractors. Use `job_or_asset_text` to keep the construction rows; do not count a paving-supply distributor as a contractor.
- Big GCs dominate DOT lettings. That is expected; the in-box measure exists to show it. Don't drop the feed for it; drop it if nothing in-box ever appears.
- Permit portals paginate badly and often want a date range per query. One month is the unit for a reason.
- Names in feeds are typed by clerks: "ABC Excavating" vs "A.B.C. EXCAVATING LLC". `normalize_name` handles suffixes and punctuation; it does not handle typos. Record unmatched names; a 30% unmatched rate is a normaliser problem, not a feed problem.
- Tow rotation lists are PDFs updated irregularly. They are a roster (who has a heavy wrecker), not a timing feed. Score them on in-box and new-to-us, not on dates.

## 10. After this run

Write the scraper for the top feed only, run it for the whole state, and put the emitted companies through the existing pipeline (C1 verify → C3 phone → C5 select) as a "feed-sourced" arm in the next batch, tagged so David's verdicts can be read against source. That batch is the real test of Strategy 2. Record the decision in `gameplan.md` §6.3b and `TODO.md`.
