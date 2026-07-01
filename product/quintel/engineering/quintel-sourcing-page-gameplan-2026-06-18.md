---
title: Quintel Sourcing Page — Update Gameplan (restore multi-source breadth)
status: active
owner: Simon → Quintel engineering (Lee)
type: build-gameplan / design-spec
created: 2026-06-18
context: "Pre-demo update plan for the Katharine / Empire Asset Finance call. The Sourcing page currently over-indexes on sponsors; this restores the multi-source breadth (much of which existed before) and reframes sponsors as one lens of a multi-source engine."
related:
  - product/quintel/quintel-sourcing-signals-prd-2026-06-16.md
  - product/quintel/quintel-demo-product-issues-2026-06-17.md
  - active/quintel-katharine-demo-prep-2026-06-16.md
---

# Quintel Sourcing Page — Update Gameplan

## The problem (one paragraph)
The Sourcing page reads as a **sponsor-watcher** — the hero is "Which sponsors should we be watching for you?" and the sponsor watchlist dominates. The multi-source engine is real but buried (it only appears in the below-fold Signal log and as provenance badges over on the Deals tab). The risk in the room: Katharine concludes "so you watch my sponsors, that's it?" and caps the capability. **The earlier version of this screen surfaced the other sources; they were removed when we narrowed to sponsors. This plan restores that breadth, reframes sponsors as one *lens* of a multi-source engine, and adds a few high-value sources — without losing the sponsor edge (which is still the lens we lead with for her).**

> **Good news for scope:** the underlying data already spans sources. The Deals tab already carries **EDGAR / UCC / TRADE / IR** provenance badges, and existing demo deals already have multi-source demand signals (Granite Ridge = UCC lien; Confluence = trade contract award; Larkspur = EDGAR 8-K; Meridian = USAspending federal award). So the Signal log can be populated from data that **already exists** — this is mostly a presentation/restoration task, not new ingestion.

---

## The mental model to encode: two axes + one constant

- **SOURCES (what we watch):** SEC filings (EDGAR/SEDAR+) · federal contract awards (USAspending) · UCC lien filings · regulatory forcing-functions · sponsor activity · (adds: building permits, utility/grid interconnection, federal grant/loan programs) · a thin macro/trade overlay.
- **LENSES (how you point it):** by **Sponsor** (her relationships — the default), by **Sector**, by **Trigger type**.
- **THE CONSTANT:** every surfaced lead shows its **box-fit verdict** (in-box / open-to-band / out). That's the through-line, regardless of source or lens — it's what makes this "pre-qualified deal flow," not Apollo.

