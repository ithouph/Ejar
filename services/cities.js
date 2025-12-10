import { supabase } from '../config/supabase';

export const cities = {
  async getAll() {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getById(cityId) {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('id', cityId)
      .single();

    if (error) throw error;
    return data;
  },

  async getByName(name) {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .ilike('name', name)
      .maybeSingle();

    if (error) throw error;
    return data;
  },
};
