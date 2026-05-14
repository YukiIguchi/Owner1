import { TrendingUp, Medal, Crown, Star } from 'lucide-react'
import { AudioCard } from '@/components/audio/audio-card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { formatNumber } from '@/lib/utils'
import { mockAudioPosts, mockProfiles } from '@/lib/mock-data'
import Link from 'next/link'

const rankColors = ['text-yellow-400', 'text-gray-400', 'text-amber-600']
const rankIcons = [
  <Crown key={1} size={16} className="text-yellow-400" />,
  <Medal key={2} size={16} className="text-gray-400" />,
  <Medal key={3} size={16} className="text-amber-600" />,
]

export default function RankingPage() {
  const topAudios = [...mockAudioPosts].sort((a, b) => b.play_count - a.play_count)
  const topCreators = [...mockProfiles].sort((a, b) => b.total_plays - a.total_plays)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-1">
          <TrendingUp size={24} className="text-primary" />
          Rankings
        </h1>
        <p className="text-dark-muted text-sm">Top audio content and creators on SoundWave</p>
      </div>

      <Tabs defaultValue="audio">
        <TabsList className="mb-6 w-full max-w-xs">
          <TabsTrigger value="audio">Top Audio</TabsTrigger>
          <TabsTrigger value="creators">Creators</TabsTrigger>
        </TabsList>

        <TabsContent value="audio">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {topAudios.map((audio, index) => (
              <div key={audio.id} className="flex items-center gap-3">
                {/* Rank number */}
                <div className="w-8 flex-shrink-0 flex flex-col items-center">
                  {index < 3 ? (
                    rankIcons[index]
                  ) : (
                    <span className={`text-lg font-bold ${index < 3 ? rankColors[index] : 'text-dark-muted'}`}>
                      {index + 1}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <AudioCard audio={audio} compact />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="creators">
          <div className="space-y-3">
            {topCreators.map((profile, index) => (
              <Link
                key={profile.id}
                href={`/profile/${profile.username}`}
                className="flex items-center gap-4 p-4 bg-dark-card border border-dark-border rounded-2xl hover:border-primary/50 transition-colors group"
              >
                {/* Rank */}
                <div className="w-8 flex-shrink-0 text-center">
                  {index < 3 ? (
                    rankIcons[index]
                  ) : (
                    <span className="text-lg font-bold text-dark-muted">{index + 1}</span>
                  )}
                </div>

                {/* Avatar */}
                <Avatar
                  src={profile.avatar_url}
                  name={profile.display_name || profile.username}
                  size="md"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {profile.display_name || profile.username}
                    </span>
                    {profile.is_premium && <Badge variant="premium">Premium</Badge>}
                  </div>
                  <p className="text-xs text-dark-muted">@{profile.username}</p>
                </div>

                {/* Stats */}
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-foreground">
                    {formatNumber(profile.total_plays)}
                  </p>
                  <p className="text-xs text-dark-muted">total plays</p>
                </div>
                <div className="text-right hidden md:block">
                  <p className="text-sm font-semibold text-foreground">
                    {formatNumber(profile.follower_count)}
                  </p>
                  <p className="text-xs text-dark-muted">followers</p>
                </div>

                {/* Level */}
                <Badge variant="secondary" className="flex-shrink-0">
                  <Star size={10} />
                  Lv.{profile.level}
                </Badge>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
