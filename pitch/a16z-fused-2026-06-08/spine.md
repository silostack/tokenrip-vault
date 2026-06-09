---
title: a16z Fused Deck — Spine & Strategic Rationale (git-substrate + why-graph)
status: draft
created: 2026-06-09
owner: Simon
companion: ./deck.md
supersedes_consideration: ../a16z-repositioned-2026-06-06/ (accountability deck — kept for side-by-side)
plan: ~/.claude/plans/ok-so-the-deal-quizzical-cherny.md
---

# a16z Fused Deck — Spine

> The thesis, the why-graph reframe, the claim discipline, the objections, the sourced proof, and the form-field copy behind `./deck.md`. Written to be handed to a third party for a second opinion. The Glo deck and the accountability deck are left intact for a 3-way comparison.

## The core pitch

> Coding agents work because code already has a substrate — git, GitHub, CI: versioned history, branching, multiplayer review, and a record of not just *what* changed but *why.* Every other operational domain wants agents that *do the work*, but has no equivalent: the work has nowhere to be versioned, no one to review it with, and no record of how it reached the answer. Tokenrip is that substrate. We don't sell it cold — we forge it inside forward-deployed vertical products, starting with equipment finance and healthcare credentialing.

**Why it works:** it takes the single most legible fact in AI — coding agents have the best product-market fit — and extracts a defensible insight (the cause is *substrate*, not model quality), while describing the product Tokenrip actually is. The win-shape is category-defining: *the GitHub position for operational agent work.*

## The reframe that makes this fused deck stronger: the moat is the *why*, not the outcome

Earlier framings (including our own positioning and the accountability deck) located the moat in **outcomes** — the deal-graph of what closed, declined, funded. That under-sells it. **Git's power was never the final state; it's the causal history** — commit → diff → blame, the trace from a request to the change, *why* every line is the way it is. That is exactly what's missing outside code:

- An EF deal ricochets between broker, dealer, borrower, lender, and committee. Data accretes; some lenders get rejected as bad matches; terms get redlined. **Why** each of those happened is more valuable than the bare outcome — and today it's lost across three silos (the broker never even sees what funded or performed).
- A credentialing case mutates as it moves between provider, verification services, and committee. The result ("verified / deferred / approved") is recorded; the **reason** ("license lapsed because the physician changed states," "deferred pending board recert") lives in email and coordinator notes, not a structured ledger.

So the moat reframes **from a deal-flow moat (outcomes compound) to a reasoning-flow moat (the *why* compounds)** — git-blame for operational work. It is denser, more defensible, and counterfactual-rich (it records the roads not taken), and it feeds back into scoring so the product improves with use. The outcome remains essential — it's the *label* that makes the why-trail a supervised signal — and the product bet is that the substrate **captures the reason, not just the state change.**

This reframe also **repairs the sharpest objection to the git analogy** (see objection 1): the load-bearing transferable primitive isn't merge/diff (code-specific) — it's the versioned *why*.

**Validation from our own positioning** (`product/tokenrip/tokenrip-positioning.md`, Moat Narrative): *"You can export files. You can't export the web of provenance chains, lineage trees, interaction histories… GitHub's moat isn't code hosting. It's issues, PRs, reviews, CI integrations, dependency graphs."* The reframe surfaces a load-bearing idea the positioning already had.

## On "is this a private network, so no GitHub effect?"

The honest answer is two networks, kept distinct:
- **Public-commons network** (open source → strangers build on public repos): genuinely does **not** transfer to private finance/healthcare. We do not claim it.
- **Multi-party-workflow network** (one work item crosses several parties): **real and confirmed.** An EF deal and a credentialing case each pass through a chain of distinct parties with a real system boundary, and the substrate sits on the handoffs. Depth accrues per vertical; the network accrues across all of them.

Residual honesty: today the substrate spans the boundary on one side and hands a package across the other. The cross-party network is **architecture + early evidence, not yet demonstrated at scale.** This is the boldest, earliest claim in the deck — defend it as a *mechanism*, or soften "every operational domain" to a beachhead (open risk 2).

## Build state & claim discipline (the honest status, stated once)

