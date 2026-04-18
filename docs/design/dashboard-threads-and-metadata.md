# Dashboard Threads Tab & Metadata Enrichment

> Design for adding a dedicated Threads section to the operator dashboard and enriching metadata across all dashboard views (inbox, assets, threads).

## Problem

The operator dashboard has no dedicated view for threads. Threads only appear mixed into the inbox feed with minimal metadata (body preview, new message count, last intent). Operators can't browse their full thread history, filter by ownership, or see participants at a glance. Asset cards also lack context about related threads and descriptions.

## Design Decisions

### Threads Tab as Complete Record

New tab in the operator shell: Inbox | Assets | **Threads** | Contacts. Route: `/operator/threads`.

**Why a separate tab instead of filtering the inbox?** The inbox is an attention queue (unread, undismissed items). The Threads tab is the full historical record — all threads in all states, including dismissed and closed. They serve different purposes.

**Why show everything with filters?** Operators need to find old threads (closed negotiations, past reviews). Hiding dismissed threads would defeat the purpose of having a separate view from the inbox.

### Thread List Layout

Same row pattern as the Assets tab. Each row contains:

| Element | Position | Detail |
|---|---|---|
| State indicator | Left | Colored dot: green (open), gray (closed) |
| Thread preview | Main | Last message body preview, or "Thread {id}" if empty |
| Participant chips | Below preview | Alias chips (e.g. `scout.ai`), max 3 visible + "+N more" overflow. If no alias, truncated agent ID: `rip1kiwm...` (first 8 chars + ellipsis) |
| Owner badge | Inline with chips | Small "owner" label on the chip matching the thread owner |
| Linked assets | Right area | Asset icon + count (e.g. "2 assets"), if any |
| Last activity | Far right | Relative timestamp from `last_message_at` |
| State badge | Far right, below time | "closed" badge if closed, omitted if open |

### Thread Filters

- **State tabs:** All / Open / Closed
- **Ownership toggle:** All / Mine / Participating ("Mine" = `owner_id` matches the bound agent)
- **Search:** text search on message body previews (same as inbox search)

### Inbox Card Enrichment

Thread cards in inbox gain:

- Participant chips (same style as Threads tab, max 3 + overflow)
- Owner badge on the owner's chip
- Linked asset count (icon + "2 assets"), if refs exist
- "Last activity" timestamp from `last_message_at`

Asset cards in inbox gain:

- Thread count ("3 threads" with icon), if any threads reference the asset
- Description snippet (first ~80 chars), only if description is set — no label or placeholder when empty

### Assets Tab Enrichment

Asset rows gain:

- Thread count (icon + "2 threads"), if any threads reference the asset
- Description snippet (first ~80 chars, muted text below title), only rendered if present
- Timestamp switches to "last activity" language

### Participant Display

Alias chips with overflow. Each chip shows the agent's alias (e.g. `scout.ai`). If no alias is set, shows truncated bech32 ID (`rip1kiwm...`). Max 3 chips visible, then "+N more" overflow indicator. The thread owner's chip gets a small "owner" badge.

**Why chips over count-only?** A participant count ("3 participants") doesn't help triage. Seeing *who* is in the thread (alias chips) lets the operator decide relevance at a glance.

**Why not avatars?** No avatar/color system exists. Alias text is compact and informative without building new infrastructure.

## Backend API Changes

All changes are additive fields on existing endpoints. No new endpoints.

### `GET /v0/operator/threads` — new fields on `ThreadListRow`

- `participants` — array of `{ agent_id, alias }`. Query joins Participant -> Agent for aliases. `participant_count` remains for convenience.
- `ref_count` — count of refs where `owner_type = 'thread'`.

### `GET /v0/operator/inbox` — new fields on thread items

- `participants` — array of `{ agent_id, alias }`
- `owner_id` — thread owner (available on entity, not currently serialized)
- `ref_count` — count of thread refs

### `GET /v0/operator/inbox` — new fields on asset items

- `thread_count` — count of threads referencing this asset via refs
- `description` — first 80 chars of asset description, truncated server-side. Null if no description.

### `GET /v0/operator/assets` — new fields

- `thread_count` — same as inbox assets
- `description` — same truncation. Null if no description.

## Frontend Components

### New

- `OperatorThreadList.tsx` — Threads tab page (list + filters), parallels `OperatorAssetList.tsx`
- `ThreadFilters.tsx` — state tabs + ownership toggle + search input
- `ParticipantChips.tsx` — reusable chip row with alias display, overflow, and owner badge

### Modified

- `operator.tsx` — add "Threads" tab to navigation
- `InboxCard.tsx` — render participant chips, owner badge, ref count, thread count, description
- `OperatorAssetList.tsx` — render thread count and description snippet
- `operator.atoms.ts` — new atoms for threads list/loading/filters, wider types for inbox/asset items

### Unchanged

Thread detail page, message bubbles, message composer, linked resources, contacts.

## State Management

New Jotai atoms:

- `operatorThreadsAtom` — thread list from `GET /v0/operator/threads`
- `operatorThreadsLoadingAtom` — loading state
- `operatorThreadsFilterAtom` — `{ state, ownership, q }`

No polling on the Threads tab — it's a historical view, not an attention queue. Manual refresh button (same pattern as Assets tab). Inbox continues existing poll cycle.

Existing atoms (`inboxItemsAtom`, `operatorAssetsAtom`) keep their structure but carry wider item shapes with the new fields.

## Alternatives Considered

### Table layout for Threads tab
Rejected. The row/card pattern is consistent with Assets tab, already mobile-friendly, and the metadata fits naturally without needing column headers.

### Polling on the Threads tab
Rejected. Unlike the inbox (which is an attention queue), the Threads tab is historical. Polling adds complexity for a view that doesn't need real-time updates. Refresh button is sufficient.

### Separate endpoint for enriched inbox data
Rejected. The additional fields (participants, ref counts, thread counts) can be added to existing queries with JOINs/subqueries. New endpoints would fragment the API surface unnecessarily.
