import { atom } from 'jotai'
import type { AssetMetadata } from '@/lib/api'

export const assetAtom = atom<AssetMetadata | null>(null)
export const isLoadingAssetAtom = atom<boolean>(false)
export const assetErrorAtom = atom<string | null>(null)
