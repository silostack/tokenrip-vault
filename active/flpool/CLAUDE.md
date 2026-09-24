# flpool — map of this directory

Florida pool-first sourcing build for the Providence Capital Funding pilot with David LaSaee. Built 2026-09-03, batch 1 (50 rows) delivered 2026-09-04. This file is a map, not a method doc.

**Read first:** `gameplan.md` (living plan) · `TODO.md` (open items, David's feedback, batch-2 changes) · `out/README.md` (what shipped, column legend; external) · `out/RUN_RETRO_INTERNAL_2026-09-03.md` (how the run went, defects, recommendations; internal).

**Program successor (2026-09-16):** `../quintel-v2/` is the step-1 front-door program (thesis, funnel, threads, Saturday brief). flpool stays the labeling lab; verdicts still feed selection and the signal experiments there.

**Vault context (outside this folder):** playbook `../batch1-playbook-2026-09-03.md` · debrief `../providence-pool-first-debrief-2026-09-03.md` · sources and signals rationale `../batch1-sources-signals-and-prompt-pack-2026-09-03.md` · contact doc `../../bd/calls/contacts/david-lasaee.md` · email drafts `../email-david-lasaee-batch1-2026-09-04.md` (draft) and `EMAIL_TO_DAVID_2026-09-04.md` (as sent).

## Pipeline in one line

Sunbiz (verify) + FMCSA / DBPR / FDEP (anchor) + FL UCC from local `quintel-prod` (overlay) → Postgres `flpool` → C0 lanes → C1 pool + exclusions → C2 evidence + Places → C3 Twilio → C4 per-signal features → C5 select → C5b row-read fixes → `out/`.

## Top level

| Path | What |
|---|---|
| `TODO.md` | Open items, David's post-batch feedback, batch-2 build changes, housekeeping |
| `CLAUDE.md` | This map |
| `.env` | `GOOGLE_PLACES_API_KEY`, `EXA_API_KEY`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `FLPOOL_DB_URL`, `QUINTEL_LOCAL_DB_URL`. Never commit. |
| `copy-draft-touch-emails.md` | David's email copy options (subject, openers, closers), received 2026-09-05. Draft-grade, not his tested copy. |
| `EMAIL_TO_DAVID_2026-09-04.md` | The batch-1 email as sent |
| `index.js`, `package.json` | IDE scaffolding, unused |
| `logs/` | Run logs from stage A/B (`sunbiz.log`, `fmcsa.log`, `load.log`, `aliases.log`, `twilio_retry.log`) |
| `.venv/` | Python env (`psycopg`, `requests`, `python-dotenv`, `rapidfuzz`, `openpyxl`) |
| `.git/` | Fresh repo, no commits yet |

## `scripts/` — run order

| Stage | Script | Does |
|---|---|---|
| A5 | `normalize.py` | The one join-key rule (`normalize_name` + `normalize_city`). Versioned schema object; changing it invalidates every table downstream. 15 unit tests. |
| B2 | `parse_sunbiz.py` | Parses the 10 fixed-width `cordata` files → `data/work/parts/sunbiz_fl_*.csv`, `sunbiz_officers_*.csv` |
| B2 | `extract_aliases.sh` | Former-name aliases from `corevt.txt` → `data/work/sunbiz_aliases.csv` (offset 211, measured) |
| B3 | `pull_fmcsa_fl.py` | Pages Socrata `az4n-8mr2` for FL carriers (145 fields) → `data/raw/fmcsa_fl_api.csv` |
| B4/B5 | `load_licenses.py` | FDEP septic + DBPR construction extracts → load CSVs (`_1` is authoritative, `_2` is the header decoder) |
| B7 | `extract_exclusions.py` | David's April vendor list → `data/work/exclusions_david.csv` + `vendor_baseline_david.csv` (his failure comments) |
| B | `load_pg.py` | Everything into Postgres `flpool` as `raw.*` text tables, indexed on `name_norm`, `city_norm` |
| C0 | `c0_normalize.py` → `c0_lanes.sql` → `c0_candidates.sql` → `c0_report.py` | Join keys for UCC/FMCSA; lane regexes with word boundaries + cargo-flag precedence + hard/soft restriction tiers; `work.candidates_all`; scorecards |
| C1 | `c1_exclusions.py` → `c1_pool.sql` → `c1_namefallback.sql` → `c1_county_fix.sql` → `c1_stats.py` | Sunbiz verification, owner ladder, CFO exclusion, one `exclusion_reason` per row, name-only fallback, FIPS county fix → `out/FL_POOL_v1.csv` |
| C2 | `c2_select.sql` → `c2_enrich.py` | Quota batch (640) → equipment evidence + Google Places (field mask, one call) → `out/FL_POOL_v2_EQUIPMENT.csv`, `data/work/web/*.json` |
| C3 | `c3_verify.py` → `c3_retry_phones.py` → `c3d_rematch.py` → `c3b_repair.py` → `c3c_polish.py` → `c3_finalize.py` → `reverify.py` | Twilio Lookup v2 (`data/work/twilio_cache.json`), three-state phone status, stricter Places matching, repairs, morning re-verify → `out/FL_POOL_v3_CONTACT.csv` |
| C4 | `c4_signals.py` | One row per company per signal, no composite → `out/SIGNALS.csv`, `out/FL_POOL_v4_SIGNALS.csv` |
| C5 | `c5_select.py` → `c5_sources.py` | Arms 30/10/10 with lane targets → the 50, bench, continuation; sources note |
| C5b | `c5b_fix.py` | Post-run row-read fixes (owner names from raw, phone_alt, ripe date, exclusions, Monroe cap, TIB floor, lane overrides, no verdict columns). **Run after C5; this is what shipped.** |

## `data/`

| Path | What | Size |
|---|---|---|
| `raw/fmcsa_fl_api.csv` | FMCSA census, FL, 287,917 rows × 145 fields | 105 MB |
| `raw/ucc_fl.csv` | FL `debt_event` export from local `quintel-prod` (67,126 filings) | 20 MB |
| `raw/dbpr/CONSTRUCTIONLICENSE_1.csv`, `_2.csv` | DBPR licensee extracts (latin-1; `_1` authoritative) | 58 MB |
| `raw/fdep_septic_business.csv`, `raw/fdep_septic_contractors.csv` | FDEP septic registries | small |
| `raw/exclusions/prod_touched.csv` | Companies already touched in prod (incl. the 100 sent 2026-08-27) | 148 KB |
| `raw/exclusions/WIP Apr 7 list update Apr 13.xlsx` | David's April vendor list with his verification comments | 256 KB |
| `sunbiz/cordata/cordata0..9.txt`, `sunbiz/corevt.txt` | Sunbiz quarterly corporate file + events file (SFTP, public creds) | ~26 GB |
| `work/parts/`, `work/sunbiz_fl.csv`, `work/sunbiz_officers.csv`, `work/sunbiz_aliases.csv` | Parsed Sunbiz | ~8 GB |
| `work/fmcsa_norm.csv`, `work/ucc_norm.csv`, `work/_load_*.csv`, `work/_cargo.csv` | Normalised loads | |
| `work/exclusions_all.csv`, `work/exclusions_david.csv`, `work/vendor_baseline_david.csv` | Suppression table and David's labelled baseline | |
| `work/dbpr_county_map.csv` | DBPR county code → name, derived empirically | |
| `work/c2_batch.csv` | The 640-row enrichment batch | |
| `work/web/<NAME>|<CITY>.json` | Places responses, one per company (633) | |
| `work/twilio_cache.json` | Every Twilio lookup, incl. 429s (three-state source of truth) | |

## `out/` — deliverables and audit trail

| File | Rows | Audience | What |
|---|---:|---|---|
| `FL_PHONE_TEST_50_2026-09-04.csv` | 50 | David | The call list (post-fix). 32 columns, no verdict columns. |
| `BENCH_25.csv` | 25 | David | Replacements |
| `CONTINUATION_POOL.csv` | 391 | David / batch 2 | 101 verified phones, 290 unchecked (Twilio trial) |
| `README.md` | | David | Column legend, arms, SIC mapping, what was not done, row-review note |
| `FL_PHONE_TEST_50_SOURCES.md` | | David | Sources, pull dates, how a row was built, limits |
| `SOURCE_SCORECARD.md`, `INTERSECTION_COUNTS.md`, `FL_POOL_v1_STATS.md` | | both | Coverage per source, arm sizes, pool counts by exclusion reason |
| `FL_POOL_v1.csv` | 134,719 | audit | Full pool with `exclusion_reason` (83,987 eligible) |
| `FL_POOL_v2_EQUIPMENT.csv`, `_v3_CONTACT.csv`, `_v4_SIGNALS.csv` | 640 | audit | Stage outputs; v4 is the source for C5/C5b |
| `SIGNALS.csv` | 3,200 | audit | One row per company per signal |
| `RUN_RETRO_INTERNAL_2026-09-03.md` | | internal | Retrospective + §12 post-run row read |
| `.pre_fix_*.csv` | | internal | Outputs before C5b; delete after verdicts |

## Rules that hold across the folder

- No demographic fields anywhere. No guessed emails. No LinkedIn-derived vendors.
- Three-state booleans (verified true / verified false / not checked). Never encode "API did not answer" as false.
- No composite score until David's verdicts exist. Per-signal features only.
- Read ten finished rows before anything ships.
- David asked not to be recorded; his phrasing stays in internal files.

### Added 2026-09-09
| Path | What |
|---|---|
| `out/verdicts/david_v2_2026-09-09.csv` | David's call report on the v2 50, scored: outcome, human/owner reached, cash buyer, hang-up, CRM hit, his comment verbatim |
| `AGENDA_DAVID_2026-09-10.md` | Agenda + first-read analysis sent before the 09-10 call |
| `EMAIL_INFRA_PLAN_2026-09-09.md` | Email channel: build vs buy, seven pieces, brand decision, gates, order of work |
| `scripts/c5e_ohio.py` | Alek's lender-first Ohio list → FMCSA re-verify, Twilio line+CNAM, hand-read `fit_flag` → `out/OH_PHONE_TEST_50_LIEN_2026-09-09.csv` |
| `data/work/ohio_alek_raw.csv`, `data/work/ohio_census.json` | Alek's raw export; FMCSA census rows for its 50 USDOTs |
| `EMAIL_TO_DAVID_OHIO_2026-09-09.md` | Cover email for the Ohio list |
| `gameplan.md` | **Start here.** Living doc: thesis, the bar, timeline, what we learned (fact vs inference), David's box, system design, intent layer, experiment queue, roadmap, strategy, risks |
| `EMAIL_TO_DAVID_FOLLOWUP_2026-09-10.md` | Post-call follow-up: the number, action items both sides, division of labour |
| `runbook_entity_search.md` | Self-contained instructions for the entity-first signal search (Exa): cohorts, queries, families, report |
| `runbook_signal_feeds.md` | Self-contained instructions for the feed-discovery search (Strategy 2): feed catalog, per-feed validation, join tests, report |

### Added 2026-09-10 (Strategy 2 / E9 first run)
| Path | What |
|---|---|
| `out/SIGNAL_FEEDS_REPORT_2026-09-10.md` | E9 report: 4 feeds scored (F1/F2/F3 FL, F6 OH). Finding: feeds = timing overlay on the pool, not a discovery engine; build FDOT+OSTDS scrapers as timing joins; case-study 50 is the timing-vs-discovery test |
| `scripts/feeds_join.py` | Reusable feed join+score: any feed CSV → Sunbiz/FMCSA/UCC/pool joins + §6 scorecard. FL local; OH via live FMCSA Socrata (`az4n-8mr2`) + Alek's 50-row UCC. Uses `normalize.py`; CAPTIVE/BANKLIKE/EF_HOUSE regexes copied from `c5c_v2_select.py` |
| `scripts/feeds_calibration.py` | §7 case-study-50 calibration; re-run when `data/raw/pcf_case_study_50.csv` arrives |
| `data/work/feeds/raw/<F1..F6>/<state>/` | Raw pulls (HTML/PDF/txt) + `pull.json` per feed |
| `data/work/feeds/F{1,2,3,6}_{FL,OH}.csv`, `*.joined.csv`, `scorecard.json` | Extracted feed rows (runbook columns) and joined/scored outputs |

### Added 2026-09-10 (Ohio verdicts / Strategy 3)
| Path | What |
|---|---|
| `data/raw/david_oh_2026-09-10.xlsx` | David's Ohio call sheet as received (his LP/GM/9 Mo columns, colours, comments) |
| `out/verdicts/david_oh_2026-09-10.csv` | Ohio 50 scored into the verdict taxonomy + `fit_flag`, lien age, lender; hand-read human/owner flags |
| `runbook_county_census.md` | Strategy 3 / E10: per-county long-tail source census, LLM extraction, decision rule, source registry |

### Added 2026-09-11 (Wisconsin)
| Path | What |
|---|---|
| `david-data-template.xlsx` | David's call-sheet template as sent (sheets: `Data` 19 cols he fills LP/GM/Last Contact/SIC/Comments; `Compare` his working formulas). The batch schema from WI on. Copy also at `data/raw/david_template_fields.xlsx` |
| `data/work/wi_alek_raw.csv`, `data/work/wi_fmcsa.json` | Alek's WI export; FMCSA name-match results |
| `scripts/c5f_wi.py` | WI list → Twilio line+CNAM, FMCSA match, David's template first + our columns → `out/WI_PHONE_TEST_50_2026-09-11.csv` |
| `email_to_david_wi_2026-09-11.md` | Cover email + updated action items and agenda |

### Added 2026-09-14 (FL 100 intent batch)
| Path | What |
|---|---|
| `data/work/fl100_alek_raw.csv` | Alek's FL 100 as sent (WI format + intent layer: `alek_signal`, `lender_note`, his `fit_flag` taxonomy) |
| `scripts/c5g_fl100.py` | Fills Twilio line/CNAM on Alek's FL 100; writes internal full + David-facing blind copy |
| `out/FL_PHONE_TEST_100_2026-09-14.csv` | Internal full (keeps intent columns for verdict join) |
| `out/FL_PHONE_TEST_100_DAVID_2026-09-14.csv` | David-facing: template + verification intel, **intent columns stripped** (blind test) |
| `email_to_david_fl100_2026-09-14.md` | Cover email |

### Added 2026-09-15 (FL + CO partial verdicts)
| Path | What |
|---|---|
| `data/raw/david_{fl,co}_partial_2026-09-15.xlsx` | David's FL-100 and CO-100 call sheets as returned mid-call (FL first 50, CO first 28) |
| `scripts/c5j_verdicts.py` | Scores either partial sheet into the verdict taxonomy + joins the internal intent columns (`alek_signal`/`fit_flag`/lien age). Colour map handles both workbooks' theme palettes; dedupes the 4 FL duplicate pairs. `fl`/`co` arg |
| `out/verdicts/david_{fl,co}_partial_2026-09-15.csv` | Scored verdicts. **Finding (gameplan §4.11): event tags predict, lien timing doesn't; CO 21% CRM-overlap** |

File naming from 2026-09-10: lowercase filenames (`gameplan.md`, `runbook_*.md`); older upper-case files kept as-is.

### Added 2026-09-19 (FL 100 completed)
| Path | What |
|---|---|
| `data/raw/david_fl_completed_2026-09-19.xlsx` | David's completed FL-100 call sheet (all 100 rows; theme8 = funded) |
| `out/verdicts/david_fl_completed_2026-09-19.csv` | Scored via `scripts/c5j_verdicts.py flc` (new `flc` config). **Finding (gameplan §4.12): event tags hold at n=28 (18% dead vs 57%); tree = base rate; 13% wrong-number rows** |

### Added 2026-09-18 (Texas)
| Path | What |
|---|---|
| `scripts/c5k_tx.py` | Alek's TX top-50 (WI format, CST) → Twilio line+CNAM overwriting his inference → internal `out/TX_PHONE_TEST_50_2026-09-18.csv` + blind David copy `out/TX_PHONE_TEST_50_DAVID_2026-09-18.csv`/`.xlsx`. Blind copy required: per-row `fit_flag`/`alek_signal`/`lender_note` would confound verdicts. |
| `data/work/tx50_alek_raw.csv` | Alek's raw export as received (2026-09-18) |
| `EMAIL_TO_DAVID_TX_2026-09-18.md` | Cover email for the Texas list |
