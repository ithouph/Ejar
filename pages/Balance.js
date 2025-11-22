import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Pressable, TextInput, Alert, ActivityIndicator, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { Spacing, BorderRadius } from '../theme/global';
import { useAuth } from '../contexts/AuthContext';
import { walletService } from '../services/walletService';

function TransactionItem({ transaction, theme }) {
  const isCredit = transaction.type === 'credit';
  const date = new Date(transaction.created_at);
  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  return (
    <Pressable
      style={[styles.transactionCard, { backgroundColor: theme.surface }]}
    >
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
          {transaction.description || (isCredit ? 'Received' : 'Sent')}
        </ThemedText>
        <ThemedText type="caption" style={{ color: theme.textSecondary }}>
          {transaction.category} • {formattedDate}
        </ThemedText>
      </View>
      
      <View style={styles.transactionAmount}>
        <ThemedText type="bodyLarge" style={[
          styles.amount,
          { color: isCredit ? theme.success : theme.textPrimary }
        ]}>
          ${parseFloat(transaction.amount).toFixed(2)}
        </ThemedText>
        <ThemedText type="caption" style={{ color: theme.textSecondary, textAlign: 'right' }}>
          ${parseFloat(transaction.balance_after).toFixed(2)}
        </ThemedText>
      </View>
    </Pressable>
  );
}

