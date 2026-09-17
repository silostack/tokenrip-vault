---
title: Florida batch 1 — pipeline run retrospective
run_date: 2026-09-03
delivery_date: 2026-09-04
audience: pipeline architect (internal)
status: INTERNAL — not part of the Providence delivery package
companion: out/README.md (external, ships with the batch) · artifact 52caab9e (narrative version)
---

# Florida batch 1 — pipeline run retrospective

**So what.** The pipeline shipped 50 verified rows against a 50-row target, and the run proved the architecture is sound in the half nobody worried about and thin in the half everyone assumed was solved. Discovery over-delivered by three orders of magnitude: 83,987 eligible companies for a 50-row ask. Verification was the binding constraint at every stage, and the two things that actually gated the batch — a 45% Sunbiz join miss and a Twilio trial quota — are both cheap to fix. The single highest-leverage change for batch 2 is not a new source. It is raising the entity-resolution recall on sources we already hold.

Three numbers frame everything below:

| | Count | Read |
|---|---:|---|
| Companies discovered and lane-tagged | **134,719** | Discovery is free and unlimited |
| Survived corporate verification and exclusions | **83,987** | 38% loss, almost all of it resolution failure, not business-rule rejection |
| Survived contact verification and shipped | **50 + 25 bench + 397 continuation** | 0.56% of eligible reached delivery; the throttle is verification, not supply |

---

## 1. What was asked for, and what shipped

| Target | Spec | Delivered | Status |
|---|---|---|---|
| Row count | 50 | 50 | met |
| Geography | Florida only | Florida only | met |
| Arms | 30 / 10 / 10 intersection / anchor_only / ucc_only | 30 / 10 / 10 | met |
| Lane mix | ≈30 A / 10 B / 5 C / 5 other | 30 A (18 A_DIRT + 12 A_VAC) / 11 B / 8 C / 1 E | met |
| Owner named on every row | required | 50/50, 43 from Sunbiz, 7 from licence qualifier | met |
| Phone on every row | required | 50/50, all carrier-checked active | met |
| Equipment evidence with a public URL | required | 50/50 | met |
| Dedupe against Providence and Quintel touches | mandatory | 28 rows removed at C1 | met |
| No demographic fields | hard line | none present anywhere in the pipeline | met |
| No guessed emails | hard line | 38 emails, all from a filing or the company's own site | met |
| Cost ceiling | Places free tier, Exa <$5, phone <$5 | Places $0, Exa $0 (unused), Twilio $1.59 | met |
| Bench | 15 | 25 | exceeded |
| Continuation pool | not specified | 397 | bonus |

Wall clock for the main chain was roughly **two hours** (15:20 to 17:16), of which about 25 minutes was the Sunbiz parse and about 35 minutes was Postgres load and indexing. Repair passes ran afterward and are covered in §6.

---

## 2. The architecture as it actually ran

### 2.1 Four source roles, not four sources

The design that held up best was assigning each source a **role**, not a rank. No source is sufficient; each answers a question the others cannot.

| Role | Source | The one question it answers | Why nothing else can answer it |
|---|---|---|---|
| **Anchor** | FMCSA carrier census · DBPR construction licences · FDEP septic authorizations | Does this company operate equipment? | These are self-declarations to a regulator, with legal consequence for lying. Name regexes and marketing copy are not evidence. |
| **Overlay** | Florida UCC corpus (prod `debt_event`) | Has it financed equipment before, with whom, and when does that term end? | Only the lien index carries prior finance behaviour and a modellable renewal date. |
| **Verify** | Sunbiz corporate file + `corevt` events | Is it still alive, and who runs it *today*? | Only the state registry confirms liveness and current officers, with a dated filing. |
| **Enrich** | Google Places (New) Text Search | Website, second phone, operating status | The only web-side source in the run; deliberately last and deliberately overridable. |

This decomposition is the most portable thing the run produced. It survives a change of state, a change of vertical, and a change of lender box. §11 covers that.

### 2.2 One join rule, applied everywhere

Everything hinges on a single function:

```
join_key = normalize_name(company) || '|' || normalize_city(city)
```

`normalize_name` uppercases, strips surrounding quotes, expands `&` to `AND`, **deletes apostrophes**, converts remaining punctuation to spaces, drops DBA fragments, drops a leading `THE`, then iteratively strips legal suffixes (INCORPORATED, CORPORATION, COMPANY, PLLC, PLC, LLP, LLC, CORP, INC, LTD, LP, PA, CO, LC and spaced variants).

