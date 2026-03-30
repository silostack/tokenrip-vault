import api from '@/utils/api'

export interface ArtifactMetadata {
  id: string
  title?: string
  description?: string
  type: 'file' | 'markdown' | 'html' | 'chart'
  mimeType?: string
  metadata?: Record<string, unknown>
  createdAt: string
}

export function getArtifactContentUrl(uuid: string): string {
  return `${api.defaults.baseURL}/v0/artifacts/${uuid}/content`
}
