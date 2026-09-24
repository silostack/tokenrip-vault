---
status: v0.7, vendor profile from Providence's funded book added 2026-09-21
last_revised: 2026-09-21
owner: Simon and Alek
serves: the living plan for Quintel v2, agreed in shape with David on 09-19; the next six weeks are in `launch.md`
tier: shareable with David. The visual (`gameplan.html`) is from v0.5 and lags this text. Internal reasoning lives in the other files in this folder.
---

# Quintel v2: the plan from here

## 1. Where we are

Five batches, four states, about 300 dials.

- Identity is solved. The registries (FMCSA, Secretary of State, UCC) beat every contact vendor on who the company is: 98% of numbers live, 96–97% the right person.
- Intent is missing. About 100 live conversations with owners who fit Providence's profile, zero applications. Hiring, UCC renewals, lien age, news and court records are all tested and dead for businesses this size.
- Cold calls are capped whatever the list. AI call screening on mobiles, gatekeepers on office lines, a reflexive "no" at the word financing from owners who fit.
- One thing separated outcomes: business events (a new DOT number, a visible expansion). Small sample.

So the plan changes shape. The calling pilot (David dialing our lists and grading every row) keeps running as the instrument that says which signals are real. The product becomes a site and a funnel that bring owners to us already asking for a number, qualify them, and hand Providence a deal.

**What the 09-19 kickoff added.** Seventy percent of Providence's recent business comes through vendors, and the reps who do the most volume make almost no calls; the vendor relationship is the source. The vendor worth pursuing is the specialty dealer or manufacturer outside the major metros with no lender on its website. Providence pays referral fees on sourced deals at the deal level, which gives the commercials an existing mechanism. And the thing a vendor wants that a rep with a golf membership cannot give is a working website, a financing tab that shows the buyer a monthly on the spot, and an answer inside two hours. So vendors move to the front of the plan; the site, the calculator and the email arm are built to find and serve them; end-user email and the calling pilot continue as the lab.

## 2. The hypotheses we are working from

| Hypothesis | Confidence | Test |
|---|---|---|
| A specialty dealer with no lender on its site will put a financing tab on it, and send deals to the desk behind it, in exchange for a fixed website, a monthly number for its buyer and a two-hour answer. | medium | 200 vendors sourced and scored; the first 50 read by David; two vendors live with the tab within six weeks |
| Small operators leave no planned-event trail, but they do leave loss and cohort records: crashes, out-of-service orders, disaster declarations in their county, listing the old truck. | medium | the experiments in §5; the first list, built from FMCSA crash and out-of-service records, ships within ten days |
| Owners start at the equipment question, not the financing question. "Which vac truck," "what does a knuckleboom cost," increasingly asked of an AI. The financing offer rides on the answer. | medium-high | query and citation data from the first content sprint |
| The service technician sees the need first. The repair-or-replace call is made in the bay before a dealer is involved. A monthly number at that moment turns a stalled job into a borrower who already knows what he needs. | medium | twenty conversations with repair shops in one metro; one question to Providence on whether a shop can be the seller on a deal |
| An owner will give a website equipment, price and timing with no personal data, then take a warm call from Providence. Personal information is collected by Providence, where the trust already is. | medium | the first 20 routed applications |
| A qualified application handed warm converts at Providence well above the cold baseline. The rep starts at "you asked about a $140K vac truck," not "are you looking for financing." | medium | same 20 |

Facts underneath: a company that financed in the last six months rejects the pitch reflexively; the age of a company's last lien does not predict interest; the target profile is right (specialty trade trucks and the trades around them, fleets of two to seven, a borrowing history, no captive or bank financing); Providence's top producers make almost no cold calls; Providence's customer data stays at Providence, and the plan works without it.

## 3. One site, one funnel, a clean handoff

**One site, one brand, Quintel's.** It answers what a specialty-trade operator asks about equipment (cost, monthly, new vs used, by trade and state) and offers a payment calculator. Nobody hesitates to type a price into a calculator, so that is the entry point. Outbound email and partner links land on the same site.

