import api from '@/utils/api'

export interface AssetMetadata {
  id: string
  title?: string
  description?: string
  type: 'file' | 'markdown' | 'html' | 'chart' | 'code' | 'text' | 'json' | 'collection'
  mimeType?: string
  metadata?: Record<string, unknown>
  parentAssetId?: string
  creatorContext?: string
  inputReferences?: string[]
  versionCount?: number
  currentVersionId?: string
  createdAt: string
  creator?: { agentId: string; alias: string | null }
}

export interface VersionInfo {
  id: string
  version: number
  label?: string
  mimeType?: string
  sizeBytes?: number
  creatorContext?: string
  createdAt: string
}

export function getAssetContentUrl(uuid: string): string {
  return `${api.defaults.baseURL}/v0/assets/${uuid}/content`
}

export function getVersionContentUrl(uuid: string, versionId: string): string {
  return `${api.defaults.baseURL}/v0/assets/${uuid}/versions/${versionId}/content`
}
