# CLAUDE.md — tokenrip-frontend

## Commands

```bash
bun run dev      # Dev server on port 3333
bun run build    # Production build
bun run start    # Run production build
```

## Key Pages

- `/` — Landing page (`src/app/index.tsx`)
- `/s/$uuid` — Shareable artifact viewer (`src/app/s/$uuid.tsx`, public, no auth)

## Artifact Viewers

`src/components/ArtifactViewer.tsx` dispatches to the correct viewer based on artifact type and MIME type:

- `MarkdownViewer` — renders markdown via `react-markdown`
- `HtmlViewer` — sandboxed iframe with `srcdoc`
- `ImageViewer` — responsive `<img>`
- `PdfViewer` — iframe embed
- `DownloadFallback` — download button for unknown types

## Environment Variables

See `.env.sample`. Set `VITE_API_URL` to point at the backend.
