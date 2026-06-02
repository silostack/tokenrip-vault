# Closer — Deal & Bid Patterns

> Cross-deal and cross-bid lessons accumulated over time. Closer updates this when a new pattern emerges.

## Stall Patterns

Patterns that signal a deal or bid is decaying. When Closer sees one, it calls it out on sight and prescribes the follow-up immediately.

- **The silence-after-yes.** Prospect or client signals interest, then days pass with no follow-up from our side. The deal decays in that gap. Closer's response: send the follow-up *now*, with a dated next step. (Inherited from the RebelFi "ForumPay pattern.")

## Winning Patterns

Proposal hooks, framings, and moves that have won work. _(Populated as evidence accumulates.)_

- _(none yet — no replies confirmed)_

## Proposal Anti-Patterns

Moves that feel persuasive but backfire in cold proposals.

- **Hunger tells.** Case-study discounts and free bespoke POCs come from the same impulse — "give them a reason to pick me." Both backfire cold: they signal low value of our time and shift the proposal off the buyer's outcome (§2). The live link (tokenrip.com) is the no-risk proof that needs no discount. Bespoke/discounted offers wait for the call; paid discovery (§6) is the right de-risk for bigger deals.
- **Org-structure labels.** "Agency" reads expensive and impersonal; "startup" reads distracted and maybe-gone. Skip both. First-person voice + a shipped product as proof delivers the warmth and the credibility with zero labels.
- **Stating the obvious as insight.** Lines like "the estimating expertise lives in your data, not in me" or "the hard part is getting the data structured" read to a domain expert as "no sh*t, that's why I posted the job." Telling the buyer his own thing, even when true, wastes the line and slides into the §3 teacher posture. Prove comprehension through a specific, useful *proposal* ("here's what I'd do first") never through reflecting his problem back at him. This is the §3 no-ceremony rule in action: no narrating the post back, no difficulty diagnosis dressed up as insight. The tell is shape-shifting — it recurs as "the highest-risk part", "the hardest part", "the crux of the job", and as guessing facts about the buyer's operation ("your set is fixed... presumably pretty small"). Scan every draft for any sentence whose subject is the client's business or project rather than your own work.
- **The credential swap.** When a screening question asks for a specific built example you don't have ("describe an agent you built that did X"), softening the truth into an adjacent claim ("I've built pipelines that do X" when the reality is "I've experimented with X") is a landmine. A sharp screener notices the swap, and the call exposes the gap, killing the deal *and* the reputation. The winning move on an unanswerable screening question: explicit honesty about what you haven't done + a real adjacent credential (platform built, architecture understood) + a structural de-risk offer. Most competitors inflate; honest-with-a-real-credential is contrarian and trust-building. Eyes open — some buyers auto-filter honesty, but those weren't good clients.

## Pricing & Milestones

- **De-risk comes from structure, not from a low price.** The instinct on a $10K fixed job is to make the first milestone tiny ($0, then $1K) so the buyer says yes. Wrong lever. A serious buyer is committing to the full amount conceptually regardless; a cheaper first milestone doesn't de-risk him more, it just devalues the work and signals hunger (same family as the free-POC tell). The de-risk the buyer actually feels comes from the *shape*: a small first milestone, a kill-switch, proof on his real data before the big commit. Price milestone 1 *fairly* and frame it as "deliberately small — a cheap, fast look at the highest-risk part."
- **The riskiest-scope milestone should never be the cheapest.** Milestone 1 is where the unknowns live (how messy is the real data?). If it's underpriced *and* carries the most uncertainty, every overrun gets eaten. A fairly-priced first milestone is also fixed-price insurance: if the sample reveals a nightmare, that's learned cheaply, and re-scope happens before the next milestone instead of mid-commitment.

## Prospect Requests A Paid Discovery — Take It Fast (the AICAP pattern)

**Seen in:** Stephanie / AICAP — after the proposal landed, she asked for a paid "integration discovery" before committing to the MVP build ("I'd like to discuss the discovery scope so you can give me a proposal for that").

**What it really means:** Not a stall — a *smaller, faster, lower-risk first yes.* A domain-expert buyer de-risking her own build before spending real money. The first dollar is the hardest; a paid discovery clears it and makes the bigger build easier, not harder. It's the forward-deployed-engineer playbook in its purest form: customer names the problem, you sell the discovery, the deliverable is reusable substrate.

**The counter (which is to say yes, fast):**
- Reply same-day with an enthusiastic yes; reinforce her instinct — her technical partner independently agreeing it's the smart move builds trust.
- Scope it tight: one deliverable (a map/report + revised build scope), one timebox (1-2 wks), one fixed fee ($3.5K-$5K range at this stage). Deliverable is hers to keep either way.
- Hold a credit-toward-build sweetener in reserve — deploy only if she balks on price.
- Guard against: free-discovery creep (the scoping call is NOT the discovery), timeline evaporation (keep the build window alive), and scope swamp (map only what the design partners actually run).

