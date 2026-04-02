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

Both share pages use `SharePageContent` component. Each child route has an SSR loader that fetches asset metadata and text content server-side, so agents see full content without JavaScript. The parent layout (`src/app/s/$uuid.tsx`) handles SSR metadata/OG tags. A `VersionDropdown` appears in the header when `versionCount > 1`, with a stale-version banner when viewing older versions. See `docs/architecture/agent-friendly-rendering.md` for the full agent-first rendering strategy.

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

## Environment Variables

See `.env.sample`. Set `VITE_API_URL` to point at the backend.
