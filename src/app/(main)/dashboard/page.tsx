import Link from 'next/link'
import { BarChart2, Music, TrendingUp, DollarSign, Users, Headphones, ArrowRight, Upload } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatNumber } from '@/lib/utils'
import { mockAudioPosts } from '@/lib/mock-data'

const statCards = [
  { label: 'Total Plays', value: '89,200', change: '+12.5%', icon: <Headphones size={20} />, color: 'text-primary' },
  { label: 'Total Likes', value: '7,800', change: '+8.3%', icon: <TrendingUp size={20} />, color: 'text-secondary' },
  { label: 'Followers', value: '8,700', change: '+5.1%', icon: <Users size={20} />, color: 'text-blue-400' },
  { label: 'Earnings (coins)', value: '12,450', change: '+23.7%', icon: <DollarSign size={20} />, color: 'text-yellow-400' },
]

export default function DashboardPage() {
  const posts = mockAudioPosts.filter((a) => a.poster_id === 'u2').slice(0, 5)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Creator Dashboard</h1>
          <p className="text-dark-muted text-sm">Welcome back! Here&apos;s your overview.</p>
        </div>
        <Link href="/dashboard/posts/new">
          <Button>
            <Upload size={16} /> Upload Audio
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent>
              <div className={`flex items-center gap-2 mb-2 ${stat.color}`}>
                {stat.icon}
                <span className="text-xs text-dark-muted uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-secondary mt-1">{stat.change} this month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: '/dashboard/analytics', label: 'Analytics', desc: 'Detailed play and engagement stats', icon: <BarChart2 size={20} /> },
          { href: '/dashboard/posts', label: 'Manage Posts', desc: 'Edit, delete, and schedule audio', icon: <Music size={20} /> },
          { href: '/dashboard/earnings', label: 'Earnings', desc: 'View coin earnings and history', icon: <DollarSign size={20} /> },
        ].map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent>
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-primary">{link.icon}</div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{link.label}</h3>
                  <ArrowRight size={14} className="ml-auto text-dark-muted group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-dark-muted">{link.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center gap-3 p-3 bg-dark-bg rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Music size={16} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{post.title}</p>
                  <p className="text-xs text-dark-muted">{formatNumber(post.play_count)} plays · {formatNumber(post.like_count)} likes</p>
                </div>
                <Badge variant={post.visibility === 'public' ? 'secondary' : 'outline'}>
                  {post.visibility}
                </Badge>
              </div>
            ))}
          </div>
          <Link href="/dashboard/posts" className="block text-center mt-4">
            <Button variant="ghost" size="sm">View all posts <ArrowRight size={14} /></Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
