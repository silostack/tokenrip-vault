---
title: Quintel — Sourcing & Signals Engine PRD (Empire / Katharine)
status: active
owner: Simon
type: product-requirements
product: Quintel
created: 2026-06-16
related:
  - active/quintel-katharine-demo-prep-2026-06-16.md
  - bd/calls/contacts/katharine-rudzitis.md
  - product/quintel/quintel-engine-build-roadmap-2026-06-09.md
  - product/quintel/quintel-lender-build-roadmap-2026-06-10.md
  - product/quintel/equipment-finance-build-architecture-2026-06-02.md
  - bd/deals/equipment-finance/equipment-finance-domain-primer-2026-05-30.md
  - bd/deals/equipment-finance/stauss-vfi-tokenrip-briefing.md
source_material: >
  Adapted from three operator-built reference dashboards (Stauss/VFI): market-signal-dashboard.html
  (macro/sector/regulatory signal board), keystone.html (DEALBOARD — tier discipline, cascade, query
  templates, cadence, player network), vfi-ai-platform.html (origination OS). Plus the EF data-edge
  thesis (EDGAR 8-K / USAspending / UCC) from the Stauss briefing §5 and build-architecture §9-§10.
---

# Quintel — Sourcing & Signals Engine PRD (Empire / Katharine)

> **What this is.** A customer-oriented product requirements doc for the **sourcing / signals** half of the Quintel engine, written for the Quintel engineering team and scoped against a specific, imminent customer: **Katharine Rudzitis, VP Direct Originations at Empire Asset Finance.** It defines what we're trying to accomplish, why it matters to the customer, and the implementation detail an engineer needs to build it — sources, queries, schemas, scoring, the cascade engine, and the sponsor layer.
>
> **How to use it.** §12 triages every capability into **Demo** (build for the call), **Near roadmap**, and **Later roadmap**. The demo-vs-roadmap cut is engineering's to make; §12 is a recommendation, not a mandate.
>
> **Provenance + a hard constraint.** Much of the source/signal design is *adapted from Stauss's (VFI's) reference dashboards.* Empire is a **VFI competitor.** Internally this doc names its provenance; **on any demo or customer-facing surface, no VFI/Stauss branding, deal data, or box appears** — we lift *patterns* and *public/commercial data sources*, never VFI's proprietary content. (Detail in §13.)

---

## 1. Why we're building this — context & goal

**The opportunity.** Empire Asset Finance is a **$100M, Arena-backed ($4.6B parent) direct balance-sheet equipment lender**, launched Sept 2025, self-branded "technology-driven," ~5 people. Katharine was hired April 2026, from **10 years at Macquarie**, to **build the direct-origination function.** A 9-month-old fund with $100M to deploy lives or dies on deal flow — **sourcing is her existential pressure, not a nice-to-have.** (This corrects an earlier read; see [[active/quintel-katharine-demo-prep-2026-06-16]] "On sourcing.")

**The goal of this engine.** Turn sourcing from a commodity lead feed ("a worse Apollo") into **pre-qualified-to-your-box deal flow** — the one thing a contact database structurally cannot produce. The mechanism: every sourced company runs through the **same box-screen / underwrite the demo already shows**, so each lead arrives stamped *in-box / open-to-band / out*, with an indicative structure and the reasons. A list is Apollo; a list where every row says "fits Empire, sale-leaseback, ~X%, here's why" is the moat.

**What the demo must accomplish (Act 3 — "where forward pipeline comes from").** Show, as a **co-build**, that Quintel can keep Empire's pipeline full of deals already shaped to their box — with the **cascade** as the magic moment and the **PE-sponsor layer** as the proof we understand *her* channel. It is sequenced **after** the underwrite (the stronger hook) and never leads.

**Strategic fit.** This is the "deal-sourcing / signal engine" already named in Quintel's product definition ([[product/quintel/CLAUDE]]) — one engine, two pieces (sourcing + underwriting/structuring). This PRD is the detailed, Empire-oriented spec for the sourcing piece. The sourced deals it emits are **the same Deal Objects** the existing engine screens and underwrites — so the value compounds into the existing pipeline rather than forking it.

