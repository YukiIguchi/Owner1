export const CATEGORIES = ['ASMR', '音声ドラマ', 'トーク', '音楽', 'その他'] as const
export type Category = typeof CATEGORIES[number]

export const PLAN_MONTHLY_PRICE = 980 // yen
export const PLAN_YEARLY_PRICE = 9800 // yen
export const COIN_MIN_TIP = 1
export const COIN_MAX_TIP_SINGLE = 10000
export const COIN_MAX_TIP_DAILY = 50000
export const PLAY_COUNT_THRESHOLD_SECONDS = 15
export const FREE_HISTORY_LIMIT = 30
export const PREMIUM_HISTORY_LIMIT = 120
export const FREE_SEARCH_HISTORY_LIMIT = 3
export const PREMIUM_KEYWORD_ALERTS = 10

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/search', label: 'Discover' },
  { href: '/ranking', label: 'Ranking' },
  { href: '/community', label: 'Community' },
] as const

export const VISIBILITY_OPTIONS = ['public', 'private', 'followers_only', 'scheduled'] as const
export type Visibility = typeof VISIBILITY_OPTIONS[number]

export const NOTIFICATION_TYPES = [
  'new_follower',
  'new_like',
  'new_comment',
  'new_tip',
  'series_update',
  'hall_of_fame',
  'system',
] as const

export const COMMUNITY_CATEGORIES = [
  'general',
  'feedback',
  'requests',
  'announcements',
  'introductions',
] as const

export const COIN_PACKAGES = [
  { coins: 100, price: 120, label: '100 coins' },
  { coins: 500, price: 550, label: '500 coins' },
  { coins: 1000, price: 1000, label: '1,000 coins' },
  { coins: 5000, price: 4500, label: '5,000 coins' },
] as const

export const LEVEL_THRESHOLDS = [
  { level: 1, plays: 0, label: 'Newcomer' },
  { level: 2, plays: 100, label: 'Rising' },
  { level: 3, plays: 500, label: 'Regular' },
  { level: 4, plays: 1000, label: 'Popular' },
  { level: 5, plays: 5000, label: 'Trending' },
  { level: 6, plays: 10000, label: 'Famous' },
  { level: 7, plays: 50000, label: 'Legend' },
] as const

export const BADGE_TYPES = [
  'early_adopter',
  'top_poster',
  'hall_of_fame',
  'premium_creator',
  'community_star',
] as const

export const REPORT_REASONS = [
  'inappropriate_content',
  'spam',
  'copyright_violation',
  'harassment',
  'other',
] as const

export const SITE_NAME = 'SoundWave'
export const SITE_DESCRIPTION = 'Discover and share audio content'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://soundwave.app'
