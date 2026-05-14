-- SoundWave Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== PROFILES ====================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  sns_links JSONB DEFAULT '{}',
  is_poster BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  custom_url TEXT UNIQUE,
  follower_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  total_plays INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  badges JSONB DEFAULT '[]',
  theme_template TEXT DEFAULT 'default',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== SERIES ====================
CREATE TABLE IF NOT EXISTS series (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  poster_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== AUDIO POSTS ====================
CREATE TYPE visibility_type AS ENUM ('public', 'private', 'followers_only', 'scheduled');

CREATE TABLE IF NOT EXISTS audio_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  poster_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'その他',
  audio_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER DEFAULT 0, -- seconds
  file_size BIGINT DEFAULT 0, -- bytes
  play_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  visibility visibility_type DEFAULT 'public',
  series_id UUID REFERENCES series(id) ON DELETE SET NULL,
  episode_number INTEGER,
  language TEXT DEFAULT 'ja',
  age_restricted BOOLEAN DEFAULT FALSE,
  is_premium_only BOOLEAN DEFAULT FALSE,
  is_hall_of_fame BOOLEAN DEFAULT FALSE,
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- ==================== PLAYS ====================
CREATE TABLE IF NOT EXISTS plays (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  audio_id UUID REFERENCES audio_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  played_at TIMESTAMPTZ DEFAULT NOW(),
  duration_played INTEGER DEFAULT 0 -- seconds
);

-- ==================== LIKES ====================
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  audio_id UUID REFERENCES audio_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(audio_id, user_id)
);

-- ==================== COMMENTS ====================
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  audio_id UUID REFERENCES audio_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  like_count INTEGER DEFAULT 0,
  is_edited BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== COMMENT REACTIONS ====================
CREATE TABLE IF NOT EXISTS comment_reactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reaction_type TEXT NOT NULL,
  UNIQUE(comment_id, user_id)
);

-- ==================== FOLLOWS ====================
CREATE TABLE IF NOT EXISTS follows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- ==================== PLAYLISTS ====================
CREATE TABLE IF NOT EXISTS playlists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  audio_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== COINS ====================
CREATE TABLE IF NOT EXISTS coins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  balance INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== COIN TRANSACTIONS ====================
CREATE TYPE coin_transaction_type AS ENUM ('tip', 'purchase', 'refund', 'bonus');

CREATE TABLE IF NOT EXISTS coin_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  from_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  to_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  type coin_transaction_type NOT NULL,
  message TEXT,
  audio_id UUID REFERENCES audio_posts(id) ON DELETE SET NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== NOTIFICATIONS ====================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== REPORTS ====================
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('audio', 'comment', 'user')),
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== COMMUNITY POSTS ====================
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  content TEXT NOT NULL,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== SUBSCRIPTIONS ====================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  current_period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== FAVORITES ====================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  audio_id UUID REFERENCES audio_posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, audio_id)
);

-- ==================== INDEXES ====================
CREATE INDEX IF NOT EXISTS idx_audio_posts_poster_id ON audio_posts(poster_id);
CREATE INDEX IF NOT EXISTS idx_audio_posts_category ON audio_posts(category);
CREATE INDEX IF NOT EXISTS idx_audio_posts_published_at ON audio_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_audio_posts_play_count ON audio_posts(play_count DESC);
CREATE INDEX IF NOT EXISTS idx_plays_audio_id ON plays(audio_id);
CREATE INDEX IF NOT EXISTS idx_plays_user_id ON plays(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_audio_id ON likes(audio_id);
CREATE INDEX IF NOT EXISTS idx_comments_audio_id ON comments(audio_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);

-- ==================== RLS POLICIES ====================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE plays ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE coins ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Profiles: public read, own write
CREATE POLICY "profiles_public_read" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_own_write" ON profiles FOR ALL USING (auth.uid() = id);

-- Audio posts: public read for public posts, own write
CREATE POLICY "audio_public_read" ON audio_posts FOR SELECT
  USING (visibility = 'public' AND deleted_at IS NULL);
CREATE POLICY "audio_own_all" ON audio_posts FOR ALL USING (auth.uid() = poster_id);

-- Likes: public read, auth write
CREATE POLICY "likes_public_read" ON likes FOR SELECT USING (true);
CREATE POLICY "likes_auth_write" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "likes_own_delete" ON likes FOR DELETE USING (auth.uid() = user_id);

-- Comments: public read, auth write
CREATE POLICY "comments_public_read" ON comments FOR SELECT USING (true);
CREATE POLICY "comments_auth_insert" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_own_update" ON comments FOR UPDATE USING (auth.uid() = user_id);

-- Follows: public read, auth write
CREATE POLICY "follows_public_read" ON follows FOR SELECT USING (true);
CREATE POLICY "follows_auth_write" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "follows_own_delete" ON follows FOR DELETE USING (auth.uid() = follower_id);

-- Notifications: own only
CREATE POLICY "notifications_own" ON notifications FOR ALL USING (auth.uid() = user_id);

-- Favorites: own only
CREATE POLICY "favorites_own" ON favorites FOR ALL USING (auth.uid() = user_id);

-- Community posts: public read, auth write
CREATE POLICY "community_public_read" ON community_posts FOR SELECT USING (true);
CREATE POLICY "community_auth_insert" ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==================== FUNCTIONS ====================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  INSERT INTO public.coins (user_id, balance) VALUES (NEW.id, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update play count
CREATE OR REPLACE FUNCTION increment_play_count(audio_uuid UUID)
RETURNS void AS $$
  UPDATE audio_posts SET play_count = play_count + 1 WHERE id = audio_uuid;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update like count
CREATE OR REPLACE FUNCTION increment_like_count(audio_uuid UUID)
RETURNS void AS $$
  UPDATE audio_posts SET like_count = like_count + 1 WHERE id = audio_uuid;
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_like_count(audio_uuid UUID)
RETURNS void AS $$
  UPDATE audio_posts SET like_count = GREATEST(0, like_count - 1) WHERE id = audio_uuid;
$$ LANGUAGE sql SECURITY DEFINER;
