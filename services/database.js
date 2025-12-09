import { supabase } from '../config/supabase';
import * as ImagePicker from 'expo-image-picker';

/**
 * ════════════════════════════════════════════════════════════════════
 * EJAR APP - ALL DATABASE FUNCTIONS IN ONE FILE
 * ════════════════════════════════════════════════════════════════════
 * 
 * 4-Tier User System with City-Based Payment Approvals
 * 
 * TABLE OF CONTENTS:
 * 1. Authentication (Phone OTP)
 * 2. Users & Profiles
 * 3. Cities
 * 4. Service Categories
 * 5. Posts (Marketplace)
 * 6. Saved Posts (Favorites)
 * 7. Reviews
 * 8. Wallet & Transactions
 * 9. Notifications
 * 10. Utility Functions
 */

// ════════════════════════════════════════════════════════════════════
// 1. AUTHENTICATION (Phone OTP)
// ════════════════════════════════════════════════════════════════════

export const auth = {
  // Send OTP to phone number
  async sendOtp(phone) {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: phone,
    });

    if (error) throw error;
    return data;
  },

  // Verify OTP
  async verifyOtp(phone, token) {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phone,
      token: token,
      type: 'sms',
    });

    if (error) throw error;
    return { user: data.user, session: data.session };
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current logged in user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return null;
    return user;
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) return null;
    return session;
  },

  // Listen for auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  },
};

// ════════════════════════════════════════════════════════════════════
// 2. USERS & PROFILES
// ════════════════════════════════════════════════════════════════════

