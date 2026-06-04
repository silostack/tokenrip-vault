---
title: Equipment-Finance Domain Primer (Stauss-sourced)
status: active
owner: Simon
type: vertical-domain-research
created: 2026-05-30
last_updated: 2026-06-04
related:
  - bd/deals/equipment-finance/stauss-vfi-tokenrip-briefing.md
  - bd/calls/transcripts/stauss-paulos-2026-05-28.md
  - bd/calls/transcripts/stauss-paulos-2026-05-29.md
  - bd/calls/transcripts/ted-craver-2026-06-01.md
  - bd/calls/transcripts/devan-phillips-2026-06-01.md
  - bd/calls/notes/stauss-paulos-2026-06-01.md
  - product/tokenrip/mounted-agent-model.md
  - product/tokenrip/mounted-agent-synthesis.md
---

# Equipment-Finance Domain Primer

> **What this is:** A plain-English guide to the equipment-finance industry — written so that *anyone* can read it start to finish and understand all of it, with no background in finance, sales, or technology required. Every specialized term is explained the first time it appears, and again in the glossary at the end.
>
> **Where it comes from:** Stauss Paulos — a 20-year equipment-finance executive — walked us through how his industry actually works across several long calls. A customer call with Ted Craver, who runs sales at a deal-placement firm called Bevel, added the view from a different seat. This document turns that raw, in-the-weeds industry knowledge into a durable reference we can come back to.
>
> **How it's organized:**
> - **Part 1 — How the industry works.** Plain explanations, no jargon, no assumptions.
> - **Glossary.** Every specialized term, in plain words.
> - **Part 2 — What this means for what we're building.** Clearly separated and skippable. This is the only part that assumes you care about our product (Tokenrip / Quintel).
>
> **Deliberately left out:** A separate crypto / "equipment-stablecoin" idea Stauss floated — parked, and tracked elsewhere.
>
> **Companion document:** the [[stauss-vfi-tokenrip-briefing]] covers the *deal and the relationship* with Stauss. This document covers the *industry itself*, which stays true regardless of how any one deal goes.

---

# Part 1 — How equipment finance works

## 1. The basics: what "equipment finance" even means

Businesses constantly need expensive equipment. A construction company needs excavators. A trucking company needs trucks. A hospital needs MRI machines. A data center needs servers and cooling systems. This gear can cost anywhere from tens of thousands to many millions of dollars, and most businesses either can't or don't want to pay the full price in cash up front.

So a finance company pays for the equipment, and the business pays it back over time, with interest — much like a mortgage on a house, except the thing being financed is a crane or a fleet of trucks. That's the entire industry in one sentence: connecting businesses that need equipment with the money to pay for it, and managing the risk that they don't pay it back.

There are two main ways to structure this:

- **A loan** — the business borrows money, buys the equipment, and owns it outright. They repay the loan over a few years.
- **A lease** — the finance company technically owns the equipment and "rents" it to the business for a set period. At the end, the business can usually return it, buy it, or extend. Leasing is popular because of tax and accounting advantages (more on that later).

The finance company makes its money on the gap between what it costs *them* to get the money and the higher interest rate they charge the business.

## 2. Who's who — the players

Equipment finance is a **highly fragmented** industry. There's no dominant giant the way there is in search engines or smartphones. Instead there are several hundred firms, each moving tens to hundreds of millions of dollars a week, and none of them dominant. As Stauss put it, there are "several hundred firms like us."

Here's the cast of characters:

