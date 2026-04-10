# Blog Engine API

> Living document. Update when endpoints change.

Base URL: `http://localhost:3500` (configurable via `PORT` env var)

Internal service — no authentication. The blog-engine owns article storage (markdown files with YAML frontmatter) and a disposable SQLite index. It exposes a JSON API consumed by the blog frontend (`apps/blog/`).

---

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/articles/publish` | Publish or update an article from raw markdown |
| `GET` | `/articles/:slug` | Get a single article (frontmatter + content) |
| `GET` | `/articles` | List articles with pagination |
| `GET` | `/articles/tags` | Get all tags with counts |
| `POST` | `/articles/reindex` | Rebuild the SQLite index from storage |
| `DELETE` | `/articles/:slug` | Delete an article |

---

## `POST /articles/publish` — Publish Article

Accepts raw markdown with YAML frontmatter. The publish pipeline enriches the frontmatter before storing:

- If `slug` is missing but `title` is present, a slug is auto-generated from the title.
- If `description` is missing, an excerpt is extracted from the first paragraph (max 160 chars).
- If `publishedAt` is missing, it is set to the current timestamp.

The enriched markdown is stored as `{slug}.md` and the SQLite index is updated (upsert by slug).

**Content-Type:** `text/markdown`

**Request body:** Raw markdown with YAML frontmatter.

```
---
title: "Getting Started with Tokenrip"
slug: getting-started
description: "A guide to the asset coordination platform."
publishedAt: 2026-04-09T09:00:00Z
tags: [guide, onboarding]
jsonLd:
  faq:
    - q: "What is Tokenrip?"
      a: "An asset coordination platform for AI agents."
---

# Getting Started with Tokenrip

Body content here.
```

Only `title` is strictly required (slug is derived from it if absent). Including `slug` explicitly is recommended.

**Response (200):**
```json
{
  "ok": true,
  "slug": "getting-started"
}
```

**Error (400):**
```json
{
  "error": "Article frontmatter must include a slug"
}
```

**curl:**
```bash
curl -X POST http://localhost:3500/articles/publish \
  -H 'Content-Type: text/markdown' \
  --data-binary @article.md
```

Or inline:

```bash
curl -X POST http://localhost:3500/articles/publish \
  -H 'Content-Type: text/markdown' \
  -d '---
title: "My Article"
slug: my-article
tags: [demo]
---

# My Article

Hello world.'
```

---

## `GET /articles/:slug` — Get Article

Returns the article's parsed frontmatter and raw markdown content.

**Response (200):**
```json
{
  "frontmatter": {
    "title": "Getting Started with Tokenrip",
    "slug": "getting-started",
    "description": "A guide to the asset coordination platform.",
    "publishedAt": "2026-04-09T09:00:00Z",
    "tags": ["guide", "onboarding"],
    "jsonLd": {
      "faq": [
        { "q": "What is Tokenrip?", "a": "An asset coordination platform for AI agents." }
      ]
    }
  },
  "content": "\n# Getting Started with Tokenrip\n\nBody content here.\n"
}
```

**Error (404):**
```json
{
  "error": "Article not found"
}
```

**curl:**
```bash
curl http://localhost:3500/articles/getting-started
```

---

## `GET /articles` — List Articles

Returns articles from the SQLite index, ordered by `publishedAt` descending.

| Query Param | Type | Default | Description |
|-------------|------|---------|-------------|
| `limit` | integer | 20 | Max articles to return |
| `offset` | integer | 0 | Number of articles to skip |

**Response (200):**
```json
{
  "articles": [
    {
      "slug": "getting-started",
      "title": "Getting Started with Tokenrip",
      "description": "A guide to the asset coordination platform.",
      "publishedAt": "2026-04-09T09:00:00Z",
      "image": null,
      "tags": ["guide", "onboarding"],
      "fileKey": "getting-started.md",
      "indexedAt": "2026-04-09T10:00:00.000Z"
    }
  ]
}
```

**curl:**
```bash
curl 'http://localhost:3500/articles?limit=10&offset=0'
```

---

## `GET /articles/tags` — Tag Counts

Returns all tags across articles with their occurrence counts, ordered by count descending.

**Response (200):**
```json
{
  "tags": [
    { "tag": "guide", "count": 3 },
    { "tag": "onboarding", "count": 1 }
  ]
}
```

**curl:**
```bash
curl http://localhost:3500/articles/tags
```

---

## `POST /articles/reindex` — Rebuild Index

Clears the SQLite index and rebuilds it from all stored markdown files. Articles without a `slug` in their frontmatter are skipped.

**Response (200):**
```json
{
  "ok": true,
  "count": 12
}
```

`count` is the number of articles indexed.

**curl:**
```bash
curl -X POST http://localhost:3500/articles/reindex
```

---

## `DELETE /articles/:slug` — Delete Article

Removes the markdown file from storage and the row from the SQLite index. Succeeds even if the file is already gone.

**Response (200):**
```json
{
  "ok": true
}
```

**curl:**
```bash
curl -X DELETE http://localhost:3500/articles/getting-started
```

---

## Data Types

### `ArticleFrontmatter`

```typescript
interface ArticleFrontmatter {
  title: string;
  slug: string;
  description?: string;
  publishedAt?: string;
  image?: string;
  tags?: string[];
  jsonLd?: {
    article?: Record<string, any>;
    faq?: Array<{ q: string; a: string }>;
  };
  og?: Record<string, any>;
  [key: string]: any;       // arbitrary extra fields preserved
}
```

### `ArticleRow`

The shape returned by list endpoints (from the SQLite index):

```typescript
interface ArticleRow {
  slug: string;
  title: string;
  description: string | null;
  publishedAt: string | null;
  image: string | null;
  tags: string[];
  fileKey: string;
  indexedAt?: string;
}
```

### `TagCount`

```typescript
interface TagCount {
  tag: string;
  count: number;
}
```

---

## Content Negotiation (Blog Frontend)

The blog frontend (`apps/blog/`, port 3600) proxies to the blog-engine and serves rendered HTML by default. It supports content negotiation on article pages via the `Accept` header:

| Accept Header | Response |
|---------------|----------|
| `text/html` (default) | Server-rendered HTML page with meta tags, Open Graph, and JSON-LD from frontmatter. Client JS hydrates markdown into styled HTML. |
| `text/markdown` | Raw markdown content body. No HTML wrapping. |

The frontend sets `Vary: Accept` on article responses so caches and proxies key on the header.

**HTML (default):**
```bash
curl http://localhost:3600/blog/getting-started
```

**Raw markdown (agent-friendly):**
```bash
curl -H 'Accept: text/markdown' http://localhost:3600/blog/getting-started
```

This follows the agent-first principle — AI agents that prefer raw markdown can request it directly without parsing HTML.
