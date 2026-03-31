# CLI Internals — @tokenrip/cli

> Living document. Update this when the CLI architecture changes.

## Overview

`@tokenrip/cli` is a dual-mode package: a CLI binary (`tokenrip`) and a Node.js library (`@tokenrip/cli`). It is the primary interface for AI agents to create and share artifacts on the Tokenrip platform.

### Design Principles

- **Agent-first** — all output is machine-readable JSON, no interactive prompts, no color codes
- **Dual distribution** — ESM for the CLI binary, CJS for library consumers who need `require()`
- **Thin client** — minimal logic; validation and storage live in the backend
- **Typed errors** — every failure has a code that agents can match on programmatically
- **Zero config for agents** — env vars (`TOKENRIP_API_KEY`, `TOKENRIP_API_URL`) let agents skip config files entirely

---

## Architecture

```
                          ┌──────────────────────────┐
                          │     CLI entry point       │
                          │  src/cli.ts (ESM-only)    │
                          │  commander program        │
                          └──────────┬───────────────┘
                                     │
                     ┌──────────┬──────┼──────┬───────────┐
                     ▼          ▼      ▼      ▼           ▼
              ┌────────────┐ ┌──────┐ ┌──────┐ ┌────────┐ ┌────────┐
              │ config.ts  │ │upload│ │publi-│ │status  │ │(future)│
              │ set-key    │ │ .ts  │ │sh.ts │ │ .ts    │ │        │
              │ set-url    │ └──┬───┘ └──┬───┘ └──┬─────┘ └────────┘
              └──────┬─────┘    │        │        │
              └──────┬─────┘       │               │
                     │             ▼               ▼
                     │       ┌─────────────────────────┐
                     │       │     client.ts            │
                     │       │  createHttpClient()      │
                     │       │  axios + interceptors    │
                     │       └──────────┬──────────────┘
                     │                  │
                     ▼                  ▼
              ┌────────────┐    ┌────────────┐
              │ config.ts  │    │ errors.ts  │
              │ load/save  │    │ CliError   │
              └────────────┘    └────────────┘
                                       │
                                       ▼
                                ┌────────────┐
                                │ output.ts  │
                                │ JSON out   │
                                └────────────┘
```

### Data Flow

1. CLI parses args via Commander → dispatches to command handler
2. Command handler loads config, resolves API key/URL
3. Command validates inputs (file exists, type valid, key present)
4. HTTP client sends request to backend `POST /v0/artifacts`
5. Response interceptor maps HTTP errors to `CliError` codes
6. `outputSuccess` / `outputError` prints JSON to stdout
7. On error, process exits with code 1

---

## Source Map

| File | Role |
|------|------|
| `src/cli.ts` | Commander program definition, command registration, `#!/usr/bin/env node` shebang. ESM-only (excluded from CJS build). |
| `src/index.ts` | Library barrel. Re-exports everything consumers need. This is the public API surface. |
| `src/config.ts` | Config file I/O. Reads/writes `~/.config/tokenrip/config.json`. Provides env var fallbacks. |
| `src/client.ts` | HTTP client factory. Creates axios instance with Bearer auth and response error interceptors. |
| `src/errors.ts` | `CliError` class (code + message) and `toCliError()` normalizer. |
| `src/output.ts` | JSON output helpers (`outputSuccess`, `outputError`) and `wrapCommand` async error boundary. |
| `src/commands/config.ts` | `configSetKey` and `configSetUrl` — persist config changes. |
| `src/commands/upload.ts` | `upload` — multipart file upload to `/v0/artifacts`. Auto-detects MIME type. |
| `src/commands/publish.ts` | `publish` — JSON body post to `/v0/artifacts` for structured content (markdown, html, chart, code, text). |
| `src/commands/status.ts` | `status` — GET `/v0/artifacts/status` to list artifacts for the current API key. |

---

## Public API Surface

Exported from `src/index.ts` for library consumers:

### Configuration

