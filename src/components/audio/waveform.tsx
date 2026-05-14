'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface WaveformProps {
  audioUrl?: string
  isPlaying?: boolean
  onReady?: (duration: number) => void
  onSeek?: (time: number) => void
  className?: string
}

export function Waveform({ audioUrl, isPlaying, onReady, onSeek, className }: WaveformProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wavesurferRef = useRef<any>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!containerRef.current || !audioUrl || typeof window === 'undefined') return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ws: any = null

    const init = async () => {
      const WaveSurfer = (await import('wavesurfer.js')).default

      ws = WaveSurfer.create({
        container: containerRef.current!,
        waveColor: '#2A2A2A',
        progressColor: '#FF4D8D',
        cursorColor: '#FF4D8D',
        barWidth: 2,
        barGap: 1,
        barRadius: 2,
        height: 48,
        normalize: true,
      })

      wavesurferRef.current = ws

      ws.load(audioUrl)

      ws.on('ready', () => {
        setReady(true)
        onReady?.(ws.getDuration())
      })

      ws.on('seek', (progress: number) => {
        onSeek?.(progress * ws.getDuration())
      })
    }

    init()

    return () => {
      ws?.destroy()
      wavesurferRef.current = null
      setReady(false)
    }
  }, [audioUrl])

  useEffect(() => {
    const ws = wavesurferRef.current
    if (!ws || !ready) return
    if (isPlaying) {
      ws.play()
    } else {
      ws.pause()
    }
  }, [isPlaying, ready])

  return (
    <div className={cn('relative', className)}>
      <div ref={containerRef} className="w-full" />
      {!ready && audioUrl && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-end gap-0.5 h-12">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="w-0.5 bg-dark-border rounded-full animate-pulse"
                style={{
                  height: `${Math.random() * 80 + 20}%`,
                  animationDelay: `${i * 50}ms`,
                }}
              />
            ))}
          </div>
        </div>
      )}
      {!audioUrl && (
        <div className="flex items-end gap-0.5 h-12">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-dark-border rounded-full"
              style={{ height: `${Math.sin(i * 0.3) * 30 + 40}%` }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
