# 📦 Ejar Database Setup Instructions

Complete guide to setting up your Supabase database for the Ejar marketplace app.

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create All Tables

1. Go to **Supabase Dashboard** → https://supabase.com/dashboard
2. Select your **Ejar project**
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. **Copy and paste** the entire content of `DATABASE_SETUP_CLEAN.sql`
6. Click **RUN** (or press Cmd/Ctrl + Enter)

✅ This creates:
- 14 tables (users, posts, wallet, properties, etc.)
- All indexes for performance
- Row Level Security (RLS) policies
- Database triggers and functions

### Step 2: Add Dummy Data (Optional)

1. Still in **SQL Editor**, click **New Query**
2. **Copy and paste** the entire content of `SEED_DATA.sql`
3. Click **RUN**

✅ This adds 10 sample records to each table:
- 10 users
- 10 posts (phones, laptops, cars, property)
- 10 wallet accounts
- 10 saved posts
- 10 reviews
- 10 wallet transactions
- 10 balance requests
- 10 payment requests

---

## 📋 Complete Table List

### User Management
- `users` - User authentication and profiles
- `user_profiles` - Extended user information

### Marketplace
- `posts` - Marketplace listings (phones, laptops, cars, property)
- `saved_posts` - User's saved/favorited posts
- `property_reviews` - Reviews for marketplace posts

### Properties (Legacy)
- `properties` - Hotel/apartment listings
- `property_photos` - Property images
- `amenities` - Property features
- `favorites` - User's saved properties
- `reviews` - Property reviews

### Wallet System
- `wallet_accounts` - User wallet balances
- `wallet_transactions` - Transaction history
- `balance_requests` - Balance top-up requests (with proof image)

### Payments
- `payment_requests` - Member-only payment approval system

---

## 🔒 Security Features

All tables have **Row Level Security (RLS)** enabled:

✅ **Public Read**: Posts, properties, reviews (anyone can view)  
✅ **User-Specific Write**: Users can only edit their own data  
✅ **Member-Only Access**: Payment requests require member authentication  
✅ **Automatic Functions**: Property ratings update automatically

---

## ✅ Verification

After running both scripts, verify the setup:

```sql
-- Check table counts
SELECT 'Users' as table_name, COUNT(*) as records FROM users
UNION ALL
SELECT 'Posts', COUNT(*) FROM posts
UNION ALL
SELECT 'Wallet Accounts', COUNT(*) FROM wallet_accounts
UNION ALL
SELECT 'Payment Requests', COUNT(*) FROM payment_requests;
```

Expected results (if you added dummy data):
- Users: 10
- Posts: 10
- Wallet Accounts: 10
- Payment Requests: 10

---

## 🛠 Troubleshooting

### ❌ "Duplicate key value" error
**Solution:** Table already has data. This is normal with `ON CONFLICT DO NOTHING`.

### ❌ "Permission denied" error
**Solution:** Make sure you're logged in as the project owner in Supabase.

### ❌ "Relation does not exist" error
**Solution:** Run `DATABASE_SETUP_CLEAN.sql` first before `SEED_DATA.sql`.

### ❌ RLS policy errors in app
**Solution:** Make sure you completed Step 1 (DATABASE_SETUP_CLEAN.sql) which includes RLS policies.

---

## 📚 Additional Documentation

- **DATABASE_SCHEMA.md** - Detailed schema documentation
- **DATABASE_MIGRATIONS.sql** - Migration scripts for updates
- **DATABASE_RLS_POLICIES.md** - Security policy documentation
- **SEED_DATA.sql** - Dummy data for testing

---

## 🎯 Summary

**To set up the database:**
1. Run `DATABASE_SETUP_CLEAN.sql` in Supabase SQL Editor
2. Run `SEED_DATA.sql` for test data (optional)
3. Verify with the verification query above
4. Start using the Ejar app!

**Total time:** ~5 minutes  
**Result:** Fully functional database with sample data ready for testing! 🎉
