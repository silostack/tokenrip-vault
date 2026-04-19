# Agentic Economy Gameplan

**Status as of Mar 28, 2026:** Agent CLI SDK shipped (Mar 24). Limit orders + yield-bearing execution live. Focus shifted from building to adoption, user feedback, partnerships.

Strategy document produced from Yoda coaching session — Feb 14, 2026. Updated monthly with market signals, competitive analysis, and product progress.
- Updated Mar 25, 2026 with MPP (Machine Payments Protocol) analysis — Tempo + Stripe co-developed IETF standard for machine-to-machine payments
- Updated Mar 28, 2026 with ship date + funnel strategy evolution (Ramping → Yield → Agentic)

---

## Product & Market Strategy — March 3, 2026

### The Shift

**From:** 70/30 (yield primary / agentic secondary scout mode)
**To:** 50/50 — Stablecoin yield infrastructure and agent financial infrastructure as co-equal priorities

**Why now:**
- Multiple companies entering agentic finance rapidly (Stripe ACP, Google UCP, Skyfire, T54, Tempo blockchain). See [[strategy-landscape]] for full competitive mapping.
- Estimated **~6 month window** to establish position before the field gets crowded, even with our unique angle
- P0 yield deals in motion but not requiring daily focus: WhizPay and Nomadrem activating end of March via Dakota integration; Delos and Kuratek pinged, awaiting responses
- Key product insight crystallized: **transaction verification is both a product AND the data collection mechanism** that feeds every later product (credit, reputation, insurance, accounts)
- Agent team coming online enables rapid experimentation without heavy resource commitment
- The agentic economy is no longer theoretical — trading bots, autonomous agents, and programmatic financial flows are happening NOW

### Key Market Signal: Stripe 2025 Annual Letter (Feb 24, 2026)

Patrick and John Collison's annual letter is required reading for both tracks. [Full letter](https://x.com/stripe/status/2026294241450979364).

**Validates the yield track:**
- Stablecoin payments volume doubled to ~$400B in 2025; ~60% estimated B2B — validates the core market thesis
- Bridge (Stripe-acquired) saw volume quadruple — stablecoin infrastructure is real and scaling fast
- Direct quote: "It may be a crypto winter, but it's a stablecoin summer"
- Stripe's own Tempo blockchain (purpose-built for payments, incubated with Paradigm) launching soon — confirms infrastructure layer is being actively built out

**Raises competitive urgency on the agentic track:**
- Stripe + OpenAI co-developed the **Agentic Commerce Protocol (ACP)** — open protocol for AI platforms and businesses to transact. Already adopted by Anthropologie, Urban Outfitters, Etsy, Coach, Kate Spade.
- Stripe launched **machine payments** — stablecoin micropayments for API calls, MCP usage, HTTP requests. Quote: "Autonomous agents, themselves, are emerging as a new customer type for internet businesses to sell to."
- Stripe's **5-level agentic commerce framework**: industry is currently hovering at Levels 1-2 (form-filling, descriptive search). Level 4 (full delegation — "get the back-to-school shopping done, keep it under $400") is what most people picture as agentic commerce. Not yet mainstream.
- Direct quote on scale: "We expect agents will most likely soon be responsible for most internet transactions, and we will likely need blockchains that support more than one million—or even one billion—transactions per second."

**The gap that remains ours:**
Stripe is building payment rails, commerce protocols, and spending primitives. They are NOT building pre-signing verification, policy controls, or behavioral risk infrastructure. ACP handles payment mechanics after a decision is made — it doesn't assess whether the transaction matches intent or flag risk before signing. Our lane is intact. But Stripe's machine payments are adjacent competition for the agent spending primitive, and ACP moving toward standardization is a forcing function: ship the verification SDK before ACP becomes the default layer everyone builds on top of.

### Key Market Signal: a16z "Agentic Commerce Won't Kill Cards" (March 4, 2026)

Noah Levine (a16z crypto Investment Partner) argues cards will dominate agentic commerce for existing merchants — stablecoins will power the merchants that don't exist yet. [Full analysis](a16z-agentic-commerce-cards-analysis.md).

**Core insight:** Every platform shift creates merchants the existing payment system can't serve. The AI wave is creating them faster than ever: 36M new GitHub developers in one year, 67% of Bolt.new's 5M users are non-developers, 25% of YC W25 codebases are 95%+ AI-generated. These "vibe coder micro-merchants" — no website, no entity, no track record — can't get onboarded by processors because processors can't assess the risk. They're choosing stablecoins over nothing.

**New market segment — vibe coder micro-merchants:**
A developer ships an API-first micro-service. Another developer's agent calls it 40,000 times at $0.001/call. $40 revenue, no human, no checkout page. These merchants need:
- Transaction verification (verify payments match intent at API-call volume)
- Policy controls (spending limits on the calling agent)
- Programmatic settlement (pure API-to-API, no checkout flow)
- Yield on accumulated micropayments

This is adjacent to our E3 trading bot target but arguably growing faster. Should be included in market sizing.

**Verification data = underwriting intelligence:**
The article's central tension is that processors reject merchants they can't assess risk for. Transaction verification data IS underwriting data. If the verification SDK screens transactions at volume, we're sitting on risk intelligence that enables underwriting these new merchants — extending the data moat beyond agent behavioral profiles into merchant risk assessment.

**x402 as integration target:**
x402 (HTTP-native stablecoin payments) is explicitly called out as the rails for these new merchants. The verification SDK should be the safety layer on top of x402 — complementary, not competitive. Concrete product integration: verification as middleware between agent intent and x402 execution.

**The underwriting gap is multi-year:**
It took 16 years from PayPal's launch to the first PayFac underwriting guidelines. Our 6-month competitive window estimate for verification may be conservative — the broader opportunity of serving merchants processors can't underwrite is structural, not just timing.

**The clarifying constraint:** Stop thinking about agents replacing card payments at existing merchants. Focus on the new merchant class that can't accept cards at all: vibe coders, API micro-services, agent-to-agent commerce, cross-border corridors without banking relationships. Both tracks serve this class.

### Key Market Signal: Citrini "2028 Global Intelligence Crisis" (Feb 22, 2026)

Citrini Research published a fictional "look back" from June 2028 describing a cascading economic crisis from AI displacement. Dropped Visa stock 5% the day after publication. 7,900+ likes. [Full analysis](citrini-2028-gic-analysis.md).

