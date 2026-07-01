---
title: "Quintel — Signal Backtesting: Proving Sourcing Before Selling It"
status: draft
owner: Simon
type: product-requirements
product: Quintel
created: 2026-06-22
audience: Engineering team (Simon + contractors)
---

# Quintel — Signal Backtesting: Proving Sourcing Before Selling It

> **What this is.** A product requirements document for a *signal backtesting exercise* — the work required to prove that Quintel's sourcing engine produces valuable, non-obvious intelligence before live deal outcomes exist to validate it. The exercise simultaneously calibrates the engine's signal-scoring model and produces demo-ready case studies for the first lender customer.
>
> **Why now.** Empire Asset Finance (the strongest lender prospect in the pipeline) validated sourcing pain on 2026-06-18 and is circulating materials internally for a team call with their CEO and CCO. The team call requires concrete proof that the sourcing engine surfaces actionable intelligence the customer wouldn't find on their own. That proof doesn't exist yet. This exercise creates it.
>
> **What comes out the other end.** (1) 3–5 demo-ready case studies showing deals the engine would have flagged before they became public knowledge. (2) A calibrated signal-scoring model that distinguishes high-value multi-signal inference from commodity first-order alerts. (3) A repeatable methodology that generalizes to any lender's buy box.

---

## 1. The sourcing proof problem

Quintel's sourcing engine is the product's competitive wedge — no competitor offers equipment-finance-specific deal-flow intelligence scored to a lender's buy box. It is also the weakest part of the hand to prove: the engine is specced, the data sources are identified (EDGAR 8-K, USAspending, UCC, sponsor activity, regulatory triggers), the architecture is designed — but none of it has been validated against real-world outcomes.

The core challenge: **how do you prove sourcing value without a feedback loop from deal outcomes?**

Two perspectives emerged:

**The feedback-loop concern.** Sourcing requires a closed loop — signals fire, someone calls the lead, the lead either converts to a conversation or doesn't, and that outcome trains the model. Without that loop, the engine can surface "signals" indefinitely with no way to know if they're actionable. The risk: building and selling a product whose core value proposition is unproven. The pragmatic hedge: bundle sourcing with underwriting (a known, deliverable capability), so if sourcing underdelivers, underwriting carries the price justification.

**The lead-gen reframe.** The bar for "valuable signal" is not "did this close a deal." It is: **"did this surface actionable intelligence the customer wouldn't have found through their existing workflow?"** That is a testable proposition — it requires comparing the engine's output against what Google alerts, ZoomInfo, and a personal ChatGPT would surface for the same companies. If the engine catches something those tools miss, the signal has value regardless of whether the lead converts.

Both perspectives are correct. The hedge (bundle with underwriting) is the right sales strategy. The reframe (test against existing workflow, not deal outcomes) is the right engineering strategy. **This exercise executes the engineering strategy: find closed deals, reverse-engineer the public signals that preceded them, and evaluate whether the sourcing engine would have caught them before the customer's existing tools did.**

### Deterministic vs. non-deterministic signals — where the real value lives

A critical distinction emerged that shapes the entire exercise:

**First-order (deterministic) signals** are events that show up everywhere: a company raises $100M, announces a data-center build, wins a federal contract. Every lead-gen tool — Apollo, ZoomInfo, Google alerts — surfaces these. They are commodity. A sourcing engine that only produces first-order signals is a worse Apollo with a higher price tag.

**Multi-signal inference (non-deterministic) signals** are conclusions pieced together from multiple data points: a company is hiring for three specific operational roles + a PE sponsor just acquired them + they filed a UCC that matures in 90 days → inference: they will need $15–30M in equipment financing within 6 months. No single data point tells that story. No existing tool assembles it. **This is the edge.** But it is also the hardest to prove and the hardest to calibrate — which is exactly why the backtesting exercise exists.

The exercise must evaluate both types, but the strategic priority is proving that the engine can produce non-deterministic signals — the second- and third-order inferences that a human analyst would need hours to assemble, if they thought to look at all.

---

## 2. Customer context: Empire Asset Finance

### The company