| Who they are | What they do |
|---|---|
| **Direct lenders / lessors** (e.g., VFI, SLR Capital) | The companies that actually have the money. They use their own capital to fund the loans and leases. Stauss's employer, **VFI**, is one of these — a ~40-year-old firm of about 200 people that does the bigger, more carefully-judged deals. |
| **Brokers** | Middlemen who hold the relationship with the business that needs equipment, and pass ("forward") those deals to a lender for a referral fee — typically **2–4% of the deal**. Many are former lenders working solo who can't afford support staff; they want to *close deals*, not do paperwork. |
| **Placement firms** (e.g., Bevel) | A more sophisticated middleman. They take in a deal, do the initial homework, package it up properly, and then shop it to the right lender out of dozens. **Bevel placed $450 million across about 75 different lenders last year.** |
| **Equipment dealers with an in-house finance desk** (e.g., NED) | A company that *sells* equipment and also arranges the financing on its own sales — like a car dealership's financing office. Because the customer is already standing there buying the equipment, they never have to go hunting for deals. (See §11.) |
| **Marketplaces** (e.g., Cloud Store, "the Amazon of equipment") | Websites that sell used equipment, often with a few lenders on hand to finance buyers — frequently buyers with weaker credit. |
| **Remarketers / equipment brokers** | Firms that buy and resell *equipment* (not money) — for example, reselling gear that came back off a lease. They charge 8–12% of the equipment's value. |
| **Manufacturers (vendor financing)** | Equipment makers sometimes offer their own financing at subsidized rates to help sell their products. This competes with everyone above. |

One more kind of buyer is worth flagging: **the individual salesperson**. Stauss noted that individual reps and managers will pay $50–100/month *out of their own pocket* for a tool that gives them an edge over their peers — because closing more deals means a promotion. So the "customer" isn't always a company; sometimes it's one ambitious person.

## 3. Deal sizes — "ticket" tiers

The industry sorts itself by deal size, which it calls the "ticket":

- **Small-ticket** — roughly **$10,000 to $2 million**. Usually loans. Fast and largely automated: you apply, a computer checks a few numbers, and the money can be funded in 24–48 hours. This is the most crowded, most competitive corner.
- **Middle-market** — the larger, more hand-crafted deals. This is where VFI plays.
- **Large / project finance** — the giants, up to roughly **$500 million**, financing whole projects.

A useful wrinkle from the calls: the *small* deals are often the *messiest*. Ted (from Bevel) noted that a $20–100M deal usually arrives clean and well-documented, but the $300K–$2M deals tend to be "pretty messy" — disorganized paperwork, delays, inefficiency. Small does not mean simple.

## 4. The life of a deal — from first call to money out the door

A deal moves through a predictable series of stages. Understanding these stages is the key to understanding the whole industry, because each one is a distinct job that someone has to do.

1. **Finding the deal (prospecting).** Someone has to find a business that needs equipment financing. At VFI this is brute force: salespeople make about **150 cold calls a day** to get 10–15 live conversations. It's a revolving door — hire 20 salespeople, keep 10, and only a core handful become real producers after a few years. Junior staff hunt for raw leads; more senior salespeople qualify and work them.
2. **Qualifying.** Figuring out whether the deal is real: how much money they need, when they need it, and what terms they'd actually accept.
3. **Making an offer (the "term sheet").** A non-binding offer laying out a rough rate, length, and structure.
4. **Submitting for approval.** The deal gets written up and sent to the people who decide whether to approve it.
5. **Underwriting** — deciding whether, and how, to lend. (Big enough that it gets its own section — see §5.)
6. **Paperwork.** Drawing up the contracts. This stage is a notorious deal-killer: contracts go back and forth — each side marking up the other's draft ("redlines") — for anywhere from two weeks to four months. Deals die here when someone goes on vacation and the momentum stalls.
7. **Funding.** The money actually goes out, by wire, which takes a couple of days and costs a small fee. Big deals often fund in pieces on a schedule (e.g., a $10M approval might release $1.5M now for three cranes and $8.5M later in the year). Crucially, the finance company starts earning interest the moment the first dollar goes out.
8. **Servicing.** Once the money's out, the business has to keep sending financial updates, and the lender watches to make sure they don't break the terms of the deal.
9. **End of the lease.** When a lease ends, the business returns, buys, or extends the equipment.
10. **Reselling returned equipment.** If gear comes back or is repossessed, someone picks it up, stores it, and resells it.

## 5. How lenders decide who to lend to (underwriting)

"Underwriting" simply means deciding whether to make a loan and on what terms — judging how likely the borrower is to pay it back. This is the heart of the business, and there are **two completely different ways** the industry does it. This split is the single most important thing to understand about the whole field.

