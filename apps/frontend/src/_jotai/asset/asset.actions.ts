import { useSetAtom } from 'jotai'
import api from '@/utils/api'
import {
  assetAtom,
  isLoadingAssetAtom,
  assetErrorAtom,
  versionsAtom,
  activeVersionIdAtom,
} from './asset.atoms'

export const useAssetActions = () => {
  const setAsset = useSetAtom(assetAtom)
  const setIsLoading = useSetAtom(isLoadingAssetAtom)
  const setError = useSetAtom(assetErrorAtom)
  const setVersions = useSetAtom(versionsAtom)
  const setActiveVersionId = useSetAtom(activeVersionIdAtom)

  const fetchAsset = async (uuid: string, versionId?: string, cap?: string) => {
    setIsLoading(true)
    setError(null)
    setActiveVersionId(versionId || null)
    try {
      const params: Record<string, string> = {}
      if (cap) params.cap = cap
      const response = await api.get(`/v0/assets/${uuid}`, { params })
      setAsset(response.data.data)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch asset'
      const code = error.response?.data?.error || 'UNKNOWN'
      const title = error.response?.data?.data?.title ?? undefined
      setError({ message, code, title })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchVersions = async (uuid: string) => {
    try {
      const response = await api.get(`/v0/assets/${uuid}/versions`)
      setVersions(response.data.data)
    } catch {
      // silently fail — version list is non-critical
    }
  }

  return { fetchAsset, fetchVersions }
}
