# Blog System Setup

The blog system consists of two apps: **blog-engine** (Fastify API that stores and indexes articles) and **blog** (Bun HTTP server that renders articles as SSR HTML with client-side hydration). The engine owns article storage and a disposable SQLite index. The frontend fetches from the engine and serves pages.

## Prerequisites

- **Bun** (latest) — runs the blog frontend and installs monorepo dependencies
- **Node.js 18+** — runs blog-engine (Fastify + better-sqlite3)
- **tsx** — dev dependency for blog-engine watch mode (installed via `bun install`)

## Quick Start

```bash
# 1. Install all dependencies from monorepo root
bun install

# 2. Set up blog-engine environment
cp apps/blog-engine/.env.sample apps/blog-engine/.env

# 3. Create storage and database directories
mkdir -p apps/blog-engine/articles apps/blog-engine/data

# 4. Start the blog-engine API (port 3500)
cd apps/blog-engine && bun run dev

# 5. In a new terminal — build the blog frontend client bundle
cd apps/blog && bun run build:client

# 6. Set up blog frontend environment
cp apps/blog/.env.sample apps/blog/.env

# 7. Start the blog frontend (port 3600)
cd apps/blog && bun run dev
```

Verify both are running:

```bash
# Blog engine health check
curl http://localhost:3500/articles

# Blog frontend
curl http://localhost:3600/blog
```

## Environment Variables

### blog-engine (`apps/blog-engine/.env`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3500` | HTTP server port |
| `NODE_ENV` | `development` | Environment mode |
| `STORAGE_PROVIDER` | `local` | Storage backend (`local` only — S3 planned) |
| `STORAGE_PATH` | `./articles` | Directory where markdown article files are stored |
| `SQLITE_PATH` | `./data/blog.sqlite` | Path to the SQLite index database |
| `BLOG_ENGINE_URL` | `http://localhost:3500` | Public URL of the blog-engine (used by the blog frontend) |

### blog (`apps/blog/.env`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3600` | HTTP server port |
| `BLOG_ENGINE_URL` | `http://localhost:3500` | Blog-engine API base URL |
| `BLOG_BASE_PATH` | `/blog` | URL path prefix for all blog routes |
| `BASE_URL` | `http://localhost:3600` | Public-facing base URL for canonical links and meta tags |

## Development Workflow

**Blog-engine** uses `tsx watch` for hot reload. File changes in `apps/blog-engine/src/` restart the server automatically:

```bash
cd apps/blog-engine && bun run dev
```

**Blog frontend** uses `bun run --watch` for hot reload on the server. However, changes to client-side code (`src/client/`) require rebuilding the Vite bundle:

```bash
# Server-side changes — auto-reload
cd apps/blog && bun run dev

# Client-side changes — rebuild manually
cd apps/blog && bun run build:client
```

## Building for Production

### Blog-engine

```bash
cd apps/blog-engine
bun run build          # Compiles TypeScript to dist/
bun run start          # Runs compiled build: node dist/main.js
```

### Blog frontend

```bash
cd apps/blog
bun run build:client   # Vite builds client bundle to dist/client/
bun run start          # Runs production server: bun run src/serve.ts
```

The blog frontend serves its client assets from `dist/client/` at the path `{BLOG_BASE_PATH}/_assets/`. The Vite build outputs `blog.js` and `blog.css` to that directory.

## Storage Configuration

Articles are stored as markdown files with YAML frontmatter at `{STORAGE_PATH}/{slug}.md`. The storage path is relative to the blog-engine working directory by default.

```
apps/blog-engine/
├── articles/          # STORAGE_PATH (default: ./articles)
│   ├── my-first-post.md
│   └── another-article.md
└── data/
    └── blog.sqlite    # SQLITE_PATH (default: ./data/blog.sqlite)
```

The SQLite database is a **disposable derived index** — it is rebuilt from the markdown files on disk. You can delete it and reindex at any time without data loss.

For production, set `STORAGE_PATH` to an absolute path outside the app directory:

```bash
STORAGE_PATH=/var/data/blog/articles
SQLITE_PATH=/var/data/blog/blog.sqlite
```

**Future:** S3 storage support is planned. The `STORAGE_PROVIDER` variable exists for this purpose but currently only `local` is implemented.

## Reindexing

The SQLite index can be rebuilt from the markdown files on disk. Do this when:

- The SQLite database is missing or corrupt
- You've added or modified article files directly on disk (outside the API)
- You want a clean index

### CLI method

```bash
cd apps/blog-engine && bun run reindex
```

### API method

```bash
curl -X POST http://localhost:3500/articles/reindex
```

Both methods scan all `.md` files in the storage path, parse frontmatter, and rebuild the index. The response includes the count of indexed articles:

```json
{"ok": true, "count": 5}
```

## Publishing Articles

Publish articles by sending markdown with YAML frontmatter to the engine API. The content type must be `text/markdown`.

### Basic publish

```bash
curl -X POST http://localhost:3500/articles/publish \
  -H "Content-Type: text/markdown" \
  -d '---
title: "My First Post"
description: "A short description"
tags: ["blog", "intro"]
---

# My First Post

Article content goes here in **markdown**.'
```

Response:

```json
{"ok": true, "slug": "my-first-post"}
```

### Publish from a file

```bash
curl -X POST http://localhost:3500/articles/publish \
  -H "Content-Type: text/markdown" \
  --data-binary @my-article.md
```

The slug is derived from the title in the frontmatter. The article is immediately available at `http://localhost:3600/blog/{slug}`.

### Delete an article

```bash
curl -X DELETE http://localhost:3500/articles/my-first-post
```

## Nginx Configuration

Example nginx config for routing `/blog/*` requests to the blog frontend while serving the rest of the site from another backend:

```nginx
upstream blog_frontend {
    server 127.0.0.1:3600;
}

server {
    listen 80;
    server_name example.com;

    # Blog routes — proxy to blog frontend
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
        proxy_set_header Host $host;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Everything else — your main app
    location / {
        proxy_pass http://127.0.0.1:3333;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Set `BASE_URL` in the blog frontend to match your public domain:

```bash
BASE_URL=https://example.com
BLOG_BASE_PATH=/blog
```

## Troubleshooting

**Port conflict on 3500 or 3600**
Another process is using the port. Either stop it or change the `PORT` in the respective `.env` file:
```bash
lsof -i :3500   # Find what's using the port
```

**Empty article index / no articles returned**
The SQLite index hasn't been built yet, or the storage path has no articles. Reindex:
```bash
cd apps/blog-engine && bun run reindex
```

**Storage path permission errors**
The blog-engine creates the `STORAGE_PATH` and `SQLITE_PATH` parent directories on startup. If running as a different user in production, ensure the process has write access:
```bash
mkdir -p /var/data/blog/articles /var/data/blog
chown appuser:appuser /var/data/blog
```

**Blog frontend returns "Not found" for all routes**
Check that `BLOG_BASE_PATH` matches the URL path you're accessing. The frontend only responds to paths under this prefix (default: `/blog`).

**Blog frontend shows unstyled markdown**
The client bundle hasn't been built. Run:
```bash
cd apps/blog && bun run build:client
```

**Blog-engine connection refused from blog frontend**
Check that `BLOG_ENGINE_URL` in the blog frontend `.env` matches the address the engine is actually listening on. If both run on the same host, use `http://localhost:3500`.

**`tsx: command not found`**
Install dependencies from the monorepo root:
```bash
bun install
```
