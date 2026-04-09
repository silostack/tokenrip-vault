# Operator Dashboard Frontend — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the operator dashboard frontend — auth flow, inbox, asset management, thread interaction — as described in `tasks/plans/2026-04-09-operator-dashboard-frontend-design.md`.

**Architecture:** Separate `/operator` route tree with its own layout shell. Auth gate at `/operator/auth` bypasses the shell. Dashboard pages reuse existing `SharePageContent` and `ThreadView` components with an `OperatorToolbar` layered on top. Mobile-first, no sidebars.

**Tech Stack:** TanStack Router (file-based routing), Jotai (state), Axios (HTTP with cookie auth), Tailwind CSS v4, Lucide React (icons).

**Design doc:** `tasks/plans/2026-04-09-operator-dashboard-frontend-design.md`
**Backend spec:** `tasks/plans/operator-dashboard-feature-spec.md`

---

## Task 1: Axios Config — Enable Cookie Auth

**Files:**
- Modify: `apps/frontend/src/utils/api.ts`

**Step 1: Add `withCredentials: true` to the axios instance**

```typescript
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3434'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export default api
```

This ensures the `session` cookie is sent on every request to the backend. The backend's auth guard reads `Cookie: session=ut_...` for operator auth.

**Step 2: Verify**

Run: `cd apps/frontend && bun run build`
Expected: Build succeeds with no errors.

**Step 3: Commit**

```
feat(frontend): enable cookie credentials on axios instance
```

---

## Task 2: Session Helper

**Files:**
- Create: `apps/frontend/src/lib/session.ts`

**Step 1: Write the session utility**

```typescript
const SESSION_COOKIE = 'session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export function setSession(token: string): void {
  document.cookie = `${SESSION_COOKIE}=${token};path=/;max-age=${SESSION_MAX_AGE};SameSite=Lax`
}

export function clearSession(): void {
  document.cookie = `${SESSION_COOKIE}=;path=/;max-age=0`
}

export function hasSession(): boolean {
  return document.cookie.split(';').some((c) => c.trim().startsWith(`${SESSION_COOKIE}=`))
}
```

The backend returns `auth_token` in the response body. The frontend sets it as a cookie so subsequent requests carry it automatically. 30-day max-age matches the long-lived session requirement.

**Step 2: Verify**

Run: `cd apps/frontend && bun run build`
Expected: Build succeeds.

**Step 3: Commit**

```
feat(frontend): add session cookie helper for operator auth
```

---

## Task 3: Operator API Layer

**Files:**
- Create: `apps/frontend/src/lib/operator.ts`

**Step 1: Write types and API functions**

```typescript
import api from '@/utils/api'
import type { ThreadMessage } from '@/lib/thread'

// ── Types ──────────────────────────────────────────────

export interface OperatorAgent {
  agent_id: string
  alias: string | null
  metadata: Record<string, unknown> | null
  registered_at: string
}

export interface InboxThread {
  thread_id: string
  updated_at: string
  new_message_count: number
  last_sequence: number | null
  last_intent: string | null
  last_body_preview: string | null
  refs: Array<{ type: string; target_id: string; version?: number }>
}

export interface InboxAsset {
  asset_id: string
  title: string | null
  updated_at: string
  new_version_count: number
  latest_version: number
}

export interface InboxData {
  threads: InboxThread[]
  assets: InboxAsset[]
  poll_after: number
}

export interface OperatorAssetItem {
  id: string
  title: string | null
  type: string
  mimeType: string | null
  state: string
  versionCount: number
  createdAt: string
  updatedAt: string
}

export interface ThreadUpdate {
  thread_id: string
  state: string
  resolution: Record<string, unknown> | null
  owner_id: string
}

export interface AuthResponse {
  user_id: string
  auth_token: string
  is_new_registration: boolean
}

// ── Inbox item (unified feed) ──────────────────────────

export type InboxItem =
  | { kind: 'thread'; data: InboxThread }
  | { kind: 'asset'; data: InboxAsset }

export function mergeInboxItems(inbox: InboxData): InboxItem[] {
  const items: InboxItem[] = [
    ...inbox.threads.map((t) => ({ kind: 'thread' as const, data: t })),
    ...inbox.assets.map((a) => ({ kind: 'asset' as const, data: a })),
  ]
  items.sort((a, b) => {
    const aTime = a.kind === 'thread' ? a.data.updated_at : a.data.updated_at
    const bTime = b.kind === 'thread' ? b.data.updated_at : b.data.updated_at
    return new Date(bTime).getTime() - new Date(aTime).getTime()
  })
  return items
}

// ── Auth ───────────────────────────────────────────────

export async function authenticateOperator(params: {
  token: string
  display_name?: string
  password?: string
}): Promise<AuthResponse> {
  const res = await api.post('/v0/auth/operator', params)
  return res.data.data
}

// ── Dashboard ──────────────────────────────────────────

export async function fetchOperatorAgent(): Promise<OperatorAgent> {
  const res = await api.get('/v0/operator/agent')
  return res.data.data
}

export async function fetchInbox(
  since?: string,
  limit?: number,
): Promise<InboxData> {
  const params: Record<string, string | number> = {}
  if (since) params.since = since
  if (limit) params.limit = limit
  const res = await api.get('/v0/operator/inbox', { params })
  return res.data.data
}

export async function fetchOperatorAssets(params?: {
  since?: string
  limit?: number
  type?: string
}): Promise<OperatorAssetItem[]> {
  const res = await api.get('/v0/operator/assets', { params })
  return res.data.data
}

// ── Actions ────────────────────────────────────────────

export async function destroyAsset(publicId: string): Promise<void> {
  await api.delete(`/v0/operator/assets/${publicId}`)
}

export async function updateThread(
  threadId: string,
  body: { state?: string; resolution?: Record<string, unknown> },
): Promise<ThreadUpdate> {
  const res = await api.patch(`/v0/operator/threads/${threadId}`, body)
  return res.data.data
}

export async function dismissThread(threadId: string): Promise<void> {
  await api.post(`/v0/operator/threads/${threadId}/dismiss`)
}

export async function postOperatorMessage(
  threadId: string,
  body: string,
): Promise<ThreadMessage> {
  const res = await api.post(`/v0/operator/threads/${threadId}/messages`, {
    body,
  })
  return res.data.data
}

// ── Thread data (uses regular endpoints with session cookie) ──

export async function fetchOperatorThread(threadId: string) {
  const res = await api.get(`/v0/threads/${threadId}`)
  return res.data.data
}

export async function fetchOperatorMessages(
  threadId: string,
  sinceSequence?: number,
): Promise<ThreadMessage[]> {
  const params: Record<string, string> = {}
  if (sinceSequence != null) params.since_sequence = String(sinceSequence)
  const res = await api.get(`/v0/threads/${threadId}/messages`, { params })
  return res.data.data
}
```

