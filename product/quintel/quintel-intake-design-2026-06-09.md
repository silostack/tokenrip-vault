---
title: Quintel — Intake / Deal Creation Design
status: active
owner: Simon
type: product-design
product: Quintel
created: 2026-06-09
related:
  - product/quintel/quintel-demo-shape-2026-06-08.md
  - product/quintel/quintel-build-and-gtm-roadmap-2026-06-08.md
build_doc: "terminus → apps/deal-engine/docs/plans/2026-06-09-intake-design.md"
---

# Quintel — Intake / Deal Creation Design

> **What this is:** the design for how a deal gets *into* Quintel — the `ingest` stage of the spine, made into a surface. Designed for the **working product** (not the demo); the demo v1 is worked backward from this. **One intake surface serves both the broker product and the lender product** — that double-duty is the whole reason to build it once. Companion to [[quintel-demo-shape-2026-06-08]] (the downstream screens) and [[quintel-build-and-gtm-roadmap-2026-06-08]] (the spine/business). Build-side specifics (data model, endpoints, file paths) live in the Terminus build doc referenced in the frontmatter.

---

## 1. The frame — intake is the `ingest` stage, not a "create deal" form

A deal is **not created by a human filling in fields.** It is *born* from a bundle of messy source material that arrives, gets auto-processed (**classify → extract → structure → screen**), and lands in a tray for the operator to confirm into their live pipeline.

So a deal carries a **lifecycle status**: `intake` (in the tray, unconfirmed) → `pipeline` (confirmed, live) → … . The **Intake tray is simply *deals where status = intake***. No separate entity, no throwaway object — the same Deal Object the rest of the product already uses, seen earlier in its life.

### The double-duty insight: the broker's output is the lender's input

A **broker** ingests a borrower's raw docs → screens → packages → emails a submission to a lender. The **lender** (Stauss / VFI) ingests *that submission* → screens against their own credit box → replies. **Both sides run the identical pipeline on inbound email-with-attachments.** They diverge at exactly two config points:

| | **Broker** | **Lender (Stauss / VFI)** |
|---|---|---|
| What arrives | borrower's raw docs (bank stmts, tax return, equipment quote, credit app, PFS) | a broker's packaged submission (often 1 PDF) + a cover email |
| Screened against | general fundability rubric | *this lender's* credit box |
| What happens after confirm | match → package to lenders | approve / counter / decline → reply to broker |

The intake surface, the bundling, the extraction, the tray, the confirm — **all shared.** Rubric and downstream-action are config. That symmetry is what makes this worth building once and shipping on both surfaces.

---

## 2. The front doors — three channels, one ingest job

Everything converges on a single internal **ingest job** (raw bundle → processed candidate). The channels are just how material arrives.

**1. Email — the primary door (zero behavior change).** Each account gets a dedicated address: `deals@{name}.quintel.ai`. Two ways to use it:
- **Forward** a deal email to it — works day one, nothing to set up.
- **Auto-forward rule** in Gmail / Outlook → deals flow in hands-free.

The email **body** is captured too, not just attachments — it's where the broker writes *"client needs $1.2M for a Cat 336, 6 yrs in biz"* (context the docs don't state outright). For the **lender, this is the literal Stauss workflow**: brokers already email him deals — he changes the address (or BCC / auto-forwards), and his inbox chaos becomes a screened tray.

**2. Manual create ("+ Deal") — the control door.** The currently-inert nav button opens a drawer with three tabs: **drop files** · **paste email text** · **paste a link** (shared drive / portal). This is the dashboard-create gesture an operator expects, and it doubles as the live-drop surface. Always available as the fallback when something didn't auto-arrive.

**3. Connected inbox (Phase 2) — the magic door.** OAuth into Gmail / Outlook, watch a label / folder; deals self-create. Highest magic, but it needs auth + dedup + non-deal filtering to be trustworthy, so it's a fast-follow on the *same* pipe — not v1.

> **v1 ships doors 1 (forward) + 2 (manual).** Auto-forward and connected-inbox are progressive enhancements on the same ingest pipeline.

---

## 3. The Intake surface — the tray + the review

A new top-level nav item, **Intake**, sits *before* Pipeline with a count badge. It's the operator's first stop each morning.

### The tray — a list grouped by state

```
INTAKE                                        deals@acme.quintel.ai  ⚙
┌──────────────────────────────────────────────────────────────────┐
│ NEEDS REVIEW (3)                                                   │
│ ✉ Acme Hauling      Cat 336 exc.   $1.2M   ● FUND    2h   ▸ review │
│ ✉ Delta Grading     skid steer     $145K   ◐ MARG    5h   ▸ review │
│ ⬆ Ridge Logistics   3× reefer      $780K   ● FUND    1d   ▸ review │
│ ── NEEDS INPUT (2) ──────────────────────────────────────────────│
│ ✉ Voss Transport    —              —    ⚠ missing 2 of 3 bank stmts│
│ ✉ (thread, 2 msgs)  Hill Paving    $310K   ⚠ looks like 2 deals?   │
│ ── PROCESSING (1) ───────────────────────────────────────────────│
│ ⬆ uploaded.pdf      extracting…    ▓▓▓▓░░                          │
└──────────────────────────────────────────────────────────────────┘
```

Each row carries the **channel icon** (✉ email / ⬆ upload), sender or filename, the extracted borrower / asset / ask, the **draft verdict**, and age.

**The four states:**
- **Processing** — just arrived, extracting.
- **Needs review** — clean, extracted + screened, awaiting confirm (the resting state).
- **Needs input** — something's off: missing docs, ambiguous classification, possible duplicate, or a multi-deal email.
- Then it leaves the tray as **Confirmed** (→ Pipeline) or **Dismissed** (not a deal / junk / duplicate).

