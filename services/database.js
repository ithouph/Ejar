import { supabase } from "../config/supabase";
import * as WebBrowser from "expo-web-browser";
import * as ImagePicker from "expo-image-picker";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

/**
 * ════════════════════════════════════════════════════════════════════
 * EJAR APP - ALL DATABASE FUNCTIONS IN ONE FILE
 * ════════════════════════════════════════════════════════════════════
 */

// ════════════════════════════════════════════════════════════════════
// 1. AUTHENTICATION
// ════════════════════════════════════════════════════════════════════

export const auth = {
  async directLogin(phoneNumber) {
    try {
      const { queryPostgresSingle, queryPostgres } = await import("../config/postgres.js");
      const formattedPhone = phoneNumber.replace(/\D/g, '');
      
      console.log("🔄 Direct login for:", formattedPhone);
      
      // Check if user exists
      let user = await queryPostgresSingle(
        "SELECT * FROM users WHERE phone_number = $1",
        [formattedPhone]
      );

      // If user doesn't exist, create them
      if (!user) {
        console.log("✅ Creating new user:", formattedPhone);
        const result = await queryPostgresSingle(
          "INSERT INTO users (phone_number, post_limit, posts_count, is_member, hit_limit) VALUES ($1, $2, $3, $4, $5) RETURNING *",
          [formattedPhone, 5, 0, false, 100]
        );
        user = result;

        // Create wallet for new user
        try {
          await queryPostgres(
            "INSERT INTO wallet_accounts (user_id, balance, currency) VALUES ($1, $2, $3)",
            [user.id, 0, "MRU"]
          );
        } catch (walletError) {
          console.log("Wallet creation note:", walletError);
        }
      }

      console.log("✅ User logged in:", user);
      return { user, isNewUser: !user };
    } catch (error) {
      console.error("Direct login error:", error);
      throw error;
    }
  },

  async signOut() {
    try {
      // No-op for now - user will be cleared from context
      console.log("User signed out");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  },
};

// ════════════════════════════════════════════════════════════════════
// 2. POSTS (CRUD Operations with Approval System)
// ════════════════════════════════════════════════════════════════════

export const posts = {
  // Get all approved posts (for clients/feed)
  async getAllApproved(limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching approved posts:", error);
      return [];
    }
  },

  // Get all posts (paginated)
  async getAll(limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  },

  // Get posts by user ID (user's own posts - show all)
  async getByUser(userId) {
    try {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching user posts:", error);
      return [];
    }
  },

  // Get single post by ID
  async getById(postId) {
    try {
      if (!postId) return null;
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching post:", error);
      return null;
    }
  },

  // Check if user can post (hasn't reached post limit)
  async canUserPost(userId) {
    try {
      if (!userId) return false;
      const { data, error } = await supabase
        .from("users")
        .select("posts_count, post_limit")
        .eq("id", userId)
        .maybeSingle();

      if (error || !data) return false;
      return data.posts_count < data.post_limit;
    } catch (error) {
      console.error("Error checking post limit:", error);
      return false;
    }
  },

  // Get user's post limit info
  async getUserPostLimit(userId) {
    try {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("users")
        .select("posts_count, post_limit")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error getting post limit:", error);
      return null;
    }
  },

  // Create new post (free: not approved, paid: auto-approved)
  async create(userId, postData) {
    try {
      if (!userId) throw new Error("User ID required");

      // Check post limit
      const canPost = await this.canUserPost(userId);
      if (!canPost) {
        return { error: "Post limit reached. Please upgrade or remove a post." };
      }

      const isPaid = postData.isPaid || false;

      const { data, error } = await supabase
        .from("posts")
        .insert({
          user_id: userId,
          city_id: postData.city_id,
          category_id: postData.category_id,
          title: postData.title,
          description: postData.description,
          listing_type: postData.listing_type,
          property_type: postData.property_type,
          price: postData.price,
          image_url: postData.image_url,
          images: postData.images || [],
          amenities: postData.amenities || [],
          specifications: postData.specifications || {},
          is_paid: isPaid,
          is_approved: isPaid, // Auto-approve if paid
          payment_approved: isPaid,
          likes_count: 0,
          total_favorites: 0,
          rating: 0,
          total_reviews: 0,
        })
        .select()
        .single();

      if (error) throw error;

      // Increment user's post count
      await supabase
        .from("users")
        .update({ posts_count: supabase.rpc('increment_post_count', { user_id: userId }) })
        .eq("id", userId);

      return data;
    } catch (error) {
      console.error("Error creating post:", error);
      return { error: error.message };
    }
  },

  // Update post
  async update(postId, userId, updates) {
    try {
      if (!postId || !userId) throw new Error("Post ID and User ID required");

      const updateData = {
        updated_at: new Date().toISOString(),
      };

      if (updates.city_id) updateData.city_id = updates.city_id;
      if (updates.category_id) updateData.category_id = updates.category_id;
      if (updates.title) updateData.title = updates.title;
      if (updates.description) updateData.description = updates.description;
      if (updates.listing_type !== undefined) updateData.listing_type = updates.listing_type;
      if (updates.property_type !== undefined) updateData.property_type = updates.property_type;
      if (updates.price !== undefined) updateData.price = updates.price;
      if (updates.image_url) updateData.image_url = updates.image_url;
      if (updates.images) updateData.images = updates.images;
      if (updates.amenities) updateData.amenities = updates.amenities;
      if (updates.specifications) updateData.specifications = updates.specifications;

      const { data, error } = await supabase
        .from("posts")
        .update(updateData)
        .eq("id", postId)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating post:", error);
      return null;
    }
  },

  // Delete post
  async delete(postId, userId) {
    try {
      if (!postId || !userId) throw new Error("Post ID and User ID required");

      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId)
        .eq("user_id", userId);

      if (error) throw error;

      // Decrement user's post count
      await supabase.rpc('decrement_post_count', { user_id: userId });

      return true;
    } catch (error) {
      console.error("Error deleting post:", error);
      return false;
    }
  },

  // Search posts by category (only approved)
  async getByCategory(categoryId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("category_id", categoryId)
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching posts by category:", error);
      return [];
    }
  },

  // Search posts by city (only approved)
  async getByCity(cityId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("city_id", cityId)
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching posts by city:", error);
      return [];
    }
  },

  // Search posts by title/description (only approved)
  async search(searchTerm, limit = 50) {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error searching posts:", error);
      return [];
    }
  },
};

