---
title: Equipment-Finance Domain Primer (Stauss-sourced)
status: active
owner: Simon
type: vertical-domain-research
created: 2026-05-30
last_updated: 2026-06-02
related:
  - bd/deals/equipment-finance/stauss-vfi-tokenrip-briefing.md
  - bd/calls/transcripts/stauss-paulos-2026-05-28.md
  - bd/calls/transcripts/stauss-paulos-2026-05-29.md
  - product/tokenrip/mounted-agent-model.md
  - product/tokenrip/mounted-agent-synthesis.md
---

# Equipment-Finance Domain Primer (Stauss-sourced)

> **Purpose:** Translate the equipment-finance domain knowledge Stauss Paulos dumped across two calls (2026-05-28, 2026-05-29) into a reusable reference — and convert each cluster into a **build implication** for the agents/products we're constructing. Stauss talked ~90% of both calls in texture-rich operator speech; this doc separates the load-bearing domain facts from color, so two non-experts (Simon, Alek) can see what should shape the product.
>
> **Companion to** [[stauss-vfi-tokenrip-briefing]] (the *deal / relationship / strategy*). This doc is the *industry* — durable across the EF vertical, the "first dense substrate cluster."
>
> **Scope:** full landscape (everything Stauss touched), each item tagged by roadmap position. **Excluded:** the crypto / equipment-stablecoin / situational-capital play — parked, lives in the separate RebelFi vault.

**Tagging legend** (mirrors briefing §8 roadmap): `IN-WEDGE` = small-ticket origination, building now · `NEXT` = Bevel tax-play / NED / institutional (Product B) · `LATER` = docs, compliance, end-of-term, ABL, capital-sourcing · `PARK` = remarketing brokerage, real-estate finance, M&A.

---

## 1. How the industry works — players & ecosystem

Equipment finance is a **highly fragmented** market of capital providers and deal-originators. Stauss: *"several hundred firms like us"* — VFIs, ABLs, SLR Capitals — each moving tens-to-hundreds of millions weekly, none dominant.

