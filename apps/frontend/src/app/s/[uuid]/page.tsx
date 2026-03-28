import { notFound } from 'next/navigation';
import { getArtifact } from '@/lib/api';
import { ArtifactViewer } from '@/components/ArtifactViewer';

export default async function SharePage({ params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = await params;

  let artifact;
  try {
    artifact = await getArtifact(uuid);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl">
      {artifact.title && (
        <div className="border-b border-white/10 px-6 py-4">
          <h1 className="font-mono text-xl font-bold">{artifact.title}</h1>
          {artifact.description && (
            <p className="mt-1 text-sm text-white/60">{artifact.description}</p>
          )}
        </div>
      )}
      <ArtifactViewer artifact={artifact} />
    </div>
  );
}
