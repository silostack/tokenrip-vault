---
title: Quintel — Demo Shape (Broker-First)
status: active
owner: Simon
type: demo-design
product: Quintel
created: 2026-06-08
related:
  - product/quintel/quintel-build-and-gtm-roadmap-2026-06-08.md
  - product/quintel/ef-product-spec-2026-06-02/reference/lender-network.html
  - product/quintel/ef-product-spec-2026-06-02/reference/keystone.html
---

# Quintel — Demo Shape (Broker-First)

> **What this is:** the concrete shape of what a broker actually *sees* — the screens, the demo storyboard, and the order we make pieces real. Companion to [[quintel-build-and-gtm-roadmap-2026-06-08]] (which covers the why/what/business); this covers the *looks-like* and the demo build plan.

---

## 1. Demo philosophy (three locked calls)

1. **We bring the deals, not the prospect.** Asking a cold broker for their book — before a call or even on it — won't fly (confidential, SSN-laden, and it front-loads work onto them). Instead we build a small set of **demo deals anonymized from real ones** (the ~7 real EF memos are the seed). They are reusable fixtures across every demo. **Non-negotiable: preserve the messy texture of the originals** — the specific equipment, the odd industry, the ugly scanned bank statement, the one exception. A broker smells a fake deal instantly (round numbers, clean paperwork, no "except"s); the texture is what makes them think *"this person knows my world,"* which is most of the sale.

2. **The hero is the Detail screen on a texture-rich deal.** Not a dashboard, not the live-drop — the single deal, fully worked: verdict + why + every-number-traced-to-its-source + which lenders to send it to. That one screen carries the entire value proposition.

3. **The live-drop is the closer, not the opener — and it comes *after* at least an initial call.** Once a broker is leaning in (second touch, or later in a deepening first call), *"drop in a fresh deal doc — redact the name, just leave the financials"* removes the "but is it real?" doubt by extracting a document the engine has never seen. It's the unfakeable beat, held in reserve. The first demo never depends on it.

**Corollary (the build unlock):** because the first demo runs entirely on deals *we* control, **the first end-to-end demo can be fully faked and ship immediately** — it needs only the anonymized deals + mocked screens. Real extraction is gated by the *closer* (second touch), not the first demo. So validation/outreach is never blocked on a real build. (See §4.)

---

## 2. The screens

Three screens carry the broker product; two more exist in the full mock but aren't made real first.

### Screen 1 — Pipeline / Inbox (the home; this *is* the dashboard)

One row per deal: borrower · equipment · ask · **verdict badge** (Fund / Marginal / Pass) · recommended lender · days-in-stage. The home screen's most important job is to **make the screening value visceral**: junk is demoted to the bottom, greyed, each with a one-line kill reason. A broker glancing at it feels *"it already threw out the garbage I'd have wasted Tuesday on."* That feeling is the #1 pain (junk-screening), answered at a glance.

There is **no separate analytics/market dashboard** in the broker product — the pipeline is the operational home. A charts-and-signals market dashboard is the *sourcing / market-intelligence* layer, which is the up-market upsell, not the broker wedge.

```
┌───────────────────────────────────────────────────────────────┐
│ Quintel   ▸ Pipeline   Lenders   Settings              [+ Deal] │
├───────────────────────────────────────────────────────────────┤
│  PIPELINE (12)                                  filter ▸ all ▾  │
│  ● FUND     Acme Hauling    Cat 336 exc.  $1.2M  → Lender A  2d │
│  ● FUND     Ridge Logistics 3× reefer     $780K  → Lender C  1d │
│  ◐ MARGINAL Delta Grading   skid steer    $145K  review     4d │
│  ───────────────────  auto-screened out (4)  ──────────────────│
│  ○ PASS     —              —              —   active bankruptcy │
│  ○ PASS     —              —              —   credit 560 < floor│
└───────────────────────────────────────────────────────────────┘
```

### Screen 2 — Deal Detail (the HERO)

