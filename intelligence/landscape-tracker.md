# Agentic Economy Landscape Tracker

Running log of companies building infrastructure for the agentic economy. Updated as we discover new players.

**Purpose**: Scout mode only — watch for tripwire signals, don't build toward this yet.

---

## Companies

### T54.ai
**URL**: https://www.t54.ai/
**Category**: Agent identity & trust infrastructure
**Tagline**: "Empowering Trusted Agentic Economy"

Identity and trust layer for autonomous agents. Three core modules:

1. **Identity & Verification** — KYA (Know Your Agent): developer KYB, model provenance, human-agent binding, intent attestation
2. **Risk & Fraud (Trustline)** — Real-time risk engine evaluating agent-native signals: identity, code audit, mandates, behavioral patterns, device context
3. **Platform** — Agent-owned accounts, real-time monitoring, settlement across blockchain rails (primarily XRPL)

**Products**:
- `x402-secure` — Open-source SDK + proxy layer adding verified identity and risk controls to x402 payments (built on Coinbase's x402 protocol)
- `Claw Credit` — First agent-native credit product; agents build credit profiles over time without managing private keys

**Why it matters**: Building the trust/compliance layer for agent-to-agent payments. Focused on x402 protocol (blockchain/XRPL rails). Different stack from RebelFi's stablecoin yield infrastructure, but relevant if agentic financial transactions scale.

---

### Skyfire
**URL**: https://skyfire.xyz/
**Category**: Agent payments & identity
**Tagline**: "The Agentic Commerce Platform"

Payments + identity infrastructure for AI agents. Enables AI to transact autonomously without human involvement. Positioning: "drive commerce for the world's fastest-growing consumer base: AI agents."

**Core capabilities**:
- **Autonomous payments** — Agents pay for services via API without human approval
- **KYA (Know Your Agent) identity** — Verified agent identity for autonomous account creation and service access
- **Merchant/service monetization** — Enables businesses to sell to AI agents as a new customer segment

**Flow**: Agent makes service request → KYA identity verification + payment check → Service delivered + agent charged

**Traction indicators**: Featured in mainstream press (Business Insider, American Banker); significant partner ecosystem visible on site.

**Why it matters**: Closest to a fully-formed agent payments network. More consumer/commerce-oriented than T54 (which leans compliance/blockchain). If agent payment volume crosses $1M/month anywhere, Skyfire is likely where to look first.

---

### Sapiom
**URL**: https://www.sapiom.ai/
**Raised**: $15.75M Seed (Feb 5, 2026) — Accel-led
**Investors**: Accel, **Anthropic**, **Coinbase Ventures**, Okta Ventures, Gradient, Menlo, Array, Formus, Operator Collective. Angels: Shopify, OpenAI, Vercel, GitHub, Circle, Mercury.
**Category**: Agent service procurement / autonomous spend API
**Tagline**: "Instant access to paid services for AI agents"

Financial layer that enables AI agents to autonomously purchase APIs, compute, SaaS services, and digital infrastructure. Single SDK wrapper around existing HTTP client (Axios/Fetch) — 5 lines of code integration.

**Core architecture**: HTTP SDK wrapper → Sapiom intercepts API calls → handles auth, payment, policy enforcement, logging behind the scenes. No vendor setup required.

**Service catalog**: 400+ AI models, web search, browser automation, compute sandboxes (via Blaxel), Redis/vector data, image generation, audio, messaging, SMS/email verification (via Prelude), web scraping (via Firecrawl).

**Governance layer**:
- Rules engine (budget caps, vendor allowlists, spending policies)
- Agent identity management (KYA — Create/manage agent identities)
- Activity dashboard (spend charts, leaderboards, audit trail)
- Transaction lifecycle (create → add costs → add facts → complete)

**Key integrations**: LangChain, Axios, Fetch, Node.js. **MCP Server already live** (Core, Compute, Database, Messaging, Scraping tools).

**x402 integration**: Has `reauthorize transaction with x402 payment data` endpoint — stablecoin/crypto bridge already baked in.

**What they're NOT doing**: Yield on idle balances, DeFi/on-chain transaction verification, Solana, agent-to-agent escrow, agent credit scoring.

**Threat level**: Medium-High. Different stack (fiat vs. on-chain) but same category label. Anthropic investor = Claude agent distribution channel. MCP already live while E7 is still planned.

**Full analysis**: [[__PROJECTS/agentic-economy/research/sapiom-competitive-analysis-2026-03-03]]

---

### Catena Labs
**URL**: https://catenalabs.com/
**Raised**: $18M Seed (May 20, 2025) — a16z crypto-led
**Investors**: a16z crypto (lead), Breyer Capital, **Circle Ventures**, **Coinbase Ventures**, CoinFund, Pillar VC, Stanford Engineering. Angels: Tom Brady, Balaji Srinivasan (ex-Coinbase CTO), Kevin Lin (Twitch), Sam Palmisano (ex-IBM CEO), Bradley Horowitz (Google VP).
**Category**: Agent banking / regulated financial institution + open commerce protocol
**Tagline**: "How AI Uses Money"

Building the "first AI-native regulated financial institution" — a bank purpose-built for AI agents. Founded by **Sean Neville** (Circle co-founder, USDC co-inventor, still on Circle board) and **Matt Venables** (SVP Product Engineering at Circle).

**Open-source layer — Agent Commerce Kit (ACK)**:
- **ACK-ID**: Agent identity via W3C DIDs + Verifiable Credentials. Hierarchical: Owner (KYC'd entity) → Agent (derived DID). "Proof of Agency" chain.
- **ACK-Pay**: Transport-agnostic payment protocol. Settlement-network-agnostic (fiat, crypto, cards). Positions x402 as "a subset of ACK-Pay." Cryptographic receipts as VCs.
- **Status**: v0.10.1, MIT licensed, 130 stars, sub-300 npm downloads/month. Real code but low adoption.

**Proprietary agent banking product**:
- Agent-owned USDC accounts on Base
- Two-layer security: intelligence (ACK-ID) + enforcement (Turnkey secure enclave)
- 2-of-3 multi-sig custody (customer passkey + agent + Catena treasury agent)
- Policy-controlled transactions with hardware enforcement
- Treasury management with **APY portfolio view** (yield territory)
- Human-in-the-loop approval flows
- "Client Zero" since Dec 18, 2025 (managing own corporate funds)

**Partnerships**: Circle (Arc L1 blockchain), Turnkey (wallet infra), Google (A2A protocol)

**What they're NOT doing**: Pre-signing transaction verification, DeFi-native intelligence (MEV, slippage, protocol risk), transaction simulation/intent matching, Solana-native infrastructure, yield generation (display only).

**Threat level**: **High for Silk Accounts** (direct overlap: policy-controlled agent accounts, custody, yield display). **Low-Medium for Verification SDK** (zero pre-signing capability — our uncontested territory). **High for standards-setting** (a16z + Circle backing could make ACK the default protocol).

**Key concern**: Their two-layer thesis ("Intelligence without enforcement is just prompt suggestions. Enforcement without intelligence is just a dumb access list") is nearly identical to RebelFi's Verification SDK + Silk Accounts framing. They'll fill the verification gap eventually.

**Full analysis**: [[__PROJECTS/agentic-economy/research/catena-labs-competitive-analysis-2026-03-04]]

---

### Natural
**URL**: https://www.natural.co/
**Raised**: $9.8M Seed (October 2025) — Abstract + Human Capital co-lead
**Investors**: Abstract (Ramtin Naimi), Human Capital, Forerunner (Kirsten Green), Terrain, Restive, Genius. Angels: Zach Abrams (Bridge CEO), Immad Akhund (Mercury CEO), Eric Glyman & Karim Atiyeh (Ramp CEO & CTO), Guillermo Rauch (Vercel CEO), Pete Koomen (YC GP), Art Levy (Brex CBO), Itai Damti (Unit CEO), Privy co-founders, Figure CEO, Notion co-founder, Bland CEO, Browserbase CEO, Increase CEO.
**Founded**: August 12, 2025. **Public launch**: March 10, 2026.
**Team**: 10 people (SF-based); growing to 25. CEO: Kahlil Lalji (prev. Ivella, YC-backed).
**Category**: Agentic payments platform / agent wallets (fiat-first)
**Tagline**: "Frictionless money movement between agents, businesses, and consumers"

Fiat-first (ACH-native) agentic payments platform. Full stack: wallets, payments, identity, compliance, observability, disputes. FDIC-insured accounts via bank partners. "A single balance interoperates across fiat and stablecoins" — but stablecoin is secondary, ACH is primary.

**Live products**: Wallet (FDIC-insured agent accounts, spending limits), Pay (agent pays anyone via API), Identity (JWT-based agent identity + permissions), Observability (activity logs), Disputes (managed dispute resolution), Compliance (automated KYB/KYC/AML).

**Coming soon**: Collect, Credit (agent credit lines — no pre-funding), Bill (outcome/usage-based billing), Transfer.

**Pricing**: Basic 1.5% per transaction, Credit 3%.

**Integration**: Python SDK, TypeScript SDK, API-first. MCP listed as integration path.

**Target markets**: Logistics (freight), Home Services, Property Management (contractors), Marketing, Financial Services — all B2B embedded.

**What they are NOT doing**: Yield on idle balances, pre-signing transaction verification, DeFi protocol risk intelligence, Solana support, stablecoin-native architecture, trading bot market, vibe coder micro-merchants.

**Threat level**: **Medium-High for Silk Accounts** (conceptual overlap: agent wallets + spending controls — but fiat-first, no yield, no DeFi). **Low for Verification SDK** (zero pre-signing capability; their observability is post-execution logging — a completely different function). **None for Yield Track.**

**Key concern**: "Single balance interoperates across fiat and stablecoins" is a statement of expansion intent. Watch for yield features on stablecoin balances in Q2/Q3 2026 — that closes a key RebelFi differentiation gap.

**Partner angle**: Natural accumulates idle stablecoin balances with no yield → future integration target for RebelFi yield infrastructure (same thesis as Sponge). Not actionable until both products are live.

**Full analysis**: [[__PROJECTS/agentic-economy/research/natural-competitive-analysis-2026-03-11]]

---

### Locus
**URL**: https://paywithlocus.com/
**Raised**: YC F25 standard deal (~$500K / ~7%). No disclosed seed round.
**Founders**: Cole Dermott (ex-Coinbase B2B payments) + Eliot Lee (ex-Scale AI data pipelines). Team: 2.
**Category**: Agent payment infrastructure / policy-controlled agent wallets / service marketplace
**Tagline**: "Agents Can Pay. Locus Makes It Safe."

Policy-controlled agent payment infrastructure on Base (EVM), USDC-only. Core pitch: "the control layer" on top of existing payment rails — spending limits, vendor allowlists, required justification, full audit trails. Founded by ex-Coinbase and ex-Scale AI engineers who converged on "the bottleneck isn't intelligence: it's trust."

**Products**:
1. **Smart Wallets** — ERC-4337 on Base, gasless via paymaster. Two-key model: user key (never stored on Locus) + permissioned key (AWS KMS). Subwallet system for time-limited escrow (email sends, agent-to-agent). UUPS upgradeability disabled — immutable implementation.
2. **USDC Transfers** — Direct to addresses or email (subwallet escrow + one-time password claim flow).
3. **Tasks** *(newest feature)* — "Agents Can Now Hire Human Taskers." Agent selects freelance work category (design, content, dev) + timeline + price tier. USDC locked in smart contract until delivery. Direct competitor to Handshake escrow primitive — but for human labor markets, not agent-to-agent DeFi.
4. **Checkout / Payment Router** — On-chain smart contract on Base for merchant checkout (`0x34184b7bCB4E6519C392467402DB8a853EF57806`). Emits `CheckoutPayment` events with session binding. Agents or external wallets (MetaMask, Coinbase Wallet) can pay.
5. **Wrapped APIs** *(most strategically significant)* — The "rack" concept from RebelFi's Agent OS gameplan, fully executed. Agents call external APIs (Firecrawl, Exa, Resend, Clado, Browser Use, fal.ai, Abstract API) via a single Locus API key. Locus adds $0.003/call fee, handles all upstream API relationships. This is live and growing.

**Key partnerships**: Co-hosted first-ever agentic payments hackathon at YC HQ with Coinbase Dev Platform. Built reference implementation of OpenAI's ACP (Agentic Commerce Protocol). Deeply embedded in Base/Coinbase ecosystem.

**What they are NOT doing**: Yield on idle balances, Solana support, pre-signing DeFi transaction verification, intent matching, protocol risk intelligence, agent credit scoring. ACH/wire listed as "coming soon" — not live.

**Threat level**:
- **Silk Accounts**: Medium — overlapping control layer concept, but different chain (Base vs Solana), custodial vs. non-custodial, no yield
- **Handshake escrow**: Medium for human labor markets; Low for agent-to-agent DeFi (different target, different chain)
- **Agent OS "rack"**: **HIGH** — they have executed what RebelFi has on Phase 2 roadmap, on EVM. The Solana + yield version remains open.
- **Verification SDK**: **Low** — zero pre-signing capability; policy enforcement is account-level, not per-transaction intent verification
- **Yield Track**: **None** — no yield product, no plans visible

**Partner angle**: Two real integration points: (1) Yield on idle Locus wallet balances — same thesis as Sponge/Natural, not actionable until RebelFi has live yield product. (2) Verification SDK before Checkout `pay()` call — pre-payment intent verification is a natural complement to their control layer. Also: Locus has no MCP, making them a potential MCP distribution partner if RebelFi ships E7 first.

**Full analysis**: [[active/research-locus-competitive-analysis-2026-03-11]]

---

### Sponge
**URL**: https://paysponge.com/
**Raised**: YC-backed (amount undisclosed)
**Category**: Agent wallets, x402 service marketplace, agent financial execution
**Tagline**: "Financial infrastructure for the agent economy"

Custodial crypto wallets purpose-built for AI agents + a service discovery marketplace where agents pay via x402 (USDC micropayments) to access external APIs. Two core products:

1. **Wallets** — Agent-owned custodial accounts with spending limits, destination allowlists, fleet management via master keys, audit logs, pause/resume lifecycle controls. SDK (`@spongewallet/sdk`) + MCP server. EVM + Solana.
2. **Gateway** — Businesses sell services directly to agents via x402 auto-payment. 3-step: discover → get service details → fetch with USDC auto-pay.

**Technical architecture**:
- TypeScript SDK (`SpongeWallet` + `SpongeAdmin` classes); MCP server for Claude Desktop
- Custodial (they hold keys; agents get API keys scoped by permission)
- Chains: Ethereum, Base, Solana (mainnet); Sepolia, Base Sepolia, Solana Devnet, Tempo (testnet)
- Swaps: Jupiter (Solana), 0x (Base)
- Bridge: deBridge (cross-chain)
- Integrations: Polymarket, Hyperliquid, Amazon checkout, Laso Finance prepaid Visa cards

**Products / capabilities**:
- Per-agent spending limits (per-tx, hourly, daily, weekly, monthly)
- Destination allowlists and address controls
- Master key fleet management (create/manage/pause/delete agents programmatically)
- x402 service catalog: search, image gen, LLM, crawl, data, predict, parse, prospect, crypto_data
- Multi-step plan submission + approval flow
- Claude integration: first-class MCP + direct tool calling. Supported in Claude Code, OpenClaw, Codex.

**Critical safety gap (their own words)**:
> "By default, Claude can execute transfers without confirmation. Consider implementing approval flows for production use."

They expose a `beforeExecute` hook in their tools API — a literal plug-in point for RebelFi's Verification SDK — but provide zero verification intelligence themselves.

**What they're NOT doing**: Yield on idle balances, pre-signing transaction verification, intent matching, DeFi protocol risk intelligence, KYA/KYB compliance, fiat rails, enterprise operator governance layer.

**Threat level**: **Medium-High for Silk Accounts** (overlapping: custodial agent accounts, spending limits, allowlists, fleet management — but missing yield, enterprise governance, compliance). **Low for Verification SDK** (the `beforeExecute` hook is an integration point, not competition). **None for Yield Track.**

**Partner angle**: RebelFi could (1) plug verification into their `beforeExecute` hook, (2) offer yield on idle Sponge agent balances via Dakota, (3) list verification as a paid service in their x402 catalog.

**Full analysis**: [[__PROJECTS/agentic-economy/research/sponge-competitive-analysis-2026-03-09]]

---

### Ampersend
**URL**: https://www.ampersend.ai/
**Raised**: Unfunded (Edge & Node internal product — The Graph Protocol team)
**Team**: Doug Antin (blog lead), Noelle Becker Moreno (strategy). Full Edge & Node org behind it.
**Launched**: Open beta April 1, 2026
**Category**: Agent spend governance / policy enforcement layer
**Tagline**: "The control layer for the agent economy"
**First tracked**: 2026-04-06

Spend governance and policy enforcement layer for AI agent payments. Demand-gen hook: real incident of multi-agent loop burning $47,000+ in 11 days with no circuit breaker. Architecture claim: spending limits live at the **wallet layer, not application code** — a runaway bug cannot bypass them. Two-sided platform: buy side (spend control) + sell side (service governance).

**Technical architecture**:
- **ERC-4337** smart accounts (one wallet per agent)
- **ERC-7579** modules, Rhinestone OwnableValidator
- **x402 protocol** (Coinbase's HTTP-native payment standard) — `exact` scheme live; `deferred` scheme contributed to spec but not yet live
- **ERC-8004** agent identity + registry standard — co-authored with Ethereum Foundation dAI team
- **USDC only** | **Base (mainnet + Sepolia) only — no other chains**
- **SDK**: PyPI (Python) + npm (TypeScript)
- **Integrations**: Google ADK, Google A2A, LangChain, MCP

**Buy side capabilities**: Daily/monthly/per-transaction spend limits, merchant allowlists, human-in-the-loop escalation, instant block/suspend, auto top-up, auto-collect (sweep idle funds to main), session keys.

**Sell side capabilities**: Per-request pricing, rate limits, agent verification requirements, minimum balance checks before serving.

**Observability**: Real-time dashboards, full audit log with per-decision reasoning, CSV export.

**Strategic partnerships**: Coinbase (x402 co-builder), Google (A2A + ADK), Ethereum Foundation dAI team (ERC-8004 co-author).

**What they're NOT doing**: Intent verification (they check *amounts*, not transaction semantics), yield on idle balances (wallets are dead capital), fiat onramp/offramp (marked "coming soon"), Solana, multi-step flow orchestration, DeFi protocol risk intelligence, counterparty verification, B2B fintech distribution.

**Threat level**:
- **Verification SDK**: **Medium-High** (philosophical overlap — both do pre-payment governance — but fundamentally different depth. Ampersend: "is amount within limits?" Agent CLI: "does this transaction match what the user intended?" The leap from spend limits to semantic intent verification is architectural and 12-18 months of product work)
- **Silk Accounts**: **Medium** (spend limits + wallet per agent is conceptually similar to Silk Accounts, but no yield, Base-only, not DeFi-native. The gap is yield + Solana + semantic verification)
- **Yield Track**: **None** (wallets earn nothing — explicitly acknowledged gap)
- **Standards risk**: **HIGH** — ERC-8004 as the agent identity standard, co-authored with Ethereum Foundation, could create distribution friction if Agent CLI doesn't implement it. Standards battles are winner-take-most. This is the real threat vector.
- **Distribution**: **HIGH** — Edge & Node has a massive developer community from The Graph. Google ADK + A2A integration = enterprise AI agent pipeline that RebelFi doesn't have access to.

**Partner angle**: Adjacent, not overlapping, layers. Ampersend stops runaway loops. Agent CLI verifies intent inside those loops. Natural complement: "You can't spend more than $100/day (Ampersend) AND every transaction within those limits gets verified against your intent before it signs (Agent CLI)." **Not actionable until Agent CLI ships EVM support** — Ampersend is Base-only.

**Key tripwire signals to watch**:
1. Fiat onramp/offramp launches → assess if they add yield to idle USDC
2. Solana support announcement → direct competition on Agent CLI's home turf
3. Semantic/intent verification features → closing the core moat
4. ERC-8004 adoption by major wallets or agent platforms → standards leverage intensifies
5. External funding raise → execution velocity acceleration

**Full analysis**: [[active/ampersend-competitive-analysis-2026-04-06]]

---

### AgentCash (Merit Systems)
**URL**: https://agentcash.dev / https://merit.systems
**Raised**: $10M Seed (January 16, 2025) — a16z crypto + Blockchain Capital (co-leads); $55.5M post-money
**Team**: Sam Ragsdale (CEO, ex-a16z zkVM researcher), Mason Hall (Head of Strategy, ex-a16z), Ryan Sproule (co-founder, ex-Blockchain Capital). HQ: Brooklyn, NY.
**Category**: Agent API payments / x402 developer tooling / agentic commerce infrastructure
**Tagline**: "One balance, access to every API on the internet."
**First tracked**: 2026-04-06

CLI + MCP server that gives AI agents instant access to 374+ paywalled APIs via USDC micropayments — no subscriptions, no API keys. Agent hits a paid endpoint → gets HTTP 402 → AgentCash signs USDC payment with local wallet → retries with payment credential → data returned. Built on x402 (Coinbase's open standard); also supports MPP (Stripe/Tempo).

**Technical architecture**:
- Local Ethereum keypair at `~/.agentcash/wallet.json` (plaintext — notable security risk at scale)
- USDC on Base (default), Ethereum, Optimism, Arbitrum, Polygon; $0.001–$0.10/request
- MCP server mode: installs into Claude Code, Cursor, Claude Desktop, Codex, Windsurf, Warp, 14+ clients
- MCP tools: `fetch`, `get_balance`, `list_accounts`, `check_endpoint_schema`, `discover_api_endpoints`
- NPM package: `agentcash@latest`; `npx agentcash onboard` for setup

**API catalog (Merit Systems sub-brands)**:
- StableEnrich (people/company enrichment — 30 routes)
- StableStudio (image/video gen — 28 routes)
- StableSocial (Instagram, TikTok, YouTube, Reddit — 45 routes)
- StableEmail (transactional/outreach — 24 routes)
- StableTravel (flights, hotels, activities — 70 routes)
- StableUpload (file hosting — 10 routes)
- Plus any x402/MPP endpoint registered on x402scan.com or mppscan.com (both Merit Systems products)

**Merit Systems full product suite**:
1. x402scan.com — x402 protocol endpoint discovery registry
2. mppscan.com — MPP protocol endpoint discovery registry
3. AgentCash — developer tool
4. Poncho — consumer-facing agent product (poncho.merit.systems)

**Traction (self-reported, April 2026)**:
- 65,797+ installs
- 411,321+ API calls
- 374+ endpoints
- 2,000+ active agents (Bitcoin.com, Mar 23, 2026)
- Launched March 10, 2026; Solana support added March 14, 2026

**Strategic narrative**: Sam Ragsdale published "Open Agentic Commerce and the End of Ads" on a16z crypto blog (March 21, 2026). Thesis: AI agents don't click ads → ad model dies → x402 micropayments replace it → open protocols (x402/MPP) beat walled gardens (ChatGPT ACP / Gemini UCP). Fortune coverage March 30, 2026.

**What they are NOT doing**: Yield on idle agent balances, pre-signing DeFi transaction verification, intent-to-transaction matching, protocol risk intelligence, agent spending controls/policies, enterprise KYB/KYC, stablecoin ramping, custody, yield-bearing accounts. Their APIs are data services (enrichment, images, social data, travel) — not financial transactions.

**Threat level**:
- **Silk Accounts**: **Low** — No custody, no policy engine, no compliance. Local plaintext wallet is antithetical to Silk Accounts' model.
- **Verification SDK**: **Low** — Zero pre-signing capability. Their payment layer is fire-and-forget micropayments ($0.001–$0.10), not high-stakes financial transaction verification.
- **Yield Track**: **None** — No yield product whatsoever.
- **Positioning**: **Low** — Operates at a categorically different layer (agent-pays-for-data vs. agent-handles-financial-transactions).
- **Future risk**: **Watch** — If they add financial API endpoints (StableFinance?) or Poncho handles user funds at scale, the overlap increases. a16z crypto backing means they have the network and credibility to expand.

**Partner angle**: Three concrete opportunities:
1. **Idle USDC yield**: 65K+ agent wallets with idle USDC earning nothing. RebelFi yield infrastructure is the natural integration. Same thesis as Sponge/Natural/Locus — but AgentCash has the largest validated agent wallet install base to date.
2. **Verification SDK as x402 service**: Register RebelFi's Verification SDK on x402scan.com as a paid endpoint ($0.01/call). Instant discovery to 65K+ developer wallets with zero additional GTM cost.
3. **MCP co-distribution**: AgentCash MCP + RebelFi MCP are complementary (data payments vs. financial safety). Potential co-install or partner listing once RebelFi MCP (E7) ships.

**Key tripwire signal**: Watch x402scan.com for any "StableFinance" or financial transaction endpoints from Merit Systems. That's the signal they're entering RebelFi's lane.

**Full analysis**: [[active/research-agentcash-competitive-analysis-2026-04-06]]

---

### Stablerail
**URL**: https://stablerail.com/
**Category**: Agentic treasury management for stablecoin operations
**Tagline**: "The Agentic Treasury for Stablecoin Operations"

Non-custodial treasury management platform for companies moving stablecoins at scale ($1-50M/year). Core pitch: "Agents verify the intent. Humans sign the transaction." AI copilots handle verification, policy enforcement, and risk screening — humans retain signing authority via MPC-secured vaults.

**Core architecture**: Three-layer system:
1. **Policy Engine** — Limits, roles, whitelists, time windows enforced programmatically. "Even the CEO cannot bypass the code."
2. **Pre-Flight Risk Dossier** — PASS / FLAG / BLOCK verdicts with plain-English evidence before signing.
3. **Proof-of-Control** — CFO-grade audit receipt for every payment (what, why, who approved, risk verdict).

**Products / capabilities**:
- Batch payout runs (CSV upload → agent validation → one-sig execution of 500+ transfers)
- Smart cool-off periods ($100K+ or new beneficiaries trigger automatic delay)
- Verified vendor whitelists ("Golden Source" of approved payees; address changes lock payment for escalation)
- One-time deposit addresses (disposable receiving addresses per invoice)
- Internal sweeps with own-account verification
- Role-based approval workflows with step-up for risk
- Sanctions/watchlist screening + on-chain taint analysis
- Jurisdiction-aware rules by entity/country/business unit
- Freeze-risk prevention (flags patterns that trigger stablecoin issuer freezes)
- Behavior-based anomaly detection (time, size, destination)
- Slack/Teams notifications with approval links

**Security model**: MPC-secured vaults, non-custodial (Stablerail has no unilateral signing power). AI operates in verification layer only — cannot hold keys, initiate transfers, or sign. SSO/SCIM, enforced MFA, hardware keys for signers.

**Team**: Claims UBS engineering DNA, MiCA regulatory experience. "Built from scar tissue — we created the system we needed while running high-risk flows."

**Pricing**: Annual subscription per company/entity group. Scales with entities, active users, on-chain volume. Targets $1-50M yearly stablecoin volume.

**Blog**: Active as of March 4, 2026 (CFO approval thresholds, audit planning, risk screening, policy enforcement vs. post-transaction monitoring).

**What they're NOT doing**: Yield on idle balances, DeFi trading/swaps, agent-native infrastructure (agents as autonomous economic actors), intent-to-transaction matching (their "intent verification" is policy compliance + risk screening, not semantic intent alignment), Solana, cross-chain orchestration, data flywheel/risk intelligence products, agent identity, flow orchestration, escrow.

**Critical distinction**: Stablerail's "agents verify intent" means agents check policy compliance and counterparty risk before a human signs a treasury disbursement. Agent CLI's intent verification means matching a structured intent (what the agent wanted to do) against raw transaction bytecode (what the transaction actually does). Stablerail verifies **authorization and safety**. Agent CLI verifies **semantic alignment between intent and execution**. Different problems.

**Threat level**:
- **Verification SDK**: **Low** — No intent-to-transaction matching, no transaction deserialization, no DeFi protocol risk intelligence. Their "verification" is policy + compliance, not semantic intent verification.
- **Silk Accounts**: **Low** — Different model (MPC vaults for human treasury teams vs. policy-controlled on-chain accounts for autonomous agents).
- **Yield Track**: **Medium** — Directly competes for the same buyer (companies moving stablecoins at scale). If RebelFi's yield deals (WhizPay, Nomadrem, Delos, Kuratek) also need treasury controls, Stablerail could be in the conversation. However, Stablerail has zero yield capability — funds sit idle in MPC vaults.
- **Positioning**: **Medium** — Their tagline ("Agents verify the intent. Humans sign the transaction.") is close enough to Agent CLI's thesis to create market confusion, even though the underlying capability is fundamentally different.

**Partner angle**: Stablerail accumulates idle stablecoin balances in MPC vaults with zero yield → natural integration target for RebelFi yield infrastructure (same thesis as Sponge/Natural/Locus). Their treasury clients are pre-qualified stablecoin operations — exactly RebelFi's yield track ICP.

---

### Stripe + Tempo
**URL**: https://mpp.dev/ (protocol) / https://docs.stripe.com/payments/machine/mpp (Stripe integration)
**Launched**: March 18, 2026 (mainnet)
**Category**: Machine-to-machine payment protocol + blockchain infrastructure
**Tagline**: "The open protocol for machine-to-machine payments"

Stripe launched the **Machine Payments Protocol (MPP)**, co-designed with **Tempo** (a new L1 blockchain), as an open standard for agents to pay for API requests, tool calls, or content per request in the same HTTP call. Tempo went live on mainnet the same day.

**How MPP works**: Agent requests a paid resource → service responds with HTTP `402` + payment details → agent authorizes payment → resource delivered + receipt issued. Uses the long-dormant HTTP 402 status code as a native payment primitive.

**Two payment rails**:
1. **Crypto** — Direct on-chain payments via Tempo (USDC stablecoins on Tempo's L1). Stripe handles deposit addresses and auto-captures PaymentIntents on settlement.
2. **Fiat** — Cards, wallets, BNPL via Shared Payment Tokens (SPTs). Agents use pre-authorized tokens for traditional payment methods.

**For Stripe businesses**: MPP payments appear in the standard Stripe Dashboard — same API, same settlement, same payout schedule, same fraud protection. The killer integration: businesses already on Stripe can accept agent payments with a few lines of code.

**Early partners**: Browserbase (headless browsers per session), Postalform (print & mail), Prospect Butcher Co. (sandwich ordering), Stripe Climate (carbon removal). Parallel (Parag Agrawal's company, ex-Twitter CEO) integrated in "just a few lines of code."

**Broader Stripe agentic suite**: MPP sits alongside Stripe's Agentic Commerce Suite, Agentic Commerce Protocol (ACP), MCP integrations, and x402 support. Stripe is building the full stack for agent-to-business payments.

**Code example** (accepting MPP payments):
```javascript
const paymentIntent = await stripe.paymentIntents.create({
  amount: 1,
  currency: 'usd',
  payment_method_types: ['crypto'],
  payment_method_options: {
    crypto: { mode: 'deposit', deposit_options: { networks: ['tempo'] } }
  },
  confirm: true,
});
```

**What they're NOT doing**: Agent wallets, agent identity, pre-signing transaction verification, DeFi protocol intelligence, yield on balances, cross-chain orchestration. MPP is pure payment rails — the pipe, not the intelligence layer.

**Threat level**:
- **Verification SDK**: **None** — MPP is a payment transport protocol, not a verification layer. No pre-signing capability. No intent matching.
- **Silk Accounts**: **Low** — Different model entirely. MPP is per-request payment, not policy-controlled accounts.
- **Yield Track**: **None** — No yield capability.
- **Standards/distribution**: **HIGH** — Stripe has 3.4M+ businesses. If MPP becomes the default way agents pay for services, it defines the payment layer of the agent economy. Every MPP transaction is a potential surface for Agent CLI's verification SDK (verify before paying).

**Partner angle**: MPP transactions could benefit from pre-payment verification: "Before this agent pays $50 for this API call, verify the agent intended to make this specific purchase." Agent CLI verification as middleware before MPP payment execution is the natural integration point. Also: if Stripe settles MPP payments in stablecoins, those stablecoins need yield infrastructure while held in treasury.

---

### Mastercard + Google (Verifiable Intent)
**URL**: https://verifiableintent.dev/
**Launched**: March 5, 2026 (spec + GitHub)
**Version**: Draft v0.1
**GitHub**: [agent-intent/verifiable-intent](https://github.com/agent-intent/verifiable-intent) — 39 stars, 6 forks
**Category**: Cryptographic agent authorization / delegation chain for commerce
**Tagline**: "Open specification for cryptographic agent authorization in commerce"

Mastercard (CDO Pablo Fourez) and Google (VP/GM Payments Stavan Parikh) co-developed **Verifiable Intent (VI)** — an open spec creating tamper-evident delegation chains that bind AI agent actions to human-approved scope. Uses layered SD-JWT (Selective Disclosure JWT) credentials.

**Core architecture**: Three-layer credential chain:
1. **L1 — Credential Provider SD-JWT** (~1yr lifetime): Binds user identity + public key. Issued by Mastercard/bank.
2. **L2 — User KB-SD-JWT** (15min–30 days): User sets constraints (merchant allowlists, budget caps, item restrictions) OR confirms final values directly. Binds agent's key for delegation.
3. **L3 — Agent KB-SD-JWT** (~5 min): Agent proves it acted within L2 constraints. Split: L3a (payment → network) and L3b (checkout → merchant). Each party sees only relevant claims.

**Two modes**: Immediate (user confirms, 2-layer) and Autonomous (agent delegates, 3-layer).

**Eight constraint types**: Merchant allowlist, line items, payee authorization, amount range, budget cap, merchant-managed recurrence, agent-managed recurrence, checkout-payment cross-reference.

**Privacy model**: Selective disclosure via SD-JWT — merchant sees checkout but not payment details; payment network sees payment but not item details.

**Partners at launch**: Adyen, Basis Theory, Checkout.com, Fiserv, Getnet, IBM, Worldpay/Global Payments.

**Standards alignment**: Compatible with Google's AP2 (Agent Payments Protocol) and UCP (Universal Commerce Protocol). Built on FIDO Alliance, EMVCo, IETF, W3C standards. Apache 2.0 licensed.

**Integration path**: Will be integrated into Mastercard Agent Pay's intent APIs. Developer tools coming to Mastercard Developers portal.

**What they're NOT doing**: DeFi transaction verification, on-chain transaction inspection, protocol risk assessment, MEV/slippage detection, yield on balances, Solana/EVM-native operations, transaction simulation. VI operates entirely within the fiat/card payment ecosystem.

**Critical distinction from Agent CLI**: VI verifies **authorization** ("is this agent allowed to buy this?"). Agent CLI verifies **execution** ("does this transaction actually do what it says?"). VI trusts the merchant's checkout JWT. Agent CLI deserializes raw transaction bytecode. They solve fundamentally different problems in different domains (fiat vs. crypto). See full analysis.

**Threat level**:
- **Verification SDK**: **LOW** (direct) / **HIGH** (naming/positioning) — Different domain entirely, but both use "intent." If VI defines the industry's understanding of "intent verification," Agent CLI's positioning gets muddied.
- **Silk Accounts**: **LOW** — No wallet infrastructure, no on-chain accounts.
- **Yield Track**: **None**
- **Standards risk**: **HIGH** — Mastercard + Google + Adyen + Fiserv + IBM defining "intent" for commerce could pre-empt Agent CLI's terminology.

**What it validates**: The "intent" concept is real. Major payment networks are investing in pre-execution intent verification for agents. The compliance/audit trail angle is confirmed. Constraints model is structurally similar to Agent CLI's control planes.

**Full analysis**: [[__PROJECTS/agentic-economy/research/verifiable-intent-competitive-analysis-2026-03-19]]

---

### Aomi
**URL**: https://aomi.dev/
**SDK**: https://github.com/aomi-labs/aomi-sdk (released March 22, 2026)
**Raised**: No disclosed funding
**Category**: Agent runtime / LLM execution infrastructure for blockchain transactions
**Tagline**: "Your agentic terminal for blockchain automation"

Hosted LLM agent runtime purpose-built for blockchain transactions. Natural language in → simulated, signed transactions out. Non-custodial. Think "AWS Lambda for on-chain agents."

**Core architecture**:
- **Rust backend** (~14K LOC) — stateless agent runtime with session management, tool scheduling, LLM orchestration
- **Plugin SDK** — C ABI (v3) plugins wrap APIs as LLM-callable tools. 9 production apps: DeFi aggregation (DeFiLlama), OTC (Delta RFQ), order flow (Khalani), prediction markets (Polymarket/Kalshi/Simmer), MPC wallets (Para), GameFi (Molinar), social, Twitter/X
- **Simulation-first** — every transaction simulated on Anvil fork before signing. User sees exact outcome (token changes, gas, contract calls)
- **Non-custodial** — signing via WalletConnect/Reown AppKit. Never holds keys or funds
- **Multi-model** — Claude, GPT-4, OpenRouter models. Switchable at runtime
- **Multi-channel** — web widget (shadcn), headless React library, Telegram bot, iOS

**Chain support**: EVM only (Ethereum, Base, Arbitrum, Polygon, Optimism). **Solana on roadmap** (FAQ).

**Business model**: Services-heavy (consultation + custom build + managed orchestration). No public pricing. "Book a call" model. Revenue from hosted runtime fees.

**Team & traction**: Very early. Single visible contributor (CeciliaZ030). SDK: 1 star. GitHub org: 3 followers. Contact email: info@foameo.ai (parent entity?). Copyright 2025.

**Key distinction — simulation vs. verification**: Aomi simulates transactions to answer "will this succeed on-chain?" Agent CLI verifies intents to answer "does this match what the user wanted?" These are **complementary, not competitive**. A swap at 50% slippage will simulate successfully — Aomi lets it through. Agent CLI flags it as economically insane.

**What they're NOT doing**: Pre-signing intent verification, yield on idle balances, policy/spending controls (no Silk Accounts equivalent), risk assessment (counterparty, protocol, economic sanity), behavioral data capture/data moat, flow orchestration, Solana support. Stateless by design — no behavioral data retained.

**Threat level**:
- **Verification SDK**: **None** — completely different layer. Simulation ≠ verification.
- **Silk Accounts**: **Low** — no policy controls, no spending limits. Watch for their "account abstraction (coming soon)" feature.
- **Yield Track**: **None**
- **Trading bot mindshare**: **Low-Medium** — if they gain traction with EVM trading bots, they could capture the same beachhead market. But EVM-only, and our verification adds value on top of their execution.

**Partner angle**: Agent CLI verification SDK could be an **Aomi tool** or app — called between transaction construction and signing. Natural integration point in their pipeline. Also: yield on balances held in Aomi-connected wallets.

**Full analysis**: [[aomi-competitive-analysis]]

---

### Bankr
**URL**: https://bankr.bot
**Announced x402 Cloud**: April 2026
**Category**: Agent financial infrastructure / self-funding flywheel / x402 Cloud hosting
**Tagline**: "Financial rails for self-sustaining AI agents"

Self-funding agent flywheel platform built on meme token trading. Core loop: agent wallet → launch token → earn 57% of swap fees → fees fund LLM compute via LLM Gateway → agent operates indefinitely. x402 Cloud is their new expansion into agent payments infrastructure.

**x402 Cloud (new)**:
- Deploy serverless paid API endpoints via CLI; Bankr wraps x402 payment protocol automatically
- Agents call endpoint → receive HTTP 402 + price → pay USDC on Base → endpoint executes → on-chain settlement
- "Settle-after-response" — payment only collected if endpoint returns successfully
- Auto-discoverable by AI agents
- Pricing: Free (1K req/mo), Pro (5% fee), Enterprise (3%)
- Developer never needs to understand x402 protocol — fully abstracted

**Wallet API** (programmatic): Read (balances, portfolio, PnL); Write (ERC20/native transfer, sign, submit). EVM-only for writes (Base primary). Access controls: IP allowlist, recipient allowlist, read-only flag. No Solana on programmatic API.

**Agent API** (natural language → execution): Swaps, limit orders, DCA, TWAP, stop orders, leveraged trading, Polymarket, NFTs, transfers. Solana supported here (Jupiter). Natural language in, signed transactions out.

**Sentinel** (their "security layer"): Blacklist-based checks — malicious contracts, phishing patterns, prompt injection. This is NOT intent verification. A semantically wrong transaction through a clean contract passes Sentinel. Zero transaction bytecode inspection.

**LLM Gateway**: OpenAI-compatible proxy (OpenAI, Anthropic, Google). Trading fees fund inference automatically. Claude Plugins + OpenClaw Skills integrations live.

**Cross-chain support**: Base (primary), Ethereum, Polygon, Unichain, Solana. Gas-sponsored on supported chains.

**What they're NOT doing**: Pre-signing intent verification, yield on idle balances (fee collection only), on-chain policy enforcement (no Silk Accounts equivalent), KYA/KYB compliance, fiat rails, behavioral data moat, agent credit scoring, multi-step flow orchestration with yield-bearing wait states.

**Threat level**:
- **Verification SDK**: **None** — Sentinel ≠ intent verification. No bytecode inspection, no intent-to-transaction matching.
- **Silk Accounts**: **Low** — API-key-level access controls, not on-chain policy primitives with per-operator spending enforcement.
- **Yield Track**: **Low-Medium** — agents hold USDC with zero yield. Same idle-balance gap as Sponge/Natural/Locus, but Bankr agents are likely more active traders with real float.
- **Beachhead mindshare**: **Medium** — live Claude plugin + OpenClaw integration, live Solana via Jupiter, active crypto-native agent user base = same segment Agent CLI is targeting. If they add shallow intent verification (Sentinel v2), they become a mindshare gatekeeper.

**Partner angle**: (1) Deploy `verify_transaction` as a Bankr x402 Cloud service — auto-discoverable distribution to their agent user base. (2) Agent CLI Verification SDK as Sentinel extension — upgrades their security from blacklist to intent-aware, gives Agent CLI access to their agent base. (3) Yield on idle agent USDC balances — same thesis as Sponge/Natural/Locus; revisit when yield track is proven.

**Full analysis**: [[bankr-competitive-analysis-2026-04-06]]

---

### Compass Labs
**URL**: https://www.compasslabs.ai/
**Founded**: 2022 (London)
**Raised**: $1.5M pre-seed (March 2024)
**Accelerators**: a16z Crypto CSX Spring 2024, Stanford Blockchain Accelerator, Creative Destruction Lab, Entrepreneurs First W'23
**Category**: DeFi-as-a-Service infrastructure for fintechs
**Tagline**: "The DeFi layer for fintechs and neobanks"

DeFi infrastructure API/SDK enabling fintechs, wallets, and neobanks to embed yield, swaps, credit, and portfolio management without writing smart contracts. Non-custodial. Gas-abstracted. Embeddable React widgets.

**Products (all live)**:
- **Earn** — 3-10% APY on stablecoins via Aave, Morpho, Pendle, ERC-4626 vaults, Sky, Ethena. Variable + fixed.
- **Credit** — Borrow USDC against crypto holdings. Collateral keeps earning yield.
- **Swaps & Transfers** — Token exchange, cross-chain USDC bridging (CCTP).
- **Portfolio Manager** — Rebalance across DeFi venues in one atomic transaction.
- **Studio** — Embeddable React widgets for savings products. Try-before-buy.
- **Data** — Position tracking, balances, portfolio analytics.

**Key features**: Gas abstraction (users never need ETH), transaction bundling (50-70% gas savings), Product Accounts (isolated per feature), embedded fees (platforms monetize transactions), ISO 27001 compliant.

**Chains**: Ethereum, Base, Arbitrum. **No Solana.**

**Team**: Elisabeth Duijnstee (CEO, PhD Condensed Matter Physics Oxford, ML fellow), Rohan Tangri (Co-founder, Imperial College MEng, ex-JPMorgan data scientist, PhD candidate ML). 1-10 employees.

**Known customers**: THORWallet (Swiss wallet, Earn feature live, 2-week integration), OpenTrade (listed as "trusted by").

**Pivot history**: Originally built "Dojo" — agent-based DeFi simulation platform (agent-environment loop on blockchain forks). Completely pivoted to DeFi-as-a-Service for fintechs. Old `/docs/agents` page returns 404. Dojo deprecated.

**AI angle**: LLM-formatted docs so Claude/Cursor can generate integration code. Marketing positioning, not product differentiation. No agent execution, no agent safety, no autonomous agent infrastructure.

**Revenue model**: Embedded fees (platform sets % on deposits/withdrawals/swaps). Compass charges unknown (per-API-call? SaaS? Revenue share?).

**What they're NOT doing**: Pre-signing intent verification, agent safety/verification, yield operations (monitoring, auto-execution, risk exits), custody integration (institutional custody like Fireblocks/Tatum), fiat on-ramp, Solana, stateful flow orchestration (escrow, multi-party approvals), KYT/Travel Rule/sanctions compliance, Sharia-compliant yield, behavioral data capture.

**Critical distinction**: Compass is a DeFi **access** API — constructs transactions, user signs, done. RebelFi (Midas) is a DeFi **operations** layer — continuous monitoring, proactive execution, risk exits, custody integration, compliance, stateful flow logic. Compass leaves all lifecycle management to the customer.

**Threat level**:
- **Verification SDK**: **None** — zero overlap. No agent execution, no intent matching, no transaction inspection.
- **Silk Accounts**: **None** — non-custodial wallet-signing model, no policy-controlled accounts.
- **Yield Track**: **HIGH** — Direct competitor. Same customer archetype (fintechs with idle stablecoin balances), same underlying protocols (Aave, Morpho), same pitch ("embed yield, revenue from day one"). Their "2 weeks to ship" THORWallet story + a16z credibility + self-serve model = strong GTM. Mitigated by: no custody integration, no monitoring/auto-execution, no compliance tooling, no Solana, no operational float yield (workflow-embedded yield).
- **Positioning**: **Medium** — "DeFi layer for fintechs" is clean and marketable. Could capture category mindshare before RebelFi's more nuanced "operations infrastructure" positioning lands.

**Partner angle**: Unlikely. Overlapping yield customer base makes partnership awkward. Possible complementary use if a customer needs multi-chain yield (Compass for EVM, RebelFi for Solana) — but this is edge-case.

**Full analysis**: [[active/research-compass-labs-competitive-analysis-2026-04-07]]

---

### publish.new
**URL**: https://publish.new/
**Built on**: Paragraph.com infrastructure
**GitHub**: [publish-new/cli](https://github.com/publish-new/cli)
**Category**: Agent-native content marketplace / zero-friction publishing + monetization layer
**Tagline**: "Go from 0 to $1. Anyone can earn their first dollar online now."
**First tracked**: 2026-04-07

Zero-friction content publishing and marketplace with dual payment rails: humans pay via checkout, AI agents pay via **x402** (Coinbase's HTTP-native machine payment standard). Same URL handles both — no configuration required. Core mechanic: upload file → set USD price → get shareable link. No account or wallet required to publish. CLI tool available on GitHub.

**Four asset types**:
1. **File** — Markdown, PDFs, images, datasets, code. Standard upload-and-sell.
2. **API** — Paste a private API endpoint URL. publish.new fetches it on buyer payment; the source URL stays private. Primitive gated API delivery.
3. **Link** — Gate access to an external URL (private Notion page, Google Doc, etc.).
4. **Repo** — Code repositories.

**Marketplace traction (April 2026)**: Live at `/market` with volume tracking. Real sales: Polymarket trader data (64K wallets, PnL, bot detection) at $1.00 (5+ sold); newsletter archives at $2.00 (1–2 sold). Developer test items at $0.01 with 6–18 sales each — indicates active x402 payment flow experimentation. Total volume is small but the mechanism is real and transacting.

**What they're NOT doing**:
- Agent-as-creator workflows — no `POST /publish` API or SDK for programmatic agent publishing. Humans upload; agents buy.
- Versioning — no "same URL, new version" primitive, no revision history
- Collaboration — no comments, inline annotation, co-editing, or roles
- Asset lifecycle states — no draft/published/archived progression
- Provenance/lineage — no creator attribution graph, no `parent_id`, no derivation chains
- Agent status endpoint — no pull-based update feed for agent creators
- Multi-agent workflows — no agent-to-agent asset handoffs, no composite assets
- Permissioned access — no team management, no view/comment/edit role tiers

**The critical inversion**: publish.new treats agents as **buyers** of content. Tokenrip treats agents as the primary **creators** of content. This isn't a minor product difference — it's the entire design premise. publish.new is human-responsive (supports agent payment as an additional rail). Tokenrip is agent-first (built around agent creation workflows). Mobile-responsive vs. mobile-first.

**Threat level (for Tokenrip)**:
- **Layer 1 (Asset Routing / Publish → URL)**: **Medium** — They've executed a simplified version of Tokenrip Layer 1 with a monetization twist. The gap to programmatic agent publishing is narrow (CLI exists; `POST /publish` API could follow). If they add agent self-registration + API key issuance, they commoditize the publish-and-get-URL primitive for the monetization use case. Differentiator becomes everything above Layer 1 — which is exactly why Tokenrip's collaboration and provenance layers must ship before Layer 1 gets crowded.
- **Layer 2 (Collaboration)**: **None** — Zero overlap. No versioning, comments, roles, or lifecycle states.
- **Layer 3 (Agent-Native Runtime)**: **Low** — The "API endpoint" gating type is a primitive precursor to machine-native asset delivery with access conditioning. In the same direction, far from the destination.
- **Positioning**: **Low** — Sell-first, human-creator-first premise vs. coordinate-first, agent-creator-first premise. Different problems, different buyers.

**x402 protocol signal**: publish.new is the **sixth confirmed x402 implementation** alongside Coinbase (origin protocol), Sponge (marketplace), Locus (API rack), T54.ai (x402-secure SDK), and Bankr (hosting). Crucially, this extends x402 into the **content economy** — not just API/service payments. x402 is consolidating as the machine payment standard across multiple asset categories. Tokenrip's eventual `GET /:id` gated access should be x402-compatible without committing to it now.

**Partner angle**: Complementary layers, not competing. Tokenrip (coordination + provenance + collaboration) + publish.new (monetization + marketplace distribution) are a natural pair. A Tokenrip asset could support a "sell via publish.new" action at Layer 2/3 — adding monetization distribution without Tokenrip building a marketplace. Not actionable at Layer 1 stage, but a clean integration when the time comes.

**Full analysis**: [[publish-new-competitive-analysis-2026-04-07]]

---

## Observations

- **Catena Labs is the 800-pound gorilla.** $18M from a16z crypto, Circle co-founder CEO, USDC inventor. Most well-funded and well-pedigreed in the space. Their open-source ACK protocol is a standards-setting play — they want to be the TCP/IP of agent commerce.
- **Natural launched publicly March 10, 2026** with $9.8M and an extraordinary investor list (Bridge CEO, Mercury CEO, Ramp, YC, Vercel CEO). Most enterprise-credible in the space — but fiat-first/ACH-native, not crypto-native. Proves the agentic payments market is real and attracting serious capital.
- **Sapiom** entered in Feb 2026 with serious money and serious investors. The category is no longer pre-funded.
- **Sponge** is YC-backed with a live, functional product (SDK v0.2.1, mainnets active). Most developer-friendly in the space — TypeScript SDK, MCP server, first-class Claude integration. Actively targeting the "vibe coder" archetype that RebelFi identified as the beachhead market.
- T54, Skyfire, Sapiom, Catena, and **Natural** are all building **agent identity** — it's becoming a universal primitive. Natural's approach: JWT tokens + named permissions. Catena's ACK-ID (W3C DIDs + VCs) is the most standards-based approach.
- **No one is touching yield on idle agent balances** — remains uncontested. Catena *displays* APY in treasury views. Sponge has zero yield. **Natural has zero yield.** **Locus has zero yield.** **Stablerail has zero yield** (MPC vaults, funds sit idle). RebelFi's gap to fill — and the gap widens as more platforms accumulate idle balances.
- **No one is doing pre-signing DeFi transaction verification** — the crypto-native layer remains RebelFi's uncontested territory. Natural's observability is post-execution logging, not pre-signing verification. The `beforeExecute` gap exists in Natural's architecture too (same as Sponge).
- **The field is now clearly split:** Natural = fiat/enterprise/B2B agentic payments. Sponge/Catena = crypto-native/developer-focused. RebelFi's uncontested lane: stablecoin yield + DeFi verification — the intersection of both worlds that nobody else is building.
- x402 protocol (Coinbase-backed) is emerging as a key infrastructure layer. Catena positions ACK-Pay as the **umbrella** over x402. Sponge is building the **service marketplace** on top of x402. Both moves validate x402 as infrastructure. Natural operates outside x402 (ACH-first).
- **Sponge's x402 service catalog could become an "App Store for agents."** If adopted, RebelFi's verification SDK could be listed there as a paid service — distribution without building a competing wallet.
- Watch Skyfire's transaction volume — they have the most visible ecosystem and could be first to hit a tripwire.
- **MCP distribution gap is urgent.** Sponge MCP live + Sapiom MCP live + Natural MCP planned. **Locus has no MCP** — an opening. RebelFi's E7 experiment is still Phase 2. Every week of delay is competitors embedding deeper in Claude Code workflows.
- **Standards convergence risk**: If ACK becomes the accepted standard (backed by a16z + Circle + Coinbase), building outside the ACK framework could mean building outside the ecosystem. Consider ACK compatibility for the Verification SDK.
- **Sponge remains most likely near-term partner candidate.** Their `beforeExecute` hook, missing yield, and missing verification make them the most natural integration target. Natural is a future yield integration candidate once both products are live.
- **Locus has executed the "rack" on EVM.** The Agent OS Wrapped APIs concept — agents autonomously pay for external services (scraping, search, email, browser automation) via a single API key — is live at Locus. The Solana + yield version remains open for RebelFi. But the EVM developer mindshare for this pattern is being captured now.
- **Locus's Tasks feature productizes escrow over human labor.** Their subwallet-based escrow is architecturally similar to Handshake. They've shipped a user-facing product (freelancer marketplace) on top of it. RebelFi's Handshake is designed for agent-to-agent commerce — different market, different chain — but the pattern is validated.
- **Stripe + Tempo launched MPP on March 18, 2026.** Stripe now has a complete agentic payments stack: ACP (commerce protocol), MPP (machine payment protocol), MCP (tool integrations), x402 support. 3.4M+ Stripe businesses can accept agent payments with a few lines of code. The distribution advantage is massive. MPP uses HTTP 402 as a native payment primitive — elegant and developer-friendly. Tempo is a purpose-built L1 for settlement. Stripe's infrastructure advantage: agent payments appear in the same Dashboard, settle on the same schedule, with the same fraud protection as human payments.
- **Mastercard + Google launched Verifiable Intent on March 5, 2026.** The word "intent" is now claimed by Mastercard for fiat commerce. Their meaning: cryptographic delegation chains proving an agent was authorized to purchase within human-set constraints. Our meaning: pre-signing transaction verification matching intent to on-chain execution. **Completely different problems in different domains** — but the naming collision is a real positioning risk. VI validates our thesis (intent verification matters) while creating a disambiguation challenge.
- **Ampersend launched April 1, 2026** — Edge & Node (The Graph Protocol team) entering the space with spend governance + ERC-8004 agent identity standard (co-authored with Ethereum Foundation). Most philosophically aligned competitor to Agent CLI's verification thesis, but solves a shallower problem: spend limits vs. intent semantics. **No yield. Base-only. No Solana.** The ERC-8004 standards play is the real threat vector — if it becomes the canonical agent identity layer, non-implementing projects face discovery and credibility friction. Watch for: fiat onramp launch (yield surface risk), Solana expansion (home turf threat), external funding (acceleration). Full analysis: [[active/ampersend-competitive-analysis-2026-04-06]]
- **The agent payment infrastructure stack is now four layers deep:** (1) Identity (ACK, KYA), (2) Authorization/intent (Verifiable Intent, Silk Accounts), (3) Payment rails (MPP, x402, ACP, ACH), (4) Execution verification (Agent CLI — still uncontested). The incumbents (Stripe, Mastercard) are locking down layers 1-3 with massive distribution. Layer 4 remains open.
- **The fiat vs. crypto divide is sharpening.** Coinbase CEO (March 2026): "Very soon there are going to be more AI agents than humans making transactions. They can't open a bank account, but they can own a crypto wallet." Mastercard/Google are building trust for fiat agent commerce. Coinbase/Stripe are bridging fiat-to-crypto. Agent CLI's crypto-native execution verification has no fiat equivalent — and no fiat competitor can replicate transaction bytecode inspection.
- **Bankr x402 Cloud (April 2026) confirms x402 is consolidating as the on-chain agent payment standard.** Now five live x402 implementations: Coinbase (origin protocol), Sponge (marketplace), Locus (API rack), T54.ai (x402-secure SDK), Bankr (hosting). Agent CLI doesn't need to build x402 — it needs to be the verification layer *before* x402 payments execute. As x402 volume grows, the "verify before paying" problem becomes more visible, not less. The x402 ecosystem is building the pipes; Agent CLI is the intelligence layer on top.
- **Compass Labs is the first direct yield track competitor with a16z backing.** They're not an agentic competitor — zero overlap with verification or Silk Accounts — but they target the same fintech customer archetype for stablecoin yield. Their product is thinner (DeFi access API vs. operations layer) but faster to integrate and self-serve. EVM-only (no Solana), no custody integration, no compliance tooling, no monitoring. Watch for seed raise and Solana expansion.
- **Still no one doing pre-signing DeFi transaction verification.** Despite $42M+ in startup funding, Stripe launching MPP, and Mastercard launching Verifiable Intent — the execution verification layer for on-chain transactions remains completely uncontested. Every new agent payment rail (MPP, x402, ACK-Pay) creates more transactions that need pre-signing verification.
- **Aomi validates the "agent execution layer" as a distinct category.** Their Rust-based LLM runtime with Anvil simulation is technically sophisticated — but simulation catches broken transactions, not unsafe ones. The gap between "this transaction will succeed" and "this transaction should execute" is precisely our lane. Aomi could become a distribution partner: verification as a tool in their pipeline.
- **Stablerail validates "agents verify before signing" as a market pattern.** Their tagline — "Agents verify the intent. Humans sign the transaction." — is almost identical to Agent CLI's thesis. But their "verification" is policy compliance + counterparty risk screening for corporate treasury teams, not semantic intent-to-transaction matching for autonomous agents. Different buyer (CFO/treasury ops vs. agent developers), different architecture (MPC vaults vs. on-chain accounts), different capability (authorization checks vs. transaction bytecode inspection). The positioning overlap is real; the product overlap is minimal. Their existence is a **yield track concern** more than an agentic track concern — they're competing for stablecoin operations budget from the same company profiles as RebelFi's yield deals.
- **publish.new opens a new category: agent-native content monetization.** They've built the sell-side of agent-produced content — a marketplace where humans publish, agents buy, and x402 handles payment. This is the inverse of Tokenrip's premise (agents publish, humans receive links) but validates the underlying market: agent-accessible content at $0.01–$2.00 price points has real demand. Their zero-account-needed UX sets the frictionlessness bar that Tokenrip's agent self-registration must match or beat.
- **x402 now spans six implementations across three categories.** Payments (Coinbase origin, Sponge marketplace, AgentCash API access), infrastructure (Bankr x402 Cloud hosting, T54.ai x402-secure SDK), and now content (publish.new). The protocol is no longer a Coinbase experiment — it's consolidating as the default machine payment standard. Every new x402 surface is a potential integration point for Agent CLI's pre-payment verification layer. As x402 volume grows, "verify before paying" becomes structurally more valuable.
- **publish.new confirms Layer 1 commoditization risk for Tokenrip is emerging, not theoretical.** The "publish a file, get a URL" primitive is now live in a competing product with real users. Tokenrip's moat lives entirely in Layer 2 (collaboration, versioning, lifecycle, provenance) and Layer 3 (agent-native runtime, asset graph). The 30-day plan's instinct to build collaboration alongside Layer 1 is validated — if Tokenrip ships Layer 1 alone, it's replicable.

## Tripwire Relevance

| Signal | Who to watch |
|--------|-------------|
| Agent tx volume crosses $1M/month | Skyfire (most ecosystem traction); Sponge (most developer-adopted) |
| Major operator requests policy-controlled agent accounts | Catena Labs (regulated banking path) or T54 (compliance-focused) |
| Competitor ships agent-native financial infra | Catena Labs (furthest along — Client Zero since Dec 2025) |
| ACK gains real adoption (npm downloads >5K/month) | Catena Labs — would signal standards convergence |
| Competitor adds pre-signing verification | Catena Labs (most likely); Sponge (has the hook, lacks the intelligence — someone will fill it) |
| Agent completes multi-step financial transaction | Sponge (multi-step `submit_plan` + Amazon checkout already live) |
| Sponge adds yield to wallet balances | Sponge — would close a key RebelFi differentiation gap |
| Incident: agent makes unauthorized purchase (Amazon, prepaid card) | Sponge (has Amazon checkout + prepaid cards) — will drive demand for verification |
| RebelFi yield clients ask for agent integration | Then revisit all as potential infra partners |
| Sponge `beforeExecute` hook adopted by third-party verification layer | Anyone — races RebelFi to the verification SDK integration point |
| Natural adds yield on stablecoin balances | Natural — would close a key RebelFi differentiation gap in the fiat-adjacent market |
| Natural expands to Solana-native support | Natural — enters RebelFi's primary market |
| Natural's Credit product ships with traction | Natural — shapes "agent credit" narrative before RebelFi's behavioral data is meaningful |
| Natural raises Series A > $30M | Market signal — compresses competitive window; category getting crowded fast |
| Locus raises seed round | Imminent signal — 2-person YC team will raise soon; investor roster will reveal who's betting on Base/EVM agent payments |
| Locus adds yield to wallet balances | Would close a key RebelFi gap — watch for this as their wallet balance grows |
| Locus Wrapped APIs catalog exceeds 15 providers | Signals the rack is a real distribution moat; accelerates urgency for RebelFi's equivalent on Solana |
| Locus ships MCP server | Would close the MCP gap and embed them in Claude Code workflows before RebelFi's E7 |
| Locus expands to Solana | Would enter RebelFi's primary market — currently zero Solana presence |
| Stripe MPP transaction volume crosses $1M/month | Market signal — agent payments via incumbents are real. Every MPP transaction = potential verification customer |
| Stripe adds verification/intent-matching to MPP | Would close a potential integration point — but Stripe's DNA is payments, not transaction inspection |
| MPP adopted by major AI agent frameworks (ElizaOS, Solana Agent Kit) | Distribution signal — MPP embedding in crypto-native agent workflows |
| Verifiable Intent gains GitHub traction (>500 stars) | Standards convergence signal — "intent" as a concept being claimed by Mastercard |
| Verifiable Intent integrated into Mastercard Agent Pay (live APIs) | Production signal — fiat intent verification is real and available |
| Verifiable Intent adds DeFi/crypto constraint types | Would narrow the gap between fiat authorization and crypto execution verification |
| Stripe or Mastercard launches pre-signing transaction verification | Existential signal — incumbents entering Agent CLI's uncontested territory |
| Tempo blockchain achieves significant DeFi TVL | Settlement layer for MPP becomes a DeFi surface — new territory for verification |
| Stablerail adds yield on idle vault balances | Would close a key RebelFi differentiation gap in the enterprise treasury market |
| Stablerail expands beyond treasury disbursement into DeFi/trading | Would enter Agent CLI's agentic track territory — currently payments-only |
| Stablerail wins a client that overlaps with RebelFi yield pipeline | Direct competitive signal on the yield track — watch for shared ICP overlap |
| Stablerail raises disclosed round | Market signal — enterprise stablecoin treasury management attracting capital; validates the buyer profile |
| Bankr adds intent verification to Sentinel (v2) | Would gate Agent CLI's target user base — converts Bankr from partner to gatekeeper |
| Bankr x402 Cloud service catalog exceeds 50 endpoints | Signals x402 Cloud as "App Store for agents" — deploy `verify_transaction` there before it matures |
| Bankr adds yield on idle agent USDC balances | Would close a key RebelFi yield gap in the crypto-native agent segment |
| Bankr Wallet API expands to Solana programmatic writes | Would enter RebelFi's native chain with custodial + execution infrastructure |
| Compass Labs raises seed round ($5M+) | Would fund team expansion, potentially Solana support + custody integrations — directly into RebelFi territory |
| Compass Labs adds Solana support | Enters RebelFi's primary chain with competitive yield infrastructure |
| Compass Labs adds institutional custody integration (Fireblocks etc.) | Closes a key RebelFi differentiator — would compete for regulated fintech customers |
| Compass Labs adds monitoring/auto-execution | Moves from access layer to operations layer — narrows gap with Midas |
| Compass Labs wins a customer overlapping with RebelFi yield pipeline | Direct competitive signal — watch for payment platform / remittance overlap |
| Compass Labs acquired by infrastructure player (Circle, Stripe, Fireblocks) | Could either remove competitor or massively amplify their distribution |
| publish.new adds programmatic `POST /publish` API + API key issuance | Layer 1 commoditization risk for Tokenrip materially increases — accelerate collaboration layer shipping |
| publish.new adds versioning (same URL, new content on revision) | Starts encroaching on Tokenrip Layer 2 — differentiation story needs sharpening |
| publish.new adds agent-as-creator workflow (agent self-registers, publishes programmatically) | Design premise gap closes — major threat signal for Tokenrip Layer 1 |
| publish.new adds comments or annotation to asset pages | Collaboration layer competition beginning; Layer 2 no longer uncontested |
| publish.new marketplace total GMV exceeds $10K | Validates content economy scale — monitor asset type distribution for shift toward structured data and code (Tokenrip's lane) |
| publish.new raises a disclosed funding round | Signals product velocity increase and serious intent to expand beyond current feature set |
| Paragraph.com deeply integrates publish.new or acquires it outright | Distribution acceleration — Paragraph has substantial creator network and crypto-native user base |
