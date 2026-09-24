---
status: v0.2
last_revised: 2026-09-24
owner: Simon
serves: which public feeds the Ironmark outbound engine ingests first, judged as data plumbing (access, cadence, incremental pull, fields, contact yield, build effort), not as sales signal
tier: internal (shareable with Alek)
relationship: evaluates the 61 A-tier sources in Alek's Six-State Outbound Model (claude.ai artifact, 09-23). Per-source detail in `data/source-feeds-a-tier-2026-09-24.md`; machine-readable in `data/source-feeds-a-tier-2026-09-24.json`
---

# Source feeds: ingestion is cheap, contacts are the bottleneck

## 1. The so what

Getting the data in is easier than the model assumed. Of the 52 in-box A-tier sources, 26 can be built now, and most of those are Socrata or ArcGIS APIs that support date-based incremental pulls and take under half a day each. The hard part comes after ingestion: **only about six of the 26 build-now feeds carry an email address.** The intent feeds (Colorado UCC, TCEQ permits, diesel registrations, city permits) name a company and an address and stop there. Every lead from them has to pass through a contact-append stage (website → email → verify), and that stage's hit rate sets real volume. The model assumes 50% "valid email found." For rural companies with 2–25 employees known only by name and address, that number is unmeasured. Measure it first. It decides whether the six states can fill 300 leads a day, not the connectors.

This corrects part of my 09-24 v0 advice ("no nightly connectors in v0"). Several intent feeds cost half a day each, so a small connector set is affordable in v0: Colorado UCC, FMCSA and two or three Texas Socrata feeds. The build-order discipline doesn't change. Contact-append and the ledger come first.

Scope: 61 A-tier sources in Alek's model; 9 are out of box (liquor, beer, food service, veterinary, certificate of need) and were not investigated. Six agents fetched each of the other 52 on 2026-09-24.

## 2. What the fetch found

| Verdict | Count | What it means |
|---|---|---|
| build_now | 30 | reachable, stable, in-box records, effort S–M |
| build_later | 13 | TDEC DataViewer blocks datacenter IPs, US included (3), fragile scrape or login portal (3), buy-box fit on an undocumented API (2), noisy or mis-described (5) |
| enrichment_only | 9 | useful to confirm or enrich a company already in the pool; not a lead source on its own |

Access methods: 19 Socrata, 9 ArcGIS, 4 other APIs, 10 bulk files, 2 PDFs, 3 HTML scrapes, 5 portal searches.

**Contact fields in build-now feeds (fact, measured on samples):**
- Email present: FMCSA census (~46% in Indiana, 18,368 of 39,771), Colorado dewatering permits (legal contact phone and email on nearly every row), IDEM septage permittees (~50%), INDOT bid tabs (bidders, nearly all), TxDOT vendor list.
- Phone only: TDLR tow (97%), TSBPE master plumbers (51%), Palm Beach towing, Miami-Dade permits (contractor phone), Georgia EPD solid waste, Chattanooga permits.
- Nothing but name and address: everything else, including Colorado UCC, all TCEQ feeds, Comptroller diesel registrations, TxDOT bid tabs, Dallas ROW, Florida grease haulers and FDEP air.

## 3. The feeds to build first

