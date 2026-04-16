# Blog System Setup

The blog system has three components: the **Tokenrip backend** (stores blog posts as assets), the **publishing pipeline** (enriches and publishes markdown), and the **blog frontend** (renders blog pages). The backend must be running before you can publish or view posts.

## Prerequisites

- **Bun** (latest) — runs all components
- **PostgreSQL** — required by the Tokenrip backend
- **Anthropic API key** (optional) — enables LLM enrichment (FAQ, tags, polished descriptions)

## Quick Start

```bash
# 1. Install all dependencies from monorepo root
bun install

# 2. Start the Tokenrip backend (port 3434)
#    Requires PostgreSQL running with a 'tokenrip' database
cd apps/backend && bun run start:dev

# 3. Register an agent and get an API key
#    (needed by the pipeline and blog frontend for queries)
curl -X POST http://localhost:3434/v0/agents \
  -H 'Content-Type: application/json' \
  -d '{"public_key": "<your-ed25519-hex-pubkey>"}'
# → { "ok": true, "data": { "agent_id": "...", "api_key": "sk_..." } }

# 4. Set up the publishing pipeline
cp apps/blog-pipeline/.env.sample apps/blog-pipeline/.env
# Edit .env: set TOKENRIP_API_KEY=sk_... from step 3

# 5. Publish your first blog post
bun run apps/blog-pipeline/src/cli.ts path/to/your-post.md

# 6. Set up the blog frontend
cp apps/blog/.env.sample apps/blog/.env
# Edit .env: set TOKENRIP_API_KEY=sk_... from step 3

# 7. Build the client bundle and start the blog frontend (port 3600)
cd apps/blog && bun run build:client && bun run dev
```

Verify everything works:

```bash
# Check the published post via API
curl http://localhost:3434/v0/assets/your-post-slug

# View the blog
curl http://localhost:3600/blog
curl http://localhost:3600/blog/your-post-slug
```

---

## Publishing Blog Posts

Blog posts are published through the pipeline CLI. Write a markdown file with optional YAML frontmatter:

```markdown
---
title: "My First Blog Post"
description: "A short description for SEO."
tags: [intro, blog]
author: Simon
---

# My First Blog Post

Article content goes here in **markdown**.
```

Publish it:

```bash
bun run apps/blog-pipeline/src/cli.ts path/to/my-post.md
# → Published: my-first-blog-post (abc123-def456-...)
```

The pipeline:
1. Parses frontmatter
2. Generates slug from title if not provided
3. Generates description from first paragraph if not provided
4. Calculates reading time
5. Runs LLM enrichment if `ANTHROPIC_API_KEY` is configured (FAQ, tags, polished description)
6. Publishes to Tokenrip via `POST /v0/assets` with the slug as `alias` and blog metadata

The post is immediately accessible at `http://localhost:3600/blog/my-first-blog-post`.

### Minimal frontmatter

The only hard requirement is content. If frontmatter is absent, the pipeline extracts the title from the first H1 heading:

```markdown
# Auto-Titled Post

This post has no frontmatter at all.
```

### Updating a post

Re-publish the same file. The pipeline detects the slug already exists and creates a new version:

```bash
# Edit your-post.md, then:
bun run apps/blog-pipeline/src/cli.ts path/to/your-post.md
# → Updated: my-first-blog-post (abc123-def456-...)
```

### Frontmatter reference

| Field | Required | Type | Pipeline behavior if missing |
|-------|----------|------|------------------------------|
| `title` | No* | string | Extracted from first H1 |
| `slug` | No | string | Generated from title |
| `description` | No | string | Extracted from first paragraph (max 160 chars) |
| `publish_date` | No | ISO 8601 | Set to current timestamp |
| `author` | No | string | Falls back to `BLOG_AUTHOR_NAME` env var |
| `tags` | No | string[] | Empty array (or filled by LLM enrichment) |
| `og_image` | No | string | Blog frontend uses default |
| `excerpt` | No | string | Blog frontend generates from first paragraph |
| `featured` | No | boolean | `false` |
| `draft` | No | boolean | `false` |

*Either `title` in frontmatter or an H1 heading in content is required.

---

## LLM Enrichment

When `ANTHROPIC_API_KEY` is set in the pipeline's `.env`, each publish triggers a Claude API call that generates:

- **Description:** SEO-optimized summary (max 160 chars)
- **Tags:** 3-7 lowercase topic tags
- **FAQ:** 5-10 question/answer pairs for structured data
- **OG type:** `article`

Enrichment is **additive** — it only fills missing fields. If you set `description` or `tags` in frontmatter, those values are preserved.

### Configure enrichment

```bash
# In apps/blog-pipeline/.env
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
ANTHROPIC_MODEL=claude-sonnet-4-5-20250514   # optional
BLOG_AUTHOR_NAME=Tokenrip                    # optional
BLOG_AUTHOR_TYPE=Organization                # optional
```

### Publish with enrichment

```bash
# Publish with just a title — LLM fills in the rest
bun run apps/blog-pipeline/src/cli.ts post.md
```

The LLM call takes 5-30 seconds. The enriched metadata is published as part of the asset's metadata blob.

### Skip enrichment

Remove or leave blank `ANTHROPIC_API_KEY` in `.env`. The pipeline publishes with only the basic metadata (slug, description from excerpt, timestamp).

---

## Environment Variables

