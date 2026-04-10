# Blog Frontend (`apps/blog/`)

Blog frontend serving SSR HTML with client-side markdown rendering. Fetches article data from the blog-engine API, serves an SSR head (meta tags, JSON-LD from frontmatter) with raw markdown in the body, then hydrates with client JS for styled rendering.

## Commands

| Command | What it does |
|---|---|
| `bun install` | Install dependencies |
| `bun run dev` | Start dev server with watch mode |
| `bun run build:client` | Build client bundle with Vite (outputs to `dist/client/`) |
| `bun run start` | Start production server |

## Architecture

- **Bun HTTP server** (`src/serve.ts`) — serves HTML pages, fetches article data from blog-engine API
- **SSR head** — meta tags, Open Graph, JSON-LD injected server-side from frontmatter
- **Client bundle** — React + react-markdown + remark-gfm + rehype-highlight renders raw markdown into styled HTML
- **Vite** — builds client bundle from `src/client/entry.tsx` to `dist/client/blog.js`

## Environment Variables

See `.env.sample` for configuration:
- `PORT` — server port (default 3600)
- `BLOG_ENGINE_URL` — blog-engine API base URL
- `BLOG_BASE_PATH` — URL path prefix for blog routes
- `BASE_URL` — public-facing base URL for canonical links

## Design Doc

See `docs/plans/2026-04-09-blog-engine-design.md` for the full system design.
