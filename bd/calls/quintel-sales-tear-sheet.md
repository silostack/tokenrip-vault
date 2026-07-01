---
tokenrip_id: 5eac860e-a71b-4569-a271-6f1aad2e8e7e
---

# Quintel Sourcing — Sales Tear Sheet

> **Live reference for Alek/Simon on lender calls.** The objection bank, the value language that lands, and the framing decisions — so nobody improvises the hard answers cold. Update after every call: add objections, refine answers, log what closed.
>
> **Last updated:** 2026-06-28 (added §1a Hook≠Position≠Price split + spoken-formula rule + negative-signal handling, from `product/quintel/positioning/quintel-positioning-synthesis-2026-06-28.md`. Prior: 2026-06-25 deal-intelligence-engine hero + both-sides shift; seeded from Katharine Rudzitis / Empire 2026-06-18 + Mike Ryan / 36th Street 2026-06-22)

---

## 1. Positioning — lead with the buyer's words

The strongest positioning line came from a buyer, not from us. Use it:

> **"You don't need a new HubSpot. You need the intelligence layer that's been missing."** *(Katharine, verbatim.)*

> **Product spine (homepage + collateral, updated 2026-06-25):** *"The deal intelligence engine for equipment finance. It learns what you fund or who you place to, and reads every deal the way you would."* Lead with the **intelligence/decision** — Bloomberg-style (the engine, not a feature), both-sides by construction (a lender *funds*, a broker *places*). Sourcing is the hook *inside* the demo, not the headline; the product is the three layers on top of the signal, never the raw feed (a feed is a news ticker — the commodity Mike and Katharine both dismiss): **inference** (what others don't assemble), **matching** (ranked to your book), **compounding** (sharper on your book over time — the one input Bloomberg can't claim). The prior spine ("it learns how you lend… another originator on your desk") was retired as lender-only once brokers became near-term — see §5. Full architecture: `product/quintel/positioning/quintel-homepage-positioning-spec-2026-06-24.md` (§10-D).

> **One engine, N boxes (lender ↔ broker):** same engine, both sides. A **lender** points it at **one box (their own)**; a **broker** points it at **many (their lender panel)**. Packaging and the learning loop serve both. Lead lender-first, but it pitches to brokers with no different product — see §2b.

- We are **not** a CRM replacement. HubSpot/Salesforce stays. We layer on top — an operating/intelligence layer.
- We are **not** an out-of-the-box tool like F2. It operates like *another originator on your desk* — "another Katharine" — tuned to your box, your history, your relationships.
- One-line frame: *"Real-time deal intelligence, tuned to your book or your panel, surfacing deals before they're public knowledge."*

---

## 1a. Hook ≠ Position ≠ Price (the split that ends the "signals vs. intelligence" debate)

The word "signals" was doing three jobs at once. Separate them and the tension dissolves — full reasoning in `product/quintel/positioning/quintel-positioning-synthesis-2026-06-28.md`.

| Job | What it is | Right answer |
|---|---|---|
| **Hook** | What opens the call | **Sourcing / "surface deals"** — it's what they lean in on. Keep leading with it. |
| **Position** | What the product *is* | **An engine that runs on their data** — not a signal feed (a feed is a commodity news ticker). |
| **Price basis** | What the invoice is denominated in | **Access / capability tier** — never per-signal. |

**Open with the sourcing hook, deliver an engine that runs on their data, price it for access.** Not in conflict.

**Why "runs on their data" is the whole position — three fuels, fused:** (1) public record (fuzzy, everyone has it — the cheap "signal"), (2) their own book (hard — only they have it), (3) the closed-deal graph (only we have it). The signal is the *cheapest* of the three; we sell the **fusion**, not the fuel. The moment their data is in the engine, the output stops being a feed everyone gets and becomes *theirs* — which is what kills the commodity, "who-else-gets-my-deal," and hit-rate objections in one move. Bidirectional, not just a filter: a customer's hard data point (a known capex event) *retroactively re-weights public signals the engine had discarded as noise* — that's positioning, moat, and the sourcing mechanism in one fact.

