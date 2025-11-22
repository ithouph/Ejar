import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Pressable, TextInput, Alert, ActivityIndicator, Image } from 'react-native';
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

export default function AddBalance({ navigation }) {
  const { theme } = useTheme();
  const insets = useScreenInsets();
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [transactionImage, setTransactionImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [wallet, setWallet] = useState(null);

  React.useEffect(() => {
    loadWallet();
  }, [user]);

  const loadWallet = async () => {
    if (!user) return;
    try {
      const walletData = await walletService.getWallet(user.id);
      setWallet(walletData);
    } catch (error) {
      console.error('Error loading wallet:', error);
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

  const handleSubmit = async () => {
    const amountValue = parseFloat(amount);
    
    if (!amountValue || amountValue <= 0) {
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
      setSubmitting(true);
      
      await balanceRequestService.createBalanceRequest(
        user.id,
        wallet.id,
        amountValue,
        transactionImage
      );
      
      Alert.alert(
        'Request Submitted!', 
        `Your balance top-up request for $${amountValue.toFixed(2)} has been submitted for review. You'll receive the balance once approved (usually within 24 hours).`,
        [{ 
          text: 'OK',
          onPress: () => navigation.goBack()
        }]
      );
    } catch (error) {
      console.error('Error submitting balance request:', error);
      Alert.alert('Error', 'Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Feather name="arrow-left" size={24} color={theme.textPrimary} />
        </Pressable>
        <ThemedText type="bodyLarge">Add Balance</ThemedText>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing.xl }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.instructionsCard, { backgroundColor: theme.surface }]}>
          <View style={styles.instructionHeader}>
            <Feather name="info" size={20} color={theme.primary} />
            <ThemedText type="bodyLarge" style={styles.instructionTitle}>
              How to Add Balance
            </ThemedText>
          </View>
          
          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <ThemedText type="caption" style={{ color: theme.background }}>1</ThemedText>
            </View>
            <ThemedText type="body" style={{ color: theme.textSecondary, flex: 1 }}>
              Transfer money to our account using Bankily, Sedad, or Masrvi
            </ThemedText>
          </View>

          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <ThemedText type="caption" style={{ color: theme.background }}>2</ThemedText>
            </View>
            <ThemedText type="body" style={{ color: theme.textSecondary, flex: 1 }}>
              Take a screenshot of the successful transaction
            </ThemedText>
          </View>

          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <ThemedText type="caption" style={{ color: theme.background }}>3</ThemedText>
            </View>
            <ThemedText type="body" style={{ color: theme.textSecondary, flex: 1 }}>
              Enter the amount and upload the screenshot below
            </ThemedText>
          </View>

          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <ThemedText type="caption" style={{ color: theme.background }}>4</ThemedText>
            </View>
            <ThemedText type="body" style={{ color: theme.textSecondary, flex: 1 }}>
              Submit for approval - balance will be added within 24 hours
            </ThemedText>
          </View>
        </View>

        <View style={[styles.formCard, { backgroundColor: theme.surface }]}>
          <ThemedText type="bodyLarge" style={styles.label}>
            Amount
          </ThemedText>
          <View style={[styles.inputContainer, { borderColor: theme.border }]}>
            <ThemedText type="h2" style={{ color: theme.textSecondary }}>$</ThemedText>
            <TextInput
              style={[styles.input, { color: theme.textPrimary }]}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={theme.textSecondary}
              keyboardType="decimal-pad"
            />
          </View>

          <ThemedText type="bodyLarge" style={[styles.label, { marginTop: Spacing.lg }]}>
            Transaction Proof
          </ThemedText>
          
          <Pressable
            onPress={pickImage}
            style={[
              styles.imagePicker,
              { 
                backgroundColor: transactionImage ? theme.background : theme.border + '30',
                borderColor: theme.border,
              }
            ]}
          >
            {transactionImage ? (
              <View style={styles.imagePreview}>
                <Image source={{ uri: transactionImage }} style={styles.image} />
                <View style={[styles.changeButton, { backgroundColor: theme.primary }]}>
                  <Feather name="edit-2" size={16} color={theme.background} />
                  <ThemedText type="caption" style={{ color: theme.background, marginLeft: Spacing.xs }}>
                    Change
                  </ThemedText>
                </View>
              </View>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Feather name="upload" size={32} color={theme.textSecondary} />
                <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.sm }}>
                  Upload Screenshot
                </ThemedText>
                <ThemedText type="caption" style={{ color: theme.textSecondary, marginTop: Spacing.xs }}>
                  From Bankily, Sedad, or Masrvi
                </ThemedText>
              </View>
            )}
          </Pressable>
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={submitting}
          style={[
            styles.submitButton,
            { backgroundColor: theme.primary }
          ]}
        >
          {submitting ? (
            <ActivityIndicator color={theme.background} />
          ) : (
            <ThemedText type="bodyLarge" style={{ color: theme.background }}>
              Submit Request
            </ThemedText>
          )}
        </Pressable>
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
    gap: Spacing.lg,
  },
  instructionsCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  instructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  instructionTitle: {
    fontWeight: '600',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(22, 90, 74, 1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  label: {
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    paddingVertical: Spacing.md,
  },
  imagePicker: {
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  uploadPlaceholder: {
    padding: Spacing.xl * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePreview: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },
  changeButton: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  submitButton: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
});
