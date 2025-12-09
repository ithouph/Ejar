# SUPABASE PHONE OTP AUTHENTICATION SETUP

## 🎯 COMPLETE SETUP GUIDE

This guide explains how to set up Supabase for phone number + OTP authentication in Ejar.

---

## 📋 WHAT'S IMPLEMENTED

✅ **Phone OTP Login Flow:**
1. User enters phone number
2. System generates OTP (4 digits)
3. User enters OTP code
4. System verifies and logs user in
5. User data stored locally and in Supabase

✅ **Updated Files:**
- `pages/Login.js` - Phone OTP UI connected to backend
- `contexts/AuthContext.js` - Phone OTP auth context
- `services/database.js` - Phone OTP functions (already existed)
- `.env` - Supabase credentials

---

## 🚀 STEP 1: CREATE SUPABASE PROJECT

### 1.1 Go to Supabase
- Website: https://supabase.com
- Click "Start your project"

### 1.2 Create New Project
- Organization: Create new or select existing
- Project name: `ejar-marketplace`
- Database password: Save this securely!
- Region: Choose closest to your users
- Click "Create new project"

### 1.3 Wait for Setup
- Takes ~2 minutes to create
- You'll see a success message

---

## 🔑 STEP 2: GET YOUR CREDENTIALS

### 2.1 Get API Keys
1. Go to **Project Settings** (bottom left)
2. Click **API** tab
3. Copy the following:
   - **Project URL** → This is `SUPABASE_URL`
   - **Anon Public key** → This is `SUPABASE_ANON_KEY`

**Example:**
```
SUPABASE_URL = https://xyzabc123.supabase.co
SUPABASE_ANON_KEY = eyJhbGc... (long string)
```

---

## 🗄️ STEP 3: CREATE DATABASE TABLES

### 3.1 Open SQL Editor
1. Go to **SQL Editor** (left sidebar)
2. Click **New Query**

### 3.2 Run DATABASE_SETUP_CLEAN.sql
1. Copy entire content of `DATABASE_SETUP_CLEAN.sql`
2. Paste into SQL editor
3. Click **Run** button (⏵️)
4. Wait for success message ✅

**What this does:**
- Creates `users` table (phone_number only)
- Creates `wallet_accounts` table
- Creates `posts` table
- Creates `favorites` table
- Creates `reviews` table

### 3.3 Run DATABASE_SEEDS.sql
1. Click **New Query**
2. Copy `DATABASE_SEEDS.sql`
3. Paste and **Run**

**What this does:**
- Adds 5 test users
- Adds test posts
- Adds test favorites
- All with test data

**Test Credentials:**
```
Phone Numbers: 22212345678, 22287654321, 22298765432, 22256789012, 22289876543
OTP: Any 4 digits (demo mode)
```

### 3.4 Run DATABASE_RLS_POLICIES.sql
1. Click **New Query**
2. Copy `DATABASE_RLS_POLICIES.sql`
3. Paste and **Run**

**What this does:**
- Enables Row Level Security (RLS)
- Ensures users can only access their own data
- Protects wallet and posts from unauthorized access

---

## 🔐 STEP 4: ADD CREDENTIALS TO PROJECT

### 4.1 Update .env File

Open `.env` file (in project root) and add:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGc... (your anon key)
```

**Example:**
```env
SUPABASE_URL=https://xyzabc123.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJpc3MiOiJzdXBhYmFz...
```

### 4.2 Verify File Structure
Make sure `.env` is in the root directory:
```
workspace/
├── .env              ← HERE
├── App.js
├── pages/
├── services/
└── ...
```

---

## ▶️ STEP 5: START THE APP

### 5.1 Restart Dev Server
```bash
npm run dev
```

The workflow will auto-restart and load new environment variables.

### 5.2 Test Login
1. Open the app in Expo Go or web browser
2. Enter phone number: `22212345678`
3. Click "Send Code"
4. You'll see the OTP in console and an alert
5. Enter OTP (any 4 digits, but use the one shown)
6. Click "Verify"
7. ✅ You're logged in!

---

## 🔄 HOW PHONE OTP WORKS

### Login Flow:

```
┌─────────────────┐
│  User enters    │
│  phone number   │
└────────┬────────┘
         ↓
