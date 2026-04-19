# Agentic Economy — Strategy Landscape

**Created:** 2026-02-26
**Context:** Stripe's 2025 annual letter confirms agent-native financial infrastructure is being built by incumbents. This document maps the full strategy space — positioning options, go-to-market approaches, long-term path, and second-order plays — to sharpen thinking before committing to execution.
**Status:** Exploration phase. Sharpening potential strategies, not committing yet.
**DEFCON Status:** DEFCON 3 (Active Mobilization) — see assessment below.

---

## 1. Where We Are

### DEFCON 3 — Confirmed

The Stripe 2025 annual letter (Feb 24, 2026) pushed us past the DEFCON 3 threshold. Per [[mobilization-plan]], DEFCON 3 requires 2 of 5 trigger criteria. We now have at least 3:

| Trigger | Status | Evidence |
|---------|--------|----------|
| Major crypto VC publishes thesis validating agent payment infrastructure | **FIRED** | a16z "Tourists in the Bazaar" (Feb 19) |
| Agent transaction volume visibly accelerating | **FIRED** | Bridge volume quadrupled. Stablecoin payments doubled to ~$400B (60% B2B). |
| Meaningful developer discussion/demand around agent checkout | **FIRED** | Stripe shipped ACP with OpenAI, machine payments, agentic commerce suite. Etsy, Coach, Anthropologie onboarding. 100K+ claimable sandboxes. Google launched Universal Commerce Protocol. |
| 3+ new projects announce agent payment/financial infrastructure within 30 days | **Borderline** | Stripe ACP + machine payments + Google UCP + Tempo blockchain, all within weeks |
| Market signal: agent commerce threatening incumbents | **FIRED** | Citrini "2028 GIC" (Feb 22) dropped Visa 5%. 7,900+ likes. Market pricing in agent-led interchange disruption. Not a trigger criterion but a significant validation signal. |

### Original Tripwire Update

| # | Tripwire | Status | Evidence |
|---|----------|--------|----------|
| 1 | Agent txn volume > $1M/month | **Warming** | Stripe machine payments launched. Not confirmed $1M agent-specific yet. |
| 2 | Major operator requests policy-controlled agent accounts | **Partial** | Stripe's Shared Payment Tokens and ACP are beginnings of permissioned agent commerce, but not "policy-controlled accounts" per se. |
| 3 | Competitor ships agent-native financial infra with traction | **FIRED** | Stripe: machine payments, ACP, Shared Payment Tokens, agentic commerce suite, Tempo blockchain. Real customers onboarding. |
| 4 | Agent autonomously completes multi-step financial txn | **Not yet** | Stripe says industry at L1-L2 only. L4 (delegation) not yet. |
| 5 | Yield clients ask for agent integration | **No signal** | Delos and Kuratek haven't asked. |

**Assessment:** Tripwire #3 definitively fired. Multiple signals warming. Per [[gameplan]] rules: 1 tripwire fired = re-evaluate. 2+ = shift to 60/40. We're between these thresholds.

### Current State

- **Yield infrastructure:** Live on Solana, Ethereum, Polygon. Base is ~1 day of work to add.
- **Silk Accounts + payment protocols:** Solana-only. Policy controls, spending limits, escrow (Handshake), delegation (Silkysig).
- **Agent OS:** Researcher agent online and gathering signals. Developer and Loki operational.
- **Pipeline:** Delos (waiting on their response, uses DFNS wallets) and Kuratek (waiting on tech requirements doc) both bottlenecked on their side.
- **Researcher finding:** Coinbase "Agentic Wallet" is actually an Electron app requiring a human. Not usable by agents programmatically. Gap between marketing and reality is significant.

---

## 2. The Strategic Landscape

### What Stripe Is Building

Stripe's 2025 annual letter reveals their agentic commerce strategy. Key moves:

**Products shipped:**
- **Agentic Commerce Protocol (ACP)** — Open protocol with OpenAI for AI platforms to transact with businesses. Cross-provider by design.
- **Shared Payment Tokens** — Agents initiate payments without exposing credentials. Works even for non-Stripe businesses.
- **Agentic Commerce Suite** — Single integration to sell across ACP + Google's Universal Commerce Protocol. Anthropologie, Etsy, Coach, Kate Spade onboarding.
- **Machine Payments** — Charge agents directly for API calls, MCP usage, HTTP requests via stablecoin micropayments.
- **Claimable Sandboxes** — Start using Stripe from AI coding tools (Manus, Replit, Vercel). 100K+ created.
- **Tempo** — Purpose-built payments blockchain (with Paradigm). Sub-second finality, dedicated payment lanes. Explicitly designed for agentic payments and microtransactions. Visa, Nubank, Shopify, Klarna testing.

