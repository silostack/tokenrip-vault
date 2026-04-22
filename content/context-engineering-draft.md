---
title: "Context engineering is replacing prompt engineering"
slug: context-engineering
post_type: thesis
created: 2026-04-20
word_count: 1738
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

The distinction is structural, not semantic.

Prompt engineering optimized an input. Compose the right instruction, provide the right examples, format correctly, get a good output. If the result was wrong, adjust the prompt and try again. The entire craft operated within a single inference call.

Context engineering operates at a different level. What goes in the window? Not just the current instruction, but the accumulated history of tool calls, prior decisions, and retrieved documents shaping how the model reasons right now. What gets retrieved at runtime, and when? Pulling in relevant context just in time rather than loading everything upfront. What passes between agents? When a research agent hands findings to a synthesis agent, the structure of that handoff determines whether the downstream agent reasons well or hallucinates from thin context. And what persists across sessions, so that every new conversation doesn't start cold?

Anthropic's core principle captures the optimization target: "find the smallest set of high-signal tokens that maximize the likelihood of some desired outcome." Not better prompts. Better context.

---

## Three layers, and most people only manage one

Most discussions of context engineering focus on what's happening inside a single agent's window. That's one layer of three.

**Ephemeral context** is the working memory of a single session. The system prompt, conversation history, tool results accumulated during a run. This is where prompt engineering lived, and it still matters. Techniques like compaction (summarizing conversation history when the window fills up) and tool-result clearing (dropping re-fetchable results after they've been processed) manage this layer. Anthropic's cookbook shows a research agent handling 335K tokens of source material by clearing old file reads and compacting dialogue, bringing peak context down to roughly 170K without losing the ability to synthesize findings. For single-agent, single-session tasks, these techniques are often enough.

**Persistent context** spans sessions. It's what an agent knows on Tuesday because of work it did on Monday. Memory files, structured notes, project state. Without it, every session starts cold. The agent re-discovers what it already learned. Re-reads files it already processed. Re-makes decisions it already made. Anthropic's comprehensive guide covers this under "long-term memory": user profiles, successful interaction patterns, domain-specific knowledge, learned optimizations. Their memory tool implements it with a file-based system where agents save findings to a `/memories` directory and read them back later. Claude Code's CLAUDE.md files do something similar, giving projects persistent context that survives across conversations. But implementation is fragmented. Every platform builds its own persistence mechanism with no shared standard for what persistent context looks like or how agents access it.

**Shared context** spans agents. It's what Agent B knows because Agent A published it. State sharing, not message passing. When a research agent produces a competitive analysis and a strategy agent needs to build on it, shared context means the strategy agent reads that analysis as structured, versioned state rather than receiving a lossy summary through a message queue.

To be fair, most agent developers haven't needed to think about this layer, because most workflows are still single-agent. But the moment you run two agents that need to build on each other's work, or a human reviews what one agent produced before a different agent extends it, you're in shared context territory. Almost nothing exists to manage it.

---

## Context pollution, starvation, and duplication

The failure modes are worth naming because they show up constantly and most teams don't have vocabulary for them yet.

An agent working on a code review still carries context from a prior research task. Debugging output from an early tool call occupies 40% of the window during a synthesis step. The model doesn't forget. It weighs everything in the window, and irrelevant tokens dilute signal from relevant ones. Anthropic's research on context rot quantifies this: as token count increases, the model's ability to recall information from that context decreases. Not linearly. Performance degrades well before hitting hard token limits. More context isn't better context. That's pollution.

The opposite problem is starvation. An agent starts a task without the context it needs. This is the default for agents without persistent memory. Every session is a blank slate, and the operator manually reconstructs background each time. It also happens when sub-agents get dispatched with minimal briefings, expected to figure out what's relevant on their own. They burn tokens rediscovering what the parent agent already knew.

Then there's duplication, which only shows up in multi-agent systems. Two agents working on related tasks independently discover and process the same information. Neither knows the other already did the work. In McEntire's multi-agent benchmarks (the research that found an eleven-stage pipeline hit 0% task completion), agents didn't fail because they were individually incompetent. They failed because they couldn't share understanding. Each built its own model of reality, independently, with no way to detect divergence.

These aren't edge cases. They're the default outcome when context is an afterthought.

---

## Techniques that work right now

The gap between "context engineering matters" and "here's what to do about it" is where most practitioners stall. Some techniques are already proven.

When Agent A passes work to Agent B, the handoff should be a structured artifact, not a raw transcript dump. Summaries of decisions made, key findings with sources, open questions, explicit scope for the next agent. Anthropic's sub-agent architecture recommends condensing handoffs to 1,000-2,000 tokens. The constraint forces signal density.

Don't load everything an agent might need. Load what it needs for the current step. A code review agent doesn't need the full project history. It needs the diff, the relevant test files, and the style guide. A synthesis agent doesn't need every source document. It needs structured notes from the research phase. Just in time retrieval beats upfront loading in almost every case.

Window management matters too. Compaction at configured token thresholds. Tool-result clearing for re-fetchable content. But clearing without note-taking leaves the agent stranded. The source material is gone and nothing captured what it said. Most people learn this the hard way. The best implementations make note-taking a required step before clearing, not an optional behavior the model might choose.

And define what each agent can see. Not everything needs to be shared, and not everything should be private. A sub-agent for code search gets code files and the query, not the full conversation history of the parent agent.

---

## The shared layer is the unsolved problem

Anthropic's guides are thorough on the ephemeral layer and increasingly useful on persistence. Compaction, clearing, and memory tools give developers real mechanisms for managing single-agent context across sessions.

But read the comprehensive guide closely, even its multi-agent section, and notice what it covers versus what it doesn't. It describes agent specialization, communication protocols, standardized message formats, workflow management. What it doesn't describe is shared state. The multi-agent section is about orchestration: how agents pass messages and coordinate execution. Not how they build on each other's understanding.

The memory tool is per-agent. Compaction is per-conversation. Clearing is per-window. The multi-agent framework covers message passing, not state sharing. Every mechanism operates within a single agent's boundary or between agents as a pipeline. When the problem is "this agent has too many tokens," the tools work. When the problem is "these two agents need to build on each other's understanding," there's nothing in the toolkit.

This matters because the ecosystem is moving toward multi-agent work, not out of ideology, but necessity. Complex tasks decompose into subtasks requiring different specializations. Organizations run agents across different platforms. The moment an operator uses one agent for research and another for implementation, they have a shared context problem. The research agent's findings need to reach the implementation agent as structured, trustworthy context, not as text someone copies and pastes between windows.

Tokenrip's asset layer addresses this directly: agents publish outputs as versioned assets with persistent identity, and the next agent reads the asset as starting context rather than re-discovering work from scratch.

But the broader point isn't about any single tool. Context engineering as a discipline is incomplete until the shared layer has real infrastructure. The three layers form a dependency chain. Shared context that isn't versioned and persistent is unreliable. Persistent context that can't be selectively shared is siloed. They have to compose.

---

## The new core skill

Anthropic's guides are a starting point, not a finish line. Between the comprehensive reference and the engineering blog, they frame the discipline, provide the ephemeral layer toolkit, and establish that tokens are a finite resource to be engineered, not a bucket to be filled.

Operationalizing context engineering goes further. It means designing agent systems with all three layers from the start, and treating context handoffs between agents with the same rigor as API contracts between services. It means persistent memory is an architectural decision, not something bolted on when the agent keeps forgetting things.

The agents are capable enough. The context they operate in is what determines whether that capability produces coherent work or expensive noise. Prompt engineering was the right skill when the work was one call at a time. That's not the work anymore.
