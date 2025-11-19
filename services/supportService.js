import { supabase } from '../config/supabase';
import * as ImagePicker from 'expo-image-picker';

/**
 * ═══════════════════════════════════════════════════════════════════
 * SUPPORT SERVICE - Payment Requests & Chat
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Manages:
 * - Payment requests (add balance requests)
 * - Chat messages with support team
 * - Image uploads for payment proof
 * - Approve/deny functionality
 * 
 * BACKEND: Connects to Supabase tables
 * - payment_requests: stores payment requests with images
 * - support_messages: stores chat messages
 * 
 * FALLBACK: Uses static data when Supabase is not configured
 */

export const supportService = {
  /**
   * ═══════════════════════════════════════════════════════════════
   * CREATE PAYMENT REQUEST
   * ═══════════════════════════════════════════════════════════════
   * 
   * When user wants to add balance:
   * 1. User uploads payment proof image
   * 2. Creates request with amount and image
   * 3. Support team can approve/deny
   */
  async createPaymentRequest(userId, amount, imageUri, description) {
    try {
      // Upload image first
      const imageUrl = await this.uploadPaymentProof(userId, imageUri);
      
      const { data, error } = await supabase
        .from('payment_requests')
        .insert({
          user_id: userId,
          amount: amount,
          image_url: imageUrl,
          description: description,
          status: 'pending', // pending, approved, denied
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating payment request:', error);
      // FALLBACK: Return mock data for testing
      return {
        id: 'mock-request-' + Date.now(),
        user_id: userId,
        amount: amount,
        image_url: imageUri,
        description: description,
        status: 'pending',
        created_at: new Date().toISOString(),
      };
    }
  },

  /**
   * ═══════════════════════════════════════════════════════════════
   * UPLOAD PAYMENT PROOF IMAGE
   * ═══════════════════════════════════════════════════════════════
   * 
   * Uploads image to Supabase Storage
   */
  async uploadPaymentProof(userId, imageUri) {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      const fileName = `payment-proof-${userId}-${Date.now()}.jpg`;
      const filePath = `payment-proofs/${fileName}`;

      const { data, error } = await supabase.storage
        .from('payment-proofs')
        .upload(filePath, blob);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      // FALLBACK: Return the local URI for testing
      return imageUri;
    }
  },

  /**
   * ═══════════════════════════════════════════════════════════════
   * GET USER PAYMENT REQUESTS
   * ═══════════════════════════════════════════════════════════════
   */
  async getPaymentRequests(userId) {
    try {
      const { data, error } = await supabase
        .from('payment_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching payment requests:', error);
      // FALLBACK: Return mock data
      return [];
    }
  },

  /**
   * ═══════════════════════════════════════════════════════════════
   * APPROVE/DENY PAYMENT REQUEST (Support Team Only)
   * ═══════════════════════════════════════════════════════════════
   */
  async updatePaymentRequestStatus(requestId, status, reviewNote) {
    try {
      const { data, error } = await supabase
        .from('payment_requests')
        .update({
          status: status, // 'approved' or 'denied'
          review_note: reviewNote,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;
      
      // If approved, add balance to wallet
      if (status === 'approved' && data.user_id) {
        await this.addBalanceToWallet(data.user_id, data.amount);
      }
      
      return data;
    } catch (error) {
      console.error('Error updating payment request:', error);
      throw error;
    }
  },

  /**
   * ═══════════════════════════════════════════════════════════════
   * ADD BALANCE TO WALLET (After approval)
   * ═══════════════════════════════════════════════════════════════
   */
  async addBalanceToWallet(userId, amount) {
    try {
      const { data, error } = await supabase
        .rpc('add_balance_to_wallet', {
          p_user_id: userId,
          p_amount: amount,
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding balance:', error);
      return null;
    }
  },

  /**
   * ═══════════════════════════════════════════════════════════════
   * CHAT MESSAGES
   * ═══════════════════════════════════════════════════════════════
   */
  async sendMessage(userId, paymentRequestId, message, imageUri = null) {
    try {
      let imageUrl = null;
      if (imageUri) {
        imageUrl = await this.uploadPaymentProof(userId, imageUri);
      }

      const { data, error } = await supabase
        .from('support_messages')
        .insert({
          user_id: userId,
          payment_request_id: paymentRequestId,
          message: message,
          image_url: imageUrl,
          sender_type: 'user', // 'user' or 'support'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      // FALLBACK: Return mock message
      return {
        id: 'mock-msg-' + Date.now(),
        user_id: userId,
        payment_request_id: paymentRequestId,
        message: message,
        image_url: imageUri,
        sender_type: 'user',
        created_at: new Date().toISOString(),
      };
    }
  },

  async getMessages(paymentRequestId) {
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('payment_request_id', paymentRequestId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      // FALLBACK: Return mock messages
      return [
        {
          id: 'welcome-msg',
          message: 'Hello! Please upload your payment proof and we will review it shortly.',
          sender_type: 'support',
          created_at: new Date().toISOString(),
        },
      ];
    }
  },

  /**
   * ═══════════════════════════════════════════════════════════════
   * PICK IMAGE FROM DEVICE
   * ═══════════════════════════════════════════════════════════════
   */
  async pickImage() {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        throw new Error('Permission to access media library denied');
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (result.canceled) {
        return null;
      }

      return result.assets[0].uri;
    } catch (error) {
      console.error('Error picking image:', error);
      throw error;
    }
  },
};