export default function Balance({ navigation }) {
  const { theme } = useTheme();
  const insets = useScreenInsets();
  const { user } = useAuth();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddBalance, setShowAddBalance] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [addingBalance, setAddingBalance] = useState(false);

  useEffect(() => {
    loadWalletData();
  }, [user]);

  const loadWalletData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const walletData = await walletService.getWallet(user.id);
      setWallet(walletData);

      if (walletData) {
        const transactionsData = await walletService.getTransactions(walletData.id);
        setTransactions(transactionsData);
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
      Alert.alert('Error', 'Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBalance = async () => {
    const amount = parseFloat(addAmount);
    
    if (!amount || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    if (!wallet) {
      Alert.alert('Error', 'Wallet not found');
      return;
    }

    try {
      setAddingBalance(true);
      await walletService.addBalance(wallet.id, amount, 'Added balance');
      
      Alert.alert('Success', `$${amount.toFixed(2)} added to your wallet!`);
      setShowAddBalance(false);
      setAddAmount('');
      
      await loadWalletData();
    } catch (error) {
      console.error('Error adding balance:', error);
      Alert.alert('Error', 'Failed to add balance. Please try again.');
    } finally {
      setAddingBalance(false);
    }
  };

  const balance = wallet ? parseFloat(wallet.balance) : 0;
  const accountNumber = wallet ? wallet.id.substring(0, 10) : '----------';

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Feather name="arrow-left" size={24} color={theme.textPrimary} />
        </Pressable>
        <ThemedText type="bodyLarge">Welcome back</ThemedText>
        <Pressable style={styles.headerButton}>
          <Feather name="bell" size={24} color={theme.textPrimary} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing.xl }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.balanceCard, { backgroundColor: theme.surface }]}>
          <Pressable
            onPress={() => setBalanceVisible(!balanceVisible)}
            style={styles.eyeButton}
          >
            <Feather
              name={balanceVisible ? 'eye' : 'eye-off'}
              size={20}
              color={theme.textSecondary}
            />
          </Pressable>

          <ThemedText type="caption" style={[styles.balanceLabel, { color: theme.textSecondary }]}>
            Account balance
          </ThemedText>
          
          {balanceVisible ? (
            <ThemedText type="display" style={styles.balanceAmount}>
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </ThemedText>
          ) : (
            <ThemedText type="display" style={styles.balanceAmount}>
              ••••••
            </ThemedText>
          )}
          
          <View style={styles.accountNumber}>
            <Feather name="credit-card" size={12} color={theme.textSecondary} />
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              {accountNumber}
            </ThemedText>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Pressable style={[styles.actionButton, { backgroundColor: theme.surface }]}>
            <View style={[styles.actionIcon, { backgroundColor: theme.backgroundRoot }]}>
              <Feather name="arrow-up" size={20} color={theme.textPrimary} />
            </View>
            <ThemedText type="caption" style={styles.actionLabel}>
              Send
            </ThemedText>
          </Pressable>

          <Pressable 
            onPress={() => setShowAddBalance(true)}
            style={[styles.actionButton, { backgroundColor: theme.surface }]}
          >
            <View style={[styles.actionIcon, { backgroundColor: theme.backgroundRoot }]}>
              <Feather name="plus" size={20} color={theme.textPrimary} />
            </View>
            <ThemedText type="caption" style={styles.actionLabel}>
              Add balance
            </ThemedText>
          </Pressable>

          <Pressable style={[styles.actionButton, { backgroundColor: theme.surface }]}>
            <View style={[styles.actionIcon, { backgroundColor: theme.backgroundRoot }]}>
              <Feather name="arrow-down" size={20} color={theme.textPrimary} />
            </View>
            <ThemedText type="caption" style={styles.actionLabel}>
              Request
            </ThemedText>
          </Pressable>

          <Pressable style={[styles.actionButton, { backgroundColor: theme.surface }]}>
            <View style={[styles.actionIcon, { backgroundColor: theme.backgroundRoot }]}>
              <Feather name="more-horizontal" size={20} color={theme.textPrimary} />
            </View>
            <ThemedText type="caption" style={styles.actionLabel}>
              More
            </ThemedText>
          </Pressable>
        </View>

        <View style={styles.transactionsSection}>
          <View style={styles.transactionsHeader}>
            <ThemedText type="h2">Transactions</ThemedText>
            <Pressable>
              <ThemedText type="bodySmall" style={{ color: theme.textSecondary }}>
                see all
              </ThemedText>
            </Pressable>
          </View>

          <View style={styles.transactionsList}>
            {loading ? (
              <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: Spacing.xl }} />
            ) : transactions.length === 0 ? (
              <ThemedText type="bodySmall" style={{ color: theme.textSecondary, textAlign: 'center', marginTop: Spacing.xl }}>
                No transactions yet
              </ThemedText>
            ) : (
              transactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  theme={theme}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showAddBalance}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddBalance(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <View style={styles.modalHeader}>
              <ThemedText type="h2">Add Balance</ThemedText>
              <Pressable onPress={() => setShowAddBalance(false)}>
                <Feather name="x" size={24} color={theme.textPrimary} />
              </Pressable>
            </View>

            <ThemedText type="bodySmall" style={{ color: theme.textSecondary, marginBottom: Spacing.lg }}>
              Enter the amount you want to add to your wallet
            </ThemedText>

            <View style={[styles.inputContainer, { backgroundColor: theme.background }]}>
              <ThemedText type="h1" style={{ color: theme.textSecondary }}>$</ThemedText>
              <TextInput
                style={[styles.amountInput, { color: theme.textPrimary }]}
                value={addAmount}
                onChangeText={setAddAmount}
                placeholder="0.00"
                placeholderTextColor={theme.textSecondary}
                keyboardType="decimal-pad"
                autoFocus
              />
            </View>

            <Pressable
              onPress={handleAddBalance}
              disabled={addingBalance}
              style={[styles.addButton, { backgroundColor: theme.primary }]}
            >
              {addingBalance ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <ThemedText type="bodyLarge" lightColor="#FFF" darkColor="#FFF" style={{ fontWeight: '600' }}>
                  Add Balance
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
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  balanceAmount: {
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  accountNumber: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
    gap: Spacing.sm,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    textAlign: 'center',
  },
  transactionsSection: {
    gap: Spacing.md,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionsList: {
    gap: Spacing.md,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
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
  },
  transactionName: {
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amount: {
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    padding: Spacing.xl,
    borderRadius: BorderRadius.large,
    gap: Spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    gap: Spacing.sm,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
  },
  addButton: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
});
