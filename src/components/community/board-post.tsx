'use client'

import { CommunityPost } from '@/lib/database.types'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Heart, MessageSquare } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import { useState } from 'react'

interface BoardPostProps {
  post: CommunityPost
}

export function BoardPost({ post }: BoardPostProps) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(post.like_count)
  const user = post.user

  const handleLike = () => {
    setLiked(!liked)
    setLikes(liked ? likes - 1 : likes + 1)
  }

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-4 hover:border-primary/30 transition-colors">
      <div className="flex items-start gap-3">
        <Avatar
          src={user?.avatar_url}
          name={user?.display_name || user?.username || 'User'}
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-foreground">
              {user?.display_name || user?.username || 'Anonymous'}
            </span>
            <Badge variant="outline">{post.category}</Badge>
            <span className="text-xs text-dark-muted ml-auto">{formatRelativeTime(post.created_at)}</span>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">{post.content}</p>
          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? 'text-primary' : 'text-dark-muted hover:text-primary'}`}
            >
              <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
              {likes}
            </button>
            <button className="flex items-center gap-1.5 text-sm text-dark-muted hover:text-foreground transition-colors">
              <MessageSquare size={14} />
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
