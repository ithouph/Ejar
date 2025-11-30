import { supabase } from "../config/supabase";
import * as ImagePicker from "expo-image-picker";

const CATEGORIES = ["property", "phones", "electronics", "others"];

export const postsService = {
  async pickImages(maxImages = 5) {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") throw new Error("Permission denied");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: maxImages,
    });

    return result.canceled || !result.assets
      ? []
      : result.assets.map((a) => a.uri);
  },

  async getPosts(limit = 50) {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data.map((post) => ({
        id: post.id,
        userId: post.user_id,
        title: post.title,
        description: post.description,
        image: post.image_url,
        images: post.images || [],
        price: post.price,
        likes: post.likes_count || 0,
        favorites: post.total_favorites || 0,
        comments: post.total_reviews || 0,
        rating: post.rating || 0,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
      }));
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  },

  async getUserPosts(userId) {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createPost(userId, postData) {
    const postPayload = {
      user_id: userId,
      title: postData.title,
      description: postData.description,
      type: postData.category || "others",
      location: postData.location,
      price: postData.price,
    };

    try {
      const { data, error } = await supabase
        .from("posts")
        .insert(postPayload)
        .select()
        .single();

      if (error) throw error;

      // Upload post photos if any
      if (postData.images?.length) {
        for (const uri of postData.images) {
          await supabase.from("posts_photos").insert({
            post_id: data.id,
            url: uri,
          });
        }
      }

      return data;
    } catch (error) {
      console.error("Error creating post:", error);
      return null;
    }
  },

  async updatePost(postId, userId, updates) {
    const { data, error } = await supabase
      .from("posts")
      .update({
        title: updates.title,
        description: updates.description,
        location: updates.location,
        price: updates.price,
        type: updates.category,
        updated_at: new Date().toISOString(),
      })
      .eq("id", postId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletePost(postId, userId) {
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId)
      .eq("user_id", userId);
    if (error) throw error;
    return true;
  },

  async incrementLikes(postId) {
    try {
      const { data, error } = await supabase.rpc("increment_post_likes", {
        post_id: postId,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error incrementing likes:", error);
    }
  },
};

function getTimeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMs / 3600000);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays < 7) return `${diffDays}d ago`;
  return past.toLocaleDateString();
}
