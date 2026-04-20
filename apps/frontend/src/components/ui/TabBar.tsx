import { type ReactNode } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { twMerge } from 'tailwind-merge'

interface TabBarItem {
  href: string
  icon: ReactNode
  label: string
}

interface TabBarProps {
  items: TabBarItem[]
  trailing?: { icon: ReactNode; label: string; onClick: () => void }
}

export function TabBar({ items, trailing }: TabBarProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-foreground/10 bg-background md:hidden">
      <nav className="flex items-stretch">
        {items.map((item) => {
          const active =
            item.href === '/operator'
              ? pathname === '/operator'
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              to={item.href}
              className={twMerge(
                'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-mono font-medium tracking-wide transition-colors',
                active ? 'text-signal-accent' : 'text-foreground/40',
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          )
        })}
        {trailing && (
          <button
            type="button"
            onClick={trailing.onClick}
            className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-mono font-medium tracking-wide text-foreground/40 transition-colors active:scale-[0.97]"
          >
            {trailing.icon}
            <span>{trailing.label}</span>
          </button>
        )}
      </nav>
    </div>
  )
}
