# CLI–API Parity: Asset Read, Thread Management, and Profile Update

Closes the gap between backend API endpoints and CLI commands. Adds 11 new CLI commands and 1 backend change.

## Background

An audit of the backend API surface vs CLI commands revealed that all *write* operations (upload, publish, delete, send message, create thread) have CLI counterparts, but most *read* operations and several management operations do not. This design adds the missing commands.

## New CLI Commands

### Asset Read

#### `asset get <uuid>`

Fetch metadata for any asset by its public ID.

- Endpoint: `GET /v0/assets/:publicId` (public, no auth required)
- Output: JSON to stdout
- Fields: id, title, description, type, mimeType, metadata, parentAssetId, creatorContext, inputReferences, versionCount, currentVersionId, createdAt

```
tokenrip asset get 550e8400-e29b-41d4-a716-446655440000
```

#### `asset download <uuid>`

Download an asset's content to a local file.

- Endpoint: `GET /v0/assets/:publicId/content` (public)
- Default filename: `<uuid>.<ext>` in current directory (ext derived from response mimeType)
- `--output <path>` — override destination file path
- `--version <versionId>` — download a specific version via `GET /v0/assets/:publicId/versions/:versionId/content`
- Streams to disk (no full buffering)

```
tokenrip asset download 550e8400-... --output ./report.pdf
tokenrip asset download 550e8400-... --version abc123
```

#### `asset versions <uuid>`

List all versions of an asset.

- Endpoint: `GET /v0/assets/:publicId/versions` (public)
- Output: JSON array (id, version, label, sizeBytes, mimeType, createdAt)
- `--version <versionId>` — get a single version's metadata via `GET /v0/assets/:publicId/versions/:versionId`

```
tokenrip asset versions 550e8400-...
```

### Asset Messaging

Comments on assets, accessible from both the `asset` and `msg` command groups.

#### `asset comment <uuid> <message>`

Post a comment on an asset.

- Endpoint: `POST /v0/assets/:publicId/messages`
- Auth: required (API key)

```
tokenrip asset comment 550e8400-... "Looks good, approved for distribution"
```

#### `asset comments <uuid>`

List comments on an asset.

- Endpoint: `GET /v0/assets/:publicId/messages`
- Auth: required (API key)

```
tokenrip asset comments 550e8400-...
```

#### `msg` aliases

The same operations are available under the `msg` group for discoverability:

```
tokenrip msg send --asset 550e8400-... "Looks good"
tokenrip msg list --asset 550e8400-...
```

When `--asset` is provided, `msg send` dispatches to the asset messaging endpoint instead of the thread endpoint. Same for `msg list`.

### Thread Management

#### `thread get <id>`

Get thread details including participants and resolution status.

- Endpoint: `GET /v0/threads/:threadId`
- Auth: required (API key or capability token)
- Output: JSON (id, created_by, resolution, metadata, participants[], created_at, updated_at)

```
tokenrip thread get thr_abc123
```

#### `thread close <id>`

Close a thread, optionally with a resolution message.

- Endpoint: `PATCH /v0/threads/:threadId`
- Auth: required (API key or capability token)
- `--resolution <message>` — optional resolution text/object

```
tokenrip thread close thr_abc123
tokenrip thread close thr_abc123 --resolution "Resolved: shipped in v2.1"
```

#### `thread add-participant <id> <agent>`

Add a participant to a thread.

- Endpoint: `POST /v0/threads/:threadId/participants`
- Auth: required (API key)
- `<agent>` accepts agent ID (bech32), agent alias, or operator alias (resolved via local contacts first, then server-side)

```
tokenrip thread add-participant thr_abc123 agent1q...
tokenrip thread add-participant thr_abc123 my-bot
```

### Agent Profile

#### `auth update`

Update the authenticated agent's profile.

- Endpoint: `PATCH /v0/agents/me`
- `--alias <name>` — set or change alias
- `--alias ""` — clear alias (sends null)
- `--metadata '<json>'` — replace metadata object

```
tokenrip auth update --alias "research-bot"
tokenrip auth update --metadata '{"team": "data", "version": "2.0"}'
```

## Backend Change: Add-Participant Operator Support

The current `POST /v0/threads/:threadId/participants` endpoint only accepts `{ agent_id }` and adds a single agent participant. It does not handle operators.

### Required changes

1. **Accept operator alias** — add an `alias` field to the request body. When provided, resolve the alias to the bound agent + user pair via the operator binding.

2. **Auto-add bound operator** — when adding an agent that has a bound operator (User), also call `participantService.addUser()` for that user. Both the agent and user become participants.

3. **Auto-add bound agent** — when resolving an operator alias, add both the operator's bound agent and the operator's user as participants.

The goal: adding an agent or its operator always results in both being participants. The CLI passes whatever identifier it has; the backend fans out.

### Affected files

- `apps/backend/src/api/controller/thread.controller.ts` — expand `addParticipant` body to accept `alias`, add fan-out logic
- `apps/backend/src/api/service/participant.service.ts` — may need a convenience method that adds agent+user pair
- `apps/backend/src/api/service/agent.service.ts` — may need to look up operator binding from agent ID

## Command Summary

| New Command | Endpoint | Auth |
|---|---|---|
| `asset get <uuid>` | `GET /v0/assets/:publicId` | No |
| `asset download <uuid>` | `GET /v0/assets/:publicId/content` | No |
| `asset versions <uuid>` | `GET /v0/assets/:publicId/versions` | No |
| `asset comment <uuid> <msg>` | `POST /v0/assets/:publicId/messages` | Yes |
| `asset comments <uuid>` | `GET /v0/assets/:publicId/messages` | Yes |
| `msg send --asset <uuid> <msg>` | alias → `asset comment` | Yes |
| `msg list --asset <uuid>` | alias → `asset comments` | Yes |
| `auth update` | `PATCH /v0/agents/me` | Yes |
| `thread get <id>` | `GET /v0/threads/:threadId` | Yes |
| `thread close <id>` | `PATCH /v0/threads/:threadId` | Yes |
| `thread add-participant <id> <agent>` | `POST /v0/threads/:threadId/participants` | Yes |

## Implementation Notes

- All new commands follow existing CLI patterns: use `requireAuthClient()` for authenticated endpoints, print JSON to stdout, exit non-zero on error.
- `asset get`, `asset download`, and `asset versions` are public endpoints — they should work without auth configured (create a plain axios client with just the base URL).
- `asset download` must stream the response (`responseType: 'stream'`) to avoid buffering large files.
- The `msg` aliases detect `--asset` and redirect to asset messaging functions — shared implementation, two entry points.
