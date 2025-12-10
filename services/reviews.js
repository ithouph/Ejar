import { supabase } from '../config/supabase';

function formatReview(review) {
  if (!review) return null;
  return {
    id: review.id,
    userId: review.user_id,
    postId: review.post_id,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.created_at,
    user: review.users ? {
      id: review.users.id,
      firstName: review.users.first_name,
      lastName: review.users.last_name,
      profilePhoto: review.users.profile_photo_url,
    } : null,
  };
}

export const reviews = {
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
