---
title: Quintel — Competitive Landscape Research & Full-Stack Blueprint Analysis
status: active
owner: Simon
type: competitive-research
product: Quintel
created: 2026-06-18
source_material: >
  Alek's competitive brief (tokenrip.com/s/bf608197), Alek's full-stack blueprint
  (tokenrip.com/s/6ce8bf75), SharpEi web research, Empire/Katharine call (2026-06-18),
  prior vault competitive analysis (intelligence/research/quintel/)
related:
  - product/quintel/quintel-build-and-gtm-roadmap-2026-06-08.md
  - product/quintel/quintel-engine-build-roadmap-2026-06-09.md
  - product/quintel/quintel-lender-build-roadmap-2026-06-10.md
  - product/quintel/ef-product-spec-2026-06-02/SPEC.md
  - intelligence/research/quintel/ai-document-workflow-competitive-landscape-2026-04-30.md
  - intelligence/research/quintel/research-f2-ai-private-markets-2026-06-18.md
  - bd/calls/contacts/katharine-rudzitis.md
  - bd/calls/transcripts/katharine-rudzitis-2026-06-18.md
---

# Quintel — Competitive Landscape Research & Full-Stack Blueprint Analysis

> **What this is:** a consolidated research doc from the 2026-06-18 competitive sweep Alek ran (20+ players across four workstreams), supplemented by SharpEi research, a strategic analysis of Alek's full-stack EF product blueprint, and a critical correction from the Empire Asset Finance first call (Katharine Rudzitis, 2026-06-18) — all mapped against Quintel's current architecture and build roadmap.

---

## 1. Bottom Line Up Front

The competitive field has two open positions — one per buyer type — and one closed door.

**Closed door:**
- **Underwriting software has caught up.** Document-to-credit-memo is a converged, well-funded category. Kaaj ($3.8M seed) is already inside Quintel's target accounts. Uptiq ($70M raised) has the broadest EF agent suite. "Examiner-ready audit trail" is now table-stakes marketing language. Leading with "AI credit memo" against these natives is choosing the weakest ground.

**Open position 1 — broker side: placement and credit appetite.** Which lender actually funds which profile, how fast, at what terms. Every tool in this landscape is single-tenant. Nobody holds the cross-market funded-outcome record. This is structurally barred to the incumbents and the funded startups. Quintel's `match` hand + `capture` stage + deal-graph is the architecture that fills this gap. The competitive brief's original conclusion, and it holds.

**Open position 2 — lender side: signal monitoring on a known universe.** The competitive brief's critique of sourcing was correct for small-ticket brokers (where sourcing is relationship-driven) but analyzed the wrong buyer. For mid/large-ticket direct lenders like Empire Asset Finance ($5–50M deals, PE-sponsor-backed), the pain is not "find me new companies" — it's "I have 2,000 companies; tell me WHEN to call." The competitive field for this use case is **genuinely empty**: ZoomInfo is shallow ("doesn't do a ton more than a Google alert"), Affinity/Meridian were evaluated and rejected, and no AI underwriting tool (Kaaj, Uptiq, Aloan) has a sourcing component. The Empire first call (2026-06-18) produced the strongest first-call pull in the deal log — pricing asked unprompted, internal circulation volunteered, redacted deal offered — all on the sourcing surface, not underwriting. **Katharine's own words: "The underwrite part, I don't know how interesting it is. The signaling part I think is very interesting."**

> **Critical distinction:** "sourcing" means two different things for two different buyers. For small-ticket brokers, sourcing = lead generation from public data (commoditized, unownable). For mid/large-ticket direct lenders, sourcing = signal monitoring + scoring against the lender's box on an existing prospect universe (empty field, strong pull). The competitive brief was right about the first. It missed the second because it analyzed the wrong buyer.

