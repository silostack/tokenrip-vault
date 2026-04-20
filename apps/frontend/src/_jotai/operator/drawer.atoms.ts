import { atom } from 'jotai'

export type DrawerTab = 'comments' | 'versions' | 'activity' | 'details'

export const assetDrawerOpenAtom = atom<boolean>(false)
export const assetDrawerTabAtom = atom<DrawerTab>('comments')
