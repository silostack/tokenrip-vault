import { atom } from 'jotai'
import type { ArtifactMetadata } from '@/lib/api'

export const artifactAtom = atom<ArtifactMetadata | null>(null)
export const isLoadingArtifactAtom = atom<boolean>(false)
export const artifactErrorAtom = atom<string | null>(null)
