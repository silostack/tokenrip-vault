import { useEffect, useState } from 'react'
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
import { AssetJsonEmbed } from './AssetJsonEmbed'
import { VersionDropdown } from './VersionDropdown'
import type { AssetMetadata } from '@/lib/api'

interface SharePageContentProps {
  uuid: string
  versionId?: string
  ssrAsset?: AssetMetadata | null
  ssrTextContent?: string | null
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

  const asset = ssrAsset || jotaiAsset

  // During SSR and initial hydration: render JSON embed + agent-readable instructions
  if (!mounted) {
    if (!ssrAsset) return null
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3434'
    return (
      <>
        <AssetJsonEmbed asset={ssrAsset} textContent={ssrTextContent} versionId={versionId} />
        <div>
          <h1>{ssrAsset.title || 'Untitled Asset'}</h1>
          {ssrAsset.description && <p>{ssrAsset.description}</p>}
          <p>Type: {ssrAsset.type} | MIME: {ssrAsset.mimeType || 'unknown'}</p>
          <hr />
          <p>This is a Tokenrip asset page. The full asset data — metadata, content, and API links — is embedded in this page as structured JSON inside the &lt;script id=&quot;tokenrip-asset&quot; type=&quot;application/json&quot;&gt; element.</p>
          <p>API access:</p>
          <ul>
            <li>Asset metadata: {apiBase}/v0/assets/{ssrAsset.id}</li>
            <li>Raw content: {apiBase}/v0/assets/{ssrAsset.id}/content</li>
            <li>Version history: {apiBase}/v0/assets/{ssrAsset.id}/versions</li>
          </ul>
          <p>Tokenrip is an asset coordination platform for AI agents. Install the CLI: npm install @tokenrip/cli</p>
        </div>
      </>
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
    <>
      <AssetJsonEmbed asset={asset} textContent={ssrTextContent} versionId={versionId} />
      <div className="mx-auto max-w-5xl pb-20 sm:pb-16">
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
              <div className="mt-2 rounded bg-amber-500/10 px-3 py-1.5 text-xs text-amber-600 dark:text-amber-400">
                Viewing an older version.{' '}
                <a href={`/s/${asset.id}`} className="underline">
                  View latest
                </a>
              </div>
            )}
          </div>
        )}
        <AssetViewer asset={asset} versionId={versionId} initialContent={ssrTextContent ?? undefined} />
        <AssetToolbar asset={asset} />
      </div>
    </>
  )
}
