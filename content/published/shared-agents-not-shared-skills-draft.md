---
title: "Shared Agents, Not Shared Skills"
slug: shared-agents-not-shared-skills
post_type: thesis
created: 2026-04-28
word_count: 1696
sources: content/sources/shared-agents-not-shared-skills/references.md
keywords: [shared agents, thin command pattern, agent distribution, bootloader pattern, multi-operator agents]
meta_description: "Sharing a skill file between agents solved instruction drift. Scaling the pattern turned it into something else: shared agents loaded at runtime from published assets."
---

# Shared Agents, Not Shared Skills

We started by sharing a skill file between two agents. A published asset both could fetch before every run, so they'd always follow the same instructions. It solved instruction drift. Both agents, same version, every time.

Three weeks later, we weren't sharing a skill. We were sharing an entire agent. Four operational modes, two data collections, six published assets defining the system's behavior. The local file on each machine was twenty lines of config and routing. Everything else lived on a shared surface, fetched at runtime. Different machines, different operators, same system.

The progression from shared skill to shared agent wasn't planned. It was forced by a specific limitation: a skill tells an agent how to do one thing. An operation requires a system.

## A Skill Solves One Problem. An Operation Needs a System.

The [SKILL.md pattern](https://bibek-poudel.medium.com/the-skill-md-pattern-how-to-write-ai-agent-skills-that-actually-work-72a3169dd7ee) is now established across Claude Code, Codex, OpenClaw, and other agent platforms. A skill is a markdown file with instructions the agent loads when relevant. It works well for discrete tasks: format code this way, follow this commit message convention, use this testing approach.

Publishing a skill as a versioned asset solved a real problem. When two agents on different machines both fetch the same published skill before running, they stay in sync. Everyone's on the same version, always. We wrote about this pattern earlier in the series, and it works.

But a skill is just instructions for one activity. When we needed to build something operational, a system that ingests data, classifies it, drafts responses, gets human approval, and sends, the skill pattern hit its ceiling. Each of those modes has its own logic, its own data access patterns. They fail in different ways. A single skill file trying to contain all of that becomes a monolith: thousands of tokens of instructions loaded into context regardless of which mode you're running. The agent doing ingestion doesn't need drafting rules. The agent sending outreach doesn't need classification logic.

So we didn't write a bigger skill. We built a system of skills, with shared vocabulary and independent modes, loaded selectively at runtime.

## The Local File Is Twenty Lines. The Agent Lives Somewhere Else.

The local command file on each operator's machine does three things.

First, it holds machine-specific configuration: API keys, inbox identifiers, contact labels. The stuff that differs between operators and shouldn't live on a shared surface.

Second, it routes to the right mode based on arguments. Run it with "ingest" and it fetches the ingestion instructions. "Draft" pulls the drafting logic. "Send" pulls the outreach workflow.

Third, it fetches the real operating logic from published assets. Every mode's instructions live as a separate versioned asset on a shared surface. The local file never contains business logic. It's a bootloader: it knows where the agent is, loads it, and gets out of the way.

We call this the thin command pattern. The local file is thin (twenty lines of routing and config), and the remote assets are the actual agent (hundreds of lines of operating logic across six published documents). The local file never changes. The published assets evolve constantly.

The pattern mirrors something familiar from infrastructure. A container doesn't ship its configuration baked in. It reads config from environment variables and fetches secrets at startup. The application is the image, the runtime context is the environment. The thin command pattern does the same thing for agents: the application is the published instructions, the runtime context is the local config file.

When we update the drafting tone or change the classification criteria, we update one published asset. Every operator running the system picks up the change on their next run, without anyone sending a "pull the latest" message or coordinating a redeployment.

## Shared Vocabulary Keeps Independent Modes Aligned

A system with multiple modes needs something they all agree on. In this architecture, a common asset defines the shared vocabulary: what the collection schemas look like, how contacts get classified into tiers, what quality standards apply to drafted responses, and what the email template contains.

Every mode reads this common asset. It's the contract. Ingestion knows what columns exist in the contacts table. Drafting knows what tone to use. Outreach knows what tier thresholds mean. All of that comes from one document, and if the document changes, every mode picks up the new definitions.

Then each mode has its own asset with mode-specific instructions. The ingestion asset covers parsing incoming data, deduplication, and classification. Drafting gets its own document with response generation rules for each tier. Outreach has the review and send workflow. Each mode loads the common asset plus its own asset, nothing else. Context budget stays lean.

The same principle shows up in [how production multi-agent architectures](https://microsoft.github.io/multi-agent-reference-architecture/docs/design-options/Microservices.html) handle shared state: define the contract once, let each component evolve independently. We iterated on drafting tone seventeen times without touching ingestion logic. We changed classification tiers without rewriting the outreach workflow. Each mode only couples to the shared vocabulary, not to each other.

The [production data on multi-agent systems](https://medium.com/@Micheal-Lanham/multi-agent-in-production-in-2026-what-actually-survived-f86de8bb1cd1) backs this up. The surviving collaboration patterns in 2026 all have shared artifacts and phase gates. Open mesh systems where agents coordinate without shared structure failed in production testing. Bounded collaboration, where agents share vocabulary and operate independently within defined modes, is what actually works at scale.

## Agent Onboarding Is a Message, Not a Setup Wizard

The pattern's real test came when we needed a second operator running the same system.

The traditional approach is writing documentation, sharing credentials, walking them through setup, hoping they configure everything correctly. Enterprise SaaS products spend millions trying to reduce this friction with setup wizards and onboarding tutorials.

We sent a message instead. One structured message to the second operator's agent containing the complete setup: the local command file structure (which asset IDs to fetch for each mode, where to store the config), the collection identifiers the system operates on, and the contact labels the agent would need. It also included the common vocabulary asset so the receiving agent understood the system's conventions before its first run.

The receiving agent read the message, created the local file, and was operational. A human never translated documentation into configuration or installed a package and filled out a setup form. An agent received a message, processed it, and configured itself. The same messaging layer that handles "here's a draft for your review" handled "here's how to become part of this system."

This is different from how agent distribution works everywhere else. The [SKILL.md ecosystem](https://www.thepromptindex.com/how-to-use-ai-agent-skills-the-complete-guide.html) distributes skills through repository inclusion, which requires shared filesystem access. Agent marketplaces distribute packaged agents, which requires the receiver to adopt the package's assumptions about runtime, data access, and configuration. Both assume a human in the loop doing the setup.

The message-based approach treats onboarding as a coordination problem, not a distribution problem. And it exposes a gap the rest of the agent ecosystem hasn't closed.

## The Distribution Problem Nobody Solved

Agent platforms have invested heavily in how agents run (orchestration frameworks, runtime environments, context management) and what agents can do (tool registries, capability catalogs, MCP servers). Both matter.

But almost nobody is working on how agents get distributed across operators. How do you get the same agent, with the same logic and the same data access, running on a different person's machine? The current answers are all borrowed from software distribution: package it, publish it to a registry, have the operator install it. That works for skills, meaning discrete instruction files. It breaks down for systems.

A system isn't a file you install. It's instructions that reference data that reference other instructions. It has state (the collections it operates on), vocabulary (the shared definitions that keep modes aligned), and coordination patterns (who approves what, how handoffs work). Packaging all of that into an installable unit means freezing decisions that should stay fluid. Classification criteria change. Drafting tone evolves. Approval workflows get rewritten when someone realizes the first version was wrong. A package captures a snapshot; a published system stays current.

The [context layer problem](https://www.cio.com/article/4162650/moving-autonomous-agents-into-production-requires-a-universal-context-layer.html) gets attention because it's visible: agents hallucinate when they can't access the right data, and 57% of organizations report inadequate data foundations for AI. The distribution problem is quieter but just as real. You can build the best agent in the world, and if the only way to get it to a second operator is "clone this repo and update the config," you've built a prototype, not a product.

What's needed is a surface where agent instructions can be published as versioned assets, fetched at runtime, and kept in sync across operators. The same surface where the agent's data and coordination already live. We used Tokenrip for this, and the pattern worked because the distribution mechanism was the same as the operating mechanism. The broader point stands regardless of platform: agent distribution needs to be publishing, not packaging.

## Distribution Is Publishing, Not Packaging

The thin command pattern reframes agent distribution as a publishing problem. You don't package an agent and ship it. You publish its logic as versioned assets, publish its vocabulary as a shared document, and send a setup message to the new operator. The agent arrives as a set of references, not a bundle of files.

This changes how agents evolve. A packaged agent creates version fragmentation: operator A runs v1.3, operator B runs v1.1, and nobody knows which classification rules are current. A published agent has one version of truth. When you update the drafting instructions, every operator's next run uses the new version. When you change the common vocabulary, every mode picks up the change.

It also changes what "sharing an agent" means. You're not sharing code or a package. You're sharing a living system that stays synchronized through the same primitives it uses to operate: published assets for instructions, structured data for state, messaging for coordination and onboarding.

What we ended up with wasn't a product or a package. It was a published system that loads itself at runtime, operates on shared data, and replicates through its own messaging layer. Right now, everyone else is still treating agents as files to install.
