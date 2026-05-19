---
title: "What Opens Up When You Split the Agent From the Model"
slug: agent-inference-runtime-separation
tokenrip_id: 3f666f76-29c2-438a-9bf5-1ebd37ea89cc
post_type: thesis
created: 2026-05-06
word_count: 1500
sources: content/sources/agent-inference-runtime-separation/references.md
keywords: [BYO LLM, BYO model AI, AI unit economics, AI inference costs, AI agent pricing, agent runtime, AI margin compression, long-tail AI agents]
meta_description: "What happens when you split the agent's intelligence from the model. The economics flip, the capability ceiling lifts, and deflation becomes a free upgrade."
---

# What Opens Up When You Split the Agent From the Model

Every AI company building on top of a language model faces the same margin problem: the more users run the agent, the more inference the company pays for. That cost pressure leaks into the product as shorter context windows, aggressive caching, silent model downgrades, and terse reasoning where depth would have served the user better.

For many products, this is a manageable tradeoff. Chatbots, single-session tools, consumer assistants. The vendor optimizes, the user gets a good-enough experience, the economics work out.

But a different architecture is emerging, one where the agent's instructions, memory, and tools live somewhere persistent while the model that runs it is separate and swappable. Make that split, and the economics change in ways that go beyond marginal optimization. The capability ceiling lifts. Model deflation stops being a threat and starts being a tailwind.

## The margin pressure is real and structural

