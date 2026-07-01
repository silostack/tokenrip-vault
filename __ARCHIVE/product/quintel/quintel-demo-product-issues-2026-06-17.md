---
title: Quintel Demo — Product Issues & Enhancements (live walkthrough)
status: active
owner: Simon → Quintel engineering
type: bug-list / qa
created: 2026-06-17
context: "Pre-demo QA for the Katharine / Empire Asset Finance call (~2026-06-18). Findings from a full click-through of the deployed product at quintel.ai on 2026-06-17."
related:
  - active/quintel-katharine-demo-prep-2026-06-16.md
  - bd/calls/contacts/katharine-rudzitis.md
  - product/quintel/quintel-sourcing-signals-prd-2026-06-16.md
---

# Quintel Demo — Product Issues & Enhancements

Findings from a full live walkthrough of **quintel.ai** on 2026-06-17 (login → desk → deals → deal detail → two underwrite memos → live re-underwrite both directions → all of Sourcing/Act-3 → intake with a real pasted email → box). Audience for the demo is **Katharine Rudzitis, ex-Macquarie (10 yrs EF), VP Direct Originations at a direct balance-sheet lender** — a high-BS-detector credit buyer. Severity is judged by **what loses credibility in front of that buyer.**

**Severity key:** `P0` = demo-blocker / will lose the room · `P1` = visible credibility risk, fix before call · `P2` = polish / AI-tell · `ENH` = enhancement / room for improvement.

## What's already fixed (verified — good news)
These were open in the earlier audit and are resolved in the current build: **branding leak** (no "Powered by Tokenrip" footer or Calendly link anywhere), **Deals tab** (no more public mega-caps — rebuilt as synthetic middle-market names with tier/provenance/banding), **synthetic-data labeling** (SAMPLE DATA / "(synthetic)" / SYNTHETIC pills), **staleness** (dates current), **intake latency** (now a staged progress indicator). The whole **Act-3 Sourcing** flow is built and works end to end.

---

## P1 — Fix before the call (credibility risks)

### ISS-1 · Box threshold (≥1.20) contradicts the underwrite caution trigger (<1.25), on the same screen
- **Where:** any borderline underwrite (reproduce on **Confluence Steel** → Underwrite). URL `…/deals/deal_demo_borderline_indl/underwrite`.
- **Observed:** memo reads **"CAUTION · global DSCR 1.21× under 1.25×"** while the **Credit Box** chip in the right rail on the same screen says **"Global DSCR ≥ 1.20."** 1.21 is *inside* the stated box, yet the deal is cautioned against an undisclosed 1.25 threshold.
- **Why it matters:** this sits **on the hero re-underwrite beat.** An ex-Macquarie underwriter will immediately ask "why is a 1.21× deal cautioned when my floor is 1.20?" It directly undercuts the "underwrite to *your* box" promise — the read doesn't match the box shown.
- **Fix:** either (a) set the box's global-DSCR chip to **1.25** to match the caution logic, or (b) show a **band** on the box and memo (e.g., "Floor 1.20 · Target 1.25") so a 1.21× CAUTION is self-explanatory. (b) is the stronger product answer.

### ISS-2 · Email-paste extraction returns $0 on every financial field
- **Where:** Intake → **+ Deal → Paste email text** → Submit. Then open the draft.
- **Observed:** pasted a clean, explicit broker email (equipment cost $9.2M, loan $7.36M, revenue ~$38M, EBITDA ~$6.1M, net worth ~$14M). Extractor correctly pulled **borrower, state (OH), asset class, and inferred NAICS 332721** — but **every dollar figure came back $0**, the score was **0**, and all seven box checks showed **"not found, confirm?"**. ("Ask" shows **$0** in the intake list.)
- **Why it matters:** Act 2's whole claim is "watch it spread and screen." A headline **$0 / score 0** on a deal that clearly stated its numbers reads as broken to this buyer. The seeded desk deals are rich because they're *seeded*; the **live email path is the hollow link.**
- **Fix (pick one, in priority order):** (a) make numeric/dollar extraction from free-text email robust; (b) ship a known-good demo email that extracts cleanly and ship it as the canned Act-2 input; (c) reframe the UX so a partial extract is clearly "draft — confirm the rest," not a zeroed deal. **At minimum for the demo:** confirm one specific email extracts financials, and lock the demo to that email.

### ISS-3 · Structuring calculator is not bound to the deal's ask
- **Where:** any deal detail (e.g., **Granite Ridge**, ask $11M; **Confluence**, ask $8M). URL `…/deals/<id>`.
- **Observed:** the "Structuring calculator" defaults to **Equipment cost $500,000 → monthly payment $8,853**, displayed directly alongside an **ASK AMOUNT of $11,000,000** (Granite) / $8,000,000 (Confluence). Same placeholder on every deal.
- **Why it matters:** an $11M forging press shown at **$8,853/month** is a five-second tell. If the calculator is shown at all, the mismatch is glaring.
- **Fix:** bind the calculator's equipment cost (and resulting payment) to the deal's actual ask on load. Until then, the demo avoids this panel (noted in the playbook).

