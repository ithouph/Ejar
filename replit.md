# Ejar - Travel Booking App

## Overview

Ejar is a React Native mobile application built with Expo designed for booking hotels and apartments. Its core purpose is to provide a seamless travel booking experience, complemented by features such as wedding/event planning tools, a social feed, a secure user wallet system, and property review functionalities. The project aims to offer a comprehensive platform for users to discover, book, and share their travel experiences.

## User Preferences

- **Language**: JavaScript only (no TypeScript)
- **Styling**: All styles in theme folder, no custom CSS in pages
- **Backend**: Supabase for all CRUD operations
- **Authentication**: Google OAuth only
- **Design**: iOS 26 liquid glass, auto dark/light mode

## Recent Changes

### November 22, 2025
- **Google Maps Location Picker**: Implemented interactive map-based location selection for post creation using `react-native-maps`. Users can now either type a location manually or select it from an interactive map with draggable marker and reverse geocoding. Updated posts table schema to store `location_lat` and `location_lng` coordinates. Configured app.config.js to inject Google Maps API keys from Replit secrets (GOOGLE_MAPS_ANDROID_API_KEY, GOOGLE_MAPS_IOS_API_KEY).
- **Category Filtering & Popular Posts**: Added horizontal category filter cards (All, Phones, Laptops, Electronics, Cars, Property) at top of Posts page. Implemented "Popular" posts section (posts with >=10 likes) displayed above regular posts. Posts auto-filter when category is selected with instant UI updates.
- **Nearby Amenities for Rentals**: Added conditional "Nearby" amenities section (Mosque, Laundry, Gym) that appears only for Property category with Rent listing type and House/Apartment property types
- **Land Property Type Enhancement**: Added Land Size (sq m) field for Land property type, replacing standard Bedrooms/Bathrooms/Size fields
- **Combined Search and Filter Functionality**: Updated `properties.search()` in `services/database.js` to accept and apply filters (type, price range, rating) alongside search terms, allowing users to search and filter simultaneously
- **Improved Auth Guards**: Added proper authentication guards and loading states in Balance, Saved, and Posts pages to prevent errors when user is not logged in
- **Consolidated Backend Services**: All database operations unified in `services/database.js` with "Api" suffix naming convention to prevent naming collisions

## System Architecture

The application is built using Expo React Native for the frontend and Supabase (PostgreSQL) as the backend. Authentication is handled via Google OAuth using `expo-auth-session`. State management relies on React Context, specifically `AuthContext` for authentication state. Styling is managed through a centralized theme system located in the `theme/` folder, adopting a Bootstrap-like utility approach rather than inline styles.

**Key Technical Implementations & Features:**

-   **Backend Services:** All backend interactions are consolidated into a single unified service file (`services/database.js`), organized by feature (Auth, Users, Properties, Favorites, Reviews, Wallet, Posts, Balance Requests, Wedding). A naming convention using an "Api" suffix (e.g., `wallet as walletApi`) is used to prevent naming collisions.
-   **Styling System:** A global, centralized styling system is enforced, with all styles defined in `theme/` files (`colors.js`, `global.js`, `utils.js`, `index.js`). No custom `StyleSheet.create()` is used within page components.
-   **Data Flow:** The application prioritizes real-time data fetching and persistence with Supabase. In case of Supabase failure, static data from the `/data` folder serves as a fallback. Optimistic UI updates are implemented for immediate feedback.
-   **Authentication Flow:** Google OAuth handles user signup/login, with session persistence managed via AsyncStorage and global state managed by `AuthContext`.
-   **UI/UX Design:** The design adheres to an iOS 26 liquid glass interface, incorporating Notion-inspired scattered icons, frosted glass effects, and a metallic pickaxe app icon. The app supports auto dark/light mode detection.
-   **Core Capabilities:**
    -   Property discovery with search and filtering.
    -   Favorites system with Supabase persistence.
    -   Property reviews and ratings.
    -   User wallet with transaction history and balance top-up request system (with image upload for proof).
    -   Social posts feed with category filtering (Phones, Laptops, Electronics, Cars, Property) and Popular posts section.
    -   Interactive Google Maps location picker for posts (manual input or map selection with GPS coordinates).
    -   Category-specific post creation with conditional fields (nearby amenities, land size, etc.).
    -   Wedding/event planning features.
    -   User profile management.
    -   Legal pages (Terms of Service, Privacy Policy).

## External Dependencies

-   **Backend:** Supabase (PostgreSQL)
-   **Authentication:** Google OAuth via `expo-auth-session`
-   **Maps:** Google Maps API for interactive location selection (requires API keys for Android & iOS)
-   **Environment Variables:** Replit Secrets for `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `SESSION_SECRET`, `GOOGLE_MAPS_ANDROID_API_KEY`, `GOOGLE_MAPS_IOS_API_KEY`
-   **Image Handling:** `expo-image-picker` for image uploads (e.g., balance top-up proof)
-   **Location Services:** `expo-location` for GPS coordinates and reverse geocoding