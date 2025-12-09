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
import { wallet as walletApi } from '../services/database';

const PAYMENT_METHODS = [
  { id: 'bankily', name: 'Bankily', icon: 'smartphone' },
  { id: 'sedad', name: 'Sedad', icon: 'credit-card' },
  { id: 'masrvi', name: 'Masrvi', icon: 'dollar-sign' },
];

export default function AddBalance({ navigation }) {
  const { theme } = useTheme();
  const insets = useScreenInsets();
  const { user, profile } = useAuth();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [transactionImage, setTransactionImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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

    if (!selectedMethod) {
      Alert.alert('Payment Method Required', 'Please select a payment method');
      return;
    }

    if (!transactionImage) {
      Alert.alert('Proof Required', 'Please upload a screenshot of your payment');
      return;
    }

    if (!profile?.city_id) {
      Alert.alert('Error', 'City not set. Please update your profile.');
      return;
    }

    try {
      setSubmitting(true);
      
      await walletApi.createDepositRequest(
        user.id,
        profile.city_id,
        amountValue,
        selectedMethod,
        transactionImage
      );
      
      Alert.alert(
        'Request Submitted!', 
        `Your deposit request for ${amountValue.toFixed(0)} MRU has been submitted. A member in your city will review and approve it soon.`,
        [{ 
          text: 'OK',
          onPress: () => navigation.goBack()
        }]
      );
    } catch (error) {
      console.error('Error submitting deposit request:', error);
      Alert.alert('Error', 'Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
          <Pressable onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Feather name="arrow-left" size={24} color={theme.textPrimary} />
          </Pressable>
          <ThemedText type="bodyLarge">Add Balance</ThemedText>
          <View style={styles.headerButton} />
        </View>
        <View style={styles.emptyState}>
          <Feather name="log-in" size={48} color={theme.textSecondary} />
          <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.md }}>
            Please log in to add balance
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
            <View style={[styles.stepNumber, { backgroundColor: theme.primary }]}>
              <ThemedText type="caption" style={{ color: '#FFFFFF' }}>1</ThemedText>
            </View>
            <ThemedText type="body" style={{ color: theme.textSecondary, flex: 1 }}>
              Transfer money using Bankily, Sedad, or Masrvi
            </ThemedText>
          </View>

          <View style={styles.stepContainer}>
            <View style={[styles.stepNumber, { backgroundColor: theme.primary }]}>
              <ThemedText type="caption" style={{ color: '#FFFFFF' }}>2</ThemedText>
            </View>
            <ThemedText type="body" style={{ color: theme.textSecondary, flex: 1 }}>
              Screenshot the successful transaction
            </ThemedText>
          </View>

          <View style={styles.stepContainer}>
            <View style={[styles.stepNumber, { backgroundColor: theme.primary }]}>
              <ThemedText type="caption" style={{ color: '#FFFFFF' }}>3</ThemedText>
            </View>
            <ThemedText type="body" style={{ color: theme.textSecondary, flex: 1 }}>
              Submit for approval by a city member
            </ThemedText>
          </View>
        </View>

        <View style={[styles.formCard, { backgroundColor: theme.surface }]}>
          <ThemedText type="bodyLarge" style={styles.label}>
            Amount (MRU)
          </ThemedText>
          <View style={[styles.inputContainer, { borderColor: theme.border }]}>
            <TextInput
              style={[styles.input, { color: theme.textPrimary }]}
              value={amount}
              onChangeText={setAmount}
              placeholder="0"
              placeholderTextColor={theme.textSecondary}
              keyboardType="number-pad"
            />
            <ThemedText type="body" style={{ color: theme.textSecondary }}>MRU</ThemedText>
          </View>

          <ThemedText type="bodyLarge" style={[styles.label, { marginTop: Spacing.lg }]}>
            Payment Method
          </ThemedText>
          <View style={styles.methodsContainer}>
            {PAYMENT_METHODS.map((method) => (
              <Pressable
                key={method.id}
                onPress={() => setSelectedMethod(method.id)}
                style={[
                  styles.methodButton,
                  { 
                    backgroundColor: selectedMethod === method.id ? theme.primary + '20' : theme.background,
                    borderColor: selectedMethod === method.id ? theme.primary : theme.border,
                  }
                ]}
              >
                <Feather 
                  name={method.icon} 
                  size={20} 
                  color={selectedMethod === method.id ? theme.primary : theme.textSecondary} 
                />
                <ThemedText 
                  type="body" 
                  style={{ 
                    color: selectedMethod === method.id ? theme.primary : theme.textPrimary,
                    fontWeight: selectedMethod === method.id ? '600' : '400'
                  }}
                >
                  {method.name}
                </ThemedText>
              </Pressable>
            ))}
          </View>

          <ThemedText type="bodyLarge" style={[styles.label, { marginTop: Spacing.lg }]}>
            Transaction Screenshot
          </ThemedText>
          
          <Pressable
            onPress={pickImage}
            style={[
              styles.imagePicker,
              { 
                backgroundColor: transactionImage ? theme.background : theme.border + '20',
                borderColor: theme.border,
              }
            ]}
          >
            {transactionImage ? (
              <View style={styles.imagePreview}>
                <Image source={{ uri: transactionImage }} style={styles.image} />
                <View style={[styles.changeButton, { backgroundColor: theme.primary }]}>
                  <Feather name="edit-2" size={14} color="#FFFFFF" />
                  <ThemedText type="caption" style={{ color: '#FFFFFF', marginLeft: Spacing.xs }}>
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
              </View>
            )}
          </Pressable>
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={submitting}
          style={[
            styles.submitButton,
            { 
              backgroundColor: theme.primary,
              opacity: submitting ? 0.6 : 1
            }
          ]}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Feather name="check" size={20} color="#FFFFFF" />
              <ThemedText type="bodyLarge" style={{ color: '#FFFFFF', fontWeight: '600' }}>
                Submit Request
              </ThemedText>
            </>
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
    borderRadius: BorderRadius.large,
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
    alignItems: 'center',
    gap: Spacing.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.large,
    gap: Spacing.sm,
  },
  label: {
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 24,
    fontWeight: '600',
  },
  methodsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
  },
  imagePicker: {
    height: 180,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  imagePreview: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  changeButton: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.small,
  },
  uploadPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: 56,
    borderRadius: BorderRadius.medium,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
