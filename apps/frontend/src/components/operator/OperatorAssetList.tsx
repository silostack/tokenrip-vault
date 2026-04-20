import { useEffect, useCallback, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAtomValue, useSetAtom } from 'jotai'
import { Package, MessageSquare } from 'lucide-react'
import { formatTimeAgo } from '@/utils/time'
import {
  operatorAssetsAtom,
  operatorAssetsLoadingAtom,
} from '@/_jotai/operator/operator.atoms'
import { activeTeamSlugAtom } from '@/_jotai/operator/team-filter.atoms'
import { fetchOperatorAssets } from '@/lib/operator'
import { Badge } from '@/components/ui/Badge'

type AssetFilter = 'active' | 'archived' | 'all'

export function OperatorAssetList() {
  const assets = useAtomValue(operatorAssetsAtom)
  const loading = useAtomValue(operatorAssetsLoadingAtom)
  const setAssets = useSetAtom(operatorAssetsAtom)
  const setLoading = useSetAtom(operatorAssetsLoadingAtom)
  const navigate = useNavigate()
  const [filter, setFilter] = useState<AssetFilter>('active')
  const activeTeamSlug = useAtomValue(activeTeamSlugAtom)

  const load = useCallback(async () => {
    setAssets([])
    setLoading(true)
    try {
      const params: Parameters<typeof fetchOperatorAssets>[0] = { limit: 50 }
      if (filter === 'archived') params.archived = true
      else if (filter === 'all') params.include_archived = true
      if (activeTeamSlug) params.team = activeTeamSlug
      const data = await fetchOperatorAssets(params)
      setAssets(data)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [setAssets, setLoading, filter, activeTeamSlug])

  useEffect(() => {
    load()
  }, [load])

  if (loading && assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-8 w-8 animate-pulse rounded-full bg-foreground/5" />
        <p className="mt-3 font-mono text-[11px] text-foreground/25">Loading…</p>
      </div>
    )
  }

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Package size={20} strokeWidth={1.5} className="text-foreground/15" />
        <p className="mt-3 text-sm text-foreground/30">
          No assets yet
        </p>
        <p className="mt-1 font-mono text-[11px] text-foreground/20">
          Assets created by your agent will appear here
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="border-b border-foreground/5 px-4 py-3">
        <div className="flex gap-1">
          {(['active', 'archived', 'all'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-mono font-medium tracking-wide transition-colors ${
                filter === f
                  ? 'bg-foreground/10 text-foreground/70'
                  : 'text-foreground/30 hover:text-foreground/50'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="divide-y divide-foreground/5">
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
            className="flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-foreground/[0.03] active:bg-foreground/[0.05]"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className={`truncate text-sm font-medium ${asset.state === 'archived' ? 'text-foreground/40' : 'text-foreground/80'}`}>
                  {asset.title || asset.id.slice(0, 8)}
                </p>
                <span className="shrink-0 font-mono text-[11px] text-foreground/30">
                  {formatTimeAgo(asset.updatedAt)}
                </span>
              </div>
              {asset.description && (
                <p className="mt-0.5 truncate text-xs text-foreground/30">
                  {asset.description}
                </p>
              )}
              <div className="mt-1 flex items-center gap-2 font-mono text-[11px] text-foreground/30">
                <span>v{asset.versionCount}</span>
                {asset.threadCount > 0 && (
                  <span className="flex items-center gap-1">
                    <MessageSquare size={10} strokeWidth={1.5} />
                    {asset.threadCount}
                  </span>
                )}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 pt-0.5">
              {asset.state === 'archived' && (
                <Badge size="sm">archived</Badge>
              )}
              <Badge size="sm">{asset.type}</Badge>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
