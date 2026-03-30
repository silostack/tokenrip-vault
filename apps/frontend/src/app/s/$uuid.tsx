import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import {
  artifactAtom,
  isLoadingArtifactAtom,
  artifactErrorAtom,
} from '@/_jotai/artifact/artifact.atoms'
import { useArtifactActions } from '@/_jotai/artifact/artifact.actions'
import { ArtifactViewer } from '@/components/ArtifactViewer'

export const Route = createFileRoute('/s/$uuid')({
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
    <div className="mx-auto max-w-5xl">
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
    </div>
  )
}