The screen the whole sale rests on. It has to answer four questions at a glance: **is this deal good?** (the decision), **why should I believe you?** (provenance), **where do I send it?** (match), and **can I make it mine?** (override). Layout: a deal-summary header, a two-column body (decision left; extraction + match right), and an action bar — wireframe below, region-by-region spec under it.

```
┌───────────────────────────────────────────────────────────────┐
│ ‹ Pipeline   Acme Hauling · Cat 336 excavator · $1.2M    ● FUND │
├──────────────────────────────────┬────────────────────────────┤
│ DECISION                          │ EXTRACTED  (source-linked)  │
│  Fund · ~9.5% / 48mo · loan       │  Avg deposits  $85K   ▸p2 BS│
│  Why:                             │  Time in biz   6 yrs  ▸ CV  │
│   • 6 yrs in business             │  Est. credit   712    ▸p1   │
│   • $85K avg deposits, DSCR ~1.4  │  Equip value   $1.3M  ▸quote│
│   • A-rated collateral (Cat 336)  │  [ view source documents ]  │
│  Flags:  ⚠ one 30-day late (ok)   ├────────────────────────────┤
│  Screen: ✓ no bk  ✓ no judgments  │ MATCH  (your lenders)       │
│          ✓ credit > floor         │  1. Lender A — constr. cap. │
│                                   │     · holds pricing   ★rec  │
│                                   │  2. Lender C — size fit     │
│                                   │  3. Lender F — backup       │
├──────────────────────────────────┴────────────────────────────┤
│  [ Approve ]  [ Override ]  [ Route ]       [ Draft package ▸ ] │
└───────────────────────────────────────────────────────────────┘
```

**A · Deal-summary header** (full width) — back-to-pipeline · borrower (entity) · asset (year / make / model / class) · ask (amount + purpose) · stage chip · **verdict badge** + documents-ingested count. The verdict shows **a band (Fund / Marginal / Pass) *and* a 0–10 score** — band for the glance, score for the gradient. *(Showing both is the proposed resolution to the open verdict-taxonomy question — confirm.)*

**B · Decision** (left column — the judgment, the headline)
- **Verdict line:** structure + indicative band, caveated — *"Fund · equipment loan · ~9.5–10.25% / 48 mo."* A band, never a false-precise single rate.
- **Why (the case):** 3–5 bullets, each tied to the data that drove it — *"6 yrs in business," "$85K avg monthly deposits → DSCR ~1.4," "A-rated collateral (Cat 336 holds value)."* Hover a reason → highlights the source field(s).
- **Flags & mitigants (soft):** amber items that move pricing/structure but don't kill, each showing its effect — *"one 30-day late — workable, +25 bps."*
- **Disqualifier screen (hard gates):** the screening value made explicit — a pass/fail checklist: no active bankruptcy ✓ · no active judgments ✓ · no active collections ✓ · credit ≥ floor ✓ · time-in-business ≥ min ✓. On a Pass, the failed gate is red and names the auto-decline reason.
- **(Marginal only) Path to fund:** *"what would move this to Fund"* — *"+1 month bank statements," "stronger at a 36-mo term."* Doubles as the follow-up hook (the EF version of smart intake — a couple of targeted asks back to the borrower).

**C · Extraction** (right column, upper — the trust layer / the visual signature)
- A field table: **field · value · confidence · source link.** The source link is the signature interaction — click → source-document viewer with the exact span highlighted.
- Field set (the broker-underwriting core): avg monthly deposits (3–6 mo) · time in business · estimated credit / band · existing debt service → DSCR · equipment value + LTV (from the quote) · entity / ownership / industry (NAICS) · requested amount · purpose · desired term.
- Confidence per field (low = amber "review"); unresolved fields surfaced as *"not found — confirm?"*, never hidden.
- *"View source documents"* → the ingested set (bank statements, tax return, equipment quote, credit app, PFS).

