# Blog Engine Design

Self-contained blog system optimized for agentic consumption. Two apps — a Bun frontend and a Fastify backend — designed to be copy/pasted into other projects.

## Architecture

```
Browser/Agent → nginx → /blog/* → blog (Bun, apps/blog/)
                                      ↓
                              blog-engine (Fastify, apps/blog-engine/)
                                      ↓
                              storage (local filesystem / S3)
```

Nginx routes all `/blog/*` requests to the blog frontend. The frontend calls blog-engine's API to fetch article data, then assembles the response.

### apps/blog/ (Frontend)

Bun HTTP server. Responsibilities:

- **`/blog`** — Index page. Calls `GET /articles` on blog-engine, renders article list server-side.
- **`/blog/:slug`** — Article page. Calls `GET /articles/:slug`, then:
  - SSR: renders `<head>` with meta tags, Open Graph, JSON-LD assembled from frontmatter
  - Body: raw markdown in a container (agent-readable without JS)
  - Client JS: renders markdown styled for humans using react-markdown + remark-gfm + rehype-highlight
- **Content negotiation:** `Accept: text/markdown` returns raw markdown, no HTML wrapper.

Static assets (CSS, JS bundle, images) served directly by Bun.

### apps/blog-engine/ (Backend)

Fastify server. Owns storage, SQLite index, publishing pipeline, and the article API.

## Markdown File Format

Single `.md` file per article. Stored at `{storage_root}/{slug}.md`. Frontmatter holds all metadata needed for SSR head rendering. The article body is standard markdown.

```markdown
---
title: "GENIUS Act Impact on Crypto Exchanges"
slug: crypto-exchange-stablecoin-genius-act
description: "How the GENIUS Act changes..."
publishedAt: 2026-04-09T09:00:00-06:00
image: /blog/images/genius-act.jpg
tags: [regulation, stablecoins]
jsonLd:
  article:
    type: Article
    author: { name: "Tokenrip", type: Organization }
  faq:
    - q: "What does the GENIUS Act require?"
      a: "The act requires..."
    - q: "How are reserves handled?"
      a: "Issuers must maintain..."
og:
  type: article
  image: /blog/images/genius-act.jpg
---

# GENIUS Act Impact on Crypto Exchanges

Article content here in standard markdown...
```

## API Surface (the seam)

The contract between blog and blog-engine:

| Method | Path | Description |
|---|---|---|
| GET | `/articles/:slug` | Returns `{ frontmatter, content }` for a single article |
| GET | `/articles` | Paginated list from SQLite index (slug, title, description, publishedAt, image, tags) |
| GET | `/articles/tags` | All known tags with counts |
| POST | `/articles/publish` | Accepts raw markdown, runs enrichment pipeline, stores file, updates index |
| POST | `/articles/reindex` | Rebuilds SQLite index from storage |
| DELETE | `/articles/:slug` | Removes article from storage and index |

`GET /articles/:slug` is the key contract — returns parsed frontmatter (for SSR head) and raw markdown body (to embed in the page) in one call.

## Publishing Pipeline

`POST /articles/publish` accepts a raw markdown file (title + article body) and enriches it before storing:

1. Parse content
2. Generate description (summary/excerpt)
3. Generate FAQ Q&A pairs (agentic LLM call)
4. Optional: run through "humanizer" skill
5. Assemble frontmatter (title, slug, description, publishedAt, tags, jsonLd, og)
6. Write final `.md` file to storage
7. Update SQLite index

Starts synchronous. Can move enrichment to background jobs (Fastify schedule plugin) if LLM calls get slow.

## Storage Abstraction

```ts
interface StorageService {
  save(key: string, data: Buffer): Promise<void>
  read(key: string): Promise<Buffer>
  exists(key: string): Promise<boolean>
  delete(key: string): Promise<void>
  list(): Promise<string[]>
}
```

Same pattern as the main backend's `StorageService`. The `list()` method is added for reindex scanning. Start with local filesystem. Add S3 later.

Files: `{storage_root}/{slug}.md`. Images: `{storage_root}/images/{filename}`. Flat structure.

## SQLite Index

Disposable derived index. The markdown files in storage are the source of truth. Delete the `.sqlite` file and run reindex to rebuild from scratch.

```sql
CREATE TABLE articles (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  published_at TEXT,
  image TEXT,
  tags TEXT,
  file_key TEXT NOT NULL,
  indexed_at TEXT NOT NULL
);

CREATE INDEX idx_published_at ON articles(published_at DESC);
```

No ORM. `better-sqlite3` with raw queries. Rebuild via `POST /articles/reindex` or `blog-engine --reindex` CLI flag.

## Rendering Model

Server handles the structured envelope, client handles the content:

- **Server-rendered:** `<head>` with `<title>`, `<meta>` (description, OG, Twitter Card), `<script type="application/ld+json">` (Article + FAQPage schemas). All assembled from frontmatter. Crawlers and agents get this without JS.
- **Body:** Raw markdown text in the page source. AI agents can read it directly.
- **Client JS:** Small bundle (react-markdown, remark-gfm, rehype-highlight) renders the markdown into styled HTML for human readers. Same libraries as the main frontend's MarkdownViewer.

Flash of raw markdown is avoided using the `sr-only` CSS pattern — raw markdown is hidden visually but accessible to agents/screen readers, then JS swaps in the styled version.

## Key Design Decisions

- **Markdown files are canonical.** SQLite is derived. Storage is the source of truth.
- **Frontmatter holds all metadata.** No sidecar files, no database lookups at serve time.
- **Agent-first rendering.** Raw markdown in the page body, proper structured data in the head.
- **Two separate apps.** Frontend can change independently of backend. Both are self-contained for copy/paste reuse.
- **No CMS overhead.** No authors, editors, roles, or frontend editing. Publishing is an agentic pipeline.
