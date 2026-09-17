---
title: Quintel — Focus Realignment (cliff notes)
status: active
owner: Simon
type: strategy memo (condensed)
created: 2026-08-16
revised: 2026-08-17 (bulleted, scannable rewrite; humanizer pass)
condenses: product/quintel/quintel-focus-realignment-2026-08-15.md (v3) — full reasoning, sources, and bake-off inputs live there
changes vs long form: attribution dropped as an issue throughout (Simon 08-16: nobody who goes to the trouble of using Quintel will squabble over whether we surfaced a lead); §4 folded into the kill criterion; build posture updated (data-editing interface built over the weekend; 80/20 call vs build); Onset step reworked (training session / 1:1s this week); phone script moved to the call-capture section
---

# Quintel: focus realignment (cliff notes)

## 1. The recommendation

For the next six weeks Quintel has one job: produce one deal.

- A Quintel-surfaced company, confirmed by phone to have a live equipment financing need, handed to a lender, accepted for credit submission.
- We work the leads ourselves. Quintel becomes its own first BDO.
- Every lender conversation from here opens with "here's a deal," not "here's a tool."

Why: it is the fastest path to revenue, and one deal solves every open problem at once (§3). Nothing else on the table does more than one of those.

## 2. Diagnosis

Nobody is paying anything, and the reason is the same everywhere.

- VFI volunteered $7–15K/mo and has paid $0 across 10+ calls. Wingspire designed its own $3K/mo shape and never booked the next call. Onset signed a $0-guaranteed rev-share and the champion left in week one.
- Reps at both live accounts don't work the list. Onset "started working prospects but haven't gone very far." VFI's best cross-matches sat unworked in its own CRM.
- Same pattern each time: enthusiasm turns into self-designed pricing, then into nothing, because no lender has seen Quintel produce a deal.
- Trigger volume isn't the constraint. Someone working the triggers is, and we can't make another company's reps do it.
- The scorer has never been checked against reality (n=19 labels; "do our 70s convert better than our 40s?" is still open). Outcomes only come from worked leads.

Both of us already believe this. Neither of us is doing it.

- Simon, 08-14: "things will turn around as soon as we drop a deal in their laps."
- Alek, same call: "if we hand them a prepackaged deal, anyone will take it. We don't even need an agreement with the lender."
- Simon, same call: "I meant to do some calling today... and I just got caught up." The call ended with a build and more lender demos.
- This is a shared belief, and it's our own FDE doctrine (sell the outcome, build the substrate behind it) applied to Quintel.

## 3. Why founders calling borrowers is the right move

It is the fastest path to revenue we have. Every other path runs through someone else.

- Selling seats means a lender's reps have to work the list, see it convert, and then their boss has to sign. Eight weeks in, that chain has produced $0.
- Rev-share means a lender's reps have to work the list and close, and then we get paid a slice, months later. Onset is that path, and the one rep who was working it left.
- Calling borrowers ourselves means we find the need, hand it to a lender, and get paid a broker fee on it. No rep to persuade, no seat to sell, no committee. Fee on a $2M deal is around $20K, and lenders already pay it: "it's usually per deal" was Onset's line, unprompted.

And one deal solves every problem we have at once:

