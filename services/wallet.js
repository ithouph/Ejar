import { supabase } from '../config/supabase';

function formatTransaction(tx) {
  if (!tx) return null;
  return {
    id: tx.id,
    userId: tx.user_id,
    type: tx.type,
    amount: parseFloat(tx.amount) || 0,
    status: tx.status,
    paymentMethod: tx.payment_method,
    screenshotUrl: tx.screenshot_url,
    approvedBy: tx.approved_by,
    approvedAt: tx.approved_at,
    notes: tx.notes,
    createdAt: tx.created_at,
    city: tx.cities ? {
      id: tx.cities.id,
      name: tx.cities.name,
    } : null,
  };
}

export const wallet = {
  async getBalance(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('wallet_balance_mru, free_posts_remaining')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return {
      balance: parseFloat(data.wallet_balance_mru) || 0,
      freePostsRemaining: data.free_posts_remaining || 0,
    };
  },

  async getTransactions(userId, limit = 50) {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select(`
        *,
        cities (id, name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []).map(tx => formatTransaction(tx));
  },

  async createDepositRequest(userId, cityId, amount, paymentMethod, screenshotUri) {
    let screenshotUrl = null;
    if (screenshotUri) {
      const response = await fetch(screenshotUri);
      const blob = await response.blob();
      const fileName = `${userId}_${Date.now()}.jpg`;
      const filePath = `payment-screenshots/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('transactions')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('transactions')
          .getPublicUrl(filePath);
        screenshotUrl = publicUrl;
      }
    }

    const { data, error } = await supabase
      .from('wallet_transactions')
      .insert({
        user_id: userId,
        city_id: cityId,
        type: 'deposit',
        amount: amount,
        payment_method: paymentMethod,
        screenshot_url: screenshotUrl,
        status: 'pending',
      })
      .select(`
        *,
        cities (id, name)
      `)
      .single();

    if (error) throw error;
    return formatTransaction(data);
  },

  async getPendingDeposits(cityId) {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select(`
        *,
        users (id, first_name, last_name, phone),
        cities (id, name)
      `)
      .eq('type', 'deposit')
      .eq('status', 'pending')
      .eq('city_id', cityId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async approveDeposit(transactionId, approverId) {
    const { data: tx, error: fetchError } = await supabase
      .from('wallet_transactions')
      .select('user_id, amount')
      .eq('id', transactionId)
      .single();

    if (fetchError) throw fetchError;

    const { error: updateTxError } = await supabase
      .from('wallet_transactions')
      .update({
        status: 'completed',
        approved_by: approverId,
        approved_at: new Date().toISOString(),
      })
      .eq('id', transactionId);

    if (updateTxError) throw updateTxError;

    await supabase.rpc('add_balance', {
      p_user_id: tx.user_id,
      p_amount: tx.amount,
    }).catch(() => {});

    return true;
  },

  async rejectDeposit(transactionId, approverId, reason) {
    const { error } = await supabase
      .from('wallet_transactions')
      .update({
        status: 'rejected',
        approved_by: approverId,
        approved_at: new Date().toISOString(),
        notes: reason,
      })
      .eq('id', transactionId);

    if (error) throw error;
    return true;
  },
};
