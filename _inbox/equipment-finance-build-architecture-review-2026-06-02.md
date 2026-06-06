---
title: Review — EF Build Architecture doc + NED node incorporation
type: review-note
created: 2026-06-02
owner: Simon
status: awaiting-review
---

# Review — Equipment-Finance Build Architecture + NED node

Working session (2026-06-02) formalized the EF build into a durable architecture doc and folded in NED (National Equipment Dealers) as a third channel node. Below: what was created/modified, where the new doc should live, and what's still owed.

## New documents

| Doc | Current location | Suggested permanent home | Notes |
|---|---|---|---|
| **EF Build Architecture** — one engine, three consumers | `active/equipment-finance-build-architecture-2026-06-02.md` | **`product/tokenrip/`** after your review (it's a Tokenrip product/architecture doc) | The build spine + spine-first roadmap. Cited by the briefing & cluster index. |
| **Andy Cooper** — NED contact stub | `bd/calls/contacts/andy-cooper.md` | stays (contacts) | Net-new operator; no call yet; flesh out after first contact. |

## Modified in place (living docs — no move needed)

- `bd/deals/equipment-finance/stauss-vfi-tokenrip-briefing.md` — §1 (update block), §2 (timeline), §4 (NED node corrected from stale "$200–250M" to the real dealer-desk profile), §7 (risks 10–11: breadth-vs-depth, one-imprint-holder-per-node), §11 (NED actions, sequenced behind Bevel), §12 (build-doc + NED links).
- `bd/deals/CLAUDE.md` — added build-architecture link + NED node to the cluster.
- `bd/deals/equipment-finance/equipment-finance-domain-primer-2026-05-30.md` — corrected NED row; new **§10** dealer captive-finance-desk mechanics (FMV/residual, blind discount, multi-unit, lender consolidation, monthly reset).

## Decisions captured (yours, 2026-06-02)

- **Both** deliverables (build doc + briefing/record updates). ✅
- **Spine-first** — design the engine to absorb NED as a config; pursue the NED *deal* only after Bevel signs. ✅
- NED wedge = **lender scorecard + routing**. ✅

## Still owed / next

- **WhatsApp reply to Stauss** (drafted in chat) — get the HTML file + criteria + §9.4 judgment half. *Not yet sent.*
- **Stauss economics** (finder's-fee / channel cut) — raise 1:1, not in the group chat. Open across 4 calls.
- **Andy Cooper's imprint** (residual curves, 31-lender list, intake format) — collect via Stauss *post-Bevel*.

## Related

[[stauss-vfi-tokenrip-briefing]] · [[equipment-finance-build-architecture-2026-06-02]] · [[equipment-finance-domain-primer-2026-05-30]] · [[bd/calls/contacts/andy-cooper]] · [[bd/calls/contacts/ted-craver]]
