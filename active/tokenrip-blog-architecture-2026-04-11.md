# Tokenrip Blog — Architecture & Engineering Specification

**Status**: Design specification for implementation
**Created**: 2026-04-11
**Owner**: Simon
**Audience**: Engineering team — what to build, why it's shaped this way, what the integration points are

---

## Executive Summary

The Tokenrip blog is not a separate content management system. It is a **projection** of Tokenrip assets — a presentation layer that reads from the existing Tokenrip API and renders blog-optimized views at `tokenrip.com/blog/[slug]`.

Blog posts are Tokenrip assets. They are published through the existing `POST /publish` endpoint with blog-specific metadata. The blog frontend is a stateless SSR application that queries Tokenrip for assets of a specific type and renders them with blog layout, SEO markup, and navigation.

This design means:

- **No new content store.** Tokenrip is the single source of truth for all blog content and metadata.
- **No new publishing API.** Blog posts are published through the existing asset API with metadata conventions.
- **The blog frontend is rebuildable** from scratch without data migration. All state lives in Tokenrip.
- **Future content sources** (intelligence engine, researcher agents, external contributors) publish through the same asset API. The blog frontend doesn't know or care where content originated.

Three components, three concerns:

| Component | Concern | What It Does |
|-----------|---------|--------------|
| **Publishing Pipeline** | Write path | Takes raw content, enriches it, publishes to Tokenrip with metadata |
| **Tokenrip Backend** | Canonical store + API | Stores assets, serves content + metadata, supports querying |
| **Blog Frontend** | Read path / projection | Queries Tokenrip, SSR renders blog views, handles SEO HTML |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CONTENT SOURCES                         │
│                                                               │
│   Manual         Intelligence        Agent         External   │
│   Writing        Engine (future)     Output        Import     │
└──────────────────────────┬────────────────────────────────────┘
                           │ raw markdown + intent
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   PUBLISHING PIPELINE                        │
│                                                               │
│   1. Content enrichment (heading structure, internal links)   │
│   2. Metadata generation (slug, description, tags, OG)       │
│   3. Validation (required fields, slug uniqueness)           │
│   4. POST /publish → Tokenrip with metadata                  │
│                                                               │
│   Runs once per publish. Idempotent on update.               │
└──────────────────────────┬────────────────────────────────────┘
                           │ POST /assets (or PUT for updates)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   TOKENRIP BACKEND                           │
│                                                               │
│   Asset record:                                               │
│     - id, public_id (existing)                               │
│     - alias (NEW top-level field — the slug)                 │
│     - content (markdown)                                      │
│     - metadata (JSONB — blog fields live here)               │
│                                                               │
│   New query capabilities:                                     │
│     - Lookup by alias                                        │
│     - Filter assets by metadata fields                        │
│     - Ordered listing with pagination                        │
│                                                               │
└──────────┬──────────────────────────────────┬─────────────────┘
           │                                  │
           ▼                                  ▼
