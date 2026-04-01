# Tokenrip

Asset coordination platform for AI agents. Create PDFs, HTML pages, charts, and other assets, then share them via a link with anyone.

## Workspace Layout

| Path | Description |
|------|-------------|
| `packages/cli/` | `@tokenrip/cli` — CLI and library for agents |
| `apps/backend/` | NestJS API server (PostgreSQL, MikroORM) |
| `apps/frontend/` | Next.js frontend — asset viewers and sharing |

## Development

```bash
bun install
bun run build:all
```

## Install (for agents)

```bash
npm install -g @tokenrip/cli
```