export const users = {
  // Get user info
  async getUser(userId) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        cities (id, name, region)
      `)
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // Get user by phone
  async getByPhone(phone) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        cities (id, name, region)
      `)
      .eq('phone', phone)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // Create new user (uses upsert to handle existing users)
  async createUser(userData) {
    const insertData = {
      id: userData.id,
      phone: userData.phone,
      whatsapp_number: userData.whatsapp_number || userData.phone,
      first_name: userData.first_name,
      last_name: userData.last_name,
      city_id: userData.city_id,
      role: 'normal',
    };
    
    // Only include profile_photo_url if it's a valid string
    if (userData.profile_photo_url && typeof userData.profile_photo_url === 'string') {
      insertData.profile_photo_url = userData.profile_photo_url;
    }

    const { data, error } = await supabase
      .from('users')
      .upsert(insertData, { onConflict: 'id' })
      .select(`
        *,
        cities (id, name, region)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Update user info
  async updateUser(userId, updates) {
    const updateData = {
      updated_at: new Date().toISOString(),
    };

    if (updates.first_name !== undefined) updateData.first_name = updates.first_name;
    if (updates.last_name !== undefined) updateData.last_name = updates.last_name;
    if (updates.whatsapp_number !== undefined) updateData.whatsapp_number = updates.whatsapp_number;
    if (updates.city_id !== undefined) updateData.city_id = updates.city_id;
    if (updates.profile_photo_url !== undefined) updateData.profile_photo_url = updates.profile_photo_url;

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select(`
        *,
        cities (id, name, region)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Upload profile picture
  async uploadProfilePicture(userId, imageUri) {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const fileName = `${userId}_${Date.now()}.jpg`;
    const filePath = `profile-pictures/${fileName}`;

    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, blob, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  // Get user's full name
  getFullName(user) {
    if (!user) return 'Anonymous User';
    return `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Anonymous User';
  },
};

// ════════════════════════════════════════════════════════════════════
// 3. CITIES
// ════════════════════════════════════════════════════════════════════

export const cities = {
  // Get all active cities
  async getAll() {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data || [];
  },

  // Get city by ID
  async getById(cityId) {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('id', cityId)
      .single();

    if (error) throw error;
    return data;
  },

  // Get city by name
  async getByName(name) {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .ilike('name', name)
      .maybeSingle();

    if (error) throw error;
    return data;
  },
};

// ════════════════════════════════════════════════════════════════════
// 4. SERVICE CATEGORIES
// ════════════════════════════════════════════════════════════════════

export const serviceCategories = {
  // Get all categories
  async getAll() {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  // Get category by ID
  async getById(categoryId) {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .eq('id', categoryId)
      .single();

    if (error) throw error;
    return data;
  },

  // Get category by type
  async getByType(type) {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .eq('type', type);

    if (error) throw error;
    return data || [];
  },
};

// ════════════════════════════════════════════════════════════════════
// 5. POSTS (Marketplace)
// ════════════════════════════════════════════════════════════════════

export const posts = {
  // Get all posts with optional filters
  async getAll(filters = {}, limit = 50) {
    let query = supabase
      .from('posts')
      .select(`
        *,
        users (id, first_name, last_name, profile_photo_url, whatsapp_number),
        cities (id, name, region),
        service_categories (id, name, type)
      `)
      .eq('status', 'active')
      .eq('paid', true);

    // Apply category filter
    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }

    // Apply city filter
    if (filters.cityId) {
      query = query.eq('city_id', filters.cityId);
    }

    // Apply price range filter
    if (filters.minPrice !== undefined && filters.minPrice !== null) {
      query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
      query = query.lte('price', filters.maxPrice);
    }

    // Apply search query (title, description)
    if (filters.search && filters.search.trim()) {
      const searchTerm = `%${filters.search.trim()}%`;
      query = query.or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`);
    }

    query = query
      .order('created_at', { ascending: false })
      .limit(limit);

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map(post => formatPost(post));
  },

  // Get post by ID
  async getById(postId) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users (id, first_name, last_name, profile_photo_url, whatsapp_number),
        cities (id, name, region),
        service_categories (id, name, type)
      `)
      .eq('id', postId)
      .single();

    if (error) throw error;
    return formatPost(data);
  },

  // Get user's posts
  async getByUser(userId) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users (id, first_name, last_name, profile_photo_url, whatsapp_number),
        cities (id, name, region),
        service_categories (id, name, type)
      `)
      .eq('user_id', userId)
      .neq('status', 'deleted')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(post => formatPost(post));
  },

  // Create new post
  async create(userId, cityId, post) {
    if (!post.title || !post.title.trim()) {
      throw new Error('Post title is required');
    }

    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        city_id: cityId,
        category_id: post.category_id || null,
        title: post.title.trim(),
        description: post.description || '',
        price: post.price || 0,
        images: post.images || [],
        paid: post.was_free_post || false,
        was_free_post: post.was_free_post || false,
        status: post.was_free_post ? 'active' : 'pending_payment',
      })
      .select(`
        *,
        users (id, first_name, last_name, profile_photo_url, whatsapp_number),
        cities (id, name, region),
        service_categories (id, name, type)
      `)
      .single();

    if (error) throw error;

    // Update user's post counts
    if (post.was_free_post) {
      await supabase.rpc('decrement_free_posts', { p_user_id: userId }).catch(() => {});
    }

    return formatPost(data);
  },

  // Update post
  async update(postId, userId, updates) {
    const updateData = {
      updated_at: new Date().toISOString(),
    };

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.images !== undefined) updateData.images = updates.images;
    if (updates.category_id !== undefined) updateData.category_id = updates.category_id;

    const { data, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', postId)
      .eq('user_id', userId)
      .select(`
        *,
        users (id, first_name, last_name, profile_photo_url, whatsapp_number),
        cities (id, name, region),
        service_categories (id, name, type)
      `)
      .single();

    if (error) throw error;
    return formatPost(data);
  },

  // Delete post (soft delete)
  async delete(postId, userId) {
    const { error } = await supabase
      .from('posts')
      .update({
        status: 'deleted',
        deleted_at: new Date().toISOString(),
      })
      .eq('id', postId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  },

  // End post listing
  async end(postId, userId) {
    const { error } = await supabase
      .from('posts')
      .update({
        status: 'ended',
        ended_at: new Date().toISOString(),
      })
      .eq('id', postId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  },

  // Upload post images
  async uploadImages(userId, imageUris) {
    const uploadedUrls = [];

    for (const uri of imageUris) {
      const response = await fetch(uri);
      const blob = await response.blob();

      const fileName = `${userId}_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
      const filePath = `post-images/${fileName}`;

      const { error } = await supabase.storage
        .from('posts')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (!error) {
        const { data: { publicUrl } } = supabase.storage
          .from('posts')
          .getPublicUrl(filePath);
        uploadedUrls.push(publicUrl);
      }
    }

    return uploadedUrls;
  },

  // Pick images from device
  async pickImages(maxImages = 5) {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      throw new Error('Permission to access camera roll is required');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: maxImages,
    });

    if (!result.canceled && result.assets) {
      return result.assets.map(asset => asset.uri);
    }

    return [];
  },
};

// ════════════════════════════════════════════════════════════════════
// 6. SAVED POSTS (Favorites)
// ════════════════════════════════════════════════════════════════════

export const savedPosts = {
  // Get all saved posts for a user
  async getAll(userId) {
    const { data, error } = await supabase
      .from('saved_posts')
      .select(`
        *,
        posts (
          *,
          users (id, first_name, last_name, profile_photo_url, whatsapp_number),
          cities (id, name, region),
          service_categories (id, name, type)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || [])
      .filter(item => item.posts && item.posts.status === 'active')
      .map(item => formatPost(item.posts));
  },

  // Get array of saved post IDs for a user
  async getIds(userId) {
    const { data, error } = await supabase
      .from('saved_posts')
      .select('post_id')
      .eq('user_id', userId);

    if (error) return [];
    return (data || []).map(item => item.post_id);
  },

  // Check if a post is saved
  async isSaved(userId, postId) {
    const { data, error } = await supabase
      .from('saved_posts')
      .select('user_id')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .maybeSingle();

    if (error) return false;
    return !!data;
  },

  // Toggle save/unsave a post
  async toggle(userId, postId) {
    const isSaved = await this.isSaved(userId, postId);

    if (isSaved) {
      const { error } = await supabase
        .from('saved_posts')
        .delete()
        .eq('user_id', userId)
        .eq('post_id', postId);

      if (error) throw error;
      return false;
    } else {
      const { error } = await supabase
        .from('saved_posts')
        .insert({
          user_id: userId,
          post_id: postId,
        });

      if (error) throw error;
      return true;
    }
  },
};

// ════════════════════════════════════════════════════════════════════
// 7. REVIEWS
// ════════════════════════════════════════════════════════════════════

export const reviews = {
  // Get all reviews for a post
  async getForPost(postId) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        users (id, first_name, last_name, profile_photo_url)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(review => formatReview(review));
  },

  // Get all reviews by a user
  async getByUser(userId) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        posts (id, title, images)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Add a new review
  async add(userId, postId, review) {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        user_id: userId,
        post_id: postId,
        rating: review.rating,
        comment: review.comment,
      })
      .select(`
        *,
        users (id, first_name, last_name, profile_photo_url)
      `)
      .single();

    if (error) throw error;
    return formatReview(data);
  },

  // Update existing review
  async update(reviewId, userId, updates) {
    const { data, error } = await supabase
      .from('reviews')
      .update({
        rating: updates.rating,
        comment: updates.comment,
        updated_at: new Date().toISOString(),
      })
      .eq('id', reviewId)
      .eq('user_id', userId)
      .select(`
        *,
        users (id, first_name, last_name, profile_photo_url)
      `)
      .single();

    if (error) throw error;
    return formatReview(data);
  },

  // Delete review
  async delete(reviewId, userId) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  },
};

