---
title: Quintel (Equipment-Finance) Build Architecture — One Engine, Three Consumers
status: active
owner: Simon
type: build-architecture
created: 2026-06-02
last_updated: 2026-06-04
product: Quintel
related:
  - bd/deals/equipment-finance/stauss-vfi-tokenrip-briefing.md
  - bd/deals/equipment-finance/equipment-finance-domain-primer-2026-05-30.md
  - product/tokenrip/mounted-agent-model.md
  - product/tokenrip/mounted-agent-synthesis.md
  - bd/calls/contacts/ted-craver.md
  - bd/calls/contacts/stauss-paulos.md
  - bd/calls/contacts/andy-cooper.md
---

# Equipment-Finance Build Architecture — One Engine, Three Consumers

> [!warning] **Superseded (2026-06-08).** This doc framed the three-archetype, Stauss-channeled, spine-first motion (VFI / Bevel / NED). The current canonical build + GTM doc is the **broker-first** motion: [[quintel-build-and-gtm-roadmap-2026-06-08]] (with the GTM gameplan in [[quintel-broker-first-gameplan-2026-06-08]]). Retained for reference — the core schemas (§10) and the free-public-source data edge (§9) carry forward.

> **Purpose:** The durable architecture + roadmap for the equipment-finance build. Companion to [[stauss-vfi-tokenrip-briefing]] (the *deal/relationship/strategy*) and [[equipment-finance-domain-primer-2026-05-30]] (the *industry*). This doc is the *build* — what we construct, in what order, and why it stays flexible as the Stauss-channeled cluster (VFI, Bevel, NED, …) widens. The build is productized as **Quintel** (quintel.ai), the equipment-finance vertical product powered by Tokenrip — see [[product/quintel/CLAUDE|Quintel product index]]. Home: `product/quintel/`.

---

## 1. Thesis — sell the hands, not the dashboard

**One engine, three consumers.** The engine emits a single object — a scored, structured, pre-qualified **deal** — and three layers consume it:

- the **interface** *renders* it (the read-only dashboard),
- the **hands** *act* on it (write actions: match, structure, draft, route),
- the **deal-graph** *stores* it with its outcome (the moat substrate).

The strategic consequence: **the dashboard is the cheap interface layer and sales collateral; the hands are the product.** A read-only dashboard never captures an outcome, so it never builds the deal-graph — it stays "a worse Apollo" forever ([[stauss-vfi-tokenrip-briefing|briefing]] §6). The hands are the only layer that puts Tokenrip *inside* the customer's deal flow, which is the only position from which outcomes (the moat material) can be captured. **Sell the hands; give the dashboard away as the funnel.**

This was validated three ways across the cluster: Bevel's pain is underwriting-memo + lender-matching (hands); NED's pain is lender-routing + structuring + status (hands, and *zero* sourcing — they have captive deal flow); and Stauss's own dashboard, useful as it is, dies at distribution because it's a local file with no hands and no shareable surface.

## 2. The stack

```
┌──────────────────────────────────────────────────────────────┐
│  SOURCES (plugins)   ZoomInfo/firmographics · news · UCC/lien │  ← public = no compliance surface
│                      · equipment RFP · EDGAR · capex guidance │
│                      · exec-change   (+ later: customer CRM)  │
├──────────────────────────────────────────────────────────────┤
│  ENGINE  (the stable spine — the IP)                          │
│   • source / match        • enrich · dedupe · entity-resolve  │
│   • SCORING / RUBRIC  (the §9 imprint — config, not code)     │
│   • signals / demand index + supply-chain propagation         │
│   • STRUCTURING  (residual · blind-discount · multi-unit ·    │
│                   FMV lease)              ← NED adds this      │
│            ↓ emits the DEAL OBJECT ↓                          │
├───────────────────────────────┬──────────────────────────────┤
│  INTERFACE (read)             │  HANDS (write — plugins)      │
│  the dashboard                │   • match / route             │
│  hosted @ stable Tokenrip URL │   • underwrite-memo           │
│  self-serve · zero-compliance │   • structure-quote           │
│  configurable views:          │   • draft-outreach            │
│   – sourcing cockpit  (VFI)   │   • status-track              │
│   – lender scorecard  (NED)   │  ↓ sandboxed · per-customer ↓ │
│   – underwrite+match  (Bevel) │                               │
├───────────────────────────────┴──────────────────────────────┤
│  DEAL GRAPH  (the moat substrate)                             │
│   captures the outcome on every acted-on deal →               │
│   feeds back into SCORING (closed loop, briefing §6)          │
└──────────────────────────────────────────────────────────────┘
```