Empire Asset Finance is a direct, balance-sheet equipment lender — a wholly-owned subsidiary of Arena Investors, LP ($4.6B AUM multi-strategy investment firm) — launched September 2025 with a $100M capital commitment. Self-brands as "capital-efficient, technology-driven." Five core people. Writes $3M–$50M mid/large-ticket deals, terms to 7 years, up to 100% advance on new equipment. Structure-agnostic: capital leases, operating leases, loans, EFAs, first-amendment leases, sale-leasebacks. Target borrower: non-investment-grade middle market ($100M+ revenue, $10M+ EBITDA, audited/reviewed financials), often PE-sponsor-backed. Also runs a capital-markets desk that buys and sells syndicated deals (>$3M) with peer institutions.

### The champion: Katharine Rudzitis

VP, Direct Originations. ~10 years at Macquarie Group in asset/equipment finance (manufacturing, industrial, commodity, technology). Hired April 2026 to build Empire's direct-origination function and tap her PE-sponsor and borrower relationships. Sharp, analytical, institutional pedigree.

### Katharine's current workflow (validated on 2026-06-18 call)

Katharine monitors a prospect universe of ~2,000 companies in HubSpot. Her daily job is triage: filter by priority/relevance → outreach → deal structuring. Her monitoring stack:

- **Google alerts** — press-release-level news. Catches major events; misses everything below the headline threshold.
- **ZoomInfo** — contact data and company updates. Her assessment: *"Doesn't really do a ton more than a big public press release my Google alert could tell me."*
- **Personal ChatGPT/GPT** — a custom "prospecting GPT" she built herself. She copy-pastes company information into a ChatGPT chat to screen and tier companies (hard assets? EBITDA range? PE-backed? priority tier?). Manual, one-at-a-time, no integration with HubSpot, no persistence, no monitoring.
- **No unified system** — each team member improvises independently.

The gap is explicit: no proactive signal layer. She finds out about deals after they're public knowledge. The monitoring is manual, reactive, and one-company-at-a-time.

### What she asked for (verbatim from the call)

> *"My ideal scenario: you scrub our tier ones and if something relevant comes up, you tell us. And if there's something similar but not in HubSpot, you add it."*

> *"For monitoring stuff, for adding new companies, it's not something I want to have to do by hand."*

> *"HubSpot is fine for a CRM, but it's just not fine with that more proactive stuff."*

> *"This is the kind of thing that has been missing. I feel like there's definitely the private credit CRMs out there, but this is what I want. I don't need a new HubSpot. I need this."*

### Competitive context

Empire evaluated **Affinity** (relationship-intelligence CRM, auto-captures email/calendar, $2–3K/user/year) and **Meridian AI** (AI-native private-markets CRM, 26M company profiles, $7M seed from 645 Ventures). Both are private-capital CRMs that pull in better signals than HubSpot. Empire decided against switching — the CRM function works fine in HubSpot; the gap is the proactive intelligence/monitoring layer, not the CRM. Neither Affinity nor Meridian targets equipment finance specifically; neither offers buy-box-scored deal flow.

Empire also uses **F2** for underwriting, which is currently degrading (*"changed one of its models and it seems to be working less well now"*), opening underwriting as a second vector.

### Empire's buy box (the backtesting target)

