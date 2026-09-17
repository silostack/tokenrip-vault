---
title: "Quintel Data Strategy — The Lender Signal Portfolio (UCC value, angles, gaps, blind spots)"
status: draft
owner: Simon
type: data-strategy / product-input
product: Quintel
created: 2026-07-13
audience: Simon (roadmap + data-model input)
source: Reasoning opened up by the Martin Roth / Filmore call (2026-07-13); grounded in the customer-data-first PRD and the 2026-06-18 competitive landscape
related:
  - product/quintel/quintel-customer-data-first-prd-2026-06-29.md
  - intelligence/research/quintel/quintel-competitive-landscape-research-2026-06-18.md
  - bd/calls/contacts/martin-roth.md
---

# Quintel Data Strategy — The Lender Signal Portfolio

> **Purpose.** Capture every data "angle" for the equipment-finance *lender/originator*, valued honestly, so it can be mapped to a roadmap: where Quintel has the data and uses it, where it has the data and under-leverages it, where there are outright gaps, and where there are blind spots not yet discussed. The organizing claim: **data value is not absolute — it is a function of the job it serves and how early it fires.** A single feed (UCC is the worked example) can be high- or low-value depending on which lender job you point it at.

---

## 1. Bottom line up front

1. **Reframe from "is this data useful?" to "which job, how early, how ownable?"** The originator has **five distinct jobs**; each demands different data with a different time-signature. A feed that is near-worthless for one job is essential for another. This is why "UCC isn't that useful" and "UCC is essential" are *both* true — for different jobs.
2. **Quintel's sourcing edge must be built on *leading* signals** — the ones that fire *before* the deal (permits, contract awards, new authority, formations, capex triggers). **UCC and news are coincident-to-lagging**; a product that leads on lagging data is structurally late to every deal it claims to source.
3. **UCC is not low-value for a lender — it is mis-used if treated only as a renewal estimator.** It has three lender-native jobs (refi-timing, competitive-displacement mapping, financeability qualification) that a *dealer* has no use for. Collateral detail, by contrast, is genuinely dealer-weighted — the one place Simon's instinct is exactly right.
4. **The winning asset is the fusion + box-scoring + reasoning layer, not any feed** (consistent with the competitive doc). Every raw feed here is commodity or buyable; **entity resolution across feeds is the true bottleneck and the real scaling constraint.**
5. **The safe Filmore-collaboration boundary falls straight out of this:** shared commodity base (UCC, permits) → *divergent* enrichment (his telematics/collateral for dealers; Quintel's credit/timing/competitive/capex layers for lenders) → divergent GTM. Neither enrichment competes.

---

## 2. The five originator jobs → the data they need

Everything downstream hangs on this. The originator's day decomposes into five jobs, and the **data portfolio is defined by covering all five** — a gap is any job with no data behind it.

| # | Job | The question | Time-signature needed | Nature |
|---|---|---|---|---|
| **J1** | **Demand origination** | *Who is about to need equipment (and therefore financing)?* | **Leading** (before the buy) | The growth engine — find fresh deals early |
| **J2** | **Timing** | *Of the universe, who is in-window to call **now**?* | **Leading for the next cycle** | Turns a static list into a dated call list |
| **J3** | **Qualification / box-fit** | *Is this a real, financeable, in-box borrower?* | Coincident/standing | De-tire-kicks the list; feeds the ranker |
| **J4** | **Competitive / displacement** | *Who do they bank with, and where can I win?* | Standing | How you take the deal, not just find it |
| **J5** | **Revealed preference (rank)** | *Given all the above, what should THIS customer call first?* | Standing (own book) | The private ranker — the moat |

**The core error to avoid:** conflating J1 (demand origination, needs leading data) with J2–J5. Most "sourcing" pitches quietly run on coincident data (UCC, news) and therefore serve J2–J4, not J1 — they find deals *at or after* the moment, dressed up as "sourcing." Quintel must be explicit about which job each feed serves.

---

## 3. The master sort: the temporal axis

The single most useful lens on any EF signal. Where a signal sits determines which job it can serve — and a *leading signal delivered late collapses into a coincident one*, so **freshness is a product property, not just a data property.**

| Band | Meaning for EF | Example signals | Jobs it can serve |
|---|---|---|---|
| **Leading** | Fires before equipment is acquired | Permits, DOT lettings, gov contract awards, FMCSA new authority, business formations, hiring, CRE moves, regulatory-mandate waves | **J1**, J3 |
| **Coincident** | Fires at/around the transaction | UCC-1 filing, equipment delivery/import, insurance binding, news of a purchase | J2 (next cycle), J3, J4 |
| **Lagging** | Fires after the fact | UCC on a closed deal, auction disposal, servicing/telematics | J2 (renewal), J4, risk |

**Implication:** Quintel's **J1 (demand-origination) layer is where the leading signals live — permits, awards, authority, formations — and that is the highest-value, least-built part of the portfolio.** UCC/news (coincident/lagging) are valuable but serve J2–J4. Leading on lagging data = late to every deal.

---

## 4. UCC, valued precisely (the worked example)

Simon's read — *"we just use UCC to estimate renewals; it's a lagging indicator; permits are more useful for us"* — is **right on demand-origination (J1) and wrong that renewal is its only use.** UCC is lagging for the *current* deal but serves three jobs a dealer cannot use it for:

| UCC used for… | Job | How | Lender-native? |
|---|---|---|---|
| **Refi / renewal timing** | J2 | UCC-1 filing date + assumed term → maturity window; **UCC-3 terminations** = loan paid off → borrower re-enters market (a *cleaner* signal than term-estimation) | Yes |
| **Financeability qualification** | J3 | A UCC filing is cold proof the company *is* a real equipment borrower — size, asset type, and counterparty revealed. De-tire-kicks a cold list; feeds the ranker's "in-box buyer" test | Yes |
| **Competitive / displacement map** | J4 | Secured-party aggregation → *who banks with whom*; powers displacement targeting and "which lenders serve segment X" queries (cf. Ted Craver's "top 15 credit unions with C&I > $25M") | Yes — a dealer has zero use for this |

**The dealer's single UCC use** — *"who just acquired a machine → sell them service/aftermarket"* — is the one Filmore optimizes, and it is exactly the use that most wants **collateral detail** (which machine, condition, hours). **That is why collateral is dealer-weighted and Simon is right to deprioritize buying the fully-enriched collateral feed** — for a lender it only matters at underwriting (LTV/recovery), not at sourcing.

**Nuance that cuts against fully dismissing collateral:** collateral + amount + term *sharpen the J2 maturity estimate and the J3 size/appetite read*. So a *thin* collateral/amount enrichment has lender value; the *deep* condition/hours enrichment is pure dealer. Buy thin, not deep.

**Net UCC verdict:** medium-value, **currently under-leveraged** — Quintel uses ~1 of 3 lender jobs. Do **not** lead the product on it (it's coincident/lagging); do use it for J2/J3/J4 enrichment; buy a thin/mid enrichment tier, not the dealer-grade collateral feed.

---

## 5. The full signal universe

Every angle, sorted by job, with time-signature, who it's weighted toward, availability, and **current Quintel status**. Status legend: **LIVE** (have + using) · **UNDER** (have/adjacent but under-leveraged) · **ROADMAP** (named in the PRD's L1–L4) · **GAP** (not in the model).

### 5a. J1 — Demand origination (LEADING — the highest-value, least-built layer)

| Signal / source | Tells you | Time | Weight | Availability | Quintel status |
|---|---|---|---|---|---|
| **Construction permits / project starts** | Who's about to build/expand → equipment need | Leading | Shared | Scrape / Shovels, Construction Monitor, Dodge | ROADMAP (PRD L3) — **arguably under-prioritized; see §7** |
| **State DOT lettings** | Contractor won an infra job → mobilization → equipment | Strongly leading | **Lender-lean, EF-specific** | Public, per-state | GAP — flagged "white space" in competitive doc |
| **Federal contract awards (USAspending)** | Award → capex → financing | Leading | Shared | Public API | **LIVE** (PRD L1) — **under-leveraged for J1 framing** |
| **FMCSA new operating authority (trucking)** | New carrier → needs trucks/trailers | Strongly leading | **Lender-lean, EF-specific** | Public (CarrierOK, RigDig) | GAP — "finance buyers already on this data" |
| **Business formations / new registrations** | New entity → startup capex | Leading (noisy) | Shared | Per-state SoS | ROADMAP-adjacent (Filmore uses it) — likely GAP for Quintel |
| **Hiring / job postings** | Hiring operators/drivers/machinists → capacity expansion | Leading | Shared | Indeed/LinkedIn scrape | GAP — under-explored |
| **CRE moves (new facility lease/purchase)** | New plant/warehouse → fit-out equipment (HVAC, racking, gensets, material handling) | Leading | Shared | CRE data / permits proxy | GAP |
| **Environmental / air permits, zoning** | Industrial expansion (PRD's own air-permit example) | Leading | Shared | Per-agency | ROADMAP (PRD L3) |
| **Utility / ISO interconnection queues** | Energy/solar/industrial build → equipment | Leading, sparse | Shared | Public dockets | ROADMAP (PRD L3) |
| **Grant / incentive awards (state econ-dev, energy credits)** | Funded expansion | Leading | Shared | Public | GAP |

### 5b. J2 — Timing (WHEN to call)

| Signal / source | Tells you | Time | Weight | Quintel status |
|---|---|---|---|---|
| **UCC-1 age + est. term → maturity** | Refi/replace window opening | Leading (next cycle) | Lender | UNDER (used for "renewals") |
| **UCC-3 terminations** | Loan paid off → re-enters market | Coincident | Lender | GAP / UNDER — cleaner than term-estimation |
| **Equipment vintage / replacement cycle** | Asset aging into replacement | Leading | Shared | GAP (needs collateral+date) |
| **Section 179 / bonus-depreciation tax calendar** | Year-end capex surge; deadline-driven buying | **Deterministic seasonal** | **Lender-lean** | **GAP — blind spot, see §8** |
| **Regulatory-mandate deadlines (emissions/ELD/safety)** | Forced fleet replacement waves | Leading, deterministic | **Lender-lean, EF-specific** | **GAP — blind spot, see §8** |

### 5c. J3 — Qualification / box-fit / financeability

| Signal / source | Tells you | Weight | Quintel status |
|---|---|---|---|
| **Firmographics** (revenue, employees, NAICS, years) | Basic box-fit | Shared | UNDER (commodity; D&B/ZoomInfo) |
| **Credit / financial health** (D&B/Experian scores, tax liens, judgments, UCC lien-load, bankruptcies) | Financeable? Over-levered? Distress? | **Lender-specific — dealers don't screen credit** | **GAP — the biggest qualification gap; see §8 risk angle** |
| **UCC borrowing history** | Proven equipment borrower; revealed size/type | Lender | UNDER (see §4) |
| **Sponsor / ownership** (PE / family / public) | PE-backed = capex mandate + a channel | Lender | ROADMAP (PRD ranker feature) |

### 5d. J4 — Competitive / displacement

| Signal / source | Tells you | Weight | Quintel status |
|---|---|---|---|
| **Competitive-lender map** (UCC secured parties) | Who funds whom; displacement targets; "lenders in segment X" | **Lender-specific** | GAP / UNDER — high-value, under-built |
| **Broker / dealer / OEM channel map** | Which channels source which deals | Lender (own + observable) | ROADMAP (PRD channel intelligence) |
| **Observable terms/rate intelligence** | Where you can beat the incumbent | Lender | GAP (sparse/hard) |

### 5e. J5 — Revealed preference (the private ranker — the moat)

| Signal / source | Tells you | Quintel status |
|---|---|---|
| **Own funded deals / credit memos** | What actually funds (revealed preference) | LIVE (PRD v1 core) |
| **Own declines / lost + reasons** | The boundary profile | LIVE (PRD v1) |
| **Own CRM/pipeline universe + status** | The list to rank; outcomes | LIVE (synthetic v1; live sync v2) |
| **Interaction feedback** (thumbs/watch/save) | Immediate personalization | LIVE (PRD v1 loop) |

---

## 6. Lender-weighted vs dealer-weighted (the spend map + the Filmore boundary)

The clean split — and the reason "share data with Filmore" is safe:

- **Dealer-weighted (Filmore's world, Quintel should NOT invest here):** collateral condition/hours, telematics, service-history, rebuild timing, aftermarket. Orbits **the equipment and the owner's service lifecycle.**
- **Lender-weighted (Quintel's differentiated surface, Filmore has no reason to build):** credit/financial-health screening, refi-timing, competitive-lender map, capex-trigger events (DOT/awards/authority), sponsor mapping. Orbits **the borrower's financeability, timing, and the competitive lending landscape.**
- **Shared commodity base (split the cost):** raw UCC, permits, formations, firmographics.

> **The collaboration thesis, precise:** shared base data → divergent enrichment → divergent GTM. Quintel and Filmore can co-fund the ~$350k public base and never touch each other's enrichment or customers. This is the concrete substance behind Martin's "let's help each other" and his "data isn't the moat."

---

## 7. Gaps, mis-prioritizations, and "have-but-under-leveraging"

**Outright gaps (no data behind the job):**
- **J1 leading, EF-specific:** DOT lettings, FMCSA new authority, business formations, hiring, CRE, grants — the richest *leading* demand signals and mostly absent from the model. **This is the biggest opportunity: it's where fresh deals originate, it's EF-specific (defensible), and much of it is public/cheap.**
- **J3 credit/financial-health screening** — the qualification layer that is *purely* lender-side and currently thin. Without it, "in-box" means firmographic fit, not *financeable* fit.
- **J4 competitive-lender map** — high-value, under-built, and uniquely lender-native.

**Mis-prioritization to challenge in the PRD:** the PRD buries **UCC and permits in L3 (roadmap, "high effort")** while **news is L2 (priority)**. But **permits + DOT/FMCSA/awards are the *leading demand* layer (J1)** and several are structured and cheap. Consider **promoting the structured leading-signal feeds (DOT/FMCSA/awards/permits) ahead of, or alongside, L2 news** — news makes the feed feel *alive* (density), but leading signals are what make it *early* (the actual sourcing edge). Density ≠ edge.

**Have-but-under-leveraging:**
- **USAspending is LIVE (L1)** but framed as generic "freshness," not mined as a **J1 capex-trigger** — re-frame and exploit.
- **UCC** — used for ~1 of its 3 lender jobs (§4).
- **Own deal history** — the ranker fuel is core, but the **channel map (J4)** latent in it (which OEMs/brokers actually close) is under-modeled relative to its value.

---

## 8. Blind spots and novel angles (things not yet discussed)

The generative section — angles that open up and that Simon may not have considered:

1. **Data doubles as *risk* data — the "who to AVOID" inversion.** Almost all sourcing talk is "who to call." But a lender equally needs "who *not* to call": over-levered (UCC lien-load), judgments/tax liens, litigation, bankruptcy, auction-disposals (distress). **The same feeds that source also screen risk** — and Quintel's ranker already has a *boundary profile* (from own declines) that could be fed by *external* risk data, not just internal outcomes. **Under-modeled and high-value: the bottom of the ranked list is as valuable as the top** (the PRD says this about *ranking*; it's also true about *risk data*).

2. **Section 179 / tax-calendar seasonality as a first-class timing signal.** EF has a deterministic Q4 buying surge (Section 179 + bonus depreciation deadlines). This is a *known future spike* in demand — a timing signal hiding in the calendar, almost certainly not modeled. Cheap, deterministic, high-leverage for J2.

3. **Regulatory-mandate replacement waves.** Emissions rules (e.g., CARB truck mandates), ELD, safety mandates *force* fleet replacement on known timelines → deterministic future financing demand, EF-specific, and invisible to generic tools. A genuinely differentiated leading signal.

4. **Import / bill-of-lading data.** Companies importing machinery (ImportGenius/Panjiva-style customs data) → equipment physically arriving → financing need or a just-financed signal. Novel for EF; a leading-to-coincident tell most competitors ignore.

5. **Auction & secondary-market data (Ritchie Bros, IronPlanet, Purple Wave).** A company *dumping* fleet → either distress (risk flag) or refresh (re-buy signal). A **dual-polarity** signal — the same event means opposite things depending on context, which is exactly the kind of reasoning a fusion layer can own.

6. **M&A / PE-transaction feeds.** An acquisition → integration capex; a PE platform → roll-up capex mandate. New owner = new capital plan = financing pipeline. Strong, lender-native, and a *channel* (the sponsor relationship), not just a signal.

7. **Public-company capex guidance → private-supplier cascade** (PRD L4 made concrete). A public OEM guides "expanding capacity" → its private suppliers need capacity → equipment. The cascade is the premium, rare signal — and it's a *reasoning* asset, not a feed anyone sells.

8. **Catastrophe / weather data.** Floods, fires, storms destroy equipment → replacement-financing surges, geographically clustered and time-bounded. Event-driven demand almost nobody points at EF.

9. **Telematics — inverted for the lender (a future, not-now angle).** Filmore uses telematics for dealer service. A *lender* could use aggregated asset-usage telematics for **portfolio risk / early-default prediction** (is the financed asset actually being used?). Not a sourcing signal — a **servicing/relationship** data play that deepens the customer over time. Worth a placeholder; it's the one place Quintel might someday want the very data that is Filmore's moat, for a completely different job.

10. **Entity resolution is the real product, and the real constraint.** Every angle above is worthless until resolved to one canonical entity — and **each added source makes resolution harder, not easier.** The moat and the bottleneck are the same thing: the resolution + fusion + reasoning layer. Adding feeds without industrial-grade resolution manufactures noise. **This should govern sequencing more than any single feed's appeal.**

11. **Freshness as a spec, not an afterthought.** A leading signal delivered a week late is a coincident signal; delivered a month late, lagging. Every feed needs a **latency SLA** tied to the job it serves (a J1 permit feed must be near-real-time; a J3 firmographic can be monthly). Martin never mentioned latency — a gap in the intel *and* a discipline Quintel should adopt.

12. **The "negative space" of Filmore's about-page.** Their thesis — *"public data gets you started; the real advantage is the customer's private data (telematics)"* — is **structurally identical to Quintel's** (public base + private deal-history overlay). Filmore just proved the thesis in an adjacent market with real customers. **Read their moat claim as validation of Quintel's own architecture**, one seat over.

---

## 9. Data-model / schema implications

The good news: Quintel's **owner-tagged evidence graph ("share the evidence, privatize the score")** is general enough to hold *all* of the above — every external signal is `owner=public` evidence on a shared entity; own-book is `owner=P`. The schema is not the constraint. The work is:

- **A controlled event/signal taxonomy** with each event tagged by **job (J1–J5), time-signature, and polarity** (positive/negative/dual) — so the ranker knows what a signal is *for*, not just that it exists. (The PRD flags the "narrative-event taxonomy" as unmodeled; this extends it to structured signals too.)
- **Per-source ingestion adapters + entity-resolution keys** — the real build cost, and the scaling constraint (§8.10).
- **A freshness/latency field per source** tied to its job (§8.11).
- **A thin collateral/amount enrichment** on UCC (for J2/J3) — explicitly *not* the deep dealer-grade collateral feed.
- **An external-risk-evidence path into the boundary profile** (§8.1) — so risk data, not only internal declines, can down-rank.

---

## 10. Roadmap implications (recommended sequencing)

1. **Build the J1 leading-signal layer as a first-class priority, EF-specific first:** DOT lettings + FMCSA new authority + gov awards (USAspending, already live) + permits. Structured, cheap, defensible, and the actual sourcing edge. *(Re-weight against the PRD's L2-news-first ordering — news for density, leading signals for edge; sequence both, don't let news alone stand in for sourcing.)*
2. **Add the J3 credit/financial-health screen** — the purely-lender qualification layer that makes "in-box" mean *financeable*, and that doubles as risk (§8.1).
3. **Build the J4 competitive-lender map** from UCC secured-party data — high-value, uniquely lender-native, under-built.
4. **Exploit UCC for J2/J3/J4** (not J1): refi-timing (UCC-1 age + UCC-3 terminations), qualification, competitive map. Buy a **thin** enrichment tier.
5. **Instrument the deterministic timing signals** (Section 179 calendar, regulatory-mandate deadlines) — cheap, high-leverage, novel.
6. **Treat entity resolution + freshness as the governing constraints** on how fast feeds are added — not the appeal of any single feed.
7. **Hold the exotic leading signals** (imports, auctions, M&A, catastrophe, cascade) as differentiation depth, pulled in as resolution matures — the L3/L4 analogue.

---

## 11. Open questions

- **Filmore data economics:** exact vendors, what the ~$350k/yr actually covers, and the **latency** of their feeds (all unresolved from the call).
- **Build-vs-buy on UCC:** given UCC is J2/J3/J4-only for Quintel (not the sourcing edge), is even a *thin* licensed feed worth it vs. direct-from-state for the specific fields the three lender jobs need? (Cheaper than the fully-enriched dealer feed either way.)
- **Which leading feeds are genuinely EF-defensible** vs. commodity — DOT/FMCSA/awards look most defensible; permits are more contested (Shovels/Construction Monitor already sell them).
- **Does the ranker's boundary profile want external risk evidence in v1**, or is that a v2 enrichment? (§8.1)
- **Sequencing:** does promoting J1 leading signals ahead of L2 news change the demo story? (The demo needs *density*; leading signals may be sparser than news — so the demo and the ship may want different orderings.)

---

*Companion to the [[quintel-sourcing-intelligence-prd-2026-06-29|PRD]] (the value/architecture) and the [[quintel-competitive-landscape-research-2026-06-18|competitive landscape]] (the market). Opened up by the [[martin-roth|Filmore call]]. Suggested next step: reconcile §7's mis-prioritization finding and §10's sequencing against the PRD's L1–L4 market-intelligence plan and the engine build roadmap.*
