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
- **Dummy Data Seed Script**: Created SEED_DATA.sql with 10 realistic records for each table (users, posts, wallet_accounts, saved_posts, property_reviews, wallet_transactions, balance_requests, wedding_events, service_categories). Uses deterministic UUIDs and follows all database constraints.
- **Location Autocomplete Dropdown**: Added searchable dropdown for location field in Add Post page with 27 Mauritanian cities. Users can type to filter and select from the list, with case-insensitive search and proper theme styling.
- **Complete Backend Marketplace Overhaul**: Implemented comprehensive backend enforcement of marketplace rules
  - **Server-Side Specification Validation**: Created `validateAndNormalizeSpecifications()` helper in posts service that enforces category-specific requirements (nearby_amenities for rent house/apartment, land_size for land properties)
  - **Backend Filtering**: Updated Discover page to pass filters (category, search, price range) to `posts.getAll()` for server-side filtering via Supabase, improving performance and scalability
  - **Database Constraints & Triggers**: Added PostgreSQL constraints and triggers to enforce data integrity at database level:
    - listing_type and property_type constraints (only for property category)
    - Database trigger validates nearby_amenities and land_size requirements
    - Safe migration with backfill for existing data
  - **Complete Documentation**: Updated DATABASE_SCHEMA.md, DATABASE_MIGRATIONS.sql, and DATABASE_RLS_POLICIES.md with comprehensive examples and security policies
- **Nearby Amenities for Property Posts**: Added "Nearby" section (Mosque, Laundry, Gym) that only appears for Rent + House/Apartment property types; Land property type now shows Land Size field instead of Bedrooms/Bathrooms/Size
- **Discover Page Updated to Marketplace**: Changed Discover (home) page from showing properties to showing marketplace posts with category filters (All, Property, Phones, Electronics, Others)
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
    -   Social posts feed (CRUD).
    -   Wedding/event planning features.
    -   User profile management.
    -   Legal pages (Terms of Service, Privacy Policy).

## External Dependencies

-   **Backend:** Supabase (PostgreSQL)
-   **Authentication:** Google OAuth via `expo-auth-session`
-   **Environment Variables:** Replit Secrets for `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `SESSION_SECRET`
-   **Image Handling:** `expo-image-picker` for image uploads (e.g., balance top-up proof)