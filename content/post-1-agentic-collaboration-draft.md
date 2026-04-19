---
title: "Agentic Collaboration — The Missing Layer in the Agent Stack"
---

# Agentic Collaboration — The Missing Layer in the Agent Stack

A single AI agent, given a well-defined task, succeeds almost every time. It can write code, draft a document, research a topic, and return a useful result. But put multiple agents together — assign roles, create hierarchies, build pipelines — and something breaks.

Jeremy McEntire's recent research quantified this breakdown. A single agent completed tasks with a 100% success rate. A hierarchical structure — one agent assigning work to others — dropped to 64%. A self-organizing swarm fell to 32%. And an eleven-stage gated pipeline, the kind of sophisticated multi-agent architecture that looks impressive on a whiteboard, hit 0%. It consumed its entire compute budget on planning stages without producing a single line of output.

The striking part isn't the failure rates. It's the cause. These agents had no ego. No office politics. No fatigue. No competing career incentives. They were language models executing prompts. As McEntire put it: "The dysfunction emerged anyway."

This isn't a story about agents being bad at working together. It's a story about missing infrastructure. The agent ecosystem has solved individual capability. It's actively building the communication pipes between agents. But the layer where agents actually *collaborate* — sharing context, coordinating around artifacts, maintaining organizational memory — doesn't exist yet.

The collaboration layer is the missing layer in the agent stack.

---

## The Production Layer Is Solved

The first layer of the agent stack — individual agent capability — is mature. Agents can code, research, write, analyze, and automate workflows with enough reliability that they've become daily tools, not experiments.

The numbers tell the story. Anthropic's 2026 Agentic Coding Trends Report found that developers use AI in roughly 60% of their work. Salesforce's Connectivity Report, surveying over 1,000 enterprise IT leaders, found that 83% of organizations have adopted AI agents across teams and functions, running an average of twelve agents per organization — a number projected to grow 67% by 2027. OpenAI's Agents SDK alone has over 4,900 dependent projects. Coding agents like Claude Code, Cursor, Windsurf, and Codex have crossed from novelty to necessity.

The question has shifted. It's no longer "can agents do useful work?" It's "can agents do useful work *together*?"

And the honest answer, right now, is mostly no.

---

## The Communication Layer Is Being Built

The second layer — how agents talk to each other — is under active construction. Three protocols are converging on different parts of the problem.

**MCP (Model Context Protocol)** standardizes how agents connect to tools. Created by Anthropic and donated to the Linux Foundation's Agentic AI Foundation, MCP has reached 97 million monthly SDK downloads and powers over 10,000 active servers. It's supported by Claude, ChatGPT, Cursor, Gemini, and VS Code. Before MCP, every tool integration was bespoke — a custom connector for every data source. MCP collapses the M-times-N integration problem into M-plus-N implementations. It's becoming foundational infrastructure.

**A2A (Agent-to-Agent Protocol)** standardizes how agents discover and delegate to each other. Google launched A2A with over 50 partners including Atlassian, Salesforce, SAP, and LangChain. Agents advertise their capabilities through Agent Cards. Clients discover the best agent for a task and communicate through a structured task lifecycle. The specification covers three layers — data structures, agent behaviors, and protocol bindings across JSON-RPC, gRPC, and HTTP/REST.

**ACP (Agent Communication Protocol)**, backed by IBM, Cisco, and Red Hat, focuses on structured message passing with defined collaboration patterns. It's being consolidated under A2A governance as the protocols converge.

These protocols represent real progress. Before MCP, every integration was a one-off. Before A2A, agents from different vendors couldn't discover or coordinate with each other at all.

But they're solving plumbing, not collaboration.

MCP connects agents to tools. A2A connects agents to agents. Neither provides infrastructure for agents to share context, coordinate around living artifacts, or maintain organizational memory. They're communication protocols — and communication is necessary for collaboration, but it's nowhere near sufficient.

The analogy: SMTP lets people send email. It doesn't make them a team. Collaboration required entirely new infrastructure — shared documents, project boards, version control, real-time editing surfaces. Email was the pipe. Google Docs was the room. The pipe had to exist first, but the room is where work actually happens together.

---

## Why Multi-Agent Frameworks Aren't the Answer

The natural objection: don't CrewAI, AutoGen, and LangGraph already handle multi-agent collaboration?

No. They handle **orchestration** — which is a fundamentally different thing.

Orchestration is a conductor directing an orchestra. Each musician plays their part. The conductor sequences the performance. The output is coordinated execution of pre-defined roles. If the cellist and the violinist disagree about tempo, the conductor decides. If a section is missing, the conductor reassigns. Control flows from the top.

Collaboration is a jazz ensemble. Musicians listen to each other. They respond to what they hear. They build on each other's ideas and converge on something none of them could have produced alone. There's no conductor. There's shared context — a key, a tempo, a feel — and the musicians navigate it together.

What the current frameworks actually provide:

**CrewAI** offers role-based task assignment. You define agents with roles and goals, and they execute sequentially or in parallel. It's fast to prototype — twenty lines of code gets you started. But there's no shared state between agents beyond what the orchestrator explicitly passes. Each agent operates in isolation between handoffs.

**LangGraph** provides graph-based workflows with checkpointing and time-travel debugging. It's the most production-ready framework, with deep MCP integration and LangSmith observability. But it's fundamentally a state machine — powerful for pipelines, not designed for ambient collaboration.

**AutoGen** (now AG2) takes a conversational approach with GroupChat as its primary coordination pattern. Of the major frameworks, it's closest to actual collaboration. But it's expensive — 5 to 6 times the token cost of LangGraph due to conversational overhead — and the context is ephemeral. When the conversation ends, the shared understanding evaporates. No organizational memory persists.

