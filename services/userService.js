import { supabase } from "../config/supabase";

export const userService = {
  // Fetch a user's main info
  async getUser(userId) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;
      return data || null;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },

  // Update user info
  async updateUser(userId, userData) {
    try {
      const { data, error } = await supabase
        .from("users")
        .update({
          full_name: userData.full_name,
          photo_url: userData.photo_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },
};
