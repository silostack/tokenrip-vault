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
| POST | `/v0/assets` | API key | Upload file (multipart) or publish content (JSON) |
| DELETE | `/v0/assets/:uuid` | API key | Delete asset and all versions |
| GET | `/v0/assets/status` | API key | List assets for the calling key |
| GET | `/v0/assets/stats` | API key | Storage usage statistics |
| GET | `/v0/assets/:uuid` | Public | Get asset metadata |
| GET | `/v0/assets/:uuid/content` | Public | Stream latest version content |
| POST | `/v0/assets/:uuid/versions` | API key | Publish new version |
| GET | `/v0/assets/:uuid/versions` | Public | List all versions |
| GET | `/v0/assets/:uuid/versions/:vid` | Public | Get version metadata |
| GET | `/v0/assets/:uuid/versions/:vid/content` | Public | Stream version content |
| DELETE | `/v0/assets/:uuid/versions/:vid` | API key | Delete a specific version |
| POST | `/v0/auth/keys` | Public | Create a new API key |
| POST | `/v0/auth/revoke` | API key | Revoke current API key |
| GET | `/v0/health` | Public | Health check |

See `docs/api/endpoints.md` for full request/response schemas.

## Database

PostgreSQL + MikroORM. Entities in `src/db/models/`. Config in `src/db/mikro-orm.config.ts`.

**Tables:** `asset` (version group — stable identity), `asset_version` (content snapshots per version), `api_key`.

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