| Feed | Why | Access | Volume | Contact | Effort |
|---|---|---|---|---|---|
| **CO UCC initial filings** (CO-g4-04) | prior financing, the one signal David agrees with; the debtor is the buyer | free Socrata, daily, `filingdate` incremental; 4 tables joined on `fileid` | 4,000–4,650 initial UCC-1s a month (measured; the prior round's ~3,800 mixed in other types) | address only | S, plus a secured-party alias table |
| **FMCSA census** (IN-g6-02 = ALL-g6-06) | one feed for all six states; `power_units`, `carrier_operation`, `add_date`, `mcs150_date`; the monthly diff gives "added a truck" | Socrata `az4n-8mr2`, near-live | IN intrastate 39,771 before filters; 4,765 after | email ~46% | S; **needs a free app token** (throttled without one) |
| **TCEQ concrete production TXG11** (TX-g1-08) | cleanest source tested; batch plants | Socrata, statewide, daily | ~22 a month (matches prior) | none | S |
| **TCEQ sludge transporters** (TX-g1-05) | company rows, real addresses, NAICS 562991 | Socrata, 5 regional endpoints to union | small | none | M |
| **Comptroller dyed-diesel DD registrations** (TX-g1-01) | running off-road diesel equipment | Socrata, daily, public domain | ~107 non-farm a month | none; many individuals | S |
| **CO dewatering permits** (CO-g4-02) | names the digging contractor | Google Sheets xlsx export, full re-download | ~25 a month | phone and email ~99% | S |
| **IDEM septage permittees + pending** (IN-g6-03/04) | vac and pump trucks; pending = about to operate | PDF, monthly | 431 permittees; 1–3 pending a month | phone ~100%, email ~50% | S |
| **FDEP grease haulers** (FL-g3-04) | small vac-truck operators | ArcGIS, `STATUS_DATE` incremental | 13,959 in the layer | none | S |
| **TDLR tow companies** (TX-g2-01) | tow roster, phone-rich | daily CSV, full file | 3,789 companies | phone 97% | S; see robots note in §4 |
| **GA EPD solid waste facilities** (GA-g6-01) | haulers and roll-off | xlsx, roughly monthly | 7,266 rows | phone, most rows | S |
| **TN contractor licenses** (TN-g5-05) | Tennessee's best source; trade codes plus a dollar aggregate limit as a size signal | Tableau CSV, one 9.4 MB GET, current to the prior day; **US host only** | 126–216 new licenses a month; 29,096 licenses | email 95%, phone 73% (sample of 200) | S; parse the name-and-address cell |
| **DBPR construction licensees** (FL-g3-01) | Florida contractor roster with license type; the join key for Hillsborough NOCs | daily CSV, 46.6 MB, full file; **US host only** | ~1,630 new licenses a month | address only | S; same fetcher as FL-g3-02 |
| **DBPR electrical licensees** (FL-g3-02) | rides on the FL-g3-01 fetcher | daily CSV, 4.0 MB; **US host only** | ~160 a month | address only | S, marginal |
| **Hillsborough Clerk NOC index** (FL-g3-06) | names the contractor (TO party) on a job start | pipe-delimited daily files; **US host only** | ~272 NOCs a business day | none | S ingest, M with the DBPR join; 6–18 day posting lag |

Colorado UCC needs one clarification. The SOS sells a $10K-a-year "UCC Master File" FTP subscription, and its own documentation says the free Socrata datasets carry the same data. Never pay for it. It also means Colorado doesn't depend on David's bulk file.

**Quintel already has what the UCC join needs.** Secured-party names are dirty (at least six spellings of Kubota Credit, three of Wagner Equipment). Quintel's `lender` table has `norm` and `aliases` columns, and `debt_event.lender_id` already links filings to lenders. This is a concrete reason to run sourcing inside Quintel (see the Quintel/Ironmark split).

## 4. Cross-cutting findings

- **Four of five blocked hosts were geoblocked; TDEC blocks datacenter IPs everywhere.** A retest on 2026-09-24 from a US datacenter host (DigitalOcean, Clifton NJ) reached data.tn.gov, Hillsborough Clerk and both DBPR CSVs. DBPR is still behind Cloudflare, but it serves the files to a US IP with no challenge, so its rule is geographic, not bot protection. TDEC's DataViewer returns 403 from its AWS load balancer on every path, robots.txt included, from the US as well. That is an IP-range block, not geography (inferred; a residential US IP was not tested, and the headless test was skipped because Chromium couldn't be installed without root). **Production fetches for these four hosts must run from a US host; local development from Colombia cannot reach them.** Tennessee moves from one build-now source to two, and TN-g5-05 (email 95%, phone 73%) becomes one of the most contact-rich feeds in the set. Detail: `data/geoblock-probe-2026-09-24.json`, `data/geoblock-retest-2026-09-24.json`.
- **Many records don't name the equipment buyer.** Dallas ROW is dominated by large primes and unrelated installers. Nashville ROW fills its company field in only 22% of rows. TCEQ OSSF names an individual license holder. Permit feeds need the contractor join the model already flags as a risk. Feeds that name the contractor directly: Colorado dewatering, Miami-Dade (contractor number in DBPR format), Austin (`contractor_trade`).
- **Rosters are the other half of the set, and they're snapshots, not events.** TDLR tow, TSBPE, IDEM septage, GA EPD and the TxDOT vendor list are full-file downloads with no add date. They load as companies and get compared month to month. Only dated events should become triggers.
- **Traps a pipeline will hit:**
  - Socrata puts NULL dates first on `DESC`, so a naive "newest" query returns 1960s rows (Comptroller datasets). Always add `IS NOT NULL`.
  - TCEQ dates contain sentinel values (1800-01-01, 3000-12-31).
  - TXR15 construction stormwater isn't a program code. It's a substring of `additional_id_text` inside the shared STORM program, alongside industrial permits.
  - The TxDOT bid-tab date field is `project_actual_let_date`. The prior round used `letting_date`, which throws an error.
  - INDOT lettings use unpredictable URL slugs and file names, and the GA EPD download URL embeds the report month. Both need pattern matching, not fixed URLs.
  - SBA PPP's CKAN API is gone (404). The files are now linked from the HTML page, and the data is frozen at 2024-09-30.
  - The RRC W-1 "bulk download" is a GoAnywhere login portal, not a file.
