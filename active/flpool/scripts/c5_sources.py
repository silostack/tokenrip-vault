#!/usr/bin/env python3
import csv, datetime, json, os, subprocess
from collections import Counter

def q(sql):
    r = subprocess.run(["psql","-d","flpool","-Atc",sql],capture_output=True,text=True)
    return r.stdout.strip()

rows = list(csv.DictReader(open("out/FL_PHONE_TEST_50_2026-09-04.csv", newline="")))
pool = list(csv.DictReader(open("out/FL_POOL_v4_SIGNALS.csv", newline="")))
tw = json.load(open("data/work/twilio_cache.json"))
checked = sum(1 for v in tw.values() if v.get("valid") or v.get("line_type"))
valid = sum(1 for v in tw.values() if v.get("valid"))
T = "2026-09-03"

def sz(p):
    return f"{os.path.getsize(p)/1e6:.0f} MB" if os.path.exists(p) else "n/a"

open("out/FL_PHONE_TEST_50_SOURCES.md","w").write(f"""# FL_PHONE_TEST_50 — sources and method

Batch of 50 Florida companies for Providence Capital Funding, prepared {T} for phone
verification by David LaSaee. Every field on the sheet traces to one of the sources below.

## Sources used

| Source | What it provided | Pull date | Rows pulled |
|---|---|---|---|
| Florida Division of Corporations (Sunbiz) quarterly corporate file | company liveness, time in business, owner name and title, principal address | 2026-07 quarterly, parsed {T} | 12,808,196 records read; 11,802,288 Florida; 3,855,431 active |
| Sunbiz corporate events file (`corevt`) | former-name aliases, to stop renamed companies failing the lien join | same | 342,592 name-change events |
| FMCSA motor-carrier census (Socrata `az4n-8mr2`) | phone, email, officer name, county, fleet size, self-declared cargo class | {T} | 287,917 Florida carriers; 156,367 active |
| Quintel Florida UCC corpus (prod `debt_event`) | prior equipment lien, secured party, modelled renewal window, PCF grade | {T} | 67,126 Florida filings |
| Florida DEP septic business authorizations | septic operator registry and business email | {T} | 610 active |
| Florida DEP individual septic contractors | registered septic contractors | {T} | 717 active |
| Florida DBPR construction licensee extract | licence class and qualifier name | {T} | 256,903 licences; 103,077 active |
| Google Places API (New) Text Search | website, second phone, business operating status | {T} | 640 calls, 331 matched |
| Twilio Lookup v2 | line validity, line type, carrier | {T} | {checked} numbers checked, {valid} valid |

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
   the corporate record. 48 of the 50 filed a 2026 annual report, meaning the company
   itself confirmed its officer list with the state this year.
3. **Contact.** Phone is taken from the operator's own MCS-150 filing where one exists
   ({sum(1 for r in rows if r['phone_source']=='fmcsa_mcs150')} of 50), otherwise from Google Places ({sum(1 for r in rows if r['phone_source']=='google_places')}). Every number on the
   sheet was checked with Twilio and returned valid. {sum(1 for r in rows if r['phone_corroborated']=='true')} rows carry the same number
   from two independent sources; where the two disagree, the second number is in `phone_alt`.
4. **Evidence.** `equipment_quote` is a verbatim statement from a government filing, never
   marketing copy. Sources on this batch: {", ".join(f"{v} from {k.replace('_',' ')}" for k,v in Counter(r['equipment_source'] for r in rows).most_common())}.
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

## Composition

- Lane: {", ".join(f"{k} {v}" for k,v in Counter(r['lane'] for r in rows).most_common())}
- County tier: {", ".join(f"{k.lower().replace('_',' ')} {v}" for k,v in Counter(r['county_tier'] for r in rows).most_common())}
- Email present: {sum(1 for r in rows if r['email'])} · website present: {sum(1 for r in rows if r['website'])}
- Time in business: median {sorted(float(r['tib_years'] or 0) for r in rows)[len(rows)//2]:.0f} years

## Known limits, stated plainly

- **Twilio trial quota.** The account is a trial and stopped answering after {checked} of 552
  numbers (HTTP 429, error 60624). Every number it did check came back valid — zero
  invalid — but that also means "valid" here has not been stress-tested against a real
  dial. Only Twilio-verified rows were used for the 50 and the bench; {sum(1 for r in pool if r.get('phone_status')=='unverified' and not r['c3_exclusion'])} good rows with an
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
""")
print(open("out/FL_PHONE_TEST_50_SOURCES.md").read()[:3000])
