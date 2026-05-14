'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { AudioPost } from '@/lib/database.types'

export interface AudioPlayerState {
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
}

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [state, setState] = useState<AudioPlayerState>({
    currentTrack: null,
    queue: [],
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isMuted: false,
    isLooping: false,
    isShuffling: false,
    isMinimized: false,
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio()
      audioRef.current.volume = state.volume

      audioRef.current.ontimeupdate = () => {
        if (audioRef.current) {
          setState((prev) => ({
            ...prev,
            currentTime: audioRef.current!.currentTime,
          }))
        }
      }

      audioRef.current.onloadedmetadata = () => {
        if (audioRef.current) {
          setState((prev) => ({
            ...prev,
            duration: audioRef.current!.duration,
          }))
        }
      }

      audioRef.current.onended = () => {
        setState((prev) => {
          if (prev.isLooping) {
            audioRef.current!.currentTime = 0
            audioRef.current!.play()
            return prev
          }
          // Play next
          const currentIndex = prev.queue.findIndex(
            (t) => t.id === prev.currentTrack?.id
          )
          if (currentIndex < prev.queue.length - 1) {
            const nextTrack = prev.queue[currentIndex + 1]
            audioRef.current!.src = nextTrack.audio_url
            audioRef.current!.play()
            return { ...prev, currentTrack: nextTrack, isPlaying: true }
          }
          return { ...prev, isPlaying: false }
        })
      }
    }

    return () => {
      audioRef.current?.pause()
    }
  }, [])

  const playTrack = useCallback((track: AudioPost, queue?: AudioPost[]) => {
    if (!audioRef.current) return

    audioRef.current.src = track.audio_url
    audioRef.current.play().catch(console.error)

    setState((prev) => ({
      ...prev,
      currentTrack: track,
      queue: queue || prev.queue,
      isPlaying: true,
      currentTime: 0,
    }))
  }, [])

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !state.currentTrack) return

    if (state.isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(console.error)
    }

    setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))
  }, [state.isPlaying, state.currentTrack])

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = time
    setState((prev) => ({ ...prev, currentTime: time }))
  }, [])

  const setVolume = useCallback((volume: number) => {
    if (!audioRef.current) return
    audioRef.current.volume = volume
    setState((prev) => ({ ...prev, volume, isMuted: volume === 0 }))
  }, [])

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return
    const newMuted = !state.isMuted
    audioRef.current.muted = newMuted
    setState((prev) => ({ ...prev, isMuted: newMuted }))
  }, [state.isMuted])

  const toggleLoop = useCallback(() => {
    setState((prev) => ({ ...prev, isLooping: !prev.isLooping }))
  }, [])

  const toggleShuffle = useCallback(() => {
    setState((prev) => ({ ...prev, isShuffling: !prev.isShuffling }))
  }, [])

  const playNext = useCallback(() => {
    const currentIndex = state.queue.findIndex(
      (t) => t.id === state.currentTrack?.id
    )
    if (state.isShuffling) {
      const randomIndex = Math.floor(Math.random() * state.queue.length)
      playTrack(state.queue[randomIndex])
      return
    }
    if (currentIndex < state.queue.length - 1) {
      playTrack(state.queue[currentIndex + 1])
    }
  }, [state.queue, state.currentTrack, state.isShuffling, playTrack])

  const playPrevious = useCallback(() => {
    if (state.currentTime > 3) {
      seek(0)
      return
    }
    const currentIndex = state.queue.findIndex(
      (t) => t.id === state.currentTrack?.id
    )
    if (currentIndex > 0) {
      playTrack(state.queue[currentIndex - 1])
    }
  }, [state.queue, state.currentTrack, state.currentTime, playTrack, seek])

  const toggleMinimize = useCallback(() => {
    setState((prev) => ({ ...prev, isMinimized: !prev.isMinimized }))
  }, [])

  const addToQueue = useCallback((track: AudioPost) => {
    setState((prev) => ({ ...prev, queue: [...prev.queue, track] }))
  }, [])

  const clearQueue = useCallback(() => {
    setState((prev) => ({ ...prev, queue: [] }))
  }, [])

  return {
    ...state,
    playTrack,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    toggleLoop,
    toggleShuffle,
    playNext,
    playPrevious,
    toggleMinimize,
    addToQueue,
    clearQueue,
  }
}
