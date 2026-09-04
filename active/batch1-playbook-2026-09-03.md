---
title: Batch 1 playbook — Florida owner-operator pool for Providence Capital Funding (self-contained)
date: 2026-09-03
type: playbook, written to be fed to a fresh LLM session as full context
driver: Simon (Quintel), from Claude Code on his Mac
deliverable: FL_PHONE_TEST_50_2026-09-04.csv to David LaSaee by Friday morning 2026-09-04
---

# Batch 1 playbook

## Part 0 · Context (read first; everything below depends on it)

### 0.1 Who is involved

**Quintel** (quintel.ai) is a two-founder startup (Simon, technical; Alek, business) building a sourcing and deal-intelligence engine for equipment finance. Its production system holds about 104,000 US companies and 12,000 "trigger events" assembled from public records: federal contract awards and tenders, building permits, court filings, new carrier registrations, trade press, and Uniform Commercial Code (UCC) equipment-lien filings. It scores each event for "is this company likely to buy or finance equipment now" and filters by a lender's buy box (sector, geography, ticket size). Quintel is also, since late August 2026, acting as an equipment-finance origination firm: the founders call businesses themselves and hand real financing needs to partner lenders for a fee.

**Providence Capital Funding (PCF)** is a small-ticket equipment lender in Brea, California: about 45 commission-only phone reps, roughly $140M funded last year, lease-to-own structures, ticket sweet spot $40K to $200K, borrowers with A to C credit (most under a 719 FICO). Its customers are owner-operated businesses with 2 to 25 employees, mostly under 15, mostly under $5M revenue, mostly in the South, Midwest, Mid-Atlantic, and West (not NY, MN, ND, SD, AK). About half of its deals come through equipment vendor referrals. Providence is already a Quintel pilot user (two reps, Max and Robert, receiving lead batches) and, under Quintel's current 12-week plan, the lender Quintel hands its own phone-sourced opportunities to for the first two weeks.

**David LaSaee** is a contractor at Providence (title: Account Manager) who is building Providence's next sales motion. He formerly owned a 400-person multi-vertical company, has a small team of ex-employees who do weekend data verification, and has spent 18 months trying every lead-generation vendor (Apollo, ZoomInfo, B2B Rocket, and others). His verdict on all of them: the contact data is wrong. His own verification pass on one vendor list found 1,700 of 3,000 rows bad; wrong area codes, disconnected numbers, people who left years ago, generic mailboxes, duplicate rows, and "Joe Smith" resolved to a different company. On 2026-09-03 he agreed to a joint pilot with Quintel: Quintel builds and verifies a pool of Florida companies that fit Providence's box; David personally calls every row (he can do 200 calls a day) and grades it; his bar is more than 50% of rows reach the right company and the right person on a working number; 70 to 90% is the goal. He is explicitly "the lab."

### 0.2 The problem this batch exists to solve

Quintel's engine was built for companies that leave a public trail before they buy: a contract award, a permit, a new facility. David's borrower does not plan. In his words, the owner-operator "wakes up, the dump truck broke, he needs one tomorrow." There is no public event upstream of that purchase. For this borrower the only sourcing strategy is to already be in the pool and in the inbox when the need hits.

That flips the order of operations. Every vendor David tried starts from "intent" (web and search signals, mostly noise for six-person companies) and then looks for companies. David's method, which Providence's most successful reps already run by hand, is the reverse: define the equipment Providence makes money financing, find every company in the target states that runs that equipment (state corporate registries, licensing boards, carrier registrations), verify each one is real and reachable, and only then look for reasons to call now. Quintel is adopting that order for this segment. This batch is the first run of it.

The single biggest failure mode is not finding intent; it is contact data. That is what batch 1 tests.

### 0.3 What we are testing, and what we are not

Batch 1 is a **data-quality test**, graded by a human who calls every row.

Hypotheses:

1. Public records beat list vendors on contact quality. Owner from the state corporate registry (Sunbiz), phone from the company's own site or Google, validity from a carrier lookup. Confirmed if reach exceeds 50%.
2. A pool anchored on registries that already imply the equipment (carrier census, contractor licenses, septic authorizations), intersected with prior equipment-lien history and an active corporate status, yields enough in-box Florida companies for a clean 50.
3. State-registry officers are a good enough owner source.
4. A UCC lien 3 to 5 years old, meaning a financing term is ending, is a usable "why now." Recorded, not judged, in batch 1.
5. The row format works on a call, and David's verdicts come back as structured fields.

Not tested yet: whether these companies want financing this month, whether email beats phone (no email goes out until the phone test passes), whether any intent signal lifts response (batch 2 at 200 rows), or whether Providence funds anything.

Success criteria: pass at 50% reached with right owner and working number; strong pass at 70%; stop and rethink if two batches land under 50%.

### 0.4 Decisions already made (do not relitigate inside the session)