The apostrophe rule is load-bearing and non-obvious. Apostrophes must be **deleted** while other punctuation becomes a **space**, or you get:

| Raw | Delete apostrophes (correct) | Space apostrophes (wrong) |
|---|---|---|
| `"SHELLY'S SEPTIC TANK, INC. "` | `SHELLYS SEPTIC TANK` | `SHELLY S SEPTIC TANK` |
| `"4 C ' S TRUCKING & EXCAVATION INC"` | `4 C S TRUCKING AND EXCAVATION` | `4 C S TRUCKING AND EXCAVATION` |

Both must land correctly with one rule. 15 unit tests, all passing. **Any change to this function invalidates every downstream table.** Treat it as a versioned schema object, not a utility.

### 2.3 Stage map

| Stage | What it does | In | Out | Tools |
|---|---|---|---|---|
| **A** | Parse and pull raw sources | 10 Sunbiz cordata files, corevt, FMCSA API, UCC export, FDEP, DBPR | 6 CSVs in `data/work/` | Python multiprocessing (Pool 10), Socrata API, openpyxl, grep |
| **B** | Load and index | 6 CSVs | 6 `raw.*` tables in Postgres `flpool` | `psql \copy` + btree indexes on `name_norm`, `city_norm` |
| **C0** | Lane tagging, restriction rules, candidate assembly | raw tables | `work.candidates_all` (134,719) | Postgres SQL functions, POSIX regex |
| **C1** | Corporate verification, owner resolution, exclusions | candidates + Sunbiz + exclusions | `out/FL_POOL_v1.csv` (134,719 rows, 83,987 eligible) | SQL |
| **C2** | Quota selection + equipment evidence + web enrichment | eligible pool | `out/FL_POOL_v2_EQUIPMENT.csv` (640) | Python, Google Places API |
| **C3** | Phone resolution and carrier verification | 640 | `out/FL_POOL_v3_CONTACT.csv` | Twilio Lookup v2 |
| **C4** | Timing signals, unweighted | 640 | `SIGNALS.csv` (3,200), `v4` | Python |
| **C5** | Arm-quota selection and packaging | 640 | the 50, bench 25, continuation 397 | Python |

Note the shape: **C0–C1 process 134,719 rows; C2 onward process 640.** The quota gate between C1 and C2 is where the pipeline changes character from bulk SQL to per-row API work at roughly 200× the cost per row. That boundary is the main architectural lever available for batch 2 (§10).

---

## 3. Stage-by-stage, with the decisions that were made inside each

### Stage A — extraction

**Sunbiz.** Ten fixed-width `cordata` files, 1,440 characters per record plus CR. Parsed in parallel across 10 processes. 12,808,196 records read, 11,802,288 Florida, 3,855,431 active, 6,120,543 officer rows, **0 malformed**, ~4 minutes.

The officer sub-field layout is the fiddly part: when officer type is `P`, the name field splits `LAST(20) FIRST(14) MIDDLE(8)` at fixed offsets inside the field, not by delimiter. Field offsets were verified against real records before the full run rather than trusted from the layout document.

**corevt.** Contains name-change events. The former-name offset was initially **guessed at 207 and was wrong**; it is 211. Found by running a regex position scan across sample records rather than by reading the spec harder. 342,592 alias rows extracted. *Lesson: measure offsets against data, never infer them; a fixed-width guess fails silently and produces plausible garbage.*

**FMCSA.** Socrata resource `az4n-8mr2`, paged at `$limit=50000` with `$where=phy_state='FL'`. 287,917 rows. **The API returns 145 fields**, far more than the documented download, including phone, email, officer name, county, power units, and nine self-declared cargo flags. This single discovery removed a planned manual download step and supplied 98% phone coverage on the anchor.

**DBPR.** Two files with the same name pattern. `_1` is authoritative: 256,903 rows, no header, expirations running to 2028. `_2` is truncated at exactly 65,000 rows (a spreadsheet export limit) at surname "OVERBEY", with stale 2020 dates — but it carries a header row. **`_2` was used only as a decoder ring for `_1`'s columns.** Both latin-1. This is exactly the trap that produces a silently half-sized dataset.

**Exclusions.** Providence's April vendor list was recovered from a Spark Mail attachment cache. 1,269 rows across 3 sheets, of which only 61 are Florida. David's verbatim failure comments were preserved into `vendor_baseline_david.csv` — "NIS", "Wrong area code", "Generic MB", "Bob retired years ago! Jeremey son took over". That file is the qualitative baseline our batch is measured against and should be kept.

