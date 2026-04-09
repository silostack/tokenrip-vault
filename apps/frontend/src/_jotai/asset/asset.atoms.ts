import { atom } from 'jotai'
import type { AssetMetadata, VersionInfo } from '@/lib/api'

export const assetAtom = atom<AssetMetadata | null>(null)
export const isLoadingAssetAtom = atom<boolean>(false)
export const assetErrorAtom = atom<{ message: string; code: string; title?: string } | null>(null)
export const versionsAtom = atom<VersionInfo[]>([])
export const activeVersionIdAtom = atom<string | null>(null)
