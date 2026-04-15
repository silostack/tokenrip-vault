# Thread-Asset Linking

**Date:** 2025-04-15
**Status:** Implemented

## Problem

Threads and assets can be linked via the `Ref` model, but the mechanic is implicit (only triggered as a side effect of messaging "at" an asset UUID) and refs aren't surfaced in the operator dashboard. Agents also paste full tokenrip URLs instead of bare UUIDs, which breaks ref consistency.

Operators need an easy way to see what assets (and external URLs) a thread references, and agents/operators need explicit control over linking.

## Ref Types

| `type` | `target_id` | Use case |
|--------|-------------|----------|
| `asset` | Asset public UUID | Link to a tokenrip asset |
| `url` | Full URL string | External link (Figma, website, doc, etc.) |

The `target_id` field is already a plain `string`, so it holds URLs without schema changes.

## URL Normalization

`RefService.addRefs()` normalizes all incoming refs at the API layer:

- Match `target_id` against `FRONTEND_URL` and `API_URL` patterns (`*/s/{uuid}`, `*/assets/{uuid}/*`)
- If a tokenrip URL is detected, **override type to `asset`** and extract the bare UUID — regardless of what type was passed
- Strip query params (e.g. `?cap=...`) before extracting the UUID
- Bare UUIDs with `type: "asset"` pass through unchanged
- Non-tokenrip URLs stay as `type: "url"` untouched

Examples:
```
{ type: "asset", target_id: "https://app.tokenrip.com/s/ee5fcf2d-..." }
  → { type: "asset", target_id: "ee5fcf2d-..." }

{ type: "url", target_id: "https://app.tokenrip.com/s/ee5fcf2d-..." }
  → { type: "asset", target_id: "ee5fcf2d-..." }

{ type: "url", target_id: "https://figma.com/design/abc123" }
  → { type: "url", target_id: "https://figma.com/design/abc123" }
```

## New REST Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/v0/threads/:id/refs` | API key/cap | Add refs to an existing thread |
| `DELETE` | `/v0/threads/:id/refs/:refId` | API key/cap | Remove a ref from a thread |
| `POST` | `/v0/operator/threads/:id/refs` | User session | Operator adds refs |
| `DELETE` | `/v0/operator/threads/:id/refs/:refId` | User session | Operator removes a ref |

Request body for POST:
```json
{ "refs": [{ "type": "asset", "target_id": "ee5fcf2d-..." }, { "type": "url", "target_id": "https://figma.com/..." }] }
```

## Modified REST Endpoints

| Endpoint | Change |
|----------|--------|
| `POST /v0/threads` | Accept optional `refs` array in body |
| `GET /v0/threads/:id` | Include `refs` array in response |
| `GET /v0/operator/threads/:id` | Include aggregated deduped `refs` in response |

## New MCP Tools

| Tool | Description |
|------|-------------|
| `thread_add_refs` | Add refs to a thread |
| `thread_remove_ref` | Remove a ref by ID |

Thread creation flow in MCP also accepts `refs`.

## RefService Changes

- **`addRefs()`** — add URL normalization logic
- **`findAllForThread(threadId)`** — new method: returns deduped union of thread-level refs + message-level refs for that thread, aggregated server-side
- **`removeRef(refId)`** — new method: deletes a ref by ID

## Aggregation

The `findAllForThread()` method queries refs where:
- `ownerType = 'thread' AND ownerId = threadId`, OR
- `ownerType = 'message' AND ownerId IN (message IDs for that thread)`

Results are deduped by `type + target_id`. Each ref in the response includes its `id` (for deletion).

## Frontend

A "Linked Resources" widget in the operator thread detail view:
- Only shown when the thread has refs (no empty state)
- **Asset refs:** asset title (fetched), type icon, clickable link opening `/s/{uuid}` in new tab
- **URL refs:** domain label, external link icon, opens in new tab
- **Add button:** `+` icon to attach a new ref from the dashboard
- **Remove button:** `x` on each ref to remove it

## Access Control

- Any thread participant (agent or bound operator) can add or remove refs
- No ownership distinction — any participant can remove any ref
- Same auth patterns as existing thread endpoints

## Out of Scope

- Message-level ref display in UI (later)
- Ref deletion cascades
- Ref permissions beyond thread participation
