---
title: Quintel Positioning — The Deal-Intelligence Engine vs. The Signal Feed
status: active
owner: Simon
type: positioning-memo
created: 2026-06-28
audience: internal (Simon/Alek); shareable
related:
  - product/quintel/quintel-customer-data-first-prd-2026-06-29.md
  - product/quintel/positioning/quintel-homepage-positioning-spec-2026-06-24.md
  - bd/calls/quintel-sales-tear-sheet.md
  - product/quintel/engineering/quintel-lender-build-roadmap-2026-06-10.md
---

# Quintel Positioning — The Deal-Intelligence Engine vs. The Signal Feed

> **Purpose:** the canonical positioning reference for Quintel — what the product *is*, how it is described on a call, and why it is not a commodity signal feed. Companion to the homepage spec (the page) and the sales tear sheet (the live objection bank). Source of truth for sales conversations.

---

## 1. The core distinction

Quintel is a **deal-intelligence engine for equipment finance**, not a signal feed. The difference is structural, not cosmetic: a signal feed runs on one input — public data — and is therefore a commodity any competitor can replicate (Apollo, ZoomInfo, and the trade newsletters are all parity). Quintel runs on **three inputs fused** — the public record, the customer's own book, and an accumulating closed-deal graph — and the fusion is the product. The public signal is the cheapest of the three fuels; it is never the thing being sold.

Everything below follows from this one fact: **the moment the customer's own data is inside the engine, the output stops being a feed everyone gets and becomes theirs.**

## 2. The product is settled; the open question was framing

