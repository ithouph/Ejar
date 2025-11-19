import { supabase } from '../config/supabase';

export const weddingService = {
  async getWeddingEvent(userId) {
    try {
      const { data, error } = await supabase
        .from('wedding_events')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        return await this.createWeddingEvent(userId);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching wedding event:', error);
      throw error;
    }
  },

  async createWeddingEvent(userId) {
    try {
      const { data, error } = await supabase
        .from('wedding_events')
        .insert({
          user_id: userId,
          partner1_name: 'Christine',
          partner2_name: 'Duncan',
          event_date: null,
          location: null,
          description: null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating wedding event:', error);
      throw error;
    }
  },

  async updateWeddingEvent(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('wedding_events')
        .update({
          partner1_name: updates.partner1_name,
          partner2_name: updates.partner2_name,
          event_date: updates.event_date,
          location: updates.location,
          description: updates.description,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating wedding event:', error);
      throw error;
    }
  },
};