- **No commercial-solicitation restriction was found anywhere,** with two gaps:
  - Austin's open-data terms weren't read in full.
  - TDLR's robots.txt disallows `/*.csv`, which covers the tow file. That's a crawler directive, not law. Fetching one file a day is a judgment call. Make it deliberately rather than by default.

  This isn't a legal review. The compliance read in `launch.md` §3 #12 still stands.

## 5. What this changes in the plan

1. **Measure contact-append before building more connectors.** Take 200 address-only companies from Colorado UCC and TXG11 and run them through website → email → verify. The found-and-verified rate replaces the model's 0.5. If it's under ~25%, the intent bucket can't fill its slots on free sources, and the general bucket (FMCSA, email-bearing rosters) carries the send volume.
2. **Put Colorado UCC and FMCSA in v0.** Both are small builds, both are live, and together they cover the one validated signal plus the carrier universe in all six states.
3. **Get a free Socrata app token** before any scheduled job runs. FMCSA throttled unauthenticated calls repeatedly.
4. ~~Retest the seven blocked records from a US host.~~ **Done 2026-09-24:** four moved to build_now (TN-g5-05, FL-g3-01, FL-g3-02, FL-g3-06); the three TDEC DataViewer feeds stay build_later, blocked from US datacenter IPs too.
5. **Correct the volumes in the artifact's by-state table** where the fetch measured them: Colorado UCC 4,000–4,650 initial UCC-1s a month, TXR05 industrial stormwater 266 in 30 days rather than ~137 a month, and Indiana FMCSA intrastate 39,771 before filters.

## 6. Scorecard, all 52

Sorted by verdict, then by state. Columns are shortened; the JSON has the full values.

