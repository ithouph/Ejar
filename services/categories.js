import { supabase } from '../config/supabase';

export const categories = {
  async getAll() {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getById(categoryId) {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .eq('id', categoryId)
      .single();

    if (error) throw error;
    return data;
  },

  async getByType(type) {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .eq('type', type);

    if (error) throw error;
    return data || [];
  },
};
