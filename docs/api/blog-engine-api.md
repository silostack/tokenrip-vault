# Blog API Reference

> Living document. Update when endpoints change.

The blog uses the Tokenrip backend API for storage and querying, plus the blog frontend for rendering. This document covers the API endpoints used by the blog system.

---

## Backend Endpoints (Tokenrip API)

Base URL: `http://localhost:3434` (configurable via backend env vars)

### Asset Lookup (Public)

#### `GET /v0/assets/:identifier` — Get Asset by UUID or Alias

The `:identifier` parameter accepts either a UUID (public_id) or an alias (slug). The backend auto-detects the format.

**Response (200):**
```json
{
  "ok": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "alias": "agentic-collaboration",
    "title": null,
    "description": null,
    "type": "markdown",
    "mimeType": "text/markdown",
    "metadata": {
      "post_type": "blog_post",
      "title": "Agentic Collaboration",
      "description": "The agent ecosystem has solved production...",
      "publish_date": "2026-04-11T10:00:00Z",
      "author": "Simon",
      "tags": ["agentic-collaboration", "agent-stack"],
      "reading_time": 8
    },
    "versionCount": 1,
    "currentVersionId": "...",
    "createdAt": "2026-04-11T09:00:00Z",
    "updatedAt": "2026-04-11T10:00:00Z"
  }
}
```

**Errors:** 404 (not found), 410 (destroyed)

```bash
# By alias (blog slug)
curl http://localhost:3434/v0/assets/agentic-collaboration

# By UUID
curl http://localhost:3434/v0/assets/550e8400-e29b-41d4-a716-446655440000
```

#### `GET /v0/assets/:identifier/content` — Get Asset Content

Returns raw content with correct MIME type header. Works with both UUID and alias.

```bash
curl http://localhost:3434/v0/assets/agentic-collaboration/content
# → raw markdown
```

---

### Asset Creation (Auth Required)

#### `POST /v0/assets` — Publish Asset

Creates a new asset. For blog posts, include `alias` and `metadata`.

**Auth:** `Authorization: Bearer <api-key>`

**Request body:**
```json
{
  "type": "markdown",
  "content": "# My Post\n\nContent here.",
  "alias": "my-post",
  "metadata": {
    "post_type": "blog_post",
    "title": "My Post",
    "description": "A blog post about...",
    "publish_date": "2026-04-11T10:00:00Z",
    "author": "Simon",
    "tags": ["example"]
  }
}
```

**Response (201):**
```json
{
  "ok": true,
  "data": {
    "id": "550e8400-...",
    "alias": "my-post",
    "url": "http://localhost:3333/s/550e8400-...",
    "title": null,
    "type": "markdown",
    "mimeType": "text/markdown"
  }
}
```

**Alias validation errors (400):**
```json
{ "ok": false, "error": "INVALID_ALIAS", "message": "Alias must contain only lowercase alphanumeric..." }
```

```bash
curl -X POST http://localhost:3434/v0/assets \
  -H 'Authorization: Bearer sk_...' \
  -H 'Content-Type: application/json' \
  -d '{"type":"markdown","content":"# Hello","alias":"hello-world","metadata":{"post_type":"blog_post","title":"Hello World","publish_date":"2026-04-11T10:00:00Z","author":"Simon","tags":["intro"],"description":"A hello world post."}}'
```

---

### Asset Update (Auth Required)

#### `PATCH /v0/assets/:publicId` — Update Alias or Metadata

Updates an asset's alias and/or metadata. Owner only.

**Auth:** `Authorization: Bearer <api-key>`

**Request body:**
```json
{
  "alias": "new-slug",
  "metadata": {
    "post_type": "blog_post",
    "title": "Updated Title",
    "tags": ["updated"]
  }
}
```

**Response (200):**
```json
{
  "ok": true,
  "data": {
    "id": "550e8400-...",
    "alias": "new-slug",
    "metadata": { "post_type": "blog_post", "title": "Updated Title", "tags": ["updated"] },
    "updatedAt": "2026-04-11T12:00:00Z"
  }
}
```

```bash
curl -X PATCH http://localhost:3434/v0/assets/550e8400-... \
  -H 'Authorization: Bearer sk_...' \
  -H 'Content-Type: application/json' \
  -d '{"metadata":{"post_type":"blog_post","title":"Updated","tags":["new"]}}'
```

---

### Asset Query (Auth Required)

#### `POST /v0/assets/query` — Filtered Asset Listing

Queries assets by metadata containment, tag, with sort and pagination. This is the endpoint the blog frontend uses for index and tag pages.

**Auth:** `Authorization: Bearer <api-key>`

**Request body:**
```json
{
  "metadata": { "post_type": "blog_post" },
  "tag": "agentic-collaboration",
  "sort": "-publish_date",
  "limit": 20,
  "offset": 0
}
```

