# Stauss Call — 2026-07-08 (firm-direct)

**Call #6.** First call against the live V1 prospect UI, focused entirely on **sourcing** (the current build focus). Stauss screen-shared and walked his full sourcing/signal playbook so Simon can codify it into the origination engine. Richest sourcing-spec material to date.

## Follow-Up Actions

### What WE Need to Do
| # | Action | Owner | Due |
|---|--------|-------|-----|
| 1 | Create Stauss a **new V1 login**, customize data sources to the VFI buy box, ship it | Alek | wk of 2026-07-08 |
| 2 | Send Stauss **3 honed questions** on "other ways you source data / search algorithms you'd use" (WhatsApp or email) | Simon | this week (he answers ~mid next week) |
| 3 | Build **contact hierarchy** into the prospect card: 1 main contact + up to 2 collapsed alternates (name/email/phone/title), verified via LinkedIn/About-Us | Simon/Alek | next build |
| 4 | Build **Salesforce quick-action** (push contacts to SF account) + **LinkedIn links** per contact | Simon/Alek | roadmap |
| 5 | Internal: decide how to **codify the second-order "waterfall" reasoning** (Tesla→supplier, permit→equipment-type, UCC-age→refi-timing, asset-class→term) — this is the actual differentiator, not the raw data | Simon/Alek | before hardening sourcing |

### What THEY Need to Do
| # | Action | Who | Due |
|---|--------|-----|-----|
| 1 | Share the **two competitor sites** (the generalist EF SaaS + the ex-broker-15-yrs AI platform) | Stauss | when he finds them |
| 2 | Answer Simon's honed sourcing-search questions | Stauss | ~2026-07-16 (mid next week) |
| 3 | Use V1 as his "main everything," tear it apart, feed back | Stauss | after #1 (ours) ships |

### What They're Expecting From Us
The customized V1 login. That's the gating deliverable — Stauss is explicit that real feedback only comes once he's using it daily in real scenarios. Ship it before the next call or the loop doesn't start.

### Open Questions Before Next Contact
- Does the sourcing-signal engine actually out-source Apollo/ZoomInfo, or is the only real edge the **codified reasoning** on top of public data? (Still the #1 load-bearing unknown — this call gives a *plausible* answer but not a validated one.)
- 36th Street's response to the $10K + $5K/mo quote — still untracked (from 6/24).
- Still **no money, no signed agreement, no design-partner terms in writing** after 6 calls with a built product. When does a commercial motion start?

## Momentum
**→ Flat (on the sale) / ↑ Advancing (on spec + product-in-hand).** The product is real, Stauss is impressed and engaged, and the sourcing spec is now deep. But zero movement toward money/agreement, and the whole call lived in the commodity-exposed sourcing layer.

## Key Intelligence / What Changed

1. **The real sourcing moat is codified second-order reasoning, not data access — and Stauss said so himself.** UCC/Edgar/permits/hiring are all public. The differentiator is the *waterfall*: Tesla posts a partnership → the private supplier needs financing; a permit for a warehouse → predict racking/HVAC/robots; a 3-5-yr-old UCC → reverse-engineer term + overlay historical prime rate → refi timing; asset class (GPU 24-36mo, cranes 5-15yr) → dictates the refi window. Simon named it exactly: *"the biggest, toughest piece is codifying everything you just told us... connecting the dots."* **This reasoning lives in Stauss's head — portable to him, not VFI-proprietary.** It is the best available version of the sourcing wedge: the *judgment* layer applied to sourcing. This partially answers (does not resolve) the 6/24 "moat inverted" alarm.

2. **Stauss drew the load-bearing distinction: "mining signals" vs. "generating our own signal data."** Two separate products. Mining = scanning public sources (UCC/Edgar/news/permits/hiring/board rosters). Generating = Quintel-initiated automated outreach (board advisors, then CFO/VP-finance) with a short survey to *manufacture* a confirmed intent signal ("flashing red on your dash"). The generating layer is genuinely differentiated (nobody else produces it) but is brokerage-flavored outreach and CoI-adjacent — flag for a conscious decision, don't build reflexively.

3. **Credit scoring splits cleanly public vs. private — and the private side is a siloing landmine.** Public: Moody's/S&P/Fitch, quarterly cadence, trivially available. Private: VFI's internal Moody's-like model gates their warehouse facility at **B3** (below B3 = can't use the major facility). The productizable idea — clients upload their own scores, Quintel rescores on updated financials, surfaces trend signals — **must be per-client siloed** ("every smart client's agreement says you can't share our data or we sue"). This is a real architectural constraint for multi-tenant Quintel, worth designing for now.

