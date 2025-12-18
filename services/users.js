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

  async searchByPhone(phone) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          cities (id, name, region)
        `)
        .ilike('phone', `%${phone}%`)
        .limit(20);

      if (error) throw error;
      return (data || []).map(u => formatUser(u));
    } catch {
      return [];
    }
  },

  async getAllUsers(filters = {}, limit = 100) {
    try {
      let query = supabase
        .from('users')
        .select(`
          *,
          cities (id, name, region)
        `);

      if (filters.role) {
        query = query.eq('role', filters.role);
      }
      if (filters.cityId) {
        query = query.eq('city_id', filters.cityId);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []).map(u => formatUser(u));
    } catch {
      return [];
    }
  },

  async getMembersInCity(cityId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          cities (id, name, region)
        `)
        .eq('city_id', cityId)
        .eq('role', 'member')
        .gte('wallet_balance_mru', 1000);

      if (error) throw error;
      return (data || []).map(u => formatUser(u));
    } catch {
      return [];
    }
  },

  async promoteToMember(userId, leaderId) {
    try {
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('wallet_balance_mru, role')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;

      if (parseFloat(user.wallet_balance_mru) < 1000) {
        throw new Error('User must have at least 1000 MRU balance to become a Member');
      }

      if (user.role !== 'normal') {
        throw new Error('Only normal users can be promoted to Member');
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({
          role: 'member',
          promoted_by_leader_id: leaderId,
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      await supabase
        .from('role_change_logs')
        .insert({
          user_id: userId,
          changed_by_leader_id: leaderId,
          previous_role: user.role,
          new_role: 'member',
          user_balance_at_change: user.wallet_balance_mru,
        });

      return true;
    } catch (err) {
      console.error('Promote to member error:', err);
      throw err;
    }
  },

  async promoteToExMember(userId, leaderId) {
    try {
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('wallet_balance_mru, role')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;

      if (parseFloat(user.wallet_balance_mru) < 2000) {
        throw new Error('User must have at least 2000 MRU balance to become an Ex-Member');
      }

      if (user.role !== 'normal') {
        throw new Error('Only normal users can be promoted to Ex-Member');
      }

      const now = new Date();
      const nextPaymentDue = new Date(now);
      nextPaymentDue.setMonth(nextPaymentDue.getMonth() + 1);

      const newBalance = parseFloat(user.wallet_balance_mru) - 2000;

      const { error: updateError } = await supabase
        .from('users')
        .update({
          role: 'ex_member',
          wallet_balance_mru: newBalance,
          promoted_by_leader_id: leaderId,
          ex_member_activated_at: now.toISOString(),
          ex_member_last_payment_at: now.toISOString(),
          ex_member_next_payment_due: nextPaymentDue.toISOString(),
          ex_member_is_active: true,
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      await supabase
        .from('wallet_transactions')
        .insert({
          user_id: userId,
          type: 'ex_member_subscription',
          amount_mru: -2000,
          balance_before_mru: user.wallet_balance_mru,
          balance_after_mru: newBalance,
          status: 'approved',
        });

      await supabase
        .from('role_change_logs')
        .insert({
          user_id: userId,
          changed_by_leader_id: leaderId,
          previous_role: user.role,
          new_role: 'ex_member',
          user_balance_at_change: user.wallet_balance_mru,
        });

      await supabase
        .from('subscription_history')
        .insert({
          user_id: userId,
          action: 'activated',
          amount_charged_mru: 2000,
          balance_before_mru: user.wallet_balance_mru,
          balance_after_mru: newBalance,
          next_payment_due: nextPaymentDue.toISOString(),
        });

      return true;
    } catch (err) {
      console.error('Promote to ex-member error:', err);
      throw err;
    }
  },

  async demoteToNormal(userId, leaderId, reason = '') {
    try {
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('role, wallet_balance_mru')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;

      const { error: updateError } = await supabase
        .from('users')
        .update({
          role: 'normal',
          ex_member_is_active: false,
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      await supabase
        .from('role_change_logs')
        .insert({
          user_id: userId,
          changed_by_leader_id: leaderId,
          previous_role: user.role,
          new_role: 'normal',
          user_balance_at_change: user.wallet_balance_mru,
          reason,
        });

      return true;
    } catch (err) {
      console.error('Demote to normal error:', err);
      throw err;
    }
  },

  async getExMemberStatus(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role, ex_member_is_active, ex_member_next_payment_due, wallet_balance_mru')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data.role !== 'ex_member') {
        return { isExMember: false };
      }

      return {
        isExMember: true,
        isActive: data.ex_member_is_active,
        nextPaymentDue: data.ex_member_next_payment_due,
        balance: parseFloat(data.wallet_balance_mru),
        canRenew: parseFloat(data.wallet_balance_mru) >= 500,
      };
    } catch {
      return { isExMember: false };
    }
  },
};
