# Florida Batch 1 — results guide

**Delivered:** 2026-09-04 · **Slice:** Florida only · **Prepared by:** Quintel for Providence Capital Funding

This folder holds one call list and the files behind it. Start with `FL_PHONE_TEST_50_2026-09-04.csv`. Everything else is backup, bench, or audit trail.

---

## 1. The files

| File | Rows | What it is | When to open it |
|---|---:|---|---|
| **FL_PHONE_TEST_50_2026-09-04.csv** | 50 | The call list. Every phone number checked live and confirmed active before delivery. | This is the one to dial. |
| **BENCH_25.csv** | 25 | Same build quality, same verification, held back so the test stays at 50. | If a row dies for a reason unrelated to data (gatekeeper, no answer after 3 tries), pull a replacement from here. |
| **CONTINUATION_POOL.csv** | 391 | Next in line. Same build; 101 have verified phones, 290 have phones we have not yet run through the carrier check. | Batch 2. Say the word and we verify the 290 and ship. |
| FL_PHONE_TEST_50_SOURCES.md | — | Every source, pull date, row count, and per-row provenance. | If a row is wrong and you want to know which source lied. |
| SOURCE_SCORECARD.md | — | What each source contributed: coverage, phone rate, owner-name rate. | Deciding what to buy or pull for batch 2. |
| INTERSECTION_COUNTS.md | — | How many companies appear in one source vs. several, by lane. | Understanding the three arms (§4). |
| FL_POOL_v1.csv | 134,719 | The full Florida pool before any verification. | Sizing. This is the ceiling for Florida in these lanes. |
| FL_POOL_v2_EQUIPMENT.csv | 640 | The pool after the equipment-evidence gate. | Audit. |
| FL_POOL_v3_CONTACT.csv | 640 | v2 plus phone, email, website, and the carrier check result. | Audit. |
| FL_POOL_v4_SIGNALS.csv | 640 | v3 plus the timing signals. | Audit. |
| SIGNALS.csv | 3,200 | One row per company per signal, with the evidence. | If you want to know why a row said "renewal window open." |
| FL_POOL_v1_STATS.md | — | Pool counts by lane, tier, and exclusion reason. | Sizing other states. |

One more file sits in this folder and is **not part of the delivery**: `RUN_RETRO_INTERNAL_2026-09-03.md` is Quintel's own engineering retrospective on the build. It is kept here so the results and the method that produced them stay together.

---

## 2. Column legend — the ones that are not self-explanatory

### `lane` and `equipment_class`

Both hold the same value. `lane` is where the company came from; `equipment_class` is what we believe it runs. They match on every row in this batch, which is deliberate — a row only shipped if the equipment evidence agreed with the lane.

| Code | Lane | Typical equipment | Count in the 50 |
|---|---|---|---:|
| **A_VAC** | Vacuum, septic, hydrovac, portable sanitation, grease, liquid waste | Vac trucks, pump trucks, hydro-excavators, portable restroom trucks | 8 |
| **A_DIRT** | Excavation, site work, underground utility, land clearing, drilling | Excavators, dozers, backhoes, trenchers, drill rigs | 20 |
| **B** | Paving, concrete, aggregate, dump, heavy civil | Dump trucks, pavers, milling machines, mixers, loaders | 14 |
| **C** | Roll-off, waste, recycling, towing and recovery | Roll-off trucks, rear/front loaders, wreckers, car carriers | 7 |
| **E** | Plumbing, HVAC and the rest of the preferred list | Service trucks, boom trucks, specialty rigs | 1 |

### `tier` — how the company was found

This is the experiment. Three arms, so the grades tell us which sourcing method to scale.

| Value | Meaning | Count |
|---|---|---:|
| **intersection** | Found in a licence or carrier registry **and** carrying an active equipment lien **and** active with the state. Three independent confirmations. | 30 |
| **anchor_only** | In a registry, active with the state, but no equipment lien on file. Confirmed operator, no borrowing history visible. | 10 |
| **ucc_only** | Has an equipment lien and is active with the state, but appears in none of the three equipment registries. Known borrower, thinner operational picture. | 10 |

**The three equipment registries** referenced above are the FMCSA motor-carrier census (a DOT number), DBPR construction licences, and FDEP septic authorizations. They are what let us assert a company operates equipment on the strength of a filing rather than a guess.

A `ucc_only` row is in none of the three. Stated precisely: **we could not find it in a registry we hold**, which is not the same as it being unregistered. It may carry a licence class we did not pull, or operate under an out-of-state DOT number. The 10 rows in this arm are the ones whose `equipment_source` reads `ucc_filing`.

