# Quintel — Equipment-Finance Deal Intelligence Platform

> **Quintel** (quintel.ai) is Tokenrip's first vertical product: an equipment-finance deal-intelligence platform. It is the **enterprise-friendly named entity** for the equipment-finance build — "powered by Tokenrip" — adopted because "TokenRip" reads crypto, not institutional, to a finance buyer. **Tokenrip is the horizontal substrate; Quintel is the vertical product on top.**

> **Current direction (2026-07-14): sourcing-first, deepened by the customer's book.** The canonical doc is **[[quintel-customer-data-first-prd-2026-06-29]]** (filename retains the old "customer-data-first" slug for link stability); the current UX is [[quintel-ux-framework-2026-07-01]]. Quintel **leads on sourcing** — surfacing + ranking higher-quality leads from market data run through the intelligence layer (resolution + box-scoring + per-item *why*), valuable with zero customer data — and the customer's own deal history is the *deepening* dial. **Crucial distinction:** leading on sourcing does **not** revive the archived naive "resell raw public deal signals" motion — the differentiation is the *reasoning layer*, never the raw feed. This still supersedes the earlier broker-first motion and the naive resold-signals motion (both archived at `__ARCHIVE/product/quintel/`), and the 2026-07-14 reframe supersedes the prior "customer-data-first" *emphasis*. Serves both lenders and brokers as one product, pointed at a different list.

## What Quintel is

