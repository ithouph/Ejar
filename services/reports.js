import { supabase } from '../config/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wallet } from './wallet';
import { notifications } from './notifications';

const DEV_REPORTS_KEY = '@ejar_dev_reports';

async function getDevReports() {
  try {
    const reportsStr = await AsyncStorage.getItem(DEV_REPORTS_KEY);
    return reportsStr ? JSON.parse(reportsStr) : [];
  } catch {
    return [];
  }
}

async function saveDevReports(reports) {
  await AsyncStorage.setItem(DEV_REPORTS_KEY, JSON.stringify(reports));
}

function formatReport(report) {
  if (!report) return null;
  return {
    id: report.id,
    reporterUserId: report.reporter_user_id,
    reportedMemberId: report.reported_member_id,
    transactionId: report.transaction_id,
    reason: report.reason,
    details: report.details,
    status: report.status,
    reviewedByLeaderId: report.reviewed_by_leader_id,
    reviewedAt: report.reviewed_at,
    leaderNotes: report.leader_notes,
    penaltyCharged: report.penalty_charged,
    penaltyTransactionId: report.penalty_transaction_id,
    createdAt: report.created_at,
    updatedAt: report.updated_at,
    reporter: report.reporter ? {
      id: report.reporter.id,
      firstName: report.reporter.first_name,
      lastName: report.reporter.last_name,
      phone: report.reporter.phone,
    } : null,
    reportedMember: report.reported_member ? {
      id: report.reported_member.id,
      firstName: report.reported_member.first_name,
      lastName: report.reported_member.last_name,
      phone: report.reported_member.phone,
    } : null,
    transaction: report.wallet_transactions ? {
      id: report.wallet_transactions.id,
      amountMru: parseFloat(report.wallet_transactions.amount_mru),
      paymentMethod: report.wallet_transactions.payment_method,
      paymentScreenshotUrl: report.wallet_transactions.payment_screenshot_url,
      rejectionReason: report.wallet_transactions.rejection_reason,
      createdAt: report.wallet_transactions.created_at,
    } : null,
  };
}

export const reports = {
  async create(reporterUserId, reportedMemberId, transactionId, reason, details = '') {
    try {
      const { data, error } = await supabase
        .from('member_reports')
        .insert({
          reporter_user_id: reporterUserId,
          reported_member_id: reportedMemberId,
          transaction_id: transactionId,
          reason,
          details,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      await notifications.notifyReportFiled(reportedMemberId, 'A user');

      return formatReport(data);
    } catch (err) {
      const devReports = await getDevReports();
      const newReport = {
        id: 'report-' + Date.now(),
        reporter_user_id: reporterUserId,
        reported_member_id: reportedMemberId,
        transaction_id: transactionId,
        reason,
        details,
        status: 'pending',
        created_at: new Date().toISOString(),
      };
      devReports.unshift(newReport);
      await saveDevReports(devReports);
      return formatReport(newReport);
    }
  },

  async getByUser(userId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('member_reports')
        .select(`
          *,
          reported_member:reported_member_id (id, first_name, last_name, phone),
          wallet_transactions (id, amount_mru, payment_method, rejection_reason, created_at)
        `)
        .eq('reporter_user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []).map(r => formatReport(r));
    } catch {
      const devReports = await getDevReports();
      return devReports.filter(r => r.reporter_user_id === userId).slice(0, limit).map(r => formatReport(r));
    }
  },

  async getPending(limit = 100) {
    try {
      const { data, error } = await supabase
        .from('member_reports')
        .select(`
          *,
          reporter:reporter_user_id (id, first_name, last_name, phone),
          reported_member:reported_member_id (id, first_name, last_name, phone, wallet_balance_mru),
          wallet_transactions (id, amount_mru, payment_method, payment_screenshot_url, rejection_reason, created_at)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return (data || []).map(r => formatReport(r));
    } catch {
      const devReports = await getDevReports();
      return devReports.filter(r => r.status === 'pending').slice(0, limit).map(r => formatReport(r));
    }
  },

  async approve(reportId, leaderId, notes = '') {
    try {
      const { data: report, error: fetchError } = await supabase
        .from('member_reports')
        .select('reported_member_id, reporter_user_id')
        .eq('id', reportId)
        .single();

      if (fetchError) throw fetchError;

      await wallet.chargeReportPenalty(report.reported_member_id, reportId);

      const { error: updateError } = await supabase
        .from('member_reports')
        .update({
          status: 'approved',
          reviewed_by_leader_id: leaderId,
          reviewed_at: new Date().toISOString(),
          leader_notes: notes,
        })
        .eq('id', reportId);

      if (updateError) throw updateError;

      await notifications.notifyReportResolved(report.reporter_user_id, true);
      await notifications.notifyPenaltyCharged(report.reported_member_id, wallet.REPORT_PENALTY);

      return true;
    } catch (err) {
      console.error('Approve report error:', err);
      throw err;
    }
  },

  async reject(reportId, leaderId, notes = '') {
    try {
      const { data: report, error: fetchError } = await supabase
        .from('member_reports')
        .select('reporter_user_id')
        .eq('id', reportId)
        .single();

      if (fetchError) throw fetchError;

      const { error: updateError } = await supabase
        .from('member_reports')
        .update({
          status: 'rejected',
          reviewed_by_leader_id: leaderId,
          reviewed_at: new Date().toISOString(),
          leader_notes: notes,
        })
        .eq('id', reportId);

      if (updateError) throw updateError;

      await notifications.notifyReportResolved(report.reporter_user_id, false);

      return true;
    } catch (err) {
      console.error('Reject report error:', err);
      throw err;
    }
  },

  async getByMember(memberId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('member_reports')
        .select(`
          *,
          reporter:reporter_user_id (id, first_name, last_name),
          wallet_transactions (id, amount_mru, rejection_reason)
        `)
        .eq('reported_member_id', memberId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []).map(r => formatReport(r));
    } catch {
      const devReports = await getDevReports();
      return devReports.filter(r => r.reported_member_id === memberId).slice(0, limit).map(r => formatReport(r));
    }
  },
};
