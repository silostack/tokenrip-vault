---
title: "Quintel v1 — Customer-Data-First Intelligence Engine (PRD)"
status: draft
owner: Simon
type: product-requirements
product: Quintel
created: 2026-06-29
audience: Engineering (self-contained handoff)
---

# Quintel v1 — Customer-Data-First Intelligence Engine (PRD)

> **This document is self-contained.** It carries the customer context, the business reasoning, and the build spec in one place so the engineering team can build from the customer's point of view — understanding *what we solve and how we create value*, not just a feature list. Read Part I (the why) before Part III (the how); the architecture choices only make sense against the value they deliver.

---

# PART I — THE PROBLEM AND THE VALUE

## 1. One-page summary

Quintel is an intelligence engine for **equipment-finance originators** — the people at lenders and brokers whose job is to find financeable deals. Their daily work is **prospect triage**: deciding which companies to call out of a large list, then calling down that list. Most of that effort is wasted on companies that will never fund, and they find out about real deals only after those deals are already contested.

The core product is a **personalized, interactive market-intelligence feed for the originator**: a single ranked stream of the things that matter to them — companies from their own prospect universe, market events, and the occasional real deal signal — each item shown *with the reason it's relevant to them* (it resembles a deal they funded, it's in a sponsor they track, it's in their sweet-spot ticket band, it just moved in the public record). It is **not a signal feed** (real signals are rare; this is dense) and **not a reshuffled list** (the value the customer *sees* is the per-item reasoning, not the order). Think a Bloomberg terminal for equipment finance, tuned to one desk.

