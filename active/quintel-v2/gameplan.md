---
status: draft v0.4, for discussion on Saturday 2026-09-19
last_revised: 2026-09-17
owner: Simon and Alek
serves: alignment with David before and during the 09-19 call; then the living plan for Quintel v2
tier: shareable with David. Sent ahead of the call, in sync with the visual (`gameplan.html`). Internal reasoning lives in the other files in this folder.
---

# Quintel v2: the plan from here

## 1. Where we are

Five batches, four states, about 300 dials.

- Identity is solved. The registries (FMCSA, Secretary of State, UCC) beat every contact vendor on who the company is: 98% of numbers live, 96–97% the right person.
- Intent is missing. About 100 live conversations with in-box owners, zero applications. Hiring, UCC renewals, lien age, news and court records are all tested and dead for businesses this size.
- Cold calls are capped whatever the list. AI screening on mobiles, gatekeepers on office lines, a reflexive "no" at the word financing from owners who fit.
- One thing separated outcomes: business events (a new DOT number, a visible expansion). Small sample.

So the plan changes shape. The dial lab keeps running as the instrument that says which signals are real. The product becomes a site and a funnel that bring owners to us already asking for a number, qualify them, and hand Providence a deal.

## 2. The hypotheses we are working from

| Hypothesis | Confidence | Test |
|---|---|---|
| Small operators leave no planned-event trail, but they do leave loss and cohort records: crashes, out-of-service orders, disaster declarations in their county, listing the old truck. | medium | the signal arms in §5; first list ships within ten days |
| Owners start at the equipment question, not the financing question. "Which vac truck," "what does a knuckleboom cost," increasingly asked of an AI. The financing offer rides on the answer. | medium-high | query and citation data from the first content sprint |
| The service technician sees the need first. The repair-or-replace call is made in the bay before a dealer is involved. A monthly number at that moment turns a stalled job into a borrower who already knows what he needs. | medium | twenty shop conversations in one metro; one question to Providence on whether a shop can be the seller on a deal |
| An owner will give a website equipment, price and timing with no personal data, then take a warm call from Providence. Personal information is collected by Providence, where the trust already is. | medium | the first 20 routed applications |
| A qualified application handed warm converts at Providence well above the cold baseline. The rep starts at "you asked about a $140K vac truck," not "are you looking for financing." | medium | same 20 |

Facts underneath: a company that financed in the last six months rejects the pitch reflexively; lien age does not predict interest on any clock; the box is right (specialty trade trucks and the trades around them, fleets of two to seven, borrowing history, no captive or bank paper); Providence's top producers make almost no cold calls; Providence's customer data stays at Providence, and the plan works without it.

## 3. One site, one funnel, a clean handoff

**One site, one brand, Quintel's.** It answers what a specialty-trade operator asks about equipment (cost, monthly, new vs used, by trade and state) and offers a payment calculator. Nobody hesitates to type a price into a calculator, so that is the entry point. Outbound email and partner links land on the same site.

**Three ways in, one funnel.** An owner finds the site or his AI sends him there. An owner replies to an email we sent to a verified, event-selected company. An owner's mechanic, dealer or insurance agent shows him a link. All three create the same lead, which moves through the same steps:

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

**What this replaces.** Not the pilot. The dial lab keeps running on event-selected lists, because it is the only instrument that says why a row was dead. It replaces the idea that the product is a list.

## 4. Roadmap

| Phase | When | What ships | What it decides |
|---|---|---|---|
| **A. Align** | Sat 09-19 | this plan agreed or amended; commercial shape agreed in principle; the asks in §8 | whether we are building the same thing |
| **B. Loss-signal lab** | next 10 days | FMCSA crash and out-of-service records joined to the pools we hold; first 50 + 50 blind arm in David's template; Texas pool started | whether "something happened to the truck" is the intent signal (H1, H2) |
| **C. Site v1** | 3–4 weeks | payment calculator, qualify form, verification against held registries, a routing table with Providence as the one originator, a handoff email with the evidence block, an outcome sheet in David's format, partner links, two lane pages | whether owners use it and whether the handoff converts |
| **D. Outbound on the funnel** | 3–5 weeks (domains warming now) | Quintel-branded sequences to verified, event-selected rows; the email names the asset and the lien; the landing page is the site; replies land with us and go through steps 3–7 | reply and application rates by signal arm |
| **E. Cohort and turnover signals** | weeks 2–5 | disaster-declaration overlay by county; private-party listings scrape for one state; Section 179 send timing in Q4 | which triggers become standing feeds (H3, H4, H7) |
| **F. Partner sources** | weeks 2–6 | twenty conversations with repair shops and ten with commercial insurance agents in one metro; research pass on the 21 vendors | whether the earliest observers of need will refer (H8, H9) |
| **G. Read and price** | after the first 20 routed applications | application fee set from real numbers; funded share confirmed against outcomes | the commercial terms |

Weekly: one list to David, one verdict read, one line changed in this plan.

## 5. Experiments queued