**Note on thread data fetching:** The operator endpoints cover actions (close, dismiss, post) but not reading thread metadata and messages. The regular endpoints (`/v0/threads/:id`, `/v0/threads/:id/messages`) should accept the session cookie because the auth guard checks user auth mode. If they don't, the backend needs new GET endpoints under `/v0/operator/threads/`. Verify during integration testing.

**Step 2: Verify**

Run: `cd apps/frontend && bun run build`
Expected: Build succeeds.

**Step 3: Commit**

```
feat(frontend): add operator API layer with types and functions
```

---

## Task 4: Operator Jotai Atoms

**Files:**
- Create: `apps/frontend/src/_jotai/operator/operator.atoms.ts`

**Step 1: Write the atoms**

```typescript
import { atom } from 'jotai'
import type { OperatorAgent, InboxItem, OperatorAssetItem } from '@/lib/operator'

export const operatorAgentAtom = atom<OperatorAgent | null>(null)

export const inboxItemsAtom = atom<InboxItem[]>([])
export const inboxLastFetchAtom = atom<string | null>(null)
export const inboxLoadingAtom = atom<boolean>(false)

export const operatorAssetsAtom = atom<OperatorAssetItem[]>([])
export const operatorAssetsLoadingAtom = atom<boolean>(false)
```

**Step 2: Verify**

Run: `cd apps/frontend && bun run build`
Expected: Build succeeds.

**Step 3: Commit**

```
feat(frontend): add operator Jotai atoms for dashboard state
```

---

## Task 5: ConfirmDialog Component

**Files:**
- Create: `apps/frontend/src/components/operator/ConfirmDialog.tsx`

**Step 1: Write the component**

A simple modal for destructive actions (destroy asset, close thread). Mobile-friendly with large tap targets.

```tsx
import { useCallback, useEffect, useRef } from 'react'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  destructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === dialogRef.current) onCancel()
    },
    [onCancel],
  )

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={onCancel}
      className="m-auto max-w-sm rounded-xl border border-foreground/10 bg-background p-0 text-foreground shadow-lg backdrop:bg-black/50"
    >
      <div className="p-6">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-foreground/60">{message}</p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border border-foreground/10 px-4 py-3 text-sm font-medium transition-colors hover:bg-foreground/5 active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-colors active:scale-[0.98] ${
              destructive
                ? 'bg-status-error text-white hover:bg-status-error/90'
                : 'bg-foreground text-background hover:bg-foreground/90'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  )
}
```

**Step 2: Verify**

Run: `cd apps/frontend && bun run build`
Expected: Build succeeds.

**Step 3: Commit**

```
feat(frontend): add ConfirmDialog component for destructive actions
```

---

## Task 6: Auth Gate Page

**Files:**
- Create: `apps/frontend/src/components/operator/OperatorAuthPage.tsx`
- Create: `apps/frontend/src/app/operator/auth.tsx`

**Step 1: Write the auth page component**

```tsx
import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { authenticateOperator } from '@/lib/operator'
import { setSession } from '@/lib/session'

interface OperatorAuthPageProps {
  token: string
}

type AuthState =
  | { step: 'verifying' }
  | { step: 'register' }
  | { step: 'redirecting' }
  | { step: 'error'; message: string }

export function OperatorAuthPage({ token }: OperatorAuthPageProps) {
  const navigate = useNavigate()
  const [state, setState] = useState<AuthState>({ step: 'verifying' })
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    authenticateOperator({ token })
      .then((res) => {
        setSession(res.auth_token)
        setState({ step: 'redirecting' })
        navigate({ to: '/operator' })
      })
      .catch((err) => {
        const error = err.response?.data?.error
        if (error === 'REGISTRATION_REQUIRED') {
          setState({ step: 'register' })
        } else {
          const message =
            error === 'TOKEN_EXPIRED'
              ? 'This link has expired.'
              : error === 'AGENT_NOT_FOUND'
                ? 'Agent not found.'
                : err.response?.data?.message || 'Authentication failed.'
          setState({ step: 'error', message })
        }
      })
  }, [token, navigate])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = displayName.trim()
    if (!trimmed || submitting) return
    setSubmitting(true)
    try {
      const res = await authenticateOperator({
        token,
        display_name: trimmed,
        password: password || undefined,
      })
      setSession(res.auth_token)
      setState({ step: 'redirecting' })
      navigate({ to: '/operator' })
    } catch (err: any) {
      setState({
        step: 'error',
        message: err.response?.data?.message || 'Registration failed.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {state.step === 'verifying' && (
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-pulse rounded-full bg-foreground/10" />
            <p className="mt-4 text-sm text-foreground/40">
              Verifying operator link...
            </p>
          </div>
        )}

        {state.step === 'redirecting' && (
          <div className="text-center">
            <p className="text-sm text-foreground/40">
              Welcome back. Redirecting...
            </p>
          </div>
        )}

        {state.step === 'register' && (
          <div>
            <h1 className="font-mono text-lg font-bold">Set up your account</h1>
            <p className="mt-1 text-sm text-foreground/50">
              Your agent has invited you to be its operator.
            </p>
            <form onSubmit={handleRegister} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="display_name"
                  className="block text-xs font-medium text-foreground/60"
                >
                  Display name
                </label>
                <input
                  id="display_name"
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  autoFocus
                  className="mt-1 w-full rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:border-foreground/20 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-foreground/60"
                >
                  Password{' '}
                  <span className="text-foreground/30">(optional)</span>
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Optional"
                  className="mt-1 w-full rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:border-foreground/20 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={!displayName.trim() || submitting}
                className="w-full rounded-lg bg-foreground px-4 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90 active:scale-[0.98] disabled:opacity-50"
              >
                {submitting ? 'Creating account...' : 'Continue'}
              </button>
            </form>
          </div>
        )}

        {state.step === 'error' && (
          <div className="text-center">
            <p className="text-sm text-status-error">{state.message}</p>
            <p className="mt-3 text-xs text-foreground/40">
              Run{' '}
              <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-foreground/60">
                tokenrip operator-link
              </code>{' '}
              to get a new link.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
```

