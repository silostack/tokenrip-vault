import { Outlet, createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

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
    const id = loaderData?.id
    return {
      meta: [
        { title: `${title} — Tokenrip` },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'article' },
        { property: 'og:image', content: 'https://tokenrip.com/og-image.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: 'https://tokenrip.com/og-image.png' },
        // Agent-readable metadata
        ...(id ? [
          { name: 'tokenrip:id', content: id },
          { name: 'tokenrip:type', content: loaderData?.type || '' },
          { name: 'tokenrip:api', content: `${API_URL}/v0/assets/${id}` },
          { name: 'tokenrip:content', content: `${API_URL}/v0/assets/${id}/content` },
          { name: 'tokenrip:versions', content: `${API_URL}/v0/assets/${id}/versions` },
          { name: 'tokenrip:cli', content: 'npm install @tokenrip/cli' },
        ] : []),
      ],
    }
  },
  component: ShareLayout,
  notFoundComponent: () => (
    <div className="flex items-center justify-center py-24 text-foreground/40">
      Asset not found.
    </div>
  ),
})

function ShareLayout() {
  return <Outlet />
}
