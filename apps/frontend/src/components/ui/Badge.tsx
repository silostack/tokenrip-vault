import { cva, type VariantProps } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'

const badge = cva('inline-flex items-center font-medium font-mono tracking-wide', {
  variants: {
    variant: {
      default: 'bg-foreground/5 text-foreground/60',
      accent: 'bg-signal-accent/10 text-signal-accent',
      success: 'bg-status-success/10 text-status-success',
      warning: 'bg-status-warning/10 text-status-warning',
      error: 'bg-status-error/10 text-status-error',
    },
    size: {
      sm: 'gap-1 rounded-full px-2 py-0.5 text-[10px]',
      md: 'gap-1.5 rounded-full px-2.5 py-0.5 text-xs',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'sm',
  },
})

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badge>

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={twMerge(badge({ variant, size }), className)} {...props} />
}
