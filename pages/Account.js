import React from 'react';
import { StyleSheet, ScrollView, View, Pressable, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { Spacing, BorderRadius } from '../theme/global';
import { userData } from '../data/userData';

function ActionCard({ icon, title, subtitle, onPress, theme }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.actionCard, { backgroundColor: theme.surface }]}
    >
      <View style={[styles.actionIconContainer, { backgroundColor: theme.primary + '15' }]}>
        <Feather name={icon} size={24} color={theme.primary} />
      </View>
      <View style={styles.actionContent}>
        <ThemedText type="bodyLarge" style={styles.actionTitle}>
          {title}
        </ThemedText>
        <ThemedText type="caption" style={{ color: theme.textSecondary }}>
          {subtitle}
        </ThemedText>
      </View>
    </Pressable>
  );
}

export default function Account({ navigation }) {
  const { theme } = useTheme();
  const insets = useScreenInsets();

  const actions = [
    {
      icon: 'calendar',
      title: 'My Bookings',
      subtitle: 'View reservations',
    },
    {
      icon: 'edit-3',
      title: 'Edit Profile',
      subtitle: 'Update info',
    },
    {
      icon: 'credit-card',
      title: 'Payment Methods',
      subtitle: 'Cards, wallets',
    },
    {
      icon: 'gift',
      title: 'Rewards',
      subtitle: 'Points, offers',
    },
    {
      icon: 'file-text',
      title: 'Documents',
      subtitle: 'ID, passport',
    },
    {
      icon: 'settings',
      title: 'Preferences',
      subtitle: 'Travel settings',
    },
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
          <View style={styles.profileSection}>
            <Image
              source={{ uri: userData.profile.photo }}
              style={styles.profilePhoto}
            />
            <View style={styles.profileInfo}>
              <ThemedText type="h2" style={styles.profileName}>
                {userData.profile.fullName}
              </ThemedText>
              <ThemedText type="bodySmall" style={{ color: theme.textSecondary }}>
                {userData.profile.email}
              </ThemedText>
            </View>
          </View>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.closeButton}
          >
            <Feather name="x" size={24} color={theme.textPrimary} />
          </Pressable>
        </View>

        <Pressable
          onPress={() => navigation.navigate('Balance')}
          style={[styles.balanceCard, { backgroundColor: theme.primary }]}
        >
          <View style={styles.balanceHeader}>
            <View>
              <ThemedText
                type="caption"
                lightColor="#FFF"
                darkColor="#FFF"
                style={styles.balanceLabel}
              >
                Total Balance
              </ThemedText>
              <ThemedText
                type="display"
                lightColor="#FFF"
                darkColor="#FFF"
                style={styles.balanceAmount}
              >
                $2,850.00
              </ThemedText>
            </View>
            <View style={styles.walletIcon}>
              <Feather name="dollar-sign" size={28} color="#FFF" />
            </View>
          </View>
          
          <View style={styles.balanceFooter}>
            <View style={styles.balanceItem}>
              <Feather name="trending-up" size={16} color="#FFF" />
              <ThemedText type="caption" lightColor="#FFF" darkColor="#FFF">
                Earned: $450
              </ThemedText>
            </View>
            <View style={styles.balanceItem}>
              <Feather name="clock" size={16} color="#FFF" />
              <ThemedText type="caption" lightColor="#FFF" darkColor="#FFF">
                Pending: $120
              </ThemedText>
            </View>
          </View>
        </Pressable>

        <View style={styles.quickActions}>
          <Pressable
            style={[styles.quickActionButton, { backgroundColor: theme.surface }]}
          >
            <Feather name="plus-circle" size={20} color={theme.primary} />
            <ThemedText type="bodySmall" style={{ color: theme.primary }}>
              Add Funds
            </ThemedText>
          </Pressable>
          <Pressable
            style={[styles.quickActionButton, { backgroundColor: theme.surface }]}
          >
            <Feather name="send" size={20} color={theme.primary} />
            <ThemedText type="bodySmall" style={{ color: theme.primary }}>
              Transfer
            </ThemedText>
          </Pressable>
          <Pressable
            style={[styles.quickActionButton, { backgroundColor: theme.surface }]}
          >
            <Feather name="download" size={20} color={theme.primary} />
            <ThemedText type="bodySmall" style={{ color: theme.primary }}>
              Withdraw
            </ThemedText>
          </Pressable>
        </View>

        <View style={styles.section}>
          <ThemedText type="h2" style={styles.sectionTitle}>
            Account Services
          </ThemedText>
          
          <View style={styles.actionsGrid}>
            {actions.map((action, index) => (
              <ActionCard
                key={index}
                icon={action.icon}
                title={action.title}
                subtitle={action.subtitle}
                theme={theme}
                onPress={() => {}}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h2" style={styles.sectionTitle}>
            Statistics
          </ThemedText>
          
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
              <Feather name="map-pin" size={24} color={theme.primary} />
              <ThemedText type="h1" style={styles.statNumber}>
                12
              </ThemedText>
              <ThemedText type="bodySmall" style={{ color: theme.textSecondary }}>
                Places Visited
              </ThemedText>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
              <Feather name="star" size={24} color={theme.primary} />
              <ThemedText type="h1" style={styles.statNumber}>
                8
              </ThemedText>
              <ThemedText type="bodySmall" style={{ color: theme.textSecondary }}>
                Reviews Written
              </ThemedText>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
              <Feather name="award" size={24} color={theme.primary} />
              <ThemedText type="h1" style={styles.statNumber}>
                Gold
              </ThemedText>
              <ThemedText type="bodySmall" style={{ color: theme.textSecondary }}>
                Member Status
              </ThemedText>
            </View>
          </View>
        </View>

        <Pressable
          style={[styles.logoutButton, { backgroundColor: theme.surface }]}
          onPress={() => {}}
        >
          <Feather name="log-out" size={20} color={theme.error} />
          <ThemedText type="body" style={{ color: theme.error }}>
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
    alignItems: 'flex-start',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  profilePhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.large,
    gap: Spacing.xl,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  balanceLabel: {
    opacity: 0.9,
    marginBottom: Spacing.xs,
  },
  balanceAmount: {
    fontWeight: '700',
  },
  walletIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceFooter: {
    flexDirection: 'row',
    gap: Spacing.xl,
  },
  balanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  actionsGrid: {
    gap: Spacing.md,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    gap: Spacing.md,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  statsContainer: {
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
