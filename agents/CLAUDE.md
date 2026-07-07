# Agents Directory

This directory contains documentation for Tokenrip's operational agents — both persona agents (Yoda, Bean) and system agents (engagement, blog).

## Persona Agents

| Agent | Role | Description |
|-------|------|-------------|
| **yoda/** | Strategic mentor | Coaching, accountability, pattern tracking. Tracks goals, surfaces patterns, holds Simon accountable. |
| **bean/** | Thinking partner | Idea exploration, sparring, non-obvious connections. Engages with ideas on their own merits — no priority filtering or execution baggage. |

Persona agents have their own context files, memory, and session logs. They are invoked via Claude Code commands (`/yoda`, `/bean`).

## System Agents

System agents follow the **bootloader pattern**: a thin local command (`.claude/commands/<agent>.md`) loads full instructions from Tokenrip assets at runtime. This means multiple operators run the same agent, updates happen by publishing new asset versions, and every instruction set is versioned.

| Agent | Role | Description |
|-------|------|-------------|
| **engagement-agent/** | Outreach + CRM | Manages agent-to-agent outreach lifecycle: send pitch emails, ingest responses, classify leads, draft follow-ups, send approved responses. Four modes: `ingest`, `draft`, `outreach`, `send`. Backed by two Tokenrip collections + AgentMail. |
| **blog-agent/** | Content pipeline | Produces Tokenrip blog posts: research → write → gate → edit → humanize → publish. Single linear pipeline with automated quality gates and human checkpoints. Publishes directly to Tokenrip. *(The "Intelligence Engine" motion this pipeline served was archived 2026-06-04; the pipeline itself still functions.)* |

## External Agents

Unlike the above, this agent runs as its own process (not invoked via Claude Code) —
it's included here only because it writes into this vault.

| Agent | Role | Description |
|-------|------|-------------|
| **hermes/** | Tokenrip operator | Autonomous distribution-planning, outreach-drafting, and code-pickup for Tokenrip, run by the separate Hermes agent process on this VPS. Read-only elsewhere in this vault — this is its one write exception (activity log + Tokenrip artifact mirror). Full mandate: `/home/dbot/projects/hermes-vault/CHARTER.md`. |

### Bootloader Pattern

```
Local command (.claude/commands/)     →  fetches assets from Tokenrip at runtime
  contains: config, routing                contains: full agent logic, versioned
                                      →  reads/writes Tokenrip collections (if applicable)
                                      →  interacts with external services (if applicable)
```

Each system agent directory contains a `*-full-reference.md` with complete technical details: asset IDs, schemas, workflows, CLI commands, and design decisions. These references are sufficient to reconstruct the agent from scratch.

### Key Files

| File | What It Contains |
|------|-----------------|
| `engagement-agent/engagement-agent-spec.md` | Why the engagement agent works the way it does — reasoning and design rationale |
| `engagement-agent/engagement-agent-design.md` | Final architecture: assets, collections, mode workflows |
| `engagement-agent/engagement-agent-full-reference.md` | Complete technical reference: IDs, schemas, CLI commands, troubleshooting |
| `blog-agent/blog-agent-full-reference.md` | Complete technical reference: asset registry, 11-phase pipeline, quality gates |
