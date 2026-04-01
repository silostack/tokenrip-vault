import { useSetAtom } from 'jotai'
import { toast } from 'react-toastify'
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

  const fetchAsset = async (uuid: string, versionId?: string) => {
    setIsLoading(true)
    setError(null)
    setActiveVersionId(versionId || null)
    try {
      const response = await api.get(`/v0/assets/${uuid}`)
      setAsset(response.data.data)
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to fetch asset'
      setError(message)
      toast.error(message)
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