**Acquisitions:**
- **Bridge** — Stablecoin orchestration. Volume quadrupled in 2025.
- **Privy** — 110M+ programmable wallets.
- **Metronome** — Usage-based billing (OpenAI, Anthropic, NVIDIA).

**Their framing — "Five Levels of Agentic Commerce":**

| Level | Description | Status |
|-------|-------------|--------|
| L1 | Agent fills out forms / clicks buy | Industry is here |
| L2 | Descriptive search ("get me X for situation Y") | Industry is here |
| L3 | Persistence (agent remembers preferences) | Not yet |
| L4 | Delegation ("get the shopping done, budget $400") | Not yet |
| L5 | Anticipation (no prompt, things arrive before you need them) | Futuristic |

**What Stripe is NOT building:**
- Operator-level financial controls (spending limits, approval flows for agent teams)
- Yield on agent idle balances
- Agent-to-agent escrow
- Agent treasury management
- Agent credit scoring / reputation

**Stripe's focus:** Consumer-facing agentic commerce (ChatGPT shopping, AI assistants buying things for users). Merchant-side tooling.

**Our focus:** Operator-facing agent financial infrastructure (operators deploying agent teams that need to pay for services, manage budgets, earn yield). Different buyer, different problem.

### What Coinbase Is Building

- **Agentic Wallets** — Marketed as agent-native. In practice: Electron app that requires human operation. Our agent couldn't use it programmatically. Significant gap between positioning and capability.
- **Base** — L2 chain with growing DeFi ecosystem. Potential chain for Silk Accounts if we expand beyond Solana.
- **AgentKit / CDP** — Developer tools for agent-blockchain interaction. More functional than the "Agentic Wallet" product.

### Interchange Disruption Signal: Citrini "2028 GIC" (Feb 22, 2026)

Citrini Research's "2028 Global Intelligence Crisis" scenario — a fictional look back from June 2028 — dropped Visa stock 5% and got 7,900+ likes. See [[citrini-2028-gic-analysis]] for full analysis.

**The scenario:** Agents optimize for cost, route around 2-3% card interchange to stablecoins on Solana/L2s. Mastercard Q1 2027 reports "agent-led price optimization," drops 9%. Card-dependent banks (Amex, Synchrony, Capital One, Discover) hit hard. "Their moats were made of friction. And friction was going to zero."

**What this means for the landscape:**
- Card networks are not just adapting to agentic commerce — they're facing existential pressure from it. The Citrini scenario and the a16z "cards won't die" analysis represent two ends of a spectrum. Reality is somewhere in between, but the DIRECTION is clear: stablecoin volume grows as agent commerce grows.
- The scale of potential stablecoin transaction volume dwarfs current estimates. If even 10% of card interchange migrates to stablecoin settlement, that's hundreds of billions in annual stablecoin flow needing yield infrastructure and transaction verification.
- Enterprise agent deployment (not just DeFi bots) becomes the primary TAM driver. Every Fortune 500 company deploying cost-optimizing agents creates demand for stablecoin rails → yield → verification.

**Implication for our positioning:** "We build the safety and yield layer for the payment rail that replaces cards" is a more powerful framing than "stablecoin yield ops." The Visa stock reaction proves investors take this narrative seriously.

### Card Networks Adapting to Agentic Commerce (March 2026)

Per a16z analysis ("Agentic Commerce Won't Kill Cards," March 4, 2026 — see [[a16z-agentic-commerce-cards-analysis]]):

| Player | Move | Implication for RebelFi |
|--------|------|------------------------|
| **Visa** | Intelligent Commerce framework in pilot. 16B+ tokens issued. | Cards will serve existing merchants via tokenization. Not our market. |
| **Mastercard** | Agent Pay live for all US cardholders | Same — existing merchant infrastructure adapting to agents. |
| **Stripe ACP** | 1M+ Shopify merchants coming online, Etsy live | ACP becoming default for existing merchant agentic commerce. |
| **x402** | HTTP-native stablecoin payments, no merchant account needed | **Integration target** for verification SDK. The rails for new merchants that can't accept cards. |

