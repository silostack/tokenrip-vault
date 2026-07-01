---
title: "Quintel — UX Framework (v1 + end-goal)"
status: draft
owner: Simon
type: ux-framework
product: Quintel
created: 2026-07-01
related:
  - product/quintel/quintel-customer-data-first-prd-2026-06-29.md
---

# Quintel — UX Framework (v1 + end-goal)

> **Purpose.** A framework for the Quintel interface — the customer's jobs, the interaction model, the information architecture, and the key screens — so design and build stay anchored to *what the originator is trying to do*, not a pile of features. Companion to the PRD (`quintel-customer-data-first-prd-2026-06-29.md`), which defines the capabilities; this defines how the customer touches them. Design the **end-goal** IA, ship a **walked-back v1** (§9).

---

## 1. Who we design for, and their jobs

The user is the **equipment-finance originator** (BD at a lender, or a broker) — see the PRD §2 for who they are (Mike, Katharine, Stauss). Their day is **prospect triage**: too many companies, no clear order, flying blind on what their credit team actually funds, and finding out about deals after they're contested.

Their jobs-to-be-done, in priority order — the UX must serve each:

| Job | The question in their head | Where it's served |
|---|---|---|
| **Triage** | "Who do I work today, in what order?" | Prospects (the ranked worklist) |
| **Understand** | "Why is this here / why does it rank this way?" | Item Detail (the reasoning) |
| **Act** | "Let me call / log / advance this." | Inline actions + Pipeline |
| **Tune** | "This isn't relevant — and here's why." | The friction ladder (§7) |
| **Track** | "What happened to the ones I worked?" | Pipeline (status + outcome) |
| **Know myself** | "What does my own book actually say?" | Profile (quantified self-knowledge) |
| **Explore** | "I've worked my list — what else is out there?" | News/Market (end-goal; §6) |

## 2. Core UX principles

1. **The "why" is everywhere — it is the signature of the product.** Every item, in every list, carries a one-line reason inline, expandable to the full reasoning. The value is *comprehension made visible*; if the "why" is ever missing or buried, we've shipped a list (or a newsletter). The demo's whole job is to prove "it understands my business," and the "why" is how that's seen (PRD §4).
2. **One atomic item card, reused everywhere** (Prospects, the what-changed digest, Pipeline, News). Build it once, well. §4 is its anatomy.
3. **Fit score + band + reason — framed as *fit*, never *close-probability*.** A relevance/fit score (0–100) drives the ranking, sort, and thresholds; a coarse band (High/Med/Low) is the at-a-glance bucket; the reason is the why. The score is *transparent and decomposes into the reasons* — it is not a black-box "chance this closes," which would re-open the batting-average trap.
4. **Reasons tie to *their* data and are clickable.** "Food-processing — 38% of your funded book ›" drills into those deals. The comprehension proof is the *connection* to their own book, so make it navigable.
5. **Intelligence, not news.** Market data reaches the customer as *targeted intelligence* — finite, high-relevance, woven into the workflow — never an endless scroll. Broad, exploratory news is a distinct, secondary surface (§6).
6. **Tune with a friction ladder, defaulting to near-zero.** One-tap actions everywhere; capture *why* cheaply when the user offers it; deep control available but never required (§7).
7. **Extensible nav.** The core triage product sits up top; every upsell (underwriting, placement, CRM sync, deeper market levels) slots in as a nav item without disturbing the core.
8. **The layout is dashboard-style; the home is a worklist, not a metrics dashboard.** Sidebar + content, yes — but the front door is an actionable call list with reasons, not KPI cards. Metrics live in Profile, where they're a feature, not the entryway.

## 3. Information architecture

```
QUINTEL  ▾ [customer account]
──────────────────────────────
☰  Prospects      ← the ranked universe + targeted intelligence woven in  (HOME)
◷  Pipeline       ← leads you're working, by status
◐  Profile        ← how Quintel reads your desk: quantified book + tunable fit model
──────────────────────────────
+  Import         ← bring in a list (CSV; CRM sync later)
──────────────────────────────  (secondary / end-goal / modules)
◇  News / Market  ← broad, exploratory, tailored market activity  (end-goal — §6)
⊞  Underwrite     ← packaging module (upsell)
⇄  Place          ← lender-matching module (broker upsell)
🔌 Integrations    ← CRM sync (v2)
```