### ISS-4 · Placement / "Lender match" surfaces are off-message for a direct lender
- **Where:** **every deal detail** ("Lender match · LIVE · Run match — *ranks your lender panel… so you can place it*") and the **"LENDER DECISION"** link one click from the hero underwrite memo.
- **Observed:** prominent placement language on a balance-sheet-lender demo. (Names behind "Run match" are synthetic per spec — so this is a **messaging** issue, not a hygiene leak.)
- **Why it matters:** Empire is a **direct lender** — "place it / rank lenders / lender decision" implies shopping the deal to peers, the opposite of the story. It's also a discovery-derailment risk if she clicks it.
- **Fix:** add a tenant/config flag to **hide or relabel** placement surfaces for a direct-lender account (the same way the Deals tab was cleaned up). At minimum, demote them out of the default deal-detail view.

---

## P2 — Polish & AI-tells (fix if time; an analyst notices)

### ISS-5 · Global cash-flow table appears not to tie
- **Where:** underwrite memo → "Global cash flow."
- **Observed:** row **"TOTAL INCOME $1,305,000 / TOTAL DEBT SERVICE $1,830,205"** sits directly above **"Global DSCR 1.48×"** — but 1.305M ÷ 1.83M = 0.71×. The model is actually correct (1.48× = business CAADS ~$1.4M + personal income $1.305M ÷ debt service), but the row labeled "TOTAL INCOME" **excludes business cash flow**, so the rows visibly don't divide to the stated DSCR.
- **Why it matters:** a careful underwriter reads exactly these rows. As shown, it looks like an arithmetic error even though it isn't.
- **Fix:** relabel the row "Personal income," or add an explicit "Business CAADS" line into the global table so it visibly reconciles to the Global DSCR and Global CAADS.

### ISS-6 · Sub-$3M deals on the desk/Deals violate the configured box floor
- **Where:** Desk & Deals — **Meridian Precision Works ($1.1M)**, **Cascade Telematics Holdings ($1M)**. Box floor is **Ticket ≥ $3M**.
- **Why it matters:** deals below the box's own minimum ticket sit in the queue unflagged — contradicts "screened against your box," and Empire's real floor is $3M.
- **Fix:** either raise these to ≥$3M, route them out as below-box, or visibly flag them as sub-floor.

### ISS-7 · ✅ FIXED (verified 2026-06-18) — Irongate now reads "Quiet right now — no fresh capex triggers on this portfolio."
- **Was:** both Brookford and Irongate showed a capex event; no contrast.
- **Now:** Irongate is quiet; the "Brookford lit vs. Irongate quiet" contrast lands as intended.

### ISS-8 · snake_case / mis-classed asset labels
- **Where:** deal detail ASSET CLASS and memo "Financing for …".
- **Observed:** raw enum values surfaced to the UI — **`machine_tool`**, **`power_systems`**; and **Confluence Steel's plate processing line is classed `construction`** (it's metalworking/industrial machinery, not construction equipment).
- **Fix:** map asset-class enums to human labels ("Machine tool," "Power systems") and correct the Confluence classification.

### ISS-9 · Raw ISO timestamps on memos
- **Where:** underwrite memo header.
- **Observed:** **`2026-06-18T01:24:51.121Z`** — full ISO with milliseconds, and the UTC date reads as *tomorrow* relative to the desk's "June 17."
- **Fix:** format as a clean local date (e.g., "June 17, 2026") with no ms / no timezone artifact.

### ISS-10 · Em-dash in sourcing copy (partially fixed)
- **Brookford event blurb:** ✅ FIXED (verified 2026-06-18) — now "…site build-out imminent. An 18-24 month power and cooling capex cycle."
- **Still open:** the Sourcing page **subhead** still contains an em-dash ("…land in your box **—** so deal flow arrives qualified…").
- **Fix:** sweep remaining demo copy for em-dashes; replace with periods or restructure.

### ISS-11 · "Broker commission / Broker fee" framing on a direct-origination demo
- **Where:** underwrite memo ("BROKER COMMISSION") and terms panel ("BROKER FEE").
- **Why it matters:** minor, but Empire originates directly; "broker commission" subtly reinforces a broker-intermediated frame for a balance-sheet lender. (Direct lenders do buy broker paper, so not wrong — just slightly off-tone.)
- **Fix:** consider "origination fee," or make the label configurable per account.

