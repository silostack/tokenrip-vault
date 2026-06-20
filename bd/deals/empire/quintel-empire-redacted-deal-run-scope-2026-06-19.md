---
title: Quintel — Empire Redacted Deal Run · Workflow & Gap Scope
status: active
owner: Simon
type: scope / build-validation reference
product: Quintel
created: 2026-06-19
related:
  - bd/calls/contacts/katharine-rudzitis.md
  - bd/calls/transcripts/katharine-rudzitis-2026-06-18.md
  - product/quintel/quintel-lender-build-roadmap-2026-06-10.md
  - product/quintel/quintel-engine-build-roadmap-2026-06-09.md
  - product/quintel/quintel-demo-shape-2026-06-08.md
purpose: >
  Self-contained reference for running Empire's redacted prior deal file
  through Quintel's lender surface. Use to compare the workflow + gap list
  against the current codebase state.
---

# Quintel — Empire Redacted Deal Run · Workflow & Gap Scope

> **What this is.** Katharine Rudzitis (Empire Asset Finance) offered to source a *redacted prior credit file* for a live run, to be turned into a packet she circulates internally ahead of a broader team call. This doc captures the full business context, the exact workflow that live run requires, and the gap between that workflow and what the engine can do — so it can be diffed against the current codebase. Self-contained: no other file required to read it.

---

## 1. The goal

**ONE thing: get a sale.** A design partner, paid pilot, or recurring-revenue customer in equipment finance. Empire is currently the **best-timed, cleanest buyer in the EF cluster** and the first independent (non-Stauss-channeled) direct-lender lead.

This deliverable — the redacted deal run packet — is the artifact that advances Empire from a strong first call to a team call with the economic buyers. It is also a **build-validation event**: Empire's file is the first *real institutional credit file* to go through the engine, so it directly pressure-tests the extraction field contract.

---

## 2. The customer

**Empire Asset Finance** — a direct, balance-sheet equipment lender; wholly-owned subsidiary of **Arena Investors, LP** ($4.6B multi-strategy firm). Launched September 2025 with a **$100M** commitment. Self-brands "capital-efficient, technology-driven." Writes **$3M–$50M** mid/large-ticket deals, terms to 7 years, up to 100% advance on new equipment. Products: capital leases, operating leases, loans, EFAs, first-amendment leases, sale-leasebacks. Target borrower: **non-investment-grade middle market** ($100M+ revenue, $10M+ EBITDA, audited/reviewed financials), often **PE-sponsor-backed**. Also runs a **capital-markets desk** that buys *and sells* syndicated deals (>$3M) with peer institutions.

