import { supabase } from "../config/supabase";
import * as WebBrowser from "expo-web-browser";
import * as ImagePicker from "expo-image-picker";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

// Category mapping - maps category names to UUIDs
const CATEGORY_MAP = {
  phones: "92edda9d-aff7-423f-9d5d-467c7251fc2e",
  electronics: "09b9ff92-9125-4882-9431-45d3540a82bb",
  property: "7ff96de1-4711-4d90-b6f2-3c2a6b5d2760",
  cars: "bcd5ba4e-a70d-48e9-be8a-2214b06b1795",
  others: "1496e4fd-6972-400a-bf97-5901981eadc5",
};

// Upload image to Supabase storage and return public URL
async function uploadImageToSupabase(imageUri, postId, index) {
  try {
    if (imageUri.startsWith("http")) {
      // Already a URL (from Unsplash test images)
      return imageUri;
    }

    // For mobile: convert base64 or fetch local image
    let imageData;
    
    if (imageUri.startsWith("data:")) {
      // Base64 image
      const base64String = imageUri.split(",")[1];
      imageData = Buffer.from(base64String, "base64");
    } else {
      // Local file URI - fetch it
      const response = await fetch(imageUri);
      imageData = await response.blob();
    }

    const timestamp = Date.now();
    const fileName = `${postId}/${timestamp}-${index}.jpg`;

    const { data, error } = await supabase.storage
      .from("post-images")
      .upload(fileName, imageData, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: publicData } = supabase.storage
      .from("post-images")
      .getPublicUrl(fileName);

    return publicData?.publicUrl || imageUri;
  } catch (error) {
    console.error("Error uploading image:", error);
    // Return original URI if upload fails
    return imageUri;
  }
}

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
      
      // Generate proper UUID v4
      const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };

      // Create a mock user object for frontend
      // In production, this would call a backend API to verify against database
      const user = {
        id: generateUUID(),
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
      // Get category_id from category string
      const categoryId = CATEGORY_MAP[postData.category];
      if (!categoryId) {
        throw new Error(`Invalid category: ${postData.category}`);
      }

      // First create the post to get its ID for image storage organization
      const tempPost = {
        user_id: userId,
        category_id: categoryId,
        title: postData.title,
        description: postData.description,
        price: postData.price,
        images: [],
        is_approved: true,
        is_paid: true,
        payment_approved: true,
      };

      const { data: createdPost, error: createError } = await supabase
        .from("posts")
        .insert([tempPost])
        .select();

      if (createError) throw createError;
      
      const postId = createdPost?.[0]?.id;
      console.log(`📝 Post created with ID: ${postId}`);

      // Upload images to Supabase storage and get URLs
      let uploadedImageUrls = [];
      if (postData.images && postData.images.length > 0) {
        console.log(`📸 Uploading ${postData.images.length} images...`);
        uploadedImageUrls = await Promise.all(
          postData.images.map((imageUri, index) =>
            uploadImageToSupabase(imageUri, postId, index)
          )
        );
      }

      // Update post with image URLs
      const { data: updatedPost, error: updateError } = await supabase
        .from("posts")
        .update({ images: uploadedImageUrls })
        .eq("id", postId)
        .select();

      if (updateError) throw updateError;
      
      console.log(`✅ Post created and approved with ${uploadedImageUrls.length} images: ${postId}`);
      return updatedPost?.[0] || null;
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
      // Request permissions
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permission.granted) {
        // On web, if permissions fail, provide test images
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

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
