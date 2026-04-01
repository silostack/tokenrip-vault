# Frontend Architecture

Tokenrip frontend — asset viewer and sharing pages. Built with TanStack Start (SSR), Jotai (state), Axios (HTTP), and Tailwind CSS v4.

## Directory Structure

```
apps/frontend/src/
├── _jotai/                    # State management (Jotai atoms & actions)
│   └── <domain>/
│       ├── <domain>.atoms.ts  # Atom definitions
│       └── <domain>.actions.ts # Action hooks (API calls, mutations)
├── app/                       # File-based routes (TanStack Router)
│   ├── __root.tsx             # Root layout (header, footer, providers)
│   ├── globals.css            # Tailwind theme & CSS variables
│   ├── index.tsx              # / — landing page
│   └── s/
│       └── $uuid.tsx          # /s/:uuid — asset viewer
├── components/                # React components
│   ├── AssetViewer.tsx     # Type dispatcher → correct viewer
│   └── viewers/               # Viewer implementations
│       ├── MarkdownViewer.tsx  # react-markdown with prose styling
│       ├── HtmlViewer.tsx      # Sandboxed iframe (srcdoc)
│       ├── CodeViewer.tsx      # highlight.js with auto-detect + dark theme
│       ├── PlainTextViewer.tsx # Monospace <pre> with word wrap
│       ├── ImageViewer.tsx     # Responsive <img>
│       ├── PdfViewer.tsx       # iframe embed
│       └── DownloadFallback.tsx # Download button for unsupported types
├── lib/
│   └── api.ts                 # Types (AssetMetadata) & URL helpers
├── utils/
│   └── api.ts                 # Axios instance
├── router.tsx                 # Router factory + SSR integration
└── routeTree.gen.ts           # Auto-generated (DO NOT EDIT)
```

## Routes

| URL | File | Description |
|-----|------|-------------|
| `/` | `app/index.tsx` | Landing page, static, no API calls |
| `/s/:uuid` | `app/s/$uuid.tsx` | Public asset viewer, fetches from API. Server-side loader for OG meta tags (link previews). |

Routes are file-based via TanStack Router. The Vite plugin scans `src/app/` and generates `routeTree.gen.ts` automatically.

**Conventions:**
- `__root.tsx` — layout wrapper (not a route itself)
- `$param.tsx` — dynamic route segment
- `index.tsx` — index route for a directory

## State Management (Jotai)

Follows the pattern from the Midas project. All state lives in `src/_jotai/`, organized by domain.

### File Pattern

| File | Contents |
|------|----------|
| `<domain>.atoms.ts` | Base atoms — simple values, loading flags, error strings |
| `<domain>.actions.ts` | `use<Domain>Actions()` hook — API calls that populate atoms |

### Atom Conventions

```typescript
// Data atom
export const assetAtom = atom<AssetMetadata | null>(null)

// Loading flag
export const isLoadingAssetAtom = atom<boolean>(false)

// Error message
export const assetErrorAtom = atom<string | null>(null)
```

### Action Hook Pattern

```typescript
export const useAssetActions = () => {
  const setAsset = useSetAtom(assetAtom)
  const setIsLoading = useSetAtom(isLoadingAssetAtom)
  const setError = useSetAtom(assetErrorAtom)

  const fetchAsset = async (uuid: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.get(`/v0/assets/${uuid}`)
      setAsset(response.data.data)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch asset'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return { fetchAsset }
}
```

**Rules:**
- All API calls go in actions, never in components
- Use `useSetAtom` in actions (write-only), `useAtomValue` in components (read-only)
- Error toasts fired from actions via `react-toastify`
- No Jotai Provider needed — atoms are globally initialized on first use

### Component Consumption

```typescript
const asset = useAtomValue(assetAtom)
const isLoading = useAtomValue(isLoadingAssetAtom)
const { fetchAsset } = useAssetActions()

useEffect(() => { fetchAsset(uuid) }, [uuid])
```

## API Layer

### Axios Instance (`src/utils/api.ts`)

Centralized axios instance with `baseURL` from `VITE_API_URL` (default `http://localhost:3434`). No auth interceptors — share pages are public.

### Types & Helpers (`src/lib/api.ts`)

- `AssetMetadata` interface — asset shape from the backend. Includes provenance fields: `parentAssetId`, `creatorContext`, `inputReferences`.
- `getAssetContentUrl(uuid)` — builds the content download URL

### Endpoints Used

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/v0/assets/:uuid` | Fetch asset metadata |
| GET | `/v0/assets/:uuid/content` | Fetch raw content (text, binary) |

## Asset Viewers

`AssetViewer.tsx` dispatches to the correct viewer based on `type` and `mimeType`:

| Asset Type | MIME Match | Viewer | Rendering |
|---------------|------------|--------|-----------|
| `markdown` | — | `MarkdownViewer` | `react-markdown` with prose styling |
| `html` | — | `HtmlViewer` | Sandboxed iframe (`srcdoc`) |
| `code` | — | `CodeViewer` | `highlight.js` auto-detect with `github-dark` theme |
| `text` | — | `PlainTextViewer` | Monospace `<pre>` with word wrap |
| `chart` | — | Placeholder | Coming soon + download link |
| — | `image/*` | `ImageViewer` | Responsive `<img>` |
| — | `application/pdf` | `PdfViewer` | iframe embed |
| (fallback) | — | `DownloadFallback` | Download button |

For markdown/html/chart/code/text, `AssetViewer` fetches text content from the `/content` endpoint before rendering. The `CodeViewer` accepts an optional `language` hint from `asset.metadata.language` for targeted highlighting.

## Styling

**Tailwind CSS v4** with inline theme configuration in `globals.css`.

**Design tokens (CSS variables):**

| Token | Light | Dark |
|-------|-------|------|
| `--background` | `#fafafa` | `#0a0a0a` |
| `--foreground` | `#171717` | `#ededed` |

**Fonts:** Geist (sans) and Geist Mono (mono) via Google Fonts.

**Dark mode:** Always on — `<html className="dark">` in root layout. Uses opacity-based colors like `text-white/60`, `border-white/10`.

**No separate tailwind config file** — everything is in `globals.css` via `@theme inline`.

## Build & Runtime

| Command | What it does |
|---------|-------------|
| `bun run dev` | Vite dev server on port 3333 |
| `bun run build` | Production build → `dist/client/` + `dist/server/` |
| `bun run start` | Serve production build via srvx |

**Vite plugins:** `tailwindcss()`, `tanstackStart()` (SSR + route gen), `viteReact()` (JSX transform).

**SSR:** TanStack Start renders on the server, `<Scripts />` hydrates on the client. React Query cache is dehydrated/rehydrated via `setupRouterSsrQueryIntegration`.

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_API_URL` | `http://localhost:3434` | Backend API base URL |

Must be prefixed with `VITE_` to be exposed to client code (Vite convention).

## Conventions Summary

| Area | Convention |
|------|-----------|
| Routing | File-based in `src/app/`, auto-generates route tree |
| State | `_jotai/<domain>/` with `.atoms.ts` + `.actions.ts` |
| API calls | Always in action hooks, never in components |
| Styling | Tailwind utility classes, no CSS modules |
| Types | Co-located in `lib/api.ts`, shared via `@/lib/api` |
| Imports | Path alias `@/*` → `src/*` |
| Components | PascalCase filenames, function exports |
