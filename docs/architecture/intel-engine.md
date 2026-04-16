# Intelligence Engine Architecture

The intelligence engine is a **knowledge compounding system** for the blog. It processes raw source material (articles, clippings, markdown notes) into structured signals, maintains a synthesized wiki, and produces blog-ready content. The engine code lives in this monorepo; the knowledge base it operates on is a separate repo.

Two repos, four concerns:

| Component | Location | Concern |
|-----------|----------|---------|
| **Intelligence Engine** | `apps/intel-engine/` (this monorepo) | Processing brain. Signal extraction, corroboration, wiki synthesis, content generation. |
| **Inteliwiki** | Separate repo (`inteliwiki/`) | Knowledge base. Sources, signals, wiki pages, content drafts. All markdown files. |
| **Publishing Pipeline** | `apps/blog-pipeline/` (this monorepo) | Handoff. Takes finished blog markdown from intel-engine output, publishes to Tokenrip API. |
| **Blog Frontend** | `apps/blog/` (this monorepo) | Read path. Renders published posts from Tokenrip. |

**Why this shape:**
- The engine is stateless code. The inteliwiki repo is the state.
- No database, no API server. The engine reads and writes markdown files.
- The same engine code can operate on any inteliwiki-structured repo.
- Blog publishing is a separate concern handled by the existing blog-pipeline.

---

## Four-Layer Architecture

The inteliwiki repo has four layers. Each layer builds on the one below it.

```
Layer 1: SOURCES (immutable raw material)
  sources/inbox/              Drop files here for processing
  sources/inbox/processed/    Successfully ingested files
  sources/articles/           Archived articles
  Clippings/                  Web clippings (Obsidian format)

Layer 2: SIGNALS (extracted, accumulating)
  signals/by-entity/          Signals organized by primary entity
  signals/by-problem/         Signals organized by primary problem
  signals/_index.md           Aggregate stats

Layer 3: WIKI (LLM-maintained, signal-backed)
  wiki/entities/              Tool, product, organization pages
  wiki/concepts/              Abstract topic pages
  wiki/comparisons/           Head-to-head comparison pages
  wiki/synthesis/             Cross-cutting analysis pages
  wiki/index.md               Auto-generated page index

Layer 4: CONTENT (published material)
  content/blog/               Blog-ready markdown drafts
  content/briefs/             Editorial briefings
```

Each layer compounds value from the layers below:
- **Sources** are immutable raw material — clippings, articles, notes.
- **Signals** are discrete practitioner claims extracted from sources. Each signal cites its source.
- **Wiki** pages synthesize multiple signals into actionable knowledge. Each claim references signal IDs.
- **Content** (briefs and blog drafts) is generated from wiki pages and signals, ready for publishing.

---

## Data Flow

```
Clipping / Article / Markdown Note
              |
         ┌────▼────┐
         │ INGEST  │  apps/intel-engine
         │         │
         │ 1. Parse source
         │ 2. Extract signals (LLM)
         │ 3. Corroborate against existing signals
         │ 4. Update wiki pages (LLM)
         │ 5. Write signals + wiki + log
         └────┬────┘
              |
     signals/ + wiki/ updated
              |
         ┌────▼─────┐
         │ SURFACE  │  apps/intel-engine
         │          │
         │ 1. Scan all signals + wiki
         │ 2. Compute health metrics
         │ 3. Identify story candidates (LLM)
         │ 4. Write editorial brief
         └────┬─────┘
              |
     content/briefs/ (human picks a story)
              |
         ┌────▼─────┐
         │ PUBLISH  │  apps/intel-engine
         │          │
         │ 1. Gather wiki page + cited signals
         │ 2. Draft blog post (LLM)
         │ 3. Enrich with SEO metadata (LLM)
         │ 4. Write blog-ready markdown
         └────┬─────┘
              |
     content/blog/ (human reviews draft)
              |
         ┌────▼──────────┐
         │ BLOG PIPELINE │  apps/blog-pipeline (existing)
         │               │
         │ Publish to Tokenrip API
         └────┬──────────┘
              |
     Tokenrip API → Blog Frontend
```

---

## Pipelines

### Ingest (source -> signals + wiki)

