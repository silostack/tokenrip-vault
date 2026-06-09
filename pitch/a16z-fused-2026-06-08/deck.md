# Tokenrip — a16z Speedrun Deck (Fused: git-substrate + why-graph)

**Status**: Draft v1 (fused)
**Created**: 2026-06-09
**Length**: 7 slides
**Companion**: [[spine]] (thesis, the why-graph reframe, claim discipline, objections, sourced proof, form-field copy)

> Application deck for **a16z Speedrun** (pre-seed; weights insight + founder + velocity over TAM). It is also a **live submission update**, so it must read as *the same company, sharper, with more proof* — not a pivot. Each slide opens with a **Purpose** line (internal, not slide content); the headline carries the idea and the body proves it. Inline `>` notes are render direction.
>
> **Honesty rule for the whole deck** (claim *position + insight + velocity*, never a finished moat — the acting-agent + why-loop hasn't fired in either vertical):
> - **Quintel (EF):** dashboard/collateral layer **deployed**; the revenue-generating **acting agent is next and unsigned.** Never attach "deployed" to the acting agent.
> - **Credentialing:** customer is **AICAP, a credentialing company** — *not* a hospital. The ~$22K/day figure is the *end-customer's* (hospital) pain in the space, never "our customer."
> - **EF partner anonymous** — an industry veteran, **never VFI**. ⚠️ Confirm tenure (this draft says "20-year"; prior copy said "40-year" — lock one).
> - ⚠️ **No tool-count claim** ("101 tools") until Simon confirms the real number — omitted here on purpose.
> - ⚠️ Reconcile before send: Alek "300+" customer-dev conversations (used here); Simon's RealtyCrunch title (this draft says "founding engineer," old deck said "VP" — use the accurate one); verify the REAX acquisition + ticker.

---

## Slide 1 — Title

**Purpose**: Name the company and compress the whole pitch into one line.

**Company name** (hero): Tokenrip

**Tagline**: Coding agents have git. For everything else, there's Tokenrip.

**Subline**: The substrate that lets AI agents do real operational work — versioning, review, provenance, permissions — and records not just what happened, but *why.*

> Tagline is the hero. The subline pre-scopes "everything else" to operational work and names the substrate, so the abstraction is grounded on the same slide it's introduced. Founders · contact · tokenrip.com in a small footer.

---

## Slide 2 — The insight

**Purpose**: Demand + the prize. Open on proven demand and close on the bold position; the git mechanism is support, not headline.

**Headline**: Every operational domain wants coding's agents. None has coding's substrate.

- Coding is the clearest product-market fit in AI — not because models love code, but because code already had the substrate: git versions every change, branches isolate work, pull requests make review multiplayer, and the history records not just *what* changed but *why.*
- Finance, healthcare, legal, and operations all want agents that *do the work*, not just chat. Our two live verticals — equipment finance and healthcare credentialing — are that demand showing up.
- Outside code, the agent's work has nowhere to be versioned, no one to review it with, and no record of how it reached the answer. The blocker isn't intelligence. It's the missing substrate.
- **Whoever provides that substrate owns the position GitHub owns for code — across every operational domain.**

> Densest slide in the deck — keep the four beats tight. The closing line is the prize; render it at emphasis weight.

---

## Slide 3 — The substrate, and how it spreads

**Purpose**: Define the product (the structural git/GitHub mapping) and the GTM (forward-deployed, because horizontal infra has no cold buyer).

**Headline**: Tokenrip is that substrate. We forge it inside vertical products, not by selling it cold.

- **We're the GitHub for operational agent work** — versioning, review, provenance, permissions, and outcome capture — already exposed through REST, CLI, and MCP.
- *The mapping is structural, not cosmetic:* versioned artifacts with stable URLs → commits & repos · forking → branches · threaded review on an artifact → pull requests · **provenance & lineage → blame** · outcome capture → CI.
- *Why products, not cold sales:* horizontal infrastructure has no urgent buyer. So we deploy into a painful vertical, ship the agent that does the work, and the substrate forms underneath it as the byproduct.
- The dashboard is the free funnel; **the acting agent is the revenue.** Each vertical reuses the substrate, so the next one is faster. *(Palantir built Foundry out of deployments, not cold sales.)*

> Emphasize the "provenance & lineage → blame" pair — it's the one that sets up the moat on slide 5.

---

## Slide 4 — Proof

**Purpose**: The only present-tense evidence — two maximally different verticals on one spine. Carries the most weight; the moat is the promise, this is what makes it bankable.

**Headline**: Two very different verticals. One substrate.

- **Equipment finance — Quintel (dashboard deployed; acting agent next).** Built with an industry veteran who brings the domain expertise and the rolodex. A deal is sourced outside, modeled, then passed between broker, dealer, borrower, lender, and committee — redlined, funded. Today that history sits in three silos, and the broker never sees what actually funded or performed. *The circuit is broken.*
- **Healthcare credentialing — with AICAP, a credentialing company (paid discovery done; MVP next).** A case opens at a hospital and ricochets between the provider, primary-source verification, and the committee — mutating until approval. *The causal trail lives in email and coordinator notes, not a structured ledger.* (One stuck applicant burns ~$22K/day at hospital scale.)
- **Same primitives, zero rebuild across both:** document extraction, email ingestion, rubric-as-config scoring, operator-review dashboard, provenance & audit logging.
- A lender's deal and a doctor's credential on the same spine — about as different as enterprise workflows get — is the proof it generalizes.

> Status, plainly (render as a callout, not a hero): *deployed dashboard + paid discovery + a booked pipeline.* The acting-agent and the why-loop ship next — by config on the spine, not a rebuild. Headline alt if you want it to *say* more: "Same shape, opposite industries: a financing deal and a credential file."

---

## Slide 5 — The moat

**Purpose**: The reframe. The moat is not the dashboard and not the outcome — it's the recorded *reasoning*. This is the load-bearing slide.

**Headline**: The moat isn't the outcome. It's the record of how you got there.

1. **The why-graph (depth, per vertical).** Every deal and every case leaves a causal trail — what changed, which lenders were rejected as bad matches, and *why.* Not "approved / declined," but the reasoning that led there. That's **git-blame for operational work**: proprietary per vertical, counterfactual-rich (it records the roads not taken), and it feeds back into scoring — so the product gets smarter with use and harder to replace. The outcome is just the label that makes the trail a training signal.
2. **The cross-party network (breadth).** This work is inherently multi-party and crosses org boundaries — a deal pulls in dealers, lenders, and lawyers; a credential pulls in providers, verifiers, and committees. The substrate sits on those handoffs, and a single agent identity is addressable across every vertical. Depth accrues per vertical; the network accrues across all of them.
3. **Config, not code.** A new vertical is connectors + a rubric + hands on the *same* spine — so margins rise as the substrate absorbs the work. A product company, not a services shop.

**Because the why-graph is the same primitive everywhere, operational agent work converges on one substrate — the way every codebase converged on git — instead of fragmenting into a winner per vertical.**

> Three points, then the bold convergence line as the payoff. **Honesty for the conversation, not the slide:** today the substrate spans the boundary on one side and hands a package across the other — the cross-party network is architecture + early evidence, not yet demonstrated at scale. Rehearse that distinction; don't claim mature network usage.

---

## Slide 6 — Why us

**Purpose**: Accelerators fund people first. Show build + sell, both battle-tested, and reframe forward deployment as a recruiting advantage.

**Headline**: Forward deployment brings us domain experts — as partners, not hires.

- **Simon — builds.** 20-year engineer building enterprise systems inside startups. Founding engineer at RealtyCrunch (acquired by The Real Brokerage, **NASDAQ: REAX**); co-founded RebelFi (stablecoin yield, live in production); earlier, solo-engineered an NFT launch that did **$1M.** Built the entire Tokenrip substrate — identity, memory, tooling, artifacts, CLI — **solo in six weeks**, MCP-native from day one.
- **Alek — sells.** Career go-to-market operator across enterprise, consumer, and institutional markets. Enterprise sales at **Gartner**; **$250K in policies written in six months**; founded and ran a real-estate company. Co-founded RebelFi; ran **300+ customer-development conversations** with banks and enterprises across four continents. Now finding the first customers for a category that doesn't exist yet.
- **The experts walk in.** The equipment-finance veteran is a build *partner* with the rolodex; AICAP brings 20 years of credentialing IP. The model turns domain experts into co-builders — a structural advantage, not a stroke of luck.
- **Velocity.** The substrate shipped in six weeks; Quintel's dashboard is deployed; AICAP paid discovery is done — by a tiny team.

> Two bios at equal weight (build / sell). Keep each to its highest-wattage tokens — the slide stands alone; the application's per-founder fields carry the full record.

---

## Slide 7 — The ask

**Purpose**: Tuned to what Speedrun actually provides (reach, talent, network — "capital is a commodity"). As an update, the milestones double as a trajectory signal.

**Headline**: What Speedrun accelerates.

- The substrate is built; the verticals are live and in build. **What we need is reach** — warm intros to healthcare and fintech buyers, senior engineering talent, and the capital to turn pilots into contracts.
- **Next two quarters:** (1) first acting-agent live, with the **why-loop capturing real reasoning and outcomes**; (2) convert AICAP discovery → paid pilot; (3) a second equipment-finance node onto the same spine.
- **The bet:** own the substrate every non-coding agent will need — the way GitHub owns it for code.

> Close on the bet as a full-width band.

---

## Render / production notes

- 7 slides, Purpose-annotated, static-PDF format — same render path as `../a16z-pitch-deck.md`.
- **Headline test:** the seven headlines alone should tell the whole story — demand → blocker → we're it → proof → why-graph moat → unfair access → ask. One idea per headline.
- **Honesty rule (repeat):** position + insight + velocity, never a finished moat; Quintel "deployed" = dashboard only (acting agent next/unsigned); customer is *a credentialing company*, not a hospital ($22K/day is the end-customer's pain in the space); EF partner anonymous (no VFI, confirm tenure); no tool-count claim until verified; reconcile Alek 300+ / Simon's title / REAX before send.
- Run all prose through `/humanizer` before rendering.
- Headline alternates and the full reasoning live in [[spine]] and the plan: `~/.claude/plans/ok-so-the-deal-quizzical-cherny.md`.
