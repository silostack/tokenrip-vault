# Deal Engine — Equipment-Finance Deal Intelligence Platform
### Engineering build specification · V1

> **Status:** build-ready spec · **Working codename:** "Deal Engine" (product name TBD — see §17)
> **Audience:** the engineer/agent who will scaffold and build this. Self-contained — you need no other document.
> **Bundled with this spec:** three reference HTML files in `./reference/` (`market-signal-dashboard.html`, `keystone.html`, `lender-network.html`). They show the look, feel, and component vocabulary to build toward. They are **design reference, not source to ship** — see §13.

---

## 0. Read this first — operating rules

1. **Build V1 (§3), not the whole castle.** This document carries a lot of architectural context so the *bones* are right. That context exists to keep V1 extensible — it is **not** a build list. Build exactly the V1 scope in §3; everything past it is "design so as not to preclude," not "build now."
2. **Synthetic and public data only.** Every company name, lender, contact, and deal figure in this build is **fictional or public**. Never hardcode, ingest, or display real private third-party data. The reference HTML has already been scrubbed to fictional data; keep it that way.
3. **No real identities.** There are real businesses behind this product. They do not appear here and must not appear in code, comments, seed data, or UI. The three customer types are referred to **generically** (Direct Lender / Placement Broker / Dealer Desk).
4. **Standalone now, extractable later.** Build this as its own repo and deployable. But isolate the **engine** and the **data model** as clean, framework-agnostic modules (§4, §11) so they can later be lifted into a larger platform without a rewrite. This is the single most important architectural constraint.

---

## 1. Thesis — what we're building and why it's shaped this way

**One engine, three consumers.** The system has a single core — an **engine** that turns raw public signals into a scored, structured, pre-qualified **Deal Object**. Three layers consume that object:

- The **interface** *renders* it — a read-only dashboard.
- The **hands** *act* on it — write actions (match, structure, draft, route, track).
- The **deal-graph** *stores* it with its **outcome** — the data asset that compounds.

**We sell the hands, not the dashboard.** A read-only dashboard is cheap, frictionless collateral — but it never captures an *outcome*, so it never builds the data asset, and it stays "a prettier Apollo" forever. The **hands** are the product: they sit inside the deal flow, take actions, and capture what happened (placed / declined / priced / funded). That outcome data is the moat. **V1 builds a compelling read interface AND a first working hand** so the architecture is proven end-to-end, even though the deepest value accrues later as outcomes accumulate.

**Why the read/write split is the backbone.** It mirrors how this gets sold *and* how it must be secured:

| | **Read layer (interface + sources)** | **Write layer (the hands)** |
|---|---|---|
| Data touched | Public only (filings, awards, liens, market data) | A customer's own systems and deals |
| Compliance surface | ~Zero — ship anywhere | High — sandboxed, per-customer, zero-retention |
| Role | Frictionless demo / lead-gen | The product · the lock-in · the revenue |

Build them as **separate modules with a hard boundary**. The read layer must never depend on customer data; the hands must never leak across customers.

---

## 2. The customer & the domain (zero-background primer)

The buyer is a player in **equipment finance**: financing the purchase of physical business equipment (construction machines, trucks, medical/IT gear, marine vessels, manufacturing lines). You do not need finance expertise to build this — here is everything the data model assumes.

### 2.1 The four financing structures