// ════════════════════════════════════════════════════════════════════
// 3. REVIEWS (CRUD Operations)
// ════════════════════════════════════════════════════════════════════

export const postReviews = {
  // Get all reviews for a post
  async getForPost(postId) {
    try {
      if (!postId) return [];
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  },

  // Add review
  async add(userId, postId, reviewData) {
    try {
      if (!userId || !postId) throw new Error("User ID and Post ID required");

      const { data, error } = await supabase
        .from("reviews")
        .insert({
          user_id: userId,
          post_id: postId,
          rating: reviewData.rating,
          comment: reviewData.comment,
        })
        .select()
        .single();

      if (error) throw error;
      await this.updatePostRating(postId);
      return data;
    } catch (error) {
      console.error("Error adding review:", error);
      return null;
    }
  },

  // Update review
  async update(reviewId, userId, updates) {
    try {
      if (!reviewId || !userId) throw new Error("Review ID and User ID required");

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

      if (error) throw error;

      const review = await supabase
        .from("reviews")
        .select("post_id")
        .eq("id", reviewId)
        .single();

      if (review?.data) {
        await this.updatePostRating(review.data.post_id);
      }

      return data;
    } catch (error) {
      console.error("Error updating review:", error);
      return null;
    }
  },

  // Delete review
  async delete(reviewId, userId) {
    try {
      if (!reviewId || !userId) throw new Error("Review ID and User ID required");

      const review = await supabase
        .from("reviews")
        .select("post_id")
        .eq("id", reviewId)
        .eq("user_id", userId)
        .single();

      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId)
        .eq("user_id", userId);

      if (error) throw error;

      if (review?.data) {
        await this.updatePostRating(review.data.post_id);
      }

      return true;
    } catch (error) {
      console.error("Error deleting review:", error);
      return false;
    }
  },

  // Update post rating based on all reviews
  async updatePostRating(postId) {
    try {
      if (!postId) return;

      const { data: allReviews } = await supabase
        .from("reviews")
        .select("rating")
        .eq("post_id", postId);

      if (allReviews && allReviews.length > 0) {
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

        await supabase
          .from("posts")
          .update({
            rating: parseFloat(avgRating.toFixed(1)),
            total_reviews: allReviews.length,
          })
          .eq("id", postId);
      }
    } catch (error) {
      console.error("Error updating post rating:", error);
    }
  },
};

