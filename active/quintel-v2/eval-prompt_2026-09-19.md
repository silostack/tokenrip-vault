---
status: ready to paste
last_revised: 2026-09-19
owner: Simon
serves: an outside-model evaluation of the Quintel v2 strategy, deliberately stripped of our tactics so the model can propose a different plan
tier: shareable to a model; originator and people anonymised
---

# Prompt: evaluate the strategy for Quintel v2 and propose the plan you would run

You are a senior operator with experience in small-business lending distribution, B2B demand generation, and marketplace or referral businesses. Below is everything you need about a small company, its partner, its market, and what it has learned in the last six weeks. The company has a plan. You are not being shown that plan's mechanics on purpose. Your job is to evaluate the strategy, then propose the plan you would run, including things the company may not have considered. Where you agree with the direction, say so briefly and move on. Where you would do something different, say what and why, and what it would cost to find out who is right.

Answer as a memo: recommendation first, evidence second. Label every load-bearing claim as fact from the brief, inference, or your own prior. Be specific about sequencing, budgets, headcount and time. Do not pad. If something in the brief is wrong or contradictory, say so.

---

## 1. Who is asking

Quintel is a two-founder company. One founder is technical and builds everything; the other runs relationships and outbound. No employees. The company has a working data pipeline that can take public registries for a US state (secretary-of-state filings, federal motor-carrier records, trade licensing, UCC lien filings) and produce verified lists of small operating businesses in chosen trades, with a verified owner name, phone line type, and equipment evidence. This capability is real and has been graded by a customer as better than commercial list vendors on accuracy.

Quintel's end game is a leaner, technology-driven equipment-finance originator. The company is not there yet and does not want to be judged on that today. The current step is to build a machine that produces borrowers for an existing originator, and to be paid for it.

## 2. The market and the partner

**The product being financed.** Commercial equipment loans and leases to small operating businesses in the trades: trucks and specialty trucks (vacuum and septic, tow and wrecker, roll-off, dump), construction and land-clearing equipment, HVAC and refrigeration, generators, pumps, drilling rigs, cranes, and similar. Typical ticket $40,000 to $200,000, with a practical floor near $50,000. Borrowers are owner-operators with roughly 2 to 25 employees, no finance function, who have usually financed equipment before. Terms of two to six years. The originator earns on the order of several thousand dollars of revenue per funded deal (its year-to-date average is about $7,800 per deal on roughly 70 deals a month across all its salespeople; its best-ever average year was under $10,000 per deal). It wants to raise that average by targeting larger tickets.

**The partner.** An established independent equipment-finance originator, 20-plus years old, well-rated, with a salesforce that both originates and closes. Its business-development lead is Quintel's counterpart and champion, and is personally invested in finding a repeatable source of new borrowers. The originator's preferred industries are the trades above. It restricts or declines restaurants with fewer than five locations, medical and dental, gyms, salons, solar, and over-the-road freight.

**How the originator gets deals today.** Three ways, in order of volume: (1) repeat customers and referrals, (2) equipment vendors and dealers who send buyers to them, and (3) cold outbound by its own salespeople using purchased lists, mainly UCC filings. Its top producers are the ones with the deepest vendor relationships. A recent sample of the vendors behind two weeks of fundings showed every one was a niche specialty dealer or a manufacturer selling direct in a single equipment class, with no manufacturer finance arm behind it. The originator has no top-of-funnel email program; its email tooling is for follow-up after a call. Its CRM cannot batch-export and it will not share customer data.

**The originator's stated views, from several calls.** Verified contact data is necessary but not sufficient; the missing ingredient is intent, meaning some evidence the business is about to buy. Blind mass email under an unknown brand has failed for it and for peers ("only fraud replies"). Purchased trigger lists have worked at very low rates (roughly five applications per ten thousand UCC leads at a few dollars each). Nobody will hand personal or financial information to a company that looks like a technology startup; a real, known entity has to be behind any request for it. It wants Texas and a wider industry set. It has said, repeatedly and on its own initiative, that it sees two ways to pay Quintel: a fee per fully qualified warm handoff, and a share of revenue on funded deals, and it wants to discuss how each would be monitored. It has asked to add trade shows as a channel, is enthusiastic about a partner-referral mechanism, is skeptical that insurance agents will refer (claims are filed online and agents are regulated), and wants to hear more about repair shops as a source.

## 3. What has been tried and what it showed (facts)

Over six weeks Quintel built lists in four states (Florida, Ohio, Wisconsin, Colorado; Texas in progress), roughly 350 verified small businesses in the trades above, each with a verified owner name and phone, an equipment or lien anchor, and in the later batches a per-row "intent" tag. The originator's BD lead called every row himself and graded the result on each one.

- Reach: roughly a quarter to a third of rows reached a live human on the first pass; about half of those reached the owner rather than a gatekeeper. Mobile numbers reach owners but are increasingly screened by phone-based AI assistants; office lines reach gatekeepers who end the call.
- Outcome: about 45% of reached rows were an explicit no. Hang-ups at the word "financing" are common. Five to ten percent of every list turned out to be the originator's existing or past customers. Across all batches: a handful of "call me back next quarter" doors, zero applications, zero funded deals.
- What separated outcomes: rows tagged with a recent business event (an expansion, a new operating authority, a contract award, a hire into an operations role) went about 18% explicit-no and produced every open door and most of the existing-customer hits. Rows selected on lien timing alone (a lien maturing or lapsing, the classic "renewal window" theory) went about 57% explicit-no and produced no open doors. Lien age did not predict anything on any clock.
- What did not work: hiring as a signal (universal noise), news or court or municipal records for businesses this small (nothing), bank credit declines as a source (the originator would decline most of them too), asking the originator for customer data to screen lists (impossible).
- A minority of called rows were owners trying to sell equipment or exit, not buy.
- Data hygiene: about one row in eight had a dead or wrong number despite passing a telecom validity check. That is Quintel's defect and is being fixed.

