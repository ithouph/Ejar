import { supabase } from '../config/supabase';

export const balanceRequestService = {
  /**
   * Upload transaction proof image to Supabase storage
   * @param {string} userId - User ID for folder organization
   * @param {string} imageUri - Local image URI
   * @returns {Promise<string>} - Public URL of uploaded image
   */
  async uploadTransactionProof(userId, imageUri) {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      const fileName = `${userId}_${Date.now()}.jpg`;
      const filePath = `transaction-proofs/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('balance-requests')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('balance-requests')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading transaction proof:', error);
      throw error;
    }
  },

  /**
   * Create a new balance request
   * @param {string} userId - User ID
   * @param {string} walletId - Wallet ID
   * @param {number} amount - Amount to add
   * @param {string} imageUri - Local image URI of transaction proof
   * @returns {Promise<Object>} - Created balance request
   */
  async createBalanceRequest(userId, walletId, amount, imageUri) {
    try {
      const imageUrl = await this.uploadTransactionProof(userId, imageUri);

      const { data, error } = await supabase
        .from('balance_requests')
        .insert({
          user_id: userId,
          wallet_id: walletId,
          amount: parseFloat(amount),
          transaction_image_url: imageUrl,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating balance request:', error);
      throw error;
    }
  },

  /**
   * Get all balance requests for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - Array of balance requests
   */
  async getUserBalanceRequests(userId) {
    try {
      const { data, error } = await supabase
        .from('balance_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching balance requests:', error);
      return [];
    }
  },

  /**
   * Get pending balance requests for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - Array of pending balance requests
   */
  async getPendingRequests(userId) {
    try {
      const { data, error } = await supabase
        .from('balance_requests')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      return [];
    }
  },

  /**
   * Admin function: Approve a balance request
   * @param {string} requestId - Request ID
   * @param {string} adminId - Admin user ID
   * @param {string} notes - Admin notes
   * @returns {Promise<Object>} - Updated request
   */
  async approveRequest(requestId, adminId, notes = '') {
    try {
      const { data, error } = await supabase
        .from('balance_requests')
        .update({
          status: 'approved',
          reviewed_by: adminId,
          reviewed_at: new Date().toISOString(),
          admin_notes: notes,
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error approving request:', error);
      throw error;
    }
  },

  /**
   * Admin function: Reject a balance request
   * @param {string} requestId - Request ID
   * @param {string} adminId - Admin user ID
   * @param {string} notes - Rejection reason
   * @returns {Promise<Object>} - Updated request
   */
  async rejectRequest(requestId, adminId, notes) {
    try {
      const { data, error } = await supabase
        .from('balance_requests')
        .update({
          status: 'rejected',
          reviewed_by: adminId,
          reviewed_at: new Date().toISOString(),
          admin_notes: notes,
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error rejecting request:', error);
      throw error;
    }
  },
};