| Field | Type | Description |
|-------|------|-------------|
| `metadata` | object | JSONB containment filter (`@>` operator) |
| `tag` | string | Filter posts whose `tags` array contains this value |
| `sort` | string | `"publish_date"` (asc) or `"-publish_date"` (desc). Default: `-created_at` |
| `limit` | int | Max results. Default 20, max 100. |
| `offset` | int | Skip N results. Default 0. |

**Response (201):**
```json
{
  "ok": true,
  "assets": [
    {
      "publicId": "550e8400-...",
      "alias": "agentic-collaboration",
      "type": "markdown",
      "state": "published",
      "title": null,
      "metadata": {
        "post_type": "blog_post",
        "title": "Agentic Collaboration",
        "description": "...",
        "publish_date": "2026-04-11T10:00:00Z",
        "author": "Simon",
        "tags": ["agentic-collaboration"]
      },
      "createdAt": "2026-04-11T09:00:00Z",
      "updatedAt": "2026-04-11T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 8,
    "limit": 20,
    "offset": 0
  }
}
```

Content bodies are **not** included in listing responses. Fetch individual posts via `GET /v0/assets/:alias/content`.

```bash
# All blog posts, newest first
curl -X POST http://localhost:3434/v0/assets/query \
  -H 'Authorization: Bearer sk_...' \
  -H 'Content-Type: application/json' \
  -d '{"metadata":{"post_type":"blog_post"},"sort":"-publish_date"}'

# Blog posts tagged "agentic"
curl -X POST http://localhost:3434/v0/assets/query \
  -H 'Authorization: Bearer sk_...' \
  -H 'Content-Type: application/json' \
  -d '{"metadata":{"post_type":"blog_post"},"tag":"agentic","sort":"-publish_date"}'
```

---

## Alias Constraints

| Property | Specification |
|----------|--------------|
| Format | `^[a-z0-9][a-z0-9-]*[a-z0-9]$` — lowercase alphanumeric + hyphens |
| Length | 3-128 characters |
| Uniqueness | Globally unique across all assets |
| Reserved | `assets`, `status`, `register`, `api`, `blog`, `admin`, `auth`, `v0`, `health`, `s`, `agents`, `threads`, `messages`, `inbox`, `operator`, `operators` |

---

## Blog Frontend Routes

Base URL: `http://localhost:3600` (configurable via `PORT` env var)

| Route | Content-Type | Description |
|-------|-------------|-------------|
| `GET /blog` | `text/html` | Blog index page — paginated list of posts |
| `GET /blog/:slug` | `text/html` | Individual blog post with SSR head |
| `GET /blog/:slug` | `text/markdown` | Raw markdown (when `Accept: text/markdown`) |
| `GET /blog/tag/:tag` | `text/html` | Posts filtered by tag |
| `GET /blog/rss.xml` | `application/rss+xml` | RSS 2.0 feed (latest 20) |
| `GET /blog/sitemap.xml` | `application/xml` | XML sitemap (all posts) |

### Content Negotiation

The blog frontend inspects the `Accept` header on article pages:

```bash
# HTML (default) — full SSR page with meta tags, OG, JSON-LD
curl http://localhost:3600/blog/my-post

# Raw markdown — agent-friendly, no HTML
curl -H 'Accept: text/markdown' http://localhost:3600/blog/my-post
```

Both responses include `Vary: Accept` for correct CDN/proxy caching.

---

## Publishing Pipeline CLI

The pipeline is a CLI tool, not a server. It reads markdown, enriches it, and publishes to the Tokenrip API.

```bash
# Publish a new post
bun run apps/blog-pipeline/src/cli.ts path/to/post.md

# Update an existing post (same slug → new version + updated metadata)
bun run apps/blog-pipeline/src/cli.ts path/to/post.md
```

The pipeline is idempotent on the slug. Publishing the same slug again updates the existing asset.

---

## Data Types

### Blog Post Metadata (in JSONB `metadata` field)

```typescript
interface BlogPostMetadata {
  post_type: 'blog_post';    // discriminator
  title: string;
  description: string;
  publish_date: string;       // ISO 8601
  author: string;
  tags: string[];
  og_image?: string;
  excerpt?: string;
  reading_time?: number;      // minutes
  featured?: boolean;
  draft?: boolean;
  faq?: Array<{ q: string; a: string }>;
}
```

### Blog Post (frontend type)

```typescript
interface BlogPost {
  publicId: string;
  alias: string;              // the URL slug
  content: string;            // raw markdown
  metadata: BlogPostMetadata;
  createdAt: string;
  updatedAt: string;
}
```

### Blog Post Summary (listing type — no content)

```typescript
interface BlogPostSummary {
  publicId: string;
  alias: string;
  title: string | null;
  metadata: BlogPostMetadata;
  createdAt: string;
  updatedAt: string;
}
```
