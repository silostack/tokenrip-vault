# Intelligence Engine — Design Document

**Status**: Design updated, ready to implement
**Created**: 2026-04-08
**Updated**: 2026-04-12
**Owner**: Simon
**Repository**: `intelwiki` (separate from vault)
**10x Roadmap**: Track 2 (2.1 AI/Agentic Landscape Wiki → evolved)
**Pattern**: Extended Karpathy LLM Wiki (four-layer: sources → signals → wiki → content)

---

## Purpose

An operational intelligence publication and compounding knowledge base for the AI/agentic space. The engine ingests raw sources (repos, articles, Reddit threads, X posts), extracts practitioner signals, synthesizes them into a structured wiki, and produces publication-ready content — blog posts and newsletters that help operators turn AI into action.

**The lens applied to ALL content: "How can I use this?"** Every page, every synthesis, every blog post is filtered through an operator's decision-making perspective. Not "what exists" but "what can I do with it, when should I use it, and what's the experience like in practice."

**The human curates sources, directs analysis, provides editorial judgment, and adds experiential color. The LLM handles extraction, signal correlation, synthesis, and knowledge maintenance.**

### Why This Exists

1. **Feed the publication.** Operators are drowning in scattered signal across Reddit, X, blog posts, and documentation. The engine does the surveillance so the editor can focus on editorial judgment. "Subscribe so you don't have to page through Reddit."
2. **Feed the build machine.** Tokenrip, Agent CLI, and social agents need continuous intelligence about the competitive landscape, tooling ecosystem, and coordination patterns.
3. **Compound knowledge.** Every source ingested produces tagged signals that correlate with existing knowledge. Cross-references build automatically. Contradictions get flagged. New information enriches existing pages through accumulated evidence.
4. **Enable future automation.** Researcher agents (Track 2.2), social agents (Track 3), and signal-to-action routing (Track 2.3) all need a structured knowledge substrate. The wiki + signal layer is that substrate.

### What This Serves

- **The publication** — blog posts, newsletter, social content. The primary output in Phase 1. Operational intelligence for agentic operators.
- **Tokenrip** — competitors, coordination patterns, asset routing approaches, agent collaboration tools
- **Agent CLI** — payment protocols, agent wallet providers, intent verification landscape, compliance developments
- **Social agents** — agent social platforms, coordination mechanisms, agent-to-agent interaction patterns
- **Build machine** — dev tooling, CI/CD approaches, deployment patterns, useful libraries and frameworks
- **General AI awareness** — model capabilities, infrastructure shifts, new platforms, industry moves

---

## Architecture

### Four Layers (Extended Karpathy Pattern)

1. **Sources** (immutable) — Articles, repo snapshots, Reddit threads, X posts, transcripts. The LLM reads from but never modifies these. Source of truth.
2. **Signals** (extracted, accumulating) — Discrete, tagged practitioner claims extracted from sources. Each signal captures a specific assertion with context, provenance, and corroboration tracking. This is the compounding moat layer — entity data from repo scans is replicable, but 200 correlated practitioner signals about a tool are not. The LLM extracts signals during ingest and updates corroboration as new signals arrive.
3. **Wiki** (LLM-maintained, signal-backed) — Entity pages, concept pages, comparisons, techniques, workflows, patterns, synthesis. Pages are **views over accumulated signals + structural data**. The LLM maintains this layer — creates, updates, cross-references, enriches with signal evidence. The editor reads it.
4. **Content** (published) — Blog posts, newsletter issues, social posts. Generated from wiki pages + signal evidence + editorial judgment. The engine surfaces interesting signal clusters; the editor spots the story and adds the angle.

The schema (CLAUDE.md) spans all layers — it tells the LLM how to extract signals, maintain the wiki, and structure content. Simon and the LLM co-evolve it as usage reveals what works.

### Repository Structure

