import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { SharePageContent } from '@/components/SharePageContent'
import type { AssetMetadata } from '@/lib/api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3434'

const TEXT_TYPES = new Set(['markdown', 'html', 'code', 'text', 'json'])

const fetchAssetWithContent = createServerFn({ method: 'GET' }).handler(
  async ({ data }: { data: { uuid: string } }) => {
    try {
      const metaRes = await fetch(`${API_URL}/v0/assets/${data.uuid}`)
      if (!metaRes.ok) return { asset: null, textContent: null }
      const metaJson = await metaRes.json()
      const asset = metaJson.data as AssetMetadata

      let textContent: string | null = null
      if (TEXT_TYPES.has(asset.type)) {
        const contentRes = await fetch(`${API_URL}/v0/assets/${data.uuid}/content`)
        if (contentRes.ok) {
          textContent = await contentRes.text()
        }
      }

      return { asset, textContent }
    } catch {
      return { asset: null, textContent: null }
    }
  }
)

export const Route = createFileRoute('/s/$uuid/')({
  loader: ({ params }) => fetchAssetWithContent({ data: { uuid: params.uuid } }),
  component: SharePage,
})

function SharePage() {
  const { uuid } = Route.useParams()
  const { asset, textContent } = Route.useLoaderData()
  return <SharePageContent uuid={uuid} ssrAsset={asset} ssrTextContent={textContent} />
}
