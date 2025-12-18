import { supabase } from '../config/supabase';

export const categoryFields = {
  async getAll() {
    const { data, error } = await supabase
      .from('category_fields')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return data || [];
  },

  async getByCategoryId(categoryId) {
    const { data, error } = await supabase
      .from('category_fields')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return data || [];
  },
};
