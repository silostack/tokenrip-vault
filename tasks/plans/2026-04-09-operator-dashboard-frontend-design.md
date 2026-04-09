# Operator Dashboard Frontend — Design

> Frontend design for the operator dashboard. Companion to `operator-dashboard-feature-spec.md` which covers backend contracts and data model.

---

## 1. Design Philosophy

The operator dashboard is not a separate app — it's the existing frontend with superpowers. Operators see the same asset pages and thread views that exist today, but with an action toolbar layered on top. The dashboard shell (inbox, asset list) is new, but detail pages maximize reuse.

**Key constraints:**
- Mobile-first. Every screen must work well on phones. No sidebars, no complex layouts.
- Separate route tree from public pages. No auth checks on public asset/thread views.
- Long-lived sessions. Operators log in rarely (via agent-generated link), stay logged in for weeks.
- No password login (deferred). The agent link is the only auth flow.

---

## 2. Route Structure

```
/operator/auth?token=...    → Auth gate (standalone, no shell)
/operator                   → Dashboard shell → Inbox (default)
/operator/assets            → Dashboard shell → Asset list
/operator/assets/:publicId  → Dashboard shell → Asset detail (reuses SharePageContent + operator toolbar)
/operator/threads/:threadId → Dashboard shell → Thread detail (reuses ThreadView + operator toolbar)
```

**Auth boundary:** The dashboard shell checks for a valid session on mount by fetching `GET /v0/operator/agent`. If 401, redirect to `/operator/auth`. The `ut_` session cookie is HttpOnly — no token management in JS.

---

## 3. Auth Gate (`/operator/auth`)

Standalone centered card. No dashboard shell, no nav. A transient gateway.

**Flow:**

1. Extract `token` from query params
2. `POST /v0/auth/operator { token }` immediately
3. Outcomes:
   - **200 + `is_new_registration: false`** → Cookie set. Redirect to `/operator`.
   - **400 `REGISTRATION_REQUIRED`** → Show inline form: display name (required), password (optional). On submit, re-POST with `{ token, display_name, password? }`. On success, redirect.
   - **401 (invalid/expired)** → Error message: "This link has expired. Run `tokenrip operator-link` to get a new one."

No retry. No alternate login. Clear instructions to get a fresh link from the agent.

---

## 4. Dashboard Shell

Top bar + content area. Stacks vertically. No sidebar ever.

```
Mobile (< 640px)              Desktop (≥ 640px)
┌──────────────────┐          ┌──────────────────────────────┐
│ 🤖 trip1a3f...   │          │ 🤖 trip1a3f... │ Inbox │ Assets │
│ ┌──────┬───────┐ │          ├──────────────────────────────┤
│ │Inbox │Assets │ │          │                              │
│ └──────┴───────┘ │          │         Content area         │
│                  │          │                              │
│  Content area    │          └──────────────────────────────┘
│  (full bleed)    │
└──────────────────┘
```

**Top bar:** Agent identity (alias or truncated agent ID), nav tabs (Inbox / Assets), theme toggle. On mobile, tabs sit below the identity bar.

**No fundamentally different layouts between mobile and desktop.** One layout, Tailwind responsive utilities for spacing. Touch targets minimum 44px everywhere.

---

## 5. Inbox (Home Screen)

Unified chronological feed. Threads and asset updates interleaved, sorted by `updated_at` descending.

**Card layout:**

```
┌───────────────────────────────────────────┐
│ 💬 "Can we adjust the timeline..."        │
│ 3 new messages · propose · 5m ago      ✕  │
├───────────────────────────────────────────┤
│ 📄 "Q3 Report"                           │
│ 1 new version · v3 · 12m ago          ✕  │
└───────────────────────────────────────────┘
```

- **Thread cards:** Icon, last body preview (truncated), new message count, last intent badge, relative timestamp, dismiss button
- **Asset cards:** Icon, title, new version count, latest version number, relative timestamp, dismiss button
- Tap navigates to detail page
- Dismiss button: `POST /v0/operator/threads/:id/dismiss`, fade-out animation
- **Empty state:** "No new activity" — calm, not an error

**Polling:** Fetch `GET /v0/operator/inbox?since=<last_fetch>` on `poll_after` interval. Pause when tab is hidden (`document.visibilityState`). Immediate fetch on tab refocus.

---

## 6. Asset List

Paginated list from `GET /v0/operator/assets?limit=50`. No polling — fetch on mount, manual refresh.