**Buildability discipline (sourcing is the hook, NOT the pilot's success metric):** two very different things hide inside "surface deals from public data." **Capability 1** = rank/resurface *their own* flow + enrich the borrowers they know (built on their hard data, improved by market data) — a **dial** (risk = *how much* lift; floor is positive; definitely buildable). **Capability 2** = cold-surface *net-new* borrowers from public data alone — a **switch** (risk = *whether the signal even exists*; outside our control; backtest found ~4 deals in years → real but sparse). **Lead with sourcing, but deliver + measure the pilot on Capability 1; cold sourcing is upside, proven by the backtest, never the thing the pilot must prove.** Full reasoning: `product/quintel/positioning/quintel-positioning-synthesis-2026-06-28.md` §4a.

### The spoken pitch — say the FORMULA, never the word "intelligence"
"Intelligence" is empty until you name the formula (it's exactly what made Alek say "I don't even know what that means"). Say:

- **Opening (hook + position in one breath):** *"We take your last hundred deals — what closed, what didn't, and why — and run the whole public market through that. Instead of a list of 1,000 names, you get the 200 that look like the deals you actually win, and a flag on the ones not worth a dial. It gets sharper every deal you close."*
- **One-liner:** *"An origination engine that runs on your own book. The market, filtered to how you actually fund — not a list everyone else can buy."*
- **Not-a-commodity:** *"A list vendor's job is to give you more names. Ours is to give you the right ones and take the rest away. We bet on your hit rate, not our list size."*
- **The closer (= the moment we stop being a commodity feed):** *"Let's run it on one of your own deals."* On day one, pre-data, we only have public data — i.e. we *are* the commodity feed; the position only becomes true once their data is in it. So the live-drop is both the closer and the unfakeable demo. **Input ≠ demo — they're coupled:**
  - **Default ask = the finished package PDF** (one scrubbable file they already produce) → run **Demo B (Read/Match):** scored read + public-record **enrichment the file didn't have** ("here's what we found on this borrower") + **lender match where their actual funder lands top-3 plus alternatives they didn't try** (net-new, verifiable on a deal they know cold). Light ask, strong for brokers.
  - **Heavier ask = the document set** (the attachments folder, often already bundled) → run **Demo A (Assembly):** extraction-with-provenance → spread → assembled scored package → path-to-fund. Use only when *packaging* is the pain (Scott: "the issue is writing the credit memo"). The magic = provenance on *their* numbers ("$28M EBITDA, pulled from pg 3 of what you sent") — un-pre-bakeable.
  - **Don't ask for the raw blob** (weeks of emails) — too heavy. Sequence: Call 1 = pitch + canned demo on an *anonymized* deal we control → bridge "send one scrubbed closed deal" → Call 2 = run live = the close. Full breakdown: `product/quintel/positioning/quintel-positioning-synthesis-2026-06-28.md` §9.

### Negative signals ("don't call these") — pressure-tested
- **Confident negatives = deterministic only** (wrong asset class, too small, out of geography, already financed per a fresh UCC). *Probabilistic* "low-probability" suppression is **more dangerous than a positive signal** — a false negative kills a real $1–100M deal *silently* (nobody calls a suppressed lead, so we never learn). Only suppress what's defensible on a record.
- **It's the bottom of the ranking, not a standalone product.** We rank their own pipeline; "don't call these" falls out the bottom. Don't sell it as a separate noise-filter (that makes us a feature on someone else's list).
- **It needs more trust to act on than a positive** (getting a 30-yr broker to *not* call 500 names on a new vendor's say-so is a high bar — loss aversion → they call anyway). Treat as a **phase-2 expansion after trust**, not a phase-1 pitch.
- **Best use today = proof we're not a list vendor** (the "take the rest away" line). A commodity feed would never cannibalize its own volume metric.

---

## 2. Value metric — net-new deals, NOT batting average

The single most important reframe. A buyer (Mike) handed it to us after we fumbled the "hit rate" question — own it from the front next time.

**Do NOT** get drawn into quoting a prediction-accuracy number. **Reframe to net-new funded deals you'd otherwise miss.**

> "You don't need a high hit rate — you need the misses cheap and the hits huge. A miss costs one wasted outreach. A hit is a $1–100M funded deal. That's venture math. And the comparison isn't perfect accuracy — it's your current process, where most of the companies you grind through aren't in-market either."

ROI anchor (Mike's own logic): the tool competes against **a sales hire** (~$110k all-in, may wash out in 6 months), not against ZoomInfo. One incremental funded deal pays for years.

---

## 2b. Broker perspective (one engine, N boxes)

Lenders are the primary target, but the same engine pitches to **brokers / placement desks** with no different product — it's just pointed at **many boxes (their lender panel)** instead of one. Grounded in the Bevel/Ted call (placement firm, ~$450M placed last year across ~75 lenders, matched manually off a 1990s unjoinable database; validated the underwrite→match→draft flow hard — "yes, yes, yes, and yes").

**How the pitch shifts for a broker:**
- **Source** — find deals your peers haven't seen yet (same sourcing edge).
- **Package once, submit to many** — assemble each deal one time, then format it for each lender you submit to. (A lender packages for one credit team; a broker packages for many.)
- **Match by revealed appetite** — rank your panel by who actually funds this profile, at what price — so you stop guessing and stop re-submitting to lenders who'll decline.
- **Learn from every lender's answer** — a pass, and the reason for it, sharpens which deals you send that lender next (the broker-side of declines-as-training).

**Value metric — NOT the BDR-replacement frame.** A lender compares Quintel to a $110k BDR hire (§2); a broker doesn't. For brokers the metric is **placements: more of them, faster, with less manual matching, and without burning lender relationships on deals outside their box.** ROI anchor: a broker earns ~2–4 points per placement — one extra placement, or a few hours saved per deal across the book, pays for the tool. Immediate win: kill the manual-matching grind (Bevel's 1990s database). Compounding win: a matching engine that knows your panel's real appetite better every month.

**Broker-specific objections (deltas from the §3 lender bank):**
- *"I already know my lenders — I have the relationships."* → You do, and we don't replace them. Quintel remembers which lenders funded what, at what price, and why the others passed, so you stop re-pitching a no. The matching runs on **your** placement history, not a generic list. Relationships stay yours; the memory of them gets sharper.
- *"Are competing brokers getting the same lender intel / the same deals?"* → Personalization-as-moat, broker flavor: the ranking runs on **your** panel, **your** outcomes, **your** relationships — two brokers never get the same list. The edge isn't owning a lender list (everyone has lenders); it's that nobody knows your panel's real appetite better or reaches your deals faster.
- *"Won't I burn a lender relationship if the tool sends junk?"* → The opposite. It routes deals **to** the lenders that fund them and **away** from the ones that won't, so you protect the relationship instead of spending it.
- **Exclusivity:** same rule as lenders — personalization-as-moat default, exclusivity only as a paid premium tier (§5). Never "one company per buy box."

**Honesty flag:** this section is **anticipatory** — built from the Bevel/Ted call plus the lender calls, not from a closed broker deal. Pressure-test it on the next real placement-firm conversation and log what actually lands.

---

## 3. Objection Bank

> Format: objection → best answer → why it works. Ranked by how badly we currently handle it.

### 🔴 "What's the batting average / success rate of the predictive AI?" *(crux — fumbled on Mike's call, asked 3x)*
**Answer:** Lead with the §2 reframe. "I won't quote a batting average — we're early, and any vendor who quotes one is guessing. The unit that matters is net-new funded deals. Asymmetric payoff: misses are cheap, hits are huge. The pilot measures your real number on your real box in 60 days, and the setup fee is refundable if it's not surfacing deals." **Then show backtested case studies** (see proof asset below) — "here's a deal that closed in March; here's the signal chain that was public in January; here's what your current tools missed."
**Why:** Refusing a fake number reads as honest; the asymmetric-payoff frame is the right way to think about a predictive product; the refundable pilot caps the downside; and the backtest converts the promise into evidence *before* any pilot runs.
**Proof asset:** `active/quintel-signal-backtesting-prd-2026-06-22.md` — the exercise that manufactures these case studies. This is the engineering answer to the hit-rate question. Ship a minimum-viable 1–2 case studies fast; don't wait for the full calibrated set.

### 🟡 "Isn't the backtest just hindsight / survivorship bias? You knew the deal closed." *(NEW — anticipate it; Mike-type buyers will raise it the moment we show backtested case studies)*
**Answer:** "We're not claiming we'd catch every deal — that's the pilot's job to measure forward. What the backtest shows is that the signal chain was publicly available, dated, and assembled *before* the close, and your current stack didn't surface it. The intelligence was there to be caught; the question the pilot answers is the forward hit rate."
**Why:** Backtesting is our strongest proof but it *introduces* this objection. Have the answer ready before showing the case studies — otherwise a sharp buyer turns our best asset into a credibility hole. Don't overclaim past "the intelligence was publicly there and your tools missed it."

**The framing rule that resolves the conundrum:** A backtest case study is a **mechanism demonstration, not a counterfactual claim.** Never say "our engine *would have* surfaced this" (unfalsifiable, gets discounted to zero). Say "these signals were public on these dates; assembled, they point to an equipment need; your tools didn't assemble them — verify against your own alert history." The deal closing just lets us pick a clean example; the proof is "this intelligence was publicly assemblable and your stack doesn't assemble it," which is checkable in the present tense.

**The live-proof has a home — don't give it away pre-sale.** The forward, falsifiable proof a buyer really wants ("give me live deals I can verify") **is the refundable pilot itself.** Sell that, don't pre-give it: "I won't ask you to believe a counterfactual — run the pilot, verify the live deals yourself, refund if they're not real." Handing free live leads pre-sale is the free-POC/hunger-tell anti-pattern AND bets the deal on an uncalibrated engine in front of a skeptic (a live false positive proves the product *doesn't* work, live). Exception: ONE hand-assembled live inference for a HOT, high-effort-worthy prospect (Katharine) at the team call — "a live one, on us." Never a basket, never for a low-likelihood buyer.

**The meta-move for skeptical boards:** You can't prove a predictive engine forward without running it. So stop trying to win the proof argument in the deck. Shrink the deck to (1) mechanism (verifiable backtest) + (2) risk-free trial (refundable pilot). The board doesn't need to believe the backtest — it needs to believe it can't lose money testing. That's a far easier sell, and it's true.

### 🔴 "You're a brand-new company with 3 customers — how do I get my board/principals comfortable?" *(weak on Mike's call)*
**Answer:** "You're not comparing us to an established vendor — you're comparing this to a $110k BDR who might wash out in six months. A refundable pilot is *less* risky than a new hire, and it makes whoever you do hire 5x more effective. And you're not customer #4 — you're a design partner: pricing and product influence that reflect that seat."
**Why:** Reframes the risk comparison away from "established vs. startup" (where we lose) to "tool vs. hire" (where we win). Design-partner framing turns newness into leverage — institutional buyers understand the anchor-customer position.
**Asset gap:** needs board-ready one-pager (capped downside + design-partner terms + exclusivity option). See §6.

### 🟡 "Are you working with my competitors? Are we all chasing the same intel?" *(exclusivity — see §5; current framing under review)*
**Answer (new default):** "Two lenders looking at the same public signal don't get the same list — the system ranks against *your* box, *your* history, *your* relationships. The edge isn't owning the data, it's that nobody reaches your deals faster or more relevant than you. If true category exclusivity in a defined segment matters to you, we offer it as a premium tier."
**Why:** Personalization-as-moat doesn't plant the zero-sum fear that "one per buy box" does, and it doesn't cap our scaling. Exclusivity becomes a paid lever, not a free universal promise.
**⚠️ Liability:** "One company per buy box" has been verbally promised to BOTH Katharine (Empire) and Mike (36th Street). Their boxes overlap (EF, mid-market, industry-agnostic). **We cannot honor both.** Stop making the blanket promise until segments are defined.

### 🟡 "Anything proprietary stopping competitors from copying this?" *(thin on Mike's call)*
**Answer:** "Not secret tech — switching cost and compounding intelligence. The system learns *your* box: every signal scored against what you actually funded. Six months in it knows your deals better than any new entrant could, and leaving means restarting that learning. Plus the integration into your stack. The moat is accumulating, customer-specific intelligence — not the algorithm."
**Why:** A sophisticated buyer doesn't believe in secret-sauce algorithms; switching cost + per-customer learning is credible and true.

### 🟢 "Won't the leads dry up / effectiveness drop off over time?" *(handled well — got a "good point")*
**Answer:** "Two things — companies cycle in and out of your box, and equipment needs are recurring, not one-and-done. New entrants, change-of-control, contract awards, refresh cycles. The pipeline refills." (Bonus: signals compound — the model gets sharper on your box even as raw novelty normalizes.)
**Deeper answer (the moat beat):** every decision you make re-trains it — fund *or* decline. "Pass, collateral's too specialized" sharpens the box as much as a funded deal does. It doesn't decay over time; it tightens. (This is the homepage "How it learns" section.)

### 🟢 "How / where is the intel sourced? Are these real purchases or AI assumptions?" *(handled well)*
**Answer:** "Inferred, deliberately — if it's already announced, it's too late for you. We ingest public filings (UCC, etc.), news, even LinkedIn signals, and extrapolate second-order effects: this data-center announcement means *these* companies will need *this* equipment. High-quality assumptions on a trigger of events." Be honest it's inference, not announced fact — buyers respect the candor.

### 🟢 "What's the setup process / how does it run off our box?" *(handled well)*
**Answer:** "Backwards equation. We start with your fundbox — what you fund, what makes a good deal, what doesn't — ingest your prior data, then work backwards to the sources and signals that surface those deals. Super tailored; it should operate like another originator on your desk."

---

## 4. Pricing & Packaging *(as quoted — confirm with Simon before treating as fixed)*
- **Setup fee:** $10,000, **refundable** if it doesn't work out (covers custom setup + pilot).
- **Monthly:** $5,000/mo, unlimited leads.
- **Annual prepay:** 25% discount.
- **Timeline:** ~1 month setup (sourcing-only can be ~2 weeks; sourcing + underwriting is the longer build).
- **Exclusivity:** see §5 — move to premium tier, stop giving away free.
- **Tiering axis (if/when we tier):** tier on **capability module — Sourcing / Underwriting-Packaging / CRM-Intelligence (matching)** — **never per-signal-count.** Maps to the engine's own source→underwrite→place decomposition and to the GTM sequence (land on whichever module is their pain, expand into the others; underwriting becomes an *expansion module*, not part of the wedge). Per-signal pricing re-commoditizes us (see §1a + §5). Keeps Alek's "illusion of optionality" without the scarcity tax.
- ⚠️ **Open question for Simon:** is $10k + $5k/mo right for a lender doing $600M/yr in volume? May be underpriced for institutional big-ticket buyers. Anchor against the cost of a BDR ($110k), not against SaaS.

---

## 5. Framing Decisions (the "how we talk about it" log)

| Topic | Old framing | New framing | Why changed |
|---|---|---|---|
| Competitive overlap | "One company per buy box" (free, universal) | Personalization-as-moat default; exclusivity as **paid premium tier** | Old version caps scale, plants zero-sum fear, and was double-promised to overlapping boxes (Katharine + Mike) |
| Hit rate | "Too early to say" (dodge) | "Net-new funded deals; asymmetric payoff; pilot measures it" | Dodging read as evasive; buyer reframed it for us |
| Newness | "You get custom attention because we're new" | "Less risky than a $110k hire; design-partner seat" | Old version can't survive a board; new version turns newness into leverage |
| Lead positioning | "Source / find deals" (sourcing *is* the product) | **"The deal intelligence engine for equipment finance"** — sourcing is the hook, the decision-ready read (inference + matching + compounding) is the product | Raw sourcing = commodity (Apollo/ZoomInfo parity, the "news ticker" both buyers dismissed). Sell inference + matching + compounding. |
| What it learns from | (unstated) | Learns from declines as much as funds: "can't fund this, because X" maps the edge of the box | Declines are the richer training signal (they trace the box boundary) and the honest answer to "won't it go stale?" |
| AI-safety framing | "Never funds, never approves, never sends on its own" (repeated) | "Decision support, not autopilot — your call, we do the homework" | The "AI won't act on its own" strawman answers a fear no buyer holds; reframe to positive decision support (ranked reasons, citations, audit trail) |
| Broker vs lender | "Place across funders" reads as a broker tool → brokers demoted to a footnote | **One engine, N boxes**: lender = one box (their own), broker = many (their panel); packaging + learning loop serve both. Lender-first, broker a first-class "who it's for" | Dissolves the workflow-identity tension without a separate product; lets us pitch both sides honestly (spec §5a, tear sheet §2b) |
| Hero / lead axis | Teammate ("another originator") or matching ("how you lend") | **Deal intelligence engine** (Bloomberg-aligned): *"the whole market, focused on the deals you'd actually do"* | Brokers confirmed **near-term** → the hero must not exclude them. "How you lend" excludes brokers; the teammate/leverage axis buries the moat. The intelligence axis is the only one that's both-sides + moat-forward + category-defining (spec §10-D). Out-positions Bloomberg via the input it lacks — *what you've closed*. Make-or-break: name the formula concretely (public record + your book + closed deals → a decision-ready read), never "intelligence" alone. |
| "Signals vs. intelligence" internal debate | One overloaded word; argued as either/or | **Hook ≠ Position ≠ Price** (§1a): sourcing is the hook, engine-on-their-data is the position, access is the price | The word "signals" was doing three jobs. Split them and the Simon/Alek tension dissolves — lead with sourcing AND position as an engine AND price for access, simultaneously. |
| Spoken pitch | "Intelligence layer / engine" said abstractly | **Say the formula, never the word "intelligence"** (§1a spoken lines) | The abstract word landed flat ("I don't even know what that means"). The concrete formula ("what closes for you, run against the market") lands. |
| Tiering axis | Per-signal / signal-count tiers (scarcity) | Tier on **capability module — Sourcing / Underwriting-Packaging / CRM-Intelligence**, never signal count | Per-signal pricing tells the buyer the signal IS the product and it's scarce → re-triggers exclusivity + hit-rate fears. Module axis maps to the engine (source→underwrite→place) + the land-and-expand sequence; keeps the optionality (which-package-not-whether), drops the commodity axis. |

---

## 6. Proof / Asset Gaps (what we keep needing and don't have)
- **Backtested sourcing case studies** — ✅ DONE for Empire (4 published: Capital Aggregates, Revere←Eos, NineDot, Tangent — `tokenrip.com/s/525cbde0...`). Real 5–13 month lead times, hidden Tier-1 signals. **Lead the Empire packet with these, not the underwriting mock** — Katharine cares about sourcing. These also spill over to Mike (all in his box) — see §6c.
- **Board-ready one-pager** for institutional buyers (Mike → BlackRock board): capped downside, design-partner terms, exclusivity option, net-new-deals ROI frame, + a backtested case study in his ticket band. *Recurring blocker — Mike explicitly asked for materials for his board. Only build a 36th-Street-specific backtest after he proves he'll champion upward.*
- **The deck** Mike was promised (2026-06-24).
- **A real expected-deal-count answer** by ticket band (small-ticket = few/mo; $50M+ = ~1 every couple months). Have this ready — it's the second question after hit-rate.

### Bundle hedge — works for Empire, NOT for Mike
The sourcing+underwriting bundle (sell underwriting as the price-justifier while sourcing matures) only works where underwriting is wanted. **Empire:** yes — F2 is degrading, underwriting is a live second vector. **36th Street:** no — Mike is BD-only and said underwriting provides "no value" (BlackRock/IC owns credit). For Mike, sourcing carries the *entire* deal with no hedge, which makes the backtested proof even more load-bearing for him than for Empire.

---

## 6b. Case-study selection — match the proof to the buyer's box width
- **Narrow-box buyer (Empire: $3–50M, specific sectors):** box-match itself is impressive — "this fits your exact criteria" carries weight. Lead with in-box + non-obvious cases.
- **Wide-box buyer (36th Street: $1–100M, industry-agnostic):** box-match proves NOTHING — almost everything is in his box. A merely-in-box case study *confirms* his "we're all chasing the same intel" fear. **Only `hidden` (3rd-order, multi-signal inference) cases land.** Send those or nothing.
- **Reuse, don't rebuild, for low-likelihood deals.** Run the backtest for the live/narrow-box deal (better proof). A wide-box prospect's box is usually a superset — pull the spillover. Don't run a custom backtest for a low-probability buyer.

## 6c. Case ORDER is a function of buyer temperature (learned from the 4 Empire cases)
Not all backtested cases are equally bulletproof. Two kinds:
- **Deterministic / single-trigger (unimpeachable):** one Tier-1 record that IS the buying signal — Capital Aggregates (filed air permit-to-construct), NineDot (138-app Con Ed interconnection queue). A skeptic cannot argue with a government filing; the only claim is "you weren't watching that source." Survives cross-examination.
- **Convergence / judgment (impressive but exposed):** "the engine should heat up on the accumulation" — Tangent (new CEO + distributor + permit), and partly Revere. The hot-call was made *knowing the outcome*, so it invites the false-positive question ("how many lookalikes did nothing?") which a backtest CANNOT answer. Survivorship bias lives here.

**Ordering rule:**
- **Believer / warm buyer (Katharine):** lead with the marquee 3rd-order case (Revere←Eos — the lead lives in the *customer's* SEC filings, "resin named, molder missing"). It dazzles and confirms their instinct.
- **Skeptic / board buyer (Mike):** lead with the deterministic cases (permit, interconnection queue). Earn trust with what can't be disputed; show the marquee last as "the ceiling of the method," never the opener.
- **Honesty discipline (mandatory for institutional boards):** never let the deck read "4 for 4, the engine is magic." Name what the backtest does NOT prove (forward false-positive rate) and bridge to the refundable pilot. A board that catches overclaiming kills the deal; a board that sees you name your own proof's limit trusts the rest. Tighten any "the engine *would have* surfaced this" line — fine for filed-record cases, overclaim for convergence cases.

## 6d. Mike (36th Street) deck — concrete build from the Empire spillover
All 4 Empire cases are in Mike's box ($1–100M, industry-agnostic = superset of Empire's). Zero rebuild. To adapt:
1. **Reorder for skeptic:** Capital Aggregates → NineDot → (Tangent opt.) → Revere as closer.
2. **Revere number:** show the equipment slice, not the $111M headline (over his $100M ceiling).
3. **Industry-agnostic = strength:** "four sectors, one method — the engine reads permits/queues/dockets across all of them, not one vertical." Turns his wide box from liability to selling point.
4. **Pre-empt the false-positive question** (he asked it 3x) and bridge to refund: "a backtest can't claim a false-positive rate — that's what your pilot measures on live deals, at no risk because the setup fee is refundable."
5. Effort = a few hours of repackaging, not a project. Send once, force one dated step, let him self-select.

## 7. ICP Signal (who self-proves vs. who stalls)
From Katharine (closed fast) vs. Mike (interrogated, no commit):

| Self-proves fast ✅ | Stalls / hard pilot ❌ |
|---|---|
| Higher deal flow (smaller ticket) → pilot shows deals in 60 days | Big-ticket ($50M+) → "one deal every couple months," unfalsifiable for a quarter |
| Buyer has budget authority | Buyer must sell up to a skeptical board |
| Already shopping for exactly this | Cold, AI-skeptical principals |

**Prioritization rule:** lead with lenders whose deal flow makes the pilot self-evident inside the refund window. Big-ticket institutional buyers need the board-ready asset (§6) before they're worth heavy Simon-time.

**Brokers / placement desks** usually sit in the self-proves-fast column: high daily deal volume, they own the buying decision, and the manual-matching pain is acute and daily (Bevel matched ~$450M across ~75 lenders off a 1990s database). Placement wins show inside the pilot window. See §2b for the broker pitch.
