import { supabase } from '../config/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEV_WALLET_KEY = '@ejar_dev_wallet';
const DEV_TRANSACTIONS_KEY = '@ejar_dev_transactions';

const POST_COST_MRU = 10;
const MEMBER_APPROVAL_REWARD = 5;
const MEMBER_MIN_BALANCE = 1000;
const EX_MEMBER_ACTIVATION_COST = 2000;
const EX_MEMBER_MONTHLY_FEE = 500;
const REPORT_PENALTY = 500;

async function getDevWallet() {
  try {
    const walletStr = await AsyncStorage.getItem(DEV_WALLET_KEY);
    if (walletStr) {
      return JSON.parse(walletStr);
    }
    return { balance: 5000, freePostsRemaining: 5 };
  } catch {
    return { balance: 5000, freePostsRemaining: 5 };
  }
}

async function saveDevWallet(wallet) {
  await AsyncStorage.setItem(DEV_WALLET_KEY, JSON.stringify(wallet));
}

async function getDevTransactions() {
  try {
    const txStr = await AsyncStorage.getItem(DEV_TRANSACTIONS_KEY);
    return txStr ? JSON.parse(txStr) : [];
  } catch {
    return [];
  }
}

async function saveDevTransactions(transactions) {
  await AsyncStorage.setItem(DEV_TRANSACTIONS_KEY, JSON.stringify(transactions));
}

function getTimeAgo(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function getTypeLabel(type) {
  const labels = {
    deposit: 'Deposit',
    withdrawal: 'Withdrawal',
    post_payment: 'Post Payment',
    approval_reward: 'Approval Reward',
    refund: 'Refund',
    report_penalty: 'Report Penalty',
    ex_member_subscription: 'Subscription',
  };
  return labels[type] || type;
}

function getStatusLabel(status) {
  const labels = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    assigned_to_leader: 'Under Review',
  };
  return labels[status] || status;
}

function formatTransaction(tx) {
  if (!tx) return null;
  const amount = Math.abs(parseFloat(tx.amount_mru) || parseFloat(tx.amount) || 0);
  const balanceAfter = parseFloat(tx.balance_after_mru) || 0;
  
  return {
    id: tx.id,
    userId: tx.user_id,
    cityId: tx.city_id,
    type: tx.type,
    typeLabel: getTypeLabel(tx.type),
    statusLabel: getStatusLabel(tx.status),
    timeAgo: getTimeAgo(tx.created_at),
    amount: amount,
    balanceAfter: balanceAfter,
    amountMru: parseFloat(tx.amount_mru) || parseFloat(tx.amount) || 0,
    balanceBeforeMru: parseFloat(tx.balance_before_mru) || 0,
    balanceAfterMru: balanceAfter,
    status: tx.status,
    paymentMethod: tx.payment_method,
    paymentScreenshotUrl: tx.payment_screenshot_url,
    transactionReference: tx.transaction_reference,
    assignedMemberId: tx.assigned_member_id,
    approvedByMemberId: tx.approved_by_member_id,
    approvedByLeaderId: tx.approved_by_leader_id,
    approvedAt: tx.approved_at,
    rejectionReason: tx.rejection_reason,
    relatedPostId: tx.related_post_id,
    createdAt: tx.created_at,
    updatedAt: tx.updated_at,
    user: tx.users ? {
      id: tx.users.id,
      firstName: tx.users.first_name,
      lastName: tx.users.last_name,
      phone: tx.users.phone,
    } : null,
    city: tx.cities ? {
      id: tx.cities.id,
      name: tx.cities.name,
    } : null,
  };
}

