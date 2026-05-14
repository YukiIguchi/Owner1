import { notFound } from 'next/navigation'
import { ProfileHeader } from '@/components/profile/profile-header'
import { ProfileStats } from '@/components/profile/profile-stats'
import { AudioGrid } from '@/components/audio/audio-grid'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { mockProfiles, mockAudioPosts } from '@/lib/mock-data'
import { Star, Headphones } from 'lucide-react'

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props) {
  const { username } = await params
  const profile = mockProfiles.find((p) => p.username === username)
  if (!profile) return {}
  return {
    title: profile.display_name || profile.username,
    description: profile.bio || `Listen to audio from ${profile.display_name || profile.username} on SoundWave`,
  }
}

const BADGE_LABELS: Record<string, string> = {
  early_adopter: 'Early Adopter',
  top_poster: 'Top Creator',
  hall_of_fame: 'Hall of Fame',
  premium_creator: 'Premium Creator',
  community_star: 'Community Star',
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params
  const profile = mockProfiles.find((p) => p.username === username)

  if (!profile) notFound()

  const profileAudios = mockAudioPosts.filter((a) => a.poster_id === profile.id)
  const badges = (profile.badges as string[]) || []

  return (
    <div className="min-h-screen">
      <ProfileHeader profile={profile} isOwn={false} isFollowing={false} />

      <div className="max-w-7xl mx-auto px-4 mt-6 pb-8 space-y-6">
        {/* Stats */}
        <ProfileStats profile={profile} />

        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <Badge key={badge} variant="premium" className="gap-1">
                <Star size={10} />
                {BADGE_LABELS[badge] || badge}
              </Badge>
            ))}
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="audio">
          <TabsList className="max-w-sm">
            <TabsTrigger value="audio">Audio ({profileAudios.length})</TabsTrigger>
            <TabsTrigger value="liked">Liked</TabsTrigger>
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
          </TabsList>

          <TabsContent value="audio" className="mt-6">
            {profileAudios.length > 0 ? (
              <AudioGrid audios={profileAudios} columns={4} />
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-dark-muted">
                <Headphones size={48} className="mb-3 opacity-40" />
                <p className="text-lg">No audio published yet</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="liked" className="mt-6">
            <div className="flex flex-col items-center justify-center py-16 text-dark-muted">
              <p>Liked audio is private</p>
            </div>
          </TabsContent>

          <TabsContent value="playlists" className="mt-6">
            <div className="flex flex-col items-center justify-center py-16 text-dark-muted">
              <p>No public playlists</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
