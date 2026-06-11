# Tokenrip — a16z Speedrun Deck (Fused: git-substrate + why-graph)

**Status**: Draft v5 (deck-doctor pass folded in — velocity-first proof slide, memory/why-thread from slide 2, moat moved ahead of business model)
**Created**: 2026-06-09
**Length**: 8 slides
**Companion**: [[spine]] (thesis, the why-graph reframe, the v5 deck-doctor changes, claim discipline, objections, sourced proof, form-field copy)

> Application deck for **a16z Speedrun** (weights insight + founder + velocity over TAM); also a **live submission update**, so it reads as *the same company, sharper* — not a pivot. Each slide opens with a **Purpose** line (internal). The headline is a stand-alone claim; the body proves it in a true skim (**≤3 bullets, each ≤~12 words, bold the key term**). Inline `>` notes are render direction.
>
> **Honesty rule** (claim *position + insight + velocity*, never a finished moat — the acting-agent + why-loop hasn't fired):
> - **Quintel (EF):** dashboard layer **deployed**; the revenue **acting agent is next + unsigned** — **no paying EF customer yet.** Never attach "deployed" to the acting agent.
> - **Credentialing:** a **signed, paying customer** (a credentialing company — *not* a hospital; the word "hospital" stays off every headline); **product in build.** **Name kept off the slides** (internal: AICAP). ~$22K/day is the *end-customer's* pain in the space.
> - **EF partner anonymous** — industry veteran, **never VFI.** Tenure confirmed 2026-06-09 ("20-year" stands).
> - No tool-count claim (still unverified — stays omitted). Verified 2026-06-09: Alek "300+", Simon's RealtyCrunch title (founding engineer), REAX.
> - **Velocity math verified 2026-06-09:** "two months" (founding → AICAP signature) and "six weeks" (substrate build) are confirmed headline claims.

---

## Slide 1 — Title

**Purpose**: Name the company and compress the whole pitch into one line. Nothing else.

**Company name** (hero): Tokenrip

**Tagline**: Coding agents have git. For everything else, there's Tokenrip.

> Wordmark + tagline only — no subline, no founder credit. Render "For everything else, there's Tokenrip." in the accent color. Footer: founders · tokenrip.com.

---

## Slide 2 — The insight

**Purpose**: The insight *and* the prize, as a stand-alone claim. The *memory* mechanism is the insight; it plants the why-thread that pays off on slide 5 — and it absorbs the "coding agents work because of training data, not git" objection instead of inviting it.

**Headline**: Coding agents work because code has a memory.
**Second clause** (accent): Everything else forgets.

- **Code records everything** — every change, every review, every *why*: git, PRs, blame.
- **That record is why agents work there** — it's the substrate *and* the training corpus.
- **Finance, healthcare, ops:** the work happens in email and silos, then it's forgotten.

**Whoever gives operational work a memory owns the position GitHub owns for code.**

> Two-clause headline, second clause in accent (reuse the old deck's `.h1`/`.alarm` treatment). The prize line renders as an emphasized full-width band, not a bullet. v5 change: headline no longer repeats the cover ("code has git" → "code has a memory") — the cover owns the git line; this slide owns the *why it works* claim.

---

## Slide 3 — The substrate

**Purpose**: Name what Tokenrip is (stands alone) and how it spreads. Five words of category claim — the best headline in the deck stays.

**Headline**: Tokenrip is git for operational work.

- **What it is:** versioning, review, provenance, permissions, outcome capture — live across REST, CLI, MCP.
- **It works like git:** artifacts → commits · forking → branches · review → PRs · **lineage → blame.**
- **How it spreads:** we forward-deploy into a vertical and ship the agent; the substrate forms underneath — the Palantir Foundry playbook.

> Emphasize **lineage → blame** — it sets up the moat (now slide 5). v5 tense fix: "ship the agent" (the deployment motion, stated as the model) — never "ship the acting agent" in a way that implies it has shipped; slide 4's callout owns the honest status.

---

## Slide 4 — Proof

**Purpose**: The only present-tense evidence — it carries the most weight, so it leads with the deck's best true fact: *velocity*. Generalization ("two industries that share nothing") moves to the third bullet, where it's proven rather than asserted.

**Headline**: Two months in: a paying healthcare customer and a live finance deployment.

- **Healthcare credentialing — signed, paying, in build:** an agent that chases verifications across provider, verifiers, and committee. *Today the trail lives in email, not a ledger.*
- **Equipment finance (Quintel)** — **live dashboard**, built with a 20-yr industry partner; lenders in active pipeline. Next: an agent that pre-qualifies deals across 5+ parties and 3 silos. *The broker never learns what funded.*
- **Two industries that share nothing, one substrate** — same primitives, zero rebuild: extraction, rubric-as-config scoring, operator review, provenance logging.

> Status, plainly (callout, not hero): *a signed, paying healthcare customer (in build) + a live equipment-finance deployment with a domain partner and active pipeline; the acting-agent + why-loop ships next — by config, not rebuild.* The two italic punch-lines are a deliberate parallel ("lives in email" / "never learns what funded") — keep them rhyming. v5 changes: headline is now the velocity-traction claim (was a hypothetical conditional that said "hospital" — claim-discipline violation — and "works," which overstated in-build products); each vertical bullet now names the agent's *job* (chase verifications / pre-qualify deals) so a partner can describe the product, not just the metaphor. Honesty: "in build" and "Next:" are load-bearing — they stay attached to the agent in both bullets. "Two months" verified 2026-06-09.

---

## Slide 5 — The moat

**Purpose**: The reframe, now flowing directly out of slide 4's punch-lines ("lives in email" / "never learns what funded" → *we record the why*). The moat isn't the dashboard or the outcome — it's the recorded *reasoning.* Load-bearing slide.

**Headline**: Every decision we touch leaves a record of *why.*
**Second clause** (accent): No one else captures it.

- **The why-graph:** what changed and *why*, per deal, per case — git-blame for operational work. It can't be rebuilt from the outside.
- **Not an audit log:** logs are siloed, unstructured, single-party. The why-graph spans the handoffs and feeds the agent.
- **It compounds:** reasoning feeds back into scoring — smarter with use, harder to leave.

**Because the *why* is the same primitive everywhere, operational work converges on one substrate — the way every codebase converged on git.**

> Three points, then the bold convergence line. v5 changes: moved ahead of the business model so slide 4's punch-lines feed straight into it; headline drops "data moat" (stock VC vocabulary) for the concrete claim; the audit-log pre-answer (spine objection 5) is now on the slide. **For the conversation, not the slide:** the cross-party network is architecture + early evidence today, not demonstrated at scale — don't claim mature network usage.

---

## Slide 6 — Business model

**Purpose**: Answer "how do you make money?" — and turn "git is free" into the pitch (free protocol, paid platform: the GitHub model). Reads better *after* the moat: proof → what it compounds into → how we charge for it.

**Headline**: Git is free. The platform on top isn't.
**Second clause** (accent): GitHub sold for $7.5B on top of it — we're building both.

- **Now — vertical builds.** Customers pay us to build the agent; each build hardens the substrate.
- **Next — the platform.** Free to publish and collaborate; paid for teams, governance, enterprise.
- **The edge — we don't pay for inference.** Customers bring their own models; margins expand with scale.

> Two-clause headline (accent second clause). The $7.5B Microsoft/GitHub figure is verified (2018). v5 fix: "customers bring their own models" (was "operators" — a term that appeared nowhere else in the deck). No payoff band — the headline carries it.

---

## Slide 7 — Why us

**Purpose**: Accelerators fund people first — and the velocity claim *is* the team claim. The headline states what was done; the bios prove who did it.

**Headline**: Six weeks to build the substrate. Two months to a paying customer.

- **Simon builds.** 20-yr engineer; founding engineer at RealtyCrunch (acquired, **NASDAQ: REAX**); **$1M** solo NFT launch. Built this substrate **solo in six weeks.**
- **Alek sells.** Enterprise sales at **Gartner**; **$250K** in policies in six months; **300+** customer-dev conversations across four continents.
- **The experts walk in.** Forward deployment recruits 20-year domain veterans as **partners, not hires.** We don't hire domain expertise — it co-builds with us.

> v5 changes: headline is now the velocity claim (was "Forward deployment brings us domain experts" — a strategy claim with no founders in it, on the one slide whose job is to sell the people); the FDE-recruiting point drops to bullet 3, where it's a strong unfair-access token. The old stat-row is now redundant with the headline — replace it with a single understated status line if the layout wants a footer: *substrate live (REST/CLI/MCP) · Quintel dashboard live · healthcare customer signed + paying.* Two bios at equal weight (build / sell); each kept to its highest-wattage tokens — the slide stands alone, the application's per-founder fields carry the full record. Verified 2026-06-09: "two months," Simon's title, REAX.

---

## Slide 8 — The close

**Purpose**: Close on the vision — inevitability, not a tagline repeat. Hand them a demo and a way to reach us.

**Closer** (full-width hero): Code already runs on one substrate. **Every other kind of work is next.** *(second line in accent)*

**Support line**: We're building the one they all converge on.

**Links**: ▶ Watch the demo (`youtu.be/U1U4ej2XW34`) · tokenrip.com · team@tokenrip.com

> Vision-forward close — **no tagline repeat** (the tagline owns the cover) and **no ask** (for an accelerator *application*, a pure-vision close reads more confident; the ask lives in the spine's form-field copy). **Demo URL confirmed current 2026-06-09.**

---

## Render / production notes

- 8 slides, Purpose-annotated, static-PDF format. Rendered artifact: `../../a16z-deck.html` (spec-sheet redesign — IBM Plex, mono rails, one cobalt accent); render to PDF via headless Chrome `--headless=new --print-to-pdf`. **The HTML must be re-rendered from this v5 markdown** — slides 2, 4, 5/6 (swapped), and 7 all changed.
- **Cold-reader headline test (v5 sequence):** (1) Coding agents have git. For everything else, there's Tokenrip. → (2) Coding agents work because code has a memory. Everything else forgets. → (3) Tokenrip is git for operational work. → (4) Two months in: a paying healthcare customer and a live finance deployment. → (5) Every decision we touch leaves a record of *why.* No one else captures it. → (6) Git is free. The platform on top isn't. → (7) Six weeks to build the substrate. Two months to a paying customer. → (8) Code already runs on one substrate. Every other kind of work is next. Each stands without the slide before it; none repeats the cover.
- **Body rule:** ≤3 bullets/slide, each ≤~12 words, bold the key term, at most one italic punch-line (Slide 4's parallel pair is the deliberate exception).
- **Honesty rule (repeat):** position + insight + velocity; Quintel "deployed" = dashboard only (no paying EF customer yet); credentialing customer is **signed + paid + in build**, *a credentialing company* not a hospital — **"hospital" stays off every headline**; **name kept off the slides** (internal: AICAP) ($22K/day = end-customer pain); EF partner anonymous (no VFI, confirm tenure); no tool-count claim until verified; Alek 300+ / Simon's title / REAX reconciled; **"two months" and "six weeks" verified 2026-06-09.**
- Run all prose through `/humanizer` before rendering. Headline alternates + full reasoning: [[spine]] (§ "The v5 deck-doctor pass") and `~/.claude/plans/ok-so-the-deal-quizzical-cherny.md`.
