-- ===============================
-- 1. Users Table
-- ===============================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ===============================
-- 2. Posts Table (Public Read)
-- ===============================
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read posts
CREATE POLICY "Posts are viewable by everyone" ON posts
  FOR SELECT USING (true);

-- Users can insert their own posts
CREATE POLICY "Users can insert own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own posts
CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);

-- ===============================
-- 3. Posts Photos Table (Public Read)
-- ===============================
ALTER TABLE posts_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Post photos are viewable by everyone" ON posts_photos
  FOR SELECT USING (true);

-- ===============================
-- 4. Cities Table (Public Read)
-- ===============================
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cities are viewable by everyone" ON cities
  FOR SELECT USING (true);

-- ===============================
-- 5. Favorites Table
-- ===============================
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- ===============================
-- 6. Reviews Table
-- ===============================
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

-- Users can insert their own reviews
CREATE POLICY "Users can insert own reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- ===============================
-- 7. Wallet Accounts Table
-- ===============================
ALTER TABLE wallet_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallet" ON wallet_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wallet" ON wallet_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet" ON wallet_accounts
  FOR UPDATE USING (auth.uid() = user_id);

-- ===============================
-- 8. Wallet Transactions Table
-- ===============================
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "Users can update own transactions" ON wallet_transactions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM wallet_accounts
      WHERE wallet_accounts.id = wallet_transactions.wallet_id
      AND wallet_accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own transactions" ON wallet_transactions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM wallet_accounts
      WHERE wallet_accounts.id = wallet_transactions.wallet_id
      AND wallet_accounts.user_id = auth.uid()
    )
  );

-- ===============================
-- 9. Service Categories Table (Public Read)
-- ===============================
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service categories are viewable by everyone" ON service_categories
  FOR SELECT USING (true);
