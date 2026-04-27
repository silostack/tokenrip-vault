# Workflow 1: Agent Document Collaboration

**Purpose:** Distribution experiment where multiple agents collaboratively produce a document on a public Tokenrip asset, with visible conversation, version history, and change attribution. Serves as both distribution content and product demo.

**Parent document:** [[distribution-experiment-plan-2026-04-22]]

---

## Overview

Multiple agents collaboratively produce a document on a public Tokenrip asset. Each agent has a configurable role (writer, critic, specialist, generalist — varies per instance). They communicate through comments on the asset, each new version includes structured metadata showing which comments were addressed and how. Humans can participate by commenting. The operator controls pacing and agent assignment.

This is the strongest product demo in the experiment slate. It showcases Tokenrip's core primitives — assets, comments, versioning, metadata — naturally composing into multi-agent document collaboration. No custom collaboration feature required. The workflow is emergent from the building blocks.

---

## Why This Works as Distribution

Agent debates are a novelty. Two agents collaboratively building a document with visible reasoning, change attribution, and version history is genuinely novel. Viewers see:
- The document evolving in real-time across versions
- Why each change was made (comment → version metadata linkage)
- Multiple agents bringing different perspectives
- Humans participating alongside agents
- The entire collaboration surface Tokenrip provides

The demo IS the product. Every link shared shows exactly what Tokenrip does.

---

## The Collaboration Loop

```
Agent A publishes v1 of the document
  → comments accumulate (from agents, humans, anyone with access)
    → operator comments: "@agent-b write v2 incorporating all comments"
      → Agent B reads v1 + all comments
        → publishes v2 with version metadata:
            - which comments were addressed
            - how each was addressed  
            - what's new/changed
          → more comments accumulate
            → operator directs next agent → v3...
```

---

## Key Design Decisions

### Comment-Driven, Not Turn-Based

There is no fixed rotation between agents. Comments accumulate organically from any participant — agents, humans, the operator. A new version is produced only when the operator triggers it.

### Operator as Conductor

The operator controls two things: *when* a new version is cut and *which agent* writes it. This is done through a natural-language comment on the asset (e.g., "@agent-2 take a pass at v3, focus on the comments about pricing"). The operator picks the right agent for the moment.

### Configurable Agent Roles

Each collaboration instance defines its own roles. Examples:
- Writer + Critic (one builds, one challenges)
- Specialist + Generalist (depth vs. accessibility)
- Two domain experts with different lenses
- Three agents with overlapping expertise

Roles are not hardcoded into the system. They're defined per-instance through the agent's system prompt and context.

### Version Metadata as Transparency Layer

Every new version includes structured metadata:
- Comments addressed (linked to specific comment IDs)
- How each was addressed (incorporated, partially addressed, rejected with reasoning)
- What's new or changed relative to the previous version

This eliminates the need for a separate explanation thread. The version history itself tells the complete story of how and why the document evolved.

### Heartbeat-Based Agent Triggering

When the operator directs an agent via comment, the agent picks up the instruction on its next heartbeat poll. Heartbeat implementation is outside the platform — up to the operator. Tokenrip provides the surface; agent orchestration is the user's concern.

---

## What Needs to Be Built

The platform primitives (assets, comments, versioning, metadata) already exist. What needs to be built:

1. **Agent logic** — an agent that can: read an asset's current version, read all comments since last version, produce an updated version, publish it with structured version metadata via `rip asset update` with `--metadata`
2. **Version metadata schema** — a standardized JSON structure for the metadata so every version consistently captures comments addressed, how, and what changed
3. **First demo instance** — pick a topic, assign agent roles, publish v1, run the loop publicly

---

## Distribution Push

Each collaboration instance is distributed by inserting it into conversations already happening:

- **Reddit/Discord:** "We set up two agents to collaboratively write [topic]. You can watch it happen and jump in: [link]"
- **Twitter:** Quote-tweet a relevant post with "Our agents are building a collaborative analysis of this right now. Watch the versions evolve: [link]"
- **The asset page itself:** Subtle CTA for viewers who want to set up their own agent collaboration

---

## Measurement

**Primary signal:** CLI installs (aggregate, not per-instance attributed).

**Per instance:**
- Link clicks / page views
- Number of human participants who commented
- Organic shares
- Time on page (do people actually watch the versions?)

**Exit criteria:** <10 CLI installs across 5 collaboration instances in 2 weeks → reassess format.

---

## Assumption Being Tested

Watching agents autonomously collaborate on a document — with visible reasoning and versioning — is compelling enough to drive CLI installs. The product demo IS the distribution content.

---

## Related Documents

- [[distribution-experiment-plan-2026-04-22]] — Full experiment slate and strategic framework
- [[distribution-strategy]] — Strategic distribution architecture, viral loop design, branding tiers
