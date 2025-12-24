import { supabase } from '../config/supabase';
import { wallet } from './wallet';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

async function uploadImage(uri, userId) {
  if (!supabase) {
    throw new Error('Database not configured.');
  }

  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    return uri;
  }

  try {
    const timestamp = Date.now();
    const fileName = `${userId}/${timestamp}-${Math.random().toString(36).substring(7)}.jpg`;

    let base64Data;
    
    if (uri.startsWith('data:')) {
      base64Data = uri.split(',')[1];
    } else if (uri.startsWith('blob:')) {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      const { data, error } = await supabase.storage
        .from('post-images')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from('post-images')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } else {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }
      base64Data = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    }

    if (base64Data) {
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const { data, error } = await supabase.storage
        .from('post-images')
        .upload(fileName, bytes, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from('post-images')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    }

    throw new Error('Could not process image');
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
}

async function uploadImages(uris, userId) {
  const uploadedUrls = [];
  
  for (const uri of uris) {
    try {
      const url = await uploadImage(uri, userId);
      uploadedUrls.push(url);
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  }
  
  return uploadedUrls;
}

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
    postCostMru: parseFloat(post.post_cost_mru) || 0,
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
      slug: post.service_categories.slug,
    } : null,
  };
}

export const posts = {
  async getAll(filters = {}, limit = 50) {
    if (!supabase) {
      throw new Error('Database not configured. Please check your Supabase settings.');
    }

    let query = supabase
      .from('posts')
      .select(`
        *,
        users!user_id (id, first_name, last_name, profile_photo_url, whatsapp_number),
        cities (id, name, region),
        service_categories (id, name, type, slug)
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

    query = query.order('created_at', { ascending: false }).limit(limit);

    const { data, error } = await query;
    
    if (error) {
      console.error('Failed to fetch posts:', error.message);
      throw new Error('Failed to load posts. Please try again.');
    }
    
    return (data || []).map(post => formatPost(post));
  },

  async getById(postId) {
    if (!supabase) {
      throw new Error('Database not configured.');
    }

    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users!user_id (id, first_name, last_name, profile_photo_url, whatsapp_number),
        cities (id, name, region),
        service_categories (id, name, type, slug)
      `)
      .eq('id', postId)
      .single();

    if (error) {
      console.error('Failed to fetch post:', error.message);
      throw new Error('Failed to load post details.');
    }
    
    return formatPost(data);
  },

  async getByUser(userId) {
    if (!supabase) {
      throw new Error('Database not configured.');
    }

    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users!user_id (id, first_name, last_name, profile_photo_url, whatsapp_number),
        cities (id, name, region),
        service_categories (id, name, type, slug)
      `)
      .eq('user_id', userId)
      .neq('status', 'deleted')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch user posts:', error.message);
      throw new Error('Failed to load your posts.');
    }
    
    return (data || []).map(post => formatPost(post));
  },

  async checkPostingCost(userId) {
    if (!supabase) {
      throw new Error('Database not configured.');
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('role, free_posts_remaining, wallet_balance_mru')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Failed to check posting cost:', error.message);
      throw new Error('Failed to check posting cost.');
    }

    const role = user.role;
    const freePostsRemaining = user.free_posts_remaining || 0;
    const balance = parseFloat(user.wallet_balance_mru) || 0;

    if (role === 'member') {
      return {
        isFree: false,
        cost: wallet.POST_COST_MRU,
        canPost: balance >= wallet.POST_COST_MRU,
        freePostsRemaining: 0,
        balance,
        message: balance >= wallet.POST_COST_MRU 
          ? `${wallet.POST_COST_MRU} MRU will be deducted from your wallet`
          : `Insufficient balance. You need ${wallet.POST_COST_MRU} MRU to post.`,
      };
    }

    if (freePostsRemaining > 0) {
      return {
        isFree: true,
        cost: 0,
        canPost: true,
        freePostsRemaining,
        balance,
        message: `This post is free (${freePostsRemaining} free posts remaining)`,
      };
    }

    return {
      isFree: false,
      cost: wallet.POST_COST_MRU,
      canPost: balance >= wallet.POST_COST_MRU,
      freePostsRemaining: 0,
      balance,
      message: balance >= wallet.POST_COST_MRU 
        ? `${wallet.POST_COST_MRU} MRU will be deducted from your wallet`
        : `Insufficient balance. You need ${wallet.POST_COST_MRU} MRU to post.`,
    };
  },

  async create(userId, postData) {
    if (!supabase) {
      throw new Error('Database not configured.');
    }

    if (!userId) {
      throw new Error('User ID is required to create a post.');
    }

    const costInfo = await this.checkPostingCost(userId);
    
    if (!costInfo.canPost) {
      throw new Error(costInfo.message);
    }

    let imageUrls = [];
    if (postData.images && postData.images.length > 0) {
      try {
        imageUrls = await uploadImages(postData.images, userId);
        if (imageUrls.length < 2) {
          throw new Error('Failed to upload images. Please try again.');
        }
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        throw new Error('Failed to upload images. Please try again.');
      }
    }

    const wasFreePost = costInfo.isFree;
    const postCostMru = wasFreePost ? 0 : wallet.POST_COST_MRU;

    const displayId = 'EJ-' + Date.now().toString(36).toUpperCase();

    const insertData = {
      display_id: displayId,
      user_id: userId,
      city_id: postData.cityId,
      category_id: postData.categoryId,
      title: postData.title.trim(),
      description: postData.description.trim(),
      price: postData.price || 0,
      images: imageUrls,
      specifications: postData.specifications || {},
      condition: postData.condition || null,
      paid: true,
      was_free_post: wasFreePost,
      post_cost_mru: postCostMru,
      status: 'active',
    };

    const { data, error } = await supabase
      .from('posts')
      .insert(insertData)
      .select(`
        *,
        users!user_id (id, first_name, last_name, profile_photo_url, whatsapp_number),
        cities (id, name, region),
        service_categories (id, name, type, slug)
      `)
      .single();

    if (error) {
      console.error('Failed to create post:', error.message);
      throw new Error('Failed to create post. Please try again.');
    }

    if (wasFreePost) {
      await supabase
        .from('users')
        .update({ 
          free_posts_remaining: costInfo.freePostsRemaining - 1,
          free_posts_used: supabase.rpc ? undefined : 1,
        })
        .eq('id', userId);
    } else {
      await wallet.deductPostPayment(userId, postCostMru, data.id);
    }

    return formatPost(data);
  },

  async update(postId, userId, updates) {
    if (!supabase) {
      throw new Error('Database not configured.');
    }

    const updateData = {};
    if (updates.title !== undefined) updateData.title = updates.title.trim();
    if (updates.description !== undefined) updateData.description = updates.description.trim();
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.images !== undefined) updateData.images = updates.images;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.cityId !== undefined) updateData.city_id = updates.cityId;
    if (updates.categoryId !== undefined) updateData.category_id = updates.categoryId;

    const { data, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', postId)
      .eq('user_id', userId)
      .select(`
        *,
        users!user_id (id, first_name, last_name, profile_photo_url, whatsapp_number),
        cities (id, name, region),
        service_categories (id, name, type, slug)
      `)
      .single();

    if (error) {
      console.error('Failed to update post:', error.message);
      throw new Error('Failed to update post.');
    }

    return formatPost(data);
  },

  async delete(postId, userId) {
    if (!supabase) {
      throw new Error('Database not configured.');
    }

    const { error } = await supabase
      .from('posts')
      .update({ status: 'deleted' })
      .eq('id', postId)
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to delete post:', error.message);
      throw new Error('Failed to delete post.');
    }

    return true;
  },

  async incrementFavorites(postId) {
    if (!supabase) {
      throw new Error('Database not configured.');
    }

    const { data: post } = await supabase
      .from('posts')
      .select('total_favorites')
      .eq('id', postId)
      .single();

    const currentCount = post?.total_favorites || 0;

    const { error } = await supabase
      .from('posts')
      .update({ total_favorites: currentCount + 1 })
      .eq('id', postId);

    if (error) {
      console.error('Failed to increment favorites:', error.message);
    }
  },

  async decrementFavorites(postId) {
    if (!supabase) {
      throw new Error('Database not configured.');
    }

    const { data: post } = await supabase
      .from('posts')
      .select('total_favorites')
      .eq('id', postId)
      .single();

    const currentCount = post?.total_favorites || 0;

    const { error } = await supabase
      .from('posts')
      .update({ total_favorites: Math.max(0, currentCount - 1) })
      .eq('id', postId);

    if (error) {
      console.error('Failed to decrement favorites:', error.message);
    }
  },

  async searchPosts(searchTerm, filters = {}, limit = 50) {
    if (!supabase) {
      throw new Error('Database not configured.');
    }

    let query = supabase
      .from('posts')
      .select(`
        *,
        users!user_id (id, first_name, last_name, profile_photo_url, whatsapp_number),
        cities (id, name, region),
        service_categories (id, name, type, slug)
      `)
      .eq('status', 'active')
      .eq('paid', true);

    if (searchTerm && searchTerm.trim()) {
      const term = `%${searchTerm.trim()}%`;
      query = query.or(`title.ilike.${term},description.ilike.${term}`);
    }

    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }
    if (filters.cityId) {
      query = query.eq('city_id', filters.cityId);
    }

    query = query.order('created_at', { ascending: false }).limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error('Failed to search posts:', error.message);
      throw new Error('Search failed. Please try again.');
    }

    return (data || []).map(post => formatPost(post));
  },

  async getPostsByCity(cityId, limit = 50) {
    if (!supabase) {
      throw new Error('Database not configured.');
    }

    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users!user_id (id, first_name, last_name, profile_photo_url, whatsapp_number),
        cities (id, name, region),
        service_categories (id, name, type, slug)
      `)
      .eq('city_id', cityId)
      .eq('status', 'active')
      .eq('paid', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to fetch city posts:', error.message);
      throw new Error('Failed to load posts for this city.');
    }

    return (data || []).map(post => formatPost(post));
  },

  async getPostsByCategory(categoryId, limit = 50) {
    if (!supabase) {
      throw new Error('Database not configured.');
    }

    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users!user_id (id, first_name, last_name, profile_photo_url, whatsapp_number),
        cities (id, name, region),
        service_categories (id, name, type, slug)
      `)
      .eq('category_id', categoryId)
      .eq('status', 'active')
      .eq('paid', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to fetch category posts:', error.message);
      throw new Error('Failed to load posts for this category.');
    }

    return (data || []).map(post => formatPost(post));
  },

  async pickImages(maxCount = 5) {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Permission to access photo library was denied.');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: maxCount,
      quality: 0.8,
      aspect: [4, 3],
    });

    if (result.canceled) {
      return [];
    }

    return result.assets.map(asset => asset.uri);
  },
};