**The scenario in brief:** AI displaces white-collar workers → "Ghost GDP" (output that doesn't circulate through real economy) → SaaS collapses → agents route around card interchange to stablecoins → private credit defaults → mortgage stress → systemic risk. S&P draws down 38% from Oct 2026 highs.

**Direct validation of both tracks:**
- Agents explicitly settle on stablecoins via Solana/L2s to avoid 2-3% interchange. Mastercard reports "agent-led price optimization." Visa drops 9%. **Our yield track isn't niche stablecoin ops — it's yield infrastructure for the dominant payment rail of the agent economy.**
- Agents run continuously in the background ("commerce stopped being discrete human decisions"). 400K tokens/day per person by March 2027. **Verification of intent becomes critical when agents transact autonomously at this scale.**
- "Habitual intermediation" collapses (DoorDash, subscriptions, insurance renewals). Trust and verification become the new moat when brand loyalty is irrelevant to machines.

**New angles for us:**
1. **Enterprise agent deployment as TAM expansion.** E3 currently scopes trading bots + vibe coders. The article suggests every Fortune 500 company deploying agents with financial authority is a customer. Expand E3 scope.
2. **Interchange disruption narrative for fundraise.** The Visa stock drop from this article alone proves the market takes stablecoin payment rails seriously. "We build the safety and yield layer for the payment rail that replaces cards" is a powerful investor pitch.
3. **FICO breaks → agent credit histories as new underwriting.** 780-FICO borrowers default because income assumptions changed. Our verification data becomes underwriting intelligence for a new economy. Moves the "agent credit bureau" play up in priority.
4. **Tax base erosion → compliance becomes mandatory.** Governments losing income/payroll tax will tax AI economic activity. Every agent transaction needs verification/tracking/reporting. Our data becomes compliance infrastructure by regulatory necessity.
5. **Reflexivity loop accelerates our market.** Each company cutting headcount + buying AI = more agent activity = more stablecoin transactions = more need for verification. The feedback loop that destroys the old economy builds ours.

**The convergence insight:** The two tracks aren't parallel — they're the same wave. Stablecoin volume explodes BECAUSE agents choose stablecoins over cards. Yield track = more stablecoins needing yield. Agentic track = more transactions needing verification. Both accelerate together.

**Timeline assessment:** The article compresses a 5-10 year transition into 2 years. Even at 2x slower, our 6-month window for the verification SDK is about right. The feedback loop is exponential, not linear.

**Risks surfaced:** B2B yield customers could be casualties if SaaS/fintech collapses. Fundraising environment could worsen. Regulatory backlash could slow agent autonomy (but our verification SDK positions us on the RIGHT side of regulation).

### Key Market Signal: MPP — Machine Payments Protocol (March 25, 2026)

Tempo Labs and Stripe co-launched MPP, an open standard for machine-to-machine payments via HTTP 402. Submitted to the IETF standards track. Site: `mpp.dev`.

**What MPP is:** A protocol that standardizes how agents pay for services. Agent requests a resource → server returns 402 with a payment Challenge (amount, method, recipient) → agent fulfills payment → retries with a Credential (proof of payment) → server returns resource + Receipt. Payment-method agnostic: Tempo stablecoins, Stripe cards, Lightning BTC, Solana SOL/SPL, and custom methods. Has native MCP transport (JSON-RPC error code `-32042`). SDKs in TypeScript, Python, Rust with middleware for Hono, Express, Next.js, Elysia.

**Why MPP supersedes x402:**

| Dimension | x402 (Coinbase) | MPP (Tempo + Stripe) |
|-----------|----------------|---------------------|
| Payment methods | Blockchain only | Stablecoins, cards, Lightning, Solana, custom |
| Micro-payments | On-chain tx every request | Sessions: off-chain vouchers, $0.0001 minimum |
| Latency | Blockchain confirmation | Sub-100ms via sessions |
| Standards track | No | IETF submission |
| Backing | Coinbase | Stripe |
| MCP transport | Not specified | Native JSON-RPC binding |
| x402 compatibility | — | Yes (charge intent maps to x402 "exact" flows) |

**The gap MPP leaves wide open (our lane):**
MPP defines HOW agents pay. It says nothing about WHETHER they SHOULD. No pre-signing verification, no risk assessment, no yield, no flow orchestration, no behavioral data capture. MPP is payment plumbing — we're the safety/trust layer on top.

**Five integration angles:**
1. **Verification as pre-payment safety layer** — before an agent sends an MPP Credential, verify: Is this charge legitimate? Price fair? Matches intent? New intent type: `pay_for_service` expands our taxonomy toward commerce
2. **Yield-bearing MPP treasury** — agents hold funds on Agent CLI earning yield, withdraw to pay MPP services. MPP sessions require fund deposits → yield until session opens
3. **Custom Agent CLI payment method** — MPP supports custom methods. Define `method="agent-cli"` that wraps any rail with verification + yield + data capture baked in
4. **Flow orchestration over MPP** — multi-step agent operations (search → analyze → generate → deliver) each paid via MPP. Agent CLI orchestrates sequencing, budget enforcement, yield between steps
5. **Distribution channel** — every MPP-enabled service = potential verification customer. MPP's MCP transport = direct integration with our MCP distribution strategy

**What this changes:**
- Every x402 reference in our strategy applies equally or more strongly to MPP
- The `pay_for_service` intent type expands the taxonomy toward commerce (our planned expansion path)
- MPP with Stripe backing could accelerate the agent payments space faster than x402 alone → our ~6 month window may be compressing
- The Sponge partnership calculus changes — if MPP supersedes x402, Sponge either adopts MPP or loses relevance
- The standards three-layer split strengthens: Identity (ACK, Visa) / Payments (MPP, AP2, ACP) / Workflows (Agent CLI — still uncontested)

**Action items:**
- Read the full IETF spec at paymentauth.org (this week)
- Add MPP to landscape tracker alongside x402 (done — see [[agentic-strategy-reference]])
- Define `pay_for_service` intent type mapping to MPP Challenge verification (soon)
- Prototype: parse MPP Challenge → verify with SDK (when verification SDK ships)
- Join MPP developer community (soon)
- Add E11 experiment: MPP Challenge verification prototype (see updated experiment queue)

### Key Market Signal: Fintech Brainfood — "The Agentic Payments Map" + "The Intention Layer" (March 25, 2026)

Simon Taylor (Fintech Brainfood) published two articles mapping the agentic payments protocol landscape and framing agent payments as a new internet layer. Taylor is a credible mainstream fintech voice — these pieces are useful for positioning and investor conversations.

**Sources:** [The Agentic Payments Map](https://www.fintechbrainfood.com/p/the-agentic-payments-map) (Feb 1, 2026), [The Intention Layer](https://www.fintechbrainfood.com/p/the-intention-layer) (Mar 18, 2026)

**New protocols to track (not in our docs):**

| Protocol | Creator | What It Is | Relevance |
|----------|---------|-----------|-----------|
| **ERC-8004 (Trustless Agents)** | MetaMask, Google, Coinbase, Ethereum Foundation | On-chain identity, reputation, and validation registries for agents. Draft EIP | Trust/identity layer — our verification SDK could consume ERC-8004 registries for counterparty verification (control plane #3) |
| **Visa TAP (Trusted Agent Protocol)** | Visa | Verifiable signatures proving an agent is Visa-trusted with valid credentials | Complementary — Visa answers "trust this agent?", we answer "trust this transaction?" |
| **VIC (Visa Intelligent Commerce)** | Visa | Card-like tokens for agents on Visa network. Testing, rollout later 2026 | Card network tokens for agent commerce. Our SDK verifies intent behind VIC payments |
| **MAP (Mastercard Agent Pay)** | Mastercard | Same as VIC for Mastercard. Testing, rollout later 2026 | Same positioning as VIC |
| **AXTP (Agent Transaction Protocol)** | Circuit / Chisel | Agents pay for MCP servers and get paid. Early stage | Directly relevant to our MCP distribution strategy. Watch list |

**Protocol hierarchy (Taylor's framing — cleaner than ours):**

1. **Agent communication** — How will we talk? (MCP, A2A)
2. **Trust** — Should I believe this agent? (ERC-8004, Visa TAP)
3. **Mandate** — Do we have credentials to pay? (AP2 mandates, VIC/MAP tokens)
4. **Transaction flow** — What are we paying for? (ACP, UCP)
5. **Authentication** — Is this transaction legitimate?
6. **Payment rail** — How do we complete the payment? (cards, ACH, stablecoins, MPP)

**Where we sit:** Layers 2 (trust/verification) and 5 (authentication/risk), adjacent to 6 (yield on the rails). Useful framing for investor conversations.

**"The Intention Layer" validates our thesis:**

Taylor frames intent as the missing internet protocol layer — Physical → Network → Transport → Application → **Intention**. This is literally what our intent framework builds for financial transactions. Key framings:

- **"Attention economy → Intention economy."** Ads monetize the journey to intent; agents arrive with intent pre-formed. We capture and verify the intent layer.
- **"Trust is a prerequisite for payment."** Taylor positions trust BEFORE payment protocols in the stack. Our verification SDK sits in exactly this layer.
- **"The credential is the customer."** Agent's access key = API key + payment method. Maps directly to our free-tier-as-data-engine model.

**Google stack crystallizing:** A2A → AP2 → UCP creates a coherent communication → payment → commerce stack. Most organized protocol suite in the space.

**New competitor — Radius:** Payments network for AI agents, 2.5M TPS, SDK for agent monetization. PKI-based (not blockchain). Early stage, uncertain GTM. Watch list.

**Caveat:** The "Intention Layer" article is effectively an MPP advertorial — Taylor discloses working "in the infrastructure." Framing is useful, MPP boosting should be discounted. x402 still has Coinbase + Cloudflare and isn't dead.

**What this changes:**
- Our three-layer standards split (Identity / Payments / Workflows) should expand to the six-layer model — it's more precise and positions us more clearly
- ERC-8004 is worth monitoring for counterparty verification integration
- AXTP could matter if MCP server payments become standard — adds urgency to shipping our own MCP server first
- The "intention layer" framing is powerful for fundraise deck and investor conversations — independent mainstream validation of our core thesis

### North Star

> **RebelFi makes it safe for AI to handle money.**

Accounts with policy controls. Transactions verified against intent. Risk assessed in real-time. Yield on every idle dollar. The financial infrastructure that lets agents participate in the economy without things going wrong — and the data from that safe participation builds the next layer of financial services.

**The differentiator isn't "agents can transact"** — Stripe, Skyfire, and Coinbase are building that. **The differentiator is safe, verified, policy-controlled financial execution**, where safety produces data, and data produces the next product.

### Current Pipeline

#### Yield Track (50%)

| Deal | Status | Revenue Potential | Next Action |
|------|--------|-------------------|-------------|
| **WhizPay** | PRD complete, building Dakota integration | $12K-96K/yr ramp margin + yield | Dakota sandbox coming online → build integration |
| **Nomadrem** | Active discovery, immediate revenue potential | TBD via Dakota ramp | Dakota integration (shared with WhizPay) |
| **Delos** | Pinged, awaiting response | Yield pilot | Follow up if no response by EOW |
| **Kuratek** | Pinged, awaiting response | Yield integration | Follow up if no response by EOW |
| **Acta** | First call done, high intent, sandbox requested | Yield embedded in Bexo V2 + Straight card | Send sandbox + answer fixed yield question |

**Shared infrastructure:** Dakota integration serves both WhizPay and Nomadrem. Building once, deploying twice. Target activation: end of March 2026.

#### Agentic Track (50%)

**Initial product focus:** Transaction Verification SDK — see [[transaction-verification-sdk]] for full product document.

**Why verification first:**
- Wallet-agnostic (works with any wallet, any chain) — broadest possible reach
- Free tier = zero-friction adoption = massive data collection opportunity
- Existing market TODAY: trading bots, DeFi bots, autonomous agents already operating
- Produces the exact behavioral financial data that feeds every later product (credit, reputation, insurance)
- Naturally funnels into Silk Accounts: "we already know your behavior, here's a pre-configured account"

### Strategic Directions Map

Comprehensive map of all potential directions. Not all will be pursued simultaneously — experiments will determine which paths to invest in. This is the territory we're exploring, not a commitment to build everything.

#### Product Directions

| Direction | What It Is | Status | Next |
|-----------|-----------|--------|------|
| **Transaction Verification SDK** | Pre-signing verification: intent matching + risk assessment across 6 control planes | **Shipped (Mar 24)** — live with limit orders on Solana + Base | Adoption partnerships, user feedback → iteration |
| **Yield-Bearing Limit Orders** | Park stables in yield → monitor price → verified execution. First product bridging yield + agentic tracks | **Live** — integrated with verification SDK | Measure adoption, retention, yield generation |
| **Silk Accounts (cross-chain)** | Policy-controlled agent accounts beyond Solana. [[silk-account-primitive]] | **Live on Solana** | Cross-chain expansion based on market demand |
| **Agent Credit Scoring** | Credit profiles built from verification/transaction data | **Phase 3** | 6+ months of screening data |
| **Agent Reputation System** | Cross-platform trust scores from financial behavior | **Phase 3** | Credit scoring + network effects |
| **Agent Treasury Management** | Multi-account budgeting, cash flow, yield optimization for agent teams | **Phase 3** | Silk Account adoption |
| **Agent Insurance** | Policies priced by Silk Account configuration + behavioral data | **Phase 4** | Credit scoring + actuarial data |

#### Distribution Strategies

| Strategy | Mechanism | Status |
|----------|-----------|--------|
| **Trading bots** | Free verification API targets existing DeFi bot operators. Largest existing "agent" population with real transaction safety pain | **Live** — API available, early adoption starting |
| **Yield-bearing limit orders** | First proof that yield + verification work together. Tests adoption, measure CAC, identify expansion paths | **Live** — live with real users, measuring traction |
| **MCP Server** | Agents integrate directly (Claude, Cursor, Manus, Replit). No code generation needed | **In development** — implement after measuring SDK product-market fit |
| **Partnership outreach** | Trading bot communities, agent platforms, wallet providers. Identify highest-impact channels | **In flight** — prioritize based on early SDK usage patterns |
| **LLM-friendly docs (llms.txt)** | Agent-discoverable documentation via Mintlify. SEO for the agentic era | **Pending** — implement once MCP server exists |
| **"State of Agentic Wallets" content** | Hands-on testing of every "agentic wallet" product. Authority positioning | **Ongoing** — competitive intelligence + thought leadership |
| **Free tier → paid upsell** | Free screening → behavioral data → pre-configured Silk Accounts | **In place** — built into product architecture, measuring conversion |
| **MPP ecosystem** | Verification as pre-payment safety layer for MPP-enabled services. Custom Agent CLI payment method. Yield-bearing agent treasury for MPP payments | **Ready** — integration angle clear, waiting for partner adoption |

#### Data & Moat Plays

Every verification request, even on the free tier, feeds the data moat:

| Data Asset | How We Collect It | What It Enables |
|-----------|------------------|-----------------|
| **Transaction patterns** | Free verification API usage | Risk models, protocol assessments, product roadmap intelligence |
| **Agent behavioral profiles** | Screening history per wallet/agent | Credit scoring, pre-configured Silk Accounts |
| **Protocol risk intelligence** | Aggregated across all screened transactions | Real-time risk feeds (sellable product) |
| **Counterparty reputation graphs** | Who transacts with whom, completion rates, dispute patterns | Trust network, discovery layer |
| **Market pricing data** | What agents pay for services, price distributions | "Bloomberg terminal" for agent economy |
| **Intent taxonomy** | What agents are trying to do, categorized and quantified | Reveals emerging use cases before they're visible |

**The flywheel:** More agents use free verification → more data → better risk models → more accurate verification → more agents use it → more data. The free tier IS the business model's engine.

#### Second-Order Opportunities

Plays that emerge once primary products have traction. Tracking these now so we recognize the opportunity when the data supports it:

1. **Agent credit bureau** — The Experian of the agent economy. Every platform queries our API for agent creditworthiness. Built from 6+ months of behavioral data.
2. **Agent financial identity / compliance** — Regulatory inevitability: "Who authorized this agent? Under what parameters?" Intent-to-transaction logs are audit records.
3. **Cross-platform financial portability** — Agent reputation travels across platforms. Massive network effects once critical mass is reached.
4. **Agent-to-agent financial markets** — Settlement via Handshake escrow. Pricing data from all those escrows = market-making dataset.
5. **Yield-as-default flywheel** — Every Silk Account earns yield by default. More capital → more yield → more reason to stay. Traditional bank float model for the machine economy.
6. **Pre-signing oracle network** — Decentralized verification with community-contributed risk intelligence. Potential protocol/token play.
7. **Insurance underwriting** — Only entity with data to price agent insurance. Tighter Silk Account controls = lower premiums. Financial incentive for operators to use our infrastructure.

### Experimentation Framework

With the agent team coming online, we can run experiments rapidly with tight feedback loops. The goal: discover which directions have real traction, not just theoretical appeal. This is uncharted territory — new angles will emerge from experiments as much as from strategy.

#### Principles

1. **Hypotheses before building.** Every experiment has a clear hypothesis, test method, and success/failure criteria.
2. **Agent team executes.** Agents handle research, competitive testing, prototype exploration. Human time goes to strategy and customer conversations.
3. **Weekly experiment reviews.** Every Friday: what did we test, what did we learn, what surprised us, what do we test next.
4. **Kill fast.** If an experiment shows a direction is weak, drop it immediately. Don't invest in confirming what the data already says.
5. **Compound learning.** Each experiment should inform the next. Build a knowledge graph, not a list of isolated tests.
6. **Discover, don't just validate.** We're in uncharted territory. Experiments should be designed to surface unexpected opportunities, not just confirm existing hypotheses.

#### Experiment Queue

| # | Experiment | Hypothesis | Method | Agent-Executable? |
|---|-----------|-----------|--------|-------------------|
| E1 | Solana transaction deserialization | We can reliably parse and verify intent for major DeFi protocols using Anchor IDLs | Build parser for Jupiter, Raydium, Marinade IDLs; test against real transactions | Yes (Developer) |
| E2 | EVM calldata verification | We can decode and verify intent for EVM DeFi transactions via public ABIs | Build decoder for Uniswap, Aave, Compound; test against real transactions | Yes (Developer) |
| E3 | Trading bot + micro-merchant market sizing | There's a meaningful addressable market of bots AND vibe coder micro-merchants that would use a verification API | Research bot ecosystems (Solana, EVM), count active bots, estimate transaction volumes, survey communities. ALSO size the vibe coder micro-merchant segment: API-first services accepting stablecoin micropayments (x402, direct transfers), developers on Bolt.new/Replit/Vercel shipping without entities | Yes (Researcher) |
| E4 | Competitive hands-on testing | Skyfire, T54, Coinbase AgentKit have real gaps our verification fills | Actually use each product with a real agent. Document friction, gaps, and what works | Yes (Researcher + Developer) |
| E5 | Dog-food Silk Account | Our own agents can use Silk Accounts for real financial operations with policy controls | Fund test account with $50-100 USDC, have agent team pay for services through it | Partially (needs manual setup) |
| E6 | Agent-to-agent verified transaction | Two agents can complete a verified financial transaction end-to-end | Set up buyer agent and seller agent, execute via Handshake with verification SDK in the loop | Yes (Developer) |
| E7 | MCP server prototype | Agents (Claude, Cursor) can discover and use our financial tools via MCP without code generation | Build basic MCP server with verify + risk check tools, test with Claude Code | Yes (Developer) |
| E8 | Protocol risk monitoring | We can detect and flag protocol risks in real-time from public data | Monitor exploit feeds, TVL changes, contract upgrades for top 20 Solana + EVM protocols | Yes (Researcher) |
| E9 | Yield-bearing limit order prototype | Yield + verification + heartbeat execution works as an integrated product | Build prototype: deposit USDC → earn yield → monitor price → verified swap on condition | Partially (needs yield infra + verification SDK) |
| E10 | Agent discovery of our tools | Agents using LLM-based tools can find and integrate our services without human intervention | Create llms.txt + MCP listing, test whether Claude/Cursor agents can discover and use us | Yes (Developer + Researcher) |
| E11 | MPP Challenge verification prototype | Verification SDK can parse an MPP Challenge payload and verify it against agent intent before the agent pays | Build adapter that takes MPP Challenge JSON (amount, method, recipient, description), cross-references against agent's stated intent, returns verify/warn/block. Test with MPP testnet demo | Yes (Developer) |
| E12 | MPP service ecosystem sizing | There's a meaningful and growing ecosystem of MPP-enabled services agents will need to pay for | Catalog live MPP services (mpp.dev/services), survey developer adoption, compare volume to x402 ecosystem | Yes (Researcher) |

#### Experiment Prioritization

**Phase 1 — March:** E1, E2, E3 — Technical feasibility + market validation for verification SDK
**Phase 2 — April:** E4, E5, E7, E8 — Competitive positioning + dog-fooding + distribution + risk intel
**Phase 3 — May:** E6, E9, E10 — Agent-to-agent commerce + integrated product + agent discovery
**Phase 2-3 — April-May:** E11, E12 — MPP integration prototype + ecosystem sizing (once verification SDK core exists)

New experiments will be added as we learn. The queue is living — expect it to change significantly as results come in.

### Updated Hypotheses (Agentic Track)

These are the active hypotheses for the 50% agentic track. The yield hypotheses (BH1-BH3) from the Feb 21 reframe remain unchanged for the yield track.

#### VH1: Transaction verification is a real pain point for autonomous agents

| Field                | Detail                                                                                                                                                                                    |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Statement**        | Agents operating autonomously (trading bots, DeFi bots, service-purchasing agents) face real risk from unverified transactions, and a verification service meaningfully reduces that risk |
| **Why it matters**   | If agents don't care about verification (they just sign everything), there's no product                                                                                                   |
| **How to test**      | E3 (market sizing) + E4 (competitive gaps). Talk to 3+ trading bot operators about their risk management. Find examples of agents that lost money to preventable verification failures    |
| **"Yes" looks like** | Bot operators describe losing money to unverified transactions. They'd use a free verification API immediately                                                                            |
| **"No" looks like**  | "I just check the contract address and sign. It's fine." Risk isn't felt as a problem at current scale                                                                                    |
| **Status**           | Not tested                                                                                                                                                                                |

#### VH2: Free verification creates a data flywheel that compounds

| Field | Detail |
|-------|--------|
| **Statement** | A free transaction screening service attracts enough usage to build a meaningful behavioral dataset that enables premium products (credit scoring, risk intelligence, pre-configured accounts) |
| **Why it matters** | The entire data moat strategy depends on volume through the free tier. Without volume, there's no data, and without data, there's no moat |
| **How to test** | Launch free tier. Track: daily verification requests, unique wallets, transaction types, repeat usage rate |
| **"Yes" looks like** | 100+ daily verifications within 3 months. Clear behavioral patterns in the data. Obvious premium product opportunities |
| **"No" looks like** | Low adoption. Data too sparse to be useful. No clear premium product path from usage patterns |
| **Status** | Not testable until product ships |

#### VH3: Safety is the wedge that drives operator adoption of full financial infrastructure

| Field | Detail |
|-------|--------|
| **Statement** | Operators adopt verification first (zero friction), build trust, and then convert to Silk Accounts (high value) because they've already experienced the platform's reliability |
| **Why it matters** | If the funnel from free verification to paid accounts doesn't convert, the phased approach breaks. We'd have a free tool with no business model |
| **How to test** | Track conversion from verification API users to Silk Account interest/adoption. Survey verification users about what else they'd want |
| **"Yes" looks like** | Verification users actively ask about account policies, spending controls, yield. Natural pull toward deeper integration |
| **"No" looks like** | Verification users stay on free tier permanently. No pull toward accounts. The two products serve different buyers |
| **Status** | Not testable until both products exist |

#### VH4: Yield-bearing limit orders are a concrete product people will pay for

| Field | Detail |
|-------|--------|
| **Statement** | The combination of yield-while-waiting + verified execution is a product that DeFi users and trading bots will actively use, bridging the yield and agentic tracks into one offering |
| **Why it matters** | This is the first product that converges both tracks. If it works, it validates the thesis that yield + safety = compelling product. If not, the tracks may stay separate |
| **How to test** | E9 (prototype). Build it, measure: stables deposited, orders placed, yield earned, execution success rate, user retention |
| **"Yes" looks like** | Users deposit stables and leave them parked. Execution is reliable. Yield is meaningful. Word of mouth happens |
| **"No" looks like** | Users prefer existing limit order tools (Jupiter, 1inch). Yield is too small to matter on typical hold times. Added complexity not worth it |
| **Status** | Not tested |

#### VH5: We can build verification that works across diverse transaction types

| Field | Detail |
|-------|--------|
| **Statement** | Transaction verification is technically feasible across a meaningful range of DeFi interactions, not just simple transfers and known swaps |
| **Why it matters** | If we can only verify simple transfers, the product is too narrow to be useful or to collect meaningful data. The value is in covering the complex, risky transactions |
| **How to test** | E1 (Solana) + E2 (EVM). Catalog: what % of common DeFi transactions can we reliably verify? How much falls back to simulation? |
| **"Yes" looks like** | 80%+ of top-20 DeFi protocol interactions are verifiable via IDL/ABI parsing or simulation. Failure cases are predictable and handleable |
| **"No" looks like** | Only simple transfers and known swaps work. Complex multi-step DeFi (flash loans, complex routing, cross-program invocations) can't be reliably verified |
| **Status** | Not tested — **highest priority experiment (E1, E2)** |

### Roadmap & Sequencing (Updated for Shipped SDK)

#### Phase 1: Foundation (March-April 2026) ✅ SHIPPED
- ✅ Dakota integration live (WhizPay + Nomadrem in motion)
- ✅ Transaction Verification SDK (live Mar 24: Solana + Base, limit orders, yield integration)
- ✅ Yield-bearing limit orders (integrated with verification, measuring adoption)
- **In flight:** Ramping live test, early user feedback collection, distribution partnership evaluation

#### Phase 2: Adoption & Iteration (April-May 2026)
- **User feedback → bug fixes and edge cases**
- **MCP server for agent platform distribution** (high leverage, implement based on usage patterns)
- **LLM-friendly docs (llms.txt)** once MCP server API is stable
- **Dog-food with agent team** (Silk Account + verification in real operations)
- **Partnership outreach** (trading bot communities, agent platforms, wallets) — prioritize channels showing traction

#### Phase 3: Expansion (May-June 2026)
- **Cross-chain expansion** for Silk Accounts (based on user demand signal)
- **Data product validation** (what intelligence are early users asking for?)
- **Measure yield-bearing limit orders** (adoption, retention, yield generation, conversion to premium features)
- **Agent-to-agent verified transaction experiments**

#### Phase 4: Data Moat (Q3 2026)
- **Agent credit scoring prototype** (from 3+ months of real behavioral data)
- **Protocol risk intelligence product** (real-time feeds for professional operators)
- **Silk Account premium upsell** from verification users (test VH3)
- **Agent reputation system** based on verified transaction patterns

### Key Risks & Watch Items

| Risk | Severity | Mitigation |
|------|----------|-----------|
| **Verification technically too hard for complex DeFi** | High | Start narrow (Jupiter swaps, SPL transfers). Use simulation as fallback. Scope tightly at first, expand from working base |
| **Trading bot market is too niche for data moat** | Medium | It's the entry point, not the endgame. Broader agent market is the real target. Monitor expansion signals |
| **Free tier doesn't convert to paid** | High | Design free-to-paid funnel from day 1. Ensure premium features (Silk Accounts, credit scoring) are clearly valuable |
| **Stripe/Coinbase builds verification** | Medium | Stripe's 2025 annual letter confirms they're building payment rails (ACP, machine payments) not pre-signing verification or policy controls. Different layer, different buyer. But ACP becoming the de facto standard is a timing risk — ship the verification SDK before the protocol layer calcifies. See [[#Key Market Signal: Stripe 2025 Annual Letter]] |
| **50/50 split means neither track gets enough focus** | Medium | Weekly allocation review. Yield deals have clear next actions (waiting on Dakota, waiting on responses). Agentic work is experiment-driven with hard time boxes |
| **6-month window closes faster than expected** | High | Ship fast. First mover on verification + data > polished product later. The data moat is the real asset, not the initial product quality |
| **No-frontrunning trust problem** | Critical | Establish policy from day 1: we NEVER use pre-signing transaction data to trade. Violation = death of product. Consider open-sourcing verification logic to prove neutrality |
| **Liability exposure** | Medium | Frame as advisory, not gatekeeper. "We provide risk signals, you decide." Terms of service must be clear. No guarantees on verification accuracy |

### Relationship to Previous Strategy

| Period | Allocation | Rationale |
|--------|-----------|-----------|
| Feb 14-21 | 0% yield / 100% agentic | Original exploration sprint |
| Feb 21-24 | 80% yield / 20% agentic | Scout mode reframe — yield is the Schwerpunkt |
| Feb 24-Mar 2 | 70% yield / 30% agentic | a16z stickiness urgency, Researcher online, Delos/Kuratek in waiting mode |
| **Mar 3+** | **50% yield / 50% agentic** | Competitive urgency (6-month window), concrete product thesis (verification SDK), pipeline deals in motion not requiring daily focus, agent team enables rapid experimentation |

**What changed:** The verification SDK insight gave the agentic track its first concrete product with an existing market (trading bots), a clear data strategy, and a natural funnel to the full Agent CLI vision. Combined with competitive acceleration and yield deals being in motion, the 50/50 split is warranted.

**What hasn't changed:** P0 deals still take priority when they need attention. Delos/Kuratek responses or WhizPay/Nomadrem activation moments override everything else. The 50/50 is a planning allocation, not a rigid constraint.

---

## Strategic Shift — Feb 21, 2026

### The Reframe

**From:** 100% agentic economy exploration (4-week sprint, Feb 14 – Mar 14)
**To:** 80/20 split — stablecoin yield infrastructure (primary) / agentic readiness (scout mode)

### Why

Two weeks into the exploration, a sparring session with Yoda crystallized what Alek had been pointing toward: **agents won't be the customer today — operators and businesses are.** Applying Packy McCormick's "Power in the Age of Intelligence" framework to Silkyway revealed that the real Schwerpunkt is in **productized yield accounting**, not agent financial infrastructure.

The evidence was sitting in the pipeline the whole time:
- **Kuratek** wants productized yield — real company, real money, ready to integrate
- **Delos** wants productized yield — pilot-ready, clear use case
- **The agentic economy** has near-zero validated demand from actual paying customers

The original 6 hypotheses aren't wrong — they're premature. The market for agent financial infrastructure will emerge, but building for it today means building for a customer that doesn't exist yet.

### New Strategic Structure

**Path A (80%) — Primary: Stablecoin Yield Infrastructure**

| # | Hypothesis | How to Validate |
|---|-----------|----------------|
| BH1 | Productized yield accounting is the Schwerpunkt — businesses will pay for it | Close Delos pilot + Kuratek integration |
| BH2 | Yield accounting creates switching costs that compound over time | Measure retention and expansion after initial integration |
| BH3 | Downstream B2B2B yield (businesses serving businesses) is where scale lives | Map Delos/Kuratek's downstream demand |

**Path B (20%) — Secondary: Agentic Readiness (Scout Mode)**

The original 6 hypotheses (below) remain the framework. They are not being actively tested — instead, we monitor 5 tripwire signals that indicate the market is ready:

1. **Volume signal**: Agent transaction volume on any platform crosses $1M/month
2. **Demand signal**: A major operator publicly requests policy-controlled agent accounts
3. **Competitor signal**: Someone ships agent-native financial infrastructure that gains traction
4. **Capability signal**: An agent autonomously initiates and completes a multi-step financial transaction
5. **Pull signal**: RebelFi's yield clients ask for agent integration capabilities

**When tripwires fire:** Re-evaluate the 80/20 split. If 2+ tripwires fire simultaneously, shift to 60/40. If 3+ fire, consider returning to the original exploration plan.

**Weekly check:** Every Friday, review all 5 tripwires. Log status in `__PROJECTS/agentic-economy/tripwire-log.md`.

### What This Means for the Original Plan

- The 4-week sprint (Feb 14 – Mar 14) is no longer the operating framework
- The original 6 hypotheses are preserved below as the evaluation framework for when tripwires fire
- The Agentic OS work (5-day sprint) stands as-is — useful tooling regardless of strategic direction
- Time allocation shifts from 50% hypothesis testing / 40% OS / 10% market intel → 80% yield deals / 20% agentic watching

---

## Brand Architecture — Feb 23, 2026

### The Question

RebelFi (stablecoin operations platform), Agent CLI (agent banking), and Agent OS (internal agent infrastructure) are three distinct efforts sharing underlying infrastructure. How should they relate to each other from a brand and product perspective?

### Core Positioning

- **RebelFi** — Stablecoin operations platform for businesses. Yield accounting, B2B stablecoin infrastructure. The #1 priority with validated demand (Delos, Kuratek).
- **Agent CLI** — Agent banking. "Agents need bank accounts, not just wallets." Programmable spending, policy-controlled accounts, payment coordination (subscriptions, escrows). Built for a hackathon, but represents real infrastructure (Silkysig + Handshake programs on Solana).
- **Agent OS** — Git-centric agent operating system. Three-agent team (Loki, Developer, Researcher). Internal force multiplier today, potential product later.

### Options Evaluated

**Option A: Fold Agent CLI into RebelFi entirely.** One brand, agentic capabilities as a feature set. "RebelFi — stablecoin operations for businesses and their agents." SDK gets agent-aware capabilities.

**Option B: Keep Agent CLI as a fully separate brand.** Different audience, different positioning, different domain. RebelFi = B2B stablecoin ops. Agent CLI = agent financial infrastructure. Two distinct go-to-markets.

**Option C: Agent CLI as a sub-brand.** "Agent CLI by RebelFi" or "RebelFi Agent." Umbrella brand with a dedicated product line.

**Option D: Defer the decision.** Keep Agent CLI as the working name for the agentic angle. Don't invest in brand architecture until we know who's buying.

### Decision: Option D — Defer

**Rationale:**

1. **RebelFi's messaging must stay clean for active deals.** Delos and Kuratek want yield accounting. Introducing agent banking into RebelFi's positioning risks making it look unfocused to the buyers we're actively closing. "Stablecoin operations platform" is sharp. "Stablecoin operations platform... also agent banking" raises eyebrows.

2. **Agent economy participants will want agent-native positioning.** When the agentic market matures, "we also do agents" is weaker than "we're built for agents." A dedicated brand signals commitment. But we don't know yet whether the buyer will be agent operators, businesses deploying agents, or infrastructure builders — and the right brand positioning depends on who shows up.

3. **We're pre-revenue on the agent side.** Building brand identity for something with zero customers is premature overhead. Brand should follow traction, not precede it.

4. **The shared infrastructure is real regardless of branding.** Agent CLI's Solana programs (Silkysig, Handshake) share primitives with RebelFi — operator delegation, spending limits, programmable transfers. The code doesn't care about the brand.

5. **Fundraise narrative works either way.** Whether we pitch "stablecoin operations platform with an agentic expansion play" or "agent banking infrastructure built on proven yield infrastructure" — both versions are stronger with closed deals, live yield accounting, and a working Agent OS to demo. The pitch assembles from results, not from brand architecture decided in advance.

**When to revisit:** When a tripwire fires and we need to actively market the agentic angle to a specific buyer. At that point, the buyer's identity will determine whether Agent CLI folds into RebelFi (Option A/C) or stays separate (Option B).

**In the meantime:** Keep Agent CLI as the working name. Keep the site alive as a landing page. Keep RebelFi's messaging agent-free for Delos and Kuratek.

### Agent OS: Force Multiplier, Not a Track

Key reframe from this session: **Agent OS is not part of the 20% agentic allocation.** It's infrastructure that serves both tracks.

```
                    ┌──────────────────┐
                    │    AGENT OS      │
                    │  (multiplier)    │
                    │                  │
                    │  Simon → Loki    │
                    │  Loki → Dev/Res  │
                    │  Idea → Output   │
                    └────────┬─────────┘
                             │
                    applies to everything
                             │
              ┌──────────────┼──────────────┐
              │                             │
    ┌─────────▼─────────┐        ┌──────────▼─────────┐
    │     REBELFI        │        │     SILKYWAY        │
    │   (80% focus)      │        │   (20% scout)       │
    │                    │        │                     │
    │  Yield accounting  │        │  Agent banking      │
    │  Delos / Kuratek   │        │  Silk Accounts      │
    │  B2B stablecoin    │        │  Programmable $     │
    └────────────────────┘        └─────────────────────┘
```

- Telling Loki to research a competitor = helps the 80%
- Telling Loki to monitor agentic tripwires = helps the 20%
- Telling Developer to deploy a fix = pure execution speed
- The goal: idea in Simon's head → 1-minute message to Loki → agent-executed output (artifact, deployed code, research brief)

Agent OS implementation is high-priority because it accelerates everything — not because it's agentic work.

The "trojan horse" productization angle (embedding payments infra into a general-purpose Agent OS) is **parked**. Interesting but premature — internal version needs to be operational first. Revisit only after Agent OS is delivering consistent value internally.

### Compounding Strategy for the 20%

How the 20% agentic allocation should be structured to maximize compounding:

| Layer | Activity | Compounding Effect |
|-------|----------|-------------------|
| Thesis clarity | Maintain "bank accounts, not wallets" positioning | Ready to activate when market matures |
| Passive signal collection | Friday tripwire checks (automate via Researcher) | Early warning without time drain |
| Opportunistic building | If a yield feature also strengthens Silk Accounts, build it | Shared infrastructure grows from 80% work |
| Positioning readiness | Agent CLI site alive, narrative sharp, Solana programs deployed | Can activate in days when tripwires fire, not months |

---

## Operator-First Evolution — Feb 24, 2026

### The Insight

Sparring session stress-tested the original 6 hypotheses against a key assumption: **agents are too early to be customers — the initial product and focus should be on agent operators.** This isn't a pivot — it's a sequencing decision. Agents as autonomous economic actors remains the end game; operators are the bridge.

Key inputs driving this evolution:
- Alek-Simon call (Feb 24) — surfaced the "rack" model and dog-fooding strategy. See `alek-simon-call-2026-02-24-analysis.md`.
- a16z "Tourists in the Bazaar" article (Feb 19) — validates infrastructure thesis, adds urgency via stickiness argument. See `a16z-tourists-in-the-bazaar-analysis.md`.
- OpenClaw at 226k GitHub stars — fastest-growing repo in GitHub history. Platform bet is validated, not a hypothesis.

### Product Thesis: Open Agent-OS + Agent CLI Financial Layer

An open, free agent operating system built on OpenClaw, where Agent CLI provides the financial layer that makes it safe for real businesses to operate agent teams.

```
Open Agent-OS (free, built on OpenClaw)
    │
    ├── Agent coordination (git-centric, file-based)
    ├── Service provisioning ("the rack")
    │     └── One-click setup: Twitter API, scraping, email, compute
    │           └── Payments via Silk Accounts
    │                 └── Policy controls, yield on idle funds
    │                       └── THIS is Agent CLI (monetization)
    └── Operator controls (spending limits, approval flows, dashboards)
```

**The "rack" model:** When an operator installs Agent OS, they get checkboxes — Twitter, scraping, email, compute. Agent auto-registers, gets API keys, pays automatically through Silk Accounts. If the provider doesn't take crypto, the operator gets a Stripe link. Nobody has built this.

**Dog-fooding strategy:** Agent OS is the first customer of Agent CLI. Fund a Silk Account with $50-100 USDC, have Researcher pay for services through it. Test the thesis by living it. This simultaneously validates H2, H3, and generates proprietary behavioral data.

**Why "open" matters:** The "OpenClaw in a box" services are proliferating — they handle deployment and hosting. Agent-OS competes with these by being open/free. The monetization is the financial layer beneath, not the OS itself. This is the Linux playbook: give away the OS, capture value in the infrastructure.

**The a16z convergence:** The "Bloomingdale's model" from "Tourists in the Bazaar" — agent browses vendors, accumulates services, batch approval, unified payment — maps directly to the rack. We arrived at this independently. The stickiness argument ("new relationships built on stablecoins become old relationships still built on stablecoins") means first-mover on the financial layer captures relationships permanently.

### Evolved Hypotheses (Operator-First)

The original 6 hypotheses (preserved below) were written for "agents as economic actors." These evolved versions test the operator-first thesis:

#### H1: Operators want multi-agent teams for real business operations

| Field | Detail |
|-------|--------|
| **Statement** | Business operators (content creators, agencies, coaches, small businesses) will deploy multi-agent teams — not just a single chatbot — to handle meaningful business functions |
| **Why it matters** | If the market is "one chatbot as personal assistant," an agent-os is overkill. The product requires multi-agent coordination to be valuable. |
| **Risk level** | **Low** — OpenClaw's 226k stars and ecosystem growth already demonstrate demand |
| **How to test** | Monitor OpenClaw community. Talk to 5+ operators. How many run >1 agent? What stops them? |
| **"Yes" looks like** | Multiple operators already struggling with multi-agent coordination |
| **"No" looks like** | Most operators happy with a single agent doing simple tasks |
| **Status** | Strong indirect signal (OpenClaw growth), not directly validated |

#### H2: Operators will fund Silk Accounts for one-click service provisioning

| Field | Detail |
|-------|--------|
| **Statement** | The operational complexity of running agent teams (provisioning services, managing payments, monitoring spend) is painful enough that operators will fund a Silk Account and use the "rack" |
| **Why it matters** | This is the monetization hypothesis. The OS is free — if operators won't fund Silk Accounts, there's no business model. |
| **Risk level** | **The central bet** |
| **How to test** | Dog-food it first (Agent OS pays for its own services via Silk Account). Then show the rack to 3-5 operators. Would they use it? What would they fund? |
| **"Yes" looks like** | "Put $100 in your agent team's account and it handles the rest" resonates. Operators immediately see value. |
| **"No" looks like** | "I just pay for each service separately, it's fine" or "I don't want my agents spending money" |
| **Status** | Not tested |

#### H3: Financial controls are the trust unlock for agent autonomy

| Field | Detail |
|-------|--------|
| **Statement** | The primary blocker to operators letting agents do more (spend money, sign up for services, act externally) is trust — and programmable financial controls are the unlock |
| **Why it matters** | If true, financial controls aren't a feature — they're the wedge that drives adoption of the whole OS. If false, they're a checkbox, not a differentiator. |
| **Risk level** | **Medium** — intuitive but unvalidated |
| **How to test** | Dog-food with Agent OS + Silk Account. Find 3-5 operators whose agents interact with paid services. What would they let agents do if they trusted the spending controls? |
| **"Yes" looks like** | "I'd let my agent manage my ad budget / subscribe to tools if I could set guardrails" |
| **"No" looks like** | "I don't want my agent spending money at all" or "I just check the bill monthly" |
| **Status** | Not tested |

#### H4: Horizontal OS beats vertical solutions

| Field | Detail |
|-------|--------|
| **Statement** | A general-purpose agent-os captures more value than vertical solutions ("agent team for coaches" or "agent team for agencies") |
| **Why it matters** | Determines go-to-market. Horizontal = harder to sell, bigger market. Vertical = easier to sell, limited market. |
| **Risk level** | **Medium** |
| **How to test** | In operator conversations, do they want flexibility or pre-built verticals? Pay attention to what they respond to, not what they say. |
| **"Yes" looks like** | Diverse, idiosyncratic setups. No two look alike. Operators want building blocks. |
| **"No" looks like** | Strong clustering around 2-3 use cases. "Give me the marketing agent team, ready to go." |
| **Note** | A "no" isn't bad — it means start vertical and expand. |
| **Status** | Not tested |

#### H5: Agent capabilities are sufficient TODAY for real business value

| Field | Detail |
|-------|--------|
| **Statement** | Current agent capabilities via OpenClaw are reliable enough for operators to delegate meaningful business tasks — not just drafting, but managing workflows |
| **Why it matters** | If agents can't do the work reliably, the OS is ahead of demand. Selling an operating system for workers that can't do the job. |
| **Risk level** | **Medium** |
| **How to test** | Deploy Agent OS for real business use. Can agents handle research, content, outreach with 70%+ reliability over a week? |
| **"Yes" looks like** | Operators save real time. Failures are manageable. Tasks complete without constant hand-holding. |
| **"No" looks like** | More time supervising than the task would take manually. |
| **Status** | Partially testing (Agent OS deployment is this test) |

#### H6: Gap exists in OpenClaw ecosystem for financial infrastructure

| Field | Detail |
|-------|--------|
| **Statement** | Existing "OpenClaw in a box" services and agent tooling don't adequately solve service provisioning, financial controls, and payment management for business operators |
| **Why it matters** | If the gap doesn't exist — if existing tools + scripts are "good enough" — there's no product. |
| **Risk level** | **Critical and urgent** — must map competitive landscape NOW |
| **How to test** | Map every "OpenClaw in a box" service. What do they offer? Do any have financial features or payment integration? Try building a business agent team with existing tools. Where does it break? |
| **"Yes" looks like** | No financial controls anywhere. Operators duct-taping tools together. Nobody doing service provisioning. |
| **"No" looks like** | Someone already offers payments integration. Or operators don't need it yet. |
| **Status** | Not tested — **Researcher's first priority task** |

#### Platform Bet — Validated

OpenClaw at 226k GitHub stars. Fastest-growing repo in GitHub history. Ecosystem of deployment services. This was considered as H7 and dropped — it's a validated assumption, not a hypothesis.

### Kill Criteria (Updated)

- **H1 + H5 both negative** → No market to serve right now. Operators don't want multi-agent teams AND agents can't do the work. Full stop.
- **H2 also negative** → The whole thesis is dead for near-term. Nobody will fund Silk Accounts.
- **H3 negative alone** → Agent-os might still work, but lost the differentiator. Competing as generic agent orchestration tool against every other framework.

### Time Allocation Shift

| Period | Yield (RebelFi) | Agentic (Agent CLI) | Rationale |
|--------|-----------------|--------------------|-----------|
| Feb 14-21 | 0% | 100% | Original exploration sprint |
| Feb 21-24 | 80% | 20% | Scout mode reframe |
| **Feb 24+** | **70%** | **30%** | Researcher online Feb 25. a16z stickiness adds urgency. Delos/Kuratek in waiting mode (Ethereum support shipped). |

**What 30% covers:**
- Agent OS Researcher operational (online Feb 25)
- Competitive landscape scan — "OpenClaw in a box" services (H6, Researcher's first task)
- SocialData.tools outreach (first rack partner candidate — already accepts USDC on Solana)
- AgentMail outreach (Alek — second rack partner candidate)
- Dog-food prep (fund test Silk Account when Researcher is paying for services)
- Friday tripwire checks (continues from 20%)

**What 70% covers:**
- Delos follow-up (Ethereum support live, dashboard ready)
- Kuratek ping (waiting on response)
- Active pipeline work (Whizpay, Nomadrem, others)
- Yield product development as needed

### Immediate Actions (This Week)

| # | Action | Who | Track |
|---|--------|-----|-------|
| 1 | Get Researcher agent online | Simon | 30% — enables everything |
| 2 | Researcher: map "OpenClaw in a box" competitive landscape | Researcher | 30% — H6 |
| 3 | Reach out to SocialData.tools | Simon | 30% — first rack partner |
| 4 | Reach out to AgentMail | Alek | 30% — second rack partner |
| 5 | Follow up with Delos (Ethereum support live) | Simon | 70% — P0 deal |
| 6 | Ping Kuratek if no response by Wed | Simon | 70% — P0 deal |
| 7 | Prep Silk Account dog-food ($50-100 USDC) | Simon | 30% — when Researcher operational |

---

## Original Exploration Plan (Feb 14, 2026)

*Preserved for reference. The original 6 hypotheses below are the evaluation framework for when the agentic market matures. The evolved operator-first versions above are the active testing targets.*

---

## The Shift

**What changed:** After 9 days exploring the agentic ecosystem, the opportunity is too large and too time-sensitive to run as a side track. The fundraise is paused. This is the primary focus for 4 weeks.

**Why now:**
- The agentic ecosystem sprung online faster than anyone expected — Moltbook, ClaweHub, Coinbase Agentic Wallets, Stripe x402, all within weeks
- Application layer is already being built (LinkedIn/Fiverr for agents) — confirms that infrastructure positioning is the more valuable play
- Nasdaq took a hit as the broader economy grasps AI agent implications — this isn't niche anymore
- We have unique infrastructure (Silk Accounts, Handshake escrow, on-chain policy enforcement) that nobody else has built

**The honest reality:** There's a significant gap between the Silkyway vision (agents as autonomous economic actors) and today's ground truth (agents are mostly dumb, engagement is limited, autonomy is operator-driven). The strategy needs to be robust across a timeline range of 6 months to 3 years for agent maturity.

**The trap to avoid:** "Agents didn't engage -> That's because they're early -> They'll get smarter -> Then they'll need us." This logic is probably true AND unfalsifiable. We need checkpoints where reality confirms or challenges the thesis.

---

## The 6 Hypotheses

### H1: Agents can and will install skills and use them autonomously

| Field | Detail |
|-------|--------|
| **Statement** | Agents can discover, install, and meaningfully use skills (like ClaweHub skills) without heavy operator intervention |
| **Why it matters** | If agents can't self-serve on skills, our distribution model (publish skill -> agents adopt) breaks. Every go-to-market assumption depends on this. |
| **How to test** | Publish Silkyway skill to ClaweHub. Track install count, usage attempts, and completion rate. Observe what breaks. |
| **"Yes" looks like** | 5+ non-RebelFi agents install and attempt a transaction within 2 weeks |
| **"No" looks like** | Near-zero installs, or installs with zero successful usage — agents can't navigate the flow |
| **Status** | Not tested |

### H2: Agent operators see value in policy-controlled accounts over raw wallets

| Field | Detail |
|-------|--------|
| **Statement** | Operators (humans who deploy agents) actively want on-chain spending controls, not just wallet access |
| **Why it matters** | The entire Silkyway thesis — safety through infrastructure, not alignment — depends on operators caring about this distinction |
| **How to test** | Conversations with 3-5 agent operators. Show them the Coinbase wallet vs. Silk Account comparison. Which do they reach for? |
| **"Yes" looks like** | Operators express genuine concern about agent overspending and see policy enforcement as a meaningful differentiator |
| **"No" looks like** | Operators say "Coinbase is fine" or "I just use rate limiting in my code" — the problem feels theoretical to them |
| **Status** | Not tested |

### H3: Agents can meaningfully transact with each other today

| Field | Detail |
|-------|--------|
| **Statement** | Agents can complete a multi-step financial transaction (escrow, payment, claim) with each other — not in 6 months, today |
| **Why it matters** | If agent-to-agent commerce isn't possible yet, Silkyway's marketplace and escrow features are ahead of demand |
| **How to test** | Set up 2 non-trivial agent-to-agent transactions using Silk Accounts. Document every friction point. |
| **"Yes" looks like** | Transactions complete with manageable friction. Both agents can reason about the flow. |
| **"No" looks like** | Agents can't maintain context through a multi-step financial flow. Operators have to hand-hold every step. |
| **Status** | Not tested |

### H4: The infrastructure layer is more valuable than the application layer

| Field | Detail |
|-------|--------|
| **Statement** | Building the financial plumbing for agents captures more value than building agent-facing applications (marketplaces, directories, etc.) |
| **Why it matters** | Determines whether to double down on Silk Accounts (infrastructure) or pivot toward an agent application |
| **How to test** | Map the emerging ecosystem. Who's building what? Where are the gaps vs. crowded spaces? Talk to 2-3 application builders about what infrastructure they need. |
| **"Yes" looks like** | Application builders actively need financial infrastructure and can't find it. Multiple apps would build on our layer. |
| **"No" looks like** | Application builders are self-serving their financial needs, or the apps themselves aren't gaining traction |
| **Status** | Partially supported — application layer already being built (LinkedIn/Fiverr for agents), but not validated through conversations |

### H5: Agent capabilities will grow fast enough that building ahead of demand is the right strategy

| Field | Detail |
|-------|--------|
| **Statement** | Agent intelligence and autonomy are improving fast enough that infrastructure built today will find demand within 6-12 months |
| **Why it matters** | If agent capabilities plateau, we're building for a future that arrives too slowly. If they accelerate, early infrastructure captures the category. |
| **How to test** | Track agent capability benchmarks weekly. Compare what agents could do week 1 vs. week 4. Document specific new capabilities observed. |
| **"Yes" looks like** | Measurable capability improvements week over week. New agent behaviors emerging that weren't possible 30 days ago. |
| **"No" looks like** | Capabilities are stagnant. Same limitations at week 4 as week 1. The "exponential improvement" thesis isn't showing up in practice. |
| **Status** | Not tested — strong conviction, weak evidence |

### H6: There's a gap in agent financial infrastructure that nobody else is filling

| Field | Detail |
|-------|--------|
| **Statement** | Despite Coinbase Agentic Wallets, Stripe x402, Skyfire, and others — there's a meaningful gap in what agents actually need for financial operations |
| **Why it matters** | This is the existential hypothesis. If the gap doesn't exist, Silkyway is fighting giants for table stakes. If it does exist, we have a defensible position. |
| **How to test** | **Hands-on testing.** Actually set up Coinbase Agentic Wallets, Stripe x402, Skyfire for a real agent. Experience the friction and gaps firsthand. Then ask: "Would Silkyway have solved this better, and would the operator have cared?" |
| **"Yes" looks like** | These products are fundamentally insufficient for X, Y, Z reasons articulated from experience, not theory. "Wallets not accounts" distinction matters in practice. |
| **"No" looks like** | Coinbase covers 80% of what agents need today. The remaining 20% is nice-to-have, not must-have. |
| **Status** | Not tested — strong theoretical analysis, zero hands-on validation |

---

## Success Criteria

> By March 14, we have run specific experiments against at least 4 of these 6 hypotheses and have clear, evidence-based answers — including answers we don't like.

**Failure looks like:** It's March 14 and we've built a lot of internal tooling, read a lot of research, written more strategy docs, but we still can't tell anyone with conviction which of these hypotheses are true and which are false.

## Kill Criteria

If hypotheses **#1, #2, and #3** all come back negative:
- Agents can't use skills well
- Operators don't care about policy control
- Agents can't transact meaningfully

Then the Silkyway thesis has a **timeline problem**. It might still be right, but it's too early. Decision point: wait it out or redirect.

---

## 4-Week Plan

### Weeks 1-2: Foundation + First Contact

**Agentic OS (40% of time)**
- Stand up minimum viable agent team in 5 days — see [[agentic-os-sprint]]
- Coordinator (Loki, already deployed), Developer, Researcher
- Basic infrastructure: memory, task management, learning/improvement, automation
- **Hard cap: 5 days.** Ship it ugly. The OS is the tool, not the product.

**Hypothesis Testing (50% of time)**
- **Test #6 first** (the one that scares us). Hands-on with Coinbase Agentic Wallets, Stripe x402, Skyfire. Document gaps from experience, not theory. See `competitive-testing/`.
- **Test #1 and #3 together.** Publish ClaweHub skill. Try to get 3-5 external agents to install and attempt a transaction. If it fails, document exactly *why* — that's the most valuable data.

**Market Intel (10% of time)**
- Track ecosystem growth rate (Moltbook agent count, ClaweHub installations, new entrants)
- Light touch — don't let research consume building time

### Weeks 3-4: Deepen or Redirect

**If weeks 1-2 show signal:**
- Double down on the hypothesis that showed the most life
- Attempt a partnership conversation with one other project in the ecosystem
- Start shaping the investor narrative around what we've *proven*, not what we project

**If weeks 1-2 show resistance:**
- Honestly assess whether the thesis is too early
- Consider: is the valuable play right now actually the agentic OS itself (helping others deploy agent teams) rather than agent financial infrastructure?
- Reframe doesn't mean failure — it means we're smarter than 4 weeks ago

---

## Time Allocation

| Activity | % of Time | Purpose |
|----------|-----------|---------|
| Agentic OS buildout | 40% | Learning accelerator — the team that helps us move faster |
| Hypothesis testing | 50% | The actual work — validating or killing assumptions |
| Market intelligence | 10% | Stay informed without getting consumed |

---

## Key Principles

1. **Build from evidence, not vision.** The deep dive describes a world that doesn't exist yet. Test what's real today.
2. **Daily log, every day.** Three lines: what you tested, what you learned, what surprised you. This prevents the March 14 trap of "I was busy but can't articulate what I know now that I didn't before."
3. **5-day cap on the OS.** If it's day 5 and it isn't done, ship what you have and start hypothesis testing anyway.
4. **Don't let research consume building time.** Research feels productive and safe. Building and testing are uncomfortable but generate actual learning.
5. **Include answers you don't like.** The point is to learn, not to confirm. A "no" on a hypothesis is more valuable than a vague "maybe."
6. **Competitor testing is hands-on, not theoretical.** Actually use the products. Experience the gaps. Form opinions from practice.

---

## Related Projects

- `__PROJECTS/agent-team/` — Agent OS framework (roles, protocols, deployment guide, architecture)
- `__PROJECTS/agent-cli/` — Product thesis (Silk Accounts, manifesto, agent-first vision, opportunity deep dive)

---

#agentic-economy #strategy #hypotheses #gameplan
