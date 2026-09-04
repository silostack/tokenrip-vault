---
title: Batch 1 — source evaluation, intent-signal evaluation, scoring architecture, tooling, and prompt pack
date: 2026-09-03
type: analysis + execution spec
supersedes: the source and intent sections of active/batch1-florida-build-plan-2026-09-03.md
inputs: Alek's prompt pack and assignment memo · Simon's FL UCC buy-box file sample (PCF_buybox_fit_FL_2026-07-11) · quintel-prod checks · web research on Sunbiz, FMCSA, FDEP, DBPR, PPP, FDOT, Places, Exa, Twilio (2026-09-03)
---

# Anchor on the intersection of three registries, record signals per source, and let David's verdicts set the weights

## 1. Source evaluation

Scored on what each source contributes downstream (identity key, liveness, owner, phone, email, industry, size, time in business, why-now), coverage of Providence's owner-operator ICP, and cost of access.

| Source | Key | Liveness | Owner | Phone | Email | Industry | Size | TIB | Why-now | Access | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **FMCSA carrier census** (FL rows) | DOT number | MCS-150 date (must refile every 2 yrs) | registrant name (often the owner at small carriers) | **yes (SMS CSV only; not on the API)** | **yes (SMS CSV only)** | cargo class + name | **power units, drivers** | add date | fleet delta, new DOT | free CSV, monthly; connector exists | **Anchor for truck lanes** (A vac/hydrovac, B dump, C roll-off/tow, septic pumpers). Only public source with phone + email + fleet on one keyed row. Gap: intrastate vehicles under 26,001 lbs are exempt. |
| **FL UCC buy-box file** (ours) | filing number; debtor name + city | none | none | none | none | none (name only) | none | none | **modeled renewal window, PCF grade, secured party, lender class** | already built (07-11 run) | **Why-now overlay + credit proxy.** Not a discovery anchor on its own: no owner, phone, or liveness. |
| **Sunbiz** corporate file | document number; FEI | **status A/I**, last transaction | **up to 6 officers with titles** | none | none | none | none | **file date** | new DBA / affiliate LLC (daily file) | free SFTP (Public / PubAccess1845!), quarterly + daily; fixed-width 1440 chars | **Master identity and liveness table.** Verifies everything, discovers nothing. |
| **FDEP septic business authorizations + contractor registrations** | registration no. | active filter | **contractor = a person** | partial | none | septic, exact | none | none | none | free download, filter by status/zip | **Anchor for septic installers** (lane A). Program moved DOH → DEP in 2024. |
| **DBPR licensee extract** (Construction Industry Licensing Board) | license no. | status, expiry | **qualifier = a person** | usually | none | license class (CUC = underground utility & excavation; CGC/CBC; CFC plumbing; demolition) | none | issue date | new class / upgrade | free, but Cloudflare-walled: download once by hand | **Anchor for excavation / utility / plumbing** (lanes A, E) that run iron but not >26K-lb trucks. |
| **Water well contractors** (FDEP clearinghouse + 5 WMD lists) | license no. | active lists | person | some | none | drilling, exact | none | none | none | free PDFs/web lists, small | Lane A/E supplement. Hundreds of rows statewide. |
| **SBA PPP loan-level** (FL) | none (name + address) | **none — 2020–21 vintage** | none | none | none | **NAICS** | **jobs reported** | business age flag | none | free CSV, 12 files | Industry and size backfill for rows from other anchors. Never liveness, never contact. |
| **FDOT prequalified contractors** | vendor no. | current | none | some | none | work classes | none | none | prequal = bidding public work | free CSV | Lane B supplement; small list. |
| **Google Places API** | place id | **business status** | none | **yes** | none | categories | reviews (proxy) | none | photo/review velocity (weak) | Text Search $32/1K, Details Essentials $5/1K, 5K free/mo each | Website + phone + open/closed for every candidate. Per-row, not bulk. |
| **Exa** | url | none | site "about" page | site | site | site text | site text | site text | news, hiring pages | search $7/1K, contents $1/1K page, $20 free | Find the site and the equipment pages; pull text for the LLM. |
| **Twilio Lookup v2 / numverify** | phone | mobile active/inactive (line_status); landlines unknown | none | **validity, line type, carrier** | none | none | none | none | none | $0.008/lookup + line_status | Lookup, not Verify. The gate David's April sheet was missing (NIS, wrong area code). |
| Apollo / ZoomInfo / B2B Rocket / LinkedIn | — | — | stale | wrong | wrong | — | **synthetic** | — | IP-based noise | paid | Out. David's 18 months; the April list's revenue and employee bands are derived from each other. |

