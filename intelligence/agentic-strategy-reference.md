---
tags: [strategy, #theme/agentic, #theme/yield, product, gtm, competitive]
date: 2026-03-19
status: living-document
related:
  - "[[gameplan]]"
  - "[[transaction-verification-sdk]]"
  - "[[silk-account-primitive]]"
  - "[[landscape-tracker]]"
  - "[[agent-infrastructure-targeting-research-brief]]"
  - "[[exploration-multi-step-orchestration-2026-03-18]]"
---

# Agent CLI: Agent Financial Infrastructure — Strategy Reference

> **Purpose:** Comprehensive reference document for the agentic play — product vision, intent framework, competitive positioning, go-to-market, data strategy, partnership targets, and fundraise angles. For use by Simon and Alek across BD, partnerships, GTM, fundraise prep, and strategic planning.

---

## 1. Executive Summary

Agent CLI is building the financial operating system for AI agents — a neobank where agents hold accounts, earn yield, trade, pay, and transact across chains, with every action verified against the user's original intent before execution.

The core innovation is the **Intent Framework** — a cross-chain system that captures three layers of data no one else has: what the user told the agent, what the agent intended to do, and what actually executed. The framework operates at two levels: **single-step verification** (does this transaction match this intent?) and **flow orchestration** (does this sequence of transactions achieve this goal?). This creates a unique behavioral dataset that feeds every subsequent product: credit scoring, risk intelligence, insurance, and market data.

**What exists today:**
- Silk Accounts — policy-controlled on-chain accounts on Solana (deployed)
- Handshake — escrow protocol on Solana (deployed)
- RebelFi yield infrastructure — live, generating revenue, active deals in pipeline
- Transaction Verification SDK — intent framework built, Solana adapter working, cross-chain architecture in place

**What we're building toward:**
- A multichain agent superapp — banking, yield, trading, payments, address book, escrow
- Starting narrow: swap verification + limit orders for trading bots (the limit order is the first multi-step flow — yield → monitor → verify → execute)
- Expanding into flow orchestration: multi-step financial operations where every waiting state earns yield and every step is verified against the overall goal
- Expanding based on traction signals into full banking platform

**Why now:**
- ~6 month window before the field gets crowded ($42M+ raised by competitors in the last 3 months)
- No one is building intent verification + yield + flow orchestration + banking in one stack
- Agents are dissolving the "two-player problem" that killed similar protocols before — use cases that were previously too high-friction are suddenly viable
- EU AI Act enforcement accelerates August 2026 — intent-to-transaction audit trails become compliance infrastructure

**The bet:** The entity that captures intent data at scale becomes the risk intelligence backbone of the agent economy — the Bloomberg Terminal for agent risk, not Experian for agent credit. Every financial service for agents (risk pricing, insurance, counterparty due diligence, collateral optimization) requires this data. The free verification tier is not a loss leader; it's the data collection engine that powers everything.

---

## 2. The Thesis

### The Convergence

Two megatrends are colliding:

1. **AI agents are becoming economic actors.** Trading bots execute swaps. Autonomous agents purchase services. DeFi bots manage liquidity. Agent teams operate budgets. This is happening now — not in two years.

2. **Stablecoins are replacing cards for programmatic commerce.** Agents route around 2-3% card interchange by settling on stablecoins via L2s and Solana. Stripe's 2025 annual letter confirms stablecoin payments volume doubled to ~$400B. The Citrini "2028 Global Intelligence Crisis" scenario — where agents bypass interchange entirely — dropped Visa stock 5% the day after publication.

The convergence: stablecoin volume explodes BECAUSE agents choose stablecoins over cards. More stablecoins need yield infrastructure. More agent transactions need verification. Both tracks accelerate together.

**RebelFi sits at the intersection.** We have live yield infrastructure (the stablecoin operations platform) AND we're building agent financial infrastructure (verification + banking). These aren't two businesses — they're one thesis: agents need safe, yield-bearing financial infrastructure, and we're the only team building both.

### The Market Is Bigger Than DeFi

McKinsey's October 2025 report ("The Agentic Commerce Opportunity") sizes the **B2C retail market alone** at $900B-$1T in US agent-orchestrated revenue by 2030, with global projections of $3-5T. These figures only reflect goods — they don't include services or the B2B marketplace.

Our strategy starts with DeFi trading bots (the existing market today). But the verification SDK's endgame is much larger: **every agent making any financial decision** — purchasing, subscribing, negotiating, returning — needs intent verification. The same framework that verifies "does this swap match my intent?" verifies "does this purchase match what I told the agent to buy? Is this price fair? Is this merchant legitimate?"

**What this means for us:**
- **Phase 1 (DeFi) is a beachhead, not the destination.** The trading bot market validates the framework; B2C commerce is where the framework scales.
- **The intent taxonomy should be designed for expansion.** Today: swap, lend, stake, borrow. Tomorrow: purchase, subscribe, negotiate, return, compare. The action type system must accommodate commerce intents without rewriting.
- **Fundraise framing shifts dramatically.** We're not building safety tooling for a crypto niche — we're building trust infrastructure for a $3-5T market transition that McKinsey, Google, Visa, and Mastercard are all positioning for.

The convergence point: as agents start operating across both DeFi rails (swaps, yield, lending) and commerce rails (purchases, subscriptions, services), the system that can verify intents across BOTH becomes the universal trust layer. Our chain-agnostic intent framework is architecturally positioned for this — if we build with commerce expansion in mind from the start.

### Why Agents Change Everything

The critical insight isn't that agents can transact — it's that **agents dissolve the friction that prevented entire categories of financial products from working.**

**The Two-Player Problem:** Many protocols and financial products failed because they needed both sides to adopt simultaneously. A payments protocol needs a sender AND a receiver. An escrow system needs a buyer AND a seller. A reputation system needs participants to actively build histories. A credit market needs lenders AND borrowers who trust each other.

Agents eliminate this problem:

- **Escrow:** My agent creates an escrow and sends a link. The counterparty doesn't need to have adopted anything — they just click and claim. The agent handles wallet creation, signing, gas, everything.
- **Reputation:** Agents don't need to "build" reputation actively. Their verifiable transaction history IS their reputation. It emerges automatically from behavior.
- **Price discovery:** Agents autonomously negotiate, compare, and execute. They ARE the marketplace. No critical mass needed.
- **Credit/collateral:** Intent-to-execution data creates risk signals that reduce collateral requirements. The "credit" is on the operator (the accountable entity), observed through their agents' behavioral history. No pre-existing trust relationship required.
- **Payments:** I want to send 5 USDC to a friend. My friend doesn't have a wallet. My agent puts funds in escrow, sends an email with a claim link. My friend's agent (or my friend directly) collects. This was always technically possible — but the friction was too high for any human to bother. With agents, the friction is zero.

**The implication:** Agent CLI can launch features — escrow, credit, insurance, reputation, multi-party settlement — that would normally require years of bootstrapping, because agents collapse the cold start problem. The product roadmap can be more ambitious than it looks, because the adoption barriers are structurally lower than in any previous era.

### The Trust Thesis — Why "Safe" Is Too Small

Our north star — "RebelFi makes it safe for AI to handle money" — is correct but undersized. McKinsey's report frames trust as the **adoption bottleneck** for the entire agentic commerce market. Not safety — trust.

The distinction matters:
- **Safety** implies a one-time check. A seatbelt. Necessary but transactional.
- **Trust** implies an ongoing relationship. Infrastructure that enables an entire market to exist.

McKinsey identifies five dimensions of trust in agentic commerce:

| Dimension | What It Requires | How We Deliver It |
|-----------|-----------------|-------------------|
| **Know Your Agent (KYA)** | Verify agent identity, use agent "passports," require multi-factor auth for sensitive actions | Every verification captures which agent formed the intent, what it wanted, what it decided — behavioral KYA data as byproduct |
| **Human-centricity** | User-controlled preferences, human override for critical decisions | The intent framework IS human-centricity — the user sets the intent, the framework ensures the agent follows it |
| **Transparency** | Explain recommendations, show comparisons, clarify autonomous vs. user-confirmed actions | Verification results explain what happened, why it matched or didn't, what risks were flagged |
| **Data security** | End-to-end encryption, minimize data storage, limit sharing | Intent data stays private (our "invisible layer" thesis) — only aggregate insights are surfaced |
| **Responsible governance** | Define accountability for agent errors, ensure regulatory compliance, establish conflict resolution | Silk Account policies + flow definitions = auditable governance; intent logs = compliance artifacts |

**The reframe:** We're not just selling safety. We're the **trust infrastructure that enables the agent economy to function at all.** Without verification, agents are black boxes making opaque decisions with other people's money. With verification, every action is transparent, auditable, and aligned with human intent. That's the difference between "use agents cautiously" and "deploy agents at scale."

**Why this framing is strategically stronger:**
1. **Trust is a platform, not a feature.** Safety can be commoditized. Trust infrastructure compounds.
2. **Trust is the enterprise buyer's concern.** CISOs and compliance officers don't buy "safety tools" — they buy "trust frameworks."
3. **Trust positions us at the center, not the edge.** A safety tool is bolt-on. Trust infrastructure is foundational.
4. **Trust connects both tracks.** Yield infrastructure builds financial trust (your money grows). Verification builds operational trust (your agents do what you told them). Together = the trusted financial operating system for agents.

Consider updating the north star: **"RebelFi is the trust layer for AI-driven finance."** Or even: **"RebelFi makes AI agents trustworthy with money."** Subtle shift from making the action safe to making the agent trusted.

### External Validation: The "Intention Layer" Thesis

Simon Taylor (Fintech Brainfood, credible mainstream fintech voice) independently arrived at the same thesis in ["The Intention Layer"](https://www.fintechbrainfood.com/p/the-intention-layer) (Mar 18, 2026): intent is the missing protocol layer of the internet.

Taylor frames intent as Physical → Network → Transport → Application → **Intention** — a new layer that completes the internet stack for the agent era. His argument: the attention economy monetizes the journey to intent (ads, funnels, conversion optimization). Agents arrive with intent pre-formed — **the entity that verifies and fulfills intent wins**, not the one that captures attention.

This is directly what our intent framework builds. Key alignment:
- **"Trust is a prerequisite for payment"** — Taylor positions trust BEFORE payment protocols. Our verification SDK sits in exactly this layer.
- **"The credential is the customer"** — the agent's access key is the API key AND the payment method. Revenue arrives with the request. Maps to our free-tier data engine.
- **Micro-services at fractions of a cent** — viable only because agents call them thousands of times/day. Validates our verification pricing model and the vibe coder micro-merchant thesis.

**Caveat:** The article is effectively an MPP advertorial (Taylor discloses working "in the infrastructure"). The framing is useful; the MPP boosting should be discounted.

**Fundraise implication:** "Independent mainstream fintech analysis validates our core thesis — intent verification is the missing infrastructure layer for the agent economy" is a strong narrative for investor conversations.

### The Window

The competitive landscape has ~$42M+ in recent raises:

| Company | Raised | Lead Investors |
|---------|--------|----------------|
| Catena Labs | $18M | a16z crypto |
| Sapiom | $15.75M | Accel, Anthropic, Coinbase Ventures |
| Natural | $9.8M | Abstract, Human Capital |
| Sponge | YC-backed | Undisclosed |
| Locus | YC F25 | Standard deal |

But none of them have: (1) intent verification, (2) yield on idle balances, (3) a cross-chain intent framework, or (4) the three-layer data thesis. The unique position is real. The question is speed of execution.

---

## 3. The Intent Framework

### What It Is

The Intent Framework is a chain-agnostic system for expressing what an agent wants a transaction to do, then verifying that a given transaction accomplishes it. It's the foundational primitive of the entire platform — not just a verification tool, but a universal financial action language for agents.

Every financial action reduces to an intent:

| Action | Intent |
|--------|--------|
| Sending money | Transfer intent |
| Buying a token | Swap intent |
| Saving / earning yield | Lend or stake intent |
| Limit order | Conditional swap intent |
| Paying for a service | Transfer intent with memo/reference |
| Splitting a bill | Multi-party transfer intent |
| Escrow | Conditional transfer intent |
| Insurance | Conditional escrow intent |
| Credit | Collateralized borrow intent |

The framework supports known actions (transfer, swap, stake, lend, borrow, approve, withdraw) with deep field-level verification, and custom/unknown actions with structural verification. It handles single-action and compound intents (multiple actions in one transaction), supports amount constraints (exact, gte, lte, ranges), and is chain-agnostic by design.

### How It Works (Conceptual)

```
User tells agent: "Swap my 100 USDC for SOL, best price, max 1% slippage"
    ↓
Agent forms structured intent:
    { action: 'swap', tokenIn: 'USDC', tokenOut: 'SOL', amountIn: '100', slippage: 100 }
    ↓
Agent constructs (or receives) a transaction
    ↓
Intent framework verifies:
    ✓ Does the transaction actually swap USDC for SOL?
    ✓ Is the amount correct?
    ✓ Is slippage within stated bounds?
    ✓ Is the protocol safe right now? (no recent exploits, TVL stable)
    ✓ Is the counterparty/program trustworthy?
    ✓ Have conditions changed since the intent was formed?
    ↓
Result: { matched: true/false, confidence: 'full'/'partial'/'unverified',
          risk signals, discrepancies, full analysis }
    ↓
Agent decides: sign and submit, or abort
```

The verification engine runs across six control planes:

1. **Agent Policy** — Is the agent allowed to do this? (spending limits, approved protocols)
2. **Intent Verification** — Does this transaction match the stated intent?
3. **Counterparty Verification** — Is the other party trustworthy?
4. **Protocol Risk** — Is this protocol safe right now?
5. **Economic Sanity** — Is this a fair deal? (price vs. market, slippage, fees)
6. **Temporal Context** — Has anything changed since the intent was formed?

Silk Accounts handle plane #1 via on-chain enforcement. The verification SDK handles planes #2-6 and is wallet-agnostic — works with any wallet, any chain.

### The Three-Layer Data Asset

This is the moat. No one else has this data, and it cannot be replicated by scraping on-chain activity.

| Layer | What It Captures | Visibility |
|-------|------------------|------------|
| **User instruction** | Natural language: "swap my USDC for SOL, best price" | Invisible — private, ephemeral |
| **Structured intent** | `{ action: 'swap', tokenIn: 'USDC', amountIn: '100' }` | Invisible — only exists in our system |
| **Transaction** | Raw bytes / calldata | Public — on-chain, anyone can see |
| **Verification result** | Did intent match? Risk score? Warnings? | Invisible — our proprietary signal |
| **Agent decision** | Did the agent proceed after warnings? At what threshold? | Invisible — behavioral intelligence |

On-chain analytics platforms (Dune, Nansen, Chainalysis) see layer 3 only. They know WHAT happened. We know:
- **Why** — the user's original instruction and the intent behind it
- **How** — how the agent interpreted the instruction into a structured intent
- **Whether** — whether the intent matched the transaction
- **What the agent thought about it** — risk score, warnings, confidence level
- **What the agent decided** — proceed, abort, modify

That's four layers of invisible signal on top of public data.

### Failed Intents: The Invisible Demand Signal

The intents that don't result in transactions are as valuable as the ones that do.

If 500 agents form swap intents for Token X this morning but 400 abort after verification flags high slippage — that's a demand signal completely invisible on-chain. It reveals:

- **Unmet demand:** People wanted to buy Token X but couldn't get acceptable execution → market opportunity signal
- **Risk thresholds:** At what risk score do agents abort? → behavioral intelligence
- **Protocol quality:** If verification keeps flagging Protocol Y → leading indicator of trouble before any exploit
- **Price sensitivity:** How much slippage will agents tolerate? → market microstructure intelligence
- **Emerging trends:** What are agents trying to do that they couldn't do last week? → new use case detection

No on-chain analytics tool can see failed intents. Only an intent-based system captures them. This is a potential standalone data product: "what did agents want to do today but didn't?"

### From Intents to Flows: Multi-Step Orchestration

The intent framework's natural evolution is from single intents to **flows** — ordered sequences of dependent financial actions that accomplish a composite goal.

**Why this matters:** Real financial operations are rarely single transactions. "Swap my SOL to USDC and send half to Greg" is a sequence: swap → calculate output → transfer partial amount. The second transaction can't be constructed until the first settles. The current framework handles this as two independent verifications. But what's actually happening is a **goal** that decomposes into dependent steps — and the gap between steps is a yield opportunity.

**The hierarchy:**

```
GOAL (natural language)
  "Swap my SOL to USDC and send half to Greg"
    │
    ├── FLOW (structured plan — a DAG of intents)
    │   Step 1: Swap SOL → USDC (amount: all, slippage: 1%)
    │   Step 2: Calculate 50% of swap output
    │   Step 3: Transfer USDC to Greg (amount: step2.result)
    │
    ├── VERIFICATION (per-step AND whole-flow)
    │   ✓ Step 1: Does this swap match intent?
    │   ✓ Step 3: Does the transfer match the calculated amount?
    │   ✓ FLOW: Did the sequence achieve the stated goal?
    │
    └── YIELD (on every waiting state between steps)
```

**How flows differ from compound intents:**

| | Compound Intent (existing) | Flow (new primitive) |
|---|---|---|
| **Atomicity** | Single transaction, all-or-nothing | Multiple transactions over time |
| **Dependencies** | None — all actions execute simultaneously | Step N depends on output of Step N-1 |
| **Time span** | Milliseconds | Seconds to months |
| **Chain scope** | Single chain | Potentially cross-chain |
| **Failure mode** | Transaction reverts — clean | Partial completion — requires recovery |
| **Yield opportunity** | None (instant) | Every waiting state earns |
| **Verification** | Once, pre-signing | Per-step AND cumulative goal verification |

Compound intents are a special case — a flow with zero time between steps on a single chain. Flows are the general case.

**The design principle this unlocks: "Make the wait productive."** Any time gap between flow steps is a yield opportunity. Limit orders, escrows, DCA intervals, bridge finality, payroll before disbursement, milestone contracts — every waiting state can earn. This only works because we have both the yield stack AND the orchestration layer. No competitor can replicate yield-bearing flows without building both.

**The limit order is the first flow.** It's already described in the SDK doc as: deposit to yield → heartbeat → check price → withdraw → swap. That's a multi-step flow with a conditional trigger. Building it with flow-awareness from the start (internally decomposed into verifiable steps) lays the foundation for generalizing flows later without rewriting.

**Complexity spectrum:**

| Complexity | Examples | What's New |
|-----------|---------|-----------|
| **Simple** (2-3 steps, single chain) | Swap and send, limit order with yield, DCA | Output-dependent sequencing, yield between steps |
| **Medium** (3-6 steps, cross-chain) | Cross-chain transfer, portfolio rebalance, escrow with yield, invoice payment | Cross-chain coordination, parallel sub-flows |
| **Complex** (6+ steps, multi-party) | Payroll, treasury management, multi-party settlement, agent-to-agent commerce | Fan-out patterns, ongoing rule-driven flows, evaluation gates |

**Why this is strategically significant now (not later):** The architectural decisions made in the limit order (Mar 24) will either enable or constrain the flow primitive. Building with awareness of where this goes — even without exposing flows to users yet — is different from building blind. The internal decomposition into verifiable steps is the foundation.

> **Full exploration:** See `[[exploration-multi-step-orchestration-2026-03-18]]` for complete analysis including second-order effects, use cases, competitive implications, CI/CD analogy, and standards opportunity.

---

## 4. Product Vision: The Agent Neobank

### The Full Stack

The vision is a multichain financial superapp purpose-built for agents — banking, yield, trading, payments, address book, escrow, and eventually credit and insurance. Every feature generates intent data. Every dollar earns yield by default.

| Capability | What It Does | Intent Data Generated |
|------------|-------------|----------------------|
| **Accounts** | Silk Accounts — policy-controlled, multi-operator, on-chain enforcement | Account creation, policy configuration, operator management |
| **Yield** | Default yield on all balances via RebelFi yield infrastructure | Deposit/withdraw intents, yield preferences, hold duration |
| **Trading** | Swap, limit orders, DCA, portfolio rebalancing | Swap intents, price targets, risk tolerance, token preferences |
| **Payments** | Transfer, escrow, streaming, recurring, cross-border | Payment intents, contact graph, payment frequency, amounts |
| **Address Book** | Contacts, counterparty reputation, transaction history | Relationship graph, trust signals, transaction patterns |
| **Multichain** | Solana, Ethereum, Base, Polygon, Arbitrum — same intent format | Chain preferences, bridge intents, cross-chain patterns |
| **Flows** | Multi-step financial operations — yield-bearing limit orders, DCA, cross-chain transfers, payroll, treasury management | Flow composition patterns, step dependencies, failure points, process intelligence |
| **Recipes** | Drop-in skills/prompts for instant agent capabilities (single-action AND flow templates) | Which capabilities agents adopt, usage patterns, flow template popularity |

**Yield as the default state:** Unlike traditional crypto wallets where funds sit idle, every dollar on Agent CLI earns yield automatically. When an agent needs to transact, funds are pulled from yield positions. This creates economic gravity — agents have a financial reason to keep funds on Agent CLI vs. a raw wallet where balances earn nothing. This is the traditional bank float model, but transparent.

**The "corporate bank account" mental model:** A Silk Account is like a corporate bank account where the business owner sets spending rules for each authorized signer. The CFO can sign for $100K, the office manager for $5K. The bank (Solana program) enforces the limits — not the signers themselves. No committee vote needed. Each signer acts independently within their bounds. This is exactly what agent operators need: give Agent A a $500/day trading budget, Agent B a $100/day service purchasing budget, Agent C read-only access.

### Building Sequence

The superapp is aspirational. What we build is dictated by traction and adoption signals. The sequence:

**Now → Swap verification + limit orders (the first flow)**
Start with the simplest, highest-demand use case: trading bots that swap tokens. The intent framework verifies swaps against stated parameters. Limit orders add yield-while-waiting (convergence of both tracks) and are internally the first multi-step flow (deposit → yield → monitor → withdraw → verify → execute). Build with flow-awareness even though flows aren't exposed to users yet.

**Signal: Users request composition → Expose flow primitive**
If users ask for "limit order, then send the proceeds to X" or "DCA, but adjust amounts based on Y," the flow primitive has pull. Expose the flow definition format — let users define their own multi-step operations. This is the "Recipes v2" moment: flow templates replace single-action recipes as the primary distribution unit.

**Signal: 100+ active verification users → Expand to payments + escrow**
If trading bots adopt verification, expand to transfer verification, escrow, and the address book. The escrow feature is a viral growth mechanism (see Section 7). Escrow + yield = yield-bearing escrow, a flow primitive that only we can build.

**Signal: Agents holding balances → Activate full banking**
If agents start keeping funds on the platform (attracted by yield + verification), activate full Silk Account capabilities, multi-operator policies, fleet management dashboards. Silk Account policies + flow templates = the complete delegation model (policies control what agents CAN do, flows control what they WILL do).

**Signal: 6+ months of behavioral data → Launch risk intelligence products**
The data-enabled products (operator risk scoring, risk intelligence feeds, collateral optimization, insurance) require volume. They activate when the data is meaningful. Flow data is categorically richer than single-intent data — it captures process intelligence, not just individual decisions.

Each phase is a checkpoint. If signals don't appear, we don't over-invest. If they appear faster than expected, we accelerate.

### Recipes: Drop-In Agent Capabilities

A "recipe" is a pre-built prompt or skill that any agent can use to instantly bootstrap a financial capability. Recipes are the lowest-friction distribution mechanism possible — lower than an SDK integration, lower than an MCP server, lower than an API call. Copy a recipe, and your agent can trade.

**Example recipes:**

| Recipe | What It Does | Data Generated |
|--------|-------------|----------------|
| **Swap** | "Swap X of token A for token B, verify before signing" | Swap intents, token preferences, slippage tolerance |
| **Limit Order** | "Buy token X when price hits Y, earn yield while waiting" | Price targets, hold duration, yield preferences |
| **DCA** | "Buy $50 of SOL every Monday" | Recurring intent patterns, dollar amounts, schedule |
| **Send Payment** | "Send 5 USDC to alice@email.com" | Contact graph, payment amounts, frequency |
| **Pay for Service** | "Pay for Firecrawl API access, verify the charge" | Service consumption, vendor preferences, spend patterns |
| **Escrow** | "Hold 100 USDC in escrow until delivery confirmed" | Escrow patterns, counterparty relationships, completion rates |
| **Portfolio Rebalance** | "Rebalance to 60% stables / 40% SOL" | Asset allocation preferences, rebalancing frequency |

**Why recipes are strategically important:**

1. **Zero integration effort** — copy a prompt, your agent has the capability
2. **Viral distribution** — developers share useful prompts; each shared recipe brings new users to Agent CLI's infrastructure
3. **Intent standardization** — every recipe uses Agent CLI's intent format, making it the de facto standard for expressing financial actions
4. **Data collection** — every recipe execution flows through the intent framework
5. **Progressive adoption** — start with one recipe, discover others, eventually integrate the full SDK

Recipes are the trojan horse. They look like developer convenience. They're actually a distribution and data collection mechanism.

### Recipes v2: Flow Templates

The evolution of recipes from single-action capabilities to multi-step workflow templates:

| | Recipes v1 (single-action) | Recipes v2 (flow templates) |
|---|---|---|
| **What it encodes** | A capability ("your agent can swap") | Domain expertise ("your agent can run payroll") |
| **Complexity** | One intent, one verification | DAG of intents with dependencies, conditions, yield directives |
| **Value** | Convenience | Business process automation |
| **Monetization** | Free (data collection) | Potentially paid (high-value templates encode real expertise) |
| **Lock-in** | Low (single-use, stateless) | High (flows are stateful — money mid-operation) |

**Flow template examples:**

| Template | Steps | Yield Opportunity |
|----------|-------|--------------------|
| **Yield-Bearing Limit Order** | Park in yield → monitor price → withdraw → verify → swap | Hours to weeks between deposit and trigger |
| **Smart DCA** | Recurring: withdraw from yield → swap (amount adjusted by price momentum) → repeat | Days between buys |
| **Cross-Chain Transfer** | Wrap → bridge → wait for finality → unwrap → transfer | Minutes during bridge finality |
| **Yield-Bearing Escrow** | Deposit to escrow → park in yield → monitor condition → release | Hours to months during escrow |
| **Multi-Currency Payroll** | Convert treasury → distribute to N addresses → verify all received → report | Days between treasury deposit and disbursement |

**The marketplace potential:** Template creators (domain experts, operators) publish flow templates. Template users instantiate and customize them. Every execution generates flow data. More templates → more diverse flow data → better optimization → better templates. The competitive moat compounds — a new entrant can copy the verification API but cannot copy a marketplace of battle-tested flow templates with usage data across thousands of executions.

---

## 5. What We Have Today

### Silk Accounts (Solana — Deployed)

On-chain smart accounts via the Silkysig program. Key properties:

- **Role-based:** One owner (full control) + up to 3 operators with independent policies
- **Per-operator policy enforcement:** Each operator has their own per-transaction and daily spending limits
- **On-chain enforcement:** The Solana program itself rejects policy violations — cannot be bypassed even with a compromised key
- **Not a multisig:** Operators act independently, not by consensus. No quorum needed.
- **Account-as-entity:** Holds balances, has on-chain identity and transaction history

No existing crypto primitive combines all five properties. This is genuinely novel.

### Handshake Escrow (Solana — Deployed)

On-chain escrow protocol for agent-to-agent and agent-to-human transactions:

- Create escrow with conditions
- Fund escrow with USDC/tokens
- Counterparty claims when conditions are met
- Dispute resolution flow
- Timeout-based release

This is the primitive that enables the viral growth loop (see Section 7).

### RebelFi Yield Infrastructure (Live)

The yield platform is live and generating revenue:

- Stablecoin yield accounting for businesses
- Active deal pipeline: WhizPay (PRD complete), Nomadrem (active discovery), Delos, Kuratek, Acta
- Dakota integration serves multiple deals simultaneously
- Proven yield strategies on stablecoins

**How yield plays into the agent neobank:** Every idle dollar on Agent CLI automatically earns yield through RebelFi's infrastructure. This isn't a new product — it's the existing product deployed as the default state for agent accounts. The yield infrastructure is the economic engine that makes the neobank work.

### Transaction Verification SDK (In Progress)

The intent framework is built:

- Cross-chain intent type system (transfer, swap, stake, lend, borrow, approve, withdraw + custom actions)
- Chain-agnostic matching engine with constraint evaluation (exact, gte, lte, ranges)
- Token registry (chain-and-network-scoped, extensible)
- Solana chain adapter (transaction deserialization, program-specific decoders for Jupiter, SPL Token, Handshake/Silkysig)
- Compound intents (multiple actions in one transaction)
- Strict mode (no unexpected instructions allowed)

**What's next:** EVM chain adapter (ABI decoding), REST API wrapper, MCP server, risk intelligence layer (protocol risk, counterparty scoring, economic sanity).

---

## 6. The Data Moat

### What We Collect

Every verification request — even on the free tier — feeds the data engine:

| Data Type | What It Tells Us | What It Enables |
|-----------|-----------------|-----------------|
| **Intent patterns** | What agents want to do, how they express it, what parameters they use | Intent taxonomy, product roadmap intelligence |
| **Verification outcomes** | Match rates, common discrepancies, confidence levels | Better verification models, protocol quality scores |
| **Risk decisions** | Do agents proceed after warnings? At what threshold? | Behavioral risk profiles, risk tolerance modeling |
| **Transaction graph** | Who transacts with whom, amounts, frequency, completion rates | Counterparty reputation, economic graph, fraud detection |
| **Failed intents** | What agents wanted to do but didn't | Unmet demand signals, market intelligence |
| **Flow patterns** | How agents compose multi-step operations — sequences, dependencies, failure points | Business process intelligence, flow optimization, infrastructure quality signals |
| **Failed flows** | Where multi-step operations break, partial completion states, recovery patterns | Systemic bottleneck detection ("bridge X fails at step 3 in 30% of cross-chain flows"), protocol quality ranking in real-world workflow contexts |
| **Temporal patterns** | When agents trade, pay, rebalance | Predictive models, liquidity planning |
| **Protocol interactions** | Which protocols agents use, problems encountered | Protocol quality rankings, risk intelligence feeds |

### Data-Enabled Products

| Product | Data Required | Earliest Viable | Revenue Model |
|---------|--------------|-----------------|---------------|
| **Better verification** | 1-3 months of screening data | Month 3 | Improves free + paid tiers (retention) |
| **Protocol risk feed** | 3-6 months of aggregate protocol data | Month 6 | API subscription for DeFi platforms |
| **Operator risk scoring** | 6+ months of per-operator behavioral data (observed via agent fleets) | Month 9 | Per-query pricing for lending protocols, collateral optimization |
| **Flow optimization** | 3-6 months of flow execution data | Month 6 | Per-optimization or subscription — "agents doing A→B→C save 18% via route Y at step 2" |
| **Market intelligence** | 6-12 months of aggregate intent + flow data | Month 12 | Subscription for funds, traders, researchers |
| **Mid-flow insurance** | 6-12 months of flow failure data | Month 12 | Premium per remaining-step risk — "your flow is 3/5 complete, insure the remaining steps" |
| **Intent-based insurance** | 12+ months of actuarial-grade data | Month 18 | Premium per coverage |

### Why This Data is Defensible

1. **Intent data is invisible on-chain.** You can scrape every blockchain and never see what agents intended to do vs. what they actually did. The "why" layer exists only in our system.

2. **Failed intents don't exist anywhere else.** Aborted transactions leave no on-chain trace. Only an intent-based system captures demand that went unmet.

3. **Behavioral decisions are proprietary.** "Agent saw a risk score of 65 and proceeded anyway" — that's behavioral intelligence about risk appetite that no public data source contains.

4. **Network effects compound the data.** More agents → more data → better models → more accurate verification → more agents. A new entrant starting from zero can't match the model quality of a system with 12 months of behavioral data.

5. **The data gets more valuable over time.** Risk scoring requires longitudinal data — how an operator's agents behave over months, not minutes. Early data collection creates a time-based moat that can't be shortcut.

6. **Flow data is categorically richer than intent data.** Individual intents are data points. Flows reveal business processes — how agents compose operations, where handoffs fail, which protocols break under multi-step usage. A competitor would need to observe not just what agents do, but the multi-step patterns they compose. That's orders of magnitude harder to replicate.

---

## 7. Network Effects & Growth Mechanics

### The Escrow Viral Loop

The "send money to someone without a wallet" pattern is PayPal's original growth engine, adapted for agents:

```
Alice's agent sends 5 USDC to bob@email.com
    → Agent CLI creates an escrow
    → Bob gets an email with a claim link
    → Bob clicks → creates a Agent CLI account → claims funds
    → Bob is now a Agent CLI user (acquired at near-zero CAC)
    → Bob's agent sends 10 USDC to charlie@email.com
    → Repeat
```

Previous crypto attempts at this (Request Network, Sling, etc.) failed because the friction was too high — the recipient needed to understand wallets, gas, signing. With agents handling all of that, the friction drops to zero. The agent creates the wallet, manages the keys, handles the claiming. The human just clicks a link.

**Every escrow is a potential new user acquisition.**

### Multi-Layer Network Effects

Agent CLI has five distinct network effect layers, each reinforcing the others:

| Layer | Mechanism | Lock-in |
|-------|-----------|---------|
| **Data** | More users → better risk models → better product → more users | Model quality gap widens over time |
| **Liquidity** | More agents with balances → more yield → better rates → more agents | Economic gravity from yield |
| **Temporal (flows)** | Agents mid-flow have money in intermediate states on the platform — can't switch without aborting | Active operations create real-time lock-in (not historical, but right now) |
| **Social/economic graph** | More agents on platform → easier to transact with each other | Contact graph is non-portable |
| **Reputation/risk** | Longer history → better risk profile → more trust → better terms (lower collateral, better pricing) | Behavioral history can't be exported |
| **Developer ecosystem** | More recipes + flow templates → more use cases → more developers → more recipes | Developer mindshare compounds |

**Why agents don't switch:** An operator whose agents have 6 months of behavioral history on Agent CLI, an established contact graph, active yield positions, in-flight flows, and a library of recipes/flow templates won't start from zero on a competing platform. The switching cost isn't technical — it's the accumulated history, relationships, and active operations. Flow lock-in is particularly strong: data lock-in says "your history is here"; flow lock-in says "your money is mid-operation here." One is about the past, the other is about right now.

### The Two-Player Problem in Practice

Concrete examples of how agents dissolve multi-sided bootstrapping challenges:

**Agent-to-agent escrow:** Previously, both parties needed to adopt the same escrow protocol. Now Agent A creates an escrow on Agent CLI. Agent B just needs to interact with a standard Solana contract — no prior adoption required. Agent B's framework doesn't even need to know about Agent CLI specifically; it just sees a claimable escrow.

**Reputation bootstrapping:** Traditional reputation systems need users to actively participate, rate, and build history. Agent reputation emerges automatically from transaction patterns — completion rates, dispute frequency, counterparty diversity, payment timeliness. The reputation system works from day one because the data generation is a side effect of normal activity, not a deliberate action.

**Cross-platform payments:** Agent A lives on ElizaOS. Agent B runs on Solana Agent Kit. Neither framework needs to integrate with the other. Agent A creates a Agent CLI transfer intent, Agent B claims funds. Agent CLI acts as the settlement bridge. The intent framework is protocol-agnostic — it doesn't care what platform the agents run on.

---

## 8. Go-to-Market Strategy

### Phase 1: Trading SDK (Now — Q2 2026)

**Target:** Trading bots and DeFi operators on Solana and EVM chains.

**Why trading first:**
- Largest existing population of "agents" using crypto programmatically
- Real losses from unverified transactions (MEV, rug pulls, sandwich attacks)
- Many operate on minute/hour timescales where 100-500ms verification latency is acceptable
- Already paying for infrastructure (RPC, data feeds) — adding verification is natural
- The swap verification + limit order combo is a concrete, shippable product TODAY

**Products in Phase 1:**
1. Free verification API — verify swap intents against transactions before signing
2. Limit orders with yield — the first multi-step flow (park in yield → heartbeat → verify → execute). Built with internal flow decomposition for future generalization
3. Recipes for swap, limit order, and DCA use cases

**Distribution channels:**
- Solana trading bot communities (Twitter/X, Discord, Telegram)
- Jupiter, Raydium, and DeFi ecosystem integrations
- GitHub repos with open-source examples
- MCP server for Claude, Cursor, Manus agent discovery

**Success metrics:**
- 100+ bots using free verification within 3 months
- 10+ active limit order users
- Measurable behavioral data accumulating

### Phase 2: Agent Banking Platform (Q3-Q4 2026)

**Trigger:** Phase 1 shows adoption signals (100+ active users, agents holding balances).

**Products in Phase 2:**
- Full Silk Account activation — multi-operator policies, fleet management
- **Flow orchestration engine** — expose the flow primitive. User-definable multi-step operations with per-step verification, cross-step yield, and goal-level tracking. Flow templates as Recipes v2.
- Payment flows — transfer, escrow (yield-bearing), streaming, recurring
- Address book with counterparty reputation
- Operator dashboard — verification history, risk alerts, spending analytics, flow monitoring
- EVM expansion — same intent framework, same API, new chains
- Cross-chain flows — multi-chain operations coordinated through the flow engine

**Distribution channels:**
- Agent framework integrations (ElizaOS, Solana Agent Kit, Coinbase AgentKit)
- Framework-specific recipes and plugins
- x402 ecosystem — verification as middleware before payment execution
- Enterprise outreach — agent fleet operators needing compliance and controls

### Phase 3: Data Products & Financial Services (2027)

**Trigger:** 6+ months of behavioral data, meaningful user base.

**Products in Phase 3:**
- Operator risk scoring — behavioral data → counterparty risk signals, collateral optimization
- Protocol risk intelligence feed — sellable API for DeFi platforms
- Market intelligence — aggregate intent data → fund/researcher subscriptions
- Insurance products — intent-based pricing
- Agent-to-agent lending — enabled by operator risk scoring, collateral-optimized

### Distribution Deep Dive

#### Recipes & Skills

Pre-built prompts distributed via:
- NPM packages / SDK documentation
- MCP tool definitions
- GitHub repos (open source, shareable)
- Agent framework plugin registries
- Community sharing (Twitter, Discord, developer forums)

Each recipe is a self-contained capability. The developer doesn't need to understand the intent framework, the verification engine, or the architecture. They copy a recipe, and their agent can trade.

#### MCP Server

The highest-leverage distribution channel. An MCP server exposes Agent CLI's tools directly to any MCP-compatible agent (Claude, Cursor, Manus, Replit):

- `verify_transaction` — check if a transaction matches intent
- `create_limit_order` — yield-bearing limit order (first flow)
- `create_flow` — define and execute a multi-step financial operation
- `get_flow_status` — check progress of an in-flight flow
- `send_payment` — transfer with optional escrow
- `check_risk` — protocol or counterparty risk assessment
- `get_balance` — account balance and yield status

MCP is the de facto standard for agent-to-tool interfaces. Coinbase AgentKit, OKX, Solana Agent Kit v2, and MoonPay all support it. An agent that can access MCP tools can access Agent CLI without any additional integration.

**Competitive urgency:** Sponge and Sapiom already have live MCP servers. Every week of delay is competitors embedding deeper in developer workflows.

#### Framework Integrations

Target frameworks by reach and receptiveness:

| Framework | Reach | Integration Path | Priority |
|-----------|-------|-----------------|----------|
| **ElizaOS** | 17,400+ GitHub stars, MCP support | Plugin + recipes | High |
| **Solana Agent Kit** | 100,000+ downloads, MCP in v2 | MCP server + recipes | High |
| **Coinbase AgentKit** | 50+ actions, MCP support | Agent Skill contribution | Medium |
| **Virtuals GAME** | 18,000+ deployed agents | Need to assess pre-signing hooks | Medium |
| **Olas/Autonolas** | 700K+ txs/month, most autonomous | Service composition | Medium |
| **OKX OnchainOS** | 1.2B daily API calls | MCP support, 60+ chains | Lower (breadth play) |

#### Developer Documentation (llms.txt)

Agent-discoverable documentation via the llms.txt standard. SEO for the agentic era — agents using LLM-based tools find our services and documentation without human configuration. Compounds over time.

---

## 9. Competitive Landscape

### Market Map

The agent financial infrastructure space is splitting into distinct layers:

```
┌─────────────────────────────────────────────────────────┐
│                    FULL STACK / NEOBANK                  │
│                                                         │
│  Catena ($18M) — banking + identity + open protocol     │
│  Natural ($9.8M) — fiat-first payments + compliance     │
│  Agent CLI — intent verification + yield + banking       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│              PAYMENT PROTOCOLS / STANDARDS               │
│                                                         │
│  MPP (Tempo + Stripe) — HTTP 402, multi-rail, IETF      │
│  x402 (Coinbase) — HTTP stablecoin payments              │
│  ACP (Stripe + OpenAI) — commerce protocol               │
│  AP2 (Google) — fiat mandates                            │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                  WALLETS + PAYMENTS                      │
│                                                         │
│  Sponge (YC) — custodial wallets + x402 marketplace     │
│  Locus (YC) — policy wallets + wrapped APIs + tasks     │
│  Skyfire — payments + identity + commerce                │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                SERVICE PROCUREMENT                       │
│                                                         │
│  Sapiom ($15.75M) — HTTP SDK wrapper + service catalog  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│              IDENTITY + COMPLIANCE                       │
│                                                         │
│  T54 ($5M) — KYA, Trustline, x402-secure               │
│  ERC-8004 — on-chain agent identity registries (draft)  │
│  Visa TAP — agent trust verification (in development)   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│              AGENT-NATIVE PAYMENTS                       │
│                                                         │
│  Radius — 2.5M TPS payments network for agents (early)  │
│  AXTP (Circuit/Chisel) — MCP server payments (early)    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Competitor-by-Competitor Analysis

#### Catena Labs — The 800-Pound Gorilla

**Raised:** $18M from a16z crypto. CEO is Circle co-founder / USDC co-inventor.

**What they're building:** First "AI-native regulated financial institution" + ACK (Agent Commerce Kit) open protocol. Agent-owned USDC accounts on Base. Two-layer security: intelligence (ACK-ID with W3C DIDs) + enforcement (Turnkey secure enclave). Treasury management with APY view.

**Their thesis:** "Intelligence without enforcement is just prompt suggestions. Enforcement without intelligence is just a dumb access list." — nearly identical to our Verification SDK + Silk Accounts framing.

**What they DON'T have:**
- Pre-signing transaction verification (zero)
- DeFi-native intelligence (MEV, slippage, protocol risk)
- Transaction simulation / intent matching
- Solana support
- Yield generation (display only — they show APY but don't generate it)

**Threat level:**
- HIGH for Silk Accounts (direct overlap: policy-controlled agent accounts, custody)
- LOW-MEDIUM for Verification SDK (no pre-signing capability — our uncontested territory)
- HIGH for standards-setting (if ACK becomes the default, building outside ACK = building outside the ecosystem)

**Key concern:** They'll fill the verification gap eventually. Their two-layer thesis is too close to ours. Speed matters.

**Partnership angle:** ACK compatibility for the intent framework. If ACK becomes a standard, our intent verification should work within it, not against it.

#### Natural — The Enterprise Play

**Raised:** $9.8M. Investors include Bridge CEO, Mercury CEO, Ramp CEO & CTO, Vercel CEO, YC GP.

**What they're building:** Fiat-first (ACH-native) agentic payments. FDIC-insured agent accounts. Full stack: wallets, payments, identity, compliance, observability, disputes. Agent credit lines coming.

**What they DON'T have:**
- Yield on balances (zero)
- Pre-signing verification (their "observability" is post-execution logging)
- DeFi protocol intelligence
- Solana support
- Stablecoin-native architecture

**Threat level:** MEDIUM-HIGH for Silk Accounts (conceptual overlap but fiat-first). LOW for Verification SDK. NONE for yield.

**Partnership angle:** Natural accumulates idle stablecoin balances with no yield → future integration target for RebelFi yield infrastructure.

#### Sponge — The Developer-Friendly Option

**Raised:** YC-backed. Live product: SDK v0.2.1, mainnets active (Ethereum, Base, Solana).

**What they're building:** Custodial crypto wallets + x402 service marketplace. MCP server live. Claude integration first-class. Spending limits, allowlists, fleet management.

**Critical quote from their docs:** "By default, Claude can execute transfers without confirmation. Consider implementing approval flows for production use."

**What they DON'T have:**
- Yield on balances (zero)
- Pre-signing verification (they expose a `beforeExecute` hook — a literal plug-in point for our SDK — but provide zero verification intelligence)
- Intent matching
- KYA/KYB compliance

**Threat level:** MEDIUM-HIGH for Silk Accounts (overlapping features). LOW for Verification SDK (the hook is an integration point, not competition). NONE for yield.

**Partnership angle:** Best near-term partner candidate. Three integration points: (1) plug verification into their `beforeExecute` hook, (2) yield on idle Sponge balances, (3) list verification as a paid service in their x402 catalog.

#### Locus — The "Rack" on EVM

**Raised:** YC F25 standard deal. Team: 2 (ex-Coinbase + ex-Scale AI).

**What they're building:** Policy-controlled wallets on Base (EVM). USDC-only. Smart wallets (ERC-4337). Wrapped APIs (agents pay for external services via single API key). Tasks marketplace (agents hire human freelancers). Checkout router.

**Strategic significance:** Locus has executed the "wrapped APIs" concept — what we called "the rack" in the Agent OS gameplan — on EVM. It's live and growing.

**What they DON'T have:**
- Yield (zero)
- Solana support (zero)
- Pre-signing verification (zero)
- MCP server (an opening for us)
- Intent matching

**Threat level:** HIGH for the "rack"/wrapped APIs concept on EVM. LOW for Verification SDK. NONE for yield.

**Partnership angle:** Two real integration points: (1) yield on idle Locus wallet balances, (2) verification SDK before their Checkout `pay()` call.

#### Sapiom — The Service Procurement Layer

**Raised:** $15.75M. Anthropic + Coinbase Ventures as investors.

**What they're building:** Financial layer for agents to autonomously purchase APIs, compute, SaaS. Single SDK wrapper around existing HTTP client. 400+ services. MCP server live.

**What they DON'T have:**
- Yield (zero)
- DeFi/on-chain transaction verification (zero)
- Solana support
- Agent-to-agent escrow
- Operator risk scoring

**Threat level:** MEDIUM-HIGH (different stack — fiat vs. on-chain — but same category label). Anthropic as investor = potential Claude distribution advantage.

#### Skyfire, T54

**Skyfire:** Payments + identity + commerce platform. Most visible ecosystem, featured in mainstream press. Watch for transaction volume — if anyone hits the $1M/month tripwire, it's likely here.

**T54:** Identity and compliance layer. KYA, Trustline risk engine, x402-secure. $5M raised. Different focus (compliance/identity vs. financial infrastructure).

Neither represents a direct competitive threat to our core (verification + yield), but both are building adjacent infrastructure.

### Broader Ecosystem Players (Not Competitors — Context)

McKinsey's ecosystem map reveals players shaping the agentic commerce landscape that aren't direct competitors but will determine the environment we operate in:

**AI platforms building commerce capabilities:**
- **OpenAI** — Operator (agentic browser), ACP with Stripe (in-chat purchases), announced AI-native browser. Agent transaction volume will flow through OpenAI's ecosystem.
- **Perplexity** — "Buy with Pro" launched late 2024. Agentic shopping already live.
- **Shopify** — Building agentic shopping infrastructure allowing agents to tap into catalogs and build carts across merchants. Shopify's merchant base = massive surface area for agent transactions.
- **Amazon, Google, PayPal** — All developing agentic shopping services.

**Card networks repositioning:**
- **Visa** — AI-ready cards, tokenized digital credentials, partnerships with Anthropic/OpenAI/Perplexity/Samsung/Stripe. Piloting spend within preset budgets. The most aggressive mover.
- **Mastercard** — Agent Pay solution. Separate from Google's AP2 but similar direction.

**Why this matters for us:** These players are creating the **volume** of agent-initiated transactions. They're not our competitors — they're creating our market. Every Shopify agentic purchase, every Operator checkout, every Visa agent transaction is a potential verification surface. The question is whether verification happens at their layer (unlikely — they're focused on payments and commerce, not pre-execution intent matching) or at a dedicated verification layer (us).

**The infrastructure gap they leave open:** None of these players are building pre-signing intent verification, yield on idle agent balances, or multi-step flow orchestration with yield. They're building the pipes (payments, commerce, identity). We're building the safety/trust layer that sits on top of the pipes. That's a complementary position, not a competitive one — which means partnership conversations are viable.

### Our Uncontested Territory

Four capabilities no competitor has or is building:

1. **Pre-signing intent verification** — verifying that a transaction matches the agent's stated intent before it signs. Every competitor does post-execution logging or static policy checks. None does semantic intent matching against live transactions.

2. **Yield on idle agent balances** — no one generates yield for agent accounts. Catena displays APY but doesn't generate it. Everyone else: zero. We have live yield infrastructure.

3. **Yield-bearing flow orchestration** — multi-step financial operations where every waiting state earns yield and every step is verified against the overall goal. This requires both an orchestration engine AND yield infrastructure. No competitor has either, let alone both. The complexity barrier is significant: state management across time and chains, dependency resolution, failure handling (sagas), yield interleaving, cross-chain coordination, partial completion recovery, and goal-level verification. A startup can ship single-transaction verification in weeks. Flow orchestration is an order of magnitude harder.

4. **The multi-layer data asset** — no one captures user instruction → structured intent → transaction → verification outcome → agent decision. Flow data extends this further: capturing process intelligence (how agents compose operations, where flows break, which protocols fail under multi-step usage). This data doesn't exist anywhere else and can't be replicated by observing on-chain activity.

### Standards Risk

**ACK (Catena Labs):** Agent Commerce Kit — open protocol for agent identity (W3C DIDs) and payments. Backed by a16z + Circle. If ACK becomes the default standard, building outside it could mean building outside the ecosystem. Currently at 130 GitHub stars, sub-300 npm downloads/month — low adoption, but the backing is formidable.

**ACP (Stripe + OpenAI):** Agentic Commerce Protocol — open protocol for AI platforms and businesses to transact. Already adopted by major retailers. Focuses on commerce, not DeFi. Co-developed with Stripe — enables purchases directly within ChatGPT.

**AP2 (Google):** Agent Payments Protocol — launched September 2025. Open, payment-agnostic protocol for verifiable agent purchases. Uses **cryptographically signed mandates** linking intent, cart, and payment to create non-repudiable audit trails. Backed by Mastercard, PayPal, American Express, Adobe, and Alibaba. This is the closest fiat-world analogue to our intent framework — it creates an "intent → execution → verification" chain for commerce transactions. Key differences from our framework: AP2 is fiat commerce, we're on-chain finance; AP2 uses cryptographic attestation, we use transaction deserialization and semantic matching; AP2 has Google + major card networks, we have first-mover in DeFi intent verification.

**Visa AI-ready infrastructure:** Visa is positioning its global network as backbone for agentic commerce, partnering with Anthropic, IBM, Microsoft, Mistral AI, OpenAI, Perplexity, Samsung, and Stripe. Piloting transactions where agents spend within preset budgets and consent parameters. Launched tokenized digital credentials ("AI-ready cards") replacing static card details — enabling merchants to verify a consumer's agent is truly authorized.

**Mastercard Agent Pay:** Developing its own agent payment solution. Separate from AP2 but same direction.

**Skyfire KYAPay:** Open standard for agent identity verification and programmable payments. 130+ GitHub stars, onboarded partners like APIFY, BuildShip, CarbonArc, Forta. Compatible with MCP servers, APIs, and existing auth systems.

**x402 (Coinbase):** HTTP-native stablecoin payments. Integrations at Cloudflare, Google Cloud, AWS, Anthropic, Stripe. Every x402 service is a potential surface for agent transactions that benefit from verification.

**MPP — Machine Payments Protocol (Tempo + Stripe):** Launched March 2026. The most significant new entrant in the agent payments standards space. Co-developed by Tempo Labs and Stripe, submitted to the IETF standards track. MPP standardizes HTTP 402 for machine-to-machine payments with an extensible Challenge–Credential–Receipt flow.

Key properties that differentiate MPP from x402:
- **Payment-method agnostic** — supports Tempo stablecoins, Stripe (cards/wallets), Lightning (BTC), Solana (SOL/SPL), and custom payment methods. x402 is blockchain-only.
- **Sessions** — off-chain voucher-based pay-as-you-go payments (sub-100ms latency, near-zero per-request fees, payments as small as $0.0001). x402 requires an on-chain transaction per request.
- **IETF standards track** — submitted as Payment HTTP Authentication Scheme. x402 has no standards body submission.
- **MCP transport binding** — native JSON-RPC transport (error code `-32042`) for AI tool call payments. Agents pay for MCP tool calls directly.
- **Production SDKs** — TypeScript (`mppx`), Python (`pympp`), Rust (`mpp-rs`). Middleware for Hono, Express, Next.js, Elysia.
- **x402 compatible** — MPP's charge intent maps directly onto x402 "exact" flows. MPP clients can consume existing x402 services.

**What MPP does NOT do (our gap):**
- No pre-signing intent verification — MPP tells agents "pay $X to address Y" but doesn't verify whether the charge is legitimate, fairly priced, or matches the agent's original intent
- No risk assessment — no counterparty scoring, protocol risk, economic sanity checks
- No yield — agents need funds to pay MPP services; those funds sit idle between payments
- No flow orchestration — MPP handles individual payments, not multi-step operations
- No behavioral data capture — settles payments but doesn't capture intent-to-execution gaps or agent decisions

**Strategic implication:** MPP is likely to absorb or supersede x402 as the dominant machine payments standard (stronger backing, broader payment method support, IETF track, better micro-payment economics). Every reference to x402 as an integration target in this document applies equally or more strongly to MPP. The verification SDK should support both protocols.

**Five integration angles for Agent CLI:**
1. **Verification as pre-payment safety layer** — before an agent sends an MPP Credential, the verification SDK checks: Is this service legitimate? Is the price fair? Does this match intent? New intent type: `pay_for_service`
2. **Yield-bearing MPP treasury** — agents hold USDC on Agent CLI earning yield; withdraw to pay MPP services; remaining balance continues earning. MPP sessions require fund deposits → yield until session opens
3. **Custom MPP payment method** — define a `agent-cli` payment method wrapping any underlying rail but adding verification + yield + behavioral data capture. Services advertise `method="agent-cli"` alongside `method="tempo"`
4. **Flow orchestration over MPP payments** — multi-step agent operations involving sequences of paid services (search → analyze → generate → deliver), each paid via MPP. Agent CLI orchestrates sequencing, budget enforcement, yield between steps
5. **Distribution channel** — every MPP-enabled service is a potential verification customer. MPP's MCP transport means direct integration with our MCP distribution channel

**Threat assessment:**
- MPP + Tempo Wallet could eat into the agent wallet space (Tempo Wallet has spend controls and service discovery)
- Stripe backing = serious distribution power and mainstream credibility
- If MPP becomes the standard and builds its own verification layer, it could reduce demand for external verification
- HOWEVER: MPP explicitly positions itself as payment infrastructure, not safety/trust infrastructure. The verification gap is structural, not accidental

**ERC-8004 (Trustless Agents):** Draft EIP from MetaMask, Google, Coinbase, and Ethereum Foundation. Creates on-chain registries for agent identity, reputation, and validation. Agent registration files can list MCP endpoints, A2A agent cards, ENS names, and DIDs together. Designed to work with existing communication protocols. Relevance: if agent identity moves on-chain, our counterparty verification control plane (#3) could consume ERC-8004 registries to assess counterparty trustworthiness. Watch for adoption signals.

**Visa TAP (Trusted Agent Protocol):** Verifiable signatures proving an agent is Visa-trusted, acting on behalf of a recognizable consumer, carrying valid payment credentials. Merchants use TAP to distinguish trusted agents from bots/scrapers. Complementary to our SDK: Visa TAP answers "should I trust this agent?" while we answer "should this agent trust this transaction?" Potential integration point for counterparty verification.

**VIC (Visa Intelligent Commerce) / MAP (Mastercard Agent Pay):** Card-like tokens for agents on their respective networks. Both in testing, rollout later 2026. These extend card infrastructure to agent transactions. Our verification SDK verifies the intent behind the payment regardless of token type. Adjacent, not threatening.

**AXTP (Agent Transaction Protocol — Circuit/Chisel):** Allows agents to pay for MCP servers and get paid. Early stage. Directly relevant to our MCP distribution strategy — if AXTP gains traction for MCP payments, we need to verify AXTP transactions too. Adds urgency to shipping our own MCP server first.

**Radius:** Payments network for AI agents claiming 2.5M TPS. SDK for agent monetization. PKI-based signing approach (not blockchain). Early stage with uncertain GTM. Watch list.

**Protocol hierarchy (adapted from [Fintech Brainfood](https://www.fintechbrainfood.com/p/the-agentic-payments-map)):** The standards landscape is resolving into six layers: (1) Agent communication (MCP, A2A), (2) Trust (ERC-8004, Visa TAP, ACK, KYAPay), (3) Mandate (AP2, VIC, MAP), (4) Transaction flow (ACP, UCP), (5) Authentication, (6) Payment rail (MPP, x402, AXTP, cards, stablecoins). We sit at layers 2 and 5, adjacent to 6 via yield. This is a cleaner framing than our previous three-layer split and useful for positioning conversations.

**Mitigation:** The intent framework is protocol-agnostic. Intents can be verified regardless of whether the transaction uses ACK-Pay, x402, MPP, AP2 mandates, or native transfers. We should be compatible with all standards, not tied to any one. MPP's custom payment method extensibility makes it the most natural integration target — we can define a Agent CLI payment method that bakes verification into the protocol flow itself. Consider contributing ACK-compatible intent types AND exploring AP2 mandate compatibility — if agents start transacting across both fiat (AP2) and crypto (on-chain) rails, the system that can verify intents in both worlds becomes the universal trust layer.

**Critical strategic observation:** The standards landscape is splitting into three layers:
- **Identity** — ACK (agent identity), Visa (tokenized credentials), KYAPay (agent passports)
- **Payments** — MPP (Tempo + Stripe, IETF track — likely to absorb x402), AP2 (fiat mandates), ACP (commerce protocol), x402 (Coinbase)
- **Workflows** — **Nobody.** No one is defining how multi-step financial operations are expressed, parameterized, and verified. This is the flow format standards opportunity (see Section 10).

We don't need to win the identity or payments standards wars. We need to own the **verification and workflow layer** that sits on top of all of them. MPP strengthens this positioning — the more standardized and widespread machine payments become, the more valuable a universal verification layer on top becomes.

---

## 10. Strategic Angles & Opportunities

### Multi-Step Flow Orchestration — "GitHub Actions for Money"

The most significant product expansion opportunity. Full analysis in `[[exploration-multi-step-orchestration-2026-03-18]]`.

**Core insight:** Real financial operations are almost never single transactions. They're sequences — swap then send, DCA with yield between buys, cross-chain bridge then deposit, payroll conversion then distribution. The intent framework naturally evolves from verifying individual intents to orchestrating and verifying multi-step flows.

**Why this matters strategically:**

1. **Transforms Agent CLI from a tool to a platform.** Single verifications are stateless and substitutable — call an API, get a result. Flows are stateful — money mid-operation on Agent CLI can't switch without aborting. This is the difference between Stripe (payment API) and a bank (where operations run).

2. **Creates a standards opportunity.** ACK (Catena) defines agent identity. x402 (Coinbase) defines agent payments. Nobody defines agent financial workflows. If Agent CLI defines the flow format — how multi-step financial operations are expressed, parameterized, and verified — it defines the standard for programmable agent finance. First-mover advantage on the flow format is a standards play.

3. **The CI/CD analogy is a distribution shortcut.** "GitHub Actions for money" communicates instantly to the developer audience. Flow definitions that look like pipeline configs (DAGs of steps with triggers, conditions, and dependencies) will feel native to developers who already think in CI/CD pipelines.

4. **Yield-bearing flows is uncontested territory.** Anyone could theoretically build flow orchestration. But yield-bearing flows — where every waiting state between steps automatically earns — requires both the orchestration engine AND yield infrastructure. No competitor has either. This is the deepest intersection of both tracks.

5. **Flow templates become a marketplace with compounding moats.** Single-action recipes are free and easily copied. Flow templates encode domain expertise (payroll workflows, treasury management rules, compliance-aware payment processing). They're more defensible, more valuable, and generate richer data per execution.

**Key use cases by segment:**

| Segment | Flow | Revenue Angle |
|---------|------|---------------|
| **Trading bots** | Limit orders, DCA, smart rebalancing | Yield spread on waiting states + verification fees |
| **Agent commerce** | Service procurement → escrow → delivery → release (all yield-bearing) | Escrow yield spread + verification |
| **Enterprise treasury** | Rebalance → yield-optimize → report (continuous) | SaaS subscription for flow engine + yield spread |
| **Payroll/AP** | Convert → distribute → verify → report | Per-flow fee or subscription |
| **Cross-chain** | Bridge → verify finality → deposit/swap | Per-flow fee + yield during bridge wait |

### Commerce Intent Expansion — Beyond DeFi

**IMPACT: HIGH — this is a TAM multiplier, not a feature addition.**

The intent framework's action taxonomy today: transfer, swap, stake, lend, borrow, approve, withdraw, custom. This covers DeFi. But agentic commerce (McKinsey's $3-5T market) requires a broader taxonomy:

| Commerce Intent | What It Verifies | Example |
|----------------|-----------------|---------|
| **Purchase** | Does this checkout match what the agent was told to buy? Is the price within bounds? Is the merchant legitimate? | "Buy the cheapest flight to Berlin under $400" |
| **Subscribe** | Is this subscription what was authorized? Does the recurring amount match? | "Subscribe to the $20/mo plan for Firecrawl" |
| **Negotiate** | Did the negotiation outcome meet the stated criteria? Was the final price within acceptable range? | "Negotiate hotel rate below $150/night" |
| **Return/Refund** | Was the return initiated for the right item? Is the refund amount correct? | "Return the defective monitor and get full refund" |
| **Compare** | Were sufficient alternatives evaluated? Did the selection criteria match intent? | "Find the best-rated dishwasher under $600" |
| **Bundle** | Does the assembled multi-vendor bundle meet the composite intent? Are individual items correct? | "Plan a weekend trip: flight + hotel + rental car under $800 total" |

**Why this matters now (even though we're not building it now):**
1. **Architecture decisions today constrain or enable this expansion.** The intent type system should be extensible by design. If commerce intents require a rewrite, we've locked ourselves into DeFi.
2. **Fundraise framing.** Investors who see "swap verification for trading bots" calculate a small market. Investors who see "intent verification for all agent financial activity" calculate $3-5T.
3. **Partnership narratives.** Conversations with Visa, Mastercard, and AP2 ecosystem players require a commerce story, not just a DeFi one.
4. **Competitive moat.** Competitors in the DeFi agent space (Catena, Sponge, Locus) aren't thinking about commerce verification. Competitors in the commerce agent space (Perplexity Buy, Operator, Shopify agentic) aren't thinking about intent verification. We could own the gap.

**When to actually build this:** Not now. Phase 1 is DeFi swaps. But the SDK's type system and matching engine should be designed so that adding `purchase`, `subscribe`, `negotiate` intent types is a matter of extending the taxonomy, not rewriting the architecture.

### The Brokered Agent Model — Flows as the Broker Runtime

**IMPACT: HIGH — reframes flow orchestration from internal tool to platform positioning.**

McKinsey identifies three interaction models for agentic commerce:
1. **Agent to site** — agent interacts directly with a merchant
2. **Agent to agent** — agents transact directly with each other
3. **Brokered agent to site** — an intermediary broker agent coordinates across multiple vendors/agents

That third model maps directly to flow orchestration. A broker agent coordinating a multi-vendor purchase is running a multi-step flow: discover options across vendors → compare → negotiate with multiple parties → assemble optimal bundle → verify total → execute payment → track fulfillment across providers.

**The strategic implication:** We're framing flows as "GitHub Actions for money" — sequential financial operations. But the brokered model reveals flows as something bigger: **the coordination runtime for multi-party agent commerce.** Flows aren't just sequences; they're DAGs with fan-out patterns, parallel sub-flows, and multi-party settlement.

**What this unlocks:**
- **Agent CLI as broker infrastructure.** Instead of just orchestrating an agent's own financial operations, we orchestrate interactions between multiple agents. The flow engine becomes the coordination layer.
- **Interagent protocol fees.** Every flow that crosses agent/platform boundaries generates a coordination fee. A flow that touches Agent A (personal shopper) → Agent B (vendor 1) → Agent C (vendor 2) → settlement involves three parties and creates value through coordination that none could achieve alone.
- **Multi-party settlement flows.** The flow engine handles the complexity of coordinating payments across multiple parties — splitting, routing, timing, and verifying that each party received the correct amount. This is yield-bearing by default (funds in intermediate states earn).
- **The marketplace becomes the broker.** Flow templates for brokered scenarios (travel booking, multi-vendor procurement, service comparison) encode domain expertise that's more valuable than single-vendor interaction. Template creators capture the coordination value.

**Connection to existing strategy:** This extends the "GitHub Actions for money" analogy. Simple flows = single-pipeline CI/CD. Brokered flows = orchestrated multi-service deployments with fan-out, health checks, and rollback. The CI/CD analogy scales.

### Systemic Risk Mitigation — The Enterprise Fleet Selling Angle

**IMPACT: MEDIUM-HIGH — reshapes how we pitch to enterprise buyers.**

McKinsey identifies "systemic risk" as a key concern: autonomous agents are decision-makers, not just interfaces. A single faulty prompt can trigger cascading failures — incorrect purchases, overordered inventory, unauthorized transactions. When agents are interconnected, minor errors compound exponentially.

**Current positioning gap:** Our strategy reference frames verification as protecting individual transactions ("does this swap match this intent?"). Enterprise buyers care about something bigger: **what happens when one agent in a fleet of 50 halluccinates and triggers a chain reaction?**

**The fleet-level pitch:**
- "Without pre-signing verification, a single hallucinating agent can trigger cascading failures across your entire fleet. Our verification SDK is the circuit breaker."
- "We don't just verify transactions — we provide fleet-wide anomaly detection. When Agent 7 in your trading fleet suddenly forms intents that deviate from historical patterns, we flag it before it signs."
- "Flow-level verification catches cascading failures that transaction-level verification misses. If Step 3 of a 5-step flow produces an unexpected output, we catch it before Step 4 compounds the error."

**What this means for product:**
- **Fleet-level dashboards** aren't just nice-to-have — they're the enterprise buyer's primary interface. Real-time fleet health, anomaly detection, pattern deviation alerts.
- **Cross-agent correlation** — detecting when multiple agents in a fleet start behaving unusually simultaneously (possible prompt injection, compromised API key, or model degradation).
- **Cascading failure prevention** — if Agent A's output feeds Agent B's input, verification at the handoff point prevents garbage propagation.

**Selling language:** Don't say "verification." Say "agent risk management platform." Don't say "intent matching." Say "autonomous decision validation at fleet scale." Enterprise procurement speaks risk management, not developer tools.

### KYA Compliance as Byproduct — Positioning We're Underexploiting

**IMPACT: MEDIUM-HIGH — regulatory tailwind we should be riding harder.**

"Know Your Agent" (KYA) is going mainstream. McKinsey dedicates a full exhibit to it. The EU AI Act enforcement accelerates August 2026. W3C is working on verifiable credentials for agents. Visa launched "AI-ready cards" with tokenized digital credentials specifically to enable agent identity verification.

**What we're already generating (and not positioning as):**

Every verification request captures:
- **Which agent** formed the intent (agent identifier)
- **What the agent was told to do** (user instruction → structured intent)
- **What the agent constructed** (the transaction)
- **Whether intent matched execution** (verification result)
- **What the agent decided** (proceed, abort, modify after seeing risk signals)
- **The agent's risk tolerance** (proceeds after warnings at what threshold?)

That's not just verification data. **That's a behavioral KYA record.** It's the agent equivalent of a financial identity — not just "who is this agent?" but "how does this agent behave with money?"

**The positioning shift:**
- Current: "We verify transactions against intent."
- Upgraded: "We generate the behavioral audit trail that KYA compliance requires. Every verification is a KYA record. Every flow is a compliance artifact."

**Why this matters for enterprise sales:**
- Companies deploying agent fleets will need KYA compliance before regulators mandate it (proactive governance as competitive advantage)
- Insurance underwriters will want KYA behavioral data before insuring agent operations
- B2B counterparties will demand KYA records before allowing agent-to-agent transactions
- Our data is a KYA compliance product waiting to be packaged — we just haven't called it that yet

**Concrete product opportunity:** A KYA Report for each agent/operator — a score + behavioral profile based on verification history. "This operator's agents have 4 months of clean transaction history, 99.2% intent-match rate, zero policy violations." That's an enterprise procurement artifact.

### Interagent Protocol Fees — A Monetization Layer for Orchestration

**IMPACT: MEDIUM — longer-term revenue stream but worth designing for.**

McKinsey identifies "interagent protocol fees" as an emerging monetization model: when agents from different platforms interact, monetization happens at the protocol level through interoperability or commission sharing.

**How this applies to flows:**
- Every flow that crosses platform boundaries (Sponge wallet → Agent CLI verification → Jupiter execution → Locus delivery) generates coordination value
- The flow engine that orchestrates the handoffs captures a protocol-level fee for coordination
- This is analogous to interchange in card networks — the network charges for facilitating the transaction between issuer and acquirer

**Revenue mechanics:**
| Flow Type | Coordination Fee Source | Pricing Model |
|-----------|----------------------|---------------|
| **Cross-platform verification** | Agent on Platform A verifies via Agent CLI before transacting on Platform B | Per-verification or subscription |
| **Brokered multi-party flows** | Flow engine coordinates between 3+ agents/platforms | Percentage of flow value or flat coordination fee |
| **Cross-chain orchestration** | Flow spans Solana → bridge → Base → execution | Per-hop or per-flow |
| **Settlement coordination** | Multi-party settlement flow with yield on intermediate states | Yield spread + coordination fee |

**When this activates:** Not Phase 1. This requires meaningful flow volume and cross-platform adoption. But the flow engine's architecture should accommodate protocol-level fee injection from the start — adding it later is a plumbing rewrite.

### Compliance & Regulatory Positioning

The EU AI Act enforcement accelerates August 2026. Every agent making autonomous financial decisions will need:
- Audit trails of what the agent was instructed to do vs. what it did
- Transparency in autonomous decision-making processes
- Accountability chains — who authorized this agent, under what parameters?

The intent-to-transaction chain IS a compliance record. The verification result IS a risk assessment audit trail. We don't need to build a separate compliance product — the core product generates compliance artifacts as a byproduct.

**Flows strengthen this significantly.** A single transaction has a single audit trail. A flow has a **causal audit trail** — "this transaction happened BECAUSE of this previous outcome, which was triggered by this condition, which was part of this flow that the operator approved on this date." The flow definition itself is a compliance artifact: "our agent is authorized to execute this payroll flow, approved by the CFO, with these parameters and these guardrails." That's auditable and explainable in a way that "our agent can make arbitrary transactions within a $5,000 daily limit" is not.

**Implications:**
- Enterprise buyers will pay for compliance-grade audit trails before they pay for verification accuracy
- "Every agent financial action audited against intent, with full verification trail" is an enterprise procurement conversation
- Flow-level audit trails ("here's the authorized plan, here's every step that executed") are a stronger compliance artifact than transaction-level trails
- Being first with regulatory-grade records creates a barrier — compliance infrastructure is expensive to replicate
- Governments losing tax revenue to agent economic activity will eventually mandate transaction tracking/reporting — our data becomes compliance infrastructure by regulatory necessity

### MEV Protection via Intent Aggregation

At scale, if multiple agents submit intents through Agent CLI, we see aggregate demand before execution. This enables:

- **Batch execution:** Group similar swap intents → execute as one large trade with better pricing (CoW Protocol model)
- **MEV protection:** Aggregated execution reduces frontrunning attack surface
- **Better pricing:** Volume-based routing to optimal liquidity sources
- **Market intelligence:** Aggregate intent data reveals market direction before it appears on-chain

This is a second-order effect that only works at volume — another reason the free tier and data flywheel strategy is critical. It's also a feature that IMPROVES with more users (true network effect, not just data accumulation).

### Operator Risk Scoring & Collateral Optimization

The long-term play. With 6-12 months of behavioral data:

- Every operator's agent fleet has a verifiable financial track record (intents formed, verification outcomes, transaction completion rates, dispute history)
- Lending protocols can query: "What's the risk profile of this operator's agents? Can we reduce collateral requirements from 150% to 110%?"
- The answer requires exactly the data we're collecting: longitudinal intent-to-execution behavior observed across agent fleets

**Why "agent credit" is really operator credit:** Agents can be instantiated and destroyed at will. An agent could build 6 months of clean history, then abuse an unsecured credit line and get "retired" by its operator — with zero real-world consequences. Human credit works because identity is persistent and default has lasting consequences (lost access to housing, employment, future borrowing). Agents face none of these enforcement mechanisms. The accountable entity is always the operator — the human or business behind the agent. Agent behavioral data is the *observation signal*, but the credit risk sits with the operator.

**What this means in practice:**
- **Not unsecured lending to agents.** That's a fiction built on an analogy that doesn't hold.
- **Reduced collateral requirements** for operators with proven behavioral history — real value (capital efficiency), bounded downside.
- **Ultra-short-duration credit** where the time window is too short to exploit (flash loans++, atomic multi-step operations).
- **Risk pricing inputs** — better history → better rates, lower fees, priority access. Pricing risk, not eliminating it.
- **Counterparty due diligence** — "Should my agent transact with this agent?" based on the operator's track record.

This is closer to a risk intelligence product than a credit bureau. The market opportunity is real — counterparty risk assessment, collateral optimization, and behavioral risk pricing are all valuable. But calling it "Experian for agents" overstates the analogy. The enforcement mechanism that makes Experian work (persistent identity + real-world consequences for default) doesn't exist for agents. It exists for operators.

### Intent-Based and Mid-Flow Insurance

Traditional insurance is backward-looking (what happened historically). Intent-based insurance is forward-looking (what's about to happen):

- "This agent wants to execute a large swap — here's insurance against slippage exceeding X%"
- "This agent is about to interact with a new protocol — here's insurance against smart contract risk"
- Priced in real-time based on the specific intent + current conditions + agent's behavioral history

**Mid-flow insurance** extends this to multi-step operations: "Your flow is 3/5 complete. Step 4 involves a bridge with a 2% failure rate in similar flows. Insure the remaining steps for 0.1% of the flow value." This is only possible with full flow context — knowing what's already completed, what's remaining, and the historical failure rates of each remaining step. No one else can price this because no one else has flow-level behavioral data.

Only achievable with intent + flow data. No one else can price insurance on what an agent is about to do — or what an agent is mid-way through doing.

### Enterprise Agent Fleet Management

As businesses deploy agent teams with financial authority:

- Dashboard showing all agent intents, verifications, and transactions across a fleet
- Real-time alerts when agents encounter high-risk situations
- Policy configuration per agent (trading bots get different rules than procurement agents)
- Compliance reporting — exportable audit trails for regulators
- Budget allocation and spending analytics per agent/team

This is the B2B enterprise play. Higher ACV, longer sales cycles, but significant revenue per customer.

### Partnership Opportunities

#### Tier 1: Near-Term Integration Targets

| Partner | Integration | Value to Them | Value to Us |
|---------|-------------|---------------|-------------|
| **Sponge** | Verification via `beforeExecute` hook + yield on balances | Safety layer they don't have + revenue from idle funds | Distribution to their developer base |
| **Locus** | Verification before Checkout `pay()` + yield | Safety + yield revenue they can't offer | EVM distribution channel |
| **ElizaOS** | Plugin/recipe for verified transactions | Security capability their devs are asking for | 17K+ GitHub star ecosystem |
| **Solana Agent Kit** | MCP server + recipes | Financial safety tools for their agent builders | 100K+ download ecosystem |

#### Tier 2: Protocol & Ecosystem Partners

| Partner | Integration | Value |
|---------|-------------|-------|
| **Jupiter** | Verification for Jupiter swap transactions | Jupiter is the #1 Solana DEX; verification for Jupiter swaps is our Phase 1 product |
| **MPP ecosystem** | Verification as pre-payment safety layer + custom Agent CLI payment method + yield-bearing MPP treasury | Every MPP-enabled service = verification customer. Stripe + IETF backing = largest potential payment surface. MCP transport = direct integration with our MCP channel |
| **x402 Foundation** | Verification as middleware before x402 payments | Every x402 service = potential verification customer |
| **OpenZeppelin Defender refugees** | Migration path for 15K+ developers losing OZ Defender (shutdown July 2026) | Captive audience already seeking security tooling |
| **Coinbase AgentKit** | Agent Skill for verification | Access to Coinbase's agent developer ecosystem |

#### Tier 2.5: Commerce & Network Ecosystem Partners

| Partner | Integration | Value |
|---------|-------------|-------|
| **Visa AI-ready programs** | Verification as a complementary layer to Visa's tokenized agent credentials | Identity (Visa) + intent (Agent CLI) = full trust stack. Access to Visa's merchant/platform network. |
| **AP2 ecosystem** | AP2 mandate compatibility — translate AP2 signed mandates into verifiable intents | Bridge fiat commerce and on-chain finance. Be the cross-rail verification layer. |
| **Shopify agentic commerce** | Verification for agent-initiated Shopify checkouts | Shopify's merchant base = massive agent transaction surface. Verification as checkout safety layer. |
| **Perplexity Buy** | Verification before agent-initiated purchases | High-volume consumer agent commerce. Intent verification as quality/trust signal for Perplexity's users. |

#### Tier 3: Data & Intelligence Partners

| Partner | Integration | Value |
|---------|-------------|-------|
| **Hexagate / Forta** | Complementary threat data feeds | Their protocol-level + our intent-level = full stack security |
| **DeFi Llama** | Protocol risk data for our risk engine | Better risk models, credibility through association |
| **Pyth / Chainlink** | Price feeds for economic sanity checks | Accurate pricing for intent verification |

### Agent OS "Rack" — Service Provisioning

The concept of agent OS service provisioning (one-click setup for APIs, compute, scraping, etc.) with payments via Silk Accounts:

- Locus has executed this on EVM (Wrapped APIs)
- Sponge has a version via x402 Gateway
- The Solana + yield-bearing version remains open

If we build this, agents on Agent CLI can access a service catalog where every payment is:
1. Verified against intent ("did the agent really want to buy this service?")
2. Paid from yield-bearing balances (cost offset by earned yield)
3. Tracked and auditable (compliance record)

This transforms Agent CLI from "verification tool" to "the operating system agents use to access the internet economy."

---

## 11. Fundraise Positioning

### Investor Narrative Options

**Narrative A: "The Risk Intelligence Backbone of the Agent Economy"**
- We capture three layers of financial behavior data no one else has
- Intent data is the new risk data — it reveals preferences, risk tolerance, and reliability at the operator level
- The free verification tier is our data collection engine
- Every financial service for agents (risk pricing, insurance, counterparty due diligence, collateral optimization) requires this data
- We're building the data moat first, financial services second

**Narrative B: "The Safety Layer for Machine Money"**
- $31B in AI-agent DEX volume on Solana in 2025. Growing exponentially.
- No existing tool provides pre-signing intent verification — we fill that gap
- Free verification attracts volume → data → premium products
- The Freysa exploit ($47K drained via prompt injection) is the canonical example of why this matters
- We're the "seatbelt" — boring but essential, and required by regulation (EU AI Act)

**Narrative C: "The Neobank for the Agent Economy"**
- Agents need bank accounts, not wallets
- Silk Accounts: policy-controlled, yield-bearing, multi-operator accounts
- Every dollar earns yield by default (our existing infrastructure)
- Every transaction verified against intent (our new infrastructure)
- Same thesis as traditional neobanks (Revolut, Nubank) applied to a new customer type

**Narrative D: "Stablecoin Infrastructure at the Convergence"**
- Stablecoins are replacing cards for programmatic commerce (Visa stock drop, Stripe's stablecoin bet)
- Agents accelerate this shift — they route around interchange
- We provide the safety and yield layer on the dominant payment rail of the agent economy
- Two revenue streams: yield spread on stablecoin balances + verification/data products

**Narrative E: "GitHub Actions for Money — The Financial Execution Engine for Agents"**
- Agents don't make single transactions — they execute multi-step financial operations (swap then send, DCA with yield, cross-chain transfers, payroll)
- Agent CLI orchestrates these flows with per-step verification, yield on every waiting state, and goal-level tracking
- Flow templates are the distribution mechanism — shareable, parameterizable financial workflows (same pattern as CI/CD pipeline definitions)
- Flow data captures business process intelligence — categorically richer than transaction-level data
- No competitor has flow orchestration, and no competitor can build yield-bearing flows without both the yield stack and the orchestration engine
- The flow format could become the standard for expressing agent financial workflows (ACK = identity, x402 = payments, Agent CLI = workflows)

**Narrative F: "The Trust Infrastructure for the Agent Economy"**
- McKinsey (Oct 2025) sizes agentic commerce at $3-5T globally by 2030. Google launched AP2 (cryptographic intent mandates for agent payments, backed by Mastercard, PayPal, AmEx). Visa is piloting agent-initiated transactions with Anthropic, OpenAI, Perplexity.
- These players are all solving the same problem: **how do you trust an AI agent to act with your money?**
- We're the trust layer. Every transaction verified against human intent. Every action auditable. Every agent's behavior scored.
- Trust isn't a feature — it's the adoption bottleneck for the entire market. Without trust infrastructure, agentic commerce doesn't scale. We're building the infrastructure that unlocks the market.
- Not safety (transactional) — trust (foundational). The same way SSL certificates enabled e-commerce, intent verification enables agent commerce.
- We do it on-chain (where the other trust players — Visa, Google, Mastercard — don't operate). That's the gap: DeFi + crypto is the unserved trust market for agent finance.

**Narrative G: "The KYA Compliance Engine"**
- KYA (Know Your Agent) is the next KYC. EU AI Act mandates audit trails for autonomous financial decisions (August 2026). W3C developing verifiable agent credentials. Visa launching "AI-ready" tokenized credentials.
- Every company deploying agent fleets will need to answer: "What did your agent do, why, and was it authorized?"
- We generate this data as a byproduct of core verification. Every verification = a KYA record. Every flow = a compliance artifact.
- Compliance buyers pay for audit trails before they pay for better verification. The enterprise GTM leads with compliance, sells verification.
- "Chainalysis for agent intent" — Chainalysis built a $8.6B company on post-hoc blockchain analysis. We capture pre-execution intent data that Chainalysis can never see.

**Recommended:** Lead with Narrative A or B depending on the investor. Narrative A appeals to data/network-effect investors (a16z style) — position as "Bloomberg Terminal for agent risk" rather than "Experian for agents" (the credit bureau analogy breaks down because agents lack persistent identity with real-world enforcement). Narrative B appeals to infrastructure/picks-and-shovels investors. Narrative C is the most accessible but has the most competition (Catena, Natural). Narrative D ties both tracks together for investors who want to understand the full picture. **Narrative E is the technical differentiation story** — appeals to developer-focused investors and those who understand platform dynamics. "GitHub Actions for money" is a one-liner that communicates the vision instantly. **Narrative F is the market-moment story** — appeals to investors who follow McKinsey/Google/Visa moves and want to back the on-chain equivalent of what AP2 does for fiat. Strongest for generalist investors who need market validation from known names. **Narrative G is the compliance-wedge story** — appeals to investors who've seen Chainalysis-style outcomes from regulatory infrastructure. Strongest when EU AI Act enforcement timeline crystallizes.

### McKinsey Validation Points for Any Narrative

Regardless of which narrative leads, these McKinsey data points strengthen the pitch:

| Claim | McKinsey Source | How to Use |
|-------|---------------|------------|
| Market is real and massive | $900B-$1T US B2C by 2030; $3-5T global | TAM slide — we're not sizing a niche |
| Trust is the adoption bottleneck | Chapter 4: "Trust transcends mere consumer sentiment. It becomes foundational infrastructure" | Problem slide — trust is THE constraint |
| KYA is going mainstream | Exhibit 5: Five dimensions of trust, KYA as first dimension | Regulatory tailwind — compliance is coming |
| Standards landscape is fragmenting | MCP, A2A, AP2, ACP, ACK, x402 all mentioned | Positioning — we're protocol-agnostic verification, compatible with all |
| Systemic risk is an enterprise concern | "Snowball effect" — single faulty prompt triggers cascading failures | Enterprise pitch — we're the circuit breaker |
| Agents are already transacting at scale | 44% of users prefer AI-powered search; ChatGPT 800M weekly users; Perplexity Buy, Operator, Shopify agentic all live | Timing — not future speculation, happening now |
| "The agent will be the customer" | Naveen Sastry quote: "How do you build for a world where the buyer is a model acting in someone's best interest?" | Vision — reframe who the customer is |
| Ad revenue disruption creates monetization opportunity | Retail media networks face existential challenge; new models: interagent fees, negotiation fees, data sales | Revenue — agent economy creates new monetization, not just disintermediation |
| Speed matters — not a wait-and-see moment | Lareina Yee quote: "Companies that move first, even in small ways, will be the ones that help shape the future" | Urgency — validates our ~6 month competitive window thesis |

### Key Metrics to Watch

| Metric | What It Signals | Target |
|--------|----------------|--------|
| Daily verification requests | Product-market fit for verification | 100+ by month 3 |
| Unique agent wallets verified | Breadth of adoption | 50+ by month 3 |
| Free → paid conversion rate | Business model viability | >5% by month 6 |
| Average balance on Agent CLI | Trust + yield attractiveness | Growing MoM |
| Recipe adoption | Distribution strategy working | 5+ recipes with >10 users each |
| Flow composition requests | Users want multi-step operations (signal to expose flow primitive) | Track — any organic demand = strong signal |
| Yield earned during flows | "Make the wait productive" thesis working | Growing MoM |
| Failed intent ratio | Data moat value (higher = more negative signal data) | Track, don't optimize |
| Repeat verification rate | Stickiness | >50% weekly return |
| Operator risk queries (Phase 3) | Data product demand | Earliest: month 9 |

### Comparable Companies and Valuations

| Company | Raise | Valuation Signal | Relevance |
|---------|-------|-----------------|-----------|
| Catena Labs | $18M Seed | ~$80-100M post-money (a16z crypto terms) | Direct comp — agent banking |
| Natural | $9.8M Seed | ~$40-60M post-money (est.) | Direct comp — agent payments |
| Sapiom | $15.75M Seed | ~$60-80M post-money (est.) | Adjacent — service procurement |
| Chainalysis | $170M Series F ($8.6B val, 2022) | Massive outcome for on-chain intelligence | Aspirational comp — we're "Chainalysis for intents" |
| Bloomberg | $12B+ revenue | Risk data + terminal infrastructure for financial markets | Aspirational comp — "Bloomberg Terminal for agent risk" |

---

## 12. Key Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Superapp scope creep** | HIGH | Start narrow (swap verification + limit orders). Expand only on traction signals. Every feature must justify its data contribution. |
| **Competitors ship faster** | HIGH | Focus on uncontested territory (verification + yield). Don't compete on wallets or payments directly — compete on the intelligence layer. |
| **Market timing — agents too early** | MEDIUM | Trading bots are the existing market TODAY. Don't depend on "agents will eventually..." — serve what exists now. |
| **Front-running trust problem** | CRITICAL | We see transactions before they're signed. We MUST never use this to trade ahead. Transparency policy from day 1. Consider open-sourcing verification engine. Violation = death of product. |
| **Catena/ACK becomes the standard** | MEDIUM | Build ACK-compatible. The intent framework is protocol-agnostic — position as a verification layer that works WITH standards, not against them. |
| **Free tier doesn't convert to paid** | HIGH | Design free→paid funnel from day 1. The free tier must provide enough value to retain users AND collect data, while premium features (operator risk scoring, fleet dashboards, advanced risk models) justify upgrade. |
| **Liability exposure** | MEDIUM | Frame as advisory, not gatekeeper. "We provide risk signals, you decide." Clear ToS. No guarantees on verification accuracy. |
| **No-one cares about verification (VH1 negative)** | HIGH | This is the existential hypothesis. Test it fast with trading bot operators. If verification isn't a felt pain at current transaction sizes, the product needs to solve a different problem. |
| **Flow orchestration complexity** | MEDIUM | Start with the limit order as the first flow (internally decomposed). Don't expose generalized flows until there's signal. Build flow-aware architecture now, but ship the simplest version first. The risk is over-engineering before validation — same trap as superapp scope creep, applied to orchestration. |
| **Data privacy / regulatory** | MEDIUM | No PII — wallets and programs, not humans. Aggregate models, not individual surveillance. Clear consent in free tier. Comply with applicable data regs. |

---

## 13. Open Questions & Areas for Exploration

### Product & Market

- **Minimum viable superapp:** What's the smallest set of features that captures data + network effects? Is it just verification + limit orders? Or do we need payments + escrow for the viral loop?
- **Flow primitive timing:** When to expose generalized flows vs. keeping them internal? The limit order is the first flow. Watch for composition requests ("limit order, then send proceeds to X") as the signal. How much internal flow infrastructure should ship with the initial SDK vs. added later?
- **Flow definition format:** What's the right DSL/schema for expressing multi-step financial operations? JSON? YAML (CI/CD analogy)? How to balance expressiveness with simplicity? This could become a standard — design with that awareness.
- **Chain priority for full stack:** Solana (where our infrastructure lives) or Base (where Catena/Locus/Sponge operate and most agent activity happens)?
- **Pricing model evolution:** Free verification is the data engine. What's the right paid tier structure? Per-verification? Subscription? Usage-based? Flow templates could be a premium product (high-value domain expertise).
- **Agent vs. operator as buyer:** Are we selling to the agent developer (B2D) or the business deploying agents (B2B)? The GTM motions are different. Flow templates for enterprise use cases (payroll, treasury) suggest a B2B angle.

### Competitive & Strategic

- **ACK compatibility:** Should we proactively build ACK-compatible intent types? Or wait to see if ACK gains adoption?
- **Sponge partnership timing:** They're the most natural partner (live `beforeExecute` hook, no yield, no verification). When and how to approach?
- **OZ Defender migration:** 15,000+ developers migrating in July 2026. How do we position for this captive audience?
- **MoonPay / Coinbase competitive response:** Will wallet providers build their own verification? What's their incentive structure?

### Data & Moat

- **Volume requirements for data products:** How many daily verifications produce meaningful behavioral baselines — 1K? 10K? 100K? What does that imply about which distribution channel to prioritize?
- **Intent taxonomy completeness:** Are transfer, swap, stake, lend, borrow, approve, withdraw sufficient? What actions are missing that real agents need?
- **Cross-chain data unification:** If an operator's agent swaps on Solana and another lends on Base, how do we unify their risk profile? What's the operator identity layer?

### Regulatory & Compliance

- **EU AI Act specifics:** What exactly does the Act require for autonomous financial agents? Is our intent log sufficient, or are there specific format/retention requirements?
- **Jurisdiction strategy:** Where should we incorporate the entity that holds verification data? Which jurisdiction is most favorable for agent financial activity?
- **Banking license implications:** If we're a "neobank for agents," does that require a banking license? Can we partner with licensed entities (like Natural does with FDIC-insured banks)?

### Commerce & Protocol Interoperability

- **AP2 compatibility:** Google's Agent Payments Protocol uses cryptographically signed mandates linking intent → cart → payment. Our intent framework does something structurally similar for on-chain transactions. Should we explore AP2 mandate format compatibility? If agents start operating across both fiat (AP2) and crypto (on-chain) rails, the intent format that bridges both worlds wins. What would AP2-compatible intents look like?
- **Commerce intent taxonomy timing:** When should we formally extend the intent type system to support purchase, subscribe, negotiate, return? Before or after DeFi traction validates the framework? Premature extension risks diluting focus; late extension risks hard-coding DeFi assumptions.
- **Visa/Mastercard partnership potential:** Visa's AI-ready cards use tokenized digital credentials to verify agent authorization. Our verification SDK verifies transaction intent. These are complementary — identity verification (Visa) + intent verification (Agent CLI). Is there a partnership angle, or is this too early-stage for network-level conversations?
- **Brokered agent positioning:** If we build the flow engine as a broker runtime (not just sequential orchestration), does that change our competitive positioning? Are there specific broker scenarios (travel, procurement, multi-vendor comparison) where we should prototype flows?
- **Trust infrastructure branding:** Should we formally rebrand from "safety layer" to "trust infrastructure"? How does this affect positioning with DeFi-native trading bot operators (who want speed and safety) vs. enterprise fleet managers (who want trust and compliance)?

### Expansion Territories

- **Agent-to-agent lending markets:** If we have operator risk scoring, can we enable collateral-optimized lending between agents? The credit risk sits with operators, not agents — what's the enforcement and regulatory implication?
- **Intent-based derivatives:** Can intents be used to create synthetic financial products? "100 agents want to buy SOL in the next hour" → that's a trading signal.
- **Cross-platform intent arbitrage:** If the same intent executes differently on two platforms, we can route to the better execution — becoming the "smart order router for agents."
- **Cross-agent flow composition:** Flows that span multiple agents — Agent A's output feeds Agent B's input ("trading agent sells SOL → treasury agent deposits proceeds to yield → payroll agent distributes"). Agent CLI becomes the coordination layer between agents.
- **Flow template marketplace:** Two-sided marketplace where domain experts publish flow templates and operators instantiate them. Revenue from template fees + usage data.
- **In-flight flow state as collateral:** A partially complete flow has economic value (e.g., $10K in intermediate USDC state between swap and next step). Could intermediate states serve as collateral for flash operations?
- **Financial API gateway positioning:** If Agent CLI orchestrates flows across protocols, DEXes, bridges, and payment rails, it becomes the API gateway for agent financial operations — routing, verification, yield optimization, logging in one layer.
- **KYA compliance product:** Package verification history into KYA Reports — behavioral profiles per agent/operator with risk scores, intent-match rates, policy compliance records. Sellable to enterprises deploying agent fleets, insurance underwriters, B2B counterparties, and regulators.
- **Commerce verification expansion:** Extend the intent framework to verify non-DeFi agent actions: purchases, subscriptions, negotiations, returns. The same framework that verifies "does this swap match intent?" can verify "did this purchase match what the agent was told to buy?" TAM expansion from DeFi ($31B+ agent DEX volume) to agentic commerce ($3-5T by 2030).
- **AP2 bridge — fiat-to-crypto intent unification:** Build a translation layer between AP2 mandates (fiat commerce intent format) and our on-chain intent format. Agents operating across both rails use a single intent framework. This is the "universal intent layer" play — and it's unoccupied territory.
- **Brokered agent flows as a service:** Position the flow engine as infrastructure for broker agents coordinating multi-party transactions. Revenue from coordination fees, yield on intermediate states during multi-party settlement, and premium flow templates for high-value brokered scenarios (travel, enterprise procurement, multi-vendor comparison shopping).
- **"Agent Experience" (AX) consulting/tooling:** McKinsey argues that designing the "agent experience" is becoming as important as UX. Companies need their products discoverable and transactable by agents, not just humans. Agent CLI could offer AX readiness assessments — "is your protocol/API agent-ready?" — using our verification framework to test whether agents can reliably transact with a given platform. This is a services play, not infrastructure, but could generate leads for core product.
- **Federated fraud intelligence for agent commerce:** McKinsey's ecosystem map includes "fraud prevention providers" as a key enabler. Our verification data (especially failed intents and anomalous patterns) feeds directly into agent-specific fraud detection. At scale, aggregate verification data across multiple platforms creates a federated fraud intelligence network — similar to how card networks share fraud signals. Revenue from API subscription to fraud intelligence feeds.

---

## 14. Immediate Priorities

### What to Build (Simon + Dev)

| Priority | Task | Why |
|----------|------|-----|
| **P0** | Ship Jupiter swap verification as REST API | First product people can use. Tests VH1 (is verification a felt pain?) |
| **P0** | Limit order with yield-while-waiting — **build as the first flow** (internally decomposed into verifiable steps: deposit → yield → monitor → withdraw → verify → execute) | Convergence product. Tests VH4. Lays architectural foundation for generalized flows without exposing flow primitive to users yet |
| **P1** | MCP server wrapping verification + limit orders | Highest-leverage distribution. Competitive urgency (Sponge/Sapiom already have MCP). |
| **P1** | 3-5 recipes (swap, limit order, DCA, send payment, escrow) | Distribution mechanism. Each recipe is a data collection point. |
| **P2** | EVM chain adapter for intent framework | Multichain is table stakes. Base is where most agent activity happens. |
| **P2** | Operator dashboard (verification history, risk alerts) | Enterprise readiness. Needed for B2B conversations. |

### What Alek Can Work On

| Priority | Activity | Goal |
|----------|----------|------|
| **Now** | Map trading bot ecosystem on Solana | Identify 15-20 target bots/operators for Phase 1 outreach. Where do they congregate? What do they use? |
| **Now** | Identify Sponge partnership path | They're the best near-term partner. Their `beforeExecute` hook + our verification = mutual value. Find the right contact. |
| **Now** | Draft fundraise narrative options | Use Section 11 as starting point. Which narrative resonates with which investor profiles? |
| **Soon** | Map ElizaOS and Solana Agent Kit plugin process | How do third-party plugins get adopted? Who are the maintainers? How receptive to external contributions? |
| **Soon** | OZ Defender migration opportunity | 15K+ developers losing their security tooling in July 2026. Where's the migration conversation happening? Can we position early? |
| **Soon** | x402 Foundation community engagement | Join x402 developer channels. Understand Bazaar discovery layer. Position verification as the safety layer on x402. |
| **Later** | Enterprise outreach for agent fleet management | Identify 5-10 companies deploying agent teams with financial authority. What do they need? |
| **Later** | Investor list for seed round | Map investors who've backed agent infra (a16z, Accel, Abstract, Human Capital, Coinbase Ventures). Who's still deploying in this category? |

### Signals to Watch

| Signal | What It Means | Response |
|--------|--------------|----------|
| Trading bot operators adopt free verification | VH1 confirmed — verification is a real pain | Accelerate Phase 1, invest in more recipes |
| Users request flow composition ("limit order then send to X") | Demand for multi-step operations exists | Expose flow primitive, build flow template format |
| Agents hold balances on Agent CLI | Trust established, yield is attracting capital | Activate full Silk Account features |
| Sponge adds yield to wallets | Key differentiation gap closing | Accelerate partnership conversation OR compete harder |
| Catena ships pre-signing verification | Our uncontested territory invaded | Accelerate, differentiate on data/intent depth |
| ACK exceeds 5K npm downloads/month | Standards convergence happening | Build ACK-compatible intent types |
| MCP server gets organic discovery | Distribution flywheel working | Double down on MCP ecosystem |
| EU AI Act compliance guidance published | Regulatory demand crystallizing | Position compliance-grade audit trails prominently. Lead enterprise GTM with KYA compliance narrative. |
| OZ Defender shutdown approaches (July 2026) | 15K developers seeking new tooling | Targeted content + outreach campaign |
| AP2 adoption accelerates (merchant integrations, agent platforms adopt) | Fiat commerce intent verification becoming standard | Explore AP2 mandate compatibility for cross-rail intent unification |
| Visa/Mastercard launch agent transaction products | Card networks moving into agent payments at scale | Position verification as complementary (identity = Visa, intent = Agent CLI). Explore partnership. |
| Enterprise buyer asks "do you support KYA?" | KYA becoming a procurement checkbox | Package verification data as KYA compliance reports. Lead with compliance, sell verification. |
| Agent-to-agent commerce volume appears (any platform) | Brokered agent model materializing | Prototype brokered flow templates. Position flow engine as coordination infrastructure. |

---

## Appendix A: Key Reference Documents

| Document | Location | What It Contains |
|----------|----------|-----------------|
| Agentic Economy Gameplan | `__PROJECTS/agentic-economy/gameplan.md` | Full strategy, hypotheses (VH1-VH5, BH1-BH3), experimentation roadmap (E1-E10), evolution log |
| Transaction Verification SDK | `__PROJECTS/agent-cli/transaction-verification-sdk.md` | Product specification, six control planes, API design, technical approach, data strategy |
| Silk Account Primitive | `__PROJECTS/agent-cli/silk-account-primitive.md` | Account architecture, landscape analysis, naming analysis |
| Landscape Tracker | `__PROJECTS/agentic-economy/landscape-tracker.md` | Competitor profiles (Catena, Natural, Sponge, Locus, Sapiom, Skyfire, T54) with tripwires |
| Research Brief | `active/agent-infrastructure-targeting-research-brief.md` | Framework integration pathways, trading bot ecosystem, MCP discovery, x402, security communities |
| a16z Cards Analysis | `__PROJECTS/agentic-economy/a16z-agentic-commerce-cards-analysis.md` | Vibe coder micro-merchant thesis, verification data as underwriting intelligence |
| Citrini 2028 Analysis | `__PROJECTS/agentic-economy/citrini-2028-gic-analysis.md` | Interchange disruption scenario, convergence thesis validation |
| Strategy Landscape | `__PROJECTS/agentic-economy/strategy-landscape.md` | Broader competitive landscape and positioning options |
| Multi-Step Orchestration Exploration | `__PROJECTS/agentic-economy/exploration-multi-step-orchestration-2026-03-18.md` | Full analysis: flow primitive, second-order effects, use cases, competitive implications, CI/CD analogy, standards opportunity, yield-bearing flows thesis |
| McKinsey Agentic Commerce Report | `the-agentic-commerce-opportunity-how-ai-agents-are-ushering-in-a-new-era-for-consumers-and-merchants_final.pdf` | October 2025 report: $3-5T market sizing, AP2/ACP/MCP protocols, five trust dimensions, KYA, systemic risk, business model disruption, ecosystem map |
| Agent Payments Stack | [agentpaymentsstack.com](https://agentpaymentsstack.com/) | Live market map of 162 projects across 6 layers (Settlement → Wallet/Key Mgmt → Routing/Abstraction → Payment Protocol → Governance/Policy → Application). Tracks vertical integration (Coinbase, Stripe, Circle, Google, MoonPay), M&A consolidation, and protocol adoption metrics (x402 75M txns/30d, 98.6% USDC settlement). By @jordanlyall. Updated Mar 2026. Has machine-readable data (data.json, llms.txt, API/MCP server). |

## Appendix B: Glossary

| Term | Definition |
|------|-----------|
| **Intent** | A structured expression of what an agent wants a transaction to accomplish. Chain-agnostic, action-typed. |
| **Verification** | The process of checking whether a transaction matches a stated intent, assessing risk across six control planes. |
| **Silk Account** | A role-based, policy-controlled on-chain account on Solana. Not a multisig — operators act independently. |
| **Handshake** | On-chain escrow protocol on Solana for agent-to-agent and agent-to-human transactions. |
| **Recipe** | A pre-built prompt/skill that gives any agent instant financial capabilities via Agent CLI. |
| **Control Plane** | One of six independent verification dimensions: agent policy, intent, counterparty, protocol risk, economic sanity, temporal context. |
| **Confidence** | Verification certainty level: `full` (all fields verified), `partial` (some unverifiable), `unverified` (unknown action type). |
| **Flow** | An ordered sequence of dependent intents that accomplishes a composite goal. The general case of financial operations — from simple (swap and send) to complex (multi-currency payroll). Each step is verifiable, and every waiting state between steps can earn yield. |
| **Flow Template** | A reusable, parameterizable flow definition. Recipes v2 — encodes domain expertise (e.g., a payroll template, a cross-chain bridge flow, a smart DCA strategy). Shareable via GitHub/NPM/MCP. |
| **Yield-Bearing Flow** | A flow where idle capital in intermediate states automatically earns yield between steps. Only possible with both an orchestration engine and yield infrastructure — Agent CLI's unique intersection. |
| **Failed Intent** | An intent formed by an agent but not executed — captures demand invisible on-chain. |
| **Failed Flow** | A multi-step operation that broke at a specific step — captures infrastructure quality signals, systemic bottlenecks, and recovery patterns invisible on-chain. |
| **The Rack** | Service provisioning model where agents access external APIs through a single platform with integrated payments. |
| **MCP** | Model Context Protocol — Anthropic's standard for agent-to-tool interfaces. Critical distribution channel. |
| **ACK** | Agent Commerce Kit — Catena Labs' open protocol for agent identity and payments. Potential standard. |
| **MPP** | Machine Payments Protocol — Tempo + Stripe's open standard for machine-to-machine payments via HTTP 402. IETF standards track. Payment-method agnostic (stablecoins, cards, Lightning, Solana, custom). Supports sessions for micro-payments (sub-100ms, $0.0001). Has native MCP transport. Likely to absorb x402. SDKs in TypeScript, Python, Rust. Key integration target for verification SDK. |
| **x402** | Coinbase's HTTP-native stablecoin payment protocol. Key infrastructure layer for agent micropayments. Being superseded by MPP (which is x402-compatible but broader — multi-rail, IETF track, Stripe-backed). |
| **AP2** | Agent Payments Protocol — Google's open, payment-agnostic protocol for verifiable agent purchases. Uses cryptographically signed mandates linking intent, cart, and payment. Backed by Mastercard, PayPal, AmEx, Adobe, Alibaba. The closest fiat-world analogue to our intent framework. |
| **ACP** | Agentic Commerce Protocol — Stripe + OpenAI's protocol for AI platforms and businesses to transact. Enables in-chat purchases. |
| **KYA** | Know Your Agent — emerging compliance requirement (parallel to KYC) for verifying agent identity, behavior, and authorization. Encompasses agent "passports," behavioral profiles, multi-factor auth for sensitive actions, and auditable transaction logs. Our verification data is a KYA record by design. |
| **A2A** | Agent-to-Agent Protocol — Google's communication protocol for agents to coordinate, negotiate, and transact directly. Supports long-running tasks, dynamic capability discovery, multimodal collaboration. |
| **Commerce Intent** | Extension of the intent taxonomy beyond DeFi actions (swap, lend, stake) to general commerce actions (purchase, subscribe, negotiate, return, compare, bundle). Not yet implemented — future expansion planned with architecture designed to accommodate. |
| **Brokered Flow** | A flow orchestrated by an intermediary broker agent coordinating across multiple vendors/agents. Extends simple sequential flows into multi-party coordination patterns with fan-out, parallel sub-flows, and multi-party settlement. |
| **Trust Infrastructure** | The foundational systems enabling agents to operate with money at scale — encompassing intent verification, KYA compliance, audit trails, behavioral scoring, and policy enforcement. Distinguished from "safety" (transactional, one-time) by being foundational and ongoing. |

---

*Last updated: 2026-03-20*
*Status: Living document — update as strategy evolves, experiments produce results, and competitive landscape shifts.*

**Changelog:**
- **2026-03-20:** Major update — incorporated McKinsey "Agentic Commerce Opportunity" report (Oct 2025) insights throughout. Added: "The Market Is Bigger Than DeFi" subsection (Section 2) with $3-5T global sizing and commerce intent expansion thesis. Added "The Trust Thesis" subsection (Section 2) reframing safety → trust infrastructure with five-dimension analysis. Expanded standards risk (Section 9) with AP2 (Google), Visa AI-ready infrastructure, Mastercard Agent Pay, KYAPay, and three-layer standards landscape analysis. Added broader ecosystem players (Section 9) — OpenAI, Perplexity, Shopify, Amazon, Visa, Mastercard. Added Tier 2.5 commerce partners (Section 10). Added five new strategic angles (Section 10): Commerce Intent Expansion, Brokered Agent Model, Systemic Risk Mitigation, KYA Compliance as Byproduct, Interagent Protocol Fees. Added Narratives F (Trust Infrastructure) and G (KYA Compliance Engine) to fundraise positioning (Section 11) with McKinsey validation points table. Added Commerce & Protocol Interoperability questions (Section 13). Added seven new expansion territories including KYA product, commerce verification, AP2 bridge, brokered agent flows, AX tooling, federated fraud intelligence. Added six new signals to watch. Source: McKinsey QuantumBlack report, cross-referenced with existing strategy.
- **2026-03-19:** Major update — incorporated multi-step flow orchestration thesis throughout. Added flow primitive to Section 3, updated building sequence (Section 4), added Recipes v2/flow templates, expanded data moat (Section 6) with flow data, added temporal lock-in (Section 7), added flow orchestration strategic angle (Section 10), added Narrative E for fundraise (Section 11), added flow complexity risk (Section 12), expanded open questions and expansion territories (Section 13), updated priorities to reflect flow-aware building (Section 14). Source: `[[exploration-multi-step-orchestration-2026-03-18]]`.
- **2026-03-13:** Initial comprehensive strategy reference.