---

## 2. The customer — Katharine / Empire (what "good" looks like)

**Empire's box (configure the engine to this):**
- Ticket **$3M–$50M**, terms to 7 yrs, **up to 100% advance on new equipment.**
- Borrower: **non-investment-grade middle market**, $100M+ revenue, $10M+ EBITDA, audited/reviewed financials, **often PE-sponsor-backed.**
- Structures: capital lease, operating lease, loan, EFA, first-amendment lease, **sale-leaseback** (their differentiated/"creative" option), progress payments.
- Sectors: automation, manufacturing, energy, food & beverage, healthcare, mining, transportation, marine, waste, warehousing, IT.
- Also a **capital-markets desk** that buys *and* sells syndicated paper (>$3M) with peer institutions.

**Katharine's seat & edge.** Direct Originations = a deal-flow-*generating* mandate. Her deals come via a **mix**: her Macquarie **sponsor/advisor rolodex** (relationship BD = outbound), advisor-led processes, broker submissions. Her differentiated edge is **PE-sponsor relationships** — which means **the highest-signal source for Empire is sponsor activity, not industry macro.** That is the single biggest design implication in this doc.

**What makes a sourcing tool credible to her (ex-Macquarie, high BS-detector):**
- **Provenance & verifiability** — every signal traceable to a Tier-1 public source, not scraped noise. She respects rigor.
- **Her population** — mid-market private companies at $3–50M ticket, in her sectors. A feed of public mega-caps (Nike/3M/AMD) reads as "not my deals" in five seconds and destroys credibility.
- **Pre-qualification** — leads already scored to her box, not raw names.
- **Her channel** — sponsor-driven intelligence she couldn't easily assemble herself.