## Structural Anchors For Risk-Removal Deals

When a deal is intentionally structured for maximum customer risk-removal (e.g. full no-conditions refund, design-partner pricing well below standard floor), the close-rate gain is real but two failure modes show up:

1. The deal becomes free work (customer takes delivery, refunds, walks).
2. The discount is unjustified (we gave up margin without buying anything strategic).

Three structural anchors compensate without softening the customer-facing risk-removal:

- **Files-gate (or equivalent input-gate).** The build doesn't start until the customer delivers a meaningful input — anonymized files, workflow walkthroughs, integration credentials, etc. This is a low-friction customer commitment that proves intent. No input = no work begun = no money owed = no exposure. Used on Luai El Haj proposal 2026-05-20 (20 files in week 1 gates the build).
- **Reference rights signed at kickoff, persistent past refund.** The economic exchange for the discount is the rights, not the cash. Logo, case study, reference-call commitments, and anonymized pattern reuse all signed before build starts and persist for 12 months even if the customer exercises a refund. Cash refund does not extinguish the rights. Template at `bd/firm-direct-strategy/reference-rights-letter-template.md`.
- **Substrate-first work sequencing.** Sequence the build so reusable substrate (vertical workflow templates, document recognition patterns, discrepancy schemas) gets produced *first*, and bespoke customer-specific tuning happens *last*. If the customer refunds mid-pilot, Tokenrip keeps the substrate; only the bespoke layer is lost. The substrate is what makes the next pilot cheaper.

These anchors keep the deal commercially honest at full customer-facing risk-removal. They are non-negotiable when a deal goes below the standard floor.

## Land-and-Expand Framing

