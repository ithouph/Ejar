import { supabase } from '../config/supabase';

export const amenities = {
  async getAll() {
    if (!supabase) {
      console.warn('Supabase not configured, returning empty array');
      return [];
    }

    const { data, error } = await supabase
      .from('amenities')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return data || [];
  },

  async getByCategory(category) {
    if (!supabase) {
      console.warn('Supabase not configured, returning empty array');
      return [];
    }

    const { data, error } = await supabase
      .from('amenities')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return data || [];
  },

  async getIndoor() {
    return this.getByCategory('indoor');
  },

  async getNearby() {
    return this.getByCategory('nearby');
  },

  async create(amenity) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('amenities')
      .insert({
        name: amenity.name,
        slug: amenity.slug,
        category: amenity.category,
        icon: amenity.icon || null,
        sort_order: amenity.sort_order || 0,
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
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.icon !== undefined) updateData.icon = updates.icon;
    if (updates.sort_order !== undefined) updateData.sort_order = updates.sort_order;
    if (updates.is_active !== undefined) updateData.is_active = updates.is_active;

    const { data, error } = await supabase
      .from('amenities')
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
      .from('amenities')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  async savePostAmenities(postId, amenityIds) {
    if (!supabase) {
      console.warn('Supabase not configured, skipping post amenities save');
      return [];
    }

    if (!amenityIds || amenityIds.length === 0) return [];

    const records = amenityIds.map(amenityId => ({
      post_id: postId,
      amenity_id: amenityId,
    }));

    const { data, error } = await supabase
      .from('post_amenities')
      .insert(records)
      .select();

    if (error) throw error;
    return data || [];
  },

  async getPostAmenities(postId) {
    if (!supabase) {
      console.warn('Supabase not configured, returning empty array');
      return [];
    }

    const { data, error } = await supabase
      .from('post_amenities')
      .select('*, amenity:amenities(*)')
      .eq('post_id', postId);

    if (error) throw error;
    return data || [];
  },

  async deletePostAmenities(postId) {
    if (!supabase) {
      console.warn('Supabase not configured');
      return true;
    }

    const { error } = await supabase
      .from('post_amenities')
      .delete()
      .eq('post_id', postId);

    if (error) throw error;
    return true;
  },
};
