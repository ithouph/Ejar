# Ejar - Marketplace & Travel Booking App

## Overview

Ejar is a React Native mobile application built with Expo designed as a marketplace for properties, phones, laptops, electronics, and cars. It includes features for travel booking, wallet system with city-based payment approvals, and a 4-tier user role system. The platform serves users in Mauritania with localized payment methods and city-based community management.

## User Preferences

- **Language**: JavaScript only (no TypeScript)
- **Styling**: All styles in theme folder, no custom CSS in pages
- **Backend**: Supabase for all CRUD operations
- **Authentication**: Phone OTP authentication (not Google OAuth)
- **Design**: iOS 26 liquid glass, auto dark/light mode
- **Primary Color**: rgba(22, 90, 74, 1)
- **Currency**: MRU (Mauritanian Ouguiya)

## Recent Changes

### December 2025
- **Phone OTP Authentication**: Replaced Google OAuth with phone-based OTP authentication
  - Users authenticate with phone number (+222 Mauritania code)
  - OTP verification step added
  - New CompleteProfile page for first-time users
  - Profile includes first_name, last_name, city_id, whatsapp_number
- **4-Tier User Role System**: Implemented city-based role hierarchy
  - `normal`: Regular users (default)
  - `member`: Can approve balance requests in their city
  - `ex_member`: Former member with reduced privileges
  - `leader`: Full oversight across all cities
- **City-Based Wallet System**: Updated balance/transaction flow
  - Users submit deposit requests with proof screenshots
  - City members approve deposits
  - Members earn rewards for approvals
  - Leaders can handle cross-city and escalated requests
- **Member Approvals Page**: Role-based approval system
  - Members see pending deposits in their city
  - View payment proof screenshots
  - Approve/reject with balance validation (1000 MRU minimum)
  - Leaders can approve all cities
- **Leader Dashboard Page**: Admin control panel with 3 tabs
  - Escalated Deposits: Handle cross-city or escalated requests
  - Unfair Reports: Review rejection reports (500 MRU penalty)
  - User Management: Search by phone, promote/demote roles
- **Updated Profile Page**: Role-based navigation cards
  - Members see "Payment Approvals" card (green)
  - Leaders see both "Payment Approvals" and "Leader Dashboard" (purple)
- **Posts Page Enhancement**: Payment status badges
  - Pending (yellow): Post awaiting review
  - Unpaid (red): Post not paid
  - Free (green): Used free post
  - Paid (green): Paid 10 MRU
- **Updated User Profile Pages**: Profile and EditProfile work with new schema
  - Display phone, WhatsApp, city, and role
  - City selection dropdown
  - Profile photo upload
- **Database Schema Update**: New comprehensive schema in DATABASE_SETUP.sql
  - Cities table with all Mauritanian cities
  - Users table with role, city_id, phone, whatsapp_number fields
  - Wallet transactions with type-based tracking
  - Member reports and activity logging

## System Architecture

The application is built using Expo React Native for the frontend and Supabase (PostgreSQL) as the backend. Authentication is handled via Supabase Phone Auth with OTP verification. State management relies on React Context, specifically `AuthContext` for authentication state. Styling is managed through a centralized theme system located in the `theme/` folder.

**Key Technical Implementations & Features:**

- **Authentication Flow:**
  1. User enters phone number (+222XXXXXXXX)
  2. OTP is sent via Supabase Phone Auth
  3. User verifies OTP
  4. New users complete profile (first name, last name, city, WhatsApp)
  5. Session persists via AsyncStorage

- **4-Tier Role System:**
  - `normal`: Can create posts (5 free, then paid), add balance
  - `member`: Normal + approve balance requests in their city, earn rewards
  - `ex_member`: Normal only (demoted member)
  - `leader`: Full access across all cities, handle escalations

- **Wallet System:**
  - Balance stored in `users.wallet_balance`
  - Free posts tracked in `users.free_posts_remaining`
  - Deposit requests require payment screenshot
  - City-based approval by members
  - Transaction types: deposit, withdrawal, post_payment, approval_reward, refund

- **Backend Services:** All backend interactions are in separate service files under `services/`:
  - `auth.js`: OTP authentication (sendOTP, verifyOTP)
  - `users.js`: Profile management, user CRUD
  - `cities.js`: City data
  - `categories.js`: Service categories
  - `posts.js`: Marketplace listings CRUD
  - `savedPosts.js`: User favorites/bookmarks
  - `reviews.js`: Post reviews
  - `wallet.js`: Balance and transactions

- **Styling System:** Centralized in `theme/` folder:
  - `colors.js`: Theme colors with primary rgba(22, 90, 74, 1)
  - `global.js`: Spacing, BorderRadius, Typography
  - `utils.js`: Utility styles

## Database Schema

Key tables (see DATABASE_SETUP.sql for complete schema):
- `cities`: Mauritanian cities with id, name, region
- `users`: Extended with phone, whatsapp_number, city_id, role, wallet_balance, free_posts_remaining
- `posts`: Marketplace listings with title, price, category, city_id
- `wallet_transactions`: Balance changes with type, status, approval info
- `member_reports`: Member performance tracking

## External Dependencies

- **Backend:** Supabase (PostgreSQL)
- **Authentication:** Supabase Phone Auth
- **Environment Variables:**
  - `EXPO_PUBLIC_SUPABASE_URL`: Supabase project URL
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
  - `SESSION_SECRET`: Session management
- **Image Handling:** `expo-image-picker` for uploads
- **Payment Methods:** Bankily, Sedad, Masrvi (local Mauritanian services)

## File Structure

```
/services            - Backend services (modular)
  index.js           - Exports all services
  auth.js            - Phone OTP authentication
  users.js           - User profile CRUD with role management
  cities.js          - City data
  categories.js      - Service categories
  posts.js           - Marketplace listings with payment tracking
  savedPosts.js      - Favorites/bookmarks
  reviews.js         - Post reviews
  wallet.js          - Balance & transactions with approval system
  notifications.js   - Push notifications for approvals
  reports.js         - Member unfair rejection reports

/pages
  Login.js           - Phone OTP login
  CompleteProfile.js - New user onboarding
  Profile.js         - User profile display with role-based nav
  EditProfile.js     - Profile editing
  Balance.js         - Wallet balance view
  AddBalance.js      - Deposit request form
  MemberApprovals.js - Member deposit approval page
  LeaderDashboard.js - Leader admin control panel
  Posts.js           - User's posts with payment status badges
  AddPost.js         - Create new post
  Discover.js        - Browse listings
  Saved.js           - Saved posts

/contexts
  AuthContext.js     - Authentication state

/theme
  colors.js          - Theme colors
  global.js          - Spacing, typography
```