┌─────────────────────────────────────┐
│  auth.signInWithPhoneOTP()          │
│  - Formats phone number             │
│  - Generates random 4-digit OTP     │
│  - Logs OTP to console (demo mode)  │
│  - Returns OTP to show user         │
└────────┬────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  User enters OTP code               │
└────────┬────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  Verify OTP matches                 │
│  - Compare entered OTP with generated│
└────────┬────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  auth.verifyPhoneOTP()              │
│  - Check if user exists             │
│  - If YES: return user data         │
│  - If NO: create new user           │
│  - Auto-create wallet               │
└────────┬────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  signInWithPhoneOTP()               │
│  - Store user in AsyncStorage       │
│  - Update AuthContext               │
│  - Navigate to main app             │
└─────────────────────────────────────┘
```

---

## 📁 FILES MODIFIED

### ✅ pages/Login.js
- Imports `auth` from database.js
- `handleSendCode()` → Calls `auth.signInWithPhoneOTP()`
- `handleVerifyOtp()` → Calls `auth.verifyPhoneOTP()`
- Displays OTP to user (demo mode)

### ✅ contexts/AuthContext.js
- Added `signInWithPhoneOTP()` method
- Stores user in AsyncStorage
- Loads saved user on app start
- Provides phone OTP to components via `useAuth()`

### ✅ services/database.js
- `auth.signInWithPhoneOTP(phoneNumber)` - Generates OTP
- `auth.verifyPhoneOTP(phoneNumber, otp)` - Verifies & creates/logs in user

### ✅ .env
- Added SUPABASE_URL
- Added SUPABASE_ANON_KEY

---

## 🧪 TEST DATA

### Test Users
```
Phone: 22212345678 → User ID: 1a2b3c4d...
Phone: 22287654321 → User ID: 5e6f7g8h...
Phone: 22298765432 → User ID: 9i0j1k2l...
Phone: 22256789012 → User ID: 3m4n5o6p...
Phone: 22289876543 → User ID: 7q8r9s0t...
```

### How to Login
1. Enter any test phone number above
2. Click "Send Code"
3. Any 4 digits as OTP (shown in alert and console)
4. Click "Verify"
5. ✅ Logged in!

---

## 🐛 TROUBLESHOOTING

### Issue: "SUPABASE_URL missing"
**Solution:**
- Check `.env` file has both variables
- Restart dev server: `npm run dev`
- Check variable names are EXACT (no typos)

### Issue: "Table not found"
**Solution:**
- Run `DATABASE_SETUP_CLEAN.sql` in Supabase
- Run `DATABASE_SEEDS.sql` for test data
- Wait a few seconds and refresh

### Issue: OTP verification fails
**Solution:**
- Make sure you enter the EXACT code shown
- Check console for the generated OTP
- Try again with correct code

### Issue: User not staying logged in
**Solution:**
- Check AsyncStorage is working
- Check `.env` credentials are correct
- Restart dev server

---

## 🚀 PRODUCTION SETUP

When deploying to production:

### 1. Enable Real SMS OTP
```javascript
// In production, use Twilio or AWS SNS
// Instead of console.log, send via SMS
const sendOTPviaSMS = async (phoneNumber, otp) => {
  // Call Twilio API
  // Send SMS with OTP
}
```

### 2. Enable Supabase Phone Auth
- Go to Supabase Auth Settings
- Enable "Phone" provider
- Set up Twilio integration
- Configure SMS template

### 3. Use Supabase Native Phone Auth
```javascript
// Instead of custom OTP, use Supabase built-in
const { data, error } = await supabase.auth.signInWithOtp({
  phone: phoneNumber,
})
```

### 4. Secure Environment Variables
- Use Replit Secrets (not .env)
- Never commit credentials to git
- Rotate keys regularly

---

## 📱 USER EXPERIENCE

### Welcome Screen
- Shows "Ejar" logo and brand
- Floating marketplace icons
- Call to action

### Phone Input Screen
- Country code: +222 (Mauritania)
- Phone number input
- "Send Code" button
- Terms and privacy notice

### OTP Verification Screen
- 4 digit input boxes
- Auto-focus between inputs
- "Verify" button
- "Wrong number?" link to go back

### After Login
- Redirects to main app
- Shows Discover tab with posts
- Can create listings
- Can access wallet and settings

---

## ✅ CHECKLIST

- [ ] Created Supabase project
- [ ] Got SUPABASE_URL from API keys
- [ ] Got SUPABASE_ANON_KEY from API keys
- [ ] Ran DATABASE_SETUP_CLEAN.sql
- [ ] Ran DATABASE_SEEDS.sql
- [ ] Ran DATABASE_RLS_POLICIES.sql
- [ ] Added credentials to .env file
- [ ] Restarted dev server (npm run dev)
- [ ] Tested phone OTP login
- [ ] Created test post
- [ ] Saved a post as favorite

---

## 🎉 YOU'RE DONE!

Your Ejar marketplace app now has:
- ✅ Phone OTP authentication
- ✅ User account creation
- ✅ Automatic wallet setup
- ✅ Post creation and browsing
- ✅ Favorites system
- ✅ Security with RLS policies

**Next Steps:**
1. Test all features thoroughly
2. Add more test data
3. Customize branding if needed
4. Deploy to Expo Go for testing on device
5. Build and release!

---

## 📞 NEED HELP?

Check these files for implementation details:
- `pages/Login.js` - UI logic
- `contexts/AuthContext.js` - State management
- `services/database.js` - Backend queries
- `config/supabase.js` - Supabase client setup

**Questions?**
- Check Supabase docs: https://supabase.com/docs
- Check Expo docs: https://docs.expo.dev
- Check React Native docs: https://reactnative.dev

---

**Last Updated:** November 30, 2025  
**Version:** 1.0.0  
**Status:** Ready for Production Setup
