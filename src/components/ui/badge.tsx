import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'premium' | 'hof'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-dark-border text-foreground/70',
  primary: 'bg-primary/20 text-primary border border-primary/30',
  secondary: 'bg-secondary/20 text-secondary border border-secondary/30',
  outline: 'border border-dark-border text-foreground/70',
  premium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  hof: 'bg-gradient-to-r from-primary/20 to-secondary/20 text-foreground border border-primary/30',
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
