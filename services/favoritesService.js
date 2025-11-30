import { supabase } from '../config/supabase';

export const favoritesService = {
  async getFavorites(userId) {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          property_id,
          created_at,
          properties (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  },

  async addFavorite(userId, propertyId) {
    try {
      const { data, error} = await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          property_id: propertyId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  },

  async removeFavorite(userId, propertyId) {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('property_id', propertyId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  },

  async isFavorite(userId, propertyId) {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('property_id', propertyId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  },

  async toggleFavorite(userId, propertyId) {
    try {
      const isFav = await this.isFavorite(userId, propertyId);
      
      if (isFav) {
        await this.removeFavorite(userId, propertyId);
        return { action: 'removed', isFavorite: false };
      } else {
        await this.addFavorite(userId, propertyId);
        return { action: 'added', isFavorite: true };
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  },

  async getFavoriteIds(userId) {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('property_id')
        .eq('user_id', userId);

      if (error) throw error;
      return (data || []).map(fav => fav.property_id);
    } catch (error) {
      console.error('Error fetching favorite IDs:', error);
      return [];
    }
  },
};
