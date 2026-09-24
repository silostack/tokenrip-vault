---
title: Netcoins — yield integration intro (Pavel + Kim Dwyer + Jay), call notes
date: 2026-09-22
call_type: product-integration
transcript: "[[netcoins/calls/netcoins-2026-09-22]]"
prep_file: "[[netcoins/calls/pavel-call-prep-2026-09-18]]"
deal: "[[netcoins/netcoins]]"
momentum: advancing
---

# Netcoins Yield Call — 2026-09-22 (product-integration)

## Bottom line

Netcoins has stopped talking to other yield partners and now treats RebelFi as its yield layer. Kim wants a "boring" v1 that copies Coinbase and Kraken, launched in the months after the deal announcement. The deal-relevant problem is the volume: Netcoins holds about US$1.5M in stablecoins, and that money leaves the platform quickly. At a 50 bp spread, that balance earns about US$7.5K a year. Earn-out (a) needs US$50K in 12 months. The client yield path alone does not reach the hurdle. It only gets there if balances grow roughly 7x, or if the $15M treasury float counts. Neither was raised on the call. Every next step belongs to Netcoins, and RebelFi committed to nothing.

## Follow-Up Actions

### What WE Need to Do

| # | Action | Owner | Due |
|---|---|---|---|
| 1 | **Send a one-page "boring v1" spec to Pavel, Kim and Jay.** It should cover USDC only, one curated Morpho vault (Coinbase parity), a user signature on every transaction, the fee mechanics and suggested disclosure wording, and the wallet options (Privy vs. Fireblocks' embedded wallet). Send it before their Monday internal sync so it frames that meeting. | Simon | 2026-09-25 *(inferred)* |
| 2 | **Offer Kim the flow-of-funds diagram for her regulator story.** She described the regulator pack word for word: "flow of funds, how we protect consumers, why we're allowed to do it." `flow-of-funds/rebelfi-flow-of-funds-v2.pdf` already exists. Adapt it to the Netcoins yield path. This moves Condition 1, and every earn-out component depends on it. | Simon | 2026-09-29 *(inferred)* |
| 3 | Send Kim the details on the insured-vault partner Alek mentioned. It speaks directly to her regulator's first concern, which is consumer losses. | Alek | 2026-09-25 *(inferred)* |
| 4 | **Write the integration milestone around this yield integration** (battle plan #5). Acceptance must mean deployed and working in Surge's environment. It must not mean live to Netcoins clients. Client launch depends on the regulator, and the milestone cannot. | Simon | Before DA draft |
| 5 | **Propose the Net Revenue formula using the mechanism Simon described** (battle plan #6): the spread taken on withdrawal from RebelFi-routed balances counts as Net Revenue, whichever group entity books it. Settle whether treasury-float yield counts. | Simon + Alek | Before DA draft |
| 6 | Put the treasury-float path on the table. The prep marked it "your fastest win; propose it," and it was not raised on the call. | Alek | Next contact |

### What THEY Need to Do

| # | Action | Who | Due |
|---|---|---|---|
| 1 | Send the Coinbase/Morpho press release and Kraken Canada's yield materials | Kim | ~2026-09-25 *(inferred)* |
| 2 | Pull the Coinbase and Kraken terms of service and disclosures, map the flow and the counterparties behind it, and check whether Coinbase Canada is live | Kim (+ Jay, who has been through the Kraken flow) | Before Monday sync *(inferred)* |
| 3 | Evaluate wallets: Privy call next, then confirm whether Fireblocks can do non-custodial wallets for retail | Pavel + Jay | ~2026-09-28 |
| 4 | Internal sync on structure using existing partners' infrastructure | Pavel, Kim, Jay | Mon 2026-09-28 |
| 5 | Size the build against Pavel's backlog | Pavel | With the update |
| 6 | Send RebelFi an update | Pavel / Kim | ~2026-09-29 to 10-02 ("next week or so") |
| 7 | Build the regulator narrative and take it to the CSA, building in parallel | Kim | After the model is settled |

### What They're Expecting From Us

They asked for nothing explicitly. Kim's framing ("we have some homework... we'll send you an update") has RebelFi waiting. That makes actions #1 and #2 above optional, and they are also the cheapest way to stay the operator rather than the vendor while the ball is in their court.

### Open Questions Before Next Contact

- **Is the $15M treasury float in scope for v1?** It is the only balance that clears earn-out (a) on its own. *Inferred:* treasury yield is investment income, not "revenue," so whether it counts has to be written into the DA.
- **Which entity offers the product?** Pavel floated two options: a Surge umbrella product outside Netcoins, or a Kraken/Payward-style separate non-custodial entity. This decides where revenue is booked.
- **Does Pavel know about the acquisition?** He asked who the "clients" are and how revenue "accrues back to Netcoins," which reads like vendor framing. *Inferred, medium confidence.* This changes how fees should be discussed with him.
- **Which announcement starts the launch clock?** Almost certainly the deal announcement (*inferred, high confidence*). If so, the yield launch lands inside the 6-month milestone window and the 12-month earn-out (a) window.
- **Delegated signing vs. "non-custodial."** Simon presented Privy pre-authorizations (moving funds on the user's behalf) as a feature. Kim's regulator cares about custody, and third-party authority to move funds may work against the non-custodial story. Settle how v1 handles this before Kim's regulator pack is written.
- **EVM readiness.** Copying Coinbase means Morpho on an EVM chain (Coinbase's is on Base). Confirm the effort against RebelFi's Solana-heavy on-chain history.
- **Who owns engineering** on the Netcoins side? "Pavel brings in the engineering team when necessary."

## Call Summary

This was the first product call with Netcoins' operators, not Fraser. Pavel (head of product) called it and added Kim Dwyer (COO, regulatory) and Jay Kedia (operations: wallets, custody, asset movement) that morning. Pavel described two structures he is considering. Simon said RebelFi supports the Kraken-style non-custodial model and recommended a bring-your-own-wallet setup with Privy. Pavel asked about the fee model and whether the fee is disclosed. Kim set the scope: USDC only, copy Coinbase and Kraken, a boring v1, launch as soon as possible after the announcement. She then assigned the next steps to her own team.

## Momentum

**↑ Advancing.** A competing Galaxy + Fireblocks yield track was halted in RebelFi's favor, all three operators are engaged, and Kim offered a regulator path plus a resale channel to other CTPs. The caveat: nothing is scheduled, and every next step belongs to Netcoins.

## Key Intelligence / What Changed

1. **RebelFi displaced a live competitor.** Kim: *"we halted everything once Fraser started talking to you guys"*. The Galaxy + Fireblocks model was already set up, and *"we would be replacing Galaxy here with you guys."* That track still exists and could restart if RebelFi is slow.
2. **Client yield is small at today's balances.** Jay: stablecoin AUC is *"around 1.5 million... constantly moving."* Kim: businesses use Netcoins *"as a liquidity source"* and move funds off the platform. The upside case, yield as a reason to keep balances on Netcoins, is plausible (*inferred*), but it is a hypothesis. The arithmetic: US$1.5M × 0.5% ≈ US$7.5K/yr. Earn-out (a) needs US$50K in 12 months, which takes about US$10M of average routed balance at 50 bp.
3. **The regulatory path has a timeline.** Kim: copy Kraken and Coinbase (*"the big guys can do it"*). The regulator pack covers flow of funds, consumer protection and permissibility. They build in parallel and launch *"within the months following the official announcement"*, and Fraser *"might just say launch it."* The regulator's concerns, in order, are losses, custody and disclosures. Kim also offered to shop the model to other Canadian CTPs. **That is a pipeline for earn-out (c)**, which needs five clients at US$15K each.

Also noted:
- **Wallet vendor is undecided, and three are in play.** Privy (Simon's recommendation, and their next call), Fireblocks' embedded wallet (Jay: available *"with one of the companies they acquired"*, *believed* to be Dynamic), and Utila (Fraser's earlier preference for payments). Pavel's rule: *"we're not building and maintaining non-custodial wallet infrastructure."*
- **Org map confirmed.** Pavel leads technical conversations and brings in engineering. Kim owns the regulator. Jay owns wallets and asset movement. Fraser can override on launch.
- The website overview landed well with Kim (*"That was really good"*). Fraser and Kim are also working on Mastercard card products *"on both sides of the house"*. RebelFi should expect to be pulled into that.

## Pipeline Lens (adapted: acquirer-as-customer)

| Objection / concern | Type | How handled | Score | Better response |
|---|---|---|---|---|
| "How do we tell users the fee is taken out? They can see the real vault rate." (Pavel) | Disclosure / trust | "It's a UX issue... like Nexo, they don't say where yield comes from" | **2/5** | See Coaching Priority #1. Nexo paid US$45M to settle SEC and state charges over its Earn product (2023). That is the wrong reference for a CSA-registered platform whose regulator's #3 concern is disclosure. |
| "We don't want to build or maintain wallet infrastructure." (Pavel) | Scope / effort | Bring your own wallet → Privy | 3/5 | Right answer, but Simon dismissed Fireblocks, which Jay runs and Kim wanted. Better: support either option and state the trade-offs. |
| "We're already on Fireblocks. Can we use that?" (Kim) | Incumbent vendor | "Probably a bit of overkill" | 2/5 | *"Fireblocks now has an embedded consumer wallet, so that works. Privy is cheaper and has delegated signing. We integrate with either. Your call on the vendor relationship."* |
| Regulator: losses, custody, disclosures (Kim, via Alek's question) | Regulatory | Alek: insured vaults | 4/5 | Good. Follow up with the partner's details (action #3). |

**Pain evidence: real.** Fraser wants it *"a month ago"*, and competitors (Kraken, Coinbase) are already live in Canada. **Stage signal:** pre-closing integration scoping, which is the unpaid "integration planning before closing" in LOI Schedule A §3. **Mutual next step:** none. Only theirs.

## Prep scorecard (vs. [[netcoins/calls/pavel-call-prep-2026-09-18]])

| Walk-away goal | Got it? |
|---|---|
| Spec + launch date | Partial. USDC, copy Coinbase/Kraken, "months following the announcement" |
| Volume inputs | Partial. US$1.5M stablecoin AUC. No uptake or balance modeling. Treasury float not asked |
| Timeline vs. earn-out clock | Yes, quietly. Launch is tied to the announcement |
| Connect-points | Partial. Non-custodial, BYO wallet, vendor open. Liquidity and KYC not touched |
| Org map | **Yes** |
| Concrete next step + roadmap doc | **No.** No working session and no doc. Their update in "a week or so" |
| Propose treasury-first | **Not raised** |

## Simon's Performance

### Coaching Priorities

1. **The fee-disclosure answer argued against the regulator.** *"I don't think the user cares... like Nexo, who knows where Nexo gets their yield."* Two minutes later, Kim named disclosures as one of the regulator's big concerns. → **Better language:** *"Treat the spread as a disclosed platform fee. The advertised rate is net, and the disclosure says 'Netcoins/RebelFi retains X bp of the vault's yield.' Coinbase and Kraken both disclose this. Since you're copying them, copy their disclosure too. We'll draft the wording."* → Why it matters: Kim is writing the regulator story now, and RebelFi's answer should be a sentence she can paste in, not a position she has to walk back.

2. **Simon led with the exciting version to a buyer who wanted the boring one.** The pitch opened with promotion-chasing, automated rotation, cron jobs and "agentic," then moved to third-party pre-authorization. Kim reset the scope right away: *"this is going to be a lot more boring."* → **Better language:** *"Base case: USDC, one curated vault, the user signs every transaction, the fee is disclosed. That's what Coinbase just shipped with Morpho. Optimization and rotation are phase two, once you're live."* → Why it matters: this is the infrastructure-language trap again, and the automation features point to the custody question the regulator will ask.

3. **Simon asked the right questions but closed nothing.** Simon asked about volume, roadmap and timeline and got real answers, then let Kim assign all the homework to her team. → **Better language:** *"While you do the wallet and ToS work, we'll send a one-page v1 spec and a flow-of-funds diagram you can use with the regulator. Can we book 30 minutes with Pavel and your eng lead after your Monday sync?"* → Why it matters: the integration plan decides the C$200K milestone, and RebelFi can only write it from inside their working sessions.

### What Worked

- **Mirroring Pavel's model.** *"What you described... that's exactly how our platform is set up."* It turned Pavel's research into RebelFi's architecture in one sentence.
- **Straight answer on wallets.** Bring your own wallet plus a concrete vendor recommendation matched Pavel's "don't make us maintain wallets" rule, and Privy is now their next call.
- **Alek's regulator question.** *"What's their biggest concern?"* got the regulator's priorities (losses, custody, disclosures) from the person who owns that relationship, and his insured-vault answer gave RebelFi a concrete way to address the first one.
