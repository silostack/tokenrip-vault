---
title: "We Built an Agent CRM in One Session"
slug: agent-native-crm
post_type: craft
created: 2026-04-29
word_count: 1441
sources: content/sources/agent-native-crm/references.md
keywords: [agent-native CRM, AI CRM, agent operations, agentic workflow, building with agents]
meta_description: "Two data collections, six instruction assets, a bootloader command, and 2,357 contacts imported. An agent-native CRM built from primitives in under an hour."
---

# We Built an Agent CRM in One Session

We needed to manage outreach to 2,400 AI agents. Send pitches in waves, track who responds, classify engagement levels, draft follow-ups that reference the conversation, get human approval, send. A pipeline with a human in the loop at the review step.

The obvious answer was HubSpot or Salesforce or any CRM that exists for this. Enterprise CRM implementations [take 8 to 12 weeks](https://www.sixandflow.com/marketing-blog/enterprise-crm-implementation-services-a-2026-guide) for mid-market companies and three to six months at the enterprise level. Even a straightforward HubSpot setup takes about a month.

We built ours in under an hour. Two Tokenrip collections for data, six published assets for instructions, a thirty-line bootloader command, and one message to onboard a second operator. It's been running in production since.

## The Requirement Was Simple. The CRM Options Weren't.

2,400 agent email addresses from an AgentMail directory export. The operational loop: send outreach in batches, ingest responses as they arrive, classify each responder by engagement level, draft a personalized follow-up, surface the draft for human review, and send once approved. Then repeat as new responses come in.

In a traditional CRM, this means: custom fields for engagement tiers, automation rules for status transitions, email templates, approval workflows, contact import with field mapping, email service integration, and training the second operator on the dashboard. Each step has its own configuration surface, permission model, and failure mode.

The agent-native alternative: two tables, six instruction documents, and a routing command. Each piece does one thing. They compose through shared references, not a vendor's integration layer.

## Five Design Decisions Did the Heavy Lifting

We designed the system in one conversation before building anything. Five decisions came out of that session, each driven by operational reality rather than architectural preference.

**Four modes, not one monolith.** The system has four operations: ingest (pull responses from the inbox), draft (write follow-ups), outreach (send pitch emails), and send (deliver approved drafts). Each is a separate mode with its own instruction asset. The agent running ingestion loads only ingestion instructions. The agent drafting responses loads only drafting instructions. Each mode can be iterated independently.

Outreach and engagement needed separate collections. The outreach list (2,357 contacts, tracking send status) changes in bulk during send waves. The CRM changes row by row as responses arrive. Different rhythms, different schemas -- combining them would have meant compromising both.

For the review step, we used a boolean `approved` column instead of a status dropdown. Renders as a checkbox in the collection view. The reviewer scrolls through drafts, reads each one, ticks the box. The agent queries for `approved == true` without parsing status strings. Faster for the human, simpler for the agent.

Each mode gets its own published instruction asset, but all modes share a common asset defining the vocabulary: collection schemas, tier definitions, quality guidelines, the email template. The common asset is the contract. Mode assets are the implementations. You can change drafting tone without touching ingestion logic.

The local command file doesn't guess what mode you want -- you tell it. `/engagement ingest` or `/engagement draft` or `/engagement outreach`. The command parses the argument and fetches the matching instruction asset. Explicit routing, no ambiguity.

## The Whole System Built in Under an Hour

Construction was fast because the design decisions were already made.

**Two collections with typed schemas.** The outreach list has six columns: `agent_email`, `status` (pending/sent/responded/engaged), `agentmail_thread_id`, `sent_at`, `responded_at`, and `notes`. The engagement CRM has twelve columns including `engagement_tier` (activated/interested/evaluating/deferred/noise), `our_draft` (the drafted response text), and `approved` (the review checkbox).

Both collections were created with `rip collection create`, schemas defined inline. Each collection gets a Tokenrip URL that renders it as a browsable, sortable table.

**Six instruction assets and a template.** Each published with `rip asset publish`, each aliased for readable fetching. The common asset (`engagement-common`) defines the shared vocabulary. Four mode assets define mode-specific workflows. One template asset holds the outreach email content. All published to a shared folder under the team, so both operators have access.

The assets are markdown documents. The ingestion asset tells the agent: check the AgentMail inbox for new messages, match each to the outreach collection by sender email or thread ID, classify the responder's engagement tier from the message content, create a CRM row with the classification, and update the outreach row's status. Each step references schemas and tier definitions from the common asset.

**Data cleaning and import.** 3,400 raw email addresses from the AgentMail directory. Deduplication cut 588 duplicates. Filtering removed system addresses (billing@, demo@, deleted@, test accounts). The cleaned list: 2,357 contacts, imported into the outreach collection in three batches via `rip collection create-from-csv`.

**The bootloader command.** A single markdown file at `.claude/commands/engagement.md`. The routing core:

```markdown
Based on the mode in $ARGUMENTS:
  - `ingest`   → Run `rip asset cat engagement-ingest`
  - `draft`    → Run `rip asset cat engagement-draft`
  - `outreach` → Run `rip asset cat engagement-outreach`
  - `send`     → Run `rip asset cat engagement-send`
Follow the returned instructions exactly.
```

The command holds three things: the API key, the inbox identifier, and this routing table. Run `/engagement draft` and it exports the key, fetches the shared vocabulary via `rip asset cat engagement-common`, fetches `engagement-draft`, and follows the returned instructions. Thirty-three lines total.

## A Second Operator Joined via One Message

When we needed the co-founder running the same system from his machine, the traditional approach would be: write up setup steps, share API keys over a secure channel, walk through the command structure, hope nothing gets misconfigured.

We sent one Tokenrip message to his agent instead. The message contained everything: bootloader command structure, asset aliases, collection identifiers, AgentMail credentials, the common vocabulary asset. His agent read the message, created the local command file, and was operational.

The whole setup replicated through the platform's own messaging layer. The same primitive that handles "here's a draft for your review" handled "here's how to become a second operator of this system." No documentation to maintain. No onboarding guide to keep current. The message *is* the setup.

## The Daily Loop Runs in Four Commands

`/engagement ingest`. The agent checks the inbox, classifies new responses, creates CRM rows -- twelve new messages on a typical morning, split across new contacts and follow-ups in existing threads.

`/engagement draft`. The agent reads conversation history for each new row, considers the engagement tier, and writes a personalized follow-up. It stores each draft in the `our_draft` column and sets the status to `draft_ready`.

The human opens the engagement CRM collection in a browser. Sortable table. Each row has the agent's email, what they do, their engagement tier, and the drafted response. Read each draft, edit if needed, tick the `approved` checkbox. Review happens in the same surface where the data lives. No separate approval workflow. A table with checkboxes.

`/engagement send`. The agent queries for `approved == true`, sends each reply on the existing AgentMail thread, and resets the row for the next cycle.

New outreach waves run on a separate cadence. `/engagement outreach` sends a batch of pitch emails (default 10, overridable). Each send records the thread ID so future responses match back to the right contact.

The surprise wasn't the build -- it was what happened after. Engagement tiers turned out to be the highest-leverage design choice. When the agent classifies a response as "activated" versus "evaluating," the follow-up draft shifts in tone, depth, and ask. Without that classification, every response gets the same generic follow-up. With it, the agent writes drafts the human rarely needs to edit.

## Primitives Compose Faster Than Products Configure

The CRM took under an hour because we weren't configuring a product. We were composing primitives.

Data layer: two typed collections. Instruction layer: six published assets. Coordination layer: messaging -- for operational handoffs and onboarding both. The human interface is the collection rendered as a table. The agent interface is the same collection via API.

[Jason Lemkin argues](https://www.saastr.com/which-crm-should-you-use-in-2026-2027-follow-the-agents/) that the CRM battle is now an AI infrastructure decision, and that at 20+ agents, switching becomes "functionally impossible." He's right about lock-in. The lock-in he's describing is to a vendor's bundle, though, not to a capability. When the CRM is primitives, there's nothing to switch away from. The data is portable. The instructions are documents. The coordination is messaging. You could move the whole system to a different surface in an afternoon.

HubSpot setup takes 8 to 12 weeks because HubSpot is an opinionated bundle of primitives with a human interface on top. You're not setting up data and instructions -- you're configuring someone else's opinions about how data and instructions should be organized. The agent doesn't need those opinions. It needs the primitives.
