# CLAUDE.md — blog-engine

## Commands

```bash
bun install              # Install deps (from monorepo root)
bun run dev              # Dev server with tsx watch (port 3500)
bun run build            # Compile TypeScript to dist/
bun run start            # Run compiled build
bun run reindex          # Rebuild SQLite index from storage
```

## Architecture

Fastify server that owns article storage, SQLite index, and the publishing pipeline.

**Storage:** Markdown files with YAML frontmatter are the source of truth. Stored at `{STORAGE_PATH}/{slug}.md`.

**SQLite:** Disposable derived index. Delete and reindex to rebuild. No migrations — drop and recreate.

**API:** See `docs/plans/2026-04-09-blog-engine-design.md` for the full API surface.

## Enrichment

LLM-driven enrichment generates FAQ Q&A pairs, tags, descriptions, and JSON-LD structured data for published articles. Enrichment is **optional** — it is completely disabled when `ANTHROPIC_API_KEY` is not set.

**Background scanner:** When enabled, a 30-second `setInterval` scans stored articles for missing `jsonLd.faq` in frontmatter. It enriches one article per tick to avoid flooding the API.

**Manual trigger:** `POST /articles/:slug/enrich` kicks off enrichment for a specific article. Returns 503 if the API key is not configured.

**Merge strategy:** Additive — the LLM output only fills in missing fields. Existing frontmatter values are never overwritten.

**Concurrency control:** An in-memory `Set` tracks slugs currently being enriched. Duplicate enrichment requests for the same slug are skipped.

## Environment Variables

See `.env.sample`.

| Variable | Default | Required | Description |
|---|---|---|---|
| `PORT` | `3500` | No | HTTP server port |
| `STORAGE_PROVIDER` | `local` | No | Storage backend |
| `STORAGE_PATH` | `./articles` | No | Markdown file storage directory |
| `SQLITE_PATH` | `./data/blog.sqlite` | No | SQLite index path |
| `BLOG_ENGINE_URL` | `http://localhost:3500` | No | Public URL of the blog-engine |
| `ANTHROPIC_API_KEY` | — | No | Anthropic API key. Enrichment disabled if not set. |
| `ANTHROPIC_MODEL` | `claude-sonnet-4-5-20250514` | No | Model used for enrichment LLM calls |
| `BLOG_AUTHOR_NAME` | `Tokenrip` | No | Author name written into JSON-LD article schema |
| `BLOG_AUTHOR_TYPE` | `Organization` | No | Author type (`Organization` or `Person`) for JSON-LD |
