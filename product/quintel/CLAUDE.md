# Quintel — Equipment-Finance Deal Intelligence Platform

> **Quintel** (quintel.ai) is Tokenrip's first vertical product: an equipment-finance deal-intelligence platform. It is the **enterprise-friendly named entity** for the equipment-finance build — "powered by Tokenrip" — adopted because "TokenRip" reads crypto, not institutional, to a finance buyer. **Tokenrip is the horizontal substrate; Quintel is the vertical product on top.**

> **Current motion (2026-06-08): broker-first.** The canonical build + GTM doc is [[quintel-build-and-gtm-roadmap-2026-06-08]]; the GTM gameplan (shareable) is [[quintel-broker-first-gameplan-2026-06-08]]. Quintel is the umbrella for the whole EF space — broker-first (small/mid, current focus) and the upmarket "institute" are two sides of one engine. The three-archetype / Stauss-channeled framing below is retained for reference.

## What Quintel is

One product, **two pieces of one engine**:

1. **Deal-sourcing / signal engine** — mines EF-specific *free public* sources (EDGAR 8-K material-agreement filings, USAspending awards, UCC lien/maturity timing) into a scored, provenance-graded **Deal Object**. The edge is mining these for equipment finance + the imprint that reads them — *not* better contact data (Apollo/ZoomInfo are parity).
2. **Underwriting / structuring component** — encodes the operator's go/no-go + pricing/structuring judgment (residual · blind-discount · multi-unit · FMV lease) and stamps a credible pre-qualification on a sourced deal.

## The thesis — one engine, three consumers · sell the hands

The engine emits a single **Deal Object**; three layers consume it:

- the **interface** *renders* it — the read-only dashboard (cheap collateral, public data only, zero compliance surface → ships anywhere as the funnel);
- the **hands** *act* on it — match · route · underwrite-memo · structure-quote · draft-outreach · status-track (per-customer, sandboxed → the product, the lock-in, the revenue);
- the **deal-graph** *stores* it with its outcome — the moat substrate that compounds.

**Sell the hands, not the dashboard.** A read-only dashboard never captures an outcome, so it never builds the deal-graph — it stays "a worse Apollo" forever. The hands are the only layer inside the customer's deal flow, the only position from which outcomes (the moat material) can be captured.

## Three customer archetypes (spine-first, Bevel-first)

| Archetype | Example | First hand | Conflict |
|---|---|---|---|
| Direct lender (balance sheet) | VFI | underwrite + source | encumbered (Stauss employment) |
| Placement broker (3rd-party) | **Bevel** — first / clean customer | **match** + underwrite-memo | clean |
| Dealer captive-finance desk | NED | match/route + structure + status | clean |

The **matching/placement hand is shared across Bevel, NED, and any small-ticket play** — the highest-reuse hand. NED is not a new product; it is the Bevel matching spine + a structuring plugin + NED's config. That reuse is the whole thesis — preserve it.

## Relationship to Tokenrip

The **deal-graph *is* Tokenrip substrate**, and Quintel's artifacts (dashboards, memos) are hosted at stable Tokenrip URLs — solving the file-sharing pain a finance operator hits when a local Claude HTML file "can't be opened" by the recipient. Quintel is the productization of one dense vertical; future verticals follow the same **parent-infra + named-entity** pattern.

## Key docs

| Doc | What |
|---|---|
| [[quintel-build-and-gtm-roadmap-2026-06-08]] | **Current** build + GTM roadmap (broker-first) — one engine, demo→sale motion, phased build, Deal Object |
| [[quintel-demo-shape-2026-06-08]] | The demo — screens (Pipeline / Deal Detail hero / Package), storyboard, real-vs-faked build order |
| [[equipment-finance-build-architecture-2026-06-02]] | *Superseded* (three-archetype / Stauss-channeled) — retained for the core schemas (§10) + data edge (§9) |
| `ef-product-spec-2026-06-02/SPEC.md` | Build-ready V1 engineering spec (self-contained, synthetic/public data only) + scrubbed design-reference HTML in `reference/` |

**Deal / relationship context lives in BD, not here** (this folder is product/build only — mirrors the `bd/deals/CLAUDE.md` split):

- [[bd/deals/equipment-finance/stauss-vfi-tokenrip-briefing|Living briefing]] — deal / relationship / strategy / risks / decisions
- [[equipment-finance-domain-primer-2026-05-30]] — the equipment-finance *industry* (durable across the vertical)

## Boundary: what lives here vs. `bd/deals/equipment-finance/`

- **Here (`product/quintel/`)** → *what we're building* — architecture, engineering spec, schemas, roadmap.
- **`bd/deals/equipment-finance/`** → *who we're selling to and why it's a deal* — the channel (Stauss), the nodes (Bevel/NED/VFI/DCF), call records, risks, decisions.
