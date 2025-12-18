import { supabase } from '../config/supabase';

export const categories = {
  async getAll() {
    if (!supabase) {
      console.warn('Supabase not configured, returning empty array');
      return [];
    }

    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getById(categoryId) {
    if (!supabase) {
      console.warn('Supabase not configured');
      return null;
    }

    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .eq('id', categoryId)
      .single();

    if (error) throw error;
    return data;
  },

  async getByType(type) {
    if (!supabase) {
      console.warn('Supabase not configured, returning empty array');
      return [];
    }

    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .eq('type', type);

    if (error) throw error;
    return data || [];
  },

  async getBySlug(slug) {
    if (!supabase) {
      console.warn('Supabase not configured');
      return null;
    }

    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async create(category) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('service_categories')
      .insert({
        name: category.name,
        slug: category.slug,
        type: category.type,
        description: category.description || null,
        metadata: category.metadata || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('service_categories')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { error } = await supabase
      .from('service_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },
};
