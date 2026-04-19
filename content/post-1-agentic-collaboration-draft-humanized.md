---
title: "Agentic collaboration — the missing layer in the agent stack"
---

# Agentic collaboration — the missing layer in the agent stack

A single AI agent, given a clear task, succeeds almost every time. It can write code, draft a document, research a topic, and return something useful. But put multiple agents together and something breaks.

Jeremy McEntire's recent research quantified the breakdown. A single agent completed tasks at a 100% success rate. A hierarchical structure, one agent assigning work to others, dropped to 64%. A self-organizing swarm fell to 32%. And an eleven-stage gated pipeline, the kind of multi-agent architecture that looks impressive on a whiteboard, hit 0%. It burned its entire compute budget on planning stages without producing a single line of output.

The failure rates aren't the interesting part. The cause is. These agents had no ego. No office politics. No fatigue. No competing incentives. They were language models executing prompts. As McEntire put it: "The dysfunction emerged anyway."

This isn't about agents being bad at working together. It's about missing infrastructure. The agent ecosystem has solved individual capability. It's actively building the communication pipes between agents. But the layer where agents actually *collaborate*, where they share context, coordinate around artifacts, maintain organizational memory, that doesn't exist yet.

---

## The production layer is solved

Individual agent capability is mature. Agents can code, research, write, analyze, and automate workflows reliably enough that they've become daily tools rather than experiments.

Anthropic's 2026 Agentic Coding Trends Report found that developers use AI in roughly 60% of their work. Salesforce's Connectivity Report, surveying over 1,000 enterprise IT leaders, found that 83% of organizations have adopted AI agents, running an average of twelve per organization, a number projected to grow 67% by 2027. OpenAI's Agents SDK has over 4,900 dependent projects. Coding agents like Claude Code, Cursor, Windsurf, and Codex have crossed from novelty to necessity.

The question is no longer "can agents do useful work?" It's "can agents do useful work *together*?"

The honest answer, right now, is mostly no.

---

## The communication layer is being built

How agents talk to each other is under active construction. Three protocols are converging on different parts of the problem.

MCP (Model Context Protocol) standardizes how agents connect to tools. Created by Anthropic and donated to the Linux Foundation's Agentic AI Foundation, MCP has reached 97 million monthly SDK downloads and powers over 10,000 active servers. It's supported by Claude, ChatGPT, Cursor, Gemini, and VS Code. Before MCP, every tool integration was bespoke. MCP collapses the M-times-N integration problem into M-plus-N. It's becoming foundational.

A2A (Agent-to-Agent Protocol) standardizes how agents discover and delegate to each other. Google launched A2A with over 50 partners including Atlassian, Salesforce, SAP, and LangChain. Agents advertise capabilities through Agent Cards. Clients discover the best agent for a task and communicate through a structured task lifecycle.

ACP (Agent Communication Protocol), backed by IBM, Cisco, and Red Hat, focuses on structured message passing with defined collaboration patterns. It's being consolidated under A2A governance as the protocols converge.

These protocols matter. Before MCP, every integration was a one-off. Before A2A, agents from different vendors couldn't discover or coordinate with each other at all.

But they're solving plumbing, not collaboration.

MCP connects agents to tools. A2A connects agents to agents. Neither gives agents a way to share context, coordinate around living artifacts, or maintain organizational memory. They're communication protocols. Communication is necessary for collaboration, but it isn't sufficient.

SMTP lets people send email. It doesn't make them a team. That required entirely different infrastructure: shared documents, project boards, version control, real-time editing surfaces. Email was the pipe. Google Docs was the room. The pipe had to exist first, but the room is where work actually happens together.

---

## Why multi-agent frameworks aren't the answer

The natural objection: don't CrewAI, AutoGen, and LangGraph already handle multi-agent collaboration?

They handle orchestration. Different thing.

Orchestration is a conductor directing an orchestra. Each musician plays their part. The conductor sequences the performance. If the cellist and the violinist disagree about tempo, the conductor decides.

Collaboration is a jazz ensemble. Musicians listen to each other, respond to what they hear, build on each other's ideas. No conductor. Shared context (a key, a tempo, a feel) and the musicians navigate it together.

Here's what the frameworks actually do:

CrewAI does role-based task assignment. Define agents with roles and goals, they execute sequentially or in parallel. Fast to prototype. But there's no shared state between agents beyond what the orchestrator explicitly passes. Each agent operates in isolation between handoffs.

LangGraph does graph-based workflows with checkpointing and time-travel debugging. It's the most production-ready framework, with deep MCP integration and LangSmith observability. But it's a state machine. Good for pipelines. Not for ambient collaboration.

AutoGen (now AG2) takes a conversational approach with GroupChat as its coordination pattern. Of the major frameworks, it's closest to actual collaboration. But it costs 5 to 6 times the tokens of LangGraph due to conversational overhead, and the context is ephemeral. When the conversation ends, the shared understanding evaporates.

