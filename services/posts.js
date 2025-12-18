import { supabase } from '../config/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { wallet } from './wallet';

const DEV_POSTS_KEY = '@ejar_dev_posts';
const DEV_USER_KEY = '@ejar_dev_user_profile';

const SAMPLE_POSTS = [
  {
    id: 'sample-1',
    userId: 'sample-user',
    cityId: 'nouakchott',
    category: 'property',
    title: 'Modern 3BR Apartment in Tevragh Zeina',
    description: 'Spacious apartment with AC, parking, and 24/7 security. Close to shops and restaurants.',
    price: 150000,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'],
    status: 'active',
    paid: true,
    wasFreePost: true,
    postCostMru: 0,
    totalFavorites: 18,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    location: 'Tevragh Zeina, Nouakchott',
    name: 'Modern 3BR Apartment',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    user: { firstName: 'Ahmed', lastName: 'Mohamed' },
    city: { name: 'Nouakchott', region: 'Nouakchott' },
  },
  {
    id: 'sample-2',
    userId: 'sample-user',
    cityId: 'nouakchott',
    category: 'property',
    title: 'Villa with Garden in Ksar',
    description: 'Beautiful villa with 4 bedrooms, large garden, and modern kitchen. Perfect for families.',
    price: 350000,
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'],
    status: 'active',
    paid: true,
    wasFreePost: false,
    postCostMru: 10,
    totalFavorites: 32,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    location: 'Ksar, Nouakchott',
    name: 'Villa with Garden',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
    user: { firstName: 'Fatima', lastName: 'Mint Ali' },
    city: { name: 'Nouakchott', region: 'Nouakchott' },
  },
];

async function getDevPosts() {
  try {
    const postsStr = await AsyncStorage.getItem(DEV_POSTS_KEY);
    const userPosts = postsStr ? JSON.parse(postsStr) : [];
    return [...userPosts, ...SAMPLE_POSTS];
  } catch {
    return SAMPLE_POSTS;
  }
}

async function getUserCreatedPosts() {
  try {
    const postsStr = await AsyncStorage.getItem(DEV_POSTS_KEY);
    return postsStr ? JSON.parse(postsStr) : [];
  } catch {
    return [];
  }
}

async function saveDevPosts(posts) {
  await AsyncStorage.setItem(DEV_POSTS_KEY, JSON.stringify(posts));
}

async function getDevUserProfile() {
  try {
    const profileStr = await AsyncStorage.getItem(DEV_USER_KEY);
    if (profileStr) {
      return JSON.parse(profileStr);
    }
    return {
      role: 'normal',
      free_posts_remaining: 5,
      wallet_balance_mru: 5000,
    };
  } catch {
    return {
      role: 'normal',
      free_posts_remaining: 5,
      wallet_balance_mru: 5000,
    };
  }
}