### ISS-12 · Desk header count doesn't match visible rows
- **Where:** Desk header.
- **Observed:** "10 on the desk · 8 awaiting your decision · 2 underwritten," but the "On your desk" section renders 6 awaiting rows (+2 underwritten). 2 awaiting deals aren't shown in the section.
- **Fix:** reconcile the counter with what's rendered (or label the section "top by exposure" if it's intentionally capped).

### ISS-13 · Near-duplicate "Cascade" entities
- **Where:** Desk/Deals — **Cascade Logistics Group** (telematics fleet) and **Cascade Telematics Holdings** (also fleet/telematics).
- **Why it matters:** two same-prefix, same-sector synthetic names read as a duplicate/bug.
- **Fix:** rename one for distinctiveness.

### ISS-14 · "Revert to seeded" leaves inputs and memo out of sync
- **Where:** underwrite screen after a re-underwrite.
- **Observed:** "Revert to seeded" resets the **term inputs** (e.g., Amort back to 5) but leaves the **previously computed memo** displayed (still APPROVE / 120-month), and a reverse **"WAS APPROVE"** tag can persist on the next compute. Inputs and memo disagree until you re-underwrite again.
- **Why it matters:** demo-reset gotcha — easy to start a dry-run from a stale/contradictory state.
- **Fix:** "Revert to seeded" should restore the seeded **memo + inputs** atomically (and clear the directional "was X" tag).

---

---

## Sourcing screen — comprehension / intuitiveness (P2, demo-relevant)

> Context: the people *running* the demo (business side, not EF natives) found the sourcing screens hard to follow on first read. The vocabulary ("sponsor," "monitored," "check $5M–$50M") is **correct for the buyer** (Katharine is ex-Macquarie; "sponsor = PE firm" is her native language — **do not remove these terms**), but the screen doesn't make the **sponsor → portfolio company → trigger → financeable deal** chain self-evident to anyone newer. These changes make the screen teach itself without dumbing it down. *(The demo-prep doc now explains the full chain — [[active/quintel-katharine-demo-prep-2026-06-16]] §3 — so this is belt-and-suspenders, but on-screen clarity also helps Katharine's colleagues when she forwards it.)*

### ISS-15 · "Sponsor" is never defined on-screen
- **Where:** Sourcing header / sponsor cards.
- **Observed:** the page leads with "Which sponsors should we be watching for you?" and "the sponsors whose portfolios you want to forward-source" with no gloss.
- **Fix:** add a one-line helper near the header or as a tooltip on the first card — e.g., *"Sponsors = the PE firms that own your borrowers. Name the ones you cover; we watch every company they own."* Keep the word "sponsor"; just gloss it once.

### ISS-16 · Card metrics are ambiguously labeled
- **Where:** sponsor card sub-line ("1 monitored · check $5M–$50M").
- **Observed:** "1 monitored" (monitored *what*?) and "check $5M–$50M" ("check" as a label is unclear) require interpretation.
- **Fix:** "1 monitored" → **"1 portfolio company monitored"**; "check $5M–$50M" → **"watching for deals $5M–$50M"** (or "ticket band $5M–$50M").

### ISS-17 · The sponsor → company → deal chain isn't visually explicit
- **Where:** the event/cascade detail page.
- **Observed:** the page jumps from a sponsor's capex event to the private-counterparty diagram and cascade, but never visually states *which sponsor* and *which portfolio company* this came from. The viewer has to infer the relationship. (The only hint is "reach via Brookford Capital" buried in the next-action line.)
- **Fix:** add a breadcrumb / provenance line at the top of the detail page, e.g., **`Brookford Capital (sponsor) ▸ Larkspur Digital (portfolio co.) ▸ 8-K anchor lease (trigger)`**. This single line makes "watching the sponsor produced this lead" obvious.

### ISS-18 · The private-counterparty diagram needs a plain-language gloss
- **Where:** "WE DROP THE PUBLIC FILER, SURFACE THE PRIVATE LEAD" (struck public filer → private lead).
- **Observed:** punchy but jargon-y; a first-time viewer may not parse why a struck-out public company yields a private lead.
- **Fix:** add a one-line plain gloss under it, e.g., *"A public company's SEC filing named this private company as its counterparty — the private one is the deal you can finance."*

### ISS-19 · Cascade tags (IN BOX / OPEN TO BAND / OUT) have no legend
- **Where:** the cascade phase list.
- **Observed:** phases are tagged IN BOX / OPEN TO BAND / OUT → routed with no on-screen key; a first-time viewer infers the meaning.
- **Fix:** add a small legend or tooltips: **IN BOX** = fits your box · **OPEN TO BAND** = close, worth a look · **OUT** = outside an EF box, routed elsewhere (e.g., CRE/SBA). The "OUT → routed" discipline is a selling point — make it legible.

