import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { artifactQueryOptions } from '@/lib/api'
import { ArtifactViewer } from '@/components/ArtifactViewer'

export const Route = createFileRoute('/s/$uuid')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(artifactQueryOptions(params.uuid)),
  component: SharePage,
  notFoundComponent: () => (
    <div className="flex items-center justify-center py-24 text-white/40">
      Artifact not found.
    </div>
  ),
})

function SharePage() {
  const { uuid } = Route.useParams()
  const { data: artifact } = useSuspenseQuery(artifactQueryOptions(uuid))

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