**The math way (small deals).** For small, fast deals, underwriting is basically a formula. The lender looks at the borrower's credit score, a few standard ratios (how much debt they carry versus their income, for example), and runs it against a lookup table. If the numbers clear the bar, it's approved automatically — no human needed. Think of how an online lender can approve a personal loan in minutes from your application and bank statements. Stauss calls this "mathematical." Because it's just a formula, almost anyone can do it — which makes it fast and cheap, but also not very defensible as a business.

**The judgment way (big deals).** For larger, institutional deals like VFI's, there's no credit score and no lookup table. Instead, an experienced person reads the entire situation: the owner's personal financial statement (a snapshot of everything they own and owe), the health of the business, the quality of the equipment as collateral, whether the cash flow can actually cover the payments, and so on. The owner usually has to *personally guarantee* the loan — promise to pay it back out of their own pocket if the business can't. This always keeps a human in the loop, because it's judgment, not arithmetic. **This judgment — built over decades — is the genuinely valuable, hard-to-copy skill in the industry.**

At the end of underwriting, a big deal produces more than a yes or no. It produces a package: the rate, the length, the structure, and the talking points needed to justify the deal both to the lender's internal approval committee *and* to the customer (for example, the true all-in cost of the financing). When our colleague Alek built a mock-up showing a deal going in one side and a polished approval write-up coming out the other — payment schedule, coverage ratios, risk flags, recommendation — Stauss gave his strongest reaction of any call: "this is pretty much exactly what I'm thinking."

## 6. How finance companies make money

A few mechanics worth knowing:

- **The spread.** The finance company borrows money at one cost and lends it out at a higher rate. The difference is their profit (called the "spread" or "yield"). They start earning it the day the first dollar is funded — interest accrues daily.
- **Capacity limits.** Lenders get their money from sources that cap how much can go into any one industry. So a lender can be "maxed out" on, say, trucking, and turn down a perfectly good trucking deal simply because they have no room left — not because the deal is bad.
- **Small-deal economics.** Brokers on small deals take 2–4% as a referral fee. A more efficient, software-driven player could undercut that. Stauss's framing: if "$10M funds a day," then shaving even "a point or two off $10M every day" is real money.
- **Big-deal economics.** Half a percent on a $100M deal is a lot of money — but those deals are rare and can take 6–12 months to close before anyone gets paid.
- **The headcount math (the core pitch to a lender).** A salesperson costs about **$70,000/year** in base pay. If one piece of software can do the work of five of them, that's roughly **$350,000 saved**. Stauss said VFI would pay "several hundred thousand annually" for something that genuinely replaces hiring.
- **How they might pay for software.** Stauss floated several models: a monthly subscription (which he *dislikes*, from a bad past experience), per-milestone fees (e.g., $1K when an offer is issued, $10K when a deal funds), success fees, or a permanent royalty on deals. (Our own view on pricing lives in Part 2 and in the briefing.)

## 7. How they find deals — and why it's so hard

Finding the right business to finance, at the right moment, is the industry's deepest pain.

**The tools today** are generic contact databases — ZoomInfo, Dun & Bradstreet (D&B), Apollo. They give you company names, contacts, and rough revenue estimates.

**The data is badly unreliable.** One database listed a company at $17M in revenue when it was actually doing $70M. Private companies don't have to publish real numbers, so the data is often 80–90% guesswork. The damage is concrete: a salesperson sees "$17M" against a "$15M minimum" rule, decides it's too close to the line, and passes on a great deal that was actually well over it. (Public companies are different — they file real numbers every quarter.)

**The tools don't do the work.** As Stauss put it, "it's 100% on me — it's a data company." These tools hand you a contact and stop. They don't tell you who is actually about to buy equipment.

**Timing is everything — and almost impossible to get.** The real prize is reaching the decision-maker exactly when they need the money. But spending cycles vary, projects get pushed or canceled, salespeople lose touch, and competitors are calling the same people. The result is "false pipelines" — hundreds of millions of dollars in tentative deals that never close, because nobody had the timing right.

**A smarter way to target.** Stauss's trick: don't aim at the bottom edge of your range, aim a bit above it. The real minimum might be $15–20M in revenue, but he'd tell a tool to target $50M companies, so the genuinely qualified deals surface instead of the borderline ones.

