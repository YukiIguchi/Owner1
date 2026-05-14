'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/utils'

export const Dropdown = DropdownMenu.Root
export const DropdownTrigger = DropdownMenu.Trigger

interface DropdownContentProps {
  children: React.ReactNode
  className?: string
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
}

export function DropdownContent({
  children,
  className,
  align = 'end',
  sideOffset = 8,
}: DropdownContentProps) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-50 min-w-[180px] bg-dark-card border border-dark-border rounded-xl shadow-xl',
          'animate-in fade-in-0 zoom-in-95',
          className
        )}
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  )
}

interface DropdownItemProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  destructive?: boolean
  icon?: React.ReactNode
}

export function DropdownItem({ children, onClick, className, destructive, icon }: DropdownItemProps) {
  return (
    <DropdownMenu.Item
      onClick={onClick}
      className={cn(
        'flex items-center gap-2.5 px-3 py-2.5 text-sm cursor-pointer rounded-lg mx-1 my-0.5',
        'hover:bg-dark-border focus:bg-dark-border outline-none transition-colors',
        destructive ? 'text-red-400 hover:text-red-300' : 'text-foreground',
        className
      )}
    >
      {icon && <span className="text-dark-muted">{icon}</span>}
      {children}
    </DropdownMenu.Item>
  )
}

export function DropdownSeparator() {
  return <DropdownMenu.Separator className="h-px bg-dark-border my-1" />
}
