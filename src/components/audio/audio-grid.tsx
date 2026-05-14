import { AudioPost } from '@/lib/database.types'
import { AudioCard } from './audio-card'
import { cn } from '@/lib/utils'

interface AudioGridProps {
  audios: AudioPost[]
  onPlay?: (audio: AudioPost) => void
  columns?: 2 | 3 | 4
  compact?: boolean
  className?: string
}

const colClasses = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

export function AudioGrid({ audios, onPlay, columns = 3, compact, className }: AudioGridProps) {
  if (audios.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-dark-muted">
        <p className="text-lg">No audio found</p>
        <p className="text-sm mt-1">Check back later for new content</p>
      </div>
    )
  }

  return (
    <div className={cn('grid gap-4', colClasses[columns], className)}>
      {audios.map((audio) => (
        <AudioCard
          key={audio.id}
          audio={audio}
          onPlay={onPlay}
          compact={compact}
        />
      ))}
    </div>
  )
}