async function saveDevUserProfile(profile) {
  await AsyncStorage.setItem(DEV_USER_KEY, JSON.stringify(profile));
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
    specifications: post.specifications || null,
    listingType: post.listing_type || null,
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
      console.log('Supabase not configured, using local data');
      let devPosts = await getDevPosts();
      devPosts = devPosts.filter(p => p.status === 'active' && p.paid === true);
      
      if (filters.category && filters.category !== 'all') {
        devPosts = devPosts.filter(p => p.category === filters.category);
      }
      if (filters.search) {
        const search = filters.search.toLowerCase();
        devPosts = devPosts.filter(p => 
          p.title.toLowerCase().includes(search) || 
          p.description.toLowerCase().includes(search)
        );
      }
      
      return devPosts.slice(0, limit);
    }

    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          users (id, first_name, last_name, profile_photo_url, whatsapp_number),
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
      if (error) throw error;
      
      if (data && data.length > 0) {
        return data.map(post => formatPost(post));
      }
      
      let devPosts = await getDevPosts();
      devPosts = devPosts.filter(p => p.status === 'active' && p.paid === true);
      return devPosts.slice(0, limit);
    } catch (error) {
      console.log('Using local data:', error.message);
      let devPosts = await getDevPosts();
      devPosts = devPosts.filter(p => p.status === 'active' && p.paid === true);
      return devPosts.slice(0, limit);
    }
  },

  async getById(postId) {
    if (!supabase) {
      const devPosts = await getDevPosts();
      return devPosts.find(p => p.id === postId) || null;
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users (id, first_name, last_name, profile_photo_url, whatsapp_number),
          cities (id, name, region),
          service_categories (id, name, type, slug)
        `)
        .eq('id', postId)
        .single();

      if (error) throw error;
      return formatPost(data);
    } catch {
      const devPosts = await getDevPosts();
      return devPosts.find(p => p.id === postId) || null;
    }
  },

  async getByUser(userId) {
    if (!supabase) {
      const userPosts = await getUserCreatedPosts();
      return userPosts.filter(p => p.userId === userId && p.status !== 'deleted');
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users (id, first_name, last_name, profile_photo_url, whatsapp_number),
          cities (id, name, region),
          service_categories (id, name, type, slug)
        `)
        .eq('user_id', userId)
        .neq('status', 'deleted')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(post => formatPost(post));
    } catch {
      const userPosts = await getUserCreatedPosts();
      return userPosts.filter(p => p.userId === userId && p.status !== 'deleted');
    }
  },

  async checkPostingCost(userId) {
    if (!supabase) {
      const devProfile = await getDevUserProfile();
      const freePostsRemaining = devProfile.free_posts_remaining || 0;
      const balance = devProfile.wallet_balance_mru || 0;

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
    }

    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('role, free_posts_remaining, wallet_balance_mru')
        .eq('id', userId)
        .single();

      if (error) throw error;

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
    } catch {
      const devProfile = await getDevUserProfile();
      const freePostsRemaining = devProfile.free_posts_remaining || 0;
      const balance = devProfile.wallet_balance_mru || 0;

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
    }
  },

  async create(userId, postData) {
    if (!postData.title || !postData.title.trim()) {
      throw new Error('Post title is required');
    }

    const cityId = postData.cityId || null;
    const costInfo = await this.checkPostingCost(userId);
    
    if (!costInfo.canPost) {
      throw new Error(costInfo.message);
    }

    let wasFreePost = costInfo.isFree;
    let postCostMru = costInfo.cost;

    if (costInfo.isFree) {
      await wallet.useFreePost(userId);
    } else {
      await wallet.deductPostPayment(userId, cityId, null);
    }

    if (!supabase) {
      const userPosts = await getUserCreatedPosts();
      const newPost = {
        id: 'post-' + Date.now(),
        userId: userId,
        cityId: cityId,
        category: postData.category || 'property',
        title: postData.title.trim(),
        description: postData.description || '',
        price: postData.price || 0,
        images: postData.images || [],
        status: 'active',
        paid: true,
        wasFreePost: wasFreePost,
        postCostMru: postCostMru,
        totalFavorites: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        location: postData.location || 'Nouakchott',
        listingType: postData.listingType || 'sale',
        specifications: postData.specifications || {},
        name: postData.title.trim(),
        rating: 4.5,
        image: postData.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
        user: { firstName: 'You', lastName: '' },
        city: { name: 'Nouakchott', region: 'Nouakchott' },
      };
      
      userPosts.unshift(newPost);
      await saveDevPosts(userPosts);
      console.log('Post created locally:', newPost.title);
      return newPost;
    }

    try {
      const insertData = {
        user_id: userId,
        city_id: cityId,
        category_id: postData.categoryId || null,
        title: postData.title.trim(),
        description: postData.description || '',
        price: postData.price || 0,
        images: postData.images || [],
        listing_type: postData.listingType || 'sale',
        specifications: postData.specifications || {},
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
          users (id, first_name, last_name, profile_photo_url, whatsapp_number),
          cities (id, name, region),
          service_categories (id, name, type, slug)
        `)
        .single();

      if (error) throw error;

      await supabase
        .from('users')
        .update({ total_posts_created: supabase.sql`total_posts_created + 1` })
        .eq('id', userId);

      console.log('Post created in Supabase:', data.title);
      return formatPost(data);
    } catch (error) {
      console.error('Supabase create failed, saving locally:', error.message);
      
      const userPosts = await getUserCreatedPosts();
      const newPost = {
        id: 'post-' + Date.now(),
        userId: userId,
        cityId: cityId,
        category: postData.category || 'property',
        title: postData.title.trim(),
        description: postData.description || '',
        price: postData.price || 0,
        images: postData.images || [],
        status: 'active',
        paid: true,
        wasFreePost: wasFreePost,
        postCostMru: postCostMru,
        totalFavorites: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        location: postData.location || 'Nouakchott',
        listingType: postData.listingType || 'sale',
        specifications: postData.specifications || {},
        name: postData.title.trim(),
        rating: 4.5,
        image: postData.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
        user: { firstName: 'You', lastName: '' },
        city: { name: 'Nouakchott', region: 'Nouakchott' },
      };
      
      userPosts.unshift(newPost);
      await saveDevPosts(userPosts);
      return newPost;
    }
  },

  async update(postId, userId, updates) {
    if (!supabase) {
      const userPosts = await getUserCreatedPosts();
      const index = userPosts.findIndex(p => p.id === postId);
      
      if (index !== -1) {
        userPosts[index] = { ...userPosts[index], ...updates, updatedAt: new Date().toISOString() };
        await saveDevPosts(userPosts);
        return userPosts[index];
      }
      throw new Error('Post not found');
    }

    try {
      const updateData = {
        updated_at: new Date().toISOString(),
      };

      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.price !== undefined) updateData.price = updates.price;
      if (updates.images !== undefined) updateData.images = updates.images;
      if (updates.category_id !== undefined) updateData.category_id = updates.category_id;
      if (updates.specifications !== undefined) updateData.specifications = updates.specifications;
      if (updates.listing_type !== undefined) updateData.listing_type = updates.listing_type;

      const { data, error } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', postId)
        .eq('user_id', userId)
        .select(`
          *,
          users (id, first_name, last_name, profile_photo_url, whatsapp_number),
          cities (id, name, region),
          service_categories (id, name, type, slug)
        `)
        .single();

      if (error) throw error;
      return formatPost(data);
    } catch (error) {
      const userPosts = await getUserCreatedPosts();
      const index = userPosts.findIndex(p => p.id === postId);
      
      if (index !== -1) {
        userPosts[index] = { ...userPosts[index], ...updates, updatedAt: new Date().toISOString() };
        await saveDevPosts(userPosts);
        return userPosts[index];
      }
      throw new Error('Post not found');
    }
  },

  async delete(postId, userId) {
    if (!supabase) {
      const userPosts = await getUserCreatedPosts();
      const index = userPosts.findIndex(p => p.id === postId);
      
      if (index !== -1) {
        userPosts[index].status = 'deleted';
        await saveDevPosts(userPosts);
        return true;
      }
      return false;
    }

    try {
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
    } catch {
      const userPosts = await getUserCreatedPosts();
      const index = userPosts.findIndex(p => p.id === postId);
      
      if (index !== -1) {
        userPosts[index].status = 'deleted';
        await saveDevPosts(userPosts);
        return true;
      }
      return false;
    }
  },

  async end(postId, userId) {
    if (!supabase) {
      const userPosts = await getUserCreatedPosts();
      const index = userPosts.findIndex(p => p.id === postId);
      
      if (index !== -1) {
        userPosts[index].status = 'ended';
        await saveDevPosts(userPosts);
        return true;
      }
      return false;
    }

    try {
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
    } catch {
      const userPosts = await getUserCreatedPosts();
      const index = userPosts.findIndex(p => p.id === postId);
      
      if (index !== -1) {
        userPosts[index].status = 'ended';
        await saveDevPosts(userPosts);
        return true;
      }
      return false;
    }
  },

  async uploadImages(userId, imageUris) {
    if (!supabase) {
      console.log('Using local image URIs');
      return imageUris;
    }

    try {
      const uploadedUrls = [];

      for (const uri of imageUris) {
        const response = await fetch(uri);
        const blob = await response.blob();
        const fileName = `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
        const filePath = `posts/${fileName}`;

        const { error } = await supabase.storage
          .from('post-images')
          .upload(filePath, blob, {
            contentType: 'image/jpeg',
            upsert: false,
          });

        if (error) {
          console.error('Upload error:', error);
          uploadedUrls.push(uri);
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('post-images')
            .getPublicUrl(filePath);
          uploadedUrls.push(publicUrl);
        }
      }

      return uploadedUrls;
    } catch (error) {
      console.log('Upload failed, using local URIs:', error.message);
      return imageUris;
    }
  },

  async pickImages(maxImages = 5) {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      throw new Error('Permission to access camera roll is required');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: maxImages,
    });

    if (!result.canceled && result.assets) {
      return result.assets.map(asset => asset.uri);
    }

    return [];
  },

  async incrementFavorites(postId) {
    if (!supabase) {
      const devPosts = await getDevPosts();
      const post = devPosts.find(p => p.id === postId);
      if (post) {
        post.totalFavorites = (post.totalFavorites || 0) + 1;
      }
      return;
    }

    try {
      await supabase
        .from('posts')
        .update({ total_favorites: supabase.sql`total_favorites + 1` })
        .eq('id', postId);
    } catch (error) {
      console.error('Error incrementing favorites:', error);
    }
  },

  async decrementFavorites(postId) {
    if (!supabase) {
      const devPosts = await getDevPosts();
      const post = devPosts.find(p => p.id === postId);
      if (post && post.totalFavorites > 0) {
        post.totalFavorites -= 1;
      }
      return;
    }

    try {
      await supabase
        .from('posts')
        .update({ total_favorites: supabase.sql`GREATEST(total_favorites - 1, 0)` })
        .eq('id', postId);
    } catch (error) {
      console.error('Error decrementing favorites:', error);
    }
  },
};
