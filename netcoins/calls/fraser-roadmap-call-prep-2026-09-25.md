---
title: Fraser roadmap call — tear sheet
date: 2026-09-25
type: call-prep
attendees: Fraser Matthews; Simon; Alek
related:
  - "[[netcoins/product-direction]]"
  - "[[netcoins/battle-plan]]"
  - "[[netcoins/calls/netcoins-call-notes-2026-09-22]]"
source_artifact: https://claude.ai/artifact/GUFQqVGxbCdkQTaWUQG6t7 (v0.4.3, 23 Sept)
---

# Fraser roadmap call — 25 Sept 2026

## The one outcome that matters

**Split the roadmap into two tracks, and tie each track to a deal term.** Fraser's spec (v0.4.3) and the 22 Sept call with Kim and Pavel describe two different products on one clock:

| | **Track A: Netcoins yield (the "boring v1")** | **Track B: RebelFi consumer app** |
|---|---|---|
| Source | Kim, Pavel and Jay, 22 Sept | Fraser's artifact v0.4.3, 23 Sept |
| Scope | USDC only. One curated vault, Coinbase/Kraken parity. User signs every transaction. Fee disclosed. | 4 assets across 2 chains, CCTP, convert, earn, chat, money address, x402 agents, KYC, App Store. 12-week Phase 1 |
| Yield source | Morpho-style curated vault (Coinbase runs Morpho on Base) | "RebelFi orchestration, **not Morpho/Aave**." Solana programs need redeploy plus audit by ~week 8 |
| Gated by | Kim's regulator pack, wallet vendor, Netcoins build capacity | CaaS terms, audit, Privy/Kora/CCTP, FinCEN/MTL/sponsor bank, engineering headcount |
| Deal term it should carry | **C$200K integration milestone** (6 months from close) | **Earn-out (d) roadmap items** (18 months), plus funded post-close build |

If the tracks stay merged, the milestone inherits a 12-week consumer-app build with a regulatory critical path that neither RebelFi nor Surge controls. That is the main risk to the C$200K.

## Where things stand (facts)

- **Deal.** LOI signed 31 Aug. Exclusivity ends ~19 Oct. Target close ~31 Oct. Surge's 30-day DA clock starts when we deliver Conditions 2, 3 and 5. *Check delivery status before the call.*
- **Netcoins operators (22 Sept).** They halted the Galaxy + Fireblocks yield track for us. Kim wants a boring v1 launched "in the months following the announcement." They have an internal sync on **Mon 28 Sept** and will send us an update around **29 Sept–2 Oct**. Stablecoin AUC is about US$1.5M, which yields ~US$7.5K/yr at 50 bp.
- **What we owe them.** A one-page v1 spec (was due today, *inferred*) and a flow-of-funds diagram for Kim's regulator pack (29 Sept). *If the spec hasn't gone out, tell Fraser when it will.*
- **Fraser's spec has moved on.** It is now v0.4.3; the vault last tracked v0.4.1. Changes since: every asset is non-custodial, BTC is native in Privy (the spec's own estimate is +2–3 sprint-weeks), Convert settles atomically with Netcoins co-signing, and cross-chain is limited to USDC on Base/Ethereum.
- **What it assigns to Simon.** Simon is named engineering lead (part-time RN contractor + Claude Code). Due "this week": Kora on devnet, and the program redeploy with an audit quote. Before Sprint 1: Privy BTC support tier, USDT/Helius/BitRank checks, Kora signer, BTC fee UX. **None of this is paid before closing** (LOI Schedule A §3).

## Agenda (~45 min)

