import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
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

/**
 * ═══════════════════════════════════════════════════════════════════
 * LOGIN SCREEN
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Two buttons:
 * 1. "Sign up with Google" - Uses real Google OAuth (needs Supabase setup)
 * 2. "I have an account" - TEMPORARY: Skips login for testing
 * 
 * BACKEND CONNECTION:
 * - useAuth() connects to contexts/AuthContext.js
 * - signInWithGoogle() calls services/authService.js
 * - authService uses config/supabase.js to authenticate
 * 
 * CUSTOMIZATION GUIDE:
 * See BACKEND_STRUCTURE.md for full instructions on:
 * - Adding email/password login
 * - Adding other social logins (Facebook, Apple)
 * - Customizing the design
 */
export default function Login({ navigation }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { signInWithGoogle, signInAsGuest } = useAuth();
  const [loading, setLoading] = useState(false);

  /**
   * GOOGLE SIGN IN HANDLER
   * 
   * This uses real Google OAuth authentication through Supabase.
   * Requires Supabase setup (see SUPABASE_SETUP_GUIDE.md)
   */
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      
      // Call Google OAuth - this opens browser for login
      const result = await signInWithGoogle();
      
      // Check if login was successful
      if (!result || !result.user) {
        throw new Error('Login cancelled or failed');
      }
      
      // Success! App.js will automatically redirect to Main
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Show error message and stay on login screen
      Alert.alert(
        'Sign In Failed',
        'Unable to sign in with Google. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * TEMPORARY LOGIN BYPASS (FOR TESTING)
   * 
   * This allows you to test the app without setting up authentication.
   * It creates a fake user session so you can navigate to the homepage.
   * 
   * TO CONNECT REAL LOGIN LATER:
   * - Replace this with real email/password login
   * - Or connect to Google/Facebook/Apple OAuth
   * - See BACKEND_STRUCTURE.md for instructions
   */
  const handleGuestLogin = async () => {
    try {
      setLoading(true);
      
      // Create a guest session (fake user for testing)
      await signInAsGuest();
      
      // App.js will automatically redirect to Main
      
    } catch (error) {
      console.error('Guest login error:', error);
      Alert.alert('Error', 'Unable to continue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + Spacing['3xl'], paddingBottom: insets.bottom + Spacing.xl }]}>
        {/* ═══════════════════════════════════════════════════════════
            HEADER - Customize this!
            ═══════════════════════════════════════════════════════════ */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <ThemedText type="display" style={styles.title}>
            TravelStay
          </ThemedText>
          <ThemedText type="h1" style={[styles.subtitle, { color: theme.textSecondary }]}>
            Discover your
          </ThemedText>
          <ThemedText type="h1" style={styles.title}>
            perfect stay
          </ThemedText>
        </Animated.View>

        {/* ═══════════════════════════════════════════════════════════
            LOGIN BUTTONS - Customize this!
            ═══════════════════════════════════════════════════════════ */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.buttonsContainer}>
          {/* Google Sign In Button (Real OAuth) */}
          <Pressable
            onPress={handleGoogleSignIn}
            disabled={loading}
            style={[styles.googleButton, { backgroundColor: theme.textPrimary, opacity: loading ? 0.6 : 1 }]}
          >
            {loading ? (
              <ActivityIndicator color={theme.buttonText} />
            ) : (
              <>
                <Feather name="chrome" size={20} color={theme.buttonText} />
                <ThemedText
                  type="body"
                  style={[styles.buttonText, { color: theme.buttonText }]}
                >
                  Sign up with Google
                </ThemedText>
              </>
            )}
          </Pressable>

          {/* "I Have Account" Button (TEMPORARY: Goes to homepage for testing) */}
          <Pressable
            onPress={handleGuestLogin}
            disabled={loading}
            style={[styles.accountButton, { backgroundColor: theme.surface, opacity: loading ? 0.6 : 1 }]}
          >
            <ThemedText type="body">
              I have an account
            </ThemedText>
          </Pressable>

          {/* Terms Text */}
          <ThemedText type="caption" style={[styles.terms, { color: theme.textSecondary }]}>
            By continuing you agree to our Terms of Service and Privacy Policy. Book your dream vacation with TravelStay.
          </ThemedText>
        </Animated.View>
      </View>
    </ThemedView>
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * STYLES - Customize these!
 * ═══════════════════════════════════════════════════════════════════
 */
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
  buttonsContainer: {
    gap: Spacing.md,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    height: 56,
    borderRadius: BorderRadius.medium,
  },
  accountButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: BorderRadius.medium,
  },
  buttonText: {
    fontWeight: '600',
  },
  terms: {
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
  },
});
