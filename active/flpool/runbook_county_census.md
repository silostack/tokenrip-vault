# Runbook: county source census (Strategy 3, E10)

Self-contained instructions for a new session. Context: `gameplan.md` §6.3. Read §0 and §4 of `out/SIGNAL_SEARCH_REPORT_2026-09-10.md` and §3 of `out/SIGNAL_FEEDS_REPORT_2026-09-10.md` first. Everything you need from the folder is named below; do not read the rest of it.

## 1. Why this run exists

Strategy 1 (entity-first web search) and Strategy 2 (platform-level signal feeds) both enumerate by *platform*: one URL that many agencies pass through. That finds breadth cheaply and misses everything that never reaches a platform. The 21 real intent hits in Strategy 1 came mostly from local newspapers and county pages, one hit each, and were written off as "not scrapable as a set." That is the conventional-shape bias this run is designed to test.

Strategy 3 enumerates by *geography*. Pick a county. List every local source in it that names companies doing work: commission minutes, permit portals, bid tabulations, utility and school-board awards, local papers, auction results, chamber lists. Extract every dated mention of a company with an LLM, join to the pool and the UCC, and count what the platform strategies could not see. The parsing barrier that made this uneconomic before is gone; a minutes PDF with no schema costs cents to turn into `company, date, event`.

Three roles a local source can play, all scored: **discovery** (a company not in the pool), **timing** (a dated event on a pool company), **operating evidence** (proof the company is alive and working, which fixes `no_sunbiz_match` and stale-registry rows).

## 2. Decision rule, set before you start

Three Florida counties, four hours of enumeration and extraction each (12 hours total; stop at the budget, do not extend).

- If the three counties together yield **fewer than 10** in-box, dated company mentions that are **not reachable via feeds F1–F8** (the Strategy 2 catalog), the long tail is a lookup layer: use it per row on demand, do not build a census.
- If they yield **10 or more**, the county source census becomes a build: a per-county source registry, refreshed on a schedule, with an LLM extractor per source class.
- Either way, report the per-hour yield and the split by role (discovery / timing / operating evidence), because a source that only proves "alive" is still worth having for the best lane.

## 3. The three counties

Chosen for one v2 septic positive each and a spread of sizes. The positive is the seed: its trail in local sources is the first thing to look for.

| County | Size | v2 positive (A_VAC, `out/verdicts/david_v2_2026-09-09.csv`) | County seat |
|---|---|---|---|
| Escambia | metro (Pensacola, ~320K) | ENSLEY SEPTIC TANK SERVICE INC | Pensacola |
| Highlands | mid (~100K) | ALL PRO SEPTIC SERVICES LLC | Sebring |
| Suwannee | rural (~45K) | HOWARD SEPTIC TANK SERVICE, INC. | Live Oak |

Pool rows for each county: filter `out/FL_POOL_v1.csv` on `county` (upper case) and `exclusion_reason` empty. Keep that list open; it is the join target and the "already known" set.

## 4. Source classes to enumerate per county

Work through all of them for each county before extracting anything. Write every source found into the registry (§6) whether or not it turns out useful; a source that fails is still a census entry.

| # | Class | Where it lives | What it names | Expected role |
|---|---|---|---|---|
| S1 | County commission agendas and minutes | county clerk / BOCC site, often Legistar, CivicPlus, Granicus, or PDF archives | contract awards, change orders, purchase approvals over threshold, piggyback contracts, vendor lists | timing, discovery |
| S2 | City council minutes for the seat and any city > 10K | city clerk sites, same platforms | same, smaller jobs, closer to the box | timing, discovery |
| S3 | Bid tabulations and award notices *not on an aggregator* | county purchasing page, school board, utility authority, port, airport, housing authority, water management district | winners **and losing bidders** (a bigger and more relevant list) | discovery |
| S4 | Building, site-plan, ROW and driveway permits | county permit portal (Accela, EnerGov, CityView, or homegrown); note the platform | contractor of record, date, job type | operating evidence, timing |
| S5 | County health / environmental: OSTDS, well, septage haulers | county DOH office pages, DEP district pages; check that the state Caspio app (F3) already covers it before counting anything as new | installers, haulers, permit dates | operating evidence |
| S6 | Tow rotation and wrecker lists | sheriff, police, FHP troop | wreckers by class | discovery (lane C) |
| S7 | Local news and weeklies | the county's paper(s), TV station sites, business journal if any; search site-restricted for lane terms (septic, excavating, towing, dumpster, crane, concrete, land clearing) | expansions, new yards, hires, awards | timing |
| S8 | Auction and dealer results | regional auctioneers (search "auction" + county + equipment), dealer "sold"/"delivered" posts, sheriff's sales | buyers named on sale reports; dealers' delivery posts name the customer | timing, discovery |
| S9 | Chamber of commerce, EDC, business licence lists | chamber member directories, county business tax receipt lists (many FL tax collectors publish these) | new members, new licences with date | discovery, operating evidence |
| S10 | Anything else found while doing S1–S9 | | | note it |

**Not in scope:** Facebook groups, Marketplace, Nextdoor, Craigslist. Terms of service and provenance problems. Log any signal you notice there in the report under "seen, not used"; do not extract from them.

