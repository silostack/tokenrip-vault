import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useCallback, useEffect, useState } from 'react'
import { Provider } from 'jotai'
import { ThreadView } from '@/components/ThreadView'
import {
  fetchThread as fetchThreadClient,
  fetchMessages as fetchMessagesApi,
  postMessage as postMessageApi,
  type ThreadMeta,
} from '@/lib/thread'
import { API_URL } from '@/config'

const fetchThreadSSR = createServerFn({ method: 'GET' }).handler(
  async ({ data }: { data: { threadId: string; token: string } }) => {
    try {
      const res = await fetch(
        `${API_URL}/v0/threads/${data.threadId}?cap=${encodeURIComponent(data.cap)}`,
      )
      if (!res.ok) return null
      const json = await res.json()
      return json.data as ThreadMeta
    } catch {
      return null
    }
  },
)

export const Route = createFileRoute('/threads/$threadId')({
  head: () => ({
    meta: [{ name: 'robots', content: 'noindex, follow' }],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    cap: (search.cap as string) || '',
  }),
  loader: ({ params, search }) => {
    // search may be undefined during SSR in TanStack Start
    if (!search?.cap) return { thread: null }
    return fetchThreadSSR({ data: { threadId: params.threadId, cap: search.cap } })
      .then((thread) => ({ thread }))
  },
  component: ThreadPage,
})

function hashToHue(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % 360
}

function formatThreadAge(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return 'Just started'
  if (seconds < 3600) return `Started ${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `Started ${Math.floor(seconds / 3600)}h ago`
  const days = Math.floor(seconds / 86400)
  if (days === 1) return 'Started yesterday'
  if (days < 30) return `Started ${days}d ago`
  return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' })
}

function ThreadPage() {
  const { threadId } = Route.useParams()
  const { cap } = Route.useSearch()
  const loaderData = Route.useLoaderData()
  const [thread, setThread] = useState<ThreadMeta | null>(loaderData?.thread ?? null)
  const [loading, setLoading] = useState(!loaderData?.thread && !!cap)
  const [error, setError] = useState(false)

  // Client-side fallback: fetch thread when SSR didn't have search params
  useEffect(() => {
    if (thread || !cap) return
    setLoading(true)
    fetchThreadClient(threadId, cap)
      .then(setThread)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [threadId, cap, thread])

  const handleFetchMessages = useCallback(
    async (sinceSequence?: number) => {
      if (!cap) return []
      return fetchMessagesApi(threadId, cap, sinceSequence)
    },
    [threadId, cap],
  )

  const handleSendMessage = useCallback(
    async (body: string) => {
      if (!cap) return
      return postMessageApi(threadId, cap, body)
    },
    [threadId, cap],
  )

  if (!cap) {
    return (
      <div className="flex items-center justify-center py-24 text-foreground/40">
        A capability token is required to view this thread. Add ?cap=... to the URL.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="h-8 w-8 animate-pulse rounded-full bg-foreground/5" />
        <p className="mt-3 text-xs text-foreground/25">Loading thread…</p>
      </div>
    )
  }

  if (!thread || error) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-foreground/35">Thread not found or access denied.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col">
      {/* Thread header */}
      <div className="flex items-center justify-between border-b border-foreground/10 px-6 py-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-xs text-foreground/25">#</span>
            <h1 className="font-mono text-sm font-medium tracking-tight text-foreground/60">
              {thread.id.slice(0, 8)}
            </h1>
            {thread.resolution && (
              <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-status-success/10 px-2 py-0.5 text-[10px] font-medium text-status-success">
                Resolved
              </span>
            )}
          </div>
          <p className="mt-1 text-[11px] text-foreground/25">
            {formatThreadAge(thread.created_at)} · {thread.participants.length} participant{thread.participants.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Participant avatars */}
        <div className="flex shrink-0 -space-x-1.5 pl-4">
          {thread.participants.slice(0, 4).map((p) => {
            const pid = p.agent_id || p.user_id || p.id
            const hue = hashToHue(pid)
            return (
              <div
                key={p.id}
                className="thread-avatar flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold ring-2 ring-background select-none"
                style={{ '--avatar-hue': hue } as React.CSSProperties}
              >
                {pid.slice(0, 2).toUpperCase()}
              </div>
            )
          })}
          {thread.participants.length > 4 && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground/10 text-[9px] font-medium text-foreground/40 ring-2 ring-background">
              +{thread.participants.length - 4}
            </div>
          )}
        </div>
      </div>

      {/* Thread view */}
      <div className="flex-1 overflow-hidden">
        <Provider>
          <ThreadView
            fetchMessages={handleFetchMessages}
            sendMessage={handleSendMessage}
          />
        </Provider>
      </div>
    </div>
  )
}