- **Substrate:** built and exposed across REST / CLI / MCP. ⚠️ **No tool-count claim** ("101 tools") until verified — omitted from the deck on purpose.
- **Quintel (EF):** dashboard/collateral layer **deployed**; enterprise calls booked; the revenue-generating **acting agent is the next phase and unsigned.** "Deployed" never attaches to the acting agent.
- **Credentialing (AICAP):** **signed, paying customer; product in build.** Customer is **a credentialing company**, never "a hospital" — **name kept off the deck slides** (AICAP is the internal reference). The ~$22K/day is the *end-customer's* pain in the space.
- Claim **position + insight + velocity, never a finished moat** — healthcare is signed + in build, but the why-loop hasn't closed at scale in either vertical.
- **EF partner anonymous** — industry veteran, **never VFI** (current-employee conflict). Confirm tenure (20 vs 40 years); resolve IP/economics before send.
- **Reconcile:** Alek "300+" customer-dev conversations; Simon's RealtyCrunch title (founding engineer vs VP — use the accurate one); verify the REAX acquisition + ticker.

## The spine & the headline-only test

Beat order: **hook (2) → wedge (3) → proof (4) → business model (5) → moat (6)**, wrapped by title (1), team (7), and a vision close (8). Because the moat is (correctly) a *future* state, **proof is its own beat** — slide 4 is the present-tense evidence and carries the most weight. Headlines are stand-alone claims (each must read without the slide before it). Read in sequence, they tell the whole story:

1. Coding agents have git. For everything else, there's Tokenrip.
2. Coding agents work because code has git. *(Every other kind of work is still missing that layer.)*
3. Tokenrip is git for operational work.
4. If it works for a hospital and a lender, it works anywhere.
5. Git is free. The platform on top isn't. *(GitHub sold for $7.5B on top of it — we're building both.)*
6. We're building a data moat out of *why* — the reasoning behind every decision.
7. Forward deployment brings us domain experts — as partners, not hires.
8. *(close)* Code already runs on one substrate. Every other kind of work is next. → vision + demo.

*Proven demand across a huge market → blocked by one missing ingredient → we are that ingredient (git, the primitive) → proof it generalizes → how we make money (free protocol, paid platform) → why that becomes a moat → why we have unfair access → the vision.*

## Objections this deck pre-answers (rehearse 1 and 5 first)

1. **"Code is diff-able, mergeable, testable. Deals and credential files aren't. Why does a git-equivalent hold?"** Line-level merge is code-specific and not the load-bearing part. What generalizes is versioning, provenance, multi-party review, structured handoff, and the recorded *reasoning.* **The why-graph is the answer to this objection** — make it explicitly.
2. **"Isn't this ten vertical winners, not one GitHub?"** The why-graph is the same primitive everywhere, and the work is multi-party, so depth accrues per vertical while the network accrues across all. (Boldest claim — early; see risks.)
3. **"git is free — the value is GitHub/CI/the network."** Exactly — and it's now an explicit slide. Slide 3 claims the **git primitive**; slide 5 (business model) makes the value-capture move: git is free, **GitHub sold for $7.5B on top of it, we're building both** — free protocol + paid platform. The proprietary asset is the why-graph (slide 6), not the free protocol. The deck answers this head-on instead of dodging it.
4. **"Isn't this FDE consulting in a trenchcoat?"** Config-not-code (slide 4: "same primitives, zero rebuild" / "by config, not rebuild"): the spine is reused, margins climb (slide 5), verticals are products, not bespoke rebuilds.
5. **"Isn't the *why* just an audit log? Those already exist."** Existing audit logs are siloed per-system, unstructured, don't span parties, and don't feed the agent's decisions. A unified, structured, agent-readable why-graph across the whole multi-party lifecycle does not exist — that's the build.

## What the deck deliberately does NOT do

- **No TAM slide.** Speedrun bets on insight + founder + velocity; "all operational work" is the implicit TAM and a bottoms-up spreadsheet reads as seed-stage theater here.
- **No a16z thesis quote.** Parroting a fund's newsletter is a status-loser and the most echoed move in the pool.
- **No rename.** "Token" reads LLM-first to this audience; renaming a *live* submission introduces identity-discontinuity an update should never create. Banked for post-decision.

## Open risks to pressure-test (the second opinion is most valuable here)

