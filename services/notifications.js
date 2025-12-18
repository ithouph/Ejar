import { supabase } from '../config/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEV_NOTIFICATIONS_KEY = '@ejar_dev_notifications';

async function getDevNotifications() {
  try {
    const notifStr = await AsyncStorage.getItem(DEV_NOTIFICATIONS_KEY);
    return notifStr ? JSON.parse(notifStr) : [];
  } catch {
    return [];
  }
}

async function saveDevNotifications(notifications) {
  await AsyncStorage.setItem(DEV_NOTIFICATIONS_KEY, JSON.stringify(notifications));
}

function formatNotification(notif) {
  if (!notif) return null;
  return {
    id: notif.id,
    userId: notif.user_id,
    type: notif.type,
    title: notif.title,
    message: notif.message,
    data: notif.data,
    read: notif.read,
    createdAt: notif.created_at,
  };
}

export const notifications = {
  async getAll(userId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []).map(n => formatNotification(n));
    } catch {
      const devNotifications = await getDevNotifications();
      return devNotifications.filter(n => n.user_id === userId).slice(0, limit).map(n => formatNotification(n));
    }
  },

  async getUnreadCount(userId) {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    } catch {
      const devNotifications = await getDevNotifications();
      return devNotifications.filter(n => n.user_id === userId && !n.read).length;
    }
  },

  async markAsRead(notificationId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch {
      const devNotifications = await getDevNotifications();
      const index = devNotifications.findIndex(n => n.id === notificationId);
      if (index !== -1) {
        devNotifications[index].read = true;
        await saveDevNotifications(devNotifications);
      }
      return true;
    }
  },

  async markAllAsRead(userId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      return true;
    } catch {
      const devNotifications = await getDevNotifications();
      devNotifications.forEach(n => {
        if (n.user_id === userId) {
          n.read = true;
        }
      });
      await saveDevNotifications(devNotifications);
      return true;
    }
  },

  async create(userId, type, title, message, data = null) {
    try {
      const { data: notif, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          message,
          data,
          read: false,
        })
        .select()
        .single();

      if (error) throw error;
      return formatNotification(notif);
    } catch {
      const devNotifications = await getDevNotifications();
      const newNotif = {
        id: 'notif-' + Date.now(),
        user_id: userId,
        type,
        title,
        message,
        data,
        read: false,
        created_at: new Date().toISOString(),
      };
      devNotifications.unshift(newNotif);
      await saveDevNotifications(devNotifications);
      return formatNotification(newNotif);
    }
  },

  async notifyPaymentApproved(userId, amount) {
    return this.create(
      userId,
      'payment_approved',
      'Payment Approved',
      `Your deposit of ${amount} MRU has been approved and added to your wallet.`,
      { amount }
    );
  },

  async notifyPaymentRejected(userId, amount, reason) {
    return this.create(
      userId,
      'payment_rejected',
      'Payment Rejected',
      `Your deposit of ${amount} MRU was rejected. Reason: ${reason}`,
      { amount, reason }
    );
  },

  async notifyApprovalReward(memberId, amount) {
    return this.create(
      memberId,
      'approval_reward',
      'Approval Reward',
      `You earned ${amount} MRU for approving a payment.`,
      { amount }
    );
  },

  async notifyRolePromotion(userId, newRole, promotedByName) {
    const roleNames = {
      member: 'Member',
      ex_member: 'Ex-Member',
      leader: 'Leader',
    };
    return this.create(
      userId,
      'role_promoted',
      'Role Upgraded',
      `Congratulations! You have been promoted to ${roleNames[newRole] || newRole} by ${promotedByName}.`,
      { newRole }
    );
  },

  async notifySubscriptionRenewed(userId, nextDueDate) {
    return this.create(
      userId,
      'subscription_renewed',
      'Subscription Renewed',
      `Your Ex-Member subscription has been renewed. Next payment due: ${new Date(nextDueDate).toLocaleDateString()}.`,
      { nextDueDate }
    );
  },

  async notifySubscriptionExpired(userId) {
    return this.create(
      userId,
      'subscription_expired',
      'Subscription Expired',
      'Your Ex-Member subscription has expired due to insufficient balance. Add 2000 MRU to restore your status.',
      null
    );
  },

  async notifyReportFiled(memberId, reporterName) {
    return this.create(
      memberId,
      'report_filed',
      'Report Filed Against You',
      `A user has filed a report against you for an unfair payment rejection. A leader will review this report.`,
      null
    );
  },

  async notifyReportResolved(userId, approved) {
    return this.create(
      userId,
      'report_resolved',
      approved ? 'Report Approved' : 'Report Rejected',
      approved 
        ? 'Your report was approved. The member has been charged a 500 MRU penalty.'
        : 'Your report was reviewed and rejected by a leader.',
      { approved }
    );
  },

  async notifyPenaltyCharged(memberId, amount) {
    return this.create(
      memberId,
      'penalty_charged',
      'Penalty Charged',
      `A penalty of ${amount} MRU has been deducted from your wallet due to an approved report.`,
      { amount }
    );
  },

  async notifyBalanceLow(userId, balance, threshold) {
    return this.create(
      userId,
      'balance_low',
      'Low Balance Warning',
      `Your wallet balance (${balance} MRU) is below the minimum threshold of ${threshold} MRU.`,
      { balance, threshold }
    );
  },

  async notifyPostCreated(userId, postTitle, wasFree, cost) {
    return this.create(
      userId,
      'post_created',
      'Post Created',
      wasFree 
        ? `Your post "${postTitle}" has been published (free post used).`
        : `Your post "${postTitle}" has been published. ${cost} MRU was deducted from your wallet.`,
      { postTitle, wasFree, cost }
    );
  },
};
