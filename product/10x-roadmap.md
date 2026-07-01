# Product Roadmap — Tokenrip + Quintel

**Status**: Active
**Created**: 2026-04-08 · **Rewritten**: 2026-06-04 (refocused onto the two live products) · **Updated**: 2026-07-01 (Quintel re-anchored to the customer-data-first PRD)
**Owner**: Simon

> Build sequencing across the two products. **Tokenrip** is the horizontal substrate; **Quintel** is the first vertical built on it. The ONE thing is a sale (`bd/CLAUDE.md`) — this roadmap exists to serve that, not to displace it. The canonical Quintel product + build doc is the **[[quintel-customer-data-first-prd-2026-06-29|customer-data-first PRD]]**; this is the portfolio-level view.

## Operating principle

**The vertical leads; the substrate compounds underneath.** Quintel is where a paying customer pulls; Tokenrip substrate work is gated on that pull (root CLAUDE.md trap #4 — don't build substrate features before a deploy needs them). One product leads at a time; right now it's **Quintel (customer-data-first)**.

---

## Tokenrip (substrate) — paused pending a live customer

The five-layer architecture ([[tokenrip-context]]) is the long game. **Roadmap is paused** until a live customer pulls on a given layer. The piece that is live and load-bearing today:

- **Stable-URL artifact hosting** — the primitive that solves "I built a Claude HTML dashboard and the recipient can't open the file." Validated organically by finance operators (Stauss). This is what Quintel's surfaces are hosted on.

Everything beyond it (collaboration/threads, deliverable rails, workspaces, agent-native runtime) advances *only* when a deploy needs it.

---

## Quintel (equipment-finance vertical) — the active build

**Direction (2026-06-29): a customer-data-first intelligence engine** — a personalized relevance-stream that ranks an originator's own prospect list by what their *own* deal history funds, each item shown with the reason it's relevant. Non-commodity by construction; serves lenders and brokers as one product, pointed at a different list. This **supersedes the earlier broker-first / three-archetype / "sell the hands" roadmap** (archived at `__ARCHIVE/product/quintel/`).

The build spec, phasing, and scope now live in the PRD and the engineering docs — not duplicated here:

- **Canonical build spec:** [[quintel-customer-data-first-prd-2026-06-29]] (§8 architecture "share the evidence, privatize the score", §9 ingestion, §10 ranker, §11 market-intel L1–L4, §13 scope).
- **Engineering roadmaps:** `product/quintel/engineering/` — [[quintel-engine-build-roadmap-2026-06-09]] (real-vs-stub state + P0–P5) · [[quintel-lender-build-roadmap-2026-06-10]] · [[quintel-intake-design-2026-06-09]].
- **Current UX:** [[quintel-ux-framework-2026-07-01]].

**Portfolio gate (unchanged):** platform depth is gated on a *funded* buyer — a demo to earn the conversation is table stakes; building the platform for an unsigned customer is trap #4. The deal-graph the engine accumulates *is* Tokenrip substrate — Quintel is how the substrate gets its first dense vertical. The moat begins the moment outcomes (funded/declined + reason) feed back into the per-customer model.

---

## Related

- [[product/quintel/CLAUDE|Quintel product index]] · [[product/tokenrip/CLAUDE|Tokenrip product index]]
- [[quintel-customer-data-first-prd-2026-06-29]] — the canonical Quintel product + build doc
- `bd/CLAUDE.md` — the sale this roadmap serves
- *(The former Track 2 "Intelligence Engine" and Track 3 "Agent Deployment" were dropped in the 2026-06-04 rewrite; IE archived → `__ARCHIVE/intelligence-engine/`. The broker-first / three-archetype Quintel build docs were archived 2026-07-01 → `__ARCHIVE/product/quintel/`.)*
