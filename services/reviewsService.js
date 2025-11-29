import { supabase } from "../config/supabase";

export const reviewsService = {
  async getReviews(propertyId) {
    try {
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
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  },

  async getUserReviews(userId) {
    try {
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
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      throw error;
    }
  },

  async addReview(userId, propertyId, review) {
    try {
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

      await this.updatePropertyRating(propertyId);

      return data;
    } catch (error) {
      console.error("Error adding review:", error);
      throw error;
    }
  },

  async updateReview(reviewId, userId, updates) {
    try {
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

      const { data: review } = await supabase
        .from("reviews")
        .select("property_id")
        .eq("id", reviewId)
        .single();

      if (review) {
        await this.updatePropertyRating(review.property_id);
      }

      return data;
    } catch (error) {
      console.error("Error updating review:", error);
      throw error;
    }
  },

  async deleteReview(reviewId, userId) {
    try {
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

      if (review) {
        await this.updatePropertyRating(review.property_id);
      }

      return true;
    } catch (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
  },

  async updatePropertyRating(propertyId) {
    try {
      const { data: reviews, error: reviewsError } = await supabase
        .from("reviews")
        .select("rating")
        .eq("property_id", propertyId);

      if (reviewsError) throw reviewsError;

      if (reviews && reviews.length > 0) {
        const avgRating =
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

        const { error: updateError } = await supabase
          .from("properties")
          .update({
            rating: avgRating.toFixed(1),
            total_reviews: reviews.length,
          })
          .eq("id", propertyId);

        if (updateError) throw updateError;
      }
    } catch (error) {
      console.error("Error updating property rating:", error);
    }
  },
};
