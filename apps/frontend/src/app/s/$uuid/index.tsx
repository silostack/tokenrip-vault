import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { SharePageContent } from '@/components/SharePageContent'
import type { AssetMetadata } from '@/lib/api'
import { API_URL } from '@/config'

const TEXT_TYPES = new Set(['markdown', 'html', 'code', 'text', 'json', 'csv'])

const fetchAssetWithContent = createServerFn({ method: 'GET' }).handler(
  async ({ data }: { data: { uuid: string; cap?: string } }) => {
    try {
      const metaUrl = new URL(`${API_URL}/v0/assets/${data.uuid}`)
      if (data.cap) metaUrl.searchParams.set('cap', data.cap)
      const metaRes = await fetch(metaUrl.toString())
      if (!metaRes.ok) {
        if (metaRes.status === 410) {
          const body = await metaRes.json().catch(() => null)
          return { asset: null, textContent: null, destroyed: true, destroyedTitle: body?.data?.title ?? null, ssrRows: null, ssrNextCursor: null }
        }
        return { asset: null, textContent: null, destroyed: false, destroyedTitle: null, ssrRows: null, ssrNextCursor: null }
      }
      const metaJson = await metaRes.json()
      const asset = metaJson.data as AssetMetadata

      let textContent: string | null = null
      if (TEXT_TYPES.has(asset.type)) {
        const contentRes = await fetch(`${API_URL}/v0/assets/${data.uuid}/content`)
        if (contentRes.ok) {
          textContent = await contentRes.text()
        }
      }

      // SSR collection rows
      let ssrRows = null
      let ssrNextCursor = null
      if (asset.type === 'collection') {
        try {
          const rowsRes = await fetch(`${API_URL}/v0/assets/${data.uuid}/rows?limit=100`)
          if (rowsRes.ok) {
            const rowsJson = await rowsRes.json()
            ssrRows = rowsJson.data.rows
            ssrNextCursor = rowsJson.data.nextCursor
          }
        } catch {}
      }

      return { asset, textContent, destroyed: false, destroyedTitle: null, ssrRows, ssrNextCursor }
    } catch {
      return { asset: null, textContent: null, destroyed: false, destroyedTitle: null }
    }
  }
)

export const Route = createFileRoute('/s/$uuid/')({
  loader: ({ params, location }) => {
    const cap = new URLSearchParams(location.searchStr).get('cap') ?? undefined
    return fetchAssetWithContent({ data: { uuid: params.uuid, cap } })
  },
  component: SharePage,
})

function SharePage() {
  const { uuid } = Route.useParams()
  const { asset, textContent, destroyed, destroyedTitle, ssrRows, ssrNextCursor } = Route.useLoaderData()
  return <SharePageContent uuid={uuid} ssrAsset={asset} ssrTextContent={textContent} ssrDestroyed={destroyed} ssrDestroyedTitle={destroyedTitle} ssrRows={ssrRows} ssrNextCursor={ssrNextCursor} />
}
