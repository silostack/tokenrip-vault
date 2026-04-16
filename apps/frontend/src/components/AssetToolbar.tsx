import { useState, useCallback, useRef } from 'react'
import { Link as LinkIcon, Check, Copy, Download, Info, MessageCircle, ExternalLink } from 'lucide-react'
import type { AssetMetadata } from '@/lib/api'
import { getAssetContentUrl, getVersionContentUrl } from '@/lib/api'
import { MetadataSheet } from './MetadataSheet'

const TEXT_TYPES = new Set(['markdown', 'html', 'code', 'text', 'json', 'csv'])

interface AssetToolbarProps {
  asset: AssetMetadata
  activeVersionId?: string | null
  cap?: string | null
  commentCount?: number
  commentPanelOpen?: boolean
  onToggleComments?: () => void
}

export function AssetToolbar({ asset, activeVersionId, cap, commentCount, commentPanelOpen, onToggleComments }: AssetToolbarProps) {
  const [copied, setCopied] = useState(false)
  const [contentCopied, setContentCopied] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const copyTimeout = useRef<ReturnType<typeof setTimeout>>()
  const copyContentTimeout = useRef<ReturnType<typeof setTimeout>>()

  const handleCopy = useCallback(() => {
    const publicUrl = cap
      ? `${window.location.origin}/s/${asset.id}?cap=${cap}`
      : `${window.location.origin}/s/${asset.id}`
    navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    clearTimeout(copyTimeout.current)
    copyTimeout.current = setTimeout(() => setCopied(false), 2000)
  }, [asset.id, cap])

  const handleCopyContent = useCallback(async () => {
    try {
      const url = getAssetContentUrl(asset.id)
      const res = await fetch(url)
      const text = await res.text()
      await navigator.clipboard.writeText(text)
      setContentCopied(true)
      clearTimeout(copyContentTimeout.current)
      copyContentTimeout.current = setTimeout(() => setContentCopied(false), 2000)
    } catch {
      // clipboard or fetch failed — no-op
    }
  }, [asset.id])

  const handleDownload = useCallback(async () => {
    const url = getAssetContentUrl(asset.id)
    const res = await fetch(url)
    const blob = await res.blob()
    const objectUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = objectUrl
    a.download = asset.title || asset.id
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(objectUrl)
  }, [asset.id, asset.title])

  const handleOpenStandalone = useCallback(() => {
    const url = activeVersionId
      ? getVersionContentUrl(asset.id, activeVersionId)
      : getAssetContentUrl(asset.id)
    window.open(url, '_blank')
  }, [asset.id, activeVersionId])

  const toggleSheet = useCallback(() => {
    setSheetOpen((prev) => !prev)
  }, [])

  return (
    <div className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2 sm:bottom-6">
      {/* Metadata sheet */}
      <div
        className={`transition-all duration-200 ease-out ${
          sheetOpen
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        {sheetOpen && (
          <MetadataSheet asset={asset} onClose={() => setSheetOpen(false)} />
        )}
      </div>

      {/* Toolbar pill */}
      <div className="flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/10 px-2 py-1.5 shadow-lg backdrop-blur-md sm:gap-1">
        {asset.type === 'html' && (
          <button
            type="button"
            onClick={handleOpenStandalone}
            title="Open standalone"
            className="flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full transition-colors [-webkit-tap-highlight-color:transparent] hover:bg-foreground/10 active:scale-95 active:bg-foreground/15"
          >
            <ExternalLink size={18} className="text-foreground/70" />
          </button>
        )}

        {TEXT_TYPES.has(asset.type) && (
          <button
            type="button"
            onClick={handleCopyContent}
            title="Copy content"
            className="flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full transition-colors [-webkit-tap-highlight-color:transparent] hover:bg-foreground/10 active:scale-95 active:bg-foreground/15"
          >
            {contentCopied ? (
              <Check size={18} className="text-status-success" />
            ) : (
              <Copy size={18} className="text-foreground/70" />
            )}
          </button>
        )}

        <button
          type="button"
          onClick={handleCopy}
          title={cap ? 'Copy link' : 'Copy view link'}
          className="flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full transition-colors [-webkit-tap-highlight-color:transparent] hover:bg-foreground/10 active:scale-95 active:bg-foreground/15"
        >
          {copied ? (
            <Check size={18} className="text-status-success" />
          ) : (
            <LinkIcon size={18} className="text-foreground/70" />
          )}
        </button>

        <button
          type="button"
          onClick={handleDownload}
          title="Download"
          className="flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full transition-colors [-webkit-tap-highlight-color:transparent] hover:bg-foreground/10 active:scale-95 active:bg-foreground/15"
        >
          <Download size={18} className="text-foreground/70" />
        </button>

        {cap && onToggleComments && (
          <button
            type="button"
            onClick={onToggleComments}
            title="Comments"
            className={`relative flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full transition-colors [-webkit-tap-highlight-color:transparent] hover:bg-foreground/10 active:scale-95 active:bg-foreground/15 ${
              commentPanelOpen ? 'bg-foreground/10' : ''
            }`}
          >
            <MessageCircle size={18} className={commentPanelOpen ? 'text-foreground' : 'text-foreground/70'} />
            {commentCount != null && commentCount > 0 && !commentPanelOpen && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground/80 px-1 text-[10px] font-bold text-background">
                {commentCount > 99 ? '99+' : commentCount}
              </span>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={toggleSheet}
          title="Metadata"
          className={`flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full transition-colors [-webkit-tap-highlight-color:transparent] hover:bg-foreground/10 active:scale-95 active:bg-foreground/15 ${
            sheetOpen ? 'bg-foreground/10' : ''
          }`}
        >
          <Info size={18} className={sheetOpen ? 'text-foreground' : 'text-foreground/70'} />
        </button>
      </div>
    </div>
  )
}