1. **The cross-party "one substrate" claim is the boldest and earliest** — architecture + thesis today, not demonstrated network usage. Defend as a mechanism, or soften "every operational domain" to a beachhead.
2. **Two verticals = focus risk** for an accelerator. The answer: two *maximally different* verticals are the minimum proof the substrate generalizes (one is a point solution). Decide if that lands or if a single-vertical narrative is tighter.
3. **Unsourced/precision claims to lock:** the tool count (verify or omit), "deployed" = dashboard only, enterprise-calls-booked (substantiate), AICAP "MVP next" (confirm).

## Proof points (sourced)

| Proof point | Figure | Source |
|---|---|---|
| EF broker scale | $450M placed/yr across ~75 lenders (one broker) | `bd/calls/transcripts/ted-craver-2026-06-01.md` |
| EF dealer scale | $183M → $240–260M funded/yr, 620 transactions; wants to cut 31 lenders → 5–6 | `equipment-finance-domain-primer-2026-05-30.md` |
| EF deal band | small-ticket $10K–$2M; the $300K–$2M tier is "pretty messy" | `equipment-finance-domain-primer-2026-05-30.md` |
| EF broker economics | referral fees 2–4% of deal | `equipment-finance-domain-primer-2026-05-30.md` |
| EF willingness-to-pay | a large lender (anon) would pay "several hundred thousand annually"; $350K FTE-replacement math | `equipment-finance-domain-primer-2026-05-30.md` |
| Credentialing pain | ~$22K/day lost per stuck applicant; ~500 in process at one hospital; 8–12 wk cycle | `bd/calls/contacts/stephanie-williamson.md` |
| Credentialing high-end | orthopod: $15–40K/day; a 90-day delay = >$1M unrecovered | `bd/calls/contacts/stephanie-williamson.md` |
| Regulatory clock | NCQA primary-source-verification window: 120 days (since July 2025) | `bd/calls/contacts/stephanie-williamson.md` |
| Credentialing status | AICAP — **signed, paying customer**; $12K Phase 1 (design-partner pricing), product in active build | `bd/calls/contacts/stephanie-williamson.md` |
| Team | Simon: 20-yr eng, founding engineer at RealtyCrunch (acquired, NASDAQ: REAX), $1M solo NFT launch, substrate solo in 6 wks. Alek: Gartner, $250K policies/6mo, real-estate company, 300+ customer-dev conversations | `pitch/a16z-pitch-deck.md`; founder relevant-experience |
| Demo asset (closing slide) | Watch the demo → `youtu.be/U1U4ej2XW34` · `tokenrip.com` — a "show-me" artifact; **confirm the URL is current before send** | `a16z-deck.html` slide 08 |

## Form-field copy (a16z application)

**One-sentence pitch (10-word limit) — pick one:**
- "The collaboration substrate for AI agents doing real operational work." (9)
- "Git for everything agents do outside code." (7)
- "The substrate operational agents need — versioning, review, provenance, outcome capture." (9)

**Startup description (~100 words):**
> Coding agents have the best product-market fit in AI — not because models love code, but because code already had a substrate: git versions every change, review is multiplayer, and the history records not just what changed but why. Every other operational domain — finance, healthcare, legal, ops — wants agents that do the work, but has no equivalent. Tokenrip is that substrate. We don't sell it cold; we forge it inside forward-deployed vertical products. We have a signed, paying healthcare-credentialing customer (product in build now) and a live equipment-finance deployment (Quintel), built with a 20-year domain partner. Each deployment compounds a proprietary record of how every decision got made — a moat competitors can't copy.

**Traction commentary:** signed, paying customer in healthcare credentialing (product in active build); Quintel EF dashboard deployed with enterprise pipeline (acting agent next, unsigned); substrate built and exposed (REST/CLI/MCP). Frame as: position + insight + velocity — two maximally different verticals on one substrate, ~2 months from founding.

**Category:** B2B / Enterprise Applications (primary) · Infrastructure / Dev Tools (secondary).

## One-line summary for the evaluator

*Does the git-gap insight (slides 2–3) carry the deck; is the two-vertical proof (slide 4) strong enough given the acting-agent + why-loop hasn't fired yet; and is the moat (slide 6) — the why-graph per vertical plus the cross-party network — believable as a future state, for a pre-seed accelerator that funds insight, founders, and velocity over traction?*
