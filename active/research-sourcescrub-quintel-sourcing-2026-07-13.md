---
title: SourceScrub and What (Not) to Import Into Quintel's Sourcing Approach
date: 2026-07-13
status: draft
owner: Simon
depth: deep-dive
tags:
  - research
  - quintel
  - sourcing
  - competitive-intelligence
  - equipment-finance
related:
  - "[[quintel-sourcing-intelligence-prd-2026-06-29]]"
  - "[[research-private-credit-crm-category-2026-06-22]]"
  - "[[stauss-vfi-tokenrip-briefing]]"
  - "[[quintel-sourcing-signals-prd-2026-06-16]]"
---

# SourceScrub and What (Not) to Import Into Quintel's Sourcing Approach

## Executive Summary

SourceScrub is a universal private-company database and market-mapping platform for PE, investment banking, and corporate development — built to solve "find companies we don't know about yet." Quintel's sourcing problem, as scoped in its own PRD, is the inverse: ranking a lender's or broker's *existing* prospect list against their *own* funded-deal history. These are structurally different products solving different problems, and Quintel's PRD already correctly excludes SourceScrub's core category (universal company databases) as commodity infrastructure it should not build.

The useful signal from SourceScrub is not architectural — it is three UX patterns worth stealing for how Quintel presents its ranked output, plus a structural reason SourceScrub's owner (Datasite) is very unlikely to ever compete on Quintel's actual axis. Also material: SourceScrub was acquired by Datasite in August 2025 and folded into Grata; as a standalone brand it is effectively winding down, which should shape how it gets referenced (if at all) in a customer-facing conversation.

## Core Questions Explored

1. How does SourceScrub actually source and verify company data?
2. How do they structure market maps/taxonomies for a vertical, and what does scoring/shortlisting UX look like for PE/IB users?
3. What's their business model?
4. Which pieces map onto Quintel's customer-data-first ranking approach, and which are irrelevant because the underlying model is fundamentally different?

## Key Findings

### 1. SourceScrub's entire moat is a universal database — the opposite of Quintel's bet

