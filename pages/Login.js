import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
} from 'react-native-reanimated';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Button } from '../components/Button';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius } from '../theme/global';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';

export default function Login({ navigation }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      navigation.replace('Main');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Sign In Failed', 'Unable to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + Spacing['3xl'], paddingBottom: insets.bottom + Spacing.xl }]}>
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <ThemedText type="display" style={styles.title}>
            chat rooms
          </ThemedText>
          <ThemedText type="h1" style={[styles.subtitle, { color: theme.textSecondary }]}>
            with the most
          </ThemedText>
          <ThemedText type="h1" style={styles.title}>
            valuable
          </ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400)} style={styles.buttonsContainer}>
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

          <Pressable
            onPress={handleGoogleSignIn}
            disabled={loading}
            style={[styles.accountButton, { backgroundColor: theme.surface, opacity: loading ? 0.6 : 1 }]}
          >
            <ThemedText type="body">
              I have an account
            </ThemedText>
          </Pressable>

          <ThemedText type="caption" style={[styles.terms, { color: theme.textSecondary }]}>
            By continuing you confirm that you agree to our Terms of Service, Privacy Policy and Good Manners at chat users feels like to your loved ones more often
          </ThemedText>
        </Animated.View>
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
