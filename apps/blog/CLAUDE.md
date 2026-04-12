# Blog Frontend (`apps/blog/`)

Blog frontend serving SSR HTML with client-side markdown rendering. Fetches data from the Tokenrip API, serves an SSR head (meta tags, JSON-LD, canonical URLs) with raw markdown in the body, then hydrates with client JS for styled rendering.

## Commands

| Command | What it does |
|---|---|
| `bun install` | Install dependencies |
| `bun run dev` | Start dev server with watch mode |
| `bun run build:client` | Build client bundle with Vite (outputs to `dist/client/`) |
| `bun run start` | Start production server |

## Architecture

- **Bun HTTP server** (`src/serve.ts`) — serves HTML pages, fetches data from Tokenrip API
- **SSR head** — meta tags, Open Graph, JSON-LD, canonical URLs injected server-side from asset metadata
- **Client bundle** — React + react-markdown + remark-gfm + rehype-highlight renders raw markdown into styled HTML
- **Vite** — builds client bundle from `src/client/entry.tsx` to `dist/client/blog.js`
- **Caching** — in-memory TTL cache on API responses (5min posts, 2min listings)

## Routes

| Route | What It Renders |
|---|---|
| `/blog` | Blog index — paginated list of posts |
| `/blog/:slug` | Individual blog post |
| `/blog/tag/:tag` | Posts filtered by tag |
| `/blog/rss.xml` | RSS 2.0 feed |
| `/blog/sitemap.xml` | XML sitemap |

## Data Source

All data comes from the Tokenrip API:
- Individual posts: `GET /v0/assets/:slug` (public, alias lookup)
- Post listings: `POST /v0/assets/query` (private, needs API key)

Blog posts are Tokenrip assets with `metadata.post_type === "blog_post"`.

## Environment Variables

See `.env.sample` for configuration:
- `PORT` — server port (default 3600)
- `TOKENRIP_API_URL` — Tokenrip backend URL
- `TOKENRIP_API_KEY` — API key for listing queries
- `BLOG_BASE_PATH` — URL path prefix for blog routes
- `BASE_URL` — public-facing base URL for canonical links
