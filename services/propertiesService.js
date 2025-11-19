import { supabase } from '../config/supabase';

export const propertiesService = {
  async getProperties(filters = {}) {
    try {
      let query = supabase
        .from('properties')
        .select(`
          *,
          property_photos (url, category, order_index),
          amenities (name, icon)
        `)
        .order('created_at', { ascending: false });

      if (filters.type) {
        query = query.eq('type', filters.type);
      }

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters.minPrice) {
        query = query.gte('price_per_night', filters.minPrice);
      }

      if (filters.maxPrice) {
        query = query.lte('price_per_night', filters.maxPrice);
      }

      if (filters.minRating) {
        query = query.gte('rating', filters.minRating);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  },

  async getProperty(id) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_photos (url, category, order_index),
          amenities (name, icon),
          reviews (
            id,
            rating,
            title,
            comment,
            created_at,
            users (full_name, photo_url)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching property:', error);
      throw error;
    }
  },

  async searchProperties(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_photos (url, category, order_index),
          amenities (name, icon)
        `)
        .or(`title.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching properties:', error);
      throw error;
    }
  },

  async getFeaturedProperties(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_photos (url, category, order_index),
          amenities (name, icon)
        `)
        .gte('rating', 4.5)
        .order('rating', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      throw error;
    }
  },
};
