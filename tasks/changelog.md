# Changelog

Trail of features, fixes, and improvements — what was done and when.

---

## 2026-04-16 — Operator login entry point

New `/login` route gives signed-out browser visitors a discoverable way into the operator dashboard. Short-code input is primary — paste → auto-verify → branch into passwordless login (bound agent), registration (unbound agent), or agent-binding (logged-in user with a new agent). Password login available behind a toggle. New `POST /v0/auth/link-code/login` endpoint mints a session when a fresh short code comes from an already-bound agent — handles the "lost password AND lost signed link" recovery case. Existing `/link` URL now 307s to `/login` so printed CLI output keeps working.

**What changed:**
- Backend: New `POST /v0/auth/link-code/login` endpoint + `LinkCodeService.loginWithCode()` method (`@Transactional()`, binding check runs before `used=true` so `NO_BINDING` leaves the code consumable by `/register`). Error shape follows the existing convention (`401 INVALID_CODE`, `409 NO_BINDING`, `400 MISSING_FIELD`). 4 new integration tests.
- Frontend: New `/login` route with state machine (idle / verifying / register / bind-confirm / password), short-code-first UX with `- - - - - -` placeholder and auto-verify on 6 digits, password fallback behind a toggle, `role="alert"` error banner, entrance animation reusing `md-enter`. `sanitizeNext` helper guards `?next=` against open redirects. Pre-auth `beforeLoad` redirect bounces already-logged-in users. Header "Log in" link (hidden on `/s/*`, `/operator`, `/login`). Homepage CTA "Open dashboard →" next to GitHub link. Fixed TanStack Router numeric-code search param bug — numeric codes like `?code=123456` were parsed as numbers by the default search parser and silently dropped by the `typeof === 'string'` guard; now accepts string OR number.
- Cleanup: Removed legacy `LinkPage.tsx` (replaced by `LoginPage.tsx`); converted `/link` route to a `beforeLoad` redirect to `/login` (preserves the `?code=` param).
- Test harness: Added `FRONTEND_URL`/`API_URL` defaults in `tests/setup/env.ts` to unblock integration tests after `ref.service.ts` started reading those env vars at module load (tracked as a production follow-up to give `ref.service.ts` the same default-fallback treatment its siblings have).

## 2026-04-16 — CSV asset type

Added `AssetType.CSV` — a versioned CSV file rendered as a table in the dashboard. CSV assets reuse the existing content-asset storage path (same versioning, same `GET /content`), are distinct from collections (no row-level API, snapshot-oriented instead of living), and gain a one-shot CSV → collection import path for agents who want row-level semantics going forward. No new CLI command group — everything flows through `rip asset publish`.

**What changed:**
- Backend: Added `AssetType.CSV = 'csv'` with `text/csv` mime. New `AssetService.createCollectionFromCsv()` parses CSV and creates a populated collection (schema + rows) in one transaction. Row staggering by 1ms preserves CSV row order in `GET /rows`. New `csv-parser.ts` — inline RFC-4180-ish parser (quoted fields, embedded newlines, CRLF). Migration drops any stale `asset_type_check` constraint.
- API: `POST /v0/assets` now accepts `type: 'csv'` (content or multipart file). Same endpoint accepts `type: 'collection'` + `from_csv: true` + CSV payload to one-shot an import, with `headers` or `schema` for column names. Schema-source rules: `--schema` OR `--headers` (both is `SCHEMA_AND_HEADERS_CONFLICT`). All other CSV ops (update, download, versions) flow through existing generic asset endpoints unchanged. Controller refactored with `isTruthyFlag`, `parseJsonField`, `provenanceFrom` helpers.
- MCP: `asset_publish` tool accepts `csv` in its type enum. New `collection_create_from_csv` tool for the one-shot import.
- CLI: `rip asset publish` gained `--headers` and `--from-csv` flags (and `--alias`). Type help text and README type list now include `csv`. `rip collection` commands stay collection-only — CSV assets have no rows.
- Tests: New `tests/backend/csv-parser.test.ts` (11 unit tests covering quoted fields, CRLF, embedded newlines, schema/headers/conflict). New `tests/integration/csv.test.ts` (11 integration tests — JSON publish, multipart upload, versioning, row-op rejection, CSV → collection with all schema modes, provenance, backwards compat). 52 existing tests still green.
- Docs: New `docs/design/csv-assets.md` (design rationale, why CSV and Collection stay separate). Updated `apps/backend/CLAUDE.md` endpoint row. New public `public-docs/concepts/csv.mdx` with CSV-vs-collection comparison table, added to `docs.json` nav. Updated `public-docs/concepts/assets.mdx`, `public-docs/concepts/collections.mdx`, `public-docs/cli/assets.mdx`, `public-docs/cli/collections.mdx`. Updated `packages/cli/README.md`, `SKILL.md`, `AGENTS.md` with CSV type, `--from-csv` examples, and when-to-pick guidance.

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
