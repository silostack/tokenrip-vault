import { Outlet, createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { NotFound } from '@/components/NotFound'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3434'
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://tokenrip.com'
const TEXT_TYPES = new Set(['markdown', 'html', 'code', 'text', 'json'])

interface AssetMeta {
  id: string
  alias?: string
  title?: string
  description?: string
  type: string
  mimeType?: string
  metadata?: Record<string, unknown>
  versionCount?: number
  createdAt?: string
  contentSnippet?: string
}

function stripMarkup(raw: string): string {
  return raw
    .replace(/<[^>]+>/g, '')        // strip HTML tags
    .replace(/[#*_`~\[\]()>|=-]/g, '') // strip markdown syntax
    .replace(/\s+/g, ' ')
    .trim()
}

function sanitizeForMeta(str: string): string {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

const fetchAssetMeta = createServerFn({ method: 'GET' }).handler(
  async ({ data: uuid }: { data: string }) => {
    try {
      const res = await fetch(`${API_URL}/v0/assets/${uuid}`)
      if (!res.ok) return null
      const json = await res.json()
      const d = json.data as AssetMeta

      // Fetch content snippet for description fallback
      let contentSnippet: string | undefined
      if (!d.description && TEXT_TYPES.has(d.type)) {
        try {
          const contentRes = await fetch(`${API_URL}/v0/assets/${uuid}/content`)
          if (contentRes.ok) {
            const raw = await contentRes.text()
            contentSnippet = stripMarkup(raw).slice(0, 155) || undefined
          }
        } catch {
          // skip snippet on failure
        }
      }

      return {
        id: d.id,
        alias: (json.data as any).alias || undefined,
        title: d.title,
        description: d.description,
        type: d.type,
        mimeType: d.mimeType,
        metadata: (json.data as any).metadata || undefined,
        versionCount: d.versionCount,
        createdAt: d.createdAt,
        contentSnippet,
      } as AssetMeta
    } catch {
      return null
    }
  }
)

export const Route = createFileRoute('/s/$uuid')({
  loader: async ({ params }) => {
    const data = await fetchAssetMeta({ data: params.uuid })
    if (data === null) throw notFound()
    return data
  },
  head: ({ loaderData }) => {
    const rawTitle = loaderData?.title || 'Shared Asset'
    const title = sanitizeForMeta(rawTitle)
    const rawDesc = loaderData?.description
      || loaderData?.contentSnippet
      || `A ${loaderData?.type || 'shared'} asset on Tokenrip`
    const description = sanitizeForMeta(rawDesc)
    const id = loaderData?.id
    const mimeType = loaderData?.mimeType || 'text/plain'
    const pageUrl = id ? `${SITE_URL}/s/${id}` : undefined
    const isBlogPost = loaderData?.metadata?.post_type === 'blog_post'
    const blogAlias = loaderData?.alias
    return {
      meta: [
        { title: `${title} — Tokenrip` },
        { name: 'description', content: description },
        // Blog posts defer SEO to /blog/:slug — noindex the asset view
        ...(isBlogPost ? [{ name: 'robots', content: 'noindex, follow' }] : []),
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'article' },
        { property: 'og:image', content: `${SITE_URL}/og-image.png` },
        ...(pageUrl ? [{ property: 'og:url', content: pageUrl }] : []),
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: `${SITE_URL}/og-image.png` },
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
      links: [
        // Blog posts: canonical points to /blog/:slug
        ...(isBlogPost && blogAlias
          ? [{ rel: 'canonical', href: `${SITE_URL}/blog/${blogAlias}` }]
          : []),
        ...(id ? [
          { rel: 'alternate', type: 'application/json', href: `${API_URL}/v0/assets/${id}` },
          { rel: 'alternate', type: mimeType, href: `${API_URL}/v0/assets/${id}/content` },
        ] : []),
      ],
    }
  },
  component: ShareLayout,
  notFoundComponent: () => <NotFound variant="asset" />,
})

function ShareLayout() {
  const data = Route.useLoaderData()
  const id = data?.id
  const title = data?.title || 'Shared Asset'
  const mimeType = data?.mimeType || 'text/plain'
  const pageUrl = id ? `${SITE_URL}/s/${id}` : undefined

  const jsonLd = id ? {
    '@context': 'https://schema.org',
    '@type': 'DigitalDocument',
    name: title,
    identifier: id,
    encodingFormat: mimeType,
    url: pageUrl,
    dateCreated: data?.createdAt,
    version: data?.versionCount || 1,
    provider: {
      '@type': 'Organization',
      name: 'Tokenrip',
      url: 'https://tokenrip.com',
    },
    ...(data?.description ? { description: data.description } : {}),
  } : null

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Outlet />
    </>
  )
}
