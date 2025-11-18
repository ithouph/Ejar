import React from 'react';
import { StyleSheet, ScrollView, View, Pressable, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { Spacing, BorderRadius } from '../theme/global';
import { userData } from '../data/userData';

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

  const services = [
    { icon: 'calendar', title: 'Bookings' },
    { icon: 'credit-card', title: 'Payments' },
    { icon: 'gift', title: 'Rewards' },
    { icon: 'file-text', title: 'Documents' },
    { icon: 'settings', title: 'Settings' },
    { icon: 'help-circle', title: 'Help' },
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
          style={[styles.profileCard, { backgroundColor: theme.surface }]}
        >
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
              <ThemedText
                type="h1"
                lightColor="#FFF"
                darkColor="#FFF"
                style={styles.balanceAmount}
              >
                $2,850.00
              </ThemedText>
            </View>
            <View style={styles.balanceIcon}>
              <Feather name="dollar-sign" size={32} color="#FFF" />
            </View>
          </View>
        </Pressable>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="h2">Services Categories</ThemedText>
            <Pressable>
              <ThemedText type="bodySmall" style={{ color: theme.primary }}>
                View all
              </ThemedText>
            </Pressable>
          </View>

          <View style={styles.servicesGrid}>
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                theme={theme}
                onPress={() => {}}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h2" style={styles.sectionTitle}>
            Quick Actions
          </ThemedText>

          <Pressable
            style={[styles.actionItem, { backgroundColor: theme.surface }]}
            onPress={() => {}}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, { backgroundColor: theme.primary + '15' }]}>
                <Feather name="edit-3" size={20} color={theme.primary} />
              </View>
              <ThemedText type="bodyLarge">Edit Profile</ThemedText>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </Pressable>

          <Pressable
            style={[styles.actionItem, { backgroundColor: theme.surface }]}
            onPress={() => navigation.navigate('Review')}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, { backgroundColor: theme.primary + '15' }]}>
                <Feather name="star" size={20} color={theme.primary} />
              </View>
              <ThemedText type="bodyLarge">My Reviews</ThemedText>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </Pressable>

          <Pressable
            style={[styles.actionItem, { backgroundColor: theme.surface }]}
            onPress={() => {}}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, { backgroundColor: theme.primary + '15' }]}>
                <Feather name="bell" size={20} color={theme.primary} />
              </View>
              <ThemedText type="bodyLarge">Notifications</ThemedText>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </Pressable>
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
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  serviceCard: {
    width: '31%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
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
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
