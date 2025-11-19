import { supabase } from '../config/supabase';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const POSTS_STORAGE_KEY = '@posts_storage';

export const postsService = {
  async pickImages(maxImages = 5) {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        throw new Error('Permission to access camera roll is required');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: maxImages,
      });

      if (!result.canceled && result.assets) {
        return result.assets.map(asset => asset.uri);
      }

      return [];
    } catch (error) {
      console.error('Error picking images:', error);
      throw error;
    }
  },

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
      
      if (data && data.length > 0) {
        return data.map(post => ({
          id: post.id,
          userId: post.user_id,
          userName: post.users?.full_name || 'Anonymous User',
          userPhoto: post.users?.photo_url || 'https://via.placeholder.com/40',
          image: post.images?.[0] || post.image_url,
          images: post.images || (post.image_url ? [post.image_url] : []),
          text: post.content || post.description,
          title: post.title,
          location: post.location || 'Location',
          timeAgo: getTimeAgo(post.created_at),
          likes: post.likes_count || 0,
          comments: post.comments_count || 0,
          amenities: post.amenities || [],
          propertyType: post.property_type,
          price: post.price,
        }));
      }
      
      const localPosts = await AsyncStorage.getItem(POSTS_STORAGE_KEY);
      return localPosts ? JSON.parse(localPosts) : [];
    } catch (error) {
      console.error('Error fetching posts:', error);
      const localPosts = await AsyncStorage.getItem(POSTS_STORAGE_KEY);
      return localPosts ? JSON.parse(localPosts) : [];
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

  async createPost(userId, postData) {
    try {
      const postPayload = {
        user_id: userId,
        title: postData.title,
        content: postData.description || postData.content,
        description: postData.description,
        images: postData.images || [],
        image_url: postData.images?.[0] || postData.image_url,
        property_type: postData.propertyType,
        price: postData.price,
        location: postData.location,
        amenities: postData.amenities || [],
        specifications: postData.specifications || {},
        likes_count: 0,
        comments_count: 0,
      };

      const { data, error } = await supabase
        .from('posts')
        .insert(postPayload)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating post with Supabase, using local storage:', error);
      
      const localPost = {
        id: Date.now().toString(),
        userId,
        userName: postData.userName || 'Anonymous User',
        userPhoto: postData.userPhoto || 'https://via.placeholder.com/40',
        title: postData.title,
        text: postData.description,
        image: postData.images?.[0],
        images: postData.images || [],
        location: postData.location || 'Location',
        timeAgo: 'Just now',
        likes: 0,
        comments: 0,
        propertyType: postData.propertyType,
        price: postData.price,
        amenities: postData.amenities || [],
        specifications: postData.specifications || {},
        createdAt: new Date().toISOString(),
      };

      const existingPosts = await this.getPosts();
      const updatedPosts = [localPost, ...existingPosts];
      await AsyncStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(updatedPosts));
      
      return localPost;
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

function getTimeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return past.toLocaleDateString();
}
