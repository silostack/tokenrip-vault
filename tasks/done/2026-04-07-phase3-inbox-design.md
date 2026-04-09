# Phase 3: Inbox Design

Status: Approved design
Date: 2026-04-07
Prerequisite: Phase 2 (Threads & Messages) complete

---

## Overview

Agent activity polling. A single endpoint returns lightweight metadata about new thread messages and asset version updates since the agent's last poll. Cursor state is client-managed — the server is stateless.

---

## API Endpoint

```
GET /v0/inbox?since=<ISO8601>&types=<comma-separated>&limit=<int>
```

**Auth:** Agent only (`@Auth('agent')`)

**Parameters:**

| Param | Required | Default | Description |
|---|---|---|---|
| `since` | Yes | — | ISO 8601 timestamp. Returns activity after this time. |
| `types` | No | `threads,assets` | Comma-separated filter: `threads`, `assets`, or both. |
| `limit` | No | 50 (max 200) | Max items per type. Applied independently to threads and assets. |

**Response:**

```json
{
  "ok": true,
  "data": {
    "threads": [
      {
        "thread_id": "uuid",
        "source_token": "uuid",
        "last_sequence": 14,
        "new_message_count": 3,
        "last_intent": "propose",
        "last_body_preview": "Can we move the deadline...",
        "refs": [{ "type": "asset", "target_id": "uuid" }],
        "updated_at": "2026-04-07T12:34:56Z"
      }
    ],
    "assets": [
      {
        "asset_id": "public-uuid",
        "title": "Q2 Report",
        "new_version_count": 1,
        "latest_version": 3,
        "updated_at": "2026-04-07T12:30:00Z"
      }
    ],
    "poll_after": 30
  }
}
```

**Field definitions:**

- `new_message_count` — count of messages in thread with `created_at > since`. Computed server-side per request.
- `last_intent` — intent field from the most recent message in the thread.
- `last_body_preview` — first 100 characters of the most recent message body.
- `refs` — references from the Ref table for the thread (`owner_type='thread'`).
- `new_version_count` — count of AssetVersions with `created_at > since` for that asset.
- `latest_version` — highest version number for the asset.
- `poll_after` — suggested seconds before next poll (rate limit hint).

---

## Backend Implementation

### InboxService

Single service, two independent read-only queries. No transactions or locks needed.

**Thread activity query:**
1. Find Participants where `agent_id = agentId`
2. Join to Threads where `updated_at > since`
3. For each thread:
   - Count messages with `created_at > since` -> `new_message_count`
   - Fetch most recent message -> `last_sequence`, `last_intent`, `last_body_preview` (truncated to 100 chars)
   - Fetch refs from Ref table where `owner_type='thread'` and `owner_id=thread.id`
4. Order by `updated_at` DESC, apply limit

**Asset update query:**
1. Find Assets where `owner_id = agentId`
2. Join to AssetVersions where `created_at > since`
3. Group by asset: count new versions, get max version number
4. Return asset `public_id`, `title`, `new_version_count`, `latest_version`, `updated_at`
5. Order by `updated_at` DESC, apply limit

Both queries run in parallel via `Promise.all`. Each is skipped entirely if its type isn't in the `types` filter.

### InboxController

- `GET /v0/inbox` with `@Auth('agent')`
- Parses `since` (required, ISO 8601), `types` (optional, comma-separated), `limit` (optional, int)
- Delegates to InboxService
- Returns response shape above

### Module Registration

Add InboxService and InboxController to ApiModule's providers and controllers arrays.

---

## CLI Changes

### `tokenrip inbox` Command

1. Reads `since` from `~/.config/tokenrip/state.json` (`last_inbox_poll` key)
2. Calls `GET /v0/inbox?since=<timestamp>&types=<filter>`
3. Outputs JSON to stdout (default)
4. Updates `state.json`: sets `last_inbox_poll` to current time, updates per-thread high-water marks
5. First-ever poll (no stored cursor): defaults to 24 hours ago

**Flags:**

| Flag | Description |
|---|---|
| `--human` | Formatted table output instead of JSON |
| `--types threads\|assets` | Filter activity types |
| `--since <ISO8601>` | Override stored cursor (does not update state) |
| `--limit <int>` | Passed through to API |

### `state.json` Shape

```json
{
  "last_inbox_poll": "2026-04-07T12:34:56Z",
  "thread_cursors": {
    "uuid-1": 14,
    "uuid-2": 7
  }
}
```

Stored at `~/.config/tokenrip/state.json`. Mutable runtime state, separate from identity (`identity.json`) and static config (`config.json`). Safe to delete — worst case the next poll fetches everything from the last 24 hours.

### JSON-Default for All CLI Commands

Global `--human` flag added at the CLI root level. All existing commands (`auth register`, `auth create-key`, `auth whoami`, `publish`, etc.) switch default output from human-readable to JSON. `--human` restores formatted output.

---

## Tests

### Integration Tests (`tests/integration/inbox.test.ts`)

1. **Empty inbox** — new agent, no threads or assets. Returns empty arrays.
2. **Thread activity** — agent is participant, messages posted after `since`. Verify `new_message_count`, `last_sequence`, `last_intent`, `last_body_preview`.
3. **Asset updates** — agent owns asset, new version after `since`. Verify `new_version_count`, `latest_version`.
4. **Mixed activity** — both thread and asset updates. Both arrays populated.
5. **Type filtering** — `?types=threads` excludes assets, `?types=assets` excludes threads.
6. **Since filtering** — messages/versions before `since` excluded from counts.
7. **Non-participant threads excluded** — agent not in thread, thread absent from inbox.
8. **Non-owned assets excluded** — other agent's asset absent from inbox.
9. **Refs included** — thread with refs returns them in inbox response.
10. **Limit applied** — more threads than limit, response truncated.

### CLI Tests (packages/cli)

- `state.json` cursor read/write round-trip
- `--human` flag produces formatted output
- `--since` override does not update stored cursor
- First poll with no state defaults to 24h ago
