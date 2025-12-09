import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Image, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { Spacing, BorderRadius } from '../theme/global';
import { useAuth } from '../contexts/AuthContext';
import { wallet as walletApi } from '../services/database';
import { useFocusEffect } from '@react-navigation/native';

export default function Profile({ navigation }) {
  const { theme } = useTheme();
  const insets = useScreenInsets();
  const { user, profile, signOut } = useAuth();
  const [walletData, setWalletData] = useState({ balance: 0, freePostsRemaining: 0 });
  const [loadingBalance, setLoadingBalance] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadWalletBalance();
    }, [user])
  );

  const loadWalletBalance = async () => {
    if (!user) {
      setWalletData({ balance: 0, freePostsRemaining: 0 });
      setLoadingBalance(false);
      return;
    }

    try {
      setLoadingBalance(true);
      const data = await walletApi.getBalance(user.id);
      setWalletData(data);
    } catch (error) {
      console.error('Error loading wallet balance:', error);
      setWalletData({ balance: 0, freePostsRemaining: 0 });
    } finally {
      setLoadingBalance(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getUserName = () => {
    if (profile) {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User';
    }
    return 'User';
  };

  const getUserCity = () => {
    if (profile?.cities?.name) {
      return profile.cities.name;
    }
    return 'No city set';
  };

  const getRoleBadge = () => {
    if (!profile?.role) return null;
    
    const roleLabels = {
      'normal': null,
      'member': { label: 'Member', color: '#22c55e' },
      'ex_member': { label: 'Ex-Member', color: '#f59e0b' },
      'leader': { label: 'Leader', color: '#8b5cf6' },
    };

    const badge = roleLabels[profile.role];
    if (!badge) return null;

    return (
      <View style={[styles.roleBadge, { backgroundColor: badge.color }]}>
        <ThemedText type="caption" style={{ color: '#FFFFFF', fontWeight: '600' }}>
          {badge.label}
        </ThemedText>
      </View>
    );
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
              uri: profile?.profile_photo_url || 'https://via.placeholder.com/100'
            }}
            style={styles.profilePhoto}
          />
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <ThemedText type="bodyLarge" style={styles.profileName}>
                {getUserName()}
              </ThemedText>
              {getRoleBadge()}
            </View>
            <ThemedText type="bodySmall" style={{ color: theme.textSecondary }}>
              {getUserCity()}
            </ThemedText>
            {profile?.whatsapp_number && (
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                WhatsApp: {profile.whatsapp_number}
              </ThemedText>
            )}
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
                Wallet Balance
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
                  {walletData.balance.toFixed(0)} MRU
                </ThemedText>
              )}
            </View>
            <View style={styles.balanceRight}>
              <View style={styles.freePostsBadge}>
                <ThemedText type="caption" style={{ color: '#FFFFFF' }}>
                  {walletData.freePostsRemaining} free posts
                </ThemedText>
              </View>
              <Feather name="credit-card" size={32} color="#FFF" />
            </View>
          </View>
        </Pressable>

        <View style={styles.gridContainer}>
          <Pressable
            style={[styles.gridCard, { backgroundColor: theme.surface }]}
            onPress={() => navigation.navigate('Account')}
          >
            <View style={[styles.gridIconContainer, { backgroundColor: theme.background }]}>
              <Feather name="user" size={24} color={theme.textPrimary} />
            </View>
            <ThemedText type="bodyLarge" style={styles.gridTitle}>
              Account
            </ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              Manage account
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
            onPress={handleSignOut}
          >
            <View style={[styles.gridIconContainer, { backgroundColor: theme.error + '20' }]}>
              <Feather name="log-out" size={24} color={theme.error} />
            </View>
            <ThemedText type="bodyLarge" style={[styles.gridTitle, { color: theme.error }]}>
              Sign Out
            </ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              Logout from app
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  profileName: {
    fontWeight: '600',
  },
  roleBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.small,
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
    opacity: 0.9,
    marginBottom: Spacing.xs,
  },
  balanceAmount: {
    fontWeight: '700',
  },
  balanceRight: {
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  freePostsBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.small,
  },
});
