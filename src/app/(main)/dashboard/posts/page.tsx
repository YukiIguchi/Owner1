import Link from 'next/link'
import { Music, Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatNumber, formatDuration, formatRelativeTime } from '@/lib/utils'
import { mockAudioPosts } from '@/lib/mock-data'

export default function PostsPage() {
  const posts = mockAudioPosts.filter((a) => a.poster_id === 'u1')

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Music size={24} className="text-primary" />
          My Posts
        </h1>
        <Link href="/dashboard/posts/new">
          <Button>
            <Plus size={16} /> New Post
          </Button>
        </Link>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['All', 'Public', 'Private', 'Premium', 'Scheduled'].map((f) => (
          <button
            key={f}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              f === 'All'
                ? 'bg-primary text-white'
                : 'bg-dark-card border border-dark-border text-dark-muted hover:text-foreground'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table-like list */}
      <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-dark-border text-xs text-dark-muted font-medium uppercase tracking-wider">
          <div className="col-span-5">Title</div>
          <div className="col-span-2 text-center">Plays</div>
          <div className="col-span-2 text-center">Duration</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        {posts.map((post) => (
          <div key={post.id} className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-dark-border/50 last:border-0 items-center hover:bg-dark-border/20 transition-colors">
            <div className="col-span-5 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{post.title}</p>
              <p className="text-xs text-dark-muted mt-0.5">{post.category} · {formatRelativeTime(post.created_at)}</p>
            </div>
            <div className="col-span-2 text-center">
              <span className="text-sm font-medium text-foreground">{formatNumber(post.play_count)}</span>
            </div>
            <div className="col-span-2 text-center">
              <span className="text-sm text-dark-muted">{formatDuration(post.duration)}</span>
            </div>
            <div className="col-span-1 flex justify-center">
              <Badge variant={post.visibility === 'public' ? 'secondary' : 'outline'}>
                {post.visibility === 'public' ? <Eye size={10} /> : <EyeOff size={10} />}
              </Badge>
            </div>
            <div className="col-span-2 flex justify-end gap-1">
              <Button variant="ghost" size="icon">
                <Edit2 size={14} />
              </Button>
              <Button variant="ghost" size="icon">
                <Trash2 size={14} className="text-red-400" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
