---
title: Quintel — Competitive Landscape Research & Full-Stack Blueprint Analysis
status: active
owner: Simon
type: competitive-research
product: Quintel
created: 2026-06-18
updated: 2026-07-16
source_material: >
  Alek's competitive brief (tokenrip.com/s/bf608197), Alek's full-stack blueprint
  (tokenrip.com/s/6ce8bf75), SharpEi web research, Empire/Katharine call (2026-06-18),
  prior vault competitive analysis (intelligence/research/quintel/), Fusable/EDA
  deep-dive research (2026-07-13), TEX Software deep-dive research (2026-07-13),
  ZoomInfo Intent Data mechanics (zoominfo.com/features/intent-data, 2026-07-16)
related:
  - product/quintel/quintel-customer-data-first-prd-2026-06-29.md
  - product/quintel/quintel-engine-build-roadmap-2026-06-09.md
  - product/quintel/quintel-lender-build-roadmap-2026-06-10.md
  - product/quintel/ef-product-spec-2026-06-02/SPEC.md
  - intelligence/research/quintel/ai-document-workflow-competitive-landscape-2026-04-30.md
  - intelligence/research/quintel/research-f2-ai-private-markets-2026-06-18.md
  - bd/calls/contacts/katharine-rudzitis.md
  - bd/calls/transcripts/katharine-rudzitis-2026-06-18.md
---

# Quintel — Competitive Landscape Research & Full-Stack Blueprint Analysis

> **What this is:** a consolidated research doc from the 2026-06-18 competitive sweep Alek ran (20+ players across four workstreams), supplemented by SharpEi research, a strategic analysis of Alek's full-stack EF product blueprint, the Empire Asset Finance first call (Katharine Rudzitis, 2026-06-18), and a 2026-07-13 deep-dive on Fusable/EDA — all reframed around Quintel's current product direction: **market intelligence, keyed to a customer's stated buy box, is the primary story; deal history is a secondary enrichment.**

> **Reframing note (2026-07-13):** this doc's 06-18/06-19 version was built around underwriting-vs-placement and a lender/broker two-wedge split, later extended by the 06-29 PRD's "customer-data-first" ranking model. Simon has since moved past both: **the primary motion is market intelligence off a basic, customer-directed input set (the buy box) — not deal-history-driven ranking, and not underwriting.** Deal/customer data still helps, but it's a secondary enrichment layer, not the wedge. This version reorders the threat map around that lens: underwriting natives (Kaaj, Uptiq, Aloan, F2) are now unambiguously a closed door to avoid entirely, and **Fusable/EDA — a raw market-intelligence/signal-monitoring infrastructure player — moves from a dismissed Tier 4 footnote to the single most relevant capability-level competitor found in this sweep.**

---

## 1. Bottom Line Up Front

Quintel's redefined core motion — market intelligence scored against a customer's stated buy box — has one real infrastructure-level competitor, one crowded closed door, and one confirmed empty commercial lane.

