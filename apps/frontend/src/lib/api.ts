import { queryOptions } from '@tanstack/react-query'
import { notFound } from '@tanstack/react-router'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3434'

export interface ArtifactMetadata {
  id: string
  title?: string
  description?: string
  type: 'file' | 'markdown' | 'html' | 'chart'
  mimeType?: string
  metadata?: Record<string, unknown>
  createdAt: string
}

async function fetchArtifact(uuid: string): Promise<ArtifactMetadata> {
  const res = await fetch(`${API_URL}/v0/artifacts/${uuid}`)
  if (!res.ok) {
    if (res.status === 404) throw notFound()
    throw new Error(`Failed to fetch artifact: ${res.status}`)
  }
  const json = await res.json()
  return json.data
}

export function artifactQueryOptions(uuid: string) {
  return queryOptions({
    queryKey: ['artifact', uuid],
    queryFn: () => fetchArtifact(uuid),
  })
}

export function getArtifactContentUrl(uuid: string): string {
  return `${API_URL}/v0/artifacts/${uuid}/content`
}
