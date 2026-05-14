import { Profile } from '@/lib/database.types'
import { formatNumber } from '@/lib/utils'
import { Headphones, Users, UserCheck, Star } from 'lucide-react'

interface ProfileStatsProps {
  profile: Profile
}

export function ProfileStats({ profile }: ProfileStatsProps) {
  const stats = [
    { label: 'Total Plays', value: formatNumber(profile.total_plays), icon: <Headphones size={16} /> },
    { label: 'Followers', value: formatNumber(profile.follower_count), icon: <Users size={16} /> },
    { label: 'Following', value: formatNumber(profile.following_count), icon: <UserCheck size={16} /> },
    { label: 'Level', value: profile.level, icon: <Star size={16} /> },
  ]

  return (
    <div className="flex gap-6 flex-wrap">
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center gap-2">
          <span className="text-dark-muted">{stat.icon}</span>
          <div>
            <p className="text-lg font-bold text-foreground leading-none">{stat.value}</p>
            <p className="text-xs text-dark-muted">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
