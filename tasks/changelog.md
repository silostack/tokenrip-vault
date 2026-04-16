# Changelog

Trail of features, fixes, and improvements — what was done and when.

---

## 2026-04-16 — Unified agent identity (CLI + MCP)

Fixed the OAuth duplicate agent bug and established a unified identity model: Agent IS the account. CLI and MCP are different access methods (API keys) for the same agent identity. When a CLI user connects to MCP, the OAuth flow now reuses the existing agent instead of creating a second one. Added `rip auth link` for MCP-first users to add CLI access. Redesigned the OAuth authorize page for clarity.

**What changed:**
- Backend: Rewrote `login()`, `linkAgent()`, `exchangeCode()` in `oauth.service.ts`. Replaced `findOrCreateServerAgent()` with `findBoundAgent()` — never creates duplicate agents. `exchangeCode()` now issues `mcp-oauth`-named keys without revoking CLI keys. Added `revokeKeysByName()` to `auth.service.ts`. Added `POST /oauth/cli-link` endpoint for downloading server-side keypair to CLI. Token response now includes `expires_in: 31536000`.
- MCP: Session TTL changed from 30 minutes to 7-day sliding window (resets on every request). Cleanup sweep hourly instead of every 5 minutes.
- CLI: New `rip auth link --alias <user> --password <pass>` command downloads keypair from server for MCP-first users. Wired up in `cli.ts` under the `auth` command group.
- Frontend: Redesigned OAuth authorize page — register tab reordered (username first, required), login tab adds context text, link tab updated `tokenrip` → `rip` and adds explanatory text. Same reordering applied to `LinkPage.tsx`.
- Docs: Updated `docs/architecture/agent-identity.md`, `docs/architecture/mcp-server.md`, `docs/architecture/oauth.md`, `docs/design/agent-identity.md`. Added "Using CLI and MCP Together" section to `public-docs/concepts/agent-identity.mdx`. Updated CLI README, SKILL.md, and AGENTS.md with `rip auth link` and interop docs.

## 2026-04-16 — Asset archiving

Added the ability to archive and unarchive assets. Archived assets are hidden from listings, searches, and the inbox by default but remain fully accessible by direct ID or alias. No data is deleted — versions, storage, threads, and shares are all preserved. Archiving is reversible.

**What changed:**
- Backend: `archiveAsset()` and `unarchiveAsset()` in asset service. All list/search/inbox queries now exclude archived assets by default, with `archived` and `includeArchived` filter params.
- API: `POST /v0/assets/:id/archive`, `POST /v0/assets/:id/unarchive`, plus operator equivalents. `?archived=true` and `?include_archived=true` query params on all listing/search endpoints.
- MCP: `asset_archive` and `asset_unarchive` tools. `archived`/`include_archived` params on `asset_list` and `search` tools.
- CLI: `rip asset archive <id>`, `rip asset unarchive <id>`. `--archived` and `--include-archived` flags on `asset list` and `search`.
- Frontend: Archive/Unarchive button on asset detail page. Active/Archived/All filter tabs on asset list. Archived badge and muted styling.
- Docs: Updated internal API reference, public concept docs, CLI reference, SKILL.md, AGENTS.md, README.md. Created API reference pages for archive/unarchive.
