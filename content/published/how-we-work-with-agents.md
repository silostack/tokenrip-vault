---
title: "How We Actually Work With Agents"
slug: how-we-work-with-agents
post_type: craft
created: 2026-05-31
published: 2026-06-01
word_count: 2078
tokenrip_id: 360afe8c-bc90-46fe-89c3-7f97afe4a0aa
sources: content/sources/how-we-work-with-agents/references.md
keywords: [AI founder workflow, working with AI agents, multi-agent workflow, persistent agent state, cross-runtime agents, agent stack, mounted agents in practice]
meta_description: "Two founders, five agents, three harnesses, one shared substrate. A real multi-agent workflow where state survives the session — and how to build your own."
---

# How We Actually Work With Agents

We run a company with two people and a roster of agents — no ops team, no analysts, no one doing outbound. The work those roles would normally do runs through agents instead. So the first thing either of us does in the morning is not open a blank chat box. It's open the workspace our agents share and read what changed overnight: a proposal one agent drafted while we slept, a thread the other founder's agent opened on a live deal, a research artifact that finished a long job and rewrote itself into a new version. The day doesn't start from zero context. It starts from accumulated state that several agents and two people built overnight, without anyone watching.

That's the part that's hard to convey about working with agents at this depth: you stop thinking in sessions. Most people's mental model of "using AI" is a conversation. You type, it answers, you type again, and when you close the tab the context evaporates. Working the way we work requires three things that conversation model doesn't give you: durable agent state that survives the session, the ability for several agents and people to act on the same artifact, and a shared substrate that holds it together across whatever tool each person happens to be in. Most teams haven't tried it because that substrate doesn't exist where they're looking. We built one, and we run the company on it. Here's what a day actually looks like.

## We're already living the prediction everyone keeps making

There's a [prediction making the rounds this year](https://www.youtube.com/watch?v=4D3hDmGhFhA) about how work changes: everyone gets at least one agent they talk to and hand work off to, and most of the actual work stops happening in a browser full of SaaS tabs and moves inside an AI environment instead — a coding agent, a desktop AI workspace. It's framed as a forecast, the way things will look a year from now. We've been living a version of it for months. The gap between the forecast and our reality is the part worth paying attention to, because it's the part that doesn't ship in any single product.

The thesis that there's a [productivity unlock waiting on the other side of multi-agent work](https://tokenrip.com/s/cece3097-70e3-49e2-8548-54b8a5ad8266) is easy to argue and hard to prove. So this is the proof. Not a demo. The actual stack two founders use to run a company, and the specific places it does something a chat session cannot.

## Two people, five agents, three places they run

There are two of us. Each of us runs a roster of agents, and they are genuinely different agents with different jobs, not one assistant wearing hats.

Bean is the thinking partner: idea exploration, sparring, the non-obvious connection. Yoda is the mentor: strategy, accountability, the weekly review that asks whether the week's work matched the week's priorities. Closer handles deal execution, drafting the proposal, naming the next step, refusing to let a deal go cold. An engagement agent runs outreach. A blog agent writes the posts, including a draft of this one before a human touched it. Each agent has its own instructions, its own accumulated memory, its own voice. They don't blur together because they don't share a context window — they share a substrate.

We run them across three surfaces. One of us mostly lives in Claude Code at the terminal. The other works in Claude Cowork. Both of us reach the same agents from a browser through a hosted connection when we want to review on a phone or a laptop without a dev environment. The harness changes depending on where we are and what the work needs. The agent doesn't. That's the part worth being precise about: the agent's instructions and memory don't live on either of our machines. They live on Tokenrip as versioned artifacts, and any compatible harness pulls them at runtime. We're not running copies of an agent that drift apart. We're both mounting the same one.

None of these are exotic tools. The unusual part isn't the agents or the harnesses — plenty of people have those. It's that all of them write to and read from one shared place, so the work survives any single conversation ending.

## A deal moves through four agents and two people, and nobody retypes the context

Here's a concrete one. A few weeks ago a firm-direct deal — call it a regional credentialing operator, the kind of company that runs document-heavy back-office work — moved from cold to a signed paid engagement. Watch where the work lives at each step, because that's the point.

It started as a raw call. The transcript got processed into a clean contact artifact on the substrate: who they are, what they said, what they need. Bean picked up the positioning question: what's the actual wedge here, what's the angle a generic pitch would miss. That exploration landed as its own artifact, linked to the contact. Yoda ran the strategy pass on top of it — is this the right deal to push, what's the risk, what does the next two weeks need to look like — and that became a third linked artifact. Then Closer drafted the proposal and the cover note, reading everything upstream without anyone pasting it back in, because it was all already there, addressable, on the same surface.

Now the part a single chat session structurally cannot do: one of us owns this deal, but the other one did the technical scoping. He opened the proposal artifact from his own harness, on his own machine, commented inline where the integration assumptions were wrong, and the thread carried the correction back. No "let me forward you the latest version." No screenshot of a chat. No reconstructing six exchanges of context for the other person. The deal lived in a mutable artifact that both of us, and four agents, acted on in turn. The credentialing operator came back asking for a paid discovery sprint before the build, a buying signal, and that reply landed as a new message on the same thread, where the whole history was already sitting.

