# Frontend Architecture

Tokenrip frontend — artifact viewer and sharing pages. Built with TanStack Start (SSR), Jotai (state), Axios (HTTP), and Tailwind CSS v4.

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
│       └── $uuid.tsx          # /s/:uuid — artifact viewer
├── components/                # React components
│   ├── ArtifactViewer.tsx     # Type dispatcher → correct viewer
│   └── viewers/               # Viewer implementations
├── lib/
│   └── api.ts                 # Types (ArtifactMetadata) & URL helpers
├── utils/
│   └── api.ts                 # Axios instance
├── router.tsx                 # Router factory + SSR integration
└── routeTree.gen.ts           # Auto-generated (DO NOT EDIT)
```

## Routes

| URL | File | Description |
|-----|------|-------------|
| `/` | `app/index.tsx` | Landing page, static, no API calls |
| `/s/:uuid` | `app/s/$uuid.tsx` | Public artifact viewer, fetches from API |

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
export const artifactAtom = atom<ArtifactMetadata | null>(null)

// Loading flag
export const isLoadingArtifactAtom = atom<boolean>(false)

// Error message
export const artifactErrorAtom = atom<string | null>(null)
```

### Action Hook Pattern

```typescript
export const useArtifactActions = () => {
  const setArtifact = useSetAtom(artifactAtom)
  const setIsLoading = useSetAtom(isLoadingArtifactAtom)
  const setError = useSetAtom(artifactErrorAtom)

  const fetchArtifact = async (uuid: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.get(`/v0/artifacts/${uuid}`)
      setArtifact(response.data.data)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch artifact'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return { fetchArtifact }
}
```

**Rules:**
- All API calls go in actions, never in components
- Use `useSetAtom` in actions (write-only), `useAtomValue` in components (read-only)
- Error toasts fired from actions via `react-toastify`
- No Jotai Provider needed — atoms are globally initialized on first use

### Component Consumption

```typescript
const artifact = useAtomValue(artifactAtom)
const isLoading = useAtomValue(isLoadingArtifactAtom)
const { fetchArtifact } = useArtifactActions()

useEffect(() => { fetchArtifact(uuid) }, [uuid])
```

## API Layer

### Axios Instance (`src/utils/api.ts`)

Centralized axios instance with `baseURL` from `VITE_API_URL` (default `http://localhost:3434`). No auth interceptors — share pages are public.

### Types & Helpers (`src/lib/api.ts`)

- `ArtifactMetadata` interface — artifact shape from the backend
- `getArtifactContentUrl(uuid)` — builds the content download URL

### Endpoints Used

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/v0/artifacts/:uuid` | Fetch artifact metadata |
| GET | `/v0/artifacts/:uuid/content` | Fetch raw content (text, binary) |

## Artifact Viewers

`ArtifactViewer.tsx` dispatches to the correct viewer based on `type` and `mimeType`:

| Artifact Type | MIME Match | Viewer | Rendering |
|---------------|------------|--------|-----------|
| `markdown` | — | `MarkdownViewer` | `react-markdown` with prose styling |
| `html` | — | `HtmlViewer` | Sandboxed iframe (`srcdoc`) |
| `chart` | — | Placeholder | Coming soon + download link |
| — | `image/*` | `ImageViewer` | Responsive `<img>` |
| — | `application/pdf` | `PdfViewer` | iframe embed |
| (fallback) | — | `DownloadFallback` | Download button |

For markdown/html/chart, `ArtifactViewer` fetches text content from the `/content` endpoint before rendering.

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
