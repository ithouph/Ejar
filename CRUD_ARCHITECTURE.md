# EJAR APP - CRUD ARCHITECTURE GUIDE

## Overview
All database operations are in `services/database.js` organized by feature. Each feature exports an object with CRUD functions.

---

## 1. POSTS CRUD (Home Feed / Discover)

### Location: `services/database.js` - Line ~760

### Functions:

#### **Read Operations**
```javascript
// Get all posts with filters
posts.getAll(filters = {}, limit = 50)
  - Returns: Array of posts
  - Filters: category, minPrice, maxPrice, listingType, propertyType, search
  - Used in: Discover.js (home screen)
  
Example:
const posts = await posts.getAll({ category: "property", minPrice: 100, maxPrice: 5000 });

// Get single post by ID
posts.getOne(id)
  - Returns: One post object
  - Used in: Details.js (detail screen)
  
Example:
const post = await posts.getOne("post-id-123");

// Get user's own posts
posts.getByUser(userId)
  - Returns: Array of user's posts
  - Used in: Account.js (user profile)
  
Example:
const myPosts = await posts.getByUser(currentUserId);
```

#### **Create Operation**
```javascript
posts.create(userId, post)
  - Parameters: userId, { title, description, images, price, location, category, ... }
  - Returns: Created post object
  - Used in: AddPost.js
  
Example:
const newPost = await posts.create(userId, {
  title: "iPhone 14",
  description: "Like new condition",
  price: 800,
  location: "Downtown",
  category: "electronics",
  images: ["url1", "url2"]
});
```

#### **Update Operation**
```javascript
posts.update(postId, userId, updates)
  - Parameters: postId, userId, { title, description, price, ... }
  - Returns: Updated post object
  - Used in: EditPost.js
  
Example:
const updated = await posts.update(postId, userId, { price: 750 });
```

#### **Delete Operation**
```javascript
posts.delete(postId, userId)
  - Parameters: postId, userId
  - Returns: Boolean (success/failure)
  - Used in: Details.js (delete button)
  
Example:
const success = await posts.delete(postId, userId);
if (success) console.log("Post deleted");
```

---

## 2. HOME/DISCOVER PAGE CRUD

### Location: `pages/Discover.js` - Line ~108

### How it works:

```javascript
// Step 1: Load data on screen mount
useEffect(() => {
  loadData();
}, [user, selectedCategory, priceRange]);

// Step 2: Build filters from UI selections
const filters = {
  category: selectedCategory,     // User selected category
  minPrice: priceRange[0],        // From price slider
  maxPrice: priceRange[1],        // From price slider
  search: searchQuery             // From search input
};

// Step 3: Call posts.getAll() with filters
const postsData = await postsApi.getAll(filters);

// Step 4: Save to state and render
setPosts(postsData);

// Step 5: Load favorite IDs
const favoriteIds = await savedPostsApi.getIds(user.id);
setFavorites(favoriteIds);
```

### Flow Diagram:
```
Discover Screen
    ↓
User selects filters (category, price, search)
    ↓
loadData() called
    ↓
postsApi.getAll(filters) → Supabase query
    ↓
Returns array of posts
    ↓
setPosts(data) → FlatList renders posts
    ↓
User taps post → Navigate to Details.js
```

---

## 3. SETTINGS/PROFILE CRUD

### Location: `services/database.js` - Line ~113

### Functions:

#### **User Data CRUD**
```javascript
// Read user info
users.getUser(userId)
  - Returns: { id, email, full_name, photo_url, ... }
  - Used in: EditProfile.js
  
Example:
const user = await users.getUser(userId);

// Update user info
users.updateUser(userId, { full_name, photo_url })
  - Returns: Updated user object
  - Used in: EditProfile.js (save button)
  
Example:
await users.updateUser(userId, { full_name: "Ahmed Ali" });

// Upload profile picture
users.uploadProfilePicture(userId, imageUri)
  - Returns: Public URL of uploaded image
  - Used in: EditProfile.js (change photo)
  
Example:
const photoUrl = await users.uploadProfilePicture(userId, selectedImageUri);
```

#### **User Profile CRUD**
```javascript
// Read full profile
users.getProfile(userId)
  - Returns: { mobile, date_of_birth, gender, ... }
  - Used in: EditProfile.js
  
Example:
const profile = await users.getProfile(userId);

// Create initial profile
users.createProfile(userId, profile)
  - Used in: First time setup

// Update profile
users.updateProfile(userId, profile)
  - Used in: EditProfile.js
  
Example:
await users.updateProfile(userId, {
  mobile: "+222123456789",
  date_of_birth: "1990-01-01"
});
```

