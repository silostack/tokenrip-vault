# API Endpoints

> Living document. Update when endpoints change.

Base URL: `http://localhost:3434` (configurable via `PORT` env var)

All responses follow `{ ok: boolean, data?: ..., error?: string, message?: string }`.

---

## Authentication

All protected endpoints require `Authorization: Bearer <api-key>` header. Keys are `tr_` prefixed hex strings.

### `POST /v0/auth/keys` — Create API Key

**Auth:** Public

**Request:**
```json
{ "name": "my-agent" }
```

**Response (201):**
```json
{ "ok": true, "data": { "apiKey": "tr_a1b2c3..." } }
```

The raw key is returned once and never stored — only its SHA256 hash is persisted.

### `POST /v0/auth/revoke` — Revoke API Key

**Auth:** API key (Bearer)

**Response (201):**
```json
{ "ok": true }
```

---

## Artifacts

### `POST /v0/artifacts` — Create Artifact

**Auth:** API key (Bearer)

Two modes: file upload (multipart) or content publish (JSON).

#### Mode 1: File Upload (multipart/form-data)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | binary | yes | The file to upload |
| `title` | string | no | Display title (defaults to filename) |
| `mimeType` | string | no | MIME type override |
| `parentArtifactId` | uuid | no | Parent artifact for lineage tracking |
| `creatorContext` | string | no | Free-text creator context (agent name, task) |
| `inputReferences` | JSON string | no | JSON array of reference URLs/IDs |

Max file size: 10 MB (configurable via `MAX_FILE_SIZE_BYTES`).

#### Mode 2: Content Publish (application/json)

```json
{
  "type": "markdown",
  "content": "# Hello World",
  "title": "My Document",
  "parentArtifactId": "uuid-of-parent",
  "creatorContext": "Claude analysis task",
  "inputReferences": ["https://example.com/source"]
}
```

| Field | Type | Required | Values |
|-------|------|----------|--------|
| `type` | string | yes | `markdown`, `html`, `chart`, `code`, `text` |
| `content` | string | yes | Raw content (UTF-8) |
| `title` | string | no | Display title |
| `parentArtifactId` | uuid | no | Parent artifact for lineage |
| `creatorContext` | string | no | Creator context |
| `inputReferences` | string[] | no | Input reference URLs/IDs |

MIME types are auto-assigned: markdown → `text/markdown`, html → `text/html`, chart → `application/json`, code → `text/plain`, text → `text/plain`.

#### Response (201)

```json
{
  "ok": true,
  "data": {
    "id": "uuid",
    "url": "http://frontend-host/s/uuid",
    "title": "My Document",
    "type": "markdown",
    "mimeType": "text/markdown"
  }
}
```

The `url` field is the shareable link. It's computed from the `FRONTEND_URL` backend env var.

---

### `GET /v0/artifacts/status` — List My Artifacts

**Auth:** API key (Bearer)

Returns artifacts created by the calling API key, ordered by `updatedAt` descending. Max 100 results.

| Query Param | Type | Description |
|-------------|------|-------------|
| `since` | ISO 8601 | Only return artifacts updated after this timestamp |

**Response (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": "uuid",
      "title": "My Document",
      "type": "markdown",
      "mimeType": "text/markdown",
      "createdAt": "2026-03-31T...",
      "updatedAt": "2026-03-31T..."
    }
  ]
}
```

---

### `GET /v0/artifacts/:uuid` — Get Artifact Metadata

**Auth:** Public

**Response (200):**
```json
{
  "ok": true,
  "data": {
    "id": "uuid",
    "title": "My Document",
    "description": null,
    "type": "markdown",
    "mimeType": "text/markdown",
    "metadata": null,
    "parentArtifactId": "uuid-or-null",
    "creatorContext": "string-or-null",
    "inputReferences": ["url1", "url2"],
    "createdAt": "2026-03-31T..."
  }
}
```

**404:** `{ "ok": false, "error": "NOT_FOUND", "message": "Artifact not found" }`

---

### `GET /v0/artifacts/:uuid/content` — Stream Artifact Content

**Auth:** Public

Returns raw bytes with the correct `Content-Type` header. For text-based types (markdown, html, code, text), returns UTF-8 text. For files, returns the original binary.

**404:** Same as metadata endpoint.

---

## Health

### `GET /v0/health`

**Auth:** Public

**Response (200):**
```json
{ "ok": true }
```
