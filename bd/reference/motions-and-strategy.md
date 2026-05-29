# Motions and Strategy — Five-Motion Taxonomy

**Status**: Active reference (locked 2026-05-01, updated 2026-05-08)
**Companion**: [[audience-led-strategy/gameplan]] (Motion E roadmap, maintenance mode), [[audience-led-strategy/audience-led-gameplan]] (Motion E execution, maintenance mode)
**Origin**: Bean session 2026-05-01

> **2026-05-08 update**: Motion E moved to maintenance mode. Pain-proximity test added as second filter alongside architectural-requirement test. Both founders on vertical discovery sprint (May 8-22). See `bd/CLAUDE.md` for current state. The five-motion taxonomy and architectural-requirement test below remain the strategic foundation.

---

## Executive Summary

Five motions are structurally available. The recommendation:

- **Motion E (audience-led creator deployment) is primary, starting now.**
- **Motion D (builder-direct) runs in parallel as a substrate-density feeder.**
- **Motion B (vendor substrate) is deferred to 2027** — validated by TaxDome but premature without lighthouse cases and substrate maturity.
- **Motion C (inter-agent marketplace) is the eventual destination** that E + D + B build toward.
- **Motion A (firm-direct vertical pilots) is deprecated** — it fails the architectural test and structurally poisons B.

The recommended progression and the reasoning behind it is the next section. The per-motion analysis after that. Frameworks (the architectural-requirement test, analogies, risks) follow.

---

## Motion Roadmap — Why This Progression

The progression sequences five motions on a single principle: **build substrate density first, monetize concentration second, activate marketplace last.** Each motion is gated by what previous motions produce.

### The Universal Currency Is Substrate Density

Substrate density = published imprints + registered operators + accumulated shared memory + tooling-call volume + inter-imprint connections. It's the asset graph mounted agents run on. Every motion produces it, consumes it, or both:

| Motion | Produces density? | Consumes density? |
|---|---|---|
| E (audience-led) | High — each creator deploy unlocks an existing audience | Low |
| D (builder-direct) | Medium — many small imprints, low operator count per | Low |
| B (vendor substrate) | High once landed — every vendor's customer base joins the substrate | High — vendors won't license without lighthouse cases |
| C (inter-agent marketplace) | Generates network-effect revenue | Very high — needs hundreds of imprints + composition primitives |
| A (firm-direct) | Low — pilots produce one workspace each, no public imprints | None — but creates competitive signal to B's buyers |

The progression below sequences motions by **what produces density vs. what needs it.** Motions that produce go first; motions that need it activate when it's there.

### Why E Starts Now

E is the only motion where the architecture is load-bearing. Every layer of mounted agents (portability across runtimes, versioned imprints, shared memory, BYO economics, observability) is required to deliver a creator-with-audience imprint. No alternative wedge passes the test as cleanly — that's the "smallest commercial unit that requires the architecture" framework below.

E also produces *outsized* density per deploy. A creator deploy doesn't add one operator; it unlocks an existing audience. Twenty mid-tier creators averaging 150K audience at 3% mount rate = 90K registered operators. That's the curve fundraising sells against.

### Why D Runs in Parallel (Not Sequential)

D and E share the same substrate (asset publishing, memory, tooling tiers). Building substrate features for E inherently serves D. The funnel is also free: Series 3 blog is already in flight as a category-establishment artifact — it doubles as the builder-direct funnel without additional outreach cost.

D produces density differently from E (many small imprints, not a few big audiences). The two compound: E provides operators-per-imprint volume; D provides imprint-count diversity. Motion C requires both shapes of density to activate, so running D in parallel from day 1 saves 6+ months on the C timeline.

D also has zero conflict with B — its buyers (independent builders) aren't vertical SaaS competitors. So parallel-run is structurally safe.

### Why B Is Deferred to 2027 (With a Bottom-Up Accelerant)

B is real. The TaxDome learnings (2026-04-29) validated it: vertical SaaS CTOs are starting 6-18 month builds of agent platforms right now and would license a substrate that gets them to market in 6 months instead of 18. The deal sizes are 6-7 figures; the distribution leverage is extreme (one vendor → thousands of customers).

