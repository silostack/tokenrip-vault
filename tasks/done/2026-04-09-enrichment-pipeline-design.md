# Enrichment Pipeline Design

Agentic LLM-driven enrichment for blog articles. Extends the existing publish pipeline to automatically generate FAQ Q&A pairs, tags, polished descriptions, and structured data (JSON-LD, OG) using the Claude API.

## Architecture

Two-phase publish flow:

```
POST /articles/publish (raw markdown)
  ├─ Phase 1 (sync): basic enrichment (slug, excerpt, timestamp) → store → respond
  └─ Phase 2 (background): LLM enrichment (FAQ, tags, description, JSON-LD) → overwrite file → update index
```

A 30-second `setInterval` scanner finds articles missing `jsonLd.faq` in their frontmatter and enriches them one at a time. If the LLM call fails, the article is skipped and retried on the next tick.

## LLM Integration

Single Claude API call per article using `@anthropic-ai/sdk`. System prompt defines the output schema, user message contains the article title and content. Response is parsed as JSON.

**Prompt output schema:**

```json
{
  "description": "SEO summary, max 160 chars",
  "tags": ["tag1", "tag2", "tag3"],
  "faq": [
    { "q": "Question text?", "a": "Answer text." }
  ],
  "og": { "type": "article" }
}
```

**Model:** Configurable via `ANTHROPIC_MODEL` env var, default `claude-sonnet-4-5-20250514`.

## Merge Strategy

Additive — LLM output fills in missing frontmatter fields, never overwrites existing values. If an article already has manually-set tags or description, those are preserved. The LLM fills in the rest.

## Detection

An article needs enrichment if its frontmatter has no `jsonLd.faq` field. The scanner reads each file from storage, parses frontmatter, and checks. No schema changes to SQLite.

## Concurrency

An in-memory `Set<string>` tracks slugs currently being enriched. The scanner skips any article already in progress. This prevents double-processing if a scan tick fires while a previous LLM call is still running.

## Processing Rate

One article per scan tick (30 seconds). A batch of 20 unenriched articles processes in ~10 minutes. This avoids API rate limit issues and keeps the system predictable.

## Manual Trigger

`POST /articles/:slug/enrich` — force-triggers enrichment for a specific article. Useful for re-enriching after prompt changes or for testing.

## Error Handling

- JSON parse failure → log warning, skip, retry next tick
- API error (rate limit, timeout) → log warning, skip, retry next tick
- No crash, no data loss — worst case is enrichment takes longer

## New Dependencies

- `@anthropic-ai/sdk` — Claude API client

## New Environment Variables

- `ANTHROPIC_API_KEY` — required for enrichment (enrichment disabled if not set)
- `ANTHROPIC_MODEL` — model to use (default: `claude-sonnet-4-5-20250514`)
- `BLOG_AUTHOR_NAME` — author name for JSON-LD Article schema (default: "Tokenrip")
- `BLOG_AUTHOR_TYPE` — author type for JSON-LD (default: "Organization")

## Key Decisions

- **Background over synchronous** — LLM calls take 5-30s, blocking the publish endpoint is fragile
- **Single call over multiple** — one round-trip for all enrichment fields, cheaper and simpler
- **setInterval over @fastify/schedule** — fixed interval, no cron expressions needed, fewer dependencies
- **Frontmatter detection over SQLite column** — no schema change, derived from actual file state
- **Additive merge** — never overwrite manual edits, LLM fills gaps only