| Structure | Mechanic | Why it matters to the model |
|---|---|---|
| **Loan** | Borrower owns the gear immediately; repays principal + interest; sometimes a balloon at the end. | Simplest. No residual. |
| **FMV lease** (Fair Market Value) | Lessor owns the gear; lessee pays to use it for a term (commonly 24–36 mo); at term-end the lessee returns, renews, or buys at fair value. The lessor sets a forecast **residual** (the gear's worth at term-end) which lowers the monthly payment. | The residual is a *forecast* and the core risk/skill. The structuring calculator (§6.4) centers on this. |
| **Sale-leaseback** | Borrower sells owned equipment to the lessor and leases it back — a liquidity event. | A variant of the lease; same residual mechanics. |
| **TRAC lease** | Terminal Rental Adjustment Clause — a lease (typically titled vehicles) where the residual gap is trued-up in cash at term-end. | A lease flavor; one enum value. |

### 2.2 Five terms the model uses

- **Residual** — forecast value of the asset at lease-end, expressed as a % of cost (e.g., 58%). Asset-class-specific: cranes hold value (stable residual), trucking is cyclical (volatile), construction loaders sit in between. **Not fungible across asset classes** — each needs its own curve.
- **Blind discount** — a manufacturer/vendor concession to the dealer/lessor, *not* shown to the end customer. Folds into cost basis and effective yield. Only a **dealer desk** sees it; a pure lender never does.
- **Multi-unit** — one financing facility covering several machines at once (e.g., five loaders). Requires blended residuals across the units. Common for dealer desks (the majority of their volume).
- **Lender panel & consolidation** — a desk that *places* deals works with a panel of lenders. Panels sprawl (e.g., 30+) and desks want to consolidate to the best 5–10. Ranking lenders on *realized outcomes* is a core use case (the "lender scorecard," §7).
- **Monthly program reset / pricing-hold** — placement programs re-price monthly; the lenders who *hold their pricing reliably* through resets win the desk's volume. A scorecard metric.

### 2.3 The three customer archetypes (referred to generically throughout)

The same engine serves three buyer shapes. They differ only in **which hand** they need — which is exactly why the architecture is "one spine, many configs."

| Archetype | What they are | Core pain | Hand they need first |
|---|---|---|---|
| **Direct Lender** | Lends off its own balance sheet. | Find qualified borrowers *and* underwrite fast. | underwrite + source |
| **Placement Broker** | Matches borrowers to third-party lenders for a fee. | Match the right lender; prep the memo. Often runs a broken legacy database. | **match** + underwrite-memo |
| **Dealer Desk** | An equipment dealer's in-house finance desk; finances its *own* sales and places them across a lender panel. **Zero sourcing pain** (captive deal flow). | Route each deal to the best-fit lender; consolidate the panel; structure multi-unit FMV leases. | **match/route** + structure + status |

**The shared hand is matching/placement** — needed by the Broker *and* the Dealer Desk (and any future small-ticket play). It is the highest-reuse hand and therefore **the first hand V1 builds** (§3, §8). A Dealer Desk is just "the matching spine + a structuring module + that desk's config" — not a new product. That reuse is the whole thesis; the build must preserve it.

> **Note on sourcing vs. acting.** The Direct Lender has a *sourcing* problem (find deals); the Dealer Desk has an *acting* problem (route/structure deals it already has). The read dashboard (sourcing cockpit) is worth a lot to the former and near-nothing to the latter. This is the clearest proof that the **hands**, not the dashboard, are the universal product.

---

## 3. Product definition — the V1 to build

**V1 is a working deal-intelligence engine with a hosted dashboard and a first functioning hand, all on synthetic + live-public data.** It must be demo-credible to a finance audience and architecturally honest (real engine, not a mock). Concretely, V1 ships:

**Engine (real):**
- **≥2 live public source connectors** running against real APIs — **EDGAR 8-K** and **USAspending** are the required two; **UCC** is a third connector with at least a stub + one working path or CSV import (§10).
- **Config-driven scoring** that turns signals into a score + band (`hot|warm|watch|filed`) — the rubric is **data, not code** (§6.3).
- A **structuring calculator** for FMV leases — payment / residual / blind-discount / multi-unit math, calibrated against the synthetic sample in §6.4.
- The **Deal Object** persisted to Postgres via the schema in §5.

**Interface (real, hosted, gated):**
- A **dashboard** at a stable public URL behind a **single password gate** (§12).
- Three views, unified into one design system (§7): **Sourcing cockpit** (scored deal feed + market signals), **Lender scorecard** (rank a panel on seed outcomes), **Deal/underwrite queue** (a deal's detail + structuring + match).

**Hands (one real, rest stubbed):**
- **One working hand: match/route** — given a Deal Object, rank candidate lenders from the panel by fit + (seed) performance and recommend a route, operating on **synthetic deal-graph data**. Full logic + UI; **not** wired to any real customer system.
- The other hands (underwrite-memo, structure-quote, draft-outreach, status-track) exist as **typed stubs** with UI affordances, returning placeholder output — enough to show the shape, not wired to live action.

**Deal-graph (schema live, mostly empty):**
- The outcome-capture tables exist and the match hand reads seed performance from them; real outcome accumulation is post-V1 (§9).

**Explicitly NOT in V1:** real customer-system integration of any hand; user accounts / multi-tenant auth; billing; document parsing/extraction (see §11 note on the optional extraction seam); more than ~3 sources.

The target the V1 must **not preclude**: more sources, more hands, multiple customer configs on one spine, and the closed outcome loop (§9) that turns this from intelligence-tool into moat.

---

## 4. System architecture

```
┌──────────────────────────────────────────────────────────────────┐
│  SOURCES  (connectors, pluggable)                                  │  PUBLIC DATA
│   EDGAR 8-K · USAspending · UCC liens   (+ later: market feeds,    │  → zero compliance
│   firmographics, customer CRM)                                     │     surface
├──────────────────────────────────────────────────────────────────┤
│  ENGINE   (the stable spine — the extractable asset)               │
│   normalize → enrich · dedupe · entity-resolve                     │
│   SCORING / RUBRIC          (config, not code)                     │
│   SIGNALS / demand index    (tier · urgency · verification · decay)│
│   STRUCTURING               (residual · blind-discount · multi-unit)│
│        ↓ emits the DEAL OBJECT ↓                                   │
├─────────────────────────────────┬────────────────────────────────┤
│  INTERFACE  (read)              │  HANDS  (write — pluggable)       │  CUSTOMER DATA
│   dashboard @ stable URL        │   match/route   ← V1 builds this  │  → sandboxed,
│   password-gated, zero-PII      │   underwrite-memo   (stub)        │     per-customer
│   views: cockpit · scorecard ·  │   structure-quote   (stub)        │
│          deal/underwrite queue  │   draft-outreach    (stub)        │
│                                 │   status-track      (stub)        │
├─────────────────────────────────┴────────────────────────────────┤
│  DEAL GRAPH  (the moat substrate)                                  │
│   captures the OUTCOME on every acted-on deal →                    │
│   feeds back into SCORING (closed loop — post-V1)                  │
└──────────────────────────────────────────────────────────────────┘
```

**Module boundaries (enforce these):**

- **`engine`** is a pure TypeScript library: it takes inputs (raw source records, a rubric config, a deal) and returns Deal Objects / scores / structures. **No web framework, no direct DB calls, no I/O.** Persistence and HTTP live outside it. This is what makes it liftable into another platform later.
- **`schema`/`contracts`** holds the Deal Object and friends as the single source of truth (Zod schemas → inferred TS types). Everything imports types from here.
- **Sources** and **hands** are **plugins** behind interfaces (`SourceConnector`, `Hand`). Adding a source or a hand = implementing an interface + registering it; never editing the spine.
- **The read layer and the hands never share a data path.** Read consumes the public pipeline; hands consume per-customer context. A customer config selects which views and which hands are active.

**Standalone-now / extractable-later:** the app (HTTP + DB + UI) is disposable scaffolding around two durable assets — `engine` and `schema`. Keep those two free of app-specific dependencies and the later extraction is mechanical.

---

## 5. The data model (the cornerstone)

Design the Deal Object **once**; the interface renders it, the hands act on it, the graph stores it + the outcome. Implement as Zod schemas in `packages/schema`; the shapes below are the contract.

```ts
DealObject {
  id
  borrower   { name, naics, revenue_band, geo, lane: V1|V2 }
  asset      { class, specifics, new_used, vintage }        // "2021 wheel loader, lien matures 2029"
  ask        { amount, purpose, structure_hint }
  source     { tier: 1|2|3, origin: EDGAR|USASPEND|UCC|IR|TRADE|REDDIT|…,
               verified: corroborated|single|unverified, link, asOf }   // provenance — always label it
  fit        { class: target|general|out, credit_estimate, in_credit_range: bool }
  demand     { signals: Signal[], score, band: hot|warm|watch|filed }
  structure  { type: loan|FMV_lease|sale_leaseback|TRAC, term, rate_band,
               residual_pct, blind_discount, payment }
  match      { candidates: [{ counterparty_id, fit_reason, capacity }], recommended }
  outcome    { stage: sourced|qualified|proposed|approved|funded|declined,
               priced_rate, approved_rate, funded_amount, schedule,
               decline_reason, performance }                 // empty until in the loop = the moat
}
```

```ts
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

```ts
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

```ts
Counterparty {                // a lender on the panel
  id, name, firm, contact { email, phone, linkedin },
  relationship: complementary | peer | placement_panel,    // referral · co-lend · placement
  box: { deal_size, products[], industries[], geo, residual_floors? },
  fit,    // why they match  (the operator's judgment)
  hook,   // opening line     (the operator's judgment)
  performance { approval_rate, pricing_hold, speed_days, comms_score,
                deals_placed, last_outcome }               // the scorecard; empty until outcomes flow
}
```

**Field notes that matter for the build:**
- `lane: V1|V2` is the customer's segmentation (e.g., small-ticket vs. middle-market) — a config concept, not hardcoded thresholds.
- `source.verified` and `source.tier` are **provenance** — the UI must surface them on every datum (a finance buyer trusts the tool only if it shows *why* it believes a signal). See §6.3.
- `outcome` is the moat field. It is empty in V1 except for seeded scorecard demo data. Everything is designed so that when a hand acts, it writes here.
- A `CascadeTemplate` is a reusable decomposition of a big project (e.g., a data-center build) into financeable phases — it lets one trigger signal fan out into multiple deal opportunities. V1 ships ~3 templates as seed (data center / manufacturing line / cold-chain), editable.

---

## 6. The engine

### 6.1 Source connector interface
```ts
interface SourceConnector {
  id: 'EDGAR' | 'USASPEND' | 'UCC' | string
  pull(params): Promise<RawRecord[]>      // hit the live API
  toSignals(raw: RawRecord): Signal[]     // normalize → Signal(s)
}
```
Each connector is independently testable against the live API (§10) and emits `Signal`s. Connectors never score — they only normalize.

### 6.2 Enrich · dedupe · entity-resolve
Between sources and scoring: resolve the same borrower seen via two sources into one entity (name + NAICS + geo heuristics), dedupe signals, attach firmographics where available. Keep this a discrete, testable step; a naive v1 (normalize names, match on NAICS+state) is fine — leave the seam for something better.

### 6.3 Scoring — rubric as config (not code)
The rubric is a JSON/YAML document the engine reads. Changing a customer's priorities = editing config, never code. Example rubric:

```jsonc
{
  "lanes": {
    "V1": { "revenue_min": 5_000_000,  "revenue_max": 50_000_000 },
    "V2": { "revenue_min": 50_000_000, "revenue_max": 1_000_000_000 }
  },
  "tierBase":        { "1": 50, "2": 30, "3": 10 },   // signal source tier
  "urgencyWeight":   { "high": 30, "med": 15, "low": 5, "evergreen": 2 },
  "verifyWeight":    { "corroborated": 20, "single": 5, "unverified": 0 },
  "ageDecayPerDay":  0.5,
  "bands":           { "hot": 80, "warm": 60, "watch": 40, "filed": 0 }
}
// score = tierBase + urgencyWeight + verifyWeight − ageDecayPerDay * ageDays
// band  = highest threshold the score clears
```
**Tier discipline is a feature, not just a number.** Tier-1 sources (EDGAR / USAspending / UCC — verifiable public filings) outrank Tier-2 (IR pages, press, trade media, LinkedIn) which outrank Tier-3 (forums, lead-only). The UI must show the tier + verification on every signal so the score is *legible*. This legibility is a core selling point against generic contact-data tools.

### 6.4 Structuring calculator
Given `(cost, term_months, annual_rate, residual_pct, blind_discount_pct)`, compute the FMV-lease monthly payment and the economics. Use the standard arrears annuity-with-residual formula:

```
i   = annual_rate / 12
n   = term_months
FV  = cost * residual_pct
PMT = (cost − FV*(1+i)^−n) * i / (1 − (1+i)^−n)
net_to_vendor = cost − cost*blind_discount_pct
```

**Synthetic calibration sample (use this as the acceptance fixture — it is fictional):**

| Input | Value |
|---|---|
| Asset | 2026 wheel loader (synthetic) |
| Equipment cost | $500,000 |
| Term | 36 months FMV |
| Annual rate | 9.00% |
| Residual | 58% → $290,000 |
| Blind discount | 5.00% → $25,000 |

→ **Monthly payment ≈ $8,853** (arrears) · **net to vendor = $475,000**. The calculator must reproduce the payment within ±$5. Support **multi-unit** by summing per-asset schedules with a blended residual. Expose advance-vs-arrears as a flag (default arrears).

---

## 7. The interface

A single hosted dashboard with three views, unified into **one** design system. The three reference files each use a different aesthetic; **do not ship three looks** — consolidate.

**Design language (default):** the clean, light, finance-credible palette from `reference/market-signal-dashboard.html` is the primary system:
- Accent green `#00c805`, alert orange-red `#ff5000`, amber `#ff9500`; light/cream surfaces.
- Type: `Inter` (UI), `DM Serif Display` (headlines), `JetBrains Mono` (numbers, timestamps, provenance).
- A dark mode may borrow the `reference/lender-network.html` dark palette later; not required for V1.

**Views:**

1. **Sourcing cockpit** — the scored deal feed + a market-signal header. This is the demo hero. Components: KPI stat cards, a live ticker, expandable signal tiles ("why it matters" + "action"), the scored deal list with `hot|warm|watch|filed` bands and **visible provenance** (tier + verification badge + source link) on every row.
2. **Lender scorecard** — a panel of `Counterparty`s ranked on `performance` (approval rate, pricing-hold, speed, comms). Filter by `box` (deal size / product / geo). This is the Dealer-Desk wedge: "rank my panel; tell me the best fit." Reads seed performance data in V1.
3. **Deal / underwrite queue** — a single Deal Object in detail: borrower + asset + ask, the demand signals, the **structuring calculator** (interactive — change residual/term/rate, see payment), and the **match hand** output (ranked candidate lenders + recommended route + draft-outreach stub).

**Component inventory to build** (all present, scrubbed, in the reference files): stat cards, expandable tiles, tier/urgency/verification badges, score meters/bands, filter chips, search, sortable tables, modal detail view, progress bars, a copy-to-clipboard, an email-draft template. Reuse their structure and CSS; replace their data with engine output.

---

## 8. The hands (write actions)

A hand is a registered plugin that takes a Deal Object (+ customer context) and performs an action, **writing the result/outcome back to the deal-graph**.

```ts
interface Hand {
  id: 'match' | 'underwrite_memo' | 'structure_quote' | 'draft_outreach' | 'status_track'
  run(deal: DealObject, ctx: CustomerContext): Promise<HandResult>   // result includes the outcome delta
}
```

**V1 builds `match` for real (on synthetic data):**
- Input: a Deal Object + the lender panel.
- Logic: filter panel by `box` fit (deal size / product / industry / geo / residual floor), rank by fit + `performance`, return ranked `match.candidates` + `match.recommended` + a one-line `fit_reason` each.
- Output: writes `match` onto the Deal Object and a `proposed` row toward `outcome` (synthetic).
- UI: the ranked list + "route to" action in the deal queue view; `draft_outreach` stub produces a templated opener.

**Stubs (typed, UI-present, placeholder output):** `underwrite_memo`, `structure_quote` (can wrap the real §6.4 calculator for a quick win), `draft_outreach`, `status_track`. Each returns a clearly-marked placeholder so the surface is demonstrable.

**Hard rule:** in V1 no hand connects to a real external customer system. Hands operate on synthetic/seed data only. Wiring a hand to a customer's CRM/deal system is post-V1 and **gated on a signed customer** + a compliance conversation (§14, §15).

---

## 9. The deal-graph (the moat — schema now, fill later)

The graph is the per-customer store of **deals + their outcomes**. Every hand action appends to it. Over time it answers "which lenders actually approve/hold-price/move fast" and "what scored deals actually funded" — which feeds back into scoring (the closed loop).

V1: create the tables (Deal Object persistence + an `outcomes` table keyed by deal + counterparty), seed enough lender `performance` to make the scorecard real-looking, and have the `match` hand read from it. The **feedback into scoring is post-V1** — but the schema must already support it (don't model outcomes as an afterthought).

---

## 10. Data sources & access (all free / public)

| Source | Access | Pull | Derived signal |
|---|---|---|---|
| **EDGAR 8-K** | SEC EDGAR full-text search (`https://efts.sec.gov/LATEST/search-index?q=...`) + `data.sec.gov` submissions API. Declare a `User-Agent` header; ~10 req/s courtesy limit; free. | 8-K filings, **Item 1.01 "Entry into a Material Definitive Agreement."** Public filers must *name the private counterparty* — that named supplier/contractor is the lead. | Tier-1: a named private company entering a major agreement → capex / supply-chain emergence. |
| **USAspending** | `POST https://api.usaspending.gov/api/v2/search/spending_by_award/` — filter by NAICS + award amount. Free, generous limits, no key. | Federal contract awards by industry code + size. | Tier-1: a private contractor winning sizable awards → growth-stage capex need. |
| **UCC-1 liens** | State Secretary-of-State UCC search. **No single national free API** — coverage is state-by-state (some free online search, some fee). | Secured-interest filings on equipment/leases: filer, secured party, collateral, **filing date**. | Tier-1: filing date + typical lease term → **maturity / refi window** (the timing signal). |

**V1 source plan:** implement **EDGAR** and **USAspending** as fully live connectors (required). For **UCC**, ship the connector interface + one working path (a state with free search) **or** a CSV-import fallback so the signal type is represented; full multi-state UCC coverage is post-V1 (§17 open item). The edge is mining these public timing/event sources — *not* buying better contact data.

---

## 11. Tech stack & repo layout

**Stack** (mirrors the language/DB/frontend choices of the platform this will later fold into, without coupling to it):

- **Language:** TypeScript throughout. **Runtime/PM:** Bun (or pnpm) workspaces, monorepo.
- **Engine & schema:** plain TS packages. Schema via **Zod** (runtime validation + inferred types); later can emit JSON Schema for cross-language use.
- **API:** a thin, fast layer — **Hono** or **Fastify** — consuming the `engine` package and persisting via the DB. (Documented as portable to NestJS later; keep route handlers thin so the swap is mechanical.)
- **DB:** **PostgreSQL.** Migrations/queries via **Drizzle** (fast to stand up). The `engine` is DB-agnostic — it talks to a `Storage` port interface, so the ORM choice never touches the spine.
- **Frontend:** **React 19 + Vite + TanStack Router + TanStack Query.** Charts: a light lib (e.g. `visx`/`recharts`) or hand-rolled SVG to match the reference look.
- **Deploy:** single public VPS (Docker Compose: `postgres` + `api` + `web` behind Caddy for auto-TLS), or equivalent. No serverless requirement.

```
deal-engine/
├─ packages/
│  ├─ schema/         # Zod schemas + types: DealObject, Signal, CascadeTemplate, Counterparty
│  └─ engine/         # PURE: connectors, enrich, scoring(config), structuring, hands registry
│     ├─ sources/     #   EDGAR.ts, USASPEND.ts, UCC.ts  (implement SourceConnector)
│     ├─ scoring/     #   score(signal, rubric) ; rubric loaded as config
│     ├─ structuring/ #   fmvLease(), multiUnit(), blindDiscount()
│     └─ hands/       #   match.ts (real) ; *.stub.ts
├─ apps/
│  ├─ api/            # Hono/Fastify ; Storage(Postgres/Drizzle) ; password gate middleware
│  └─ web/            # React/TanStack ; 3 views ; design system from reference/
├─ config/
│  ├─ rubric.example.json
│  └─ panel.seed.json         # synthetic lenders + seed performance
└─ reference/         # the 3 scrubbed HTML files (design reference)
```

> **Optional extraction seam (post-V1, do not build now):** when the underwrite-memo hand needs to parse uploaded financials/deal memos, there is a separate document-extraction engine it can call as a service rather than reimplementing parsing. V1 does not touch documents, so this is just a named seam in the `underwrite_memo` stub — not a dependency.

---

## 12. Ops / deployment & the access gate

**Access gate = one shared password, no accounts.**
- A single env var `ACCESS_PASSWORD`. Unauthenticated requests get a minimal `/login` page (password field only).
- On match: set a **signed, httpOnly, secure** cookie (HMAC of a session value with `SESSION_SECRET`, with expiry, e.g. 30 days). Middleware checks the cookie on every route except `/login` and static assets. No user records, no DB rows — it is a doormat, not an auth system.
- **Optional attribution upgrade (cheap):** support `ACCESS_PASSWORDS` as `label:password` pairs (e.g. `prospectA:xy12`), record which label authenticated → know *who's looking*. Use this only if per-prospect lead capture is wanted.
- **No crypto/wallet gating.** This is a finance buyer; a wallet gate would confuse, not protect.

**Lead/usage capture (optional, light):** a privacy-light analytics tag (e.g. Plausible or PostHog) to see view counts / which views get used. Not required for V1 function.

**Secrets/env:** `DATABASE_URL`, `ACCESS_PASSWORD`(/`ACCESS_PASSWORDS`), `SESSION_SECRET`, `SEC_USER_AGENT` (required by EDGAR), optional `ANALYTICS_KEY`. Never commit; provide `.env.example`.

---

## 13. Confidentiality & the reference assets

The three files in `./reference/` are **scrubbed** — fictional companies, fictional lenders, public market data only. Use them for **layout, CSS, and component structure**. Rules:
- **Never** reintroduce a real company, lender, person, email, phone, or private deal figure — not in code, comments, seed data, or UI.
- All seed data (`panel.seed.json`, demo deals, demo signals) must be **obviously synthetic**.
- Market/macro numbers must be **public and attributed** (ISM, Census, Fed, ACT Research, etc.) or clearly labelled example data.
- Keep the read layer **PII-free** by construction (it consumes only public filings/awards/liens).

---

## 14. Build sequence

1. **Scaffold** the monorepo (§11). Stand up `schema` (Zod) and `engine` skeletons with the `SourceConnector`/`Hand`/`Storage` interfaces. Postgres + migrations for Deal Object + outcomes.
2. **EDGAR + USAspending connectors** live; normalize → `Signal`s; **scoring from `rubric.example.json`** → scored Deal Objects in the DB. *Acceptance:* a live query yields N scored, banded, provenance-labeled deals.
3. **Structuring calculator** (§6.4) + its acceptance fixture.
4. **Dashboard**: the three views over real engine output, unified design system, behind the password gate. Seed the lender panel + performance for the scorecard.
5. **`match` hand** (real, synthetic data) wired into the deal-queue view; the other hands as typed stubs with UI.
6. **UCC** connector path or CSV fallback; CascadeTemplate seeds.
7. **Polish** for demo (the cockpit hero, the interactive structuring, the scorecard).

**Post-V1 (gated on a signed customer, not on tech):** wire a hand to a real customer system (sandboxed, per-customer); begin real **outcome capture**; turn on the **closed loop** (outcomes → scoring); add customer #2 as a new **config** (proving the spine). Do not start these before a customer pulls.

---

## 15. Watch-outs / non-goals

- **The dashboard is not the destination.** It's collateral + funnel. Every feature added to the read layer should also be something the engine needs. The moment you add dashboard-*only* SaaS plumbing (self-serve billing, account management, onboarding flows) you've forked into a different product. Don't.
- **Don't build past V1 before a customer pulls.** A polished product with no signed customer is the known failure mode. V1 is demo collateral that earns the next conversation; the first *sale* is a hand wired to a real customer.
- **Keep the engine extractable.** No app/DB/framework imports inside `packages/engine` or `packages/schema`. If you're tempted to `import` Hono or Drizzle there, stop — pass a port instead.
- **Provenance is non-negotiable.** Every signal/score shows tier + verification + source. A finance buyer trusts legibility, not a black box.
- **No real PII, ever** (§13).

---

## 16. Verification / acceptance criteria

- **Connectors:** an EDGAR query and a USAspending query each return ≥1 real result that normalizes into ≥1 `Signal` with correct `tier`/`origin`/`link`.
- **Scoring:** changing a weight in `rubric.example.json` (no code change) measurably moves scores/bands; every scored deal carries visible provenance.
- **Structuring:** the §6.4 synthetic fixture reproduces payment ≈ $8,853 (±$5) and net-to-vendor $475,000; a 2-unit case blends correctly.
- **Scorecard:** lenders rank by seed `performance`; `box` filters apply.
- **Match hand:** for a given deal, returns a ranked candidate list + a recommended route with fit reasons, writing `match` onto the deal.
- **Gate:** all app routes 302 to `/login` without the cookie; correct password sets the cookie and grants access; wrong password does not.
- **Engine purity:** `packages/engine` and `packages/schema` have no dependency on the API/DB/UI packages (enforce via lint/boundaries).
- **Confidentiality:** grep the whole repo — zero real company/lender/person identifiers; all demo data synthetic.

---

## 17. Open items (decide during scaffolding)

- **Product name** — replace the "Deal Engine" placeholder.
- **API framework now** — Hono/Fastify (speed) vs. NestJS (immediate convergence). Default: Hono now, keep handlers thin.
- **ORM** — Drizzle (default, speed) vs. the heavier option; the `Storage` port makes this reversible.
- **UCC coverage** — which state(s) to implement live vs. CSV-import for V1.
- **Per-prospect passwords** — single shared password (default) vs. `label:password` attribution.
- **Design** — confirm the light "market-signal" palette as the single system (default) vs. the dark "lender-network" look.
```