```
intelwiki/
├── CLAUDE.md                    # Schema — LLM operating instructions
├── index.md                     # Wiki catalog organized by operator need
├── log.md                       # Chronological append-only operations log
├── wiki/
│   ├── entities/                # Companies, projects, tools, platforms, people
│   ├── concepts/                # Patterns, protocols, standards, architectures
│   ├── comparisons/             # Head-to-head analyses, landscape maps
│   ├── techniques/              # Specific approaches to solving operational problems
│   ├── workflows/               # Complete operational setups (composed techniques)
│   ├── patterns/                # Recurring solution shapes across techniques
│   └── synthesis/               # Cross-domain insights, strategic implications
├── signals/
│   ├── by-entity/               # Signals tagged to specific entities
│   ├── by-problem/              # Signals tagged to operational problems
│   └── _index.md                # Signal statistics, corroboration summaries
├── sources/
│   ├── inbox/                   # Drop links, notes, files here for processing
│   │   └── processed/           # Inbox items after processing
│   ├── repos/                   # Cloned GitHub repos (gitignored)
│   ├── articles/                # Saved article markdown (committed)
│   ├── reddit/                  # Saved Reddit threads as markdown (committed)
│   ├── x-posts/                 # Saved X posts/threads as markdown (committed)
│   └── other/                   # Transcripts, PDFs, misc (committed)
├── content/
│   ├── blog/                    # Published blog posts
│   ├── newsletter/              # Published newsletter issues
│   └── drafts/                  # Work-in-progress content
├── extracts/                    # Code snippets, patterns from deep scans (committed)
├── templates/                   # Page templates for each wiki + signal type
├── .gitignore                   # Ignores sources/repos/
└── .qmd.yml                    # QMD config (collection: intel, indexes wiki/ + signals/ + extracts/)
```

**What's committed vs. gitignored:**
- Committed: `wiki/`, `signals/`, `sources/articles/`, `sources/reddit/`, `sources/x-posts/`, `sources/other/`, `extracts/`, `content/`, `templates/`
- Gitignored: `sources/repos/` (cloned repos are ephemeral working material)
- QMD indexes: `wiki/` + `signals/` + `extracts/` (high-signal search results)

---

## Signal Schema

### What Signals Are

A signal is a discrete, tagged claim extracted from a practitioner source. Signals are the atomic unit of experiential knowledge. They capture what someone asserted, in what context, with what outcome — not editorialized, not synthesized, just extracted and tagged.

Signals accumulate over time. A single signal is an anecdote. Five independent signals saying the same thing are a pattern. Twenty are a consensus. The corroboration count tracks this.

### Signal Frontmatter

```yaml
---
id: sig-20260412-001
type: signal
signal_type: technique | frustration | recommendation | warning | comparison | experience
claim: "Restructuring CLAUDE.md into role-specific sections reduced agent drift on 30-min autonomous runs"
entities: [claude-code]
concepts: [agent-drift, memory-architecture]
problems: [agent-drift-on-long-tasks]
operator_context:
  stack: [claude-code, typescript]
  use_case: "autonomous coding on monorepo"
  scale: "single agent, 30-min sessions"
source: "sources/reddit/r-claudedev-memory-thread-20260410.md"
source_type: reddit | x-post | article | blog | community | own-testing
source_date: 2026-04-10
extracted: 2026-04-12
corroboration:
  count: 1
  supporting: []
  contradicting: []
confidence: low | medium | high
---

[Optional additional context or quotes from the source]
```

**Field notes:**
- `signal_type` — categorizes the nature of the claim:
  - `technique` — someone used an approach and reports on it
  - `frustration` — someone reports a problem or pain point
  - `recommendation` — someone recommends a tool/approach
  - `warning` — someone warns against a tool/approach or flags a gotcha
  - `comparison` — someone compares two or more things from experience
  - `experience` — general experience report that doesn't fit other types
