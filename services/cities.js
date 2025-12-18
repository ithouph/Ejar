import { supabase } from '../config/supabase';

export const cities = {
  async getAll() {
    if (!supabase) {
      throw new Error('Database not configured. Please check your Supabase settings.');
    }

    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Failed to fetch cities:', error.message);
      throw new Error('Failed to load cities. Please try again.');
    }
    
    return data || [];
  },

  async getById(cityId) {
    if (!supabase) {
      throw new Error('Database not configured.');
    }

    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('id', cityId)
      .single();

    if (error) {
      console.error('Failed to fetch city:', error.message);
      throw new Error('Failed to load city details.');
    }
    
    return data;
  },

  async getByName(name) {
    if (!supabase) {
      throw new Error('Database not configured.');
    }

    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .ilike('name', name)
      .maybeSingle();

    if (error) {
      console.error('Failed to fetch city by name:', error.message);
      throw new Error('Failed to find city.');
    }
    
    return data;
  },

  async create(city) {
    if (!supabase) {
      throw new Error('Database not configured.');
    }

    const { data, error } = await supabase
      .from('cities')
      .insert({
        name: city.name,
        region: city.region || null,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create city:', error.message);
      throw new Error('Failed to create city.');
    }
    
    return data;
  },

  async update(id, updates) {
    if (!supabase) {
      throw new Error('Database not configured.');
    }

    const updateData = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.region !== undefined) updateData.region = updates.region;
    if (updates.is_active !== undefined) updateData.is_active = updates.is_active;

    const { data, error } = await supabase
      .from('cities')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update city:', error.message);
      throw new Error('Failed to update city.');
    }
    
    return data;
  },

  async delete(id) {
    if (!supabase) {
      throw new Error('Database not configured.');
    }

    const { error } = await supabase
      .from('cities')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Failed to delete city:', error.message);
      throw new Error('Failed to delete city.');
    }
    
    return true;
  },
};
