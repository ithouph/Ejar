import { supabase } from "../config/supabase";

export const favoritesService = {
  async getFavorites(userId) {
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select(
          `
          id,
          post_id,
          created_at,
          posts (*)
        `,
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching favorites:", error);
      throw error;
    }
  },

  async addFavorite(userId, postId) {
    try {
      const { data, error } = await supabase
        .from("favorites")
        .insert({
          user_id: userId,
          post_id: postId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error adding favorite:", error);
      throw error;
    }
  },

  async removeFavorite(userId, postId) {
    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("post_id", postId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error removing favorite:", error);
      throw error;
    }
  },

  async isFavorite(userId, postId) {
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", userId)
        .eq("post_id", postId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error("Error checking favorite status:", error);
      return false;
    }
  },

  async toggleFavorite(userId, postId) {
    try {
      const isFav = await this.isFavorite(userId, postId);

      if (isFav) {
        await this.removeFavorite(userId, postId);
        return { action: "removed", isFavorite: false };
      } else {
        await this.addFavorite(userId, postId);
        return { action: "added", isFavorite: true };
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      throw error;
    }
  },

  async getFavoriteIds(userId) {
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("post_id")
        .eq("user_id", userId);

      if (error) throw error;
      return (data || []).map((fav) => fav.post_id);
    } catch (error) {
      console.error("Error fetching favorite IDs:", error);
      return [];
    }
  },
};