- `operator_context` — what the person's setup/situation was (when stated). Not always available from source.
- `corroboration` — updated as new signals arrive that support or contradict this claim. `count` starts at 1 (the signal itself). `supporting` lists signal IDs that corroborate. `contradicting` lists signal IDs that disagree.
- `confidence` — assessed at extraction time. Single anonymous Reddit comment = low. Detailed blog post from known practitioner = high.

### Signal Storage

Signals are stored as individual markdown files in `signals/`. Organized into subdirectories by primary tag:

- `signals/by-entity/{entity-name}/` — signals primarily about a specific entity
- `signals/by-problem/{problem-name}/` — signals primarily about an operational problem

A signal lives in ONE directory (primary tag) but is cross-referenced via its frontmatter tags to all related entities, concepts, and problems. The `_index.md` file maintains aggregate statistics.

### How Signals Feed Wiki Pages

Wiki pages cite signals as evidence. A technique page about "reducing agent drift via CLAUDE.md restructuring" links to the 8 signals that corroborate this approach, notes the 2 that report mixed results, and surfaces the contextual factors that seem to determine success.

Entity pages gain a "Practitioner Experience" section drawn from accumulated signals. Comparison pages cite experiential signals from practitioners who used both tools.

The synthesis is in the wiki page. The evidence is in the signals. Provenance is preserved.

---

## Wiki Page Types

### Base Frontmatter (all pages)

```yaml
---
title: "CrewAI"
type: entity | concept | comparison | technique | workflow | pattern | synthesis
operator_need: orient | evaluate | implement | troubleshoot
tags: [agentic-economy, agent-tooling, competitor]
created: 2026-04-08
updated: 2026-04-08
sources: ["https://github.com/crewAIInc/crewAI", "sources/articles/crewai-launch-post.md"]
signals: ["sig-20260410-003", "sig-20260411-007"]
relevance:
  tokenrip: high | medium | low | none
  agent-cli: medium
  build-machine: low
  social-agents: none
status: stub | draft | complete
---
```

**Field notes:**
- `operator_need` — which operator need this page primarily serves:
  - `orient` — "What's out there? What are my options?"
  - `evaluate` — "Which should I choose?"
  - `implement` — "How do I do this?"
  - `troubleshoot` — "Something's not working, what do I do?"
- `signals` — IDs of key signals cited as evidence on this page
- `sources` — provenance chain back to raw sources (structural data)
- `relevance` — maps to strategic priorities
- `status` — shallow scan produces `stub`, enrichment with signals upgrades to `draft`/`complete`

### Page Types

| Type | Purpose | Operator Need | Example |
|------|---------|---------------|---------|
| **Entity** | A thing that exists — company, tool, project, platform, person. Reoriented: foregrounds what you can build with it, what breaks, practitioner experience. | Orient | `crewai.md`, `openclaw.md`, `hermes.md` |
| **Concept** | A pattern, standard, architecture, or idea. Framed as decision material: when to use, tradeoffs, real-world considerations. | Orient / Evaluate | `agent-memory-architectures.md`, `pull-vs-push-reachability.md` |
| **Comparison** | Two or more entities/concepts analyzed side-by-side. Signal-backed: cites practitioner experience, not just feature matrices. | Evaluate | `openclaw-vs-hermes.md`, `payment-protocols-landscape.md` |
| **Technique** | A specific approach to solving an operational problem, with context, evidence, and applicability criteria. Drawn primarily from signals. | Implement | `claudemd-restructuring-for-drift.md`, `token-budget-management.md` |
| **Workflow** | A complete operational setup composed of multiple techniques. How someone runs their agent stack end-to-end. | Implement | `claude-code-typescript-monorepo-setup.md` |
| **Pattern** | A recurring solution shape emerging across multiple techniques. Higher-order than technique — identifies the common structure. | Implement / Evaluate | `structured-context-injection-pattern.md` |
| **Synthesis** | Cross-domain insight connecting multiple entities/concepts/techniques. | Evaluate / Orient | `agent-drift-landscape.md`, `harness-convergence-analysis.md` |

---

## Operations

### 1. Ingest (via Universal Inbox)

