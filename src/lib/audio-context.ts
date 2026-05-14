import { createContext, useContext } from 'react'
import { AudioPost } from './database.types'

interface AudioPlayerControls {
  currentTrack: AudioPost | null
  queue: AudioPost[]
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  isLooping: boolean
  isShuffling: boolean
  isMinimized: boolean
  playTrack: (track: AudioPost, queue?: AudioPost[]) => void
  togglePlay: () => void
  seek: (time: number) => void
  setVolume: (vol: number) => void
  toggleMute: () => void
  toggleLoop: () => void
  toggleShuffle: () => void
  playNext: () => void
  playPrevious: () => void
  toggleMinimize: () => void
  addToQueue: (track: AudioPost) => void
  clearQueue: () => void
}

export const AudioPlayerContext = createContext<AudioPlayerControls | null>(null)

export function usePlayer() {
  const ctx = useContext(AudioPlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within AudioPlayerContext')
  return ctx
}
