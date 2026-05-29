# Cognee — AI Agent Memory Infrastructure

> **Research brief** | 2026-05-21 | Reference for potential "power memory" system integration

---

## Executive Summary

Cognee is an open-source memory control plane for AI agents (17k+ GitHub stars, 112 releases, peer-reviewed research). It combines vector embeddings with knowledge graphs to give agents persistent, improving memory — recall by meaning *and* by relationship. The API surface is deliberately simple: `remember`, `recall`, `forget`, `improve`. If Tokenrip ever needs a structured memory layer that goes beyond flat context windows, Cognee is the most mature open-source option in this space.

**Repo:** github.com/topoteretes/cognee
**License:** Open-source (Apache 2.0)
**Language:** Python (87%), TypeScript (frontend)
**Requires:** Python 3.10–3.14

---

## What It Is

A memory infrastructure layer that sits between AI agents and their data. Agents use it to store, query, and refine knowledge over time. It's not a vector DB or a graph DB — it orchestrates both into a unified memory plane.

## How It Works

| Layer | What It Does |
|-------|-------------|
| **Ingestion** | Accepts multimodal data (text, structured, documents) and processes into dual representations |
| **Vector store** | Embeds data for semantic search ("find things that *mean* this") |
| **Knowledge graph** | Maps relationships between entities (Neo4j, KuzuDB) ("find things *connected* to this") |
| **Query router** | Automatically selects optimal search strategy per query — semantic, graph traversal, or hybrid |
| **Session memory** | Short-term working memory that syncs to permanent graph in background |

The core insight: documents that are both searchable by meaning *and* connected by relationships produce better recall than either approach alone.

## Four Core Operations

- **`remember(data)`** — Ingest and store. Permanent (knowledge graph) or temporary (session memory).
- **`recall(query)`** — Query with automatic routing to best search strategy.
- **`forget(data)`** — Delete when no longer needed. Supports data lifecycle.
- **`improve(feedback)`** — Refine memory from feedback. The system learns over time.

## Key Capabilities

- **Multi-tenancy / agentic isolation** — Each agent gets its own memory namespace
- **Ontology grounding** — Anchor memory to domain-specific knowledge structures
- **OpenTelemetry** — Built-in observability for memory operations
- **Audit trails** — Full traceability of what was remembered, recalled, modified
- **Cross-agent knowledge sharing** — Agents can share memory selectively

## Example Use Cases

**Customer support agent:** Unifies interaction history, financial records, and product data. Agent resolves issues using historical context and pattern recognition across the full customer relationship — not just the current ticket.

**Knowledge distillation (expert → junior):** Captures expert reasoning patterns (e.g., SQL query workflows). Junior analysts query the memory to get adapted historical solutions, operating at near-expert proficiency without the years of accumulated experience.

**Power memory for autonomous agents:** An agent that runs recurring tasks can accumulate operational knowledge — what worked, what failed, which approaches were confirmed — and recall that knowledge contextually in future runs.

## Deployment Options

| Option | Notes |
|--------|-------|
| **Cognee Cloud** | Managed SaaS |
| **Self-hosted** | Modal, Railway, Fly.io, Render, Daytona |
| **Local** | `uv pip install cognee` + env vars for LLM provider |

## Integrations

- Claude Code (official plugin)
- OpenAI and multi-provider LLM support
- Neo4j and KuzuDB for graph storage
- Generic agent SDK

## Relevance to Tokenrip

**Potential application:** If mounted agents need durable memory that persists across sessions and improves over time — beyond what flat file memory or conversation context provides — Cognee could serve as the memory substrate. The multi-tenancy model maps cleanly to per-agent isolation, and the `improve` loop aligns with the idea of agents that get better with use.

**When this matters:** When operators start requesting agents that "remember" across interactions (e.g., a Chief of Staff that accumulates context about the operator's business over weeks/months). Current file-based memory works for single-session recall but doesn't support relationship-aware retrieval or continuous refinement.

**Watch for:** Cognee's managed cloud pricing, stability at scale, and whether the knowledge graph overhead justifies itself vs. simpler RAG approaches for our use cases.

---

*Source: GitHub README, project documentation, published research (arXiv:2505.24478)*
