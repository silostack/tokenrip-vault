import { useSetAtom } from 'jotai'
import { toast } from 'react-toastify'
import api from '@/utils/api'
import {
  artifactAtom,
  isLoadingArtifactAtom,
  artifactErrorAtom,
} from './artifact.atoms'

export const useArtifactActions = () => {
  const setArtifact = useSetAtom(artifactAtom)
  const setIsLoading = useSetAtom(isLoadingArtifactAtom)
  const setError = useSetAtom(artifactErrorAtom)

  const fetchArtifact = async (uuid: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.get(`/v0/artifacts/${uuid}`)
      setArtifact(response.data.data)
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to fetch artifact'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return { fetchArtifact }
}
