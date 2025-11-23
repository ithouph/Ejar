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
- ✅ **10 new properties** (hotels & apartments)
- ✅ **30+ amenities** (Wi-Fi, Pool, Parking, etc.)
- ✅ **Verification queries** (automatically run at the end)

You should see:
```
total_properties: 12
total_amenities: 30+
```

---

## What Gets Added:

### 🏨 Properties (10 new):
1. **Beachfront Villa Paradise** - Bali, Indonesia ($350/night)
2. **Downtown Luxury Apartment** - Dubai, UAE ($280/night)
3. **Mountain Retreat Chalet** - Aspen, Colorado ($420/night)
4. **Historic City Center Hotel** - Paris, France ($195/night)
5. **Tropical Island Resort** - Maldives ($680/night)
6. **Urban Loft Studio** - New York, USA ($160/night)
7. **Santorini Cliffside Suite** - Santorini, Greece ($520/night)
8. **Safari Lodge & Spa** - Serengeti, Tanzania ($890/night)
9. **Lakeside Cabin Retreat** - Lake Tahoe, USA ($240/night)
10. **Tokyo Capsule Hotel** - Tokyo, Japan ($45/night)

### ✨ Amenities for each property:
- Wi-Fi
- Pool / Hot Tub (for luxury properties)
- Parking / Kitchen (for apartments)
- Air Conditioning
- Spa / Gym (for hotels)
- Breakfast / Restaurant
- Beach Access (for coastal properties)

---

## User-Specific Data (Requires Login):

These tables need **authenticated users**, so they can't be seeded with SQL:

### ❤️ Favorites
- Log in with Google OAuth
- Browse properties
- Tap the heart icon to save favorites

### ⭐ Reviews
- Log in with Google OAuth
- Open a property
- Tap "Write a Review"
- Add rating and comment

### 💰 Wallet
- Log in with Google OAuth
- Go to Wallet tab
- Add balance
- Transactions will be saved automatically

### 📱 Social Posts
- Log in with Google OAuth
- Go to Social tab
- Create a post about a property
- Add caption and images

### 💒 Wedding Events
- Log in with Google OAuth
- Go to Profile → Wedding Planning
- Add Christine & Duncan's wedding details

---

## Alternative: Test with Guest Login

**Don't want to set up Google OAuth yet?**

1. Open the Ejar app
2. Tap **"I have an account"** (guest login)
3. Browse all 12 properties ✅
4. View amenities ✅
5. See ratings and reviews ✅

**Note:** Guest login is read-only - you can't create reviews, favorites, or posts without Google OAuth.

---

## Troubleshooting:

### ❌ "Duplicate key value" error
**Solution:** The property already exists. This is normal - the script uses `ON CONFLICT DO NOTHING` to skip duplicates.

### ❌ "Permission denied for table properties"
**Solution:** Make sure you're logged into Supabase as the project owner with admin access.

### ❌ "relation 'properties' does not exist"
**Solution:** Your database tables aren't created yet. Run the `DATABASE_SETUP_CLEAN.sql` script first.

---

## Summary:

**To add dummy data:**
1. Open Supabase Dashboard → SQL Editor
2. Paste `SEED_DATA.sql` content
3. Click RUN
4. Done! ✅

**Result:**
- 12 properties to browse
- 30+ amenities displayed
- Ready to test with guest login
- Ready for real users with Google OAuth

---

## After Adding Data:

### Test the App:
1. Restart the Expo app
2. Guest login or Google sign-in
3. Browse **Discover** tab → See all 12 properties ✅
4. Check property details → See amenities ✅
5. Save favorites (requires login) ❤️
6. Write reviews (requires login) ⭐

The app is now populated with realistic data! 🎉
