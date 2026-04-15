import { useEffect, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAtomValue, useSetAtom } from 'jotai'
import { Package, RefreshCw } from 'lucide-react'
import { formatTimeAgo } from '@/utils/time'
import {
  operatorAssetsAtom,
  operatorAssetsLoadingAtom,
} from '@/_jotai/operator/operator.atoms'
import { fetchOperatorAssets } from '@/lib/operator'

function typeBadge(type: string) {
  const colors: Record<string, string> = {
    markdown: 'bg-blue-500/10 text-blue-500',
    html: 'bg-orange-500/10 text-orange-500',
    code: 'bg-green-500/10 text-green-500',
    json: 'bg-yellow-500/10 text-yellow-500',
    text: 'bg-foreground/10 text-foreground/50',
    file: 'bg-foreground/10 text-foreground/50',
    chart: 'bg-purple-500/10 text-purple-500',
    collection: 'bg-teal-500/10 text-teal-500',
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
