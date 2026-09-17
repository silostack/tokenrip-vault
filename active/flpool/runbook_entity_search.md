# Runbook: entity-first signal search

Self-contained instructions for a new session. Read `gameplan.md` §6.3 for where this fits; everything needed to run is here.

## 1. Why

David's bar is applications per contact, and applications come from intent, not from reach. Contact vendors have intent without identity; we have identity without intent. The intent for a 4-truck contractor does not live in job-change feeds or web visits. It lives in the long tail of local public sources: a county engineer's bidders list, a health-department septic permit, a DOT letting, a CDL job post, a local-news line about a new yard. Alek's Ohio run found one by hand (a Union County logjam-removal bidders list). There are thousands of such sources and no index.

Crawling them source-by-source is a haystack. We already hold the needles: verified company names with city, county and state. So the search runs the other way: **for each company we care about, search the web for it and classify what comes back.** Two things fall out:

1. **Which signal families actually precede deals.** We compare what turns up for companies that converted (David's verdicts; later his 50 repeat customers) against companies that did not, and against random pool rows. Families that show up disproportionately for winners become rank features. Families that don't are dropped before anyone builds a scraper for them.
2. **Which source domains recur.** If 30 different county-engineer sites each produce one hit, those 30 domains are the scraper backlog for that state, ranked by yield. Everything else stays lookup-only.

This is calibration, not production. The output is a report and a shortlist, not a feature in the pipeline.

## 2. What we want to learn (write the answers into the report)

- For each signal family: how many companies in each cohort have at least one hit, and the hit date relative to the verdict/deal date.
- Which families separate positives from dead and from control. With 25-row cohorts, anything under a 2× difference is noise; say so.
- The top 30 source domains by hit count, with the family each serves and the state.
- The false-positive rate of name matching, by inspection of 30 random hits (see §6). If it is over 20%, tighten the query before trusting any count.
- Per-company timelines for the positives (JC Concrete Pumping, Calohn Waste, Ensley, Mr. Septic, All Pro, Earthgreen, Henderson's, Affordable Towing) as worked examples of what a signal looks like when it is real.

## 3. Inputs

All paths relative to `active/flpool/`.

| Cohort | File | Rows | Use |
|---|---|---|---|
| FL v2 with verdicts | `out/FL_PHONE_TEST_50_v2_2026-09-07.csv` joined to `out/verdicts/david_v2_2026-09-09.csv` on `company` | 50 | positives (`outcome` in followup, maybe_later) vs dead vs no_decision |
| Ohio 50 | `out/OH_PHONE_TEST_50_LIEN_2026-09-09.csv` | 50 | second state; verdicts pending; use `fit_flag` to split in-box vs out |
| Control | 50 random rows from `out/FL_POOL_v4_SIGNALS.csv` (640 rows, all eligible, none dialled) | 50 | baseline hit rates |
| Case study | David's 50 repeat customers, when received (not yet in repo; save as `data/raw/pcf_case_study_50.csv`) | 50 | the real calibration set; re-run the whole thing when it arrives |

Columns you need from each: `company`, `owner_name`, `city`, `county` (FL only), `state`, `website`, `usdot` (OH). The FL files carry `county`; OH does not (add it from `data/work/ohio_census.json` field `phy_county` if present, else skip).

The search key is in `.env` as `EXA_API_KEY`. Do not commit `.env`.

## 4. Tooling

Exa (`exa.ai`) is the search API. Install in the folder's venv:

```
.venv/bin/pip install exa-py
```

Two call shapes matter:

```python
from exa_py import Exa
exa = Exa(api_key=EXA_API_KEY)
r = exa.search_and_contents(
    query, type="keyword",            # keyword = exact-match behaviour; use "neural" only for the news query
    num_results=10,
    text={"max_characters": 1500},    # enough to classify; keeps cost down
    start_published_date="2023-01-01" # ignore ancient pages
)
for hit in r.results:
    hit.url, hit.title, hit.published_date, hit.text
```

Cost is roughly $0.005–0.01 per search including contents. Budget for the three cohorts at three queries each: 150 companies × 3 = 450 searches, under $5. The full FL eligible pool later would be ~$1K; do not run that from this runbook.

Rate: be polite, 5 concurrent at most, retry on 429 with backoff, record HTTP status on every call. Three-state rule from the rest of the pipeline applies: "no hits" and "API did not answer" are different values.

## 5. Queries

Three per company. Names are the join key and the failure mode, so build them carefully.

**Name normalisation.** Strip the suffix (LLC, INC, CORP, L.L.C., LTD, CO) and trailing punctuation; keep the rest as the exact phrase. `scripts/c5b_fix.py` has `SUFFIXES` and name helpers; `scripts/normalize.py` has `normalize_name`. Reuse them rather than writing a new one.

**Generic-name guard.** If the stripped name has fewer than two tokens of 4+ letters that are not in a stoplist (SERVICES, TRUCKING, CONSTRUCTION, TRANSPORT, ENTERPRISES, and the `GENERIC` set in `scripts/c5d_cnam.py`), or is a bare person name (`SCOTT YOUNG`, `WILLIAM S CURTIS`, `ASAP, INC.`), append the city to the phrase and require it in the page text at classification time. Log these as `weak_name = true`.

| # | Query | Type | What it finds |
|---|---|---|---|
| Q1 | `"<name>" <city> <state>` | keyword | anything about the company: site, directories, news, permits, bids |
| Q2 | `"<name>" (bid OR bidders OR "plan holders" OR awarded OR contract OR permit OR prequalified) <county> county <state>` | keyword | procurement and permits |
| Q3 | `"<name>" (hiring OR "now hiring" OR "job" OR "CDL" OR "operator") <city>` | keyword | hiring |

Optional Q4 (`neural`, `num_results=5`): `<name> <city> <state> equipment contractor news` for local news phrasing that keyword misses. Run Q4 only on the positives cohort the first time; add to all if it earns hits.

Exclude the company's own website domain and the big directories from counts (they are identity, not intent): the `website` column's domain, plus bbb.org, yelp.com, mapquest.com, manta.com, buzzfile.com, dnb.com, zoominfo.com, facebook.com, linkedin.com, opencorporates.com, bizapedia.com, safer.fmcsa.dot.gov, sunbiz.org, floridacompanies.com and similar. Keep them in the raw file, flag `directory = true`, drop from family counts.

## 6. Classification

One row per hit. Rules first, then an LLM pass only for hits the rules leave as `unknown`.

**Signal families and rule hints**

| family | rule hint (URL, title, or text) | date to extract |
|---|---|---|
| `procurement` | bid, bidders, plan holders, letting, award, contract, RFP, prequalif, "county engineer", "public works", `.gov` + bid | bid/award date |
| `permit` | permit, ROW, "right of way", septic, "onsite sewage", well, building department | issue date |
| `hiring` | hiring, job, CDL, operator, "apply", indeed.com, craigslist.org, ziprecruiter | post date |
| `news` | news domain or "announced", "expands", "new location", "awarded", local outlet | article date |
| `litigation_lien` | lawsuit, lien, judgment, foreclosure, courtlistener, unicourt | filing date (negative signal; keep) |
| `equipment_sale` | "for sale", auction, ritchie, ironplanet, machinerytrader, equipmenttrader | listing date |
| `registration` | new DOT, licence, "certificate of", state board | date |
| `directory` | the exclusion list above | n/a |
| `unknown` | none matched | |

**Name-match verification.** For every non-directory hit, require the stripped name (case-insensitive) in `title` or `text`, and, for `weak_name` rows, the city as well. Failing that, mark `name_match = false` and exclude from counts. This is the check that decides whether the whole exercise is credible; do it before anything else.

**LLM pass.** For `unknown` hits with `name_match = true`, send title + text + the family list and ask for one family and a one-line reason. Use the Anthropic SDK with the current Claude model; the `claude-api` skill in this repo has the setup. Keep the model's answer in a separate column (`family_llm`) so rule and model can be compared later.

**Manual read.** Pull 30 random hits with `name_match = true` and read them. Record how many are actually about the company. That number goes at the top of the report.

## 7. Storage

- `data/work/signals/hits_<cohort>_<date>.csv`: company, cohort, query_id, url, domain, title, published_date, text_excerpt (500 chars), family, family_llm, signal_date, name_match, weak_name, directory, http_status, retrieved_at.
- `data/work/signals/raw/<cohort>/<company_slug>_Q<n>.json`: full API responses, so nothing is re-bought.
- Never write hits into the delivered sheets or the pool tables from this runbook.

## 8. Report

`out/SIGNAL_SEARCH_REPORT_<date>.md`, in this order:

1. Name-match precision from the 30-hit manual read, and the count of `weak_name` companies.
2. Table: family × cohort (positive / dead / no_decision / control / OH in-box / OH out-of-box), value = number of companies with ≥1 verified hit, and the total hits. Note the cohort sizes on every row.
3. Which families separate positives from the rest, with the honest caveat on size.
4. Top 30 source domains: domain, state, family, hit count, number of distinct companies. Mark the ones that look scrapable (listing pages, dated, machine-readable) vs one-off PDFs.
5. Timelines for the eight FL positives: every verified hit with date and family, in date order, next to the verdict comment from `out/verdicts/david_v2_2026-09-09.csv`.
6. What to do next: which families to build as features, which domains to scrape first, which queries to change. Keep it to ten lines.

## 9. Things that will go wrong

- Common names swamp Q1 with unrelated hits. The name-match check plus city handles most; some rows will simply be unsearchable and should be reported as such rather than forced.
- Exa's `published_date` is often missing on government PDFs. Fall back to a date found in the text (regex for month-year or mm/dd/yyyy near the name), else leave blank and count the hit as undated.
- PDFs: `text` may be empty or garbled. Log and move on; the domain still counts toward the scraper backlog.
- Do not let the report claim a family "works" on 25 rows. The purpose is to rank families and domains for the next step, which is running the same search on David's 50 repeat customers.

## 10. After this run

When `data/raw/pcf_case_study_50.csv` arrives, re-run §4–§8 with that cohort added, and read the family × cohort table again. That is the run that decides which signal families go into the pipeline. Record the decision in `gameplan.md` §6.3 and `TODO.md`.
