import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView, View, Pressable, ActivityIndicator, Alert, Linking, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { Spacing, BorderRadius } from '../theme/global';
import { useAuth } from '../contexts/AuthContext';
import { wallet as walletApi, notifications } from '../services';
import { useFocusEffect } from '@react-navigation/native';

function DepositCard({ deposit, theme, onApprove, onReject, processing }) {
  const [showScreenshot, setShowScreenshot] = useState(false);
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const userName = deposit.user 
    ? `${deposit.user.firstName || ''} ${deposit.user.lastName || ''}`.trim() 
    : 'Unknown User';

  return (
    <View style={[styles.depositCard, { backgroundColor: theme.surface }]}>
      <View style={styles.depositHeader}>
        <View style={styles.userInfo}>
          <View style={[styles.avatar, { backgroundColor: theme.primary + '20' }]}>
            <Feather name="user" size={20} color={theme.primary} />
          </View>
          <View style={styles.userDetails}>
            <ThemedText type="bodyLarge" style={{ fontWeight: '600' }}>
              {userName}
            </ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              {deposit.user?.phone || 'No phone'}
            </ThemedText>
          </View>
        </View>
        <View style={[styles.amountBadge, { backgroundColor: theme.primary + '15' }]}>
          <ThemedText type="bodyLarge" style={{ color: theme.primary, fontWeight: '700' }}>
            {deposit.amountMru?.toFixed(0) || '0'} MRU
          </ThemedText>
        </View>
      </View>

      <View style={styles.depositDetails}>
        <View style={styles.detailRow}>
          <Feather name="credit-card" size={16} color={theme.textSecondary} />
          <ThemedText type="body" style={{ color: theme.textSecondary }}>
            {deposit.paymentMethod || 'Not specified'}
          </ThemedText>
        </View>
        <View style={styles.detailRow}>
          <Feather name="clock" size={16} color={theme.textSecondary} />
          <ThemedText type="body" style={{ color: theme.textSecondary }}>
            {formatDate(deposit.createdAt)}
          </ThemedText>
        </View>
        {deposit.transactionReference ? (
          <View style={styles.detailRow}>
            <Feather name="hash" size={16} color={theme.textSecondary} />
            <ThemedText type="body" style={{ color: theme.textSecondary }}>
              Ref: {deposit.transactionReference}
            </ThemedText>
          </View>
        ) : null}
      </View>

      {deposit.paymentScreenshotUrl ? (
        <Pressable 
          onPress={() => setShowScreenshot(!showScreenshot)}
          style={[styles.screenshotButton, { borderColor: theme.border }]}
        >
          <Feather name={showScreenshot ? 'eye-off' : 'image'} size={16} color={theme.primary} />
          <ThemedText type="body" style={{ color: theme.primary }}>
            {showScreenshot ? 'Hide Screenshot' : 'View Payment Screenshot'}
          </ThemedText>
        </Pressable>
      ) : null}

      {showScreenshot && deposit.paymentScreenshotUrl ? (
        <Image 
          source={{ uri: deposit.paymentScreenshotUrl }}
          style={styles.screenshotImage}
          resizeMode="contain"
        />
      ) : null}

      <View style={styles.actionButtons}>
        <Pressable
          onPress={() => onReject(deposit)}
          disabled={processing}
          style={[styles.actionButton, styles.rejectButton, { borderColor: theme.error }]}
        >
          {processing ? (
            <ActivityIndicator size="small" color={theme.error} />
          ) : (
            <>
              <Feather name="x" size={18} color={theme.error} />
              <ThemedText type="body" style={{ color: theme.error, fontWeight: '600' }}>
                Reject
              </ThemedText>
            </>
          )}
        </Pressable>
        <Pressable
          onPress={() => onApprove(deposit)}
          disabled={processing}
          style={[styles.actionButton, styles.approveButton, { backgroundColor: theme.primary }]}
        >
          {processing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Feather name="check" size={18} color="#FFFFFF" />
              <ThemedText type="body" style={{ color: '#FFFFFF', fontWeight: '600' }}>
                Approve
              </ThemedText>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

export default function MemberApprovals({ navigation }) {
  const { theme } = useTheme();
  const insets = useScreenInsets();
  const { user, profile } = useAuth();
  const [pendingDeposits, setPendingDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [canApprove, setCanApprove] = useState(false);
  const [memberBalance, setMemberBalance] = useState(0);

  useFocusEffect(
    useCallback(() => {
      if (user && profile) {
        loadData();
      } else {
        setLoading(false);
      }
    }, [user, profile])
  );

  const loadData = async () => {
    if (!user || !profile) return;

    try {
      setLoading(true);
      
      const approvalStatus = await walletApi.canMemberApprove(user.id);
      setCanApprove(approvalStatus.canApprove);
      setMemberBalance(approvalStatus.balance);

      if (approvalStatus.canApprove && profile.cityId) {
        const deposits = await walletApi.getPendingDeposits(profile.cityId, user.id);
        setPendingDeposits(deposits);
      }
    } catch (error) {
      console.error('Error loading member approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (deposit) => {
    Alert.alert(
      'Approve Deposit',
      `Are you sure you want to approve ${deposit.amountMru?.toFixed(0)} MRU deposit for ${deposit.user?.firstName || 'this user'}?\n\nYou will earn 5 MRU reward for this approval.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: async () => {
            try {
              setProcessing(deposit.id);
              await walletApi.approveDeposit(deposit.id, user.id, false);
              await notifications.notifyPaymentApproved(deposit.userId, deposit.amountMru);
              
              Alert.alert('Success', 'Deposit approved! You earned 5 MRU reward.');
              await loadData();
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to approve deposit');
            } finally {
              setProcessing(null);
            }
          }
        }
      ]
    );
  };

  const handleReject = async (deposit) => {
    Alert.prompt(
      'Reject Deposit',
      'Please provide a reason for rejection (required):',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async (reason) => {
            if (!reason || !reason.trim()) {
              Alert.alert('Error', 'Rejection reason is required');
              return;
            }
            try {
              setProcessing(deposit.id);
              await walletApi.rejectDeposit(deposit.id, user.id, reason.trim(), false);
              await notifications.notifyPaymentRejected(deposit.userId, deposit.amountMru, reason.trim());
              
              Alert.alert('Done', 'Deposit has been rejected');
              await loadData();
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to reject deposit');
            } finally {
              setProcessing(null);
            }
          }
        }
      ],
      'plain-text'
    );
  };

  if (!user || !profile) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
          <Pressable onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Feather name="arrow-left" size={24} color={theme.textPrimary} />
          </Pressable>
          <ThemedText type="bodyLarge">Approvals</ThemedText>
          <View style={styles.headerButton} />
        </View>
        <View style={styles.centerContent}>
          <Feather name="log-in" size={48} color={theme.textSecondary} />
          <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.md }}>
            Please log in to access member approvals
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (profile.role !== 'member' && profile.role !== 'leader') {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
          <Pressable onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Feather name="arrow-left" size={24} color={theme.textPrimary} />
          </Pressable>
          <ThemedText type="bodyLarge">Approvals</ThemedText>
          <View style={styles.headerButton} />
        </View>
        <View style={styles.centerContent}>
          <Feather name="shield-off" size={48} color={theme.textSecondary} />
          <ThemedText type="h2" style={{ marginTop: Spacing.lg, textAlign: 'center' }}>
            Member Access Required
          </ThemedText>
          <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.md, textAlign: 'center', paddingHorizontal: Spacing.xl }}>
            Only members can approve payment deposits. Contact a leader to become a member.
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (!canApprove) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
          <Pressable onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Feather name="arrow-left" size={24} color={theme.textPrimary} />
          </Pressable>
          <ThemedText type="bodyLarge">Approvals</ThemedText>
          <View style={styles.headerButton} />
        </View>
        <View style={styles.centerContent}>
          <View style={[styles.warningIcon, { backgroundColor: theme.warning + '20' }]}>
            <Feather name="alert-triangle" size={32} color={theme.warning} />
          </View>
          <ThemedText type="h2" style={{ marginTop: Spacing.lg, textAlign: 'center' }}>
            Low Balance
          </ThemedText>
          <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.md, textAlign: 'center', paddingHorizontal: Spacing.xl }}>
            You need at least 1,000 MRU balance to approve deposits. Your current balance is {memberBalance.toFixed(0)} MRU.
          </ThemedText>
          <Pressable
            onPress={() => navigation.navigate('AddBalance')}
            style={[styles.primaryButton, { backgroundColor: theme.primary, marginTop: Spacing.xl }]}
          >
            <ThemedText type="body" style={{ color: '#FFFFFF', fontWeight: '600' }}>
              Add Balance
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Feather name="arrow-left" size={24} color={theme.textPrimary} />
        </Pressable>
        <ThemedText type="bodyLarge">Payment Approvals</ThemedText>
        <View style={styles.headerButton} />
      </View>

      <View style={[styles.statsBar, { backgroundColor: theme.surface }]}>
        <View style={styles.statItem}>
          <Feather name="clock" size={18} color={theme.warning} />
          <ThemedText type="body" style={{ fontWeight: '600' }}>
            {pendingDeposits.length} Pending
          </ThemedText>
        </View>
        <View style={styles.statItem}>
          <Feather name="dollar-sign" size={18} color={theme.success} />
          <ThemedText type="body" style={{ fontWeight: '600' }}>
            5 MRU / Approval
          </ThemedText>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing.xl }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : pendingDeposits.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="inbox" size={48} color={theme.textSecondary} />
            <ThemedText type="h2" style={{ marginTop: Spacing.lg }}>
              No Pending Deposits
            </ThemedText>
            <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.sm, textAlign: 'center' }}>
              All deposit requests in your city have been processed. Check back later.
            </ThemedText>
          </View>
        ) : (
          <View style={styles.depositsList}>
            {pendingDeposits.map((deposit) => (
              <DepositCard
                key={deposit.id}
                deposit={deposit}
                theme={theme}
                onApprove={handleApprove}
                onReject={handleReject}
                processing={processing === deposit.id}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  depositsList: {
    gap: Spacing.md,
  },
  depositCard: {
    borderRadius: BorderRadius.medium,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  depositHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetails: {
    flex: 1,
  },
  amountBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.medium,
  },
  depositDetails: {
    gap: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  screenshotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderRadius: BorderRadius.small,
    borderStyle: 'dashed',
  },
  screenshotImage: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius.small,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.medium,
  },
  rejectButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  approveButton: {},
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  warningIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.medium,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Spacing['3xl'],
  },
});
