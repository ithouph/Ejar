import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Image, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { Spacing, BorderRadius } from '../theme/global';
import { useAuth } from '../contexts/AuthContext';
import { wallet as walletApi, users as usersApi } from '../services/database';

function ServiceCard({ icon, title, onPress, theme }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.serviceCard, { backgroundColor: theme.surface }]}
    >
      <View style={[styles.serviceIconContainer, { backgroundColor: theme.primary + '10' }]}>
        <Feather name={icon} size={28} color={theme.primary} />
      </View>
      <ThemedText type="bodySmall" style={styles.serviceTitle}>
        {title}
      </ThemedText>
    </Pressable>
  );
}

export default function Account({ navigation }) {
  const { theme } = useTheme();
  const insets = useScreenInsets();
  const { user } = useAuth();
  const [walletBalance, setWalletBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    loadWalletBalance();
    loadUserProfile();
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

  const services = [
    { icon: 'scissors', title: 'Hairdresser' },
    { icon: 'wind', title: 'Cleaning' },
    { icon: 'droplet', title: 'Painting' },
  ];

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
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText type="h1" style={styles.pageTitle}>
            Account
          </ThemedText>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.closeButton}
          >
            <Feather name="x" size={24} color={theme.textPrimary} />
          </Pressable>
        </View>

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
            <ThemedText type="h2" style={styles.profileName}>
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

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="h2">Services Categories</ThemedText>
            <Pressable style={styles.viewAllButton}>
              <ThemedText type="bodySmall" style={{ color: theme.textSecondary }}>
                View all
              </ThemedText>
              <Feather name="chevron-right" size={16} color={theme.textSecondary} />
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesScroll}
          >
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                theme={theme}
                onPress={() => {}}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <ThemedText type="h2" style={styles.sectionTitle}>
            Quick Actions
          </ThemedText>

          <View style={styles.gridContainer}>
            <Pressable
              style={[styles.gridCard, { backgroundColor: theme.surface }]}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <View style={[styles.gridIconContainer, { backgroundColor: theme.background }]}>
                <Feather name="edit-3" size={24} color={theme.textPrimary} />
              </View>
              <ThemedText type="bodyLarge" style={styles.gridTitle}>
                Edit Profile
              </ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                Update your information
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

            <Pressable
              style={[styles.gridCard, { backgroundColor: theme.surface }]}
              onPress={() => navigation.navigate('Support')}
            >
              <View style={[styles.gridIconContainer, { backgroundColor: theme.background }]}>
                <Feather name="message-circle" size={24} color={theme.textPrimary} />
              </View>
              <ThemedText type="bodyLarge" style={styles.gridTitle}>
                Support
              </ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                Get help anytime
              </ThemedText>
            </Pressable>

            <Pressable
              style={[styles.gridCard, { backgroundColor: theme.surface }]}
              onPress={() => {}}
            >
              <View style={[styles.gridIconContainer, { backgroundColor: theme.background }]}>
                <Feather name="bell" size={24} color={theme.textPrimary} />
              </View>
              <ThemedText type="bodyLarge" style={styles.gridTitle}>
                Notifications
              </ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                Manage alerts
              </ThemedText>
            </Pressable>

            <Pressable
              style={[styles.gridCard, { backgroundColor: theme.surface }]}
              onPress={() => {}}
            >
              <View style={[styles.gridIconContainer, { backgroundColor: theme.background }]}>
                <Feather name="settings" size={24} color={theme.textPrimary} />
              </View>
              <ThemedText type="bodyLarge" style={styles.gridTitle}>
                Settings
              </ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                App preferences
              </ThemedText>
            </Pressable>
          </View>
        </View>

        <View style={styles.statsSection}>
          <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
            <Feather name="map-pin" size={24} color={theme.primary} />
            <ThemedText type="h1" style={styles.statNumber}>
              12
            </ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              Places Visited
            </ThemedText>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
            <Feather name="star" size={24} color={theme.primary} />
            <ThemedText type="h1" style={styles.statNumber}>
              8
            </ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              Reviews
            </ThemedText>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
            <Feather name="award" size={24} color={theme.primary} />
            <ThemedText type="h1" style={styles.statNumber}>
              Gold
            </ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              Status
            </ThemedText>
          </View>
        </View>

        <Pressable
          style={[styles.logoutButton, { backgroundColor: theme.surface }]}
          onPress={() => {}}
        >
          <Feather name="log-out" size={20} color={theme.error} />
          <ThemedText type="bodyLarge" style={{ color: theme.error }}>
            Sign Out
          </ThemedText>
        </Pressable>
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
    gap: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageTitle: {
    fontWeight: '700',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.large,
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
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  balanceCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.large,
  },
  balanceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    marginBottom: Spacing.xs,
    opacity: 0.9,
  },
  balanceAmount: {
    fontWeight: '700',
  },
  balanceIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    gap: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontWeight: '600',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  servicesScroll: {
    gap: Spacing.md,
    paddingRight: Spacing.lg,
  },
  serviceCard: {
    width: 110,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.medium,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  serviceIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceTitle: {
    textAlign: 'center',
    fontWeight: '500',
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
  statsSection: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    gap: Spacing.sm,
  },
  statNumber: {
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
  },
});
