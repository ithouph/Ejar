import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView, View, Pressable, ActivityIndicator, Modal, TextInput, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { Spacing, BorderRadius } from '../theme/global';
import { useAuth } from '../contexts/AuthContext';
import { wallet as walletApi, reports as reportsApi } from '../services';
import { useFocusEffect } from '@react-navigation/native';

function TransactionItem({ transaction, theme, onReport }) {
  const isCredit = ['deposit', 'approval_reward', 'refund'].includes(transaction.type);
  const isPending = transaction.status === 'pending';
  const isRejected = transaction.status === 'rejected';
  const canReport = isRejected && transaction.type === 'deposit' && transaction.approvedByMemberId;
  
  const getStatusColor = () => {
    switch (transaction.status) {
      case 'approved': return theme.success;
      case 'rejected': return theme.error;
      case 'pending': return '#f59e0b';
      case 'assigned_to_leader': return '#8b5cf6';
      default: return theme.textSecondary;
    }
  };
  
  return (
    <View style={[styles.transactionCard, { backgroundColor: theme.surface }]}>
      <View style={[
        styles.transactionIcon,
        { backgroundColor: isCredit ? theme.success + '15' : theme.textSecondary + '10' }
      ]}>
        <Feather
          name={isCredit ? 'arrow-down' : 'arrow-up'}
          size={20}
          color={isCredit ? theme.success : theme.textPrimary}
        />
      </View>
      
      <View style={styles.transactionContent}>
        <ThemedText type="bodyLarge" style={styles.transactionName}>
          {transaction.typeLabel}
        </ThemedText>
        <View style={styles.transactionMeta}>
          <ThemedText type="caption" style={{ color: getStatusColor() }}>
            {transaction.statusLabel}
          </ThemedText>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            {transaction.timeAgo}
          </ThemedText>
        </View>
        {isRejected && transaction.rejectionReason ? (
          <ThemedText type="caption" style={{ color: theme.error, marginTop: 2 }} numberOfLines={1}>
            Reason: {transaction.rejectionReason}
          </ThemedText>
        ) : null}
        {canReport ? (
          <Pressable 
            onPress={() => onReport(transaction)}
            style={[styles.reportButton, { backgroundColor: theme.error + '15' }]}
          >
            <Feather name="flag" size={12} color={theme.error} />
            <ThemedText type="caption" style={{ color: theme.error }}>
              Report Unfair Rejection
            </ThemedText>
          </Pressable>
        ) : null}
      </View>
      
      <View style={styles.transactionAmount}>
        <ThemedText type="bodyLarge" style={[
          styles.amount,
          { color: isCredit ? theme.success : theme.textPrimary }
        ]}>
          {isCredit ? '+' : '-'}{transaction.amount.toFixed(0)} MRU
        </ThemedText>
        {!isPending && transaction.balanceAfter !== undefined ? (
          <ThemedText type="caption" style={{ color: theme.textSecondary, textAlign: 'right' }}>
            {transaction.balanceAfter.toFixed(0)} MRU
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

export default function Balance({ navigation }) {
  const { theme } = useTheme();
  const insets = useScreenInsets();
  const { user, profile } = useAuth();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [walletData, setWalletData] = useState({ balance: 0, freePostsRemaining: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadWalletData();
      } else {
        setLoading(false);
      }
    }, [user])
  );

  const handleReport = (transaction) => {
    setSelectedTransaction(transaction);
    setReportReason('');
    setReportDetails('');
    setReportModalVisible(true);
  };

  const submitReport = async () => {
    if (!reportReason.trim()) {
      Alert.alert('Error', 'Please provide a reason for reporting');
      return;
    }

    if (!selectedTransaction || !user) return;

    setSubmittingReport(true);
    try {
      await reportsApi.create(
        user.id,
        selectedTransaction.approvedByMemberId,
        selectedTransaction.id,
        reportReason.trim(),
        reportDetails.trim()
      );
      
      setReportModalVisible(false);
      setSelectedTransaction(null);
      
      Alert.alert(
        'Report Submitted',
        'Your report has been submitted and will be reviewed by a leader. If approved, the member will be penalized 500 MRU.'
      );
      
      loadWalletData();
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    } finally {
      setSubmittingReport(false);
    }
  };

  const loadWalletData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const [balanceData, transactionsData] = await Promise.all([
        walletApi.getBalance(user.id),
        walletApi.getTransactions(user.id)
      ]);
      
      setWalletData(balanceData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error loading wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
          <Pressable onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Feather name="arrow-left" size={24} color={theme.textPrimary} />
          </Pressable>
          <ThemedText type="bodyLarge">Balance</ThemedText>
          <View style={styles.headerButton} />
        </View>
        <View style={styles.emptyState}>
          <Feather name="log-in" size={48} color={theme.textSecondary} />
          <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.md }}>
            Please log in to view your balance
          </ThemedText>
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
        <ThemedText type="bodyLarge">Wallet</ThemedText>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing.xl }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.balanceCard, { backgroundColor: theme.primary }]}>
          <Pressable
            onPress={() => setBalanceVisible(!balanceVisible)}
            style={styles.eyeButton}
          >
            <Feather
              name={balanceVisible ? 'eye' : 'eye-off'}
              size={20}
              color="#FFFFFF"
            />
          </Pressable>

          <ThemedText type="caption" style={styles.balanceLabel}>
            Wallet Balance
          </ThemedText>
          
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" style={{ marginVertical: 16 }} />
          ) : balanceVisible ? (
            <ThemedText type="display" style={styles.balanceAmount}>
              {walletData.balance.toLocaleString('en-US')} MRU
            </ThemedText>
          ) : (
            <ThemedText type="display" style={styles.balanceAmount}>
              ••••••
            </ThemedText>
          )}
          
          <View style={styles.balanceFooter}>
            <View style={styles.freePostsBadge}>
              <Feather name="gift" size={14} color="#FFFFFF" />
              <ThemedText type="caption" style={{ color: '#FFFFFF' }}>
                {walletData.freePostsRemaining} free posts remaining
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Pressable 
            onPress={() => navigation.navigate('AddBalance')}
            style={[styles.actionButton, { backgroundColor: theme.surface }]}
          >
            <View style={[styles.actionIcon, { backgroundColor: theme.primary + '20' }]}>
              <Feather name="plus" size={20} color={theme.primary} />
            </View>
            <ThemedText type="body" style={styles.actionLabel}>
              Add Balance
            </ThemedText>
          </Pressable>
        </View>

        <View style={styles.transactionsSection}>
          <ThemedText type="h2" style={styles.sectionTitle}>
            Transaction History
          </ThemedText>

          <View style={styles.transactionsList}>
            {loading ? (
              <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: Spacing.xl }} />
            ) : transactions.length === 0 ? (
              <View style={styles.emptyTransactions}>
                <Feather name="credit-card" size={32} color={theme.textSecondary} />
                <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.md }}>
                  No transactions yet
                </ThemedText>
                <ThemedText type="caption" style={{ color: theme.textSecondary, textAlign: 'center', marginTop: Spacing.xs }}>
                  Add balance to your wallet to start posting
                </ThemedText>
              </View>
            ) : (
              transactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  theme={theme}
                  onReport={handleReport}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={reportModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setReportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <View style={styles.modalHeader}>
              <ThemedText type="h2">Report Unfair Rejection</ThemedText>
              <Pressable onPress={() => setReportModalVisible(false)}>
                <Feather name="x" size={24} color={theme.textPrimary} />
              </Pressable>
            </View>

            {selectedTransaction ? (
              <View style={[styles.reportInfo, { backgroundColor: theme.surface }]}>
                <ThemedText type="bodySmall" style={{ color: theme.textSecondary }}>
                  Transaction: {selectedTransaction.amount} MRU Deposit
                </ThemedText>
                {selectedTransaction.rejectionReason ? (
                  <ThemedText type="bodySmall" style={{ color: theme.error }}>
                    Rejection reason: {selectedTransaction.rejectionReason}
                  </ThemedText>
                ) : null}
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <ThemedText type="bodySmall" style={{ marginBottom: Spacing.xs }}>
                Why do you think this was unfair?
              </ThemedText>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: theme.surface, 
                  color: theme.textPrimary,
                  borderColor: theme.border 
                }]}
                value={reportReason}
                onChangeText={setReportReason}
                placeholder="e.g., I provided valid payment proof"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText type="bodySmall" style={{ marginBottom: Spacing.xs }}>
                Additional details (optional)
              </ThemedText>
              <TextInput
                style={[styles.textInput, styles.textArea, { 
                  backgroundColor: theme.surface, 
                  color: theme.textPrimary,
                  borderColor: theme.border 
                }]}
                value={reportDetails}
                onChangeText={setReportDetails}
                placeholder="Provide any additional context..."
                placeholderTextColor={theme.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <ThemedText type="caption" style={{ color: theme.textSecondary, marginBottom: Spacing.md }}>
              If your report is approved, the member who rejected your payment will be penalized 500 MRU.
            </ThemedText>

            <Pressable
              onPress={submitReport}
              disabled={submittingReport}
              style={[styles.submitButton, { backgroundColor: theme.error }]}
            >
              {submittingReport ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <ThemedText type="body" style={{ color: '#FFFFFF', fontWeight: '600' }}>
                  Submit Report
                </ThemedText>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
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
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xl,
  },
  balanceCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.large,
    alignItems: 'center',
    position: 'relative',
  },
  eyeButton: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  balanceAmount: {
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: Spacing.md,
  },
  balanceFooter: {
    marginTop: Spacing.sm,
  },
  freePostsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.small,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    gap: Spacing.md,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontWeight: '600',
  },
  transactionsSection: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  transactionsList: {
    gap: Spacing.sm,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
    gap: Spacing.md,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  transactionName: {
    fontWeight: '500',
  },
  transactionMeta: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amount: {
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTransactions: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.small,
    marginTop: Spacing.xs,
    alignSelf: 'flex-start',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.large,
    borderTopRightRadius: BorderRadius.large,
    padding: Spacing.xl,
    paddingBottom: Spacing['2xl'],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  reportInfo: {
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
  },
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
  },
});
