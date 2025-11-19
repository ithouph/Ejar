-- =====================================================
-- TravelStay App - Complete Supabase Database Schema
-- =====================================================
-- Execute this entire file in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. CREATE TABLES
-- =====================================================

-- Users table (core authentication)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  google_id TEXT UNIQUE,
  full_name TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles (extended info)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  date_of_birth DATE,
  gender TEXT,
  mobile TEXT,
  weight NUMERIC,
  height NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wedding/event planning
CREATE TABLE IF NOT EXISTS wedding_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  partner1_name TEXT DEFAULT 'Christine',
  partner2_name TEXT DEFAULT 'Duncan',
  event_date DATE,
  location TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Properties (hotels & apartments)
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  location TEXT NOT NULL,
  address TEXT,
  description TEXT,
  price_per_night NUMERIC NOT NULL,
  rating NUMERIC DEFAULT 0,
  total_reviews INT DEFAULT 0,
  bedrooms INT,
  bathrooms INT,
  area_sqft NUMERIC,
  agent_name TEXT,
  agent_photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Property photos
CREATE TABLE IF NOT EXISTS property_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  category TEXT DEFAULT 'Main',
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Property amenities
CREATE TABLE IF NOT EXISTS amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User favorites
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- Property reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Social posts (with images array, amenities, property details)
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT,
  description TEXT,
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

-- Wallet accounts
CREATE TABLE IF NOT EXISTS wallet_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  balance NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wallet transactions
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID REFERENCES wallet_accounts(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT,
  category TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment requests (for balance addition via support)
CREATE TABLE IF NOT EXISTS payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Support chat messages
CREATE TABLE IF NOT EXISTS support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  payment_request_id UUID REFERENCES payment_requests(id) ON DELETE CASCADE,
  message TEXT,
  image_url TEXT,
  sender_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service categories
CREATE TABLE IF NOT EXISTS service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);
CREATE INDEX IF NOT EXISTS idx_property_photos_property_id ON property_photos(property_id);
CREATE INDEX IF NOT EXISTS idx_amenities_property_id ON amenities(property_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_property_id ON favorites(property_id);
CREATE INDEX IF NOT EXISTS idx_reviews_property_id ON reviews(property_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wallet_accounts_user_id ON wallet_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_user_id ON payment_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_payment_request_id ON support_messages(payment_request_id);

-- =====================================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. CREATE RLS POLICIES
-- =====================================================

-- Users policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- User profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Wedding events policies
CREATE POLICY "Users can view own events" ON wedding_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own events" ON wedding_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events" ON wedding_events
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own events" ON wedding_events
  FOR DELETE USING (auth.uid() = user_id);

-- Properties policies (public read)
CREATE POLICY "Properties are viewable by everyone" ON properties
  FOR SELECT USING (true);

-- Property photos policies (public read)
CREATE POLICY "Property photos are viewable by everyone" ON property_photos
  FOR SELECT USING (true);

-- Amenities policies (public read)
CREATE POLICY "Amenities are viewable by everyone" ON amenities
  FOR SELECT USING (true);

-- Favorites policies
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Posts policies
CREATE POLICY "Posts are viewable by everyone" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);

-- Wallet accounts policies
CREATE POLICY "Users can view own wallet" ON wallet_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wallet" ON wallet_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet" ON wallet_accounts
  FOR UPDATE USING (auth.uid() = user_id);

-- Wallet transactions policies
CREATE POLICY "Users can view own transactions" ON wallet_transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM wallet_accounts
      WHERE wallet_accounts.id = wallet_transactions.wallet_id
      AND wallet_accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own transactions" ON wallet_transactions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM wallet_accounts
      WHERE wallet_accounts.id = wallet_transactions.wallet_id
      AND wallet_accounts.user_id = auth.uid()
    )
  );

-- Payment requests policies
CREATE POLICY "Users can view own payment requests" ON payment_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment requests" ON payment_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment requests" ON payment_requests
  FOR UPDATE USING (auth.uid() = user_id);

-- Support messages policies
CREATE POLICY "Users can view own support messages" ON support_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own support messages" ON support_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Service categories policies (public read)
CREATE POLICY "Service categories are viewable by everyone" ON service_categories
  FOR SELECT USING (true);

-- =====================================================
-- 5. CREATE DATABASE FUNCTIONS
-- =====================================================

-- Function: Atomic wallet transaction
CREATE OR REPLACE FUNCTION add_wallet_transaction(
  p_wallet_id UUID,
  p_type TEXT,
  p_amount NUMERIC,
  p_description TEXT,
  p_category TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_transaction_id UUID;
  v_new_balance NUMERIC;
  v_user_id UUID;
BEGIN
  -- Verify user owns the wallet
  SELECT user_id INTO v_user_id
  FROM wallet_accounts
  WHERE id = p_wallet_id;

  IF v_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Start transaction
  BEGIN
    -- Insert transaction
    INSERT INTO wallet_transactions (wallet_id, type, amount, description, category, status)
    VALUES (p_wallet_id, p_type, p_amount, p_description, p_category, 'completed')
    RETURNING id INTO v_transaction_id;

    -- Update balance atomically
    UPDATE wallet_accounts
    SET balance = CASE
      WHEN p_type = 'credit' THEN balance + p_amount
      ELSE balance - p_amount
    END,
    updated_at = NOW()
    WHERE id = p_wallet_id
    RETURNING balance INTO v_new_balance;

    -- Return result
    RETURN json_build_object(
      'transaction_id', v_transaction_id,
      'new_balance', v_new_balance
    );
  EXCEPTION
    WHEN OTHERS THEN
      RAISE;
  END;
END;
$$;

-- Function: Update property rating when review changes
CREATE OR REPLACE FUNCTION update_property_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE properties
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE property_id = COALESCE(NEW.property_id, OLD.property_id)
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews
      WHERE property_id = COALESCE(NEW.property_id, OLD.property_id)
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.property_id, OLD.property_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- =====================================================
-- 6. CREATE TRIGGERS
-- =====================================================

-- Trigger: Auto-update property rating on review changes
DROP TRIGGER IF EXISTS trigger_update_property_rating ON reviews;
CREATE TRIGGER trigger_update_property_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_property_rating();

-- =====================================================
-- 7. INSERT SAMPLE DATA (OPTIONAL)
-- =====================================================

-- Insert service categories
INSERT INTO service_categories (name, icon, description, active) VALUES
  ('Flight', 'send', 'Book domestic and international flights', true),
  ('Hotel', 'home', 'Find and book hotels worldwide', true),
  ('Food', 'coffee', 'Restaurant reservations and food delivery', true),
  ('Taxi', 'navigation', 'Ride sharing and taxi services', true),
  ('Event', 'calendar', 'Event planning and management', true),
  ('Tour', 'map', 'Guided tours and experiences', true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================
-- Next steps:
-- 1. Configure Google OAuth in Supabase Authentication settings
-- 2. Add your Supabase URL and anon key to Replit Secrets
-- 3. Test the app with a real user account
-- =====================================================