**Core = Prospects · Pipeline · Profile.** Everything else is secondary (News), inbound (Import), or an upsell module. The originator lives in Prospects.

## 4. The atomic unit: the item card

Every surfaced thing (a company, a moved company, a net-new suggestion) renders as the same card:

```
●●●● High · 84    Acme Foods            food-proc · ~$8M · OH   ⚡moved
  ↳ Carlyle portfolio · resembles your Mar '26 deal · via OEM-X
  [Call]  [Watch]  [✕]  [Save]
```

Anatomy:
- **Band + fit score** (`●●●● High · 84`) — coarse bucket + precise sort key.
- **Identity + key facts** (name · sector · implied ticket · geo).
- **Freshness badge** (`⚡moved`) when a market event is why it's surfaced/elevated.
- **Inline "why"** (`↳ …`) — the top 1–2 reasons, in their own terms.
- **Quick actions** — Call/Log · Watch · ✕ (dismiss, opens the dimension chips, §7) · Save-to-list.

The card is dense but legible; the reasoning is always present; every action is one tap.

## 5. The key screens

### 5.1 Prospects — the ranked worklist (HOME)
The ranked universe, with targeted intelligence woven in (not a separate feed).

```
┌ Prospects ───────────────────────── [Import] [◐ Profile] ─┐
│ ⚡ WHAT CHANGED (since Mon) — 5 moved · 2 net-new fits  ▾ │  ← finite digest, collapsible
│ Filter: [All▾] [Sector▾] [Band▾] [Status: New▾]        🔍 │
├────────────────────────────────────────────────────────────┤
│ ●●●● High · 84  Acme Foods       food-proc · ~$8M · OH ⚡  │
│   ↳ Carlyle portfolio · resembles your Mar '26 deal        │
│   [Call] [Watch] [✕] [Save]                                │
│ ●●●○ High · 79  Beta Metalworks  metal-fab · ~$11M · TX ⚡ │
│   ↳ via OEM-X (your #2 channel) · in your $5–12M core      │
│   [Call] [Watch] [✕] [Save]                                │
│ ●●○○ Med · 58   Delta Cold Stg   refrig-tr · ~$9M · GA ★new│
│   ↳ not on your list — fits what you fund · via OEM-X      │
│   [Add] [Watch] [✕]                                        │
│ ●○○○ Low · 22   Gamma Mining     mining · ~$30M · NV       │
│   ↳ ⚠ in your box, but 0/20 closed in mining → low         │
│   [Call] [Watch] [✕] [Save]                                │
└────────────────────────────────────────────────────────────┘
```
- **"What changed" digest** at top = the targeted intelligence, *finite and actionable* (moved companies, net-new fits) — the antidote to an endless news scroll.
- **Net-new fits** (`★new`) appear inline as suggested additions with an [Add] action.
- **The negative** (Gamma) is shown *with its reason* — "in your box but you never close it" — the single clearest demonstration of "more than a buy box."

