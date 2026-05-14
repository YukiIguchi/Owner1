'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CookieBanner } from '@/components/layout/cookie-banner'
import { AudioPlayer } from '@/components/audio/audio-player'
import { useAudioPlayer } from '@/hooks/use-audio-player'
import { AudioPlayerContext } from '@/lib/audio-context'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const playerControls = useAudioPlayer()

  return (
    <AudioPlayerContext.Provider value={playerControls}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pt-16 pb-20">
          {children}
        </main>
        <Footer />
        {playerControls.currentTrack && (
          <AudioPlayer
            state={playerControls}
            onTogglePlay={playerControls.togglePlay}
            onSeek={playerControls.seek}
            onSetVolume={playerControls.setVolume}
            onToggleMute={playerControls.toggleMute}
            onToggleLoop={playerControls.toggleLoop}
            onToggleShuffle={playerControls.toggleShuffle}
            onPlayNext={playerControls.playNext}
            onPlayPrevious={playerControls.playPrevious}
            onToggleMinimize={playerControls.toggleMinimize}
          />
        )}
        <CookieBanner />
      </div>
    </AudioPlayerContext.Provider>
  )
}
