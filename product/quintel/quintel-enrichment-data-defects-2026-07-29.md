# Quintel — Enrichment and Signal Data Defects

**Date:** 2026-07-29
**Author:** Closer session (Simon)
**Audience:** Engineering
**Instance examined:** local dev, `postgresql://quintel@localhost:5432/quintel`
**Status:** eight defects across two datasets, reproduction queries included

---

## Executive summary

A single upstream omission — the USASpending connector discards the award record's recipient identifier — cascades into four downstream defects that together make **large federal prime contractors present themselves as small-ticket financing prospects**. On the buy box of a small-ticket lender, every prospect the engine currently surfaces with a recent signal is a false positive of this same class.

The defect chain, in order of causation:

| # | Defect | Root cause | Severity |
|---|---|---|---|
| 1 | Award records are ingested without the recipient UEI | `usaspending.connector.ts` persists only `{entity:{geo,name,naics}, created}` | **P0 — causes 2, 3, 5** |
| 2 | Company identity resolved by name lookup, not registry | With no UEI, `UsaSpendingProvider` returns `{}`; resolve falls through to google-places name match | **P0 — wrong companies in the product** |
| 3 | `est_ticket` is `revenue × 0.08` with confidence discarded | `materialize.ts:36-38` | **P0 — the buy-box filter is not measuring what it claims** |
| 4 | `signal.event_date` is the ingestion date, not the award date | connector writes `raw.created` = ingest timestamp; `date_signed` is available and unused | **P1 — falsifies the timing claim we sell** |
| 5 | `company.state` contradicts the company's own enrichment geo | two writers, no reconciliation; `materialize` gap-fills `geo` but never `state` | **P1 — 9.5% of enriched companies** |

A second dataset, the UCC renewal snapshots in `debt_event`, is in materially better shape and is now the evidence base for small-ticket prospect collateral. It carries three problems of its own, all of the same family — a field that reads like a measurement but is not:

| # | Defect | Root cause | Severity |
|---|---|---|---|
| 6 | `ripe_date` on an `in_window_now` row is the date the evaluation ran, not a maturity date | all 25,930 such rows carry `2026-07-10` | **P1 — reads as a per-deal due date and is not one** |
| 7 | `validation_outcome = 'affirmed'` is an adverse-info/liveness check, easily misread as filing verification | naming; `validation_result` is free text about the business | **P1 — invites shipping an unverified filing as verified** |
| 8 | Provenance stops at three hand-delivered CSVs with no documented upstream | `config/ucc/*.csv`, dated 2026-07-15 | **P1 — nothing in the repo says where these filings came from** |

**Commercial consequence.** These were found while building prospect collateral for a small-ticket lender (Envision Capital Group, stated approvals up to $350K). The sample lead slide had to be pulled, and the coverage count that five lenders have now asked for cannot be produced from this data, because the field that defines the ticket band is a rescaled copy of an unreliable third-party revenue guess.

**The structural point worth more than any individual fix.** Findings 3, 4 and 6 are the same bug three times: *a derived or administrative value occupying a field that a reader takes for a measurement.* `est_ticket` looks like a ticket and is a revenue multiple. `event_date` looks like an event date and is an ingest timestamp. `ripe_date` looks like a maturity and is a cron run time. Each one is individually defensible internally and individually indefensible the moment it reaches a customer. A naming and provenance convention would prevent the next three.

**What is not claimed here.** This is a local dev instance with test accounts (`acct_test_*`, `acct_pkgsvc_*`) and six weeks of signal history (2026-06-15 → 2026-07-29). The defect *mechanisms* are in committed code and will reproduce anywhere. The *magnitudes* below are from this instance only and should be re-measured against production before being quoted to anyone.

---

## Finding 1 — The connector throws away the award's identity, and everything downstream is guessing

`signal.raw` for a USASPEND signal contains three fields and none of them identify the recipient:

```
select left(raw::text,700) from signal where src='USASPEND' limit 1;
{"entity": {"geo": "WY", "name": "E CORP", "naics": "237310"}, "created": "2026-06-26T00:00:00.000Z"}
```

