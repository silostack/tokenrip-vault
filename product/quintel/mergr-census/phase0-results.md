# Mergr Phase 0 Census — 2026-09-03

Read-only calls against the live connector: `analytics(filter_options)`, `firm_search`
(active_only=true and false), `company_search`, `deal_search`. 5 calls total.

## Universe sizes (real, not estimated)

| Entity | Count |
|---|---|
| PE firms, active only | 4,154 |
| PE firms, incl. inactive | 4,890 |
| Companies (all ownership types) | 225,797 |
| Deals (all-time) | 215,198 |

This is smaller on the firm side than the plan's "medium" scenario (15k) — call it ~5k firms.
Companies and deals are in range or slightly above the medium estimate.

## Sectors (61 total, with counts) — see raw filter_options response for full list

EF-adjacent candidates by raw deal-count: Machinery (1,846), Distribution (3,066),
Transportation (1,786), Construction (1,568), Energy Services and Equipment (1,370),
Aerospace (860), Manufacturing (3,460, broad). Business Services (11,281) and Information
Technology/Software (~28k combined) dominate the database and are not EF-priority.

## Deal types (15 canonical values), states (63, incl. Canadian provinces), countries (79)
Full lists captured in the raw filter_options response — canonical strings for use in every
downstream sectors/states/countries filter param.

## Revised call-budget sketch

- Firm search+profile+portfolio (batched 10/call): ~490 firm-side calls for full detail
- Deal spine (50/call cap, before date-bisection needed): ~4,300+ calls minimum — still the
  dominant cost, as flagged in the plan
- Companies: mostly derived via firm_portfolio rather than direct search of 225k

## Status
Phase 0 complete. No bulk crawl has been run. This file exists to make the next sizing
decision (deal-history window, EF-only vs. full-universe scope) with real numbers instead of
guesses.
