# Review note — Tokenrip Tool Catalog & Imprint Templates spec

**Created**: 2026-05-18
**For review by**: Simon

## What this is

A substrate-roadmap PRD derived from the 300-posting Upwork CSV. Reframes the JTBD layer from outcome clusters into ten concrete operation-atoms, collapses them into three stacks (Front Desk / Document-to-Decision / Operator Layer), and turns that into a prioritised tool catalog + three imprint templates.

## Documents

| Document | Current location | Suggested permanent location |
|----------|------------------|------------------------------|
| Tool Catalog & Imprint Templates spec | `active/tokenrip-tool-catalog-imprint-spec-2026-05-18.md` | `product/tokenrip/` (as tool-catalog roadmap input) once reviewed |

## Open questions for Simon

1. **Does the P0 call land?** The spec says `crm-sync` (GoHighLevel) + `calendar` + `schedule` is the highest-leverage build — ahead of `doc-extract`. Agree, or does the defensible Document-to-Decision tier deserve P0?
2. **Imprint templates as the unit of substrate density** — the spec treats each published template as a North Star unit. Worth confirming that framing against `bd/kpis.md`.
3. The 2026-05-13 analysis stays as the demand source; this spec supersedes only its JTBD section. No archive needed yet.

## Related

- `active/tool-layer-design-brief-2026-05-10.md` (architecture this builds on)
- `product/tokenrip/mounted-agent-model.md`, `business-model.md`
