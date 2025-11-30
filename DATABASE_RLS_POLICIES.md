# Row Level Security (RLS) Policies for Ejar

**IMPORTANT**: These RLS policies must be configured in Supabase for the app to work correctly with authenticated users.

## What is RLS?

Row Level Security controls which database rows each user can access:
- Without RLS: Any user can see/edit ANY data
- With RLS: Users can ONLY see/edit their OWN data (or public data)

## Required RLS Policies

### 1. Users Table
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Allow inserts for new users (authentication flow)
CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### 2. Posts Table (Public Read)
```sql
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
```

### 3. Posts Photos Table (Public Read)
```sql
ALTER TABLE posts_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Post photos are viewable by everyone" ON posts_photos
  FOR SELECT USING (true);
```

### 4. Cities Table (Public Read)
```sql
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cities are viewable by everyone" ON cities
  FOR SELECT USING (true);
```

### 5. Saved Posts Table
```sql
ALTER TABLE saved_posts ENABLE ROW LEVEL SECURITY;

-- Users can view their own saved posts
CREATE POLICY "Users can view own saved posts" ON saved_posts
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own saved posts
CREATE POLICY "Users can insert own saved posts" ON saved_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own saved posts
CREATE POLICY "Users can delete own saved posts" ON saved_posts
  FOR DELETE USING (auth.uid() = user_id);
```

### 6. Reviews Table
```sql
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
```

### 7. Wallet Accounts Table
```sql
ALTER TABLE wallet_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallet" ON wallet_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wallet" ON wallet_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet" ON wallet_accounts
  FOR UPDATE USING (auth.uid() = user_id);
```

### 8. Wallet Transactions Table
```sql
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
```

### 9. Payment Requests Table
```sql
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payment requests" ON payment_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment requests" ON payment_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 10. Support Messages Table
```sql
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own support messages" ON support_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own support messages" ON support_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 11. Service Categories (Public Read)
```sql
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service categories are viewable by everyone" ON service_categories
  FOR SELECT USING (true);
```

## Setup Instructions

1. Go to Supabase SQL Editor
2. Copy and paste the contents of `DATABASE_RLS_POLICIES.sql`
3. Execute the script
4. Verify RLS is enabled:
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public';
   ```

## Summary of Policies

| Table | Public Read | User-Scoped |
|-------|------------|-------------|
| users | ❌ | ✅ |
| posts | ✅ | ✅ (own posts only) |
| posts_photos | ✅ | ❌ |
| cities | ✅ | ❌ |
| saved_posts | ❌ | ✅ |
| reviews | ✅ | ✅ (own reviews only) |
| wallet_accounts | ❌ | ✅ |
| wallet_transactions | ❌ | ✅ |
| payment_requests | ❌ | ✅ |
| support_messages | ❌ | ✅ |
| service_categories | ✅ | ❌ |

## Important Notes

- **Public Tables**: Posts, reviews, cities, post_photos, and service_categories are readable by everyone
- **User-Scoped Tables**: Wallet, transactions, payment requests, and support messages are strictly user-scoped
- **Security**: All policies use `auth.uid()` to ensure users can only access/modify their own data
- **RLS Optional**: For development/testing, you can skip RLS. For production, RLS is recommended.