But B is not actionable today for three reasons:

1. **No lighthouse cases.** Vendors won't license a substrate that has no production proof points. E + D produce those over 12-18 months.
2. **Substrate not enterprise-ready.** Motion B requires white-label theming, multi-tenant isolation, vendor billing, SOC2 posture. None of these exist; none of them are on the Motion E critical path.
3. **Sales cycle math.** Enterprise vendor sales cycle is 6-12 months. Activating B now means founder time on cycles that won't close in 2026 — and won't close in early 2027 either, because the substrate isn't ready.

Activation triggers (per below): 5+ live Motion E lighthouse imprints + multi-tenant capability shipped + named CTO buy-intent. Until then, passive monitoring only (job-board signals from vertical SaaS vendors hiring AI engineers).

**Bottom-up accelerant (identified 2026-05-07).** The original B activation path is top-down: cold-outreach CTOs, prove substrate maturity, close enterprise deal. A complementary bottom-up path exists through the **AI Enabler** ICP (see [[icps]]): internal company builders who deploy agents on Tokenrip for their coworkers. When an AI Enabler deploys internally using Tokenrip, they become the bottom-up advocate for a vendor substrate license — the same consumerization-of-IT pattern (Slack, Dropbox, GitHub) applied to agent infrastructure. This doesn't change B's 2027 timeline (the substrate still needs enterprise features), but it suggests Motion D signal (AI Enablers showing up organically) could produce bottom-up buy-intent that accelerates B's activation without top-down CTO cold outreach.

### Why C Is Eventual, Not Near-Term

C is the long-term destination — agents calling other agents through the substrate, "multiplayer" agents, agent-to-agent commerce without orchestration frameworks. The architectural argument is strong (see [[../content/published/agent-alignment-drift-draft]]) and Tokenrip is uniquely positioned for it.

C requires substrate density (100s of imprints) + composition primitives (one imprint can call another) + capability discovery (operators find which imprints solve their problem) + inter-agent billing. None of these exist in 2026. E + D + B build all of them over 18-24 months. C activates when prerequisites are real, not on a calendar.

C is what fundraising buys time to build. It is not what fundraising sells.

### Why A Was Deprecated (Not Just De-Prioritized)

Motion A would produce revenue but it actively damages Motion B's pipeline. Firm-direct pilots executed under the Tokenrip brand on top of vendor data look like exactly the wedge-and-replace pattern Ilya at TaxDome named in the call:

> "Everyone's going to try and wedge in and build like a tool to get in there and then they're going to like build the rest of your product effectively. Everyone's going to be friendly with you and then they're going to steal your clients."

Vendors evaluating a Motion B substrate license while observing active Motion A firm pilots see competitive activity, not complementary. Running A and B in parallel doesn't seed graduation from one to the other — it poisons B's pipeline before it opens.

A also fails the architectural-requirement test (a regular SaaS could deliver a $25K vertical pilot). Combined with the B-poisoning effect, A is structurally net-negative for the path to category formation. Hence: deprecated, not parallel.

### Activation Triggers

| Motion | Trigger to activate / advance |
|---|---|
| E | Already active. Continues until decision point in [[gameplan]] §"Decision Points." |
| D | Already passively active via Series 3 blog. Active sales motion ramps when marketplace UX is shipped (~week 8). |
| B | 5+ Motion E lighthouse imprints live + multi-tenant capability shipped + named CTO buy-intent (top-down) OR AI Enabler organic adoption producing bottom-up demand (see [[icps]] §"AI Enabler"). Estimated 2027. |
| C | ≥100 published imprints + inter-imprint composition primitives + capability discovery + billing for inter-agent calls. Estimated late 2027 / 2028. |
| A | Three conditions must all hold: Motion E stalls, substrate not enterprise-ready for B, short-runway pressure forces revenue-per-deal optimization. Unlikely. |

### What Triggered the Re-Evaluation

