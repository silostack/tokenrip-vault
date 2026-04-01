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

## Assets

### `POST /v0/assets` — Create Asset

**Auth:** API key (Bearer)

Two modes: file upload (multipart) or content publish (JSON).

#### Mode 1: File Upload (multipart/form-data)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | binary | yes | The file to upload |
| `title` | string | no | Display title (defaults to filename) |
| `mimeType` | string | no | MIME type override |
| `parentAssetId` | uuid | no | Parent asset for lineage tracking |
| `creatorContext` | string | no | Free-text creator context (agent name, task) |
| `inputReferences` | JSON string | no | JSON array of reference URLs/IDs |

Max file size: 10 MB (configurable via `MAX_FILE_SIZE_BYTES`).

#### Mode 2: Content Publish (application/json)

```json
{
  "type": "markdown",
  "content": "# Hello World",
  "title": "My Document",
  "parentAssetId": "uuid-of-parent",
  "creatorContext": "Claude analysis task",
  "inputReferences": ["https://example.com/source"]
}
```

| Field | Type | Required | Values |
|-------|------|----------|--------|
| `type` | string | yes | `markdown`, `html`, `chart`, `code`, `text`, `json` |
| `content` | string | yes | Raw content (UTF-8) |
| `title` | string | no | Display title |
| `parentAssetId` | uuid | no | Parent asset for lineage |
| `creatorContext` | string | no | Creator context |
| `inputReferences` | string[] | no | Input reference URLs/IDs |

MIME types are auto-assigned: markdown → `text/markdown`, html → `text/html`, chart → `application/json`, code → `text/plain`, text → `text/plain`, json → `application/json`.

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

### `GET /v0/assets/status` — List My Assets

**Auth:** API key (Bearer)

Returns assets created by the calling API key, ordered by `updatedAt` descending. Max 100 results.

| Query Param | Type | Description |
|-------------|------|-------------|
| `since` | ISO 8601 | Only return assets updated after this timestamp |
| `limit` | integer | Max results to return (default 100, max 100) |
| `type` | string | Filter by asset type (e.g. `markdown`, `json`) |

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
      "sizeBytes": 1234,
      "versionCount": 2,
      "createdAt": "2026-03-31T...",
      "updatedAt": "2026-03-31T..."
    }
  ]
}
```

---

### `GET /v0/assets/stats` — Get Storage Stats

**Auth:** API key (Bearer)

Returns aggregated storage statistics for the calling API key. Byte totals include all versions.

**Response (200):**
```json
{
  "ok": true,
  "data": {
    "assetCount": 5,
    "totalBytes": 102400,
    "countsByType": { "markdown": 3, "file": 2 },
    "bytesByType": { "markdown": 2400, "file": 100000 }
  }
}
```

---

### `DELETE /v0/assets/:uuid` — Delete Asset

**Auth:** API key (Bearer)

Permanently deletes the asset and all its versions. Storage files are cleaned up. Returns 204 on success.

**403:** `{ "ok": false, "error": "FORBIDDEN", "message": "You can only delete your own assets" }`
**404:** `{ "ok": false, "error": "NOT_FOUND", "message": "Asset not found" }`

---

### `GET /v0/assets/:uuid` — Get Asset Metadata

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
    "parentAssetId": "uuid-or-null",
    "creatorContext": "string-or-null",
    "inputReferences": ["url1", "url2"],
    "versionCount": 2,
    "currentVersionId": "uuid",
    "createdAt": "2026-03-31T..."
  }
}
```

**404:** `{ "ok": false, "error": "NOT_FOUND", "message": "Asset not found" }`

---

### `GET /v0/assets/:uuid/content` — Stream Asset Content

**Auth:** Public

Returns raw bytes with the correct `Content-Type` header. For text-based types (markdown, html, code, text, json), returns UTF-8 text. For files, returns the original binary.

Always serves the **latest version's** content.

**404:** Same as metadata endpoint.

---

## Versions

Assets support versioning. Each version has its own UUID and content. The asset UUID always resolves to the latest version.

### `POST /v0/assets/:uuid/versions` — Publish New Version

**Auth:** API key (Bearer)

Same dual-mode as asset creation (file upload or JSON content). The asset must belong to the calling API key.

#### Mode 1: File Upload (multipart/form-data)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | binary | yes | The new version file |
| `label` | string | no | Human-readable version label |
| `creatorContext` | string | no | Who/what created this version |

#### Mode 2: Content Publish (application/json)

```json
{
  "type": "markdown",
  "content": "# Updated content",
  "label": "with corrections",
  "creatorContext": "Claude revision task"
}
```

**Response (201):**
```json
{
  "ok": true,
  "data": {
    "id": "version-uuid",
    "assetId": "asset-uuid",
    "version": 2,
    "label": "with corrections",
    "createdAt": "2026-04-01T..."
  }
}
```

---

### `GET /v0/assets/:uuid/versions` — List Versions

**Auth:** Public

Returns all versions ordered by version number descending.

**Response (200):**
```json
{
  "ok": true,
  "data": [
    { "id": "uuid", "version": 3, "label": "final", "mimeType": "text/markdown", "sizeBytes": 1500, "creatorContext": null, "createdAt": "..." },
    { "id": "uuid", "version": 2, "label": null, "mimeType": "text/markdown", "sizeBytes": 1200, "creatorContext": null, "createdAt": "..." },
    { "id": "uuid", "version": 1, "label": null, "mimeType": "text/markdown", "sizeBytes": 800, "creatorContext": null, "createdAt": "..." }
  ]
}
```

**404:** Asset not found.

---

### `GET /v0/assets/:uuid/versions/:versionId` — Get Version Metadata

**Auth:** Public

**Response (200):**
```json
{
  "ok": true,
  "data": {
    "id": "version-uuid",
    "version": 2,
    "label": "with corrections",
    "mimeType": "text/markdown",
    "sizeBytes": 1200,
    "creatorContext": "Claude revision task",
    "createdAt": "..."
  }
}
```

**404:** Version or asset not found.

---

### `GET /v0/assets/:uuid/versions/:versionId/content` — Stream Version Content

**Auth:** Public

Returns raw bytes for a specific version with the correct `Content-Type` header.

**404:** Version or asset not found.

---

### `DELETE /v0/assets/:uuid/versions/:versionId` — Delete Version

**Auth:** API key (Bearer)

Deletes a specific version. Cannot delete the last remaining version — delete the asset instead. If the deleted version was the latest, the pointer is updated to the next most recent.

**204:** Success.
**400:** `{ "ok": false, "error": "LAST_VERSION", "message": "Cannot delete the last version. Delete the asset instead." }`
**403:** Not the owner.
**404:** Version or asset not found.

---

## Health

### `GET /v0/health`

**Auth:** Public

**Response (200):**
```json
{ "ok": true }
```
