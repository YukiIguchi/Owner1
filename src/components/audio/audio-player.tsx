'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Repeat, Shuffle, Maximize2, Minimize2, Headphones, ChevronDown
} from 'lucide-react'
import { formatDuration, cn } from '@/lib/utils'
import { AudioPlayerState } from '@/hooks/use-audio-player'
import { Slider } from '@/components/ui/slider'

interface AudioPlayerProps {
  state: AudioPlayerState
  onTogglePlay: () => void
  onSeek: (time: number) => void
  onSetVolume: (vol: number) => void
  onToggleMute: () => void
  onToggleLoop: () => void
  onToggleShuffle: () => void
  onPlayNext: () => void
  onPlayPrevious: () => void
  onToggleMinimize: () => void
}

export function AudioPlayer({
  state,
  onTogglePlay,
  onSeek,
  onSetVolume,
  onToggleMute,
  onToggleLoop,
  onToggleShuffle,
  onPlayNext,
  onPlayPrevious,
  onToggleMinimize,
}: AudioPlayerProps) {
  const { currentTrack, isPlaying, currentTime, duration, volume, isMuted, isLooping, isShuffling, isMinimized } = state

  if (!currentTrack) return null

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  const poster = currentTrack.poster

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-dark-card border border-dark-border rounded-2xl shadow-2xl p-3 flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
            {currentTrack.thumbnail_url ? (
              <Image src={currentTrack.thumbnail_url} alt={currentTrack.title} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                <Headphones size={16} className="text-white/60" />
              </div>
            )}
          </div>
          <button
            onClick={onTogglePlay}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
          >
            {isPlaying ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" className="ml-0.5" />}
          </button>
          <button onClick={onToggleMinimize} className="text-dark-muted hover:text-foreground">
            <Maximize2 size={14} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-dark-border">
      {/* Progress bar - thin line at top */}
      <div
        className="h-0.5 bg-dark-border cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const pct = (e.clientX - rect.left) / rect.width
          onSeek(pct * duration)
        }}
      >
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Track info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={cn('relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0', isPlaying && 'animate-pulse-glow')}>
            {currentTrack.thumbnail_url ? (
              <Image src={currentTrack.thumbnail_url} alt={currentTrack.title} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                <Headphones size={20} className="text-white/60" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <Link
              href={`/audio/${currentTrack.id}`}
              className="block text-sm font-semibold text-foreground hover:text-primary transition-colors truncate"
            >
              {currentTrack.title}
            </Link>
            {poster && (
              <Link
                href={`/profile/${poster.username}`}
                className="text-xs text-dark-muted hover:text-foreground transition-colors truncate"
              >
                {poster.display_name || poster.username}
              </Link>
            )}
          </div>
        </div>

        {/* Controls - center */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            {/* Shuffle */}
            <button
              onClick={onToggleShuffle}
              className={cn('p-1.5 rounded-lg transition-colors', isShuffling ? 'text-secondary' : 'text-dark-muted hover:text-foreground')}
            >
              <Shuffle size={14} />
            </button>

            {/* Previous */}
            <button onClick={onPlayPrevious} className="p-1.5 rounded-lg text-dark-muted hover:text-foreground transition-colors">
              <SkipBack size={18} />
            </button>

            {/* Play/Pause */}
            <button
              onClick={onTogglePlay}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors"
            >
              {isPlaying ? (
                <Pause size={18} fill="white" className="text-white" />
              ) : (
                <Play size={18} fill="white" className="text-white ml-0.5" />
              )}
            </button>

            {/* Next */}
            <button onClick={onPlayNext} className="p-1.5 rounded-lg text-dark-muted hover:text-foreground transition-colors">
              <SkipForward size={18} />
            </button>

            {/* Loop */}
            <button
              onClick={onToggleLoop}
              className={cn('p-1.5 rounded-lg transition-colors', isLooping ? 'text-primary' : 'text-dark-muted hover:text-foreground')}
            >
              <Repeat size={14} />
            </button>
          </div>

          {/* Time + Seek */}
          <div className="hidden sm:flex items-center gap-2 w-64">
            <span className="text-xs text-dark-muted w-8 text-right">{formatDuration(currentTime)}</span>
            <Slider
              value={[progress]}
              onValueChange={([v]) => onSeek((v / 100) * duration)}
              min={0}
              max={100}
              step={0.1}
              className="flex-1"
            />
            <span className="text-xs text-dark-muted w-8">{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Volume + minimize - right */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <div className="hidden md:flex items-center gap-2">
            <button onClick={onToggleMute} className="text-dark-muted hover:text-foreground transition-colors">
              {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              onValueChange={([v]) => onSetVolume(v / 100)}
              min={0}
              max={100}
              className="w-20"
            />
          </div>

          <button
            onClick={onToggleMinimize}
            className="p-1.5 rounded-lg text-dark-muted hover:text-foreground transition-colors"
          >
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
