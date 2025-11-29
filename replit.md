# Ejar App - Project Documentation

## Current Status ✅
- **MVP**: Fully functional marketplace app with Expo/React Native
- **Database**: Supabase configured with complete schema
- **Authentication**: Phone OTP login system implemented
- **Features**: Posts, Reviews, Saved Posts, Wallet, User Profiles

## Database Schema
All tables defined in `DATABASE_SETUP_CLEAN.sql`:
- users (with phone_number, first_name, last_name, age, profile_photo_url, whatsapp_number)
- posts (with category, price, images, specifications)
- reviews (ratings & comments)
- saved_posts (favorites)
- wallet_accounts & wallet_transactions
- posts_photos, service_categories, payment_requests, support_messages

## Dummy Data
Run `DATABASE_SEEDS.sql` to populate with test data:
- 5 test users with profiles and photos
- 10 posts across all categories (property, electronics, vehicles, furniture)
- Reviews, saved posts, wallet transactions

Test phone numbers: +222-12345678, +222-87654321, +222-98765432, +222-56789012, +222-89876543

## Architecture

### Pages (screens)
- Login.js - Phone + OTP authentication
- Discover.js - Main feed with category filters
- Details.js - Post details, reviews, save functionality
- EditProfile.js - User profile (name, age, photo, WhatsApp)
- Account.js - Account settings
- Balance.js - Wallet management
- Saved.js - Saved posts
- Settings.js - App settings
- Other screens: AddPost, Support, FAQ, Privacy, Terms

### Services
- **database.js** - All CRUD operations (posts, users, reviews, wallet, auth)
- **mockData.js** - Fallback data when Supabase fails

### Database Functions
All in `services/database.js`:
1. **auth** - Phone OTP login
2. **users** - Profile management
3. **posts** - CRUD for marketplace items
4. **reviews** - Rating & comments
5. **savedPosts** - Favorites
6. **wallet** - Balance management
7. **balanceRequests** - Admin payment approvals

## Key Features
✅ Phone-based authentication (no email needed)
✅ User profiles with photos, age, WhatsApp
✅ Post creation with multiple images
✅ Category filtering (property, electronics, vehicles, furniture)
✅ Save/favorite posts
✅ Reviews & ratings system
✅ Wallet with balance management
✅ Fallback to mock data if Supabase unavailable

## Design
- Minimal classic aesthetic with neutral colors
- Borders instead of shadows (except floating elements)
- Clean, professional look
- Mobile-first responsive design

## Recent Changes
- Added phone_number as primary login field
- Added first_name, last_name, age, profile_photo_url, whatsapp_number to users
- Fixed all database schema mismatches (property_id → post_id)
- Created DATABASE_SEEDS.sql with complete dummy data
- Cleaned up unused duplicate files
- Updated mockData.js to match seed data
