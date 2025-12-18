import { supabase } from '../config/supabase';

export const listingTypes = {
  async getAll() {
    if (!supabase) {
      throw new Error('Database not configured. Please check your Supabase settings.');
    }

    const { data, error } = await supabase
      .from('listing_types')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) {
      console.error('Failed to fetch listing types:', error.message);
      throw new Error('Failed to load listing types.');
    }
    
    return data || [];
  },

  async getBySlug(slug) {
    if (!supabase) {
      throw new Error('Database not configured.');
    }

    const { data, error } = await supabase
      .from('listing_types')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Failed to fetch listing type:', error.message);
      throw new Error('Failed to load listing type.');
    }
    
    return data;
  },

  async create(listingType) {
    if (!supabase) {
      throw new Error('Database not configured.');
    }

    const { data, error } = await supabase
      .from('listing_types')
      .insert({
        name: listingType.name,
        slug: listingType.slug,
        description: listingType.description || null,
        icon: listingType.icon || null,
        sort_order: listingType.sort_order || 0,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create listing type:', error.message);
      throw new Error('Failed to create listing type.');
    }
    
    return data;
  },

  async update(id, updates) {
    if (!supabase) {
      throw new Error('Database not configured.');
    }

    const updateData = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.slug !== undefined) updateData.slug = updates.slug;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.icon !== undefined) updateData.icon = updates.icon;
    if (updates.sort_order !== undefined) updateData.sort_order = updates.sort_order;
    if (updates.is_active !== undefined) updateData.is_active = updates.is_active;

    const { data, error } = await supabase
      .from('listing_types')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update listing type:', error.message);
      throw new Error('Failed to update listing type.');
    }
    
    return data;
  },

  async delete(id) {
    if (!supabase) {
      throw new Error('Database not configured.');
    }

    const { error } = await supabase
      .from('listing_types')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Failed to delete listing type:', error.message);
      throw new Error('Failed to delete listing type.');
    }
    
    return true;
  },
};
