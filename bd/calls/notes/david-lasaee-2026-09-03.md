# David LaSaee Call — 2026-09-03 (firm-direct → co-build; INTERNAL ONLY)

Full breakdown, non-obvious insights, bigger picture, and the two-team plan: [[active/providence-pool-first-debrief-2026-09-03]]. This note is the operational record.

## Follow-Up Actions
### What WE Need to Do
| # | Action | Owner | Due |
|---|--------|-------|-----|
| 1 | Batch 1: 50 verified rows, Florida only, lane A only, verdict columns pre-built (re-scoped at founders' sync) | Simon | 2026-09-04 |
| 2 | Quintel Slack workspace; invite David | Alek | 2026-09-03 |
| 3 | Return-verdict schema + ingest as labels with provenance | Simon | 2026-09-04 |
| 4 | Swap real Providence box into the account | Simon | 2026-09-04 |
| 5 | Domains + sequencer + warmup started | Simon | 2026-09-04 |
| 6 | Sender-identity decision (Providence vs Quintel) | Simon / Alek | before batch 2 |
| 7 | Merge with Max/Robert pilot; outcome reporting + fee in writing | Alek | 2026-09-05 |
| 8 | Customer-name export or Providence-side dedupe | Alek | 2026-09-09 |
### What THEY Need to Do
| # | Action | Who | Due |
|---|--------|-----|-----|
| 1 | Call all 50, return verdicts | David | 2026-09-05 (inferred) |
| 2 | Send email copy, the "other list," verification tools used | David | 2026-09-05 |
| 3 | Funded deals by state; dots map | David | 2026-09-10 |
| 4 | Confirm the 11 (reconstruction in debrief §5) | David | 2026-09-05 |
### What They're Expecting From Us
50 numbers to call tomorrow ("I'd rather make calls for our joint venture"), a Slack invite, and the email infrastructure on our side with his copy.
### Open Questions Before Next Contact
- $200 CPA unit (still never asked).
- Which vendor produced the PERSON-LI export; what it cost.
- Who signs off at Providence on email under their name; can credit outcomes flow back.
- What "G4" traffic check and "AI agents pick up intent" actually mean in his practice.
- Android 12-01 (low priority).

## Call Summary
Second meeting, Simon + Alek + David, recorded despite David's request otherwise (keep internal). David laid out pool-first sourcing (ICP × equipment → SIC on equipment → Secretary of State by state → verify → long email cadence), the need-buyer thesis, the CFO rule and Providence's lease-to-own economics, three lender types, and the data-quality failure of every vendor he has used, with his own 164-row verification sheet as proof. Agreed: Quintel builds and verifies the pool and runs email infra; David calls every row (200/day) and returns structured verdicts, target >50% valid; Slack; first 50 rows tomorrow.

## Momentum
↑ — a concrete joint deliverable with a date, a grader with capacity, and a success metric; the risk moved from "is there data" to "can our contact data clear 50%."

## Key Intelligence / What Changed
1. **Two sourcing physics.** Event-driven for planners (our engine) vs pool-and-cadence for need-buyers (Providence's book). The shared core is resolution + verification + outcome loop. Debrief §2–3.
2. **Data quality is the whole game at this tier.** "3,000 calls, 1,700 incorrect." "North of 50 you can sell this to anybody." Our first KPI with David is verification accuracy, before any deal.
3. **The CFO rule and the sausage.** Close rate ~3% with a CFO present; under 15 employees is the proxy; lease-to-own, no early payoff, overpayment tail. Shapes the box (finance-function presence, sign per lender type) and shapes what we route to Providence.
4. **Vendor list forensics.** Identical revenue/employee band distributions in the 1,078-row list mean synthetic firmographics; an "Existing - Wally's Account" row means dedupe against Providence's book is mandatory.
5. **Fair-lending line stated internally.** No political/demographic fields; county weighting from the funded-deal dots map instead.

## Firm-direct: pain / objections / stage
- **Pain:** real and specific. 18 months of vendors delivering bad data; reps hand-searching SOS; "100 useless calls today." Builder's pain plus operator's pain.
- **Objections:** none. He probed for capability ("are you familiar with SIC") and set the bar (>50%).
- **Authority:** still a contractor with other clients; can commit his own calling time and copy; cannot commit Providence's name on emails or credit-outcome data without someone else (unknown who). **Budget:** none discussed; this is a co-build. **Timeline:** batch 1 tomorrow, weekly cadence implied. **Stage:** joint pilot with a graded deliverable.

## Simon's Performance
### Coaching Priorities
- Offered to have David spot-check 10 of 50; David corrected to all 50 for statistics. → **Better language:** "Grade all 50 and I'll build the sheet so your verdicts land as data, not comments." → Why: the grader's capacity is the asset; design the loop around it from the first batch.
- Agreed to "we set up the infrastructure" without naming whose identity the emails carry. → **Better language:** "We'll run the domains. Before the first send we decide together whether the sender is Providence or Quintel, because that decides who the reply belongs to." → Why: sender identity is the ownership question hiding inside an infra question.
- Asked "what didn't work before" and let David defer it to the ICP exercise; the $200 CPA never got asked. → **Better language:** "Before we move on: the $200 CPA you mentioned, what's the unit?" → Why: it is the one number that would let us compare his channel to ours.
### What Worked
- Named the limit honestly: "public data skews to higher ticket; it gets thin at the low end." That admission is what earned "you're the first ones."
- Framed the experiment as scaling what the successful reps already do, which David called "the only solution."
- Took the infra and left him the copy. Right split of ownership.
- Alek's "manufacture intent with a campaign" and "10-touch" ideas landed hard and moved the conversation to an operating plan.