**Three ways in, one funnel.** An owner finds the site or his AI sends him there. An owner replies to an email we sent to a verified company where something has just happened (a crash, a new DOT number, a disaster declaration in the county). An owner is standing in a dealer's showroom or on its website and the dealer's financing tab is our calculator with the dealer pre-filled as seller. All three create the same lead, which moves through the same steps:

1. Discover: a page, an email, or a partner link.
2. Engage: he asks for a number.
3. Qualify: business name, years in business, fleet band, a work email or mobile. No Social Security number, no bank data, no application.
4. Verify: we match the business to the registries we hold. Alive, owner, lien history, captive or bank exposure.
5. Route: the deal goes to the originator whose box fits. Today that is Providence.
6. Handoff: Providence receives the deal warm, with the evidence (equipment, price band, timing, lien history, phone), and runs the application and everything after it on Providence's paper and name.
7. Outcome: Providence tells us what happened (contacted, application, approved, funded, dead, and why). That is what makes the system learn.

**Clean handoff.** Whether the borrower already sits somewhere in Providence's systems does not matter. What moves is a transaction, not a name, and Providence routes it internally however it likes. Existing-customer collisions stop being a problem, and so does the three minutes of research per row.

**Three doors on one site.** The buyer's door is the calculator and the smallest form a trade site would ask. The partner's door is one link and QR per shop, dealer or agent; it pre-fills the partner as seller of record and carries attribution; it is not a directory. The originator's door is never on the page ("financing through our funding partners"); it receives the handoff and returns the outcome.

**Why this shape.** The trust a borrower needs before handing over personal information belongs to Providence's 22 years, so that is where it is collected. What a new brand can do credibly (answer the equipment question, run the numbers, verify the business) happens before that line.

**What this replaces.** Not the calling pilot. It keeps running, on lists selected for a recent event, because it is the only instrument that says why a row was dead. What changes is the idea that the product is a list.

## 4. Roadmap

| Phase | When | What ships | What it decides |
|---|---|---|---|
| **A. Align** | Sat 09-19, done | shape agreed: paid on funded deals through Providence's referral mechanism; vendors first; our brand on the site and the sends; a shared live ledger replaces the spreadsheet handoff | that we are building the same thing. Numbers follow by 09-23 |
| **B. Vendor list** | by 09-26 | David's vendor profile merged with our scrape: association directories and dealer locators in the preferred lanes, outside the major metros, no lender on the financing tab, the salesperson named; 200 ranked, first 50 read by David | whether the profile is findable at scale |
| **C. Ledger v0** | by 09-24 | one row per routed application; contacted / application / approved / funded flags set by David; reason codes; referral coded; monthly reconciliation | the attribution record both sides work from |
| **D. Site v1** | 3–4 weeks | payment calculator built to embed on a vendor's site with the vendor pre-filled as seller; qualify form; verification; handoff to David with the evidence block; two lane pages; the partner page | whether a vendor will host it and whether the handoff converts |
| **E. Outbound** | from week 2 (domains warming now) | two arms on our domains: end-user sequences to verified companies where an event fired; vendor sequences to the named salesperson, opening on their website, offering the audit and the tab | application rate by signal; vendor reply rate |
| **F. Trade show** | decide 09-26 | one show before the holiday gap if one fits, worked David's way: periphery exhibitors, financing-tab scrape, sequence three weeks out, booked appointments; otherwise the same list work for Q1 | whether the show is a vendor-acquisition channel for us, not only for Providence |
| **G. State lists and signals** | rolling | Colorado, Texas, Georgia, Indiana at 100 rows in David's template for his calls; the Florida loss-event list; cohort and turnover signals as designed | which states and signals earn a standing feed |
| **H. Read and scale** | month 3 and month 6 | vendors live and productive; attributed funded deals; hours from handoff to contact; fees paid | at month 6, whether the vendor lane carries the business |

Weekly: Tuesday numbers and ledger review with David; one line changed in this plan on Friday.