Three things converged in the 2026-05-01 Bean session:

1. **The TaxDome learnings (2026-04-29) validated Motion B, not Motion A.** The "missed pitch" was named in the learnings doc but the firm-direct gameplan never absorbed it. Tokenrip walked into a vendor-substrate validation conversation with an orchestration-layer pitch and walked away with the wrong product confirmation.
2. **The wedge question was wrongly framed.** "How do we sell mounted agents?" produces three equally valid answers with no internal ranking. "What's the smallest commercial unit that requires the architecture?" imposes a structural ranking that immediately reorders the motions.
3. **The capital assumption (YC application in days, a16z to follow) inverted the optimization function.** Pre-capital optimization is "survive, validate." Post-capital optimization is "demonstrate category, produce a curve." The firm-direct gameplan was optimized for the wrong function.

---

## The Five Motions

Tight per-motion summaries. Full execution detail for Motion E lives in [[audience-led-gameplan]].

### Motion A — Firm-Direct Vertical Pilots (DEPRECATED)

**How it works.** Sell a $25K-$50K paid pilot to an end firm in a vertical (tax, real estate, insurance) where Tokenrip is the application layer for an AI-augmented existing workflow. Buyer = firm partner / ops lead.

**Main analysis.**
- **Architectural test: FAILS.** Any AI-workflow SaaS could ship the same pilot. Mounted-agent properties (portability, versioning, BYO economics, observability) are not load-bearing.
- **Compatibility: HOSTILE to B.** Firm pilots = wedge-and-replace pattern. Poisons vendor pipeline.
- **ACV / cycle / leverage:** $25K / 6-8 weeks per deal / no distribution leverage.
- **Substrate density contribution:** essentially zero.
- **Status:** preserved in [[firm-direct-strategy/]] as reference. Reactivation conditions in the activation table above.

### Motion B — Vendor Substrate (DEFERRED TO 2027)

**How it works.** License Tokenrip as the underlying substrate for vertical SaaS vendors building their own agent platforms. White-label, invisible, vendor-branded. Buyer = CTO / VPE at vertical SaaS vendor with CEO sign-off.

