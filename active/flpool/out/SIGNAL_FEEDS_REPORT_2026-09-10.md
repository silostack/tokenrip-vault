# Signal-feed discovery report (Strategy 2)

2026-09-10. Internal. Runbook: `../runbook_signal_feeds.md`. Companion to Strategy 1 (`SIGNAL_SEARCH_REPORT_2026-09-10.md`). Experiment E9 in `gameplan.md` §7.
Raw pulls: `../data/work/feeds/raw/<feed>/<state>/`. Extracted + joined CSVs: `../data/work/feeds/`. Join code: `../scripts/feeds_join.py`. Calibration: `../scripts/feeds_calibration.py`.

## Bottom line

**Signal feeds are a strong timing overlay on the existing FL pool, not a discovery engine for it. Feed-first should not replace pool-first for yellow iron.** Four feeds were fully pulled, joined and scored (FL: county procurement, DOT lettings, septic permits; OH: state grant/loans). Every one of them joins to our registries and dates cleanly — the mechanics work. But two independent gates collapse their discovery value:

1. **The pool already holds them.** Of resolved companies, 74/87 (procurement), 119/127 (DOT) and 16/16 (septic) are already in `FL_POOL_v1`. The FL pool — built from the same Sunbiz/FMCSA/DBPR/FDEP registries these feeds name — is effectively the universe of FL operators in these lanes. Feeds re-surface it with a fresh activity date; they rarely add a new company.
2. **The EF-borrowing gate kills the rest.** David requires prior equipment-finance borrowing. Of resolved companies, only 2/87 (procurement), 18/127 (DOT) and 0/16 (septic) have a non-captive, non-bank EF lien in our UCC corpus. Feed-discovered names overwhelmingly have no EF lien we can see.

What feeds *do* deliver, and nothing else we have does, is **a dated event tied to a specific company** — a bid, a permit, a grant, this month. That is the intent layer §6.3 calls the missing half. The recommendation (below) is therefore to run the top feed as a **timing signal joined onto the pool**, not as a new sourcing arm — with one real caveat that could flip this, stated in §3.

## 1. Feed scorecard

One month per feed (or ≤200 records). "In-box (spec)" is the runbook §6 definition (fleet 2–7 **or** Sunbiz-active TIB≥2, no captive/bank lien). "In-box (fleet)" is the honest subset with an FMCSA-verified fleet of 2–7 and a clean lien — see §1 note. Sorted by `new-to-us × UCC-positive`.

| Feed | State | Pulled | Joinable | Resolved | Dated | In-box (spec) | In-box (fleet) | UCC-positive | Already in pool | **New to us** | Platform reach |
|---|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|---|
| **F1** county procurement | FL | 116 | 103 (88%) | 87 (75%) | 100% | 53 | **17** | 2 | 74 | **11** | DemandStar ~1,300 / Bonfire ~650 / OpenGov ~1,600 agencies; FL a home market |
| **F2** DOT lettings | FL | 137 | 135 (98%) | 127 (92%) | 100% | 50 | **4** | 18 | 119 | **1** | 1 statewide system (7 districts + turnpike) |
| **F3** septic (OSTDS) permits | FL | 65 | 44 (67%) | 16 (24%) | 100% | 0 | 5 | 0 | 16 | **0** | 1 statewide Caspio app, all 67 FL counties |
| **F6** state grants/loans | OH | 32 | 29 (90%) | 7 (21%) | 100% | 3 | 3 | 0 | 0 | 3 | 1 statewide monthly PDF |

**Note on the two in-box numbers.** The spec number overstates badly for feeds whose companies resolve through Sunbiz but not FMCSA, because neither Sunbiz nor the feed carries fleet size — a $953-unit contractor (Preferred Materials) and a 202-unit one (C.W. Roberts) both pass "Sunbiz-active." The fleet-verified column is the honest read: DOT lettings contain only **4** genuinely small clean-lien bidders out of 127; the rest are large GCs (§9 predicted this). Report both and trust the smaller one.

