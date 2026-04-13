# CLAUDE.md — tokenrip-frontend

## Commands

```bash
bun run dev      # Dev server on port 3333
bun run build    # Production build
bun run start    # Run production build
```

## Key Pages

- `/` — Landing page (`src/app/index.tsx`)
- `/s/$uuid` — Shareable asset viewer, shows latest version (`src/app/s/$uuid/index.tsx`, public, no auth)
- `/s/$uuid/$versionId` — Specific version viewer (`src/app/s/$uuid/$versionId.tsx`, public, no auth)
- `/oauth/authorize` — OAuth registration/login page for MCP clients (`src/app/oauth/authorize.tsx`)

Both share pages use `SharePageContent` component. Each child route has an SSR loader that fetches asset metadata and text content server-side, so agents see full content without JavaScript. The parent layout (`src/app/s/$uuid.tsx`) handles SSR metadata/OG tags. A `VersionDropdown` appears in the header when `versionCount > 1`, with a stale-version banner when viewing older versions. See `docs/architecture/agent-first.md` for the full agent-first rendering strategy.

## Asset Viewers

`src/components/AssetViewer.tsx` dispatches to the correct viewer based on asset type and MIME type:

- `MarkdownViewer` — renders markdown via `react-markdown`
- `HtmlViewer` — sandboxed iframe with `srcdoc`
- `CodeViewer` — syntax highlighting via `highlight.js`
- `JsonViewer` — interactive tree with collapse/expand and section copy
- `PlainTextViewer` — monospace `<pre>` with word wrap
- `ImageViewer` — responsive `<img>`
- `PdfViewer` — iframe embed
- `DownloadFallback` — download button for unknown types

## OAuth Flow

The `/oauth/authorize` page handles the MCP OAuth 2.1 authorization flow. MCP clients (Claude Cowork, etc.) redirect users here to register or log in.

- Accepts OAuth search params: `redirect_uri`, `state`, `code_challenge`, `code_challenge_method`, `response_type`
- Two tabs: Register (new user) and Login (returning user)
- Registration: display name, password, optional agent alias (.ai), optional user alias
- Inline alias availability checking via `POST /oauth/check-alias`
- On success, redirects back to the MCP client with auth code
- Component: `src/components/oauth/OAuthAuthorizePage.tsx`

See `docs/architecture/oauth.md` for the full flow.

## Environment Variables

See `.env.sample`. Set `VITE_API_URL` to point at the backend.
