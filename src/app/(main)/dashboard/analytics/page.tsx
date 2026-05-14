import { BarChart2, TrendingUp, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Mock chart data
const weeklyData = [
  { day: 'Mon', plays: 1200, likes: 89 },
  { day: 'Tue', plays: 1800, likes: 134 },
  { day: 'Wed', plays: 900, likes: 67 },
  { day: 'Thu', plays: 2400, likes: 198 },
  { day: 'Fri', plays: 3100, likes: 245 },
  { day: 'Sat', plays: 2700, likes: 210 },
  { day: 'Sun', plays: 1900, likes: 156 },
]

const maxPlays = Math.max(...weeklyData.map(d => d.plays))

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <BarChart2 size={24} className="text-primary" />
          Analytics
        </h1>
        <p className="text-dark-muted text-sm mt-1">Track your performance over time</p>
      </div>

      {/* Period selector */}
      <div className="flex gap-2">
        {['7 days', '30 days', '3 months', '1 year'].map((p) => (
          <button
            key={p}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              p === '7 days'
                ? 'bg-primary text-white'
                : 'bg-dark-card border border-dark-border text-dark-muted hover:text-foreground'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Plays', value: '14,000', icon: <TrendingUp size={16} />, color: 'text-primary' },
          { label: 'Unique Listeners', value: '3,200', icon: <Calendar size={16} />, color: 'text-secondary' },
          { label: 'Avg. Duration', value: '18:34', icon: <BarChart2 size={16} />, color: 'text-blue-400' },
          { label: 'Completion Rate', value: '64%', icon: <TrendingUp size={16} />, color: 'text-yellow-400' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent>
              <div className={`flex items-center gap-2 text-xs text-dark-muted mb-2 ${stat.color}`}>
                {stat.icon}
                {stat.label}
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Play chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Plays</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3 h-48">
            {weeklyData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-dark-muted">{d.plays.toLocaleString()}</span>
                <div className="w-full relative">
                  <div
                    className="w-full bg-gradient-to-t from-primary to-primary/50 rounded-t-lg"
                    style={{ height: `${(d.plays / maxPlays) * 140}px` }}
                  />
                </div>
                <span className="text-xs text-dark-muted">{d.day}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top posts */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { title: '夜の図書館 - 音声ドラマ第2話', plays: '71,500', change: '+12%' },
              { title: '夜の図書館 - 音声ドラマ第1話', plays: '89,200', change: '+8%' },
            ].map((post) => (
              <div key={post.title} className="flex items-center gap-3 p-3 bg-dark-bg rounded-xl">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{post.title}</p>
                  <p className="text-xs text-dark-muted">{post.plays} plays</p>
                </div>
                <span className="text-xs text-secondary font-medium">{post.change}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
