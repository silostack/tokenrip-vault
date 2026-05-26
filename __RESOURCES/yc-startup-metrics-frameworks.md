# YC Startup Metrics Frameworks — Reference

Synthesized from two YC Startup School talks. Keep as a reference for KPI design, prioritization, and metric discipline at any startup stage. Specific Tokenrip application lives in [[../bd/kpis]].

**Sources:**
- Tom Blumfield (YC group partner; co-founder of GoCardless, ex-Monzo) — *B2B Startup Metrics* — https://www.youtube.com/watch?v=_mKeVGSqQac
- Divya (YC visiting group partner; two-time YC founder; leadership at DoorDash) — *Setting KPIs and Goals* — https://www.youtube.com/watch?v=6DTK9yDP6p0

---

## Why Metrics Matter

Running a startup without metrics is like flying an airplane with no instruments — you don't know what's happening to the aircraft and you're not in control. Investors can immediately tell founders who are in command of their metrics from those who aren't; fluency with DAU/WAU, ARPU, and conversion rates is a major signal.

Two failure modes flank good practice:

1. **No metrics.** Founders launch on Hacker News or Product Hunt, get hundreds of users, and have no idea how many are returning vs. new. They could be churning instantly. Build basic metrics into the product *before* you launch — don't go back and add them.
2. **Metric over-engineering.** Pre-launch dashboards with 500 metrics. Split-testing whether a button should be blue or green when you don't have the volume for it to matter. Split-test important decisions ($80/year vs $200/year pricing) but not trivial UI choices. Most decisions belong to product intuition + customer conversations, not statistical significance.

**Don't hide behind metrics.** Brian from Airbnb still hosts Airbnb users in his home. Get out of the building. Metrics + customer conversations + product intuition is the right blend.

---

## Picking Your First Four-or-Five Metrics

If you're about to launch and have no metrics in place:

- **Pick four or five key metrics** to track accurately. Not 30, not 50. The number grows over time.
- **Use the simplest analytics tool you can operate.** SQL queries on your database. PostHog (YC W20) for SQL analytics on top of any database. Anything you'll actually maintain.
- **Agree on definitions and stick with them.** Constant arguments about what your key metrics mean are worse than not having metrics. Is an active user someone who used the product daily, weekly, or 5x/week? The precise definition matters less than everyone agreeing on it.

The classic friction example: marketing reports "2,500 new leads this month"; sales says "those weren't qualified." Internal disagreement on metric definitions destroys productivity.

**Don't change definitions when things look bad.** If WAU isn't where you want it, don't switch to MAU just because the number looks better. You're only fooling yourself. Internal consistency over time matters more than cross-company comparability — every company defines things differently anyway.

---

## The Three Core Metrics for Every B2B Investor Update

Every B2B founder should know these and surface them at the top of every investor update:

### 1. Revenue

The key metric for almost all B2B companies. **Don't hide vanity-flavored substitutes:**
- Page views / unique visitors — big numbers untied to company success
- GMV (Gross Merchandise Value) — total dollar value of goods sold; eBay's GMV is not eBay's revenue
- Gross Transaction Value — for fintechs, "$50B in transactions" can mean very little revenue

Tom's example: a Middle East neobank reporting GTV growing 50% every two weeks. They were signing larger customers but giving them massive cashback to transact. GTV rose, revenue stayed flat. Founders were tricking themselves into thinking the company was succeeding.

**Don't hide if revenue is zero.** Tom's most impressive founder example sent 10 successive monthly investor updates with $0 as the headline metric. Honesty produced focus on what actually needed to change. If you're ashamed of a number and bury it, you're kidding yourself.

### 2. Burn Rate

Net monthly burn = monthly costs − monthly revenue. For most early-stage startups it's how much your bank balance shrinks per month.

### 3. Runway

Months of cash remaining at current burn. Example: $1M in the bank, $100K/month burn = 10 months of runway. In 10 months you're bankrupt.

> "If revenue, burn, runway aren't at the top of investor updates, the founder is hiding something." — Tom