## 5. Experiments queued

Every intent idea so far assumed a planned event at the company level. For a two-to-seven-truck operator those do not exist in the record. What does exist: things that happen to the business, things that happen to its county and trade, and moments where someone else sees the need first. Each experiment is a 100-row list: 50 companies with the signal and 50 similar companies without it, mixed and unmarked so the calls are blind, read once 50 live conversations are in. The rule that decides it is written before the list ships.

| # | Idea | Why it might work | What decides it |
|---|---|---|---|
| H1 | Carriers with a tow-away or disabling crash in the last 90 days | the truck is gone; the insurer pays actual cash value; the gap to the replacement gets financed. Recorded in public FMCSA files for exactly this population | crash group opens at twice the rate of the comparison group → build it as a daily trigger |
| H2 | A vehicle placed out of service for a mechanical defect, especially repeatedly on one unit | a unit that keeps failing is a unit about to be replaced | same |
| H3 | Tree, roll-off, vac and hauling operators in counties under a fresh disaster declaration | months of work overnight; the second truck is needed now; the signal is the county, not the company | same, run when a declaration is live |
| H4 | Owners who listed a specialty truck for sale privately in the last 60 days | seller of the old truck is buyer of the new one | same, and fewer than 30% say they already bought |
| H6 | New DOT numbers and visible expansions | the only signal that separated outcomes so far | holds at 50 conversations → becomes the default list selector |
| H7 | Email timing around the Section 179 year-end deadline | Q4 purchase rush | reply rate 1.5× the rest of the year → calendar-triggered sends |
| H8 | Repair shops and service contractors as referrers, with a shop link | the shop sees the need first; a link on the quote gives the owner a monthly number instead of a lump sum; the shop earns a finder's fee on funded deals | 5 of 20 shops would use it, one real lead in 30 days |
| H9 | Commercial insurance agents as referrers | they see the loss first | same at half the numbers |

## 6. Partner sources

**Vendors, first.** Seventy percent of recent fundings came through vendors, and the productive vendor sends two or three deals a month, steadily. The profile, from Providence's own funded vendors of the last 18 months (about nine in ten match): no financing tab on the website or a stale one; mostly used equipment (specialty trucks, vehicles, cranes); fewer than five locations; small towns; and most of them listing on online marketplaces (MachineryTrader, EquipmentTrader, IronPlanet and the like). The person to reach is the salesperson whose commission depends on the deal funding. The marketplaces are therefore the dealer roster and the size read in one place, and a dealer with a stale tab is the warmest vendor: the slot exists, the last partner left. David's 21 recent-fundings vendors are the seed and his read on the first 50 is the calibration. The base rate is the headwind: a long-tenured rep has 27 vendors after 14 years and six that produce. What we offer that a rep cannot: a website audit and fixes done for free, a financing tab that is our calculator with the vendor pre-filled as seller, a monthly number for the buyer while he is still on the lot, and David's two-hour answer. Packaging and food-processing equipment (manufacturer-direct or used-machinery dealers, $30–200K units, more sophisticated buyers) is the second vendor lane with its own copy. David's preferred-industries list now runs to twelve (packaging, food processing, pharma packaging, lab, HVAC, hydro vac, paving, portable toilets, recycling, robotics, spray foam, box and work trucks); the six-week plan works three lanes (hydro vac and pump trucks, box and work trucks, packaging with food processing) and gives each of the others a registry and a source before outreach.

**Trade shows.** The highest-intent room there is: the buyer flew in to buy. The exhibitor list is a vendor list per lane and the floor map says who is small. David's method: the exhibitors on the periphery and the upper floors, the ones with no lender on their site, a sequence three weeks out, appointments booked, then the floor walked with a plan. Our part is the list and the sequence; his is the floor. One show before the holiday gap if the calendar allows, otherwise Q1 with the list built now. No booth of our own yet.