```
select count(*) total,
       count(*) filter (where raw ? 'recipient_uei' or raw ? 'uei' or raw ? 'recipient_unique_id') with_uei
from signal where src='USASPEND';
 total | with_uei
-------+----------
   149 |        0
```

Zero of 149 award signals carry a UEI. The USASpending award API returns the recipient's UEI, legal business name, registered city and state, NAICS code with description, obligated amount, `date_signed`, and period of performance in the same response the connector already fetches.

**Why this is the root cause.** `apps/backend/src/api/enrich/providers/usaspending.provider.ts` opens with:

```ts
async enrich(input: EnrichInput, _stage: EnrichStage): Promise<Partial<CompanyEnrichment>> {
  if (!input.uei) return {};
```

No UEI means the highest-confidence, zero-cost, registry-grade resolver is a no-op on every federal-award lead. Its own docstring calls it the *"highest-confidence resolve when a lead carries a UEI (federal-award-sourced)"* — which is precisely the lead type where the UEI is being dropped.

Measured effect on the resolve stage:

```
select count(*) total,
       count(*) filter (where enrichment @> '{"trace":[{"stage":"resolve","provider":"usaspending","hit":false}]}') resolve_missed
from company where discovery_src='usaspend' and enrichment is not null;
 total | resolve_missed
-------+----------------
    18 |             16
```

**Suggested fix.** Persist `recipient_uei` (and the award id, `date_signed`, and recipient registered location) on the signal at ingest. Consider resolving from the award endpoint `/api/v2/awards/{generated_id}/` rather than `/api/v2/recipient/{uei}/`, since a single call returns identity *and* the correct date, closing Finding 4 at the same time.

---

## Finding 2 — With no UEI, companies are identified by name search, and the wrong companies enter the product

Every enriched company in this instance that has a geo source was resolved by google-places. None were resolved by a registry:

```
select coalesce(enrichment->'geo'->>'source','(none)') geo_source,
       coalesce(enrichment->'size'->'revenueUsd'->>'source','(none)') rev_source,
       count(*)
from company where enrichment is not null group by 1,2 order by 3 desc;
  geo_source   | rev_source | count
---------------+------------+-------
 google-places | (none)     |   614
 google-places | diffbot    |   325
 (none)        | (none)     |   308
 google-places | apollo     |   127
```

**The confirmed mis-resolve.** `CROWN INNOVATIONS, INC.` is a Department of Transportation prime contractor (NAICS 237130, Power and Communication Line Construction) holding awards of $27.2M and $12.5M. Our record resolves it to:

```
name        | CROWN INNOVATIONS, INC.
website     | crowninnovate.com
state       | CA
enrichment  | {"geo": {"value": {"city": "Bend", "state": "OR"},
                       "source": "google-places", "confidence": 0.7},
               "size": {"employees": {"value": 5, "source": "diffbot", "confidence": 0.78},
                        "revenueUsd": {"value": 1000000, "source": "diffbot", "confidence": 0.78}}}
```

`crowninnovate.com` is a **gunsmithing and precision machining shop in Bend, Oregon**. Its own site: *"we focused solely on firearms but quickly realized our state of the art machines... could offer extensive services to the aerospace, defense, and industrial sectors."* It is not the DOT line-construction contractor, and the $1M revenue and 5 employees belong to the machine shop, not the prime.

This company ranked in the top results for the buy box of a lender we were about to send collateral to. A reader clicking the website would have found a gun shop.

**Why it matters beyond one row.** Entity resolution across sources is the argument we use against build-vs-buy — *"the scrape is the easy 20%, matching the same company across a permit, a UCC filing and a job posting is the part that eats months."* A name-match resolver with no registry anchor is the thing we tell buyers not to build.

**Suggested fix.** Anchor resolution on the UEI when the lead is federal-award-sourced. Where no authoritative identifier exists, record the resolution as low-confidence and gate it out of customer-visible surfaces rather than materializing it into display fields. `resolution_confidence` is currently NULL on the affected rows while `resolution_method` reads `created`.