Sponsors stay the **lead lens** (it's her channel and the part competitors structurally lack) — but as a view on a multi-source engine, not the whole page.

---

## Source catalog for Empire (restore + add)

Ranked by Empire-fit. "Demo" = show as synthetic now; "Roadmap" = wire live later. Detailed endpoints/queries are in the PRD §5 + Appendix ([[quintel-sourcing-signals-prd-2026-06-16]]).

### Tier-1, free, verifiable — the credibility spine (LEAD WITH THESE)
| Source | What it produces | Empire-fit | Demo? |
|---|---|---|---|
| **SEC EDGAR** — 8-K Item 1.01 (material agreements → *private counterparty*), 8-K 2.01 (acquisitions), 10-K/Q capex | the "diamond": a public filing names a private company you can finance | **Highest** | ✅ already in log (Larkspur) |
| **USAspending** — federal contract awards, equipment-heavy NAICS (237/238, 31–33, 484), >$1M | equipment/fleet/line-expansion capex implied by a federal award | High | ✅ already in log (Meridian) |
| **UCC-1 lien filings** — filing date + collateral → lease maturity → **refi window** | EF *timing* signal: who's about to refinance equipment | High | ✅ data exists (Granite Ridge) — surface it |
| **Regulatory forcing-functions** — EPA 2027 NOx, SHIPS Act 2025, OBBBA **§168(n)** reshoring expensing, 100% bonus depreciation | "this demand is **structural, not sentiment**" — survives a rate move | High | ✅ §168(n) already tagged |
| **SEDAR+** (Canada — EDGAR equivalent) | Canadian filings; **Empire's box is US & Canada** | High (currently missing) | Roadmap (note it as "Canada parity") |

### The sponsor layer — the differentiated lens (KEEP as the lead lens, see PRD §8)
| Signal | Source | Empire-fit |
|---|---|---|
| Sponsor acquisition → post-acq capex cascade ($5–50M) | EDGAR 8-K acquisitions, sponsor IR/press, PitchBook (paid) | **Highest — her channel** |
| Portfolio-co exec hire (COO/VP-Ops) as capex precursor | LinkedIn exec moves (ToS-aware via compliant provider) | High |
| Sale-leaseback / liquidity trigger | EDGAR leverage/covenant filings, sponsor IR | High (Empire's differentiated product) |

### High-value ADDS (from Stauss's screens + research — strengthen the breadth story)
| Source | What it produces | Why it's worth adding for Empire |
|---|---|---|
| **Utility / grid interconnection queues** (ISO/RTO: PJM, MISO, ERCOT, CAISO; FERC) | power-demand signals → **data-center & energy** build-outs | **Ties directly to the Larkspur data-center example** — the strongest single add; it's the upstream signal that a colo/energy project is real |
| **Building / facility permits** (Census Building Permits Survey + local GIS) | new plant / data-center / facility construction | manufacturing + data-center capex precursor; pairs with EDGAR/interconnection |
| **Federal grant & loan programs** (DOE Loan Programs Office, IIJA/IRA/CHIPS awards, Grants.gov) | funded, equipment-heavy projects | reshoring/energy capex with a funding source attached — high conviction |
| **Trade / residual intelligence** (ELFA CFI/MCI, ACT Research, Ritchie Bros., Clarksons) | sector EF-demand index + **residual/auction values** | Tier-2 sector context; the auction data also feeds the **underwrite's residual curves** (cross-benefit) |

### Thin macro overlay (context only — do NOT make it a hero)
FRED (capex orders `NEWORDER`, capacity utilization `MCUMFN`, industrial production `INDPRO`), ISM PMI, Census M3, FRB G.17. A Macquarie VP has Bloomberg — keep this a small framing strip ("regulatory-forced deals persist through a rate move; discretionary capex doesn't"). *(Engineers: confirm current FRED series IDs — the old `NAPM` is discontinued.)*

### Explicitly drop / de-emphasize
- **Reddit/forums** — Tier-3, lead-only, never cited as fact (PRD §5.7).
- **ZoomInfo / cold-CFO contact intel** — parity commodity; not the edge (PRD §2). 
- **Prediction markets** — optional context at most.

---

## The screen design (how it should look)

Top-to-bottom layout. ASCII wireframe first, then component specs.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  SOURCING                                                                  │
│  Your forward pipeline — deals forming in your space, pre-scored to your   │
│  box. We watch every free public trigger and point it the way you          │
│  originate.                                                                │
│                                                                            │
│  SOURCES WATCHED                                                           │
│  [ SEC filings ] [ Federal awards ] [ UCC liens ] [ Regulatory ]          │
│  [ Sponsor activity ] [ Grid / interconnection ] [ Permits ]   · synthetic │
│                                                                            │
│  VIEW BY:   ( Sponsor )   ( Sector )   ( Trigger )         ← lens switcher │
└──────────────────────────────────────────────────────────────────────────┘

▼ LENS = SPONSOR  (default — the current view, unchanged)
   SPONSOR WATCHLIST
   ┌─ Brookford Capital (lit · 1 capex event) ─┐  ┌─ Irongate (quiet) ─┐
   Add a sponsor to watch  [ Sponsor name… ] (+ Add)

▼ LENS = SECTOR  (new)
   SECTOR HEAT  — Empire's sectors, each: live signal count + band
   ┌ Data centers  3 · HOT ┐ ┌ Manufacturing 2 · WARM ┐ ┌ Energy/Utilities 1 ┐
   ┌ Healthcare 1 · WATCH ┐ ┌ Transportation 0 · quiet ┐

▼ LENS = TRIGGER  (new)
   BY TRIGGER TYPE
   • Capex / material agreement (EDGAR 8-K) ........... 2
   • Federal contract award (USAspending) ............ 1
   • Lien maturity → refi window (UCC) ............... 1
   • Regulatory forcing-function .................... 1
   • Sponsor acquisition → capex cascade ............ 1

──────────────────────────────────────────────────────────────────────────
REGULATORY FORCING-FUNCTIONS  (structural demand)
  [ EPA 2027 NOx pre-buy ]  [ SHIPS Act 2025 ]  [ OBBBA §168(n) reshoring ]

──────────────────────────────────────────────────────────────────────────
SIGNAL LOG                          TIER-1 TRIGGERS · SYNTHETIC
                                    [ source ▾ ] [ tier ▾ ] [ band ▾ ]
  T1 ✓ EDGAR      Hyperscale colo lease in 8-K → Larkspur (private)   HOT   →  [in box]
  T1 ✓ USASPEND   Equipment-heavy federal award → Meridian Precision  WARM  →  [in box]
  T1 ✓ UCC        Lien maturity → refi window, press line → Granite   WATCH →  [in box]
  T1   REGULATORY §168(n) immediate expensing → reshoring tailwind    WARM  →  [—]
  T1/2 SPONSOR    Brookford add-on acquisition → post-acq capex       HOT   →  [in box]
  (each row: provenance link + box-fit verdict on the right)
```

### Component specs

1. **Hero (reframe).** Replace the sponsor-only headline. New subtitle names the engine + the lens idea in one line. Keep it short and buyer-grade. *(Keep "synthetic" labeling.)*

2. **"Sources watched" strip (RESTORE).** A row of small chips/tiles, one per active source type (SEC filings · Federal awards · UCC liens · Regulatory · Sponsor activity · Grid/interconnection · Permits). This is the single most important restoration — it makes breadth visible **above the fold** without scrolling. Chips can be static for the demo; ideally each is a filter that scopes the Signal log.

3. **Lens switcher (NEW).** A 3-way toggle — **Sponsor · Sector · Trigger** — with **Sponsor as default** so the current view is unchanged on load. Switching swaps the middle section (sponsor watchlist / sector heat / trigger groups). If full build is too much before the demo, ship Sponsor + Sector (Trigger can be roadmap), but the **toggle itself must be visible** so "this is one of several lenses" reads instantly.

4. **Sector heat (NEW, for Sector lens).** Tiles for Empire's sectors (data centers, manufacturing, energy/utilities, healthcare, transportation), each with a signal count + Hot/Warm/Watch band. Synthetic counts fine. This directly answers "what else besides sponsors?" with her own sectors.

5. **Trigger groups (NEW, for Trigger lens).** Signals grouped by trigger type with counts (capex 8-K · federal award · lien maturity · regulatory · sponsor acquisition). Cheapest lens to build (it's a group-by on the signal log).

6. **Regulatory forcing-functions strip (RESTORE/ADD).** 3 tags (EPA 2027 · SHIPS Act · OBBBA §168(n)). Great for the "structural demand" line. Static is fine.

7. **Signal log (EXPAND).** Today it shows ~2 entries. Expand to **5–6 across distinct sources** (EDGAR, USAspending, UCC, regulatory, sponsor) — pulled from existing deal provenance — each with **tier badge · source badge · band · provenance link · box-fit verdict**. Add filter controls (source / tier / band). **This is where the multi-source story is proven** — the demo script points right at it.

8. **Box-fit verdict everywhere (KEEP).** Every signal/lead row shows in-box / open-to-band / out. Non-negotiable — it's the differentiator.

9. **Macro overlay (OPTIONAL, thin).** A small strip at most. Don't build live FRED tiles for the demo.

---

## Demo-minimum vs. roadmap (the cut for before the call)

**Ship before the demo (synthetic, presentation-only — no live ingestion):**
1. **Sources-watched chip strip** in the hero (breadth, above the fold). ⬅ highest priority, lowest effort
2. **Expand the Signal log** to 5–6 entries across EDGAR / USAspending / UCC / regulatory / sponsor, each with source badge + band + box-fit. ⬅ proves multi-source
3. **Regulatory forcing-functions strip** (3 tags).
4. **Lens switcher** visible — at minimum Sponsor (default) + Sector; Trigger if cheap.
5. Hero copy reframed (engine + lens, not sponsor-only).

**Roadmap (post-demo — real plumbing, per PRD §12):**
- Live EDGAR/USAspending sweeps; UCC targeted lookups + refi-window calc; SEDAR+ (Canada parity); utility-interconnection + building-permit ingestion; grant/loan-program feeds; paid sources (PitchBook, national UCC aggregator, compliant LinkedIn exec-moves); cadence/freshness tracker; deal-graph capture loop.

---

## Build checklist for engineering (prioritized)

- [ ] **P0 (demo):** Add the "Sources watched" chip strip to the Sourcing hero (static OK).
- [ ] **P0 (demo):** Expand Signal log to 5–6 multi-source synthetic entries (reuse existing deal provenance: Larkspur/EDGAR, Meridian/USAspending, Granite/UCC, regulatory/§168(n), one sponsor). Each row: tier + source badge + band + provenance link + **box-fit verdict**.
- [ ] **P0 (demo):** Reframe hero copy (engine + "point it the way you originate"); strip the remaining em-dash in the subhead (issues doc ISS-10).
- [ ] **P1 (demo if time):** Lens switcher (Sponsor default + Sector heat tiles; Trigger optional).
- [ ] **P1 (demo if time):** Regulatory forcing-functions strip (3 tags).
- [ ] **P2 (clarity, from issues doc ISS-15–19):** gloss "sponsor" once; relabel card metrics ("1 monitored" → "1 portfolio company monitored", "check $5M–$50M" → "watching for deals $5M–$50M"); breadcrumb `Sponsor ▸ Portfolio co ▸ Trigger` on the detail page; cascade-tag legend; plain gloss under the private-counterparty diagram.
- [ ] **Roadmap:** live source sweeps, SEDAR+, interconnection/permits/grants, paid sources, cadence tracker (see PRD §12 + §14).

---

## Constraints (carry these into the build)

- **Competitor hygiene (load-bearing).** Empire ≈ a VFI competitor; the reference screens are VFI's. Lift **patterns + public sources only** — never VFI/Stauss/"Northbeam/Keystone" branding, box, or deals. **Synthetic data only** on every surface.
- **Keep "sponsor" the word** — it's correct for the buyer (ex-Macquarie). Gloss it once for clarity; don't replace it.
- **Honesty / no ghost feeds.** Don't show a "live" feed we don't actually run. Synthetic is fine if labeled; a fake live counter is the anti-pattern (the deployed "synced 12d ago" was exactly this).
- **The constant is box-fit.** If a source or lens can't show a box-fit verdict on its rows, it's not ready to surface — that verdict is the whole differentiator.