### Stage C0 — lane tagging

The playbook's lane regexes were **substring matches and over-fired badly**:

| Token | Intended | Also matched |
|---|---|---|
| `VAC` | vacuum truck | VACATION |
| `TOW` | towing | TOWN, TOWER |
| `WELL` | water well | CALDWELL, WELLNESS |
| `SAND` | sand and gravel | SANDERS |
| `SPA` | (restriction) | SPACE |

Rewritten with POSIX word boundaries (`\m` `\M`) wherever the token is a common substring, and validated against 12 adversarial cases. **This is a class of bug worth a standing test file**, because the failure is silent and inflates the pool with confident-looking garbage.

Three rule tiers were introduced, and the middle one earned its place:

- `hard_restricted` — always excludes (solar, cannabis, medical, salon, church, municipal, realty, vending, crypto…)
- `soft_restricted` — excludes **only when no lane fires**. A dump operator called "X TRANSPORT" is in the box; a general-freight "X TRANSPORT" is not. Without this tier you either lose real operators or admit the whole freight industry. 84 rows were excluded here.
- `fmcsa_lane` — **cargo flags take precedence over the name.** Garbage/tow flags → C, construct/waterwell/oilfield → A_DIRT, drybulk/bldgmat/machlrg/logpole → B. A declaration to a regulator outranks a naming convention, always.

The evidence hierarchy this produced is visible in the numbers:

| Lane evidence | Rows | Strength |
|---|---:|---|
| cargo_flag | 2,803 | self-declared to FMCSA |
| license_class | 2,117 | state licence class |
| name_regex | 205 | **not evidence** — required a C2 web-verified quote to ship |
| registry | 102 | FDEP authorization |

### Stage C1 — verification and exclusion

Exclusions are evaluated in a fixed CASE order so every row gets exactly one reason and the funnel stays auditable. **No row was deleted** — all 134,719 remain in `FL_POOL_v1.csv` with an `exclusion_reason`.

| Reason | Rows | Comment |
|---|---:|---|
| `no_sunbiz_match` | **34,341** | The single largest loss in the entire pipeline. See §7.1. |
| `sunbiz_inactive` | 13,951 | Correct and cheap — dissolved companies removed before any spend |
| `has_finance_officer` | 1,435 | **Free CFO exclusion from state officer titles.** Expected to need website reads; did not. |
| `restricted_name` | 598 | |
| `no_owner_named` | 273 | |
| `restricted_soft_no_evidence` | 84 | the soft tier doing its job |
| `already_touched` | 28 | trust-critical; matched on name+city, domain and phone against prod delivery record incl. the 100 rows sent 2026-08-27, plus David's April list |
| `ucc_killed` | 22 | |

Owner resolution runs a priority ladder over Sunbiz officer titles: `OWNE`=1, President forms (P, PD, PST, PSD, PTD, PSTD, DP)=2, `MGRM`=3, member=4, `MGR`/`MANA`=5, `CEO`=6, `AUTH`/`AP`/`AR`=7. Composite title codes are the subtlety — seven distinct codes all encode President and all must map to the same rung.

A **name-only Sunbiz fallback** was added after the first pass, flagged with `sunbiz_match_method`. It recovered 24,702 eligible rows (485 in the intersection) that matched on name but not city — typically a carrier whose yard is in a different city from its corporate principal address. Kept and flagged rather than merged silently, so the verdicts can tell us whether the distinction predicts anything.

### Stage C2 — evidence and enrichment

640 rows selected by quota, ranked by: name_city match quality → county tier → PCF grade → fleet size in 2–15 → MCS-150 freshness → dueness.

Google Places (New) `places:searchText` with a field mask covering `displayName`, `nationalPhoneNumber`, `websiteUri`, `businessStatus`. **The field mask removes the need for a separate Place Details call** — one request instead of two, which is what kept the run inside the free tier. 640 calls, 331 initial hits, 309 rejected on name mismatch.

### Stage C3 — phone

Twilio Lookup v2 with `line_type_intelligence`. 552 distinct numbers attempted, 199 answered, 353 throttled (see §6.1). $1.59 spent.

Final phone logic prefers **a verified number over an unverified one, and FMCSA over Places within each state**, then records `phone_corroborated` when both sources agree on the same 10 digits (18 of 50).

### Stage C4 — signals

3,200 signal rows, five signal types, **deliberately not combined into a score.**

