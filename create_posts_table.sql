-- =====================================================
-- CREATE POSTS TABLE FOR TRAVELSTAY APP
-- =====================================================
-- Execute this in Supabase SQL Editor
-- =====================================================

-- Create the posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT,
  description TEXT,
  content TEXT,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  image_url TEXT,
  property_type TEXT,
  price NUMERIC,
  location TEXT,
  amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
  specifications JSONB DEFAULT '{}'::JSONB,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can read all posts
CREATE POLICY "Posts are viewable by everyone" ON posts
  FOR SELECT USING (true);

-- RLS Policy: Authenticated users can create their own posts
-- The user_id field will automatically match the logged-in user
CREATE POLICY "Users can insert own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own posts only
CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policy: Users can delete their own posts only
CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- HOW USER_ID WORKS
-- =====================================================
-- 
-- When a user creates a post in the app:
-- 1. The app gets the logged-in user's ID from Supabase Auth
-- 2. The app sends that user_id along with the post data
-- 3. Supabase checks: Does auth.uid() match the user_id being sent?
-- 4. If yes, the post is created. If no, it's rejected.
--
-- Example in your app code (postsService.js):
--
-- const postData = {
--   user_id: user.id,           // <-- This is the logged-in user's ID
--   title: "Beautiful Apartment",
--   description: "Nice place to stay",
--   images: ["url1", "url2"],
--   property_type: "apartment",
--   price: 150,
--   location: "New York",
--   amenities: ["wifi", "parking", "pool"]
-- };
--
-- await supabase.from('posts').insert(postData);
--
-- The RLS policy ensures user_id matches the authenticated user!
-- =====================================================

-- =====================================================
-- EXAMPLE: Insert a test post (after you're logged in)
-- =====================================================
-- 
-- INSERT INTO posts (
--   user_id,
--   title,
--   description,
--   images,
--   property_type,
--   price,
--   location,
--   amenities
-- ) VALUES (
--   auth.uid(),  -- Automatically uses your logged-in user ID
--   'Beautiful 2BR Apartment',
--   'Spacious apartment in downtown with amazing views',
--   ARRAY['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
--   'apartment',
--   150.00,
--   'New York, NY',
--   ARRAY['wifi', 'parking', 'pool', 'gym']
-- );
-- =====================================================

-- Success! The posts table is ready.
-- Your app will now save posts to Supabase instead of local storage.