**Origination split:** ~50% direct (sponsor-backed manufacturers — Katharine's domain) / ~50% indirect (syndication — buying/participating from Stonebriar and peers).

### The people
| Person | Role | Relevance |
|---|---|---|
| **Katharine Rudzitis** | VP, Direct Originations (joined Apr 2026) | **Champion / user / budget-influencer.** ~10 yrs Macquarie asset/equipment finance. Hired specifically to build the direct-origination function. Sharp, analytical. |
| **Rick Rockhold** | CEO | Economic buyer — ROI lens |
| **Mike Miroshnikov** | COO + **Chief Credit Officer** (JD) | Economic buyer — credit/underwriting lens; **the F2 user** |
| **Aaron Gehlken** | VP Direct Originations | Peer to Katharine |

### Empire's tech stack (confirmed on call)
- **HubSpot** — CRM, prospect list (~2,000 companies). "Fine for a CRM, but not fine with that more proactive stuff."
- **ZoomInfo** — supplemental contacts; she finds it shallow ("doesn't do a ton more than a public press release my Google alert could tell me").
- **F2** — underwriting/credit tool, used by the credit team (not Katharine); **currently degrading** ("changed one of its models and it seems to be working less well now"). This is the opening for the underwriting half of the product.
- **Excel** — parent-company (Arena) reporting.
- **Personal ChatGPT/GPTs** — Katharine runs a "prospecting GPT" for ad hoc screening. The bar the live run must beat.
- No unified system; everyone improvising.

### What she wants — and what she's lukewarm on
- **Hot button: the sourcing / signal layer.** "The signaling part I think is very interesting." "I don't need a new HubSpot. I need this." She wants: scrub her tier-1 list for deal signals + add net-new similar companies + two-way HubSpot sync.
- **Lukewarm: underwriting.** "The underwrite part, I don't know how interesting it is." But the F2 degradation opens it as a second vector, and **Mike (CCO) is the buyer for that piece.**

---

## 3. The deal state (as of 2026-06-18)

**Stage: Qualified.** First call (Alek ran) landed strongly — she asked pricing + user count (2–4) unprompted, volunteered to circulate internally, offered the redacted deal, recommended ELFA as a channel. Genuine engagement.

**Next milestone:** broader team call with Rick / Mike / Aaron, gated on (1) materials from us, (2) her internal circulation, (3) ideally the redacted deal run.

### Open commitments
| # | Action | Owner | Due |
|---|--------|-------|-----|
| 1 | Email materials/summary Katharine can circulate | Alek | 2026-06-20 |
| 2 | **Run redacted deal through the system, build a packet** | Alek + Simon | Within 3 days of receiving file |
| 3 | Get a redacted deal memo from a prior transaction | Katharine | ~2026-06-25 (inferred) |
| 4 | Circulate materials + set up team call | Katharine | ~2026-07-02 (inferred) |
| 5 | Scope HubSpot integration story for team call | Simon | Before team call |

---

## 4. The strategic reframe (read before scoping)

A redacted prior credit file is **backward-looking inputs** — financials, equipment list, term sheet, possibly tax returns and the original credit memo. It runs through the **underwriting / credit-desk surface**, *not* the sourcing engine. The sourcing/signal engine consumes forward-looking public data; a closed deal cannot be run through it.

Consequence: **the redacted run demonstrates the half of the product Katharine is lukewarm on.** That is targeting, not a flaw —

- The packet is the **wedge into Mike** (COO/CCO, F2 user), the economic buyer for underwriting, whose tool is degrading. It reaches him without a call.
- **Build the packet for Mike's eye**, not Katharine's.
- But the packet alone won't carry Katharine's sourcing excitement. **Pair the materials drop with a synthetic Empire-box sourcing artifact** (a signal feed scoped to her buy box) so the thing that got her hot isn't missing from what circulates. The two pieces do different jobs for two different readers.

---

## 5. The workflow — what a live run actually is

Maps to the lender (`desk`) surface demo arc and the L0–L3 build. One-sentence arc: *drop the redacted submission → it lands normalized in the tray → screened against Empire's box → verdict + indicative structure + path-to-fund → rendered as a shareable packet.*

| # | Stage | What happens |
|---|-------|--------------|
| 1 | **Box config** | Author Empire's credit box as account-scoped screen/decide config: $3M–$50M, $100M+ rev / $10M+ EBITDA, hard-asset-backed, PE-sponsor, audited/reviewed financials, + an "open to" secondary band |
| 2 | **Ingest** | Drop the redacted file(s) → classify, dedup, missing-docs check → normalized deal in the tray |
| 3 | **Extract** | Pull every field **with provenance** — each number traced to its source doc. This is the unfakeable beat that beats her prospecting GPT |
| 4 | **Screen / decide** | Score the extracted deal against the Empire box → fit verdict |
| 5 | **Underwriting read** | Verdict (approve-with-conditions / counter / decline) + indicative structure + rate/term band + reasons, modeled on the institutional credit-read sequence (§7) |
| 6 | **Path-to-fund** | Requirements indicator: what's already in hand vs. what's still needed to move it forward |
| 7 | **Package** | Render the deal summary / underwriting memo to a stable shareable URL → the packet Katharine circulates |

---

## 6. Gap analysis — workflow vs. engine

Engine state is drawn from the roadmaps (`quintel-engine-build-roadmap-2026-06-09.md`, `quintel-lender-build-roadmap-2026-06-10.md`), which report **P0 + P1 implemented**. **This is the section to diff against the actual codebase — the roadmaps are claims, not a running build.**

### Per-stage engine state (per roadmaps)
| Stage | Reported state |
|---|---|
| `ingest` (bundle / classify / dedup / missing-docs / screen) | **REAL** — config-driven per surface |
| `extract` | **REAL** — P1 swapped the fixture stub for the real extraction engine over HTTP; live-drop is "genuinely unfakeable" |
| `decide` / `screen` / `underwrite` | **REAL** — computes from data; rubric + per-lender credit profiles are config |
| `structure` | **REAL** — broker + desk structurers |
| `match` | **REAL** — data-driven panel; only ranking *weights* hardcoded |
| `review` | **STUB** — throws NotImplemented; no audit trail / state machine |
| `capture` / deal-graph | **PARTIAL** — Outcome table + some rows; no response ingestion, no feedback loop |

### Gaps that actually matter for this packet
Most product-roadmap gaps (multi-account, live email loop, feedback loop) **do not block a one-off packet.** The real list:

1. **Frozen field-contract — the only genuine unknown.** Empire's file is the first real institutional credit file through the engine — audited financials, PFS, debt notes, equipment schedules. If the extraction contract doesn't carry those doc types/fields, **patch the contract (coordinated with the P2 field-map), never a desk-side hack** — that is the single most likely place the lender build quietly forks the pipeline. Cannot be sized until the file's shape is seen. **Test the file against the contract before committing the 3-day turnaround.**

2. **Empire box config (L0).** Cheap but not built. Box is known from §2. Hours, not days.

3. **Desk-surface build state (the biggest knowledge gap).** The lender-surface doc (Jun 10) describes L0–L3 as "the next few days' work" for the Stauss/VFI demo. As of this doc (Jun 19) the actual running state is **unconfirmed**. Everything downstream depends on it. **Confirm before promising any timeline.**

4. **Package render → shareable URL.** Share-link is a P3 placeholder, but the Tokenrip stable-URL artifact primitive is live. For a one-off, render the packet as a static artifact at a Tokenrip URL. Not a blocker.

5. **CoI / data hygiene — hard constraint.** Empire's capital-markets desk trades with peers, so **Empire is effectively a VFI competitor.** Alek name-dropped VFI twice on the call. The packet, the box config, and any reference deals must be Empire-clean or synthetic — **zero VFI-proprietary box, criteria, or partners anywhere.** Scrub before it ships.

### Verdict
The spine is real (ingest, extract-with-provenance, decide, structure, match). The stubs (review audit-trail, capture loop, live email) **are not on the critical path for a packet.** Producible **conditional on**: (a) confirming the desk surface is actually running, (b) the field contract surviving a real institutional file or being patchable fast, (c) authoring the Empire box. The differentiator is **provenance-traced extraction**; keep the underwriting *judgment* deliberately rough/moldable (a too-perfect score triggers "that's not how I'd price it"; a moldable one invites co-creation).

---

## 7. The underwriting read — judgment to encode (reference)

The institutional credit-read sequence the §5 stage 5 output models (standard institutional credit analysis + portable judgment — clean to encode, none of it VFI-proprietary):

1. **Year-end determination** — fiscal vs. calendar.
2. **Balance-sheet read** — current assets / AR / prepaids; PP&E; due-from-related-parties (a flag); finance vs. operating leases; current portion of long-term debt.
3. **Tangible net worth** — deduct goodwill/intangibles from equity → drives whether a personal guarantee is required or waived.
4. **Trend + cash flow** — revenue / gross-profit / net-income trend; add back D&A for a cash-flow view.
5. **Concentration** — client-concentration risk.
6. **Structure selection** — equipment loan vs. FMV lease vs. sale-leaseback vs. routing to ABL/cash-flow when fixed assets are thin.
7. **Rate** — reverse-engineer existing debt notes to infer other lenders' pricing, then negotiate against it.

Output = verdict + indicative structure + reasons. Keep it moldable — this is the layer the customer co-creates.

---

## 8. What to confirm — in order

1. **What's actually running on the desk surface today?** (L0–L3 status against this codebase.) Everything downstream depends on it. — Simon, now.
2. **Get the redacted file in hand and test it against the extraction field contract** before promising the 3-day packet turnaround. — Simon, the moment Katharine sends it (~Jun 25).
3. **Target the packet at Mike (credit/F2 lens)**, and pair the materials drop with a synthetic Empire-box sourcing artifact so Katharine's hot button isn't missing. — flag to Alek before he sends materials (Commitment #1, due Jun 20).

---

*Reference doc. Diff §5 (workflow) + §6 (gaps) against the codebase to confirm what's real before committing the packet turnaround.*