The intelligence is built **customer-data-first**: relevance and ranking are driven by *what the customer's business actually funds*, learned from their own deal history. But it **degrades gracefully** — even with only coarse context (their box, the sponsors and companies they watch, their industry focus, gathered in a conversation), the feed is already valuable; deal history *deepens* the relevance, it isn't a prerequisite. Public market data is woven in **from v1** (it's what makes the feed feel alive) but always as *tailored intelligence* — every market item annotated with why it matters to this customer — never as a raw, commodity feed.

The first demo's job is to make one thing undeniable: **the system understands this customer's business.** Not "the ranking is correct" (unprovable in a demo) and not "this deal will close" (unprovable ever), but — on a single item — *"here's why this matters to you,"* tied to their real deals and live market data, which the customer can validate on sight. **Comprehension, made visible, is the wow.**

## 2. The customer and their world

Equipment finance funds the machines businesses run on — trucks and trailers, manufacturing lines, HVAC, construction equipment, food-processing plants, medical and IT hardware. Deals run from ~$1M to $100M+. It is an old, relationship-driven, under-tooled industry; the people in it largely run on spreadsheets, email, generic CRMs, and personal judgment.

There are two kinds of customer, and **the same product serves both, pointed at a different list:**

- **Direct lenders** put their own balance sheet into deals. A *credit team* decides what funds; *originators* (BD) hunt for the deals to bring them.
- **Brokers / placement firms** find borrowers and match them to lenders. They have the relationships; their pain is screening junk and routing each deal to the lender most likely to fund it.

In both, the person we build for is the **originator** — and the defining fact about them is that **they are not the credit team.** They hunt off a coarse, *stated* "buy box" (e.g., "manufacturing, $3–50M, US"), while the rich, *tacit* model of what actually funds — which sectors really get approved, how flexible the box edges are, which geographies are hot, which equipment ages get rejected, which referral channels actually close — lives with credit, and the originator only learns it *after* burning effort and submitting a deal. **This information gap, inside the customer's own firm, is the problem we solve.**

Three real people make this concrete (these are live prospects; build for them):

- **Mike (36th Street).** Wide box ($1–100M, industry-agnostic), BD-only — credit is decided by a BlackRock investment committee, not him. He put his box parameters into **Apollo, got back ~3,500 leads, and is literally calling every one, down the list.** His first hundred calls are effectively random. He is skeptical (asked "what's your hit rate?" three times) and reports to an AI-skeptical board.
- **Katharine (Empire Asset Finance).** VP Direct Originations at a *new* balance-sheet lender (launched Sept 2025, $100M commitment, thin deal history so far). She tracks ~2,000 companies in HubSpot and triages them by hand — "going through our prospect list, narrowing out who's a number one, number two, don't bother talking to them." Her tools are Google Alerts (headline news only), ZoomInfo (*"doesn't really do a ton more than a big public press release my Google alert could tell me"*), a personal ChatGPT she built for one-at-a-time screening, and Excel. No unified system. She framed the product for us: **"I don't need a new HubSpot. I need this."** She wants an intelligence layer *over* her CRM: scrub her tier-1s for signals, add net-new similar companies, two-way sync — *not* a CRM replacement.
- **Stauss (VFI).** EVP at a balance-sheet lender who also runs his own placement network. ~90% of his deals arrive by email referral; he has deep OEM and referral relationships, an established multi-year deal history (so his revealed-preference model is rich day one), and acute pain in *packaging* (assembling credit memos). He is also the channel into the wider EF cluster.

What they all share: a daily triage problem, generic tools that only surface headline news, no proactive intelligence, and a large gap between the coarse box they hunt with and what their business actually funds.

## 3. The core insight: why customer-data-first

Two framings of "what Quintel does" were in tension, and resolving it is the foundation of this product.

**The trap — selling public data ("we surface deals from the market").** Raw public data is a commodity: Apollo, ZoomInfo, and the trade newsletters all sell it; it's the same data for everyone. Selling it invites every losing objection — *"are we all chasing the same intel?"*, *"are you giving my deal to a competitor?"*, *"what's your batting average?"* — and it rests on the single least-certain question in the whole product: *does the public signal even exist for a given deal?* (A multi-year backtest over EF public records surfaced only a handful of clean cold leads — real, but sparse. You cannot infer a deal from data that isn't there.)

**The escape — the customer's own data is the foundation.** A product keyed on the customer's *own* deal history is, by construction, not a commodity (the output differs per customer), and its value is *certain*: the question is only *how much* lift, never *whether* it works, because the data is all there. Two precise framings:

- **Dial vs. switch.** Intelligence on the customer's own data is a **dial** — risk = magnitude of lift, floor is positive, definitely buildable. Cold-surfacing net-new deals from public data alone is a **switch** — risk = whether the signal exists at all, outside our control, sparse. *You anchor the product, the demo, and the pilot on the dial; the switch is upside.*
- **Deal history = the credit team's judgment, moved to the front of the funnel.** This is the answer to "deal history can't predict a cold company": correct — but we are not predicting cold fundability (which needs post-submission financials). We are taking what the customer's credit team has *already decided*, encoded in deal history, and ranking the originator's existing list by it — closing the internal information gap. Mike's 3,500 are not cold; they are his list. He just doesn't know which to call, because he's not credit.

**Two kinds of "deal data" (a common confusion to settle for engineering):**
- **Deal *files*** — the financials, collateral, DSCR inside a credit file. These explain *fund vs. no-fund* but only exist *after* a borrower submits documents. Useless for ranking a prospect. (This is what people mean when they say "deal data can't help sourcing" — true of files.)
- **Deal *history / metadata*** — what sector, what ticket, what structure, who referred it, which lender funded it, won/lost and why. All **cold-observable** on any prospect, and this is the entire sourcing dial.

The history doesn't give us new facts about a cold prospect; it tells us **how to weight the facts we already see.** The buy box is what the customer *says* (manufacturing, $3–50M). The deal history is what they *actually do* (last 50 deals are 90% food-processing and metal-fab, zero mining despite it being "in-box," 60% via two OEMs). Same public attributes — the box weights them flat (in/out), the history gives the *real* weights. **We are not predicting the cold deal; we are aiming the search.**

## 4. How we create value (and why ranking is the heart of it)

**Ranking is the engine, and it's worth more than filtering.** The originator works a list top-to-bottom and never reaches the end, so the *order* is everything — ranking turns N random attempts into the N best. Ranking also *contains* the negative signal: the top is "call these," the bottom is "don't bother," in one operation — and it's the *safe* form of suppression, because a mis-ranked good lead just sits lower; it's never silently deleted (a silent false-negative would kill a real $1–100M deal and never surface). Hit rate has two levers and ranking pulls both: surface the good ones (top) *and* stop wasting attempts on the dead-pattern ones (bottom).

**But ranking alone has no demo, so the customer experiences the *understanding* behind it.** A reordered list is invisible — hand a customer their list reshuffled and they shrug; the value is statistical (better hit rate over many calls) and can't be seen in a moment. So what the customer *sees* is not the order but the **reason for each item**: *"this is high for you because it's in Carlyle's portfolio (your top sponsor), $12M (your sweet spot), food-processing (38% of your funded book), and it just filed an air permit."* That reasoning is instantly checkable (those *are* the things they care about, connected correctly), it shifts the validation target from accuracy (unprovable) to comprehension (obvious on sight), and it doubles as the auditability a skeptical credit committee needs. **The ranking is the engine; the per-item reasoning is the product the customer experiences.**

**The value ladder** (each rung needs nothing above it):

1. **Box → the raw list.** What the customer already does with Apollo/ZoomInfo/their CRM. Commodity. Not us.
2. **Deal history → rank, trim, and explain the list** by what actually funds. **This is the v1 baseline, valuable with zero market data.** It includes: the ranked universe, the down-ranked tail, dead-lead resurfacing, the channel map (which OEMs/partners actually close), and the **box-reality gap** ("you say mining; you've closed zero").
3. **Market intelligence → makes it live and extends it (in v1).** A dense, *tailored* stream of market activity in their world — each item annotated with why it's relevant — that keeps the feed alive day to day, flags which tracked companies just moved (a permit, an award, a lien maturity, a sponsor move), and surfaces net-new ones that fit what they fund. Delivered as *tailored intelligence* (annotated, ranked, interactive), never a raw commodity feed. Its breadth grows in levels (§11).

**The ladder degrades gracefully on deal-data depth — which de-risks the whole sell.** Rung 2's value does not require rich deal history: with only coarse context (their box, the sponsors and companies they watch, their industry focus — gathered in a conversation), the feed is already tailored and valuable. Deal history *deepens* the relevance (revealed-preference ranking, deal-resemblance reasons, channel intelligence); it is the upgrade path, not the entry toll. This matters because getting deal data can be slow or blocked (a new lender like Empire has little; some credit teams won't share it) — and the product must land valuable *before* that arrives. The floor is a coarse-tailored feed; deal data cranks it up.