### 5.2 Item Detail — the comprehension surface (the demo wow)
```
┌ Acme Foods ──────────────────── [Call] [Watch] [✕] ─┐
│ Food processing · ~$8M · Columbus OH · Carlyle-backed │
│ Fit: ●●●● High · 84                                   │
├───────────────────────────────────────────────────────┤
│ WHY THIS IS HIGH FOR YOU                     [👍 / 👎] │  ← per-reason tuning (Tier 3)
│  + Sector: food-processing — 38% of funded book (14) ›│
│  + Sponsor: Carlyle — your #1 by closed deals (6) ›   │
│  + Ticket: ~$8M — in your $5–12M core band            │
│  + Channel: OEM-X — your #2 source, 61% close ›       │
│  − Check: 2 recent declines in specialized tooling    │
├───────────────────────────────────────────────────────┤
│ RESEMBLES YOUR DEALS                                  │
│  → Midwest Foods ($8.2M, EFA, Mar '26) ›              │
│  → Lakeside Provisions ($6.5M, FMV, Nov '25) ›        │
├───────────────────────────────────────────────────────┤
│ MARKET ACTIVITY (public record)                       │
│  ⚡ Air permit — MO DNR, 9d ago [source]               │
│  • Carlyle acquired Acme — press, 4mo ago [source]    │
├───────────────────────────────────────────────────────┤
│ YOUR ACTIVITY: none   [Log call] [Set status ▾]       │
└───────────────────────────────────────────────────────┘
```
Every reason ties to *their* deals/sponsors/channels with drill-downs; each reason is individually tunable (👍/👎). This one screen is "it gets my business."

### 5.3 Profile — quantified self-knowledge + the tunable fit model (v1)
Reframed from the discarded "claimed box vs. reality box" gotcha. It is *not* a correction; it is the customer's own business, **quantified and tunable** — useful whether or not their stated box matches their behavior.

```
┌ Profile — how Quintel reads your desk ──────────────────┐
│ YOUR BOOK AT A GLANCE                                   │
│  Funds: food-proc 38% · metal-fab 31% · refrig-tr 19%  │
│  Core ticket: $5–12M   ·   Top structures: EFA, SLB    │
│  Channels: OEM-X (61% close, 18) · OEM-Y (44%, 9) · …   │
│  Fastest close: sale-leaseback in food-proc (~22 days) │
├─────────────────────────────────────────────────────────┤
│ WHAT QUINTEL LOOKS FOR ON YOUR BEHALF   (adjust ▾)      │
│  Sector fit ●●●●○   Channel ●●●○○   Ticket ●●●●○         │
│  Sponsor ●●○○○   Geography ●●○○○                         │
│  ⓘ Tuning prompt: "mining" is in your stated box but    │
│     hasn't produced a deal — keep weighting it? [keep][drop]│
└─────────────────────────────────────────────────────────┘
```
- **Book at a glance** = quantified self-knowledge (channels, structures, close speed, concentration) — the "you've shown me my business" wow, non-judgmental, works with zero box gap.
- **What Quintel looks for** = the transparent, tunable fit model (the weights). This is the explicit end of the tuning ladder (§7).
- **Tuning prompts** = where a box/behavior mismatch surfaces — as a *question*, not a verdict.

### 5.4 Pipeline — the working leads (light in v1)
Leads the originator is actively working, grouped by status (New → Contacted → Qualified → Won/Lost). Setting a lead to Won/Lost captures a **reason** — the deepest personalization signal (the lock-in). v1 = manual status; CRM-stage sync replaces it in v2.

### 5.5 News / Market — the explore surface (end-goal; see §6)
Broad, tailored-but-lower-precision market activity for when the targeted well is dry. Streaming-oriented (this is the one place a scroll makes sense). **Not v1** — designed-for, walked back.

## 6. Market intelligence vs. news — the surfacing model

Two distinct things, divided by a **fit threshold**:

- **Targeted intelligence (high fit) → woven into Prospects.** Events on companies in their universe (⚡moved badges + the "what changed" digest) and high-fit net-new (`★new` suggested additions). Finite, actionable, no scroll. *This is the intelligence.*
- **Broad news (below the fit threshold) → the News/Market surface.** Tailored coarsely (their sectors/interests), exploratory — where they prospect *beyond* their universe when their targeted intelligence is exhausted. Streaming. *This is the news.*

The mental model: **intelligence comes to you (in your worklist); you go to the news (to explore).** Same underlying market-data pipeline (PRD §11 levels); different surfaces by relevance. v1 ships the targeted-woven-in layer only; the News-explore surface is end-goal.

## 7. The tunability model — a friction ladder

The balance: high tunability makes the engine much smarter, but nobody tunes if it costs 5 clicks + typing; a bare thumbs-down is frictionless but tells us nothing (*why* — segment? size? industry? geo?). The resolution is a ladder, defaulting to the cheapest rung, escalating only when the user offers more:

| Tier | Action | Friction | Signal captured |
|---|---|---|---|
| **1 — one-tap** | ✕ dismiss / Save-promote on any card | Near-zero (universal) | Direction only (relevant / not) |
| **2 — dimension chip** | On dismiss, one *optional* tap on a pre-computed chip: *why? [wrong industry] [too small] [wrong geo] [not this company] [bad timing]* — chips derived from the item's own attributes; skippable | One extra tap, no typing | The **dimension** that's off |
| **3 — reason tuning** | 👍/👎 a specific reason on Item Detail ("sponsor doesn't matter to me") | In-context, one tap | Attribute-level weight correction |
| **4 — explicit weights** | Adjust the fit-model sliders in Profile | High (deliberate) | Full model control |

**The default path is Tier 1 + optional Tier 2** — one tap to dismiss, one optional tap to say which dimension. That's the middle ground: low enough that people actually do it, rich enough that we learn *why*. Tiers 3–4 are there for the engaged user, never required. All four feed the same per-customer personalization model.

## 8. The demo flow — Mirror → Apply → Fresh

1. **Mirror (Profile):** *"Here's your business, quantified — your sectors, your channels, what closes fastest, and what we look for on your behalf."* Establishes "this is *for me*" before any ranking is shown. (Reframed — quantified self-knowledge, not a gotcha.)
2. **Apply (Prospects + Item Detail):** *"So here's your universe, ranked by that — and here's *why* each one sits where it does,"* opening a card to show the reasons tied to their own deals. The comprehension wow.
3. **Fresh (the "what changed" digest):** *"And here's what moved in your world since Monday,"* plus a net-new suggestion — the targeted intelligence, woven in.
4. **Live tune:** dismiss a wrong-industry item, tap the `[wrong industry]` chip, watch the list re-rank — proves it *learns*.

Foreground the reasoning at every step; the validation target is *comprehension* (checkable on sight), not accuracy (PRD §4).

## 9. v1 scope vs. end-goal (the walk-back)

**End-goal IA:** Prospects (rich targeted intelligence, L1–L3) · Pipeline · Profile (deep tuning) · News/Market (broad explore) · modules (Underwrite, Place, CRM sync).

**v1 (build this):**
- **Prospects** — ranked worklist + inline "why" + the "what changed" digest fed by **L1 curated / early-L2** market intelligence (PRD §11) + net-new suggestions.
- **Item Detail** — full reasoning tied to their deals + market activity + per-reason tuning.
- **Profile** — book-at-a-glance + the tunable fit model (the "it's for them" proof; smoke-and-mirrors-friendly for the demo).
- **Pipeline** — light, manual status + won/lost reason.
- **Tuning** — Tiers 1–2 (one-tap + dimension chip); Tier 3 if cheap; Tier 4 (Profile sliders) if time.
- **Item card** — the atomic unit, built well.

**Walked back out of v1 (designed-for, later):** the **News/Market explore surface**; the upsell **modules** (Underwrite, Place, Integrations) as nav; deep market levels (L3) in the digest; live CRM sync.

## 10. Open questions

- **Prospects density** — one long ranked list, or bucketed (New / Watchlist / Working)? Lean: one list + filters in v1, buckets if it gets noisy.
- **Score visibility** — always shown (`· 84`), or on hover/detail only? Lean: show it (it aids the sort mental model), reassess if it invites the wrong questions.
- **"What changed" cadence** — since-last-visit vs. a fixed window (this week)? Affects how "alive" it feels vs. how noisy.
- **Where net-new lives** — inline in Prospects (as now), or a distinct "Suggested" lane? Lean: inline with a `★new` tag until volume warrants a lane.
- **Profile as demo-opener vs. in-context** — open the demo on Profile (mirror-first), or surface it after Prospects? Lean: mirror-first, but test both.

---

*UX framework for Quintel v1. Companion to the customer-data-first PRD. Refine the screens toward higher-fidelity mockups once the framework settles.*
