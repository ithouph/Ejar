# Ejar Marketplace - Setup Guide

## Supabase Database & OTP Authentication Setup

This guide walks you through setting up Supabase as the backend for Ejar marketplace app, including database schema and phone-based OTP authentication.

---

## Part 1: Create Supabase Project

### Step 1: Sign Up / Log In to Supabase
1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** and sign up (or log in if you already have an account)
3. Use Google, GitHub, or email to create account

### Step 2: Create a New Project
1. In the Supabase dashboard, click **"New Project"**
2. Fill in the project details:
   - **Project name**: `ejar` (or your preferred name)
   - **Database password**: Create a strong password (save it!)
   - **Region**: Choose closest to your location
   - **Pricing plan**: Start with Free tier
3. Click **"Create new project"**
4. Wait 2-3 minutes for project initialization

### Step 3: Get Your API Keys
1. Once project is created, go to **Settings → API**
2. Copy these keys (you'll need them for your app):
   - **Project URL** (example: `https://xxxxx.supabase.co`)
   - **Anon Public Key** (starts with `eyJhbG...`)

---

## Part 2: Environment Variables Setup

### Step 1: Create `.env.local` File
In your project root directory, create a `.env.local` file with:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here
```

**Replace** the URL and key with your actual Supabase credentials from Part 1, Step 3.

### Step 2: Verify in App
Check that `services/supabase.js` imports these variables correctly:
```javascript
import { SUPABASE_URL, SUPABASE_KEY } from "@react-native-dotenv";
```

Your `services/supabase.js` should automatically use these environment variables.

---

## Part 3: Set Up Database Schema

### Step 1: Access Supabase SQL Editor
1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**

### Step 2: Run Database Setup Script
1. Copy all code from `DATABASE_SETUP_CLEAN.sql`
2. Paste into the SQL editor
3. Click **"RUN"** (or press Ctrl+Enter)
4. Wait for completion (should show "Executed successfully")

### Step 3: Seed Initial Data
1. Click **"New Query"** again
2. Copy all code from `DATABASE_SEEDS.sql`
3. Paste into the SQL editor
4. Click **"RUN"**
5. Wait for completion

### Step 4: Apply Row-Level Security Policies
1. Click **"New Query"** again
2. Copy all code from `DATABASE_RLS_POLICIES.sql`
3. Paste into the SQL editor
4. Click **"RUN"**
5. Wait for completion

### Verify Setup
- Go to **Table Editor** (left sidebar)
- You should see these tables:
  - `users` (5 test users)
  - `posts` (10+ sample posts)
  - `wallet_accounts` (wallet balances)
  - `wallet_transactions` (transaction history)
  - `payment_requests` (pending approvals)
  - `cities`, `reviews`, `favorites`

---

## Part 4: Configure OTP Authentication

### Step 1: Enable Phone Authentication
1. In Supabase dashboard, go to **Authentication → Providers**
2. Find **"Phone"** section
3. Click the toggle to **enable** it
4. You'll see options for SMS providers

### Step 2: Configure OTP Provider (Twilio recommended)
For development/testing, you can use Supabase's built-in SMS:

1. Go to **Authentication → Providers → Phone**
2. Select **"Use Supabase Auth SMS"** (built-in option)
3. This allows you to test with OTP codes

### Step 3: Test Phone Numbers (Development)
The app uses these test phone numbers with OTP code `0000`:

```
Test Phone Numbers:
- 22212345678  (Member account - can approve payments)
- 22287654321  (Regular user)
- 22298765432  (Regular user)
- 22256789012  (Regular user)
- 22289876543  (Member account - can approve payments)

OTP Code for all: 0000
(Or any 4 digits during development)
```

### Step 4: Production SMS Setup (Later)
For production, you'll want a real SMS provider. Options:
1. **Twilio**: Popular, $0.0075 per SMS in Mauritania
2. **AWS SNS**: $0.00645 per SMS
3. **Vonage (Nexmo)**: Various pricing

To add a provider later:
1. Go to **Authentication → Providers → Phone**
2. Select your provider
3. Add your API credentials
4. Enable the provider

---

## Part 5: Configure Auth Session & Tokens

### Step 1: Go to Authentication Settings
1. In Supabase, go to **Authentication → Policies**
2. Keep default settings:
   - JWT expiry: 3600 seconds (1 hour)
   - Refresh token expiry: 604800 seconds (7 days)

### Step 2: Enable Refresh Token Rotation (Optional but Recommended)
1. Go to **Authentication → Providers → Phone**
2. Look for "Refresh token rotation" settings
3. Enable if available (adds security)

---

## Part 6: App Configuration

### Step 1: Verify AuthContext Setup
Check `contexts/AuthContext.js` uses Supabase correctly:
- Imports `supabase` from `services/supabase.js`
- Uses `signInWithOTP()` for phone login
- Stores auth state in AsyncStorage

### Step 2: Test Login Flow
1. Run the app: `npm run dev`
2. Go to Login screen
3. Enter phone: `22212345678`
4. Enter OTP: `0000`
5. Should login successfully

### Step 3: Verify Post Creation
1. Login with a member account (22212345678 or 22289876543)
2. Go to Posts tab
3. Create a post with image
4. Should be added to database automatically

---

## Part 7: Test Complete Flow

### Test User Accounts
**Members (can approve payments):**
- Phone: `22212345678` | OTP: `0000`
- Phone: `22289876543` | OTP: `0000`

**Regular Users:**
- Phone: `22287654321` | OTP: `0000`
- Phone: `22298765432` | OTP: `0000`
- Phone: `22256789012` | OTP: `0000`

### Test Scenarios
1. **Create a Post**
   - Login with any account
   - Go to Posts tab → Add new post
   - Fill details → Should be in database

2. **View Payment Approvals (Members Only)**
   - Login with `22212345678`
   - Go to Settings
   - Click "Payment Approvals"
   - Should see pending payments

3. **Non-Members Cannot Access**
   - Login with `22287654321`
   - Go to Settings
   - Click "Payment Approvals"
   - Should see "Member Only Access" message

---

## Part 8: Environment Variables Reference

Create `.env.local` in your project root:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: For production
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Get these values from Supabase Dashboard → Settings → API

---

## Part 9: Troubleshooting

### OTP Code Not Working
- Use `0000` for development (or any 4 digits)
- Check phone number format (include country code: `222...`)
- Make sure Phone authentication is enabled in Supabase

### "Cannot read property 'split'" Error
- Check that SUPABASE_URL is set in `.env.local`
- Verify URL format: `https://xxxxx.supabase.co` (not `http://`)

### Login Fails, No Error Message
1. Check `.env.local` file exists
2. Verify environment variables are correct
3. Check browser console for errors (F12)
4. Restart the dev server: `npm run dev`

### Database Queries Return Empty
1. Verify all three SQL files were run (SETUP → SEEDS → RLS_POLICIES)
2. Go to Supabase Table Editor and check data exists
3. Check Row-Level Security policies are not blocking queries

### App Crashes on Startup
- Check that ErrorBoundary wraps the entire app in `App.js`
- Clear cache: `npm run dev` with fresh install
- Check console logs for specific errors

---

## Part 10: Database Schema Overview

### Users Table
Stores user accounts with phone login:
- `id`: Unique user ID
- `phone_number`: Login phone (unique)
- `whatsapp_phone`: Optional WhatsApp contact
- `post_limit`: Max posts allowed (default: 5)
- `posts_count`: Current post count
- `is_member`: Member status (can approve payments)

### Posts Table
Marketplace listings:
- `title`, `description`, `category`, `price`
- `images[]`: Array of image URLs
- `is_paid`: Payment status
- `is_approved`: Admin approval
- `payment_approved`: Payment verification
- `user_id`: Post creator

### Wallet Tables
- `wallet_accounts`: User balance (currency: MRU)
- `wallet_transactions`: Transaction history (credit/debit)
- `payment_requests`: Pending approvals with status

### Other Tables
- `cities`: Available locations
- `reviews`: Post ratings/comments
- `favorites`: Saved posts
- `reviews_summary`: Aggregate user ratings

---

## Part 11: Security Notes

### Row-Level Security (RLS)
- All tables have RLS enabled in `DATABASE_RLS_POLICIES.sql`
- Users can only see/edit their own data
- Members have special access to approve payments
- Policies are automatically applied after running RLS script

### API Key Security
- **Anon Key**: Safe to expose in frontend (public)
- **Service Role Key**: Keep secret (backend only)
- Never commit `.env.local` to version control

### OTP Security
- OTP codes expire (default: 60 seconds)
- Rate limiting prevents brute force
- Phone verification required for signup

---

## Quick Start Summary

```bash
# 1. Set environment variables in .env.local
EXPO_PUBLIC_SUPABASE_URL=your-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-key

# 2. Run setup scripts in Supabase SQL Editor:
#    - DATABASE_SETUP_CLEAN.sql
#    - DATABASE_SEEDS.sql
#    - DATABASE_RLS_POLICIES.sql

# 3. Enable Phone Authentication in Supabase

# 4. Start the app
npm run dev

# 5. Test login with: 22212345678 / OTP: 0000
```

---

## Support & Next Steps

### Need Help?
- Supabase Docs: https://supabase.com/docs
- Expo Auth Docs: https://docs.expo.dev/build-reference/
- This app's database: Check `services/database.js`

### Deploy to Production
- Set environment variables on your hosting platform
- Use production Supabase project (not development)
- Configure real SMS provider (Twilio, AWS SNS, etc.)
- Set up database backups
- Enable Row-Level Security policies

---

## Part 12: Database Functions Reference

All database operations are in `services/database.js`. Import and use them in your components:

```javascript
import { posts, auth, wallet, paymentRequests, users } from "../services/database";
```

### 1. AUTHENTICATION

#### `auth.signInWithPhoneOTP(phoneNumber)`
Request OTP for phone number.

```javascript
const response = await auth.signInWithPhoneOTP("22212345678");
// Returns: { phoneNumber, otp, userExists, userId }
```

#### `auth.verifyPhoneOTP(phoneNumber, otp)`
Verify OTP and login/create user.

```javascript
const response = await auth.verifyPhoneOTP("22212345678", "0000");
// Returns: { user: { id, phone_number, ... }, isNewUser: true/false }
```

---

### 2. POSTS (Marketplace Listings)

#### `posts.getAllApproved(limit, offset)`
Get approved posts for feed (public view).

```javascript
const posts = await posts.getAllApproved(50, 0);
// Returns: Array of approved posts
```

#### `posts.getByUser(userId)`
Get all posts by specific user (their own posts).

```javascript
const userPosts = await posts.getByUser(userId);
// Returns: Array of user's posts
```

#### `posts.getById(postId)`
Get single post details.

```javascript
const post = await posts.getById(postId);
// Returns: { id, title, description, price, images[], ... }
```

#### `posts.create(userId, postData)`
Create new post (free or paid).

```javascript
const newPost = await posts.create(userId, {
  title: "iPhone 14 Pro",
  description: "Like new condition",
  category: "electronics",
  price: 150000,
  location: "Nouakchott",
  images: ["url1", "url2"],
  isPaid: false  // false = needs approval, true = auto-approved
});
// Returns: { id, created_at, ... }
```

#### `posts.update(postId, userId, updates)`
Update post details.

```javascript
const updated = await posts.update(postId, userId, {
  title: "New Title",
  description: "Updated description",
  price: 200000
});
```

#### `posts.delete(postId, userId)`
Delete post.

```javascript
const success = await posts.delete(postId, userId);
// Returns: true/false
```

#### `posts.canUserPost(userId)`
Check if user can create posts (hasn't hit limit).

```javascript
const canPost = await posts.canUserPost(userId);
// Returns: true/false
```

#### `posts.getUserPostLimit(userId)`
Get user's post count and limit.

```javascript
const limit = await posts.getUserPostLimit(userId);
// Returns: { posts_count: 2, post_limit: 5 }
```

#### `posts.getByCategory(category, limit)`
Search posts by category.

```javascript
const categoryPosts = await posts.getByCategory("property", 50);
// Returns: Array of approved posts in category
```

#### `posts.getByLocation(location, limit)`
Search posts by location.

```javascript
const locationPosts = await posts.getByLocation("Nouakchott", 50);
// Returns: Array of approved posts in location
```

#### `posts.search(searchTerm, limit)`
Search posts by title/description.

```javascript
const results = await posts.search("apartment", 50);
// Returns: Array of matching posts
```

---

### 3. REVIEWS

#### `postReviews.getForPost(postId)`
Get all reviews for a post.

```javascript
const reviews = await postReviews.getForPost(postId);
// Returns: Array of { rating, comment, user_id, created_at, ... }
```

#### `postReviews.add(userId, postId, reviewData)`
Add review/rating to post.

```javascript
const review = await postReviews.add(userId, postId, {
  rating: 5,
  comment: "Great product, fast shipping!"
});
```

#### `postReviews.update(reviewId, userId, updates)`
Update review.

```javascript
const updated = await postReviews.update(reviewId, userId, {
  rating: 4,
  comment: "Updated comment"
});
```

#### `postReviews.delete(reviewId, userId)`
Delete review.

```javascript
await postReviews.delete(reviewId, userId);
```

---

### 4. FAVORITES (Saved Posts)

#### `favorites.get(userId)`
Get all saved posts for user.

```javascript
const savedPosts = await favorites.get(userId);
// Returns: Array of favorite post IDs
```

#### `favorites.add(userId, postId)`
Save/favorite a post.

```javascript
await favorites.add(userId, postId);
// Returns: { id, created_at }
```

#### `favorites.remove(userId, postId)`
Remove from favorites.

```javascript
await favorites.remove(userId, postId);
// Returns: true/false
```

#### `favorites.isFavorite(userId, postId)`
Check if post is favorited.

```javascript
const isFaved = await favorites.isFavorite(userId, postId);
// Returns: true/false
```

---

### 5. WALLET & BALANCE

#### `wallet.get(userId)`
Get wallet account for user.

```javascript
const wallet = await wallet.get(userId);
// Returns: { id, user_id, balance, currency }
```

#### `wallet.getBalance(userId)`
Get current balance.

```javascript
const balance = await wallet.getBalance(userId);
// Returns: 5000.00 (number)
```

#### `wallet.addBalance(userId, amount, description)`
Add money to wallet.

```javascript
await wallet.addBalance(userId, 1000, "Payment approved");
// Returns: { id, balance, updated_at }
```

#### `wallet.deductBalance(userId, amount, description)`
Deduct money from wallet.

```javascript
await wallet.deductBalance(userId, 500, "Post payment");
// Returns: { id, balance, updated_at } or { error: "Insufficient balance" }
```

#### `wallet.getTransactions(userId, limit)`
Get transaction history.

```javascript
const txns = await wallet.getTransactions(userId, 50);
// Returns: Array of { type, amount, description, created_at, ... }
```

---

### 6. PAYMENT REQUESTS (Member Approvals)

#### `paymentRequests.create(userId, postId, amount)`
Create payment request (when user creates paid post).

```javascript
const request = await paymentRequests.create(userId, postId, 500);
// Returns: { id, status: "pending", amount, created_at }
```

#### `paymentRequests.getPending(userId)`
Get pending requests for specific user.

```javascript
const pending = await paymentRequests.getPending(userId);
// Returns: Array of pending payment requests
```

#### `paymentRequests.getAllPending(limit)`
Get all pending requests (for member approval page).

```javascript
const allPending = await paymentRequests.getAllPending(50);
// Returns: Array of all pending payments awaiting approval
```

#### `paymentRequests.approve(requestId, adminNotes)`
Approve payment request (member action).

```javascript
const approved = await paymentRequests.approve(requestId, "Approved by admin");
// - Updates status to "approved"
// - Adds balance to user's wallet
// - Sets post.is_approved = true
// - Sets post.payment_approved = true
```

#### `paymentRequests.deny(requestId, reason)`
Deny payment request (member action).

```javascript
const denied = await paymentRequests.deny(requestId, "Image quality poor");
// - Updates status to "rejected"
// - Stores rejection reason
```

#### `paymentRequests.getHistory(userId, limit)`
Get payment request history.

```javascript
const history = await paymentRequests.getHistory(userId, 50);
// Returns: Array of all requests (pending, approved, rejected)
```

---

### 7. USERS

#### `users.getById(userId)`
Get user profile.

```javascript
const user = await users.getById(userId);
// Returns: { id, phone_number, is_member, posts_count, post_limit, ... }
```

#### `users.update(userId, updates)`
Update user profile.

```javascript
await users.update(userId, {
  whatsapp_phone: "22212345678",
  post_limit: 10
});
```

#### `users.incrementPostCount(userId)`
Increment post count (called when post created).

```javascript
await users.incrementPostCount(userId);
```

---

## Part 13: Common Usage Patterns

### Create and Publish a Post

```javascript
// 1. Create post
const post = await posts.create(userId, {
  title: "iPhone 14",
  description: "Good condition",
  category: "electronics",
  price: 150000,
  location: "Nouakchott",
  images: ["url1", "url2"],
  isPaid: true  // Auto-approved
});

// 2. Create payment request
if (post) {
  await paymentRequests.create(userId, post.id, 500);
}
```

### Member Approval Flow

```javascript
// 1. Get pending payments
const pending = await paymentRequests.getAllPending();

// 2. Member approves
await paymentRequests.approve(paymentId, "Approved");
// This automatically:
// - Adds balance to user wallet
// - Marks post as approved
// - Sets payment_approved = true

// 3. User can now see post in public feed
```

### Search and Filter

```javascript
// Get approved posts by category
const propertyPosts = await posts.getByCategory("property", 50);

// Search by location
const noukPosts = await posts.getByLocation("Nouakchott", 50);

// Search by keyword
const results = await posts.search("apartment", 50);
```

### User Saved Posts

```javascript
// Save a post
await favorites.add(userId, postId);

// Get all saved posts
const saved = await favorites.get(userId);

// Check if saved
const isSaved = await favorites.isFavorite(userId, postId);

// Remove from saved
await favorites.remove(userId, postId);
```

---

**Last Updated**: November 2025
**App Version**: Ejar v1.0.0