**Why the customer pays, and what the setup fee buys.** Ingesting their deal history is one event that does five jobs at once: it (1) builds the custom pipeline that **justifies the $10k setup fee**, (2) earns the **"built for you / it's AI, not a newsletter"** claim — without their data, we *are* a high-priced newsletter; with it, we're an engine trained on their book, (3) is the moment the value becomes real (their data is in it), (4) starts our **data moat**, and (5) is a *standing* pipeline that keeps ingesting future deals, which is why the monthly subscription recurs and the lock-in compounds (six months in, it knows their book better than any new tool could, and leaving means it forgets everything).

---

# PART II — THE PRODUCT (from the customer's point of view)

## 5. The product is one object: a tailored relevance-stream

The mental model engineering should hold: **the customer opens Quintel and sees a single ranked stream of everything relevant to them right now, each item carrying the reason it's there — and they act on it and tune it.** The items are three kinds, in one stream: **companies** from their own universe (ranked by what-funds), **market events** (a filing, an award, a sponsor move, trade-press news — annotated with relevance), and the occasional real **signal** (a converged, multi-source deal inference — rare, premium, top-of-stream).

It is **not a signal feed** — real signals are rare, so a pure signal feed is empty and disappointing; this is *dense*, because market activity in their world is abundant and the value is the *tailoring*, not rare predictions. It is **not a reshuffled list** — the value the customer perceives is the per-item *why*, not the order. It is **not a CRM** — it sits beside the CRM and makes it smarter. The closest reference is a **personalized algorithmic feed** (think Twitter's ranking) over equipment-finance market intelligence: every item scored for this customer, annotated, and interactive. It answers the originator's real daily question — *what should I be paying attention to, and why?*

## 6. The v1 surfaces (with the customer flows)

1. **The Stream (home).** The single ranked relevance-stream (§5): companies + market events + signals, each row showing the item, its band/score, and the top **reasons it's relevant to this customer** (deal-resemblance, sponsor/watchlist match, ticket-band fit, "just moved" event). Filter by item type, sector, channel, band, status. This is the home; the originator lives here.
2. **Item Detail.** The full *why*, tied to the customer's own data and the market: *"Resembles your Acme deal funded in March (food-processing, $8M, EFA, via OEM-X)," "In Carlyle's portfolio — your #1 sponsor by closed deals," "Just filed an air permit (MO DNR, 9 days ago)," "⚠ borderline: 2 recent declines in specialized tooling."* The reasoning *is* the surface. Plus channel/relationship context and the provenance of every market item (source + date).
3. **Interaction controls (core to v1 — engagement *and* the learning loop).** On any item: **relevance feedback** (relevant / not, with a reason — wrong industry, not interested in this entity, wrong size), **watch this entity** (track it for future events), **save to my list with enrichment** (pull it into the worked universe), and **log activity / set status**. Every interaction tunes the customer's own relevance model *immediately* — so the feed sharpens with use, and for a thin-deal-data customer these interactions are the *primary* personalization signal (not just slow won/lost outcomes). This is the flywheel: more interaction → better feed → more interaction.
4. **Import / Re-rank.** Drop in a lead list (an Apollo CSV) → resolved to entities → scored against their relevance model → folded into the Stream, ranked. Recurring. (The "rank my list" capability, now living inside the Stream rather than as a static list.)
5. **Deal ↔ Lead lifecycle (light, manual in v1).** A worked lead carries a status to won/lost **with a reason**; that outcome re-fits the model (the deepest personalization signal — the lock-in). v1 = light manual capture in the UI (no CRM sync); a CRM-stage sync replaces the manual step in v2.

**The feed-item data model** (every item, any type): a **shared entity or event** (public, generalizable metadata — entity, sector/NAICS, implied deal size, structure type, event type/date) **+ a per-customer relevance annotation** (band/score, the ranked reasons, watchlist/sponsor/deal-resemblance flags). This maps exactly onto the architecture (§8): the shared part is public evidence on a shared entity; the annotation is the per-customer score + reasons. **No new engine — the Stream is the *render* of per-customer-scored entities.**

**Mike's flow:** imports his Apollo 3,500 → they fold into a Stream ranked with reasons, dead-pattern names sunk → opens daily to "these tracked companies just moved" + "net-new that fits what you fund" + the ranked universe → thumbs-down the wrong-industry ones (which sharpens it) → works top-down, logging outcomes.
**Katharine's flow:** her ~2,000 (synthetic CSV for the demo; HubSpot sync in v2) fold into the Stream → ranked, enriched, annotated, with market events on her tier-1s → exactly the living "intelligence layer over HubSpot" she described — and valuable even though Empire's deal history is thin, because coarse context + interaction carry it.

## 7. The setup experience (how the customer experiences ingestion)

The customer hands over their deal history — at minimum a set of **funded credit memos** (the clean, structured "package" every shop produces), ideally plus an export of their CRM/pipeline and a note on their referral/OEM channels. Quintel ingests, cleans, and structures it into their private model (§9). From their side, the experience is: *"I gave you my deals; now the system understands how I actually do business, and everything it shows me is ranked by that."* This is the moment the product stops being generic and becomes theirs — and it is what the setup fee is for.

---

# PART III — HOW IT WORKS (architecture, with the reasoning)

## 8. The architecture rule: share the evidence, privatize the score

The central design decision, and the reasoning behind it, because every other choice follows from it.

A naïve design computes one "objective" score per company and filters it per customer. That is backwards. A *score* — "how much should *this customer* care about *this company* right now?" — is **inherently per-customer**; there is no observer-independent relevance. So:

- **The shared layer is the evidence**, not the score: a single world-graph of **entities** (real companies — one Revere Plastics for everyone) and **public evidence** (a permit, a UCC lien, an 8-K — facts anyone can observe). Objective; one copy.
- **The per-customer layer is a private overlay**: their **private evidence** (their deal history, pipeline, relationships, the Quintel Book of §9), their stated box, and their learned personalization.
- **Every piece of evidence and every edge is owner-tagged** (`public` or `principal:P`). This single tag is the entire boundary primitive.
- **The score is always a per-customer read** over the evidence that customer is allowed to see:

  `score(company, customerP, t) = f( evidence where owner ∈ {public, P}, edges where owner ∈ {public, P}, P.box, base_model ⊕ P.personalization, t )`

Three consequences, all from that one tag:

- **Leak-safety is structural, not policy.** The scoring query's *input set is defined by* `owner ∈ {public, P}`. Customer A's private deal data cannot influence or be inferred from customer B's score, because it is never in B's input set. This is the hard requirement — a customer fears exactly "you'll use my data to help a competitor" — and it is guaranteed by construction, not by access-control discipline.
- **Market data layers on for free.** The dial baseline's evidence set is the customer's private evidence only. Adding market data = appending `owner=public` evidence to the same ledger the same score already reads. Nothing in the scoring or the UI changes; the evidence set just grows. **This is why v1.0 (customer-data-only) and v1.1 (market crank) are one engine, not two products.**
- **Bidirectionality is emergent.** "The customer's data sharpens the market read" (e.g., they tell us they're working a Tesla supplier, which corroborates a weak public signal and lifts that company in *their* ranking) is just corroboration over their visible evidence set. Nothing extra is built.

**Private entities — v1 uses "minimal graduation."** Almost every company a customer references is *publicly establishable* (has a domain, filings, a real footprint — Mike's list, Katharine's 2,000); these resolve to **shared** entities, with the customer's interest attached as private evidence/edges. A company known *only* from the customer's data (a tiny private borrower with no public footprint) is stored as a **private entity in that one customer's overlay**, siloed, with **no automatic graduation** to the shared graph (a human links it if public evidence ever surfaces it — rare). This is trivially leak-safe (a private entity lives in exactly one overlay) and adds no cross-boundary resolution work. **Full auto-graduation** — a private-only pipeline company auto-merging to a shared entity when public evidence appears, without leaking that the customer knew first — is **v2**, and only earns its complexity when "watch my private pipeline for public events" becomes a feature worth building.

**Two learning loops:**
- **Private personalization (v1) — the lock-in.** The customer's own outcomes (won/lost + reason) re-fit *their own* model. Stays in their overlay; never leaks.
- **Shared calibration (deferred) — the network effect.** Aggregate, anonymized outcomes across customers improve the *base model weights*. This crosses (anonymized) and is leak-risky at low customer counts (membership inference), so it is **deferred until scale**. The v1 moat does not depend on it.

**The moat, stated honestly:** it is the **learned scoring function plus the public-research entity-resolution/inference IP** — *not* pooled private deal data, which by design never crosses (which is exactly what makes customers willing to give it). The public graph compounds; private data stays siloed.

## 9. Ingestion — the setup-fee engine (base layer + thin per-customer extension)

**The scalability design (resolves "is the bespoke setup work actually scalable?").** Ingestion is a **shared base layer** plus a **thin per-customer extension layer**:

- **The base layer (built once, reused for every customer).** A standard credit-memo extractor and the standard **Quintel Book** schema (below) with a fixed set of **standard fields.** This generalizes because funded credit memos, across customers, carry largely the same information — borrower, financial summary, collateral, structure, terms, dates. Most of any memo maps to the standard fields with no custom work.
- **The extensibility mechanism.** Every record carries an **`extensions` map** (structured key-value / JSONB) for customer-specific fields that don't fit the standard schema — a customer's bespoke risk tags, internal scoring, custom deal attributes. The ranker consumes standard fields always and extension fields opportunistically (weighted in if present, ignored if absent).
- **The thin per-customer extension layer (built during setup — the bespoke part, deliberately small).** A small adapter that (a) maps the customer's specific memo/CRM format and field names onto the standard schema, and (b) routes their custom fields into the `extensions` map. Because the base layer does the heavy lifting (standard extraction, schema, ranking), this per-customer layer is *thin* → **scalable, and comfortably covered by the setup fee.** Early customers carry slightly more bespoke mapping; the base extractor improves with each one, so the per-customer cost falls over time.

**The canonical Quintel Book (the per-customer private overlay — also the synthetic-demo schema).** Four record types; both the credit-memo extractor and the future CRM sync normalize into this:

| Record | Standard fields | + extensibility | Source |
|---|---|---|---|
| **Lead/Company** | entity ref (→shared entity), source, status (lead→contacted→qualified→won/lost/dead), stage, last-activity, notes (free text), tags | `extensions{}` | CRM/import (synthetic for demo) |
| **Deal** *(the revealed-preference unit)* | borrower(→entity), sector/NAICS, asset/equipment type, ticket, structure (EFA / $1-buyout / FMV lease / TRAC / sale-leaseback / loan), term, rate, collateral, borrower profile (revenue band, EBITDA band, sponsor type), geography, **source/channel**, **outcome** (funded / declined / lost), **reason** (if not funded), open/close dates | `extensions{}` | Funded → credit memos; declined/lost → CRM/notes |
| **Channel/Relationship** | id, type (OEM / dealer / referral partner / lender), attached deals, realized outcomes (close rate, fee) | `extensions{}` | Derived from Deals + CRM |
| **Box** | the *stated* buy box (declared criteria) — kept **separate** from *revealed* preference, which is computed from Deals | — | Customer-declared |

**The ingestion ladder** (what to build first and why):
1. **Funded credit memos — the spine** (the base layer's job). Clean, structured, uniform across customers; yields funded-Deal records (the positive examples of "what funds"). This is the part that generalizes and therefore scales.
2. **Declines / lost deals — the boundary.** From CRM/notes; messier, but where the *negative* boundary lives ("passed because the equipment was >10 years old"). The richer training signal; harder to extract → mostly the bespoke/extension layer early, and in v1 the *reason* may be captured manually (which also feeds §6.5).
3. **The CRM universe — the list.** Tracked companies/stages/notes → Lead/Company records. **v1 uses synthetic CSV import; live CRM sync is v2** (§13).
4. **Channels — the private edges.** Who refers, who funds.

**Deal data is mixed into CRM data, and the architecture is fine with that.** In EF there is no clean deal-vs-CRM boundary (lost-deal reasons live in CRM notes). The ledger doesn't need one — it is all private evidence on entities, owner=P; only the *extractor* differs (memo extractor vs. CRM/notes extractor). The credit memo is simply the cleanest extractor to build first. **We define the CRM/notes data shape now (the Lead/Company record above) even though we don't sync live yet — so the architecture is ready for v2 and so we can hand-author synthetic CRM/notes for the demo.**

## 10. The ranker (revealed preference) — how scoring works

The v1 ranker is **transparent and explainable by design** — not a black box. Explainability is a feature: it makes the output *moldable* (the customer can adjust weights and feel ownership), it satisfies the decision-support / auditability positioning (every rank decomposes into stated reasons), and it is honest about a thin-history customer. The path to ML is open later (when data volume and the shared calibration loop justify it), but v1 does not need it.

The mechanism:
1. **Build the revealed-preference profile** from the Book's *funded* Deals: per-feature frequency distributions (sector, ticket band, structure, geography, sponsor type, asset type, channel). This is "what they actually do."
2. **Build the boundary profile** from *declined/lost* Deals: features over-represented in declines become penalties ("specialized tooling," "equipment age," "out-of-footprint geo").
3. **Score each candidate company** (from its observable attributes): `score = Σ match-weights to the funded profile − Σ penalty-weights to the boundary profile`, normalized to a 0–100 band.
4. **Decompose every score into reasons** ("sector: food-processing = 38% of your funded book; channel: OEM-X = your #2 source; ticket $8M in your core $5–12M band; ⚠ asset borderline — 2 recent declines in specialized tooling").
5. **Blend with a base prior for thin-history customers** (see §17): when the Book is small, weight the calibrated base model more and the customer's revealed weights less, shifting toward the customer's weights as volume accrues. This prevents an over-fit ranker for a new lender like Empire.
6. **Moldable weights:** the feature weights are visible and adjustable by the customer.

The ranker reads **standard Deal fields** always and **`extensions`** opportunistically. It is the same function whether the candidate's evidence set is customer-private only (the dial baseline) or includes public market signals (L1+ market intelligence) — market signals are simply additional features/evidence on the company. And it **degrades gracefully**: with a thin Book (little deal history), the funded/boundary profiles are weak, so the ranker leans on the base prior + the customer's coarse context (box, watchlist, sponsors) — still producing a tailored, useful relevance score, just less deeply personalized until deal data accrues.

## 11. Market intelligence — the four breadth levels

Market data enters as `owner=public` evidence on the same per-customer score (§8), surfaced as annotated items in the Stream. It is delivered as **tailored intelligence** (dense, ranked, annotated, interactive) — explicitly *not* a sparse "signals" feed and *not* a raw commodity feed. Breadth grows in four levels:

| Level | What feeds it | Effort | Density | Role |
|---|---|---|---|---|
| **L1 — Structured public records** | EDGAR 8-K material agreements + USAspending awards. Entity-keyed, structured, credible. **Live today.** | ~none (exists) | Moderate | Credible freshness on the customer's universe |
| **L2 — News & trade press** | EF trade press (Monitor, ABL Advisor, EF News, ELFA) + filtered business news, run through extract-metadata + score-relevance. | Medium — **new build:** the unstructured-text→Observation seam + a narrative-event taxonomy (was "not modeled at all") | **High** | **The "alive" layer** — daily density that makes the feed a habit |
| **L3 — Hidden-portal records** | UCC liens/maturities, permits, ISO/utility interconnection queues, state incentive dockets. Financeable detail ($, collateral, competing lender) + earliest tell. | High (per-portal scrapers + paid UCC — the backtest P0/P1 source-buy) | Low (sparse) | The *financeable depth / timing premium* — and the moat (portal-navigation) |
| **L4 — Inference / cascade** | 3rd-order multi-signal inferences (customer→supplier, sponsor→portfolio, queue-name→parent). | Highest (the cascade/gap-reasoning IP) | Rare | The premium, rare "real signals" — the cold-sourcing upside |

**Day-1 read (the build sequence):**
- **Demo:** L1 + **curated** events (from the two live sources + the backtest research). No new ingestion — curate enough for a dense-feeling synthetic account.
- **v1 ship:** **L1 live, with L2 as the immediate, highest-priority pull-forward.** The customer's static universe gives bulk density; L1 adds credible freshness; **L2 (news) is what makes the feed feel alive daily, and the whole product rests on that.** So L2 is in v1 scope, sequenced right after L1 — not deferred. The non-negotiable guard: pair L2's commodity content with *deep, visible* per-customer relevance annotation, or it collapses into the high-priced newsletter it's beating.
- **Roadmap:** **L3 → L4.** They add *value per item* (financeable detail, rare signals) but not *density*, and they're high-effort — so they are the differentiation / timing / cold-sourcing-upside layers, pulled in as the relationship deepens. (These are the sources the prior build prioritized for *cold sourcing*; here they are reframed as market-data *depth*, behind density.)

**The principle:** the day-1 feed's job is to feel **alive and tailored** (density + annotation = L1+L2), not to surface rare financeable deals (depth = L3/L4). L1 ships, L2 is the cheapest path to "alive," L3/L4 are the expensive differentiation.

**Cold net-new sourcing (L4) stays upside** — never the promise, the pilot metric, or a live demo (sparse, uncontrolled; a live miss in front of a prospect proves the opposite of the point). It is proven retrospectively by the backtest (a mechanism demonstration: "this deal closed in March; the signal chain was public in January; your tools didn't assemble it") and forward by the refundable pilot.

## 12. Learning loops and the moat (summary)

- **Private personalization (v1):** every worked lead's outcome (won/lost + reason) re-fits the customer's own revealed-preference profile and boundary profile. The lock-in. v1 fuel = the light manual outcome capture (§6.5).
- **Shared calibration (deferred):** aggregate anonymized outcomes → base model weights. Scale- and privacy-gated; not a v1 dependency.
- **Moat:** the learned function + the public-research resolution/inference IP. Pooled private data never crosses.

---

# PART IV — BUILD

## 13. Scope

**v1 — the tailored relevance-stream.** Owner-tagged evidence + per-customer scoring; the Quintel Book + the credit-memo extractor (base layer + thin extension) + the standard schema with `extensions`; the explainable, base-prior-blended relevance/ranking model; **market intelligence at L1 (live) with L2 (news) as the immediate priority** (§11); the Stream + Item Detail + interaction controls + CSV import + light manual outcome capture (§6). Degrades gracefully on deal-data depth (coarse context → rich deal history). No live CRM sync.

**Build sequence inside v1:** (1) per-customer scoring + the Book + the ranker + the Stream on customer data alone (the dial — demonstrable on a seeded account); (2) L1 market intelligence live in the Stream; (3) L2 news ingestion for daily density. The demo can run before (2)/(3) on curated events.

**v2 (initial thoughts only — §15):** live two-way CRM sync (the full "intelligence layer over the CRM"); L3 hidden-portal records; private-entity auto-graduation; the shared calibration loop.

**Roadmap beyond v2:** L4 inference/cascade (cold-sourcing upside); the autonomous monitoring loop at scale.

**Explicitly out of v1 (architected-for, not built):** live CRM sync; L3/L4 market depth; cold net-new sourcing as a *promised/measured* capability; the autonomous production-monitoring loop; private-entity auto-graduation; the shared cross-customer calibration loop.

## 14. The synthetic Quintel Book + ranker — a starting-point spec

This is a **starting point for the engineering team, not an exhaustive scope.** It gives a concrete, buildable target for the demo and the first tests; refine as you build.

**Synthetic customer — "Cornerstone Equipment Finance"** (fictional; an *established* mid-ticket lender so the ranker has real signal — unlike a brand-new shop):
- **Box (stated):** tickets $2–25M; sectors [manufacturing, food & beverage, transportation, industrial]; structures [EFA, FMV lease, $1-buyout, sale-leaseback]; geography [continental US]; borrower profile [>$20M revenue, >$2M EBITDA].
- **~40 funded Deals**, deliberately distributed so **revealed preference diverges from the stated box** (this is what makes the demo land): ~90% concentrated in food-processing + metal-fabrication + refrigerated transport; *zero* in some "in-box" sectors; ticket concentration $5–12M (not the full $2–25M); ~60% sourced via two OEM channels. Each Deal carries the full standard-field set.
- **~20 declined/lost Deals with reasons**: e.g., "equipment >10 years old," "borrower EBITDA below floor," "out-of-footprint geography," "asset too specialized / poor secondary market," "sponsor not creditworthy."
- **~300 Lead/Company records** (the universe to rank): a deliberate mix — some strongly matching the revealed pattern, some matching the *stated box but not the revealed pattern* (these should rank low and demonstrate "more than a box"), some weak/out.
- **Channels:** two strong OEMs and a few referral partners, with realized close rates.
- A handful of records carrying `extensions` data, to exercise the extensibility path.

**Ranker v1 (the starting algorithm):**
- Compute funded-profile and boundary-profile distributions per feature from the Book (§10).
- Score each of the ~300 companies; normalize to 0–100; band them; decompose into reasons.
- Blend with a base prior weighted by Book size (here the Book is rich, so customer weights dominate; keep the knob so a thin-history Book can be demoed too).
- Output the ranked list with reasons and a down-ranked tail; expose adjustable weights.

**For the market-intelligence beat (L1 + curated, no live news ingestion):** attach **curated public events** (drawn from the real backtest research under `planning-docs/backtest-2026-06/`, plus a few EDGAR/USAspending pulls) to ~10–15 of the universe entities → annotated market items in the Stream: "these tracked companies just moved this week" (timing) and one or two net-new "not on your list, fits what you fund" examples (extension). Curate for *density* so the Stream feels alive without building L2.

## 15. v2 — the intelligence layer over the CRM (initial thoughts)

Katharine's strongest, most specific want was an **intelligence layer over HubSpot** — not a ranked import, but a *living* overlay: continuously monitor her ~2,000 tracked companies, surface signals on her tier-1s, add net-new similar companies, and **sync both ways** (signals and net-new flow back into HubSpot records). Empire's thin deal history makes its *ranker* weak today, but the CRM-intelligence layer is valuable *independent of a rich ranker* — it's enrichment + monitoring + organization over a universe she already maintains. It is therefore a natural **v2** (possibly the headline for CRM-native lenders), and it is **why we define the CRM/notes data shape now** (the Lead/Company record) even though v1 imports a CSV instead of syncing: the architecture is ready, and we can demo the shape with synthetic CRM/notes.

Initial design notes for v2:
- **CRM as source and sink.** Read the customer's universe + history + notes continuously; write back ranks, signals, and net-new companies with context. Quintel sits *beside* the CRM (HubSpot/Salesforce), never replacing it.
- **A CRM connector is just another ingestion adapter** into the same Quintel Book (owner=P private evidence) — so v2 reuses everything; it replaces the CSV import path with a live sync and the manual outcome capture with CRM-stage sync.
- **Two-way sync is the new engineering surface** (field mapping, write-back, conflict handling, polling/webhooks) — scope it as its own slice when v2 starts.
- **The CRM/notes extractor** (the messy "flesh" of §9's ladder, including decline reasons) matures here.

## 16. Reuse / change / park — the existing build (slices 1–18)

A working engine already exists (`apps/deal-engine`, slices 1–18: an entity-evidence graph, pure engine stages, a calibrated scoring model, cascades, and an autonomous monitoring loop). Against this PRD:

- **Reuse as substrate:** the entity-evidence ledger (score the *entity*, accumulating evidence over time); the **pure engine stages** (resolve / derive / score / gate — fixture-tested, clock-injected — ideal for running the seeded demo with no live infrastructure); the calibrated scoring model (corroboration, per-source decay, polarity); the box-fit gate; the cascade machinery (extends to public→private).
- **Change / build new:** add `owner` to evidence/edges; make scoring read `owner ∈ {public, P}` so the score is genuinely per-customer (retire the prior account-agnostic baseline); model the **Quintel Book** (private evidence) as a first-class citizen; add the **revealed-preference ranker** (the prior engine scored public signals, not the customer's book — this is the new core); add the **Stream UI + per-item relevance-annotation render + interaction controls** (the customer surface — genuinely new); and **pull L2 news ingestion forward** — the unstructured-text→Observation seam + narrative-event taxonomy was *unmodeled* and is now a v1 priority (it is what makes the feed feel alive).
- **Park / roadmap (not v1, do not delete):** the autonomous monitoring loop (clocks, ticklers, decay-crossing solvers, production watermark machinery) — returns for live monitoring at scale; and **L3/L4 market depth** (hidden-portal records, cascade inference) — these were the prior build's cold-sourcing priority and are reframed as market-data *depth behind density* (§11), pulled in post-v1.

## 17. The demo path (fully seeded — no CRM sync, no live monitoring, no news ingestion)

- Hand-author the **synthetic Cornerstone Book** (§14) in the §9 schema.
- **"Synthetic sync"** = import an Apollo-style CSV as the universe.
- Run the **pure engine + ranker** → the ranked Stream with per-item reasoning (the dial).
- Attach **curated L1 + news-style market events** to a slice of entities → the tailored-intelligence beat (timing + a net-new extension).
- **Foreground the reasoning, not the order.** The demo moment is opening an item and showing *why it's relevant to this customer* — tied to their deals, sponsors, and live events — so they validate **comprehension** (instantly checkable), not accuracy (unprovable). Let them thumb-down a wrong-industry item and watch the Stream re-tune (the interaction loop).
- Result: the full product end-to-end on seeded data — and because the synthetic Book schema *is* the real ingestion target, **the demo is the product, not a throwaway.**

## 18. Open decisions, risks, and load-bearing assumptions

**Settled:** customer-data-first relevance-stream with **market intelligence in v1** (L1 live + L2 news as the priority pull-forward; L3/L4 roadmap); the product is a ranked, annotated, interactive **Stream**, not a static list, validated on *comprehension* not accuracy; graceful degradation on deal-data depth (coarse context floor → deal-data deepening); interaction controls as the immediate personalization loop; minimal private-entity graduation; no live CRM sync in v1 (synthetic CSV); light manual outcome capture; credit-memo extractor as the ingestion spine with base-fields + `extensions` + a thin per-customer adapter; CRM/notes data shape defined now for v2.

**Load-bearing assumptions to test, not assume:**
1. **Credit-memo uniformity** — the "base layer generalizes, per-customer layer stays thin" claim (and the falling setup cost) depends on funded memos carrying largely the same information across customers. *Test: get 3–5 real memos (Stauss can supply) and confirm standard-field coverage; `extensions` absorbs variance, but if *standard* coverage is low, the base layer is weaker than assumed.*
2. **Feed density / the "alive" promise** — the whole reshape rests on the Stream feeling alive, which depends on L2 (news). If L2 is slow, the feed leans on the static universe + sparse L1 and risks feeling under-alive for a narrow customer. *Mitigation: the demo curates density (no L2 needed); L2 is the first thing built after the dial ships; until then, set expectations on "tailored + ranked," not "a live wire."*
3. **Newsletter-collapse** — L2's content is commodity; the entire differentiation is the *depth and visibility* of the per-customer relevance annotation + the interaction. If the tailoring is shallow ("filtered by industry"), it *is* a high-priced newsletter. *Mitigation: the annotation must reference their actual sponsors/deals/range, and the feed must visibly learn from interaction — this is a hard execution bar, not a nice-to-have.*

**Resolved by this version (was a risk):** *thin-history cold-start (Empire).* Graceful degradation (§4) makes Empire a **v1** customer, not a v2 deferral — the coarse-tailored Stream + interaction + L1/L2 market intelligence carry value without rich deal history; deal data is the upgrade path. (The base-prior blend, §10.5, still handles ranker stability at low volume.)

**Other risks to watch:** decline-reason extraction from messy CRM/notes is the richest signal but the least certain to automate (v1 may capture reasons manually); per-customer scoring means decay/crossings are per-customer (fine at current scale).

---

## Appendix — provenance (background, not required reading)

This PRD is self-contained; these are the source documents it synthesizes, for anyone who wants the underlying threads:
- `product/quintel/positioning/quintel-positioning-synthesis-2026-06-28.md` — the positioning/sell reasoning (dial vs. switch, the commodity trap, Mike/Apollo, the demos), also published at `tokenrip.com/s/03828815-0dac-4507-b51d-9e1aa23c3038`.
- `agents/bean/ideas/quintel-customer-data-dial.md` — the architecture derivation (share-evidence-privatize-score) and the open-decision log.
- `bd/calls/notes/katharine-rudzitis-2026-06-18.md` — the Empire/Katharine discovery call (the CRM-intelligence want, the tool stack, the ~2,000-company universe).
- `product/quintel/engineering/quintel-lender-build-roadmap-2026-06-10.md` and `engineering/quintel-engine-build-roadmap-2026-06-09.md` — the existing engine/lender build the substrate is repurposed from.
- `planning-docs/backtest-2026-06/FINDINGS.md` (in the `terminus` repo) — the public-signal backtest behind the market-data layer and the "switch is sparse" finding.
