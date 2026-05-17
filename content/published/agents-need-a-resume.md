---
title: "Agents Need a Resume, Not a Session Log"
slug: agents-need-a-resume
tokenrip_id: d58b9af3-1dcc-42fd-890a-9950a2b54941
post_type: thesis
created: 2026-04-28
---

# Agents Need a Resume, Not a Session Log

Every agent memory system being built right now is a session log. It captures everything. It ages poorly. It doesn't travel. That's the wrong primitive.

This isn't a problem with execution — the teams building these systems are doing careful work. [LangChain's memory framework](https://www.langchain.com/blog/memory-for-agents) distinguishes between procedural, semantic, and episodic memory. [Letta](https://letta.com/blog) has published more on agent memory architecture than almost anyone. [Mem0](https://docs.mem0.ai/overview) is solving prompt bloat and cross-session persistence. The field is moving. But the shared assumption underneath all of it is the problem: memory lives inside the agent's context pipeline, organized around sessions. The session log is the atom, and everything else is compression.

That assumption worked when agents handled discrete tasks in isolation. It breaks as soon as agents run longer, work in parallel, or hand off to other agents. The symptoms are familiar to anyone running production pipelines: context costs that compound with task length, handoffs that drop state, session logs too large to pass cleanly between agents and too dense to audit by hand. These aren't edge cases. As agent workloads scale, they become the default failure mode. The industry is optimizing the wrong primitive.

## The session log is a transcript, not a memory

What is a session log, actually? It's a timestamped record of everything that happened in a conversation: inputs, outputs, tool calls, model responses. Append-only. Full-fidelity. Every token preserved.

That's a transcript. It's useful for auditing, debugging, compliance. It is not memory in any meaningful sense. A transcript of your last five meetings doesn't help you do your job faster — it just adds to the pile you have to search through.

The memory systems being built today are largely transcript management systems: better compression, smarter retrieval, tiered in-context and out-of-context stores. LangChain routes memory to vector databases. Mem0 reduces prompt bloat by de-duplicating what gets injected back into context. Letta introduced memory blocks that let agents write explicitly to persistent stores, and more recently context repositories that apply git-style versioning to agent memory. These are real improvements. But they're improvements to transcript management, not departures from it.

The underlying mental model remains: capture the session, summarize the session, retrieve from the session, inject back into the next session. The session is still the unit. If your agent loses thread between sessions despite having retrieval configured, you're not hitting a retrieval problem. You're hitting this one.

## Why logs fail as agents scale

Session logs have three structural problems that get worse, not better, as workloads scale.

**They grow without bound.** Episodic memory — the record of what an agent did — is append-only by nature. Yesterday's session becomes this week's context. This week becomes this month's. Compression helps at the margins; it doesn't solve the growth problem. A long-running agent accumulates context the way a hard drive accumulates temp files. Useful things are in there, buried.

**They're hostile to context windows.** Every major lab is racing to extend context windows, and that's a partial answer. But a longer context window doesn't make an inefficient memory structure efficient — it just delays the reckoning. When the input is a 200,000-token session dump, the model still has to find the relevant 500 tokens. Attention is not free. Signal-to-noise degrades.

**They don't travel.** A session log is intimate with its origin. It was produced by a specific agent, in a specific framework, during a specific run. Sharing it means sharing everything, not just the signal but the noise. If you want another agent to continue the work, it has to replay the context. There's no clean handoff point, no "here's what you need to know" — just "here's everything that happened, good luck."

This last problem is the one that's starting to hurt. Multi-agent architectures are becoming the default for any non-trivial autonomous task. Orchestrators spawn workers. Workers produce output that feeds other workers. The context graph grows fast. Shipping entire session logs through that graph is like forwarding a 500-message email thread: technically the information is there, but nobody actually reads it.

## What a human carries between jobs

Think about what a person takes when they move from one job to the next. Not meeting transcripts. Not Slack exports. Not a raw log of their past three years of work activity.

They take a resume. A curated artifact, structured, versioned, written to be legible to someone who wasn't there. It says: here's what I was responsible for, here's what I built, here's how it went, here's what I learned. It's not comprehensive. It's selective. The curation is the work.

Agents don't have an equivalent of that.

Not a better compression algorithm for session logs, not smarter retrieval from an episodic store. A different artifact entirely — one that agents write deliberately, at task completion, and that can be read by anyone without access to the original session.

The resume analogy holds up on every axis. A resume is updated, not appended: when you take on a new project, you don't tack raw notes onto it — you revise it to reflect what changed. It travels without its context — you hand it to a recruiter who has no idea what your previous organization looked like, and it communicates anyway. And it's addressable: a document you can point to, share, link.

An agent resume would have the same properties. Written by the agent at the end of a meaningful unit of work. Structured around decisions made, outputs produced, open questions, things tried and discarded. Updated when something changes, not appended to continuously. Shareable via link, readable without session replay.

## What it looks like in practice

The structure of an agent resume is not a summary of the session transcript. It's a different kind of document.

A task-completion resume covers four things: what was decided and why, what was produced (with pointers to outputs), what's still open, and what changed in the agent's model of the problem — not just what it did, but what it learned. That last category is the part most memory systems miss entirely. Not the actions; the updates.

This isn't a heavy artifact. A well-formed agent resume for a two-hour task might be a page, 400 to 600 words, structured, human-readable. The discipline is in what it leaves out. The session transcript might be 80,000 tokens; the resume is 500. That compression ratio isn't a loss of information — it's a signal that someone (the agent) made judgment calls about what mattered.

Versioning matters here too. Not every update needs to be tracked, but major state changes should be. The third version of an agent resume is more useful than the first because it shows what shifted — decisions that looked right in version one that didn't hold up in version three. That delta is operationally valuable. A session log gives you neither.

Then there's addressability. An agent resume needs to be a thing you can point to: a stable URL, a named asset, something that doesn't require access to the original session or the original framework to read. A session log lives inside the pipeline that produced it. A resume can live anywhere.

## Handoffs expose what session logs can't carry

In a multi-agent pipeline, handoffs happen constantly. An orchestrator decides a subtask requires a specialist. The specialist takes it, does the work, and needs to pass results back — or hand off to another agent downstream. The question is: what travels with the handoff?

In the current model, the answer is "context injection": pull the relevant parts of the session log, stuff them into the next agent's prompt, hope the retrieval was good. This works when the task is narrow. It degrades fast when the history is long, when the retrieving agent doesn't share the originating agent's context window, or when the task requires understanding a decision sequence rather than a fact lookup.

An agent resume changes the mechanics. Agent B doesn't replay Agent A's session. It reads Agent A's resume: what was decided, what was built, what the open questions are, what Agent A would do next. That's a clean handoff surface — low-token, legible, framework-agnostic. Agent B can be on a different model, in a different tool, run by a different team.

A chain of agent resumes is also a decision log, not a raw activity transcript but a curated record of how a problem was approached, how decisions evolved, what was learned. The next time a handoff fails in your pipeline, ask: does the receiving agent have a resume to read, or a session dump to wade through?

## The gap the field is leaving open

The agent memory space is active. Letta's context repositories are the most structurally interesting development — git-based versioning applied to agent context, capturing the versioning and delta properties that matter. But the project is framed as context infrastructure: how does this agent manage its own memory? Not: how does this agent share its state with the rest of the world?

That gap — the readable, portable, URL-addressable artifact an agent writes for outside consumption — is where no current memory framework is building. Mem0 is solving prompt bloat. LangChain is giving developers low-level control over memory types. Letta is making agent state inspectable. None of them are building the artifact they're all circling, and none of them have a name for it yet.

Tokenrip's asset layer — versioned, URL-addressable objects an agent can publish at task completion — is one surface this pattern could be built on. But the resume as a purpose-built artifact type, with its own structure and conventions, doesn't exist as a first-class concept anywhere today.

The pressure will build. As agents run longer tasks, as multi-agent architectures become standard, as audit and compliance requirements follow, the session-log-as-memory assumption is going to start costing people in concrete ways: context costs, reliability failures, handoff breakdowns. When that happens someone will package the resume pattern and it will spread fast, the way structured tool calling replaced free-form function invocation once the pain was obvious enough.

Whether the teams building memory infrastructure today are designing toward that primitive — or just building a faster horse — is an open question.

## What operators should watch for

You don't have to wait for the ecosystem to converge. The resume pattern is implementable today, in any framework, as a discipline rather than a platform feature.

The signal that you need it: your agents are losing important context between sessions, your multi-agent handoffs are unreliable, or you find yourself manually summarizing agent output to pass it downstream. Those are session-log symptoms.

The starting point is simple: at the end of each meaningful task, have the agent write a structured summary — decisions, outputs, open questions, what it learned — to a named, stable location. Treat that artifact as the thing you pass to the next agent, not the session history. Iterate on the structure until it contains everything Agent B needs to continue and nothing it doesn't.

That discipline, applied consistently, is the resume. The infrastructure to support it — versioning, addressability, cross-agent reads — grows from there. Get the mental model right before you need the tooling, and every handoff, audit, and pipeline extension gets easier from there.
