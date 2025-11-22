import { supabase } from '../config/supabase';

export const walletService = {
  async getWallet(userId) {
    try {
      const { data, error } = await supabase
        .from('wallet_accounts')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        return await this.createWallet(userId);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching wallet:', error);
      throw error;
    }
  },

  async createWallet(userId) {
    try {
      const { data, error } = await supabase
        .from('wallet_accounts')
        .insert({
          user_id: userId,
          balance: 0,
          currency: 'USD',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    }
  },

  async getTransactions(walletId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('wallet_id', walletId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  async addTransaction(walletId, transaction) {
    try {
      const { data, error } = await supabase
        .rpc('add_wallet_transaction', {
          p_wallet_id: walletId,
          p_type: transaction.type,
          p_amount: transaction.amount,
          p_description: transaction.description,
          p_category: transaction.category,
        });

      if (error) throw error;

      return {
        transaction: { id: data.transaction_id },
        newBalance: data.new_balance,
      };
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  },

  async getBalance(walletId) {
    try {
      const { data, error } = await supabase
        .from('wallet_accounts')
        .select('balance')
        .eq('id', walletId)
        .single();

      if (error) throw error;
      return parseFloat(data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  },

  async addBalance(walletId, amount, description = 'Added balance') {
    try {
      const result = await this.addTransaction(walletId, {
        type: 'credit',
        amount: parseFloat(amount),
        description,
        category: 'deposit',
      });

      return result;
    } catch (error) {
      console.error('Error adding balance:', error);
      throw error;
    }
  },

  async deductBalance(walletId, amount, description = 'Deducted balance') {
    try {
      const result = await this.addTransaction(walletId, {
        type: 'debit',
        amount: parseFloat(amount),
        description,
        category: 'withdrawal',
      });

      return result;
    } catch (error) {
      console.error('Error deducting balance:', error);
      throw error;
    }
  },
};