---

## Finding 3 — `est_ticket` is revenue rescaled, and it is the field the buy box filters on

Every populated `est_ticket` in the database is exactly 8% of `revenue_usd`:

```
select round((est_ticket::numeric/revenue_usd)::numeric,4) as ratio, count(*)
from company where est_ticket is not null and revenue_usd>0 group by 1 order by 2 desc;
 ratio  | count
--------+-------
 0.0800 |   471
```

Source, `apps/backend/src/api/enrich/materialize.ts:36-38`:

```ts
if (out.estTicket == null && seam.size?.revenueUsd) {
  out.estTicket = Math.round(seam.size.revenueUsd.value * TICKET_FRACTION);
}
```

Three problems, in increasing order of severity:

1. **No confidence propagation.** The seam carries `revenueUsd.confidence: 0.78`. It is discarded. A 0.78-confidence third-party estimate becomes an integer that renders as `$208,000` and reads as measured.
2. **No independent information.** `est_ticket` is a monotonic transform of `revenue_usd`, so any buy-box filter on ticket band is a filter on revenue band wearing a different label. It cannot disagree with revenue, cannot be corroborated against it, and adds nothing to the score.
3. **No sector variation.** A flat 8% applies the same capital intensity to a dental practice, a trucking fleet, and a highway contractor.

Combined with Finding 2, the practical result is the one that pulled the collateral. All three companies in this instance that satisfy "small-ticket band, signal in the last 90 days" are large federal primes whose derived ticket came from wrong revenue:

```
select c.name, c.est_ticket, c.revenue_usd, c.employees, left(s.title,52)
from company c join signal s on s.company_id=c.id
where c.est_ticket between 10000 and 350000
  and c.last_signal_at > now() - interval '90 days';

 CDM CONSTRUCTORS INC           | 280000 | 3500000 |  5 | Federal contract award: $357.7M
 CROWN INNOVATIONS, INC.        |  80000 | 1000000 |  5 | Federal contract award: $27.2M
 CROWN INNOVATIONS, INC.        |  80000 | 1000000 |  5 | Federal contract award: $12.5M
 STEVE MANNING CONSTRUCTION INC | 208000 | 2600000 | 12 | Federal contract award: $58.2M
 STEVE MANNING CONSTRUCTION INC | 208000 | 2600000 | 12 | Federal contract award: $43.3M
 STEVE MANNING CONSTRUCTION INC | 208000 | 2600000 | 12 | Federal contract award: $9.4M
```

A firm holding $357.7M in federal awards does not have five employees and $3.5M in revenue. The small-ticket appearance is entirely an artifact.

**Suggested fix.** Stop deriving `est_ticket` from revenue alone, or stop exposing it as a filterable field. If a derived estimate is kept, carry the source confidence through to the surface, vary the fraction by sector or NAICS capital intensity, and render it as a band rather than a precise dollar figure.

---

## Finding 4 — `signal.event_date` is when we ingested the record, not when the event happened

The deck, the demo and the pitch all rest on one claim: signals reach the customer close to the day they hit the public record. `event_date` does not support that claim.

Five awards were checked against the USASpending v2 award API. The database gives all of them an `event_date` in June or July 2026. Their actual `date_signed`:

| Recipient | DB `event_date` | Actual `date_signed` | Age at ingest |
|---|---|---|---|
| GAVER INDUSTRIES, INC. | 2026-06-30 | 2026-06-22 | 8 days |
| WILLIAMS CONSTRUCTION & CABINETRY | 2026-06-30 | 2026-06-29 | 1 day |
| MCW-TMG1 LLC | 2026-07-25 | 2026-03-05 | ~5 months |
| WHELCON CONTRACTORS LLC | 2026-07-25 | 2025-04-15 | ~15 months |
| YELLOWSTONE ELECTRIC CO | 2026-07-25 | 2024-08-12 | ~23 months |
| STEVE MANNING CONSTRUCTION (SEKI) | 2026-07-12 | 2024-12-23 | ~19 months |

