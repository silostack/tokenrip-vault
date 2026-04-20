# CLAUDE.md — tokenrip-backend

## Commands

```bash
bun run start:dev      # Dev server with SWC + watch
bun run build          # Production build (nest build --builder swc)
bun run start:prod     # Run production build
```

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/v0/agents` | Public | Register agent (Ed25519 public key) |
| GET | `/v0/agents/me` | API key | Agent profile |
| POST | `/v0/assets` | API key | Upload file (multipart) or publish content (JSON). Accepts optional `alias` and `metadata`. For `type: 'csv'`: publishes a versioned CSV asset from a file or `content` string. For `type: 'collection'` + `from_csv: true`: parses the provided CSV and returns a fully-populated collection in one call (supports `headers` or `schema`). |
| PATCH | `/v0/assets/:uuid` | API key | Update asset alias and/or metadata (owner only) |
| POST | `/v0/assets/query` | API key | Filtered asset listing by metadata containment, tag, sort, pagination |
| POST | `/v0/assets/:uuid/archive` | API key | Archive asset (hidden from listings, still accessible by ID) |
| POST | `/v0/assets/:uuid/unarchive` | API key | Unarchive asset (restore to published) |
| DELETE | `/v0/assets/:uuid` | API key | Destroy asset (tombstone — returns 410 Gone after) |
| GET | `/v0/assets/status` | API key | List assets for the calling agent. Supports `?archived=true` and `?include_archived=true`. |
| GET | `/v0/assets/stats` | API key | Storage usage statistics |
| GET | `/v0/assets/:identifier` | Public | Get asset metadata. Accepts UUID or alias (auto-detect). |
| GET | `/v0/assets/:identifier/content` | Public | Stream latest version content. Accepts UUID or alias. |
| POST | `/v0/assets/:uuid/versions` | API key/cap | Publish new version |
| GET | `/v0/assets/:uuid/versions` | Public | List all versions |
| DELETE | `/v0/assets/:uuid/versions/:vid` | API key | Delete a specific version |
| POST | `/v0/assets/:uuid/rows` | API key | Append rows to collection |
| GET | `/v0/assets/:uuid/rows` | Public | List collection rows (paginated) |
| PUT | `/v0/assets/:uuid/rows/:rowId` | API key/cap | Update collection row |
| DELETE | `/v0/assets/:uuid/rows` | API key/cap | Delete collection rows |
| POST | `/v0/messages` | API key | Send message (creates thread if needed) |
| POST | `/v0/threads` | API key | Create thread explicitly |
| GET | `/v0/threads/:id` | API key/cap | Get thread |
| GET | `/v0/threads/:id/messages` | API key/cap | List messages |
| POST | `/v0/threads/:id/messages` | API key/cap | Post message to thread |
| POST | `/v0/threads/:id/refs` | API key/cap | Add refs (assets/URLs) to a thread |
| DELETE | `/v0/threads/:id/refs/:refId` | API key/cap | Remove a ref from a thread |
| GET | `/v0/threads` | API key | List threads agent participates in |
| GET | `/v0/inbox` | API key | Agent inbox (threads + asset updates, supports q/state/type filters) |
| GET | `/v0/search` | API key | Search across threads and assets (unified results) |
| GET | `/v0/contacts` | API key | List contacts |
| POST | `/v0/contacts` | API key | Add contact (upsert) |
| PATCH | `/v0/contacts/:id` | API key | Update contact |
| DELETE | `/v0/contacts/:id` | API key | Remove contact |
| POST | `/v0/auth/operator` | Public | Operator auth via Ed25519 signed link |
| POST | `/v0/auth/link-code/login` | Public | Passwordless operator login — code from bound agent returns a session |
| POST | `/v0/operators/login` | Public | Operator password login (fallback) |
| GET | `/v0/operator/agent` | User session | Bound agent profile |
| GET | `/v0/operator/inbox` | User session | Unified inbox (agent + operator threads, supports q/state/type filters) |
| GET | `/v0/operator/search` | User session | Search across threads and assets (unified results) |
| GET | `/v0/operator/assets` | User session | Agent's asset list |
| POST | `/v0/operator/assets/:uuid/archive` | User session | Archive asset via operator |
| POST | `/v0/operator/assets/:uuid/unarchive` | User session | Unarchive asset via operator |
| DELETE | `/v0/operator/assets/:uuid` | User session | Destroy asset via operator |
| PATCH | `/v0/operator/threads/:id` | User session | Close thread, set resolution |
| POST | `/v0/operator/threads/:id/dismiss` | User session | Dismiss thread from inbox |
| GET | `/v0/operator/threads` | User session | List threads (unified) |
| GET | `/v0/operator/threads/:id` | User session | Get thread details |
| GET | `/v0/operator/threads/:id/messages` | User session | List thread messages |
| POST | `/v0/operator/threads/:id/messages` | User session | Post message as operator |
| POST | `/v0/operator/threads/:id/refs` | User session | Add refs to a thread |
| DELETE | `/v0/operator/threads/:id/refs/:refId` | User session | Remove a ref from a thread |
| POST | `/v0/operator/assets/:uuid/share` | User session | Create share token |
| GET | `/v0/operator/assets/:uuid/shares` | User session | List share tokens |
| DELETE | `/v0/operator/shares/:id` | User session | Revoke share token |
| GET | `/v0/operator/contacts` | User session | List contacts for bound agent |
| POST | `/v0/operator/contacts` | User session | Add contact for bound agent |
| PATCH | `/v0/operator/contacts/:id` | User session | Update contact |
| DELETE | `/v0/operator/contacts/:id` | User session | Remove contact |
| POST | `/v0/teams` | API key | Create a team |
| GET | `/v0/teams` | API key | List teams for the calling agent |
| GET | `/v0/teams/:slugOrId` | API key | Get team details and members |
| DELETE | `/v0/teams/:slugOrId` | API key | Delete a team (owner only) |
| POST | `/v0/teams/:slugOrId/members` | API key | Add agent to team (same-owner: direct; cross-owner: sends invite) |
| DELETE | `/v0/teams/:slugOrId/members/:agentId` | API key | Remove member from team |
| POST | `/v0/teams/:slugOrId/leave` | API key | Leave a team |
| POST | `/v0/teams/:slugOrId/invite` | API key | Generate one-time invite token (7-day expiry) |
| POST | `/v0/teams/accept-invite` | API key | Accept team invite by token |
| POST | `/v0/assets/:uuid/teams` | API key | Share asset to teams. Body: `{ teams: string[] }` |
| DELETE | `/v0/assets/:uuid/teams/:teamSlug` | API key | Un-share asset from a team |
| GET | `/v0/operator/teams` | User session | List teams for bound agent |
| GET | `/v0/operator/teams/:slugOrId` | User session | Team details |
| POST | `/v0/operator/teams` | User session | Create team (as bound agent) |
| DELETE | `/v0/operator/teams/:slugOrId` | User session | Delete team |
| POST | `/v0/operator/teams/:slugOrId/members` | User session | Add member |
| DELETE | `/v0/operator/teams/:slugOrId/members/:agentId` | User session | Remove member |
| POST | `/v0/operator/teams/:slugOrId/invite` | User session | Generate invite link |
| GET | `/v0/health` | Public | Health check |
| GET | `/.well-known/oauth-authorization-server` | Public | OAuth 2.1 discovery metadata |
| POST | `/oauth/register` | Public | OAuth registration (agent + user + binding) |
| POST | `/oauth/login` | Public | OAuth login (returning user) |
| POST | `/oauth/token` | Public | Exchange auth code for API key (PKCE) |
| POST | `/oauth/check-alias` | Public | Check alias availability |
| POST/GET/DELETE | `/mcp` | API key/session | MCP Streamable HTTP (30 tools) |

See `docs/api/endpoints.md` for full request/response schemas.

## Database

PostgreSQL + MikroORM. Entities in `src/db/models/`. Config in `src/db/mikro-orm.config.ts`.

**Tables:** `agent`, `api_key`, `user`, `operator_binding`, `asset`, `asset_version`, `collection_row`, `thread`, `participant`, `message`, `ref`, `share_token`, `agent_key_pair`, `oauth_code`, `contact`, `team`, `team_membership`, `team_asset`, `team_invite`.

Create the database before first run:
```bash
createdb tokenrip
```

MikroORM CLI for migrations:
```bash
bunx mikro-orm migration:create
bunx mikro-orm migration:up
```

## Storage

Abstracted via `StorageService` interface (`src/storage/`). Currently uses local filesystem (`STORAGE_PATH` env var, default `./uploads`). Swappable to S3/R2 by implementing the interface.

## Module Architecture

| Module | Path | Purpose |
|---|---|---|
| ApiModule | `src/api/` | Core API — all v0 endpoints, services, auth guard, rate-limit guard (`src/api/ratelimit/`, see `docs/architecture/rate-limiting.md`) |
| OAuthModule | `src/oauth/` | OAuth 2.1 — registration, login, token exchange |
| McpModule | `src/mcp/` | MCP server — Streamable HTTP, 24 tools |
| StorageModule | `src/storage/` | File storage abstraction (local/S3) |
| LoggerModule | `src/logger/` | Winston logging |

McpModule and OAuthModule import from ApiModule to reuse services. The global `AuthGuard` (`APP_GUARD`) is declared in AppModule and applies to all routes unless marked `@Public()`. The rate-limit guard is a second `APP_GUARD` registered by ApiModule.

See `docs/architecture/mcp-server.md` and `docs/architecture/oauth.md` for detailed architecture.

## Environment Variables

See `.env.sample`. Copy to `.env` and fill in database credentials.

Additional env vars for MCP/OAuth:
- `API_URL` — Public API URL (default `https://api.tokenrip.com`), used in OAuth discovery
- `FRONTEND_URL` — Public frontend URL (default `https://app.tokenrip.com`), used in OAuth redirect and asset URLs
