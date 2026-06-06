---
type: review-note
created: 2026-06-02
owner: Simon
status: awaiting-review
---

# Review note — Equipment-Finance product spec bundle (engineering handoff)

## What this is

A single **self-contained engineering handoff bundle** that turns the Stauss/equipment-finance starting point into a buildable product V1. Designed to be handed — as-is — to a coding model with **no vault access**. It is the **external-safe, scrubbed** counterpart to our internal strategy docs.

## Where it lives

```
active/ef-product-spec-2026-06-02/
├── SPEC.md                              ← the one comprehensive document
└── reference/
    ├── market-signal-dashboard.html     ← scrubbed design reference
    ├── keystone.html                    ← scrubbed design reference
    └── lender-network.html              ← scrubbed design reference
```

**Suggested permanent home:** `product/tokenrip/` (it is a Tokenrip product doc). Move the whole folder there after review.

## What `SPEC.md` covers

Self-contained, no vault links: thesis (one engine / three consumers; sell the hands) · the EF domain primer (structures, residual, blind discount, multi-unit, panel consolidation) · the three archetypes (generic) · the **thicker V1** scope · system architecture (read/write split, extractable engine) · the Deal-Object / Signal / CascadeTemplate / Counterparty schemas · the engine (EDGAR + USAspending + UCC connectors, scoring-as-config, structuring calculator with a synthetic calibration sample) · the three dashboard views · the hands (one real `match`, rest stubbed) · the deal-graph · data-source access · tech stack + repo layout · ops (single-password gate) · build sequence · watch-outs · acceptance criteria · open items.

## Decisions locked (2026-06-02)

- **Standalone now, extractable later** — new repo, no Tokenrip-runtime dependency; mirror TS/Postgres/React choices; engine + schema isolated as liftable modules.
- **Access = one hardcoded/env password** + session cookie. No accounts/auth system. No crypto gating.
- **Thicker V1** — multiple live sources + lender scorecard on seed data + a first real `match` hand stubbed on synthetic data (not wired to any real customer system until one signs).
- **HTML scrubbed to clean synthetic versions** (I produced them).
- **Operators referred to generically** — Direct Lender / Placement Broker / Dealer Desk.

## Confidentiality — verified clean

- **Word-bounded sweep across all four files: zero** real identifiers (VFI, Paulos/Stauss, Bevel, NED, Andy/Cooper, and every real lender firm/contact).
- The three HTML files were rebranded to a fictional tenant (**"Northbeam Capital"**), 30 real lender contacts → ~14 **synthetic** lenders, the internal command-center reseeded with synthetic data, brand → **"DEALBOARD"**. VFI's real ABS figure, internal drift/issue log, and all real contacts removed.
- All three scrubbed files **pass a JS syntax check** (they render); structure/CSS preserved.

## Relationship to existing docs (these stay internal — NOT in the bundle)

- [[equipment-finance-build-architecture-2026-06-02]] — the internal strategy/architecture memo this operationalizes.
- [[stauss-vfi-tokenrip-briefing]] · [[equipment-finance-domain-primer-2026-05-30]] · [[andy-cooper]] — named, real-context BD docs in `bd/deals/equipment-finance/`. Do **not** ship these to a model or host them.

## Still owed / next

- Hand the bundle (SPEC.md + reference/) to the coding model to scaffold.
- Resolve SPEC §17 open items during scaffolding: product name · API framework (Hono vs NestJS) · ORM · UCC coverage · per-prospect passwords · design palette.
- (Unchanged, from prior session) the WhatsApp reply to Stauss is drafted-unsent; Stauss's economics/cut still to raise 1:1.