Reproduce any row with:

```
curl -s "https://api.usaspending.gov/api/v2/awards/CONT_AWD_6982AF25C000009_6925_-NONE-_-NONE-/" \
  | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['date_signed'], d['total_obligation'])"
# 2024-12-23 43349011.6
```

The connector's `raw.created` is the ingest timestamp, so a two-year-old award is indistinguishable from one signed last week. Freshness ranking, decay, `last_new_evidence_at`, and the `window_end` logic are all reading a timestamp that carries no information about the event.

**Commercial exposure.** This is the one defect a prospect can catch unaided. The USASpending page is one click from the evidence link we ship on every row, and it displays the signed date.

**Suggested fix.** Populate `event_date` from `date_signed` (or `action_date` for modifications) and keep the ingest timestamp in a separate `ingested_at`. Backfill is cheap: the award id is already on `signal.link`.

---

## Finding 5 — `company.state` and the company's own enrichment geo disagree on 9.5% of rows

```
select count(*) filter (where state is distinct from enrichment->'geo'->'value'->>'state') mismatched,
       count(*) total
from company where enrichment->'geo'->'value'->>'state' is not null;
 mismatched | total
------------+-------
        101 |  1065
```

Worked example. `STEVE MANNING CONSTRUCTION INC` carries `state = 'OR'`. Its enrichment geo says `{"city":"Redding","state":"CA"}`, its website confirms *"one of the leading general engineering contractors in Northern California"* at Redding CA, and the USASpending recipient record says `REDDING CA`. The `OR` most plausibly came from the place of performance on its Crater Lake award.

`materialize()` gap-fills `geo` but has no writer for `state`, and its gap-fill is conditional:

```ts
if (!out.geo && seam.geo) { ... }
```

So where discovery has already written a geo from place-of-performance, the correct registered-address geo from enrichment can never land, and `state` is never reconciled with either.

**Why it matters.** Geography is a buy-box filter and a territory-assignment input. A lender filtering to their licensed or covered states silently gets the wrong set. In this instance the effect is inverted from the usual worry: a California contractor was excluded from a California lender's box.

**Suggested fix.** Distinguish the company's registered/HQ location from a signal's place of performance — they are different facts and both are useful. Reconcile `state` against `geo` with a documented precedence, and let a higher-confidence source overwrite a lower-confidence one rather than gap-filling only into nulls.

---

## Finding 6 — `ripe_date` is a cron timestamp wearing a maturity date's clothes

`ripe_basis` splits the table two ways, and only one of them carries a real per-filing prediction:

```
select state, ripe_basis, count(*), min(ripe_date)::date mn, max(ripe_date)::date mx
from debt_event group by 1,2 order by 1,3 desc;

 CO | lender_window_entry | 12912 | 2026-07-10 | 2030-02-20
 CO | in_window_now       |  4947 | 2026-07-10 | 2026-07-10
 CT | lender_window_entry |  7945 | 2026-07-10 | 2030-03-27
 CT | in_window_now       |  3316 | 2026-07-10 | 2026-07-10
 FL | lender_window_entry | 49436 | 2026-07-11 | 2030-03-23
 FL | in_window_now       | 17667 | 2026-07-10 | 2026-07-10
```

Every `in_window_now` row in all three states carries the identical `ripe_date` of 2026-07-10, which is when the evaluation ran. The semantics are defensible — "as of this run, this filing is already inside its replacement window" — but the field name says maturity, so any UI, export or slide that prints it as a date is asserting something false. `lender_window_entry` rows are genuine forward predictions and are safe to date.

Related: `median_gap_months` is populated on 12,913 of 25,930 `in_window_now` rows and **zero** of the 70,293 `lender_window_entry` rows, and some populated values are not credible (201.86 months on one row, i.e. a 16-year equipment term). Do not surface a term length without checking the row has a plausible one.

