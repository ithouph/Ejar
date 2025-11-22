# Ejar - Travel Booking App

A React Native mobile app built with Expo for booking hotels and apartments, featuring wedding/event planning, social features, wallet system, and property reviews.

## Project Overview

**Tech Stack:**
- **Frontend**: Expo React Native (JavaScript only, no TypeScript)
- **Navigation**: React Navigation 7
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Google OAuth via expo-auth-session
- **Styling**: Centralized theme system in `theme/` folder
- **State Management**: React Context (AuthContext)

**Key Features:**
- Google OAuth authentication with session persistence
- Property discovery (hotels & apartments) with filters and search
- Favorites system with Supabase persistence
- Property reviews and ratings
- User wallet with transaction history
- Social posts feed
- Wedding/event planning (Christine & Duncan couple details)
- Profile management with edit capabilities
- Dark/light mode auto-detection

## Project Structure

```
/
├── config/
│   └── supabase.js           # Supabase client configuration
├── contexts/
│   └── AuthContext.js        # Authentication state management
├── services/                 # Supabase CRUD services
│   ├── authService.js        # Google OAuth
│   ├── favoritesService.js   # Favorites CRUD
│   ├── propertiesService.js  # Properties with filters
│   ├── userService.js        # User profile management
│   ├── walletService.js      # Wallet & transactions
│   ├── reviewsService.js     # Property reviews
│   ├── postsService.js       # Social posts feed
│   └── weddingService.js     # Wedding event data
├── pages/                    # All app screens
│   ├── Welcome.js
│   ├── Login.js
│   ├── Discover.js           # ✅ Integrated with Supabase
│   ├── Saved.js              # ✅ Integrated with Supabase
│   ├── Details.js
│   ├── EditProfile.js
│   ├── Wallet.js
│   └── ...
├── components/               # Reusable components
│   ├── MainTabNavigator.js   # Bottom tab navigation (64 lines)
│   ├── Navbar.js             # Navbar components (TabBarIcon, PageHeader, SimpleHeader)
│   ├── ThemedText.js
│   ├── ThemedView.js
│   ├── Card.js
│   ├── ErrorBoundary.js
│   └── ...
├── router/                   # Screen navigators (4 routers)
│   ├── Discover.js
│   ├── Posts.js
│   ├── Saved.js
│   └── Settings.js
├── theme/                    # Centralized styling (Bootstrap-like)
│   ├── colors.js             # Color palette
│   ├── global.js             # Spacing, typography, layouts
│   ├── utils.js              # Utility styles
│   └── index.js
├── data/                     # Static fallback data
└── hooks/                    # Custom hooks

Documentation:
├── DATABASE_SCHEMA.md         # Supabase table definitions
├── DATABASE_RLS_POLICIES.md   # Row Level Security policies
├── GOOGLE_AUTH_SETUP.md       # Google OAuth setup guide
└── SUPABASE_SETUP_GUIDE.md    # Complete setup instructions
```

## Architecture Decisions

### Styling System
- **All styles** are in the `theme/` folder
- No custom `StyleSheet.create()` in pages
- Bootstrap-like utility system: `layoutStyles`, `buttonStyles`, `spacingStyles`, etc.
- Theme files: `colors.js`, `global.js`, `utils.js`, `index.js` only

### Data Flow
1. **With Supabase**: Real-time data fetching and persistence
2. **Fallback**: Static data from `/data` folder if Supabase fails
3. **Optimistic UI**: Immediate UI updates with background sync

### Authentication Flow
1. User clicks "Sign up with Google"
2. expo-auth-session opens Google OAuth
3. After success, session persisted to AsyncStorage
4. AuthContext manages global auth state
5. User ID used for all Supabase queries

## Current Status