**Step 2: Write the route file**

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { OperatorAuthPage } from '@/components/operator/OperatorAuthPage'

export const Route = createFileRoute('/operator/auth')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) || '',
  }),
  component: OperatorAuthRoute,
})

function OperatorAuthRoute() {
  const { token } = Route.useSearch()

  if (!token) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="text-center">
          <p className="text-sm text-foreground/50">No operator token provided.</p>
          <p className="mt-2 text-xs text-foreground/30">
            Run{' '}
            <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-foreground/60">
              tokenrip operator-link
            </code>{' '}
            to get a login link.
          </p>
        </div>
      </div>
    )
  }

  return <OperatorAuthPage token={token} />
}
```

**Step 3: Verify**

Run: `cd apps/frontend && bun run dev`
Expected: Dev server starts. Route tree regenerates to include `/operator/auth`. Navigate to `http://localhost:3333/operator/auth` — should show "No operator token provided."

**Step 4: Commit**

```
feat(frontend): add operator auth gate page
```

---

## Task 7: Operator Shell & Layout Route

**Files:**
- Create: `apps/frontend/src/components/operator/OperatorShell.tsx`
- Create: `apps/frontend/src/app/operator.tsx`

**Step 1: Write the shell component**

```tsx
import { type ReactNode, useEffect, useState } from 'react'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useAtom, useSetAtom } from 'jotai'
import { Bot } from 'lucide-react'
import { operatorAgentAtom } from '@/_jotai/operator/operator.atoms'
import { fetchOperatorAgent } from '@/lib/operator'
import { clearSession } from '@/lib/session'
import { ThemeToggle } from '@/components/ThemeToggle'

interface OperatorShellProps {
  children: ReactNode
}

export function OperatorShell({ children }: OperatorShellProps) {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [agent, setAgent] = useAtom(operatorAgentAtom)
  const [loading, setLoading] = useState(!agent)

  useEffect(() => {
    if (agent) return
    fetchOperatorAgent()
      .then(setAgent)
      .catch(() => {
        clearSession()
        navigate({ to: '/operator/auth' })
      })
      .finally(() => setLoading(false))
  }, [agent, setAgent, navigate])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-foreground/5" />
      </div>
    )
  }

  const agentLabel = agent?.alias || agent?.agent_id?.slice(0, 16) + '...' || 'Agent'
  const tabs = [
    { label: 'Inbox', path: '/operator' },
    { label: 'Assets', path: '/operator/assets' },
  ]

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-3xl flex-col">
      {/* Top bar */}
      <div className="border-b border-foreground/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot size={16} className="text-foreground/40" />
            <span className="font-mono text-sm font-medium text-foreground/60">
              {agentLabel}
            </span>
          </div>
          <ThemeToggle />
        </div>
        {/* Nav tabs */}
        <div className="mt-3 flex gap-1">
          {tabs.map((tab) => {
            const active = pathname === tab.path
            return (
              <a
                key={tab.path}
                href={tab.path}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-foreground/10 text-foreground'
                    : 'text-foreground/40 hover:text-foreground/60'
                }`}
              >
                {tab.label}
              </a>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">{children}</div>
    </div>
  )
}
```

**Step 2: Write the layout route**

The layout wraps all `/operator/*` routes. Auth page bypasses the shell.

```tsx
import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router'
import { OperatorShell } from '@/components/operator/OperatorShell'

export const Route = createFileRoute('/operator')({
  component: OperatorLayout,
})

function OperatorLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  // Auth page renders standalone — no shell wrapper
  if (pathname === '/operator/auth') {
    return <Outlet />
  }

  return (
    <OperatorShell>
      <Outlet />
    </OperatorShell>
  )
}
```

**Step 3: Verify**

Run: `cd apps/frontend && bun run dev`
Expected: Route tree regenerates. Navigating to `/operator` shows loading spinner, then redirects to `/operator/auth` (no session yet). `/operator/auth?token=...` still works standalone.

**Step 4: Commit**

```
feat(frontend): add operator shell layout with agent identity and nav tabs
```

---

## Task 8: Inbox Polling Hook

**Files:**
- Create: `apps/frontend/src/components/operator/useInboxPolling.ts`

**Step 1: Write the hook**

```typescript
import { useEffect, useRef, useCallback, useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import {
  inboxItemsAtom,
  inboxLastFetchAtom,
  inboxLoadingAtom,
} from '@/_jotai/operator/operator.atoms'
import { fetchInbox, mergeInboxItems } from '@/lib/operator'

export function useInboxPolling() {
  const setItems = useSetAtom(inboxItemsAtom)
  const setLastFetch = useSetAtom(inboxLastFetchAtom)
  const setLoading = useSetAtom(inboxLoadingAtom)
  const loading = useAtomValue(inboxLoadingAtom)
  const pollAfterRef = useRef(30)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()
  const lastFetchRef = useRef<string | null>(null)
  const [initialDone, setInitialDone] = useState(false)

  const doFetch = useCallback(
    async (since?: string) => {
      try {
        const data = await fetchInbox(since, 50)
        const merged = mergeInboxItems(data)
        if (since) {
          // Incremental: prepend new items, deduplicate
          setItems((prev) => {
            const existingIds = new Set(
              prev.map((i) =>
                i.kind === 'thread' ? i.data.thread_id : i.data.asset_id,
              ),
            )
            const newItems = merged.filter((i) => {
              const id =
                i.kind === 'thread' ? i.data.thread_id : i.data.asset_id
              return !existingIds.has(id)
            })
            // Also update existing items with new data
            const updated = prev.map((existing) => {
              const existingId =
                existing.kind === 'thread'
                  ? existing.data.thread_id
                  : existing.data.asset_id
              const fresh = merged.find((m) => {
                const mId =
                  m.kind === 'thread' ? m.data.thread_id : m.data.asset_id
                return mId === existingId
              })
              return fresh || existing
            })
            return [...newItems, ...updated].sort((a, b) => {
              const aTime =
                a.kind === 'thread' ? a.data.updated_at : a.data.updated_at
              const bTime =
                b.kind === 'thread' ? b.data.updated_at : b.data.updated_at
              return new Date(bTime).getTime() - new Date(aTime).getTime()
            })
          })
        } else {
          setItems(merged)
        }
        pollAfterRef.current = data.poll_after || 30
        const now = new Date().toISOString()
        lastFetchRef.current = now
        setLastFetch(now)
      } catch {
        // silent poll failure
      }
    },
    [setItems, setLastFetch],
  )

  // Initial fetch
  useEffect(() => {
    setLoading(true)
    doFetch().finally(() => {
      setLoading(false)
      setInitialDone(true)
    })
  }, [doFetch, setLoading])

  // Polling with visibility awareness
  useEffect(() => {
    if (!initialDone) return

    const startPolling = () => {
      clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => {
        if (document.hidden) return
        doFetch(lastFetchRef.current || undefined)
      }, pollAfterRef.current * 1000)
    }

    const handleVisibility = () => {
      if (!document.hidden) {
        // Immediate fetch on tab refocus
        doFetch(lastFetchRef.current || undefined)
        startPolling()
      }
    }

    startPolling()
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(intervalRef.current)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [initialDone, doFetch])

  const refresh = useCallback(() => doFetch(), [doFetch])

  return { loading, refresh }
}
```

**Step 2: Verify**

Run: `cd apps/frontend && bun run build`
Expected: Build succeeds.

**Step 3: Commit**

```
feat(frontend): add inbox polling hook with visibility awareness
```

---

## Task 9: InboxCard Component

**Files:**
- Create: `apps/frontend/src/components/operator/InboxCard.tsx`

**Step 1: Write the component**

```tsx
import { useState, useCallback } from 'react'
import { MessageSquare, FileText, X } from 'lucide-react'
import type { InboxItem } from '@/lib/operator'

function formatTimeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

interface InboxCardProps {
  item: InboxItem
  onDismiss: (item: InboxItem) => Promise<void>
  onNavigate: (item: InboxItem) => void
}

export function InboxCard({ item, onDismiss, onNavigate }: InboxCardProps) {
  const [dismissing, setDismissing] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const handleDismiss = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation()
      if (dismissing) return
      setDismissing(true)
      try {
        await onDismiss(item)
        setDismissed(true)
      } catch {
        setDismissing(false)
      }
    },
    [item, onDismiss, dismissing],
  )

  if (dismissed) return null

  if (item.kind === 'thread') {
    const t = item.data
    return (
      <button
        type="button"
        onClick={() => onNavigate(item)}
        className="flex w-full items-start gap-3 border-b border-foreground/5 px-4 py-3 text-left transition-colors hover:bg-foreground/[0.03] active:bg-foreground/5"
      >
        <MessageSquare
          size={16}
          className="mt-0.5 shrink-0 text-foreground/30"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-foreground/80">
            {t.last_body_preview || `Thread ${t.thread_id.slice(0, 8)}`}
          </p>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-foreground/35">
            <span>
              {t.new_message_count} new message
              {t.new_message_count !== 1 ? 's' : ''}
            </span>
            {t.last_intent && (
              <span className="rounded-full bg-status-warning/10 px-1.5 py-px text-[10px] font-medium text-status-warning">
                {t.last_intent}
              </span>
            )}
            <span>{formatTimeAgo(t.updated_at)}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          disabled={dismissing}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground/20 transition-colors hover:bg-foreground/10 hover:text-foreground/50 active:scale-95"
          title="Dismiss"
        >
          <X size={14} />
        </button>
      </button>
    )
  }

  const a = item.data
  return (
    <button
      type="button"
      onClick={() => onNavigate(item)}
      className="flex w-full items-start gap-3 border-b border-foreground/5 px-4 py-3 text-left transition-colors hover:bg-foreground/[0.03] active:bg-foreground/5"
    >
      <FileText size={16} className="mt-0.5 shrink-0 text-foreground/30" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-foreground/80">
          {a.title || `Asset ${a.asset_id.slice(0, 8)}`}
        </p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-foreground/35">
          <span>
            {a.new_version_count} new version
            {a.new_version_count !== 1 ? 's' : ''}
          </span>
          <span>v{a.latest_version}</span>
          <span>{formatTimeAgo(a.updated_at)}</span>
        </div>
      </div>
      {/* Assets don't have dismiss — they show until acknowledged */}
      <div className="w-10 shrink-0" />
    </button>
  )
}
```

**Step 2: Verify**

Run: `cd apps/frontend && bun run build`
Expected: Build succeeds.

**Step 3: Commit**

```
feat(frontend): add InboxCard component for unified feed items
```

---

## Task 10: InboxFeed Component

**Files:**
- Create: `apps/frontend/src/components/operator/InboxFeed.tsx`

**Step 1: Write the component**

```tsx
import { useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAtomValue, useSetAtom } from 'jotai'
import { Inbox } from 'lucide-react'
import { inboxItemsAtom, inboxLoadingAtom } from '@/_jotai/operator/operator.atoms'
import { dismissThread, type InboxItem } from '@/lib/operator'
import { InboxCard } from './InboxCard'
import { toast } from 'react-toastify'

