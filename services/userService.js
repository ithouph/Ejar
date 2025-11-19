import { supabase } from '../config/supabase';

export const userService = {
  async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  async createProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          date_of_birth: profileData.date_of_birth,
          gender: profileData.gender,
          mobile: profileData.mobile,
          weight: profileData.weight,
          height: profileData.height,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  },

  async updateProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          date_of_birth: profileData.date_of_birth,
          gender: profileData.gender,
          mobile: profileData.mobile,
          weight: profileData.weight,
          height: profileData.height,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  async updateUser(userId, userData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          full_name: userData.full_name,
          photo_url: userData.photo_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async getUser(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },
};
