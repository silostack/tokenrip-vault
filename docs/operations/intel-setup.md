# Intelligence Engine Setup

The intelligence engine processes a knowledge base repo (inteliwiki) through three pipelines: **ingest** (source -> signals + wiki), **surface** (signals + wiki -> editorial brief), and **publish** (wiki page -> blog draft). It runs as a CLI — no server, no database.

## Prerequisites

- **Bun** (latest) — runs the engine
- **Anthropic API key** — required for all LLM calls (signal extraction, wiki updates, content generation)
- **Inteliwiki repo** — the knowledge base repo cloned locally

## Quick Start

```bash
# 1. Install dependencies from monorepo root
bun install

# 2. Configure the engine
cp apps/intel-engine/.env.sample apps/intel-engine/.env
# Edit .env: set INTELIWIKI_PATH and ANTHROPIC_API_KEY

# 3. Drop a source file in the inbox
cp some-article.md /path/to/inteliwiki/sources/inbox/

# 4. Ingest it
bun run apps/intel-engine/src/cli.ts ingest sources/inbox/some-article.md
# → Extracted N signals, M wiki updates

# 5. Generate an editorial brief
bun run apps/intel-engine/src/cli.ts surface
# → Brief: content/briefs/2026-04-13-brief.md

# 6. Draft a blog post from a wiki page
bun run apps/intel-engine/src/cli.ts publish wiki/entities/some-entity.md
# → Draft: content/blog/2026-04-13-slug.md

# 7. Publish the draft to Tokenrip (via blog-pipeline)
bun run apps/blog-pipeline/src/cli.ts /path/to/inteliwiki/content/blog/2026-04-13-slug.md
```

---

## CLI Commands

### Ingest a single source

```bash
bun run apps/intel-engine/src/cli.ts ingest <source-path>
```

`<source-path>` is relative to the inteliwiki repo root (e.g., `sources/inbox/my-article.md`).

The pipeline:
1. Parses the source file (frontmatter + content)
2. Extracts practitioner signals via LLM
3. Corroborates new signals against existing ones
4. Creates or updates wiki pages via LLM
5. Writes signals to `signals/`, wiki updates to `wiki/`, appends to `log.md`
6. Moves the source to `sources/inbox/processed/` (if it was in the inbox)

### Ingest all inbox files

```bash
bun run apps/intel-engine/src/cli.ts ingest --inbox
```

Processes every `.md` file in `sources/inbox/` (excluding `processed/` and `failed/` subdirectories). Each file is ingested sequentially.

### Generate an editorial brief

```bash
bun run apps/intel-engine/src/cli.ts surface
```

Scans the entire knowledge base and produces an editorial briefing:
- 3-5 story candidates with angles and supporting signal IDs
- Trend observations
- Coverage gaps
- Wiki health metrics (stale pages, orphan pages, signal-starved pages)

Output: `content/briefs/YYYY-MM-DD-brief.md`

### Draft a blog post

```bash
bun run apps/intel-engine/src/cli.ts publish <wiki-page-path>
bun run apps/intel-engine/src/cli.ts publish <wiki-page-path> --angle "editorial direction"
```

`<wiki-page-path>` is relative to the inteliwiki repo root (e.g., `wiki/entities/better-harness.md`).

The pipeline:
1. Reads the wiki page and gathers cited + related signals
2. Drafts a blog post via LLM (optionally guided by the `--angle` flag)
3. Enriches with SEO metadata via LLM (description, tags, FAQ)
4. Writes blog-pipeline-compatible markdown

Output: `content/blog/YYYY-MM-DD-slug.md`

---

## Typical Workflow

### 1. Collect source material

Drop clippings, articles, or markdown notes into `inteliwiki/sources/inbox/`. Source files should have YAML frontmatter where possible (title, published date, tags), but raw markdown without frontmatter also works.

### 2. Ingest

```bash
# Process everything in the inbox
bun run apps/intel-engine/src/cli.ts ingest --inbox
```

Review the output — check `log.md` for a summary, inspect new signals in `signals/`, review wiki updates in `wiki/`.