| Signal | True | False | Notes |
|---|---:|---:|---|
| `ucc_renewal_window` | 430 | 210 | lien filed 36–60 months ago |
| `fmcsa_fleet_size` | 376 | 264 | 2–15 power units |
| `fmcsa_new_dot_12mo` | 15 | 625 | |
| `ucc_termination_12mo` | 0 | 640 | **not available in the file** — needs a termination feed |
| `fmcsa_fleet_delta` | 0 | 640 | **needs a second snapshot** — start retaining monthly FMCSA pulls now |

Two of five signals are structurally unavailable rather than absent. Both become available with infrastructure we can start today: retain a dated FMCSA snapshot every month, and source a UCC termination feed. `fmcsa_fleet_delta` is likely the strongest signal in the set — a carrier that grew from 3 to 6 trucks in a year is buying — and it costs one cron job to unlock.

**Refusing to weight the signals was the right call and should hold.** There is no corpus to fit weights against. David's verdicts are that corpus. Shipping a composite score now would bake in guesses and then make them unfalsifiable, which is precisely the failure mode found in the vendor list.

---

## 4. Decisions, and the road not taken

The 22-fork table in the narrative artifact is the full list. These are the eight that most shaped the output.

| # | Decision taken | Alternative not taken | Why | What would flip it |
|---|---|---|---|---|
| 1 | Four source **roles** (anchor / overlay / verify / enrich) | One primary source with the rest as enrichment | No single source carries equipment + liveness + contact + finance history | Nothing. This one generalizes. |
| 2 | Cargo flags **outrank** name regex | Name-first with cargo as a tiebreak | A regulator declaration beats a naming convention | Nothing. |
| 3 | Three arms shipped as an **experiment** | Ship the 50 best rows | 50 best rows teach us nothing about which source to scale | Once one arm is clearly better, collapse to it |
| 4 | Signals reported **individually** | Composite fit score | No corpus to fit against | ~500 graded rows |
| 5 | **Registry declaration** as equipment evidence | Website text extraction | Only 5% have a website (§5.1) | Nothing in this box. In a larger-ticket box, revisit. |
| 6 | Twilio **`line_type_intelligence`** | `caller_name` (CNAM) | Cost, and line type was what the playbook asked for | **This is the top batch-2 experiment.** See §10.1. |
| 7 | Places **Text Search with field mask** | Text Search + Place Details | One call instead of two; stayed inside free tier | Needing fields the mask cannot carry |
| 8 | Exa budget **unspent** ($0 of $5) | Web-search enrichment on thin rows | Registry evidence covered every shipped row | Rows where registry evidence is absent — i.e. `ucc_only` at scale |

---

## 5. Surprises — the things that inverted a prior

### 5.1 Only 5% of in-box Florida owner-operators have a website

261 of 5,227 intersection rows had a website on record upstream; 28 of the final 640 after enrichment. This is the run's central finding and it **restructured the evidence design**. The plan assumed website text would supply the equipment quote. It cannot. Registry declarations had to become the primary evidence class, which turned out to be *stronger* provenance — a filing with a URL beats marketing copy — but it means we cannot describe a company's fleet in its own words, which costs something in email copy.

It also validates David's whole thesis. This borrower leaves no web trail. Every web-first sourcing vendor is structurally blind to them.

### 5.2 The intersection was 35× the threshold

The playbook set ~150 rows across lanes A/B/C as the go/no-go, and under ~80 as the trigger to widen early. The intersection came in at **5,227**, and total eligible at 83,987. **Discovery was never the constraint.** The entire risk framing of the playbook was pointed at the wrong stage. Every subsequent bottleneck was verification: Sunbiz join recall, Twilio quota, and manual row review.

### 5.3 The FMCSA API is far richer than its documentation

145 fields including phone, email, officer name, county and nine cargo flags. Eliminated a planned manual download and delivered 98% phone coverage. *Generalizable lesson: probe the API before trusting the docs or the bulk download.*

### 5.4 The CFO exclusion was free

Providence's under-15-employees rule was expected to need website or headcount inference. Sunbiz officer titles carry CFO / COO / Controller directly. 1,435 rows excluded from the state record at zero cost, before any API spend. **A box attribute that looked like a web-scraping problem was a schema lookup.** Worth asking of every future box rule: is this already in a filing?

### 5.5 Sunbiz doubles as an anchor, and the annual report is the freshness proof