**Key framing:** Cards dominate agentic commerce for existing merchants. Stablecoins power the merchants that don't exist yet (vibe coder micro-merchants, API-first services, agent-to-agent commerce). Both RebelFi tracks serve this new merchant class.

### The Vibe Coder Micro-Merchant Segment (NEW — March 2026)

A new merchant class emerging faster than any previous platform shift:
- 36M new developers joined GitHub in one year
- 67% of Bolt.new's 5M users are NOT developers
- 25% of YC W25 batch: codebases 95%+ AI-generated
- These developers are simultaneously new buyers AND new sellers

**Archetype:** Developer ships API-first micro-service, no website/entity/checkout. Another developer's agent calls it 40K times at $0.001/call. $40 revenue, no human interaction.

**Why they can't use traditional payments:** Processors can't underwrite them — no website, no entity, no track record. They're choosing stablecoins over nothing.

**What they need from us:**
- Transaction verification (verify micropayments match intent at volume)
- Policy controls (spending limits on calling agents)
- Yield on accumulated micropayments
- Eventually: underwriting/credit based on verified transaction history

**Relationship to verification SDK:** This segment is adjacent to trading bots (our E3 target) but growing faster. Should be included in market sizing. x402 is the payment rail; our verification SDK is the safety/risk layer on top.

### What Others Are Building

| Player | What They're Building | Relevance |
|--------|----------------------|-----------|
| **Crossmint** | Multi-chain wallet infrastructure, NFT/token APIs | Potential wallet partner for yield integration |
| **DFNS** | Wallet-as-a-service for institutions | **Delos uses this.** B2B2B distribution opportunity. |
| **Privy (Stripe)** | 110M programmable wallets, flexible custody | Inside Stripe ecosystem. Integration = complementary positioning. |
| **Fireblocks** | Institutional custody + DeFi access | Enterprise segment. Yield integration opportunity. |
| **Skyfire** | Agent payment network | Direct competitor concept. Needs hands-on testing. |
| **Google** | Universal Commerce Protocol | Protocol layer, not infrastructure. Complementary. |

### The Gap Map

| Capability | Who's Building It | Gap Size |
|-----------|-------------------|----------|
| Agent checkout (consumer) | Stripe (ACP), Google (UCP) | **Closed** |
| Agent micropayments (API calls) | Stripe (machine payments) | **Closing** |
| Programmable wallets | Privy, Coinbase, Crossmint, DFNS | **Closed** |
| **Pre-signing transaction verification** | **Nobody** | **Wide open** |
| **Intent-to-transaction matching** | **Nobody** | **Wide open** |
| **Real-time protocol/counterparty risk for agents** | **Nobody** | **Wide open** |
| Policy-controlled agent accounts | **Nobody** | **Wide open** |
| Yield on agent idle balances | **Nobody** | **Wide open** |
| Agent-to-agent escrow | **Nobody** | **Wide open** |
| Agent treasury management | **Nobody** | **Wide open** |
| Agent credit/reputation scoring | **Nobody** | **Wide open** |
| Agent financial identity/compliance | **Nobody** | **Wide open** |
| Operator dashboards for agent spend | **Nobody** | **Wide open** |

The "nobody" column is the entire Agent CLI thesis. The verification gaps (top three bold rows) represent the newly identified entry point — the lowest-friction product that also collects the behavioral data to build everything below it. See [[transaction-verification-sdk]] for the full product document.

**Note on wallet simulation previews:** Phantom, Backpack, and other wallets are adding transaction simulation previews for *humans*. These are UI features, not agent-native APIs. They show a human what will happen; our verification SDK tells an *agent* whether it should proceed, with risk intelligence and behavioral profiling. Different product, different buyer.

**Note on verification data as underwriting intelligence (March 2026):** Per the a16z "cards vs stablecoins" analysis, the central blocker for new merchants is that processors can't assess risk. Transaction verification data IS underwriting data. If the verification SDK screens transactions at volume, we're sitting on risk intelligence that enables underwriting the new merchant class — extending the data moat beyond agent behavioral profiles into merchant risk assessment. This is a second-order data product we hadn't previously articulated.

**Note on FICO obsolescence and agent credit histories (March 2026):** The Citrini "2028 GIC" scenario describes 780-FICO borrowers defaulting because income assumptions changed — "the loans were good on day one, the world just changed." If traditional credit scoring breaks under AI displacement, agent-generated transaction histories and verification data become the new underwriting primitive. Our data moat from the verification SDK isn't just agent behavioral profiles — it's the foundation for credit assessment in an economy where human income is no longer stable. See [[citrini-2028-gic-analysis]].

