---
title: Pool-first sourcing — debrief and action plan after the David LaSaee call
date: 2026-09-03
type: analysis
sensitivity: INTERNAL ONLY (quotes an unrecorded-by-request call; contains lender economics David asked not to be written down)
sources: bd/calls/transcripts/david-lasaee-2026-09-03.md · David's 4 ICP docs (09-02) · SIC crosswalk xlsx · "WIP Apr 7 list update Apr 13" xlsx (1,078-row vendor list + 164-row PCF verification pass) · e-secretaryofstate.com · Providence Box Fit (artifact 8316c022) · Sourcing & Dial Brief (artifact 12197793)
---

# The call redefined the problem: Quintel has been building for planners, and the small-ticket majority are need-buyers

**So what.** Quintel's engine finds companies that leave a public trail before they buy (permits, awards, filings). David described a borrower who leaves no trail: the owner-operator whose dump truck breaks today. For that borrower the only sourcing strategy is to be in the pool and in the inbox when the need hits. That is a second sourcing physics, not a refinement of the first. The good news is that the layer both physics share, entity resolution plus contact verification plus an outcome loop, is exactly what every vendor David tried has failed at, and it is what Quintel already does best. The first joint deliverable is due 2026-09-04: 50 verified in-box rows, which David will call in full and grade. That batch is the first real test of Quintel's contact-data quality, and it should be built to win.

## 1. What was actually said (the alpha, in order of weight)

