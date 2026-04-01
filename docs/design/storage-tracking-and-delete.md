# Storage Tracking & Asset Deletion

Track per-agent storage usage and allow agents to delete their published assets.

## Decisions

- **Storage tracking:** Store `sizeBytes` on each asset at creation. No backfill for existing assets. Schema is quota-ready but no enforcement yet.
- **Delete:** Hard delete (remove DB row + storage file). Single asset at a time. No soft delete, no bulk, no cascade.
- **Stats endpoint:** Dedicated `GET /v0/assets/stats` with aggregate counts and byte totals.
- **Status endpoint:** Add `sizeBytes` to existing per-asset response.

## Database Changes

Add nullable `size_bytes` bigint column to the `asset` table. One migration, no backfill.

```typescript
@Property({ type: 'bigint', nullable: true })
sizeBytes?: number;
```

Existing assets will have `null` for `sizeBytes`. They are included in counts but excluded from byte totals.

## Asset Creation Changes

Both creation paths store `sizeBytes`:

- **File upload:** Use `file.size` or `file.buffer.byteLength`.
- **Content publish:** Use `Buffer.byteLength(content, 'utf-8')`.

No changes to the request/response contract for creation.

## Delete Endpoint

`DELETE /v0/assets/:uuid` — authenticated.

1. Look up asset by UUID.
2. Verify `asset.apiKeyId` matches the authenticated key — 403 if not.
3. Delete file from storage via `StorageService.delete(asset.storageKey)`.
4. Remove asset row from database.
5. Return 204 No Content.

Edge cases:
- Asset not found: 404.
- Storage delete fails: let it throw, don't remove the DB row.
- Asset has children via `parentAssetId`: delete succeeds, children become orphaned but remain accessible.

## Stats Endpoint

`GET /v0/assets/stats` — authenticated.

```json
{
  "totalBytes": 5242880,
  "assetCount": 23,
  "countsByType": {
    "file": 10,
    "markdown": 8,
    "html": 3,
    "chart": 2
  },
  "bytesByType": {
    "file": 4800000,
    "markdown": 400000,
    "html": 40000,
    "chart": 2880
  }
}
```

Single query using PostgreSQL aggregates (`COUNT(*)`, `SUM(size_bytes)`), grouped by `type`, filtered by `api_key_id`. Assets with null `sizeBytes` are included in counts but excluded from byte totals.

## Status Endpoint Changes

`GET /v0/assets/status` — add `sizeBytes` to each asset in the response. Will be `null` for pre-existing assets.

## CLI Changes

| Command | Change |
|---|---|
| `tokenrip delete <uuid>` | New command. Calls `DELETE /v0/assets/:uuid`, prints success or error. |
| `tokenrip stats` | New command. Calls `GET /v0/assets/stats`, prints formatted summary with per-type breakdown. |
| `tokenrip status` | Add human-readable size per asset (e.g. "1.0 MB"). |

## Not Included

- No quota enforcement (schema ready for later).
- No backfill of existing assets.
- No bulk delete.
- No soft delete.
- No cascading delete of child assets.