Input: Path to a source file (relative to inteliwiki root).

| Step | Type | What happens |
|------|------|-------------|
| 1. Parse source | Code | Read file, extract frontmatter (gray-matter), detect source type |
| 2. Extract signals | LLM | Structured extraction of practitioner claims, entities, confidence |
| 3. Build signal objects | Code | Generate unique IDs (`sig-YYYYMMDD-NNN`), normalize dates |
| 4. Corroborate | Code | Jaccard similarity on claims + entity/problem overlap against existing signals |
| 5. Write signals | Code | Store in `signals/by-entity/` or `signals/by-problem/` |
| 6. Wiki update | LLM | Create new wiki pages or update existing ones with new signal references |
| 7. Write wiki | Code | Merge frontmatter, append body for updates |
| 8. Rebuild index | Code | Regenerate `wiki/index.md` with all page titles |
| 9. Log | Code | Append operation to `log.md` |
| 10. Move source | Code | Move from `inbox/` to `inbox/processed/` |

Output: Signal files, wiki page updates, log entry, moved source.

### Surface (signals + wiki -> editorial brief)

Input: None (reads entire knowledge base).

| Step | Type | What happens |
|------|------|-------------|
| 1. Scan | Code | Read all signals and wiki pages |
| 2. Analyze | Code | Group signals by entity, find stale/orphan/signal-starved pages, detect coverage gaps |
| 3. Editorial brief | LLM | Identify 3-5 story candidates with angles and supporting signal IDs |
| 4. Write | Code | Store brief in `content/briefs/YYYY-MM-DD-brief.md`, append to log |

Output: Editorial briefing with story candidates, trends, gaps, and health metrics.

### Publish (wiki page -> blog draft)

Input: Wiki page path + optional editorial angle.

| Step | Type | What happens |
|------|------|-------------|
| 1. Gather | Code | Read wiki page, find cited signals + up to 10 related signals by entity overlap |
| 2. Draft | LLM | Generate blog post from wiki content + signals + angle |
| 3. Enrich | LLM | Generate SEO description, tags, FAQ |
| 4. Build frontmatter | Code | Assemble blog-pipeline-compatible metadata (slug, reading_time, publish_date) |
| 5. Write | Code | Store in `content/blog/YYYY-MM-DD-slug.md`, append to log |

Output: Blog-ready markdown with frontmatter matching the blog-pipeline format.

---

## Signal Schema

Each signal is a markdown file with YAML frontmatter:

```yaml
---
id: sig-20260413-001
type: signal
signal_type: technique        # technique | frustration | recommendation | warning | comparison | experience
claim: "Evals function as training data for agent harness engineering"
entities: [Better-Harness]
concepts: [harness engineering, evals]
problems: [agent performance improvement]
source: sources/inbox/some-clipping.md
source_type: clipping          # article | clipping | markdown | own-testing
source_date: '2026-04-07'
extracted: '2026-04-13'
confidence: high               # low | medium | high
corroboration:
  count: 2
  supporting: [sig-20260413-005]
  contradicting: []
---
Evals function as training data for agent harness engineering...
```

**Signal types:**

| Type | Meaning |
|------|---------|
| `technique` | A specific method or approach |
| `frustration` | A pain point or limitation |
| `recommendation` | An explicit suggestion |
| `warning` | A cautionary observation |
| `comparison` | A relative assessment between tools/approaches |
| `experience` | A first-hand account or anecdote |

**ID format:** `sig-YYYYMMDD-NNN` — date-scoped, sequential within the day.

**Corroboration:** Signals that share entities/problems and have >= 25% Jaccard similarity on claim tokens are linked bidirectionally via the `supporting` array. The `count` field tracks total corroboration (starts at 1 for the signal itself).

---

## Wiki Page Schema

```yaml
---
title: "Better Harness"
type: entity                   # entity | concept | comparison | synthesis
tags: [agent-tooling, eval-framework]
created: '2026-04-13'
updated: '2026-04-13'
sources: [sources/inbox/some-clipping.md]
signals: [sig-20260413-001, sig-20260413-005]
status: stub                   # stub | draft | complete
---
```

**Page types:**

