import { useAtom } from 'jotai'
import { Sun, Moon } from 'lucide-react'
import { themeAtom } from '@/_jotai/theme/theme.atoms'

export function ThemeToggle() {
  const [theme, setTheme] = useAtom(themeAtom)

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-foreground/10 hover:text-foreground"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