The BD lead's summary, which Quintel agrees with: the data is verified, the missing piece is intent, and cold calling verified rows is not the product. The calls were the research instrument, not the business.

## 4. What Quintel believes now (label these as the company's inferences)

- The originator's real scarcity is not names, it is borrowers who have already decided to buy something. Its whole sales motion exists because nobody is producing those.
- Intent does not live in registries. It lives with the people who see the need first: the technician who condemns a unit, the dealer who quotes the replacement, the owner who searches "what does a used vac truck cost" at nine at night.
- Small trade businesses will interact with a site that behaves like a trade tool (answers a practical question, asks for nothing personal) long before they interact with a lender. The first request for anything sensitive should come from the originator, on its paper, after the borrower has asked for a number.
- A qualified, warm application handed to one originator is a transaction that can be paid for and attributed by timestamp, without either side looking in the other's CRM. Existing-customer collisions stop mattering if the unit of exchange is a deal, not a name.
- The people who install and repair equipment for these businesses see replacement demand weeks before anyone else, have no way to help the owner pay for it, and could be paid a finder's fee on funded deals at no cost to themselves. Nobody currently serves them that way. This is unverified.

## 5. The goal being set

Quintel's current machine **finds** deal flow: it builds a list and someone dials it. The goal for the next version is a machine that **creates** deal flow: inbound channels through the people who observe the need (technicians, installers, vendors, dealers) and a repeatable, improvable way to find borrowers that does not depend on a salesperson's stamina. In one phrase: a top-of-funnel strategy that works, is measured, and compounds. The originator closes; Quintel's job is everything before the application.

Part of that is a new borrower-facing website with its own brand, separate from the originator and from Quintel's corporate name. The founders disagree productively about it. One wants a name with no finance or capital word in it, that a mechanic could say out loud and a trade owner would not pigeonhole, on the theory that the "X Capital Funding" pattern is exactly what these owners already delete. The other wants a finance word and a .com for credibility and findability, and both hate long domains. A working direction exists but is not fixed; treat naming and branding as open.

**Constraints:** two people, no outside capital, one originator on the panel today, a few thousand dollars a month of tooling budget, the originator's restricted-industry list, US commercial-financing disclosure rules in several states, and the originator's explicit preference that personal or financial data be collected by it, not by Quintel. Time horizon: something must produce the first handed-off applications within a quarter, or the partnership stalls.

**Commercial frame in outline:** verified lists for the calling pilot are free (research for both sides); a fee per qualified warm handoff, set after the first twenty; a share of originator revenue on funded deals that entered through Quintel, attributed by timestamp with a monthly funded list back. Numbers are open. Treat this as a frame you may challenge.

## 6. What to evaluate and what to propose

Answer these in order. Each answer should include what you would measure and what result would make you change your mind.

1. **Strategy.** Is "create deal flow instead of finding it" the right frame for a two-person company with this partner and this evidence? What would you set as the goal for the next 90 days and the next 12 months instead, if different? What is the single assumption everything rests on, and how would you test it in the cheapest way?

2. **Top of funnel.** Given the trades, the ticket size, the borrower profile, and the evidence that business events predict and lien timing does not, what is the best repeatable way to find borrowers who are about to buy? Rank the candidate sources you would try (partner and referral channels, outbound of any kind, search and answer-engine inbound, trade shows, data signals of any kind, anything else) by expected yield per dollar and by time to first result, and say what you would drop. Be explicit about the technician and installer channel: is it real, who exactly is the partner, what is their reason to act, and what would kill it?

3. **The site.** Its purposes: the surface every channel lands on; the place a wary owner checks before he types his business name anywhere; the place a partner sends a customer; the thing an answer engine cites when an owner asks a practical equipment question; and the point where a qualified borrower is handed to the originator without Quintel touching personal data. Given those purposes and this audience, what should the site be, what should it do first, what should it refuse to do, and how should it earn trust on day one with no history? Do not assume any particular feature; propose what you would build and what you would leave out.

4. **Brand and name.** How should the site be branded and named, for whom, and why? Take a position on the founders' disagreement (category word or not; .com or not; the corporate parent visible or not; the originator visible or not). Give the naming principles you would apply and three to five example names that meet them, and say how you would decide among them in a week.

5. **Commercials and the partner.** Does the outlined frame align incentives correctly? What would you change so the originator's salespeople want Quintel's handoffs, and so a revenue share is policeable without either side trusting the other's records? What should Quintel refuse to agree to?

6. **The plan.** A 90-day action plan for two people: what gets built, what gets tested, in what order, with numbers (budget, list sizes, conversation counts) and kill criteria. Then the 12-month shape if the 90 days work.

7. **What we are not seeing.** The three most likely reasons this fails that the brief does not mention, and the one opportunity the brief implies but does not state.
