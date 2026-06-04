# Product Roadmap — Tokenrip + Quintel

**Status**: Active
**Created**: 2026-04-08 · **Rewritten**: 2026-06-04 (refocused from the RebelFi 3-track "AI-native operations" roadmap onto the two live products)
**Owner**: Simon

> Build sequencing across the two products. **Tokenrip** is the horizontal substrate; **Quintel** is the first vertical built on it. The ONE thing is a sale (`bd/CLAUDE.md`) — this roadmap exists to serve that, not to displace it. The deep build doc is [[equipment-finance-build-architecture-2026-06-02]]; this is the portfolio-level view.

## Operating principle

**The vertical leads; the substrate compounds underneath.** Quintel is where a paying customer pulls; Tokenrip substrate work is gated on that pull (root CLAUDE.md trap #4 — don't build substrate features before a deploy needs them). One product leads at a time; right now it's Quintel (Bevel-first).

---

## Tokenrip (substrate) — paused pending a live customer

The five-layer architecture ([[tokenrip-context]]) is the long game. **Roadmap is paused** until a live customer pulls on a given layer. The piece that is live and load-bearing today:

- **Stable-URL artifact hosting** — the primitive that solves "I built a Claude HTML dashboard and the recipient can't open the file." Validated organically by finance operators (Stauss). This is what Quintel's read layer is hosted on.

Everything beyond it (collaboration/threads, deliverable rails, workspaces, agent-native runtime) advances *only* when a deploy needs it.

---

## Quintel (equipment-finance vertical) — the active build

Spine-first, **Bevel-first**. Mirrors [[equipment-finance-build-architecture-2026-06-02]] §5 — see it for detail; the phases:

| Phase | What | Gate |
|---|---|---|
| **0 — Hosted collateral dashboard** | Rebuild the operator's HTML dashboard on the engine abstraction, one real source, his criteria as scoring config, hosted at a stable Tokenrip URL. Arms the channel + dogfoods the stable-URL primitive. | Days; for the next call. Build thin but *on the spine*. |
| **1 — Engine + Deal-Object schema + thin underwriting/structuring slice** | Pluggable source connectors (EDGAR / USAspending / UCC), config-driven scoring (the §9 rubric), demand index, Deal-Object schema defined even though the graph is empty, the "fundable at ~X%, residual ~Y%, here's why" slice. | 1–2 wks. Blocked on the operator's judgment half + residual logic. |
| **2 — First hand → Bevel** | Match + draft-outreach wired to Bevel's placement history. First read-write deployment; **the first sale.** Clean node (no conflict-of-interest). | The 0→1 unblock. |
| **2b — NED config** *(only after Bevel signs)* | Same matching spine, NED config; lead with lender scorecard + routing. The architecture's extensibility test (config, not fork). | Gated on Bevel signing. |
| **3 — Close the loop** | Outcome capture (placed / declined / priced / residual) feeds back into scoring. **The moat begins here** — the hands reach it, the dashboard never does. | Starts the deal-graph / Tokenrip substrate density. |
| **4 — Multiply** | New customers/verticals = new config + connectors + hands on the same spine. | Post-first-sale. |

---

## Related

- [[product/quintel/CLAUDE|Quintel product index]] · [[product/tokenrip/CLAUDE|Tokenrip product index]]
- [[equipment-finance-build-architecture-2026-06-02]] — the build (engine / hands / deal-graph + schemas)
- `bd/CLAUDE.md` — the sale this roadmap serves
- *(The former Track 2 "Intelligence Engine" and Track 3 "Agent Deployment" were dropped in the 2026-06-04 rewrite; IE archived → `__ARCHIVE/intelligence-engine/`.)*