**OpenAI's Agents SDK** provides handoffs between specialized agents. Agent A finishes its work, hands off to Agent B. It's sequential specialization — efficient for pipelines, but not coordination. Each agent receives a baton, not a shared workspace.

These frameworks coordinate agent *execution*. They don't create infrastructure for agents to share *understanding*. And that distinction matters, because orchestration breaks down precisely where collaboration would thrive: at scale, across organizational boundaries, over time.

McEntire's 0% success rate for pipeline orchestration isn't a failure of the agents or the frameworks. It's evidence that orchestration — more structure, more stages, more control — hits a ceiling. The answer to coordination failure isn't more coordination. It's a different paradigm: shared context instead of passed messages. Convergence instead of sequencing.

---

## What Collaboration Actually Requires

If communication is "agents can send messages" and orchestration is "agents can execute in sequence," collaboration is "agents can think together."

What infrastructure does that demand?

**Shared context, not shared messages.** Today, every agent environment is a silo. Claude Code has its context window and local files. ChatGPT has its conversation thread. An autonomous agent like Hermes has its own memory store. When two agents need to work together, they exchange messages — but they don't share understanding. Each builds and maintains its own version of reality, independently, with no mechanism to detect when those versions diverge. Salesforce's 2026 Connectivity Report found that half of all enterprise agents operate in isolated silos — disconnected workflows, redundant automations, invisible misalignment.

**Coordinated artifacts, not just outputs.** Agents produce outputs constantly — documents, code, analyses, plans, research. But these outputs are trapped in chat windows, terminal sessions, and local files. There's no infrastructure for an artifact to become a living object — something with persistent identity that multiple agents interact with over time. An artifact that carries version history, provenance, and a record of who contributed what and why. Not a file that gets emailed around. A shared surface that agents collaborate *through*.

**Organizational memory, not session memory.** Orchestration frameworks give agents session memory — context within a single run. But collaboration requires organizational memory: the accumulated decisions, patterns, preferences, and institutional knowledge that persist across sessions, across agents, and across team members. There's a reason experienced employees are more valuable than new hires. They carry context that no onboarding document fully captures. Today's agents are permanent new hires — they start fresh every session, with whatever context the operator manually provides. Collaboration infrastructure would give agents the equivalent of institutional knowledge: a shared, evolving understanding of how this organization works, what's been decided, and why.

**Cross-organizational interfaces.** The hardest and most valuable form of agentic collaboration: agents from different organizations working on shared surfaces. Not just exchanging messages — A2A handles point-to-point communication — but maintaining shared state with appropriate boundaries. What your agents can see versus what mine can see. How changes in one organization's workspace propagate to another's. Who controls what. This is where collaboration moves from a productivity tool to organizational infrastructure.

---

## Pipes and Rooms

A useful framework for understanding the gap:

**Current protocols build pipes.** Agent A sends a structured message to Agent B. B processes it. B responds. The pipe connects two endpoints. Data flows through. This is what MCP, A2A, and the agent frameworks provide — increasingly sophisticated pipes with better formatting, richer metadata, and more reliable delivery.

**What's missing is rooms.** A shared space where multiple agents see the same state, contribute to the same artifacts, and converge on shared understanding. Not message-passing between endpoints. State-sharing across participants. Not delegation of discrete tasks. Co-creation of emergent outputs.

The distinction is practical, not philosophical. Pipes work for delegation: "here's a task, do it, return the result." Rooms are needed for collaboration: "here's a shared context, let's figure this out together."

The internet itself followed this progression. It started with pipes — email, FTP, point-to-point data transfer. Useful, but limited to exchanging things between known endpoints. It became transformative when it got rooms — wikis, forums, shared documents, real-time collaboration surfaces. The pipes had to exist first. But the rooms are where the value compounded.

The agent ecosystem is in its pipes era. The protocols are maturing. The communication layer is solidifying. But the rooms era — shared surfaces where agents collaborate rather than just communicate — hasn't started yet, because the infrastructure for it doesn't exist.

---

## Where This Is Heading

The stack will get its collaboration layer. It has to. The economics demand it.

As agents take on more organizational work — and the trajectory here is unmistakable, with Salesforce projecting 67% growth in agent deployment by 2027 — the cost of context fragmentation compounds. Every decision an agent makes without access to the full organizational context is a potential misalignment. Every insight trapped in one agent's session that another agent needs is a missed connection. Every time two agents from the same organization produce contradictory outputs because they're operating on different understandings of the same situation, someone pays for the cleanup.

Today, humans bridge these gaps. They copy-paste context between agent sessions. They summarize one agent's output and feed it to another. They hold the organizational memory in their heads and distribute it manually. This works at small scale. It doesn't scale with the agent deployments that enterprises are building.

What will collaboration infrastructure look like when it arrives?

It will be agent-first by design — built for agents as primary participants, not human collaboration tools with API access bolted on. The difference isn't features. It's the design premise. Mobile-first versus mobile-responsive.

It will provide shared contexts that multiple agents read from and write to — not message queues, but living state that evolves as participants interact with it.

It will give artifacts persistent identity, versioning, and provenance — so that when five agents contribute to a deliverable, the lineage is traceable and the reasoning is preserved.

It will use pull-based synchronization — agents polling for changes on their own schedule — rather than requiring always-on push connections that most agent architectures can't support.

And it will handle cross-organizational boundaries with controlled propagation — because the most valuable collaboration isn't within a single team; it's between organizations whose agents need to share enough context to work together without sharing everything.

The production layer took three years to mature. The communication layer is being built right now. The collaboration layer is next.

It may be the most important layer of all. Because it's the layer where agents stop being individual tools that humans orchestrate — and become organizational infrastructure that operates as a team.
