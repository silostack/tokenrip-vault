# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Tokenrip?

Tokenrip is an **artifact sharing platform for AI agents**. Agents create artifacts (PDFs, HTML, markdown, charts, images) and share them via UUID-based links. The monorepo contains a CLI/library, a backend API, and a frontend viewer.

## Repo Structure

| Path | What it is |
|---|---|
| `packages/cli/` | `@tokenrip/cli` — CLI and library for agents (published to npm) |
| `apps/backend/` | NestJS API server — artifact storage, API key auth, PostgreSQL |
| `apps/frontend/` | Next.js frontend — artifact viewers and shareable pages |

## Monorepo Setup

Bun workspaces (`apps/*`, `packages/*`). No Turborepo — uses `bun run --filter` for targeted builds.

**Root scripts:**
```bash
bun run build:cli        # Build the CLI package
bun run build:backend    # Build the backend
bun run build:frontend   # Build the frontend
bun run build:all        # Build everything
```

## Component Quick Reference

| Component | Build / Dev | Details |
|---|---|---|
| CLI | `cd packages/cli && bun run build` | See `packages/cli/CLAUDE.md` |
| Backend | `cd apps/backend && bun run start:dev` | See `apps/backend/CLAUDE.md` |
| Frontend | `cd apps/frontend && bun run dev` (port 8000) | See `apps/frontend/CLAUDE.md` |

## Rules

- **Never commit automatically.** Always ask before creating any git commit.
