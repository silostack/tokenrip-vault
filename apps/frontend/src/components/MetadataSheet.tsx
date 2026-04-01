import { useEffect, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import type { AssetMetadata } from '@/lib/api'

interface MetadataSheetProps {
  asset: AssetMetadata
  onClose: () => void
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function MetadataSheet({ asset, onClose }: MetadataSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (
        sheetRef.current &&
        !sheetRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [onClose])

  const rows: { label: string; value: React.ReactNode }[] = []

  rows.push({
    label: 'Type',
    value: (
      <span className="rounded-full bg-foreground/10 px-2.5 py-0.5 text-xs font-medium text-foreground/80">
        {asset.type}
      </span>
    ),
  })

  if (asset.createdAt) {
    rows.push({ label: 'Created', value: formatDate(asset.createdAt) })
  }

  if (asset.mimeType && asset.type === 'file') {
    rows.push({ label: 'MIME Type', value: asset.mimeType })
  }

  if (asset.creatorContext) {
    rows.push({ label: 'Creator', value: asset.creatorContext })
  }

  if (asset.parentAssetId) {
    rows.push({
      label: 'Parent',
      value: (
        <Link
          to="/s/$uuid"
          params={{ uuid: asset.parentAssetId }}
          className="text-foreground/80 underline decoration-foreground/30 hover:text-foreground hover:decoration-foreground/60"
        >
          {asset.parentAssetId}
        </Link>
      ),
    })
  }

  if (asset.inputReferences && asset.inputReferences.length > 0) {
    rows.push({
      label: 'References',
      value: (
        <div className="flex flex-col gap-1">
          {asset.inputReferences.map((ref) => (
            <a
              key={ref}
              href={ref}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-foreground/80 underline decoration-foreground/30 hover:text-foreground hover:decoration-foreground/60"
            >
              {ref}
            </a>
          ))}
        </div>
      ),
    })
  }

  return (
    <div
      ref={sheetRef}
      className="w-full max-w-5xl rounded-t-xl border border-b-0 border-foreground/10 bg-foreground/5 px-4 py-3 backdrop-blur-md sm:px-6 sm:py-4"
    >
      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline gap-4">
            <span className="w-20 shrink-0 text-xs text-foreground/40 sm:w-24">
              {row.label}
            </span>
            <span className="min-w-0 text-sm text-foreground/80">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