**The real data edge (this took a while to pin down).** The generic contact databases are a commodity — everyone has them, and you won't out-scale them. The edge turns out to be mining *free public records* that signal a financing need, specific to this industry:

- **EDGAR filings** — when a public company signs a major agreement, it has to file a public disclosure that *names the private company on the other side of the deal*. That private name is a lead almost nobody else is pulling out.
- **Federal contract awards (USAspending)** — a public database showing which private companies just won government contracts and will therefore need to gear up to deliver.
- **Lien filings (UCC records)** — public records of *existing* financing. The filing date tells you roughly when a lease will mature, which tells you when that business will be back in the market looking to refinance.

The insight: the edge isn't better *contact* data, it's mining these free public *timing* signals that the generic tools ignore. Stauss also suggested a simple **borrower survey** — three or four clicks asking a business "any equipment purchases planned this year? financing anything? who's the right contact?" — as a clean, direct way to capture demand straight from the source.

**A different source on the lender side.** From the Bevel call: when a *placement* firm needs to find the right *lender* (rather than the right borrower), one rich source is credit-union "call reports" — standardized financial filings that about 4,500 credit unions submit, each containing thousands of data points. You can query them to find, for example, which credit unions make large business loans in a given region. This is the raw material for matching a deal to the right funder. (Ted described loading 15 such data files into an AI assistant and having it filter and sort them.)

## 8. The compliance problem nobody can ignore (sensitive personal data)

This one came straight from the Bevel call, and it matters across the whole industry. Every deal file is stuffed with sensitive personal information — Social Security numbers, personal financial details, tax returns. Ted spent 20 years in banking, and his instinct was to ask immediately: how would an AI tool handle a stack of files full of Social Security numbers without creating a compliance disaster?

This is a real constraint, not a footnote. Any software that touches these deals has to handle the data safely. In plain terms, the options are:

- **Use a vendor plan that promises never to "train on" your data.** The major AI providers (Anthropic, OpenAI) offer business plans where anything you send is walled off and never reused for anything else.
- **Keep the data fully in-house with a "local" model.** Run the AI entirely inside your own network so nothing sensitive ever leaves the building. Slightly behind the cutting edge, but more than good enough for most tasks.
- **Build to a formal security standard,** with audit trails and network-level controls, for customers who need to pass a security audit.

Ted's own word for a safe, sealed environment was a "sandbox" — keep the sensitive data in a contained space the AI works *inside*, so nothing leaks out. The takeaway: handling this well isn't optional. It's the price of entry to the industry — and, handled well, it's also a selling point.

## 9. The kinds of equipment (and why they're not interchangeable)

Different equipment carries very different risk. A lender thinks about each type differently — how well it holds its value, how easy it is to resell, how cyclical the business behind it is:

- **Cranes** — high-quality, durable collateral. As Stauss put it, "A-rated paper for cranes is a no-brainer."
- **Trucking** — boom-and-bust. An 18-month downturn caused bankruptcies, but a savvy lender can use a downturn to learn who survives and win good long-term customers on the other side.
- **Construction / earth-moving** — excavators, skid steers; often smaller deals.
- **Medical and IT** equipment — each with its own distinct profile.
- **Data centers / AI chips (GPUs)** — a hot, emerging area. The chips themselves are becoming financeable, but the surrounding gear (cooling systems, racks, servers) is still considered too "soft" by traditional banks — which is exactly the opening for a lender willing to finance the whole project.

**A targeting insight, plus the current market timing.** Don't try to finance the giants — Amazon, Meta, and Google all have plenty of their own cash. Instead, target their *suppliers* a few tiers down: the smaller companies ramping up spending to serve those giants. Stauss's read of the market in mid-2026: there's record equipment spending, but it's concentrated almost entirely in the big "hyperscaler" data centers (Meta, Amazon, OpenAI, Anthropic). It hasn't "spilled down" to the tier-2 and tier-3 suppliers yet. He expects that to begin in late 2026 and run strong through 2027 — which is precisely the window in which those supplier deals appear. (He noted his own pipeline had been slow for about 30 days as of early June 2026.)