### The review screen *is* Deal Detail, in draft mode

Opening a tray row opens the **exact Deal Detail hero screen** ([[quintel-demo-shape-2026-06-08]] §2) — extraction fields + provenance + screen gates + draft decision — but in an **unconfirmed/draft mode** with a confirm bar instead of the action bar:

```
[ Confirm → Pipeline ]   [ Fix a field ]   [ Not a deal ]   [ ⋯ Merge / Split ]
```

So there is **no second deal view to build** — Detail is the canonical deal view, shown earlier in the lifecycle. Corrections made here (reclassify a doc, fill a *"not found — confirm?"* field) are the human-in-the-loop that also calibrates the rubric over time.

A small **⚙ settings** corner holds the `deals@` address, forwarding instructions, the connected-inbox toggle, and the screening box / rubric.

---

## 4. The hard problems — this is the actual product, not the form

The form is trivial. These five are where the value and the engineering live, and each maps to a real inbox pain.

1. **Bundling / threading — the #1 inbox pain.** Deals don't arrive as one clean packet: an initial email + three follow-ups each dragging one more doc; a forwarded thread; one email with six PDFs. The engine must **associate inbound material to a deal** — new vs. append-to-existing — and surface *"this looks like it belongs to Acme Hauling (in your tray)"* for one-click attach. This is the "I'm drowning in my inbox" pain, solved. It's the hardest part, so v1 ships a **good-enough heuristic** (same sender + entity/borrower match + time window) with a **manual merge / split escape hatch**, and improves from there.

2. **Doc classification.** Which attachment is the bank statement vs. tax return vs. equipment quote vs. signed app vs. the broker's cover memo — drives how each is parsed. Low-confidence classification is flagged in the review screen, never silently wrong.

3. **Missing-docs detection — the smart-intake hook.** *"To screen this I need 3 months of bank statements; I see 1."* Produces the **path-to-fund / stip list** — for the broker, a targeted ask back to the borrower; for the lender, a stip request back to the broker. Same mechanism, both sides. This is where the **Needs-input** state comes from, and it's high-value on its own.

4. **Dedup.** Same deal forwarded twice; borrower already in the pipeline. Caught on entity + asset + ask, **flagged as a possible duplicate** rather than auto-merged.

5. **Non-deals.** Newsletters, lender rate sheets, *"lunch?"* — filtered *out* before they reach the tray, never surfaced as junk deals. Misfires land in a low-priority *"not sure this is a deal"* bucket, never the main tray.

> **Honest v1 cut:** classification + extraction + missing-docs + a heuristic bundle/dedup with manual merge-split. Threading and non-deal filtering ship *good enough* and improve with use.

---

## 5. Broker vs. lender — the divergence, and the lender's killer value

Everything in §1–4 is shared. The two surfaces diverge only here:

| Stage | **Broker** | **Lender (Stauss / VFI)** |
|---|---|---|
| **Screen / decide** | general fundability rubric | *this lender's* credit box (config) |
| **Downstream of confirm** | match → package to lenders | approve / counter / decline → reply to broker |

**The lender's killer value lives at intake itself.** Brokers each send deals in a different format; the engine **normalizes all of them into the lender's one standard intake template.** That is verbatim the pain Stauss and Alek described — *"a translation layer, unstructured → structured, a central template."* For the lender, **intake *is* the product**: an inbox of mismatched broker submissions becomes a uniform, pre-screened queue against their own box. Same pipeline, different rubric, no match stage.

This also means the two surfaces share a **surface-type config** (`broker` vs `lender`) that selects rubric + downstream action — which slots cleanly into the existing two-password / two-surface split already shipped.

---

## 6. Data model & build (pointer)

Additive, no rewrite:
- The **Deal Object gains `status`** (`intake | pipeline | …`) + a `source` block (channel, sender, received-at, raw reference) + an `intake` block (classification confidence, missing-docs list, dedup candidate, thread reference).
- A new raw **`Submission` / ingest-job** record retains the original email + attachments — powering both **"open original"** provenance *and* the audit trail.
- **Mostly reuse:** the Detail screen (→ draft mode), the existing `IntakePanel` component (the stips / missing-docs concept is already half-built in the memo), the broker fixture-loader pattern.
- **New:** the Intake nav + tray, the ingest endpoints (upload/paste + inbound-email webhook + tray list + confirm), and the classify / bundle / missing-docs services (the hard-problem core).

→ Full data model, endpoints, and file-level reuse-vs-new plan: **Terminus build doc** (`apps/deal-engine/docs/plans/2026-06-09-intake-design.md`).

---

## 7. v1 scope & open questions

**v1 (working product, broker surface first — lender follows by config):**
- Channels: forward-to-`deals@` + manual create (drop / paste).
- Pipeline: classify → extract → structure → screen → tray.
- Tray + Detail-as-draft-review + confirm/dismiss.
- Heuristic bundle/dedup with manual merge-split; missing-docs → Needs-input.

**Open questions:**
- **Email infra:** inbound provider (e.g. a mail-receiving service / webhook) and the per-account address scheme.
- **Auto-confirm threshold:** should very-high-confidence, clean deals skip the tray and land straight in Pipeline (with an undo), or does *everything* pass through review in v1? (Lean: everything reviews in v1; earn auto-confirm later.)
- **Lender reply action:** how far to take "reply to broker" (draft a term sheet / stip request vs. just structured fields) in the first lender build.
- **Threading depth:** how much multi-email threading to attempt in v1 vs. defer behind the manual merge-split.

---

*Product-design companion to the demo-shape and roadmap. The demo v1 is worked backward from this; we may instead ship a working-product v1 directly.*
