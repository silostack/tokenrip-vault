import { atom } from 'jotai'
import type { OperatorAgent, InboxItem, OperatorAssetItem, OperatorContact, ThreadListItem } from '@/lib/operator'

export const operatorAgentAtom = atom<OperatorAgent | null>(null)

export const inboxItemsAtom = atom<InboxItem[]>([])
export const inboxLoadingAtom = atom<boolean>(false)

export const operatorAssetsAtom = atom<OperatorAssetItem[]>([])
export const operatorAssetsLoadingAtom = atom<boolean>(false)

export const operatorContactsAtom = atom<OperatorContact[]>([])
export const operatorContactsLoadingAtom = atom<boolean>(false)

export const operatorThreadsAtom = atom<ThreadListItem[]>([])
export const operatorThreadsLoadingAtom = atom<boolean>(false)
export const operatorThreadsTotalAtom = atom<number>(0)

export const inboxSearchAtom = atom<string>('')
export const inboxStateFilterAtom = atom<'all' | 'open' | 'closed'>('all')
