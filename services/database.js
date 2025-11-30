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

  // Get pending approval posts (admin)
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

  // Create post
  async create(postData) {
    try {
      const { data, error } = await supabase
        .from("posts")
        .insert([postData])
        .select();

      if (error) throw error;
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