**D · Match** (right column, lower — where to send it)
- Ranked 3–5 of *their* lenders. Each row: lender · fit reason · capacity/appetite · indicative rate they'd offer · (later) realized-performance score. One ★ Recommended.
- Fit reasons grounded in the domain: size band · equipment-type appetite · credit box · geography · *"not maxed in [sector]."* The rate-vs-fit tradeoff is visible (best-fit at 9.5% vs faster-but-pricier at 10.5%).
- Per-lender action: Route → · Draft package for →.

**E · Action bar** (full width) — **Approve · Override · Route · Draft package.**
- **Override is load-bearing:** it's where the broker imposes their own judgment (adjust verdict / rate / structure / reorder or add lenders). This is the "70%-moldable" made literal — one click to start editing, every change logged to the audit trail, and (later) feeding back to calibrate the rubric.

**States** — **Fund** (green): full structure, populated match. **Marginal** (amber): "fundable with conditions" + path-to-fund; conditional/shorter match. **Pass** (grey/red): the failed hard gate front-and-center, decline reason, no match (rarely opened — mostly seen demoted in the pipeline; included so the screen handles a "no").

**Real-vs-faked** — Layout: real day one. Demo deals: verdict / why / fields / provenance / match all pre-computed (we own the deals); provenance links resolve to the demo docs' real spans. First real piece: **extraction** (so the live-drop fills this panel for real, with real provenance). `decide` / `match` go real per design partner.

### Screen 3 — Package draft (the end-to-end close)

What the broker actually *sends* — the deliverable that turns a screened deal into a placement. A broker wants the whole flow, so the demo doesn't stop at "fundable"; it produces the thing they'd email a lender. It's the **"hand"**: deal + the chosen lender's profile → a tailored submission, generated and ready to send.

```
┌───────────────────────────────────────────────────────────────┐
│ ‹ Deal     Submission — Acme Hauling → Lender A      [ Send ▸ ] │
├───────────────────────────────────────────────────────────────┤
│  THE ASK    $1.2M · 2021 Cat 336 · equipment loan · ~9.5%/48mo │
│  BORROWER   Hauling co · 6 yrs · S-corp · 1 owner (PG)         │
│  STRUCTURE  Loan · 48 mo · ~9.5–10.25% · no balloon            │
│  THE CASE   • $85K avg deposits → DSCR ~1.4                    │
│             • A-rated collateral (Cat 336 holds value)         │
│  FLAGS →    one 30-day late · mitigant: 6 yrs + strong cash    │
│  DOCS       ☑ bank stmts  ☑ equip quote  ☑ credit  ☑ PFS       │
├───────────────────────────────────────────────────────────────┤
│  [ Edit ]    [ Regenerate ]    [ Copy PDF ]    [ Share link ]  │
└───────────────────────────────────────────────────────────────┘
```

