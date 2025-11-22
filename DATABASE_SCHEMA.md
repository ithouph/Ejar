# Ejar App - Supabase Database Schema

This document outlines the database tables needed for the Ejar MVP.

## Required Tables

### 1. users
Stores user authentication and basic info
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  google_id TEXT UNIQUE,
  full_name TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. user_profiles
Extended user profile information
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date_of_birth DATE,
  gender TEXT,
  mobile TEXT,
  whatsapp TEXT,
  weight NUMERIC,
  height NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. wedding_events
Couple details for wedding/event planning
```sql
CREATE TABLE wedding_events (
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
```

### 4. properties
Hotel and apartment listings
```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- 'Hotel' or 'Apartment'
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
```

### 5. property_photos
Property image gallery
```sql
CREATE TABLE property_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  category TEXT DEFAULT 'Main', -- 'Main', 'Bedroom', 'Kitchen', etc.
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6. amenities
Property amenities/features
```sql
CREATE TABLE amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT, -- Feather icon name
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 7. favorites
User's saved/favorited properties
```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);
```

### 8. reviews
Post reviews (users can review posts in the marketplace)
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 8b. property_reviews
Property reviews (separate from post reviews)
```sql
CREATE TABLE property_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 9. posts
Social posts/feed with marketplace functionality
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT,
  description TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  image_url TEXT,
  property_type TEXT,
  price NUMERIC,
  location TEXT,
  amenities JSONB DEFAULT '[]'::jsonb,
  specifications JSONB DEFAULT '{}'::jsonb, -- Category-specific features
  listing_type TEXT DEFAULT 'rent', -- 'rent' or 'sell'
  category TEXT, -- 'phones', 'laptops', 'electronics', 'cars', 'property'
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Category-Specific Specifications Structure:**

**Phones:**
```json
{
  "battery_health": "95%",
  "storage": "256GB",
  "condition": "Excellent",
  "model": "iPhone 14 Pro",
  "color": "Black"
}
```

**Laptops:**
```json
{
  "processor": "M2 Pro",
  "ram": "16GB",
  "storage": "512GB SSD",
  "condition": "Good",
  "model": "MacBook Pro 16"
}
```

**Electronics:**
```json
{
  "brand": "Sony",
  "condition": "Excellent",
  "warranty": "1 year"
}
```

**Cars:**
```json
{
  "make": "Toyota Camry",
  "model": "2.5L SE",
  "year": "2022",
  "mileage": "25,000 km",
  "gear_type": "Automatic",
  "fuel_type": "Petrol",
  "condition": "Excellent"
}
```

**Property (Rent):**
```json
{
  "bedrooms": "3",
  "bathrooms": "2",
  "size_sqft": "1500",
  "property_type": "apartment",
  "amenities": ["wifi", "parking", "pool"],
  "monthly_rent": "2500",
  "deposit": "5000",
  "min_contract_duration": "12 months",
  "furnished": "Yes"
}
```

**Property (Sell):**
```json
{
  "bedrooms": "4",
  "bathrooms": "3",
  "size_sqft": "2000",
  "property_type": "villa",
  "amenities": ["wifi", "parking", "gym"],
  "sale_price": "500000",
  "ownership_type": "Freehold",
  "property_age": "5 years",
  "payment_options": "Cash, Installments"
}
```

### 10. wallet_accounts
User wallet/balance
```sql
CREATE TABLE wallet_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  balance NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 11. wallet_transactions
Transaction history
```sql
CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID REFERENCES wallet_accounts(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'credit' or 'debit'
  amount NUMERIC NOT NULL,
  description TEXT,
  category TEXT, -- 'booking', 'refund', 'deposit', etc.
  status TEXT DEFAULT 'completed',
  balance_after NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 12. balance_requests
Balance top-up requests pending admin approval
```sql
CREATE TABLE balance_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  wallet_id UUID REFERENCES wallet_accounts(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  transaction_image_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  admin_notes TEXT,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 13. saved_posts
User's saved/favorited posts
```sql
CREATE TABLE saved_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);
```

### 14. service_categories
Service offerings
```sql
CREATE TABLE service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT, -- Feather icon name
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Setup Instructions

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the CREATE TABLE statements above
4. Execute them one by one
5. Enable Row Level Security (RLS) policies as needed

## Row Level Security (RLS) Example

```sql
-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

Repeat similar RLS policies for other tables based on your security requirements.