- **Florida only, one batch of 50, with three source arms**: 30 rows where a registry anchor, a UCC lien, and active corporate status all agree; 10 anchor-only; 10 UCC-only. The arms exist so the verdicts can say which source earned the pass. If the intersection is thin, shift to 20/15/15 and report it.
- **Sources that are in:** Quintel's own Florida UCC file (already graded against Providence's box in July), the Florida Division of Corporations bulk file (Sunbiz), the FMCSA motor-carrier census, Florida DEP septic-contractor lists, Florida DBPR contractor licenses, Google Places for website and phone, Exa for finding company pages, a phone-validation API. **Out:** every LinkedIn-derived contact vendor, "intent" data vendors, voter files, and any demographic field. Providence's own persona document lists gender, race, religion, political party, and marital status; those are not used anywhere, for fair-lending reasons and because they are not needed. County tier (rural, small metro, big metro) stands in for geography.
- **Provenance on every field.** Each value carries its source and, where possible, a URL. Bad contact data marks the source and the tool; it never disqualifies the company. No row is deleted; rows leave with an `exclusion_reason`.
- **No guessed email addresses.** Only addresses that appear on the company's own site or in the carrier census, and only after an MX check. Batch 1 is a phone test.
- **Dedupe is mandatory** against Quintel's own duplicates (the UCC lane has the same contractor two or three times under slightly different names) and against everything Providence has already touched (David's April vendor list, the August pilot batches, prior Quintel top-lists). Handing Providence its own customers is the one outcome that damages trust.
- **Per-signal features, no composite score.** Each "why now" signal is stored as its own row with a date, a strength, and a URL. Ranking is by source tier, then the strongest single signal, then how many signals agree. Weights get fitted only after David's verdicts exist.
- **Costs are capped**: Google Places within its free tier, Exa under $5, phone lookups under $5. Stop and report if any API refuses the key.

### 0.5 Facts about the data you will touch

- **Quintel's Florida UCC corpus**: 78,410 filings (also loaded in the local prod copy as `debt_event`, every row linked to a `company` record). Columns include debtor, city, secured party (the lender), a lender class (bank / captive / independent), filing number and date, and a modeled renewal window: `ripe_date`, `ripe_basis` (`in_window_now` or `lender_window_entry`), `dueness`, `median_gap_months`, `n_future_filings`. About 5,100 rows are status `prospect`; 1,790 of those carry a `pcf_grade` of A, B, or C from a July run against Providence's box. Names are raw filing text: quotes, trailing spaces, inconsistent suffixes.
- **Sunbiz**: fixed-width text, 1,440 characters per record, ten quarterly parts plus daily deltas, free over SFTP. Fields: corporation number, name, status A or I, filing type, FEI, file date, principal and mailing addresses, registered agent, up to six officers with title codes. No industry field. It verifies liveness, time in business, and the owner; it cannot discover by trade.
- **FMCSA census** (Florida, ~288,000 rows via the public API): DOT number, legal and DBA name, physical address, operation class (interstate / intrastate), status, power units, truck units, fleet size, registration date. Phone and email exist only in the separately downloaded SMS census CSV. Florida exempts intrastate vehicles under 26,001 lbs GVWR, so vac trucks, dump trucks, and roll-offs are in; light service trucks are not.
- **Florida DEP septic lists**: business authorizations and individual contractor registrations, filterable by active status. **DBPR**: contractor license extract by board; license class CUC is underground utility and excavation. Both are browser downloads.
- **Local environment**: macOS, Postgres running on 5432 with a complete `quintel-prod` copy, `psql`, Python 3.14 with `uv`, `bun`, `sftp`. No DuckDB (not needed). The Quintel repo is at `~/projects/maxi/quintel`; the backend env file there already has a Google Places key.

### 0.6 Providence's box, translated (from David's four documents)

| Field | Value | How it is applied tonight |
|---|---|---|
| Employees | 2–25; 73% under 9; conversion drops past 15 | size features from fleet units, PPP jobs, or site text; never an exclusion |
| Revenue | under $5M for 68% of the book | not observable pre-enrichment; not an exclusion |
| Credit | A–C, 85% under 719 FICO | no bureau data; proxy = prior UCC with a non-bank lender, rural county |
| Ticket | $40K–$200K | equipment class implies it |
| Time in business | 2+ years (a startup program exists) | Sunbiz file date |
| Decision maker | owner-operator, no CFO; a CFO on the site is an exclusion | Sunbiz officer titles; site text |
| Geography | Florida tonight; rural and small-metro counties preferred | county tier from the county list |
| Preferred industries | pumps, generators, concrete, cranes, drilling, excavation, food processing, packaging, heavy and highway construction, HVAC, hydrovac and pump trucks, paving, plumbing, portable toilets, pro audio, recycling, robotics, septic, spray foam, towing and recovery, waste, water and sewer | lane tags and equipment classes |
| Restricted | over-the-road general freight and sleeper trucks, aircraft and boats, solar, cannabis, medical and dental, restaurants under 5 locations, gyms, salons, government and nonprofits, ATMs, vending, crypto mining, rail, cargo containers, adult, weapons, aesthetic lasers, equipment used outside the US | name-level and site-level exclusions |

