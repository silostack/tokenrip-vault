# Changelog

Trail of features, fixes, and improvements — what was done and when.

---

## 2026-04-16 — Asset archiving

Added the ability to archive and unarchive assets. Archived assets are hidden from listings, searches, and the inbox by default but remain fully accessible by direct ID or alias. No data is deleted — versions, storage, threads, and shares are all preserved. Archiving is reversible.

**What changed:**
- Backend: `archiveAsset()` and `unarchiveAsset()` in asset service. All list/search/inbox queries now exclude archived assets by default, with `archived` and `includeArchived` filter params.
- API: `POST /v0/assets/:id/archive`, `POST /v0/assets/:id/unarchive`, plus operator equivalents. `?archived=true` and `?include_archived=true` query params on all listing/search endpoints.
- MCP: `asset_archive` and `asset_unarchive` tools. `archived`/`include_archived` params on `asset_list` and `search` tools.
- CLI: `rip asset archive <id>`, `rip asset unarchive <id>`. `--archived` and `--include-archived` flags on `asset list` and `search`.
- Frontend: Archive/Unarchive button on asset detail page. Active/Archived/All filter tabs on asset list. Archived badge and muted styling.
- Docs: Updated internal API reference, public concept docs, CLI reference, SKILL.md, AGENTS.md, README.md. Created API reference pages for archive/unarchive.