Grade all three. If one arm scores far below the others, we stop building it.

### `county_tier`

Population-derived, from your point about small communities.

| Value | Meaning | Count |
|---|---|---:|
| **RURAL** | Outside the 31 largest Florida counties | 37 |
| **SMALL_METRO** | Mid-size metro | 11 |
| **BIG_METRO** | Miami-Dade, Broward, Orange, Hillsborough, Pinellas, Duval | 2 |

### `equipment_quote`, `equipment_url`, `equipment_source`

Every row states, in its own words, why we think it owns equipment — and gives you the public record it came from. **Only 5% of companies in this box have a website**, so almost none of this comes from a company site. It comes from filings.

| `equipment_source` | What the quote is | Count |
|---|---|---:|
| **fmcsa_mcs150** | The company's own DOT filing: declared cargo types, power units, trucks owned | 39 |
| **ucc_filing** | The collateral description on a live equipment lien, plus the lender's name | 10 |
| **dbpr_license** | The state contractor licence class the company holds | 1 |

`equipment_url` opens the public record. Every quote is verifiable in about ten seconds.

### Phone fields

| Column               | Meaning                                                                                                                                                                                                                                        |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `phone`              | The number to dial. Every one of the 50 was checked against carrier records the day before delivery and came back active.                                                                                                                      |
| `phone_source`       | `fmcsa_mcs150` (the number the company filed with the DOT, 39 rows) or `google_places` (11 rows)                                                                                                                                               |
| `line_type`          | Carrier line class: mobile 30, landline 8, fixedVoip 5, nonFixedVoip 7. A mobile is usually the owner directly. A nonFixedVoip is more often a shared or answering line.                                                                       |
| `phone_corroborated` | `true` when two independent sources gave the same number (14 of 50). Our expectation is these grade best.                                                                                                                                      |
| `phone_alt`          | A second number where we found one that differs from the first (8 rows). Try it before writing a row off. Blank means either no second number was found or the second source gave the same number, in which case `phone_corroborated` says so. |

**What we did not check:** whether the number belongs to the right *company*. That is precisely what your grading settles, and it is the thing every vendor has got wrong.

### `owner_name`, `owner_title`, `owner_source`

| `owner_source` | Meaning | Count |
|---|---|---:|
| **sunbiz** | The officer named on the company's Florida annual report. 49 of the 50 companies filed in 2026 (the other in 2025), so the name is state-confirmed this year. | 44 |
| **licence** | The named qualifier on the state contractor licence | 6 |

`owner_title` is the state's own title, translated into plain English — President, Managing Member, Authorized Member, Licence qualifier, and so on.

This is our answer to "Bob retired years ago, Jeremy his son took over." A 2026 annual report is the freshest owner record Florida publishes.

**Companies with a CFO, COO or controller on the filing were removed before this list was built** — your under-15-employees rule, applied from the state record rather than guessed from a headcount estimate.

### `tib_years`

Years since the company registered with Florida. Formation date, not an estimate. Range in the 50: 3.5 to 59.7 years, median 21.5.

### `top_signal_text` and `signals_present`

Timing, not fit. `signals_present` is how many timing signals fired (1 signal: 21 rows · 2 signals: 27 · 3 signals: 2). `top_signal_text` is the strongest one, in plain English.

The signals in this batch:

| Signal | What it means |
|---|---|
| **UCC renewal window** | An equipment lien old enough that borrowers with that lender typically refile. The window is modelled from how long borrowers with the same lender go between successive filings, not from a fixed term, so it can open anywhere from about 20 to 50 months after filing. A timing hint, not a fact. Where the window is already open, `ucc_ripe_date` is blank; where the model predicts a future opening, it holds that date. |
| **FMCSA fleet size** | Declared power units in the 2–15 range — the size band that buys one truck at a time. |
| **New DOT number in the last 12 months** | Recently authorised carrier, likely still building the fleet. |

They are reported separately and **not** combined into a score. There is no point weighting signals before your verdicts tell us which ones predict anything.

### `selection_reason`

One line stating why this row is in the 50. Arm, lane, county tier, evidence source, phone source, signal count.

### Grading

The sheet carries no verdict columns; grade in whatever format you already use. What we can ingest directly, per row: reached, right person, number live and belongs to this company, in market, what and when, and any corrected phone or contact. Free-text notes are welcome, especially on the failures.

---

## 3. SIC codes — and why you will not find one on these rows

