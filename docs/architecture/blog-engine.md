# Blog System Architecture

The blog is a **projection of Tokenrip assets** — not a separate content management system. Blog posts are regular Tokenrip assets with metadata conventions. The blog frontend queries Tokenrip and renders blog-optimized views.

Three components, three concerns:

| Component | Location | Concern |
|-----------|----------|---------|
| **Tokenrip Backend** | `apps/backend/` | Canonical store. Stores assets with alias + metadata. Serves content + query API. |
| **Publishing Pipeline** | `apps/blog-pipeline/` | Write path. Takes raw markdown, enriches, validates, publishes to Tokenrip. |
| **Blog Frontend** | `apps/blog/` | Read path. Queries Tokenrip, SSR renders blog views, handles SEO. |

**Why this shape:**
- No new content store. Tokenrip is the single source of truth.
- No new publishing API. Blog posts go through the existing asset API.
- The blog frontend is rebuildable from scratch — all state lives in Tokenrip.
- Future content sources (intelligence engine, researcher agents) publish through the same API.

---

## Architecture Diagram

```
              Agent / Human writes markdown
                         |
                         v
              +-----------------------+
              |  Publishing Pipeline  |  apps/blog-pipeline/
              |                       |
              |  1. Parse frontmatter |
              |  2. Basic enrichment  |  (slug, description, reading_time)
              |  3. LLM enrichment    |  (FAQ, tags, polished description)
              |  4. Validate          |
              |  5. POST /v0/assets   |  (with alias + metadata)
              +-----------------------+
                         |
                         v
              +-----------------------+
              |   Tokenrip Backend    |  apps/backend/  :3434
              |                       |
              |  Asset record:        |
              |   - public_id (UUID)  |
              |   - alias (slug)      |
              |   - content (storage) |
              |   - metadata (JSONB)  |
              +-----------------------+
                    |             |
                    v             v
          +-------------+  +-----------------+
          | Asset View   |  | Blog Frontend   |  apps/blog/  :3600
          | /s/:uuid     |  |                 |
          | (existing)   |  | /blog/:slug     |  Alias lookup → SSR render
          |              |  | /blog           |  Query → list page
          |              |  | /blog/tag/:tag  |  Filtered query
          |              |  | /blog/rss.xml   |  RSS feed
          |              |  | /blog/sitemap   |  Sitemap
          +-------------+  +-----------------+
```

---

## Request Flows

### Read path (viewing a blog post)

1. Browser requests `tokenrip.com/blog/my-article`
2. Blog frontend calls `GET /v0/assets/my-article` (public, alias lookup)
3. Backend detects `my-article` is not a UUID → looks up by `alias` column
4. Returns asset metadata (including JSONB metadata blob) + content
5. Blog frontend checks `metadata.post_type === "blog_post"`, skips drafts
6. SSR renders `<head>` with title, description, OG, JSON-LD, canonical URL
7. Injects raw markdown into `<body>`
8. Client JS hydrates markdown into styled HTML

### Read path (blog index)

1. Browser requests `tokenrip.com/blog`
2. Blog frontend calls `POST /v0/assets/query` (private, requires API key)
3. Body: `{ metadata: { post_type: "blog_post" }, sort: "-publish_date", limit: 20 }`
4. Backend runs `WHERE metadata @> '{"post_type":"blog_post"}' ORDER BY publish_date DESC`
5. Returns asset summaries (no content bodies)
6. Blog frontend renders listing page with titles, dates, tags, excerpts

### Write path (publishing)

1. Agent or human runs `bun run apps/blog-pipeline/src/cli.ts post.md`
2. Pipeline parses frontmatter, generates slug, enriches metadata
3. LLM enrichment (optional) — calls Claude API for FAQ, tags, description
4. Pipeline calls `POST /v0/assets` with `{ type: "markdown", content, alias: slug, metadata }`
5. Tokenrip stores content in storage, persists asset record with alias + metadata
6. Post is immediately accessible at `/blog/:slug`

### Write path (updating)

1. Pipeline checks if slug exists via `GET /v0/assets/:slug`
2. If exists: `POST /v0/assets/:publicId/versions` (new content version) + `PATCH /v0/assets/:publicId` (updated metadata)
3. Same URL, same alias, new content

---

## Blog Metadata Convention

Blog-specific data lives in the JSONB `metadata` field. The backend does not validate metadata contents — that's the pipeline's job.

### Required fields

| Field | Type | Description |
|-------|------|-------------|
| `post_type` | `"blog_post"` | Discriminator. The blog frontend filters on this. |
| `title` | string | Post title. Used in `<title>`, `<h1>`, OG title. |
| `description` | string | SEO meta description. 150-160 chars. |
| `publish_date` | ISO 8601 string | Publication timestamp. Used for ordering. |
| `author` | string | Author display name. |
| `tags` | string[] | Topic tags. Lowercase, hyphenated. |

### Optional fields

| Field | Type | Description |
|-------|------|-------------|
| `og_image` | string | Open Graph image URL. |
| `excerpt` | string | Short excerpt for listing pages. |
| `reading_time` | int | Minutes. Pipeline calculates from word count. |
| `featured` | boolean | Appears in hero sections. |
| `draft` | boolean | Hidden from public views. |
| `faq` | `Array<{q, a}>` | FAQ pairs from LLM enrichment. |

