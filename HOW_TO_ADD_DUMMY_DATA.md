# 📊 How to Add Dummy Data to Ejar Database

## Quick Method (5 minutes) - Supabase Dashboard

### Step 1: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your **Ejar project**
3. Click **SQL Editor** in the left sidebar
4. Click **New query**

### Step 2: Copy & Paste SQL

1. Open the file `SEED_DATA.sql` in this project
2. **Copy all the content**
3. **Paste** into the Supabase SQL Editor
4. Click **RUN** button (or press Cmd/Ctrl + Enter)

### Step 3: Verify

The script will add:
- ✅ **10 users** (Ahmed, Fatima, Ibrahim, etc.)
- ✅ **10 marketplace posts** (phones, laptops, property, cars)
- ✅ **10 wallet accounts** with balances
- ✅ **10 saved posts**
- ✅ **10 reviews**
- ✅ **10 wallet transactions**
- ✅ **10 balance requests**
- ✅ **10 payment requests**
- ✅ **Verification queries** (automatically run at the end)

You should see:
```
Users: 10
Posts: 10
Wallet Accounts: 10
Saved Posts: 10
Property Reviews: 10
Wallet Transactions: 10
Balance Requests: 10
Payment Requests: 10
```

---

## What Gets Added:

### 👥 Users (10 accounts):
- Ahmed Hassan, Fatima Mohamed, Ibrahim Ali, Mariam Abdullah
- Omar Salem, Aisha Mohammed, Hassan Omar, Khadija Ahmed
- Youssef Ibrahim, Zainab Hassan

### 📱 Marketplace Posts (10 posts):
1. **iPhone 14 Pro** - Phones category (450,000 MRU)
2. **MacBook Pro 2023** - Laptops category (1,200,000 MRU)
3. **Sony 65" 4K Smart TV** - Electronics (550,000 MRU)
4. **Toyota Camry 2020** - Cars (2,500,000 MRU)
5. **Modern 3BR Apartment** - Property Rent (80,000 MRU/month)
6. **Beautiful Family House** - Property Sell (3,500,000 MRU)
7. **Cozy 2BR House** - Property Rent (60,000 MRU/month)
8. **Prime Land 500 sqm** - Property Sell (1,500,000 MRU)
9. **Samsung Galaxy S23 Ultra** - Phones (500,000 MRU)
10. **Luxury Villa** - Property Rent (150,000 MRU/month)

### 💰 Wallet Features:
- All users have wallet accounts with balances
- Transaction history (deposits, payments)
- Balance top-up requests (some approved, some pending)
- Payment requests system (member approvals)

---

## What the Dummy Data Includes:

All dummy data is created with **deterministic UUIDs** for reproducibility.

### Sample User Data
- **Email addresses**: ahmed.hassan@email.com, fatima.mohamed@email.com, etc.
- **Profile pictures**: From Unsplash (sample avatars)
- **Wallet balances**: Range from 30,000 to 200,000 MRU

### Sample Marketplace Posts
- **Phones**: iPhone 14 Pro, Samsung Galaxy S23 Ultra
- **Laptops**: MacBook Pro 2023
- **Electronics**: Sony 65" 4K Smart TV
- **Cars**: Toyota Camry 2020
- **Property**: Apartments, houses, land (rent/sell)

### Sample Transactions
- **Wallet transactions**: Deposits and payments
- **Balance requests**: Mix of approved, pending, rejected
- **Payment requests**: Member approval workflow examples

---

## Testing with Real Users

After adding dummy data, you can test with:

### Option 1: Google OAuth (Recommended)
1. Set up Google OAuth ([GOOGLE_AUTH_SETUP.md](GOOGLE_AUTH_SETUP.md))
2. Sign in with your Google account
3. Create your own posts, reviews, and transactions

### Option 2: Use Dummy Data
1. Browse the 10 sample posts
2. View wallet balances and transactions
3. See payment request examples
4. Test the marketplace filtering

**Note:** To create new data (posts, reviews), you need Google OAuth authentication.

---

## Troubleshooting:

### ❌ "Duplicate key value" error
**Solution:** Data already exists. This is normal - the script uses `BEGIN/COMMIT` transaction.

### ❌ "Permission denied" error
**Solution:** Make sure you're logged into Supabase as the project owner with admin access.

### ❌ "Relation does not exist" error
**Solution:** Tables aren't created yet. Run `DATABASE_SETUP_CLEAN.sql` first.

### ❌ Column name mismatch error
**Solution:** Make sure you ran the latest `DATABASE_SETUP_CLEAN.sql` which has the correct schema.

---

## Summary:

**To add dummy data:**
1. Run `DATABASE_SETUP_CLEAN.sql` first (creates all tables)
2. Run `SEED_DATA.sql` to add sample data
3. Verify with the verification queries
4. Done! ✅

**Result:**
- 10 users with profiles and avatars
- 10 marketplace posts (phones, laptops, cars, property)
- 10 wallet accounts with balances
- 10 saved posts
- 10 reviews
- 10 wallet transactions
- 10 balance requests (approved/pending/rejected)
- 10 payment requests (pending/approved/rejected)

---

## After Adding Data:

### Test the App:
1. Restart the Expo app
2. Sign in with Google OAuth
3. Browse **Discover** tab → See 10 marketplace posts ✅
4. Filter by category (phones, laptops, cars, property) ✅
5. Check wallet → See balance and transactions ✅
6. View payment requests → See member approvals ✅

The app is now populated with realistic data! 🎉