---

## 3. Positioning Options

### Option A: Wallet-Agnostic Yield Layer

**What it is:** RebelFi yield operations sitting on top of every wallet provider. Pure yield-as-a-service. Works with DFNS, Crossmint, Privy, Coinbase, Fireblocks — any wallet.

**Strengths:**
- Leverages existing, working product (yield on Solana/ETH/Polygon)
- Non-competitive with wallet providers (complementary)
- Simplest integration — just yield, nothing else
- Immediate value proposition: "Your idle funds earn yield. Zero config."
- Wallet providers might promote it (makes their product stickier)

**Weaknesses:**
- Thin moat — yield aggregation is commoditizable
- Doesn't capture spending data (the real moat)
- Limited to spread on AUM — margin pressure at scale
- No path to the "banking for agents" vision without adding account layer

**Best for:** Quick distribution, land-and-expand, B2B2B through wallet providers.

### Option B: Agent Banking Platform (Silk Accounts)

**What it is:** Full agent banking — policy-controlled accounts, spending limits, yield, escrow, operator dashboards. Agent CLI as originally conceived.

**Strengths:**
- Unique positioning — nobody else is building this
- Captures behavioral financial data (the real moat)
- Natural path to credit scoring, insurance, identity (Phase 3-4)
- High switching costs once operators configure policies
- Defensible: financial controls + data + compliance = hard to replicate

**Weaknesses:**
- Solana-only right now (limits addressable market)
- Requires operators to adopt new infrastructure (high friction)
- Product not fully production-ready (per [[mobilization-plan]] deployability assessment)
- Market may not be ready for full banking yet (Stripe says L1-L2)

**Best for:** Long-term moat building, Phase 2+ of the path to agent finance.

### Option C: Phased Approach — Yield First, Bank Second

**What it is:** Lead with wallet-agnostic yield (Option A) to get distribution and touch points. Pull through Silk Accounts (Option B) as operator needs mature.

**Strengths:**
- De-risks market timing — yield works NOW regardless of agent maturity
- Builds distribution before the banking product needs to be ready
- Each yield integration is a potential Silk Account customer
- Data from yield phase (wallet usage, chain preferences, idle balances) informs account product
- Aligns with Delos/Kuratek work (yield) while building toward Agent CLI vision

**Weaknesses:**
- Risk of staying at yield layer and never pulling through to accounts
- Yield customers may not convert to account customers (different buyer?)
- Two-product development burden

**Best for:** Current situation — validates near-term while building long-term.

### Option D: Agent-Discoverable Infrastructure (Distribution Play)

**What it is:** Whatever we build (yield, accounts, or both), make it maximally discoverable and integrable by agents and AI coding tools. LLM-friendly docs, MCP server, open source examples.

**Key insight:** This isn't an alternative to A/B/C — it's a **distribution strategy** that applies to any of them. But it's worth calling out separately because it represents a fundamentally different go-to-market from traditional sales.

**The mechanics:**
- `llms.txt` and Mintlify-style docs — agent-parsable documentation
- MCP server — agents integrate directly, no human intervention
- Open source examples per wallet (`rebelfi-dfns-yield-example`, etc.)
- Content that ranks for "[yield/payments] + [wallet provider]" in agent searches

**Why this matters:**
- Traditional: human finds product → evaluates → integrates (weeks-months)
- Agent-discoverable: agent searches → finds docs → integrates via MCP (minutes-hours)
- First mover in agent-discoverable financial infrastructure owns the discovery layer

**This is independent of which product we're building.** It's how the product gets distributed.

### Option E: Transaction Verification Entry Point (NEW — March 2026)

**What it is:** A free, wallet-agnostic pre-signing verification API that agents call before signing any transaction. Verifies intent matches transaction, assesses counterparty and protocol risk, checks economic sanity. See [[transaction-verification-sdk]] for full product document.

**Strengths:**
- Zero-friction adoption — agents keep their existing wallets, just add an API call
- Existing market TODAY (trading bots, DeFi bots) — doesn't require waiting for "agentic economy"
- Free tier is the data collection engine — behavioral financial data from every verification request
- Naturally funnels into Silk Accounts — "we already know your behavior, here's a pre-configured account"
- Multi-chain from day 1 (Solana IDL parsing + EVM ABI decoding)
- Network effects: more users → better risk models → more accurate verification → more users

