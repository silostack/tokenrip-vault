# Product — Tokenrip + Quintel

> Two products: **Tokenrip** (the horizontal agentic-collaboration substrate / infrastructure) and **Quintel** (the first vertical product built on it — equipment-finance deal intelligence). Tokenrip is the layer beneath; Quintel is the named, enterprise-friendly product on top. Future verticals follow the same **parent-infra + named-entity** pattern.

## Products

### [Tokenrip](tokenrip/CLAUDE.md) — the substrate
Agentic collaboration platform. Gives agent-produced assets persistent identity, structured agent-to-agent messaging, and shared workspaces; hosts artifacts at stable URLs. Five-layer architecture (asset routing → collaboration → deliverable rails → workspaces → agent-native runtime). The moat is the accumulating coordination/work/organizational graph. **Substrate roadmap is paused pending a live customer pulling on it** — the stable-URL artifact primitive is the live piece.

### [Quintel](quintel/CLAUDE.md) — the first vertical
Equipment-finance deal-intelligence platform (quintel.ai), **powered by Tokenrip**. Two pieces of one engine: a **deal-sourcing/signal engine** (EDGAR / USAspending / UCC timing signals) + an **underwriting/structuring component**. Thesis: **one engine, three consumers** (interface renders · hands act · deal-graph stores) — **sell the hands, not the dashboard.** First customer: Bevel (clean placement broker). The deal-graph it accumulates *is* Tokenrip substrate — Quintel is how the substrate gets its first dense vertical.

## Relationship

```
Tokenrip (horizontal substrate: identity · messaging · stable-URL artifacts · deal-graph)
   └── powers → Quintel (equipment-finance vertical product)
                  └── deal-graph outcomes feed back as Tokenrip substrate density
```

Tokenrip is the rendering engine; Quintel is what the market comes for. Both matter; the vertical leads the GTM, the substrate compounds underneath.

## Where the deep docs live

| Need | Read |
|---|---|
| Tokenrip product reference | [[tokenrip-context]] · [[tokenrip-positioning]] |
| Mounted-agent model (imprint/memory/harness) | [[mounted-agent-model]] · [[mounted-agent-synthesis]] |
| Tokenrip business model + tool layer | [[business-model]] · [[tool-layer]] |
| Quintel build + GTM roadmap (current, broker-first) | [[quintel-build-and-gtm-roadmap-2026-06-08]] |
| Quintel build architecture (superseded) | [[equipment-finance-build-architecture-2026-06-02]] |
| Quintel V1 engineering spec | `quintel/ef-product-spec-2026-06-02/SPEC.md` |
| Quintel deal/relationship context (in BD) | [[bd/deals/equipment-finance/stauss-vfi-tokenrip-briefing]] |
| Build sequencing across both products | [[10x-roadmap]] |

## Archived

- **Intelligence Engine** (agentic knowledge marketplace / blog motion) — archived 2026-06-04 → `__ARCHIVE/intelligence-engine/`. Was the first thing built on Tokenrip; deprioritized to focus on Quintel. The blog tooling (`agents/blog-agent/`, `/blog-post` skill) still functions.
