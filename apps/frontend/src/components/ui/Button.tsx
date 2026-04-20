import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'

const button = cva(
  'inline-flex items-center justify-center font-medium transition-colors active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-2 focus-visible:outline-signal-accent focus-visible:outline-offset-2',
  {
    variants: {
      variant: {
        primary: 'bg-foreground text-background hover:bg-foreground/90',
        secondary: 'border border-foreground/10 text-foreground/70 hover:bg-foreground/5',
        ghost: 'text-foreground/50 hover:bg-foreground/5 hover:text-foreground/70',
        destructive: 'text-status-error hover:bg-status-error/10',
      },
      size: {
        sm: 'h-8 gap-1.5 rounded-md px-3 text-xs',
        md: 'h-10 gap-2 rounded-lg px-4 text-sm',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'md',
    },
  },
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={twMerge(button({ variant, size }), className)} {...props} />
  ),
)
Button.displayName = 'Button'
