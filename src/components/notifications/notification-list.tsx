'use client'

import { Notification } from '@/lib/database.types'
import { formatRelativeTime, cn } from '@/lib/utils'
import { Bell, Heart, UserPlus, MessageSquare, Coins, Star, Info } from 'lucide-react'

interface NotificationListProps {
  notifications: Notification[]
  onMarkRead?: (id: string) => void
}

const typeIcons: Record<string, React.ReactNode> = {
  new_follower: <UserPlus size={14} className="text-secondary" />,
  new_like: <Heart size={14} className="text-primary" />,
  new_comment: <MessageSquare size={14} className="text-blue-400" />,
  new_tip: <Coins size={14} className="text-secondary" />,
  hall_of_fame: <Star size={14} className="text-yellow-400" />,
  system: <Info size={14} className="text-dark-muted" />,
}

export function NotificationList({ notifications, onMarkRead }: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-dark-muted">
        <Bell size={32} className="mb-2" />
        <p>No notifications yet</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-dark-border">
      {notifications.map((n) => {
        const data = n.data as Record<string, string>
        return (
          <button
            key={n.id}
            onClick={() => onMarkRead?.(n.id)}
            className={cn(
              'w-full flex items-start gap-3 p-4 text-left hover:bg-dark-border/30 transition-colors',
              !n.is_read && 'bg-primary/5'
            )}
          >
            <div className="w-8 h-8 rounded-full bg-dark-border flex items-center justify-center flex-shrink-0">
              {typeIcons[n.type] || <Bell size={14} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{data.message || n.type}</p>
              <p className="text-xs text-dark-muted mt-0.5">{formatRelativeTime(n.created_at)}</p>
            </div>
            {!n.is_read && (
              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
            )}
          </button>
        )
      })}
    </div>
  )
}
