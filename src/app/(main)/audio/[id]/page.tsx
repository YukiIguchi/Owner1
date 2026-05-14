import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Play, Heart, Share2, Bookmark, Flag, Clock, Headphones, Tag,
  MessageSquare, Coins, Star, ListPlus
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { AudioCard } from '@/components/audio/audio-card'
import { Card, CardContent } from '@/components/ui/card'
import { formatDuration, formatNumber, formatRelativeTime } from '@/lib/utils'
import { mockAudioPosts } from '@/lib/mock-data'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const audio = mockAudioPosts.find((a) => a.id === id)
  if (!audio) return {}
  return {
    title: audio.title,
    description: audio.description,
  }
}

const mockComments = [
  {
    id: 'c1',
    content: 'とても癒されました！毎晩聴いています🌙',
    like_count: 42,
    created_at: '2024-12-10T20:00:00Z',
    user: { username: 'listener_taro', display_name: '田中太郎', avatar_url: null },
  },
  {
    id: 'c2',
    content: '音質がとても良くて、まるで隣にいるみたいです。ありがとうございます！',
    like_count: 28,
    created_at: '2024-12-11T08:30:00Z',
    user: { username: 'sleepy_hana', display_name: '花山さくら', avatar_url: null },
  },
  {
    id: 'c3',
    content: 'この曲を聴きながら勉強するとはかどります。次の作品も楽しみにしています！',
    like_count: 15,
    created_at: '2024-12-12T14:00:00Z',
    user: { username: 'study_kenta', display_name: 'ケンタ', avatar_url: null },
  },
]

export default async function AudioDetailPage({ params }: Props) {
  const { id } = await params
  const audio = mockAudioPosts.find((a) => a.id === id)

  if (!audio) notFound()

  const poster = audio.poster!
  const related = mockAudioPosts
    .filter((a) => a.id !== audio.id && a.category === audio.category)
    .slice(0, 4)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thumbnail + Player */}
          <div className="relative rounded-3xl overflow-hidden aspect-square max-w-sm mx-auto lg:mx-0">
            {audio.thumbnail_url ? (
              <Image
                src={audio.thumbnail_url}
                alt={audio.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                <Headphones size={80} className="text-white/40" />
              </div>
            )}

            {/* Play button overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <button className="w-20 h-20 rounded-full bg-primary shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 transition-transform">
                <Play size={36} fill="white" className="text-white ml-2" />
              </button>
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {audio.is_hall_of_fame && <Badge variant="hof"><Star size={10} /> HOF</Badge>}
              {audio.is_premium_only && <Badge variant="premium">Premium</Badge>}
            </div>
          </div>

          {/* Title & Info */}
          <div>
            <Badge variant="outline" className="mb-2">{audio.category}</Badge>
            <h1 className="text-2xl font-bold text-foreground mb-2">{audio.title}</h1>

            <div className="flex items-center gap-4 text-sm text-dark-muted mb-4">
              <span className="flex items-center gap-1.5">
                <Headphones size={14} />
                {formatNumber(audio.play_count)} plays
              </span>
              <span className="flex items-center gap-1.5">
                <Heart size={14} />
                {formatNumber(audio.like_count)} likes
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {formatDuration(audio.duration)}
              </span>
              <span className="ml-auto">{formatRelativeTime(audio.published_at!)}</span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              <Button variant="primary">
                <Heart size={16} /> Like
              </Button>
              <Button variant="outline">
                <Bookmark size={16} /> Save
              </Button>
              <Button variant="outline">
                <ListPlus size={16} /> Playlist
              </Button>
              <Button variant="outline">
                <Coins size={16} /> Tip
              </Button>
              <Button variant="outline">
                <Share2 size={16} /> Share
              </Button>
              <Button variant="ghost" size="icon">
                <Flag size={16} />
              </Button>
            </div>
          </div>

          {/* Poster card */}
          <Card>
            <CardContent>
              <Link href={`/profile/${poster.username}`} className="flex items-start gap-4 group">
                <Avatar
                  src={poster.avatar_url}
                  name={poster.display_name || poster.username}
                  size="lg"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {poster.display_name || poster.username}
                    </h2>
                    {poster.is_premium && <Badge variant="premium">Premium</Badge>}
                    {poster.is_poster && <Badge variant="primary">Creator</Badge>}
                  </div>
                  <p className="text-xs text-dark-muted">@{poster.username}</p>
                  {poster.bio && (
                    <p className="text-sm text-foreground/70 mt-2 line-clamp-2">{poster.bio}</p>
                  )}
                  <p className="text-xs text-dark-muted mt-1">
                    {formatNumber(poster.follower_count)} followers · {formatNumber(poster.total_plays)} total plays
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={(e) => e.preventDefault()}>
                  Follow
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Description */}
          {audio.description && (
            <Card>
              <CardContent>
                <h3 className="font-semibold text-foreground mb-2">Description</h3>
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                  {audio.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {audio.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {audio.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="flex items-center gap-1 text-sm text-dark-muted hover:text-primary transition-colors"
                >
                  <Tag size={12} />
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* Comments */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare size={18} className="text-primary" />
              Comments ({mockComments.length})
            </h3>

            {/* Comment form */}
            <div className="flex gap-3 mb-6">
              <Avatar name="User" size="sm" />
              <div className="flex-1 flex gap-2">
                <input
                  placeholder="Write a comment..."
                  className="flex-1 bg-dark-card border border-dark-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
                <Button size="sm">Post</Button>
              </div>
            </div>

            {/* Comment list */}
            <div className="space-y-4">
              {mockComments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar
                    name={comment.user.display_name || comment.user.username}
                    size="sm"
                  />
                  <div className="flex-1">
                    <div className="bg-dark-card border border-dark-border rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">
                          {comment.user.display_name || comment.user.username}
                        </span>
                        <span className="text-xs text-dark-muted">{formatRelativeTime(comment.created_at)}</span>
                      </div>
                      <p className="text-sm text-foreground/80">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 px-2">
                      <button className="flex items-center gap-1 text-xs text-dark-muted hover:text-primary transition-colors">
                        <Heart size={12} /> {comment.like_count}
                      </button>
                      <button className="text-xs text-dark-muted hover:text-foreground transition-colors">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Series info */}
          {audio.series_id && (
            <Card>
              <CardContent>
                <h3 className="font-semibold text-foreground mb-3">Series · Episode {audio.episode_number}</h3>
                <p className="text-sm text-dark-muted">Part of a series collection</p>
              </CardContent>
            </Card>
          )}

          {/* Related */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">More like this</h3>
            <div className="space-y-3">
              {related.map((a) => (
                <AudioCard key={a.id} audio={a} compact />
              ))}
            </div>
          </div>

          {/* Poster&apos;s other uploads */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">
              More from {poster.display_name || poster.username}
            </h3>
            <div className="space-y-3">
              {mockAudioPosts
                .filter((a) => a.poster_id === audio.poster_id && a.id !== audio.id)
                .slice(0, 3)
                .map((a) => (
                  <AudioCard key={a.id} audio={a} compact />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
