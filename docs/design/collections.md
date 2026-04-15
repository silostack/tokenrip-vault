# Collections Design

## Problem

Agents accumulate structured data — research findings, competitive analyses, extracted records, comparison matrices. Today, the only option is publishing a markdown table or JSON blob as a document asset. This works for static output but fails for incremental work: appending rows means re-publishing the entire asset, concurrent writers conflict, and there's no way to query individual rows.

Collections are a structured data table primitive. Same URL, many rows, typed columns. An agent publishes a collection, then appends rows over time as findings arrive.

## Design Decisions

### Separate `collection_row` table (not JSONB on asset)

**Chosen.** Collection rows live in their own table with a foreign key to `asset`.

Alternatives considered:
- **JSONB column on asset** — simple, but every row append rewrites the entire blob. No concurrent writes, no partial reads, no SQL-level queries. Breaks at ~1k rows.
- **Rows in asset_version** — versioning adds noise for a mutable data structure. Collections aren't documents; they're living tables.

A dedicated table gives us row-level concurrency, cursor-based pagination, native SQL access, and room for server-side filtering later.

### Schema stored in `metadata.schema` (not a separate column)

**Chosen.** The collection schema (column names, types, display order) lives in the asset's existing `metadata` JSONB under a `schema` key.

The asset table already has a flexible `metadata` column. Adding a separate `schema` column would mean another migration for something that fits naturally in metadata. The schema is small (tens of columns at most) and read with the asset, not queried independently.

### No versioning for collections

**Chosen.** Collections are mutable living tables. Row appends, updates, and deletes happen in place — no version history, no snapshots.

Document assets have versioning because each version is a distinct artifact worth preserving. Collections are different: the value is the current state of the table. Versioning every row change would generate enormous noise for marginal benefit.

### API routes under `/v0/assets/:id/rows`

**Chosen.** Collections are assets with `type: 'collection'`. Row operations are sub-resources of the asset.

This means no new top-level resource, no new auth model, no new sharing system. A collection inherits asset sharing, comments, thread linking — everything. The URL structure makes it clear: the asset is the collection, rows are its content.

### CLI/MCP naming: `asset_publish` for creation, `collection_*` for row ops

**Chosen.** Creating a collection uses the existing `asset_publish` tool with `type: 'collection'` and an optional `schema` parameter. Row operations get their own namespace: `collection_append`, `collection_rows`, `collection_update`, `collection_delete`.

This avoids cluttering the asset namespace with row-level operations while keeping creation unified. An agent that never uses collections never sees `collection_*` tools.

### Schema auto-expansion for unknown keys

**Chosen.** When a row includes a key not in the current schema, the schema expands automatically. New columns are appended with type `text` (the default). The agent can explicitly set types via the schema parameter if needed.

This removes friction for the common case: an agent starts appending rows and the schema emerges from the data. Strict schema enforcement can come later if needed.

### Row pagination (cursor-based)

**Chosen.** Row listing uses cursor-based pagination, consistent with the inbox and thread message endpoints. Default page size: 50 rows, max: 200.

Offset-based pagination breaks when rows are inserted or deleted between pages. Cursor-based is stable and already proven across the API.

## Data Model

### CollectionRow Entity

| Column | Type | Description |
|---|---|---|
| id | uuid PK | Row identifier |
| asset_id | uuid FK → asset | Parent collection |
| data | jsonb | Row values as `{ column: value }` |
| sort_key | integer | Insertion order, auto-incrementing per collection |
| created_at | timestamptz | When appended |
| updated_at | timestamptz | Last modified |

Index on `(asset_id, sort_key)` for paginated listing. Index on `(asset_id, created_at)` for cursor pagination.

### Schema Format

Stored in `asset.metadata.schema`:

```json
{
  "schema": [
    { "name": "company", "type": "text", "position": 0 },
    { "name": "revenue", "type": "number", "position": 1 },
    { "name": "url", "type": "url", "position": 2 },
    { "name": "action", "type": "enum", "position": 3, "values": ["ignore", "engage", "monitor"] },
    { "name": "notes", "type": "text", "position": 4 }
  ]
}
```

Enum columns include a `values` array of allowed values. Each column has `name`, `type`, and `position` (display order).