### 3. Build signal density

Repeat steps 1-2 as new source material arrives. Signals accumulate and corroborate over time. The more sources you ingest, the stronger the corroboration network becomes.

### 4. Surface story candidates

```bash
bun run apps/intel-engine/src/cli.ts surface
```

Read the editorial brief. It identifies topics with enough signal density for a blog post, highlights trends, and flags coverage gaps in the wiki.

### 5. Publish a blog draft

Pick a story candidate from the brief. Find the corresponding wiki page and publish:

```bash
bun run apps/intel-engine/src/cli.ts publish wiki/concepts/eval-driven-optimization.md \
  --angle "eval-driven harness improvement as the new ML training paradigm"
```

### 6. Review and publish

Read the draft at `content/blog/YYYY-MM-DD-slug.md`. Edit if needed. Then publish via the blog-pipeline:

```bash
bun run apps/blog-pipeline/src/cli.ts /path/to/inteliwiki/content/blog/YYYY-MM-DD-slug.md
```

---

## Source File Format

The engine accepts markdown files with optional YAML frontmatter. Source type is auto-detected:

| Detection rule | Source type |
|---|---|
| Path contains `Clippings/` | `clipping` |
| Frontmatter tags include `clippings` | `clipping` |
| File extension is `.md` | `markdown` |
| Everything else | `article` |

### Minimal source (no frontmatter)

```markdown
# Article Title

Content goes here. The engine extracts signals from the content body.
```

### Source with frontmatter

```markdown
---
title: "Article Title"
published: 2026-04-10
tags: [clippings, ai-agents]
---

Content goes here. The engine uses `published` for signal dating.
```

---

## Environment Variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `INTELIWIKI_PATH` | -- | Yes | Absolute path to the inteliwiki repo |
| `ANTHROPIC_API_KEY` | -- | Yes | Anthropic API key for all LLM calls |
| `ANTHROPIC_MODEL` | `claude-haiku-4-5-20251001` | No | Model for all LLM calls |

### Choosing a model

The engine makes 2 LLM calls per ingest, 1 per surface, and 2 per publish. Model choice affects cost and quality:

| Model | Speed | Cost | Best for |
|---|---|---|---|
| `claude-haiku-4-5-20251001` | Fast | Low | Routine ingestion, high-volume processing |
| `claude-sonnet-4-6` | Medium | Medium | Blog drafts where quality matters |
| `claude-opus-4-6` | Slow | High | Complex synthesis, high-stakes content |

Set via environment variable:

```bash
ANTHROPIC_MODEL=claude-sonnet-4-6 bun run apps/intel-engine/src/cli.ts publish wiki/...
```

---

## Inteliwiki Directory Structure

The engine's preflight step creates these directories if missing:

```
inteliwiki/
├── sources/
│   ├── inbox/              # Drop source files here
│   │   ├── processed/      # Successfully ingested
│   │   └── failed/         # Failed ingestion
│   └── articles/           # Archived articles
├── Clippings/              # Web clippings (Obsidian format)
├── signals/
│   ├── by-entity/          # Signals organized by primary entity
│   │   └── entity-name/
│   │       └── sig-YYYYMMDD-NNN.md
│   └── by-problem/         # Signals organized by primary problem
│       └── problem-name/
│           └── sig-YYYYMMDD-NNN.md
├── wiki/
│   ├── entities/
│   ├── concepts/
│   ├── comparisons/
│   ├── synthesis/
│   └── index.md            # Auto-generated page index
├── content/
│   ├── blog/               # Blog-ready drafts
│   └── briefs/             # Editorial briefings
└── log.md                  # Operation log
```

---

## Blog Pipeline Integration

The intel-engine produces blog drafts; the blog-pipeline publishes them. The handoff is a file with compatible frontmatter.

### Intel-engine output format

```yaml
---
post_type: blog_post
title: "Article Title"
slug: article-slug
description: "SEO description (max 160 chars)"
publish_date: '2026-04-13T10:27:16.145Z'
author: Tokenrip
tags: [tag1, tag2, tag3]
reading_time: 5
faq:
  - q: "Question?"
    a: "Answer."
---

Article body in markdown...
```