**Weaknesses:**
- New product category — needs market education
- Revenue model depends on conversion to paid tiers or downstream products
- Trust challenge: agents must trust a service that sees their transactions pre-signing
- Technical depth varies by protocol complexity

**Best for:** Immediate entry point for the agentic track. Collects the data that makes every later product (accounts, credit, insurance) possible.

**Key insight:** Option E solves the adoption friction problem that Options B and C both face. Instead of asking agents/operators to migrate to new infrastructure, we add value to whatever they already use. The data from E builds the case and pre-qualifies customers for B.

### Current Recommendation: C + D + E (Updated March 2026)

Phased approach (yield first, verification entry, bank later) with agent-discoverable distribution. This gives us:
1. Near-term revenue and distribution through yield (serves WhizPay, Nomadrem, Delos, Kuratek)
2. Zero-friction agentic entry through verification SDK (serves trading bots TODAY, broader agents soon)
3. Data collection from verification that feeds every later product (credit, reputation, accounts)
4. Long-term moat through banking (serves the 5-year vision)
5. Agent-native distribution that compounds over time

**The sequencing insight:** Verification (E) comes before banking (B) because it's lower friction, collects the data B needs, and validates whether agents actually care about financial safety before we ask them to adopt new account infrastructure.

---

## 4. Go-to-Market Strategies Under Consideration

### Strategy 1: DFNS-First Integration

**What:** Build yield integration with DFNS wallets first.

**Why:**
- Delos uses DFNS — pre-builds their integration, removes friction from the deal
- DFNS is wallet-as-a-service for institutions — their entire customer base becomes addressable
- B2B2B distribution without a partnership (DFNS customers find us through docs)
- Creates first proof point of wallet-agnostic yield

**Effort:** Low-medium. Yield infrastructure exists. DFNS API integration is the new work.

**Output:** Working integration + llms.txt-friendly docs + open source example repo.

### Strategy 2: LLM-Friendly Documentation (llms.txt)

**What:** Adopt Mintlify or similar for docs. Implement `llms.txt` standard. Make every integration guide parsable by LLMs.

**Inspiration:** Resend got massive adoption because LLMs (Cursor, Claude, ChatGPT) could parse their docs and generate working integrations. When a developer asks an AI tool "send an email," the LLM finds Resend. We want: when an agent/developer asks "earn yield on DFNS wallet," the LLM finds RebelFi.

**Reference:** https://llmstxt.org/ and https://www.mintlify.com/docs/ai/llmstxt

**Why:**
- SEO for the agentic era — discovery through AI tools, not Google
- Compounds over time (more docs → more discovery → more integrations → more docs)
- Low effort relative to impact (documentation, not product development)
- Agent team can help produce and maintain docs

### Strategy 3: MCP Server

**What:** Build an MCP server for RebelFi/Agent CLI that lets agents interact with yield operations (and eventually Silk Accounts) directly.

**Why:**
- Agents don't read docs — LLMs parse docs to generate code. But an MCP server is something an agent uses directly, in real-time, no code generation needed.
- Claude, Cursor, Manus, Replit all support MCP
- Highest-leverage integration mechanism — minutes, not days
- The MCP server IS the product interface for agent customers

**Example capabilities:**
```
rebelfi.get_yield_options(wallet_provider="dfns", chain="ethereum")
rebelfi.enable_yield(account_id="...", strategy="stable")
rebelfi.get_balance(account_id="...")
rebelfi.get_yield_report(account_id="...", period="30d")
```

### Strategy 4: Open Source Example Repos

**What:** One GitHub repo per wallet integration: `rebelfi-dfns-yield-example`, `rebelfi-crossmint-yield-example`, `rebelfi-privy-yield-example`, etc.

**Why:**
- Open source repos get indexed by LLMs and appear in training data
- They get forked, starred, referenced — compound discoverability
- Trivially easy for agent coding tools to pull from
- Each repo is a landing page for that wallet provider's ecosystem
- Agent team can build these with minimal direction (also tests H5 — agent capabilities)

### Strategy 5: "State of Agentic Wallets" Content Play

**What:** Systematically test every "agentic wallet" with a real agent. Document what actually works vs. what's marketing. Publish findings.

