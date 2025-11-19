# Row Level Security (RLS) Policies for TravelStay

**IMPORTANT**: These RLS policies must be configured in Supabase for the app to work correctly with authenticated users.

## Required RLS Policies

### 1. Users Table
```sql
-- Enable RLS
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

### 2. User Profiles Table
```sql
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 3. Properties Table (Public Read)
```sql
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Anyone can read properties
CREATE POLICY "Properties are viewable by everyone" ON properties
  FOR SELECT USING (true);
```

### 4. Property Photos (Public Read)
```sql
ALTER TABLE property_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Property photos are viewable by everyone" ON property_photos
  FOR SELECT USING (true);
```

### 5. Amenities (Public Read)
```sql
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Amenities are viewable by everyone" ON amenities
  FOR SELECT USING (true);
```

### 6. Favorites Table
```sql
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Users can view their own favorites
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own favorites
CREATE POLICY "Users can insert own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);
```

### 7. Reviews Table
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

### 8. Posts Table
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

### 9. Wallet Accounts Table
```sql
ALTER TABLE wallet_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallet" ON wallet_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wallet" ON wallet_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet" ON wallet_accounts
  FOR UPDATE USING (auth.uid() = user_id);
```

### 10. Wallet Transactions Table
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
```

### 11. Wedding Events Table
```sql
ALTER TABLE wedding_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own events" ON wedding_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own events" ON wedding_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events" ON wedding_events
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own events" ON wedding_events
  FOR DELETE USING (auth.uid() = user_id);
```

### 12. Service Categories (Public Read)
```sql
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service categories are viewable by everyone" ON service_categories
  FOR SELECT USING (true);
```

## Required Database Functions

### Atomic Wallet Transaction Function
```sql
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
    END
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
```

## Setup Instructions

1. Go to Supabase SQL Editor
2. Copy and execute all RLS policies above
3. Copy and execute the database function
4. Verify RLS is enabled on all tables using:
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public';
   ```
5. Test with an authenticated user to ensure policies work correctly

## Important Notes

- **Public Tables**: Properties, property_photos, amenities, service_categories, reviews, and posts are readable by everyone (including unauthenticated users)
- **User-Scoped Tables**: Favorites, wallet, transactions, wedding_events, and profiles are strictly user-scoped
- **Atomic Operations**: Wallet transactions use a database function to ensure balance updates are atomic and prevent race conditions
- **Security**: All policies use `auth.uid()` to ensure users can only access/modify their own data