**The two-wedge thesis:** broker-side pre-qual/match and lender-side sourcing/monitoring are different wedges for different buyers on the same engine. Both feed the deal-graph. A lender on the platform seeing signals eventually wants broker deal flow; a broker routing deals wants to know which lenders are hungry. The cross-org placement graph — the real moat — accumulates from both sides faster than either wedge alone.

---

## 2. The Threat Map

### Tier 1: Direct Threats (Same buyer, same pain)

#### Kaaj — **HIGH THREAT**
- **What:** "Underwriting OS for SMB lending." Turns messy borrower packages into scored, source-cited credit analysis via named agents (parse, KYB, bank-statement, credit, memo).
- **Funding:** $3.8M seed (Nov 2025, Kindred + Better Tomorrow).
- **Customers:** Amur Equipment Finance, Fundr, Quality Equipment Finance, Smarter Finance USA + ~12 more small lessors/brokers. SOC 2 Type II. Claims $5B+ in applications processed.
- **Deployment:** Anti-rip-and-replace, live in 2 weeks. Sits alongside existing LOS/CRM.
- **Pricing:** Est. $25K–$100K/yr.
- **Why it matters:** Already inside the exact accounts Quintel would prospect. Productizes the "decision-ready credit file into the lender's box" pitch at software speed/price.
- **What it lacks:** No `match` hand. No placement/routing. No cross-org outcome data. Single-tenant by design. **Kaaj makes the file; it doesn't tell you who funds it.**

#### Uptiq — **HIGH THREAT**
- **What:** Six EF-specific agents: intake, collateral/residual analysis, spreading, underwriting, credit memo, monitoring.
- **Funding:** $25M Series B (Feb 2026, led by Curql), ~$70M total.
- **Customers:** Marshall Capital Group; claims 140+ FIs (thin on named EF logos).
- **Deployment:** Strongest LOS-connector story (Jack Henry, FIS, Fiserv, Finastra, Salesforce, LTi, Solifi).
- **Pricing:** Est. $75K–$300K+/yr.
- **Why it matters:** Best-funded pure-play. Broadest EF agent suite. Positioned as "process more equipment deals without adding headcount."
- **What it lacks:** Same as Kaaj — no placement, no cross-org outcomes. Lender-side only.

#### Aloan — **MEDIUM THREAT** (positioning risk, unproven traction)
- **What:** AI commercial underwriting layer. Intake to spreading to risk flags to committee-ready memo to covenant monitoring.
- **Funding:** Unverified. Launched Mar 2026. Ex-FAANG team.
- **Customers:** None disclosed (anonymized reviews only).
- **Pricing:** Est. $40K–$120K/yr.
- **Why it matters:** Closest messaging mirror to Quintel — owns the "examiner-ready, every spread and risk flag traces back to its source document" language.
- **What it lacks:** No traction evidence. No EF-specific depth. No placement.

### Tier 2: Adjacent Threats

#### F2 (Vertical FS-AI) — **MEDIUM THREAT, LONG-TERM**
- **What:** AI underwriting platform for private credit funds and commercial banks. Ingest data room → extract/reconcile → compute metrics → benchmark → draft IC memo → audit-review.
- **Funding:** $24M ($10M spinout from Arc + $14M seed from HighlandX/NFX). Launched June 2026.
- **Customers:** Claims 100+ funds/banks.
- **Why it matters:** Nearly identical pipeline to Quintel's engine. Well-capitalized. Moving down-market. Already shipped three things Quintel claims as differentiators: token-efficiency, LLM-agnostic architecture, outcomes-data moat.
- **Why Quintel isn't immediately threatened:** F2 serves the investor/lender side (funds underwriting their own deals). Quintel serves the placement side (brokers matching to lenders). F2 has no lender-matching capability and no reason to build it.
- **The seam:** Quintel's defensible wedge is the `match` stage + placement outcomes data F2 has no incentive to build. But this is a time-boxed gap, not a permanent moat.
- **Full analysis:** `intelligence/research/quintel/research-f2-ai-private-markets-2026-06-18.md`