2,973,401 active Florida companies filed a **2026** annual report. That means the officer list was confirmed by the company itself, this calendar year. This is the direct answer to David's worst failure mode — "Bob retired years ago! Jeremey son took over" — and no commercial contact vendor has an equivalent dated confirmation. 48 of the 50 carry it.

### 5.6 Places name-matching is far more dangerous than expected

`token_set_ratio >= 80` accepted `MDL SITE PREP` ↔ `Sunshine Site Prep` (81.8) and `OCALA JUNK REMOVAL` ↔ `Junk King Ocala`. Both then supplied **the wrong company's phone number** — exactly the "Joe Smith at a different company" defect David found in ZoomInfo. Generic tokens (SITE, PREP, JUNK, REMOVAL, TRUCKING, SERVICES, CONSTRUCTION) carry the fuzzy score while the distinctive token carries the identity. Fixed by matching on distinctive tokens only, with a full-name fallback at 92 for generic-only names. 20 of 331 hits demoted.

---

## 6. Defects in our own pipeline

Seven were found. Five were invisible in aggregate statistics and surfaced only by reading finished rows one at a time — the way David will read them. **That is the most important process finding in this document.**

### 6.1 Twilio 429s recorded as invalid numbers *(severity: critical)*

Ten threads, no HTTP status check. 353 throttled requests (error 60624, trial account) were written as `valid=false` — indistinguishable from a dead phone. 317 good rows were reported as `phone_invalid`.

- **Root cause:** conflating "the API said no" with "the API did not answer."
- **Detection:** probing a supposedly-failed number by hand and seeing HTTP 429.
- **Fix:** three distinct states — `verified_valid` / `verified_invalid` / `unverified` — reconstructed from the cache at zero additional cost.
- **Class:** *absence of evidence encoded as negative evidence.* This is the same category of error as the vendor firmographics David caught. Audit every boolean in the pipeline for a third state.

### 6.2 Places matched the wrong company *(critical)* — see §5.6.

### 6.3 Truncated `FL_POOL_v3_CONTACT.csv` to a single row *(high)*

`c3d_rematch.py` raised `dict contains fields not in fieldnames` **after** `writeheader()` had already truncated the target file. Recovered from the intact v2 plus the Twilio cache at zero cost.

- **Fix:** all four C3 scripts now union their columns and write atomically (`tmp` + `os.replace`).
- **Class:** *non-atomic write.* Any script that rewrites its own input is one exception away from destroying it.

### 6.4 County resolution silently failed on 83,537 rows *(high)*

`phy_cnty` was reported as usable county data; it holds **FIPS codes**. Fixed with a 67-entry FIPS map plus a DBPR county-code map derived empirically by joining CONSTRUCTIONLICENSE_1 and _2 on alternate licence number. County tier is a Providence box attribute, so this was not cosmetic.

### 6.5 Four defects found only by reading rows individually *(medium)*

A 266-power-unit carrier well outside the box; 36 malformed MCS-150 dates (the field is `YYYYMMDD HHMM`, not ISO); 10 owner names in `LAST, FIRST` or double-spaced form; 10 blank evidence cells (the entire `ucc_only` arm, which by construction has no registry declaration and needed lien-derived quotes).

### 6.6 Lane regex over-firing *(medium)* — see §C0.

### 6.7 corevt offset guessed rather than measured *(low, caught early)* — see §Stage A.

**Process recommendation:** add a **row-reading gate** before any delivery — 10 rows read in full, out loud, by a human or an agent instructed to read as the recipient. Every aggregate check the pipeline ran passed while five of these defects were live.

---

## 7. What the run says about the sources

### 7.1 The Sunbiz join is the largest silent loss in the pipeline

| Anchor | Rows | Sunbiz match | Rate | Ambiguous (>1 entity at name+city) |
|---|---:|---:|---:|---:|
| DBPR | 74,577 | 42,328 | 56.8% | 1,878 |
| FMCSA | 59,531 | 32,339 | 54.3% | 1,247 |
| FDEP | 608 | 420 | 69.1% | 23 |

**Roughly 45% of anchor rows never find their corporate record**, and every one of them is dropped. That is 34,341 companies discarded at C1. Some fraction are genuinely out-of-state or dissolved, but the FDEP rate of 69% on a tiny, clean, Florida-only registry suggests the ceiling is much higher than 55% and the gap is resolution failure, not reality.

Known contributors, in the order worth attacking:

