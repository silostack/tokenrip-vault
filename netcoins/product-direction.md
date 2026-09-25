---
title: Surge / RebelFi — product direction and decision tracker
type: internal
status: live
created: 2026-09-23
updated: 2026-09-23
source: https://claude.ai/artifact/GUFQqVGxbCdkQTaWUQG6t7
source_version: v0.4.1, 2026-09-23
related:
  - "[[netcoins/netcoins]]"
  - "[[netcoins/battle-plan]]"
  - "[[netcoins/calls/netcoins-call-notes-2026-09-22]]"
---

# Surge / RebelFi product direction

**Fraser's [consumer-app spec and decision log v0.4.1](https://claude.ai/artifact/GUFQqVGxbCdkQTaWUQG6t7) is now the most concrete expression of his intended product.** It describes a Canada-first, non-custodial consumer wallet under the RebelFi brand, with payments, yield, conversion and agent payments. It is a planning source, not proof that RebelFi's founders, Netcoins' product and compliance team, partners, or counsel have accepted the architecture, schedule or assigned work. Record changes here as dated decisions with an owner and source; keep detailed designs in separate linked documents once work starts.

## What Fraser's v0.4.1 says

| Area | Direction in artifact | Status to track here |
|---|---|---|
| Product and audience | RebelFi consumer app for Canada and USA, LatAm-ready; send, earn, spend, convert, agents, later borrow. Canada access and ramp are the proposed wedge. | Fraser's direction; market thesis unvalidated |
| Brand and entity | RebelFi consumer brand; RebelFi, Inc. as US operator; Surge parent; design from rebelfi.io. | Proposed operating structure; reconcile with definitive agreement and regulatory advice |
| Wallet and chain | Non-custodial Privy embedded wallet; Solana as primary chain; React Native / Expo; sponsored fees via self-hosted Kora. | Artifact labels these decided; Simon and Netcoins have not jointly confirmed implementation |
| Launch assets | USDC, USDT, BTC, SOL. USDC is settlement and yield asset. USDC cross-chain via Circle CCTP; USDT cross-chain via USDT0; BTC balance and movement through Netcoins. QCAD/CADD removed from app. | Fraser's 23 Sept asset decision; cross-chain routes and BTC service remain dependencies |
| Phase 1 | 12-week consumer app: wallet, send/request/chat, money address, cross-chain receipts and sends, USDC–USDT conversion through Netcoins, earn, basic agent allowances/approvals, fiat funding/KYC. | Proposed scope and estimate, not an agreed delivery commitment |
| Phase 2/3 | Card and virtual accounts, Lightning, agent cards/MCP, SOL/BTC conversion, then secured credit and LatAm ramps. Rain is favored for cards; USD account provider open. | Candidate roadmap |
| Yield | Idle USDC earns through RebelFi orchestration; source/rate/disclosures open; Solana program redeploy and third-party audit required. | Product promise depends on technical and legal validation |
| Netcoins role | Fiat rails and conversion through a CaaS agreement; Netcoins as dealer of record. Conversion execution venue still open. | CaaS scope, price, responsibilities and feasibility are open |
| Agent layer | x402 allowances and approvals in Phase 1; wallet MCP and agent-scoped cards later. BitRank screening proposed. | Product hypothesis and compliance questions open |
| Other corporate products | ArmaPay remains merchant checkout, adopting Solana Pay. BancoLibre acquisition is a pass per Fraser (23 Sept); money address/chat built in-house. | Fraser's reported direction; confirm ownership and integrations |

**Source discipline:** “Decided” above means *the artifact calls it decided*. It does not mean a joint product decision or engineering sign-off. Do not copy its regulatory conclusions, competitor claims, vendor capabilities, 12-week estimate, or claimed build savings into an external plan without checking them.

## Decisions and conflicts that matter now

