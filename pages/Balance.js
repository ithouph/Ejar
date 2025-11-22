import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Pressable, TextInput, Alert, ActivityIndicator, Modal, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { Spacing, BorderRadius } from '../theme/global';
import { useAuth } from '../contexts/AuthContext';
import { walletService } from '../services/walletService';
import { balanceRequestService } from '../services/balanceRequestService';

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
        {transaction.balance_after !== undefined && transaction.balance_after !== null ? (
          <ThemedText type="caption" style={{ color: theme.textSecondary, textAlign: 'right' }}>
            ${parseFloat(transaction.balance_after).toFixed(2)}
          </ThemedText>
        ) : null}
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
  const [transactionImage, setTransactionImage] = useState(null);

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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photos to upload transaction proof.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setTransactionImage(result.assets[0].uri);
    }
  };

  const handleAddBalance = async () => {
    const amount = parseFloat(addAmount);
    
    if (!amount || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    if (!transactionImage) {
      Alert.alert('Transaction Proof Required', 'Please upload a screenshot of your bank transfer');
      return;
    }

    if (!wallet) {
      Alert.alert('Error', 'Wallet not found');
      return;
    }

    try {
      setAddingBalance(true);
      
      await balanceRequestService.createBalanceRequest(
        user.id,
        wallet.id,
        amount,
        transactionImage
      );
      
      Alert.alert(
        'Request Submitted!', 
        `Your balance top-up request for $${amount.toFixed(2)} has been submitted for review. You'll receive the balance once approved (usually within 24 hours).`,
        [{ text: 'OK' }]
      );
      
      setShowAddBalance(false);
      setAddAmount('');
      setTransactionImage(null);
    } catch (error) {
      console.error('Error submitting balance request:', error);
      Alert.alert('Error', 'Failed to submit request. Please try again.');
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
        <ThemedText type="bodyLarge">Balance</ThemedText>
        <View style={styles.headerButton} />
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
        onRequestClose={() => {
          setShowAddBalance(false);
          setTransactionImage(null);
          setAddAmount('');
        }}
      >
        <View style={styles.modalOverlay}>
          <ScrollView 
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
              <View style={styles.modalHeader}>
                <ThemedText type="h2">Add Balance</ThemedText>
                <Pressable onPress={() => {
                  setShowAddBalance(false);
                  setTransactionImage(null);
                  setAddAmount('');
                }}>
                  <Feather name="x" size={24} color={theme.textPrimary} />
                </Pressable>
              </View>

              <View style={[styles.instructionsBox, { backgroundColor: theme.background }]}>
                <Feather name="info" size={20} color={theme.primary} />
                <View style={{ flex: 1 }}>
                  <ThemedText type="bodyLarge" style={{ fontWeight: '600', marginBottom: Spacing.xs }}>
                    How to add balance
                  </ThemedText>
                  <ThemedText type="bodySmall" style={{ color: theme.textSecondary, lineHeight: 20 }}>
                    1. Send money via Bankily, Sedad, or Masrvi app{'\n'}
                    2. Take a screenshot of the transaction{'\n'}
                    3. Upload the screenshot below{'\n'}
                    4. Wait for approval (usually within 24 hours)
                  </ThemedText>
                </View>
              </View>

              <ThemedText type="bodySmall" style={{ color: theme.textSecondary, marginBottom: Spacing.sm }}>
                Enter amount
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
                />
              </View>

              <ThemedText type="bodySmall" style={{ color: theme.textSecondary, marginTop: Spacing.lg, marginBottom: Spacing.sm }}>
                Transaction proof
              </ThemedText>

              {transactionImage ? (
                <View style={styles.imagePreviewContainer}>
                  <Image
                    source={{ uri: transactionImage }}
                    style={styles.imagePreview}
                    resizeMode="cover"
                  />
                  <Pressable
                    onPress={() => setTransactionImage(null)}
                    style={[styles.removeImageButton, { backgroundColor: theme.error }]}
                  >
                    <Feather name="x" size={16} color="#FFF" />
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  onPress={pickImage}
                  style={[styles.uploadButton, { backgroundColor: theme.background, borderColor: theme.textSecondary + '30' }]}
                >
                  <Feather name="upload" size={32} color={theme.textSecondary} />
                  <ThemedText type="bodySmall" style={{ color: theme.textSecondary, marginTop: Spacing.sm }}>
                    Upload screenshot from Bankily, Sedad, or Masrvi
                  </ThemedText>
                </Pressable>
              )}

              <Pressable
                onPress={handleAddBalance}
                disabled={addingBalance}
                style={[styles.addButton, { backgroundColor: theme.primary, opacity: (!addAmount || !transactionImage) ? 0.5 : 1 }]}
              >
                {addingBalance ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <ThemedText type="bodyLarge" lightColor="#FFF" darkColor="#FFF" style={{ fontWeight: '600' }}>
                    Submit for Review
                  </ThemedText>
                )}
              </Pressable>
            </View>
          </ScrollView>
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
    padding: Spacing.lg,
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.md,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
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
  instructionsBox: {
    flexDirection: 'row',
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    gap: Spacing.md,
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
  uploadButton: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    minHeight: 180,
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: BorderRadius.medium,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius.medium,
  },
  removeImageButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
});
