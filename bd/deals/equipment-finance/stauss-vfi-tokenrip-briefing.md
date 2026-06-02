---
title: Stauss Paulos / VFI / Equipment-Finance — Living Briefing
status: active
owner: Simon
type: deal-context-briefing
created: 2026-05-30
last_updated: 2026-06-01b
related:
  - bd/calls/transcripts/stauss-paulos-2026-05-28.md
  - bd/calls/contacts/ted-craver.md
  - bd/calls/notes/ted-craver-2026-06-01.md
  - bd/calls/transcripts/ted-craver-2026-06-01.md
  - bd/deals/equipment-finance/equipment-finance-domain-primer-2026-05-30.md
  - pitch/a16z-angles-and-explorations.md
  - product/tokenrip/mounted-agent-model.md
  - product/tokenrip/mounted-agent-synthesis.md
---

# Stauss Paulos / VFI / Equipment-Finance — Living Briefing

> **Purpose:** Single self-contained context doc for the Stauss/VFI/equipment-finance opportunity. Read this first to start any new session on the topic — it assumes no prior conversation memory. Update it as the situation moves; it is a living document, not a snapshot.

> **One-line state (2026-06-01):** The opportunity has widened from one relationship into a **Stauss-channeled equipment-finance cluster** — his first live external introductions landed: **Bevel** (Ted Craver — arm's-length placement firm, champion-led, gated on a managing-director green light ~6/2) and **DCF / Direct Credit Funding** (Jason Ames — balance-sheet direct lender, discovery 6/1). **Bevel is a *cleaner first customer than VFI*** — no employment conflict-of-interest (§7.4 dissolves for that node) — and exercises the *same* underwriting+matching architecture. The §4 "he is a CHANNEL, not just a customer" bet is now proving out. Load-bearing open questions are unchanged (real data/sourcing edge; how Stauss's VFI employment is handled; does the wedge carry toward the moat) **plus a new one: Stauss's economics in the intros** (finder's fee / channel cut?) — which decides whether these are Tokenrip customers or Stauss-channel deals we service (§7.5).

> **Update 2026-06-01b (3rd direct call — debrief):** A channel-partner debrief surfaced three things and **a scope drift to watch.** (1) **Name objection** — Stauss, carrying the pitch to investment bankers, says "TokenRip" reads *crypto, not institutional* ("perception is reality"); working resolution = parent-infra + "powered by TokenRip / [named vertical entity]." (2) **Core pitch validated organically** — Stauss can't share his own Claude-built dashboard ("they can't open the file"), the exact artifact-sharing pain Tokenrip solves. (3) **New product idea** — a self-serve "market intelligence dashboard" ($50–100/mo, individual-rep-paid "B2P," embedded upsell to the agent); he volunteered as the mock-ICP and will send criteria + the HTML file. **⚠️ The drift:** the locked small-ticket wedge is migrating toward "build me a dashboard," the moat-bearing §9 spec went unmentioned (downgraded to "send me my dashboard criteria"), and a *self-serve SaaS* is a different motion than the locked FDE custom build — the model Stauss himself dislikes. **Reconcile the dashboard against §3/§8 before building: is it the self-serve front-end of the same sourcing+pre-qual engine (good — large reuse), or a third product / motion (scope sprawl)?** He also ran **partner due-diligence** on the founders (a backing signal). Nodes: [[bd/calls/transcripts/stauss-paulos-2026-06-01]] · [[bd/calls/notes/stauss-paulos-2026-06-01]].

---

## 1. Who Stauss Is

