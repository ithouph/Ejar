# Ejar App - Supabase Database Schema

Complete database schema for the Ejar marketplace app.

---

## Table Overview

### User Management
- `users` - User authentication and basic info
- `user_profiles` - Extended user profile information

### Marketplace
- `posts` - Marketplace listings (phones, laptops, cars, property)
- `saved_posts` - User's saved/favorited posts
- `property_reviews` - Reviews for marketplace posts

### Properties (Legacy)
- `properties` - Hotel/apartment listings
- `property_photos` - Property image gallery
- `amenities` - Property features/amenities
- `favorites` - User's saved properties
- `reviews` - Property reviews

### Wallet & Payments
- `wallet_accounts` - User wallet balances
- `wallet_transactions` - Transaction history
- `balance_requests` - Balance top-up requests
- `payment_requests` - Member payment approvals

---

## Detailed Schema

### 1. users
User authentication and basic information

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  google_id TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Columns:**
- `id` - Unique user identifier (UUID)
- `email` - User email address (unique, required)
- `google_id` - Google OAuth ID (unique)
- `full_name` - User's full name
- `avatar_url` - Profile picture URL
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

---

### 2. user_profiles
Extended user profile information

```sql
CREATE TABLE user_profiles (
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
```

**Columns:**
- `user_id` - References `users.id` (unique, cascading delete)
- `date_of_birth` - User's birth date
- `gender` - User's gender
- `mobile` - Phone number
- `weight` - User weight (optional)
- `height` - User height (optional)

---

### 3. posts
Social marketplace posts (all categories)

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  images JSONB DEFAULT '[]'::JSONB,
  image_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('phones', 'laptops', 'electronics', 'cars', 'property')),
  property_type TEXT,
  listing_type TEXT,
  price NUMERIC,
  location TEXT,
  amenities JSONB DEFAULT '[]'::JSONB,
  specifications JSONB DEFAULT '{}'::JSONB,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Core Columns:**
- `user_id` - Post creator (references users)
- `title` - Post title (required)
- `description` - Short description
- `content` - Full post content
- `images` - Array of image URLs (JSONB)
- `category` - Post category (phones, laptops, electronics, cars, property)
- `price` - Item price
- `location` - Item location

**Property-Specific Columns:**
- `property_type` - house, apartment, villa, land (for property category)
- `listing_type` - rent or sell (for property category)
- `amenities` - Main amenities (JSONB array: wifi, parking, ac, kitchen)
- `specifications` - Category-specific details (JSONB object)

**Category-Specific Specifications:**

#### Phones
```json
{
  "brand": "Apple",
  "model": "iPhone 14 Pro",
  "storage": "256GB",
  "color": "Space Black",
  "condition": "Excellent"
}
```

#### Laptops
```json
{
  "brand": "Apple",
  "model": "MacBook Pro 16-inch",
  "processor": "M2 Max",
  "ram": "32GB",
  "storage": "1TB SSD",
  "condition": "Excellent"
}
```

#### Electronics
```json
{
  "brand": "Sony",
  "size": "65 inches",
  "type": "4K Smart TV",
  "condition": "New",
  "warranty": "2 years"
}
```

#### Cars
```json
{
  "make": "Toyota",
  "model": "Camry",
  "year": 2020,
  "mileage": 45000,
  "fuel_type": "Petrol",
  "gear_type": "Automatic",
  "condition": "Excellent"
}
```

#### Property (Rent House/Apartment)
```json
{
  "bedrooms": 3,
  "bathrooms": 2,
  "size_sqft": 1200,
  "floor": 5,
  "nearby_amenities": ["mosque", "laundry", "gym"]
}
```

#### Property (Land)
```json
{
  "land_size": "500 sqm",
  "location_type": "residential",
  "utilities_available": true
}
```

---

### 4. saved_posts
User's saved/favorited marketplace posts

```sql
CREATE TABLE saved_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);
```

**Columns:**
- `user_id` - User who saved the post
- `post_id` - The saved post
- Unique constraint prevents duplicate saves

---

### 5. property_reviews
Reviews for marketplace posts

```sql
CREATE TABLE property_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Columns:**
- `post_id` - The post being reviewed
- `user_id` - Reviewer
- `rating` - 1-5 star rating (required)
- `review_text` - Review text

---

### 6. properties
Hotel and apartment listings (legacy)

```sql
CREATE TABLE properties (
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
```

---

### 7. wallet_accounts
User wallet balances

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

**Columns:**
- `user_id` - Wallet owner (unique)
- `balance` - Current balance
- `currency` - Currency code (default: USD)

---

### 8. wallet_transactions
Transaction history

```sql
CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT,
  category TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Columns:**
- `user_id` - Transaction owner
- `transaction_type` - 'deposit' or 'debit'
- `amount` - Transaction amount
- `description` - Transaction description
- `category` - Transaction category (deposit, payment, etc.)
- `status` - Transaction status (default: completed)

---

### 9. balance_requests
Balance top-up requests

```sql
CREATE TABLE balance_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  proof_image_url TEXT,
  admin_notes TEXT,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Columns:**
- `user_id` - User requesting balance top-up
- `amount` - Requested amount
- `status` - pending, approved, or rejected
- `proof_image_url` - Payment proof image
- `admin_notes` - Admin review notes
- `reviewed_by` - Admin who reviewed
- `reviewed_at` - Review timestamp

---

### 10. payment_requests
Member payment approval system

```sql
CREATE TABLE payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT,
  requester_name TEXT,
  requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Columns:**
- `member_id` - Member who approves/rejects (required)
- `amount` - Payment amount
- `description` - Payment description
- `requester_name` - Name of requester
- `requester_id` - User who created request
- `status` - pending, approved, or rejected
- `approved_at` - Approval timestamp

---

## Indexes

Performance indexes on key columns:

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_saved_posts_user_id ON saved_posts(user_id);
CREATE INDEX idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX idx_payment_requests_member_id ON payment_requests(member_id);
```

---

## Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

### Public Read
- `posts` - Anyone can view
- `properties` - Anyone can view
- `property_reviews` - Anyone can view

### User-Specific Access
- `wallet_accounts` - Users can only access their own wallet
- `wallet_transactions` - Users see only their transactions
- `saved_posts` - Users manage only their saved posts
- `balance_requests` - Users manage only their requests

### Member-Only Access
- `payment_requests` - Members can only see requests assigned to them

---

## Setup Instructions

1. Run `DATABASE_SETUP_CLEAN.sql` in Supabase SQL Editor
2. Run `SEED_DATA.sql` for dummy data (optional)
3. Verify with verification queries

See [DATABASE_SETUP_INSTRUCTIONS.md](DATABASE_SETUP_INSTRUCTIONS.md) for detailed setup guide.
