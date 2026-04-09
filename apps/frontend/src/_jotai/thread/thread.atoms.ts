import { atom } from 'jotai'
import type { ThreadMessage } from '@/lib/thread'

export const messagesAtom = atom<ThreadMessage[]>([])
export const isLoadingMessagesAtom = atom<boolean>(false)
