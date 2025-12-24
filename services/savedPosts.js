import { supabase } from '../config/supabase';

function formatPost(post) {
  if (!post) return null;
  return {
    id: post.id,
    displayId: post.display_id,
    userId: post.user_id,
    cityId: post.city_id,
    categoryId: post.category_id,
    title: post.title,
    description: post.description,
    price: parseFloat(post.price) || 0,
    images: post.images || [],
    status: post.status,
    paid: post.paid,
    totalViews: post.total_views || 0,
    totalFavorites: post.total_favorites || 0,
    createdAt: post.created_at,
    user: post.users ? {
      id: post.users.id,
      firstName: post.users.first_name,
      lastName: post.users.last_name,
      profilePhoto: post.users.profile_photo_url,
      whatsapp: post.users.whatsapp_number,
    } : null,
    city: post.cities ? {
      id: post.cities.id,
      name: post.cities.name,
      region: post.cities.region,
    } : null,
    category: post.service_categories ? {
      id: post.service_categories.id,
      name: post.service_categories.name,
      type: post.service_categories.type,
    } : null,
  };
}

export const savedPosts = {
  async getAll(userId) {
    const { data, error } = await supabase
      .from('saved_posts')
      .select(`
        *,
        posts (
          *,
          users!posts_user_id_fkey (id, first_name, last_name, profile_photo_url, whatsapp_number),
          cities (id, name, region),
          service_categories (id, name, type)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading favorites:', error);
      return [];
    }

    return (data || [])
      .filter(item => item.posts && item.posts.status === 'active')
      .map(item => formatPost(item.posts));
  },

  async getIds(userId) {
    const { data, error } = await supabase
      .from('saved_posts')
      .select('post_id')
      .eq('user_id', userId);

    if (error) return [];
    return (data || []).map(item => item.post_id);
  },

  async isSaved(userId, postId) {
    const { data, error } = await supabase
      .from('saved_posts')
      .select('user_id')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .maybeSingle();

    if (error) return false;
    return !!data;
  },

  async toggle(userId, postId) {
    const isSaved = await this.isSaved(userId, postId);

    if (isSaved) {
      const { error } = await supabase
        .from('saved_posts')
        .delete()
        .eq('user_id', userId)
        .eq('post_id', postId);

      if (error) throw error;
      return false;
    } else {
      const { error } = await supabase
        .from('saved_posts')
        .insert({
          user_id: userId,
          post_id: postId,
        });

      if (error) throw error;
      return true;
    }
  },
};