Your 26-code crosswalk shaped the target, but no SIC code appears in the data, for a simple reason: **none of the Florida sources carry one.** The state corporate registry has no industry code, the lien index has none, the contractor licence file has occupation codes of its own, and the carrier census uses cargo classifications.

More to the point, SIC is a proxy for equipment, and on these rows we have the equipment itself — a declared cargo type, a licence class, or a lien naming the collateral. Where the proxy and the evidence disagree, we kept the evidence.

Here is how our lanes map back onto your list:

| Lane | Your SIC codes | Notes |
|---|---|---|
| **A_DIRT** | 1611, 1622, 1623, 1629, 1781, 1794, 1795 | Direct hit. Your heavy-construction major group is almost exactly this lane. |
| **B** | 1611, 1771, 2951, 3271, 3272 | Direct hit, plus sand and gravel (1442), which is not on your list. |
| **E** | 1711, 1796 | Narrow by design — most plumbing and HVAC is a service-van trade and fails the equipment gate. |
| **A_VAC** | *no code on your list* | See below. |
| **C** | *no code on your list* | See below. |

**Two gaps worth a conversation.**

First, **your list has no code for the vac lane.** Septic pumping, hydrovac, grease and portable sanitation sit in Sanitary Services (4959) and Refuse Systems (4959/4212), which are Division E — transportation and utilities — not Division C. Your crosswalk is construction-shaped and stops at the division boundary. That lane is 8 of the 50, and it is the one we would bet on: a vac truck is a $150–350K asset, the operator is nearly always the owner, and there is no captive lender in the category.

Second, **your list has no towing or waste code either** — 7549 towing, 4212 local trucking and refuse, 4953 refuse systems. That is lane C, 7 more rows.

So 15 of the 50 sit outside the crosswalk you gave us. If the grades on those come back strong, the crosswalk should grow by a division.

**Codes on your list we did not target:** 1731 electrical, 1741 masonry, 1742 drywall, 1752 flooring, 1761 roofing, 1791 structural steel, 1799, 2952, 2992, 3241, 3253, 3255, 5074. Most are hand-tool or service-van trades that fail an equipment-evidence gate. Two are worth revisiting — **1761 roofing** and **1791 structural steel** both run boom trucks and cranes at real ticket sizes.

We can add a `sic_code` column to future batches, but it would be *derived from the lane*, not read from a record. Given what you found in the vendor list — where the SIC column was somebody's guess dressed as data — we would rather ship the lane and the crosswalk than a code we inferred.

---

## 4. How to read the results

Three things the grading will settle, in order of how much they change what we build next:

1. **Overall accuracy.** Your bar is 50% reaching the right company and the right person on a working number. That is the number that decides whether this is worth continuing.
2. **Which arm wins.** 30 / 10 / 10 across intersection, anchor_only, ucc_only. If intersection grades far higher, we tighten and the pool shrinks. If anchor_only holds up, the pool is roughly ten times larger.
3. **Whether corroboration predicts accuracy.** 14 rows have a phone confirmed by two sources, 36 by one. If the 14 grade meaningfully better, one-source rows get held back in every future batch, and we know what to spend money on.

Grade everything, including the rows that fail. A failure with a known source is worth more to us than a success with an unknown one.

---

## 5. What is deliberately not here

- **No demographic fields.** No gender, race, religion, marital status or political affiliation, anywhere in the pipeline. Fair-lending line, and it does not move.
- **No guessed email addresses.** 40 of 50 carry an email; every one came from the company's own filing or its own website. No `first.last@domain` patterns.
- **No scraped contacts.** No LinkedIn, no Apollo, no ZoomInfo, no intent-data vendors. Every field traces to a public record or the company's own site.
- **No composite score.** Signals are reported individually. Weighting comes after your verdicts, not before.

---

## 6. Every row was read before it shipped

After the build, every row in the 50 and the bench was read individually, the way you will read it. Eleven rows were swapped out of the first cut: a private resort club, an agricultural co-op and a hardware store that the registries had tagged as equipment operators; an electrician and an ironworks that the cargo flags had put in the excavation lane; one owner who appeared twice; and a cluster of Keys businesses, capped at five so Monroe County does not dominate a Florida list. Owner names were rebuilt from the raw registry string so middle initials and suffixes survive ("John R. Sartor Jr.", not "John Jr"). Five rows were also re-laned after the read: three concrete-pumping companies and an aggregate yard to B, and a well-and-pump contractor to A_DIRT, where a keyword match or a cargo flag had put them in the vac or waste lane. Nothing was hand-edited on a row; every change is a rule, so it applies to batch 2 as well.
