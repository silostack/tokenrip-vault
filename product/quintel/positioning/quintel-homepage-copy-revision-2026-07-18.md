---
title: Quintel Homepage — Copy Revision (v1 mock → v1.1)
status: proposal
owner: Simon
type: positioning-copy-revision
created: 2026-07-18
related:
  - product/quintel/positioning/quintel-homepage-positioning-spec-2026-06-24.md
  - product/quintel/quintel-sourcing-intelligence-prd-2026-06-29.md
  - product/quintel/quintel-stauss-product-notes.md
---

# Quintel Homepage — Copy Revision

> **What this is.** Proposed copy changes to the homepage mock (`hompage.html`), for Alek to react to. A revised copy of the mock with all changes applied lives at `hompage-copy-rev.html` (the original is untouched). Design is out of scope; every change below is copy only, plus one new section that reuses the existing section pattern.

**The page is strong and stays 90% as-is.** The hero is on the right axis (intelligence, not prediction), the per-item "why this surfaced" card is the best thing on the page, and the FAQ competitor triple pre-answers the commodity objection. The revision does three things the current draft doesn't: sells ranking of the list a desk *already has*, works the learning loop back in without leading with it, and gives the hire-vs-tool cost frame a quiet but real presence.

---

## 1. New section — "Your list, ranked" (inserted between How-it-works and Who-it's-for)

**Why.** The current page only sells net-new discovery ("Quintel finds the businesses..."). But the ranking claim is bigger than discovery: given *any* list, Quintel says who to call first and who to leave alone right now. Both live prospects voiced exactly this — Mike is calling an Apollo export of ~3,500 top to bottom; Katharine hand-triages ~2,000 companies in HubSpot. Neither currently sees their situation on the page.

**New copy:**

> **Eyebrow:** YOUR LIST
> **H2:** Already have a list? Quintel tells you who to call first.
> **Body:** Most desks aren't short on names. They're short on order. Bring the list you already work, whether that's an Apollo export, a CRM dump, or a spreadsheet. Quintel scores every name against live market activity and what you fund. The companies showing real demand rise. The quiet ones sink.
> **Bullets:**
> - Who to call first, ranked with the reason attached
> - Who to leave alone this quarter: no signal, no hour wasted
> - Net-new companies that fit, folded into the same ranked list

**Notes.**
- The "who not to call" claim is deliberately framed as *not now* ("this quarter"), never *never* — a quiet company isn't a dead company, and we don't want to promise suppression, only ordering.
- Wording says "bring/import," not "connect your CRM" — live sync isn't v1, and the existing "Push to CRM / Syncs to your CRM" lines already cover the direction of travel honestly.

## 2. Learning loop — worked back in, mechanism-first, never main stage

**Why.** "It learns your book" doesn't land as an abstract claim — a sales buyer can't connect it to their week without an example. So no learning section, no hero mention. Instead the claim appears only where the *mechanism and consequence* are visible. Note the Hargrove demo card already proves learning better than any claim ("construction is 38% of what you fund") — these three placements just make it explicit.

**2a. Product-mock footer chip** (the wording flagged as weak):
- Current: "Scored against **your funded book**"
- Proposed: "Ranked by **what actually funds for you**"

**2b. How-it-works card 03 ("Ranked reasons, every call")** — one sentence appended:
> "And the ranking doesn't sit still: every save, skip, and funded deal tunes next week's list."

