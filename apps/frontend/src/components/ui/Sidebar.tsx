import { type ReactNode } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { twMerge } from 'tailwind-merge'

interface SidebarProps {
  header?: ReactNode
  footer?: ReactNode
  children: ReactNode
}

export function Sidebar({ header, footer, children }: SidebarProps) {
  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:border-foreground/10">
      {header && (
        <div className="border-b border-foreground/10 px-4 py-3">{header}</div>
      )}
      <nav className="flex-1 overflow-y-auto px-2 py-2">{children}</nav>
      {footer && (
        <div className="border-t border-foreground/10 px-4 py-3">{footer}</div>
      )}
    </aside>
  )
}

interface SidebarItemProps {
  href: string
  icon: ReactNode
  label: string
  badge?: ReactNode
}

export function SidebarItem({ href, icon, label, badge }: SidebarItemProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const active =
    href === '/operator' ? pathname === '/operator' : pathname.startsWith(href)

  return (
    <Link
      to={href}
      className={twMerge(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium font-mono tracking-wide transition-colors',
        active
          ? 'border-l-2 border-signal-accent bg-signal-accent/[0.08] text-foreground'
          : 'border-l-2 border-transparent text-foreground/50 hover:bg-foreground/5 hover:text-foreground/70',
      )}
    >
      <span className="flex h-5 w-5 items-center justify-center">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge}
    </Link>
  )
}
