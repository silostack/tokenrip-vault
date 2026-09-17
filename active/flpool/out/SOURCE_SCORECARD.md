# Source scorecard — Florida pool, batch 1

Generated 2026-09-03 from `flpool`. Every count is Florida only.

## What each source brings

| Source | FL rows | In a lane | Phone | Email | Owner name | Size field |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| FMCSA carriers (active) | 156367 | 59945 | 155587 | 121112 | 141095 | 156367 |
| FDEP septic businesses | 609 | 609 | 0 | 602 | 0 | 0 |
| DBPR construction (active) | 103077 | 89891 | 0 | 0 | 103077 | 0 |
| UCC filings (FL) | 67126 | 2886 | 0 | 0 | 0 | 609 |
| Sunbiz corporations (active) | 3855431 | 0 | 0 | 0 | 3823187 | 0 |

FMCSA is the only source carrying phone, email and an officer name together. Sunbiz
is the only source that confirms the company is still alive and who currently runs it.
UCC is the only source with prior equipment-finance history. None of them is sufficient
alone, which is why the batch is built on their intersection.

## How well the sources join

| Source | Rows | Sunbiz match | Match pct | of which active | UCC match | UCC pct | Ambiguous (>1 Sunbiz) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| dbpr | 74577 | 42328 | 56.8% | 40177 | 2902 | 3.9% | 1878 |
| fmcsa | 59531 | 32339 | 54.3% | 20531 | 3578 | 6.0% | 1247 |
| fdep | 608 | 420 | 69.1% | 413 | 152 | 25.0% | 23 |

The join key is `normalize_name(name) || '|' || normalize_city(city)` from
`scripts/normalize.py`, which passes 15 unit tests including the five specified in the
playbook. A row counted as ambiguous had more than one Sunbiz entity at the same
name and city; the active, most-recently-filed one was taken and the count retained.

## Evidence behind the lane tag

| Lane evidence | Rows |
| --- | ---: |
| cargo_flag | 2803 |
| license_class | 2117 |
| name_regex | 205 |
| registry | 102 |

`cargo_flag` is FMCSA's own self-declared cargo classification, `license_class` is a
DBPR licence type, `registry` is FDEP septic authorization. Only `name_regex` rows rest
on the company name alone, which the playbook rightly treats as not evidence. Those
rows still require a web-verified equipment quote at C2 before they can ship.
