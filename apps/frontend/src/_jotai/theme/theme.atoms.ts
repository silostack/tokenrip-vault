import { atom } from 'jotai'

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

const baseThemeAtom = atom<Theme>(getInitialTheme())

export const themeAtom = atom(
  (get) => get(baseThemeAtom),
  (_get, set, next: Theme) => {
    set(baseThemeAtom, next)
    localStorage.setItem('theme', next)
    document.documentElement.classList.toggle('dark', next === 'dark')
  },
)