**Evidence so far:** Coinbase "Agentic Wallet" = Electron app, not usable by agents programmatically.

**Why:**
- Proprietary competitive intelligence
- Positions RebelFi as the authority that tests, not theorizes
- Valuable to operators choosing infrastructure
- Drives discovery (both human SEO and agent search)
- Agent team produces this as part of H6 validation

### Strategy 6: Wallets as Distribution Channels

**What:** Frame each wallet provider's user base as a distribution channel. Not through partnerships — through documentation and discoverability.

**Mechanics:**
- Developer at DFNS customer searches "yield on DFNS" → finds our docs
- Agent building with Crossmint searches "earn yield Crossmint wallet" → finds our example repo
- Operator evaluating Privy sees "RebelFi yield integration available" in our docs → adds yield to their product

**Key insight:** We don't need the wallet providers to know we exist. Their customers find us through their agents and AI tools. The docs are the distribution.

### Strategy 7: "First Service on the Rack"

**What:** Instead of building the "rack" (service provisioning for agent teams), be the first high-value service on someone else's rack.

**Why:**
- Any agent OS that provisions wallets should auto-enable yield on idle funds
- That's found money for the operator — zero downside
- We're not building the platform, we're the service every platform wants
- Lower effort, faster distribution, same positioning

**How:** MCP server + llms.txt docs make RebelFi trivially easy to include in any agent OS's service catalog.

---

## 5. The Long-Term Path: Banking for Agents

### The Core Premise

Every financial capability that humans and businesses have today, agents will need. The question is sequencing: which capabilities matter when, and who builds them.

5 years down the line, agents will manage multi-million dollar treasuries. They'll automate financial flows in stablecoins. The path from today to that future is the product roadmap.

### The Four Phases

#### Phase 1: Agent Wallets + Yield (NOW — 2026)

**What agents need:** Hold funds. Earn on idle balances.

**What we build:** Wallet-agnostic yield layer. Multi-chain (Solana, ETH, Polygon, Base). Agent-discoverable (llms.txt, MCP server). Works with any wallet provider.

**Value prop:** "Your agent's money is sitting there doing nothing. We make it work."

**Data we collect:** Which wallets agents use. How much they hold. How long funds sit idle. Usage patterns across chains. This data informs Phase 2 product decisions.

**Revenue model:** Spread on AUM (yield earned minus yield passed through).

#### Phase 2: Agent Accounts (2026-2027)

**What agents need:** Spending controls. Budget allocation. Approval flows. Operator visibility.

**What we build:** Silk Accounts — policy-controlled accounts with operator-set limits, delegation, spending categories, real-time dashboards.

**The wedge:** Operators already using yield (Phase 1) get Silk Accounts as an upgrade. "You're earning yield. Now control how it's spent."

**Data we collect:** Spending patterns. What agents buy. Which services they use. Frequency, amounts, categories. Approval vs. auto-approved ratios. **This is the richest dataset in the agent economy — behavioral financial data.**

**Revenue model:** Spread on AUM + account fees (or usage-based).

#### Phase 3: Agent Treasury (2027-2028)

**What agents need:** Multi-account budgeting. Cash flow planning. Yield optimization across strategies. Working capital forecasting. Cross-team financial coordination.

**What we build:** Treasury management layer on top of Silk Accounts. Portfolio-level view across agent teams. Automated rebalancing. Budget forecasting based on operational patterns.

**The wedge:** Operators running 5-10+ agents on Silk Accounts need a dashboard that shows where money is, where it's going, and how to optimize. This is yield accounting + spending analytics + projections.

**Data we collect:** Aggregate patterns across operator types. Industry-specific budget profiles. Seasonal patterns. Growth trajectories. **This data enables Phase 4.**

**Revenue model:** Spread on AUM + SaaS fees for treasury features.

#### Phase 4: Agent Finance (2028-2030)

**What agents need:** Credit lines. Insurance. Complex financial instruments. Agent-to-agent financial markets. Risk management.

**What we build:** Full agent banking stack. Credit based on operational history (we have the data from Phase 2). Insurance products priced by policy configuration. Agent-to-agent markets via Handshake at scale.

**The wedge:** We're the only ones with the data to underwrite agent credit. Phase 2 spending data IS the credit score. No one else has it.

**Data we collect:** The complete financial life of agents. This is the moat. This is the endgame.

**Revenue model:** Lending spread + insurance premiums + market-making fees + AUM spread.

### Data Compounding