**One more VFI specialty worth knowing:** most lenders will only finance the equipment itself. VFI can also fold in the "soft costs" — installation, software, freight, related components — so a "$2M equipment" deal becomes a "$5M project." Customers often don't even realize this is possible.

## 10. The rules (regulation, briefly)

- **Equipment debt is lightly regulated.** Because it's debt — not investments — there are no securities-licensing hoops. Anyone can take a referral fee. This is why a software business can earn success fees here without needing a license.
- **Real estate is the exception.** Financing tied to real estate has state-by-state licensing rules, so it's treated as off-limits for now.
- **Leases come with extra accounting.** There's an accounting standard (ASC 842) governing how leases appear on a company's books, and a tax rule ("bonus depreciation," now available year-round) that lets businesses deduct equipment costs quickly. That tax benefit drives a whole category of deals.
- **Geography:** the current focus is the continental US only — no Hawaii or Alaska.

## 11. A special case: the equipment dealer's finance desk (NED)

This one is worth understanding on its own, because it's mechanically different from everyone else. NED (National Equipment Dealers) is a large heavy-equipment dealership. Like a car dealership's financing office, it has an in-house desk — run by Andy Cooper and one colleague — that arranges the financing on the dealership's *own* equipment sales.

The key difference from everyone above: **they never have to hunt for deals.** The customer is already standing there buying a bulldozer. So their pain isn't *finding* business; it's everything that comes after:

- **Too many lenders to manage.** NED worked with **31 different lenders** last year and wants to cut that down to **5–6**. They want to figure out which lenders are genuinely the best to work with — who approves smoothly, holds their pricing, funds fast, communicates well — and then route every deal to the best fit. This is a ranking problem based on real track record.
- **Setting the "residual" value.** Dealer desks lean on a kind of lease where the big variable is the residual — the estimated value of the equipment when the lease ends (e.g., a loader might be worth 60% of its original price after three years). The dealer *sets* this number to hit a monthly payment the customer likes, while staying within what a lender will accept. Getting it right is specialized skill, and it differs by equipment type and age.
- **Manufacturer discounts the customer never sees.** Equipment makers give the dealer hidden concessions ("blind discounts") that quietly improve the dealer's economics.
- **Multi-unit deals.** About 90% of NED's deals involve multiple units at once (e.g., several dump trucks on one contract), which adds complexity.

NED's stated priorities, in order: (1) good communication and status updates throughout the deal, (2) consistent, reliable approvals, (3) competitive pricing held steady. For scale: NED funded $183M across 620 transactions last year, and projects $240–260M.

---

# Glossary

Every specialized term used in this document — and a few you'll hear on calls — in plain words.

### Finance & lending terms