Mechanism (save/skip/fund) → consequence (next week's list), in eleven words, inside a section the reader is already in.

**2c. New FAQ** — "Does the list get stale?" (placed after "Won't these companies already have financing?"):
> "The opposite. Quintel starts from what you tell us you fund, then watches what your team actually does: the saves, the skips, the funded deals. It stops surfacing what you'd pass on and gets denser in what you'd close. The longer it runs on your desk, the more the top of the list looks like your funded book."

This is also the quiet moat/anti-decay answer (spec §8: "it doesn't decay, it tightens") without ever saying "AI learns."

## 3. BDO frame — present, soft, no dollars

**Why.** Quintel should be priced in the buyer's head against the cost of coverage (a hire), not against a leads platform seat (Apollo). Stauss's framing — "a team member, not a SaaS product," "you're selling quality, not quantity" — is the strongest sell language we have, but the homepage should carry the *frame*, not the full "this is your new junior BDO" pitch. Three placements, no dollar figures, no "replaces a hire" claim:

**3a. Before/after section headline + lede** (replaces "The same rep. A different week.", which did no work until the body explained it):
- New H2: "**Watching the whole market is a full-time job. Several, actually.**"
- New lede: "Reading permits, fleet filings, lien maturities, and lettings across every state you run in is the work of a hire you haven't made. Quintel does that layer, so the people you pay to close spend the week closing. Same team, same phones. What changes is where the hours go."
- The "same rep, different week" idea survives demoted into the body ("same team, same phones"); the labor frame now leads the section, and "the work of a hire you haven't made" is the strongest BDO line on the page — still no dollars, no "junior BDO" label.

**3b. Before/after closing line:**
- Current: "Built so each rep spends the week on real deals, and funds more of them."
- Proposed: "**The coverage of a hire. The cost of software.**"

This is the whole frame in eight words, sitting directly under the before/after evidence that just earned it.

**3c. FAQ "Quintel vs. ZoomInfo and Apollo"** — closing sentences appended:
> "The honest comparison isn't another database seat. It's the coverage you'd otherwise hire for."

**3d. FAQ "Quintel vs. UCC data services"** — Stauss's quality-not-quantity spine appended:
> "Ten names worth calling beat a hundred to filter."

Existing lines that already carry the frame and stay untouched: "National coverage without adding headcount," "No sales team could watch even one of them at full coverage."

## 4. Geography → box: retire the "state coverage" frame

**Why.** "Every state you run in" / "national coverage" is a dealer's axis — dealers have physical locations and territories. A lender's or broker's axis is the box: industries, asset classes, ticket sizes. Geographic-coverage language makes the reader picture branches, not deals. (Record *sources* keep their geography — "county, state, and federal records," "State DOT lettings" — that's data provenance and reads as credibility, not customer geography. The mock's "All states" filter dropdown also stays: some balance-sheet lenders do have footprints, and it's a product-UI detail, not a positioning claim.)

- How-it-works card 01, Coverage row: "Every state you run in" → "**The whole market, not a sample**"
- Lender card bullet: "National coverage without adding headcount" → "**The whole market watched, without adding headcount**"
- Before/after lede: "...across every state you run in..." → "...**for every company that fits what you fund**..."

## 5. Minor hygiene

- "Point Quintel at your box" → "Tell Quintel what you fund" (lender card). "Once we scope your buy box" → "Once we scope what you fund" (FAQ). Rationale: "box" reads as a single threshold; "what you fund" is the language the rest of the page already uses (spec §4).
- FAQ JSON-LD schema updated to match (new FAQ added, buy-box wording synced).
- Flag, Alek's call: the SEO title tag says "Equipment Financing **Leads** for Lenders" while the page deliberately never sells "leads." Probably right for search intent — just making it a conscious choice.

## Deliberately not changed

- Hero, watchlist, signal families, who-it's-for structure, brokers card, CTA — untouched.
- No proof/backtest strip or pilot de-risking on the page for now (noted as a future candidate for the forward-to-the-board moment; not part of this revision).

## Verification applied

Every new line walked against the spec §12 objection bank: no hit-rate bait, no exclusivity promise, no "AI won't act on its own" groveling, no CRM-replacement read, no raw-signal sell. Read-as test: Mike now finds his Apollo-list situation in §1; Katharine finds her triage-my-universe want in §1 plus the CRM-layer direction in the existing sync lines.