- **Role:** EVP at **VFI**, a ~40-year-old privately-held **equipment-finance lessor**, ~200 staff, **80–85 sales reps**. Institutional capital; thoroughly-underwritten middle/large-ticket equipment leases and loans (no FICO, no rate sheets — PFS/balance-sheet underwriting, personal guarantees).
- **Background:** Broke into finance at a Salt Lake auto dealer's in-house lender (**JCO Financial**) — first employee, jack-of-all-trades (underwriting, collections, origination), grew the book ~$250–300K → ~$5M over 6 years in near-prime/subprime auto (8–9% to high teens). Then **Lending Club** (~2 yrs, managing the auto-refi product — big-fintech/corporate experience). Then VFI.
- **Operating profile:** Aspiring entrepreneur. Already runs **7–9 local HTML Claude files** as a self-built "band-aid" to do his job — bottom-up AI adopter. Strong LinkedIn presence and a deep **broker / lender / capital-advisor rolodex**. Prior venture: **Deal Flow Exchange** (an equipment-finance marketplace; SaaS model; scaled LinkedIn to 3–4K, several hundred members) — exited ~1yr+ ago. He has real startup operating scars and **dislikes the pure-SaaS model** because of it.
- **Talking style:** Talks ~90% of every call. Drives the agenda, the roadmap, the pricing, the sequencing. Texture-rich domain speech (specific names, numbers, exceptions).

## 2. Timeline / What Has Happened

- **Call 1 — 2026-05-28.** Discovery. His "ultimate ask" was **deal sourcing with timing**; also surfaced IC-memo/underwriting pain and redline/document-compression pain. Floated a crypto/equipment-stablecoin situational-capital play (out of scope — crypto lives in the separate RebelFi vault). Sent **7 confidential deal memos** (PII-laden; e.g., Bevel-sourced HNW tax-play deals) afterward.
- **Between calls.** Simon/Alek sent a follow-up email with 3 starting-point use cases (sourcing / committee-ready underwriting / redlines), acknowledged the memos, ran it through the humanizer. Alek built a **staged credit-memo mockup** (https://yourelosingmoney.xyz/engine/ — "underwrite this deal" → full IC memo: amortization, DSCR, residual table, risk flags, decision).
- **Call 2 — 2026-05-29.** Stauss crossed from advisor → **operating partner**: he is now writing the product spec himself, opening his channel, running price discovery, and proposed a **success-fee agreement to launch "next week."** Locked the initial wedge to **small-ticket equipment-finance origination**. Validated the underwriting mockup ("exactly what I'm thinking"). Alek's Claude produced a deep call-2 analysis + build plan: **https://tokenrip.com/s/d02059ba-001b-4337-a07c-66795eda2b94**.
- **Next gate:** Stauss delivers a **small-ticket workflow one-pager** (ICP + credit criteria + lender criteria + workflow) ~Sun 5/31 night → Mon 6/1. **Judge it against the yardstick in §9.**
- **2026-06-01 — Channel proving out. Stauss made his first live external introductions** (he stops being only the *deal* and starts being the *channel* — see §4):
  - **Bevel — Ted Craver.** [[bd/calls/contacts/ted-craver]] · [[bd/calls/notes/ted-craver-2026-06-01]] · [[bd/calls/transcripts/ted-craver-2026-06-01]]. Ted runs revenue/sales at **Bevel**, an *arm's-length* commercial-finance **placement firm** ($450M placed last year across ~75 lenders, matched manually off a literally-1990s unjoinable database). Painkiller pain, *self-built band-aid tooling* (15 JSON files into Claude, ~8 Apps Script files, a Sheets CRM), validated Alek's underwrite→match→draft mockup hard ("exactly what we've been looking for… yes, yes, yes, and yes"). Champion-led; **gated on his managing-director green light (~6/2)** → NDA → follow-up call this week. **Strategic significance:** Bevel is a *cleaner first customer than VFI* — the §7.4 conflict-of-interest knot **dissolves for this node** (third party, no Stauss employment) — and its two pain pillars (underwriting memo + lender matching) are the *same architecture* as this build. **Resolution: build on Bevel (clean), keep Stauss as the channel.**
  - **DCF / Direct Credit Funding — call held 6/1; ⚠️ premise contradicted.** [[bd/calls/contacts/devan-phillips]] · [[bd/calls/notes/devan-phillips-2026-06-01]] · [[bd/calls/transcripts/devan-phillips-2026-06-01]]. **Jason Ames (owner / economic buyer) no-showed** (sent an AI notetaker); **Devan Phillips** — ex-VFI, now BD/vendor-relations — carried it, and **Stauss drove ~80%**. The prep's load-bearing premise was *"DCF is a balance-sheet direct lender → lead with underwriting throughput → they hold outcomes → deal-graph moat."* Asked point-blank, Devan said the firm is **"a larger broker"** with FICO-based small-business mechanics. **If true, the deal-graph/outcomes moat argument for this node collapses** (brokers don't hold funded/declined performance data); the qualifier wedge survives only as the *commodity* layer. **Unresolved: is this the wrong company, or does the firm lend *and* broker (Devan on the broker arm)?** Reconcile before building. Real but modest, Stauss-shaped pain (qualifier + bank-statement deposit analysis); next step is a Devan email → demo-to-Jason this week.
