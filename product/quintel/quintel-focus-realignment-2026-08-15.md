---
title: Quintel — Focus Realignment (first-principles, PMF phase)
status: active
owner: Simon
type: strategy memo
created: 2026-08-15
revised: 2026-08-16 (v3 — §11 what must be true / what the sprint tests, §12 borrower side + LendingClub lessons + the origination-firm fork, §13 borrower call-capture spec; v2 2026-08-15 — full reasoning, Alek's positions, build list grounded in the repo)
supersedes: the 90-day sprint doctrine in active/90day/CLAUDE.md as the operating plan (per Simon 2026-08-15 — "disregard whatever we have planned")
inputs: three external-LLM sessions (round 1 + round 2 against a ground-truth brief), Simon/Alek call transcript (~2026-08-14), DASHBOARD.md, dossier 2026-07-16, Onset call notes 07-29 / 08-04 / 08-05, maxi/quintel repo as of 2026-08-13
---

# Quintel — Focus Realignment

## 1. The recommendation

**For the next six weeks, Quintel's only job is to produce one deal: a Quintel-surfaced company, confirmed by phone to have a live equipment-financing need, handed to a lender as a qualified opportunity, accepted for credit submission, and paid for under attribution language written before the handoff. The founders work the leads themselves — Quintel becomes its own first BDO — and every lender conversation from here on opens with "here's a deal," not "here's a tool."**

This is not a pivot to being a brokerage. It is the cheapest and fastest test of the only claim the company rests on — *public-signal-derived leads turn into funded equipment deals* — run in the one way that makes attribution unarguable and produces the artifact that converts every warm-but-unpaying lender in the pipeline.

## 2. The diagnosis: eight weeks of interest, no evidence — and the evidence only comes from a deal

**Nobody is paying anything.** Zero Quintel MRR. VFI volunteered $7–15K/mo and has paid $0 across 10+ calls while its ask list grew to ~45 items (`DASHBOARD.md`, Stauss row). Wingspire's buyer designed his own $3K/mo shape and never booked the next call. Onset signed rev-share — a $0-guaranteed contract — and the champion left in week one (Simon, 2026-08-15). This is not eight independent misses; it is one pattern: enthusiasm converts to self-designed pricing, then to nothing, because no lender has yet seen Quintel produce a deal.

**The behavioral evidence you do have is about adoption, not signal.** VFI: the product put two real prospects into pipeline (07-21), and its output cross-matched VFI's 18-year database *with the best matches sitting unworked* (07-28). Onset: reps "started working prospects but haven't gone very far," and were seeing 35 prospects a day when the team wanted 200–250 (`planning/2026-08-11-customer-trigger-surfacing-analysis.md`). Read plainly: trigger volume is not the constraint; someone working the triggers is. You cannot make another company's reps work your list, and the one rep who might have has left.

**The scorer has never been checked against reality.** The repo's own open question — *"do our 70s convert better than our 40s?"* — is listed as unanswerable until rep-action cohorts accrue (`planning/todo.md`, trigger-pool follow-ons). Calibration today is n=19 labels (dossier §4.2). Waiting for customers' reps to generate those labels has produced roughly none in eight weeks. Founders working the leads generates them in days.

**The payment mechanism has no definition, and your own data predicts it will be contested.** "Sourced by Quintel" is undefined in the only signed paper, drafted by Onset's counsel on their broker template (`bd/calls/notes/jerman-juarez-padron-2026-07-29.md:50`). The register-with-challenge-window mechanism (`quintel-lead-register-prd-2026-07-25.md`) is the right record, but it is attribution-by-knowledge: the customer gets ten business days to say "we already had them." The VFI cross-match shows that claim is *available to every lender* — the best Quintel matches were already in their CRM, unworked. Attribution defined by knowledge will be argued; attribution defined by action — *Quintel made first contact and handed you a confirmed need* — cannot be. That is only available if Quintel makes the contact.

**Both founders already believe this; neither is doing it.** From the 08-14 call — Simon: *"things will turn around as soon as we drop a deal in their laps… that's the surest way to get adoption."* Alek: *"if we hand them a prepackaged deal… anyone will take it… we don't even need an agreement with the lender."* And Simon, same call: *"I meant to do some calling today on potential leads we're surfacing and then I just got caught up."* The call ended with a data-interface build that "will take a long time" and more lender demos booked. That is the belief the sprint was created to kill — *building as a stay of execution* (`DASHBOARD.md`) — in a new outfit, and it is a belief both founders share, not one Alek holds and Simon doesn't.

**It is the company's own GTM doctrine.** Tokenrip's stated motion is forward-deployed: sell the outcome to a real customer, build the substrate behind it, never sell generic software up front (`CLAUDE.md`). Selling seats of a worklist is selling generic software up front. Bringing a lender a deal is the FDE pattern applied to Quintel.

## 3. Why founders calling borrowers is the right instrument

Not "why calls" in the abstract — why *this* motion beats the three alternatives on the table (wait for customer reps; collect more lender paper; build better ranking/tooling first).

- **Highest information per hour of anything available.** A three-minute conversation with the CFO of a company that just won a $14M federal award answers, on the spot: is there an equipment purchase; is it financed or cash; who's financing it (bank / captive at point of sale / broker); how big; when; and whether "your signal" meant anything at all. No email, no dashboard, no lender's rep will return that in less than weeks. Fifty calls tell you more about the product than fifty demos.
- **It tests the BDO-replacement claim by being the BDO.** Quintel is sold as "an entry-level BDO you don't have to hire." The only honest test of that is to do the entry-level BDO's job off Quintel's list and see what it yields. If two founders with the tool can't turn 150 in-box companies into three confirmed needs, no customer's rep will either — and no UI fixes that.
- **It is the only path to first-contact attribution.** See §2. Every hand-off is timestamped in the register *and* preceded by a Quintel touch. Nothing to argue.
- **It produces the artifact that converts the pipeline.** Rob (Wingspire), Bill (Armada), Mike (36th), Alliance's VP — all "I like it, show me." A deal — even one at credit-submission stage — is the show. Stauss's own words: *"if you go into a sales conversation with a deal ready to go, who's gonna say no?"*
- **Email and LinkedIn ride alongside the phone, they don't replace it.** Simon's instinct is right and already in the lender playbook (§5: VM + email inside 60 seconds + LinkedIn connect): decision-makers are hard to reach on the first dial, and a signal-specific email is the reason the second dial gets picked up. The phone stays primary because it is the channel that returns *information*; email is the multi-touch assist. Volume is ~30 companies a day, not 3,000 — this is a personal-mailbox motion, not a sequencer product (see §9).

**What Quintel says on the phone** (so the borrower-facing identity is coherent with the lender-facing one): *"We're an equipment-finance origination firm working with lenders that finance [asset class] at [size]. Saw [signal]. If you're financing the equipment for it, we can get you competing terms from lenders that actually do this — no cost to you, the lender pays us. Ten minutes?"* That is a standard broker call, and it's why borrowers take them: the offer is real.

## 4. Why six weeks, and why credit submission — not funded — is the bar

- **Long enough to get a read.** Two people at ~25–30 dials a day reaches 150+ net-new in-box companies inside four calling weeks even with normal reach rates, which is enough volume for a conversion number that isn't noise.
- **Short enough not to become the new stay of execution.** An open-ended "we're the broker now" is the same enthusiasm-without-proof trap in different clothes. Six weeks ends Sep 26, leaving two weeks before the pre-existing Oct 13 decision date to act on the read.
- **Funded is the wrong bar for the window.** Large-ticket first-contact-to-funding runs months (Onset's own edge is $10M+ international paper; VFI's funnel loses most volume at proposal→underwriting, $3.2B → $1.2B → $0.6B, dossier §2.1). "Accepted for credit submission" is where the lender has put its own underwriting time on the line — that is the earliest point at which the lead is unambiguously real *to the lender*. Every model in the bake-off that set a funded-deal bar inside the window was miscalibrated; the one that moved the metric to proposal-stage attribution was right.

## 5. Alek's positions, taken seriously

Most of what Alek raised on the 08-14 call is right in direction and wrong in sequence. Each one, in turn:

**a. Keep opening lenders and get rev-share paper signed (Alliance, 36th via Jerman, Providence, Paul/Apollo-sub).** Right that rev-share dissolves the budget objection — *"a zero-risk way to use it"* is exactly why an individual champion whose company won't sign off will sign. Wrong that signatures are progress. Zero-risk paper costs the lender nothing, which is why it proves nothing; Onset is the proof — committee approval, executed-agreement chase, champion gone, $0. Reframe, don't stop: every new lender is a **box to test the signal against** and a **place to hand a deal**. Take the Alliance and 36th conversations, but change the ask from "sign our rev-share" to "give us your box; we'll bring you a deal, and here's the fee when we do." That costs them nothing *and* gives us something.

**b. Hire 1099 brokers to work our leads.** Right idea, wrong week. Two reasons to wait: you cannot brief a broker on a motion nobody has run — the first two weeks of founder calls *are* the product research (what borrowers actually say is the design input for the "why," the scorer, and the touch copy); and a broker who converts off our list proves the broker, not the tool, unless the founders have a baseline to compare against. Week 3+: if calls convert and bandwidth binds, add commission-only labor. Alek's own economics point — package the deal and take a standard broker fee — is correct and *supports* deal-first: the more of the broker's job Quintel does, the higher the take. That is the FDE pattern.

**c. "We don't even need an agreement with the lender — anyone takes a packaged deal."** Exactly. This is the strongest argument in the transcript, and it is an argument *against* spending the next six weeks collecting lender paper and *for* spending them producing a deal. Alek made the case for this memo himself.

**d. A Claude/ChatGPT data-editing interface (add/delete/edit deals, fix websites, revenues, scores).** The need is real — bad websites and revenue estimates break the calls — but the *general tool* is premature and its build cost ("probably going to take a long time") is exactly the time the calling needs. Fix the ~150 companies you will actually call, by hand or with an agent against the DB, and let the touch log tell you which fields matter. An hour of direct write access via a Claude Code session, not a Fable build.

**e. Message David separately and turn him into the Onset champion.** Yes — but the way to make David a champion is to hand him a confirmed need this month, not to ask him for feedback on a tool his colleague left behind. Champions are made by wins, not by check-ins.

**f. Rev-share vs recurring revenue (Simon's own worry, Alek's "less important after the first few fund").** Both right, in order: proof first, floors second. You have no leverage for seat minimums until a deal exists — enthusiasm doesn't pay minimums, a funded deal does. And a rev-share-only book with $0 MRR and multi-month cycles is not operable for long (the bake-off's sharpest question: median first-contact-to-funding in Onset's book — if you don't know it, that is itself the answer). The six-week ledger is what earns the floor.

