import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { Spacing, BorderRadius } from '../theme/global';

function TransactionItem({ transaction, theme }) {
  const isReceived = transaction.type === 'received';
  
  return (
    <Pressable
      style={[styles.transactionCard, { backgroundColor: theme.surface }]}
    >
      <View style={[
        styles.transactionIcon,
        { backgroundColor: isReceived ? theme.success + '15' : theme.textSecondary + '10' }
      ]}>
        <Feather
          name={isReceived ? 'arrow-down' : 'arrow-up'}
          size={20}
          color={isReceived ? theme.success : theme.textPrimary}
        />
      </View>
      
      <View style={styles.transactionContent}>
        <ThemedText type="bodyLarge" style={styles.transactionName}>
          {transaction.name}
        </ThemedText>
        <ThemedText type="caption" style={{ color: theme.textSecondary }}>
          {transaction.description}
        </ThemedText>
      </View>
      
      <View style={styles.transactionAmount}>
        <ThemedText type="bodyLarge" style={[
          styles.amount,
          { color: isReceived ? theme.success : theme.textPrimary }
        ]}>
          ${transaction.amount.toLocaleString()}
        </ThemedText>
        <ThemedText type="caption" style={{ color: theme.textSecondary, textAlign: 'right' }}>
          ${transaction.balance.toLocaleString()}
        </ThemedText>
      </View>
    </Pressable>
  );
}

export default function Balance({ navigation }) {
  const { theme } = useTheme();
  const insets = useScreenInsets();
  const [balanceVisible, setBalanceVisible] = useState(true);

  const transactions = [
    {
      id: '1',
      name: 'Ada Femi',
      description: 'Sent by you • Nov 12',
      amount: 1923,
      balance: 12945,
      type: 'sent',
    },
    {
      id: '2',
      name: 'Musa Adebayo',
      description: 'Received by you • Nov 14',
      amount: 1532,
      balance: 14922,
      type: 'received',
    },
    {
      id: '3',
      name: 'Nneka Malik',
      description: 'Sent by you • Nov 12',
      amount: 950,
      balance: 12945,
      type: 'sent',
    },
    {
      id: '4',
      name: 'Tunde Ugo',
      description: 'Sent by you • May 26',
      amount: 190,
      balance: 12945,
      type: 'sent',
    },
  ];

  const balance = 34567.90;
  const accountNumber = '1289440585';

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

          <Pressable style={[styles.actionButton, { backgroundColor: theme.surface }]}>
            <View style={[styles.actionIcon, { backgroundColor: theme.backgroundRoot }]}>
              <Feather name="plus" size={20} color={theme.textPrimary} />
            </View>
            <ThemedText type="caption" style={styles.actionLabel}>
              Add funds
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
            {transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                theme={theme}
              />
            ))}
          </View>
        </View>
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
});