Two framings of Quintel have been in tension: "surface deals before anyone else" (a sourcing/signal frame) and "an intelligence and decision-support system" (an engine frame). The tension is not a product disagreement — the v1 product is agreed (single-player origination running on the customer's own deal history and pipeline) and so is the trajectory (a deal graph that compounds across customers, a v10 not a v1). The disagreement was entirely about **how the product is described.** That is a smaller and more tractable problem than it appeared, and §3 resolves it.

## 3. One word ("signals") was doing three separate jobs

The framing tension dissolves once it is recognized that the word "signals" was carrying three decisions that are independent of one another:

| Job | The decision | Correct answer |
|---|---|---|
| **Hook** | What opens a sales call and earns attention | **Sourcing** — "surface deals." It is what every live prospect (Mike, Katharine, Scott) leaned in on. |
| **Position** | What the product *is* / its category | **An engine that runs on the customer's data** — not a signal feed (a feed is a commodity news ticker). |
| **Price basis** | What the invoice is denominated in | **Access / capability module** — never per-signal (per-signal pricing re-commoditizes the product — see §8). |

Both framings were therefore correct, on different axes. The resolution is not to choose between them but to apply each to its own job: **open with the sourcing hook, deliver an engine that runs on the customer's data, and price for access.** This is already how the homepage is built — sourcing is the hook inside "How it works," the engine is the hero — and the same split governs the spoken pitch.

## 4. The position rests on a single mechanism: the engine runs on the customer's own data

The defensible product is the **three layers above the signal**, all of which require the customer's own data as an input:

1. **The public record** — fuzzy, universally available; the cheap commodity layer.
2. **The customer's own book** — hard data only they possess: what they funded, what they declined, and why.
3. **The closed-deal graph** — proprietary and accumulating across customers over time.

Fusing the three produces one decision-ready read on every deal. The mechanism is **bidirectional, not a one-way filter.** The naive view is that customer data merely narrows the public feed to a buy box. In practice, a single hard data point from the customer *retroactively re-weights public signals the engine had already collected and discarded as noise.* Example: the engine has weak, uncorroborated evidence that a manufacturer is expanding into a region; a customer's known capex event in that region corroborates it and promotes it to an actionable inference the engine would otherwise have dropped.

This single fact is simultaneously the positioning, the moat, and the sourcing mechanism:

- **As positioning** — the output is unique per customer, so the "commodity" and "are you giving my deal to a competitor" objections cannot attach.
- **As moat** — every additional customer's data improves public-signal corroboration for the whole base (the deal-graph network effect).
- **As mechanism** — it is literally how Quintel surfaces more and better deals than a pure-public competitor can.

When this is articulated, "intelligence vs. signals" is no longer a matter of taste: "intelligence" denotes a specific capability a feed structurally cannot have, because a feed has no second input to corroborate against.

## 4a. What is actually buildable — and why sourcing must rest on the customer's data

This is the technical crux, and it has been the hidden source of the framing tension. It determines what can honestly be promised, so it is worth stating in plain terms.

"Surface deals from public data" describes **two very different capabilities with two very different risk profiles** that have been treated as one:

- **Capability 1 — the hard-data engine** (built on the customer's own data, improved by market data). Rank and resurface the customer's own pipeline and dead leads against what actually closes for them; corroborate and enrich the borrowers they already know with public market data. The risk here is *how much* lift, not *whether* it works — **a dial** that runs from "a little better" to "a lot better," whose floor is positive. The data is all present; only the size of the improvement is in question.
- **Capability 2 — cold sourcing** (surfacing net-new in-market borrowers from public data alone, with no customer anchor). The risk is categorically different: *whether the signal exists in the public record at all.* No amount of inference can manufacture a signal that is not there — a borrower about to need equipment who leaves no public trace cannot be found by any engine. This is **a switch, not a dial:** for a given deal the public signal is either present or absent, and that is outside the vendor's control.

The evidence indicates Capability 2's signal is **real but sparse and lumpy.** Equipment finance does have genuine public triggers — UCC lien filings and maturities, USAspending awards, EDGAR material-agreement filings, construction permits, utility interconnection queues — and a backtest surfaced real deals from exactly these (an air permit, a Con Ed interconnection queue). Cold sourcing is therefore not fantasy. But the same backtest surfaced only a handful of deals across a multi-year window: proof the capability *exists*, not proof of reliable *volume*. Some deals leave a public trace; most do not.

The consequence: **the company cannot anchor its core promise — or its pilot — on Capability 2.** A great inference engine does not help if the underlying data is absent from the public record, and that is the single largest, least-controllable unknown in the product. Capability 1 is doable with confidence; its floor is positive regardless of how the public-data question resolves. **The rule of thumb: do not bet the company on a switch outside your control; bet it on a dial whose floor is positive.**

This is the deeper reason the position is "the engine runs on your data." It is not only the escape from the commodity frame (§4); it is the technically honest one. The customer's hard data is the foundation whose value is guaranteed; public market data is built on top of it to reach higher. The house is built on the foundation, using whatever scaffolding the public record happens to provide — never on the scaffolding.

And the customer's data is precisely what makes sourcing *more buildable* in the first place: it narrows the search (the customer's box and closed-deal patterns tell the engine what to look for) and corroborates weak candidates (the bidirectional mechanism of §4 — a known capex event promotes a public signal the engine would otherwise have discarded). Cold sourcing with no anchor is a search of a vast space for sparse signal; the customer's data is the magnet that makes the sparse signal findable. Even the sourcing capability, then, is strongest when it rests on the customer's data — the same conclusion reached from the engineering side.

**What this means for the pitch:** lead with sourcing as the hook (§3), but the substance delivered and the pilot measured must rest on Capability 1 — ranking and resurfacing the customer's own flow, and enriching the borrowers they know — with net-new cold sourcing positioned as *upside*, not as the promise the pilot must prove. A pilot pinned on Capability 2 can surface nothing in 60 days through no fault of the engine; a pilot pinned on Capability 1 self-proves on the customer's own book. (Note: this is not a new constraint imposed on the sourcing frame — it makes explicit what the v1 product definition already held, which set the external "find more" capability aside as the unproven part.)

## 4b. The deal history is the credit team's judgment — the Mike / Apollo proof

One concrete case makes the dial undeniable and shows why **deal data, not the buy box, is the core of v1.**

Mike (36th Street) entered his box parameters into Apollo, got back ~3,500 leads, and is calling them in list order. Two facts make this the cleanest possible illustration:

**Mike is not the credit team.** Origination and credit are separate functions holding separate knowledge. Mike hunts off a *stated* buy box; the credit desk holds the *tacit* model of what actually funds — which sectors get rejected, how flexible the box edges really are, which geographies are hot, which OEMs/dealers actually close. Mike only learns what credit wanted *after* he has burned the dials and submitted. **The deal history is the encoded, transferable form of the credit team's judgment** — and a tool that learns it puts that judgment at the *top* of his funnel instead of the bottom. This is an information gap *inside the customer's own firm*, and closing it is the value. It has nothing to do with predicting a cold company: Mike's 3,500 are not cold — they are his list. He simply does not know which to call, because he is not credit.

**Ranking beats cutting, because the rep calls down the list.** Mike will never reach all 3,500, so his first hundred dials are currently *random*. Ranking by revealed preference makes his first hundred the *best* hundred — a large hit-rate gain on the attempts he actually makes. Ranking also subsumes the negative signal (top = "call these," bottom = "don't bother," one operation) and is the *safe* form of suppression: a mis-ranked good lead sits lower, never silently deleted.

This yields the cleanest v1 and the cleanest sourcing demo: **"give us your list and your deal history, and we will rank it."** No sourcing engine, no market data, no cold prediction. Demonstrable on the customer's own data, certain to work, and it dodges every objection at once — no batting average, no "are you using my deals for a competitor." It is the customer's own list, ordered by the customer's own track record. **Deal history alone is a sellable product; market data is the crank** that turns a one-time list-scrub into the always-on engine. The stack, concretely:

- **Buy box → the raw list** (Apollo's job; commodity; everyone has it).
- **Deal history → rank and trim the list by what actually funds** (the dial's baseline; valuable with *zero* market data).
- **Market data → time it and extend it** (the crank — who is heating up *now* in the public record; net-new names beyond the list, scored the same way).

This also reframes the build (see the architecture work): the design's *baseline* is customer-data-alone intelligence, and market data is a layer that cranks the dial — not the other way around.

## 5. The spoken articulation: name the formula, never the category word

The word "intelligence" is empty in conversation until the formula behind it is named — a buyer hearing "intelligence layer" with no formula cannot tell it apart from a buzzword. The operative rule: **never say "intelligence" out loud; state the formula and a verb.** The recommended lines:

- **Opening (hook and position in one breath):** *"We take your last hundred deals — what closed, what didn't, and why — and run the whole public market through that. Instead of a list of a thousand names, you get the two hundred that look like the deals you actually win, and a flag on the ones not worth a dial. It gets sharper every deal you close."*
- **One-liner:** *"An origination engine that runs on your own book. The market, filtered to how you actually fund — not a list everyone else can buy."*
- **Not-a-commodity:** *"A list vendor's job is to give you more names. Ours is to give you the right ones and take the rest away. We bet on your hit rate, not our list size."*
- **The moat:** *"Not secret tech — your data. Six months in, it knows your book better than any new tool could, and switching means it forgets everything."*

## 6. Objection handling (positioning-linked)

| Objection | The move | Why it works |
|---|---|---|
| "Isn't this just a newsletter / ZoomInfo / news ticker?" | "Those run on public data only — the same list for everyone. This runs on *your* closed deals, so your output is yours alone." | Names the three-fuel difference; the commodity charge cannot attach to a product keyed on the customer's private data. |
| "Are you giving my deal to a competitor?" | "Two lenders looking at the same public signal don't get the same list — the ranking runs against your box, your history, your relationships." | Personalization breaks the zero-sum frame. The blanket "one company per buy box" promise must be retired — it was double-promised to overlapping boxes and cannot be honored. |
| "What's your hit rate / batting average?" | "No vendor can quote one honestly this early. The unit is net-new funded deals: misses cost one dial, hits are $1–100M. The pilot measures the real number on the real box in 60 days, refundable if it isn't surfacing deals." | It is a re-ranking of the customer's own pipeline, not a prediction about a magic feed — there is no accuracy claim to defend. |
| "What does 'intelligence' actually mean?" | Drop the word; state the formula ("what closes for you, run against the whole market"). | The abstract noun is empty; the concrete formula is legible. |
| "This is underwriting — there's already a team for that." | Don't lead with underwriting for an originations buyer. Lead with sourcing-on-their-data; underwriting is an expansion module (§8), not the wedge. | Matches the buyer's function and keeps the first sale low-friction. |

## 7. The negative signal: a phase-two capability and a credibility proof, not a wedge

Suppression ("don't call these") is valuable but frequently overrated, and the distinctions matter:

- **Confident suppression is defensible only for deterministic disqualifiers** — wrong asset class, too small, out of geography, already financed per a fresh UCC filing. Probabilistic "low-probability" suppression is *more dangerous* than a positive signal, because a false negative kills a real $1–100M deal and does so silently: a suppressed lead is never called, so the error never surfaces and never trains the system. Suppress only what is defensible on a record.
- **It is the tail of a ranking, not a standalone product.** It falls out of ranking the customer's own pipeline. Sold separately as a "noise filter," it reduces Quintel to a feature on top of someone else's list.
- **It requires more trust to act on than a recommendation.** Acting on a suppression means trusting the system enough to *not* do something — a higher bar than trying a suggestion, and one a new vendor has not yet earned (loss aversion drives the operator to call anyway). Suppression is therefore a phase-two expansion, after trust is banked, not a first-call pitch.
- **Its strongest immediate use is as a credibility proof.** "A list vendor adds names; we take them away" demonstrates alignment with the customer's outcome rather than the vendor's volume metric — something a commodity feed structurally cannot say.
- **Refinement — revealed vs. predictive negatives.** A *revealed-preference* negative ("your last fifty deals never closed mining, so it sinks to the bottom") is the customer's own track record mirrored back, not the vendor's prediction. Its trust bar is low (nothing to argue with), it is available day one, and it is expressed as a *down-rank* — the tail of the §4b ranker — which preserves the cheap-miss. A *predictive* negative (the model guessing a specific lead will not convert) keeps the high trust bar and stays a phase-two, suppress-only capability for deterministic disqualifiers. So the negative signal costs nothing to ship once the ranker exists; it is the ranker's tail, not a separate build.

## 8. Pricing must match the position

Pricing reveals positioning: an invoice denominated per-signal tells the buyer the signal is the product and that it is scarce, which re-triggers every commodity objection (exclusivity, "who else gets mine," hit-rate). Bloomberg never prices per data point; it prices the terminal, and every customer pays for access.

The tiering instinct — give the buyer "which package" rather than "yes/no" — is sound and should be preserved. It must run on the **capability-module axis, not signal count:**

- **Sourcing** — find deals matching what the customer closes.
- **Underwriting / packaging** — assemble the messy deal into a credit-ready, scored package.
- **CRM-intelligence / matching** — the decision and lender-match layer over the customer's CRM.

This axis maps to the engine's own decomposition (source → underwrite → place) and aligns the price ladder with the go-to-market sequence: the customer lands on whichever module is their acute pain (low friction), and the others become the land-and-expand path. Underwriting, the highest-friction sale, becomes an expansion module rather than part of the wedge. The per-signal axis is abandoned; the optionality is retained.

## 9. The proof mechanism: running the engine on the customer's own deal

The position ("it runs on your data") has a cold-start exposure: before the customer shares anything, the engine has only public data and is, on that first call, indistinguishable from the commodity feed it must not be. The escape is the **closer** — running the engine live on one of the customer's own deals — which is also the unfakeable demo and the moment the positioning becomes literally true.

A "deal" exists in three forms, with very different ask costs:

| Form | What it is | Ask cost |
|---|---|---|
| **Raw blob** | the email thread, attachments, and back-and-forth accumulated over weeks | Heavy — requires reconstruction |
| **Document set** | the attachments alone (financials, equipment quote, application, bank statements), often already bundled in a cloud folder | Medium — "forward the folder for one closed deal, scrubbed" |
| **Finished package** | the submittable credit-memo PDF | Light — one file the customer already produces |

The input requested and the demo run are **coupled**: if the customer provides the finished package, the assembly is already complete and cannot itself be demonstrated. There are therefore two demos, chosen by which pain the call opened on:

- **Demo A — Assembly** (input: the document set). Shows extraction with provenance, financial spreading, an assembled and scored package, and a path-to-fund. The decisive moment is provenance on the customer's *own* numbers ("$28M EBITDA, pulled from page 3 of the financials you sent") — un-pre-bakeable. Used when packaging is the pain (Scott: "the issue is writing the credit memo").
- **Demo B — Read / Match** (input: the finished package PDF — the low-friction default). Shows what the customer would do *next* with a package: the scored read against a box; public-record **enrichment** the file did not contain ("here's what we found on this borrower that wasn't in your deal"); and, for a broker, the **ranked lender match** in which the customer's *actual* funder appears in the top three alongside alternatives they did not try — net-new value, verifiable on a deal they already know cold.

Concretely, the demo is the **Deal Detail screen lighting up from the customer's input** — their document(s) on one side, provenance-linked extracted fields in the centre, then either the assembled package (A) or the read, enrichment, and lender-match (B). The low-friction default is the finished package plus Demo B; the document set plus Demo A is requested only when packaging is the wedge.

The sequence: Call 1 delivers the pitch and a canned demo on an *anonymized* deal the vendor controls; the bridge requests one scrubbed closed deal; Call 2 runs the engine live on it. (Full screen mechanics: `product/quintel/engineering/quintel-lender-build-roadmap-2026-06-10.md` §6.)

**A risk-ordering note on the live demo:** the lender-match punchline in Demo B ("your actual funder lands in our top three") is the strongest beat but also the highest-risk — it requires the customer's lender panel already ingested and a matching engine good enough to surface their real funder, and a live miss produces a false positive in front of the buyer. The lower-risk live beats are extraction-with-provenance (Demo A — visibly works or visibly doesn't, hard to be embarrassingly *wrong*, and an imperfect read invites "I'd tweak this" rather than "that's wrong") and the public-enrichment line (no panel dependency). Lead the live closer with the zero-setup beats; reserve the lender-match punchline for once the panel is loaded and it has surfaced the real funder in rehearsal.

### Demo C — Rank their list (the sourcing demo Demos A and B don't address)

Demos A and B prove underwriting/packaging on a single deal; neither addresses the *sourcing* hook. **Demo C does, and it is the strongest of the three** because it runs the dial (Capability 1) on the customer's own list — the §4b "rank my list" move made into a demo and a v1 wedge at once:

- **Input:** the customer's lead list (Mike's ~3,500 Apollo export; Empire's ~2,000 HubSpot universe) + their deal history (closed/declined deals, or — see the credit-memo unit in the PRD work — a set of funded credit memos).
- **Output:** the list re-ranked and scored by revealed preference (what their credit team actually funds), the bottom flagged "don't bother," each row carrying reasons. Then, layered on, a *timing* beat (which top-ranked names just moved in the public record) and an *extension* beat (a few net-new names beyond the list, scored the same way).
- **Why it is the safest live demo:** it runs on the customer's own data (unfakeable), it cannot embarrass — a ranking either matches their intuition or invites "I'd weight this differently" (co-creation) — and the baseline needs no lender panel and no cold-signal yield. It is the live, sourcing-side analogue of the underwriting live-drop.
- **The baseline runs on deal history alone** (no market data), so it is buildable with certainty; the market-data timing/extension layers are the crank, shown second.

**On cold net-new sourcing:** that face (Capability 2) still must *never* be demoed live on a prospect — it is the highest-whiff-risk part of the product, and a live miss proves the opposite of what is intended. It is proven retrospectively by the **backtest** ("this deal closed in March; the public signal chain was assemblable in January; your tools didn't assemble it" — a mechanism demonstration, not a counterfactual) and forward by the **refundable pilot.** The live sourcing demo is Demo C (the dial), never cold net-new (the switch).

## 10. Implications for live calls

1. Open with sourcing — it is the hook and it works.
2. When asked what the product is, state the formula, never the word "intelligence."
3. Do not carry underwriting uphill to an originations buyer; it is an expansion module, not the wedge.
4. Retire "one company per buy box" everywhere — it cannot be honored and plants the zero-sum fear.
5. The closer is "let's run it on one of your own deals"; default to requesting the finished package PDF and running Demo B, escalating to the document set and Demo A only when packaging is the pain. Lead the live demo with the zero-setup beats (extraction-with-provenance, public enrichment); hold the lender-match punchline until the panel is loaded.
6. Price for access on the capability-module axis; quote nothing per-signal.
7. **Anchor the pilot on Capability 1** (rank/resurface the customer's own flow, enrich the borrowers they know) — never on net-new cold sourcing, which can surface nothing in 60 days through no fault of the engine. Sourcing is the hook; the measurable win is the hard-data lift. Cold sourcing is upside, proven by the backtest, not by the pilot.
8. **The simplest entry is "rank my list."** For a sourcing buyer (Mike), the lowest-friction wedge and demo is Demo C (§9): take their existing lead list + deal history, hand back a ranked, reasoned, trimmed list. It needs no market data and no sourcing engine, it is demonstrable on their own data, and it dodges every objection. Sell that first; the market-data timing/extension layers and the underwriting/match modules are the expansion.

---

*Companion to `product/quintel/positioning/quintel-homepage-positioning-spec-2026-06-24.md` (the page) and `bd/calls/quintel-sales-tear-sheet.md` (the live objection bank). Canonical product direction: `product/quintel/quintel-customer-data-first-prd-2026-06-29.md`.*