Lanes used throughout: **A** vac / hydrovac / septic / excavation / utility / drilling; **B** paving / dump / heavy civil / concrete; **C** roll-off / waste / towing and recovery; **D** oilfield (none expected in Florida); **E** plumbing-HVAC and the rest of the preferred list.

### 0.7 Glossary

- **UCC filing**: a public lien record a lender files when it finances equipment; names the debtor (borrower) and the secured party (lender). A filing 3–5 years old usually means a term is ending.
- **Secured party / lender class**: who financed the last purchase; captive (Caterpillar Financial, Kubota Credit), bank, or independent equipment lender. A non-bank secured party is a proxy for a B/C-credit borrower who already finances equipment at these terms.
- **Dueness / ripe date**: Quintel's model of when the next filing is due, from the debtor's own refiling gaps.
- **PCF grade**: A/B/C fit to Providence's box from a July run.
- **Sunbiz**: Florida Division of Corporations; the state corporate registry.
- **FMCSA / DOT number / MCS-150**: federal motor-carrier registry; the DOT number is a stable key; MCS-150 is the biennial update carriers must file.
- **Anchor / overlay / verify / enrich**: the four roles a source can play. Anchor = discovers companies and implies the equipment. Overlay = adds why-now and credit context (UCC). Verify = liveness and owner (Sunbiz). Enrich = website, phone, equipment evidence (Places, Exa).
- **Tier / arm**: intersection (anchor ∩ UCC ∩ Sunbiz-active), anchor_only, ucc_only.
- **David's verdict fields**: reached, right_poc, phone_ok, email_ok, in_market, buying_what, buying_when, corrected_phone, corrected_poc, notes.

### 0.8 How to behave in this session

Work step by step, one script per step, and show the stats file before moving on. Ask before spending money above the caps. Quote verbatim evidence for any equipment claim. When a source is unreachable, write it down in the SOURCES file and continue with the fallback in Part D rather than inventing rows. If fewer than 50 rows survive, ship what survives with the reason; do not pad. Never add a demographic field. Never scrape Google, Sunbiz, or LinkedIn when an API or a bulk file exists.

---

Read the whole thing once. Then run Part A (30–45 min of setup), Part B (60–90 min of acquisition, mostly downloads that can overlap), and Part C (the six steps, ~3 h). Times assume Claude Code writes the scripts and you approve and run them.

Every step writes into `/Users/si/tokenrip-vault/active/flpool`, which is the `active/flpool` directory in this vault:

```
flpool/
  .env                 keys and DB URL
  data/raw/            downloaded files, untouched
  data/work/           parsed / normalized intermediates
  out/                 FL_POOL_v*.csv, SIGNALS.csv, FL_PHONE_TEST_50_*.csv, *_STATS.md, *_SOURCES.md
  scripts/             one script per step, re-runnable
```

Working database: a fresh local Postgres DB named `flpool`. Prod data comes in as CSV exports from the local `quintel-prod` copy, never by writing to it.

---

## Part A · Prerequisites (30–45 min)

### A1. Accounts and keys

| Key                                       | Status                                      | Action                                                                                                                                                                                                          |
| ----------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GOOGLE_PLACES_API_KEY`                   | **already set** in `apps/backend/.env.prod` | Copy into `flpool/.env`. In Google Cloud console confirm "Places API (New)" is enabled on that key and set a budget alert at $50. Free tier: 5,000 Text Search + 5,000 Details per month.                       |
| `EXA_API_KEY`                             | new                                         | Sign up at exa.ai, create a key. $20 free credit covers tonight.                                                                                                                                                |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` | new                                         | Sign up at twilio.com, enable Lookup v2. Line Type Intelligence is $0.008 per number; 150 lookups ≈ $1.20. Alternative if Twilio onboarding stalls: numverify (free 100/month) or AbstractAPI phone validation. |
| `ANTHROPIC_API_KEY`                       | already set                                 | For the extraction step if you run it as scripts rather than inside Claude Code.                                                                                                                                |
| Sunbiz SFTP                               | public                                      | host `sftp.floridados.gov`, user `Public`, password `PubAccess1845!`. No signup.                                                                                                                                |
| `FLPOOL_DB_URL`                           | new                                         | `postgresql://si@localhost:5432/flpool` (see A3).                                                                                                                                                               |
| `QUINTEL_LOCAL_DB_URL`                    | exists                                      | `postgresql://quintel:<pw>@localhost:5432/quintel-prod`, from `apps/backend/.env`. Read-only use.                                                                                                               |

