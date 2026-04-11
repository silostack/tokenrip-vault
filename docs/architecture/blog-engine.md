# Blog System Architecture

The blog is a two-app system that lives outside the main tokenrip frontend/backend. It publishes SEO-optimized, agent-readable articles from markdown files with rich frontmatter.

**Why separate?** The main app serves UUID-based asset pages with a React SPA (TanStack Start) and a NestJS backend with PostgreSQL. Blog articles need a different set of trade-offs: static-ish content, aggressive SEO (JSON-LD, OG, FAQ schema), simple file-based storage, and zero dependency on the asset pipeline. Keeping it separate means the blog can deploy, scale, and fail independently.

Two apps, two concerns:

| App | Port | Runtime | Responsibility |
|-----|------|---------|----------------|
| `apps/blog-engine` | 3500 | Fastify (Bun) | Article storage, SQLite index, publish pipeline, REST API |
| `apps/blog` | 3600 | Bun HTTP server | SSR HTML rendering, content negotiation, client JS hydration |

The blog-engine is the data layer. The blog frontend is the presentation layer. They communicate over HTTP on a private network.

---

## Architecture Diagram

```
                   Browser / AI Agent
                         |
                         | GET /blog/my-article
                         v
                  +--------------+
                  |    nginx     |  (reverse proxy, TLS)
                  +--------------+
                         |
            /blog/*      |
                         v
                  +--------------+
                  |  apps/blog   |  :3600  Bun HTTP server
                  |              |
                  |  - Content negotiation (Accept header)
                  |  - SSR <head> (OG, JSON-LD, meta)
                  |  - Raw markdown in <body>
                  |  - Client JS bundle reference
                  +--------------+
                         |
                         | fetch /articles/:slug
                         v
                  +--------------+
                  | blog-engine  |  :3500  Fastify
                  |              |
                  |  - ArticleService
                  |  - PublishService (enrichment)
                  |  - SQLite index
                  +--------------+
                    |          |
                    v          v
              +---------+  +---------+
              | Storage |  | SQLite  |
              | (files) |  | (index) |
              +---------+  +---------+
              {slug}.md    blog.sqlite
```

**Request flow for an article page:**

1. nginx routes `/blog/*` to the blog frontend (`:3600`)
2. Blog frontend checks the `Accept` header for content negotiation
3. If `Accept: text/markdown` -- returns raw markdown directly, no HTML
4. Otherwise, fetches article JSON from blog-engine (`/articles/:slug`)
5. SSR renders `<head>` with meta/OG/JSON-LD from frontmatter
6. Injects raw markdown into `<body>` as escaped text
7. Includes `<script>` tag for client bundle
8. Browser loads JS, hydrates markdown into styled HTML via React

**Request flow for publishing:**

1. Agent POSTs raw markdown to blog-engine `/articles/publish` with `Content-Type: text/markdown`
2. PublishService enriches frontmatter (slug, excerpt, timestamp)
3. ArticleService writes enriched markdown to storage and upserts SQLite index
4. Returns `{ ok: true, slug }` -- the article is live immediately

---

## Rendering Model

The blog uses a **split rendering model**: server-rendered `<head>` with raw markdown body, then client-side hydration for human readers. This is the same pattern as the main tokenrip asset pages (see `docs/architecture/agent-first.md`) but simplified for blog content.

### What the server sends

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Article Title</title>
  <meta name="description" content="...">
  <meta property="og:title" content="Article Title">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://tokenrip.com/blog/my-article">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"Article",...}</script>
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage",...}</script>
  <link rel="stylesheet" href="/blog/_assets/blog.css">
</head>
<body>
  <main>
    <div id="markdown-source">Raw markdown content here, HTML-escaped</div>
    <div id="markdown-rendered" class="hidden"></div>
  </main>
  <script type="module" src="/blog/_assets/blog.js"></script>
</body>
</html>
```

### What happens in the browser

The client entry (`apps/blog/src/client/entry.tsx`) mounts after DOM ready:

1. Reads raw markdown from `#markdown-source` via `textContent`
2. Hides the raw source visually (`sr-only` class) but keeps it in DOM for screen readers and agents
3. Un-hides `#markdown-rendered` and renders styled markdown via React (`react-markdown` + `remark-gfm` + `rehype-highlight`)

If JavaScript fails to load, the raw markdown remains visible. Agents that don't execute JS see the raw markdown directly in the page text.