When discovery surfaces two value props in the same buyer — one immediate-but-thin (their own firm), one architecturally-aligned-but-speculative (a future venture they're building) — the wrong move is two parallel sales tracks. The right move is to fold the architecturally-aligned conversation into the same product as **Phase 2**, with Phase 1 priced for close-rate, and Phase 2 explicitly deferred until Phase 1 has delivered.

Why this works:
- Customer sees one product, one decision, one onramp — not two negotiations
- We don't commit to Phase 2 pricing or scope before Phase 1 proves value
- Phase 1's reference rights become exponentially more valuable if Phase 2 lands (each Phase-2 sub-customer is an indirect Tokenrip user)
- The architectural-requirement test (per `bd/CLAUDE.md`) gets satisfied by Phase 2 — so even discounted Phase 1 work is substrate-density progress, not consulting

Used on Luai El Haj proposal 2026-05-20 (Phase 1 = his consultancy, Phase 2 = his B2B back-office venture, multi-tenant). Originated from Alek's draft restructure plus Simon's "build the system for him, then turn it into a platform he can scale" framing.

## Proof Framing

- **Reframe the same credential per buyer.** RebelFi is one proof asset, but how it's described flexes to the buyer's domain. For a crypto buyer, lead with the specific DeFi/chain detail — it's the strongest domain-fluency signal. For a non-crypto buyer (e.g. mortgage), strip the crypto jargon to plain "a fintech product that's live in production"; the detail is noise at best and reads as off-topic risk at worst. The credential never changes; the framing always does.
- **Platform-as-credential beats portfolio-as-showcase.** tokenrip.com/agents only has ~2 agents — too thin to showcase. The strong move is to make Tokenrip itself the trust signal ("a platform I built for running AI agents") and link tokenrip.com, not /agents. "I built the infrastructure agents run on" outweighs "here are 2 agents I made" — and a platform claim can't be weakened by a low agent count, whereas directing a cold buyer to /agents invites them to count two. In a cold proposal, don't link /agents at all; agent walkthroughs belong on the call.
- **When the posting is about "agentifying" workflows, lead with Tokenrip as the product built for that.** Generic "I build AI agents" undersells. When the buyer wants to take existing workflows and add AI agent automation, Tokenrip *is* the product — frame it as "I built Tokenrip to do exactly this." Stronger product claim, differentiates from freelancers who assemble tools per project. Especially strong when the posting's industry is one we're already targeting (e.g. real estate lending) — say so, it shows the work isn't speculative. Observed on lending agent bid (2026-05-23).

## Implementation Approach Framing

- **Lead with human-in-the-loop, graduate to autonomy.** When a buyer wants full AI automation of their workflows, don't promise full autonomy upfront. Frame as two phases: (1) agents augment existing workflows with heavy human approval and oversight, (2) once the team trusts the system, identify pieces that can run with less hand-holding. This is honest (autonomy without trust = disaster), it de-risks the buyer's fear of losing control, and it maps to how the work actually gets delivered. The line "avoids the 'we replaced everything with AI and now nobody knows what's happening' problem" landed well in the lending bid (2026-05-23).

## The CTA Question

- **The closing question must read senior, not junior.** §7 says end with an easy question — but *which* question matters. Detail questions the buyer finds obvious ("what format are the files in", "is your hardware powerful enough") read as junior, or mildly insulting to a competent buyer who has clearly specified their stack. The fix: ask a project-level or execution-forward question — one that advances the deal and signals the bidder is already thinking about delivery. Best of class: a question that moves toward milestone 1 ("do you have a sample portfolio you could share for milestone 1?"). Easy to answer, not junior, and it pulls the conversation toward starting the work. Observed on the mortgage bid (detail vs. project-level) and the tax-fraud bid (dropped two junior questions for one execution-forward one).
- **Don't ask project specifics before the bid is accepted.** Questions like "which loan type has the highest volume?" are execution-forward but presume the deal is already happening. Before they've even picked you, that reads presumptuous. Pre-acceptance close = call offer with a bring-something promise ("Got 15 minutes? I'll come with some ideas on where agents would hit hardest"). Save the execution-forward questions for the call itself. Observed on lending agent bid (2026-05-23).

## Outreach (Firm-Direct LinkedIn)

- **Don't open with "curious."** Every LinkedIn outreach message opens with "curious..." or "I'd love to." Being the 50th kills the message before it's read. Open instead with the discovery posture: "Not pitching you here. We're in discovery, looking for design partners." It disarms the sales-radar, is honest (gameplan Hard Rule #1: no demo before discovery), and signals conversation over sale.
- **Bucket before you draft — A/B/Fallback.** One generic "grind line" for every prospect is spray-and-pray; a wrong-but-specific guess (e.g. "COI grind" sent to a technical underwriting specialist) reads worse than no guess and tells the prospect you skimmed. Sort each profile into Bucket A (volume brokerage), B (technical specialist/principal), or Fallback (can't tell → fully open question). Rubric: `agents/closer/insurance-linkedin-outreach.md`.
- **Offer more than you ask.** First-touch close is "happy to trade notes on what we're seeing across other brokerages" — gives the prospect something worth more than the reply it asks for, and leads instead of leaving the ball in their court. No call ask on first touch; the question is the ask.

## Recurring Objections

Objections that come up repeatedly, and the responses that work.

- **"Do you have examples I can show me / where is your work?"** Three consecutive firm-direct calls have hit this (Luai 2026-05-20, Paul 2026-05-21 in adjacent shape, Alex 2026-05-25 explicitly with the website open on his screen). This is no longer a coaching gap — it's a tools/assets gap. **Standing fix**: a portfolio pack (email + 2 live agent links + 1 short Loom walkthrough with a domain-bridge ending) must be ready to ship within 48 hours of any post-discovery call. The Chief of Staff + Moa pages on tokenrip.com are the spine of this. The Loom is recorded per-prospect (or per-vertical batch) with a one-sentence domain bridge at the end. Adjacent-vertical proof + dated proposal commitment beats "we're early days as far as your vertical goes" every time.

## Portfolio Pack (Warm-Prospect)

Distinct from the cold Upwork rules. When a warm firm-direct prospect asks to see work post-discovery:

- **Email + 2 specific agent-page links + 1 short Loom**, not PDF/deck. Polish slows shipping; the prospect asked for examples, not collateral. The Tokenrip homepage already does heavy lifting once the call has happened — the discovery call has already established platform credibility, so the prospect is ready for specific agent detail pages.
- **Cold-Upwork rule inverts here.** The Upwork playbook says don't link `/agents` because the thin count reads as absence. For a warm prospect, the same thinness reads as *focus* — each agent is a real shipped product with a detail page. Link directly to the specific agent pages, not `/agents`.
- **Domain-bridge sentence is the highest-leverage line in any demo asset.** Every Loom, screenshot walkthrough, or one-pager that goes to a specific prospect must end with a one-sentence translation of the demo into *their* domain. For Chief of Staff to Alex Khadempour: "same memory mechanic catches a client name spelled three different ways across passport, diploma, and questionnaire." Without that bridge, the prospect has to do the translation themselves, and most won't.
- **Close the strongest objection in the email body, not the proposal.** Whatever the prospect named as their biggest AI fear on the call (Alex: failed AI receptionist; Luai: credibility with clients), say in one explicit sentence why what we'd build doesn't trigger it. Pre-empt the objection before the proposal lands — the proposal then doesn't have to relitigate trust.
- **Email ends with a clarifying question that pulls a reply without requiring one.** Best shape: the question whose answer shapes the proposal's Track B. If they answer, the proposal gets sharper. If they don't, no harm.

Used on Alex Khadempour 2026-05-25 (Chief of Staff + Moa links + planned Loom + AI-receptionist-door-closing sentence + case-managers-vs-solo question).

## Notes

This file starts mostly empty. It earns its weight as Closer runs sessions and observes what actually happens.
