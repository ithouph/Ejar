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
  {
    id: 'sample-3',
    userId: 'sample-user-2',
    cityId: 'nouakchott',
    category: 'phones',
    title: 'iPhone 14 Pro Max - Like New',
    description: '256GB, Deep Purple. Includes charger and original box. Battery health 98%.',
    price: 85000,
    images: ['https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400'],
    status: 'active',
    paid: true,
    wasFreePost: true,
    postCostMru: 0,
    totalFavorites: 45,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    location: 'Nouakchott',
    name: 'iPhone 14 Pro Max',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400',
    user: { firstName: 'Omar', lastName: 'Ould Cheikh' },
    city: { name: 'Nouakchott', region: 'Nouakchott' },
  },
  {
    id: 'sample-4',
    userId: 'sample-user-2',
    cityId: 'nouakchott',
    category: 'phones',
    title: 'Samsung Galaxy S23 Ultra',
    description: '512GB, Phantom Black. Perfect condition, used for 3 months only.',
    price: 75000,
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400'],
    status: 'active',
    paid: true,
    wasFreePost: true,
    postCostMru: 0,
    totalFavorites: 28,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    location: 'Nouakchott',
    name: 'Samsung Galaxy S23 Ultra',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
    user: { firstName: 'Aminata', lastName: 'Diallo' },
    city: { name: 'Nouakchott', region: 'Nouakchott' },
  },
  {
    id: 'sample-5',
    userId: 'sample-user-3',
    cityId: 'nouadhibou',
    category: 'electronics',
    title: 'MacBook Pro 16" M2 Pro',
    description: '32GB RAM, 1TB SSD. Excellent condition with original box and charger.',
    price: 180000,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'],
    status: 'active',
    paid: true,
    wasFreePost: false,
    postCostMru: 10,
    totalFavorites: 21,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    location: 'Nouadhibou',
    name: 'MacBook Pro 16"',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    user: { firstName: 'Mohamed', lastName: 'Lemine' },
    city: { name: 'Nouadhibou', region: 'Dakhlet Nouadhibou' },
  },
  {
    id: 'sample-6',
    userId: 'sample-user-3',
    cityId: 'nouadhibou',
    category: 'others',
    title: 'Toyota Land Cruiser 2020',
    description: 'V8 engine, full options, leather seats. Well maintained with service history.',
    price: 2500000,
    images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400'],
    status: 'active',
    paid: true,
    wasFreePost: false,
    postCostMru: 10,
    totalFavorites: 67,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    location: 'Nouadhibou',
    name: 'Toyota Land Cruiser',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400',
    user: { firstName: 'Sidi', lastName: 'Ould Ahmed' },
    city: { name: 'Nouadhibou', region: 'Dakhlet Nouadhibou' },
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
    try {
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

      query = query.order('created_at', { ascending: false }).limit(limit);

      const { data, error } = await query;
      if (error) throw error;
      
      if (data && data.length > 0) {
        return data.map(post => formatPost(post));
      }
      
      throw new Error('No data from Supabase');
    } catch (error) {
      console.log('Using local data:', error.message);
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
  },

  async getById(postId) {
    try {
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
    } catch {
      const devPosts = await getDevPosts();
      return devPosts.find(p => p.id === postId) || null;
    }
  },

  async getByUser(userId) {
    try {
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
    } catch {
      const userPosts = await getUserCreatedPosts();
      return userPosts.filter(p => p.userId === userId && p.status !== 'deleted');
    }
  },

  async checkPostingCost(userId) {
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

  async create(userId, cityId, post) {
    if (!post.title || !post.title.trim()) {
      throw new Error('Post title is required');
    }

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

    const userPosts = await getUserCreatedPosts();
    const newPost = {
      id: 'post-' + Date.now(),
      userId: userId,
      cityId: cityId,
      category: post.category || 'property',
      title: post.title.trim(),
      description: post.description || '',
      price: post.price || 0,
      images: post.images || [],
      status: 'active',
      paid: true,
      wasFreePost: wasFreePost,
      postCostMru: postCostMru,
      totalFavorites: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      location: post.location || 'Nouakchott',
      name: post.title.trim(),
      rating: 4.5,
      image: post.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
      user: { firstName: 'You', lastName: '' },
      city: { name: 'Nouakchott', region: 'Nouakchott' },
    };
    
    userPosts.unshift(newPost);
    await saveDevPosts(userPosts);
    
    console.log('Post created successfully:', newPost.title, wasFreePost ? '(Free)' : `(${postCostMru} MRU)`);

    try {
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
          paid: true,
          was_free_post: wasFreePost,
          post_cost_mru: postCostMru,
          status: 'active',
        })
        .select()
        .single();

      if (!error && data) {
        console.log('Post also saved to Supabase');
        
        await supabase
          .from('users')
          .update({
            total_posts_created: supabase.rpc('increment_field', { field_name: 'total_posts_created' }),
          })
          .eq('id', userId);
      }
    } catch (e) {
      console.log('Supabase save skipped:', e.message);
    }
    
    return newPost;
  },

  async update(postId, userId, updates) {
    const userPosts = await getUserCreatedPosts();
    const index = userPosts.findIndex(p => p.id === postId);
    
    if (index !== -1) {
      userPosts[index] = { ...userPosts[index], ...updates, updatedAt: new Date().toISOString() };
      await saveDevPosts(userPosts);
      console.log('Post updated locally');
      return userPosts[index];
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

      const { data, error } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', postId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return formatPost(data);
    } catch {
      throw new Error('Post not found');
    }
  },

  async delete(postId, userId) {
    const userPosts = await getUserCreatedPosts();
    const index = userPosts.findIndex(p => p.id === postId);
    
    if (index !== -1) {
      userPosts[index].status = 'deleted';
      await saveDevPosts(userPosts);
      console.log('Post deleted locally (no refund)');
      return true;
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
      return false;
    }
  },

  async end(postId, userId) {
    const userPosts = await getUserCreatedPosts();
    const index = userPosts.findIndex(p => p.id === postId);
    
    if (index !== -1) {
      userPosts[index].status = 'ended';
      await saveDevPosts(userPosts);
      console.log('Post ended locally');
      return true;
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
      return false;
    }
  },

  async uploadImages(userId, imageUris) {
    console.log('Using local image URIs');
    return imageUris;
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
};
