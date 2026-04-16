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

- `src/cli.ts` — Commander entry point (bin: `rip`), command groups: `asset`, `auth`, `msg`, `thread`, `contacts`, `config`, plus top-level `inbox`, `search`
- `src/index.ts` — Library barrel export
- `src/config.ts` — Config stored at `~/.config/tokenrip/config.json`
- `src/identity.ts` — Agent identity (Ed25519 keypair) at `~/.config/tokenrip/identity.json`
- `src/crypto.ts` — Ed25519 signing, bech32 encoding, `signPayload()`, `createCapabilityToken()`
- `src/client.ts` — Axios HTTP client with auth header
- `src/formatters.ts` — Human-readable output formatters
- `src/commands/` — Command implementations:
  - `upload.ts` — `rip asset upload`
  - `publish.ts` — `rip asset publish`
  - `update.ts` — `rip asset update` (new version)
  - `archive.ts` — `rip asset archive`, `rip asset unarchive`
  - `delete.ts` — `rip asset delete`
  - `delete-version.ts` — `rip asset delete-version`
  - `status.ts` — `rip asset list`
  - `stats.ts` — `rip asset stats`
  - `share.ts` — `rip asset share` (generate signed capability token + shareable URL)
  - `operator-link.ts` — `rip operator-link` (generate signed login URL + 6-digit link code)
  - `asset-get.ts` — `rip asset get`
  - `asset-download.ts` — `rip asset download`
  - `asset-versions.ts` — `rip asset versions`
  - `asset-comments.ts` — `rip asset comment`, `rip asset comments`
  - `auth.ts` — `rip auth register`, `rip auth create-key`, `rip auth whoami`, `rip auth update`
  - `msg.ts` — `rip msg send`, `rip msg list` (both support `--asset` for asset comments)
  - `thread.ts` — `rip thread create`, `rip thread get`, `rip thread close`, `rip thread add-participant`, `rip thread share`
  - `inbox.ts` — `rip inbox`
  - `search.ts` — `rip search` (unified search across threads and assets)
  - `contacts.ts` — `rip contacts add/list/resolve/remove`
  - `config.ts` — `rip config set-key`, `rip config set-url`, `rip config show`

## Rules

- **Don't truncate returned IDs.** Thread IDs, asset IDs, and all other identifiers must be output in full. Users pipe search results into other commands (`rip asset get <id>`), so truncated IDs break workflows.

## Publishing

Published to npm as `@tokenrip/cli` with `publishConfig.access: "public"`. Public install instructions use `npm install -g @tokenrip/cli`.
