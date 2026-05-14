import Link from 'next/link'
import Image from 'next/image'
import { Play, TrendingUp, Clock, Star, Headphones, ArrowRight, Sparkles } from 'lucide-react'
import { AudioGrid } from '@/components/audio/audio-grid'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { CATEGORIES } from '@/lib/constants'
import { formatNumber, formatDuration } from '@/lib/utils'
import { TRENDING_AUDIOS, RECENT_AUDIOS, FEATURED_AUDIO, mockProfiles } from '@/lib/mock-data'

export default function HomePage() {
  const featured = FEATURED_AUDIO
  const poster = featured.poster!

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">

      {/* Hero / Featured */}
      <section>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-dark-card via-dark-card to-dark-bg border border-dark-border">
          {/* Background image */}
          {featured.thumbnail_url && (
            <div className="absolute inset-0 opacity-20">
              <Image
                src={featured.thumbnail_url}
                alt=""
                fill
                className="object-cover blur-2xl"
              />
            </div>
          )}
          <div className="relative p-6 md:p-10 flex flex-col md:flex-row gap-6 items-center">
            {/* Thumbnail */}
            <div className="relative flex-shrink-0 w-40 h-40 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl shadow-primary/20">
              {featured.thumbnail_url ? (
                <Image
                  src={featured.thumbnail_url}
                  alt={featured.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center">
                  <Headphones size={48} className="text-white/60" />
                </div>
              )}
              {featured.is_hall_of_fame && (
                <div className="absolute top-2 left-2">
                  <Badge variant="hof"><Star size={10} /> Hall of Fame</Badge>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-4 flex-1 text-center md:text-left">
              <div>
                <Badge variant="primary" className="mb-2">{featured.category}</Badge>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                  {featured.title}
                </h1>
              </div>

              <Link href={`/profile/${poster.username}`} className="flex items-center gap-2 justify-center md:justify-start group">
                <Avatar src={poster.avatar_url} name={poster.display_name || poster.username} size="sm" />
                <span className="text-dark-muted group-hover:text-foreground transition-colors text-sm">
                  {poster.display_name || poster.username}
                </span>
              </Link>

              <p className="text-sm text-dark-muted line-clamp-2">{featured.description}</p>

              <div className="flex items-center gap-4 text-sm text-dark-muted justify-center md:justify-start">
                <span className="flex items-center gap-1"><Headphones size={14} /> {formatNumber(featured.play_count)}</span>
                <span className="flex items-center gap-1"><Clock size={14} /> {formatDuration(featured.duration)}</span>
              </div>

              <div className="flex gap-3 justify-center md:justify-start">
                <Link href={`/audio/${featured.id}`}>
                  <Button size="lg">
                    <Play size={18} fill="white" />
                    Play Now
                  </Button>
                </Link>
                <Link href={`/audio/${featured.id}`}>
                  <Button variant="outline" size="lg">View Details</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <Link
            href="/search"
            className="flex-shrink-0 px-5 py-2 rounded-full bg-primary text-white text-sm font-medium"
          >
            All
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/search?category=${encodeURIComponent(cat)}`}
              className="flex-shrink-0 px-5 py-2 rounded-full bg-dark-card border border-dark-border text-dark-muted text-sm hover:text-foreground hover:border-primary transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" />
            Trending Now
          </h2>
          <Link href="/ranking" className="flex items-center gap-1 text-sm text-dark-muted hover:text-primary transition-colors">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <AudioGrid audios={TRENDING_AUDIOS} columns={3} />
      </section>

      {/* Featured Creators */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Sparkles size={20} className="text-secondary" />
            Featured Creators
          </h2>
          <Link href="/search?type=creators" className="flex items-center gap-1 text-sm text-dark-muted hover:text-primary transition-colors">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {mockProfiles.map((profile) => (
            <Link
              key={profile.id}
              href={`/profile/${profile.username}`}
              className="bg-dark-card border border-dark-border rounded-2xl p-4 flex flex-col items-center gap-3 hover:border-primary/50 transition-colors group"
            >
              <Avatar src={profile.avatar_url} name={profile.display_name || profile.username} size="lg" />
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate w-full">
                  {profile.display_name || profile.username}
                </p>
                <p className="text-xs text-dark-muted">{formatNumber(profile.follower_count)} followers</p>
              </div>
              {profile.is_premium && <Badge variant="premium">Premium</Badge>}
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Uploads */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Clock size={20} className="text-secondary" />
            Recent Uploads
          </h2>
          <Link href="/search?sort=newest" className="flex items-center gap-1 text-sm text-dark-muted hover:text-primary transition-colors">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <AudioGrid audios={RECENT_AUDIOS} columns={4} />
      </section>

      {/* Premium CTA */}
      <section>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 p-8 md:p-12">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />
          <div className="relative text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <Badge variant="premium" className="mb-3">Premium</Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Unlock Premium Audio
              </h2>
              <p className="text-dark-muted max-w-md">
                Access exclusive content, extended history, unlimited playlists, and support your favorite creators.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="text-center mb-2">
                <span className="text-3xl font-bold gradient-text">¥980</span>
                <span className="text-dark-muted">/month</span>
              </div>
              <Link href="/premium">
                <Button size="lg" variant="secondary">
                  Get Premium
                </Button>
              </Link>
              <p className="text-xs text-dark-muted">or ¥9,800/year (save 16%)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hall of Fame teaser */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Star size={20} className="text-yellow-400" />
            Hall of Fame
          </h2>
          <Link href="/hall-of-fame" className="flex items-center gap-1 text-sm text-dark-muted hover:text-primary transition-colors">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <AudioGrid audios={TRENDING_AUDIOS.filter(a => a.is_hall_of_fame)} columns={3} />
      </section>
    </div>
  )
}
