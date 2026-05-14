import { MessageSquare, Users } from 'lucide-react'
import { BoardPost } from '@/components/community/board-post'
import { BoardForm } from '@/components/community/board-form'
import { Badge } from '@/components/ui/badge'
import { COMMUNITY_CATEGORIES } from '@/lib/constants'
import { mockCommunityPosts } from '@/lib/mock-data'
import Link from 'next/link'

export default function CommunityPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MessageSquare size={24} className="text-primary" />
            Community Board
          </h1>
          <p className="text-dark-muted text-sm mt-1">Connect with creators and listeners</p>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-dark-muted">
          <Users size={14} />
          <span>2,847 members</span>
        </div>
      </div>

      {/* Category nav */}
      <div className="flex flex-wrap gap-2">
        <Link href="/community" className="px-4 py-1.5 rounded-full bg-primary text-white text-sm">
          All
        </Link>
        {COMMUNITY_CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/community/${cat}`}
            className="px-4 py-1.5 rounded-full bg-dark-card border border-dark-border text-dark-muted text-sm hover:text-foreground hover:border-primary transition-colors capitalize"
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Post form */}
      <BoardForm />

      {/* Posts */}
      <div className="space-y-3">
        {mockCommunityPosts.map((post) => (
          <BoardPost key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