```typescript
const CONFIG_DIR: string;
// ~/.config/tokenrip

interface TokenripConfig {
  apiKey?: string;
  apiUrl?: string;
  preferences: Record<string, unknown>;
}

function loadConfig(): TokenripConfig;
// Reads config file. Returns defaults if file missing.

function saveConfig(config: TokenripConfig): void;
// Creates config dir if needed, writes JSON.

function getApiUrl(config: TokenripConfig): string;
// Resolution: config.apiUrl → TOKENRIP_API_URL → 'http://localhost:3000'

function getApiKey(config: TokenripConfig): string | undefined;
// Resolution: config.apiKey → TOKENRIP_API_KEY → undefined
```

### HTTP Client

```typescript
interface ClientConfig {
  baseUrl?: string;   // default: 'http://localhost:3000'
  timeout?: number;   // default: 30000 (30s)
  apiKey?: string;    // set as Bearer token
}

function createHttpClient(config?: ClientConfig): AxiosInstance;
// Returns axios instance with auth header and error interceptors.
```

### Error Handling

```typescript
class CliError extends Error {
  readonly code: string;
  constructor(code: string, message: string);
}

function toCliError(err: unknown): CliError;
// CliError passes through; Error.message preserved; anything else stringified.
```

### Output Utilities

```typescript
function outputSuccess(data: Record<string, unknown>): void;
// console.log(JSON.stringify({ ok: true, data }))

function outputError(err: CliError): never;
// console.log(JSON.stringify({ ok: false, error, message })); process.exit(1)

function wrapCommand<T extends (...args: any[]) => Promise<void>>(fn: T): T;
// Wraps async command handler: catches errors → outputError(toCliError(err))
```

---

## CLI Commands

### `tokenrip config set-key <key>`

- Loads config, sets `apiKey`, saves config
- Output: `{ ok: true, data: { message: "API key saved" } }`

### `tokenrip config set-url <url>`

- Loads config, sets `apiUrl`, saves config
- Output: `{ ok: true, data: { message: "API URL saved", apiUrl: "<url>" } }`

### `tokenrip upload <file> [options]`

**Options:** `--title <title>`, `--parent <uuid>`, `--context <text>`, `--refs <urls>`

- **Validation:** API key must be configured (`NO_API_KEY`), file must exist (`FILE_NOT_FOUND`)
- **MIME detection:** `mime-types` library, falls back to `application/octet-stream`
- **Request:** `POST /v0/artifacts` as multipart form with fields: `file` (stream), `type` ("file"), `mimeType`, `title`, and optional provenance fields (`parentArtifactId`, `creatorContext`, `inputReferences`)
- **Title default:** filename if `--title` not given
- **URL:** uses `url` from API response (backend computes from `FRONTEND_URL` env var). Falls back to port-swap logic for older backends.
- **Output:** `{ ok: true, data: { id, url, title, type, mimeType } }`

### `tokenrip publish <file> --type <type> [options]`

**Options:** `--title <title>`, `--parent <uuid>`, `--context <text>`, `--refs <urls>`

- **Validation:** API key, type must be one of `markdown | html | chart | code | text` (`INVALID_TYPE`), file must exist
- **Request:** `POST /v0/artifacts` as JSON with fields: `type`, `content` (file read as UTF-8), `title`, and optional provenance fields (`parentArtifactId`, `creatorContext`, `inputReferences`)
- **Title default:** filename if `--title` not given
- **URL:** uses `url` from API response (same as upload)
- **Output:** `{ ok: true, data: { id, url, title, type } }`

### `tokenrip status [--since <iso-date>]`

- **Validation:** API key must be configured (`NO_API_KEY`)
- **Request:** `GET /v0/artifacts/status` with optional `?since=` query parameter
- **Output:** `{ ok: true, data: [{ id, title, type, mimeType, createdAt, updatedAt }, ...] }`
- Returns artifacts created by the current API key, ordered by `updatedAt` descending (max 100)

---

## HTTP Client

`createHttpClient()` in `src/client.ts` returns an Axios instance configured with:

### Request Config
- `baseURL` from config (default `http://localhost:3000`)
- `timeout` of 30 seconds
- `Authorization: Bearer <apiKey>` header when key is provided

### Response Interceptors

The error interceptor maps HTTP failures to typed `CliError` instances:

| Condition | Error Code | Message |
|-----------|-----------|---------|
| `response.status === 401` | `UNAUTHORIZED` | "API key required or invalid..." |
| `response.data.error` exists | value of `.error` | value of `.message` or "Unknown API error" |
| `error.code === 'ECONNABORTED'` | `TIMEOUT` | "Request timeout..." |
| Any other error | `NETWORK_ERROR` | "Network error..." |

This means command handlers never see raw axios errors — they always get `CliError` with an actionable message.

---

## Configuration System

### File Location

```
~/.config/tokenrip/config.json
```

Created automatically on first `saveConfig()` call (directory created with `recursive: true`).

### Schema

```typescript
{
  apiKey?: string;      // API key for authentication
  apiUrl?: string;      // Base URL for the Tokenrip API
  preferences: {};      // Extensible — reserved for future use
}
```

### Resolution Precedence

For both `apiUrl` and `apiKey`, the resolution order is:

1. Config file value (if set)
2. Environment variable (`TOKENRIP_API_URL` / `TOKENRIP_API_KEY`)
3. Default (apiUrl: `http://localhost:3000`, apiKey: `undefined`)

Note: config file takes precedence over env vars. This means `set-key` overrides `TOKENRIP_API_KEY`.

### Behavior on Missing Config

`loadConfig()` returns `{ preferences: {} }` if the config file doesn't exist or can't be parsed. No errors thrown.

---

## Error Handling

### Error Flow

```
Command handler throws
  → wrapCommand catches
    → toCliError normalizes to CliError
      → outputError prints JSON + exit(1)
```

### Error Codes

| Code | Source | When |
|------|--------|------|
| `NO_API_KEY` | `upload.ts`, `publish.ts`, `status.ts` | API key not configured and not in env |
| `FILE_NOT_FOUND` | `upload.ts`, `publish.ts` | Input file path doesn't exist |
| `INVALID_TYPE` | `publish.ts` | `--type` not one of: markdown, html, chart, code, text |
| `UNAUTHORIZED` | `client.ts` interceptor | Backend returns 401 |
| `TIMEOUT` | `client.ts` interceptor | Request exceeds 30s |
| `NETWORK_ERROR` | `client.ts` interceptor | Connection refused / DNS failure |
| `UNKNOWN_ERROR` | `toCliError()` | Any uncaught error without a code |
| (API-defined) | `client.ts` interceptor | Backend returns error in response body |

### Design Notes

- All output goes to `stdout` (not `stderr`), even errors — this is intentional for agent consumption
- `outputError` calls `process.exit(1)` — it's typed as `never`
- `wrapCommand` is the top-level error boundary for all CLI commands
- `toCliError` preserves `CliError` instances and wraps everything else as `UNKNOWN_ERROR`

---

## Build System

### Dual Output

The CLI produces two builds from the same source:

| Build | Config | Output | Module System |
|-------|--------|--------|---------------|
| ESM | `tsconfig.json` | `dist/` | ES modules (`import/export`) |
| CJS | `tsconfig.cjs.json` | `dist/cjs/` | CommonJS (`require/module.exports`) |

### Why Dual Build?

