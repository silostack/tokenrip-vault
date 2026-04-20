# Local Team Cache & Aliasing

**Purpose**: Cache team metadata locally in the CLI so users can reference teams by short aliases without remembering slugs or hitting the network.

---

## Problem

Teams are server-only. Every `--team` flag requires knowing the exact slug. Users who belong to multiple teams can't set short aliases, and offline/fast resolution isn't possible without a local cache.

## Core Decisions

- **JSON format** (`teams.json`) matching the existing `contacts.json` pattern
- **Slug is the primary key**, alias is an optional overlay
- **Hybrid sync** — auto on `rip team list`, explicit via `rip team sync`
- **Resolution everywhere** — single `resolveTeam()` used by all commands accepting `--team`
- **No backend changes** — purely CLI-layer convenience

## Data Shape

File: `~/.config/tokenrip/teams.json` (or `$TOKENRIP_CONFIG_DIR/teams.json`)

```json
{
  "rebelfi": {
    "id": "uuid-here",
    "name": "RebelFi",
    "slug": "rebelfi",
    "alias": "rf",
    "role": "owner",
    "syncedAt": "2026-04-20T12:00:00Z"
  },
  "simon-agents": {
    "id": "uuid-here",
    "name": "Simon's Agents",
    "slug": "simon-agents",
    "role": "member",
    "syncedAt": "2026-04-20T12:00:00Z"
  }
}
```

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Team's server ID |
| `name` | string | Display name |
| `slug` | string | URL-safe identifier (matches key) |
| `alias` | string? | User-defined short name |
| `role` | `"owner"` \| `"member"` | For local display |
| `syncedAt` | ISO timestamp | When this entry was last refreshed |

## Resolution Chain

```
resolveTeam(input):
  1. Check aliases across all entries → return matching slug
  2. Check slugs (direct key lookup) → return slug
  3. Pass through to server (fallback for unknown/new teams)
```

`resolveTeam()` returns the **slug** (not UUID) since the API accepts slugs everywhere. The local file translates alias→slug only.

## Sync Behavior

| Trigger | Behavior |
|---|---|
| `rip team list` | Auto-sync: writes server response to `teams.json`, preserves existing aliases |
| `rip team sync` | Explicit refresh without list output |
| `rip team create` | Writes new team to local file immediately |
| `rip team accept-invite` | Writes new team to local file immediately |
| `rip team delete` | Removes entry from local file |
| `rip team leave` | Removes entry from local file |

No hard expiry. Unresolved values pass through to the server.

## CLI Commands

New subcommands:

```
rip team alias <slug> <alias>    # Set short alias
rip team unalias <slug>          # Remove alias
rip team sync                    # Force refresh from server
```

`rip team list` shows aliases inline when set.

## Integration

Every command accepting `--team` uses `resolveTeam()` / `resolveTeams()`:

```
rip inbox --team rf
rip asset publish --team rf,sa
rip thread create --team rf
rip asset upload file.md --team rf
```

Comma-separated values are resolved independently.

## Implementation Scope

| File | Change |
|---|---|
| `packages/cli/src/teams.ts` (new) | `loadTeams`, `saveTeams`, `resolveTeam`, `resolveTeams`, `setAlias`, `removeAlias`, `syncTeamsFromResponse` |
| `packages/cli/src/commands/team.ts` | Wire sync into `list`, `create`, `accept-invite`, `delete`, `leave`; add `alias`/`unalias`/`sync` subcommands |
| `packages/cli/src/commands/inbox.ts` | Use `resolveTeam()` for `--team` flag |
| `packages/cli/src/commands/thread.ts` | Use `resolveTeam()` for `--team` flag |
| `packages/cli/src/commands/asset.ts` | Use `resolveTeams()` for `--team` flag |
| `packages/cli/src/index.ts` | Export new functions/types |

No backend changes. No new API endpoints.
