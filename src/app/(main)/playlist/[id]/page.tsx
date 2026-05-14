import { notFound } from 'next/navigation'
import { ListMusic, Lock, Globe } from 'lucide-react'
import { AudioCard } from '@/components/audio/audio-card'
import { mockAudioPosts } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'

const mockPlaylists = [
  { id: 'pl1', title: 'My Favorites', is_public: true, audio_ids: ['a1', 'a3', 'a5'] },
  { id: 'pl2', title: 'Sleep Sounds', is_public: false, audio_ids: ['a1', 'a5'] },
]

interface Props {
  params: Promise<{ id: string }>
}

export default async function PlaylistPage({ params }: Props) {
  const { id } = await params
  const playlist = mockPlaylists.find((p) => p.id === id)
  if (!playlist) notFound()

  const audios = playlist.audio_ids
    .map((aid) => mockAudioPosts.find((a) => a.id === aid))
    .filter(Boolean) as typeof mockAudioPosts

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
          <ListMusic size={36} className="text-white/60" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-foreground">{playlist.title}</h1>
            <Badge variant="outline">
              {playlist.is_public ? <><Globe size={10} /> Public</> : <><Lock size={10} /> Private</>}
            </Badge>
          </div>
          <p className="text-dark-muted text-sm">{audios.length} tracks</p>
        </div>
      </div>

      <div className="space-y-3">
        {audios.map((audio, i) => (
          <div key={audio.id} className="flex items-center gap-3">
            <span className="text-dark-muted w-6 text-center text-sm">{i + 1}</span>
            <div className="flex-1">
              <AudioCard audio={audio} compact />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
