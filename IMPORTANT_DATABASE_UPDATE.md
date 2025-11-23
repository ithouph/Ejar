# 🔧 IMPORTANT: Database Schema Update Required

## ⚠️ Current Issue

Your Supabase database has **old column names** that don't match the updated codebase. This causes errors like:

```
Error: column users_1.photo_url does not exist
```

## ✅ Solution Options

You have **2 options** to fix this:

---

### **Option 1: Quick Fix (Rename Columns)** ⚡

**Best for:** If you already have data you want to keep

**Steps:**
1. Open your **Supabase Dashboard** → SQL Editor
2. Copy the entire contents of `DATABASE_FIX_SCHEMA.sql`
3. Paste it into the SQL Editor
4. Click **RUN**
5. Verify the changes in the output

**What this does:**
- Renames `photo_url` → `avatar_url` in users table
- Removes `whatsapp` column from user_profiles table
- Shows verification output

---

### **Option 2: Fresh Start (Drop & Recreate)** 🔄

**Best for:** If you don't have important data yet OR want a clean slate

**Steps:**

#### Step 1: Drop All Tables
```sql
DROP TABLE IF EXISTS payment_requests CASCADE;
DROP TABLE IF EXISTS balance_requests CASCADE;
DROP TABLE IF EXISTS wallet_transactions CASCADE;
DROP TABLE IF EXISTS wallet_accounts CASCADE;
DROP TABLE IF EXISTS property_reviews CASCADE;
DROP TABLE IF EXISTS saved_posts CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS amenities CASCADE;
DROP TABLE IF EXISTS property_photos CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

#### Step 2: Create Fresh Schema
1. Open `DATABASE_SETUP_CLEAN.sql` (the fixed version)
2. Copy **ALL** content
3. Paste into Supabase SQL Editor
4. Click **RUN**

#### Step 3: (Optional) Add Test Data
1. Open `SEED_DATA.sql`
2. Copy content
3. Paste into Supabase SQL Editor
4. Click **RUN**

---

## 📋 What Changed?

### 1. Users Table
- **OLD:** `photo_url` → **NEW:** `avatar_url`
- Reason: Consistent naming with Supabase auth standards

### 2. User Profiles Table
- **REMOVED:** `whatsapp` column
- Reason: Not in current schema requirements

### 3. Property Reviews
- Table name: `property_reviews` (not `reviews`)
- Column: `review_text` (not `comment`)

---

## 🔍 How to Verify It Worked

After running the fix:

1. **Refresh your app** in the browser
2. **Check browser console** - errors about `photo_url` should be gone
3. **Try signing in** with Google - should work without errors
4. **Check Supabase Table Editor**:
   - Open `users` table → verify column is named `avatar_url`
   - Open `user_profiles` table → verify `whatsapp` column is gone

---

## 🚨 If You Get Errors

**Error:** "column photo_url does not exist"
- **Solution:** You haven't run the fix yet. Go to Option 1 or 2 above.

**Error:** "new row violates row-level security policy"
- **Solution:** RLS policies need to be configured. Run `DATABASE_SETUP_CLEAN.sql` again.

**Error:** "table does not exist"
- **Solution:** Use Option 2 (Fresh Start) to recreate all tables.

---

## 📞 Need Help?

If you're stuck, tell me:
1. Which option you chose (1 or 2)
2. The exact error message you see
3. A screenshot of the Supabase SQL Editor output (if possible)

I'll help you fix it! 🚀
