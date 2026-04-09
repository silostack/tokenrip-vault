import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useCallback } from 'react'
import { Provider } from 'jotai'
import { Trash2, Share2, Check } from 'lucide-react'
import { toast } from 'react-toastify'
import { SharePageContent } from '@/components/SharePageContent'
import { OperatorToolbar, type ToolbarAction } from '@/components/operator/OperatorToolbar'
import { ConfirmDialog } from '@/components/operator/ConfirmDialog'
import { destroyAsset, createShareToken } from '@/lib/operator'

export const Route = createFileRoute('/operator/assets/$publicId')({
  component: OperatorAssetDetailPage,
})

function OperatorAssetDetailPage() {
  const { publicId } = Route.useParams()
  const navigate = useNavigate()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [destroying, setDestroying] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [shared, setShared] = useState(false)

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

  const actions: ToolbarAction[] = [
    {
      label: shared ? 'Copied!' : 'Copy edit link',
      icon: shared ? <Check size={14} /> : <Share2 size={14} />,
      onClick: handleShare,
      primary: true,
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
        <SharePageContent uuid={publicId} />
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