**Suggested fix.** Split the field: `ripe_date` for genuine forward predictions, null for in-window rows, plus an `evaluated_at` that is honestly named. Or keep one field and require callers to branch on `ripe_basis` — but then the branch has to be enforced somewhere other than a rendering convention.

## Finding 7 — "affirmed" does not mean the filing was verified

`validation_outcome` reads like record verification. It is not:

```
select validation_outcome, left(validation_result,90), count(*)
from debt_event where validation_result is not null group by 1,2 order by 3 desc limit 4;

 silent   | No adverse info found; no search results at all for this name and location | 1428
 silent   | No adverse news found; part of JMS restaurant-holding group, New Port Richey FL | 8
 affirmed | Sibling entity to VIR 10 LLC, same Leesburg address/agent family; no adverse findings | 4
 affirmed | Same active Team Meraki franchise family Enfield CT no adverse info | 3
```

This is an adverse-information and business-liveness check on the *debtor* — useful, and a good filter for whether a company is a real going concern. It says nothing about whether the UCC filing exists, whether the secured party is right, or whether the date is right. Anyone selecting rows on `validation_outcome='affirmed'` and believing they have verified filings has made a category error. (Confirmed: that is exactly the mistake this session nearly shipped.)

**Suggested fix.** Rename to something that says what it checks — `debtor_diligence_outcome` — and add a separate, genuinely empty `filing_verified_at` so the absence of registry verification is visible rather than implied.

## Finding 8 — Nothing in the repo says where these filings came from

```
ls apps/backend/config/ucc/
colorado-ucc-ripe.csv      3,147,168 bytes   Jul 15 15:24
connecticut-ucc-ripe.csv   1,998,732 bytes   Jul 15 15:24
florida-ucc-ripe.csv      14,617,902 bytes   Jul 15 15:24
```

`UccLoaderService` describes these accurately as "curated UCC ripening snapshots" and loads them idempotently by content hash. That part is well built. But the CSVs already contain the computed columns (`ripe_date`, `ripe_basis`, `pcf_grade`, `score`, `dueness`, `median_gap_months`, `kill_reason`, `validated_on`), so the scoring happened upstream of this repo, and the `source` column values (`young_filings`, `PRIORITY_efdeals_v2`, `PCF_buybox_fit_FL_2026-07-11`, `FL_top2000_signal_ranked_2026-07-10`) are labels for extracts nothing here documents.

Filing numbers match plausible state formats (FL `202401001717`, CT `5218765`, CO `2291900`), and spot data quality is mixed but not alarming: some debtors sit outside the filing state (a TX debtor in the FL file), some city strings are dirty (`DORAL,, FL`), and at least one municipality (`TOWN OF FAIRFIELD`) is classed `ef_independent`.

**Why it blocks a send.** Prospect collateral now names four Florida debtors, their secured parties, and their filing numbers, and invites the reader to pull them from the state registry. If the upstream was a scrape with drift, or a purchased extract with a stale cut, the reader finds out before we do. Provenance needs documenting and a handful of rows need reconciling against floridaucc.com before that deck ships.

**Suggested fix.** Record the upstream source, acquisition date, and licence for each snapshot in a sidecar file the loader reads and stamps onto the rows. Then build the registry spot-check into the pipeline rather than doing it by hand per deck.

## Finding 9 (observation, not a defect) — the two datasets serve different tiers, and only one of them serves small ticket

```
select case when capex_usd is null then 'null'
            when capex_usd < 500000 then '<500K'
            when capex_usd < 5000000 then '500K-5M'
            when capex_usd < 50000000 then '5M-50M'
            else '50M+' end as band, count(*) from signal group by 1;
 null      | 1073
 <500K     |   97
 500K-5M   |   28
 5M-50M    |   165
 50M+      |   67
```

77% of signals have no capex value. Of those that do, 73% are $5M or above. This is consistent with the signal mix — federal awards, permits, facility expansions are all events that skew toward larger projects — and it raises a product question rather than a bug: **the signal types the engine reads structurally surface prime contractors and large capital projects, which is a different tier from the borrower a small-ticket lender writes paper for.**

