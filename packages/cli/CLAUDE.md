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

- `src/cli.ts` — Commander entry point (bin: `tokenrip`)
- `src/index.ts` — Library barrel export
- `src/config.ts` — Config stored at `~/.config/tokenrip/config.json`
- `src/client.ts` — Axios HTTP client with auth header
- `src/commands/` — CLI command implementations (config, upload, publish)

## Publishing

Published to npm as `@tokenrip/cli` with `publishConfig.access: "public"`. Public install instructions use `npm install -g @tokenrip/cli`.