The tension between the two of you is smaller than the transcript makes it look. You agree on the goal (a deal in someone's lap), you differ on who does the calling and what to build meanwhile — and neither of those differences survives once the calling actually starts.

## 6. What it displaces

1. **Founder-led outbound to lenders and new-logo demos** as the core motion. Retarget the dial block at surfaced *borrowers*. Lender conversations continue only where the ask is "your box, and here's the fee when we bring you a deal."
2. **Building** — the general data-editing interface, team/manager features, CRM integration ("crm stuff," 08-13), seat metering polish. Frozen for six weeks, except the four items in §9.
3. **Counting zero-risk rev-share signatures as progress.** Do the 36th re-open through Jerman; count only deals.

## 7. The six-week shape

- **Week 1 (by Aug 22) — mostly free evidence.** (i) Ask Stauss what happened to VFI's two 07-21 prospects and whether they'd have been worked without Quintel — unasked for three calls, the cheapest evidence in the company. (ii) Count in-box SURFACE items over the last 30 days for VFI's box vs Onset's, and pick the box the signal actually reaches; Onset's edge is international and may be structurally out of reach of US signals (`jerman-juarez-padron-2026-07-29.md:44`); note Onset's own box excluded the entire renewals lane by config (08-11 analysis) — fix that before judging. (iii) Load the partner lender's book (their CRM export) into their account so the surface suppresses known companies — the `book` suppression already exists — which makes the call list net-new by construction *and* produces the coverage/incrementality number four lenders asked for and never got. (iv) Confirm the Onset Master Lease Broker Agreement is actually executed (08-04: re-asked, no date) and send the two-sentence attribution clause: *any company Quintel first-contacts out of the dashboard, plus the register.* (v) Build the §9 P0/P1 items.
- **Weeks 2–5 — call.** Founders call surfaced companies daily off a prepared dial sheet; every touch and disposition logged against the company and its trigger **to the §13 capture schema — every reached call yields Tier 1 at minimum, and the two timing questions are never skipped.** Any confirmed need is handed to the partner lender the same day with the fee stated (Onset: 0.5–1% under paper; VFI: "standard referral fee — do you want it?"). Alek's machine points at borrowers; Simon takes a smaller daily block so he hears the signal himself; the rest of Simon's time is the §9 build and AICAP inside a cap.
- **Week 6 (by Sep 26) — read the ledger.** Then, and only then, decide the business model: stay originator (broker economics, 2–4× the rev-share take, services-shaped) or sell the tool with proof (attribution language, a reference deal, rev-share *with a seat floor*).

## 8. Kill criterion

If, by **Sep 26**, ≥150 net-new in-box surfaced companies have been contacted and there are **fewer than three confirmed live equipment-financing needs, or zero handed opportunities accepted for credit submission** — the signal thesis is falsified for the current signal set. Stop selling sourcing. The remaining wedges are the back-book/renewal play (Ameris/Balboa shape) or deal packaging for credit officers; if neither has a paying buyer within four further weeks, Quintel goes to maintenance and the company's revenue motion is the FDE consulting line.

If ≥3 confirmed needs and ≥1 credit submission: double down; take the ledger to Wingspire / 36th / Alliance / Armada as the story; require a floor on every rev-share going forward.

## 9. What to build to support the motion (weekend-sized, grounded in what exists)

Principle: build only what the six weeks consume, on top of what is already there. The repo already has a fact-bound call-prep **briefing** and **deal angles** per company (`api/book/briefing.service.ts`), prior-lender surfacing in the drawer, `sales_activity` logging `disposition` / `outcome` / `sent`, book-based suppression, contact enrichment stages with a phone-reveal path, the register, and an email outbox. What is missing is thin.

**P0 — Dial sheet + touch log (the working surface).** A nightly batch that selects tomorrow's ~30 companies (net-new, in-box, ranked by trigger recency × score), runs the contact stage so a decision-maker name/title/direct/email is present, and produces the sheet: company, the trigger and its "why," prior lender (UCC secured party), the briefing, contact. Then close the reserved-but-unbuilt `touch` kind on `sales_activity` (dial / VM / email / LinkedIn; reached y/n; disposition per §13) with a one-click log affordance on the prospect drawer, **and a structured capture form built to the §13 schema** — Tier 1 as required fields, Tier 2/3 progressive, dates as dates (maturity, capex window, re-contact) so they can drive re-surfacing. That table becomes the attribution ledger, the calibration dataset (score band → outcome, the repo's own open question), the borrower timing calendar (§12), and the story you take to lenders. Do not build this as a spreadsheet — it has to join to the trigger and to the company.

