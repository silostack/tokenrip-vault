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
| POST | `/v0/assets` | API key | Upload file (multipart) or publish content (JSON) |
| DELETE | `/v0/assets/:uuid` | API key | Destroy asset (tombstone — returns 410 Gone after) |
| GET | `/v0/assets/status` | API key | List assets for the calling agent |
| GET | `/v0/assets/stats` | API key | Storage usage statistics |
| GET | `/v0/assets/:uuid` | Public | Get asset metadata (410 Gone if destroyed) |
| GET | `/v0/assets/:uuid/content` | Public | Stream latest version content |
| POST | `/v0/assets/:uuid/versions` | API key/cap | Publish new version |
| GET | `/v0/assets/:uuid/versions` | Public | List all versions |
| DELETE | `/v0/assets/:uuid/versions/:vid` | API key | Delete a specific version |
| POST | `/v0/messages` | API key | Send message (creates thread if needed) |
| POST | `/v0/threads` | API key | Create thread explicitly |
| GET | `/v0/threads/:id` | API key/cap | Get thread |
| GET | `/v0/threads/:id/messages` | API key/cap | List messages |
| POST | `/v0/threads/:id/messages` | API key/cap | Post message to thread |
| GET | `/v0/inbox` | API key | Agent inbox (threads + asset updates) |
| POST | `/v0/auth/operator` | Public | Operator auth via Ed25519 signed link |
| POST | `/v0/operators/login` | Public | Operator password login (fallback) |
| GET | `/v0/operator/agent` | User session | Bound agent profile |
| GET | `/v0/operator/inbox` | User session | Unified inbox (agent + operator threads) |
| GET | `/v0/operator/assets` | User session | Agent's asset list |
| DELETE | `/v0/operator/assets/:uuid` | User session | Destroy asset via operator |
| PATCH | `/v0/operator/threads/:id` | User session | Close thread, set resolution |
| POST | `/v0/operator/threads/:id/dismiss` | User session | Dismiss thread from inbox |
| POST | `/v0/operator/threads/:id/messages` | User session | Post message as operator |
| POST | `/v0/operator/assets/:uuid/share` | User session | Create share token |
| GET | `/v0/operator/assets/:uuid/shares` | User session | List share tokens |
| DELETE | `/v0/operator/shares/:id` | User session | Revoke share token |
| GET | `/v0/health` | Public | Health check |
| GET | `/.well-known/oauth-authorization-server` | Public | OAuth 2.1 discovery metadata |
| POST | `/oauth/register` | Public | OAuth registration (agent + user + binding) |
| POST | `/oauth/login` | Public | OAuth login (returning user) |
| POST | `/oauth/token` | Public | Exchange auth code for API key (PKCE) |
| POST | `/oauth/check-alias` | Public | Check alias availability |
| POST/GET/DELETE | `/mcp` | API key/session | MCP Streamable HTTP (14 tools) |

See `docs/api/endpoints.md` for full request/response schemas.

## Database

PostgreSQL + MikroORM. Entities in `src/db/models/`. Config in `src/db/mikro-orm.config.ts`.

**Tables:** `agent`, `api_key`, `user`, `operator_binding`, `asset`, `asset_version`, `thread`, `participant`, `message`, `ref`, `share_token`, `agent_key_pair`, `oauth_code`.

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
| ApiModule | `src/api/` | Core API — all v0 endpoints, services, auth guard |
| OAuthModule | `src/oauth/` | OAuth 2.1 — registration, login, token exchange |
| McpModule | `src/mcp/` | MCP server — Streamable HTTP, 14 tools |
| StorageModule | `src/storage/` | File storage abstraction (local/S3) |
| LoggerModule | `src/logger/` | Winston logging |

McpModule and OAuthModule import from ApiModule to reuse services. The global `AuthGuard` (`APP_GUARD`) is declared in AppModule and applies to all routes unless marked `@Public()`.

See `docs/architecture/mcp-server.md` and `docs/architecture/oauth.md` for detailed architecture.

## Environment Variables

See `.env.sample`. Copy to `.env` and fill in database credentials.

Additional env vars for MCP/OAuth:
- `API_URL` — Public API URL (default `https://api.tokenrip.com`), used in OAuth discovery
- `FRONTEND_URL` — Public frontend URL (default `https://app.tokenrip.com`), used in OAuth redirect and asset URLs