- **Call 3 (Stauss debrief) — 2026-06-01.** [[bd/calls/transcripts/stauss-paulos-2026-06-01]] · [[bd/calls/notes/stauss-paulos-2026-06-01]]. Held right after the two intros. Stauss asked for selling feedback (Alek: Ted call "textbook"), ran **partner due-diligence** on the founders, raised the **name objection** (above), and pitched a **self-serve market-intelligence dashboard** as a low-lift wedge with an embedded upsell to the agent — volunteering as the mock-ICP. **Pitch-validation moment** (file-sharing). **No buying-pipeline stage moved**; value is positioning + product intel. **Drift flagged** (one-line state §1): wedge → "dashboard," §9 spec lapsed, self-serve-SaaS-vs-FDE-motion tension. **Next gate:** receive his dashboard criteria + HTML file (~6/2) → decide whether the dashboard is the self-serve front-end of the §3 engine or a new product, *before* building (§11).

## 3. Current Direction / What We're Building

- **Locked wedge (as of call 2):** Small-ticket equipment-finance **origination / deal-sourcing bot**. Continental US only. **$100K–$2M** deals. Sold turnkey to brokers and small-ticket lenders.
- **Motion:** Forward-deployed-engineer (Palantir/AWS pattern, Tokenrip's locked GTM). Build it, turn it on, **bring live pre-qualified deals before the customer pays.** Stauss independently invented this same motion on the call ("why not build it now, pre-research the target, come to the table with it already working").
- **Two-product frame** (from Alek's plan — keep both alive):
  - **Product A — small-ticket origination.** Fast, mostly templated, **lower defensibility**, volume play, many small logos. The wedge.
  - **Product B — institutional full stack.** VFI-style. Sourcing + underwriting + cost-of-capital + credit memory + securitization + documentation + renewals. Slow, custom, **high moat, high ACV**, few large logos.
  - **Rule:** ship A as the **on-ramp to B**. (Critical — see §6 moat: only B stays in the loop long enough to build the moat.)
- **Architecture — 3 layers + a loop:**
  1. **Signal engine** (sourcing) — the long pole / biggest unknown (see §5).
  2. **Underwriting / pre-qualification** (the rubric = the mounted-agent imprint = the moat material).
  3. **Workflow / closing** (redlines, doc compression, compliance cadence, end-of-term options).
  4. **Closed loop:** outcomes (funded/unfunded, rate, term, performance) feed back and train the system. This is what builds the deal-graph (§6).
- **Recommended near-term build:** sourcing **+ a thin underwriting slice in parallel** (§8). Not sourcing alone.

## 4. The Opportunity (Why This Is Big)

- **He self-selected into the vertical-insider-partner role** — faster and bigger than the original "champion a VFI deal, then maybe a role" ladder assumed. By call 2 he behaves like a head-of-GTM / operating co-founder.
- **He is a CHANNEL, not just a customer.** Equipment finance is highly fragmented; he has the rolodex, credibility, and a native sales motion the technical founders lack. Named nodes: small-ticket lenders; brokers (**Bevel** — HNW bonus-depreciation tax-play deals, 7–10/week; **Ned / National Equipment Dealers** — $200–250M/yr volume); marketplaces (**Cloud Store** — "Amazon of equipment"); capital advisors; a Utah real-estate-finance shop.
- **The real prize:** equipment finance as Tokenrip's **first dense substrate cluster / lighthouse vertical**, with Stauss as the distribution co-founder seeding 5–10 connected agents across the fragmented industry, each compounding on shared substrate. The small-ticket bot is the wedge; the **vertical operating system for equipment finance** is the size of the thing.
- **"2nd Glo" / bottom-up-adoption validation:** VFI deliberately has **no top-down AI mandate** — reps do whatever it takes individually. That's exactly the bottom-up adoption the a16z pitch describes (and broader than the deck claims — a senior EVP in traditional finance, not just junior knowledge workers). Caveats: it's **Stauss-the-aspiring-founder, not VFI-the-institution** adopting; don't generalize to "VFI as a buyer." Also reframes VFI as **Step-3 enterprise-trigger evidence** — an EVP running confidential PII through personal local Claude files across an ungoverned 200-person finance firm is a live data-sovereignty/token-control time bomb (Vijay/Travelers-shaped).

## 5. The Biggest Unknown — The Signal Engine ("Can we beat Apollo on sourcing?")

- **The weak beam in Alek's plan:** it answers "how do we beat Apollo" with **"build on our own harvest stack."** That is not an answer — Apollo/ZoomInfo/D&B **are** harvest stacks at a scale/freshness/coverage you will not match on contact/firmographic data. "We have scrapers too" loses that fight. The plan quietly swaps "we have a data edge" for "we have harvest infra"; they are not the same, and the whole Phase-1 hero rests on the swap.
- **Where the edge actually is** (and isn't):
  - **Raw data coverage → lose.** Don't build the thesis here.
  - **Stauss's "secret data sources" → probably a mirage.** He is a dealmaker, not a data vendor; his tools are the same Apollo/ZoomInfo/D&B he complained about. Do not bet the differentiation on him having a proprietary data well.
  - **The rubric (his scoring function / judgment) → win.** Apollo is horizontal and structurally won't go vertical-EF. This is the imprint. Real, proprietary, durable.
  - **The closed loop → the actual long-term moat** (see §6). Kicks in only once deals flow.
- **Simon's framing & lean:** ideal = Stauss has weird EF-specific sources; scenario 1 = "only as good as Apollo" (worst case, worth something only as an integrated part of the stack); scenario 2 = Stauss gives a real EF edge. Leaning toward a middle ground (rubric + tech know-how + data-source understanding), and wants a backup gameplan.
- **Worst-case reframe (important):** "as good as Apollo" indicts the **wrong layer** (contacts). The EF deal-graph compounds even at contact-parity. The real worst case is **"Apollo-parity on contacts, sitting on a compounding EF deal-graph nobody else has"** — which is not a bad place to be.
- **Backup gameplan:** if the signal engine = parity, **pivot the hero**, not the vertical. Make the **rubric + closed loop** the lead value-prop; reposition sourcing as "integrated + pre-qualified" (true and valuable at data-parity). Backup plan = sequencing fix = **thin underwriting slice in parallel** (§8) — all one move.
- **The cheap test (do before building):** ask Stauss one question — *"In EF, does anyone already prospect off lien filings / lease-maturity / equipment-registration data, or is it underused? What sources do the best sourcers use that the generic tools don't?"* His answer settles the data-edge question for free. **Watch which way he answers** — a suspiciously easy "nobody does this" should raise your guard (usually the real reason a source is unused is that it's a nightmare to clean), not your hopes.

## 6. The Moat — The EF Deal-Graph

- **Two different "data" things, only one of which is Apollo's:**
  - **Apollo = the "who exists" layer** (identity/attributes: companies, contacts, revenue estimates). Horizontal, scraped, static, commodity. Parity at best.
  - **The EF deal-graph = the "what happened" layer** (events/decisions/structures/outcomes tied to specific deals, lenders, borrowers, equipment, time). E.g. *needed $2M for 3 cranes Q3 → priced 9.5%/48mo → approved 10.25% → funded $1.5M now/$500K Q1 → current at 11mo → 2021 Cat 336, lien matures 2029.*
- **Why the deal-graph is the moat:** Apollo's data answers "who do I call"; the deal-graph answers **"which call turns into money, at what price, and when"** — worth ~100× more, and only the deal-graph can answer it because it requires **outcomes**. It yields: (1) **calibrated funding/pricing scoring** trained on real EF outcomes; (2) **timing precision** (the EF clock by asset class); (3) a **competitive map** (who finances whom at what price); (4) **cross-imprint density** (every agent reads and feeds the same substrate).
- **Where it comes from + the catch:** It **does not exist yet and is worth zero on day one.** It only accretes if deals flow **through your system and you capture outcomes.** A latent moat, not a starting one. **A sourcing-only tool never sees a funding, so it never builds the graph → stays a worse Apollo forever.** This is why "ship A as on-ramp to B" matters beyond ACV: **only the full stack is in the loop long enough to capture the outcomes that build the moat. The moat is downstream of staying in the deal.**
- **Honest caveat:** data moats get overclaimed. This compounds *if* outcomes are captured systematically, *if* there's enough volume **per asset-class segment** (cranes ≠ trucks ≠ medical ≠ IT — need depth within segments), and *if* patterns stay stable. It's a compounding head start built on time + focus + Stauss's distribution — not an impassable wall. Pitch it as "compounds," not "insurmountable."

## 7. Concerns / Risks / Things to Watch

1. **Wedge mismatch (recurring).** Small-ticket is the most commoditized, most-automated, **least-defensible** corner — and the part Stauss himself calls "mathematical" (ratios, matrices, LendingTree-style). It's exactly where the imprint/judgment moat matters **least**. His actual edge (deep credit judgment, relationships) lives in **middle/large ticket**, which got pushed to "version 2." Fast money ≠ category proof. **Watch:** that the wedge carries toward the vertical-OS prize, not just toward being his back-office.
2. **The data-edge claim is unexamined** (see §5). Don't build believing the harvest stack is the moat.
3. **Economics trap.** His pricing instincts are **broker comp structures** (milestone fees, royalties-in-perpetuity, success fees). Success-fee/royalty revenue is lumpy, deal-dependent, collected 3–12mo out, and hard to enforce (client must self-report fundings). It's a **worse business than recurring SaaS** dressed as a better one. **Take his pricing creativity as input; favor SaaS + milestone as base, success fee as upside.** Don't let the partner's comp model convert Tokenrip from a software company into a commission-dependent deal shop.
4. **Conflict of interest (serious).** Stauss is a **current VFI employee** proposing to (a) sell a bot to his employer that he profits from (**self-dealing**), (b) use **VFI's proprietary playbook** as the template, and (c) sell the same product to **VFI's competitors**. Four exposure piles: self-dealing, **trade-secret**, **work-for-hire/IP-assignment** (the spec is the contaminated artifact), reputational. Paths:
   - **A — Clean break:** he quits, VFI sold to at arm's length. Cleanest, but a huge ask after two calls. Not now.
   - **B — Generic template + VFI carved out:** stays employed, contributes only portable expertise, VFI not an early customer. Clean-ish while employed; loses the warm first deal; moonlighting may breach his agreement.
   - **C — Disclosed and blessed:** discloses to VFI ownership; they consent (could even anchor/invest). Best upside (blessed anchor customer), high variance (could blow up). Not in your control — it's his conversation. (He said owners "spend money to make money" — promising.)
   - **D — Quiet productization:** the do-nothing default. The lawsuit path. Avoid by acting.
   - **Resolving principle (also resolves "who owns the customer"): BUILD ON WHAT'S HIS, NOT ON WHAT'S VFI'S.** His **judgment/scoring function** and **career-built network** are portable, clean assets. VFI's **credit policy, pricing grids, customer DB, relationships** are encumbered. Systematically take the clean version, decline the encumbered version.
   - **Not legal advice** — needs a lawyer once money/equity moves. Tailwind: **Utah caps non-competes at ~1yr.**
   - **Cheap action before Sunday:** tell him to build the spec **from his own expertise + publicly-known EF practice, keeping VFI confidential materials out**, and to think about how he wants to handle VFI internally if they'll be a paying customer he profits from. (His reaction is itself a signal — a good operator says "obviously"; bristling shows a future problem.)
5. **Who owns the customer.** If he brings the whole network + writes specs + runs relationships and you just build to order, he's a channel that can **disintermediate** — he owns the rolodex, you're the vendor. See the power structure **now** (cheap), before equity. Same fix as §7.4: build on what's his vs encumbered.
6. **Speed / Stauss drives the bus.** He talked ~90% both calls and set roadmap/pricing/sequencing/deliverables; founders mostly assented. Great for momentum; risky if it sweeps the technical founders into building on his spec, his timeline, in his industry, without aligned incentives or an agreement.
7. **Role prematurity.** Enthusiasm ≠ delivery. **Don't decide role/equity until output.** But **separate "role" (can wait) from "IP/employment structure" (cannot wait — the spec is the exposure the moment he hands it over).** The first cheap read on Stauss is the **Sunday spec** (judge per §9), not the bot.
8. **Scope sprawl.** ~15 directions floated. Hold the line — ship **ONE** bot first. Roadmap discipline:
   - **NOW:** small-ticket EF origination, continental US, $100K–$2M.
   - **NEXT:** Bevel bonus-depreciation tax-play instance (HNW, $300K–$1M, known supply/demand, clean proof) + VFI institutional (Product B) in parallel via success-fee pilot.
   - **LATER:** Ned; Cloud Store; credit-submission, documentation, end-of-term, compliance bots; ABL bot (swap equipment for AR/inventory); capital-sourcing bot.
   - **PARK:** off-lease/remarketing (that's equipment brokerage, not agent software); real-estate finance (regulatory nuance); M&A-targeting bot.
9. **Moat dilution.** If small-ticket pricing anchors everything and Product B never ships, Tokenrip becomes a thin sourcing tool competing on price. Keep B alive in parallel.

## 8. The Thin Underwriting Slice (the single highest-leverage near-term move)

- **What it is NOT:** the full IC-memo/committee-replacing engine (that's Product B — months, needs VFI internals).
- **What it IS:** the smallest artifact that encodes Stauss's **go/no-go + rough-pricing judgment** and stamps a credible **pre-qualification** on a sourced deal. Input = sourced company + basic financial signals + the ask. Logic = his rubric (gating criteria, red flags, structure heuristics). Output = **fundable / marginal / pass + indicative (caveated) rate-term band + the reasons** (committee/client talking points). "Pre-priced lead," not a contact list.
- **Why it's the right move (four wins in one):**
  1. **Rescues Phase 1 from commodity** — a list is Apollo; a list where each row says "fundable at ~9.5%/48mo, here's why" is only possible with the rubric and Apollo can't produce it.
  2. **Starts the deal-graph / closed loop** early (§6).
  3. **Encodes the imprint** (his judgment) from week 1 instead of "later."
  4. **It IS the backup plan** — if sourcing data = parity, the slice is already the hero ("every lead comes pre-qualified and pre-priced").
- **Buildable in the 2-week window?** Yes, *if* the spec contains the rubric — and it should, because the rubric is the second half of the same Sunday spec. Adds no new dependency; reuses Alek's existing mockup UI. Keep it **thin and indicative** (go/marginal/pass + band + reasons); if encoding the rubric balloons, that's the tell you've drifted into Product B. Output indicative-caveated pricing, never binding quotes.
- **Bonus:** it targets his actual dopamine. A sourcing-only demo = "we find companies" (he'll compare to Apollo and shrug). Sourcing + pre-qual = "we find companies **and tell you which fund and at what price**" — the exact move he got visibly excited about (the "pre-approved term sheet tomorrow" line).
- **The one real cost:** parallelizing two builds in a tiny team risks doing both half-well. Mitigation: the marginal cost is "encode the rubric into pre-qual logic," not "build a second product" (UI exists). Watch for scope creep into Product B.

## 9. Yardstick — How to Judge Stauss's Spec When It Lands

The spec is the **first real read on whether Stauss is a force-multiplier or a bottleneck** — i.e., whether his (operator-grade) *spoken* texture survives into structured *written* work he produces unprompted. Overarching tell: **count the "except"s and the proper nouns.** Operator specs are full of specifics and exceptions; filler is round numbers with no edges.

**Sourcing half (public-ish, easier to fake):**
1. **Two distinct ICPs kept separate** — borrower ICP (who the bot finds) vs lender/customer ICP (who buys), **plus the matching logic** between them. 🔴 only "find me companies like X."
2. **Borrower targeting with reasoning + edges** — revenue bands tied to deal-size logic; specific industries that finance equipment heavily **and the ones to avoid + why**; good vs bad collateral; "anchor just outside the sweet spot." 🔴 flat filters, no exclusions.
3. **Signals / triggers ("timing")** — EF-specific, non-obvious triggers **with lead-times** (lien/lease maturities, permits, contract awards, auction/fleet age, capex seasonality, contract wins, CFO turnover). 🟢🟢 bonus if he names **the data source per signal** (pre-answers §5's question). 🔴 generic intent ("growing," "posted a job").

**Judgment half (the moat — can't be faked):**
4. **Disqualifiers + red flags + structure heuristics — THE most diagnostic section.** Hard disqualifiers; soft red flags that move pricing/structure; profile → term/rate/structure bands; committee logic. **ChatGPT can write 1–3; it cannot write 4.** If 4 is rich, he's handing you the imprint. **If 4 is thin, that's the most important signal in the doc** — figure out which: (a) can't externalize it (bottleneck risk), (b) protecting VFI IP (the CoI tension surfacing), or (c) protecting his leverage.

**Connective tissue:**
5. **Workflow + human-in-the-loop boundary** (where the bot stops, the rep takes over).
6. **Output definition** (what a qualified lead looks like on the rep's desk — doubles as the deal-graph capture schema).
7. **Unit economics** (FTE-replacement math with real numbers — $70K/BDO, 2–4pt broker fees, deal values).

**Format tells:** a dense one-pager > a padded ten-pager (he said one-pager; 8 pages of enterprise-speak is a *yellow* flag). Exceptional: he flags an edge case, distinguishes generic-vs-VFI-specific himself, or notes where his judgment is uncertain.

**Score in one glance:** (1) Is section 4 rich or thin? → moat + externalization. (2) Do signals name EF-specific triggers + sources? → data-edge plausibility. (3) "except"s + proper nouns? → did his texture survive. Strong 4 & 3 → real partner, buildable moat, build immediately. Thin 4, strong 2–3 → he's giving the easy half; probe 4 before building. All generic → it was charisma, learned for the price of a weekend.

## 10. Pricing (Reference)

- **Barbell** (his model, refined). Small-ticket: **$5–10K upfront + $1–3K/mo + 50–100 bps success** on fundings (undercut the broker 2–4 points via volume efficiency). Institutional: **milestone fees** ($1K term sheet issued / $1K signed / $2K approved / $10K funded) + larger SaaS + success/royalty. Reluctant high-ticket: build free, **royalty in perpetuity**.
- **Stance:** SaaS + milestone as base, success fee as upside (see §7.3). Use VFI as the "here's what we have — what would you pay?" design-partner price-discovery anchor.

## 11. Immediate Actions / Next Gate

- [ ] **Ask Stauss the data-edge question** (§5) — before any signal-engine scoping.
- [ ] **Frame the spec constraint** to him (§7.4): build from his own expertise + public practice, keep VFI confidential materials out; raise handling VFI internally.
- [ ] **Receive + judge the spec** (~Sun 5/31–Mon 6/1) against the §9 yardstick.
- [ ] **Decide the IP/employment handling** before accepting/building from the spec (the spec is the exposure).
- [ ] **Build sourcing + thin underwriting slice in parallel** (§8) against his spec, reusing Alek's mockup.
- [ ] **Run price discovery in parallel** (Stauss → 3–5 small-ticket lenders).
- [ ] **Keep Product B / VFI alive** via demo + success-fee pilot.
- [ ] Do **not** decide his role/equity yet — wait for output; keep options open.

**Added 2026-06-01 — the Bevel/DCF channel intros:**
- [ ] **Await Bevel managing-director green light** (Ted, ~6/2) → receive NDA → view the underwriting output sample.
- [ ] **Clarify Stauss's economics in the Bevel/DCF intros** (finder's fee / channel cut / goodwill?) — decides "who owns the customer" (§7.5) before any commercial terms.
- [ ] **Decide: build Bevel on the same instance as the small-ticket origination bot, or a separate instance?** Both are underwriting + matching — large substrate-reuse upside if they converge.
- [x] **Process the DCF call** (done 6/1 — see node above). **Finding:** Jason no-showed; Devan described the firm as a *broker*, not the direct lender the prep assumed → **reconcile the company identity before treating this as the "leads-with-the-moat" customer.** New open action: ↓
- [ ] **Reconcile DCF identity** (direct lender vs. broker vs. both) and re-decide what this node is worth — the throughput/outcomes thesis only holds if they fund off their own book.
- [ ] **Get Jason (the buyer) on the demo call** this week; build the demo to *his* pain, not Devan's/Stauss's framing.

**Added 2026-06-01b — the Stauss debrief (dashboard + name):**
- [ ] **Receive Stauss's dashboard criteria + HTML file** (~6/2) and his write-up of where he sees value.
- [ ] **Reconcile the "market intelligence dashboard" against §3/§8 *before* building** — is it the self-serve front-end of the small-ticket sourcing+pre-qual engine (large reuse, on-thesis) or a separate self-serve-SaaS product/motion (scope sprawl, and the SaaS model Stauss dislikes)? This is the decision, not the build.
- [ ] **Reclaim the §9 moat-spec** (disqualifiers/credit rubric one-pager — the imprint). It went unmentioned this call, downgraded to "dashboard criteria"; don't let the commodity half replace the moat half.
- [ ] **Arm the channel:** a crisp written "what Tokenrip can / can't credibly claim" one-pager — Stauss is improvising claims ("I'm kind of flying").
- [ ] **Make the vertical-naming decision deliberately** if equipment finance becomes the cluster — "powered by TokenRip / [named entity]" is the working answer to the recurring institutional-name objection.
- [ ] Send Stauss an **email** (open thread he left).

## 12. Key Artifacts & Links

- **Companion — EF Domain Primer** (the *industry*, durable across the vertical): [[equipment-finance-domain-primer-2026-05-30]] (sibling in this folder).
- **Call 1 transcript:** `bd/calls/transcripts/stauss-paulos-2026-05-28.md`
- **Call 2 transcript:** `bd/calls/transcripts/stauss-paulos-2026-05-29.md`
- **Bevel / Ted Craver (channel intro #1):** [[bd/calls/contacts/ted-craver]] · [[bd/calls/notes/ted-craver-2026-06-01]] · [[bd/calls/transcripts/ted-craver-2026-06-01]]
- **DCF / Direct Credit Funding (channel intro #2):** `active/dcf-direct-credit-funding-call-prep-2026-06-01.md` (call 6/1; processing pending)
- **Alek's call-2 analysis + build plan (Tokenrip artifact):** https://tokenrip.com/s/d02059ba-001b-4337-a07c-66795eda2b94
- **Alek's staged underwriting mockup:** https://yourelosingmoney.xyz/engine/
- **a16z bottom-up / Glo thesis:** `pitch/a16z-angles-and-explorations.md`
- **Mounted-agent architecture/positioning:** `product/tokenrip/mounted-agent-model.md`, `product/tokenrip/mounted-agent-synthesis.md`
- **Substrate / surfaces (deal-graph = substrate):** Bean session `agents/bean/sessions/2026-05-25.md` (ui-surface-infra)

---

*Living briefing. Update §2 (timeline), §11 (actions), and §7 (risks) as the situation moves. The load-bearing open questions: (a) is there a real sourcing/data edge, (b) how is Stauss's VFI employment handled, (c) does the small-ticket wedge carry toward the vertical-OS moat or away from it.*
