# Florida batch 1, version 2 — results guide

**Delivered:** 2026-09-07 · **Slice:** Florida only · **Prepared by:** Quintel for Providence Capital Funding

This replaces the list sent on 2026-09-04. Nothing from that batch needs to be called.

Start with `FL_PHONE_TEST_50_v2_2026-09-07.csv`. `BENCH_v2_2026-09-07.csv` holds 15 more built the same way.

---

## 1. What changed, and why

Your two rules arrived before any calls were made, so the list was rebuilt on them rather than sent as it was.

| Your rule | What we did |
|---|---|
| More than 7 pieces of equipment and the odds drop sharply | Every row declares **2 to 7 power units** on its own DOT filing. Median 3. |
| Borrowing history with a captive lender hurts, worse if repeated | **No row has a lien from any OEM captive.** Your seven, plus the other manufacturer finance arms we could identify, are excluded outright. |

Applied to the old list, those two rules would have removed 35 of the 50. That is why it was withdrawn.

Two other things changed. Every phone now comes from the same place, the company's own DOT filing, so nothing about a phone's origin varies across the list. And every number was run through a caller-name check before delivery, which is new (§3).

---

## 2. The one split: `segment`

The old list had three groups of 10, 10 and 30. At those sizes nothing could be concluded from any of them. This version is one split, 25 and 25.

| Value | What it means | Rows |
|---|---|---:|
| **LIEN** | Has financed equipment before with an **equipment-finance independent** — no OEM captive, no bank or credit union. A borrower who has already paid an independent's rate. | 25 |
| **NOLIEN** | No equipment lien on record anywhere in Florida. Owns the equipment outright, or financed it in a way that left no trace. | 25 |

Both halves are otherwise built identically: same registries, same size band, same phone source, same exclusions. **Grade both the same way.** What we are trying to learn is whether prior borrowing history predicts a live conversation. If it does, that becomes the primary filter and the list gets sharper. If it does not, borrowing history is worth nothing at the top of the funnel and we stop paying for it.

Of the 25 LIEN rows, 17 sit inside the window where borrowers with that lender typically refinance. All 25 lenders are equipment-finance independents. No captives, no banks or credit unions.

---

## 3. New: the caller-name check

Every number was checked against the caller-name record the carrier publishes, before delivery. This is the first pre-dial answer to the question that broke every vendor list you have used: *does this number actually belong to this company?*

| `cnam_match` | What the line is registered to | Rows |
|---|---|---:|
| **company** | The company itself | 20 |
| **owner** | The owner we named, first and last | 12 |
| **surname** | The same surname, different first name. The spouse or the son on the account. Still the right household. | 4 |
| **other** | A real name that matches neither. **These four are the ones to be suspicious of.** | 4 |
| **none** | No name published. Not evidence either way; common on mobiles, where the carrier makes it opt-in. | 10 |

So 36 of 50 are independently confirmed as belonging to the company or its owner before anyone picks up the phone.

`cnam_name` is the raw registered name. It is capped at 15 characters by the carrier standard, so expect truncation ("TUESDAY STONEST"). `cnam_type` reports BUSINESS or CONSUMER; **ignore it.** Real businesses in this ICP come back CONSUMER constantly, because the flag describes the billing account, not the use.

**We did not remove the four mismatches.** If we dropped them we could never find out whether this check predicts your verdicts, which is the only reason to buy it. Grade them like any other row. If `other` reliably means a bad number, the check goes in front of every future batch and a large part of the manual verification disappears.

---

## 4. Column legend

**`lane`** — what the company runs. A_VAC 14 (septic, vac, grease, portable sanitation) · B 14 (aggregate, paving, logging, hauling, trusses) · A_DIRT 12 (excavation, site work, land clearing, drilling) · C 10 (roll-off, waste, towing, recovery).

**`power_units` / `total_drivers`** — both from the company's own DOT filing. Power units is the equipment count your rule refers to. Drivers is the closest thing to a headcount in any public record; it is not total employees, but it is filed by the company rather than estimated by a vendor. This is what we have in answer to your firmographics question. There is no employee or revenue figure in any Florida source for companies this size, and we would rather leave it blank than publish a guess.

**`equipment_quote` / `equipment_url`** — why we say the company runs equipment, in its own words, with the public filing it came from. Every row on this list quotes its DOT filing. Checkable in about ten seconds.

**`owner_name` / `owner_title` / `owner_source`** — `sunbiz` is the officer named on the company's Florida annual report; all 50 filed in 2026, so every name is state-confirmed this year. `license` is the qualifier on the state contractor licence. Any company with a CFO, COO or controller on the filing was removed before the list was built.

**`ucc_secured_party` / `ucc_lender_class` / `ucc_filing_date` / `ucc_ripe_date`** — LIEN rows only. `ucc_ripe_date` is blank when the refinance window is already open (17 of 25), and carries a date when it opens later.

**`top_signal_text`** — timing, not fit. "Inside the typical refinance window" means the lien is old enough that borrowers with that lender usually refile. It is modelled from how long borrowers with the same lender go between filings, not a fixed term, so it can open anywhere from roughly 20 to 50 months. Treat it as a hint. Nothing is combined into a score; there is no point weighting signals before your verdicts say which ones predict anything.

**`phone_corroborated`** — true on 35 rows, meaning two independent sources gave the same number.

**`tier`** — carried over from the previous build and balanced at 25/25 so it cannot confound the segment split. Not something to grade.

---

## 5. What is in the batch

- 50 rows, Florida only, 31 counties, no county over 4 rows
- 2 to 7 power units, median 3 · time in business 2.5 to 45 years, median 20
- Phone on all 50, all carrier-checked active, all from the DOT filing. 36 mobile, 8 fixed VoIP, 3 non-fixed VoIP, 3 landline
- Email on 49, website on 26
- All 50 filed a 2026 Florida annual report
- Bench: 15 more, same build, all NOLIEN. Use them for rows that die for reasons unrelated to the data, and keep the 25/25 split intact by noting which segment you are replacing

---

## 6. What would help most coming back

Grade in whatever format suits you; we will map it. What matters:

1. **Reached, right person, working number** on every row, including the failures. A bad row with a reason is worth more to us than a good row without one.
2. **Whether LIEN beats NOLIEN.** This decides whether borrowing history stays in the build.
3. **Whether `cnam_match` predicts anything**, especially those six `other` rows.

---

## 7. What is deliberately not here

- No demographic fields anywhere. No gender, race, religion, marital status or political affiliation. Fair-lending line, and it does not move.
- No guessed emails. Every address came from a filing or the company's own site.
- No scraped contacts. No LinkedIn, Apollo, ZoomInfo or intent-data vendors.
- No estimated employee counts or revenue. See §4.
- No composite score.

---

## 8. Every row was read before it shipped

All 50 were read individually after the build, the way you will read them. That pass moved a land-clearing company out of the roll-off lane, moved concrete pumping out of the vac lane, and removed a building-supply house that the freight data had classed as a site-work contractor, because a carrier ticks every cargo box it might ever haul and the company's own trade name is the better description. Each of those became a rule, so it holds for the next batch too.
