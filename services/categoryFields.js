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
    if (!categoryId) return [];
    
    const { data, error } = await supabase
      .from('category_fields')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return data || [];
  },

  async getByCategorySlug(slug) {
    if (!slug) return [];
    
    const { data: category, error: catError } = await supabase
      .from('service_categories')
      .select('id')
      .eq('slug', slug)
      .single();

    if (catError || !category) return [];

    const { data, error } = await supabase
      .from('category_fields')
      .select('*')
      .eq('category_id', category.id)
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return data || [];
  },
};
