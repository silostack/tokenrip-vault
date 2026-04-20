import { atom } from 'jotai'

export interface TeamSummary {
  id: string
  name: string
  slug: string
  memberCount: number
}

export const activeTeamSlugAtom = atom<string | null>(null)
export const operatorTeamsAtom = atom<TeamSummary[]>([])
export const operatorTeamsLoadingAtom = atom<boolean>(false)