### Content negotiation

The blog frontend (`apps/blog/src/serve.ts`) inspects the `Accept` header before doing any rendering:

| Accept header | Response | Content-Type |
|---|---|---|
| `text/markdown` | Raw markdown body only | `text/markdown; charset=utf-8` |
| `text/html` / `*/*` / absent | Full SSR HTML page | `text/html; charset=utf-8` |

All negotiated responses include `Vary: Accept` for correct CDN/proxy caching.

```bash
# Agent gets raw markdown
curl https://tokenrip.com/blog/my-article -H "Accept: text/markdown"

# Browser or default gets HTML
curl https://tokenrip.com/blog/my-article
```

---

## Markdown File Format

Markdown files with YAML frontmatter are the **source of truth** for all article content. They are stored at `{STORAGE_PATH}/{slug}.md` and contain everything needed to render the article, generate SEO metadata, and produce structured data.

### Frontmatter structure

```yaml
---
title: "Building an Agent-First Blog Engine"
slug: building-an-agent-first-blog-engine
description: "How we built a blog that serves AI agents and humans from the same URL."
publishedAt: "2026-04-09T12:00:00.000Z"
image: "https://tokenrip.com/images/blog-engine.png"
tags:
  - engineering
  - agents
jsonLd:
  article:
    author:
      name: "Tokenrip"
      type: "Organization"
  faq:
    - q: "What is an agent-first blog?"
      a: "A blog designed so AI agents can read content without executing JavaScript."
    - q: "Why use markdown as the source of truth?"
      a: "Markdown is portable, version-controllable, and natively readable by LLMs."
og:
  type: article
  image: "https://tokenrip.com/images/blog-engine-og.png"
---

Article body in standard markdown...
```

### Field reference

| Field | Required | Type | Purpose |
|-------|----------|------|---------|
| `title` | Yes | `string` | Article headline. Used in `<title>`, OG, JSON-LD. |
| `slug` | Yes* | `string` | URL path segment. Auto-generated from title if missing. |
| `description` | No | `string` | Meta description. Auto-extracted from first paragraph if missing. |
| `publishedAt` | No | `string` (ISO 8601) | Publication timestamp. Set to `now()` if missing on publish. |
| `image` | No | `string` (URL) | Hero image. Used in JSON-LD and OG fallback. |
| `tags` | No | `string[]` | Categorization. Stored as JSON array in SQLite. Queryable via `/articles/tags`. |
| `jsonLd.article` | No | `object` | Additional Article schema fields (author, etc.). |
| `jsonLd.faq` | No | `Array<{q, a}>` | FAQ pairs. Generates a separate FAQPage JSON-LD block. |
| `og` | No | `object` | Open Graph overrides (`type`, `image`, etc.). |

*The publish pipeline auto-generates `slug` from `title` if not provided.

---

## Storage Abstraction

Article storage is behind an interface (`apps/blog-engine/src/storage/storage.interface.ts`) so the backing store can change without touching business logic.

### Interface

```typescript
export interface StorageService {
  save(key: string, data: Buffer): Promise<void>;
  read(key: string): Promise<Buffer>;
  exists(key: string): Promise<boolean>;
  delete(key: string): Promise<void>;
  list(): Promise<string[]>;
}
```

The `list()` method is critical -- it enables the reindex operation by enumerating all stored files. Any storage implementation must support listing all keys.

### Local implementation

`LocalStorage` (`apps/blog-engine/src/storage/local-storage.ts`) maps keys to files on disk:

- `save(key, data)` -- writes to `{basePath}/{key}`, creates directories as needed
- `read(key)` -- reads `{basePath}/{key}` as a `Buffer`
- `exists(key)` -- checks file accessibility via `fs.access`
- `delete(key)` -- unlinks the file
- `list()` -- reads the directory and filters for `.md` files

Keys are `{slug}.md`. The storage layer has no knowledge of frontmatter or article structure -- it's a raw key-value store for buffers.

### Path to S3

The config already has a `storageProvider` field (`apps/blog-engine/src/config.ts`) that defaults to `'local'`. An S3 implementation would:

1. Implement `StorageService` using the AWS SDK
2. Map keys to S3 object keys (same `{slug}.md` convention)
3. Implement `list()` via `ListObjectsV2`
4. Be selected in `server.ts` based on `config.storageProvider`

No changes to `ArticleService`, routes, or the blog frontend.

