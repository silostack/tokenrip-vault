import api from '@/utils/api'

export interface AssetMetadata {
  id: string
  title?: string
  description?: string
  type: 'file' | 'markdown' | 'html' | 'chart' | 'code' | 'text'
  mimeType?: string
  metadata?: Record<string, unknown>
  parentAssetId?: string
  creatorContext?: string
  inputReferences?: string[]
  createdAt: string
}

export function getAssetContentUrl(uuid: string): string {
  return `${api.defaults.baseURL}/v0/assets/${uuid}/content`
}