**Main analysis.**
- **Architectural test: PASSES** for vendors who understand the substrate model. Few do in 2026; market grows in 2027.
- **Compatibility: native with C, native with E, hostile to A.**
- **ACV / cycle / leverage:** $250K-$1M+ / 6-12 months / extreme distribution leverage (one vendor → thousands of customer deployments).
- **Substrate density contribution:** high once landed (each vendor's customer base joins the substrate).
- **Pricing models** (to be stress-tested): per-customer pass-through, flat platform license, or revenue share on tools called.
- **Substrate work required:** white-label theming, multi-tenant isolation, vendor-controlled imprint visibility, vendor billing, SOC2 posture. Different from E's critical path.
- **The verbatim "missed pitch"** for activation:
  > "You're about to spend 6-18 months building agent identity, skill packaging, asset versioning, scheduled runs, capability tokens, BYO API key plumbing, and a skills marketplace. Every primitive in that build is something we already do. Your engineers ship the tax-specific skills on top of our substrate. You get to market 6 months earlier, you keep the walled garden, you control what's exposed at the primitive level. We're under the waterline. Your customers never see us."

### Motion C — Inter-Agent Marketplace (EVENTUAL)

**How it works.** Marketplace where mounted agents call other mounted agents through the Tokenrip substrate. Agents compose through the platform's tooling surface — no orchestration frameworks. Buyer = eventually agent builders extending capabilities, and operators composing multi-agent workflows.

**Main analysis.**
- **Architectural test: PASSES architecturally** — requires every mounted-agent layer plus inter-imprint composition. **FAILS commercially today** — buyers don't exist.
- **Compatibility: native with everything; the destination of the progression.**
- **What needs to be true:** ≥100 published imprints + composition primitives + capability discovery + inter-agent billing. None exist in 2026.
- **Substrate density contribution:** consumes density (it's the destination), then generates network-effect revenue.
- **Architectural argument:** see [[../content/published/agent-alignment-drift-draft]] — Tokenrip's shared-state model is structurally what multiplayer agents require.
- **Status:** what fundraising buys time to build. Not what fundraising sells.

### Motion D — Builder-Direct (PARALLEL FEEDER)

**How it works.** Sell mounted-agent infrastructure (tooling tiers, marketplace presence, deployment skills) directly to independent agent builders — OpenClaw graduates, Custom-GPT power users, Cursor agent builders, prompt-engineering practitioners. Buyer = solo or small-team agent builders who already pay for inference.

**Main analysis.**
- **Architectural test: PASSES.** Builders specifically want what hosted agent platforms can't give them.
- **Compatibility: native with everything. Feeds C via density.**
- **ACV / cycle / leverage:** $0.1-1K/month per builder / days to weeks / volume play.
- **Substrate density contribution:** medium-high (many small imprints, low operator count per).
- **Distribution:** Series 3 blog is the funnel. No additional outreach motion required.
- **Pricing model:** tooling tiers (matches BYO economics natively).

### Motion E — Audience-Led Creator Deployment (PRIMARY)

**How it works.** Experts and creators with engaged audiences (50K-500K followers across YouTube, Twitter, Substack, newsletters, podcasts, LinkedIn) deploy their personal-brand imprints on Tokenrip. Their audience mounts the imprint in their preferred runtime and pays for their own inference. The creator collects on tooling-tier upgrades from their audience's engagement.

**Main analysis.**
- **Architectural test: PASSES MOST CLEANLY.** Every layer of mounted agents is load-bearing:
  - *Without portability* — audience uses different tools (ChatGPT, Claude, Cursor); a Custom GPT alone misses half the audience.
  - *Without versioned imprint* — drift breaks personal-brand contract.
  - *Without shared memory* — agent doesn't get smarter; collapses to "system prompt with a name."
  - *Without BYO economics* — creator can't subsidize 2M followers' inference.
  - *Without observability* — creator won't put their name on a black box.
- **Compatibility: native with everything; the direct enabler of B and C.**
- **ACV / cycle / leverage:**
  - Mid-tier: free white-glove deploy + revenue share on tooling-tier upgrades. Per-imprint MRR grows with audience engagement.
  - Hero: bigger co-marketing arrangement, possibly cash advance against revenue share post-capital.
  - Cycle: 1-2 weeks (mid-tier), 3-6 months (hero).
  - Leverage: extreme — audience IS the distribution.
- **Substrate density contribution:** highest of any near-term motion. Each deploy multiplied by audience size.
- **ICP and execution:** see [[audience-led-gameplan]].

---

## The "Smallest Commercial Unit" Framework

The original wedge question was *"How do we sell mounted agents?"* That produces three equally valid answers (firm pilots, vendor substrate, marketplace) with no internal ranking.

The sharper question: *"What's the smallest commercial unit we can sell today that requires the full mounted-agent architecture to deliver?"*

That question imposes a structural ranking. Motions where the architecture is overkill are wedges into adjacent categories — they sell adjacent products that happen to use Tokenrip. Motions where the architecture is load-bearing are wedges into the category Tokenrip is creating.

| Motion | Architecture required? | Verdict |
|---|---|---|
| A — Firm-direct | No | Regular SaaS could ship the pilot |
| B — Vendor substrate | Yes (for vendors who understand) | Real wedge but small market in 2026 |
| C — Inter-agent marketplace | Yes | But buyers don't exist yet |
| D — Builder-direct | Yes | Builders want what hosted platforms can't offer |
| E — Audience-led | Yes (most cleanly) | Every layer load-bearing |

**Generalizable principle.** When you have a category-defining architecture, the right wedge is not the easiest sale. It is the smallest commercial unit that requires every layer of the architecture to deliver. That wedge proves the category exists. Wedges that don't require the architecture are wedges into adjacent categories — they may produce revenue but they do not produce category formation.

This pattern is now captured in [[../agents/bean/insights]] for cross-project use.

---

## Analogies and Precedents

The original concern that prompted the re-evaluation was a fear of being "the Google to someone else's OpenAI" — having the architectural insight but missing the commercial play. **The lesson is the opposite of what that framing suggested.**

- OpenAI didn't sell "transformers." They sold ChatGPT — the simplest user-facing wedge into the most powerful version of the technology.
- AWS didn't sell "the cloud." They sold S3 and EC2.
- Stripe didn't sell "the API economy." They sold payment processing for developers.

The pattern: every category-defining product has a moment where the founders feel "the idea is too big for any current sales motion." The answer was never to invent a new motion that matches the idea's scale. The answer was always to ship the smallest commercial unit and let the category form around it.

**Applied here:** Tokenrip already has the architectural insight (mounted agents, [[../product/tokenrip/mounted-agent-model]]). The fear "am I missing what to sell" is the right fear at the wrong scale. The answer is not "sell mounted agents" but "ship the smallest unit that requires mounted agents." That unit is creator imprints. The category will form around the deploys.

**Generalizable principle:** architectural insight ≠ sales motion. Categories don't get bought; products do.

---

## Risks and Blindspots

These apply across all motions. They belong attached to the strategy, not buried in execution.

1. **Creator economy framing trap.** "Creator monetization for AI experts" gets filed under Patreon/Substack (unfavorable comparable benchmarks). "Agent commerce substrate with creator-direct wedge" gets filed under AWS/Stripe (favorable). Lead with infrastructure framing externally. See [[yc-strategy]] §"Infrastructure vs. Creator-Economy Framing Trap."
2. **Vanity metrics risk.** Deploy count without engagement metrics is fundraising vanity, not PMF. Real metrics: operators per imprint, return rate, memory growth, tooling-tier conversion. Defined in [[kpis]].
3. **Quality control overhead.** Variable creator quality drags platform reputation. Editorial standards required before public deploys. Hard rule in [[gameplan]] §"Hard Rules."
4. **Hero-tier disappointment.** No Garry-Tan-class hero in 90 days = missing marquee story. Mitigations: lower the bar (200K-follower niche-famous = valid hero) OR over-invest in mid-tier so hero isn't the headline.
5. **YC/a16z assumption risk.** If capital doesn't land, no $25K firm-pilot revenue exists because A was cancelled. Mitigation: motion is right regardless. Firm-direct $25K pilots aren't a fundable path anyway. Detail in [[operations-and-hiring]] §4.
6. **Substrate scope creep.** Marketplace UX + creator dashboard + "build an agent" wizard + creator billing is a lot. Rank ruthlessly. First 10 deploys can be Simon-assisted.
7. **Per-creator service overhead.** White-glove deployment doesn't scale linearly. Need self-serve "build an agent" skill by ~deploy 25.
8. **Exclusivity demands.** Refuse at mid-tier (kills volume play). Accommodate at hero with 12-month max, narrow scope.
9. **TaxDome n=1 problem for Motion B.** One vendor data point. Petar was friend-of-friend, not buyer-routed. Worth more vendor conversations before activating B in 2027.
10. **Builder portability undermines lock-in.** Builders can host imprints elsewhere and only use Tokenrip for tools. Acceptable for revenue (tools are paid) but undermines marketplace network effects. Watch this once Motion D scales.

---

## Cross-References

- **The roadmap:** [[gameplan]]
- **Motion E execution detail:** [[audience-led-gameplan]]
- **What we measure:** [[kpis]]
- **YC application + positioning:** [[yc-strategy]]
- **Capital + hiring + this-week:** [[operations-and-hiring]]
- **Architectural source material:** [[../product/tokenrip/mounted-agent-model]] and [[../product/tokenrip/mounted-agent-synthesis]]
- **Origin session:** [[../agents/bean/sessions/2026-05-01]]
- **ICP taxonomy:** [[icps]] — who buys what and why, ICP × motion matrix, ICP × experiment matrix
- **Cross-idea pattern (bean insight):** [[../agents/bean/insights]] — "Smallest commercial unit that requires the architecture"