┌──────────────────────┐      ┌──────────────────────────────────┐
│    Asset View         │      │      Blog Frontend (Projection)  │
│   (existing)          │      │                                   │
│                       │      │   tokenrip.com/blog/[slug]        │
│   tokenrip.com        │      │   - Resolves slug → asset via     │
│   /assets/:public_id  │      │     alias lookup                  │
│                       │      │   - SSR renders blog layout       │
│   Generic asset       │      │   - HTML <head> (meta, OG,       │
│   rendering           │      │     schema, canonical)            │
│                       │      │   - Blog index, tag pages         │
│                       │      │   - RSS feed, sitemap.xml         │
└──────────────────────┘      └──────────────────────────────────┘
```

---

## Component 1: Tokenrip Backend Changes

These are the modifications needed to the existing Tokenrip backend to support the blog as a projection.

### 1.1 Alias — New Top-Level Field on Asset

Add `alias` as a first-class field on the Asset entity. This is not blog-specific — it is a general-purpose human-readable identifier for any asset. The blog uses it as the URL slug.

```
Asset {
  id:              UUID        (existing — internal PK)
  public_id:       UUID        (existing — canonical URL identity)
  alias:           string | null   NEW — human-readable lookup key
  owner_id:        string      (existing)
  type:            string      (existing)
  state:           string      (existing)
  metadata:        JSONB       (existing)
  created_at:      timestamp   (existing)
  updated_at:      timestamp   (existing)
}
```

**Alias constraints:**

| Property | Specification |
|----------|--------------|
| Format | Lowercase alphanumeric + hyphens. No spaces, no special characters. Regex: `^[a-z0-9][a-z0-9-]*[a-z0-9]$` |
| Uniqueness | Globally unique across all assets (unique index) |
| Nullability | Nullable. Most assets will not have an alias. Blog posts will. |
| Immutability | Mutable but with caution — changing an alias breaks inbound links. The API should support alias changes but the publishing pipeline should treat slugs as permanent once set. |
| Length | Minimum 3 characters, maximum 128 characters |
| Reserved words | Reserve a set of path segments that conflict with existing routes: `assets`, `status`, `register`, `api`, `blog`, `admin`, etc. Aliases cannot match reserved words. |

**Database changes:**

```sql
ALTER TABLE assets ADD COLUMN alias VARCHAR(128);
CREATE UNIQUE INDEX idx_assets_alias ON assets (alias) WHERE alias IS NOT NULL;
```

The partial unique index ensures uniqueness only among assets that have an alias, while allowing multiple assets to have `NULL` alias.

**Why top-level and not in metadata:** Alias is a lookup key. It needs an index. It needs a uniqueness constraint. It needs to be queryable without JSONB path expressions. Metadata is for descriptive fields that vary by asset type. Alias is a structural field that applies to any asset.

**URL resolution:**

With the alias field, an asset with `alias = "agentic-collaboration"` is accessible at:

| URL | Resolution |
|-----|-----------|
| `tokenrip.com/assets/:public_id` | Existing — direct ID lookup |
| `tokenrip.com/:alias` | New — alias lookup, renders asset view |
| `tokenrip.com/blog/:alias` | New — alias lookup, renders blog projection |

The first two resolve to the same asset and render the standard asset view. The third resolves to the same asset but renders the blog projection. The routing is:

1. `tokenrip.com/blog/:slug` → blog frontend handles this route, queries Tokenrip API for asset by alias
2. `tokenrip.com/:alias` → Tokenrip backend resolves alias, renders asset view (same as `/:public_id`)

**API changes for alias:**

```
# Lookup by alias
GET /assets/by-alias/:alias
→ Returns the full asset record (content + metadata)

# Set alias on publish
POST /assets
{
  "content": "...",
  "type": "document",
  "alias": "agentic-collaboration",
  "metadata": { ... }
}

# Set/change alias on existing asset
PATCH /assets/:public_id
{
  "alias": "agentic-collaboration"
}
```

The `GET /assets/by-alias/:alias` endpoint is the primary integration point for the blog frontend. It is a simple index lookup — no JSONB querying involved.

### 1.2 Metadata Querying — JSONB Index + Filter Endpoint

The blog frontend needs to query "all assets where metadata contains specific field values" for:

- Blog index page: all assets where `metadata.post_type = "blog_post"`, ordered by `metadata.publish_date` descending
- Tag pages: all assets where `metadata.tags` contains a specific tag
- RSS feed: same as blog index, limited to most recent N
- Sitemap: all blog post assets with their aliases and last-modified dates

**The problem:** The existing asset model stores arbitrary metadata as a JSONB blob. There is no query/filtering mechanism for metadata fields today.

**The solution:** Add a filtered asset listing endpoint backed by PostgreSQL JSONB indexing.

#### PostgreSQL JSONB Indexing Strategy

PostgreSQL supports GIN indexes on JSONB columns, which make containment queries (`@>`) fast. This is the right approach — it avoids adding blog-specific columns to the asset table while enabling efficient filtering.

```sql
-- GIN index on the metadata column for containment queries
CREATE INDEX idx_assets_metadata ON assets USING GIN (metadata jsonb_path_ops);
```

The `jsonb_path_ops` operator class supports `@>` (contains) queries, which is the primary pattern for filtering by metadata fields. It is more compact and faster than the default GIN operator class for this use case.

**What this enables:**

```sql
-- All blog posts, ordered by publish_date descending
SELECT * FROM assets
WHERE metadata @> '{"post_type": "blog_post"}'
ORDER BY (metadata->>'publish_date')::timestamptz DESC;

