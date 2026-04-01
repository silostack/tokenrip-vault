import { useEffect, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import type { ArtifactMetadata } from '@/lib/api'

interface MetadataSheetProps {
  artifact: ArtifactMetadata
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

export function MetadataSheet({ artifact, onClose }: MetadataSheetProps) {
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
      <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/80">
        {artifact.type}
      </span>
    ),
  })

  if (artifact.createdAt) {
    rows.push({ label: 'Created', value: formatDate(artifact.createdAt) })
  }

  if (artifact.mimeType && artifact.type === 'file') {
    rows.push({ label: 'MIME Type', value: artifact.mimeType })
  }

  if (artifact.creatorContext) {
    rows.push({ label: 'Creator', value: artifact.creatorContext })
  }

  if (artifact.parentArtifactId) {
    rows.push({
      label: 'Parent',
      value: (
        <Link
          to="/s/$uuid"
          params={{ uuid: artifact.parentArtifactId }}
          className="text-white/80 underline decoration-white/30 hover:text-white hover:decoration-white/60"
        >
          {artifact.parentArtifactId}
        </Link>
      ),
    })
  }

  if (artifact.inputReferences && artifact.inputReferences.length > 0) {
    rows.push({
      label: 'References',
      value: (
        <div className="flex flex-col gap-1">
          {artifact.inputReferences.map((ref) => (
            <a
              key={ref}
              href={ref}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-white/80 underline decoration-white/30 hover:text-white hover:decoration-white/60"
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
      className="w-full max-w-5xl rounded-t-xl border border-b-0 border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md sm:px-6 sm:py-4"
    >
      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline gap-4">
            <span className="w-20 shrink-0 text-xs text-white/40 sm:w-24">
              {row.label}
            </span>
            <span className="min-w-0 text-sm text-white/80">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
