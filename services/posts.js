import { supabase } from '../config/supabase';
import * as ImagePicker from 'expo-image-picker';

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
    wasFreePost: post.was_free_post,
    totalViews: post.total_views || 0,
    totalFavorites: post.total_favorites || 0,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
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

export const posts = {
  async getAll(filters = {}, limit = 50) {
    let query = supabase
      .from('posts')
      .select(`
        *,
        users (id, first_name, last_name, profile_photo_url, whatsapp_number),
        cities (id, name, region),
        service_categories (id, name, type)
      `)
      .eq('status', 'active')
      .eq('paid', true);

    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }

    if (filters.cityId) {
      query = query.eq('city_id', filters.cityId);
    }

    if (filters.minPrice !== undefined && filters.minPrice !== null) {
      query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters.search && filters.search.trim()) {
      const searchTerm = `%${filters.search.trim()}%`;
      query = query.or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`);
    }

    query = query
      .order('created_at', { ascending: false })
      .limit(limit);

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(post => formatPost(post));
  },

  async getById(postId) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users (id, first_name, last_name, profile_photo_url, whatsapp_number),
        cities (id, name, region),
        service_categories (id, name, type)
      `)
      .eq('id', postId)
      .single();

    if (error) throw error;
    return formatPost(data);
  },

  async getByUser(userId) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users (id, first_name, last_name, profile_photo_url, whatsapp_number),
        cities (id, name, region),
        service_categories (id, name, type)
      `)
      .eq('user_id', userId)
      .neq('status', 'deleted')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(post => formatPost(post));
  },

  async create(userId, cityId, post) {
    if (!post.title || !post.title.trim()) {
      throw new Error('Post title is required');
    }

    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        city_id: cityId,
        category_id: post.category_id || null,
        title: post.title.trim(),
        description: post.description || '',
        price: post.price || 0,
        images: post.images || [],
        paid: post.was_free_post || false,
        was_free_post: post.was_free_post || false,
        status: post.was_free_post ? 'active' : 'pending_payment',
      })
      .select(`
        *,
        users (id, first_name, last_name, profile_photo_url, whatsapp_number),
        cities (id, name, region),
        service_categories (id, name, type)
      `)
      .single();

    if (error) throw error;

    if (post.was_free_post) {
      await supabase.rpc('decrement_free_posts', { p_user_id: userId }).catch(() => {});
    }

    return formatPost(data);
  },

  async update(postId, userId, updates) {
    const updateData = {
      updated_at: new Date().toISOString(),
    };

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.images !== undefined) updateData.images = updates.images;
    if (updates.category_id !== undefined) updateData.category_id = updates.category_id;

    const { data, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', postId)
      .eq('user_id', userId)
      .select(`
        *,
        users (id, first_name, last_name, profile_photo_url, whatsapp_number),
        cities (id, name, region),
        service_categories (id, name, type)
      `)
      .single();

    if (error) throw error;
    return formatPost(data);
  },

  async delete(postId, userId) {
    const { error } = await supabase
      .from('posts')
      .update({
        status: 'deleted',
        deleted_at: new Date().toISOString(),
      })
      .eq('id', postId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  },

  async end(postId, userId) {
    const { error } = await supabase
      .from('posts')
      .update({
        status: 'ended',
        ended_at: new Date().toISOString(),
      })
      .eq('id', postId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  },

  async uploadImages(userId, imageUris) {
    const uploadedUrls = [];

    for (const uri of imageUris) {
      const response = await fetch(uri);
      const blob = await response.blob();

      const fileName = `${userId}_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
      const filePath = `post-images/${fileName}`;

      const { error } = await supabase.storage
        .from('posts')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (!error) {
        const { data: { publicUrl } } = supabase.storage
          .from('posts')
          .getPublicUrl(filePath);
        uploadedUrls.push(publicUrl);
      }
    }

    return uploadedUrls;
  },

  async pickImages(maxImages = 5) {
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
  },
};