Every intent idea so far assumed a planned event at the company level. For a two-to-seven-truck operator those do not exist in the record. What does exist: things that happen to the business, things that happen to its county and trade, and moments where someone else sees the need first. Each arm is 50 rows with the signal plus 50 matched controls, David blind to which is which, read at 50 live conversations. The decision rule is written before the list ships.

| # | Idea | Why it might work | What decides it |
|---|---|---|---|
| H1 | Carriers with a tow-away or disabling crash in the last 90 days | the truck is gone; the insurer pays actual cash value; the gap to the replacement gets financed. Recorded in public FMCSA files for exactly this population | crash arm opens at 2× controls → daily trigger |
| H2 | A vehicle placed out of service for a mechanical defect, especially repeatedly on one unit | a unit that keeps failing is a unit about to be replaced | same |
| H3 | Tree, roll-off, vac and hauling operators in counties under a fresh disaster declaration | months of work overnight; the second truck is needed now; the signal is the county, not the company | same, run when a declaration is live |
| H4 | Owners who listed a specialty truck privately in the last 60 days | seller of the old truck is buyer of the new one | same, and "already bought" under 30% |
| H6 | New DOT numbers and visible expansions | the only tag that separated outcomes so far | holds at 50 reached → default selector |
| H7 | Send timing around Section 179 year end | Q4 purchase rush | reply rate 1.5× → calendar-triggered sends |
| H8 | Repair shops and service contractors as referrers, with a shop link | the shop sees the need first; a link on the quote gives the owner a monthly number instead of a lump sum; the shop earns a finder's fee on funded deals | 5 of 20 shops would use it, one real lead in 30 days |
| H9 | Commercial insurance agents as referrers | they see the loss first | same at half the numbers |

## 6. Partner sources

**Service technicians.** The shop tells the owner the unit is not worth fixing, quotes the replacement, and waits for the owner to find $40–150K. Many of those jobs stall. A link on the quote gives the owner a monthly number on the spot and gets Providence a borrower who already knows what he needs. The shop's reason to use it is a finder's fee on funded deals and a job that closes; it costs the shop nothing. The shop is also a Providence-preferred borrower for its own trucks and equipment. Lanes that fit the box: truck upfitters and body shops; refrigeration and HVAC contractors serving food processing, cold storage and industrial; electrical contractors installing generators. Restaurants are restricted.

**Vendors.** Two weeks of fundings from two reps, 21 vendors. Every one is a niche specialty dealer or a manufacturer selling direct, in one equipment class, with no OEM captive behind it: vac trucks (the three-star vendor), tow and wrecker, directional drilling, ambulance and EMS, lifts, ag and land-clearing. The vendor to pursue is the dealer a captive does not cover. Next: a research pass on all 21, then the vendor plan.

## 7. Commercials: paid for deals, not leads

- **Clean handoff.** Quintel finds, qualifies and verifies; Providence receives a qualified application warm and closes it. We hand over a transaction, not a name.
- **Three rungs.**
  1. Verified rows for the dial lab: no charge. R&D for both sides; it continues.
  2. Qualified application handed off: a flat fee per application, set after the first 20 from real conversion. Providence confirms contact within one business day.
  3. Funded deal that entered through our funnel: a share of Providence's revenue on that deal, on top of the application fee. The percentage is a Saturday conversation; the structure is the point.
- **Attribution by timestamp.** A deal is ours if it entered through our funnel on a date, Providence's application date is after that date, and it funds within 12 months, whichever rep closes it. No CRM lookups. Providence returns a monthly funded list against our routed list.
- **Placement.** A qualified application Providence passes on, or cannot fund, is placed with another originator after 30 days.

Saturday's ask is agreement on the shape and on who at Providence signs it, not on the numbers.

## 8. What each side brings

**Quintel:** pools and verification in every state we work; the site, calculator, qualify flow and partner links; outbound on Quintel domains; the signal experiments and their lists, weekly; the routing and outcome ledger and the weekly read; the shop and agent conversations; the vendor research.

**Providence, through David:** calls on the lab lists and verdicts in the template; the warm-handoff packet (the fields a rep needs to take a routed application as his own); outcomes on every routed deal; the case-study 50 (repeat customers with the vendor per deal) to calibrate the signals against real winners; the Texas share of those 50 and the lanes beyond specialty trucks; whether a repair shop has ever sent a deal and whether Providence would take one where the shop is the seller.

## 9. Questions for the call

1. Does the site-plus-handoff shape work for Providence, and who signs off?
2. The warm-handoff packet: what does a rep need to see to take a routed application as his own?
3. The three-rung commercial shape and the timestamp attribution rule: acceptable in principle?
4. Texas: what share of Providence's best customers are there, and which lanes beyond specialty trucks?
5. Technicians and vendors: has a repair shop ever sent a deal, and would Providence take one where the shop is the seller? What does the top producer's vendor list look like?
6. One business day to confirm contact, and placement elsewhere after 30 days: reasonable?

## 10. References (Quintel internal)

`thesis.md` · `funnel.md` · `site.md` · `signals.md` and `signals-execution.md` · `technicians.md` · `threads.md` · `active/flpool/gameplan.md` (the lab record, batch by batch).