**P1 — Touch kit (Simon's idea, done right).** From the same fact projection the briefing uses, generate per company: a 20-second voicemail script, email 1 (≤90 words, the signal as the reason, one ask — ten minutes), a LinkedIn note (≤300 chars), and email 2 for day 3 (a second fact or "what a lender in your space did"). Same rule as the briefing prompt: synthesize only from stated facts, never invent. Output to clipboard / a Gmail draft (`mailto:` or Gmail API) / a CSV with custom fields for Apollo sequences — and log `sent`. **Do not build a sender.** ~30 emails a day from a founder's real mailbox beats any outbox for deliverability, and the AgentMail sender-domain blocker (register PRD U6) is irrelevant if you never route customer-facing mail through it. Signal-personalized, founder-signed, human-reviewed is the point; automation is for the drafting, not the sending.

**P2 — Book scrub as an ops step, not a feature.** Get Onset's and VFI's relationship lists as CSV, load them into their account books, and record the net-new rate. Existing capability; the output is the coverage number.

**P3 — Handoff memo.** When a need is confirmed, render a one-page opportunity memo to the lender (company, evidence trail, need as stated by the borrower, contact, timestamp, register lead ID) off the existing render/packaging path. It is the professional handoff *and* the attribution paper trail. Build only after the first confirmed need — not before.

**Do not build this weekend:** the general Claude data-editing interface; more CRM/Salesforce integration; team/manager surfaces; seat/entitlement polish; the UI rework; an automated sender.

## 10. The one assumption this rests on, and how it gets tested

The recommendation assumes **the binding constraint is evidence, not distribution** — that a deal in hand converts the pipeline and that lenders' non-payment is "show me," not "no." Inference, ~75%. The alternative — the data is too thin for the box and the product isn't good enough — is tested by the same calls, faster than by any build: if surfaced companies don't have real needs, or contact data can't reach a decision-maker, the calling week reveals it. Either way the six weeks are not wasted; the build-first path defers the same answer.

Two cheap checks before taking a fee: 30 minutes on state licensing for commercial equipment-finance brokering in the lender's and borrower's states (Onset has already papered Quintel as a broker, so this applies regardless of this memo), and no placing a VFI-box deal anywhere but VFI while Stauss's advisor role stands (*"I just can't do it on competition"*).

---

## 11. What needs to be true for Quintel to succeed — and what the sprint does and doesn't test

Five conditions. The first three are genuinely in doubt; the last two are engineering.

1. **Signal precedes need, inside the box.** Public events (awards, permits, expansions, UCC maturities) must predict equipment-financing demand for companies a large-ticket lender wants, at enough density to fill a rep's day. **Unknown.**
2. **The timing lift is real.** Calling on the signal must beat calling on an Apollo list — higher connect-to-need, or shorter time-to-deal. **Unknown; never measured.** Nobody has dialed off Quintel and off Apollo side by side for a single day.
3. **Somebody works the list.** Customer reps (eight weeks of evidence says they don't) or Quintel. One must be true.
4. **The output is attributable and paid.** Register + first contact. Being solved.
5. **It compounds.** World model + *outcomes* is what makes customer ten cheaper than customer one and answers "we do this with Claude." Outcomes exist only if #3 is true.

The sprint tests 1–3. Nothing else available this month does.

**The risk of not validating.** The answer arrives anyway — from churn, in 6–12 months, at far higher cost, in an industry small enough that a failed pilot at VFI or Onset becomes "tried it, didn't work" in the next ten conversations. And with no outcomes the scorer cannot calibrate, so the product cannot improve; the flywheel has no fuel.

**Can it succeed unvalidated, as "a better reason to call"?** In principle: Bombora and 6sense sell intent nobody verifies per account. But they are horizontal, at scale, sold to marketing ops with a budget line. Quintel is vertical, in a universe of a few hundred buyers, sold to sales managers who asked "what's your hit rate?" three times in one meeting. In a small vertical the buyer will measure. The vitamin path exists — it is the $1,500/mo path — nobody has bought it, it caps at low-single-digit millions of ARR even if it wins the category, and it still requires someone to make the calls for anyone to notice it's better. A vitamin nobody swallows is not a business.

**Painkiller vs vitamin is slightly the wrong axis for this category.** Sourcing tools are rarely painkillers in the "somebody is bleeding" sense; Apollo is a vitamin worth billions because it is *proven*, cheap against a rep, and in the workflow. The axis that matters is **proven vs unproven**: a reason-to-call that demonstrably converts *is* the painkiller for a sales manager measured on production. Alek is right about the product shape (a list with timing and a why; stop hunting for a different pain — the wedge has been re-decided four times already, and two other pains were tested and failed). Simon is right about the bar (real money, unprompted). Neither is produced by building; both are produced by calling and logging. Note the one dimension Quintel structurally cannot win: contact data — it buys contacts from Apollo and Diffbot. It can only win on timing, reason, and ranking, so the comparison is **outcome per dial**, and that number does not yet exist.

**If the sprint produces no submit-ready deal.** It depends entirely on why, and the ledger will say:

| Ledger says | Meaning | Then |
|---|---|---|
| Couldn't reach decision-makers | Data/contact problem; thesis untested — and a finding in itself: the "BDO" can't do the BDO's first job | Fix contact path, re-run; if still unreachable, the seat product is unsellable too |
| Reached; no equipment need behind the signal | Signal set falsified | New signals (renewals lane first — §12) or stop calling it a sourcing engine |
| Reached; need exists; already financed at point of sale / by the bank | Incumbent capture. Value is "find the *next* one earlier," i.e. timing ownership | §12 — the borrower calendar |
| Needs confirmed; not yet at credit submission | **Pass**, not fail — the kill criterion counts confirmed needs (≥3), and the window is honest about cycle time | Hand off, keep working, floors next |

What remains if sourcing fails outright: world model, entity resolution, per-lender box scoring, register, packaging, enrichment infra — Katharine's "Salesforce with EF market intelligence." Sellable, vitamin-shaped, exposed to HubSpot plus a Claude prompt; harder to sell, as Simon says. Or the packaging/placement layer for firms like Bevel, where Ted's pain was the most painkiller-grade in the whole log — a room matching $450M across 75 lenders "off the top of their heads" against a 1990s database, and a champion already building his own tooling at night (`bd/calls/contacts/ted-craver.md`). Not nothing. Not the company on quintel.ai either.

## 12. The borrower side: own the timing, not a login

Simon's line of thought (2026-08-16): borrowers are the hard side; with a deal in hand a lender is easy; a lender must catch the borrower at the right time and so re-dials every six months; how do we turn one borrower call into a lasting relationship — and would a borrower-facing tool (memos, an equipment-portfolio tracker) do it?

**The core insight is right, and it is the LendingClub lesson: whoever owns the borrower's timing owns the deal.** Quintel cannot control capital, so the only side left to control is the relationship. Where the reasoning goes wrong is the *form*. A tool a CFO logs into for an event that happens every two to three years is the vitamin of vitamins — Simon says so himself about the memo tool — and a portfolio tracker competes with the fixed-asset register and lease-accounting system they already keep. That is the marketplace-shaped move; the small-ticket marketplaces are unloved for a reason.

**What lets brokers own borrowers is not a platform; it is a calendar and a reason.** Quintel's edge is that it can run the calendar for ten thousand companies:

- **The "re-dial every six months" problem is already solved in the data.** A UCC-1 filed in 2021 on a 60-month lease matures in 2026. That is the renewals lane — 9,139 events — and Onset's box excluded it by config (`planning/2026-08-11-customer-trigger-surfacing-analysis.md`). A known maturity date is the most painkiller signal in the system: exact timing, a real reason to call, a named incumbent to beat, and (per Ameris/Balboa) exclusivity as a fact when it is the lender's own back book. Turn it on for every account.
- **Every borrower call collects the timing that isn't public.** Two questions — *when does your current equipment financing mature?* and *when is your next capex cycle or budget window?* — turn a not-now borrower into a dated future call instead of a dead lead. That is "one call → supply-side relationship" with zero borrower-side product. §13 makes them mandatory.
- **The reason for the next touch is content, not software.** "We'll send you a market read on terms for your asset class as your lease approaches maturity" — event-driven, borrower-valued, and it is the signal brief already produced for lenders, pointed the other way. Cheap. It also doubles as the borrower-side product discovery: if CFOs say yes to that, you've found the thing they'd want from you; if they don't, you didn't build it first.
- **The data asset is real, and it's on the borrower side.** Borrower-stated timing on top of public signals is ground truth no lender has about companies outside its book, collected by Quintel with no contribution or CoI problem. That is the pooled moat from the supply side — and it accrues from calls, not logins.

**Prosper / LendingClub, applied.** (Simon's summary of their arc: origination-fee economics that needed ever-growing volume; retail capital never showed and institutional capital was fickle; CAC ate them because unsecured personal loans are commodity and one-shot while banks cross-sold at zero CAC; a governance scandal; LendingClub bought a bank, Prosper shrank. Lesson: matching borrowers to capital is only a business if you control the capital or the customer relationship.)

| Their lesson | Quintel mapping |
|---|---|
| Origination fees need constant volume; no annuity | Rev-share is that. Simon's recurring-revenue instinct is validated — floors *after* proof. EF is structurally kinder: equipment buyers repeat (fleet replacement, expansion, refi) where a personal loan is one-and-done, so the borrower book has repeat value. |
| Fickle capital | Quintel holds no loans, but lender boxes tighten in downturns; a placement firm with 75 lenders survives that better than one with two. Don't single-thread on Onset. The world model is exactly what re-routes deals when boxes move — a real advantage over a broker's head. |
| CAC on a commodity, one-shot product | The sharpest one, and the argument for large ticket. If a confirmed need costs ~100 dials (~$1K of rep time), that is fine against a $20K fee on a $2M deal and fatal against $2K on a $200K one. Intermediary economics do not work small-ticket without a captive channel. "Mid-market/large only" is this lesson correctly applied. |
| Control capital or the customer, or get squeezed from both sides | Why attribution-by-first-contact and borrower timing data matter: they are the mechanism by which Quintel controls the relationship instead of being a lead-gen shop squeezed by "we already knew them." |
| Governance / trust | An intermediary's whole asset is trust; in a small industry one mis-attributed deal or one leaked borrower confidence ends it. (See the anonymized-Katharine incident with Wingspire.) |
| — | **What LendingClub had to invent that Quintel doesn't:** the intermediation. EF already pays brokers 1–3%; Onset said "it's usually per deal" unprompted. Fee structure and buyer behavior already exist. |

**The fork this exposes — decide by Sep 26, not before.** Every thread here — supply side is the hard side; with a deal a lender is easy; own the timing; convert one call into a relationship; gather borrower-side data — points at one company: **an AI-native origination firm whose moat is borrower timing data, and whose software is what lets two people run the calendar for ten thousand companies.** Lenders are the paying demand side; the deal is the product; the seat software is how a lender's own reps later plug into the same engine. It is not a marketplace and not a SaaS vendor; it is a services-shaped business with a data asset, and it is a different company from the one on quintel.ai. Fact: that this is where the reasoning points. Inference (~65%): that it is the right company — revisable on one number, the confirmed-need rate the sprint produces. The sprint is identical under either answer; what gets built after Sep 26 is not. The open question for the founders is whether they are willing to *be* the broker — the company that owns the borrower relationship — rather than sell software to brokers and lenders.

## 13. Borrower call capture — maximize every call

Purpose: no reached call ends without producing something durable. Each field below feeds at least one of six uses: **(S)** signal calibration — does the trigger mean anything; **(A)** attribution — first contact, on the record; **(T)** the timing calendar — the §12 asset; **(B)** borrower-side product discovery; **(D)** data quality — Alek's point, fixed on the companies that matter; **(L)** the lender story — what you take to Wingspire/36th/Alliance.

Design rules: structured codes and real dates, not prose — prose goes in the note; a three-minute call cannot carry thirty fields, so capture is tiered; **Tier 1 is mandatory on every reached call and the two timing questions are never skipped**; every field joins to the company and the trigger; script versions are logged so changes are attributable.

**Tier 0 — every touch (auto or one click).** Channel (dial / VM / email / LinkedIn) · reached y/n · who called · script version · duration · trigger event id · surfaced score at time of touch **(S, A)**.

**Tier 1 — every reached call, ~60 seconds, mandatory.**
1. **Right person?** name / title / role in equipment decisions (decides · influences · refers) · direct line / email confirmed or corrected **(D, A)**
2. **Signal check** — is the triggering event real and known to them? y/n/partly **(S)**
3. **Does it imply equipment?** y/n · asset class · new/used · rough cost band **(S)**
4. **Financing status of that need** — cash · bank line · vendor/captive at point of sale · broker · independent · lease vs loan · not decided · *already signed* **(S, L)**
5. **The two timing questions:** *when does your current equipment financing mature?* (lender + month/year, per facility if volunteered) · *when is your next capex cycle / budget window?* (month/quarter) **(T)**
6. **Disposition code** — need confirmed in-box · need confirmed out-of-box · need but already financed (with whom) · no equipment need · not now → **dated re-contact** · wrong person → referred to (name) · do-not-contact **(A, S)**
7. **Permission** — OK to follow up (channel) · OK to introduce a lender · OK to send a market read at maturity **(T, B)**

**Tier 2 — if the conversation continues, the standing profile (~2 minutes).**
- Existing equipment financing: lenders (bank / captive / independent), approximate balances, maturities in the next 12–18 months, preferred structure (lease vs loan; FMV / TRAC / $1-out), typical term **(T, L)**
- Primary bank relationship; do they finance equipment through it; are they happy with it **(T, L)**
- Broker use — do they use one, who, why **(L)**
- Next planned equipment purchase — what, when, size; what triggers it (contract, fleet age, expansion, replacement cycle) **(T, S)**
- **The last financing, in their words** — what was hard: took too long · bank wouldn't do the asset · rate opaque · needed higher advance · vendor pushed one lender · had to call eight lenders — *the borrower-side pain question; do not pitch during the answer* **(B)**
- Would it be useful if we sent a market read on terms for your asset class as your maturity approaches? y/n — and what else would you want from someone like us? **(B)**
- Firmographic corrections — revenue band, employees, ownership (PE-backed → sponsor), locations, website/phone **(D)**

**Tier 3 — if a need is confirmed (the handoff).**
- Equipment spec, vendor/dealer, quote in hand y/n, cost, delivery timing · desired structure and term · entity name / guarantor posture / years in business · who else is quoting · decision date · documents they can share now **(A, L)**
- Register lead id · lender handed to · date/time · handoff memo sent · lender response (accepted for review · declined — reason · proposal · credit submission · funded) **(A)**
- Referrals — other locations, sister companies, their vendor/dealer contact **(T)**

**What each tier buys, going forward.** Tier 0+1 alone answers §11's conditions 1–3 (signal → need → worked → attributed) and yields the score-band → outcome join the repo lists as its own open calibration question. Tier 1 item 5 alone builds the borrower calendar — after 150 calls that is 150 dated future reasons to call that no lender has. Tier 2's pain and "what would you want from us" questions are the borrower-side product discovery — done by asking, not by building. Tier 3 is the attribution paper trail and the deal story.

**Two rules for the caller.** The maturity and capex-window questions are asked on every reached call, including "no need" calls — the not-now borrower is where the calendar comes from. And a "no" is logged with the same care as a "yes": a clean *no equipment need* against a strong signal is the calibration data that makes the scorer honest.