| Term | Plain meaning |
|---|---|
| **Loan vs. lease** | Loan = the business borrows money and owns the equipment. Lease = the finance company owns it and rents it to the business, with options at the end. |
| **Underwriting** | Deciding whether to make a loan and on what terms — i.e., judging the risk that the borrower won't pay it back. |
| **Term sheet / proposal** | A non-binding written offer of a rough rate, length, and structure, made before the deal is fully approved. |
| **Personal Financial Statement (PFS)** | A snapshot of an individual owner's assets, debts, and net worth. Used to judge a borrower when there's no simple credit score to rely on. |
| **Personal Guarantee (PG)** | The owner personally promises to repay the loan out of their own pocket if the business can't. |
| **Collateral** | The equipment (or other asset) the lender can seize and resell if the borrower stops paying. |
| **Credit score / rate sheet / ratios** | The inputs to the "math way" of underwriting small deals: a number measuring creditworthiness, a lookup table of rates, and simple measures like debt-vs-income. |
| **Debt Service Coverage Ratio (DSCR)** | How much cash the business has available to cover its loan payments. Above 1.0 means it can cover them. A core measure in big-deal underwriting. |
| **Credit committee / investment committee** | The internal group at a lender that gives the final yes/no on a deal. |
| **Spread / yield** | The lender's profit — the gap between what the money costs them and the rate they charge. |
| **Cost of capital** | What it costs the lender to obtain the money they lend out. |
| **Per-diem** | Daily interest. It starts accruing the moment the first dollar of a deal is funded. |
| **Basis points (bps)** | Hundredths of a percent. 100 bps = 1%. "50–100 bps" = half a percent to a full percent. |
| **Points** | Percent of the deal amount, used for fees. A "2–4 point" broker fee = 2–4% of the deal. |
| **Capacity / "buckets" / industry limits** | Caps on how much a lender can put into any one industry, set by where their money comes from. A lender can decline a good deal simply because it's "maxed out" in that sector. |
| **Securitization** | Bundling many loans or leases together and financing them as a package, to free up money to lend again. This is what creates the "buckets" above. |
| **Warehouse capital** | A revolving line of credit a lender draws on to fund deals before bundling them. Finite and segmented, which is what drives capacity limits. |
| **Balloon** | A large final payment at the end of a loan's term (e.g., "10% balloon"). Lowers the monthly payments but leaves a big amount due at the end. |
| **Residual** | The estimated value of leased equipment at the end of the lease. The bigger the residual, the lower the monthly payment. Varies by equipment type and age. |
| **Master lease + schedule** | The master is an umbrella contract; each individual deal is a "schedule" added under it. A second schedule under an existing master funds quickly. |
| **Covenant** | A condition the borrower must keep meeting after funding (e.g., sending quarterly financials). Breaking one can trigger penalties. |
| **Asset-Based Lending (ABL)** | Lending against a company's receivables and inventory instead of its equipment. |
| **Soft costs** | The non-hardware parts of a project — installation, software, freight, related components — that most banks won't finance. |
| **Bonus depreciation / ASC 842** | A tax rule that lets businesses deduct equipment costs quickly (bonus depreciation), and the accounting standard for how leases appear on the books (ASC 842). |
| **Off-lease / remarketing / repossession** | Equipment returned at the end of a lease (off-lease) or seized for non-payment (repo), then resold (remarketing). |
| **Vendor financing** | Financing offered directly by the equipment manufacturer or dealer, often at subsidized rates. |
| **Forward flow** | A standing commitment from a lender to fund a stream of future deals up to a set amount. |
| **Fair Market Value (FMV) lease** | A common lease type where the end-of-lease price is the equipment's market value at that time (this is where the "residual" matters most). |
| **Blind discount** | A concession a manufacturer gives a dealer that the end customer never sees, which improves the dealer's economics. |
| **Multi-unit deal** | A single deal financing several pieces of equipment at once (e.g., several trucks on one contract). |
| **Near-prime / subprime** | Borrowers with weaker credit. Riskier, so they pay higher rates. |
| **Middle-market** | Roughly $15M–$1B revenue companies — the sweet spot for institutional lenders like VFI. |
| **Project finance** | Large, structured financing of an entire project (up to ~$500M) — the top end of the deal-size range. |
| **Recapitalization** | Restructuring a company's mix of debt and equity, sometimes an urgent need. |
| **Capital advisor** | An intermediary who arranges financing for a borrower across several different funding sources. |
| **C&I loans** | "Commercial & Industrial" loans — business loans (the kind a credit union might make to a company). |
| **LTV (Loan-to-Value)** | The loan amount as a percentage of the equipment's value — a measure of how much cushion the lender has. |
| **Call report** | A standardized financial filing that credit unions and banks submit. A rich, structured source of data about who lends what. |
| **UCC filing / lien** | A public record showing that a lender has a claim on a borrower's equipment. The filing date hints at when a lease will mature. |
| **EDGAR / 8-K** | EDGAR is the government's public database of company filings; an 8-K is the form a public company files to disclose a major event — sometimes naming the private company it just did a deal with. |
| **NAICS** | The standard government code for classifying a company's industry. Useful for filtering public data by sector. |

### Sales & business terms

