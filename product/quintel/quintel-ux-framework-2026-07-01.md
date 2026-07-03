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

> **2026-07-01 (later) — absorbed Alek's live mockup.** Reviewed the three demo pages Alek built for the Bo Brauer (Hyland) and Zora Mehmi calls: `yourelosingmoney.xyz/quintel-hyland/{rank, timing, underwriting}` (+ a `/lead/…` detail with OVERVIEW / SIGNALS / SURFACED SIGNALS tabs). He independently re-derived our signature "why-everywhere" principle, and shipped **four devices better than this framework's prior draft**, now folded in: (1) the **dial-vs-switch disclaimer as on-screen copy** ("a prompt to reach out, not a prediction it'll fund"); (2) the **BLIND↔QUINTEL before/after** rerank proof; (3) the **`CALL FIRST` action-tier** (replacing our High/Med/Low band); (4) **augmentation framing as persistent UI copy** ("Quintel surfaces and scores; your team works the lead") — plus the **"scored against your N-deal book"** anti-commodity line. What stays ours: **Profile/mirror**, the **tuning friction ladder**, and the **negative/CHECKS reason** the mockup omits. Timing stays **woven-in** (§6), not a standalone tab. **The mockup is the canonical demo artifact** (§8) — the reusable "do you have an example?" answer both calls lacked.

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
2. **One atomic item, two renderings — a table row and a card** (§4). Shared fields, built once; a dense table for the main worklist, a card for the digest/detail/mobile. Reused across Prospects, the what-changed digest, Pipeline, News.
3. **Fit score + action-tier + reason — framed as *what to do*, never *close-probability*.** A transparent fit score (0–100) drives the ranking, sort, and thresholds; an **action-tier** (`Call First` / `Work` / `Skip`) is the at-a-glance instruction — it tells the rep what to *do*, not a relevance bucket and not a "chance this closes." *(Adopted from Alek's mockup, whose `CALL FIRST` tier reads better than our earlier High/Med/Low band and dodges the batting-average trap harder — an instruction can't be wrong the way a probability can.)* The score *decomposes into the reasons* — never a black box.
4. **Reasons tie to *their* data and are clickable.** "Food-processing — 38% of your funded book ›" drills into those deals. The comprehension proof is the *connection* to their own book, so make it navigable.
5. **Intelligence, not news.** Market data reaches the customer as *targeted intelligence* — finite, high-relevance, woven into the workflow — never an endless scroll. Broad, exploratory news is a distinct, secondary surface (§6).
6. **Tune with a friction ladder, defaulting to near-zero.** One-tap actions everywhere; capture *why* cheaply when the user offers it; deep control available but never required (§7).
7. **Extensible nav.** The core triage product sits up top; every upsell (underwriting, placement, CRM sync, deeper market levels) slots in as a nav item without disturbing the core.
8. **The layout is dashboard-style; the home is a worklist, not a metrics dashboard.** Sidebar + content, yes — but the front door is an actionable call list with reasons, not KPI cards. Metrics live in Profile, where they're a feature, not the entryway.
9. **State what it is — and isn't — on the surface.** The dial-vs-switch discipline is *product copy*, not just pitch. A surfaced public signal carries its own frame inline: *"a prompt to reach out, not a prediction that a deal will fund"*; net-new/public items say *"not in your CRM record."* *(From the mockup — and the fix for a live call where "are these vendors or actual live deals?" took three back-and-forths that on-screen copy would have pre-empted. Positioning carried by the product beats positioning the rep has to remember to say.)*
10. **Quintel surfaces; the team acts.** Augmentation, stated persistently in the UI: *"Quintel surfaces and scores — your team works the lead"* / *"Quintel prepares the package — your team approves and sends."* The standing answer to the "does it replace our CRM / our people?" fear, carried by the product rather than left to the rep. *(On the Bo call, "AI on top of your CRM, not a replacement" earned an instant "got it, great" — make the UI say it too.)*

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

## 4. The atomic unit: the item, in two renderings