Drop anything into `sources/inbox/`. The system auto-classifies and processes:

| Input | Detection | Action |
|-------|-----------|--------|
| GitHub URL | `github.com/*` | Clone → shallow scan (default) or deep scan (if `!deep` flag) → entity stub/page + signals |
| Article URL | Blog/article URL | Fetch via Scrapling → save to `sources/articles/` → signals + wiki pages |
| Reddit URL | `reddit.com/*` | Fetch thread → save to `sources/reddit/` → signal extraction (primary) + wiki updates |
| X/Twitter URL | `x.com/*` or `twitter.com/*` | Fetch post/thread → save to `sources/x-posts/` → signal extraction (primary) + wiki updates |
| Raw markdown file | `.md` with content | Save to `sources/articles/` → signals + wiki pages |
| Plain text notes | No URL, text content | Save to `sources/other/` → wiki page if substantive |
| Multiple URLs | One per line | Process each sequentially |

**Inbox file format is intentionally loose:**

```
https://reddit.com/r/ClaudeAI/comments/abc123/my_memory_setup
Notes: Detailed thread on CLAUDE.md structuring for long autonomous runs. Multiple practitioners sharing approaches.
Tags: agent-drift, memory-architecture, claude-code
```

Or as simple as:

```
https://reddit.com/r/ClaudeAI/comments/abc123/my_memory_setup
```

Processed files move to `sources/inbox/processed/`. All actions logged to `log.md`.

### GitHub Repo Ingest — Shallow Scan

1. Clone to `sources/repos/{org}-{repo}/`
2. Read README, key docs, package.json/Cargo.toml/etc.
3. Produce entity **stub** — what it is, problem it solves, tech stack, activity level (stars, last commit, release cadence), relevance assessment. Framed through "how can I use this?" lens.
4. Extract any signals (practitioner experiences mentioned in README, issues, discussions)
5. Update `index.md`, append to `log.md`
6. Delete clone (unless flagged for deep scan)

### GitHub Repo Ingest — Deep Scan

1. Clone to `sources/repos/{org}-{repo}/`
2. Everything from shallow, plus:
   - Grep for domain-relevant patterns (payment primitives, coordination protocols, asset routing, agent messaging, etc. — patterns defined in schema)
   - Map architecture (directory structure, key abstractions, data models)
   - Extract useful code snippets/patterns → save to `extracts/{repo}/`
   - Identify integration opportunities or competitive threats
   - Scan issues/discussions for practitioner signals
3. Produce **full entity page** with architecture, code patterns, and strategic assessment
4. Extract signals from issues, discussions, and any linked community threads
5. Create/update related concept/comparison/technique pages
6. Update `index.md`, append to `log.md`
7. Keep clone locally for follow-up queries (gitignored)

### Reddit Thread Ingest

1. Fetch thread via Scrapling → save to `sources/reddit/`
2. **Decompose thread into discrete signals.** A thread with 50 comments might produce 3-15 signals. Most comments are noise — extract only substantive claims.
3. For each signal, extract:
   - The specific claim being made
   - Entity/concept/problem tags
   - Operator context (stack, use case — when stated)
   - Signal type (technique, frustration, recommendation, warning, etc.)
   - Confidence assessment based on detail and specificity
4. Check extracted signals against existing signals for corroboration — update corroboration counts on both old and new signals
5. Update related wiki pages with new signal evidence
6. Append to `log.md`

### X/Twitter Ingest

1. Fetch post/thread via Scrapling → save to `sources/x-posts/`
2. Extract signals — X posts tend to produce fewer, higher-confidence signals than Reddit (more signal per post, less noise)
3. Same extraction schema as Reddit
4. Check corroboration, update wiki pages
5. Append to `log.md`

### Article Ingest

1. Fetch via Scrapling → save to `sources/articles/`
2. Dual extraction:
   - **Structural data** — entity facts, technical details, architecture descriptions → entity/concept wiki pages
   - **Signals** — any practitioner claims, experience reports, recommendations, warnings → signal files