-- Blog posts with a specific tag
SELECT * FROM assets
WHERE metadata @> '{"post_type": "blog_post"}'
  AND metadata->'tags' ? 'agentic-collaboration';

-- Blog posts published after a certain date
SELECT * FROM assets
WHERE metadata @> '{"post_type": "blog_post"}'
  AND (metadata->>'publish_date')::timestamptz > '2026-04-01T00:00:00Z';
```

**Performance note:** The GIN index makes `@>` containment queries fast regardless of JSONB document size. However, `ORDER BY` on a JSONB-extracted field will not use the GIN index — it requires a sequential scan of the filtered results. For the blog, this is acceptable: the number of blog posts will be small (hundreds at most), so sorting the filtered set in memory is trivial. If the asset table grows to millions of rows and metadata-based ordering becomes slow, a B-tree expression index on `(metadata->>'publish_date')` can be added later.

#### Filtered Asset Listing Endpoint

```
GET /assets?filter[metadata.post_type]=blog_post
            &sort=-metadata.publish_date
            &page[limit]=20
            &page[offset]=0
```

**Design considerations for the endpoint:**

This endpoint is a general-purpose filtered listing, not a blog-specific endpoint. The blog is the first consumer, but any future feature that needs to query assets by metadata will use the same mechanism.

**Recommended approach — containment filter:**

```
GET /assets?metadata={"post_type":"blog_post"}&sort=-publish_date&limit=20&offset=0
```

Where `metadata` accepts a JSON object that is used in a `@>` containment query. This is the most direct mapping to PostgreSQL's JSONB containment operator and avoids inventing a custom query language.

The `sort` parameter maps to a JSONB key extracted as text (with optional type casting for dates). For v1, supporting `sort=publish_date` (ascending) and `sort=-publish_date` (descending) on a hardcoded set of sortable metadata keys is sufficient. A general-purpose sort-on-any-metadata-field mechanism is over-engineering for now.

**Response format:**

```json
{
  "assets": [
    {
      "public_id": "uuid",
      "alias": "agentic-collaboration",
      "type": "document",
      "state": "published",
      "metadata": {
        "post_type": "blog_post",
        "title": "Agentic Collaboration — The Missing Layer in the Agent Stack",
        "description": "The agent ecosystem has solved production and is solving communication...",
        "tags": ["agentic-collaboration", "agent-stack", "multi-agent"],
        "publish_date": "2026-04-11T10:00:00Z",
        "og_image": "/images/agentic-collaboration-og.png",
        "author": "Simon"
      },
      "created_at": "2026-04-11T09:00:00Z",
      "updated_at": "2026-04-11T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 8,
    "limit": 20,
    "offset": 0
  }
}
```

**Note on content inclusion:** The listing endpoint should return metadata only (no content body) by default. Content is large and listing pages don't need it. The blog frontend fetches full content only for individual post pages via `GET /assets/by-alias/:alias`. If there is a use case for including content in listing responses, add an `include=content` query parameter.

**Alternative: Blog-specific endpoint**

An alternative to the general-purpose filter is a purpose-built blog listing:

```
GET /blog/posts?tag=agentic-collaboration&limit=20
```

This is simpler to implement and optimize but couples the backend to the blog use case. **Recommendation: build the general-purpose filter.** The incremental effort is small (it's a JSONB containment query either way), and the general-purpose endpoint serves future needs (any metadata-filtered asset listing) without additional work.

### 1.3 Summary of Backend Work

| Change | Type | Effort Estimate | Dependency |
|--------|------|-----------------|------------|
| Add `alias` column to assets table | Schema migration | Small | None |
| Unique partial index on `alias` | Schema migration | Small | Alias column |
| Alias lookup endpoint (`GET /assets/by-alias/:alias`) | New endpoint | Small | Alias column |
| Alias support on `POST /assets` and `PATCH /assets/:id` | Endpoint modification | Small | Alias column |
| Alias validation (format, uniqueness, reserved words) | Business logic | Small | Alias column |
| GIN index on `metadata` JSONB column | Schema migration | Small | None |
| Filtered asset listing endpoint | New endpoint | Medium | GIN index |
| Alias resolution on `GET /:alias` (asset view) | Route addition | Small | Alias lookup |

**Total backend scope:** One new column, one new index, two new endpoints, two endpoint modifications, validation logic. No changes to the existing asset publishing flow beyond accepting the optional `alias` field.

---

## Component 2: Blog Metadata Convention

Blog-specific data lives in the existing JSONB `metadata` field. No new columns on the asset table. The publishing pipeline is responsible for populating these fields correctly.

### Required Metadata Fields (Blog Posts)

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `post_type` | string | Discriminator. Must be `"blog_post"` for blog content. | `"blog_post"` |
| `title` | string | The post title. Used in `<title>`, `<h1>`, OG title. | `"Agentic Collaboration — The Missing Layer"` |
| `description` | string | Meta description for SEO. 150-160 characters. Used in `<meta name="description">` and OG description. | `"The agent ecosystem has solved production..."` |
| `publish_date` | ISO 8601 string | Publication timestamp. Used for ordering, display dates, and `datePublished` in schema markup. | `"2026-04-11T10:00:00Z"` |
| `author` | string | Author display name. Used in byline and schema markup. | `"Simon"` |
| `tags` | string[] | Topic tags. Used for tag pages, filtering, and internal linking. Lowercase, hyphenated. | `["agentic-collaboration", "agent-stack"]` |

### Optional Metadata Fields

| Field | Type | Description | Default Behavior |
|-------|------|-------------|-----------------|
| `og_image` | string | Path or URL to the Open Graph image. | Blog frontend uses a default OG image template |
| `canonical_url` | string | Override canonical URL if different from the blog URL. | Blog frontend generates canonical from slug |
| `updated_date` | ISO 8601 string | Last content update. Used in `dateModified` schema markup. | Falls back to asset `updated_at` |
| `excerpt` | string | Short excerpt for listing pages. | Blog frontend generates from first paragraph |
| `reading_time` | int | Estimated reading time in minutes. | Blog frontend calculates from word count |
| `series` | string | Series identifier for multi-part posts. | No series grouping |
| `series_order` | int | Position within a series. | N/A |
| `draft` | boolean | If true, post is only visible in preview mode. | `false` |
| `featured` | boolean | If true, post appears in featured/hero sections. | `false` |

### Metadata Example (Full Blog Post)

```json
{
  "post_type": "blog_post",
  "title": "Agentic Collaboration — The Missing Layer in the Agent Stack",
  "description": "The agent ecosystem has solved production and is solving communication. But the actual surface where agents work together doesn't exist yet.",
  "publish_date": "2026-04-11T10:00:00Z",
  "author": "Simon",
  "tags": ["agentic-collaboration", "agent-stack", "multi-agent", "mcp", "a2a"],
  "og_image": "/images/posts/agentic-collaboration-og.png",
  "excerpt": "There's a missing layer between agents that do things and agents that do things together.",
  "reading_time": 8,
  "featured": true
}
```

### Convention Enforcement

The Tokenrip backend does **not** validate metadata contents — it stores whatever JSONB is provided. Validation is the publishing pipeline's responsibility. The backend treats metadata as opaque.

This is intentional. The backend serves all asset types, not just blog posts. Blog metadata conventions are a consumer-side concern, enforced by the publishing pipeline before the asset reaches the API.

The blog frontend should handle missing optional fields gracefully (fallback defaults). It should treat missing required fields as an error and render a fallback page or exclude the asset from listings.

---

## Component 3: Publishing Pipeline

The publishing pipeline replaces the current blog engine backend. It is the write path — taking raw content and producing a Tokenrip asset with blog-ready metadata.

### Pipeline Steps

```
Input: raw markdown file + optional frontmatter
                    │
                    ▼
        ┌───────────────────────┐
        │  1. Parse Frontmatter │  Extract title, description, tags, etc.
        │                       │  from YAML frontmatter if present.
        │                       │  Prompt for missing required fields.
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  2. Content Enrichment│  Validate heading structure (single H1).
        │                       │  Insert internal links to other posts.
        │                       │  Keyword optimization (optional).
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  3. Metadata Gen      │  Generate slug from title (if not provided).
        │                       │  Generate description (if not provided).
        │                       │  Calculate reading time.
        │                       │  Set publish_date to now (if not provided).
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  4. Validation        │  All required metadata fields present?
        │                       │  Slug format valid? Slug unique?
        │                       │  Content non-empty?
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  5. Publish           │  POST /assets with:
        │                       │    - content (enriched markdown)
        │                       │    - alias (the slug)
        │                       │    - type: "document"
        │                       │    - metadata: (blog metadata blob)
        │                       │
        │                       │  On update (slug exists):
        │                       │    - PUT /assets/:public_id
        │                       │    - or POST new version
        └───────────────────────┘
```

### Input Format

The pipeline accepts a markdown file with optional YAML frontmatter:

```markdown
---
title: "Agentic Collaboration — The Missing Layer in the Agent Stack"
description: "The agent ecosystem has solved production..."
tags: [agentic-collaboration, agent-stack, multi-agent]
slug: agentic-collaboration
author: Simon
og_image: /images/posts/agentic-collaboration-og.png
---

# Agentic Collaboration — The Missing Layer in the Agent Stack

The agent ecosystem has solved production...
```

If frontmatter is absent, the pipeline generates metadata from the content (title from H1, description from first paragraph, slug from title).

### Slug Generation

When not explicitly provided:

1. Take the title
2. Lowercase
3. Replace spaces and special characters with hyphens
4. Remove consecutive hyphens
5. Trim leading/trailing hyphens
6. Truncate to 128 characters at a word boundary

Example: `"Agentic Collaboration — The Missing Layer in the Agent Stack"` → `agentic-collaboration-the-missing-layer-in-the-agent-stack`

### Update Flow

To update an existing post:

1. Pipeline detects that the slug already exists (query `GET /assets/by-alias/:slug`)
2. If the asset exists, publish a new version (`POST /assets/:public_id/versions` with updated content)
3. If metadata changed, update metadata (`PATCH /assets/:public_id` with updated metadata blob)
4. The blog URL doesn't change — same slug, same alias, new content

### Implementation Form

The publishing pipeline can be implemented as:

- **A CLI command:** `tokenrip-blog publish post.md` — wraps the existing `tokenrip` CLI or calls the SDK directly. Suitable for manual publishing workflows.
- **A script in the blog frontend repo:** A build script that processes markdown files and publishes them. Suitable for batch publishing or CI-driven workflows.
- **A function in the SDK:** `blogPublish({ content, metadata })` — a higher-level wrapper around `rip.publish()` that handles metadata generation and validation. Suitable for programmatic publishing from the intelligence engine or other automated sources.

The form doesn't matter architecturally. What matters is that the pipeline is **separate from the blog frontend.** The blog frontend only reads. The publishing pipeline only writes. They share nothing except the Tokenrip API.

---

## Component 4: Blog Frontend (Projection Layer)

The blog frontend is a stateless SSR application. It queries Tokenrip for blog-typed assets and renders them with blog layout, SEO markup, and navigation. All data comes from the Tokenrip API — the frontend has no local data store.

### Routes

| Route | What It Renders | Data Source |
|-------|----------------|-------------|
| `/blog` | Blog index — paginated list of posts, most recent first | `GET /assets?metadata={"post_type":"blog_post"}&sort=-publish_date&limit=20` |
| `/blog/:slug` | Individual blog post | `GET /assets/by-alias/:slug` |
| `/blog/tag/:tag` | Posts filtered by tag | `GET /assets?metadata={"post_type":"blog_post","tags":["tag"]}&sort=-publish_date` |
| `/blog/rss.xml` | RSS 2.0 feed | Same query as blog index, limited to 20 most recent |
| `/blog/sitemap.xml` | Blog sitemap | All blog post aliases + updated dates |

### Individual Post Page (`/blog/:slug`)

**Data flow:**

1. Request arrives at `/blog/:slug`
2. Blog frontend calls `GET /assets/by-alias/:slug`
3. If asset not found → 404
4. If asset found but `metadata.post_type !== "blog_post"` → 404 (or redirect to asset view)
5. If asset found and `metadata.draft === true` → 404 (unless preview mode)
6. Extract content (markdown) and metadata from response
7. Render markdown to HTML
8. Wrap in blog layout template with:
   - `<title>` from `metadata.title`
   - `<meta name="description">` from `metadata.description`
   - Open Graph tags from metadata
   - JSON-LD Article schema markup from metadata
   - `<link rel="canonical">` pointing to `tokenrip.com/blog/:slug`
   - Blog navigation (header, footer, prev/next if applicable)
   - Tag links
   - Author byline and publish date

**Rendered HTML `<head>` (example):**

```html
<head>
  <title>Agentic Collaboration — The Missing Layer in the Agent Stack | Tokenrip</title>
  <meta name="description" content="The agent ecosystem has solved production and is solving communication. But the actual surface where agents work together doesn't exist yet.">
  <link rel="canonical" href="https://tokenrip.com/blog/agentic-collaboration">

  <!-- Open Graph -->
  <meta property="og:title" content="Agentic Collaboration — The Missing Layer in the Agent Stack">
  <meta property="og:description" content="The agent ecosystem has solved production...">
  <meta property="og:image" content="https://tokenrip.com/images/posts/agentic-collaboration-og.png">
  <meta property="og:url" content="https://tokenrip.com/blog/agentic-collaboration">
  <meta property="og:type" content="article">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Agentic Collaboration — The Missing Layer in the Agent Stack">
  <meta name="twitter:description" content="The agent ecosystem has solved production...">
  <meta name="twitter:image" content="https://tokenrip.com/images/posts/agentic-collaboration-og.png">

  <!-- JSON-LD Article Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Agentic Collaboration — The Missing Layer in the Agent Stack",
    "description": "The agent ecosystem has solved production...",
    "author": {
      "@type": "Person",
      "name": "Simon"
    },
    "datePublished": "2026-04-11T10:00:00Z",
    "dateModified": "2026-04-11T10:00:00Z",
    "publisher": {
      "@type": "Organization",
      "name": "Tokenrip"
    },
    "mainEntityOfPage": "https://tokenrip.com/blog/agentic-collaboration"
  }
  </script>