// ════════════════════════════════════════════════════════════════════
// 8. WALLET & TRANSACTIONS
// ════════════════════════════════════════════════════════════════════

export const wallet = {
  // Get user's wallet balance (from users table)
  async getBalance(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('wallet_balance_mru, free_posts_remaining')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return {
      balance: parseFloat(data.wallet_balance_mru) || 0,
      freePostsRemaining: data.free_posts_remaining || 0,
    };
  },

  // Get transaction history
  async getTransactions(userId, limit = 50) {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select(`
        *,
        cities (id, name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []).map(tx => formatTransaction(tx));
  },

  // Create deposit request (with screenshot)
  async createDepositRequest(userId, cityId, amount, paymentMethod, screenshotUri) {
    // Upload screenshot
    let screenshotUrl = null;
    if (screenshotUri) {
      const response = await fetch(screenshotUri);
      const blob = await response.blob();
      const fileName = `${userId}_${Date.now()}.jpg`;
      const filePath = `payment-screenshots/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('transactions')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('transactions')
          .getPublicUrl(filePath);
        screenshotUrl = publicUrl;
      }
    }

    // Get current balance
    const { balance } = await this.getBalance(userId);

    // Create pending transaction
    const { data, error } = await supabase
      .from('wallet_transactions')
      .insert({
        user_id: userId,
        city_id: cityId,
        type: 'deposit',
        amount_mru: amount,
        balance_before_mru: balance,
        balance_after_mru: balance,
        payment_screenshot_url: screenshotUrl,
        payment_method: paymentMethod,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return formatTransaction(data);
  },

  // Get pending transactions for user
  async getPendingTransactions(userId) {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(tx => formatTransaction(tx));
  },
};

// ════════════════════════════════════════════════════════════════════
// 9. NOTIFICATIONS
// ════════════════════════════════════════════════════════════════════

export const notifications = {
  // Get user's notifications
  async getAll(userId, limit = 50) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // Get unread count
  async getUnreadCount(userId) {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) return 0;
    return count || 0;
  },

  // Mark notification as read
  async markAsRead(notificationId, userId) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  },

  // Mark all as read
  async markAllAsRead(userId) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
    return true;
  },
};