Each phase builds the data moat for the next:

```
Yield (Phase 1)
  → learns: wallet types, idle balances, chain preferences
  → enables: "we know where the money sits"
      ↓
Accounts (Phase 2)
  → learns: spending patterns, vendor relationships, approval preferences
  → enables: "we know how the money moves"
      ↓
Treasury (Phase 3)
  → learns: budget allocation, cash flow cycles, growth patterns
  → enables: "we know what the money needs to do"
      ↓
Finance (Phase 4)
  → learns: creditworthiness, risk profiles, market dynamics
  → enables: "we know what the money WILL do"
```

**Critical insight:** Each layer of data is invisible to anyone who only enters at a later phase. Stripe can't build Phase 4 credit scoring without Phase 2 account data. And Phase 2 data is only trustworthy if it comes from actual accounts with real spending, not projected models.

**The bank that knows your agent's complete financial history from day one has an insurmountable advantage over the bank that shows up at Phase 4.**

---

## 6. Second-Order Plays

### 6.1 Agent Reputation = Financial Behavior

If Agent CLI processes agent-to-agent transactions (via Handshake), we observe:
- Completion rates (does this agent deliver?)
- Dispute rates (is this agent reliable?)
- Payment speed (does this agent pay promptly?)
- Volume trajectory (is this agent growing?)

This is a **credit score for agents**. Traditional credit scoring (FICO) was built on payment history. Agent credit scoring will be built on the same thing.

**Product line:** "Agent CLI Reputation" — agent credit scores based on financial behavior. Every platform that wants to assess agent reliability queries our API. This is the Experian of the agent economy.

### 6.2 Agent Insurance

Operators managing agent treasuries need insurance against:
- Agent errors (sends funds to wrong address)
- Smart contract exploits
- Unauthorized spending beyond policy limits
- Coordination failures in multi-agent operations

Agent CLI policy controls reduce risk. An insurer would offer lower premiums to operators using Silk Accounts because the policy layer prevents common failure modes.

**Play:** Partner with (or build) insurance priced by Silk Account policy configuration. Tighter controls = lower premium. Creates financial incentive for operators to use Agent CLI AND configure policies strictly.

### 6.3 Agent Financial Identity

Regulatory requirement coming: "Who authorized this agent? Under what parameters? What's its operational history?"