1. **DBA / trade name vs legal name.** A carrier files as "Smith Trucking" and registers as "J.R. Smith Enterprises LLC". The alias table from `corevt` (342,592 rows) handles *former* names but not *trade* names.
2. **City mismatch.** Partly addressed by the name-only fallback (+24,702 eligible) but that fallback is coarse and unranked.
3. **Address-based resolution is entirely unused.** Both sides carry a street address and neither is being matched on it.

This is the **number one engineering target for batch 2**, and it is worth more than any new data source: a 10-point recall improvement is roughly 8,000 additional verified companies from files already on disk.

### 7.2 The anchors are complementary, not redundant

| Source | FL rows | In a lane | Phone | Email | Owner name |
|---|---:|---:|---:|---:|---:|
| FMCSA (active) | 156,367 | 59,945 | 155,587 | 121,112 | 141,095 |
| DBPR (active) | 103,077 | 89,891 | **0** | **0** | 103,077 |
| FDEP | 609 | 609 | 0 | 602 | 0 |
| UCC | 67,126 | 2,886 | 0 | 0 | 0 |
| Sunbiz (active) | 3,855,431 | — | 0 | 0 | 3,823,187 |

The asymmetry is the whole story: **DBPR brings 89,891 lane-tagged companies and not one phone number. FMCSA brings 59,945 and a phone for essentially all of them.** In the intersection, DBPR-only contributed 1,997 rows with 0 phones; FMCSA-only contributed 2,516 with 2,513 phones.

**Implication:** DBPR's contribution is currently capped by phone acquisition, not by discovery. Every DBPR-only row needs a phone from somewhere else, and Places found one for roughly half. A phone source that works on a company name plus address — rather than a web presence — would unlock the largest lane-tagged population we hold.

### 7.3 UCC's lane coverage is the weak overlay

Only 2,886 of 67,126 Florida UCC filings carry a lane tag, because the lane has to be inferred from the debtor *name* — the overlay has no cargo flags and no licence class. Collateral-description parsing is unexploited and would both improve lane recall and, per the earlier debrief, surface the second-tier dealer universe from the secured-party field.

---

## 8. Weaknesses shipped knowingly

| Weakness | Impact | Mitigation in place |
|---|---|---|
| **Twilio trial quota** — 353 of 552 numbers unchecked | 294 otherwise-good rows sit unverified in the continuation pool | Only `verified_valid` rows entered the 50 and the bench. Lifting the trial is the cheapest single unblock. |
| **A disconnected landline is undetectable by any API** | Some fraction of the 50 will fail on dial | This is precisely what the batch measures. `phone_ok` is the label. |
| **Line validity ≠ right company** | The core risk in the whole delivery | Not mitigated by design. §10.1 proposes the fix. |
| **`ucc_only` rows have no registry declaration** | Weaker evidence on 10 of 50 | `equipment_source` states which is which; the arm is explicitly under test |
| **County tiers derived from population** | Playbook cited a 30/26/10 list from Alek's P2 not present in the vault | Derived 10/26/31 and documented the substitution |
| **`name_only` Sunbiz matches are unranked** | Possible wrong-entity attachment | Flagged in `sunbiz_match_method`; batch 1 preferred `name_city` |
| **Two of five signals structurally unavailable** | Timing model is thinner than designed | Both unlock with infrastructure, not vendors (§C4) |

---

## 9. The measurement plan — what the verdicts actually settle

The batch is an experiment with three pre-registered comparisons. Report each with a Wilson interval and the n beside it; several cells are small and will not separate.

| # | Comparison | Groups | n | What it changes |
|---|---|---|---|---|
| 1 | **Overall accuracy vs the 50% bar** | all | 50 | Continue / stop |
| 2 | **Which arm earns the reach rate** | intersection / anchor_only / ucc_only | 30 / 10 / 10 | If anchor_only holds, the addressable pool is ~10× larger (77,100 vs 5,499 eligible). If only intersection works, the pipeline gets tighter and much smaller. **Highest-value comparison in the batch.** |
| 3 | **Does corroboration predict accuracy** | 2 sources agree / 1 source | 18 / 32 | If yes, single-source rows get held back permanently and corroboration becomes a hard gate |
| 4 | Phone source | fmcsa_mcs150 / google_places | 39 / 11 | Whether Places phones are worth their false-match risk |
| 5 | Owner source | sunbiz / licence qualifier | 43 / 7 | underpowered; pool across batches |
| 6 | Line type | mobile 24 / landline 9 / fixedVoip 8 / nonFixedVoip 9 | 50 | Whether nonFixedVoip predicts a shared or answering line |
| 7 | Lane | A_DIRT 18 / A_VAC 12 / B 11 / C 8 | 49 | Where to weight batch 2 |
| 8 | Signal presence vs `in_market` | by signal_id, and by count (1: 21, 2: 28, 3: 1) | 50 | **The first real weights for the scorer.** Underpowered at n=50; this is why batch 2 needs to be 200. |