#### SharpEi — **LOW-MEDIUM THREAT**
- **What:** AI intake/origination automation for equipment lenders. Automates application intake, doc collection, data validation, credit file preparation. Claims to compress 8-10 day origination to <30 minutes.
- **Funding:** Unfunded (per Tracxn/Crunchbase). Founded 2023, San Mateo. Previously "Elaxtik."
- **Team:** Maria Azofra (CEO), Julián Azofra (CSO), Lucia Clifford.
- **Partnerships:** Partnered with Tamarack/Liventus (Mar 2026) for AI-powered origination — gives SharpEi distribution into Tamarack's existing EF customer base (NEC Financial Services, 360 Equipment Finance).
- **Pricing:** Unknown.
- **Why it matters:** If SharpEi + Liventus gets traction among small EF lenders, it could become the "good enough" intake layer that removes the pain Quintel's underwriting pitch addresses.
- **What it lacks:** Unfunded, small team. Lender-side only. Intake automation, not credit judgment. No placement/matching. Dependent on Tamarack/Liventus for distribution.

#### NETSOL Check AI — **LOW THREAT** (wrong ICP)
- Enterprise/up-market (auto OEMs and captives). Launched Oct 2025 with no named production customer. Gated to NETSOL's own platform. Not relevant to Quintel's small/mid-ticket broker ICP.

#### commerciallending.ai — **LOW THREAT** (real but shallow overlap, packaging leg only)
- **What:** Small-agency-built ops suite (Payoff Agent, Secure Portal, CertDesk, Doc Collection, Packet Builder) for the document-execution phase of a commercial/equipment-finance deal. Owned by Momentum Growth Partners (founder Patrick Hadley — experiential-marketing/lead-gen background, not a funded fintech founder).
- **Funding:** None disclosed. No customer logos, testimonials, or team-size signals anywhere on the site or the parent company site.
- **Pricing:** $699/mo (3 seats) + $25/user/mo — below even Tier 4's cheapest sourcing-tool band.
- **Where it touches Quintel:** Only the *packaging* leg (source → package → underwrite → deal creation). Its Packet Builder "assembles borrower and collateral documentation into organized packages rather than generating original analysis" (verbatim) — completeness-checking and lender-template formatting, explicitly stopping short of structured data extraction, financial spreading, or a 5-C's credit narrative. That analytical depth is exactly what `quintel-deal-packaging-framework-2026-07-05.md` scopes as Quintel's packaging differentiator.
- **Where it doesn't touch Quintel:** Zero sourcing/prospecting (confirmed on their own equipment-finance-broker page), zero market intelligence/ranking, zero underwriting/credit-decisioning ("stops before credit decision processes").
- **Sibling product to note:** SalesLeadAgent ($399/mo, same parent company) — generic firmographic outbound prospecting, a live instance of the commodity-prospecting trap the Quintel PRD (§3) explicitly rejects, not a competing mechanism.
- **Why it matters:** A cheap, real signal that "packaging pain" is monetizable at the shallow end — useful as an objection-handling anchor, and a reminder not to let Quintel's packaging feature regress to "screening depth" (§7 of the packaging framework), where it would look like this tool with a better UI.
- **Full analysis:** `active/research-commerciallending-ai-2026-07-06.md`

### Tier 3: Legacy LOS + AI Modules (The "Incumbent Brushoff")

For Quintel's actual buyer (small-ticket independents and small bank desks), the incumbent brushoff is almost entirely hollow today:

| LOS | AI Status | Reality |
|---|---|---|
| **Dominion / LeaseComplete** | Zero AI | Confirmed: rules-based decision trees, bureau pulls, workflow. No AI on product site. |
| **Soft4Leasing** | Zero purpose-built AI | Only "AI" is inherited generic Microsoft Copilot for Business Central. |
| **LTi / ASPIRE** | No shipping AI | Rules/scorecards only. AI is new PE owner's (Diversis, closed Mar 2026) *stated future plan*. |
| **Linedata Ekip360** | Thin | "Digital Assistant" = next-action autocomplete. Real GenAI is internal-only. |
| **TurnKey Lender** | Real ML (exception) | Genuinely real auto-scoring (<30s). But volume auto-decisioning, not credit-file assembly. GenAI layer is just a doc-explainer + email writer. |

