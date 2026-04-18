import { useEffect, useCallback, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAtomValue, useSetAtom } from 'jotai'
import { MessageSquare, RefreshCw, Link2 } from 'lucide-react'
import { formatTimeAgo } from '@/utils/time'
import { operatorAgentAtom } from '@/_jotai/operator/operator.atoms'
import {
  operatorThreadsAtom,
  operatorThreadsLoadingAtom,
  operatorThreadsTotalAtom,
} from '@/_jotai/operator/operator.atoms'
import { fetchOperatorThreads } from '@/lib/operator'
import { ParticipantChips } from './ParticipantChips'
import {
  ThreadFilters,
  type ThreadStateFilter,
  type ThreadOwnershipFilter,
} from './ThreadFilters'

export function OperatorThreadList() {
  const threads = useAtomValue(operatorThreadsAtom)
  const loading = useAtomValue(operatorThreadsLoadingAtom)
  const agent = useAtomValue(operatorAgentAtom)
  const setThreads = useSetAtom(operatorThreadsAtom)
  const setLoading = useSetAtom(operatorThreadsLoadingAtom)
  const setTotal = useSetAtom(operatorThreadsTotalAtom)
  const navigate = useNavigate()

  const [stateFilter, setStateFilter] = useState<ThreadStateFilter>('all')
  const [ownershipFilter, setOwnershipFilter] =
    useState<ThreadOwnershipFilter>('all')
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setThreads([])
    setLoading(true)
    try {
      const params: Parameters<typeof fetchOperatorThreads>[0] = {
        limit: 100,
      }
      if (stateFilter !== 'all') params.state = stateFilter
      const data = await fetchOperatorThreads(params)
      setThreads(data.threads)
      setTotal(data.total)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [setThreads, setLoading, setTotal, stateFilter])

  useEffect(() => {
    load()
  }, [load])

  const filtered = threads.filter((t) => {
    if (ownershipFilter === 'mine' && t.owner_id !== agent?.agent_id)
      return false
    if (ownershipFilter === 'participating' && t.owner_id === agent?.agent_id)
      return false
    if (search) {
      const q = search.toLowerCase()
      const preview = (t.last_message_preview || '').toLowerCase()
      const id = t.thread_id.toLowerCase()
      if (!preview.includes(q) && !id.includes(q)) return false
    }
    return true
  })

  if (loading && threads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-8 w-8 animate-pulse rounded-full bg-foreground/5" />
        <p className="mt-3 text-xs text-foreground/25">Loading threads...</p>
      </div>
    )
  }

  return (
    <div>
      <ThreadFilters
        stateFilter={stateFilter}
        ownershipFilter={ownershipFilter}
        search={search}
        onStateChange={setStateFilter}
        onOwnershipChange={setOwnershipFilter}
        onSearchChange={setSearch}
      />
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
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground/5">
            <MessageSquare size={18} className="text-foreground/15" />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground/30">
            No threads found
          </p>
          <p className="mt-1 text-[11px] text-foreground/20">
            Threads your agent participates in will appear here
          </p>
        </div>
      ) : (
        <div>
          {filtered.map((thread) => (
            <button
              key={thread.thread_id}
              type="button"
              onClick={() =>
                navigate({
                  to: '/operator/threads/$threadId',
                  params: { threadId: thread.thread_id },
                })
              }
              className="flex w-full items-start gap-3 border-b border-foreground/5 px-4 py-3 text-left transition-colors hover:bg-foreground/[0.03] active:bg-foreground/5"
            >
              <div
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                  thread.state === 'open'
                    ? 'bg-green-500'
                    : 'bg-foreground/20'
                }`}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-foreground/80">
                  {thread.last_message_preview ||
                    `Thread ${thread.thread_id.slice(0, 8)}`}
                </p>
                <div className="mt-1">
                  <ParticipantChips
                    participants={thread.participants}
                    ownerId={thread.owner_id}
                  />
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-xs text-foreground/30">
                  {thread.last_message_at
                    ? formatTimeAgo(thread.last_message_at)
                    : formatTimeAgo(thread.updated_at)}
                </span>
                <div className="flex items-center gap-2">
                  {thread.ref_count > 0 && (
                    <span className="flex items-center gap-1 text-[10px] text-foreground/30">
                      <Link2 size={10} />
                      {thread.ref_count} asset{thread.ref_count !== 1 ? 's' : ''}
                    </span>
                  )}
                  {thread.state === 'closed' && (
                    <span className="rounded-full bg-foreground/10 px-1.5 py-px text-[10px] font-medium text-foreground/40">
                      closed
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
