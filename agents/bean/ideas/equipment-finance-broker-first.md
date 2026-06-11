# Equipment Finance — Broker-First Motion (Quintel)

**Status**: developing
**Created**: 2026-06-08
**Last touched**: 2026-06-08

## Thesis

If Stauss drops off, Quintel's primary GTM is **broker-first**: sell a pre-qualification + lender-match tool to owner-operated EF broker shops (2–10 people). Chosen for fastest-to-revenue *and* because a repeatable cold broker motion makes Stauss optional (no single point of failure). The wedge is **pre-qual + match, not sourcing** — and the whole build collapses to one component: a secure document-**extraction** engine that is simultaneously the unfakeable demo, the cross-vertical reusable closer, and platform bone #1.

## Evolution

- **2026-06-08**: Started from "what's the GTM without Stauss." Reframed: Stauss is a *channel, not the product* — losing him changes only distribution-of-first-customer, nothing about the product. Walked the three archetypes (lender / broker / dealer) through a reachability × pain × cycle × moat-seed filter → **brokers win on speed + repeatability**. Then the wedge question: **pre-qual beats sourcing** (two unprompted witnesses — Stauss's "pre-approved term sheet," Devan's "score it 1–10"; sourcing is the dream Stauss kept pulling toward and the weakest part of the hand). Then the build: Simon's three build questions (MVD / close-and-reusable piece / platform bones) all **collapsed to one component — the secure `extract` engine** — which turned out to *already exist* as the archived "Terminus" design (he re-derived his own locked decision). The motion adds exactly one new bone: `match` (EF-specific). Decisions locked: EF = anchor (over AICAP, still paying); `match` stays EF-specific; "Quintel" = umbrella for all of EF; optimize Phase-1 for speed (no-name solo broker OK).
- **2026-06-08 (cont. — the demo shape)**: Corrected the demo approach — *don't* ask a cold broker for their book; run on **anonymized-from-real demo deals** (texture preserved), with the **live-drop as a post-initial-call closer**. Hero = the **Deal Detail screen**; the demo runs end-to-end through a faked-OK **package draft**. Surfaced the **decouple insight**: since the demo runs on deals we control, the first end-to-end demo can ship *fully faked*, so selling isn't gated on the engine build (the first real piece, extraction, is gated by the closer, not the first demo). Specced the screens to build-ready depth in `product/quintel/quintel-demo-shape-2026-06-08.md`.

## Key Challenges Surfaced

- **Sourcing vs pre-qual** — resolved: pre-qual is the painkiller, sourcing the vitamin/dream at the broker tier. Sourcing → later up-market upsell.
- **Broker = easy cold sale but thin moat-seed** (rich placement data, thin credit-performance) — accepted: seed the placement-side flywheel first; pull a lender forward later for the credit side.
- **"Become the broker" idea** — steelmanned (principal economics dwarf vendor economics) then knifed (different, relationship-heavy business; two-sided cold-start; competes with the vendor motion). Synthesis = *be your own first customer to seed the deal-graph* — **parked** (focus broker-first).
- **The mock is dead** — resolved into the MVD principle: a demo must survive input the prospect chose; leave the judgment layer 70%-moldable.

## Open Questions

- Reference-logo vs speed (defaulted to speed; periodic re-check).
- Does the be-your-own-customer / seed-the-graph move ever come off the bench?
- First lender, and when (the credit-performance flywheel fork after broker-first proves out).
- Cold reachability is still untested — the riskiest assumption; Phase 0 outreach tests it for ~zero cost.

## Non-Obvious Connections

- **The unfakeable demo = surviving input the prospect chose.** Mocks are free now, so they prove nothing; the only credible demo transforms a document the prospect handed over. (Generalizes well beyond EF.)
- **Three questions → one component.** MVD, the close-and-reusable piece, and the platform bones were all the same secure `extract` engine — an instance of "one primitive, multiple motions" (compliance/PII lives *inside* extraction, a driver not a gate).
- **Re-deriving your own archived decision = strong signal** — inverse of the build-reflex blind spot (2026-06-04). Simon's fresh reasoning walked back into the locked Terminus design; convergence is evidence the decision was right (and that the doc shouldn't have been archived).
- Links to [[autonomous-machine-operating-model]] (the research-agent-as-signal-engine "anchor a build to a live consumer" move) and [[ui-surface-infra]] (one-primitive-multiple-motions).
