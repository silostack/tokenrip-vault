import { useState, useRef, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ChevronDown } from 'lucide-react'
import type { VersionInfo } from '@/lib/api'

interface VersionDropdownProps {
  uuid: string
  versions: VersionInfo[]
  activeVersionId: string | null
  currentVersionId?: string
  versionCount?: number
  onOpen?: () => void
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function VersionDropdown({
  uuid,
  versions,
  activeVersionId,
  currentVersionId,
  versionCount,
  onOpen,
}: VersionDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const activeVersion = versions.find((v) => v.id === activeVersionId)
  const isLatest = !activeVersionId || activeVersionId === currentVersionId

  const latestVersionNumber = versions[0]?.version ?? versionCount ?? '?'
  const label = isLatest
    ? `v${latestVersionNumber} (latest)`
    : `v${activeVersion?.version ?? '?'}${activeVersion?.label ? ` — ${activeVersion.label}` : ''}`

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          const willOpen = !open
          setOpen(willOpen)
          if (willOpen) onOpen?.()
        }}
        className="flex items-center gap-1 rounded-md border border-foreground/10 px-2 py-1 text-xs text-foreground/60 transition-colors hover:bg-foreground/5"
      >
        {label}
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[200px] rounded-md border border-foreground/10 bg-background shadow-lg">
          <button
            type="button"
            onClick={() => {
              navigate({ to: '/s/$uuid', params: { uuid } })
              setOpen(false)
            }}
            className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors hover:bg-foreground/5 ${isLatest ? 'text-foreground font-medium' : 'text-foreground/60'}`}
          >
            <span>Latest</span>
          </button>

          <div className="border-t border-foreground/10" />

          {versions.map((v) => {
            const isActive = v.id === activeVersionId || (isLatest && v.id === currentVersionId)
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  navigate({ to: '/s/$uuid/$versionId', params: { uuid, versionId: v.id } })
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors hover:bg-foreground/5 ${isActive ? 'text-foreground font-medium' : 'text-foreground/60'}`}
              >
                <span>
                  v{v.version}
                  {v.label ? ` — ${v.label}` : ''}
                </span>
                <span className="ml-3 text-foreground/30">{timeAgo(v.createdAt)}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
