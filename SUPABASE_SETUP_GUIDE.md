# Complete Supabase Setup Guide for Ejar

This guide will walk you through setting up the complete Supabase backend for the Ejar app.

## Prerequisites

1. A Supabase account (free tier works fine)
2. The Supabase credentials already added to Replit Secrets:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Step 1: Create Database Tables

Go to your Supabase project → SQL Editor and execute the SQL from `DATABASE_SETUP.sql`.

This will create all required tables:
- `cities` - Mauritanian cities
- `users` - User profiles with phone auth, role, wallet balance
- `posts` - Marketplace listings
- `post_images` - Post photos
- `saved_posts` - User favorites
- `reviews` - Post reviews
- `wallet_transactions` - Transaction history
- `member_reports` - Member activity tracking

## Step 2: Set Up Row Level Security (RLS)

The `DATABASE_SETUP.sql` includes RLS policies. Make sure they are enabled:

1. Public read access for cities, posts
2. User-scoped access for saved_posts, wallet, profiles
3. Member/Leader access for transaction approvals

This is **CRITICAL** - without RLS, the app will fail with 401 errors.

## Step 3: Configure Phone Auth

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable **Phone** provider
3. Configure SMS settings (Twilio or Supabase default)
4. Test with a real phone number

### Phone Auth Settings:
- SMS Provider: Choose Twilio or use Supabase default
- Country code: +222 (Mauritania)
- OTP expiry: 60 seconds (default)

## Step 4: Seed Initial Data

Run `SEED_DATA.sql` to add:
- All Mauritanian cities
- Sample posts for testing

## Step 5: Test the Integration

1. Restart the Expo app
2. Enter your phone number (+222...)
3. Verify with the OTP code
4. Complete your profile
5. Try creating posts and adding balance

## Current State

The app includes fallback behavior:
- **Without Supabase**: Uses guest mode with demo data
- **With Supabase**: Full phone auth and live data

All CRUD services are implemented in `services/database.js`:

### Implemented Services

1. **Authentication**
   - Phone OTP with Supabase
   - Session persistence with AsyncStorage
   - Guest mode for testing

2. **Users**
   - Profile management
   - City-based users
   - 4-tier role system (normal, member, ex_member, leader)

3. **Posts**
   - Create/update/delete posts
   - Categories: Property, Phones, Laptops, Electronics, Cars
   - City-based listings

4. **Wallet**
   - Balance management
   - Deposit requests with proof
   - City-based approval by members

5. **Saved Posts**
   - Add/remove favorites
   - Fetch user favorites

## Troubleshooting

### 401 Unauthorized Errors
- RLS policies not configured correctly
- User not authenticated
- Check Supabase logs for policy violations

### Phone OTP Not Working
- Enable Phone provider in Supabase
- Check SMS configuration
- Verify phone number format (+222...)

### Data Not Persisting
- Check network tab for failed requests
- Verify Supabase credentials in Replit Secrets
- Ensure RLS policies allow the operation

## Architecture

```
App.js
  └─ AuthProvider (manages auth state)
      └─ Navigation
          └─ Pages
              └─ services/database.js (all CRUD)
                  └─ Supabase Client
```

## Next Steps

1. Run DATABASE_SETUP.sql in Supabase
2. Enable Phone Auth
3. Test all CRUD operations
4. Test on physical device via Expo Go