| Parameter | Value |
|---|---|
| Ticket size | $3M–$50M |
| Term | Up to 7 years |
| Advance rate | Up to 100% on new equipment |
| Borrower profile | Non-investment-grade middle market, $100M+ revenue, $10M+ EBITDA |
| Ownership | Often PE-sponsor-backed |
| Structures | Capital lease, operating lease, loan, EFA, first-amendment lease, sale-leaseback |
| Sectors | Manufacturing/automation, energy, food & beverage, healthcare, mining, transportation, marine, waste, warehousing, IT |
| Origination split | ~50% direct (sponsor-backed manufacturing, Katharine's domain), ~50% indirect (syndication market) |

### What this means for the backtesting exercise

The exercise should find closed equipment-financing deals that match this box — PE-backed mid-market manufacturing companies in these sectors, at this ticket size — and reverse-engineer the public signals that preceded them. The output must demonstrate that the engine would have flagged these companies *before* the deal became known, using signals Katharine would not have caught through Google alerts, ZoomInfo, or a ChatGPT chat.

---

## 3. The approach: signal archaeology

### The method

The backtesting exercise works backwards from known outcomes to discover what the signal chain looked like before the deal closed. This is standard practice for any analytics/intelligence product launch — "if our engine had been running six months ago, here's what it would have flagged."

**Step 1: Identify closed equipment-financing deals.** Find 10–20 equipment financing transactions that closed in the past 6–12 months, within Empire's box parameters. Sources for identifying closed deals:

- **UCC filings** — the definitive record. A UCC-1 filing names the secured party (lender), debtor (borrower), and collateral (equipment). Filed at the state Secretary of State. Searching by secured party (known EF lenders) or by NAICS/sector + filing date produces a list of deals that actually closed.
- **EDGAR filings** — 8-K material agreements and 10-K/10-Q capex disclosures. Public companies that financed equipment show up here. More importantly, their *private counterparties* (the actual borrowers/equipment suppliers) are often named.
- **Trade press** — Monitor, ABL Advisor, Equipment Finance News, ELFA reports. Deals are sometimes announced or referenced.
- **USAspending** — federal awards that led to equipment purchases downstream.

**Step 2: Reverse-engineer the signal chain.** For each identified deal, go back 1–6 months before closing and catalog every public signal that existed:

- Were there EDGAR filings (8-K material agreements, capex disclosures) from the borrower or related parties?
- Were there UCC filings that signaled a refi window (existing lien maturing)?
- Did the company win a federal award (USAspending) that implied equipment needs?
- Was there PE-sponsor activity (acquisition, executive hire, portfolio restructuring)?
- Were there regulatory forcing functions (EPA 2027, SHIPS Act, §168(n)) relevant to the borrower's sector?
- Were there hiring patterns, press releases, or trade-publication mentions that preceded the deal?
- What was the macro context (capacity utilization, industrial production, capex orders)?

**Step 3: Evaluate signal quality.** For each signal chain, apply the two-axis framework:

1. **Box match** — Does this signal point to a company/situation that fits Empire's buy box? Score: in-box / open-to-band / out.
2. **Discovery difficulty** — Would Katharine have found this signal through her existing workflow (Google alerts + ZoomInfo + ChatGPT)? Score: commodity (she would have found it) / non-obvious (she probably wouldn't have) / hidden (she definitely wouldn't have without this engine).

Signals that score "in-box + hidden" are the highest value. Signals that score "in-box + commodity" are necessary but not differentiating. The exercise should surface both, but the case studies that go into the demo must feature "hidden" signals.

**Step 4: Calibrate the scoring model.** Use the backtested results to calibrate the existing signal-scoring and banding framework:

- **Tier discipline** — Tier 1 (EDGAR, USAspending, UCC, FRED, sponsor filings — verifiable, citable as fact), Tier 2 (IR/press/LinkedIn/trade — real, needs corroboration), Tier 3 (forums/rumor — lead-only, never cited as fact).
- **Banding** — Hot (Tier 1 + high urgency + corroborated), Warm (Tier 1 single-source or Tier 2 corroborated), Watch (needs corroboration), Filed (Tier 3 uncorroborated / out-of-box).
- **Scoring formula** — base(tier) + urgency + verification − age_decay → band. The backtesting exercise provides ground truth to weight these factors: which combinations of signals actually preceded real deals?

**Step 5: Package into demo-ready case studies.** For the 3–5 strongest results, build a narrative:

- "This deal closed in [month]. Our engine would have flagged [company] in [month − 2–3 months] based on [signal 1] + [signal 2] + [signal 3]. Here's the signal chain. Here's how it scored against Empire's box. Here's what Google alerts and ZoomInfo would have shown you at the same time — and here's what they would have missed."

These case studies become the proof material for the Empire team call.

### Why this works even without a feedback loop

The backtesting exercise doesn't require anyone to make calls or close deals. It uses historical data as ground truth: deals that *actually closed* serve as the positive label. The question isn't "would this signal have converted?" (unknowable without calling) — it's "would this signal have surfaced an opportunity that turned out to be real?" The deal closing is the proof that the opportunity was real.

This sidesteps the feedback-loop problem entirely for the purpose of proof and calibration. The live feedback loop (signals → calls → outcomes → model improvement) is still needed for long-term engine improvement, but the backtesting exercise bootstraps the scoring model to a defensible starting point without it.

---

## 4. Signal quality framework

### The two-axis evaluation

Every backtested signal is evaluated on two dimensions:

**Axis 1: Box match.** Does the signal point to a company and situation that fits Empire's buy box?

| Score | Meaning |
|---|---|
| **In-box** | Company fits borrower profile, ticket size is in range, equipment type matches, structure is feasible |
| **Open-to-band** | Near-miss — ticket slightly outside range, borrower profile marginal, structure would need creativity (e.g., sale-leaseback on existing equipment) |
| **Out** | Doesn't fit. Software company, too small, wrong sector, no hard asset |

**Axis 2: Discovery difficulty.** Would Katharine have found this through her existing tools?

| Score | Meaning | Example |
|---|---|---|
| **Commodity** | Google alert or ZoomInfo would have caught it | Major press release, public funding announcement |
| **Non-obvious** | Findable with effort, but not surfaced proactively | An 8-K filing naming a private counterparty; a UCC maturity window; a pattern across multiple small signals |
| **Hidden** | Requires multi-signal inference; no single tool catches it | PE sponsor acquired company 6 months ago + new COO hired 3 months ago + NAICS matches Empire's sectors + UCC on existing equipment matures in 90 days → equipment financing need |

**The value matrix:**

|  | Commodity | Non-obvious | Hidden |
|---|---|---|---|
| **In-box** | Table stakes (include but don't lead with) | Strong value | **Case-study material** |
| **Open-to-band** | Noise | Moderate value | Strong value |
| **Out** | Discard | Discard | Discard |

### Deterministic vs. non-deterministic signal spectrum

| Order | Description | Example | Value | Existing tools catch it? |
|---|---|---|---|---|
| **1st order** | Direct, single-source, public event | "Company X raised $100M" | Low — everyone sees it | Yes |
| **2nd order** | One inference step from a public event | "Company X raised $100M → they'll build data centers → they need cooling equipment" | Medium — obvious to a domain expert | Sometimes |
| **3rd order** | Multi-signal inference across sources | "Company X raised $100M + hired VP Data Center Ops + filed interconnection application + PE sponsor's last 3 acquisitions all expanded equipment within 18 months → $15–25M equipment financing need in the cooling/power phases within 6 months" | **High — this is the edge** | No |

The backtesting exercise must consciously seek out and document 3rd-order inferences. If the exercise only produces 1st-order signals, it has failed — it has proven the engine is Apollo, not that it's better than Apollo.

### Tier discipline

The backtesting exercise uses a three-tier source-credibility framework. Every signal in a backtested case study must be tagged:

- **Tier 1** — EDGAR, USAspending, UCC, FRED, sponsor filings. Verifiable, citable as fact.
- **Tier 2** — IR/press/LinkedIn/trade publications. Real, needs corroboration.
- **Tier 3** — Forums/rumor. Lead-only, never cited as fact. Only promotes on Tier 1 corroboration.

A backtested case study built entirely on Tier 1 sources is maximally credible. A case study that requires Tier 2 is still strong if corroborated. A case study that depends on Tier 3 is not demo-ready.

---

## 5. Data sources available for the backtesting exercise

The backtesting exercise uses the data sources below. The difference from live monitoring is that it searches *backwards in time* rather than forward — endpoints and access notes are inlined here so the exercise can be run without any other reference.

| Source | What it provides for backtesting | Access | Cost |
|---|---|---|---|
| **EDGAR 8-K** (full-text search) | Material agreements naming private counterparties; acquisition disclosures; capex language in MD&A | `https://efts.sec.gov/LATEST/search-index` — free, no API key; requires descriptive User-Agent header | Free |
| **USAspending** | Federal awards to private contractors in EF-relevant sectors | `POST https://api.usaspending.gov/api/v2/search/spending_by_award/` — free, no auth | Free |
| **UCC filings** | Closed deals (secured party + debtor + collateral); lien maturity windows | State Secretary of State portals — per-debtor lookups; some require accounts/fees; no free unified API | Free–low per lookup; national aggregator is paid |
| **FRED** | Macro context (capex orders, capacity utilization, industrial production) | `https://fred.stlouisfed.org/graph/fredgraph.csv?id=<SERIES>` — free, no key | Free |
| **Regulatory triggers** | Sector-specific demand drivers — e.g. EPA 2027 emissions rules (transportation/fleet), SHIPS Act 2025 (marine/shipbuilding), OBBBA §168(n) bonus-depreciation (broad capex pull-forward) | Maintain a small curated lookup table mapping each regulation → affected sectors → expected equipment demand and timing | Free (curated manually) |
| **Trade press** | Deal announcements, market activity, named transactions | Monitor, ABL Advisor, Equipment Finance News, ELFA reports | Mostly free / subscription |
| **Sponsor IR/press** | PE acquisitions, portfolio company news, executive hires | Sponsor websites, press releases, EDGAR 8-K Item 2.01 | Free |
| **LinkedIn** (ToS-aware) | Executive hires at portfolio companies (COO/VP-Ops as capex precursors) | Compliant data provider required for bulk; manual lookup for targeted | Free–low for targeted |

### What the backtesting exercise does NOT require

- **PitchBook** — useful for sponsor deal/portfolio data, but the backtesting exercise can use free EDGAR + press as proxies. PitchBook integration is a roadmap decision, not a prerequisite.
- **National UCC aggregator** — useful for bulk monitoring, but targeted state-level lookups are sufficient for 10–20 deals.
- **Live sweep infrastructure** — the exercise is a one-time historical analysis, not a real-time monitoring system.

---

## 6. Deliverables

### 6.1 Demo-ready case studies (3–5)

Each case study follows a standard format:

- **The deal that closed.** Company name (or anonymized), sector, deal size, structure, lender, closing date.
- **The signal chain.** Every public signal that existed 1–6 months before closing, with tier tag, source, and date. Ordered chronologically to show how the picture assembled over time.
- **The inference.** The non-obvious conclusion: what these signals, taken together, would have told a lender about an upcoming equipment-financing need.
- **Box-fit score.** How the deal maps to Empire's buy box — in-box / open-to-band, with indicative structure and reasons.
- **The discovery-difficulty comparison.** What Google alerts and ZoomInfo would have shown at the same time, and what they would have missed. This is the "so what" — the concrete proof of value-add.

Case studies must feature at least 2nd-order and ideally 3rd-order inferences. A case study built entirely on 1st-order signals (press releases, public funding announcements) is not demo-ready — it proves the engine is Apollo.

### 6.2 Calibrated signal-scoring model

The backtesting exercise produces empirical data on which signal combinations preceded real deals. This data calibrates the scoring formula:

- **Which sources produced the highest-value signals?** (Informs source prioritization for live deployment.)
- **What signal combinations correlated with real deals?** (Informs the inference logic.)
- **What was the typical lead time?** (How far before the deal closed did the earliest signal appear? This determines the "window of advantage.")
- **Which signals were commodity vs. hidden?** (Informs the discovery-difficulty weighting in the scoring model.)

Output: an updated scoring rubric with empirical weights, documented against the backtested cases.

### 6.3 Repeatable methodology

The backtesting exercise should produce a documented method that can be re-run against any lender's buy box:

1. Input a lender's box parameters (ticket size, sectors, borrower profile, structures).
2. Search for closed deals matching those parameters.
3. Reverse-engineer the signal chain.
4. Evaluate signal quality (box match + discovery difficulty).
5. Package into case studies.

This methodology generalizes to future lender prospects beyond Empire.

### 6.4 Gap analysis

The exercise will inevitably reveal signals that *should* have been available but weren't — data sources that would have added value but aren't yet integrated, or inference steps that require data the engine doesn't currently access. Document these gaps explicitly. They become the input to the paid-source investment decision (PitchBook, national UCC aggregator, compliant LinkedIn provider).

---

## 7. Success criteria

| Criterion | Measure |
|---|---|
| **Proof material for Empire team call** | At least 3 case studies where the engine would have flagged a deal 60+ days before it became publicly known, using signals Katharine's current tools would have missed |
| **Signal-scoring calibration** | Scoring model updated with empirical weights from backtested data; at least one non-deterministic (3rd-order) inference pattern validated |
| **Methodology repeatability** | The backtesting method can be described in under one page and re-run against a different lender's box in under one day of engineering time |
| **Identified gaps** | At least 3 specific data-source gaps documented, with cost/benefit assessment for each |

---

## 8. What this exercise does NOT cover

- **Implementation details** — how to build the backtesting pipeline, what tools/languages/infrastructure to use. Left to engineering.
- **Live sourcing infrastructure** — this exercise is a one-time historical analysis. Deploying a real-time signal-monitoring system is a separate, larger scope.
- **HubSpot integration** — Katharine's requirement for two-way sync is a product feature, not part of the backtesting exercise.
- **Underwriting** — the backtesting exercise is sourcing-only. The underwriting capability is a separate, proven workstream.
- **The deal-graph feedback loop** — the long-term moat (outcomes re-weight signal scoring) requires live customer usage. The backtesting exercise bootstraps the model; the feedback loop refines it.

---

## 9. Strategic context: why sourcing is the wedge for lenders

For broker buyers, the wedge product is pre-qualification, not sourcing: brokers receive deals from dealers and referrals; their pain is screening junk, not finding deals.

But the Empire call revealed that **sourcing is the wedge for direct lenders.** Katharine's job IS sourcing — she hunts for deals among ~2,000 prospect companies. Pre-qualification is a secondary need (the credit team handles it via F2). The sourcing product maps directly to her daily workflow and her existential pressure.

This does not invalidate the broker-first approach. It means the product has two wedge surfaces:

| Buyer type | Wedge | Secondary sell |
|---|---|---|
| Broker | Pre-qualification + match (screen junk, route to the right lender) | Sourcing (upsell once inside) |
| Direct lender | Sourcing (intelligence layer on deal flow, scored to the box) | Underwriting (replace degrading tools like F2) |

The backtesting exercise proves the lender wedge — the one that's harder to demonstrate but potentially higher-value ($10K+/month vs. $2.5K/month for a broker seat).

### Why the hedge matters

Even with backtesting proof, sourcing carries inherent uncertainty in the early months. The signals may be directionally correct but require refinement. The prudent sales strategy for Empire: **sell underwriting + sourcing as a bundle.** Underwriting is a proven, deliverable capability (replacing a degrading F2). If sourcing takes 3–6 months to reach full value, underwriting carries the revenue justification. As the sourcing engine improves with usage data and the feedback loop closes, sourcing transitions from "included" to "the reason they stay."

This bundle pricing also passes the competitive-displacement test: Empire currently pays ~$10K/month for F2 (underwriting only). Quintel at $10K/month for underwriting + sourcing + intelligence is a clear value upgrade.

---

## 10. Appendix: key quotes from the Empire call (2026-06-18)

These quotes ground the entire exercise in validated customer language, captured from the Empire discovery call on 2026-06-18.

**On the intelligence gap:**
> *"ZoomInfo will pick up there's a new CEO — it doesn't really do a ton more than a big public press release that my Google alert could tell me."*

**On what she wants:**
> *"My ideal scenario: you scrub our tier ones and if something relevant comes up, you tell us. And if there's something similar but not in HubSpot, you add it."*

**On proactive monitoring:**
> *"For monitoring stuff, for adding new companies, it's not something I want to have to do by hand."*

**On the product category:**
> *"HubSpot is fine for a CRM, but it's just not fine with that more proactive stuff."*

> *"This gives us that intelligence layer that's been missing."*

> *"I feel like there's definitely the private credit CRMs out there, but this is what I want. I don't need a new HubSpot. I need this."*

**On the sourcing vs. underwriting split:**
> *"The signaling part I think is very interesting. The underwrite part, I don't know how interesting it is."*

**On running a real deal through the system:**
> *"The 'run a real deal' thing on a prior transaction. If I get an old credit file, that would be something to mock up."*

**On distribution:**
> *"Talk to everyone who's an ELFA member because this is relevant."*

---

*This document is self-contained. Everything required to run the backtesting exercise — the method, the data sources with endpoints, the signal-quality framework, and the deliverables — is specified above.*