The Deal-Object schema is already sketched in the domain primer (§9 "deal-graph capture schema") — deal size + ask, asset class + specifics, borrower profile, lender, priced vs. approved rate/term, funded amount + schedule, decline reason, current performance. **Design that object once and the whole system composes.** The v0 schemas (Deal Object, Signal, Cascade, Counterparty) are in §10, grounded in Stauss's own data models — see §9.

## 3. Design principles (the flexible-and-extensible part)

1. **Spine vs. plugins.** The **engine** and the **Deal-Object schema** are the *only* shared, stable core. Everything customer-specific is a **config**, a **source connector**, or a **hand** — never a fork of the spine. New customer = new config + connectors + hands. New vertical (real estate, auto, M&A) = same. *This is what turns a one-off into the vertical operating system (briefing §4) instead of a series of bespoke rebuilds.*

2. **The one-schema keystone.** Design the Deal Object once; the interface *renders* it, the hands *act* on it, the graph *stores* it + the outcome. The primer already says it: "the output definition doubles as the deal-graph capture schema." Get this object right and everything downstream is composition; get it wrong and you rebuild three times.

3. **The read/write compliance split = the go-to-market, in code.** The **read** layer touches only *public* data → no PII, no CRM, no compliance review → ships anywhere instantly as frictionless collateral. The **hands** layer touches *customer* systems → sandboxed, zero-retention, per-customer. This is the same boundary as "show the dashboard first, have the compliance conversation second," and it's the architected version of the "sandbox" answer that won the Ted/Bevel call. **The architecture mirrors the funnel** — lean into it.

4. **Rubric = config, not code.** Stauss's own instinct ("the box is just data; switching focus is one field") is correct. The scoring/rubric is per-customer, per-vertical configuration. That is what makes the engine template-able.

5. **One imprint-holder per node.** Stauss = VFI's imprint; Ted = Bevel's; **Andy Cooper = NED's.** Stauss is the *channel* across the cluster, but each node's §9.4 judgment material (the moat half) lives with its own operator. Collect the imprint from the operator who holds it, not from the channel.

## 4. The three archetypes

The cluster is not one customer type — it's three, and the differences are load-bearing for the build.

| | **VFI** | **Bevel** | **NED** |
|---|---|---|---|
| **Archetype** | Direct lender (balance sheet) | Placement broker (3rd-party) | Dealer captive-finance desk |
| **Imprint-holder** | Stauss | Ted Craver | Andy Cooper |
| **Sourcing pain?** | Yes (find borrowers) | Some | **None** (captive deal flow) |
| **Core hand needed** | underwrite | **match** + underwrite | **match/route** + structure + status |
| **Engine extras** | institutional rubric | per-lender memo | **structuring** (residual / blind-discount / multi-unit) |
| **Compliance surface** | High (PII, CRM) | High (PII) | Medium (their deal data) |
| **Conflict status** | encumbered (§7.4) | clean | clean |

**The unlock:** the **matching / placement hand is shared across Bevel, NED, and the small-ticket wedge** — the highest-reuse hand in the system. NED is therefore not a new product; it is **the Bevel matching spine + a structuring plugin + NED's config.** If it builds that way, the architecture is proven. If NED forces a fork, the architecture failed — so NED is the extensibility test, deliberately.

## 5. Roadmap (spine-first)

> Sequencing decision (2026-06-02): **spine-first.** Build the engine so NED slots in as a config; pursue the NED *deal* only after Bevel proves the pattern. Three nodes are open (Bevel, DCF, NED) and none is signed — breadth is racing depth, and focus is the scarce resource.

- **Phase 0 — Hosted collateral dashboard** *(days; for the next call).* Rebuild Stauss's HTML dashboard on the engine abstraction, one real data source, his criteria as the scoring config, hosted at a stable Tokenrip URL. Arms the channel (he's "kind of flying" today), solves his file-sharing pain, and dogfoods the core stable-URL primitive in front of finance buyers. **Trap:** a throwaway HTML clone disconnected from the engine. Build thin, but *on the spine*.

- **Phase 1 — Engine + Deal-Object schema + thin structuring/underwriting slice** *(1–2 wks).* Pluggable source connectors; config-driven scoring encoding the §9 rubric; demand index; **the Deal-Object schema defined even though the graph is empty**; and the briefing-§8 slice that outputs "fundable at ~X%, residual ~Y%, here's why," not just "fits." Calibrate the structuring against NED's real sample lease quote (HL985A: 8.98%, 60.3% residual, 36mo FMV, 5.48% blind discount). **Blocked on:** Stauss's §9.4 judgment half; Andy's residual logic (for structuring).

- **Phase 2 — First hand → Bevel.** Match + draft-outreach, wired to Bevel's deal graph (their $450M / 75-lender placement history in the broken 1990s DB). First read-write deployment; **the first real sale.** Bevel proves the matching spine and is the clean node (no §7.4 conflict).

