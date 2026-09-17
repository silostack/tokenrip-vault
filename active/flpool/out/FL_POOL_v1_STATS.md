# FL_POOL_v1 stats

Generated 2026-09-03. 134,719 candidate rows; **83987** eligible.
No row was deleted — every rejected row remains in `out/FL_POOL_v1.csv` with an
`exclusion_reason`, so the funnel can be audited end to end.

## Eligible rows by tier and lane

| Lane | Intersection | Anchor only | UCC only | Eligible |
| --- | ---: | ---: | ---: | ---: |
| B | 1915 | 37679 | 612 | 40206 |
| E | 730 | 19383 | 0 | 20113 |
| A_DIRT | 2223 | 13853 | 509 | 16585 |
| C | 504 | 5738 | 186 | 6428 |
| A_VAC | 127 | 447 | 81 | 655 |

The three arms exist so David's verdicts can say which source earned the pass. Batch 1
draws 30 / 10 / 10 from intersection / anchor_only / ucc_only.

## Why rows were excluded

| Exclusion reason | Rows |
| --- | ---: |
| no_sunbiz_match | 34341 |
| sunbiz_inactive | 13951 |
| has_finance_officer | 1435 |
| restricted_name | 598 |
| no_owner_named | 273 |
| restricted_soft_no_evidence | 84 |
| already_touched | 28 |
| ucc_killed | 22 |

`has_finance_officer` is worth noting: Providence's box treats a CFO or controller as a
disqualifier because they want the owner-operator who decides alone. Sunbiz officer
titles surface that from the state record, before any web lookup.

`already_touched` is the trust-critical one — companies Providence or Quintel has
already contacted, matched on name+city or domain against the prod delivery record
(including the 100 rows sent to Providence on 2026-08-27) and David's April vendor list.

## Owner naming

| Owner source | Rows | Share |
| --- | ---: | ---: |
| sunbiz | 76445 | 91.0% |
| license | 7542 | 9.0% |


## Sunbiz match method

| Sunbiz match | Eligible | Intersection |
| --- | ---: | ---: |
| name_city | 59285 | 5014 |
| name_only | 24702 | 485 |

`name_only` rows matched Sunbiz on company name but not city — typically a carrier
whose physical yard sits in a different city from its corporate principal address.
They are kept and flagged; batch 1 prefers `name_city`, and David's verdicts will show
whether the distinction matters.

## County tier

| County tier | All eligible | Intersection |
| --- | ---: | ---: |
| BIG_METRO | 48373 | 2751 |
| SMALL_METRO | 28350 | 2161 |
| RURAL | 4819 | 580 |
| UNKNOWN | 2445 | 7 |

Tiers are derived from county population (10 largest = BIG_METRO, next 26 =
SMALL_METRO, remaining 31 = RURAL). The playbook cites a 30/26/10 split from Alek's
P2, but that list is not in the vault. County itself comes from FMCSA's FIPS code,
DBPR's own county numbering, FDEP's plain county name, or a city→county crosswalk
built from FMCSA, in that order.

## Contactability

| Tier | Eligible | FMCSA phone | Email | Website | 2026 annual report |
| --- | ---: | ---: | ---: | ---: | ---: |
| anchor_only | 77100 | 22481 | 21038 | 0 | 69979 |
| intersection | 5499 | 3306 | 3192 | 259 | 5318 |
| ucc_only | 1388 | 0 | 0 | 31 | 1284 |

Website coverage is the standing gap and the reason C2 runs Places and Exa. The
2026-annual-report column is the strongest quality signal in the batch: it means the
company itself confirmed its officer list with the State of Florida this year, which
directly answers the "person left years ago" failure mode from David's April list.
