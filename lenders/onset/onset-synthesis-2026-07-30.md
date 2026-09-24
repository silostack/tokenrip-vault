---
title: "Onset Financial — Synthesis: everything in one place"
status: active
owner: Simon
type: synthesis / orientation
created: 2026-07-30
audience: Simon (internal only)
purpose: >
  Single-document comprehension of the Onset deal across product, customer, data,
  legal, and business. Plain language. Every claim traces to a source doc listed
  in §2. Internal only — contains commercial reasoning and product defects.
---

# Onset Financial — the whole picture

*Internal. Not for sharing. Last updated 2026-08-18.*

## Update — 2026-08-18: Onset has validated usability; access to decision-makers is now the operating constraint

**What changed.** Heath Birchall, whose title is unconfirmed (**inferred operational manager, medium confidence**), ran an implementation check-in after Jerman's departure. He said Onset is receiving “a lot of leads,” reported that two reps find the dashboard easy to use, and asked Quintel to trial a **$50M–$350M revenue band** (prior minimum: $20M). The explicit reason is reachability: Onset's largest client concentration is $75M–$300M, while larger companies add decision-maker layers. He also specified the outbound contact ladder: CFO → controller → treasurer → VP/director of finance → COO → CEO; **direct phone is the priority**, then LinkedIn/email, with name/title still useful. Source: [[bd/calls/transcripts/heath-birchall-2026-08-18]].

**So what.** Do not interpret a request for contact information as a general enrichment feature commitment. The product’s immediate test is narrow: can a labelled $50M–$350M cohort, with finance-first contact coverage, improve reach and downstream conversion enough to justify third-party data cost under a contingent-fee deal? No baseline for calls, connects, conversations, applications, approvals or fundings was established. Set one before working the cohort; otherwise Onset can continuously refine inputs without either side learning whether Quintel produces revenue.

**Account risk reset.** Jerman has left Onset, so the former champion/user thread is broken. Heath will ask whether the reps want a working session, but current user names, owner, authority, rep activity and the prior four-seat expansion’s status remain unconfirmed. The nearest cheap test is a rep session that captures the last five Quintel leads per user and their outcomes—not another generic product walkthrough.

**Immediate actions.** Configure the $50M–$350M trial; sample 25–50 leads for the requested contact ladder and report direct-dial/LinkedIn/email coverage plus marginal cost; ask Dave and the reps for lead-level results in Teams; establish a four-week (or mutually agreed) comparison scorecard. Keep Edge integration and broad UX work out of scope until those results identify a different bottleneck.

---

## 1. The deal in twenty lines

**Who they are.** Onset Financial. Independent equipment finance lender, HQ Salt Lake City, Jerman based in St. George UT. Funded **$4B since 2008**. Does **100–250 funded deals a year**. Their own marketing says **$500K–$25MM+** per deal. They underwrite on credit first and are industry-agnostic. They fund equipment overseas, which most US banks won't touch.

**What we agreed.** The master agreement and Exhibit B platform rider are **executed**, effective 08-05. The master agreement provides a 0.5% floor of the amount actually funded, paid within five business days, but its per-transaction Broker Fee Schedule governs the actual fee. For Platform leads, the rider requires a delivered Lead Register, a 10-business-day objection window, reasonable attribution, funding within 12 months, and an executed Broker Fee Schedule or other written fee agreement. The previously discussed oral 0.5%–1% **cost-of-property** range is not the complete enforceable mechanism. Source: [[onset-executed-master-broker-referral-agreement-2026-08-05]].

**Who's involved.** **Jerman Juarez-Padron** was the champion and first user, but has left Onset (confirmed 08-18). **Heath Birchall** now runs the operational check-in; his title and authority are unconfirmed. **Britain Johnson (VP)** and **Jeff Miller** were the recorded decision-makers, while an unidentified VP of Sales previously requested a manager-plus-three-rep rollout. Whether that request survives Jerman’s departure is unconfirmed.

**Where it stands.** Quintel is in active deployment and Onset is supplying workflow refinement requests. The 08-18 request is a $50M–$350M revenue trial plus finance-decision-maker contact data. The agreement is executed; account owner, active rep roster, per-transaction fee schedules, and measured lead outcomes remain unverified.