1. **Separate the consumer app from the Netcoins yield integration.** The [22 Sept operator call](calls/netcoins-call-notes-2026-09-22.md) scoped a deliberately narrow USDC-only yield offering for Netcoins users, modelled on Coinbase/Kraken. Fraser's artifact describes a much larger consumer wallet with four assets, cross-chain transfers, conversion, chat and agents in Phase 1. These may be two products or two stages of one product; nobody has confirmed the relationship. The DA integration milestone must name its own acceptance criteria and must not silently inherit the 12-week app scope.
2. **Yield architecture is unresolved.** The call discussed a curated Morpho-style vault, Privy versus Fireblocks wallets, and user signatures. The artifact chooses Privy/Solana and RebelFi's own orchestration, with Morpho/Aave expressly excluded. Ask Pavel, Kim and Fraser whether the Netcoins offer and consumer app use different yield paths, and who approves a change. The distinction affects regulatory review, delivery time and the earn-out.
3. **A “non-custodial” label does not settle the legal perimeter.** Fiat conversion, BTC held via Netcoins, sponsored transactions, delegated agent spending, an x402 facilitator and yield each introduce different control and regulated-activity questions. Treat the artifact's US/Canada regulatory rows as questions for counsel and Kim's flow-of-funds review, especially before accepting an entity or launch plan.
4. **The proposed scope is wider than the financing and operating agreement currently support.** Phase 1 depends on Netcoins CaaS terms, program redeploy/audit, Privy, Circle CCTP, USDT0, Kora, KYC and regulatory advice. The artifact assigns Simon engineering work and suggests a lead-plus-contractor model, but the LOI does not itself settle authority, budget, hours or staffing. A 12-week target is a hypothesis until those dependencies have owners and dates.
5. **The Canada wedge changed with QCAD's removal.** Canadian customers would see CAD but hold USD assets. That may fit cross-border use, but it creates FX exposure and changes the claim from CAD-native money to Canadian access to digital dollars. Test that with actual target users before making it the positioning anchor.

## Open decisions to resolve in the next working session

| Question | Decision owner to confirm | Why it comes first |
|---|---|---|
| Is the Netcoins USDC yield launch a separate workstream from the RebelFi consumer app? Which one satisfies the C$200K integration milestone? | Fraser, Kim, Pavel, Simon; DA counsel for milestone wording | Prevents scope and earn-out clocks from becoming one unbounded commitment |
| Who is product owner for RebelFi, who approves architecture/scope, and what engineering budget and founder engagement are authorized? | Fraser with Simon and Alek | Determines whether these are executable decisions or a concept document |
| What is the yield source for each product, and what customer signing/custody model will Kim take to regulators? | Kim, Pavel, Simon, counsel | Gates the core “earn” promise and Netcoins distribution |
| What exactly can Netcoins CaaS supply in Canada and the US: fiat funding, stablecoin conversion, BTC custody, price/quote, disclosures, ledger and service levels? | Pavel, Jay, Kim, Fraser | Gates much of Phase 1; no signed interface or economics yet |
| Are cross-chain USDC/USDT and x402 agents truly launch-critical? Which customer use case requires them on day one? | Fraser and product owner, with Simon sizing | Largest likely scope and risk multipliers in the 12-week plan |
| Which decisions are approved by the founders versus only marked “decided” in Fraser's artifact? | Simon and Alek with Fraser | Avoids accidental acceptance of assignments, timeline or technical choices |

## Change log

| Date | Source | Change | Standing |
|---|---|---|---|
| 2026-09-22 | [Pavel/Kim/Jay call](calls/netcoins-call-notes-2026-09-22.md) | Netcoins operator group scoped a USDC-only, simple yield offering; wallet vendor and structure open; Kim owns regulator path. | Direct call record |
| 2026-09-23 | [Fraser artifact v0.4.1](https://claude.ai/artifact/GUFQqVGxbCdkQTaWUQG6t7) | Consumer wallet direction recorded: Solana, Privy, USDC/USDT/BTC/SOL, CCTP/USDT0, Netcoins conversion, agent layer; QCAD out, BancoLibre passed. | Fraser-authored plan; joint acceptance unconfirmed |
| 2026-09-23 | [Fraser artifact v0.4.2–v0.4.3](https://claude.ai/artifact/GUFQqVGxbCdkQTaWUQG6t7) | Phase 1 cross-chain narrowed to USDC on Base/Ethereum (CCTP); USDT Tether-native on Solana only, USDT0 to Phase 2. Every asset non-custodial: native BTC in Privy (est. +2–3 sprint-weeks), Convert settles atomically with Netcoins co-signing, Lightning self-custodial. Simon named engineering lead with "this week" items (Kora devnet, program redeploy + audit quote). | Fraser-authored plan; joint acceptance unconfirmed. Prep: [[netcoins/calls/fraser-roadmap-call-prep-2026-09-25]] |

## Tracking rule

For each later artifact, call or decision, add a dated row here with **source, decision-maker, status (proposed / agreed / blocked / superseded), and consequence for scope, milestone or economics**. Keep the external artifact linked as source history; this note is the local index of what the team has actually accepted.
