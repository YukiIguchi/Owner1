'use client'

import { Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NotificationBellProps {
  count?: number
  onClick?: () => void
}

export function NotificationBell({ count = 0, onClick }: NotificationBellProps) {
  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-xl hover:bg-dark-card transition-colors text-dark-muted hover:text-foreground"
    >
      <Bell size={20} />
      {count > 0 && (
        <span className={cn(
          'absolute top-1 right-1 min-w-[16px] h-4 rounded-full bg-primary text-white',
          'flex items-center justify-center text-[10px] font-bold px-1'
        )}>
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}