| # | Claim | Evidence | Status |
|---|---|---|---|
| 1 | **Pool first, then intent.** Two pillars: ICP × equipment type → SIC on the *equipment* (not the company) → Secretary of State entity search by state → bucket → verify → 10–12 touch email over 10–12 months, plus "AI agents" looking for intent inside the pool. | "Let's identify the companies, then go after the intent." Providence's most successful reps already do this by hand: SOS search by industry, email the info@ address. | Fact about method; unproven at scale ("we haven't been able to do this electronically"). |
| 2 | **The need-buyer.** Providence's borrower does not plan. Event-driven sourcing "was for companies much larger." | "At 11 o'clock you get hungry, you start thinking about lunch." | His read of 22 years of book; plausible, and consistent with our own dial data skewing to planners. |
| 3 | **Every vendor failed on data quality, not on intent.** B2B Rocket: 1,700 of 3,000 calls bad. ZoomInfo: 12,000 calls "awful," LinkedIn-scraped, "Joe Smith at a different company." Lead-gen emails >40% verification fail. | His 164-row verification sheet: 42 rows needed a new number found by hand; wrong area codes, NIS, generic mailboxes, URLs pointing at other companies. | Fact, with his own artifacts. |
| 4 | **The CFO rule.** If the company has a CFO, close rate drops to ~3%. Under 15 employees is the proxy. | Product is lease-to-own on a buy rate plus points; a CFO computes the implicit ~12.5% vs a bank's 7%; no early payoff; end-of-term overpayment tail. "You need to understand how the sausage is made." | Fact about Providence's economics; he asked that it not be written down. |
| 5 | **Three lender types.** Banks; balance-sheet independents (own capital, sophisticated, own infra); brokers/discounters like Providence (other banks' money at buy rate + 1.2 pts, lease-to-own). | Verbatim taxonomy. | Useful and generalizable for Quintel's lender ICP. |
| 6 | **Vendors are 47–50% of revenue** and the vendor list is derivable: equipment → dealers → strip OEM captives (Cat, Deere, United) → "second-tier" dealers in smaller communities. | Matches Robert's vendor-reciprocity motion on 08-26. | Fact + method. |
| 7 | **Trade associations as a pool tier.** SIC → association → member directory = alive, paying, self-identified. He does this "elsewhere, not at PCF." | | Method; cheap, high precision. |
| 8 | **Geography by outcome.** 22 years of funded deals geocoded ("dots on a map"); Minnesota has none despite 20 focus groups; "someone from California" is a kiss of death in Alabama. | | Fact that the map exists. Get the dots, not the politics (see §4). |
| 9 | **Operating agreement.** We build and verify the pool; he calls every row (200/day, 1,000/week) and returns structured verdicts; target >50% valid, aim 70–90%; we run email infra on our domains, he supplies copy tested on ~10,000 sends; Slack; first 50 rows tomorrow. He called it "our joint venture." | | Agreed live. |
| 10 | **He has other clients** running the same playbook (a $15M Texas company, "the other companies I'm working with"). "This business model works for all of them." | | Fact. |

Unresolved or loose: the $200 CPA unit (never asked), the "11 points" (he says they are in the ICP if you read between the lines; §5 reconstructs them), "G4" website-traffic checks and "AI agents pick up intent" (technically vague; do not build on them), the Android 12-01 change (still unverified).

## 2. Non-obvious insights

**A. Verification is a sellable product on its own, and David said so.** "If you're north of 50, you can sell this to anybody." Every vendor he named ships resolution errors as leads. Quintel's canonical-company model and project-first evidence gate are the fix for "Joe Smith at a different company." The differentiator to lead with against Bebop/Apollo is not signals. It is that our engineers solved the thing theirs could not.

**B. His verification loop is a free labeling engine.** 1,000 human-graded rows per week, in a schema he already uses (red/green/NIS/yellow, corrected number, corrected POC, "not buying," "buying, when"). That is contactability and ICP-fit ground truth at a rate the scorer has never had (30 companies / 19 labels today). Design the return schema before batch 1 ships so every verdict lands as a label with provenance, not as a spreadsheet.

**C. The vendor list's firmographics are fabricated.** In the 1,078-row list, revenue bands and employee bands have identical distributions (382 / 368 / 328). One was derived from the other. Treat every vendor firmographic as unverified unless it comes from SOS, UCC, or the company's own site. This also means the WIP list's SIC and TIB columns (LLM-written "reasons") are the vendor's guesses, not facts.

**D. The pool must be deduped against Providence's own book.** Row "B&A Concrete: Existing - Wally's Account" in his verification sheet. If we hand Providence its own customers, we "source" nothing and start an attribution fight. Ask for a customer-name export or run the dedupe on their side before every batch. This also closes part of Max's open #13.

**E. SOS is a Quintel-native source class and it solves TIB.** Secretary of State records give formation date (TIB directly, no guessing), active status, registered agent, sometimes industry. Same class as UCC: state-level public records, many with bulk downloads (FL Sunbiz, TX SOS bulk data, CO open data). New-entity formations in equipment-heavy SICs are also a trigger for Providence's startup program.

**F. Equipment→SIC crosswalk is the generalizable object.** David's 27-row sheet is the seed. Every lender's box can be expressed as equipment list → SIC list → pool. Quintel's fit axis already carries "equipment vocabulary from the buy box"; promote the crosswalk to a first-class, reusable object and every future Type-3 lender onboarding gets faster.

**G. Vendor discovery from UCC collateral.** UCC filings name the secured party and often the dealer in the collateral description. Captive secured parties (Cat Financial, Deere Financial) identify OEM-financed deals to exclude; non-captive filings in preferred SICs surface the second-tier dealer universe David wants. That is his vendor strategy, built from data we already hold.

**H. "Finance-function presence" is a box attribute with opposite signs per lender type.** CFO/controller in the contact set is negative fit for Type-3 (Providence), positive for Type-2 (Wingspire wants $100M revenue, PE-backed). Encode it once; sign it per box.

**I. Phone is not dead; unverified lists are.** His own evidence is 1,700 bad rows in 3,000 calls, and he personally makes 100–200 calls a day. Our 77% no-connect over 122 dials is consistent with a data-quality problem, not a channel problem. Verification before dialing is the cheapest experiment we can run on our own funnel.

**J. Sender identity decides who owns the relationship.** We run the domains. If emails go out as Providence, Providence owns replies. If they go out as Quintel the origination firm, we own the borrower and hand to Providence, which is the 12-week plan's model. Nobody raised this. Decide before batch 2.

**K. This is the human+agent loop Tokenrip exists for.** Agent proposes rows; a human grades 200/day; corrections and verdicts flow back to the same record with per-field provenance; the next batch is better. Build the record Tokenrip-native (artifact with field-level provenance) rather than a spreadsheet, and this project becomes a lighthouse for the substrate as a byproduct.

**L. David is a portable playbook looking for an engine.** He will take the method to his other clients. The infra (pool, verification, record, domains, outcome loop) is the retention. Simon's call to run the infra ourselves and take his copy was the right one. Say the IP split in Slack once, lightly: copy and ICP are his, pool and records are ours, results are shared.

## 3. What opens up beyond Providence

- **A second product lane, not a pivot.** Trigger lane for Type-2 lenders and large tickets (what the 12-week plan's lender panel wants). Pool-and-cadence lane for Type-3 brokers and small-ticket (Providence, Envision, Ameris/Balboa, Civista, most of the 45-rep floors). Shared core: resolution, verification, outcome loop, box-as-crosswalk. The fork decision on Sep 26 (origination firm vs software) now has a third shape: the pool lane is what small-ticket lenders will pay for as software, because it replaces the list vendors they already pay.
- **Verification-as-a-service** as a wedge into any lender that buys lists. "North of 50" is the bar. Sold per verified row or per seat, it is a line item they already have.
- **Trade associations and SOS as recurring connectors** generalize to every vertical Tokenrip might enter after equipment finance.
- **David as a channel** to multiple Type-3 lenders, if batch 1 wins. He is already selling the method; we would be the engine behind it.
- **The scorer's calibration problem gets solved sideways.** Weekly graded rows plus Providence credit outcomes give the rubric a corpus in months, not years.

## 4. The line we hold

Political affiliation, race, religion, gender, marital status: not in the system, not as filters, not as scores. County-level targeting from Providence's own funded-deal density (the dots map) is fine and better. North Carolina's voter file is not a source. The transcript is internal-only; he asked not to be recorded, and Simon and Alek's "we said it too" was a kindness, not a fact. One sentence in Slack if the demographic fields come up, then move on. Separately, be aware that our borrower-facing promise ("competing terms, no cost to you") now feeds a lease-to-own shop with a 12.5% implicit rate and an overpayment tail. That is Providence's business, not ours to police, but it shapes which opportunities we route there once the lender panel exists.

## 5. The 11, reconstructed (confirm with David)

From ICP + persona + the call, the eleven appear to be: (1) commercial use; (2) 2–25 employees, under 15 preferred; (3) A–C credit, mostly B/C; (4) revenue under $5M; (5) source: vendor vs direct; (6) industry preferred and not restricted, judged on equipment not company SIC; (7) TIB ≥ 2 years, or startup with deep owner experience; (8) location: allowed states, small communities, funded-deal density; (9) PIC is an owner-operator with no CFO; (10) motivation: growth or upgrade-to-cut-cost, cash-flow driven; (11) equipment financeable and ticket $40–200K (his own floor $50K). Nine of eleven are encodable today without a credit pull.

## 6. Action plan

### Quintel, this week (Simon unless noted)

| # | Action | Due |
|---|---|---|
| 1 | **Batch 1: 50 rows, Florida only, lane A only** (hydrovac / utility / septic / excavation), from sources we already hold: FL UCC renewals, Sunbiz (status, formation date, officers), FL DOH septic contractor list, PPP for NAICS and size. Non-bank secured party preferred. Verify: phone line type and area code vs state, email MX/SMTP-valid on the company domain, website live, owner name from SOS or licensing record, entity match confidence. No LinkedIn-sourced contacts. Every field carries its source. Bad contact data marks the source, it does not drop the lead. Dedupe against the WIP list and any Providence book we can get. Ship as a shared sheet **with the verdict columns pre-built** (see #3). Copy the shape to TX/OK and lanes B–E only after David confirms it is what he wants. Build plan: [[active/batch1-florida-build-plan-2026-09-03]]. | 09-04 |
| 2 | Slack: Alek creates a Quintel workspace and invites David. | 09-03 (Alek) |
| 3 | **Return schema.** Verdict: valid / wrong number / NIS / out of business / wrong POC / generic mailbox / existing Providence account / duplicate; corrected phone; corrected POC + title; reached y/n; buying y/n + equipment + timing; permissions. Ingest as labels with provenance on company and contact records. | 09-04 |
| 4 | Swap real Providence box into the account (PUT /v0/box). | 09-04 |
| 5 | Equipment→SIC/NAICS crosswalk as a first-class object; seed with David's 27 rows and Alek's five lanes (tokenrip.com/s/6774758e…). | 09-08 |
| 6 | SOS connector spike: bulk-download availability for FL, CO, TX, CA; fields (formation date, status, agent, industry); cost. Decide bulk vs scrape. | 09-10 |
| 7 | Email infra: sequencer + 15 domains × 3 mailboxes, warmup now (2–3 weeks). At ~40/day per warmed mailbox that is ~1,800/day, ~36K/month, enough for a pool of thousands on a 10-touch cadence. ~$300–500/month. CAN-SPAM basics (real sender, address, opt-out). Volume is not the constraint; cadence on a verified pool is. | start 09-04 |
| 8 | Sender-identity decision with Alek (Providence vs Quintel origination firm). | before batch 2 |
| 9 | Batch 2: 200 rows, same slice, once batch-1 accuracy is known. David's 200/day capacity means a week of grading. | ~09-11 |
| 10 | Verification-before-dialing on our own borrower queue; compare connect rate to the 77% no-connect baseline. | 09-12 |
| 11 | **Opener A/B on the UCC-maturity lane** (need hook vs ledger hook), ~200 touches across email and phone. This is the cheapest test of the borrower-side thesis ([[active/borrower-ledger-thesis-2026-09-03]]). | 09-19 |

### Alek

| # | Action | Due |
|---|---|---|
| 1 | Tell Max/Robert the David lane exists and batches come from one pool; merge, don't fork. Put outcome reporting (app / approve / decline / funded) and fee-on-deal in writing (Max #13). | 09-05 |
| 2 | Get a Providence customer-name export (or agree they dedupe) before batch 2. | 09-09 |
| 3 | Sender-identity decision with Simon. | before batch 2 |
| 4 | Lender ICP doc: add the three-type taxonomy; tag panel prospects Type-2 vs Type-3. | 09-12 |
| 5 | Add Simon to the Max rep-debrief call; ask Providence for their opener on the companies that converted after we were brushed off. | next Max call |

### David / Providence (ask in Slack)

| # | Action | Due |
|---|---|---|
| 1 | Call all 50, return verdicts in the schema. | 09-05 (inferred: "let us know by end of day") |
| 2 | Send the tested email copy, the "other list," and the tools he uses to verify (line-type, email, traffic). | 09-05 |
| 3 | Funded deals by state, ranked (UCC load order); the dots map if exportable. | 09-10 |
| 4 | Which vendor produced the "PERSON-LI" export; what it cost; what they promised. | 09-05 |
| 5 | Who at Providence signs off on emails under Providence's name; whether credit outcomes on our handoffs can flow back. | 09-10 |
| 6 | Confirm the 11 against §5. | 09-05 |

### Milestones

Batch 1 graded (~09-05) → accuracy % → batch 2 (~09-11) → domains warm and first sequence live (~09-22) → first in-box application → first credit outcome back → scorer recalibrated on graded rows.

## 8. Founders' sync, 2026-09-03 (decisions)

- **Batch 1 = Florida, one lane, 50 rows, super narrow.** Copy the shape across states and lanes only after David validates it. Alek's assignment memo (tokenrip.com/s/6774758e…) is adopted as the lane roadmap: five lanes with NAICS and equipment, PPP loan-level data and licensing registries for discovery, SOS for verification only, seventeen company-level and nine market-level signals for later batches. Its scope is a roadmap, not a day plan.
- **Pipeline principle:** every datum carries provenance; bad contact data scores the source and tool, it never disqualifies the lead; get end-to-end first, optimize later.
- **Slack:** Alek creates the Quintel workspace.
- **Providence notes are good** and the dial notes now land in PostHog with full properties (going forward only).
- **Caller-skill confound:** Alek was brushed off by a company that became a Providence opportunity when their rep called it. Our "not interested" dispositions partly measure the caller. Sprint scorecard reads should carry that caveat; get Providence's opener.
- **Simon joins Max's rep-debrief call** for product questions.
- **"Lead X":** a tool Providence appears to use surfaced in the notes; nobody could name it. Ask.
- **Email math corrected:** see Quintel #7. Neither "10 domains for a million a month" nor "$2K/month" is right; a million a month is hundreds of domains, and the pool does not need it.
- **Borrower-side thesis** raised by Simon, pushed on by Alek. Pressure test and start plan in [[active/borrower-ledger-thesis-2026-09-03]]; cheapest test is Quintel #11.

## 7. Things Simon didn't ask about

1. **Recording.** He asked not to be recorded. The transcript exists. Keep it internal-only; never quote his phrasing outside the vault.
2. **Providence's product economics** now sit behind our borrower promise. Know it when routing.
3. **CAN-SPAM and TCPA.** Cold email from "fictitious domains" still needs an accurate sender, a physical address, and an opt-out. B2B calling is largely TCPA-safe until autodialers or cell numbers enter the picture. Cheap to get right up front.
4. **Vendor firmographics are synthetic** (§2C). Do not let them into the box filter.
5. **"G4" and "AI agents pick up intent"** are loose claims. Website-traffic estimation exists (SimilarWeb-class); reading other companies' AI searches does not. Do not promise it.
6. **The UI request.** He wants a data-entry surface, "any format." That is a Tokenrip Surface, not a dashboard rebuild.
7. **Minnesota is a natural experiment.** If the dots map is real, geocode it and let it set UCC load order and county weighting. That is the fair-lending-safe version of everything he said about geography.
