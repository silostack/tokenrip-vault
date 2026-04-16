# CSV Assets Design

## Problem

Agents and operators often work with CSV data — exports from CRMs, data dumps, scraped datasets, spreadsheet reports. Before this feature, they had two unsatisfying options:

- Upload the CSV as `AssetType.FILE`: versioned and downloadable, but opaque bytes — the dashboard can't render it as a table.
- Create an `AssetType.COLLECTION` and parse the CSV client-side into `POST /rows` calls: tabular and queryable, but there's no versioning, no round-trip back to CSV, and the agent has to write its own parser.

We need a first-class CSV asset type: a versioned, shareable, table-renderable primitive that round-trips cleanly as CSV text. And we need a one-shot path for agents who want to *turn* a CSV into an editable living collection.

## Design Decisions

### CSV is a separate primitive from Collection

**Chosen.** `AssetType.CSV` is its own type. CSV and Collection do not share row storage.

Alternatives considered:
- **CSV backed by `collection_row` rows with versioning enabled** — considered during brainstorm. Rejected: the dirty-state story (rows edited between versions) is ambiguous, and mixing row-level writes with CSV-level versioning adds surface area for marginal benefit.
- **Unify under `collection` with opt-in versioning** — rejected: collections deliberately skipped versioning to keep the "living table" semantics clean. Versioning a table with ongoing row-level writes generates noise.

The two primitives answer different questions:
- **Collection** — living data. Appended over time. Row-level writes. No versioning.
- **CSV** — snapshot. Preserves the original CSV bytes. Versioned. No row-level API.

### CSV reuses the content-asset path (like markdown)

**Chosen.** A CSV asset stores its CSV text in `asset_version` via the existing `storage.save()` path, mime type `text/csv`. No new columns, no new tables, no new service — just a new enum value and mime-map entry.

This means:
- `POST /v0/assets` with `type: 'csv'` works out of the box via `AssetService.createFromContent`.
- `POST /v0/assets/:uuid/versions` with a new CSV body creates a new version via `AssetVersionService.createVersionForAsset`, same as markdown.
- `GET /v0/assets/:id/content` serves the latest version's CSV text, same as markdown.
- `GET /v0/assets/:id/versions` lists all CSV versions.

The only CSV-specific code is in the dashboard (table rendering) and the CSV → collection import path.

### CSV assets have no row-level API

**Chosen.** `/v0/assets/:uuid/rows` continues to reject non-collection assets. If you want row-level manipulation, use a collection.

The dashboard renders a CSV by parsing it client-side. Edits (if any) serialize the table back to CSV and trigger a standard version update — each save creates a new version.

### One-shot CSV → Collection import

**Chosen.** `POST /v0/assets` with `type: 'collection'`, `from_csv: true`, and a CSV payload (upload file or `content` string) parses the CSV server-side and returns a fully-populated collection asset in a single call. No intermediate CSV asset is created.

This removes the friction of "parse CSV client-side, then call `POST /rows` N times" and is the primary bridge between the CSV and collection worlds.

### Schema inference rules

**Chosen.** Three modes, determined by which flags the caller provides:

| Input | Behavior |
|---|---|
| `schema` provided | Schema defines column names + types. All CSV rows are data. |
| `headers: true` (no schema) | First CSV row = column names (all `text` type). Remaining rows are data. |
| Neither | Auto-generated column names `col_1, col_2, …`. All CSV rows are data. |
| Both `schema` and `headers: true` | 400 `SCHEMA_AND_HEADERS_CONFLICT`. Caller must pick one source of names. |

Erroring on both-flags-set is deliberate: silent precedence is a foot-gun. If an agent wants headers *and* typed columns, the clean path is to use `schema` only.

### No collection → CSV export in v1

**Deferred.** An agent that wants to save a collection as a CSV can read the rows via `GET /v0/assets/:id/rows` and serialize client-side, then publish a new CSV asset. If this pattern becomes common we can add `GET /v0/assets/:id/content?as=csv` on collections later.

### No fork endpoints

**Deferred.** `fork-as-collection` and `fork-as-csv` were considered, but with the one-shot import path they're not needed for v1: starting from a CSV, the agent just calls the import endpoint; starting from a collection, the agent serializes and re-publishes.

## API Surface

See `apps/backend/CLAUDE.md` for the full endpoint table. The only endpoint that changes behavior is `POST /v0/assets`:

```
# Publish CSV asset
POST /v0/assets  { type: 'csv', content: '<csv>', title: '...' }

# Multipart CSV upload
POST /v0/assets  (form) type=csv, title=..., file=<csv>

# One-shot CSV → collection
POST /v0/assets  { type: 'collection', from_csv: true, content: '<csv>', headers: true }
POST /v0/assets  (form) type=collection, from_csv=true, headers=true, file=<csv>
```

All other CSV operations flow through existing generic asset endpoints:

```
GET    /v0/assets/:id              # metadata
GET    /v0/assets/:id/content      # CSV text
POST   /v0/assets/:id/versions     # new CSV version
GET    /v0/assets/:id/versions     # list versions
DELETE /v0/assets/:id/versions/:v  # delete a version
```

## CLI

No new command group. Everything is a flag on existing `rip asset publish`:

```bash
# CSV asset
rip asset publish data.csv --type csv --title "Q1 leads"

# New version
rip asset update <uuid> data.csv

# One-shot CSV → collection
rip asset publish leads.csv --type collection --from-csv --headers --title "Leads"
```

Row operations (`rip collection append/rows/update/delete`) remain collection-only.

## MCP

- `asset_publish` — accepts `csv` as a valid `type` value.
- `collection_create_from_csv` — new tool for the one-shot import path.
- All other CSV ops (`asset_update`, `asset_get`, `asset_get_content`, `asset_versions`, `asset_version_delete`) work unchanged.

## What's Not in v1

- **Collection → CSV export.** Not yet. See "No collection → CSV export in v1" above.
- **Fork endpoints.** Not yet. See "No fork endpoints" above.
- **Row-level API on CSV assets.** Never — by design. Use a collection.
- **Server-side CSV filter/sort/pagination.** Dashboard parses and handles this client-side. Large CSVs (>10k rows) may be slow; revisit when it matters.
- **Schema type inference.** All auto-derived columns are `text`. Callers who want typed columns pass an explicit `schema`.
- **CSV delimiter/quoting config.** Default comma, double-quote escape via `""`. The inline parser handles embedded commas, embedded newlines inside quotes, and CRLF/LF line endings.
