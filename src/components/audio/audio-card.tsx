'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Play, Heart, Headphones, Lock, Star, Clock } from 'lucide-react'
import { AudioPost } from '@/lib/database.types'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { formatDuration, formatNumber, formatRelativeTime, cn } from '@/lib/utils'

interface AudioCardProps {
  audio: AudioPost
  onPlay?: (audio: AudioPost) => void
  className?: string
  compact?: boolean
}

export function AudioCard({ audio, onPlay, className, compact }: AudioCardProps) {
  const poster = audio.poster

  return (
    <div
      className={cn(
        'group bg-dark-card border border-dark-border rounded-2xl overflow-hidden',
        'hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/10',
        compact ? 'flex gap-3 p-3' : '',
        className
      )}
    >
      {/* Thumbnail */}
      <div
        className={cn(
          'relative overflow-hidden',
          compact ? 'w-16 h-16 rounded-xl flex-shrink-0' : 'aspect-square'
        )}
      >
        {audio.thumbnail_url ? (
          <Image
            src={audio.thumbnail_url}
            alt={audio.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
            <Headphones size={compact ? 20 : 40} className="text-white/60" />
          </div>
        )}

        {/* Play overlay */}
        <button
          onClick={() => onPlay?.(audio)}
          className={cn(
            'absolute inset-0 bg-black/50 flex items-center justify-center',
            'opacity-0 group-hover:opacity-100 transition-opacity',
            compact && 'rounded-xl'
          )}
        >
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40 transform scale-90 group-hover:scale-100 transition-transform">
            <Play size={16} fill="white" className="text-white ml-0.5" />
          </div>
        </button>

        {/* Badges overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {audio.is_premium_only && (
            <Badge variant="premium">
              <Lock size={10} />
              Premium
            </Badge>
          )}
          {audio.is_hall_of_fame && (
            <Badge variant="hof">
              <Star size={10} />
              HOF
            </Badge>
          )}
        </div>

        {/* Duration */}
        {!compact && (
          <div className="absolute bottom-2 right-2 bg-black/70 rounded-md px-1.5 py-0.5 text-xs text-white flex items-center gap-1">
            <Clock size={10} />
            {formatDuration(audio.duration)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className={cn('flex flex-col', compact ? 'flex-1 min-w-0 justify-center' : 'p-3 gap-2')}>
        <div>
          <Link
            href={`/audio/${audio.id}`}
            className="block font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 text-sm leading-tight"
          >
            {audio.title}
          </Link>
        </div>

        {/* Category */}
        {!compact && (
          <Badge variant="outline" className="self-start text-xs">
            {audio.category}
          </Badge>
        )}

        {/* Poster */}
        {poster && (
          <Link
            href={`/profile/${poster.username}`}
            className="flex items-center gap-1.5 group/poster"
          >
            <Avatar
              src={poster.avatar_url}
              name={poster.display_name || poster.username}
              size="xs"
            />
            <span className="text-xs text-dark-muted group-hover/poster:text-foreground transition-colors truncate">
              {poster.display_name || poster.username}
            </span>
          </Link>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-dark-muted">
          <span className="flex items-center gap-1">
            <Headphones size={12} />
            {formatNumber(audio.play_count)}
          </span>
          <span className="flex items-center gap-1">
            <Heart size={12} />
            {formatNumber(audio.like_count)}
          </span>
          {compact && (
            <span className="flex items-center gap-1 ml-auto">
              <Clock size={12} />
              {formatDuration(audio.duration)}
            </span>
          )}
          {!compact && (
            <span className="ml-auto">{formatRelativeTime(audio.created_at)}</span>
          )}
        </div>
      </div>
    </div>
  )
}
