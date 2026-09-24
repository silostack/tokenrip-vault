# "Full Slice" Sample — Machinery Sector — 2026-09-03

A worked example of what one segment of the plan produces, before committing to the full
crawl. Not the pilot from the plan (that would be one narrow state×size cell run through
every phase); this is a broader sector-level sample so you can see the actual data shape and
richness fast.

## What was pulled — 8 calls total, live/interactive (no artificial pacing used)

| Step | Call | Result |
|---|---|---|
| 1 | `company_search(sectors=[Machinery], ownership=pe-backed)` | 50 of an unbounded PE-backed Machinery universe |
| 2 | same, `pivot=investor_firms` | 50 of **490** distinct PE firms with a Machinery holding |
| 3 | `deal_search(sectors=[Machinery], date_from=2020)` | 50 of **1,174** Machinery deals since 2020 |
| 4 | `entity_profile` batch, 10 firm ids | full HQ/contact cards |
| 5 | `firm_portfolio` batch, 10 firm ids, Machinery-filtered, all statuses | 90 portfolio holdings |
| 6 | `firm_professionals` batch, 10 firm names, senior only | 162 named people, 201 raw records |

## What's in the CSVs

- **`firms.csv`** (10 rows) — HQ street address, city, state, zip, country, phone, website
  for KKR, H.I.G. Capital, Carlyle, Advantage Capital, Credit Mutuel Equity, Main Street
  Capital, One Equity Partners, Bpifrance, Groupe Baelen, Anders Invest. Several firms
  (Bpifrance, Groupe Baelen) have partial address data — Mergr's own gaps, not ours.
- **`portfolio_holdings.csv`** (90 rows) — every Machinery-sector company those 10 firms
  hold or held: acquired/exit dates, hold years, deal type, revenue, and
  acquisitions/divestitures made *during* that firm's ownership (roll-up signal).
- **`firm_professionals.csv`** (162 rows) — named senior people at those 10 firms: title,
  function, seniority tier, office city, and **email where Mergr tracks it — 89 of 201 raw
  records (~44%) carried a populated email** in this sample.
- **`deals.csv`** (50 of 1,174 rows) — every Machinery deal since 2020: target, buyer(s),
  seller(s), advisors (bank/law, with side), deal value where disclosed.

## What one call slot buys, concretely

Portfolio and contact-profile batches (10 entities/call) are the highest-yield tools in the
connector — one `firm_portfolio` call here returned 90 structured rows. The deal spine is the
opposite: 1,174 Machinery deals alone need ~24 calls at the 50-row cap, and that's one sector
out of 61. This is the concrete version of the call-budget math in the plan.

## Not yet pulled in this sample
Trading-partner edges (derivable from `deals.csv` per the plan, not called directly),
`ownership_graph` eras, `dossier` narratives, non-senior professionals, and the other 440
Machinery-adjacent firms beyond this 10.