**Best possible row, by lane**

| Lane | Anchor (discovery + contact) | Overlay (why-now, credit) | Verify (liveness, owner, TIB) | Enrich (site, equipment, status) |
|---|---|---|---|---|
| A · vac / hydrovac / septic pumping | FMCSA (FL, cargo or name) + FDEP septic authorizations | UCC buy-box file | Sunbiz | Places + Exa + LLM |
| A · excavation / utility / drilling | DBPR CUC + well-contractor lists | UCC buy-box file | Sunbiz | Places + Exa + LLM |
| B · paving / dump / heavy civil | FMCSA (dump, aggregates) + FDOT prequal | UCC buy-box file | Sunbiz | Places + Exa + LLM |
| C · roll-off / towing | FMCSA (refuse, tow cargo classes) | UCC buy-box file | Sunbiz | Places + Exa + LLM |

**The triangulated pool.** A company in an anchor registry ∩ the UCC buy-box file ∩ Sunbiz active is the highest-confidence row public data can produce: it has trucks or a license, prior equipment credit with a dated renewal window, a living entity, and a named owner, before any web lookup. Its size is the smoke test.

## 2. Options for batch 1

| Option | What you ship | Pass likelihood on David's 50% bar | What you learn about sources | Cost tonight |
|---|---|---|---|---|
| **A. Intersection only** | 50 rows from anchor ∩ UCC ∩ Sunbiz-active | highest | little: no variation between rows | lowest once the joins exist |
| **B. Source arms** | 3 arms of ~17: intersection / anchor-only (no UCC) / UCC-only (no anchor) | lower: UCC-only rows have no phone or email from a registry | most: reach rate by anchor, directional at n≈17 | same joins plus more web lookups |
| **C. Smoke test first, then A or B** | 1–2 h measuring each source's yield and join rate, then choose | as A or B | a source scorecard before spending web lookups | +1–2 h |
| **Recommended: C then 30/10/10** | 30 intersection, 10 anchor-only, 10 UCC-only; every row carries source flags | high (30 of 50 are the strongest rows possible) | directional read on whether a registry anchor beats UCC alone for contactability; confirmed at 200 rows in batch 2 | ~5 h total |

Why not pure A: with no variation you cannot tell whether the registries earned the pass or the web lookups did. Why not pure B: 17-row arms with a UCC-only arm that lacks registry contact data risks failing the bar for a reason we already understand. The 30/10/10 split keeps the pass likely and buys a first read on the source question.

## 3. Intent-signal evaluation

The frame: for owner-operators the purchase trigger is usually invisible ("truck broke today"). No public signal catches it. Signals therefore do two jobs: rank who gets touched first, and date a re-contact. Value = timing precision × lead time × coverage in our pool × specificity to an equipment purchase. Cost = acquisition effort + entity-resolution difficulty + refresh burden.

