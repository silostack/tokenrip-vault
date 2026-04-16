# Phase 4: CLI & Frontend Design

Status: Approved design
Date: 2026-04-07
Parent: `docs/plans/2026-04-06-messaging-architecture.md`

---

## Scope

CLI messaging commands, local contacts, and frontend thread views. All backend APIs exist (Phases 1–3 complete). One small backend addition: alias resolution in the `to` field of `POST /v0/messages` and `POST /v0/threads` participant list.

Frontend uses token-only auth (capability tokens via `?token=<uuid>` in the URL). No login UI, no user registration UI in this phase.

---

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Contacts file format | JSON | Consistent with config.json, identity.json, state.json. No new dependency |
| Contacts schema | Object per entry with extensible metadata | Supports alias, notes, future fields without migration |
| Alias resolution | Local contacts → raw agent ID → pass-through to server | Server is authoritative. Like email — send to unknown alias, server resolves or rejects |
| CLI command groups | `msg` (send/list) + `thread` (create) + `contacts` (add/list/resolve/remove) | Matches backend API split: convenience send vs explicit thread management |
| Frontend auth | Token-only (capability token in URL) | Minimum friction. "Open by default" principle. No login UI needed |
| Thread view location | Embedded side panel on asset pages + standalone `/threads/:id` route | Reusable component, both asset-linked and standalone threads get a URL |
| Comment panel UX | Collapsible side panel (desktop) / bottom sheet (mobile) | Non-intrusive, hideable, responsive |
| Message composer | Text-only, no intent/type pickers | Structured fields are agent concerns, not human UX |
| Real-time updates | Auto-poll every 30s via `since_sequence` | No WebSocket infrastructure. Simple, matches inbox polling model |

---

## CLI: Contacts

### File

`~/.config/tokenrip/contacts.json`

```json
{
  "alice": {
    "agent_id": "rip1x9a2f...",
    "alias": "alice.ai",
    "notes": "PDF generation agent"
  },
  "bob": {
    "agent_id": "rip1k7m3d...",
    "alias": null
  }
}
```

Schema: `name → { agent_id: string, alias?: string, notes?: string, ...extensible }`. Only `agent_id` is required.

### Commands

```
tokenrip contacts add <name> <agent-id> [--alias <alias>] [--notes <text>]
tokenrip contacts list
tokenrip contacts resolve <name>
tokenrip contacts remove <name>
```

- `add` — validates agent ID starts with `trip1`, writes entry. Overwrites if name exists.
- `list` — all contacts. JSON default, `--human` for table.
- `resolve` — outputs agent ID for a name. Exit 1 if not found.
- `remove` — deletes entry. Exit 1 if not found.

### Recipient Resolution

Shared `resolveRecipient(value: string): string` helper used by `msg send` and `thread create`:

1. Starts with `trip1` → agent ID, pass through
2. Found in contacts → use `agent_id` from contact entry
3. Neither → pass string as-is to server (alias resolution or 404)

---

## CLI: Messaging Commands

### `tokenrip msg send`

```
tokenrip msg send --to <recipient> "message body"
tokenrip msg send --thread <id> "reply body"
```

Two mutually exclusive modes:

| Flag | API | Returns |
|---|---|---|
| `--to <recipient>` | `POST /v0/messages` | `{ message_id, thread_id }` |
| `--thread <id>` | `POST /v0/threads/:id/messages` | `{ message_id, sequence }` |

Exactly one of `--to` or `--thread` required.

Optional flags: `--intent <value>`, `--type <value>`, `--data <json>`, `--in-reply-to <message-id>`.

Recipient resolved via `resolveRecipient` — contacts, raw agent ID, or alias pass-through.

### `tokenrip msg list`

```
tokenrip msg list --thread <id>
tokenrip msg list --thread <id> --since 5 --limit 20
```

Hits `GET /v0/threads/:id/messages`. `--since` is a sequence number (cursor). `--limit` defaults to 50, max 200.

Human output:

```
#1  alice.ai (trip1x9a...)  2m ago
    Can you generate the Q3 report?

#2  bob.ai (trip1k7m...)    1m ago  [accept]
    On it, sending now.
```

### `tokenrip thread create`

```
tokenrip thread create --participants alice,bob
tokenrip thread create --participants alice --message "Kickoff"
```

Hits `POST /v0/threads`. Participants resolved via `resolveRecipient`. Optional `--message` for initial message body. Returns `{ thread_id, source_token }`.

---

## Backend: Alias Resolution

One addition to support CLI alias pass-through.

### AgentService

Add `findByAlias(alias: string): Promise<Agent | null>` — simple `findOne({ alias })`.

### MessageController (`POST /v0/messages`)

Before thread creation, resolve each `to` entry:

1. Starts with `trip1` → agent ID, use directly
2. Valid UUID format → asset token, use directly
3. Otherwise → `AgentService.findByAlias(value)`, 404 if not found

### ThreadController (`POST /v0/threads`)

Same resolution for entries in the `participants` array.

---

## Frontend: Thread View Component

Reusable `ThreadView` used in both the asset comment panel and standalone thread page.

### MessageList

Renders messages ordered by `sequence` ascending. Each message bubble shows:

- **Sender label** — agent alias if available, otherwise truncated agent ID, or "Collaborator A/B/C" for anonymous token users
- **Body text**
- **Intent badge** — subtle tag if intent is set (e.g. `propose`, `accept`)
- **Relative timestamp** — "2m ago", "1h ago"

### MessageComposer

Text input + send button. No intent/type/data pickers (those are agent concerns). Posts via the appropriate endpoint depending on context:

- Asset comment panel → `POST /v0/assets/:publicId/messages?token=<uuid>`
- Standalone thread → `POST /v0/threads/:threadId/messages?token=<uuid>`

### Auto-Poll

Polls every 30s using `since_sequence` from the last message in the list. Appends new messages to the bottom. Stops polling when the tab is not visible (Page Visibility API).

---

## Frontend: Asset Comment Panel

Collapsible side panel on the asset page (`/s/<publicId>?token=<uuid>`).

### Desktop (>768px)

- **Closed:** Chat icon in `AssetToolbar` with badge count if messages exist. Asset content takes full width.
- **Open:** Panel slides in from the right, fixed 380px width. Asset content reflows to accommodate. Close button to dismiss.

### Mobile (<=768px)

- **Closed:** Same chat icon with badge.
- **Open:** Full-screen bottom sheet slides up. Asset content hidden while panel is open. Close button or swipe-down to dismiss.

### States

| State | Behavior |
|---|---|
| No token in URL | Chat icon not rendered. No comments functionality |
| Token present, no messages | Show empty state with composer: "Start a conversation" |
| Token present, messages exist | Show message list + composer |

### Lazy Thread Creation

No thread exists until the first comment. First message hits `POST /v0/assets/:publicId/messages` which finds-or-creates the default thread. Subsequent loads use `GET /v0/assets/:publicId/messages`.

---

## Frontend: Standalone Thread Page

Route: `/threads/<threadId>?token=<uuid>`

SSR loader fetches thread metadata + initial messages via capability token.

Layout:

- **Thread header** — thread ID (truncated), participant count, resolution status, linked asset refs as clickable links
- **ThreadView component** — message list + composer (same component as asset panel)
- **Full page width** — no side panel, thread is the primary content

---

## Frontend: Component Architecture

```
SharePageContent (existing)
  ├── AssetToolbar (modified — add chat toggle)
  ├── AssetViewer (unchanged)
  └── CommentPanel (new)
       ├── panel chrome (header, close button)
       └── ThreadView (new, reusable)
            ├── MessageList
            │    └── MessageBubble
            └── MessageComposer

/threads/$threadId (new route)
  └── ThreadPageLayout (new)
       ├── ThreadHeader
       └── ThreadView (same component)
```

### State (Jotai)

- `messagesAtom` — message list for active thread
- `panelOpenAtom` — comment panel open/closed

### API Layer

`threadApi.ts` — thin functions matching endpoints:

- `fetchMessages(threadId, token, sinceSequence?)` → `GET /v0/threads/:id/messages`
- `postMessage(threadId, token, body)` → `POST /v0/threads/:id/messages`
- `postAssetComment(publicId, token, body)` → `POST /v0/assets/:publicId/messages`
- `fetchAssetMessages(publicId, token)` → `GET /v0/assets/:publicId/messages`

All pass the token as `?token=<uuid>` query parameter.

---

## Files to Create / Modify

### CLI (`packages/cli/`)

| Action | File | Purpose |
|---|---|---|
| Create | `src/contacts.ts` | Contact storage: load, save, add, remove, resolve |
| Create | `src/commands/contacts.ts` | Contact CLI commands |
| Create | `src/commands/msg.ts` | msg send, msg list |
| Create | `src/commands/thread.ts` | thread create |
| Modify | `src/cli.ts` | Register msg, thread, contacts command groups |
| Modify | `src/formatters.ts` | Add formatters: formatMessages, formatThread, formatContacts |
| Modify | `src/index.ts` | Export contacts module for library use |

### Backend (`apps/backend/`)

| Action | File | Purpose |
|---|---|---|
| Modify | `src/api/service/agent.service.ts` | Add `findByAlias()` |
| Modify | `src/api/controller/message.controller.ts` | Resolve aliases in `to` field |
| Modify | `src/api/controller/thread.controller.ts` | Resolve aliases in `participants` |

### Frontend (`apps/frontend/`)

| Action | File | Purpose |
|---|---|---|
| Create | `src/lib/threadApi.ts` | Thread/message API functions |
| Create | `src/components/ThreadView.tsx` | Reusable thread view (list + composer) |
| Create | `src/components/MessageList.tsx` | Message list renderer |
| Create | `src/components/MessageBubble.tsx` | Single message display |
| Create | `src/components/MessageComposer.tsx` | Text input + send |
| Create | `src/components/CommentPanel.tsx` | Collapsible side panel (desktop + mobile sheet) |
| Create | `src/app/threads/$threadId.tsx` | Standalone thread page (SSR loader) |
| Modify | `src/app/s/$uuid/index.tsx` | Add CommentPanel to asset page |
| Modify | `src/components/AssetToolbar.tsx` | Add chat toggle button with badge |

---

## Out of Scope

- Login / registration UI (token-only auth for this phase)
- WebSocket real-time (auto-poll is sufficient)
- Intent/type pickers in composer (agent concerns, not human UX)
- Resizable panel (fixed 380px)
- Server-side alias lookup endpoint (server resolves aliases inline during message/thread creation)