| Player | What they do | Roadmap |
|---|---|---|
| **Direct lenders / lessors** (VFI, SLR Capital) | Fund leases & loans off balance sheet / warehouse capital | `IN-WEDGE` (buyers) |
| **Brokers / co-brokers** | Hold client relationships, forward deals; small-ticket referral fee **2–4 points**. Independent brokers (ex-lender, solo, can't afford staff, want to *close* not *prep*) = core buyer persona | `IN-WEDGE` (buyers) |
| **Specialty originators** — Bevel Financial | HNW/UHNW **bonus-depreciation tax plays**; 7–10 deals/wk, $300K–$1M, prime credit; near-spread packages already prepared | `NEXT` — clean proof |
| **Equipment dealers / vendors (captive finance desk)** — NED (National Equipment Dealers) | Originates retail finance on its own equipment sales, **places** leases across a lender panel (captive flow → no sourcing pain). NED: $183M funded / 620 txns (Apr'25–Apr'26), $240–260M projected; FMV dump-truck/loader concentration; 90% multi-unit; prime-only; **consolidating 31 lenders → 5–6 direct**. Operator: Andy Cooper, VP Retail Finance — [[bd/calls/contacts/andy-cooper]]. See §10. | `NEXT` |
| **Marketplaces** — Cloud Store | "Amazon of equipment," certified pre-owned, $50K–$200K, often subprime buyers; 3–4 small-ticket lenders on-site | `LATER` |
| **Equipment brokers (remarketing)** | Buy/sell-side; charge **8–12% of equipment cost** | `PARK` — brokerage, not software |
| **Vendor financing** | Manufacturer-subsidized rates | Competition |

**Ticket tiers** structure the whole industry: **small-ticket** ($10K–$2M, usually equipment *loans*, fast, matrix-underwritten, 24–48hr funding) · **middle-market** (the VFI zone) · **large / project finance** (to ~$500M).

> [!note] → Build implication
> The customer is a **two-sided ecosystem** (capital providers ⟷ deal-originators), not a single persona. Wedge buyers = small-ticket direct lenders + independent brokers. The bot's pitch to a broker: **turn a team-needing operator into an "order-taker"** whose only remaining job is the client relationship. Every named node (Bevel, NED, Cloud Store) is a potential logo — pre-installed distribution via Stauss.

## 2. The deal lifecycle = the product surface map

The deal flows through ordered stages. **Each stage is a candidate mounted agent.**

1. **Origination / prospecting** `IN-WEDGE` — target CFO decision-makers. VFI's model: 150 cold calls/day → ~10–15 connects (~10%). A 6-month no-production termination rule creates a **revolving door** (hire 20, keep 10; a core 8–10 emerge by year 3–5). Entry-level **BDAs** bird-dog leads; **BDOs** ($70K base) qualify and work them.
2. **Qualification** `IN-WEDGE` — capex budget, timing, and the deal they'd *actually* do (term / rate / structure range).
3. **Proposal / term-sheet issuance** `IN-WEDGE (pre-qual)`.
4. **Credit submission** `NEXT` — credit desk → committee (IC); documentation packages.
5. **Underwriting** — see §3.
6. **Documentation** `NEXT/LATER` — master lease + schedules (a *second* schedule under an existing master funds fast); **redlines** (2 weeks–4 months, stalled by vacations/absences, *kill deals*); authorization to fund.
7. **Funding** — wires take 2–3 days with submission windows and $50–150 fees; **per-diem yield starts at the first deposit**; deals fund **along a schedule** ($10M approval → $1.5M now for 3 cranes / $8.5M in Q4); securitization moves money into **buckets**.
8. **Servicing / compliance** `LATER` — quarterly financials required; covenant monitoring; breach warnings/penalties.
9. **End-of-term (leasing)** `LATER` — return / extend / purchase (residual). Term loans hit expiration similarly.
10. **Remarketing / off-lease** `PARK` — resell returned/repo'd gear; repo = pick up (continental US), store, broker out at 8–12%.

> [!note] → Build implication
> This lifecycle **is the agent map**. Ship ONE (origination + thin pre-qual), treat the rest as the roadmap. Critically, the **closed loop** — funded/declined outcomes feeding back — is what turns a sourcing bot from "a worse Apollo" into a compounding **deal-graph** ([[mounted-agent-synthesis]]). A sourcing-only tool never sees a funding, so it never builds the graph.

## 3. Underwriting — two distinct models

The single most important domain split for the product: **small-ticket and institutional underwrite on entirely different inputs.**

- **Small-ticket (the wedge)** `IN-WEDGE` — FICO + rate sheets + ratios (payment-to-income, debt-to-income, credit score) → a **matrix → if-this-then-that auto-approval** (the LendingTree model: app + SSN + bank statements + tax returns, no human, fund in 24–48hr). Stauss calls it *"mathematical."* A bot can be given authority: auto-approve the top half, auto-advance to contract.
- **Institutional (VFI)** `NEXT/LATER — Product B` — **no FICO, no rate sheets.** Underwrites the **PFS** (personal financial statement) + balance sheet + **personal guarantee**, judging collateral/security quality, cash flow (ability to pay), deal type, rate, and yield. Always retains a manual component.

**What an IC needs out the other side:** term, rate, structure, pricing, and **talking points** — for the committee *and* the client (true cost of capital, PV of the payment stream). Alek's staged mockup (deal in → IC memo out: amortization, DSCR, residual table, risk flags, decision) drew Stauss's strongest validation: *"this is pretty much exactly what I'm thinking."*

> [!note] → Build implication
> The underwriting **rubric is the imprint = the moat material** ([[mounted-agent-model]]). Two archetypes to encode: **(a)** small-ticket = a deterministic matrix/ratio engine (fast, low-defensibility, the on-ramp); **(b)** institutional = Stauss's **judgment** — gating criteria, red flags, structure heuristics — the durable, un-fakeable half. The **thin underwriting slice** (briefing §8) encodes *go / marginal / pass + indicative rate-term band + reasons*; its output schema **is** the deal-graph capture schema (§9).

## 4. Economics & pricing mechanics

- **Yield/spread** accrues from the first wire. Lenders carry **buckets / industry limits** set by their funding sources — they can be "maxed out" on a segment (e.g., trucking) and decline an A-rated deal purely on capacity (exceptions are possible for top profiles).
- **Small-ticket economics:** referral partners take **2–4 points**; we can undercut at **50–100 bps** via volume efficiency. Stauss's framing: *"$10M funds a day → a point or two off $10M every day."*
- **Big-deal economics:** ½ point on $100M is large but rare, with a **6–12-month pipeline before any payment**.
- **FTE math (the value narrative):** a BDO costs ~$70K base; **one bot ≈ 5 BDOs ≈ ~$350K** saved. Stauss says VFI would pay "several hundred thousand annually" if it demonstrably replaces hiring.
- **Comp models floated:** SaaS (Stauss *dislikes* it — Deal Flow Exchange scars); **milestone fees** ($1K term sheet / $1K signed / $2K approved / $10K funded); success fees; **royalty-in-perpetuity**; profit-share/1099 (the Utah real-estate shop: 4–5 people fund hundreds of millions→billions/yr).

> [!note] → Build implication
> Pricing is partly a **product** decision. If monetization is success-fee-tied, the product must **track fundings** — which are self-reported, lumpy, and collected 3–12 months out — arguing for a SaaS+milestone base with success as upside (briefing §7.3). Bake the **FTE-replacement narrative** into the pre-qual output ("this replaces N BDOs"). *(Full pricing detail lives in briefing §10 — cross-link, don't duplicate.)*

## 5. Sourcing, data & timing signals

- **Tools today:** ZoomInfo, D&B, Apollo — contacts, firmographics, revenue estimates.
- **The data-quality problem (critical):** D&B showed a company at $17M revenue when it was actually doing $70M. Private-company data is wildly off (stale or never disclosed). The damage: reps **wrongly disqualify** good deals against a revenue floor ("$15M floor, they show $17M, too close to the bottom — pass"). Public companies → ~complete via quarterly filings; private → 80–90% guesswork.
- **The onus problem:** *"it's 100% on me — it's a data company."* These tools surface contacts but do no workflow.
- **Timing is the ultimate ask:** reach the CFO who needs $X capex **and** *when*. Capex cycles vary (annual budget vs one-off); projects move up, get pushed, or die; reps lose touch; competitors call. The result is **"false pipelines"** — $100–150M in term sheets that don't close for lack of updates, wrecking the forecast.
- **Targeting heuristic — "anchor just outside the sweet spot":** the real revenue floor is ~$15–20M, but Stauss would tell the bot to target **$50M** (cap ~$1B; multi-billion is a rare growth play) so it surfaces *truly* qualified deals. He also floated a **borrower micro-survey**: 3–4 clicks ("capex budget for the rest of 2026? financing anything? best contact?").

> [!note] → Build implication
> **Do not bet differentiation on raw contact/firmographic data — that's Apollo's game, parity at best** (briefing §5). Build sourcing to **anchor on *approvability*, not firmographics** ("flag the 100 of 300 accounts that would actually get approved & funded") — this routes *around* the D&B data-quality trap entirely. **The open question to settle with Stauss** (briefing §5 cheap test): are there EF-specific signal sources the generic tools miss — lien filings, lease maturities, equipment registration, auction/fleet age, permits, contract awards, capex seasonality, CFO turnover? That answer decides whether a real data edge exists. **Settled 2026-06-02:** Stauss's own *Keystone* artifact names the sources he actually uses — **EDGAR 8-K Item 1.01** (the filer must name the private counterparty), **USAspending** awards by NAICS, and **UCC-1 lien lookups** (filing date → lease-maturity → refi window). The edge is mining these free public event/timing sources for EF, not contact data — see [[equipment-finance-build-architecture-2026-06-02]] §9. The borrower micro-survey is clean **closed-loop capture** — build it.

## 6. Segments & asset classes

Asset classes are not interchangeable — each carries its own **risk / residual / collateral** profile and financing norms:

- **Cranes** — *"A-rated paper for cranes is a no-brainer."* High-quality collateral.
- **Trucking** — cyclical; an 18-month downturn produced bankruptcies, yet VFI still did $50M. Downturns are an opportunity: learn who weathers the storm, win a better yield and a long-term foothold.
- **Construction / earth-moving** — excavators, skid steers ($50K–$200K), often small-ticket.
- **Medical, IT** — distinct profiles.
- **GPUs / AI data centers** — GPUs are *becoming* bankable, but GPU **components** are still "soft cost" to banks. The supply chain (liquid-cooling fluid makers, racking, servers) is the real target surface.

**Tier-2/tier-3 thesis:** don't finance blue-chips (Amazon/Meta/Google are capital-rich) — target their **suppliers 2–3 tiers down** ramping capex from $5M to $50–100M.

**Soft-cost / project bundling (VFI's differentiator):** VFI can fold soft & intangible assets into an equipment facility — most lenders can't. A "$2M equipment" deal is really a **"$5M project"** (equipment + racking + HVAC + inventory system + components). CFOs often don't know this is financeable, and turnover means re-educating the same company every 2–5 years.

> [!note] → Build implication
> **Asset class must be a first-class product dimension** — the rubric, residual logic, and signal timing all differ by class (the briefing §6 "EF clock by asset class"). The deal-graph compounds **per segment** (cranes ≠ trucks ≠ medical), so **depth-within-segment** beats breadth. Tier-2/3 + soft-cost bundling is a **targeting heuristic** to encode in sourcing: find the supplier ramping capex; finance the whole *project*, not just the equipment line.

## 7. Regulatory / structural boundaries

- **Non-real-estate debt:** no FINRA/SEC; any referral partner, broker, or marketplace can take a fee (it's debt, not equity/investments).
- **Real-estate finance:** state-by-state licensing nuances on where you can take a fee. Stauss calls it the *"last asset class."*
- **Leases vs loans:** small-ticket is usually loans; leasing adds end-of-term mechanics and **ASC 842** lease accounting. **Bonus depreciation** (now available year-round, not just Q4) drives the Bevel tax-play.
- **Geography:** continental US only for the locked wedge — no Hawaii, no Alaska.

> [!note] → Build implication
> Referral/success-fee monetization is **unblocked** in non-RE equipment debt (no licensing barrier); **real estate is a PARK** (state licensing). Encode ASC 842 / bonus-depreciation awareness for the Bevel instance (`NEXT`). The sourcing filter is continental US.

## 8. Glossary — terms Simon & Alek won't know

| Term | Plain meaning | Why it matters for the build |
|---|---|---|
| **PFS** (Personal Financial Statement) | Snapshot of a guarantor's assets, liabilities, net worth | Institutional rubric ingests this *instead of* a FICO score — different input schema |
| **PG** (Personal Guarantee) | Owner personally promises repayment; secured via legal paperwork, not a credit pull | Required artifact in institutional deals; doc agent generates/tracks it |
| **Balloon** | Large final payment at term end (e.g., "10% balloon") | A structure variable the rubric must price; affects residual logic |
| **Master lease + schedule** | Master = umbrella contract; each deal = a "schedule" under it. A 2nd schedule funds fast | Doc agent should recognize existing-master as the fast path; deal-graph links schedules to masters |
| **Securitization** | Pooling leases/loans and financing them as a package to free up capital | Explains "buckets" — why a lender maxes out on a segment |
| **Warehouse capital** | Revolving line a lender draws on to fund deals pre-securitization | Capacity is finite + segmented → drives timing/limits |
| **Buckets / industry limits** | Caps on funding per industry, set by funding sources | A deal can be A-rated and still declined for being over-bucket → model lender *capacity*, not just deal quality |
| **ABL** (Asset-Based Lending) | Lending against AR + inventory instead of equipment | "ABL bot" = copy the equipment bot, swap collateral (`NEXT/LATER`) |
| **Forward flow** | Standing commitment to fund a stream of future deals up to an allocation | NED-style; a product could broker these commitments |
| **Vendor financing** | Financing from the manufacturer/dealer, often subsidized | Competition; why certified-pre-owned marketplaces are less price-competitive |
| **Term sheet / proposal** | Non-binding offer of term/rate/structure before full underwriting | Pre-qual slice produces an indicative (caveated) version — "pre-approved term sheet tomorrow" |
| **Credit submission / desk / committee (IC)** | The internal approval chain ending at the Investment Committee | IC-memo engine (Product B) targets this; pre-qual pre-stages it |
| **DSCR** (Debt Service Coverage Ratio) | Cash flow available to cover debt payments (>1.0 = covers) | Core institutional metric; appears in Alek's mockup |
| **Residual** | Estimated equipment value at lease end | Asset-class-specific; rubric needs residual curves per class |
| **Bonus depreciation / ASC 842** | Tax rules for rapid equipment cost deduction under the lease-accounting standard | Drives the Bevel HNW tax-play instance (`NEXT`) |
| **Soft costs** | Non-hardware project costs (install, software, freight, intangibles) banks won't finance | VFI's differentiator; a targeting/structuring heuristic |
| **BDO / BDA** | Business Development Officer ($70K-base seller) / Associate (entry-level bird-dogger) | The bot replaces the BDA function; FTE math is priced off the BDO |
| **Off-lease / remarketing / repo** | Equipment returned (off-lease) or seized (repo), then resold (remarketing) | A whole stage; `PARK` (equipment brokerage, not software) for now |
| **Bird-dog** | To hunt/flag raw leads for someone else to qualify and close | The bot's origination job = bird-dogging at scale |
| **Cost of capital / yield / spread / per-diem** | Funding cost vs. charge (spread = profit); per-diem = daily interest, starts at first funding | Explains fund-fast urgency (per-diem clock) and the success-fee timing problem |
| **Capital advisor** | Intermediary who arranges financing across multiple sources | A buyer persona; future "capital-sourcing bot" use case |
| **Near-prime / subprime** | Lower credit-quality borrower tiers | Cloud Store's base skews here → affects approvability |
| **Middle-market** | Roughly $15M–$1B revenue companies | The institutional ICP (VFI's zone) |
| **Project finance** | Large structured financing of a whole project (to ~$500M) | The far end of the ticket spectrum (`LATER`) |
| **Recapitalization** | Restructuring a company's debt/equity, sometimes an urgent need | A signal/trigger type ("five with an urgent need for recapitalization") |

## 9. Consolidated build starting-points

The per-section implications, distilled into a tagged punch-list:

1. **Lifecycle = agent map**; ship **origination + thin pre-qual** first. `IN-WEDGE`
2. **Rubric = imprint = moat**; encode *go / marginal / pass* + rate-term band + reasons. `IN-WEDGE`
3. **Deal-graph capture schema from day 1** (the moat data — schema below). `IN-WEDGE`
4. **Anchor sourcing on approvability**, not firmographics (routes around the D&B data problem). `IN-WEDGE`
5. **Asset class as a first-class dimension**; depth-per-segment over breadth. `IN-WEDGE`
6. **Borrower micro-survey** as closed-loop capture. `IN-WEDGE`
7. **Two-sided ICP matching** (borrower × lender, fit-graded, anchored just outside the sweet spot). `IN-WEDGE`
8. **Settle the EF-signal-source question** with Stauss (lien / lease-maturity / registration / auction). `IN-WEDGE — cheap test`
9. **Soft-cost / project bundling + tier-2/3 targeting** heuristic. `NEXT`
10. **Institutional rubric, IC-memo engine, doc/redline, compliance, end-of-term** agents. `NEXT/LATER`

**Deal-graph capture-schema sketch** (fields to log per deal — also serves as the briefing §9 "output definition" / the schema the pre-qual output writes into):

```
deal_size              · ask (amount + purpose)
asset_class + specifics (e.g., "2021 Cat 336, lien matures 2029")
borrower_profile       · lender
priced_rate / term     · approved_rate / term
funded_amount + schedule (e.g., $1.5M now / $8.5M Q4)
decline_reason (if declined)
current_performance / status
```

Every row of this graph is something Apollo structurally cannot produce — it requires **outcomes**, which only flow if we stay in the deal (briefing §6).

---

## 10. The dealer captive-finance desk — a third customer archetype (NED)

*Added 2026-06-02 from the NED (National Equipment Dealers) company doc.* The cluster now spans **three** originator/lender archetypes, and the dealer desk is mechanically distinct from both the direct lender (VFI) and the placement broker (Bevel).

- **What it is:** a dealership's in-house *retail finance* desk (NED: VP Retail Finance **Andy Cooper**, 2-person team). It originates the financing on the dealership's own equipment sales and **places** those leases across a lender panel. **Captive deal flow → no sourcing pain** (the dealer already has the borrower and the asset). The work is *matching/routing + structuring + lifecycle communication*.
- **Lender-panel consolidation** — the headline pain. NED ran **31 lenders** last year, wants **10** this year, **5–6 direct** next year. This is an *outcomes-ranking* problem (which lenders approve smoothly, hold pricing, fund fast, communicate) → a clean **deal-graph use case** applied to *lender* selection, not borrower sourcing. Standard dealer behaviour; the analytics to do it well are not.
- **FMV leasing + residual forecasting** — dealer desks lean on **fair-market-value leases** (NED: majority 24–36mo FMV). The **residual** (estimated end-of-term value) is the core pricing/risk lever and is **asset-class-specific** (sample: Hyundai HL985A loader, 36mo, **60.30% residual**). The dealer sets residuals to (a) hit a target monthly payment, (b) stay fundable with a lender (lenders carry residual floors), (c) compete with manufacturer vendor-financing. *Specialized* — VFI/Bevel receive residuals as inputs; the dealer **authors** them. → agent capability: **residual curves by asset class / vintage / utilization.**
- **Blind discount** — a manufacturer concession to the dealer/lessor, not disclosed to the end customer (sample: **5.48% / $32,000** to Dext Capital). Folds into the effective cost basis behind the lease math and the desk's yield. *Specialized* — a pure lender or broker never sees it. → agent capability: **blind-discount lookup + margin/yield math.**
- **Multi-unit transactions** — NED is **90% multi-unit** (e.g. several dump trucks on one facility). Requires blended residuals across assets, payoff-waterfall logic, and per-asset UCC/lien structure. *The dealer authors this at point of sale; VFI/Bevel receive it pre-packaged.*
- **Monthly program reset + pricing-hold** — NED resets its program monthly and prizes lenders who **hold pricing reliably** through the reset (their stated #3 priority). The desk paces deals against allocations and may hold a customer quote for a window. Tracking, not judgment — but it shapes which lenders earn panel spots.
- **Stated priorities (NED):** (1) Communication / status through the deal lifecycle, (2) consistent credit approvals (prime-only → expect no friction), (3) competitive pricing held reliably.

> [!note] → Build implication
> The dealer desk validates **"sell the hands"** ([[equipment-finance-build-architecture-2026-06-02]] §1): with no sourcing pain, the read dashboard is near-worthless to NED — the value is the *hands* (route / structure / track). Its pain (**lender consolidation / routing**) is the **same matching hand as Bevel**, so NED is a **config of the same spine** plus a **structuring plugin** (residual / blind-discount / multi-unit) — the architecture's extensibility test, not a new product. The dealer's "institutional brain" is *different* from a lender's: not credit judgment but **multi-asset packaging + residual forecasting + lender-fit routing**. NED's wedge = **lender scorecard + routing**; its imprint-holder is **Andy Cooper**, not Stauss.

## How to use this doc

- **Building an EF agent?** Start at §9, then pull the relevant section's facts + the glossary.
- **Judging Stauss's incoming spec** (~Sun 5/31–Mon 6/1)? Read alongside briefing §9 — §3 and §5–6 here tell you what "rich" looks like in the underwriting and signal sections.
- **Validating the extraction?** The §8 glossary + §3 underwriting + §9 schema are the cleanest pieces to send Stauss as a "did we get the domain right?" check (see review note).

*Living doc. Source: transcripts [[stauss-paulos-2026-05-28]], [[stauss-paulos-2026-05-29]]. Sibling: [[stauss-vfi-tokenrip-briefing]].*
