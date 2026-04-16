# Blog System (Blog-as-Projection)

> Design rationale for the blog system. Captures *why* decisions were made.
>
> **Updated 2026-04-11:** The blog system was refactored from a standalone blog engine (Fastify + SQLite + local files) to a blog-as-projection architecture. Blog posts are now Tokenrip assets with metadata conventions. The standalone blog engine was replaced by a publishing pipeline (`apps/blog-pipeline/`) and the blog frontend (`apps/blog/`) now reads from the Tokenrip API. See `docs/plans/2026-04-11-blog-as-projection-spec.md` for the full architecture specification.

## Problem

Tokenrip needs a blog optimized for agentic consumption — articles that AI agents can read directly, with structured metadata for search engines and LLMs. Standard CMS platforms (WordPress, Strapi, Ghost) bring a mountain of features we don't need: author management, editor roles, WYSIWYG editing, plugin ecosystems, revision workflows. All of that is overhead when the publishing pipeline is an agent writing markdown.

The blog also needs to be portable. If another project needs a blog with the same characteristics, it should be copy/paste — not "install our framework and configure 40 settings."

## Decision: Two Separate Apps

**The blog frontend (`apps/blog/`) and blog engine (`apps/blog-engine/`) are separate applications.**

### Why separate?

- Frontend can change independently of backend. Redesign the blog without touching article storage or the publishing pipeline.
- Each app is self-contained and copy/paste portable. Drop `apps/blog-engine/` into another project and point any frontend at its API.
- The seam between them is a small HTTP API (`GET /articles/:slug`, `GET /articles`). This contract is trivial to implement against — any frontend framework can consume it.
- Different runtime characteristics. The frontend is a Bun HTTP server focused on rendering. The backend is a Fastify server focused on storage, indexing, and enrichment.

### Why not a single app?

A combined app would be simpler initially, but it couples rendering decisions to storage decisions. Changing the frontend framework means touching the article pipeline. Copy/paste reuse means taking both halves even when you only need one.

## Decision: Markdown Files as Source of Truth

**Articles are single `.md` files with YAML frontmatter. The file is the canonical record.**

### Why files over database?

- Agents produce markdown natively. No transformation step to store an article — the output of the writing pipeline is the storage format.
- Git-friendly. Articles can be version-controlled, diffed, and reviewed with standard tools.
- Inspectable without tooling. `cat article.md` shows you everything — metadata and content in one file.
- No migration headaches. The "schema" is frontmatter keys. Adding a new field means adding a line to the YAML block.

### Why frontmatter for all metadata?

Every piece of metadata needed to render the page head (title, description, Open Graph tags, JSON-LD, FAQ schema) lives in the frontmatter. This means:

- No sidecar files to keep in sync
- No database lookup at serve time for metadata
- A single `GET /articles/:slug` returns parsed frontmatter + raw body — everything the frontend needs in one call

### Why not a database as primary storage?

A database adds an abstraction layer between the content and the operator. Debugging "why does this article look wrong?" becomes a SQL query instead of reading a file. Backups become database dumps instead of file copies. The content is text — storing it as text is the simplest thing that works.

## Decision: Disposable SQLite Index

**A SQLite database indexes article metadata for list queries. It is derived, not primary. Delete it and rebuild from the markdown files.**

### Why an index at all?

Listing articles by date, filtering by tag, and paginating requires structured queries. Scanning and parsing every markdown file on each list request is wasteful once the article count grows.

### Why SQLite?

- Single file, no server process. Fits the "copy/paste portable" goal.
- Fast enough for blog-scale reads (hundreds to low thousands of articles).
- `better-sqlite3` gives synchronous reads — no async overhead for simple queries.
- Disposable by design. `rm blog.sqlite && curl -X POST /articles/reindex` rebuilds it.

### Why not PostgreSQL?

PostgreSQL is the right choice for the main Tokenrip backend — multi-process, transactional, relational data. For a blog index that is derived from files and can be rebuilt in seconds, it's overkill. It adds a server dependency, connection management, and migration tooling for what amounts to a read-optimized cache.

## Decision: SSR Head + Raw Markdown Body

**The server renders the `<head>` (meta tags, Open Graph, JSON-LD). The body contains raw markdown. Client JS renders it styled for humans.**

### Why not full SSR?

Full server-side markdown rendering means the server needs to run remark/rehype on every request (or cache the output). It also means the rendered HTML is the response — agents that want markdown have to parse HTML back into text. Raw markdown in the body serves agents directly.

### Why not SPA?

A single-page app loads an empty shell, then fetches content via JavaScript. Crawlers and AI agents see nothing useful. This violates the agent-first principle — the content must be in the initial response.

### The hybrid

- **Crawlers and agents** get `<head>` with complete structured data (title, description, OG image, JSON-LD Article schema, FAQPage schema) plus raw markdown in the body. No JavaScript required.
- **Humans** get the same initial payload, but client JS (react-markdown + remark-gfm + rehype-highlight) renders the markdown into styled HTML. The raw markdown is visually hidden via `sr-only` CSS to avoid a flash of unstyled content.
- **Content negotiation** — `Accept: text/markdown` returns the raw markdown with no HTML wrapper at all.

## Decision: Fastify over NestJS

**The blog engine uses Fastify, not NestJS.**

### Why not NestJS?

NestJS is the right framework for the main Tokenrip backend — it provides dependency injection, module boundaries, guards, interceptors, and lifecycle management for a complex API. The blog engine is a document server with five routes. NestJS's module/provider/controller ceremony adds boilerplate without benefit at this scale.

### Why Fastify?

- Lightweight. A Fastify server with five routes is ~100 lines of setup.
- Plugin system covers what we need: schedule (for periodic reindex), static file serving, CORS.
- Fast. Not that blog traffic demands it, but Fastify's overhead is near zero.
- If the blog engine grows complex enough to justify NestJS, migration is straightforward — the route handlers and services are the same code with different wiring.

## Decision: No CMS Features

**No authors, editors, roles, draft states, approval workflows, or frontend editing.**

### Why strip all of this?

The publishing pipeline is an agent. The agent writes markdown, calls `POST /articles/publish`, and the article is live. There is no human editor reviewing drafts in a web UI. There is no multi-author attribution. There is no permission model beyond "has the API key."

Every CMS feature we don't build is a feature we don't maintain, don't secure, and don't debug. If editorial workflows become necessary, they belong in the agentic pipeline (agent reviews agent's work), not in a traditional CMS layer.

## Future

- **LLM-driven enrichment** — The publishing pipeline already has hooks for description generation and FAQ extraction. Future additions: automatic humanizer pass, related article linking, key takeaway extraction.
- **S3 storage** — The `StorageService` interface abstracts local filesystem. S3 implementation slots in without changing the rest of the system.
- **Search** — SQLite FTS5 for full-text search across articles. Minimal addition to the existing SQLite index.