### Publishing Pipeline (`apps/blog-pipeline/.env`)

| Variable | Default | Required | Description |
|---|---|---|---|
| `TOKENRIP_API_URL` | `http://localhost:3434` | Yes | Tokenrip backend URL |
| `TOKENRIP_API_KEY` | — | Yes | API key for publishing assets |
| `ANTHROPIC_API_KEY` | — | No | Enables LLM enrichment |
| `ANTHROPIC_MODEL` | `claude-sonnet-4-5-20250514` | No | Model for enrichment |
| `BLOG_AUTHOR_NAME` | `Tokenrip` | No | Default author name |
| `BLOG_AUTHOR_TYPE` | `Organization` | No | `Organization` or `Person` |

### Blog Frontend (`apps/blog/.env`)

| Variable | Default | Required | Description |
|---|---|---|---|
| `PORT` | `3600` | No | HTTP server port |
| `TOKENRIP_API_URL` | `http://localhost:3434` | Yes | Tokenrip backend URL |
| `TOKENRIP_API_KEY` | — | Yes | API key for listing queries |
| `BLOG_BASE_PATH` | `/blog` | No | URL path prefix for blog routes |
| `BASE_URL` | `http://localhost:3600` | No | Public URL for canonical links |

---

## Blog Frontend Routes

| Route | What It Renders |
|-------|----------------|
| `/blog` | Blog index — paginated list of posts, most recent first |
| `/blog/:slug` | Individual blog post with full SSR head |
| `/blog/tag/:tag` | Posts filtered by tag |
| `/blog/rss.xml` | RSS 2.0 feed (latest 20 posts) |
| `/blog/sitemap.xml` | XML sitemap (all posts) |

---

## Development Workflow

Run the backend and blog frontend in separate terminals:

```bash
# Terminal 1: Tokenrip backend
cd apps/backend && bun run start:dev

# Terminal 2: Blog frontend (auto-reload on server changes)
cd apps/blog && bun run dev

# Publish a test post
bun run apps/blog-pipeline/src/cli.ts test-post.md
```

Client-side changes (React markdown renderer) require rebuilding the Vite bundle:

```bash
cd apps/blog && bun run build:client
```

---

## Building for Production

### Blog frontend

```bash
cd apps/blog
bun run build:client   # Vite builds client bundle to dist/client/
bun run start          # Runs production server
```

The blog frontend serves its client assets from `dist/client/` at `{BLOG_BASE_PATH}/_assets/`.

---

## Nginx Configuration

Example nginx config routing `/blog/*` to the blog frontend:

```nginx
upstream blog_frontend {
    server 127.0.0.1:3600;
}

upstream tokenrip_backend {
    server 127.0.0.1:3434;
}

upstream tokenrip_frontend {
    server 127.0.0.1:3333;
}

server {
    listen 80;
    server_name tokenrip.com;

    # Blog routes
    location /blog {
        proxy_pass http://blog_frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Blog static assets
    location /blog/_assets/ {
        proxy_pass http://blog_frontend;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # API
    location /v0/ {
        proxy_pass http://tokenrip_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Main frontend
    location / {
        proxy_pass http://tokenrip_frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Set `BASE_URL` in the blog frontend to match your public domain:

```bash
BASE_URL=https://tokenrip.com
BLOG_BASE_PATH=/blog
```

---

## Verifying the Setup

```bash
# 1. Backend is running and has the alias/query endpoints
curl http://localhost:3434/v0/health

# 2. Publish a test post
bun run apps/blog-pipeline/src/cli.ts test-post.md

# 3. Verify post is accessible via alias
curl http://localhost:3434/v0/assets/test-post-slug | jq .data.alias

# 4. Verify post metadata
curl http://localhost:3434/v0/assets/test-post-slug | jq .data.metadata

# 5. Verify blog frontend renders
curl http://localhost:3600/blog | grep "test-post"
curl http://localhost:3600/blog/test-post-slug | grep "<title>"

# 6. Verify content negotiation
curl -H 'Accept: text/markdown' http://localhost:3600/blog/test-post-slug

# 7. Verify RSS feed
curl http://localhost:3600/blog/rss.xml

# 8. Verify sitemap
curl http://localhost:3600/blog/sitemap.xml
```

---

## Troubleshooting

**"TOKENRIP_API_KEY is required"**
The pipeline needs an API key to publish. Register an agent via `POST /v0/agents` and set the key in `.env`.

**Blog frontend shows empty index**
Check that `TOKENRIP_API_KEY` is set in `apps/blog/.env`. The listing query (`POST /v0/assets/query`) requires authentication.

**Post published but not showing on blog**
Verify the asset has `metadata.post_type = "blog_post"`. Check with:
```bash
curl http://localhost:3434/v0/assets/your-slug | jq .data.metadata.post_type
```

**Port conflict on 3434 or 3600**
```bash
lsof -i :3434   # Find what's using the port
```

**Blog frontend shows unstyled markdown**
Build the client bundle:
```bash
cd apps/blog && bun run build:client
```

**Blog frontend returns "Not found" for all routes**
Check that `BLOG_BASE_PATH` matches the URL path (default: `/blog`).

**Pipeline fails with "Failed to publish asset"**
Check that the backend is running and the API key is valid. Check backend logs for details.

**Alias conflict on publish**
Two posts can't share the same slug. The backend enforces uniqueness via a partial unique index. Use a different slug or update the existing post.
