---
company: Netcoins / BIGG Digital Assets (→ Surge Digital)
created: 2026-08-21
status: DRAFT v0 — workshop before building
purpose: Flow-of-funds diligence deliverable requested 2026-08-18 by Fraser + Kim Dwyer
related: "[[netcoins/netcoins-call-notes-2026-08-18]]"
---

# Flow of Funds — Outline (v0, for workshop)

Strategic frame: whoever draws the money map owns the technical plan of record. Kim claimed the business/regulatory map; this is the counterweight. The document does four jobs: (1) diligence artifact, (2) de facto architecture, (3) scoping instrument (effort annotations), (4) leverage — every TBD box is a question BIGG owes us.

Guardrails: nothing from Tokenrip/Quintel appears; label "Draft for discussion"; effort numbers will be quoted back — honest, not undersold.

## Page 0 — Entities, Layers & Perimeters

Four horizontal layers × geography columns (Canada | US), three overlay lines.

Layers:
- A · Fiat/Banking — Netcoins CA bank accts (CAD; Interac/EFT/RTR Q4-26) | Bank partner USD / virtual accts (TBD)
- B · Licensed/Custodial (INSIDE perimeter) — Netcoins Canada (CTP, CIRO pending, custody BitGo/Fireblocks) | Balance US WY entity (DVTR custody/trading/staking; on/off-ramp; MTL 27 licensed + CA submitted + 4 pending + 9 exempt = 40 states; NO NY; ~$4K/mo) | Netcoins USA (Circle liquidity path, OTC bespoke pricing; 18 NAL states; role = liquidity not MTL — status: assumed) | Circle (issuer, mint/burn, CCTP — regulated counterparty outside group)
- C · Non-custodial orchestration (OUTSIDE perimeter; never touches fiat, never holds funds) — RebelFi NewCo: API/orchestration, risk-policy engine, ring-fencing clean rooms, CCTP relay, yield routing, ops console; on-chain escrow contracts (permissionless), vault positions, whitelisted DeFi
- D · User custody — self-custody wallets, partner-controlled wallets (B2B), ring-fenced wallets, B2B2B end users

Overlay lines:
1. Regulatory perimeter — heavy box around Layer B. Rule: RebelFi instructs, routes, verifies; never custodies, never touches fiat.
2. Custody line — per node: custodial / non-custodial / admin-only (RebelFi deployer + upgrade keys, no power to move funds; upgrade authority transfers to BIGG at close per LOI).
3. MTL touchpoints — flag on every leg transmitting/converting on behalf of a customer (on-ramp, off-ramp, cross-border fiat). Every flag must sit in Layer B on a Balance-covered state or Netcoins CA. Unflagged legs (CCTP, escrow release, yield) = no license needed = the valuation argument.

Entity cards: Role · Reg status · Custody · Touches · Status (confirmed/assumed/TBD).
Legend: edges (fiat rail, on-chain stablecoin, CCTP burn/mint, internal ledger/intercompany); markers (KYC/KYB, KYT, $ fee capture, MTL flag, open question).

Open boxes on Page 0:
- Q1 Bank partner identity + account model (virtual vs omnibus+ledger)
- Q2 BIGG↔Balance relationship: program/agent vs customer → merchant-of-record, whose KYC program
- Q3 Circle counterparty entity; 100K minimum met today?
- Q4 NY + ~10-state gap: geo-block or alternate partner
- Q5 Where the second merchant-payments tech sits
- Q6 Canadian leg: Netcoins CA custody vs non-custodial path

Design choices to settle first:
- NewCo never in the custody chain (no routing hot wallet) — any custodial hop belongs to Balance/Netcoins.
- B2B2B: KYC data path and money path drawn as two distinct lines; customer-of-record for money legs = Balance.
- Geography as columns on one canvas (cross-border is the product).

## Pages 1–8

Skeleton per flow page: (a) customer view · (b) operational/settlement view through the Page 0 grid with custody + MTL + $ at every hop · (c) what it proves · (d) inputs needed from BIGG.

| Pg | Flow | Path | Proves | Needs |
|---|---|---|---|---|
| 1 | Onboarding & KYC | KYC data path vs money path; B2C / B2B / B2B2B columns | Customer-of-record unambiguous; WizPay waterfall solved | Q2 |
| 2 | On-ramp / off-ramp | USD → bank → Balance (MTL, custodial) → Circle mint → USDC to wallet; reverse | Only licensed legs are the two ends | Q1, Q3 |
| 3 | Yield deployment | Idle USDC → risk-policy gate → whitelisted protocols → accrual → withdrawal; insured + Sharia sub-paths | No MTL leg anywhere | Netcoins float participation? |
| 4 | Escrow payment | Payer → permissionless escrow → release conditions → payee; fiat ends via Pg 2 | Kim's sentence as a diagram — outside perimeter | Their merchant/B2B use cases |
| 5 | CCTP cross-chain | Burn → attest → mint; in-flight custody = nobody; ring-fenced destination w/ provenance check | Multi-chain w/o custodial hop; BIG/BitRank synergy hook | BIG screening plug-in? |
| 6 | Cross-border CA↔US | Netcoins CA → CAD off → USDC → Balance (MTL) → USD recipient; reverse | The unserved cross-border client use case | Q6, CA rail timing |
| 7 | Liquidity, treasury, settlement (back office) | Circle direct via Netcoins USA → float → rebalancing; fee capture per entity; intercompany arrows; recon | Where the flow is won, by whom — pre-empts transfer-pricing decisions | Circle status, treasury policy |
| 8 | Open-items register + build notes | All Qs with owner = BIGG; not-yet-built boxes with effort estimates | Starts scope/budget on our numbers | — |

Build sequence: Page 0 → 2, 3, 4 → 8 = sendable v1. Then 1, 5, 6, 7 as v2 (hold Pg 7 until their business-flow map is seen).
