---
title: "Agency — Operating Knowledge Index"
date: 2026-06-17
status: active
owner: Simon
type: agency-index
related:
  - [[active/operating-gameplan-2026-06-04]]
  - [[bd/reference/operations-and-hiring]]
---

# Agency — Operating Knowledge

> For all intents and purposes, we run an AI-automation / forward-deployed-engineer agency. This folder holds **how we operate** — the tooling stack, runtime decisions, delivery playbooks, and raw intel from the AI-agency operator community. It does **not** hold *who we sell to* — deals, pipeline, and sales motion live in [[bd/CLAUDE]].

## Where things go

| Folder | Holds | Style |
| --- | --- | --- |
| `community/` | Raw captures from the AI-agency community (operator posts, threads) | **Verbatim**, provenance preserved |
| `stack/` | Tooling & runtime decisions (n8n vs runtimes, integrations, infra) | **Synthesized** — our own "so what" |
| `playbooks/` *(add on first content)* | Repeatable delivery patterns (onboarding flows, handoff, QA) | Synthesized |
| `operations/` *(add on first content)* | Running the agency — delivery, handoff, pricing | Synthesized; cross-links [[bd/reference/operations-and-hiring]] |

## Capture workflow

1. Drop the raw post **verbatim** into `community/` with `source:` provenance.
2. Distill the durable "so what for us" into the relevant `stack/` (or `playbooks/`) note.
3. Link the two: source note footer → synthesis; synthesis `related:` → source.

Keep `community/` raw and `stack/` synthesized — don't blur them. The raw note is the receipt; the synthesis is the decision.

## Live agency-framing docs (elsewhere in vault)

- [[active/operating-gameplan-2026-06-04]] — operating model: two deals foreground, autonomous machine background, one build serving both
- [[bd/reference/operations-and-hiring]] — hiring, founder time, capital implications
- `__RESOURCES/` — infrastructure research (Composio, Nango, Cognee) adjacent to the agency stack

## Contents

- `stack/automation-runtime-decisions.md` — n8n vs Claude Code vs Make/Zapier vs Trigger.dev/Modal; layers not substitutes; the n8n-MCP unlock
- `community/n8n-vs-runtimes-operator-take-2026-06-17.md` — source for the above
