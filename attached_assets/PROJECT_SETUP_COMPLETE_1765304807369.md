# EJAR MARKETPLACE - COMPLETE PROJECT SETUP GUIDE

## 📱 PROJECT OVERVIEW

**Ejar** is a React Native/Expo mobile marketplace app for buying, selling, and renting items across multiple categories (properties, electronics, vehicles, furniture) with a **phone OTP-only authentication** system.

**Current Status:** Development ready, awaiting Supabase database setup

---

## 🏗️ ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                     REACT NATIVE / EXPO                     │
├──────────────────────────────────────────────────────────────┤
│
│  ┌─────────────┐      ┌──────────────┐     ┌─────────────┐
│  │   Welcome   │ ──→  │    Login     │ ──→ │   Main App  │
│  │   Screen    │      │   (Phone OTP) │     │  (Tabs)     │
│  └─────────────┘      └──────────────┘     └─────────────┘
│                              ↓
│                    ┌──────────────────┐
│                    │  Supabase Auth   │
│                    │  Phone OTP + DB  │
│                    └──────────────────┘
│
│  MAIN APP TABS:
│  ├── Discover     (Browse all posts + filters)
│  ├── My Posts     (User's listings)
│  ├── Saved        (Favorites)
│  └── Account      (Settings + Profile)
│
└──────────────────────────────────────────────────────────────┘
```

---

## 📁 PROJECT STRUCTURE

```
workspace/
├── App.js                          # Root app component
├── index.js                        # Entry point
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── babel.config.js                 # Babel config
├── .env                            # Environment variables
│
├── pages/                          # Screen components
│   ├── Welcome.js                  # Welcome screen
│   ├── Login.js                    # Phone OTP login
│   ├── Discover.js                 # Browse marketplace
│   ├── Posts.js                    # User's listings (NEW)
│   ├── PostDetail.js               # Single post details
│   ├── AddPost.js                  # Create new listing
│   ├── Saved.js                    # Saved posts
│   ├── Account.js                  # Account settings
│   ├── Settings.js                 # User settings
│   ├── Balance.js                  # Wallet management
│   ├── Profile.js                  # User profile
│   └── [Other pages...]            # FAQ, Support, etc.
│
├── router/                         # Navigation stacks
│   ├── Posts.js                    # Posts navigator
│   ├── Discover.js                 # Discover navigator
│   ├── Account.js                  # Account navigator
│   └── Saved.js                    # Saved navigator
│
├── components/                     # Reusable components
│   ├── TabNavigator.js             # Main tab navigation
│   ├── MainTabNavigator.js         # Tab bar setup
│   ├── Card.js                     # Post card component
│   ├── ErrorBoundary.js            # Error handling
│   ├── SearchOverlay.js            # Search modal
│   ├── Filters.js                  # Filter components
│   ├── Button.js                   # Button component
│   ├── ThemedText.js               # Styled text
│   ├── ThemedView.js               # Styled view
│   └── [Other components...]       # Navbar, Headers, etc.
│
├── contexts/                       # React Context
│   └── AuthContext.js              # User auth state
│
├── services/                       # Backend logic
│   ├── authService.js              # Auth functions
│   ├── database.js                 # All DB queries (1468 lines!)
│   └── mockData.js                 # Test/fallback data
│
├── config/                         # Configuration
│   └── supabase.js                 # Supabase client setup
│
├── hooks/                          # Custom hooks
│   ├── useTheme.js                 # Theme system
│   └── useScreenInsets.js          # Safe area handling
│
├── theme/                          # Styling
│   └── global.js                   # Colors, spacing, styles
│
├── constants/                      # Constants
│   └── [Constants...]              # App constants
│
├── data/                           # Mock data (for testing)
│   ├── userData.js
│   ├── cardsData.js
│   ├── filterData.js
│   └── [Other data...]
│
├── assets/                         # Images & Icons
│   └── images/                     # App icons, splash screens
│
└── DATABASE FILES:                 # SQL setup files
    ├── DATABASE_SETUP_CLEAN.sql    # Create all tables
    ├── DATABASE_SEEDS.sql          # Add test data
    └── DATABASE_RLS_POLICIES.sql   # Security rules
```

---

## 🔐 AUTHENTICATION FLOW

### Phone OTP Login (Recommended)

**User Journey:**
```
1. User enters phone number
2. System generates OTP (4 digits)
3. User enters OTP
4. System creates/logs in user (phone_number only)
5. Auto-creates wallet account
6. User logged in, can browse & create posts
```

**Key Files:**
- `services/database.js` → `auth.signInWithPhoneOTP()` & `verifyPhoneOTP()`
- `pages/Login.js` → Phone input UI
- `contexts/AuthContext.js` → Session management

**Database Tables Created:**
```sql
users (id, phone_number, created_at, updated_at)
wallet_accounts (id, user_id, balance, currency)
```

---

## 💾 DATABASE SETUP (SUPABASE)

### Step-by-Step Setup:

1. **Create Supabase Account** → https://supabase.com
2. **Create New Project** → Choose region
3. **Run SQL Files in Order:**
   ```
   1. DATABASE_SETUP_CLEAN.sql   (Creates all tables)
   2. DATABASE_SEEDS.sql         (Adds 5 test users + posts)
   3. DATABASE_RLS_POLICIES.sql  (Enables security)
   ```
4. **Get Credentials:**
   - Go to Project Settings → API Keys
   - Copy `SUPABASE_URL` and `SUPABASE_ANON_KEY`
5. **Add to `.env` file:**
   ```
   SUPABASE_URL=your_url_here
   SUPABASE_ANON_KEY=your_key_here
   ```

### Database Schema:

```sql
-- Users (Phone only - no profile fields!)
users (id, phone_number, created_at, updated_at)

-- Wallet System
wallet_accounts (id, user_id, balance, currency)

-- Posts/Listings
posts (id, user_id, category, type, title, description, 
       price, location, condition, images, created_at, updated_at)

-- Favorites
favorites (id, user_id, post_id, created_at)

-- Reviews
reviews (id, from_user_id, to_user_id, rating, comment, created_at)
```

### Test Data:
```
Phone Numbers: 22212345678, 22287654321, 22298765432, 22256789012, 22289876543
OTP: Any 4 digits (demo mode)
```

---

## 🚀 TECHNOLOGY STACK

| Layer | Technology |
|-------|------------|
| **Mobile Framework** | React Native 0.81.5 |
| **Development Platform** | Expo 54.0.25 |
| **Navigation** | React Navigation 7.4.0 |
| **Backend Database** | Supabase (PostgreSQL) |
| **Authentication** | Phone OTP + Supabase Auth |
| **State Management** | React Context API |
| **Styling** | React Native StyleSheet |
| **Animations** | React Native Reanimated 4.1 |
| **Icons** | Expo Vector Icons (Feather) |
| **Storage** | Async Storage (session) |
| **Forms** | React Native TextInput |
| **Lists** | FlatList + ScrollView |

---

## 🔄 HOW EVERYTHING CONNECTS

### 1. APP STARTUP
```
index.js 
  ↓
App.js (Root component)
  ↓
ErrorBoundary (Crash handling)
  ↓
GestureHandlerRootView (Gestures)
  ↓
SafeAreaProvider (Screen insets)
  ↓
AuthProvider (Load saved session)
  ↓
AuthGate (Check login status)
    ├─ NOT logged in → Welcome → Login
    └─ Logged in → MainTabNavigator
```

### 2. LOGIN PROCESS
```
Login.js (UI)
  ↓
services/database.js → auth.signInWithPhoneOTP()
  ↓
services/database.js → auth.verifyPhoneOTP()
  ↓
Creates user in Supabase
  ↓
Auto-creates wallet
  ↓
AuthContext updates user state
  ↓
Navigate to MainTabNavigator
```

### 3. LOADING POSTS
```
Discover.js (Component mounts)
  ↓
useEffect() calls loadData()
  ↓
services/database.js → posts.getAll(filters)
  ↓
Supabase query posts table
  ↓
Return posts array
  ↓
Display in FlatList → HotelCard components
```

### 4. CREATING POST
```
AddPost.js (Form submission)
  ↓
handleSubmit() validates form
  ↓
services/database.js → posts.create(postData)
  ↓
Insert into Supabase posts table
  ↓
Auto-add user_id
  ↓
Return new post
  ↓
Navigate to PostDetail
```

---

## 🎯 KEY FEATURES IMPLEMENTED

### ✅ Authentication
- Phone OTP login (no password needed)
- Auto user creation on first login
- Session persistence with Async Storage
- Supabase auth management

### ✅ Posts/Listings
- Browse all posts with filters
- Create new listings
- View post details
- User's own listings
- Save/favorite posts

### ✅ Wallet System
- View balance
- Add funds
- Auto-created on signup

### ✅ UI/UX
- Smooth animations
- Dark/light theme support
- Proper safe area handling
- Loading states
- Error boundaries

---

## 🛠️ CRITICAL FILES EXPLAINED

### `App.js`
- **Purpose:** Root component that sets up error handling, gestures, safe areas, and auth
- **Key Function:** AuthGate - determines if user sees Welcome/Login or Main App
- **Don't Change:** Unless adding new setup providers

### `contexts/AuthContext.js`
- **Purpose:** Manages user authentication state globally
- **Key Functions:** signInWithPhoneOTP(), signOut(), loadSession()
- **Usage:** `const { user, loading } = useAuth()` in any component

### `services/database.js` (1468 lines)
- **Purpose:** ALL database queries for Ejar
- **Sections:**
  - auth.* → Phone OTP login
  - posts.* → Create/read posts
  - wallet.* → Balance management
  - savedPosts.* → Favorites
  - reviews.* → User reviews

### `services/authService.js`
- **Purpose:** Google OAuth setup (alternative auth method)
- **Note:** Phone OTP is primary; Google is backup

### `config/supabase.js`
- **Purpose:** Initialize Supabase client
- **Key:** Reads SUPABASE_URL and SUPABASE_ANON_KEY from .env

### `pages/Login.js`
- **Purpose:** Phone OTP login UI
- **Flow:** Enter phone → Get OTP → Verify OTP → Login

### `pages/Discover.js`
- **Purpose:** Main marketplace browse screen
- **Features:** Search, filters, categories, load posts from backend
- **Key:** Already connected to database! Uses postsApi.getAll()

### `pages/Posts.js` (CREATED)
- **Purpose:** Show user's own listings
- **Features:** Create new, view my posts
- **New:** Just created to fix missing Posts page error

### `.env`
- **Purpose:** Store sensitive credentials
- **Contains:** SUPABASE_URL, SUPABASE_ANON_KEY
- **Important:** Never commit to git!

---

## ▶️ HOW TO RUN

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create `.env` file with:
```
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
```

### 3. Set Up Supabase Database
- Run three SQL files in order
- Get credentials from Supabase console

### 4. Start Dev Server
```bash
npm run dev
```

### 5. Test on Device
- Scan QR code with Expo Go app
- Or run on web: `npm run web`

### 6. Test Login
```
Phone: 22212345678
OTP: any 4 digits (demo mode)
```

---

## ❌ CURRENT BLOCKING ISSUES

### ✅ FIXED:
- Missing Posts.js page → Created
- Settings page labels → Updated to show phone number
- Auth error checks → Added

### ⚠️ STILL NEED TO DO:
1. Run DATABASE_SETUP_CLEAN.sql in Supabase
2. Run DATABASE_SEEDS.sql to add test data
3. Run DATABASE_RLS_POLICIES.sql for security
4. Add SUPABASE_URL and SUPABASE_ANON_KEY to .env
5. Restart dev server: `npm run dev`

---

## 📊 DATABASE TABLES EXPLAINED

### `users`
```sql
id (UUID) - Primary key
phone_number (TEXT) - User's phone (e.g., 22212345678)
created_at (TIMESTAMP) - Account creation
updated_at (TIMESTAMP) - Last update
```

### `wallet_accounts`
```sql
id (UUID) - Primary key
user_id (UUID) - Links to users table
balance (NUMERIC) - Money available
currency (TEXT) - "MRU" for Mauritanian Ouguiya
```

### `posts`
```sql
id (UUID) - Primary key
user_id (UUID) - Who posted it
category (TEXT) - "property", "phones", "electronics", etc.
type (TEXT) - "rent" or "sell"
title (TEXT) - Listing title
description (TEXT) - Full description
price (NUMERIC) - Price in MRU
location (TEXT) - City/area
condition (TEXT) - Item condition (for non-properties)
images (JSON ARRAY) - Photo URLs
created_at (TIMESTAMP) - Post date
updated_at (TIMESTAMP) - Last edit
```

### `favorites`
```sql
id (UUID) - Primary key
user_id (UUID) - Who saved it
post_id (UUID) - Which post
created_at (TIMESTAMP) - When saved
```

---

## 🎨 THEMING SYSTEM

The app uses a custom theme hook:

```javascript
const { theme, isDark } = useTheme();

// Access colors:
theme.background      // Main background
theme.surface         // Card/surface color
theme.primary         // Main action color
theme.textPrimary     // Main text
theme.textSecondary   // Secondary text
theme.border          // Border color
```

**Supported Themes:**
- Light (default)
- Dark (auto-switches based on device settings)

---

## 🚨 IMPORTANT NOTES

### ✅ DO:
- Keep database.js organized by feature
- Use AuthContext for user state
- Check user before database operations
- Handle loading states
- Show error messages to users

### ❌ DON'T:
- Store passwords (using phone OTP instead)
- Make database queries without checking user
- Edit package.json manually (use npm install)
- Commit .env to git
- Store secrets in code

---

## 📞 SUPPORT

**Issues Checklist:**
1. Is Supabase database set up? → Check SQL files run
2. Is .env configured? → Check SUPABASE_URL & SUPABASE_ANON_KEY
3. Is user logged in? → Check useAuth() hook
4. Is post showing? → Check Discover.js loads from backend

---

## 🎯 NEXT STEPS

1. **Setup Supabase Database** (Required to proceed)
   - Run DATABASE_SETUP_CLEAN.sql
   - Run DATABASE_SEEDS.sql
   - Run DATABASE_RLS_POLICIES.sql

2. **Configure Environment**
   - Add SUPABASE_URL to .env
   - Add SUPABASE_ANON_KEY to .env

3. **Test Login**
   - Restart dev server
   - Login with phone number
   - Browse marketplace

4. **Test Create Post**
   - Login as user
   - Go to AddPost
   - Create new listing

5. **Deploy**
   - When ready, publish to production
   - Set up Twilio for real phone OTP
   - Enable RLS policies in Supabase

---

**Last Updated:** November 30, 2025
**Project Version:** 1.0.0
**Status:** Ready for Database Setup
