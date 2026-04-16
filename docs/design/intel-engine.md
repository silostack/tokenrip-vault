# Intelligence Engine (Knowledge Compounding)

> Design rationale for the intelligence engine. Captures *why* decisions were made.
>
> **Created 2026-04-13.** The intelligence engine replaces manual Claude Code sessions against the inteliwiki repo with a programmatic three-pipeline system. See `docs/architecture/intel-engine.md` for the system architecture and `docs/plans/2026-04-12-intelligence-engine.md` for the original implementation plan.

## Problem

Tokenrip's blog needs a steady stream of practitioner-focused content about the AI/agentic tooling landscape. The source material — articles, clippings, markdown notes — accumulates in a knowledge base repo (inteliwiki). Previously, a human ran Claude Code sessions against inteliwiki's CLAUDE.md to manually extract insights, update wiki pages, and draft blog posts.

This doesn't scale. Each session starts from scratch with no memory of what was extracted before. There's no corroboration — if two sources say the same thing, nobody tracks that. There's no systematic way to identify which topics have enough signal density to warrant a blog post. And the output (wiki updates, blog drafts) depends entirely on prompt quality in the moment.

## Decision: Separate Engine Repo from Knowledge Base

**The engine code (`apps/intel-engine/`) lives in the Tokenrip monorepo. The knowledge base it operates on (`inteliwiki/`) is a separate repo.**

### Why separate?

- The knowledge base is pure content — markdown files, YAML frontmatter. It has no code dependencies, no build step, no runtime. It's inspectable with any text editor.
- The engine is code with dependencies (Anthropic SDK, Zod, gray-matter). It belongs in the monorepo with the rest of the Tokenrip tooling.
- The same engine can operate on any repo that follows the four-layer directory structure. Swap the `INTELIWIKI_PATH` environment variable and point it at a different knowledge base.
- The knowledge base can be backed up, versioned, and shared independently of the engine code.

### Why not a single repo?

Mixing code and content creates friction. A `bun install` in the content repo would be confusing. Dependabot PRs would clutter the knowledge base history. The content repo should be git-diffable markdown files — nothing more.

## Decision: Four-Layer Architecture

**Sources, signals, wiki, and content are four distinct layers in the knowledge base. Each layer builds on the one below.**

### Why four layers instead of three?

The original inteliwiki had three layers: sources, wiki, and a "schema" layer. The problem: wiki pages were updated directly from sources with no intermediate representation. When two sources said similar things, there was no way to track the corroboration or know which claims were well-supported vs. speculative.

Signals are the missing layer. Each signal is a discrete claim extracted from a single source, with explicit confidence, entity tags, and corroboration tracking. Wiki pages then synthesize signals rather than synthesizing raw source material. This means:

- **Corroboration is measurable.** A claim backed by 5 signals from 5 sources is stronger than a claim from 1 source.
- **Coverage is auditable.** You can see which entities have signals but no wiki page (coverage gaps) and which wiki pages cite no signals (signal-starved).
- **Editorial decisions are data-driven.** The surface pipeline can identify story candidates by signal density, corroboration spikes, and stale pages.

### Why not go straight from sources to content?

Skipping the signal and wiki layers produces blog posts that are essentially summaries of individual sources. There's no compounding — reading 50 sources doesn't make the 51st blog post better than the 1st. Signals accumulate and corroborate over time; wiki pages synthesize across sources. Each new source makes the entire system smarter.

## Decision: Traditional Pipelines with LLM at Specific Steps

**The engine is a traditional data pipeline (parse, transform, write) with LLM calls at 5 well-defined steps. Not an autonomous agent loop.**

### Why not an agent?

An agent that reads sources, decides what to extract, maintains the wiki, and writes blog posts would be simpler to describe but harder to debug. When a blog post has a wrong claim, you need to trace it back through signal extraction, corroboration, wiki synthesis, and drafting. With an agent, that chain is opaque — it's "the agent decided."

With explicit pipelines:
- Each LLM call has a specific input schema and Zod-validated output schema. If the extraction is wrong, you can read the prompt and the response.
- Corroboration is deterministic code (Jaccard similarity), not LLM judgment.
- The pipeline steps are logged. You can re-run any step independently.

### Why not all-code (no LLM)?

Signal extraction, wiki synthesis, and blog drafting require language understanding. Regex and heuristics can't identify practitioner claims or synthesize knowledge across sources. The LLM is the right tool for these specific steps. The engine just constrains its scope: structured prompts in, validated JSON out, no open-ended reasoning.

## Decision: CLI + Library

**The engine exposes both a CLI for human use and library exports for programmatic use.**

### Why both?