3. Create/update wiki pages with both structural data and signal evidence
4. Check corroboration, append to `log.md`

### 2. Signal Extraction Principles

Across all source types, signal extraction follows these principles:

- **Decompose, don't summarize.** A Reddit thread is not one signal. It's N discrete claims that need individual extraction and tagging.
- **Preserve context.** The signal is useless without knowing the operator's stack, scale, and use case. Extract this when available, mark as unknown when not.
- **Tag generously.** A signal about "Claude Code memory management" should be tagged to both the entity (Claude Code) and the problem (memory-management, agent-drift if relevant).
- **Assess confidence honestly.** A throwaway comment ("CrewAI sucks") is low confidence. A detailed post with specific setup, steps taken, and measured outcomes is high confidence.
- **Check corroboration immediately.** When a new signal corroborates an existing one, update BOTH. The corroboration count is the signal layer's most valuable field.
- **Don't editorialize.** Signals record what was claimed, not what the LLM thinks about it. Synthesis happens in wiki pages, not signals.

### 3. Query

Ask a question → LLM searches wiki + signals (via QMD `intel` collection or by reading `index.md`) → synthesizes answer.

**Key behavior:** Good answers get filed back into the wiki. If a query produces a useful synthesis ("what are the current approaches to reducing agent drift?"), it becomes a synthesis or technique page. Knowledge compounds instead of disappearing into chat.

### 4. Signal Surfacing (evolved Lint)

Periodic intelligence report for the editor. The LLM analyzes the signal layer and wiki for:

**Signal trends:**
- Signal volume by entity/problem — what's getting talked about more/less
- Corroboration spikes — techniques or frustrations that multiple sources are confirming
- Sentiment shifts — entities whose signal mix is trending positive or negative
- Emerging problems — new problem tags appearing in signals that don't have wiki pages yet
- Technique convergence — multiple signals pointing to the same solution from different sources

**Wiki health:**
- Stale pages — entities not updated in X weeks, especially fast-moving ones
- Signal-starved pages — wiki pages with few or no supporting signals (need enrichment)
- Contradictions — page A says X, page B says Y, or signals contradicting wiki assertions
- Orphans — pages with no inbound links
- Missing cross-references — entities mentioned in prose but not linked
- Coverage gaps — domains with thin coverage relative to strategic relevance

**Editorial briefing:**
- "This week's story candidates" — the 3-5 most interesting signal clusters that could become blog posts
- Suggested angles for each based on signal evidence
- Inflection points — anything that changed significantly since last surfacing

The signal surfacing report is the editor's primary tool. Engine does surveillance, editor does judgment. This runs on a configurable cadence (weekly by default, more frequently during high-activity periods).

### 5. Refresh

Targeted re-ingest of a specific entity. Re-clone a repo, re-fetch community threads, compare what changed, extract new signals, update the wiki page. Signal surfacing identifies refresh candidates; can also be triggered manually.

### 6. Content Production

Blog posts and newsletter issues are produced from the wiki + signal layer with editorial direction:

1. **Signal surfacing** produces editorial briefing (trending signals, story candidates)
2. **Editor** selects the story and the angle
3. **Engine** generates draft from wiki pages + signal evidence, applying the editorial angle
4. **Editor** adds own experience, voice, and editorial judgment
5. **Published content** saved to `content/blog/` or `content/newsletter/` — itself a source that can be referenced

Content is NOT just reformatted wiki pages. It's a synthesis shaped by editorial direction, backed by signal evidence, and colored by the publication's own practitioner experience.

---

## Domains of Interest

Organized by operator need, not just by topic:

| Domain | What We Track | Why | Operator Need |
|--------|--------------|-----|---------------|
| **Agent operations** | Productivity techniques, drift solutions, memory architectures, prompt engineering, session management | Core operator pain points — the bread and butter | Implement, Troubleshoot |
| **Agent tooling & frameworks** | Orchestration frameworks, harnesses, SDKs, MCP servers, agent capabilities | Tool selection — operators evaluating options | Evaluate, Orient |
| **Agentic collaboration** | Multi-agent coordination, shared context, workspace patterns, inter-agent communication | Our depth area — the collaboration thread woven into operational content | Orient, Evaluate, Implement |
| **Agentic economy** | Payments, coordination, deliverables, agent commerce | Core thesis for Agent CLI + Tokenrip | Orient, Evaluate |
| **AI developments** | Models, capabilities, infrastructure, platforms | General awareness + "how can I use this?" filtering | Orient |
| **Agent social platforms** | AgentCommune, Moltbook, agent interaction patterns | Social agent deployment (Track 3) | Orient |
| **Competitors** | Direct competitors to Tokenrip and Agent CLI | Strategic positioning | Evaluate |
| **Build machine tools** | CI/CD, deployment, dev tooling, useful libraries | Our own operational improvement | Implement |

**Coverage priority:** Agent operations (broadest audience, highest signal volume) > Agent tooling (evaluation content, comparison posts) > Agentic collaboration (depth thread, thought leadership) > everything else.

---

## Schema (CLAUDE.md) Contents

The schema is the LLM's operating manual. It covers:

1. **Purpose & context** — what the repo is, who it serves, strategic priorities, the "how can I use this?" lens
2. **Directory structure** — what goes where, what's gitignored, what QMD indexes
3. **Four-layer architecture** — sources, signals, wiki, content. How data flows between layers.
4. **Domains of interest** — what we care about and why, with examples, organized by operator need
5. **Signal extraction** — how to decompose sources into discrete signals, tagging taxonomy, confidence assessment, corroboration checking
6. **Page templates** — frontmatter + section structure for each page type (entity, concept, comparison, technique, workflow, pattern, synthesis)
7. **Ingest workflows** — inbox processing rules, URL classification, source-type-specific extraction (GitHub shallow/deep, Reddit thread decomposition, X signal extraction, article dual extraction)
8. **Operations** — how ingest, query, signal surfacing, refresh, and content production work
9. **Conventions** — naming (kebab-case), cross-referencing (wiki-links), tagging taxonomy (initial seed + rules for new tags), relevance scoring, operator need classification
10. **Content production** — how wiki + signals become blog posts and newsletter issues. Editorial workflow, voice guidelines, the publication's positioning.

The schema is a living document — co-evolved through usage. Starts opinionated on structure (hard to retrofit), loose on tagging and cross-referencing (only makes sense with content).

---

## Source Types

**Supported in v1:**
- GitHub repositories (shallow + deep scan) — structural entity data + issue/discussion signals
- Articles / blog posts (URL fetch) — dual extraction (structural + signals)
- Reddit threads (URL fetch) — signal extraction primary, decomposed into discrete claims
- X/Twitter posts and threads (URL fetch) — signal extraction, typically higher confidence per post
- Existing vault research (markdown import) — structural data + signals from prior analyses
- Tools / SDKs / APIs (docs + code scan) — structural entity data

**Future source types (schema acknowledges, no ingest workflow yet):**
- Agent social platform activity (AgentCommune, Moltbook)
- Podcasts / video transcripts
- Academic papers
- Own community discussions (when community features ship — same signal extraction pipeline)

The inbox + schema architecture is designed for new source types to be added by extending the URL-matching rules and adding new ingest workflows to the schema. No structural changes needed.

---

## Initial Seed

Bootstrap from existing vault knowledge + known high-value sources:

### Entities
- **Agent CLI competitors:** Catena Labs, Sponge, Sapiom, Skyfire, Ampersend
- **Agent frameworks/harnesses:** CrewAI, LangGraph, AutoGen, OpenClaw, Hermes
- **Agent social platforms:** AgentCommune, Moltbook
- **Protocols:** A2A, MCP, ACP, x402, MPP
- **Tools:** QMD, OpenClaw, Claude Code

