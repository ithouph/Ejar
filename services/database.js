import { supabase } from "../config/supabase";
import * as WebBrowser from "expo-web-browser";
import * as ImagePicker from "expo-image-picker";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

/**
 * ════════════════════════════════════════════════════════════════════
 * EJAR APP - ALL DATABASE FUNCTIONS IN ONE FILE
 * ════════════════════════════════════════════════════════════════════
 *
 * This file contains all backend functions organized by feature.
 * Easy to find what you need and make changes.
 *
 * TABLE OF CONTENTS:
 * 1. Authentication (Google OAuth, sign in/out, sessions)
 * 2. Users & Profiles (user info, profile details)
 * 3. Properties (hotels & apartments listing)
 * 4. Favorites (save/unsave properties)
 * 5. Reviews (property ratings & comments)
 * 6. Wallet & Balance (money management)
 * 7. Balance Requests (top-up approval system)
 * 8. Social Posts (feed & sharing)
 * 9. Wedding Events (event planning)
 * 10. Utility Functions (helpers)
 */

// ════════════════════════════════════════════════════════════════════
// 1. AUTHENTICATION
// ════════════════════════════════════════════════════════════════════

export const auth = {
  // Sign in with Google
  async signInWithGoogle() {
    const redirectUrl = makeRedirectUri({
      scheme: "com.ejar.app",
      path: "auth/callback",
    });
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectUrl, skipBrowserRedirect: false },
    });

    if (error) throw error;

    if (data?.url) {
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl,
      );

      if (result.type === "success") {
        const url = new URL(result.url);
        const accessToken = url.searchParams.get("access_token");
        const refreshToken = url.searchParams.get("refresh_token");

        if (accessToken && refreshToken) {
          const { data: sessionData, error: sessionError } =
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

          if (sessionError) throw sessionError;
          return { user: sessionData.user, session: sessionData.session };
        }
      }
    }

    throw new Error("Authentication failed");
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current logged in user
  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) return null;
    return user;
  },

  // Get current session
  async getSession() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
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
  // Get user info (name, email, photo)
  async getUser(userId) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // Update user info (name, photo)
  async updateUser(userId, updates) {
    const { data, error } = await supabase
      .from("users")
      .update({
        full_name: updates.full_name,
        photo_url: updates.photo_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user profile (birthday, gender, mobile, weight, height)
  async getProfile(userId) {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // Create user profile
  async createProfile(userId, profile) {
    const { data, error } = await supabase
      .from("user_profiles")
      .insert({
        user_id: userId,
        date_of_birth: profile.date_of_birth,
        gender: profile.gender,
        mobile: profile.mobile,
        whatsapp: profile.whatsapp,
        weight: profile.weight,
        height: profile.height,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update user profile
  async updateProfile(userId, profile) {
    const { data, error } = await supabase
      .from("user_profiles")
      .update({
        date_of_birth: profile.date_of_birth,
        gender: profile.gender,
        mobile: profile.mobile,
        whatsapp: profile.whatsapp,
        weight: profile.weight,
        height: profile.height,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
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
      .from("avatars")
      .upload(filePath, blob, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    return publicUrl;
  },
};

// ════════════════════════════════════════════════════════════════════
// 3. PROPERTIES (Hotels & Apartments)
// ════════════════════════════════════════════════════════════════════

export const properties = {
  // Get all properties with optional filters
  async getAll(filters = {}) {
    let query = supabase
      .from("properties")
      .select(
        `
        *,
        property_photos (url, category, order_index),
        amenities (name, icon)
      `,
      )
      .order("created_at", { ascending: false });

    // Apply filters
    if (filters.type) query = query.eq("type", filters.type);
    if (filters.location)
      query = query.ilike("location", `%${filters.location}%`);
    if (filters.minPrice)
      query = query.gte("price_per_night", filters.minPrice);
    if (filters.maxPrice)
      query = query.lte("price_per_night", filters.maxPrice);
    if (filters.minRating) query = query.gte("rating", filters.minRating);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Get one property by ID
  async getOne(id) {
    const { data, error } = await supabase
      .from("properties")
      .select(
        `
        *,
        property_photos (url, category, order_index),
        amenities (name, icon),
        reviews (
          id,
          rating,
          title,
          comment,
          created_at,
          users (full_name, photo_url)
        )
      `,
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Search properties with optional filters
  async search(searchTerm, filters = {}) {
    let query = supabase
      .from("properties")
      .select(
        `
        *,
        property_photos (url, category, order_index),
        amenities (name, icon)
      `,
      )
      .or(
        `title.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`,
      );

    // Apply filters to search results
    if (filters.type) query = query.eq("type", filters.type);
    if (filters.location)
      query = query.ilike("location", `%${filters.location}%`);
    if (filters.minPrice)
      query = query.gte("price_per_night", filters.minPrice);
    if (filters.maxPrice)
      query = query.lte("price_per_night", filters.maxPrice);
    if (filters.minRating) query = query.gte("rating", filters.minRating);

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Get featured/top properties
  async getFeatured(limit = 10) {
    const { data, error } = await supabase
      .from("properties")
      .select(
        `
        *,
        property_photos (url, category, order_index),
        amenities (name, icon)
      `,
      )
      .gte("rating", 4.5)
      .order("rating", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },
};

// ════════════════════════════════════════════════════════════════════
// 4. FAVORITES (Save/Unsave Properties)
// ════════════════════════════════════════════════════════════════════

export const favorites = {
  // Get all user's favorites
  async getAll(userId) {
    const { data, error } = await supabase
      .from("favorites")
      .select(
        `
        id,
        property_id,
        created_at,
        properties (*)
      `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Add property to favorites
  async add(userId, propertyId) {
    const { data, error } = await supabase
      .from("favorites")
      .insert({ user_id: userId, property_id: propertyId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Remove property from favorites
  async remove(userId, propertyId) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("property_id", propertyId);

    if (error) throw error;
    return true;
  },

  // Check if property is favorited
  async isFavorite(userId, propertyId) {
    const { data, error } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("property_id", propertyId)
      .maybeSingle();

    if (error) return false;
    return !!data;
  },

  // Toggle favorite (add if not exists, remove if exists)
  async toggle(userId, propertyId) {
    const isFav = await this.isFavorite(userId, propertyId);

    if (isFav) {
      await this.remove(userId, propertyId);
      return { action: "removed", isFavorite: false };
    } else {
      await this.add(userId, propertyId);
      return { action: "added", isFavorite: true };
    }
  },

  // Get just the IDs of favorited properties
  async getIds(userId) {
    const { data, error } = await supabase
      .from("favorites")
      .select("property_id")
      .eq("user_id", userId);

    if (error) return [];
    return (data || []).map((fav) => fav.property_id);
  },
};

// ════════════════════════════════════════════════════════════════════
// 5. REVIEWS (Property Ratings & Comments)
// ════════════════════════════════════════════════════════════════════

export const reviews = {
  // Get all reviews for a property
  async getForProperty(propertyId) {
    const { data, error } = await supabase
      .from("reviews")
      .select(
        `
        *,
        users (full_name, photo_url)
      `,
      )
      .eq("property_id", propertyId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get all reviews by a user
  async getByUser(userId) {
    const { data, error } = await supabase
      .from("reviews")
      .select(
        `
        *,
        properties (title, location)
      `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Add a new review
  async add(userId, propertyId, review) {
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        user_id: userId,
        property_id: propertyId,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
      })
      .select()
      .single();

    if (error) throw error;

    // Update property's average rating
    await this.updatePropertyRating(propertyId);

    return data;
  },

  // Update existing review
  async update(reviewId, userId, updates) {
    const { data, error } = await supabase
      .from("reviews")
      .update({
        rating: updates.rating,
        title: updates.title,
        comment: updates.comment,
        updated_at: new Date().toISOString(),
      })
      .eq("id", reviewId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;

    // Get property ID and update its rating
    const { data: review } = await supabase
      .from("reviews")
      .select("property_id")
      .eq("id", reviewId)
      .single();

    if (review) {
      await this.updatePropertyRating(review.property_id);
    }

    return data;
  },

  // Delete review
  async delete(reviewId, userId) {
    // Get property ID before deleting
    const { data: review } = await supabase
      .from("reviews")
      .select("property_id")
      .eq("id", reviewId)
      .eq("user_id", userId)
      .single();

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId)
      .eq("user_id", userId);

    if (error) throw error;

    // Update property rating
    if (review) {
      await this.updatePropertyRating(review.property_id);
    }

    return true;
  },

  // Update property's average rating (called automatically after review changes)
  async updatePropertyRating(propertyId) {
    const { data: allReviews, error: reviewsError } = await supabase
      .from("reviews")
      .select("rating")
      .eq("property_id", propertyId);

    if (reviewsError) return;

    if (allReviews && allReviews.length > 0) {
      const avgRating =
        allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

      await supabase
        .from("properties")
        .update({
          rating: avgRating.toFixed(1),
          total_reviews: allReviews.length,
        })
        .eq("id", propertyId);
    }
  },
};

// ════════════════════════════════════════════════════════════════════
// 6. WALLET & BALANCE (Money Management)
// ════════════════════════════════════════════════════════════════════

export const wallet = {
  // Get user's wallet
  async get(userId) {
    const { data, error } = await supabase
      .from("wallet_accounts")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;

    // Create wallet if doesn't exist
    if (!data) {
      try {
        return await this.create(userId);
      } catch (createError) {
        console.error("Error creating wallet:", createError);
        return null;
      }
    }

    return data;
  },

  // Create new wallet
  async create(userId) {
    const { data, error } = await supabase
      .from("wallet_accounts")
      .insert({
        user_id: userId,
        balance: 0,
        currency: "USD",
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get just the balance
  async getBalance(walletId) {
    const { data, error } = await supabase
      .from("wallet_accounts")
      .select("balance")
      .eq("id", walletId)
      .single();

    if (error) throw error;
    return parseFloat(data.balance);
  },

  // Get transaction history
  async getTransactions(walletId, limit = 50) {
    const { data, error } = await supabase
      .from("wallet_transactions")
      .select("*")
      .eq("wallet_id", walletId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // Add transaction (internal - uses Supabase function for safety)
  async addTransaction(walletId, transaction) {
    const { data, error } = await supabase.rpc("add_wallet_transaction", {
      p_wallet_id: walletId,
      p_type: transaction.type,
      p_amount: transaction.amount,
      p_description: transaction.description,
      p_category: transaction.category,
    });

    if (error) throw error;

    return {
      transaction: { id: data.transaction_id },
      newBalance: data.new_balance,
    };
  },

  // Add money to wallet
  async addBalance(walletId, amount, description = "Added balance") {
    return await this.addTransaction(walletId, {
      type: "credit",
      amount: parseFloat(amount),
      description,
      category: "deposit",
    });
  },

  // Remove money from wallet
  async deductBalance(walletId, amount, description = "Deducted balance") {
    return await this.addTransaction(walletId, {
      type: "debit",
      amount: parseFloat(amount),
      description,
      category: "withdrawal",
    });
  },
};

// ════════════════════════════════════════════════════════════════════
// 7. BALANCE REQUESTS (Top-up Approval System)
// ════════════════════════════════════════════════════════════════════

export const balanceRequests = {
  // Upload transaction proof image
  async uploadImage(userId, imageUri) {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const fileName = `${userId}_${Date.now()}.jpg`;
    const filePath = `transaction-proofs/${fileName}`;

    const { data, error } = await supabase.storage
      .from("balance-requests")
      .upload(filePath, blob, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("balance-requests").getPublicUrl(filePath);

    return publicUrl;
  },

  // Create new balance request
  async create(userId, walletId, amount, imageUri) {
    const imageUrl = await this.uploadImage(userId, imageUri);

    const { data, error } = await supabase
      .from("balance_requests")
      .insert({
        user_id: userId,
        wallet_id: walletId,
        amount: parseFloat(amount),
        transaction_image_url: imageUrl,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all user's requests
  async getAll(userId) {
    const { data, error } = await supabase
      .from("balance_requests")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) return [];
    return data || [];
  },

  // Get pending requests
  async getPending(userId) {
    const { data, error } = await supabase
      .from("balance_requests")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) return [];
    return data || [];
  },

  // Approve request (admin function)
  async approve(requestId, adminId, notes = "") {
    const { data, error } = await supabase
      .from("balance_requests")
      .update({
        status: "approved",
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
        admin_notes: notes,
      })
      .eq("id", requestId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Reject request (admin function)
  async reject(requestId, adminId, notes) {
    const { data, error } = await supabase
      .from("balance_requests")
      .update({
        status: "rejected",
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
        admin_notes: notes,
      })
      .eq("id", requestId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ════════════════════════════════════════════════════════════════════
// 8. SOCIAL POSTS (Feed & Sharing)
// ════════════════════════════════════════════════════════════════════

// Specification validation helper
function validateAndNormalizeSpecifications(
  category,
  listingType,
  propertyType,
  specifications,
) {
  const specs = { ...specifications };

  if (category === "property") {
    if (propertyType === "land") {
      if (!specs.land_size) {
        throw new Error(
          "Land properties must include land_size in specifications",
        );
      }
      specs.property_type = "land";
      delete specs.bedrooms;
      delete specs.bathrooms;
      delete specs.size_sqft;
    } else if (["house", "apartment"].includes(propertyType)) {
      if (listingType === "rent") {
        if (!specs.nearby_amenities) {
          specs.nearby_amenities = [];
        }
        if (!Array.isArray(specs.nearby_amenities)) {
          throw new Error("nearby_amenities must be an array");
        }
      }
      specs.property_type = propertyType;
    } else if (propertyType === "villa") {
      delete specs.nearby_amenities;
      specs.property_type = "villa";
    }
  }

  return specs;
}

export const posts = {
  // Get all posts with optional filters
  async getAll(filters = {}, limit = 50) {
    let query = supabase.from("posts").select(`
        *,
        users (full_name, photo_url)
      `);

    // Apply category filter
    if (filters.category && filters.category !== "all") {
      if (filters.category === "others") {
        // "Others" includes cars and laptops
        query = query.in("category", ["cars", "laptops"]);
      } else {
        query = query.eq("category", filters.category);
      }
    }

    // Apply price range filter
    if (filters.minPrice !== undefined && filters.minPrice !== null) {
      query = query.gte("price", filters.minPrice);
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
      query = query.lte("price", filters.maxPrice);
    }

    // Apply listing type filter (for property category)
    if (filters.listingType) {
      query = query.eq("listing_type", filters.listingType);
    }

    // Apply property type filter (for property category)
    if (filters.propertyType) {
      query = query.eq("property_type", filters.propertyType);
    }

    // Apply search query (title, content, location)
    if (filters.search && filters.search.trim()) {
      const searchTerm = `%${filters.search.trim()}%`;
      query = query.or(
        `title.ilike.${searchTerm},content.ilike.${searchTerm},location.ilike.${searchTerm}`,
      );
    }

    query = query.order("created_at", { ascending: false }).limit(limit);

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map((post) => ({
      id: post.id,
      userId: post.user_id,
      userName: post.users?.full_name || "Anonymous User",
      userPhoto: post.users?.photo_url || "https://via.placeholder.com/40",
      image: post.images?.[0] || post.image_url,
      images: post.images || (post.image_url ? [post.image_url] : []),
      text: post.content || post.description,
      title: post.title,
      location: post.location || "Location",
      timeAgo: formatTimeAgo(post.created_at),
      likes: post.likes_count || 0,
      comments: post.comments_count || 0,
      amenities: post.amenities || [],
      propertyType: post.property_type,
      price: post.price,
      listingType: post.listing_type,
      category: post.category,
      specifications: post.specifications || {},
      rating: post.rating,
      reviewText: post.review_text,
    }));
  },

  // Get user's posts
  async getByUser(userId) {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Create new post
  async create(userId, post) {
    if (!post.category) {
      throw new Error("Post category is required");
    }

    if (!post.title || !post.title.trim()) {
      throw new Error("Post title is required");
    }

    let listingType = post.listingType;
    if (post.category !== "property") {
      listingType = null;
    } else if (!listingType) {
      listingType = "rent";
    }

    const validatedSpecs = validateAndNormalizeSpecifications(
      post.category,
      listingType,
      post.propertyType,
      post.specifications || {},
    );

    const { data, error } = await supabase
      .from("posts")
      .insert({
        user_id: userId,
        title: post.title,
        content: post.description || post.content,
        description: post.description,
        images: post.images || [],
        image_url: post.images?.[0] || post.image_url,
        property_type: post.propertyType || null,
        price: post.price,
        location: post.location,
        amenities: post.amenities || [],
        specifications: validatedSpecs,
        listing_type: listingType,
        category: post.category,
        likes_count: 0,
        comments_count: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update post
  async update(postId, userId, updates) {
    const updateData = {
      updated_at: new Date().toISOString(),
    };

    if (updates.title !== undefined) {
      if (!updates.title || !updates.title.trim()) {
        throw new Error("Post title is required");
      }
      updateData.title = updates.title;
    }

    if (updates.content !== undefined) {
      updateData.content = updates.content;
    }

    if (updates.image_url !== undefined) {
      updateData.image_url = updates.image_url;
    }

    if (updates.images !== undefined) {
      updateData.images = updates.images;
    }

    if (updates.price !== undefined) {
      updateData.price = updates.price;
    }

    if (updates.location !== undefined) {
      updateData.location = updates.location;
    }

    if (updates.amenities !== undefined) {
      updateData.amenities = updates.amenities;
    }

    if (updates.specifications !== undefined && updates.category) {
      let listingType = updates.listingType;
      if (updates.category !== "property") {
        listingType = null;
      }

      updateData.specifications = validateAndNormalizeSpecifications(
        updates.category,
        listingType,
        updates.propertyType,
        updates.specifications,
      );
    } else if (updates.specifications !== undefined) {
      updateData.specifications = updates.specifications;
    }

    const { data, error } = await supabase
      .from("posts")
      .update(updateData)
      .eq("id", postId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete post
  async delete(postId, userId) {
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId)
      .eq("user_id", userId);

    if (error) throw error;
    return true;
  },

  // Like post
  async addLike(postId) {
    // Try to use RPC function first
    const { data, error } = await supabase.rpc("increment_post_likes", {
      post_id: postId,
    });

    if (error) {
      // Fallback to manual increment
      const { data: post } = await supabase
        .from("posts")
        .select("likes_count")
        .eq("id", postId)
        .single();

      if (post) {
        await supabase
          .from("posts")
          .update({ likes_count: post.likes_count + 1 })
          .eq("id", postId);
      }
    }
  },

  // Pick images from device
  async pickImages(maxImages = 5) {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      throw new Error("Permission to access camera roll is required");
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: maxImages,
    });

    if (!result.canceled && result.assets) {
      return result.assets.map((asset) => asset.uri);
    }

    return [];
  },
};

// ════════════════════════════════════════════════════════════════════
// 9. SAVED POSTS (User Saved Posts)
// ════════════════════════════════════════════════════════════════════

export const savedPosts = {
  // Get all saved posts for a user
  async getAll(userId) {
    const { data, error } = await supabase
      .from("saved_posts")
      .select(
        `
        *,
        posts (
          *,
          users (full_name, photo_url)
        )
      `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((item) => ({
      id: item.posts.id,
      userId: item.posts.user_id,
      userName: item.posts.users?.full_name || "Anonymous User",
      userPhoto:
        item.posts.users?.photo_url || "https://via.placeholder.com/40",
      image: item.posts.images?.[0] || item.posts.image_url,
      images:
        item.posts.images ||
        (item.posts.image_url ? [item.posts.image_url] : []),
      text: item.posts.content || item.posts.description,
      title: item.posts.title,
      location: item.posts.location || "Location",
      timeAgo: formatTimeAgo(item.posts.created_at),
      likes: item.posts.likes_count || 0,
      comments: item.posts.comments_count || 0,
      amenities: item.posts.amenities || [],
      propertyType: item.posts.property_type,
      price: item.posts.price,
      listingType: item.posts.listing_type,
      category: item.posts.category,
      rating: item.posts.rating,
      reviewText: item.posts.review_text,
    }));
  },

  // Get array of saved post IDs for a user
  async getIds(userId) {
    const { data, error } = await supabase
      .from("saved_posts")
      .select("post_id")
      .eq("user_id", userId);

    if (error) return [];
    return (data || []).map((item) => item.post_id);
  },

  // Check if a post is saved
  async isSaved(userId, postId) {
    const { data, error } = await supabase
      .from("saved_posts")
      .select("id")
      .eq("user_id", userId)
      .eq("post_id", postId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },

  // Toggle save/unsave a post
  async toggle(userId, postId) {
    const isSaved = await this.isSaved(userId, postId);

    if (isSaved) {
      const { error } = await supabase
        .from("saved_posts")
        .delete()
        .eq("user_id", userId)
        .eq("post_id", postId);

      if (error) throw error;
      return false;
    } else {
      const { error } = await supabase.from("saved_posts").insert({
        user_id: userId,
        post_id: postId,
      });

      if (error) throw error;
      return true;
    }
  },
};

// ════════════════════════════════════════════════════════════════════
// 9. WEDDING EVENTS (Event Planning)
// ════════════════════════════════════════════════════════════════════

export const wedding = {
  // Get wedding event
  async get(userId) {
    const { data, error } = await supabase
      .from("wedding_events")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;

    // Create if doesn't exist
    if (!data) {
      return await this.create(userId);
    }

    return data;
  },

  // Create wedding event
  async create(userId) {
    const { data, error } = await supabase
      .from("wedding_events")
      .insert({
        user_id: userId,
        partner1_name: "Christine",
        partner2_name: "Duncan",
        event_date: null,
        location: null,
        description: null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update wedding event
  async update(userId, updates) {
    const { data, error } = await supabase
      .from("wedding_events")
      .update({
        partner1_name: updates.partner1_name,
        partner2_name: updates.partner2_name,
        event_date: updates.event_date,
        location: updates.location,
        description: updates.description,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ════════════════════════════════════════════════════════════════════
// 10. UTILITY FUNCTIONS
// ════════════════════════════════════════════════════════════════════

// Format time to "2h ago", "5d ago", etc.
function formatTimeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return past.toLocaleDateString();
}

// Pick single image from device
export async function pickImage() {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== "granted") {
    throw new Error("Permission to access media library denied");
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
// 11. POST REVIEWS (Reviews for Marketplace Posts)
// ════════════════════════════════════════════════════════════════════

export const postReviews = {
  // Get all reviews across all posts
  async getAll() {
    const { data, error } = await supabase
      .from("reviews")
      .select(
        `
        *,
        users (full_name, photo_url, email),
        posts (title, category, image)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all post reviews:", error);
      return [];
    }
    return data || [];
  },

  // Get all reviews for a post
  async getForPost(postId) {
    const { data, error } = await supabase
      .from("reviews")
      .select(
        `
        *,
        users (full_name, photo_url, email)
      `,
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching post reviews:", error);
      return [];
    }
    return data || [];
  },

  // Get all reviews by a user
  async getByUser(userId) {
    const { data, error } = await supabase
      .from("reviews")
      .select(
        `
        *,
        posts (title, category)
      `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user reviews:", error);
      return [];
    }
    return data || [];
  },

  // Add a new review to a post
  async add(userId, postId, review) {
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        user_id: userId,
        post_id: postId,
        rating: review.rating,
        comment: review.comment,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding post review:", error);
      throw error;
    }

    return data;
  },

  // Update existing review
  async update(reviewId, userId, updates) {
    const { data, error } = await supabase
      .from("reviews")
      .update({
        rating: updates.rating,
        comment: updates.comment,
        updated_at: new Date().toISOString(),
      })
      .eq("id", reviewId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating post review:", error);
      throw error;
    }

    return data;
  },

  // Delete review
  async delete(reviewId, userId) {
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error deleting post review:", error);
      throw error;
    }

    return true;
  },
};

// ════════════════════════════════════════════════════════════════════
// EXPORT ALL (for backward compatibility)
// ════════════════════════════════════════════════════════════════════

export const db = {
  auth,
  users,
  properties,
  favorites,
  reviews,
  wallet,
  balanceRequests,
  posts,
  wedding,
  postReviews,
};

export default db;
