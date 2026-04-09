import { useEffect, useState, useCallback, useMemo } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import {
  assetAtom,
  isLoadingAssetAtom,
  assetErrorAtom,
  versionsAtom,
  activeVersionIdAtom,
} from '@/_jotai/asset/asset.atoms'
import { useAssetActions } from '@/_jotai/asset/asset.actions'
import { AssetViewer } from './AssetViewer'
import { AssetToolbar } from './AssetToolbar'
import { VersionDropdown } from './VersionDropdown'
import { CommentPanel } from './CommentPanel'
import { fetchAssetMessages } from '@/lib/thread'
import type { AssetMetadata } from '@/lib/api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3434'

interface SharePageContentProps {
  uuid: string
  versionId?: string
  ssrAsset?: AssetMetadata | null
  ssrTextContent?: string | null
}

function StaticContent({ asset, textContent, versionId }: { asset: AssetMetadata; textContent?: string | null; versionId?: string }) {
  const contentUrl = versionId
    ? `${API_URL}/v0/assets/${asset.id}/versions/${versionId}/content`
    : `${API_URL}/v0/assets/${asset.id}/content`

  if (textContent != null) {
    switch (asset.type) {
      case 'markdown':
        return <div>{textContent}</div>
      case 'code':
        return <pre><code>{textContent}</code></pre>
      case 'json': {
        let formatted = textContent
        try { formatted = JSON.stringify(JSON.parse(textContent), null, 2) } catch {}
        return <pre>{formatted}</pre>
      }
      case 'html':
      case 'text':
      case 'chart':
        return <pre>{textContent}</pre>
    }
  }

  if (asset.mimeType?.startsWith('image/')) {
    return <img src={contentUrl} alt={asset.title || 'Image asset'} />
  }

  return <a href={contentUrl}>Download: {asset.title || 'asset'}</a>
}

export function SharePageContent({ uuid, versionId, ssrAsset, ssrTextContent }: SharePageContentProps) {
  const [mounted, setMounted] = useState(false)
  const jotaiAsset = useAtomValue(assetAtom)
  const isLoading = useAtomValue(isLoadingAssetAtom)
  const error = useAtomValue(assetErrorAtom)
  const versions = useAtomValue(versionsAtom)
  const activeVersionId = useAtomValue(activeVersionIdAtom)
  const setAsset = useSetAtom(assetAtom)
  const setIsLoading = useSetAtom(isLoadingAssetAtom)
  const setActiveVersionId = useSetAtom(activeVersionIdAtom)
  const { fetchAsset, fetchVersions } = useAssetActions()

  useEffect(() => {
    setMounted(true)
    if (ssrAsset) {
      setAsset(ssrAsset)
      setIsLoading(false)
      setActiveVersionId(versionId || null)
    } else {
      fetchAsset(uuid, versionId)
    }
  }, [uuid, versionId])

  const [panelOpen, setPanelOpen] = useState(false)
  const [commentCount, setCommentCount] = useState<number | undefined>(undefined)

  const cap = useMemo(
    () => (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('cap') : null),
    [],
  )

  useEffect(() => {
    if (!cap || !mounted) return
    fetchAssetMessages(uuid, cap)
      .then((result) => setCommentCount(result.messages.length))
      .catch(() => {})
  }, [uuid, cap, mounted])

  const togglePanel = useCallback(() => setPanelOpen((prev) => !prev), [])

  const asset = ssrAsset || jotaiAsset

  // During SSR and initial hydration: render raw content directly
  if (!mounted) {
    if (!ssrAsset) return null
    return (
      <article className="sr-only">
        <StaticContent asset={ssrAsset} textContent={ssrTextContent} versionId={versionId} />
      </article>
    )
  }

  if (!ssrAsset && isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-foreground/40">
        Loading...
      </div>
    )
  }

  if (!asset) {
    return (
      <div className="flex items-center justify-center py-24 text-foreground/40">
        {error || 'Asset not found.'}
      </div>
    )
  }

  const showVersions = asset.versionCount != null && asset.versionCount > 1
  const isOlderVersion = activeVersionId != null && activeVersionId !== asset.currentVersionId

  return (
    <div className={`mx-auto pb-20 sm:pb-16 transition-all duration-200 ${panelOpen ? 'md:mr-[380px] md:max-w-[calc(100vw-380px-2rem)]' : 'max-w-5xl'}`}>
      {(asset.title || showVersions) && (
        <div className="border-b border-foreground/10 px-6 py-4">
          <div className="flex items-center gap-3">
            {asset.title && (
              <h1 className="font-mono text-xl font-bold">{asset.title}</h1>
            )}
            {showVersions && (
              <VersionDropdown
                uuid={asset.id}
                versions={versions}
                activeVersionId={activeVersionId}
                currentVersionId={asset.currentVersionId}
                versionCount={asset.versionCount}
                onOpen={() => fetchVersions(uuid)}
              />
            )}
          </div>
          {asset.description && (
            <p className="mt-1 text-sm text-foreground/60">
              {asset.description}
            </p>
          )}
          {isOlderVersion && (
            <div className="mt-2 rounded bg-status-warning/10 px-3 py-1.5 text-xs text-status-warning">
              Viewing an older version.{' '}
              <a href={`/s/${asset.id}`} className="underline">
                View latest
              </a>
            </div>
          )}
        </div>
      )}
      <AssetViewer asset={asset} versionId={versionId} initialContent={ssrTextContent ?? undefined} />
      <AssetToolbar
        asset={asset}
        cap={cap}
        commentCount={commentCount}
        commentPanelOpen={panelOpen}
        onToggleComments={togglePanel}
      />
      {cap && (
        <CommentPanel
          publicId={uuid}
          cap={cap}
          open={panelOpen}
          onClose={() => setPanelOpen(false)}
        />
      )}
    </div>
  )
}