The harness changed three times across that arc. The work followed.

## The work outlives the session, so the session stops being the unit

Once state persists and more than one party can mutate it, the unit of work stops being the conversation and becomes the artifact. Three places we feel that every week:

The weekly review runs across two operators in different time zones. Yoda doesn't start cold and doesn't need both of us live in the same call. It reads the week's accumulated state — what each of our agents produced, what moved, what stalled — and the review itself persists into next week's, so the accountability compounds instead of resetting every Friday.

A multi-day close threads through several agents without a coordinator. Bean explores, Yoda pressure-tests, the engagement agent drafts the outreach, Closer sets the dated next step — across days, across both of us, with no single conversation holding it together. The thread does instead.

Engineering work carries its own context forward. A research artifact that took hours to produce doesn't get re-explained to the next agent; it gets read. The diff context, the decisions, the dead ends — they're in the artifact, not in someone's memory of a chat that's now scrolled away.

Memory is the quiet enabler under all of this, and it's deliberately split in two. Each agent keeps a private context layer — the specific deals, preferences, and relationships that are nobody else's business — and contributes to a shared knowledge layer of generalizable patterns. Yoda's read on how we tend to stall on a certain kind of decision is a pattern worth sharing across the system; the details of any one deal are not. The split is what lets the agents get smarter together without leaking what should stay private. It mirrors how a real firm works: shared playbook, private client files.

## What a fresh chat per task would actually cost

It's worth naming what breaks without this, because the absence stays invisible until you've felt the alternative.

A single chat session per task loses three things, and they're the three that matter most. It loses cross-agent visibility: Bean has no idea what Yoda just decided, so every handoff is a re-briefing. It loses persistent memory: every review, every deal touch, every research thread starts from nothing, so you pay the context-loading tax over and over. And it loses cross-runtime continuity: no single harness fits all the work, so the moment you switch from terminal to browser the thread snaps and you're copy-pasting yourself back into coherence.

This is also where the industry's version of "multi-agent" turns out to be a different thing. [Anthropic's agent teams](https://code.claude.com/docs/en/agent-teams) — a lead session coordinating teammate sessions over a shared task list — are genuinely useful, but they live inside one runtime, one project, one operator's machine. That's orchestration: a coordinator handing out work to workers in the same room. What we're describing is peer-to-peer across operators and across harnesses with no coordinator at all: two people, each with their own agents, all acting on the same state because the state lives somewhere neutral to all of them. Orchestration scales one person's agents. This scales a team's. They are not the same architecture, and the difference is exactly the substrate.

That neutrality is load-bearing in a way that's easy to miss. The agents' instructions are just text; nothing about them is fused to one vendor's runtime, which is why the same imprint (the agent's instructions and memory, published as artifacts) that runs in Claude Code could mount in a different harness entirely. We happen to run on the Claude family today. The substrate doesn't care, and [that's the point of building on a runtime you don't own](https://tokenrip.com/s/82ce553c-0a9b-4bbe-9b0f-602067f2a945).

## Five primitives to look for if you want to work this way

If you want to build this — or evaluate whether a substrate someone's selling you can support it — here's the checklist. These are architectural primitives, not features. A tool either has them or it doesn't, and the workflow above is impossible without all five.

1. **A persistent, versioned, mutable artifact store.** The work has to live somewhere that isn't chat history — addressable, updatable, and durable across sessions. If the output dies when the conversation closes, nothing else on this list matters.
2. **Identity for every agent.** Agents need to sign their work and address each other. "The proposal agent drafted this; the strategy agent reviewed it" only works if agents are distinct, nameable parties, not anonymous calls.
3. **Cross-runtime mounting.** The same agent has to run wherever the operator is — terminal, desktop app, browser — by pulling its instructions and memory at runtime instead of being installed on one machine. This is what makes the harness disposable.
4. **Partitioned, shared memory.** Two layers: private context that stays with one agent or operator, and a shared knowledge layer where generalizable patterns compound. One without the other either leaks or doesn't learn.
5. **An inbox you can see across all of it.** Humans need to see what each agent did without leaving their own harness. Observability is what turns a swarm of autonomous agents from a black box into a team you can actually supervise.

Run your current setup against those five. Most "AI workflows" have one or two — usually a chat tool and maybe a shared doc — and the missing three are exactly why the work keeps collapsing back into one person manually relaying context between sessions.

The checklist isn't the substrate, and that's the honest limitation: knowing the five primitives doesn't give you a place that has them. You still have to build that place or find one. What the checklist does is tell you precisely what you're looking for, so you stop evaluating agent products on how smart the model sounds in a demo and start evaluating them on whether the work survives you closing the laptop. The deal that closed above didn't close because any one agent was brilliant. It closed because four of them and two of us could act on the same thing without ever stopping to catch each other up. The model was never the bottleneck. The shared surface was — and once you've worked on one, going back to a chat window feels like emailing yourself files again.
