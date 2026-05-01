---
title: "Operations as Primitives"
slug: operations-as-primitives
post_type: thesis
created: 2026-04-29
word_count: 1506
sources: content/sources/operations-as-primitives/references.md
keywords: [operations primitives, SaaS unbundling, agent-native stack, business operations, agentic infrastructure]
meta_description: "CRM, project management, support — every business operation decomposes into three primitives. SaaS bundled them for humans. Agents skip the bundle."
---

# Operations as Primitives

A CRM is a table, a playbook, and a messaging layer. A project management tool is a table, a workflow definition, and a notification system. A support desk is a queue, a set of response templates, and a routing layer.

Strip away the dashboards, the branding, the subscription tiers. Every business operation is the same three primitives in different configurations.

We didn't start with this thesis. We started by building [an agent-native CRM in a single session](/s/agent-native-crm): two data tables, six instruction documents, and a messaging layer. The whole system was running in production in under an hour. The interesting part wasn't the CRM itself. It was what the CRM revealed about the structure underneath.

## Every Operation Decomposes the Same Way

The CRM needed three things: structured data the agent could read and write (two tables with typed schemas), instructions defining how to operate on that data (six documents covering ingestion, drafting, outreach, and sending), and a messaging layer for multi-party handoffs (between operators and between the agent and its human reviewer).

That decomposition wasn't a design choice. It was a discovery. Strip a CRM down to what an agent needs to operate it, and those are the only three things left.

The same decomposition applies everywhere. A project management system is a table of tasks with status fields (structured data), a set of rules defining how tasks move between states and who gets notified (instructions), and a way to surface blockers and decisions to the right people (messaging). Take away Asana's drag-and-drop Gantt charts, and this is what remains.

A support desk works the same way: a queue of tickets (structured data), a decision tree for routing and response templates (instructions), and an escalation path that moves unresolved items to humans (messaging). Take away Zendesk's agent dashboard, and the skeleton is identical to the CRM. Data, instructions, messaging, arranged differently.

## SaaS Had to Bundle Because Humans Needed It To

The bundling wasn't arbitrary. It solved a real problem.

Humans can't operate on raw primitives efficiently. Give someone a database table and a markdown document describing a CRM workflow, and they'll stare at it. They need a dashboard that renders the table as a pipeline view, drag-and-drop to move deals between stages, a notification system that surfaces the right thing at the right time without requiring them to poll a data source.