| Signal | What it dates | Lead | Precision | Coverage (our pool) | Acquisition | Entity match | Verdict |
|---|---|---|---|---|---|---|---|
| **UCC renewal window** (our dueness model: median gap, ripe date, in-window flag) | end of an equipment term → refinance / buyout / replace | months | medium (modeled, calibrated on gap history; not a guess from age alone) | ~100% of UCC-anchored rows by construction | already built | done | **Use. Primary ranking key.** Report the model's own confidence (n_future_filings, median_gap_months) rather than a flat score. |
| **UCC termination** (paid off) | capacity to borrow again | weeks–months | medium | subset of the same file | same file | done | **Use** as a second UCC feature. Same source, no extra cost. Do not sum it with the renewal window: same event family. |
| **FMCSA power-unit delta** (MCS-150 vs prior) and **new DOT / new authority** | fleet grew or a new hauling operation started | 0–6 months (purchase often already made; next one follows) | medium-high | high in truck lanes | free monthly file; keep two snapshots | **DOT number, deterministic** | **Use.** Cheapest high-precision company-level signal for lanes A–D. Connector exists; widen it to FL intrastate. |
| **Permits naming the contractor** (FDEP septic permits last 30 days; county ROW / utility / demolition) | job volume now | 0–3 months | high for lane A | medium (installers only) | free county-by-county; Shovels.ai aggregates for a fee | name match, moderate | **Use for lane A** once the FDEP permit feed is scripted. Batch 2. |
| **Public contract awards** (FDOT lettings, county bid tabs, SAM.gov) | work in hand that needs iron | 1–6 months | high | low-medium (lane B, larger firms) | FDOT monthly results; SAM.gov connector exists | name match, moderate | **Use for lane B.** Batch 2. |
| **SBA 7(a)/504 recent approval** | a bank said yes to growth | 0–12 months | medium | low | free FOIA CSV, quarterly | name + city | Cheap; add in batch 2 as a feature, low weight. |
| **New DBA / affiliate LLC / second address** (Sunbiz daily) | expansion | 3–12 months | low-medium | medium | free once Sunbiz daily is loaded | officer/agent match | Batch 2 feature. Cheap, weak. |
| **County demand** (BEAD subgrantees, SRF commitments, FDOT work program, bond referenda, permits volume) | money entering the lane in that county | 6–24 months | low per company | everyone in the county | a handful of tables | none needed | **Use as a covariate, not a signal.** One index per county; helps ordering, never selection. |
| Hiring (operators, CDL) | crew growth | 0–3 months | medium | **low hit rate** for 6-person shops | scraping job boards; ToS risk | name match, poor | **Skip.** Low hit, high cost, exactly as Simon said. |
| Selling own unit (Machinery Trader, IronPlanet, Ritchie, Marketplace) | replacing a machine | 0–3 months | high when true | low; sellers are often dealers | scraping listings | **poor** (seller identity) | **Skip** until a resolvable feed exists. |
| Google photo / review velocity | growth (weak) | — | low | medium | Places Details per row | done | **Skip.** Costs per row, says little. |
| OSHA new-site inspection | new job site | 0–3 months | low for equipment | low | free bulk | name match | Skip. |
| FEMA declaration in county | debris and emergency work | 0–6 months | low per company | everyone in the county | free (connector exists, currently failing 403) | none | Covariate only, hurricane season. |
| AI-search / web-intent vendors | someone in the building searched | — | **noise** (David's Thai restaurant) | — | paid | wrong | **Out.** |
| **Manufactured intent** (replies, clicks on the 10–12 touch cadence) | the need buyer surfacing | now | **highest** | grows with sends | our domains, after the phone test | done | The real catch for "truck broke today." Every other signal exists to order the cadence, not replace it. |

**Top signals for the first run**

1. **UCC renewal window** (already computed; carry the model's own confidence fields).
2. **FMCSA fleet delta / new DOT** (deterministic key, free, monthly; widen the existing connector to Florida intrastate and keep two snapshots).
3. **One permit-or-award feed per lane** (FDEP septic permits for A, FDOT lettings for B), batch 2, once the first two are flowing.

UCC termination rides along at no cost. County demand is a covariate. Everything else waits for evidence that the first three lift anything.

## 4. Scoring architecture: per-signal features, no composite yet

Alek's composite (renewal 3 + termination 2 + fleet growth 3 + hiring 2 …) has three problems now: the weights are invented, correlated signals double-count (renewal and termination are one event family), and a sum hides which signal actually worked, which is the one thing David's grading can teach us.

**Store per signal, per company:**

```
signal_id · company_id · present (bool) · observed_date · strength (0–1, source-specific rule) ·
confidence (source-specific: n_future_filings for UCC, MCS-150 recency for FMCSA) ·
source · url · first_seen · last_seen
```

**Derive per company:** `signals_present` (count), `max_signal_strength`, `most_recent_signal_date`, `top_signal_text` (one sentence for the call), and the county `demand_index` as a separate column.

**Rank for the batch:** source tier first (intersection > anchor-only > UCC-only), then `max_signal_strength`, then `signals_present` as the corroboration tiebreaker. No weighted sum.

**After David's verdicts:** compute reach rate and in-market rate by signal presence and by source. That table is the score per signal source. When there are a few hundred graded rows, fit weights (a plain logistic regression on `in_market`) and only then publish a composite, with the fitted weights and their sample size printed next to it.

## 5. Tooling for Claude Code

| Tool | Purpose | Cost | What to provide |
|---|---|---|---|
| **Quintel SQL hatch** (`quintel_agent_query`) | bulk pull of FL UCC buy-box rows and companies | — | **Fix the password first.** Currently every query fails; the MCP browser tools work but page at 100. |
| **FL UCC buy-box CSV** (the 07-11 run) | why-now overlay + PCF grade | — | Path to the file, or re-run the job for FL. |
| **Sunbiz SFTP** | identity, liveness, owners, TIB | free | `sftp.floridados.gov`, user `Public`, password `PubAccess1845!`. Quarterly cor files (10 parts, fixed-width 1440) under `doc/cor`; daily `yyyymmddc.txt`. Record layout: dos.sunbiz.org/data-definitions/cor.html. |
| **FMCSA census CSV** | truck-lane anchor: phone, email, fleet | free | Download from the SMS Tools downloads page (bot-walled; browser download) or reuse the connector's landing files. Two monthly snapshots for fleet delta. Confirm field list against the connector code. |
| **FDEP septic lists** | lane A anchor | free | `prodapps.dep.state.fl.us/ocp/reports/accesspublic/OSP/B_public_license_data` (business authorizations) and `/Public_license_data` (contractor registrations). Filter active. |
| **DBPR extracts** | excavation / utility anchor (CUC etc.) | free | `www2.myfloridalicense.com/sto/file_download/` is Cloudflare-walled: download the Construction Industry Licensing Board extract by hand once; readme at `/sto/documents/readme.pdf`. |
| **SBA PPP CSVs** | NAICS + size backfill | free | data.sba.gov/dataset/ppp-foia; filter `BorrowerState = FL`. |
| **FDOT prequal CSV** | lane B supplement | free | fdotwp1.dot.state.fl.us/contractorprequalification/public/PrequalifiedVendorSearch.aspx → CSV download. |
| **Google Places API key** | website, phone, business status, categories | Text Search $32/1K, Details Essentials $5/1K, 5K free/mo each | Enable Places API (New); restrict the key; budget alert at $50. Use Text Search once per company, Details Essentials for phone/website/status. |
| **Exa API key** | find the site and equipment pages; pull page text | search $7/1K, contents $1/1K page; $20 free + $10/mo | Prefer `search` with `includeDomains` unset and `numResults` 3, then `contents` with `text` only (one content type = one charge). |
| **Twilio Lookup** (or numverify / AbstractAPI) | phone validity, line type, carrier | $0.008/lookup | Account SID + auth token; Line Type Intelligence package only. |
| **Email verifier** (MillionVerifier / ZeroBounce / NeverBounce) | site-listed emails only in batch 1; all emails in batch 2 | ~$0.005–0.01/verify | Defer to batch 2 unless the FMCSA email field is used, in which case verify those 50. |
| **DuckDB** (local) | joins across fixed-width Sunbiz, CSVs, and prod exports | free | `pip install duckdb`; it reads fixed-width via `read_csv` with explicit widths or a small Python shim. |
| **Verdict sheet** | David's grading surface | free | Google Sheet with locked columns, or a Tokenrip Surface with the verdict fields as inputs. He asked for database fields, not Excel. |
| **Slack** | comms | — | Alek is creating the Quintel workspace. |
| Not needed | Apollo, ZoomInfo, LinkedIn scrapers, OpenCorporates (Sunbiz is free), Shovels.ai (batch 2 only if county permits prove out) | | |

Environment variables to set before running the pack: `GOOGLE_PLACES_API_KEY`, `EXA_API_KEY`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `QUINTEL_DB_URL` (once the hatch works), `SUNBIZ_SFTP_PASS`.

## 6. Prompt pack (recommended approach)

> Superseded by the step-by-step playbook with prerequisites and acquisition commands: [[active/batch1-playbook-2026-09-03]]. Kept here for the reasoning; run the playbook.

Run in order. Each step reads the prior step's files and writes new ones plus a `_STATS.md`. Every field on every row carries `*_source` and `*_url`. No row is deleted; rows leave with an `exclusion_reason`.

### S0. Source smoke test (60–90 min)

```
ROLE: data engineer sizing sources for a Florida owner-operator equipment-finance pool.
INPUTS: FL UCC buy-box CSV (PCF_buybox_fit_FL_2026-07-11) · Sunbiz quarterly cor files · FMCSA census CSV (PHY_STATE = FL) · FDEP septic business authorizations (active) · DBPR construction extract (license types CUC, CGC, CBC, CFC, demolition) · optional: SBA PPP FL rows, FDOT prequal CSV.
DO:
1. Load each source into DuckDB. Normalize names: uppercase; strip quotes, punctuation, whitespace; strip INC/LLC/CORP/CO/LTD/L.L.C./DBA suffixes. Derive city from address where present.
2. Tag lane words on names: A_vac (hydro, vac, vacuum, pump, septic, sewer, drain), A_dirt (excavat, grading, site, land clearing, underground, utility, dirt, tractor, trackhoe, backhoe, dozer, well, drill, boring), B (paving, asphalt, concrete, milling, haul, dump, aggregate), C (tow, wrecker, recovery, roll-off, dumpster, waste, sanitation, portable). For FMCSA also use cargo class flags where present.
3. For each source report: total FL rows; rows with a lane tag; rows with phone; with email; with an officer/qualifier/registrant name; with a size field (power units, jobs).
4. Join rates: each source → Sunbiz on normalized name + city (fallback: name only, flag ambiguity when >1 Sunbiz match); each source → UCC buy-box on normalized name + city. Report match %, and how many matched Sunbiz rows are status A.
5. Intersections: anchor ∩ UCC ∩ Sunbiz-active per lane. Report counts.
OUTPUT: SOURCE_SCORECARD.md (one table: source · rows · lane-tagged · has phone · has email · has owner · has size · Sunbiz join % · Sunbiz active % · UCC join %) and INTERSECTION_COUNTS.md by lane. Recommend the anchor per lane from the numbers. Do not proceed to S1 until both files exist.
```

### S1. Triangulated pool (30 min)

```
ROLE: build FL_POOL_v1.csv from the S0 joins.
INCLUDE: every FL company that is (a) in an anchor registry (FMCSA FL, FDEP septic, DBPR CUC/related) with a lane tag, or (b) in the UCC buy-box file with a lane tag. Union, then dedupe on normalized name + city; keep all source flags as booleans; record merged ids.
TIER: intersection = anchor ∩ UCC ∩ Sunbiz-active · anchor-only = anchor ∩ Sunbiz-active, no UCC · ucc-only = UCC ∩ Sunbiz-active, no anchor. Sunbiz status I → exclusion_reason = inactive.
CARRY: prod_company_id (if in prod), sunbiz_doc_number, status, file_date → tib_years, entity_type, principal address, county, officers 1–6 with titles, registered agent; FMCSA: dot_number, phone, email, power_units, drivers, mcs150_date, carrier_operation, cargo flags; FDEP/DBPR: registration/license no., type, holder name, expiry; UCC: filing_number, filing_date, secured_party, lender_class, pcf_grade, score, ripe_date, dueness, n_future_filings, median_gap_months, kill_reason.
OWNER: officer titled P / PRES / MGR / MGRM / OWNER / CEO / AMBR from Sunbiz; else FMCSA registrant; else license holder. owner_source names which.
EXCLUDE (reason logged, row kept): restricted words in name (freight, transport, logistics, solar, marine, medical, dental, salon, spa, gym, cannabis, vending, nonprofit, church, county, city of, school); Sunbiz inactive; principal address outside FL; already on David's WIP Apr 7 list, the 08-31 pilot deliverable, the Top100/Top140 (match domain, phone, then name + city).
OUTPUT: FL_POOL_v1.csv, FL_POOL_v1_STATS.md (rows per tier per lane, exclusions by reason, owner-named rate, phone-present rate, email-present rate).
```

### S2. Equipment and web contact, candidates only (60–90 min)

```
ROLE: equipment classifier and contact finder. INPUT: FL_POOL_v1.csv rows not excluded, ordered intersection → anchor-only → ucc-only, capped at ~150 (target 90 intersection, 30 anchor-only, 30 ucc-only).
PER COMPANY:
1. Google Places Text Search: "<legal or DBA name> <city> FL". Take the top result only if name similarity ≥ 0.8 and city matches; else places_found = false. Details Essentials: business_status, website, formatted_phone_number, types.
2. If no website from Places: Exa search "<name> <city> Florida" numResults 3; accept a domain only if the page names the company and the city or a Sunbiz officer.
3. Exa contents (text only) on the site's services / fleet / equipment / about pages (max 4 pages).
4. LLM extraction with a fixed JSON schema: equipment_quote (verbatim, ≤ 200 chars), equipment_url, equipment_class (HYDROVAC_VAC, EXCAVATION_SITEWORK, PAVING_MILLING, CONCRETE_PUMP, DUMP_HAUL, ROLLOFF_WASTE, TOW_RECOVERY, DRILLING, CRANE_LIFT, PORTABLE_SANITATION, SPRAY_FOAM_RIG, GENERATOR_PUMP_RENTAL, RECYCLING_PROCESSING, SERVICE_VAN_ONLY, HAND_TOOL_TRADE, NONE_FOUND), confidence (HIGH: units named or counted; MED: equipment named; LOW: trade implies; NONE), fleet_units_stated, brands_seen, dealers_named, owner_name_on_site, cfo_or_controller_on_site (bool), franchise_or_national (bool), restricted_equipment_seen (bool).
5. equipment_pass_result: PASS (HIGH/MED in lane) · UNVERIFIED (LOW/NONE, kept) · OUT (SERVICE_VAN_ONLY, HAND_TOOL_TRADE, restricted, franchise, business_status = CLOSED_PERMANENTLY, cfo_or_controller_on_site).
RULES: a company name is not evidence; every PASS has a quote and a URL; FMCSA power_units ≥ 2 with an in-lane cargo class counts as MED evidence even with no website (quote the census row).
OUTPUT: FL_POOL_v2_EQUIPMENT.csv (+ places_found, business_status, website, places_phone, exa_urls, all extraction fields), FL_POOL_v2_STATS.md (pass/unverified/out by tier and lane; evidence source distribution).
```

### S3. Contact verification (20 min)

```
ROLE: verify contact fields. INPUT: FL_POOL_v2_EQUIPMENT.csv, PASS and UNVERIFIED rows.
PHONE: candidates in order: FMCSA telephone, Places phone, site phone. For each: Twilio Lookup Line Type Intelligence → valid, line_type (landline/mobile/voip), carrier. phone_area_code_ok = area code in {239,305,321,352,386,407,448,561,656,689,727,754,772,786,813,850,863,904,941,954}. Choose the first valid candidate; record phone_source and all candidates tried.
EMAIL: FMCSA email and any site-listed email only. MX check on the domain; syntax check. No guessed addresses. email_source recorded.
WEB: website resolves (HTTP 200/301 to same domain).
OUTPUT: FL_POOL_v3_CONTACT.csv (+ phone, phone_source, phone_valid, line_type, carrier, phone_area_code_ok, email, email_source, mx_ok, site_ok), FL_POOL_v3_STATS.md (valid-phone rate by phone_source and by tier; email-present and mx_ok rates).
```

### S4. Signals, one row per signal (20 min)

```
ROLE: write per-signal features; do not compute a composite. INPUT: FL_POOL_v3_CONTACT.csv.
SIGNALS (one row each in SIGNALS.csv: company_id, signal_id, present, observed_date, strength 0–1, confidence, source, url):
- ucc_renewal_window: present if in UCC file; observed_date = ripe_date; strength = clamp(dueness, 0, 1) if in_window_now else 0.5 × clamp(dueness,0,1); confidence = n_future_filings and median_gap_months carried as text.
- ucc_termination_12mo: present if a termination for the debtor in the last 12 months (from the UCC file if available, else skip and note).
- fmcsa_fleet_delta: present if two census snapshots exist and power_units increased; strength = min(1, delta / max(prior, 1)); observed_date = mcs150_date.
- fmcsa_new_dot_12mo: present if FMCSA add_date within 12 months; strength 0.7.
- fmcsa_mcs150_recent: present if mcs150_date within 6 months; strength 0.3 (freshness, not intent; keep separate).
- county_demand_index: 0–5 per county from the few tables available tonight (FDOT work program lettings next 12 months; BEAD subgrantee counties; current FEMA declarations). Stored on the company row as a covariate, not in SIGNALS.csv.
DERIVE per company: signals_present, max_signal_strength, most_recent_signal_date, top_signal_text (one sentence, e.g. "Equipment financing with Kubota Credit filed 09/2023; renewal window opened 07/2026").
OUTPUT: SIGNALS.csv, FL_POOL_v4_SIGNALS.csv (company row + derived fields + demand_index), FL_POOL_v4_STATS.md (signal presence by tier; strength distribution).
```

### S5. The 50 (20 min) + morning re-verify

```
ROLE: select and document. INPUT: FL_POOL_v4_SIGNALS.csv.
ELIGIBLE: equipment_pass_result in (PASS, UNVERIFIED with FMCSA MED evidence) · Sunbiz active · owner_name present with owner_source · phone_valid and phone_area_code_ok · not excluded.
ARMS: 30 intersection · 10 anchor-only · 10 ucc-only. Within each arm order by max_signal_strength desc, then signals_present desc, then county_tier (RURAL > SMALL_METRO > BIG_METRO), then tib_years in 5–15 first.
LANE MIX target across the 50: ~30 lane A, ~10 B, ~5 C, ~5 other; do not break arm sizes to hit it.
BENCH: next 15 eligible rows, same ordering.
RE-VERIFY (morning of 09-04): Sunbiz status still A; Places business_status not CLOSED_PERMANENTLY; site resolves; phone still valid. Replace from bench; log swaps.
OUTPUT: FL_PHONE_TEST_50_2026-09-04.csv with columns: company, dba, owner_name, owner_title, owner_source, phone, phone_source, line_type, email, email_source, city, county, county_tier, lane, tier (arm), equipment_class, equipment_quote, equipment_url, fleet_units_stated, power_units, tib_years, ucc_secured_party, ucc_filing_date, ucc_ripe_date, top_signal_text, signals_present, selection_reason; then David's blank fields: reached, right_poc, phone_ok, email_ok, in_market, buying_what, buying_when, corrected_phone, corrected_poc, notes.
Also: FL_PHONE_TEST_50_SOURCES.md (every source, file, pull date, row count) and BENCH_15.csv.
```

### S6. Ingest verdicts (after David returns the sheet)

```
ROLE: turn David's fields into labels and a source scorecard.
LABELS: per company: contactable (reached AND right_poc), phone_ok, email_ok, in_market, with grader = david, date, and the corrections applied to contact records with provenance = david_verification.
SCORECARDS: reach rate and right-POC rate by tier (arm), by phone_source, by owner_source, by lane, by county_tier; in_market rate by each signal_id present vs absent, and by signals_present count.
OUTPUT: VERDICT_SCORECARD.md. Feed corrections back to prod as issues (duplicates, bad phones, wrong entities) with root cause.
```

## 7. Where this leaves Alek's pack

Keep P1, P2, and P4 as written for batch 2; they are the same rules as S2, S3, and S5 applied to a bigger pool. Replace P0's "every Florida company, no cap" with S0 + S1: discovery by registry anchor, verification by Sunbiz, why-now from the UCC model. Replace P3's composite with S4's per-signal table, and trim its list to the three signals above plus the county covariate until the verdicts say otherwise. Correct "FL DOH septic" to FDEP.
