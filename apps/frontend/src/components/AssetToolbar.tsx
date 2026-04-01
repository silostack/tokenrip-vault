import { useState, useCallback, useRef } from 'react'
import { Link as LinkIcon, Check, Download, Info } from 'lucide-react'
import type { AssetMetadata } from '@/lib/api'
import { getAssetContentUrl } from '@/lib/api'
import { MetadataSheet } from './MetadataSheet'

interface AssetToolbarProps {
  asset: AssetMetadata
}

export function AssetToolbar({ asset }: AssetToolbarProps) {
  const [copied, setCopied] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const copyTimeout = useRef<ReturnType<typeof setTimeout>>()

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    clearTimeout(copyTimeout.current)
    copyTimeout.current = setTimeout(() => setCopied(false), 2000)
  }, [])

  const handleDownload = useCallback(() => {
    const a = document.createElement('a')
    a.href = getAssetContentUrl(asset.id)
    a.download = asset.title || asset.id
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }, [asset.id, asset.title])

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
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-2 py-1.5 shadow-lg backdrop-blur-md sm:gap-1">
        <button
          type="button"
          onClick={handleCopy}
          title="Copy link"
          className="flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full transition-colors [-webkit-tap-highlight-color:transparent] hover:bg-white/10 active:scale-95 active:bg-white/15"
        >
          {copied ? (
            <Check size={18} className="text-green-400" />
          ) : (
            <LinkIcon size={18} className="text-white/70" />
          )}
        </button>

        <button
          type="button"
          onClick={handleDownload}
          title="Download"
          className="flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full transition-colors [-webkit-tap-highlight-color:transparent] hover:bg-white/10 active:scale-95 active:bg-white/15"
        >
          <Download size={18} className="text-white/70" />
        </button>

        <button
          type="button"
          onClick={toggleSheet}
          title="Metadata"
          className={`flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full transition-colors [-webkit-tap-highlight-color:transparent] hover:bg-white/10 active:scale-95 active:bg-white/15 ${
            sheetOpen ? 'bg-white/10' : ''
          }`}
        >
          <Info size={18} className={sheetOpen ? 'text-white' : 'text-white/70'} />
        </button>
      </div>
    </div>
  )
}