The same item (a company, a moved company, a net-new suggestion) renders two ways — **a dense table row** in the main worklist, **a card** in the digest, detail header, and mobile. Build the shared fields once; the "why" is present in both.

**Table row — the main ranked worklist** (the originator scanning 1,000 leads, calling down the list):
```
#   COMPANY        ASSET/STATE    TICKET  CHANNEL   SCORE  TIER        SIGNAL (the why)
1   Acme Foods     food-proc·OH   ~$8M    OEM-X     ▮ 84   CALL FIRST  food-proc — your #1 funded sector (38%) ⚡
```
Alek's mockup uses exactly this — a table reads *more* like the tool an originator wants than a feed of cards, and it makes the "call down the list" mental model literal. The inline **Signal** column keeps the why-everywhere principle intact in table form.

**Card — digest / detail header / mobile:**
```
CALL FIRST · 84    Acme Foods            food-proc · ~$8M · OH   ⚡moved
  ↳ Carlyle portfolio · resembles your Mar '26 deal · via OEM-X
  [Call]  [Watch]  [✕]  [Save]
```

Anatomy (shared):
- **Action-tier + fit score** (`CALL FIRST · 84`) — the instruction + the precise sort key (§2.3).
- **Identity + key facts** (name · sector · implied ticket · geo).
- **Freshness badge** (`⚡moved`) when a market event is why it's surfaced/elevated.
- **Inline "why"** — the top 1–2 reasons, in their own terms (a Signal column in the table; the `↳` line on the card).
- **Quick actions** — Call/Log · Watch · ✕ (dismiss → dimension chips, §7) · Save. On the card these are always visible; in the table they're row hover-actions.

Dense but legible; the reasoning is always present; every action is one tap.

## 5. The key screens

### 5.1 Prospects — the ranked worklist (HOME)
The ranked universe, with targeted intelligence woven in (not a separate feed). Rendered as a dense table (§4).