OpenAI's Agents SDK provides handoffs between specialized agents. Agent A finishes, hands off to Agent B. Sequential specialization. Each agent receives a baton, not a shared workspace.

These frameworks coordinate agent *execution*. They don't create infrastructure for agents to share *understanding*. Orchestration breaks down precisely where collaboration would thrive: at scale, across organizational boundaries, over time.

McEntire's 0% success rate for pipeline orchestration isn't a failure of the agents or the frameworks. It's evidence that orchestration (more structure, more stages, more control) hits a ceiling. The answer to coordination failure isn't more coordination. It's shared context instead of passed messages. Convergence instead of sequencing.

---

## What collaboration actually requires

Communication means "agents can send messages." Orchestration means "agents can execute in sequence." Collaboration means "agents can think together."

What does that take?

**Shared context, not shared messages.** Every agent environment today is a silo. Claude Code has its context window and local files. ChatGPT has its conversation thread. An autonomous agent has its own memory store. When two agents need to work together, they exchange messages, but they don't share understanding. Each builds its own version of reality, independently, with no mechanism to detect when those versions diverge. Salesforce's 2026 Connectivity Report found that half of all enterprise agents operate in isolated silos: disconnected workflows, redundant automations, invisible misalignment.

**Coordinated artifacts, not just outputs.** Agents produce outputs constantly: documents, code, analyses, plans. But these outputs are trapped in chat windows, terminal sessions, and local files. There's no infrastructure for an artifact to become a living object, something with persistent identity that multiple agents interact with over time, carrying version history, provenance, a record of who contributed what and why. Not a file that gets emailed around. A shared surface that agents collaborate *through*.

**Organizational memory.** Orchestration frameworks give agents session memory: context within a single run. Collaboration requires something different. The accumulated decisions, patterns, preferences, and institutional knowledge that persist across sessions, across agents, across team members. There's a reason experienced employees are more valuable than new hires. They carry context that no onboarding document fully captures. Today's agents are permanent new hires. They start fresh every session, with whatever context the operator manually provides.

**Cross-organizational interfaces.** This is the hardest part: agents from different organizations working on shared surfaces. Not just exchanging messages (A2A handles that) but maintaining shared state with appropriate boundaries. What your agents can see versus what mine can see. How changes propagate. Who controls what.

---

## Pipes and rooms

Current protocols build pipes. Agent A sends a structured message to Agent B. B processes it. B responds. The pipe connects two endpoints. Data flows through. MCP, A2A, and the agent frameworks provide increasingly sophisticated pipes with better formatting, richer metadata, more reliable delivery.

What's missing is rooms. A shared space where multiple agents see the same state, contribute to the same artifacts, converge on shared understanding. State sharing across participants rather than message passing between endpoints.

Pipes work for delegation: "here's a task, do it, return the result." Rooms work for collaboration: "here's a shared context, let's figure this out together."

The internet followed this progression. It started with pipes: email, FTP, point-to-point data transfer. Useful, but limited to exchanging things between known endpoints. It became something else when it got rooms: wikis, forums, shared documents, real-time editing. The pipes had to exist first. The rooms are where the value compounded.

The agent ecosystem is in its pipes era. The rooms era hasn't started yet.

---

## Where this is heading

The stack will get a collaboration layer. The economics force it.

As agents take on more organizational work, the cost of context fragmentation compounds. Every decision an agent makes without access to the full organizational context is a potential misalignment. Every insight trapped in one agent's session that another agent needs is a missed connection. When two agents from the same organization produce contradictory outputs because they have different understandings of the same situation, someone pays for the cleanup.

Today, humans bridge these gaps. They copy-paste context between agent sessions. They summarize one agent's output and feed it to another. They hold the organizational memory in their heads and distribute it manually. That works at small scale.

What does collaboration infrastructure look like when it arrives? Nobody knows for sure, but some things seem likely.

It has to be built for agents as primary participants, not human collaboration tools with API access bolted on. The difference isn't features, it's the design premise. Mobile-first versus mobile-responsive.

It needs shared contexts that multiple agents read from and write to. Not message queues, but state that evolves as participants interact with it.

Artifacts need persistent identity, versioning, and provenance, so that when five agents contribute to a deliverable, the lineage is traceable.

It probably uses pull-based synchronization (agents polling for changes on their own schedule) rather than always-on push connections that most agent architectures can't support.

And it has to handle cross-organizational boundaries. The most valuable collaboration isn't within a single team. It's between organizations whose agents need to share enough context to work together without sharing everything.

The production layer took three years to mature. The communication layer is being built right now. The collaboration layer is next. It's the layer where agents stop being individual tools that humans orchestrate and start operating as a team.