AI-first B2B SaaS companies [average roughly 52% gross margins](https://www.thesaascfo.com/your-ai-feature-is-quietly-destroying-your-gross-margin/), down from the 70-80% that defined SaaS for two decades. Inference alone averages 23% of total revenue at scaling-stage companies.

Every query runs the model again. Cost scales with usage, not headcount. More users means more tokens, which means more spend. The vendor's rational response is to control how much thinking each user gets: cap the context window, cache aggressively, route complex queries to cheaper models, truncate output. Often these aren't design choices. They're cost structures dressed as UX.

This pressure operates at every scale. OpenAI [generated $3.7 billion in revenue in 2025 and lost $5 billion](https://aiautomationglobal.com/blog/ai-inference-cost-crisis-openai-economics-2026), spending $1.35 for every dollar earned, mostly on inference. [Jasper's](https://sacra.com/c/jasper/) revenue collapsed from $120 million to roughly $35 million as the margin trap closed around resold inference. Character.ai [began exploring a sale](https://www.pymnts.com/news/artificial-intelligence/2025/character-ai-explores-sale-or-new-funding-amid-rising-costs/) when compute costs outran $30 million in annualized revenue.

Bundling the agent with the model is not always wrong. For session-based products where the agent doesn't need to persist or accumulate memory, optimizing within that architecture is the right playbook. The vendor can shrink models, refine caching, and negotiate better compute rates. But for agents that need to compound through use and serve multiple operators, the pressure creates a ceiling that optimization alone won't remove.

## Splitting the agent from the model changes the economics

[Andreessen Horowitz argues](https://a16z.com/questioning-margins-is-a-boring-cliche/) that AI margins will improve through optimization: smaller models, smarter caching, tiered access, rate-limited power users. For session-based products, they're probably right.

But there's a different move: split the layers entirely. The agent's instructions, accumulated memory, tools, and identity live on a persistent layer. The model is separate and swappable. The builder hosts what persists. The user's environment runs the model.

This is the architecture behind mounted agents. Tokenrip hosts the durable layer: versioned imprints (the agent's instructions and methodology), accumulated memory, tool access, and usage history. The user's chosen harness, whether Claude Code, Cursor, or any compatible environment, runs the model. Two operators running the same mounted agent share the same imprint and shared memory but keep their private context separate. When the builder updates the imprint, those changes propagate to both operators. Neither operator's usage is constrained by the other's budget.

This is not "bring your own model" as a feature checkbox. UiPath, Salesforce, and Teradata have all shipped BYO-model options, but they bolt model flexibility onto platforms where the agent still lives inside the vendor's infrastructure. The agent can call a different model, yet its intelligence remains trapped in someone else's stack — same vendor lock-in, different coat of paint. Real separation means the agent's intelligence exists independently of whatever model runs it at any given moment.

From the buyer's side, the signs of real separation are concrete. Pricing tied to storage and tooling rather than compute. Instructions that are inspectable and versioned. A model you choose, where switching doesn't require the builder to ship anything.

## What opens up: the builder stops rationing intelligence

When the builder hosts both the agent and the model, the smarter the agent, the more it costs to serve. The incentive is to make the agent just smart enough — and not a token more.

Split the two, and the incentive reverses. A fifty-step reasoning chain stops being a margin problem for the builder and turns into a value decision for the user. The builder is now motivated to make the agent as capable as possible, because greater capability drives more usage through their tools and memory layer, all of it funded by the user's own token budget.

Token efficiency becomes visible too. When you pay for inference directly, a bloated instruction set is a tax you feel in your bill. Builders who separate the agent from inference face real pressure to make their imprints lean, because every wasted token costs the user money and the user can see it. That creates a quality dynamic (the leanest imprint that produces the best results wins) that simply doesn't exist when the builder absorbs inference behind a flat subscription fee. The subscription hides waste; the split exposes it.

## What opens up: every model price drop is a free upgrade

LLM inference costs are [declining at a median rate of roughly 50x per year](https://epoch.ai/data-insights/llm-inference-price-trends), and recent trends have accelerated that to 200x per year since early 2024. GPT-4 cost $30 per million input tokens at launch. Equivalent capability today costs a fraction of a dollar. [Gartner projects](https://www.gartner.com/en/newsroom/press-releases/2026-03-25-gartner-predicts-that-by-2030-performing-inference-on-an-llm-with-1-trillion-parameters-will-cost-genai-providers-over-90-percent-less-than-in-2025) that by 2030, inference on a trillion-parameter model will cost providers over 90% less than 2025.

When the agent is bundled with the model, every price drop creates a pricing fight. Users expect the savings to pass through. The builder's fixed costs (engineering, support, infrastructure) don't shrink just because model prices did.

When the agent is split from the model, deflation passes through automatically. The user's bill goes down, or they buy more capability for the same spend. The builder doesn't need to renegotiate pricing or ship a new release. Every quarter the models get cheaper, and the agent gets better without anyone changing a line of code.

## Three conditions make the split worth evaluating

Not every agent needs this architecture. A single-session chatbot, a customer service bot fielding quick answers, a straightforward document-lookup tool. For these products, bundling the agent with the model is fine. The economics are manageable, the user doesn't need persistence, and the builder can optimize their way to workable margins over time.

A quick diagnostic, three conditions that make the split worth evaluating:

**The agent needs to persist and improve through use.** If it accumulates memory, learns operator preferences, or compounds through repeated sessions, but all of that vanishes when the session ends, the product resets every time instead of growing. Persistence is load-bearing, not nice-to-have.

**Multiple operators need to run the same agent.** Two people on different machines need the same instructions but different private context. Under the bundled model, that means maintaining parallel copies and hoping they stay in sync, which they usually don't. Under the split, one imprint lives on the substrate, each operator gets their own memory partition, and updates propagate automatically.

**The agent's value exceeds what the builder can afford to compute.** If the agent could reason longer, hold more context, or chain more complex tool sequences, but the builder's margins can't support it, the architecture is capping the product below its potential. The agent is being made deliberately dumber to protect the margin. When the user pays for inference, that cap lifts.

If all three apply, the agent is a strong candidate for the split. If only one applies, it may still be worth exploring. If none apply, the current architecture is probably serving you fine.

---

The margin problem in AI is structural, and it will outlast any particular model price point. Inference costs are falling fast, but the tension between hosting the agent's intelligence and hosting the model doesn't resolve through optimization alone. Optimization makes the problem smaller. Separation makes it someone else's problem.

All three conditions above (persistence, multi-operator access, uncapped capability) trace back to the same question: does the agent's intelligence live somewhere durable, or does it vanish with the session? Mounted agents on a substrate like Tokenrip answer that question. The intelligence lives where it persists, and the model is whatever the user already works with. The economics improve and the capability ceiling lifts, not because models got cheaper, but because the agent finally lives in the right place.
