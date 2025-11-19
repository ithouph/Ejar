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
 * This is where users sign in with Google.
 * 
 * BACKEND CONNECTION:
 * - useAuth() connects to contexts/AuthContext.js
 * - signInWithGoogle() calls services/authService.js
 * - authService uses config/supabase.js to authenticate
 * 
 * CUSTOMIZATION GUIDE:
 * 1. Change the design below (colors, layout, text)
 * 2. Add email/password login:
 *    - Create input fields for email and password
 *    - Call: await signInWithEmail(email, password)
 *    - Import signInWithEmail from useAuth()
 * 
 * 3. Add social logins:
 *    - Facebook: signInWithFacebook()
 *    - Apple: signInWithApple()
 *    - (Need to add these to authService.js first)
 * 
 * IMPORTANT: 
 * - DON'T use navigation.navigate() or navigation.replace()
 * - App.js automatically redirects after successful login
 * - Just call the auth functions and let AuthContext handle routing
 */
export default function Login({ navigation }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  /**
   * GOOGLE SIGN IN HANDLER
   * 
   * Steps:
   * 1. Show loading spinner
   * 2. Call Google OAuth (opens browser)
   * 3. Wait for result
   * 4. If success: AuthContext updates, App.js redirects to Main
   * 5. If fail: Show error, stay on login screen
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
      // No need to call navigation.replace() here
      
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
   * ═══════════════════════════════════════════════════════════════
   * TO ADD EMAIL/PASSWORD LOGIN:
   * ═══════════════════════════════════════════════════════════════
   * 
   * 1. Import useState for email/password:
   *    const [email, setEmail] = useState('');
   *    const [password, setPassword] = useState('');
   * 
   * 2. Add TextInput fields:
   *    <TextInput
   *      value={email}
   *      onChangeText={setEmail}
   *      placeholder="Email"
   *    />
   * 
   * 3. Create handler:
   *    const handleEmailSignIn = async () => {
   *      try {
   *        setLoading(true);
   *        const result = await signInWithEmail(email, password);
   *        if (!result?.user) throw new Error('Login failed');
   *      } catch (error) {
   *        Alert.alert('Error', error.message);
   *      } finally {
   *        setLoading(false);
   *      }
   *    };
   * 
   * 4. Add to services/authService.js:
   *    async signInWithEmail(email, password) {
   *      const { data, error } = await supabase.auth.signInWithPassword({
   *        email,
   *        password,
   *      });
   *      if (error) throw error;
   *      return data;
   *    }
   */

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
          {/* Google Sign In Button */}
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

          {/* Already Have Account Button */}
          <Pressable
            onPress={handleGoogleSignIn}
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
 * 
 * Change colors, spacing, sizes here.
 * Or use theme/global.js styles instead.
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
