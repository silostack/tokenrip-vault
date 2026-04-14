import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { SharePageContent } from '@/components/SharePageContent'
import type { AssetMetadata } from '@/lib/api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3434'

const TEXT_TYPES = new Set(['markdown', 'html', 'code', 'text', 'json'])

const fetchAssetVersionWithContent = createServerFn({ method: 'GET' }).handler(
  async ({ data }: { data: { uuid: string; versionId: string; cap?: string } }) => {
    try {
      const metaUrl = new URL(`${API_URL}/v0/assets/${data.uuid}`)
      if (data.cap) metaUrl.searchParams.set('cap', data.cap)
      const metaRes = await fetch(metaUrl.toString())
      if (!metaRes.ok) {
        if (metaRes.status === 410) {
          const body = await metaRes.json().catch(() => null)
          return { asset: null, textContent: null, destroyed: true, destroyedTitle: body?.data?.title ?? null }
        }
        return { asset: null, textContent: null, destroyed: false, destroyedTitle: null }
      }
      const metaJson = await metaRes.json()
      const asset = metaJson.data as AssetMetadata

      let textContent: string | null = null
      if (TEXT_TYPES.has(asset.type)) {
        const contentRes = await fetch(
          `${API_URL}/v0/assets/${data.uuid}/versions/${data.versionId}/content`
        )
        if (contentRes.ok) {
          textContent = await contentRes.text()
        }
      }

      return { asset, textContent, destroyed: false, destroyedTitle: null }
    } catch {
      return { asset: null, textContent: null, destroyed: false, destroyedTitle: null }
    }
  }
)

export const Route = createFileRoute('/s/$uuid/$versionId')({
  loader: ({ params, location }) => {
    const cap = new URLSearchParams(location.searchStr).get('cap') ?? undefined
    return fetchAssetVersionWithContent({ data: { uuid: params.uuid, versionId: params.versionId, cap } })
  },
  component: ShareVersionPage,
})

function ShareVersionPage() {
  const { uuid, versionId } = Route.useParams()
  const { asset, textContent, destroyed, destroyedTitle } = Route.useLoaderData()
  return (
    <SharePageContent
      uuid={uuid}
      versionId={versionId}
      ssrAsset={asset}
      ssrTextContent={textContent}
      ssrDestroyed={destroyed}
      ssrDestroyedTitle={destroyedTitle}
    />
  )
}
