'use client'

import Image from 'next/image'
import { Share2, Flag, Settings, UserPlus, UserCheck } from 'lucide-react'
import { Profile } from '@/lib/database.types'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatNumber } from '@/lib/utils'
import { useState } from 'react'

interface ProfileHeaderProps {
  profile: Profile
  isOwn?: boolean
  isFollowing?: boolean
  onFollow?: () => void
}

export function ProfileHeader({ profile, isOwn, isFollowing, onFollow }: ProfileHeaderProps) {
  const [following, setFollowing] = useState(isFollowing)

  const handleFollow = () => {
    setFollowing(!following)
    onFollow?.()
  }

  const snsLinks = profile.sns_links as Record<string, string> | null

  return (
    <div className="relative">
      {/* Banner */}
      <div className="h-40 md:h-56 bg-gradient-to-br from-primary/20 via-dark-card to-secondary/20 rounded-b-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 to-transparent" />
      </div>

      {/* Profile info */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4 -mt-16 relative">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-dark-bg bg-dark-card">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.display_name || profile.username}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {(profile.display_name || profile.username)[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-2 md:pt-20">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-foreground">
                    {profile.display_name || profile.username}
                  </h1>
                  {profile.is_premium && (
                    <Badge variant="premium">Premium</Badge>
                  )}
                  {profile.is_poster && (
                    <Badge variant="primary">Creator</Badge>
                  )}
                </div>
                <p className="text-dark-muted text-sm">@{profile.username}</p>
                {profile.bio && (
                  <p className="text-sm text-foreground/80 mt-2 max-w-lg">{profile.bio}</p>
                )}
                {snsLinks && Object.keys(snsLinks).length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {Object.entries(snsLinks).map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline capitalize"
                      >
                        {platform}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {isOwn ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => {}}>
                      <Settings size={14} />
                      Edit Profile
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant={following ? 'outline' : 'primary'}
                      size="sm"
                      onClick={handleFollow}
                    >
                      {following ? (
                        <><UserCheck size={14} /> Following</>
                      ) : (
                        <><UserPlus size={14} /> Follow</>
                      )}
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share2 size={16} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Flag size={16} />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
