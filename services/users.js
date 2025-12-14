import { supabase } from '../config/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEV_USER_KEY = '@ejar_dev_user_profile';

async function isDevMode() {
  const devMode = await AsyncStorage.getItem('@ejar_dev_mode');
  return devMode === 'true';
}

async function getDevUserProfile() {
  const profileStr = await AsyncStorage.getItem(DEV_USER_KEY);
  if (profileStr) {
    return JSON.parse(profileStr);
  }
  return {
    id: 'dev-user-default',
    phone: '+22200000000',
    whatsapp_number: '+22200000000',
    first_name: 'Test',
    last_name: 'User',
    role: 'normal',
    wallet_balance_mru: 5000,
    free_posts_remaining: 5,
    free_posts_used: 0,
    total_posts_created: 0,
    city: { id: 'dev-city', name: 'Nouakchott', region: 'Nouakchott' },
  };
}

async function saveDevUserProfile(profile) {
  await AsyncStorage.setItem(DEV_USER_KEY, JSON.stringify(profile));
}

function formatUser(data) {
  if (!data) return null;
  return {
    id: data.id,
    phone: data.phone,
    whatsappNumber: data.whatsapp_number,
    firstName: data.first_name,
    lastName: data.last_name,
    fullName: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
    profilePhotoUrl: data.profile_photo_url,
    role: data.role,
    walletBalance: parseFloat(data.wallet_balance_mru) || 0,
    freePostsRemaining: data.free_posts_remaining ?? 5,
    freePostsUsed: data.free_posts_used || 0,
    totalPostsCreated: data.total_posts_created || 0,
    city: data.cities || data.city || null,
    cityId: data.city_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export const users = {
  async getUser(userId) {
    if (await isDevMode()) {
      const devProfile = await getDevUserProfile();
      console.log('DEV MODE: Returning user profile');
      return formatUser(devProfile);
    }

    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        cities (id, name, region)
      `)
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return formatUser(data);
  },

  async getByPhone(phone) {
    if (await isDevMode()) {
      const devProfile = await getDevUserProfile();
      if (devProfile.phone === phone) {
        return formatUser(devProfile);
      }
      return null;
    }

    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        cities (id, name, region)
      `)
      .eq('phone', phone)
      .maybeSingle();

    if (error) throw error;
    return formatUser(data);
  },

  async createUser(userData) {
    if (await isDevMode()) {
      const devProfile = {
        id: userData.id,
        phone: userData.phone,
        whatsapp_number: userData.whatsapp_number || userData.phone,
        first_name: userData.first_name,
        last_name: userData.last_name,
        city_id: userData.city_id,
        role: 'normal',
        wallet_balance_mru: 5000,
        free_posts_remaining: 5,
        free_posts_used: 0,
        total_posts_created: 0,
        profile_photo_url: userData.profile_photo_url,
        city: { id: userData.city_id, name: 'Nouakchott', region: 'Nouakchott' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await saveDevUserProfile(devProfile);
      console.log('DEV MODE: User profile created');
      return formatUser(devProfile);
    }

    const insertData = {
      id: userData.id,
      phone: userData.phone,
      whatsapp_number: userData.whatsapp_number || userData.phone,
      first_name: userData.first_name,
      last_name: userData.last_name,
      city_id: userData.city_id,
      role: 'normal',
    };
    
    if (userData.profile_photo_url && typeof userData.profile_photo_url === 'string') {
      insertData.profile_photo_url = userData.profile_photo_url;
    }

    const { data, error } = await supabase
      .from('users')
      .upsert(insertData, { onConflict: 'id' })
      .select(`
        *,
        cities (id, name, region)
      `)
      .single();

    if (error) throw error;
    return formatUser(data);
  },

  async updateUser(userId, updates) {
    if (await isDevMode()) {
      const devProfile = await getDevUserProfile();
      const updatedProfile = {
        ...devProfile,
        ...updates,
        updated_at: new Date().toISOString(),
      };
      await saveDevUserProfile(updatedProfile);
      console.log('DEV MODE: User profile updated');
      return formatUser(updatedProfile);
    }

    const updateData = {
      updated_at: new Date().toISOString(),
    };

    if (updates.first_name !== undefined) updateData.first_name = updates.first_name;
    if (updates.last_name !== undefined) updateData.last_name = updates.last_name;
    if (updates.whatsapp_number !== undefined) updateData.whatsapp_number = updates.whatsapp_number;
    if (updates.city_id !== undefined) updateData.city_id = updates.city_id;
    if (updates.profile_photo_url !== undefined) updateData.profile_photo_url = updates.profile_photo_url;

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select(`
        *,
        cities (id, name, region)
      `)
      .single();

    if (error) throw error;
    return formatUser(data);
  },

  async decrementFreePosts(userId) {
    if (await isDevMode()) {
      const devProfile = await getDevUserProfile();
      if (devProfile.free_posts_remaining > 0) {
        devProfile.free_posts_remaining -= 1;
        devProfile.free_posts_used += 1;
        await saveDevUserProfile(devProfile);
      }
      return devProfile.free_posts_remaining;
    }

    const { data, error } = await supabase.rpc('decrement_free_posts', { p_user_id: userId });
    if (error) throw error;
    return data;
  },

  async uploadProfilePicture(userId, imageUri) {
    if (await isDevMode()) {
      console.log('DEV MODE: Using local image URI for profile');
      return imageUri;
    }

    const response = await fetch(imageUri);
    const blob = await response.blob();

    const fileName = `${userId}_${Date.now()}.jpg`;
    const filePath = `profile-pictures/${fileName}`;

    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, blob, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  getFullName(user) {
    if (!user) return 'Anonymous User';
    if (user.fullName) return user.fullName;
    return `${user.first_name || user.firstName || ''} ${user.last_name || user.lastName || ''}`.trim() || 'Anonymous User';
  },
};