export function InboxFeed() {
  const items = useAtomValue(inboxItemsAtom)
  const loading = useAtomValue(inboxLoadingAtom)
  const setItems = useSetAtom(inboxItemsAtom)
  const navigate = useNavigate()

  const handleDismiss = useCallback(
    async (item: InboxItem) => {
      if (item.kind !== 'thread') return
      try {
        await dismissThread(item.data.thread_id)
        setItems((prev) =>
          prev.filter(
            (i) =>
              !(
                i.kind === 'thread' &&
                i.data.thread_id === item.data.thread_id
              ),
          ),
        )
        toast.success('Thread dismissed')
      } catch {
        toast.error('Failed to dismiss thread')
        throw new Error('dismiss failed')
      }
    },
    [setItems],
  )

  const handleNavigate = useCallback(
    (item: InboxItem) => {
      if (item.kind === 'thread') {
        navigate({ to: '/operator/threads/$threadId', params: { threadId: item.data.thread_id } })
      } else {
        navigate({ to: '/operator/assets/$publicId', params: { publicId: item.data.asset_id } })
      }
    },
    [navigate],
  )

  if (loading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-8 w-8 animate-pulse rounded-full bg-foreground/5" />
        <p className="mt-3 text-xs text-foreground/25">Loading inbox...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground/5">
          <Inbox size={18} className="text-foreground/15" />
        </div>
        <p className="mt-3 text-sm font-medium text-foreground/30">
          No new activity
        </p>
        <p className="mt-1 text-[11px] text-foreground/20">
          New messages and asset updates will appear here
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-foreground/5">
      {items.map((item) => {
        const key =
          item.kind === 'thread'
            ? `t-${item.data.thread_id}`
            : `a-${item.data.asset_id}`
        return (
          <InboxCard
            key={key}
            item={item}
            onDismiss={handleDismiss}
            onNavigate={handleNavigate}
          />
        )
      })}
    </div>
  )
}
```

**Step 2: Verify**

Run: `cd apps/frontend && bun run build`
Expected: Build succeeds.

**Step 3: Commit**

```
feat(frontend): add InboxFeed component for unified inbox view
```

---

## Task 11: Inbox Page (Route)

**Files:**
- Create: `apps/frontend/src/app/operator/index.tsx`

**Step 1: Write the route**

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { InboxFeed } from '@/components/operator/InboxFeed'
import { useInboxPolling } from '@/components/operator/useInboxPolling'

export const Route = createFileRoute('/operator/')({
  component: OperatorInboxPage,
})

function OperatorInboxPage() {
  useInboxPolling()

  return <InboxFeed />
}
```