**Why it matters.** Furthest any Quintel deal has gone on commercial terms. It's also the **third** lender to independently ask for revenue share, after Max/Providence and the Stauss channel. So this is a pricing-model decision, not an Onset concession.

**The catch.** Zero guaranteed revenue. Every dollar remains contingent on a funded deal from a feed whose fit and contactability have not been measured; the original part-time champion has now departed.

---

## 2. Document map — what each file is and what to do with it

### Theirs (received 07-29)

| Document | In plain terms | What to do |
|---|---|---|
| **OFI Master Broker Agreement.docx** | Their standard broker contract, untouched template (placeholder fields still say "click here to enter text"). Built for a broker who brings them a borrower and shops the deal. We are not that. | Read §3 of this synthesis. Nine problems, four serious |
| **Executed Master Broker & Referral Agreement (08-05)** | Executed master agreement and Exhibit B Platform rider. It confirms the Platform framework but does not fix the fee schedule, liability cap, broad objection discretion, or funding-notice weakness. | **Operative record:** [[onset-executed-master-broker-referral-agreement-2026-08-05]] |
| **Onset Financial One Pager.pdf** | Their marketing sheet. Three useful facts: **$500K–$25MM+** deal size, **$4B funded since 2008**, **74% of customers do repeat transactions**, and "flexible with many types of equipment **all over the world**" | Use the $500K–$25MM band to configure their buy box, not the $60M stories from the calls |
| **Two call transcripts (07-23, 07-29)** | Call 1: Alek pitched, Jerman rejected subscription and proposed revenue share himself. Call 2: committee approved, scope shrank to one user, and the back half revealed the international sourcing problem | Already mined. Everything relevant is in the contact doc and here |

### Alek's

| Document | In plain terms | What to do |
|---|---|---|
| **QuintelOnsetRiderv220260730.pdf** | A one-page add-on to their contract that says "if this conflicts with the agreement, this wins." Covers how leads get registered and attributed. **Genuinely good**, and better structured than my first pass | Superseded by the merged drafts below. Four of his clauses were kept as-is |

### Mine (created 07-30)