The entire SaaS industry exists because humans need opinionated interfaces between themselves and the underlying primitives. [Bain's analysis](https://www.bain.com/insights/will-agentic-ai-disrupt-saas-technology-report-2025/) frames it as "human plus app," where the app mediates between the human and the work. The dashboard, the workflow builder, the permission wizard, the onboarding flow: these are human-convenience layers. They don't change what the operation does. They change how a human interacts with it.

HubSpot doesn't sell tables and instruction sets. It sells an opinionated bundle: this is how your pipeline should look, these are the stages deals move through, this is when a notification fires. The opinions are the product. The tables and instruction sets are commodity infrastructure underneath.

For decades, this was the right answer. Humans were the only operators, and humans needed the opinions. So the SaaS industry kept building them.

## Agents Don't Need the Opinions

An agent operating a CRM doesn't need a pipeline view. It reads the table directly. Drag-and-drop? It updates a status field. A notification system? It polls the data source on a schedule. An onboarding wizard? It reads the instruction document in milliseconds.

Every human-convenience layer in a SaaS product becomes overhead when the operator is an agent. The dashboard is a rendering layer the agent never sees. The workflow builder is a visual interface for rules the agent reads as text. Permission models designed for human org charts don't map to agent auth patterns. The OAuth flow, the API rate limits, the webhook configuration: all of it mediates between a human product and a machine consumer.

[Pragmatic Coders put it precisely](https://www.pragmaticcoders.com/blog/saas-is-dead-how-ai-agents-reduced-saas-to-just-an-api): AI agents reduce SaaS to "a database and a set of functions that an AI agent can swap in and out at will." The bundle dissolves. What remains is the primitives.

Agents can still use SaaS products through APIs that translate intent into the product's internal operations. Every translation is overhead, though, and there's a simple test for whether it's worth paying. Pick any SaaS tool in your stack and strip away the interface. What's left? If it's a table and a set of rules, an agent can operate on those directly. If the value lives in the visual layer (the workflow builder, the drag-and-drop board, the approval dashboard), the agent is paying for something it will never use.

## The Rebundling Is Real — But It's Happening at the Wrong Layer

The sharpest counterargument comes from Tom Tunguz, who [argues that AI is rebundling, not unbundling](https://tomtunguz.com/2026-03-24-saas-unbundled-ai-rebundled/). His logic: when models change every 42 days, buyers can't assemble a best-of-breed stack. They want a platform they can trust for three to five years. The SaaS playbook rewarded specialization. The AI playbook rewards breadth.

He's right that rebundling is happening. Harvey expanded from legal AI to professional services broadly. Glean went from enterprise search to vertical work agents for sales, HR, and engineering. The trend is real.

The rebundling is happening at the primitive layer, though, not the feature layer. Harvey isn't bundling "legal CRM plus legal project management plus legal billing." It's bundling data access, reasoning workflows, and messaging into a platform that serves multiple verticals. Glean isn't bundling "search plus HR plus sales tools." It's bundling a data layer, an instruction layer, and an interaction layer that compose differently per use case.

This pattern has precedent. [Craigslist got unbundled](https://www.cbinsights.com/research/craigslist-unbundling/) into specialized verticals, attracting $8.87 billion in venture funding and four IPOs. Cloud infrastructure decomposed monolithic app servers into compute, storage, and messaging primitives. Each time, the bundle layer lost value and the primitive layer captured it. The companies that owned the best primitives won the next era.

SaaS is the next layer in the same sequence. The bundle that matters in the agent era is not "CRM plus PM plus support." It's "tables plus instructions plus messaging." The feature layer is what agents compose on top, configured differently for every operation.

## The Primitive Layer Is the New Competitive Surface

If every business operation decomposes to the same three primitives, the question becomes: who owns the best primitives?

The best structured data layer isn't a CRM database or a PM database or a support queue. It's a general-purpose collection with typed schemas that the agent can read, write, query, and render for human review. Instructions work the same way: forget the workflow builder or the automation rule engine. What agents need is a publishing surface where instructions are versioned, shared, and fetched at runtime. And the messaging layer that wins won't look like a notification system or an approval workflow. It will look like messaging between agents, between agents and humans, between operators, handling operational handoffs and system replication through the same channel.

[Theory VC frames this](https://theoryvc.com/blog-posts/saas-might-be-dead-but-primitives-arent) as the "thick middle layer," primitives that encode domain knowledge and composition patterns rather than exposing raw functions. The value comes from being opinionated at the right level: typed schemas that prevent bad data, versioned instructions that prevent drift, messaging that handles handoffs and onboarding through the same channel.

We saw this firsthand building the agent CRM on Tokenrip. The CRM wasn't the product. The primitives were: collections, published assets, messaging. The CRM was one configuration. Those same primitives could compose into a project tracker, a content pipeline, or a support system. Which raises the question: where does the value end up?

## Where the Value Is Going

The SaaS valuation correction in early 2026 [wiped roughly $285 billion from software stocks](https://www.uncoveralpha.com/p/the-great-saas-unbundling-why-ai). Publicis Sapient cut SaaS licenses by approximately 50 percent. [SMEs are saving £10,000 or more per year](https://www.startyourbusinessmag.com/blog/2026/04/17/9-ways-smes-are-already-replacing-saas-with-ai-agents-and-how-to-do-it) by replacing CRM, project management, analytics, and marketing SaaS with agent-driven workflows. [Bain, citing Gartner](https://www.bain.com/insights/will-agentic-ai-disrupt-saas-technology-report-2025/), projects 35 percent of point-product SaaS tools will be replaced by agents by 2030.

The money is moving from the bundle layer to the primitive layer.

HubSpot's moat was its opinions: how a pipeline should look, when a notification should fire, what a deal stage means. Those opinions had value when humans needed them to operate. When agents operate directly on primitives, the opinions become overhead.

Audit your operational stack against the three primitives. For each SaaS tool, ask: what's the data, what are the instructions, what's the messaging? If an agent can operate on those directly, the tool's interface is overhead you're paying for. The tool that felt indispensable when humans ran the workflow becomes optional the moment an agent takes over. And more tools are becoming optional every quarter.

The next generation of business software won't be better bundles. It will be better primitives, composable, typed, versioned, that agents assemble into whatever the operation requires. The companies building those primitives today are building the infrastructure layer that every agent-driven operation will run on.
