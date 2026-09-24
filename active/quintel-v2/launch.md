---
status: v0.3
last_revised: 2026-09-22 (three-phase commercials after David's reply to Alek's one-pager)
owner: Simon and Alek
serves: the immediate plan after the 09-19 kickoff with David: the math, the next moves, the follow-ups on both sides, ledger v0, the email infrastructure, and what to do when the vendor ICP arrives
tier: internal (shareable with Alek in full; the follow-up list in §4 is written to be lifted into an email to David)
relationship: `gameplan.md` is the strategy. This is the next six weeks.
---

# Launch: the next six weeks

## 1. The so what

The kickoff settled three things. We are paid on funded deals through Providence's referral-fee mechanism, not on applications and not on a revenue share that ownership never approved. Vendors are the lane that reaches the volume that matters; end-user email and partner sources feed it but cannot carry it. David is the desk everything routes through until he has juniors, so the operating contract is with one person and needs Providence's signature on the part Providence pays.

The math in §2 says the business is worth doing at 15–20 attributed funded deals a month, which is also the number at which David gets his team. Getting there is a vendor-acquisition problem with a base rate against it (one rep's 27 vendors in 14 years, six of them productive). The bet is that a fixed website, a financing tab that gives the buyer a monthly on the spot, and a two-hour answer beat golf. Six weeks is enough to know whether vendors respond to that offer at all.

**What the weekend added (09-20/21).** David checked Providence's funded vendors of the last 18 months against his own ideal vendor profile and 89% match on five traits: no financing tab or a stale one, mostly used equipment (specialty trucks, vehicles, cranes), under five locations, small towns, and most of them listing on online marketplaces. That is Providence's book, not an opinion, and it changes how we source: the marketplaces are the dealer roster, with lane, price band and listing volume per dealer, which beats association directories. He also sent twelve more industries (§7) and his own team asked him why they call end users when vendors hold the key. His answer, that the way to win a vendor is to fund its deals fast, is the offer's second half: our site and tab open the door; his two-hour answer keeps it open. The test does not change: 200 sourced, 50 read by him, two live in six weeks.

## 2. The math

All figures are working assumptions. Facts from the call are labeled; everything else is ours to test.

### 2a. What a deal is worth

| Input | Value | Source |
|---|---|---|
| Providence gross margin per funded deal, typical | $6–7K | fact (David's spreadsheet, zeros and outliers removed) |
| Split | 50% house, 45% AE, 5% sales manager | fact |
| Referral fee Providence pays on a sourced deal | up to ~$1,000, tiered by fee; the most David has paid | fact for the mechanism; the cap is his experience, not policy |
| Share of the AE's 45% David is willing to give | open; "we figure out how to divvy up the pie" | his words |
| Ceiling on any system-wide cut of the house side | 2–3% "possible"; 15–30% "dead on arrival" | his read of ownership |

**The chart to propose.** A percentage with a floor and a cap is easier to audit than a step table and scales with the packaging-size deals David wants to pursue.

| Deal GM | Referral fee (15% of GM, floor $250, cap $1,500) | Share of David's 45% at 20% | Total per deal via David | Total via another AE |
| ------- | ------------------------------------------------ | --------------------------- | ------------------------ | -------------------- |
| $3,000  | $450                                             | $270                        | $720                     | $450                 |
| $5,000  | $750                                             | $450                        | $1,200                   | $750                 |
| $7,000  | $1,050                                           | $630                        | $1,680                   | $1,050               |
| $10,000 | $1,500                                           | $900                        | $2,400                   | $1,500               |
| $20,000 | $1,500 (cap)                                     | $1,800                      | $3,300                   | $1,500               |

Working number: **~$1,700 per attributed funded deal through David, ~$1,000 through anyone else.** If David's chart is flat tiers instead, accept it as long as $7K GM pays at least $900.

**Revised 09-22, after Alek's one-pager and David's reply** (`data/alek-proposed-commercials-2026-09-22.md`). Alek sent 12.5% of GM capped at $1,000 plus 25% of David's commission. David's 45% is paid post-tax (about 43% withheld), so a share of gross paid from net is roughly 44% of his take-home; he proposed three phases instead. The structure now planned:

| Phase | Trigger | Quintel is paid | Per $7K deal |
|---|---|---|---|
| 1 | now; referral fee confirmed in writing by ownership or CFO | PCF referral fee only, 15% of GM with the $1,000 cap kept. Nothing from David's pocket; the share of his commission is dropped in exchange for the 2.5 points | ~$1,000 |
| 2 | fifth attributed funded deal or day 60, whichever first; terms written now | PCF referral fee cap lifted to $1,500 (asked in the same ownership conversation) + 10 GM points carved from David's 45%, paid by PCF pre-tax as a deal expense. Fallback if PCF will not process it: 25% of his after-tax commission by letter | ~$1,650 |
| 3 | $1MM attributed GM or twelve months (about 150 deals) | system-wide conversation with ownership: house side, API | open |

Decided 09-22 (Simon): phase 1 is the referral fee alone, bumped to 15% as the trade for dropping the share of David's commission. It costs David about $80 a deal through the split, PCF already pays fees like it, the cap ownership sees is unchanged, and it leaves phase 2 as the only negotiation. Condition that makes it real: **Quintel is the coded referral source on every deal we originate, vendor deals included;** vendor incentives in phase 1 are non-cash or out of our fee. Phase 2 nets David more than the one-pager did (~$1,220 vs $882 at $7K) and pays us slightly more, which is the argument for a counted gate rather than "as we show capability." Working number for the model: **~$1,000 in phase 1, ~$1,650 from phase 2** ($1,050 fee + $612 carve at $7K GM). The cap stays at $1,000 in phase 1: it is the number ownership sees, and it moves with a track record in hand. The month-6 column in §2c becomes $22–30K if phase 2 has kicked in by then, which the count implies; the go/no-go does not move.

**How to think about the phases (Simon, 09-22):** phase 1 proves it works, phase 2 pays for what we bring and scales it consistently, phase 3 is growth. Sharpened: each phase is defined by who has to say yes and what evidence earns it.

| Phase | The question | Who says yes | Evidence that closes it |
|---|---|---|---|
| 1, prove | does the mechanism work end to end: entry through us, funded by David, coded and paid by PCF | David, on a program PCF already has | 5 attributed funded deals, coded and paid |
| 2, earn | is it repeatable, and does the vendor lane carry it | PCF acknowledges Quintel on the deal as a line item | 2+ vendors live, ~10 deals a month, David on his number |
| 3, grow | is this a channel Providence builds around, not one rep's side project | ownership, as a counterparty | $1MM attributed GM, David has juniors |

Phase 1 proves the mechanism, not the lane; the vendor test (200 sourced, 50 read, two live) runs inside it on its own clock. Phase 2 is where David's incentives and ours coincide: the count he shows upstairs is the count that makes us worth a line item. Phase 3 changes the counterparty from David to Providence, and is where the house side, the API and anything Providence-branded come back on the table.

**The one-slot question (open, decides vendor economics):** PCF pays one referral fee per deal to the coded source. Either vendor-sourced deals code the vendor and we live on the carve, or we are source of record on everything we bring and vendor value stays non-cash. David's 18-month vendor check can say how many funded vendors took a fee.

**What the 2–3% system-wide figure is worth:** 2.5% of the house's $3,500 is $88 a deal. Not a business. Park it as a floor for a later system-wide agreement; do not spend a call on it.

### 2b. What each source produces

| Source | Yield | Deals per unit of effort | Note |
|---|---|---|---|
| Cold email to end users | ~900 sends → 1 application (fact, Alek) → ~10% application-to-funded (fact, Providence's 50-to-5 daily ratio) | **~2 funded deals per 10,000 sends**, ≈ $3,400 | at 9 mailboxes (~6,000 sends/mo) that is about one deal a month. Needs 30+ mailboxes to matter, and the list has to hold up at that volume |
| David's calls on our lists | ~300 dials → 0 applications so far | 0 | continues as the labeling lab, not as a source |
| Active vendor relationship | 2–3 deals a month, steady (fact, David's expectation; matches the star ratings on his 21) | **~2.5 deals a month ≈ $4,200/mo per vendor** | one productive vendor equals ~12,000 end-user emails a month, every month |
| Shop or technician link | untested | unknown | the fee-stacking problem (§2d) makes cash carrots hard; non-cash carrots only |
| Trade show (one, worked David's way) | untested by us; owners "make their living" on it (fact) | unknown; the list side is cheap | decide by 09-26 (§5) |

The line that matters: **one productive vendor is worth more than the whole email operation at pilot scale.** Email's job is to find vendors and to feed the lab, not to fund the company.

### 2c. What the business looks like at three sizes

Assumes $1,700 per deal via David, vendors at 2.5 deals a month, and the vendor base rate as the headwind.

| Stage     | Productive vendors | Other sources                     | Funded/mo | Revenue/mo | What it means                                                                                                  |
| --------- | ------------------ | --------------------------------- | --------- | ---------- | -------------------------------------------------------------------------------------------------------------- |
| Month 1–2 | 0–1                | email, first shop links           | 1–3       | $2–5K      | proves the mechanism: a deal coded to us, a referral paid                                                      |
| Month 3–4 | 2–3                | email at 20+ mailboxes            | 6–10      | $10–17K    | David is at ~$60K GM from our flow; still no juniors                                                           |
| Month 6   | 5–7                | trade-show follow-on, second lane | 15–20     | $25–35K    | David at $105–140K GM from us, within reach of his $150–200K target and a team; owners' API conversation opens |

**Ceiling check.** Providence funds 50–60 deals a month in total. Twenty a month through one AE makes him the top producer in the building. Above that the constraint is David's bandwidth, then his juniors, then ownership's appetite. Plan to the month-6 column; treat anything beyond as a different conversation (the one about APIs and a system-wide agreement).

**Our cost side** is small: email infrastructure under $600 a month at 30 mailboxes, verification and data pennies, one trade-show trip if we go. The real cost is founder time, which is why the month-6 column is the go/no-go: **if by mid-November attributed deals are under five a month and fewer than two vendors are live, the vendor offer has not landed and the lane is wrong.**

### 2d. Fee stacking, the constraint underneath

Every party is paid from the same $7K: the vendor asks what is in it for him, a shop wants a finder's fee, we take the referral, the AE keeps his half, the house keeps its half and the residual. David's rule is right: past about a third of GM to outside parties, nothing is left and ownership kills it. Working budget: **us ~$1,700, all partner cash combined under $500 a deal, and prefer non-cash partner value** (the website fix, the financing tab, a two-hour answer, funding in five to six days). Rate promotions at trade shows are Providence's pricing decision, not a fee.

### 2e. What we ask David to agree to, in writing

1. Referral fee on every attributed funded deal, per the chart, paid by Providence, coded by the AE at deal level. **Countersigned by an owner or the CFO.**
2. Phase 2 written into the same document: ten GM points carved from David's side, paid by PCF pre-tax, from the fifth attributed funded deal or day 60; fallback by letter on his after-tax commission. Quintel is the coded source on every deal it originates.
3. Attribution rule: the deal entered through our funnel or our vendor (our timestamp); Providence's application date is after it; funds within 12 months; any AE. Ledger row is the record.
4. Cost sharing on infrastructure he asks for (domains he wants under Providence's name are Providence's to register and pay for).
5. Sales manager's 5% and the house's 50% untouched. Say it in the letter.

## 3. Next moves, in order

| #   | Move                                                                                                                                                                                                                                                                                             | Owner                           | By                           | Depends on                                               |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- | ---------------------------- | -------------------------------------------------------- |
| 1   | Numbers back to David: the chart in §2a, the volume model in §2c, the five points in §2e                                                                                                                                                                                                         | Simon                           | Tue 09-23                    | nothing                                                  |
| 2   | Ask David to get the referral-fee arrangement confirmed by ownership or the CFO in writing                                                                                                                                                                                                       | Alek (relationship)             | ask 09-23, answer by 09-30   | #1                                                       |
| 3 | Site brand decided: **Ironmark**, ironmarkep.com registered 09-22. Now: sending-domain family (lookalikes of ironmarkep), mailboxes, warmup; trust page v0 before the first send (~10-06) | Simon | domains 09-23, page v0 09-29 | none |
| 4   | Vendor scrape v0: 200 ranked dealers, sourced from marketplace dealer pages first (MachineryTrader, EquipmentTrader, IronPlanet, Machineryline, SurplusRecord), then association lists; scored on the five funded-vendor traits (§7)                                                             | Simon                           | 09-26                        | ICP received 09-20; first 50 to David for a read         |
| 5   | Ledger v0 live and shared with David (§6)                                                                                                                                                                                                                                                        | Simon                           | 09-24                        | nothing                                                  |
| 6   | Trade-show go/no-go: one show before the holiday gap, or Q1 with the list built now (§5)                                                                                                                                                                                                         | Simon + Alek, David's one-pager | 09-26                        | David's flow doc                                         |
| 7   | State lists for David's calls in his dial format, 100 each. **Indiana shipped by Alek 09-21** (`data/in-fit100-dial-2026-09-21.csv`: vac 35, tow 26, roll-off 24, HDD 9, concrete/crane/paving test 6; phones Twilio-valid; UCC unchecked; CRM clearance pending). Colorado, Texas, Georgia next | Alek builds, Simon tools        | rolling from 09-24           | David's order; add the one question in #14 to his script |
| 8   | Loss-signal Florida 100 (already built to ship): send as planned; it is cheap and the read is free                                                                                                                                                                                               | Simon                           | 09-22                        | nothing                                                  |
| 9   | Site v1 partner door reframed as the embeddable calculator with seller pre-fill; spec in `site.md`; build starts                                                                                                                                                                                 | Simon                           | spec 09-24, build from 09-29 | nothing                                                  |
| 10  | Website audit template: the fifteen-minute read of a vendor's site (lender listed, financing tab, backlinks, mobile, contact) that becomes the opener                                                                                                                                            | Alek drafts, Simon tools it     | 09-26                        | #4                                                       |
| 11  | Vendor email arm: sequence for the salesperson, not the company; offer is the audit and the tab                                                                                                                                                                                                  | Alek                            | 09-30                        | #3 warmup, #10                                           |
| 12  | Compliance read on referral fees and finder's fees by state, plus the calculator disclosure line                                                                                                                                                                                                 | Simon (counsel question)        | 10-03                        | nothing                                                  |
| 13  | American Equipment Exchange: on the 09-23 agenda (`tearsheet_2026-09-23.md` §4): ask his reading first, then the three questions for AEX and the decision rule (they show the tab = pilot vendor; lender number only = his own time)                                                             | Simon                           | 09-23                        | nothing                                                  |
| 14  | One question added to David's end-user script: "where did you buy your last unit, and did they arrange the financing?" Every call, including the no's, becomes a vendor lead on the demand side; the answers are logged to the vendor tab                                                        | Alek asks David                 | 09-23                        | nothing                                                  |
| 16  | Contact-seller test: twenty hand-sent messages to marketplace dealers (5+ listings, truck lanes, no financing on their own site); rule 3 of 20 replies                                                                                                                                           | Simon                           | 09-26                        | §7d                                                      |
| 15  | Lane pick for the six weeks: two truck lanes (hydro vac / pump trucks, box and work trucks, tow and cranes as the used-truck core) plus one machinery lane (packaging and food processing). The other nine industries wait for a registry and a source each                                      | Simon proposes, David confirms  | 09-23                        | §7                                                       |

Weekly cadence from 09-23: Tuesday, numbers and ledger review with David (30 minutes); Friday, one line changed in `gameplan.md`.

## 4. Follow-ups

Written to be lifted into an email. Ours first, then his.

**Quintel will**

- Send the commercial proposal in numbers by Tuesday 09-23: fee chart, attribution rule, what is left untouched.
- Stand up the shared ledger by 09-24 so every application we send shows pulled / approved / funded / referral coded, live, and replaces the spreadsheet handoff.
- Deliver the Florida loss-event list (100 rows, his template) on 09-22, and Colorado, Texas, Georgia and Indiana lists at 100 rows each from 09-24, in the order he prefers.
- Build the first vendor list (200, ranked on his five funded-vendor traits, sourced from the marketplaces he named) by 09-26, and send him the top 50 to read before any outreach.
- Draft the vendor outreach and the website-audit offer for his review by 09-30.
- Bring a trade-show recommendation by 09-26: one show before the holidays or a Q1 plan with the exhibitor work done now.
- Register and warm our own sending domains this week.

**We are asking David for**

- ~~The vendor ICP he described (Monday), including the two additional industries and the packaging lane.~~ Received 09-20 (five traits) and 09-21 (twelve industries). Still open: the finished 18-month vendor check when his keying is done, with the count behind the 89%, and the vendors themselves if he can share names and lanes (not customers).
- Which three of the twelve industries to work first. Our proposal: hydro vac / pump trucks, box and work trucks, and packaging with food processing. Confirm or reorder.
- What he has in mind for American Equipment Exchange: a vendor to sign, a place our buyers are, or a source of sellers who are about to replace a unit.
- How he wants his dial time split now between end users (the lab lists) and vendors, given his own team's question. If vendors get the calls, the state lists slow down and the vendor list speeds up.
- Who is on the after-hours team, and whether they are Providence staff. It matters for who keys the ledger and for the referral coding.
- One question added to the end-user script (where they bought the last unit, who financed it), and the answers written on the row.
- The list of states to work and the order.
- The one-page trade-show flow (steps, timing, what goes to exhibitors before the show) and which show he would pick if only one fits before November.
- His referral-fee chart as he would write it, and confirmation from ownership or the CFO that Providence pays referral fees at deal level to an outside source. This is the one item that has to be in writing before we scale.
- The April email copy that ran, with its bounce, reply and meeting numbers, if any.
- What he needs in the ledger to get credit in the CRM: the fields, and whether a shared sheet he keys from is enough for now.
- Whether Providence permits an AE to share his own commission with an outside party by letter.
- For Providence-branded state domains: Providence registers and pays; we will run sends from them if ownership authorizes the brand in writing. We hold our own domains for our brand.

## 5. Trade show: decide by 09-26

David's case: highest intent in the room, the owners built the business on it, the exhibitor list is a vendor list per lane, and the floor map tells you who is small (periphery booths, upper floors). His mechanics: exhibitor list → periphery filter → financing-tab scrape → 5–7 touch sequence three weeks out → booking link → he walks the floor with appointments. Our side is the list and the sequence; his is the body.

Decision inputs: which shows in the preferred lanes run between now and the end of October (he named Pack Expo in Chicago; verify dates and lane fit before assuming), whether David can travel, and whether a three-week sequence still fits. If nothing fits, do the list work for the first Q1 show anyway; it is the same scrape as §7.

What we will not do yet: our own booth, spend on geofencing or texting, or anything that puts our brand on his floor before a vendor has used the tab.

## 6. Ledger v0

**Superseded 09-22 by `ledger.md`** (the scope for David's feedback: jobs, fields, views, build order). This section stays as the record of what he said.

### What David needs, in his words and ours

- **He keys everything by hand into ListPad** and cannot get credit for a deal unless it is in the CRM. Every application we send costs him a manual entry. He will hire a data-entry person at his cost before ownership gives an API, which they will discuss at ~$200K a month of revenue.
- **He runs on Excel** and called it stupid. He wants a live view: application pulled, approved, funded, with the boxes ticking as they happen, so both sides see the same state.
- **He needs to code the referral source on the deal** at the moment he creates it. If the source is not on the deal, nobody gets paid and no one can audit it later.
- **His two-hour rule.** A vendor who sends an application hears back inside two hours or David is "dead." Anything we route to him has to arrive with what he needs to say "doable" fast: equipment, price, the business, years, fleet, state, lien history, the phone.
- **He is the only technical person in the building** and Providence has no IT team. The ledger cannot depend on Providence doing anything but reading and typing.
- **He wants the feedback loop to run both ways.** He is "more motivated than you" to say what is working so we can find the next vendor. The ledger is where that lands: reason codes on every dead deal.

### Requirements

- **One row per application** we route, created by us at handoff. Never a row for a name that has not asked for a number.
- **Fields at creation (ours):** ledger id; source (email arm / vendor name / shop / trade show / site); entry timestamp; business name; state; equipment; price band; new or used; years in business; fleet band; timing; lien and lender on file; verification result; contact phone and work email; the sending campaign and arm if email; the vendor id if vendor-sourced.
- **Fields David sets (four flags, each with a date):** contacted; application pulled; approved / declined; funded / dead. Plus: AE of record, GM on the deal, referral coded (yes/no), reason code when dead (credit, timing, price, went elsewhere, unreachable, out of box, other) and a free-text line.
- **States**, matching `funnel.md` §8: `routed → contacted → application → approved | declined → funded | dead`, with `parked` for later timing. Every transition timestamped. Nothing is deleted; a wrong row is marked void.
- **No PII beyond the business contact.** No SSN, DOB, home address, bank data. Providence keeps those.
- **Attribution embedded:** the row is the record. Entry timestamp before application date, funded within 12 months, any AE.
- **Referral reconciliation view:** monthly list of funded rows with GM, fee due per the chart, paid date. This is the invoice.
- **Reads for us:** conversion by source, by state, by lane, by arm; time from routed to contacted (his two-hour rule, measured); dead reasons by source. These are the signal experiments' outcome columns, so the ledger feeds `signals-execution.md` directly.
- **Export in David's template** on demand so he can paste into ListPad.
- **Access:** Simon and Alek edit everything; David edits his columns; nobody else until juniors exist.

### Build

v0 is a Google Sheet backed by the flpool Postgres: we write rows from the pipeline, David types in his columns, a nightly pull copies his columns back so the reads run in SQL. Two tabs: Applications and Funded (the reconciliation). Ships 09-24. v1 (weeks 4–6) is a page on the site with a login for David, the same columns, and a Slack or email ping to him on every new row so the two-hour clock starts on his phone. The API into ListPad is the owners' conversation, not ours to build first.

## 7. The vendor ICP arrived: what it says and what we do with it

### 7a. The profile is Providence's funded book, and it is a used-equipment dealer

David's 18-month funded-vendor check (partial, over 89% matching; `data/david-ivp-2026-09-20.md`) gives five traits: no financing tab or a stale one; mostly used equipment (specialty trucks, vehicles, cranes); under five locations; small towns; and over 60% listing on Facebook Marketplace or an online marketplace (MachineryTrader, EquipmentTrader, IronPlanet, Machineryline, Equipt, SurplusRecord). Fact about Providence's funded vendors as keyed so far; the final count is days away.

What it corrects in our own profile: the vendor is less "manufacturer-direct" and more **the small used-equipment dealer that lists online because it has no other distribution.** Manufacturer-direct survives only in the machinery lanes (packaging, food processing). It also explains the stale-tab trait: a dealer that had a finance partner once and lost it is the warmest vendor there is, because the tab slot already exists and the salesperson remembers what it did for him.

Survivorship caveat, labeled: the profile describes vendors that funded with Providence, a lease shop with residuals in the near-prime band. It does not say these dealers are the most productive vendors in the market, only the ones whose buyers Providence approves. For our purposes that is the right set; we are building for Providence's desk.

### 7b. Twelve industries, three lanes for six weeks

Preferred Industries II: food processing equipment; general packaging; pharmaceutical (likely nutraceutical) packaging; lab equipment; HVAC; hydro vac and pump trucks; paving; portable toilets; recycling; robotics; spray foam; box and work trucks.

They split three ways, and the split decides the source and the copy:

| Group | Industries | Vendor looks like | Source | Six-week status |
|---|---|---|---|---|
| Used specialty trucks | hydro vac / pump trucks, box and work trucks, portable-toilet trucks, paving; plus tow and cranes from the 89% | small dealer, used inventory, marketplace listings, one to three lots | marketplace dealer pages, then TruckPaper and association lists | **work now** (two lanes) |
| Plant and machinery | packaging, food processing, pharma/nutraceutical packaging, robotics, recycling, lab | manufacturer-direct or used-machinery dealer; $30–200K units; buyers with a controller | SurplusRecord and Machineryline dealer pages; Pack Expo and Process Expo exhibitor lists | **packaging + food processing now**; the rest queued |
| Contractor rigs | HVAC, spray foam | equipment supplier or rig upfitter; $50–150K rigs; the contractor is also the technician-channel borrower (T19) | supplier dealer locators (spray-foam rig builders, HVAC supply houses) | queued; revisit with technicians |

Inference (medium): robotics, pharma and lab vendors mostly have a lender or a captive on the site already, so they fail trait one. Check on the first 50 rather than argue it.

### 7c. The pipeline, revised for marketplaces

1. **Filters from the five traits:** no financing tab or a stale one (the scrape); used inventory share; location count under five; town size (population or distance from the nearest metro); marketplace presence and listing count. Disqualifiers stay: a live lender or captive on the site, Wells Fargo or bank-backed dealers.
2. **Source dealers from the marketplaces first.** A marketplace dealer page gives name, lot locations, lane, price bands, listing count and often the salesperson's name and phone in one place, which is the profile and the size read at once. Then association directories and manufacturer dealer locators for the machinery lanes, exhibitor lists from the shows in §5, and his 21 as the seed. Facebook Marketplace is not sourceable at scale; skip it. Read the marketplace terms before any bulk pull; dealer directory pages at research volume are the working assumption, not inventory scraping.
3. **Demand-side discovery, free:** every end-user call David makes asks where they bought the last unit and who financed it. The answers are vendor leads that already match the profile (small town, used, the buyer got financed somewhere or nowhere).
4. **Score and rank to 200;** David reads the first 50. His verdict on those is the calibration, as with the borrower lists.
5. **Outreach arms:** A, David's phone (his own team wants this); B, our email to the named salesperson: the site read, the stale tab named, the tab offered, and the second half of the offer in his words: send us the deal you have stuck and hear back in two hours. Both land on the vendor tab of the ledger.
6. **Vendor states:** sourced → contacted → interested → audit delivered → tab live → first deal → productive (2+/mo). "Live" is the tab on the site or one application through David.
7. **Free-work cap** of half a day per vendor until a deal funds. The stale-tab dealers are the cheapest fixes: the slot exists, we replace what is in it.

### 7d. American Equipment Exchange, before the meeting

What the page says (read 09-21): a listing marketplace for used heavy equipment, trucks, machines, parts and attachments; sellers pay $50 per listing for 30 days with no commission; users are verified through Equifax; nationwide shipping; and it advertises easy financing for buyers, provider unnamed. It buys Google ads on "sell heavy equipment," so its supply side is owners disposing of a unit.

**The contact-seller button (Simon 09-21).** Every listing has one, on AEX and on the bigger marketplaces. It is one-to-one outreach to a seller who is the ICP by construction, with the personalization built in (the unit, the price, the missing financing). Split by listing count: one listing is an owner disposing of a unit, which is the loss-signal feed, not a vendor; five or more is a dealer. Test: twenty messages by hand this week to dealers with five or more listings in the two truck lanes and no financing on their own site, one ask each. Three replies of twenty makes it a lane; otherwise the marketplaces are a roster only. Never a sequence through the button; it exists for buyers.

**The PayPal-on-eBay pattern, applied.** PayPal never partnered with eBay; sellers put "PayPal accepted" in their own listings and the listing became the billboard. Our version: a dealer pastes one line and a link into his own listing descriptions ("see your monthly on this unit") with no platform permission. The marketplace's own financing button is the Billpoint in the story: proof the buyer expects financing there, and beatable only at the moment of use (a monthly now, an answer in two hours). Where the analogy breaks: no network effect, since the buyer carries nothing between dealers; every dealer is a fresh sale, and the platform will eventually object to links in listings, so the tab lives on the dealer's site and the marketplace is for finding and contacting.

Three ways David could mean it, and the question for each: a vendor to sign (whose financing is behind the button, and would they add a second); a place where our buyers already are (can a lender or a calculator be presented on a listing); or a source of sellers about to replace a unit, which is the loss-and-cohort hypothesis in `gameplan.md` §2 with a live feed behind it. Do not research past one page until he says which.

### 7e. What David's own team just told us

His after-hours group asked why they call end users when vendors hold the key, and he answered that vendors are won by funding their deals fast and painlessly. Two consequences. First, vendor-first now has his side's conviction, not just ours, and his dial time may move to vendors; ask how he wants to split it, and let the state lists follow his answer rather than the roadmap. Second, his mechanism needs a first deal to demonstrate, which is why the opener has to carry one: the stuck application, the buyer on the lot with a monthly, the tab that produces the first file. The website work gets us in the room; the two-hour answer is what he sells once we are there.

## 8. Email and infrastructure

Absorbs `active/flpool/EMAIL_INFRA_PLAN_2026-09-09.md`; the mechanics there still hold. What changed after 09-19:

- **Brand decision is made for the end-user side:** our brand, our domains, our landing pages, replies with us. The Providence-branded domain family is Providence's to register; we run sends from it only with ownership's written authorization. This closes the gate the infra plan left open (option 1 versus 2): we run option 2 by default and option 1 only when Providence signs.
- **Two audiences, two arms.** End-user sequences (loss events, cohort, new DOT) as designed. Vendor sequences to the salesperson, new: the opener is their site, the offer is the audit and the tab, the ask is a fifteen-minute call with David. Different domains for the two audiences so one does not burn the other.
- **Capacity plan:** 3 domains and 9 mailboxes now (end users), 3 domains and 9 mailboxes for vendors from week 2; scale end-user mailboxes to 30 only if the application rate holds above 0.15% on a honed list. Every mailbox is ours in our registrar.
- **Actual build (fact, Simon, 09-24; supersedes the capacity line above):** 30 mailboxes on 6 domains, one domain per state (CO, FL, GA, IN, TN, TX), 5 mailboxes each, provisioned in Icemail and warming in Smartlead since ~09-22. Warmup takes about two weeks, so the first send can go out around **10-06**. Named sender on every mailbox is David (variants: david, davidl, davidlasaee). The design is Alek's Six-State Outbound Model (claude.ai artifact, 09-23). Still open: no vendor-arm domains yet, and all 30 mailboxes are borrower-side.
- **Sequencer:** confirm Origami's API and reply webhook this week or move to Smartlead. The reply pipeline (ingest, classify, route positives to David inside one business day, label the row) is the part we build.
- **Suppression:** our own touches, unsubscribes, bounces, and David's April list. Not Providence's CRMs; the clean handoff makes that unnecessary.
- **Gates,** pre-registered: bounce under 3% per domain; scale an arm at 1% positive reply; stop and rewrite under 0.3% after 600 sends. Vendor arm: scale at 5% reply, since the list is small and named.
- **Costs:** under $200 a month now, under $600 at 30 mailboxes.
- **Calls stay David's.** He wants 1,000 dials in seven days and 2,000 before he trusts the ICP; we feed the lists. The email arm does not wait for that; two hits from 900 sends is enough to keep sending on the honed list.

## 9. Keep in mind, keep tracking

- **Who signs.** A referral fee paid by Providence needs Providence's signature. A share of an AE's commission is a private letter and may not be permitted. Do not scale on David's signature alone.
- **The sales manager.** He is Alek's channel for warm leads this week and his revenue share is not real. We do not deliver that news; we get ownership's version and let David manage the room. Keep routing this week's positives to him as before until the ledger and the referral coding exist.
- **Key person.** David is new, has no vendors, no juniors, and told us his plan depends on hitting a number. Track his monthly GM from our flow against his $150–200K target; it is the leading indicator for the whole program. If he stalls, the fallback is the lab plus a second originator, not a bigger bet on Providence.
- **Providence's back end is residuals.** The site's promise is an honest number. The "how this works" page must say the structure is a lease with an end-of-term option and what that means. A second originator with loan paper belongs in the routing table by v2.1.
- **Deliverability and the line.** Two hundred lookalike domains with another company's name is the wrong side of it. Our sends: truthful sender, physical address, working opt-out, verified addresses, plain text.
- **Packaging lane.** More sophisticated buyers, $29–200K units, manufacturer-direct. Different copy, likely a different landing page. Do not fold it into the truck lanes.
- **Lane sprawl.** Twelve preferred industries plus the six we already work is eighteen. Three lanes for six weeks; the rest get a registry and a source before they get outreach (T18). Say so to David so the list of industries does not become a list of promises.
- **Marketplace terms.** MachineryTrader, EquipmentTrader and IronPlanet forbid bulk scraping in their terms. Dealer directory pages at research volume, by hand or slowly, and never inventory pulls. If a lane needs volume, the association list is the fallback.
- **The Indiana list's job.** It feeds the lab and gives David a few Indiana deals; it is not the volume path, and his own team knows it. Its second job is the vendor question on every call.
- **State tests.** Colorado and Texas showed "already contacted or funded" overlaps, which David reads as the ICP being right. Indiana is his strongest state. Rank the state lists by his connect rate once the Florida verdicts are tabulated at 1,000 calls.
- **Metrics that decide things, weekly:** vendors sourced / contacted / live / productive; applications routed; hours from routed to contacted; funded and attributed; referral fees invoiced and paid; email application rate per arm; David's GM from our flow.
- **Costs to share:** none yet beyond our own infrastructure. If David asks to share, the shareable items are the vendor domains and a trade-show trip.
- **Things we said we would not do this quarter:** our own booth; SMS or geofencing; step 2; a per-application fee; holding Providence-named domains; insurance agents.

## 10. Open questions

- What Providence's referral-fee policy actually says (amount, who approves, outside parties). Answer comes from #2 in §3.
- Whether the sales manager's 5% is on gross before or after referral fees. Affects whether he objects.
- Which show, if any, before November.
- Whether the sequencer we have exposes the API and webhook we need.
- Whether the embeddable calculator on a vendor's site needs state disclosure language of its own (§3 #12).
- The count behind the 89%, and whether the remaining 11% are the manufacturer-direct machinery vendors or something else.
- What David wants from American Equipment Exchange (§7d).
- Whether the after-hours team's dials are logged anywhere we can read.
