import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useAtomValue } from 'jotai'
import {
  artifactAtom,
  isLoadingArtifactAtom,
  artifactErrorAtom,
} from '@/_jotai/artifact/artifact.atoms'
import { useArtifactActions } from '@/_jotai/artifact/artifact.actions'
import { ArtifactViewer } from '@/components/ArtifactViewer'
import { ArtifactToolbar } from '@/components/ArtifactToolbar'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3434'

const fetchArtifactMeta = createServerFn({ method: 'GET' }).handler(
  async ({ data: uuid }: { data: string }) => {
    try {
      const res = await fetch(`${API_URL}/v0/artifacts/${uuid}`)
      if (!res.ok) return null
      const json = await res.json()
      return json.data as { id: string; title?: string; description?: string; type: string } | null
    } catch {
      return null
    }
  }
)

export const Route = createFileRoute('/s/$uuid')({
  loader: ({ params }) => fetchArtifactMeta({ data: params.uuid }),
  head: ({ loaderData }) => {
    const title = loaderData?.title || 'Shared Artifact'
    const description = loaderData?.description || `A ${loaderData?.type || 'shared'} artifact on Tokenrip`
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
      Artifact not found.
    </div>
  ),
})

function SharePage() {
  const { uuid } = Route.useParams()
  const artifact = useAtomValue(artifactAtom)
  const isLoading = useAtomValue(isLoadingArtifactAtom)
  const error = useAtomValue(artifactErrorAtom)
  const { fetchArtifact } = useArtifactActions()

  useEffect(() => {
    fetchArtifact(uuid)
  }, [uuid])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-white/40">
        Loading...
      </div>
    )
  }

  if (error || !artifact) {
    return (
      <div className="flex items-center justify-center py-24 text-white/40">
        {error || 'Artifact not found.'}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl pb-20 sm:pb-16">
      {artifact.title && (
        <div className="border-b border-white/10 px-6 py-4">
          <h1 className="font-mono text-xl font-bold">{artifact.title}</h1>
          {artifact.description && (
            <p className="mt-1 text-sm text-white/60">
              {artifact.description}
            </p>
          )}
        </div>
      )}
      <ArtifactViewer artifact={artifact} />
      <ArtifactToolbar artifact={artifact} />
    </div>
  )
}