(Consumer companies have a separate framework — early consumer often optimizes for critical mass / network effects before revenue. See YC's separate consumer-metrics video.)

---

## Retention — The Layer Cake

Retention is one of the most important metrics for any startup. If you sign up 100 paying customers in January, how many are still paying in February, March, April? Measure per cohort (January cohort, February cohort, etc.). The most powerful visualization is stacking cohorts on top of each other.

### High Retention: The Layer Cake

If retention is 80-90-100%, your cohorts stay fat over time. Two or three years out, dozens of monthly cohorts are all still paying — revenue compounds even without new acquisition.

Tom's example: GoCardless (recurring payments, similar to Stripe). Customers implement once and don't change payment infrastructure — extremely sticky. The team could go on holiday for a month and revenue would stay consistent.

The compounding effect is even stronger when **revenue expands per cohort**: if January's customers grow their businesses, they transact more by year 2 and 3, so per-cohort revenue actually *increases* over time. The team adds zero new customers and the business still grows. That's the unstoppable shape.

But this only works if the retention curve **flattens out**. A 20% retention that flattens is better than 90% retention that decays to zero.

### Low Retention: The Leaky Bucket

If customers churn to near-zero by month 6-9, you're scrambling to fill the bucket as fast as it leaks. You'll reach a natural plateau where you work as hard as you can just to replace last month's churn. Very hard to build a big business this way.

### Net Dollar Retention (NDR) — The B2B SaaS Lens

NDR captures the layer-cake effect numerically.

**Example:** AI customer service chatbot. 10 paying customers in January at $10K/month each = $100K MRR.

Twelve months later, looking only at those 10 original customers:
- 2 churned → -$20K
- 3 upsold from $10K to $20K (added phone/voice on top of text) → +$30K
- Net: $110K MRR from the original cohort

$110K ÷ $100K = **110% NDR.**

**Benchmarks:**
- Early-stage B2B SaaS: aim for **well above 100%** (125% good, 150% great). You've underpriced first customers, are adding features, and getting better at upselling.
- Mature companies: 110-120% is solid.
- **Below 100% for enterprise B2B SaaS = something is wrong.** Customers are churning; product isn't loved. Fix retention before pouring money into top-of-funnel.

This is what gives Stripe / GoCardless / PayPal exponential growth: new customers compounding on existing customers who themselves grow.

---

## Gross Margin

**Gross margin = Revenue − COGS.** COGS is any cost that varies per customer.

### AI Companies — The COGS Trap

Foundation model credits (OpenAI, Anthropic, etc.) are COGS. Just because you're getting free credits doesn't mean the cost doesn't exist. **Companies that hide behind free credits and claim huge gross margins have a nasty shock when credits run out.**

### Pure B2B SaaS Historically

COGS was minimal (AWS bill, bandwidth). Gross margins of 95% were common — sell $100 of software, it costs $5.

### Operationally Intensive Businesses

Delivery, home services, painting, heat-pump installation: gross margins of 5-15%. You need much more revenue to generate the same gross profit. YC often pushes founders toward a software-only version that runs at higher margins (sell the software powering the delivery company, not run the delivery company).

### The Negative Gross Margin Trap

Zero-interest era (2010-2021): companies scaled negative-margin businesses because capital was cheap. Uber sold $10 of service for $9 to reach network-effect tipping points; burnt tens of billions. The blitzscaling pattern spread to ride-share, 10-min grocery, e-scooters. A wasteland of failed startups when capital tightened.

With higher rates today, investors are loath to fund negative-margin businesses.

**If you start with negative unit economics, have a plan to fix them.** Tom at Monzo: first 500K customers cost £30-40 each. They brought tech in-house, introduced charges, added paid products, flipped to +£30-40 per customer. **Don't scale your customer base while unit economics are negative. Fix them first.**

---

## Tom's Recap

- **Revenue** is the best core metric for most B2B companies. Don't hide; put it front and center.
- **Retention** (and NDR) matter enormously. NDR > 100% is crucial for B2B SaaS.
- **Gross margin** matters. Don't scale negative-margin businesses.
- Track 4-5 key metrics before you launch — don't launch blind.
- Be rigorous about what you track. Avoid GMV, impressions, registered users as primaries.
- Centralize metric definitions. Don't have arguments about what an "active user" is.
- Don't hide behind metrics — get out of the building, talk to customers.
- Right blend: metrics + customer conversations + product intuition.

---

## Divya — Setting KPIs and Prioritization

Two terms:

- **KPI** (Key Performance Indicator): the metrics you track and report on, internally and externally. Make sure you're measuring what matters.
- **Prioritization**: the order in which you tackle work each day. Time is finite; the work is infinite. Prioritization tells you which super-important things you *don't* get to today.

These are linked because **prioritization means working on the things most likely to move your top KPIs.** Choose the right KPIs and be honest about which tasks actually move them.

---

## The Cost of Fake Progress

It's very easy to feel busy and feel productive without moving the business forward. Common fake-progress tasks:

- Optimizing paperwork tasks where "good enough" was all you needed
- Perfectionism on a feature nobody is using
- Premature optimization or building for scale you don't need
- Choosing an intellectually harder problem instead of building what users want

Divya's example: in early days, picking a legal firm. Many wanted to take her out to lunch / drinks / office tours. Felt flattering, felt busy. But pre-launch, picking a lawyer wasn't moving any KPI. Choose a good one and move on.

**Time has costs:**
- Faster to market = sooner earning money to reinvest
- Slower = more burn, more time for competitors to copy
- No real progress also has emotional / mental cost
- Raises red flags in fundraising and hiring

Run fast **and** run in the right direction.

---

## How to Prioritize

### Step 1: Identify Your Top KPIs

If launched, your primary KPI should be **revenue growth.** A non-revenue primary is rarely correct.

If pre-launch, KPIs might be "weeks until launch" or "number of user conversations." But shift to revenue growth quickly after launching.

### Step 2: Set This Week's KPI Goal

Make sure it ladders up to your longer-term goal. Weekly goals remind you of urgency — early growth compounds.

The Airbnb founding team wrote weekly KPI goals on their bathroom mirror. Multiple times a day, they were facing the reality.

### Step 3: Identify Your Biggest Bottleneck

Divya's example: **Super Daily** (daily grocery subscription in India, sold to Swiggy 2018). After V1 launch, lots of things to optimize — operational complexity, mobile app, ops tooling, inventory, on-the-ground logistics. Their North Star was growth, which made the bottleneck clear: high-intent users were dropping out of sign-up.

When they asked "why?", the answer wasn't UX — users wanted a specific milk brand Super Daily didn't carry. Onboarding that brand (not redesigning the sign-up screen) increased conversion 50%.

### Simple Prioritization Framework

1. Write down all ideas to hit your goal — don't start working on them.
2. Rank by probability of success, then sub-rank by complexity / time.
3. Pick a couple to try.
4. If KPI isn't moving, ask "why" several times until you understand the real reason.
5. Do retros on weekly initiatives — were predictions of impact and complexity accurate?
6. Move fast, learn, do something different next time.

If you're growing fast, great. If not, talk to many users fast. Churn through bad ideas fast so you can find good ones. Don't waste time on indecision.

### Things That Should Be on Your Task List

- Talking to users
- Building and iterating based on user feedback
- Responding to support emails (direct path to revenue)

### Things That Should NOT Be (Fake Progress)

- Passive fundraising conversations / coffees when you aren't actively raising
- Conference attendances (with a few industry exceptions)
- Arbitrary technical milestones — optimizing benchmarks, launching an Android app users aren't asking for

These feel good, boost ego, are LinkedIn-braggable. They don't get you closer to product-market fit.

---

## Five Mental Traps

### 1. Low-Leverage Tasks

People love them because they provide a sense of accomplishment. When the future is uncertain, checking tasks off a list feels good. Examples: paperwork optimization, investor / advisor meetings when not raising, building cool hard features without demand.

### 2. Fooling Yourself That Something Is Working When It's Not

Diagnose problems early and often. **Slow growth is deceptive — it's easy to mistake for product-market fit.** Divya: having worked at slow-steady-growth companies and clear PMF companies like DoorDash, the two feel fundamentally different. If it doesn't feel obviously like PMF, it probably isn't.

### 3. Perfectionism / Indecision Blocking Progress

When nothing's working, every decision feels make-or-break. Most decisions don't matter. For the ones that do, it's okay to decide wrong first and fix later.

The best case (right decision quickly every time) is impossible. Second-best: pretty good decisions quickly; if wrong, fail / learn / switch fast. **If it's a tough call, you probably can't go wrong. Pick one. Keep moving.**

### 4. Too Much Time on Downside Protection vs. Chasing Upside

Downside protection is satisfying — fixing little problems is easy. But it's rarely where innovation happens.

Example: ops teams obsessing about getting out of spreadsheets. Spreadsheets are fine until they're not. If they're working, stick. Spend time on what users need to use the product daily instead of weekly. That's the upside chase.

### 5. Chipping Away at Small Problems When There's a Big Existential One Looming

"My 150 users are asking for one-click ordering — let me build it." But you've had 150 users for 3 months, they're churning, no new signups. **That's the biggest problem. Solve that.**

---

## Choosing the Right KPIs

### Primary KPI

For most startups: **growth — ideally revenue growth.** Indicates you've built something people want and are on track to a big business.

Exceptions: marketplaces might use signups or GMV. Early enterprise with long sales cycles might use letters of intent. Hardware / biotech might use technical milestones. **Audit these frequently — make sure they're real progress indicators, not vanity in disguise.**

### Secondary KPIs

What you track to make sure you're not cheating on the primary, or to give early signal when the primary is lagging:

- Retention and churn (directly contribute to revenue growth)
- Unit economics (making money on each user)
- Customer acquisition cost (focus on payback period early)

Keep it small and relevant. **3-5 secondary KPIs is reasonable.**

### Vanity Metrics to Avoid

Things that feel good but aren't on the path to revenue:
- Social media followers
- Press mentions
- App store reviews
- Total registered users (without engagement context)

---

## DoorDash vs. Rickshaw — Don't Optimize Two Hard Things at Once

Divya's own startup, **Rickshaw** (delivery platform), had similar early traction to **DoorDash** at demo day — both laser-focused on order volume.

Post-demo-day, paths diverged. Rickshaw struggled fundraising despite comparable traction. Out of fear, they shifted from focusing on top-line growth (DoorDash's path) to optimizing **both growth and unit economics simultaneously.**

Result: split focus put them in a no-man's-land of slow growth, which kills startups.

> Choose your primary KPI and don't try to get smart and optimize for two or more hard things at once.

---

## Setting Targets — How Much Growth?

Per Paul Graham's classic essay: for a YC company, **5-7% week-over-week is good. 10% WoW is exceptional.**

Small differences compound. Early growth is better than late growth.

### Factors That Affect Growth Rate

- **Latent demand:** can boost early growth (users tolerate inferior product because pain is urgent), but hard to sustain.
- **Long sales cycles:** for enterprise, set goals around process metrics (leads in funnel stages).
- **Organic vs. paid acquisition:** early on, organic is ideal — find first passionate users, have them spread the word. Don't crank paid until product grows organically and you understand payback.
- **Retention and engagement:** acquire AND retain. Don't pour money into acquisition with a churn problem.

Super Daily realized acquisition could be artificially boosted by paid promos, so they switched their tracked metric from signups to "customers who placed 5+ orders" — a leading indicator of revenue-generating customers.

### Top-Down + Bottom-Up Targets (Do Both)

1. **Top-down:** set a future goal (e.g., $5K MRR by end of Startup School). Back into the weekly growth rate needed.
2. **Bottom-up:** what's realistically achievable in the next week? Project from there. Ask "what could we achieve with unlimited funding?" then "what creative ways still get there with limited funding?"

Set the goal between top-down and bottom-up. Re-do periodically. Make sure you're on track to a big business — don't accidentally land in the no-man's-land of underwhelming-but-consistent growth.

---

## Non-Revenue KPIs — Tempting But Often Wrong

### CAC / LTV Ratio

Generally a post-PMF concern. Pre-PMF, just track **payback period.** Ideally zero (customers profitable on day one). LTV is a rabbit hole for early-stage companies — hard to calculate accurately.

### Free Sign-Ups or DAU

Paying customers have very different expectations than free customers. If you'll charge eventually, **don't waste time getting feedback from free users — it's the wrong feedback.** Get paid from day one.

Exception: marketplaces / network-effect products where volume is required for utility (Uber needed enough drivers before riders would pay).

**Cautionary tale: Scribd** (YC S06). Spent first four years growing a free product, afraid of losing millions of users by charging. When they finally charged in mid-2010, they lost over 90% of users — but revenue grew by infinity percent. They finally had a business.

### Other Exceptions

Hardware, biotech, very-long-sales-cycle enterprise may reasonably use letters of intent, contracts, or technical milestones. **Audit frequently — make sure these are actual indicators of progress and growth.**

---

## Divya's Recap

- You'll never get to everything. Use KPIs to prioritize.
- Only work on the biggest blocker to your primary KPI.
- Be honest with yourself. Fail fast.
- Choose the right primary KPI (usually revenue growth post-launch).
- Keep secondary KPIs small (3-5) and relevant.
- Set targets top-down AND bottom-up.
- Don't optimize for two hard things at once.

---

## Combined Discipline Rules

Synthesizing both speakers:

1. **Don't change KPI definitions when numbers look bad.** Tighten definitions or fix bottlenecks — don't redefine for comfort.
2. **Don't hide zeros.** Log them. Honesty produces course corrections.
3. **Don't add metrics to feel busy.** Three-to-five secondary KPIs. The eleventh metric is avoidance.
4. **Talk to customers in addition to looking at metrics.** Brian-from-Airbnb-hosting-users is the discipline.
5. **Ask "why" several times when KPI isn't moving** (Super Daily milk brand, not UX).
6. **Don't optimize for two hard things at once** (DoorDash vs. Rickshaw).
7. **Pre-launch process KPIs are temporary.** Shift to revenue growth quickly after launching.
8. **Pick decisions quickly, fix wrong ones quickly.** Indecision is more expensive than recoverable wrong decisions.
9. **Solve the existential problem first.** Don't chip at small ones while the big one looms.
10. **Centralize metric definitions and stick with them.** Internal consistency over time matters more than cross-company comparability.