### Publishing the draft

```bash
# Intel-engine writes the draft
bun run apps/intel-engine/src/cli.ts publish wiki/entities/better-harness.md
# → Draft: content/blog/2026-04-13-eval-driven-harness-optimization.md

# Blog-pipeline publishes to Tokenrip
bun run apps/blog-pipeline/src/cli.ts \
  /path/to/inteliwiki/content/blog/2026-04-13-eval-driven-harness-optimization.md
# → Published: eval-driven-harness-optimization (abc123-...)
```

The blog-pipeline handles Tokenrip API authentication, asset creation, slug collision detection, and update-vs-create logic.

---

## Testing

```bash
bun test tests/intel-engine/    # Run all intel-engine tests
```

Tests use mock LLM clients — no real API calls, no Anthropic key needed. Test fixtures in `tests/intel-engine/fixtures/`.

140 tests, 301 assertions covering:
- Signal parsing, serialization, ID generation
- Corroboration (Jaccard similarity, entity/problem gating)
- Wiki parsing, serialization, cross-reference detection
- Repo reader/writer (filesystem operations)
- All three pipelines (ingest, surface, publish)
- Config loading, preflight, CLI routing

---

## Verifying the Setup

```bash
# 1. Check the inteliwiki repo exists
ls $INTELIWIKI_PATH/sources/inbox/

# 2. Run a test ingest with a clipping
bun run apps/intel-engine/src/cli.ts ingest sources/inbox/some-clipping.md

# 3. Verify signals were created
ls $INTELIWIKI_PATH/signals/by-entity/

# 4. Verify wiki was updated
cat $INTELIWIKI_PATH/wiki/index.md

# 5. Check the log
tail -5 $INTELIWIKI_PATH/log.md

# 6. Run surface to verify full pipeline
bun run apps/intel-engine/src/cli.ts surface
cat $INTELIWIKI_PATH/content/briefs/$(date +%Y-%m-%d)-brief.md
```

---

## Troubleshooting

**"INTELIWIKI_PATH environment variable is required"**
Set `INTELIWIKI_PATH` in your `.env` file or pass it as an environment variable. It must be an absolute path to the inteliwiki repo.

**"ANTHROPIC_API_KEY environment variable is required"**
Set `ANTHROPIC_API_KEY` in your `.env` file. Get a key from console.anthropic.com.

**Model returns 404**
The default model in `.env.sample` may be outdated. Check which models are available in your Anthropic account and update `ANTHROPIC_MODEL`. Known working model: `claude-haiku-4-5-20251001`.

**LLM response fails Zod validation**
The LLM returned JSON that doesn't match the expected schema. This can happen with weaker models. Try a more capable model (e.g., upgrade from haiku to sonnet). Check the error message for which field failed validation.

**Source not moved to processed/**
The engine only moves sources that are in `sources/inbox/` (not in subdirectories like `processed/` or `failed/`). Check the source path.

**No signals extracted**
The source content may be too short or not contain practitioner-relevant claims. Check the LLM prompt by reading `apps/intel-engine/src/llm/prompts/extract-signals.ts` — the prompt defines what qualifies as a signal.

**Wiki pages not updated after ingest**
The wiki update step matches new signal entities/concepts against existing wiki page tags and titles. If there are no matching pages, only new pages are created (if the LLM determines they're needed). Check the log for details.

**Blog draft missing FAQ**
The enrichment LLM call generates FAQ. If the content is too short or the model can't generate meaningful questions, the FAQ array may be empty. This is normal — the blog-pipeline handles missing FAQ gracefully.

**gray-matter date parsing**
YAML dates (e.g., `source_date: 2026-04-08`) are auto-parsed to JavaScript Date objects by gray-matter. The engine normalizes these back to `YYYY-MM-DD` strings. If you see full Date strings in signal frontmatter (e.g., `Tue Apr 07 2026 19:00:00 GMT...`), the normalization may have been bypassed — check `pipelines/ingest.ts`.
