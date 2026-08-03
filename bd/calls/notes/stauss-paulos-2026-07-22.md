# Stauss Paulos Call — 2026-07-22 (firm-direct / design-partner working session)

*9th direct call. The rebooked full hour (Commitment #80). Second session against the live V1; Stauss screen-shared and drove ~95% of the talking. Alek present.*

> **Transcript caveat:** the source attributed all speech to Stauss; founder lines are reconstructed by content. Stauss quotes are reliable; founder quotes are inferred. See [[bd/calls/transcripts/stauss-paulos-2026-07-22]].

---

## Follow-Up Actions

### What WE Need to Do
| # | Action | Owner | Due |
|---|--------|-------|-----|
| 1 | **Ship the "reviewed" state** — viewed items leave Prospects permanently; Prospects = new signals only. His #1 workflow ask this call | Simon | next build |
| 2 | Ship the pending 7/21 build (score inversion, enrichment credits, buy-box revenue parameterization, Saved-view filters, geography filter, New/Priority/Watch) — **then notify him** | Simon | before next call |
| 3 | **Notify Stauss when updates land** so he re-runs the ropes *before* the next call (his explicit sequencing request) | Simon | on ship |
| 4 | **Force the ranking — 4th straight call unresolved.** ~14 new asks added on top of 18 from 7/21, still zero ranked | Simon | next call |
| 5 | **Ask the three unasked questions from 7/21** — attribution (#77), flag-vs-filter (#78), funded-deal value (#79). None were asked this call; ground truth is decaying | Simon | next call |
| 6 | **Internal: decide the 30-day allocation** — Stauss argues deep market-intel legwork now → 10x in Q4; Simon stated booking meetings is the current priority. Both were asserted, neither resolved | Simon/Alek | this week |
| 7 | Scope the **Salesforce connector** (account-match indicator + filter) — highest-value integration by his account; ZoomInfo second | Simon | roadmap decision |
| 8 | Record a **30–40 second walkthrough video** (he asked for it as the onboarding fix for label ambiguity — cheap, reusable for GTM) | Simon/Alek | next build |
| 9 | **Internal: name the portfolio-analytics consent problem back to him** — "without them knowing" contradicts his own 7/08 siloing warning | Simon | next call |
| 10 | Full compiled bug/feature list filed → [[product/quintel/quintel-stauss-product-notes]] | Simon | ✅ done |

### What THEY Need to Do
| # | Action | Who | Due |
|---|--------|-----|-----|
| 1 | **Pull the data-source list from his Claude chats** ("pull all the data sources you used") and send it over | Stauss | ~2026-07-23 |
| 2 | Send the ASC 842 reference he offered to pull up | Stauss | ~2026-07-23 |
| 3 | Report back on **HK Contractors / Virginia specialty trade / Stronghold** — *not raised by either side this call* | Stauss | next call |
| 4 | Run the ropes on the new build once notified, before the next session | Stauss | early wk of 2026-07-27 |

### What They're Expecting From Us
**Shipped updates plus a heads-up when they land**, then a session where he re-walks the tool. He explicitly structured the next 20–30 days as *our* build window and framed it as the thing that makes Q4 demos win. He is also expecting us to take the market-intelligence direction seriously as roadmap, not as a wish list — he checked our alignment on it twice and got affirmation both times.

### Open Questions Before Next Contact
- **Which two things ship next?** Four consecutive calls of unranked asks. The 7/21 #1 ask (buy-box revenue parameterization) was not mentioned once this call — did his priority move, or did he assume it's in flight?
- **Where did the live deals go?** HK Contractors, Virginia specialty trade, Stronghold — all three vanished from the conversation one call after being the strongest evidence in the relationship. Did any progress? Attribution is still uncaptured.
- **Sourcing engine or market-intelligence platform?** He is steadily converting Quintel from *a scored prospect list* into *an agentic Bloomberg with per-company briefings, tax/policy layers, asset-class indices, and portfolio analytics*. Simon affirmed the framing. What actually ships in the next 30 days under that banner?
- **Is remarketing a product or an anecdote?** He'd "pay 4,100 more a month" for it — but it fires ~2× per 18 months at VFI, is owned by a **workout department he doesn't run**, and his own answer to Simon's frequency probe was hedged. Different buyer, episodic trigger.
- **Untouched for a 9th call:** his working arrangement/comp (#60). The sell-side price (#58) advanced by accident — he named $7–15K/mo — and was not converted.

---

## Call Summary

The full hour Stauss asked for on 7/21, and he used all of it. Roughly the first quarter was concrete UI/workflow feedback on the live V1 (a "reviewed" state so Prospects only ever shows new signals; Salesforce and ZoomInfo connectors; a public/private flag with a direct link to EDGAR filings). The remaining three quarters was Stauss articulating, at length and unprompted, a substantially larger product: real-time company- and asset-class-level market intelligence, tax-treatment and policy/tariff layers, "pre-briefings" that infer the full equipment stack from an award and filter it to what that specific lender can finance, portfolio analytics off connected CRM data, and — as a paid layer he priced himself — equipment remarketing intelligence. Simon offered the "agentic Bloomberg for equipment finance" framing and Stauss adopted it immediately as his own vision. **No commercial conversation, 9th straight call** — though Stauss volunteered a monthly price band ($7–15K/mo layered) that is materially above every prior anchor in the thread. The two live prospects from 7/21 were never mentioned by either side.

---

## Momentum

**→ Flat (high-quality flat)** — the richest strategic and product material since 7/08, and the positioning is genuinely converging; but zero commercial motion for a 9th call, the three highest-value open questions from 7/21 all went unasked, and the specified build list roughly doubled without anything being ranked or closed.

---

## Key Intelligence / What Changed

**1. The product's centre of gravity moved from "scored prospect list" to "market-intelligence platform" — and Simon affirmed it.**
This is the single most consequential thing in the call. Stauss spent the bulk of an hour describing a product where clicking a company returns *everything an equipment lender needs to know about it*: real-time company news, asset-class dynamics, applicable tax treatment (ASC 842, ITC credits), policy/tariff exposure, the inferred equipment stack, and the deal angles that follow. Simon named it — *"an agentic Bloomberg for equipment finance… you have all the real-time market data, except it also works for you"* — and Stauss took ownership on the spot: *"that's real market intelligence… it's funny how organically that's your vision, and as I'm explaining it, that's the direction I'm wanting to go."*

**Two honest readings, both true.** (a) This is a drift *toward* the moat, not away from it — unlike the 6/24 inversion, everything he described is second-order reasoning layered on public data, which is exactly the defensible layer identified on 7/08 and the thing Apollo/ZoomInfo structurally can't produce. (b) It is also a large, unranked scope expansion arriving one call after the product's gap list had finally become small and precise. **The moat and the ship date are now pulling against each other, and that tension went unnamed.**

**2. He defined the design constraint that makes the intelligence layer non-generic: a two-sided relevance filter.**
Not "show me news." *"Granite Construction wouldn't be buying GPU chips, so that information would be irrelevant on that account. Xerox is buying GPU chips but they're not buying autonomous excavators."* And the second axis — filter to what *this lender* finances: *"let's say I'm only a guy that does rolling stock… that would still show a fit, but it would only show what's relevant to me. Just the trucks. But for VFI it would show the trucks, the racking, the operating system."* Company × lender. This is the same parameterization argument he made on 7/14 (equipment lists) and 7/21 (buy-box templating per lender tier) — **third consecutive call making the same architectural request. It should be treated as settled and built as config now, not retrofitted.**

**3. He named a price band — unprompted, and well above every prior anchor.**
*"You'll identify: here's core product, here's layer two, that's an upcharge, layer three, that's an upcharge. And next thing you know you're getting 7, 10, 15K a month from clients."* And separately, on remarketing: *"whatever, 10,500 bucks a month, and you say, for 4,100 more you can add the equipment asset intelligence layer. Okay, yeah, let's go."* Compare: 36th Street's live quote was $10K setup + $5K/mo; on 7/14 he used $3K/mo as his own reference. **This is real movement on Commitment #58 and on Assumption #0 (will a lender pay software prices at all) — a lender-side operator volunteering a five-figure monthly, layered SaaS structure. It arrived and was not picked up.**

**4. Claude Enterprise with connectors is now his benchmark — and a partial substitute.**
He has VFI on a Claude enterprise account with **Salesforce and ZoomInfo connectors live**, and queries it directly: *"find all accounts in my Salesforce database that we've sent a formal proposal on but never won the business… I can just ask Claude now"* instead of asking IT for a report. Two implications: (a) CRM connectors are now *expected*, not differentiating — his ask for a Salesforce indicator is table-stakes framing, not a wish; (b) the ad-hoc query/analytics layer of what we might build is already partly commoditized for him. **What isn't commoditized is the sourcing signal and the codified reasoning — which is where the moat argument keeps landing.**

**5. Remarketing intelligence: real pain, quantified — but a different buyer and an episodic trigger.**
He offered strong texture: 200 recovered Sprinter vans ($50K purchase, $34K manufacturer buyback, 90-day hold), ~200 exotic cars from a failed California dealer, and the cost structure nobody models — *"we had to pay a repo company 2, 3, 4, 500 bucks… each car, all of a sudden I'm in it 1,500 bucks, times 200"*, against traditional broker fees of 5–10% of equipment value and deals already $500K underwater. **But Simon's frequency probe partly disconfirmed it:** two events in 18 months, both automotive, and — decisively — *"my sales team doesn't manage that. We have a workout department."* Most defaults resolve as workouts, not repossession. So: real money, low frequency, **owned by an org Stauss doesn't run**, and his instinct immediately ran to brokerage economics (*"becoming our own equipment broker and taking fees"*). Park it as a named future layer with a price attached; do not let it enter the build.

**6. ⚠️ He proposed collecting client portfolio data for upsell targeting "without them knowing" — and contradicted his own warning.**
*"Without them knowing — I mean, not that it's shady or anything — but let's say it was VFI, you'd see that deal for the Sprinter vans and the luxury cars… you can basically have them give you all that information for a later upsell."* On 7/08 the same person told us private-score data **must be per-client siloed** because *"every smart client's agreement says don't share our data or we sue."* He caught himself mid-sentence, which is the tell. Nothing here is unbuildable — portfolio analytics as a **disclosed, client-visible feature** is a good product — but the "without them knowing" framing is a trust and contract problem for a product whose entire value depends on lenders connecting their CRM and portfolio. **Name it back to him next call; his reaction will tell us how the industry actually treats it.**

**7. New named data sources and a marketplace-scraping thesis.**
Confirmed core: D&B, ZoomInfo, LinkedIn, SEC EDGAR, and **USAspending — which he credits us with introducing him to** (*"I never even knew about that website… that was a really strong one that came of this"* — a small but real credibility deposit). New: **Ritchie Bros** (auction house + equipment financing arm), **The Cloud Store IO** (used-equipment marketplace for certified pre-owned dealers), **NED** (National Equipment Dealers) — as sources for equipment supply, pricing and demand trends. Plus the "level two/three" argument: he found three capex-signal articles **scrolling the Kraken news feed**, i.e. keep unlikely sources open. He committed to pull his full Claude-researched source list.

**8. Asset-class trend indices as a distinct intelligence surface.**
*"Earth-moving equipment specifically is up 10% month over month… steel fabrication is up 25% because everyone's building pods and racking for data centers."* His live thesis: the data-center buildout is propagating into **power generation, water/wastewater treatment, earth-moving, steel fabrication, copper and fiber**, and *"compute is becoming its own sector in and of itself."* Two uses — repositioning an asset class internally to his credit team (the GPU case: now investment-grade rated, B200/B300 at $300–500K domestically vs. ~$1M in China under the export ban, so *"view this collateral like they're cranes"*), and fuelling his own LinkedIn content. **This is the cleanest example yet of intelligence that is worthless to Apollo's buyer and valuable to his.**

**9. He wrote our differentiation script for us.**
Verbatim, unprompted, as the demo close: *"Here's why we don't offer any discounts or free trials… I'm not just showing you HK Contractors, that's a good score, that has a potential deal. I'm building something that's going to continue to learn and work for you… Waste management is understanding that water is becoming a commodity in cooling data centers. Did you know that? No, you didn't. That's because it's two minutes old, or because we're so granular that we're tailoring it specifically for you. Oh, you only finance rolling stock? Notice how the racking didn't pop up — Quintel is custom to you."* **Directly reusable as sales collateral.** Also his competitive read, unchanged from 7/14: the rival EF platform is *"an AI-infused SaaS platform where I'm still reliant on the CFO posting certain things… I'm not really getting any true market research"* — upload-dependent, and *"it's not that much better now that you see what something can really do."*

**10. Sequencing: he explicitly argued build-depth-now over sell-now, and probed our runway.**
*"I don't know exactly where you guys are at from a funding perspective… that legwork in the next 20, 30 days is going to pay off 10x in Q4."* Simon had just stated the opposite priority (*"a lot of our efforts right now are more focused towards booking meetings — getting people using this is the fastest feedback loop"*). Both positions were stated; neither was resolved; the call ended on Stauss's framing. **This is the actual decision on the table and it is being made by default.**

---

## Firm-Direct: Pain Evidence + Stage Signal

**Pain evidence (observed, from real usage):**
- **The toggle loop** — he re-reviews the same prospects daily because there is no viewed/reviewed state: *"I'm essentially just toggling it back and forth once I identify that it's not a fit."* Real friction, on a real workflow, at volume. Cheap to fix, highest workflow value of anything he raised.
- **The neglected-account problem** — accounts sitting in a BDO's 300-account allotment untouched for 3–6 months while a live signal fires. A Salesforce indicator turns Quintel into a *management* tool ("ping John, call this guy"), not just a rep tool. **This is a second, distinct buyer motion inside VFI — sales-management leverage, not seat-level productivity — and it points at a bigger contract than per-seat.**
- **The revenue-data problem, restated a third time** — accounts sit outside VFI's Salesforce because D&B showed $5M when they're now doing $20–40M. He wants three-source triangulation (D&B vs. ZoomInfo vs. Quintel) as the resolution. **Note this materially reframes the 7/21 hard-floor request: his own proposed fix is consensus scoring, not a filter.** Worth reading back to him — it may resolve Assumption #4b without the confrontation.

**Objections:** none — not a selling call. The nearest thing was the funding probe (*"I don't know where you guys are at from a funding perspective"*), which is partner due-diligence, the third instance in the thread.

**Stage signal:** **Design-partner-in-use, pre-commercial — unchanged for a 9th call.** The product is embedded in his daily workflow, the positioning is converging, and he is now doing unpaid product strategy at volume. What is missing is unchanged and now conspicuous: nothing papered, no price agreed, no arrangement defined. The difference this call is that **he handed over a price band himself and it was not picked up** — the gap is no longer even about creating an opening.

**Full bug/feature compilation:** [[product/quintel/quintel-stauss-product-notes]]

---

## Simon's Performance

### Coaching Priorities

**1. The "agentic Bloomberg" framing was offered without a scope boundary — and the roadmap re-authored itself around it.**
Offering the framing was good positioning work and it landed hard. But it was offered as a *destination* with no near-term edge, and Stauss immediately filled the space with a platform-sized specification: news, tax, policy, tariffs, asset-class indices, portfolio analytics, remarketing. One call earlier the gap list was small and precise (buy-box scoring, rollup, filters); it is now large and unordered, and the 7/21 #1 ask went unmentioned entirely.
→ **Better language:** *"That's exactly where this goes — and here's the version of it that exists in three weeks: your saved prospects get a one-screen briefing with the equipment we think they're buying and the one angle you'd open with. Everything else you just described is the same idea with more surfaces. If I ship that briefing and nothing else, does it change what you do Monday?"*
→ Why it matters: the framing is right and worth keeping. Naming the shippable edge of it is what stops a vision from becoming a backlog.

**2. He named a five-figure monthly price, unprompted, and it passed without a single follow-up.**
*"Next thing you know you're getting 7, 10, 15K a month from clients"* and *"10,500 a month… for 4,100 more you can add the equipment asset intelligence layer."* This is the first time in nine calls anyone put a five-figure monthly on the table, it came from the lender side, and it is directly Commitment #58 and Assumption #0 — the two things that have been stalled longest.
→ **Better language:** *"Stop — you just said 7 to 15K a month. Where does VFI actually land in that band on day one, and who signs it? Because if that's the number, I'd rather design the tiers around it now than guess."*
→ Why it matters: he was pricing *our* product, out loud, unprompted, with no defensiveness because he isn't the one being sold to. That is the cheapest price-discovery moment this relationship will ever produce, and it is the third consecutive call where his own economic anchor has been let go by.

**3. Three prepared questions from 7/21 went unasked, and the live deals disappeared.**
Attribution (#77), flag-vs-filter (#78), and funded-deal value (#79) were all logged as the highest-value questions for exactly this call. None were asked. HK Contractors, the Virginia specialty trade contractor, and Stronghold — the first behavioral proof in the entire relationship — were not mentioned by either party. Attribution data decays: in another two weeks he will not remember which signal surfaced which company.
→ **Better language (open with it, before the screen share):** *"Before we get into the tool — two minutes on last week. What happened with the Virginia deal and HK? And do you remember what surfaced them, the award or the UCC?"*
→ Why it matters: the whole moat argument rests on knowing *which* reasoning produces deals. We had ground truth for one week and did not collect it.

**4. Four straight calls of unranked asks — now a structural pattern, not a lapse.**
7/08: ~15 asks. 7/14: ~10. 7/21: ~18. 7/22: ~14 more. Zero ranked across all four. He even flagged the overflow himself — *"we still didn't really make it through some of the stuff I wanted to on the dash"* — meaning there is more queued.
→ **Better language:** *"I'm going to hold you to one thing before we hang up. Of everything today: which single item, shipped by Friday, changes what you do next week? I'll build that and tell you what I'm deliberately not building."*
→ Why it matters: unranked input means we choose, which means we guess, and his behavior is the only validation signal we have. Also — naming what we're *not* building is what converts him from a wish-list generator into a prioritizing partner.

### What Worked

- **Ran a genuine disconfirming test on the shiny new product idea.** Remarketing arrived with a price attached and real enthusiasm, and instead of affirming it Simon asked the frequency question: *"how much inventory at any given point in time does VFI usually have?"* The answer partly falsified it — two events in 18 months, owned by a workout department, not his org. **This is the CLAUDE.md convergence check executed live and unprompted, on an idea that was tempting to accept.** Same skill as the 7/14 capital-utilization falsification; that's now twice, and it's becoming a strength rather than an exception.
- **Gave the relationship a real positioning gift.** "Agentic Bloomberg for equipment finance" gave Stauss language he immediately adopted and started selling with. He is the channel; arming him with a phrase he'll repeat to his rolodex has compounding value. (The scope caveat above is about the boundary, not the framing.)
- **Named the competitive frontier honestly:** *"you need to widen that gap between us and what Apollo or ZoomInfo gives you"* — and Stauss confirmed the premise rather than arguing it (*"they're better using AI to make their stuff better… of course, why wouldn't they"*). Testing the parity assumption in the open with a domain expert is exactly right, and it partially advances Assumption #1.
- **Asked the open data-sources question and got a commitment** — *"let me pull all the data sources that you use and get a list over to you guys."* Low-cost ask, high-value return, and it converts his private Claude research into our roadmap input.