### ISS-20 · Sourcing page over-indexes on sponsors as the framing — undersells the multi-source engine (positioning risk)
- **Where:** Sourcing page hero ("Which sponsors should we be watching for you?" + "SPONSOR WATCHLIST" as the dominant section).
- **Observed:** the page's entire hero framing is sponsor-centric. The **multi-source breadth is real but buried** — it only appears below the fold in the "Signal log" (which already shows EDGAR *and* a non-sponsor USAspending federal-award trigger), and as provenance badges (EDGAR/UCC/TRADE/IR) over on the Deals tab.
- **Why it matters:** a buyer reads the hero and concludes "this is a sponsor-watcher" — capping perceived capability ("oh, so you watch my sponsors, that's it?"). Sponsors *should* lead (it's the buyer's channel and the differentiated layer competitors lack), but as a **lens on a multi-source engine**, not as the whole product. This is a positioning ceiling, not just polish.
- **Fix (product):** make the screen express **two axes** — *sources* (what's watched: SEC filings · federal awards · UCC liens · regulatory triggers) and *lenses* (how you point it: by sponsor · sector · trigger). Concretely: (a) a one-line hero subtitle naming the source set; (b) a **lens switcher** ("View by: Sponsor · Sector · Trigger") with Sponsor as the default; (c) pull a compact "sources watched" indicator above the fold so breadth is visible without scrolling. The through-line to keep front-and-center: **every lead is pre-scored to your box, regardless of source.**
- **Demo mitigation (already handled):** the prep doc ([[active/quintel-katharine-demo-prep-2026-06-16]] §3) now pre-frames the engine's breadth at the open and adds a "prove it's not just sponsors" beat pointing at the USAspending signal. This is a narration workaround; the on-screen fix above is the durable solution.

---

## ENH — Enhancements / room for improvement (post-demo or if quick)

- **ENH-1 · One-click demo reset / reseed.** A single control to restore all demo deals (Confluence → no-memo/CAUTION, Larkspur → seeded, etc.) to a known state. Huge for dry-runs and for recovering mid-demo. (Today, resetting an already-underwritten deal has no obvious path.)
- **ENH-2 · Pre-underwrite the sourced hero (Larkspur) by default**, so "Open on desk" closes the Act-3 loop **instantly** on the APPROVE memo — *or* make the live underwrite a deliberate, narrated beat with a spinner. Today it lands on "no credit memo yet" unless pre-run, which breaks the "opens as a finished underwrite" line.
- **ENH-3 · Editable box (inline).** Make the Box page's gates/thresholds editable with live recompute, so "change a threshold → re-underwrite live" becomes a real, jaw-drop beat. Currently the Box is display-only and the live recompute is only on deal *terms* — which means the objection-handling line "yes, change a threshold and it re-underwrites" isn't literally demonstrable.
- **ENH-4 · Robust live-PDF (deal-jacket) extraction.** The strongest version of the ask is "send me a redacted jacket, I'll run it live." That path is currently unverified. Making it reliable (multi-page PDF → spread → screened, in <~6s) unlocks the best close.
- **ENH-5 · Show the residual-curve provenance** on the loan-to-OEC table (where the auction/retail %OEC curve comes from per asset class). Pre-empts "where's this residual from?" from a collateral-savvy underwriter.
- **ENH-6 · Tighten the live re-underwrite magnitudes.** On Confluence, Amort 5→10 moved global DSCR 1.21× → 2.33× (a ~1.9× jump). Doubling the term cuts annual debt service by only ~1.6× on a 9% loan, so the swing is a touch larger than the lever alone justifies — a careful eye might note "that moved a lot." Worth sanity-checking the re-amortization math so the deltas are defensible.
- **ENH-7 · Sponsor watchlist persistence.** The "add a sponsor she names" co-build beat is great; make added sponsors persist (and, eventually, actually wire feeds) so the co-build promise is real, not just a card.

---

## Notes on demo state left behind (2026-06-17 walkthrough)
- Deleted a test intake draft ("Hartwell Precision") via **Not a deal** — intake is empty again.
- **Confluence Steel** left at **CAUTION** (may carry a cosmetic "was approve" tag — reload to clear).
- **Larkspur** left **pre-underwritten to APPROVE** (this actually matches the intended Act-3 instant-loop — see ENH-2).
- **Granite Ridge** unchanged (pre-seeded APPROVE).

## What was NOT a problem (checked, and fine)
- **`§168(n)`** in the sourcing signal log is **correct** — the 2025 OBBBA added IRC §168(n) for immediate expensing of qualified production property; the log labels it "OBBBA §168(N)." Keep it; current tax-law awareness is a credibility asset with this buyer.
- **EDGAR 8-K Item 1.01 → private counterparty** mechanism, the cascade phasing, the "OUT → CRE/SBA" routing, tier/banding/provenance badges — all present and on-thesis.