```
┌───────────────────────────────────────────┐
│ Q3 Report                        v3  PDF  │
│ Created 2d ago · Updated 5h ago           │
├───────────────────────────────────────────┤
│ Agent Avatar Design             v1  IMAGE │
│ Created 1w ago · Updated 1w ago           │
└───────────────────────────────────────────┘
```

Title, current version, type badge, timestamps. Tap navigates to detail. Type filtering deferred.

---

## 7. Asset Detail

Reuses `SharePageContent` with an `OperatorToolbar` above it.

```
┌───────────────────────────────────────────┐
│ ← Back     Q3 Report        🗑 Destroy    │
├───────────────────────────────────────────┤
│                                           │
│   [ SharePageContent — same as /s/:uuid ] │
│                                           │
└───────────────────────────────────────────┘
```

- **Back button** returns to previous page
- **Destroy** — confirmation dialog: "This will delete all versions and close related threads. Destroy?" Calls `DELETE /v0/operator/assets/:publicId`. On success, redirect to asset list + toast.
- `SharePageContent` receives asset data fetched via operator session, renders identically to public view

---

## 8. Thread Detail

Reuses `ThreadView` with an `OperatorToolbar` above it.

```
┌───────────────────────────────────────────┐
│ ← Back    "Timeline discussion"  Actions ▾│
├───────────────────────────────────────────┤
│                                           │
│   [ ThreadView — message list + composer ] │
│                                           │
└───────────────────────────────────────────┘
```

**Toolbar actions:**

- **Close thread** — Only if bound agent owns the thread. Confirmation dialog. `PATCH /v0/operator/threads/:id { state: "closed" }`. Disables composer, shows "Thread closed" banner.
- **Dismiss** — Always available. `POST /v0/operator/threads/:id/dismiss`. Toast, no navigation.
- **Set resolution** — Available if unresolved. Inline form. `PATCH /v0/operator/threads/:id { resolution: {...} }`. Resolution form shape deferred to implementation.

On mobile, secondary actions collapse into a dropdown. Dismiss stays visible.

**Closed threads:** Composer hidden, "Thread closed" banner shown, message history readable.

**Destroyed asset refs:** Messages referencing destroyed assets show "Asset destroyed" with tombstone metadata (title, destroyed date) instead of a broken link.

---

## 9. State Management

Extend existing Jotai atom pattern. New atoms in `_jotai/operator/`:

```
operatorAgentAtom          — bound agent profile (fetched once on shell mount)
inboxItemsAtom             — unified feed array (threads + assets, sorted by updated_at)
inboxLastFetchAtom         — timestamp for `since` param
inboxLoadingAtom           — boolean
operatorAssetsAtom         — asset list
operatorAssetsLoadingAtom  — boolean
```

**No duplication.** Detail pages reuse existing `assetAtom`, `versionsAtom`, `messagesAtom` — just fetched via operator endpoints.

**API layer:** New `src/lib/operator.ts` with typed functions for all operator endpoints. Same axios instance, `withCredentials: true` for cookie auth.

**Polling hook:** `useInboxPolling` handles interval, visibility pausing, refetch-on-focus.

---

## 10. Component Inventory

### New (7 components)

| Component | Purpose |
|---|---|
| `OperatorAuthPage` | Auth gate — token verification, registration form, error states |
| `OperatorShell` | Dashboard layout — top bar, nav tabs, content outlet |
| `InboxFeed` | Unified feed list, handles dismiss |
| `InboxCard` | Single feed item (thread or asset variant), dismiss button |
| `OperatorAssetList` | Paginated asset list |
| `OperatorToolbar` | Contextual action bar for detail pages |
| `ConfirmDialog` | Reusable confirmation modal for destructive actions |

### Reused as-is

| Component | Where |
|---|---|
| `SharePageContent` | Asset detail in operator route |
| `ThreadView` | Thread detail in operator route |
| `MessageComposer` | Thread detail — posts with operator session |
| `MessageBubble` | Thread messages |
| `AssetViewer` + all viewers | Asset content rendering |
| `VersionDropdown` | Asset version switching |
| `ThemeToggle` | Operator shell top bar |

### Minor modifications

- `ThreadView` — accept optional prop to hide composer when thread is closed
- Axios instance — `withCredentials: true` for cookie auth

---

## 11. Deferred

- Password login (`POST /v0/operators/login`) — no login page, agent link only
- Asset type filtering on list page
- Swipe-to-dismiss (progressive enhancement)
- Resolution form design (depends on backend schema)
