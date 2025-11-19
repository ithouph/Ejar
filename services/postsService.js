import { supabase } from '../config/supabase';

export const postsService = {
  async getPosts(limit = 50) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users (full_name, photo_url)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  async getUserPosts(userId) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user posts:', error);
      throw error;
    }
  },

  async createPost(userId, post) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: userId,
          title: post.title,
          content: post.content,
          image_url: post.image_url,
          likes_count: 0,
          comments_count: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  async updatePost(postId, userId, updates) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update({
          title: updates.title,
          content: updates.content,
          image_url: updates.image_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', postId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  async deletePost(postId, userId) {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  async incrementLikes(postId) {
    try {
      const { data, error } = await supabase
        .rpc('increment_post_likes', { post_id: postId });

      if (error) throw error;
      return data;
    } catch (error) {
      const { data: post } = await supabase
        .from('posts')
        .select('likes_count')
        .eq('id', postId)
        .single();

      if (post) {
        const { error: updateError } = await supabase
          .from('posts')
          .update({ likes_count: post.likes_count + 1 })
          .eq('id', postId);

        if (updateError) throw updateError;
      }
      console.error('Error incrementing likes:', error);
    }
  },
};