| Term | Plain meaning |
|---|---|
| **BDO / BDA** | Business Development Officer (a salesperson, ~$70K base pay) and Business Development Associate (a junior, entry-level lead-finder). The roles that find and work deals. |
| **Bird-dog** | To hunt for and flag raw leads for someone else to qualify and close. |
| **Cold call** | Calling a prospect who isn't expecting it, to drum up business. |
| **Pipeline** | The set of in-progress deals a salesperson is working. A "false pipeline" is full of deals that look real but won't actually close. |
| **FTE** | "Full-Time Equivalent" — i.e., one full-time employee. The "FTE math" is the argument that one piece of software replaces N salespeople's salaries. |
| **ICP** | "Ideal Customer Profile" — a description of exactly the kind of customer (or, on the borrower side, the kind of company) you're trying to reach. |
| **ACV** | "Annual Contract Value" — how much a customer pays per year. "High-ACV" = big-ticket customers. |
| **B2P** | "Business-to-Person" — selling to an individual employee who pays out of their own pocket, rather than to the company. |
| **Design partner** | An early customer who works closely with you to shape the product, often at a favorable price, in exchange for that influence. |

### Our product & technology terms

(These only matter for Part 2. They're here so the whole document is self-contained.)

| Term | Plain meaning |
|---|---|
| **Agent** | An AI assistant that can carry out a multi-step task on its own, not just answer a single question. |
| **Mounted agent** | An AI agent that has a specific expert's judgment "loaded into" it, so it does that expert's work the way they would. |
| **Imprint** | The expert judgment loaded into a mounted agent — the captured know-how of a specific person (e.g., Stauss's lending instincts) that makes the agent valuable and hard to copy. |
| **Deal-graph** | A growing record of real deals and their *outcomes* (who needed what, priced at what, approved or declined, funded when, performing how). Valuable because no contact database has it. |
| **Substrate** | The shared foundation of data and capability that every agent both draws from and adds to, so each new agent makes the others smarter. |
| **Closed loop** | When the system stays involved all the way through funding, so it learns from real outcomes instead of just making suggestions and never finding out whether they were right. |
| **Wedge** | The small, simple first thing you sell to get in the door, before the bigger, more valuable product. |
| **Forward-deployed engineer (FDE)** | Our go-to-market approach: build the working solution for a specific customer's problem first, turn it on, and let the value sell itself (the Palantir / AWS pattern), rather than selling generic, off-the-shelf software. |
| **Sandbox** | A sealed, contained environment where sensitive data can be worked on without any of it leaking out. |

---

# Part 2 — What this means for what we're building

> *Skip this part if you only want to understand the industry. Everything above stands on its own. This part connects the industry facts to the product we're building (Tokenrip, and the equipment-finance product built on it, Quintel). It uses the product/technology terms defined in the glossary above.*

## The strategic takeaways, mapped to the industry

**1. The customer is two-sided, and the named firms are pre-introduced.** The market is businesses-that-need-money on one side and lenders-with-money on the other — not a single customer type. Our best early buyers are small-ticket lenders, independent brokers, and placement firms like Bevel. The pitch to a broker is sharp: turn an operator who needs a whole support team into a one-person "order-taker" whose only remaining job is the client relationship. Every firm Stauss has named (Bevel, NED, Cloud Store) is a potential customer he can introduce — pre-built distribution.

**2. The deal lifecycle is the product map — but you have to stay in the deal.** Each stage in §4 is a candidate for its own agent. Build *one* first (finding deals + a light pre-qualification) and treat the rest as the roadmap. The critical point: the value compounds only if the system stays involved through *funding*, so it captures what actually happened (the closed loop / deal-graph). A tool that only *finds* deals never sees a funding, so it never builds that data — and stays a worse version of Apollo forever.

**3. The two ways of underwriting are two different products.** The "math way" (small deals) is easy to build, low-value, and a good on-ramp. The "judgment way" (big deals) is Stauss's hard-won expertise — the durable, hard-to-copy part (the imprint). The highest-leverage early build is a **thin underwriting slice**: take a sourced deal and stamp it *fundable / marginal / pass*, plus a rough rate range and the reasons. That turns a plain contact list (which Apollo can produce) into a pre-qualified, pre-priced lead (which only the expert judgment can produce) — the exact thing Stauss got visibly excited about ("a pre-approved term sheet tomorrow").

**4. Don't compete on contact data.** That's Apollo's game, and we'd lose. Compete on two things instead: (a) the expert judgment, and (b) the free public *timing* signals from §7 — EDGAR filings, federal contract awards, and lien records — plus the borrower survey. Target deals on *whether they'd actually get approved and funded*, not on company size, which routes around the unreliable revenue data entirely.

**5. Equipment type is a core product dimension.** The judgment, the resale-value math, and the timing signals all differ by equipment type (cranes ≠ trucks ≠ medical). Depth in one type beats breadth across many. The tier-2/3 supplier focus and soft-cost project bundling from §9 are targeting rules to build in.

**6. Compliance handling is the price of entry — and a selling point.** Ted's first real question was about Social Security numbers (§8). Any product here must design the sensitive-data handling in from day one: a "no-train" vendor plan, a local model, or a full audit-ready setup. Done well, "we build you a sandbox for your sensitive data" is itself part of the pitch.

**7. Pricing: favor predictable revenue, frame the savings.** Stauss's instincts run to broker-style success fees and royalties, which are lumpy and collected months later. Take his creativity as input but anchor on a subscription + milestone base, with success fees as upside. And bake the headcount-replacement story (§6) directly into the product's output ("this replaces roughly N salespeople").

**8. The dealer desk (NED) is the same engine plus an add-on.** NED has no deal-finding pain; its pain is ranking and routing among too many lenders — the *same matching capability* as Bevel. So NED is a configuration of the same core engine, plus a "structuring" add-on for the dealer-specific math (residuals, blind discounts, multi-unit deals). Its natural first product is a lender scorecard: rank the 31 lenders on real track record, keep the best 5–6, and route each deal to the best fit. Note that the expert judgment for NED lives with Andy Cooper, not Stauss — collect it from the operator who actually holds it.

## The build punch-list

In rough order, with how soon each is needed:

1. **Lifecycle = product map.** Build deal-finding + a light pre-qualification first. *(building first)*
2. **Encode the expert's judgment** (the rubric): *fundable / marginal / pass* + a rate range + the reasons. *(building first)*
3. **Capture the deal-graph data from day one** (schema below). *(building first)*
4. **Target on approvability, not company size** — routes around the bad contact data. *(building first)*
5. **Treat equipment type as a core dimension;** go deep in one type. *(building first)*
6. **Build the borrower survey** for clean, direct demand capture. *(building first)*
7. **Match the two sides** (borrower × lender), graded by fit. *(building first)*
8. **Design the sensitive-data / compliance handling in from the start.** *(building first)*
9. **Soft-cost / project bundling + tier-2/3 supplier targeting.** *(next)*
10. **The bigger agents:** full institutional underwriting, an approval-memo engine, the paperwork/redline agent, compliance monitoring, end-of-lease handling. *(next / later)*

## The deal-graph capture schema

The fields to record for every deal — this is the proprietary data that compounds over time, and the format the pre-qualification output writes into:

```
deal_size              · ask (amount + purpose)
asset_class + specifics (e.g., "2021 Cat 336, lien matures 2029")
borrower_profile       · lender
priced_rate / term     · approved_rate / term
funded_amount + schedule (e.g., $1.5M now / $8.5M Q4)
decline_reason (if declined)
current_performance / status
```

Every row of this is something a contact database structurally cannot produce — it requires *outcomes*, which only exist if we stay in the deal through funding.

---

## How to use this document

- **Want to understand the industry?** Read Part 1 top to bottom; use the glossary as you go.
- **Building an equipment-finance agent?** Start with the Part 2 punch-list, then pull the relevant Part 1 section for the facts.
- **Checking that we got the domain right?** The §5 underwriting split, the §7 sourcing reality, and the deal-graph schema are the cleanest pieces to send Stauss as a "did we capture this correctly?" review.

*Living document. Primary sources: calls with Stauss Paulos (2026-05-28, 2026-05-29, 2026-06-01) and the customer call with Ted Craver / Bevel (2026-06-01). Companion: the [[stauss-vfi-tokenrip-briefing]] (the deal and relationship).*
