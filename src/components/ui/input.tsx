import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-foreground/80">{label}</label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-dark-card border border-dark-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-dark-muted',
              'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors',
              icon && 'pl-10',
              error && 'border-red-500 focus:ring-red-500/50',
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    )
  }
)
Input.displayName = 'Input'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-foreground/80">{label}</label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full bg-dark-card border border-dark-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-dark-muted resize-none',
            'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors',
            error && 'border-red-500',
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Input, Textarea }