---

## Alias Field

The `alias` column on the asset table is a **top-level, indexed, unique** field — not stored in metadata. It serves as the URL slug for blog posts and is a general-purpose human-readable identifier for any asset.

| Property | Spec |
|----------|------|
| Format | `^[a-z0-9][a-z0-9-]*[a-z0-9]$` |
| Length | 3-128 characters |
| Uniqueness | Globally unique (partial unique index, NULL excluded) |
| Reserved | `assets`, `api`, `v0`, `blog`, `admin`, `auth`, `status`, etc. |

The same `GET /v0/assets/:identifier` endpoint handles both UUID and alias lookups by auto-detecting the format.

---

## Rendering Model

Split rendering: **server-rendered `<head>`** with raw markdown body, then client-side hydration. Same pattern as the main asset pages (see `docs/architecture/agent-first.md`).

### Server sends

- `<head>`: title, description, OG tags, Twitter Card, JSON-LD Article schema, FAQPage schema, canonical URL
- `<body>`: raw markdown in `#markdown-source`, empty `#markdown-rendered`, client JS bundle reference

### Client hydrates

React mounts, reads markdown from `#markdown-source`, renders styled HTML via `react-markdown` + `remark-gfm` + `rehype-highlight` into `#markdown-rendered`. Raw source gets `sr-only` class.

### Content negotiation

| Accept header | Response |
|---|---|
| `text/markdown` | Raw markdown, no HTML |
| `text/html` / `*/*` / absent | Full SSR HTML page |

Both include `Vary: Accept` for correct caching.

---

## SEO: Canonical URL Strategy

The same content is accessible at multiple URLs. Canonical tags prevent search engines from splitting ranking authority.

| URL | Canonical | Robots |
|-----|-----------|--------|
| `tokenrip.com/blog/:slug` | Points to itself | Indexable |
| `tokenrip.com/s/:publicId` | Points to `/blog/:slug` | `noindex, follow` |

The TanStack Start asset view (`apps/frontend/src/app/s/$uuid.tsx`) checks `metadata.post_type === "blog_post"` and adds `<link rel="canonical">` + `<meta name="robots" content="noindex, follow">` for blog assets.

---

## Caching

The blog frontend caches Tokenrip API responses in memory with TTL-based expiry.

| Content | TTL |
|---------|-----|
| Individual post | 5 minutes |
| Blog index / listing | 2 minutes |
| Tag pages | 5 minutes |
| RSS feed | 10 minutes |
| Sitemap | ~2 min (inherits listings cache) |

### Sitemap freshness

`/blog/sitemap.xml` is regenerated on every request from a cached `listPosts({ limit: 1000 })` call (`apps/blog/src/serve.ts:79-85`). The sitemap response itself is not separately cached — staleness is bounded by the underlying listings TTL (~2 min). New posts appear within that window.

The site-wide sitemap entry point is `https://tokenrip.com/sitemap.xml`, a sitemap *index* served by `apps/frontend` that references `/sitemap-marketing.xml` (static) and `/blog/sitemap.xml` (dynamic, this file).

**Known limitation:** the 1000-post cap is hardcoded. Needs pagination before the blog grows past that.

---

## Key Files

| Responsibility | File |
|---|---|
| Publishing pipeline orchestrator | `apps/blog-pipeline/src/pipeline.ts` |
| Pipeline CLI entrypoint | `apps/blog-pipeline/src/cli.ts` |
| Tokenrip API client (pipeline) | `apps/blog-pipeline/src/tokenrip-client.ts` |
| LLM enrichment functions | `apps/blog-pipeline/src/services/enrich.service.ts` |
| Slug + excerpt generation | `apps/blog-pipeline/src/services/publish.service.ts` |
| Blog frontend server + routing | `apps/blog/src/serve.ts` |
| Blog API client (frontend) | `apps/blog/src/api-client.ts` |
| SSR head (meta, OG, JSON-LD) | `apps/blog/src/templates/head.ts` |
| Article page template | `apps/blog/src/templates/article.ts` |
| Index page template | `apps/blog/src/templates/index.ts` |
| RSS feed template | `apps/blog/src/templates/rss.ts` |
| Sitemap template | `apps/blog/src/templates/sitemap.ts` |
| Type definitions | `apps/blog/src/templates/types.ts` |
| TTL cache | `apps/blog/src/cache.ts` |
| Alias validation (backend) | `apps/backend/src/api/validation/alias.validation.ts` |
| Asset entity (with alias) | `apps/backend/src/db/models/Asset.ts` |
| Asset controller (query, PATCH) | `apps/backend/src/api/controller/asset.controller.ts` |
| Canonical URL logic (frontend) | `apps/frontend/src/app/s/$uuid.tsx` |
| Site sitemap index (frontend) | `apps/frontend/public/sitemap.xml` |
| Marketing sitemap (frontend) | `apps/frontend/public/sitemap-marketing.xml` |
