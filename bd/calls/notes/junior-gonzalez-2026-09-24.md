# Junior Gonzalez Call — 2026-09-24 (firm-direct)

*Caller: Alek. Coaching below is for Alek. Date assumed from processing day; transcript undated.*

## Follow-Up Actions

### What WE Need to Do
| # | Action | Owner | Due |
|---|--------|-------|-----|
| 1 | Same-day follow-up: thank-you, Calendly link, ask for his parameter handbook (the 620-FICO guideline) and the ticket range in writing | Alek | 09-25 (inferred) |
| 2 | **Decide the Florida overlap rule before the partner call.** Providence (David) is working a Florida specialty-truck pool; GME funds Florida trucks and yellow iron. Alek told Junior small-ticket is "greenfield" and buy boxes "aren't really overlapping." Decide: carve GME's lane (regional dump trucks and construction, used, 620+) away from Providence's lanes, or tell Junior plainly that one other small-ticket Florida lender is on the platform and that saved leads are exclusive per account | Simon + Alek | Before the partner call (~09-30) |
| 3 | Build a sample list for the partner call: 25 Florida dump-truck and construction companies in his box, from the flpool FMCSA/UCC data, including rows with a UCC nearing its end ("the UCCs about to expire" was his own example) | Simon | Before the partner call |
| 4 | Load GME / National Truck Loans' own UCC filings as book suppression, and show it: we already see his filings (e.g. National Truck Loans on YLS Freight, Miami, filed 2025-10). That shows the leads will be net-new, and it shows we can see his market | Simon | Before the partner call |
| 5 | Confirm the email-draft button is on for his account before any trial (Alek said "we haven't turned it on in this account") | Simon | Before trial |

### What THEY Need to Do
| # | Action | Who | Due |
|---|--------|-----|-----|
| 1 | Brief partner "Michael"; book a second call (Junior + Michael) via Alek's Calendly | Junior | ~09-30 (inferred; he said "close this out by end of month, if not early October") |

### What They're Expecting From Us
Nothing sent was promised explicitly. Implicitly: the $1,500 / 3 seats / $300 per extra seat founding rate holds, the email draft works, saved leads are exclusive to his reps, and his segment has no competing lender on the platform.