### ✅ Completed
- Supabase client configuration
- Google OAuth authentication (client-side ready)
- AuthContext for state management
- All CRUD services implemented:
  - Properties (fetch, filter, search)
  - Favorites (add, remove, fetch with optimistic updates)
  - User profiles (get, update)
  - Wallet (balance, transactions with atomic RPC)
  - Reviews (create, update, delete, auto-rating)
  - Posts (CRUD for social feed)
  - Wedding events (couple details, date, location)
- Pages integrated with Supabase:
  - Discover (properties + favorites)
  - Saved (user favorites)
  - Login (Google OAuth)
- Centralized theme system
- Loading states and error handling
- Haptic feedback for favorites
- Fallback to static data

### 🔄 Partially Complete
- Google OAuth (needs Supabase dashboard configuration)
- Database (tables defined, RLS policies documented but not deployed)

### 📝 TODO
- Deploy database tables to Supabase
- Configure RLS policies in Supabase
- Set up Google OAuth in Supabase dashboard
- Integrate remaining pages:
  - EditProfile (save functionality)
  - Wallet (transaction management)
  - Details (review creation)
  - Social (posts management)
- Wire up service categories with navigation
- E2E testing with run_test tool
- Publish to Expo Go / App Stores

## Supabase Setup

**Required Steps:**
1. Create tables using SQL from `DATABASE_SCHEMA.md`
2. Apply RLS policies from `DATABASE_RLS_POLICIES.md`
3. Configure Google OAuth (see `GOOGLE_AUTH_SETUP.md`)
4. Test with authenticated user

**Database Features:**
- Row Level Security (RLS) for data protection
- Atomic wallet transactions via RPC function
- Automatic property rating updates on review changes
- Public read for properties/reviews, user-scoped for favorites/wallet

## Environment Secrets

The following secrets are configured in Replit Secrets:
- `EXPO_PUBLIC_SUPABASE_URL` - Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Supabase public anon key
- `SESSION_SECRET` - Session encryption key

## Running the App

1. **Development**: 
   ```bash
   npm run dev
   ```
   Opens Expo Metro bundler

2. **Testing on Device**:
   - Scan QR code with Expo Go app (iOS/Android)
   - Or open web version at `http://localhost:8081`

3. **Hot Module Reload**: 
   - Enabled by default
   - Code changes auto-refresh
   - Only restart for package.json changes

## Design Guidelines

Full design system documented in `design_guidelines.md`:
- iOS 26 liquid glass interface design
- Notion-inspired scattered icons
- Metallic pickaxe app icon
- Google OAuth with smooth animations
- Event planning interface with couple details
- Frosted glass effects with blur and tint

## Recent Changes

**2024-11-22 (Latest - Header Updates)**:
- ✅ **Removed Notifications Feature:**
  - Removed notifications bell icon from Header component
  - Deleted notificationsData.js file
  - Removed all onNotificationsPress navigation references
- ✅ **Updated Header Greeting:**
  - Replaced "👍 Sidi Find the best for your holiday" with random greeting messages
  - Added 5 different greeting variations that change on each render:
    - "Explore amazing places"
    - "Discover your next adventure"
    - "Find your perfect stay"
    - "Your journey starts here"
    - "Ready for new experiences"
  - Cleaner, simpler header design

**2024-11-22 (Earlier - Wallet UX Improvements)**:
- ✅ **Wallet Balance Relocated to Settings/Profile Page:**
  - Moved wallet balance display from Account.js to Profile.js for better UX
  - Balance card now prominently featured on Settings page with real-time database fetching
  - Added navigation from Profile to Balance page for transaction history
- ✅ **Add Balance Functionality Implemented:**
  - Created modal in Balance.js for adding funds to wallet
  - Modal includes amount input with dollar sign prefix and "Add Balance" button
  - Integrated with `walletService.addBalance()` for database persistence
  - Added loading states and error handling
  - Fixed navigation bug (removed SupportChat reference)
- ✅ **Discover Page UI Refinements:**
  - Changed search placeholder to personalized greeting: "Hi [name], where to today?"
  - Removed unused "See all" button next to "Popular hotels" heading
  - Cleaner, more focused user experience
