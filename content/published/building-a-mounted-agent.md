---
title: "How We Built Chief of Staff as a Mounted Agent"
slug: building-a-mounted-agent
tokenrip_id: 35bad810-90be-45fa-bc42-4ed9f2d05168
post_type: craft
series: 3
post_number: 12
created: 2026-05-07
word_count: 2445
sources: content/sources/building-a-mounted-agent/references.md
keywords: [building a mounted agent, portable AI agent, AI agent architecture, deploying AI agents, agent memory architecture, chief of staff agent, multi-operator AI agents]
meta_description: "We built an agent that doesn't live on our servers. Three memory layers, two operators, one imprint. Here's the architecture and what surprised us."
---

# How We Built Chief of Staff as a Mounted Agent

The agent we'd been running locally for weeks was good. It knew our goals, tracked commitments, asked hard questions. Then we tried to give our co-founder access and hit the wall every team hits: the agent lived on one machine, in one person's context, with no way to share the intelligence without sharing the entire session. Clone the prompt? He'd get the instructions but none of the accumulated context. Run it as a hosted service? Now we're paying for inference and building a SaaS we don't want to maintain.

So we built it differently. We separated the agent's durable parts (instructions, memory, tools) from the runtime that executes them, and published them to a shared substrate. Two operators now mount the same agent from different machines. They share team context, keep their private context separate, and neither operator's usage costs us a dollar in inference. We call the durable instruction layer the *imprint*, the execution environment the *harness*, and the persistent context the *memory*. A mounted agent stores its imprint and memory on a substrate and loads into whatever harness the operator prefers: Claude Code, Cursor, ChatGPT, anything compatible.

The architecture worked. What surprised us was how much the agent changed once the runtime became replaceable. It stopped feeling like a tool and started feeling like a product.

## Sharing the agent broke it, so we rebuilt the architecture

The brief: build a Chief of Staff. An agent that runs weekly accountability reviews, holds organizational context across sessions, learns each operator's working patterns, and works for two co-founders on different machines. It needed to know what each person committed to, track what actually happened, surface patterns both operators were too close to see, and cross-reference decisions between them.

The obvious answer is to stand up a SaaS product. Host inference, build a dashboard, store memory in a database the user can't inspect. You get linear cost growth per user, a frontend to maintain, and memory locked in a vendor's infrastructure. We'd be building another cloud agent with the same ceiling we'd spent [two posts](/s/cloud-agent-ceiling) [arguing against](/s/agent-inference-runtime-separation).

We went the other way. Publish the agent's intelligence as durable assets on a shared substrate. Provision persistent memory the agent reads and writes to across sessions. Write a thin startup script that fetches the imprint at runtime. Each operator runs the model on their own machine, with their own token budget. The agent lives on the substrate; execution is disposable and replaceable.

## Three layers, each stored where it belongs

The imprint is six Tokenrip assets, each independently versioned. A persona asset defines the voice and methodology (direct, pressure-tests assumptions, no fluff, asks the questions a real Chief of Staff would ask). An intake-flow asset handles structured onboarding in two phases. A Friday Review asset defines the weekly accountability ritual. A methodology asset captures heuristics for slippage detection and pattern recognition. A memory-schema asset defines the structure of all three memory collections. And a cross-session-rules asset specifies when and how the agent references one operator's context in the other's session.

Six assets instead of one because each evolves independently. The persona doesn't change when the Friday Review template improves. Mode-specific loading keeps the context budget lean: an intake session doesn't load review instructions, and a review session doesn't load intake questions.

The memory is three Tokenrip collections, each with a different access scope. A shared team-context collection holds company goals, timelines, decisions, resources, and processes. Both operators read and write to it. Two private collections, one per operator, hold personal commitments, working style, slippage patterns, and preferences. Only the owning operator's sessions touch their private collection directly.

Cross-session references are where this gets interesting. The agent can reference items from one operator's private collection during the other operator's session, paraphrased rather than quoted. Say one co-founder made a decision about the fundraising pitch. That shows up in the other's session as context for aligning outreach messaging. The reference surfaces because it's relevant. Visibility is scoped, not blanket.

The harness is a twenty-line startup script in Claude Code, a thin file that fetches the real instructions at runtime. It holds machine-specific config: which operator is running, API credentials, local paths. It routes by mode based on arguments, and at runtime it fetches the imprint assets and reads the relevant memory collections. The shape looks like this:

