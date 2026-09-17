# Providence pool-first pilot: gameplan

Living document. Start here. Last revised 2026-09-15, after David returned partial FL-100 + CO-100 verdicts (§4.11: event tags predict, lien timing doesn't). Prior 2026-09-14, after Wisconsin verdicts (§4.10). Prior revisions 2026-09-11 (his follow-up reply, template, WI batch shipped) and 2026-09-10 evening, after the three-way call (transcript: `../../bd/calls/transcripts/david-lasaee-2026-09-10.md`).
Internal. David asked not to be recorded; his phrasing stays in this folder and never goes out verbatim.

Companion files: `CLAUDE.md` (map of this folder) · `TODO.md` (open items) · `EMAIL_INFRA_PLAN_2026-09-09.md` (email channel) · `out/verdicts/` (every verdict David returns, scored) · contact doc `../../bd/calls/contacts/david-lasaee.md`.

---

## 1. What we are doing, in one paragraph

Providence Capital Funding (David LaSaee, sales and underwriting) is co-building a sourcing method with us. The method is pool-first: define the ICP by the equipment it operates, build the pool from public registries that prove the equipment exists (not from contact vendors), verify every row against a second registry, attach the borrowing record from UCC, and only then look for timing. David calls the rows, grades them, and tells us why each one was or was not a fit. His verdicts are the labels; the labels drive the next batch. The product Quintel is building is the loop, not any single list. If the loop reaches David's economic bar (below), it is the sourcing engine for every originator like him. If it does not, we learn that from real dials instead of a pitch deck.

## 2. The bar and the economics

Restated on the 09-10 call. The denominator is **live contacts**, not dials: voicemails are a black hole (his focus groups: 90% never listen).

| Ratio | Source | Meaning |
|---|---|---|
| 2 applications per 100 contacts, 10% of applications funded | David, call-centre norm | the floor. 1 funded deal per 500 contacts. At ~$10K revenue per deal that is ~$20 of value per contact: a data vendor cannot live on it ($300 CPA on 10,000 leads = $6K) |
| 25 calls → 5 applications → 1 funded, per day | PCF's owner, his own ratio | the goal. 20% application rate, 20% funded. At this ratio 25% of deal revenue (~$2,500 per funded deal, $7–10K/day of value to PCF) is "reasonable"; David and Alek converged on it independently |
| 10,000 UCC leads → 5 applications, 1 funded | what PCF bought last quarter at $4–6/lead (ZoomInfo run cost $30K) | the baseline we have to beat: 0.05% applications per lead |
| FL v2: 31 contacts → 0 applications, 1 intro email | us | not yet evidence either way; 31 contacts is below the resolution of a 2% rate |

Implications that follow from the arithmetic, not from opinion:
- A list business at any price is dead at 2%. The only model that pays is a share of funded revenue, which requires ratios near the owner's, which nobody gets from cold dials. Those ratios come from **inbound**: the person has already said "talk to me." David's own words: the top rep at PCF makes zero calls, 99% vendor referrals; "the most successful people in this business make the least calls"; "cold calling is pretty much dead."
- So the product is the machine that produces "talk to me," and David's calls become order-taking. Email (5–6 touches, Providence brand) is the first version of that machine; vendor-side is the eventual one.
- Market context (David): 14,000 EF companies in 2022 → 46,000 in 2026 on flat volume (~$1.7–1.8B in his segment). Supply of brokers exploded; supply of *demand* did not. Whoever manufactures demand wins.
- Business model options he put on the table: per-lead fee (easy, but see above), share of funded revenue (25% at owner ratios), or Quintel brokers directly (funders will want bonds and a track record; "one of the few fully digital"). He rejected the honour-system revenue share (the Max deal) as unpoliceable. Parked until ratios exist. Full read in §15.

## 3. What has happened

| Date     | Event                                                                                                                                                  | Artifact                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| 09-03    | Design call with David. Method agreed.                                                                                                                 | `../providence-pool-first-debrief-2026-09-03.md`                                                       |
| 09-03/04 | FL pool built: Sunbiz + FMCSA + DBPR + FDEP + FL UCC → 134,719 rows, 83,987 eligible. Batch 1 (50) delivered.                                          | `out/FL_PHONE_TEST_50_2026-09-04.csv`, `out/RUN_RETRO_INTERNAL_2026-09-03.md`                          |
| 09-05    | David's batch-1 feedback (did not call: Friday + holiday). Two box rules: fleet > 7 and OEM captives. Ran numbers through his verifier, "mostly true." | `TODO.md` §1                                                                                           |
| 09-07    | v2 batch: one 25/25 LIEN vs NOLIEN split, single phone provenance (MCS-150), fleet 2–7, captives and banks out, CNAM attached.                         | `out/FL_PHONE_TEST_50_v2_2026-09-07.csv`, `scripts/c5c_v2_select.py`                                   |
| 09-08    | David dials all 50 in one day.                                                                                                                         |                                                                                                        |
| 09-09    | Verdicts back. Scored. Agenda and email-infra plan written.                                                                                            | `out/verdicts/david_v2_2026-09-09.csv`, `AGENDA_DAVID_2026-09-10.md`, `EMAIL_INFRA_PLAN_2026-09-09.md` |
| 09-09    | Alek builds Ohio 50, lender-first from the Ohio UCC index. Re-verified, Twilio, fit flags, shipped.                                                    | `out/OH_PHONE_TEST_50_LIEN_2026-09-09.csv`, `scripts/c5e_ohio.py`                                      |
| 09-09    | David's replies: the bar, LIEN as underwriting requirement, single-asset rule, FMCSA limits, Central time zone.                                        | this document                                                                                          |
| 09-10    | Meeting.                                                                                                                                               | `AGENDA_DAVID_2026-09-10.md`                                                                           |
| 09-10    | Ohio verdicts back, scored. Follow-up email sent.                                                                                                      | `out/verdicts/david_oh_2026-09-10.csv`, `EMAIL_TO_DAVID_FOLLOWUP_2026-09-10.md`                        |
| 09-11    | David's reply (baseline = rep-capacity), sends his call-sheet template. Alek's Wisconsin 50 built, run through phone checks, shipped in the template.  | `david-data-template.xlsx`, `out/WI_PHONE_TEST_50_2026-09-11.csv`, `email_to_david_wi_2026-09-11.md`   |

## 4. What we have learned

Each item is labelled fact (observed in data or stated by David) or inference (our read, with confidence). Sample sizes are 25 per arm; treat any arm comparison as directional until C6 intervals say otherwise.

### 4.1 Reach

- **Fact.** MCS-150 phones reach people. 46/50 dialable, 31/50 live human on pass one, ~13 owner or family. David: "very good."
- **Fact.** Mobile numbers reach owners; office lines reach secretaries. 11 of 36 mobiles reached the owner; 1 of 14 office lines did. Secretaries said "we don't finance" or hung up.
- **Fact.** Carrier validity does not discriminate (551/552 valid across the pool). CNAM match did not predict reach on 50 rows. Neither is a quality signal; keep line type only as a routing hint (mobile first).
- **Fact.** Two of 50 dials were screened by iPhone call screening. This will grow.
- **Inference, high.** Verification before dialing is worth ~$0.02/row and nothing more. Do not build further phone-quality features.

### 4.2 The lien overlay

- **Fact.** LIEN vs NOLIEN did not change phone outcomes: 4 vs 5 positives, 9 vs 10 dead.
- **Fact.** The three "we pay cash" answers were all NOLIEN. David: many who say cash have borrowed before, so a NOLIEN cash claim is corroborated by the absence of a filing; a LIEN cash claim would not be.
- **Fact.** 5 of 7 CRM hits and both active leads were LIEN. Lien companies are the market PCF already works.
- **Fact (David, underwriting).** Borrowing experience is critical to approval. Without it deals are harder to approve or much smaller. **This makes LIEN a requirement, not an arm.** The reach test could not see this because it measured conversations, not approvals.
- **Fact.** The one row with timing intent (JC Concrete Pumping: boom truck paying off in October, wants more in six months) was LIEN, Stearns Bank EF, filed 02/2025.
- **Inference, high.** UCC coverage is now a hard dependency for every state we work. Without it we cannot select for borrowing experience, cannot screen captives and banks, and cannot build the timing hook. Alek's Ohio list is the right shape by construction (lender-first from the UCC index).

### 4.3 The box

Consolidated from 09-03, 09-05 and 09-09. These are David's rules; the pipeline enforces them.

| Rule | Source | Pipeline state |
|---|---|---|
| Fleet 2 to 7 power units; > 7 means headcount > 15, a CFO-type, $15MM+ revenue, reach drops sharply | 09-05 | enforced (`UNITS_MAX = 7`); `drivers > 15` now flagged on OH |
| Single asset for 5+ years is not ICP: statistically an owner-operator who has run one machine for years is not going to grow | 09-09 | **not enforced.** Needs fleet-over-time (see 6.2) and a `single_asset_stale` flag |
| Prior borrowing from an OEM captive reduces probability substantially, worse if repeated: Komatsu, John Deere C&F, Caterpillar Financial, Kubota Credit, Toyota Industries, Volvo, Daimler | 09-05 | enforced (`CAPTIVE` regex, plus CNH, Paccar, Bobcat, etc.) |
| Banks and credit unions out (our rule: a bank borrower has a cheaper option) | 09-07 | enforced (`BANKLIKE`, with `EF_HOUSE` exceptions for Stearns, GreatAmerica, Western EF, LEAF) |
| Borrowing experience required | 09-09 | **not enforced.** NOLIEN arm to be dropped from call batches |
| Construction, farming, freight/transportation are the box; "mostly" | 09-05 | lanes A_DIRT, A_VAC, B, C |
| Freight delivery and general trucking is "pretty much dead"; target specialized highway vehicles and specialty trade trucks (bucket, crane, vac, concrete pump, roll-off) | 09-09 | **not enforced.** Lane B (hauling, trucking, sod, aggregate) to be cut to specialty only |
| Yellow iron (backhoes, dozers, excavators) is the other half of the box and FMCSA cannot see it | 09-09 | **no anchor exists yet** (see 6.1) |
| No calls 11:00 to 14:00 prospect-local; Central time zone lets him work the map | 09-09 | next list: Central state |

### 4.4 Personas and lanes

- **Fact.** A_VAC (septic, grease, porta-john, hydrovac) was the friendliest lane: 4 positive / 4 dead of 14. C (towing, waste) the worst: 6 dead of 10. Trucking and hauling produced most owner hang-ups. Consistent with David's "general trucking is dead."
- **Fact.** The FMCSA `construct` cargo flag means *hauls construction materials*. It tags supply houses, electricians and ironworks as dirt contractors. An explicit trade name beats cargo flags; cargo flags beat a generic name. This rule cost us rows in batch 1 and is the reason A_DIRT needs a second evidence class.
- **Fact (Ohio).** Lender-first selection pulls in every business that financed anything and owns a truck: cabinet shops, machining, a creamery. 15 of 50 out of box, 7 unclear. Lender-first needs an asset or trade filter on top; ICP-first needs UCC on top. The pool is the intersection.

### 4.5 The pitch

- **Fact.** 8 of 19 dead rows hung up at "financing" or "Providence," before any specific was said. David offers "promo rates" as the opener.
- **Fact.** David sends a personalised follow-up email ("thanks for your time, next steps") after live conversations, and marked Email as next action on 5 rows including hang-ups.
- **Inference, medium.** An opener that names the asset and the lender ("your Stearns lease on the boom truck from February 2025") would survive the two-second test better than a rate. Untested. This is copy arm B in the email plan and is also worth testing on the phone.

### 4.6 What the contact vendors got right

- **Fact (David).** Apollo, ZoomInfo and the others "had better intent signals, but they could not identify the right ICP." Our data is verified but has no intent yet. "We need several more rounds to get closer to the right ICP AND how to reach them."
- **Inference, high.** The product is intent inside a verified pool. Neither half alone clears the bar. The vendors have intent without identity; we have identity without intent. Section 6.3 is the plan for the missing half.

### 4.7 Process

- **Fact.** Reading 10+ finished rows in full caught 5 of 7 batch-1 defects that no aggregate check could see, and 3 CNAM scoring errors, and 5 Ohio fit-flag errors. It stays a gate.
- **Fact.** Three-state booleans matter: the trial Twilio account's 429s were recorded as "invalid" and cost 317 rows.
- **Fact.** David grades in his own format (colours, abbreviations, comments). We score his sheet into our taxonomy after the fact. He said on 09-09 "we may need a better tracking system than reading the comments." See 6.5.

### 4.8 Ohio verdicts (09-10): the box filter works, lender-first does not

Facts from `out/verdicts/david_oh_2026-09-10.csv` (David called all 50 on 09-10; his email: "more reds and yellows than FL… our biggest challenge is the intent data and refining the ICP"):

| | FL v2 (ICP-first) | Ohio (lender-first) |
|---|---|---|
| human reached | 31/50 | 27/50 |
| decision-maker reached | ~13 | 9 |
| positive (maybe/follow-up) | 9 | 5 |
| dead | 19 | 18 |
| unreachable | 4 | 5 |
| existing lead / CRM hit | 2 / 7 | 2 / 8 |
| says cash buyer | 3 | 1 |
| hung up | 8 | 5 |

- **`fit_flag` predicted the outcome.** The 23 clean rows produced all 5 positives and 6 dead; the 27 flagged rows (15 out-of-box, 7 unclear equipment, 4 filed <6 mo, 5 lapsed) produced 0 positives and 12 dead. David's own comments on the flagged rows match our flags row for row (cabinets, creamery, imaging, carpentry, welding, "very large company"). Inference, high confidence: a hand-read box filter is worth more than any lien signal we hold. Enforce it before the batch ships, not as a legend.
- **Lender-first sourcing is not a second path on its own.** Pulling by EF-independent secured party produced a list that was 54% off-box. The lender tells you they borrow; it says nothing about what they do. Lender-first only works as an overlay on an operating anchor, which is the co-anchor design in §6.1.
- **8/50 were already in PCF's CRM** (LP/GM columns), 7 of them on Blue Bridge / LEAF / North Mill / Western paper: exactly the §6.6 funder-panel problem. Three were "purchased lead 2025" with wrong contact data in PCF's copy and right data in ours. Two were DO NOT CALL active leads. Dedupe before the batch is now mandatory (TODO §1d).
- **Reach held on a lender-first list**: mobile 9/25, VoIP 10/18, landline 5/6 human. Landlines reach a person and that person is a gatekeeper (5/6 landline outcomes dead at the desk). Owner reach on mobile was lower than FL (FL 11/36 owner on mobile) because 16 of 25 mobiles went to voicemail; David dialled during Eastern windows for an Eastern list, so this is not the time-zone effect.
- **Lien age said nothing** at n=50: positives at <12 mo 1/9, 12–36 mo 2/22, 36+ 2/19. Consistent with E1 being unrunnable at this size and corpus.
- **"Offered promo rates" is the pitch on 21 of 50 rows**, mostly to voicemail. Nothing in the Ohio comments suggests a callback to a promo voicemail. E2 (asset-and-lender opener) is still the untested lever.
- **David's read ("intent data and refining the ICP") is half right.** The Ohio dead pile is an ICP failure we could have prevented (flagged rows), not an intent failure. Intent is the problem on the *clean* rows: 23 in-box companies, 5 mildly positive, 0 applications, which is the same shape as FL. Two experiments, not one: enforce the box (solved, cheap) and find timing (E9/E10, open).

### 4.9 David's reply to the follow-up (09-11): the baseline is a rep-capacity problem

Facts: he corrected "1 application per 500" to 1 *funded* per 500 contacts; 500 contacts takes him 3 days (~170 contacts/day at 200 dials); most reps make ≤50 calls/day and 80% of those are on existing deals and customers; "we need to move the baseline up quickly to make this a viable project"; 25-5-1 agreed; he has started the case-study legwork; PCF is the only entity he knows that holds its own paper, and he will argue on the next call why ICP prefers PCF over going direct; he wants Texas added (one of PCF's best revenue states); offered to send preferred domain names.

- **The baseline only works with a dedicated dialler.** At 2% apps and 10% funded, one rep-day of 170 contacts is worth ~$3.4K to PCF; David can do that, no rep will (10 cold calls/day is the real budget). So the list must produce at 10 calls/day, i.e. 25-5-1 or better, or the channel has to be inbound-shaped (email replies, vendor inbound). This is the strongest argument yet for the email engine being the product, with calls as the R&D instrument.
- **Where we stand against the baseline:** ~73 live contacts (FL 31, OH 27, WI ~15), 0 applications, but 5 warm callbacks now scheduled (WI: Jan/March/next-year). Baseline predicts ~1.5 apps (Poisson p(0) ≈ 0.22). Not disconfirmed yet, but tightening. WI also showed the *contact* count is soft: a mobile-heavy list connects at ~30% vs ~55–62% for FL/OH, so "150 contacts" as the disconfirm line should be counted as connected conversations, not dials. Watch whether the warm callbacks convert before calling the lists below baseline.
- **"PCF is the only paper-holder I know" empties the best lien class** (§6.6). Broker-held paper is not a findable class in practice; the secured-party column reduces to "which funder," which cannot tell direct from brokered. `lender_role` drops to low priority; his "why prefer PCF over direct" argument is the input that decides whether funder names matter at all.
- **Texas.** He wants it; it is where PCF's revenue is, so the case-study 50 is probably TX-heavy, and the case-study calibration needs UCC where the deals are. Simon/Alek hold the $1.5K until the current data confirms the direction; the risk with that rule is that FL (young-filings slice) and OH/WI (hand-pulled) may not be able to produce the confirmation. Decision input requested from David: TX share of the case-study 50.
- **Template** (`david-data-template.xlsx`, his file, saved to the folder root): sheet `Data` has 19 columns — Company, DBA, LP, GM, Last Contact, SIC Code, Industry, TIB, Name, Job Title, Phone, Phone II, Website, Email, Comments, Noise Level, Time Zone, City, State. He fills LP / GM / Last Contact / SIC / Comments. A second sheet `Compare` holds his own working formulas against `Data` (one ref broken) — his view, we leave it alone. Unknowns: "Noise Level" (still open); LP / GM confirmed by the WI return as CRM-presence flags — both go "Yes" only on rows already in PCF's system (5/50), so they are his dedupe signal, exact wording TBD. **This is the batch schema from WI on**: his 19 columns first in his order, our columns after (line type, phone valid, CNAM, lender, filing date, lien age/status, fleet size, `fit_flag`, `alek_signal`, `lender_note`). Time Zone written as the abbreviation (`CST`), no `call_window` column (David: useless).

### 4.10 Wisconsin verdicts (09-14): the box is fixed, the hard-flag cut does not transfer, and reach is the ceiling

Facts from `out/verdicts/david_wi_2026-09-14.csv` (David called all 50; `scripts/c5h_wi_verdicts.py` scores his sheet and joins our flags). He graded on the Comments cell this time, not the row: green fill = open door (3), blue = follow-up/timing (2), yellow ± red font = dead (12), light fill on the LP/GM cluster = existing/CRM (5), grey on Name/Title = "info not provided, I added it." Net-new (excl. 5 existing): ~15/50 reached a human, ~10 the owner, **3 green + 2 blue = 5 open doors, 12 dead, 28 voicemail/no-contact, 0 applications yet** (the opens are callbacks: Delsart "$240K screener next year," Smart Cut "callback Jan," Tree Fellas "callback March," Captain Commodes "call next week," PUSH "ask for the CFO").

- **The ICP miss is solved.** Zero out-of-box rows this batch (Ohio had 15). Alek pre-filtered to lane-pure specialty trucks, so every dead is a *timing / reach / reflex* dead, not a wrong-industry dead. The cheap experiment from §4.8 (enforce the box) worked; David's post-Ohio "refine the ICP" is addressed.
- **Correction to the Ohio hard-flag rule (§4.8, §6.4).** Ohio said "flags predict outcome, cut the hard ones." WI does not replicate that, and the honest re-read is that in Ohio the *out-of-box* flag did nearly all the predictive work — with the box pre-fixed, the remaining flags are weak. Worse, two of the five open doors sit on **hard-flagged** rows: PUSH (bank_lien, 8 units) and **Delsart (filed <6 mo, 10 units) — the single most concrete buying signal in the batch**. Cutting hard flags would have deleted our best lead. Two components of the Ohio cut are now wrong: **fleet > 7 does not transfer to specialty lanes** (8–10 trucks is a healthy septic/tree operator, not a freight fleet; it was calibrated on Ohio's general-freight mix), and **bank_lien did not predict dead** (6 rows: 1 dead, 1 open, 4 voicemail). Revision in §6.4.
- **filed < 6 mo is the strongest negative — and it is a soft flag we chose to keep.** 15 rows: 5 dead, only 1 open. The mechanism is visible in the comments: a company that *just* financed has no near-term need and rejects the pitch reflexively ("hanged up when he heard financing" — Reon's, Badger, Northwoods, Bucklin's). Fresh liens are the *worst* time to call, not neutral. Move filed < 6 mo to a timing hold (call at renewal, not now).
- **First (weak, n=7) support for a renewal window — but Alek's tag is on the wrong clock.** By raw lien age: fresh < 6 mo → 1 open/5 dead (worst), 6–24 → 2 open, **24–48 → 2 open of 7 (best rate)**, 48+ and lapsed → 0 open. The maturing-lien band outperforms. Yet Alek's `renewal_window` tag (0 open / 19) and `lapsing_12m` (0 open / 10) caught none of it, because they key on **UCC-term lapse (~48–60 mo since filing = the cold end)**, not equipment maturity (~24–48 mo since acquisition). Inferred, medium confidence: the intent clock is measuring lapse when it should measure age. This matters directly for the pending FL 100 intent test — fix before reading it.
- **Reach is the ceiling and this list exposed it.** Only ~15/50 connected to a human (FL 31/50, OH 27/50), because WI was mobile-heavy (30/50 mobile) and **landlines reached 0 humans (6/6 voicemail/main line)** while mobiles reach the owner but ring out or get screened. New structural headwind: **iPhone AI call-screening** now actively intercepts cold calls to mobiles (Kopitzke, Reon's, Badger all "iphone AI screen"). Even a perfect list is capped at the connect rate; at ~30% connect, 50 dials ≈ 15 conversations.
- **The modal rejection is reflexive "no" at the word "financing," from in-box owners.** ~8 of ~15 human contacts rejected on hearing "financing" (Frosch, SW Underground, Metta, Reon's, Badger, Northwoods, CG, Bucklin's-sec). These operators *fit* — they own trucks and carry EF liens, i.e. they have financed. The constraint is the cold-financing channel, not the list. This is the clearest datapoint yet that calls are the R&D instrument and the product is inbound-shaped (email / vendor), consistent with §4.9.
- **CRM/dupe rate holds at ~10%** (5/50; Ohio 8/50). Two are DO NOT CALL funded customers (United Electric, Mr Biffy — 2 deals each), all five on ef-independent paper (Oakmont ×3). Suppression list from David is still the open dependency (TODO §1d).

### 4.11 FL 100 + CO 100 partial verdicts (09-15): the intent layer separates — but only its event half, not lien timing

David returned both sheets **partway through** (before tomorrow's call): FL rows 2–51 = first **50 of 100**, CO rows 2–29 = first **28 of 99**. Scored via `scripts/c5j_verdicts.py` into `out/verdicts/david_{fl,co}_partial_2026-09-15.csv`, joined to the internal files that still carry `alek_signal` / `fit_flag` / lien age (FL's David copy was blind). Colour scheme = the WI scheme on a different theme palette (green/theme6 = positive, blue/theme3 = follow-up, yellow = dead, red fill/font = hard dead, theme5 = existing lead, theme9 = **funded** customer).

- **The event tags predict; lien timing does not.** FL among the **13 rows David reached a live human**: **HOT** (Alek's event signals — EXPANSION / HIRE_OPS / NEW_DOT / CONTRACT_AWARD) went 2 reached / **0 dead** (1 open + 1 callback); **WARM** (lien-timing-only — LIEN_MATURING / LIEN_LAPSED, 80% of the list) went 11 reached / **11 dead**. Complete separation. HOT also held the batch's **only open** (Accurate Transport, "OK with a callback in a couple months") and **both real CRM hits** — the HOT detector is finding genuine prospects, some already David's. HOT-reached n is only 2, so "HOT is good" is a **hypothesis to confirm at n**; "a human on a lien-timing row = dead" is 11/11 and firm.
- **The 24–48mo warm band did NOT replicate from WI (§4.10).** Raw FL dead rate: 24–48mo = 5/13 (**38%**), 48+ = 14/35 (**40%**) — no separation. Alek's maturing-vs-lapsed tokens: 9 vs 11 dead — flat. **This retires the intent-clock fix as the answer.** Even on the correct clock (filing age 24–48mo), lien age doesn't move the outcome; the business *event* does. Reframe the Alek ask from "switch renewal_window from lapse-date to filing-age" to "**drop lien-timing as a ranking signal; select the next batch on events.**"
- **Reach: `human_reached` is the wrong target, `owner_reached` is the metric.** FL fixedVoip (office lines) reached 6/12 (50%) but that's a *gatekeeper* who kills the call; mobile reached only 5/26 (19%) but reaches the *owner* when it connects — and is increasingly **AI-screened** (David logged "AI Assistant screened" on live mobile rows). The reach ceiling is now AI screening, not landlines. Opposite channel result to WI; the unifying rule is owner-vs-gatekeeper, not line type.
- **CO can't test intent (signal uniform) but exposed a 21% CRM-overlap.** Of 28 called, **6 were David's existing/funded customers** (GBC Concrete funded 4 deals) — 21%, up from WI's 10%. **His CRM suppression list is now the highest-ROI ask** (§ TODO 1d): it's ~1 in 5 dials, not housekeeping. CO's existing customers also cluster in the 24–48mo lien band, which partly *inflated* that band's apparent quality in WI — a leakage caution.
- **Two data defects, both on Alek's export.** FL-100 shipped **4 duplicate company pairs** (Trash Taxi, Venice Wrecker, Stan's Pro Tows, Tri J.); a CO row shipped with "LYES" smudged onto the company name (`Lucas Construction Concrete LYES`). Add a dedup + name-hygiene pass before the next list.
- **Base-rate reality for the call.** Hard cold list (FL 20/50 dead, 1 soft-open, 0 apps) — normal for cold specialty outbound, and the argument *for* event-targeting: the ~20% of the list with a real event is the only place yield appeared. Frame David's read as "make the next list all-HOT," not "the list failed." Both sheets are partials; David finishing them firms up the thin HOT-reached n.

## 5. Current experiment status

| Experiment | State | Rows | Reads |
|---|---|---|---|
| FL batch 1 (30/10/10 arms) | superseded, never dialled | 50 | design flaws: confounded phone provenance, arms too small |
| FL v2 (LIEN vs NOLIEN) | **verdicts in** | 50 | 4.1–4.5 above; awaiting C6 intervals; awaiting David's CRM hit list back |
| Ohio 50 (lender-first, all LIEN) | **verdicts in 09-10** (`out/verdicts/david_oh_2026-09-10.csv`) | 50 | 27/50 human, 9 decision-makers, 5 positives (3 maybe-later, 2 follow-up), 18 dead, 8 CRM hits; **all 5 positives on `fit_flag`-clean rows, 0 on the 27 flagged**; see §4.8 |
| Wisconsin 50 (lender-first, Central) | **verdicts in 09-14** (`out/verdicts/david_wi_2026-09-14.csv`, `scripts/c5h_wi_verdicts.py`) | 50 | ~15/50 human, ~10 owner, 3 green + 2 blue (5 open doors, all callbacks), 12 dead, 28 voicemail, 5 CRM; **0 out-of-box (box fixed); hard-flag cut refuted — 2 opens on hard rows incl. best lead; filed<6mo worst; 24–48mo lien band best; reach the ceiling (mobile-heavy, iPhone AI-screening)**; see §4.10 |
| **FL 100 (intent-ranked, blind)** | **partial verdicts in 09-15** (first 50 called; `out/verdicts/david_fl_partial_2026-09-15.csv`, `scripts/c5j_verdicts.py`) | 100 | **first batch with a real intent layer.** All specialty lanes, fleets 2–7, EST. **Result (§4.11): HOT event tags separate — 0 dead of the HOT rows reached; WARM lien-timing 11/11 dead reached. 24–48mo warm band did NOT replicate. Retires the intent-clock fix; next batch selects on events, not lien age.** 20 dead / 1 open / 2 CRM / 27 voicemail; 4 dup pairs in Alek's export |
| **CO 100 (Mountain, WI-style)** | **partial verdicts in 09-15** (first 28 called; `out/verdicts/david_co_partial_2026-09-15.csv`, `scripts/c5j_verdicts.py`) | 100 | Mountain-time list; signal uniform → **does not test intent.** **Result (§4.11): 21% CRM-overlap (6/28 David's own/funded customers) — makes the suppression-list ask top priority; 9 dead / 2 follow-up / 11 voicemail.** Wireless out-reached landline here (4/14 vs 1/10). Name-hygiene defect ("LYES" smudge) on Alek's export |
| Email channel | domains provisioned 09-10 (providence-[state]), warming | 0 | blocked on brand decision (see email plan) |

## 6. Best system design as we now understand it

The 09-03 design was anchor → overlay → verify → enrich, with FMCSA as the anchor and UCC as an optional overlay. After 09-09 the shape is different: **UCC and the operating registry are co-anchors, intersected**, and the intent layer is the work.

```
                 ┌──────────────────────────────┐
  UCC index      │  who borrowed, from whom,     │
  (per state)  ─▶│  for what asset, when         │──┐
                 └──────────────────────────────┘  │
                                                    ├─▶ intersect ─▶ verify alive + owner ─▶ phone/email ─▶ INTENT ─▶ batch ─▶ David ─▶ verdicts ─▶ features
                 ┌──────────────────────────────┐  │                (SOS registry)         (MCS-150,       (6.3)                              (labels)
  Operating      │  does it run the equipment,  │──┘                                        Twilio,
  registry     ─▶│  how many, since when,       │                                           verifier)
  (asset class)  │  phone, email, officer        │
                 └──────────────────────────────┘
```

### 6.1 Anchors by asset class

| Asset class | David's view | Operating registry | Status |
|---|---|---|---|
| Specialty trade trucks: vac, septic, grease, hydrovac, concrete pump, crane, bucket, roll-off, tow, tree-service bucket/grapple | in the box; these are FMCSA-registered | FMCSA census (cargo flags + name + MCS-150) | working; A_VAC best lane. WI adds tree services (B_AERIAL bucket, B_CRANE knuckleboom) as a large new specialty lane — high-ticket trucks ($80–300K), untested with David |
| Yellow iron: excavators, dozers, backhoes, loaders, skid steers | in the box; FMCSA cannot see them | **none today.** Candidates: UCC collateral text (the filing names the machine), state contractor licences (FL DBPR worked; OH has none statewide), building permits, dealer/auction records, OSHA, state DOT prequalified contractor lists | to build; first pass is collateral parsing because we already hold the filings |
| Farm | in the box | UCC collateral; USDA/FSA is not public at entity level; FMCSA for farm trucks only | weak; farm rows came via FMCSA and were noise |
| General freight, dry van, hauling | "pretty much dead" | FMCSA | **drop from call batches** |

### 6.2 Data infrastructure the design now requires

| Piece | Why | State | Next |
|---|---|---|---|
| UCC per working state | borrowing experience is required; captive/bank screen; timing | FL, CO, CT in prod; **the old `ucc_fl.csv` was a young-filings slice, but Alek's `florida-ucc-full.csv` pull (used for the FL 100, 2026-09-14) has real depth — filing years 2019–2026, 28% of rows 60+ months old** — so E1 (lien-age) is runnable on FL again; OH and WI by hand via SOS/DFI search (Alek) — neither at bulk scale, both capped at ~50 rows/day of his time | **Texas next** (David's ask; a top PCF revenue state): TX SOS sells bulk UCC for ~$1.5K. Decision rule (09-11): buy after the case-study 50 shows TX share and the flags confirm direction, not before. Risk in that rule: FL (young slice) and OH/WI (hand-pulled) may not produce a clean confirmation, so the TX buy may have to be made on partial evidence. IL, MN, WI, MO have bulk or search access for later |
| UCC collateral text | the only public record that names yellow iron | not parsed; Alek's OH run reviewed some images by hand | parse collateral descriptions → asset class, make, model, count. Feeds 6.1 and 6.3 |
| FMCSA monthly snapshots | fleet growth over time; single-asset-stale rule; new units = intent | none retained; one pull per state | start retaining dated pulls now. Two snapshots give `fmcsa_fleet_delta` |
| Lender window model | timing hook; "renewal window" | prod `dueness` model, median gap per lender | keep; label honestly ("inside the typical refinance window"); add lien lapse/termination as its own signal |
| SOS registry per state | alive, officer, age | FL Sunbiz full file; OH none used | per-state adapter; OH SOS business search is per-name, no bulk without purchase |
| Suppression | PCF's two CRMs, prod touches, David's April list, Alek's campaigns | partial | David to return CRM hits per batch; one table |
| Verdict ingest | labels | manual scoring of his xlsx | 6.5 |

### 6.3 The intent layer (the missing half)

Two strategies, run side by side. 6.3a annotates companies we already hold; 6.3b discovers companies and dates from feeds. Results of 6.3a's first run: `out/SIGNAL_SEARCH_REPORT_2026-09-10.md`.

#### 6.3a Strategy 1: entity-first (lookup)

**Calibrate before crawling.** David offered the calibration set: 50 repeat customers (8+ deals each) with the vendor that sent each deal. Before building any signal at scale, run every candidate signal family against those 50 and against 50 random pool rows, and keep only the families that appear *before* the deals. He built his ICP this way ("11 things in common"); we do the same with data he can't see.

*Pre-case-study calibration ran 2026-09-10* (`out/SIGNAL_SEARCH_REPORT_2026-09-10.md`, `RUNBOOK_ENTITY_SEARCH.md`) on FL v2 / control / OH. Finding: entity search yields real intent (procurement/hiring/grant-capex) for construction/excavation/manufacturing, ~0 for FL vac/septic/tow; 16 of 21 intent hits were OH (lender-first). Procurement is the only family that fired. So: gate procurement to yellow-iron/industrial lanes, scrape gov listings (county rosters, state grant/loan reports) first, and rely on UCC-native signals for the service-truck segment. Re-run on the case-study 50 when it arrives — that is the winners-vs-dead test these cohorts could not provide.

**Entity-first, not source-first.** The long tail of local sources (county engineer bid lists, plan-holder lists, municipal minutes, permits, local news, job posts) is real and it is where yellow-iron intent lives; the Union County logjam bidders list in Alek's Ohio run is the pattern. Crawling every county site is a haystack. Searching for the names we already hold is a lookup. Sequence:
1. Take the names (case-study 50, then the ranked pool) and run each through a web search API (Exa is already in `.env`) with company + city + county. ~$0.01 per query; the whole FL eligible pool is ~$1K, the top 5K rows is $50.
2. Classify every hit into a signal family (below) with the date on the page. Store the hit, the family, the date, the source domain.
3. Count which *source domains* recur. Those (expect 20–50 per state: county engineers, DOT lettings, health-department permit portals, bid aggregators) get a real scraper. The rest stay lookup-only.
4. Pick one state and one county cluster to validate before scaling: FL, the counties where the case-study winners sit.

**Signal families, ordered by how soon each can run and what it says.**

| Family | What it says | Source | Asset class | Readiness |
|---|---|---|---|---|
| Lien age, lapse, termination | loan paid or near; machine aging; capacity to borrow | UCC we hold (FL/CO/CT/OH) | all | now |
| Competitor filing, recent, non-captive, non-direct-funder | in-market, bankable, pays broker rates | UCC | all | now, once secured parties are classed (6.6) |
| Fleet delta | bought units; growing | FMCSA snapshots (start retaining) | trucks | 30 days after first snapshot |
| Public procurement: bidders lists, plan holders, awards, prequalification | has work coming; needs iron | county/city/state DOT sites, bid aggregators | yellow iron, specialty | entity-search first, then scrapers |
| Permits: building, ROW, septic installer, well | active jobs | county portals; FL DOH septic permits list the contractor | dirt, vac | entity-search first |
| Hiring: CDL, operator, mechanic | growing | Indeed, Craigslist, state job banks | all | entity-search |
| Collateral year-model | machine due for replacement | UCC collateral text (parse) | all | 1–2 weeks |
| Local news | expansion, new yard, contract won | entity-search | all | cheap, low coverage |
| Reply text | the person said it | email pipeline | all | after first sends |
| Vendor-side: dealer sold listings, auction lots | bought or selling | dealer sites, Ritchie/IronPlanet | all | later; politically delicate for PCF |

**SIC on the equipment, not the business (David).** A one-truck septic pumper and a $700K industrial vac operator share a SIC. The asset class and its value tier have to be inferred: collateral text (make, model, year → value tier), fleet composition, cargo flags, website language, drivers-per-unit. This is a feature, `asset_tier`, not a filter, until verdicts say otherwise.

**What the first run showed (2026-09-10, 150 companies).** 21 real intent hits, 16 of them Ohio; zero on any FL vac/septic/tow row, positive or dead. Name precision 81%, every miss a generic or bare-person name. No source domain recurred. Read: entity-first annotates construction and industrial companies and finds nothing for service-truck operators; it cannot discover companies it was not given; at 150 rows it does not find feeds either. Its remaining job is feed-type discovery at pool scale (~$20 on the 640 rows, harvest domains, ignore per-company signals) and per-company annotation on yellow-iron rows.

#### 6.3b Strategy 2: signal feeds (discovery)

Entity-first has a ceiling: it annotates the pool and the pool is the universe. Strategy 2 inverts the pipeline. **Feeds discover names and carry the date; registries verify; UCC gates for borrowing experience; David closes.** A feed is a public source that continuously emits company names doing work: bid tabulations, plan-holder lists, permits, tow rotations, grant reports. Finding a feed is a one-time search; once found it is a static, scrapable signal engine.

What this fixes: (1) the yellow-iron anchor that §6.1 lists as "none today"; a county bid tabulation sees the excavator FMCSA cannot. (2) Timing: a bid, award or permit has a date; lien age only estimates one. (3) Discovery of companies not yet in FMCSA. It does not escape UCC: a feed-discovered name still needs a filing to clear David's borrowing-experience rule, and the UCC join is a lookup we already do.

The haystack is smaller than "long tail" suggests. Local sources run on a small number of platforms, and the platform is the feed:

| Feed type | Emits | Lane | Aggregation layer | Freshness |
|---|---|---|---|---|
| Municipal/county procurement: plan-holder lists, bid tabs, awards | every contractor that viewed or bid a job, with date and job type | yellow iron, site work, utility | DemandStar, BidNet, Bonfire, OpenGov, PlanetBids, Periscope; FL and OH agencies cluster on 3–4 | daily |
| State DOT lettings; prequalified contractor lists | bidders per letting; prequal by work class | dirt, paving, utility | one site per state | weekly |
| Septic (OSTDS) permits | installer per permit per county per month = activity volume | A_VAC installers | FL DEP county portals; OH county health depts | monthly |
| Sheriff / police tow rotation lists | wreckers by class incl. heavy-duty | C | per county PDFs, enumerable | quarterly |
| Building / ROW permits | contractor of record | dirt, concrete | Accela, Tyler EnerGov, CityView portals | daily |
| State grant/loan reports, EDC announcements | capex with names | all | one per state | monthly |
| Job posts: CDL, operator, mechanic | growing | all | Indeed as one feed | daily |
| UCC filings and terminations | in-market / paid off | all | held; run as a batch today | daily |
| Local news | one-offs | all | not a feed; lookup only | — |

Discovery method: enumerate by category (above), not by crawling. Per category: find the platform vendors; pull one month from one FL county and one OH county; check that it names companies joinably (legal name + city), carries a date, and joins to UCC/FMCSA at a non-zero rate. If yes, build the scraper for the platform, which then covers every agency on it. Predictive value is tested against David's case-study 50 (do they appear in a feed before their deals) and against verdicts. Runbook: `runbook_signal_feeds.md`. Experiment: E9.

**E9 first run — 2026-09-10** (`out/SIGNAL_FEEDS_REPORT_2026-09-10.md`). Four feeds fully pulled/joined/scored: FL county procurement (Orange County), FL DOT lettings (FDOT), FL septic permits (DOH OSTDS all-67-county Caspio app), OH state grants (JobsOhio). **Finding: feeds are a strong timing overlay on the pool, not a discovery engine.** All four join and date near-perfectly, but of resolved companies 74/87 (procurement), 119/127 (DOT), 16/16 (septic) are already in `FL_POOL_v1`, and only 2 / 18 / 0 respectively carry a non-captive/non-bank EF lien in our UCC corpus — David's borrowing gate. DOT lettings are ~96% large GCs (only 4 of 127 fleet-verified 2–7). So **feed-first does not replace pool-first for yellow iron**; the yellow-iron anchor gap (§6.1) is better closed by UCC collateral parsing (E6). *Key open question (§3 of report):* the low UCC-positive may be our thin EF-UCC corpus rather than reality — the case-study 50, when it arrives, is the test that decides timing-tool vs discovery-tool (`scripts/feeds_calibration.py`, ready). **Decision:** build FDOT + OSTDS scrapers as timing signals joined onto the pool (a per-row "bidding/permitting now + date" rank column, no composite); park the procurement scraper pending the UCC-coverage test. OH pulled UCC-blind (no local registry at scale) — F6 partial; F1/F2/F3 OH viability-noted only.

**Review of the E9 run (same day, Simon + Claude).** The §3 caveat is not open: it is confirmed by the corpus itself. `data/raw/ucc_fl.csv` filing years: 2022 → 2,110; 2023 → 8,221; 2024 → 8,914; 2025 → 32,799; 2026 → 15,059 (74% of rows are `young_filings`). Florida files far more EF liens per year than that, so 2022–2024, the years whose liens are now 2–4 years old and therefore ripe, are covered at roughly a quarter of 2025's rate. Reading B is the working assumption: the UCC-positive gate undercounts by construction, in feeds and in every earlier batch. Consequences: (1) the v2 NOLIEN arm meant "no lien in our slice," not "never financed"; (2) E1 (lien-age strata) cannot run on this corpus; (3) the "already in pool" numbers stand, the "UCC-positive" numbers do not; (4) full FL UCC coverage back to 2020, including UCC-3 terminations, moves to the top of §6.2 ahead of any new state. Feeds also showed a third role beyond timing and discovery: **operating evidence** (a permit pulled this month proves the company is alive and working, which fixed `no_sunbiz_match` rows). Priority revised: OSTDS scraper first (verify + timing on the best lane, 67 counties in one app); procurement aggregator (DemandStar) second once UCC is backfilled, since it is the only feed with real discovery (11 new, 17 fleet-in-box); FDOT third (4 in-box of 127; timing on rows outside the box is worth little).

Caveat: feeds emit incumbents too; the $50M GC sits on the plan-holder list beside the 4-truck excavator. The box (fleet, headcount, captive/bank screen) still filters. And David's need-buyer thesis says his borrower does not plan; a bid list is the closest thing to a plan there is, so this is also a test of that thesis.

#### 6.3c Strategy 3: county source census (the long tail)

Strategies 1 and 2 enumerate by platform. Strategy 3 enumerates by geography: for one county, list every local source that names companies doing work (commission minutes, permit portals, non-aggregated bid tabulations with losing bidders, tow rotations, local papers, auction results, chamber and licence lists), LLM-extract every dated company mention, join to pool and UCC, and count what the platforms could not see. The argument for it: the E8 real intent hits came from exactly these sources one at a time; the parsing barrier that made them uneconomic is gone; nobody else (Fusable/EDA included) holds a per-county source registry, so it compounds. The argument against: yield per hour is unknown. Runbook: `runbook_county_census.md`. Experiment: E10, three FL counties (Escambia, Highlands, Suwannee, one v2 septic positive each), four hours each, decision rule pre-set (≥10 in-box dated mentions not reachable via F1–F8 → build the census; else lookup layer). Roles scored separately: discovery, timing, operating evidence. Facebook/Marketplace out of scope.

### 6.4 Selection

- Segment on LIEN only; NOLIEN leaves call batches (may remain in email batches as a cheap arm).
- Lane targets rebalance toward A_VAC and specialty trucks; A_DIRT only with a second evidence class (licence, collateral, permit); B cut to specialty (concrete pump, crane, roll-off); C kept small.
- Fleet floor 2; **no fixed upper cut — the Ohio "fleet > 7" ceiling is retired for specialty lanes** (WI: 8–10-truck septic/tree operators were among the best rows; the ceiling was a general-freight artifact). Keep fleet as a ranked column, not a gate. No captive, not in CRM, not previously touched.
- Rank inside the eligible set by the intent signals in 6.3 as they come online, each shown as its own column. No composite score until verdicts justify one.
- **Two-tier flags, revised on WI (09-14).** Doubt still becomes a column, never a silent cut. But the Ohio-derived hard-flag *cut* (§4.8) did not replicate once the box was pre-fixed, so no flag is an automatic cut yet — the plan to hard-cut from batch 4 is **suspended pending more evidence**:
  - The Ohio result was really the **out-of-box** flag doing the work; with lane-pure lists (WI on) the other flags are weak, and two (fleet > 7, bank_lien) were actively wrong. Enforcing the *box* before ship stays the rule; cutting on the other flags does not.
  - **The one flag that earned a demotion in timing, not a cut: `filed_<6mo`** (WI: 5 dead / 15, worst negative; "just financed, hostile to the pitch"). Route these to a renewal-timing hold (recontact at 24–48 mo), keep in the file, do not dial now.
  - Everything else — single unit, no owner name, CNAM mismatch, bank_lien, lapsed lien, large fleet — stays a labelled column we keep dialling and reading. Re-decide the cut when a flag shows a clean negative at n across two batches.
- Alek's raw carries a `signal_B` / `renewal_window` / `independent_lender` layer (his sourcing rationale); we keep it in a separate `alek_signal` column, not mixed into `fit_flag`. **The FL 100 read (§4.11) resolved this:** lien-timing (maturing *or* lapsed, any clock) does not predict outcome — the WI "24–48mo warm band" did not replicate. The signal that separated was the **event** half of `alek_signal` (EXPANSION / HIRE / NEW_DOT / CONTRACT_AWARD). Action: drop lien-timing from ranking; select on events. (Earlier "fix the intent clock from lapse-date to filing-age" is now moot.)

### 6.5 The verdict loop

**David's template is now the schema** (`david-data-template.xlsx`, §4.9). He fills LP / GM (CRM flags), Last Contact, SIC Code, Comments, plus his highlight colours and abbreviation set (NIS, LVM, LMIG, LMIGMB, LMWS…). We ship his 19 columns first, ours after, and score his returned sheet into our taxonomy: `outcome` (dead / no_decision / maybe_later / followup / existing_lead / unreachable), `human_reached`, `owner_reached`, `says_cash_buyer`, `hung_up`, `ai_screened`, `crm`. Done for v2, OH, and WI. **WI is scored by script now** (`scripts/c5h_wi_verdicts.py`) instead of by hand — his grading moved onto the Comments-cell fill (green/blue/yellow) plus the LP/GM cluster, which reads reliably from openpyxl; the script also joins our flags for the outcome-vs-flag read. FL 100 will reuse it.

Next step: keep his columns, add three dropdowns (`outcome`, `reached`, `next_action`) and one free-text `why` so we ingest without hand-reading. He said on 09-09 he'll want "a better tracking system than reading the comments"; he runs Claude Enterprise and offered to send a blank sheet. Later this becomes a form or a Tokenrip surface (§14), and the same schema receives email replies. Do not let the platform delay a batch; the spreadsheet holds until it breaks (>500 rows).

The loop closes when a verdict changes a feature weight or a rule, and that change is visible in the next batch. Today that is manual (this document, `TODO.md`). C6 (Wilson intervals per feature) is the first automated step.

### 6.6 The secured-party problem (new, from the call)

David's inside view: LEAF, North Mill, Western, Blue Bridge are PCF's *own funding sources*. A borrower who went to them direct knows how to go direct; PCF coming in on top adds cost. But a LEAF filing may be a brokered deal that the broker passed through (shows LEAF), or the broker may hold paper (shows the broker's name, e.g. Providence Capital Funding). **The filing cannot tell direct from brokered.**

What this does to our lien classes:

| Secured party class | Read | Action |
|---|---|---|
| OEM captive | subsidised rates, dead | exclude (done) |
| Bank / credit union | cheaper option, dead | exclude (done) |
| Direct funder (LEAF, North Mill, Western, Stearns…) | ambiguous: direct (dead) or brokered (good) | keep, but ask on every call "who did you go through"; Ohio 50 is this test |
| Broker holding paper | already pays broker rates: **best class** | need the names. Ask David for PCF's funder list and any brokers he knows; cluster secured parties in prod by filing count and name pattern (Capital / Funding / Leasing, low volume) |
| Unknown / small lessor | probably broker or small independent | rank up |

This adds a `lender_role` feature (captive / bank / funder / broker / unknown) beside `lender_class`, and a call-script question. The v2 LIEN arm was all "funder" by construction; that is now the class we know least about, not the safest one.

## 7. Experiment queue

Pre-registered where possible. Each names the decision it informs. Sizes assume David dials ~50/day.

| # | Question | Design | Size | Metric | Decides |
|---|---|---|---|---|---|
| E1 | Does lien age predict positive outcome? | Next FL batch, all LIEN, stratified: filed < 12 mo / 12–36 / 36+ or lapsed | 3 × 25 | positive rate; applications | whether timing is the rank |
| E2 | Does an asset-and-lender opener beat "promo rates" on the phone? | David alternates openers by row (we mark which) | 50 + 50 | hang-up rate; conversation length; positive | copy for phone and email |
| E3 | Ohio lender-first vs FL ICP-first | already in flight | 50 vs 50 | positive; out-of-box rate by `fit_flag` | whether lender-first is a legitimate second sourcing path | **done 09-10**: 5 vs 9 positives; 27/50 flagged rows gave 0 positives; lender-first is an overlay, not a path (§4.8) |
| E4 | Does the single-asset-stale rule hold? | flag rows with 1–2 units and TIB > 5 in a batch, do not cut | ~15 flagged | positive rate flagged vs not | whether to enforce |
| E5 | Mobile-first routing | list only mobile MCS-150 numbers for half a batch | 25 vs 25 | owner reach; positive | phone provenance policy |
| E6 | Yellow iron via collateral text | first batch where the anchor is a UCC filing naming an excavator/dozer, verified by SOS + any operating evidence | 50 | in-box rate (his read); positive | whether collateral parsing is the yellow-iron anchor |
| E7 | Email arm A vs B | per email plan, after warmup and brand decision | 200–300 rows, 600 sends per arm | bounce; reply; positive; meeting | whether email is the second touch and which copy |
| E8 | Central-time state | first list in TX (or IL/MN) once UCC is secured | 50 | same as FL; plus David's call-window utilisation | next state and UCC procurement priority |
| E10 | Does the long tail (county-local sources) produce in-box dated mentions the platforms miss? | per `runbook_county_census.md`: 3 FL counties × 4 h, LLM extraction, join, `reachable_via_feed` column | 3 counties | in-box dated mentions not reachable via F1–F8 (≥10 → build); yield/hour; role split | whether a per-county source registry is a build |
| E9 | Do signal feeds discover in-box, UCC-positive companies with dates? | per `runbook_signal_feeds.md`: one month from one FL + one OH county per feed type; join to UCC/FMCSA/pool | 6–8 feeds | join rate; in-box rate; date coverage; case-study hit rate | which feeds become scrapers; whether feed-first replaces pool-first for yellow iron | **first run done 2026-09-10** (`out/SIGNAL_FEEDS_REPORT_2026-09-10.md`): feeds = timing overlay, not discovery; feed-first does NOT replace pool-first; build FDOT+OSTDS scrapers as timing joins; case-study 50 decides timing-vs-discovery |

Run order: E3 done. E9 first run done; E10 runs next (no David dependency). E1, E2 and E4 fit in one FL batch of 75 next week (E2 needs David to agree to alternate). E5 can piggyback on E1. E8 waits on UCC. E6 waits on collateral parsing (one to two weeks). E7 waits on warmup and the brand decision.

## 8. Roadmap

**Now (this week)**
- Meeting 09-10: confirm the bar, LIEN-only, lane cuts, single-asset rule, tracking columns, next state, opener test, brand on email.
- Rebuild FL selection: LIEN only, lane rebalance, lien-age strata, single-asset flag, tracking columns. Ship FL batch 3 (75) by Friday for a Monday dial.
- Ask David for: CRM hits on v2 and OH; his April email copy and numbers; funded deals by state/county/fleet size; which Central state.
- Buy three lookalike domains and start warmup (2–3 week lead time is the only reason to move before the brand decision).
- Start retaining dated FMCSA pulls.
- File the prod issue: `lender_class` populated inconsistently.

**Next (two to four weeks)**
- UCC feed for the next Central state. Procurement, load, normalise into `flpool` alongside FL.
- Collateral text parsing on FL/OH filings → asset class, make, model, year. E6 batch.
- Verdict ingest: schema in the sheet, script that scores without hand-reading, C6 intervals per feature.
- Email v1 per the plan, once the brand decision is made: verifier in C3, suppression table, sequencer API, reply pipeline.
- Ohio verdicts read; decide whether lender-first is a second path.

**Later (one to three months)**
- Intent layer signals 2–6 as data allows; each one an experiment before it becomes a rank.
- Timing-triggered sends (row enters cadence when its window opens) once email is live and UCC coverage is stable.
- Second originator. The moment the loop clears 5% applications for David, the same pool and loop are the product for every EF originator whose box overlaps; David's labels are the moat.
- Scale question David raised ("once we figure that out, we should consider how to scale up"): what scaling means for PCF (more callers? our email engine? both?) and what it means commercially for us.

## 9. Strategy

**What we are selling.** Not lists. A sourcing loop that gets better with every verdict, owned by the originator's own labels. Contact vendors sell identity without fit; signal vendors (EDA/Fusable) sell UCC events without distribution or verification. The intersection with a feedback loop is unoccupied at the small-ticket end.

**Why David.** He underwrites and sells, so his verdicts carry both fit and approvability. He turns 50 rows in a day. He volunteers method ("single asset," "borrowing experience," "general trucking is dead") that no dataset contains. He said on 09-09 the three of us have the right synergy and is already thinking about scale. Protect this relationship over any single batch.

**What we do not do.** No demographic fields, ever. No guessed emails. No LinkedIn-derived vendors. No composite score before verdicts. No silent cuts: doubt becomes a column. Do not share the 12-week plan, the lender-panel build, or lender fee structures with David. His transcript and phrasing stay internal.

**Commercial posture.** Unpriced pilot until the bar is met. The bar is his, which makes the conversation about price straightforward when it is met: 5 applications per 100 calls is a number he can put revenue against. Do not raise price before then.

## 10. Risks and things to keep in mind

- **UCC procurement is the long pole** for every new state, and David wants Central time now. Ohio was possible only because Alek searched the SOS by secured party by hand. That does not scale past 50 rows per day of his time.
- **Small samples.** Everything in §4 rests on 25-row arms. C6 intervals before any rule is hardened beyond what David himself stated.
- **Alek and Simon are building different pipelines.** Ohio came from Alek's machine with its own schema and review notes. One pool, one schema, one suppression table, or the verdict loop fragments.
- **David's time.** He is the only labeller. Every row we send that is out of box spends his goodwill. `fit_flag` was the right call; keep out-of-box rows under 10% of a batch from here.
- **Cash-buyer claims are unreliable** (his words). Do not train on "we pay cash" as a fact about the company; train on the filing.
- **iPhone call screening** will erode mobile reach. Email becomes the first touch sooner than planned if that number climbs.
- **Brand on the email** is unresolved and blocks E7. It is also the first commercial question (whose infrastructure, whose replies).
- **`lender_class` in prod is inconsistent.** Our filters match on name. Anything else that trusts the field will under-count captives.

## 11. Directions worth exploring, not yet scheduled

- **Lien-termination feed as the trigger.** A UCC-3 termination is the cleanest "just paid off" signal in public data. If a state's feed carries terminations with dates, a daily list of terminations against our pool is a near-real-time intent list.
- **Dealer-side.** Equipment dealers know who is shopping. A dealer partnership (or dealer inventory data) is intent at the source; also politically delicate for PCF's own vendor relationships.
- **Auction results.** Ritchie Bros / IronPlanet buyer data is not public, but sold-lot listings by region indicate fleet turnover.
- **Rate environment as a signal.** Captive subsidised rates are the reason captive borrowers are dead; when OEM promos lapse (they cycle quarterly), those borrowers re-enter the market. Track OEM promo calendars.
- **Second-originator overlap.** Pick one other small-ticket EF originator with a similar box and run the same FL pool. Two label sets on one pool tests whether the loop generalises.
- **Row-level "why" for David.** Every row already carries `top_signal_text`. If the opener test (E2) works, the row's why becomes the script.

## 12. Open questions for David (carried)

- TX share of the case-study 50 (decides the $1.5K Texas UCC buy).
- What "Noise Level" means on his template. (LP / GM now read from WI as CRM-presence flags — both filled "Yes" only on the 5 already-in-system rows; still want his exact definitions and, more importantly, his suppression list so we dedupe before ship.)
- ~~Confirm the intent-clock fix~~ **Superseded by the FL 100 read (§4.11): lien age doesn't predict on either clock. New Alek item — drop lien-timing as a ranking signal and select the next batch on business *events* (new DOT, hiring, expansion, contract award), which are the only signals that separated outcomes. Ask Alek for a majority-HOT next list as the cheap confirming test of the (thin, n=2) HOT-reached read.**
- His preferred domain names / states for the next batch of Providence domains.
- Which Central state after Wisconsin, and does PCF lend in all states?
- CRM hit list back for v2, OH, and WI.
- Funded deals by state, county, fleet size, asset class.
- April email copy that ran and its numbers.
- Will he alternate openers for E2?
- Tracking columns: will he fill three dropdowns per row?
- Brand on the email: his name on our domain, or ours?
- What does "scale up" mean to him: more of his dials, our email engine, or more PCF callers?

## 13. Revisions from the 2026-09-10 call

Decisions made:
- Email brand: **Providence-branded domains**, 10–20 by state, warmed two weeks minimum, 5–6 touches, in parallel with calls. Alek's Quintel-domain warmup continues; Providence domains to be registered once David confirms DNS/sender/signature. Resolves the open brand decision in `EMAIL_INFRA_PLAN`.
- Batches: 50–100 rows, iterate off each. David's capacity 200 dials/day. No other PCF reps until the format and ratios are right; R&D only.
- Call windows: 9–11 and 2–3 local; construction 7–8 am. Central-time list needed so his afternoon has somewhere to go.
- Tracking: schema with clickable fields (contact / outcome / hang-up / next action), daily tabulation, reports. He sends a blank sheet; we send the critical-field list. Spreadsheet until it breaks, then a platform. See §14.
- Case study: David sends 50 repeat customers (8+ deals) with vendor per deal; we do legwork; screen-share to find what they share. Two-pronged: end user and vendor.
- Text/SMS: later, TCPA.
- Business model: parked until ratios exist; he wants a real answer in six months at most.

New facts: §2 (economics), §6.6 (secured parties), §6.3 (SIC on equipment). Vendor channel is "the holy grail" and "extremely" hard; PCF's top rep is 99% vendor inbound. Defer, but every case-study row carries the vendor name, so the vendor graph builds itself.

## 14. What this is for Quintel and Tokenrip

- **Quintel.** This lab is the R&D line for the company. Everything the customer said validates the sourcing-first thesis in his own numbers: bought lists convert at 0.05%, identity without intent is worthless, the winners are inbound. The product is the demand machine plus the verdict loop, sold as a share of funded revenue once ratios justify it. The "mounted BDO / order-taker" frame from earlier work is exactly how David described the end state ("five guys sit back, receive incoming traffic, and close").
- **Tokenrip.** The tracking need David described (a shared, schema-controlled workspace where a third party enters verdicts, an agent tabulates daily, reports compound, and nothing is re-keyed) is the collaboration substrate use case with a real customer attached. Build it as the lab's tracking system and the substrate gets its first outside-party workspace as a byproduct: the forward-deployed pattern. Guardrail: v0 is a shared sheet with validation and a script, this week; the Tokenrip surface replaces it when volume (>500 rows) or reporting makes the sheet fail, not before. Do not let the platform delay the pilot.
- **Alek's pipeline and Simon's.** Two pipelines on two machines now feed one labeller. Merge into one schema and one suppression table before the third list.

## 15. Commercial position (internal, 2026-09-10)

Why David raised it: he is positioning himself as a JV partner rather than PCF's rep (1099, other clients, "the three of us" vs "this company," "become the broker yourselves"); he needs Quintel to be paid for the lab to continue; and he is the internal champion who needs defensible terms after PCF's failed data purchases. The Max 50% split is "unpoliceable," not underpriced: PCF keeps the books, 14% of our rows were already in their CRMs, fundings lag by months, and we cannot see fundings.

The arithmetic per 100 live contacts: per-lead at market ≈ $500; 50% rev share ≈ $1,000 at the 2%/10% floor and ≈ $20,000 at owner ratios. Rev share dominates above the floor if attribution is verifiable and we accept their execution risk.

Position: rev share as the structure, with attribution engineered in rather than negotiated: Providence-branded email on Quintel domains (replies land with us), CRM dedupe delivered before each batch, a written "attributed deal" definition (our row, first-contact date, 12-month window, any rep), a monthly funded-deal report, and possibly a per-batch fee covering hard costs. No numbers to David until FL batch 3 and the email pilot produce application rates. Contact-doc `Commercial read` has the full breakdown; the 08-15 "attribution is not an issue" position should be revisited on this evidence.