**Contents** (a one-to-two-page submission memo): the ask · borrower snapshot (entity, industry, time-in-business, ownership/PG) · proposed structure (rate band, term, structure, residual if a lease, payment) · **the credit case** (the "why fundable" highlights, pulled from the decision's *Why*) · **flags & mitigants** — each red flag paired with its mitigant, pre-written as the broker's talking points to the lender · **attached documents** (the extracted source set, as a checklist).

**Tailored per lender (this is the imprint, not a mail-merge):** emphasis shifts to the chosen lender's box — lead with collateral for a collateral-focused lender, with cash flow for a cash-flow lender. Re-pick the lender → the package re-frames.

**Actions:** Edit · Regenerate · Copy / Download PDF · **Send** (email the lender) · **Share link** — hosted at a stable, shareable URL the lender opens in a browser (the file-sharing pain, solved: no "I can't open your attachment").

**Real-vs-faked:** faked first — a template filled with the demo deal's data (enough to show the end-to-end). Real later — generated, tailored to the chosen lender, attaching the real extracted docs. One of the *last* pieces made real (after extraction / decision / match), because the scripted version sells the concept fine.

### Later (in the full mock, not made real first)
- **Lender scorecard** — the broker's lenders ranked on realized outcomes (the moat surface; needs `capture` data).
- **Intake** — production version is *"forward your deal emails to deals@…"* (zero behavior change); the demo version is drag-drop a document (the live-drop).

---

## 3. The demo storyboard

**First demo (scripted, on anonymized deals, end-to-end — some parts faked):**

1. **Pipeline** — "12 deals in this week. These 4 are auto-killed — active bankruptcy, sub-floor credit. You're already ahead before you've opened anything."
2. **Detail (HERO)** — open a fundable, texture-rich deal: "Cat 336, $1.2M, hauling company. Scored fundable, ~9.5%/48mo — here's why. See every number? It pulled them from this bank statement [click → highlighted source]. And here are the 3 of *your* lenders to send it to, ranked — Lender A first: construction capacity, holds its pricing."
3. **Package draft** — "Approve → it drafts the submission package for Lender A, ready to send." The end-to-end close.

**Closer (second touch / once they're leaning in — the unfakeable beat):**

4. **Live drop** — "Bring me one of yours, or drop any deal doc — redact the name. Watch it extract." Unseen input, handled live.

---

## 4. Real-vs-faked build order

Mock everything first, then make pieces real **most-important-first**. "Most important" = whatever the *next* sales beat requires.

| Piece | First demo | Live-drop closer | Paid pilot (their data) |
|---|---|---|---|
| Pipeline + Detail + Package **screens** | **real (UI), faked data** | real UI | real UI |
| The **anonymized demo deals** | **real (built)** | — | — |
| `extract` (doc → fields + provenance) | pre-computed for demo deals | **must be real** | real, on their docs |
| `decide` (verdict + why + screen) | scripted from demo deal | scripted ok | **real (their rubric)** |
| `match` (rank their lenders) | scripted from demo deal | scripted ok | **real (their panel)** |
| Package draft | template + demo data | template ok | **real (generated)** |

**Reading of the table:** the **first end-to-end demo ships fully faked** (real screens + anonymized deals; everything else scripted) — so outreach/validation isn't blocked on any engine build. The **first piece made genuinely real is `extract`**, because the live-drop closer can't be faked. `decide` / `match` / package-generation go real **per design partner** (they need that broker's rubric + lender panel), which is exactly when the 70%-moldable scripted version becomes their tuned workflow.

---

## 5. Look & feel

- **Institutional, not crypto-toy.** Dense, data-forward, every value traceable — Bloomberg-terminal register, not a colorful SaaS marketing page. (This is the whole reason the product is "Quintel," not "TokenRip," to a finance buyer.)
- **Provenance is the aesthetic signature** — source-links on every extracted field are both the trust mechanism and the thing that makes it *look* like real software that read the documents.
- **Borrow the existing visual language.** Scrubbed reference HTMLs already live in `product/quintel/ef-product-spec-2026-06-02/reference/`: the **lender-network** CRM maps onto the Match panel + lender scorecard; **keystone** is a deal command-center to mine for the Detail layout. Reuse components/palette rather than starting cold.

---

## 6. Open questions

- **Intake for the live-drop:** drag-drop a file is obvious, but should the closer also accept "paste the deal email" (closer to how deals actually arrive)? Decide before building `extract`'s ingestion surface. → **Now designed in [[quintel-intake-design-2026-06-09]]** — a unified intake queue (forward-to-`deals@` + manual drop/paste), one surface for the broker and lender products.
- **How real does the package draft need to look in the first demo?** A static template filled with demo data may be enough; or does a broker poke it? (Guided demo protects it either way — §1 of the roadmap's "keep the demo guided" rule.)
- **Verdict taxonomy:** Fund / Marginal / Pass is clean — confirm it matches how brokers actually talk (vs. a 1–10 score, which a second broker used). May want both: a band + a score.

---

*Demo-design companion to the build+GTM roadmap. Update §2/§3 as the screens take shape.*