- **ESM:** The CLI binary needs ESM for the `#!/usr/bin/env node` shebang + top-level await support
- **CJS:** Library consumers using `require()` (older Node.js projects, tools that don't support ESM)

### CJS Specifics

- `tsconfig.cjs.json` extends the base config but sets `module: "CommonJS"` and output to `dist/cjs/`
- **Excludes `src/cli.ts`** — the CLI entry uses ESM-only features (shebang, `import.meta.url`)
- A `package.json` with `{"type":"commonjs"}` is injected into `dist/cjs/` during build (via inline Node script in the build command)
- No declaration files in CJS — reuses ESM types from `dist/index.d.ts`

### Build Command

```bash
tsc && tsc -p tsconfig.cjs.json && node -e "require('fs').writeFileSync('dist/cjs/package.json', '{\"type\":\"commonjs\"}')"
```

Three steps chained: ESM build → CJS build → inject CJS package.json.

### Package Exports

```json
{
  "main": "dist/cjs/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/cjs/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "bin": { "tokenrip": "dist/cli.js" }
}
```

---

## Authentication Flow

1. Agent obtains API key from backend (`POST /v0/auth/keys` returns `tr_<32-hex>`)
2. Key saved locally: `tokenrip config set-key tr_...` or set as `TOKENRIP_API_KEY` env var
3. On every request, `createHttpClient` injects `Authorization: Bearer <key>` header
4. Backend validates key hash against `api_keys` table, checks not revoked
5. On 401, client interceptor throws `CliError('UNAUTHORIZED', ...)` with setup instructions

---

## Artifact Creation Flow

### Upload (Binary Files)

```
tokenrip upload report.pdf --title "Q1" --context "agent task"
  │
  ├─ loadConfig() → getApiKey() → validate key exists
  ├─ path.resolve(filePath) → validate file exists
  ├─ mime.lookup() → 'application/pdf'
  ├─ createHttpClient({ baseUrl, apiKey })
  │
  ├─ Build FormData:
  │   ├─ file: fs.createReadStream(absPath)
  │   ├─ type: 'file'
  │   ├─ mimeType: 'application/pdf'
  │   ├─ title: 'Q1'
  │   └─ creatorContext: 'agent task' (+ parentArtifactId, inputReferences if given)
  │
  ├─ POST /v0/artifacts (multipart/form-data)
  │   └─ maxContentLength: Infinity (no client-side size limit)
  │
  └─ outputSuccess({ id, url, title, type, mimeType })
```

### Publish (Structured Content)

```
tokenrip publish dashboard.html --type html --title "Dashboard" --parent <uuid>
  │
  ├─ loadConfig() → getApiKey() → validate key exists
  ├─ validate type ∈ ['markdown', 'html', 'chart', 'code', 'text']
  ├─ path.resolve(filePath) → validate file exists
  ├─ fs.readFileSync(absPath, 'utf-8') → content string
  ├─ createHttpClient({ baseUrl, apiKey })
  │
  ├─ POST /v0/artifacts (application/json)
  │   └─ { type, content, title, parentArtifactId, creatorContext, inputReferences }
  │
  └─ outputSuccess({ id, url, title, type })
```

### URL Construction

The shareable `url` is returned by the backend in the `POST /v0/artifacts` response. The backend computes it from the `FRONTEND_URL` environment variable (default: `http://localhost:3333`).

The CLI uses this URL directly. If talking to an older backend that doesn't return `url`, it falls back to stripping the API port and appending `:8000/s/{id}`.

---

## Testing

CLI tests live in the monorepo's `tests/integration/` directory:

- **`config.test.ts`** — unit tests for `loadConfig`, `saveConfig`, `getApiUrl`, `getApiKey` (no backend needed)
- **`upload.test.ts`** — integration tests that start the backend and test file upload end-to-end
- **`publish.test.ts`** — integration tests for content publishing
- **`full-flow.test.ts`** — end-to-end test covering the full user journey

Tests use Bun's test runner. Integration tests start a real NestJS backend on a random port with a per-file test database.

---

## Extension Points

### Adding a New Command

1. Create `src/commands/newcmd.ts` exporting an async function
2. Register in `src/cli.ts` under `program.command(...)` with `wrapCommand()`
3. Use `loadConfig()` / `createHttpClient()` / `outputSuccess()` as needed

### Adding a New Content Type

1. Add the type string to `VALID_TYPES` in `src/commands/publish.ts`
2. Add the type to `ArtifactType` enum in the backend (`apps/backend/src/db/models/Artifact.ts`)
3. Add MIME mapping in `CONTENT_MIME_TYPES` in the backend service
4. Frontend needs a corresponding viewer component in `apps/frontend/src/components/viewers/`
5. Update `ArtifactViewer.tsx` dispatch and `needsTextContent` check

The `code` and `text` types were added following this pattern.

### Adding a New Config Field

1. Add the field to `TokenripConfig` interface in `src/config.ts`
2. Add a resolver function if env var override is needed
3. Optionally add a `config set-<field>` command

### Adding a New Error Code

1. Throw `new CliError('NEW_CODE', 'message')` in the relevant command
2. Document the code in the README error codes table

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `axios` | ^1.11.0 | HTTP client for API requests |
| `commander` | ^12.1.0 | CLI argument parsing and command structure |
| `form-data` | ^4.0.1 | Multipart form encoding for file uploads |
| `mime-types` | ^2.1.35 | Auto-detect MIME type from file extension |
