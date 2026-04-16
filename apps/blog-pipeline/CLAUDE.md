# CLAUDE.md — blog-pipeline

## Commands

```bash
bun run apps/blog-pipeline/src/cli.ts <path-to-markdown-file>   # Publish a blog post
```

## Architecture

Publishing pipeline that takes raw markdown, enriches it with metadata, and publishes to Tokenrip as an asset. No server — this is a CLI tool / importable library.

**Pipeline steps:**
1. Parse YAML frontmatter (gray-matter)
2. Basic enrichment — slug from title, description from first paragraph, publish_date, reading_time
3. LLM enrichment (optional) — FAQ Q&A, tags, polished description via Claude API
4. Validation — required fields, non-empty content
5. Publish — `POST /v0/assets` with alias (slug) and metadata, or update existing via `PATCH` + new version

**Key files:**
- `src/pipeline.ts` — orchestrator
- `src/cli.ts` — CLI entrypoint
- `src/tokenrip-client.ts` — HTTP client for Tokenrip API
- `src/services/enrich.service.ts` — LLM prompt builder, additive merge, enrichContent function
- `src/services/publish.service.ts` — slugify, excerpt extraction

## Enrichment

LLM enrichment is **optional** — disabled when `ANTHROPIC_API_KEY` is not set. Runs inline during publish (no background scanner).

**Merge strategy:** Additive — LLM output only fills missing fields. Existing frontmatter values are never overwritten.

## Environment Variables

See `.env.sample`.

| Variable | Default | Required | Description |
|---|---|---|---|
| `TOKENRIP_API_URL` | `http://localhost:3434` | Yes | Tokenrip backend URL |
| `TOKENRIP_API_KEY` | — | Yes | API key for publishing |
| `ANTHROPIC_API_KEY` | — | No | Enrichment disabled if not set |
| `ANTHROPIC_MODEL` | `claude-sonnet-4-5-20250514` | No | Model for enrichment |
| `BLOG_AUTHOR_NAME` | `Tokenrip` | No | Author name in metadata |
| `BLOG_AUTHOR_TYPE` | `Organization` | No | Author type for JSON-LD |
