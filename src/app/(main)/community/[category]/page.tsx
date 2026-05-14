import { BoardPost } from '@/components/community/board-post'
import { BoardForm } from '@/components/community/board-form'
import { mockCommunityPosts } from '@/lib/mock-data'
import { MessageSquare } from 'lucide-react'

interface Props {
  params: Promise<{ category: string }>
}

export default async function CommunityCategoryPage({ params }: Props) {
  const { category } = await params
  const posts = mockCommunityPosts.filter((p) => p.category === category)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 capitalize">
        <MessageSquare size={24} className="text-primary" />
        {category}
      </h1>

      <BoardForm />

      <div className="space-y-3">
        {posts.length > 0 ? (
          posts.map((post) => <BoardPost key={post.id} post={post} />)
        ) : (
          <div className="text-center py-16 text-dark-muted">
            <p>No posts in this category yet. Be the first!</p>
          </div>
        )}
      </div>
    </div>
  )
}
