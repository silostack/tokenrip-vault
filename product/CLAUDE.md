# Product — Tokenrip + Quintel

> Two products: **Tokenrip** (the horizontal agentic-collaboration substrate / infrastructure) and **Quintel** (the first vertical product built on it — equipment-finance deal intelligence). Tokenrip is the layer beneath; Quintel is the named, enterprise-friendly product on top. Future verticals follow the same **parent-infra + named-entity** pattern.

## Products

### [Tokenrip](tokenrip/CLAUDE.md) — the substrate
Agentic collaboration platform. Gives agent-produced assets persistent identity, structured agent-to-agent messaging, and shared workspaces; hosts artifacts at stable URLs. Five-layer architecture (asset routing → collaboration → deliverable rails → workspaces → agent-native runtime). The moat is the accumulating coordination/work/organizational graph. **Substrate roadmap is paused pending a live customer pulling on it** — the stable-URL artifact primitive is the live piece.

### [Quintel](quintel/CLAUDE.md) — the first vertical
Equipment-finance deal-intelligence platform (quintel.ai), **powered by Tokenrip**. **Current direction (2026-06-29): a customer-data-first intelligence engine** — a personalized relevance-stream that ranks an equipment-finance originator's own prospect list by what their *own* deal history funds, each item shown with the reason it's relevant. Non-commodity by construction (ranked on the customer's own book, not resold public data); serves both lenders and brokers as one product, pointed at a different list. Architecture = **share the evidence, privatize the score** (owner-tagged evidence; per-customer scoring; structural leak-safety). The per-customer deal-graph it accumulates *is* Tokenrip substrate — Quintel is how the substrate gets its first dense vertical. *(This supersedes the earlier broker-first / "sell the hands" / three-archetype framing — see the [PRD](quintel/quintel-customer-data-first-prd-2026-06-29.md).)*

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
| **Quintel — canonical PRD (customer-data-first)** | [[quintel-customer-data-first-prd-2026-06-29]] |
| Quintel current UX framework | [[quintel-ux-framework-2026-07-01]] |
| Quintel build detail (roadmaps, specs, source queries) | `quintel/engineering/` |
| Quintel positioning / sell reasoning | [[quintel-positioning-synthesis-2026-06-28]] |
| Quintel deal/relationship context (in BD) | [[bd/deals/equipment-finance/stauss-vfi-tokenrip-briefing]] |
| **AICAP** — live FDE credentialing build (client engagement) | [[aicap/CLAUDE]] · [[aicap/aicap-validation-mvp-sow-2026-06-22\|signed SOW]] |
| Build sequencing across both products | [[10x-roadmap]] |

## Archived

- **Intelligence Engine** (agentic knowledge marketplace / blog motion) — archived 2026-06-04 → `__ARCHIVE/intelligence-engine/`. Was the first thing built on Tokenrip; deprioritized to focus on Quintel. The blog tooling (`agents/blog-agent/`, `/blog-post` skill) still functions.
