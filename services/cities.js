import { supabase } from '../config/supabase';

const FALLBACK_CITIES = [
  { id: 'city-1', name: 'Nouakchott', region: 'Nouakchott', is_active: true },
  { id: 'city-2', name: 'Nouadhibou', region: 'Dakhlet Nouadhibou', is_active: true },
  { id: 'city-3', name: 'Kiffa', region: 'Assaba', is_active: true },
  { id: 'city-4', name: 'Kaédi', region: 'Gorgol', is_active: true },
  { id: 'city-5', name: 'Rosso', region: 'Trarza', is_active: true },
  { id: 'city-6', name: 'Zouérat', region: 'Tiris Zemmour', is_active: true },
  { id: 'city-7', name: 'Atar', region: 'Adrar', is_active: true },
  { id: 'city-8', name: 'Néma', region: 'Hodh Ech Chargui', is_active: true },
  { id: 'city-9', name: 'Sélibaby', region: 'Guidimaka', is_active: true },
  { id: 'city-10', name: 'Aleg', region: 'Brakna', is_active: true },
];

export const cities = {
  async getAll() {
    if (!supabase) {
      console.log('Supabase not configured, using fallback cities');
      return FALLBACK_CITIES;
    }

    try {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data && data.length > 0 ? data : FALLBACK_CITIES;
    } catch (error) {
      console.log('Cities fetch failed, using fallback:', error.message);
      return FALLBACK_CITIES;
    }
  },

  async getById(cityId) {
    if (!supabase) {
      return FALLBACK_CITIES.find(c => c.id === cityId) || null;
    }

    try {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .eq('id', cityId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.log('City fetch failed, using fallback:', error.message);
      return FALLBACK_CITIES.find(c => c.id === cityId) || null;
    }
  },

  async getByName(name) {
    if (!supabase) {
      return FALLBACK_CITIES.find(c => c.name.toLowerCase() === name.toLowerCase()) || null;
    }

    try {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .ilike('name', name)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.log('City fetch by name failed, using fallback:', error.message);
      return FALLBACK_CITIES.find(c => c.name.toLowerCase() === name.toLowerCase()) || null;
    }
  },

  async create(city) {
    if (!supabase) {
      throw new Error('Supabase not configured');
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

    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    if (!supabase) {
      throw new Error('Supabase not configured');
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

    if (error) throw error;
    return data;
  },

  async delete(id) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { error } = await supabase
      .from('cities')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
    return true;
  },
};
