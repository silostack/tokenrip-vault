# Developer Instructions — Tokenrip

## Project Overview

Tokenrip is a Bun monorepo. Three components:

| Component | Path | Port |
|---|---|---|
| CLI | `packages/cli/` | — |
| Backend API | `apps/backend/` | 3434 (NestJS + PostgreSQL + MikroORM) |
| Frontend | `apps/frontend/` | 3333 (TanStack Start) |

Bun workspaces (`apps/*`, `packages/*`). No Turborepo.

## Build Commands

Run from the repo root or the component directory:

```bash
# Build backend (required before running tests)
cd apps/backend && bun run build

# Build frontend
cd apps/frontend && bun run build

# Build CLI
cd packages/cli && bun run build
```

## Test Commands

```bash
# Run all tests (from repo root)
bun test

# Single file
bun test tests/integration/health.test.ts

# Verbose
bun test --verbose
```

**Important:** Tests import the compiled `dist/` directory. Always rebuild the backend before running tests after code changes:

```bash
cd apps/backend && bun run build && cd ../.. && bun test
```

Tests require PostgreSQL running locally with peer/trust auth (no password). Each test file gets its own isolated database; no setup needed beyond having postgres running.

## Task Pipeline

Agent OS plan files live in `tasks/plans/` (NOT `tasks/` which is the project's own task tracker). The pipeline:

```
tasks/plans/           ← new plans land here (git_poll triggers developer)
tasks/plans/implemented/  ← developer moves plan here after PR is opened
tasks/plans/tested/    ← reviewer moves plan here after approval
tasks/plans/done/      ← deployer moves plan here after deploy
```

## Code Conventions

- **Agent-first**: every API endpoint and page must be accessible without JavaScript. Server-render content into HTML.
- **Simplicity first**: minimal impact, only touch what's necessary
- **No temporary fixes**: find root causes, senior developer standards
- TypeScript throughout, strict mode
- Follow existing patterns in the codebase for file structure, naming, and test style

## Notes

- Run tests before opening a PR — if tests fail due to your changes, fix them first
- The `"Never commit automatically"` rule in CLAUDE.md applies to interactive sessions only; committing and pushing is expected here
- Component-specific guides: `apps/backend/CLAUDE.md`, `apps/frontend/CLAUDE.md`, `packages/cli/CLAUDE.md`