Comparisons 5–8 are underpowered at n=50 by design — the batch was sized to answer #1 and #2. Preserve every verdict in a labelled corpus so 5–8 resolve by batch 3.

---

## 10. Recommendations for batch 2, ranked by leverage

### 10.1 Buy CNAM on the Twilio lookup *(highest leverage, smallest change)*

We used `line_type_intelligence`. The field we did not buy is **`caller_name` (CNAM)**, which returns the business name registered to the line. That is a direct, pre-dial check that a number belongs to the right company — the exact thing David is currently grading by hand at 200 calls a day, and the exact defect every vendor ships.

Run it on batch 1's own 50 **before** David's verdicts come back. Then compare CNAM agreement against his `right_poc` grades. If CNAM correlates, a large part of the human verification loop becomes automatable, and "verification as a product" (his "north of 50, you can sell this to anybody") becomes a machine capability rather than a service.

Cost is a few cents per lookup. This is the cheapest disconfirming test available and it resolves within days.

### 10.2 Raise Sunbiz join recall from ~55% to ~70%

Three tractable moves, in order of expected yield: address-based matching (currently entirely unused, both sides carry it); DBA and trade-name resolution beyond `corevt`'s former names; and ranked scoring for `name_only` matches instead of a flat accept-and-flag. Worth roughly 8,000 additional verified companies from files already on disk. **No new vendor, no new spend.**

### 10.3 Lift the Twilio trial *(a payment decision, not an engineering one)*

294 good rows in the continuation pool have unchecked numbers. Verifying them is an afternoon of runtime once the quota is gone.

### 10.4 Start retaining monthly FMCSA snapshots today

`fmcsa_fleet_delta` — a carrier that went from 3 to 6 power units in a year — is plausibly the strongest buying signal in the set and it is unavailable purely because we have one snapshot. One cron job. The value starts accruing 30 days from now, so the cost of delay is real.

### 10.5 Parse UCC collateral descriptions

Improves lane recall on the overlay (currently 2,886 of 67,126) and, per the earlier debrief, surfaces the second-tier dealer universe from the secured-party field — which is 47–50% of Providence's revenue channel.

### 10.6 Add a row-reading gate to the release process

Ten finished rows read in full before any delivery. Five of seven defects in this run were invisible to aggregate checks.

### 10.7 Add roofing (SIC 1761) and structural steel (1791) as lanes

Both are on David's crosswalk, both were skipped as trade-shaped, and both run boom trucks and cranes at real ticket sizes. Cheap lane additions against DBPR licence classes we already hold.

### 10.8 Push the C1→C2 quota gate wider

C2 onward processed 640 of 83,987 eligible rows. With Places inside the free tier and Twilio off trial, that gate can open to several thousand without meaningful cost, which turns the continuation pool from 397 into a standing inventory and removes the per-batch rebuild.

---

## 11. What generalizes beyond Florida

Portable without modification:

- **The four source roles.** Anchor / overlay / verify / enrich is a template. Every state has a corporate registry (verify), a UCC index (overlay) and trade licence registries (anchor); FMCSA is federal and covers all of them.
- **Evidence hierarchy.** Regulator declaration > licence class > registry authorization > name regex, with name regex explicitly not counted as evidence.
- **The three-arm experimental design.** Ship a mix, let the verdicts pick, rather than shipping only the best rows and learning nothing.
- **Refusing to score before there is a corpus.**
- **Three-state booleans.** Verified-true, verified-false, and not-checked, everywhere.

Needs rebuilding per state:

- The join key's suffix list (entity types vary), fixed-width parsers (each state's bulk file differs), licence-class → lane maps, and the county tiering.

The equipment → lane → SIC crosswalk is the object worth promoting to first-class and versioning, per the earlier debrief. This run also produced two additions to David's own crosswalk: it has **no code for the vac lane** (Division E sanitary services, 4959) and **none for towing or waste** (7549, 4212, 4953), which together account for 20 of the 50 shipped rows.

---

## Appendix — API ledger