export const wallet = {
  POST_COST_MRU,
  MEMBER_APPROVAL_REWARD,
  MEMBER_MIN_BALANCE,
  EX_MEMBER_ACTIVATION_COST,
  EX_MEMBER_MONTHLY_FEE,
  REPORT_PENALTY,

  async getBalance(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('wallet_balance_mru, free_posts_remaining, role')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return {
        balance: parseFloat(data.wallet_balance_mru) || 0,
        freePostsRemaining: data.free_posts_remaining || 0,
        role: data.role || 'normal',
      };
    } catch {
      const devWallet = await getDevWallet();
      return {
        balance: devWallet.balance,
        freePostsRemaining: devWallet.freePostsRemaining,
        role: 'normal',
      };
    }
  },

  async getTransactions(userId, limit = 50) {
    try {
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
    } catch {
      const devTransactions = await getDevTransactions();
      return devTransactions.filter(tx => tx.user_id === userId).slice(0, limit).map(tx => formatTransaction(tx));
    }
  },

  async createDepositRequest(userId, cityId, amount, paymentMethod, screenshotUri, transactionReference) {
    const currentBalance = await this.getBalance(userId);
    
    try {
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

      const { data: member } = await supabase
        .from('users')
        .select('id')
        .eq('city_id', cityId)
        .eq('role', 'member')
        .gte('wallet_balance_mru', MEMBER_MIN_BALANCE)
        .limit(1)
        .single();

      const assignedMemberId = member?.id || null;
      const status = assignedMemberId ? 'pending' : 'assigned_to_leader';

      const { data, error } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: userId,
          city_id: cityId,
          type: 'deposit',
          amount_mru: amount,
          balance_before_mru: currentBalance.balance,
          balance_after_mru: currentBalance.balance,
          payment_method: paymentMethod,
          payment_screenshot_url: screenshotUrl || screenshotUri,
          transaction_reference: transactionReference,
          assigned_member_id: assignedMemberId,
          status: status,
        })
        .select(`
          *,
          cities (id, name)
        `)
        .single();

      if (error) throw error;
      return formatTransaction(data);
    } catch (err) {
      const devTransactions = await getDevTransactions();
      const newTx = {
        id: 'tx-' + Date.now(),
        user_id: userId,
        city_id: cityId,
        type: 'deposit',
        amount_mru: amount,
        balance_before_mru: currentBalance.balance,
        balance_after_mru: currentBalance.balance,
        payment_method: paymentMethod,
        payment_screenshot_url: screenshotUri,
        transaction_reference: transactionReference,
        status: 'pending',
        created_at: new Date().toISOString(),
      };
      devTransactions.unshift(newTx);
      await saveDevTransactions(devTransactions);
      return formatTransaction(newTx);
    }
  },

  async getPendingDeposits(cityId, memberId) {
    try {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select(`
          *,
          users (id, first_name, last_name, phone, whatsapp_number),
          cities (id, name)
        `)
        .eq('type', 'deposit')
        .eq('status', 'pending')
        .eq('city_id', cityId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data || []).map(tx => formatTransaction(tx));
    } catch {
      return [];
    }
  },

  async getLeaderPendingDeposits() {
    try {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select(`
          *,
          users (id, first_name, last_name, phone, whatsapp_number),
          cities (id, name)
        `)
        .eq('type', 'deposit')
        .eq('status', 'assigned_to_leader')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data || []).map(tx => formatTransaction(tx));
    } catch {
      return [];
    }
  },

  async approveDeposit(transactionId, approverId, isLeader = false) {
    try {
      const { data: tx, error: fetchError } = await supabase
        .from('wallet_transactions')
        .select('user_id, amount_mru, balance_before_mru')
        .eq('id', transactionId)
        .single();

      if (fetchError) throw fetchError;

      const amount = parseFloat(tx.amount_mru);
      const newBalance = parseFloat(tx.balance_before_mru) + amount;

      const updateData = {
        status: 'approved',
        balance_after_mru: newBalance,
        approved_at: new Date().toISOString(),
      };

      if (isLeader) {
        updateData.approved_by_leader_id = approverId;
      } else {
        updateData.approved_by_member_id = approverId;
      }

      const { error: updateTxError } = await supabase
        .from('wallet_transactions')
        .update(updateData)
        .eq('id', transactionId);

      if (updateTxError) throw updateTxError;

      await supabase
        .from('users')
        .update({ wallet_balance_mru: newBalance })
        .eq('id', tx.user_id);

      if (!isLeader) {
        const { data: member } = await supabase
          .from('users')
          .select('wallet_balance_mru, total_approvals_made, total_earned_from_approvals_mru')
          .eq('id', approverId)
          .single();

        if (member) {
          const memberNewBalance = parseFloat(member.wallet_balance_mru) + MEMBER_APPROVAL_REWARD;
          await supabase
            .from('users')
            .update({
              wallet_balance_mru: memberNewBalance,
              total_approvals_made: (member.total_approvals_made || 0) + 1,
              total_earned_from_approvals_mru: parseFloat(member.total_earned_from_approvals_mru || 0) + MEMBER_APPROVAL_REWARD,
            })
            .eq('id', approverId);

          await supabase
            .from('wallet_transactions')
            .insert({
              user_id: approverId,
              city_id: tx.city_id || null,
              type: 'approval_reward',
              amount_mru: MEMBER_APPROVAL_REWARD,
              balance_before_mru: member.wallet_balance_mru,
              balance_after_mru: memberNewBalance,
              status: 'approved',
            });
        }
      }

      return true;
    } catch (err) {
      console.error('Approve deposit error:', err);
      throw err;
    }
  },

  async rejectDeposit(transactionId, approverId, reason, isLeader = false) {
    try {
      const updateData = {
        status: 'rejected',
        rejection_reason: reason,
        approved_at: new Date().toISOString(),
      };

      if (isLeader) {
        updateData.approved_by_leader_id = approverId;
      } else {
        updateData.approved_by_member_id = approverId;
      }

      const { error } = await supabase
        .from('wallet_transactions')
        .update(updateData)
        .eq('id', transactionId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Reject deposit error:', err);
      throw err;
    }
  },

  async deductPostPayment(userId, cityId, postId) {
    try {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('wallet_balance_mru, role')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      const currentBalance = parseFloat(user.wallet_balance_mru);
      if (currentBalance < POST_COST_MRU) {
        throw new Error('Insufficient balance. Please add funds to your wallet.');
      }

      const newBalance = currentBalance - POST_COST_MRU;

      await supabase
        .from('users')
        .update({ wallet_balance_mru: newBalance })
        .eq('id', userId);

      await supabase
        .from('wallet_transactions')
        .insert({
          user_id: userId,
          city_id: cityId,
          type: 'post_payment',
          amount_mru: -POST_COST_MRU,
          balance_before_mru: currentBalance,
          balance_after_mru: newBalance,
          related_post_id: postId,
          status: 'approved',
        });

      return { success: true, newBalance };
    } catch (err) {
      const devWallet = await getDevWallet();
      if (devWallet.balance < POST_COST_MRU) {
        throw new Error('Insufficient balance. Please add funds to your wallet.');
      }
      devWallet.balance -= POST_COST_MRU;
      await saveDevWallet(devWallet);
      
      const devTransactions = await getDevTransactions();
      devTransactions.unshift({
        id: 'tx-' + Date.now(),
        user_id: userId,
        type: 'post_payment',
        amount_mru: -POST_COST_MRU,
        balance_before_mru: devWallet.balance + POST_COST_MRU,
        balance_after_mru: devWallet.balance,
        status: 'approved',
        created_at: new Date().toISOString(),
      });
      await saveDevTransactions(devTransactions);
      
      return { success: true, newBalance: devWallet.balance };
    }
  },

  async useFreePost(userId) {
    try {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('free_posts_remaining, free_posts_used')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      if (user.free_posts_remaining <= 0) {
        throw new Error('No free posts remaining');
      }

      await supabase
        .from('users')
        .update({
          free_posts_remaining: user.free_posts_remaining - 1,
          free_posts_used: (user.free_posts_used || 0) + 1,
        })
        .eq('id', userId);

      return { success: true, freePostsRemaining: user.free_posts_remaining - 1 };
    } catch (err) {
      const devWallet = await getDevWallet();
      if (devWallet.freePostsRemaining <= 0) {
        throw new Error('No free posts remaining');
      }
      devWallet.freePostsRemaining -= 1;
      await saveDevWallet(devWallet);
      return { success: true, freePostsRemaining: devWallet.freePostsRemaining };
    }
  },

  async canMemberApprove(memberId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('wallet_balance_mru, role')
        .eq('id', memberId)
        .single();

      if (error) throw error;
      
      return {
        canApprove: data.role === 'member' && parseFloat(data.wallet_balance_mru) >= MEMBER_MIN_BALANCE,
        balance: parseFloat(data.wallet_balance_mru),
        role: data.role,
      };
    } catch {
      return { canApprove: false, balance: 0, role: 'normal' };
    }
  },

  async activateExMember(userId) {
    try {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('wallet_balance_mru')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      const currentBalance = parseFloat(user.wallet_balance_mru);
      if (currentBalance < EX_MEMBER_ACTIVATION_COST) {
        throw new Error(`Insufficient balance. You need ${EX_MEMBER_ACTIVATION_COST} MRU to activate Ex-Member status.`);
      }

      const newBalance = currentBalance - EX_MEMBER_ACTIVATION_COST;
      const now = new Date();
      const nextPaymentDue = new Date(now);
      nextPaymentDue.setMonth(nextPaymentDue.getMonth() + 1);

      await supabase
        .from('users')
        .update({
          wallet_balance_mru: newBalance,
          role: 'ex_member',
          ex_member_activated_at: now.toISOString(),
          ex_member_last_payment_at: now.toISOString(),
          ex_member_next_payment_due: nextPaymentDue.toISOString(),
          ex_member_is_active: true,
        })
        .eq('id', userId);

      await supabase
        .from('wallet_transactions')
        .insert({
          user_id: userId,
          type: 'ex_member_subscription',
          amount_mru: -EX_MEMBER_ACTIVATION_COST,
          balance_before_mru: currentBalance,
          balance_after_mru: newBalance,
          status: 'approved',
        });

      await supabase
        .from('subscription_history')
        .insert({
          user_id: userId,
          action: 'activated',
          amount_charged_mru: EX_MEMBER_ACTIVATION_COST,
          balance_before_mru: currentBalance,
          balance_after_mru: newBalance,
          next_payment_due: nextPaymentDue.toISOString(),
        });

      return { success: true, newBalance };
    } catch (err) {
      console.error('Activate ex-member error:', err);
      throw err;
    }
  },

  async chargeReportPenalty(memberId, reportId) {
    try {
      const { data: member, error: memberError } = await supabase
        .from('users')
        .select('wallet_balance_mru, total_report_penalties_paid')
        .eq('id', memberId)
        .single();

      if (memberError) throw memberError;

      const currentBalance = parseFloat(member.wallet_balance_mru);
      const newBalance = Math.max(0, currentBalance - REPORT_PENALTY);

      await supabase
        .from('users')
        .update({
          wallet_balance_mru: newBalance,
          total_reports_received: member.total_reports_received + 1,
          total_report_penalties_paid: parseFloat(member.total_report_penalties_paid || 0) + REPORT_PENALTY,
        })
        .eq('id', memberId);

      const { data: penaltyTx } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: memberId,
          type: 'report_penalty',
          amount_mru: -REPORT_PENALTY,
          balance_before_mru: currentBalance,
          balance_after_mru: newBalance,
          status: 'approved',
        })
        .select()
        .single();

      await supabase
        .from('member_reports')
        .update({
          penalty_charged: true,
          penalty_transaction_id: penaltyTx?.id,
        })
        .eq('id', reportId);

      return { success: true, newBalance };
    } catch (err) {
      console.error('Charge report penalty error:', err);
      throw err;
    }
  },
};
