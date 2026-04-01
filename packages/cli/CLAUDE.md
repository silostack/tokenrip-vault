# CLAUDE.md — @tokenrip/cli

## Commands

```bash
bun run build    # Dual ESM + CJS build
bun run dev      # Watch mode (ESM only)
bun run clean    # Remove dist/
```

## Build

Dual output mirroring the silkyway SDK pattern:
- `tsc` → ESM in `dist/`
- `tsc -p tsconfig.cjs.json` → CJS in `dist/cjs/` (excludes `cli.ts`)
- CJS directory gets a `package.json` with `{"type":"commonjs"}`

The CLI entry (`src/cli.ts`) is ESM-only with a `#!/usr/bin/env node` shebang.

## Structure

- `src/cli.ts` — Commander entry point (bin: `tokenrip`), command groups: `asset`, `auth`, `config`
- `src/index.ts` — Library barrel export
- `src/config.ts` — Config stored at `~/.config/tokenrip/config.json`
- `src/client.ts` — Axios HTTP client with auth header
- `src/formatters.ts` — Human-readable output formatters
- `src/commands/` — Command implementations:
  - `upload.ts` — `tokenrip asset upload`
  - `publish.ts` — `tokenrip asset publish`
  - `update.ts` — `tokenrip asset update` (new version)
  - `delete.ts` — `tokenrip asset delete`
  - `delete-version.ts` — `tokenrip asset delete-version`
  - `status.ts` — `tokenrip asset list`
  - `stats.ts` — `tokenrip asset stats`
  - `auth.ts` — `tokenrip auth create-key`
  - `config.ts` — `tokenrip config set-key`, `tokenrip config set-url`

## Publishing

Published to npm as `@tokenrip/cli` with `publishConfig.access: "public"`. Public install instructions use `npm install -g @tokenrip/cli`.