```
┌ Prospects ───────────────────────────────────── [Import] [◐ Profile] ─┐
│ LEADS RANKED 1,000   CALL FIRST 498   PRIORITY 73   PIPELINE $607M     │ ← stat block
│ ⤴ In your export, Heartland sat at #997 → Quintel #103   [QUINTEL|BLIND]│ ← rerank proof
│ ⚡ WHAT CHANGED (since Mon) — 5 moved · 2 net-new fits              ▾ │ ← finite digest, collapsible
│ Filter: [All▾] [Sector▾] [Tier▾] [Status: New▾]                    🔍 │
├────────────────────────────────────────────────────────────────────────┤
│ #  COMPANY         ASSET/ST      TICKET  CHANNEL  SCORE TIER       WHY   │
│ 1  Acme Foods      food-proc·OH  ~$8M    OEM-X    ▮84  CALL FIRST food-proc — your #1 funded sector (38%) ⚡│
│ 2  Beta Metalworks metal-fab·TX  ~$11M   OEM-X    ▮79  CALL FIRST via OEM-X (your #2 channel) · in $5–12M core ⚡│
│ 3  Delta Cold Stg  refrig·GA     ~$9M    OEM-X    ▮58  WORK  ★new  not on your list — fits what you fund│
│ …  Gamma Mining    mining·NV     ~$30M   —        ▮22  SKIP        ⚠ in your box, but 0/20 closed in mining → low│
└────────────────────────────────────────────────────────────────────────┘
```
- **Stat block + before/after** (from Alek's mockup): the header quantifies the rerank, and the `[QUINTEL | BLIND]` toggle + a single moved lead ("#997 → #103") make the value legible *at the list level* — the complement to per-item reasoning, and the answer to "a reshuffled list has no wow."
- **"What changed" digest** = the targeted intelligence, *finite and actionable* (moved companies, net-new fits) — the antidote to an endless news scroll. **Kept woven in**, not a separate tab (§6).
- **Net-new fits** (`★new`) appear inline as suggested additions with an [Add] action.
- **The negative** (Gamma, `SKIP`) is shown *with its reason* — "in your box but you never close it" — the single clearest demonstration of "more than a buy box" (and the one thing Alek's mockup omits — his detail shows only strengths).

### 5.2 Item Detail — the comprehension surface (the demo wow)
```
┌ Acme Foods ──────────────────────── [Call] [Watch] [✕] ─┐
│ Food processing · ~$8M · Columbus OH · Carlyle-backed     │
│ CALL FIRST · 84   ↳ scored against your 220-deal book     │
├───────────────────────────────────────────────────────────┤
│ STRENGTHS                                       [👍 / 👎] │  ← per-reason tuning (Tier 3)
│  + Sector: food-processing — 38% of funded book (14) ›    │
│  + Sponsor: Carlyle — your #1 by closed deals (6) ›       │
│  + Ticket: ~$8M — in your $5–12M core band                │
│  + Channel: OEM-X — your #2 source, 61% close ›           │
│ CHECKS                                                    │
│  − 2 recent declines in specialized tooling ›             │
├───────────────────────────────────────────────────────────┤
│ RESEMBLES YOUR DEALS                                      │
│  → Midwest Foods ($8.2M, EFA, Mar '26) ›                  │
│  → Lakeside Provisions ($6.5M, FMV, Nov '25) ›            │
├───────────────────────────────────────────────────────────┤
│ MARKET ACTIVITY — public record, not in your CRM          │
│  ⚡ Air permit — MO DNR, 9d ago [source]                   │
│  • Carlyle acquired Acme — press, 4mo ago [source]        │
│  ⓘ A prompt to reach out — not a prediction it'll fund     │
├───────────────────────────────────────────────────────────┤
│ YOUR ACTIVITY: none   [Log call] [Set status ▾]           │
└───────────────────────────────────────────────────────────┘
```
- **"Scored against your 220-deal book"** (from the mockup) is the header proof — the anti-commodity, anti-6sense line: this ranking exists *because of your book*, the one thing a category-intent tool can't say. Answers Zora's implicit "isn't this just 6sense?" (6sense tells you who's searching the category; Quintel only surfaces what resembles a deal *you've funded*).
- **STRENGTHS + CHECKS** — reasons split into what lifts and what to watch. The **CHECKS/negative reason is kept** (Alek's mockup shows strengths only); the down-ranked "in your box but 0-for-20" case is our clearest "more than a buy box" proof and shouldn't be lost.
- **Market activity carries its own disclaimer** ("a prompt to reach out, not a prediction it'll fund" + "not in your CRM") — the dial-vs-switch frame as product copy (§2.9).
- Every reason ties to *their* deals/sponsors/channels with drill-downs; each is individually tunable (👍/👎). This one screen is "it gets my business."

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

**Divergence from Alek's mockup — resolved (2026-07-01).** The mockup makes market timing a *standalone* `TIMING` tab ("leads showing fresh activity"). We keep it **woven in** (decision confirmed): a separate destination competes with the worklist for daily attention, and the mockup's own timing view is literally *"leads from your ranked list with buying signals"* — a filtered slice of the same ranked universe, not a separate dataset. A **timing-only buyer** (e.g. Zora / Mehmi, who wanted *just* timing, not rank-and-underwrite) is served by making the "what changed" digest the *centerpiece* of a lighter Prospects tier — a packaging/pricing choice, not a second surface. One dial signal that buyer named — **loan-term expiry on their own book** (re-engage a customer whose term is ending) — is a clean *dial* (their-data) signal type worth cataloguing (defer detail to the PRD signal catalog).

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

**Pre-frame first (on screen, one line):** *"These are businesses that fit your book with public signals they may need financing soon — a smarter cold-call list, not confirmed live deals."* The disclaimer copy (§2.9) does this *in the UI*, so the frame lands before the confusion — the fix for the live call where "vendors or live deals?" took three exchanges to clear.

1. **Mirror (Profile) — optional opener:** *"Here's your business, quantified — your sectors, your channels, what closes fastest, and what we look for on your behalf."* Establishes "this is *for me*" before any ranking. Open here for a relationship-warm buyer; open on the before/after (step 2) for a show-me buyer.
2. **Apply (Prospects + Item Detail):** lead with the **before/after** — *"in your own export this lead sat at #997; Quintel puts it at #103"* + the `[QUINTEL | BLIND]` toggle (the list-level wow) — then open a row: *"and here's *why* it sits there,"* reasons tied to their own deals ("scored against your 220-deal book"). The comprehension wow, at both the list and the item level.
3. **Fresh (the "what changed" digest):** *"And here's what moved in your world since Monday,"* plus a net-new suggestion — the targeted intelligence, woven in.
4. **Live tune:** dismiss a wrong-industry item, tap the `[wrong industry]` chip, watch the list re-rank — proves it *learns* (the one beat Alek's read-only mockup can't show).

Foreground the reasoning at every step; the validation target is *comprehension* (checkable on sight), not accuracy (PRD §4).

**The canonical demo artifact.** Alek's live mockup — `yourelosingmoney.xyz/quintel-hyland/{rank, timing, underwriting}` (+ the `/lead/…` detail) — *is* the reusable demo both 2026-06-30 calls needed and lacked: "do you have a demo / an example / a case study?" was flagged as a nothing-to-show gap on **two consecutive firm-direct calls** (Zora, and Alex Khadempour before her). This framework is the north star for the *build*; the mockup is the artifact to put in front of prospects *now*, and the highest-leverage single thing for the ONE thing (get a sale). Keep the two aligned — the copy and devices in §§2–5 above are lifted from it.

## 9. v1 scope vs. end-goal (the walk-back)

**End-goal IA:** Prospects (rich targeted intelligence, L1–L3) · Pipeline · Profile (deep tuning) · News/Market (broad explore) · modules (Underwrite, Place, CRM sync).

**v1 (build this):**
- **Prospects** — ranked worklist + inline "why" + the "what changed" digest fed by **L1 curated / early-L2** market intelligence (PRD §11) + net-new suggestions.
- **Item Detail** — full reasoning tied to their deals + market activity + per-reason tuning.
- **Profile** — book-at-a-glance + the tunable fit model (the "it's for them" proof; smoke-and-mirrors-friendly for the demo).
- **Pipeline** — light, manual status + won/lost reason.
- **Tuning** — Tiers 1–2 (one-tap + dimension chip); Tier 3 if cheap; Tier 4 (Profile sliders) if time.
- **The item** — the atomic unit (table row + card), built well.

**Walked back out of v1 (designed-for, later):** the **News/Market explore surface**; the upsell **modules** (Underwrite, Place, Integrations) as nav; deep market levels (L3) in the digest; live CRM sync.

> **Note — the Underwrite (+ Placement) module already has a demo-grade surface** in Alek's mockup: a pipeline of deals-in-flight (stage-tracked Application → Documents → Credit → Committee → Decision), a document checklist (received/requested), a financial summary, a credit-memo draft, and decision actions ("Approve draft / Request documents / Send to committee"), under the *"Quintel prepares the package; your team approves and sends"* frame (§2.10). It stays an **upsell module**, not v1 core — Bo, a small sourcing-pain shop, was a Rank+Timing buyer and underwriting barely registered for him ("more so just getting more deals through the door") — but the artifact exists and can be shown to a packaging-pain buyer without new build.

## 10. Open questions

- **Prospects density** — one long ranked list, or bucketed (New / Watchlist / Working)? Lean: one list + filters in v1, buckets if it gets noisy.
- **Score visibility** — always shown (`· 84`), or on hover/detail only? Lean: show it (it aids the sort mental model), reassess if it invites the wrong questions.
- **"What changed" cadence** — since-last-visit vs. a fixed window (this week)? Affects how "alive" it feels vs. how noisy.
- **Where net-new lives** — inline in Prospects (as now), or a distinct "Suggested" lane? Lean: inline with a `★new` tag until volume warrants a lane.
- **Profile as demo-opener vs. in-context** — open the demo on Profile (mirror-first), or surface it after Prospects? Lean: mirror-first, but test both.

---

*UX framework for Quintel v1. Companion to the customer-data-first PRD. Refine the screens toward higher-fidelity mockups once the framework settles.*