| Document                                                   | In plain terms                                                                                                                                                                                           | What to do                                                        |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **onset-production-readiness-2026-07-30.md**               | The full analysis. Agreement problems, a readiness checklist verified against the actual codebase, data quality, operations, and the risk map                                                            | The reference doc. Read §5 if you read nothing else               |
| **onset-rider-combined-2026-07-30.md**                     | ✅ **The one we're sending (v3).** Five sections, about a page. Registration and the objection window · the multi-customer carve-out · as-is data, notice-and-cure and a liability cap · post-termination survival. Fees, platform use and publicity were all cut | Fill in the entity name and the liability floor, `/humanizer` the cover note, send |
| **onset-rider-ab-split-2026-07-30.md**                     | ~~Option 2, two riders.~~ **Superseded 07-30** and not updated to match the v3 cuts                                                                                                                     | Ignore                                                            |
| **onset-term-summary-and-proposed-language-2026-07-30.md** | Part A is a one-page plain summary of terms to lead with. Part B explains why each change follows from us being a data service. (Part C's clause language moved into the riders)                         | Send Part A as the cover for whichever rider you pick             |
| **quintel/planning/2026-07-30-onset-go-live-runbook.md**   | The deploy and provisioning plan, in the code repo. Adds a database backup, a config safety check, and correct sequencing to the existing release runbook                                                | Follow it when you deploy                                         |
| **quintel/docs/superpowers/specs/2026-07-30-lead-reservation-and-disposition-design.md** | The reservation + three-button disposition build, in the code repo. Written as a PRD: why it exists from the customer, business and product angles, then the design and the invariants it must not break | Read §2 for the reasoning, §5 before anyone writes code |

### Background docs that are load-bearing

| Document | Why it matters here |
|---|---|
| **quintel-pricing-structure-2026-07-23.md** | Your ratified commercial terms. Says revenue share **requires** a 12-month term *and* a dedicated pod of 2–3 named reps, and that "a deal missing any of them is not this model." Onset has one part-time rep. Also contains the exact instruction for this deal that didn't happen: *"we bring a one-page term summary so the mechanism arrives as our draft"* |
| **quintel-enrichment-data-defects-2026-07-29.md** | Eight documented data defects. Directly relevant because the contract would have us warranting the data is true and complete |
| **quintel-data-rigor-roadmap-2026-07-21.md** | Two items to start now: stop throwing away raw source data at ingest (half a day, and every day of delay is history you can never recover), and build a 200-pair accuracy test set for entity matching (one day) |
| **quintel-lead-register-prd + design spec (07-25/27)** | The attribution system's design. Built, not deployed. Explains why "surfaced" rather than "clicked" is the right trigger |
| **jerman-juarez-padron.md** (contact doc) | Running intelligence, ranked assumptions, and the open commitments list with dates |

---

## 3. The contract, in plain English

Their agreement is mostly fine. These are the problems, worst first.

### Serious — don't sign without fixing

- **Nothing makes them tell us a deal funded.** They have to pay within 5 business days of funding, but no clause obliges them to say a funding happened. On a contract where 100% of revenue is contingent, we'd learn about our own money by asking.
- **Their exclusivity clauses assume we're a broker with one borrower.** Read literally, they'd stop us running a multi-customer platform at all. Worst one: **we couldn't do business with any of their funding sources for 12 months after we stop working together.** Their funding sources are banks and capital providers. That's our market. This is the only clause with consequences beyond this deal.
  - *Updated 07-30.* Their concern is legitimate and narrow — a broker who learns who funds the lender and goes straight to them. We'd never do that, so the riders now concede that prohibition outright in our own words, then clarify what it doesn't reach. Two things had to be added: selling the platform to a bank isn't "doing business with" them, and **a funding source we find in public records isn't one we "learned of through Onset" — UCC filings name assignees and our own pipeline reads UCC data**, so without that, running the product arguably breaches the clause. Free mitigation on top: never ask who funds them, and don't write it down if they volunteer it.
- **There's no cap on what we could owe them.** Their indemnity is broad, includes legal fees, and waives our right to make them share any cost. Meanwhile we have a written memo saying entity matching returned a gun shop for a federal contractor. Zero guaranteed revenue against unlimited liability is the worst trade in the document. *(Corrected 07-30: the accuracy warranty itself is fine — it's qualified "to the best of Broker's knowledge after reasonable inquiry," so machine output we don't know to be false is already outside it. Earlier drafts called it unqualified. The exposure is the missing cap and their unilateral clawback right, not the warranty.)*
- **A company they've touched before pays whatever they feel like.** Their clause makes the fee discretionary wherever they had prior contact, decided at funding time. They carry a large database of cold-called companies.

### Commercial holes

- **The fee percentage isn't in the main agreement.** It goes in a per-deal schedule signed transaction by transaction, with a clause allowing "such other amount as may be agreed." So they set our rate deal by deal, after we've delivered the lead.
- **Everything Jerman said out loud is legally void.** There's a clause stating nothing outside the signed document counts and neither side relied on anything said. That kills the 0.5–1% range, the "smaller deals skew to 1%," and the escalator to 1–2%.
- **If a broker also gets paid on the deal, we get nothing.** Their clause withholds our fee where a third party is compensated on the same schedule. **Jerman's entire job is broker relationships.** The most likely workflow in this whole deal — he sees our lead and hands it to a broker who knows the space — pays us zero. Nobody flagged this on either call.
- **The fee basis in the contract isn't what Jerman described.** He said "cost of property, not our margin," repeatedly. The contract says "the total amount actually funded." Those differ on sale-leasebacks, which he named as a live use case.

### Smaller, but cheap to fix

- **No tail.** One-year term, 30 days' notice to not renew, fees accrue only on funding. They could not-renew and fund our pipeline 60 days later for free. Their deals take weeks to months.
- **The agreement never mentions software.** No license, no limit on them exporting our output, nothing stopping them building their own version. **They build everything in-house and said so twice.** Their only software subscription is Sales Navigator. Under revenue share they pay nothing to evaluate, so copying costs them only engineering time.
- **Being called a "broker" may create licensing exposure.** Several states regulate commercial-financing brokers; Utah has a regime and they're a Utah corporation with Utah governing law. Whether it catches a referral party is a question for counsel, not something to assert. The cheap fix is calling us "Referral Partner" — their document is already titled *Master Broker & **Referral** Agreement*.
- **No reference rights.** We're accepting a below-card structure and getting no right to name them as a customer. Costs them nothing, worth more than 25 basis points.

---

## 4. Alek's rider — what it does, where it needed fixing

**What it gets right, and better than my first pass:**

- **The structure.** A standalone one-page add-on saying "this rider wins" is much better than asking their lawyer to edit their own template. One signature, template stays closed, and it beats the "nothing outside this document counts" clause structurally instead of by amendment.
- **"Presumed accurate absent manifest error."** Puts the burden on them to disprove our record. I didn't have this.
- **"Regardless of… which party contacted the Customer, or which party documented the transaction."** One phrase kills their prior-contact discretion *and* their requirement that they write the introduction down. **This deleted a build item** — I was going to have the product generate that writing; his version removes the need.
- **"May not be reduced, withheld, or made discretionary."** "Discretionary" is the exact right word to target.
- **Presence in their CRM, prior marketing outreach, and contact on an unrelated deal are all explicitly not "active engagement."** Two exclusions I didn't have, both real — their reps cold-call by industry and Jerman named flyers as a channel.

**The big gap:** it covers attribution only. All four serious problems in §3 are untouched.

> **The asymmetry worth remembering:** his rider makes attribution airtight and leaves the price completely open. His no-discretion clause is qualified to "on the basis of prior contact," so the per-deal rate schedule survives untouched. You'd win every argument about *whether* a fee is owed and lose every argument about *how much*.

**Three things I changed, and why:**

| His version | Changed to | Plain reason |
|---|---|---|
| A lead counts once someone "accesses, views, saves, or exports" it | Counts on **delivery** of a register, or earlier if he touches it | Clicking is narrower than we want *and* partly not logged. But "anything our system showed" is too broad for them and would sink the rider. Delivery is a finite list they can actually review, and we stop needing click tracking |
| Object within **5 business days** | **10 business days**, from delivery | You can only fairly object to something you've been sent. A longer window delays only the *lock*, not eligibility, so it costs us almost nothing and makes the finality clause hold |
| Attribution restarts every time he looks at the company again | Cut. Replaced with re-registration after the period expires | Our system re-surfaces companies constantly, so this made attribution permanent. A lawyer reads that as bad faith and it poisons the honest clauses |

Also added: "business days" defined as weekdays (our code counts weekdays with no holiday calendar), and the funding notice now has to state **both** the cost of property and the amount funded so the fee can be checked.

**Kept your call:** the 6-month lookback for "active engagement," as he drafted.

---

## 5. Product — what's actually built

### The good news, which is bigger than expected

**The attribution system already exists.** Per-customer logging of every company we surface, with timestamps. A "REVSHARE" account type at 0.5%. A register you can export as a CSV and deliver by signed link, with a hash stored so the file can't be quietly altered. A worklist for checking fundings against public records. All built.

**The bad news:** it has never been deployed. It's sitting on a branch as **124 commits that have never run on a server**. Production is live and serving an older version.

### What the deploy involves

- 10 database changes to apply, against a records table that's already out of sync with the actual database. Applied wrong, the whole batch fails and rolls back.
- 2 of those 10 carry data fixes and must **not** be marked as already-applied, or they permanently strand the exact rows they exist to fix.
- 2 more are one-way. Their undo doesn't restore the previous state, so **you cannot roll the database back past them.**
- A browser acceptance test (password reset, invites, seat counting) that **has never been performed anywhere.**
- The runbook's own header says: *"This is a plan. Nothing here has been run against a host."*

**My additions:** take a database backup first and prove it restores (nothing in any runbook does this, and it's the only real safety net given the one-way changes). Do the deploy on its own day with a full day of soak. Provision Onset **after**, on a separate day.

### What's missing for this deal to produce money

1. **Weekly register delivery.** The button exists; the habit doesn't. Under the rider, a lead only becomes fee-eligible once it's on a **delivered** register. The code literally says *"undelivered leads stay registered forever."* **No delivery means no eligible leads and nothing that ever locks.** This is now the single most important operating habit in the account.
2. **Recording the funded amount and the fee.** There's a "funded" status but no funded amount, no funding date, no fee rate, no fee amount, no invoice. Nothing turns "funded" into "$X owed in 5 business days."
3. **Per-deal rate.** The system stores one percentage per account. Onset's rate varies by deal size.
4. **Dismissal reasons.** Deliberately switched off. For a one-user test this is the fastest way to learn *why* leads miss their box. Cheapest useful build on the list.
5. **A morning email.** There's no digest capability at all. He told us he'll work this every morning, and right now he has to remember to open a URL.

### The analytics gap you asked about

- **"What he's seen"** exists only as the register's surfaced events — which are undeployed. There's no separate view-tracking, by design.
- **"What he's touched"** exists: saves, dismissals, and drawer-opens are all recorded.
- **Nothing adds any of it up.** There's no view showing surfaced / opened / saved / dismissed / funded / fees earned / last login.
- That one panel is simultaneously: the renewal argument, the invoice backup, the answer to "is he still using it in week 3," and the thing his committee will ask him for. **Stauss independently asked for the same panel.** One build, two customers.

### Two small product changes the rider now requires

- The 12-month clock should run from **registration** (first delivery, or earlier if he touches it), not from when we surfaced it internally.
- Re-registration after a period expires starts a new one. Replaces the rolling restart we cut.

### One capability added 07-30 — reservation and disposition

Founder decision: **build the general mechanism, grant it to Onset only, default off.** Full design in `docs/superpowers/specs/2026-07-30-lead-reservation-and-disposition-design.md` in the Quintel repo; the go-live runbook carries the sequencing and the traps.

Three buttons on a surfaced lead — *working it* · *already ours* · *not a fit* — doing four jobs at once:

| Job | Why it matters here |
|---|---|
| **Mirrors their §4.3** | Their agreement gives them 5 business days of exclusivity on a referred deal. That clause is inert against a platform. "Mark it and we hold it off every other customer for 5 days" is the version that works — and it's the concession that turns the rider's multi-tenant relief from a taking into a trade |
| **Gives them a reason to care about the register** | They pay nothing for access, so only goodwill motivates accurate attribution. Once holding a prospect off competitors is something they *want*, the register becomes shared infrastructure instead of our ask |
| **Makes the objection one click** | *Already ours* is the §4.2 prior-contact objection, raised while he's looking at the company, instead of a written notice with documentary evidence he'll never send |
| **Captures the outcome data** | The register sees what we showed and what funded, nothing in between. The middle is the learning this deal is worth more for than its fee. When a claim lapses, ask one question — he answers because he got 5 days for it |

**And it addresses the 74%.** A standing first look on customers they funded — bounded, with a deemed decline on silence — is worth *trading* for an attribution tail that runs from the last funded schedule. That converts the repeat-business statistic from the deal's worst structural fact into an annuity. That's an 08-04 conversation, not a 07-31 clause.

Two things to hold onto:

- **The claim can never be the only attribution trigger.** If not clicking is free, the whole fee mechanism becomes voluntary. Delivery-based registration stays the baseline; claiming only *adds* exclusivity and forecloses the objection.
- **Exclusivity accumulates and is invisible to the customers it affects.** Free at one customer; at five lenders and a few hundred funded deals the platform is quietly worse for everyone. Hard time bounds, and instrument the suppressed share now rather than discovering it as a complaint.

Roughly a week of work, and v1 needs no cross-account filtering at all — there's no second account to suppress from. The filter gates customer #2, not Onset.

---

## 6. Data — what could embarrass us

Eight documented defects. Re-ranked for *this* customer.

**Fix before he logs in:**

- **Dates are wrong in a way he can catch by clicking.** Federal award signals carry the date *we downloaded* the record, not the date the award was signed. Measured examples were **15 and 23 months stale**. The evidence link on every row goes to a public page that displays the real date. A large-ticket closer will click. Cheap fix — the award ID is already stored.
- **Wrong companies.** With no registry ID to anchor on, matching falls back to name search. A Department of Transportation contractor holding $27M in awards resolved to a **gunsmithing shop in Bend, Oregon**. In front of this customer that's a credibility event, and entity matching is the exact thing we tell buyers not to try building themselves.
- **The ticket estimate is fake in a way that's backwards for Onset.** It's just revenue × 8%. For their $750K floor that requires revenue of $9.4M+; for their $1M–$100M range, $12.5M–$1.25B. Most companies in the sample had $1–3.5M of revenue, from an unreliable third-party guess. **This will mis-sort their entire buy box.** Either fix it or take it out of ranking for this account.

**Genuinely lower risk for Onset:**

- State/geography mismatches (9.5% of rows) matter less — they lend in all 50 states, so a geography filter isn't doing much work.
- The UCC filing problems matter less — those are small-ticket, three-state data. Onset is national large-ticket.

**Also worth knowing:**

- All the defect magnitudes were measured on a local development database. **Re-measure against production before quoting any of them.**
- Do one thing that isn't a bug fix: **start saving raw source data at ingest.** Half a day. Every day without it is history that can never be re-processed when extraction improves.
- **Read the top 50 rows their box produces, by hand, before handover.** Highest-value hour of quality control available.

---

## 7. Business — the money math nobody has done

**The framing to correct:** "one deal could net us six figures" is true of the tail, not the middle.

- $4B over ~18 years, at 100–250 deals a year → average deal roughly **$1–4M**
- At 0.5–1%, a typical funded deal pays **$10,000–$20,000**
- Six figures needs a **single deal of $10M+ at 1%**, or $20M+ at 0.5%
- Their marketing band is **$500K–$25MM+**. The $60M and $257M stories are outliers, not the distribution
- **74% of their customers do repeat transactions**, so a large share of annual volume is existing customers we can never claim a sourcing fee on
- Jerman's own projection: ~$90K year one, $300–400K year two. That implies 10–20 attributed fundings a year **from one part-time seat**
- Realistic year one: **0–3 fundings, $0–60K**, with a genuine fat tail

> **So the real value here is the reference and the learning, not the fee.** That should govern how much engineering this earns. Spend the minimum that makes the money path real and the data credible, and make every piece reusable for the subscription band.

**The conflict with your own ratified terms.** Your commercial doc says revenue share requires a 12-month term **and** a dedicated pod of 2–3 named reps, both as contract terms, because *"without them, a zero-base deal is a free option on our cost."* Onset has one part-time rep. Two ways out:

- Ask for the pod now, and invite "why do you need more of our people?"
- Ask instead for a **written expansion trigger** — 2–3 named reps at N funded deals or by month six. Costs them nothing to agree.

**What's genuinely strong about this deal:**

- Credit committee already approved. Real mandate, not a maybe.
- Zero cost to them means no procurement fight, no budget cycle.
- Their decision speed is real: *"it's just myself and the credit committee,"* Britain sits one office over.
- Fast payment, by wire, 5 business days.
- The rate is **better than your own card** (0.5–1% versus a 0.5% quote and 0.35% floor).
- One seat means no CRM integration work. A real simplification.
- Third lender to ask for revenue share unprompted, so if it works you have a productized band with a reference.

---

## 8. Where this gets sticky

**Contract friction**

- **Ask for too much and we look like a vendor with lawyers instead of a partner.** Mitigation: the riders are framed so most items read as protections for *both* sides, and the 10-day objection window is a right they don't currently have.
- **The 6-month lookback is our most aggressive term.** Be ready to concede to 12 months; treat it as the planned give in exchange for the multi-customer carve-out.
- **The liability cap is "fees paid in the last 12 months," which is $0 when nothing has funded.** Their counsel may notice. There's room to concede a modest floor.
- **"Subsidiaries, parents, and affiliates"** is an aggressive expansion. Nice if it survives; not worth dying for.
- **Asking for the fee floor in the main agreement could reopen a settled commercial conversation.** Defensible because Jerman said himself it would be *"explicitly said on the master broker agreement."*
- **Jerman isn't the signer.** Britain and Jeff decide. Everything we send has to survive being forwarded to people who weren't on the calls.

**Operational friction**

- The deploy could break in front of a paying customer. Hence: separate days, backup first.
- A bad config file in Onset's own settings folder fails **their** pipeline every run, silently. They'd be the first account we've done this for since that was written down.
- Password handover has no self-service reset in production today until two email settings are set.
- Mobile has never been tested, and he's a travel-and-relationships role.

**Relationship friction**

- **The vendor feature is an open, unpriced promise.** He asked about surfacing equipment vendors; Alek said "within reason, no issue." Nothing does this and it's a different data shape. **He will raise it Tuesday.** Take a position first.
- **He will ask about international.** Decide the answer before the call, not during it.

---

## 9. The reframe worth testing before Tuesday

Their edge is international. Our system has **no country field at all** — geography is city and state, every data source is US-only, UCC covers three states. So the segment they're best at is invisible to us. And Jerman said the reverse too: US big deals are *harder* for them, because those borrowers already have good banks.

**But we don't need to see Portugal. We need to see the US company that's about to move equipment to Portugal.**

Jerman described the motion himself: *"companies in the United States are establishing somewhere else, moving their manufacturing over there."* That announcement is made **by a US company, in US trade press** — and we already have a corporate site-selection and facility-expansion feed wired in as a live source.

If it works, it's the most differentiated thing we could put on the table Tuesday. It's a query against data we already have. **Test it before the call.**

Second idea, same spirit: **watch their own UCC filings.** When they fund a secured domestic deal they file a UCC-1 naming themselves. We already ingest UCC data. Watching one secured-party name gives us the one thing the contract doesn't oblige them to provide — independent knowledge that a deal funded. Coverage is three states today and international deals file nothing in the US, so it's partial. Worth scoping the cost of watching one name nationwide.

---

## 10. What could actually kill this

1. **It succeeds modestly and eats six weeks of build the subscription band needed.** The most likely bad outcome, and the reason to build narrowly.
2. **Jerman leaves.** He is the champion, the only user, the referee on attribution disputes, the rate negotiator, and the informal keeper of every verbal promise the contract voids. Not a trust issue — the paper has to work without him.
3. **They build it themselves.** They build everything in-house, said so twice, pay nothing to evaluate under revenue share, and the contract has no license, no export limit, and no anti-copying clause. Six months of registers plus a lead list is a specification.
4. **Coverage and their edge barely overlap** — and the likeliest workflow (route our lead to a broker) is exactly the path that pays us nothing.
5. **The deploy goes wrong** in the week a paying customer first logs in.

---

## 11. Decisions owed

| # | Decision | By |
|---|---|---|
| 1 | The $50K floor under the liability cap — right number? A cap of "fees paid in the last 12 months" is $0 until something funds, which invites a counter | 07-31 |
| 2 | Counsel review, or self-redline with counsel on the two unsignables only? | 07-31 |
| 3 | Push for the 2–3 rep pod, or take one seat with a written expansion trigger? | 08-03 |
| 4 | Revenue share: standard band, or Onset-only structure? | 08-03 |
| 5 | Vendor surfacing: committed with a date, or out of v1? | 08-04 |
| 6 | Fix the ticket estimate, or take it out of Onset's ranking? | before handover |
| 7 | Build the offshoring signal, or state the limitation plainly Tuesday? | 08-04 |
| 8 | Which legal entity signs, and its state of formation? | before send |
| 9 | Offer the standing first look Tuesday, and at what attribution-tail price? | 08-04 |
| 10 | Concurrent-claim cap multiple — `25 × seats` is a guess with no usage data behind it | before customer #2 |
| — | *Resolved 07-30: the register's window columns stay, because the rider now grants both windows* | done |
| — | *Resolved 07-30: cross-customer exclusivity is built as a general capability, granted to Onset only, default off* | done |
| — | *Resolved 07-30: combined rider, cut to five sections. Fees, platform use and publicity dropped to talking points* | done |

---

## 12. The week

**Before Fri 07-31** — the window that closes first
- Pick the rider packaging and send it, with Part A of the term summary as the cover
- Verify one thing internally before it's ever repeated in writing: whether "we're already doing rev-share deals" is true (Alek said it on 07-23)

**Before Tue 08-04**
- Run the coverage count against their box. A real number, plus the deal-size spread. *This same number answers a question five other lenders have asked and none have had answered.*
- Test the offshoring-signal idea
- Fix the two customer-visible data defects
- Take positions on vendors, seat count, and the pod trigger

**On the call Tue 08-04**
- Capture the buy box properly
- **Ask his personal funded-deal count and his first-contact-to-funded cycle time.** Still unasked across two calls, and it's the only input that turns this from a story into a model

**Then**
- Deploy on its own day, backup first, soak a full day
- Provision Onset the day after
- Hand-review the top 50 rows
- Hand over, with weekly register delivery to **two** Onset addresses

**Weeks 1–4** — watch one number: **does he open it in week three?** Nothing said on Tuesday tests that.
