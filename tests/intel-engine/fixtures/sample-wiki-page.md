---
title: Claude Managed Agents
type: entity
tags:
  - anthropic
  - managed-agents
  - tool-use
created: 2026-04-08
updated: 2026-04-10
sources:
  - "Clippings/Claude Tool Use and Managed Agents.md"
signals: []
status: draft
---

Claude Managed Agents is Anthropic's framework for orchestrating multiple Claude instances as sub-agents within a larger workflow. Each managed agent receives a dedicated system prompt and tool set, enabling task decomposition across specialized roles.

## How can I use this?

Use managed agents when a single prompt cannot handle the full scope of a task. Decompose into sub-agents for research, code generation, review, and synthesis. Each agent operates independently with its own context window.
