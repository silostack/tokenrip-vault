import { useState, useEffect, useRef } from 'react'
import { useAtom } from 'jotai'
import { twMerge } from 'tailwind-merge'
import { assetDrawerOpenAtom, assetDrawerTabAtom, type DrawerTab } from '@/_jotai/operator/drawer.atoms'
import { Drawer } from '@/components/ui/Drawer'
import { Badge } from '@/components/ui/Badge'
import api from '@/utils/api'

interface AssetDrawerProps {
  publicId: string
}

const TABS: { key: DrawerTab; label: string }[] = [
  { key: 'comments', label: 'Comments' },
  { key: 'versions', label: 'Versions' },
  { key: 'activity', label: 'Activity' },
  { key: 'details', label: 'Details' },
]

interface AssetVersion {
  id: string
  created_at?: string
  createdAt?: string
}

interface AssetDetails {
  type: string
  owner_alias?: string
  agent_id?: string
  agentId?: string
  created_at?: string
  createdAt?: string
  updated_at?: string
  updatedAt?: string
  teams?: Array<{ slug: string; name: string }>
  public_id?: string
}

export function AssetDrawer({ publicId }: AssetDrawerProps) {
  const [open, setOpen] = useAtom(assetDrawerOpenAtom)
  const [tab, setTab] = useAtom(assetDrawerTabAtom)
  const [versions, setVersions] = useState<AssetVersion[]>([])
  const [details, setDetails] = useState<AssetDetails | null>(null)
  const fetchedRef = useRef<{ versions: boolean; details: boolean }>({ versions: false, details: false })

  useEffect(() => {
    fetchedRef.current = { versions: false, details: false }
    setVersions([])
    setDetails(null)
  }, [publicId])

  useEffect(() => {
    if (!open) return
    if (tab === 'versions' && !fetchedRef.current.versions) {
      fetchedRef.current.versions = true
      api.get(`/v0/assets/${publicId}/versions`).then((res) => {
        setVersions(res.data.data || [])
      }).catch(() => {})
    }
    if (tab === 'details' && !fetchedRef.current.details) {
      fetchedRef.current.details = true
      api.get(`/v0/assets/${publicId}`).then((res) => {
        setDetails(res.data.data)
      }).catch(() => {})
    }
  }, [open, tab, publicId])

  return (
    <Drawer open={open} onClose={() => setOpen(false)} title="Asset Controls">
      <div className="flex border-b border-foreground/10 px-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={twMerge(
              'border-b-2 px-3 py-2.5 text-[11px] font-mono font-medium uppercase tracking-wide transition-colors',
              tab === t.key
                ? 'border-signal-accent text-foreground'
                : 'border-transparent text-foreground/40 hover:text-foreground/60',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="p-4">
        {tab === 'comments' && <CommentsTab />}
        {tab === 'versions' && <VersionsTab versions={versions} publicId={publicId} />}
        {tab === 'activity' && <ActivityTab />}
        {tab === 'details' && <DetailsTab details={details} />}
      </div>
    </Drawer>
  )
}

function CommentsTab() {
  return (
    <p className="text-xs text-foreground/40">
      Comment thread will be integrated here.
    </p>
  )
}

function VersionsTab({ versions, publicId }: { versions: AssetVersion[]; publicId: string }) {
  if (versions.length === 0) {
    return <p className="text-xs text-foreground/40">No versions found</p>
  }
  return (
    <div className="flex flex-col gap-1">
      {versions.map((v, i) => (
        <a
          key={v.id}
          href={`/operator/assets/${publicId}/${v.id}`}
          className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-foreground/5"
        >
          <span className="font-mono text-foreground/60">v{versions.length - i}</span>
          {i === 0 && <Badge size="sm" variant="accent">current</Badge>}
          <span className="font-mono text-[11px] text-foreground/30">
            {new Date(v.created_at ?? v.createdAt ?? '').toLocaleDateString()}
          </span>
        </a>
      ))}
    </div>
  )
}

function ActivityTab() {
  return (
    <p className="text-xs text-foreground/40">
      Activity feed — data source TBD based on backend support.
    </p>
  )
}

function DetailsTab({ details }: { details: AssetDetails | null }) {
  if (!details) return <p className="text-xs text-foreground/40">Loading…</p>
  return (
    <div className="flex flex-col gap-4">
      <DetailField label="Type" value={details.type} />
      <DetailField
        label="Owner"
        value={details.owner_alias || details.agent_id?.slice(0, 16) || details.agentId?.slice(0, 16) || '—'}
        mono
      />
      <DetailField
        label="Created"
        value={new Date(details.created_at ?? details.createdAt ?? '').toLocaleString()}
      />
      <DetailField
        label="Updated"
        value={new Date(details.updated_at ?? details.updatedAt ?? '').toLocaleString()}
      />
      {details.teams && details.teams.length > 0 && (
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/30">Shared to</p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {details.teams.map((t) => (
              <Badge key={t.slug} size="md">{t.name}</Badge>
            ))}
          </div>
        </div>
      )}
      {details.public_id && (
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/30">Public URL</p>
          <p className="mt-0.5 break-all font-mono text-xs text-foreground/60">
            {`${window.location.origin}/s/${details.public_id}`}
          </p>
        </div>
      )}
    </div>
  )
}

function DetailField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/30">{label}</p>
      <p className={twMerge('mt-0.5 text-sm text-foreground/70', mono && 'font-mono text-xs text-foreground/60')}>{value}</p>
    </div>
  )
}
