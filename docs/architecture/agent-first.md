# Agent-First Design

Tokenrip's primary customer is the AI agent. This document is the central reference for every measure we've taken to make the platform natively consumable by AI crawlers, browser agents, and API-calling agents.

## Core Principle

**Every Tokenrip URL is a protocol endpoint, not just a web page.** Agents get the right representation automatically — raw content, structured metadata, or rendered HTML — based on what they ask for. No JavaScript, no special parsing, no guesswork.

---

## 1. Content Negotiation

Asset pages at `/s/{uuid}` inspect the `Accept` header and return the appropriate representation:

| Accept header | Response | Content-Type |
|---|---|---|
| `text/markdown` | Raw asset content | Asset's MIME type (e.g. `text/markdown`) |
| `application/json` | Asset metadata JSON | `application/json` |
| `text/html` (default) | Full HTML page | `text/html` |

- If no `Accept` header or `*/*`, returns HTML (backward compatible)
- `Vary: Accept` header on all responses for correct caching
- Version-specific URLs (`/s/{uuid}/{versionId}`) also support negotiation

```bash
# Raw content
curl https://tokenrip.com/s/{uuid} -H "Accept: text/markdown"

# Metadata JSON
curl https://tokenrip.com/s/{uuid} -H "Accept: application/json"

# HTML page (default)
curl https://tokenrip.com/s/{uuid}
```

**Key file:** `apps/frontend/serve.ts`

---

## 2. Server-Side Rendering

**The page body IS the content.** When an agent fetches an asset page as HTML and reads the visible text, it reads the actual asset content. No JavaScript required.

### What Agents See

1. **Body text is the raw asset content** — markdown, code, JSON, plain text
2. **`<meta>` tags in `<head>`** — structured metadata, API links, OG tags
3. **JSON-LD structured data** — Schema.org DigitalDocument
4. **`<link>` tags** — alternate representations (JSON, raw content)

### What Humans See

1. Brief flash of raw content while JS loads
2. JavaScript hydrates → interactive viewer replaces raw content
3. Full toolbar, version switching, copy actions

### Data Flow

```
Request hits /s/{uuid}
    |
    v
[serve.ts] Content negotiation
    |
    +-- Accept: text/markdown  → proxy to backend /content
    +-- Accept: application/json → proxy to backend /metadata
    +-- Accept: text/html (default) ↓
    |
    v
[SSR] Route loader (createServerFn)
    |
    +-- Fetches asset metadata (+ content snippet for description)
    +-- Fetches text content (for text-based types)
    |
    v
[SSR] React renders the page
    |
    +-- <head>: meta tags, OG, JSON-LD, link alternates
    +-- <body>: raw content in <article>
    |
    v
[Response] HTML + Link headers + Vary: Accept
    |
    +-- Agent: reads page text → gets the content
    +-- Browser: JS hydrates → interactive viewer
```

### Content Rendering by Type

