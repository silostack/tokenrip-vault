---
tags: [competitive, #theme/agentic, strategy, research]
date: 2026-03-19
status: complete
related:
  - "[[agentic-strategy-reference]]"
  - "[[landscape-tracker]]"
  - "[[transaction-verification-sdk]]"
---

# Verifiable Intent — Competitive Analysis

> **TL;DR:** Mastercard (with Google) launched an open spec called "Verifiable Intent" (VI) — a cryptographic delegation chain that proves an AI agent was authorized by a human to make a purchase, and that it stayed within scope. It uses the word "intent" but solves a **fundamentally different problem** than Agent CLI's Intent Framework. VI answers "who authorized this agent?" Agent CLI answers "does this transaction match what the agent wanted to do?" They're complementary, not competitive — but the naming collision is a standards risk.

---

## 1. What It Is

**Verifiable Intent (VI)** is an open specification (Apache 2.0, [verifiableintent.dev](https://verifiableintent.dev/)) co-developed by Mastercard and Google. It creates a cryptographic delegation chain binding an AI agent's commercial actions to a human's explicitly stated purchase authorization.

**Version:** Draft v0.1 (dated 2026-02-18)
**GitHub:** [agent-intent/verifiable-intent](https://github.com/agent-intent/verifiable-intent) — 39 stars, 6 forks
**Launch:** Announced March 5, 2026 via Mastercard CDO Pablo Fourez

**Partners at launch:** Adyen, Basis Theory, Checkout.com, Fiserv, Getnet, IBM, Worldpay (now Global Payments). Google's Stavan Parikh (VP/GM Payments) publicly endorsed it.

**Integration path:** Will be integrated into Mastercard Agent Pay's intent APIs. Compatible with Google's Agent Payments Protocol (AP2) and Universal Commerce Protocol (UCP). Designed to be protocol-agnostic.

---

## 2. How It Works

### The Layered Credential Architecture

VI uses a three-layer SD-JWT (Selective Disclosure JWT) credential system:

```
┌──────────────────────────────────────────────┐
│  LAYER 1 — Credential Provider SD-JWT         │
│  Mastercard/Bank → User                       │
│  "This user has this card, this identity"     │
│  Binds user's public key via cnf.jwk          │
│  Lifetime: ~1 year                            │
└──────────────────┬───────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────┐
│  LAYER 2 — User KB-SD-JWT                     │
│  User → Agent (or direct to merchant)         │
│                                               │
│  IMMEDIATE MODE        │  AUTONOMOUS MODE     │
│  ──────────────        │  ───────────────     │
│  Final checkout values  │  Constraints:        │
│  "Buy this exact item"  │  - Merchant allowlist│
│  No delegation          │  - Budget cap ($300) │
│                         │  - Item restrictions │
│                         │  - Binds agent's key │
│  Lifetime: ~15 min      │  Lifetime: 24h-30d  │
└──────────────────┬──────┴────────────────────┘
                   │ (Autonomous only)
                   ▼
┌──────────────────────────────────────────────┐
│  LAYER 3 — Agent KB-SD-JWTs (split)           │
│  L3a (payment → network)                      │
│  L3b (checkout → merchant)                    │
│  "I selected this item at this price"         │
│  Lifetime: ~5 minutes                         │
└──────────────────────────────────────────────┘
```

### Two Execution Modes

**Immediate Mode (2-layer):** User reviews cart, confirms purchase, signs L2 with final values. The agent is just transport — no delegation occurs. Equivalent to "click buy" with an agent forwarding the credentials.

**Autonomous Mode (3-layer):** User sets constraints ("buy me a tennis racket from these merchants, under $300"). Agent shops, selects, creates checkout, signs L3 proving it acted within constraints. Merchant and payment network each see only the claims relevant to their role via selective disclosure.

### Eight Constraint Types

VI defines eight registered constraint types:

| Constraint | Purpose |
|-----------|---------|
| `mandate.checkout.allowed_merchant` | Merchant allowlist |
| `mandate.checkout.line_items` | Product selection constraints (SKUs, quantities) |
| `payment.allowed_payee` | Payee authorization |
| `payment.amount` | Per-transaction amount range (min/max in integer minor units) |
| `payment.budget` | Cumulative spending cap across multiple transactions |
| `payment.recurrence` | Merchant-managed subscriptions (Netflix model) |
| `payment.agent_recurrence` | Agent-managed recurring purchases (ON_DEMAND, WEEKLY, etc.) |
| `payment.reference` | Checkout-payment cross-reference binding |

Extensible via URI-namespaced custom types.

### Privacy Model

Uses SD-JWT selective disclosure — data is private by default:
- **Merchant sees:** What's being bought (checkout mandate). NOT how it's being paid.
- **Payment network sees:** Payment details (amount, payee, instrument). NOT specific items.
- **Dispute resolution:** Full chain disclosed only when needed.

### Technology Foundations

Built on widely adopted standards:
- **SD-JWT** (RFC 9901) — Selective disclosure
- **JWS** (RFC 7515) — Digital signatures
- **RFC 7800** — Proof-of-possession key binding
- **ES256** (ECDSA P-256 + SHA-256) — Required signing algorithm
- **FIDO Alliance, EMVCo, W3C, IETF** standards alignment

---

## 3. Comparison with Agent CLI Intent Framework

### The Naming Collision

Both use "intent" but mean fundamentally different things:

| | **Verifiable Intent (Mastercard/Google)** | **Agent CLI Intent Framework** |
|---|---|---|
| **"Intent" means** | Authorization delegation — who approved what scope | Transaction specification — what the agent wants the tx to accomplish |
| **Question it answers** | "Is this agent authorized by the cardholder to buy this?" | "Does this swap actually swap USDC for SOL at the stated price with acceptable slippage?" |
| **Domain** | Fiat commerce (cards, checkout, merchant purchases) | DeFi/crypto (swaps, staking, lending, on-chain actions) |
| **What it verifies against** | Constraints set by user at delegation time (merchant list, budget) | Raw transaction calldata on-chain (program instructions, amounts, addresses) |
| **Where it sits** | Between consumer → agent → merchant → payment network | Between agent → transaction → blockchain |
| **Pre-execution?** | Yes — pre-authorization before payment is processed | Yes — pre-signing before transaction is submitted |
| **Credential format** | SD-JWT with cryptographic delegation chain (L1 → L2 → L3) | Structured intent types (transfer, swap, stake, lend, etc.) with chain adapters |
| **Data captured** | Authorization chain (who delegated what scope to whom) | Intent-to-execution behavior (what was intended vs. what happened vs. what the agent decided) |
| **Enforcement** | Payment network enforces constraints (Mastercard as arbiter) | Agent/SDK enforces pre-signing (abort before signing if mismatch) |
| **Privacy model** | Selective disclosure via SD-JWT | Not applicable — on-chain transactions are public |
| **Standards basis** | FIDO2, EMVCo, IETF, W3C | Chain-specific (Solana instruction set, EVM ABI) |
| **Multi-step support** | Single mandate pair = single transaction (multi-tx via agent_recurrence) | Flow orchestration — DAGs of dependent intents with yield between steps |
| **Yield** | None | Yes — every waiting state earns |

### The Critical Insight: They're Complementary

**Verifiable Intent operates at the authorization layer.** It answers: "Did the human approve this agent to spend up to $300 at Tennis Warehouse?" It creates a tamper-proof record of the delegation chain. It works within the existing card payment infrastructure.

**Agent CLI's Intent Framework operates at the execution verification layer.** It answers: "Does this Solana transaction actually swap 100 USDC for SOL at the right price via Jupiter with <1% slippage?" It inspects raw transaction bytecode before the agent signs.

A complete agentic financial system needs BOTH:
1. **Authorization** — "Is this agent allowed to do this?" (VI handles this for fiat)
2. **Execution verification** — "Does this transaction actually do what the agent says it does?" (Agent CLI handles this for crypto)

VI has zero capability in execution verification. It trusts that the merchant's checkout JWT accurately represents what's being purchased. It doesn't inspect transaction calldata. It doesn't simulate transactions. It doesn't assess protocol risk, slippage, MEV exposure, or smart contract safety.

Agent CLI has zero capability in fiat authorization delegation. It doesn't create cryptographic delegation chains for card payments. It doesn't interface with Mastercard's payment network. It doesn't handle merchant-signed checkout JWTs.

### Where They Could Converge

If agents transact across both fiat and crypto:
- An agent buying a SaaS subscription (fiat) → VI handles authorization
- The same agent swapping USDC for SOL (crypto) → Agent CLI handles verification

The flow orchestration primitive could span both domains: "Subscribe to service X (VI-authorized card payment) → Route monthly fee through yield (Agent CLI) → Pay from yield-bearing balance (Agent CLI execution verification)."

---

## 4. Strategic Implications

### Threat Assessment

| Dimension | Threat Level | Analysis |
|-----------|-------------|----------|
| **Direct product competition** | **LOW** | Completely different domain (fiat commerce vs. DeFi). No technical overlap. |
| **Naming/positioning confusion** | **HIGH** | Both use "intent." If VI becomes THE definition of "intent verification" in agentic commerce, Agent CLI's positioning gets muddied. |
| **Standards pre-emption** | **MEDIUM-HIGH** | Mastercard + Google + Adyen + Fiserv + IBM defining "intent" for commerce. If "Verifiable Intent" becomes an industry standard term, Agent CLI needs to differentiate clearly. |
| **Investor narrative** | **MEDIUM** | Investors might ask: "How are you different from Verifiable Intent?" Need crisp answer ready. |
| **Mind share** | **MEDIUM** | Mastercard's announcement gets mainstream press. "Intent verification" as a concept now has a big-brand association. |
| **Future expansion into DeFi** | **LOW (now)** | VI is pure fiat/card. No DeFi capability. But the framework is extensible — custom constraint types via URIs. Crypto-native constraints could theoretically be added. |

### What VI Validates About Agent CLI

1. **The "intent" concept is real.** Mastercard and Google are investing in intent verification for agent commerce. This validates the core thesis that agents need verifiable intent before executing financial actions.

2. **The compliance angle is confirmed.** VI is explicitly positioned as creating "audit trails for dispute resolution" and compliance artifacts. Agent CLI's EU AI Act compliance story is strengthened by a precedent from a major payment network.

3. **The constraint model is similar.** VI's 8 constraint types (amount range, merchant allowlist, budget cap, payee authorization) are structurally similar to Agent CLI's six control planes. The concept of bounded delegation is universal.

4. **The "intent data" thesis is validated.** VI captures authorization data that doesn't exist on-chain. Agent CLI captures execution data that doesn't exist on-chain. Both recognize that the invisible layers are where the value is.

### What VI Warns About

1. **Standards risk.** Mastercard + Google can define terms. If "Verifiable Intent" becomes the standard, Agent CLI needs to position clearly as a DIFFERENT kind of intent verification. "Authorization intent" (VI) vs. "execution intent" (Agent CLI).

2. **The fiat world is moving fast.** VI has Adyen, Fiserv, Checkout.com, IBM at launch. The merchant/payment network ecosystem is mobilizing. If agents primarily transact in fiat (not crypto), VI captures the market and Agent CLI's crypto-first approach becomes niche.

3. **Naming matters.** Both products verify "intent." Both provide pre-execution verification. The surface-level description sounds identical. The deep mechanics are completely different, but in a pitch or sales call, the distinction needs to be crystal clear.

### Positioning Response

**When asked "How is this different from Verifiable Intent?":**

> "Verifiable Intent answers 'who authorized this agent?' — it creates a delegation chain from cardholder to agent for fiat purchases. We answer 'does this transaction actually do what it says?' — we inspect raw blockchain transaction bytecode before an agent signs, checking for slippage, MEV attacks, protocol risk, and intent-transaction mismatch. They're complementary: VI handles authorization for card payments, we handle execution verification for DeFi. No one else does pre-signing transaction verification on-chain."

**The key differentiator to emphasize:**

- VI trusts the merchant's checkout JWT. It doesn't inspect what the transaction actually does. It verifies the delegation chain and constraints.
- Agent CLI doesn't trust anything. It deserializes the raw transaction, decodes program instructions, and verifies that the actual execution matches the stated intent. It catches things VI can't: MEV sandwich attacks, slippage manipulation, protocol exploits, calldata mismatches.

---

## 5. Partnership Angle

**Low probability but worth noting:** VI is extensible via custom constraint types (URIs). A `urn:agent-cli:execution-verification` constraint type could theoretically be added to a VI credential, meaning: "Before executing this payment, also verify the on-chain execution via Agent CLI's verification engine." This would be a deep integration where VI handles authorization and Agent CLI handles execution verification within the same credential chain.

This is far-future and requires VI adoption + Agent CLI having enough market presence to be worth integrating. But the architectural openness is there.

---

## 6. Immediate Actions

1. **Update fundraise narrative.** Section 11 of agentic-strategy-reference needs a "How we differ from Verifiable Intent" FAQ. Investors WILL ask.

2. **Clarify naming.** Consider whether "Intent Framework" needs disambiguation. Options:
   - "Execution Intent Framework" (vs. "Authorization Intent")
   - "Transaction Verification Framework" (avoids "intent" altogether)
   - "Intent-to-Execution Verification" (emphasizes the unique layer)
   - Keep "Intent Framework" but always pair it with "pre-signing transaction verification"

3. **Monitor adoption.** Track VI's integration timeline with Mastercard Agent Pay APIs. Track GitHub activity (currently 39 stars — low, but backed by Mastercard).

4. **Watch for DeFi extension.** If VI adds crypto-native constraint types (e.g., `payment.defi_protocol`, `payment.slippage_tolerance`), the boundary between fiat and crypto intent verification narrows.

---

## 7. Technical Deep Dive: Key Differences

### What VI Does That Agent CLI Doesn't

- **Cryptographic delegation chain** — L1 → L2 → L3 key binding via `cnf` claims
- **Selective disclosure** — SD-JWT privacy model where each party sees only relevant claims
- **Card payment integration** — Works within Mastercard's payment network for authorization
- **Merchant checkout binding** — `checkout_hash` / `transaction_id` mechanism binding purchase and payment
- **Subscription management** — `payment.recurrence` and `payment.agent_recurrence` constraint types
- **Network-enforced constraints** — Payment network maintains stateful tracking of cumulative spend per mandate

### What Agent CLI Does That VI Doesn't

- **Transaction bytecode inspection** — Deserializes raw Solana/EVM transactions and decodes program-specific instructions
- **Protocol risk assessment** — Evaluates protocol safety (TVL stability, recent exploits, contract risk)
- **Economic sanity checking** — Slippage verification, price vs. market, fee assessment
- **MEV/sandwich attack detection** — Identifies frontrunning risks before signing
- **Failed intent capture** — Logs aborted intents as invisible demand signals
- **Yield integration** — Every waiting state between flow steps earns yield
- **Flow orchestration** — Multi-step financial operations with per-step verification
- **Behavioral data collection** — Intent → verification → decision patterns feed risk models
- **Counterparty verification** — On-chain program/address trustworthiness assessment
- **Temporal context** — "Has anything changed since this intent was formed?"

### The Simplest Way to Understand the Difference

**VI:** "The user said the agent can spend up to $300 at Tennis Warehouse. The agent is presenting a purchase for $279.99 at Tennis Warehouse. The delegation chain checks out." ✓

**Agent CLI:** "The agent wants to swap 100 USDC for SOL via Jupiter. The transaction actually calls Jupiter's swap instruction with the right token mints, the output amount is within 1% slippage of market price, the program hasn't been exploited in the last 30 days, and no sandwich attack pattern is detected in the mempool." ✓

One verifies authorization. The other verifies execution. Both are necessary. Neither can do the other's job.

---

*Sources: [verifiableintent.dev](https://verifiableintent.dev/), [Mastercard announcement](https://www.mastercard.com/us/en/news-and-trends/stories/2026/verifiable-intent.html), [The Defiant](https://thedefiant.io/news/defi/mastercard-and-google-team-up-to-build-trust-for-ai-powered-shopping), [GitHub spec](https://github.com/agent-intent/verifiable-intent)*