Deep-AI claims cluster at the enterprise top where the ICP isn't a customer:

| Enterprise LOS | AI Claim | Reality |
|---|---|---|
| **Solifi** | "AI-native" transition | Self-rates at Level 3 of 5. AgentCore agent orchestration not reached. Only shipped AI: Document Intelligence (Mar 2026, one named customer: Sonata Bank). |
| **NETSOL Check AI** | AI credit decisioning | Launched Oct 2025, no named production customer. Future-tense on earnings call. |
| **Odessa** | AI features | Thin (summaries, copilot, lease-renewal prediction). Real decisioning resold: ABBYY for doc intake, TruDecision via partnership still in future tense. |
| **Alfa** | ML underwriting | The Alfa iQ joint venture with Bitfount was **dissolved May 28, 2025** per UK Companies House. Shipping AI today: a help chatbot (AskThea) + data-migration tool (Recon). |

**What the brushoff means for Quintel:** a buyer repeating "our vendor already gives us AI" is usually quoting a press release, not describing software their underwriters use. The honest rebuttal: "It sources you no deals, and it auto-scores rather than building a decision-ready, human-reviewable credit file on the deals you choose to chase."

**The asymmetry to note:** this is a *timing gap* (deep AI is coming top-down, startups racing up), not a structural moat.

### Tier 4: Sourcing / Intent Data Tools

| Player | What | Signal Type | Threat to Quintel |
|---|---|---|---|
| **LeadX** | Searchable UCC/lien data + firmographics | Lagging (UCC = post-funding) | None — wrong signal type |
| **EDA / Fusable** | D&B-enriched UCC-1 data, all 50 states | Lagging | None — refi/competitive intel |
| **Shovels.ai** | Construction permit API | Coincident-to-lagging | None — sells to suppliers, not lenders |
| **Construction Monitor** | Permit data (weekly email) | Lagging | None — mortgage/solar |
| **Bombora / 6sense / ZoomInfo** | Generic B2B intent | No EF topic exists | None — horizontal, not EF-specific |
| **FMCSA feeds (CarrierOK, RigDig)** | Trucking new-authority | Strongly leading, EF-specific | Low — finance buyers already named; edge is credit depth |
| **State DOT lettings** | Contract-award / mobilization | Strongly leading, EF-specific | **Genuine white space** — nobody packages this for EF lenders |
| **SendStrike** | Cold-email infra for MCA teams | Delivery pipe only | None — explicitly disclaims intent data |

**Sourcing verdict (updated post-Empire call):** the raw data can't be owned — but the sourcing competitive picture is buyer-dependent:

- **For small-ticket brokers:** sourcing remains secondary to pre-qual/match. Brokers source through relationships, not data. The brief's original critique holds for this buyer.
- **For mid/large-ticket direct lenders ($5M+):** the competitive field for signal-monitoring-on-a-known-universe is **genuinely empty.** Empire's Katharine Rudzitis evaluated ZoomInfo (shallow), Affinity/Meridian (rejected as "not the right tool"), and personal ChatGPT (one-off, not continuous). No competitor — not Kaaj, Uptiq, Aloan, or any sourcing tool — serves this buyer with this product. Her need is not lead generation; it's scoring and monitoring ~2,000 known prospects against her credit box with proactive deal-timing signals.

