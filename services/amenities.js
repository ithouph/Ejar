import { supabase } from '../config/supabase';

export const amenities = {
  async getAll() {
    const { data, error } = await supabase
      .from('amenities')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return data || [];
  },

  async getByCategory(category) {
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

  async savePostAmenities(postId, amenityIds) {
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
    const { data, error } = await supabase
      .from('post_amenities')
      .select('*, amenity:amenities(*)')
      .eq('post_id', postId);

    if (error) throw error;
    return data || [];
  },

  async deletePostAmenities(postId) {
    const { error } = await supabase
      .from('post_amenities')
      .delete()
      .eq('post_id', postId);

    if (error) throw error;
    return true;
  },
};
