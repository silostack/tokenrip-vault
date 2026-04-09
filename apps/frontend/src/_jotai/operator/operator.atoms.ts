import { atom } from 'jotai'
import type { OperatorAgent, InboxItem, OperatorAssetItem } from '@/lib/operator'

export const operatorAgentAtom = atom<OperatorAgent | null>(null)

export const inboxItemsAtom = atom<InboxItem[]>([])
export const inboxLoadingAtom = atom<boolean>(false)

export const operatorAssetsAtom = atom<OperatorAssetItem[]>([])
export const operatorAssetsLoadingAtom = atom<boolean>(false)