Silk Accounts have this baked in:
- Delegation chain (operator → agent, with policy)
- Spending parameters (what it's allowed to do)
- Transaction history (what it actually did)
- Operator accountability (human behind the agent)

**Play:** Agent CLI as the compliance/verification layer. Every regulated institution interacting with agents needs to verify financial identity. We're the verification provider.

### 6.4 Cross-Platform Financial Portability

An agent's financial reputation should be portable across platforms. Agent X has perfect payment record on Platform A — Platform B should verify that without rebuilding trust.

**Play:** Agent CLI as the cross-platform financial identity layer. Agents carry credentials across platforms. Spending history, credit score, and compliance record travel with them. Massive network effects.

### 6.5 Agent-to-Agent Financial Markets

When agents hire other agents, supply chains form. Supply chains need:
- Price discovery (what should this cost?)
- Settlement (Handshake escrow)
- Invoice factoring (working capital before job completes)

Agent CLI's escrow protocol is the settlement layer. Pricing data from all those escrows = **market-making dataset**. We know what agents charge, what they pay, where margins are.

**Play:** Bloomberg terminal for the agent economy. Or simpler — the marketplace fee on every agent-to-agent transaction.

### 6.6 Yield-as-Default Flywheel

If Agent CLI accounts earn yield by default (Phase 1 baked into Phase 2):
- Operators prefer Agent CLI because money works harder
- Agents prefer Agent CLI because working capital grows
- Yield advantage compounds — more capital → more yield → more reason to stay

This is how traditional banks work: they make money on the float. Agent CLI does the same but returns most yield to the operator (keeping a spread). At scale, even a few basis points on billions in agent treasury AUM = massive revenue. And AUM grows automatically as the agent economy grows.

---

## 7. Open Questions

### Market Timing
- Are we at the right point for Phase 1 (yield), or is even that premature for agent-specific positioning?
- Should we lead with "yield for businesses" (Delos/Kuratek) and reframe to "yield for agents" when demand materializes?
- How fast is the gap closing on policy-controlled accounts? Stripe's Shared Payment Tokens are adjacent.

### Technical
- Can Silk Accounts work with wallets beyond Solana (DFNS, Privy, Crossmint) through cross-chain bridges, or does it require native deployment on each chain?
- Is the yield accounting logic on-chain or off-chain? This determines whether "wallet-agnostic" is real capability or positioning aspiration.
- What's the actual Agent CLI deployability status? (Per [[mobilization-plan]] — gap assessment needed.)

### Go-to-Market
- Is llms.txt distribution a real channel, or a bet on a standard that might not gain adoption?
- Will wallet providers view us as complementary (feature their customers want) or competitive (capturing their users' attention)?
- How many wallet integrations do we need before "wallet-agnostic" is credible? One? Three? Five?

### Strategic
- Does the phased approach (yield → accounts → treasury → finance) hold, or will the market demand all phases simultaneously?
- How do we prevent Stripe from building policy-controlled accounts and cutting into our Phase 2?
- Is the right long-term positioning "banking for agents" (Agent CLI brand) or "financial infrastructure for the agent economy" (embedded in RebelFi)?

### Competitive
- What exactly is Skyfire building? Needs hands-on testing (H6).
- Are there stealth-mode competitors we don't know about? (Researcher should scan Y Combinator, a16z CSX, etc.)
- If Stripe launches "Stripe for Agents" with accounts + controls, what's our response?

---

## 8. Relationship to Current Priorities

### Alignment with P0 (Delos + Kuratek)

| Strategy | Serves P0? | How |
|----------|-----------|-----|
| DFNS-first integration | **Yes** | Pre-builds Delos integration. Removes friction from deal. |
| llms.txt docs | **Neutral** | Doesn't help close deals directly, but doesn't interfere. |
| MCP server | **Neutral** | Long-term distribution, not immediate deal impact. |
| Open source examples | **Partially** | DFNS example serves Delos. Others are agentic track. |
| "State of Agentic Wallets" | **No** | Pure agentic track. |

### Alignment with 70/30 Allocation

The DFNS integration is the bridge — it serves both tracks simultaneously:
- **70% yield:** Builds the integration Delos needs
- **30% agentic:** Creates first wallet-agnostic proof point, produces docs for llms.txt, tests agent team's ability to build integrations

Everything else (MCP server, additional wallet integrations, content play) falls within the 30%.

**Honest assessment of allocation risk:** The strategies outlined in this document, if pursued in parallel, exceed 30%. The DFNS integration is the only one that clearly serves both tracks. The rest is 30% work. Sequencing matters — don't try to do everything at once.

### Recommended Sequencing

| Priority | Action | Track | Why First |
|----------|--------|-------|-----------|
| 1 | DFNS yield integration + docs | Both | Serves Delos deal + first wallet-agnostic proof point |
| 2 | llms.txt / Mintlify doc infrastructure | 30% | Enables every subsequent integration to be discoverable |
| 3 | MCP server (yield operations) | 30% | Highest-leverage agent distribution mechanism |
| 4 | Second wallet integration (Crossmint or Privy) | 30% | Proves "wallet-agnostic" is real, not just DFNS-specific |
| 5 | "State of Agentic Wallets" content | 30% | Competitive intel + authority positioning |
| 6 | Silk Account cross-chain assessment | 30% | Determines Phase 2 feasibility beyond Solana |

**Agent team can handle items 1, 4, and 5 with light direction** — also validates H5 (agent capabilities sufficient today).

---

## Related Documents

- [[gameplan]] — Full strategy, original hypotheses, 80/20 rationale, operator-first evolution
- [[mobilization-plan]] — DEFCON levels, trigger criteria, action plans per level
- [[a16z-tourists-in-the-bazaar-analysis]] — a16z article analysis: stablecoin stickiness and the Bloomingdale's model
- [[a16z-agentic-commerce-cards-analysis]] — a16z article analysis: cards vs stablecoins in agentic commerce, vibe coder micro-merchants
- [[citrini-2028-gic-analysis]] — Citrini "2028 Global Intelligence Crisis": interchange disruption, stablecoin-as-payment-rail, enterprise agent TAM, FICO obsolescence
- [[alek-simon-call-2026-02-24-analysis]] — Rack model, dog-fooding strategy
- [[power-in-the-age-of-intelligence-lessons]] — Packy framework, competing vs. selling tools
- [[outreach-strategy]] — Service provider outreach ladder

---

#agentic-economy #strategy #landscape #banking-for-agents #distribution