The defensibility for lender-side sourcing is not the data (still commodity) but three layers nobody else assembles:
1. **Entity resolution + signal fusion** — fusing UCC, EDGAR, news, and LinkedIn into one scored lead with corroborating signals (vs. four separate alerts)
2. **Box-scoring** — "this company now likely needs $15M in equipment financing, which fits your box, and here's why" (vs. ZoomInfo's "there's a new CEO")
3. **The feedback loop** — deals sourced through the system that get underwritten teach which signals, at which timing, for which asset classes, actually convert

DOT lettings remains the cleanest white space for a specific vertical signal (construction).

---

## 3. Pricing Landscape

Three sharply separated price bands:

| Band | Players | Range | Quintel Position |
|---|---|---|---|
| **Sourcing / data tools** | Shovels, Construction Monitor, EDA | $300/mo–$50K/yr | Below Quintel |
| **AI underwriting overlays** | Kaaj, Aloan, Tamarack, Uptiq | $25K–$300K/yr | **Quintel's $42–60K/yr flat fee sits at the very bottom** |
| **Legacy LOS platforms** | Solifi, Odessa, Alfa, NETSOL | $150K–$12.5M+/yr | Above Quintel's ICP |

**Structural finding:** not one AI or LOS competitor publishes a self-serve price. Transparent pricing is open white space.

**Pricing risk:** if Quintel displaces underwriting or origination labor (a services outcome), a flat $42–60K/yr leaves large value on the table. A funded native (Kaaj, Uptiq) can undercut a flat software price at will. Flat-fee is a wedge price, not a company anchor. Consider per-placement or AUM-tiered pricing that scales into the $75–250K range the overlays occupy.

---

## 4. Mapping the Landscape to Quintel's Architecture

### Where Quintel is already positioned correctly

**The engine spine is the right shape.** `ingest → structure → decide → match → review → capture` is architecturally differentiated from every competitor. Kaaj, Uptiq, Aloan, and SharpEi all terminate at `decide`. None have `match` or `capture`.

**The Deal Object + outcome capture is the structural moat.** The `outcome` field on the Deal Object is explicitly designed for the gap no competitor fills. Every competitor is single-tenant. Nobody can answer "which lender actually funds this profile."

**The broker-first wedge dodges the strongest competitors.** Kaaj and Uptiq sell to lenders. Quintel's broker motion sells to brokers. Different buyer, same industry.

**The sourcing cockpit is the lender-side wedge.** The V1 SPEC already includes the sourcing cockpit as one of three views. The Empire call validates it as the lender entry point — not as a broker feature (where pre-qual/match leads), but as the product that gets direct lenders onto the platform. The sourcing surface partially exists (Alek's demo landed on it) and operates on public data only (zero compliance surface). This is the fastest path to lender-side revenue.

### Where competitive pressure should shift priorities

1. **`ingest`/`extract` quality bar is higher.** P1 (real extraction) is correctly sequenced next, but with Kaaj claiming 2-week deployment and SharpEi claiming 30-minute intake, the extraction must be *noticeably* better. The live-drop demo property is more valuable as competitors proliferate.

2. **`match` should get more demo weight on the broker side.** The lender roadmap leans toward leading with the underwriting read. For brokers, the landscape argues the opposite: underwriting is the crowded race; match is the defensible position. Lead with "which of your lenders should get this deal, and why" — show the underwriting read as "and it also does this."

3. **The "open to" band (P1/P2/P3 banding) is a quiet differentiator.** None of the competitors handle secondary-band fit. Kaaj/Uptiq do binary screening.

4. **The sourcing cockpit is correctly weighted in V1 — but reframed.** The earlier analysis recommended deprioritizing it. The Empire call reverses that for the lender side. The sourcing cockpit should remain a first-class V1 view, positioned as the **lender-side entry point** (signal monitoring + box-scoring on an existing prospect universe), not as a broker feature. For brokers, Deal Detail + Lender Scorecard still lead.

5. **Back-catalog pre-load is non-negotiable in first pilot scope.** The moat window is time-boxed. Kaaj accumulates "$5B+ in applications." F2 has "hundreds of users." Quintel must pre-fill the outcome record from the customer's own historical book on day one.

6. **Don't over-invest in the VFI lender surface.** Kaaj is already in those accounts at lower price. But **Empire is a different story** — clean, zero-conflict, no legacy LOS to compete with, and pulling on the sourcing surface that no competitor serves. Empire > VFI as the lender-side priority.

### The two-wedge strategy

The competitive landscape supports different wedges for different buyers on the same engine:

| | **Broker side** | **Lender side** |
|---|---|---|
| **Buyer** | Owner-operated placement broker, 2-10 people | Mid/large-ticket direct lender ($5-50M), PE-sponsor-backed |
| **Wedge** | Pre-qual + match ("screen junk, route to the right lender") | Signal monitoring + box-scoring ("tell me when to call my 2,000 prospects") |
| **Competitive field** | Empty for placement; crowded for underwriting | Empty for signal-monitoring; F2 degrading on underwriting |
| **Lead surface** | Deal Detail + Lender Scorecard | Sourcing Cockpit |
| **Upsell path** | Underwriting → capture → feedback loop | Underwriting (F2 displacement) → placement (receive broker deal flow) |
| **Deal-graph contribution** | Placement outcomes (which lender funds what) | Sourcing-to-outcome conversion data; appetite signals |
| **First prospect** | Bevel | **Empire Asset Finance** |

Both wedges feed the same deal-graph. A lender seeing sourcing signals eventually wants to see broker deal flow. A broker routing deals wants to know which lenders are hungry. **The cross-org placement graph accumulates from both sides faster than either wedge alone.**

This is not scope creep — it's the "one engine, two sides" thesis (GTM roadmap §1) with buyer-specific entry points validated by real market pull.

---

## 5. The Full-Stack Blueprint: What It Opens Up

Alek's second research artifact is a "build everything in-house" full-lifecycle spec covering 7 stages (sourcing → intake → underwriting → placement → closing → servicing → end-of-term). It names four proprietary data organs as the moat.

### New concepts worth extracting

#### The "four data organs" framing
Better than "deal-graph" as a monolithic moat concept. Decomposes into four independently valuable datasets:

1. **Funded-and-declined outcome record** — every decision with inputs, exceptions, and reasons joined to 12-24 month performance. "The master asset. Every other edge is downstream."
2. **Lender credit-appetite graph** — what each lender actually funds, learned from real outcomes, not stated rate sheets. Reveals true appetite conjunctions and drift.
3. **Cross-lender serial/collateral registry** — serial-level anti-double-pledge coverage. Genuine network effect. Newly urgent after 2025 double-pledging failures (Tricolor Chapter 7).
4. **Counterparty performance graph** — broker/vendor performance + fraud signals + realized recovery + treatment-effect data from servicing.

**Reachability from current build:** organs 1 and 2 are reachable from the broker-first wedge. Organs 3 and 4 require closing/funding/servicing stages — the full LOS replacement play, not the current motion.

#### Revealed appetite — deeper than current `match`
The blueprint specifies:
- **Conjunctive box modeling** — a lender's real box has interaction terms, not independent per-field scores
- **Decline cascade** — "P(fund at B | declined at A) ≠ P(fund at B)" — re-rank conditioned on *why*
- **Price-to-clear** — the rate at which deals *actually* fund, not aspirational rate sheets
- **Selection bias correction** — brokers submit selectively, so learned box is artificially generous without explicit submission-selection modeling

Current `match` hand is a basic filter-and-rank — appropriate for the wedge. This is the depth roadmap for making it defensible at scale.

#### Story credit as structured data
Most overrides ("yes despite the tax lien") are lost to history. The blueprint proposes capturing *why* a human overrode policy in a learnable, structured form joined to outcome. "The funded-over-exception-with-reasoning-and-outcome record is the single most valuable proprietary dataset in the engine."

**Practical implication for current build:** when building the `review` surface (currently a stub), design the override/approve flow to capture structured reasons from day one. This is cheap and impossible to retrofit.

#### Electronic chattel paper control (Stage 5)
UCC 9-105 requires a system where a single authoritative copy is unique, identifiable, and unalterable. A PDF in S3 next to a signed envelope does not qualify. If wrong, paper is not legally sellable and entire secondary-market value collapses. The 2022 UCC amendments and new Article 12 are live in 33+ states (NY effective June 3, 2026).

**Not relevant to current build** but load-bearing for any future closing/funding stage.

#### Compliance-as-config pattern
Specific regulatory changes inside the build horizon: SR 26-2 (replaced SR 11-7, Apr 2026), Section 1071 (scope settled May 2026), CTA narrowing, multi-state commercial financing disclosure, UCC Article 12, TCPA Revoke-All. Building compliance as a rules engine is both architecturally correct and a selling point against incumbents who hardcode it.

### What NOT to do with the blueprint

The blueprint is a destination map, not the next sprint. Building past `match` before a paying customer pulls on it is the "demo-build-without-customer" pattern. The blueprint's own best line: "the single highest-leverage platform investment is the outcome-record-and-data-model design itself." Outcomes require customers. Ship the wedge, close the sale, then use this as the depth roadmap.

---

## 6. Positioning Implications

### What to stop saying
- "Model-agnostic" and "token-efficient" as differentiators — F2 already claims both. Table stakes.
- "Sourcing before UCC" as a generic claim — trivially true. (But "signal monitoring on your existing universe, scored against your box" is a different, validated pitch — see §1.)
- "AI credit memo" as the lead pitch — crowded race against better-funded natives already in target accounts.

### What to lead with (buyer-dependent)

**To brokers:**
- **Placement.** "Kaaj makes your file; it doesn't tell you who funds it or place it." Position explicitly downstream of the file-builders.
- **The four data organs** as the moat narrative (especially the outcome record and credit-appetite graph).

**To direct lenders:**
- **Signal intelligence.** "Your ZoomInfo tells you there's a new CEO. We tell you this company likely needs $15M in equipment financing that fits your box, and here's why — before anyone else calls."
- **F2 displacement** (where applicable). Empire's F2 is degrading. The underwriting surface is the natural upsell once the sourcing surface is inside.

**To both:**
- **Transparent pricing** — no competitor publishes prices. Open white space.
- **Owner-buyer speed/price** — one-tenth to one-fifth of typical underwriting overlay ACV.

### What to use as credibility anchors
- "There's a $24M-backed version for big private-credit funds (F2); we're the version for placement brokers."
- "There's a $70M-backed underwriting suite for FIs (Uptiq); we're the placement layer that tells you which of those FIs to send it to."
- To lenders specifically: "The signal tools you've tried — ZoomInfo, Affinity, Meridian — are CRMs that added signals. We're the signal layer, purpose-built for your credit box, that layers on top of your CRM."

---

## 7. Action Items

| Action | Priority | Timing |
|---|---|---|
| **Close Empire.** Strongest first-call pull in the deal log. Sourcing surface partially exists. Lender-side revenue on the fastest path. | P0 | Now — gated on materials (Alek) + redacted deal (Katharine) + team call |
| Reweight broker demos toward `match` hand, not underwriting read | P0 | Next broker demo |
| Ship P1 (real extraction) — quality bar high, live-drop is the differentiator | P0 | In progress |
| Scope HubSpot integration story for Empire team call (Katharine asked about a plugin) | P0 | Before Empire team call |
| Retain sourcing cockpit as first-class V1 view — reframe as lender-side entry point | P1 | SPEC update |
| Design `review` surface with structured override/reason capture from day one | P1 | When building review (P4) |
| Back-catalog pre-load as non-negotiable in first pilot contract | P1 | First pilot scope |
| Add Kaaj, Uptiq, Aloan, SharpEi, F2 to landscape tracker | P1 | This week |
| Update positioning language to "four data organs" framing | P2 | Next positioning pass |
| Explore F2 displacement as upsell vector for Empire (F2 degrading per Katharine) | P2 | After sourcing surface lands |
| Note DOT-lettings as genuine sourcing white space (construction vertical signal) | P3 | Backlog |
| Note serial/collateral registry as long-term network-effect moat (for investor narrative) | P3 | When relevant |

---

## 8. Landscape Tracker Summary

| Player | Category | Funding | Named EF Customers | Threat Level | Key Gap vs. Quintel |
|---|---|---|---|---|---|
| **Kaaj** | AI underwriting OS | $3.8M seed | Amur, Fundr, ~15 more | HIGH | No match/placement, no sourcing |
| **Uptiq** | Agentic AI EF suite | ~$70M total | Marshall Capital, 140+ FIs claimed | HIGH | No match/placement, no sourcing |
| **Aloan** | AI underwriting layer | Unverified | None disclosed | MEDIUM | No traction, no placement, no sourcing |
| **F2** | Vertical FS-AI (adjacent) | $24M | 100+ funds/banks claimed | MEDIUM (long-term) | Investor-side, no broker/placement, no sourcing; **degrading at Empire** |
| **SharpEi** | AI intake automation | Unfunded | Via Tamarack partnership | LOW-MEDIUM | Intake only, no judgment/placement/sourcing |
| **ZoomInfo** | Generic B2B contact/signal | Public (declining) | Horizontal | LOW (lender sourcing) | Shallow signals, no EF-specific scoring, no box-matching — Empire has it and finds it useless |
| **Affinity / Meridian** | Signal-enriched CRM | Various | PE/VC-focused | LOW (lender sourcing) | Empire evaluated and rejected — "not the right tool" |
| **Northteq (Aurora)** | Salesforce-native EF LOS | Undisclosed | 175+ EF lenders | LOW (different buyer) | LOS replacement, not overlay |
| **Tamarack / Liventus** | EF tech consolidator | Acquired Mar 2026 | NEC, 360 EF | LOW | BI/automation, not credit engine |
| **Solifi** | Enterprise LOS + AI | TA Associates majority | Sonata Bank (AI only) | LOW (wrong ICP) | Enterprise only, Level 3/5 AI |
| **Odessa** | Enterprise LOS + AI | Thomas H. Lee Partners | None for AI | LOW (wrong ICP) | Enterprise only, thin AI |

---

## Sources

- Alek's competitive brief (2026-06-18): `tokenrip.com/s/bf608197-2ee4-44d5-a4bc-9192901a5d3c`
- Alek's full-stack blueprint (2026-06-18): `tokenrip.com/s/6ce8bf75-e977-4278-87da-d4ee1efe519f`
- Empire Asset Finance / Katharine Rudzitis first call (2026-06-18): `bd/calls/transcripts/katharine-rudzitis-2026-06-18.md`
- [Tracxn — SharpEi AI Company Profile](https://tracxn.com/d/companies/sharpei-ai/__A1mBZIvDriPbBobCuXMhTFhJ4bxXUqRKoGEzxslndw0)
- [Tamarack/SharpEi partnership — Equipment Finance News](https://equipmentfinancenews.com/news/lender-operations/tamarack-sharpei-partner-on-ai-powered-origination-platform/)
- [SharpEi AI](https://www.gosharpei.com/)
- [Crunchbase — SharpEi (Elaxtik)](https://www.crunchbase.com/organization/elaxtik)
- Prior vault research: `intelligence/research/quintel/ai-document-workflow-competitive-landscape-2026-04-30.md`
- Prior vault research: `intelligence/research/quintel/research-f2-ai-private-markets-2026-06-18.md`

---

*Competitive landscape research. Companion to the GTM roadmap, engine build roadmap, and lender surface roadmap. Updated 2026-06-19 with Empire/Katharine lender-side sourcing correction and two-wedge thesis. Update the landscape tracker (§8) as competitors move.*
