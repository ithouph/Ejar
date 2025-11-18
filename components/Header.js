import React from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius } from '../theme/global';

export function Header({ userData, onSettingsPress, onFavoritePress, onNotificationsPress }) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable onPress={onSettingsPress}>
          <Feather name="settings" size={24} color={theme.textPrimary} />
        </Pressable>
        <View style={styles.badge}>
          <ThemedText type="caption" style={styles.badgeText}>
            {userData.daysToGo} days to go
          </ThemedText>
        </View>
        <View style={styles.rightIcons}>
          <Pressable onPress={onFavoritePress} style={styles.iconButton}>
            <Feather name="heart" size={24} color={theme.textPrimary} />
          </Pressable>
          <Pressable onPress={onNotificationsPress} style={styles.iconButton}>
            <Feather name="bell" size={24} color={theme.textPrimary} />
          </Pressable>
        </View>
      </View>
      <View style={styles.coupleSection}>
        <View style={styles.textSection}>
          <ThemedText type="h1" style={styles.coupleName}>
            {userData.name}
          </ThemedText>
          <View style={styles.detailRow}>
            <Feather name="calendar" size={16} color={theme.textSecondary} />
            <ThemedText type="bodySmall" style={{ color: theme.textSecondary }}>
              {userData.eventDate}
            </ThemedText>
          </View>
          <View style={styles.detailRow}>
            <Feather name="map-pin" size={16} color={theme.textSecondary} />
            <ThemedText type="bodySmall" style={{ color: theme.textSecondary }}>
              {userData.eventLocation}
            </ThemedText>
          </View>
        </View>
        <Image
          source={{ uri: userData.couplePhoto }}
          style={styles.couplePhoto}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: '#F3F4F6',
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    fontWeight: '600',
    color: '#111827',
  },
  rightIcons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  iconButton: {
    padding: Spacing.xs,
  },
  coupleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textSection: {
    flex: 1,
    gap: Spacing.xs,
  },
  coupleName: {
    fontWeight: '700',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  couplePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});
