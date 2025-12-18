import { supabase } from '../config/supabase';

export const categories = {
  async getAll() {
    if (!supabase) {
      throw new Error('Database not configured. Please check your Supabase settings.');
    }

    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Failed to fetch categories:', error.message);
      throw new Error('Failed to load categories.');
    }
    
    return data || [];
  },

  async getById(categoryId) {
    if (!supabase) {
      throw new Error('Database not configured.');
    }

    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .eq('id', categoryId)
      .single();

    if (error) {
      console.error('Failed to fetch category:', error.message);
      throw new Error('Failed to load category.');
    }
    
    return data;
  },

  async getByType(type) {
    if (!supabase) {
      throw new Error('Database not configured.');
    }

    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .eq('type', type);

    if (error) {
      console.error('Failed to fetch categories by type:', error.message);
      throw new Error('Failed to load categories.');
    }
    
    return data || [];
  },

  async getBySlug(slug) {
    if (!supabase) {
      throw new Error('Database not configured.');
    }

    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error('Failed to fetch category by slug:', error.message);
      throw new Error('Failed to load category.');
    }
    
    return data;
  },

  async create(category) {
    if (!supabase) {
      throw new Error('Database not configured.');
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

    if (error) {
      console.error('Failed to create category:', error.message);
      throw new Error('Failed to create category.');
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
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.metadata !== undefined) updateData.metadata = updates.metadata;

    const { data, error } = await supabase
      .from('service_categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update category:', error.message);
      throw new Error('Failed to update category.');
    }
    
    return data;
  },

  async delete(id) {
    if (!supabase) {
      throw new Error('Database not configured.');
    }

    const { error } = await supabase
      .from('service_categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete category:', error.message);
      throw new Error('Failed to delete category.');
    }
    
    return true;
  },
};
