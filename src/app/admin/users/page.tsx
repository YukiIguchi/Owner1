import { Shield, Search, Ban, CheckCircle } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { mockProfiles } from '@/lib/mock-data'
import { formatDate, formatNumber } from '@/lib/utils'
import Link from 'next/link'

export default function AdminUsersPage() {
  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="border-b border-dark-border bg-dark-card px-6 py-4 flex items-center gap-3">
        <Shield size={20} className="text-primary" />
        <span className="text-dark-muted text-sm">
          <Link href="/admin" className="hover:text-foreground">Admin</Link> / Users
        </span>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">User Management</h1>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" />
            <input
              placeholder="Search users..."
              className="bg-dark-card border border-dark-border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {['All', 'Creators', 'Premium', 'Banned'].map((f) => (
            <button
              key={f}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                f === 'All' ? 'bg-primary text-white' : 'bg-dark-card border border-dark-border text-dark-muted'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* User table */}
        <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left px-4 py-3 text-xs text-dark-muted font-medium uppercase">User</th>
                <th className="text-left px-4 py-3 text-xs text-dark-muted font-medium uppercase hidden md:table-cell">Joined</th>
                <th className="text-left px-4 py-3 text-xs text-dark-muted font-medium uppercase hidden sm:table-cell">Followers</th>
                <th className="text-left px-4 py-3 text-xs text-dark-muted font-medium uppercase">Status</th>
                <th className="text-right px-4 py-3 text-xs text-dark-muted font-medium uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockProfiles.map((profile) => (
                <tr key={profile.id} className="border-b border-dark-border/50 last:border-0 hover:bg-dark-border/20">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar src={profile.avatar_url} name={profile.display_name || profile.username} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{profile.display_name || profile.username}</p>
                        <p className="text-xs text-dark-muted">@{profile.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-sm text-dark-muted">{formatDate(profile.created_at)}</span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-sm text-foreground">{formatNumber(profile.follower_count)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {profile.is_poster && <Badge variant="primary">Creator</Badge>}
                      {profile.is_premium && <Badge variant="premium">Premium</Badge>}
                      {!profile.is_poster && !profile.is_premium && <Badge variant="default">Free</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" title="Approve">
                        <CheckCircle size={14} className="text-secondary" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Ban">
                        <Ban size={14} className="text-red-400" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
