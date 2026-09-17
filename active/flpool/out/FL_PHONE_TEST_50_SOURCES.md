# FL_PHONE_TEST_50 — sources and method

Batch of 50 Florida companies for Providence Capital Funding, prepared 2026-09-03 for phone
verification by David LaSaee. Every field on the sheet traces to one of the sources below.

## Sources used

| Source | What it provided | Pull date | Rows pulled |
|---|---|---|---|
| Florida Division of Corporations (Sunbiz) quarterly corporate file | company liveness, time in business, owner name and title, principal address | 2026-07 quarterly, parsed 2026-09-03 | 12,808,196 records read; 11,802,288 Florida; 3,855,431 active |
| Sunbiz corporate events file (`corevt`) | former-name aliases, to stop renamed companies failing the lien join | same | 342,592 name-change events |
| FMCSA motor-carrier census (Socrata `az4n-8mr2`) | phone, email, officer name, county, fleet size, self-declared cargo class | 2026-09-03 | 287,917 Florida carriers; 156,367 active |
| Quintel Florida UCC corpus (prod `debt_event`) | prior equipment lien, secured party, modelled renewal window, PCF grade | 2026-09-03 | 67,126 Florida filings |
| Florida DEP septic business authorizations | septic operator registry and business email | 2026-09-03 | 610 active |
| Florida DEP individual septic contractors | registered septic contractors | 2026-09-03 | 717 active |
| Florida DBPR construction licensee extract | licence class and qualifier name | 2026-09-03 | 256,903 licences; 103,077 active |
| Google Places API (New) Text Search | website, second phone, business operating status | 2026-09-03 | 640 calls, 331 matched |
| Twilio Lookup v2 | line validity, line type, carrier | 2026-09-03 | 199 numbers checked, 199 valid |

## Deliberately not used

LinkedIn-derived contact vendors (Apollo, ZoomInfo, Coresignal, RocketReach), intent-data
vendors, voter files, and every demographic field. Providence's own persona document lists
gender, race, religion, political party and marital status; none is used anywhere in this
batch, for fair-lending reasons and because none is needed.

## How a row was built

1. **Discovery.** A company enters the pool by appearing in a registry that implies the
   equipment — the carrier census, a DBPR licence class, or an FDEP septic authorization —
   or by carrying a Florida UCC equipment lien.
2. **Verification.** It must be active with the State of Florida, with an officer named in
   the corporate record. 49 of the 50 filed a 2026 annual report, meaning the company
   itself confirmed its officer list with the state this year.
3. **Contact.** Phone is taken from the operator's own MCS-150 filing where one exists
   (39 of 50), otherwise from Google Places (11). Every number on the
   sheet was checked with Twilio and returned valid. 14 rows carry the same number
   from two independent sources; where the two disagree, the second number is in `phone_alt`.
4. **Evidence.** `equipment_quote` is a verbatim statement from a government filing, never
   marketing copy. Sources on this batch: 39 from fmcsa mcs150, 10 from ucc filing, 1 from dbpr license.
5. **Exclusion.** Companies Providence or Quintel has already contacted were removed by
   name, city, domain and phone against the prod delivery record — including the 100 rows
   sent to Providence on 2026-08-27 — and David's April vendor list.

## The three arms in the `tier` column

| Arm | Rows | What it tests |
|---|---:|---|
| `intersection` | 30 | a registry anchor **and** a prior equipment lien **and** an active corporate record all agree |
| `anchor_only` | 10 | registry anchor and active corporate record, but no lien on file |
| `ucc_only` | 10 | prior equipment lien and active corporate record, but no registry anchor |

Grade all three the same way. The arms exist so the verdicts can say which source earned
the reach rate, which decides where batch 2's effort goes.

## Row review before delivery

Every row in the 50 and the bench was read individually after the build. Eleven rows from
the first cut were replaced by rule: three out-of-persona companies the registries had
tagged as operators (a resort club, an agricultural co-op, a hardware store), two lane
mis-tags from cargo flags (an electrician, an ironworks), one duplicate owner, and five
Keys businesses over a Monroe County cap of five. Five rows were re-laned (concrete pumping and an
aggregate yard to B, a well-and-pump contractor to A_DIRT). Owner names were rebuilt from the raw
registry string so middle initials and suffixes survive. The sheet ships without verdict columns. `ucc_ripe_date` is blank where
the modelled window is already open and holds a date only where a future opening is
predicted.

## Composition

- Lane: A_DIRT 20, A_VAC 8, B 14, C 7, E 1
- County tier: rural 37, small metro 11, big metro 2 (Monroe County capped at 5 rows)
- Email present: 40 · website present: 25
- Time in business: median 21.5 years, minimum 3.5

## Known limits, stated plainly

- **Twilio trial quota.** The account is a trial and stopped answering after 199 of 552
  numbers (HTTP 429, error 60624). Every number it did check came back valid — zero
  invalid — but that also means "valid" here has not been stress-tested against a real
  dial. Only Twilio-verified rows were used for the 50 and the bench; 290 good rows with an
  unchecked number sit in `CONTINUATION_POOL.csv`. Lifting the trial limit is the single
  cheapest unblock for batch 2.
- **A landline that is disconnected cannot be detected by any API.** David's dial is that
  test, and his `phone_ok` verdict is the label. This is the main thing batch 1 measures.
- **Only 5% of in-box Florida owner-operators have a website on record.** Equipment
  evidence therefore comes mostly from registry declarations rather than site text. That
  is stronger provenance, but it means we cannot describe a company's fleet in its own words.
- **County tiers are derived from county population** (10 largest BIG_METRO, next 26
  SMALL_METRO, remaining 31 RURAL). The playbook cites a 30/26/10 list from Alek's P2
  that is not in the vault.
- **`ucc_only` rows have no registry equipment declaration** by construction; their
  evidence is the lien itself, which is weaker. `equipment_source` says which is which.
- **Exclusion coverage is partial.** David's April list is 1,269 rows of which only 61 are
  Florida, so it removes little here. The playbook refers to a 3,000-row list we do not hold.
- **The FMCSA cargo class is self-declared** on the MCS-150 and can be stale; the filing
  date is on every row so its age is visible.

## Files

| File | Rows | Purpose |
|---|---:|---|
| `FL_PHONE_TEST_50_2026-09-04.csv` | 50 | the batch David calls |
| `BENCH_25.csv` | 25 | verified replacements for any row that fails re-verify |
| `CONTINUATION_POOL.csv` | 407 | further verified and near-verified rows for continued calling |
| `FL_POOL_v1.csv` | 134,719 | every candidate considered, each with its `exclusion_reason` |
| `SIGNALS.csv` | 3,200 | one row per signal per company, no composite score |