// ════════════════════════════════════════════════════════════════════
// 4. FAVORITES (CRUD Operations)
// ════════════════════════════════════════════════════════════════════

export const favorites = {
  async getAll(userId) {
    try {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("favorites")
        .select("post_id")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []).map(f => f.post_id);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      return [];
    }
  },

  async getAllFavoritePosts(userId) {
    try {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("favorites")
        .select("posts (*)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []).map(f => f.posts).filter(Boolean);
    } catch (error) {
      console.error("Error fetching favorite posts:", error);
      return [];
    }
  },

  async add(userId, postId) {
    try {
      if (!userId || !postId) return null;
      const { data, error } = await supabase
        .from("favorites")
        .insert({ user_id: userId, post_id: postId })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error adding favorite:", error);
      return null;
    }
  },

  async remove(userId, postId) {
    try {
      if (!userId || !postId) return false;
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("post_id", postId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error removing favorite:", error);
      return false;
    }
  },

  async toggle(userId, postId) {
    try {
      if (!userId || !postId) return { action: "error", isFavorite: false };

      const { data: existing } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", userId)
        .eq("post_id", postId)
        .maybeSingle();

      if (existing) {
        await this.remove(userId, postId);
        return { action: "removed", isFavorite: false };
      } else {
        await this.add(userId, postId);
        return { action: "added", isFavorite: true };
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      return { action: "error", isFavorite: false };
    }
  },

  async isFavorite(userId, postId) {
    try {
      if (!userId || !postId) return false;
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", userId)
        .eq("post_id", postId)
        .maybeSingle();

      return !!data;
    } catch (error) {
      console.error("Error checking favorite:", error);
      return false;
    }
  },
};

// ════════════════════════════════════════════════════════════════════
// 5. WALLET & BALANCE
// ════════════════════════════════════════════════════════════════════

export const wallet = {
  async get(userId) {
    try {
      const { data, error } = await supabase
        .from("wallet_accounts")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return await this.create(userId);
      }

      return data;
    } catch (error) {
      console.error("Error getting wallet:", error);
      return null;
    }
  },

  async create(userId) {
    try {
      const { data, error } = await supabase
        .from("wallet_accounts")
        .insert({
          user_id: userId,
          balance: 0,
          currency: "MRU",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating wallet:", error);
      return null;
    }
  },

  async getBalance(userId) {
    try {
      const wallet = await this.get(userId);
      return wallet ? parseFloat(wallet.balance) : 0;
    } catch (error) {
      console.error("Error getting balance:", error);
      return 0;
    }
  },

  async addBalance(userId, amount, description = "Balance added") {
    try {
      if (!userId || !amount) return null;

      const wallet = await this.get(userId);
      if (!wallet) return null;

      const newBalance = parseFloat(wallet.balance) + parseFloat(amount);

      const { data: updated, error: updateError } = await supabase
        .from("wallet_accounts")
        .update({ balance: newBalance })
        .eq("id", wallet.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Record transaction
      await supabase
        .from("wallet_transactions")
        .insert({
          wallet_id: wallet.id,
          type: "credit",
          amount: parseFloat(amount),
          description,
          category: "deposit",
        });

      return updated;
    } catch (error) {
      console.error("Error adding balance:", error);
      return null;
    }
  },

  async deductBalance(userId, amount, description = "Balance deducted") {
    try {
      if (!userId || !amount) return null;

      const wallet = await this.get(userId);
      if (!wallet) return null;

      const newBalance = parseFloat(wallet.balance) - parseFloat(amount);
      if (newBalance < 0) return { error: "Insufficient balance" };

      const { data: updated, error: updateError } = await supabase
        .from("wallet_accounts")
        .update({ balance: newBalance })
        .eq("id", wallet.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Record transaction
      await supabase
        .from("wallet_transactions")
        .insert({
          wallet_id: wallet.id,
          type: "debit",
          amount: parseFloat(amount),
          description,
          category: "posting",
        });

      return updated;
    } catch (error) {
      console.error("Error deducting balance:", error);
      return null;
    }
  },

  async getTransactions(userId, limit = 50) {
    try {
      if (!userId) return [];

      const wallet = await this.get(userId);
      if (!wallet) return [];

      const { data, error } = await supabase
        .from("wallet_transactions")
        .select("*")
        .eq("wallet_id", wallet.id)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  },
};

// ════════════════════════════════════════════════════════════════════
// 6. PAYMENT REQUESTS (Approve/Deny System)
// ════════════════════════════════════════════════════════════════════

export const paymentRequests = {
  async create(userId, postId, amount) {
    try {
      if (!userId || !amount) throw new Error("User ID and amount required");

      const { data, error } = await supabase
        .from("payment_requests")
        .insert({
          user_id: userId,
          post_id: postId,
          amount: parseFloat(amount),
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating payment request:", error);
      return null;
    }
  },

  async getPending(userId) {
    try {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("payment_requests")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      return [];
    }
  },

  async getAllPending(limit = 50) {
    try {
      const { data, error } = await supabase
        .from("payment_requests")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching all pending requests:", error);
      return [];
    }
  },

  async approve(requestId, adminNotes = "") {
    try {
      if (!requestId) throw new Error("Request ID required");

      const request = await supabase
        .from("payment_requests")
        .select("*")
        .eq("id", requestId)
        .single();

      if (!request.data) throw new Error("Payment request not found");

      const { data, error } = await supabase
        .from("payment_requests")
        .update({
          status: "approved",
          processed_at: new Date().toISOString(),
          admin_notes: adminNotes,
        })
        .eq("id", requestId)
        .select()
        .single();

      if (error) throw error;

      // Add balance to user's wallet
      if (request.data.user_id) {
        await wallet.addBalance(
          request.data.user_id,
          request.data.amount,
          "Payment approved"
        );
      }

      // If it's a post payment, approve the post and mark payment_approved
      if (request.data.post_id) {
        await supabase
          .from("posts")
          .update({ 
            is_approved: true,
            payment_approved: true,
          })
          .eq("id", request.data.post_id);
      }

      return data;
    } catch (error) {
      console.error("Error approving payment:", error);
      return null;
    }
  },

  async deny(requestId, reason = "Rejected") {
    try {
      if (!requestId) throw new Error("Request ID required");

      const { data, error } = await supabase
        .from("payment_requests")
        .update({
          status: "rejected",
          processed_at: new Date().toISOString(),
          rejection_reason: reason,
        })
        .eq("id", requestId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error denying payment:", error);
      return null;
    }
  },

  async getHistory(userId, limit = 50) {
    try {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("payment_requests")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching payment history:", error);
      return [];
    }
  },
};

// ════════════════════════════════════════════════════════════════════
// 7. USERS
// ════════════════════════════════════════════════════════════════════

export const users = {
  async getById(userId) {
    try {
      if (!userId) return null;
      const { queryPostgresSingle } = await import("../config/postgres.js");
      const user = await queryPostgresSingle(
        "SELECT * FROM users WHERE id = $1",
        [userId]
      );
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  },

  async getByPhoneNumber(phoneNumber) {
    try {
      if (!phoneNumber) return null;
      const { queryPostgresSingle } = await import("../config/postgres.js");
      const user = await queryPostgresSingle(
        "SELECT * FROM users WHERE phone_number = $1",
        [phoneNumber]
      );
      console.log("✅ User found from DB:", user);
      return user;
    } catch (error) {
      console.error("Error fetching user by phone:", error);
      return null;
    }
  },

  async getUser(userId) {
    return this.getById(userId);
  },

  async update(userId, updates) {
    try {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating user:", error);
      return null;
    }
  },

  async updateUser(userId, updates) {
    return this.update(userId, updates);
  },

  async incrementPostCount(userId) {
    try {
      if (!userId) return null;

      const user = await this.getById(userId);
      if (!user) return null;

      return await this.update(userId, {
        posts_count: (user.posts_count || 0) + 1,
      });
    } catch (error) {
      console.error("Error incrementing post count:", error);
      return null;
    }
  },

  async decrementPostCount(userId) {
    try {
      if (!userId) return null;

      const user = await this.getById(userId);
      if (!user || user.posts_count <= 0) return null;

      return await this.update(userId, {
        posts_count: Math.max(0, (user.posts_count || 1) - 1),
      });
    } catch (error) {
      console.error("Error decrementing post count:", error);
      return null;
    }
  },
};
