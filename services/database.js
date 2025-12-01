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
// 1. AUTHENTICATION - OTP FLOW (Frontend Only)
// ════════════════════════════════════════════════════════════════════

export const auth = {
  async generateOTP(phoneNumber) {
    try {
      const formattedPhone = phoneNumber.replace(/\D/g, '');
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      
      console.log(`📱 OTP for ${formattedPhone}: ${otp}`);
      
      return {
        phoneNumber: formattedPhone,
        otp: otp,
      };
    } catch (error) {
      console.error("Error generating OTP:", error);
      throw error;
    }
  },

  async verifyOTPAndLogin(phoneNumber, otp) {
    try {
      const formattedPhone = phoneNumber.replace(/\D/g, '');
      
      console.log("🔄 Verifying OTP for:", formattedPhone);
      
      // Create a mock user object for frontend
      // In production, this would call a backend API to verify against database
      const user = {
        id: `user_${Date.now()}`,
        phone_number: formattedPhone,
        whatsapp_phone: formattedPhone,
        post_limit: 5,
        posts_count: 0,
        is_member: false,
        hit_limit: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("✅ User verified:", user);
      return { user, isNewUser: true };
    } catch (error) {
      console.error("OTP verification error:", error);
      return { error: error.message };
    }
  },

  async signOut() {
    try {
      console.log("User signed out");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  },
};

// ════════════════════════════════════════════════════════════════════
// 2. USERS - Using Supabase
// ════════════════════════════════════════════════════════════════════

export const users = {
  async getByPhoneNumber(phoneNumber) {
    try {
      const formattedPhone = phoneNumber.replace(/\D/g, '');
      
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("phone_number", formattedPhone)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching user by phone:", error);
      return null;
    }
  },

  async getById(userId) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  },

  async decrementPostLimit(userId) {
    try {
      const user = await this.getById(userId);
      if (!user) throw new Error("User not found");
      
      if (user.post_limit <= 0) {
        throw new Error("Post limit reached. Please make a payment to add more posts.");
      }

      const { data, error } = await supabase
        .from("users")
        .update({ post_limit: user.post_limit - 1 })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      console.log(`✅ Post limit decremented for user ${userId}. New limit: ${data.post_limit}`);
      return data;
    } catch (error) {
      console.error("Error decrementing post limit:", error);
      throw error;
    }
  },
};

// ════════════════════════════════════════════════════════════════════
// 3. POSTS (Using Supabase)
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
      console.log(`✅ Loaded ${data?.length || 0} approved posts`);
      return data || [];
    } catch (error) {
      console.error("Error fetching approved posts:", error);
      return [];
    }
  },

  // Get posts by category (returns all approved for now, filters by listing_type if provided)
  async getByCategory(category, limit = 50, offset = 0) {
    try {
      let query = supabase
        .from("posts")
        .select("*")
        .eq("is_approved", true);

      // Filter by listing_type if it's one of the valid types
      if (["property", "phones", "electronics", "others"].includes(category)) {
        query = query.or(`listing_type.eq.${category},property_type.eq.${category}`);
      }

      const { data, error } = await query
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      console.log(`✅ Loaded ${data?.length || 0} posts for category: ${category}`);
      return data || [];
    } catch (error) {
      console.error(`Error fetching posts for category ${category}:`, error);
      // Fallback: return all approved posts
      return this.getAllApproved(limit, offset);
    }
  },

  // Search posts
  async search(query, limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("is_approved", true)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      console.log(`✅ Found ${data?.length || 0} posts matching: ${query}`);
      return data || [];
    } catch (error) {
      console.error("Error searching posts:", error);
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

  // Get posts by user
  async getByUserId(userId, limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching user posts:", error);
      return [];
    }
  },

  // Get pending approval posts (admin) - unpaid posts
  async getPendingApproval(limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("is_approved", false)
        .order("created_at", { ascending: true })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching pending posts:", error);
      return [];
    }
  },

  // Get unpaid posts count (for pinned section visibility)
  async getUnpaidPostsCount() {
    try {
      const { count, error } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("is_approved", false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error("Error fetching unpaid posts count:", error);
      return 0;
    }
  },

  // Create post
  async create(userId, postData) {
    try {
      // Create post with is_approved = false (hidden until payment)
      const postWithDefaults = {
        ...postData,
        user_id: userId,
        is_approved: false,
      };

      const { data, error } = await supabase
        .from("posts")
        .insert([postWithDefaults])
        .select();

      if (error) throw error;
      console.log(`✅ Post created (pending payment): ${data?.[0]?.id}`);
      return data?.[0] || null;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },

  // Update post
  async update(postId, updates) {
    try {
      const { data, error } = await supabase
        .from("posts")
        .update(updates)
        .eq("id", postId)
        .select();

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  },

  // Delete post
  async delete(postId) {
    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  },

  // Approve post
  async approve(postId) {
    return this.update(postId, { is_approved: true });
  },

  // Reject post
  async reject(postId) {
    return this.update(postId, { is_approved: false });
  },

  // Pick images from library
  async pickImages(maxImages = 5) {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permission.granted) {
        throw new Error("Permission to access media library was denied. Please enable photo library access in your device settings.");
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: [ImagePicker.MediaType.Images],
        allowsEditing: false,
        allowsMultiple: true,
        quality: 0.8,
        selectionLimit: maxImages,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        return result.assets.map((asset) => ({
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          size: asset.fileSize,
        }));
      }

      return [];
    } catch (error) {
      console.error("Error picking images:", error);
      // On web or when picker isn't available, provide test images
      if (error.message && error.message.includes("denied")) {
        throw error;
      }
      
      // Fallback: return placeholder images for testing on web
      console.log("⚠️ Using test images for web. For real images, use the mobile app.");
      const testImages = [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1503935551629-fde19125f521?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
      ];
      
      return testImages.slice(0, maxImages).map((uri) => ({
        uri,
        width: 400,
        height: 400,
        size: 0,
      }));
    }
  },
};

// ════════════════════════════════════════════════════════════════════
// 4. WALLET
// ════════════════════════════════════════════════════════════════════

export const wallet = {
  async getBalance(userId) {
    try {
      const { data, error } = await supabase
        .from("wallet_accounts")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching wallet:", error);
      return null;
    }
  },

  async addBalance(userId, amount, description = "") {
    try {
      const { data, error } = await supabase.rpc("add_wallet_balance", {
        p_user_id: userId,
        p_amount: amount,
        p_description: description,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error adding balance:", error);
      throw error;
    }
  },

  async deductBalance(userId, amount, description = "") {
    try {
      const { data, error } = await supabase.rpc("deduct_wallet_balance", {
        p_user_id: userId,
        p_amount: amount,
        p_description: description,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error deducting balance:", error);
      throw error;
    }
  },

  async getTransactionHistory(userId, limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase
        .from("wallet_transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  },
};