---

## SQLite Index

The SQLite database is a **disposable derived index** over the markdown files. Delete it and run `POST /articles/reindex` -- the index rebuilds from storage in seconds. No migrations, no schema versions, no backup strategy needed.

### Why SQLite, not PostgreSQL

The main tokenrip app uses PostgreSQL + MikroORM for structured data with relationships, transactions, and migrations. The blog has none of that:

- Single table, no relations
- Read-heavy, write-rare (publish is infrequent)
- No concurrent writes (single Fastify process)
- Index is derived and rebuildable -- data loss is a non-event

SQLite via `bun:sqlite` is zero-dependency, zero-config, and fast enough. WAL mode is enabled for concurrent reads during writes.

### Schema

```sql
CREATE TABLE IF NOT EXISTS articles (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  published_at TEXT,
  image TEXT,
  tags TEXT NOT NULL DEFAULT '[]',   -- JSON array
  file_key TEXT NOT NULL,
  indexed_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_published_at
  ON articles(published_at DESC);
```

Tags are stored as a JSON array string and queried using SQLite's `json_each()` for tag aggregation:

```sql
SELECT value as tag, COUNT(*) as count
FROM articles, json_each(articles.tags)
GROUP BY value
ORDER BY count DESC
```

### Rebuild strategy

`ArticleService.reindex()` does a full rebuild:

1. Clears all rows from the `articles` table
2. Calls `storage.list()` to enumerate all `.md` files
3. Reads each file, parses frontmatter with `gray-matter`
4. Upserts each article into the index
5. Returns the count of indexed articles

This is exposed as `POST /articles/reindex` and via the CLI command `bun run reindex`.

---

## Publishing Pipeline

Publishing goes through an enrichment step before storage. An agent (or human) sends raw markdown; the system fills in missing metadata before persisting.

### Enrichment flow

`PublishService.enrichArticle()` (`apps/blog-engine/src/services/publish.service.ts`) processes raw markdown:

```
Raw markdown (with partial frontmatter)
    |
    v
Parse with gray-matter → { data, content }
    |
    +-- Missing slug?    → slugify(title)
    +-- Missing description? → extractExcerpt(content, 160)
    +-- Missing publishedAt? → new Date().toISOString()
    |
    v
Reassemble with matter.stringify(content, data)
    |
    v
Return { frontmatter, content, output }
```

**Slug generation:** Lowercases the title, replaces non-alphanumeric runs with hyphens, trims leading/trailing hyphens. `"Building an Agent-First Blog"` becomes `building-an-agent-first-blog`.

**Excerpt extraction:** Takes the first non-heading, non-empty paragraph. Truncates at 160 characters on a word boundary with `...` suffix.

**Timestamp:** ISO 8601. Only set if the frontmatter doesn't already include `publishedAt`.

### API endpoint

```
POST /articles/publish
Content-Type: text/markdown

---
title: "My Article"
tags: [engineering]
---

Article body here...
```

Response: `{ ok: true, slug: "my-article" }`

The server registers a custom Fastify content type parser for `text/markdown` that passes the body through as a raw string. The route calls `enrichArticle()` then `articleService.store()` with the enriched output and pre-parsed frontmatter.

### LLM-Driven Enrichment

Articles published with just a title and body are automatically enriched with FAQ Q&A pairs, tags, a polished description, and JSON-LD structured data via the Claude API. Enrichment is optional — it is fully disabled when `ANTHROPIC_API_KEY` is not set.

#### Background scanner

A 30-second `setInterval` runs in the Fastify server (registered via `onReady` hook, cleared on `onClose`). Each tick:

1. Calls `storage.list()` to enumerate all `.md` files
2. Parses each file's frontmatter with `gray-matter`
3. Skips articles that already have `jsonLd.faq` (the enrichment marker)
4. Skips articles currently being enriched (in-progress set)
5. Enriches **one article per tick** then returns — avoids flooding the API

#### LLM prompt structure

A single Claude API call per article. The prompt (`buildEnrichPrompt()`) produces:

- **System message:** Instructs the model to act as a content enrichment engine and return structured JSON with `description`, `tags`, `faq`, and `og` fields
- **User message:** The article title and full markdown body

The response is parsed as JSON directly (no markdown fencing). The model is configured via `ANTHROPIC_MODEL` (default: `claude-sonnet-4-5-20250514`).

#### Additive merge strategy