| API | Endpoint | Calls | What it answered | Cost |
|---|---|---:|---|---:|
| FMCSA (Socrata) | `data.transportation.gov/resource/az4n-8mr2.json` | 6 pages | 287,917 FL carriers × 145 fields | $0 |
| Google Places (New) | `places:searchText` with field mask | 640 | website, second phone, operating status | $0 (free tier) |
| Twilio | Lookup v2 `line_type_intelligence` | 552 attempted / 199 answered | line validity, type, carrier | $1.59 |
| Exa | — | 0 | budget allocated, not needed | $0 |

**Total run cost: $1.59.**

---

## 12. Post-run row read (2026-09-04) — what the retro's own gate found

The row-reading gate recommended in §6 and §10.6 was run on the shipped 50 before delivery. It found nine issues that every aggregate check in §1 had passed. All were fixed by rule in `scripts/c5b_fix.py`, which now runs after `c5_select.py`; the prior outputs are kept as `out/.pre_fix_*.csv`.

| # | Issue | Rows | Rule applied |
|---|---|---:|---|
| 1 | "Renewal window is open now" came from prod's dueness model (months since filing ÷ that lender's median refiling gap, evaluated 2026-07-11), not the 36–60 month rule the README stated. 17 of 34 flagged liens were under 36 months old. The 2026-07-10 `ripe_date` on those rows was the evaluation date, not a prediction. | 34 | Wording changed to "inside the typical refinance window for that lender"; `ucc_ripe_date` blanked where basis is `in_window_now` (prod withholds it too); README definition corrected. |
| 2 | Monroe County was 12 of 50. RURAL-first ranking plus the Keys' DOT density, not targeting. Rural by population is not "small community" in Providence's sense. | 12 | Cap of 5 in the 50, 3 on the bench. Replace county tier with funded-deal density once David sends deals by county. |
| 3 | Out-of-persona rows the registries tagged as operators: a private resort club (8 refuse trucks), a 79-year-old agricultural co-op, a Do It Best hardware store. | 3 | Excluded. Root cause for batch 2: the FMCSA `construct` cargo flag means *hauls construction materials*, which A_DIRT-tags supply houses, electricians and ironworks. Require a second evidence class or a name/licence corroboration for A_DIRT when the only flag is `construct`. |
| 4 | Lane mis-tags by the same mechanism: an electrician and an ironworks in A_DIRT (SIC 1731 / 1791, both listed as not targeted). | 2 | Excluded; `ELECTRIC|ROOFING` name rule added to the dial filter. |
| 5 | Same owner twice (Harrison Logging / Harrison 3 Enterprises). | 2 | One dropped. Batch 2: dedupe on owner name + county. |
| 6 | Owner-name normaliser dropped middle tokens and glued first+middle: "John Jr" for JOHN R SARTOR JR, "Jammielavon" for Jammie Lavon, "Jone" for JON E, a holding company as a person. | 12 in 50+bench | Names rebuilt from `owner_name_raw` (handles `LAST, FIRST M.`, initials, suffixes); DOT-filed officer used when the state officer is a corporation. |
| 7 | Wrong website from prod (Endeavor Construction on Evan Douglas Construction). | 1 | Blanked. Prod entity-resolution miss; file as a prod issue. |
| 8 | `phone_alt` equalled `phone` on 18 rows while the README said it holds a differing number. | 18 | Blanked where equal. |
| 9 | Bench carried four rows under the 2-year TIB floor and one carrier twice (two DOT numbers). | 5 | TIB floor and company-level dedupe applied to all three files. |
| 10 | Lane A_VAC held three concrete-pumping companies and a well-and-pump contractor (the `PUMP` token), and a garbage cargo flag put an aggregate yard in C. | 5 | Re-laned by rule (`LANE_OVERRIDES`). Batch 2: `PUMP` must be qualified (`SEPTIC|VAC|HYDRO|GREASE|PORTABLE`), and `CONCRETE PUMP` routes to B; a garbage flag on a name that fires the B regex should not outrank it. |

Composition after the fix: arms 30/10/10; lanes A_DIRT 20 · A_VAC 8 · B 14 · C 7 · E 1; verdict columns dropped from the sheet at Simon's call (David grades in his own format); Monroe 5; corroborated 14; email 40; website 25; 49 of 50 with a 2026 annual report; continuation 391 (101 verified, 290 unverified).

Two process points. First, the gate has to be a release step, not a recommendation: the nine issues above took ten minutes to find by reading and had survived every statistic. Second, the `construct` cargo-flag problem is the first real crack in decision #2 (cargo flags outrank names). The flag is still stronger evidence than a name regex, but it is evidence of hauling, not of operating, and the lane map should say so.