- **Phase 2b — NED config** *(only after Bevel signs).* Same matching spine, NED config; lead with the **lender scorecard + routing** wedge — rank NED's 31 lenders on *realized outcomes* (approval consistency, pricing-hold through monthly resets, speed, communication) and recommend the 10 to keep, then route every new deal to the best fit. Add the structuring/residual plugin. Andy is the imprint-holder. This is a deal-graph use case a VP of Retail Finance understands in one sentence — and it starts the moat from NED's captive, asset-class-concentrated flow.

- **Phase 3 — Close the loop.** Outcome capture (placed / declined / priced / residual realized) feeds back into scoring. The moat begins *here* — the dashboard never reached it; the hands did. NED's $183M→$260M concentrated in dump trucks/loaders gives dense per-segment data (briefing §6: depth-within-segment beats breadth).

- **Phase 4 — Multiply.** New customers/verticals = new config + connectors + hands on the same spine. The Phase-0 dashboard becomes the permanent self-serve top-of-funnel generating agent leads across the cluster, with the embedded "ready for the agent?" upsell.

## 6. Pricing logic (falls out of the architecture)

- **Dashboard (read)** = cheap or free — collateral + lead-gen, with the embedded agent upsell. Do **not** stand up a self-serve SaaS *motion* around it (it's a funnel, not a destination, and it's the SaaS model Stauss himself dislikes — briefing §7.3).
- **Hands (write, wired to the deal graph)** = the ACV and the lock-in — the accumulating graph makes Tokenrip progressively harder to rip out. **Sell the hands.**

## 7. What to collect

- **Stauss:** the HTML dashboard file + his write-up of where it earns its keep; the **§9.4 judgment half** (disqualifiers / red flags / structure heuristics — the moat material that keeps lapsing); and his **economics/cut** in the cluster intros (§7.5 — unraised across four calls; a 1:1 conversation, not the group chat).
- **Andy Cooper** *(via Stauss, post-Bevel):* residual curves by asset class; the current 31-lender list + how he'd rank them; deal-intake format. (NED's sample lease quote already gives a structuring benchmark.)

## 8. Watch-outs

1. **Breadth racing depth** — three nodes open, zero signed. Spine-first protects focus; resist building NED before Bevel proves the pattern.
2. **Dashboard-as-destination** — read-only never builds the moat. Govern the dashboard strictly as collateral + funnel.
3. **One imprint-holder per node** — don't accept Stauss's characterization as a substitute for the operator's actual judgment (Andy for NED).
4. **Scope sprawl** (briefing §7.8) — every feature added to the dashboard should also be a feature the engine needs. The moment you add dashboard-*only* plumbing (self-serve billing, consumer onboarding), you've forked into the SaaS motion.

## 9. What Stauss's own artifacts confirmed (2026-06-02)

Stauss sent three Claude-built HTML files — a *Market Signal* dashboard (read layer), *Keystone* (a whole-stack command center), and a *Lender Network* CRM (a matching/outreach hand). They independently reproduce all four layers above — strong evidence the architecture matches the operator's mental model — and they settle four design points:

1. **The data-edge (§5) is answered — favorably.** Keystone's "query templates" name the EF-specific *free, public* sources he actually uses: **EDGAR 8-K Item 1.01** material-agreement full-text search (the public filer must *name the private counterparty* — "that name is the diamond"; the realized supply-chain / tier-2-3 mechanism), **USAspending** federal awards by NAICS, and **UCC-1 lien lookups** ("filing date → lease maturity → refi-timing window"). The edge is **mining these for EF + the imprint that reads them**, not better contact data (he runs on ZoomInfo — parity, as predicted). Build the SOURCES layer on these three first. (Briefing §5 updated.)

2. **Cascade templates — a first-class engine primitive.** Keystone's "Cascade Map" decomposes one detected project into a sequenced chain of 30+ financeable line items, each tagged with lane, ticket range, **financing structure** (loan / FMV lease / sale-leaseback / TRAC), and a **route decision** (in-box vs route-to-partner). It spans sourcing → structuring in one object, encodes part of the §9.4 structure judgment *for free*, and is pure config. It is the differentiated "anticipatory needs-assessment" capability no horizontal tool has. Schema in §10.

3. **Signal tier-discipline — bake provenance + decay into scoring AND the read layer.** Keystone grades every signal: **Tier 1** = EDGAR / USAspending / UCC (verifiable), **Tier 2** = IR / press / LinkedIn / trade, **Tier 3** = Reddit / Discord (*lead-only, never cited as fact*), plus a verification flag and age-decay → hot / warm / watch / filed. This drives scoring *and* solves the "survive a banker's poke" constraint: **every datum on the read layer carries its source + freshness.** Schema in §10.