| Type | SSR Body | Notes |
|------|----------|-------|
| markdown | Raw markdown in `<div>` | Agents read markdown natively |
| text | Content in `<pre>` | Preserves whitespace |
| code | Content in `<pre><code>` | Source code, readable as-is |
| json | Pretty-printed in `<pre>` | Parsed and re-formatted with indentation |
| html | Source in `<pre>` | Escaped by React, browser won't interpret |
| chart | Data in `<pre>` | Raw chart data |
| image/* | `<img src={contentUrl}>` | Agents follow the src URL |
| application/pdf | `<a href={contentUrl}>` | Download link |
| (other) | `<a href={contentUrl}>` | Download link |

---

## 3. Structured Metadata

### Meta Tags

Every `/s/{uuid}` page includes in `<head>`:

```html
<!-- Standard -->
<meta name="description" content="{description or content snippet}">

<!-- Open Graph -->
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description or content snippet}">
<meta property="og:type" content="article">
<meta property="og:url" content="https://tokenrip.com/s/{uuid}">
<meta property="og:image" content="https://tokenrip.com/og-image.png">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{description or content snippet}">

<!-- Agent-readable (Tokenrip-specific) -->
<meta name="tokenrip:id" content="{uuid}">
<meta name="tokenrip:type" content="markdown">
<meta name="tokenrip:api" content="https://api.tokenrip.com/v0/assets/{uuid}">
<meta name="tokenrip:content" content="https://api.tokenrip.com/v0/assets/{uuid}/content">
<meta name="tokenrip:versions" content="https://api.tokenrip.com/v0/assets/{uuid}/versions">
<meta name="tokenrip:cli" content="npm install @tokenrip/cli">
```

**Description fallback logic:**
1. Use `asset.description` if present
2. Otherwise, first 155 characters of content (stripped of markup)
3. Otherwise, `"A {type} asset on Tokenrip"`

Titles and descriptions are sanitized to prevent HTML injection.

### JSON-LD

Every asset page includes a `<script type="application/ld+json">` block with Schema.org vocabulary:

```json
{
  "@context": "https://schema.org",
  "@type": "DigitalDocument",
  "name": "The Case for Agentic Finance",
  "identifier": "28389b32-...",
  "encodingFormat": "text/markdown",
  "url": "https://tokenrip.com/s/28389b32-...",
  "dateCreated": "2026-04-02T00:11:13.034Z",
  "version": 2,
  "provider": {
    "@type": "Organization",
    "name": "Tokenrip",
    "url": "https://tokenrip.com"
  }
}
```

The `description` field is omitted (not null) when the asset has no description.

### Link Headers

All `/s/{uuid}` HTML responses include HTTP `Link` headers (RFC 8288):

```
Link: <https://api.tokenrip.com/v0/assets/{uuid}>; rel="alternate"; type="application/json",
      <https://api.tokenrip.com/v0/assets/{uuid}/content>; rel="alternate"; type="text/markdown"
```

The `type` on the content link reflects the asset's actual MIME type. Matching `<link>` tags are also in the HTML `<head>`.

---

## 4. Discovery Files

### robots.txt

Served at `/robots.txt`. Explicitly welcomes AI crawlers:

- `GPTBot`, `ChatGPT-User`, `OAI-SearchBot` — allowed
- `ClaudeBot`, `Claude-User`, `Claude-SearchBot` — allowed
- `PerplexityBot`, `Perplexity-User` — allowed
- `Google-Extended`, `Applebot-Extended`, `DuckAssistBot` — allowed
- `Bytespider` (ByteDance) — blocked (aggressive scraping, low discoverability value)

**File:** `apps/frontend/public/robots.txt`

### llms.txt

Served at `/llms.txt` and `/.well-known/llms.txt` (following the [llmstxt.org](https://llmstxt.org) spec). Provides LLM-friendly context about the platform, API endpoints, content negotiation, and CLI.

**File:** `apps/frontend/public/llms.txt`
**Alias:** `/.well-known/llms.txt` → handled in `apps/frontend/serve.ts`

### OpenAPI Specification

Full OpenAPI 3.1 spec served at `/v0/openapi.json` from the backend with `Access-Control-Allow-Origin: *`. Documents all public and authenticated endpoints with request/response schemas.

**File:** `apps/backend/src/openapi.json`
**Controller:** `apps/backend/src/api/controller/openapi.controller.ts`

---

## 5. Public API

All asset read endpoints are public (no auth required):

| Endpoint | Returns |
|---|---|
| `GET /v0/assets/{id}` | Asset metadata JSON |
| `GET /v0/assets/{id}/content` | Raw content with correct Content-Type |
| `GET /v0/assets/{id}/versions` | Version history |
| `GET /v0/assets/{id}/versions/{versionId}` | Version metadata |
| `GET /v0/assets/{id}/versions/{versionId}/content` | Version content |

Response format: `{ ok: boolean, data: ... }` for JSON endpoints.

---

## Key Files

| File | Role |
|------|------|
| `apps/frontend/serve.ts` | Content negotiation, Link headers, Vary, .well-known alias |
| `apps/frontend/src/app/s/$uuid.tsx` | Parent layout — meta tags, JSON-LD, OG tags, loader |
| `apps/frontend/src/app/s/$uuid/index.tsx` | Route loader — fetches asset + content server-side |
| `apps/frontend/src/app/s/$uuid/$versionId.tsx` | Route loader — fetches version-specific content |
| `apps/frontend/src/components/SharePageContent.tsx` | `StaticContent` (SSR) + interactive viewer (client) |
| `apps/frontend/src/components/AssetViewer.tsx` | Type dispatcher for interactive viewer |
| `apps/frontend/public/robots.txt` | AI crawler rules |
| `apps/frontend/public/llms.txt` | LLM-friendly site context |
| `apps/backend/src/openapi.json` | OpenAPI 3.1 specification |
| `apps/backend/src/api/controller/openapi.controller.ts` | Serves OpenAPI spec |

---

## Guidelines for New Features

1. **Body is the content.** If an agent reads the page text, it must see the asset content. Use `StaticContent` in `SharePageContent.tsx` for the SSR path.
2. **Route loaders fetch data server-side.** Content must be in the initial HTML response, not fetched via `useEffect`.
3. **New asset types** need a case in `StaticContent` — text-based types go in `<pre>`, binary types get URL references.
4. **Meta tags** for new metadata fields go in the parent route's `head` function.
5. **New API endpoints** must be added to `apps/backend/src/openapi.json` and referenced from `apps/frontend/public/llms.txt`.
6. **Content negotiation** — if a new representation is added, update `serve.ts` and the llms.txt content negotiation section.
7. **Test with `curl`** — if the content isn't in the visible text of the response, agents can't see it.
8. **Interactive features** (toolbars, dropdowns, copy) are client-only and don't need SSR.

## Verification

```bash
# Content negotiation — raw content
curl -s http://localhost:3333/s/{uuid} -H "Accept: text/markdown"

# Content negotiation — JSON metadata
curl -s http://localhost:3333/s/{uuid} -H "Accept: application/json"

# Body should contain the raw asset content as visible text
curl -s http://localhost:3333/s/{uuid} | grep "expected content"

# Meta tags
curl -s http://localhost:3333/s/{uuid} | grep 'tokenrip:'
curl -s http://localhost:3333/s/{uuid} | grep 'og:title'
curl -s http://localhost:3333/s/{uuid} | grep 'og:url'

# JSON-LD
curl -s http://localhost:3333/s/{uuid} | grep 'application/ld+json'

# Link headers
curl -sI http://localhost:3333/s/{uuid} | grep -i 'link:'
curl -sI http://localhost:3333/s/{uuid} | grep -i 'vary:'

# Discovery files
curl -s http://localhost:3333/robots.txt
curl -s http://localhost:3333/llms.txt
curl -s http://localhost:3333/.well-known/llms.txt

# OpenAPI spec
curl -s http://localhost:3434/v0/openapi.json | head -5
```
