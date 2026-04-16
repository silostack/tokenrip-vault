import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Provider } from 'jotai'
import { Trash2, Share2, Check, Archive, ArchiveRestore } from 'lucide-react'
import { toast } from 'react-toastify'
import api from '@/utils/api'
import { SharePageContent } from '@/components/SharePageContent'
import { OperatorToolbar, type ToolbarAction } from '@/components/operator/OperatorToolbar'
import { ConfirmDialog } from '@/components/operator/ConfirmDialog'
import { destroyAsset, createShareToken, archiveAsset, unarchiveAsset } from '@/lib/operator'

/**
 * Shared implementation for /operator/assets/$publicId and /operator/assets/$publicId/$versionId.
 * Keeps toolbar state + modal logic in one place so both the latest-version and specific-version
 * routes render identically.
 */
export function OperatorAssetDetail({ publicId, versionId }: { publicId: string; versionId?: string }) {
  const navigate = useNavigate()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [destroying, setDestroying] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [shared, setShared] = useState(false)
  const [assetState, setAssetState] = useState<string>('published')
  const [archiving, setArchiving] = useState(false)

  useEffect(() => {
    api.get(`/v0/assets/${publicId}`).then((res) => {
      setAssetState(res.data.data.state ?? 'published')
    }).catch(() => {})
  }, [publicId])

  const handleDestroy = useCallback(async () => {
    if (destroying) return
    setDestroying(true)
    try {
      await destroyAsset(publicId)
      toast.success('Asset destroyed')
      navigate({ to: '/operator/assets' })
    } catch {
      toast.error('Failed to destroy asset')
      setDestroying(false)
      setConfirmOpen(false)
    }
  }, [publicId, navigate, destroying])

  const handleShare = useCallback(async () => {
    if (sharing) return
    setSharing(true)
    try {
      const result = await createShareToken(publicId, { expires_in: '30d' })
      await navigator.clipboard.writeText(result.url)
      setShared(true)
      setTimeout(() => setShared(false), 3000)
    } catch {
      toast.error('Failed to create share link')
    } finally {
      setSharing(false)
    }
  }, [publicId, sharing])

  const handleArchiveToggle = useCallback(async () => {
    if (archiving) return
    setArchiving(true)
    try {
      if (assetState === 'archived') {
        await unarchiveAsset(publicId)
        setAssetState('published')
        toast.success('Asset unarchived')
      } else {
        await archiveAsset(publicId)
        setAssetState('archived')
        toast.success('Asset archived')
      }
    } catch {
      toast.error(assetState === 'archived' ? 'Failed to unarchive' : 'Failed to archive')
    } finally {
      setArchiving(false)
    }
  }, [publicId, assetState, archiving])

  const isArchived = assetState === 'archived'

  const actions: ToolbarAction[] = [
    {
      label: shared ? 'Copied!' : 'Copy edit link',
      icon: shared ? <Check size={14} /> : <Share2 size={14} />,
      onClick: handleShare,
      primary: true,
    },
    {
      label: archiving ? (isArchived ? 'Unarchiving...' : 'Archiving...') : (isArchived ? 'Unarchive' : 'Archive'),
      icon: isArchived ? <ArchiveRestore size={14} /> : <Archive size={14} />,
      onClick: handleArchiveToggle,
    },
    {
      label: destroying ? 'Destroying...' : 'Destroy',
      icon: <Trash2 size={14} />,
      onClick: () => setConfirmOpen(true),
      destructive: true,
    },
  ]

  return (
    <>
      <OperatorToolbar backTo="/operator/assets" actions={actions} />
      <Provider>
        <SharePageContent uuid={publicId} versionId={versionId} />
      </Provider>
      <ConfirmDialog
        open={confirmOpen}
        title="Destroy asset"
        message="This will permanently delete all versions and close all related threads. This cannot be undone."
        confirmLabel="Destroy"
        destructive
        onConfirm={handleDestroy}
        onCancel={() => {
          if (!destroying) setConfirmOpen(false)
        }}
      />
    </>
  )
}
