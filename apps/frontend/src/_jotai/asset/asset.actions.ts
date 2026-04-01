import { useSetAtom } from 'jotai'
import { toast } from 'react-toastify'
import api from '@/utils/api'
import {
  assetAtom,
  isLoadingAssetAtom,
  assetErrorAtom,
} from './asset.atoms'

export const useAssetActions = () => {
  const setAsset = useSetAtom(assetAtom)
  const setIsLoading = useSetAtom(isLoadingAssetAtom)
  const setError = useSetAtom(assetErrorAtom)

  const fetchAsset = async (uuid: string) => {
    setIsLoading(true)
    setError(null)
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

  return { fetchAsset }
}