| Type | Content |
|------|---------|
| `entity` | A specific tool, product, or organization |
| `concept` | An abstract topic (e.g., "eval-driven optimization") |
| `comparison` | Head-to-head analysis of two or more entities |
| `synthesis` | Cross-cutting analysis spanning multiple entities/concepts |

---

## LLM Integration

Five LLM calls across the three pipelines. All use the same pattern: structured prompt in, Zod-validated JSON out.

| Pipeline | Call | Purpose | Prompt file |
|----------|------|---------|-------------|
| Ingest | Extract signals | Pull practitioner claims from source content | `llm/prompts/extract-signals.ts` |
| Ingest | Update wiki | Create/update wiki pages with new signal references | `llm/prompts/update-wiki.ts` |
| Surface | Editorial brief | Identify story candidates from signal patterns | `llm/prompts/editorial-brief.ts` |
| Publish | Draft post | Write blog post from wiki + signals + angle | `llm/prompts/draft-post.ts` |
| Publish | Enrich | Generate SEO description, tags, FAQ | `llm/prompts/enrich-post.ts` |

The LLM client (`llm/client.ts`) wraps the Anthropic SDK. It strips JSON fencing from responses and validates against Zod schemas. No streaming, no tool use.

---

## Blog Pipeline Integration

The publish pipeline produces markdown files in `content/blog/` with frontmatter that matches the blog-pipeline's expected format:

```yaml
---
post_type: blog_post
title: "Article Title"
slug: article-slug
description: "SEO description, max 160 chars."
publish_date: '2026-04-13T10:27:16.145Z'
author: Tokenrip
tags: [tag1, tag2]
reading_time: 5
faq:
  - q: "Question?"
    a: "Answer."
---
```

The handoff is a file:

```bash
# Intel-engine produces the draft
bun run apps/intel-engine/src/cli.ts publish wiki/entities/better-harness.md

# Blog-pipeline publishes it to Tokenrip
bun run apps/blog-pipeline/src/cli.ts /path/to/inteliwiki/content/blog/2026-04-13-slug.md
```

The intel-engine never calls the Tokenrip API directly. It writes files; the blog-pipeline publishes them.

---

## Key Files

| Responsibility | File |
|---|---|
| CLI entrypoint | `apps/intel-engine/src/cli.ts` |
| Library exports | `apps/intel-engine/src/index.ts` |
| Type definitions (Zod) | `apps/intel-engine/src/types.ts` |
| Config (env vars) | `apps/intel-engine/src/config.ts` |
| Directory preflight | `apps/intel-engine/src/preflight.ts` |
| Signal parser/serializer | `apps/intel-engine/src/signals/parser.ts` |
| Signal ID generation | `apps/intel-engine/src/signals/id-generator.ts` |
| Corroboration engine | `apps/intel-engine/src/signals/corroborate.ts` |
| Wiki parser/serializer | `apps/intel-engine/src/wiki/parser.ts` |
| Wiki cross-reference detection | `apps/intel-engine/src/wiki/cross-ref.ts` |
| Repo file reader | `apps/intel-engine/src/repo/reader.ts` |
| Repo file writer | `apps/intel-engine/src/repo/writer.ts` |
| Wiki index rebuilder | `apps/intel-engine/src/repo/index-manager.ts` |
| Anthropic LLM client | `apps/intel-engine/src/llm/client.ts` |
| LLM response schemas | `apps/intel-engine/src/llm/schemas.ts` |
| Ingest pipeline | `apps/intel-engine/src/pipelines/ingest.ts` |
| Surface pipeline | `apps/intel-engine/src/pipelines/surface.ts` |
| Publish pipeline | `apps/intel-engine/src/pipelines/publish.ts` |
| Signal extraction prompt | `apps/intel-engine/src/llm/prompts/extract-signals.ts` |
| Wiki update prompt | `apps/intel-engine/src/llm/prompts/update-wiki.ts` |
| Editorial brief prompt | `apps/intel-engine/src/llm/prompts/editorial-brief.ts` |
| Blog draft prompt | `apps/intel-engine/src/llm/prompts/draft-post.ts` |
| SEO enrichment prompt | `apps/intel-engine/src/llm/prompts/enrich-post.ts` |
