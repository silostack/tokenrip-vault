# Tokenrip Collections — Structured Data Tables for Agents

**Status**: Spec (ready for implementation)
**Created**: 2026-04-14
**Owner**: Simon

## What This Is

Collections are a new asset type for structured, tabular data. Where a standard asset is a document (markdown, HTML, code), a collection is a table — rows and columns of structured data that agents append to and humans review.

**The core use case:** Agents go out, research a topic, and accumulate structured findings into a living table. Humans review, filter, sort, and lightly edit. When the table outgrows the lightweight UI, export to Google Sheets for heavy lifting.

## Design Principles

- **Collection is an asset.** Same URL scheme, sharing model, comments, and permissions as any other Tokenrip asset. No new auth model, no new primitives.
- **Agents write, humans curate.** Agents do the heavy lifting (appending rows via API). Humans do light editing (fixing a typo, updating a status, deleting junk rows). Not a spreadsheet — a data table.
- **Schema-first, flexible-second.** Agent declares columns upfront so the table renders cleanly from the start. If a row arrives with an extra key, the schema expands gracefully rather than rejecting it.
- **No versioning in v1.** Collections are mutable, living tables. Versioning every cell edit or row append generates noise. If you need a snapshot, export.

## Data Model

A collection is an asset with `type: "collection"`. Stored as a single JSONB column on the asset record — no separate tables.

```
Collection (asset)
├── schema: ordered array of column definitions
│   └── { name, type (text|number|date|url|enum), position }
│       └── enum columns include: values (array of allowed values)
├── rows: array of row objects
│   └── { id (uuid), data: { [column]: value }, created_by, created_at, updated_at }
└── metadata: standard asset metadata (title, description, tags)
```

**Schema expansion:** If an agent publishes a row with a key not in the schema, the column is appended automatically with type `text` as default.

**Row identity:** Every row gets a UUID on creation. Agents can update specific rows by ID. No upsert-by-key — row IDs are the universal identifier.

**Scaling note:** JSONB storage works until collections reach thousands of rows. That's the signal to migrate to a relational model. Not before.

## API

Four operations, scoped under the existing asset namespace:

### Create a collection

```
POST /publish
{
  "type": "collection",
  "title": "Moltbook Research",
  "schema": [
    { "name": "company", "type": "text" },
    { "name": "signal", "type": "text" },
    { "name": "relevance", "type": "enum", "values": ["high", "medium", "low"] },
    { "name": "source", "type": "url" },
    { "name": "date", "type": "date" }
  ]
}
→ returns asset URL + collection ID
```

### Append rows

```
POST /collections/:id/rows
{
  "data": {
    "company": "Moltbook",
    "signal": "Agent identity API — JWT-based, returns karma + owner X handle",
    "relevance": "high",
    "source": "https://moltbook.com",
    "date": "2026-04-14"
  }
}
→ returns row ID
```

Also accepts an array of row objects for batch append.

### Update a row

```
PUT /collections/:id/rows/:rowId
{
  "data": { "relevance": "medium" }
}
→ partial update, merges with existing row data
```

### Delete rows (bulk)

```
DELETE /collections/:id/rows
{
  "row_ids": ["uuid1", "uuid2"]
}
→ bulk delete
```

**Reading:** The existing `GET /:id` endpoint returns the full collection (schema + rows) when the asset type is `collection`. Filtering and sorting happen client-side in v1 — the dataset size doesn't justify server-side query support yet.

## Frontend Rendering

When `GET /:id` returns an asset with `type: "collection"`, the frontend renders a table view.

### Component

TanStack Table (headless, small bundle, no imposed UI opinions). Not AG Grid — too heavy, too opinionated for v1.

### Controls

| Control | Behavior |
|---------|----------|
| **Sort** | Click column header to cycle asc/desc/none. Arrow icon indicates active sort. |
| **Filter** | Input below each column header. Text columns: substring match. Enum columns: dropdown. Number/date: basic comparators. All client-side. |
| **Inline edit** | Click a cell to edit. Blur or Enter saves. Fires `PUT /collections/:id/rows/:rowId` with the changed field. No save button, no modal. |
| **Row selection** | Checkbox column on left. "Select all" in header. Selected rows enable toolbar with "Delete selected" and "Export selected." |
| **Export** | Toolbar button. Full collection or selected rows. CSV or JSON. Client-side file generation, no server round-trip. |

### What it doesn't do

No formulas. No cell formatting. No column reorder. No frozen columns. No pivot tables. No column resize. It's a data table, not a spreadsheet.

## Agent Workflow Example

**Scenario:** Simon wants Hermes and OpenClaw to research Moltbook for Tokenrip-relevant signals.

**1. Setup (once)**
Simon tells Hermes: "Create a collection for Moltbook research." Hermes calls `POST /publish` with the schema. Simon gets back a collection URL.

**2. Research loop (ongoing)**
Hermes and OpenClaw independently research Moltbook. When they find a signal, they call `POST /collections/:id/rows`. Each row captures who found it (`created_by` is the agent's identity). Multiple agents append concurrently — no conflicts because rows are independent.

**3. Review (human)**
Simon opens the collection URL. Sorts by relevance. Filters by date. Edits a cell to downgrade a signal's relevance. Deletes junk rows via bulk select.

**4. Escalation**
Simon hits "Export CSV", opens in Google Sheets for pivot tables, charts, or sharing with Alek. The collection URL remains the living source — exports are snapshots.

**Key property:** The agent never needs to know about the frontend. It appends rows via API. Rendering, filtering, sorting, editing — all frontend concerns the agent is unaware of.

## What's Not in V1

- **Versioning** — Collections are mutable. No version history per cell or per collection.
- **Google Sheets integration** — Export to CSV covers the "heavy lifting" handoff. Direct Sheets sync is a later feature.
- **Server-side filtering/sorting/pagination** — Client-side is sufficient until collections reach scale.
- **Column reorder, resize, hide** — Not needed for the research use case.
- **Formulas or computed columns** — This is a data table, not a spreadsheet.
- **Real-time collaboration** — No live cursors or multi-user editing. Concurrent agent writes are safe (append-only from agents); human edits are single-user.

## Relationship to Other Primitives

- **Assets:** A collection IS an asset. Comments, sharing, and permissions work automatically.
- **Workspaces:** Workspaces organize assets (including collections) into curated sets. A workspace is a grab bag; a collection is structured data.
- **Threads:** A thread can reference a collection (e.g., "let's discuss the Moltbook findings"). Independent but composable.

## Future Directions (Not Scoped)

- **Google Sheets export** — One-click create a Sheet from collection data.
- **Computed columns** — Columns whose values are derived (e.g., "days since last update").
- **Views** — Saved filter/sort configurations on a collection.
- **Server-side query** — When collections grow large enough to warrant it.
- **Collection-to-collection references** — A row in one collection linking to a row in another.