### Open Questions Before Next Contact
- **Ticket size.** He said "anything under 150" and "35 and... $20,000 usual." The best reading is a $20K–$150K box with most deals near $35K (inferred, low confidence). Confirm.
- Monthly volume: deals funded per month, and what share he wants from direct-to-business.
- Who works the leads: does he have the entry-level person now, or would he hire one? (This decides whether seats get used.)
- "Direct to consumer": does he mean end-user businesses (owner-operators, small contractors), or literal consumers? The first fits Quintel; the second doesn't.
- Geography: Florida only, or regional Southeast?
- Who Michael is (the second partner) and what he'll screen for: price, proof, or references.
- The "nine" customer count (see Key Intelligence #3).

## Call Summary
Inbound. Junior found Quintel through ChatGPT. He runs GME Leasing and, since 2022, National Truck Loans (Port St. Lucie, FL): a lender funding used OTR, day cabs, class 7–8 trucks and yellow iron since 2011, and lending his own money since 2015. All his volume comes from brokers and dealers. He thinks that channel is saturated and AI is giving dealers more funding options, so he wants a direct-to-business funnel, weighted toward regional dump trucks and construction rather than OTR. Alek demoed, quoted $1,500/mo for 3 seats plus $300 per extra seat, and Junior didn't push back on price. He'll bring partner Michael to a second call and named a close window of end of September or early October.

## Momentum
↑ Advancing: an inbound lender heard the price without objecting, named a close window, and set the next step (a partner call). The step isn't booked yet.

## Key Intelligence / What Changed

1. **First recorded lender inbound from AI search.** "I found your information using ChatGPT." ChatGPT recommended Quintel to a buyer without anyone prompting it. This is evidence for the unwritten `active/quintel-v2/inbound.md` (AEO engine), and it's a data point to log: ask him what he typed.
2. **His box sits on top of data we already built.** Florida, used trucks and yellow iron, regional dump/construction, 620+ FICO, 3 months of bank statements, small ticket. `active/flpool/` is a Florida FMCSA + UCC + Sunbiz pool with UCC ripe-date windows, built for Providence. His own ask ("UCCs about to expire") is the flpool `ripe_date` field. GME and National Truck Loans are already in that data (Sunbiz entities at 1680 SW Bayshore Blvd; National Truck Loans shows up as a secured party in `ucc_norm.csv`). A sample list costs near zero to build. **The same fact creates a conflict:** his box overlaps Providence's Florida truck lanes, and Alek told him the segment is "greenfield." That's the immediate issue (action #2).
3. **The "nine customers" claim doesn't match the vault.** The vault shows one paying Quintel customer (Wingspire, $1,000/mo from Oct 1) plus trials and rev-share partners (Onset, Envision, Stauss, Providence). Alek may be counting those, and his side is under-logged (see `vault-half-picture` memory), so this is inferred, medium confidence. It matters now, because a partner call is exactly where "can we talk to one of the nine?" gets asked. Agree on a count both founders can back before that call.

Also:
- **Pain is real but strategic, not acute.** "The broker market is obviously a little saturated. And now with AI… all the dealers have many more funding sources." Motive: "we're trying to buy better paper." He got burned on inflation-era collateral (600 FICO and a 750K-mile cap then; tightening to 620 and 500K now). This is channel erosion plus a push on credit quality. It's a real driver, but there's no deadline behind it.
- **He validates the BDO frame without prompting.** "Have someone… sitting here, looking at leads and generating generic emails… for someone entry level." He's buying a junior BDO's toolkit, which matches `quintel-bdo-frame-two-moat`.
- **He brought up the success-fee model himself:** "You can get paid on also leads and whatever closes. I see the scalability there." He's the second small-ticket operator to raise participation unprompted (David did it three times). If the seat price stalls at the partner call, a per-funded-deal fee is a ready fallback.
- **Quintel v2 fit.** He wants direct-to-business demand for used trucks and construction equipment in Florida. That's what the Ironmark front door routes, and `providence.md` §3 says "Providence is the first and, today, only originator on the panel." GME is a candidate second originator (e.g., for deals Providence passes on). Log as a thread; don't pitch it on the next call.

## Pipeline Analysis

### Objections / probes
| Quote | Type | How handled | Eff. (1–5) | Better response |
|---|---|---|---|---|
| "Are you from the space of equipment financing, or you're just in tech?" | Credibility | Honest: tech founders, built with a large-ticket lender advisor since February | 4 | Add one proof point from his world: "We've been building alongside lenders on the calls; I can show you a Florida truck list built for your box next time." |
| "How many lenders or brokers do you currently have on board?" | Social proof | "Nine… you would be the 10th" | 3 (lands today; fails a reference check) | "A small group of lenders, mostly large-ticket, with one on a paid plan and a few in trial. The founding rate is for the first ten." True, and still scarce. |
| "Whoever gets it first… will not be accessible anymore?" | Channel conflict | "Greenfield… buy boxes aren't really overlapping" | 2 (inaccurate for Florida trucks, see Intel #2) | "Saved leads are exclusive to your account. There's one other small-ticket lender in Florida; we split lanes by equipment type so you're not dialing the same companies." |
| Price ($1,500 / 3 seats) | None raised | He repeated it back to confirm, with no pushback | n/a | n/a |

### Pain evidence
Real, strategic: broker/dealer channel saturation, a wish to control origination, better paper after inflation-era losses. Not acute: no deadline and no quota.

### Stakeholders / authority / budget / timeline
- **Junior**: relationships and business development, one of three partners, the champion, and seemingly the de facto lead.
- **Michael**: partner, has to be consulted, role unknown.
- **Third partner**: not named.
- **Budget**: $1,500/mo heard with no objection.
- **Timeline**: "close this out by the end of the month, if not early October" (his words).

### Stage signal
Qualified interest → partner review. Next step is agreed in principle but not booked ("you might see another time slot").

## Alek's Performance

### Coaching Priorities
- **Discovery skipped the numbers.** The ticket range came out garbled and was never repeated back; monthly volume, current headcount and target geography were never asked. → **Better language:** "So I get this right: your typical deal is about what, and the range is what to what? How many do you fund a month, and how many would you want from direct?" → Without those numbers there's no way to size the list, justify the seat count, or build the sample list for Michael.
- **The demo didn't show his box.** Alek showed high-ticket capex leads and farms to a used dump-truck lender. → **Better language:** "Let me not show you my demo account. Give me your parameters and I'll bring 25 real Florida dump-truck and construction companies, with the UCC dates, to the call with Michael." → A list built for his box does the selling at the partner call, and it costs us almost nothing because the Florida data exists.
- **He left the next step to the buyer.** "You have my calendar, right?" → **Better language:** "Let's pick the slot now. What days work for Michael next week? I'll send the invite and bring the list." → A partner call that hasn't been booked is how inbound deals turn into ghosts.

### What Worked
- **Let the buyer talk first.** He asked for context on the business before demoing, and Junior volunteered his history, the channel pain, credit parameters and the strategic shift.
- **Clean pricing.** One number, one seat structure, repeated when Junior misheard. There was no discounting or hedging.
- **Partnership framing plus a question about the decision process.** "We look at it like a partnership… is this your decision?" That brought out the partner structure early, before anyone tried to close.