## 5. Extraction

For each source with dated company mentions, pull the last **12 months** (or what exists). Pull the raw material (HTML, PDF, text) into `data/work/census/raw/<county>/<source_id>/` with a `pull.json` (url, pulled_at, pages/files, notes).

Extract with an LLM, one pass per document, into `data/work/census/<county>_mentions.csv` with these columns:

```
county, source_id, source_class, doc_url, doc_date, company_raw, city_raw, event_type, event_text, amount, page_ref
```

`event_type` values: award, bid, permit, licence, hire, expansion, purchase, sale, roster, other. Keep `event_text` to one sentence quoted from the source. Do not infer anything not in the document.

Then, for the whole file, run `scripts/normalize.py` (`normalize_name`, `normalize_city`) to add `name_norm`, `city_norm`, and join in this order, reusing the join code in `scripts/feeds_join.py`:

1. pool (`out/FL_POOL_v1.csv`) on `name_norm` + `county`, then `name_norm` alone
2. Sunbiz (`data/work/sunbiz_fl.csv`) for anything not in the pool
3. FMCSA (`data/raw/fmcsa_fl_api.csv`) for `power_units`, `total_drivers`, phone
4. UCC (`data/raw/ucc_fl.csv`) for secured party, lender class, filing date. **Note the corpus caveat**: 2022–2024 filings are covered at about a quarter of 2025's rate, so "no UCC" means "no lien in our slice." Report UCC-positive as a floor, not a rate.

Box filters as in `scripts/feeds_join.py`: fleet 2–7 where FMCSA exists, no captive/bank lien, lane by regex on name and `event_text`. Large GCs, government bodies, utilities and national brands are out; record them as `out_of_box` with a reason rather than dropping the row.

## 6. The source registry

The lasting output. `data/work/census/source_registry.csv`:

```
county, source_id, source_class, name, url, platform, format (html|pdf|portal|api), cadence, months_available, names_companies (y/n), dated (y/n), mentions_extracted, in_box_mentions, new_to_pool, reachable_via_feed (F1..F8 or none), scrape_effort (low|med|high), keep (y/n), notes
```

`reachable_via_feed` is the column the decision rule reads. A commission-minutes award that also appears on DemandStar is F1; a losing bidder on a school-board tabulation that is nowhere else is `none`.

## 7. Scorecard per county

Report these, per county and total:

| Metric | Definition |
|---|---|
| sources found / with company names / with dates | census size and quality |
| hours spent | enumeration + extraction, honest |
| mentions extracted | rows in `_mentions.csv` |
| resolved | joined to pool, Sunbiz or FMCSA |
| in-box | resolved and pass box filters |
| **not reachable via F1–F8** | the decision-rule number |
| by role | discovery (not in pool) / timing (in pool, dated event) / operating evidence (in pool, was `no_sunbiz_match` or registry-stale) |
| seed trail | did the county's v2 positive appear anywhere? where? |
| UCC-positive (floor) | with the corpus caveat |
| cost | LLM tokens, any API spend |

Then rank sources across all three counties by `in_box_mentions / scrape_effort` and by `new_to_pool`.

## 8. Calibration against what we hold

- **Verdicts**: join mentions to `out/verdicts/david_v2_2026-09-09.csv` and `out/verdicts/david_oh_2026-09-10.csv` (FL only will hit). Did any local source name a positive or a dead company before David called? Sizes are tiny; report as direction only.
- **Case-study 50**: if `data/raw/pcf_case_study_50.csv` exists, run the same join and report how many of its FL rows appear in any local source, and whether the mention predates the deal. This is the only test with real outcomes. If the file is not there, say so and skip.

## 9. Report

Write `out/COUNTY_CENSUS_REPORT_<date>.md`, internal, in this order:

0. Bottom line: the decision-rule number, the verdict (lookup layer / build), one sentence on the surprise, if any.
1. Per-county scorecard (§7).
2. Source ranking, with the top ten described in one line each: what it names, cadence, effort, role.
3. Seed trails: what each v2 positive looked like in local sources.
4. Surprises: any source class not in §4 that produced signal, and any signal type we have no feature for.
5. Seen, not used: what Facebook / Marketplace / Craigslist showed at a glance, no extraction.
6. What to build next, in at most eight lines, with the cheapest first.

Then append a three-line "E10 first run" entry to `gameplan.md` §6.3c and tick the item in `TODO.md` §1f.

## 10. Failure modes to watch

- **Counting platform hits as long-tail hits.** If a mention is also on DemandStar, FDOT, the OSTDS app or Indeed, it is `reachable_via_feed`, not new. Be strict; the decision rule depends on it.
- **Extraction hallucination.** Spot-check 30 mentions against the source document. Report the precision. Below 90%, tighten the prompt before counting anything.
- **Generic names.** City-gate any two-token generic name and every bare person name before a pool join (Strategy 1 lost 19% to this).
- **Over-spending the budget on the metro county.** Escambia will have the most sources; four hours, then move on. The rural county is the more informative test because the platforms cover it least.
- **Reading "alive" as "in market."** Operating evidence is a role, not intent. Keep the roles separate in every count.
- **Old material.** A 2019 award is not timing. Twelve months back, hard cap.