Quintel v1 is a **sourcing intelligence engine**: a personalized, interactive market-intelligence **relevance-stream** for the equipment-finance **originator** (the BD person at a lender or broker whose job is to find financeable deals). It **surfaces and ranks higher-quality leads from market data** run through the intelligence layer (entity resolution + box-scoring + a per-item *why it's relevant to them*) — valuable with zero customer deal history — and **deepens** the ranking with the originator's own deal history (what their book **actually funds**) where available. Each item shows *the reason it's relevant to them* — a company in a sector they win, a sponsor they track, their ticket band, or one that just moved in the public record (and, once the book is connected, a company that resembles a deal they funded).

**The same product serves both customer types, pointed at a different list:** direct lenders (own balance sheet; credit team decides, originator hunts) and brokers/placement firms (match borrowers to lenders). The person built for is the **originator** — who hunts off a coarse *stated* buy box while the rich *revealed* preference (what actually funds) lives with credit. Closing that internal information gap is the problem Quintel solves.

## The core insight — intelligence over market data, deepened by the book (dial, not switch)

- **The pain is lead quality.** Originators voice one need — better leads, and who to call first. Nobody asks for "more intelligence on my own data." Lead with the answer to the voiced pain.
- **The commodity trap (avoided):** selling *raw public data* ("we surface deals from the market") is a commodity — Apollo/ZoomInfo sell the same feed to everyone. Quintel does **not** lead on the raw feed.
- **The escape — the intelligence layer, not the data:** what is non-commodity *by construction* is the **reasoning** over the market data (entity resolution + box-scoring + per-item "why this matters to you"). Valuable from day one on market data alone, with only coarse context (box, watchlist, sponsors). This is the sourcing lead.
- **The customer's book is the deepening dial:** keyed on the customer's *own* deal history, output differs per customer and lift is *certain* — a **dial** (how much lift), not a **switch** (whether a signal exists). Deal history = the credit team's judgment moved to the front of the funnel; it turns generic box-fit into revealed-preference ranking. It deepens the aim; it isn't what lets us aim.
- **Two levers of a better list, both reasoning not more rows:** (a) surface earlier via **leading signals** (permits, awards, new authority — before the deal), and (b) rank so good ones rise and dead patterns sink. **Cold net-new from sparse convergence (the switch) stays upside**, never the promise.
- **Graceful degradation:** even with only coarse context, the feed is valuable *because the differentiation is the reasoning layer, not the customer's data*; deal history *deepens* relevance, it isn't the entry toll — which makes a thin-history new lender (e.g. Empire) a v1 customer.

## Architecture — share the evidence, privatize the score

Owner-tagged evidence (`public` or `principal:P`): a shared world-graph of entities + public evidence, plus each customer's **private overlay** (their deal history / the Quintel Book). The **score is always a per-customer read** over `owner ∈ {public, P}` — so leak-safety is structural (customer A's private data is never in customer B's input set), and adding market data is just appending `public` evidence to the same ledger. **The moat** is the learned scoring function + the public-research entity-resolution/inference IP + the per-customer deal-graph lock-in — *not* pooled private data, which by design never crosses.

## Relationship to Tokenrip

The **per-customer deal-graph *is* Tokenrip substrate**, and Quintel's artifacts are hosted at stable Tokenrip URLs — solving the file-sharing pain a finance operator hits when a local Claude HTML file "can't be opened" by the recipient. Quintel is the productization of one dense vertical; future verticals follow the same **parent-infra + named-entity** pattern.

## Key docs

| Doc | What |
|---|---|
| **[[quintel-customer-data-first-prd-2026-06-29]]** | **Canonical PRD** — the sourcing intelligence engine (2026-07-14 reframe: market data + reasoning layer lead, the book deepens): relevance-stream, share-evidence/privatize-score, the Quintel Book + ingestion, the explainable ranker, market-intel L1–L4, v1 build scope, demo path, load-bearing assumptions |
| [[quintel-ux-framework-2026-07-01]] | **Current UX** — seven customer jobs, the atomic item card, five screens, the tunability friction ladder, the demo flow (Mirror → Apply → Fresh → Tune) |
| `engineering/` | **Build detail** — [[quintel-engine-build-roadmap-2026-06-09]] (real-vs-stub state + P0–P5) · [[quintel-lender-build-roadmap-2026-06-10]] (lender surface; portable underwriting-read + fraud heuristics; cited by the PRD) · [[quintel-intake-design-2026-06-09]] (the `ingest` stage as a surface) · [[quintel-sourcing-signals-prd-2026-06-16]] + [[quintel-sourcing-page-gameplan-2026-06-18]] (the EDGAR/USAspending/UCC source queries + cascade templates that implement the PRD's market-intel L1/L2 layer) · [[quintel-deal-packaging-framework-2026-07-05]] (deal-packaging product requirements — where it sits in the deal lifecycle, who reads a package and what each wants, the canonical content schema, engineering requirements; the forward-looking mirror of the PRD's credit-memo *ingestion* concept) |
| `research/` | [[research/research-log\|EF industry/trade-press research log]] — newsletter/domain insight that informs product decisions, with tie-ins to specific PRD/roadmap sections |
| `positioning/` | [[quintel-positioning-synthesis-2026-06-28]] — the sell reasoning the PRD synthesizes (dial-vs-switch, the commodity trap, objection lines; companion to the sales tear-sheet) · [[quintel-homepage-positioning-spec-2026-06-24]] — homepage messaging spec |
| Domain primer | [[equipment-finance-domain-primer-2026-05-30]] — the equipment-finance *industry* (durable across the vertical) |

Superseded broker-first / three-archetype / sourcing-signals docs are archived at `__ARCHIVE/product/quintel/` (retained for their schemas + data edge, not their strategy).

**Deal / relationship context lives in BD, not here** (this folder is product/build only — mirrors the `bd/deals/CLAUDE.md` split):

- [[bd/deals/equipment-finance/stauss-vfi-tokenrip-briefing|Living briefing]] — deal / relationship / strategy / risks / decisions

## Boundary: what lives here vs. `bd/deals/equipment-finance/` vs. `intelligence/research/quintel/`

- **Here (`product/quintel/`)** → *what we're building* — the canonical PRD + UX at top level; build detail (roadmaps, engineering specs, schemas, source queries) under `engineering/`; the sell/messaging source-of-truth (positioning memo + homepage spec) under `positioning/`.
- **`product/quintel/research/`** → EF industry/trade-press insight (newsletters, domain write-ups, practitioner commentary) that informs product decisions — not competitor watching, not deal context.
- **`bd/deals/equipment-finance/`** → *who we're selling to and why it's a deal* — the channel (Stauss), the nodes (Bevel/NED/VFI/DCF/Empire), call records, risks, decisions.
- **`intelligence/research/quintel/`** → competitor and adjacent-AI-product intelligence (legal-AI case studies, vertical-AI competitive landscape, CRM-category + Aloan + Salesforce analyses) — a different kind of research from the trade-press domain insight in `research/` above.
