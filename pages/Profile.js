import React from 'react';
import { StyleSheet, ScrollView, View, Pressable, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { Spacing, BorderRadius } from '../theme/global';
import { userData } from '../data/userData';

function SettingsItem({ icon, title, onPress, showChevron = true }) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.settingsItem, { backgroundColor: theme.surface }]}
    >
      <View style={styles.settingsLeft}>
        <Feather name={icon} size={20} color={theme.textPrimary} />
        <ThemedText type="body">{title}</ThemedText>
      </View>
      {showChevron && (
        <Feather name="chevron-right" size={20} color={theme.textSecondary} />
      )}
    </Pressable>
  );
}

export default function Profile({ navigation }) {
  const { theme } = useTheme();
  const insets = useScreenInsets();

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
          onPress={() => navigation.navigate('Account')}
          style={[styles.profileCard, { backgroundColor: theme.surface }]}
        >
          <Image
            source={{ uri: userData.profile.photo }}
            style={styles.profilePhoto}
          />
          <View style={styles.profileInfo}>
            <ThemedText type="bodyLarge" style={styles.profileName}>
              {userData.profile.fullName}
            </ThemedText>
            <ThemedText type="bodySmall" style={{ color: theme.textSecondary }}>
              {userData.profile.email}
            </ThemedText>
          </View>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </Pressable>

        <View style={styles.section}>
          <SettingsItem
            icon="star"
            title="My Reviews"
            onPress={() => navigation.navigate('Review')}
          />
          <SettingsItem
            icon="bell"
            title="Notification Preferences"
            onPress={() => {}}
          />
          <SettingsItem
            icon="help-circle"
            title="Help & Support"
            onPress={() => navigation.navigate('Support')}
          />
          <SettingsItem
            icon="file-text"
            title="Terms of Service"
            onPress={() => {}}
          />
          <SettingsItem
            icon="shield"
            title="Privacy Policy"
            onPress={() => {}}
            showChevron={false}
          />
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
  section: {
    gap: Spacing.md,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
});
