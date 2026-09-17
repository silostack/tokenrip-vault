---
status: draft v0.1
last_revised: 2026-09-17
owner: Simon (with Alek)
serves: the decision to build Quintel v2 as a two-step evolution of an equipment-finance brokerage, starting with a borrower-facing site and funnel
tier: shareable with Alek. Not for David or any external party.
---

# Quintel v2 thesis: a leaner, smarter Providence, built demand-side first

## 1. The so what

Quintel's end state is an AI-driven equipment-finance brokerage: what Providence Capital Funding does, with the same underwriting ease and speed, at a fraction of the headcount, fed by a demand engine instead of a dial floor. That is not reachable in one step because the two things a broker needs, borrower trust and funder relationships, both take volume to earn. So step 1 is the part that can be built without either: a borrower-facing site and funnel that find demand, qualifies it without collecting personal data, and refers it to originators who close. Step 1 is worth building on its own economics, produces the intent dataset that step 2 needs, and lets the switch to step 2 be a decision made on numbers we pre-register here.

## 2. What Providence actually is, and what the evolution keeps

Providence is a Type-3 originator (other people's money, lease-to-own) with 22 years and an A1 rating. Its mechanism, as David described it across four calls:

| Mechanism | Why it wins deals | Keep, change, or remove |
|---|---|---|
| One-page application; Providence guarantees performance for 12–24 months and buys the loan back if it fails, so funders accept light underwriting | ease and speed beat rate for a sub-15-employee owner; a bank takes 3+ weeks and "wants to know what colour his underwear is" | **keep.** This is the product the borrower buys. Step 2 requires funder relationships that grant it |
| Reps on full commission, eat what they kill | reps fight for marginal deals; salaried inbound desks at big funders let 50 deals walk | **change.** The rep's job splits: demand is manufactured by software, closing stays human until it doesn't |
| Top rep makes zero cold calls; 99% vendor inbound | the winners are inbound; cold calling is dying (AI call screening, reflexive "no" at the word financing) | **keep the shape, replace the source.** Vendor inbound becomes digital inbound (§4) |
| Most reps make ≤50 dials a day, 80% on existing business; a bought list of 10,000 UCC leads produced 5 applications | the dial floor is the cost structure; it does not scale and it demoralises | **remove.** No dial floor |
| Two CRMs, neither exportable; dedupe by hand at three minutes per row | trust and politics inside the shop | **remove.** One ledger, attribution by construction |
| Geography and ICP live in one person's head (22 years of funded deals on a map) | tacit knowledge, unencoded | **encode.** The verdict loop and the funnel turn it into features |

"Leaner and smarter" therefore means: same borrower promise, demand from inbound and triggered outbound instead of dials, qualification done by software before a human touches the lead, and every outcome written back as a label.

## 3. Why two steps, in this order

- **Fact.** Borrowers will not hand a Social Security number to a brand formed last month with no bond and no history. David's GW Capital story (a mass blind email under a fresh brand; only fraudulent replies) is the evidence, and it matches common sense. Step 1 places the PII collection with the originator, where the trust already exists.
- **Fact.** Funders want bonds and a track record before they accept a broker's paper. Volume comes first; relationships follow it.
- **Inference, high.** The scarce asset in small-ticket EF is not capital or brokers (14,000 EF companies in 2022 became 46,000 in 2026 on flat volume, per David) but manufactured demand. Whoever owns the demand chooses the originator. Step 1 builds the demand engine while someone else carries the trust and the funder panel.
- **Inference, high.** Step 1 produces the one dataset nobody in this market has: borrower-stated intent (equipment, price band, timing, state) attached to a verified entity, at scale. Contact vendors have intent without fit; registries give fit without intent. the site and funnel captures both from the demand side. That corpus is the moat step 2 stands on.
- **Inference, medium.** Step 1 is sellable on its own: a per-application referral fee or a share of funded revenue to any originator whose box fits. It is not a bridge to be tolerated; it is a business.

## 4. The reframes this program rests on

Each is labeled. The disconfirming test is named where one exists.

1. **The need-buyer has no upstream entity-level event.** Fact, from David's three-year scrape of funded deals against news, court, government and municipal sources (zero signal; hiring is a universal false positive) and from our own five batches (hiring, UCC renewal, lien timing all dead; only business-event tags separated, at n=2). Consequence: stop mining entity-level records for intent. Look at (a) the moment the owner asks a question, and (b) events that happen *to* him.
2. **Intent first surfaces at the equipment question, not the financing question.** Inference, medium-high. David's shrink-wrap customer asked ChatGPT for manufacturers, then for details on each, weeks before financing came up. "Equipment financing" queries are the most contested in commercial lending; "which vac truck for a two-truck septic company" is not. the site and funnel ranks for the equipment question and the financing offer piggybacks. Test: query volume and citation share on trade-equipment questions vs financing questions, first content sprint.
3. **The reader of the site is the borrower's AI.** Inference, medium. The shrink-wrap buyer's ChatGPT did the vendor's job. Content is built to be cited: structured specs, price bands, payment math by term and state, plain sourced claims. Being the record the model cites is the ranking.
4. **Loss and cohort events are the intent signals that exist for this population.** Inference, medium, untested. A crash or out-of-service order in FMCSA data, a FEMA declaration in the operator's county, an emissions deadline on his model year, a private-party listing of his old truck: these are the things that happen to a business that does not plan. Entity-level loss events and county-level cohort events both rank the pool by lane and geography, which is the shape the pipeline already has. Test: `signals.md` (not yet written), starting with the FMCSA join because the data is already held.
5. **Whoever owns the reply owns the demand.** Fact by construction. A Providence-branded domain locks every reply to Providence and imports its dedupe and internal-politics problems. A Quintel-branded domain makes the reply ours: we pre-qualify, we hold the relationship through the handoff, and what we route is a deal, not a lead. Whether the borrower is already in an originator's database stops mattering, attribution becomes a timestamp, and a second originator becomes configuration. See `providence.md` §3 for how this reconciles with the pilot's earlier decision.
6. **The 2% bar is a calling metric.** Fact. Two applications per hundred live contacts is the arithmetic of a dial floor. For inbound the ratio inverts: contacts are few and applications per contact are high. The metric for the site and funnel is cost per qualified application, and the fee is a referral rung, not a list price.
7. **The calculator is the Gemini scrape.** Inference, high. Nobody can read what owners type into Gemini or ChatGPT. The page those tools send the owner to can log what he types into a payment calculator. That log is the live intent feed David tried to get from Google and could not buy.

## 5. Step 1 defined

**Build:** one site, one brand, that (a) answers the equipment questions a specialty-trade operator asks, (b) offers a payment or quote calculator that captures stated intent with no personal data, (c) verifies the entity against public records we already hold, (d) routes the qualified lead to an originator, and (e) receives the outcome back as a label. Outbound email on Quintel domains points to the same site and terminates in the same funnel. Full architecture: `funnel.md`.

**Do not build in step 1:** credit pulls, applications, funder relationships, paper. Anything past the PII handoff belongs to the originator.

**Originator panel v1:** Providence, via David. Built as a panel of one so that adding a second is configuration, not a rebuild.

## 6. Decisions so far (move to `decisions.md` when there are more than ten)

| Date | Decision | Reasoning | Reversible |
|---|---|---|---|
| 2026-09-15 | End game is an AI-driven brokerage; step 1 is a site and funnel that qualify and refer | Simon and Alek; §1–§3 | yes, at the step-2 gate |
| 2026-09-16 | One site, one brand, for now | Two brands is more than the team can stand up; capture the two-brand idea as thread T10 | yes |
| 2026-09-16 | Program folder is `active/quintel-v2/`; flpool stays the lab | see `CLAUDE.md` | trivial |
| 2026-09-16 | Outbound for the funnel runs on Quintel-branded domains | reframe 5; scalability past Providence; dedupe | yes, but see `providence.md` §3 for the pilot commitment it reverses |

## 7. Graduation from step 1 to step 2: pre-registered, numbers are placeholders to ratify

Step 2 (Quintel as broker of record) is a decision, not a drift. Proposed gates, to be ratified with Alek and revised once real numbers exist:

| Gate | Placeholder threshold | Why it matters |
|---|---|---|
| Qualified applications routed per month | ≥ 40 for three consecutive months | a broker needs a deal flow that justifies bonds, a funder panel, and a closer |
| Panel acceptance rate (applications the originator actually pulls) | ≥ 50% | proves the qualification is real, not a list with a form on it |
| Funded rate on accepted applications | at or above the originator's own house rate | proves we are not adverse-selecting |
| Fee gap | broker economics on the same deals ≥ 2.5× the referral fee, after the cost of closing | the only reason to take on the harder business |
| At least one funder willing to accept Quintel-brokered paper on stated terms | one written yes | the trust gate; cannot be inferred |
| Cost per qualified application | falling for two consecutive quarters | the engine is compounding, not being bought |

If the fee gap is small or the panel acceptance is high and stable, the right answer may be to stay a referral network permanently. That is a legitimate outcome of step 1, not a failure.

## 8. Why now, and what kills it

- **Why now.** AI answer engines currently cite sources with no advertising relationship; a well-built page on a niche equipment question can be the cited record. Cold calling to this population is collapsing (AI call screening, reflexive rejection). The public registries that verify an entity (FMCSA, SOS, UCC) are cheap to join. Two costs went to zero (content production, entity verification) while the incumbent channel (dials) got more expensive.
- **Kill condition for the inbound half.** If citation share on the target query set does not appear within two content sprints, or if answer engines stop citing third-party sources as they monetise, the play degrades to ordinary SEO and the content investment is re-evaluated against outbound alone. To be quantified in `inbound.md`.
- **Kill condition for the funnel.** If qualified leads from verified entities do not convert to applications at the originator at a rate materially above David's cold baseline, the site and funnel is a list with a form on it and the thesis is wrong.

## 9. What this is not

- Not a data or list product. Lists are dead at any price at a 2% floor (flpool gameplan §2).
- Not a mass blind email program. Every send goes to a verified entity and every reply is checked against the filed record (`funnel.md` §5).
- Not a Providence competitor in step 1. Providence is the first originator on the panel and the closer for everything the funnel produces.