</head>
```

### Blog Index Page (`/blog`)

Renders a paginated list of posts. Each entry shows:

- Title (linked to `/blog/:slug`)
- Excerpt (from `metadata.excerpt` or auto-generated)
- Publish date
- Tags (linked to `/blog/tag/:tag`)
- Reading time
- Author

No content bodies on the listing page — metadata only. This is why the filtered listing endpoint should return metadata without content by default.

### Caching Strategy

The blog frontend should cache Tokenrip API responses to avoid hitting the backend on every page load. Recommended approach:

| Content | Cache TTL | Invalidation |
|---------|-----------|-------------|
| Individual post | 5 minutes | Time-based expiry. New version publishes are picked up within 5 minutes. |
| Blog index | 2 minutes | Time-based expiry. New posts appear within 2 minutes. |
| Tag pages | 5 minutes | Time-based expiry. |
| RSS feed | 10 minutes | Time-based expiry. RSS readers are tolerant of staleness. |
| Sitemap | 1 hour | Time-based expiry. Search engines re-crawl on their own schedule. |

For v1, time-based expiry is sufficient. If Tokenrip later supports ETags or webhook notifications, the blog frontend can upgrade to invalidation-based caching.

---

## SEO: Canonical URL Strategy

The same content is accessible at multiple URLs. Search engines must know which is authoritative.

### The Problem

A blog post with slug `agentic-collaboration` will be accessible at:

1. `tokenrip.com/blog/agentic-collaboration` — blog projection
2. `tokenrip.com/agentic-collaboration` — alias resolution to asset view
3. `tokenrip.com/assets/:public_id` — direct asset ID URL

If all three are indexable, search engines split ranking authority across them. Backlinks to any one URL only benefit that URL, not the others.

### The Solution

| URL | Indexable? | Canonical Tag | Behavior |
|-----|-----------|---------------|----------|
| `tokenrip.com/blog/:slug` | Yes | Points to itself | **The authoritative URL for search engines** |
| `tokenrip.com/:alias` | No | `<link rel="canonical" href="tokenrip.com/blog/:slug">` | Renders asset view but defers SEO authority to blog URL |
| `tokenrip.com/assets/:public_id` | No | `<link rel="canonical" href="tokenrip.com/blog/:slug">` | Same — defers to blog URL |

**Implementation:** When the asset view renders an asset that has `metadata.post_type === "blog_post"`, it should include a canonical tag pointing to the blog URL (`/blog/:alias`). This tells search engines "the real page is over there."

**The asset view should also include:**

```html
<meta name="robots" content="noindex, follow">
```

This is a belt-and-suspenders approach — the canonical tag handles most crawlers, but `noindex` ensures that crawlers which ignore canonical tags still don't index the duplicate.

**For non-blog assets:** The asset view remains the canonical URL. No canonical tag override. No `noindex`. The blog SEO rules only apply to assets with `post_type === "blog_post"`.

---

## Intelligence Engine Integration Point

The intelligence engine does not exist yet. This section documents where it connects so the architecture supports it without modification.

### Current Pipeline (Manual)

```
Human writes markdown
    → Publishing Pipeline (enrich + metadata)
        → POST /assets (Tokenrip)
            → Blog Frontend renders at /blog/:slug
