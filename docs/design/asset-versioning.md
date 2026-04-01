# Asset Versioning Design

## Problem

Assets in tokenrip are immutable. When an agent regenerates a report or revises a chart, it must create a new asset with a new URL. This breaks existing shared links and loses the connection between versions of the same work.

## Design

### Data Model

The `asset` table becomes the **version group** — the stable identity that gets shared. A new `asset_version` table holds immutable content snapshots.

**`asset` table additions:**
- `currentVersionId` (uuid, nullable) — points to latest version
- `versionCount` (integer, default 1) — denormalized for quick display
- Existing `storageKey`, `mimeType`, `sizeBytes` kept as denormalized cache of current version

**New `asset_version` table:**

| Column | Type | Description |
|---|---|---|
| id | uuid PK | Per-version UUID (for direct linking) |
| asset_id | uuid FK → asset | Group this belongs to |
| version | integer | Auto-increment per asset (1, 2, 3...) |
| label | string? | Optional human-readable label |
| storage_key | string | Path in storage backend |
| size_bytes | bigint? | File size |
| mime_type | string? | Content type |
| creator_context | text? | Who/what created this version |
| created_at | timestamptz | When published |

Unique constraint on `(asset_id, version)`.

### URL Scheme

- `/s/<groupId>` — always resolves to latest version (stable sharing URL)
- `/s/<groupId>/<versionId>` — links to a specific version

Both URLs are shareable. The group URL is what agents hand out; the version URL is for linking to a specific point in time.

### API

**New endpoints:**

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/v0/assets/:uuid/versions` | API key | Publish new version |
| GET | `/v0/assets/:uuid/versions` | Public | List all versions |
| GET | `/v0/assets/:uuid/versions/:vid` | Public | Version metadata |
| GET | `/v0/assets/:uuid/versions/:vid/content` | Public | Version content |
| DELETE | `/v0/assets/:uuid/versions/:vid` | API key | Delete specific version |

**Modified responses:** Asset metadata now includes `versionCount` and `currentVersionId`.

### CLI

```
tokenrip asset update <uuid> <file> [--type <type>] [--label "text"] [--context "text"]
tokenrip asset delete-version <uuid> <versionId>
```

### Frontend

- Version dropdown in the asset header, shown only when `versionCount > 1`
- Each entry: version number, optional label, relative timestamp
- "Viewing older version" banner with link to latest when not on current version
- Version list fetched lazily on dropdown open

### Version Numbers

Auto-incrementing integers (v1, v2, v3...) assigned by the backend. Optional human-readable label per version (e.g., "final draft", "with charts").

### Storage

All versions kept indefinitely. Users can delete individual versions via CLI. Cannot delete the last remaining version of an asset.

### Migration

Backfill creates a v1 `asset_version` row for every existing asset, copying `storage_key`, `size_bytes`, `mime_type`, and `creator_context` from the asset row.