1. **Frame (3 min).** "We want a roadmap all three of us can commit to, and we want to agree which parts of it are deal terms."
2. **Two tracks (12 min).** Propose A/B as above. Ask Fraser to carry this framing into Netcoins' Monday sync, or get Simon into it.
3. **Yield architecture (10 min).** Reconcile "not Morpho/Aave" with Kim's "copy Coinbase." Suggested bridge: **RebelFi is the orchestration layer (routing, policy, fee, disclosure, reporting); the v1 venue is a curated third-party vault.** Our own Solana programs become a Track B item once audited. Ask why he excluded Morpho/Aave before proposing this. *This is inferred: his reason might be margin, differentiation, or regulatory, and each leads somewhere different.*
4. **Build model and money (10 min).** Who builds Track B, what budget, when it starts. What happened to the CTO and dev team he had lined up in July? A 12-week Phase 1 with one part-time lead is not credible. Say so plainly, with the artifact's own dependency list as evidence.
5. **Deal hooks (7 min).** Milestone criteria, (d) items and the Net Revenue definition (below). Confirm we write the first draft of the integration plan, and name a date.
6. **Next steps (3 min).** Named owners and dates for everything under "Leave with."

## Questions to ask Fraser

- Is the Netcoins USDC yield launch the first release of the RebelFi app, or a separate Netcoins product? Which entity offers it? (Pavel floated both options.)
- Why "not Morpho/Aave"? Does that hold for the Netcoins v1, where Kim wants Coinbase parity?
- Which rows marked "decided" did you decide alone, and which need Kim/Pavel/counsel? This matters most for the **US regulatory row**: RebelFi, Inc. registering as a FinCEN MSB and holding MTL coverage is an entity-liability decision we haven't agreed to.
- Engineering: budget, headcount, and who hires the RN contractor. Is there founder full-time funding? (That feeds our FT consulting push.)
- Pre-close: what do you actually need before closing, and what can wait?
- Launch clock: does launch start at the deal announcement? When does the audit get funded, and by whom?

## Positions to hold

- **Milestone = Track A, deployed, not live to clients.** Use Fraser's own words from 27 Aug: compile, deploy to Surge's environment, one on-chain transaction, runbooks. Client go-live depends on the regulator; the milestone can't.
- **Earn-out (d) = 3–5 Track B items we control end to end.** Examples: send/request, money address, earn screen on audited programs. Exclude anything gated by CaaS terms, card partners or licensing.
- **Net Revenue attribution has to be a formula.** It should count:
  - (i) the yield spread on Netcoins-routed balances, whichever entity books it;
  - (ii) yield on the **C$15M treasury float**, the only balance that clears (a)'s US$50K alone;
  - (iii) consumer-app revenue, **including Convert, where Netcoins books the dealer revenue.**

  Without this, a four-asset app can succeed and still register as zero Net Revenue.
- **No new assignments accepted on the call.** Say: "We'll size these and come back by [date] with what's pre-close and what's post-close."
- **Pitch the boring version.** Keep the agentic material out of the first 30 minutes (a lesson from the 22 Sept call).

## Pre-close work worth offering (cheap, de-risks both tracks)

- Get the audit quote for the program redeploy. It is the longest pole on Track B, and Fraser can't budget without it.
- Confirm Privy's BTC transaction-building tier. It decides whether the +2–3 sprint-weeks is real.
- Send the Track A one-pager and adapt the flow-of-funds diagram for Kim. This is already owed, and it lets us write the milestone.

Defer Kora devnet, the BTC indexer and x402 until after closing.

## Leave with

1. Agreement in principle on Track A/B, and that Track A carries the milestone.
2. A path to a yield-source decision: who decides, and by when (before Kim's regulator pack).
3. An answer on engineering budget and headcount for Track B, or a date for one.
4. A date for our integration-plan draft (milestone criteria + (d) items + Net Revenue formula).
5. A route into Netcoins' Monday sync or its follow-up.

## The assumption this rests on

**That Fraser sees the two tracks as separable.** He may see the Netcoins yield as simply the "Earn" tab of his app. If so, two-track still works: Track A becomes the app's first shippable slice (Earn only, on a curated vault), and the milestone is defined on that slice. The test is his answer to the first question above. Don't argue the framing before he answers it.