```

### Future Pipeline (Intelligence Engine)

```
Intelligence Engine synthesizes post from wiki sources
    → Output: markdown + suggested metadata + source citations
        → Editorial pass (human reviews, edits)
            → Publishing Pipeline (enrich + metadata — same pipeline as manual)
                → POST /assets (Tokenrip — same API)
                    → Blog Frontend renders (same projection — unchanged)
```

**What changes:** The content source. The intelligence engine produces a draft post with richer metadata (source citations, entity references from the wiki, confidence scores on claims). This metadata flows into the JSONB blob alongside the standard blog fields.

**What doesn't change:** The publishing pipeline, the Tokenrip API, the blog frontend. The intelligence engine is an upstream addition — it produces content that enters the same pipeline.

**Metadata extension for intelligence engine posts:**

```json
{
  "post_type": "blog_post",
  "title": "...",
  "description": "...",
  "tags": ["..."],
  "publish_date": "...",
  "author": "Simon",

  "source_type": "intelligence_engine",
  "source_wiki_pages": ["entities/crewai.md", "entities/langgraph.md"],
  "source_urls": ["https://github.com/crewAIInc/crewAI", "..."],
  "ingested_at": "2026-05-01T10:00:00Z"
}
```

The blog frontend ignores fields it doesn't recognize. The intelligence-engine-specific metadata is there for provenance and future features (e.g., a "Sources" section on blog posts, or re-ingestion triggers when source data changes).

---

## What This Design Explicitly Avoids

| Temptation | Why It's Avoided |
|------------|-----------------|
| Blog-specific columns on the asset table | The asset table serves all asset types. Blog conventions belong in metadata, not schema. The alias is the exception because it's a general-purpose lookup key useful beyond blogs. |
| A separate blog database or content store | Single source of truth. The blog frontend is a projection, not a system. If the blog frontend dies, the content is still in Tokenrip. |
| Custom query language for metadata filtering | PostgreSQL's JSONB containment operator (`@>`) does everything the blog needs. A custom DSL is over-engineering. |
| Blog-aware logic in the Tokenrip backend | Tokenrip doesn't know what a blog post is. It stores assets with metadata. The blog is a consumer that interprets metadata conventions. This keeps the backend clean and general-purpose. |
| Publishing logic in the blog frontend | The blog frontend only reads. It never calls `POST /assets`. Clean read/write separation means the frontend can be rebuilt, replaced, or run as a static site generator without affecting the publishing workflow. |
| Content enrichment at render time | Content is enriched once at publish time. The blog frontend renders what it receives. This avoids per-request computation and ensures consistency — every reader sees the same enriched content. |

---

## Open Questions for Engineering

These are implementation decisions the engineer should resolve during build:

### Backend

1. **Alias resolution precedence.** When `GET /tokenrip.com/:something` arrives, is `:something` checked against aliases first, then routes? Or are routes checked first? Routes should take precedence to avoid aliases accidentally shadowing API endpoints. The reserved words list prevents this for known routes, but the resolution order matters for defense in depth.

2. **Metadata filter endpoint design.** The spec suggests a `metadata` query parameter accepting a JSON object for containment queries. An alternative is a more structured filter syntax (e.g., `filter[metadata.post_type]=blog_post&filter[metadata.tags]=contains:agentic-collaboration`). The JSON containment approach is simpler and maps directly to PostgreSQL's `@>`, but the structured syntax is more conventional for REST APIs. Choose based on what's consistent with existing API conventions.

3. **Pagination strategy.** Offset-based (`limit` + `offset`) is sufficient for blog listings. Cursor-based pagination is more scalable but unnecessary for the expected data volume (hundreds of blog posts, not millions). If cursor-based pagination already exists in the API, use it for consistency. Otherwise, offset-based is fine.

4. **Alias immutability enforcement.** Should the API warn or block when changing an alias that has been live for more than N days? This prevents accidental link breakage. Alternatively, support alias redirects — when an alias changes, the old alias redirects to the new one. This is a nice-to-have, not a requirement for v1.

5. **Sort field validation.** The metadata sort parameter (`sort=-publish_date`) needs server-side mapping to `(metadata->>'publish_date')::timestamptz DESC`. Should the server support sorting on arbitrary metadata keys, or only a whitelisted set? Whitelisting is safer and prevents abuse (sorting on large text fields, etc.).

### Blog Frontend

6. **Where does the blog frontend run?** Options: same deployment as Tokenrip (shared process, blog routes added to the existing server), or a separate deployment with its own domain/subdomain. If same deployment, the blog routes are just additional route handlers. If separate, the blog frontend is a standalone Bun SSR app that calls Tokenrip's API over HTTP.

7. **Markdown rendering.** The blog frontend renders markdown to HTML. Which markdown parser and what extensions? (Syntax highlighting, footnotes, table of contents, math, etc.) This should be consistent with the asset view's markdown rendering to avoid "looks different on the blog vs. asset page" issues.

8. **Image hosting.** Where do blog images (inline images, OG images) live? Options: committed to the blog frontend repo and served as static assets, uploaded to Tokenrip as separate assets, or hosted on a CDN. The OG image path in metadata (`/images/posts/...`) implies static hosting — clarify the convention.

9. **Preview mode.** The publishing pipeline sets `metadata.draft = true` for unpublished posts. How does the blog frontend handle preview? Options: a `?preview=true` query parameter that bypasses the draft filter (requires auth), or a separate preview URL scheme. This enables editorial review before publishing.

### Publishing Pipeline

10. **Slug uniqueness check.** The pipeline should verify slug uniqueness before publishing. Should this be a client-side check (`GET /assets/by-alias/:slug` → 404 means available) or a server-side constraint (publish with duplicate alias returns 409 Conflict)? Both. The pipeline checks proactively. The server enforces as a safety net.

11. **Internal link resolution.** The pipeline inserts internal links to other blog posts. How does it know what other posts exist? It needs to query Tokenrip for existing blog post aliases. This is the same filtered listing endpoint the blog frontend uses.

---

## Implementation Sequence

Recommended order of operations, optimized for "first blog post live as fast as possible":

### Phase 1: Backend (unblocks everything)

1. Add `alias` column + unique partial index
2. Add `alias` to `POST /assets` and `PATCH /assets/:id`
3. Add `GET /assets/by-alias/:alias` endpoint
4. Add GIN index on `metadata`
5. Add filtered asset listing endpoint (even a minimal version — `post_type` filter + `publish_date` sort)

### Phase 2: Publishing Pipeline (unblocks first post)

6. Build the pipeline (even as a simple script that reads frontmatter, generates metadata, calls the API)
7. Publish the first post with correct metadata

### Phase 3: Blog Frontend (unblocks public visibility)

8. Add `/blog/:slug` route that calls `GET /assets/by-alias/:slug` and SSR renders
9. Add `/blog` index route that calls the filtered listing endpoint
10. Add SEO markup (meta tags, OG, JSON-LD, canonical)
11. Add canonical tag to asset view for blog-type assets

### Phase 4: Polish

12. RSS feed
13. Sitemap
14. Tag pages
15. Caching layer
16. Alias resolution on `GET /:alias`

---

## Related Documents

- [[tokenrip]] — Platform architecture, five-layer model, 30-day build plan
- [[tokenrip-messaging-architecture-v2]] — Messaging primitives, identity model, asset/thread data model
- [[tokenrip-coordination-data-model]] — Coordination layer, contribution entity, asset entity schema
- [[platform-roadmap]] — Phase sequencing: Blog → Newsletter → Oracle → Community
- [[intelligence-engine-design]] — Intelligence engine architecture, ingest workflows, Karpathy wiki pattern
- [[tokenrip-initial-blog-plan-2026-04-11]] — Blog content plan, 8 initial posts, SEO strategy, ingestion data model
- [[distribution-strategy]] — Integration hierarchy, viral mechanics, branding tiers