**Step 2: Verify**

Run: `cd apps/frontend && bun run dev`
Expected: Route tree regenerates. Navigating to `/operator` (with a valid session cookie) shows the inbox feed. Without a session, redirects to auth page.

**Step 3: Commit**

```
feat(frontend): add operator inbox page with polling
```

---

## Task 12: Operator Asset List Page

**Files:**
- Create: `apps/frontend/src/components/operator/OperatorAssetList.tsx`
- Create: `apps/frontend/src/app/operator/assets/index.tsx`

**Step 1: Write the asset list component**

```tsx
import { useEffect, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAtomValue, useSetAtom } from 'jotai'
import { Package, RefreshCw } from 'lucide-react'
import {
  operatorAssetsAtom,
  operatorAssetsLoadingAtom,
} from '@/_jotai/operator/operator.atoms'
import { fetchOperatorAssets } from '@/lib/operator'

function formatTimeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function typeBadge(type: string) {
  const colors: Record<string, string> = {
    markdown: 'bg-blue-500/10 text-blue-500',
    html: 'bg-orange-500/10 text-orange-500',
    code: 'bg-green-500/10 text-green-500',
    json: 'bg-yellow-500/10 text-yellow-500',
    text: 'bg-foreground/10 text-foreground/50',
    file: 'bg-foreground/10 text-foreground/50',
    chart: 'bg-purple-500/10 text-purple-500',
  }
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[10px] font-medium uppercase ${colors[type] || colors.file}`}
    >
      {type}
    </span>
  )
}

