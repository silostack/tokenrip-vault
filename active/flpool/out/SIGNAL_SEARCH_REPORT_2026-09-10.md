# Entity-first signal search — calibration report (2026-09-10)

Internal. Runbook: `runbook_entity_search.md`. Working files: `data/work/signals/`. This is calibration on the three cohorts available now; the run that decides features is David's case-study 50 (§10), not yet received.

## 0. Bottom line

- Entity-first search surfaces real procurement/permit/hiring/news intent for **construction, excavation and manufacturing** companies, and almost none for **vac / septic / tow** operators. The signal lives in the OH (lender-first, varied) cohort; FL vac/septic is a web desert beyond own-site + directories.

- Verified non-directory hits: FL v2 8, control 14, OH 32. Real intent hits (valid company, intent family): **21** total, 16 of them OH.

- Implication: the entity-search intent layer is worth building, but **for the yellow-iron / construction / industrial half of the box**, sourced lender-first. For small service-truck operators, intent is not on the open web; rely on UCC-native signals (lien age/lapse, competitor filings) we already hold.

## 1. Name-match precision and weak names

- Manual read of all 54 verified non-directory hits (the runbook asks for 30; the full set is smaller so all were read). **44 of 54 were actually about the company = 81% precision** (10 false positives).

- Every false positive was a **generic or bare-person name**: CERTIFIED SERVICE CENTER (5, matched car-dealer service pages), AQUA SCIENCE (2, a product brand), SHAWN SEXTON (election results), J&M DOZER (a hospital page), CREEKSIDE GARDENS (an Easter-egg-hunt notice). Fix before trusting counts at scale: city-gate any 2-token generic name and every bare person name, not just <2-token names.

  - weak-name companies, fl_v2: 13
  - weak-name companies, control: 15
  - weak-name companies, oh: 26

## 2. Family × cohort (companies with ≥1 real intent hit; total hits)

Cohort sizes: FL positive 9, FL dead 19, FL no_decision 22, control 50, OH 50. **At these sizes nothing separates statistically** (runbook: under 2× is noise); read as direction only.

| family | FL positive | FL dead | FL no_decision | control | OH |
|---|---|---|---|---|---|
| procurement | · | · | · | · | 5 (9) |
| permit | · | · | · | · | · |
| hiring | · | · | · | · | 1 (2) |
| news | · | · | · | 3 (4) | 4 (4) |
| registration | · | · | 1 (1) | · | 1 (1) |
| equipment_sale | · | · | · | · | · |
| litigation_lien | · | · | · | · | · |

Value = companies with ≥1 verified real hit (total hits). '·' = none.

## 3. What separates (with the honest caveat)

- **Procurement is the one family that clearly concentrates** — and it concentrates by *company type*, not by David's verdict. OH construction/excavation/manufacturing rows (Faxon Machining, Great Lakes Crushing, Raze International, Woodford Excavating, Crown Excavating, Border Patrol) carry contract/bid news; FL positives (all vac/tow/septic) carry none.

- The FL positive cohort produced **zero** real intent hits. This is not evidence the method fails; it is evidence the cohort (4 vac, 3 tow/waste, 1 concrete, 1 farm) has no open-web intent to find. The comparison that matters — winners vs dead — is impossible here because neither FL arm has intent hits.

- Directories dominate everything: ~55-60% of all hits are the company's own site or an aggregator (procore, thebluebook, carriersource, chambers, yelp/mapquest). These are correctly excluded and are the reason raw counts mislead.

## 4. Top source domains (real intent hits only)

| domain | states | families | hits | companies | scrapable? |
|---|---|---|---|---|---|
| alligator.org | FL | news | 2 | 1 | one-off news |
| tribtoday.com | OH | procurement | 2 | 1 | one-off news |
| freeportflorida.gov | FL | registration | 1 | 1 | PDF/listing |
| portaserve.com | FL | news | 1 | 1 | directory/other |
| acppubs.com | FL | news | 1 | 1 | one-off news |
| news-herald.com | OH | procurement | 1 | 1 | one-off news |
| cleveland.com | OH | procurement | 1 | 1 | one-off news |
| theintelligencer.net | OH | procurement | 1 | 1 | one-off news |
| cobotspotlight.com | OH | news | 1 | 1 | one-off news |
| indeed.com | OH | hiring | 1 | 1 | directory/other |
| ar.gov | OH | procurement | 1 | 1 | PDF/listing |
| bizjournals.com | OH | procurement | 1 | 1 | one-off news |
| local12.com | OH | procurement | 1 | 1 | one-off news |
| ziprecruiter.com | OH | hiring | 1 | 1 | directory/other |
| cleveland19.com | OH | news | 1 | 1 | one-off news |
| heraldstaronline.com | OH | procurement | 1 | 1 | one-off news |
| portagecounty-oh.gov | OH | registration | 1 | 1 | PDF/listing |
| jobsohio.com | OH | news | 1 | 1 | PDF/listing |
| yahoo.com | OH | news | 1 | 1 | one-off news |

No domain recurs across many different companies yet — the local news outlets and county/state portals each fired once or twice. That is expected at 150 companies; the scraper backlog only takes shape at pool scale. The **structurally scrapable** hits are the government listings: a county septage-hauler roster (portagecounty-oh.gov), the JobsOhio executed grants/loans report (capex signal), and defense contract feeds (ar.gov). Local newspapers are per-article, not listing pages.

## 5. Timelines for the FL positives

None of the eight/nine FL positives produced a verified non-directory intent hit. Their entire web footprint is: own website, SEO directories (septicandwell, findmyseptic, yelp, mapquest), and the statewide FDEP septic maintenance-entity roster PDFs (floridadep.gov) — which we already hold as structured data and which is registration, not timing. There is no open-web timeline to draw for this cohort. (One acquisition signal appears in the FL *control* set — Dampier Septic Tank absorbed by Porta Serve, portaserve.com, 2023 — a genuine event, but a dead outcome for us: the company was bought, not buying.)

## 6. What to do next (≤10 lines)

1. **Source the intent layer lender-first / construction-first.** OH (varied, construction-heavy) produced 4× the intent of FL vac/septic. The entity search pays off on yellow iron and industrial, not service trucks.
2. **Add procurement as a rank feature for construction/excavation lanes only.** It is the one family that fired; gate it to A_DIRT / yellow-iron / manufacturing rows.
3. **Scrape the government listings first:** county septage/permit rosters and state grant/loan reports (JobsOhio-style) are dated, machine-readable, and name the company. Local newspapers are not scrapable as a set — leave them lookup-only.
4. **Tighten the name query before any pool-scale run:** city-gate all 2-token generic names and bare person names. ~19% false positives now, all from that class.
5. **Do not run the full FL pool on this method.** For FL vac/septic the yield is ~0; UCC-native signals (lien age/lapse, competitor filings) are the intent layer for that segment.
6. **Re-run this exact pipeline on David's case-study 50 when it arrives** — that cohort is actual deals and will include construction, so it can finally test winners-vs-dead, which these cohorts cannot.