### EditProfile.js Flow:
```
EditProfile Screen
    ↓
useEffect() → Load current user data
    ↓
users.getUser() → Get current name, email
    ↓
users.getProfile() → Get additional info
    ↓
Display form with current values
    ↓
User edits fields
    ↓
User taps "Save"
    ↓
users.updateUser() + users.updateProfile()
    ↓
Success message → Navigate back
```

---

## 4. FAVORITES/SAVED POSTS CRUD

### Location: `services/database.js` - Line ~301

### Functions:

```javascript
// Get all saved posts
savedPosts.getAll(userId)
  - Returns: Array of saved posts
  - Used in: Saved.js

// Add to saved
savedPosts.add(userId, postId)
  - Used in: HotelCard.js (save button)

// Remove from saved
savedPosts.remove(userId, postId)
  - Used in: Saved.js (unsave button)

// Check if saved
savedPosts.isFavorite(userId, postId)
  - Returns: Boolean
  - Used in: HotelCard.js (highlight save button)

// Toggle save
savedPosts.toggle(userId, postId)
  - Used in: HotelCard.js (single tap)
```

### HotelCard Save Button Flow:
```
Card Pressed → onPressSave()
    ↓
Check: isFavorite(userId, postId)?
    ↓
If saved: remove() → Update UI
If not saved: add() → Update UI
    ↓
Button changes color/icon
```

---

## 5. WALLET/BALANCE CRUD

### Location: `services/database.js` - Line ~545

### Functions:

```javascript
// Get wallet balance
wallet.getBalance(userId)
  - Returns: { balance, currency }
  - Used in: Balance.js

// Add money
wallet.addBalance(userId, amount)
  - Used in: AddBalance.js

// Get transaction history
wallet.getTransactions(walletId, limit = 50)
  - Returns: Array of transactions
  - Used in: Balance.js (transaction list)

// Create transaction
wallet.createTransaction(walletId, type, amount, description)
  - type: "credit" | "debit"
  - Used internally after wallet changes
```

### AddBalance.js Flow:
```
AddBalance Screen
    ↓
User enters amount
    ↓
User uploads proof/payment screenshot
    ↓
User taps "Submit"
    ↓
balanceRequests.create() → Create request (status: pending)
    ↓
Admin reviews (Admin Dashboard)
    ↓
Admin approves → wallet.addBalance()
    ↓
Transaction recorded → User sees balance updated
```

---

## 6. REVIEWS CRUD

### Location: `services/database.js` - Line ~388

### Functions:

```javascript
// Get all reviews for a post
reviews.getForProperty(postId)
  - Returns: Array of reviews
  - Used in: Details.js

// Get user's own reviews
reviews.getByUser(userId)
  - Returns: Array of user's reviews

// Add review
reviews.add(userId, postId, { rating, comment })
  - Used in: ReviewModal.js

// Update review
reviews.update(reviewId, userId, updates)

// Delete review
reviews.delete(reviewId, userId)
```

---

## QUICK REFERENCE - WHICH CRUD WHERE?

| Feature | Create | Read | Update | Delete | Used In |
|---------|--------|------|--------|--------|---------|
| Posts | AddPost.js | Discover.js | EditPost.js | Details.js | posts.* |
| Profile | Setup | EditProfile.js | EditProfile.js | - | users.* |
| Favorites | HotelCard.js | Saved.js | - | Saved.js | savedPosts.* |
| Wallet | AddBalance.js | Balance.js | - | - | wallet.* |
| Reviews | Details.js | Details.js | ReviewModal.js | ReviewModal.js | reviews.* |

---

## ERROR HANDLING PATTERN

All functions return data or throw errors:

```javascript
// Usage pattern
try {
  const data = await someFunction();
  // Use data
} catch (error) {
  Alert.alert("Error", error.message);
}
```

If Supabase fails → Mock data is returned automatically (for development).

---

## DATABASE FALLBACK SYSTEM

If Supabase query fails:
1. ❌ Real database error
2. ↓
3. ✅ Mock data from `services/mockData.js` is returned
4. ↓
5. 📱 App displays mock data (app still works!)

This keeps the app functional even if backend is slow/down.