- ✅ **Transaction History Enhanced:**
  - Added loading, empty, and error states to Balance.js transaction list
  - Displays "No transactions yet" when user has no transaction history
  - Smooth loading indicators during data fetch

**2024-11-22 (Earlier - Complete Database Integration)**:
- ✅ **All Pages Now Fetch from Supabase:**
  - Removed all remaining local/static data imports from Account.js, Profile.js, EditProfile.js, Review.js
  - Implemented real wallet balance fetching using `walletService.getWallet()` with proper parseFloat handling
  - Added loading/empty/error states to Review.js for better UX
  - Wired EditProfile to persist changes to both user_profiles and users tables
  - Created refreshUser() function in AuthContext to trigger UI updates after profile changes
  - Updated Account.js and Profile.js to fetch user data from users table instead of auth metadata
  - **Fixed critical EditProfile mobile number bug:**
    - Implemented smart field preservation logic
    - Only updates mobile if user enters a non-empty value
    - Preserves existing mobile numbers when user saves without changes
    - Prevents empty string from overwriting previously saved phone numbers
  - All screens now show fresh database values after save
  - App successfully compiling and running without data persistence issues

**2024-11-19**:
- ✅ Organized and moved MainTabNavigator to components folder
  - Moved from navigation/MainTabNavigator.js → components/MainTabNavigator.js
  - Reduced from 162 lines to 64 lines (60% reduction)
  - Used TAB_CONFIG array for cleaner, maintainable structure
  - Fixed metro bundler cache and verified app loads successfully
- ✅ Organized navbar components into single file (components/Navbar.js)
  - Created 3 reusable components: TabBarIcon, PageHeader, SimpleHeader
  - Updated Posts.js and Saved.js to use PageHeader
  - Removed redundant navbar styles from pages
- ✅ Fixed critical bugs:
  - Fixed Supabase config to properly read env variables using expo-constants
  - Fixed guest user ID to valid UUID format (00000000-0000-0000-0000-000000000001)
  - Fixed duplicate screen name warning (Account → Settings)
- ✅ Code cleanup:
  - Deleted 11 unused files
  - Router folder now only contains 4 essential navigators
  - All navigation components centralized in components/

**2024-11-19 (Earlier)**:
- ✅ Implemented complete Supabase integration
- ✅ Created all CRUD services (properties, favorites, wallet, reviews, posts, wedding)
- ✅ Updated Discover and Saved pages to use real Supabase data
- ✅ Fixed wallet transactions to use atomic RPC function
- ✅ Documented comprehensive RLS policies
- ✅ Added error handling with static data fallbacks
- ✅ Installed expo-auth-session for Google OAuth
- ✅ Updated Expo packages for compatibility

## Known Issues / Notes

1. **Google OAuth requires Supabase configuration** - Follow `GOOGLE_AUTH_SETUP.md`
2. **RLS policies must be deployed** - Without them, authenticated users get 401 errors
3. **Static data fallback** - App works without Supabase but data doesn't persist
4. **Web vs Native** - Some features work differently on web vs Expo Go
5. **Bundle identifier** - Set to `com.ejar.app` (updated from com.travelstay.app on 2024-11-21)

## User Preferences

- **Language**: JavaScript only (no TypeScript)
- **Styling**: All styles in theme folder, no custom CSS in pages
- **Backend**: Supabase for all CRUD operations
- **Authentication**: Google OAuth only
- **Design**: iOS 26 liquid glass, auto dark/light mode

## Next Session Actions

1. Deploy database tables and RLS policies to Supabase
2. Configure Google OAuth in Supabase dashboard
3. Test authentication flow end-to-end
4. Integrate remaining pages (EditProfile, Wallet, Details, Social)
5. Run e2e tests with run_test tool
6. Fix any bugs discovered during testing
