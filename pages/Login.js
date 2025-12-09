import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator, Alert, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
} from 'react-native-reanimated';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius } from '../theme/global';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';

export default function Login({ navigation }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { sendOtp, verifyOtp, signInAsGuest } = useAuth();
  
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const formatPhone = (text) => {
    const cleaned = text.replace(/[^\d+]/g, '');
    if (!cleaned.startsWith('+')) {
      return '+222' + cleaned;
    }
    return cleaned;
  };

  const handleSendOtp = async () => {
    const formattedPhone = formatPhone(phone);
    
    if (formattedPhone.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number');
      return;
    }

    try {
      setLoading(true);
      await sendOtp(formattedPhone);
      setPhone(formattedPhone);
      setStep('otp');
      Alert.alert('OTP Sent', 'Please check your phone for the verification code');
    } catch (error) {
      console.error('Send OTP error:', error);
      Alert.alert(
        'Error',
        error.message || 'Unable to send verification code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      Alert.alert('Invalid Code', 'Please enter the 6-digit verification code');
      return;
    }

    try {
      setLoading(true);
      const result = await verifyOtp(phone, otp);
      
      if (result.isNewUser) {
        navigation.replace('CompleteProfile');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      Alert.alert(
        'Verification Failed',
        error.message || 'Invalid verification code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      setLoading(true);
      await signInAsGuest();
    } catch (error) {
      console.error('Guest login error:', error);
      Alert.alert('Error', 'Unable to continue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderPhoneStep = () => (
    <Animated.View entering={FadeInDown.delay(400)} style={styles.formContainer}>
      <View style={styles.inputContainer}>
        <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary }]}>
          Phone Number
        </ThemedText>
        <View style={[styles.phoneInputRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <ThemedText type="body" style={styles.countryCode}>+222</ThemedText>
          <TextInput
            value={phone.replace('+222', '')}
            onChangeText={(text) => setPhone(text.replace(/[^\d]/g, ''))}
            placeholder="12345678"
            placeholderTextColor={theme.textSecondary}
            keyboardType="phone-pad"
            style={[styles.phoneInput, { color: theme.textPrimary }]}
            maxLength={10}
          />
        </View>
      </View>

      <Pressable
        onPress={handleSendOtp}
        disabled={loading || phone.length < 6}
        style={[
          styles.primaryButton, 
          { 
            backgroundColor: theme.primary, 
            opacity: loading || phone.length < 6 ? 0.6 : 1 
          }
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Feather name="smartphone" size={20} color="#FFFFFF" />
            <ThemedText type="body" style={styles.primaryButtonText}>
              Send Verification Code
            </ThemedText>
          </>
        )}
      </Pressable>

      <Pressable
        onPress={handleGuestLogin}
        disabled={loading}
        style={[styles.secondaryButton, { backgroundColor: theme.surface, opacity: loading ? 0.6 : 1 }]}
      >
        <ThemedText type="body">
          Continue as Guest
        </ThemedText>
      </Pressable>

      <ThemedText type="caption" style={[styles.terms, { color: theme.textSecondary }]}>
        By continuing you agree to our Terms of Service and Privacy Policy.
      </ThemedText>
    </Animated.View>
  );

  const renderOtpStep = () => (
    <Animated.View entering={FadeInDown.delay(200)} style={styles.formContainer}>
      <View style={styles.otpHeader}>
        <Pressable onPress={() => setStep('phone')} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={theme.textPrimary} />
        </Pressable>
        <ThemedText type="body" style={{ color: theme.textSecondary }}>
          Code sent to {phone}
        </ThemedText>
      </View>

      <View style={styles.inputContainer}>
        <ThemedText type="bodySmall" style={[styles.label, { color: theme.textSecondary }]}>
          Verification Code
        </ThemedText>
        <TextInput
          value={otp}
          onChangeText={(text) => setOtp(text.replace(/[^\d]/g, ''))}
          placeholder="Enter 6-digit code"
          placeholderTextColor={theme.textSecondary}
          keyboardType="number-pad"
          style={[styles.input, { 
            backgroundColor: theme.surface, 
            color: theme.textPrimary, 
            borderColor: theme.border 
          }]}
          maxLength={6}
        />
      </View>

      <Pressable
        onPress={handleVerifyOtp}
        disabled={loading || otp.length < 6}
        style={[
          styles.primaryButton, 
          { 
            backgroundColor: theme.primary, 
            opacity: loading || otp.length < 6 ? 0.6 : 1 
          }
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Feather name="check-circle" size={20} color="#FFFFFF" />
            <ThemedText type="body" style={styles.primaryButtonText}>
              Verify & Continue
            </ThemedText>
          </>
        )}
      </Pressable>

      <Pressable
        onPress={handleSendOtp}
        disabled={loading}
        style={styles.resendButton}
      >
        <ThemedText type="bodySmall" style={{ color: theme.primary }}>
          Resend Code
        </ThemedText>
      </Pressable>
    </Animated.View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + Spacing['3xl'], paddingBottom: insets.bottom + Spacing.xl }]}>
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <ThemedText type="display" style={styles.title}>
            Ejar
          </ThemedText>
          <ThemedText type="h1" style={[styles.subtitle, { color: theme.textSecondary }]}>
            {step === 'phone' ? 'Welcome to' : 'Verify your'}
          </ThemedText>
          <ThemedText type="h1" style={styles.title}>
            {step === 'phone' ? 'the marketplace' : 'phone number'}
          </ThemedText>
        </Animated.View>

        {step === 'phone' ? renderPhoneStep() : renderOtpStep()}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
  },
  header: {
    gap: Spacing.xs,
  },
  title: {
    fontWeight: '700',
  },
  subtitle: {
    fontWeight: '400',
  },
  formContainer: {
    gap: Spacing.md,
  },
  inputContainer: {
    gap: Spacing.xs,
  },
  label: {
    fontWeight: '500',
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spacing.md,
  },
  countryCode: {
    fontWeight: '600',
    marginRight: Spacing.sm,
  },
  phoneInput: {
    flex: 1,
    height: 56,
    fontSize: 16,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
    letterSpacing: 4,
    textAlign: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    height: 56,
    borderRadius: BorderRadius.medium,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: BorderRadius.medium,
  },
  terms: {
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
  },
  otpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  backButton: {
    padding: Spacing.xs,
  },
  resendButton: {
    alignItems: 'center',
    padding: Spacing.md,
  },
});
