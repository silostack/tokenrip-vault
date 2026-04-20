import { type ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  href?: string
}

export function Card({ children, className, onClick, href }: CardProps) {
  const classes = twMerge(
    'rounded-lg border border-foreground/10 bg-background p-4 transition-colors',
    (onClick || href) && 'cursor-pointer hover:border-foreground/20 hover:bg-foreground/[0.02] active:scale-[0.99]',
    className,
  )

  if (href) {
    return <a href={href} className={classes}>{children}</a>
  }

  if (onClick) {
    return <button type="button" onClick={onClick} className={twMerge(classes, 'w-full text-left')}>{children}</button>
  }

  return <div className={classes}>{children}</div>
}
