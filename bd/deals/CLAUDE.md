# BD — Deals (Living Briefings & Opportunity Clusters)

> **What lives here:** per-deal and per-opportunity **living briefings** — the synthesis layer that answers *"what are we building, what could go wrong, and what do we need to decide?"* across a whole opportunity. These are working documents that evolve as the deal moves; they are **not** snapshots and **not** archives.

## How this differs from `bd/calls/`

| Folder | Answers | Granularity | Lifespan |
|---|---|---|---|
| **`bd/calls/contacts/`** | *Who is this person? Is the pain real? What stage?* | one file per contact | permanent, across the deal's life |
| **`bd/calls/{notes,transcripts,proposals}/`** | *What happened on each call? What did we send?* | one file per interaction | permanent record |
| **`bd/deals/` (here)** | *What are we building if we win? What's the moat / risk / decision?* | one briefing per opportunity (may span several contacts) | active while the opportunity is live; archive when won/dead |

The contact docs and the briefing are **complementary, not redundant.** A briefing assumes you've read the contact docs and points back at them; it does not re-list a contact's commitments or background. Don't duplicate state — link it.

## Filing rule

- **Single-deal, single-artifact** → a flat file: `bd/deals/<slug>-briefing.md` (e.g. a future `bd/deals/aicap-credentialing-briefing.md`).
- **Multi-deal vertical opportunity (a cluster)** → a subfolder: `bd/deals/<vertical>/` holding the living briefing + companion artifacts (domain primer, spec, deal-graph schema…). Promote a flat briefing into a subfolder once it grows a second artifact.

Keep filenames descriptive and unique so Obsidian bare wiki-links (`[[slug]]`) resolve regardless of path.

## Current clusters & briefings

### `empire/` — clean, independent direct-lender lead (Quintel)
**Empire Asset Finance** — a direct, balance-sheet equipment lender; subsidiary of Arena Investors, LP ($4.6B). The first **independent, zero-conflict** EF lead — *not* Stauss-channeled, none of the VFI employment/trade-secret exposure. Same vertical as `equipment-finance/`, deliberately a **separate cluster**: Empire is the clean lead; the EF cluster is the Stauss-channeled one. **They are also peers/competitors** (Empire's capital-markets desk trades syndicated deals with VFI-type institutions) — which is why EF-vertical exclusivity is off the table here (see term-sheet draft). Product is **Quintel**; this folder holds the deal/prep layer.

- **Champion:** Katharine Rudzitis (VP Direct Originations) — qualified, asked pricing unprompted, circulating internally for a team call. [[bd/calls/contacts/katharine-rudzitis]]
- **Deliverable in flight:** redacted prior deal run → packet for the team call. Workflow + gap scope: [[quintel-empire-redacted-deal-run-scope-2026-06-19]]
- **Team-call close-readiness plan:** [[quintel-empire-team-call-readiness-2026-06-19]]
- **Deal terms / lever map:** [[quintel-empire-term-sheet-draft-2026-06-20]]
- **Economic buyers (team call):** Rick Rockhold (CEO), Mike Miroshnikov (COO/CCO, F2 user).

### `equipment-finance/` — the first dense substrate cluster (Stauss-channeled)
The opportunity Stauss Paulos opened. He functions as the **channel** (distribution partner), not a single customer; sub-deals flow through him. The vertical is the "first dense substrate cluster / lighthouse vertical." The **product** built for it is **Quintel** (quintel.ai), powered by Tokenrip — product/build docs live in `product/quintel/` ([[product/quintel/CLAUDE|index]]); this folder holds the *deal/relationship* layer.

- **Living briefing:** [[bd/deals/equipment-finance/stauss-vfi-tokenrip-briefing|stauss-vfi-tokenrip-briefing]] — deal / relationship / strategy / risks / decisions.
- **Domain primer:** [[equipment-finance-domain-primer-2026-05-30]] — the *industry* (durable across the vertical).
- **Product + build (in `product/quintel/`):** [[quintel-customer-data-first-prd-2026-06-29]] — the canonical **customer-data-first** PRD (supersedes the archived broker-first / three-archetype build architecture).
- **Nodes** (interaction record lives in `bd/calls/`):
  - **Stauss Paulos / VFI** — channel + would-be operating partner. [[bd/calls/contacts/stauss-paulos]]
  - **Bevel — Ted Craver** — arm's-length placement firm; first live intro; cleaner first customer than VFI (no employment conflict-of-interest). [[bd/calls/contacts/ted-craver]]
  - **DCF / Direct Credit Funding — Jason Ames (owner) + Devan Phillips (BD, ex-VFI)** — ⚠️ identity unconfirmed: prep'd as a balance-sheet direct lender, but Devan described it as "a larger broker" on the 6/1 call; Jason no-showed. [[bd/calls/contacts/devan-phillips]] *(Call 2026-06-01 processed; reconcile direct-lender-vs-broker before treating as the moat-layer customer.)*
  - **NED / National Equipment Dealers — Andy Cooper (VP Retail Finance)** — dealer captive-finance desk; pain = consolidate 31 lenders → 5–6 + route every deal (a lender-matching use case). Sequenced behind the live leads. [[bd/calls/contacts/andy-cooper]]
  - **VFI** — Stauss's employer; institutional full-stack (Product B); conflict-of-interest-encumbered — kept in parallel, not the clean first deal.

---

*Add a new briefing when an opportunity passes discovery and warrants a build/strategy synthesis. Archive (move to `__ARCHIVE/`) when the deal is won-and-handed-off or dead.*