`mergeEnrichment()` fills in missing frontmatter fields without overwriting existing values:

| Field | Behavior |
|---|---|
| `description` | Set only if missing |
| `tags` | Set only if missing or empty array |
| `og` | Set only if missing |
| `jsonLd.faq` | Set only if missing — this is also the "already enriched" marker |
| `jsonLd.article` | Set only if missing — includes author name/type from config |

After merging, the article is re-serialized with `matter.stringify()` and overwritten in storage.

#### Concurrency control

An in-memory `Set<string>` in `EnrichService` tracks slugs currently being enriched. If `enrichArticle()` is called for a slug that's already in progress, it returns `false` immediately. The slug is removed from the set in a `finally` block.

#### Graceful degradation

When `ANTHROPIC_API_KEY` is not set:
- `EnrichService` is not instantiated
- The background scanner does not start
- `POST /articles/:slug/enrich` returns 503 with an explanatory error message
- All other blog-engine functionality works normally

#### Manual trigger

`POST /articles/:slug/enrich` allows on-demand enrichment of a specific article. Useful for testing the pipeline or re-enriching after clearing an article's `jsonLd.faq`.

---

## Agent-First Design

The blog follows the same agent-first principles as the main tokenrip platform (see `docs/architecture/agent-first.md`). Every blog URL is useful to an AI agent without JavaScript execution.

### Content negotiation

Agents that send `Accept: text/markdown` get the raw markdown body -- no HTML wrapper, no escaping, just the content. This is the ideal format for LLMs.

### Raw markdown in the HTML response

Even when serving HTML, the raw markdown is the visible page text inside `#markdown-source`. An agent that fetches the HTML and reads the body text gets the article content. JavaScript hydration only adds visual styling -- it doesn't change what content is available.

After hydration, the raw source gets `aria-hidden="true"` and `sr-only` class (visually hidden but still in DOM). Agents that parse HTML will find it. Agents that read visible text see the rendered version.

### Structured data in `<head>`

Every article page includes server-rendered:

- **`<title>`** and **`<meta name="description">`** -- standard metadata
- **Open Graph tags** -- `og:title`, `og:type`, `og:description`, `og:image`, `og:url`
- **Twitter card tags** -- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- **JSON-LD Article schema** -- `@type: Article` with headline, description, datePublished, author, image
- **JSON-LD FAQPage schema** (when `jsonLd.faq` is present) -- separate `<script>` block with question/answer pairs

All of this is in the initial HTML response. No client-side fetches required.

### Verification

```bash
# Raw markdown for agents
curl -s https://tokenrip.com/blog/my-article -H "Accept: text/markdown"

# HTML with visible markdown content
curl -s https://tokenrip.com/blog/my-article | grep "markdown-source"

# Structured data
curl -s https://tokenrip.com/blog/my-article | grep "application/ld+json"

# OG tags
curl -s https://tokenrip.com/blog/my-article | grep 'og:title'

# Vary header for correct caching
curl -sI https://tokenrip.com/blog/my-article | grep -i vary
```

---

## Key Files

| Responsibility | File |
|---|---|
| Blog-engine server setup | `apps/blog-engine/src/server.ts` |
| Engine config (ports, paths) | `apps/blog-engine/src/config.ts` |
| Article CRUD + reindex | `apps/blog-engine/src/services/article.service.ts` |
| Publish enrichment pipeline | `apps/blog-engine/src/services/publish.service.ts` |
| LLM enrichment service | `apps/blog-engine/src/services/enrich.service.ts` |
| Storage interface | `apps/blog-engine/src/storage/storage.interface.ts` |
| Local filesystem storage | `apps/blog-engine/src/storage/local-storage.ts` |
| SQLite index (schema, queries) | `apps/blog-engine/src/db/index.ts` |
| REST API routes | `apps/blog-engine/src/routes/articles.ts` |
| Blog frontend server + content negotiation | `apps/blog/src/serve.ts` |
| SSR `<head>` (meta, OG, JSON-LD) | `apps/blog/src/templates/head.ts` |
| SSR article page template | `apps/blog/src/templates/article.ts` |
| HTML layout shell | `apps/blog/src/templates/layout.ts` |
| Frontmatter type definitions | `apps/blog/src/templates/types.ts` |
| Client-side hydration entry | `apps/blog/src/client/entry.tsx` |
| Agent-first design principles | `docs/architecture/agent-first.md` |
