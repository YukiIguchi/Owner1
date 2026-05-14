export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Visibility = 'public' | 'private' | 'followers_only' | 'scheduled'
export type NotificationType =
  | 'new_follower'
  | 'new_like'
  | 'new_comment'
  | 'new_tip'
  | 'series_update'
  | 'hall_of_fame'
  | 'system'
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed'
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing'
export type CoinTransactionType = 'tip' | 'purchase' | 'refund' | 'bonus'

export interface Profile {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  sns_links: Json | null
  is_poster: boolean
  is_premium: boolean
  custom_url: string | null
  follower_count: number
  following_count: number
  total_plays: number
  level: number
  badges: Json | null
  theme_template: string | null
  created_at: string
}

export interface AudioPost {
  id: string
  poster_id: string
  title: string
  description: string | null
  tags: string[]
  category: string
  audio_url: string
  thumbnail_url: string | null
  duration: number
  file_size: number
  play_count: number
  like_count: number
  visibility: Visibility
  series_id: string | null
  episode_number: number | null
  language: string | null
  age_restricted: boolean
  is_premium_only: boolean
  is_hall_of_fame: boolean
  scheduled_at: string | null
  published_at: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  // Joined data
  poster?: Profile
}

export interface Series {
  id: string
  poster_id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  created_at: string
}

export interface Play {
  id: string
  audio_id: string
  user_id: string | null
  played_at: string
  duration_played: number
}

export interface Like {
  id: string
  audio_id: string
  user_id: string
  created_at: string
}

export interface Comment {
  id: string
  audio_id: string
  user_id: string
  content: string
  like_count: number
  is_edited: boolean
  is_deleted: boolean
  created_at: string
  updated_at: string
  // Joined data
  user?: Profile
}

export interface CommentReaction {
  id: string
  comment_id: string
  user_id: string
  reaction_type: string
}

export interface Follow {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}

export interface Playlist {
  id: string
  user_id: string
  title: string
  is_public: boolean
  audio_ids: string[]
  created_at: string
}

export interface Coin {
  id: string
  user_id: string
  balance: number
  created_at: string
}

export interface CoinTransaction {
  id: string
  from_user_id: string | null
  to_user_id: string
  amount: number
  type: CoinTransactionType
  message: string | null
  audio_id: string | null
  is_anonymous: boolean
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  data: Json
  is_read: boolean
  created_at: string
}

export interface Report {
  id: string
  reporter_id: string
  target_type: 'audio' | 'comment' | 'user'
  target_id: string
  reason: string
  status: ReportStatus
  created_at: string
}

export interface CommunityPost {
  id: string
  user_id: string
  category: string
  content: string
  like_count: number
  created_at: string
  // Joined data
  user?: Profile
}

export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id: string
  status: SubscriptionStatus
  current_period_end: string
  created_at: string
}

export interface Favorite {
  id: string
  user_id: string
  audio_id: string
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> }
      audio_posts: { Row: AudioPost; Insert: Partial<AudioPost>; Update: Partial<AudioPost> }
      series: { Row: Series; Insert: Partial<Series>; Update: Partial<Series> }
      plays: { Row: Play; Insert: Partial<Play>; Update: Partial<Play> }
      likes: { Row: Like; Insert: Partial<Like>; Update: Partial<Like> }
      comments: { Row: Comment; Insert: Partial<Comment>; Update: Partial<Comment> }
      comment_reactions: { Row: CommentReaction; Insert: Partial<CommentReaction>; Update: Partial<CommentReaction> }
      follows: { Row: Follow; Insert: Partial<Follow>; Update: Partial<Follow> }
      playlists: { Row: Playlist; Insert: Partial<Playlist>; Update: Partial<Playlist> }
      coins: { Row: Coin; Insert: Partial<Coin>; Update: Partial<Coin> }
      coin_transactions: { Row: CoinTransaction; Insert: Partial<CoinTransaction>; Update: Partial<CoinTransaction> }
      notifications: { Row: Notification; Insert: Partial<Notification>; Update: Partial<Notification> }
      reports: { Row: Report; Insert: Partial<Report>; Update: Partial<Report> }
      community_posts: { Row: CommunityPost; Insert: Partial<CommunityPost>; Update: Partial<CommunityPost> }
      subscriptions: { Row: Subscription; Insert: Partial<Subscription>; Update: Partial<Subscription> }
      favorites: { Row: Favorite; Insert: Partial<Favorite>; Update: Partial<Favorite> }
    }
  }
}