**OH is UCC-blind by construction.** OH has no local Sunbiz/FMCSA/UCC at scale (Alek's file is the 50-row batch, not an index). OH rows resolve only against the live FMCSA Socrata census; UCC-positive and pool membership cannot be computed. F6 OH's numbers are partial and flagged as such.

## 2. Top three feeds — what the companies actually are (hand read)

### F1 — county procurement (Orange County bid openings) — rank #1
- **What they are:** small-to-mid construction and specialty-trade contractors bidding county work — Poli Construction, APD Construction, S.A. Casey, Foley5, Gibbs & Register, Southland, Cathcart. Most are *not* FMCSA motor carriers (fleet blank), so they resolve via Sunbiz; the 45 that are carriers skew to David's box (17 at fleet 2–7, clean lien). This is the only feed with double-digit discovery (11 new-to-us).
- **Example record:** `Southland Construction, Inc. | Orange County | bid | "Emergency – Wallington Dr" | 2026-08-xx | FMCSA 5 units`.
- **Platform & reach:** Orange County runs its own OrangeBids portal (one-off). The scalable layer is the aggregators — DemandStar (~1,300 agencies, FL is a home market), Bonfire (~650), OpenGov (~1,600). One scraper per aggregator ≈ hundreds of agencies.
- **Scraper cost:** Orange County = a stable ASP that returns daily bid-opening PDFs at a predictable URL (`results.asp?ID=&FileName=`); trivial. DemandStar/Bonfire plan-holder and bid-tab pages sit behind a free supplier login — a browser-driven scraper, moderate effort.

### F2 — FDOT lettings — rank #2
- **What they are:** the paving/civil GC tier — Ajax Paving (178 units), C.W. Roberts (202), Hubbard (159), Preferred Materials (953). Heavily captive-financed (51/127 captive liens). Only 4 small clean-lien bidders. This is the yellow-iron/paving lane, but at DOT scale it is the wrong end of David's box.
- **Example record:** `Leon America Construction | Hendry County | bid | contract T1948 | 2026-08-26 | $731,640 low bid | FMCSA 4 units, EF-house lien`.
- **Platform & reach:** one statewide system, `bidletting.fdot.gov`, HTML report per letting at a stable URL — the single most scrapable source found. One scraper = every FL DOT letting, ~monthly.
- **Scraper cost:** low. Static HTML, `curl` + regex, one URL per letting date.

### F3 — FL DOH OSTDS septic permits — highest reach, David's best lane
- **What they are:** septic installers/pumpers — Modern Septic & Plumbing, Newsome Well & Septic, Beltz Liquid Waste, Byrd's Plumbing & Septic, Howard & Sons Septic (Suwannee). Fleets 1–6 — squarely in David's A_VAC box. But 21/65 permit "agents" are bare persons (homeowners or sole-prop permit pullers), unjoinable; and all 16 resolved companies are already in the pool.
- **Notable:** F3 re-surfaced septic operators the pool itself had excluded as `no_sunbiz_match` (Newsome, Beltz) — the feed *corrects a pool coverage gap* even when it adds no net-new company. One false FMCSA match ("Liberty Septic" → a 76-unit carrier) is a normalizer collision to watch.
- **Platform & reach:** the winner on reach — a **single statewide Caspio datapage** exposing "permits issued in the last 30 days" for **all 67 FL counties** behind one county selector. One scraper = every septic permit in Florida, monthly, with the contractor named and dated.
- **Scraper cost:** moderate. It is a Caspio POST datapage (no clean REST endpoint); a browser-driven pull per county, or reverse-engineering the Caspio form state.

## 3. The caveat that could flip the recommendation

The UCC-positive gate — the reason feeds look like a poor discovery engine — rests on **our UCC corpus, not on reality.** `ucc_fl.csv` is 67,126 *EF-relevant debt events*, a curated slice, not all FL UCC filings. So "0–18 UCC-positive" means "has an EF lien **in our set**," not "has never financed equipment." Two readings follow, and they are opposite:

- **Reading A (feeds are an overlay):** our EF-UCC set is a fair proxy for EF-borrowing, the feed names are genuinely EF-inactive, and feeds add timing to a pool we already hold. → run feeds as a timing join.
- **Reading B (feeds are a discovery engine):** our UCC set is too thin, real borrowers are being gated out invisibly, and feeds are finding fundable companies we simply can't see the liens for. → expand UCC coverage first, then feeds discover.

**Cheapest disconfirming test (imminent, low-cost):** when David's case-study 50 arrives, run `feeds_calibration.py` — those are known repeat EF borrowers (8+ deals). If they resolve to our `ucc_fl` at a high rate, Reading A holds and our corpus is trustworthy. If many of David's own funded borrowers are *absent* from `ucc_fl`, Reading B holds and the gate is undercounting. This single check decides whether feed-first is a timing tool or a discovery tool. Until then the recommendation assumes Reading A but is explicitly contingent on it.

## 4. Calibration (§7)

- **FL v2 verdicts (50):** 0 of 50 appear in any pulled feed. Expected — one-month windows in Alachua/Suwannee/Orange, versus the v2 batch's counties. Recorded, no signal either way (§7 predicted near-zero).
- **David's case-study 50:** file not present (`data/raw/pcf_case_study_50.csv`). The winners-vs-dead test is **not yet possible.** `scripts/feeds_calibration.py` is written and will, on arrival: normalize the 50, report which appear in each pulled feed with dates, and for database feeds (FDOT letting, FL DOH OSTDS) query the live source across *all* dates to flag any appearance *before* the deal date. This is both the §7 calibration and the Reading-A/B test in §3.

## 5. Feeds dropped or deferred, and why

| Feed | State | Disposition | Why |
|---|---|---|---|
| F1 procurement | OH | viability-only | Exists (BidNet Direct Ohio has a public participating-buyers list; ODOT-adjacent agencies on Bonfire/OpenGov). Not pulled: OH lacks local Sunbiz/FMCSA/UCC, so joins would be FMCSA-Socrata-only, same partial picture as F6 OH. |
| F2 DOT | OH | viability-only | ODOT lettings/bid tabs exist (`transportation.ohio.gov/.../bid-tabs`, Bid Express `ui.bidx.com/ODOT`), but detailed bidder tabs sit behind a Bid Express login; same OH join limitation. |
| F3 septic | OH | viability-only | Ohio has no statewide OSTDS portal; septage-hauler rosters are per-county health-department PDFs (Portage County is the known example from Strategy 1). Roster, not a dated timing feed. |
| F6 grants | FL | not run this session | Florida Commerce incentive reports exist and are the FL mirror of JobsOhio; deferred for depth on the three FL feeds above. |
| F4 tow rotations | both | not run | Per §9/§10 a roster (who owns a heavy wrecker), not a timing feed; per-county PDFs. Low priority after septic showed the roster pattern rediscovers the pool. |
| F5 building/ROW permits | both | not run | Accela/Tyler/CityView portals; expected to behave like F1/F3 (dated, joinable, but rediscovers the pool). Worth one pull next run to confirm on the concrete/dirt lane. |
| F7 job posts | both | not run | Indeed/state job banks; growth signal, not a company-discovery feed; better as an entity-first annotation (Strategy 1). |
| F8 other rosters | both | not run | Licensed septage-hauler / waste-hauler rosters already partly held (FDEP roster feeds the pool). |

## 6. Feed types to add next run

- **F5 building/ROW permits (Accela/Tyler EnerGov)** — the one untested platform family; concrete/dirt lane, daily freshness, and Accela/Tyler host many FL counties (platform-reach multiplier like F3).
- **UCC-3 termination feed** (§11) — the cleanest "just paid off" timing signal; if FL exposes dated terminations, a daily termination list joined to the pool is a near-real-time intent list and sidesteps the discovery/gate problem entirely (it fires *on* the pool).
- **Florida Commerce incentives (F6 FL)** — to confirm the JobsOhio pattern (capex on manufacturers, not David's box) holds in FL before writing off grant feeds.

## 7. Recommendation (10 lines)

1. **Build the FDOT letting scraper first** (F2 FL): lowest effort, one URL per letting, one system = all FL DOT. Not for discovery — for a dated "bidding now" flag on pool rows.
2. **Build the FL DOH OSTDS scraper second** (F3 FL): highest reach per scraper (one Caspio app = 67 counties), David's best lane, and it corrects the pool's `no_sunbiz_match` gaps. Moderate effort (Caspio).
3. **Treat both as a timing JOIN onto `FL_POOL_v1`, not a new sourcing arm.** Emit: pool row + most-recent feed event + date, as its own rank column (per §6.4, no composite).
4. **Do not build a procurement scraper yet** (F1): best discovery (11 new, 17 fleet-in-box) but gated to 2 UCC-positive and dependent on aggregator logins; revisit after the §3 test.
5. **Feed-first should NOT replace pool-first for yellow iron.** DOT lettings are 96% large GCs; procurement rediscovers the pool. The yellow-iron anchor gap (§6.1) is better closed by UCC collateral parsing (E6) than by feeds.
6. **Run `feeds_calibration.py` the day the case-study 50 lands** — it is the single test that decides timing-tool vs discovery-tool (§3), and re-runs the §7 winners-vs-dead check.
7. **Log the E9 decision** in `gameplan.md` §6.3b and `TODO.md`: FDOT + OSTDS scrapers as timing signals; procurement parked pending the UCC-coverage test.
