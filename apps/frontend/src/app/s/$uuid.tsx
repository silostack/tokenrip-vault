import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useAtomValue } from 'jotai'
import {
  assetAtom,
  isLoadingAssetAtom,
  assetErrorAtom,
} from '@/_jotai/asset/asset.atoms'
import { useAssetActions } from '@/_jotai/asset/asset.actions'
import { AssetViewer } from '@/components/AssetViewer'
import { AssetToolbar } from '@/components/AssetToolbar'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3434'

const fetchAssetMeta = createServerFn({ method: 'GET' }).handler(
  async ({ data: uuid }: { data: string }) => {
    try {
      const res = await fetch(`${API_URL}/v0/assets/${uuid}`)
      if (!res.ok) return null
      const json = await res.json()
      return json.data as { id: string; title?: string; description?: string; type: string } | null
    } catch {
      return null
    }
  }
)

export const Route = createFileRoute('/s/$uuid')({
  loader: ({ params }) => fetchAssetMeta({ data: params.uuid }),
  head: ({ loaderData }) => {
    const title = loaderData?.title || 'Shared Asset'
    const description = loaderData?.description || `A ${loaderData?.type || 'shared'} asset on Tokenrip`
    return {
      meta: [
        { title: `${title} — Tokenrip` },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'article' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
      ],
    }
  },
  component: SharePage,
  notFoundComponent: () => (
    <div className="flex items-center justify-center py-24 text-white/40">
      Asset not found.
    </div>
  ),
})

function SharePage() {
  const { uuid } = Route.useParams()
  const asset = useAtomValue(assetAtom)
  const isLoading = useAtomValue(isLoadingAssetAtom)
  const error = useAtomValue(assetErrorAtom)
  const { fetchAsset } = useAssetActions()

  useEffect(() => {
    fetchAsset(uuid)
  }, [uuid])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-white/40">
        Loading...
      </div>
    )
  }

  if (error || !asset) {
    return (
      <div className="flex items-center justify-center py-24 text-white/40">
        {error || 'Asset not found.'}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl pb-20 sm:pb-16">
      {asset.title && (
        <div className="border-b border-white/10 px-6 py-4">
          <h1 className="font-mono text-xl font-bold">{asset.title}</h1>
          {asset.description && (
            <p className="mt-1 text-sm text-white/60">
              {asset.description}
            </p>
          )}
        </div>
      )}
      <AssetViewer asset={asset} />
      <AssetToolbar asset={asset} />
    </div>
  )
}