### Column Types

| Type | Stored as | Display | Operator control |
|---|---|---|---|
| `text` | string | Plain text | Text input |
| `number` | number | Formatted number | Number input |
| `url` | string (URL) | Clickable link (new tab) | Text input |
| `boolean` | boolean | Checkbox toggle | Tap to toggle |
| `date` | string (ISO 8601) | Formatted date | Date picker |
| `enum` | string | Select dropdown | Native `<select>` |

All types are stored in the JSONB `data` column. Types are display hints, not storage-level constraints.

### Loose Enforcement

The backend never rejects a row because a value doesn't match its column type. The frontend renders gracefully when types don't match:

- A non-URL in a `url` column renders as plain text (no link).
- A string in a `number` column renders as-is.
- An enum value not in `values` renders as plain text.
- A non-boolean in a `boolean` column renders as-is.

This keeps the agent side frictionless — just append data — while giving the frontend enough information to render smart controls when the data fits.

## API

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/v0/assets/:uuid/rows` | API key | Append rows (accepts array) |
| GET | `/v0/assets/:uuid/rows` | Public | List rows (cursor-paginated, sortable, filterable) |
| PUT | `/v0/assets/:uuid/rows/:rowId` | API key/cap | Update a row's data (partial merge) |
| DELETE | `/v0/assets/:uuid/rows` | API key/cap | Delete rows (by ID array in body) |

POST accepts `{ rows: [{ company: "Acme", revenue: 42 }, ...] }`. Returns created row IDs.

### Sorting

GET accepts `sort_by` and `sort_order` query params:

```
GET /v0/assets/:uuid/rows?sort_by=discovered_at&sort_order=desc
```

`sort_by` is a column key from the schema. `sort_order` is `asc` or `desc` (default `asc`). The backend translates to `ORDER BY data->>'key'` with appropriate casting for `number` and `date` types (chronological, not lexicographic). If `sort_by` is omitted, rows are ordered by `sort_key` (insertion order).

### Filtering

Basic equality filtering via dot-prefixed query params:

```
GET /v0/assets/:uuid/rows?filter.ignored=false&filter.action=engage
```

Multiple filters are ANDed. Values are compared against the JSONB `data` column. For `boolean` columns, `true`/`false` strings are cast appropriately. No `LIKE`, no `OR`, no range queries — just exact match.

Cursor pagination still works with sort and filter applied. The cursor encodes the current sort column value + row ID so pagination remains stable.

## Operator Editing

Operators edit cells inline. Edits save immediately — no batch save button.

- **Checkbox (boolean):** tap toggles the value, fires a PUT.
- **Select (enum):** pick an option, fires a PUT on change.
- **Text/number/date:** fires a PUT on blur.

Each edit is a single PUT to `/v0/assets/:uuid/rows/:rowId` with a partial merge. On failure, the cell shows an inline error indicator and reverts.

## Mobile

On viewports below 768px, the collection table scrolls horizontally. The first column in the schema is pinned (sticky) so the row identifier stays visible while scrolling right to reach toggles and dropdowns.

## CLI & MCP

Creating a collection uses `asset_publish` with `type: 'collection'` and an optional `schema` parameter. Row operations use the `collection_*` namespace.

**CLI sort/filter flags:**

```
tokenrip collection rows <uuid> --sort-by discovered_at --sort-order desc
tokenrip collection rows <uuid> --filter ignored=false --filter action=engage
```

`--filter` is repeatable; each instance is a `key=value` pair.

**MCP `collection_get_rows` parameters:**

```json
{
  "sort_by": "discovered_at",
  "sort_order": "desc",
  "filters": { "ignored": false }
}
```

`filters` is a flat object of key-value equality matches.

## What's Not in v1

- **Versioning** — no row-level or snapshot versioning
- **Google Sheets integration** — no import/export to spreadsheets
- **Advanced filtering** — no `LIKE`, `OR`, range queries, or full-text search
- **Column reorder/resize** — display order is schema order, column widths are automatic
- **Formulas** — no computed columns or cell formulas
- **Real-time collaboration** — no live updates via WebSocket; poll or re-fetch
- **Batch editing** — no multi-row save; each cell edit saves independently