**The UCC dataset does not have this problem, and the reason is structural.** A `debt_event` debtor is a company that already financed equipment with a secured lender, which makes fundability and rough ticket band *evidenced by the filing* rather than inferred from a revenue estimate. No `est_ticket` is involved, so Finding 3 cannot corrupt the selection. The debtor population reads exactly like a small-ticket book — towing operators, tire shops, auto body, embroidery, small dental practices, single-crew contractors — and the secured parties are the small-ticket independents (Beacon Funding, GreatAmerica, Navitas, Blue Bridge, Stearns, De Lage Landen, Trans Lease).

```
select lender_class, count(*) from debt_event group by 1 order by 2 desc;
 bank           | 48958
 ef_independent | 23314
 captive        | 19350
 ef_keyword     |  2768
```

So the practical answer to the tier gap already exists in the repo: **award and permit signals for the tiers that win large work, UCC renewal signals for the small-ticket tier.** Worth deciding deliberately rather than per prospect, and worth noting that UCC coverage is three states (FL, CO, CT) while the award feed is national.

Two further directions, neither validated:

- **Sub-tier decomposition.** The ripple/decomposition path already attaches small regional contractors to large project signals (observed: three Florida contractors with $910K–$2.5M revenue attached to a $500M hospital groundbreaking). That is the right *shape* for a small-ticket lender, but as built it is an inference with no stated confidence, and in the observed case the evidence link pointed at an unrelated article about a retail store. It cannot be shown to a customer in its current state.
- **Small-operator signal types.** Sources whose subjects are inherently small: new FMCSA fleet authority, county-level small permits, state small-business incentive awards. None appear meaningfully in the current mix.

---

## Priority and sequencing

1. **Finding 1** — persist UEI, award id, and `date_signed` at ingest. Unblocks 2 and 4 and is the smallest change in the set.
2. **Finding 2** — anchor resolve on UEI; gate low-confidence name-matched companies out of customer-visible surfaces. Audit the 16 affected rows and re-resolve.
3. **Finding 3** — remove `est_ticket` from filterable surfaces until it carries real information, or propagate confidence and render as a band.
4. **Finding 4** — backfill `event_date` from `date_signed` using the award id already on `signal.link`.
5. **Finding 5** — separate registered location from place of performance; reconcile `state` and `geo`.
6. **Findings 6 and 7** — rename both fields and split `ripe_date`. These are cheap, and they are the difference between a UI that can safely show renewal timing to a customer and one that cannot.
7. **Finding 8** — document snapshot provenance and automate the registry spot-check. Blocking on live prospect collateral right now.
8. **Finding 9 (below)** — product decision, not a bug fix.

## Open questions for engineering

- Is this instance representative of production? All magnitudes above need re-measuring if not.
- Was the resolve waterfall ever exercised against a lead that *did* carry a UEI, and did it work? The provider docstring flags *"⚠️ Verify response shape at integration"* against the `/recipient/{uei}/` endpoint, which suggests it may never have been run live.
- Is there a reason `materialize` is gap-fill-only rather than confidence-ranked? The docstring states the intent clearly, so this looks deliberate; the question is whether it should hold once a source carries registry-grade confidence.

## Blocked on this

- The coverage count owed to five lenders (Bo/Hyland, Michael/Providence, Bill/Armada, Kevin/Civista, Paul/Capteris). It cannot be produced credibly for any small-ticket buyer off the award corpus while Finding 3 stands. It probably *can* be produced off `debt_event`, which needs no `est_ticket` — that is the fastest route to answering a question five firms have asked and none have had answered.
- **The Envision deck, right now.** Its proof slide names four Florida debtors with their secured parties and filing numbers and invites the reader to pull them from the state registry. Findings 7 and 8 mean we cannot currently claim those rows are verified: `validation_outcome='affirmed'` checks the business, not the filing, and provenance stops at an undocumented CSV. Four registry lookups unblock the send.
