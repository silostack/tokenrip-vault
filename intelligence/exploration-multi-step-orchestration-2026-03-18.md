# Multi-Step Orchestration: The Layer Nobody Is Building

> **Context:** This emerged from the Simon/Alek sync on Mar 18. Simon's riff: "Not just a single transaction but flows — orchestration — where you create a multi-step action. An action might incorporate a number of different transactions to accomplish a specific goal." This exploration expands on that thread.
>
> **Status:** Pure exploration. Not an action item. Surface area expansion.
>
> **Related:** [[agentic-strategy-reference]] (Section 3: Intent Framework, Section 4: Product Vision), [[transaction-verification-sdk]] (Open Question #6), [[agent-cli-manifesto]] (Programmable Financial Workflows)

---

## The Gap in the Current Framing

The strategy reference and SDK doc define the intent framework as **intent → transaction → verify**. One intent, one transaction (or one compound transaction), one verification result. The entire architecture assumes the atomic unit is a single transaction.

But that's not how real financial operations work.

"Swap 1 SOL into USDC and send half to Greg" is not one transaction. It's a **sequence**: swap → calculate output → transfer partial amount. Each step depends on the output of the previous one. The second transaction can't be constructed until the first one settles and you know the actual USDC received.

The current framework handles this scenario in one of two ways:
1. **Compound intent** — if both actions happen within a single atomic transaction (possible on Solana with instruction composition)
2. **Two separate verifications** — the agent calls verify twice, independently

Neither captures what's actually happening: a **goal** that decomposes into an ordered sequence of dependent financial actions.

This is the gap. And it's a much bigger gap than it looks.

---

## What Multi-Step Orchestration Actually Is

### The Hierarchy

```
GOAL (natural language)
  "Swap my SOL to USDC and send half to Greg"
    │
    ├── FLOW (structured plan)
    │   Step 1: Swap SOL → USDC (amount: all, slippage: 1%)
    │   Step 2: Calculate 50% of swap output
    │   Step 3: Transfer USDC to Greg (amount: step2.result)
    │
    ├── VERIFICATION (per-step AND whole-flow)
    │   ✓ Step 1: Does this swap match intent?
    │   ✓ Step 2: Is the math right?
    │   ✓ Step 3: Does the transfer match the calculated amount?
    │   ✓ FLOW: Did the sequence achieve the stated goal?
    │
    └── YIELD (on every waiting state)
        Between step 1 and step 3: funds are earning
```

The current intent framework operates at the STEP level. The new primitive is the FLOW — a directed graph of steps with dependencies, where each step is a verifiable intent, but the flow itself is also a verifiable object.

### How It Differs from Compound Intents

| | Compound Intent | Flow |
|---|---|---|
| **Atomicity** | Single transaction, all-or-nothing | Multiple transactions over time |
| **Dependencies** | None — all actions execute simultaneously | Step N depends on output of Step N-1 |
| **Time span** | Milliseconds | Seconds to days to months |
| **Chain scope** | Single chain | Potentially cross-chain |
| **Failure mode** | Transaction reverts — clean | Partial completion — messy |
| **Yield opportunity** | None (instant) | Every waiting state earns |
| **Verification** | Once, pre-signing | Per-step AND cumulative |

Compound intents are a special case — a flow with zero time between steps, on a single chain. Flows are the general case.

---

## The Complexity Spectrum

### Simple Flows (2-3 steps, single chain, minutes)

| Flow | Steps | Dependency Pattern |
|------|-------|--------------------|
| Swap and send | Swap → Transfer (amount = swap output) | Linear, output-dependent |
| Limit order with yield | Deposit to yield → Monitor price → Withdraw → Swap | Linear, condition-triggered |
| DCA | Recurring: Withdraw from yield → Swap → Repeat | Loop with schedule |
| Buy and stake | Swap → Stake (amount = swap output) | Linear, output-dependent |

**These are what exists today as discrete recipes.** The insight is that every recipe involving more than one action is implicitly a flow — we just don't treat it as one.

The limit order is already a flow: park in yield → heartbeat → check condition → withdraw → swap. The SDK doc describes it exactly this way. But the framework doesn't model it as a first-class flow with per-step verification and cumulative goal tracking. It's a script that happens to call verify once before the swap.

### Medium Flows (3-6 steps, potentially cross-chain, hours to days)

| Flow | Steps | What's New |
|------|-------|-----------|
| Cross-chain transfer | Wrap → Bridge → Wait for finality → Unwrap → Transfer | Cross-chain coordination, waiting states |
| Portfolio rebalance | Calculate target allocation → Sell overweight positions → Buy underweight → Verify targets met | Multiple parallel sub-flows, success criteria on the whole |
| Escrow with yield | Deposit to escrow → Park in yield → Monitor condition → Withdraw from yield → Release escrow | Interleaving yield and escrow state |
| Invoice payment | Receive invoice → Convert treasury to payment currency → Transfer → Generate receipt → Record | Business process, not just financial actions |

**Cross-chain is where it gets interesting.** "Move 100 USDC from Solana to Base" is at least 4 steps involving two different chains, a bridge, and a waiting period for finality. Each step is verified by a different chain adapter. The flow layer coordinates across them. No one is doing this with intent verification at each step.

### Complex Flows (6+ steps, multi-chain, multi-party, days to months)

| Flow | Steps | What's New |
|------|-------|-----------|
| Payroll | Calculate amounts per employee → Convert treasury to N local currencies → Distribute to N addresses → Verify all received → Generate report | Fan-out to many recipients, multi-currency |
| Treasury management | Monitor positions → Rebalance when thresholds breached → Yield-optimize new allocations → Report → Repeat | Continuous, rule-driven, no end state |
| Multi-party settlement | Collect from N parties → Aggregate → Calculate splits → Distribute to M parties → Confirm all received | Multi-party coordination, completion tracking |
| Agent hiring agent | Negotiate terms → Create milestone escrow → Fund (with yield) → Monitor deliverables → Release per milestone → Close | Multi-step with human/agent evaluation gates |

**This is the ERP/enterprise angle Simon was talking about.** Once flows can incorporate business logic (approval gates, conditional routing, external data inputs), you're not building a verification tool anymore. You're building a financial execution engine.

---

## Second-Order Effects

### 1. Flows Create Temporal Lock-In

A single verification is stateless. Call it, get a result, done. The agent can switch to any other verification service tomorrow with zero cost.

A flow is stateful. An agent mid-way through a 5-step cross-chain rebalance on Agent CLI **cannot switch platforms without aborting the flow**. The flow state — which steps completed, what intermediate outputs were produced, what yield is accruing — lives on Agent CLI.

This is a fundamentally stronger lock-in mechanism than data or reputation. Data lock-in says "your history is here." Flow lock-in says "your money is mid-operation here." One is about the past. The other is about right now.

**Implication:** Flows shift Agent CLI from a tool you call (substitutable) to a platform your money lives on (sticky). This is the difference between Stripe (just the payment API) and a bank (where your operations run).

### 2. Every Waiting State Becomes Yield-Bearing

This is the unique intersection of RebelFi's yield infrastructure and the orchestration layer. The general principle:

**Any time gap between flow steps is a yield opportunity.**

| Flow | Waiting State | Yield Window |
|------|-------------|-------------|
| Limit order | Between deposit and price trigger | Hours to weeks |
| Escrow | Between funding and release condition | Hours to months |
| DCA | Between periodic buys | Days to weeks |
| Payroll | Between treasury deposit and disbursement date | Days |
| Bridge | Between send and finality confirmation | Minutes to hours |
| Milestone contract | Between funding and milestone completion | Days to months |
| Multi-party settlement | Between first collection and final distribution | Hours to days |

No competitor has yield infrastructure. So even if someone else builds flow orchestration, they can't make the waiting states productive. Yield-bearing flows is an intersection that only exists because we have both the yield stack and the orchestration layer.

**"Make the wait productive" as a universal product principle:** Not just for limit orders. For every financial operation where money sits idle between steps. This is a design principle that applies to every flow template we ever build.

### 3. Flow Data Is Categorically More Valuable Than Transaction Data

The current data thesis: collect intent → transaction mappings. Individual data points.

Flow data is relational. It captures HOW agents compose financial operations — the sequence, the dependencies, the decision points, the failure modes. This is business process intelligence, not just financial intelligence.

| Data Type | What Single Intents Show | What Flows Show |
|-----------|------------------------|----------------|
| **Agent behavior** | What they did | How they think — the planning logic behind multi-step operations |
| **Failure patterns** | This transaction failed | Step 3 of this flow type fails 30% of the time — systemic issue |
| **Business processes** | Agent transferred USDC on Friday | Agent executes payroll every Friday (swap treasury → distribute to 12 addresses) |
| **Optimization opportunities** | This swap had high slippage | Agents doing A→B→C could save 15% by doing A→C directly via a different route |
| **Protocol quality** | This protocol had an issue | Bridge X fails at step 3 of cross-chain flows 8x more than Bridge Y — infrastructure quality signal |
| **Demand intelligence** | 500 agents wanted to swap Token X | 200 agents wanted to execute the same 3-step yield farming strategy on Protocol Y — product-market fit signal for that protocol |

Flow data makes the data moat deeper because it captures structure, not just points. A competitor starting from zero would need to observe not just what agents do, but the multi-step patterns they compose. That's orders of magnitude harder to replicate.

### 4. Failed Flows Are More Valuable Than Failed Intents

The strategy reference already identifies failed intents as a unique data asset — "what agents wanted to do but didn't." Failed flows are a richer version of the same thing:

- A failed intent tells you: "An agent wanted to swap Token X but aborted."
- A failed flow tells you: "An agent was executing a cross-chain rebalance. Steps 1-3 succeeded. Step 4 (bridge from Solana to Base) failed due to congestion. The agent had $5,000 in an intermediate state on Solana for 45 minutes before the retry succeeded."

That's infrastructure intelligence. Where do multi-step operations break? How long do partial completion states last? Which bridges/protocols are bottlenecks? What's the recovery time?

**This data is actionable for protocol developers, bridge operators, and infrastructure providers** — not just for risk scoring. It's a potential B2B data product: "Here's where your protocol breaks in the context of real agent workflows, not synthetic benchmarks."

### 5. Flow Templates Become a Marketplace

Recipes v1 (current concept): single-action capabilities. "Copy this prompt, your agent can swap."

Recipes v2 (with flows): multi-step workflow templates. "Copy this recipe, your agent can run payroll."

**The difference in value is enormous.** A single-action recipe encodes a capability. A flow template encodes domain expertise. A payroll flow template built by a FinOps expert — handling multi-currency conversion, tax withholding logic, split disbursement — is genuinely worth paying for.

This creates a two-sided marketplace:
1. **Template creators** (domain experts, developers, operators) publish flow templates
2. **Template users** (agents, operators) instantiate and customize them

Every template execution generates flow data. The marketplace is self-reinforcing: more templates → more diverse flow data → better optimization models → better templates → more users.

**The competitive moat compounds.** A new entrant can copy your verification API. They cannot copy a marketplace of battle-tested flow templates with usage data across thousands of executions.

### 6. Flows Solve the Agent Autonomy Spectrum Problem

The current model of agent autonomy is binary: either the agent acts autonomously (scary, no guardrails) or it asks for human approval on every action (slow, defeats the purpose).

Flows enable a middle ground: **the human approves the flow, the agent executes within it.**

"I approve this DCA flow: buy $50 of SOL every Monday for the next 8 weeks, max slippage 2%, abort if SOL drops below $40."

The human defined the flow once. The agent runs it 8 times without asking. Each step is verified against the flow parameters. The agent can't deviate — but it doesn't need to ask permission either.

This is a more practical model of autonomy than per-transaction approval, and it maps directly to how businesses already think about delegation: "Here's your budget, here are the rules, go execute."

**Silk Account policies + flow templates = the complete delegation model.** Policies control what the agent CAN do. Flows control what the agent WILL do. Together: bounded, purposeful autonomy.

### 7. The "Financial API Gateway" Framing

If Agent CLI orchestrates flows across protocols, DEXes, bridges, and payment rails, it becomes the **API gateway for agent financial operations.** Similar to how AWS API Gateway routes HTTP requests with auth, rate limiting, logging, and transformation — Agent CLI routes financial operations with verification, yield optimization, risk checking, and audit logging.

| API Gateway Concept | Agent CLI Equivalent |
|--------------------|--------------------|
| Route request to service | Route intent to protocol/chain |
| Authentication | Silk Account policy enforcement |
| Rate limiting | Spending limits, daily caps |
| Request transformation | Intent → transaction construction |
| Response validation | Transaction verification against intent |
| Logging / monitoring | Intent data collection, flow tracking |
| Circuit breaker | Protocol risk check, abort on high risk |
| Retry logic | Flow recovery, compensation |

This framing matters because it positions Agent CLI as infrastructure, not a product. Developers don't choose an API gateway for its UI. They choose it because it sits in the critical path of every request and provides essential middleware. Agent CLI in the critical path of every agent financial operation is a very different positioning than "a tool you can optionally call to verify a transaction."

### 8. Flow Orchestration Strengthens the Compliance Story

The EU AI Act angle from the strategy reference: intent-to-transaction audit trails become compliance infrastructure. Flows make this significantly stronger.

A single transaction has a single audit trail. A flow has a **causal audit trail** — "this transaction happened BECAUSE of this previous outcome, which was triggered by this condition, which was part of this flow that the operator approved on this date."

That's not just "what the agent did." It's "why the agent did it, what it was trying to accomplish, what preceded it, and who authorized the overall plan." This is exactly what regulators will want when they ask about autonomous agent decision-making.

**The flow definition itself is a compliance artifact.** "Our agent is authorized to execute this payroll flow, approved by the CFO on March 1, with these parameters and these guardrails." That's auditable, reviewable, and explainable in a way that "our agent can make arbitrary transactions within a $5,000 daily limit" is not.

### 9. Cross-Agent Flow Composition

The most interesting long-term angle. Individual agents execute single flows. But what about flows that span multiple agents?

```
Trading Agent sells SOL → output USDC
    → triggers →
Treasury Agent receives USDC → deposits to yield
    → on schedule →
Payroll Agent withdraws from yield → distributes to employees
```

Three agents, three flows, one business process. Each agent has its own Silk Account, its own policies, its own verification. But the flows are connected — the output of one triggers the input of another.

Agent CLI becomes the coordination layer between agents. Not just verifying individual actions, but orchestrating cross-agent financial processes. This is where the "operating system" metaphor becomes literal — an OS doesn't just run programs, it coordinates between them.

**The data generated by cross-agent flows is the richest possible behavioral intelligence.** You see not just what individual agents do, but how teams of agents coordinate, where handoffs fail, and how business processes decompose into agent-level operations.

### 10. Standards Opportunity: The Flow Format

ACK (Catena) is defining agent identity. x402 (Coinbase) is defining agent payments. Nobody is defining agent financial workflows.

If Agent CLI defines the flow format — how multi-step financial operations are expressed, parameterized, and verified — it defines the standard for programmable agent finance. The intent type system already exists. The flow format is a natural extension: a DAG of intent types with dependencies, conditions, and yield directives.

```
// Conceptual flow definition
{
  id: "yield-bearing-limit-order",
  steps: [
    { id: "park", action: "lend", params: { ... }, yield: true },
    { id: "monitor", action: "condition", trigger: { priceBelow: "$TARGET" } },
    { id: "withdraw", action: "withdraw", dependsOn: "monitor" },
    { id: "swap", action: "swap", dependsOn: "withdraw",
      params: { amountIn: "$withdraw.output" } }
  ],
  verification: {
    perStep: true,
    wholeFlow: true,
    goalMatch: "Acquire $TOKEN at or below $TARGET price"
  }
}
```

This isn't just a product feature. It's a **lingua franca** for expressing agent financial operations. If every flow template uses this format, and templates are shared via GitHub/NPM/MCP, the format becomes the de facto standard through distribution — not through committee.

---

## Use Cases Worth Thinking About

### Consumer / Trading

- **Smart DCA**: Buy $50 of SOL weekly, BUT adjust amount based on 7-day price momentum. Down 10%+ → buy $75 (buy the dip). Up 10%+ → buy $25 (reduce exposure). This is a flow with conditional branching, not a static recurring buy.
- **Arbitrage with safety**: Detect price discrepancy → verify both sides → execute simultaneously → verify outcome matches expected profit → abort and unwind if not. Multi-step with safety gates at each point.
- **Cross-chain yield hunting**: Monitor yield across Solana/Base/Arbitrum → bridge funds to highest yield → monitor for better opportunity → bridge back when found. Continuous, cross-chain, yield-optimizing.
- **Dollar-cost averaging out**: The inverse of DCA-in. Gradually sell a position into stables, parking proceeds in yield between sells. Useful for taking profits without timing the market.

### Enterprise / Treasury

- **Programmable treasury management**: "Keep 60% in yield, 20% in stables for operations, 20% in SOL. Rebalance weekly. Alert if any position deviates more than 5% from target." This is an ongoing flow with rules, thresholds, and periodic execution.
- **Accounts payable automation**: Invoice received → verify vendor identity → convert to payment currency → transfer → generate receipt → update accounting. Multi-step, multi-system, with verification at each point.
- **Multi-currency payroll**: Treasury in USDC → convert portions to local currencies for each employee → distribute → verify all received → generate compliance report. Fan-out pattern with multi-currency handling.
- **Revenue collection and split**: Receive payments from N customers → aggregate → calculate platform fee → distribute to partners per agreement → yield on retained portion. Multi-party, ongoing.

### Agent-to-Agent Commerce

- **Service procurement with escrow**: Agent A needs a service → creates yield-bearing escrow → Agent B delivers → Agent A's verification confirms delivery → escrow releases. The money earns yield during the entire service delivery period.
- **Negotiation → execution pipeline**: Agent A proposes terms → Agent B counter-proposes → agreement reached → escrow funded → milestones tracked → payments released per milestone. End-to-end autonomous commerce.
- **Supply chain payments**: Manufacturer agent → distributor agent → retailer agent. Goods flow one direction, payments flow the other, with escrow at each step and yield on every waiting period.

### Novel / Non-Obvious

- **Yield-bearing everything**: This deserves its own callout. Every flow primitive that involves a waiting state (escrow, limit orders, DCA intervals, bridge finality, milestone contracts, payroll before disbursement, settlements before distribution) can earn yield during the wait. This is a design principle that only works because we have the yield stack. It makes every flow economically superior to the non-yield version. Nobody else can do this.
- **Flow insurance**: "Your flow is 3/5 complete. Step 4 involves a bridge with 2% failure rate. Insure the remaining steps for 0.1% of the flow value." Real-time, mid-flow insurance priced on current state and remaining risk. Only possible with full flow context.
- **In-flight flow state as collateral**: A partially complete flow has economic value. If step 1 swapped $10K of SOL to USDC and step 2 hasn't executed yet, there's $10K in a known intermediate state. Could that intermediate state serve as collateral for a flash operation? Novel, but interesting.
- **Flow optimization as a service**: Observe 10,000 agents executing similar flows. Identify: "Agents doing swap→bridge→swap could save 18% on gas by using Protocol Y instead of Protocol X at step 2." Sell this optimization intelligence back to operators. The data moat produces a direct revenue product.

---

## How This Changes the Competitive Map

### No Competitor Is Building This

Look at the landscape from the strategy reference:

| Competitor | Single Transaction Verification | Flow Orchestration | Yield on Flows |
|-----------|-------------------------------|-------------------|---------------|
| Catena | Post-execution logging only | No | Display only (no generation) |
| Natural | Post-execution observability | No | No |
| Sponge | `beforeExecute` hook (no intelligence) | No | No |
| Locus | No | No | No |
| Sapiom | No | No | No |
| **Agent CLI** | Pre-signing intent verification | **Potential** | **Yes (existing infrastructure)** |

Even the players closest to us (Catena with their "intelligence + enforcement" thesis) are thinking at the single-transaction level. Nobody is modeling multi-step financial workflows as a first-class primitive with per-step verification, cross-step yield optimization, and cumulative goal tracking.

### The Complexity Barrier

Building single-transaction verification is tractable — parse the transaction, match against the intent, return a result. A startup with a good engineer can ship this in weeks.

Building flow orchestration with verification is an order of magnitude harder:
- State management across time and chains
- Dependency resolution between steps
- Failure handling and compensation logic (sagas)
- Yield interleaving during waiting states
- Cross-chain coordination
- Partial completion recovery
- Goal-level verification (not just step-level)

This complexity is a feature, not a bug. It's a barrier to entry. And it builds on top of single-transaction verification — you need to nail single-step first before you can compose steps into flows. So the building sequence is natural: ship single-step verification now, add flow orchestration when the foundation is proven.

---

## The CI/CD Pipeline Analogy

The developer population that would use Agent CLI is the same population that uses CI/CD pipelines (GitHub Actions, CircleCI, etc.). The mental model maps directly:

| CI/CD Concept | Agent CLI Flow Equivalent |
|--------------|------------------------|
| Pipeline | Flow |
| Step / Job | Intent (verified action) |
| Trigger | Condition (price target, schedule, event) |
| Artifact | Intermediate output (swap result, yield accrued) |
| Secret | Silk Account operator key |
| Environment variable | Flow parameter (amount, token, address) |
| Conditional step | Conditional intent (if price > X, do Y) |
| Matrix / fan-out | Multi-recipient distribution |
| Pipeline failure | Flow failure + compensation |
| Pipeline logs | Intent verification audit trail |
| Reusable workflow | Flow template / Recipe v2 |

This isn't just an analogy — it's a distribution insight. Developers who already think in pipelines will immediately understand flow definitions. The YAML-like flow format, the dependency graph, the triggering conditions — it's all familiar from CI/CD. The learning curve drops to near zero for the target audience.

"GitHub Actions, but for money" is a one-liner that immediately communicates what Agent CLI flows are.

---

## Relationship to What's Being Built Now

**The limit order IS a flow.** The SDK doc describes it as: deposit to yield → heartbeat → check price → withdraw → swap → return. That's a 6-step flow with a conditional trigger. It's just not modeled as one.

If the limit order is built with flow-awareness from the start — even internally, even without exposing the flow primitive to users yet — the foundation is laid. The steps are:

1. **Ship the limit order as described** (Mar 24 target). Internally, it's a flow. Externally, it's "a yield-bearing limit order."
2. **Observe whether users want to compose.** Do people ask for "limit order, then send the proceeds to X"? "DCA, but adjust amounts based on Y"? If yes, the flow primitive has pull.
3. **Expose the flow definition format.** Let users define their own multi-step operations. This is the "Recipes v2" moment.
4. **Flow templates marketplace.** Published, shareable, parameterizable flow definitions.

The key insight: you don't need to build the full flow engine to benefit from flow thinking. You just need to build the limit order in a way that's internally decomposed into verifiable steps, so that when the time comes to generalize, you're extending, not rewriting.

---

## What This Is NOT

To be clear on scope:

- **This is not an action item.** The limit order ships first. The flow primitive comes after there's signal that composition matters.
- **This is not a spec.** It's an exploration of the design space and the opportunities within it.
- **This is not a pivot.** It's an extension of the existing intent framework — flows are composed of intents.
- **This is not something to build right now.** But it IS something to build toward. The architectural decisions made in the limit order will either enable or constrain the flow primitive later. Building with awareness of where this goes is different from building blind.

---

## Key Takeaways for the Strategy

1. **The intent framework's natural evolution is from intents to flows.** Single verified actions → verified sequences of actions. The jump is architecturally natural but strategically significant.

2. **Yield-bearing flows is the unique intersection nobody else can build.** Orchestration without yield is just task automation. Yield without orchestration is just a savings account. The combination — money earning while waiting between steps of a complex financial operation — only exists because we have both stacks.

3. **Flow data is categorically richer than intent data.** The data moat thesis gets stronger with flows because you capture process intelligence, not just point-in-time decisions.

4. **Flows create temporal lock-in that single verifications don't.** Money mid-operation on your platform is stickier than money that calls your API once.

5. **The flow format could become a standard.** ACK defines identity. x402 defines payments. Nobody defines financial workflows. First-mover advantage on the flow format is a standards play.

6. **The CI/CD analogy is a distribution shortcut.** "GitHub Actions for money" communicates instantly to the developer audience. Flow definitions in YAML/JSON that look like pipeline configs will feel native to the target user.

7. **The limit order you're shipping on Mar 24 is the first flow.** Build it with that awareness. Even if the flow primitive isn't exposed to users for months, the internal architecture should decompose into verifiable steps.
