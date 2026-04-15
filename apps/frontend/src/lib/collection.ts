import api from '@/utils/api'

export interface CollectionSchema {
  name: string
  type: 'text' | 'number' | 'date' | 'url' | 'enum' | 'boolean'
  position: number
  values?: string[]
}

export interface CollectionRow {
  id: string
  data: Record<string, unknown>
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface CollectionRowsResponse {
  rows: CollectionRow[]
  nextCursor: string | null
}

export async function fetchCollectionRows(
  publicId: string,
  opts?: {
    limit?: number
    after?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    filters?: Record<string, string>
  },
): Promise<CollectionRowsResponse> {
  const params: Record<string, string> = {}
  if (opts?.limit) params.limit = String(opts.limit)
  if (opts?.after) params.after = opts.after
  if (opts?.sortBy) params.sort_by = opts.sortBy
  if (opts?.sortOrder) params.sort_order = opts.sortOrder
  if (opts?.filters) {
    for (const [k, v] of Object.entries(opts.filters)) {
      params[`filter.${k}`] = v
    }
  }

  const { data } = await api.get(`/v0/assets/${publicId}/rows`, { params })
  return data.data
}

export async function updateCollectionRow(
  publicId: string,
  rowId: string,
  cellData: Record<string, unknown>,
): Promise<CollectionRow> {
  const { data } = await api.put(`/v0/assets/${publicId}/rows/${rowId}`, { data: cellData })
  return data.data
}

export async function deleteCollectionRows(
  publicId: string,
  ids: string[],
): Promise<void> {
  await api.delete(`/v0/assets/${publicId}/rows`, { data: { row_ids: ids } })
}
