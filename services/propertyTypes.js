import { supabase } from '../config/supabase';

export const propertyTypes = {
  async getAll() {
    if (!supabase) {
      console.warn('Supabase not configured, returning empty array');
      return [];
    }

    const { data, error } = await supabase
      .from('property_types')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return data || [];
  },

  async getBySlug(slug) {
    if (!supabase) {
      console.warn('Supabase not configured');
      return null;
    }

    const { data, error } = await supabase
      .from('property_types')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return data;
  },

  async create(propertyType) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('property_types')
      .insert({
        name: propertyType.name,
        slug: propertyType.slug,
        description: propertyType.description || null,
        icon: propertyType.icon || null,
        sort_order: propertyType.sort_order || 0,
        is_active: true,
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

    const updateData = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.slug !== undefined) updateData.slug = updates.slug;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.icon !== undefined) updateData.icon = updates.icon;
    if (updates.sort_order !== undefined) updateData.sort_order = updates.sort_order;
    if (updates.is_active !== undefined) updateData.is_active = updates.is_active;

    const { data, error } = await supabase
      .from('property_types')
      .update(updateData)
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
      .from('property_types')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
    return true;
  },
};
