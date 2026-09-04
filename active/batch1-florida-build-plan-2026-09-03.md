---
title: Batch 1 build plan — 50 verified Florida rows for David, due 2026-09-04 morning
date: 2026-09-03
type: execution plan
inputs: Alek's prompt pack (tokenrip.com/s/3dce1f3d…) · Alek's assignment memo (tokenrip.com/s/6774758e…) · quintel-prod as of 2026-09-03 evening · David's WIP Apr 7 list (dedupe source)
parent: active/providence-pool-first-debrief-2026-09-03.md (Quintel action #1)
---

# Invert the pack: select the 50 first, then run P0–P3 only on the candidates

> **Superseded in part (same evening):** source choice, intent signals, scoring, tooling, and the prompt pack now live in [[active/batch1-sources-signals-and-prompt-pack-2026-09-03]]. The anchor is a registry intersection (FMCSA / FDEP / DBPR ∩ UCC buy-box ∩ Sunbiz active), not a prod name-keyword pull. The step structure below still holds.

The prompt pack is the right roadmap and the wrong order for tonight. P0 as written ("every Florida company, do not cap") followed by per-company web research on all of them is weeks of work in front of a 50-row deliverable. Tonight's job is P4's selection criteria applied to what prod already holds, then P1 and P2 on about 150 candidates, then the cut. P0's full pool, the PPP/DBPR/DOH/FMCSA joins, and P3's signal table run next week for batch 2.

## What prod holds (checked 2026-09-03 evening)

| Fact                                                                                                                                                                                                                 | Consequence                                                                                                       |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 63,632 FL companies; the UCC-FL lane rows are "shell" identity scope: name, city, UCC filing number in the cluster key, band/score, sometimes a revenue estimate. No officers, phone, website, sector, or equipment. | Lane classification tonight is by name keyword, not by sector. Officers and contact come from Sunbiz and the web. |
| Name search works: "septic" 185, "excavat" 211, hydrovac/vacuum a handful, paving/asphalt/concrete/towing/trackhoe present in the construction list.                                                                 | Several hundred lane A/B/C candidates exist by name. Enough for 150 → 50.                                         |
| Filing year is in the cluster key (`ucc:FL:2023…`, `ucc:FL:2025…`).                                                                                                                                                  | UCC age 36–60 months (2021–2023 filings) is the pack's top intent signal and it is free tonight.                  |
| **SQL hatch down**: `quintel_agent_query` password auth fails; unreachable since ≥17:37 UTC.                                                                                                                         | Fix the password first. Fallback is the companies browser (100/page, `q=` keyword).                               |
| **Duplicates and dirty names** in UCC-FL: Roberts & Roberts ×2, Bay Area Trackhoe ×2, Huurr Homes ×3, M & M Asphalt ×2; quoted names with trailing spaces.                                                           | Normalize and dedupe before anything else. David's first complaint about vendor lists was duplicates.             |
| Contact enrichment provider returned nothing for 65 of ~92 contact attempts this week.                                                                                                                               | Do not rely on the provider for batch 1. Owner from Sunbiz, phone from site/Google Places, verified by lookup.    |

## The pipeline, tonight (about 4 hours)

**Step 0. Candidate pull (30 min).** From prod: FL companies whose normalized name matches lane keywords. Lane A: septic, excavat, grading, site prep, land clearing, underground, utility, hydro, vac, vacuum, pump, dirt, tractor, trackhoe, backhoe, dozer, well drill, directional, boring. Lane B: paving, asphalt, concrete, milling, hauling, dump, trucking (then check not general freight). Lane C: tow, wrecker, recovery, roll-off, dumpster, waste, portable toilet, sanitation. Carry: prod id, name, city, UCC filing number and year, band, score, revenue estimate. Prefer rows with an active UCC trigger and filing year 2021–2023. Target ~250 raw.

**Step 1. Normalize and dedupe (15 min).** Strip quotes, whitespace, punctuation, and INC/LLC/CORP/CO/LTD suffixes; uppercase; key on name + city; keep the row with the most recent trigger; record `merged_prod_ids`. Log the duplicate count (it becomes a prod issue).

**Step 2. Exclusions, cheap (15 min).** Name-level restricted terms (freight, transport, logistics, solar, marine, medical, salon, gym, cannabis, vending). Dedupe against David's WIP Apr 7 list (1,078 rows: domain, phone, name + city), the 08-31 pilot deliverable, and the Top100/Top140. Log `exclusion_reason`. Target ~150 candidates.

**Step 3. Sunbiz (45 min, scripted).** Entity search by name for each candidate: document number, status, filing date → `tib_years`, entity type, principal address, county, officers with titles, registered agent, DBAs. Drop inactive. Owner = officer titled P / PRES / MGR / MGRM / OWNER / CEO / AMBR. Every field carries `source=sunbiz` and the document URL. (Roadmap: the quarterly corporate data file replaces per-name search.)

**Step 4. Equipment and contact (60–75 min, ~150 LLM calls).** Google Places API by name + city: business status, website, phone, categories, review count. Fetch site pages (services / fleet / about). LLM extracts: verbatim equipment quote + URL, `equipment_class`, confidence, `fleet_units_stated`, brands and dealers, `cfo_present`, franchise flag, owner name on site (cross-check Sunbiz). PASS / UNVERIFIED / OUT per the pack. If no site and no Places hit, keep as UNVERIFIED with Sunbiz-only contact; do not drop.

**Step 5. Verify contact (15 min).** Phone: Twilio Lookup or equivalent for validity and line type; Florida area code check. Email: only if listed on the site; MX check on the domain; no guessed addresses in batch 1 (phone test only, per the pack). Website resolves (HTTP 200). Record `phone_source`, `phone_valid`, `line_type`, `mx_ok`.

**Step 6. Score and cut (30 min).** P2 scoring as written (size, owner named, TIB, credit proxies incl. non-bank secured party, county tier, preferred class, equipment confidence). Select 50: 30 lane A, 10 B, 5 C, 5 best of rest. Prefer RURAL / SMALL_METRO; prefer UCC 36–60 months; all with Sunbiz active, owner named, valid FL phone. Log why each row was chosen.

**Step 7. Morning re-verify (20 min, 09-04 early).** Sunbiz still active, Places not "permanently closed," site resolves, phone still valid. Replace failures from the bench and log.

**Step 8. Ship.** The P4 sheet, plus: `prod_company_id`, `ucc_filing_no`, `ucc_filing_year`, `ucc_age_months`, per-field `*_source` and `*_url`, `selection_reason`. David's fields blank: reached, right_poc, phone_ok, email_ok, in_market, notes, corrected_phone, corrected_poc. Share as a sheet he can edit; ingest verdicts as labels afterwards (debrief action #3).

## Tooling

| Need | Use | Why |
|---|---|---|
| Bulk pull | SQL hatch once fixed; else companies browser paging | Only path to prod today |
| Sunbiz | scripted entity search (search.sunbiz.org) for 150; quarterly data file for batch 2 | Free; officers + formation date + status in one place |
| Places | Google Places API (Text Search → Place Details) | Phone, website, status, categories; API not scraping |
| Equipment | Fable/Sonnet per company with a fixed schema | 150 calls is trivial; quote + URL required |
| Phone | Twilio Lookup / numverify | Line type + validity, the failure mode in David's sheet |
| Email | MX check + verifier only for site-listed addresses | Batch 1 is a phone test |
| Orchestration | one script per step, CSV in / CSV out, as the pack intends | Provenance per column; re-runnable |

## What to tell David with the batch

Every row is a Florida company with prior equipment financing on public record (UCC), verified active with the state, owner named from the state record, phone validated tonight. That makes the batch high-fit and it also means some rows are another lender's customers; the `ucc_secured_party` column says whose. The batch is small on purpose: he grades all 50, we learn the contactability rate, and batch 2 (200 rows, more sources, more signals) ships once the rate is known.

## Roadmap items deliberately not done tonight

PPP loan-level join · DBPR licensee file · FL DOH septic registrants · FMCSA intrastate · floridaucc full files (prod already holds the FL UCC lane) · FDOT prequal · all of P3 beyond UCC age · county demand index · email infra. Each moves to batch 2. The prompt pack stays the spec for them; add a "Batch 1 (tonight)" section at the top of the artifact so the two orders are not confused.

## Prod issues to file from this pass

1. `quintel_agent_query` password failure (agent SQL surface unreachable).
2. UCC-FL duplicate companies and unnormalized names (quoted, trailing spaces).
3. Contact provider returning empty on ~70% of attempts this week.