**Service technicians.** The shop tells the owner the unit is not worth fixing, quotes the replacement, and waits for the owner to find $40–150K. A link on the quote gives the owner a monthly number on the spot. The idea stays on the list, behind vendors, for one reason from the call: every party paid on a deal is paid from the same fee, so a cash finder's fee to the shop competes with everything else. If shops come in, it is on the non-cash version of the offer (the link, the job that closes). Insurance agents are set aside.

## 7. Commercials: paid on funded deals

- **Clean handoff.** Quintel finds, qualifies and verifies; Providence receives a qualified application warm, with the evidence block, and closes it on its own paper and name. We hand over a transaction, not a name.
- **Paid on funded deals, through the referral mechanism Providence already uses.** No per-lead fee and no per-application fee: at the prices that market pays, neither is a business, and both pay for work that did not close. Two parts:
  1. A referral fee on every attributed funded deal, coded at the deal level by the rep, on a chart that rises with the deal's fee. Proposed as a percentage with a floor and a cap so it audits cleanly and scales with larger deals. Paid by Providence; signed by Providence.
  2. A share of the closing rep's side on the same deals, by separate letter, where Providence permits it.
- **Untouched:** the sales manager's percentage and the house's share. Any system-wide arrangement beyond the referral fee is a later conversation, after the volume exists.
- **Attribution by timestamp.** A deal is ours if it entered through our funnel or our vendor on a date, Providence's application date is after that date, and it funds within 12 months, whichever rep closes it. The ledger row is the record; the monthly reconciliation is the invoice.
- **Operating terms.** Contact confirmed within one business day (David's own standard is two hours). A qualified application Providence passes on is placed with another originator after 30 days.
- **Costs shared** where David asks for infrastructure we would not otherwise build. Domains carrying Providence's name are Providence's to register.
- **The pilot lists stay free.** Verified rows for the calling pilot remain R&D for both sides.

Numbers go to David by 09-23; the shape above was agreed on 09-19.

## 8. What each side brings

**Quintel:** company data and verification in every state we work; the site, calculator, qualify flow and partner links; outbound email on Quintel domains; the signal experiments and their lists, weekly; the routing and outcome ledger and the weekly read; the shop and insurance-agent conversations; the vendor research.

**Providence, through David:** the vendor profile and the two additional industries; the states and their order; calls on the pilot lists and grades in the template; the four flags and a reason code on every routed application, in the ledger; the referral coded on every attributed deal; the trade-show flow and the pick; the fields he needs to take a routed application as his own inside two hours.

## 9. After the 09-19 kickoff: agreed, and next

**Agreed in shape.** Paid on funded deals through Providence's referral mechanism, plus a share of the closing rep's side; nothing per lead or per application. Vendors are the lane; the profile is the specialty dealer outside the metros with no lender on its site, reached through its salesperson. The site, the calculator and the email arm are ours and carry our brand; sends under Providence's name come from domains Providence registers, with ownership's authorization. A shared live ledger replaces the spreadsheet handoff. The calling pilot continues with state lists (Colorado, Texas, Georgia, Indiana) and the two added industries. Trade shows are a channel to test, worked with a plan.

**Next.** Numbers to David by 09-23; his vendor profile and states list; his one-page trade-show flow; ledger live 09-24; vendor list of 200 by 09-26; a trade-show decision by 09-26; the fee arrangement confirmed by Providence in writing before it scales. The full list of moves and follow-ups on both sides is in `launch.md`.

**Since the kickoff (09-20/21).** David's funded-vendor profile and twelve preferred industries received; Alek delivered the Indiana 100 in David's dial format; David's team raised vendor-first on its own. Next: the top 50 vendors for David's read by 09-26, the lane pick and the American Equipment Exchange question on 09-23.

## 10. References (Quintel internal)

`launch.md` (the next six weeks) · `call-analysis-2026-09-19.md` · `thesis.md` · `funnel.md` · `site.md` · `signals.md` and `signals-execution.md` · `technicians.md` · `threads.md` · `active/flpool/gameplan.md` (the lab record, batch by batch).
