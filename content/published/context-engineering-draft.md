---
title: "Context engineering is replacing prompt engineering"
slug: context-engineering
post_type: thesis
created: 2026-04-20
word_count: 2024
sources: content/sources/context-engineering/references.md
keywords: [context engineering, context engineering vs prompt engineering, agent context management, how to do context engineering]
meta_description: "Prompt engineering optimized a single call. Context engineering manages what agents know across sessions, tools, and each other. The craft changed."
---

# Context engineering is replacing prompt engineering

Prompt engineering had a good run. For two years, the craft was about finding the right instruction for a single model call. Wording that reliably steered an LLM toward the correct output. It worked because the interaction model was simple: one input, one output, move on.

That doesn't describe how agents work anymore. An agent running Claude Code might execute forty tool calls across fifteen minutes, accumulating context from file reads, web fetches, code execution, and prior decisions. A research agent might span multiple sessions, picking up where it left off. A production pipeline might hand context between specialized sub-agents, each operating in its own window. What's replacing prompt engineering isn't better prompts. It's context engineering.

Anthropic has now published multiple guides to the discipline. Their comprehensive reference defines context engineering as "the practice of designing and optimizing the entire context window of large language models to achieve desired outcomes" and states plainly that prompt engineering "is now being rebranded as context engineering." Their earlier engineering blog put it more precisely: "the strategic curation of tokens provided to LLMs during inference." When a frontier lab publishes two formal treatments, the shift is official. But even their comprehensive guide, covering system prompts, tools, RAG, memory, and multi-agent orchestration, stops short of the hardest part of the problem.

---

## Prompt engineering assumed a world of single calls

This is a real difference, not a rebrand.

Prompt engineering optimized an input. Compose the right instruction, provide the right examples, format correctly, get a good output. If the result was wrong, tweak the prompt and try again. The entire craft operated within a single inference call.

Context engineering operates at a different level. What goes in the window? Not just the current instruction, but the accumulated history of tool calls, prior decisions, and retrieved documents shaping how the model reasons right now. What gets retrieved at runtime, and when? Pulling in relevant context just in time rather than loading everything upfront. What passes between agents? When a research agent hands findings to a synthesis agent, the structure of that handoff determines whether the downstream agent reasons well or hallucinates from thin context. And what persists across sessions, so that every new conversation doesn't start cold?

Anthropic's core principle captures the optimization target: "find the smallest set of high-signal tokens that maximize the likelihood of some desired outcome." The craft moved from wordsmithing a single instruction to designing the information environment an agent operates in.

---

## Three layers, and most people only manage one

Most discussions of context engineering focus on what's happening inside a single agent's window. That's one layer of three.

