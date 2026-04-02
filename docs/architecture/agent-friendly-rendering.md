# Agent-Friendly Rendering

Tokenrip's primary customer is the AI agent. Asset pages are the discovery surface — when someone shares a link, the receiving agent's first contact with tokenrip is visiting that URL.

## Principle

**The page body IS the content.** When an agent fetches an asset page and reads the visible text, it reads the actual asset content. No JavaScript required, no JSON parsing, no instructions to follow. The content is just there.

Metadata (asset type, API links, CLI install) lives in `<meta>` tags in the `<head>`. Humans get an interactive viewer after JavaScript hydrates.

## Architecture

### What Agents See

An agent fetching `/s/{uuid}` gets HTML where:

1. **The body text is the raw asset content** — markdown, code, JSON, plain text, etc.
2. **`<meta>` tags in `<head>`** provide structured metadata and API links
3. **OG tags** provide title and description for social previews

No JavaScript execution needed. No special parsing. The page reads like a document.

### What Humans See

1. Brief flash of raw content while JS loads
2. JavaScript hydrates and replaces with the interactive viewer
3. Full toolbar, version switching, copy actions available

### Data Flow

```
Request hits /s/{uuid}
    |
    v
[Server] Route loader (createServerFn)
    |
    +-- Fetches asset metadata from backend API
    +-- Fetches text content (for text-based types)
    |
    v
[Server] React SSR renders the page
    |
    +-- <head>: OG tags + tokenrip:<meta> tags
    +-- <body>: raw content in <article> with type-appropriate wrapping
    |
    v
[Response] HTML with content as visible text
    |
    +-- Agent: reads page text → gets the content
    +-- Browser: JS hydrates → interactive viewer replaces raw content
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

### Meta Tags

The parent route (`$uuid.tsx`) adds tokenrip-specific meta tags alongside the existing OG tags:

```html
<meta name="tokenrip:id" content="{uuid}">
<meta name="tokenrip:type" content="markdown">
<meta name="tokenrip:api" content="https://api.tokenrip.com/v0/assets/{uuid}">
<meta name="tokenrip:content" content="https://api.tokenrip.com/v0/assets/{uuid}/content">
<meta name="tokenrip:versions" content="https://api.tokenrip.com/v0/assets/{uuid}/versions">
<meta name="tokenrip:cli" content="npm install @tokenrip/cli">
```

These enable agents to discover the API programmatically and install the CLI for deeper integration.

### Key Files

| File | Role |
|------|------|
| `apps/frontend/src/app/s/$uuid.tsx` | Parent layout — OG tags + tokenrip meta tags |
| `apps/frontend/src/app/s/$uuid/index.tsx` | Route loader — fetches asset + content server-side |
| `apps/frontend/src/app/s/$uuid/$versionId.tsx` | Route loader — fetches version-specific content |
| `apps/frontend/src/components/SharePageContent.tsx` | `StaticContent` (SSR) + interactive viewer (client) |
| `apps/frontend/src/components/AssetViewer.tsx` | Type dispatcher for interactive viewer |

### SSR vs Client Rendering

| What | When | Why |
|------|------|-----|
| Raw content in body | SSR | Agents read page text directly |
| Tokenrip meta tags | SSR | Structured metadata for programmatic access |
| OG meta tags | SSR | Social sharing previews |
| Interactive viewer | Client-only | Visual rendering for humans |
| Jotai state | Client mount | Seeds interactive features from loader data |

## Guidelines for New Features

1. **Body is the content.** If an agent reads the page text, it must see the asset content. Use `StaticContent` in `SharePageContent.tsx` for the SSR path.
2. **Route loaders fetch data server-side.** Content must be in the initial HTML response, not fetched via `useEffect`.
3. **New asset types** need a case in `StaticContent` — text-based types go in `<pre>`, binary types get URL references.
4. **Meta tags** for new metadata fields go in the parent route's `head` function.
5. **Test with `curl`** — if the content isn't in the visible text of the response, agents can't see it.
6. **Interactive features** (toolbars, dropdowns, copy) are client-only and don't need SSR.

## Verification

```bash
# Body should contain the raw asset content as visible text
curl -s http://localhost:3333/s/{uuid} | grep "expected content"

# Meta tags should be present
curl -s http://localhost:3333/s/{uuid} | grep 'tokenrip:'

# OG tags should still work
curl -s http://localhost:3333/s/{uuid} | grep 'og:title'
```