```
operator: simon
modes:
  intake  → fetch persona + intake-flow + memory-schema + cross-session-rules
  review  → fetch persona + friday-review + methodology + cross-session-rules
  session → fetch persona + methodology + cross-session-rules
always:
  read team_context + {operator}_private
  check other operator's flagged items for cross-session relevance
```

When the imprint improves, the bootloader doesn't change. It still points at the same asset aliases. The new version loads automatically next session.

## The design choices that made it shippable

Some of these only became obvious after ruling out the alternatives.

**Layered memory over commons or partitioned.** Three memory models were on the table. A commons model shares everything, all operators reading and writing to one pool. Maximum learning, but private context leaks and trust collapses. A partitioned model gives each operator their own silo, clean for privacy but the agent never learns from collective use. We went with the layered model: shared patterns in a team collection, private context in per-operator collections, with selective cross-session references bridging them. The agent learns from both operators while keeping each person's working patterns, blind spots, and personal goals private.

This mattered more than any other decision. Custom GPTs are per-user by definition. Claude Projects are per-workspace. Nothing in the current ecosystem ships team-level shared context alongside operator-private memory with controlled cross-session surfacing. The implementation is just three collections and a referencing rule, but the abstraction it creates hasn't shipped anywhere else.

**Several small imprint assets, not one large one.** The instinct is to publish one comprehensive instruction file. Six smaller assets turned out better: each loads only when relevant (saving context window space), each versions independently (the persona doesn't need a new version when the review template changes), and each can be swapped or improved without touching the others. An intake session loads the persona, intake-flow, memory-schema, and cross-session-rules. A Friday Review loads the persona, friday-review, methodology, and cross-session-rules. The overlap is intentional (persona and cross-session rules are always present), but each session avoids loading instructions it doesn't need.

**Friday Review as a ritual, not a feature.** The weekly review is a structured conversation the agent runs, not a report it generates. It walks through each operator's commitments from last week, asks what happened, logs outcomes, surfaces patterns, checks alignment between co-founders, and establishes next week's commitments. This matters because a ritual produces data. Every Friday Review populates the memory collections with commitment-outcome pairs, slippage observations, and team-level patterns. Without the ritual, you have three empty collections. With it, you have a growing record of how a team actually operates.

## The build was fast. The schema design was the hard part.

The actual build took one extended working session. The persona, voice, and accountability framework already existed as local files nobody else could access. Publishing them as versioned, fetchable assets was mechanical. The intake flow, review ritual, and memory schema were new, and the schema is where most of the design thinking went.

Each collection needs typed fields that make cross-session referencing possible. The team-context collection classifies entries by type (company, goal, timeline, decision, resource, process) along with the source operator, timestamp, and status. The private collections add a cross-session flag, a single boolean per item that controls whether the agent can reference it in another operator's session:

```
team_context:
  field_type: enum [company, goal, timeline, decision, resource, process]
  value: text
  source_operator: string
  status: enum [active, archived, superseded]

{operator}_private:
  field_type: enum [context, goal, commitment, decision, slippage, preference]
  value: text
  cross_session_flag: boolean
  status: enum [active, archived, superseded]
```

Getting the flag scoping right took iteration. The first version flagged too aggressively. Nearly every decision and timeline update got marked as cross-session relevant, which flooded the other operator's sessions with context they didn't need. The fix was narrowing the flag to items where the other operator would actually act on the information: strategic shifts, deadline changes, resource commitments that affect shared work. Everything else stays private unless explicitly flagged.

The second operator's onboarding surfaced a different problem. The agent recognized that team context already existed and asked: "Here's what I know about the team from the other intake, anything to add or correct?" One confirmation, then straight to personal context. But the second operator's answers sometimes contradicted the first operator's team context entries. The agent didn't have reconciliation logic, so it stored both versions. We haven't fully closed that gap. For now, the Friday Review catches misalignment, but automatic conflict resolution between team-context entries from different operators is a v1 problem.

The first Friday Review ran that weekend. The agent pulled commitments from both operators' private collections, walked through each person's week, logged outcomes, and identified two patterns neither of us had surfaced verbally. It published a structured review artifact with a shareable URL. Six assets, three collections, one bootloader file, and two real problems we're still working on.

## The imprint shrank once memory had a home

The imprint we shipped is smaller than the agent we had been running locally.

Before the build, the local agent's instruction set was bloated. It was stuffed with context that existed nowhere else: working style preferences, company background, decision history, relationship context, all jammed into the system prompt because there was no other place to put it.

Once memory had a real home, structured collections the agent could read and write to across sessions, most of that scaffolding became unnecessary. The agent didn't need instructions telling it about the company's fundraising timeline because the team-context collection held the timeline. It didn't need a paragraph about each operator's working preferences because the private collections held those. The system prompt shrank to methodology and voice. The facts moved to memory where they belonged.

We're not the only ones seeing this. [XMemory's approach](https://venturebeat.com/orchestration/how-xmemory-cuts-token-costs-and-context-bloat-in-ai-agents/) attacks the same problem. [Practitioners are now recommending](https://medium.com/data-science-collective/why-long-system-prompts-hurt-context-windows-and-how-to-fix-it-7a3696e1cdf9) no more than 5-10% of the context window for the system prompt, and many production agents blow past that by a factor of three or more. Cloud agents are bloated with prompt scaffolding because they have nowhere else to put state. When state has a persistent home, the instructions shrink, the context budget opens up for actual reasoning, and the operator's token bill drops.

## Cross-session references are where it stops feeling like a chatbot

The second operator runs the agent from a different machine. Same imprint version, same shared team context, different private memory. The Friday Review runs the same structured process and accumulates the same way, but each operator's data stays in its own collection.

Cross-session referencing is where the complexity pays for itself. One operator asks about aligning messaging for an upcoming deadline. The agent responds with its own analysis and mentions that the other operator discussed a related strategic shift in their last session. Not a quote. A paraphrase, flagged as cross-session context, relevant to the question being asked. The agent connects dots between two people's working sessions without either person having to relay the information manually.

From the outside, it looks like a single product with two users. It runs on two machines, on two operators' token budgets, and neither operator's usage is constrained by the other's or by ours. The platform hosts six assets and three collections. The operators host everything else.

## What you actually have to decide

If you're building an agent that needs to serve more than one person or survive more than one session, these are the decisions that matter.

**Where does the imprint live?** Instructions in a local file or a vendor textbox can't be versioned, shared, or updated without manual sync. Publish them to a fetchable, versioned surface, even if that surface is just a git repository to start. The bootloader pattern (a thin local file that fetches the real instructions at runtime) works well for this.

**What memory survives the session?** If nothing persists, every session starts cold. Figure out what's durable (operator preferences, accumulated context, decision history) and put it in structured, persistent storage the agent reads at session start. If the agent serves multiple operators, decide what's shared and what's private before you build. Retrofitting access scopes is painful.

**How many instruction assets?** One monolith loads everything every session, burns context budget on irrelevant instructions, and forces a full version bump for any change. Decompose by mode or function. Each asset loads only when relevant, versions independently, and keeps the context lean.

**What's the recurring interaction?** An agent without a ritual is a tool you'll forget about. A weekly review, daily brief, or intake cycle produces the structured data that makes memory useful over time. Design the ritual before you design the memory schema, because the ritual determines what gets stored.

**Who runs the model?** Hosting inference means your costs scale with usage and you're incentivized to cap capability. If the operator brings their own model, capability becomes their decision, your costs stay flat, and every model price drop is a free upgrade for every operator. This isn't a billing question. It changes what the agent can afford to think about.

You don't need to ship all five at once. But the ones you defer define the ceiling on what the agent can become, and the ones you get right early compound fastest.

---

These five decisions are separable, but they point at the same question: does the agent's intelligence live somewhere durable, or does it disappear when the session ends?

Building Chief of Staff pushed us toward durable on every axis. The instructions were the same methodology we'd been running locally for weeks. What changed was everything around them. Memory persisted. Context accumulated across sessions. The agent started connecting information between two people who weren't in the same room. The imprint didn't get smarter. The agent did, because it finally had somewhere to put what it learned.

The instructions are a seed. The memory, the ritual-generated data, the cross-session connections, that's the product. The gap between a mounted agent and a demo with a good system prompt is everything that grows after the first session ends.