### Concepts
- Agent-to-agent coordination patterns
- Deliverable rails vs payment rails
- Pull vs push agent reachability
- Asset graph as moat
- Intent-to-execution data
- Warehouse-to-factory framing
- Agent memory architectures
- Agent drift patterns and solutions

### Comparisons
- Payment protocol landscape (x402 vs MPP vs Handshake)
- Agent wallet providers
- Agent framework/harness comparison (OpenClaw vs Hermes vs CrewAI)

### Techniques (new — bootstrapped from signals)
- Starts empty — populated by signal extraction from Reddit/X ingests
- First target: agent drift solutions, memory management techniques, harness configuration patterns

### Patterns (new — emergent)
- Starts empty — emerges from having enough techniques to identify recurring shapes

### Synthesis
- Starts empty — emerges from having enough entities, concepts, and signals to connect

### First Inbox Batch
- Karpathy wiki gist (meta reference)
- QMD repo (`github.com/tobi/qmd`)
- Simon's Twitter reading backlog
- Key Reddit threads from r/ClaudeAI, r/LocalLLaMA, r/MachineLearning (operational content)
- OpenClaw and Hermes repos (Simon's active evaluation)

Seed entities bootstrapped from existing vault files in `__PROJECTS/agentic-economy/` — the LLM reads existing competitive analyses and strategy docs and produces wiki pages + extracts signals from any practitioner claims in those docs.

---

## Roadmap

### Near-term (weeks)
- **Researcher agents** (Track 2.2) — scheduled agents that monitor sources and drop items into inbox automatically. Reddit monitoring (key subreddits), X list monitoring. The inbox model is ready — agents just write files.
- **Vault extraction tooling** — skills/CLI to query the engine from vault context
- **Signal surfacing reports** — automated weekly editorial briefings

### Medium-term (months)
- **Intelligence Engine CLI** — `intelwiki ingest`, `intelwiki lint`, `intelwiki query "..."`, `intelwiki surface`. Wraps operations into repeatable commands.
- **Scheduled refresh cycles** — cron that re-scans high-relevance repos weekly, re-checks top Reddit threads
- **Twitter/X monitoring pipeline** — automated list/search monitoring, not just manual URL drops
- **Reddit monitoring pipeline** — automated subreddit monitoring for signal-rich threads
- **Content production tooling** — CLI/skill support for the editorial workflow (surfacing → draft → edit → publish)

### Long-term (emerges from usage)
- **Signal-to-action routing** (Track 2.3) — signal trends trigger plans or decisions automatically
- **Social agent integration** — deployed agents feed observations back into inbox from the field
- **Vault bridge** — automatic extraction/sync between intelwiki and the vault, via skills or CLI tooling
- **Community signal ingestion** — when own community ships, discussions feed into same signal pipeline
- **Multi-engine federation** — other teams/projects run their own intelwiki instances with shared schema

### Architectural Principle

The inbox is the universal input. Every future capability — researcher agents, social agents, CLI tools, scheduled jobs — just writes to the inbox. The ingest pipeline doesn't care who dropped the file there. The signal extraction pipeline doesn't care where the source came from — Reddit, X, own community, or a researcher agent's observation. Same extraction, same storage, same corroboration.

---

## Related Documents

- [[intelligence-engine]] — Vision roadmap, marketplace thesis, and positioning
- [[10x-roadmap]] — Parent roadmap (Track 2)
- [[platform-roadmap]] — Unified Tokenrip + Intelligence Engine platform roadmap
- [[tokenrip]] — Primary intelligence consumer (competitors, coordination patterns)
- [[agentcli-overview]] — Intelligence consumer (payment protocols, wallet providers, compliance)
- [[agentic-strategy-reference]] — Existing strategic analysis (seeds the wiki)
- `__PROJECTS/agentic-economy/` — Existing research and competitive analyses (seed source)
- `_bean/ideas/agentic-intelligence-marketplace.md` — Idea evolution log
