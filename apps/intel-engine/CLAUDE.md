# CLAUDE.md — intel-engine

## Commands

```bash
bun run apps/intel-engine/src/cli.ts ingest <source-path>   # Extract signals from a source, update wiki
bun run apps/intel-engine/src/cli.ts ingest --inbox          # Process all files in sources/inbox/
bun run apps/intel-engine/src/cli.ts surface                 # Generate editorial brief from signals + wiki
bun run apps/intel-engine/src/cli.ts publish <wiki-page> [--angle "..."]  # Draft blog post from wiki page
```

## Architecture

Intelligence engine that processes the inteliwiki knowledge base. Three CLI pipelines that read/write markdown files in the inteliwiki repo. No API calls to Tokenrip — produces blog-ready markdown that `apps/blog-pipeline/` publishes.

### Four-Layer Architecture

1. **Sources** — Raw material (clippings, articles, markdown notes) in `sources/`
2. **Signals** — Discrete practitioner claims extracted from sources, stored in `signals/by-entity/` and `signals/by-problem/`. Each signal has an ID, type, claim, entities, confidence, and corroboration tracking.
3. **Wiki** — Synthesized knowledge pages in `wiki/`. Entity pages, concept pages, comparisons, syntheses. Updated when new signals arrive.
4. **Content** — Editorial briefs (`content/briefs/`) and blog drafts (`content/blog/`). Generated from signals + wiki pages.

### Pipelines

**Ingest** (`ingest`): Source -> Signals + Wiki updates
1. Parse source frontmatter and content
2. LLM extracts practitioner signals (claims, entities, confidence)
3. Corroborate against existing signals (Jaccard similarity on claims)
4. Write signal files, update wiki pages, rebuild index
5. Move source to processed

**Surface** (`surface`): Signals + Wiki -> Editorial brief
1. Scan all signals and wiki pages
2. Compute metrics (stale pages, signal-starved pages, coverage gaps)
3. LLM generates editorial brief with story candidates
4. Write brief to `content/briefs/`

**Publish** (`publish`): Wiki page + Signals -> Blog draft
1. Gather wiki page and cited/related signals
2. LLM drafts blog post with signal-backed claims
3. LLM enriches with SEO metadata (description, tags, FAQ)
4. Write blog-pipeline-compatible markdown to `content/blog/`

### Key Files

- `src/cli.ts` — CLI entrypoint, routes to pipelines
- `src/index.ts` — Library exports
- `src/types.ts` — Zod schemas for signals, wiki pages, config
- `src/config.ts` — Environment variable loading
- `src/preflight.ts` — Directory structure initialization
- `src/signals/parser.ts` — Signal markdown parsing/serialization
- `src/signals/id-generator.ts` — Signal ID generation (sig-YYYYMMDD-NNN)
- `src/signals/corroborate.ts` — Jaccard similarity corroboration
- `src/wiki/parser.ts` — Wiki page parsing/serialization
- `src/wiki/cross-ref.ts` — Wiki link extraction and affected page detection
- `src/repo/reader.ts` — Read signals, wiki pages, inbox from repo
- `src/repo/writer.ts` — Write signals, wiki pages, logs to repo
- `src/repo/index-manager.ts` — Rebuild wiki index.md
- `src/llm/client.ts` — Anthropic SDK wrapper with Zod validation
- `src/llm/schemas.ts` — Zod schemas for LLM responses
- `src/llm/prompts/` — Prompt builders for each LLM step
- `src/pipelines/ingest.ts` — Ingest pipeline orchestrator
- `src/pipelines/surface.ts` — Surface pipeline orchestrator
- `src/pipelines/publish.ts` — Publish pipeline orchestrator

## Environment Variables

See `.env.sample`.

| Variable | Default | Required | Description |
|---|---|---|---|
| `INTELIWIKI_PATH` | — | Yes | Path to the inteliwiki knowledge base repo |
| `ANTHROPIC_API_KEY` | — | Yes | Anthropic API key for LLM calls |
| `ANTHROPIC_MODEL` | `claude-haiku-4-5-20251001` | No | Model for all LLM calls |

## Testing

```bash
bun test tests/intel-engine/    # Run all intel-engine tests
```

Tests use mock LLM clients — no real API calls. Test fixtures in `tests/intel-engine/fixtures/`.
