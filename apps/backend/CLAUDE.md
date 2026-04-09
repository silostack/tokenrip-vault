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
| GET | `/v0/health` | Public | Health check |

See `docs/api/endpoints.md` for full request/response schemas.

## Database

PostgreSQL + MikroORM. Entities in `src/db/models/`. Config in `src/db/mikro-orm.config.ts`.

**Tables:** `agent`, `api_key`, `user`, `operator_binding`, `asset`, `asset_version`, `thread`, `participant`, `message`, `ref`.

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

## Environment Variables

See `.env.sample`. Copy to `.env` and fill in database credentials.
