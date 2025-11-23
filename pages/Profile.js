import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Image, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { Spacing, BorderRadius } from '../theme/global';
import { useAuth } from '../contexts/AuthContext';
import { users as usersApi, wallet as walletApi } from '../services/database';

export default function Profile({ navigation }) {
  const { theme } = useTheme();
  const insets = useScreenInsets();
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(true);

  useEffect(() => {
    loadUserProfile();
    loadWalletBalance();
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    try {
      const profile = await usersApi.getUser(user.id);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUserProfile(null);
    }
  };

  const loadWalletBalance = async () => {
    if (!user) {
      setWalletBalance(0);
      setLoadingBalance(false);
      return;
    }

    try {
      setLoadingBalance(true);
      const walletData = await walletApi.get(user.id);
      
      if (walletData) {
        const balance = parseFloat(walletData.balance) || 0;
        setWalletBalance(balance);
      } else {
        setWalletBalance(0);
      }
    } catch (error) {
      console.error('Error loading wallet balance:', error);
      setWalletBalance(0);
    } finally {
      setLoadingBalance(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
      >
        <ThemedText type="h1" style={styles.title}>
          Settings
        </ThemedText>

        <Pressable
          onPress={() => navigation.navigate('EditProfile')}
          style={[styles.profileCard, { backgroundColor: theme.surface }]}
        >
          <Image
            source={{ 
              uri: userProfile?.photo_url || user?.user_metadata?.avatar_url || 'https://via.placeholder.com/100'
            }}
            style={styles.profilePhoto}
          />
          <View style={styles.profileInfo}>
            <ThemedText type="bodyLarge" style={styles.profileName}>
              {userProfile?.full_name || user?.user_metadata?.full_name || user?.email || 'Guest User'}
            </ThemedText>
            <ThemedText type="bodySmall" style={{ color: theme.textSecondary }}>
              {user?.email || 'guest@ejar.com'}
            </ThemedText>
          </View>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('Balance')}
          style={[styles.balanceCard, { backgroundColor: theme.primary }]}
        >
          <View style={styles.balanceContent}>
            <View>
              <ThemedText
                type="caption"
                lightColor="#FFF"
                darkColor="#FFF"
                style={styles.balanceLabel}
              >
                Total Balance
              </ThemedText>
              {loadingBalance ? (
                <ActivityIndicator size="small" color="#FFF" style={{ marginVertical: 8 }} />
              ) : (
                <ThemedText
                  type="h1"
                  lightColor="#FFF"
                  darkColor="#FFF"
                  style={styles.balanceAmount}
                >
                  ${walletBalance.toFixed(2)}
                </ThemedText>
              )}
            </View>
            <View style={styles.balanceIcon}>
              <Feather name="dollar-sign" size={32} color="#FFF" />
            </View>
          </View>
        </Pressable>

        <View style={styles.gridContainer}>
          <Pressable
            style={[styles.gridCard, { backgroundColor: theme.surface }]}
            onPress={() => navigation.navigate('PaymentRequests')}
          >
            <View style={[styles.gridIconContainer, { backgroundColor: theme.background }]}>
              <Feather name="credit-card" size={24} color={theme.textPrimary} />
            </View>
            <ThemedText type="bodyLarge" style={styles.gridTitle}>
              Payment Requests
            </ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              Manage approvals
            </ThemedText>
          </Pressable>

          <Pressable
            style={[styles.gridCard, { backgroundColor: theme.surface }]}
            onPress={() => navigation.navigate('Review')}
          >
            <View style={[styles.gridIconContainer, { backgroundColor: theme.background }]}>
              <Feather name="star" size={24} color={theme.textPrimary} />
            </View>
            <ThemedText type="bodyLarge" style={styles.gridTitle}>
              My Reviews
            </ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              View your feedback
            </ThemedText>
          </Pressable>

          <Pressable
            style={[styles.gridCard, { backgroundColor: theme.surface }]}
            onPress={() => navigation.navigate('Support')}
          >
            <View style={[styles.gridIconContainer, { backgroundColor: theme.background }]}>
              <Feather name="help-circle" size={24} color={theme.textPrimary} />
            </View>
            <ThemedText type="bodyLarge" style={styles.gridTitle}>
              Help & Support
            </ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              Get help anytime
            </ThemedText>
          </Pressable>

          <Pressable
            style={[styles.gridCard, { backgroundColor: theme.surface }]}
            onPress={() => navigation.navigate('Terms')}
          >
            <View style={[styles.gridIconContainer, { backgroundColor: theme.background }]}>
              <Feather name="file-text" size={24} color={theme.textPrimary} />
            </View>
            <ThemedText type="bodyLarge" style={styles.gridTitle}>
              Terms of Service
            </ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              Legal information
            </ThemedText>
          </Pressable>

          <Pressable
            style={[styles.gridCard, { backgroundColor: theme.surface }]}
            onPress={() => navigation.navigate('Privacy')}
          >
            <View style={[styles.gridIconContainer, { backgroundColor: theme.background }]}>
              <Feather name="shield" size={24} color={theme.textPrimary} />
            </View>
            <ThemedText type="bodyLarge" style={styles.gridTitle}>
              Privacy Policy
            </ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              Your data protection
            </ThemedText>
          </Pressable>

          <Pressable
            style={[styles.gridCard, { backgroundColor: theme.surface }]}
            onPress={() => navigation.navigate('Balance')}
          >
            <View style={[styles.gridIconContainer, { backgroundColor: theme.background }]}>
              <Feather name="dollar-sign" size={24} color={theme.textPrimary} />
            </View>
            <ThemedText type="bodyLarge" style={styles.gridTitle}>
              Wallet
            </ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              Manage your balance
            </ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  title: {
    fontWeight: '700',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    gap: Spacing.md,
  },
  profilePhoto: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  gridCard: {
    width: '48%',
    padding: Spacing.lg,
    borderRadius: BorderRadius.large,
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  gridIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  gridTitle: {
    fontWeight: '600',
  },
  balanceCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.large,
  },
  balanceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceLabel: {
    marginBottom: Spacing.sm,
  },
  balanceAmount: {
    fontWeight: '700',
  },
  balanceIcon: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
