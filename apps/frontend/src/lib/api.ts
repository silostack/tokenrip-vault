import api from '@/utils/api'

export interface ArtifactMetadata {
  id: string
  title?: string
  description?: string
  type: 'file' | 'markdown' | 'html' | 'chart' | 'code' | 'text'
  mimeType?: string
  metadata?: Record<string, unknown>
  parentArtifactId?: string
  creatorContext?: string
  inputReferences?: string[]
  createdAt: string
}

export function getArtifactContentUrl(uuid: string): string {
  return `${api.defaults.baseURL}/v0/artifacts/${uuid}/content`
}
