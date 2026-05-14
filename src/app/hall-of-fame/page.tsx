import Image from 'next/image'
import Link from 'next/link'
import { Star, Headphones, Heart, Crown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { formatNumber, formatDuration } from '@/lib/utils'
import { mockAudioPosts } from '@/lib/mock-data'

const hofAudios = mockAudioPosts.filter((a) => a.is_hall_of_fame)

export default function HallOfFamePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400/30 to-yellow-600/30 flex items-center justify-center mx-auto mb-4">
          <Crown size={32} className="text-yellow-400" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Hall of Fame</h1>
        <p className="text-dark-muted max-w-lg mx-auto">
          The best audio content on SoundWave, selected by the community and our editorial team.
        </p>
      </div>

      {/* HOF entries */}
      <div className="space-y-6">
        {hofAudios.length > 0 ? (
          hofAudios.map((audio, i) => {
            const poster = audio.poster!
            return (
              <div
                key={audio.id}
                className="relative overflow-hidden bg-dark-card border border-yellow-400/20 rounded-3xl"
              >
                {/* Background */}
                {audio.thumbnail_url && (
                  <div className="absolute inset-0 opacity-10">
                    <Image src={audio.thumbnail_url} alt="" fill className="object-cover blur-2xl" />
                  </div>
                )}

                <div className="relative p-6 flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                  {/* Rank */}
                  <div className="text-5xl font-bold text-yellow-400/30 absolute top-4 right-6">
                    #{i + 1}
                  </div>

                  {/* Thumbnail */}
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 shadow-xl shadow-yellow-400/20">
                    {audio.thumbnail_url ? (
                      <Image src={audio.thumbnail_url} alt={audio.title} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 flex items-center justify-center">
                        <Star size={32} className="text-yellow-400" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                      <Badge variant="hof">
                        <Star size={10} className="text-yellow-400" /> Hall of Fame
                      </Badge>
                      <Badge variant="outline">{audio.category}</Badge>
                    </div>
                    <Link href={`/audio/${audio.id}`}>
                      <h2 className="text-xl font-bold text-foreground hover:text-primary transition-colors mb-2">
                        {audio.title}
                      </h2>
                    </Link>
                    <Link href={`/profile/${poster.username}`} className="flex items-center gap-2 mb-3 justify-center sm:justify-start">
                      <Avatar src={poster.avatar_url} name={poster.display_name || poster.username} size="xs" />
                      <span className="text-sm text-dark-muted hover:text-foreground transition-colors">
                        {poster.display_name || poster.username}
                      </span>
                    </Link>
                    <div className="flex items-center gap-4 text-sm text-dark-muted justify-center sm:justify-start">
                      <span className="flex items-center gap-1.5">
                        <Headphones size={14} /> {formatNumber(audio.play_count)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Heart size={14} /> {formatNumber(audio.like_count)}
                      </span>
                      <span>{formatDuration(audio.duration)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-16 text-dark-muted">
            <Star size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-lg">No Hall of Fame entries yet</p>
          </div>
        )}
      </div>

      {/* How to get in */}
      <div className="bg-dark-card border border-dark-border rounded-3xl p-8 text-center">
        <h2 className="text-xl font-bold text-foreground mb-3">How to Enter the Hall of Fame</h2>
        <p className="text-dark-muted max-w-xl mx-auto">
          Audio content with exceptional quality, community engagement, and lasting impact may be selected for the Hall of Fame by our editorial team.
          Keep creating and engaging with the community!
        </p>
      </div>
    </div>
  )
}
