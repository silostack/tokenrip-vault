---
date: 2026-03-26
type: competitive-analysis
status: active
tags: [competitive, #theme/agentic, agent-infrastructure]
related:
  - "[[agentic-strategy-reference]]"
  - "[[landscape-tracker]]"
  - "[[transaction-verification-sdk]]"
---

# Aomi — Competitive Analysis

> **One-liner:** Aomi is a hosted LLM agent runtime for blockchain transactions — natural language in, simulated + signed transactions out.

> **Bottom line: NOT a direct competitor. Potential integration partner. Different layer entirely.**

---

## 1. What Aomi Actually Is

Aomi is **infrastructure for making blockchain protocols callable by LLM agents**. Think of it as "AWS Lambda for on-chain agents" — you bring your APIs, they host the LLM runtime, tool orchestration, and transaction pipeline.

**The pipeline:**
```
User sends natural language → Aomi's LLM selects tools → Tools call your APIs/DEXs →
Transaction constructed → Simulated on Anvil fork → User sees exact outcome →
User signs in own wallet → Transaction broadcasts
```

**Key characteristics:**
- **Hosted runtime** — Aomi manages the LLM, tool scheduling, session state
- **Non-custodial** — never holds keys or funds; signing via WalletConnect/Reown AppKit
- **Simulation-first** — every transaction simulated against forked network state (Anvil) before signing
- **Plugin architecture** — Rust-based C ABI plugins (apps) that wrap APIs as LLM-callable tools
- **Multi-channel** — same backend powers web widget, headless library, Telegram bot, iOS

---

## 2. Technical Deep Dive

### Architecture

**Backend:** Rust. The core is a stateless agent runtime with:
- `aomi-runtime` — session manager, LLM completion streaming, tool dispatch
- `aomi-tools` — tool scheduler, core tools (simulate, sign, encode, search)
- `aomi-anvil` — Anvil fork management for transaction simulation
- Plugin SDK — C ABI (v3) for dynamically loaded `.so` plugins

**Frontend:** React/Next.js. Two paths:
- Widget (`npx shadcn add @aomi/aomi-frame`) — full chat UI, minutes to integrate
- Headless library (`@aomi-labs/react`) — hooks/providers, bring your own UI

**SDK (what we cloned):** ~14K lines of Rust. A standalone workspace for building "apps" (plugins):
- 9 production apps: DeFi aggregation (DeFiLlama), OTC trading (Delta RFQ), order flow (Khalani), prediction markets (Polymarket + Kalshi + Simmer), MPC wallets (Para), GameFi (Molinar), social, Twitter/X
- Standard pattern: HTTP client → typed tool wrapper → JSON Schema for LLM

### Chain Support

- **EVM only** — Ethereum, Base, Arbitrum, Polygon, Optimism
- **Solana on roadmap** — FAQ says "we plan to support non-EVM chains such as Solana"
- **No Cosmos** despite the logo on their landing page (likely aspirational)

### The Simulation Approach (Critical Distinction)

Aomi's safety mechanism is **transaction simulation**, not **intent verification**.

| | Aomi (Simulation) | Agent CLI (Verification) |
|---|---|---|
| **Question answered** | "Will this transaction succeed on-chain?" | "Does this transaction match what the user intended?" |
| **Mechanism** | Fork network state via Anvil, execute tx, show result | Deserialize transaction, match against structured intent across 6 control planes |
| **What it catches** | Reverts, gas issues, incorrect calldata, unexpected token changes | Intent mismatches, MEV risk, unfair pricing, counterparty risk, policy violations, temporal drift |
| **What it misses** | Fair pricing, intent matching, counterparty trust, risk assessment, policy violations | Transaction will actually succeed on-chain (not simulated) |
| **Data generated** | Simulation results (success/fail, gas, state changes) | Intent patterns, verification outcomes, risk decisions, failed intents, behavioral profiles |
| **When it runs** | After transaction constructed, before signing | After intent formed, before or after transaction constructed |

**The gap:** Simulation tells you a transaction WILL work. Verification tells you it SHOULD execute. These are complementary.

Example: A swap of 100 USDC for SOL at 50% slippage will simulate successfully — the transaction is valid. Our verification SDK flags it as economically insane. Aomi would let it through. We wouldn't.

### Core Tools (Built Into Runtime)

Every Aomi app gets these for free:
- `SendTransactionToWallet` — queue tx for user signing
- `EncodeFunctionCall` — ABI encode calldata
- `SimulateContractCall` — Anvil fork simulation
- `CallViewFunction` — read-only contract calls
- `GetAccountInfo` — wallet balances
- `GetAccountTransactionHistory` — tx history
- `BraveSearch` — web search
- `GetContractABI` / `GetContractSourceCode` — contract inspection
- `GetCurrentTime` — timestamp

### What's Missing (Our Territory)

| Capability | Aomi | Agent CLI |
|------------|------|----------|
| **Intent verification** | No — relies on LLM + simulation | Yes — structured intent matching across 6 control planes |
| **Policy enforcement** | No built-in spending limits or controls | Yes — Silk Account on-chain enforcement |
| **Yield on idle balances** | No (apps discover yields, don't manage them) | Yes — live infrastructure |
| **Flow orchestration** | No (sequential tool calls, not stateful flows) | Building — yield-bearing multi-step operations |
| **Risk assessment** | No (simulation shows outcome, not risk) | Yes — counterparty, protocol, economic sanity |
| **Behavioral data capture** | No (stateless — no intent/decision logging) | Yes — the three-layer data asset |
| **Solana** | Roadmap | Working |
| **Cross-chain** | EVM only | EVM + Solana architecture |

---

## 3. Business Model & GTM

### Revenue Streams

Aomi's business model is **services + hosted infrastructure**:

1. **Consultation & Strategy** — paid advisory on AI automation for on-chain transactions
2. **Custom Build** — build custom AI applications integrating client APIs
3. **Managed Orchestration** — host the LLM infrastructure, clients focus on backend logic
4. **Widget/SDK** — frontend integration (likely free tier + paid for hosted runtime)

No public pricing. "Contact us" / "Book a call" model. This is a **services-heavy early-stage company**, not a product-led SaaS.

### Team & Traction

- **Very early stage.** SDK has 1 GitHub star. Org has 3 followers.
- **Single visible contributor** — CeciliaZ030 (15 commits on SDK). No public team page.
- **Contact email:** info@foameo.ai — suggests "Foameo" may be the parent entity or previous name
- **Founded:** Copyright says 2025. SDK released March 22, 2026 (4 days ago).
- **13 public repos** — SDK, client example, widget, skills, iOS app, landing page, plus forks of MetaMask, Rig (Rust LLM framework), Letta (MemGPT), BAML
- **Forked Rig** — their LLM agent framework is built on top of [0xPlaygrounds/rig](https://github.com/0xPlaygrounds/rig), a Rust LLM framework with 4K+ stars

### Distribution Channels

- Web widget (embed chat into any site)
- Telegram bot (managed by Aomi)
- Discord (mentioned, not detailed)
- iOS app (repo exists, no details)
- Headless library (for custom integrations)

### Target Market

Based on their examples and integration guide:
- **Crypto projects needing AI UX** — add a chat interface to your DEX, prediction market, exchange
- **Trading bot builders** — the client example is a momentum trading bot
- **DeFi aggregators** — wrap multiple DEXs behind natural language
- **Prediction market platforms** — Polymarket, Kalshi integrations

---

## 4. Overlap Assessment

### Where We Overlap

| Area | Aomi | Agent CLI | Verdict |
|------|------|----------|---------|
| **Target users** | Trading bots, DeFi developers | Trading bots, DeFi developers | **Same initial market** |
| **Natural language → transaction** | Core product | Not building (we verify, not construct) | Different |
| **Transaction safety** | Simulation | Intent verification | **Complementary, not competitive** |
| **DEX integration** | Jupiter, 0x, LI.FI, CoW routing | Jupiter verification only | They route; we verify |
| **Agent infrastructure** | Runtime + tools | Verification + yield + accounts | **Different layers** |

### Where We DON'T Overlap

- **Yield** — Aomi has zero yield capability. Not even on their roadmap.
- **Policy controls** — No spending limits, no Silk Accounts equivalent.
- **Data moat** — Aomi is stateless by design. They explicitly don't retain behavioral data.
- **Intent verification** — They simulate outcomes; we verify intent alignment.
- **Flow orchestration** — No multi-step stateful operations.
- **Solana** — We're live; they're on roadmap.
- **Business model** — They sell hosted runtime; we sell verification + yield.

### The Real Relationship: Complementary Layers

```
┌─────────────────────────────────────────────┐
│  User: "Swap my 100 USDC for SOL"          │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │  Aomi: Constructs transaction       │    │
│  │  (selects DEX, encodes calldata,    │    │
│  │   simulates on Anvil fork)          │    │
│  └─────────────┬───────────────────────┘    │
│                │                             │
│  ┌─────────────▼───────────────────────┐    │
│  │  Agent CLI: Verifies transaction     │    │
│  │  (intent match? risk? fair price?   │    │
│  │   counterparty safe? policy ok?)    │    │
│  └─────────────┬───────────────────────┘    │
│                │                             │
│  ┌─────────────▼───────────────────────┐    │
│  │  Wallet: Signs transaction          │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

Aomi constructs and simulates. We verify and assess risk. These are sequential layers, not competitors.

---

## 5. Strategic Implications

### Threat Level: LOW

Aomi is not building in our lane. Specifically:
- **No intent verification** — their simulation catches execution failures, not intent mismatches or risk
- **No yield** — zero capability, not on roadmap
- **No data moat** — stateless by design
- **No Solana** — on roadmap, not built
- **Services model** — they're selling consulting + hosted infra, not a data flywheel

### Partnership Potential: MEDIUM-HIGH

Our verification SDK could become an **Aomi app** or tool:

1. **Verification as an Aomi tool** — `VerifyTransaction(intent, txData)` returns risk score + match result. Aomi calls it between construction and signing. Plugs directly into their pipeline.

2. **Yield on Aomi wallet balances** — Aomi users hold funds in connected wallets. If those wallets connect to Agent CLI yield, funds earn between transactions.

3. **Co-marketing to trading bots** — same target market. "Build your bot on Aomi, verify with Agent CLI."

### What to Watch

- **Account abstraction** — they say "coming soon." If they add spending limits and policy controls at the AA layer, that overlaps with Silk Accounts.
- **Solana support** — if they ship Solana and integrate with Jupiter, they become a more direct distribution channel (or a competitor for trading bot mindshare).
- **Simulation → verification creep** — if they add "does this match the user's request?" checks on top of simulation, they start entering our territory. The LLM-as-judge approach they mention in their FAQ ("LLM-as-a-judge in addition to deterministic hard checks") is a weak version of this.
- **Funding** — no disclosed funding. If they raise, priorities could shift. Services companies often pivot to product companies post-raise.

### What This Means for Our Competitive Map

Aomi fits in a new category not yet in our market map:

```
├─────────────────────────────────────────────────────────┤
│              AGENT RUNTIME / EXECUTION                   │
│                                                         │
│  Aomi — hosted LLM runtime + simulation (EVM)           │
│  (also: LangChain, Vercel AI SDK, Rig — generic)        │
│                                                         │
```

This is the "how agents execute transactions" layer — below our verification layer but above payment protocols. We should track but not obsess.

---

## 6. Comparison to Other Competitors

| Dimension | Aomi | Sponge | Locus | Catena | Agent CLI |
|-----------|------|--------|-------|--------|----------|
| **Layer** | Agent runtime + execution | Wallets + marketplace | Wallets + tasks | Banking + identity | Verification + yield + banking |
| **Safety mechanism** | Anvil simulation | `beforeExecute` hook (empty) | None | Turnkey enforcement | Intent verification (6 planes) |
| **Yield** | None | None | None | Display only | Live infrastructure |
| **Chain** | EVM | EVM + Solana | EVM | Base | Solana + EVM |
| **Non-custodial** | Yes (WalletConnect) | Custodial | Custodial (MPC) | Custodial | On-chain (Silk Accounts) |
| **Business model** | Services + hosted runtime | Developer tools | Developer tools | Neobank | Verification SaaS + yield spread |
| **Stage** | Very early | YC, live product | YC F25 | $18M, a16z | Building |

Aomi is the most technically sophisticated on the execution layer (Rust, Anvil simulation, plugin architecture). But they're solving a different problem — "how do agents construct and execute transactions" vs. "how do we make those transactions safe and trustworthy."

---

## 7. Key Takeaways

1. **Not a competitor.** Different layer (execution vs. verification). Different business model (services vs. product). Different chains (EVM vs. Solana-first).

2. **The simulation vs. verification distinction is real and defensible.** Simulation catches broken transactions. Verification catches unsafe, unfair, or misaligned transactions. No one is building what we're building.

3. **Very early stage.** 1 star, 1 contributor, no disclosed funding. The Rust code is clean but the product is nascent. Could go anywhere.

4. **Potential partner, not target.** If they gain traction with EVM trading bots, our verification SDK as an Aomi tool = distribution without building the execution layer ourselves.

5. **Their "LLM-as-a-judge" approach to safety is a weak signal.** They acknowledge the problem (LLM hallucination in financial transactions) but solve it with simulation + LLM self-checking, not deterministic intent verification. This is the exact gap our SDK fills.

6. **No data moat by design.** They're explicitly stateless. The three-layer data asset thesis doesn't apply to them. They can't become a risk intelligence platform.

---

## Action Items

- [ ] Add Aomi to landscape tracker under "Agent Runtime / Execution" category
- [ ] Monitor for Solana support announcement (would increase relevance)
- [ ] Monitor for account abstraction feature (potential Silk Accounts overlap)
- [ ] Consider reaching out for partnership conversation once verification SDK prototype ships
- [ ] No strategic changes needed — our lane remains clear