The CLI is the primary interface — a human drops a clipping in the inbox, runs `ingest`, reviews the output. But the library exports enable automation: a future cron job, a webhook handler, or another agent that orchestrates the pipeline. Same pattern as `apps/blog-pipeline/`.

### Why not an API server?

The engine runs on demand, not continuously. There's no client polling for state updates. A long-running server would be idle 99% of the time. A CLI that runs, processes, and exits is the simplest model for batch operations against a file-based knowledge base.

## Decision: File-Based Storage (No Database)

**All state lives in markdown files in the inteliwiki repo. No database.**

### Why files?

- The knowledge base is markdown. Signals are markdown. Wiki pages are markdown. Blog drafts are markdown. Using a database to index markdown files adds a layer of indirection that makes debugging harder without adding query capability we need.
- The engine operates on the entire repo each run (read all signals, read all wiki pages). There are no complex queries — just "give me everything" followed by in-memory processing.
- Git provides versioning, diffing, and history for free. Every ingest run produces a diffable commit.
- File-based storage means `grep` and `find` work as query tools. An operator can debug signal extraction with `cat signals/by-entity/better-harness/sig-20260413-001.md`.

### When would we add a database?

If the knowledge base grows to thousands of signals and corroboration lookups become slow. The current approach reads all signals into memory (~16 signals takes milliseconds). At 10,000+ signals, an SQLite index (same pattern as the blog engine's original design) would make corroboration faster without changing the pipeline logic.

## Decision: Jaccard Similarity for Corroboration

**Signal corroboration uses Jaccard similarity on tokenized claims plus entity/problem overlap. Threshold: 25%.**

### Why Jaccard over LLM-based matching?

- Deterministic. The same inputs always produce the same corroboration results.
- Fast. No API calls during corroboration.
- Debuggable. You can see exactly which tokens overlapped.
- Good enough. At the current signal volume, false negatives (missed corroborations) are preferable to the latency and cost of LLM-based semantic matching.

### Why 25% threshold?

Empirically tuned. Lower thresholds (10-15%) produced too many false positives — signals about the same entity but different claims. Higher thresholds (40%+) missed legitimate corroborations where practitioners described the same technique in different words. 25% with the entity/problem overlap gate (signals must share at least one entity or problem to be compared) hits a practical sweet spot.

## Decision: Blog-Pipeline Handoff via Files

**The intel-engine writes blog-ready markdown to `content/blog/`. The existing blog-pipeline CLI publishes it to Tokenrip.**

### Why not publish directly?

- The intel-engine doesn't need Tokenrip credentials. It produces files. The blog-pipeline handles authentication, asset creation, and version management.
- A human reviews the draft before publishing. The file is the review artifact.
- The blog-pipeline already handles enrichment (it can add/override SEO metadata), slug collision detection, and update-vs-create logic. Duplicating that in the intel-engine would violate DRY.

### The handoff

```
intel-engine produces:  content/blog/2026-04-13-slug.md
blog-pipeline publishes: bun run apps/blog-pipeline/src/cli.ts /path/to/that/file.md
```

Two commands, clear separation of concerns.

## Alternatives Considered

| Alternative | Why rejected |
|---|---|
| **LangChain / LlamaIndex** | RAG frameworks designed for conversational retrieval, not structured signal extraction. We'd use 5% of the framework and fight the abstractions for the rest. The pipeline is simpler than any framework's hello world. |
| **Autonomous agent loop** | An agent that "figures out" what to extract and how to update the wiki is harder to debug, harder to test, and produces inconsistent results. Explicit pipelines with constrained LLM calls are more reliable. |
| **Database-backed knowledge base** | Adds infrastructure (PostgreSQL/SQLite) without proportional benefit. The entire knowledge base fits comfortably in memory. Files are inspectable, diffable, and git-tracked. |
| **Single monolithic pipeline** | One pipeline that ingests, surfaces, and publishes in sequence would couple the operations. You can't ingest without also surfacing. You can't surface without publishing. Three independent pipelines give you control over each step. |
| **Embedding-based corroboration** | Vector similarity via embeddings would catch semantic matches better than Jaccard, but adds an embedding model dependency, a vector store, and non-deterministic matching. Jaccard with entity gating is sufficient at current scale. |

## Future

- **Source type expansion** — Reddit threads, X posts, YouTube transcripts as source types with specialized parsers.
- **Embedding-based corroboration** — Supplement Jaccard with vector similarity when signal volume makes token overlap unreliable.
- **Automated scheduling** — Cron-triggered ingest of inbox, periodic surface runs, with Slack notifications for new editorial briefs.
- **Multi-model support** — Different LLM models for different pipeline steps (e.g., fast model for extraction, capable model for blog drafting).
