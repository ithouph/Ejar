# EJAR App - Setup Instructions

## Database Setup

### Step 1: Create Database Tables
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `DATABASE_SETUP_CLEAN.sql`
4. Execute the script to create all tables with proper schema

### Step 2: Insert Dummy Data (Optional - for testing)
1. Go to SQL Editor in Supabase
2. Copy and paste the contents of `DATABASE_SEEDS.sql`
3. Execute to populate with test data
4. You'll have 5 test users, 10 posts, and sample reviews/transactions

### Test Credentials
When using dummy data, login with these phone numbers:
- `+222 12 345 678` (Ahmed Mohamed)
- `+222 87 654 321` (Fatima Ali)
- `+222 98 765 432` (Mohammed Hassan)
- `+222 56 789 012` (Noor Ibrahim)
- `+222 89 876 543` (Sara Omar)

OTP: Any 4 digits (app is in demo mode)

## Project Structure

```
ejar-replit/
├── pages/                  # Screen components
│   ├── Login.js           # Phone + OTP login
│   ├── EditProfile.js     # User profile (name, age, photo, WhatsApp)
│   ├── Discover.js        # Home feed with posts & filters
│   ├── Details.js         # Post details & reviews
│   ├── Saved.js           # Saved posts
│   ├── Balance.js         # Wallet management
│   ├── Account.js         # User account settings
│   └── ...
│
├── services/
│   ├── database.js        # All CRUD operations (posts, users, reviews, wallet, etc.)
│   └── mockData.js        # Fallback mock data if Supabase fails
│
├── components/            # Reusable UI components
│   ├── Card.js           # Post/item cards
│   ├── Button.js         # Custom buttons
│   ├── ThemedText.js     # Themed text component
│   └── ...
│
├── contexts/
│   └── AuthContext.js    # Auth state management
│
├── theme/
│   └── global.js         # Colors, spacing, styles
│
├── DATABASE_SETUP_CLEAN.sql   # Database schema
└── DATABASE_SEEDS.sql         # Dummy data

```

## Key Features Implemented

✅ **Phone OTP Authentication**
- Login/signup with phone number
- OTP verification (demo mode - no SMS required)
- User profiles with first name, last name, age, photo, WhatsApp

✅ **Marketplace Features**
- Create posts (buy/sell/rent items)
- Browse posts with category filters
- Save favorite posts
- Post reviews and ratings

✅ **User Profiles**
- Profile photo upload
- First name, last name, age
- WhatsApp contact number
- Wallet balance management

✅ **Categories**
- Property (apartments, houses, land)
- Electronics (phones, computers)
- Vehicles (cars, motorcycles)
- Furniture (home items)
- Fashion (clothing, accessories)

✅ **Wallet System**
- Balance management
- Transaction history
- Payment requests (admin review)

## Database Functions (CRUD)

### Posts
```javascript
posts.create(userId, postData)      // Create new post
posts.getAll(filters)               // Get all posts with filtering
posts.getOne(postId)                // Get single post
posts.update(postId, userId, data)  // Update post
posts.delete(postId, userId)        // Delete post
```

### Users
```javascript
auth.verifyPhoneOTP(phone, otp, userInfo)  // Login/signup with phone
users.getUser(userId)               // Get user info
users.updateUser(userId, updates)   // Update profile (name, age, photo)
users.uploadProfilePicture(userId, imageUri)  // Upload profile photo
```

### Reviews
```javascript
reviews.getForProperty(postId)      // Get all reviews for a post
reviews.add(userId, postId, review) // Add new review
reviews.update(reviewId, updates)   // Update review
reviews.delete(reviewId)            // Delete review
```

### Saved Posts (Favorites)
```javascript
savedPosts.getAll(userId)           // Get user's saved posts
savedPosts.add(userId, postId)      // Save a post
savedPosts.remove(userId, postId)   // Unsave a post
```

### Wallet
```javascript
wallet.getBalance(userId)           // Get wallet balance
wallet.addBalance(userId, amount)   // Add money to wallet
wallet.getTransactions(walletId)    // Get transaction history
```

## Deployment

The app is ready to deploy. Run:
```bash
npm run dev
```

Then scan the QR code in Replit to test on your phone via Expo Go.

## Important Notes

- **Phone Number**: Used as unique identifier for login (no email required)
- **Dummy Data**: Uses valid image URLs from Unsplash (no local files needed)
- **Fallback System**: If Supabase is down, app automatically uses mock data
- **Production SMS**: Replace OTP generation with Twilio/AWS SNS for real SMS
- **Images**: All images are stored in Supabase Storage bucket (avatars, post images)

## Troubleshooting

### No posts showing
1. Check if posts table has data in Supabase
2. If empty, run DATABASE_SEEDS.sql
3. If still empty, app will show mock data

### Login not working
1. Verify users table exists in Supabase
2. Check phone number format (digits only)
3. OTP is any 4 digits in demo mode

### Profile photo not uploading
1. Ensure avatars storage bucket exists in Supabase
2. Check storage permissions are public
3. Verify file is valid JPEG

## Next Steps

1. **SMS Integration**: Add Twilio or AWS SNS for real OTP delivery
2. **Payments**: Integrate payment provider (Stripe, PayPal) for balance topup
3. **Notifications**: Add push notifications for new messages/reviews
4. **Admin Dashboard**: Build admin panel for payment approval
5. **Search Optimization**: Add full-text search for better discovery
