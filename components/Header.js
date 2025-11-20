import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useTheme } from '../hooks/useTheme';
import { Spacing } from '../theme/global';

export function Header({ userData, onSettingsPress, onFavoritePress, onNotificationsPress }) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.leftText}>
          <ThemedText style={styles.captionText}>
            👍 Sidi Find{' '}
            <ThemedText style={[styles.badgeText, { backgroundColor: theme.primary }]}>
              the best
            </ThemedText>{' '}
            for your holiday
          </ThemedText>
        </View>
        <View style={styles.rightIcons}>
          <Pressable onPress={onNotificationsPress} style={styles.iconButton}>
            <Feather name="bell" size={24} color={theme.textPrimary} />
          </Pressable>
        </View>
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
  },
  captionText: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 34,
  },
  badgeText: {
    fontSize: 26,
    color: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontWeight: '700',
  },
  leftText: {
    flex: 1,
    flexDirection: 'row',
  },
  rightIcons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  iconButton: {
    padding: Spacing.xs,
  },
});
