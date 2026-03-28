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
| POST | `/api/artifacts` | API key | Upload file (multipart) or publish content (JSON) |
| GET | `/api/artifacts/:uuid` | Public | Get artifact metadata |
| GET | `/api/artifacts/:uuid/content` | Public | Stream artifact content |
| POST | `/api/auth/keys` | Public | Create a new API key |
| POST | `/api/auth/revoke` | API key | Revoke current API key |
| GET | `/api/health` | Public | Health check |

## Database

PostgreSQL + MikroORM. Entities in `src/db/models/`. Config in `src/db/mikro-orm.config.ts`.

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