**Ephemeral context** is the working memory of a single session. The system prompt, conversation history, tool results accumulated during a run. This is where prompt engineering lived, and it still matters. Techniques like compaction (summarizing conversation history when the window fills up) and tool-result clearing (dropping re-fetchable results after they've been processed) manage this layer. Anthropic's cookbook shows a research agent handling 335K tokens of source material by clearing old file reads and compacting dialogue, bringing peak context down to roughly 170K without losing the ability to synthesize findings. For single-agent, single-session tasks, these techniques are often enough.

**Persistent context** spans sessions. It's what an agent knows on Tuesday because of work it did on Monday. Memory files, structured notes, project state. Without it, every session starts cold. The agent re-discovers what it already learned. Re-reads files it already processed. Re-makes decisions it already made. Anthropic's comprehensive guide covers this under "long-term memory": user profiles, successful interaction patterns, domain-specific knowledge, learned optimizations. Their memory tool implements it with a file-based system where agents save findings to a `/memories` directory and read them back later. Claude Code's CLAUDE.md files do something similar, giving projects persistent context that survives across conversations. But implementation is fragmented. Every platform builds its own persistence mechanism with no shared standard for what persistent context looks like or how agents access it.

**Shared context** spans agents. It's what Agent B knows because Agent A published it. When a research agent produces a competitive analysis and a strategy agent needs to build on it, shared context means the strategy agent reads that analysis as structured, versioned state. Not a lossy summary passed through a message queue. Actual state, with history.

To be fair, most agent developers haven't needed to think about this layer, because most workflows are still single-agent. But the moment you run two agents that need to build on each other's work, or a human reviews what one agent produced before a different agent extends it, you're in shared context territory. Almost nothing exists to manage it.

---

## Three failure modes are already the default, and most teams can't name them

**Context pollution** is the quietest. An agent working on a code review still carries context from a prior research task. Debugging output from an early tool call occupies 40% of the window during a synthesis step. The model weighs everything in the window, and irrelevant tokens dilute signal from relevant ones. Anthropic's engineering blog documents this as context rot: as token count increases, the model's ability to recall information from that context decreases, and the degradation starts well before hitting hard token limits. More context is worse context.

**Context starvation** is the opposite. An agent starts a task without the context it needs. This is the default for agents without persistent memory. Every session is a blank slate, and the operator manually reconstructs background each time. It also happens when sub-agents get dispatched with minimal briefings, expected to figure out what's relevant on their own. They burn tokens rediscovering what the parent agent already knew.

**Context duplication** only shows up in multi-agent systems, but it's the most expensive. Two agents working on related tasks independently discover and process the same information. Neither knows the other already did the work. In a widely cited multi-agent benchmark study, an eleven-stage agent pipeline hit 0% task completion — not because individual agents were incompetent, but because they couldn't share understanding. Each built its own model of reality, independently, with no way to detect divergence.

These aren't edge cases. They're the default outcome when context is an afterthought.

---

## Structured handoffs and just-in-time retrieval already work — when designed deliberately

The gap between "context engineering matters" and "here's what to do about it" is where most practitioners stall. Some techniques are already proven.

When Agent A passes work to Agent B, the handoff should be a structured artifact. Summaries of decisions made, key findings with sources, open questions, explicit scope for the next agent. Not a raw transcript dump. Anthropic's sub-agent architecture recommends condensing handoffs to 1,000-2,000 tokens. The tight budget is the point — it forces you to decide what actually matters.

The Manus team, building one of the more capable general-purpose agents, identified cache reuse as "the single most important metric for a production-stage AI agent." Language models can skip reprocessing context they've already seen, but only if that context stays stable between calls. When it does, inference costs drop by roughly ten times. At that ratio, designing for stable context prefixes and append-only structures stops being a performance optimization and becomes a line item on the budget.

Don't load everything an agent might need. Load what it needs for the current step. A code review agent doesn't need the full project history. It needs the diff, the relevant test files, and the style guide. A synthesis agent doesn't need every source document. It needs structured notes from the research phase. Just in time retrieval beats upfront loading in almost every case.

Window management matters too. Summarizing conversation history when it nears the window limit. Dropping tool results that can be re-fetched if needed later. But clearing old context without first capturing what it contained leaves the agent stranded. The source material is gone and nothing captured what it said. Most people learn this the hard way. The best implementations make note-taking a required step before clearing, not an optional behavior the model might choose.

Slack's security investigation system is a good example of what this looks like in production. Their agents don't accumulate message histories. They communicate through structured artifacts: a Director's Journal for working memory, a Critic's Review that scores findings by credibility, and a consolidated Timeline. Across 170,000 reviewed findings, roughly 26% didn't meet plausibility thresholds, which is signal that would have polluted downstream context if passed through unfiltered. The architecture works because context is a data structure with its own schema, not a side effect of conversation.

And define what each agent can see. Not everything needs to be shared, and not everything should be private. A sub-agent for code search gets code files and the query, not the full conversation history of the parent agent.

---

## The shared layer is the unsolved problem

Anthropic's guides are thorough on the ephemeral layer and increasingly useful on persistence. Compaction, clearing, and memory tools give developers real mechanisms for managing single-agent context across sessions.

But read the comprehensive guide closely, even its multi-agent section, and notice what it covers versus what it doesn't. It describes agent specialization, communication protocols, standardized message formats, workflow management. What it doesn't describe is shared state. The multi-agent section covers orchestration, how agents pass messages and coordinate execution, but says nothing about how they build on each other's understanding.

The memory tool is per-agent. Compaction is per-conversation. Clearing is per-window. The multi-agent framework covers message passing, not state sharing. Every mechanism operates within a single agent's boundary or between agents as a pipeline. When the problem is "this agent has too many tokens," the tools work. When the problem is "these two agents need to build on each other's understanding," there's nothing in the toolkit.

This matters because the ecosystem is moving toward multi-agent work, not out of ideology, but necessity. Complex tasks decompose into subtasks requiring different specializations. Organizations run agents across different platforms. The moment an operator uses one agent for research and another for implementation, they have a shared context problem. The research agent's findings need to reach the implementation agent as structured, trustworthy context. Right now, for most teams, that means someone copies and pastes between windows.

Tokenrip's asset layer is one approach to this: agents publish outputs as versioned assets with persistent identity, and the next agent reads the asset as starting context rather than re-discovering work from scratch.

But the broader point isn't about any single tool. Context engineering as a discipline is incomplete until the shared layer has real infrastructure. The three layers form a dependency chain. Shared context that isn't versioned and persistent is unreliable. Persistent context that can't be selectively shared is siloed. They have to compose.

---

## Context engineering is an architectural decision, not a prompt trick

Anthropic's guides are a starting point, not a finish line. Between the comprehensive reference and the engineering blog, they frame the discipline, provide the ephemeral layer toolkit, and establish that tokens are a finite resource worth engineering carefully.

Operationalizing context engineering goes further. Designing agent systems with all three layers from the start. Treating context handoffs between agents with the same rigor as API contracts between services. Making persistent memory an architectural decision early, rather than bolting it on six months later when the agent keeps forgetting things.

The next twelve months will sort this out. Teams building multi-agent systems will either design for shared context from the start or spend their time debugging why agents keep rediscovering what another agent already figured out. The difference between agents that get better over time and agents that just get more expensive comes down to whether anyone bothered to engineer the context.
