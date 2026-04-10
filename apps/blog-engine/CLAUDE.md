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

## Environment Variables

See `.env.sample`.