**What reads as a *worse Apollo* (avoid):** raw contact lists, generic firmographics, "we found you companies" with no box-fit and no trigger. (The briefing §5 warning stands: the edge is **not** better contact data — Apollo/ZoomInfo are parity — it's EF-specific *triggers + the rubric that reads them*.)

---

## 3. Product thesis

**Verified triggers → cascade → pre-scored to the box, with the sponsor layer as the top source.**

Three sentences an engineer should keep in mind:
1. **Not Apollo, not a macro dashboard.** A sourcing engine tuned for **mid-market PE-sponsor deal flow**, built on free/commercial public data + the imprint that reads it.
2. **Every sourced company is a Deal Object** that flows into the existing `ingest → structure → decide/screen → match` pipeline, so it inherits box-screening and indicative structure for free.
3. **Sell the hands, not the dashboard.** The read-only signal feed is the funnel (public data, zero compliance surface, ships anywhere); the **box-scored, cascade-expanded, sponsor-attributed deal** is the value and the lock-in.

---

## 4. Architecture — how sourcing fits the existing engine

The sourcing engine sits **upstream** of the existing Quintel spine and emits Deal Objects into it. **Do not fork the pipeline** (engine-roadmap rule).

```
                    ┌─────────────── SOURCING / SIGNALS ENGINE (this PRD) ───────────────┐
  Sources ─▶ Signal ingest ─▶ Tier scoring ─▶ Cascade ─▶ Sponsor ─▶ Deal Object emit
  (EDGAR,    & normalize      & banding       expansion   attribution    (origin:
   USAspend,                  (Hot/Warm/                              "sourced")
   UCC, FRED,                  Watch/Filed)                               │
   sponsor,                                                               ▼
   reg.)                                              ┌──── EXISTING QUINTEL ENGINE ────┐
                                                      │  ingest → structure → decide/   │
                                                      │  screen (BOX) → match → capture │
                                                      └─────────────┬───────────────────┘
                                                                    ▼
                                          Pre-scored sourced-deal queue  ─▶  Deal Detail (hero)
                                          (in-box / open-to-band / out,      + the hands (route,
                                           indicative structure, reasons)     memo, outreach, status)
```

**Key principles:**
- A sourced lead becomes a **Deal Object with `origin: "sourced"`** plus its signal/cascade/sponsor provenance. It then runs the *same* `decide/screen` against Empire's box config that the lender-surface demo already uses ([[quintel-lender-build-roadmap-2026-06-10]] §4). The "pre-qualified" stamp is not new logic — it's the existing box-screen applied at sourcing time.
- Schemas here **extend** the canonical Deal Object ([[equipment-finance-build-architecture-2026-06-02]] §10) — reconcile, don't duplicate.
- The signal feed (read-only, public data) and the hands (per-customer, sandboxed) are separated for the compliance reason in [[product/quintel/CLAUDE]]: the feed ships anywhere; the hands hold the outcomes that build the deal-graph.

---

## 5. Signal sources (implementation-ready)

Each source below lists: **tier**, what it produces, the **exact endpoint/query**, the mechanism, cadence, Empire-fit, and demo-vs-roadmap. Appendix §15 has copy-pasteable query bodies.

### 5.1 EDGAR 8-K full-text → the *private counterparty* (Tier 1) — **the diamond**
- **What it produces:** mid-market *private* companies named inside a public filer's material-agreement disclosure — i.e., real equipment-intensive leads, not the mega-cap filer.
- **Mechanism (the unlock):** a public company filing an **8-K Item 1.01** (material definitive agreement) or **2.01** (completed acquisition) routinely **names its private counterparty** (supplier, fabricator, contractor, JV partner). *That private name is the lead* — it just signed a contract that implies a capex/equipment need. **This is the fix to the broken "public mega-cap feed."** We never surface the filer; we extract and surface the named private counterparty.
- **Endpoint:** EDGAR full-text search — `https://efts.sec.gov/LATEST/search-index?q="<phrase>"&forms=8-K&startdt=<YYYY-MM-DD>&enddt=<YYYY-MM-DD>`. Free, no API key; **a descriptive `User-Agent` header with a contact email is required by SEC.** Returns JSON hits → fetch the filing → extract counterparty entities.
- **Query seeds:** `"supply agreement" OR "purchase order" OR "strategic partnership" OR "master agreement" OR "equipment purchase"`; forms `8-K` (Items 1.01/2.01), `10-K` (MD&A capex language) as a slower sweep.
- **Counterparty extraction:** NER + heuristics over the filing body to pull named private entities; cross-check the name is *not* itself a public filer (drop public mega-caps); enrich with sector (NAICS) + rough revenue band.
- **Cadence:** session sweep (each working session) on last-72h filings.
- **Empire-fit:** HIGH across her sectors. **Demo:** show the extraction on 1–2 synthetic filings (static). **Roadmap:** live sweep + extraction pipeline.

### 5.2 USAspending federal awards (Tier 1)
- **What it produces:** private contractors that just won equipment-heavy federal awards → fleet/working-capital/equipment need.
- **Endpoint:** `POST https://api.usaspending.gov/api/v2/search/spending_by_award/` (free, no auth). Filter by **NAICS** (237/238 construction & specialty trade, 31–33 manufacturing, 484 transportation, plus her sectors), `award_amounts > $1M`, `time_period: last 30d`.
- **Cadence:** weekly lead-list (Monday).
- **Empire-fit:** MEDIUM–HIGH (energy/infrastructure/manufacturing/transport). **Demo:** static example. **Roadmap:** live weekly sweep.

### 5.3 UCC-1 lien lookups → refi-timing window (Tier 1) — the EF *timing* signal
- **What it produces:** *when* an existing equipment lien matures → a refinancing/upgrade window opens (~90 days prior). A predictable refi pipeline, less competitive than new-money origination.
- **Mechanism:** UCC-1 filing reveals secured party, **collateral description**, and **filing date**. Filing date + typical equipment lease term (asset-class dependent, ~3–7 yrs) → estimated maturity → **refi window = maturity − 90d.**
- **Source reality (be honest):** **no free unified national UCC API.** State Secretary-of-State portals are per-debtor, many require an account/fee; **bulk/national monitoring is a paid aggregator** (e.g., national UCC search providers). v1 = targeted per-debtor lookups on already-identified leads; bulk monitoring is a paid-source decision (§14).
- **Cadence:** monthly sweep + on-demand per lead.
- **Empire-fit:** HIGH (every funded asset eventually refis). **Demo:** static "refi window" badge on a synthetic deal. **Roadmap:** targeted lookups → paid aggregator for a maturity calendar.

### 5.4 PE-sponsor activity (Tier 1/2) — **the headline ADD; see §8**
The source Stauss's dashboards lack because it isn't his model. Detailed in §8. Sources: **PitchBook** (paid — sponsor deal/portfolio data), **sponsor IR/press pages** (acquisitions, portfolio news), **LinkedIn executive moves** (portfolio-co COO/VP-Ops hires as capex precursors), **EDGAR 8-K acquisitions** (sponsor-backed M&A). Empire-fit: **HIGHEST** — it is Katharine's channel.

### 5.5 Regulatory forcing-functions (Tier 1, sector-scoped)
- **What it produces:** "this demand is *structurally forced*, not sentiment" — the answer to "won't this dry up if rates move?"
- **Triggers (encode as sector → regulation → urgency):**
  - **EPA 2027** (heavy-truck emissions) → Class-8 pre-buy/replacement (transportation).
  - **SHIPS Act 2025** → Jones-Act vessel replacement (marine — underserved by banks; $3–30M sweet spot).
  - **OBBBA §168(n)** Qualified Production Property → immediate expensing of new production-facility floor → **reshoring capex** (manufacturing/automation). §168(k) 100% bonus depreciation (permanent) and §179 limits as context.
- **Mechanism:** a curated **regulatory-trigger table** (Appendix §15.6) mapping each regulation to affected sectors, the financing implication, and an urgency/expiry. Tag matching sourced deals.
- **Empire-fit:** HIGH for transportation/marine/manufacturing/energy. **Demo:** show 2–3 as "structural" tags on the sector view. **Roadmap:** maintained trigger table + docket monitoring.

### 5.6 Macro overlay — FRED + prediction markets (Tier 1, *context only, not a hero*)
- **FRED** (free CSV, CORS-friendly: `https://fred.stlouisfed.org/graph/fredgraph.csv?id=<SERIES>`): capex orders (`NEWORDER`), mfg capacity utilization (`MCUMFN`), industrial production (`INDPRO`), an ISM-PMI proxy. **Caveat:** some series in the mock (e.g., `NAPM`) are **discontinued** — engineers confirm current series IDs.
- **Prediction markets (Kalshi, CFTC-regulated):** Fed-rate/CPI/recession odds → lease-vs-buy + urgency context. Optional.
- **Empire-fit:** LOW as a centerpiece (a Macquarie VP has Bloomberg). Keep it a thin overlay that frames *deal persistence* (regulatory-forced deals survive a rate move; discretionary capex doesn't). **Demo:** a small overlay strip at most. **Roadmap:** live FRED tiles.

### 5.7 Tier-2 / Tier-3 sources (corroboration & leads only)
- **Tier 2:** IR/press releases (facility expansions, capex), trade publications (ACT Research, NTEA, Clarksons Platou, Ritchie Bros.), LinkedIn exec moves.
- **Tier 3:** Reddit/Discord/forums — **lead-only, never cited as fact**; valid only after Tier-1 corroboration.

---

## 6. Tier discipline & signal scoring

The credibility spine. An ex-Macquarie underwriter trusts a system that grades its own sources.

- **Tier 1 — free, verifiable, public:** EDGAR, USAspending, UCC, FRED, sponsor filings. Citable as fact.
- **Tier 2 — IR/press/LinkedIn/trade:** real but needs corroboration.
- **Tier 3 — forums/rumor:** lead-only; filed as junk until a Tier-1 source confirms.

**Per-signal fields:** `tier`, `source`, `verification` (corroborated ≥2 sources/filing | single | unverified), `urgency` (high|med|low), `sectorFit` + `boxFit` tag, `narrative`, `nextAction`.

**Banding (score → surface):**
- **Hot** = Tier 1 + High urgency + Corroborated → surfaces in *Next Moves* / pre-scored queue.
- **Warm** = Tier 1 single-source, or Tier 2 corroborated.
- **Watch** = needs corroboration.
- **Filed** = Tier 3 uncorroborated / out-of-box.

**Rule:** Tier 3 never promotes itself; only a Tier-1 corroboration moves it up. Display: signal log filterable by tier/source/band, sorted by score.

---

## 7. The cascade engine

**Why it matters to Katharine — the direct-lender reframe.** For a broker (Stauss), a cascade = more line items to place for fees. For a **$3–50M balance-sheet lender**, the cascade is a **deal-sizing + whitespace tool**: it shows the **financeable chunk inside a much larger project** and the **multi-year relationship** behind it. "This one data-center trigger contains a **$1–25M power phase** and a **$500K–15M cooling phase** — both your exact ticket — and the sponsor will do this again at the next portfolio company." That reframes sourcing from a lead list (Apollo shrug) into *deal architecture* (judgment Apollo can't produce). **This is the Act-3 magic moment.**

**Mechanism:** one trigger → a **cascade template** (keyed by trigger type + sector) → **phases** → **line items**, each tagged with ticket range, candidate **structure**, and a **box-fit lane** (INBOX = Empire's sweet spot | TIGHT = needs careful structure/residual | ROUTE-OUT = refer/syndicate).

**Data model (extends Deal Object):**
```
Cascade {
  id, triggerSignalId, sector, projectLabel,
  estProjectValue, sponsorId?,                 // links to §8 if sponsor-driven
  phases: Phase[]
}
Phase {
  name, lane: "INBOX"|"TIGHT"|"ROUTE-OUT",
  ticketLow, ticketHigh,
  candidateStructures: ("loan"|"FMV lease"|"sale-leaseback"|"TRAC"|"EFA")[],
  lineItems: LineItem[],
  boxFit: "in-box"|"open-to-band"|"out"          // from the box-screen
}
LineItem { category, equipmentExamples[], ticketLow, ticketHigh, residualRisk: "low"|"med"|"high" }
```

**Reference cascade templates (implementation-ready; ticket ranges Empire-relevant):**

| Trigger → Cascade | Empire INBOX phases | Ticket | Structures |
|---|---|---|---|
| **Data-center build-out** (hyperscaler/colo capex 8-K · utility interconnect · "VP Data Center Ops" hire · permit) | Power & energy (switchgear, UPS, gens, BESS); Cooling/thermal (CRAC/CRAH, chillers, liquid cooling) | $1–25M / $500K–15M | loan, FMV lease, **SLB** |
| **Manufacturing line / plant expansion** (capex announcement · §168(n) reshoring · sponsor acquisition) | Primary production equipment; material handling | $500K–25M / $100K–5M | loan, **SLB**, TRAC (rolling stock) |
| **Cold-chain / logistics** (pharma/food expansion — underserved by EF) | Refrigeration/facility; cold fleet | $500K–15M / $250K–10M | loan, FMV lease |
| **Sponsor add-on acquisition** (§8) | Post-acq equipment refresh + integration capex | $5–50M | **SLB**, loan, EFA |

(IT/Compute phase = high residual risk → TIGHT lane. Shell/TI, soft costs, insurance/warranty → ROUTE-OUT.)

---

## 8. The sponsor layer — the headline feature (full detail)

**Why this is the most important section.** Every Stauss signal is *industry/sector/contractor*-driven. **Empire's channel is sponsors, and that's Katharine's edge.** The sponsor layer makes the engine speak her language and produces signals a broker's model structurally can't. *What we take from Stauss is less than it looks; this is what we add.*

**Signal types (each → a cascade, pre-scored to the box):**

1. **Sponsor acquisition → post-acquisition capex cascade.** When a PE sponsor acquires a portfolio company in Empire's sectors, the typical **18–24-month capex cycle** (equipment refresh, automation upgrades, line/ERP integration) is a **$5–50M financing opportunity** *and* a multi-year relationship (more add-ons follow). *Sources:* EDGAR 8-K acquisitions, sponsor IR/press, PitchBook deal feed.
2. **Portfolio-company executive hire → capex precursor.** A new COO / VP Operations / Plant Manager at a sponsor portfolio company frequently precedes an operational-transformation capex cycle. *Sources:* LinkedIn exec moves (ToS-aware — via a compliant data provider), press.
3. **Sale-leaseback / liquidity trigger.** Empire's *differentiated product* is sale-leaseback — so a *balance-sheet* sourcing angle a broker has no analog for: companies that **own** equipment and have a liquidity or balance-sheet-optimization trigger (covenant pressure, refinancing, sponsor wanting to free cash for an add-on). *Sources:* EDGAR leverage/covenant disclosures, credit-agreement filings, sponsor IR.
4. **Covenant-aware refinancing.** Mid-market sponsors are covenant-sensitive; **off-balance-sheet equipment leasing** is a lever to manage leverage ratios. Signal: a portfolio company near a leverage covenant + a capex need. *Sources:* EDGAR debt filings, leverage disclosures.
5. **EBITDA-milestone capex.** Sponsors tie capex budgets to EBITDA targets; a credit upgrade / EBITDA-milestone press item → capex-budget expansion. *Sources:* rating actions, press, sponsor-shared IR.

**Sponsor graph (data model):**
```
Sponsor { id, name, focusSectors[], typicalCheck, watchlisted: bool }     // Katharine seeds her known sponsors
PortfolioCompany { id, sponsorId, name, sector, revenueBand, ebitdaBand, acquiredAt }
CapexEvent { id, portfolioCompanyId, type: "acquisition"|"exec-hire"|"SLB-trigger"|"covenant"|"ebitda-milestone",
             detectedAt, sourceTier, cascadeId? }
```

**The relationship hook (demo gold):** Katharine **seeds her known sponsors** into a watchlist; the engine monitors them and surfaces portfolio-company capex events **pre-scored to Empire's box.** "Tell us your 20 sponsors; we watch their portfolios and bring you the $5–50M capex moments before anyone calls." That is the sourcing pitch that lands with *her*.

---

## 9. Pre-scoring to the box (the differentiator — make it visible)

Reuse the existing `decide/screen` against Empire's box config. Every sourced Deal Object carries:
- `boxFit`: `in-box | open-to-band | out` (the "open-to" secondary band per [[quintel-lender-build-roadmap-2026-06-10]] §4.1 covers SLB / equipment-light cases).
- `indicativeStructure` + `rateTermBand` + `reasons[]` (moldable, ~70% — co-creation, not rejection).

**UI requirement:** the box-fit verdict must be **visible on every sourced row.** This is what converts a lead list into "pre-qualified deal flow." Without it, we're Apollo.

---

## 10. Data model summary (extends the canonical Deal Object)

```
Signal { id, tier, source, verification, urgency, sectorFit, boxFitHint,
         narrative, nextAction, band, detectedAt, links[] }
SourcedDeal extends DealObject {
  origin: "sourced",
  signalIds: string[], cascadeId?: string, sponsorId?: string,
  boxFit, indicativeStructure, rateTermBand, reasons[]
}
Cascade / Phase / LineItem         // §7
Sponsor / PortfolioCompany / CapexEvent   // §8
Player { id, name, role, type:"lender"|"broker"|"partner",
         vStatus:"verified"|"unverified"|"watch", score, creditBox?, syndicationAppetite? }  // for syndication/route-out
```
Reconcile field-by-field with [[equipment-finance-build-architecture-2026-06-02]] §10 before coding.

---

## 11. Workflow & UX surfaces

- **Signal log** — all signals, filter by tier/source/band, sorted by score. Provenance link per signal.
- **Next Moves** — Hot signals + due sweeps.
- **Pre-scored sourced-deal queue** — sourced Deal Objects with the box-fit verdict; feeds the *same* Deal Detail hero the underwrite demo uses.
- **Cascade map** — one trigger fanned into phases/line-items with ticket ranges, structures, box-fit lanes (the Act-3 view).
- **Sponsor watchlist** — Katharine's seeded sponsors → portfolio companies → capex events.
- **Sourcing requests** — `FIND` (companies like this signal: same NAICS, $100M+ rev, equipment-heavy), `SOURCE` (new qualified targets), `ASK` (open question). Documented, never silent.
- **Cadence / freshness** — per-source sweep status (session / weekly / monthly), with overdue flags and a "mark run" action. **Honesty principle:** all scans are operator-driven; never present a "live ghost feed" we don't actually run (the deployed "12d ago" staleness is the anti-pattern).

---

## 12. Demo vs. roadmap (triage — recommendation; eng owns the cut)

**Build for the DEMO (static/synthetic OK — it's a co-build vision beat, Act 3, after the underwrite):**
- **The cascade on ONE synthetic Empire deal** (e.g., a $10M plant expansion or data-center power phase) — the magic moment. Phases, ticket ranges, structures, **box-fit lanes** rendered.
- **Tier-discipline framing** — one EDGAR-private-counterparty example + one USAspending example, labeled Tier 1; show the "we don't surface the public filer, we surface the private counterparty" mechanic (the credibility fix).
- **One sponsor example** — a sponsor watchlist with one acquisition → post-acq capex cascade, pre-scored to the box. Proves we understand her channel.
- **Box-fit verdict visible** on every sourced row.
- Framed verbally as: "which signals matter most for Empire? which sponsors should we watch?"

**NEAR roadmap:**
- Live EDGAR 8-K Tier-1 sweep + private-counterparty extraction.
- Live USAspending weekly sweep.
- UCC targeted lookups + refi-window badge.
- Sponsor watchlist wired to real sponsor IR/press + EDGAR acquisitions.
- Signal log + scoring/banding + cadence tracker.
- Regulatory-trigger table (EPA 2027 / SHIPS / §168(n)).

**LATER roadmap:**
- Full cascade template library across all sectors.
- Paid sources: PitchBook integration, national UCC aggregator (maturity calendar), compliant LinkedIn exec-move feed.
- Covenant / SLB / EBITDA-milestone signal models.
- Prediction-market macro overlay.
- Deal-graph capture loop (outcomes re-weight signal scoring) — the moat.

---

## 13. Constraints & non-goals

- **Competitor hygiene (load-bearing).** Empire ≈ a VFI competitor. The reference dashboards are VFI's; **lift patterns + public sources, never VFI branding/box/deals.** No "Northbeam/Keystone/VFI" on any Empire-facing surface. Synthetic deals only.
- **Don't lead with sourcing.** Act 3, after the underwrite. Sourcing *alone* invites the Apollo shrug; sourcing *scored-to-the-box* is the thesis.
- **Don't fork the pipeline.** Sourced leads are Deal Objects through the existing spine.
- **Public/commercial data only in the read-only feed; no PII** (keeps the feed's compliance surface at zero — it's the funnel that ships anywhere).
- **Honesty.** No overclaiming a live feed we don't run; scans are operator-driven (§11). The briefing's caution: a source that looks suspiciously easy is usually a data-cleaning nightmare — budget for it.
- **Not Apollo-parity on contacts.** Firmographic/contact data is a **bought commodity input**, not the edge. The edge is EF-specific triggers + the box-screen.

---

## 14. Open decisions

1. **Paid-source budget & timing** — PitchBook (sponsor data — the highest-value add), national UCC aggregator (refi calendar), compliant exec-move feed. Which, when, at what cost?
2. **Sponsor-layer depth for v1** — manual watchlist + press/EDGAR (cheap) vs. PitchBook integration (rich, paid).
3. **Sector scope for v1** — recommend starting with Empire's highest-fit/regulatory-forced sectors: manufacturing/automation, energy, transportation, marine, IT.
4. **EDGAR counterparty extraction quality bar** — NER precision needed before this is trustworthy in front of a customer.
5. **Schema reconciliation** — align §10 with build-architecture §10 and the V1 SPEC before coding.

---

## 15. Appendix — exact queries, endpoints, triggers

**15.1 EDGAR full-text (Tier 1):**
`GET https://efts.sec.gov/LATEST/search-index?q="supply agreement"&forms=8-K&startdt=<YYYY-MM-DD>&enddt=<YYYY-MM-DD>`
Headers: `User-Agent: Quintel sourcing <contact-email>` (SEC requires a descriptive UA). Then fetch each hit's filing document; run NER to extract named private counterparties; drop entities that are themselves public filers; enrich with NAICS + revenue band. Query seed set: `"supply agreement" OR "purchase order" OR "strategic partnership" OR "master agreement" OR "equipment purchase"`.

**15.2 USAspending (Tier 1):**
`POST https://api.usaspending.gov/api/v2/search/spending_by_award/`
Body: `{ "filters": { "award_type_codes": ["A","B","C","D"], "naics_codes": ["237","238","31","32","33","484", <her sectors>], "award_amounts": [{"lower_bound": 1000000}], "time_period": [{"start_date":"<-30d>","end_date":"<today>"}] }, "fields": ["Recipient Name","Award Amount","NAICS","Place of Performance"], "page":1, "limit":100 }`
No auth.

**15.3 UCC-1:** per-debtor state SoS portal lookups (no free unified API). Capture secured party, collateral description, filing date → refi window = estimated maturity − 90d. National monitoring = paid aggregator (decision §14).

**15.4 FRED (overlay, no key):** `https://fred.stlouisfed.org/graph/fredgraph.csv?id=<SERIES>` — `NEWORDER` (core capex orders), `MCUMFN` (mfg capacity util), `INDPRO` (industrial production), ISM-PMI proxy. **Confirm current series IDs — `NAPM` is discontinued.**

**15.5 Prediction markets (optional overlay):** Kalshi public API — Fed-rate / CPI / recession markets.

**15.6 Regulatory-trigger table (seed):**
| Regulation | Sector(s) | Financing implication | Urgency |
|---|---|---|---|
| EPA 2027 emissions | Transportation (Class-8) | Pre-buy / fleet replacement | High (deadline-driven) |
| SHIPS Act 2025 | Marine (Jones Act) | Vessel replacement; underserved by banks; $3–30M | High (structural) |
| OBBBA §168(n) QPP | Manufacturing / automation | Immediate expensing of new production-floor → reshoring capex | High (reshoring wave) |
| §168(k) 100% bonus depr. (permanent) | All | Confidence to finance new equipment | Context |
| §179 ($2.56M 2026) | Small-ticket | Below Empire's floor — context only | Low |

**15.7 Sponsor sources (the ADD):** PitchBook (paid — sponsor deal/portfolio feed); sponsor IR/press pages (acquisitions, portfolio news — RSS/scrape); EDGAR 8-K Item 2.01 (sponsor-backed acquisitions); compliant LinkedIn exec-move provider (portfolio-co COO/VP-Ops hires).

---

*Companion to the demo prep ([[active/quintel-katharine-demo-prep-2026-06-16]]) and the lender-surface roadmap ([[quintel-lender-build-roadmap-2026-06-10]]). The sourcing engine emits Deal Objects into the existing spine — build it upstream, never as a fork.*