SourceScrub indexes ~17 million private companies against 290,000+ sources (product reviews, trade shows, conference lists, portfolio lists, news), using a "human-in-the-loop" pipeline where AI does bulk classification and a research team manually verifies. [Sourcescrub: Deal Sourcing Platform Overview](https://www.sourcescrub.com/) The product exists to answer "what companies exist in this market that I haven't found yet" — market mapping "in minutes, not days" across 15M+ profiles. [How Modern Dealmakers Overcome Market Mapping Madness](https://www.sourcescrub.com/post/dealmakers-overcome-market-mapping)

Quintel's PRD frames this precise category — "the raw list... What the customer already does with Apollo/ZoomInfo/their CRM" — as rung 1 of the value ladder: commodity, explicitly not Quintel's job (`product/quintel/quintel-customer-data-first-prd-2026-06-29.md`). The PRD's own value proposition starts one rung up: not finding companies, but ranking a list the customer already has, using the one dataset SourceScrub structurally cannot access — the lender's own funded-deal history. There is no daylight between what SourceScrub sells and what Quintel has already decided not to build. This is confirmation, not new information — but it's confirmation worth having, because it was previously an assumption rather than a checked comparison.

### 2. SourceScrub's brand is dissolving into Grata under Datasite

Datasite acquired Grata earlier in 2025, then announced acquisition of SourceScrub in August 2025 with the explicit plan to merge SourceScrub's data into Grata. [Datasite to Acquire Sourcescrub](https://www.datasite.com/en/company/news/datasite-to-merge-sourcescrub-and-grata-expanding-private-market-intelligence-solutions) As of this research, sourcescrub.com's product pages 301-redirect to grata.com, and Grata's own marketing page carries a banner reading "Grata and Sourcescrub are joining forces to deliver the market's most complete private company intelligence." Grata and SourceScrub previously competed head-to-head in the lower-middle-market PE segment; both are now one Datasite-owned entity. [Grata vs Sourcescrub Detailed Comparison](https://otio.ai/blog/grata-vs-sourcescrub)

**Practical implication:** naming "SourceScrub" to a sophisticated buyer in 2026 reads as slightly dated — the live product is now "Grata" (Datasite). If SourceScrub comes up on a call, it's worth knowing this before the customer corrects you.

### 3. The closest analog to Quintel's ranking — custom lead scoring — still runs on the wrong data asset

SourceScrub lets users build rule-based, if/then custom scoring models against its universal database, tunable against "hundreds of signals," with the option to import CRM fields to refine the model. [Custom Company Scoring & Tracking](https://www.sourcescrub.com/use-cases/company-scoring) One customer case (LFM Capital) is marketed as building a custom lead-scoring model this way for add-on acquisition targets. [Lead Scoring Models for PE](https://www.sourcescrub.com/post/how-pe-can-leverage-lead-scoring-models)

This is architecturally the nearest thing SourceScrub has to Quintel's ranking engine — and it is still scoring against a scraped universal graph, with the customer's own CRM data used only as a *tuning input*, not the primary asset being ranked. Quintel inverts this: the customer's funded-deal history *is* the ranking model, and the prospect list being ranked is the customer's own, not a universal graph. No amount of tuning SourceScrub's model turns it into Quintel's model — the fundamentals differ, not just the polish.

### 4. Data-quality complaints validate the customer-data-first bet from the demand side

The top complaint across 56 G2 reviews is data inaccuracy (13 mentions) — stale financing data, contact bounces, and coverage gaps that vary by industry. [Sourcescrub Reviews 2026](https://www.g2.com/products/sourcescrub/reviews) This is a structural property of any universal scraped database: freshness and accuracy degrade at the edges of coverage, and equipment finance (a niche, non-VC-adjacent vertical) sits at exactly that edge — a pattern the vault's own EF customer interviews independently confirm (see Finding 6 below).

A ranking engine built on the lender's *own* funded-deal records has no equivalent failure mode — the underlying data can't be "stale" or "wrong" in the same sense, because it's the customer's own ground truth. This is evidence *for* Quintel's differentiation claim, not just a talking point invented internally.

### 5. Pricing confirms this is a PE/IB-scale enterprise tool, not adjacent to EF broker budgets

SourceScrub runs $20K–$60K/year depending on tier and add-ons, with no public pricing (three tiers — Discovery Essentials, Sourcing Plus, Winning Professional — all "request pricing"). [SourceScrub Pricing 2026](https://www.g2.com/products/sourcescrub/pricing) This is squarely a PE-fund-economics tool. It is not a signal about what an EF broker or lender would pay for a sourcing product, and shouldn't be used as a pricing anchor for Quintel.

### 6. Vault check: no EF customer currently uses (or has ever mentioned) SourceScrub, Grata, or PitchBook

Across the customer evidence in `bd/deals/equipment-finance/stauss-vfi-tokenrip-briefing.md` and the PRD's customer sketches:

- **Mike (36th Street):** put his box into Apollo, got ~3,500 leads, is manually calling down the list.
- **Katharine (Empire):** tracks ~2,000 companies in HubSpot; tools are Google Alerts, ZoomInfo ("doesn't really do a ton more than a big public press release my Google alert could tell me"), personal ChatGPT, Excel. Explicitly wants "an intelligence layer over HubSpot, not a new CRM."
- **Stauss (VFI):** ~90% of deals arrive via email referral/OEM relationships; runs on ZoomInfo, called "parity, as predicted" in the briefing's own conclusion — the edge is "mining free public event/timing sources for EF," not better contact data.

SourceScrub is mentioned exactly once anywhere in the vault (`intelligence/research/quintel/research-private-credit-crm-category-2026-06-22.md`), listed as a Tier-2 "important integration" for private-credit CRMs generally — never evaluated as a direct competitor to Quintel. **No EF buyer has this tool in their current mental model of "sourcing."** Importing its vocabulary or comparisons risks importing a PE-buyer's frame of reference that doesn't match how EF brokers actually talk about their own problem.

## Strategic Analysis

### 1st Order Effects

- SourceScrub confirms, rather than changes, Quintel's existing scoping decision to treat universal company databases as commodity and stay out of that business.
- SourceScrub's brand consolidation into Grata means any "vs. SourceScrub" competitive material would already be stale on arrival.
- The G2 data-accuracy complaints give Quintel an external, third-party-sourced argument for why "your own deal history" beats "a universal database" on trust — usable in a discovery call without sounding self-serving.

### 2nd Order Effects

- If Datasite/Grata ever decided to compete on Quintel's exact axis (rank-my-own-list-by-my-own-history), they would need to build a customer-data ingestion and credit-memo-extraction pipeline from scratch — a different engineering problem than what their scraping infrastructure was built for, and a different sales motion (per-lender bespoke ingestion vs. universal-database subscription). This is a real moat, not just a positioning claim — but it rests on an assumption below that hasn't been stress-tested.
- Because no EF buyer currently associates "sourcing tool" with SourceScrub/Grata-style products, Quintel doesn't need to differentiate *against* them in a sales conversation — the more useful move is borrowing their better UX patterns silently, not naming them as a competitor at all.

### Section A: Three UX Patterns Worth Stealing

**A1. Tunable, transparent scoring — not a black-box rank.** SourceScrub's custom-scoring feature lets a user see and adjust the weight of individual signals feeding a company's score. Quintel's own differentiator language in the PRD ("fits Empire, sale-leaseback, ~X%, here's why") already commits to this same principle — a verdict with a visible reason, not a bare rank. The concrete product implication: each row in a ranked prospect list should expose *which* funded-deal patterns it matched (equipment type, structure, geography, deal size band) and let the operator see — even if not yet adjust — why that row outranked the one below it. This is the single most directly reusable pattern, because it's not borrowed from a foreign category; it's validation that the direction Quintel already committed to is the right one.

**A2. Screen → summarize → draft-next-action, not just a ranked list.** SourceScrub's SourcingGPT takes a company record and drafts a summary plus an outreach email in the same interaction — collapsing "here's a scored prospect" into "here's the thing to send." [How Dealmakers Use AI for Deal Sourcing](https://www.sourcescrub.com/post/sourcing-gpt) For Quintel, the analog is a ranked row that also drafts the first call/email talking point ("this fits your book because — reference deal X, Y, Z"), which turns triage into action without a second tool. Given Katharine's actual pain is manual triage-then-outreach across ~2,000 tracked companies, this closes the loop she's already described wanting closed.

**A3. Bi-directional CRM writeback.** SourceScrub enriches and writes scores back into CRMs (Salesforce, DealCloud) rather than requiring the user to work inside SourceScrub. [Buyer's Guide: Salesforce M&A Integrations](https://www.sourcescrub.com/post/buyers-guide-salesforce-m-a) Katharine's own stated ask — "an intelligence layer over HubSpot, not a new CRM" — is close to verbatim validation of this exact pattern. This is worth treating as a near-term v1/v2 requirement, not a nice-to-have: a customer has already asked for it independent of this research.

### Section B: Why This Isn't a Competitive Threat (With the Load-Bearing Assumption Named)

The claim that Datasite/Grata "won't move onto Quintel's axis" rests on one assumption: that ranking-by-own-deal-history requires customer-specific data ingestion (credit memos, CRM exports) that doesn't fit their scale-via-universal-database business model. This is **inferred from their current product architecture and GTM motion, not confirmed by anything Datasite/Grata has said about equipment finance or customer-data ingestion.** Confidence: moderate-high — the architectural mismatch is real and visible in their own marketing (everything is framed around the shared 17M-company graph, nothing around per-customer proprietary data ingestion) — but it is not the same as having asked them, and a large, well-capitalized platform pivoting into an adjacent workflow is not unprecedented.

There's no near-term event that will resolve this on its own — unlike a live customer call, nothing forces this open question closed by a specific date. The practical takeaway is not to build extra defensibility material against a threat that may not materialize, but to note it as a watch item: if a data-driven EF vertical entrant (SourceScrub/Grata, or someone else) starts talking about proprietary credit-memo ingestion, that's the signal to revisit this assumption.

## Vault Connections

- [[quintel-sourcing-intelligence-prd-2026-06-29]] — the PRD whose value-ladder framing this research validates
- [[research-private-credit-crm-category-2026-06-22]] — where SourceScrub was previously mentioned in passing, as a Tier-2 CRM integration
- [[stauss-vfi-tokenrip-briefing]] — customer evidence on current EF sourcing tools (Apollo, ZoomInfo, HubSpot)
- [[quintel-sourcing-signals-prd-2026-06-16]] — earlier sourcing-signals design, already reasoning "Apollo/ZoomInfo/PitchBook = parity commodity, not the edge"

## Open Questions & Unknowns

1. Has Datasite/Grata said anything publicly about vertical expansion into EF, specialty finance, or proprietary-data ingestion? (Not found in this research — worth a light periodic check, not a dedicated workstream.)
2. Would Katharine's "intelligence layer over HubSpot" ask, if built as CRM writeback, need to support DealCloud/Salesforce/other CRMs beyond HubSpot for other prospects in the pipeline? Not yet confirmed.
3. Is the tunable-scoring UI (A1) something to expose to operators in v1, or held back as a v2 trust-building feature once the ranking itself is validated? This is a scoping call, not a research question — flagging so it doesn't get silently decided by omission.

## Recommended Next Steps

1. **Do not build a SourceScrub/Grata comparison into external sales material.** No EF buyer has this in their frame of reference; naming it would import a category confusion, not clarity.
2. **Do treat A1 (visible scoring reasons) as already-decided direction, not a new idea** — it matches the PRD's existing "here's why" commitment. The action item is making sure the current v1 build actually surfaces this per-row, not just as an aggregate score.
3. **Elevate A3 (CRM writeback) to an explicit v1/v2 requirement**, since Katharine already asked for it directly — this is customer evidence, not speculation, and shouldn't wait for a dedicated research pass to be acted on.
4. **A2 (draft next-action per ranked row)** is worth scoping as a fast-follow once the core ranking is validated with a live customer — it's high-leverage but adds a generation step that shouldn't block the pilot metric.

## Sources

- [Sourcescrub: Deal Sourcing Platform Overview](https://www.sourcescrub.com/)
- [How Modern Dealmakers Overcome Market Mapping Madness](https://www.sourcescrub.com/post/dealmakers-overcome-market-mapping)
- [Datasite to Acquire Sourcescrub, Expanding Private Market Intelligence Solutions](https://www.datasite.com/en/company/news/datasite-to-merge-sourcescrub-and-grata-expanding-private-market-intelligence-solutions)
- [Grata vs Sourcescrub Detailed Comparison — Otio Blog](https://otio.ai/blog/grata-vs-sourcescrub)
- [Custom Company Scoring & Tracking](https://www.sourcescrub.com/use-cases/company-scoring)
- [Lead Scoring Models for PE](https://www.sourcescrub.com/post/how-pe-can-leverage-lead-scoring-models)
- [Sourcescrub Reviews 2026 — G2](https://www.g2.com/products/sourcescrub/reviews)
- [Sourcescrub Pricing 2026 — G2](https://www.g2.com/products/sourcescrub/pricing)
- [How Dealmakers Use AI for Deal Sourcing (SourcingGPT)](https://www.sourcescrub.com/post/sourcing-gpt)
- [Buyer's Guide: Salesforce M&A Integrations](https://www.sourcescrub.com/post/buyers-guide-salesforce-m-a)
- Internal: `product/quintel/quintel-customer-data-first-prd-2026-06-29.md`, `intelligence/research/quintel/research-private-credit-crm-category-2026-06-22.md`, `bd/deals/equipment-finance/stauss-vfi-tokenrip-briefing.md`, `product/quintel/engineering/quintel-sourcing-signals-prd-2026-06-16.md`

---

## Tags
#quintel #sourcing #competitive-intelligence #equipment-finance #vertical/quintel