export function OperatorAssetList() {
  const assets = useAtomValue(operatorAssetsAtom)
  const loading = useAtomValue(operatorAssetsLoadingAtom)
  const setAssets = useSetAtom(operatorAssetsAtom)
  const setLoading = useSetAtom(operatorAssetsLoadingAtom)
  const navigate = useNavigate()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchOperatorAssets({ limit: 50 })
      setAssets(data)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [setAssets, setLoading])

  useEffect(() => {
    load()
  }, [load])

  if (loading && assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-8 w-8 animate-pulse rounded-full bg-foreground/5" />
        <p className="mt-3 text-xs text-foreground/25">Loading assets...</p>
      </div>
    )
  }

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground/5">
          <Package size={18} className="text-foreground/15" />
        </div>
        <p className="mt-3 text-sm font-medium text-foreground/30">
          No assets yet
        </p>
        <p className="mt-1 text-[11px] text-foreground/20">
          Assets created by your agent will appear here
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-end px-4 py-2">
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-foreground/40 transition-colors hover:bg-foreground/5 hover:text-foreground/60"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>
      <div>
        {assets.map((asset) => (
          <button
            key={asset.id}
            type="button"
            onClick={() =>
              navigate({
                to: '/operator/assets/$publicId',
                params: { publicId: asset.id },
              })
            }
            className="flex w-full items-center gap-3 border-b border-foreground/5 px-4 py-3 text-left transition-colors hover:bg-foreground/[0.03] active:bg-foreground/5"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground/80">
                {asset.title || asset.id.slice(0, 8)}
              </p>
              <p className="mt-0.5 text-xs text-foreground/35">
                Created {formatTimeAgo(asset.createdAt)} · Updated{' '}
                {formatTimeAgo(asset.updatedAt)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-xs text-foreground/30">
                v{asset.versionCount}
              </span>
              {typeBadge(asset.type)}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
```

**Step 2: Write the route**

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { OperatorAssetList } from '@/components/operator/OperatorAssetList'

export const Route = createFileRoute('/operator/assets/')({
  component: OperatorAssetsPage,
})

function OperatorAssetsPage() {
  return <OperatorAssetList />
}
```

**Step 3: Verify**

Run: `cd apps/frontend && bun run dev`
Expected: Route tree regenerates. `/operator/assets` shows the asset list (or empty state).

**Step 4: Commit**

```
feat(frontend): add operator asset list page
```

---

## Task 13: OperatorToolbar Component

**Files:**
- Create: `apps/frontend/src/components/operator/OperatorToolbar.tsx`

**Step 1: Write the component**

A horizontal action bar that appears above content on detail pages. Adapts actions based on context. On mobile, secondary actions collapse into a dropdown.

```tsx
import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft, MoreVertical } from 'lucide-react'

export interface ToolbarAction {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  destructive?: boolean
  primary?: boolean
}

interface OperatorToolbarProps {
  title?: string
  actions?: ToolbarAction[]
  backTo?: string
}

export function OperatorToolbar({ title, actions = [], backTo }: OperatorToolbarProps) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleBack = useCallback(() => {
    if (backTo) {
      navigate({ to: backTo })
    } else {
      window.history.back()
    }
  }, [navigate, backTo])

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [menuOpen])

  // On mobile (< 640px), show only primary action; rest in menu
  // On desktop, show all actions inline
  const primaryAction = actions.find((a) => a.primary)
  const secondaryActions = actions.filter((a) => !a.primary)

  return (
    <div className="flex items-center gap-2 border-b border-foreground/10 px-4 py-2">
      <button
        type="button"
        onClick={handleBack}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-foreground/40 transition-colors hover:bg-foreground/5 hover:text-foreground/60 active:scale-95"
        title="Back"
      >
        <ArrowLeft size={18} />
      </button>

      {title && (
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground/60">
          {title}
        </span>
      )}
      {!title && <div className="flex-1" />}

      {/* Desktop: show all actions */}
      <div className="hidden gap-2 sm:flex">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors active:scale-95 ${
              action.destructive
                ? 'text-status-error hover:bg-status-error/10'
                : 'text-foreground/50 hover:bg-foreground/5 hover:text-foreground/70'
            }`}
          >
            <span className="flex items-center gap-1.5">
              {action.icon}
              {action.label}
            </span>
          </button>
        ))}
      </div>

      {/* Mobile: primary action + overflow menu */}
      <div className="flex gap-2 sm:hidden">
        {primaryAction && (
          <button
            type="button"
            onClick={primaryAction.onClick}
            className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors active:scale-95 ${
              primaryAction.destructive
                ? 'text-status-error hover:bg-status-error/10'
                : 'text-foreground/50 hover:bg-foreground/5'
            }`}
          >
            <span className="flex items-center gap-1.5">
              {primaryAction.icon}
              {primaryAction.label}
            </span>
          </button>
        )}
        {secondaryActions.length > 0 && (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground/40 transition-colors hover:bg-foreground/5"
            >
              <MoreVertical size={16} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-lg border border-foreground/10 bg-background py-1 shadow-lg">
                {secondaryActions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      action.onClick()
                    }}
                    className={`flex w-full items-center gap-2 px-4 py-3 text-left text-sm transition-colors hover:bg-foreground/5 ${
                      action.destructive
                        ? 'text-status-error'
                        : 'text-foreground/70'
                    }`}
                  >
                    {action.icon}
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
```

**Step 2: Verify**

Run: `cd apps/frontend && bun run build`
Expected: Build succeeds.

**Step 3: Commit**

```
feat(frontend): add OperatorToolbar with responsive action layout
```

---

## Task 14: Asset Detail Page

**Files:**
- Create: `apps/frontend/src/app/operator/assets/$publicId.tsx`

**Step 1: Write the route**

This page reuses `SharePageContent` with an `OperatorToolbar` for the destroy action.

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Provider } from 'jotai'
import { Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { SharePageContent } from '@/components/SharePageContent'
import { OperatorToolbar, type ToolbarAction } from '@/components/operator/OperatorToolbar'
import { ConfirmDialog } from '@/components/operator/ConfirmDialog'
import { destroyAsset } from '@/lib/operator'

export const Route = createFileRoute('/operator/assets/$publicId')({
  component: OperatorAssetDetailPage,
})

function OperatorAssetDetailPage() {
  const { publicId } = Route.useParams()
  const navigate = useNavigate()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [destroying, setDestroying] = useState(false)

  const handleDestroy = useCallback(async () => {
    if (destroying) return
    setDestroying(true)
    try {
      await destroyAsset(publicId)
      toast.success('Asset destroyed')
      navigate({ to: '/operator/assets' })
    } catch {
      toast.error('Failed to destroy asset')
    } finally {
      setDestroying(false)
      setConfirmOpen(false)
    }
  }, [publicId, navigate, destroying])

  const actions: ToolbarAction[] = [
    {
      label: destroying ? 'Destroying...' : 'Destroy',
      icon: <Trash2 size={14} />,
      onClick: () => setConfirmOpen(true),
      destructive: true,
      primary: true,
    },
  ]

  return (
    <div>
      <OperatorToolbar
        title=""
        actions={actions}
        backTo="/operator/assets"
      />
      <Provider>
        <SharePageContent uuid={publicId} />
      </Provider>
      <ConfirmDialog
        open={confirmOpen}
        title="Destroy asset"
        message="This will permanently delete all versions and close all related threads. This cannot be undone."
        confirmLabel={destroying ? 'Destroying...' : 'Destroy'}
        destructive
        onConfirm={handleDestroy}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
```

**Step 2: Verify**

Run: `cd apps/frontend && bun run dev`
Expected: `/operator/assets/:publicId` renders the asset viewer with a "Destroy" button in the toolbar. Clicking "Destroy" shows confirmation dialog.

**Step 3: Commit**

```
feat(frontend): add operator asset detail page with destroy action
```

---

## Task 15: Thread Detail Page

**Files:**
- Create: `apps/frontend/src/app/operator/threads/$threadId.tsx`

**Step 1: Write the route**

This page reuses `ThreadView` with `OperatorToolbar` for close/dismiss actions. It fetches thread metadata to determine ownership and state.

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback, useEffect } from 'react'
import { Provider } from 'jotai'
import { useAtomValue } from 'jotai'
import { X, Lock, EyeOff } from 'lucide-react'
import { toast } from 'react-toastify'
import { ThreadView } from '@/components/ThreadView'
import { OperatorToolbar, type ToolbarAction } from '@/components/operator/OperatorToolbar'
import { ConfirmDialog } from '@/components/operator/ConfirmDialog'
import { operatorAgentAtom } from '@/_jotai/operator/operator.atoms'
import {
  fetchOperatorThread,
  fetchOperatorMessages,
  postOperatorMessage,
  updateThread,
  dismissThread,
  type ThreadUpdate,
} from '@/lib/operator'
import type { ThreadMeta } from '@/lib/thread'

export const Route = createFileRoute('/operator/threads/$threadId')({
  component: OperatorThreadDetailPage,
})

function OperatorThreadDetailPage() {
  const { threadId } = Route.useParams()
  const agent = useAtomValue(operatorAgentAtom)
  const [thread, setThread] = useState<ThreadMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [confirmClose, setConfirmClose] = useState(false)
  const [threadState, setThreadState] = useState<string>('open')

  useEffect(() => {
    fetchOperatorThread(threadId)
      .then((data: ThreadMeta) => {
        setThread(data)
        setThreadState(data.state || 'open')
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [threadId])

  const handleFetchMessages = useCallback(
    async (sinceSequence?: number) => {
      return fetchOperatorMessages(threadId, sinceSequence)
    },
    [threadId],
  )

  const handleSendMessage = useCallback(
    async (body: string) => {
      return postOperatorMessage(threadId, body)
    },
    [threadId],
  )

  const handleClose = useCallback(async () => {
    try {
      await updateThread(threadId, { state: 'closed' })
      setThreadState('closed')
      toast.success('Thread closed')
    } catch (err: any) {
      const errorCode = err.response?.data?.error
      if (errorCode === 'NOT_THREAD_OWNER') {
        toast.error('Only the thread owner can close this thread')
      } else {
        toast.error('Failed to close thread')
      }
    } finally {
      setConfirmClose(false)
    }
  }, [threadId])

  const handleDismiss = useCallback(async () => {
    try {
      await dismissThread(threadId)
      toast.success('Thread dismissed from inbox')
    } catch {
      toast.error('Failed to dismiss thread')
    }
  }, [threadId])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="h-8 w-8 animate-pulse rounded-full bg-foreground/5" />
        <p className="mt-3 text-xs text-foreground/25">Loading thread...</p>
      </div>
    )
  }

  if (!thread || error) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-foreground/35">
          Thread not found or access denied.
        </p>
      </div>
    )
  }

  const isClosed = threadState === 'closed'
  const isOwner = agent && thread.owner_id === agent.agent_id

  const actions: ToolbarAction[] = [
    {
      label: 'Dismiss',
      icon: <EyeOff size={14} />,
      onClick: handleDismiss,
      primary: true,
    },
  ]

  if (isOwner && !isClosed) {
    actions.push({
      label: 'Close',
      icon: <Lock size={14} />,
      onClick: () => setConfirmClose(true),
    })
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col">
      <OperatorToolbar
        title={`Thread ${threadId.slice(0, 8)}`}
        actions={actions}
        backTo="/operator"
      />

      {isClosed && (
        <div className="border-b border-foreground/10 bg-foreground/[0.03] px-4 py-2 text-center text-xs text-foreground/40">
          This thread is closed. No new messages can be posted.
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <Provider>
          {isClosed ? (
            <ThreadViewClosed fetchMessages={handleFetchMessages} />
          ) : (
            <ThreadView
              fetchMessages={handleFetchMessages}
              sendMessage={handleSendMessage}
            />
          )}
        </Provider>
      </div>

      <ConfirmDialog
        open={confirmClose}
        title="Close thread"
        message="No new messages can be posted after closing. This cannot be undone."
        confirmLabel="Close thread"
        onConfirm={handleClose}
        onCancel={() => setConfirmClose(false)}
      />
    </div>
  )
}

/**
 * Read-only thread view for closed threads.
 * Renders messages without the composer.
 */
function ThreadViewClosed({
  fetchMessages,
}: {
  fetchMessages: (sinceSequence?: number) => Promise<any[]>
}) {
  return (
    <ThreadView
      fetchMessages={fetchMessages}
      sendMessage={async () => {
        toast.error('This thread is closed')
      }}
      disabled
    />
  )
}
```

**Step 2: Update ThreadView to accept a `disabled` prop**

Modify `apps/frontend/src/components/ThreadView.tsx` to accept an optional `disabled` prop that hides the composer.

In the `ThreadViewProps` interface, add:
```typescript
disabled?: boolean
```

In the return JSX, wrap the `MessageComposer` with a conditional:
```tsx
{!disabled && <MessageComposer onSend={handleSend} />}
```

Specifically, change line 153 from:
```tsx
      <MessageComposer onSend={handleSend} />
```
to:
```tsx
      {!disabled && <MessageComposer onSend={handleSend} />}
```

And add `disabled` to the props destructuring on line 46:
```tsx
export function ThreadView({ fetchMessages, sendMessage, emptyText, disabled }: ThreadViewProps)
```

And add it to the interface around line 16:
```typescript
interface ThreadViewProps {
  fetchMessages: (sinceSequence?: number) => Promise<ThreadMessage[]>
  sendMessage: (body: string) => Promise<ThreadMessage | void>
  emptyText?: string
  disabled?: boolean
}
```

**Step 3: Verify**

Run: `cd apps/frontend && bun run dev`
Expected: `/operator/threads/:threadId` renders the thread with operator actions. Closed threads show the banner and hide the composer.

**Step 4: Commit**

```
feat(frontend): add operator thread detail page with close/dismiss actions
```

---

## Task 16: Integration Verification

**No new files.** This task verifies everything works end-to-end.

**Step 1: Start the backend and frontend**

```bash
cd apps/backend && bun run start:dev &
cd apps/frontend && bun run dev &
```

**Step 2: Generate an operator link**

From the CLI, run:
```bash
tokenrip operator-link
```

This outputs a URL like: `http://localhost:3333/operator/auth?token=<payload>.<signature>`

**Step 3: Test the auth flow**

1. Open the operator link in a browser
2. If first time: fill in display name, submit → should redirect to `/operator`
3. If returning: should auto-redirect to `/operator`

**Step 4: Test the inbox**

1. On `/operator`, verify the inbox shows threads and asset updates
2. Tap a thread card → navigates to `/operator/threads/:id`
3. Tap the dismiss button (X) on a thread → thread disappears
4. Verify polling: wait 30 seconds, check for new data

**Step 5: Test asset management**

1. Navigate to `/operator/assets`
2. Verify asset list loads
3. Tap an asset → navigates to `/operator/assets/:id`
4. Verify the asset viewer renders correctly (same as public view)
5. Click "Destroy" → confirmation dialog appears
6. Confirm → asset destroyed, redirect to list, toast shown

**Step 6: Test thread actions**

1. Navigate to a thread via inbox
2. Post a message → appears in the thread
3. If thread owner: click "Close" → confirmation → thread closed, composer hidden, banner shown
4. Click "Dismiss" → toast shown

**Step 7: Test mobile**

1. Open Chrome DevTools → toggle device toolbar (Ctrl+Shift+M)
2. Set to iPhone 12 or similar
3. Navigate through all pages
4. Verify: touch targets are comfortable, no horizontal scroll, toolbar actions collapse to menu, cards are full-width

**Step 8: Verify no regressions**

1. Open `/s/:uuid` (public asset page) → should work as before
2. Open `/threads/:threadId?cap=...` (public thread page) → should work as before
3. Verify the homepage (`/`) is unchanged

**Step 9: Commit**

If any fixes were needed during verification, commit them:
```
fix(frontend): integration fixes for operator dashboard
```

---

## Notes for the Implementing Engineer

### Backend Endpoint Gaps

The operator endpoints cover actions but may not cover all reads:
- **Thread metadata**: `GET /v0/threads/:threadId` might not accept user session auth. If it returns 401, the backend needs a `GET /v0/operator/threads/:threadId` endpoint. Check during Task 15.
- **Thread messages**: Same applies to `GET /v0/threads/:threadId/messages`. If session auth isn't accepted, backend needs a `GET /v0/operator/threads/:threadId/messages` endpoint.
- **Message sender field**: The operator `POST /v0/operator/threads/:threadId/messages` response might not include the `sender` field that `ThreadMessage` expects. If missing, construct it from the operator's user ID.

### TanStack Router Auto-Generation

Every time you add a new file in `src/app/`, the route tree (`src/routeTree.gen.ts`) regenerates automatically when the dev server is running. If it doesn't, restart the dev server. Never edit `routeTree.gen.ts` manually.

### Cookie Auth vs CORS

When running frontend on `localhost:3333` and backend on `localhost:3434`, cookies require proper CORS. Ensure the backend has:
```
Access-Control-Allow-Origin: http://localhost:3333
Access-Control-Allow-Credentials: true
```

If the backend uses `@nestjs/common` CORS config, it should already handle this. If not, add it to the NestJS bootstrap (`main.ts`).

### Thread `owner_id` vs `created_by`

The thread model has both `owner_id` (immutable owner) and `created_by` (creator). For "can close" checks, use `owner_id`. The `ThreadMeta` type from `lib/thread.ts` has `created_by` but might not have `owner_id`. You may need to extend the type or check the actual API response shape.

### File Structure Summary

```
apps/frontend/src/
├── app/
│   ├── operator.tsx                          (layout — wraps /operator/*)
│   └── operator/
│       ├── auth.tsx                          (/operator/auth)
│       ├── index.tsx                         (/operator/ — inbox)
│       ├── assets/
│       │   ├── index.tsx                     (/operator/assets)
│       │   └── $publicId.tsx                 (/operator/assets/:publicId)
│       └── threads/
│           └── $threadId.tsx                 (/operator/threads/:threadId)
├── components/operator/
│   ├── ConfirmDialog.tsx
│   ├── InboxCard.tsx
│   ├── InboxFeed.tsx
│   ├── OperatorAssetList.tsx
│   ├── OperatorAuthPage.tsx
│   ├── OperatorShell.tsx
│   ├── OperatorToolbar.tsx
│   └── useInboxPolling.ts
├── lib/
│   ├── operator.ts                           (API types + functions)
│   └── session.ts                            (cookie helper)
└── _jotai/operator/
    └── operator.atoms.ts
```
