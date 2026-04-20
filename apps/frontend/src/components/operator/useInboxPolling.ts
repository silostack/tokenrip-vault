import { useEffect, useRef, useCallback, useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import { inboxItemsAtom, inboxLoadingAtom, inboxSearchAtom, inboxStateFilterAtom } from '@/_jotai/operator/operator.atoms'
import { activeTeamSlugAtom } from '@/_jotai/operator/team-filter.atoms'
import { fetchInbox, mergeInboxItems, type InboxItem, type InboxFetchOpts } from '@/lib/operator'

function getItemId(item: InboxItem): string {
  return item.kind === 'thread' ? item.data.thread_id : item.data.asset_id
}

export function useInboxPolling() {
  const setItems = useSetAtom(inboxItemsAtom)
  const setLoading = useSetAtom(inboxLoadingAtom)
  const loading = useAtomValue(inboxLoadingAtom)
  const search = useAtomValue(inboxSearchAtom)
  const stateFilter = useAtomValue(inboxStateFilterAtom)
  const activeTeamSlug = useAtomValue(activeTeamSlugAtom)
  const pollAfterRef = useRef(30)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastFetchRef = useRef<string | null>(null)
  const [initialDone, setInitialDone] = useState(false)

  const doFetch = useCallback(
    async (since?: string) => {
      try {
        const opts: InboxFetchOpts = { limit: 50 }
        if (search) opts.q = search
        if (stateFilter !== 'all') {
          opts.state = stateFilter
          opts.type = 'thread'
        }
        if (activeTeamSlug) opts.team = activeTeamSlug
        if (since) opts.since = since
        const data = await fetchInbox(opts)
        const merged = mergeInboxItems(data)
        if (since) {
          setItems((prev) => {
            const mergedMap = new Map(merged.map((m) => [getItemId(m), m]))
            const updated = prev.map((existing) => mergedMap.get(getItemId(existing)) ?? existing)
            const existingIds = new Set(prev.map(getItemId))
            const newItems = merged.filter((m) => !existingIds.has(getItemId(m)))
            return [...newItems, ...updated].sort(
              (a, b) =>
                new Date(b.data.updated_at).getTime() -
                new Date(a.data.updated_at).getTime(),
            )
          })
        } else {
          setItems(merged)
        }
        pollAfterRef.current = data.poll_after || 30
        lastFetchRef.current = new Date().toISOString()
      } catch {
        // silent poll failure
      }
    },
    [setItems, search, stateFilter, activeTeamSlug],
  )

  // Initial fetch + re-fetch when filters change
  useEffect(() => {
    lastFetchRef.current = null
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
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => {
        if (document.hidden) return
        doFetch(lastFetchRef.current || undefined)
      }, pollAfterRef.current * 1000)
    }

    const handleVisibility = () => {
      if (!document.hidden) {
        doFetch(lastFetchRef.current || undefined)
        startPolling()
      }
    }

    startPolling()
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [initialDone, doFetch])

  const refresh = useCallback(() => doFetch(), [doFetch])

  return { loading, refresh }
}
