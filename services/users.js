import { supabase } from '../config/supabase';

export const users = {
  async getUser(userId) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        cities (id, name, region)
      `)
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getByPhone(phone) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        cities (id, name, region)
      `)
      .eq('phone', phone)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createUser(userData) {
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
    return data;
  },

  async updateUser(userId, updates) {
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
    return data;
  },

  async uploadProfilePicture(userId, imageUri) {
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
    return `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Anonymous User';
  },
};
