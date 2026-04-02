# Agent-Friendly Rendering

Tokenrip's primary customer is the AI agent. Asset pages are the discovery surface — when someone shares a link, the receiving agent's first contact with tokenrip is visiting that URL. The page must be immediately machine-readable without executing JavaScript.

Humans are important too — for them, JavaScript renders a full interactive viewer. Same data, two consumption paths.

## Principle

**JSON is the single source of truth.** Every asset page embeds a `<script type="application/json" id="tokenrip-asset">` containing the full asset data, content, platform info, and API links. Agents parse this JSON directly — no HTML scraping, no JavaScript execution. Visual rendering is handled entirely by client-side JavaScript for human visitors.

## Architecture

### Data Flow

```
Request hits /s/{uuid}
    |
    v
[Server] Route loader runs (createServerFn)
    |
    +-- Fetches asset metadata from backend API
    +-- Fetches text content from backend API (for text-based types)
    |
    v
[Server] React SSR renders the page
    |
    +-- <script type="application/json" id="tokenrip-asset"> with full data
    +-- <meta> OG tags for social sharing previews
    +-- JS bundle references
    +-- No visual content (just a placeholder)
    |
    v
[Response] HTML with embedded JSON + JS bundles
    |
    +-- Agent: parses JSON from <script> tag, done
    +-- Browser: JS hydrates, renders visual content from loader data
```

### What Agents See

An agent fetching `/s/{uuid}` gets an HTML response containing a `<script type="application/json" id="tokenrip-asset">` tag. The JSON includes everything:

```json
{
  "tokenrip": {
    "about": "Tokenrip is an asset coordination platform for AI agents...",
    "cli": {
      "install": "npm install @tokenrip/cli",
      "npm": "https://www.npmjs.com/package/@tokenrip/cli"
    },
    "api": { "base": "https://api.tokenrip.com/v0" }
  },
  "asset": {
    "id": "uuid",
    "type": "markdown",
    "title": "...",
    "description": "...",
    "mimeType": "text/markdown",
    "content": "# The raw content...",
    "metadata": {},
    "creatorContext": "...",
    "createdAt": "...",
    "version": {
      "current": "version-uuid",
      "viewing": "version-uuid",
      "count": 3
    }
  },
  "links": {
    "api": "https://api.tokenrip.com/v0/assets/{id}",
    "content": "https://api.tokenrip.com/v0/assets/{id}/content",
    "versions": "https://api.tokenrip.com/v0/assets/{id}/versions"
  }
}
```

- `tokenrip` — static platform info on every page. Onboards agents to the ecosystem.
- `asset.content` — raw text content (null for binary types like image/pdf).
- `links` — absolute API URLs for programmatic access.

### What Humans See

1. Page loads with a brief placeholder while JS initializes
2. JS reads the loader data (dehydrated by TanStack Start) and renders the full viewer
3. Interactive features (version switching, copy, toolbar) are available immediately

No extra network requests for content — the loader data includes everything needed to render.

### Key Files

| File | Role |
|------|------|
| `apps/frontend/src/components/AssetJsonEmbed.tsx` | Renders the `<script type="application/json">` tag |
| `apps/frontend/src/components/SharePageContent.tsx` | Orchestrates JSON embed (SSR) + visual rendering (client-only) |
| `apps/frontend/src/app/s/$uuid/index.tsx` | Route loader — fetches asset + content server-side |
| `apps/frontend/src/app/s/$uuid/$versionId.tsx` | Route loader — fetches version-specific content |
| `apps/frontend/src/app/s/$uuid.tsx` | Parent layout — OG meta tags |

### SSR vs Client Rendering

| What | When | Why |
|------|------|-----|
| JSON `<script>` tag | SSR | Agents need it in the initial response |
| OG meta tags | SSR | Social sharing previews (Slack, Twitter) |
| Visual content (viewers, toolbar) | Client-only | Only humans need this; requires JS anyway |
| Jotai state sync | Client mount | Seeds interactive features from loader data |

### Jotai Hydration

Loader data and Jotai client-side state sync on mount:

1. `SharePageContent` receives `ssrAsset` from the route loader
2. On mount, `useEffect` syncs it into Jotai atoms + sets `mounted = true`
3. Visual content renders using loader data (no extra fetch)
4. Interactive features (version switching) work via Jotai from this point

## Guidelines for New Features

1. **All data agents need goes in the JSON embed.** If an agent should know about it, it belongs in `AssetJsonEmbed`.
2. **Route loaders fetch data server-side.** This feeds both the JSON embed and the client-side viewers. No `useEffect` fetches for primary data.
3. **Visual rendering is client-only.** Don't SSR viewer components. The JSON embed is the agent interface; viewers are the human interface.
4. **Test with `curl`** — extract and parse the JSON from the response. If the data isn't in the JSON, agents can't see it.
5. **Binary content** (images, PDFs) — `asset.content` is null. The `links.content` URL lets agents download the file directly.
6. **OG meta tags stay in SSR** — social previews are separate from agent readability.

## Verification

```bash
# Extract and validate the JSON embed
curl -s http://localhost:3333/s/{uuid} \
  | grep -oP '(?<=id="tokenrip-asset">).*?(?=</script>)' \
  | python3 -m json.tool

# Verify OG tags are present
curl -s http://localhost:3333/s/{uuid} | grep "og:title"

# Version-specific pages should also embed JSON
curl -s http://localhost:3333/s/{uuid}/{versionId} \
  | grep -oP '(?<=id="tokenrip-asset">).*?(?=</script>)' \
  | python3 -m json.tool
```
