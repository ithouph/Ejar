import { supabase } from '../config/supabase';

export const propertyTypes = {
  async getAll() {
    const { data, error } = await supabase
      .from('property_types')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return data || [];
  },

  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('property_types')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return data;
  },
};