- Revenue. First dollars in, from a fee we don't have to negotiate into existence.
- Lenders. The lender we hand it to becomes a customer that day. Everyone else in the pipeline (Rob at Wingspire, Bill at Armada, Mike at 36th, Alliance's VP) is at "I like it, show me." A deal is the show. Stauss said it himself: "if you go into a sales conversation with a deal ready to go, who's gonna say no?"
- Validation. It proves the signals find real needs and that the scorer's top of list means something. That's the thesis the whole company rests on, and it's currently untested.
- Data. Every call, yes or no, is an outcome the scorer has never had. n=19 labels today.
- Leverage. Once a deal exists we can ask for a seat floor on rev-share. Until then we have none.
- Clarity. If 150 calls produce nothing, we know that too, in six weeks instead of a year of churn.

Two smaller reasons:

- It tests the BDO claim by being the BDO. If two founders with the tool can't turn 150 in-box companies into three confirmed needs, no customer's rep will either, and no UI fixes that.
- It is the highest information per hour available. A three-minute call with the CFO of a company that just won a $14M award tells us whether there's equipment, financed or cash, by whom, how big, when, and whether the signal meant anything. Fifty calls tell us more than fifty demos.

Email and LinkedIn ride alongside the phone. The phone returns information; the signal-specific email is why the second dial gets picked up. About 30 companies a day from a personal mailbox, not a sequencer.

## 4. Alek's positions

Mostly right in direction, wrong in sequence.

- Keep opening lenders, get rev-share signed. Rev-share does kill the budget objection, but zero-risk paper proves nothing (Onset is the proof). Keep the conversations; change the ask from "sign our rev-share" to "give us your box, we'll bring you a deal, here's the fee when we do."
- Hire 1099 brokers. Right idea, week 3+. You can't brief a broker on a motion nobody has run; the first two weeks of our calls are the product research. Alek's economics point (package the deal, take a broker fee) supports deal-first.
- "Anyone takes a packaged deal, we don't even need an agreement." Agreed, and it's the strongest line in the transcript. It argues for producing a deal, not collecting paper.
- Data-editing interface. Built over the weekend. Bad websites and revenue estimates do break calls. From here platform work is background: 80/20 calling vs building.
- Message David, make him the Onset champion. Yes, by handing him a confirmed need this month rather than asking for feedback.
- Rev-share vs recurring. Both right, in order: proof first, floors second. There's no leverage for a seat floor until a deal exists.

The gap between us is smaller than the transcript makes it look. Same goal; different view on who calls and what to build meanwhile. Neither difference survives once calling starts.

## 5. What it displaces: the 80/20

- Calling is the 80. Roughly four days in five.
- Founder outbound to lenders continues only where the ask is "your box, and here's the fee."
- Building is the 20, done in the gaps: P0/P1 in §8 first; team/manager surfaces, CRM integration, seat polish, UI rework only if they never touch a calling block.
- Zero-risk rev-share signatures don't count as progress. Deals do.

## 6. Six-week shape

Week 1 (by Aug 22)
- Pick the box: count 30-day in-box SURFACE items for VFI's box vs Onset's, call the one the signal actually reaches.
- Turn on the renewals lane (`ucc`) for every live account. Onset's box excluded it by config.
- Load the partner lender's book so the surface suppresses known companies (existing `book` suppression). The call list is net-new by construction, and it gives us the coverage number lenders keep asking for.
- Onset this week: set up a training session or 1:1s with the reps, and ask them outright what it would take for them to work the lists.
- Build P0.

Weeks 2–5: call
- Dial surfaced companies daily off the dial sheet. Every reached call logged to the §11 schema; the two timing questions never skipped.
- Any confirmed need goes to the partner lender the same day with the fee stated (Onset: 0.5–1% under paper; VFI: "standard referral fee, want it?").
- Alek's machine points at borrowers. Simon takes a smaller daily block so he hears the signal himself; the rest of his time is the §8 build and AICAP inside a cap.

Week 6 (by Sep 26): read the ledger
- Then decide the model: originator (broker economics, services-shaped) or tool-with-proof (a reference deal, rev-share with a floor).

## 7. Kill criterion, and why the fail case means "stop selling sourcing"

By Sep 26, with 150+ net-new in-box companies contacted:
- Fewer than three confirmed live equipment financing needs, or zero handoffs accepted for credit submission: the signal thesis is falsified for the current signal set.
- Three or more needs and at least one submission: double down. Take the ledger to Wingspire / 36th / Alliance / Armada and require a floor on every rev-share going forward.
- Credit submission is the bar, not funded, because large-ticket first-contact-to-funding runs months. Submission is the earliest point where the lender has put its own underwriting time on the line.

Why "stop selling sourcing" includes "just a better reason to call":
- Alek's point: Quintel doesn't need to be a painkiller, it needs to give reps a better reason to call than an Apollo list. That's the right description of the product shape.
- But "better" is a claim about outcome per dial, and it can be false. If we work the list for four weeks and can't find three needs behind the signals, the signals don't give a better reason to call. They give a different-looking list.
- Bombora and 6sense sell unverified intent because they're horizontal, at scale, to marketing budgets. Quintel sells into a few hundred lenders whose sales managers ask "what's your hit rate?" three times in a meeting. In a vertical this small the buyer measures.
- Quintel can't win on contact data. It buys contacts from Apollo and Diffbot. It can only win on timing, reason, and ranking.
- So painkiller vs vitamin is really proven vs unproven. A reason to call that demonstrably converts is the painkiller for a manager measured on production. One that doesn't is a list nobody dials twice. The sprint is how it becomes proven.
- If it fails, the remaining wedges are the back-book/renewal play (Ameris/Balboa shape) or deal packaging for placement firms and credit officers (Bevel, Ted's pain). If neither has a paying buyer within four more weeks, Quintel goes to maintenance.

## 8. What to build: the 20

Only what the six weeks consume, on top of what exists (briefing + deal angles, `sales_activity`, book suppression, enrichment with phone reveal, register, outbox).

P0. Dial sheet + touch log
- Nightly batch picks tomorrow's ~30 companies (net-new, in-box, trigger recency × score) and runs the contact stage so a decision-maker name/direct/email is present.
- Sheet: company, trigger and why, prior lender, briefing, contact.
- Close the reserved-but-unbuilt `touch` kind on `sales_activity`: one-click log on the prospect drawer, plus a capture form built to the §11 schema (Tier 1 required; dates stored as dates so maturities and re-contacts can drive re-surfacing).
- This table is the ledger, the calibration dataset, the borrower calendar, and the lender story. It can't be a spreadsheet; it has to join to trigger and company.

P1. Touch kit
- From the briefing's fact projection: 20-second voicemail, email 1 (under 90 words, the signal as the reason, one ask), LinkedIn note, day-3 email 2. Facts only, never invent.
- Output to clipboard / Gmail draft / Apollo CSV; log `sent`.
- No sender. Founder mailbox, human reviewed.

P2. Book scrub as an ops step: Onset/VFI relationship lists as CSV into their books; record the net-new rate.

P3. Handoff memo, after the first confirmed need: one page with company, evidence trail, need in the borrower's words, contact, register lead id.

Not now: more CRM integration, team/manager surfaces, seat polish, UI rework, an automated sender.

## 9. The one assumption

- The binding constraint is evidence, not distribution. A deal in hand converts the pipeline; the non-payment is "show me," not "no." I'd put this at ~75%.
- The alternative (data too thin, product not good enough) gets tested by the same calls, faster than by any build.
- Two cheap checks before taking a fee: 30 minutes on state broker licensing for the states in play (Onset already papered Quintel as a broker); no VFI-box deal placed anywhere but VFI while Stauss's advisor role stands.

## 10. What needs to be true, and the borrower side

Four conditions
1. Signal precedes need inside a large-ticket box, at density. Unknown.
2. Calling on the signal beats calling on Apollo, in connect-to-need or time-to-deal. Unknown, never measured. Nobody has dialed the two side by side for a day.
3. Somebody works the list: customer reps (eight weeks say no) or us.
4. It compounds. World model plus outcomes is what makes customer ten cheaper than customer one and answers "we do this with Claude." Outcomes exist only if (3) is true.

The sprint tests 1–3. If we don't validate, the answer arrives anyway, from churn, in 6–12 months, in an industry small enough that a failed pilot becomes "tried it, didn't work" in the next ten conversations.

If there's no submit-ready deal, the ledger says why
- Couldn't reach decision-makers: contact problem. Fix and re-run. Also a finding in itself: the BDO can't do the BDO's first job.
- Reached, no need behind the signal: signal set falsified. Renewals lane first, then stop calling it sourcing.
- Reached, need exists, already financed at point of sale or by the bank: incumbent capture. Value shifts to finding the next one earlier (timing).
- Needs confirmed but not yet at submission: that counts as a pass. The kill criterion is on confirmed needs.
- What remains if sourcing fails outright: world model, entity resolution, box scoring, packaging. Katharine's "Salesforce with EF market intelligence," or the placement layer for firms like Bevel. It's sellable, but it isn't the company on quintel.ai.

The borrower side: own the timing, not a login
- Borrowers are the hard side. With a deal a lender is easy. A lender has to catch the borrower at the right moment, so it re-dials every six months.
- The insight is right: whoever owns the borrower's timing owns the deal, and since we don't control capital, the relationship is the only side left to control.
- Where the idea goes wrong is the form. A CFO tool for an event that happens every two to three years won't get used, and a portfolio tracker competes with the fixed-asset register they already keep.
- What lets brokers own borrowers is a calendar and a reason. Quintel can run that calendar for ten thousand companies:
  - The re-dial-every-six-months problem is already in the data. A UCC-1 filed in 2021 on a 60-month lease matures in 2026. That's the renewals lane (9,139 events): exact timing, a real reason, a named incumbent to beat. Turn it on everywhere.
  - Every borrower call collects the timing that isn't public: current financing maturity and next capex/budget window. A not-now borrower becomes a dated future call instead of a dead lead. That turns one call into a relationship without building anything for the borrower.
  - The reason for the next touch is content, not software: "we'll send you a market read on terms for your asset class as your maturity approaches." It's the brief we already produce for lenders, pointed the other way. If CFOs say yes, we've found the borrower product by asking. If not, we didn't build it first.
  - The data asset is borrower-stated timing on top of public signals. Ground truth no lender has outside its own book, collected by us with no CoI problem. It accrues from calls, not logins.

Lessons from the marketplace lenders that failed
- Origination fees need constant volume and give no annuity. The recurring-revenue instinct is right; floors after proof.
- Equipment buyers repeat. Personal-loan borrowers don't. The borrower book has repeat value here.
- Intermediary economics die on small ticket. If a confirmed need costs ~100 dials, that's fine against $20K on a $2M deal and fatal against $2K on $200K. "Mid-market/large only" is this lesson applied.
- Don't single-thread on one lender's box. Boxes tighten in downturns; the world model is what re-routes deals.
- In a small industry an intermediary's whole asset is trust. One leaked borrower confidence ends it.
- The intermediation itself doesn't need inventing. EF already pays brokers 1–3%.

The fork (decide Sep 26, not before)
- Every thread points at one company: an AI-native origination firm whose moat is borrower timing data, whose software is what lets two people run the calendar for ten thousand companies. Lenders are the paying demand side; the deal is the product; the seat software is how lenders' reps later plug into the same engine.
- It's services-shaped with a data asset, and it's a different company from the one on quintel.ai.
- That this is where the reasoning points: fact. That it's the right company: maybe 65%, and it moves on one number, the confirmed-need rate.
- The sprint is identical either way. What gets built after Sep 26 isn't.
- The question for us is whether we're willing to be the broker rather than sell software to brokers.

## 11. Borrower call capture: maximize every call

What we say on the phone (so the borrower-facing identity matches the lender-facing one):

> "We're an equipment finance origination firm working with lenders that finance [asset class] at [size]. Saw [signal]. If you're financing the equipment for it, we can get you competing terms from lenders that actually do this. No cost to you, the lender pays us. Ten minutes?"

A standard broker call. Borrowers take them because the offer is real.

Rules
- Structured codes and real dates. Prose goes in the note.
- Tiered, because a three-minute call can't carry thirty fields.
- Tier 1 is mandatory on every reached call, and the two timing questions are never skipped, including on "no need" calls. The not-now borrower is where the calendar comes from.
- A clean "no" against a strong signal is logged with the same care as a yes. Without the no's the scorer can't be calibrated.
- Every field joins to the company and the trigger. Script versions are logged.
- Tags: (S) signal calibration · (T) timing calendar · (B) borrower-side discovery · (D) data quality · (L) lender story.

Tier 0, every touch (auto / one click)
- Channel · reached y/n · caller · script version · duration · trigger id · score at time of touch (S)

Tier 1, every reached call, ~60 seconds, mandatory
1. Right person? Name / title / role in equipment decisions (decides · influences · refers) · direct/email confirmed or corrected (D)
2. Signal check: is the event real and known to them? y/n/partly (S)
3. Does it imply equipment? y/n · asset class · new/used · cost band (S)
4. Financing status: cash · bank line · vendor/captive at point of sale · broker · independent · lease vs loan · undecided · already signed (S, L)
5. The two timing questions: when does your current equipment financing mature? (lender + month/year) · when is your next capex cycle / budget window? (T)
6. Disposition: need in-box · need out-of-box · need but already financed (with whom) · no need · not now, dated re-contact · wrong person, referred to (name) · do-not-contact (S)
7. Permission: follow up (channel) · introduce a lender · send a market read at maturity (T, B)

Tier 2, if the conversation continues, ~2 minutes
- Existing financing: lenders, balances, maturities in the next 12–18 months, structure, term (T, L)
- Primary bank; equipment through it; happy? (T, L)
- Broker use: who, why (L)
- Next planned purchase: what / when / size / what triggers it (T, S)
- The last financing in their words: what was hard. Don't pitch during the answer. (B)
- "Would a market read at maturity be useful? What else would you want from us?" (B)
- Firmographic corrections (D)

Tier 3, need confirmed (the handoff)
- Spec, vendor/dealer, quote in hand y/n, cost, delivery timing · structure/term · entity, guarantor posture, years in business · who else is quoting · decision date · shareable docs (L)
- Register lead id, lender, date, memo sent, lender response (review · declined + reason · proposal · submission · funded)
- Referrals: other locations, sister companies, their dealer contact (T)

What each tier buys
- Tier 0+1 alone answers conditions 1–3 and yields the score-band → outcome join the repo lists as its own open question.
- Tier 1 item 5 alone builds the calendar. After 150 calls, that's 150 dated future reasons to call that no lender has.
- Tier 2's two "in their words" questions are borrower-side product discovery, done by asking.
- Tier 3 is the deal story.
