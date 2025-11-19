# Complete Supabase Setup Guide for TravelStay

This guide will walk you through setting up the complete Supabase backend for the TravelStay app.

## Prerequisites

1. A Supabase account (free tier works fine)
2. The Supabase credentials already added to Replit Secrets:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Step 1: Create Database Tables

Go to your Supabase project → SQL Editor and execute the SQL from `DATABASE_SCHEMA.md`.

This will create all required tables:
- `users` - User authentication data
- `user_profiles` - Extended user information
- `wedding_events` - Wedding/event planning data
- `properties` - Hotel and apartment listings
- `property_photos` - Property images
- `amenities` - Property features
- `favorites` - User's saved properties
- `reviews` - Property reviews
- `posts` - Social feed posts
- `wallet_accounts` - User wallet/balance
- `wallet_transactions` - Transaction history
- `service_categories` - Service offerings

## Step 2: Set Up Row Level Security (RLS)

Execute all RLS policies from `DATABASE_RLS_POLICIES.md` to secure your data:

1. Public read access for properties, reviews, posts
2. User-scoped access for favorites, wallet, profiles
3. Atomic wallet transaction function

This is **CRITICAL** - without RLS, the app will fail with 401 errors.

## Step 3: Configure Google OAuth

Follow the guide in `GOOGLE_AUTH_SETUP.md` to enable Google Sign-In:

1. Enable Google provider in Supabase
2. Get Google OAuth credentials
3. Configure redirect URIs
4. Test authentication flow

## Step 4: Seed Initial Data (Optional)

For testing, you can add sample properties:

```sql
-- Insert sample hotel
INSERT INTO properties (title, type, location, price_per_night, description, rating)
VALUES (
  'Luxury Beach Resort',
  'Hotel',
  'Maldives',
  450.00,
  'Beautiful beachfront resort with stunning ocean views',
  4.8
);

-- Get the property ID
SELECT id FROM properties WHERE title = 'Luxury Beach Resort';

-- Add photos (replace UUID with actual property ID)
INSERT INTO property_photos (property_id, url, category, order_index)
VALUES
  ('YOUR_PROPERTY_ID', 'https://images.unsplash.com/photo-1566073771259-6a8506099945', 'Main', 0),
  ('YOUR_PROPERTY_ID', 'https://images.unsplash.com/photo-1582719508461-905c673771fd', 'Bedroom', 1);

-- Add amenities
INSERT INTO amenities (property_id, name, icon)
VALUES
  ('YOUR_PROPERTY_ID', 'WiFi', 'wifi'),
  ('YOUR_PROPERTY_ID', 'Pool', 'droplet'),
  ('YOUR_PROPERTY_ID', 'Restaurant', 'coffee');
```

## Step 5: Test the Integration

1. Restart the Expo app
2. Sign in with Google
3. Try favoriting a property
4. Check if data persists in Supabase

## Current State

The app includes fallback behavior:
- **Without Supabase**: Uses static demo data
- **With Supabase**: Fetches live data and persists changes

All CRUD services are implemented and ready:

### ✅ Implemented Services

1. **Authentication** (`services/authService.js`)
   - Google OAuth with expo-auth-session
   - Session persistence with AsyncStorage
   - Auto-refresh tokens

2. **Favorites** (`services/favoritesService.js`)
   - Add/remove favorites
   - Fetch user favorites with property details
   - Toggle favorite status with optimistic updates

3. **Properties** (`services/propertiesService.js`)
   - Fetch all properties with filters
   - Search properties by title/location
   - Get property details with photos/amenities
   - Featured properties

4. **User Profile** (`services/userService.js`)
   - Get/update user profile
   - Extended profile data (DOB, gender, mobile, etc.)

5. **Wallet** (`services/walletService.js`)
   - Get wallet balance
   - Add transactions (atomic with RPC function)
   - Transaction history

6. **Reviews** (`services/reviewsService.js`)
   - Create/update/delete reviews
   - Automatic property rating updates
   - User review history

7. **Posts** (`services/postsService.js`)
   - Create/update/delete posts
   - Social feed with user info
   - Like functionality

8. **Wedding Events** (`services/weddingService.js`)
   - Couple details (Christine & Duncan)
   - Event date and location
   - Update wedding information

### 🔄 Integrated Pages

- **Discover** - Fetches properties from Supabase, falls back to static data
- **Saved** - Fetches user favorites from Supabase
- **Login** - Google OAuth authentication

### 📝 TODO: Pages to Integrate

- **EditProfile** - Wire up userService for saving changes
- **Wallet** - Wire up walletService for transactions
- **Details** - Add review functionality
- **Social** - Wire up postsService

## Troubleshooting

### 401 Unauthorized Errors
- RLS policies not configured correctly
- User not authenticated
- Check Supabase logs for policy violations

### Data Not Persisting
- Check network tab for failed requests
- Verify Supabase credentials in Replit Secrets
- Ensure RLS policies allow the operation

### Google Sign-In Not Working
- Follow `GOOGLE_AUTH_SETUP.md` completely
- Verify redirect URIs match exactly
- Check Google Cloud Console credentials

## Architecture

```
App.js
  └─ AuthProvider (manages auth state)
      └─ Navigation
          └─ Pages
              └─ Services (CRUD operations)
                  └─ Supabase Client

Static Data Fallback:
  All pages gracefully fall back to static data
  when Supabase calls fail or user is not authenticated
```

## Next Steps

1. Complete RLS setup in Supabase
2. Configure Google OAuth
3. Test all CRUD operations
4. Wire up remaining pages
5. Add loading states and error handling
6. Test on physical device via Expo Go