Not needed tonight: Coresignal and RocketReach (set in env, but they are the LinkedIn-derived contact vendors David's experience argues against; leave them out of batch 1 so the test is clean), Apollo, OpenCorporates.

### A2. Local tools

Already present: Postgres 5432 (running), `psql`, `python3` 3.14, `uv`, `bun`, `sftp`. Not present and not needed: DuckDB (Postgres does the joins).

```bash
mkdir -p ~/projects/flpool/{data/raw,data/work,out,scripts} && cd ~/projects/flpool
uv venv && source .venv/bin/activate
uv pip install psycopg[binary] requests python-dotenv rapidfuzz
```

`rapidfuzz` is for name similarity in the Places match. Everything else is stdlib.

### A3. Working database

```bash
createdb flpool
psql -d flpool -c "create schema raw; create schema work; create schema out;"
```

Convention: `raw.*` tables mirror files exactly; `work.*` hold normalized rows; `out.*` hold the pool versions.

### A4. `.env`

```
GOOGLE_PLACES_API_KEY=...
EXA_API_KEY=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
ANTHROPIC_API_KEY=...
FLPOOL_DB_URL=postgresql://si@localhost:5432/flpool
QUINTEL_LOCAL_DB_URL=postgresql://quintel:...@localhost:5432/quintel-prod
```

### A5. Shared normalization rule (used by every step)

```
normalize_name(s):
  uppercase; strip surrounding quotes and whitespace; collapse internal whitespace;
  replace & with AND; drop punctuation except spaces;
  drop trailing suffixes: INC, INCORPORATED, LLC, L L C, CORP, CORPORATION, CO, COMPANY, LTD, LP, LLP, PA, PLLC, DBA <rest>;
  drop leading THE.
normalize_city(s): uppercase, strip, collapse whitespace, drop trailing ", FL".
join key = normalize_name || '|' || normalize_city
```

Claude Code prompt to create it (run once):

```
Create scripts/normalize.py exposing normalize_name(s) and normalize_city(s) exactly per the rule in A5 of the playbook, plus a CLI that reads a CSV, a name column and an optional city column, and writes the same CSV with name_norm, city_norm, join_key columns. Add 12 unit tests with these cases: '"SHELLY'S SEPTIC TANK, INC. "' → 'SHELLYS SEPTIC TANK'; 'J & H HOMES LLC' → 'J AND H HOMES'; '4 C ' S TRUCKING & EXCAVATION INC' → '4 C S TRUCKING AND EXCAVATION'; 'THE DUTRA GROUP' → 'DUTRA GROUP'; 'BOWDEN'S EXCAVATING AND SEPTIC, LLC' → 'BOWDENS EXCAVATING AND SEPTIC'; plus six of your own covering DBA, L.L.C., CO., trailing spaces, double spaces, and a city like '"ZELLWOOD "' → 'ZELLWOOD'.
```

---

## Part B · Data acquisition (60–90 min, downloads overlap)

### B1. UCC buy-box rows (already have; 5 min)

Two equivalent sources. Use the database one; it already carries `company_id`.

```bash
psql -d quintel-prod -Atc "\copy (
  select d.id as debt_event_id, d.company_id, d.debtor, d.debtor_city_state, d.status, d.ripe_date, d.ripe_basis,
         d.pcf_grade, d.score, d.secured_party, d.lender_class, d.filing_number, d.filing_date,
         d.n_future_filings, d.median_gap_months, d.dueness, d.kill_reason, d.source, d.validation_outcome,
         c.name as company_name, c.city, c.state, c.sector, c.naics, c.website, c.domain, c.employees, c.revenue_usd,
         c.founded_year, c.current_band, c.signal_score, c.duplicate_of_id, c.discovery_src
  from debt_event d left join company c on c.id = d.company_id
  where d.state = 'FL'
) to 'data/raw/ucc_fl.csv' csv header"
```

Expect ~67,000 rows: 48,501 pending, 11,518 backlog, 5,117 prospect (1,790 graded A/B/C), 200 killed. The file `~/projects/maxi/quintel/apps/backend/config/ucc/florida-ucc-ripe.csv` is the same corpus without the company join; keep it as the reference copy.

Load: `psql -d flpool -c "\copy raw.ucc_fl from 'data/raw/ucc_fl.csv' csv header"` after creating the table (Claude Code: "create raw.ucc_fl with all columns as text, then load").

### B2. Sunbiz corporate file (20–30 min download, 10 min parse)

Interactive, because curl on this Mac has no SFTP:

```bash
cd ~/projects/flpool/data/raw && sftp Public@sftp.floridados.gov
# password: PubAccess1845!
sftp> ls doc
sftp> ls doc/cor            # daily files yyyymmddc.txt
sftp> ls doc/Quarterly      # find the Cor quarterly directory (July 2026 set, 10 parts)
sftp> get -r doc/Quarterly/Cor
sftp> quit
```

If the quarterly directory name differs, `ls` until you find ten files whose names end in 0–9. Total is a few hundred MB, fixed-width, 1440 characters per record.

Claude Code prompt:

```
Fetch https://dos.sunbiz.org/data-definitions/cor.html and write scripts/parse_sunbiz.py that reads every quarterly cor file in data/raw/Cor/ using the exact column positions in that layout (corporation number, name, status A/I, filing type, FEI, file date, principal and mailing address blocks, registered agent name/type/address, and all six officer blocks with title code, type, name, address). Filter to principal state FL or mailing state FL. Write data/work/sunbiz_fl.csv with one row per corporation and columns: doc_number, name, name_norm, status, filing_type, fei, file_date, tib_years (from file_date to today), prin_addr1, prin_city, prin_city_norm, prin_state, prin_zip, ra_name, officer1_title … officer6_title, officer1_name … officer6_name, officer_count. Then write data/work/sunbiz_officers.csv long-form (doc_number, seq, title, name). Load both into flpool as raw.sunbiz_fl and raw.sunbiz_officers. Print row counts and the status A/I split. Do not guess positions; if the layout page and the file disagree on record length, stop and show me the first record.
```

Owner rule for later steps: officer whose title code is P, PRES, MGR, MGRM, OWNER, CEO, or AMBR; first match by that order.

### B3. FMCSA carriers, Florida (10 min scripted + 10 min manual)

Two files, two purposes.

**Scripted, from the Socrata API** (fleet, address, status; no phone or email):

Claude Code prompt:

```
Write scripts/pull_fmcsa_fl.py that pages https://data.transportation.gov/resource/az4n-8mr2.json with $where=phy_state='FL', $limit=50000, $offset paging, saving all rows to data/raw/fmcsa_fl_api.csv. Keep every field. Expect about 288,000 rows. Then load into flpool as raw.fmcsa_fl_api and report counts by status_code and by carrier_operation, and how many have power_units >= 1.
```

Fields confirmed on that endpoint: dot_number, legal_name, dba_name, phy_street/city/state/zip, carrier_operation (A interstate, B intrastate hazmat, C intrastate non-hazmat), status_code, power_units, truck_units, fleetsize, bus_units, add_date, mcs150_mileage, mcs150_mileage_year, dun_bradstreet_no, business_org_desc.

**Manual, for phone and email:** in a browser go to https://ai.fmcsa.dot.gov/SMS/Tools/Downloads.aspx, download the latest "Motor Carrier Census" zip (scripts get a 403), unzip into `data/raw/fmcsa_census_sms/`. That CSV has `TELEPHONE`, `EMAIL_ADDRESS`, `NBR_POWER_UNIT`, `DRIVER_TOTAL`, `MCS150_DATE`. Claude Code: "load data/raw/fmcsa_census_sms/*.csv rows with PHY_STATE = 'FL' into raw.fmcsa_fl_sms; report how many have a non-empty EMAIL_ADDRESS and TELEPHONE." If you do not get to this tonight, the API file still anchors the pool and phone comes from Places; email waits.

Florida note: intrastate carriers under 26,001 lbs GVWR are exempt from USDOT registration, so light service trucks will be missing. Vac trucks, dump trucks, roll-offs, and heavy wreckers are above the line.

### B4. FDEP septic business authorizations (10 min, manual)

In a browser: https://prodapps.dep.state.fl.us/ocp/reports/accesspublic/OSP/B_public_license_data → Status: Active, Certification Type: All, zip blank → Submit → save the download as `data/raw/fdep_septic_business.csv` (or .xls; convert). Repeat for individual registrations at `/Public_license_data` → `data/raw/fdep_septic_contractors.csv`. The page is JavaScript-driven, so the scripted POST returns HTML; do it by hand.

Claude Code: "inspect the two FDEP files, map their columns to business_name, contractor_name, registration_no, address, city, zip, county, phone (if present), status, expiry; load as raw.fdep_business and raw.fdep_contractor; add name_norm and city_norm."

### B5. DBPR construction licensees (10 min, manual)

In a browser: https://www2.myfloridalicense.com/sto/file_download/ (Cloudflare challenge; a browser passes). Download the Construction Industry Licensing Board extract. Readme with the field layout: https://www2.myfloridalicense.com/sto/documents/readme.pdf. Save under `data/raw/dbpr/`.

Claude Code: "using the readme layout, parse the construction extract; keep license types CUC (certified underground utility & excavation), CGC, CBC, CFC/RF (plumbing), and any demolition or specialty class that maps to lanes A/B/E; write data/work/dbpr_fl.csv with license_no, license_type, holder_name (qualifier), business_name, dba, address, city, zip, phone if present, status, expiry; load as raw.dbpr_fl with name_norm/city_norm."

### B6. Optional tonight, required for batch 2

- **SBA PPP** (NAICS + jobs): https://data.sba.gov/dataset/ppp-foia → the twelve `public_up_to_150k_*.csv` and `public_150k_plus_*.csv`; filter `BorrowerState = FL`. Large; skip unless the smoke test shows industry gaps.
- **FDOT prequalified contractors:** https://fdotwp1.dot.state.fl.us/contractorprequalification/public/PrequalifiedVendorSearch.aspx → CSV download → `data/raw/fdot_prequal.csv`.
- **Water well contractors:** FDEP clearinghouse https://fldep.dep.state.fl.us/wwcvc/ plus the SFWMD and SWFWMD lists (small; PDFs).

### B7. Exclusion lists (5 min)

Copy David's `WIP Apr 7 list update Apr 13.xlsx` (sheets 1 and 2), the 08-31 pilot deliverable, and the Top100/Top140 exports into `data/raw/exclusions/`. Claude Code: "extract company name, domain, phone, city from each; write data/work/exclusions.csv with source_list; load as raw.exclusions with name_norm/city_norm/domain/phone_norm."

---

## Part C · Execution (~3 h)

Each step: one script in `scripts/`, one prompt, one `out/*_STATS.md`. Run in order. If a step's stats look wrong, stop there.

### C0. Source smoke test (45 min)

```
ROLE: size the sources before spending any web lookups. Work in flpool.
1. Add lane tags to every raw table by name_norm regex:
   A_VAC:  HYDRO|VAC|VACUUM|PUMP|SEPTIC|SEWER|DRAIN|GREASE|LIQUID WASTE|PORTABLE|SANITATION
   A_DIRT: EXCAVAT|GRADING|SITE ?WORK|SITE PREP|LAND CLEARING|UNDERGROUND|UTILIT|DIRT|TRACTOR|TRACKHOE|BACKHOE|DOZER|WELL|DRILL|BORING|TRENCH|PIPELINE
   B:      PAVING|ASPHALT|CONCRETE|MILLING|HAUL|DUMP|AGGREGATE|SAND|GRAVEL|CIVIL
   C:      TOW|WRECKER|RECOVERY|ROLL ?OFF|DUMPSTER|WASTE|DISPOSAL|RECYCL
   RESTRICT: FREIGHT|TRANSPORT|LOGISTIC|SOLAR|MARINE|BOAT|MEDICAL|DENTAL|SALON|SPA|FITNESS|GYM|CANNABIS|HEMP|VENDING|CHURCH|MINISTR|FOUNDATION|COUNTY|CITY OF|SCHOOL|VACATION|REALTY
   For raw.fmcsa_fl_api also tag by cargo/business_org fields where present.
2. For each source (ucc_fl, fmcsa_fl_api, fmcsa_fl_sms if loaded, fdep_business, dbpr_fl): total FL rows, rows with any lane tag (by lane), rows with phone, with email, with an owner/qualifier/registrant name, with a size field.
3. Join each source to raw.sunbiz_fl on join_key (name_norm|city_norm); fallback name_norm only, flagging ambiguous (>1 Sunbiz match). Report match %, and % of matched that are status A.
4. Join each source to raw.ucc_fl on join_key. Report match %.
5. Intersections by lane: anchor ∩ ucc ∩ sunbiz-active, where anchor ∈ {fmcsa, fdep, dbpr}. Also anchor-only (no ucc) and ucc-only (no anchor), all sunbiz-active.
OUTPUT: out/SOURCE_SCORECARD.md (one table), out/INTERSECTION_COUNTS.md (by lane and tier), and a two-sentence recommendation of the anchor per lane from the numbers. Save the joined table as work.candidates_all with source flags.
```

What to look for: an intersection of at least ~150 across lanes A/B/C means tonight's plan holds. If it is under ~80, widen to anchor-only rows earlier than planned and say so in the sheet.

### C1. Triangulated pool (20 min)

```
ROLE: build out.fl_pool_v1 from work.candidates_all.
INCLUDE: any FL company that is (a) in fmcsa/fdep/dbpr with a lane tag, or (b) in ucc_fl with a lane tag. Dedupe on join_key; keep all source flags; record merged source ids.
TIER: intersection (anchor ∩ ucc ∩ sunbiz A) · anchor_only (anchor ∩ sunbiz A, no ucc) · ucc_only (ucc ∩ sunbiz A, no anchor). Sunbiz status I or no Sunbiz match → exclusion_reason.
CARRY: sunbiz doc_number, status, file_date, tib_years, prin address/city/county/zip, officers (long-form join), ra_name; fmcsa dot_number, carrier_operation, status_code, power_units, truck_units, add_date, and telephone/email if the SMS file is loaded; fdep/dbpr registration no., type, holder_name, expiry; ucc filing_number, filing_date, secured_party, lender_class, pcf_grade, score, ripe_date, ripe_basis, dueness, n_future_filings, median_gap_months, kill_reason, company_id (prod).
OWNER: first officer titled P/PRES/MGR/MGRM/OWNER/CEO/AMBR → owner_name, owner_title, owner_source='sunbiz'; else dbpr/fdep holder → 'license'; else null.
EXCLUDE (reason logged, row kept): RESTRICT tag; sunbiz inactive; principal state not FL; in raw.exclusions by domain, phone, or join_key; ucc kill_reason not null.
COUNTY TIER: RURAL / SMALL_METRO / BIG_METRO using the county lists in Alek's P2 (30 rural, 26 small-metro, 10 big-metro).
OUTPUT: out/FL_POOL_v1.csv, out/FL_POOL_v1_STATS.md (rows per tier per lane; exclusions by reason; owner-named rate; phone-present rate by source; email-present rate).
```

### C2. Equipment and web contact, candidates only (60–75 min)

Budget: ~150 companies → ~150 Places Text Search (free tier), ~150 Details Essentials (free tier), ~100 Exa searches + ~300 Exa content pages (≈$1), ~150 LLM extractions.

```
ROLE: equipment classifier and contact finder. INPUT: out/FL_POOL_v1.csv rows not excluded, ordered intersection → anchor_only → ucc_only, then by pcf_grade (A, B, C, none), then dueness desc. Take 90 intersection, 30 anchor_only, 30 ucc_only.
PER COMPANY (write every raw response to data/work/web/<join_key>.json):
1. Places Text Search (New): textQuery "<company name> <prin_city> FL". Accept the top result only if rapidfuzz token_set_ratio(name_norm, result name) >= 80 and the result's city matches prin_city or the address zip matches. Else places_found=false.
2. Places Details Essentials on the accepted place: businessStatus, websiteUri, nationalPhoneNumber, types, userRatingCount.
3. If no website: Exa search "<company name> <prin_city> Florida" numResults 3, type auto. Accept a domain only if its page text contains the company name and (the city or an officer's last name).
4. Exa contents (text only, no highlights, no summary) on up to 4 pages: home, services/fleet/equipment, about. Cap 8,000 chars per page.
5. LLM extraction (fixed JSON schema, temperature 0): equipment_quote (verbatim ≤200 chars), equipment_url, equipment_class ∈ {HYDROVAC_VAC, EXCAVATION_SITEWORK, PAVING_MILLING, CONCRETE_PUMP, DUMP_HAUL, ROLLOFF_WASTE, TOW_RECOVERY, DRILLING, CRANE_LIFT, PORTABLE_SANITATION, SPRAY_FOAM_RIG, GENERATOR_PUMP_RENTAL, RECYCLING_PROCESSING, SERVICE_VAN_ONLY, HAND_TOOL_TRADE, NONE_FOUND}, confidence ∈ {HIGH, MED, LOW, NONE}, fleet_units_stated (int|null), brands_seen[], dealers_named[], owner_name_on_site, cfo_or_controller_on_site (bool), franchise_or_national (bool), restricted_equipment_seen (bool), site_phone, site_email.
6. equipment_pass_result: PASS = HIGH/MED and class in lane; UNVERIFIED = LOW/NONE (kept); OUT = SERVICE_VAN_ONLY, HAND_TOOL_TRADE, restricted, franchise, businessStatus CLOSED_PERMANENTLY, cfo_or_controller_on_site. FMCSA power_units >= 2 with an in-lane tag counts as MED evidence with the census row as the quote.
RULES: a company name is not evidence; every PASS has a quote and URL; never call Places twice for one company; stop and report if Places returns REQUEST_DENIED (key not enabled).
OUTPUT: out/FL_POOL_v2_EQUIPMENT.csv (v1 + places_found, business_status, website, places_phone, exa_urls, all extraction fields), out/FL_POOL_v2_STATS.md (PASS/UNVERIFIED/OUT by tier and lane; evidence source distribution; API call counts and estimated cost).
```

### C3. Contact verification (20 min)

```
ROLE: verify contacts on PASS and UNVERIFIED rows.
PHONE candidates in order: fmcsa sms telephone (if loaded), places_phone, site_phone, dbpr/fdep phone. For each candidate until one is valid:
  GET https://lookups.twilio.com/v2/PhoneNumbers/<E164>?Fields=line_type_intelligence,line_status (basic auth with SID:token).
  Read: valid (bool), line_type (landline / mobile / fixedVoip / nonFixedVoip / tollFree / pager / unknown), carrier_name, and line_status.status (active / reachable / unreachable / inactive / unknown; meaningful for mobiles, mostly unknown for landlines).
  phone_valid = valid AND line_status ≠ inactive. Flag tollFree and nonFixedVoip as shared_line=true (kept, but ranked below a landline or mobile).
  phone_area_code_ok = area code ∈ {239,305,321,352,386,407,448,561,656,689,727,754,772,786,813,850,863,904,941,954}.
  Record phone, phone_source, phone_valid, line_type, carrier, line_status, shared_line, candidates_tried. Landline "disconnected" cannot be detected by API; David's dial is that test, and his phone_ok verdict is the label.
EMAIL: fmcsa sms email_address and site_email only. Syntax check + MX lookup on the domain. No guessed addresses. email, email_source, mx_ok.
WEB: website resolves with HTTP 200 or a same-domain redirect → site_ok.
OUTPUT: out/FL_POOL_v3_CONTACT.csv, out/FL_POOL_v3_STATS.md (valid-phone rate by phone_source and by tier; email-present and mx_ok rates; Twilio call count).
```

### C4. Signals, one row per signal (20 min)

```
ROLE: write per-signal features. No composite score. INPUT: out/FL_POOL_v3_CONTACT.csv.
SIGNALS.csv rows: company_key, signal_id, present, observed_date, strength (0–1), confidence (text), source, url.
- ucc_renewal_window: present if ucc row exists and kill_reason is null. observed_date = ripe_date. strength = min(1, dueness) if ripe_basis = 'in_window_now' else 0.5 × min(1, dueness). confidence = 'n_future_filings=<n>; median_gap_months=<m>; pcf_grade=<g>'. url = floridaucc.com search for the filing number.
- ucc_termination_12mo: only if a termination flag exists in raw.ucc_fl (validation_outcome or status); otherwise write present=false with confidence='not available in file'.
- fmcsa_new_dot_12mo: present if fmcsa add_date within 365 days. strength 0.7. url = SAFER snapshot for the DOT.
- fmcsa_fleet_size: present if power_units >= 2 (not intent; a size feature) strength = min(1, power_units/10). Keep separate so it is never mistaken for growth.
- fmcsa_fleet_delta: only if two API snapshots exist (not tonight) → present=false, confidence='needs second snapshot'.
COUNTY covariate (on the company row, not in SIGNALS.csv): demand_index 0–5 from whatever is loaded tonight; if nothing is loaded, set null and say so.
DERIVE per company: signals_present, max_signal_strength, most_recent_signal_date, top_signal_text (one plain sentence, e.g. "Equipment financing with Kubota Credit filed 09/2023; the renewal window opened 07/2026.").
OUTPUT: out/SIGNALS.csv, out/FL_POOL_v4_SIGNALS.csv, out/FL_POOL_v4_STATS.md (signal presence by tier; strength distribution).
```

### C5. The 50, the bench, the sheet (20 min + morning re-verify)

```
ROLE: select and document.
ELIGIBLE: equipment_pass_result ∈ {PASS, UNVERIFIED with FMCSA MED evidence}; sunbiz active; owner_name present; phone_valid and phone_area_code_ok; not excluded.
ARMS: 30 intersection · 10 anchor_only · 10 ucc_only. Within each arm order by max_signal_strength desc, signals_present desc, county_tier (RURAL > SMALL_METRO > BIG_METRO), then tib_years in 5–15 first. Lane mix target ≈30 A / 10 B / 5 C / 5 other, without breaking arm sizes.
BENCH: next 15 eligible, same ordering.
SELECTION_REASON: one line per row naming tier, lane, top signal, county tier.
OUTPUT: out/FL_PHONE_TEST_50_2026-09-04.csv with columns in this order: company, dba, owner_name, owner_title, owner_source, phone, phone_source, line_type, email, email_source, city, county, county_tier, lane, tier, equipment_class, equipment_quote, equipment_url, fleet_units_stated, power_units, tib_years, ucc_secured_party, ucc_filing_date, ucc_ripe_date, top_signal_text, signals_present, selection_reason, then blank: reached, right_poc, phone_ok, email_ok, in_market, buying_what, buying_when, corrected_phone, corrected_poc, notes. Also out/BENCH_15.csv and out/FL_PHONE_TEST_50_SOURCES.md (every source, file, pull date, row count, and the API call totals).
```

Morning of 09-04, before sending (Claude Code: `scripts/reverify.py`): Sunbiz status still A (daily file or entity search), Places businessStatus not CLOSED_PERMANENTLY, website resolves, phone still valid. Replace from bench; log swaps in `out/SWAPS.md`.

**Sharing with David:** import the CSV into a Google Sheet, freeze the header, lock every column left of `reached`, share edit access. Post the link in Slack with three sentences: what the rows are (Florida companies with prior equipment financing on public record, active with the state, owner from the state record, phone validated last night), that the `tier` column marks three source arms he should grade the same way, and that `ucc_secured_party` says whose customer each row already is.

### C6. Verdict ingest (when the sheet comes back)

```
ROLE: turn David's fields into labels and a source scorecard.
Read the sheet back to out/VERDICTS_2026-09-0x.csv. Per company: contactable = reached AND right_poc; phone_ok; email_ok; in_market; corrections (corrected_phone, corrected_poc) stored with provenance='david_verification' and date.
SCORECARDS: reach rate and right-POC rate by tier (arm), phone_source, owner_source, lane, county_tier; in_market rate by each signal_id present vs absent and by signals_present count. Wilson intervals on every rate; print n next to it.
OUTPUT: out/VERDICT_SCORECARD.md. Also a list of prod issues to file: duplicates found, entities that resolved wrong, phones marked NIS, with the prod company_id where known.
```

---

## Part D · Known blockers and fallbacks

| Blocker | Fallback |
|---|---|
| Sunbiz quarterly download slow or directory name unknown | Use the daily files for the last 90 days plus per-name entity search for the ~150 candidates only (search.sunbiz.org); the bulk file lands for batch 2. |
| FMCSA SMS CSV not downloaded | API file still anchors; phone from Places; email waits for batch 2. Say so in the SOURCES file. |
| FDEP or DBPR download fails | Lane A anchors on FMCSA only tonight; DBPR/FDEP join in batch 2. |
| Places key not enabled for Places API (New) | Enable it in the console; legacy Places API also works with the old endpoints. Do not fall back to scraping Google. |
| Twilio onboarding blocked | numverify free tier for 100 lookups, then AbstractAPI. Record which validator was used. |
| Intersection under ~80 rows | Shift arm sizes to 20/15/15 and report the shortfall as a finding, not a failure. |
| Fewer than 50 eligible after C3 | Ship what is eligible plus the reason for the gap; a 35-row batch with clean provenance beats 50 with padding. |