**Closed door (unchanged, now more absolute):** Document-to-credit-memo underwriting software is a converged, well-funded category — Kaaj ($3.8M seed, already inside Quintel's target accounts), Uptiq (~$70M raised, broadest EF agent suite), F2 ($24M, investor-side but architecturally near-identical), Aloan (messaging mirror, no traction). None of them source or monitor anything — they all assume a file already exists. Under the new framing this isn't just "weak ground to lead on," it's off the map entirely: Quintel should not build, demo, or message underwriting depth as a primary capability.

**The one real infrastructure-level competitor: Fusable/EDA.** Fusable (the Randall-Reilly data spinoff, PE-owned, ~$50M revenue, 200-500 employees) owns EDA (UCC+D&B equipment-purchase data) plus a cluster of adjacent valuation/data brands (Iron Solutions, Price Digests, EquipmentWatch, CAB, RigDig BI). In **November 2025** Fusable shipped a new, separate API/Platform layer whose own marketing language is close to a mirror of Quintel's raw signal layer: *"Monitor equipment financing records in real time to identify companies making new equipment investments."* That is the exact primitive underneath Quintel's market-intelligence motion. Full deep-dive in §2a.

**But Fusable is a sleeping giant, not an active threat — yet.** No named equipment-finance lender or broker customer exists anywhere in the public record (only a confirmed adjacent case: CamoAg, an ag-lending platform, subscribes to Fusable's UCC feed for risk assessment). No AI/ML scoring language anywhere in Fusable's or EDA's marketing — the Nov 2025 launch is described as filtering/search/CRM-enrichment, not predictive relevance-scoring against a buyer's box. No pricing transparency. Zero third-party reviews (G2/Capterra/SourceForge all empty/unclaimed). And tellingly: **Katharine Rudzitis at Empire — exactly the buyer this product would target — evaluated ZoomInfo, Affinity, and Meridian on this call and never mentioned Fusable or EDA.** The capability exists; the distribution into EF lending does not. That gap is Quintel's actual opening, and it is time-boxed by Fusable's capital and platform investment, not by any technical barrier on their side.

**The confirmed empty commercial lane:** signal-monitoring-and-scoring against a known prospect universe, for a buyer who already has a list and needs to know *when* and *who* to call. Empire's own words: *"The underwrite part, I don't know how interesting it is. The signaling part I think is very interesting."* ZoomInfo, Affinity, and Meridian were tried and rejected as too shallow (no EF-specific box-fit, no financing-specific signal). Fusable has the raw data but not the box-scoring layer or the EF-lending distribution. Nobody — not the underwriting natives, not the legacy LOS vendors, not Fusable itself today — currently sells "here is who in your universe likely needs equipment financing right now, scored against your specific box, with the reasoning shown."

**What defends this lane once Quintel is in it:** not the raw data (UCC, EDGAR, news, LinkedIn are all commodity or semi-commodity — Fusable already owns one of these feeds outright) but the **fusion + box-scoring + reasoning layer on top**: corroborating multiple source types into one scored lead (vs. Fusable's single UCC+D&B feed, or ZoomInfo's generic firmographic alert), conjunctive box-modeling that reflects a lender's *real* appetite rather than a stated rate sheet, and a feedback loop where sourced-then-underwritten deals teach which signals actually convert. This is a thinner, faster-to-defend moat than a "deal-graph" story built on customer data — which is exactly why the buy-box-driven, market-intelligence-primary framing is the right one to build and sell against first.

**A second, adjacent-not-identical sourcing player: TEX Software.** TEX Intel (texsoftware.com) is a pure sourcing/ownership-intelligence tool for heavy equipment — maps who owns what machinery, tracks fleet changes over time, surfaces off-market machines. It proves the same underlying demand Fusable does (structured intelligence on equipment ownership/movement is worth paying for) but it's **asset-centric, not lender-buy-box-centric**: it answers "who owns this machine and has their fleet changed," not "which companies in my target criteria likely need financing now." No scoring, no AI, one named customer (Darby Industrial, an equipment broker — not a lender), no EF-lending trade-press visibility, ownership/scale details genuinely unresolved (self-described as founder-run, not PE-backed; HQ ambiguous between San Antonio and San Francisco). Full notes in §2b. Lower-confidence read than Fusable given the thinner public record, but the pattern is the same: real demand for equipment intelligence exists among dealers/brokers; nobody has pointed a scored, box-fit version of it at EF lenders yet.

---

## 2. The Threat Map

### 2a. Deep Dive — Fusable / EDA (moved up from Tier 4; the one infrastructure-level competitor)

**What it is:**
- **EDA (Equipment Data Analytics)** — edadata.com — a data-intelligence dashboard built on "cleaned and verified UCC filings, enhanced with additional contacts and D&B® firmographic data." Covers nine industrial verticals (Agriculture, Construction, Lift Trucks, Logging, Machine Tools, Office Equipment, Printing, Trucking, Woodworking). Sold to manufacturers, dealers, capital markets, lenders, and aftermarket — a horizontal buyer list, not an EF-lender-specific product.
- **Fusable** — the parent. Rebranded from Randall-Reilly's industrial-data arm in a January 2024 "strategic separation" from the Randall-Reilly talent-acquisition business (which kept the name). PE-owned: Aurora Capital Partners (acquired Randall-Reilly from Investcorp in 2017), with Northleaf Capital Partners, Cambria Group, and West Bend Insurance also holding stakes. CEO Matt Reilly. ~200-500 employees (LinkedIn band), ~$50M revenue estimate, HQ Charlotte NC plus Tuscaloosa AL, Lakewood NJ, Franklin TN offices.
- **Fusable's full data/finance cluster** (all adjacent to EDA, not competitors of each other): **Iron Solutions** (ag/construction equipment pricing + up to 7-year forecasts), **Price Digests** (truck/equipment valuation), **EquipmentWatch** (valuation/API data), **Central Analysis Bureau (CAB)**, **RigDig BI**. Media brands retained separately: Overdrive, Commercial Carrier Journal, Trucks Parts Service, Equipment World, Clean Trucking, Total Landscape Care.
- **The Nov 2025 pivot:** Fusable launched **Fusable Data Core** (Sept 2025), then the unified **Fusable Platform**, **Fusable API**, and a **Salesforce App** (all Nov 10, 2025) — explicitly stated as *separate systems from EDA* (EDA clients unaffected/unmigrated). The API's own marketing: real-time monitoring of equipment financing records "to identify companies making new equipment investments," plus CRM enrichment and Salesforce integration. This is watchlist-style monitoring at the raw-signal level — the closest thing found anywhere in this sweep to Quintel's core primitive.

**What it lacks (the actual gap):**
- **No box-scoring or relevance-ranking layer.** Every source describes filtering/search/enrichment, never predictive or explainable scoring against a specific buyer's credit box. No AI/ML language anywhere in EDA's or Fusable's public marketing.
- **No source fusion.** Single feed (UCC+D&B). No EDGAR, no news, no LinkedIn, no permit data — the corroboration/entity-resolution layer Quintel's architecture is built around doesn't exist here.
- **No named EF-lending customer.** Testimonials on EDA's own site are dealer/OEM/appraiser-side (Mahindra US, Koenig Equipment, H&E, AMEA, LoSasso). The one confirmed adjacent lending use is **CamoAg**, an ag-lending platform that subscribes to Fusable's UCC data for its "CamoAg Pro" risk tool — not equipment finance, and a data-licensing relationship, not a competing product.
- **No pricing transparency, no review footprint.** Not listed on edadata.com, fusable.com, Datarade, Capterra, or SourceForge — and the Datarade/SourceForge listings that exist are unclaimed, auto-generated, zero-review shells.
- **No visibility with the exact buyer Quintel is targeting.** Empire's Katharine Rudzitis — mid/large-ticket direct lender, actively shopping this exact problem in June 2026 — evaluated ZoomInfo, Affinity, and Meridian and never surfaced Fusable/EDA. Either she doesn't know it exists, or it isn't marketed into EF lending at all. Both read the same way: **capability without distribution.**

**Why it matters more than the old Tier 4 verdict ("None — refi/competitive intel") suggested:** this isn't a shallow lead-gen tool like ZoomInfo. Fusable already owns the UCC data pipeline, has scaled API/CRM infrastructure as of Nov 2025, has PE capital and ~$50M in revenue, and has explicitly built the "real-time financing-signal monitoring" primitive. The only things standing between Fusable and a direct competing product are (1) a box-scoring/reasoning layer and (2) EF-lending-specific go-to-market — both buildable by a company their size, neither currently shipped.

**Two implications, held together:**
1. **Threat:** if Fusable adds a scoring layer and starts selling into EF lenders/brokers specifically, they arrive with an owned data pipeline, real infrastructure, and capital — a harder incumbent to displace than any underwriting-native competitor in this sweep. Watch for this explicitly (see Action Items).
2. **Opportunity:** Fusable's UCC+D&B feed is a legitimate buy-vs-build option for Quintel's own market-intelligence data layer, rather than building UCC ingestion from scratch. Worth a direct pricing/API conversation before assuming a build.

> **Update 2026-07-13 — data point from the Martin Roth / Filmore call ([[martin-roth]]).** A live operator building the *dealer-side* analogue (Filmore) confirmed several things first-hand: (a) **~$350k/year is a realistic all-in state-data cost** (UCC + other sources) — a concrete build-vs-buy anchor the "undisclosed pricing" finding above lacked; (b) their **UCC→collateral enrichment is procured, not proprietary** — Fusable/EDA and TEX already sell UCC enriched with collateral (Filmore's own FAQ positions "vs. EDA or Tex"), which *confirms* the buy option in implication 2; (c) **"data is not the moat"** — stated directly, and echoed on their public site (*"public data gets you started; the real advantage is the customer's private [telematics/service] data"*) — a structurally identical thesis to Quintel's public-base + private-deal-history architecture, validated one seat over. **Refinement for Quintel:** UCC is J2/J3/J4 (timing / qualification / competitive-map) for a *lender*, **not** the demand-origination (J1) edge — so a *thin* UCC enrichment tier likely suffices, and the marginal data dollar belongs in the *leading* EF-specific signals (DOT lettings, FMCSA authority, awards, permits). Full treatment: [[quintel-data-strategy-signal-portfolio-2026-07-13]].

### 2b. Deep Dive — TEX Software (TEX Intel)

**What it is:**
- **TEX Intel** (texsoftware.com, login at intel.texsoftware.com) — a market/ownership-intelligence platform for heavy equipment. Maps who owns what machinery, where it's located, and when fleets change, across construction/ag/trucking brands (CAT, Komatsu, John Deere, Case, Kubota, Volvo, Liebherr, Peterbilt, Freightliner, Hitachi, JCB). Covers only the pre-deal / market-research phase — sourcing and prospecting, nothing downstream.
- **Core capability:** search/filter by equipment, firm, brand, fleet size, lender, region; "track fleet changes over time"; "find buyers you don't know about" by surfacing off-market machines before they hit market; contact enrichment for owners and firms.
- **Trade-association ties:** IEDA (Industrial Equipment Dealer Association) and AED (Association of Equipment Dealers) — positions toward equipment dealers, not EF lenders.

**What it lacks:**
- **No scoring or box-matching.** It's a searchable ownership map/database, not a scored-signal feed — closer to a directory than an intelligence product in Quintel's sense.
- **No AI/ML anywhere** — no model claims, no named AI features on the site.
- **Thin customer evidence.** Exactly one named customer: **Darby Industrial**, a global equipment broker (not a lender). Site claims "trusted by dealers, brokers, and lenders across 48 states" with zero named lender logos, count, or segment breakdown.
- **No integrations found** — no CRM connectors, no EF vendor partnerships, no API/data-partner disclosures.
- **No pricing** — fully demo-gated, no tiers or self-serve signup.
- **Company profile has real, unresolved unknowns** (flag as low-confidence, not assumed-resolved): founding year, employee count, and funding history are undisclosed anywhere found. Site describes itself as "run by builders and operators, not consultants or private equity funds" (implying founder-owned); HQ is ambiguous — a San Antonio, TX phone number on-site vs. Crunchbase listing San Francisco, CA. No 2025-2026 product launches, AI announcements, or trade-press coverage found in Equipment Finance News, Monitor Daily, or ELFA searches.

**Verdict:** adjacent-not-identical. TEX Intel validates that buyers will pay for structured equipment-ownership intelligence, but it targets dealers/brokers doing relationship-based selling on *specific machines*, not lenders scoring a prospect universe against a credit box. No overlap on scoring, no overlap on buyer (lender vs. broker-of-used-equipment), no AI. Worth a lighter-touch quarterly check-in than Fusable, given far less capital/infrastructure signal — but the same underlying lesson holds: real demand exists for equipment-movement intelligence, and nobody has pointed a scored, lender-box-fit version of it at EF lenders specifically.

### 2c. Tier 1: Market-Intelligence / Sourcing Landscape (the primary competitive surface now)

| Player | What | Signal Type | Verdict under new framing |
|---|---|---|---|
| **Fusable / EDA** | Real-time UCC financing-record monitoring + D&B enrichment, new API/CRM layer (Nov 2025) | Coincident (UCC filed near/at funding) | **The one real infrastructure competitor** — see §2a |
| **TEX Software (TEX Intel)** | Heavy-equipment ownership/fleet-change intelligence, dealer/broker-facing | Coincident (ownership record, not financing-specific) | Adjacent-not-identical — see §2b; no scoring, no AI, one named customer (a broker) |
| **ZoomInfo** | Generic B2B contact/signal (mechanics confirmed 2026-07-16 — see note below) | Inferred (web content-consumption/keyword behavior), not a public-record event | Evaluated and rejected by Empire — "doesn't do a ton more than a Google alert" |
| **Affinity / Meridian** | Signal-enriched CRM | PE/VC-focused | Evaluated and rejected by Empire — "not the right tool" |
| **Bombora / 6sense** | Generic B2B intent | No EF topic exists | Horizontal, not EF-specific — same gap as ZoomInfo |
| **LeadX** | Searchable UCC/lien data + firmographics | Lagging (UCC = post-funding) | Weaker version of the Fusable/EDA feed, no monitoring/API layer found |
| **FMCSA feeds (CarrierOK, RigDig)** | Trucking new-authority | Strongly leading, EF-specific | Finance buyers already named on this data; edge is credit-box depth, not the signal itself |
| **State DOT lettings** | Contract-award / mobilization | Strongly leading, EF-specific | **Genuine white space** — nobody packages this for EF lenders; construction-vertical-specific |
| **Shovels.ai / Construction Monitor** | Permit data | Coincident-to-lagging | Sells to suppliers/mortgage/solar, not EF lenders — adjacent, not competing |
| **SendStrike** | Cold-email infra for MCA teams | Delivery pipe only | Explicitly disclaims intent data — not a signal competitor |

**ZoomInfo Intent — mechanics confirmed 2026-07-16** (`zoominfo.com/features/intent-data`, prompted by Allen/Regents Capital pulling up "Signals" live on the 2026-07-13 call — see [[bd/calls/quintel-sales-tear-sheet]] §3): ZoomInfo's intent signal is **not** a public-record event. It's an inference from aggregated, anonymized **web content-consumption behavior** — "millions of content consumption events across publishers, websites, and research platforms," "210 million IP-to-org pairings," "6 trillion+ keyword-to-device pairings," resolved back to a company and a person via IP/device matching. In plain terms: someone somewhere read an article or searched a keyword, and ZoomInfo infers the *company* is "in-market" for that topic. No EF-specific topic taxonomy exists in it (confirms the existing "no EF topic exists" read), and the accuracy claims (95%+ contact accuracy, "Guided Intent" topic-relevance) are vendor-asserted with no disclosed methodology or third-party verification — flag as marketing claim, not evidence, if it comes up on a call.

This sharpens the existing differentiation (§1a "say the formula, never the adjective," used in the tear-sheet's post-Allen-call answer): the honest contrast isn't "generic vs. tailored," it's **inferred web-behavior vs. observed public-record event**. A UCC-1 filing, a permit, or a contract award is a legally-public, verifiable fact that a specific real-world financeable event occurred. A ZoomInfo intent signal is a probabilistic guess from someone's browsing history, correlated to a company through IP resolution — weaker evidence, one step further removed from the thing that actually indicates financing need. This is a stronger, non-buzzword answer for a technical buyer like Allen because it's a falsifiable claim about data provenance, not an adjective ("tailored," "AI-powered") a ZoomInfo-owning buyer will hear as feature parity.

**Sourcing verdict:** raw signal data is not ownable by anyone in this table, Fusable included. What's ownable is the fusion-plus-box-scoring layer on top — and no player here has built it. Fusable is the only one with the balance sheet and existing pipeline to build it fast if they decide to.

### 2d. Tier 2: Closed Door — Underwriting Natives (reference only; do not compete here)

Kept for messaging/objection-handling reference, not as an active battleground.

#### Kaaj
- "Underwriting OS for SMB lending." $3.8M seed (Nov 2025). Customers: Amur, Fundr, Quality Equipment Finance, Smarter Finance USA + ~12 more. SOC 2 Type II, claims $5B+ processed. No sourcing, no placement, no cross-org outcome data.

#### Uptiq
- Six EF-specific agents (intake through monitoring). ~$70M total raised. Broadest LOS-connector story (Jack Henry, FIS, Fiserv, Finastra, Solifi). No sourcing, no placement.

#### Aloan
- Closest messaging mirror to Quintel's old "examiner-ready" language. No disclosed traction, no named customers, no sourcing.

#### F2 (Vertical FS-AI)
- $24M raised, near-identical pipeline to Quintel's old underwriting engine, investor/fund-side buyer. No lender-matching, no sourcing. Degrading at Empire per Katharine (F2 evaluated and found wanting on the underwrite side specifically).

#### SharpEi
- AI intake/origination automation. Unfunded, small team. Partnered with Tamarack/Liventus (Mar 2026) for distribution into NEC Financial Services and 360 Equipment Finance. Intake automation, not sourcing or judgment.

**What these five have in common under the new framing:** all of them assume a borrower has already surfaced and submitted documents. None source, monitor, or score a prospect universe. This is precisely why underwriting is off the table as a lead motion — Quintel would be entering a converged, well-funded race on someone else's home turf, for a capability that isn't even the customer's stated primary pain (Katharine: "the underwrite part, I don't know how interesting it is").

### 2e. Tier 3: Legacy LOS + AI Modules (The "Incumbent Brushoff")

For Quintel's actual buyer (small-ticket independents, small bank desks, and mid-ticket direct lenders), the incumbent brushoff remains mostly hollow:

| LOS | AI Status | Reality |
|---|---|---|
| **Dominion / LeaseComplete** | Zero AI | Rules-based decision trees, bureau pulls, workflow only |
| **Soft4Leasing** | Zero purpose-built AI | Only "AI" is inherited generic Microsoft Copilot for Business Central |
| **LTi / ASPIRE** | No shipping AI | Rules/scorecards only; AI is new PE owner's (Diversis) stated future plan |
| **Linedata Ekip360** | Thin | "Digital Assistant" = next-action autocomplete; real GenAI internal-only |
| **TurnKey Lender** | Real ML (exception) | Genuine auto-scoring (<30s), but volume decisioning, not sourcing or credit-file assembly |
| **Solifi** | "AI-native" transition | Self-rates Level 3/5. One named AI customer (Sonata Bank, Document Intelligence) |
| **NETSOL Check AI** | AI credit decisioning | Launched Oct 2025, no named production customer |
| **Odessa** | AI features | Thin; real decisioning resold (ABBYY, TruDecision-future) |
| **Alfa** | ML underwriting | Alfa iQ/Bitfount JV dissolved May 2025. Shipping AI: a help chatbot + data-migration tool |

**None of them source or monitor anything.** This tier remains useful as a rebuttal to "our vendor already gives us AI" objections, but it's not a sourcing/market-intelligence competitor at any depth.

---

## 3. Pricing Landscape

| Band | Players | Range | Notes |
|---|---|---|---|
| **Sourcing / data tools** | Shovels, Construction Monitor, LeadX | $300/mo–$50K/yr | Quintel likely sits above this band once box-scoring is priced in |
| **Fusable / EDA** | Fusable, EDA | Undisclosed | Zero public pricing anywhere (own sites, Datarade, Capterra, SourceForge); no third-party reviews to infer from either |
| **TEX Software** | TEX Intel | Undisclosed | Fully demo-gated, no tiers or self-serve signup found |
| **AI underwriting overlays** | Kaaj, Aloan, Tamarack, Uptiq | $25K–$300K/yr | Not Quintel's comparison set under the new framing — different job, different buyer motion |
| **Legacy LOS platforms** | Solifi, Odessa, Alfa, NETSOL | $150K–$12.5M+/yr | Above Quintel's ICP |

**Structural finding, sharpened:** the entire market-intelligence/sourcing tier (including the one real infrastructure competitor, Fusable) publishes zero pricing. Transparent pricing is genuinely open white space across the whole competitive set Quintel now competes in — not just against underwriting overlays.

---

## 4. Mapping the Landscape to Quintel's Architecture

### Where Quintel is already positioned correctly

**The fusion + box-scoring layer is the actual differentiation, and nobody has built it.** Fusable owns a real-time raw-signal feed but no scoring; ZoomInfo/Affinity/Meridian have generic signals but no EF-box-fit; the underwriting natives have neither. The defensible position is entity resolution across multiple source types (UCC, EDGAR, news, LinkedIn, permits) fused into one corroborated, explainable, box-scored item — not owning any single raw feed.

**Buy-box-driven, not deal-history-driven, is the right primary wedge.** A stated buy box (sector, ticket band, geography, asset type) is cheap to collect from any customer on day one — including a thin-history new lender like Empire — where a deal-history-first product would gate value behind data the customer may not have or want to hand over yet. Deal history remains valuable as an enrichment (sharper box-fit, revealed-vs-stated appetite) but is no longer the entry toll.

**Underwriting is correctly and now fully off the roadmap as a lead motion.** The competitive field there (Kaaj, Uptiq, F2, Aloan) is converged, funded, and answering a question the buyer has explicitly deprioritized.

### Where this research should shift priorities

1. **Evaluate Fusable/EDA as a build-vs-buy decision for the raw UCC/financing-record feed**, not just a competitive watch item. If their API pricing is reasonable, licensing a live feed is very plausibly faster than building/maintaining UCC scrapers in-house — get pricing directly rather than continuing to infer from an empty public record.

2. **Monitor Fusable for a scoring-layer or EF-lending-specific go-to-market move.** They have the data, the infrastructure (as of Nov 2025), and the capital. The gap today is real but not durable — this is the one competitor in the sweep that could close the distance fast if they decided to.

3. **Drop deal-history-first machinery from demo-critical-path thinking.** The 06-29 PRD's "customer-data-first" ranking model, and its L3/L4 UCC/cascade depth, remain valid roadmap items — but they are not what needs to be true for a first sale. A basic buy-box input plus a market-intelligence stream is the smallest thing that proves the wedge.

4. **Reframe the sales conversation away from "we rank your book" and toward "we watch the market against your box."** This is a smaller, faster-to-explain, faster-to-demo claim, and it matches what Empire and buyers like her actually asked for.

5. **Don't let ZoomInfo/Affinity/Meridian rejections create false comfort.** They were rejected as too shallow — but Fusable is not shallow at the data layer, it's shallow at the scoring layer. The next lender Quintel talks to may have evaluated Fusable/EDA specifically; be ready for that question in a way the Empire call didn't test.

---

## 5. The Full-Stack Blueprint: What Still Applies

Alek's full-stack blueprint (build-everything-in-house, 7-stage lifecycle) named four proprietary data organs as the long-run moat. Under the market-intelligence-primary framing, two of these compress into near-term relevance and two remain genuinely long-horizon:

- **Lender credit-appetite graph (organ 2)** — becomes the box-scoring model itself once a lender's buy box + a handful of funded/declined outcomes are on file. Reachable early, not a full-LOS-replacement prerequisite.
- **Funded-and-declined outcome record (organ 1)** — still the master enrichment asset, but now explicitly secondary to the market-intelligence stream, not the entry gate.
- **Cross-lender serial/collateral registry (organ 3)** and **counterparty performance graph (organ 4)** — both require closing/funding/servicing stages. Unchanged: long-horizon, not reachable from the current wedge.

**Story credit as structured data** (capturing *why* a human overrode policy) and **compliance-as-config** remain valid, cheap-to-build-in-early, expensive-to-retrofit design notes for whenever the `review`/underwriting surfaces get built — just no longer on the critical path to a first sale.

The blueprint's own best line still holds: outcomes require customers. Ship the market-intelligence wedge, close the sale, then use the blueprint as the depth roadmap — not the reverse.

---

## 6. Positioning Implications

### What to stop saying
- "AI credit memo" or any underwriting-depth claim as a lead pitch — off the map entirely now, not just weak ground.
- "We rank your existing book" as the headline claim — real, but secondary; leads with a data dependency (a populated CRM/deal history) many prospects, especially thin-history ones, don't yet have.
- "Model-agnostic" / "token-efficient" — table stakes, F2 already claims both.

### What to lead with
- **"We watch the market against your buy box."** The smallest, fastest-to-prove claim: give Quintel your sector/ticket/geography/asset criteria, get a scored, reasoned stream of who's showing up — no CRM export, no deal history required to start.
- **The fusion argument against Fusable specifically:** "Fusable/EDA tells you a UCC filing happened. We tell you why it matters against your specific box, corroborated across UCC, EDGAR, news, and public record — and we're not locked to one data source the way they are."
- **Transparent pricing** — genuinely open white space across the entire sourcing/market-intelligence tier, Fusable included.

### Credibility anchors
- "There's a $70M-backed underwriting suite for FIs (Uptiq) and a $24M-backed one for funds (F2) — we're not that. We're upstream of both: the layer that tells you who to look at before anyone opens a file."
- "There's a data company that already owns the UCC financing-signal feed (Fusable) — we're the scoring and reasoning layer that turns their raw filing into a call worth making, fused with sources they don't touch."

---

## 7. Action Items

| Action | Priority | Timing |
|---|---|---|
| **Get real Fusable/EDA API pricing and terms** — resolve the build-vs-buy question for the raw UCC/financing-signal feed directly instead of inferring from an empty public record. *(2026-07-13: now anchored by the Filmore call's ~$350k/yr all-in figure; scope the ask to a **thin** UCC enrichment tier for J2/J3/J4, not the dealer-grade collateral feed — see [[quintel-data-strategy-signal-portfolio-2026-07-13]].)* | P0 | Now |
| **Stand up the J1 *leading-signal* layer (DOT lettings, FMCSA new authority, USAspending awards, permits)** — the EF-specific demand-origination edge; re-weight against the current L2-news-first ordering (news = density, leading signals = the actual sourcing edge) | P0/P1 | Next build sprint |
| Rebuild the demo/sales narrative around "market intelligence against your buy box," dropping deal-history-first framing as the headline | P0 | Next demo pass |
| Add explicit Fusable/EDA competitive monitoring — watch for a scoring layer or EF-lending-specific GTM move | P1 | Ongoing, check quarterly |
| Lighter-touch monitor on TEX Software — watch for a pivot from dealer/broker asset-search toward lender box-scoring | P2 | Ongoing, check semi-annually |
| Update the SPEC/PRD to reflect buy-box-primary, deal-history-secondary sequencing (currently still written as customer-data-first per 06-29 PRD) | P1 | Before next build sprint |
| Retire underwriting-depth language from all outward-facing materials, not just demos | P1 | This week |
| Note DOT-lettings and FMCSA feeds as genuine construction/trucking-vertical sourcing white space, unaffected by this reframing | P2 | Backlog |
| Note serial/collateral registry + counterparty performance graph as long-term network-effect moat for investor narrative | P3 | When relevant |

---

## 8. Landscape Tracker Summary

| Player | Category | Funding | Named EF/Adjacent Customers | Threat Level (new framing) | Key Gap vs. Quintel |
|---|---|---|---|---|---|
| **Fusable / EDA** | Market-intel / UCC signal infrastructure | PE-owned (Aurora Capital), ~$50M rev | CamoAg (ag-lending, data-licensing only); none in EF specifically | **HIGH capability / LOW current distribution — the one real infra competitor** | No box-scoring, no source fusion, no EF-lending GTM, no pricing transparency |
| **TEX Software (TEX Intel)** | Heavy-equipment ownership/fleet intelligence | Undisclosed, likely founder-owned | Darby Industrial (broker); none in lending | LOW-MEDIUM — adjacent, not identical | Asset-centric not buy-box-centric, no scoring, no AI, thin customer base, unresolved company scale |
| **ZoomInfo** | Generic B2B contact/signal | Public (declining) | Horizontal | LOW | Shallow signals, no EF-specific scoring — Empire evaluated and rejected |
| **Affinity / Meridian** | Signal-enriched CRM | Various | PE/VC-focused | LOW | Empire evaluated and rejected — "not the right tool" |
| **Kaaj** | AI underwriting OS | $3.8M seed | Amur, Fundr, ~15 more | LOW under new framing (closed door, off-map) | No sourcing/placement at all |
| **Uptiq** | Agentic AI EF suite | ~$70M total | Marshall Capital, 140+ FIs claimed | LOW under new framing | No sourcing/placement at all |
| **Aloan** | AI underwriting layer | Unverified | None disclosed | LOW under new framing | No traction, no sourcing |
| **F2** | Vertical FS-AI | $24M | 100+ funds/banks claimed | LOW under new framing | Investor-side, no sourcing; degrading at Empire |
| **SharpEi** | AI intake automation | Unfunded | Via Tamarack partnership | LOW | Intake only, no sourcing |
| **Northteq (Aurora)** | Salesforce-native EF LOS | Undisclosed | 175+ EF lenders | LOW (different buyer) | LOS replacement, not a sourcing/intel layer |
| **Solifi / Odessa / Alfa / NETSOL** | Enterprise LOS + AI | Various PE | Thin AI-specific customers | LOW (wrong ICP) | Enterprise-only, no sourcing |

---

## Sources

- Alek's competitive brief (2026-06-18): `tokenrip.com/s/bf608197-2ee4-44d5-a4bc-9192901a5d3c`
- Alek's full-stack blueprint (2026-06-18): `tokenrip.com/s/6ce8bf75-e977-4278-87da-d4ee1efe519f`
- Empire Asset Finance / Katharine Rudzitis first call (2026-06-18): `bd/calls/transcripts/katharine-rudzitis-2026-06-18.md`
- [EDA Data](https://edadata.com/)
- [Fusable — About](https://fusable.com/about-us/)
- [Fusable launch — PR Newswire](https://www.prnewswire.com/news-releases/randall-reilly-launches-new-business-fusable-in-strategic-separation-from-talent-acquisition-business-302036269.html)
- [Crunchbase — Randall Reilly](https://www.crunchbase.com/organization/randall-reilly)
- [TEX Software](https://texsoftware.com/)
- [TEX Intel product page](https://texsoftware.com/tex-intel)
- [TEX Software — About](https://texsoftware.com/about)
- [TEX Software — Case Studies](https://texsoftware.com/case-studies)
- [Crunchbase — Tex](https://www.crunchbase.com/organization/tex-475d)
- [Tracxn — SharpEi AI Company Profile](https://tracxn.com/d/companies/sharpei-ai/__A1mBZIvDriPbBobCuXMhTFhJ4bxXUqRKoGEzxslndw0)
- [Tamarack/SharpEi partnership — Equipment Finance News](https://equipmentfinancenews.com/news/lender-operations/tamarack-sharpei-partner-on-ai-powered-origination-platform/)
- [SharpEi AI](https://www.gosharpei.com/)
- [Crunchbase — SharpEi (Elaxtik)](https://www.crunchbase.com/organization/elaxtik)
- Prior vault research: `intelligence/research/quintel/ai-document-workflow-competitive-landscape-2026-04-30.md`
- Prior vault research: `intelligence/research/quintel/research-f2-ai-private-markets-2026-06-18.md`

---

*Competitive landscape research. Companion to the GTM roadmap, engine build roadmap, and lender surface roadmap. Reframed 2026-07-13 around the buy-box-driven, market-intelligence-primary product direction, with new deep-dives on Fusable/EDA (the one infrastructure-level competitor identified in this sweep) and TEX Software (an adjacent-not-identical equipment-ownership sourcing tool). Update the landscape tracker (§8) as competitors move — Fusable in particular warrants a quarterly re-check given their capital and platform investment.*