4. **"Redefine, not enhance" is Stauss's core buying thesis — and it's moat-friendly.** Repeatedly: don't be "a glorified SaaS product that just enhances what's already been done with an AI overlay." He wants to "flip it on its head." This aligns with Simon's "AI-in-Google-Docs vs. Google-Docs-in-AI" framing (landed well). Strategically useful: Stauss is *pulling toward* the differentiated/judgment layer as the identity and treating the commodity scan as table-stakes "easy lift" — which cuts against the 6/24 worry that the commodity layer was becoming the product. Use his own language back to him.

5. **New roadmap nuggets, correctly sequenced by Stauss as later:** CFO-following/job-change monitoring (LinkedIn), procurement-team monitoring, employee-headcount/hiring growth signals, real-time **rep call-coaching** (Quintel feeds next-question prompts to keep clients on the phone — "V10-V15"), note-quality scanning, and event-provider data partnerships (ELFA / AACFB / debanked) as **Quintel Global/HQ** intel vs. the client-specific agent. Good sign he's not demanding all of it in V1.

6. **Crypto did NOT resurface (2nd straight call).** Effectively dead in practice — confirm the 6/24 read holds.

## Simon's Performance

### Coaching Priorities (1-3)
- **Received ~15 feature ideas without closing on the 1-2 that go in V1.** Simon: *"right now I'm just exploring the space, uncovering the universe of possibility."* Honest, but at call #6 with a shipped product the risk is an infinite backlog Stauss keeps expanding. → **Better language:** *"Of everything today, two things go into your V1 login this week — the top-3 contact card and the UCC refi-timing signal. Everything else is roadmap, and I'll send you that list so we're agreed on sequence."* → Why it matters: converts a rich brainstorm into a shipped increment and re-asserts Tokenrip as the principal deciding scope, not the order-taker.
- **Never nailed the moat question, even though Stauss answered it organically.** The whole call was the commodity-exposed sourcing layer. Simon got the "codify the waterfall" insight but didn't pin it as *the* thing that makes this un-cloneable. → **Better language:** *"If a competitor pointed the same UCC and Edgar data at this, what makes ours win? It sounds like the answer is the reasoning you just walked me through — so that's the part we're really building."* → Why it matters: makes the differentiator explicit and testable instead of assumed.
- **Six calls, built product, real prospects — and still no commercial motion initiated.** Not every call needs a close, but the pattern is now conspicuous. → **Better language:** *"As we customize this V1 for VFI, let's put a simple design-partner arrangement in writing so we're both committed."* → Why it matters: the cheapest moment to paper terms is while he's asking you to build for him.

### What Worked (2-3)
- **Screen-share drove concrete spec.** The live CFO-contact box triggered Stauss's single most actionable piece of feedback (top-3 contacts, 1 main + 2 collapsed). Showing beat telling.
- **"Mining signals vs. generating signal data"** — crisp real-time synthesis of Stauss's sprawling board-advisor idea; Stauss affirmed *"that is a good distinction."* Reframing his input back to him as clean architecture is exactly the principal move.
- **"Google Docs in AI vs. AI in Google Docs"** landed and fused with Stauss's "redefine not enhance" — strong positioning rapport, and it's a reusable line for the whole EF motion.