// ════════════════════════════════════════════════════════════════════
// 10. UTILITY FUNCTIONS
// ════════════════════════════════════════════════════════════════════

// Format time to "2h ago", "5d ago", etc.
function formatTimeAgo(dateString) {
  if (!dateString) return '';
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return past.toLocaleDateString();
}

// Format post data for frontend
function formatPost(post) {
  if (!post) return null;
  
  return {
    id: post.id,
    displayId: post.display_id,
    userId: post.user_id,
    userName: post.users ? `${post.users.first_name || ''} ${post.users.last_name || ''}`.trim() : 'Anonymous User',
    userPhoto: post.users?.profile_photo_url || 'https://via.placeholder.com/40',
    userWhatsapp: post.users?.whatsapp_number,
    title: post.title,
    description: post.description,
    price: post.price,
    images: post.images || [],
    image: post.images?.[0] || 'https://via.placeholder.com/300',
    cityId: post.city_id,
    cityName: post.cities?.name || 'Unknown',
    categoryId: post.category_id,
    categoryName: post.service_categories?.name || 'Other',
    categoryType: post.service_categories?.type,
    status: post.status,
    paid: post.paid,
    wasFreePost: post.was_free_post,
    totalFavorites: post.total_favorites || 0,
    timeAgo: formatTimeAgo(post.created_at),
    createdAt: post.created_at,
    updatedAt: post.updated_at,
  };
}

// Format review data for frontend
function formatReview(review) {
  if (!review) return null;
  
  return {
    id: review.id,
    userId: review.user_id,
    userName: review.users ? `${review.users.first_name || ''} ${review.users.last_name || ''}`.trim() : 'Anonymous User',
    userPhoto: review.users?.profile_photo_url || 'https://via.placeholder.com/40',
    postId: review.post_id,
    rating: review.rating,
    comment: review.comment,
    timeAgo: formatTimeAgo(review.created_at),
    createdAt: review.created_at,
  };
}

// Format transaction data for frontend
function formatTransaction(tx) {
  if (!tx) return null;
  
  const typeLabels = {
    'deposit': 'Deposit',
    'post_payment': 'Post Payment',
    'approval_reward': 'Approval Reward',
    'ex_member_subscription': 'Subscription',
    'report_penalty': 'Penalty',
    'refund': 'Refund',
  };

  const statusLabels = {
    'pending': 'Pending',
    'approved': 'Approved',
    'rejected': 'Rejected',
    'assigned_to_leader': 'Under Review',
  };

  return {
    id: tx.id,
    userId: tx.user_id,
    type: tx.type,
    typeLabel: typeLabels[tx.type] || tx.type,
    amount: parseFloat(tx.amount_mru) || 0,
    balanceBefore: parseFloat(tx.balance_before_mru) || 0,
    balanceAfter: parseFloat(tx.balance_after_mru) || 0,
    status: tx.status,
    statusLabel: statusLabels[tx.status] || tx.status,
    paymentMethod: tx.payment_method,
    screenshotUrl: tx.payment_screenshot_url,
    rejectionReason: tx.rejection_reason,
    timeAgo: formatTimeAgo(tx.created_at),
    createdAt: tx.created_at,
    approvedAt: tx.approved_at,
  };
}

// Pick single image from device
export async function pickImage() {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== 'granted') {
    throw new Error('Permission to access media library denied');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (result.canceled) {
    return null;
  }

  return result.assets[0].uri;
}

// ════════════════════════════════════════════════════════════════════
// EXPORT ALL (for backward compatibility)
// ════════════════════════════════════════════════════════════════════

export const db = {
  auth,
  users,
  cities,
  serviceCategories,
  posts,
  savedPosts,
  reviews,
  wallet,
  notifications,
};

export default db;