<!-- scorecard:start -->
| Verdict | ID | Source | Access | Cadence | Incremental | Contact | Equipment | Effort |
|---|---|---|---|---|---|---|---|---|
| build_now | ALL-g6-06 | FMCSA Company Census: intrastate vocational fleets, 2 to 7… | socrata_api | same dataset as IN-g6-02: rows | yes, on add_date or mcs150_date, same as… | not separately measured at national scale… | direct, iden | S-M |
| build_now | CO-g4-02 | CDPS active permits extract: construction dewatering… | bulk_file | irregular/periodic | no; full-file re-download only, then a… | ~99.9% carry legal phone and email per prior… | indirect: a  | S |
| build_now | CO-g4-03 | DWR well permit API: well construction and pump… | other_api | daily | yes — min-modified query parameter (required… | driller/pumpLic fields are frequently null… | indirect: co | S |
| build_now | CO-g4-04 | UCC initial filings by equipment lenders (Filing +… | socrata_api | daily | yes — filter/order by filingdate (SoQL… | address fields appear consistently populated… | direct when  | S |
| build_now (retested) | FL-g3-01 | DBPR Construction Industry Licensee File | bulk_file | daily: Last-Modified 2026-09-2 | full file only; diff locally on column 16… | no phone or email column (confirmed on the… | none direct | S:  |
| build_now (retested) | FL-g3-02 | DBPR Electrical Contractor Licensee File | bulk_file | daily: Last-Modified 2026-09-2 | full file only; diff locally on column 16… | no phone or email column (confirmed on the… | none direct | S:  |
| build_now | FL-g3-03 | FDEP ARMS Air Facilities (concrete, asphalt, crusher, air… | arcgis_api | unknown -- no per-record last- | no date field to filter on; incremental pull… | no phone/email fields present in the layer… | indirect --  | S - |
| build_now | FL-g3-04 | FDEP Grease Waste Hauler Licenses (Solid Waste Facilities… | arcgis_api | daily-capable -- STATUS_DATE v | yes -- STATUS_DATE field,… | no contact fields in the schema fetched | indirect --  | S - |
| build_now (retested) | FL-g3-06 | Hillsborough Clerk Official Records Daily Index | bulk_file | one file set per recording bus | yes: list the directory and fetch new D and… | none: the index has no phone or email | none direct | S f |
| build_now | FL-g3-07 | Palm Beach County Licensed Towing Companies (Consumer… | other_api | unknown -- this is a live quer | no server-side date filter observed in this… | phone present in all 3 sampled records;… | direct -- ve | S - |
| build_now | FL-g3-08 | City of Orlando Permit Applications | socrata_api | daily -- dataset metadata rows | yes -- $where=processed_date>=... and… | 2 of 3 sampled records had… | none direct | S - |
| build_now | FL-g3-09 | Miami-Dade Building Permits | arcgis_api | recent -- editingInfo.dataLast | yes -- orderByFields=PermitIssuedDate DESC… | ContractorPhone populated in the 1 full… | indirect --  | S - |
| build_now | FL-g3-10 | Miami-Dade Certificates of Use | arcgis_api | unknown this pass -- layer met | likely yes -- USER_ISSUED_DATE field exists… | not sampled this pass (schema-only fetch, no… | none direct | S - |
| build_now | GA-g6-01 | EPD Regulated Solid Waste Facilities list (incl.… | bulk_file | irregular, roughly monthly | no incremental query -- full file only;… | phone present for most rows with a value in… | indirect: PB | S |
| build_now | IN-g6-02 | FMCSA Company Census File filtered to Indiana intrastate… | socrata_api | dataset-level rowsUpdatedAt =  | yes -- filter on add_date (new… | email ~46% (18,368 of 39,771 IN… | direct: powe | S |
| build_now | IN-g6-03 | IDEM Approved Septage Management Permittees list (septage,… | pdf | monthly | no incremental query -- single PDF, full… | phone present on essentially every row… | indirect: se | S |
| build_now | IN-g6-04 | IDEM Pending Septage Management Applications tracking report | pdf | monthly | no incremental query -- single PDF, full… | 0% -- no phone or email column in this… | indirect onl | S |
| build_now | IN-g6-05 | INDOT Official Bid Tabulations (letting results) | html_scrape | monthly | no API -- pipeline must crawl the archive… | phone and email present for essentially… | indirect: co | M |
| build_now (retested) | TN-g5-05 | TN Board for Licensing Contractors: Contractor and… | bulk_file | at least daily | full file only (9.4 MB, one GET, ~seconds);… | email 95% (190/200) and phone 73% (146/200)… | none direct | S:  |
| build_now | TN-g5-06 | Chattanooga All Permits | bulk_file | daily | no native filtering - it is a single flat… | not re-measured this round on a fresh… | indirect - p | M |
| build_now | TX-g1-01 | Comptroller Signed Statement Registration Numbers (dyed… | socrata_api | daily | yes; $order=effective_date DESC or… | 0% — no phone/email/contact-person field… | indirect | S |
| build_now | TX-g1-02 | Dallas Right of Way (ROW) Permits | socrata_api | dataset rowsUpdatedAt = 2026-0 | yes; $order=issuedate DESC or createddate… | 0% — no phone/email field in schema;… | indirect | M |
| build_now | TX-g1-03 | TCEQ Aggregate Production Operations | socrata_api | daily | yes; $order=registration_start_date DESC or… | 0% — no phone/email field | direct | S |
| build_now | TX-g1-05 | TCEQ Central Registry regional files: Sludge Transporter… | socrata_api | daily | yes via affil_begin_dt/status_dt, with same… | 0% | direct-ish | M |
| build_now | TX-g1-08 | TCEQ Water Quality General Permits: concrete production… | socrata_api | daily | yes; $where=starts_with(permit_no,'TXG11')… | 0% | direct | S |
| build_now | TX-g2-01 | TDLR Tow Truck Companies and Vehicle Storage Facilities… | bulk_file | file regenerated daily | no; full file only, no date field to filter… | phone 97.2% (3,683/3,789), measured directly… | indirect | S |
| build_now | TX-g2-02 | TSBPE Responsible Master Plumber licensee list (daily CSV) | bulk_file | generated on each request | no dedicated new-license endpoint; use… | phone 50.8% (4,764/9,375), company name… | none direct | S |
| build_now | TX-g2-03 | TxDOT Bid Tabulations (low bidders) | socrata_api | rowsUpdatedAt epoch 1790199531 | yes, via project_actual_let_date with $order… | 0% — confirmed no phone/email field exists… | none direct  | S-M |
| build_now | TX-g2-04 | TxDOT Vendor List (prequalified contractors) | socrata_api | rowsUpdatedAt epoch 1790182833 | no add-date field; must snapshot-diff by… | phone 3/3 (100%) and email 2/3 (67%) in a… | none | S |
| build_now | TX-g2-05 | Austin Issued Construction Permits | socrata_api | newest issue_date returned by  | yes, via issue_date; also has… | not formally sampled; 2 of 3 sample rows had… | indirect via | S |
| build_later | CO-g4-01 | CDOT bid tabs and weekly letting results | html_scrape | weekly | no field-level incremental query; would need… | 0% on this page; would need to join to CDOT… | indirect: wi | M |
| build_later | CO-g4-08 | Pikes Peak Regional Building Dept daily/weekly permit… | html_scrape | not independently re-confirmed | unclear; reports appear to be point-in-time… | — | indirect: co | M |
| build_later | GA-g6-07 | GDA License Search - Food Establishment Licenses | other_api | daily plausible based on prior | yes in practice via sort=IssueDate-desc plus… | phone present on all 4 sampled rows; email… | none direct | S |
| build_later | GA-g6-08 | GDA License Search - fuel pump, poultry dealer, feed,… | other_api | not independently re-measured  | same approach as GA-g6-07: page through… | phone present on all 3 sampled fuel-pump… | indirect onl | S |
| build_later | TN-g5-01 | Nashville Active Right-of-Way Permits | arcgis_api | daily | yes; query with… | Company field: 11/50 (22%) filled in a… | indirect - P | S |
| build_later (retested) | TN-g5-02 | TDEC Air Pollution Control Permits | portal_search | — | — | — | — | — |
| build_later (retested) | TN-g5-03 | TDEC DWR Permits (CGP, ARAP, TMSP, RMCP) | portal_search | — | — | — | — | — |
| build_later (retested) | TN-g5-04 | TDEC Water Well Driller Reports (completed wells) | portal_search | — | — | — | — | — |
| build_later | TX-g1-06 | TCEQ Central Registry regional files: construction… | socrata_api | daily | yes, but requires a bounded affil_begin_dt… | 0% | indirect | L |
| build_later | TX-g1-07 | TCEQ Central Registry regional files: new air… | socrata_api | daily | yes via affil_begin_dt, same sentinel-date… | 0% | indirect | M |
| build_later | TX-g1-09 | TCEQ Water Quality General Permits: industrial stormwater… | socrata_api | daily | yes; $where=program_area='SWD' AND… | 0% | indirect and | M |
| build_later | TX-g2-06 | Comptroller Active Sales Tax Permit Holders (new outlets) | socrata_api | rowsUpdatedAt epoch 1789805121 | yes, via outlet_permit_issue_date, BUT the… | 0% — confirmed no phone/email field exists… | none direct | S-M |
| build_later | TX-g2-08 | RRC Drilling Permits (W-1) daily and pending files | portal_search | landing page states "Nightly"  | unknown — could not inspect the file | — | none direct | L |
| enrichment_only | ALL-g6-09 | SBA PPP FOIA loan data (per-state cut) | bulk_file | static: the data covers PPP lo | no incremental pull possible or needed --… | 0% -- no phone, email, or named contact… | none -- no e | M |
| enrichment_only | CO-g4-05 | UCC lapse, continuation and termination watch on equipment… | socrata_api | daily | yes — lapsedate range filter for… | n/a — no contact fields | indirect: a  | S |
| enrichment_only | CO-g4-06 | City of Boulder Construction Permits | arcgis_api | layer metadata editingInfo.dat | yes — standard ArcGIS FeatureServer query… | no phone/email fields in the schema at all | none direct | S |
| enrichment_only | CO-g4-07 | Denver Commercial Construction Permits | arcgis_api | layer editingInfo.dataLastEdit | yes — standard ArcGIS query filtering on… | no phone/email fields in schema | none direct | S |
| enrichment_only | FL-g3-05 | Florida Secured Transaction Registry (public UCC… | portal_search | — | — | — | indirect --  | — |
| enrichment_only | TN-g5-07 | Nashville Building Permit Applications | arcgis_api | daily per source description | yes; query with orderByFields=Date_Entered… | Contact field: 5/5 filled in a 5-row sample,… | indirect - P | S |
| enrichment_only | TN-g5-08 | Nashville Building Permits Issued | arcgis_api | daily per source description | yes; query with orderByFields=Date_Issued… | Contact field: 5/5 filled in a 5-row sample,… | indirect - P | S |
| enrichment_only | TX-g1-04 | TCEQ Central Registry regional files: OSSF Installer and… | socrata_api | daily | yes but noisy — status_dt moves on renewals… | 0% | indirect | M |
| enrichment_only | TX-g2-07 | Comptroller Agriculture and Timber Exemption Registrations | socrata_api | rowsUpdatedAt epoch 1790234353 | yes, via permit_issue_date, but same… | 0% — confirmed no phone/email field exists | indirect | S-M |
<!-- scorecard:end -->