4. **Read layer = live-where-cheap, annotate-always.** The Market Signal dashboard pulls live public data (FRED CSV, no API key, no compliance surface) and labels live-vs-static per tile. The real value is the **annotation** — each tile carries a role/asset-class-specific "lender read / pitch angle" (e.g. "used Class 8 firming → residual risk eased → structure leases more aggressively"). The annotation is the imprint and the anti-commodity layer; a raw chart is Bloomberg, the *read* is ours.

**The wedge, sharpened.** Keystone's own "Build Sequence" view tables exactly what he can't build alone — *server + cron + paid API for 24/7 ingest, hosting, multi-user login.* He has built the read/organize shell; the **live engine + hands + outcomes loop is the absent hard part** — precisely what Tokenrip sells. Don't pitch what he's already built; pitch the layer his own roadmap admits he's stuck on. **Caution:** ~90% of the Market Signal dashboard is hand-curated static content he can self-generate — keep it scoped as top-of-funnel collateral, not the product.

## 10. Core schemas (v0)

Grounded in Stauss's actual data models (Keystone's `signal` / `cascade` / `player`, the Lender Network `contact`) + the domain primer §9 capture schema. One **Deal Object**; the interface renders it, the hands act on it, the graph stores it + the outcome.

**Deal Object** — the keystone; design once.
```
DealObject {
  id
  borrower   { name, naics, revenue_band, geo, lane: V1|V2 }
  asset      { class, specifics, new_used, vintage }       // "2021 Cat 336, lien matures 2029"
  ask        { amount, purpose, structure_hint }
  source     { tier: 1|2|3, origin: EDGAR|USASPEND|UCC|IR|TRADE|REDDIT|…,
               verified: corroborated|single|unverified, link, asOf }    // ← provenance (Keystone)
  fit        { class: target|general|out, credit_estimate, in_credit_range: bool }  // ← General/Target doc
  demand     { signals: Signal[], score, band: hot|warm|watch|filed }    // ← Keystone scoreSignal
  structure  { type: loan|FMV_lease|sale_leaseback|TRAC, term, rate_band,
               residual_pct, blind_discount, payment }                    // ← NED structuring
  match      { candidates: [{ counterparty_id, fit_reason, capacity }], recommended }  // ← Bevel/NED hand
  outcome    { stage: sourced|qualified|proposed|approved|funded|declined,
               priced_rate, approved_rate, funded_amount, schedule,
               decline_reason, performance }               // ← empty until in the loop = the moat
}
```

**Signal** — from Keystone; provenance-graded + time-decaying.
```
Signal {
  id, src: EDGAR|USASPEND|UCC|IR|LINKEDIN|TRADE|KALSHI|…,
  tier: 1|2|3,                       // 1 verifiable · 2 reliable · 3 lead-only
  fit: V1|V2|both|off,
  urgency: high|med|low|evergreen,
  verified: corroborated|single|unverified,
  title, detail, link, created
}
// score = base(tier) + urgency + verification − age_decay  →  band: hot|warm|watch|filed
```

**Cascade template** — from Keystone; trigger → phased financeable chain. Pure config.
```
CascadeTemplate {
  project, range,
  trigger,                    // 8-K · utility interconnection · contract award · exec hire · permit
  phases: [{
    phase, lane: V1|V2|both|route-out, in_box: bool, range,
    items: [...],
    structure,                // loan | FMV lease | sale-leaseback | TRAC
    route                     // "" = in box · else "CRE/SBA" | "licensed players" | …
  }]
}
```

**Counterparty (lender)** — from the Lender Network + NED scorecard. `fit`/`hook` are imprint; `performance` is the deal-graph layer that turns a list into a *ranking*.
```
Counterparty {
  id, name, firm, contact { email, phone, linkedin },
  relationship: complementary | peer | placement_panel,    // referral · co-lend · placement
  box: { deal_size, products[], industries[], geo, residual_floors? },
  fit,    // why they match  (imprint)
  hook,   // opening line     (imprint)
  performance { approval_rate, pricing_hold, speed_days, comms_score,
                deals_placed, last_outcome }               // ← NED scorecard; empty until outcomes flow
}
```

> The **hand** is `record + imprint → ready artifact`: the Lender Network already does this (matched counterparty + `fit`/`hook` → a pre-filled draft email). Our match / structure / outreach hands are the same shape — LLM-personalized and wired to the customer's deal graph.

---

*Living build doc. Update §5 (roadmap) and §4 (archetypes) as nodes move. Source thinking: working session 2026-06-02. Siblings: [[stauss-vfi-tokenrip-briefing]], [[equipment-finance-domain-primer-2026-05-30]].*
